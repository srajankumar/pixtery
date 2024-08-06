"use client";

import Hero from "@/components/Hero";
import Info from "@/components/Info";
import Loading from "@/components/Loading";

function Page() {
  return (
    <div>
      <Loading />
      <Info />
      <Hero />
    </div>
  );
}

export default Page;
