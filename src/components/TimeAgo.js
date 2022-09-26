import {useEffect, useState} from "react";

const dates = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60]]
const rtf = new Intl.RelativeTimeFormat(undefined, {numeric:"auto"})

function timeago(date) {
    let now_date = new Date().getTime()
    let then_date = Date.parse(date)
    let date_diff_seconds = Math.abs(Math.round((then_date - now_date)/1000))

    let best_text, best_seconds, best_interval
    for(let [txt, seconds] of dates){
        if(date_diff_seconds > seconds){
            best_text = txt
            best_seconds = Math.round(date_diff_seconds / seconds)
            best_interval = seconds / 2
            break
        }
    }
    if(! best_seconds){
        best_text = "seconds"
        best_seconds = parseInt(date_diff_seconds / 10) * 10
        best_interval = 10
    }
    return [best_text, best_seconds, best_interval]
}

export default function TimeAgo({iso_date}) {
    const [txt, time, interval] = timeago(iso_date)
    const [, setUpdate] = useState(0)

    useEffect(()=>{
        const timerId = setInterval( ()=> setUpdate(update => update + 1),
            interval * 1000
        )
        return () => clearInterval(timerId)
    }, [interval])

    return (
        <span>{rtf.format(-time, txt)}</span>
    )

}