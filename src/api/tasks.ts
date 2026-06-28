import {AxiosError, type AxiosRequestConfig} from "axios";
import {apiClient} from "@/utils/apiClient";

export type TaskStatus = "pending" | "completed";

export type TaskFilter = "all" | "today" | "this_week" | "overdue" | "done" | "pending";

export type Task = {
    id: string;
    title: string;
    description: string | null;
    due_date: string | null;
    status: TaskStatus;
    user_id: string;
    created_at: string;
    updated_at: string;
};

export type TaskInput = {
    title: string;
    description?: string | null;
    due_date?: string | null;
    status?: TaskStatus;
};

type ApiOptions = Omit<AxiosRequestConfig, "data" | "url"> & {
    json?: unknown;
};

function getApiErrorMessage(error: unknown) {
    if (error instanceof AxiosError) {
        const data = error.response?.data;

        if (data && typeof data === "object") {
            if ("error" in data && typeof data.error === "string") {
                return data.error;
            }

            if ("errors" in data && Array.isArray(data.errors)) {
                return data.errors.join(", ");
            }
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "API request failed";
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}) {
    try {
        const config: AxiosRequestConfig = {
            method: options.method,
            headers: options.headers,
            data: options.json,
        };
        const response = await apiClient.request<T>({
            url: path,
            ...config,
        });

        return response.status === 204 ? (null as T) : response.data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error), {cause: error});
    }
}

export function buildTaskListPath(filter: TaskFilter) {
    const params = new URLSearchParams({
        sort_by: "due_date",
        order: "asc",
    });

    if (filter !== "all") {
        params.set("filter", filter);
    }

    return `/tasks?${params.toString()}`;
}

export async function fetchTasks(filter: TaskFilter) {
    return apiFetch<Task[]>(buildTaskListPath(filter));
}

export async function createTask(input: TaskInput) {
    return apiFetch<Task>("/tasks", {
        method: "POST",
        json: {
            task: input,
        },
    });
}

export async function updateTask(id: string, input: Partial<TaskInput>) {
    return apiFetch<Task>(`/tasks/${id}`, {
        method: "PATCH",
        json: {
            task: input,
        },
    });
}

export async function deleteTask(id: string) {
    return apiFetch<null>(`/tasks/${id}`, {
        method: "DELETE",
    });
}
