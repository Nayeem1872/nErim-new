import React from 'react'
import { BellOutlined, DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';

const Notification = () => {
    const items = [
        {
          key: '1',
          label: (
            <a target="_blank" rel="noopener noreferrer" 
            // href="https://www.antgroup.com"
            
            >
              1st menu item
            </a>
          ),
        },
        {
          key: '2',
          label: (
            <a target="_blank" rel="noopener noreferrer" 
            
            // href="https://www.aliyun.com"
            >
              2nd menu item (disabled)
            </a>
          ),
          icon: <SmileOutlined />,
          // disabled: true,
        },
        {
          key: '3',
          label: (
            <a target="_blank" rel="noopener noreferrer" >
              3rd menu item (disabled)
            </a>
          ),
          // disabled: true,
        },
        // {
        //   key: '4',
        //   danger: true,
        //   label: 'a danger item',
        // },
      ];
  return (
    <div>  <Dropdown
    menu={{
      items,
    }}
  >
    <a onClick={(e) => e.preventDefault()}>
      <Space>
      <BellOutlined style={{ fontSize: '28px', marginTop:'25px' }} />
      </Space>
    </a>
  </Dropdown></div>
  )
}

export default Notification