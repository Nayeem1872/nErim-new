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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Dots from "../../components/DotLoader";

const Valuation = ({ setApiData }) => {
  const { t } = useTranslation();
  const [matrixId, setMatrixId] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const token = localStorage.getItem("authorization");
  const { data: dataSourceQuery,isLoading, refetch } = useQuery({
    queryKey: ["valuation"],
    queryFn: async () => {
      const response = await axios.get(`/api/get-risk-valuation`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.riskValuationData;
    },
    staleTime: 1000 * 60 * 60 * 1,
  });
  // delete
  const showPopconfirm = (record) => {
    setId(record?.id);
    setOpen(record?.id);
  };
  // console.log("id", id);

  const confirm = async (e) => {
    setConfirmLoading(true);
    try {
      // Make a DELETE request to your backend API
      const response = await axios.delete(`/api/delete-risk-valuation/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);

      // Check if the deletion was successful
      if (response.status === 200) {
        refetch();
        const response = await axios.get("/api/basic-status");

        // Update the state with the fetched data
        setApiData(response.data);
        setOpen(false);
        setConfirmLoading(false);
        // console.log(response.data); // Log response data if needed
        message.success("Risk valuation has deleted successfully.");
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
      title: t("settingsValuation.Range"),
      dataIndex: "range",
      key: "range",
    },
    {
      title: t("settingsValuation.Critical"),
      dataIndex: "critical_step",
      key: "critical_step",
    },
    {
      title: t("settingsValuation.Rating"),
      dataIndex: "rating_step",
      key: "rating_step",
    },
    {
      title: t("settingsValuation.action_priority"),
      dataIndex: "action_priority",
      key: "action_priority",
    },
    {
      title: t("settingsValuation.color"),
      dataIndex: "color",
      key: "color",
      render: (text, record) => (
        <ColorPicker value={record?.color} showText disabled />
      ),
    },
  ];

  if (apiData !== "user") {
    columns.push({
      title: t("settingsValuation.Action"),
      width: 150,
      key: "action",
      render: (text, record) => (
        <Space size="small">
          {apiData === "user" ? null : (
            <>
              <Button type="primary" onClick={() => showModal(record)}>
                {t("settingsValuation.Edit")}
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
                // okButtonProps={{
                //   loading: confirmLoading,
                // }}
              >
                <Button
                  danger
                  type="default"
                  onClick={() => showPopconfirm(record)}
                >
                  {t("settingsValuation.Delete")}
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
  //     // message.success(`New Valuation added!`);
  //   } else {
  //     message.warning(`You can't add more than ${matrixId} rows.`, 5);
  //   }
  // };

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
        // message.success(t("settingsLikelihood.New_Likelihood_added"));
      } catch (error) {
        console.error("Error adding row:", error);
        message.error("Failed to add new likelihood.");
      }
    } else {
      message.warning(`You can't add more than ${matrixId} rows.`, 5);
    }
  };
  // modal

  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = (record) => {
    setEditId(record.id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };
  const storedMatrixId = localStorage.getItem("modelId");

  const handleOk = async () => {
    const formData = form.getFieldsValue();
    setIsModalOpen(false);

    // post request

    if (!editId) {
      if (dataSourceQuery.length < storedMatrixId) {
        try {
          const data = { ...formData };

          const apiUrl = "/api/risk-valuation";

          const response = await axios.post(apiUrl, data, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            const response = await axios.get("/api/basic-status");

            // Update the state with the fetched data
            setApiData(response.data);
            addRow(formData);
            refetch();
            message.success("New Risk Valuation Added!"); // Show success message from response
          } else {
            message.error(response.data); // Show generic error message
          }
        } catch (error) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.errors
          ) {
            const errors = error.response.data.errors;
            // Check if there are errors for the 'range' field
            if (errors.range) {
              message.error(errors.range[0]); // Display the first error message for 'range' field
            }
            // Check if there are errors for the 'critical_step' field
            if (errors.critical_step) {
              message.error(errors.critical_step[0]); // Display the first error message for 'critical_step' field
            }
            // Check if there are errors for the 'rating_step' field
            if (errors.rating_step) {
              message.error(errors.rating_step[0]); // Display the first error message for 'rating_step' field
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
      } else {
        message.warning(`You can't add more than ${matrixId} rows.`, 5);
      }
    } else {
      try {
        console.log("object:", {
          id: editId,
          ...formData,
        });
        const data = {
          ...formData,
          id: editId,
        };
        console.log("formdata:", data);

        const apiUrl = `/api/update-risk-valuation`;

        const response = await axios.post(apiUrl, data, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          refetch();
          // If update is successful, update the dataSource
          // const updatedData = dataSource.map((item) =>
          //   item.id === editId ? { ...item, ...formData } : item
          // );
          // setDataSource(updatedData);
          message.success("Updated Successfully");
        } else {
          message.error(response.data);
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const errors = error.response.data.errors;
          // Check if there are errors for the 'range' field
          if (errors.range) {
            message.error(errors.range[0]); // Display the first error message for 'range' field
          }
          // Check if there are errors for the 'critical_step' field
          if (errors.critical_step) {
            message.error(errors.critical_step[0]); // Display the first error message for 'critical_step' field
          }
          // Check if there are errors for the 'rating_step' field
          if (errors.rating_step) {
            message.error(errors.rating_step[0]); // Display the first error message for 'rating_step' field
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
    <>
      <div>
        <div style={{ textAlign: "right" }}>
          <Button
            type="primary"
            style={{ marginBottom: "10px" }}
            onClick={showModal}
          >
            + {t("settingsValuation.Add")}
          </Button>
        </div>
        <Modal
          title="Valuation"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form}>
            <Form.Item name="range" label="Range">
              <Input placeholder="Example 1-5" />
            </Form.Item>
            <Form.Item name="critical_step" label="Criticality">
              <Input placeholder="Input Criticality" />
            </Form.Item>
            <Form.Item name="rating_step" label="Rating">
              <Input placeholder="Input Ration" />
            </Form.Item>
            <Form.Item name="action_priority" label="Priority">
              <Input placeholder="Input Priority" />
            </Form.Item>
            <Form.Item name="color" label="Color">
              <Select
                defaultValue="Select Color"
                allowClear
                onChange={handleChange}
                options={[
                  {
                    value: "#008000",
                    label: "Green",
                  },
                  {
                    value: "#FFFF00",
                    label: "Yellow",
                  },
                  {
                    value: "#FFA500",
                    label: "Orange",
                  },
                  {
                    value: "#FF0000",
                    label: "Red",
                  },
                  {
                    value: "#8B0000",
                    label: "Dark Red",
                  },
                ].filter((color, index) => index < matrixId)}
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

export default Valuation;
