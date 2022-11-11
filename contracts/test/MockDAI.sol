//SPDX-License-Identifier: MIT

pragma solidity 0.8.0;
//give out reward token

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockDAI is ERC20 {
    constructor() ERC20("MockDai", "DAI") {}
}