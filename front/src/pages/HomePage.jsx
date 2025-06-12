import HighlightedCode from "../components/highlightedCode/HighlightedCode";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import FlyingIcons from "../components/flyingIcons/FlyingIcons";
import HeroSection from "../components/heroSection/HeroSection";
import styles from './homePage.module.css'


const HomePage = () => {
  return (
    <>
      <Header />
      <main className={styles.mainHomePage}>
        <HeroSection />
        <HighlightedCode />
      </main>
      <FlyingIcons show={true} />
      <Footer />
    </>
  );
};

export default HomePage;
