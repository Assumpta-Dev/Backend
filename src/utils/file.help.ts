// src/utils/file.help.ts
import fs from "fs";
import path from "path";

export const deleteFile = (filePath: string): void => {
  const fullPath = path.join(__dirname, "../../", filePath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    console.log("File deleted: " + filePath);
  }
};

export const deleteMultipleFiles = (filePaths: string[]): void => {
  filePaths.forEach((filePath) => {
    deleteFile(filePath);
  });
};