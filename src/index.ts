/**
 * 食べたものメモの WebApp エントリポイント。
 * ビルド時に esbuild の define で _.env から SHEET_ID を注入します。
 */
import { formatDate_, parseDate_ } from "@app-script/getWebAppUrl";

type WeeklyCalories = { date: string; calories: number }[];

const SHEET_ID = process.env.SHEET_ID;
const SHEET_NAME = "食べたものメモ";
const HEADER_ROW = ["食べたもの", "日付", "カロリー"];

/**
 * シートの先頭行にヘッダが無ければ追加します。
 */
const ensureHeader_ = (sheet: GoogleAppsScript.Spreadsheet.Sheet): void => {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER_ROW);
  }
};

/**
 * 食べたものメモ用のシートを取得します。
 * シートが存在しなければ作成し、ヘッダを保証します。
 */
const getFoodLogSheet_ = (): GoogleAppsScript.Spreadsheet.Sheet => {
  if (!SHEET_ID) {
    throw new Error(
      "SHEET_ID が設定されていません。_.env にシートIDを追加してください。",
    );
  }
  const app = SpreadsheetApp.openById(SHEET_ID);
  let sheet = app.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = app.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADER_ROW);
  }

  ensureHeader_(sheet);
  return sheet;
};

/**
 * 直近7日分の日付をキーにしたマップを作成し、初期値を 0 にします。
 */
const createWeeklyMap_ = (): Map<string, number> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const map = new Map<string, number>();
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    map.set(formatDate_(date), 0);
  }

  return map;
};

/**
 * 内部マップを週次カロリー配列に変換します。
 */
const toWeeklyCalories_ = (map: Map<string, number>): WeeklyCalories => {
  return Array.from(map.entries()).map(([date, calories]) => ({
    date,
    calories,
  }));
};

/**
 * 新しい食事ログをシートに追加します。
 * 入力値の検証と日付変換を行います。
 */
const appendFoodLog = (
  name: string,
  dateValue: string,
  calories: number,
): string => {
  const trimmedName = String(name).trim();
  if (!trimmedName || !dateValue || calories == null) {
    throw new Error("全ての項目を正しく入力してください。");
  }

  const caloriesNumber = Number(calories);
  if (Number.isNaN(caloriesNumber) || caloriesNumber < 0) {
    throw new Error("カロリーは 0 以上の数値で入力してください。");
  }

  const date = parseDate_(dateValue);
  if (!date) {
    throw new Error("日付が正しくありません。");
  }

  const sheet = getFoodLogSheet_();
  sheet.appendRow([trimmedName, formatDate_(date), caloriesNumber]);

  return "登録が完了しました。";
};

/**
 * 食べたものメモのシートから直近7日分のカロリー合計を計算します。
 * 期間外の行は無視します。
 */
const getWeeklyCalories = (): WeeklyCalories => {
  const sheet = getFoodLogSheet_();
  const values = sheet.getDataRange().getValues();
  const [, ...rows] = values;

  const weeklyMap = createWeeklyMap_();

  rows.forEach((row: any) => {
    const [, dateCell, caloriesCell] = row;
    const date = parseDate_(dateCell);
    if (!date) {
      return;
    }

    const isoDate = formatDate_(date);
    if (!weeklyMap.has(isoDate)) {
      return;
    }

    const caloriesNumber = Number(caloriesCell);
    if (Number.isNaN(caloriesNumber)) {
      return;
    }

    weeklyMap.set(isoDate, weeklyMap.get(isoDate)! + caloriesNumber);
  });

  return toWeeklyCalories_(weeklyMap);
};

const doGet = (): GoogleAppsScript.HTML.HtmlOutput => {
  return HtmlService.createTemplateFromFile("food-log")
    .evaluate()
    .setTitle("食べたものメモ");
};
