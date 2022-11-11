from lib2to3.pgen2 import token
from logging import exception
from secrets import token_urlsafe
from tracemalloc import start
from scripts.helpful_scripts import *
from brownie import network, config, exceptions, MockERC20
from scripts.deploy import dapp_token_and_token_farm
from web3 import Web3
import pytest


def test_set_price_feed_contract():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    account = get_account()
    non_owner = get_account(index=1)
    token_farm, dapp_token = dapp_token_and_token_farm()
    # Act
    token_farm.setPriceFeedcontract(
        dapp_token.address, get_contract("eth_usd_price_feed"), {"from": account}
    )
    # Assert
    assert (
        token_farm.tokenToPricefeed(dapp_token.address)
        == get_contract("eth_usd_price_feed").address
    )
    with pytest.raises(exceptions.VirtualMachineError):
        token_farm.setPriceFeedcontract(
            dapp_token.address, get_contract("eth_usd_price_feed"), {"from": non_owner}
        )


def test_staking_token(amount_stake):
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    account = get_account()
    token_farm, dapp_token = dapp_token_and_token_farm()
    # Act
    dapp_token.approve(token_farm.address, amount_stake, {"from": account})
    token_farm.StakeToken(amount_stake, dapp_token.address, {"from": account})
    # Assert
    assert (
        token_farm.stakingBalance(dapp_token.address, account.address) == amount_stake
    )
    assert token_farm.uniquetokenstake(account.address) == 1
    assert token_farm.stakers(0) == account.address
    return token_farm, dapp_token


def test_issue_token(amount_stake):
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    account = get_account()
    token_farm, dapp_token = test_staking_token(amount_stake)
    starting_balance = dapp_token.balanceOf(account.address)
    token_farm.issueToken({"from": account})
    # assert
    assert dapp_token.balanceOf(account.address) == starting_balance + INITIAL_VALUE


def test_get_user_total_value_with_different_tokens(amount_stake, random_erc20):
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    account = get_account()
    token_farm, dapp_token = test_staking_token(amount_stake)
    token_farm.addAllowedtoken(random_erc20.address, {"from": account})
    token_farm.setPriceFeedcontract(
        random_erc20.address, get_contract("eth_usd_price_feed"), {"from": account}
    )
    random_erc20.approve(token_farm.address, amount_stake, {"from": account})
    if token_farm.tokenIsAllowed(random_erc20.address, {"from": account}):
        token_farm.StakeToken(amount_stake, random_erc20.address, {"from": account})
    assert token_farm.getTotalValue(account.address) == INITIAL_VALUE * 2


def test_getTokenValue():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    account = get_account()
    token_farm, dapp_token = dapp_token_and_token_farm()
    assert token_farm.getTokenValue(dapp_token, {"from": account}) == (
        INITIAL_VALUE,
        DECIMALS,
    )


def test_unstakeToken(amount_stake):
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    account = get_account()
    token_farm, dapp_token = test_staking_token(amount_stake)
    starting = token_farm.uniquetokenstake(account)
    token_farm.unstakeToken(dapp_token.address, {"from": account})
    assert token_farm.stakingBalance(dapp_token.address, account.address) == 0
    assert token_farm.uniquetokenstake(dapp_token.address) == starting - 1
