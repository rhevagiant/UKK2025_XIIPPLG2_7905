import { Box, Typography, Paper, ListItem, List, Grid } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { bluegray } from "../../../themes/color";
import { useEffect, useState } from "react";
import { getAllTasks } from "../../../store/endpoint/task/taskAPI";
import Taskamico from "../../../../public/Task-amico.svg"

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getAllTasks();
                const filteredTasks = data.filter(task => task.status !== "COMPLETE");
                setTasks(filteredTasks);
            } catch (error) {
                console.error("Failed to fetch tasks", error);
            }
        };
        fetchTasks();
    }, []);

    return (
        <Grid container spacing={0} sx={{ height: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", }}>

            <Grid item xs={12} sm={6} >
                <Box>
                <img src={Taskamico} alt="dashboard"  width="100%" style={{width:"350px", height:"350px"}}/>
                </Box>

            </Grid>

            <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 4, width: "100%", overflowY: "auto", maxWidth: 500, bgcolor: bluegray[700], boxShadow: 3, borderRadius: 2, color: "white" }}>
                    <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
                        <strong>Dashboard</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        This is your task that NOT COMPLETE
                    </Typography>
                    {tasks.length > 0 ? (
                        <List sx={{ maxHeight: 200, overflowY: "auto" }}>
                            {tasks.map((task, index) => (
                                <ListItem key={index} sx={{ display: "flex", alignItems: "center" }}>
                                    <AssignmentIcon sx={{ mr: 1, color: "white" }} />
                                    {task.task}
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2" color="white">
                            No tasks available.
                        </Typography>
                    )}

                </Paper>

            </Grid>

        </Grid>

    );
}
