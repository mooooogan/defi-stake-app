import { useEthers } from "@usedapp/core";
import helper_config from "../helper_config.json"
import networkMapping from '../chain-info/deployments/map.json'
import { constants } from "ethers"
import brownieConfig from "../brownie_config.json"
import dapp from "../dapp.png"
import eth from "../eth.png"
import dai from "../dai.png"
import { YourWallet } from "./yourWallet/yourwallet"
import { makeStyles } from "@material-ui/core";
import { StakeInfo } from "./yourWallet/stakedInfo"

export type token = {
    image: string,
    address: string,
    name: string
}

const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.common.white,
        textAlign: "center",
        padding: theme.spacing(4)
    }
})
)
export const Main = () => {
    //Show token alues in wallet
    //Get address of token
    //Get balance in users wallet

    //need to send brownie-config to fe ('src' folder)
    // send to build folder (access to dapp token/token farm address) 
    const classes = useStyles()
    const { chainId } = useEthers();
    const networkName = chainId ? helper_config[chainId] : "development"
    const dappTokenAddress = chainId ? networkMapping[String(chainId)]['DAPPs'][0] : constants.AddressZero
    const wethToken = chainId ? brownieConfig['networks'][networkName]['weth_token'] : constants.AddressZero
    const fauToken = chainId ? brownieConfig['networks'][networkName]['fau_token'] : constants.AddressZero

    const supportedToken: Array<token> = [
        {
            image: dapp,
            address: dappTokenAddress,
            name: "DAPP"
        },
        {
            image: eth,
            address: wethToken,
            name: "ETH"
        },
        {
            image: dai,
            address: fauToken,
            name: "DAI"
        }

    ]

    return (
        <>
            <h2 className={classes.title}>Dapp Token Staking APP</h2>
            <YourWallet supportedTokens={supportedToken} />
            <StakeInfo supportedTokens={supportedToken} />
        </>

    )

}