import React from 'react'
import { ED25519PublicKeyUint, ED25519PrivateKeyUint, b64PrivateKey, b64PublicKey, hexEncodedPrivateKey, hexEncodedPublicKey, biscuitPrivateKey } from "../utils/keygen.js";

export default function sxt() {

    console.log({ ED25519PublicKeyUint, ED25519PrivateKeyUint, b64PrivateKey, b64PublicKey, hexEncodedPrivateKey, hexEncodedPublicKey, biscuitPrivateKey })
    
  return (
    <div>sxt</div>
  )
}
