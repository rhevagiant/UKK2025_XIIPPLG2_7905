import { Box, Typography, Paper, ListItem } from "@mui/material";

import { bluegray } from "../../../themes/color";

export default function Dashboard() {



    return (
        <Box sx={{ textAlign: "left", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh" }}>
            <Paper sx={{ p: 4, width: "100%", overflowY: "auto", maxWidth: 500, bgcolor: bluegray[700], boxShadow: 3, borderRadius: 2, color: "white"}}>
                <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
                    <strong>Dashboard</strong>
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    This is your task that NOT COMPLETE
                </Typography>

                <ListItem sx={{ display: "flex", alignItems: "center" }}>
                    task
                </ListItem>
            </Paper>
        </Box>
    );
}
