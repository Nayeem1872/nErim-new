"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Divider, Space, Typography, Table, Tag, Breadcrumb } from "antd";
import axios from "axios";
import { LayoutDashboard } from "lucide-react";

const { Text, Link, Title } = Typography;

const Edit = ({ params }) => {
  const [data, setData] = useState(null);
  const router = useRouter();
  useEffect((page) => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/risk_treatment.json`); // Assuming register.json is in the public folder
        const riskData = response.data;
        console.log(riskData);
        const selectedItem = riskData.find(
          (item) => item.id === Number(params.id)
        );

        setData(selectedItem);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  console.log(data);

  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const columns = [];
  // Conditionally add columns based on data.decision

  if (data && data.decision == "transfer") {
    columns.push(
      {
        title: "Transfer Status",
        dataIndex: "address",
        key: "address",
      },
      {
        title: "Action",
        key: "action",
        render: (_, record) => (
          <Space size="middle">
            <a>Edit {record.name}</a>
            <a>Send Notification</a>
          </Space>
        ),
      }
    );
  }
  if (data && data.decision !== "transfer") {
    columns.push(
      {
        title: "Action Name ",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Status",
        dataIndex: "age",
        key: "age",
      },
      {
        title: "Start Date",
        dataIndex: "age",
        key: "age",
      },
      {
        title: "End Date",
        dataIndex: "age",
        key: "age",
      },
      {
        title: "Action Owner ",
        dataIndex: "address",
        key: "address",
      },
      {
        title: "Expected Benefit",
        dataIndex: "address",
        key: "address",
      },
      {
        title: "Action",
        key: "action",
        render: (_, record) => (
          <Space size="middle">
            <a>Edit ({record.name})</a>
            <a>Send Notification</a>
          </Space>
        ),
      }
    );
  }

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: (
              <a
                onClick={() => {
                  router.push(`/dashboard`);
                }}
              >
                <LayoutDashboard size={20} />
              </a>
            ),
          },
          {
            title: (
              <a
                onClick={() => {
                  router.push(`/dashboard/risk_treatment`);
                }}
              >
                Risk Treatment 
              </a>
            ),
          },
          {
            title: "Edit",
          },
        ]}
      />
      <Title>Risk ID:{params.id}</Title>
      <Divider />
      {data && (
        <>
          <Title level={4}>Risk Name: {data.name}</Title>
          <Title level={5}>Risk Details: {data.decision}</Title>
          <Divider />
          <Table dataSource={dataSource} columns={columns} />
        </>
      )}
    </>
  );
};

export default Edit;
