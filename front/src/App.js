import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import PreviewPage from "./pages/PreviewPage";
import TurismPage from "./pages/TurismPage";
import FinancePage from "./pages/FinancePage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mentor" element={<MainPage />} />
        <Route path="/travel" element={<TurismPage />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/finance" element={<FinancePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
