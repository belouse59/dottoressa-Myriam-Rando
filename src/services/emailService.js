const { Resend } = require("resend");
const loadTemplate = require("../utils/templateLoader");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendVerificationEmail(email, token) {
  const verifyUrl =
    `${process.env.APP_URL}/api/contact/verify?token=${token}`;
  
  const html = loadTemplate(
  "verification-email.html",
  {
    VERIFY_URL: verifyUrl
  }
);

  return resend.emails.send({
    from: `${process.env.BRAND_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
    to: email,
    subject: "Conferma la tua richiesta",
    html 
  });
}

module.exports = {
  sendVerificationEmail
};