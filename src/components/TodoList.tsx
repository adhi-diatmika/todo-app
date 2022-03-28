import React, { useEffect, useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { UserState } from "../App"
import TodoForm from "./TodoForm";
import { FaTrashAlt } from "react-icons/fa";
import Moment from "moment";
import ToastMessage from "./ToastMessage";
import { api, ucwords } from "../helpers/helper";

export interface TodoState {
    todo: {
        id: string,
        userid: string,
        title: string,
        status: string,
        duedate: string
    }[]
}

const TodoList: React.FC<UserState> = ({ user }) => {

    const [username, setUsername] = useState("");
    const [userid, setUserid] = useState("");
    const [todoList, setTodoList] = useState<TodoState["todo"]>([]);
    const { name } = useParams();
    const navigate = useNavigate();
    const today = new Date();

    const [show, setShow] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const getData = (userid: string) => {
        api.get("todo?_sort=id&_order=desc&userid=" + userid).then((value) => {
            setTodoList(value.data)
        }).catch((err) => {
            setShow(true)
            setToastMessage(err.message)
        })
    }

    useEffect(() => {
        let oldUser = JSON.parse(localStorage.getItem('user') ?? '')
        if(user.id) {
            setUsername("Hi, " + user.name)
            setUserid(user.id)
            localStorage.setItem('user', JSON.stringify(user))

            getData(user.id)
        }else{
            if(oldUser["name"] === name?.toLowerCase() ){
                setUsername("Hi, " + oldUser["name"])
                setUserid(oldUser["id"])
                getData(oldUser["id"])
            }else{
                navigate("/")
            }
        }
    }, [name, navigate, user])

    const updateTodo = (todoData: {
        id: string,
        userid: string,
        title: string,
        status: string,
        duedate: string
    }) => {
        let data = {
            userid: todoData.userid,
            title: todoData.title,
            status: "done",
            duedate: todoData.duedate
        }
        api.put("/todo/" + todoData.id, data).then((value) => {
            getData(userid)
        }).catch((err) => {
            setShow(true)
            setToastMessage(err.message)
        })
    }

    const deleteTodo = (id: string) => {
        api.delete("/todo/" + id).then((value) => {
            getData(userid)
        }).catch((err) => {
            setShow(true)
            setToastMessage(err.message)
        })
    }

    const renderList = (): JSX.Element[] => {
        return todoList.map((todo) => {
            const overdue = Date.parse(todo.duedate) < Date.parse(today.toString()) && todo.status !== "done"
            return (
                <ListGroup.Item className="card-todo" key={todo.id}>
                    <div className="display-flex">
                        <p 
                            className={"container-status " + (todo.status === "open" ? overdue ? "status-overdue" : "status-open" : "status-done")}
                        >{overdue ? "OVERDUE" : todo.status.toUpperCase()}</p>
                        <div className="container-icon" onClick={() => {deleteTodo(todo.id)}}>
                            <p><FaTrashAlt size={15}/></p>    
                        </div>                    
                    </div>
                    <h2>{ucwords(todo.title)}</h2>
                    <div className="display-flex">
                        <p>Due Date: {Moment(todo.duedate).format("DD MMMM yyyy hh:mmA")} </p>
                        {todo.status !== "done" &&
                            <Button onClick={() => {updateTodo(todo)}} className="ml-10">DONE</Button>
                        }
                    </div>
                </ListGroup.Item>
            )
        })
    }

    return (
        <div className="container">
            <ToastMessage show={show} setShow={setShow} message={toastMessage}/>
            <h2 className="mb-30 mt-30">{ucwords(username)}</h2>
            <div className="row">
                <div className="col-md-4 mb-30">
                    <TodoForm 
                        todoList={todoList} 
                        setTodoList={setTodoList} 
                        userid={userid} 
                        setToastMessage={setToastMessage} 
                        setShowToast={setShow}
                    />
                </div>
                <div className="col">
                    { todoList.length == 0 && 
                        <div className="center">
                            <p>No Data</p>
                        </div>
                    }
                    <ListGroup>
                        { todoList.length > 0 && renderList() }
                    </ListGroup>
                </div>
            </div>
        </div>
    )
}

export default TodoList