import React, { useCallback, useState, useEffect } from "react";
import styles from "../../styles/MemberDetailsPopper.module.scss";
import { addChild, updateMember } from "./utils";

const MemberDetailsPopper = (props) => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [addSpouseClicked, setAddSpouseClicked] = useState(false);
  const [spouseName, setSpouseName] = useState("");
  const [spouseGender, setSpouseGender] = useState("");
  const [dob, setDob] = useState("");
  const [photo, setPhoto] = useState("");

  const { open, onClose, type, sourceMember } = props;

  const reverseDateFormat = (dateStr) => {
    const dateArr = dateStr.split("-");
    return `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`;
  };

  const fillFormForEdit = useCallback((data) => {
    setName(data.name);
    setGender(data.gender);
    setAddSpouseClicked(data.spouse_name !== "");
    setSpouseName(data.spouse_name);
    setSpouseGender(data.spouse_gender);
    setDob(reverseDateFormat(data.dob));
  }, []);

  useEffect(() => {
    if (type === "edit") {
      fillFormForEdit(sourceMember);
    }
  }, [type, sourceMember, fillFormForEdit]);

  const resetFormAndClose = () => {
    setName("");
    setGender("");
    setAddSpouseClicked(false);
    setSpouseName("");
    setSpouseGender("");
    setDob("");
    setPhoto("");
    onClose();
  };

  const submitHandler = async (e) => {
    const isValid =
      name &&
      gender &&
      dob &&
      (addSpouseClicked ? spouseName && spouseGender : true);
    if (isValid) {
      e.preventDefault();
      if (type === "add") {
        const payload = {
          name,
          gender,
          dob: reverseDateFormat(dob),
          photo,
          child_ids: [],
          parent_ids: [sourceMember.id],
          spouse_name: addSpouseClicked ? spouseName : "",
          spouse_gender: addSpouseClicked ? spouseGender : "",
        };
        await addChild(sourceMember.id, payload);
      }
      if (type === "edit") {
        const payload = {
          name,
          gender,
          dob: reverseDateFormat(dob),
          photo,
          spouse_name: addSpouseClicked ? spouseName : "",
          spouse_gender: addSpouseClicked ? spouseGender : "",
        };
        await updateMember(sourceMember.id, payload);
      }
      resetFormAndClose();
    }
  };

  if (!open) {
    return null;
  }

  const requiredAsterisk = <span className={styles.required}>*</span>;

  return (
    <div className={styles.overlayContainer}>
      <div className={styles.popperContainer}>
        <h3>Add a child:</h3>
        <form>
          <div className={styles.nameRow}>
            <label>Name{requiredAsterisk}:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              required
            />
          </div>
          <div className={styles.genderRow}>
            <label>Gender{requiredAsterisk}:</label>
            <select
              onChange={(e) => setGender(e.target.value)}
              value={gender}
              required
            >
              {gender === "" && <option value="">Select a gender</option>}
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setAddSpouseClicked((add) => !add)}
            >{`${addSpouseClicked ? "Remove" : "Add"} Spouse`}</button>
          </div>
          {addSpouseClicked && (
            <>
              <div>
                <label>Spouse&apos;s Name{requiredAsterisk}:</label>
                <input
                  type="text"
                  value={spouseName}
                  onChange={(e) => {
                    setSpouseName(e.target.value);
                  }}
                  required
                />
              </div>
              <div className={styles.genderRow}>
                <label>Spouse&apos;s Gender{requiredAsterisk}:</label>
                <select
                  onChange={(e) => setSpouseGender(e.target.value)}
                  value={spouseGender}
                  required
                >
                  {spouseGender === "" && (
                    <option value="">Select a gender</option>
                  )}
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
              </div>
            </>
          )}
          <div>
            <label>Date of birth{requiredAsterisk}:</label>
            <input
              type="date"
              onChange={(e) => {
                setDob(e.target.value);
              }}
              value={dob}
              required
            />
          </div>
          <div>
            <label>Photo:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setPhoto(e.target.files[0]);
              }}
            />
          </div>
          <div className={styles.submitBtn}>
            <button type="submit" onClick={submitHandler}>
              Save
            </button>
            <button type="button" onClick={resetFormAndClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberDetailsPopper;
