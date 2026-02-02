// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Staking
 * @dev Simple staking contract with 10% APY reward rate.
 */
contract Staking is ReentrancyGuard {
    IERC20 public stakingToken;
    
    uint256 public constant REWARD_RATE_PERCENT = 10;
    uint256 public constant SECONDS_IN_YEAR = 31536000;
    
    uint256 public totalStaked;
    
    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public lastUpdateTime;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward);

    constructor(address _stakingToken) {
        stakingToken = IERC20(_stakingToken);
    }

    /**
     * @dev Updates the reward for the user before any state change.
     */
    modifier updateReward(address account) {
        if (account != address(0)) {
            rewards[account] = earned(account);
            lastUpdateTime[account] = block.timestamp;
        }
        _;
    }

    /**
     * @dev Calculates current earned rewards for a user.
     */
    function earned(address account) public view returns (uint256) {
        if (stakedBalance[account] == 0) {
            return rewards[account];
        }
        
        uint256 timePassed = block.timestamp - lastUpdateTime[account];
        uint256 newRewards = (stakedBalance[account] * REWARD_RATE_PERCENT * timePassed) / (100 * SECONDS_IN_YEAR);
        return rewards[account] + newRewards;
    }

    /**
     * @dev Stake tokens in the contract.
     */
    function stake(uint256 amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        
        totalStaked += amount;
        stakedBalance[msg.sender] += amount;
        
        require(stakingToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        emit Staked(msg.sender, amount);
    }

    /**
     * @dev Unstake tokens and get rewards.
     */
    function withdraw(uint256 amount) public nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        require(stakedBalance[msg.sender] >= amount, "Insufficient staked balance");
        
        totalStaked -= amount;
        stakedBalance[msg.sender] -= amount;
        
        require(stakingToken.transfer(msg.sender, amount), "Transfer failed");
        
        emit Unstaked(msg.sender, amount);
    }

    /**
     * @dev Claim earned rewards only.
     */
    function claimReward() public nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            // Rewards are paid from the pool (ensure contract has enough tokens)
            require(stakingToken.transfer(msg.sender, reward), "Reward transfer failed");
            emit RewardClaimed(msg.sender, reward);
        }
    }

    /**
     * @dev Helper to exit the pool entirely.
     */
    function exit() external {
        withdraw(stakedBalance[msg.sender]);
        claimReward();
    }
}
