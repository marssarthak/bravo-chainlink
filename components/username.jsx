import React, { useEffect, useState } from "react";
import SpaceAndTimeSDK from "../SpaceAndTimeSDK.js";
import Utils from "../utils/utils-functions.js";
import  {biscuit, block, authorizer, Biscuit, KeyPair, Fact, PrivateKey, PublicKey} from '../biscuit-wasm/module/biscuit.js';
import SQLOperation from "../BiscuitConstants.js";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


export default function Username({setUserNameGlobal, handleNext}) {
    const initSDK = SpaceAndTimeSDK.init();
    let resourceId = "LINKO.USERS";
    const [userName, setUserName] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    
    useEffect(() => {
        initSDK.GetTokens();
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


    const checkUserNameAvailable = async(username) => {
        let selectSqlStatement = `SELECT * FROM LINKO.USERS WHERE USERNAME='${username.toUpperCase()}'`
        const biscuitPrivateKey = process.env.NEXT_PUBLIC_BISCUIT_PRIVATEKEY;
        const biscuitToken = generateBiscuit(resourceId, biscuitPrivateKey);   
    
        let [DQLResponse, DQLError] = await initSDK.DQL(resourceId, selectSqlStatement, biscuitToken);
        console.log(DQLResponse, DQLError)

        // if (DQLError) return false;

        if (DQLResponse?.length==0){
            return true;
        }
        else{
            return false;
        }
    }


    async function handleClick() {
        if (userName === ""){
            setError("Username is required")
            return 
        }
        setLoading(true);
        setError("")
       
        try{
            const isUsernameAvailable = await checkUserNameAvailable(userName)
            console.log(isUsernameAvailable)

            if (!isUsernameAvailable){
                setLoading(false);
                setError("Username is occupied")
                return
            }

            setUserNameGlobal(userName);
            setLoading(false);
            handleNext()
        }
        catch(e){
            setLoading(false)
        }
      }
  return (
    <div>
        <div className="mt-8 flex gap-4 mb-2">
            <TextField
                error={error!==""}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                fullWidth
                className="text-white"
                id="username"
                label="Username"
                placeholder="Create your username"
                helperText={error}
            />

            <Button disabled={loading} sx={{minWidth: "120px", backgroundColor: "#90caf9 !important"}} onClick={handleClick} variant="contained" >
                Save
            </Button>
        </div>
    </div>
  )
}






