export const showDialog_ = (fileName: string, title: string) => {
  const html = HtmlService.createHtmlOutputFromFile(fileName)
    .setWidth(400)
    .setHeight(300);

  SpreadsheetApp.getUi().showModalDialog(html, title);
};
