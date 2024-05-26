"use client";
import React, { useEffect, useState } from "react";
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
  FloatButton,
  Upload,
  Tooltip,
  Modal,
  Alert,
} from "antd";
import {
  CloudUploadOutlined,
  DownloadOutlined,
  ImportOutlined,
  QuestionCircleOutlined,
  UpCircleFilled,
} from "@ant-design/icons";
const { Option } = Select;
import { useRouter } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { useTranslation } from "react-i18next";
import axios from "axios";
const { Text } = Typography;

const { Title } = Typography;

const Add = () => {
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
  const [open, setOpen] = useState(true);
  const [data, setData] = useState([]);
  const onChange = (checked) => {
    setOpen(checked);
  };

  const token = localStorage.getItem("authorization");
  const userId = localStorage.getItem("userId");
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
  const router = useRouter();
  const handleGoBackButton = () => {
    router.push("../register");
  };

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

  const onFinish = async (values) => {
    // console.log("formdata:", values);
    try {
      const data = {
        ...values,
        userId: userId,
        risk_matrix_id: riskInfo.id,
        rs_score: selectedImpact,
        rl_score: selectedLikelihood,
        criticality_score: calculateRiskScore(),
        color: riskInfo.color,
        risk_criticality: riskInfo.critical_step,
        residualScore: calculateResidualRiskScore(),
      };

      console.log("data:", data);

      const apiUrl = "/api/add-risk-register";

      const response = await axios.post(apiUrl, data, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        message.success("New Register Added!");
        router.push("/dashboard/register"); // Redirect to the register page
      } else {
        message.error("Failed to add new register.");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;

        if (errors.potential_impact) {
          message.error(errors.potential_impact[0]);
        }
        if (errors.risk_identified) {
          message.error(errors.risk_identified[0]);
        }
        if (errors.financial_impact) {
          message.error(errors.financial_impact[0]);
        }
        if (errors.risk_casuse) {
          message.error(errors.risk_casuse[0]);
        }
        if (errors.owner_email) {
          message.error(errors.owner_email[0]);
        }
      } else {
        console.error("Error updating data:", error);
        message.error(t("settingsImpact.Error_updating_record"));
      }
    }
  };

  // select
  const suffixSelector = (
    <Form.Item name="suffix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="USD">$</Option>
        <Option value="CNY">¥</Option>
      </Select>
    </Form.Item>
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/add-risk-register-form`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
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

  const [selectedResidualImpact, setSelectedResidualImpact] = useState(null);
  const [selectedResidualLikelihood, setSelectedResidualLikelihood] =
    useState(null);

  const handleImpactChange = (value, weight) => {
    setSelectedImpact(value, weight);
  };

  const handleResidualImpactChange = (value) => {
    setSelectedResidualImpact(value);
  };

  const handleLikelihoodChange = (value, weight) => {
    setSelectedLikelihood(value, weight);
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

  // console.log(calculateResidualRiskScore());

  const calculateRiskScore = () => {
    if (selectedLikelihood && selectedImpact) {
      const riskScore = selectedLikelihood * selectedImpact;
      return riskScore;
    }
    return null;
  };
  const getRiskInfo = (riskScore) => {
    if (!riskScore || !riskMatrix) {
      return null; // Return null if riskScore is falsy or riskMatrix is undefined
    }

    // Find the corresponding range from riskMatrix
    const rangeInfo = riskMatrix.find((item) => {
      // Check if item.range exists and is not null
      if (item.range) {
        const [min, max] = item.range.split("-").map(Number);
        return riskScore >= min && riskScore <= max;
      } else {
        return false; // Return false if item.range is null
      }
    });

    return rangeInfo;
  };
  // console.log("riskMatrix", riskMatrix);

  const riskInfo = getRiskInfo(calculateRiskScore());

  // if (riskInfo) {
  //   console.log("Critical Step:", riskInfo.critical_step);
  //   console.log("Color:", riskInfo.color);
  // } else {
  //   console.log("No matching range found for the risk score.");
  // }

  // Compare risk score with risk appetite
  const compareRiskWithAppetite = () => {
    const riskScore = calculateRiskScore();
    if (riskScore === null) {
      return null; // Risk score cannot be compared
    }
    if (appetite > riskScore) {
      return (
        <span style={{ color: "green" }}>
          Risk Score is below Risk Appetite
        </span>
      );
    } else if (appetite < riskScore) {
      return (
        <span style={{ color: "red" }}>Risk Score is above Risk Appetite</span>
      );
    } else {
      return (
        <span style={{ color: "red" }}>
          Risk Score is equal to Risk Appetite
        </span>
      );
    }
  };

  // handle floating file upload
  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/register/import", formData);
      // Handle success
      // console.log("File uploaded successfully:", response);
      // message.success("File uploaded successfully");

      if (response.status === 200) {
        // Handle success
        // console.log("File uploaded successfully:", response);
        message.success("File uploaded successfully");

        // Redirect to register page
        // window.location.href = '/register';
        router.push("/register");
      } else {
        // Handle failure
        message.error("File upload failed");
      }
    } catch (error) {
      // Handle error
      console.error("Error uploading file:", error);
      message.error("Error uploading file");
    }
  };
  const handleImport = () => {
    // Make an API call to download the file
    axios({
      url: "/api/register/example/file", // Replace 'your-api-endpoint' with your actual API endpoint
      method: "GET",
      responseType: "blob", // Tell Axios to expect a blob (binary data)
    })
      .then((response) => {
        // Create a Blob from the response data
        const blob = new Blob([response.data], {
          type: "application/octet-stream",
        });
        // Create a link element
        const url = window.URL.createObjectURL(blob);
        // Create a temporary anchor element
        const a = document.createElement("a");
        a.href = url;
        a.download = "Add-Register-Example.xlsx"; // Specify the file name
        // Append the anchor element to the body
        document.body.appendChild(a);
        // Programmatically click the anchor element to start downloading
        a.click();
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
        // Handle error
      });
    setModalVisible(false);
  };

  const [modalVisible, setModalVisible] = useState(false);

  const handleImportModal = () => {
    setModalVisible(true);
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
                {t("add_register.add_new_register")}
                {/* :{data1.register.risk_name} */}
              </span>
            ),
          },
        ]}
      />
      {/* <Divider /> */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Title level={2}>{t("add_register.add_new_register")}</Title>
      </div>

      <Form
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
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
                  placeholder={t("add_register.input_name")}
                  suffix={
                    <Tooltip title="prompt text" color="blue">
                      <QuestionCircleOutlined
                        size={16}
                        style={{ alignItems: "center" }}
                      />
                    </Tooltip>
                  }
                />
              </Form.Item>
              <Form.Item
                name="owner_email"
                label={t("add_register.owner_email")}
                rules={[
                  {
                    required: true,
                    type: "email",
                  },
                ]}
              >
                <Input
                  placeholder={t("add_register.input_email")}
                  suffix={
                    <Tooltip title="prompt text" color="blue">
                      <QuestionCircleOutlined
                        size={16}
                        style={{ alignItems: "center" }}
                      />
                    </Tooltip>
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
                  placeholder={t("add_register.input_owner")}
                  suffix={
                    <Tooltip title="prompt text" color="blue">
                      <QuestionCircleOutlined
                        size={16}
                        style={{ alignItems: "center" }}
                      />
                    </Tooltip>
                  }
                  style={{ alignItems: "center" }}
                />
              </Form.Item>
              <Form.Item
                name="risk_date"
                label={t("add_register.date")}
                {...config}
              >
                <DatePicker style={{ width: "300px" }} />
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
                  placeholder={t("add_register.input_financial_impact")}
                  suffix={
                    <Tooltip title="prompt text" color="blue">
                      <QuestionCircleOutlined
                        size={16}
                        style={{ alignItems: "center" }}
                      />
                    </Tooltip>
                  }
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
                  placeholder={t("add_register.select_your_risk_category")}
                >
                  {category.map((categoryItem) => (
                    <Select.Option
                      key={categoryItem.id}
                      value={categoryItem.name}
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
                <Select placeholder={t("add_register.select_your_risk_status")}>
                  {status.map((statusItem) => (
                    <Select.Option key={statusItem.id} value={statusItem.name}>
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
                  placeholder={t("add_register.input_impact_area")}
                  suffix={
                    <Tooltip title="prompt text" color="blue">
                      <QuestionCircleOutlined
                        size={16}
                        style={{ alignItems: "center" }}
                      />
                    </Tooltip>
                  }
                  style={{ alignItems: "center" }}
                />
              </Form.Item>
              <Form.Item
                name="risk_identified"
                label={t("add_register.risk_details")}
              >
                <Input.TextArea
                  placeholder={t("add_register.input_risk_details")}
                  suffix={
                    <Tooltip title="prompt text" color="blue">
                      <QuestionCircleOutlined
                        size={16}
                        style={{ alignItems: "center" }}
                      />
                    </Tooltip>
                  }
                />
              </Form.Item>
              <Form.Item
                name="risk_casuse"
                label={t("add_register.risk_cause")}
              >
                <Input.TextArea
                  placeholder={t("add_register.input_risk_cause")}
                  suffix={
                    <Tooltip title="prompt text" color="blue">
                      <QuestionCircleOutlined
                        size={16}
                        style={{ alignItems: "center" }}
                      />
                    </Tooltip>
                  }
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
                      placeholder={t("add_register.select_your_risk_impact")}
                      style={{ width: 300 }}
                      onChange={(value) => handleImpactChange(value)}
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
                        "add_register.select_your_risk_likelihood"
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
                      onChange={(value) => handleResidualImpactChange(value)}
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
                      // placeholder={t(
                      //   "add_register.select_your_Residudal_likelihood"
                      // )}
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
                    // name="rs_score"
                    label={t("add_register.rs_score")}
                  >
                    <InputNumber
                      style={{ width: 300 }}
                      placeholder={t("add_register.rs_score")}
                      value={selectedImpact ? selectedImpact : ""}
                      disabled
                    />
                  </Form.Item>

                  <Form.Item
                    // name="rl_score"
                    label={t("add_register.rl_score")}
                  >
                    <InputNumber
                      style={{ width: 300 }}
                      placeholder={t("add_register.rl_score")}
                      value={selectedLikelihood ? selectedLikelihood : ""}
                      disabled
                    />
                  </Form.Item>
                  <Form.Item label={t("add_register.criticality_score")}>
                    <InputNumber
                      style={{ width: 300 }}
                      placeholder={t("add_register.criticality_score")}
                      value={calculateRiskScore()}
                      disabled
                    />
                  </Form.Item>
                </div>
                <Form.Item label="Risk Criticality">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <InputNumber
                      style={{
                        width: 300,
                        backgroundColor: riskInfo
                          ? riskInfo.color.startsWith("#")
                            ? riskInfo.color
                            : `#${riskInfo.color}`
                          : "white",
                      }}
                      placeholder="Criticality level"
                      value={riskInfo ? riskInfo.critical_step : ""}
                      disabled
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
          <Divider style={{ marginLeft: "-90px", width: "400px" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "5px",
              marginRight: "200px",
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              loading={loadings[0]}
              onClick={() => enterLoading(0)}
            >
              {t("submit")}
            </Button>
            <Button onClick={handleGoBackButton}>{t("back")}</Button>
          </div>
        </Form.Item>
      </Form>
      <FloatButton.Group
        trigger="click"
        style={{
          right: 24,
        }}
        type="primary"
        icon={<ImportOutlined />}
        tooltip="Import File"
      >
        <FloatButton
          icon={<QuestionCircleOutlined />}
          tooltip="How to Import(Example)"
          onClick={handleImportModal}
        />
        <Modal
          width={800}
          centered
          title=" "
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setModalVisible(false)}>
              Cancel
            </Button>,
            <Button key="download" type="primary" onClick={handleImport}>
              Download
            </Button>,
          ]}
        >
          <div style={{ marginTop: "20px" }}>
            <Alert
              message="Download Example"
              description={
                <div>
                  In the Excel sheet, the predefined and unchangeable headings
                  include <strong>SL</strong>, <strong>Risk Name</strong>,{" "}
                  <strong>Date</strong>, <strong>Risk Owner</strong>,{" "}
                  <strong>Owner Email</strong>, and other all headings. These
                  headings will serve as the key fields for importing data into
                  the database.
                </div>
              }
              type="info"
              showIcon
            />
          </div>

          <p></p>
        </Modal>
        <Upload
          customRequest={handleUpload}
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          showUploadList={false}
        >
          <FloatButton icon={<CloudUploadOutlined />} tooltip="Browse File" />
        </Upload>
      </FloatButton.Group>
    </>
  );
};

export default Add;
