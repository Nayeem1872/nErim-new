"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import {
  Breadcrumb,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Divider,
  DatePicker,
  Typography,
  message,
  Card,
} from "antd";
import axios from "axios";
import {
  ArrowDownRight,
  AtSign,
  BarChart,
  LandPlot,
  LayoutDashboard,
  Pen,
  ShieldQuestion,
  User2Icon,
} from "lucide-react";
const { Text, Title } = Typography;

const Edit = ({ params }) => {
  const token = localStorage.getItem("authorization");
  const [data, setData] = useState(null);
  const router = useRouter();
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [loadings, setLoadings] = useState([]);
  const [category, setCategory] = useState([]);
  const [status, setStatus] = useState([]);
  const [impact, setImpact] = useState([]);
  const [selectedImpact, setSelectedImpact] = useState(null);
  const [likelihood, setLikelihood] = useState([]);
  const [selectedLikelihood, setSelectedLikelihood] = useState(null);
  const [riskMatrix, setRiskMatrix] = useState([]);
  const [appetite, setAppetite] = useState([]);
  const [riskCriticality, setRiskCriticality] = useState({});
  const [data1, setData1] = useState(null);
  const [selectedResidualImpact, setSelectedResidualImpact] = useState(null);
  const [selectedResidualLikelihood, setSelectedResidualLikelihood] =
    useState(null);
  const [selectedRiskImpact, setSelectedRiskImpact] = useState(null);
  const [riskStatusID, setRiskStatusID] = useState('');
  const [selectedRiskLikelihood, setSelectedRiskLikelihood] = useState(null);
  const [selectedRiskCriticality, setSelectedRiskCriticality] = useState(null);
  const [selectedItemColor, setSelectedItemColor] = useState(null);
  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 6000);
  };
  // go back

  const handleGoBackButton = () => {
    router.push("/dashboard/register");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/add-risk-register-form`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData1(response.data);
        // Assuming these functions are defined somewhere
        setCategory(response.data.categoryData);
        setStatus(response.data.statusData);
        setImpact(response.data.impactData);
        setLikelihood(response.data.likelihoodData);
        setAppetite(response.data.apetiteValue);
        setRiskMatrix(response.data.riskMatrixData);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, []);
  form.setFieldsValue({
    rs_score: selectedRiskImpact,
  });

  form.setFieldsValue({
    rl_score: selectedRiskLikelihood,
  });
  // form.setFieldsValue({
  //   risk_criticality: selectedRiskCriticality
  // });

  // console.log("Matrix", data1);
  // console.log("impact", selectedImpact);

  // date
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };
  const config = {
    rules: [
      {
        type: "object",
        required: true,
        message: "Please select time!",
      },
    ],
  };

  // Form

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  /* eslint-disable no-template-curly-in-string */
  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };
  /* eslint-enable no-template-curly-in-string */

  const handleImpactChange = (value, weight) => {
    form.setFieldsValue({
      rs_score: value,
    });
    setSelectedImpact(value, weight);
    const passingValue = calculateRiskScore();
    getRiskInfo(passingValue);
  };

  const handleResidualImpactChange = (value) => {
    setSelectedResidualImpact(value);
  };

  const handleLikelihoodChange = (value) => {
    form.setFieldsValue({
      rl_score: value,
    });
    setSelectedLikelihood(value); // Set only the value here, not the weight
    const passingValue = calculateRiskScore();
    getRiskInfo(passingValue);
  };
  const handleResidualLikelihoodChange = (value) => {
    setSelectedResidualLikelihood(value);
  };
  // Function to calculate the residual risk score
  const calculateResidualRiskScore = () => {
    if (selectedResidualImpact && selectedResidualLikelihood) {
      const score = selectedResidualImpact * selectedResidualLikelihood;
      return score;
    }
  };

  const calculateRiskScore = () => {
    if (selectedLikelihood && selectedImpact) {
      const riskScore = selectedLikelihood * selectedImpact;
      form.setFieldsValue({
        criticality_score: riskScore,
      });
      return riskScore;
    }
    return null;
  };

  const getRiskInfo = (riskScore) => {
    if (!riskScore) {
      return null;
    }

    // Find the corresponding range from riskMatrix
    const rangeInfo = riskMatrix.find((item) => {
      const [min, max] = item?.range?.split("-").map(Number);
      return riskScore >= min && riskScore <= max;
    });
    if (rangeInfo) {
      // console.log("Log", rangeInfo.critical_step);
      // form.setFieldsValue({
      //   risk_criticality: rangeInfo.critical_step,
      // });
    }
    setRiskCriticality(rangeInfo);
    // console.log("range", rangeInfo);
    return rangeInfo;
  };

  // const riskInfo = getRiskInfo(calculateRiskScore());

  const compareRiskWithAppetite = () => {
    const riskScore = data ? data.criticality_score : null;
    if (riskScore === null) {
      return null; // Risk score cannot be compared
    }
    if (appetite > riskScore) {
      return (
        <span style={{ color: "green" }}>
          {t("add_register.Risk Score is below Risk Appetite")}
        </span>
      );
    } else if (appetite < riskScore) {
      return (
        <span style={{ color: "red" }}>
          {t("add_register.Risk Score is above Risk Appetite")}
        </span>
      );
    } else {
      return (
        <span style={{ color: "red" }}>
          {t("add_register.Risk Score is equal to Risk Appetite")}
        </span>
      );
    }
  };

  useEffect(
    (page) => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`/api/risk-register`, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const riskData = response.data.registerData;

          let selectedItem = riskData.find(
            (item) => item.id === Number(params.id)
          );
          selectedItem.risk_date = dayjs(selectedItem.risk_date);

          form.setFieldsValue(selectedItem);

          setSelectedRiskImpact(selectedItem.risk_impact);
          setSelectedRiskLikelihood(selectedItem.risk_likelihood);
          setSelectedRiskCriticality(selectedItem.risk_criticality);
          setSelectedItemColor(selectedItem.color);
          // console.log("risk_criticality", selectedItem.risk_criticality);
          // console.log("color", selectedItem.color);
          setRiskStatusID(selectedItem.risk_matrix_id);
          setData(selectedItem);
          // console.log("selectedItem", selectedItem);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
      form.setFieldsValue({
        risk_criticality: selectedRiskCriticality,
      });
    },
    [params.id]
  );
  // console.log("risk",riskStatusID);
  const onFinish = async (values) => {
    const formData = form.getFieldsValue();

    try {
      const data = {
        ...formData,
        id: params.id,
        risk_matrix_id: riskStatusID,
        // color: riskInfo.color,
        // risk_criticality: riskInfo.critical_step,
        // residualScore: calculateResidualRiskScore(),
      };

      console.log("data:", data);

      const apiUrl = "/api/update-risk-register";

      const response = await axios.post(apiUrl, data, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        message.success("Risk Register Updated!");
        router.push("/dashboard/register"); // Redirect to the register page
      } else {
        message.error("Failed to update register.");
      }
      // console.log("data", response.data);
    } catch (error) {
      console.error("Error sending data:", error);
      message.error("Failed to update register.");
    }
  };

  return (
    <>
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
            title: (
              <a
                onClick={() => {
                  router.push(`/dashboard/register`);
                }}
                style={{ color: "#0D85D8" }}
              >
                {t("register.register_page")}
              </a>
            ),
          },
          {
            title: (
              <span style={{ color: "gray" }}>
                {t("register.edit")}
                {/* :{data1.register.risk_name} */}
              </span>
            ),
          },
        ]}
      />
      <div>
        {data && (
          <>
            <Title level={4}>Risk Name: {data.risk_name}</Title>

            <Divider />
            <Form
              {...layout}
              name="nest-messages"
              // onFinish={onFinish}
              form={form}
              style={{
                maxWidth: "1300px",
                textAlign: "left",
              }}
              validateMessages={validateMessages}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginLeft: "250px",
                }}
              >
                <Card
                  style={{
                    width: 500,
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div>
                    <Divider>{t("add_register.risk_information")}</Divider>
                    <Form.Item
                      name="risk_name"
                      label={t("add_register.risk_name")}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input
                        // defaultValue={data?.risk_name}
                        placeholder={t("add_register.input_name")}
                        prefix={
                          <User2Icon
                            size={16}
                            style={{ color: "#D3D3D3", alignItems: "center" }}
                          />
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      name="owner_email"
                      label={t("add_register.owner_email")}
                    >
                      <Input
                        // defaultValue={data?.owner_email}
                        placeholder={t("add_register.input_email")}
                        prefix={
                          <AtSign
                            size={16}
                            style={{ color: "#D3D3D3", alignItems: "center" }}
                          />
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      name="risk_owner"
                      label={t("add_register.risk_owner")}
                      rules={[
                        {
                          required: true,
                          type: "name",
                        },
                      ]}
                    >
                      <Input
                        defaultValue={data?.risk_owner}
                        placeholder={t("add_register.input_owner")}
                        prefix={<ArrowDownRight size={16} strokeWidth={1} />}
                        style={{ alignItems: "center" }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="risk_date"
                      label={t("add_register.date")}
                      {...config}
                    >
                      <DatePicker
                        format="DD-MM-YYYY"
                        style={{ width: "300px" }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="financial_impact"
                      label={t("add_register.financial_impact")}
                      // rules={[
                      //   {
                      //     type: "number",
                      //   },
                      // ]}
                    >
                      <Input
                        // defaultValue={data?.financial_impact}
                        placeholder={t("add_register.input_financial_impact")}
                        prefix={<BarChart size={20} strokeWidth={1} />}
                        style={{ alignItems: "center" }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="category_id"
                      label={t("add_register.risk_category")}
                      rules={[
                        {
                          required: true,
                          message: "Please select risk category",
                        },
                      ]}
                    >
                      <Select
                        placeholder={t(
                          "add_register.select_your_risk_category"
                        )}
                        // defaultValue={data ? data.category_id : undefined}
                      >
                        {category.map((categoryItem) => (
                          <Select.Option
                            key={categoryItem.id}
                            value={categoryItem.id}
                          >
                            {categoryItem.category_name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="risk_status_id"
                      label={t("add_register.risk_status")}
                      rules={[
                        {
                          required: true,
                          message: "Please select Status!",
                        },
                      ]}
                    >
                      <Select
                        placeholder={t("add_register.select_your_risk_status")}
                        // defaultValue={data ? data.risk_status_id : undefined}
                      >
                        {status.map((statusItem) => (
                          <Select.Option
                            key={statusItem.id}
                            value={statusItem.id}
                          >
                            {statusItem.status_name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="potential_impact"
                      label={t("add_register.potential_impact")}
                    >
                      <Input
                        // defaultValue={data?.potential_impact}
                        placeholder={t("add_register.input_impact_area")}
                        prefix={<LandPlot size={16} strokeWidth={1} />}
                        style={{ alignItems: "center" }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="risk_identified"
                      label={t("add_register.risk_details")}
                    >
                      <Input.TextArea
                        // defaultValue={data?.risk_identified}
                        placeholder={t("add_register.input_risk_details")}
                        prefix={<Pen size={16} strokeWidth={1} />}
                      />
                    </Form.Item>
                    <Form.Item
                      name="risk_casuse"
                      label={t("add_register.risk_cause")}
                    >
                      <Input.TextArea
                        // defaultValue={data?.risk_casuse}
                        placeholder={t("add_register.input_risk_cause")}
                        prefix={<ShieldQuestion size={16} strokeWidth={1} />}
                      />
                    </Form.Item>
                  </div>
                </Card>

                <Card
                  style={{
                    width: 500,
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div>
                    <div>
                      <Divider>{t("add_register.risk_rating")}</Divider>
                      <div>
                        <Form.Item
                          name="risk_impact"
                          label={t("add_register.impact")}
                          rules={[
                            {
                              required: true,
                              message: "Please select risk Impact",
                            },
                          ]}
                        >
                          <Select
                            placeholder={t(
                              "add_register.select_your_risk_impact"
                            )}
                            style={{ width: 300 }}
                            onChange={(value) => handleImpactChange(value)}
                            // defaultValue={data ? data.risk_impact : undefined}
                          >
                            {impact.map((impactItem) => (
                              <Select.Option
                                key={impactItem.id}
                                value={impactItem.weight}
                              >
                                {impactItem.relative}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>

                        <Form.Item
                          name="risk_likelihood"
                          label={t("add_register.likelihood")}
                          rules={[
                            {
                              required: true,
                              message: "Please select risk Likelihood",
                            },
                          ]}
                          style={{
                            gap: "20px",
                          }}
                        >
                          <Select
                            placeholder={t(
                              "add_register.select_your_risk_likelihood)"
                            )}
                            style={{ width: 300 }}
                            onChange={(value) => handleLikelihoodChange(value)}
                          >
                            {likelihood.map((likelihoodItem) => (
                              <Select.Option
                                key={likelihoodItem.id}
                                value={likelihoodItem.weight}
                              >
                                {likelihoodItem.relative}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>

                        <Form.Item
                          name="treatment_decision"
                          label={t("add_register.decision")}
                          rules={[
                            {
                              required: true,
                              message: "Please select Treatment Decision",
                            },
                          ]}
                        >
                          <Select
                            placeholder={t(
                              "add_register.select_your_treatment_decision"
                            )}
                            style={{ width: 300 }}
                          >
                            <Option value="Accept">Accept</Option>
                            <Option value="Manage">Manage</Option>
                            <Option value="Transfer">Transfer</Option>
                            <Option value="Mitigate">Mitigate</Option>
                            <Option value="Reduce">Reduce</Option>
                            <Option value="Avoid">Avoid</Option>
                            <Option value="Control">Control</Option>
                          </Select>
                        </Form.Item>

                        <Form.Item
                          name="residual_impact"
                          label={t("add_register.residual_impact")}
                          rules={[
                            {
                              required: true,
                              message: "Please select Residual Impact",
                            },
                          ]}
                        >
                          <Select
                            placeholder={t(
                              "add_register.select_your_residual_impact"
                            )}
                            style={{ width: 300 }}
                            onChange={(value) =>
                              handleResidualImpactChange(value)
                            }
                          >
                            {impact.map((impactItem) => (
                              <Select.Option
                                key={impactItem.id}
                                value={impactItem.weight}
                              >
                                {impactItem.relative}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>

                      <div>
                        <Form.Item
                          name="residual_likelihood"
                          label={t("add_register.residual_likelihood")}
                          rules={[
                            {
                              required: true,
                              message: "Please select Residudal Likelihood",
                            },
                          ]}
                        >
                          <Select
                            placeholder={t(
                              "add_register.select_your_Residudal_likelihood"
                            )}
                            onChange={(value) =>
                              handleResidualLikelihoodChange(value)
                            }
                          >
                            {likelihood.map((likelihoodItem) => (
                              <Select.Option
                                key={likelihoodItem.id}
                                value={likelihoodItem.weight}
                              >
                                {likelihoodItem.relative}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>
                      <div>
                        <Form.Item
                          name="rs_score"
                          label={t("add_register.rs_score")}
                        >
                          <InputNumber
                            style={{ width: 300 }}
                            placeholder={t("add_register.rs_score")}
                            disabled
                          />
                        </Form.Item>

                        <Form.Item
                          name="rl_score"
                          label={t("add_register.rl_score")}
                        >
                          <InputNumber
                            style={{ width: 300 }}
                            placeholder={t("add_register.rl_score")}
                            disabled
                          />
                        </Form.Item>
                        <Form.Item
                          name="criticality_score"
                          label={t("add_register.criticality_score")}
                        >
                          <InputNumber
                            value={calculateRiskScore()}
                            style={{ width: 300 }}
                            placeholder={t("add_register.criticality_score")}
                            disabled
                          />
                        </Form.Item>
                      </div>
                      <Form.Item
                        name="risk_criticality"
                        label={t("add_register.Risk Criticality")}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {/* {selectedRiskCriticality} */}

                          <Input
                            // placeholder="Criticality level"
                            disabled
                            value={selectedRiskCriticality}
                            style={{
                              backgroundColor: selectedItemColor
                                ? selectedItemColor.startsWith("#")
                                  ? selectedItemColor
                                  : `#${selectedItemColor}`
                                : "transparent",
                            }}
                          />
                        </div>
                      </Form.Item>
                      <div style={{ textAlign: "center" }}>
                        <Title level={4}>
                          <Text keyboard>{compareRiskWithAppetite()}</Text>
                        </Title>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <Form.Item
                wrapperCol={{
                  ...layout.wrapperCol,
                  offset: 8,
                }}
              >
                <Divider />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "5px",
                  }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loadings[0]}
                    onClick={() => {
                      enterLoading(0);
                      onFinish();
                    }}
                  >
                    {t("submit")}
                  </Button>
                  <Button onClick={handleGoBackButton}>{t("back")}</Button>
                </div>
              </Form.Item>
            </Form>
          </>
        )}
      </div>
    </>
  );
};

export default Edit;
