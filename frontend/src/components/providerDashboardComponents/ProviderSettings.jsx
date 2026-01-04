import { Card, Flex, Heading, Text, Grid } from "@radix-ui/themes";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../contexts/useTheme";

export default function ProviderSettings() {
    const { theme, setTheme } = useTheme();

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
                        <Text size="2" style={{marginBottom:"1rem"}} className="text-secondary block mb-5">Choose the theme that works best for you</Text>
                        
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
                </div>
            </Flex>
        </div>
    );
}
