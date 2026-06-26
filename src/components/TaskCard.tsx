import React from "react";
import {Badge, Box, Checkbox, Flex, HStack, IconButton, Heading, Stack, Text} from "@chakra-ui/react";
import {FiEdit2, FiTrash2} from "react-icons/fi";
import {type Task} from "../api/tasks";
import {useTaskStore} from "../stores/useTaskStore";
import {formatDueDate, getDueDateBadgeColor} from "../utils/taskUtil";
import {toaster} from "./ui/toaster";

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

export const TaskCard = React.memo(({task, onEdit}: TaskCardProps) => {
    const toggleTask = useTaskStore(state => state.toggleTask);
    const removeTask = useTaskStore(state => state.removeTask);

    const isCompleted = task.status === "completed";

    const handleToggle = async () => {
        try {
            await toggleTask(task);
        } catch (error) {
            toaster.create({
                title: "更新唔到",
                description: error instanceof Error ? error.message : "請再試一次",
                type: "error",
            });
        }
    };

    const handleDelete = async () => {
        const confirmed = await confirmDelete();

        if (!confirmed) {
            return;
        }

        try {
            await removeTask(task.id);
            toaster.create({
                title: "已刪除",
                type: "success",
            });
        } catch (error) {
            toaster.create({
                title: "刪除唔到",
                description: error instanceof Error ? error.message : "請再試一次",
                type: "error",
            });
        }
    };

    return (
        <Box as="article" borderWidth="1px" borderColor="border.subtle" borderRadius="lg" bg="bg.panel" p="4" shadow="xs">
            <Flex align="flex-start" gap="3">
                <Checkbox.Root checked={isCompleted} onCheckedChange={handleToggle} mt="1">
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                </Checkbox.Root>
                <Flex flex="1" minW="0" align="flex-start" justify="space-between" gap="3">
                    <Stack gap="2" flex="1" minW="0">
                        <Heading as="h3" size="sm" color={isCompleted ? "fg.muted" : "fg.default"} textDecoration={isCompleted ? "line-through" : "none"} wordBreak="break-word">
                            {task.title}
                        </Heading>
                        {task.description ? (
                            <Text color="fg.muted" fontSize="sm" whiteSpace="pre-wrap">
                                {task.description}
                            </Text>
                        ) : null}
                        <HStack gap="2" wrap="wrap">
                            <Badge colorPalette={getDueDateBadgeColor(task)} variant="subtle">
                                {formatDueDate(task.due_date)}
                            </Badge>
                            <Badge colorPalette={isCompleted ? "green" : "orange"} variant="subtle">
                                {isCompleted ? "已完成" : "未完成"}
                            </Badge>
                        </HStack>
                    </Stack>
                    <HStack gap="1" flexShrink="0">
                        <IconButton aria-label="編輯任務" variant="ghost" size="sm" onClick={() => onEdit(task)}>
                            <FiEdit2 />
                        </IconButton>
                        <IconButton aria-label="刪除任務" variant="ghost" colorPalette="red" size="sm" onClick={handleDelete}>
                            <FiTrash2 />
                        </IconButton>
                    </HStack>
                </Flex>
            </Flex>
        </Box>
    );
});
