
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useHttp2 from '../../hooks/useHttp2'
import PageHeader from '../../components/UI/PageHeader'
import MyTable from '../../components/table/MyTable'
import MyPagination from '../../components/table/MyPagination'
import { schoolColumn, studentColumn } from '../../utils/Columns'
import SearchBar from '../../components/filter/SearchBar'
import { FaDownload, FaPlus } from 'react-icons/fa'
import { Button, Space } from 'antd'
import Cookies from 'js-cookie'
import SearchAndFilter from '../../components/filter/SearchAndFilter'
import SelectsFilter from '../../components/filter/SelectsFilter'
import * as XLSX from 'xlsx'
const StudentByCollege = () => {

  // const token = JSON.parse(Cookies.get('admin') ?? {})?.token
  const { sendRequest, isLoading } = useHttp2()
  const {collegeName} =useParams()
  const { sendRequest: handleDataDownload, isLoading: dataDownloadLoading } = useHttp2()
  const [data, setData] = useState([])
  const [pageDetails, setPageDetails] = useState({})
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const navigation = useNavigate()
  // For Filter
  const [date, setDate] = useState('')
  const [query, setQuery] = useState('')
  const [downloading, setDownloading] = useState(false)

  const [queryObject,setQueryObject]=useState({
    marksUpdated:'',
    courseName:'',
    programName:'',
    valueName:'',

  })

  const getAllFilteredData = (callback) => {
    const allDataUrl = constructUrl(pageDetails.totalDocs || 1000, 1, query, queryObject);
    
    sendRequest({
      url: allDataUrl
    }, result => {
      callback(result.data.docs);
    })
  }

  const handleDownloadCSV = () => {
    setDownloading(true);
    getAllFilteredData((allData) => {
      const csvData = allData.map(item => ({
        'Exam Roll Number': item.examRollNumber,
        'Civil ID': item.civilId,
        'Semester': item.semester,
        'College Name': item.collegeName,
        'Program Name': item.programName,
        'Course Name': item.courseName,
        'Course ID': item.courseId,
        'Reference': item.reference,
        'Course Code': item.courseCode,
        'Value Name': item.valueName,
        'Internal Theory Marks': item.internalTheoryMarks || '--',
        'Internal Practical Marks': item.internalPracticalMarks || '--',
        'External Practical Marks': item.externalPracticalMarks || '--',
        'Examiner Name': item.examinerName || '--',
        'Examiner Contact': item.contact || '--',
        'Examiner organization': item.organization || '--',
        'Internal ExaminerName': item.internalExaminerName || '--',
        
      }));

    
      
      const worksheet = XLSX.utils.json_to_sheet(csvData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
      XLSX.writeFile(workbook, `Students_${collegeName}_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      setDownloading(false);
    });
  }

  const filterProps = {
    query,
    setQuery,
    date,
    setDate
  }


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
     if (queryObject.marksUpdated) {
       params.append('marksUpdated', queryObject.marksUpdated);
     }
     if (queryObject.valueName) {
       params.append('valueName', queryObject.valueName)
    }
    return `student/by_college/${collegeName}?${params.toString()}`;
};


  const navigate = useNavigate()

  const getData = () => {
    sendRequest({
      url: constructUrl(limit,page,query,queryObject)
    }, result => {
      setData(result.data.docs)
      setPageDetails({ ...result.data, docs: [] })
    })
  }
  

  useEffect(() => {
    getData()
  }, [limit, page, query , queryObject])

   useEffect(() => {
      setPage(1)
    }, [query,queryObject])
   
  const columns = studentColumn()

  const handleClear = () => {
    setQueryObject({
      semester: '',
      courseName: '',
      programName: '',
      marksUpdated: '',
      valueName: ''
    })
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
        
        <PageHeader heading={decodeURIComponent(collegeName)} >
          <Space>
          <Button onClick={handleClear} style={{height:35,width:100}} type='default'>
               Clear Filter
             </Button>
             <Button 
               onClick={handleDownloadCSV} 
               icon={<FaDownload />} 
               type='primary'
               loading={downloading}
             >
               Export CSV
             </Button>
          </Space>
        </PageHeader>
        <SelectsFilter collegeRequired={false} setQueryObject={setQueryObject} queryObject={queryObject} />
        <SearchBar func={setQuery} value={query} placeholder={'Search by  exam roll no. , course code , course id , '} />
        <h4 style={{ color: 'var(--color_black_2)', fontWeight: '500' }}>
          {pageDetails?.totalDocs ?? 0} Results</h4>
        <MyTable data={data} columns={columns} />
        <MyPagination {...paginationObject} />
      </div>
    </>
  )
}

export default StudentByCollege
