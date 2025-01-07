import type { PropsWithChildren } from "react";
import { NavigationBar } from "./navbar";
import { SignOutButton } from "@clerk/nextjs";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main>
    <div className="flex h-screen w-screen justify-start">
      <div className="w-36"></div>
      <div className="w-[18%] relative">
      <NavigationBar />
      </div>
      <div className="flex flex-col h-full w-[598px] md:max-w-2xl">
        {props.children}
      </div>
      <div className="flex  flex-col justify-start">
        <SignOutButton>
          <button className="mt-8 rounded-full font-segoe bg-red-500 px-4 py-1 ml-10 text-white hover:bg-opacity-95">Logout</button>
        </SignOutButton>
      </div>
      </div>
    </main>
  );
};
