//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//stake tokens
//unstake tokens
//issue tokens
//add allowed tokens
//get eth value
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract TokenFarm is Ownable {
    address[] public allowedToken;
    mapping(address => mapping(address => uint256)) public stakingBalance;
    address[] public stakers;
    mapping(address => uint256) public uniquetokenstake;
    mapping(address => address) public tokenToPricefeed;

    IERC20 public dapp_token;

    constructor(address dapp_token_address) public {
        dapp_token = IERC20(dapp_token_address);
    }

    function setPriceFeedcontract(address token, address priceFeed)
        public
        onlyOwner
    {
        tokenToPricefeed[token] = priceFeed;
    }

    function StakeToken(uint256 amount, address token) public {
        //what token is allowed to stake
        //how much to stake
        require(amount > 0, "Amount must be more than 0");
        //require(tokenIsAllowed(token), "Token is currently no allowed");
        //transferFrom -- anyone can call vs transfer -- only works if the wallet that calls this token owns the token for ERC20
        //needs abi
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        //see how many unique token the staker has
        updateUniqueTokens(msg.sender, token);
        stakingBalance[token][msg.sender] =
            stakingBalance[token][msg.sender] +
            amount;
        if (uniquetokenstake[msg.sender] == 1) {
            stakers.push(msg.sender);
        }
    }

    function unstakeToken(address token) public {
        uint256 balance = stakingBalance[token][msg.sender];
        require(balance > 0, "Staking balance cannot be 0");
        IERC20(token).transfer(msg.sender, balance);
        stakingBalance[token][msg.sender] = 0;
        uniquetokenstake[msg.sender] = uniquetokenstake[msg.sender] - 1;
        if (uniquetokenstake[msg.sender] == 0) {
            remove(msg.sender);
        }
    }

    function remove(address user) public {
        for (uint256 i = 0; i < stakers.length; i++) {
            if (user == stakers[i]) {
                stakers[i] = stakers[stakers.length - 1];
                stakers.pop();
            }
        }
    }

    function updateUniqueTokens(address user, address token) internal {
        if (stakingBalance[token][user] <= 0) {
            //see how many unique token type the user has staked
            uniquetokenstake[user] = uniquetokenstake[user] + 1;
        }
    }

    function issueToken() public onlyOwner {
        //reward for users that use our platform
        //this is based off the value that they have staked eg for every 1 eth they get 1dapp as a reward
        for (
            uint256 stakerIndex = 0;
            stakerIndex < stakers.length;
            stakerIndex++
        ) {
            address recipient = stakers[stakerIndex];
            //send them DAPP amount based on their total value of assets staked
            uint256 userTotalValue = getTotalValue(recipient);
            //transfer the absolute usd in dapp;  userTotalValue is derived in USD (eg. USD2000 is rewarded, so 2000 dapp is rewarded)
            dapp_token.transfer(recipient, userTotalValue);
        }
    }

    function getTotalValue(address user) public view returns (uint256) {
        require(uniquetokenstake[user] > 0, "No staked tokens");
        uint256 total_value = 0;
        for (
            uint256 allowedTokenIndex = 0;
            allowedTokenIndex < allowedToken.length;
            allowedTokenIndex++
        ) {
            address token_address = allowedToken[allowedTokenIndex];
            total_value =
                total_value +
                getSingleTokenValue(token_address, user);
        }
        return total_value;
    }

    function getSingleTokenValue(address token, address user)
        public
        view
        returns (uint256)
    {
        //get the usd equivelant of their total asset
        if (uniquetokenstake[user] <= 0) {
            return 0;
        } else {
            //price of token, and mulitple the staking balnce of user
            (uint256 price, uint256 decimals) = getTokenValue(token);
            return ((stakingBalance[token][user] * price) / (10**decimals));
        }
    }

    function getTokenValue(address token)
        public
        view
        returns (uint256, uint256)
    {
        //priceFeed address mapping
        address pricefeedaddress = tokenToPricefeed[token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            pricefeedaddress
        );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        //decimals() returns a uint8
        uint256 decimals = uint256(priceFeed.decimals());
        return (uint256(price), decimals);
    }

    function addAllowedtoken(address token) public onlyOwner {
        allowedToken.push(token);
    }

    function tokenIsAllowed(address token) public returns (bool) {
        for (
            uint256 allowedTokenIndex = 0;
            allowedTokenIndex < allowedToken.length;
            allowedTokenIndex++
        ) {
            if (allowedToken[allowedTokenIndex] == token) {
                return true;
            }
            return false;
        }
    }
}
