"use client";
import React from "react";
import { Breadcrumb, Space, Table, Tag } from "antd";
import { useQuery } from "@tanstack/react-query";
import { Divider, Typography } from "antd";
import { LayoutDashboard } from "lucide-react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useTranslation } from "react-i18next";
const { Title } = Typography;

const Audit = () => {
  const { t } = useTranslation();
  // const [cookies] = useCookies();
  // console.log("Cookies:", cookies);
  const email = localStorage.getItem("verifyEmail");
  const token = localStorage.getItem("authorization");

  const { data: dataSourceQuery } = useQuery({
    queryKey: ["audit"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/risk-audit`,

        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data);
      return response.data.auditData;
    },
    staleTime: 1000 * 60 * 60 * 1,
  });
  const columns = [
    {
      title: t("audit.time"),
      dataIndex: "time",
      key: "time",
    },
    {
      title: t("audit.username"),
      dataIndex: "username",
      key: "username",
    },
    {
      title: t("audit.ip_address"),
      dataIndex: "ip_address",
      key: "ip_address",
    },
    {
      title:t("audit.changes"),
      dataIndex: "change",
      key: "change",
    },
  ];
  return (
    <div>
      <Title level={2}>{t("audit.audit")}</Title>
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
            title: "Audit",
          },
        ]}
      />
      <Divider />

      <Table dataSource={dataSourceQuery} columns={columns} />
    </div>
  );
};

export default Audit;
