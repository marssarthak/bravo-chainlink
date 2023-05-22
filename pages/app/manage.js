import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { upload } from "@spheron/browser-upload";
import { useState } from "react";

export default function Dashboard() {
    
    const [inputLink, setInputLink] = useState("");

    // ---------- spheron

    const uploadWithSpheron = async (e) => {
        const response = await fetch(`http://localhost:3000/api/hello`); // get the temporary access token from server
        // console.log(response);
        const resJson = await response.json();
        // console.log(resJson);
        const token = resJson.uploadToken;

        const files = e.target.files[0];
        // console.log(files);

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
        console.log(`${protocolLink}/${files.name}`)
        setInputLink(`${protocolLink}/${files.name}`)
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
