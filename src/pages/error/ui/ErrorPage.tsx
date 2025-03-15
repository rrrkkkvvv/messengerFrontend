import { useNavigate } from "react-router-dom";
import { routes } from "../../../shared/values/strValues";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-300 text-white">
      <h1 className="text-6xl font-bold text-green-200">404</h1>
      <p className="mt-4 text-xl text-gray-50">Page not found</p>
      <button
        className="mt-6 px-6 py-2 bg-green-200 text-gray-300 font-semibold rounded hover:bg-green-150 transition duration-300"
        onClick={() => navigate(routes.main)}
      >
        Back to main page
      </button>
    </div>
  );
};

export default ErrorPage;
