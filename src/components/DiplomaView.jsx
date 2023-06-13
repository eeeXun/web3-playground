import { useEffect, useState } from "react";
import Web3 from "web3";
import DiplomaABI from "../data/Diploma.json";

const DiplomaView = () => {
  const address = "0xcc992df785726B88aAED17577727F8B9a1eE927A";
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(DiplomaABI, address);
  let diplomas = [];
  const [diplomaComponent, setDiplomaComponent] = useState();

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
              event[i].returnValues.department,
            ]);
          }
          diplomaUpdate();
        }
      }
    );
  });

  const diplomaUpdate = async () => {
    let component = [];
    for (const diploma of diplomas) {
      let data = await contract.methods
        .getData(diploma[0], diploma[1], diploma[2])
        .call();
      component.push(
        <tr>
          <td className="border border-purple-700">{data.assignor}</td>
          <td className="border border-purple-700">{data.name}</td>
          <td className="border border-purple-700">{diploma[1]}</td>
          <td className="border border-purple-700">{diploma[2]}</td>
          <td className="border border-purple-700">{data.year}</td>
          <td className="border border-purple-700">{data.revoke ? "Revoke ❌": "Valid ✅"}</td>
        </tr>
      );
    }
    setDiplomaComponent(component);
  };

  return (
    <div className="m-1 text-xl text-blue-600">
      <p>Contract Address: {address}</p>
      <div className="px-64 m-5 mx-auto">
        <table className="border border-collapse table-fixed">
          <thead>
            <tr>
              <th className="border border-purple-700">Assignor</th>
              <th className="border border-purple-700">Name</th>
              <th className="border border-purple-700">Degree</th>
              <th className="border border-purple-700">Department</th>
              <th className="border border-purple-700">Year</th>
              <th className="border border-purple-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {diplomaComponent}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiplomaView;
