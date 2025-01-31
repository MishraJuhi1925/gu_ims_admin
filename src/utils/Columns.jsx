import { Button,Typography, Flex, Image, Input, message, Popconfirm, Space, Switch, Tag, Tooltip } from "antd";
import GeneralTableCard from "../components/cards/GeneralTableCard";
import classes from './Columns.module.css'
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import TwoLines from "../components/UI/TwoLines";
import moment from "moment";
import { CiEdit } from "react-icons/ci";
import { FaEdit, FaEye } from "react-icons/fa";
import { BASE_API } from "./BASE_URL";
const {Text} = Typography
const confirm = (e) => {
  message.success('Click on Yes');
};
const cancel = (e) => {
  message.error('Click on No');
}

const handleCopy = (value) => {
  navigator.clipboard.writeText(value)
  message.success('Link Copied');
};




export const handleAction = (viewAction, deleteAction) => {
  let actionObject = {
    title: 'Action',
    render: (_, { _id }) => (
      <Space>
        <Button onClick={viewAction} type='default' shape="circle" ><MdOutlineRemoveRedEye size={16} /></Button>
        <Popconfirm
          title="Delete"
          description="Are you sure to delete this?"
          onConfirm={confirm}
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
          placement="topRight"
        >
          <Button type='default' shape="circle" ><RiDeleteBin6Line size={16} /></Button>
        </Popconfirm>
      </Space>
    ),
    align: 'center',
    fixed: 'right'
  }

  return actionObject
}

// DASHBOARD TABLE COLUMNS 
export const dashboardColumns = [
  {
    title: 'Product',
    render: (_, { prodName, price, prodImg }) => (
      GeneralTableCard({ title: prodName, sub_title: `$${price}`, img: prodImg })
    )
  },
  {
    title: 'Order ID',
    dataIndex: 'orderId',
    key: 'orderId',
  },
  {
    title: 'User',
    dataIndex: 'customerName',
    key: 'customerName',
  },
  {
    title: 'Commission',
    dataIndex: 'commission',
    key: 'commission',
    render: (_, { commission }) => (
      <p>${commission}</p>
    ),
  },
  {
    title: 'Affiliate ID',
    key: 'affiliateUid',
    dataIndex: 'affiliateUid',
  },
];

// SALES BY LOCATION TABLE (DASHBOARD)
export const SaleByLocationColumns = [
  {
    title: '_',
    render: (_, { name, sales, img }) => (
      GeneralTableCard({ title: name, sub_title: `${sales} Sales` })
    )
  },
  {
    title: '_',
    dataIndex: 'sale',
    key: 'sale',
    align: 'center',
    render: (_, { sale }) => `$${sale}`
  },
  {
    title: '_',
    dataIndex: 'value',
    key: 'value',
    align: 'center',
    render: (_, { value }) => (
      <div
        className={(value * 1 > 0 ? 'red_status' : 'green_status')}
      >
        {value}%
      </div>
    )
  },
];

// Generate All Links TABLE 
export const allGeneratedLinksColumns = (handleView, handleDelete) => (
  [
    {
      title: 'Link',
      render: (_, { link }) => (
        <Flex
          gap={10}
          align="center"
        >
          <h5 style={{ color: '#05BE4F', fontWeight: '500' }}>{link.slice(0, 35) + '...'}</h5>
          <Tag style={{ cursor: 'pointer' }} onClick={handleCopy.bind('', link)}>Copy</Tag>
        </Flex>
      ),
      width: 300,
    },
    {
      title: 'Product',
      render: (_, { productId }) => (
        GeneralTableCard({ title: productId?.name ?? '---', img: productId.url })
      ),
      align: 'center',
      width: 400,
    },
    {
      title: 'Clicks',
      dataIndex: 'click',
      key: 'click',
      align: 'center'
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   render: (_, { status }) => (
    //     <div>{status}</div>
    //   ),
    //   align: 'center'
    // },
    {
      title: 'Expires At',
      dataIndex: 'expiresAt',
      render: (_, { expiresAt }) => (
        <div>{moment(expiresAt).format('DD-MM-YYYY')}</div>
      ),
      align: 'center'
    },
    {
      title: 'Action',
      render: (_, { _id }) => (
        <Space>
          {/* <Button type='default' shape="circle" onClick={()=>handleView(_id)} ><MdOutlineRemoveRedEye size={16} /></Button> */}
          <Popconfirm
            title="Delete"
            description="Are you sure to delete this?"
            onConfirm={() => handleDelete(_id)}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
            placement="topRight"
          >
            <Button type='default' shape="circle" ><RiDeleteBin6Line size={16} /></Button>
          </Popconfirm>
        </Space>
      ),
      align: 'center',
      fixed: 'right'
    }
  ]
)

// SALES TABLE
export const salesTableColumns = [
  {
    title: 'Order ID',
    render: (_, { orderID }) => (
      <h5>#{orderID}</h5>
    )
  },
  {
    title: 'Product',
    render: (_, { product }) => (
      GeneralTableCard({ title: product.name })
    )
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    render: (_, { date }) => (
      <p>{moment(date).format('DD-MM-YYYY')}</p>
    ),
    align: 'center'
  },
  {
    title: 'Commission',
    dataIndex: 'commission',
    key: 'commission',
    render: (_, { commission }) => (
      <p>${commission}</p>
    ),
    align: 'center'
  },
  {
    title: 'Customer',
    render: (_, { user }) => (
      TwoLines({ title: user?.name, sub_title: `#${user?._id}`, cssObject: { title: classes.sale_table_title, sub_title: classes.sale_table_sub_title } })
    ),
    align: 'right'
  }
];

// PAYMENT TABLE
export const paymentTableColumns = [
  {
    title: 'Payment ID',
    render: (_, { paymentId }) => (
      <h5>#{paymentId}</h5>
    )
  },
  {
    title: 'User Name',
    render: (_, { customerName, customerId }) => (
      TwoLines({ title: customerName, sub_title: `${customerId}`, cssObject: { title: classes.sale_table_title, sub_title: classes.sale_table_sub_title } })
    )
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: (_, { amount }) => (
      <p>${amount}</p>
    ),
  },
  {
    title: 'Payment Date',
    dataIndex: 'date',
    key: 'date',
  },
];

// SUPPORT TABLE 
export const supportTableColumns = (handleView) => (
  [
    {
      title: 'Ticket ID',
      render: (_, { ticketId }) => (
        <h5 style={{ color: '#ae0000', fontWeight: '500' }}>#{ticketId}</h5>
      ),
    },
    // {
    //   title: 'User Name',
    //   render: (_, { customerName, customerId }) => (
    //     TwoLines({ title: customerName, sub_title: `${customerId}`, cssObject: { title: classes.sale_table_title, sub_title: classes.sale_table_sub_title } })
    //   )
    // },
    // {
    //   title: 'Issued Product',
    //   dataIndex: 'product_name',
    //   key: 'product_name',
    // },
    {
      title: 'Priority',
      dataIndex: 'priority',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (_, { status }) => (
        <div>{status}</div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      render: (_, { createdAt }) => (
        moment(createdAt).format('DD-MM-YYYY')
      ),
    },
    {
      title: 'Action',
      render: (_, { _id }) => (
        <Button type='default' shape="circle" onClick={() => handleView(_id)} ><MdOutlineRemoveRedEye size={16} /></Button>
      ),
      align: 'center',
    },
  ]
)

// ADD LINK TABLE COLUMNS
export const addLinkColumn = (func) => (
  [
    {
      title: 'Product',
      render: (_, { name, imageUrl }) => (
        GeneralTableCard({ title: name, img: imageUrl })
      ),
      width: 450
    },
    {
      title: 'Product ID',
      key: '_id',
      dataIndex: '_id',
      render: (_, { _id }) => (
        <h5 className={classes.sale_table_sub_title}>#{_id}</h5>
      )
    },
    {
      title: 'Action',
      key: '_id',
      dataIndex: '_id',
      render: (_, { _id }) => (
        <h6 type="text" onClick={func.bind('', _id)} className={classes.add_link_table_action}>Generate Link</h6>
      ),
      align: 'right'
    }

  ]
)

// LINK DETAILS TABLE
export const linkDetailColumns = [
  {
    title: 'Customer Name',
    key: 'customerName',
    dataIndex: 'customerName',
  },
  {
    title: 'Purchase Date',
    key: 'purchaseDate',
    dataIndex: 'purchaseDate',
  },
]

// Category Columns
export const categoryColumns = (handleView, handleDelete) => ([

  {
    title: 'Banner',
    render: (_, { bannerUrl }) => (
      <Image
        height={50}
        width={50}
        src={bannerUrl}
      />
    )
  },
  {
    title: 'Catgeory Name',
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: 'Date',
    dataIndex: 'createdAt',
    render: (_, { createdAt }) => (
      moment(createdAt).format('DD-MM-YYYY')
    ),
    align: 'center'
  },
  {
    title: 'Action',
    render: (_, { _id }) => (
      <Space>
        <Button type='default' shape="circle" onClick={() => handleView(_id)} ><MdOutlineRemoveRedEye size={16} /></Button>
        <Button type='default' shape="circle" onClick={() => handleDelete(_id)} ><RiDeleteBin6Line size={16} /></Button>
      </Space>
    ),
    align: 'center',
  }
])


// export product column 
export const productColumn = (handleView, handleDelete, handleActive) => ([
  {
    title: 'Banner',
    render: (_, { banner }) => (
      <Image
        height={50}
        width={50}
        src={banner}
      />
    )
  },
  {
    title: 'Name',
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: 'Category',
    key: 'category',
    dataIndex: 'category',
  },
  {
    title: 'Active',
    key: 'active',
    render: (_, { _id, active }) => (
      <Switch onChange={handleActive.bind(this, _id, active)} defaultChecked={active} />
    )
  },
  {
    title: 'Price',
    key: 'price',
    render: ({ _, price }) => (
      <p>${price}</p>
    )
  },
  {
    title: 'Added On',
    dataIndex: 'createdAt',
    render: (_, { createdAt }) => (
      moment(createdAt).format('DD-MM-YYYY')
    ),
  },
  {
    title: 'Action',
    render: (_, { _id }) => (
      <Space>
        <Button type='default' shape="circle" onClick={() => handleView(_id)} ><FaEdit size={16} /></Button>
        <Popconfirm
          title="Delete"
          description="Are you sure to delete this?"
          onConfirm={() => handleDelete(_id)}
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
          placement="topRight"
        >
          <Button type='default' shape="circle" ><RiDeleteBin6Line size={16} /></Button>
        </Popconfirm>
      </Space>
    ),
    align: 'center',
  }
])

// export product column 
export const orderColumn = (handleView) => ([
  {
    title: 'Banner',
    render: (_, { banner }) => (
      <Image
        height={50}
        width={50}
        src={banner}
      />
    )
  },
  {
    title: 'Product Name',
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: 'Customer',
    key: 'customer',
    render: ({ _, customer_name, customer_id }) => (
      GeneralTableCard({ title: customer_name, sub_title: customer_id })
    )
  },
  {
    title: 'payment',
    key: 'payment',
    dataIndex: 'payment',
  },
  {
    title: 'status',
    key: 'status',
    dataIndex: 'status',
  },
  {
    title: 'total',
    key: 'total',
    render: ({ _, total }) => (
      <p>${total}</p>
    )
  },
  {
    title: 'Date',
    dataIndex: 'createdAt',
    render: (_, { createdAt }) => (
      moment(createdAt).format('DD-MM-YYYY')
    ),
  },
  {
    title: 'Action',
    render: (_, { _id }) => (
      <Button type='default' shape="circle" onClick={() => handleView(_id)} ><FaEdit size={16} /></Button>
    ),
    align: 'center',
  }
])

// export order column 
export const customerColumn = (handleActive) => ([

  {
    title: 'Customer',
    key: 'customer',
    render: ({ _, name, email, profileUrl }) => (
      GeneralTableCard({ title: name, sub_title: email, profileUrl })
    )
  },
  {
    title: 'Phone',
    key: 'phone',
    dataIndex: 'phone',
    align: 'center'
  },
  {
    title: 'VB ID',
    key: 'vbID',
    dataIndex: 'vbID',
    align: 'center'
  },
  {
    title: 'Active',
    key: 'active',
    render: (_, { _id, active }) => (
      <Switch onChange={handleActive.bind(this, _id, active)} defaultChecked={active} />
    ),
    align: 'center'
  },
  {
    title: 'Added On',
    dataIndex: 'createdAt',
    render: (_, { createdAt }) => (
      moment(createdAt).format('DD-MM-YYYY')
    ),
    align: 'center'
  }
])

// export product column 
export const couponColumn = (handleView, handleDelete, handleActive) => ([
  {
    title: 'Label',
    dataIndex: 'couponLabel',
    key: 'couponLabel',
  },
  {
    title: 'Code',
    dataIndex: 'couponCode',
    key: 'couponCode',
  },
  {
    title: 'Type',
    dataIndex: 'couponType',
    key: 'couponType',
  },
  {
    title: 'Start Date',
    key: 'createdAt',

    render: (_, { createdAt }) => (moment(createdAt).format('DD-MM-YYYY'))
  },
  {
    title: 'End Date',
    render: (_, { expiryDate }) => (moment(expiryDate).format('DD-MM-YYYY')),
    key: 'expiryDate',
  },
  {
    title: 'Active',
    key: 'status',
    render: (_, { _id, active }) => (
      <Switch onChange={handleActive.bind(this, _id, active)} defaultChecked={active} />
    )
  },
  {
    title: 'Action',
    render: (_, { _id }) => (
      <Space>
        <Button type='default' shape="circle" onClick={() => handleView(_id)} ><FaEdit size={16} /></Button>
        <Popconfirm
          title="Delete"
          description="Are you sure to delete this?"
          onConfirm={() => handleDelete(_id)}
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
          placement="topRight"
        >
          <Button type='default' shape="circle" ><RiDeleteBin6Line size={16} /></Button>
        </Popconfirm>
      </Space>
    ),
    align: 'center',
  }
])

// Slider Columns
export const sliderColumns = (handleView, handleDelete) => ([

  {
    title: 'Banner',
    render: (_, { bannerUrl }) => (
      <Image
        height={50}
        width={50}
        src={bannerUrl}
      />
    )
  },
  {
    title: 'Heading',
    key: 'heading',
    dataIndex: 'heading',
  },
  {
    title: 'Sequence',
    key: 'sequence',
    dataIndex: 'sequence',
  },
  {
    title: 'Date',
    dataIndex: 'createdAt',
    render: (_, { createdAt }) => (
      moment(createdAt).format('DD-MM-YYYY')
    ),
    align: 'center'
  },
  {
    title: 'Action',
    render: (_, { _id }) => (
      <Space>
        <Button type='default' shape="circle" onClick={() => handleView(_id)} ><MdOutlineRemoveRedEye size={16} /></Button>
        <Button type='default' shape="circle" onClick={() => handleDelete(_id)} ><RiDeleteBin6Line size={16} /></Button>
      </Space>
    ),
    align: 'center',
  }
])


// Category Columns
export const notificationColumns = (handleView) => ([
  {
    title: 'Subject',
    key: 'subject',
    dataIndex: 'subject',
  },

  {
    title: 'Description',
    key: 'description',
    dataIndex: 'description',
  },
  {
    title: 'Date',
    dataIndex: 'createdAt',
    render: (_, { createdAt }) => (
      moment(createdAt).format('DD-MM-YYYY')
    ),
    align: 'center'
  },
])

//????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????//


export const schoolColumn = (handleView,handleDelete,viewStudents) => ([
  {
    title: 'School',
    key: 'school',
    render: ({ _, school_name, email }) => (
      GeneralTableCard({ title: school_name, sub_title: email })
    )
  },
  {
    title: 'School Mobile',
    key: 'school_mobile_no',
    dataIndex: 'school_mobile_no',
    align: 'center'
  },
  {
    title: 'School Pincode',
    key: 'school_pincode',
    dataIndex: 'school_pincode',
    align: 'center'
  },
  {
    title: 'School Level',
    key: 'school_level',
    dataIndex: 'school_level',
    align: 'center'
  },
  {
    title: 'View Students',
    key: 'view_students',
    render: (_, { id }) => (
      <h5 style={{fontSize:14,color:'#ae0000',fontWeight:500,cursor:'pointer'}} onClick={()=>viewStudents(id)}>View</h5>
    ),
    align: 'center'
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    render: (_, { createdAt }) => (
      moment(createdAt).format('DD-MM-YYYY')
    ),
    align: 'center'
  },
  {
    title: 'Action',
    render: (_, { id }) => (
      <Space>
        <Button type='default' shape="circle" onClick={() => handleView(id)} ><FaEdit size={16} /></Button>
        <Popconfirm
          title="Delete"
          description="Are you sure to delete this?"
          onConfirm={() => handleDelete(id)}
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
          placement="topRight"
        >
          <Button type='default' shape="circle" ><RiDeleteBin6Line size={16} /></Button>
        </Popconfirm>
      </Space>
    ),
    align: 'center',
  }
])

export const studentColumn = () => ([
  {
    title: 'Exam Roll Number',
    key: 'examRollNumber',
    dataIndex: 'examRollNumber',
    align: 'center',
    fixed: 'left',
    width: 200
  },
  {
    title: 'Civil ID',
    key: 'civilId',
    dataIndex: 'civilId',
    align: 'center',
    width: 150
  },
  {
    title: 'Semester',
    key: 'semester',
    dataIndex: 'semester',
    align: 'center',
    width: 100
  },
  {
    title: 'College Name',
    key: 'collegeName',
    dataIndex: 'collegeName',
    align: 'center',
    ellipsis: {
      showTitle: false,
    },
    render: (collegeName) => (
      <Tooltip placement="topLeft" title={collegeName}>
        <Text onClick={()=>handleCopy(collegeName)}>
        {collegeName}
        </Text>
      </Tooltip>
    ),
    width: 300
  },
  {
    title: 'Program Name',
    key: 'programName',
    dataIndex: 'programName',
    align: 'center',
    ellipsis: {
      showTitle: false,
    },
    render: (programName) => (
      <Tooltip placement="topLeft" title={programName}>
      <Text onClick={()=>handleCopy(programName)}>
      {programName}
      </Text>
       
      </Tooltip>
    ),
    width: 300
  },
  {
    title: 'Course Name',
    key: 'courseName',
    dataIndex: 'courseName',
    align: 'center',
    ellipsis: {
      showTitle: false,
    },
    render: (courseName) => (
      <Tooltip placement="topLeft" title={courseName}>
        <Text onClick={()=>handleCopy(courseName)}>
        {courseName}
        </Text>
      </Tooltip>
    ),
    width: 300
  },
  {
    title: 'Course ID',
    key: 'courseId',
    dataIndex: 'courseId',
    align: 'center',
    width: 150
  },
  {
    title: 'Reference',
    key: 'reference',
    dataIndex: 'reference',
    align: 'center',
    width: 150
  },
  {
    title: 'Course Code',
    key: 'courseCode',
    dataIndex: 'courseCode',
    align: 'center',
    width: 150
  },
  {
    title: 'Internal Theory Marks',
    key: 'internalTheoryMarks',
    align: 'center',
    render:({_,internalTheoryMarks})=>(
      internalTheoryMarks === '' ? '--' : internalTheoryMarks
    ),
    width: 200
  },
  {
    title: 'Internal Practical Marks',
    key: 'internalPracticalMarks',
    align: 'center',
    render:({_,internalPracticalMarks})=>(
      internalPracticalMarks === '' ? '--' : internalPracticalMarks
    ),
    width: 200
  },
  {
    title: 'External Practical Marks',
    key: 'externalracticalMarks',
    align: 'center',
    render:({_,externalPracticalMarks})=>(
    externalPracticalMarks === '' ? '--' :externalPracticalMarks
    ),
    width: 200
  },
  {
    title: 'Value Name',
    key: 'valueName',
    dataIndex: 'valueName',
    align: 'center',
    width: 150
  },
  {
    title: 'Staus',
    key: 'action',
    fixed: 'right',
    render: (_, { id, marksUpdated, valueName }) => (
      <Space>
        {marksUpdated === 'updated' ? <Tag color="green">
          Marks Updated
        </Tag> : marksUpdated === 'modified' ? <Tag color="blue">
          Modified
        </Tag> : <Tag color="yellow">
          Pending
        </Tag>
          
        }
      </Space>
    ),
    align: 'center',
    width: 150
  }
]);

export const studentPracticalColumn = (handleEdit) => ([
  {
    title: 'Exam Roll Number',
    key: 'examRollNumber',
    dataIndex: 'examRollNumber',
    align: 'center',
    fixed: 'left',
    width: 200
  },
  {
    title: 'Civil ID',
    key: 'civilId',
    dataIndex: 'civilId',
    align: 'center',
    width: 150
  },
  {
    title: 'Semester',
    key: 'semester',
    dataIndex: 'semester',
    align: 'center',
    width: 100
  },
  {
    title: 'Program Name',
    key: 'programName',
    dataIndex: 'programName',
    align: 'center',
    ellipsis: {
      showTitle: false,
    },
    render: (programName) => (
      <Tooltip placement="topLeft" title={programName}>
        {programName}
      </Tooltip>
    ),
    width: 300
  },
  {
    title: 'Course Name',
    key: 'courseName',
    dataIndex: 'courseName',
    align: 'center',
    ellipsis: {
      showTitle: false,
    },
    render: (courseName) => (
      <Tooltip placement="topLeft" title={courseName}>
        {courseName}
      </Tooltip>
    ),
    width: 300
  },
  {
    title: 'Course ID',
    key: 'courseId',
    dataIndex: 'courseId',
    align: 'center',
    width: 150
  },
  {
    title: 'Reference',
    key: 'reference',
    dataIndex: 'reference',
    align: 'center',
    width: 150
  },
  {
    title: 'Course Code',
    key: 'courseCode',
    dataIndex: 'courseCode',
    align: 'center',
    width: 150
  },
  {
    title: 'External Practical Total Marks',
    key: 'externalPracticalTotalMarks',
    dataIndex: 'externalPracticalTotalMarks',
    align: 'center',
    width: 200
  },
  {
    title: 'Internal Practical Total Marks',
    key: 'internalPracticalTotalMarks',
    dataIndex: 'internalPracticalTotalMarks',
    align: 'center',
    width: 200
  },
  {
    title: 'Value Name',
    key: 'valueName',
    dataIndex: 'valueName',
    align: 'center',
    width: 150
  },
  {
    title: 'Overall Total Marks',
    key: 'overallTotalMarks',
    dataIndex: 'overallTotalMarks',
    align: 'center',
    width: 200
  },
  {
    title: 'Action',
    key: 'action',
    fixed: 'right',
    render: (_, { id, marksUpdated, valueName }) => (
      <Space>
        {marksUpdated === 'updated' ? <Tag color="green">
          Marks Updated
        </Tag> :
          <Button type='default' shape="circle" onClick={handleEdit.bind({ id, valueName })}><FaEdit size={16} /></Button>
        }
      </Space>
    ),
    align: 'center',
    width: 150
  }
]);

export const supportColumn = (handleView) => ([
  {
    title: 'Ticket ID',
    key: 'id',
    dataIndex: 'id',
  },
  {
    title:'Center ID',
    key:'center_id',
    dataIndex:'center_id',
    align: 'center'
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    render: (_, { createdAt }) => (
      moment(createdAt).format('DD-MM-YYYY')
    ),
    align: 'center'
  },
  {
    title:'Status',
    key:'status',
    dataIndex:'status',
    align: 'center'
  },
  {
    title: 'Action',
    render: (_, { id }) => (
      <Space>
        <Button type='default' shape="circle" onClick={() => handleView(id)} ><FaEye size={16} /></Button>
      </Space>
    ),
    align: 'center',
  }
])

export const collegeColumn = (handleView, handleDelete, viewStudents) => ([  
  {  
    title: 'College Name',  
    key: 'college_name',  
    render: ({ name, email }) => (  
      GeneralTableCard({ title: name })  
    )  
  },  
  {  
    title: 'Email',  
    key: 'email',  
    dataIndex: 'email',  
    align: 'center'  
  },  
 
  { title: 'Total Students', key: 'totalStudents', dataIndex: 'totalStudents', align: 'center' },
  { title: 'Total Results', key: 'totalResults', dataIndex: 'totalResults', align: 'center' },
  { title: 'Updated Results', key: 'totalUpdatedResults', dataIndex: 'totalUpdatedResults', align: 'center' },
  { title: 'Pending Results',
     align: 'center',

    render:(_,{totalResults,totalUpdatedResults})=>(<p style={{color:'red'}}>{Number(totalResults || 0)-Number(totalUpdatedResults ||0)}</p>)
   },
  
  {
     title: 'View Students',
      key: 'view_students',
       render: (_, { name }) =>
         ( <h5 style={{ fontSize: 14, color: '#ae0000', fontWeight: 500, cursor: 'pointer' }} 
          onClick={() => viewStudents(name)} > View </h5> ), 
          align: 'center'
         },
]);

