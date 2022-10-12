import React, { useEffect, useState } from "react";
import Image from "next/image";
import MemberDetailsPopper from "../MemberDetailsPopper";
import OptionsMenu from "../OptionsMenu";
import styles from "../../styles/TreeNode.module.scss";
import { deleteMember } from "../MemberDetailsPopper/utils";
import { getTreeNodeLevelColor } from "./utils";

const TreeNode = (props) => {
  const { data, membersMap, level, hideControls } = props;
  const childrenCount = data?.child_ids?.length;

  const [expanded, setExpanded] = useState(true);
  const [showMemberDetailsPopup, setShowMemberDetailsPopup] = useState({
    open: false,
    type: "",
  });
  const hasChild = childrenCount > 0;
  const hasMoreThanOneChild = childrenCount > 1;

  const optionHandler = (option = "clear") => {
    if (["add", "edit"].includes(option)) {
      setShowMemberDetailsPopup({ open: true, type: option });
    }
    if (option === "delete") {
      deleteMember(data.id);
    }
  };

  const renderNameAndGender = (details) => {
    const { name, gender, spouse_name, spouse_gender } = details;
    const genderObj = {
      male: { style: styles.genderMale, text: 'M' },
      female: { style: styles.genderFemale, text: 'F' }
    };
    return (
      <>
        <span className={styles.name}>
          {name}&nbsp;
          <span className={genderObj[gender].style}>({genderObj[gender].text})</span>
          {spouse_name && (
            <>
              {" & "}
              {spouse_name}&nbsp;
              <span className={genderObj[spouse_gender].style}>({genderObj[spouse_gender].text})</span>
            </>
          )}
        </span>
      </>
    );
  };

  const getAge = (dateStr) => {
    const dateArr = dateStr.split("-");
    const formattedDate = `${dateArr[1]}/${dateArr[0]}/${dateArr[2]}`;
    const timediffInMilliSecs = Date.now() - new Date(formattedDate).getTime();
    const timediff = new Date(timediffInMilliSecs);
    const year = timediff.getUTCFullYear();
    const age = Math.abs(year - 1970);
    return age === 0 ? "Less than a year" : age;
  };

  return (
    <>
      <MemberDetailsPopper
        open={showMemberDetailsPopup.open}
        onClose={() => setShowMemberDetailsPopup({ open: false, type: "" })}
        type={showMemberDetailsPopup.type}
        sourceMember={data}
      />
      {data && (
        <table className={styles.container}>
          <tbody>
            <tr className={styles.contentContainer}>
              <td className={styles.content} style={getTreeNodeLevelColor(level)} >
                <div className={styles.picture}>
                  {data.photoUrl && <Image
                    width="120"
                    height="120"
                    src={data.photoUrl}
                    alt="Profile picture"
                    layout="fill"
                    objectFit="contain"
                  />}
                </div>
                <div className={styles.contentDescription}>
                  <div className={styles.contentText}>
                    <div className={styles.name}>
                      {renderNameAndGender(data)}
                    </div>
                    <div className={styles.age}>Age: {getAge(data.dob)}</div>
                  </div>
                  {!hideControls && <div className={styles.buttons}>
                    {hasChild && (
                      <button
                        className={styles.expandCollapseBtn}
                        onClick={() => setExpanded(!expanded)}
                      >
                        {expanded ? "Collapse" : "Expand"}
                      </button>
                    )}
                    <OptionsMenu optionHandler={optionHandler} />
                  </div>}
                </div>
              </td>
            </tr>
            {expanded && hasChild && (
              <>
                <tr className={styles.childrenLineContainer}>
                  <td>
                    <div className={styles.childrenLine} />
                  </td>
                </tr>
                {hasMoreThanOneChild && (
                  <tr>
                    <td className={styles.rightLine} />
                    {[...Array(childrenCount - 1).keys()].map((_, id) => {
                      return (
                        <React.Fragment key={`${data.name}-children-${id}`}>
                          <td className={`${styles.topLine} ${styles.leftLine}`} />
                          <td className={`${styles.topLine} ${styles.rightLine}`} />
                        </React.Fragment>
                      );
                    })}
                    <td className={styles.leftLine} />
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
                            level={level + 1}
                            hideControls={hideControls}
                          />
                        </td>
                      );
                    })}
                </tr>
              </>
            )}
          </tbody>
        </table>
      )}
    </>
  );
};

export default TreeNode;
