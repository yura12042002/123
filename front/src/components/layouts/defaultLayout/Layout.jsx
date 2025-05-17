import React from "react";
import Header from "../../header/Header";
import Main from "../../main/Main";
import Footer from "../../footer/Footer";

const Layout = ({layoutText}) => {
  return (
    <div className='mainContainer'>
      <Header />
      <Main layoutText={layoutText} />
      <Footer />
    </div>
  );
};

export default Layout;
