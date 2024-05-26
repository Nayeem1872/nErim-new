import React from 'react';
import styles from "./style.module.css";

const Loader = () => (
  <div className={styles.container}>
    <img className={styles.logo} src="/image/logo1.png" alt="Logo" />
    <div className={styles.loader}></div>
  </div>
);

export default Loader;