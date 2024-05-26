"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  ColorPicker,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
} from "antd";
const { TextArea } = Input;
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Dots from "../../components/DotLoader";

const Likelihood = ({ setApiData }) => {
  const { t } = useTranslation();
  const [matrixId, setMatrixId] = useState(0);
  // const [dataSource, setDataSource] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [color, setColor] = useState();

  const email = localStorage.getItem("verifyEmail");
  const token = localStorage.getItem("authorization");
  const userId = localStorage.getItem("userId");

  // get request
  const { data: dataSourceQuery,isLoading, refetch } = useQuery({
    queryKey: ["likelihood"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/get-risk-likelihood`,

        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("data", response);
      if (response.data.likelihoodData.length > 0) {
        // Extracting colors from all items in impactData
        const colors = response.data.likelihoodData.map((item) => item.color);
        // Assuming setColor is a state setter function
        setColor(colors); // Set color to the array of colors
      }
      // console.log("likelihood Data:", response.data.likelihoodData);
      return response.data.likelihoodData;
    },
    staleTime: 1000 * 60 * 60 * 1,
  });

  // delete
  const showPopconfirm = (record) => {
    setOpen(record?.id);
    setId(record?.id);
  };
  // console.log("id", id);

  const confirm = async (e) => {
    setConfirmLoading(true);
    try {
      // Make a DELETE request to your backend API
      const response = await axios.delete(`/api/delete-risk-likelihood/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if the deletion was successful
      if (response.status === 200) {
        refetch();

        const response = await axios.get("/api/basic-status");

        // Update the state with the fetched data
        setApiData(response.data);
        // console.log("Child Component - setApiData:", setApiData);

        setOpen(false);
        setConfirmLoading(false);
        message.success("Likelihood deleted successfully.");
      } else {
        // Handle error if deletion fails
        setOpen(false);
        setConfirmLoading(false);
        // console.error("Deletion failed:", response.statusText);
        message.error("Failed to delete record.");
      }
    } catch (error) {
      // Handle any errors that occur during the deletion process
      setOpen(false);
      setConfirmLoading(false);
      // console.error("Error deleting record:", error);
      message.error("An error occurred while deleting the record.");
    }
  };
  const cancel = (e) => {
    console.log(e);
    // message.error("Click on No");
    setOpen(false);
  };

  useEffect(() => {
    const storedMatrixId = localStorage.getItem("modelId");
    if (storedMatrixId) {
      setMatrixId(parseInt(storedMatrixId));
    }
  }, []);
  const [apiData, setApiData1] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make an HTTP GET request to your API endpoint
        const response = await axios.get("/api/basic-status");

        // Update the state with the fetched data
        setApiData1(response.data.is_admin);
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
      title: t("settingsLikelihood.Likelihood"),
      dataIndex: "relative",
      key: "relative",
    },
    {
      title: t("settingsLikelihood.Description"),
      dataIndex: "description",
      key: "description",
    },
    {
      title: t("settingsLikelihood.Weight"),
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: t("settingsLikelihood.Color"),
      dataIndex: "color",
      key: "color",
      render: (text, record) => (
        <ColorPicker value={record?.color} showText disabled />
      ),
    },
    
  ];


  if (apiData !== "user") {
    columns.push({
      title: t("settingsLikelihood.Action"),
      width: 150,
      key: "action",
      render: (text, record) => (
        <Space size="small">
          {apiData === "user" ? null : (
            <>
              <Button type="primary" onClick={() => showModal(record)}>
                {t("settingsLikelihood.Edit")}
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
                  {t("settingsLikelihood.Delete")}
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    })

  }

  // useEffect(() => {
  //   if (dataSourceQuery) {
  //     setDataSource(dataSourceQuery);
  //   }
  // }, [dataSourceQuery]);

  const addRow = async (formData) => {
    if (dataSourceQuery.length < matrixId) {
      try {
        // Create new data with incremented key
        const newData = {
          key: dataSourceQuery.length + 1,
          ...formData,
        };
        // Update the data on the server by refetching
        await refetch();
        message.success(t("settingsLikelihood.New_Likelihood_added"));
      } catch (error) {
        console.error("Error adding row:", error);
        message.error("Failed to add new likelihood.");
      }
    } else {
      message.warning(`You can't add more than ${matrixId} rows.`, 5);
    }
  };

  // modal

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const showModal = (record) => {
    setEditId(record.id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };
  const storedMatrixId = localStorage.getItem("modelId");
  // console.log("storedMatrixId", storedMatrixId);

  // console.log("dataSourceQuery", dataSourceQuery);

  const handleOk = async () => {
    const formData = form.getFieldsValue();
    setIsModalOpen(false);

    // post method for likelihood

    if (!editId) {
      if (dataSourceQuery.length < storedMatrixId) {
        try {
          const data = { userId: userId, verifyEmail: email, ...formData };
          // console.log("formdata:",formData);

          const apiUrl = "/api/risk-likelihood";

          const response = await axios.post(apiUrl, data, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            refetch();
            addRow(formData);
            const response = await axios.get("/api/basic-status");

            // Update the state with the fetched data
            setApiData(response.data);
          }
        } catch (error) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.errors
          ) {
            const errors = error.response.data.errors;
            // Check if there are errors for the 'relative' field
            if (errors.relative) {
              message.error(errors.relative[0]); // Display the first error message for 'relative' field
            }
            // Check if there are errors for the 'weight' field
            if (errors.weight) {
              message.error(errors.weight[0]); // Display the first error message for 'weight' field
            }
            // Check if there are errors for the 'color' field
            if (errors.color) {
              message.error(errors.color[0]); // Display the first error message for 'color' field
            }
            setTimeout(() => {
              message.destroy(); // Clear all messages after 3 seconds
            }, 4000);
          } else {
            console.error("Error updating data:", error);
            message.error(t("settingsLikelihood.Error_updating_record"));
          }
        }
      } else {
        message.warning(`You can't add more than ${matrixId} rows.`, 5);
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

        const apiUrl = `/api/update-risk-likelihood`;

        const response = await axios.post(apiUrl, data, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          refetch();
          message.success("Likelihood updated successfully.");
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const errors = error.response.data.errors;
          // Check if there are errors for the 'relative' field
          if (errors.relative) {
            message.error(errors.relative[0]); // Display the first error message for 'relative' field
          }
          // Check if there are errors for the 'weight' field
          if (errors.weight) {
            message.error(errors.weight[0]); // Display the first error message for 'weight' field
          }
          // Check if there are errors for the 'color' field
          if (errors.color) {
            message.error(errors.color[0]); // Display the first error message for 'color' field
          }
          setTimeout(() => {
            message.destroy(); // Clear all messages after 3 seconds
          }, 4000);
        } else {
          console.error("Error updating data:", error);
          message.error("An error occurred while updating the record.");
        }
      }
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <div>
      <div style={{ textAlign: "right" }}>
        <Button
          type="primary"
          style={{ marginBottom: "10px" }}
          onClick={showModal}
        >
          + {t("settingsLikelihood.Add")}
        </Button>
      </div>
      <Modal
        title="Likelihood"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form}>
          <Form.Item
            name="relative"
            label={t("settingsLikelihood.Relative_label")}
          >
            <Input placeholder={t("settingsLikelihood.Relative_placeholder")} />
          </Form.Item>
          <Form.Item
            name="description"
            label={t("settingsLikelihood.Description_label")}
          >
            <TextArea
              rows={4}
              placeholder={t("settingsLikelihood.Description_placeholder")}
            />
          </Form.Item>
          <Form.Item name="weight" label={t("settingsLikelihood.Weight_label")}>
            <Select
              defaultValue={t("settingsLikelihood.Weight_defaultValue")}
              onChange={handleChange}
              options={Array.from({ length: matrixId }, (_, i) => ({
                value: (i + 1).toString(),
                label: `Weight ${i + 1}`,
              }))}
            />
          </Form.Item>
          <Form.Item name="color" label={t("settingsLikelihood.Color_label")}>
            <Select
              defaultValue={t("settingsLikelihood.Color_defaultValue")}
              allowClear
              onChange={handleChange}
              options={[
                {
                  value: "008000",
                  label: "Green",
                },
                {
                  value: "FFFF00",
                  label: "Yellow",
                },
                {
                  value: "FFA500",
                  label: "Orange",
                },
                {
                  value: "FF0000",
                  label: "Red",
                },
                {
                  value: "8B0000",
                  label: "Dark Red",
                },
              ].filter((color, index) => index < matrixId)}
            />
          </Form.Item>
          {/* <Button
              type="primary"
              htmlType="submit"
            >
             Submit
            </Button> */}
        </Form>
      </Modal>
      {isLoading ? (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:"100px" }}>
        <Dots />
    </div>
      ) : (
      <Table
        dataSource={dataSourceQuery}
        pagination={false}
        columns={columns}
      />
      )}
    </div>
  );
};

export default Likelihood;
