import React from "react";
import {SegmentGroup} from "@chakra-ui/react";
import {type TaskFilter} from "../api/tasks";

const filterOptions: Array<{label: string; value: TaskFilter}> = [
    {label: "全部", value: "all"},
    {label: "今日", value: "today"},
    {label: "今週", value: "this_week"},
    {label: "過期", value: "overdue"},
];

interface TaskFilterProps {
    value: TaskFilter;
    onChange: (value: TaskFilter) => void;
}

export const TaskFilter = React.memo(({value, onChange}: TaskFilterProps) => {
    const handleFilterChange = (details: {value: string | null}) => {
        const nextFilter = details.value as TaskFilter | null;

        if (nextFilter) {
            onChange(nextFilter);
        }
    };

    return (
        <SegmentGroup.Root value={value} onValueChange={handleFilterChange} width="100%">
            <SegmentGroup.Indicator />
            <SegmentGroup.Items items={filterOptions} />
        </SegmentGroup.Root>
    );
});
