function clean(str) {
  return str
    ? String(str)
        .replace(/<[^>]*>/g, "")       // strip HTML
        .replace(/[\t\r\n]/g, " ")      // normalise whitespace
        .replace(/^[=+\-@\t\r]/, "'")  // block formula injection
        .trim()
    : "";
}

module.exports = { clean };