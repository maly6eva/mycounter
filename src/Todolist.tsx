import {FilterValuesType, TaskType} from "./App";
import {Button} from "./Button";
import {ChangeEvent, useState} from "react";

type PropsType = {
    title: string
    tasks: TaskType[]
    removeTask: (taskId: string) => void
    changeFilter: (filter: FilterValuesType) => void
    addTask: (taskTitle: string, taskNumber: number) => void
    changeTaskStatus: (taskId: string, newStatusV: boolean) => void
}

export const Todolist = ({
                             title,
                             tasks,
                             removeTask,
                             changeFilter,
                             addTask,
                             changeTaskStatus
                         }: PropsType) => {
    const [taskTitle, setTaskTitle] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const [totalSum, setTotalSum] = useState<number>(0)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value
         setTaskTitle(value)
    }


    const extractNumberAndText = (input: string): { text: string; number: number } => {
        let number = 0;
        let text = ''

        for (let char of input) {
            if (!isNaN(Number(char)) && char.trim() !== '') {
                number = number * 10 + Number(char)
            } else {
                text += char
            }
        }
        return {text: text.trim(), number}
    }

    const handleAddTask = () => {
        const trimmedValue = taskTitle.trim()
        if (trimmedValue === '') {
            setError('Ты ничего не ввел')
            return
        }
            const {text, number} = extractNumberAndText(trimmedValue)
            addTask(text, number)
            setTotalSum((prevSum) => prevSum + number)
            setTaskTitle('')
            setError(null)
    }


    const handleInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddTask()
        }
    }
    const handleRemoveTask = (id: string) => {
        const taskToRemove = tasks.find((task) => task.id === id)
        if (taskToRemove) {
            const numberToSubtract = taskToRemove.number || 0
            setTotalSum((prevSum) => prevSum - numberToSubtract)
        }
        removeTask(id)
    }
    
    return (
        <div>
            <h1>{title}</h1>
            <div>
                <input type='text'
                       placeholder='Введи строку и число'
                       value={taskTitle}
                       onChange={handleInputChange}
                       onKeyUp={handleInputEnter}
                />

                <Button title={'+'} onClick={handleAddTask}/>
                {error && <div className={'error-message'}>{error}</div>}
                <h2>
                    <span>Вы ввели: {taskTitle}</span>
                </h2>
            </div>
            {
                tasks.length === 0
                    ? <p>Тасок нет</p>
                    : <ol>
                        {tasks.map((task: TaskType) => {

                            const removeTaskHandler = () => {
                                handleRemoveTask(task.id)
                            }

                            const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
                                const newStatusValue = e.currentTarget.checked
                                changeTaskStatus(task.id, newStatusValue)
                            }


                           return  <li key={task.id}>
                                <input type="checkbox" checked={task.isDone} onChange={changeTaskStatusHandler}/>
                                {task.title} {task.number}
                                <Button title="x" onClick={removeTaskHandler }/>
                            </li>
                        })}
                    </ol>
            }
            {tasks.length > 0 && <h3>Сумма всех чисел: {totalSum}</h3>}
            <div>
                <Button title={'Все'} onClick={() => changeFilter('Все')}/>
                <Button title={'Обычный'} onClick={() => changeFilter('Обычный')}/>
                <Button title={'Отмеченный'} onClick={() => changeFilter('Отмеченный')}/>

            </div>
        </div>
    )
}
