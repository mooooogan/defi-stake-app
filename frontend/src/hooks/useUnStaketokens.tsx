import { useContractFunction, useEthers, useMulticallAddress } from "@usedapp/core"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import ERC20 from "../chain-info/contracts/MockERC20.json"
import networkMapping from '../chain-info/deployments/map.json'
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import { useEffect, useState } from "react"
import { id } from "ethers/lib/utils"

export const useUnstakeToken = (tokenAddress: string) => {
    const { chainId } = useEthers()
    const tokenfarmabi = TokenFarm.abi
    const tokenfarmAddress = chainId ? networkMapping[chainId]["TokenFarm"][0] : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(tokenfarmabi)
    const tokenfarmcontract = new Contract(tokenfarmAddress, tokenFarmInterface)
    const erc20_abi = ERC20.abi
    const erc20_interface = new utils.Interface(erc20_abi)
    const erc20_contract = new Contract(tokenAddress, erc20_interface)
    //approve
    const { send: approveandunstakeERC20send, state: approveandunstakeERC20state } = useContractFunction(erc20_contract, "approve", { transactionName: 'ApproveERC20transfer' })
    const [amounttounStake, setAmounttounStake] = useState("0")
    const approveandunstake = (amount: string) => {
        setAmounttounStake(amount)
        return approveandunstakeERC20send(tokenfarmAddress, amounttounStake)
    }
    const { send: unstake, state: unstakestate } = useContractFunction(tokenfarmcontract, 'unstakeToken', { transactionName: 'UnstakeERC20' })
    const [state, setState] = useState(approveandunstakeERC20state)

    useEffect(() => {
        if (approveandunstakeERC20state.status == "Success") {
            unstake(tokenAddress)
        }
    }, [approveandunstakeERC20state, amounttounStake, tokenAddress])

    useEffect(() => {
        if (approveandunstakeERC20state.status == 'Success') {
            setState(unstakestate)
        }
        else {
            setState(approveandunstakeERC20state)
        }
    }, [approveandunstakeERC20state, unstakestate])

    return ({ approveandunstake, state })
}