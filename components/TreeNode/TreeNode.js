import React, { useEffect, useState } from "react";
import Image from "next/image";
import MemberDetailsPopper from "../MemberDetailsPopper";
import OptionsMenu from "../OptionsMenu";
import styles from "../../styles/TreeNode.module.scss";
import { deleteMember } from "../MemberDetailsPopper/utils";
import { getRandomColor } from "./utils";

const TreeNode = (props) => {
  const { data, membersMap } = props;
  const childrenCount = data?.child_ids?.length;

  const [expanded, setExpanded] = useState(true);
  const [randomColor, setRandomColor] = useState({});
  const [showMemberDetailsPopup, setShowMemberDetailsPopup] = useState({
    open: false,
    type: "",
  });
  const hasChild = childrenCount > 0;
  const hasMoreThanOneChild = childrenCount > 1;

  useEffect(() => {
    setRandomColor(getRandomColor());
  }, []);

  const optionHandler = (option = "clear") => {
    if (["add", "edit"].includes(option)) {
      setShowMemberDetailsPopup({ open: true, type: option });
    }
    if (option === "delete") {
      deleteMember(data.id);
    }
  };

  return (
    <>
      <MemberDetailsPopper
        open={showMemberDetailsPopup.open}
        onClose={() => setShowMemberDetailsPopup({ open: false, type: "" })}
        type={showMemberDetailsPopup.type}
        sourceMember={data}
      />
      <table className={styles.container}>
        <tbody>
          <tr className={styles.contentContainer}>
            <td className={styles.content} style={randomColor}>
              <div className={styles.picture}>
                <Image
                  width="100%"
                  height="100%"
                  src={data.photoUrl ? data.photoUrl : "assets/grey-fill.png"}
                  alt="Profile picture"
                />
              </div>
              <div className={styles.contentDescription}>
                <div className={styles.name}>
                  {data.name}
                  {data.spouse_name ? ` & ${data.spouse_name}` : ""}
                </div>
                <div className={styles.buttons}>
                  {hasChild && (
                    <button
                      className={styles.expandCollapseBtn}
                      onClick={() => setExpanded(!expanded)}
                    >
                      {expanded ? "Collapse" : "Expand"}
                    </button>
                  )}
                  <OptionsMenu optionHandler={optionHandler} />
                </div>
              </div>
            </td>
          </tr>
          {expanded && hasChild && (
            <>
              <tr className={styles.childrenLineContainer}>
                <td>
                  <div className={styles.childrenLine}></div>
                </td>
              </tr>
              {hasMoreThanOneChild && (
                <tr>
                  <td className={styles.rightLine}></td>
                  {[...Array(childrenCount - 1).keys()].map((_, id) => {
                    return (
                      <React.Fragment key={`${data.name}-children-${id}`}>
                        <td
                          className={`${styles.topLine} ${styles.leftLine}`}
                        ></td>
                        <td
                          className={`${styles.topLine} ${styles.rightLine}`}
                        ></td>
                      </React.Fragment>
                    );
                  })}
                  <td className={styles.leftLine}></td>
                </tr>
              )}
              <tr className={styles.childrenContainer}>
                {data.child_ids &&
                  data.child_ids.map((val) => {
                    return (
                      <td colSpan="2" key={val}>
                        <TreeNode
                          data={membersMap[val]}
                          membersMap={membersMap}
                        />
                      </td>
                    );
                  })}
              </tr>
            </>
          )}
        </tbody>
      </table>
    </>
  );
};

export default TreeNode;
