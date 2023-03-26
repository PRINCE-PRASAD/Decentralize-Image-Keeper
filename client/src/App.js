import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
// for geting all byte and ABI code from deployment.

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import shareVideo from "./assets/share.mp4";

import styled from "styled-components";

import "./App.css";

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
        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
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
        <h1 style={{ color: "White" }}>Image Keeper</h1>

        {/* ---------------------------------------- */}
        <div className="videoContainer">
          <video className="videoTag" autoPlay loop muted>
            <source src={shareVideo} type="video/mp4" />
          </video>
        </div>
        <Overlay />
        {/* ------------------------------------ */}
        
        <p style={{ color: "White" }}>
          Account : {account ? account : "Account Not connected"}
        </p>
        <FileUpload
          account={account}
          provider={provider}
          contract={contract}
        ></FileUpload>
        <Display contract={contract} account={account}></Display>
      </div>
      <Overlay />
    </>
  );
}

const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  bottom: 0;
  box-shadow: inset 0 0 5rem rgba(0, 0, 0, 0.5);
  left: 0;
  min-height: 100%;
  min-width: 100%;
  object-fit: cover;
  object-position: center;
  position: fixed;
  right: 0;
  top: 0;
  z-index: -1;
`;
export default App;
