// app/signin/page.js
import React, { Suspense } from "react";
import PageClient from "./PageClient";
import Loading_Dashboard from "@/components/Dashboard Components/Loading_Dashboard";

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen grid place-items-center text-3xl">
          <Loading_Dashboard />
        </div>
      }
    >
      <PageClient />
    </Suspense>
  );
};

export default Page;
