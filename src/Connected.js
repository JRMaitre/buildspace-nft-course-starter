import "./styles/App.css";
import React from "react";

const Connected = ({
  accountName,
  onMint,
  status,
  latestNft,
  stats: { currentTokenId, maxTokenId, remainingTokens },
}) => (
  <div>
    <div className="padded-div">
      ✅ Connected to your Metamask wallet. You can now mint an NFT! ✅
    </div>

    <div className="padded-div">
      <button onClick={onMint} className="cta-button connect-wallet-button">
        Mint NFT
      </button>

      <div className="padded-div">{status}</div>

      {latestNft && (
        <div className="padded-div">
          <span>Latest NFT:</span>
          <span>{latestNft}</span>
        </div>
      )}

      {currentTokenId ? (
        <div className="padded-div">
          <div>
            NFTs created: {currentTokenId}/{maxTokenId}
          </div>
          <div>Remaining: {remainingTokens} NFTs</div>
        </div>
      ) : (
        <div>Gathering stats...</div>
      )}
    </div>
  </div>
);

export default Connected;
