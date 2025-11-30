import { useNavigate } from "react-router-dom";

export default function NavBar(){
    const navigate = useNavigate();
    return(
        <div className="flex justify-between items-center ">
            <div className="text-2xl font-bold">SkillHub</div>
            <div >
                <ul className="flex justify-between items-center gap-5">
                    <li><a href="/">Browse</a></li>
                    <li><a href="/">How it works</a></li>
                    <li><button className="btn btn-primary">Post a Job</button></li>
                    <li><button className="btn btn-neutral btn-outline" onClick={() => navigate("/login")}>Log in</button></li>
                </ul>
            </div>
        </div>
    );
}