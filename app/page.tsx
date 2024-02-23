"use client";
import Head from "next/head";

import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import deployment from "../deployment.json";

export default function Home() {
  const [contract, setContract] = useState<Contract | null>(null);
  const [events, setEvents] = useState([]);

  console.log(
    "FUNCTIONS",
    contract?.interface.forEachFunction((f) => console.log(f))
  );

  const address = deployment.contract.address;
  const abi = deployment.contract.abi;
  const initializeContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);

    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const newContract = new ethers.Contract(address, abi, signer);

    setContract(newContract);
  };

  const createAccount = async () => {};

  console.log({ contract });
  const viewAccounts = async () => {
    if (!contract) return;

    const getAccountsFunction = contract.interface.fragments[7];

    try {
      await contract.getFunction("getAccounts").call(null);
    } catch (error) {
      console.error({ error });
    }

    console.log(result);

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
