
require("dotenv").config();
const app = require("./app");
const PORT = process.env.PORT || 3001;
const required = [
  "ALLOWED_ORIGIN",
  "APP_URL",
  "TOKEN_SECRET",
  "BRAND_NAME",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "SHEET_ID",
  "SHEET_NAME_CONTACT",
  "GOOGLE_SERVICE_ACCOUNT",
];

required.forEach(key => {
  if (!process.env[key]) {
    throw new Error(`Missing required env variable: ${key}`);
  }
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on ${APP_URL}:${PORT}`);
});
