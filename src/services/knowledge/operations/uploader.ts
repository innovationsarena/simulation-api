import { supabase } from "@core";

export const uploadFiles = async (
  files: { buffer: Buffer; filename: string; mimetype: string }[]
) => {
  const uploadedFiles: string[] = [];

  for await (const file of files) {
    const safeName = file.filename
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]/g, "_");

    const { data, error } = await supabase.storage
      .from(process.env.TEMP_BUCKET as string)
      .upload(`${Date.now()}___${safeName}`, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      console.error("Upload failed:", error.message);
      continue;
    }

    if (data) {
      uploadedFiles.push(data.path);
    }
  }

  return uploadedFiles;
};
