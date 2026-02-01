import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import socketIO from "socket.io-client";
import Signin from "./pages/Signin";
import Profile from "./pages/Profile";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import PrivateRoute from "../context/PrivateRoute";

const socket = socketIO.connect("http://localhost:4000");

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Signin />}></Route>
            <Route
              path="/private-chat"
              element={
                <PrivateRoute>
                  <ChatPage socket={socket} />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
