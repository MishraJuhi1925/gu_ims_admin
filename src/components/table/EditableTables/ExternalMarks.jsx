import React, { useState, useRef, useEffect } from 'react';
import { Input, Form, Button, Space, message, Tooltip, Tag } from 'antd';
import { FaCheck, FaEdit } from 'react-icons/fa';
import classes from './DemoTable.module.css';
import { toast } from 'react-toastify';
import useHttp2 from '../../../hooks/useHttp2';

const ExternalMarks = ({ data, setData }) => {
    const inputRefs = useRef([]);
    const [form] = Form.useForm();
    const { sendRequest, isLoading } = useHttp2();

    const updateStudent = ({ id, externalPracticalMarks, marksUpdated, remark }) => {
        sendRequest({
            url: `student/${id}`, method: 'PUT', body: { externalPracticalMarks, remark, marksUpdated: 'updated' }
        }, res => {
            console.log(res);
            marksUpdated = 'updated'
        }, true);
    };

    const handleRemarksChange = (e, id) => {
        const value = e.target.value;
        const updatedData = data.map((item) =>
            item.id === id ? { ...item, remark: value } : item
        );
        setData(updatedData);
    };

    const handleRemarksSubmit = (id) => {
        const student = data.find((item) => item.id === id);
        if (student && student.remark) {
            updateStudent({
                id: student.id,
                internalTheoryMarks: student.internalTheoryMarks,
                marksUpdated: 'modified',
                remark: student.remark
            });
        }
    };
    useEffect(() => {
        const initialValues = {};
        data.forEach(item => {
            initialValues[`input_${item.id}_externalPracticalMarks`] = item.externalPracticalMarks || '';
            initialValues[`input_${item.id}_remark`] = item.remark || '';
        });
        form.setFieldsValue(initialValues);
    }, [data, form]);

    const handleInputChange = (value, key) => {
        const newData = data.map(item => {
            if (item.id === key) {
                return { ...item, externalPracticalMarks: value };
            }
            return item;
        });
        setData(newData);
    };
    // const handleInputChange = (value, key) => {
    //     const newData = data.map(item => {
    //         if (item.id === key) {
    //             return { ...item, internalTheoryMarks: value};
    //         }

    //         return item;
    //     });
    //     setData(newData);



    // };

    const formLogic = (key, column, index) => {
        form.validateFields([`input_${key}_${column}`])
            .then(() => {
                updateStudent(data[index]);
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
        const row = data.find(item => `input_${item.id}_externalPracticalMarks` === rule.field);
        if (value && value !== 'A') {
            const numericValue = parseFloat(value);
            if (isNaN(numericValue) || numericValue > parseFloat(row.externalPracticalMarks)) {
                return Promise.reject(new Error(`Value must be a number less than or equal to ${row.externalPracticalMarks} or "A"`));
            }
        }
        if (value == 0) {
            return Promise.reject(new Error('Please add a remark if you are marking 0 as marks'))
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
                <div className={classes.grid_th}>External Practical Marks</div>
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
                            <Form.Item
                                style={{ marginBottom: 0 }}
                                name={`input_${element.id}_externalPracticalMarks`}
                                rules={[
                                    { required: true, message: 'Required' },
                                    { validator: validateMarks }
                                ]}
                            >
                                <Input
                                    required
                                    ref={el => inputRefs.current[index] = el}
                                    type="text"
                                    maxLength={2}
                                    value={element.externalPracticalMarks}
                                    onChange={(e) => handleInputChange(e.target.value, element.id)}
                                    onKeyPress={(e) => handleKeyPress(e, element.id, 'externalPracticalMarks', index)}

                                />
                            </Form.Item>
                        </div>
                        <div className={classes.grid_td}>{element.valueName}</div>
                        {/* <div className={classes.grid_td}>{element.overallTotalMarks}</div> */}
                        <div className={classes.grid_td}>
                            <Form.Item
                                style={{ marginBottom: 0 }}
                                name={`input_${element.id}_remark`}
                                rules={[
                                    {
                                        required: element.internalTheoryMarks === '0',
                                        message: 'Remarks required for zero marks',
                                    },
                                ]}
                            >
                                <Input
                                    type="text"
                                    onChange={(e) => handleRemarksChange(e, element.id)}
                                    onPressEnter={() => handleRemarksSubmit(element.id)}

                                />
                            </Form.Item>
                        </div>
                        <div className={classes.grid_td}>
                            {/* <Space>
                        {
                                    <Button type='default' shape="circle" onClick={() => formLogic(element.id, 'externalPracticalMarks', index)}><FaCheck color={element.marksUpdated==='updated' ? 'color(srgb 0.7203 0.9194 0.5613)':'color(srgb 0.8705 0.8706 0.8707)'} size={16} /></Button>
                                }
                            </Space> */}
                            <span style={{ color: element.marksUpdated === 'updated' ? 'green' : element.marksUpdated === 'modified' ? 'orange' : element.marksUpdated === 'not updated' ? 'gray' : 'black' }}> {element.marksUpdated} </span>
                        </div>
                    </React.Fragment>
                ))}
            </div>

        </Form>
    );
};

export default ExternalMarks;
