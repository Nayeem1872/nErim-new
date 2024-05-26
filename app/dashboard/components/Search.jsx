"use client";
import { ArrowRightOutlined, UserOutlined } from "@ant-design/icons";
import { AutoComplete, Input } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Search = () => {
  const { t } = useTranslation();
  const renderTitle = (title) => <span>{title}</span>;

  const renderItem = (title, count, path) => ({
    value: title,
    label: (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {title}
        <span>
          {/* <UserOutlined /> {count} */}
          <ArrowRightOutlined />
        </span>
      </div>
    ),
    path: path,
  });

  const options = [
    {
      label: renderTitle("Register"),
      options: [
        renderItem("Register Table"),
        renderItem("Register Add",),
      ],
    },
    {
      label: renderTitle("Risk Treatment"),
      options: [
        renderItem("Risk Treatment Table"),
      ],
    },
    {
      label: renderTitle("Settings"),
      options: [
        renderItem("Currency"),
      ],
    },
  ];

  const router = useRouter();

  //   const handleSelect = (value, option) => {
  //     if (value === "Register Table") {
  //         router.push("/dashboard/register");
  //     } else if (value === "AntDesign") {
  //         router.push("/dashboard/add");
  //     }
  //   };
  const [searchText, setSearchText] = useState("");

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleSelect = (value, option) => {
    if (value === "Register Table") {
      router.push("/dashboard/register");
    } else if (value === "Register Add") {
      router.push("/dashboard/register/add");
    }else if (value === "Risk Treatment Table") {
        router.push("/dashboard/risk_treatment");
      }else if (value === "Currency") {
        router.push("/dashboard/settings");
      }
  };

  // Filter options based on the search text
  const filteredOptions = options.map((group) => ({
    ...group,
    options: group.options.filter((opt) =>
      opt.value.toLowerCase().includes(searchText.toLowerCase())
    ),
  }));

  return (
    <div>
      <AutoComplete
        popupClassName="certain-category-search-dropdown"
        popupMatchSelectWidth={500}
        style={{
          width: 250,
        }}
        options={filteredOptions}
        size="large"
        onSelect={handleSelect}
        onSearch={handleSearch}
      >
        <Input
        popupClassName="certain-category-search-dropdown"
        popupMatchSelectWidth={500}
        style={{
          width: 250,
          marginRight: "50px"
        }}
        options={filteredOptions}
        size="large"
        onSelect={handleSelect}
        onSearch={handleSearch}
          // style={{ marginRight: "50px" }}
          placeholder={t("search_here")}
          allowClear
        />
      </AutoComplete>
    </div>
  );
};

export default Search;
