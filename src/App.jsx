import HomePage from "./views/HomePage";
import FaucetPage from "./views/FaucetPage";
import ERC20Page from "./views/ERC20Page";
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
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/faucet" element={<FaucetPage />}></Route>
        <Route path="/erc20" element={<ERC20Page />}></Route>
      </Routes>
    </div>
  );
};

export default App;
