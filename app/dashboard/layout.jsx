"use client";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  BarChart2,
  UserRoundPlus,
  ActivitySquare,
  Eye,
  Settings,
  LogOut,
  HelpCircle,
  UserCheck,
} from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  theme,
  Space,
  ConfigProvider,
} from "antd";
import Dashboard_Settings from "./components/Dashboard_Settings";
import Notification from "./components/Notification";
import Search from "./components/Search";
import { DarkModeProvider } from "./DarkModeContext";
import { MyProvider } from "@/provider/Context";
import { useTranslation } from "react-i18next";
import Logo from "./components/logo";
import Cookies from "js-cookie";
import axios from "axios";

const { Header, Sider, Content, Footer } = Layout;

export default function DashboardLayout({ children }) {
  const { t } = useTranslation();
  const [apiData, setApiData] = useState(null);
  const [optVerify, setOtpVerify] = useState("");
  const [domLoaded, setDomLoaded] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make an HTTP GET request to your API endpoint
        const response = await axios.get("/api/basic-status");

        // Update the state with the fetched data
       
          // Update the state with the fetched data
          setApiData(response.data);
          setOtpVerify(response.data.otp_verify);
        
      } catch (error) {
        console.log(error.response.data.message);
        // if (error.response.data.message === "Unauthenticated.") {
        //   // Redirect to the "/" page
        //   router.push("/");
        // }
        console.error("Error fetching data:", error);
        // You might want to handle errors here
      }
    };

    // Call the fetch function when the component mounts
    fetchData();
    setDomLoaded(true);
  }, []);

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const baseStyle = {
    paddingLeft: "20px",
    transition:
      "background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
  };

  const pathname = usePathname();

  // console.log("Current pathname:", pathname);
  const parts = pathname.split("/");

  // Get the last value
  const lastValue = parts[parts.length - 1];
  const last2value = parts[parts.length - 2];

  // Output the last value
  // console.log("Last value:", last2value, lastValue);

  // dark mode
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      // Check if running in a browser environment
      // Retrieve the mode from localStorage or default to false (light mode)
      return JSON.parse(localStorage.getItem("isDarkMode")) || false;
    }
    return false;
  });

  const handleLogout = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("authorization");
    const email = localStorage.getItem("verifyEmail");
    try {
      // Remove token from localStorage
      localStorage.removeItem("authorization");

      // Remove cookies

      // Make a POST request to your logout endpoint
      // await axios.post('/api/logout');
      const apiUrl = "/api/logout";

      const data = {
        verifyEmail: email,
        userId: userId,
        cookies: document.cookie,
      };

      const response = await axios.post(apiUrl, data, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        Cookies.remove("XSRF-TOKEN");
        Cookies.remove("nerim_session");

        // Redirect to login page
        router.push("/");
      }
    } catch (error) {
      // Handle any errors that occur during logout
      console.error("Logout failed:", error);
      // Optionally, you can still redirect to the login page even if the logout request fails
      // router.push("/");
    }
  };
  const handleClick = () => {
    setIsDarkMode((previousValue) => {
      // Toggle the mode
      const newMode = !previousValue;
      // Save the mode to localStorage
      localStorage.setItem("isDarkMode", JSON.stringify(newMode));
      return newMode;
    });
  };
  useEffect(() => {
    // Set the theme algorithm based on the current mode
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  let userName = "";
  if (typeof window !== "undefined") {
    // Access localStorage only if window is defined (i.e., in the browser)
    userName = localStorage.getItem("userName");
  }
  const items = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="/dashboard/account_info"
        >
          {userName}
        </a>
      ),
    },

    {
      key: "4",
      danger: true,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <MyProvider>
        <DarkModeProvider>
          <ConfigProvider
            theme={{
              algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
            }}
          >
            {domLoaded ? (
              <>
                
                  <Layout style={{ minHeight: "100vh", backgroundColor: "" }}>
                    <Sider
                      trigger={null}
                      collapsible
                      collapsed={collapsed}
                      style={{
                        position: "fixed",
                        height: "100%",
                        zIndex: 1,
                        justifyContent: "center" /* horizontally center */,
                        alignItems: "center",
                      }}
                    >
                      {/* Top of Sidebar - Image, Name, Subname */}
                      <div
                        style={{
                          padding: "16px",
                          textAlign: "center",
                          // color: "#191919",
                          backgroundColor: isDarkMode ? "#141414" : "#FFFFFF",
                        }}
                      >
                        {/* <img
                          src="/image/logo1.png"
                          alt="logo"
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            marginBottom: "8px",
                            marginTop: "20px",
                          }}
                        /> */}
                        <Logo />

                        {/* <h3 style={{ margin: "0", fontSize: "16px" }}>
    {user && user.name ? user.name : "Guest"}
  </h3> */}
                        <p
                          style={{
                            margin: "0",
                            fontSize: "12px",
                            color: isDarkMode ? "#FFFFFF" : "#000000",
                            marginBottom: "30px",
                          }}
                        >
                          {userName}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <Menu
                        // theme="light"
                        mode="inline"
                        // defaultSelectedKeys={["1"]}
                        style={{
                          minHeight: "100vh",
                          // background: "linear-gradient(to bottom, white, lightblue)"
                        }}
                        items={[
                          {
                            key: "1",
                            icon: <LayoutDashboard />,
                            label: t("side_navbar.dashboard"),
                            onClick: () => router.push("/dashboard"),
                            style: {
                              ...baseStyle,
                              background:
                                pathname === "/dashboard"
                                  ? "#4096FF"
                                  : "inherit",
                              color:
                                pathname === "/dashboard" ? "white" : "inherit",
                              boxShadow:
                                pathname === "/dashboard"
                                  ? "0 0 15px rgba(0, 0, 0, 0.5)"
                                  : "none",
                              transition:
                                pathname === "/dashboard"
                                  ? "background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease"
                                  : "none",
                            },
                            ":hover": {
                              transform:
                                pathname === "/dashboard"
                                  ? "translateY(-3px)"
                                  : "none",
                              background:
                                pathname === "/dashboard"
                                  ? "#3382CC"
                                  : "inherit", // Light blue on hover
                            },
                          },
                          {
                            key: "2",
                            icon: <UserRoundPlus />,
                            label: t("side_navbar.register"),
                            style: {
                              background:
                                pathname === "/dashboard/register" ||
                                pathname ===
                                  `/dashboard/register/tableData/${last2value}/${lastValue}` ||
                                pathname ===
                                  `/dashboard/register/edit/${lastValue}` ||
                                pathname === "/dashboard/register/add" ||
                                pathname ===
                                  `/dashboard/register/view/${lastValue}`
                                  ? "#4096FF"
                                  : "inherit",
                              color:
                                pathname === "/dashboard/register" ||
                                pathname ===
                                  `/dashboard/register/tableData/${last2value}/${lastValue}` ||
                                pathname ===
                                  `/dashboard/register/edit/${lastValue}` ||
                                pathname === "/dashboard/register/add" ||
                                pathname ===
                                  `/dashboard/register/view/${lastValue}`
                                  ? "white"
                                  : "inherit",
                              boxShadow:
                                pathname === "/dashboard/register" ||
                                pathname ===
                                  `/dashboard/register/tableData/${last2value}/${lastValue}` ||
                                pathname ===
                                  `/dashboard/register/edit/${lastValue}` ||
                                pathname === "/dashboard/register/add" ||
                                pathname ===
                                  `/dashboard/register/view/${lastValue}`
                                  ? "0 0 15px rgba(0, 0, 0, 0.5)"
                                  : "none",
                            },
                            ":hover": {
                              background:
                                pathname === "/dashboard/register" ||
                                pathname ===
                                  `/dashboard/register/tableData/${last2value}/${lastValue}` ||
                                pathname ===
                                  `/dashboard/register/edit/${lastValue}` ||
                                pathname === "/dashboard/register/add" ||
                                pathname ===
                                  `/dashboard/register/view/${lastValue}`
                                  ? "#3382CC"
                                  : "inherit", // Light blue on hover
                            },
                            onClick: () => router.push("/dashboard/register"),
                          },
                          {
                            key: "3",
                            icon: <BarChart2 />,
                            label: t("side_navbar.risk_treatment"),
                            style: {
                              background:
                                pathname === "/dashboard/risk_treatment" ||
                                pathname ===
                                  `/dashboard/risk_treatment/view/${lastValue}`
                                  ? "#4096FF"
                                  : "inherit",
                              color:
                                pathname === "/dashboard/risk_treatment" ||
                                pathname ===
                                  `/dashboard/risk_treatment/view/${lastValue}`
                                  ? "white"
                                  : "inherit",
                              boxShadow:
                                pathname === "/dashboard/risk_treatment" ||
                                pathname ===
                                  `/dashboard/risk_treatment/view/${lastValue}`
                                  ? "0 0 15px rgba(0, 0, 0, 0.5)"
                                  : "none",
                            },
                            ":hover": {
                              background:
                                pathname === "/dashboard/risk_treatment" ||
                                pathname ===
                                  `/dashboard/risk_treatment/view/${lastValue}`
                                  ? "#3382CC"
                                  : "inherit", // Light blue on hover
                            },
                            onClick: () =>
                              router.push("/dashboard/risk_treatment"),
                          },
                          {
                            key: "4",
                            icon: <ActivitySquare />,
                            label: t("side_navbar.heat_map"),
                            style: {
                              background:
                                pathname === "/dashboard/heat_map"
                                  ? "#4096FF"
                                  : "inherit",
                              color:
                                pathname === "/dashboard/heat_map"
                                  ? "white"
                                  : "inherit",
                              boxShadow:
                                pathname === "/dashboard/heat_map"
                                  ? "0 0 15px rgba(0, 0, 0, 0.5)"
                                  : "none",
                            },
                            onClick: () => router.push("/dashboard/heat_map"),
                          },
                          {
                            key: "5",
                            icon: <User />,
                            label: t("side_navbar.users"),
                            style: {
                              background:
                                pathname === "/dashboard/users"
                                  ? "#4096FF"
                                  : "inherit",
                              color:
                                pathname === "/dashboard/users"
                                  ? "white"
                                  : "inherit",
                              boxShadow:
                                pathname === "/dashboard/users"
                                  ? "0 0 15px rgba(0, 0, 0, 0.5)"
                                  : "none",
                            },
                            onClick: () => router.push("/dashboard/users"),
                          },
                          {
                            key: "6",
                            icon: <Eye />,
                            label: t("side_navbar.audit"),
                            style: {
                              background:
                                pathname === "/dashboard/audit"
                                  ? "#4096FF"
                                  : "inherit",
                              color:
                                pathname === "/dashboard/audit"
                                  ? "white"
                                  : "inherit",
                              boxShadow:
                                pathname === "/dashboard/audit"
                                  ? "0 0 15px rgba(0, 0, 0, 0.5)"
                                  : "none",
                            },
                            onClick: () => router.push("/dashboard/audit"),
                          },
                          // {
                          //   key: "7",
                          //   icon: <BarChart2 />,
                          //   label: "States Menu",
                          //   style: {
                          //     background:
                          //       pathname === "/dashboard/profile"
                          //         ? "#4096FF"
                          //         : "inherit",
                          //     color:
                          //       pathname === "/dashboard/profile"
                          //         ? "white"
                          //         : "inherit",
                          //     boxShadow:
                          //       pathname === "/dashboard/profile"
                          //         ? "0 0 15px rgba(0, 0, 0, 0.5)"
                          //         : "none",
                          //   },
                          //   onClick: () => router.push("/dashboard/profile"),
                          // },
                          {
                            key: "8",
                            icon: <Settings />,
                            label: t("side_navbar.settings"),
                            style: {
                              background:
                                pathname === "/dashboard/settings"
                                  ? "#4096FF"
                                  : "inherit",
                              color:
                                pathname === "/dashboard/settings"
                                  ? "white"
                                  : "inherit",
                              boxShadow:
                                pathname === "/dashboard/settings"
                                  ? "0 0 15px rgba(0, 0, 0, 0.5)"
                                  : "none",
                            },
                            onClick: () => router.push("/dashboard/settings"),
                          },
                          {
                            key: "9",
                            icon: <UserCheck />,
                            label: t("side_navbar.account_info"),
                            style: {
                              background:
                                pathname === "/dashboard/account_info"
                                  ? "#4096FF"
                                  : "inherit",
                              color:
                                pathname === "/dashboard/account_info"
                                  ? "white"
                                  : "inherit",
                              boxShadow:
                                pathname === "/dashboard/account_info"
                                  ? "0 0 15px rgba(0, 0, 0, 0.5)"
                                  : "none",
                            },
                            onClick: () =>
                              router.push("/dashboard/account_info"),
                          },
                          {
                            key: "11",
                            icon: <HelpCircle />,
                            label: t("side_navbar.Help"),
                            // style: {
                            //   background:
                            //     pathname === "/dashboard/account_info"
                            //       ? "#4096FF"
                            //       : "inherit",
                            //   color:
                            //     pathname === "/dashboard/account_info"
                            //       ? "white"
                            //       : "inherit",
                            //   boxShadow:
                            //     pathname === "/dashboard/account_info"
                            //       ? "0 0 15px rgba(0, 0, 0, 0.5)"
                            //       : "none",
                            // },
                            onClick: () =>
                              router.push("https://nnurcloud.com/support/"),
                          },
                          {
                            key: "10",
                            icon: <LogOut />,
                            label: t("side_navbar.logout"),
                            style: {
                              background:
                                pathname === "/dashboard/profile"
                                  ? "#4096FF"
                                  : "inherit",
                              color:
                                pathname === "/dashboard/profile"
                                  ? "white"
                                  : "inherit",
                              boxShadow:
                                pathname === "/dashboard/profile"
                                  ? "0 0 15px rgba(0, 0, 0, 0.5)"
                                  : "none",
                            },
                            onClick: handleLogout,
                          },
                        ]}
                      />
                    </Sider>
                    <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
                      <Header
                        style={{
                          padding: 0,
                          background: isDarkMode ? "#141414" : colorBgContainer,
                          position: "fixed",
                          width: "100%",
                          zIndex: 2,
                          height: "8vh",
                          justifyContent: "center" /* horizontally center */,
                          alignItems: "center",
                          boxShadow: "0px 1px 0px 0px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Button
                          breakpoint="lg"
                          collapsedWidth="0"
                          onBreakpoint={(broken) => {
                            console.log(broken);
                          }}
                          onCollapse={(collapsed, type) => {
                            console.log(collapsed, type);
                          }}
                          type="text"
                          icon={
                            collapsed ? (
                              <MenuUnfoldOutlined />
                            ) : (
                              <MenuFoldOutlined />
                            )
                          }
                          onClick={() => setCollapsed(!collapsed)}
                          style={{
                            fontSize: "20px",
                            width: 44,
                            height: 64,
                            marginTop: "8px",
                          }}
                        />

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px",
                            marginRight: "200px",
                            marginTop: "-80px",
                          }}
                        >
                          <Space
                            style={{
                              marginLeft: "50px",
                              // marginBottom: "10px",
                            }}
                          >
                            <Search />
                          </Space>

                          <Space
                            wrap
                            style={{
                              marginRight: "50px",
                              // marginTop: "-12px",
                              gap: "20px",
                            }}
                          >
                            <Notification />
                            <Dashboard_Settings
                              isDarkMode={isDarkMode}
                              handleClick={handleClick}
                            />
                          </Space>
                        </div>
                      </Header>
                      <Content
                        style={{
                          margin: "84px 16px 24px",
                          padding: 24,
                          minHeight: 280,
                          background: isDarkMode ? "#000000" : colorBgContainer,
                        }}
                      >
                        {children}
                      </Content>
                      <Footer
                        style={{
                          textAlign: "center",
                          // backgroundColor: "#f0f2f5", 
                          color: "#333", // Adjust text color as needed
                          padding: "10px", // Adjust padding as needed
                        }}
                      >
                        nErim v0.0.0.01 ©{new Date().getFullYear()} Created by{" "}
                        <span style={{ color: "#4096FF", fontWeight: "bold" }}>
                          Alo It Consultant
                        </span> 
                      </Footer>
                    </Layout>
                    {/* <DashboardFooter /> */}
                  </Layout>
               
              </>
            ) : (
              <></> // Render nothing until the DOM is loaded
            )}
          </ConfigProvider>
        </DarkModeProvider>
      </MyProvider>
    </>
  );
}
