import { token } from "../main"
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import { formatUnits } from '@ethersproject/units'
import { Input, Button, Slider, Box, CircularProgress, Snackbar, Typography, Grid, makeStyles } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import React, { useState, useEffect } from "react"
import { useStakeTokens } from "../../hooks/useStakeToken"
import { utils } from "ethers"

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(2),
        width: "100%",
    },
    slider: {
        width: "100%",
        maxWidth: "400px",
    },
}))



interface stakeFormProps {
    Token: token
}


export const StakeForm = ({ Token }: stakeFormProps) => {
    const classes = useStyles();
    const { notifications } = useNotifications()
    const { image, address, name } = Token
    const { account } = useEthers()
    const tokenBalance = useTokenBalance(address, account)
    const formattedBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    const [amount, setAmount] = useState<number | string | Array<number | string>>(0);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value === '' ? '' : Number(event.target.value));
    };
    const { approveandstake, state: checkState } = useStakeTokens(address)
    const handleStakeSubmit = () => {
        const as_percentage = Number(formattedBalance) * (Number(amount) / 100)
        const amountAswei = utils.parseEther(as_percentage.toString())
        setAmount(as_percentage)
        return approveandstake(amountAswei.toString())
    }

    const IsMining = checkState.status === 'Mining'

    const [showERC20approvesuccess, setERC20approvesuccess] = useState(false)
    const [showERC20stakesuccess, setERC20stakesuccess] = useState(false)
    const handleclosesnack = () => {
        setERC20approvesuccess(false)
        setERC20stakesuccess(false)
    }

    useEffect(() => {
        if (notifications.filter
            (
                (notification) =>
                    notification.type === 'transactionSucceed' &&
                    notification.transactionName === 'ApproveERC20transfer'
            ).length > 0
        ) {
            setERC20approvesuccess(true)
            setERC20stakesuccess(false)
        }
        if (notifications.filter
            (
                (notification) =>
                    notification.type === 'transactionSucceed' &&
                    notification.transactionName === 'StakeERC20'
            ).length > 0
        ) {
            setERC20approvesuccess(false)
            setERC20stakesuccess(true)
        }
    }, [notifications, setERC20approvesuccess, setERC20stakesuccess])



    return (
        <>
            <div>
                {/* <Box sx={{ width: 250 }}> */}
                <Typography id="input-slider" gutterBottom>
                    Volume
                </Typography>
                <div >
                    <div className={classes.container}>
                        <Slider
                            value={typeof amount === 'number' ? amount : 0}
                            onChange={(_, newValue) => setAmount(newValue)}
                            aria-labelledby="input-slider"
                            className={classes.slider}
                        />
                    </div>
                    <div >
                        <Input
                            value={amount}
                            onChange={handleInputChange}
                            inputProps={{
                                step: 10,
                                min: 0,
                                max: 100,
                                type: "number",
                                'aria-labelledby': 'input-slider',
                            }}
                        />
                    </div>
                </div>
                {/* </Box> */}

            </div>
            <div>
                <Button color="primary" size="large"
                    onClick={handleStakeSubmit}
                    disabled={IsMining}>
                    {IsMining ? <CircularProgress
                        size={26} /> : "Stake!"}

                </Button>
            </div>
            <Snackbar open={showERC20approvesuccess} autoHideDuration={5000} onClose={handleclosesnack} >
                <Alert onClose={handleclosesnack} severity='success'>
                    {name} token transfer approved
                </Alert>
            </Snackbar>
            <Snackbar open={showERC20stakesuccess} autoHideDuration={5000} onClose={handleclosesnack}>
                <Alert onClose={handleclosesnack} severity='success'>
                    {amount} {name} token staked
                </Alert>
            </Snackbar>
        </>


    )
}