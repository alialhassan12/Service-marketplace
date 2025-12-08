import "aos/dist/aos.css";
import LoginImage from "../assets/loginImg.jpg";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function LoginPage() {
  const { login, isLogging } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //handlers
  const handleEmailChange = (e) => {
    setFormData({ ...formData, email: e.target.value });
  };
  const handlePasswordChange = (e) => {
    setFormData({ ...formData, password: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);

    // If login successful, navigate to dashboard
    // App.jsx will handle role-based routing automatically
    if (result?.success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex flex-row w-screen h-screen gap-10">
      {/* left side */}
      <div className="w-[50%] relative" data-aos="fade-right">
        <img className="w-full h-full" src={LoginImage} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full p-10 flex flex-col justify-center items-center">
          <h1 className="text-4xl text-white font-bold">
            Connect. Collaborate. Create.
          </h1>
          <p className="mt-5 text-2xl font-light text-white">
            Find the perfect professional for your project or showcase your
            skills to the world.
          </p>
        </div>
      </div>
      {/* right side */}
      <div
        className="w-[40%] h-full flex flex-col justify-center items-center"
        data-aos="fade-left"
      >
        <div className="w-[100%] ">
          <h1 className=" text-3xl font-bold mb-5">SkillHub</h1>
          <h2 className="text-xl font-bold">Welcome Back</h2>
          <p className="text-gray-500 ">Login to access your account</p>
          <form className="flex flex-col gap-5 mt-5" onSubmit={handleSubmit}>
            {/* email Field */}
            <TextField
              sx={{ width: "100%" }}
              id="outlined-basic"
              label="Email"
              variant="outlined"
              value={formData.email}
              onChange={handleEmailChange}
              required
            />
            {/* password Field */}
            <TextField
              sx={{ width: "100%" }}
              id="outlined-password"
              label="Password"
              type="password"
              variant="outlined"
              value={formData.password}
              onChange={handlePasswordChange}
              required
            />
            {/* login Btn */}
            <Button type="submit" disabled={isLogging} variant="contained">
              {isLogging ? (
                <span className="loading loading-infinity loading-xl text-blue-500"></span>
              ) : (
                "Login"
              )}
            </Button>
            {/* divider */}
            <Divider variant="fullWidth">
              <p>Or</p>
            </Divider>
            {/* Sign Up */}
            <p className="text-gray-500 text-center">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-500">
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
