// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RahmanToken
 * @dev Standard ERC20 token with a faucet for testing staking logic.
 */
contract RahmanToken is ERC20, Ownable {
    uint256 public constant FAUCET_AMOUNT = 1000 * 10**18;
    mapping(address => uint256) public lastFaucetTime;

    constructor() ERC20("Rahman Token", "RHM") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10**18); // Mint 1 million tokens to deployer
    }

    /**
     * @dev Simple faucet to get free tokens for testing.
     * Restricts users to one request per 24 hours.
     */
    function faucet() public {
        require(block.timestamp >= lastFaucetTime[msg.sender] + 1 days, "Faucet: Wait 24 hours");
        
        lastFaucetTime[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);
    }

    /**
     * @dev Owner can mint more tokens if needed for reward pool.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
