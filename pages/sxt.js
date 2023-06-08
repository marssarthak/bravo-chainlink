import React from "react";
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
// import  {biscuit, block, authorizer, Biscuit, KeyPair, Fact, PrivateKey} from '@biscuit-auth/biscuit-wasm';
import SQLOperation from "../BiscuitConstants.js";
import fs, { access, write } from 'fs';
import * as dotenv from 'dotenv' 
dotenv.config();
export default function sxt() {
  const initSDK = SpaceAndTimeSDK.init();
  let userId = process.env.NEXT_PUBLIC_USERID;
  let joinCode = process.env.NEXT_PUBLIC_JOINCODE;
  let scheme = process.env.NEXT_PUBLIC_SCHEME;
  async function checkUserExist(id) {
    try{
      let [ checkUserIDResponse, checkUserIDError ] = await initSDK.checkUserId(id);
      if (checkUserIDResponse === true){
        console.log("User already exists");
      }
      else{
        console.log("User don't exists")
      }
    }
    catch(e){
      console.log(e)
    }
  }


  async function authenticateUser(){
    let [ tokenResponse, tokenError ] = await initSDK.AuthenticateUser();
    console.log(tokenResponse, tokenError);

    // // Reading access and refresh tokens from the file
    // const fileContents = fs.readFileSync('session.txt','utf8');
    // const fileLines = fileContents.split(/\r?\n/);
  }


  authenticateUser()


  return <div>sxt</div>;
}
