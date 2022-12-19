import { useSession } from "next-auth/react";

import { useRouter } from "next/router";
import { SignIn } from "../components/SignIn";

const Home = () => {
  const { data: session } = useSession();

  const router = useRouter();

  if (session) {
    if (session.user.role !== "LIMBO") {
      router.push("/calendar");
    } else {
      router.push("/limbo");
    }
  }


  return (
   <SignIn />
  );
};

export default Home;
