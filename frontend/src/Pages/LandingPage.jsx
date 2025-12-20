import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import 'aos/dist/aos.css';
//images
import LandingImage from "../assets/landingImage.png";
import h1 from "../assets/h1.jpg";
import h2 from "../assets/h2.jpg";
import h3 from "../assets/h3.jpg";
//icons
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import GppGoodIcon from '@mui/icons-material/GppGood';
import { Button, Flex, Text } from "@radix-ui/themes";

export default function LandingPage(){
    return(
        <div className="bg-gray-50 min-h-screen flex flex-col">
             {/* Navbar Container */}
            <div className="pl-4 pr-4 md:pl-20 md:pr-20 pt-5 pb-5 border-b border-gray-200 bg-white sticky top-0 z-50">
                <NavBar/>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-5 md:ml-20 md:mr-20" data-aos="fade-up">
                
                {/* Hero Section - Split Layout */}
                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 mt-10 md:mt-20 mb-20">
                    
                    {/* Left: Text Content */}
                    <div className="flex-1 text-center md:text-left space-y-6">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
                            Find the best <span className="text-blue-600">freelancers</span> for any job
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto md:mx-0 leading-relaxed">
                            Millions of people use SkillHub to turn their skills into money. Start your journey today and connect with top talent.
                        </p>
                        
                        <Flex gap="5" direction={{ initial: 'column', xs: 'row' }} align="center" justify={{ initial: 'center', md: 'start' }} className="pt-4">
                            <Button 
                                size={{ initial: '3', md: '4' }} 
                                variant="solid" 
                                color="blue" 
                                highContrast 
                                style={{ cursor: 'pointer', fontWeight: 'bold', paddingLeft: '32px', paddingRight: '32px' }}
                            >
                                Post a Job
                            </Button>
                            <Button 
                                size={{ initial: '3', md: '4' }} 
                                variant="outline" 
                                color="gray" 
                                highContrast 
                                style={{ cursor: 'pointer', fontWeight: 'bold', paddingLeft: '32px', paddingRight: '32px' }}
                            >
                                Become a Provider
                            </Button>
                        </Flex>
                        
                        {/* Stats or Trust Markers (Optional Enhancement) */}
                        <div className="pt-8 flex items-center justify-center md:justify-start gap-8 text-gray-500 text-sm font-semibold">
                            <div className="flex items-center gap-2">
                                <PeopleIcon className="text-blue-500" /> <span>1M+ Users</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <GppGoodIcon className="text-green-500" /> <span>Verified Pros</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Image */}
                    <div className=" flex-1 w-full max-w-2xl lg:translate-y-[-100px] md:translate-y-[-100px]">
                        <div className="relative group">
                            {/* Decorative Blur Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            
                            <img 
                                className="relative w-full h-auto object-cover rounded-2xl shadow-2xl transform transition-transform duration-500 ease-out group-hover:scale-[1.02] group-hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]" 
                                src={LandingImage}
                                alt="Freelancers collaboration"
                            />
                        </div>
                    </div>
                </div>

                {/* why choose section */}
                <div data-aos="fade-up" className="mt-20 md:mt-32">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900">Why choose SkillHub?</h1>
                        <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">We connect you with the best talent and provide a secure platform for your projects.</p>
                    </div>
                    
                    {/* cards*/}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="group rounded-2xl border border-gray-100 p-8 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="p-3 bg-blue-50 rounded-lg w-fit mb-6">
                                <SearchIcon className="text-blue-600 font-large scale-125"/>
                            </div>
                            <h2 className="text-gray-900 font-bold text-xl mb-3">Find the right talent</h2>
                            <p className="text-gray-500 leading-relaxed">Browse thousands of skilled professionals and find the perfect match for your needs.</p>
                        </div>
                        <div className="group rounded-2xl border border-gray-100 p-8 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="p-3 bg-indigo-50 rounded-lg w-fit mb-6">
                                <PeopleIcon className="text-indigo-600 font-large scale-125"/>
                            </div>
                            <h2 className="text-gray-900 font-bold text-xl mb-3">Collaborate effectively</h2>
                            <p className="text-gray-500 leading-relaxed">Our platform offers tools for seamless communication and project management.</p>
                        </div>
                        <div className="group rounded-2xl border border-gray-100 p-8 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="p-3 bg-green-50 rounded-lg w-fit mb-6">
                                <GppGoodIcon className="text-green-600 font-large scale-125"/>
                            </div>
                            <h2 className="text-gray-900 font-bold text-xl mb-3">Secure payments</h2>
                            <p className="text-gray-500 leading-relaxed">All payments are processed through secure payment gateways ensuring your money is safe.</p>
                        </div>
                    </div>
                </div>

                {/* how it works section */}
                <div data-aos="fade-up" className="mt-20 md:mt-32">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900">How it works?</h1>
                        <p className="mt-4 text-xl text-gray-500">Get your project started in a few simple steps.</p>
                    </div>

                    {/* cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center md:text-left">
                        <div className="flex flex-col h-full">
                            <div className="overflow-hidden rounded-2xl mb-6">
                                <img className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500" src={h1} alt="Post job" />
                            </div>
                            <h2 className="text-gray-900 font-bold text-xl mb-2">1. Post your job</h2>
                            <p className="text-gray-500">Describe your job requirements and budget clearly to attract the right talent.</p>
                        </div>
                        <div className="flex flex-col h-full">
                            <div className="overflow-hidden rounded-2xl mb-6">
                                <img className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500" src={h2} alt="Review proposals" />
                            </div>
                            <h2 className="text-gray-900 font-bold text-xl mb-2">2. Review Proposals</h2>
                            <p className="text-gray-500">Receive proposals from qualified freelancers and review their detailed profiles.</p>
                        </div>
                        <div className="flex flex-col h-full">
                            <div className="overflow-hidden rounded-2xl mb-6">
                                <img className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500" src={h3} alt="Collaborate" />
                            </div>
                            <h2 className="text-gray-900 font-bold text-xl mb-2">3. Hire and collaborate</h2>
                            <p className="text-gray-500">Choose the best freelancers and start working together on your project.</p>
                        </div>
                    </div>
                </div>

                {/* ready section */}
                <div data-aos="fade-up" className="mt-20 md:mt-32 mb-20">
                    <div className="bg-indigo-600 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl">
                        <h1 className="text-3xl md:text-5xl font-bold mb-6">Ready to get started?</h1>
                        <p className="text-lg md:text-2xl text-indigo-100 mb-8 max-w-2xl mx-auto">Join SkillHub today and start connecting with top talent to bring your ideas to life.</p>
                        <div>
                            <button className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
                                Get Started Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="pl-4 pr-4 md:pl-20 md:pr-20 pt-5 pb-5 border-t border-gray-200 bg-white">
                <Footer/>
            </div>
        </div>
    );
}