
import TaskItem from './VolunterItem'
import { useTasks } from "../context/useTasks"

function VolunterList() { // declarar componente funcional en React
  const{tasks} = useTasks()

  return (
    <div>
      {
        tasks.map(task => (
          <TaskItem task={task} key={task.id} />
        ))
      }
    </div>
  )
}

export default VolunterList