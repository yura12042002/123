import React from "react";
import BlockTextLayout from "../components/layouts/blockTextLayout/BlockTextLayout";
import HighlightedCode from "../components/highlightedCode/HighlightedCode";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import FlyingIcons from "../components/flyingIcons/FlyingIcons";

const textMainPage = {
  title: "Обучение frontend-разработке",
  text: `Меня зовут Юрий, я занимаюсь фронтенд‑разработкой более 3 лет и преподаю индивидуально уже свыше 1.5 лет. Помогаю ученикам с любым уровнем подготовки освоить HTML, CSS, JavaScript, React и создать реальные проекты с нуля. Даю полную поддержку на всех этапах обучения, включая подготовку к экзаменам, собеседованиям и работу с backend.`,
};

const HomePage = () => {
  return (
    <>
      <Header />
      <main>
        <BlockTextLayout layoutText={textMainPage} />
        <HighlightedCode />
      </main>
      <FlyingIcons show={true} />

      <Footer />
    </>
  );
};

export default HomePage;
