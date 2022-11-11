import { useEthers } from "@usedapp/core"
import { Button, makeStyles } from "@material-ui/core"

const useStyle = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(4),
        display: "flex",
        justifyContent: "flex-end",
        gap: theme.spacing(1)
    },
    button: {
        backgroundColor: "light grey"
    },
}))

/* to define a function */
export const Header = () => {
    const classes = useStyle()
    const { activateBrowserWallet, deactivate, account } = useEthers()
    /*
    check if user is connected, if account is not undefined means we are connected
     */
    const isConnected = account !== undefined
    return (
        <>
            <div className={classes.container}>
                <div>
                    {isConnected ? (
                        <Button color='primary' variant="contained">
                            {account}
                        </Button>
                    ) : (<div></div>

                    )
                    }
                </div>
                <div>

                    {isConnected ? (
                        <Button className={classes.button} variant="contained"
                            onClick={deactivate}>
                            Disconnect
                        </Button>
                    ) : (
                        <Button color='primary' variant="contained"
                            onClick={() => activateBrowserWallet()} >
                            Connect
                        </Button>
                    )

                    }
                </div>

            </div>
        </>

    )
}