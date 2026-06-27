import React from "react";
import {Checkbox as MuiCheckbox, Stack, Typography, Chip, IconButton, ListItem, ListItemIcon, ListItemText, type ChipProps, ListItemButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {type Task} from "../api/tasks";
import {useTaskStore} from "../stores/useTaskStore";
import {formatDueDate, getDueDateBadgeColor} from "../utils/taskUtil";
import {useShowPopup} from "@vkruglikov/react-telegram-web-app";

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

function getPopupMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    return "操作失敗，請再試一次";
}

export const TaskCard = React.memo(({task, onEdit}: TaskCardProps) => {
    const toggleTask = useTaskStore(state => state.toggleTask);
    const removeTask = useTaskStore(state => state.removeTask);
    const showPopup = useShowPopup();

    const isCompleted = task.status === "completed";

    const handleToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        try {
            await toggleTask(task);
        } catch (error) {
            showPopup({title: "更新唔到", message: getPopupMessage(error)});
        }
    };

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        const confirmed = await confirmDelete();

        if (!confirmed) {
            return;
        }

        try {
            await removeTask(task.id);
        } catch (error) {
            showPopup({title: "刪除唔到", message: getPopupMessage(error)});
        }
    };

    const dueDateColor = getMuiDueDateColor(task);
    const labelId = `task-${task.id}-label`;

    return (
        <ListItem
            onClick={() => onEdit(task)}
            secondaryAction={
                <Stack direction="row" spacing={0.25}>
                    <IconButton aria-label="刪除任務" edge="end" onClick={handleDelete} size="small">
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            }
            divider
            disablePadding
        >
            <ListItemIcon sx={{position: "absolute", left: 15}}>
                <MuiCheckbox edge="start" checked={isCompleted} slotProps={{input: {"aria-labelledby": labelId}}} onClick={handleToggle} />
            </ListItemIcon>
            <ListItemButton dense sx={{p: 2, pl: 6}}>
                <ListItemText
                    id={labelId}
                    disableTypography
                    sx={{m: 0, minWidth: 0}}
                    primary={
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
                    }
                    secondary={
                        <Stack spacing={2} sx={{mt: task.description ? 2 : 1.5}}>
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
                    }
                />
            </ListItemButton>
        </ListItem>
    );
});
