"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Space, Breadcrumb, ConfigProvider, Result, Spin } from "antd";
import { useRouter } from "next/navigation";
import { Button, message, Popconfirm } from "antd";
import { Divider, Typography } from "antd";
import { Input } from "antd";
const { Search } = Input;
const { Title } = Typography;
import { useTranslation } from "react-i18next";
import { Edit3, Eye, LayoutDashboard, Plus, Trash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { RedoOutlined } from "@ant-design/icons";

const Register = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [idDelete, setIdDelete] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [id, setId] = useState("");
  const token = localStorage.getItem("authorization");
  const [isAdmin, setIsAdmin] = useState("");

  const [apiData, setApiData] = useState(null);

  const handleSettingsClick = () => {
    router.push("/dashboard/settings"); // Navigate to settings page
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make an HTTP GET request to your API endpoint
        const response = await axios.get("/api/basic-status");

        // Update the state with the fetched data
        setApiData(response.data);
        setIsAdmin(response.data.is_admin);
      } catch (error) {
        console.error("Error fetching data:", error);
        // You might want to handle errors here
      }
    };

    // Call the fetch function when the component mounts
    fetchData();
  }, []);

  console.log(apiData);
  // Check if apiData exists and if any of the status values is false
  const isError =
    apiData &&
    (!apiData.matrixStatus ||
      !apiData.likelihoodStatus ||
      !apiData.impactStatus);

  // console.log("status", apiData);
  const [loading, setLoading] = useState(false);

  const {
    data: data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["registerData"],
    queryFn: async () => {
      setLoading(true);
      const response = await axios.get(
        `/api/risk-register`,

        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      return response.data.registerData;
    },
    staleTime: 1000 * 60 * 60 * 1,
  });

  const showPopconfirm = (record) => {
    setOpen(record?.id);
    setIdDelete(record?.id);
  };

  // console.log("id", id);

  const confirm = async (e) => {
    setConfirmLoading(true);

    try {
      // Make a DELETE request to your backend API
      const response = await axios.delete(
        `/api/delete-risk-register/${idDelete}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);

      // Check if the deletion was successful
      if (response.status === 200) {
        refetch();
        const indexToDelete = dataSource.findIndex(
          (record) => record.key === id
        );
        console.log("Index to delete:", indexToDelete);

        if (indexToDelete !== -1) {
          const updatedDataSource = [...dataSource];
          updatedDataSource.splice(indexToDelete, 1);
          console.log("Updated data source:", updatedDataSource);
          setDataSource(updatedDataSource);
        }

        // setOpen(false);
        // setConfirmLoading(false);
        message.success("Register deleted successfully.");
      } else {
        // Handle error if deletion fails
        setOpen(false);
        setConfirmLoading(false);
        // console.error("Deletion failed:", response.statusText);
        message.error("Failed to delete record.");
      }
    } catch (error) {
      message.error("An error occurred while deleting the record.");
    }

    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
      // console.log(e);
      // message.success("Click on Yes");
    }, 1000);
  };
  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
    setOpen(false);
  };
  const router = useRouter();
  const columns = [
    {
      title: t("register.id"),
      dataIndex: "refId",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.age - b.age,
    },

    {
      title: t("register.risk_name"),
      dataIndex: "risk_name",

      onFilter: (value, record) => record.risk_name.indexOf(value) === 0,
      sorter: (a, b) => a.risk_name.length - b.risk_name.length,
      sortDirections: ["descend"],
    },
    {
      title: t("register.potential_impact"),
      dataIndex: "potential_impact",

      onFilter: (value, record) => record.potential_impact.indexOf(value) === 0,
      sorter: (a, b) => a.potential_impact.length - b.potential_impact.length,
      sortDirections: ["descend"],
    },
    {
      title: t("register.financial_impact"),
      dataIndex: "financial_impact",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: t("register.decision"),
      dataIndex: "treatment_decision",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: t("register.risk_criticality"),
      dataIndex: "risk_criticality",
      onFilter: (value, record) => record.address.indexOf(value) === 0,
    },

    {
      title: t("register.action"),

      key: "action",
      render: (text, record) => (
        <Space size="small">
          <a
            onClick={() => {
              setId(record?.id);
              router.push(`/dashboard/register/view/${record?.id}`);
            }}
          >
            <Eye size={23} />
          </a>
          {isAdmin === "user" ? null : (
            <>
              <a
                onClick={() =>
                  router.push(`/dashboard/register/edit/${record?.id}`)
                }
              >
                {" "}
                <Edit3 size={23} style={{ marginLeft: "10px" }} />
              </a>

              <Popconfirm
                title="Delete the task"
                description="Are you sure to delete this task?"
                open={open === record?.id}
                onConfirm={() => confirm(record?.id)}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
                okButtonProps={{
                  loading: confirmLoading,
                }}
              >
                <Button
                  danger
                  onClick={() => showPopconfirm(record)}
                  style={{
                    display: "flex",
                    border: "none",
                    border: "none",
                    boxShadow: "none",
                    backgroundColor: "white",
                  }}
                >
                  {/* Pass record to showPopconfirm */}
                  <Trash size={23} />
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  // Search Function

  const [filterInput, setFilterInput] = useState("");
  const handleSearch = (value) => {
    setFilterInput(value);
  };

  const filterData = () => {
    if (filterInput === "") return data;

    return data.filter((record) => {
      // Iterate over each column and check if any of the column data includes the filter input
      for (const column of columns) {
        if (record[column.dataIndex]) {
          // Check if the column data includes the filter input
          if (
            record[column.dataIndex]
              .toString()
              .toLowerCase()
              .includes(filterInput.toLowerCase())
          ) {
            return true; // Return true if any column data includes the filter input
          }
        }
      }
      return false; // Return false if no column data includes the filter input
    });
  };

  // Export Download

  const handleExportButtonClick = async () => {
    try {
      // Perform your API call here
      const response = await axios.get("/api/register/export", {
        responseType: "blob", // Set the response type to 'blob'
        withCredentials: true, // Include credentials in the request
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle the response
      console.log("Export API response:", response.data);
      const blobUrl = window.URL.createObjectURL(response.data);

      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", "Register.zip");

      // Append the link to the document body and trigger the click event
      document.body.appendChild(link);
      link.click();

      // Clean up by removing the link from the document body
      document.body.removeChild(link);

      // Stop loading after successful download
      setConfirmLoading(false);

      message.success("Downloaded!");
    } catch (error) {
      console.error("Error exporting data:", error);
      // Handle errors
    }
  };

  const handleRefresh = async () => {
    setLoading(true); // Set loading to true before refetching
    await refetch(); // Await the refetch
    setTimeout(() => setLoading(false), 1000); // Set loading to false after 1 second
  };

  return (
    <div>
      <>
        <div>
          <Title level={2}>{t("register.register")}</Title>

          <Breadcrumb
            items={[
              {
                title: (
                  <a
                    onClick={() => {
                      router.push(`/dashboard`);
                    }}
                  >
                    <LayoutDashboard color="#0D85D8" size={20} />
                  </a>
                ),
              },
              {
                title: t("register.register_page"),
              },
            ]}
          />
          <Divider />
          <div></div>

          {isError ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Result
                status="warning"
                title={
                  apiData?.impactStatus === false
                    ? "There are some problem with your Risk Impact!"
                    : apiData?.likelihoodStatus === false
                    ? "Something wrong in your risk Likelihood"
                    : "Something wrong in your risk valuation"
                }
                // title={t("There are some problems with your operation.")}
                subTitle={t("Please check your settings.")}
                extra={
                  <Button
                    type="primary"
                    key="console"
                    onClick={handleSettingsClick}
                  >
                    {t("Go Settings")}
                  </Button>
                }
              />
            </div>
          ) : (
            <>
              <div style={{ textAlign: "right" }}>
                <Button onClick={handleRefresh} style={{ marginRight: "10px" }}>
                  <RedoOutlined /> Refresh
                </Button>
                {/* {loading && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Spin />
                  </div>
                )} */}
                <Button
                  onClick={handleExportButtonClick}
                  style={{ marginRight: "10px" }}
                >
                  {t("register.export")}
                </Button>
                <Button
                  onClick={() => router.push("/dashboard/register/add")}
                  type="primary"
                >
                  {t("register.add_new")}
                </Button>
              </div>

              <div>
                <Search
                  placeholder={t("register.search_risk_name")}
                  onSearch={handleSearch}
                  allowClear
                  style={{
                    width: 400,
                    marginBottom: "15px",
                  }}
                />
                <ConfigProvider
                  theme={{
                    table: {
                      container: {
                        background: "#69b1ff",
                      },
                    },
                  }}
                >
                  <Table
                    columns={columns}
                    dataSource={filterData()}
                    onChange={onChange}
                    bordered
                    loading={isLoading}
                  />
                </ConfigProvider>
              </div>
            </>
          )}
        </div>
      </>
    </div>
  );
};

export default Register;
