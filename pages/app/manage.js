import React, { useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { upload } from "@spheron/browser-upload";
import { useState } from "react";
import { Database } from "@tableland/sdk";
// import LinkCard from "@/components/linkCard";
import { getDataFromAddress, getUsername } from "../sqls/query";
import { ethers } from "ethers";
import LoginButton from "@/components/LoginButton";

import web3modal from "web3modal";
import { nftContractAddress, nftContractAbi } from "../../config.js"

export default function Dashboard() {
  const [inputLink, setInputLink] = useState("");
  const [linkData, setLinkData] = useState([]);
  const [location, setLocation] = useState();
  const [open, setOpen] = useState();
  console.log(linkData);
  useEffect(() => {
    setLocation(window.location);
  }, []);

  const [userData, setUserData] = useState({
    address: "",
    username: "",
  });
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const getUserData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const username = await getUsername(address);
    if (!username) return false;
    setIsLoggedIn(true);
    setUserData({
      address,
      username,
    });

    return {
      address,
      username,
    };
  };

  async function getData() {
    setLoading(true);
    try {
      // const { results } = await db.prepare(`SELECT * FROM ${tableName};`).all();
      const userData = await getUserData();
      if (!userData) return false;
      const [DQLResponse, DQLError] = await getDataFromAddress(
        userData.address
      );
      console.log("Data from sxt", DQLResponse, DQLError);
      setLinkData(DQLResponse);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  console.log(linkData);
  useEffect(() => {
    getData();
  }, []);

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

  function LinkoCard({ item }) {
    const [usdPrice, setUsdPrice] = useState("")
    useEffect(() => {
        getUsdPrice(item.ID).then((price) => {
            setUsdPrice(price)
        })
    }, [])
    
    
    return (
      <div className="mt-10 relative">
        <div className="block flex justify-between items-end gap-3 w-3/4 relative p-6 mx-auto cursor-pointer bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
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

          <div className="">
            <p className="font-normal text-gray-700 dark:text-gray-400">
              price: {item.PRICE}MATIC
            </p>
            <p className="font-normal text-gray-700 dark:text-gray-400 my-2">
              USD Price : ${usdPrice}
            </p>
            {/* <button
              onClick={() => {
                // buyAccess(item);
              }}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Buy
            </button> */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        {isLoggedIn ? (
          <div className="p-4 sm:ml-64 pt-20 bg-gray-900 w-full min-h-screen">
            <h2 className="text-center text-4xl font-bold mt-4">Your Files</h2>
            {linkData.map((item, index) => {
              return <LinkoCard item={item} />;
            })}
          </div>
        ) : (
          <LoginButton loading={loading} />
        )}
      </div>
    </div>
  );
}
