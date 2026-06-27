export const showDialog_ = (fileName: string, title: string) => {
  const html = HtmlService.createHtmlOutputFromFile(fileName)
    .setWidth(400)
    .setHeight(300);

  DocumentApp.getUi().showModalDialog(html, title);
};
