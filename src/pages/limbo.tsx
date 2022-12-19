import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";
import { XCircleIcon } from "@heroicons/react/20/solid";

import { signOut } from "next-auth/react";

export default function Limbo() {

  const { data: session, status } = useSession();
  const router = useRouter();

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

  if (session.user.role !== "LIMBO") {
    router.push("/calendar");
    return <div className="flex h-screen animate-pulse items-center justify-center text-2xl">
    Redirecting...
  </div>;
  }


return (
<div className="flex h-screen px-8 md:px-20 lg:px-48 2xl:px-80">
  <div className="my-auto mx-auto flex-1 rounded-md bg-red-100 p-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-red-800 lg:text-lg">
          Access Denied
        </h3>
        <div className="mt-2 text-sm text-red-700 lg:text-lg">
          <ul className="list-disc space-y-1 pl-5">
            <li>Unfortunately, you do not have access to this app yet.</li>
            <li>
              If you just made an account, please wait for it to be approved.
            </li>
            <li>
              If you believe you should have access, please contact the Bruner Family.
            </li>
          </ul>

          <div className="pt-6 pb-2">
            <h4 className="italic">
              Signed in as {session.user.name} ({session.user.email})
            </h4>
          </div>

          <button
            type="button"
            className="mt-4 inline-flex items-center rounded-md border border-transparent bg-red-600 px-2 py-1 text-xs font-medium leading-4 text-white shadow-sm hover:bg-red-700 hover:shadow-inner focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 lg:px-3 lg:py-2 lg:text-base"
            onClick={() => { signOut() }}
            >
              <ArrowRightOnRectangleIcon
              className="mr-1.5 h-4 w-4 flex-shrink-0 text-white lg:h-6 lg:w-6"
            />Log out</button
          >
        </div>
      </div>
    </div>
  </div>
</div>

);
}