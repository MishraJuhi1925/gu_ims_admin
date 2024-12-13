import React, { useEffect, useState } from 'react'
import { useNavigate,useParams } from 'react-router-dom'
import useHttp2 from '../../hooks/useHttp2'
import PageHeader from '../../components/UI/PageHeader'
import MyTable from '../../components/table/MyTable'
import MyPagination from '../../components/table/MyPagination'
import { collegeColumn } from '../../utils/Columns'
import SearchBar from '../../components/filter/SearchBar'
import { Button, Space, message } from 'antd'
import { FaDownload, FaPlus } from 'react-icons/fa'
import SearchAndFilter from '../../components/filter/SearchAndFilter'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import { BASE_API } from '../../utils/BASE_URL'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const Schools = () => {
  const {collegeName} =useParams()
  const token = JSON.parse(Cookies.get('admin') ?? {})?.token
  const [date, setDate] = useState('')
  const [query, setQuery] = useState('')
  const { sendRequest, isLoading } = useHttp2()
  const [data, setData] = useState([])
  const [data1, setData1] = useState([])
  const [pageDetails, setPageDetails] = useState({})
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const navigation = useNavigate()
  const combinedData = [...data, ...data1];
  const [downloading, setDownloading] = useState(false)
  const [downloadType, setDownloadType] = useState(null)
  const [queryObject,setQueryObject]=useState({
    marksUpdated:'',
    courseName:'',
    programName:'',
  })

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
    return `college?${params.toString()}`;
  };

  const getAllFilteredData = (callback) => {
    const allDataUrl = constructUrl(pageDetails.totalDocs || 1000, 1, query, queryObject);
     
    sendRequest({
      url: allDataUrl
    }, result => {
      callback(result.data.docs);
    }, error => {
      message.error('Failed to download data');
      setDownloading(false);
    })
  }

  const handleDownloadExcel = () => {
    setDownloading(true);
    getAllFilteredData((allData) => {
      const excelData = allData.map(item => ({
        'College Name': item.name,
        'Email': item.email,
        'Total Students': item.totalStudents,
        
        
      }));
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Colleges");
      XLSX.writeFile(workbook, `Colleges_${new Date().toISOString().split('T')[0]}.xlsx`);
      setDownloading(false);
    });
  }

  const handleDownloadPDF = () => {
    setDownloading(true);
    setDownloadType('pdf');
    getAllFilteredData((allData) => {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('Colleges List', 14, 22);
      
      // Prepare table data
      const tableData = allData.map(item => [
        item.name, 
        item.email, 
        item.totalStudents ? item.totalStudents.toString() : 'N/A'
      ]);

      // Create table
      doc.autoTable({
        startY: 30,
        head: [['College Name', 'Email', 'Total Students']],
        body: tableData,
        theme: 'striped',
        styles: { 
          fontSize: 8,
          cellPadding: 2 
        },
        columnStyles: { 
          0: { cellWidth: 40 },
          1: { cellWidth: 70 },
          2: { cellWidth: 40 }
        }
      });

      // Save PDF
      doc.save(`Colleges_${new Date().toISOString().split('T')[0]}.pdf`);
      
      setDownloading(false);
      setDownloadType(null);
    });
  }

  const getData1 = () => {
    sendRequest({
      url: constructUrl(limit, page, query, queryObject)
    }, result => {
      setData1(result.data.docs)
      setPageDetails({ ...result.data, docs: [] })
    })
  }

  useEffect(() => {
    getData1()
  }, [limit, page, query, queryObject])

  const paginationObject = {
    pageDetails,
    limit,
    setLimit,
    page,
    setPage
  }

  const filterProps = {
    query,
    setQuery,
    date,
    setDate
  }

  const navigate = useNavigate()
 
  const getData = () => {
    sendRequest({
      url: constructUrl(limit, page, query, queryObject)
    }, result => {
      setData(result.data.docs)
      setPageDetails({ ...result.data, docs: [] })
    })
  }

  useEffect(() => {
    getData1()
    getData()
  }, [limit, page, query, queryObject, date])

  useEffect(() => {
    setPage(1)
  }, [query, date])

  const handleDelete = (id) => {
    sendRequest({
      url: `center/${id}`,
      method: 'DELETE'
    }, result => {
      getData()
    }, true)
  }
  
  const columns = collegeColumn((id) => navigate(`edit/${id}`), handleDelete, (collegeName) => navigate(`/college/college/${collegeName}`))
  
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: 25
        }}
      >
        <PageHeader heading={'Colleges'} >
          <Space>
            <Button 
              onClick={handleDownloadExcel} 
              icon={<FaDownload />} 
              type='primary'
              loading={downloading}
            >
              Export Excel
            </Button>
            <Button 
              onClick={handleDownloadPDF} 
              icon={<FaDownload />} 
              type='primary'
              loading={downloading && downloadType === 'pdf'}
            >
              Export PDF
            </Button>
          </Space>
        </PageHeader>
        <SearchAndFilter {...filterProps} />
        <h4 style={{ color: 'var(--color_black_2)', fontWeight: '500' }}>
          {pageDetails?.totalDocs ?? 0} Results</h4>
        <MyTable data={combinedData} columns={columns} />
        <MyPagination {...paginationObject} />
      </div>
    </>
  )
}

export default Schools