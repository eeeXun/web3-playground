import { useEffect } from "react";
import Web3 from "web3";
import DiplomaABI from "../data/Diploma.json";

const DiplomaView = () => {
  const address = "0xCfEe0D93a77133026d9Ba44286877b226601F901";
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(DiplomaABI, address);

  useEffect(() => {
    contract.events.Award(
      {
        filter: {
          receiver: "0x883d2E86019Fc88596211922DE91cEdb4D87A26e",
        },
        fromBlock: 0,
      },
      (error, event) => {
        if (error) {
          console.log("Error" + error);
        } else {
          // console.log("Award: " + event);
          console.log(event);
        }
      }
    );
  });

  return (
    <div className="m-1 text-xl text-blue-600">
      <p>Contract Address: {address}</p>
    </div>
  );
};

export default DiplomaView;
