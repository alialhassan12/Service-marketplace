import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { TextField } from "@radix-ui/themes";
import Switch from '@mui/material/Switch';
import FormControlLabel from "@mui/material/FormControlLabel";
import { Card, Text, Flex, Button } from "@radix-ui/themes";
import * as Slider from "@radix-ui/react-slider";
import { useState } from "react";

export default function ProviderBrowseJobs(){
    const [range, setRange] = useState([100, 1000]);
    const [isRemote, setIsRemote] = useState(false);
    
    return(
        <div className="flex flex-col w-full p-10 border-b-2 border-gray-200" data-aos="fade-up">
            <h1 className="text-2xl font-bold">Browse Jobs</h1>
            <div className="flex flex-col w-full mt-5">
                {/* search bar */}
                <div className="w-full">
                    <TextField.Root variant="soft" size="3" placeholder="Search By Job Title" >
                        <TextField.Slot>
                            <MagnifyingGlassIcon height="16" width="16" />
                        </TextField.Slot>
                    </TextField.Root>
                </div>
                <div className="flex flex-row flex-wrap mt-5 w-full gap-5 items-center">
                    {/* location */}
                    <div className="w-[300px] space-y-2" >
                        <p>Location</p>
                        {/* location field */}
                        <TextField.Root disabled={isRemote} variant="soft" size="3" placeholder="e.g. Beirut, Lebanon" >
                            <TextField.Slot>
                                <MagnifyingGlassIcon height="16" width="16" />
                            </TextField.Slot>
                        </TextField.Root>
                        {/* isRemote switch */}
                        <FormControlLabel
                            value={isRemote}
                            control={<Switch color="primary" />}
                            label="Remote"
                            labelPlacement="end"
                            onChange={(e) => setIsRemote(e.target.checked)}
                        />
                    </div>
                    {/* priceRange */}
                    <div className="w-[300px] flex flex-col space-y-2" >
                        {/* Title */}
                        <p className="text-gray-800">
                        Price Range
                        </p>
                        {/* Current Value */}
                        <Flex justify="between" className="text-sm text-gray-600">
                            <p>Min: ${range[0]}</p>
                            <p>Max: ${range[1]}</p>
                        </Flex>
                        {/* Slider */}
                        <Slider.Root
                            value={range}
                            onValueChange={setRange}
                            min={0}
                            max={5000}
                            step={2}
                            className="relative flex items-center select-none touch-none w-full h-5"
                        >
                            <Slider.Track className="bg-gray-200 relative grow rounded-full h-[4px]">
                                <Slider.Range className="absolute h-full rounded-full bg-indigo-500" />
                            </Slider.Track>
                            <Slider.Thumb className="block w-5 h-5 bg-white shadow-md border border-gray-300 rounded-full hover:shadow-lg focus:outline-none" />
                            <Slider.Thumb className="block w-5 h-5 bg-white shadow-md border border-gray-300 rounded-full hover:shadow-lg focus:outline-none" />
                        </Slider.Root>
                    </div>
                </div>
            </div>
        </div>
    )
}