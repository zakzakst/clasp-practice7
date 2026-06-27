## Plan: 食べたものメモアプリ実装

TL;DR: 既存 GAS スプレッドシートプロジェクトに、入力フォームと週次グラフを表示する HTML サイドバーを追加する。`src/index.ts` に GAS サーバー処理を実装し、`src/html/food-log.html` で入力ページと週次ログを切り替える UI を作る。`build.mjs` は HTML ファイルを dist にコピーするよう更新する。

**Steps**
1. `src/index.ts` を実装
   - `onOpen` で「食べたものメモ」メニューを追加
   - `openFoodLogSidebar` で `food-log.html` を開く
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

4. 既存ユーティリティとの整合性確認
   - `src/utils/spreadsheet/getSheetData.ts` を必要に応じて再利用できるが、直接 `src/index.ts` にシート処理を実装してもよい
   - `appsscript.json` の設定はそのまま利用する

**Verification**
1. `npm run build` でエラーなしを確認
2. `npm run push` で GAS にデプロイし、スプレッドシートを開く
3. スプレッドシートのメニューに「食べたものメモ」が表示されること
4. 入力フォームでデータ登録し、シートに正しい行が追加されること
5. 週次ログタブを開いてグラフが描画されること

**Decisions**
- 実装対象はスプレッドシートから開くサイドバー形式とする
- データ保存先シート名は `食べたものメモ` に固定する
- 週次ログは直近7日間の日別合計をクライアントでチャート化する

**Further Considerations**
1. WebApp として公開する必要があれば、`doGet` ベースの実装に変更する
2. UI を単一ページでタブ切り替えとするか、入力とログを別ダイアログに分けるか
3. シートIDを固定する場合は `_.env` の `SHEET_ID` を利用する方が良いが、今回は `SpreadsheetApp.getActiveSpreadsheet()` を優先する
