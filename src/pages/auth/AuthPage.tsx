import { useEffect } from "react";
import { useAppSelector } from "../../app/store/store";
import { selectCurrentUser } from "../../entities/user";
import Auth from "../../features/auth";
import { useNavigate } from "react-router-dom";
import { routes } from "../../shared/values/strValues";

const AuthPage = () => {
  const navigate = useNavigate();

  const data = useAppSelector(selectCurrentUser);

  useEffect(() => {
    if (data) {
      navigate(routes.main);
    }
  }, []);

  return (
    <div className="h-dvh text-white bg-gray-300 flex  justify-center items-center ">
      <Auth />
    </div>
  );
};

export default AuthPage;
