type ImageFile = {
  id: string;
  name: string;
  size: number;
};

export const getDriveImages_ = (folderId: string): ImageFile[] => {
  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFiles();

  const imageFiles: ImageFile[] = [];

  while (files.hasNext()) {
    const file = files.next();
    const mimeType = file.getMimeType();
    // 画像ファイルのみ対象
    if (mimeType.startsWith("image/")) {
      imageFiles.push({
        id: file.getId(),
        name: file.getName(),
        size: file.getSize(),
      });
    }
  }

  // ファイル名順でソート
  imageFiles.sort((a, b) => {
    return a.name.localeCompare(b.name, "ja");
  });

  return imageFiles;
};
