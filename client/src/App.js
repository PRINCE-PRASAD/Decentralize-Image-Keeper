import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
// for geting all byte and ABI code from deployment.

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./Components/FileUpload";
import Display from "./Components/Display";
import Modal from "./Components/Modal";



import './App.css';

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
// Provider help in read data from blockchain
// window.ethereum help in inject the metamask
// Signer help in write
    const loadProvider = async () => {
      if (provider) {

        // ---------------------------------------------------
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        // It help in reload the page whenever u change your account
        // ------------------------------------------------
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
// ------------------------------------------------------
        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        // created the instance for the contract
        // -----------------------------------------------


        // console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);
  return (
    <>
      {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
      )}

      <div className="App">
        <h1 style={{ color: "white" }}>Image Keeper</h1>
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>

        <p style={{ color: "white" }}>
          Account : {account ? account : "Account Not connected"}
        </p>
        <FileUpload
          account={account}
          provider={provider}
          contract={contract}
        ></FileUpload>
        <Display contract={contract} account={account}></Display>
      </div>
    </>
  );
}


export default App;
