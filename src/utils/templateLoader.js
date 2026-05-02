const fs = require("fs");
const path = require("path");

function loadTemplate(filename, variables = {}) {
  const filePath = path.join(
    __dirname,
    "..",
    "templates",
    filename
  );

  let html = fs.readFileSync(filePath, "utf8");

  Object.entries(variables).forEach(([key, value]) => {
    html = html.replaceAll(`{{${key}}}`, value);
  });

  return html;
}

module.exports = loadTemplate;