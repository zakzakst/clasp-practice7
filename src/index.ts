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

const dateToIso = (date: Date): string => {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd");
};

const parseSheetDate = (value: unknown): Date | null => {
  if (value instanceof Date) {
    return value;
  }

  const text = String(value);
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const ensureHeader_ = (sheet: any): void => {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["食べたもの", "日付", "カロリー"]);
  }
};

const getSpreadsheet_ = (): any => {
  if (!SHEET_ID) {
    throw new Error("SHEET_ID が設定されていません。_.env にシートIDを追加してください。");
  }
  return SpreadsheetApp.openById(SHEET_ID);
};

const getFoodLogSheet_ = (): any => {
  const book = getSpreadsheet_();
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow(["食べたもの", "日付", "カロリー"]);
  }
  ensureHeader_(sheet);
  return sheet;
};

const app: any = globalThis;

app.doGet = (): any => {
  return HtmlService.createHtmlOutputFromFile("food-log").setTitle("食べたものメモ");
};

app.appendFoodLog = (name: string, dateValue: string, calories: number): string => {
  if (!name || !dateValue || calories == null) {
    throw new Error("全ての項目を正しく入力してください。");
  }

  const caloriesNumber = Number(calories);
  if (Number.isNaN(caloriesNumber) || caloriesNumber < 0) {
    throw new Error("カロリーは 0 以上の数値で入力してください。");
  }

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("日付が正しくありません。");
  }

  const sheet = getFoodLogSheet_();
  sheet.appendRow([name, dateToIso(parsedDate), caloriesNumber]);
  return "登録が完了しました。";
};

app.getWeeklyCalories = (): WeeklyCalories => {
  const sheet = getFoodLogSheet_();
  const values = sheet.getDataRange().getValues();
  const [, ...rows] = values;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dailyMap = new Map<string, number>();
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dailyMap.set(dateToIso(date), 0);
  }

  rows.forEach((row: any) => {
    const [name, dateCell, caloriesCell] = row;
    const date = parseSheetDate(dateCell);
    if (!date) {
      return;
    }
    const isoDate = dateToIso(date);
    if (!dailyMap.has(isoDate)) {
      return;
    }

    const caloriesNumber = Number(caloriesCell);
    if (!Number.isNaN(caloriesNumber)) {
      dailyMap.set(isoDate, dailyMap.get(isoDate)! + caloriesNumber);
    }
  });

  return Array.from(dailyMap.entries()).map(([date, calories]) => ({ date, calories }));
};

export {};
