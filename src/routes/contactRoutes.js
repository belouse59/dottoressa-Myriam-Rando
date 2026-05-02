const express = require("express");
const router = express.Router();
const { submitForm, verifyEmail } = require("../controllers/contactController");

router.post("/submit", submitForm);
router.get("/verify", verifyEmail);

module.exports = router;