"use client";
import { useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5index from "@amcharts/amcharts5/index";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card } from "antd";
import { PieChartOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const gridStyle = {
  width: "100%",
  textAlign: "center",
  borderRadius: "10px",
};

const PieChart = () => {
  const { t } = useTranslation();
  const {
    data: tableData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pie4"],
    queryFn: async () => {
      const response = await axios.get(`/api/dashboard`);
      return response.data.dataPie;
    },
    staleTime: 1000 * 60 * 60 * 1,
  });

  // console.log(tableData);

  useEffect(() => {
    if (!tableData) return; // If tableData is undefined, return early

    let root = am5.Root.new("chartdiv88");
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      })
    );

    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
      })
    );

    // Map tableData to the required format
    const mappedData = tableData.map((item) => ({
      value: item.value,
      category: item.category,
      color: item.color ? (item.color.startsWith("#") ? item.color : `#${item.color}`) : undefined,
    }));

    series.data.setAll(mappedData);
    series.appear(1000, 100);

    // Set slice colors based on the color field from the data
    series.slices.each((slice, index) => {
      const sliceColor = mappedData[index]?.color; // Get color from mapped data
      if (sliceColor) {
        slice.set("fill", am5.color(sliceColor));
      }
    });

    // Clean up
    return () => {
      root.dispose();
    };
  }, [tableData]);

  return (
    <div style={{ margin: "10px" }}>
      <Card>
        <Card.Grid style={gridStyle}>
          {t("dashboard.Pie")} <u>{new Date().toLocaleDateString()}</u>{" "}
          <PieChartOutlined />
          <div id="chartdiv88" style={{ width: "100%", height: "500px" }} />
        </Card.Grid>
      </Card>
    </div>
  );
};

export default PieChart;
