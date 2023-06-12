import { useEffect, useState } from "react";
import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";
import { nftContractAddress, nftContractAbi } from "../config.js";
import { saveAs } from "file-saver";
import web3modal from "web3modal";
import { Navbar } from "@/components/navbar.jsx";
import { Sidebar } from "@/components/sidebar.jsx";
import { getDataFromusername } from "./sqls/query";
import { useRouter } from "next/router.js";
export default function Decrypt() {
  const [fileURL, setFileURL] = useState(null);
  const [linkos, setLinkos] = useState([]);
  const router = useRouter();
  const { id } = router.query;


  console.log("id ", id)

  useEffect(() => {
    if (id){
        fetchPaidLinks();
    }
  }, [id]);


  const fetchPaidLinks = async () => {
    const modal = new web3modal();
    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const contract = new ethers.Contract(
      nftContractAddress,
      nftContractAbi,
      provider
    );

    // const data = await contract.fetchLinko();

    // const items = await Promise.all(
    //   data.map(async (i) => {
    //     let price = ethers.utils.formatEther(i.price);
    //     let usdPrice = ethers.utils.formatEther(i.usdPrice);
    //     let item = {
    //       cid: i.cid,
    //       price,
    //       usdPrice,
    //       host: i.host.toString(),
    //       linkoId: i.linkoId,
    //     };
    //     return item;
    //   })
    // );

    const  [DQLResponse, DQLError] = await getDataFromusername(id)

    console.log(DQLResponse);
    setLinkos(DQLResponse);
  };

  const buyAccess = async (prop) => {
    const modal = new web3modal();
    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      nftContractAddress,
      nftContractAbi,
      signer
    );

    const price = ethers.utils.parseUnits(prop.price.toString(), "ether");

    const tx = await contract.mint(prop.linkoId, {
      value: price,
      gasLimit: 1000000,
    });
    await tx.wait();
    decrypt(prop.cid);

    console.log(tx);
  };

  async function getUsdPrice(id){
    const modal = new web3modal();
    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const contract = new ethers.Contract(
        nftContractAddress,
        nftContractAbi,
        provider
    );
    const data = await contract.idToLinko(id);
    console.log(data);
    let usdPrice_ = ethers.utils.formatEther(data.usdPrice);
    return usdPrice_;
  }

  const encryptionSignature = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const messageRequested = (await lighthouse.getAuthMessage(address)).data
      .message;
    const signedMessage = await signer.signMessage(messageRequested);
    return {
      signedMessage: signedMessage,
      publicKey: address,
    };
  };

  const decrypt = async (cid) => {
    const { publicKey, signedMessage } = await encryptionSignature();

    const keyObject = await lighthouse.fetchEncryptionKey(
      cid,
      publicKey,
      signedMessage
    );

    const fileType = "image/jpeg";
    const decrypted = await lighthouse.decryptFile(
      cid,
      keyObject.data.key,
      fileType
    );
    console.log(decrypted);

    const url = URL.createObjectURL(decrypted);
    console.log(url);
    setFileURL(url);
    Download(cid, url);
  };

  async function Download(_fileName, _fileUrl) {
    const name = _fileName;
    const fileUrl = _fileUrl;
    saveAs(fileUrl, name);
  }
  

  function LinkoCard({item}) {
    const prop = {
        cid:item.CID,
        price:item.PRICE,
        linkoId:item.ID
    }
    return (
    //   <div>
    //     <div>cid : {prop.cid}</div>
    //     <div>price : {prop.price}</div>
    //     <div>usdPrice : {prop.usdPrice}</div>
    //     <div onClick={() => buyAccess(prop)}>
    //       <p>Buy</p>
    //     </div>
    //   </div>
    <div className="mt-10 relative">
    <div
      className="block w-3/4 relative p-6 mx-auto cursor-pointer bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
    >
              <div className="flex justify-between">
            <div>
              <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {item.NAME}
              </p>
              <p className="font-normal text-gray-700 dark:text-gray-400 mt-1 mb-2">
                {item.DESC}
              </p>
              <p className="mb-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
                CID: {item.CID}
              </p>
            </div>
          </div>


    

      <div className="flex justify-between">
        <p className="font-normal text-gray-700 dark:text-gray-400 mt-2">
            price: {item.PRICE}FIL | USD Price : ${item.usdPrice}
        </p>
            <button
                onClick={()=>{buyAccess(prop)}}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                Buy
            </button>
     </div>

     
      {/* {
      loading
      ? <Loader />
      : null
      } */}
    </div>
  </div>
    );
  }

  return (
    // <>
    //     <div>
    //         <div>
    //             {linkos.map((item, i) => (
    //                 <LinkoCard
    //                     key={i}
    //                     cid={item.cid}
    //                     price={item.price}
    //                     usdPrice={item.usdPrice}
    //                     host={item.host}
    //                     linkoId={item.linkoId}
    //                 />
    //             ))}
    //         </div>
    //     </div>
    // </>

    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="p-4 sm:ml-64 pt-20 bg-gray-900 w-full min-h-screen">
            {linkos.map((item, i) => (
                    <LinkoCard
                        key={i}
                        item={item}
                    />
                ))}
        </div>
      </div>
    </div>
  );
}
