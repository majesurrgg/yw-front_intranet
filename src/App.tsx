import VolunterForm from './components/VolunterForm'
import VolunterList from './components/VolunterList'
import { TaskProvider } from './context/VolunterContext'

export default function App() {
  return (
    <div className="bg-zinc-900 h-screen text-white flex items-center
    justify-center">
      <div className="bg-gray-950 p-4 w-2/5">
        <h1 className="text-3xl font-bold text-center block my-2"> Yachay Wasi Intranet </h1>
        
        <TaskProvider>
          <VolunterForm />
          <VolunterList />
        </TaskProvider>

      </div>
    </div>
  )
}
