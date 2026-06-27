export const getSheetData_ = (
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
): any[][] => {
  const range = sheet.getDataRange();
  const values = range.getValues();
  return values;
};

export const getSheetDataObj_ = (
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
): { head: any[]; data: any[] } => {
  const range = sheet.getDataRange();
  const values = range.getValues();
  const [head, ...rows] = values;
  const data = rows.map((row) => {
    return Object.fromEntries(head.map((key, index) => [key, row[index]]));
  });
  return {
    head,
    data,
  };
};
