/**
 * このウェブアプリの公開URLを返す。
 * @returns 公開 URL
 */
export const getWebAppUrl_ = (): string => {
  return ScriptApp.getService().getUrl();
};
