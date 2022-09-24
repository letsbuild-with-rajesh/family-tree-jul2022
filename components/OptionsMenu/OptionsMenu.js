import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "../../styles/OptionsMenu.module.scss";

const OptionsMenu = (props) => {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const ref = useRef(null);

  const { optionHandler } = props;

  const handleOutsideClick = useCallback(
    (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOptionsOpen(false);
        optionHandler();
      }
    },
    [ref, optionHandler]
  );

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true);
    return () =>
      document.removeEventListener("click", handleOutsideClick, true);
  }, [handleOutsideClick]);

  return (
    <span ref={ref}>
      <button
        className={styles.moreBtn}
        onClick={() => {
          setOptionsOpen((open) => !open);
        }}
      >
        More
      </button>
      {optionsOpen && (
        <div
          onClick={() => {
            setOptionsOpen(false);
          }}
          className={styles.moreBtnContent}
        >
          <div onClick={() => optionHandler("add")}>Add</div>
          <div onClick={() => optionHandler("edit")}>Edit</div>
          <div onClick={() => optionHandler("delete")}>Delete</div>
        </div>
      )}
    </span>
  );
};

export default OptionsMenu;
