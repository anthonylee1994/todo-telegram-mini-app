import React from "react";
import {Button, Drawer, TextField, Stack, Typography, Box, IconButton} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {type TaskInput} from "../api/tasks";
import {getCreateTaskInput, getUpdateTaskInput, type TaskFormState} from "../utils/taskUtil";

type TaskDrawerMode = "create" | "edit";

interface TaskDrawerProps {
    isOpen: boolean;
    mode: TaskDrawerMode;
    onClose: () => void;
    form: TaskFormState;
    isSaving: boolean;
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onDueDateChange: (value: string) => void;
    onSubmit: (taskInput: TaskInput) => Promise<void>;
    onClearForm: () => void;
}

function showMessage(message: string) {
    window.alert(message);
}

function showError(title: string, error: unknown) {
    window.alert(`${title}\n${error instanceof Error ? error.message : "請再試一次"}`);
}

export const TaskDrawer = React.memo(({isOpen, mode, onClose, form, isSaving, onTitleChange, onDescriptionChange, onDueDateChange, onSubmit, onClearForm}: TaskDrawerProps) => {
    const isEditMode = mode === "edit";
    const title = isEditMode ? "編輯任務" : "新增任務";
    const submitLabel = isEditMode ? "儲存任務" : "新增任務";

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!form.title.trim()) {
            showMessage("要填填標題");
            return;
        }

        try {
            await onSubmit(isEditMode ? getUpdateTaskInput(form) : getCreateTaskInput(form));
            onClearForm();
            onClose();
        } catch (submitError) {
            showError(isEditMode ? "更新唔到" : "新增唔到", submitError);
        }
    };

    return (
        <Drawer anchor="bottom" open={isOpen} onClose={onClose}>
            <Stack sx={{p: 3, mb: "calc(env(safe-area-inset-bottom) + 20px)"}}>
                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2}}>
                    <Typography variant="h6">{title}</Typography>
                    <IconButton onClick={onClose} sx={{minWidth: "auto"}}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField label="標題" value={form.title} onChange={event => onTitleChange(event.target.value)} required fullWidth />
                        <TextField label="備註" value={form.description} onChange={event => onDescriptionChange(event.target.value)} placeholder="可留空" multiline rows={4} fullWidth />
                        <TextField
                            label="日期"
                            type="datetime-local"
                            value={form.dueDate}
                            onChange={event => onDueDateChange(event.target.value)}
                            fullWidth
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                            helperText="選擇日期同時間，預設當前時間。"
                        />
                        <Button size="large" type="submit" variant="contained" disabled={isSaving} fullWidth startIcon={isEditMode ? <CheckIcon /> : <AddIcon />}>
                            {submitLabel}
                        </Button>
                    </Stack>
                </form>
            </Stack>
        </Drawer>
    );
});
