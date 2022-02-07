import './styles/App.css';
import React from "react";
import Connected from './Connected'

// Constants
// const OPENSEA_LINK = '';
// const TOTAL_MINT_COUNT = 50;

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
}



const App = () => {
  const [currentAccount, setCurrentAccount] = React.useState("");
  const isConnected = checkIfWalletIsConnected()
  const shouldConnectWallet = !isConnected || !currentAccount
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
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  const setAccounts = async () => {
    console.log('set account', isConnected)
    if (!isConnected) {
      return false
    }
    console.log('is connected')
    const { ethereum } = window;
    /*
      * Check if we're authorized to access the user's wallet
      */
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    console.log(accounts)
    /*
    * User can have multiple authorized accounts, we grab the first one if its there!
    */
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
    } else {
      console.log("No authorized account found")
    }
  }

  React.useEffect(() => {
    console.log('try set account')
    setAccounts()
  })


  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {shouldConnectWallet ?
            <button className="cta-button connect-wallet-button" onClick={connectWallet}>
              Connect to Wallet
            </button> :
            <Connected accountName={currentAccount} />
          }
        </div>
        <div className="footer-container"><span>Built by JR Maitre</span>
        </div>
      </div>
    </div>
  );
};

export default App;
