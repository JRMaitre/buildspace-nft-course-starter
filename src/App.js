import React from "react";
import { ethers, BigNumber } from "ethers";

import myRandomNFT from "./utils/MyRandomNFT.json";

import "./styles/App.css";
import Connected from "./Connected";

// Constants
// const OPENSEA_LINK = '';
// const TOTAL_MINT_COUNT = 50;

const CONTRACT_ADDRESS = "0x543695057E693078E7f1795833a6bc954f46997f";

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

const isValidNetwork = async () => {
  /*
   * First make sure we have access to window.ethereum
   */
  const { ethereum } = window;

  let chainId = await ethereum.request({ method: "eth_chainId" });
  console.log("Connected to chain " + chainId);

  // String, hex code of the chainId of the Rinkebey test network
  const rinkebyChainId = "0x4";
  if (chainId !== rinkebyChainId) {
    return false;
  }
  return true;
};

const App = () => {
  const [currentAccount, setCurrentAccount] = React.useState("");
  const [status, setStatus] = React.useState(null);
  const [latestNft, setLatestNft] = React.useState(null);
  const [isOnValidNetwork, setIsOnValidNetwork] = React.useState(null);
  const [stats, setStats] = React.useState({
    currentTokenId: null,
    maxTokenId: null,
    remainingTokens: null,
  });
  const isConnected = checkIfWalletIsConnected();

  const shouldConnectWallet = !isConnected || !currentAccount;

  const isLoading = isOnValidNetwork === null;
  // Setup our listener.
  const setupEventListener = React.useCallback(async () => {
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
        connectedContract.on("NewRandomNFTMinted", async (from, tokenId) => {
          console.log(from, tokenId.toNumber());

          // Refresh stats...
          await getNftData();

          setLatestNft(
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
  }, []);

  React.useEffect(() => {
    if (isConnected) {
      setupEventListener();
      getNftData();
    }
  }, [isConnected, setupEventListener]);
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

  const getNftData = async () => {
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

        let maxTokenId = await connectedContract.getMaxTokenId();
        let currentTokenId = await connectedContract.getCurrentTokenId();

        let numberMaxTokenId = BigNumber.from(maxTokenId);
        let numberCurrentTokenId = BigNumber.from(currentTokenId);
        let numberRemainingTokens = numberMaxTokenId.sub(numberCurrentTokenId);

        setStats({
          currentTokenId: numberCurrentTokenId.toString(),
          maxTokenId: numberMaxTokenId.toString(),
          remainingTokens: numberRemainingTokens.toString(),
        });
      } else {
        console.log("Ethereum object doesn't exist!");
      }
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

  React.useEffect(() => {
    console.log("try set account");
    setAccounts();
  });

  React.useEffect(() => {
    const fetchData = async () => {
      const isValid = await isValidNetwork();
      setIsOnValidNetwork(isValid);
    };

    fetchData();
  });

  if (isLoading) {
    return null;
  }

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">NFT Ligue 1</p>
          <p className="sub-text">1 Defender, 1 Midfield, 1 Forward...</p>
          <p className="sub-text">
            Will you be one of the lucky one to mint Messi?
          </p>
          {shouldConnectWallet ? (
            <button
              className="cta-button connect-wallet-button"
              onClick={connectWallet}
            >
              Connect to Wallet
            </button>
          ) : isOnValidNetwork ? (
            <Connected
              accountName={currentAccount}
              onMint={askContractToMintNft}
              status={status}
              latestNft={latestNft}
              stats={stats}
            />
          ) : (
            <div>You are not on a valid network</div>
          )}
        </div>
        <div className="footer-container">
          <span>
            View collection on <a href="https://www.google.com">Opensea</a>
          </span>
        </div>
        <div className="footer-container">
          <span>Built by JR Maitre</span>
        </div>
      </div>
    </div>
  );
};

export default App;
