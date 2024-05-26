"use client";
import styles from "./style.module.css";
import { Row, Col, Card, Descriptions } from "antd";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useEffect, useState } from "react";

function Account() {
  const { t } = useTranslation();

  const [dataSourceQuery, setDataSourceQuery] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authorization");
        const response = await axios.get("/api/account-info", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDataSourceQuery(response.data.data);
      } catch (error) {
        console.log("Error", error);
      }
    };

    fetchData();
  }, []);
 

  console.log("Acc data", dataSourceQuery);

  return (
    <>
      <div className={styles.profile}>
        <img
          src="/image/bg-profile.jpg"
          alt="User Image"
          style={{
            width: "1670px",
            height: "350px",
            borderRadius: "10%",
            marginBottom: "8px",
          }}
        />
      </div>

      <Row className={styles.middle} gutter={[24, 0]}>
        <Col span={12} offset={6} className="mb-24">
        <Card
            bordered={true}
            title={
              <h3 className={`${styles.cardTitle} font-semibold m-0`}>
                {t("account_info.ProfileInformation")}
              </h3>
            }
            className={`${styles.cardCustom} header-solid h-full card-profile-information`}
            bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
          >
            {/* <hr className="my-25" /> */}
            <Descriptions title="" style={{marginTop:"20px"}}>
              <Descriptions.Item
                label={t("account_info.OrgName")}
                span={3}
                className={styles.descriptionItem}
              >
                {dataSourceQuery.orgName}
              </Descriptions.Item>
              <Descriptions.Item
                label={t("account_info.Subscription")}
                span={3}
                className={styles.descriptionItem}
              >
                {dataSourceQuery.subscription}
              </Descriptions.Item>
              <Descriptions.Item
                label={t("account_info.UserCount")}
                span={3}
                className={styles.descriptionItem}
              >
                {dataSourceQuery.userCount}
              </Descriptions.Item>
              <Descriptions.Item
                label={t("account_info.StartDate")}
                span={3}
                className={styles.descriptionItem}
              >
                {dataSourceQuery.startDate}
              </Descriptions.Item>
              <Descriptions.Item
                label={t("account_info.EndDate")}
                span={3}
                className={styles.descriptionItem}
              >
                {dataSourceQuery.endDate}
              </Descriptions.Item>
              <Descriptions.Item
                label={t("account_info.ModelName")}
                span={3}
                className={styles.descriptionItem}
              >
                {dataSourceQuery.modelName}
              </Descriptions.Item>
              <Descriptions.Item
                label={t("account_info.Status")}
                span={3}
                className={styles.descriptionItem}
              >
                {dataSourceQuery.status}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Account;
