"use client";
import React, { useEffect, useState } from "react";
const { Title, Text } = Typography;
import {
  Modal,
  Button,
  Typography,
  Flex,
  Alert,
  Tabs,
  Breadcrumb,
  Divider,
  Radio,
} from "antd";
import axios from "axios";
import Impact from "./components /Impact";
import Likelihood from "./components /Likelihood";
import Valuation from "./components /Valuation";
import Status from "./components /Status";
import Category from "./components /Category";
import Currency from "./components /Currency";
import Risk_Apatite from "./components /Risk_Apatite";
import Backup from "./components /Backup";
import { useTranslation } from "react-i18next";
import { LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { WarningFilled } from "@ant-design/icons";

const Settings = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState(3);
  const [fieldsAdded, setFieldsAdded] = useState(0);
  const [matrixOptionsSelected, setMatrixOptionsSelected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiData, setApiData] = useState(null);
  //
  const email = localStorage.getItem("verifyEmail");
  const token = localStorage.getItem("authorization");

  const handleRadioChange = async (e) => {
    setSelectedValue(e.target.value);
    setFieldsAdded(0);
    setMatrixOptionsSelected(true);
  };
  // console.log("Radion select:", selectedValue);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setIsModalOpen(false);
    setMatrixOptionsSelected(true);
    try {
      const data = { modelId: selectedValue, verifyEmail: email };

      const apiUrl = "/api/choise-model";

      const response = await axios.post(apiUrl, data, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("Data:", response.data);

      localStorage.setItem("modelId", response.data.modelId);

      // Do something with the response if needed
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };
  const matrixId = localStorage.getItem("modelId");

  const handleCancel = () => {
    setIsModalOpen(false);
    setMatrixOptionsSelected(false);
  };
  // const fetchData = async () => {
  //   try {
  //     // Make an HTTP GET request to your API endpoint
  //     const response = await axios.get("/api/basic-status");

  //     // Update the state with the fetched data
  //     setApiData(response.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     // You might want to handle errors here
  //   }
  // };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/basic-status");
        setApiData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    // Fetch data only if it hasn't been fetched yet
    if (!apiData) {
      fetchData();
    }
  }, [apiData]);



  console.log("Parent Component - setApiData:", apiData);
  const [tabPosition, setTabPosition] = useState("left");
  const items = [
    {
      key: "1",
      label: (
        <>
          {t("settings.RiskImpact")}
          {apiData?.impactStatus === false && (
            <WarningFilled style={{ marginLeft: "15px", color: "red" }} />
          )}
        </>
      ),
      children: <Impact setApiData={setApiData} />,
    },
    {
      key: "2",
      label: 
      (
        <>
        {t("settings.RiskLikelihood")}
        {apiData?.likelihoodStatus === false && (
            <WarningFilled style={{ marginLeft: "15px", color: "red" }} />
          )}
        </>

      ),
      children: <Likelihood setApiData={setApiData} />,
    },
    {
      key: "3",
      label: 
      (
        <>
        {t("settings.RiskValuation")}
        {apiData?.matrixStatus === false && (
            <WarningFilled style={{ marginLeft: "15px", color: "red" }} />
          )}
        </>

      ),
      children: <Valuation  setApiData={setApiData}/>,
    },
    {
      key: "4",
      label: t("settings.RiskStatus"),
      children: <Status />,
    },
    {
      key: "5",
      label: t("settings.RiskCategory"),
      children: <Category />,
    },
    {
      key: "6",
      label: t("settings.Currency"),
      children: <Currency />,
    },
    {
      key: "7",
      label: t("settings.RiskAppetite"),
      children: <Risk_Apatite />,
    },
    {
      key: "8",
      label: t("settings.Backup"),
      children: <Backup />,
    },
  ];

  return (
    <>
      <Title level={2}>{t("settings.Settings")}</Title>
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
            title: t("settings.SettingsPage"),
          },
        ]}
      />
      <Divider />
      {/* Modal Funtioncality */}
      <>
        {matrixId ? (
          // Render content based on formValues
          <div>
            <Text code>
              {t("settings.Choose")}
              {JSON.stringify(matrixId, null, 2)}
            </Text>

            <Divider />
            <Tabs tabPosition={tabPosition} defaultActiveKey="" items={items} />
          </div>
        ) : (
          // Render form and button if formValues is null
          <>
            {!matrixOptionsSelected && !isModalOpen && (
              <div style={{ marginBottom: "20px" }}>
                <Button type="primary" onClick={showModal}>
                  {t("settings.OpenMatrixModal")}
                </Button>
              </div>
            )}
            <Modal
              title={t("settings.Matrix_Modal")}
              visible={isModalOpen}
              centered
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <Flex vertical>
                <Alert
                  message={t("settings.This_action")}
                  type="warning"
                  showIcon
                />
                <div style={{ marginBottom: "20px", marginTop: "20px" }}>
                  <Radio.Group
                    onChange={handleRadioChange}
                    value={selectedValue}
                  >
                    <Radio value={3}>3X3</Radio>
                    <Radio value={4}>4x4</Radio>
                    <Radio value={5}>5x5</Radio>
                  </Radio.Group>
                </div>
              </Flex>
            </Modal>
            {matrixOptionsSelected && !isModalOpen && (
              <>
                <Text code>
                  {t("settings.You_have_choose_the_Matrix_model")}
                  {JSON.stringify(matrixId, null, 2)}
                </Text>
                <Tabs
                  tabPosition={tabPosition}
                  defaultActiveKey=""
                  items={items}
                />
              </>
            )}
          </>
        )}
      </>
    </>
  );
};

export default Settings;
