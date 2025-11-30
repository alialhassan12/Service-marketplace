export default function Footer(){
    return(
        <div className="flex flex-col ">
            <ul className="flex  justify-between items-center">
                <li><a href="">About</a></li>
                <li><a href="">Contact</a></li>
                <li><a href="">Terms of Service</a></li>
                <li><a href="">Privacy Policy</a></li>
            </ul>
            <p className="text-center mt-10">© 2025 SkillHub. All rights reserved.</p>
        </div>
    );
}