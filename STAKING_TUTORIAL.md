# Staking Reward Math Deep Dive 🧠

To build a professional staking dApp, you need to understand how rewards are calculated per second. 

## 1. The 10% APY Goal
**APY** (Annual Percentage Yield) means that if you stake **100 RHM** for **one year**, you should earn **10 RHM** in rewards.

### The Problem:
Blockchains don't have "years." They only have **Timestamps** (seconds since 1970).

## 2. The Formula
We calculate rewards based on how many seconds have passed since the last time the user checked in.

$$Rewards = \frac{StakedAmount \times APY\% \times TimePassed(seconds)}{SecondsPerYear}$$

### Components:
- **TimePassed**: `block.timestamp - lastUpdateTime`
- **SecondsPerYear**: `31,536,000` (365 days * 24h * 60m * 60s)
- **APY**: `10`

### Example:
If you stake **1,000 RHM** for **1 hour** (3,600 seconds):
1. $Rewards = (1,000 \times 10 \times 3,600) / (100 \times 31,536,000)$
2. $Rewards = 36,000,000 / 3,153,600,000$
3. $Rewards = 0.0114 \text{ RHM}$

## 3. Handling Precision (Solidity)
Solidity doesn't support decimals (like 0.0114). If we divide too early, the result will be **0**.

**The fix:** We multiply everything by a huge number first before dividing.
```solidity
// In the contract:
uint256 rewards = (amount * 10 * timePassed) / (100 * 31536000);
```
Since `amount` is usually in `wei` (which has 18 zeros), we have plenty of precision!

## 4. Why `lastUpdateTime`?
Whenever a user **Stakes**, **Unstakes**, or **Claims**, we:
1. Calculate rewards earned *up to that exact second*.
2. Add those rewards to their `unclaimedRewards` balance.
3. Update `lastUpdateTime` to the current time.

This ensures you earn rewards even if you stake more tokens halfway through the year!
