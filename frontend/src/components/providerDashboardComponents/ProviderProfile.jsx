import { useRef, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { Button, TextArea, TextField,Badge, IconButton, Flex, Text } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Cross2Icon } from "@radix-ui/react-icons";

export default function ProviderProfile(){
    const [skills, setSkills] = useState(["Laravel", "React"]);
    const [inputValue, setInputValue] = useState("");

    const {authUser}=useAuthStore();
    const profileImageRef=useRef();
    const [profileImage,setProfileImage]=useState(authUser.profile_picture);
    
    const handleProfileImageChange=async(e)=>{
        const file=e.target.files[0];
        if(file){
            const reader=new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend=()=>{
                setProfileImage(reader.result);
            }
        }
    }
    const addSkill = () => {
        const value = inputValue.trim();
        if (value.length === 0) return;
        if (!skills.includes(value)) {
        setSkills([...skills, value]);
        }
        setInputValue("");
    };

    const removeSkill = (skill) => {
        setSkills(skills.filter((s) => s !== skill));
    };

    return(
        <div className="flex flex-col w-full p-10" data-aos="fade-up">
            <h1 className="text-2xl font-bold">Profile Setup</h1>
            <div className="flex flex-col w-full mt-5 gap-2">
                {/* profile image */}
                <div className="flex flex-col gap-2">
                    <p>Profile Picture</p>
                    <div className="flex items-center gap-2">
                        {profileImage!=undefined?
                        (<img src={profileImage} className="w-24 h-24 rounded-full" />):
                        <div className="flex items-center justify-center text-2xl w-24 h-24 rounded-full bg-gray-200">{authUser.name.charAt(0)}</div>}
                        <Button variant="soft"  onClick={()=>profileImageRef.current.click()}>Upload Photo</Button>
                        <input type="file" ref={profileImageRef} onChange={handleProfileImageChange} hidden />
                    </div>
                </div>
                {/* name */}
                <div className="flex flex-col gap-2">
                    <p>Name</p>
                    <TextField.Root variant="soft" size="3" placeholder="e.g. John Doe" value={authUser.name}>
                        <TextField.Slot>
                            <MagnifyingGlassIcon height="16" width="16" />
                        </TextField.Slot>
                    </TextField.Root>
                </div>
                {/* bio */}
                <div className="flex flex-col gap-2">
                    <p>Bio</p>
                    <TextArea variant="soft" size="3" placeholder="Tell us about yourself" />
                </div>
                {/* Skills */}
                <div className="flex flex-col gap-2">
                    <p>Skills</p>
                    <div className="flex items-center flex-wrap gap-2 p-2 border rounded-xl">
                        {/* Tags */}
                        {skills.map((skill) => (
                        <Badge
                            key={skill}
                            color="gray"
                            radius="full"
                            variant="soft"
                            className="flex items-center gap-1 pr-1"
                        >
                            {skill}
                            <IconButton
                                variant="ghost"
                                color="gray"
                                radius="full"
                                size="1"
                                onClick={() => removeSkill(skill)}
                            >
                                <Cross2Icon />
                            </IconButton>
                        </Badge>
                        ))}

                        {/* Add Skill Input */}
                        <TextField.Root
                            placeholder="Add a skill"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                e.preventDefault();
                                addSkill();
                                }
                            }}
                            className="min-w-[120px] w-auto"
                            variant="soft"
                            size="2"
                        />
                    </div>
                </div>
                {/* location */}
                <div className="flex flex-col gap-2">
                    <p>Location</p>
                    <TextField.Root variant="soft" size="3" placeholder="e.g. New York, USA" value={authUser.location} />
                </div>
                {/* save button */}
                <Button variant="soft" color="teal" size="3" className="mt-5">Save Changes</Button>
            </div>
        </div>
    )
}