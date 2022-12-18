import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Admin from "../../components/admin/Table";


export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-screen animate-pulse items-center justify-center text-2xl">
        Loading...
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/");
    return <div>Redirecting...</div>;
  }

  return (
    <div className="p-10">
      <h1 className="font-bold text-4xl">Admin</h1>
      <pre>{JSON.stringify(session, null, 2)}
      </pre>
      <Admin />
    </div>
  );
}