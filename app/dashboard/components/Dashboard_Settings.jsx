"use client";
import React, { useContext, useState } from "react";
import { Button, Divider, Select, Drawer, Typography, Avatar } from "antd";
const { Title } = Typography;
import { DownOutlined, SettingOutlined } from "@ant-design/icons";
import MyContext from "@/provider/Context";
import { useTranslation } from "react-i18next";
import i18next from "../../../i18n";

const Dashboard_Settings = ({ isDarkMode, handleClick, showButton = true }) => {
  const [open, setOpen] = useState(false);
  const { value, updateValue } = useContext(MyContext);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  // dark and light mode

  const lightButtonStyle = {
    marginRight: "8px",
    backgroundColor: "#FFFFFF",
    color: "#191919",
  };

  const darkButtonStyle = {
    marginRight: "8px",
    backgroundColor: "#333333",
    color: "#FFFFFF",
  };

  const onChange = (value) => {
    console.log(`selected ${value}`);
    i18next.changeLanguage(value);
    localStorage.setItem("lang", value);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };

  const filterOption = (input, option) => {
    if (typeof option.label === "string") {
      return option.label.toLowerCase().includes(input.toLowerCase());
    } else if (React.isValidElement(option.label)) {
      const textContent = getTextContent(option.label);
      return textContent.toLowerCase().includes(input.toLowerCase());
    }
    return false;
  };

  const getTextContent = (element) => {
    if (typeof element === "string") {
      return element;
    } else if (React.isValidElement(element)) {
      const children = React.Children.toArray(element.props.children);
      return children.map((child) => getTextContent(child)).join("");
    }
    return "";
  };
  const options = [
    {
      value: "en",
      label: (
        <div>
          <Avatar
            size="small"
            src="https://cdn.countryflags.com/thumbs/united-states-of-america/flag-square-250.png"
            style={{ marginRight: "8px" }}
            alt="English flag"
          />
          English
        </div>
      ),
    },
    {
      value: "bn",
      label: (
        <div>
          <Avatar
            size="small"
            src="https://cdn.countryflags.com/thumbs/bangladesh/flag-square-250.png" // Replace with the URL of the US flag image
            style={{ marginRight: "8px" }}
          />
          Bangla
        </div>
      ),
    },
    // {
    //   value: "fi",
    //   label: (
    //     <div>
    //       <Avatar
    //         size="small"
    //         src="https://www.countryflags.com/wp-content/uploads/finland-flag-png-large.png" // Replace with the URL of the US flag image
    //         style={{ marginRight: "8px" }}
    //       />
    //       Finland
    //     </div>
    //   ),
    // },
    {
      value: "arb",
      label: (
        <div>
          <Avatar
            size="small"
            src="https://cdn.countryflags.com/thumbs/saudi-arabia/flag-square-250.png" // Replace with the URL of the US flag image
            style={{ marginRight: "8px" }}
          />
          Arabic
        </div>
      ),
    },
    {
      value: "norway",
      label: (
        <div>
          <Avatar
            size="small"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Norway.svg/2000px-Flag_of_Norway.svg.png" // Replace with the URL of the US flag image
            style={{ marginRight: "8px" }}
          />
          Norwegian
        </div>
      ),
    },
    // {
    //   value: "africa",
    //   label: (
    //     <div>
    //       <Avatar
    //         size="small"
    //         src="https://cdn.britannica.com/27/4227-004-32423B42/Flag-South-Africa.jpg" // Replace with the URL of the US flag image
    //         style={{ marginRight: "8px" }}
    //       />
    //       African(Swahili)
    //     </div>
    //   ),
    // },
    // ...other options
  ];

  return (
    <>
      {showButton && (
        <Button type="primary" onClick={showDrawer}>
          <SettingOutlined size={30} />
        </Button>
      )}

      <Drawer title="Settings" onClose={onClose} open={open}>
        <div>
          <Title level={4}>Layout Theme</Title>

          {/* <Button
        style={isDarkMode ? darkButtonStyle : lightButtonStyle}
      >
        Auto Mode
      </Button> */}
          {/* <p>Context Value: {value}</p> */}
          <Button
            style={isDarkMode ? darkButtonStyle : lightButtonStyle}
            onClick={handleClick}
            disabled={!isDarkMode}
          >
            Light Mode
          </Button>
          <Button
            style={isDarkMode ? lightButtonStyle : darkButtonStyle}
            onClick={handleClick}
            disabled={isDarkMode}
          >
            Dark Mode
          </Button>
        </div>
        <Divider />

        {/* <div>
          <Title level={4}>Graph Theme</Title>
          <Button onClick={() => updateValue("basic")}>Default</Button>
          <Button
            style={{ marginLeft: "10px" }}
            onClick={() => updateValue("classic")}
          >
            classic
          </Button>
        </div> */}
        {/* <Divider /> */}
        <Title level={4}>Languages</Title>
        <div>
          {/* {i18next.language === 'en' ? (
        <>
        <button onClick={() => changeLanguage('fi')}>Switch to Finnish</button>
        <button onClick={() => changeLanguage('bn')}>Switch to Bengali</button>
      </>
        ) : (
          <button onClick={() => changeLanguage('en')}>Switch to English</button>
        )} */}
          <Select
            showSearch
            placeholder="Select a Language"
            onChange={onChange}
            optionFilterProp="children"
            onSearch={onSearch}
            filterOption={filterOption}
            style={{ width: "250px" }}
            options={options}
            // options={[
            //   {
            //     value: 'en',
            //     label: (
            //       <div>
            //         <Avatar
            //           size="small"
            //           src="https://cdn.countryflags.com/thumbs/united-states-of-america/flag-square-250.png" // Replace with the URL of the US flag image
            //           style={{ marginRight: '8px' }}
            //         />
            //         English
            //       </div>
            //     ),
            //     // label: "English"
            //   },
            //   {
            //     value: 'bn',
            //     // label: (
            //     //   <div>
            //     //     <Avatar
            //     //       size="small"
            //     //       src="https://cdn.countryflags.com/thumbs/bangladesh/flag-square-250.png" // Replace with the URL of the US flag image
            //     //       style={{ marginRight: '8px' }}
            //     //     />
            //     //     Bangla
            //     //   </div>
            //     // ),
            //     label: "Bng"
            //   },
            //   {
            //     value: 'fi',
            //     // label: (
            //     //   <div>
            //     //     <Avatar
            //     //       size="small"
            //     //       src="https://www.countryflags.com/wp-content/uploads/finland-flag-png-large.png" // Replace with the URL of the US flag image
            //     //       style={{ marginRight: '8px' }}
            //     //     />
            //     //    Finland
            //     //   </div>
            //     // ),
            //     label: "English"
            //   },
            //   {
            //     value: 'arb',
            //     // label: (
            //     //   <div>
            //     //     <Avatar
            //     //       size="small"
            //     //       src="https://cdn.countryflags.com/thumbs/saudi-arabia/flag-square-250.png" // Replace with the URL of the US flag image
            //     //       style={{ marginRight: '8px' }}
            //     //     />
            //     //     Arabic
            //     //   </div>
            //     // ),
            //     label:"English"
            //   },
            // ]}
          />
        </div>
      </Drawer>
    </>
  );
};

export default Dashboard_Settings;
