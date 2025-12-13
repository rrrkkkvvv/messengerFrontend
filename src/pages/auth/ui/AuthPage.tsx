import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../../app/store/store";
import { useNavigate } from "react-router-dom";
import { routes, toastTexts } from "../../../shared/values/strValues";

import Input from "../../../shared/ui/Input/Input";
import GoogleAuth from "./GoogleAuth";
import { useSignInMutation, useSignUpMutation } from "../../../entities/user";
import { setUserLoginData } from "../../../entities/user/model/userSlice";
import SolidButton from "../../../shared/ui/Button/SolidButton";

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
      if (email.length <= 254) setEmail(e.currentTarget.value);
    } else if (type === "password") {
      setPassword(e.currentTarget.value);
    } else if (type === "name") {
      if (name.length <= 90) setName(e.currentTarget.value.trim());
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const toastId = toast.loading("Loading...");
    try {
      let result;
      if (isSignUp) {
        result = await signUp({
          name: name.trim(),
          password,
          email: email.trim(),
        }).unwrap();
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
    <div className="h-dvh text-gray-50 bg-gray-400 flex justify-center    ">
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
            id="toggleSignUpBtn"
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
            <label className=" font-bold" htmlFor="nameInput">
              Name
            </label>

            <Input
              maxLength={90}
              required
              id="nameInput"
              value={name}
              placeholder="John Doe"
              onChange={(e) => handleInputChange("name", e)}
              type="text"
            />
          </>
        )}
        <label className=" font-bold" htmlFor="emailInput">
          Email
        </label>
        <Input
          maxLength={254}
          id="emailInput"
          required
          placeholder="email@example.com"
          value={email}
          onChange={(e) => handleInputChange("email", e)}
          type="email"
        />
        <label className=" font-bold" htmlFor="passwordInput">
          Password
        </label>
        <Input
          id="passwordInput"
          required
          value={password}
          onChange={(e) => handleInputChange("password", e)}
          type="password"
        />
        <SolidButton type="submit" id="submitAuthBtn" className="mt-3">
          {isSignUp ? <>Sign Up</> : <>Sign In</>}
        </SolidButton>
        <div className="relative my-4 flex justify-center items-center">
          <span className="absolue w-full border-t-2 border-gray-100"></span>
          <div className="uppercase text-sm absolute px-1 bg-gray-400 text-gray-100">
            or continue with
          </div>
        </div>

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
