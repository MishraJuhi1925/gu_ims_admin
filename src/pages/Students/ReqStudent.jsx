import React, { useEffect, useState } from 'react'
import useHttp2 from '../../hooks/useHttp2'
import PageHeader from '../../components/UI/PageHeader'
import MyPagination from '../../components/table/MyPagination'
import SearchBar from '../../components/filter/SearchBar'
import { Button, Space } from 'antd'
import UpdateMark from '../../components/modals/UpdateMark'
import DemoTable from '../../components/table/EditableTables/DemoTable'
import PracticalStudentsTable from '../../components/table/EditableTables/PracticalStudentsTable'
import SpecialFilter from '../../components/filter/SpecialFilter' 
import { toast } from 'react-toastify'
import { FaRegQuestionCircle } from 'react-icons/fa'
import classes from './Student.module.css'
import ExternalMarks from '../../components/table/EditableTables/ExternalMarks'

const ReqStudent = () => {

  // const token = JSON.parse(Cookies.get('admin') ?? {})?.token
  const { sendRequest, isLoading } = useHttp2()
  const [data, setData] = useState([])
  const [pageDetails, setPageDetails] = useState({})
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  // For Filter
  const [query, setQuery] = useState('')

  const [queryObject, setQueryObject] = useState({
    semester: '',
    courseName: '',
    programName: '',
    marksUpdated: '',
    valueName: 'Theory',
    specialCase: 'Only External',
    filter: false
  })

  const paginationObject = {
    pageDetails,
    limit,
    setLimit,
    page,
    setPage
  }

  const constructUrl = (limit, page, query, queryObject) => {

    const params = new URLSearchParams({ limit, page, search: query });
    if (queryObject.courseName) {
      params.append('courseName', queryObject.courseName);
    }
    if (queryObject.programName) {
      params.append('programName', queryObject.programName);
    }
    if (queryObject.semester) {
      params.append('semester', Number(queryObject.semester));
    }
    if (queryObject.collegeName) {
        params.append('collegeName', queryObject.collegeName);
    }
    
    params.append('marksUpdated', 'updated');
    params.append('valueName', queryObject.valueName)

    return `modified-student?${params.toString()}`;
  };

  const constructUrll = (limit, page, query, queryObject) => {

    const params = new URLSearchParams({ limit, page, search: query });
    if (queryObject.courseName) {
      params.append('courseName', queryObject.courseName);
    }
    if (queryObject.programName) {
      params.append('programName', queryObject.programName);
    }
    if (queryObject.semester) {
      params.append('semester', Number(queryObject.semester));
    }
    
    if (queryObject.collegeName) {
        params.append('collegeName', queryObject.collegeName);
    }
    
    params.append('marksUpdated', 'updated');
    params.append('valueName', queryObject.valueName)

    return `update_modified?${params.toString()}`;
  };


  const getData = () => {
    sendRequest({
      url: constructUrl(limit, page, query, queryObject)
    }, result => {
      setData(result.data.docs)
      setPageDetails({ ...result.data, docs: [] })
    })
  }

  const updatestatus = () => {
    sendRequest({
        url: constructUrll(limit, page, query, queryObject),
        method: 'PUT', 
        body: { marksUpdated: 'modified' }
    }, result => {
       getData()
    });
};


  useEffect(() => {
    getData()
  }, [limit, page, query])

  useEffect(() => {
    setPage(1)
  }, [query])

  const handleFilter = () => {
    const { courseName, programName, semester, valueName } = queryObject
    if (!courseName || !programName || !semester || !valueName) {
      toast.error('Please Select program, course name, semester, and subject type')
      return
    }
    setQueryObject(prev => ({ ...prev, filter: true }))
    getData()
  }

  const handleClear = () => {
    setQueryObject({
      semester: '',
      courseName: '',
      programName: '',
      marksUpdated: '',
      valueName: 'Theory',
      specialCase: 'only external',
      filter: false
    })
  }

  const renderComp = {
    'Theory': <DemoTable data={data} setData={setData} />,
    'Only External': <ExternalMarks data={data} setData={setData} />,
    'Practical': <PracticalStudentsTable data={data} setData={setData} />
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: 25
        }}
      >
        <PageHeader heading={'Students List'} >
          <Space>
            <Button onClick={handleClear} style={{ height: 35, width: 100 }} type='default'>
              Clear Filter
            </Button>
            <Button onClick={handleFilter} style={{ height: 35, width: 100 }} type='primary'>
              Apply Filter
            </Button>
          </Space>
        </PageHeader>
        <SpecialFilter handleClear={() => handleClear()} setQueryObject={setQueryObject} queryObject={queryObject} />
        <SearchBar func={setQuery} value={query} placeholder={'Search by exam roll no., course code, course id'} />
        {queryObject.filter ? (
          <>
            <h4 style={{ color: 'var(--color_black_2)', fontWeight: '500' }}>
              {pageDetails?.totalDocs ?? 0} Results
            </h4>
            {renderComp[queryObject.valueName]}
            <Button onClick={updatestatus} htmlType='button' type='primary' style={{width:'100%'}} >Change Status of Filtered Students</Button>
            <MyPagination {...paginationObject} />
          </>
        ) : (
          <div className={classes.selectFilter}>
            <FaRegQuestionCircle size={50} className={classes.selectFilter_icons} />
            <h1>Please Select Filter Combination</h1>
            <p>
              You have not selected any filters. To filter out students, please apply filters to get the list of desired students.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default ReqStudent
