import { useEffect, useState } from "react";
import Web3 from "web3";
import DiplomaABI from "../data/Diploma.json";

const DiplomaView = () => {
  const address = "0xdCD6da5100a26B868CEc9ea0739d1b1558EE86DB";
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(DiplomaABI, address);
  let diplomas = [];
  // const [diplomas, setDiplomas] = useState();

  useEffect(() => {
    contract.getPastEvents(
      "Award",
      {
        filter: {
          to: window.ethereum.selectedAddress,
        },
        fromBlock: 0,
      },
      (error, event) => {
        if (error) {
          console.log(error);
        } else {
          for (let i = 0; i < event.length; i++) {
            diplomas.push([
              event[i].returnValues.to,
              event[i].returnValues.degree,
              event[i].returnValues.deparment,
            ]);
          }
          diplomaUpdate();
        }
      }
    );
  });

  const diplomaUpdate = () => {
    console.log(diplomas);
    console.log(diplomas.length);
  };

  return (
    <div className="m-1 text-xl text-blue-600">
      <p>Contract Address: {address}</p>
    </div>
  );
};

export default DiplomaView;
