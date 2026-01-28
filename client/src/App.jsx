import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPage from "./components/ChatPage";
import socketIO from "socket.io-client";
import Signin from "./pages/Signin";
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "../context/PrivateRoute";

const socket = socketIO.connect("http://localhost:4000");

function App() {


  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="bg-white">
          <Routes>
            <Route path="/" element={<Signin />}></Route>
            <Route path="/chat" element={
              <PrivateRoute>
                <ChatPage socket={socket} />
              </PrivateRoute>
            }/>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;