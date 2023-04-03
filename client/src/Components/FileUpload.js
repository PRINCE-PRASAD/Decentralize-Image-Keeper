import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";


const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  const handleSubmit = async (e) => {
    e.preventDefault(); //for not relod while upload
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
// -----------------------------------------------------------
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: await(process.env.pinata_key),
            pinata_secret_api_key: await(process.env.pinata_secret_key),
            "Content-Type": "multipart/form-data",
          },
        });
        // all come from pinata
        // ----------------------------------------------------------
        const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
        // console.log(ImgHash);
        
      const signer = contract.connect(provider.getSigner());
       signer.add(account, ImgHash);
      } catch (e) {
        alert("Unable to upload image to Pinata");
      }
    }
    alert("Successfully Image Uploaded");
    setFileName("No image selected");
    setFile(null);
  };


  const retrieveFile = (e) => {
    const data = e.target.files[0]; //files array of files object
    // console.log(data);
    const reader = new window.FileReader(); // it help in read the file in new page 
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => { //set the file after read complete
      setFile(e.target.files[0]);
    };    
    setFileName(e.target.files[0].name);
    e.preventDefault(); 
  };

  
  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          Choose Image
        </label>
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <span className="textArea">Image: {fileName}</span>
        <button type="submit" className="upload" disabled={!file}>
          Upload File
        </button>
      </form>
    </div>
  );
};
export default FileUpload;

// we  have to download axios it help in intract with PINATA