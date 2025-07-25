import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../../app/store/store";
import { useNavigate } from "react-router-dom";
import { routes, toastTexts } from "../../../shared/values/strValues";

import Input from "../../../shared/ui/Input/Input";
import GoogleAuth from "./GoogleAuth";
import { useSignInMutation, useSignUpMutation } from "../../../entities/user";
import { setUserLoginData } from "../../../entities/user/model/userSlice";

const AuthPage = () => {
  const [isSignUp, setSignIn] = useState(true);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [signUp] = useSignUpMutation();
  const [signIn] = useSignInMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const toggleSignIn = () => {
    setSignIn(!isSignUp);
  };

  const handleInputChange = (
    type: "password" | "name" | "email",
    e: FormEvent<HTMLInputElement>
  ) => {
    if (type === "email") {
      setEmail(e.currentTarget.value);
    } else if (type === "password") {
      setPassword(e.currentTarget.value);
    } else if (type === "name") {
      setName(e.currentTarget.value);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const toastId = toast.loading("Loading...");
    try {
      let result;
      if (isSignUp) {
        result = await signUp({ name, password, email }).unwrap();
        dispatch(
          setUserLoginData({
            loginStatus: true,
            user: result.data.user,
            token: result.data.token,
          })
        );

        navigate(routes.main);
        toast.success(toastTexts.success.successSignup);
      } else {
        result = await signIn({ password, email }).unwrap();
        dispatch(
          setUserLoginData({
            loginStatus: true,
            user: result.data.user,
            token: result.data.token,
          })
        );

        navigate(routes.main);
        toast.success(toastTexts.success.successAuth);
      }
    } catch (error: any) {
      toast.error(error.data.message || "An error occurred");
      console.error(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="h-dvh text-white bg-gray-300 flex  justify-center items-center ">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-dvw md:w-3/6 lg:w-2/6 gap-4 p-4 rounded-md border-2 border-green-400  "
        action=""
      >
        <h3 className="text-center">{isSignUp ? "Sign Up" : "Sign In"}</h3>
        {isSignUp && (
          <Input
            required
            value={name}
            onChange={(e) => handleInputChange("name", e)}
            placeholder="Your name..."
            type="text"
          />
        )}
        <Input
          required
          placeholder="Your email..."
          value={email}
          onChange={(e) => handleInputChange("email", e)}
          type="email"
        />
        <Input
          required
          placeholder="Your password..."
          value={password}
          onChange={(e) => handleInputChange("password", e)}
          type="password"
        />
        <Input value={isSignUp ? "Sign Up" : "Sign In"} type="submit" />
        <GoogleAuth /> <br />
        <br />
        <div className="">
          <span>
            {isSignUp ? "Already have an account?" : "Do not have an account?"}
          </span>

          <button
            onClick={(e) => {
              e.preventDefault();
              toggleSignIn();
            }}
            className={`
                  text-green-400
                    ml-2
                    outline-none
                    rounded-sm
                    transition-all
                  focus:outline-green-400
                  hover:outline-green-200
                  `}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthPage;
