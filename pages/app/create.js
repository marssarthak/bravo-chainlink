import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import { Database } from "@tableland/sdk";
import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";
import { nftContractAddress, nftContractAbi } from "../../config.js";
import web3modal from "web3modal";
import Loader from "@/components/Loader.jsx";
import { addLinko, getUsername } from "../../sqls/query.js";
import { useAccount } from "wagmi";
import LoginButton from "@/components/LoginButton.js";

export default function Home() {
  const [loading, setLoading] = useState(false);
  // const [formData, setFormData] = useState({
  //   filename: "file1",
  //   price: "0.12",
  //   description: "description",
  //   cid: "QmRm3YWjwKwuA7GfNchVz3nGPzz1Dcc9HF7wQz5kXdpY36",
  //   linkId: 10,
  // });
  const [formData, setFormData] = useState({
    filename: "",
    price: "",
    description: "",
    cid: "",
    linkId: ""
  });

  const [userData, setUserData] = useState({
    address: "",
    username: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  console.log(userData);

  const getUserData = async () => {
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const username = await getUsername(address);
      setLoading(false);
      if (!username) return false;
      setIsLoggedIn(true)
      setUserData({
        address,
        username,
      });
    } catch (e) {
      setLoading(false);
      
      console.log(e);
    }
  };

  useEffect(() => {
    getUserData()
  }, []);

  const lighthouseKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY;

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

  const progressCallback = (progressData) => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
    console.log(percentageDone);
  };

  // main function
  const uploadFileEncrypted = async (e) => {
    setLoading(true);
    const sig = await encryptionSignature();
    const response = await lighthouse.uploadEncrypted(
      e,
      lighthouseKey,
      sig.publicKey,
      sig.signedMessage,
      progressCallback
    );
    console.log(response);

    applyAccessConditions(response.data.Hash);
    const linkId = await getLinkoId();
    setLoading(false);

    setFormData({
      ...formData,
      cid: response.data.Hash,
      linkId: +linkId + 1,
    });
  };

  const getLinkoId = async () => {
    const modal = new web3modal();
    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      nftContractAddress,
      nftContractAbi,
      provider
    );

    const data = await contract.linkoId();
    return data;
  };

  const applyAccessConditions = async (cid) => {
    const conditions = [
      {
        id: 1,
        chain: "mumbai",
        method: "balanceOf",
        standardContractType: "ERC721",
        contractAddress: nftContractAddress,
        returnValueTest: { comparator: ">=", value: "1" },
        parameters: [":userAddress"],
      },
    ];

    const aggregator = "([1])";
    const { publicKey, signedMessage } = await encryptionSignature();

    const response = await lighthouse.applyAccessCondition(
      publicKey,
      cid,
      signedMessage,
      conditions,
      aggregator
    );

    console.log(response);
  };

  const setViewCollection = async () => {
    const modal = new web3modal();
    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      nftContractAddress,
      nftContractAbi,
      signer
    );

    const price_ = ethers.utils.parseEther(formData.price);

    const tx = await contract.setViewCollection(formData.cid, price_);
    await tx.wait();
    console.log(tx);
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await setViewCollection();
    try {
      const d = new Date();
      await addLinko(
        formData.cid,
        userData.address,
        userData.username,
        d.toISOString(),
        formData.price,
        formData.filename,
        formData.description,
        formData.linkId
      );

      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        {!isLoggedIn ? (
          <LoginButton loading={loading} />
        ) : (
          <div className="p-4 sm:ml-64 pt-20 bg-gray-900 w-full h-screen">
            <div className="text-white">
              <div className="mt-10">
                <h1 className="font-bold text-3xl text-center mb-4">
                  Host a File
                </h1>
              </div>
              <div className="block w-3/4 relative p-6 mx-auto cursor-pointer border rounded-lg shadow bg-gray-800 border-gray-700">
                <div className="relative px-10 py-10">
                  <div>
                    <form
                      onSubmit={handelSubmit}
                      noValidate=""
                      className="flex flex-col gap-4"
                    >
                      <div className="flex w-full gap-6">
                        <div className="flex-1">
                          <label
                            htmlFor="email"
                            className="ml-2 mb-2 block text-sm font-semibold"
                          >
                            File Name
                          </label>
                          <div className="relative">
                            <input
                              id="entryContract"
                              className="input-error border-gel-accent border px-6 py-3 form-input"
                              name="entryContract"
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  filename: e.target.value,
                                })
                              }
                              value={formData.filename}
                            />
                          </div>
                          {/* <div className="p-2 text-sm text-gel-accent first-letter:capitalize">
                  This field is required
                </div> */}
                        </div>
                        <div className="flex-1">
                          <label
                            htmlFor="email"
                            className="ml-2 mb-2 block text-sm font-semibold"
                          >
                            Price
                          </label>
                          <div className="relative">
                            <input
                              id="price"
                              type="number"
                              className="input-error border-gel-accent border px-6 py-3 form-input"
                              name="price"
                              value={formData.price}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  price: e.target.value,
                                })
                              }
                            />
                          </div>
                          {/* <div className="p-2 text-sm text-gel-accent first-letter:capitalize">
                  This field is required
                </div> */}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="ml-2 mb-2 block text-sm font-semibold"
                        >
                          Description
                        </label>
                        <div className="relative">
                          <input
                            id="description"
                            className="input-error border-gel-accent border px-6 py-3 form-input"
                            name="description"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                            value={formData.description}
                          />
                        </div>
                        {/* <div className="p-2 text-sm text-gel-accent first-letter:capitalize">
                  This field is required
                </div> */}
                      </div>

                      <div>
                        <p className="ml-2 mb-2 block text-sm font-semibold">
                          Choose File
                        </p>
                        <div className="flex ">
                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor="dropzone-file"
                              className="flex flex-col items-center justify-center w-full capa h-64 border-2 border-dashed rounded-lg cursor-pointerbg-gray-800"
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg
                                  aria-hidden="true"
                                  className="w-10 h-10 mb-3 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                  />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-semibold">
                                    Click to upload
                                  </span>{" "}
                                  or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                                </p>
                              </div>
                              <input
                                onChange={uploadFileEncrypted}
                                id="dropzone-file"
                                type="file"
                                className="hidden"
                              />
                            </label>
                          </div>
                          {/* <div className="ml-6 flex-shrink-0 overflow-hidden rounded-md">
                <img
                  className="h-64 w-auto"
                  src={imgBase64 || "./download.gif"}
                  alt=""
                />
              </div> */}
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="text-white mt-5 gradient-blue w-40 bg-[#4b507a] hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-3 mr-2 mb-2 dark:bg-[#4b507a] dark:hover:bg-slate-800 dark:focus:ring-gray-700 dark:border-gray-700"
                      >
                        Host
                      </button>
                    </form>
                  </div>
                  {loading ? <Loader /> : null}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
