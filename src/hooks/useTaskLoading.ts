import {useEffect} from "react";
import {useTaskStore} from "../stores/useTaskStore";
import {type TaskFilter} from "../api/tasks";

export function useTaskLoading(filter: TaskFilter) {
    const loadTasks = useTaskStore(state => state.loadTasks);

    useEffect(() => {
        void loadTasks();
    }, [filter, loadTasks]);
}
