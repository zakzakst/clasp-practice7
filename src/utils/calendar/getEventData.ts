type EventData = {
  title: string;
  start: string;
  end: string;
  description: string;
  calendarLink: string;
};

const sanitizeEventDescription_ = (html: string): string => {
  // 加工用の文字列を作成
  let result = html + "";
  // aタグ変換
  result = result.replace(/<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, "$2\n$1");
  // br変換
  result = result.replace(/<br\s*\/?>/gi, "\n");
  // タグ除去
  result = result.replace(/<[^>]+>/g, "");
  return result;
};

export const getEventData_ = (
  event: GoogleAppsScript.Calendar.CalendarEvent,
): EventData => {
  const title = event.getTitle();
  const start = `${event.getStartTime().toLocaleDateString()} ${event.getStartTime().toLocaleTimeString()}`;
  const end = `${event.getEndTime().toLocaleDateString()} ${event.getEndTime().toLocaleTimeString()}`;
  const description = sanitizeEventDescription_(event.getDescription()) || "";
  // 参考：https://wywy.jp/blogs/gas/2023-10-07-1
  const baseUrl = "https://calendar.google.com/calendar/event?eid=";
  const splitEventId = event.getId().split("@");
  const calendarLink = `${baseUrl}${Utilities.base64Encode(splitEventId[0] + " " + event.getOriginalCalendarId())}`;

  return {
    title,
    start,
    end,
    description,
    calendarLink,
  };
};
