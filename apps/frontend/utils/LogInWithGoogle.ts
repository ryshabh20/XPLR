import { useGoogleLogin } from "@react-oauth/google";
import useApi from "../custom-hooks/useApi";
import { useRouter } from "next/navigation";

export const useGoogleAuth = () => {
  const signInWithGoogle = useApi({
    url: "/user/google-login",
    method: "POST",
    queryKey: ["login-with-google"],
    config: { withCredentials: true },
  })?.post;
  const router = useRouter();
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (authCode) => {
      const result = await signInWithGoogle?.mutateAsync(authCode);
      router.push("/drive");
    },
    flow: "auth-code",
  });
  return { loginWithGoogle };
};
