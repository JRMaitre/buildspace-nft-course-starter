import "./styles/App.css";
import React from "react";

const Connected = ({ accountName, onMint, status }) => {
  return (
    <div>
      <div>{accountName}</div>
      <div>{status}</div>
      <div>
        <button onClick={onMint} className="cta-button connect-wallet-button">
          Mint NFT
        </button>
      </div>
    </div>
  );
};

export default Connected;
