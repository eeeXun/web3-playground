import { useEffect, useState } from "react";
import Web3 from "web3";
import DiplomaABI from "../data/Diploma.json";

const DiplomaGrant = (props) => {
  const address = "0x88F986050140a11a45E082C6CB697aa31E486dC5";
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(DiplomaABI, address);
  let requests = [];
  let grants = [];
  const [requestComponent, setRequestComponent] = useState();
  const [grantComponent, setGrantComponent] = useState();

  useEffect(() => {
    contract.getPastEvents(
      "Request",
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
            requests.push([
              event[i].returnValues.from,
              event[i].returnValues.degree,
              event[i].returnValues.department,
            ]);
          }
          requestUpdate();
        }
      }
    );
    contract.getPastEvents(
      "Grant",
      {
        filter: {
          from: window.ethereum.selectedAddress,
        },
        fromBlock: 0,
      },
      (error, event) => {
        if (error) {
          console.log(error);
        } else {
          for (let i = 0; i < event.length; i++) {
            grants.push([
              event[i].returnValues.to,
              event[i].returnValues.degree,
              event[i].returnValues.department,
            ]);
          }
          grantUpdate();
        }
      }
    );
  }, [props.reload, window.ethereum.selectedAddress]);

  const grantUpdate = async () => {
    let component = [];
    for (const grant of grants) {
      let data = await contract.methods
        .getData(grant[0], grant[1], grant[2])
        .call();
      component.push(
        <tr>
          <td className="border border-purple-700">{grant[0]}</td>
          <td className="border border-purple-700">{data.name}</td>
          <td className="border border-purple-700">{grant[1]}</td>
          <td className="border border-purple-700">{grant[2]}</td>
          <td className="border border-purple-700">{data.year}</td>
          <td className="border border-purple-700">
            <a href={"https://ipfs.io/ipfs/" + data.img}>
              <img
                src={"https://ipfs.io/ipfs/" + data.img}
                alt="Diploma Image"
              />
            </a>
          </td>
          <td className="border border-purple-700">
            <form onSubmit={handle_revoke}>
              <input
                type="hidden"
                id="requester"
                name="requester"
                value={grant[0]}
              />
              <input type="hidden" id="degree" name="degree" value={grant[1]} />
              <input
                type="hidden"
                id="department"
                name="department"
                value={grant[2]}
              />
              {data.revoked ? (
                <>
                  <div className="m-1 text-red-500">Revoked</div>
                  <button
                    className="m-1 text-white bg-blue-600 rounded-lg hover:bg-blue-500"
                    type="submit"
                    name="recover"
                  >
                    Recover
                  </button>
                </>
              ) : (
                <button
                  className="m-1 text-white bg-red-600 rounded-lg hover:bg-red-500"
                  type="submit"
                  name="revoke"
                >
                  Revoke
                </button>
              )}
            </form>
          </td>
        </tr>
      );
    }
    setGrantComponent(component);
  };

  const handle_revoke = (event) => {
    event.preventDefault();
    let requester = event.target.elements.requester.value;
    let degree = event.target.elements.degree.value;
    let department = event.target.elements.department.value;
    switch (event.nativeEvent.submitter.name) {
      case "revoke":
        contract.methods
          .revoke(requester, degree, department)
          .send({ from: window.ethereum.selectedAddress });
        break;
      case "recover":
        contract.methods
          .recover(requester, degree, department)
          .send({ from: window.ethereum.selectedAddress });
        break;
    }
  };

  const requestUpdate = async () => {
    let component = [];
    for (const request of requests) {
      let data = await contract.methods
        .getData(request[0], request[1], request[2])
        .call();
      if (!data.valid && !data.rejected) {
        component.push(
          <tr>
            <td className="border border-purple-700">{request[0]}</td>
            <td className="border border-purple-700">{data.name}</td>
            <td className="border border-purple-700">{request[1]}</td>
            <td className="border border-purple-700">{request[2]}</td>
            <td className="border border-purple-700">{data.year}</td>
            <td className="border border-purple-700">
              <a href={"https://ipfs.io/ipfs/" + data.img}>
                <img
                  src={"https://ipfs.io/ipfs/" + data.img}
                  alt="Diploma Image"
                />
              </a>
            </td>
            <td className="border border-purple-700">
              <form onSubmit={handle_request}>
                <input
                  type="hidden"
                  id="requester"
                  name="requester"
                  value={request[0]}
                />
                <input
                  type="hidden"
                  id="degree"
                  name="degree"
                  value={request[1]}
                />
                <input
                  type="hidden"
                  id="department"
                  name="department"
                  value={request[2]}
                />
                <button
                  className="m-1 text-white bg-blue-600 rounded-lg hover:bg-blue-500"
                  type="submit"
                  name="approve"
                >
                  Approve
                </button>
                <button
                  className="m-1 text-white bg-red-600 rounded-lg hover:bg-red-500"
                  type="submit"
                  name="reject"
                >
                  Reject
                </button>
              </form>
            </td>
          </tr>
        );
      }
    }
    setRequestComponent(component);
  };

  const handle_request = (event) => {
    event.preventDefault();
    let requester = event.target.elements.requester.value;
    let degree = event.target.elements.degree.value;
    let department = event.target.elements.department.value;
    switch (event.nativeEvent.submitter.name) {
      case "approve":
        contract.methods
          .approve(requester, degree, department)
          .send({ from: window.ethereum.selectedAddress });
        break;
      case "reject":
        contract.methods
          .reject(requester, degree, department)
          .send({ from: window.ethereum.selectedAddress });
        break;
    }
  };

  return (
    <div className="m-1 text-xl text-blue-600">
      <div className="flex flex-row">
        <div className="basis-1/4"></div>
        <div className="basis-1/2">
          <table className="border border-collapse table-auto">
            <caption className="text-blue-800 caption-top">Request</caption>
            <thead>
              <tr>
                <th className="border border-purple-700">Requester</th>
                <th className="border border-purple-700">Name</th>
                <th className="border border-purple-700">Degree</th>
                <th className="border border-purple-700">Department</th>
                <th className="border border-purple-700">Year</th>
                <th className="border border-purple-700">Image</th>
                <th className="border border-purple-700">Approve/Reject</th>
              </tr>
            </thead>
            <tbody>{requestComponent}</tbody>
          </table>
        </div>
        <div className="basis-1/4"></div>
      </div>
      <div className="flex flex-row">
        <div className="basis-1/4"></div>
        <div className="basis-1/2">
          <table className="border border-collapse table-auto">
            <caption className="text-blue-800 caption-top">Grant</caption>
            <thead>
              <tr>
                <th className="border border-purple-700">Grant to</th>
                <th className="border border-purple-700">Name</th>
                <th className="border border-purple-700">Degree</th>
                <th className="border border-purple-700">Department</th>
                <th className="border border-purple-700">Year</th>
                <th className="border border-purple-700">Image</th>
                <th className="border border-purple-700">Revoke/Recover</th>
              </tr>
            </thead>
            <tbody>{grantComponent}</tbody>
          </table>
        </div>
        <div className="basis-1/4"></div>
      </div>
    </div>
  );
};

export default DiplomaGrant;
