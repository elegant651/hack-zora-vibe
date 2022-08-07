import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWeb3React } from '@web3-react/core';
import { useEthereumProvider } from '../hooks/useEthereumProvider';
import mumbaiZoraAddresses from "@zoralabs/v3/dist/addresses/80001.json"; // Mainnet addresses, 4.json would be Rinkeby Testnet 
import { AsksV1_1__factory } from "@zoralabs/v3/dist/typechain/factories/AsksV1_1__factory";

export default function MusicList() {
  const { account, active, chainId } = useWeb3React();
  const { ethereumProvider } = useEthereumProvider();

  const nftContractAddress = "0x0aa31bF8deB1064DAa3FDad18Ed90C4D6146EeC4"; 
  const erc20ContractAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC token address
  const tokenId = "0"

  const [listTracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noMetamsk, setNoMetamask] = useState(false);

  const selectHost = async () => {
    const sample = (arr) => arr[Math.floor(Math.random() * arr.length)]
    const res = await fetch('https://api.audius.co')
    const hosts = await res.json()
    return sample(hosts.data)
  }

  const fetchTracks = async () => {
    const host = await selectHost()
    const res = await fetch(`${host}/v1/tracks/trending?limit=1&timeRange=week?app_name=EXAMPLEAPP`)
    const json = await res.json()
    const allTracks = json.data.slice(0, 20);

    console.log('aa', allTracks)
    setTracks(allTracks);
    setLoading(false);
  }

  const isMetamaskInstalled = () => {
    return (typeof window.ethereum !== 'undefined');
  }

  useEffect(() => {
    if (!isMetamaskInstalled()) {
        setLoading(false);
        setNoMetamask(true);
    } else if (listTracks.length === 0) {
      fetchTracks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const fillAsk = async () => {
    if (!ethereumProvider) return;

    const provider = new ethers.providers.Web3Provider(ethereumProvider, 80001);
    const signer = await provider.getSigner();
    // Initialize Asks v1.1 Module Contract
    const askModuleContract = AsksV1_1__factory.connect(mumbaiZoraAddresses.AsksV1_1, signer);

    const fillAmount = ethers.utils.parseEther("0.01");
    const finder = "0x0000000000000000000000000000000000000000"; // Address that helped find the buyer. Can be the 0 address if no address is specified

    try {
      const response = await askModuleContract.fillAsk(
        nftContractAddress,
        tokenId,
        "0x0000000000000000000000000000000000001010", // 0 address for Matic sale
        fillAmount,
        finder
      );
      console.log('r', response)
    } catch (e) {
      console.error(e)
    }    
  }


  function DisplayCard({ item, count }) {
    return (
      <div key={count} className="display-coupon-card" >
        <div style={{ marginBottom: "5px" }}>
          <img src={item.artwork["150x150"]} width="150px"></img>
          <h5>{item.title}</h5>
        </div>

        <div>
          <div style={{ marginBottom: "10px" }}>
            <div><b>{item.genre}</b> {item.tags && item.tags.slice(0, 10)}</div>
          </div>
          <div style={{ marginBottom: "10px" }}>
            {item.description && item.description.slice(0, 70)}
          </div>
          <div style={{ marginBottom: "5px" }}>
            <div>
              <h5 style={{ color: "blue" }}>{item.user.name}</h5>
              <span className="info-message">

              </span>
            </div>
          </div>
          <button className="createBtn mb-8 w-44 h-8 text-black text-md font-bold border border-white rounded-xl"
            onClick={fillAsk}
          >
            Buy
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return 'Loading...'
  };

  const newElem = listTracks[11]

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        <div key={0}>
          <DisplayCard item={newElem} count={0} />
        </div>
      {!noMetamsk ?
        (listTracks.map((element, key) => (
            <div key={key+1}>
              <DisplayCard item={element} count={key+1} />
            </div>
          )))
        : <div
            className="alert-message"
            style={{ marginTop: "20%", fontSize: "x-large" }}
          >
            You don't have metamask. Please install first !!
        </div>
      }
      </div>
    </div >
  );

}

