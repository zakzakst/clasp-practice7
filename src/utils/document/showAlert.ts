export const showAlert_ = (message: string) => {
  const ui = DocumentApp.getUi();
  ui.alert(message);
};
