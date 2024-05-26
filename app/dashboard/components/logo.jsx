
import React from "react";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/dashboard");
  };
  return (
    <>
        <a style={{ cursor: "pointer" }} onClick={handleClick}>
        <img
          src="/image/logo1.png"
          alt="logo"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            marginBottom: "8px",
            marginTop: "20px",
          }}
        />
      </a>
    </>
  );
};

export default Logo;
