import React from "react";
import {Drawer, TextField, Stack, Typography, Box} from "@mui/material";
import {type TaskInput} from "../api/tasks";
import {BackButton, MainButton, useShowPopup} from "@vkruglikov/react-telegram-web-app";
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

export const TaskDrawer = React.memo(({isOpen, mode, onClose, form, isSaving, onTitleChange, onDescriptionChange, onDueDateChange, onSubmit, onClearForm}: TaskDrawerProps) => {
    const isEditMode = mode === "edit";
    const title = isEditMode ? "編輯任務" : "新增任務";
    const submitLabel = isEditMode ? "儲存任務" : "新增任務";
    const showPopup = useShowPopup();

    const handleSubmit = async () => {
        if (!form.title.trim()) {
            showPopup({message: "請填寫標題"});
            return;
        }

        try {
            await onSubmit(isEditMode ? getUpdateTaskInput(form) : getCreateTaskInput(form));
            onClearForm();
            onClose();
        } catch {
            showPopup({message: isEditMode ? "更新唔到" : "新增唔到"});
        }
    };

    return (
        <Drawer anchor="bottom" open={isOpen} onClose={onClose}>
            <Stack sx={{p: 3, mb: "calc(env(safe-area-inset-bottom) + 20px)"}}>
                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2}}>
                    <Typography variant="h6">{title}</Typography>
                </Box>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField slotProps={{inputLabel: {shrink: true}}} label="標題" value={form.title} onChange={event => onTitleChange(event.target.value)} required fullWidth />
                        <TextField
                            slotProps={{inputLabel: {shrink: true}}}
                            label="備註"
                            value={form.description}
                            onChange={event => onDescriptionChange(event.target.value)}
                            placeholder="可留空"
                            multiline
                            rows={4}
                            fullWidth
                        />
                        <TextField slotProps={{inputLabel: {shrink: true}}} fullWidth label="日期" type="datetime-local" value={form.dueDate} onChange={event => onDueDateChange(event.target.value)} />
                        {isOpen ? <MainButton text={submitLabel} onClick={handleSubmit} disabled={isSaving} /> : null}
                        {isOpen ? <BackButton onClick={onClose} /> : null}
                    </Stack>
                </form>
            </Stack>
        </Drawer>
    );
});
