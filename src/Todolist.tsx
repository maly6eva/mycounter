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
    const [filter, setFilter] = useState<FilterValuesType>('Все')

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
        setTaskTitle('')
        setError(null)
    }

    const handleInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddTask()
        }
    }

    const handleRemoveTask = (id: string) => {
        removeTask(id)
    }

    const calculateTotalSum = () => {
        const filterTasks = filter === 'Все'
            ? tasks
            : filter === 'Обычный'
                ? tasks.filter(task => !task.isDone)
                : tasks.filter(task => task.isDone)
        return filterTasks.reduce((sum, task) => sum + (task.number || 0), 0)
    }

    const totalsum = calculateTotalSum()

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

                <Button title={'добавить'} onClick={handleAddTask}/>
                {error && <div className={'error-message'}>{error}</div>}

            </div>

            {tasks.length === 0
                ? (<p>Тасок нет</p>)
                : (<ol>
                        {tasks.map((task: TaskType) => {
                            const removeTaskHandler = () => {
                                handleRemoveTask(task.id)
                            }

                            const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
                                const newStatusValue = e.currentTarget.checked
                                changeTaskStatus(task.id, newStatusValue)
                            }

                            return <li key={task.id}>
                                <input type="checkbox"
                                       checked={task.isDone}
                                       onChange={changeTaskStatusHandler}/>
                                {task.title} {task.number}
                                <Button title="x" onClick={removeTaskHandler}/>
                            </li>
                        })}
                    </ol>
                )}
            <h3>Сумма всех чисел: {totalsum}</h3>
            <div>
                <Button title={'Все'} onClick={() => changeFilter('Все')}/>
                <Button title={'Обычный'} onClick={() => changeFilter('Обычный')}/>
                <Button title={'Отмеченный'} onClick={() => changeFilter('Отмеченный')}/>
            </div>
        </div>
    )
}