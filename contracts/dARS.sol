//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract dARS is ERC20 {
    string private greeting;

    constructor(uint256 _initialBalance) ERC20("Decentraliced ARS", "dARS") {
        _mint(msg.sender, _initialBalance);
    }
}
