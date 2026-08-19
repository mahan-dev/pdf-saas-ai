"use client";
import { PropsWithChildren } from "react";
import { Toaster } from "@/core/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const Provider = ({ children }: PropsWithChildren) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      <Toaster />
    </>
  );
};

export default Provider;
