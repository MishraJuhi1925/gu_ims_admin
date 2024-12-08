import React, { useState, useRef } from 'react';
import { Input, Button, Tooltip, Tag, Space, Form } from 'antd';
import { FaEdit } from 'react-icons/fa';

const EditableGrid = ({ handleEdit = () => {}, dataSource = [], setDataSource }) => {
    const [form] = Form.useForm();
    const inputRefs = useRef([]);

    const handleInputChange = (value, key, column) => {
        const newDataSource = dataSource.map(item => {
            if (item.key === key) {
                return { ...item, [column]: value };
            }
            return item;
        });
        setDataSource(newDataSource);
    };

    const handleKeyPress = (e, key, column) => {
        if (e.key === 'Enter') {
            form.validateFields([`input_${key}_${column}`])
                .then(() => {
                    const inputs = inputRefs.current;
                    const currentIndex = inputs.findIndex(input => input === e.target);

                    if (currentIndex < inputs.length - 1) {
                        inputs[currentIndex + 1].focus();
                    } else {
                        console.log("API call would be made here!");
                    }
                })
                .catch((error) => {
                    console.error('Validation failed:', error);
                });
        }
    };

    const renderInput = (value, record, column, index) => (
        <Form.Item
            name={`input_${record.key}_${column}`}
            rules={[
                { required: true, message: 'Required' },
                { type: 'string', pattern: /^[0-9]*$|A/, message: 'Only numbers or "A"' },
                { validator: (_, value) => {
                    if (value && value !== 'A' && (isNaN(value) || value > 59)) {
                        return Promise.reject(new Error('Value must be a number less than or equal to 59 or "A" for absent'));
                    }
                    return Promise.resolve();
                }}
            ]}
        >
            <Input
                ref={el => inputRefs.current[index] = el}
                type="text"
                maxLength={2}
                value={value}
                onChange={e => handleInputChange(e.target.value, record.key, column)}
                onKeyPress={e => handleKeyPress(e, record.key, column)}
            />
        </Form.Item>
    );

    return (
        <Form form={form}>
            <div className="grid-container">
                <div className="grid-header">Exam Roll Number</div>
                <div className="grid-header">Civil ID</div>
                <div className="grid-header">Semester</div>
                <div className="grid-header">Program Name</div>
                <div className="grid-header">Course Name</div>
                <div className="grid-header">Course ID</div>
                <div className="grid-header">Reference</div>
                <div className="grid-header">Course Code</div>
                <div className="grid-header">Internal Theory Total Marks</div>
                <div className="grid-header">Value Name</div>
                <div className="grid-header">Overall Total Marks</div>
                <div className="grid-header">Action</div>
                {dataSource.map((record, index) => (
                    <React.Fragment key={record.key}>
                        <div className="grid-cell">{record.examRollNumber}</div>
                        <div className="grid-cell">{record.civilId}</div>
                        <div className="grid-cell">{record.semester}</div>
                        <div className="grid-cell">{record.programName}</div>
                        <div className="grid-cell">{record.courseName}</div>
                        <div className="grid-cell">{record.courseId}</div>
                        <div className="grid-cell">{record.reference}</div>
                        <div className="grid-cell">{record.courseCode}</div>
                        <div className="grid-cell">
                            {renderInput(record.internalTheoryTotalMarks, record, 'internalTheoryTotalMarks', index)}
                        </div>
                        <div className="grid-cell">{record.valueName}</div>
                        <div className="grid-cell">{record.overallTotalMarks}</div>
                        <div className="grid-cell">
                            <Space>
                                {record.marksUpdated === 'updated' ? (
                                    <Tag color="green">Marks Updated</Tag>
                                ) : (
                                    <Button type="default" shape="circle" onClick={handleEdit.bind({ id: record.id, valueName: record.valueName })}>
                                        <FaEdit size={16} />
                                    </Button>
                                )}
                            </Space>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </Form>
    );
};

export default EditableGrid;
