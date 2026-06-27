export const showAlert_ = (message: string) => {
  const ui = SpreadsheetApp.getUi();
  ui.alert(message);
};
