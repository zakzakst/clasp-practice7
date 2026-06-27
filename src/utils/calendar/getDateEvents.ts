type EventItem = {
  id: string;
  title: string;
};

export const getDateEventItems_ = (dateStr: string): EventItem[] => {
  const calendar = CalendarApp.getDefaultCalendar();
  const date = new Date(dateStr);

  // 開始
  const start = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
  );

  // 終了
  const end = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
  );

  // イベント取得
  const events = calendar.getEvents(start, end);

  return events.map((event) => ({
    id: event.getId(),
    title: event.getTitle(),
  }));
};
