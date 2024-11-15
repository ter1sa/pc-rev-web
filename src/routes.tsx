import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import CandidatesPage from "./components/CandidatesPage";
import GraphPage from "./components/GraphPage";
import UploadFilePage from "./components/UploadFilePage";

function PCRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route path="/" element={<UploadFilePage />} />
                    <Route path="/candidates" element={<CandidatesPage />} />
                    <Route path="/graph" element={<GraphPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default PCRoutes;
