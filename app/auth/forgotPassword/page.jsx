"use client";
import { useState, useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import "../../style/signin.css";
import axios from "axios";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const router = useRouter()

  const [domLoaded, setDomLoaded] = useState(false);
  useEffect(() => {
    setDomLoaded(true);
  }, []);
  const onFinish = async (values) => {
    console.log("Success:", values);

    try {
      const apiUrl = "/api/password/email";

      const response = await axios.post(apiUrl, values);
      if (response.status === 200) {
        message.success("We have sent a password reset link to your email!");
        router.push("/")

      } else {
        // Handle error if deletion fails
        message.error("Something went wrong!");
      }
     
    } catch (error) {
      console.error("Error logging in:", error);
      message.error("Something went wrong!");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      {domLoaded ? (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h3>Forgot Your Password?</h3>
            <p style={{ color: "gray", marginBottom: "40px" }}>
              Enter your email address and we'll send you the link to reset
              password
            </p>
          </div>

          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className="row-col"
          >
            {/* <Form.Item
                      name="name"
                      rules={[
                        { required: true, message: "Please input your Name!" },
                      ]}
                    >
                      <Input placeholder="Name" />
                    </Form.Item> */}
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your Email!" }]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            {/* <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                      ]}
                    >
                      <Input.Password placeholder="Password" />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                      <Checkbox>
                        I agree the{" "}
                        <a href="#pablo" className="font-bold text-dark">
                          Terms and Conditions
                        </a>
                      </Checkbox>
                    </Form.Item> */}

            <Form.Item>
              <Button
                style={{ width: "100%" }}
                type="primary"
                htmlType="submit"
              >
                Email Password Reset Link
              </Button>
            </Form.Item>
          </Form>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default ForgotPassword;
