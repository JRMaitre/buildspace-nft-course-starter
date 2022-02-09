import React from "react";
import { ethers } from "ethers";

import myRandomNFT from "./utils/MyRandomNFT.json";

import "./styles/App.css";
import Connected from "./Connected";

// Constants
// const OPENSEA_LINK = '';
// const TOTAL_MINT_COUNT = 50;

const CONTRACT_ADDRESS = "0xF7b703FcAcB4f9221007c26b37CEEf2DB7b7ce3c";

const checkIfWalletIsConnected = () => {
  /*
   * First make sure we have access to window.ethereum
   */
  const { ethereum } = window;

  if (!ethereum) {
    console.log("Make sure you have metamask!");
    return false;
  } else {
    console.log("We have the ethereum object", ethereum);
    return true;
  }
};

const App = () => {
  const [currentAccount, setCurrentAccount] = React.useState("");
  const [status, setStatus] = React.useState(null);
  const isConnected = checkIfWalletIsConnected();
  const shouldConnectWallet = !isConnected || !currentAccount;

  React.useEffect(() => {
    if (isConnected) {
      setupEventListener();
    }
  }, [isConnected]);
  /*
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myRandomNFT.abi,
          signer
        );

        // connectedContract.on("NewRandomNFTMinted", (from, tokenId) => {
        //   console.log(from, tokenId.toNumber());
        //   setStatus(
        //     `Hey there! We've minted your NFT. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: <https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}>`
        //   );
        // });

        setStatus("Going to pop wallet now to pay gas...");
        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeARandomNFT();

        setStatus("Mining...please wait.");
        console.log("Mining...please wait.");
        await nftTxn.wait();

        setStatus(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setAccounts = async () => {
    if (!isConnected) {
      return false;
    }

    const { ethereum } = window;
    /*
     * Check if we're authorized to access the user's wallet
     */
    const accounts = await ethereum.request({ method: "eth_accounts" });

    /*
     * User can have multiple authorized accounts, we grab the first one if its there!
     */
    if (accounts.length !== 0) {
      const account = accounts[0];

      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myRandomNFT.abi,
          signer
        );

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewRandomNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          setStatus(
            `Hey there! We've minted your NFT. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: <https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}>`
          );
        });

        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    console.log("try set account");
    setAccounts();
  });

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {shouldConnectWallet ? (
            <button
              className="cta-button connect-wallet-button"
              onClick={connectWallet}
            >
              Connect to Wallet
            </button>
          ) : (
            <Connected
              accountName={currentAccount}
              onMint={askContractToMintNft}
              status={status}
            />
          )}
        </div>
        <div className="footer-container">
          <span>Built by JR Maitre</span>
        </div>
      </div>
    </div>
  );
};

export default App;
