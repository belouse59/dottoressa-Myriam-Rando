import { google } from "googleapis";

export default async function handler(req, res) {

  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, phone, message } = req.body;

    // 🛑 Basic validation
    if (!name || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🛡️ Honeypot anti-spam (if you add hidden field later)
    if (req.body.company) {
      return res.status(200).json({ status: "ignored" });
    }

    // 🔐 Google Auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // 📊 Append row
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:D",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          new Date().toLocaleString(),
          name,
          phone,
          message || ""
        ]]
      }
    });

    return res.status(200).json({
      status: "success",
      message: "Message saved"
    });

  } catch (error) {
    console.error("API ERROR:", error);

    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
}