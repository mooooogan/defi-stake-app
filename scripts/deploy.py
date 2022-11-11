from scripts.helpful_scripts import *
from brownie import DAPPs, TokenFarm, network, config
from web3 import Web3
import yaml
import json
import os
import shutil

KEPT_BALANCE = Web3.toWei(10, "ether")


def dapp_token_and_token_farm(update_FE=False):
    account = get_account()
    dapp_token = DAPPs.deploy({"from": account})
    token_farm = TokenFarm.deploy(
        dapp_token.address,
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    # print(dapp_token.totalSupply() - KEPT_BALANCE)
    tx = dapp_token.transfer(
        token_farm.address, dapp_token.totalSupply() - KEPT_BALANCE, {"from": account}
    )
    tx.wait(1)
    # allow 3 token to be staked (DAPP, WETH, FAU/DAI)
    weth_token = get_contract("weth_token")
    fau_token = get_contract("fau_token")
    dict_allowed_token = {
        dapp_token: get_contract("dai_usd_price_feed"),
        fau_token: get_contract("dai_usd_price_feed"),
        weth_token: get_contract("eth_usd_price_feed"),
    }
    if update_FE:
        update_front_end()
    add_allowed_token(token_farm, dict_allowed_token, account)
    return (token_farm, dapp_token)


def update_front_end():
    # copy build folder
    copy_folder_to_FE("./build", "./frontend/src/chain-info")
    # covert yaml to json
    with open("brownie-config.yaml", "r") as brownie_config:
        config_dict = yaml.load(brownie_config, Loader=yaml.FullLoader)
        with open("./frontend/src/brownie_config.json", "w") as brownieConfigjson:
            json.dump(config_dict, brownieConfigjson)
            print("Front End Updated")


def copy_folder_to_FE(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)


def add_allowed_token(tokenFarm, allowed_token, account):
    for token in allowed_token:
        add_tx = tokenFarm.addAllowedtoken(token.address, {"from": account})
        add_tx.wait(1)
        set_tx = tokenFarm.setPriceFeedcontract(
            token.address, allowed_token[token].address, {"from": account}
        )
        set_tx.wait(1)


def main():
    dapp_token_and_token_farm(update_FE=True)
