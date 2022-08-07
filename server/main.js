const express = require('express')
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
const http = require('http').createServer(app);
const dotenv = require('dotenv')
dotenv.config()
const fs = require('fs')
const basePath = process.cwd();

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

require(`./nftstorage`)(app);

(async () => {
  // deploy NFT Contract
  // app.deployNFTContract('GAirdrop', 'GA')
  // try {
  //   // const response = await app.storeNFT('./temp/logo192.png', 'Logo', 'logo description here')
  //   const response = await app.storeNFT('./audio/sample-12s.mp3', 'Music', 'Music is my life')
  //   console.log('r', response)
  // } catch (e) {
  //   console.error(e)
  // }
})();

app.post('/api/uploadFileToIPFS', async (req, res) => {
  try {
    const filename = '150x150.jpeg'
    const response = await app.storeNFT('./temp/'+filename, 'Logo', 'logo description here')
    // const response = await app.storeNFT('./audio/sample-12s.mp3', 'Music', 'Music is my life')
    console.log('r', response)
    const ipnft = response.ipnft
    await app.storeMetadata(ipnft+"/"+filename)
  } catch (e) {
    console.error(e)
  }
})

//nftport
// app.post('/api/uploadFileToIPFS', async (req, res) => {
//   const ipfsResp = await app.uploadFileToIPFS(`${basePath}/build/images/1.png`);
//   console.log(ipfsResp)
//   const ipfs_url = ipfsResp.ipfs_url;
//   const resp = await app.uploadMetadataToIPFS('t', 'test', 'https://ipfs.io/ipfs/bafkreih3pw4wupn5gfsg5urctfaf2lwopdg67uwo6y7zw5zvtcbw3bmihu')
//   console.log(resp.metadata_uri)
//   return res.json(resp)
// })

// // covalent
// app.get('/api/getNFTTokenIdsForContract', async (req, res) => {
//   const contractAddress = req.params.contractAddress;
//   const obj = await app.getNFTTokenIdsForContract(contractAddress)

//   return res.json(obj)
// })

// app.get('/api/getNFTTransactionsForContract', async (req, res) => {
//   const contractAddress = req.params.contractAddress;
//   const tokenId = req.params.tokenId;
//   const obj = await app.getNFTTransactionsForContract(contractAddress, tokenId)

//   return res.json(obj)
// })

// app.get('/api/getNFTExternalMetadataForContract', async (req, res) => {
//   const contractAddress = req.params.contractAddress;
//   const tokenId = req.params.tokenId;
//   const obj = await app.getNFTExternalMetadataForContract(contractAddress, tokenId)

//   return res.json(obj)
// })


http.listen(4500, function(){
  console.log('server is running on port 4500')
});