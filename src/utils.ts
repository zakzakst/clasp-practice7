/**
 * HTMLテンプレートから別HTMLファイルの中身を取り込む（styles/app 用）。
 * @param filename HTMLファイル名
 * @returns ファイルの中身
 */
const include = (filename: string): string => {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
};
