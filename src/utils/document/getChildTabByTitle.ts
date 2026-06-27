import { showAlert_ } from "@document/showAlert";

type TabItem = {
  id: string;
  title: string;
};

export const getChildTabItemByTitle_ = (
  parentTitle: string,
  childTitle: string,
): TabItem | undefined => {
  const tabs = DocumentApp.getActiveDocument().getTabs();
  const templateTab = tabs.find((tab) => tab.getTitle() === parentTitle);

  if (!templateTab) {
    showAlert_("「テンプレート」タブが見つかりませんでした");
    return;
  }

  const agendaTab = templateTab
    .getChildTabs()
    .find((tab) => tab.getTitle() === childTitle);

  if (!agendaTab) {
    showAlert_("「議事録」タブが見つかりませんでした");
    return;
  }

  return {
    id: agendaTab.getId(),
    title: agendaTab.getTitle(),
  };
};
