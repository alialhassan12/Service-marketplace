import 'aos/dist/aos.css';
import LoginImage from "../assets/loginImg.jpg";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { RadioCards,Flex,Text } from '@radix-ui/themes';
import { useState } from 'react';

export default function RegisterPage() {
    // const [role,setRole]=useState("client");
    const [formData,setFormData]=useState({
        name:"",
        email:"",
        password:"",
        phone_number:"",
        location:"",
        role:"client"
    });

    //handlers
    const handleNameChange=(e)=>{
        setFormData({...formData,"name":e.target.value});
    }
    const handleEmailChange=(e)=>{
        setFormData({...formData,"email":e.target.value});
    }
    const handlePasswordChange=(e)=>{
        setFormData({...formData,"password":e.target.value});
    }
    const handlePhoneChange=(e)=>{
        setFormData({...formData,"phone_number":e.target.value});
    }
    const handleLocationChange=(e)=>{
        setFormData({...formData,"location":e.target.value});
    }
    const handleRoleChange=(value)=>{
        // setRole(value);
        setFormData({...formData,role:value});
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log(formData);
    }

    return (
        <div className="flex flex-row w-screen gap-10">
            {/* left side */}
            <div className="w-[50%] sticky top-0 left-0 h-[100vh]" data-aos="fade-right">
                <img className="w-full h-full" src={LoginImage}/>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full p-10 flex flex-col justify-center items-center">
                    <h1 className="text-4xl text-white font-bold">Join Our Community.</h1>
                    <p className="mt-5 text-2xl font-light text-white">Find the perfect professional for your project or showcase your skills to the world.</p>
                </div>
            </div>
            {/* right side */}
            <div className="w-[40%] flex flex-col justify-center items-center" data-aos="fade-left">
                <div className="w-[100%] h-full ">
                    <h1 className="text-3xl font-bold mb-5 mt-10">SkillHub</h1>
                    <h2 className="text-2xl font-medium">Createn an Account</h2>
                    <p className='text-gray-500'>Start your journey with us</p>
                    <form className='flex flex-col gap-5 mt-5'>
                        {/* select role */}
                        <div className="">
                            <RadioCards.Root
                                defaultValue={"client"}
                                value={formData.role} onValueChange={(value)=>handleRoleChange(value)}
                                columns={{ initial: "1", sm: "2" }}
                                >
                                <RadioCards.Item value="client">
                                    <Flex direction="column" width="100%">
                                        <Text weight="bold">I am a Client</Text>
                                        <Text weight="light">Looking to hire for a project</Text>
                                    </Flex>
                                </RadioCards.Item>
                                <RadioCards.Item value="provider">
                                    <Flex direction="column" width="100%">
                                        <Text weight="bold">I am a Service Provider</Text>
                                        <Text weight="light">Offering my skills to the world</Text>
                                    </Flex>
                                </RadioCards.Item>
                            </RadioCards.Root>
                        </div>
                        {/* name Field */}
                        <TextField sx={{width:"100%"}} label="Name" variant="outlined" 
                            value={formData.name} onChange={(e)=>handleNameChange(e)} />
                        {/* email Field */}
                        <TextField sx={{width:"100%"}} label="Email" variant="outlined" 
                            value={formData.email} onChange={(e)=>handleEmailChange(e)} />
                        {/* password Field */}
                        <TextField sx={{width:"100%"}} label="Password" variant="outlined" 
                            value={formData.password} onChange={(e)=>handlePasswordChange(e)} />
                        {/* phone number Field */}
                        <TextField sx={{width:"100%"}} label="Phone Number" variant="outlined" 
                            value={formData.phone_number} onChange={(e)=>handlePhoneChange(e)} />
                        {/* location Field */}
                        <TextField sx={{width:"100%"}} label="Location" variant="outlined" 
                            value={formData.location} onChange={(e)=>handleLocationChange(e)} />
                        {/* create Btn */}
                        <Button variant="contained" onClick={handleSubmit}>Create Account</Button>
                        {/* divider */}
                        <Divider variant="fullWidth" >
                            <p>Or</p>
                        </Divider>
                        {/* login btn */}
                        <p className='text-gray-500 text-center'>Already have an account? <a href='/login' className='text-blue-500'>Login</a></p>
                    </form>
                </div>
            </div>
        </div>
    );
}