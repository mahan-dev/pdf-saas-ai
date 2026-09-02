import { Button } from "@/core/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import { ArrowRight, LogIn } from "lucide-react";
import FileUpload from "@/core/components/templates/FileUpload";
import { Input } from "@/core/components/ui/input";
import { checkSubscription } from "@/core/utils/subscription";
import SubscriptionButton from "@/core/components/templates/SubscriptionButton";
import { db } from "@/core/lib/db";
import { chats } from "@/core/lib/db/schema";
import { eq } from "drizzle-orm";

const page = async () => {
  const { userId } = await auth();

  const isAuth = !!userId;
  const isPro = await checkSubscription();
  let firstChat;

  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }

  return (
    <div className=" min-h-screen  flex items-center justify-center  bg-linear-to-r from-indigo-300 to-purple-400">
      {" "}
      <div className="absolute top-1/2  left-1/2 -translate-y-1/2 -translate-x-1/2 text-center">
        <div className="flex  flex-col justify-center items-center">
          <div className="flex gap-1.5 items-center">
            <h1 className="text-5xl font-bold ">Chat with any PDF</h1>
            <UserButton afterSwitchSessionUrl="/" />
          </div>

          <div className="flex gap-1 items-center mt-1.5">
            {isAuth && firstChat && (
              <Link href={`/chats/${firstChat.id}`}>
                <Button className={" p-4 py-5 cursor-pointer"}>
                  go to Chats
                  <ArrowRight className="w-4 h-4 hover:transition hover:translate-x-1" />
                </Button>
              </Link>
            )}
            {<SubscriptionButton isPro={isPro} />}
          </div>
          <p className="text-slate-60 mt-2 max-w-xl">
            join millions of students, researchers and professionals to
            instantly answer questions and understand research with ai
          </p>

          <div className="w-full mt-2">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href={"/sign-in"}>
                <Button className="cursor-pointer">
                  Login to get start
                  <LogIn />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
