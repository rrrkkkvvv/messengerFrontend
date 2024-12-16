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
import ErrorPage from "../pages/error/ErrorPage";
import { createBrowserHistory } from "history";
import UsersList from "../widgets/UsersList";
import Profile from "../widgets/Profile/";
import RestrictedRoute from "../features/routes/RestrictedRoute";
import PrivateRoute from "../features/routes/PrivateRoute";

export const history = createBrowserHistory();

const router = createBrowserRouter([
  {
    path: "*",
    element: <ErrorPage />,
  },
  {
    path: routes.auth,
    element: (
      <RestrictedRoute>
        <AuthPage />
      </RestrictedRoute>
    ),
  },
  {
    path: routes.main,
    element: (
      <PrivateRoute>
        <MainPage />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <UsersList />,
      },
      {
        path: routes.conversation + "/:anotherUserIdParam",
        element: <Conversation />,
      },
      {
        path: routes.profile,
        element: <Profile />,
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
  </StrictMode>
);
