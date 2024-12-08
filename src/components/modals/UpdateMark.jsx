import React from 'react'
import ModalComp from './ModalComp'
import { Form, Input, Select } from 'antd'
import useHttp2 from '../../hooks/useHttp2'
import FormItem from '../FormItem/FormItem'
import BottomButtons from './BottomButtons'
import classes from './Modal.module.css'


const UpdateMark = ({ modalFunc, modalValue, refreshFunc , student}) => {

    const formData = [
        {
            label: 'Internal Theory Total Marks	',
            name: 'internalTheoryTotalMarks',
            rules: [
                {
                    required: true
                }
            ],
            element: ({ data }) => <Input {...data} />
        },
        {
            label: 'Internal Practical Total Marks',
            name: 'internalPracticalTotalMarks',
            rules: [
                {
                    required: true
                }
            ],
            element: ({ data }) => <Input {...data} />
        }
    ]

    const { sendRequest, isLoading } = useHttp2()
    const {id , valueName } = student || {}

    const onFinish = (values) => {
        sendRequest({
            url: `student/${id}`,
            method: 'PUT',
            body: {...values , marksUpdated:'updated'}
        }, result => {
            modalFunc(false)
            refreshFunc()
        }, true)
    };


    const newProps = {
        modalFunc,
        modalValue,
        title: 'Update Student Marks',
        hideOk: true,
        hideCancel: true,
        handleOk: onFinish
    }


    const bottomButtonProps = {
        cls:classes.botoomBtns,
        handleClose : ()=>modalFunc(false),
        isLoading
    }


    if (valueName === 'Practical') {
        formData.push({
            label: 'External Practical Total Marks',
            name: 'externalPracticalTotalMarks',
            rules: [
                {
                    required: true
                }
            ],
            element: ({ data }) => <Input {...data} />
        })
    }


    return (
        <ModalComp  {...newProps}>
            <Form
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                name="basic"
                style={{
                    maxWidth: 600,
                }}
                onFinish={onFinish}
            >
                {formData.map(element => (<FormItem key={element.name} {...element} />))}
                <BottomButtons {...bottomButtonProps} />
            </Form>
        </ModalComp>
    )
}

export default UpdateMark
