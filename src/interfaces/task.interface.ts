export interface Task {
    id: number;
    title: string;
    description?: string;
    done?: boolean;
}

export type CreateTask = Omit<Task, 'id' | 'createdAt' | 'updateAt'>

export type UpdateTask = Partial<CreateTask>;