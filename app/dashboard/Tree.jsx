"use client";
import { useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import { Card } from "antd";
import { DotChartOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";
const gridStyle = {
  width: "100%",
  textAlign: "center",
  borderRadius: "10px",
};

const Tree = () => {
  const { t } = useTranslation();
  const email = localStorage.getItem("verifyEmail");
  const token = localStorage.getItem("authorization");

  const {
    data: tableData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tree"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/dashboard`,{
          withCredentials:true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.bableData;
    },
    staleTime: 1000 * 60 * 60 * 1,
  });

  useEffect(() => {
    if (!tableData) return; // Exit early if data is not available

    let root = am5.Root.new("chartdiv3");
    root.setThemes([am5themes_Animated.new(root)]);

    // Create series
    let series = root.container.children.push(
      am5hierarchy.ForceDirected.new(root, {
        singleBranchOnly: false,
        downDepth: 2,
        topDepth: 1,
        initialDepth: 1,
        valueField: "value",
        categoryField: "name",
        childDataField: "children",
        idField: "name",
        linkWithField: "linkWith",
        manyBodyStrength: -10,
        centerStrength: 0.8,
      })
    );

    series.get("colors").setAll({
      step: 2,
    });

    series.links.template.set("strength", 0.5);

    series.data.setAll([tableData]);

    series.set("selectedDataItem", series.dataItems[0]);

    // Make stuff animate on load
    series.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [tableData]);

  return (
    <div style={{ margin: "10px" }}>
      <Card>
        <Card.Grid style={gridStyle}>
          <div style={{ marginBottom: "20px" }}>
            {t("dashboard.Domain Wise Action Status")}:<u>{new Date().toLocaleDateString()}</u> <DotChartOutlined />
            <div id="chartdiv3" style={{ width: "100%", height: "500px" }} />
          </div>
        </Card.Grid>
      </Card>
    </div>
  );
};

export default Tree;
