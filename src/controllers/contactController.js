require("dotenv").config();
const {
  appendRow,
  getSheetValues,
  markEmailVerified,
  findEmailStatus } = require("../services/sheetsService");

const { generateToken, verifyToken } = require("../services/tokenService");

const { sendVerificationEmail } = require("../services/emailService");
const { isValidEmail, isValidPhone } = require("../utils/validators");
const { clean } = require("../utils/sanitizer");
const loadTemplate = require("../utils/templateLoader");

// simple in-memory rate limit (replace with Redis later if needed)
const rateMap = new Map();

function isRateLimited(email) {
  const key = email.replace(/[^a-zA-Z0-9]/g, "_");
  const count = rateMap.get(key) || 0;

  if (count >= 5) return true;

  rateMap.set(key, count + 1);
  setTimeout(() => rateMap.delete(key), 3600 * 1000);

  return false;
}

function respond(status, message) {
  return { status, message };
}

/* ---------------- CONTACT ---------------- */
async function handleContact(data) {
  if (!data.email || !isValidEmail(data.email)) {
    return respond("error", "Invalid email");
  }

  if (data.phone && !isValidPhone(data.phone)) {
    return respond("error", "Invalid phone");
  }

  const emailStatus = await findEmailStatus(
    "ContactUsForm",
    data.email
  );

  const timestamp = new Date()
    .toISOString()
    .split(".")[0]
    .replace("T", " ");

  /*
    CASE 1:
    email exists but NOT verified
    -> resend verification
  */
  if (emailStatus.exists && !emailStatus.verified) {
    const token = generateToken(data.email);

    try {
      await sendVerificationEmail(
        data.email,
        token
      );
    } catch (err) {
      console.error(err);
    }

    return respond(
      "success",
      "Request processed"
    );
  }

  /*
    CASE 2:
    email exists + already verified
    -> append directly verified=true
  */
  if (emailStatus.exists && emailStatus.verified) {
    await appendRow("ContactUsForm", [
      timestamp,
      clean(data.name),
      clean(data.email),
      clean(data.phone),
      clean(data.requestType),
      clean(data.message),
      "contact",
      "true",
      timestamp
    ]);

    return respond(
      "success",
      "Request processed"
    );
  }

  /*
    CASE 3:
    new email
    -> create unverified + send email
  */
  await appendRow("ContactUsForm", [
    timestamp,
    clean(data.name),
    clean(data.email),
    clean(data.phone),
    clean(data.requestType),
    clean(data.message),
    "contact",
    "false",
    ""
  ]);

  const token = generateToken(data.email);

  try {
    await sendVerificationEmail(
      data.email,
      token
    );
  } catch (err) {
    console.error(err);
  }

  return respond(
    "success",
    "Request processed"
  );
}

/* ---------------- NEWSLETTER ---------------- */
async function handleNewsletter(data) {
  if (!data.email || !isValidEmail(data.email)) {
    return respond("error", "Invalid email");
  }

  const rows = await getSheetValues("NewsLetters");

  const alreadySubscribed = rows.some((r) => r[1] === data.email);

  if (alreadySubscribed) {
    return respond("error", "Already subscribed");
  }

  await appendRow("NewsLetters", [
    new Date(),
    clean(data.email),
    "newsletter",
  ]);

  return respond("success", "Subscribed");
}

/* ---------------- SIMULATOR ---------------- */
async function handleSimulator(data) {
  await appendRow("simulations", [
    new Date(),
    clean(data.selectedHouse),
    clean(data.locationValue),
    Number(data.surface) || 0,
    clean(data.selectedEnergy),
    Number(data.selectedPeople) || 0,
    clean(data.selectedProvider),
    Number(data.bill) || 0,
    Number(data.electricityValueKwh) || 0,
    Number(data.gasValueKwh) || 0,
    Number(data.monthlySavings) || 0,
    "simulator",
  ]);

  return respond("success", "Simulation registered");
}


/* ---------------- MAIN ROUTER ---------------- */
async function submitForm(req, res) {
  const data = req.body;

  if (!data || !data.formType) {
    return res.json(respond("error", "Invalid data"));
  }

  if (data.email && isRateLimited(data.email)) {
    return res.json(respond("error", "Too many requests"));
  }

  switch (data.formType) {
    case "contact":
      return res.json(await handleContact(data));

    case "newsletter":
      return res.json(await handleNewsletter(data));

    case "simulator":
      return res.json(await handleSimulator(data));

    default:
      return res.json(respond("error", "Invalid form type"));
  }
}

/* ---------------- VERIFY EMAIL ROUTER ---------------- */
async function verifyEmail(req, res) {
  const { token } = req.query;

  const result = verifyToken(token);

  if (!result) {
    const html = loadTemplate(
      "verify-error.html",
      {
        APP_URL: process.env.APP_URL
      }
    );

    return res.status(400).send(html);
  }

  try {
    await markEmailVerified(
      process.env.SHEET_NAME_CONTACT,
      result.email
    );
  } catch (err) {
    console.error(err);
  }

  const html = loadTemplate(
    "verify-success.html",
    {
      APP_URL: process.env.APP_URL
    }
  );

  return res.send(html);
}

module.exports = { submitForm, verifyEmail };