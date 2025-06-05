import type { CreateTask, UpdateTask } from "../interfaces/task.interface"

//  Enviar al backend
const API = "http://localhost:3000/api"

export const createTaskRequest = (task: CreateTask) =>
    fetch(`${API}/tasks`, {
        method: 'POST',
        body: JSON.stringify(task),
        headers: {
            'Content-Type': 'application/json'
        }
    });

export const getTaskRequest = () => fetch(`${API}/tasks`)
// espero un id/ hago una peticion fetch DELETE
export const deleteTaskRequest = (id: number) =>
    fetch(`${API}/tasks/${id}`, {
        method: "DELETE",
    });

export const updateTaskRequest = async (id: number, task: UpdateTask) => 
    fetch(`${API}/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    });
    ;

