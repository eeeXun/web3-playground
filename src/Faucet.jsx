import { useState } from "react";
import Web3 from "web3";

const Faucet = () => {
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const address = "0xD75035e79411558b24a553b6cDf7439488C20457";

  window.ethereum
    .request({
      method: "eth_getBalance",
      params: [String(address)],
    })
    .then((result) => {
      setBalance(`${Web3.utils.toBN(result)} wei (${Web3.utils.fromWei(String(result))} ETH)`);
    });

  const withdraw = async () => {
    const web3 = new Web3(window.ethereum);
    // https://github.com/snsd0805/Testnet_faucet_web/blob/master/src/views/FaucetView.vue#L36-L55
    const encodeFunctionCall = web3.eth.abi.encodeFunctionCall(
      {
        inputs: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      [web3.utils.toBN(amount)]
    );
    const transactionParameters = {
      from: window.ethereum.selectedAddress,
      to: address,
      data: encodeFunctionCall,
      value: "0x00",
    };
    console.log(encodeFunctionCall);
    console.log(transactionParameters);

    const txHash = await ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    console.log(txHash);
  };

  return (
    <div className="text-xl m-5">
      <div className="text-blue-600">
        <p>Contract Address: {address}</p>
        <p>Contract Balance: {balance}</p>
      </div>
      <form
        className="m-3"
        onSubmit={(event) => {
          event.preventDefault();
          withdraw();
        }}
      >
        <label className="text-blue-600" htmlFor="amountInput">
          Withdraw from Faucet (wei):
        </label>
        <input
          className="border-2 rounded-lg border-blue-600"
          id="amountInput"
          onChange={(event) => setAmount(event.target.value)}
        />
        <button className="bg-blue-600 text-white rounded-lg m-3" type="submit">
          {Web3.utils.fromWei(String(amount))} (ETH)
        </button>
      </form>
    </div>
  );
};

export default Faucet;
