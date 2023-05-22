// https://anshs-gum3road.infura-ipfs.io/ipfs/QmXVW8S93KP76jwFqrJjXawyJMjnax3mr1U3dzSovfvch1

import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { upload } from "@spheron/browser-upload";
import { useState } from "react";
// import { Web3Storage } from "web3.storage";

export default function Dashboard() {
    
    const [inputLink, setInputLink] = useState("");

    // ---------- web3.storage

    // const web3StorageKey = process.env.NEXT_PUBLIC_WEB3STORAGE;

    // function getAccessToken() {
    //     return web3StorageKey;
    // }

    // function makeStorageClient() {
    //     return new Web3Storage({ token: getAccessToken() });
    // }

    // const uploadToIPFS = async (files) => {
    //     const client = makeStorageClient();
    //     const cid = await client.put(files);
    //     return cid;
    // };

    // const uploadWithWeb3Storage = async (e) => {
    //     const data = e.target.files[0];
    //     const files = [new File([data], "data.json")];
    //     try {
    //         const metaCID = await uploadToIPFS(files);
    //         const metaUrl = `https://ipfs.io/ipfs/${metaCID}/data.json`;
    //         console.log(metaUrl);
    //         return metaUrl;
    //     } catch (error) {
    //         console.log("Error uploading:", error);
    //     }
    // };

    // ---------- spheron

    const uploadWithSpheron = async (e) => {
        const response = await fetch(`http://localhost:3000/api/hello`); // get the temporary access token from server
        console.log(response);
        const resJson = await response.json();
        console.log(resJson);
        const token = resJson.uploadToken;

        const files = e.target.files[0];
        console.log(files);

        let currentlyUploaded = 0;

        const { uploadId, bucketId, protocolLink, dynamicLinks } = await upload([files], {
                token,
                onChunkUploaded: (uploadedSize, totalSize) => {
                    currentlyUploaded += uploadedSize;
                    console.log(
                        `Uploaded ${currentlyUploaded} of ${totalSize} Bytes.`
                    );
                },
            }
        );
    };

    // ----------

    return (
        <div>
            <Navbar />
            <div className="flex">
                <Sidebar />
                <div className="flex flex-col">
                    <button>Manage</button>
                    <input type="file" onChange={uploadWithSpheron} />
                    <input
                        type="name"
                        onChange={(e) => setInputLink(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
