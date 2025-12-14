import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Button } from "@radix-ui/themes";

export default function NavBar(){
    const {authUser}=useAuthStore();
    const navigate = useNavigate();
    return(
        <div className="flex justify-between items-center ">
            <div className="text-2xl font-bold">SkillHub</div>
            <div >
                <ul className="flex justify-between items-center gap-5">
                    <li><a href="/">Browse</a></li>
                    <li><a href="/">How it works</a></li>
                    <li><Button size={{ initial: '2', md: '2' }} variant="soft" color="blue" style={{cursor:"pointer"}} >Post a Job</Button></li>
                    <li><Button size={{ initial: '2', md: '2' }} variant="soft" color="gray" style={{cursor:"pointer"}} onClick={() => navigate("/login")}>Log in</Button></li>
                </ul>
            </div>
        </div>
    );
}