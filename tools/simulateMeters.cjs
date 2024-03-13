const {DeployPlugin, ArweaveSigner} = require("warp-contracts-plugin-deploy")
const {WarpFactory} = require("warp-contracts")

const fs = require("fs")
const path = require("path")

const environment = "mainnet"
let warp = environment == "testnet" ? WarpFactory.forTestnet().use(new DeployPlugin()) : WarpFactory.forMainnet().use(new DeployPlugin());


async function deploy(meter, sourceTxId){
    try{
       // const contractSrc = fs.readFileSync(path.join(__dirname, "../contract/contract.js"), "utf8")
        let jwk = await getWallet(meter)

        const initialState =  {
            kwh_balance: 800,
            public_key: "gW8kO2bIPMz7p08RzFFcVjUpiq1amYMD7VZjkNQUb-o" /*await warp.arweave.wallets.getAddress(jwk)*/ ,
            nft_id: 2,
            tariff: 0.231,
            nonce: 0,
            is_on: true,
        }
        console.log("address:", warp.arweave.wallets.getAddress(jwk), "wallet:", typeof jwk, jwk)

        const contractDets = await warp.deployFromSourceTx({
            wallet: new ArweaveSigner(jwk),
            initState: JSON.stringify(initialState),
            srcTxId: sourceTxId,
        })

        if(environment == "testnet"){
            fs.writeFileSync(path.join(__dirname, `../${meter}contractdets.json`), JSON.stringify(contractDets))
        }else{
            fs.writeFileSync(path.join(__dirname, `../${meter}mainnetContractDets.json`), JSON.stringify(contractDets))
        }
        console.log(contractDets)

    }catch(err){
        console.log("deploy error: ", err)
    }
}

async function getWallet(meter){
    try{
      let jwk = JSON.parse(fs.readFileSync(path.join(__dirname, `../${meter}jwk.json`), "utf8"))
      return jwk
    }catch(err){
        let jwk = await warp.arweave.wallets.generate()
        fs.writeFileSync(path.join(__dirname, `../${meter}jwk.json`), JSON.stringify(jwk))
        return jwk
    }
}

deploy("meter1", "IsQGMhm4rO5pQq6wr0fAFaaPghbcmqHjv5nVGn25a2k")