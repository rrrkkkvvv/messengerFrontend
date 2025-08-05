import { useNavigate } from "react-router-dom";
import { routes } from "../../../shared/values/strValues";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100 text-white">
      <h1 className="text-6xl font-bold text-purple-50">404</h1>
      <p className="mt-4 text-xl text-gray-50">Page not found</p>
      <button
        className="mt-6 px-6 py-2 bg-purple-200 text-white font-semibold rounded hover:bg-purple-150 transition duration-300"
        onClick={() => navigate(routes.main)}
      >
        Back to main page
      </button>
    </div>
  );
};

export default ErrorPage;
