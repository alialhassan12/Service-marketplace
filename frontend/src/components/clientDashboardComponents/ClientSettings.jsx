import { Card, Flex, Heading, Text, Grid, Button, Dialog, TextField, AlertDialog } from "@radix-ui/themes";
import { Moon, Sun, Key, Trash2, Loader2 } from "lucide-react";
import { useTheme } from "../../contexts/useTheme";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";

export default function ClientSettings() {
    const { theme, setTheme } = useTheme();
    const {isResettingPassword,resetPassword,isDeletingAccount,deleteAccount}=useAuthStore();
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [openDeleteAccount, setOpenDeleteAccount] = useState(false);

    const handleResetPassword = async () => {
        setError("");
        
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        const {success}=await resetPassword(password,confirmPassword);
        if(success){
            setOpen(false);
            setPassword("");
            setConfirmPassword("");
        }
    };
    const handleDeleteAccount=async()=>{
        setOpenDeleteAccount(true);
        await deleteAccount();
        setOpenDeleteAccount(false);
    };

    return (
        <div className="w-full p-6 md:p-10" data-aos="fade-up">
            <Flex direction="column" gap="5" className="w-full max-w-4xl">
                <div className="space-y-2">
                    <Heading size="8" weight="bold" className="text-primary tracking-tight">Settings</Heading>
                    <Text size="3" className="text-secondary block font-medium">Manage your dashboard preferences</Text>
                </div>

                <div className="space-y-6">
                    <div>
                        <Heading size="5" className="text-primary mb-2 font-semibold">Appearance</Heading>
                        <Text size="2" style={{marginBottom:"1rem"}}  className="text-secondary block mb-5">Choose the theme that works best for you</Text>
                        
                        <Grid columns={{ initial: '1', sm: '2' }} gap="4" width="100%">
                            <div 
                                onClick={() => setTheme('light')}
                                className={`cursor-pointer p-5 rounded-xl border-2 transition-all duration-200 flex flex-col gap-3 group
                                    ${theme === 'light' 
                                        ? 'bg-blue-50/50 border-blue-500 shadow-md ring-1 ring-blue-500/20' 
                                        : 'bg-card border-border-subtle hover:border-blue-300 hover:shadow-md'}`}
                            >
                                <div className={`p-2 w-fit rounded-lg transition-colors ${theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
                                    <Sun size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <Heading size="3" weight="bold" className={`mb-1 transition-colors ${theme === 'light' ? 'text-blue-700' : 'text-primary'}`}>
                                        Light Mode
                                    </Heading>
                                    <Text size="2" className="text-secondary font-medium">Clean and bright for focusing</Text>
                                </div>
                            </div>

                            <div 
                                onClick={() => setTheme('dark')}
                                className={`cursor-pointer p-5 rounded-xl border-2 transition-all duration-200 flex flex-col gap-3 group
                                    ${theme === 'dark' 
                                        ? 'bg-blue-950/20 border-blue-500 shadow-xl shadow-blue-900/10 ring-1 ring-blue-500/20' 
                                        : 'bg-card border-border-subtle hover:border-blue-400 hover:shadow-md'}`}
                            >
                                <div className={`p-2 w-fit rounded-lg transition-colors ${theme === 'dark' ? 'bg-blue-900/50 text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-blue-900/30 group-hover:text-blue-400'}`}>
                                    <Moon size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <Heading size="3" weight="bold" className={`mb-1 transition-colors ${theme === 'dark' ? 'text-blue-400' : 'text-primary'}`}>
                                        Dark Mode
                                    </Heading>
                                    <Text size="2" className="text-secondary font-medium">Easy on the eyes for night</Text>
                                </div>
                            </div>
                        </Grid>
                    </div>

                    <div>
                        <Heading size="5" className="text-primary mb-2 font-semibold">Account Security</Heading>
                        <Text size="2" style={{marginBottom:"1rem"}} className="text-secondary block mb-5">Manage your account access and security</Text>
                        
                        <div className="p-5 rounded-xl border-2 border-border-subtle bg-card">
                            <Flex justify="between" align="center" gap="4" wrap="wrap">
                                <Flex align="center" gap="4">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                        <Key size={24} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <Heading size="3" weight="bold" className="text-primary mb-1">Forgot Password?</Heading>
                                        <Text size="2" className="text-secondary font-medium">Reset your password to regain access</Text>
                                    </div>
                                </Flex>
                                
                                <Dialog.Root open={open} onOpenChange={setOpen}>
                                    <Dialog.Trigger>
                                        <Button variant="outline" size="2" className="cursor-pointer font-medium">
                                            Reset Password
                                        </Button>
                                    </Dialog.Trigger>

                                    <Dialog.Content style={{ maxWidth: 450 }}>
                                        <Dialog.Title>Reset Password</Dialog.Title>
                                        <Dialog.Description size="2" mb="4">
                                            Enter your new password below.
                                        </Dialog.Description>

                                        <Flex direction="column" gap="3">
                                            <label>
                                                <Text as="div" size="2" mb="1" weight="bold">
                                                    New Password
                                                </Text>
                                                <TextField.Root 
                                                    type="password"
                                                    placeholder="Enter new password" 
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </label>
                                            <label>
                                                <Text as="div" size="2" mb="1" weight="bold">
                                                    Confirm Password
                                                </Text>
                                                <TextField.Root 
                                                    type="password"
                                                    placeholder="Confirm new password" 
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />
                                            </label>
                                        </Flex>
                                        
                                        {error && (
                                            <Text color="red" size="2" mt="2">
                                                {error}
                                            </Text>
                                        )}

                                        <Flex gap="3" mt="4" justify="end">
                                            <Dialog.Close>
                                                <Button variant="soft" color="gray">
                                                    Cancel
                                                </Button>
                                            </Dialog.Close>
                                            <Button onClick={handleResetPassword} disabled={isResettingPassword}>
                                                {isResettingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />: "Reset Password"}
                                            </Button>
                                        </Flex>
                                    </Dialog.Content>
                                </Dialog.Root>
                            </Flex>
                        </div>
                    </div>

                    <div>
                        <Heading size="5" className="text-red-600 mb-2 font-semibold flex items-center gap-2">
                            Danger Zone
                        </Heading>
                        <Text size="2" style={{marginBottom:"1rem"}} className="text-secondary block mb-5">Irreversible actions for your account</Text>
                        
                        <div className="p-5 rounded-xl border-2 border-red-200 bg-red-50/30">
                            <Flex justify="between" align="center" gap="4" wrap="wrap">
                                <Flex align="center" gap="4">
                                    <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                        <Trash2 size={24} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <Heading size="3" weight="bold" className="text-primary mb-1">Delete Account</Heading>
                                        <Text size="2" className="text-secondary font-medium">Permanently remove your account and data</Text>
                                    </div>
                                </Flex>
                                <AlertDialog.Root open={openDeleteAccount} onOpenChange={setOpenDeleteAccount}>
                                    <AlertDialog.Trigger>
                                        <Button variant="solid" color="red" size="2" className="cursor-pointer font-medium bg-red-600 hover:bg-red-700 text-white">
                                            Delete Account
                                        </Button>
                                    </AlertDialog.Trigger>
                                    <AlertDialog.Content style={{ maxWidth: 450 }}>
                                        <AlertDialog.Title>Delete Account</AlertDialog.Title>
                                        <AlertDialog.Description size="2">
                                            Are you sure? This action is permanent and cannot be undone. All your data will be lost.
                                        </AlertDialog.Description>

                                        <Flex gap="3" mt="4" justify="end">
                                            <AlertDialog.Cancel>
                                                <Button variant="soft" color="gray" className="cursor-pointer">
                                                    Cancel
                                                </Button>
                                            </AlertDialog.Cancel>
                                            <AlertDialog.Action>
                                                <Button variant="solid" color="red" className="cursor-pointer bg-red-600 hover:bg-red-700 text-white" 
                                                    onClick={handleDeleteAccount} disabled={isDeletingAccount}
                                                >
                                                    {isDeletingAccount ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Delete Account"}
                                                </Button>
                                            </AlertDialog.Action>
                                        </Flex>
                                    </AlertDialog.Content>
                                </AlertDialog.Root>
                            </Flex>
                        </div>
                    </div>
                </div>
            </Flex>
        </div>
    );
}