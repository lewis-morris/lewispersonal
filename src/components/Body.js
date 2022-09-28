import Container from 'react-bootstrap/Container';
import Navbar from './Navbar';
import {useRef, useState} from "react";
import {CSSTransition} from "react-transition-group";
import Socials from "./Social";

export default function Body({ sidebar, children }) {
    const body = useRef()
    const [move, setMove] = useState(false)
    function pull_child_data(data){
        setMove(data)
    }
    return (
        <>
            {sidebar && <Navbar func={pull_child_data}/>}
            <CSSTransition in={move} classNames={"main-body"} timeout={500} onEnter={()=>{document.body.style.overflowY = "hidden"}} onExited={()=>{document.body.style.overflowY = "auto"}} >
                <Container fluid ref={body} className="main-body py-3">
                    <Container className="">
                        <Container className="Content">
                            {children}
                        </Container>
                    </Container>
                </Container>
            </CSSTransition>
            <Socials/>
        </>
    );
}