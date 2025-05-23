import React from "react";
// import BlockTextLayout from "../layouts/blockTextLayout/BlockTextLayout";
import style from "./main.module.css";
// import HighlightedCode from "../highlightedCode/HighlightedCode";
import FlyingIcons from "../flyingIcons/FlyingIcons";
import Mentor from "../../pages/Mentor";

const Main = ({ layoutText }) => {
  return (
    <>
      <main className={style.main}>
        {/* <BlockTextLayout layoutText={layoutText} />
        <HighlightedCode /> */}
        <Mentor/>
      </main>
      <FlyingIcons show={true} />
    </>
  );
};

export default Main;
