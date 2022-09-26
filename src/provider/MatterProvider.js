import {createContext, useContext, useEffect, useRef} from "react";
import {Engine} from 'matter-js'

export const MatterContext = createContext()

export default function MatterProvider({children}){

    const requestRef = useRef()
    const engine = useRef(Engine.create())
    const world = useRef(engine.current.world)
    const blocks = useRef([])


    function getItems(){
        return {engine, world}
    }
    function getBlocks(){
        return blocks.current
    }
    function setBlocks(item){
        blocks.current.push(item)
    }
    useEffect(()=>{
        engine.current.gravity.x = 0.25;
        engine.current.gravity.y = 0.07;

        (function rerender() {
            blocks.current.forEach(value => {
                value[0]((i) => {
                    return i + 1
                })
            })
            Engine.update(engine.current);
            requestRef.current = requestAnimationFrame(rerender);
        })();
    }, [])

    return (
        <MatterContext.Provider value={{getItems, getBlocks, setBlocks }}>
            {children}
        </MatterContext.Provider>
    )
}
export function useMatter (){
    return useContext(MatterContext);
}