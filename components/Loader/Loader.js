import React from "react";
import styles from "../../styles/Loader.module.scss";

const Loader = (props) => {
  const { text } = props;
  return (
    <div className={styles.overlay}>
      <div className={styles.loader} />
      {text && <span>{text}</span>}
    </div>
  );
};

export default Loader;
