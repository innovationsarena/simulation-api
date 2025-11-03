import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const TEMP_DIR = process.env.UPLOAD_TEMP_DIR || path.join(process.cwd(), "temp-uploads");

/**
 * Initialize the temp directory
 */
export const initTempDir = async (): Promise<void> => {
  try {
    await fs.access(TEMP_DIR);
  } catch {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  }
};

/**
 * Save a file to the temp directory
 */
export const saveTempFile = async (
  fileBuffer: Buffer,
  originalFilename: string
): Promise<{ fileId: string; filePath: string; filename: string }> => {
  await initTempDir();

  const fileId = uuidv4();
  const ext = path.extname(originalFilename);
  const filename = `${fileId}${ext}`;
  const filePath = path.join(TEMP_DIR, filename);

  await fs.writeFile(filePath, fileBuffer);

  return {
    fileId,
    filePath,
    filename,
  };
};

/**
 * Delete a file from the temp directory
 */
export const deleteTempFile = async (fileId: string): Promise<boolean> => {
  try {
    const files = await fs.readdir(TEMP_DIR);
    const targetFile = files.find((file) => file.startsWith(fileId));

    if (!targetFile) {
      return false;
    }

    const filePath = path.join(TEMP_DIR, targetFile);
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error(`Error deleting file ${fileId}:`, error);
    return false;
  }
};

/**
 * Delete multiple files from the temp directory
 */
export const deleteTempFiles = async (fileIds: string[]): Promise<{ deleted: string[]; failed: string[] }> => {
  const deleted: string[] = [];
  const failed: string[] = [];

  for (const fileId of fileIds) {
    const success = await deleteTempFile(fileId);
    if (success) {
      deleted.push(fileId);
    } else {
      failed.push(fileId);
    }
  }

  return { deleted, failed };
};

/**
 * List all files in the temp directory
 */
export const listTempFiles = async (): Promise<Array<{ fileId: string; filename: string; path: string }>> => {
  try {
    await initTempDir();
    const files = await fs.readdir(TEMP_DIR);

    return files.map((filename) => {
      const fileId = filename.split(".")[0];
      return {
        fileId,
        filename,
        path: path.join(TEMP_DIR, filename),
      };
    });
  } catch (error) {
    console.error("Error listing temp files:", error);
    return [];
  }
};

/**
 * Get file info
 */
export const getTempFileInfo = async (fileId: string): Promise<{ exists: boolean; path?: string; filename?: string }> => {
  try {
    const files = await fs.readdir(TEMP_DIR);
    const targetFile = files.find((file) => file.startsWith(fileId));

    if (!targetFile) {
      return { exists: false };
    }

    return {
      exists: true,
      path: path.join(TEMP_DIR, targetFile),
      filename: targetFile,
    };
  } catch (error) {
    return { exists: false };
  }
};
