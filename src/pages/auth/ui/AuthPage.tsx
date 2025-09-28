import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../../app/store/store";
import { useNavigate } from "react-router-dom";
import { routes, toastTexts } from "../../../shared/values/strValues";

import Input from "../../../shared/ui/Input/Input";
import GoogleAuth from "./GoogleAuth";
import { useSignInMutation, useSignUpMutation } from "../../../entities/user";
import { setUserLoginData } from "../../../entities/user/model/userSlice";
import SubmitBtn from "../../../shared/ui/Button/SubmitBtn";
import { FaGoogle } from "react-icons/fa";

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
    <div className="h-dvh text-white bg-gray-400 flex justify-center    ">
      <form
        onSubmit={handleSubmit}
        className="h-full w-full md:w-1/3 flex flex-col    justify-center  gap-3 p-4 rounded-md     "
        action=""
      >
        <h1 className="font-semibold text-2xl ">
          {isSignUp ? "Create an account" : "Log in to your account "}
        </h1>
        <p className="mb-2">
          <span>
            {isSignUp ? "Already have an account?" : "Do not have an account?"}
          </span>

          <button
            onClick={(e) => {
              e.preventDefault();
              toggleSignIn();
            }}
            className={`
              underline
                  text-gray-50
                    ml-2
                    outline-none
                    rounded-sm
                    transition-all
                  focus:outline-gray-50
                  hover:outline-gray-50
                  `}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
        {isSignUp && (
          <>
            <label className=" font-bold" htmlFor="name_input">
              Name
            </label>

            <Input
              required
              id="name"
              value={name}
              placeholder="John Doe"
              onChange={(e) => handleInputChange("name", e)}
              type="text"
            />
          </>
        )}
        <label className=" font-bold" htmlFor="email_input">
          Email
        </label>
        <Input
          // className="bg-gray-50"
          id="email_input"
          required
          placeholder="email@example.com"
          value={email}
          onChange={(e) => handleInputChange("email", e)}
          type="email"
        />
        <label className=" font-bold" htmlFor="password_input">
          Password
        </label>
        <Input
          id="password_input"
          required
          value={password}
          onChange={(e) => handleInputChange("password", e)}
          type="password"
        />
        <SubmitBtn
          className="mt-3 bg-gray-50 text-gray-400 font-bold "
          children={isSignUp ? "Sign Up" : "Sign In"}
        />

        <p className="relative text-center px-3   uppercase text-sm text-gray-100 before:content-[''] before:absolute before:left-0 before:top-1/2 before:w-1/3 before:h-px before:bg-gray-100 after:content-[''] after:absolute after:right-0 after:top-1/2 after:w-1/3 after:h-px after:bg-gray-100">
          or continue with
        </p>
        {/* <div className="flex cursor-pointer overflow-hidden relative items-center gap-2 w-1/2  font-semibold border bg-gray-300 p-2  rounded-lg">
          <FaGoogle className="font-thin" />
          <div>Google</div>
          <div className="absolute z-10 left-0 opacity-0 ">
            <GoogleAuth />
          </div>
        </div> */}
        <GoogleAuth />
      </form>
    </div>
  );
};

export default AuthPage;
