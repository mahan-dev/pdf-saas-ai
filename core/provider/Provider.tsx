import { PropsWithChildren } from "react";
import { Toaster } from "@/core/components/ui/sonner";

const Provider = ({ children }: PropsWithChildren) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};

export default Provider;
