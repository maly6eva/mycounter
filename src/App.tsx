import './App.css';
import {Todolist} from "./Todolist";
import {useState} from "react";
import {v1} from "uuid";

export type TaskType = {
    id: string;
    title: string
    isDone: boolean
    number?: number
}

export type FilterValuesType = 'Все' | 'Обычный' | 'Отмеченный'

function App() {
    const [tasks, setTasks] = useState<TaskType[]>([])

    const [filter, setFilter] = useState<FilterValuesType>('Все')

    const removeTask = (taskId: string) => {
        const filteredTasks = tasks.filter((task) => {
            return task.id !== taskId
        })
        setTasks(filteredTasks)
    }

    const changeFilter = (filter: FilterValuesType) => {
        setFilter(filter)
    }

    let tasksForTodolist = tasks
    if (filter === 'Обычный') {
        tasksForTodolist = tasks.filter(task => !task.isDone)
    }

    if (filter === 'Отмеченный') {
        tasksForTodolist = tasks.filter(task => task.isDone)
    }

    const addTask = (taskTitle: string, taskNumber: number) => {
        if (taskTitle.trim() === '') return

        const parsedNumber = Number(taskTitle)
        let newTask: TaskType = {
            id: v1(),
            title: isNaN(parsedNumber) ? taskTitle.trim() : taskTitle,
            number: isNaN(parsedNumber) ? taskNumber : parsedNumber,
            isDone: false
        }
        let newTasks = [newTask, ...tasks]
        setTasks(newTasks)
    }

    const  changeTaskStatus = (taskId: string, newStatusV: boolean) => {
        const task = tasks.find(t => t.id === taskId)
        if(task) {
            task.isDone = newStatusV
            setTasks([...tasks])
        }
    }
    return (
        <div className="App">
            <Todolist title="Счетчик чисел с пометками"
                      tasks={tasksForTodolist}
                      removeTask={removeTask}
                      changeFilter={changeFilter}
                      addTask={addTask}
                      changeTaskStatus={changeTaskStatus}

            />
        </div>
    );
}

export default App;
