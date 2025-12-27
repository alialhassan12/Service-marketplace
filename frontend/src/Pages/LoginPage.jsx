import "aos/dist/aos.css";
import LoginImage from "../assets/loginImg.jpg";
import { TextField, Button, Text, Flex, Heading, Separator } from "@radix-ui/themes";
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
    <div className="flex flex-col lg:flex-row w-screen h-screen">
      {/* Left side (Image) */}
      <div className="hidden lg:block lg:w-1/2 h-full relative overflow-hidden" data-aos="fade-right">
        <img className="w-full h-full object-cover" src={LoginImage} alt="Login Background" />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center p-6 text-center">
          <h1 className="text-3xl md:text-5xl text-white font-bold mb-4 drop-shadow-lg">
            Connect. Collaborate. Create.
          </h1>
          <p className="text-lg md:text-2xl font-light text-white drop-shadow-md max-w-md">
            Find the perfect professional for your project or showcase your skills to the world.
          </p>
        </div>
      </div>

      {/* Right side (Form) */}
      <div
        className="w-full lg:w-1/2 flex-1 flex flex-col justify-center items-center p-6 md:p-20 bg-white"
        data-aos="fade-down"
      >
        <div className="w-full max-w-md space-y-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">SkillHub</h1>
            <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
            <Text color="gray" size="2">Login to access your account</Text>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <Flex direction="column" gap="3">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <TextField.Root 
                    size="3" 
                    placeholder="Enter your email" 
                    value={formData.email}
                    onChange={handleEmailChange}
                    required
                    disabled={isLogging}
                />
            </Flex>

            <Flex direction="column" gap="3">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <TextField.Root 
                    size="3" 
                    type="password" 
                    placeholder="Enter your password" 
                    value={formData.password}
                    onChange={handlePasswordChange}
                    required
                    disabled={isLogging}
                />
            </Flex>

            <Button 
                size="3" 
                variant="solid" 
                type="submit" 
                disabled={isLogging} 
                style={{ width: '100%', cursor: 'pointer', marginTop: '10px' }}
            >
              {isLogging ? (
                <span className="loading loading-dots loading-md"></span>
              ) : (
                "Login"
              )}
            </Button>

            <Flex align="center" gap="4" width="100%">
                <Separator size="4" />
                <Text color="gray" size="2">Or</Text>
                <Separator size="4" />
            </Flex>

            <Text align="center" color="gray" size="2">
              Don't have an account?{" "}
              <a 
                href="/register" 
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign Up
              </a>
            </Text>
          </form>
        </div>
      </div>
    </div>
  );
}
