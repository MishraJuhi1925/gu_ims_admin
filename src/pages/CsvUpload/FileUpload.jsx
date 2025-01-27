import React, { useState } from 'react';
import { Upload, message, Button, Row, Col } from 'antd';
import { InboxOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import useHttp2 from '../../hooks/useHttp2';
import PropTypes from 'prop-types';
import useHttpForm from '../../hooks/useHttpForm';
import { RiH1 } from 'react-icons/ri';

const { Dragger } = Upload;

const FileUpload = ({ url, onUploadSuccess }) => {
  const { sendRequest, isLoading } = useHttpForm();
  const [fileList, setFileList] = useState([]);

  const handleDownloadSample = () => {
    const sampleFileUrl = '/upload/gurugram.xlsx'; 
    const link = document.createElement('a');
    link.href = sampleFileUrl;
    link.download = 'SampleFile.xlsx'; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.info('Sample file is being downloaded.');
  };

  const handleUpload =  () => {
    const formData = new FormData();
    formData.append('file', fileList[0]);

    sendRequest(
      {
        url: 'upload-csv',
        method: 'POST',
        body: formData,
      },
      (result) => {
        message.success(`Uploaded successfully!`);
        // onUploadSuccess && onUploadSuccess(result);
        // setFileList((prev) => prev.map((f) =>
        //   f.uid === file.uid ? { ...f, uploaded: true } : f
        // ));
      },
      true
    );
  };

  const handleRemove = (file) => {
    setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    message.info(`${file.name} removed.`);
  };

  const draggerProps = {
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
    multiple: false,
  };

  return (
    <div
      style={{
        margin: '0 auto',
        maxWidth: '100%',
        padding: '20px',
        border: '1px solid #f0f0f0',
        borderRadius: '8px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        background: '#fff',
      }}
    >
    
      <h1 style={{ marginBottom: '20px', color: '#555', textAlign: 'center' , fontSize:20 }}>
        Upload Your Files
      </h1>

      <Dragger disabled={isLoading} {...draggerProps} style={{ marginBottom: '20px' }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ color: '#1890ff', fontSize: '32px' }} />
        </p>
        <p className="ant-upload-text">Click or drag files to this area to upload</p>
        <p className="ant-upload-hint">Support for a bulk upload. Drag files here to begin.</p>
      </Dragger>

      <Button style={{width:'100%',height:50,marginTop:30}} disabled={isLoading} htmlType='button' type='default' onClick={handleUpload}>
        {isLoading ? 'Loading' : ' Upload Excel File'
        }
       </Button>
       <Button
        style={{ width: '100%', height: 50, marginTop: 10 }}
        type="primary"
        icon={<DownloadOutlined />}
        onClick={handleDownloadSample}
      >
        Download Sample File
      </Button>
{/* 
      <Row gutter={[16, 16]} justify="center">
        {fileList.map((file) => (
          <Col key={file.uid} span={6}>
            <div
              style={{
                textAlign: 'center',
                padding: '10px',
                border: '1px dashed #d9d9d9',
                borderRadius: '8px',
                background: '#fafafa',
              }}
            >
              <p style={{ marginBottom: '10px', wordBreak: 'break-word' }}>
                {file.name}
              </p>
              <Button
                icon={<DeleteOutlined />}
                type="danger"
                size="small"
                onClick={() => handleRemove(file)}
                style={{ width: '100%' }}
              >
                Remove
              </Button>
            </div>
          </Col>
        ))}
      </Row> */}
    </div>
  );
};

FileUpload.propTypes = {
  url: PropTypes.string.isRequired,
  onUploadSuccess: PropTypes.func,
};

export default FileUpload;
