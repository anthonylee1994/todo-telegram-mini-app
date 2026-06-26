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
                const tasks = await fetchTasks(get().filter);
                set({tasks: sortTasks(tasks), isLoading: false});
            } catch (error) {
                set({error: getErrorMessage(error), isLoading: false});
            }
        },
        addTask: async input => {
            set({isSaving: true, error: null});

            try {
                const task = await createTask(input);
                set(state => ({
                    tasks: sortTasks([task, ...state.tasks]),
                    isSaving: false,
                }));
            } catch (error) {
                set({error: getErrorMessage(error), isSaving: false});
                throw error;
            }
        },
        editTask: async (id, input) => {
            set({isSaving: true, error: null});

            try {
                const updatedTask = await updateTask(id, input);
                set(state => ({
                    tasks: sortTasks(state.tasks.map(currentTask => (currentTask.id === id ? updatedTask : currentTask))),
                    isSaving: false,
                }));
            } catch (error) {
                set({error: getErrorMessage(error), isSaving: false});
                throw error;
            }
        },
        toggleTask: async task => {
            const nextStatus = task.status === "completed" ? "pending" : "completed";

            try {
                const updatedTask = await updateTask(task.id, {status: nextStatus});
                set(state => ({
                    tasks: sortTasks(state.tasks.map(currentTask => (currentTask.id === task.id ? updatedTask : currentTask))),
                }));
            } catch (error) {
                set({error: getErrorMessage(error)});
                throw error;
            }
        },
        removeTask: async id => {
            try {
                await deleteTask(id);
                set(state => ({
                    tasks: state.tasks.filter(task => task.id !== id),
                }));
            } catch (error) {
                set({error: getErrorMessage(error)});
                throw error;
            }
        },
    };
});
