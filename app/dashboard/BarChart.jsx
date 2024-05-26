import React, { useContext, useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import MyContext from "@/provider/Context";
import { BarChartOutlined } from "@ant-design/icons";
import axios from "axios";
import { useTranslation } from "react-i18next";

const BarChart = () => {
  const { t } = useTranslation();
  const { value, updateValue } = useContext(MyContext);
  const [tableData, setTableData] = useState(null);
  const [criticals, setCriticals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/dashboard`, {
          withCredentials: true,
        });
        setCriticals(response.data.criticals);
        setTableData(response.data.columnChartJson);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let root = am5.Root.new("chartdiv1872");

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        paddingLeft: 0,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout,
      })
    );

    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
      })
    );

    if (tableData) {
      let data = [];
      const arr = Object.keys(tableData);
      arr.map((aa) => {
        data.push(tableData[aa]);
      });

      let xRenderer = am5xy.AxisRendererX.new(root, {
        cellStartLocation: 0.1,
        cellEndLocation: 0.9,
        minorGridEnabled: true,
      });

      let xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: "status",
          renderer: xRenderer,
          tooltip: am5.Tooltip.new(root, {}),
        })
      );

      xRenderer.grid.template.setAll({
        location: 1,
      });

      xAxis.data.setAll(data);

      let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {
            strokeOpacity: 0.1,
          }),
        })
      );

      let seriesMap = {};

      function makeSeries(name, fieldName, color) {
        if (seriesMap[name]) {
          return;
        }

        let series = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: name,
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: fieldName,
            categoryXField: "status",
            fill: am5.color(color),
          })
        );

        series.columns.template.setAll({
          tooltipText: "{name}, {categoryX}:{valueY}",
          width: am5.percent(90),
          tooltipY: 0,
          strokeOpacity: 0,
        });

        series.data.setAll(data);
        series.appear();

        series.columns.template.events.on("validated", function (event) {
          let label = event.target.label;
          if (label) {
            label.fill = am5.color("#B3645A");
          }
        });

        legend.data.push(series);
        seriesMap[name] = series;
      }

      // Add a series for the Total values only once
      function makeTotalSeries(fieldName, color) {
        if (seriesMap["Total"]) {
          return;
        }

        let series = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: "Total",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: fieldName,
            categoryXField: "status",
            fill: am5.color(color),
          })
        );

        series.columns.template.setAll({
          tooltipText: "{name}, {categoryX}:{valueY}",
          width: am5.percent(90),
          tooltipY: 0,
          strokeOpacity: 0,
        });

        series.data.setAll(data);
        series.appear();

        series.columns.template.events.on("validated", function (event) {
          let label = event.target.label;
          if (label) {
            label.fill = am5.color("#B3645A");
          }
        });

        legend.data.push(series);
        seriesMap["Total"] = series;
      }

      const allKeys = Object.keys(tableData[0]);
      tableData.map((i) => {
        for (let j = 0; j < allKeys.length; j++) {
          const checkingData = allKeys[j];
          if (i[checkingData] !== 0) {
            const findData = criticals.findIndex(
              (av) => av.critical_step === allKeys[j]
            );
            if (findData !== -1) {
              makeSeries(
                criticals[findData].critical_step,
                criticals[findData].critical_step,
                criticals[findData].color.startsWith("#")
                  ? criticals[findData].color
                  : "#" + criticals[findData].color
              );
            }
          }
        }
      });

      // Make Total series outside the loop to ensure it is created only once
      if (tableData.length > 0) {
        makeTotalSeries(
          "Total",
          tableData[0].colorForTotal.startsWith("#")
            ? tableData[0].colorForTotal
            : "#" + tableData[0].colorForTotal
        );
      }

      chart.appear(1000, 100);
    }

    return () => {
      root.dispose();
    };
  }, [value, tableData]);

  return (
    <div>
      {t("dashboard.RiskStatusSummary")}{" "}
      <u>{new Date().toLocaleDateString()}</u> <BarChartOutlined />
      <div id="chartdiv1872" style={{ width: "100%", height: "500px" }} />
    </div>
  );
};

export default BarChart;
