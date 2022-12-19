import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
// import classnames from "classnames";
import Admin from "../../components/admin/Table";
import Tabs from "../../components/admin/Tabs";
import UI from "../../components/admin/UI";


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

  if (!session) {
    router.push("/");
    return <div className="flex h-screen animate-pulse items-center justify-center text-2xl">
    Redirecting...
    </div>;
  }

  if (session.user.role !== "ADMIN") {
    console.log("User is not an admin")
    router.push("/");
    return <div className="flex h-screen animate-pulse items-center justify-center text-2xl">
    Redirecting...
  </div>;
  }

  const tabs = [
    { name: "General", href: "/admin", current: true},
    { name: "Approve Users", href: "/admin/users", current: false },
    { name: 'Approve Bookings', href: '/admin/bookings', current: false },
  ]

  return (
    <UI>
      <Tabs tabs={tabs} />
      <div className="relative py-6">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300" />
      </div>
    </div>
      <Admin />
    </UI>
  );
}