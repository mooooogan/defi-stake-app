//to approve token and stake it
import { useContractFunction, useEthers } from "@usedapp/core"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import ERC20 from "../chain-info/contracts/MockERC20.json"
import networkMapping from '../chain-info/deployments/map.json'
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import { useEffect, useState } from "react"

export const useStakeTokens = (tokenAddress: string) => {
    //get a tokenfarm contract from tokenfarm address
    const { chainId } = useEthers()
    const { abi } = TokenFarm
    const tokenfarmAddress = chainId ? networkMapping[String(chainId)]['TokenFarm'][0] : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenfarmcontract = new Contract(tokenfarmAddress, tokenFarmInterface)
    //get a erc20 contract from token address
    const erc20abi = ERC20.abi
    const erc20interface = new utils.Interface(erc20abi)
    const erc20_contract = new Contract(tokenAddress, erc20interface)
    //approve
    const { send: approveandstakeERC20send, state: approveandstakeERC20state } = useContractFunction(erc20_contract, "approve", { transactionName: 'ApproveERC20transfer' })
    const [amounttoStake, setAmounttoStake] = useState("0")
    //approve(spender, amount)
    const approveandstake = (amount: string) => {
        setAmounttoStake(amount)
        return approveandstakeERC20send(tokenfarmAddress, amount)
    }
    const { send: stakeERC20, state: stakeState } = useContractFunction(tokenfarmcontract, "StakeToken", { transactionName: 'StakeERC20' })


    //useffect: do smth if a variable changes. So if anything in the array changes, will kick of a function
    useEffect(() => {
        if (approveandstakeERC20state.status == "Success") {
            stakeERC20(amounttoStake, tokenAddress)
        }
    }, [approveandstakeERC20state, amounttoStake, tokenAddress])

    const [state, setState] = useState(approveandstakeERC20state)

    useEffect(() => {
        if (approveandstakeERC20state.status === 'Success') {
            setState(stakeState)
        }
        else {
            setState(approveandstakeERC20state)
        }
    }, [approveandstakeERC20state, stakeState])

    return ({ approveandstake, state })
}