// import React, { useEffect } from "react";
// import SpaceAndTimeSDK from "../SpaceAndTimeSDK.js";
// import {
//   ED25519PublicKeyUint,
//   ED25519PrivateKeyUint,
//   b64PrivateKey,
//   b64PublicKey,
//   hexEncodedPrivateKey,
//   hexEncodedPublicKey,
//   biscuitPrivateKey,
// } from "../utils/keygen.js";
// import Utils from "../utils/utils-functions.js";
// import  {biscuit, block, authorizer, Biscuit, KeyPair, Fact, PrivateKey, PublicKey} from '../biscuit-wasm/module/biscuit.js';
// import SQLOperation from "../BiscuitConstants.js";
// import * as dotenv from "dotenv";
// dotenv.config();
// export default function sxt() {
//   const initSDK = SpaceAndTimeSDK.init();
//   let userId = process.env.NEXT_PUBLIC_USERID;
//   let joinCode = process.env.NEXT_PUBLIC_JOINCODE;
//   let scheme = process.env.NEXT_PUBLIC_SCHEME;
//   async function checkUserExist(id) {
//     try {
//       let [checkUserIDResponse, checkUserIDError] = await initSDK.checkUserId(
//         id
//       );
//       if (checkUserIDResponse === true) {
//         console.log("User already exists");
//       } else {
//         console.log("User don't exists");
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   const createSchema = async() => {
//     let [ createSchemaResponse, createSchemaError ] = await initSDK.CreateSchema("CREATE SCHEMA LINKO2");
//     console.log(createSchemaResponse, createSchemaError);
//   }
//   const createTable = async() => {
//     let resourceId = "LINKO.DATA";
//     let createSqlText = `CREATE TABLE LINKO.DATA (cid VARCHAR(255) PRIMARY KEY, wallet_address VARCHAR(255), username VARCHAR(50), date VARCHAR(50), price DECIMAL(10, 2), name VARCHAR(100), desc VARCHAR, id INT)`
//     let accessType = "public_append";

//     const biscuitPrivateKey = process.env.NEXT_PUBLIC_BISCUIT_PRIVATEKEY;
//     const biscuitPubmicKey = process.env.NEXT_PUBLIC_BISCUIT_PUBLICKEY;
//     const biscuitToken = generateBiscuit(resourceId, biscuitPrivateKey);
//     const mainPublicKey = process.env.NEXT_PUBLIC_PUBLICKEY;
//     console.log("Biscuit token", biscuitToken);
//     let [CreateTableResponse, CreateTableError] = await initSDK.CreateTable(createSqlText, accessType, biscuitPubmicKey, biscuitToken);
//     console.log(CreateTableResponse, CreateTableError);
//   }


//   const read = async() => {
//     let scope = "ALL";
//     let namespace = "LINKO";
//     let owned = true;
//     let column = "BLOCK_NUMBER";
//     let tableName = "FUNGIBLETOKEN_WALLET";
    
//     /** Calls to Discovery APIs **/
//     // let [getTableResponse, getTableError] = await initSDK.getTables(scope,namespace);
//     // console.log(getTableResponse, getTableError);
//     let [getTableColumnResponse, getTableColumnError] = await initSDK.getTableColumns(namespace, "USERS");
// console.log(getTableColumnResponse, getTableColumnError);
    
//   }
//   const getUsers = async() => {
//     let selectSqlStatement = "SELECT * FROM LINKO.USERS"
//     let resourceId = "LINKO.USERS";
//     const biscuitPrivateKey = process.env.NEXT_PUBLIC_BISCUIT_PRIVATEKEY;
//     const biscuitToken = generateBiscuit(resourceId, biscuitPrivateKey);   

//     let [DQLResponse, DQLError] = await initSDK.DQL(resourceId, selectSqlStatement, biscuitToken);
//     console.log(DQLResponse, DQLError);
//   }

//   const checkUsernameExist = async(username) => {
//     let selectSqlStatement = `SELECT * FROM LINKO.USERS WHERE USERNAME='${username.toUpperCase()}'`
//     let resourceId = "LINKO.USERS";
//     const biscuitPrivateKey = process.env.NEXT_PUBLIC_BISCUIT_PRIVATEKEY;
//     const biscuitToken = generateBiscuit(resourceId, biscuitPrivateKey);   
//     try{
//       let [DQLResponse, DQLError] = await initSDK.DQL(resourceId, selectSqlStatement, biscuitToken);
//       console.log(DQLResponse, DQLError);
//     }

//     catch(e){
//       console.log(e)
//     }

//   }

//   async function put () {
//     let resourceId = "LINKO.FILES";
//     const biscuitPrivateKey = process.env.NEXT_PUBLIC_BISCUIT_PRIVATEKEY;
//     const biscuitToken = generateBiscuit(resourceId, biscuitPrivateKey);   

//     let insertSqlText = `INSERT INTO LINKO.FILES (wallet_address, username,date, price, name, desc) VALUES('0xabcxd', 'mars','1212121', 12.12,'sarthak','naah')`
//     let [DMLResponse, DMLError] = await initSDK.DML(resourceId, insertSqlText, biscuitToken);
//     console.log(DMLResponse, DMLError);
//   }



//   useEffect(() => {
//     console.log("creating table")
//     // put()
//     read() 
//     // getUsers()
//     // GetTokens();
//     // createTable()
//     // login(
//     //   "0x61edcdf5bb737adffe5043706e7c5bb1f1a56eea",
//     //   "Gemini",
//     //   "gemini@gmail.com",
//     //   "Gemini account"
//     // )
//     // createSchema()

//   }, [])


//   async function login (address, username, email, name) {
//     let resourceId = "LINKO.USERS";
//     const biscuitPrivateKey = process.env.NEXT_PUBLIC_BISCUIT_PRIVATEKEY;
//     const biscuitToken = generateBiscuit(resourceId, biscuitPrivateKey);   

//     let insertSqlText = `INSERT INTO LINKO.USERS VALUES('${address}', '${username}', '${email}', '${name}')`
//     let [DMLResponse, DMLError] = await initSDK.DML(resourceId, insertSqlText, biscuitToken);
//     console.log(DMLResponse, DMLError);
//   }

//   let generateBiscuit = (resourceId, hexPrivateKey, biscuitOperation = "") => {
//     Utils.checkPostgresIdentifier(resourceId);
//     let queryTableName = resourceId.toLowerCase();
//     let biscuitBuilder = biscuit``;

//     const wildCardRequired = biscuitOperation === '*';

//     if(wildCardRequired) {
//         biscuitBuilder.merge(block`sxt:capability(${biscuitOperation},${biscuitOperation})`); 
//     }
//     else {
//         const biscuitCapabilityContainer = [];
//         biscuitCapabilityContainer.push(SQLOperation.CREATE.Value);
//         biscuitCapabilityContainer.push(SQLOperation.ALTER.Value);
//         biscuitCapabilityContainer.push(SQLOperation.DROP.Value);
//         biscuitCapabilityContainer.push(SQLOperation.INSERT.Value);
//         biscuitCapabilityContainer.push(SQLOperation.UPDATE.Value);
//         biscuitCapabilityContainer.push(SQLOperation.MERGE.Value);
//         biscuitCapabilityContainer.push(SQLOperation.DELETE.Value);
//         biscuitCapabilityContainer.push(SQLOperation.SELECT.Value);


//         for(const biscuitSQLOperation of biscuitCapabilityContainer) {
//             biscuitBuilder.merge(block`sxt:capability(${biscuitSQLOperation},${queryTableName})`)
//         }
//     }

//     let privKey = hexPrivateKey;
//     let biscuitToken = biscuitBuilder.build(PrivateKey.fromString(privKey)).toBase64();
//     return biscuitToken;
// }


//   async function GetTokens() {
//     const tokens = initSDK.retrieveFileContents();
//     const accessToken = tokens.accessToken;
//     if (accessToken !== "") {
//       let [validAccessTokenResponse, validAccessTokenError] =
//         await initSDK.validateToken();
//       if (validAccessTokenResponse) {
//         console.log("Valid access token provided.");
//         console.log("Valid User ID: ", validAccessTokenResponse);
//       } else {
//         let [refreshTokenResponse, refreshTokenError] =
//           await initSDK.refreshToken();
//         console.log("Refreshed Tokens: ", refreshTokenResponse);

//         if (!refreshTokenResponse) {
//           let [tokenResponse, tokenError] = await initSDK.AuthenticateUser();
//           if (!tokenError) console.log(tokenResponse);
//           else {
//             console.log("Invalid User Tokens Provided");
//             console.log(tokenError);
//           }
//         }
//       }
//     } else {
//       let [tokenResponse, tokenError] = await initSDK.AuthenticateUser();
//       if (!tokenError) console.log(tokenResponse);
//       else {
//         console.log("Invalid User Tokens Provided");
//         console.log(tokenError);
//       }
//     }
//   }


//   return <div>sxt</div>;
// }


import React from 'react'

export default function sxt() {
  return (
    <div>sxt</div>
  )
}
