"use client";

import { Inbox, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

import {
  dropHandler,
  type CreateChatInput,
  type CreateChatResponse,
} from "@/core/helper/dropHandler";
import { useRouter } from "next/navigation";

const FileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const { mutate, isPending } = useMutation<
    CreateChatResponse,
    Error,
    CreateChatInput
  >({
    mutationFn: async ({ id, path, fileName }) => {
      const { data } = await axios.post("/api/create-chat", {
        id,
        path,
        fileName,
      });
      return data;
    },
  });

  const router = useRouter();
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,

    onDrop: async (acceptedFiles) => {
      await dropHandler({ acceptedFiles, setIsUploading, mutate, router });
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
          <>
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            <p className=" text-[0.9rem] text-slate-500">Processing...</p>
          </>
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
