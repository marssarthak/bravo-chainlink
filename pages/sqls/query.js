import SpaceAndTimeSDK from "@/SpaceAndTimeSDK.js";

import Utils from "@/utils/utils-functions.js";
import  {biscuit, block, authorizer, Biscuit, KeyPair, Fact, PrivateKey, PublicKey} from '../../biscuit-wasm/module/biscuit.js';
import SQLOperation from "../../BiscuitConstants.js";


const initSDK = SpaceAndTimeSDK.init();

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

export async function registerUser (address, username, email, name) {
    let resourceId = "LINKO.USERS";
    const biscuitPrivateKey = process.env.NEXT_PUBLIC_BISCUIT_PRIVATEKEY;
    const biscuitToken = generateBiscuit(resourceId, biscuitPrivateKey);   

    let insertSqlText = `INSERT INTO LINKO.USERS VALUES('${address}', '${username}', '${email}', '${name}')`
    let [DMLResponse, DMLError] = await initSDK.DML(resourceId, insertSqlText, biscuitToken);
    console.log(DMLResponse, DMLError);
    return DMLResponse
}