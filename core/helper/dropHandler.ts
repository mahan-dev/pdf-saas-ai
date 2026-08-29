import { toast } from "sonner";
import { uploadToSupabase } from "../lib/supabase/client";
import { Dispatch, SetStateAction } from "react";
import { UseMutateFunction } from "@tanstack/react-query";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
export type CreateChatInput = {
  id: string;
  path: string;
  fullPath: string;
  fileName: string;
};

export type CreateChatResponse = {
  status: string;
  message: string;
  chat_id?: number;
};

interface DropProps {
  acceptedFiles: File[];
  setIsUploading: Dispatch<SetStateAction<boolean>>;
  mutate: UseMutateFunction<CreateChatResponse, Error, CreateChatInput>;
  router: AppRouterInstance;
}

export const dropHandler = async ({
  acceptedFiles,
  setIsUploading,
  mutate,
  router,
}: DropProps) => {
  const file = acceptedFiles[0];
  console.log("🎤 ~ dropHandler.ts:31 -> file: ", file);

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

  const NotificationHandler = async () => {
    return await new Promise((resolver) => setTimeout(resolver, 1000));
  };

  try {
    setIsUploading(true);
    const data = await uploadToSupabase(file);

    console.log(data?.id, data?.path);
    console.log(data, "data coming from the supabase");

    if (!data?.id || !data?.path) {
      toast.error("data failed", {
        duration: 2000,
        position: "top-center",
      });
      return;
    }

    mutate(data, {
      onSuccess: async ({ chat_id }) => {
        console.log("🚀 ~ dropHandler.ts:56 -> chat_id: ", chat_id);
        toast.success("Chat has been created !", { position: "top-center" });
        await NotificationHandler();
        router.push(`/chat/${chat_id}`);
      },
      onError: (error) => {
        console.log("something wen't wrong ", error);
        toast.error("something wen't wrong", {
          position: "top-center",
        });
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    setIsUploading(false);
  }
};
