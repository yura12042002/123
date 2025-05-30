import React from "react";
import Header from "../../header/Header";
import Main from "../../main/Main";
import Footer from "../../footer/Footer";

const Layout = () => {
  return (
    <div className='mainContainer'>
      <Header />
      <Main />
      <Footer />
    </div>
  );
};

export default Layout;
