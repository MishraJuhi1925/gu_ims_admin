import React, { useState, useRef, useEffect } from 'react';
import { Input, Form, Button, Space, message, Tooltip, Tag } from 'antd';
import { FaCheck, FaEdit } from 'react-icons/fa';
import classes from './DemoTable.module.css';
import { toast } from 'react-toastify';
import useHttp2 from '../../../hooks/useHttp2';

const DemoTable = ({data, setData}) => {
    const inputRefs = useRef([]);
    const [form] = Form.useForm();
    const { sendRequest, isLoading } = useHttp2();

    const updateStudent = ({ id, internalTheoryMarks,marksUpdated }) => {
        sendRequest({ url: `student/${id}`, method: 'PUT', body: { internalTheoryMarks , marksUpdated:'updated' }}, res => {
            console.log(res);
            marksUpdated='updated'
        }, true);
    };

    useEffect(() => {
        // Set initial form values when data changes
        const initialValues = {};
        data.forEach(item => {
            initialValues[`input_${item.id}_internalTheoryMarks`] = item.internalTheoryMarks || '';
        });
        form.setFieldsValue(initialValues);
    }, [data, form]);

    const handleInputChange = (value, key) => {
        const newData = data.map(item => {
            if (item.id === key) {
                return { ...item, internalTheoryMarks: value};
            }
            return item;
        });
        setData(newData);
    };

    const formLogic = (key, column, index) => {
        form.validateFields([`input_${key}_${column}`])
            .then(() => {
                updateStudent(data[index]);
                console.log("API call: ", data[index]);
                if (index < inputRefs.current.length - 1) {
                    inputRefs.current[index + 1].focus();
                }
            })
            .catch(error => {
                const errorMessage = error.errorFields[0].errors[0] || 'Validation Failed';
                toast.error(errorMessage);
            });
    };

    const handleKeyPress = (e, key, column, index) => {
        if (e.key === 'Enter') {
            formLogic(key, column, index);
        }
    };

    const validateMarks = (rule, value) => {
        const row = data.find(item => `input_${item.id}_internalTheoryMarks` === rule.field);
        if (value && value !== 'A') {
            const numericValue = parseFloat(value);
            if (isNaN(numericValue) || numericValue > parseFloat(row.internalTheoryTotalMarks)) {
                return Promise.reject(new Error(`Value must be a number less than or equal to ${row.internalTheoryTotalMarks} or "A"`));
            }
        }
        return Promise.resolve();
    };

    const truncateText = (text, length) => {
        return text.length > length ? `${text.slice(0, length)}...` : text;
    };

    return (
        <Form
            className='my-input-form'
            form={form}
        >
            <div className={classes.grid}>
                <div className={`${classes.grid_th} ${classes.sticky}`}>Exam Roll Number</div>
                <div className={classes.grid_th}>Civil ID</div>
                <div className={classes.grid_th}>Semester</div>
                <div className={classes.grid_th}>Program Name</div>
                <div className={classes.grid_th}>Course Name</div>
                <div className={classes.grid_th}>Course ID</div>
                <div className={classes.grid_th}>Reference</div>
                <div className={classes.grid_th}>Course Code</div>
                <div className={classes.grid_th}>Internal Theory Marks</div>
                <div className={classes.grid_th}>Value Name</div>
                <div className={classes.grid_th}>Remark</div>
                <div className={classes.grid_th}>Status</div>

                {data.map((element, index) => (
                    <React.Fragment key={element.id}>
                        <div className={`${classes.sticky} ${classes.grid_td}`}>{element.examRollNumber}</div>
                        <div className={classes.grid_td}>{element.civilId}</div>
                        <div className={classes.grid_td}>{element.semester}</div>
                        <div className={classes.grid_td}>
                            <Tooltip placement="topLeft" title={element.programName}>
                                {truncateText(element.programName, 20)}
                            </Tooltip>
                        </div>
                        <div className={classes.grid_td}>
                            <Tooltip placement="topLeft" title={element.courseName}>
                                {truncateText(element.courseName, 20)}
                            </Tooltip>
                        </div>
                        <div className={classes.grid_td}>{element.courseId}</div>
                        <div className={classes.grid_td}>{element.reference}</div>
                        <div className={classes.grid_td}>{element.courseCode}</div>
                        <div className={classes.grid_td}>
                            {element.internalTheoryMarks}
                        </div>
                        <div className={classes.grid_td}>{element.valueName}</div>
                        <div className={classes.grid_td}>{element.remark}</div>
                        <div className={classes.grid_td}>
                        <Space>
        {element.marksUpdated === 'updated' ? <Tag color="green">
          Marks Updated
        </Tag> : element.marksUpdated === 'modified' ? <Tag color="blue">
          Modified
        </Tag> : <Tag color="yellow">
          Pending
        </Tag>
          
        }
      </Space>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </Form>
    );
};

export default DemoTable;
