import './styles/App.css';
import React from "react";

const Connected = ({ accountName }) => {
  return (
    <div>
      {accountName}
      <div>
        <button onClick={null} className="cta-button connect-wallet-button">
          Mint NFT
        </button>
      </div>
    </div>
  );
};

export default Connected;
