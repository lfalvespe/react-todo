import { useState, useReducer, useRef } from 'react'

import './App.css'

import React_logo from './assets/react.svg'

const App = () => {

  const [taskTitle, setTaskTitle] = useState('')
  const [error, setError] = useState('')

  const InputTaskTitleRef = useRef()
  const inputEditRef = useRef()

  const taskListReducer = (taskList, action) => {

    switch (action.type) {

      case "REGISTER":

        const newTask = {
          id: Math.random(),
          title: taskTitle,
          isCompleted: false,
          isEditing: false
        }
        // clear state
        setTaskTitle('')
        return [...taskList, newTask]

      case "DELETE":
        return taskList.filter((task) => task.id !== action.id)

      case "CLEAR":
        return taskList = []

      case "MARK":
        return taskList.map(task =>
          task.id === action.id ? { ...task, isCompleted: !task.isCompleted } : task
        )

      case "TOGGLE":
        return taskList.map(task =>
          task.id === action.id ? { ...task, isEditing: !task.isEditing } : task
        )

      case "EDIT":

        const newTitle = taskTitle
        setTaskTitle('')

        return taskList.map(task =>
          task.id === action.id ? { ...task, title: newTitle } : task
        )

      default:
        return taskList
    }
  }

  const [taskList, dispatch] = useReducer(taskListReducer, [])

  //funções
  const handleRegister = (e) => {
    e.preventDefault()

    if (!taskTitle) {
      setError("O título não pode ser vazio!")
      InputTaskTitleRef.current.focus()
      return
    }

    dispatch({ type: "REGISTER" })
    InputTaskTitleRef.current.focus()
    InputTaskTitleRef.current.value = ''

    setError('')
  }

  const handleMark = (id) => {
    dispatch({ type: "MARK", id })
  }

  const handleDelete = (id) => {
    dispatch({ type: "DELETE", id })
  }

  const handleClear = () => {
    dispatch({ type: "CLEAR" })
  }

  const handleToggle = (id, isEditing) => {

    if (!isEditing) {

      setTimeout(() => {
        inputEditRef.current.focus()
      })

    }

    dispatch({ type: "TOGGLE", id })
    setError('')

  }

  const handleEdit = (id) => {

    if (!taskTitle) {
      setError("O título não pode ser vazio")
      setTimeout(() => {
        inputEditRef.current.focus()
      })
      return
    }

    dispatch({ type: "EDIT", id })
    dispatch({ type: "TOGGLE", id })
    setError('')

  }

  return (

    <div className='App'>
      <h1><img id='logo' src={React_logo} alt="" /> React Hooks</h1>
      <h2>(useReducer)</h2>

      <h3>TO DO LIST</h3>
      <hr />

      <div className="formContainer">
        <form onSubmit={handleRegister}>
          <input
            type="text"
            ref={InputTaskTitleRef}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder='Digite uma nova tarefa'
          />
          <button>Criar</button>
        </form>
      </div>

      <hr />

      {error && <p className='error'>{error}</p>}

      <h4>Tarefas</h4>

      {taskList.length === 0 ?
        <p style={{textShadow: "1px 1px 2px #00000056"}}>Não há tarefas cadastradas.</p> :

        <div >

          <ul>

            {taskList.map((task) => (

              <li className="taskContainer" key={task.id}>

                {!task.isEditing &&

                  <>
                    <input type="checkbox" aria-label='an apropriate label' id={task.id} className='mark' checked={task.isCompleted} onChange={() => handleMark(task.id)} />
                    <label htmlFor={task.id}>
                      <div className={`taskTitle ${task.isCompleted ? 'marked' : ''}`}>
                        {task.title}
                      </div>
                    </label>
                    <div>
                      <button className='editBtn' onClick={() => handleToggle(task.id)}>Edit</button>
                      <button className='delBtn' onClick={() => handleDelete(task.id)}>Del</button>
                    </div>
                  </>

                }

                {task.isEditing &&

                  <>
                    <input type="checkbox" aria-label='an apropriate label' className='mark' disabled />
                    <div className='taskTitle' >
                      <input
                        style={{ backgroundColor: "#fff", color: "navy" }}
                        ref={inputEditRef}
                        type="text"
                        placeholder="Digite um novo título"
                        onChange={(e) => setTaskTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <button className='changeBtn' onClick={() => handleEdit(task.id)}>Save</button>
                      <button className='cancelBtn' onClick={() => handleToggle(task.id, task.isEditing)}>Cancel</button>
                    </div>
                  </>
                }

              </li>

            ))}
          </ul>

        </div>

      }

      <button id='clear' onClick={handleClear}>Limpar lista</button>


    </div>

  )

}

export default App