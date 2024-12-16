import { Button, Flex } from 'antd'
import React, { useEffect, useState } from 'react'
import useHttp2 from '../../hooks/useHttp2';
import { useNavigate } from 'react-router'
import Cookies from 'js-cookie'
import { IoMdMenu } from "react-icons/io";
import classes from './LayoutElements.module.css'
const Header = ({ handleSidebar }) => {
    const { sendRequest, isLoading } = useHttp2()
    const [countdownData, setCountdownData] = useState(null);
    const navigate = useNavigate()

    const handleLogout = () => {
        navigate('/login')
        Cookies.remove('affiliate')
    }

    useEffect(() => {
        sendRequest({
          url: '/timer/status'  
        }, (result) => {
          if (result.success) {
            setCountdownData(result);  
          }
        });
      }, []);
      
      useEffect(() => {
        if (countdownData && countdownData.targetDate) {
          const targetDate = new Date(countdownData.targetDate);
          const interval = setInterval(() => {
            const now = new Date();
            const timeDiff = targetDate - now;
      
            if (timeDiff <= 0) {
              clearInterval(interval); 
              setCountdownData(prevData => ({
                ...prevData,
                countdown: '00d 00h 00m 00s'
              }));
            } else {
              const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
              const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
              const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      
              setCountdownData(prevData => ({
                ...prevData,
                countdown: `${days}d ${hours}h ${minutes}m ${seconds}s`
              }));
            }
          }, 1000);
      
          return () => clearInterval(interval); 
        }
      }, [countdownData]);
      
    return (
        <Flex
            style={{ padding: '15px 20px', background: 'white' }}
            justify='space-between'
            align='center'
            gap={20}
        >
            {/* <img src="/board.png" alt="logo" width={150} /> */}
            <h1 className={classes.logo} src='/board.png' alt="" >University Logo</h1>
           <Flex
           gap={20}
           align='center'
           >
            {countdownData && (
            <div style={{ marginTop: '20px', fontSize: '16px', color: 'red' }}>
              <p>
                Remaning Tiem: {countdownData.countdown} | 
                Target Date: {countdownData.targetDate} ({countdownData.targetDay})
              </p>
            </div>
          )}
           <Button onClick={handleLogout} type='default'>Logout</Button>
           <Button className={classes.toggleBtn} onClick={handleSidebar} type='default'><IoMdMenu /></Button>
           </Flex>
        </Flex>
    )
}

export default Header