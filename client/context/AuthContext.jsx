import  { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase-config"; // Import your initialized firebase auth instance

// 1. Create the Context
const AuthContext = createContext({
  currentUser: null,
  loading: true,
});

// 2. Export a custom hook for easy access
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. The Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase listener: detects login/logout automatically
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Auth check is done, ready to render
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    // You can expose other auth functions here if you want to wrap them
    // e.g., login: (email, pass) => signInWithEmailAndPassword(auth, email, pass)
  };

  // Prevent "flicker" of login screen while Firebase is checking local storage
  if (loading) {
    return <div className="loading-screen">Loading application...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};