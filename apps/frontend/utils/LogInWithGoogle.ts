import { useGoogleLogin } from "@react-oauth/google";
import useApi from "../custom-hooks/useApi";
import { useRouter } from "next/navigation";

export const useGoogleAuth = () => {
  const signInWithGoogle = useApi({
    url: "/auth/google",
    method: "POST",
    queryKey: ["login-with-google"],
  })?.post;
  const router = useRouter();
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (authCode) => {
      const result = await signInWithGoogle?.mutateAsync(authCode);
      router.push("/");
    },
    flow: "auth-code",
  });

  return { loginWithGoogle };
};
