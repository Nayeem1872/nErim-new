"use client";
import { useRef, useEffect, useState } from "react";
import {
  Button,
  Input,
  Typography,
  Space,
  Card,
  Tour,
  Divider,
  message,
  Result,
} from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
const { Title, Text, Paragraph } = Typography;

const Verify = () => {
  const [domLoaded, setDomLoaded] = useState(false);
  const [twofactorSecrete, setTwofactorSecrete] = useState(null);
  const [secret, setSecret] = useState("");
  const [showOTPSection, setShowOTPSection] = useState(false);
  const router = useRouter();
  const [svgUrl, setSvgUrl] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [apiData, setApiData] = useState(null);
  // take a tour
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const [open, setOpen] = useState(false);
  const steps = [
    {
      title: "Setup 2FA",
      description:
        "Enable 2FA on the user account associated with the target site or service. The user will be provided with a QR code, setup key or both. The QR code is usually easier to work with.",
      placement: "right",
      cover: (
        <img alt="tour.png" src="/image/tour2.png" height="700" width="100" />
      ),
      target: () => ref1.current,
    },
    {
      title: "Click Plus Sign",
      description:
        "Open Google Authenticator on the mobile device and tap the plus sign in the lower right corner to add the target site or service.",
      cover: (
        <img alt="tour.png" src="/image/tour3.png" height="500" width="100" />
      ),
      placement: "right",
      target: () => ref2.current,
    },
    {
      title: "Scan QR code",
      description:
        "Scan a quick response code (QR code). Select the option and aim the device at the QR code to capture its image.",
      cover: (
        <img alt="tour.png" src="/image/tour4.png" height="500" width="100" />
      ),
      placement: "right",
      target: () => ref3.current,
    },
    {
      title: "Continue",
      description:
        "Google Authenticator will create the login and display its first OTP.",
      cover: (
        <img alt="tour.png" src="/image/tour1.png" height="700" width="100" />
      ),
      target: null,
    },
  ];

  const email =
    typeof window !== "undefined" ? localStorage.getItem("verifyEmail") : null;
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("authorization")
      : null;

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

  // console.log("apiData",apiData);

  useEffect(() => {
    const secret = localStorage.getItem("twofactorSecrete");

    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/twofactor-register`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSvgUrl(response.data.QR_Image);
        setSecret(response.data.secret);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    setTwofactorSecrete(secret);
    setDomLoaded(true);
  }, []);

  // #endregion

  console.log("otp", otpValue);

  const handleSubmit = async () => {
    try {
      const data = {
        one_time_password: otpValue,
      };

      console.log("Data", data);
      const apiUrl = "/api/twofactor-verify";

      const response = await axios.post(apiUrl, data, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.otp_verify === "yes") {
        // localStorage.setItem("twofactorSecrete", "yes");
        message.success("Welcome to nErim dashboard!");
        router.push("/dashboard");
        window.location.reload();
      } else {
        message.error("Otp doesn't match!!");
      }
      console.log(response.data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };
  const handleContinue = async () => {
    setShowOTPSection(true);

    try {
      const data = {
        secretKey: secret,
      };

      console.log("Data", data);
      const apiUrl = "/api/2f-complete";

      const response = await axios.post(apiUrl, data, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // if (response.status === 200) {
      //   localStorage.setItem("twofactorSecrete", "yes");
      //   router.push("/dashboard");
      // }
      console.log(response.data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };
  const handleOtpChange = (value) => {
    setOtpValue(value);
  };
  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <>
      {token && domLoaded ? (
        <>
          <img
            style={{
              height: "450px",
              width: "98%",
              padding: "20px",
              // paddingTop: "137.8px",
              borderRadius: "12px",
              boxShadow: "0 20px 27px rgb(0 0 0 / 5%)",
              backgroundSize: "cover",
              backgroundPosition: "100%",
              textAlign: "center",
              overflowX: "hidden",
            }}
            src="/image/bg-profile.jpg"
            alt=""
          />
          {!showOTPSection && twofactorSecrete === "no" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "-350px",
              }}
            >
              <Space direction="vertical" align="center">
                <Card
                  title=""
                  style={{
                    width: 600,
                    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)", // Add box shadow for floating effect
                    borderRadius: 16,
                  }}
                >
                  <Button type="primary" onClick={() => setOpen(true)}>
                    Take a tour?
                  </Button>
                  <Divider />
                  {/* <Button ref={ref1}> Upload</Button>
        <Button ref={ref2} type="primary">
          Save
        </Button>
        <Button ref={ref3} icon={<EllipsisOutlined />} /> */}
                  <Tour
                    // placement="leftTop"
                    open={open}
                    onClose={() => setOpen(false)}
                    steps={steps}
                  />
                  <Paragraph>
                    {" "}
                    Install <Text strong> "Google Authenticator"</Text> on the
                    user's iOS or Android device. This step is only necessary
                    once.
                  </Paragraph>
                  <Text ref={ref1}>Set up Google Authenticator</Text>
                  <Paragraph ref={ref2}>
                    Set up your two-factor authentication by scanning the
                    barcode below. Alternatively, you can use the code.
                  </Paragraph>{" "}
                  <Text type="warning" ref={ref3}>
                    You must set up your Google Authenticator app before
                    continuing. You will be unable to login otherwise.
                  </Text>{" "}
                  <br />
                  <Text type="secondary">
                    Run Two-factor Auth:
                    <Text
                      copyable={{
                        text: secret,
                      }}
                      strong
                    >
                      {" "}
                      {secret}{" "}
                    </Text>
                    <Paragraph></Paragraph>
                  </Text>
                  <br />
                  {svgUrl && (
                    <div style={{ textAlign: "center" }}>
                      <img
                        src={`data:image/svg+xml;utf8,${encodeURIComponent(
                          svgUrl
                        )}`}
                        alt="QR Code"
                        style={{ display: "block", margin: "auto" }}
                      />
                    </div>
                  )}
                  <div style={{ textAlign: "right" }}>
                    <Button
                      style={{
                        marginBottom: 20,
                      }}
                      onClick={handleContinue}
                      type="primary"
                    >
                      Continue
                    </Button>
                  </div>
                </Card>
              </Space>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "-180px",
              }}
            >
              <Card
                style={{
                  width: 400,
                  borderRadius: 16,
                  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)", // Add box shadow for floating effect
                }}
              >
                <Title
                  level={2}
                  style={{ textAlign: "center", marginBottom: 20 }}
                >
                  OTP Verification
                </Title>
                <Paragraph style={{ textAlign: "center", marginBottom: 20 }}>
                  Please enter the OTP generated on your Authenticator App.
                  Ensure you submit the current one because it refreshes every
                  30 seconds.
                </Paragraph>

                <div style={{ textAlign: "center" }}>
                  <Input.OTP
                    length={6}
                    onChange={(value) => handleOtpChange(value)}
                    style={{ width: 300, marginBottom: 20 }}
                    placeholder="Enter one time OTP"
                  />

                  <Button
                    style={{
                      width: 300,
                      marginBottom: 20,
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Add box shadow for floating effect
                    }}
                    block
                    type="primary"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Result
              status="403"
              title="403"
              subTitle="Sorry, you are not authorized to access this page."
              extra={
                <Button type="primary" onClick={handleGoBack}>
                  Back to login
                </Button>
              }
            />
          </div>
        </>
      )}
    </>
  );
};

export default Verify;
