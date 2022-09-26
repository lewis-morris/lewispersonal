import Nav from "react-bootstrap/Nav";
import {useLocation, useNavigate} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHouse, faHatWizard, faChartColumn, faMessage} from '@fortawesome/free-solid-svg-icons';
import {useModal} from "../provider/ModalProvider";
import {CSSTransition} from "react-transition-group";
import {useEffect, useState} from "react";

function NavButton(props) {
    let navigate = useNavigate()
    const navi = () => {
        props.close_nav()
        navigate(props.to, )
    }
    return (<Nav.Item>
            <Nav.Link activeclassname="active" className="nav-link-hov" onClick={navi}>
                <span className="text-smaller"><code className="navcode">0{props.no}.</code><br/></span>
                {props.children}
                <FontAwesomeIcon className="ico-sm" icon={props.icon} transform={{rotate: 5}}/>
                <div className="nav-underline"></div>
            </Nav.Link>
        </Nav.Item>)
}

export default function Navbar({func}) {
    const buttons = [["/", "Home", faHouse], ["/experience", "Experience", faHatWizard], ["/skills", "Skills", faChartColumn]]
    let i = 0
    const modal = useModal()
    const [open, setOpen] = useState(false)
    const location = useLocation();


    const toggle_nav = () => {
        setOpen(!open)
        func(!open)
    }

    const close_nav = () => {
        setOpen(false)
        func(false)
    }

    useEffect(() => {
        close_nav()
    }, [location]);

    return (<>
        <CSSTransition in={open} timeout={300} classNames="nav">
            <Nav id="nav" sticky="top" className="shadow fs-5 justify-content-end">
                <div className={"nav-items-holder"}>
                    {buttons.map(x => {
                        i++
                        return (
                            <NavButton close_nav={close_nav} icon={x[2]} key={i} no={i} to={x[0]}>{x[1]}</NavButton>)
                    })}
                    <Nav.Item onClick={() => {
                        close_nav();
                        modal.toggleModal()
                    }}>
                        <Nav.Link activeclassname="active" className="nav-link-hov text-light">
                        <span className="text-smaller"><code
                            className="navcode">0{buttons.length + 1}.</code><br/></span>
                            Contact
                            <FontAwesomeIcon className="ico-sm" icon={faMessage} transform={{rotate: 5}}/>
                            <div className="nav-underline"></div>
                        </Nav.Link>
                    </Nav.Item>


                </div>

            </Nav>
        </CSSTransition>

        <CSSTransition in={open} timeout={300} classNames="nav-ham">
            <div className={"d-block d-lg-none fixed-hamburger nav-ham"}>
                <svg className={"ham hamRotate ham1" + (open ? " active" : "")} viewBox="0 0 100 100" width="55"
                     onClick={toggle_nav}>
                    <path
                        className="line top"
                        d="m 30,33 h 40 c 0,0 9.044436,-0.654587 9.044436,-8.508902 0,-7.854315 -8.024349,-11.958003 -14.89975,-10.85914 -6.875401,1.098863 -13.637059,4.171617 -13.637059,16.368042 v 40"/>
                    <path
                        className="line middle"
                        d="m 30,50 h 40"/>
                    <path
                        className="line bottom"
                        d="m 30,67 h 40 c 12.796276,0 15.357889,-11.717785 15.357889,-26.851538 0,-15.133752 -4.786586,-27.274118 -16.667516,-27.274118 -11.88093,0 -18.499247,6.994427 -18.435284,17.125656 l 0.252538,40"/>
                </svg>
            </div>
        </CSSTransition>
    </>);
}