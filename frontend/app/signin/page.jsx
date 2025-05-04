// app/signin/page.js
import React, { Suspense } from "react";
import PageClient from "./PageClient";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageClient />
    </Suspense>
  );
};

export default Page;
