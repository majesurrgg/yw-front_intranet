import { useContext } from "react"
import { VolunterContext } from "./VolunterContext"

export const useTasks = () => {
    const context = useContext(VolunterContext)
    if (!context) throw new Error('useTasks must be used within a taskProvider')
    return context
}