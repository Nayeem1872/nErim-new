"use client";
import { useEffect, useState } from "react";
import SignIn from "./auth/signin/page";
import { Layout, Card } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import axios from "axios";
const ForgotPassword = dynamic(() => import("./auth/forgotPassword/page"));

const { Footer, Content } = Layout;
export default function Home() {
  const router = useRouter();
  const [signInUp, setSignInUp] = useState("signin");

  const changeSigninUp = () => {
    if (signInUp === "signin") {
      setSignInUp("forgotPassword");
    } else {
      setSignInUp("signin");
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make an HTTP GET request to your API endpoint
        const response = await axios.get("/api/basic-status");
        if (response.status === 200) {
          // Redirect to the "/" page
          router.push("/dashboard");
          // window.location.reload();
        }
      } catch (error) {
        console.log(error.response.data.message);
      
        console.error("Error fetching data:", error);
        // You might want to handle errors here
      }
    };

    // Call the fetch function when the component mounts
    fetchData();
  
  }, []);

  return (
    <>
      <div className="layout-default ant-layout layout-sign-up">
        <Content className="p-0">
          <div className="sign-up-header">
            <div className="content text"></div>
          </div>

          <Card
            className="card-signup header-solid h-full ant-card pt-0"
            bordered={false}
          >
            <img
              src="/image/logo1.png"
              alt="logo"
              style={{
                width: "270px", // Adjust the width as per your requirement
                height: "170px", // Adjust the height as per your requirement
                borderRadius: "50%",
                marginBottom: "8px",
                marginTop: "20px",
                display: "block", // Center the image horizontally
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />
            {signInUp === "signin" ? <SignIn /> : <ForgotPassword />}

            <p className="font-semibold text-muted text-center">
              {signInUp === "signin" ? (
                <>
                  Forgot Your Password?{" "}
                  <b className="pointer" onClick={changeSigninUp}>
                    Click Here
                  </b>
                </>
              ) : (
                <>
                  Want to login?{" "}
                  <b className="pointer" onClick={changeSigninUp}>
                    Sign In
                  </b>
                </>
              )}
            </p>
          </Card>
        </Content>

        <Footer style={{ textAlign: "center" }}>nErim v0.0.0.01 ©{new Date().getFullYear()} Created by{" "}
                        <span style={{ color: "#4096FF", fontWeight: "bold", cursor:'pointer' }}>
                          Alo It Consultant
                        </span> </Footer>
      </div>
    </>
  );
}
