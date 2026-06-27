## Plan: 食べたものメモアプリ実装

TL;DR: 既存 GAS プロジェクトを WebApp として公開し、入力フォームと週次グラフを単一 HTML ページで提供する。`src/index.ts` に `doGet` を実装して `src/html/food-log.html` を返し、WebApp で直接利用できる UI にする。`build.mjs` は HTML ファイルを `dist/html` にコピーするよう更新する。

**Steps**
1. `src/index.ts` を実装
   - `doGet` で `food-log.html` を返す
   - `appendFoodLog` でスプレッドシートに新しい行を追加
   - `getWeeklyCalories` で直近7日分の日別合計を計算して返す
   - `getFoodLogSheet_` でシート名を固定して存在しない場合は作成

2. `src/html/food-log.html` を作成
   - 食べたものの名前、日付、カロリー入力フォーム
   - 送信時に `google.script.run.appendFoodLog` を呼び出す
   - 週次ログ表示エリアとグラフ領域を用意
   - Google Charts を使い、取得したデータを日にち別の棒グラフで描画
   - ページロード時に週次データを取得して描画
   - 入力ページと週次ログの切り替えタブ/セクションを実装

3. `build.mjs` を更新
   - `src/html` を `dist/html` にコピーする処理を有効化
   - `npm run build && npm run push` で HTML とスクリプトを正しくデプロイ可能にする

4. WebApp公開用の設定確認
   - `appsscript.json` に `executionApi` や `webapp` の必要な設定があれば追記する
   - 公開用 URL を取得し、デプロイ後のアクセスを確認する

5. 既存ユーティリティとの整合性確認
   - `src/utils/spreadsheet/getSheetData.ts` を必要に応じて再利用できるが、直接 `src/index.ts` にシート処理を実装してもよい
   - `appsscript.json` の設定はそのまま利用する

**Verification**
1. `npm run build` でエラーなしを確認
2. `npm run push` で GAS にデプロイし、WebApp URL にアクセスする
3. 入力フォームが表示されること
4. フォーム送信でシートに正しい行が追加されること
5. 週次ログでグラフが描画されること

**Decisions**
- 実装対象は WebApp として公開する
- データ保存先シート名は `食べたものメモ` に固定する
- 週次ログは直近7日間の日別合計をクライアントでチャート化する

**Further Considerations**
1. WebApp 公開時のアクセス制御を検討する（全員公開 / Googleアカウント制限など）
2. UI を単一ページでタブ切り替えとするか、入力とログを別セクションに分けるか
3. シートIDを固定する場合は `_.env` の `SHEET_ID` を利用する方が良いが、今回は `SpreadsheetApp.getActiveSpreadsheet()` を優先する
