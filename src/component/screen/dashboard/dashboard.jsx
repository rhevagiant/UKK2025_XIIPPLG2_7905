import { Box, Typography, Paper, ListItem, List, Grid } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { bluegray } from "../../../themes/color";
import { useEffect, useState } from "react";
import { getAllTasks } from "../../../store/endpoint/task/taskAPI";
import Taskamico from "/Task-amico.svg"

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
        <Grid container spacing={0} sx={{ height: "80vh" }}>

            <Grid item xs={12} sm={6} style={{
                backgroundImage: `url(${Taskamico})`,
                backgroundRepeat: "no-repeat",
            }} />


            <Grid item xs={12} sm={6}>
                <Box sx={{ textAlign: "left", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <Paper sx={{ p: 4, width: "100%", height:"80vh", overflowY: "auto", maxWidth: 500, bgcolor: bluegray[700], boxShadow: 3, borderRadius: 2, color: "white" }}>
                        <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
                            <strong>Dashboard</strong>
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            This is your task that NOT COMPLETE
                        </Typography>
                        {tasks.length > 0 ? (
                            <List sx={{ maxHeight: "45vh", overflowY: "auto" }}>
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
                </Box>
            </Grid>

        </Grid>

    );
}
