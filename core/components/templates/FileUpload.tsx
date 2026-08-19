"use client";

import { Inbox, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { uploadToSupabase } from "@/core/lib/supabase/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";

const FileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ id, path }: { id: string; path: string }) => {
      const { data } = await axios.post("/api/create-chat", { id, path });
      return data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,

    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large > 10MB");
        return;
      }
      try {
        setIsUploading(true);
        const data = await uploadToSupabase(file);
        console.log(data, "data coming from the supabase");

        if (!data?.id || !data?.path) {
          toast.error("data failed", { duration: 2000 });
          return;
        }

        mutate(data, {
          onSuccess: (data) => {
            console.log(data);
            toast.success(data.message, { position: "top-center" });
          },
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsUploading(false);
      }
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

        {isUploading || isPending ? (
          <Loader2 className="w-12 h-12 animate-spin" />
        ) : (
          <>
            <Inbox className="h-10 w-10 text-purple-500" />

            <p className="mt-2 text-sm text-slate-500">Drop PDF Here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
