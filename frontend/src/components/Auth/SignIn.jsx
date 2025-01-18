import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Main.css";
import { FaFacebook, FaGoogle, FaLinkedin, FaEye, FaEyeSlash } from 'react-icons/fa'; // Add eye icons for password toggle
import { toast } from 'react-toastify';
import axios from "axios";
import { UserState } from "../../Context/UserContext";

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const {setUser} = UserState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/v1/user/login", {
        email,
        password
      },{withCredentials: true});

      if (response.status === 200) {
        localStorage.setItem('MapMyForestUser',JSON.stringify(response.data.user))
        localStorage.setItem('accessToken',JSON.stringify(response.data.accessToken))
        setUser(response.data.user)
        toast.success(response.data.message);
        navigate('/project');
      }
    } catch (err) {
      if (err.response && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      
      <div className="password-input-container">
        <input 
          type={showPassword ? "text" : "password"} // Dynamically change input type
          placeholder="Password" 
          required 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <span onClick={() => setShowPassword(!showPassword)} className="toggle-password-icon">
          {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Toggle icon */}
        </span>
      </div>

      <button type="submit">Login</button>

      <div className="social-login">
        <p>Continue with</p>
        <div className="icon-container">
          <a href="https://google.com" className="icon" aria-label="Google" target="_blank" rel="noopener noreferrer">
            <FaGoogle />
          </a>
          <a href="https://facebook.com" className="icon" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
          </a>
          <a href="https://linkedin.com" className="icon" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </form>
  );
}

export default SignIn;
