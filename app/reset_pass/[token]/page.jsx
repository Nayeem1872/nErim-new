"use client";
import { Button, Input, Card, Result, message } from "antd";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ResetPassword = () => {
  const router = useRouter()
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("pending");

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    // console.log("url", url);
    const queryParams = new URLSearchParams(searchParams);
    const email = queryParams.get("email");
    console.log("email",email);

    setEmail(email);
    const pathnameParts = pathname.split("/");
    const token = pathnameParts[pathnameParts.length - 1];
    setToken(token);

    // Verify token and email
    const verifyToken = async () => {
      try {
        const response = await axios.post("/api/password/token/check", {
          email,
          token,
        });
        if (response.data.message === "success") {
          // Token and email are valid, navigate to the reset password page
          setVerificationStatus("success");
        } else {
          // Token or email is invalid, handle the error
          setVerificationStatus("error");
        }
      } catch (error) {
        console.error("Error verifying reset token:", error);
        setVerificationStatus("error");
      }
    };

    verifyToken();
  }, [pathname, searchParams]);
  // console.log("Email:", email);
  // console.log("Token:", token);

  // handleSubmit
  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      message.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("/api/password/reset", {
        token,
        reset_p_email: email,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      // Handle response
      if (response.status === 200) {
        message.success("Password reset successful");
        router.push("/")
        // Redirect or perform any other action after successful password reset
      } else {
        message.error("Password reset failed");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      console.log(error.response);

      message.error("An error occurred while resetting the password");
    }
  };

  if (verificationStatus === "pending") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Result title="Verifying Token........." />
      </div>
    );
  } else if (verificationStatus === "error") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Result
          status="500"
          title="Token Expired!"
          subTitle="Please Try Again...."
        />
      </div>
    );
  } else {
    return (
      <>
        <img
          style={{
            height: "450px",
            width: "98%",
            padding: "20px",
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "-250px",
          }}
        >
          <Card
            style={{
              display: "flex",
              flexDirection: "column", // Ensure flex direction is set to column
              alignItems: "center",
              width: 500, // Set the width of the card
              borderRadius: 16,
              boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h3>Reset Account Password</h3>
              <p style={{ color: "gray", marginBottom: "40px" }}>
                Enter a new password for your account
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <Input
                style={{ width: 400, marginBottom: 20 }}
                placeholder="Email"
                value={email}
                disabled
              />
              <Input.Password
                style={{ width: 400, marginBottom: 20 }}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input.Password
                style={{ width: 400, marginBottom: 20 }}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <Button
                style={{
                  width: 400,
                  marginBottom: 20,
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
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
      </>
    );
  }
};

export default ResetPassword;
