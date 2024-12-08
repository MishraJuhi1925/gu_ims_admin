
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

  const [queryObject,setQueryObject]=useState({
    marksUpdated:'',
    courseName:'',
    programName:'',
  })

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
  const handleDelete = (id) => {
    sendRequest({
      url: `students/${id}`,
      method: 'DELETE'
    }, result => {
      getData()
    }, true)
  }
 
  useEffect(() => {
    getData()
  }, [limit, page, query , queryObject])

  useEffect(() => {
    setPage(1)
  }, [query])

  const columns = studentColumn((id) => navigate(`edit/${id}`), id => navigate(`view/${id}`))

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
            {/* <Button onClick={downloadExcelFile} disabled={dataDownloadLoading} icon={<FaDownload />} type='default'>Download Data</Button> */}
            <Button onClick={() => navigate('add')} type='primary' icon={<FaPlus />}  >Add Student</Button>
          </Space>
        </PageHeader>
        <SelectsFilter setQueryObject={setQueryObject} queryObject={queryObject} />
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
