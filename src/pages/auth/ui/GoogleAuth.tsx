import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { routes, toastTexts } from "../../../shared/values/strValues";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/store/store";
import { FC } from "react";
import {
  setCurrentUser,
  setJWTToken,
  useSignInByGoogleMutation,
} from "../../../entities/user";
import { setUserLoginData } from "../../../entities/user/model/userSlice";

interface GoogleLoginComponentProps {
  text?: string;
}

const GoogleAuth: FC<GoogleLoginComponentProps> = () => {
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
      dispatch(
        setUserLoginData({
          loginStatus: true,
          user: result.user,
          token: result.token,
        })
      );

      navigate(routes.main);

      toast.dismiss(toastId);
    } catch (err) {
      console.error(err);
    }
  };

  return <GoogleLogin width="" onSuccess={onSuccess} text="signin_with" />;
};

export default GoogleAuth;
