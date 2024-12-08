import React, { useState } from 'react';
import { Select, Button, Space } from 'antd';

const { Option } = Select;

const FilterComponent = ({ onFilter }) => {
  const [semester, setSemester] = useState(null);
  const [course, setCourse] = useState(null);
  const [program, setProgram] = useState(null);

  const handleFilter = () => {
    onFilter({ semester, course, program });
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Select
        placeholder="Filter by Semester"
        style={{ width: '20%' }}
        onChange={value => setSemester(value)}
        allowClear
      >
        <Option value="1">Semester 1</Option>
        <Option value="2">Semester 2</Option>
        <Option value="3">Semester 3</Option>
        
      </Select>

      <Select
        placeholder="Filter by Course"
        style={{ width: '20%' }}
        onChange={value => setCourse(value)}
        allowClear
      >
        <Option value="cs101">Computer Science 101</Option>
        <Option value="el201">English Literature 201</Option>
        <Option value="an301">Anatomy 301</Option>
       
      </Select>

      <Select
        placeholder="Filter by Program"
        style={{ width: '20%' }}
        onChange={value => setProgram(value)}
        allowClear
      >
        <Option value="btech">Bachelor of Technology</Option>
        <Option value="ba">Bachelor of Arts</Option>
        <Option value="mbbs">MBBS</Option>
        <Option value="mba">MBA</Option>
        <Option value="llb">LLB</Option>
      </Select>

      <Button type="primary" onClick={handleFilter} style={{ width: '20%' }}>
        Apply Filter
      </Button>
    </Space>
  );
};

export default FilterComponent;
