import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AutoSignUp } from "@/components/auto-signup";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background font-sans">
      <AutoSignUp />
      <main className="flex flex-1 items-center justify-center p-8">
        <Image
          src="/lifting-diary-logo.png"
          alt="Lifting Diary"
          width={1200}
          height={1200}
          className="h-auto w-full"
          priority
        />
      </main>
      <footer className="pb-6 text-sm text-muted-foreground">
        Copyright 2026 - Rod Machen
      </footer>
    </div>
  );
}
