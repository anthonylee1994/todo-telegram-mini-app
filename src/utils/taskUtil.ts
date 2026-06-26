import {type Task} from "../api/tasks";

export type TaskFormState = {
    title: string;
    description: string;
    dueDate: string;
};

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

export function parseDateInput(dateInput: string) {
    const value = dateInput.trim();
    const isoDateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    const slashDateMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);

    if (isoDateMatch) {
        return {
            year: Number(isoDateMatch[1]),
            month: Number(isoDateMatch[2]),
            day: Number(isoDateMatch[3]),
        };
    }

    if (slashDateMatch) {
        return {
            year: Number(slashDateMatch[3]),
            month: Number(slashDateMatch[1]),
            day: Number(slashDateMatch[2]),
        };
    }

    return null;
}

export function parseTimeInput(timeInput: string) {
    const value = timeInput.trim();
    const emptyTime = {
        hour: 23,
        minute: 59,
    };

    if (!value) {
        return emptyTime;
    }

    const timeMatch = /^(\d{1,2}):(\d{2})(?:\s*([AP]M))?$/i.exec(value);

    if (!timeMatch) {
        return null;
    }

    const meridiem = timeMatch[3]?.toUpperCase();
    let hour = Number(timeMatch[1]);
    const minute = Number(timeMatch[2]);

    if (meridiem === "PM" && hour < 12) {
        hour += 12;
    }

    if (meridiem === "AM" && hour === 12) {
        hour = 0;
    }

    if (hour > 23 || minute > 59) {
        return null;
    }

    return {
        hour,
        minute,
    };
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
