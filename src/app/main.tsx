import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from "../pages/auth";
import { Provider } from "react-redux";
import { store } from "./store/store";
import MainPage from "../pages/main/MainPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { routes } from "../shared/values/strValues";
import Conversation from "../entities/conversation";
import Conversations from "../widgets/UsersList";
import ErrorPage from "../pages/error/ErrorPage";
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

const router = createBrowserRouter([
  {
    path: "*",
    element: <ErrorPage />,
  },
  {
    path: routes.auth,
    element: <AuthPage />,
  },
  {
    path: routes.main,
    element: <MainPage />,
    children: [
      {
        index: true,
        // path: routes.main,
        element: <Conversations />,
      },
      {
        path: routes.conversation + "/:anotherUserIdParam",
        element: <Conversation />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <Provider store={store}>
        <Toaster />

        <RouterProvider router={router} />
      </Provider>
    </GoogleOAuthProvider>
    {/* <div className="bg-white text-white  flex flex-col justify-center  items-center w-full h-dvh">

      <div className='text-5xl p-5 bg-green-100'>messenger</div>
      <div className='text-5xl  p-5 bg-green-200'>messenger</div>
      <div className='text-5xl text-white p-5 bg-gray-300'>messenger</div>
      <div className='text-5xl text-white p-5 bg-gray-200'>messenger</div>
      <div className='text-5xl text-white p-5 bg-gray-100'>messenger</div>

    </div> */}
  </StrictMode>
);
