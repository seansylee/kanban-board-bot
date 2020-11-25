import { Task } from "../models/task";

export namespace Kanban.Board {
    interface Column {
        getName: () => string;
        getTasks: () => Task[];
        add: (task: Task) => void;
        remove: (task: Task) => void;
        clear: () => void;
        contains: (task: Task) => boolean;
        findMatch: (task: Task) => Task | undefined;
    }
}