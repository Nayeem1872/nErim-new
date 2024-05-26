"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Space, Table, Select, message } from "antd";
import { useTranslation } from "react-i18next";
const { Option } = Select;
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Dots from "../../components/DotLoader";

const Currency = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const token = localStorage.getItem("authorization");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  // get request

  const { data: dataSourceQuery,isLoading, refetch } = useQuery({
    queryKey: ["currency"],
    queryFn: async () => {
      const response = await axios.get(`/api/get-risk-currency`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return [response.data.riskCurrencyData];
    },
    staleTime: 1000 * 60 * 60 * 1,
  });
  // console.log("Status data:", dataSourceQuery);

  function decodeHTMLEntities(text) {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = text;
    return tempElement.textContent || tempElement.innerText || "";
  }
  const [apiData, setApiData1] = useState(null);

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

  // Show currency

  let columns = [
    {
      title: t("settingsCurrency.Country_Name"),
      dataIndex: "key_value3",
      key: "key_value3",
    },
    {
      title: t("settingsCurrency.Currency"),
      dataIndex: "key_value",
      key: "key_value",
    },
    {
      title: t("settingsCurrency.Symbol"),
      dataIndex: "key_value2",
      key: "key_value2",
      render: (text, record) => decodeHTMLEntities(`&#${record.key_value2}`),
    },
  ];
  
  // Conditionally include the Edit column based on apiData
  if (apiData !== "user") {
    columns.push({
      title: t("settingsCurrency.Edit"),
      key: "action",
      render: (text, record) => (
        <Space size="small">
          <Button type="primary" onClick={() => showModal(record)}>
            {t("settingsCurrency.Edit")}
          </Button>
        </Space>
      ),
    });
  }

  // modal

  const showModal = (record) => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setIsModalOpen(false);

    // edit
    try {
      const data = {
        currency: selectedValue,
      };
      console.log("formdata:", data);

      const apiUrl = `/api/update-risk-currency`;

      const response = await axios.post(apiUrl, data, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        refetch();
        message.success(t("settingsCurrency.Currency_updated_successfully"));
      }
    } catch (error) {
      console.error("Error updating data:", error);
      message.error(
        t("settingsCurrency.An_error_occurred_while_updating_the_record")
      );
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange = (value) => {
    setSelectedValue(value);
    console.log(`Selected: ${value}`);
  };

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <Modal
          centered
          title={t("settingsCurrency.Currency")}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form.Item label={t("settingsCurrency.Currency")}>
            <Select
              defaultValue="Select Currency"
              onChange={handleChange}
              value={selectedValue}
            >
              <Option value="">{t("settingsCurrency.Select_Currency")}</Option>
              <Option value="USD,36,United States Dollar">
                United States Dollar - $
              </Option>
              <Option value="EUR,8364,Euro">Euro - €</Option>
              <Option value="NOK,107r,Norwegian Krone">
                Norwegian Krone - kr
              </Option>
              <Option value="SEK,107r,Swedish Krona">Swedish Krona - kr</Option>
              <Option value="UGX,8598,Ugandan Shilling">
                Ugandan Shilling - ↖
              </Option>
              <Option value="ZAR,82,South African Rand">
                South African Rand - R
              </Option>
              <Option value="EGP,163,Egyptian Pound">Egyptian Pound - £</Option>
              <Option value="JPY,165,Japanese Yen">Japanese Yen - ¥</Option>
              <Option value="GBP,163,British Pound Sterling">
                British Pound Sterling - £
              </Option>
              <Option value="AUD,36,Australian Dollar">
                Australian Dollar - $
              </Option>
              <Option value="CAD,36,Canadian Dollar">
                Canadian Dollar - $
              </Option>
              <Option value="CNY,165,Chinese Yuan">Chinese Yuan - ¥</Option>
              <Option value="NZD,36,New Zealand Dollar">
                New Zealand Dollar - $
              </Option>
              <Option value="MXN,36,Mexican Peso">Mexican Peso - $</Option>
              <Option value="SGD,36,Singapore Dollar">
                Singapore Dollar - $
              </Option>
              <Option value="HKD,36,Hong Kong Dollar">
                Hong Kong Dollar - $
              </Option>
              <Option value="KRW,8361,South Korean Won">
                South Korean Won - ₩
              </Option>
              <Option value="TRY,8378,Turkish Lira">Turkish Lira - ₺</Option>
              <Option value="INR,8377,Indian Rupee">Indian Rupee - ₹</Option>
              <Option value="BRL,82;36,Brazilian Real">
                Brazilian Real - R$
              </Option>
              <Option value="ZAR,82,South African Rand">
                South African Rand - R
              </Option>
              <Option value="RUB,8381,Russian Ruble">Russian Ruble - ₽</Option>
            </Select>
          </Form.Item>
        </Modal>
      </div>
      {isLoading ? (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:"100px" }}>
        <Dots />
    </div>
      ) : (
      <Table dataSource={dataSourceQuery} columns={columns} pagination={false} />
      )}
    </div>
  );
};

export default Currency;
