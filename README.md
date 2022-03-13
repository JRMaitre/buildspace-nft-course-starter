### **Welcome 👋**
To get started with this course, clone this repo and follow these commands:

1. Run `npm install` at the root of your directory
2. Run `npm run start` to start the project

## How to deploy new version of the NFT minter end to end?

1. In the [Ethereum project](https://github.com/JRMaitre/nft-creator), Run `npm run deploy`
2. Check the logs and copy the ID after the line `Contract deployed to: ` (eg:`0xAa08E23A8671Fd524462B978068b00E774Cb4Cdd`)
3. Take that ID and go to [the JS project](https://github.com/JRMaitre/buildspace-nft-course-starter)
4. In App.js replace the `CONTRACT_ADDRESS` with the ID you copied earlier
5. Add the file to and push it to git, it will deploy a new version of the website immediately
6. Go to https://nft-minter-jr.vercel.app/ and see the app!
  
