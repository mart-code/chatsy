
import { useNavigate } from "react-router-dom"; // Assuming React Router v6
import { useAuth } from "./AuthContext";

const PrivateRoute = ({children}) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // If user is not logged in, redirect to login page
  return currentUser ? children : navigate("/");
};


export default PrivateRoute;