import React from "react";
import {Box, Button, Field, Input, Stack, Textarea} from "@chakra-ui/react";
import {FiPlus} from "react-icons/fi";
import {type TaskFormState} from "../utils/taskUtil";
import {toaster} from "./ui/toaster";

interface TaskFormProps {
    form: TaskFormState;
    isSaving: boolean;
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onDueDateChange: (value: string) => void;
    onSubmit: (taskInput: ReturnType<typeof import("../utils/taskUtil").getTaskInput>) => Promise<void>;
    onClearForm: () => void;
}

export const TaskForm = React.memo(({form, isSaving, onTitleChange, onDescriptionChange, onDueDateChange, onSubmit, onClearForm}: TaskFormProps) => {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!form.title.trim()) {
            toaster.create({
                title: "要填填標題",
                type: "warning",
            });
            return;
        }

        try {
            const {getTaskInput} = await import("../utils/taskUtil");
            await onSubmit(getTaskInput(form));
            onClearForm();
            toaster.create({
                title: "已新增任務",
                type: "success",
            });
        } catch (submitError) {
            toaster.create({
                title: "新增唔到",
                description: submitError instanceof Error ? submitError.message : "請再試一次",
                type: "error",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box borderWidth="1px" borderColor="border.subtle" borderRadius="lg" bg="bg.panel" p="4" shadow="xs">
                <Stack gap="4">
                    <Field.Root required>
                        <Field.Label>標題</Field.Label>
                        <Input value={form.title} onChange={event => onTitleChange(event.target.value)} placeholder="例如：買牛奶" />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>備註</Field.Label>
                        <Textarea value={form.description} onChange={event => onDescriptionChange(event.target.value)} placeholder="可留空" resize="vertical" />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>限期</Field.Label>
                        <Input type="datetime-local" value={form.dueDate} onChange={event => onDueDateChange(event.target.value)} />
                        <Field.HelperText>選擇日期同時間，預設當前時間。</Field.HelperText>
                    </Field.Root>
                    <Button type="submit" colorPalette="blue" loading={isSaving}>
                        <FiPlus />
                        新增任務
                    </Button>
                </Stack>
            </Box>
        </form>
    );
});
