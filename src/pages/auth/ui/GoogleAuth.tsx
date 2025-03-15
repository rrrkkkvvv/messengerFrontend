import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { routes, toastTexts } from "../../../shared/values/strValues";
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
    try {
      const googleToken = response.credential;

      const { data: result } = await signIn({ googleToken }).unwrap();

      let toastId: string;

      toastId = toast.loading("Signing in...");

      toast.success(toastTexts.success.successAuth);
      dispatch(setCurrentUser(result.user));
      dispatch(setJWTToken(result.token));
      dispatch(setIsLoggedIn(true));

      navigate(routes.main);

      toast.dismiss(toastId);
    } catch (err) {
      console.error(err);
    }
  };

  return <GoogleLogin onSuccess={onSuccess} />;
};

export default GoogleAuth;
