import Tabs from "../../components/admin/Tabs";
import Table from "../../components/admin/Table";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import UI from "../../components/admin/UI";

export default function AdminBookings() {
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
    { name: "General", href: "/admin", current: false},
    { name: "Approve Users", href: "/admin/users", current: true },
    { name: 'Approve Bookings', href: '/admin/bookings', current: false },
  ]

  return (
    <UI>
      <Tabs tabs={tabs} />
      <Table />
    </UI>
  );
}