import moment from "moment";
import {type Task} from "../api/tasks";

export type TaskFormState = {
    title: string;
    description: string;
    dueDate: string;
};

export function getDefaultDueDate() {
    return moment().format("YYYY-MM-DDTHH:mm");
}

export function getTaskFormState(task: Task): TaskFormState {
    return {
        title: task.title,
        description: task.description || "",
        dueDate: task.due_date ? moment(task.due_date).format("YYYY-MM-DDTHH:mm") : "",
    };
}

export function formatDueDate(dueDate: string | null) {
    if (!dueDate) {
        return "冇限期";
    }

    return new Intl.DateTimeFormat("zh-HK", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(dueDate));
}

export function getDueDateBadgeColor(task: Task) {
    if (task.status === "completed") {
        return "green";
    }

    if (!task.due_date) {
        return "gray";
    }

    return new Date(task.due_date).getTime() < Date.now() ? "red" : "blue";
}

export function buildDueDate(form: TaskFormState) {
    if (!form.dueDate.trim()) {
        return null;
    }

    const date = new Date(form.dueDate);

    if (isNaN(date.getTime())) {
        throw new Error("限期格式唔啱");
    }

    return date;
}

export function getTaskInput(form: TaskFormState) {
    const dueDate = buildDueDate(form);

    return {
        title: form.title.trim(),
        description: form.description.trim() || null,
        due_date: dueDate ? dueDate.toISOString() : null,
        status: "pending" as const,
    };
}
