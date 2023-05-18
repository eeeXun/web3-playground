import { useState, useEffect } from "react";
import Web3 from "web3";

const MetaMask = (props) => {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    window.ethereum
      .request({
        method: "eth_getBalance",
        params: [String(props.account)],
      })
      .then((result) => {
        setBalance(Web3.utils.fromWei(String(result)) + " (ETH)");
      });
  }, [props.account]);

  return (
    <div className="text-xl">
      <h3 className="text-blue-600">Chain: {props.chain}</h3>
      <h3 className="text-blue-600">Address: {props.account}</h3>
      <h3 className="text-blue-600">Balance: {balance}</h3>
    </div>
  );
};

export default MetaMask;
