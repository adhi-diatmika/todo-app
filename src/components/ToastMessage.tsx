import React from "react"
import { Toast, ToastContainer } from "react-bootstrap"

interface ToastProps{
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
    message: string
}

const ToastMessage: React.FC<ToastProps> = ({show, setShow, message}) => {
    return (
        <ToastContainer position="top-end" className="mt-30 mr-30">
            <Toast bg="success" show={show} delay={3000} autohide onClose={() => setShow(false)}>
                <Toast.Header>
                    <strong className="me-auto">{message}</strong>
                </Toast.Header>
            </Toast>
        </ToastContainer>
    )
}

export default ToastMessage