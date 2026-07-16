function doPost(e) {
  const type = (e.parameter.type || "course").trim(); // "course" or "lab"
  
  // Determine sheet name based on type
  const sheetName = type === "lab" ? "LAB" : "CURS";
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  
  if (!sheet) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: "Sheet not found: " + sheetName })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  let rawName = (e.parameter.name || "").trim();
  let upperName = rawName.toUpperCase();

  // Remove all unwanted characters (only letters, spaces, dashes, apostrophes)
  upperName = upperName.replace(/[^A-ZĂÂÎȘȚÁÉÍÓÖŐÚÜŰ \-']/g, "");

  // Enforce first character must be a letter
  upperName = upperName.replace(/^[^A-ZĂÂÎȘȚÁÉÍÓÖŐÚÜŰ]+/, "");

  // Current date and time
  const now = new Date();
  const timeZone = "Europe/Bucharest";
  const dateOnly = Utilities.formatDate(now, timeZone, "yyyy/MM/dd");

  sheet.appendRow([upperName, now, dateOnly + (type === "lab" ? "L" : "C")]);

  return ContentService.createTextOutput(
    "TE-AM TRECUT PREZENT: " + upperName
  ).setMimeType(ContentService.MimeType.TEXT);
}

function doGet(e) {
  const type = (e.parameter.type || "course").trim(); // "course" or "lab"
  
  // Determine sheet name based on type
  const sheetName = type === "lab" ? "LAB" : "CURS";
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: "Sheet not found: " + sheetName })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const data = sheet.getDataRange().getValues();
  const headerOffset = 1;
  const timeZone = "Europe/Bucharest";

  const mapped = data
    .slice(headerOffset)
    .map((r) => {
      const name = String(r[0] || "").trim();
      const ts = r[1] instanceof Date ? r[1] : new Date(r[1]);
      const dateCell = r[2];
      // Strip trailing letter (e.g., "L" or "C") before parsing
      const cleanDateCell = typeof dateCell === "string" ? dateCell.replace(/[a-zA-Z]$/, "") : dateCell;
      const dateOnly = cleanDateCell
        ? Utilities.formatDate(new Date(cleanDateCell), timeZone, "yyyy/MM/dd")
        : Utilities.formatDate(ts, timeZone, "yyyy/MM/dd");
      return { name, ts, dateOnly };
    })
    .filter((r) => r.name);

  const dates = Array.from(new Set(mapped.map((r) => r.dateOnly))).sort();
  const names = Array.from(new Set(mapped.map((r) => r.name))).sort((a, b) =>
    a.localeCompare(b, "ro")
  );

  const table = names.map((name) => {
    const rec = { name };
    dates.forEach((d) => {
      rec[d] = mapped.some((r) => r.name === name && r.dateOnly === d)
        ? "✓"
        : "";
    });
    return rec;
  });

  const result = { dates, data: table };
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
    ContentService.MimeType.JSON
  );
}