import { SignedIn, SignedOut, SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

import { api, RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";


export default function PostViewPage() {
  const { isLoaded: userLoaded } = useUser();

  api.posts.getAll.useQuery();
  // return empty div if user isn't loaded yet
  if (!userLoaded) return <div />;
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen">
        Post View
      </main>
    </>
  );
}
