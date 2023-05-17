import { useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import Faucet from "./Faucet";

const MetaMask = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [chain, setChain] = useState(null);
  const [onSepolia, setOnSepolia] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  const connectWallect = () => {
    detectEthereumProvider().then((result) => {
      if (result) {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((result) => {
            accountChanged([result[0]]);
          });
        setErrMsg(null);
      } else {
        setErrMsg("Install MetaMask!");
      }
    });
  };

  const accountChanged = (accountAddr) => {
    setAccount(accountAddr);
    getBalance(accountAddr);
    getChain();
  };

  const getBalance = (accountAddr) => {
    window.ethereum
      .request({
        method: "eth_getBalance",
        params: [String(accountAddr)],
      })
      .then((result) => {
        setBalance(Web3.utils.fromWei(String(result)) + " (ETH)");
      });
  };

  const getChain = () => {
    window.ethereum.request({ method: "eth_chainId" }).then((result) => {
      switch (parseInt(result, 16)) {
        case 11155111:
          setChain("Sepolia");
          setOnSepolia(true);
          break;
        case 5:
          setChain("Goerli (Not supported)");
          setOnSepolia(false);
          break;
        case 1337:
          setChain("Ganache (Not supported)");
          setOnSepolia(false);
          break;
        default:
          setChain("Chain not recognized!");
          setOnSepolia(false);
          break;
      }
    });
  };

  return (
    <div className="text-xl m-5">
      {account ? (
        <div className="grid gap-4">
          <div className="border-blue-400 border-2 rounded-lg">
            <h3 className="text-blue-600">Chain: {chain}</h3>
            <h3 className="text-blue-600">Address: {account}</h3>
            <h3 className="text-blue-600">Balance: {balance}</h3>
            <h3 className="text-blue-600">{errMsg}</h3>
          </div>
          {onSepolia ? (
            <div className="border-blue-400 border-2 rounded-lg">
              <Faucet />
            </div>
          ) : null}
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
            onClick={connectWallect}
          >
            Refresh
          </button>
        </div>
      ) : (
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
          onClick={connectWallect}
        >
          Connect to MetaMask
        </button>
      )}
    </div>
  );
};

export default MetaMask;
