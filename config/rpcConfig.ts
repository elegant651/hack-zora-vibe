// For Ethereum, use the Infura endpoints
export default function rpcConfig(alchemyKey?: string) {
  return process.env.NODE_ENV === 'production'
    ? 'https://polygon-rpc.com' // `https://mainnet.infura.io/v3/${infuraKey}`
    : `https://polygon-mumbai.g.alchemy.com/v2/${alchemyKey}`; // `https://rinkeby.infura.io/v3/${infuraKey}`
}
