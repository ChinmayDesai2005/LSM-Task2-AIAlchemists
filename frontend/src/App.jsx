import { Routes,Route } from "react-router-dom"
import Home from "./pages/home/Home"
import Input from "./pages/input/Input"
import Header from "./components/header/Header"
import Profile from "./pages/profile/Profile"
import BlogsPage from "./pages/blog_coverpage/BlogsPage"
import Transcript from "./pages/transcript/Transcript"


function App() {

  return (
    <>
    <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Input" element={<Input />} />
        <Route path="/Profile" element={<Profile/>} />
        <Route path="/Blog" element={<BlogsPage/>} />
        <Route path="/Transcript" element={<Transcript/>} />
      </Routes>
    </>
  )
}

export default App
