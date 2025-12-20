import "aos/dist/aos.css";
import LoginImage from "../assets/loginImg.jpg";
import { TextField, Button, Text, Flex, Heading, Separator, RadioCards } from "@radix-ui/themes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function RegisterPage() {
  const { register, isLogging } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    location: "",
    role: "client",
  });

  //handlers
  const handleNameChange = (e) => {
    setFormData({ ...formData, name: e.target.value });
  };
  const handleEmailChange = (e) => {
    setFormData({ ...formData, email: e.target.value });
  };
  const handlePasswordChange = (e) => {
    setFormData({ ...formData, password: e.target.value });
  };
  const handlePhoneChange = (e) => {
    setFormData({ ...formData, phone_number: e.target.value });
  };
  const handleLocationChange = (e) => {
    setFormData({ ...formData, location: e.target.value });
  };
  const handleRoleChange = (value) => {
    setFormData({ ...formData, role: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(formData);

    // If registration successful, navigate to dashboard
    // App.jsx will handle role-based routing automatically
    if (result?.success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-screen min-h-screen">
      {/* Left side (Image) */}
      <div className="hidden lg:block lg:w-1/2 h-full relative overflow-hidden md:sticky md:top-0 md:h-screen" data-aos="fade-right">
        <img className="w-full h-full object-cover" src={LoginImage} alt="Register Background" />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center p-6 text-center">
            <h1 className="text-3xl md:text-5xl text-white font-bold mb-4 drop-shadow-lg">
                Join Our Community.
            </h1>
            <p className="text-lg md:text-2xl font-light text-white drop-shadow-md max-w-md">
                Find the perfect professional for your project or showcase your skills to the world.
            </p>
        </div>
      </div>

      {/* Right side (Form) */}
      <div 
        className="w-full lg:w-1/2 flex-1 flex flex-col justify-center items-center p-6 md:p-12 bg-white"
        data-aos="fade-left"
      >
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center md:text-left mt-8 md:mt-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">SkillHub</h1>
              <h2 className="text-2xl font-semibold text-gray-800">Create an Account</h2>
              <Text color="gray" size="2">Start your journey with us</Text>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* select role */}
            <div>
              <Text as="label" size="2" weight="medium" color="gray" className="mb-2 block">I am a...</Text>
              <RadioCards.Root
                defaultValue={"client"}
                value={formData.role}
                onValueChange={(value) => handleRoleChange(value)}
                columns={{ initial: "1", sm: "2" }}
              >
                <RadioCards.Item value="client" style={{ cursor: 'pointer' }}>
                  <Flex direction="column" width="100%">
                    <Text weight="bold">Client</Text>
                    <Text weight="light" size="1">Hiring for a project</Text>
                  </Flex>
                </RadioCards.Item>
                <RadioCards.Item value="provider" style={{ cursor: 'pointer' }}>
                  <Flex direction="column" width="100%">
                    <Text weight="bold">Service Provider</Text>
                    <Text weight="light" size="1">Offering skills</Text>
                  </Flex>
                </RadioCards.Item>
              </RadioCards.Root>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Flex direction="column" gap="2">
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <TextField.Root 
                        size="3" 
                        placeholder="John Doe" 
                        value={formData.name}
                        onChange={handleNameChange}
                        required
                    />
                </Flex>
                <Flex direction="column" gap="2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <TextField.Root 
                        size="3" 
                        placeholder="john@example.com" 
                        value={formData.email}
                        onChange={handleEmailChange}
                        required
                    />
                </Flex>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Flex direction="column" gap="2">
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <TextField.Root 
                        size="3" 
                        placeholder="+1 234 567 890" 
                        value={formData.phone_number}
                        onChange={handlePhoneChange}
                        required
                    />
                </Flex>
                <Flex direction="column" gap="2">
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <TextField.Root 
                        size="3" 
                        placeholder="New York, USA" 
                        value={formData.location}
                        onChange={handleLocationChange}
                        required
                    />
                </Flex>
            </div>

            <Flex direction="column" gap="2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <TextField.Root 
                    size="3" 
                    type="password" 
                    placeholder="Create a strong password" 
                    value={formData.password}
                    onChange={handlePasswordChange}
                    required
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
                "Create Account"
              )}
            </Button>

            <Flex align="center" gap="4" width="100%">
                <Separator size="4" />
                <Text color="gray" size="2">Or</Text>
                <Separator size="4" />
            </Flex>

            <Text align="center" color="gray" size="2">
              Already have an account?{" "}
              <a 
                href="/login" 
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </a>
            </Text>
          </form>
        </div>
      </div>
    </div>
  );
}
