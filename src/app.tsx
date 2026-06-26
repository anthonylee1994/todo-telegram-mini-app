import React from "react";
import {Box, Container, Stack} from "@chakra-ui/react";
import {type Task, type TaskInput} from "./api/tasks";
import {type TaskFormState} from "./utils/taskUtil";
import {useTaskStore} from "./stores/useTaskStore";
import {Header} from "./components/Header";
import {TaskDrawer} from "./components/TaskDrawer";
import {TaskFilter as TaskFilterComponent} from "./components/TaskFilter";
import {TaskCard} from "./components/TaskCard";
import {LoadingState} from "./components/LoadingState";
import {EmptyState} from "./components/EmptyState";
import {ErrorDisplay} from "./components/ErrorDisplay";
import {useTelegram} from "./hooks/useTelegram";
import {useTaskLoading} from "./hooks/useTaskLoading";
import {getDefaultDueDate, getTaskFormState} from "./utils/taskUtil";

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
    const error = useTaskStore(state => state.error);
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
            const taskUpdate = {
                title: taskInput.title,
                description: taskInput.description,
                due_date: taskInput.due_date,
            };
            await editTask(editingTask.id, taskUpdate);
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
        <Box minH="100vh" bg="bg.subtle" color="fg.default">
            <Container maxW="lg" px="4" py={{base: "5", md: "8"}}>
                <Stack gap="5">
                    <Header isLoading={isLoading} onRefresh={handleRefresh} onOpenDrawer={handleOpenCreateDrawer} />

                    <TaskFilterComponent value={filter} onChange={setFilter} />

                    {error ? <ErrorDisplay error={error} /> : null}

                    {isLoading ? <LoadingState /> : null}

                    {!isLoading && tasks.length === 0 ? <EmptyState /> : null}

                    {!isLoading && tasks.length > 0 ? (
                        <Stack gap="3">
                            {tasks.map((task: Task) => (
                                <TaskCard key={task.id} task={task} onEdit={handleOpenEditDrawer} />
                            ))}
                        </Stack>
                    ) : null}
                </Stack>
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
        </Box>
    );
});
