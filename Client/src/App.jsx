import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Home from "./components/home/Home";
import Chat from "./components/pages/Chat/Chat";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
