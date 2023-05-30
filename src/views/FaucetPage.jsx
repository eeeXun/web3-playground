import { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import MetaMask from "../components/MetaMask";
import Faucet from "../components/Faucet";

const FaucetPage = () => {
  const [account, setAccount] = useState(null);
  const [chain, setChain] = useState(null);
  const [onSepolia, setOnSepolia] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  const connectWallect = () => {
    detectEthereumProvider().then((result) => {
      if (result) {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((result) => {
            setAccount([result[0]]);
          });
        setErrMsg(null);
      } else {
        setErrMsg("Install MetaMask!");
      }
    });
  };

  useEffect(() => {
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
  }, [account]);

  return (
    <>
      <h1 className="my-8 text-5xl font-bold text-blue-600">Web3 Faucet</h1>
      {account ? (
        <>
          <div className="m-3 rounded-lg border-2 border-blue-400">
            <MetaMask account={account} chain={chain} />
          </div>
          {onSepolia ? (
            <div className="m-3 rounded-lg border-2 border-blue-400">
              <Faucet />
            </div>
          ) : null}
          <button
            className="text-xl text-white bg-blue-600 rounded-lg hover:bg-blue-500"
            onClick={connectWallect}
          >
            Refresh
          </button>
        </>
      ) : (
        <button
          className="text-xl text-white bg-blue-600 rounded-lg hover:bg-blue-500"
          onClick={connectWallect}
        >
          Connect to MetaMask
        </button>
      )}
      <h3 className="text-blue-600">{errMsg}</h3>
    </>
  );
};

export default FaucetPage;
