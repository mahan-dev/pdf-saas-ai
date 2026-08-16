

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import { LogIn } from "lucide-react";

const page =async ()  => {
  const {userId} = await auth()

  const isAuth = !!userId;
  return (
    <div className="bg-linear-to-r from-indigo-300 to-purple-400 min-h-screen flex items-center justify-center">
      <div className="absolute top-1/2  left-1/2 -translate-y-1/2 -translate-x-1/2 text-center">
      <div className="flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold ">Chat with any PDF</h1>
      <UserButton afterSwitchSessionUrl="/" />
        


      <div className="flex">
        {
          isAuth && (
            <Button>go to Chats</Button> 
          )
        }
        <p className="text-slate-600 max-w-xl">
          join millions of students, researchers and professionals to instantly answer questions and understand research with ai
        </p>
        
        </div>

        <div className="w-full mt-2">
          {
            isAuth ? <div>fileUpload</div> : 
            <Link href={"/sign-in"}>
            <Button className="cursor-pointer">Login to get start
              <LogIn  />

            </Button>
            </Link>
          }
          
        </div>

      </div>

      </div>


      
    </div>
  )
}

export default page