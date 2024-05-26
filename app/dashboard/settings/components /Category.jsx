"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  Space,
  Table,
  message,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Dots from "../../components/DotLoader";

const Category = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [id, setId] = useState();
  const email = localStorage.getItem("verifyEmail");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authorization");
  const [apiData, setApiData] = useState(null);

  const { data: dataSourceQuery,isLoading,refetch } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const response = await axios.get(`/api/get-risk-category`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.riskCategoryData;
    },
    staleTime: 1000 * 60 * 60 * 1,
  });

  // delete
  const showPopconfirm = (record) => {
    setOpen(record?.id);
    setId(record?.id);
  };

  const confirm = async (e) => {
    setConfirmLoading(true);
    try {
      // Make a DELETE request to your backend API
      const response = await axios.delete(`/api/delete-risk-category/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if the deletion was successful
      if (response.status === 200) {
        refetch();
        setOpen(false);
        setConfirmLoading(false);
        message.success(
          t("settingsCategory.Risk_Category_deleted_successfully")
        );
      } else {
        // Handle error if deletion fails
        setOpen(false);
        setConfirmLoading(false);
        // console.error("Deletion failed:", response.statusText);
        message.error(t("settingsCategory.Failed_to_delete_record"));
      }
    } catch (error) {
      // Handle any errors that occur during the deletion process
      setOpen(false);
      setConfirmLoading(false);
      // console.error("Error deleting record:", error);
      message.error(t("settingsCategory.Error_deleting_record"));
    }
  };
  const cancel = (e) => {
    // console.log(e);
    message.error(t("settingsCategory.Cancel"));
    setOpen(false);
  };

 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make an HTTP GET request to your API endpoint
        const response = await axios.get("/api/basic-status");

        // Update the state with the fetched data
        setApiData(response.data.is_admin);
      } catch (error) {
        console.error("Error fetching data:", error);
        // You might want to handle errors here
      }
    };

    // Call the fetch function when the component mounts
    fetchData();
  }, []);

  const columns = [
    {
      title: t("settingsCategory.Category_Name"),
      dataIndex: "category_name",
      key: "category_name",
    },

  ];



  if (apiData !== "user") {
    columns.push({
      title: t("settingsCategory.Action"),
      key: "action",
      render: (text, record) => (
        <Space size="small">
          {apiData === "user" ? null : (
            <>
              <Button type="primary" onClick={() => showModal(record)}>
                {t("settingsCategory.Edit")}
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
                  {t("settingsCategory.Delete")}
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

  // modal

  const showModal = (record) => {
    setEditId(record.id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const formData = form.getFieldsValue();
    setIsModalOpen(false);

    // post method for likelihood

    if (!editId) {
      try {
        const data = { userId: userId, verifyEmail: email, ...formData };
        // console.log("formdata:",formData);

        const apiUrl = "/api/risk-category";

        const response = await axios.post(apiUrl, data, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          refetch();
          message.success("New Category Added!");
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const errors = error.response.data.errors;
          // Check if there are errors for the 'category_name' field
          if (errors.category_name) {
            message.error(errors.category_name[0]); // Display the first error message for 'category_name' field
          }
          setTimeout(() => {
            message.destroy(); // Clear all messages after 3 seconds
          }, 4000);
        } else {
          console.error("Error updating data:", error);
          message.error(t("settingsCategory.Error_deleting_record"));
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

        const apiUrl = `/api/update-risk-category`;

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
          message.success(
            t("settingsCategory.Risk_Category_updated_successfully")
          );
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const errors = error.response.data.errors;
          // Check if there are errors for the 'category_name' field
          if (errors.category_name) {
            message.error(errors.category_name[0]); // Display the first error message for 'category_name' field
          }
          setTimeout(() => {
            message.destroy(); // Clear all messages after 3 seconds
          }, 4000);
        } else {
          console.error("Error updating data:", error);
          message.error(t("settingsCategory.Error_updating_data"));
        }
      }
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        <Button type="primary" onClick={showModal}>
          + {t("settingsCategory.Add")}
        </Button>
        <Modal
          centered
          title={t("settingsCategory.Risk_Category_title")}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form
            name="basic"
            form={form}
            style={{
              maxWidth: 800,
            }}
          >
            <Form.Item
              label={t("settingsCategory.Category_Name_label")}
              name="category_name"
              rules={[
                {
                  required: true,
                  message: t(
                    "settingsCategory.Please_input_your_Risk_Category"
                  ),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <div>
      {isLoading ? (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:"100px" }}>
        <Dots />
    </div>
      ) : (
        <Table dataSource={dataSource} columns={columns} />
      )}
      </div>
    </>
  );
};

export default Category;
