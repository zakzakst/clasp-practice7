# clasp-template

## TODO

- もうちょっとbuild工夫したい
  - jsファイル複数
  - htmlファイルはコピーでなくejsとかxhtmlとか使う
- Advanced Google Servicesの利用試したい
- HtmlService.createHtmlOutputFromFileでテンプレート的な利用方法練習する

## アイデア

- リマインドメール送信
  - スプレッドシートに日付とメッセージを入力するGASをAPIから実行できるようにする（Chrome拡張機能からたたく想定）
  - 毎朝トリガー発火。スプレッドシートを確認して本日の日付のメッセージをメール送信
- HTTPリクエスト（API連携）
  - UrlFetchApp.fetch
- PropertiesService
  - 行データ表示の時の選択行の保持に利用できたかも

## GAS以外の機能

- 「@」を入力してスマートチップの挿入などできるので覚えておく
- 挿入 > 構成要素 > 会議メモ で参加者のチップをいい感じにリストアップしてくれる
- カスタムビルディングブロック使ってみる
  - https://support.google.com/docs/answer/13584759

## コマンドメモ

- `npx clasp login`
- `npx clasp clone スクリプトID`

## 済

- build上手くいかない
  - https://qiita.com/venect_qiita/items/5aa9666c32b80038ef52#対応の方針
    - ⇒ vite build使う？ https://github.com/WildH0g/apps-script-engine-template
- esbuild-gas-plugin試す
  - https://zenn.dev/funteractiveinc/articles/776b5812833475
  - ⇒ あまり変わらなかったので利用しない
- eventの主催者・参加者取得
  - ⇒ エラー出るので、一旦あきらめる
  - Advanced Google Servicesを利用すればできそうではあった
