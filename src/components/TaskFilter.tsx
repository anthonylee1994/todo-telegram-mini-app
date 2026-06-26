import React from "react";
import {Tabs} from "@chakra-ui/react";
import {type TaskFilter as TaskFilterType} from "../api/tasks";

const filterOptions: Array<{label: string; value: TaskFilterType}> = [
    {label: "全部", value: "all"},
    {label: "今日", value: "today"},
    {label: "今週", value: "this_week"},
    {label: "過期", value: "overdue"},
];

interface TabsProps {
    value: TaskFilterType;
    onChange: (value: TaskFilterType) => void;
}

export const TaskFilter = React.memo(({value, onChange}: TabsProps) => {
    return (
        <Tabs.Root
            value={value}
            onValueChange={details => {
                const nextFilter = details.value as TaskFilterType | null;
                if (nextFilter) {
                    onChange(nextFilter);
                }
            }}
        >
            <Tabs.List>
                {filterOptions.map(option => (
                    <Tabs.Trigger key={option.value} value={option.value}>
                        {option.label}
                    </Tabs.Trigger>
                ))}
            </Tabs.List>
        </Tabs.Root>
    );
});
