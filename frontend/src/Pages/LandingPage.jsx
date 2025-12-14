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
        <div>
            <div className="pl-20 pr-20 pt-5 pb-5 border-b-1 border-gray-200">
                <NavBar/>
            </div>
            <div className="p-5 ml-20 mr-20 " data-aos="fade-up">
                {/* Hero section */}
                <div className="relative w-full h-[60vh] min-h-[500px] rounded-2xl overflow-hidden bg-gray-900 shadow-xl">
                    <img 
                        className="w-full h-full object-cover opacity-70 transform hover:scale-105 transition-transform duration-1000" 
                        src={LandingImage}
                        alt="Hero Background"
                    />
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 bg-linear-to-t from-black/60 via-transparent to-black/30">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-2xl max-w-4xl tracking-tight">
                            Find the best freelancers for any job
                        </h1>
                        <p className="text-white text-lg md:text-xl mb-10 max-w-2xl drop-shadow-lg font-medium">
                            Millions of people use SkillHub to turn their skills into money. Start your journey today.
                        </p>
                        <Flex gap="5" direction={{ initial: 'column', sm: 'row' }} align="center">
                            <Button size={{ initial: '3', md: '4' }} variant="solid" color="blue" highContrast style={{ cursor: 'pointer', fontWeight: '600' }}>
                                Post a Job
                            </Button>
                            <Button size={{ initial: '3', md: '4' }} variant="soft" color="gray" highContrast style={{ cursor: 'pointer', fontWeight: '600', backgroundColor: 'rgba(255, 255, 255, 0.15)', color: 'white' }}>
                                Become a Provider
                            </Button>
                        </Flex>
                    </div>
                </div>
                {/* why choose section */}
                <div data-aos="fade-up" className="mt-10">
                    <h1 className="text-4xl font-bold">Why choose SkillHub?</h1>
                    <p className="mt-5 text-2xl">we connect you with the best talent and provide a secure platform for you projects.</p>
                    {/* cards*/}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                        <div className="rounded-xl border border-gray-200 p-4 max-w-sm bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-default">
                            <SearchIcon/>
                            <h2 className="text-gray-900 font-semibold text-base mt-5">Find the right talent</h2>
                            <p className="text-gray-500 text-sm leading-relaxed">Browse thousands of skilled professionals ad find the perfect match for your needs.</p>
                        </div>
                        <div className="rounded-xl border border-gray-200 p-4 max-w-sm bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-default">
                            <PeopleIcon/>
                            <h2 className="text-gray-900 font-semibold text-base mt-5">Collaborate effictively</h2>
                            <p className="text-gray-500 text-sm leading-relaxed">Our Platform offers tools for seamles communication and project management.</p>
                        </div>
                        <div className="rounded-xl border border-gray-200 p-4 max-w-sm bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-default">
                            <GppGoodIcon/>
                            <h2 className="text-gray-900 font-semibold text-base mt-5">Secure payments</h2>
                            <p className="text-gray-500 text-sm leading-relaxed">All payments are processed through secure payment gateways.</p>
                        </div>
                    </div>
                </div>
                {/* how it works section */}
                <div data-aos="fade-up" className="mt-30">
                    <h1 className="text-4xl font-bold">How it works?</h1>
                    <p className="mt-5 text-2xl">Get your project started in a few simple steps</p>
                    {/* cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                        <div className="">
                            <img className="rounded-2xl hover:scale-105 transition-transform duration-300" src={h1} alt="" />
                            <h2 className="text-gray-900 font-semibold text-base mt-5">Post your job</h2>
                            <p className="text-gray-500 text-sm leading-relaxed">Describe your job requirments nad budget.</p>
                        </div>
                        <div className="">
                            <img className="rounded-2xl max-h-[200px] w-full hover:scale-105 transition-transform duration-300" src={h2} alt="" />
                            <h2 className="text-gray-900 font-semibold text-base mt-5">Review Proposals</h2>
                            <p className="text-gray-500 text-sm leading-relaxed">Recieve proposals from qualified freelancers and review the profiles.</p>
                        </div>
                        <div className="">
                            <img className="rounded-2xl max-h-[200px] w-full hover:scale-105 transition-transform duration-300" src={h3} alt="" />
                            <h2 className="text-gray-900 font-semibold text-base mt-5">Hire and collaborate</h2>
                            <p className="text-gray-500 text-sm leading-relaxed">Choose the best freelancers and start working together on your project.</p>
                        </div>
                    </div>
                </div>
                {/* ready section */}
                <div data-aos="fade-up" className="mt-30 mb-30 flex flex-col justify-center items-center">
                    <h1 className="text-4xl font-bold">Ready to get started?</h1>
                    <p className="mt-5 text-2xl text-center">Join SkillHub and start connecting with Top talent.</p>
                    <div className="mt-5">
                        <Button size={{ initial: '3', md: '4' }} variant="solid" color="indigo" highContrast style={{ cursor: 'pointer' }}>Get Started</Button>
                    </div>
                </div>
            </div>
            <div className="pl-20 pr-20 pt-5 pb-5 border-t-1 border-gray-200">
                <Footer/>
            </div>
        </div>
    );
}