//getting wallet balances
import { Box, Tab, makeStyles } from "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import { token } from "../main"
import React, { useState } from "react"
import { StakeBalance } from "./stakebalance"
import { UnstakeToken } from "./unStakeButton"

interface stakeInfoProps {
    supportedTokens: Array<token>
}

const useStyles = makeStyles((theme) => ({
    tabContent: {
        display: 'flex',
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(4)

    },
    box: {
        backgroundColor: "white",
        borderRadius: "25px"
    },
    header: {
        color: "white"
    }
}))

export const StakeInfo = ({ supportedTokens }: stakeInfoProps) => {
    //state-hook, saving state between renders of components
    const classes = useStyles()
    const [selectedTokenIndex, setselectedTokenIndex] = useState<number>(0)

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setselectedTokenIndex(parseInt(newValue))
    }
    return (
        <Box>
            <h1 className={classes.header}>Your Staked Tokens</h1>
            <Box className={classes.box}>
                <TabContext value={selectedTokenIndex.toString()}>
                    <TabList onChange={handleChange} aria-label="stake form tabs">
                        {supportedTokens.map((token, index) => {
                            return (
                                <Tab label={token.name}
                                    value={index.toString()}
                                    key={index}>

                                </Tab>
                            )
                        })
                        }
                    </TabList>
                    {supportedTokens.map((token, index) => {
                        return (
                            <TabPanel value={index.toString()}
                                key={index}>
                                <div className={classes.tabContent}>
                                    <StakeBalance Token={supportedTokens[selectedTokenIndex]} />
                                    <UnstakeToken Token={supportedTokens[selectedTokenIndex]} />
                                </div>
                            </TabPanel>
                        )
                    })
                    }
                </TabContext>
            </Box>
        </Box>
    )
}
