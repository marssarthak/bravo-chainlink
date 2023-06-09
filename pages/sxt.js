import React, { useEffect } from "react";
import SpaceAndTimeSDK from "../SpaceAndTimeSDK.js";
import {
  ED25519PublicKeyUint,
  ED25519PrivateKeyUint,
  b64PrivateKey,
  b64PublicKey,
  hexEncodedPrivateKey,
  hexEncodedPublicKey,
  biscuitPrivateKey,
} from "../utils/keygen.js";
import Utils from "../utils/utils-functions.js";
import  {biscuit, block, authorizer, Biscuit, KeyPair, Fact, PrivateKey, PublicKey} from '../biscuit-wasm/module/biscuit.js';
import SQLOperation from "../BiscuitConstants.js";
import fs, { access, write } from "fs";
import * as dotenv from "dotenv";
dotenv.config();
export default function sxt() {

  console.log(biscuit)
  const initSDK = SpaceAndTimeSDK.init();
  let userId = process.env.NEXT_PUBLIC_USERID;
  let joinCode = process.env.NEXT_PUBLIC_JOINCODE;
  let scheme = process.env.NEXT_PUBLIC_SCHEME;
  async function checkUserExist(id) {
    try {
      let [checkUserIDResponse, checkUserIDError] = await initSDK.checkUserId(
        id
      );
      if (checkUserIDResponse === true) {
        console.log("User already exists");
      } else {
        console.log("User don't exists");
      }
    } catch (e) {
      console.log(e);
    }
  }

  const createSchema = async() => {
    let [ createSchemaResponse, createSchemaError ] = await initSDK.CreateSchema("CREATE SCHEMA LINKO2");
    console.log(createSchemaResponse, createSchemaError);
  }
  const createTable = async() => {
    let resourceId = "LINKO2.USERS";
    let createSqlText = `CREATE TABLE LINKO2.USERS (wallet_address VARCHAR(255) PRIMARY KEY, username VARCHAR(50), email VARCHAR(255),fullname VARCHAR(100))`
    let accessType = "public_append";

    const biscuitPrivateKey = process.env.NEXT_PUBLIC_BISCUIT_PRIVATEKEY;
    const biscuitPubmicKey = process.env.NEXT_PUBLIC_BISCUIT_PUBLICKEY;
    const biscuitToken = generateBiscuit(resourceId, biscuitPrivateKey);
    const mainPublicKey = process.env.NEXT_PUBLIC_PUBLICKEY;
    console.log("Biscuit token", biscuitToken);
    let [CreateTableResponse, CreateTableError] = await initSDK.CreateTable(createSqlText, accessType, biscuitPubmicKey, biscuitToken);
    console.log(CreateTableResponse, CreateTableError);
  }



  useEffect(() => {
    console.log("creating table")
    createTable()
    // createSchema()
  }, [])


  let generateBiscuit = (resourceId, hexPrivateKey, biscuitOperation = "") => {
    Utils.checkPostgresIdentifier(resourceId);
    let queryTableName = resourceId.toLowerCase();
    let biscuitBuilder = biscuit``;

    const wildCardRequired = biscuitOperation === '*';

    if(wildCardRequired) {
        biscuitBuilder.merge(block`sxt:capability(${biscuitOperation},${biscuitOperation})`); 
    }
    else {
        const biscuitCapabilityContainer = [];
        biscuitCapabilityContainer.push(SQLOperation.CREATE.Value);
        biscuitCapabilityContainer.push(SQLOperation.ALTER.Value);
        biscuitCapabilityContainer.push(SQLOperation.DROP.Value);
        biscuitCapabilityContainer.push(SQLOperation.INSERT.Value);
        biscuitCapabilityContainer.push(SQLOperation.UPDATE.Value);
        biscuitCapabilityContainer.push(SQLOperation.MERGE.Value);
        biscuitCapabilityContainer.push(SQLOperation.DELETE.Value);
        biscuitCapabilityContainer.push(SQLOperation.SELECT.Value);


        for(const biscuitSQLOperation of biscuitCapabilityContainer) {
            biscuitBuilder.merge(block`sxt:capability(${biscuitSQLOperation},${queryTableName})`)
        }
    }

    let privKey = hexPrivateKey;
    let biscuitToken = biscuitBuilder.build(PrivateKey.fromString(privKey)).toBase64();
    return biscuitToken;
}


  async function GetTokens() {
    const tokens = initSDK.retrieveFileContents();
    const accessToken = tokens.accessToken;
    if (accessToken !== "") {
      let [validAccessTokenResponse, validAccessTokenError] =
        await initSDK.validateToken();
      if (validAccessTokenResponse) {
        console.log("Valid access token provided.");
        console.log("Valid User ID: ", validAccessTokenResponse);
      } else {
        let [refreshTokenResponse, refreshTokenError] =
          await initSDK.refreshToken();
        console.log("Refreshed Tokens: ", refreshTokenResponse);

        if (!refreshTokenResponse) {
          let [tokenResponse, tokenError] = await initSDK.AuthenticateUser();
          if (!tokenError) console.log(tokenResponse);
          else {
            console.log("Invalid User Tokens Provided");
            console.log(tokenError);
          }
        }
      }
    } else {
      let [tokenResponse, tokenError] = await initSDK.AuthenticateUser();
      if (!tokenError) console.log(tokenResponse);
      else {
        console.log("Invalid User Tokens Provided");
        console.log(tokenError);
      }
    }
  }

  GetTokens();

  return <div>sxt</div>;
}
