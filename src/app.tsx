import React from "react";
import {Box, Container, Fab, Stack} from "@mui/material";
import {type Task, type TaskInput} from "./api/tasks";
import {type TaskFormState} from "./utils/taskUtil";
import {useTaskStore} from "./stores/useTaskStore";
import {Header} from "./components/Header";
import {TaskDrawer} from "./components/TaskDrawer";
import {TaskFilter as TaskFilterComponent} from "./components/TaskFilter";
import {TaskCard} from "./components/TaskCard";
import {LoadingState} from "./components/LoadingState";
import {EmptyState} from "./components/EmptyState";
import {useTelegram} from "./hooks/useTelegram";
import {useTaskLoading} from "./hooks/useTaskLoading";
import {getDefaultDueDate, getTaskFormState} from "./utils/taskUtil";
import AddIcon from "@mui/icons-material/Add";

export const App = React.memo(() => {
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const [editingTask, setEditingTask] = React.useState<Task | null>(null);
    const [form, setForm] = React.useState<TaskFormState>({
        title: "",
        description: "",
        dueDate: getDefaultDueDate(),
    });

    const tasks = useTaskStore(state => state.tasks);
    const filter = useTaskStore(state => state.filter);
    const isLoading = useTaskStore(state => state.isLoading);
    const isSaving = useTaskStore(state => state.isSaving);
    const setFilter = useTaskStore(state => state.setFilter);
    const loadTasks = useTaskStore(state => state.loadTasks);
    const addTask = useTaskStore(state => state.addTask);
    const editTask = useTaskStore(state => state.editTask);

    const handleClearForm = () => {
        setForm({
            title: "",
            description: "",
            dueDate: getDefaultDueDate(),
        });
    };

    useTelegram();
    useTaskLoading(filter);

    const handleTaskSubmit = async (taskInput: TaskInput) => {
        if (editingTask) {
            await editTask(editingTask.id, taskInput);
            return;
        }

        await addTask(taskInput);
    };

    const handleOpenCreateDrawer = () => {
        setEditingTask(null);
        handleClearForm();
        setIsDrawerOpen(true);
    };

    const handleOpenEditDrawer = (task: Task) => {
        setEditingTask(task);
        setForm(getTaskFormState(task));
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setEditingTask(null);
        handleClearForm();
    };

    const handleTitleChange = (value: string) => {
        setForm(currentForm => ({...currentForm, title: value}));
    };

    const handleDescriptionChange = (value: string) => {
        setForm(currentForm => ({...currentForm, description: value}));
    };

    const handleDueDateChange = (value: string) => {
        setForm(currentForm => ({...currentForm, dueDate: value}));
    };

    const handleRefresh = () => {
        void loadTasks();
    };

    return (
        <Box sx={{display: "flex", flexDirection: "column", height: "100dvh"}}>
            <Header isLoading={isLoading} onRefresh={handleRefresh}>
                <TaskFilterComponent value={filter} onChange={setFilter} />
            </Header>
            <Container
                maxWidth="sm"
                disableGutters
                sx={{
                    flex: 1,
                    backgroundColor: "white",
                    pb: "env(safe-area-inset-bottom)",
                }}
            >
                {isLoading ? <LoadingState /> : null}

                {!isLoading && tasks.length === 0 ? <EmptyState /> : null}

                {!isLoading && tasks.length > 0 ? (
                    <Stack spacing={0} sx={{pb: 15}}>
                        {tasks.map((task: Task) => (
                            <TaskCard key={task.id} task={task} onEdit={handleOpenEditDrawer} />
                        ))}
                    </Stack>
                ) : null}
            </Container>

            <TaskDrawer
                isOpen={isDrawerOpen}
                mode={editingTask ? "edit" : "create"}
                onClose={handleCloseDrawer}
                form={form}
                isSaving={isSaving}
                onTitleChange={handleTitleChange}
                onDescriptionChange={handleDescriptionChange}
                onDueDateChange={handleDueDateChange}
                onSubmit={handleTaskSubmit}
                onClearForm={handleClearForm}
            />

            <Fab
                color="primary"
                onClick={handleOpenCreateDrawer}
                sx={{
                    position: "fixed",
                    bottom: "calc(env(safe-area-inset-bottom) + 40px)",
                    right: 30,
                }}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
});
