import HomePage from "./views/HomePage";
import FaucetPage from "./views/FaucetPage";
import ERC20Page from "./views/ERC20Page";
import DiplomaIssuePage from "./views/DiplomaIssuePage";
import DiplomaViewPage from "./views/DiplomaViewPage";
import { Route, Routes, Link } from "react-router-dom";

const App = () => {
  return (
    <div className="text-center">
      <nav className="flex space-x-4 text-2xl bg-blue-400">
        <Link className="text-white rounded-lg hover:bg-blue-500" to="/">
          Home
        </Link>
        <Link className="text-white rounded-lg hover:bg-blue-500" to="/faucet">
          Faucet
        </Link>
        <Link className="text-white rounded-lg hover:bg-blue-500" to="/erc20">
          ERC20
        </Link>
        <Link
          className="text-white rounded-lg hover:bg-blue-500"
          to="/dpmissue"
        >
          Diploma Issue
        </Link>
        <Link className="text-white rounded-lg hover:bg-blue-500" to="/dpmview">
          Diploma View
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/faucet" element={<FaucetPage />}></Route>
        <Route path="/erc20" element={<ERC20Page />}></Route>
        <Route path="/dpmissue" element={<DiplomaIssuePage />}></Route>
        <Route path="/dpmview" element={<DiplomaViewPage />}></Route>
      </Routes>
    </div>
  );
};

export default App;
