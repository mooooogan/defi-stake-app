import { useContractCall, useEthers, } from "@usedapp/core"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import networkMapping from '../chain-info/deployments/map.json'
import { constants, utils, BigNumber } from "ethers"
import { Contract } from "@ethersproject/contracts"

export const useGetStakingBalance = (tokenAddress: string | undefined): BigNumber | undefined => {
    const { chainId } = useEthers()
    const { account } = useEthers()
    const tokenfarmabi = TokenFarm.abi
    const tokenfarmAddress = chainId ? networkMapping[chainId]["TokenFarm"][0] : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(tokenfarmabi)
    //get balance
    const [stakingBalance] =
        useContractCall({
            abi: tokenFarmInterface,
            address: tokenfarmAddress,
            method: "stakingBalance",
            args: [tokenAddress, account],
        }) ?? []
    return stakingBalance
}