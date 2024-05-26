"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Col, Row, Table } from "antd";
import { useRouter } from "next/navigation";

const Dashboard_Table = () => {
  const [matrixWithStatus, setMatrixWithStatus] = useState([]);
  const [data, setData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("verifyEmail");
    const token = localStorage.getItem("authorization");
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/dashboard/`,

          {
            withCredentials: true,
            headers: {
              // 'Cookie': combinedId,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMatrixWithStatus(response.data.matrixWithStatus);

        const final = response.data.tblRegisterWithStatus;
        setData(final);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  const columns = [
    {
      title: "Name",
      dataIndex: "status_name",
      key: "status_name",
    },
    ...matrixWithStatus.map((matrix) => ({
      title: matrix.critical_step,
      dataIndex: `count_${matrix.id}`,
      key: `count_${matrix.id}`,
      render: (text, record) => {
        const dataItem = record.data.find(
          (item) => item.matrix_id === matrix.id
        );
        return (
          <span
            style={{ cursor: "pointer" }}
            onClick={() => handleDataItemClick(dataItem)}
          >
            {dataItem ? dataItem.count : "-"}
          </span>
        );
      },
    })),
  ];
  const handleDataItemClick = async (dataItem) => {

    router.push(
      `/dashboard/register/tableData/${dataItem?.matrix_id}/${dataItem?.status_id}`
    );
  };

  return (
    <div
      style={{ marginTop: "110px", borderRadius: "10px", overflow: "hidden" }}
    >
      <Row justify="center">
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Table dataSource={data} columns={columns} pagination={false} />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard_Table;
