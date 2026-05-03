const express = require("express");
const router = express.Router();
const { submitForm, verifyEmail } = require("../controllers/contactController");

const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post("/submit", wrap(submitForm));
router.get("/verify", wrap(verifyEmail));
module.exports = router;