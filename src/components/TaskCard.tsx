import React from "react";
import {Checkbox as MuiCheckbox, Box, Stack, Typography, Chip, IconButton, type ChipProps} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {type Task} from "../api/tasks";
import {useTaskStore} from "../stores/useTaskStore";
import {formatDueDate, getDueDateBadgeColor} from "../utils/taskUtil";

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
}

async function confirmDelete() {
    const showConfirm = window.Telegram?.WebApp?.showConfirm;

    if (!showConfirm) {
        return window.confirm("確定要刪除呢個任務？");
    }

    return new Promise<boolean>(resolve => {
        showConfirm("確定要刪除呢個任務？", resolve);
    });
}

function showError(title: string, error: unknown) {
    window.alert(`${title}\n${error instanceof Error ? error.message : "請再試一次"}`);
}

function getMuiDueDateColor(task: Task): ChipProps["color"] {
    const dueDateColor = getDueDateBadgeColor(task);

    if (dueDateColor === "red") {
        return "error";
    }

    if (dueDateColor === "green") {
        return "success";
    }

    if (dueDateColor === "blue") {
        return "info";
    }

    return "default";
}

export const TaskCard = React.memo(({task, onEdit}: TaskCardProps) => {
    const toggleTask = useTaskStore(state => state.toggleTask);
    const removeTask = useTaskStore(state => state.removeTask);

    const isCompleted = task.status === "completed";

    const handleToggle = async () => {
        try {
            await toggleTask(task);
        } catch (error) {
            showError("更新唔到", error);
        }
    };

    const handleDelete = async () => {
        const confirmed = await confirmDelete();

        if (!confirmed) {
            return;
        }

        try {
            await removeTask(task.id);
        } catch (error) {
            showError("刪除唔到", error);
        }
    };

    const dueDateColor = getMuiDueDateColor(task);

    return (
        <Box component="article" sx={{p: 2, borderBottom: 1, borderColor: "divider"}}>
            <Box sx={{display: "flex", alignItems: "flex-start", gap: 1.5}}>
                <MuiCheckbox checked={isCompleted} onChange={handleToggle} sx={{mt: 0.5}} />
                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 1.5,
                    }}
                >
                    <Stack spacing={2} sx={{flex: 1, minWidth: 0}}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                color: isCompleted ? "text.disabled" : "text.primary",
                                textDecoration: isCompleted ? "line-through" : "none",
                                fontWeight: 700,
                                wordBreak: "break-word",
                            }}
                        >
                            {task.title}
                        </Typography>
                        {task.description ? (
                            <Typography variant="body2" color="text.secondary" sx={{whiteSpace: "pre-wrap"}}>
                                {task.description}
                            </Typography>
                        ) : null}
                        <Stack direction="row" spacing={1} useFlexGap sx={{flexWrap: "wrap"}}>
                            <Chip label={formatDueDate(task.due_date)} color={dueDateColor} size="small" variant="outlined" />
                            <Chip label={isCompleted ? "已完成" : "未完成"} color={isCompleted ? "success" : "warning"} size="small" variant="outlined" />
                        </Stack>
                    </Stack>
                    <Stack direction="row" spacing={0.25} sx={{flexShrink: 0}}>
                        <IconButton aria-label="編輯任務" onClick={() => onEdit(task)} size="small">
                            <EditIcon />
                        </IconButton>
                        <IconButton aria-label="刪除任務" color="error" onClick={handleDelete} size="small">
                            <DeleteIcon />
                        </IconButton>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
});
