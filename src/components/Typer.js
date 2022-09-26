import {useEffect, useRef, useState} from "react";
import parse from 'html-react-parser';
import {randomIntFromInterval, shufflearr} from "../functions";


function Flasher(flash) {
    const [flashval, updateFlash] = useState("<span>&nbsp&nbsp</span>")
    useEffect(() => {
        if (flash) {
            setTimeout(() => {
                if (flashval === "&nbsp|") {
                    updateFlash("<span>&nbsp&nbsp</span>")
                } else {
                    updateFlash("&nbsp|")
                }
            }, 375)
        }
    }, [flash, flashval, updateFlash])
    return (<>
        {parse(flashval)}
    </>)
}
const alp = "abcdefghijklmnopqrstuvwxyz".split("")
const newmin = 25
const newmax = 45


export default function Typer({text, shuffle, flash=true, speed = 1, mistakes=1, mistakePause=1}) {


    const options = useRef(shuffle ? shufflearr(text.split("|")) : text.split("|"))
    const [display_text, updateTxt] = useState("")
    let index = useRef(0)
    let min = useRef({"now":newmin, "next":newmin})
    let max = useRef({"now":newmax, "next":newmax})

    useEffect(() => {

        //get the full text required
        let current_full_text = options.current[index.current];
        let text_current
        min.current.next = newmin
        max.current.next  = newmax
        //check if should do error or not make error
        if(randomIntFromInterval(1,10*mistakes)===1){
            text_current = current_full_text.substring(0, display_text.length) + alp[randomIntFromInterval(0, alp.length-1)]
            min.current.next = 120 * mistakePause
            max.current.next  = 255 * mistakePause
        }else if(display_text !== current_full_text.substring(0, display_text.length)){
            text_current = current_full_text.substring(0, display_text.length-1)
            min.current.next = 60
            max.current.next = 90
        }else{
            //set the current text +1
            text_current = current_full_text.substring(0, display_text.length + 1);
        }

        // logic if need to switch text or not
        if (text_current === current_full_text) {
            // this will wait at the end of each word
            index.current++;
            min.current.now = 300;
            max.current.now  = 400;
            text_current = "";
            // increases the index of the array and if too many then it resets to 0 and reset current text
            if (index.current > options.current.length - 1) {
                index.current = 0;

            }
        }
        const timer = setTimeout(() => {
            updateTxt(text_current);
        }, randomIntFromInterval(min.current.now, max.current.now) * 10 * speed)

        min.current.now = min.current.next
        max.current.now = max.current.next

        return () => clearTimeout(timer)
        // ;
    }, [speed, mistakePause, flash, mistakes, display_text, updateTxt])

    return (
        <><span>
            {display_text}
           </span>
            {flash ? <Flasher flash={flash}/> : null }
        </>)
    //
}