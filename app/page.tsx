"use client";
import Head from "next/head";

import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";

const abi = [
  "event AccountCreated(address[] owners, uint256 indexed id, uint256 timestamp)",
  "event Deposit(address indexed user, uint256 indexed accountId, uint256 value, uint256 timestamp)",
  "event Withdraw(uint256 indexed withdrawId, uint256 timestamp)",
  "event WithdrawRequested(address indexed user, uint256 indexed accountId, uint256 withdrawId, uint256 amount, uint256 timestamp)",
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
  const [events, setEvents] = useState([]);

  console.log({ contract });

  const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  const initializeContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);

    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const newContract = new ethers.Contract(
      address,
      abi as ethers.InterfaceAbi,
      signer
    );

    setContract(newContract);
  };

  const createAccount = async () => {};

  const viewAccounts = async () => {
    if (!contract) return;

    try {
      const test = await contract.getAccounts();

      console.log({ test });
      // await contract["getAccounts()"](address);
    } catch (error) {
      console.error({ error });
    }

    // console.log({ accounts });
    // document.getElementById("accounts").innerHTML = JSON.stringify(accounts);
  };

  useEffect(() => {
    initializeContract();
  }, []);

  return (
    contract && (
      <div>
        <Head>
          <title>Bank Account</title>
          <meta name="Bank Account" content="Bank Account" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div>
          <div>Create Account</div>
          <input type="text" id="owners" />
          <button onClick={createAccount}>Create</button>
        </div>
        <div>
          <h3>View Accounts</h3>
          <p id="accounts"></p>
          <button onClick={viewAccounts}>View</button>
        </div>
        <div id="events"></div>
      </div>
    )
  );
}
