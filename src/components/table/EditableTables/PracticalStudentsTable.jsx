import React, { useRef, useEffect } from 'react';
import { Input, Form, Button, Space, Tooltip, Tag } from 'antd';
import { FaCheck } from 'react-icons/fa';
import classes from './PracticalStudentsTable.module.css';
import { toast } from 'react-toastify';
import useHttp2 from '../../../hooks/useHttp2';

const PracticalStudentsTable = ({ data, setData }) => {
    const inputRefs = useRef([]);
    const [form] = Form.useForm();
    const { sendRequest, isLoading } = useHttp2();

    const updateStudent = ({ id, externalPracticalMarks,remark, internalPracticalMarks }) => {
        sendRequest(
            { url: `student/${id}`, method: 'PUT', body: { externalPracticalMarks, internalPracticalMarks,remark, marksUpdated: 'updated' } },
            (res) => {
                console.log(res);
                setData((prevData) =>
                    prevData.map((item) =>
                        item.id === id ? { ...item, marksUpdated: 'updated' } : item
                    )
                );
            },
            true
        );
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
        data.forEach((item) => {
            initialValues[`input_${item.id}_externalPracticalMarks`] = item.externalPracticalMarks || '';
            initialValues[`input_${item.id}_internalPracticalMarks`] = item.internalPracticalMarks || '';
            initialValues[`input_${item.id}_remark`] = item.remark || '';
        });
        form.setFieldsValue(initialValues);
    }, [data, form]);

    const handleInputChange = (value, key, field) => {
        const newData = data.map((item) => {
            if (item.id === key) {
                return { ...item, [field]: value };
            }
            return item;
        });
        setData(newData);
    };

    // const handleInputChange = (value, key, fieldName) => {
    //     const updatedData = data.map((item) =>
    //         item.id === key
    //             ? { ...item, [fieldName]: parseInt(value, 10) || 0 } 
    //             : item
    //     );
    //     setData(updatedData);
    // };

    const formLogic = (key, columns, index) => {
        form.validateFields(columns)
            .then(() => {
                updateStudent(data[index]);
                console.log('API call: ', data[index]);
                if (index < data.length - 1) {
                    inputRefs.current[(index + 1) * 2].focus();
                }
            })
            .catch((error) => {
                const errorMessage = error.errorFields[0].errors[0] || 'Validation Failed';
                toast.error(errorMessage);
            });
    };

    const handleKeyPress = (e, key, columns, index,calledBy) => {

        if (e.key === 'Enter') {
            console.log(e.target.name)
            if (calledBy == 'externalPracticalMarks') {
                console.log('we are here')
                form.validateFields([e.target.name])
                    .then(() => {
                        inputRefs.current[index *2 + 1].focus();
                    })
                    .catch((error) => {
                        const errorMessage = error.errorFields[0].errors[0] || 'Validation Failed';
                        toast.error(errorMessage);
                    });
            } else {
                form.validateFields([e.target.name])
                    .then(() => {
                        formLogic(key, columns, index);
                    })
                    .catch((error) => {
                        const errorMessage = error.errorFields[0].errors[0] || 'Validation Failed';
                        toast.error(errorMessage);
                    });
            }
        }
    };

    const validateMarks = (rule, value) => {
        const row = data.find((item) => `input_${item.id}_${rule.field.split('_')[2]}` === rule.field);
        if (value && value !== 'A') {
            const numericValue = parseFloat(value);
            const totalMarksField = rule.field.split('_')[2].replace('Marks', 'TotalMarks');
            if (isNaN(numericValue) || numericValue > parseFloat(row[totalMarksField])) {
                return Promise.reject(new Error(`Value must be a number less than or equal to ${row[totalMarksField]} or "A"`));
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
        <Form className="my-input-form" form={form}>
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
                <div className={classes.grid_th}>Internal Practical Marks</div>
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
                           {element.externalPracticalMarks}
                        </div>
                        <div className={classes.grid_td}>
                           {element.internalPracticalMarks}
                        </div>
                        <div className={classes.grid_td}>{element.valueName}</div>
                        {/* <div className={classes.grid_td}>{element.overallTotalMarks}</div> */}
                        <div className={classes.grid_td}>
                            {element.remark}
                        </div>
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

export default PracticalStudentsTable;
