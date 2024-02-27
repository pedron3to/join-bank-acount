"use client";
import Head from "next/head";

import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";

const abi = [
  "event AccountCreated(address[] owners, uint256 indexed id, uint256 timestamp)",
  "event Deposit(address indexed user, uint256 indexed accountId, uint256 value, uint256 timestamp)",
  "event Withdraw(uint256 indexed withdrawId, uint256 timestamp)",
  "event WithdrawRequested(address indexed user, uint256 indexed accountId, uint256 indexed withdrawId, uint256 amount, uint256 timestamp)",
  "function approveWithdrawl(uint256 accountId, uint256 withdrawId)",
  "function createAccount(address[] otherOwners)",
  "function deposit(uint256 accountId) payable",
  "function getAccounts() view returns (uint256[])",
  "function getApprovals(uint256 accountId, uint256 withdrawId) view returns (uint256)",
  "function getBalance(uint256 accountId) view returns (uint256)",
  "function getOwners(uint256 accountId) view returns (address[])",
  "function requestWithdrawl(uint256 accountId, uint256 amount)",
  "function withdraw(uint256 accountId, uint256 withdrawId)",
];

export default function Home() {
  const [contract, setContract] = useState<Contract | null>(null);
  const [owners, setOwners] = useState("");
  const [events, setEvents] = useState([]);
  const [createdAccount, setCreatedAccounts] = useState<string[]>([]);
  const [isverifyEvent, setisverifyEvent] = useState(false);

  const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  const initializeContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);

    try {
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const newContract = new ethers.Contract(
        address,
        abi as ethers.InterfaceAbi,
        signer
      );

      setContract(newContract);
    } catch (error) {
      console.error(error);
    }
  };

  const createAccount = async () => {
    if (!contract) return;

    const ownersValue = owners.split(",").filter((n) => n);

    try {
      const result = await contract.createAccount(ownersValue);

      console.log({ result });
      alert("success");
      setisverifyEvent(true);
    } catch (error) {
      console.log({ error });
    }
  };

  const handleAccountCreatedEvent = (owners, id, event) => {
    console.log("nao");
    console.log("handleAccountCreatedEvent", { owners, id, event });
    const newOwner = `Account Created: ID = ${id}, Owners = ${owners}`;
    console.log({ newOwner });
    setCreatedAccounts(() => [...createdAccount, newOwner]);
  };

  useEffect(() => {
    console.log("entra aqui pra ver");
    contract?.on("AccountCreated", handleAccountCreatedEvent);

    return () => {
      contract?.removeAllListeners("AccountCreated");
    };
  }, [isverifyEvent, contract, handleAccountCreatedEvent]);

  const viewAccounts = async () => {
    if (!contract) return;

    try {
      const result = await contract.getAccounts();
      console.log(result);
    } catch (error) {
      console.error({ error });
    }

    // console.log({ accounts });
    // document.getElementById("accounts").innerHTML = JSON.stringify(accounts);
  };

  useEffect(() => {
    initializeContract();
  }, []);

  return contract ? (
    <div>
      <Head>
        <title>Bank Account</title>
        <meta name="Bank Account" content="Bank Account" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div>Create Account</div>
        <input
          type="text"
          id="owners"
          onChange={(e) => setOwners(e.target.value)}
          value={owners}
        />
        <button onClick={createAccount}>Create</button>
      </div>
      <div>
        <h3>View Accounts</h3>
        <p id="accounts"></p>
        <button onClick={viewAccounts}>View</button>
      </div>
      <div id="events">
        {createdAccount.map((e) => (
          <p>{e}</p>
        ))}
      </div>
    </div>
  ) : (
    <div>Conneting to the metabase...</div>
  );
}
