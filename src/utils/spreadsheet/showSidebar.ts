export const showSidebar_ = (fileName: string, title: string) => {
  const html = HtmlService.createHtmlOutputFromFile(fileName).setTitle(title);

  SpreadsheetApp.getUi().showSidebar(html);
};
