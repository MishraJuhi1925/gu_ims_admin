import { Button, Space, Table } from 'antd'
import React from 'react'
import classes from './Table.module.css'
import Container from '../UI/Container'


function MyTable({ data, columns, children, header = true }) {

    return (
        <div className={classes.table}>
        <>
            {children}
            <Table
                tableLayout={'fixed'}
                scroll={{
                    x: 100
                }}
                pagination={false}
                columns={columns}
                showHeader={header}
                dataSource={data} />
        </>
        </div>
    )
}

export default MyTable
