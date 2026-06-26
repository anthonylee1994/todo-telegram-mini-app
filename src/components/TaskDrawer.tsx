import React from "react";
import {Button, Drawer, Field, Input, Portal, Stack, Textarea} from "@chakra-ui/react";
import {FiPlus} from "react-icons/fi";
import {type TaskFormState} from "../utils/taskUtil";
import {toaster} from "./ui/toaster";

interface TaskDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    form: TaskFormState;
    isSaving: boolean;
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onDueDateChange: (value: string) => void;
    onSubmit: (taskInput: ReturnType<typeof import("../utils/taskUtil").getTaskInput>) => Promise<void>;
    onClearForm: () => void;
}

export const TaskDrawer = React.memo(({isOpen, onClose, form, isSaving, onTitleChange, onDescriptionChange, onDueDateChange, onSubmit, onClearForm}: TaskDrawerProps) => {
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
            onClose();
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
        <Drawer.Root
            open={isOpen}
            placement="bottom"
            size="full"
            onOpenChange={details => {
                if (!details.open) {
                    onClose();
                }
            }}
        >
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content borderTopRadius="2xl" h="auto" maxH="calc(100dvh - 3rem)">
                        <Drawer.Header>
                            <Drawer.Title>新增任務</Drawer.Title>
                            <Drawer.CloseTrigger />
                        </Drawer.Header>
                        <Drawer.Body pb="calc(var(--chakra-spacing-6) + max(env(safe-area-inset-bottom), var(--app-safe-area-inset-bottom, 0px)))">
                            <form onSubmit={handleSubmit}>
                                <Stack gap="4">
                                    <Field.Root required>
                                        <Field.Label>標題</Field.Label>
                                        <Input value={form.title} onChange={event => onTitleChange(event.target.value)} />
                                    </Field.Root>
                                    <Field.Root>
                                        <Field.Label>備註</Field.Label>
                                        <Textarea value={form.description} onChange={event => onDescriptionChange(event.target.value)} placeholder="可留空" resize="vertical" />
                                    </Field.Root>
                                    <Field.Root>
                                        <Field.Label>日期</Field.Label>
                                        <Input type="datetime-local" value={form.dueDate} onChange={event => onDueDateChange(event.target.value)} />
                                        <Field.HelperText>選擇日期同時間，預設當前時間。</Field.HelperText>
                                    </Field.Root>
                                    <Button type="submit" colorPalette="blue" loading={isSaving} width="100%">
                                        <FiPlus />
                                        新增任務
                                    </Button>
                                </Stack>
                            </form>
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
});
