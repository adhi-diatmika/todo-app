import { LocalizationProvider, MobileDateTimePicker } from "@mui/lab"
import React, { useState } from "react"
import { TodoState } from "./TodoList"
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TextField from '@mui/material/TextField';
import { Button } from "react-bootstrap";
import { api } from "../helpers/helper";

interface TodoProps{
    userid: string,
    todoList: TodoState["todo"],
    setTodoList: React.Dispatch<React.SetStateAction<TodoState["todo"]>>

    setToastMessage: React.Dispatch<React.SetStateAction<string>>
    setShowToast: React.Dispatch<React.SetStateAction<boolean>>
}

const TodoForm: React.FC<TodoProps> = ({userid, todoList, setTodoList, setToastMessage, setShowToast}) => {
    const [todo, setTodo] = useState({
        id: "",
        userid: "",
        title: "",
        status: "",
        duedate: ""
    })
    const [dateNow, setDateNow] = React.useState<Date | null>(new Date());

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        console.log(userid)
        setTodo({
            ...todo,
            [e.target.name]: e.target.value
        })
    }

    const handleClick = (): void => {
        if(!todo.title || !dateNow){
            setToastMessage("Please fill all forms")
            setShowToast(true)
            return
        }

        let data = {
            userid: userid,
            title: todo.title,
            status: "open",
            duedate: dateNow
        }

        api.post("/todo", data).then((value) => {
            setTodo({
                id: "",
                userid: "",
                title: "",
                status: "",
                duedate: ""
            })
            api.get("/todo?_sort=id&_order=desc&userid=" + userid).then((value) => {
                setTodoList(value.data)
            }).catch((err) => {
                setShowToast(true)
                setToastMessage(err.message)
            })
        }).catch((err) => {
            setShowToast(true)
            setToastMessage(err.message)
        })
    }

    return (
        <div className="container-login">
            <label htmlFor="" className="form-label">Title</label>
            <input 
                type="text" 
                placeholder="This is todo title"
                className="form-input"
                value={todo.title}
                onChange={handleChange}
                name="title"
            />
            <label htmlFor="" className="form-label">Due Date</label>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDateTimePicker
                    value={dateNow}
                    inputFormat="dd MMMM yyyy hh:mma"
                    onChange={(newValue) => {
                        setDateNow(newValue);
                    }}
                    renderInput={(params) =>
                        <TextField {...params} />
                    }
                />
            </LocalizationProvider>
            <div className="center">
                <Button
                    className="btn btn-primary"
                    onClick={handleClick}
                >
                    Save
                </Button>
            </div>
            {/* <div className="center">
                <Button
                    className="btn btn-secondary"
                    // onClick={handleClick}
                >
                    Cancel
                </Button>
            </div> */}
        </div>
    )
}

export default TodoForm