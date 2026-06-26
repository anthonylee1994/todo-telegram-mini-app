import {create} from "zustand";
import {createTask, deleteTask, fetchTasks, type Task, type TaskFilter, type TaskInput, updateTask} from "../api/tasks";

type TaskStore = {
    tasks: Task[];
    filter: TaskFilter;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
    setFilter: (filter: TaskFilter) => void;
    loadTasks: () => Promise<void>;
    addTask: (input: TaskInput) => Promise<void>;
    editTask: (id: string, input: Partial<TaskInput>) => Promise<void>;
    toggleTask: (task: Task) => Promise<void>;
    removeTask: (id: string) => Promise<void>;
};

function sortTasks(tasks: Task[]) {
    return [...tasks].sort((firstTask, secondTask) => {
        if (!firstTask.due_date && !secondTask.due_date) {
            return firstTask.created_at.localeCompare(secondTask.created_at);
        }

        if (!firstTask.due_date) {
            return 1;
        }

        if (!secondTask.due_date) {
            return -1;
        }

        return firstTask.due_date.localeCompare(secondTask.due_date);
    });
}

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    return "操作失敗，請再試一次";
}

async function fetchFilteredTasks(filter: TaskFilter) {
    return sortTasks(await fetchTasks(filter));
}

export const useTaskStore = create<TaskStore>((set, get) => {
    return {
        tasks: [],
        filter: "all",
        isLoading: false,
        isSaving: false,
        error: null,
        setFilter: filter => {
            set({filter});
        },
        loadTasks: async () => {
            set({isLoading: true, error: null});

            try {
                const tasks = await fetchFilteredTasks(get().filter);
                set({tasks, isLoading: false});
            } catch (error) {
                set({error: getErrorMessage(error), isLoading: false});
            }
        },
        addTask: async input => {
            set({isSaving: true, error: null});

            try {
                await createTask(input);
                const tasks = await fetchFilteredTasks(get().filter);
                set({tasks, isSaving: false});
            } catch (error) {
                set({isSaving: false});
                throw error;
            }
        },
        editTask: async (id, input) => {
            set({isSaving: true, error: null});

            try {
                await updateTask(id, input);
                const tasks = await fetchFilteredTasks(get().filter);
                set({tasks, isSaving: false});
            } catch (error) {
                set({isSaving: false});
                throw error;
            }
        },
        toggleTask: async task => {
            const nextStatus = task.status === "completed" ? "pending" : "completed";

            await updateTask(task.id, {status: nextStatus});
            const tasks = await fetchFilteredTasks(get().filter);
            set({tasks, error: null});
        },
        removeTask: async id => {
            await deleteTask(id);
            const tasks = await fetchFilteredTasks(get().filter);
            set({tasks, error: null});
        },
    };
});
