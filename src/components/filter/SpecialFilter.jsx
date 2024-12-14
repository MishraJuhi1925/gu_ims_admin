import React, { useEffect, useState } from 'react'
import classes from './SelectsFilter.module.css';
import { Button, Select, Spin } from 'antd';
import useHttp2 from '../../hooks/useHttp2';

const SpecialFilter = ({ queryObject, setQueryObject, handleClear }) => {

    const [courses, setCourses] = useState([])
    const [programs, setPrograms] = useState([])
    const [colleges, setCollege] = useState([])

    const { sendRequest: reqProgram, isLoading: programLoading } = useHttp2()
    const { sendRequest: reqCourse, isLoading: courseLoading } = useHttp2()
    const { sendRequest: reqCollege, isLoading: collegeLoading } = useHttp2()

    const getCourses = key => {
        reqCourse({
            url: `course?limit=50&page=1&search=${key ? key : ''}`
        }, result => {

            let arr = result.data.docs.map(element => ({
                value: element.name,
                label: element.name
            }))

            setCourses(arr)
        })
    }
    
    const getCollege = key => {
        reqCollege({
            url: `college?limit=50&page=1&search=${key ? key : ''}`
        }, result => {

            let arr = result.data.docs.map(element => ({
                value: element.name,
                label: element.name
            }))

            setCollege(arr)
        })
    }
    const getPrograms = key => {
        reqProgram({
            url: `program?limit=50&page=1&search=${key ? key : ''}`
        }, result => {

            let arr = result.data.docs.map(element => ({
                value: element.name,
                label: element.name
            }))

            setPrograms(arr)
        })
    }

    useEffect(() => {
        getCourses()
        getPrograms()
        getCollege()
    }, [])


    const handleSelect = (key, value) => {
        setQueryObject(prev => ({ ...prev, [key]: value }))
    }

    return (
        <div className={classes.grid}>

                <Select
                    className={classes.select}
                    onSelect={(value) => handleSelect('valueName', value)}
                    placeholder='Subject Type'
                    value={queryObject.valueName}
                    options={[
                        { value: 'Theory', label: 'Theory' },
                        { value: 'Only External', label: 'Only External' },
                        { value: 'Practical', label: 'Practical' },
                    ]}
                />
            {/* <Select
                    className={classes.select}
                    onSelect={(value) => handleSelect('marksUpdated', value)}
                    placeholder='Marks Status'
                    value={queryObject.marksUpdated}
                    options={[
                        {value:'', label:'Marks Status'},
                        { value: 'updated', label: 'Updated' },
                        { value: 'not updated', label: 'Not Updated' },
                    ]}
                /> */}
                <Select
                    className={classes.select}
                    showSearch
                    filterOption={false}
                    onSelect={(value) => handleSelect('programName', value)}
                    onSearch={getPrograms}
                    placeholder='Select program'
                    value={queryObject.programName}
                    options={[{value:'', label:'Select Program'},...programs]}
                    notFoundContent={courseLoading ? <Spin size="small" /> : null}
                />
                <Select
                    className={classes.select}
                    showSearch
                    filterOption={false}
                    onSelect={(value) => handleSelect('courseName', value)}
                    onSearch={getCourses}
                    placeholder='Select Course'
                    value={queryObject.courseName }
                    options={[{value:'',label:'Select Course'},...courses]}
                    notFoundContent={courseLoading ? <Spin size="small" /> : null}
                />
                <Select
                    className={classes.select}
                    showSearch
                    filterOption={false}
                    onSelect={(value) => handleSelect('collegeName', value)}
                    onSearch={getCollege}
                    placeholder='Select College'
                    value={queryObject.collegeName }
                    options={[{value:'',label:'Select College'},...colleges]}
                    notFoundContent={collegeLoading ? <Spin size="small" /> : null}
                />
                <Select
                    className={classes.select}
                    onSelect={(value) => handleSelect('semester', value)}
                    placeholder='Select Semester'
                    value={queryObject.semester}
                    options={[
                        {value:'', label:'Select Semester'},
                        { value: '1', label: 'Semester 1' },
                        { value: '2', label: 'Semester 2' },
                        { value: '3', label: 'Semester 3' },
                        { value: '4', label: 'Semester 4' },
                        { value: '5', label: 'Semester 5' },
                        { value: '6', label: 'Semester 6' },
                    ]}
                />
        </div>
    )
}

export default SpecialFilter