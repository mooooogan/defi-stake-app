import { token } from "../main"
import { useEthers, useTokenBalance } from "@usedapp/core"
import { formatUnits } from '@ethersproject/units'
import { BalanceMsg } from "../balanceMsg"
import { useGetStakingBalance } from "../../hooks/useGetTotalValue"

export interface StakeBalanceProps {
    Token: token
}
export const StakeBalance = ({ Token }: StakeBalanceProps) => {
    const { image, address, name } = Token
    const { account } = useEthers()
    const stakingbalance = useGetStakingBalance(address)
    const formatted_stakebalance: number = stakingbalance ? parseFloat(formatUnits(stakingbalance, 18)) : 0
    return (
        <BalanceMsg
            label={`Your staked ${name} balance`}
            token_img={image}
            amount={formatted_stakebalance} />
    )
}