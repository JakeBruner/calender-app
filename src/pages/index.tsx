import { useSession } from "next-auth/react";

import { useRouter } from "next/router";
import { SignIn } from "../components/SignIn";

const Home = () => {
  const { status } = useSession();

  const router = useRouter();

  // if (status === "loading") {
  //   return <div>Loading...</div>;
  // }

  if (status === "authenticated") {
    router.push("/calendar");
  }


  return (
   <SignIn />
  );
};

export default Home;
