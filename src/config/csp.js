// src/config/csp.js

const CSP_CONFIG = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],

      scriptSrc: [
        "'self'",
        "https://cdnjs.cloudflare.com"
      ],

      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com"
      ],

      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdnjs.cloudflare.com",
        "data:"
      ],

      imgSrc: [
        "'self'",
        "data:",
        "https://maps.gstatic.com",
        "https://maps.googleapis.com",
      ],

      connectSrc: [
        "'self'",
        "https://maps.googleapis.com",
      ],

      frameSrc: [
        "'self'",
        "https://www.google.com"
      ],

      objectSrc: ["'none'"],

      upgradeInsecureRequests: []
    }
  }
};

module.exports = CSP_CONFIG;