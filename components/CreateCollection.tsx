import { useEffect, useState } from 'react';
import { ethers } from "ethers";
import { useWeb3React } from '@web3-react/core';
import { useEthereumProvider } from '../hooks/useEthereumProvider';
import mumbaiZoraAddresses from "@zoralabs/v3/dist/addresses/80001.json"; // Mainnet addresses, 4.json would be Rinkeby Testnet 
import { IERC721__factory } from "@zoralabs/v3/dist/typechain/factories/IERC721__factory";
import { IERC20__factory } from "@zoralabs/v3/dist/typechain/factories/IERC20__factory";
import { ZoraModuleManager__factory } from "@zoralabs/v3/dist/typechain/factories/ZoraModuleManager__factory";
import { AsksV1_1__factory } from "@zoralabs/v3/dist/typechain/factories/AsksV1_1__factory";
import { IERC721 } from '@zoralabs/v3/dist/typechain/IERC721';
import { IERC20 } from '@zoralabs/v3/dist/typechain/IERC20';
import { ZoraModuleManager } from '@zoralabs/v3/dist/typechain/ZoraModuleManager';


export default function CreateCollection() {
  const [fileStream, setFileStream] = useState()
  const [step, setStep] = useState(0);
  // update audio file & metadata with nft.storage
  // create nft minting with polygon
  const [resultTx, setResultTx] = useState('')
  const [finishMsg, setFinishMsg] = useState('')

  const { account, active, chainId } = useWeb3React();
  const { ethereumProvider } = useEthereumProvider();

  const moduleManagerAddress = mumbaiZoraAddresses.ZoraModuleManager;
  // const ownerAddress = "0xF296178d553C8Ec21A2fBD2c5dDa8CA9ac905A00"; // Owner of the assets
  const nftContractAddress = "0x0aa31bF8deB1064DAa3FDad18Ed90C4D6146EeC4"; 
  const erc20ContractAddress = "0x0000000000000000000000000000000000001010"; // Matic token address
  const tokenId = "0"

  const uploadNFT = async () => {
    if(!fileStream) return;
    const form = new FormData();
    form.append('file', fileStream);
    
    const options = {
      method: 'POST',
      body: form
    };

    const resp = await fetch("/api/uploadFileToIPFS", options)
    return await resp.json();
  }

  const initContract = async () => {
    if (!ethereumProvider) return;
    // This should be an ethers.js signer instance: 
    // You can get the signer from a wallet using web3modal/rainbowkit/blocknative wallet etc.
    // See: https://docs.ethers.io/v5/api/signer/
    const provider = new ethers.providers.Web3Provider(ethereumProvider, 80001);
    const signer = await provider.getSigner();
    
    // Initialize NFT demo contract
    const erc721Contract = IERC721__factory.connect(nftContractAddress, signer);

    // Initialize ERC20 currency demo contract :: mumbai
    const erc20Contract = IERC20__factory.connect(erc20ContractAddress, signer);

    // Initialize Zora V3 Module Manager contract 
    const moduleManagerContract = ZoraModuleManager__factory.connect(moduleManagerAddress, signer);
    
    return {
      erc721Contract,
      erc20Contract,
      moduleManagerContract
    }
  }

  const approve = async () => {
    try {
      const {
        erc721Contract,
        erc20Contract,
        moduleManagerContract
      }: any = await initContract()
  
      await approveERC721(erc721Contract)
      await approveERC20(erc20Contract)
      await approveModuleManager(moduleManagerContract)
    } catch (e) {
      console.error(e)
    }
  }

  const approveERC721 = async (erc721Contract: IERC721) => {
    const erc721TransferHelperAddress = mumbaiZoraAddresses.ERC721TransferHelper;
    const approved = await erc721Contract.isApprovedForAll(
      account!, // NFT owner address
      erc721TransferHelperAddress // V3 Module Transfer Helper to approve
    );

    // If the approval is not already granted, add it.
    if (approved === false) {
    // Notice: Since this interaction submits a transaction to the blockchain it requires an ethers signer.
    // A signer interfaces with a wallet. You can use walletconnect or injected web3.
      await erc721Contract.setApprovalForAll(erc721TransferHelperAddress, true);
    }
  }

  const approveERC20 = async (erc20Contract: IERC20) => {
    const erc20TransferHelperAddress = mumbaiZoraAddresses.ERC20TransferHelper;
    const approvedAmount = await erc20Contract.allowance(account!, erc20TransferHelperAddress);
    const infiniteApprovalAmount = ethers.constants.MaxUint256; // Inifite approval is used here but any amount can be specified

    // if (approvedAmount.isZero()) {
        await erc20Contract.approve(erc20TransferHelperAddress, infiniteApprovalAmount);
    // }
  }

  const approveModuleManager = async (moduleManagerContract: ZoraModuleManager) => {
    // Approving Asks v1.1
    const approved = await moduleManagerContract.isModuleApproved(account!, mumbaiZoraAddresses.AsksV1_1);

    if (approved === false) {
        await moduleManagerContract.setApprovalForModule(mumbaiZoraAddresses.AsksV1_1, true);
    }
  }

  const askModule = async () => {
    if (!ethereumProvider) return;

    const provider = new ethers.providers.Web3Provider(ethereumProvider, 80001);
    const signer = await provider.getSigner();
    // Initialize Asks v1.1 Module Contract
    const askModuleContract = AsksV1_1__factory.connect(mumbaiZoraAddresses.AsksV1_1, signer);

    const askPrice = ethers.utils.parseEther("0.01") 
    const findersFeeBps = "200"; // 2% Finders Fee (in BPS)

    // Calling Create Ask
    // Notice: Since this interaction submits a transaction to the blockchain it requires a signer.
    // A signer interfaces with a wallet. You can use walletconnect or injected web3.
    try {
      const response = await askModuleContract.createAsk(
        nftContractAddress,
        tokenId, 
        askPrice,
        "0x0000000000000000000000000000000000001010", // 0 address for ETH sale
        account!,
        findersFeeBps
      );
      console.log('r', response)
      setResultTx(response.hash)
    } catch (e) {
      console.error(e)
    }
  }

   //Uploading music info into IPFS
   const step1 = async () => {
    uploadNFT()

    setTimeout(() => goStep(2), 2000)
  }

  //approve
  const step2 = async () => {
    await approve()

    setTimeout(() => goStep(3), 2000)
  }

  const step3 = async () => {
    await askModule()
    
    setTimeout(() => goStep(4), 2000)
  }

  const goStep = async (stepIdx: number) => {
    setStep(stepIdx)
    if (stepIdx===1) {
      await step1();
    } else if (stepIdx===2) {
      await step2();
    } else if (stepIdx===3) {
      await step3();
    } else {
      setFinishMsg('creating collection successful')
    }
  }

  return (
    <div className="bg-black text-gray-600">
      <h2 className="text-white dark:text-white text-3xl font-bold mt-8 mb-4 leading-tight">
        Create Collection
      </h2>

      <div className="my-5">
        <input type="file" className="chooseBtn my-3 w-32 h-8 text-white text-xs font-bold border border-white rounded-xl"></input>
        <button className=""
          onClick={async () => {
          }}
        >
          Choose File
        </button>
        <div className="my-3">
          <input id="trackId" placeholder='Track Name' />
        </div>
        <div className="my-3">
          <input id="trackDesc" placeholder='Track Description' />
        </div>
        <div className="my-3">
          <input id="tags" placeholder='genre' />
        </div>
      </div>

      <div className="my-5">
        <h3 className="text-lg font-bold my-1">Price</h3>
        <div>Enter price to allow users purchase your NFT</div>
        <div className="my-3 flex">
          <input id="price" placeholder='Price' /> 
        </div>
      </div>
      
      <div className="my-5">
        <div className="flex">
          <div>
            <h3 className="text-lg font-bold my-1">Royalty</h3>
            <input id="royalty" placeholder='10%, 15%, 30%' />
          </div>
          <div className="ml-10">
            <h3 className="text-lg font-bold my-1">Number of editions</h3>
            <input id="numEditions" placeholder="100" />
          </div>
        </div>
      </div>

      {/* <button className="createBtn mb-8 w-44 h-8 text-white text-md font-bold border border-white rounded-xl"
        onClick={approve}
      >
        Approve
      </button> */}

      <button className="createBtn mb-8 w-44 h-8 text-white text-md font-bold border border-white rounded-xl"
        onClick={() => goStep(1)}
      >
        Create Collection
      </button>

      

      <div className='text-white'>
      { step === 0 ?
        <div>Progress:</div>   : <></>
      }

                { step === 1 ?
                    <div>
                        <h4>Step1</h4>
                        <div>Uploading music info into IPFS</div>
                    </div> : <div></div>
                }

                { step === 2 ?
                    <div>
                        <h4>Step2</h4>
                        <div>Approve NFT module with zora protocol</div>
                    </div> : <div></div>
                }

                { step === 3 ?
                    <div>
                        <h4>Step3</h4>
                        <div>Ask module - zora protocol</div>
                    </div> : <div></div>
                }

                { step === 4 ?
                  <div>
                    <h4>Complete</h4>
                    <div>
                      Result TX: {resultTx}
                    </div>
                  </div>
                    : <div></div>
                }
      </div>

      

      <div className="text-white text-xl">
        {finishMsg}
      </div>
    </div>
  )
} 