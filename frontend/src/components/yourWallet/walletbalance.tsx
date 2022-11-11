import { token } from "../main"
import { useEthers, useTokenBalance } from "@usedapp/core"
import { formatUnits } from '@ethersproject/units'
import { BalanceMsg } from "../balanceMsg"

export interface WalletBalanceProps {
    Token: token
}
export const WalletBalance = ({ Token }: WalletBalanceProps) => {
    const { image, address, name } = Token
    const { account } = useEthers()
    const tokenBalance = useTokenBalance(address, account)
    const formatted_balance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    return (
        <BalanceMsg
            label={`Your un-staked ${name} balance`}
            token_img={image}
            amount={formatted_balance} />
    )
}