function doPost(e) {
  const course = (e.parameter.course || "1").trim(); // "1" or "2"
  const sheetName = course === "2" ? "OOP" : "GRAPH"; // Default to Sheet1, named GRAPH
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

  let rawName = (e.parameter.name || "").trim();
  let upperName = rawName.toUpperCase();

  sheet.appendRow([upperName, new Date()]);

  return ContentService
    .createTextOutput("TE-AM TRECUT PREZENT: " + upperName)
    .setMimeType(ContentService.MimeType.TEXT);
}