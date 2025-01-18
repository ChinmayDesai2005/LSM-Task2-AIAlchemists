import { Routes,Route } from "react-router-dom"
import Home from "./pages/home/Home"
import Input from "./pages/input/Input"
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Input" element={<Input />} />
      </Routes>
    </>
  )
}

export default App
