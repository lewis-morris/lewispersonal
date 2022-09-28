import {createContext, useContext, useEffect, useRef} from "react";
import {Events, Engine, Detector, Constraint, Composite} from 'matter-js'

export const MatterContext = createContext()

export default function MatterProvider({children}){

    const requestRef = useRef()
    const engine = useRef(Engine.create())
    const offset = useRef({offsetX: 0, offsetY: 0})
    const world = useRef(engine.current.world)
    let blocks = useRef([])


    function getItems() {
        return {engine, world}
    }

    function setOffset(valY, valX) {
        offset.current["offsetY"] = valY ? valY : offset.current["offsetY"]
        offset.current["offsetX"] = valX ? valX : offset.current["offsetX"]
        blocks.current.forEach(value => {
            value[1].offsetY = offset.current["offsetY"]
            value[1].offsetX = offset.current["offsetX"]
        })
    }

    function getBlocks() {
        return blocks.current
    }

    function setBlocks(item) {
        // set the offset
        item[1].offsetY = offset.current["offsetY"]
        blocks.current.push(item)
    }

    function checkDead() {
        let temp_blocks = []
        blocks.current.forEach(value => {
            if (!value[1].check_dead()) {
                temp_blocks.push(value)
            } else {
                Composite.remove(world.current, value[1].body);
            }
        })
        blocks.current = temp_blocks
    }

    function getAlive() {
        let alives = []
        blocks.current.forEach(value => {
            if (value[1].alive) {
                alives.push(value[1].customId)
            }
        })
        return alives
    }


    useEffect(() => {
        engine.current.gravity.x = 0.25;
        engine.current.gravity.y = 0.15;

        (function rerender() {
            blocks.current.forEach(value => {
                value[0]((i) => {
                    return i + 1
                })
            })
            checkDead()

            Engine.update(engine.current);
            requestRef.current = requestAnimationFrame(rerender);
        })();
    }, [])

    return (
        <MatterContext.Provider value={{getItems, setOffset, getBlocks, setBlocks, getAlive}}>
            {children}
        </MatterContext.Provider>
    )
}
export function useMatter (){
    return useContext(MatterContext);
}