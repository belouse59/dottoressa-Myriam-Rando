const sheets = require("../config/google");

const SPREADSHEET_ID = process.env.SHEET_ID;

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

async function markEmailVerified(sheetName, email) {
  const rows = await getSheetValues(sheetName);

  const rowIndex = rows.findIndex(
    (row, index) =>
      index > 0 && row[2] === email
  );

  if (rowIndex === -1) {
    throw new Error("Email not found");
  }

  const actualRow = rowIndex + 1;

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.SHEET_ID,
    range: `${sheetName}!H${actualRow}:I${actualRow}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[
        "true",
        new Date().toISOString().split(".")[0].replace("T", " ")
      ]]
    }
  });
  
}

async function findEmailStatus(sheetName, email) {
  const rows = await getSheetValues(sheetName);

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];

    const rowEmail = row[2];
    const verified = row[7];

    if (rowEmail === email) {
      return {
        exists: true,
        verified: verified === "true" || verified === "TRUE"
      };
    }
  }

  return {
    exists: false,
    verified: false
  };
}

module.exports = {
  appendRow,
  getSheetValues,
  markEmailVerified,
  findEmailStatus
};