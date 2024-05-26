"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  Input,
  Select,
  Breadcrumb,
  message,
  Upload,
  Result,
  Alert,
} from "antd";
import { Divider, Typography } from "antd";
const { Title, Text } = Typography;
import axios from "axios";
import { useRouter } from "next/navigation";
import { DatePicker } from "antd";
import { useTranslation } from "react-i18next";
import { LayoutDashboard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const { TextArea, Search } = Input;

const Treatment = () => {
  const { t } = useTranslation();
  const [selectedRow, setSelectedRow] = useState(null);
  const router = useRouter();
  const [transferInputValue, setTransferInputValue] = useState("");
  const [actionName, setActionName] = useState("");
  const [actionDetails, setActionDetails] = useState("");
  const [actionOwner, setActionOwner] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [expectedBenefit, setExpectedBenefit] = useState("");
  const [closingDate, setClosingDate] = useState(null);
  const [status, setStatus] = useState("");
  const [editId, setEditId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

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
      } catch (error) {
        console.error("Error fetching data:", error);
        // You might want to handle errors here
      }
    };

    // Call the fetch function when the component mounts
    fetchData();
  }, []);

  // Check if apiData exists and if any of the status values is false
  const isError =
    apiData &&
    (!apiData.matrixStatus ||
      !apiData.likelihoodStatus ||
      !apiData.impactStatus);

  // console.log("status", apiData);

  const columns = [
    {
      title: t("risk_treatment.id"),
      dataIndex: "refId",
      key: "refId",
      width: 150,
      fixed: "left",
      // onFilter: (value, record) => record.name.indexOf(value) === 0,
    },
    {
      title: t("risk_treatment.decision"),
      dataIndex: "treatment_decision",
      key: "treatment_decision",
      width: 150,
      fixed: "left",
      // onFilter: (value, record) => record.name.indexOf(value) === 0,
    },
    {
      title: t("risk_treatment.action_summary.summary"),
      children: [
        {
          title: t("risk_treatment.action_summary.action_name"),
          dataIndex: "treatments",
          key: "name",
          render: (treatments, record) => {
            // console.log(record);
            // console.log(treatments); // Log the record object
            return (
              <>
                {treatments.map((treatment, index) => (
                  <>
                    <div key={index}>{treatment.treat_name}</div>
                    <Divider />
                  </>
                ))}
              </>
            );
          },
        },
        {
          title: t("risk_treatment.action_summary.status"),
          dataIndex: "treatments",
          key: "status",
          render: (treatments) => (
            <>
              {treatments.map((treatment, index) => (
                <>
                  <div key={index}>{treatment.treat_status}</div>
                  <Divider />
                </>
              ))}
            </>
          ),
        },
        {
          title: t("risk_treatment.Transfer"),
          dataIndex: "treatments",
          key: "owner",
          render: (treatments) => (
            <>
              {treatments.map((treatment, index) => (
                <>
                  <div key={index}>{treatment.resolve}</div>
                  <Divider />
                </>
              ))}
            </>
          ),
        },
        {
          title: t("risk_treatment.action_summary.end_date"),
          dataIndex: "treatments",
          key: "end_date",
          render: (treatments) => (
            <>
              {treatments.map((treatment, index) => (
                <>
                  <div key={index}>{treatment.closing_date}</div>
                  <Divider />
                </>
              ))}
            </>
          ),
        },
        {
          title: t("risk_treatment.action_summary.owner"),
          dataIndex: "treatments",
          key: "owner",
          render: (treatments) => (
            <>
              {treatments.map((treatment, index) => (
                <>
                  <div key={index}>{treatment.treat_owner}</div>
                  <Divider />
                </>
              ))}
            </>
          ),
        },
      ],
    },
    {
      title: t("risk_treatment.action"),
      width: 150,
      key: "action",
      render: (text, record) => (
        <Space size="small">
          <Button
            type="primary"
            onClick={() => showModal(record)}
            style={{
              display:
                record.treatment_decision === "Accept" ? "none" : "block",
            }}
          >
            {t("risk_treatment.add_button")}
          </Button>
          <Button
            type="default"
            onClick={() => {
              router.push(`/dashboard/risk_treatment/view/${record?.id}`);
            }}
          >
            {t("risk_treatment.view_button")}
          </Button>
        </Space>
      ),
    },
  ];

  // console.log("Columns:", columns);
  const email = localStorage.getItem("verifyEmail");
  const token = localStorage.getItem("authorization");
  const userId = localStorage.getItem("userId");

  const {
    data: data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["treatment1"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/treatments`,

        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.riskTreatments;
    },
    staleTime: 1000 * 60 * 60 * 1,
  });

  // console.log("data", data);
  // console.log("data",data);
  const [refId, setRefId] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = (record) => {
    setEditId(record.id);
    setRefId(record.refId);
    setSelectedRow(record);
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    setIsModalOpen(false);
    try {
      const formData = new FormData();

      formData.append("userId", userId);
      formData.append("verifyEmail", email);
      formData.append("register_id", editId);
      formData.append("refId", refId);
      formData.append("resolve", transferInputValue);
      formData.append("treat_name", actionName);
      formData.append("treat_detial", actionDetails);
      formData.append("treat_owner", actionOwner);
      formData.append("action_owner_email", ownerEmail);
      formData.append("expected_benefit", expectedBenefit);
      formData.append("closing_date", closingDate);
      formData.append("treat_status", status);
      if (selectedFile) {
        // Make sure selectedFiles is not null and append it to FormData
        formData.append("attachment", selectedFile.originFileObj);
      }

      const apiUrl = "/api/treatments/save";
      const response = await axios.post(apiUrl, formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("respone", response);
      if (response.status === 200) {
        refetch();
        setActionName("");
        setActionDetails("");
        setActionOwner("");
        setOwnerEmail("");
        setExpectedBenefit("");
        setClosingDate(null);
        setStatus("");
        message.success("Risk Treatment has Added!");
      } else {
        message.error("Someething went wrong!");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;
        if (errors.treat_detial) {
          message.error(errors.treat_detial[0]);
        }
        if (errors.treat_owner) {
          message.error(errors.treat_owner[0]);
        }
        if (errors.action_owner_email) {
          message.error(errors.action_owner_email[0]);
        }
        if (errors.expected_benefit) {
          message.error(errors.expected_benefit[0]);
        }
        if (errors.treat_status) {
          message.error(errors.treat_status[0]);
        }
        // Add more conditions for other fields if needed
        setTimeout(() => {
          message.destroy(); // Clear all messages after 3 seconds
        }, 4000);
      } else {
        message.error("Something went wrong!");
      }
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const props = {
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
        setSelectedFile(info.file);
      }
    },
  };
  // Handle import
  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/treatment/import", formData);
      // Handle success
      console.log("File uploaded successfully:", response);
      message.success("File uploaded successfully");
    } catch (error) {
      // Handle error
      console.error("Error uploading file:", error);
      message.error("Error uploading file");
    }
  };

  // search function

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

  const [modalVisible, setModalVisible] = useState(false);
  // const showModalExample = () => {
  //   setIsModalExampleOpen(true);
  // };
  const handleImportModal = () => {
    setModalVisible(true);
  };

  const handleImport = () => {
    // Make an API call to download the file
    axios({
      url: "/api/treatment/example/file", // Replace 'your-api-endpoint' with your actual API endpoint
      method: "GET",
      responseType: "blob", // Tell Axios to expect a blob (binary data)
    })
      .then((response) => {
        // Create a Blob from the response data
        const blob = new Blob([response.data], {
          type: "application/octet-stream",
        });
        // Create a link element
        const url = window.URL.createObjectURL(blob);
        // Create a temporary anchor element
        const a = document.createElement("a");
        a.href = url;
        a.download = "Risk-Treatment-Example.xlsx"; // Specify the file name
        // Append the anchor element to the body
        document.body.appendChild(a);
        // Programmatically click the anchor element to start downloading
        a.click();
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
        // Handle error
      });
    setModalVisible(false);
  };

  return (
    <div>
      <Title level={2}>{t("risk_treatment.risk_treatment")}</Title>
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
            title: (
              <span style={{ color: "gray" }}>
                {t("risk_treatment.risk_treatment_page")}
              </span>
            ),
          },
        ]}
      />
      <Divider />
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
          <div>
            <Search
              placeholder={t("risk_treatment.search_here")}
              onSearch={handleSearch}
              allowClear
              style={{
                width: 400,
              }}
            />
            <div style={{ textAlign: "right", gap: "10px" }}>
              <Button
                onClick={handleImportModal}
                style={{ marginRight: "10px" }}
              >
                Example File
              </Button>
              <Modal
                width={800}
                centered
                title=" "
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={[
                  <Button key="cancel" onClick={() => setModalVisible(false)}>
                    Cancel
                  </Button>,
                  <Button key="download" type="primary" onClick={handleImport}>
                    Download
                  </Button>,
                ]}
              >
                <div style={{ marginTop: "20px" }}>
                  <Alert
                    message="Download Example"
                    description={
                      <div>
                        In the Excel sheet, the predefined and unchangeable
                        headings include <strong>SL</strong>,{" "}
                        <strong>Risk Name</strong>, <strong>Date</strong>,{" "}
                        <strong>Risk Owner</strong>,{" "}
                        <strong>Owner Email</strong>, and other all headings.
                        These headings will serve as the key fields for
                        importing data into the database.
                      </div>
                    }
                    type="info"
                    showIcon
                  />
                </div>

                <p></p>
              </Modal>

              <Upload
                customRequest={handleUpload}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                showUploadList={false}
              >
                <Button
                  type="primary"
                  // onClick={handleExportButtonClick}
                  style={{ marginRight: "10px", marginBottom: "10px" }}
                >
                  {t("risk_treatment.import")}
                </Button>
              </Upload>
            </div>
          </div>

          <Table
            dataSource={filterData()}
            columns={columns}
            bordered
            size="middle"
          />
          <Modal
            title={t("risk_treatment.modal_title")}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            centered
            width={600}
          >
            <Divider />
            <p>
              {t("risk_treatment.modal_id_label")} {selectedRow?.refId}
            </p>
            <Typography.Title level={5}>
              {t("risk_treatment.decision_title")}:{" "}
              <Text type="secondary">{selectedRow?.treatment_decision}</Text>{" "}
            </Typography.Title>
            {selectedRow?.treatment_decision === "Transfer" ? (
              <Input
                placeholder={t("risk_treatment.transfer_placeholder")}
                value={transferInputValue}
                onChange={(e) => setTransferInputValue(e.target.value)}
              />
            ) : (
              <>
                <Typography.Title level={5}>
                  {t("risk_treatment.action_name_title")}
                </Typography.Title>
                <Input
                  placeholder={t("risk_treatment.action_name")}
                  value={actionName}
                  onChange={(e) => setActionName(e.target.value)}
                />

                <Typography.Title level={5}>
                  {t("risk_treatment.action_details_title")}
                </Typography.Title>
                <TextArea
                  style={{
                    height: 120,
                    resize: "none",
                  }}
                  allowClear
                  status={error}
                  placeholder={t("risk_treatment.action_details")}
                  value={actionDetails}
                  onChange={(e) => setActionDetails(e.target.value)}
                />

                <Typography.Title level={5}>
                  {t("risk_treatment.action_owner_title")}
                </Typography.Title>
                <Input
                  placeholder={t("risk_treatment.action_owner")}
                  value={actionOwner}
                  onChange={(e) => setActionOwner(e.target.value)}
                />

                <Typography.Title level={5}>
                  {t("risk_treatment.owner_email_title")}
                </Typography.Title>
                <Input
                  placeholder={t("risk_treatment.owner_email")}
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  rules={[
                    {
                      required: true,
                      type: "email",
                    },
                  ]}
                />

                <Typography.Title level={5}>
                  {t("risk_treatment.expected_benefit_title")}
                </Typography.Title>
                <Input
                  placeholder={t("risk_treatment.expected_benefit")}
                  value={expectedBenefit}
                  onChange={(e) => setExpectedBenefit(e.target.value)}
                />

                <div style={{ marginBottom: "20px" }}>
                  <Space align="center" justifyContent="flex-start">
                    <Typography.Title level={5}>
                      {t("risk_treatment.closing_date_title")}
                    </Typography.Title>
                    <DatePicker
                      onChange={(date, dateString) =>
                        setClosingDate(dateString)
                      }
                      style={{ marginTop: "20px" }}
                    />
                    <Typography.Title level={5} style={{ marginLeft: "10px" }}>
                      {t("risk_treatment.status_title")}
                    </Typography.Title>
                    <Select
                      style={{ width: "150px", marginTop: "15px" }}
                      defaultValue={t("risk_treatment.Select_Status")}
                      allowClear
                      value={status}
                      onChange={(value) => setStatus(value)}
                      options={[
                        {
                          value: "Not Started",
                          label: t("risk_treatment.Not_Started"),
                        },
                        {
                          value: "Started",
                          label: t("risk_treatment.Started"),
                        },
                        {
                          value: "In Progress - In Control",
                          label: t("risk_treatment.In_Progrese_In Control"),
                        },
                        {
                          value: "Halted - In Control",
                          label: t("risk_treatment.Halted_In Control"),
                        },
                        {
                          value: "Halted - Need Managedment Support",
                          label: t(
                            "risk_treatment.Halted_Need Managedment Support"
                          ),
                        },
                        {
                          value: "Finished",
                          label: t("risk_treatment.Finished"),
                        },
                      ]}
                    />
                  </Space>
                  {status === "Finished" && (
                    <>
                      <Typography.Title level={5}>Attachment</Typography.Title>
                      <Upload {...props}>
                        <Button>Click to Upload</Button>
                      </Upload>
                    </>
                  )}
                </div>
              </>
            )}
          </Modal>
        </>
      )}
    </div>
  );
};

export default Treatment;
