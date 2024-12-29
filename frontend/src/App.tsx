import { BrowserRouter, Route, Routes } from "react-router-dom";

import CodingPage from "./pages/CodingPage";

import IndexPage from "@/pages/index";

function App() {
  return (
  <BrowserRouter>
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route element={<CodingPage />} path="/coding" />
      </Routes>
  </BrowserRouter>
  );
}

export default App;
