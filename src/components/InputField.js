import Form from 'react-bootstrap/Form'
import {useEffect, useState} from "react";

export default function InputField({min, max, name, label, type, placeholder, error, fieldRef}){

    const [field, setField] = useState("")

    useEffect(()=>{
        console.log()
    })

    function type_field(){
        let field_length = fieldRef.current.value.length
        let field_val = fieldRef.current.value
        if((max && field_val !== field && field_length <= max)||!max){
            setField(fieldRef.current.value)
        }else if(max && field_length> max){
            // toast.error(`This field cannot be longer than ${max} characters`,  {
            //     id: `input_${name}_length_error`,
            // });
        }
    }

    //validation

    return(
     <Form.Group controlId={name} className="InputField">
         {label && <Form.Label>{label}</Form.Label>}
         <Form.Control onChange={type_field}
             type={type || 'text'}
             placeholder={placeholder}
             value={field}
             ref={fieldRef}>
         </Form.Control>
         <div className="d-flex justify-content-between">
             <Form.Text className="text-danger">{error}</Form.Text>
             <span className="text-danger">{ max && min && field ? <Form.Text>{fieldRef.current.value.length}/{max}</Form.Text> : null }</span>
         </div>
     </Form.Group>
    )
}