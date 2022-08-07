const mime = require('mime')
const { NFTStorage, File } = require('nft.storage')
const fs = require('fs')
const path = require('path')
const NFT_STORAGE_KEY = process.env.NFT_STORAGE_API_KEY

module.exports = async (app) => {

  app.storeNFT = async (aPath, name, description) => {
    const image = await fileFromPath(aPath)

    // create a new NFTStorage client using our API key
    const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })

    // call client.store, passing in the image & metadata
    return nftstorage.store({
      image,
      name,
      description,
    })
  }

  app.storeMetadata = async (imgPath) => {
    //https://nft.storage/docs/how-to/mint-erc-1155/#minting-your-nft

    const nftJSON = {
      description: "LISTEN TO JENNY NOW! MY COLLAB WITH 3LAU EXCLUSIVELY ON AUDIUS!\n\nFollow:\nyoutube.com/steveaoki\nfacebook.com/steveaoki\ntwitter.com/steveaoki\ninstagram.com/steveaoki\nSnapchat: @aokisteve\nTikTok: @steveaoki\nTriller: @steveaoki",
      external_url: "https://usermetadata.audius.co/ipfs/QmWHyf1UqEZCVrGcCefwxX3NH3KTJ8kVn45DbvBeaPZx6X/150x150.jpg",
      image: "https://ipfs.io/ipfs/"+imgPath,
      name: "Jenny - Steve Aoki & 3LAU",
      attributes: [
        {
          trait_type: "genre",
          value: "Electronic",
        },
        {
          trait_type: "tags",
          value: "edm,electronic,electro,bass,steveaoki,3lau,hype,dance",
        },
      ],
    };

    const client = new NFTStorage({ token: NFT_STORAGE_KEY })
    const metadata = await client.store(nftJSON)

    console.log('NFT data stored!')
    console.log('Metadata URI: ', metadata.url)
  }

  /**
  * A helper to read a file from a location on disk and return a File object.
  * Note that this reads the entire file into memory and should not be used for
  * very large files. 
  * @param {string} filePath the path to a file to store
  * @returns {File} a File object containing the file content
  */
  const fileFromPath = async (filePath) => {
    const content = await fs.promises.readFile(filePath)
    const type = mime.getType(filePath)
    return new File([content], path.basename(filePath), { type })
  }

}
