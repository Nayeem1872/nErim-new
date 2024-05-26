import { useContext, useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Card } from "antd";
import MyContext from "@/provider/Context";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const gridStyle = {
  width: "100%",
  textAlign: "center",
  borderRadius: "10px",
};

const Stacked = () => {
  const { t } = useTranslation();
  const { value } = useContext(MyContext);
  const [criticals, setCriticals] = useState([]);

  const { data: tableData } = useQuery({
    queryKey: ["stacked2"],
    queryFn: async () => {
      const response = await axios.get(`/api/dashboard`, {
        withCredentials: true,
      });
      setCriticals(response.data.criticals);
      return response.data.tblChartJson;
    },
    staleTime: 1000 * 60 * 60 * 1,
  });

  useEffect(() => {
    let root = am5.Root.new("chartdiv1");

    let myTheme = am5.Theme.new(root);
    myTheme.rule("Grid", ["base"]).setAll({
      strokeOpacity: 0.1,
    });

    root.setThemes([am5themes_Animated.new(root), myTheme]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panY",
        wheelY: "zoomY",
        paddingLeft: 0,
        layout: root.verticalLayout,
      })
    );

    chart.set(
      "scrollbarY",
      am5.Scrollbar.new(root, {
        orientation: "vertical",
      })
    );

    if (tableData) {
      let data = [];
      const arr = Object.keys(tableData);
      arr.map((aa) => {
        data.push(tableData[aa]);
      });

      let yRenderer = am5xy.AxisRendererY.new(root, {});
      let yAxis = chart.yAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: "category",
          renderer: yRenderer,
          tooltip: am5.Tooltip.new(root, {}),
        })
      );

      yRenderer.grid.template.setAll({
        location: 1,
      });

      yAxis.data.setAll(data);

      let xAxis = chart.xAxes.push(
        am5xy.ValueAxis.new(root, {
          min: 0,
          maxPrecision: 0,
          renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 40,
            strokeOpacity: 0.1,
          }),
        })
      );

      let legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50,
        })
      );

      const legendEntries = new Set();

      function makeSeries(name, fieldName, color) {
        if (!legendEntries.has(name)) {
          legendEntries.add(name);
          let series = chart.series.push(
            am5xy.ColumnSeries.new(root, {
              name: name,
              stacked: true,
              xAxis: xAxis,
              yAxis: yAxis,
              baseAxis: yAxis,
              valueXField: fieldName,
              categoryYField: "category",
              fill: am5.color(color),
            })
          );

          series.columns.template.setAll({
            tooltipText: "{name}, {categoryY}: {valueX}",
            tooltipY: am5.percent(90),
          });
          series.data.setAll(data);

          series.appear();

          series.bullets.push(function () {
            return am5.Bullet.new(root, {
              sprite: am5.Label.new(root, {
                text: "{valueX}",
                fill: root.interfaceColors.get("alternativeText"),
                centerY: am5.p50,
                centerX: am5.p50,
                populateText: true,
              }),
            });
          });

          legend.data.push(series);
        }
      }

      const allKeys = Object.keys(tableData[0]);
      tableData.map((i) => {
        for (let j = 0; j < allKeys.length; j++) {
          const checkingData = allKeys[j];
          if (i[checkingData] !== 0) {
            const findData = criticals.findIndex(
              (av) => av.critical_step === allKeys[j]
            );
            if (findData != -1) {
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

      chart.appear(1000, 100);
    }
    return () => {
      root.dispose();
    };
  }, [value, tableData]);

  return (
    <div style={{ margin: "10px" }}>
      <Card>
        <Card.Grid style={gridStyle}>
          {t("dashboard.Stacked")} <u>{new Date().toLocaleDateString()}</u>
          <div id="chartdiv1" style={{ width: "100%", height: "500px" }} />
         
        </Card.Grid>
      </Card>
    </div>
  );
};

export default Stacked;