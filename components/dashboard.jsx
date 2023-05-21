import { SpheronClient, ProtocolEnum } from "@spheron/storage";

export function Dashboard() {
    const spheronToken = process.env.NEXT_PUBLIC_SPHERON_TOKEN;
    const client = new SpheronClient({ spheronToken });

    const uploadWithSpheron = async (e) => {
        const filePath = e.target.files[0];
        const name = e.target.name;

        let currentlyUploaded = 0;
        const { uploadId, bucketId, protocolLink, dynamicLinks } =
            await client.upload(filePath, {
                protocol: ProtocolEnum.IPFS,
                name: "toy",
                onUploadInitiated: (uploadId) => {
                    console.log(`Upload with id ${uploadId} started...`);
                },
                // onChunkUploaded: (uploadedSize, totalSize) => {
                //     currentlyUploaded += uploadedSize;
                //     console.log(
                //         `Uploaded ${currentlyUploaded} of ${totalSize} Bytes.`
                //     );
                // },
            });
    };

    return (
        <div>
            test
            <div>
                {/* <input type="name" placeholder="paste a link" onChange={uploadWithSpheron}/> */}
                {/* <button onClick={uploadToSpheron}>Upload</button> */}
                <input type="file" onChange={uploadWithSpheron}/>
                {/* <button onClick={uploadToSpheron}>Upload</button> */}
            </div>
        </div>
    );
}
