import React, { useState } from "react";
import Loader from "../Loader";
import { signIn, signUp, sendPasswordResetUrl } from "./utils";
import styles from "../../styles/LoginAndSignUp.module.scss";

const LoginAndSignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState({ show: false, text: "" });

  const signInHandler = (e) => {
    e.preventDefault();
    setLoader({ show: true, text: "Signing In..." });
    signIn(
      email,
      password,
      () => {
        setLoader({ show: false, text: "" });
      },
      () => {
        setLoader({ show: false, text: "" });
      }
    );
  };

  const signUpHandler = (e) => {
    e.preventDefault();
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
      alert("Please provide a valid email id");
      return;
    } else if (password.length <= 8) {
      alert("Password must be of length more than 8");
      return;
    }
    setLoader({ show: true, text: "Signing Up..." });
    signUp(
      email,
      password,
      () => {
        setLoader({ show: false, text: "" });
        alert(
          "A verification email has been sent to your Email Id! Please verify your Email Id and sign in."
        );
      },
      () => {
        setLoader({ show: false, text: "" });
      }
    );
  };

  const resetPasswordHandler = (e) => {
    e.preventDefault();
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
      alert("Please provide a valid email id");
      return;
    }
    setLoader({ show: true, text: "Sending Password reset mail..." });
    sendPasswordResetUrl(
      email,
      () => {
        setLoader({ show: false, text: "" });
        alert("Password reset email sent! Please reset password and come back");
      },
      () => {
        setLoader({ show: false, text: "" });
      }
    );
  };

  return (
    <>
      <div className={styles.container}>
        <form>
          <h3>Sign In</h3>
          <div>
            <label>Email address:</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div className={styles.submitBtns}>
            <button type="submit" onClick={signInHandler}>
              Sign In
            </button>
            <button type="submit" onClick={signUpHandler}>
              Sign Up
            </button>
            <button type="submit" onClick={resetPasswordHandler}>
              Reset Password
            </button>
          </div>
        </form>
      </div>
      {loader.show && <Loader text={loader.text} />}
    </>
  );
};

export default LoginAndSignUp;
