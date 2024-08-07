import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  return (
    <main className="grid min-h-[100dvh] place-items-center px-5 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-primary">404</p>
        <h1 className="mt-4 font-bold tracking-tight text-4xl">
          Page not found
        </h1>
        <p className="mt-6 text-base">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-7 flex items-center justify-center">
          <Link href="/" className="w-full sm:max-w-xs">
            <Button className="w-full">Go back home</Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default page;
