export type MenuItem = {
  label: string;
  name: string;
};

export const menuInit_ = (items: MenuItem[]) => {
  const menu = SpreadsheetApp.getUi().createMenu("メニュー");
  items.forEach((item) => {
    menu.addItem(item.label, item.name);
  });
  menu.addToUi();
};
