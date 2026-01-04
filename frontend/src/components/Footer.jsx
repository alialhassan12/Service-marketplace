export default function Footer(){
    return(
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
            <ul className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 w-full md:w-auto">
                <li><a href="" className="text-secondary hover:text-blue-500 transition-colors">About</a></li>
                <li><a href="" className="text-secondary hover:text-blue-500 transition-colors">Contact</a></li>
                <li><a href="" className="text-secondary hover:text-blue-500 transition-colors">Terms of Service</a></li>
                <li><a href="" className="text-secondary hover:text-blue-500 transition-colors">Privacy Policy</a></li>
            </ul>
            <p className="text-center text-secondary text-sm order-last md:order-none">© {new Date().getFullYear()} SkillHub. All rights reserved.</p>
        </div>
    );
}