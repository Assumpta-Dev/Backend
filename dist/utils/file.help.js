// src/utils/file.help.ts
import fs from "fs";
import path from "path";
export const deleteFile = (filePath) => {
    const fullPath = path.join(__dirname, "../../", filePath);
    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log("File deleted: " + filePath);
    }
};
export const deleteMultipleFiles = (filePaths) => {
    filePaths.forEach((filePath) => {
        deleteFile(filePath);
    });
};
//# sourceMappingURL=file.help.js.map