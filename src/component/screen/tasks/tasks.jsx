import { useEffect, useState } from "react";
import {
    Box, Typography, Paper, List, ListItem, ListItemButton, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Button, TablePagination, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
    MenuItem, Menu,
    Alert, FormControl,
    InputLabel,
    Select,
} from "@mui/material";
import { getCategories, createCategories, updateCategory, deleteCategory, getCategoryTasks } from "../../../store/endpoint/category/categoryAPI";
import { addTasks, deleteTask, editTask, getAllTasks, updateTaskStatus } from "../../../store/endpoint/task/taskAPI";
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
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [openEditCategoryDialog, setOpenEditCategoryDialog] = useState(false);
    const [editCategoryName, setEditCategoryName] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(5);
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [newTask, setNewTask] = useState("");
    const [openTaskDialog, setOpenTaskDialog] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskName, setEditTaskName] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");


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
            setTimeout(() => {
                window.location.reload();
            }, 1000);
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

    const handleCategoryClick = async (categoryId, categoryName) => {
        try {
            const data = await getCategoryTasks(categoryId)
            setTasks(data);
            setSelectedCategory(categoryName);
            setSelectedCategoryId(categoryId);
        } catch (error) {
            console.error("Failed to fetch category tasks", error);
        }
    }

    const handleOpenTaskDialog = () => {
        if (!selectedCategoryId) {
            setAlertMessage("Please select a category before adding a task.");
            return;
        }
        setAlertMessage("");
        setOpenTaskDialog(true);
    };

    const handleCloseTaskDialog = () => {
        setOpenTaskDialog(false);
        setNewTask("");
    };


    const handlesubmitTask = async () => {
        if (!newTask.trim() || !selectedCategoryId) {
            console.error("Task and categoryId are required");
            return;
        }

        try {
            await addTasks({ task: newTask, categoryId: selectedCategoryId });
            const updatedTasks = await getCategoryTasks(selectedCategoryId);
            setTasks(updatedTasks);
            handleCloseTaskDialog();
        } catch (error) {
            console.error("Failed to add task", error.response?.data || error.message);
        }
    }

    const handleDeleteTask = async (taskId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteTask(taskId);
                    setTasks(tasks.filter(task => task.id !== taskId));

                    Swal.fire(
                        "Deleted!",
                        "Your task has been deleted.",
                        "success"
                    );
                } catch (error) {
                    Swal.fire(
                        "Error!",
                        "Failed to delete task.",
                        "error"
                    );
                    console.error("Failed to delete task", error);
                }
            }
        });
    };

    const handleOpenEditDialog = (task) => {
        setEditTaskId(task.id);
        setEditTaskName(task.task);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setEditTaskId(null);
        setEditTaskName("");
    };

    const handleEditTaskSubmit = async () => {
        try {
            await editTask(editTaskId, { task: editTaskName });
            setTasks(tasks.map(task =>
                task.id === editTaskId ? { ...task, task: editTaskName } : task
            ));

            handleCloseEditDialog();
        } catch (error) {
            console.error("Failed to edit task", error);
        }
    };

    const handleCompleteTask = async (taskId) => {
        try {
            await updateTaskStatus(taskId, "COMPLETE");
            setTasks(tasks.map(task =>
                task.id === taskId ? { ...task, status: "COMPLETE" } : task
            ));

            Swal.fire({
                title: "Task Completed!",
                text: "Do you want to undo this action?",
                icon: "success",
                showCancelButton: true,
                confirmButtonText: "Undo",
                cancelButtonText: "Close",
            }).then((result) => {
                if (result.isConfirmed) {
                    handleUndoTask(taskId);
                }
            });
        } catch (error) {
            console.error("Failed to complete task", error);
        }
    };

    const handleUndoTask = async (taskId) => {
        try {
            await updateTaskStatus(taskId, "NOT_COMPLETE");
            setTasks(tasks.map(task =>
                task.id === taskId ? { ...task, status: "NOT_COMPLETE" } : task
            ));

            Swal.fire("Undone!", "The task has been reverted.", "info");
        } catch (error) {
            console.error("Failed to undo task", error);
        }
    };

    const handleClearCategory = async () =>{
        const taskData = await getAllTasks();
        setTasks(taskData);
        setSelectedCategoryId(null);
        setSelectedCategory("All Categories");
    }


    return (
        <Box sx={{ display: "flex", height: "82vh" }}>
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
                        <ListItem sx={{px:0}}>
                            <ListItemButton onClick={handleClearCategory}  sx={{ justifyContent: "space-between", px: 2 }}>
                               All Categories
                            </ListItemButton>
                        </ListItem>
                        {categories.map(category => (
                            <ListItem
                                key={category.id}
                                disablePadding
                                sx={{ display: category.category.toLowerCase().includes(searchTerm.toLowerCase()) ? "flex" : "none", justifyContent: "space-between" }}
                            >
                                <ListItemButton onClick={() => handleCategoryClick(category.id, category.category)}>
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
                    <Typography variant="subtitle1" color="textSecondary">Category: {selectedCategory}</Typography>
                </Box>
                {alertMessage && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        {alertMessage}
                    </Alert>
                )}

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Button onClick={handleOpenTaskDialog} variant="contained" sx={{ backgroundColor: bluegray[700], py: 1 }} size="small" >
                        Add Task
                    </Button>
                    <FormControl sx={{minWidth: 150}} size="small">
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="NOT_COMPLETE">Not Complete</MenuItem>
                            <MenuItem value="COMPLETE">Complete</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <TableContainer sx={{ flexGrow: 1, overflowY: "auto" }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight: 'bold'}}>ID</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Date</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Task</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Status</TableCell>
                                <TableCell sx={{textAlign:'center', fontWeight:'bold'}}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody >
                            {tasks .filter(task => statusFilter === "All" || task.status === statusFilter)
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((task, index) => (
                                    <TableRow key={task.id}>
                                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell>{new Date(task.date).toLocaleDateString()}</TableCell>
                                        <TableCell sx={{ maxWidth: "200px" }}>{task.task}</TableCell>
                                        <TableCell>{task.status}</TableCell>
                                        <TableCell>
                                            {task.status === "COMPLETE" ? (
                                                <IconButton onClick={() => handleUndoTask(task.id)}>
                                                    <UndoIcon sx={{ color: bluegray[700] }} />
                                                </IconButton>
                                            ) : (
                                                <IconButton onClick={() => handleCompleteTask(task.id)}>
                                                    <CheckIcon sx={{ color: bluegray[700] }} />
                                                </IconButton>
                                            )}
                                            <IconButton onClick={() => handleOpenEditDialog(task)}>
                                                <EditIcon sx={{ color: bluegray[700] }} />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteTask(task.id)}>
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

            {/* nambah category */}
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

            {/* menu category */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                <MenuItem onClick={handleOpenEditCategoryDialog}>
                    <EditIcon sx={{ mr: 1 }} /> Edit
                </MenuItem>
                <MenuItem onClick={handleDeleteCategory}>
                    <DeleteIcon sx={{ mr: 1 }} color="error" /> Delete
                </MenuItem>
            </Menu>

            {/* edit category */}
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

            {/* nambah task */}
            <Dialog open={openTaskDialog} onClose={handleCloseTaskDialog}>
                <DialogTitle>Add Task</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Task Name" fullWidth value={newTask} onChange={(e) => setNewTask(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseTaskDialog}>Cancel</Button>
                    <Button onClick={handlesubmitTask} variant="contained" sx={{ backgroundColor: bluegray[700] }}>Submit</Button>
                </DialogActions>
            </Dialog>

            {/* edit task */}
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Task Name"
                        fullWidth
                        value={editTaskName}
                        onChange={(e) => setEditTaskName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog}>Cancel</Button>
                    <Button onClick={handleEditTaskSubmit} variant="contained" sx={{ backgroundColor: bluegray[700] }}>Save</Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}
