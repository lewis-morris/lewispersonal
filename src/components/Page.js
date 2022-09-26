import React from 'react'
import useDocumentTitle from "../functions/title";

export default function Page(props) {
    const titlePrefix = 'Lewis Morris | '
    useDocumentTitle(`${titlePrefix}${props.title}`)
    return (
        <>
            {props.content}
        </>
    )
}

