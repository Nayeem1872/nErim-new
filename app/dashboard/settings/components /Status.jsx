"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Dots from "../../components/DotLoader";

const Status = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [matrixId, setMatrixId] = useState(0);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [id, setId] = useState();
  const email = localStorage.getItem("verifyEmail");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authorization");
  // delete
  const showPopconfirm = (record) => {
    setOpen(record?.id);
    setId(record?.id);
  };

  const confirm = async (e) => {
    setConfirmLoading(true);
    try {
      // Make a DELETE request to your backend API
      const response = await axios.delete(
        `/api/delete-risk-status/${id}`,
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
        setOpen(false);
        setConfirmLoading(false);
        console.log(response.data); // Log response data if needed
        message.success("Risk Status has deleted successfully.");
      } else {
        // Handle error if deletion fails
        setOpen(false);
        setConfirmLoading(false);
        console.error("Deletion failed:", response.statusText);
        message.error("Failed to delete record.");
      }
    } catch (error) {
      // Handle any errors that occur during the deletion process
      setOpen(false);
      setConfirmLoading(false);
      console.error("Error deleting record:", error);
      message.error("An error occurred while deleting the record.");
    }
  };
  const cancel = (e) => {
    console.log(e);
    message.error("Cancel");
    setOpen(false);
  };

  useEffect(() => {
    const storedMatrixId = localStorage.getItem("modelId");
    if (storedMatrixId) {
      setMatrixId(parseInt(storedMatrixId));
    }
  }, []);

  const { data: dataSourceQuery,isLoading, refetch } = useQuery({
    queryKey: ["status"],
    queryFn: async () => {
      const response = await axios.get(`/api/get-risk-status`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.riskStatusData;
    },
    staleTime: 1000 * 60 * 60 * 1,
  });
  // console.log("Status data:", dataSourceQuery);

  const [apiData, setApiData] = useState(null);

  useEffect(()=>{
    const fetchData = async () => {
      try {
        // Make an HTTP GET request to your API endpoint
        const response = await axios.get('/api/basic-status');

        // Update the state with the fetched data
        setApiData(response.data.is_admin);
      } catch (error) {
        console.error('Error fetching data:', error);
        // You might want to handle errors here
      }
    };

    // Call the fetch function when the component mounts
    fetchData();

  },[])
  const columns = [
    {
      title: t("settingsStatus.Status_Name"),
      dataIndex: "status_name",
      key: "status_name",
    },

  ];

  if (apiData !== "user") {
    columns.push({
      title: t("settingsStatus.Action"),
      width: 150,
      key: "action",
      render: (text, record) => (
        <Space size="small">
          {apiData === "user" ? null : (
            <>
            <Button type="primary" onClick={() => showModal(record)}>
            {t("settingsStatus.Edit")}
          </Button>
          <Popconfirm
           title={`Dependency ${record?.dependency}`}
           description={
             <>
               Deleting this item will result in the removal of its {record?.dependency} associated <br /> dependent risk indices. After deletion, you will <br /> need to manually assign the appropriate   risk matrix to each <br /> corresponding risk index.
           
               <br />
             <strong>Are you sure you want to delete?</strong>  
             </>
           }
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
              type="default"
              onClick={() => showPopconfirm(record)}
            >
              {t("settingsStatus.Delete")}
            </Button>
          </Popconfirm>
            
            </>
          
             )}
        </Space>
      ),

    })
  }
  useEffect(() => {
    if (dataSourceQuery) {
      setDataSource(dataSourceQuery);
    }
  }, [dataSourceQuery]);

  // const addRow = (formData) => {
  //   if (dataSource.length < matrixId) {
  //     const newData = {
  //       key: dataSource.length + 1,
  //       ...formData,
  //     };
  //     setDataSource([...dataSource, newData]);
  //     message.success(t("settingsStatus.New_Risk_Status_added"));
  //   } else {
  //     message.warning(`You can't add more than ${matrixId} rows.`, 5);
  //   }
  // };

  // modal

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const showModal = (record) => {
    setEditId(record.id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };
  const storedMatrixId = localStorage.getItem("modelId");

  const handleOk = async () => {
    const formData = form.getFieldsValue();
    setIsModalOpen(false);

    // post method for likelihood

    if (!editId) {
      try {
        console.log("object:", {
          userId: userId,
          verifyEmail: email,
          ...formData,
        });
        const data = { userId: userId, verifyEmail: email, ...formData };
        // console.log("formdata:",formData);

        const apiUrl = "/api/risk-status";

        const response = await axios.post(apiUrl, data, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          // Handle success
          // console.log("File uploaded successfully:", response);
          message.success("New status added successfully");
  
          refetch();
        } else {
          // Handle failure
          message.error("Status added failed");
        }
        // addRow(formData);
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const errors = error.response.data.errors;
          if (errors.status_name) {
            message.error(errors.status_name[0]);
          }
          setTimeout(() => {
            message.destroy();
          }, 4000);
        } else {
          console.error("Error sending data:", error);
          message.error(t("settingsStatus.Error_sending_data"));
        }
      }
    }

    // edit
    else {
      try {
        const data = {
          userId: userId,
          verifyEmail: email,
          ...formData,
          id: editId,
        };
        console.log("formdata:", data);

        const apiUrl = `/api/update-risk-status`;

        const response = await axios.post(apiUrl, data, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          refetch();
          // If update is successful, update the dataSource
          const updatedData = dataSource.map((item) =>
            item.id === editId ? { ...item, ...formData } : item
          );
          setDataSource(updatedData);
          message.success(t("settingsStatus.Risk_Status_updated_successfully"));
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const errors = error.response.data.errors;

          if (errors.status_name) {
            message.error(errors.status_name[0]);
          }
          setTimeout(() => {
            message.destroy();
          }, 4000);
        } else {
          console.error("Error sending data:", error);
          message.error(t("settingsStatus.Error_sending_data"));
        }
      }
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div>
        <div style={{ textAlign: "right" }}>
          <Button
            type="primary"
            style={{ marginBottom: "10px" }}
            onClick={showModal}
          >
            + {t("settingsStatus.Add")}
          </Button>
        </div>
        <Modal
          title={t("settingsStatus.Status")}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form}>
            <Form.Item
              name="status_name"
              label={t("settingsStatus.Status_Name_label")}
            >
              <Input
                placeholder={t("settingsStatus.Input_Status_Name_placeholder")}
              />
            </Form.Item>
          </Form>
        </Modal>
        {isLoading ? (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:"100px" }}>
        <Dots />
    </div>
      ) : (
        <Table dataSource={dataSource} pagination={false} columns={columns} />

      )}
      </div>
    </>
  );
};

export default Status;
