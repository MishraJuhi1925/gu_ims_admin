import React from 'react'
import { IoBagOutline, IoGridOutline } from "react-icons/io5";
import { SlSupport } from "react-icons/sl";
import { BsCash } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import { NavLink } from 'react-router-dom';
import classes from './Sidebar.module.css'
import { FaRegQuestionCircle, FaSchool } from 'react-icons/fa';
import { LuContact } from 'react-icons/lu';
import { TfiAnnouncement } from 'react-icons/tfi';
import { PiStudent } from 'react-icons/pi';

function Sidebar({ sidebar, handleSidebar }) {

    const linksArr = [
        {
            key: '01',
            icon: <FaSchool size={14} />,
            label: 'Colleges',
            link: '/college'
        },
        {
            key: '05',
            icon: <PiStudent size={14} />,
            label: 'Students',
            link: '/student'
        },
        {
            key: '05',
            icon: <PiStudent size={14} />,
            label: 'Upload Csv',
            link: '/csvupload'
        },
    ]

    const cssObject = sidebar ? { left: '0' } : {}

    return (
        <>
            <div className={classes.sidebar} style={cssObject}>
                <div className={classes.sidebar_links}>
                    {linksArr.map(element => (
                        <NavLink className={classes.sidebar_link} key={element.key} to={element.link}> {element.icon} {element.label}</NavLink>
                    ))}
                </div>
            </div>
            {sidebar &&
                <div onClick={handleSidebar} className={classes.bg}></div>
            }
        </>
    )
}

export default Sidebar
