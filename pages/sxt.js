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
import fs, { access, write } from "fs";
import * as dotenv from "dotenv";
dotenv.config();
export default function sxt() {
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
