/**
 * WebApp entrypoint for the 食べたものメモ application.
 *
 * Build injects SHEET_ID from _.env via esbuild define.
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

const toIsoDate = (date: Date): string => {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd");
};

const parseDate = (value: unknown): Date | null => {
  if (value instanceof Date) {
    return value;
  }

  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const ensureHeader = (sheet: any): void => {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER_ROW);
  }
};

const getSpreadsheet = (): any => {
  if (!SHEET_ID) {
    throw new Error("SHEET_ID が設定されていません。_.env にシートIDを追加してください。");
  }

  return SpreadsheetApp.openById(SHEET_ID);
};

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

const validateCalories = (value: number): void => {
  if (Number.isNaN(value) || value < 0) {
    throw new Error("カロリーは 0 以上の数値で入力してください。");
  }
};

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

const toWeeklyCalories = (map: Map<string, number>): WeeklyCalories => {
  return Array.from(map.entries()).map(([date, calories]) => ({ date, calories }));
};

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

const app: any = globalThis;
app.doGet = (): any => HtmlService.createHtmlOutputFromFile("food-log").setTitle("食べたものメモ");
app.appendFoodLog = appendFoodLog;
app.getWeeklyCalories = getWeeklyCalories;

export {};
