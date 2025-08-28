const SHEET_ID = "1FW8hF5_YMgHHbVL7Z_B3w10t-ZajHxZESnkBSMYzC4U";
const SHEET_NAME = "run2025";
const DRIVE_FOLDER_ID = "1NruMNRvMxuerl3O1X7XiQz07emthS6aN";

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle("SFSport club Run Challenge 2025")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Saves the run data and the image to Google Sheets and Google Drive.
 * @param {object} formObject The form data object from the client-side.
 * @returns {object} The status and result of the operation.
 */
function saveData(formObject) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    // Upload the file to Google Drive
    let fileUrl = "";
    if (formObject.fileData) {
      const contentType = formObject.fileData.match(/^data:(.*);base64,/)[1];
      const bytes = Utilities.base64Decode(formObject.fileData.split(',')[1]);
      const blob = Utilities.newBlob(bytes, contentType, formObject.fileName);
      
      const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
      const file = folder.createFile(blob);
      fileUrl = file.getUrl();
    }
    
    // Write data to Google Sheet
    sheet.appendRow([
      new Date(), // Timestamp
      formObject.team,
      formObject.name,
      formObject.date,
      formObject.distance,
      fileUrl,
      formObject.note
    ]);

    // Return a generic success message
    return { status: "success", message: "บันทึกข้อมูลเรียบร้อยครับ" };
  } catch (err) {
    return { status: "error", message: err.toString() };
  }
}
