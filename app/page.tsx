"use client";
import Head from "next/head";

import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import deployment from "../artifacts/contracts/BankAccount.sol/BankAccount.json";

export default function Home() {
  const [contract, setContract] = useState<Contract | null>(null);
  const [events, setEvents] = useState([]);

  console.log({ contract });

  const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const abi = deployment.abi;
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
