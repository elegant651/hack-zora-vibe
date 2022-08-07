const projectConfig = {
  nftName: 'ZoraVibes',

  nftSymbol: 'ZV',

  maxSupply: 100,

  maxMintAmountPerTxn: 10,

  mintCost: process.env.NODE_ENV === 'production' ? 100 : 0.01,

  networkName:
    process.env.NODE_ENV === 'production'
      ? 'Polygon Mainnet' // 'Ethereum Mainnet'
      : 'Mumbai Testnet', // 'Rinkeby Testnet'

  chainName: 'MATIC', // 'ETH'

  chainId: process.env.NODE_ENV === 'production' ? 137 : 80001, // Ethereum (1), Rinkeby (4)

  siteDomain: 'www.yourdomain.com',

  siteUrl:
    process.env.NODE_ENV === 'production'
      ? `https://your_site_domain`
      : 'http://localhost:3000',

  openseaCollectionUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://opensea.io/collection/your_opensea_collection_name'
      : 'https://testnets.opensea.io/collection/your_opensea_collection_name',

  contractAddress:
    process.env.NODE_ENV === 'production'
      ? 'your_mainnet_contract_address'
      : '0xB4967cb579330A89A285Fe6E875ac95ac09D7B3f',

  scanUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://polygonscan.com/address/your_polygon_contract_address'
      : 'https://mumbai.polygonscan.com/address/0xB4967cb579330A89A285Fe6E875ac95ac09D7B3f',
  // 'https://etherscan.io/address/your_ethereum_contract_address'
  // 'https://rinkeby.etherscan.io/address/your_rinkeby_contract_address'
};

export default projectConfig;
