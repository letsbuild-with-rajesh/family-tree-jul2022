import { useEffect, useState } from "react";
import Header from "../components/Header";
import Loader from "../components/Loader";
import TreeNode from "../components/TreeNode";
import LoginAndSignUp from "../components/LoginAndSignUp";
import { initFirebaseApp } from "../utils/firebaseSetup";
import { addAuthStateObserver } from "../components/LoginAndSignUp/utils";

initFirebaseApp();

export default function Home() {
  const [authLoaded, setAuthLoaded] = useState(false);
  const [landingPage, setLandingPage] = useState("");

  const handleDisplayPage = (page) => {
    setAuthLoaded(true);
    setLandingPage(page);
  };
  useEffect(() => {
    addAuthStateObserver(
      () => handleDisplayPage("familytree"),
      () => handleDisplayPage("login")
    );
  }, []);

  if (!authLoaded) {
    return <Loader text="" />;
  }
  return (
    <div>
      <Header />
      {landingPage === "familytree" ? <TreeNode /> : <LoginAndSignUp />}
    </div>
  );
}
