import { Cross2Icon } from "@radix-ui/react-icons";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Switch from '@mui/material/Switch';
import { useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import useClientDashboardStore from "../../store/clientDashboardStore";

export default function PostJobButton(){
    const {addJob,addingJob}=useClientDashboardStore();
    const [open, setOpen] = useState(false);
    const [formData,setFormData]=useState({
        title:"",
        description:"",
        location:"",
        is_remote:false,
        budget:0
    });
    const handleClickOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await addJob(formData);
        if(success){
            handleClose();
            setFormData({
                title:"",
                description:"",
                location:"",
                is_remote:false,
                budget:0
            });
        }
    }
    return(
        <>
            <Button variant="contained" onClick={handleClickOpen}>
                Post new job
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Post new job</DialogTitle>
                <DialogContent>
                <form>
                    {/* job title */}
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        label="Job Title"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={formData.title}
                        onChange={(e)=>setFormData({...formData,title:e.target.value})}
                    />
                    {/* job description */}
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        label="Job Description"
                        type="text"
                        fullWidth
                        variant="standard"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={(e)=>setFormData({...formData,description:e.target.value})}
                    />
                    {/* job location */}
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        label="Job Location"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={formData.location}
                        onChange={(e)=>setFormData({...formData,location:e.target.value})}
                    />
                    {/* is remote */}
                    <FormControlLabel
                        value={formData.is_remote}
                        control={<Switch color="primary" />}
                        label="Remote"
                        labelPlacement="end"
                        onChange={(e)=>setFormData({...formData,is_remote:e.target.checked})}
                    />
                    {/* budget */}
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">Budget</InputLabel>
                        <Input
                            id="standard-adornment-amount"
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            value={formData.budget}
                            onChange={(e)=>setFormData({...formData,budget:Number(e.target.value)})}
                        />
                    </FormControl>
                </form>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button disabled={addingJob} type="submit"onClick={handleSubmit} variant="contained">
                    {addingJob ? <span className="loading loading-infinity loading-xl text-blue-500"></span> : "Post"}
                </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}