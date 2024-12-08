import React, { useEffect, useState } from 'react'
import classes from './SelectsFilter.module.css';
import { Button, Select, Spin } from 'antd';
import useHttp2 from '../../hooks/useHttp2';

const SelectsFilter = ({queryObject,setQueryObject,handleClear}) => {

    const [courses, setCourses] = useState([])
    const [programs, setPrograms] = useState([])

    const { sendRequest: reqProgram, isLoading: programLoading } = useHttp2()
    const { sendRequest: reqCourse, isLoading: courseLoading } = useHttp2()

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

    useEffect(()=>{
        getCourses()
        getPrograms()
    },[])


    const handleSelect = (key,value) => {
        setQueryObject(prev=>({...prev , [key]:value}))
    }
    
    return (
        <div className={classes.flex}>
            {/* <Button onClick={handleClear} className={classes.btn} type='default'>
                Clear Filter
            </Button> */}
            <div>
             <Select
                className={classes.select}
                onSelect={(value)=>handleSelect('marksUpdated',value)}
                placeholder='Marks Status'
                options={[
                    {value:'updated',label:'Updated'},
                    {value:'not updated',label:'Not Updated'},
                ]}
            />
             <Select
                className={classes.select}
                onSelect={(value)=>handleSelect('valueName',value)}
                placeholder='Subject Type'
                options={[
                    {value:'Theory',label:'Theory'},
                    {value:'Practical',label:'Practical'},
                ]}
            />

            </div>

            <div className={classes.inner_flex}>
            <Select
className={classes.select}
showSearch
                filterOption={false}
                onSelect={(value)=>handleSelect('courseName',value)}
                onSearch={getCourses}
                placeholder='Select Course'
                options={courses}
                notFoundContent={courseLoading ? <Spin size="small" /> : null}
            />
            <Select
                className={classes.select}
                onSelect={(value)=>handleSelect('semester',value)}
                placeholder='Select Semester'
                options={[
                    {value:'1',label:'Semester 1'},
                    {value:'2',label:'Semester 2'},
                    {value:'3',label:'Semester 3'},
                    {value:'4',label:'Semester 4'},
                    {value:'5',label:'Semester 5'},
                    {value:'6',label:'Semester 6'},
                ]}
            />
             <Select
                className={classes.select}
                showSearch
                filterOption={false}
                onSelect={(value)=>handleSelect('programName',value)}
                onSearch={getPrograms}
                placeholder='Select program'
                options={programs}
                notFoundContent={courseLoading ? <Spin size="small" /> : null}
            />
            </div>
        </div>
    )
}

export default SelectsFilter