import React from 'react'
import SpaceAndTimeSDK from "../SpaceAndTimeSDK.js";
import { ED25519PublicKeyUint, ED25519PrivateKeyUint, b64PrivateKey, b64PublicKey, hexEncodedPrivateKey, hexEncodedPublicKey, biscuitPrivateKey } from "../utils/keygen.js";
import Utils from '../utils/utils-functions.js';	
// import  {biscuit, block, authorizer, Biscuit, KeyPair, Fact, PrivateKey} from '@biscuit-auth/biscuit-wasm';
import SQLOperation from '../BiscuitConstants.js';	
;
export default function sxt() {
    const initSDK = SpaceAndTimeSDK.init();

    let userId = process.env.USERID;
    let joinCode = process.env.JOINCODE;
    let scheme = process.env.SCHEME;

    console.log(userId, joinCode, scheme)

    console.log({ ED25519PublicKeyUint, ED25519PrivateKeyUint, b64PrivateKey, b64PublicKey, hexEncodedPrivateKey, hexEncodedPublicKey, biscuitPrivateKey })
    
  return (
    <div>sxt</div>
  )
}
