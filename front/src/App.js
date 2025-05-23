import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import PreviewPage from "./pages/PreviewPage";
import TurismPage from "./pages/TurismPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/travel" element={<TurismPage />} />
        <Route path="/preview" element={<PreviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
