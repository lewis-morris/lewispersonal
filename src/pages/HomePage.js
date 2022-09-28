import Body from '../components/Body';
import {Button, Col, Row} from "react-bootstrap";
import Page from "../components/Page";
import Typer from "../components/Typer";
import {useModal} from "../provider/ModalProvider";
import {CSSTransition} from "react-transition-group";
import React, {useEffect, useRef, useState} from 'react';
import {Bodies, Body as Bod, Composite, Common} from 'matter-js'
import {useMatter} from "../provider/MatterProvider";
import golf from "../images/golf.png"
import {randomIntFromInterval} from "../functions";
import _ from "lodash"

const short = require('short-uuid');

function degrees_to_radians(degrees) {
    let pi = Math.PI;
    return degrees * (pi / 180);
}

// function radians_to_degrees(radians) {
//     let pi = Math.PI;
//     return radians * (180 / pi);
// }

class Objecto {

    constructor(customId, ref, sticky, options = {}, is_generated = false) {
        this.customId = customId ? customId : short.generate()
        this.alive = true
        this.clientX = document.body.scrollWidth
        this.clientY = document.body.scrollHeight
        this.is_generated = is_generated
        // get inital angle
        const start_angle = ref.current.getAttribute("data-angle") || 0
        // get data options
        const dOptions = JSON.parse(ref.current.getAttribute("data-options")) || {}
        this.el = ref
        this.bb = ref.current.getBoundingClientRect()

        this.centerX = this.bb.left + this.bb.width / 2;
        this.centerY = this.bb.top + this.bb.height / 2;

        this.width = this.bb.width;
        this.height = this.bb.height
        this.left = 0
        this.top = 0
        this.offsetX = 0
        this.offsetY = 0
        // need this as passed in positon for style is killing the object
        if ("position" in options) options = _.omit(options, "position");

        // set options
        this.merged_options = {
            ...{
                friction: 0,
                restitution: 0.95,
                angle: start_angle ? degrees_to_radians(Number(start_angle)) : 0,
                isStatic: false
            }, ...options, ...dOptions
        };

    }


    get_center_point() {
        return this.body.position
    }

    get_angle = () => {
        return this.body.angle
    }

    apply_force = (force = 0.08) => {
        // applys a random force to the object acting like an explosion
        let forceMagnitude = force * this.body.mass;
        Bod.applyForce(this.body, this.body.position, {
            x: (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]),
            y: (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1])
        });
    }

    update = () => {
        this.top = this.body.position.y - this.height / 2
        this.left = this.body.position.x - this.width / 2

        return {
            position: "fixed",
            height: `${this.height}px`,
            width: `${this.width}px`,
            left: `${this.left - this.offsetX}px`,
            top: `${this.top - this.offsetY}px`,
            rotate: `${this.get_angle()}rad`
        }
    }

    check_dead() {
        // check to see if off the page then kill
        this.top = this.body.position.y - this.height / 2
        this.left = this.body.position.x - this.width / 2
        return this.left > this.clientX || this.left + this.width < 0 || this.top > this.clientY
    }

}


// class ConstraintO extends Objecto {
//     constructor(other, x, y, world, ...params) {
//         super(...params)
//         this.body = Constraint.create({
//             pointA: {x: x, y: y}, bodyB: other, pointB: {x: 0, y: 0}, stiffness: 0.01, damping: 0.01
//         });
//         this.body["ob"] = this
//         Composite.add(world, this.body)
//         this.el.style.position = "fixed"
//     }
//
//     get_distance = () => {
//         let a = this.body.pointA.x - this.body.bodyB.position.x;
//         let b = this.body.pointA.y - this.body.bodyB.position.y;
//         return Math.sqrt(a * a + b * b);
//     }
//     get_angle = () => {
//         return Math.atan2(this.body.pointA.y - this.body.bodyB.position.y, this.body.pointA.x - this.body.bodyB.position.x);
//     }
//     update = () => {
//
//         let distance = this.get_distance()
//
//         let center_y = (this.body.pointA.y + this.body.bodyB.position.y) / 2
//         let center_x = (this.body.pointA.x + this.body.bodyB.position.x) / 2
//
//         let top = center_y - (this.height / 2)
//         let left = center_x - (distance / 2)
//
//         // let top = this.body.pointA.y - this.height * 2
//         // let left = this.body.pointA.x - distance / 2
//
//         // check to see if off the page then kill
//         let kill = left > this.clientX || left + this.width < 0 || top > this.clientY
//         if (kill) {
//             // this.remove()
//         } else {
//             // else move the element
//             this.el.style.width = distance
//             this.el.style.position = "fixed";
//             this.el.style.left = `${left}px`
//             this.el.style.top = `${top}px`
//             this.el.style.rotate = `${this.get_angle()}rad`
//             this.el.style.background = "white";
//             // this.el.style.zIndex= "-1"
//         }
//     }
//
//
// }

class Block extends Objecto {
    constructor(world, ...params) {
        super(...params)
        this.body = Bodies.rectangle(this.centerX, this.centerY, this.bb.width, this.bb.height, this.merged_options);
        this.body["ob"] = this
        Composite.add(world, this.body)
    }
}

class Circle extends Objecto {
    constructor(world, ...params) {
        super(...params)
        this.radius = this.width / 2;
        this.body = Bodies.circle(this.centerX, this.centerY, this.radius, this.merged_options);
        this.body["ob"] = this
        Composite.add(world, this.body)
    }

    get_angle = () => {
        return this.body.angle * 3
    }
}

function MatterElement({
                           customId, sticky = false, typ, initialDimensions = {}, options = {}, delay = 0, key, children
                       }) {

    const elementItem = useRef()
    const matterOb = useRef(false)
    const [update, setUpdate] = useState(0)
    const matter = useMatter()


    useEffect(() => {
        setTimeout(() => {
            if (typ === "block") {
                matterOb.current = new Block(matter.getItems().world.current, customId, elementItem, sticky, options)
                matter.setBlocks([setUpdate, matterOb.current])
            } else if (typ === "circle") {
                matterOb.current = new Circle(matter.getItems().world.current, customId, elementItem, sticky, options)
                matter.setBlocks([setUpdate, matterOb.current])
            }
        }, delay)

    }, [])

    function make_dead() {
        matterOb.current.alive = false
    }

    if (matterOb.current.alive || !matterOb.current) {
        return (<span style={matterOb.current ? matterOb.current.update() : initialDimensions}
                      ref={elementItem}>
                {children}
            </span>)
    } else {
        return (<></>)
    }

}

export default function HomePage() {

    const modal = useModal()
    let index = useRef(0)
    const matter_els = useRef([])
    const height = document.body.scrollHeight
    const alives_total = useRef(0)
    const [loads, setLoads] = useState(0)
    const matter = useMatter()
    const max_items = 350

    // this will add 10 elements every seconds to the screen

    useEffect(() => {
        const handleScroll = event => {
            console.log('window.scrollY', window.scrollY);
            matter.setOffset(window.scrollY)
        };
        // const create_on_move = (event) => {
        //     // _.throttle(()=>{make_new_star_element(event.clientX,event.clientY)}, 50)()
        // }
        const limit_make_star = _.throttle((event) => {
            make_new_star_element(event.clientX, event.clientY)
        }, 200)
        const makeStars = (event) => {
            console.log(event.button)
            if (event.buttons === 1) {
                limit_make_star(event)
            }

        }
        window.addEventListener('scroll', handleScroll);
        // window.addEventListener("mousedown",  create_on_move)
        window.addEventListener("mousemove", makeStars)
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    function makeFirstLocation() {
        // makes the starting point of this item
        let y_position = randomIntFromInterval(height * .8 * -1, height * .9)
        let options
        let calc_dimens
        let className

        let rand = randomIntFromInterval(0, 200)
        if (rand > 168) {
            calc_dimens = randomIntFromInterval(6, 14)
            options = {restitution: 0.8, friction: 0.05, frictionAir: randomIntFromInterval(60, 90) / 4000}
            className = randomIntFromInterval(0, 10) < 9 ? "near star" : "upclose star"
        } else if (rand < 3) {
            if (randomIntFromInterval(1, 5) == 3) {
                calc_dimens = randomIntFromInterval(30, 60)
            } else {
                calc_dimens = randomIntFromInterval(10, 35)
            }
            options = {restitution: 0.8, friction: 0.05, frictionAir: randomIntFromInterval(70, 90) / 400}
            className = randomIntFromInterval(0, 10) < 9 ? "further big-star" : "upclose big-star"
        } else {
            calc_dimens = randomIntFromInterval(1, 5)
            options = {restitution: 0.8, friction: 0.05, frictionAir: randomIntFromInterval(70, 90) / 1000}
            className = randomIntFromInterval(0, 10) < 9 ? "further sm-star" : "upclose sm-star"
        }

        if (randomIntFromInterval(0, 1) === 0) {
            className += " opacity_flux"
        }

        let init = {
            position: "fixed",
            height: calc_dimens + "px",
            width: calc_dimens + "px",
            left: 0 + "px",
            top: y_position + "px"
        }

        return [true, init, options, className]
    }

    function make_new_star_element(x, y) {
        index.current = index.current + 1
        let [sticky, initial_dimensions, options, className] = makeFirstLocation()

        // sometimes mouse clicks determine the position of the star
        if (x) {
            initial_dimensions.left = x
            initial_dimensions.top = y
        }
        matter_els.current.push({
            index: index.current,
            customId: short.generate(),
            sticky: sticky,
            typ: "circle",
            initial: initial_dimensions,
            options: options,
            className: className
        })
    }

    function explosion() {
        matter.getBlocks().forEach(mjs => {
            mjs[1].apply_force()
        })
    }

    useEffect(() => {

        let timer = setTimeout(() => {

            if (alives_total.current < max_items) {
                // every so often have an explosion
                let times = 2
                for (let x = 0; x < randomIntFromInterval(1, times); x++) {
                    //create elements randomly
                    setTimeout(() => {
                        make_new_star_element()
                    }, randomIntFromInterval(0, 600))
                }
                setLoads(x => x + 1)

            }

        }, randomIntFromInterval(0, 150))

        return () => {
            clearTimeout(timer)
        }

    }, [loads])

    useEffect(() => {
        // this caused me the biggested headache in the world, I initially have it running straight after the loop in
        // the effect above that created each array item that's due to be rendered. Becuase they hadn't been created
        // they kept being removed instantly and it made me want to cry.
        let timer = setInterval(() => {
            let new_els = []
            let alives = matter.getAlive()
            let old_alives = alives.length
            alives_total.current = alives.length

            matter_els.current.forEach((x) => {
                if (_.includes(alives, x.customId)) {
                    new_els.push(x)
                }
            })
            matter_els.current = new_els

            if (old_alives < max_items) {
                setLoads(x => x + 1)
            }
        }, 1000)

        return () => {
            clearInterval(timer)
        }

    }, [])
    return (

        <>
            <div className={"matter-board"}>
                {matter_els.current.map((x) => {
                    return (<MatterElement key={x.index} customId={x.customId} sticky={x.sticky} typ={x.typ}
                                           initialDimensions={x.initial} options={x.options}>
                        <img className={"img-responsive " + x.className} alt="golf ball" src={golf}></img>
                    </MatterElement>)
                })}
            </div>
            <Page content={<Body sidebar>

                <Row>
                    <Col lg="10">
                        <div className="intro-home">
                            <div className={"mb-4"}>
                                <div>
                                    {/*<div className="environment"></div>*/}
                                    <h1 className="big hero glitch layers" data-text="I'm Lewis"><span>I'm Lewis</span>
                                    </h1>
                                </div>
                                <div>
                                    {/*<div className="environment"></div>*/}
                                    <h2 className="big mb-4 glitch1 layers" data-text="Full Stack Developer"><span>Full Stack Developer</span>
                                    </h2>
                                </div>
                                {/*I'm <span className="accent-text">Lewis</span>*/}
                            </div>

                            <Row className="pt-3">
                                <Col lg="8">

                                    <MatterElement typ={"block"} options={{isStatic: true, friction: 0.05}} delay={800}>
                                        <p className="bg-dark-accent main mono p-1">Software engineer, web developer,
                                            python
                                            geek, linux sysadmin, data analyst, and
                                            sometimes* designer.</p>
                                    </MatterElement>
                                    <br/>
                                    <br/>
                                    <MatterElement typ={"block"} options={{isStatic: true, friction: 0.05}} delay={800}>
                                        <p className="bg-dark-accent main mono p-1 mt-2">I produce something from
                                            nothing,
                                            bend
                                            the fabric of <del>space and time</del> the web to do my bidding.
                                        </p>
                                    </MatterElement>
                                    <p className="main"></p>
                                    <br/>
                                    <br/>
                                    <p className="bg-dark-accent main mono p-1 mt-2">
                                        <Typer speed="0.5" flash={true}
                                               text="I make user friendly interfaces | And work in a variety of environments | Using cutting edge technologies"/>
                                    </p>
                                    <br/>
                                    <br/>

                                    {/*draggable buttons */}
                                    <div className={"d-flex"}>
                                        <MatterElement typ={"block"} options={{isStatic: true}} delay={800}>
                                            <CSSTransition classNames={"homeButtons"} in={true} appear={true}
                                                           timeout={300}>
                                                <Button variant="outline-primary"
                                                        className={"homeButtons homeButtonsBase me-2 position-relative"}>Find
                                                    Out More</Button>
                                            </CSSTransition>
                                        </MatterElement>
                                        <div className={"mx-2"}>

                                        </div>
                                        <MatterElement typ={"block"} options={{isStatic: true}} delay={800}>
                                            <CSSTransition classNames={"homeButtons"} in={true} appear={true}
                                                           timeout={300}>
                                                <Button onClick={modal.showModal} variant="primary"
                                                        className="homeButtons homeButtonsBase text-light position-relative">Contact
                                                    Me</Button>
                                            </CSSTransition>
                                        </MatterElement>

                                        <MatterElement typ={"block"} options={{isStatic: true}} delay={800}>
                                            <CSSTransition classNames={"homeButtons"} in={true} appear={true}
                                                           timeout={300}>
                                                <Button onClick={explosion} variant="outline-success"
                                                        className="homeButtons homeButtonsBase ms-3 position-relative">Teleport</Button>
                                            </CSSTransition>
                                        </MatterElement>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Body>} title="Home"/>
        </>);
}