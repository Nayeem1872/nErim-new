"use client";
import { useContext, useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  FloatButton,
  message,
  Result,
  Row,
} from "antd";
import axios from "axios";
import Stacked from "./Stacked";
import Pie from "./Pie";
import Tree from "./Tree";
import Dashboard_Table from "./Dashboard_Table";
import { LayoutDashboard } from "lucide-react";
import MyContext from "@/provider/Context";
import { useTranslation } from "react-i18next";
import BarChart from "./BarChart";
import { useRouter } from "next/navigation";
const gridStyle = {
  width: "100%",
  textAlign: "center",
  borderRadius: "10px",
};

const Dashboard = ({ isDarkMode, handleClick }) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState("basic");
  const { value, updateValue } = useContext(MyContext);
  const [apiData, setApiData] = useState(null);
  const router = useRouter();

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

  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
  };

  const token = localStorage.getItem("authorization");

  return (
    <>
      <h1>{t("dashboard.Dashboard")}</h1>
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
            title: t("dashboard.Dashboard"),
          },
        ]}
      />
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
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Dashboard_Table />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <div style={{ margin: "10px" }}>
                <Card>
                  <Card.Grid style={gridStyle}>
                    <BarChart />
                  </Card.Grid>
                </Card>
              </div>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Stacked />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Pie isDarkMode={isDarkMode} handleClick={handleClick} />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Tree />
            </Col>
          </Row>
        </>
      )}
      <FloatButton.BackTop />
    </>
  );
};

export default Dashboard;
