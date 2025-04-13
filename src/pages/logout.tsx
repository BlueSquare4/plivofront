import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "@/lib/firebase";

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    auth.signOut().then(() => {
      router.push("/login"); // Redirect to login page after logout
    });
  }, [router]);

  return <p>Logging out...</p>;
};

export default Logout;
