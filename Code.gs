function doPost(e) {
  const course = (e.parameter.course || "1").trim(); // "1" or "2"
  const sheetName = course === "2" ? "OOP" : "GRAPH"; // Default to Sheet1, named GRAPH

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

  let rawName = (e.parameter.name || "").trim();
  let upperName = rawName.toUpperCase();

  // Remove all unwanted characters (only letters, spaces, dashes, apostrophes)
  upperName = upperName.replace(/[^A-ZĂÂÎȘȚ \-']/g, "");

  // Enforce first character must be a letter (remove leading non-letters like '-' or space or apostrophe)
  upperName = upperName.replace(/^[^A-ZĂÂÎȘȚ]+/, "");

  // Current date and time
  const now = new Date();
  const timeZone = "Europe/Bucharest";
  // Extract date only (MM/dd/yyyy)
  const dateOnly = Utilities.formatDate(now, timeZone, "yyyy/MM/dd");

  sheet.appendRow([upperName, now, dateOnly]);

  return ContentService.createTextOutput(
    "TE-AM TRECUT PREZENT: " + upperName
  ).setMimeType(ContentService.MimeType.TEXT);
}

function doGet(e) {
  const course = (e.parameter.course || "1").trim(); // "1" or "2"
  const sheetName = course === "2" ? "OOP" : "GRAPH";
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: "Sheet not found" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const data = sheet.getDataRange().getValues(); // full sheet
  const headerOffset = 1;
  const timeZone = "Europe/Bucharest";

  // Normalize rows: name, timestamp (Date), dateOnly (string yyyy/MM/dd)
  const mapped = data
    .slice(headerOffset)
    .map((r) => {
      const name = String(r[0] || "").trim();
      // timestamp may be Date or string; ensure Date
      const ts = r[1] instanceof Date ? r[1] : new Date(r[1]);
      // prefer DATEONLY column if present, otherwise build from timestamp
      const dateCell = r[2];
      const dateOnly = dateCell
        ? Utilities.formatDate(new Date(dateCell), timeZone, "yyyy/MM/dd")
        : Utilities.formatDate(ts, timeZone, "yyyy/MM/dd");
      return { name, ts, dateOnly };
    })
    .filter((r) => r.name); // drop empty-name rows

  // Unique sorted dates (strings) and names
  const dates = Array.from(new Set(mapped.map((r) => r.dateOnly))).sort();
  const names = Array.from(new Set(mapped.map((r) => r.name))).sort((a, b) =>
    a.localeCompare(b, "ro")
  );

  // Build matrix: each record has name and date columns with "✓" or ""
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
