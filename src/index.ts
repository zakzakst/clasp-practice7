/**
 * 食べたものメモの WebApp エントリポイント。
 *
 * ビルド時に esbuild の define で _.env から SHEET_ID を注入します。
 */

declare const process: {
  env: {
    SHEET_ID?: string;
  };
};

declare const Utilities: any;
declare const Session: any;
declare const SpreadsheetApp: any;
declare const HtmlService: any;

type WeeklyCalories = { date: string; calories: number }[];

const SHEET_ID = process.env.SHEET_ID;
const SHEET_NAME = "食べたものメモ";
const HEADER_ROW = ["食べたもの", "日付", "カロリー"];

/**
 * Date オブジェクトをスクリプトのタイムゾーンで yyyy-MM-dd 形式に変換します。
 */
const toIsoDate = (date: Date): string => {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd");
};

/**
 * シートの値または文字列を Date に変換します。
 * 変換できない場合は null を返します。
 */
const parseDate = (value: unknown): Date | null => {
  if (value instanceof Date) {
    return value;
  }

  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * シートの先頭行にヘッダが無ければ追加します。
 */
const ensureHeader = (sheet: any): void => {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER_ROW);
  }
};

/**
 * SHEET_ID でスプレッドシートを開きます。
 * 未設定の場合は例外を投げます。
 */
const getSpreadsheet = (): any => {
  if (!SHEET_ID) {
    throw new Error("SHEET_ID が設定されていません。_.env にシートIDを追加してください。");
  }

  return SpreadsheetApp.openById(SHEET_ID);
};

/**
 * 食べたものメモ用のシートを取得します。
 * シートが存在しなければ作成し、ヘッダを保証します。
 */
const getFoodLogSheet = (): any => {
  const book = getSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADER_ROW);
  }

  ensureHeader(sheet);
  return sheet;
};

/**
 * カロリー値が 0 以上の数値かを検証します。
 */
const validateCalories = (value: number): void => {
  if (Number.isNaN(value) || value < 0) {
    throw new Error("カロリーは 0 以上の数値で入力してください。");
  }
};

/**
 * 直近7日分の日付をキーにしたマップを作成し、初期値を 0 にします。
 */
const createWeeklyMap = (): Map<string, number> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const map = new Map<string, number>();
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    map.set(toIsoDate(date), 0);
  }

  return map;
};

/**
 * 内部マップを週次カロリー配列に変換します。
 */
const toWeeklyCalories = (map: Map<string, number>): WeeklyCalories => {
  return Array.from(map.entries()).map(([date, calories]) => ({ date, calories }));
};

/**
 * 新しい食事ログをシートに追加します。
 * 入力値の検証と日付変換を行います。
 */
const appendFoodLog = (name: string, dateValue: string, calories: number): string => {
  const trimmedName = String(name).trim();
  if (!trimmedName || !dateValue || calories == null) {
    throw new Error("全ての項目を正しく入力してください。");
  }

  const caloriesNumber = Number(calories);
  validateCalories(caloriesNumber);

  const date = parseDate(dateValue);
  if (!date) {
    throw new Error("日付が正しくありません。");
  }

  const sheet = getFoodLogSheet();
  sheet.appendRow([trimmedName, toIsoDate(date), caloriesNumber]);

  return "登録が完了しました。";
};

/**
 * 食べたものメモのシートから直近7日分のカロリー合計を計算します。
 * 期間外の行は無視します。
 */
const getWeeklyCalories = (): WeeklyCalories => {
  const sheet = getFoodLogSheet();
  const values = sheet.getDataRange().getValues();
  const [, ...rows] = values;

  const weeklyMap = createWeeklyMap();

  rows.forEach((row: any) => {
    const [, dateCell, caloriesCell] = row;
    const date = parseDate(dateCell);
    if (!date) {
      return;
    }

    const isoDate = toIsoDate(date);
    if (!weeklyMap.has(isoDate)) {
      return;
    }

    const caloriesNumber = Number(caloriesCell);
    if (Number.isNaN(caloriesNumber)) {
      return;
    }

    weeklyMap.set(isoDate, weeklyMap.get(isoDate)! + caloriesNumber);
  });

  return toWeeklyCalories(weeklyMap);
};

/**
 * WebApp で呼び出される関数をグローバルオブジェクトに公開します。
 */
const app: any = globalThis;
app.doGet = (): any => HtmlService.createHtmlOutputFromFile("food-log").setTitle("食べたものメモ");
app.appendFoodLog = appendFoodLog;
app.getWeeklyCalories = getWeeklyCalories;

export {};
