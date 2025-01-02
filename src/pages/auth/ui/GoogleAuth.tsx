import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import {
  backendMessages,
  routes,
  toastTexts,
} from "../../../shared/values/strValues";
import { useSignInByGoogleMutation } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/store/store";
import {
  setCurrentUser,
  setIsLoggedIn,
  setJWTToken,
} from "../../../entities/user/model/";

interface GoogleLoginComponentProps {
  text?: string;
}

const GoogleAuth: React.FC<GoogleLoginComponentProps> = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [signIn] = useSignInByGoogleMutation();

  const onSuccess = async (response: any) => {
    const idToken = response.credential;

    const result = await signIn(idToken).unwrap();

    let toastId: string;

    toastId = toast.loading("Signing in...");

    if (result.message === backendMessages.auth.success.successSignin) {
      toast.success(toastTexts.success.successAuth);
      dispatch(setCurrentUser(result.user));
      dispatch(setJWTToken(result.token));
      dispatch(setIsLoggedIn(true));

      navigate(routes.main);
    } else {
      toast.error(toastTexts.error.errorAuth);

      console.error(result);
    }
    toast.dismiss(toastId);
  };

  return <GoogleLogin onSuccess={onSuccess} />;
};

export default GoogleAuth;
