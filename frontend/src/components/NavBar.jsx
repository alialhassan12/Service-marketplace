import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Button } from "@radix-ui/themes";
import * as Dialog from '@radix-ui/react-dialog';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

export default function NavBar(){
    const {authUser}=useAuthStore();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return(
        <div className="flex justify-between items-center relative">
            <div className="text-2xl font-bold text-gray-900">SkillHub</div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
                <ul className="flex justify-between items-center gap-5">
                    <li><a href="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Browse</a></li>
                    <li><a href="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">How it works</a></li>
                    <li><Button size="2" variant="soft" color="blue" style={{cursor:"pointer", fontWeight: '600'}} >Post a Job</Button></li>
                    <li><Button size="2" variant="soft" color="gray" style={{cursor:"pointer", fontWeight: '600'}} onClick={() => navigate("/login")}>Log in</Button></li>
                </ul>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
                <button 
                    onClick={() => setIsMenuOpen(true)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <MenuIcon />
                </button>
            </div>

            {/* Mobile Menu Drawer (Radix Dialog) */}
            <Dialog.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay md:hidden" />
                    <Dialog.Content className="DialogContent md:hidden flex flex-col h-full bg-white p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-8">
                            <div className="text-2xl font-bold text-gray-900">SkillHub</div>
                            <Dialog.Close asChild>
                                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                                    <CloseIcon />
                                </button>
                            </Dialog.Close>
                        </div>
                        
                        <div className="flex flex-col space-y-6">
                            <a href="/" className="text-lg font-medium text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Browse</a>
                            <a href="/" className="text-lg font-medium text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>How it works</a>
                            <hr className="border-gray-100" />
                            <a href="/login" className="text-lg font-medium text-gray-700 hover:text-blue-600 cursor-pointer" onClick={() => { navigate("/login"); setIsMenuOpen(false); }}>Log in</a>
                            <a href="/login" className="text-lg font-medium text-gray-700 hover:text-blue-600 cursor-pointer" onClick={() => { navigate("/login"); setIsMenuOpen(false); }}>Post a Job</a>
                            {/* <Button  size="2" variant="soft" color="blue" style={{cursor:"pointer", width: '100%', fontWeight: '600'}} >Post a Job</Button>
                            <Button size="2" variant="soft" color="gray" style={{cursor:"pointer", width: '100%', fontWeight: '600'}} onClick={() => { navigate("/login"); setIsMenuOpen(false); }}>Log in</Button> */}
                        </div>

                        <Dialog.Title className="sr-only">Mobile Navigation Menu</Dialog.Title>
                        <Dialog.Description className="sr-only">Navigation links for mobile users</Dialog.Description>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

        </div>
    );
}