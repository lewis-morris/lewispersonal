import './main.scss';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Header from "./components/Header";
import ExperiencePage from "./pages/ExperiencePage";
import SkillsPage from "./pages/SkillsPage";
import HomePage from "./pages/HomePage";
import ModalProvider from "./provider/ModalProvider";
import {React, useEffect, useRef, useState} from "react"
import Typer from "./components/Typer";
import {ProgressBar} from "react-bootstrap";
import {RecoilRoot} from "recoil";
import MatterProvider from "./provider/MatterProvider";

const show_loading = 5000
const loading_times = 20

function LoadingEl({fade}) {
    const [run, setRun] = useState(true)
    const [perc, setPerc] = useState(0)
    let times = useRef(0)

    useEffect(() => {
        let time = show_loading / loading_times
        let each = 100 / loading_times

        const timer = setTimeout(() => {
            times.current += 1
            setPerc(times.current * each)
        }, time)

        return () => {
            clearTimeout(timer)
        }
    }, [perc, setPerc])

    const stopShow = () => {
        setRun(false)
    }
    return (<>
        {run ? <div onTransitionEnd={stopShow}
                    className={"text-center main_loading flex-column" + (fade ? " slide-out-fade" : "")}>

            <ProgressBar className={"mb-4 progress-width"} now={perc}/>
            <h1 className="typer-loading bg-accent text-light p-3">
                <Typer flash={false} shuffle mistakes={4} mistakePause={1} speed={.15}
                       text={"Igniting spark plugs |Firing rocket engines |Greasing sprockets |Pumping iron |Calculating trajectory |Defusing bomb |Churning butter |Baking bread "}/>
            </h1>

        </div> : null}
    </>)

}

export default function App() {

    // used to show a loading page first
    const [isPreLoading, setIsPreLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsPreLoading(false)
        }, show_loading)
        return () => clearTimeout(timer)
    }, [isPreLoading, setIsPreLoading])


    return (<div className="App">
        <RecoilRoot>
            {isPreLoading ? <LoadingEl fade={!isPreLoading}/> : <>
                <LoadingEl fade={!isPreLoading}/>
                <div className={"content-holder fade-in-ani"}>

                    <ModalProvider>
                        <BrowserRouter>
                            <Header/>
                            <Routes>
                                <Route path="/experience" element={<ExperiencePage/>}/>
                                <Route path="/skills" element={<SkillsPage/>}/>
                                <Route path="/" element={<MatterProvider><HomePage/></MatterProvider>}/>
                            </Routes>
                        </BrowserRouter>
                    </ModalProvider>

                </div>
            </>}
        </RecoilRoot>
    </div>);
}
