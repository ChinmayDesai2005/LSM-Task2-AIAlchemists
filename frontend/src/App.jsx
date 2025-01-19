import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Input from "./pages/input/Input";
import Header from "./components/header/Header";
import Profile from "./pages/profile/Profile";
import BlogsPage from "./pages/blog_coverpage/BlogsPage";
import Transcript from "./pages/transcript/Transcript";

import Auth from "./pages/auth/Auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/input" element={<Input />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/blog" element={<BlogsPage />} />
        <Route path="/transcript" element={<Transcript />} />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
