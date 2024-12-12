import {FilterValuesType, TaskType} from "./App";
import {Button} from "./Button";
import {useState} from "react";

type PropsType = {
    title: string
    tasks: TaskType[]
    removeTask: (taskId: string) => void
    changeFilter: (filter: FilterValuesType) => void
    addTask: (taskTitle: string, taskNumber: number) => void
}

export const Todolist = ({
                             title,
                             tasks,
                             removeTask,
                             changeFilter,
                             addTask
                         }: PropsType) => {
    const [taskTitle, setTaskTitle] = useState<string>('')
    const [extractedNumber, setExtractedNumber] = useState<number | null>(null)
    const [extractedText, setExtractedText] = useState<string>('')

    const [totalSum, setTotalSum] = useState<number>(0)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value
        setTaskTitle(value)

        let number = 0;
        let text = '';

        for (let char of value) {
            if (!isNaN(Number(char)) && char !== '') {
                number = number * 10 + Number(char)
            } else {
                text += char
            }
        }
        setExtractedNumber(isNaN(number) ? null : number)
        setExtractedText(text.trim())
    }


    const extractNumberAndText = (input: string): { text: string; number: number } => {
        let number = 0;
        let text = ''

        for (let char of input) {
            if (!isNaN(Number(char)) && char !== ' ') {
                number = number * 10 + Number(char)
            } else {
                text += char
            }
        }
        return {text: text.trim(), number: isNaN(number) ? 0 : number}
    }

    const handleAddTask = () => {
        const trimmedValue = taskTitle
        if (trimmedValue === '') return
        const {text, number} = extractNumberAndText(trimmedValue)
        addTask(text || `Задача без текста`, number)
        setTotalSum((prevSum) => prevSum + number)
        setTaskTitle('')
    }

    const handleRemoveTask = (id: string) => {
        const taskToRemove = tasks.find((task) => task.id === id)
        if (taskToRemove) {
            const numberToSubtract = taskToRemove.number ?? 0
            setTotalSum((prevSum) => prevSum - numberToSubtract)
        }
        removeTask(id)
    }

    return (
        <div>
            <h3>{title}</h3>
            <div>
                <input type='text'
                       placeholder='Введи строку и число'
                       value={taskTitle}
                       onChange={handleInputChange}/>
                <Button title={'+'} onClick={handleAddTask}/>

                <h2>
                    <span>Вы ввели: {taskTitle}</span>
                </h2>
            </div>
            {tasks.length === 0 ? (
                <p>Тасок нет</p>
            ) : (
                <ol>
                    {tasks.map((task: TaskType) => (
                        <li key={task.id}>
                            <input type="checkbox" checked={task.isDone}/>
                            {task.title} {task.number}
                            <Button title="x" onClick={() => handleRemoveTask(task.id)}/>
                        </li>
                    ))}
                </ol>
            )}
            <p>Сумма всех чисел: {totalSum}</p>
            <div>
                <Button title={'All'} onClick={() => changeFilter('all')}/>
                <Button title={'Active'} onClick={() => changeFilter('active')}/>
                <Button title={'Completed'} onClick={() => changeFilter('completed')}/>
            </div>
        </div>
    )
}
