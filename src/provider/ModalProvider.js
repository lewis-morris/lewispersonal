import {createContext, useContext, useRef, useState} from "react";
import {CSSTransition} from "react-transition-group";
import {Button, Form} from "react-bootstrap";
export const ModalContext = createContext()

export default function ModalProvider({children}){

    const [open, setOpen] = useState(false)
    const backdrop = useRef()
    function openModal(){
        setOpen(true)
    }
    function closeModal(e){
        if(e.target === backdrop.current) setOpen(false);
    }
    function toggleModal(){
        setOpen(!open)
    }

    return (
        <ModalContext.Provider value={{openModal,closeModal,toggleModal}}>
            <>
                <CSSTransition in={open} timeout={600} classNames="modal-back" unmountOnExit>
                    <div onClick={closeModal} className={"modal-back"}></div>
                </CSSTransition>
                <CSSTransition in={open} timeout={500} classNames="modal-front" unmountOnExit onEnter={()=>{document.body.style.overflowY = "hidden"}} onExited={()=>{document.body.style.overflowY = "auto"}}>
                    <div ref={backdrop} onClick={closeModal} className="modal-front">
                        <div className="modal-front-main p-5">
                            <h3>Contact Me</h3>
                            <Form>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" />
                                    <Form.Text className="text-muted">
                                        We'll never share your email with anyone else.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Check type="checkbox" label="Check me out" />
                                </Form.Group>
                                <Button variant="outline-primary" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        </div>
                    </div>
                </CSSTransition>
            </>
            {children}
        </ModalContext.Provider>
    )
}
export function useModal (){
    return useContext(ModalContext);
}