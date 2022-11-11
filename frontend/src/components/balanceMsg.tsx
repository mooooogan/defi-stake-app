import { makeStyles } from "@material-ui/core"

const usestyles = makeStyles(theme => ({
    container: {
        display: "inline-grid",
        gridTemplateColumns: "auto auto auto",
        gap: theme.spacing(1),
        alignItems: "center"
    },
    tokenImg: {
        width: "32px"
    },

    amount: {
        fontWeight: 700
    }
}))

interface BalanceMsgProps {
    label: string,
    amount: number | string,
    token_img: string
}

export const BalanceMsg = ({ label, amount, token_img }: BalanceMsgProps) => {
    const classes = usestyles()
    return (
        <div className={classes.container}>
            <div>
                {label}
            </div>
            <div className={classes.amount}>
                {amount}
            </div>
            <img className={classes.tokenImg}
                src={token_img} alt="token logo">
            </img>
        </div>
    )
}