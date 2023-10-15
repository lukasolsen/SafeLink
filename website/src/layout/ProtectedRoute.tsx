import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type ProtectedRouteProps = {
  element: React.ReactNode;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isLoggedIn, isLoading } = useAuth(); // Custom hook to check if user is authenticated
  console.log(isLoggedIn);
  console.log(isLoading);

  if (isLoading) {
    return <h1>Loading...</h1>; // Render loading indicator while checking user session
  }

  if (!isLoading && !isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (!isLoading && isLoggedIn) {
    return <div className="w-full">{element}</div>; // Render the protected route
  }

  return null;
};
