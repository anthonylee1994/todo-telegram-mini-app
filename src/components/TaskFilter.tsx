import React from "react";
import {Tabs, Tab} from "@mui/material";
import {type TaskFilter as TaskFilterType} from "@/api/tasks";

const filterOptions: Array<{label: string; value: TaskFilterType}> = [
    {label: "全部", value: "all"},
    {label: "未完成", value: "pending"},
    {label: "已完成", value: "done"},
    {label: "今日", value: "today"},
    {label: "本週", value: "this_week"},
    {label: "已過期", value: "overdue"},
];

interface TabsProps {
    value: TaskFilterType;
    onChange: (value: TaskFilterType) => void;
}

export const TaskFilter = React.memo(({value, onChange}: TabsProps) => {
    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        onChange(newValue as TaskFilterType);
    };

    return (
        <Tabs value={value} onChange={handleChange} indicatorColor="secondary" textColor="inherit" variant="scrollable" scrollButtons="auto">
            {filterOptions.map(option => (
                <Tab key={option.value} label={option.label} value={option.value} sx={{minHeight: 44, minWidth: 76, flexShrink: 0, fontWeight: 600}} />
            ))}
        </Tabs>
    );
});
