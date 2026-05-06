const sheets = require("../config/google");
const { getLocalTimestamp } = require("../utils/dateFormat");

const SPREADSHEET_ID = process.env.SHEET_ID;

/* ---------------- BASIC HELPERS ---------------- */

async function appendRow(sheetName, values) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:Z`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [values],
    },
  });
}

async function getSheetValues(sheetName) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:Z`,
  });

  return res.data.values || [];
}

/* ---------------- HEADER MAPPING ---------------- */

async function getHeaderMap(sheetName) {
  const rows = await getSheetValues(sheetName);

  if (!rows.length) {
    throw new Error(`Sheet "${sheetName}" is empty`);
  }

  const headers = rows[0];

  const headerMap = {};

  headers.forEach((header, index) => {
    headerMap[header.trim()] = index;
  });

  return headerMap;
}

/* ---------------- EMAIL VERIFICATION ---------------- */

async function markEmailVerified(sheetName, email) {
  const rows = await getSheetValues(sheetName);
  const headerMap = await getHeaderMap(sheetName);

  const emailIndex = headerMap["Email"];
  const verifiedIndex = headerMap["Verificato"];
  const verifiedDateIndex = headerMap["Data e ora di verifica"];

  if (
    emailIndex === undefined ||
    verifiedIndex === undefined ||
    verifiedDateIndex === undefined
  ) {
    throw new Error("Required headers not found");
  }

  const rowIndex = rows.findIndex(
    (row, index) => index > 0 && row[emailIndex] === email
  );

  if (rowIndex === -1) {
    return false;
  }

  const actualRow = rowIndex + 1;

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!${columnToLetter(verifiedIndex + 1)}${actualRow}:${columnToLetter(verifiedDateIndex + 1)}${actualRow}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[
        "true",
        getLocalTimestamp()
      ]]
    }
  });

  return true;
}

/* ---------------- EMAIL STATUS ---------------- */

async function findEmailStatus(sheetName, email) {
  const rows = await getSheetValues(sheetName);
  const headerMap = await getHeaderMap(sheetName);

  const emailIndex = headerMap["Email"];
  const verifiedIndex = headerMap["Verificato"];

  if (emailIndex === undefined || verifiedIndex === undefined) {
    throw new Error("Required headers not found");
  }

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];

    if (row[emailIndex] === email) {
      return {
        exists: true,
        verified:
          row[verifiedIndex] === "true" ||
          row[verifiedIndex] === "TRUE"
      };
    }
  }

  return {
    exists: false,
    verified: false
  };
}

/* ---------------- UTIL ---------------- */

function columnToLetter(column) {
  let temp = "";
  let letter = "";

  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }

  return letter;
}

module.exports = {
  appendRow,
  getSheetValues,
  markEmailVerified,
  findEmailStatus,
  getHeaderMap
};
