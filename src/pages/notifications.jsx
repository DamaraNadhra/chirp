import {
    SignedIn,
    SignedOut,
    SignIn,
    SignInButton,
    SignOutButton,
    SignUpButton,
    useUser,
  } from "@clerk/nextjs";
  import Head from "next/head";
  import Link from "next/link";
  import { useEffect, useState } from "react";
  import chirpLogo from "src/images/chirpLogo.png";
  
  import { api, RouterOutputs } from "~/utils/api";
  
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import Image from "next/image";
  import { LoadingPage, LoadingSpinner } from "~/components/loading";
  import toast from "react-hot-toast";
  import { PageLayout } from "~/components/layout";
  import { PostView } from "~/components/postview";

  export default function Notifications() {

    const user = useUser();
    return (
        <PageLayout>
          <div>Notifications</div>
        </PageLayout>
      );
    
  }
  