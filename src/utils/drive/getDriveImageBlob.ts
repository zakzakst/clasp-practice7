export const getDriveImageBlob_ = (id: string): GoogleAppsScript.Base.Blob => {
  const file = DriveApp.getFileById(id);
  const blob = file.getBlob();
  return blob;
};
