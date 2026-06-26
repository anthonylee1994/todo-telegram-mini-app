import React from "react";
import {Box, Container, Stack} from "@chakra-ui/react";
import {type Task} from "./api/tasks";
import {type TaskFormState} from "./utils/taskUtil";
import {useTaskStore} from "./stores/useTaskStore";
import {Header} from "./components/Header";
import {TaskForm} from "./components/TaskForm";
import {TaskFilter as TaskFilterComponent} from "./components/TaskFilter";
import {TaskCard} from "./components/TaskCard";
import {LoadingState} from "./components/LoadingState";
import {EmptyState} from "./components/EmptyState";
import {ErrorDisplay} from "./components/ErrorDisplay";
import {useTelegram} from "./hooks/useTelegram";
import {useTaskLoading} from "./hooks/useTaskLoading";

function getDefaultDueDate() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export const App = React.memo(() => {
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

    useTelegram();
    useTaskLoading(filter);

    const handleTaskSubmit = async (taskInput: ReturnType<typeof import("./utils/taskUtil").getTaskInput>) => {
        await addTask(taskInput);
    };

    const handleClearForm = () => {
        setForm({
            title: "",
            description: "",
            dueDate: getDefaultDueDate(),
        });
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
                    <Header isLoading={isLoading} onRefresh={handleRefresh} />

                    <TaskForm
                        form={form}
                        isSaving={isSaving}
                        onTitleChange={handleTitleChange}
                        onDescriptionChange={handleDescriptionChange}
                        onDueDateChange={handleDueDateChange}
                        onSubmit={handleTaskSubmit}
                        onClearForm={handleClearForm}
                    />

                    <TaskFilterComponent value={filter} onChange={setFilter} />

                    {error ? <ErrorDisplay error={error} /> : null}

                    {isLoading ? <LoadingState /> : null}

                    {!isLoading && tasks.length === 0 ? <EmptyState /> : null}

                    {!isLoading && tasks.length > 0 ? (
                        <Stack gap="3">
                            {tasks.map((task: Task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </Stack>
                    ) : null}
                </Stack>
            </Container>
        </Box>
    );
});
