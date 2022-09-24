import { useEffect } from "react";
import { initFirebaseApp } from "../utils/firebaseSetup";
import { addAuthStateObserver } from "../components/LoginAndSignUp/utils";

const style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

initFirebaseApp();

export default function Home() {
  useEffect(() => {
    addAuthStateObserver(
      () => (window.location.href = "/familytree"),
      () => (window.location.href = "/login")
    );
  }, []);
  return <div style={style}>Please wait...</div>;
}
