import { MultipartFile } from "@fastify/multipart";
import { supabase } from "@core";

export const uploadFiles = async (files: MultipartFile[]) => {
  const uploadedFiles: string[] = [];

  for await (const file of files) {
    const { data } = await supabase.storage
      .from(process.env.TEMP_BUCKET as string)
      .upload(`/${Date.now()}-${file.filename}`, await file.toBuffer(), {
        contentType: file.mimetype,
        upsert: true,
      });

    if (data) {
      uploadedFiles.push(data?.path);
    }
  }

  return uploadedFiles;
};
