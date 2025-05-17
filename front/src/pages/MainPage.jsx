import React from "react";
import Layout from "../components/layouts/defaultLayout/Layout";

const textMainPage = {
    title: "Обучение frontend-разработке", 
    text: 'Здесь вас ждут индивидуальные занятия по фронтенд-разработке, лучшие проекты — включая работы учеников, начавших с нуля. И доступ к полезным подпискам и ресурсам. '
}

const MainPage = () => {
  return (
    <>
      <Layout layoutText={textMainPage}/>
    </>
  );
};

export default MainPage;
