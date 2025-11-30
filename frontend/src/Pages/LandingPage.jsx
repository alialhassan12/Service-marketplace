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

export default function LandingPage(){
    return(
        <div>
            <div className="pl-20 pr-20 pt-5 pb-5 border-b-1 border-gray-200">
                <NavBar/>
            </div>
            <div className="p-5 ml-20 mr-20 " data-aos="fade-up">
                {/* landing image */}
                <div className="relative">
                    <img className="w-full h-[500px] rounded-xl" src={LandingImage}/>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                            w-full h-[500px] gap-5 flex flex-col justify-center items-center bg-[#33333380] rounded-2xl">
                        <h1 className="text-4xl font-bold text-white p-5">Find the best freelancers for any job</h1>
                        <p className="text-white p-5">Millions of people use Freelancer to turn their skills into money. Start now.</p>
                        <div className="flex flex-wrap justify-center items-center gap-5">
                            <button className="btn btn-primary">Post a Job</button>
                            <button className="btn btn-soft">Become a Provider</button>
                        </div>
                    </div>
                </div>
                {/* why choose section */}
                <div data-aos="fade-up" className="mt-10">
                    <h1 className="text-4xl font-bold">Why choose SkillHub?</h1>
                    <p className="mt-5 text-2xl">we connect you with the best talent and provide a secure platform for you projects.</p>
                    {/* cards*/}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                        <div className="rounded-xl border border-gray-200 p-4 max-w-sm bg-white shadow-sm">
                            <SearchIcon/>
                            <h2 className="text-gray-900 font-semibold text-base mt-5">Find the right talent</h2>
                            <p className="text-gray-500 text-sm leading-relaxed">Browse thousands of skilled professionals ad find the perfect match for your needs.</p>
                        </div>
                        <div className="rounded-xl border border-gray-200 p-4 max-w-sm bg-white shadow-sm">
                            <PeopleIcon/>
                            <h2 className="text-gray-900 font-semibold text-base mt-5">Collaborate effictively</h2>
                            <p className="text-gray-500 text-sm leading-relaxed">Our Platform offers tools for seamles communication and project management.</p>
                        </div>
                        <div className="rounded-xl border border-gray-200 p-4 max-w-sm bg-white shadow-sm">
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
                            <img className="rounded-2xl " src={h1} alt="" />
                            <h2 className="text-gray-900 font-semibold text-base mt-5">Post your job</h2>
                            <p className="text-gray-500 text-sm leading-relaxed">Describe your job requirments nad budget.</p>
                        </div>
                        <div className="">
                            <img className="rounded-2xl max-h-[200px] w-full" src={h2} alt="" />
                            <h2 className="text-gray-900 font-semibold text-base mt-5">Review Proposals</h2>
                            <p className="text-gray-500 text-sm leading-relaxed">Recieve proposals from qualified freelancers and review the profiles.</p>
                        </div>
                        <div className="">
                            <img className="rounded-2xl max-h-[200px] w-full" src={h3} alt="" />
                            <h2 className="text-gray-900 font-semibold text-base mt-5">Hire and collaborate</h2>
                            <p className="text-gray-500 text-sm leading-relaxed">Choose the best freelancers and start working together on your project.</p>
                        </div>
                    </div>
                </div>
                {/* ready section */}
                <div data-aos="fade-up" className="mt-30 mb-30 flex flex-col justify-center items-center">
                    <h1 className="text-4xl font-bold">Ready to get started?</h1>
                    <p className="mt-5 text-2xl">Join SkillHub and start connecting with Top talent.</p>
                    <button className="btn btn-primary mt-5">Get Started</button>
                </div>
            </div>
            <div className="pl-20 pr-20 pt-5 pb-5 border-t-1 border-gray-200">
                <Footer/>
            </div>
        </div>
    );
}