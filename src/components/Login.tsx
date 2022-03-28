import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserState } from "../App";
import { FaArrowRight } from "react-icons/fa";
import ToastMessage from "./ToastMessage";
import { api } from "../helpers/helper";

interface UserProps{
    user: UserState["user"],
    setUser: React.Dispatch<React.SetStateAction<UserState["user"]>>
}

const Login: React.FC<UserProps> = ({ user, setUser }) => {

    const navigate = useNavigate()

    const [show, setShow] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const [userInput, setUserInput] = useState({
        id: "",
        name: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setUserInput({
            ...userInput,
            [e.target.name]: e.target.value
        })
    }

    const handleClick = (): void => {
        if(!userInput.name){
            setShow(true)
            setToastMessage("Name required")
            return
        }

        let data = {
            name: userInput.name,
            id: userInput.id
        }

        api.get("/users?name=" + userInput.name.toLowerCase().trim()).then((value) => {
            if(value.data.length > 0){
                setUser(value.data[0])
                navigate(userInput.name)
            }else{
                api.post("/users", data).then((value) => {
                    setUser(value.data)
            
                    setUserInput({
                        id: "",
                        name: ""
                    })
            
                    navigate(userInput.name)
                }).catch((err) => {
                    setShow(true)
                    setToastMessage(err.message)
                })
            }
        }).catch((err) => {
            setShow(true)
            setToastMessage(err.message)
        })
    }

    return (
        <div className="container-login">
            <ToastMessage show={show} setShow={setShow} message={toastMessage}/>
            <label htmlFor="" className="form-label">Name</label>
            <input 
                type="text" 
                placeholder="Name"
                className="form-input"
                value={userInput.name}
                onChange={handleChange}
                name="name"
            />
            <Button
                className="btn-login"
                onClick={handleClick}
            >Next <span><FaArrowRight size={15}/></span> </Button>
        </div>
    )
}

export default Login