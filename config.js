const mumbaiAddress = `0x3877f5823B2a0762Bec527d5d0D68b9cd8449cFB`
const hyperspaceAddress = `0xBa55f5cA3bdbd34e0996775Ac3CE1C1d6E7a08f7`

export const contractAddress = hyperspaceAddress

export const contractAbi = `[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "addrToTable",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getUserTable",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_tableName",
				"type": "string"
			}
		],
		"name": "setUserTable",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]`