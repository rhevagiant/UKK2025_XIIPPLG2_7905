import { useEffect, useState } from "react";
import {
    Box, Typography, Paper, List, ListItem, ListItemButton, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Button, TablePagination, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
    MenuItem, Menu,
} from "@mui/material";
import { getCategories, createCategories, updateCategory, deleteCategory } from "../../../store/endpoint/category/categoryAPI";
import { getAllTasks} from "../../../store/endpoint/task/taskAPI";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UndoIcon from "@mui/icons-material/Undo";
import Swal from "sweetalert2";
import { bluegray } from "../../../themes/color";



export default function Tasks() {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [tasks, setTasks] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [openEditCategoryDialog, setOpenEditCategoryDialog] = useState(false);
    const [editCategoryName, setEditCategoryName] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(5);
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [newCategory, setNewCategory] = useState("");



    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const categoryData = await getCategories();
                setCategories(categoryData);
                const taskData = await getAllTasks();
                setTasks(taskData);
            } catch (error) {
                console.error("Failed to fetch initial data", error);
            }
        };
        fetchInitialData();
    }, []);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleOpenCategoryDialog = () => {
        setOpenCategoryDialog(true);
    };

    const handleCloseCategoryDialog = () => {
        setOpenCategoryDialog(false);
        setNewCategory("");
    };

    const handleSubmitCategory = async () => {
        try {
            if (!newCategory.trim()) {
                console.error("Category name cannot be empty");
                return;
            }

            await createCategories({ category: newCategory });
            const updatedCategories = await getCategories();
            setCategories(updatedCategories);
            handleCloseCategoryDialog();
        } catch (error) {
            console.error("Failed to add category", error.response?.data || error.message);
        }
    };

    

    const handleOpenMenu = (event, categoryId, categoryName) => {
        setAnchorEl(event.currentTarget);
        setSelectedCategoryId(categoryId);
        setEditCategoryName(categoryName);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleDeleteCategory = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: "This category will be deleted permanently!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteCategory(selectedCategoryId);
                    setCategories(categories.filter(cat => cat.id !== selectedCategoryId));
                    Swal.fire("Deleted!", "Your category has been deleted.", "success");
                } catch (error) {
                    console.error("Failed to delete category", error);
                    Swal.fire("Error!", "Failed to delete category.", "error");
                }
            }
        });
        handleCloseMenu();
    };

    const handleOpenEditCategoryDialog = () => {
        setOpenEditCategoryDialog(true);
        handleCloseMenu();
    };

    const handleEditCategorySubmit = async () => {
        try {
            await updateCategory(selectedCategoryId, { category: editCategoryName });
            setCategories(categories.map(cat =>
                cat.id === selectedCategoryId ? { ...cat, category: editCategoryName } : cat
            ));
            Swal.fire("Updated!", "Category has been updated.", "success");
            setOpenEditCategoryDialog(false);
        } catch (error) {
            console.error("Failed to update category", error);
            Swal.fire("Error!", "Failed to update category.", "error");
        }
    };


    return (
        <Box sx={{ display: "flex", height: "80vh", p: 3 }}>
            <Paper sx={{ width: "25%", p: 2, mr: 3, display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6">Categories</Typography>
                    <Button variant="contained" onClick={handleOpenCategoryDialog} sx={{ backgroundColor: bluegray[700] }}>Add</Button>
                </Box>
                <TextField
                    fullWidth
                    label="Search Category"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                    <List>
                        {categories.map(category => (
                            <ListItem
                                key={category.id}
                                disablePadding
                                sx={{ display: category.category.toLowerCase().includes(searchTerm.toLowerCase()) ? "flex" : "none", justifyContent: "space-between" }}
                            >
                                <ListItemButton>
                                    {category.category}
                                </ListItemButton>
                                <IconButton onClick={(event) => handleOpenMenu(event, category.id, category.category)}>
                                    <MoreVertIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Paper>

            <Paper sx={{ width: "75%", p: 2, display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6">Tasks</Typography>
                    <Typography variant="subtitle1" color="textSecondary">Category: All Categories</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Button variant="contained" sx={{ backgroundColor: bluegray[700] }} size="small" >
                        Add Task
                    </Button>
                </Box>
                <TableContainer sx={{ flexGrow: 1, overflowY: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Task</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody >
                            {tasks
                                .map(task => (
                                    <TableRow key={task.id}>
                                        <TableCell>{task.id}</TableCell>
                                        <TableCell sx={{maxWidth:"200px"}}>{task.task}</TableCell>
                                        <TableCell>{task.status}</TableCell>
                                        <TableCell>{new Date(task.date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            {task.status === "COMPLETE" ? (
                                                <IconButton>
                                                    <UndoIcon color="warning" />
                                                </IconButton>
                                            ) : (
                                                <IconButton>
                                                    <CheckIcon color="primary" />
                                                </IconButton>
                                            )}
                                            <IconButton>
                                                <EditIcon color="secondary" />
                                            </IconButton>
                                            <IconButton>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>

                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={tasks.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[5]}
                />
            </Paper>

            <Dialog open={openCategoryDialog} onClose={handleCloseCategoryDialog}>
                <DialogTitle>Add Category</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Category Name" fullWidth value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCategoryDialog}>Cancel</Button>
                    <Button onClick={handleSubmitCategory} variant="contained" sx={{ backgroundColor: bluegray[700] }}>Submit</Button>
                </DialogActions>
            </Dialog>


            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                <MenuItem onClick={handleOpenEditCategoryDialog}>
                    <EditIcon sx={{ mr: 1 }} /> Edit
                </MenuItem>
                <MenuItem onClick={handleDeleteCategory}>
                    <DeleteIcon sx={{ mr: 1 }} color="error" /> Delete
                </MenuItem>
            </Menu>


            <Dialog open={openEditCategoryDialog} onClose={() => setOpenEditCategoryDialog(false)}>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Category Name"
                        fullWidth
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditCategoryDialog(false)}>Cancel</Button>
                    <Button onClick={handleEditCategorySubmit} variant="contained" sx={{ backgroundColor: bluegray[700] }}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
