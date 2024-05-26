"use client"
import MenuLink from "./menuLink/menuLink";
import styles from "./sidebar.module.css";
import { CiCircleChevLeft } from "react-icons/ci";
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdAttachMoney,
  MdWork,
  MdAnalytics,
  MdPeople,
  MdOutlineSettings,
  MdHelpCenter,
  MdLogout,
} from "react-icons/md";
import { useState } from "react";

const menuItems = [
    {
      title: "Pages",
      list: [
        {
          title: "Dashboard",
          path: "/dashboard",
          icon: <MdDashboard />,
        },
        {
          title: "Users",
          path: "/dashboard/users",
          icon: <MdSupervisedUserCircle />,
        },
        {
          title: "Products",
          path: "/dashboard/profile",
          icon: <MdShoppingBag />,
        },
        {
          title: "Transactions",
          path: "/dashboard/transactions",
          icon: <MdAttachMoney />,
        },
      ],
    },
    {
      title: "Analytics",
      list: [
        {
          title: "Revenue",
          path: "/dashboard/revenue",
          icon: <MdWork />,
        },
        {
          title: "Reports",
          path: "/dashboard/reports",
          icon: <MdAnalytics />,
        },
        {
          title: "Teams",
          path: "/dashboard/teams",
          icon: <MdPeople />,
        },
      ],
    },
    {
      title: "User",
      list: [
        {
          title: "Settings",
          path: "/dashboard/settings",
          icon: <MdOutlineSettings />,
        },
        {
            title: "Settings",
            path: "/dashboard/settings",
            icon: <MdOutlineSettings />,
          },
        {
          title: "Help",
          path: "/dashboard/help",
          icon: <MdHelpCenter />,
        },
      ],
    },
  ];

const Sidebar = () => {
    const [isCollapsedSidebar, setIsCollapsedSidebar] = useState(false);

    const toogleSidebarCollapseHandler = () => {
      setIsCollapsedSidebar((prev) => !prev);
    };
  
    return (
      <div className={`${styles.container} ${isCollapsedSidebar ? styles.collapsed : ''}`}>
        <button className={styles.btn} onClick={toogleSidebarCollapseHandler}>
          <CiCircleChevLeft />
        </button>
  
        <div className={styles.user}>
          <img
            className={styles.userImage}
            src={"/image/face-5.jpeg"}
            alt=""
            width="50"
            height="50"
          />
          <div className={styles.userDetail}>
            <span className={styles.username}>Nayeem</span>
            <span className={styles.userTitle}>Administrator</span>
          </div>
        </div>
        <ul className={styles.list}>
          {menuItems.map((cat) => (
            <li key={cat.title}>
              <span className={styles.cat}>{cat.title}</span>
              {cat.list.map((item) => (
                <MenuLink item={item} key={item.title} />
              ))}
            </li>
          ))}
        </ul>
        <form>
          <button className={styles.logout}>
            <MdLogout />
            Logout
          </button>
        </form>
      </div>
    );
  };

export default Sidebar