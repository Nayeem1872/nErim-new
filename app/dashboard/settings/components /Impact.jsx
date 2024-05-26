"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Table,
  Form,
  Input,
  Select,
  ColorPicker,
  Popconfirm,
  message,
  Modal,
} from "antd";

import { useTranslation } from "react-i18next";

import axios from "axios";
import Dots from "../../components/DotLoader";

const Impact = ({ setApiData }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [apiData, setApiData1] = useState(null);
  const [color, setColor] = useState();
  const [matrixId, setMatrixId] = useState(0);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState();
  const email = localStorage.getItem("verifyEmail");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authorization");
  useEffect(() => {
    const storedMatrixId = localStorage.getItem("modelId");
    if (storedMatrixId) {
      setMatrixId(parseInt(storedMatrixId));
    }
  }, []);

  // console.log("Props",props);
  const { data: dataSourceQuery,  isLoading, refetch } = useQuery({
    queryKey: ["RiskImpactTable"],
    queryFn: async () => {
      const response = await axios.get(`/api/get-risk-impact`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("data", response);
      if (response.data.impactData.length > 0) {
        // Extracting colors from all items in impactData
        const colors = response.data.impactData.map((item) => item.color);
        // Assuming setColor is a state setter function
        setColor(colors); // Set color to the array of colors
      }
      return response.data.impactData;
    },
    staleTime: 1000 * 60 * 60 * 1,
  });

  useEffect(()=>{
    const fetchData = async () => {
      try {
        // Make an HTTP GET request to your API endpoint
        const response = await axios.get('/api/basic-status');

        // Update the state with the fetched data
        setApiData1(response.data.is_admin);
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
      title: t("settingsImpact.Impact"),
      dataIndex: "relative",
    },

    { title: t("settingsImpact.Criteria"), dataIndex: "criteria" },
    {
      title: t("settingsImpact.Weight"),
      dataIndex: "weight",
    },
    {
      title: t("settingsImpact.Color"),
      dataIndex: "color",
      key: "color",
      render: (text, record) => (
        <ColorPicker value={record?.color} showText disabled />
      ),
    },
  ];

  if (apiData !== "user") {
    columns.push({
      title: t("settingsImpact.Action"),
      width: 150,
      key: "action",
      render: (text, record) => (
        apiData === "user" ? null : (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Button type="primary" onClick={() => showModal(record)}>
              {t("settingsImpact.Edit")}
            </Button>
            <Popconfirm
              // title={t("settingsImpact.Delete_the_task")}
              title={`Dependency ${record?.dependency}`}
              description={
                <>
                  Deleting this item will result in the removal of its {record?.dependency} associated <br /> dependent risk indices. After deletion, you will <br /> need to manually assign the appropriate   risk matrix to each <br /> corresponding risk index.
              
                  <br />
                <strong>Are you sure you want to delete?</strong>  
                </>
              }
              visible={open === record?.id} // Changed open to visible
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
                {t("settingsImpact.Delete")}
              </Button>
            </Popconfirm>
          </div>
        )
      ),


    })

  }
 
  // Post and Edit(Post) Request

  // useEffect(() => {
  //   if (dataSourceQuery) {
  //     setDataSource(dataSourceQuery);
  //   }
  // }, [dataSourceQuery]);

  
const addRow = async (formData) => {
  if (dataSourceQuery.length < matrixId) {
    try {
      const newData = {
        key: dataSourceQuery.length + 1,
        ...formData,
      };
      // Update the data on the server by refetching
      await refetch();
      message.success(t("settingsImpact.New_Likelihood_added"));
    } catch (error) {
      console.error("Error adding row:", error);
      message.error("Failed to add new row.");
    }
  } else {
    message.warning(`You can't add more than ${matrixId} rows.`, 5);
  }
};

  // modal

  const [editId, setEditId] = useState();

  const showModal = (record) => {
    setEditId(record.id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };
  const storedMatrixId = localStorage.getItem("modelId");
  const cancel = (e) => {
    // console.log(e);
    setOpen(false);
    message.error(t("settingsImpact.Canceled"));
  };

  // modal
  const handleOk = async () => {
    const formData = form.getFieldsValue();
    setIsModalOpen(false);

    // post method for likelihood

    if (!editId) {
      if (dataSourceQuery.length < storedMatrixId) {
        try {
          const data = { userId: userId, verifyEmail: email, ...formData };
          console.log("formdata:", data);

          const apiUrl = "/api/risk-impact";

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

          // console.log("response",response.data);
        } catch (error) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.errors
          ) {
            const errors = error.response.data.errors;

            if (errors.relative) {
              message.error(errors.relative[0]);
            }

            if (errors.weight) {
              message.error(errors.weight[0]);
            }

            if (errors.color) {
              message.error(errors.color[0]);
            }

            setTimeout(() => {
              message.destroy();
            }, 4000);
          } else {
            message.error(t("settingsImpact.Error_updating_record"));
          }
        }
      } 
      else {
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
        // console.log("formdata:", data);

        const apiUrl = `/api/update-risk-impact`;

        const response = await axios.post(apiUrl, data, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          refetch();
          message.success(t("settingsImpact.Risk_Impact_updated_successfully"));
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const errors = error.response.data.errors;

          if (errors.relative) {
            message.error(errors.relative[0]);
          }

          if (errors.weight) {
            message.error(errors.weight[0]);
          }

          if (errors.color) {
            message.error(errors.color[0]);
          }
          setTimeout(() => {
            message.destroy();
          }, 4000);
        } else {
          console.error("Error updating data:", error);
          message.error(t("settingsImpact.Error_updating_record"));
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
  // Delete Request
  const showPopconfirm = (record) => {
    setOpen(record?.id);
    setId(record?.id);
  };

  const confirm = async (e) => {
    setConfirmLoading(true);
    try {
      const response = await axios.delete(`/api/delete-risk-impact/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response);
      if (response.status === 200) {
        refetch();
   
        const response = await axios.get("/api/basic-status");

        // Update the state with the fetched data
          setApiData(response.data);
        console.log("Child Component - setApiData:", setApiData);

        setOpen(false);
        setConfirmLoading(false);
        message.success(t("settingsImpact.Impact_deleted_successfully"));
      } else {
        setOpen(false);
        setConfirmLoading(false);

        message.error(t("settingsImpact.Failed_to_delete_record"));
      }
    } catch (error) {
      setOpen(false);
      setConfirmLoading(false);

      message.error(t("settingsImpact.Error_deleting_record"));
    }
  };

  return (
    <>
      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        <Button type="primary" onClick={showModal}>
          + {t("settingsImpact.Add")}
        </Button>
        <Modal
          title={t("settingsImpact.Risk_Impact_Modal_title")}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form}>
            <Form.Item name="relative" label={t("settingsImpact.Relative_label")}>
              <Input placeholder={t("settingsImpact.Relative_placeholder")} />
            </Form.Item>
            <Form.Item name="criteria" label={t("settingsImpact.Criteria_label")}>
              <Input placeholder={t("settingsImpact.Criteria_placeholder")} />
            </Form.Item>
            <Form.Item name="weight" label={t("settingsImpact.Weight_label")}>
              <Select
                defaultValue={t("settingsImpact.Weight_defaultValue")}
                onChange={handleChange}
                options={Array.from({ length: matrixId }, (_, i) => ({
                  value: (i + 1).toString(),
                  label: `Weight ${i + 1}`,
                }))}
              />
            </Form.Item>
            <Form.Item name="color" label={t("settingsImpact.Color_label")}>
              <Select
                defaultValue={t("settingsImpact.Color_defaultValue")}
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
          </Form>
        </Modal>
      </div>
      {isLoading ? (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:"100px" }}>
        <Dots />
    </div>
      ) : (
        <Table bordered columns={columns} dataSource={dataSourceQuery} pagination={false} />
      )}
    </>
  );
};

export default Impact;
