"use client";

import { Inbox } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { uploadToSupabase } from "@/core/lib/supabase/client";

const FileUpload = () => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,

    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file.size > 10 * 1024 * 1024) {
      }

      await uploadToSupabase(file);
    },
  });

  return (
    <div className="mt-2 rounded-xl bg-white p-2">
      <div
        {...getRootProps({
          className:
            "flex flex-col justify-center items-center border-dashed border-2 rounded-xl cursor-pointer bg-gray-100 py-8",
        })}
      >
        <input {...getInputProps()} />

        <Inbox className="h-10 w-10 text-purple-500" />

        <p className="mt-2 text-sm text-slate-500">Drop PDF Here</p>
      </div>
    </div>
  );
};

export default FileUpload;
