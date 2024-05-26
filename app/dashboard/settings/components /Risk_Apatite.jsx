import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, InputNumber, message } from "antd";
import { Typography } from "antd";
import axios from "axios";
import { useTranslation } from "react-i18next";
const { Title } = Typography;
import styles from "./settings.style.css"
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

const Risk_Apatite = () => {
  const [apetiteValue, setApetiteValue] = useState(null);
  const { t } = useTranslation();
  const email = localStorage.getItem("verifyEmail");
  const token = localStorage.getItem("authorization");
  const userId = localStorage.getItem("userId");
  const storedMatrixId = localStorage.getItem("modelId");
  const { data: dataSourceQuery, refetch } = useQuery({
    queryKey: ["apetiteData"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/get-risk-apetite`,

        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.apetiteData;
    },
    staleTime: 1000 * 60 * 60 * 1,
  });

  useEffect(() => {
    // Set the apetiteValue state variable once data is received from the API
    if (dataSourceQuery) {
      setApetiteValue(dataSourceQuery.key_value);
    }
  }, [dataSourceQuery]);

  // console.log("appatite",apetiteValue);

  const handleInputChange = async (value) => {
    setApetiteValue(value); // Update the apetiteValue state variable when input value changes
    try {
      const data = {
        userId: userId,
        verifyEmail: email,
        value: apetiteValue,
      };
      console.log("formdata:", data);

      const apiUrl = `/api/update-risk-apetite`;

      const response = await axios.post(apiUrl, data, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        refetch(); // Refetch the data to get the updated value
        message.loading({
          content: t("Risk_Apatite.Action_in_progress"),
          duration: 3,
        }); // Show loading message for 3 seconds
        setTimeout(() => {
          message.success(t("Risk_Apatite.Risk_Apatite_updated_successfully."));
        }, 3000); // Show success message after 3 seconds
      }
    } catch (error) {
      console.error("Error updating data:", error);
      message.error(t("Risk_Apatite.An_error_occurred_while_updating_the_record."));
    }
  };

  const max = () => {
    return storedMatrixId * storedMatrixId;
  };
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

  const handleIncrement = () => {
    const newValue = Math.min(apetiteValue + 1, max()); // Ensure the new value does not exceed the maximum
    handleInputChange(newValue); // Call the function to update the value
}

// Function to handle decrementing the value
const handleDecrement = () => {
    const newValue = Math.max(apetiteValue - 1, 1); // Ensure the new value does not go below 1
    handleInputChange(newValue); // Call the function to update the value
}

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Title level={4}> {t("Risk_Apatite.Risk_Apatite")}</Title>
        <div style={{ display: 'flex', alignItems: 'center', marginTop:"12px",marginLeft:"5px" }}>
    <InputNumber
        readOnly={true}
        min={1}
        max={max()}
        onChange={handleInputChange}
        value={apetiteValue}
        // size="large"
        className={styles.customInputNumber}
        style={{ width: "200px", marginRight: "5px" }}
    />
    <Button onClick={() => handleIncrement()} icon={<PlusOutlined />} style={{marginRight:"5px"}} />
    <Button onClick={() => handleDecrement()} icon={<MinusOutlined />} />
</div>
        
      </div>
    </div>
  );
};

export default Risk_Apatite;
