import { Form } from 'antd'
import React from 'react'
import classes from './FormItem.module.css'

const FormItem = ({label,name,rules,element,dataObj,normalize,initialValue,children,tooltip}) => {

    return (
        <Form.Item
            label={label}
            name={name}
            labelAlign='left'
            inputAlign='right'
            rules={rules}
            className={classes.item}
            normalize={normalize}
            initialValue={initialValue}
            tooltip={tooltip}
        >
            {element(dataObj ?? {})}
        </Form.Item>
    )
}
export const FormItemDefault = ({label,name,rules,element,dataObj,normalize,initialValue}) => {

    return (
        <Form.Item
            label={label}
            name={name}
            labelAlign='left'
            inputAlign='right'
            rules={rules}
            className={classes.item}
            normalize={normalize}
            initialValue={initialValue}
        >
            {element(dataObj ?? {})}
       
        </Form.Item>
    )
}


export default FormItem
