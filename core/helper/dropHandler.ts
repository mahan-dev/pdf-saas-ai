import { toast } from "sonner";
import { uploadToSupabase } from "../lib/supabase/client";
import { Dispatch, SetStateAction } from "react";
import { UseMutateFunction } from "@tanstack/react-query";
export type CreateChatInput = {
  id: string;
  path: string;
};

export type CreateChatResponse = {
  status: string;
  message: string;
};

interface DropProps {
  acceptedFiles: File[];
  setIsUploading: Dispatch<SetStateAction<boolean>>;
  mutate: UseMutateFunction<
    CreateChatResponse,
    Error,
    CreateChatInput,
    unknown
  >;
}

export const dropHandler = async ({
  acceptedFiles,
  setIsUploading,
  mutate,
}: DropProps) => {
  const file = acceptedFiles[0];

  if (!file) {
    toast.error("file should be pdf !", {
      duration: 2000,
      position: "top-center",
    });
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    toast.error("File too large > 10MB", { duration: 2000 });
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
        toast.success(data.message || "Done", { position: "top-center" });
      },
      onError: (error) => {
        console.log("something wen't wrong ", error);
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    setIsUploading(false);
  }
};
