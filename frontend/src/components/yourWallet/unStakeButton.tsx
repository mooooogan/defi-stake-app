import { token } from "../main"
import { useUnstakeToken } from "../../hooks/useUnStaketokens"
import { useGetStakingBalance } from "../../hooks/useGetTotalValue"
import { Button, Input, CircularProgress, Snackbar } from "@material-ui/core"
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import { useState } from "react"

interface unstakeTokenProps {
    Token: token
}

export const UnstakeToken = ({ Token }: unstakeTokenProps) => {
    const { image, address, name } = Token
    const { approveandunstake, state: checkState } = useUnstakeToken(address)
    const handleUnstake = () => {
        return approveandunstake(address)
    }
    const IsMining = checkState.status === 'Mining'

    return (
        <>
            <div>
                <Button color="primary" size="large"
                    onClick={handleUnstake}
                    disabled={IsMining}>
                    {IsMining ? <CircularProgress
                        size={26} /> : "Unstake all " + name + " token"}

                </Button>
            </div>
            {/* <Snackbar open={showERC20approvesuccess} autoHideDuration={5000} onClose={handleclosesnack} >
                <Alert onClose={handleclosesnack} severity='success'>
                    {name} token transfer approved
                </Alert>
            </Snackbar>
            <Snackbar open={showERC20stakesuccess} autoHideDuration={5000} onClose={handleclosesnack}>
                <Alert onClose={handleclosesnack} severity='success'>
                    {amount} {name} token staked
                </Alert>
            </Snackbar> */}
        </>


    )

}