import { useTasks } from '../context/useTasks'
import type { Task } from '../interfaces/task.interface'
import { IoCheckboxOutline } from "react-icons/io5";
import { IoTrashBin } from "react-icons/io5";

interface Props {
    task: Task
}

function VolunterItem({ task }: Props) {

    const { deleteTask, updateTask } = useTasks()

    return (
        <div key={task.id} className='bg-gray-900 p-2 my-2 flex
        justify-between hover:bg-gray-800 hover:cursor-pointer'>
            <div>
                <h1>{task.title}</h1>
                <p>{task.description}</p>
            </div>
            <div className='flex gap-x-2'>
                {
                    task.done ? (<IoCheckboxOutline
                        className='text-green-700 cursor-pointer'
                        onClick={() => {
                            updateTask(task.id, {
                                title: task.title,
                                done: !task.done,
                            });
                        }}
                    />) : (<IoCheckboxOutline
                        className='text-gray-500 cursor-pointer'
                        onClick={() => {
                            updateTask(task.id, {
                                title: task.title,
                                done: !task.done,
                            });
                        }}
                    />)
                }


                <IoTrashBin onClick={async () => {
                    if (!window.confirm("¿Estas seguro(a) de eliminar esta tarea?"))
                        return;
                    await deleteTask(task.id)
                }} />
            </div>

        </div>
    )
}

export default VolunterItem