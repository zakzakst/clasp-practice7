export const replaceLinkText_ = (
  targetText: string,
  text: string,
  url: string,
) => {
  const body = DocumentApp.getActiveDocument().getBody();

  // 置換対象テキスト検索
  const found = body.findText(targetText);

  if (!found) {
    return;
  }

  // テキスト要素取得
  const textElement = found.getElement().asText();

  // 開始・終了位置
  const start = found.getStartOffset();
  const end = found.getEndOffsetInclusive();

  // 置換対象テキスト削除
  textElement.deleteText(start, end);

  // テキスト挿入
  textElement.insertText(start, text);

  // リンク設定
  textElement.setLinkUrl(start, start + text.length - 1, url);
};
