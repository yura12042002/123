import React from "react";
import style from "./main.module.css";
import FlyingIcons from "../flyingIcons/FlyingIcons";
import Mentor from "../../pages/Mentor";

const Main = () => {
  return (
    <>
      <main className={style.main}>
        <Mentor/>
      </main>
      <FlyingIcons show={true} />
    </>
  );
};

export default Main;
