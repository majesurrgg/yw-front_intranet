import { createContext, useState, useEffect } from "react";
import { createTaskRequest, getTaskRequest, deleteTaskRequest, updateTaskRequest } from "../api/task";
import type { CreateTask, Task, UpdateTask } from "../interfaces/task.interface";

interface TaskContextValue {
    tasks: Task[];
    createTask: (Task: CreateTask) => Promise<void>;
    deleteTask: (id: number) => Promise<void>;
    updateTask: (id: number, task: UpdateTask) => Promise<void>;
}

// util para que componente pueda acceder y usar funciones sin necesidad de pasarlas por props
export const VolunterContext = createContext<TaskContextValue>({
    tasks: [],
    createTask: async () => { },
    deleteTask: async () => { },
    updateTask: async () => { },
})

interface Props {
    children: React.ReactNode
}

export const TaskProvider: React.FC<Props> = ({ children }) => {
    const [tasks, setTask] = useState<Task[]>([]);

    useEffect(() => { // se ejecuta automaticamente una vez cuando el componente se muestra en pantalla
        getTaskRequest()
            .then((response) => response.json()) // llama a una API
            .then((data) => setTask(data));
    }, [])

    // utiliza el post y actualiza el estado
    const createTask = async (task: CreateTask) => {
        const res = await createTaskRequest(task)
        const data = await res.json()
        setTask([...tasks, data]);
    }

    const deleteTask = async (id: number) => {
        const res = await deleteTaskRequest(id)
        if (res.status == 202) {
            setTask(tasks.filter(task => task.id != id));
        }
    }

    const updateTask = async (id: number, task: UpdateTask) => {
        const res = await updateTaskRequest(id, task);
        const data = await res.json();
        setTask(
            tasks.map((task => task.id == id ? { ...task, ...data } : task))
        );
        console.log(data)
    }

    return (
        <VolunterContext.Provider
            value={{
                tasks,
                createTask,
                deleteTask,
                updateTask,
            }}>
            {children}
        </VolunterContext.Provider>
    )
}