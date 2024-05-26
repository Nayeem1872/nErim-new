"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import "@amcharts/amcharts5/xy";
import { Button, Table, Typography, Breadcrumb, Divider, Result } from "antd";
import { useRouter } from "next/navigation";
const { Title } = Typography;
import { LayoutDashboard } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Heatmap() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const router = useRouter();
  const [apiData, setApiData] = useState(null);
  const [impactId,setImpactId] = useState('')
  const [LikelihoodId,setLikelihoodId] = useState('')


  const handleSettingsClick = () => {
    router.push("/dashboard/settings"); // Navigate to settings page
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make an HTTP GET request to your API endpoint
        const response = await axios.get("/api/basic-status");

        // Update the state with the fetched data
        setApiData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // You might want to handle errors here
      }
    };

    // Call the fetch function when the component mounts
    fetchData();
  }, []);

  // Check if apiData exists and if any of the status values is false
  const isError =
    apiData &&
    (!apiData.matrixStatus ||
      !apiData.likelihoodStatus ||
      !apiData.impactStatus);


  useEffect(() => {
    let root = am5.Root.new("chartdiv15");
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0,
        paddingRight: 0,
        layout: root.verticalLayout,
      })
    );

    let yRenderer = am5xy.AxisRendererY.new(root, {
      visible: false,
      minGridDistance: 20,
      inversed: true,
      minorGridEnabled: true,
    });
    yRenderer.grid.template.set("visible", false);
    let yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: yRenderer,
        categoryField: "category",
      })
    );

    let xRenderer = am5xy.AxisRendererX.new(root, {
      visible: false,
      minGridDistance: 30,
      inversed: true,
      minorGridEnabled: true,
    });
    xRenderer.grid.template.set("visible", false);
    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: xRenderer,
        categoryField: "category",
      })
    );

    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        calculateAggregates: true,
        stroke: am5.color(0xffffff),
        clustered: false,
        xAxis: xAxis,
        yAxis: yAxis,
        categoryXField: "x",
        categoryYField: "y",
        valueField: "value",
      })
    );

    series.columns.template.setAll({
      tooltipText: "{value}",
      strokeOpacity: 1,
      strokeWidth: 2,
      cornerRadiusTL: 5,
      cornerRadiusTR: 5,
      cornerRadiusBL: 5,
      cornerRadiusBR: 5,
      width: am5.percent(100),
      height: am5.percent(100),
      templateField: "columnSettings",
    });

    let circleTemplate = am5.Template.new({});
    series.set("heatRules", [
      {
        target: circleTemplate,
        min: 10,
        max: 35,
        dataField: "value",
        key: "radius",
      },
    ]);

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(
          root,
          {
            fill: am5.color(0x000000),
            fillOpacity: 0.5,
            strokeOpacity: 0,
          },
          circleTemplate
        ),
      });
    });

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        sprite: am5.Label.new(root, {
          fill: am5.color(0xffffff),
          populateText: true,
          centerX: am5.p50,
          centerY: am5.p50,
          fontSize: 10,
          text: "{value}",
        }),
      });
    });

    series.columns.template.events.on("hit", function (ev) {
      // console.log("clicked on ", ev.target);
    });

    async function fetchData() {
      try {
        const response = await axios.get("/api/get-heatmap");

        const data = response.data.data;
        // setImpactId(data.impact_id)
        // setLikelihoodId(data.likelihood_id)
        console.log("Data",data);

        // Extract categories for yAxis (likelihood_critical) and xAxis (impact_critical)
        const yAxisCategories = [];
        data.map((item) => {
          if (
            yAxisCategories?.findIndex(
              (y) => y.category === item.impact_critical
            ) === -1
          ) {
            yAxisCategories.push({ category: item.impact_critical });
          }
        });

        const xAxisCategories = [];
        data.map((item) => {
          if (
            xAxisCategories?.findIndex(
              (x) => x.category === item.likelihood_critical
            ) === -1
          ) {
            xAxisCategories.push({ category: item.likelihood_critical });
          }
        });
        const finalData = data?.map((d) => {
          return {
            x: d.likelihood_critical,
            y: d.impact_critical,
            columnSettings: {
              fill: d.color.startsWith("#") ? d.color : "#" + d.color,
            },
            value: d.registersCount,
            custom: d.score,
            impactId: d.impact_id,
            LikelihoodId:d.likelihood_id
          };
        });

        series.columns.template.events.on("click", async function (ev) {
          const clickedCustom = ev.target.dataItem.dataContext.custom;
        
          const impact = ev.target.dataItem.dataContext.impactId;
          const likelihood = ev.target.dataItem.dataContext.LikelihoodId

          try {
            const response = await axios.get(
              `/api/get-heatmap/${impact}/${likelihood}/${clickedCustom}`
            );
            setData(response.data.scoreData);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        });

        series.data.setAll(finalData);
        yAxis.data.setAll(yAxisCategories);
        // console.log("yAxis", yAxisCategories);
        xAxis.data.setAll(xAxisCategories);
        // console.log("xAxis", xAxisCategories);

        chart.appear(1000, 100);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();

    return () => {
      root.dispose();
    };
  }, []);

  // console.log("impactId", impactId);
  // console.log("LikelihoodId", LikelihoodId);

  const columns = [
    {
      title: t("heatmap.ID"),
      dataIndex: "refId",
      key: "refId",
    },
    {
      title: t("heatmap.Risk_Identified"),
      dataIndex: "risk_identified",
      key: "risk_identified",
    },
    {
      title: t("heatmap.Potential_Impact"),
      dataIndex: "potential_impact",
      key: "potential_impact",
    },
    {
      title: t("heatmap.Financial_Impact"),
      dataIndex: "financial_impact",
      key: "financial_impact",
    },
    {
      title: t("heatmap.Criticality_Score"),
      dataIndex: "criticality_score",
      key: "criticality_score",
    },
    {
      title: t("heatmap.Risk_Criticality"),
      dataIndex: "risk_criticality",
      key: "risk_criticality",
    },
    {
      title: t("heatmap.Action"),
      width: 150,
      key: "action",
      render: (text, record) => (
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Button
            type="primary"
            onClick={() => {
              router.push(`/dashboard/register/view/${record?.id}`);
            }}
          >
            {t("heatmap.View")}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Title level={2}>{t("heatmap.heat_map")}</Title>
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
            title: t("heatmap.heat_map"),
          },
        ]}
      />
      <Divider />
      {isError ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Result
            status="warning"
            title={
              apiData?.impactStatus === false
                ? "There are some problem with your Risk Impact!"
                : apiData?.likelihoodStatus === false
                ? "Something wrong in your risk Likelihood"
                : "Something wrong in your risk valuation"
            }
            // title={t("There are some problems with your operation.")}
            subTitle={t("Please check your settings.")}
            extra={
              <Button
                type="primary"
                key="console"
                onClick={handleSettingsClick}
              >
                {t("Go Settings")}
              </Button>
            }
          />
        </div>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h4>Likelihood</h4>
          </div>
          <div
            // style={{
            //   display: "flex",
            //   flexDirection: "column",
            //   justifyContent: "center",
            //   alignItems: "center",
            //   height: "100vh",
            // }}
          >
            {/* <h4>Impact</h4> */}
          </div>
          <div id="chartdiv15" style={{ width: "100%", height: "500px" }} />
          {data && data.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <Table dataSource={data} columns={columns} />
            </div>
          )}
        </div>
      )}
    </>
  );
}
