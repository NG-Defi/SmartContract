// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

// Modified from Synthetixio
// https://raw.githubusercontent.com/Synthetixio/synthetix/develop/contracts/StakingRewards.sol

import "../Math/Math.sol";
import "../Math/SafeMath.sol";
import "../ERC20/ERC20.sol";
import '../Uniswap/TransferHelper.sol';
import "../ERC20/SafeERC20.sol";
import "../Ceres/Ceres.sol";
import "../Utils/ReentrancyGuard.sol";
import "../Utils/StringHelpers.sol";

// Inheritance
import "./IStakingRewards.sol";
import "./RewardsDistributionRecipient.sol";
import "./Pausable.sol";

contract StakingRewards is IStakingRewards, RewardsDistributionRecipient, ReentrancyGuard, Pausable {
    using SafeMath for uint256;
    // using SafeERC20 for ERC20;

    /* ========== STATE VARIABLES ========== */
    // TEST CASE DONE 
    CEREStable public CERES;
    // TEST CASE DONE 
    ERC20 public rewardsToken;
    // TEST CASE DONE 
    ERC20 public stakingToken;
    // TEST CASE DONE 
    uint256 public periodFinish;

    // Constant for various precisions
    // NOTHING TO DO FOR PRIVATE
    uint256 private constant PRICE_PRECISION = 1e6;
    uint256 private constant MULTIPLIER_BASE = 1e6;

    // Max reward per second
    //TEST CASE DONE
    uint256 public rewardRate; 

    // uint256 public rewardsDuration = 86400 hours;
    // TEST CASE DONE
    uint256 public rewardsDuration = 604800; // 7 * 86400  (7 days)

    // TEST CASE DONE
    uint256 public lastUpdateTime;
    // TEST CASE DONE
    uint256 public rewardPerTokenStored = 0; 
    // TEST CASE DONE
    uint256 public pool_weight; // This staking pool's percentage of the total CSS being distributed by all pools, 6 decimals of precision

    // TEST CASE DONE
    address public owner_address;
    // TEST CASE DONE
    address public timelock_address; // Governance timelock address

    // TEST CASE DONE
    uint256 public locked_stake_max_multiplier = 3000000; // 6 decimals of precision. 1x = 1000000
    // TEST CASE DONE
    uint256 public locked_stake_time_for_max_multiplier = 3 * 365 * 86400; // 3 years
    // TEST CASE DONE
    uint256 public locked_stake_min_time = 604800; // 7 * 86400  (7 days)
    // TEST CASE DONE
    string private locked_stake_min_time_str = "604800"; // 7 days on genesis
    // TEST CASE DONE
    uint256 public cr_boost_max_multiplier = 3000000; // 6 decimals of precision. 1x = 1000000

    // TEST CASE DONE
    mapping(address => uint256) public userRewardPerTokenPaid; // TEST CASE DONE
    mapping(address => uint256) public rewards; // TEST CASE DONE

    // NOTHING TO DO FOR PRIVATE
    uint256 private _staking_token_supply = 0;
    uint256 private _staking_token_boosted_supply = 0;
    mapping(address => uint256) private _unlocked_balances;
    mapping(address => uint256) private _locked_balances;
    mapping(address => uint256) private _boosted_balances;

    mapping(address => LockedStake[]) private lockedStakes;
    // TEST CASE DONE
    mapping(address => bool) public greylist; 

    // TEST CASE DONE
    bool public unlockedStakes; // Release lock stakes in case of system migration

    struct LockedStake {
        bytes32 kek_id;
        uint256 start_timestamp;
        uint256 amount;
        uint256 ending_timestamp;
        uint256 multiplier; // 6 decimals of precision. 1x = 1000000
    }

    /* ========== CONSTRUCTOR ========== */

    constructor(
        address _owner,
        address _rewardsDistribution,
        address _rewardsToken,
        address _stakingToken,
        address _ceres_address,
        address _timelock_address,
        uint256 _pool_weight
    ) public Owned(_owner){
        owner_address = _owner;
        rewardsToken = ERC20(_rewardsToken);
        stakingToken = ERC20(_stakingToken);
        CERES = CEREStable(_ceres_address);
        rewardsDistribution = _rewardsDistribution;
        lastUpdateTime = block.timestamp;
        timelock_address = _timelock_address;
        pool_weight = _pool_weight;
        // rewardRate = 380517503805175038; // (uint256(12000000e18)).div(365 * 86400); // Base emission rate of 12M FXS over the first year
        rewardRate = 3805175038051750; // (uint256(12000000e18)).div(365 * 86400); // Base emission rate of 12M FXS over the first year
        rewardRate = rewardRate.mul(pool_weight).div(1e6);
        unlockedStakes = false;
    }

    /* ========== VIEWS ========== */

    // TEST CASE DONE
    function totalSupply() external override view returns (uint256) {
        return _staking_token_supply;
    }

    // TEST CASE DONE
    function totalBoostedSupply() external view returns (uint256) {
        return _staking_token_boosted_supply;
    }

    // TODO: [later]
    function stakingMultiplier(uint256 secs) public view returns (uint256) {
        uint256 multiplier = uint(MULTIPLIER_BASE).add(secs.mul(locked_stake_max_multiplier.sub(MULTIPLIER_BASE)).div(locked_stake_time_for_max_multiplier));
        if (multiplier > locked_stake_max_multiplier) multiplier = locked_stake_max_multiplier;
        return multiplier;
    }
    // TODO: [LATER]
    function crBoostMultiplier() public view returns (uint256) {
        uint256 multiplier = uint(MULTIPLIER_BASE).add((uint(MULTIPLIER_BASE).sub(CERES.global_collateral_ratio())).mul(cr_boost_max_multiplier.sub(MULTIPLIER_BASE)).div(MULTIPLIER_BASE) );
        return multiplier;
    }

    // TEST CASE DONE
    // Total unlocked and locked liquidity tokens
    function balanceOf(address account) external override view returns (uint256) {
        return (_unlocked_balances[account]).add(_locked_balances[account]);
    }

    // TEST CASE DONE
    // Total unlocked liquidity tokens
    function unlockedBalanceOf(address account) external view returns (uint256) {
        return _unlocked_balances[account];
    }

    // TEST CASE DONE
    // Total locked liquidity tokens
    function lockedBalanceOf(address account) public view returns (uint256) {
        return _locked_balances[account];
    }

    // Total 'balance' used for calculating the percent of the pool the account owns
    // Takes into account the locked stake time multiplier
    function boostedBalanceOf(address account) external view returns (uint256) {
        return _boosted_balances[account];
    }

    
    // TODO: [LATER] Write some test scripts for this function
    function lockedStakesOf(address account) external view returns (LockedStake[] memory) {
        return lockedStakes[account];
    }
    // TEST CASE DONE
    function stakingDecimals() external view returns (uint256) {
        return stakingToken.decimals();
    }
    // TEST CASE DONE
    function rewardsFor(address account) external view returns (uint256) {
        // You may have use earned() instead, because of the order in which the contract executes 
        return rewards[account];
    }
    // TEST CASE DONE
    function lastTimeRewardApplicable() public override view returns (uint256) {
        return Math.min(block.timestamp, periodFinish);
    }
    // TEST CASE DONE
    function rewardPerToken() public override view returns (uint256) {
        if (_staking_token_supply == 0) {
            return rewardPerTokenStored;
        }
        else {
            return rewardPerTokenStored.add(
                lastTimeRewardApplicable().sub(lastUpdateTime).mul(rewardRate).mul(crBoostMultiplier()).mul(1e18).div(PRICE_PRECISION).div(_staking_token_boosted_supply)
            );
        }
    }
    // TEST CASE DONE
    function earned(address account) public override view returns (uint256) {
        return _boosted_balances[account].mul(rewardPerToken().sub(userRewardPerTokenPaid[account])).div(1e18).add(rewards[account]);
    }

    // function earned(address account) public override view returns (uint256) {
    //     return _balances[account].mul(rewardPerToken().sub(userRewardPerTokenPaid[account])).add(rewards[account]);
    // }
    // TEST CASE DONE
    function getRewardForDuration() external override view returns (uint256) {
        return rewardRate.mul(rewardsDuration).mul(crBoostMultiplier()).div(PRICE_PRECISION);
    }

    /* ========== MUTATIVE FUNCTIONS ========== */
    // TEST CASE DONE
    function stake(uint256 amount) external override nonReentrant notPaused updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        require(greylist[msg.sender] == false, "address has been greylisted");

        // Pull the tokens from the staker
        // TransferHelper.safeTransferFrom(address(stakingToken), msg.sender, address(this), amount);
        stakingToken.transferFrom(msg.sender, address(this), amount);

        // Staking token supply and boosted supply
        _staking_token_supply = _staking_token_supply.add(amount);
        _staking_token_boosted_supply = _staking_token_boosted_supply.add(amount);

        // Staking token balance and boosted balance
        _unlocked_balances[msg.sender] = _unlocked_balances[msg.sender].add(amount);
        _boosted_balances[msg.sender] = _boosted_balances[msg.sender].add(amount);

        emit Staked(msg.sender, amount);
    }

    
    // TEST CASE DONE
    function stakeLocked(uint256 amount, uint256 secs) external nonReentrant notPaused updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        require(secs > 0, "Cannot wait for a negative number");
        require(greylist[msg.sender] == false, "address has been greylisted");
        require(secs >= locked_stake_min_time, StringHelpers.strConcat("Minimum stake time not met (", locked_stake_min_time_str, ")") );
        require(secs <= locked_stake_time_for_max_multiplier, "You are trying to stake for too long");


        uint256 multiplier = stakingMultiplier(secs);
        uint256 boostedAmount = amount.mul(multiplier).div(PRICE_PRECISION);
        lockedStakes[msg.sender].push(LockedStake(
            keccak256(abi.encodePacked(msg.sender, block.timestamp, amount)),
            block.timestamp,
            amount,
            block.timestamp.add(secs),
            multiplier
        ));

        // Pull the tokens from the staker
        // TransferHelper.safeTransferFrom(address(stakingToken), msg.sender, address(this), amount);
        stakingToken.transferFrom(msg.sender, address(this), amount);

        // Staking token supply and boosted supply
        _staking_token_supply = _staking_token_supply.add(amount);
        _staking_token_boosted_supply = _staking_token_boosted_supply.add(boostedAmount);

        // Staking token balance and boosted balance
        _locked_balances[msg.sender] = _locked_balances[msg.sender].add(amount);
        _boosted_balances[msg.sender] = _boosted_balances[msg.sender].add(boostedAmount);

        emit StakeLocked(msg.sender, amount, secs);
    }
    // TODO: [LATER]
    function withdraw(uint256 amount) public override nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");

        // Staking token balance and boosted balance
        _unlocked_balances[msg.sender] = _unlocked_balances[msg.sender].sub(amount);
        _boosted_balances[msg.sender] = _boosted_balances[msg.sender].sub(amount);

        // Staking token supply and boosted supply
        _staking_token_supply = _staking_token_supply.sub(amount);
        _staking_token_boosted_supply = _staking_token_boosted_supply.sub(amount);

        // Give the tokens to the withdrawer
        // stakingToken.safeTransfer(msg.sender, amount);
        stakingToken.transfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }
    // TODO: [LATER]
    function withdrawLocked(bytes32 kek_id) public nonReentrant updateReward(msg.sender) {
        LockedStake memory thisStake;
        thisStake.amount = 0;
        uint theIndex;
        for (uint i = 0; i < lockedStakes[msg.sender].length; i++){ 
            if (kek_id == lockedStakes[msg.sender][i].kek_id){
                thisStake = lockedStakes[msg.sender][i];
                theIndex = i;
                break;
            }
        }
        require(thisStake.kek_id == kek_id, "Stake not found");
        require(block.timestamp >= thisStake.ending_timestamp || unlockedStakes == true, "Stake is still locked!");

        uint256 theAmount = thisStake.amount;
        uint256 boostedAmount = theAmount.mul(thisStake.multiplier).div(PRICE_PRECISION);
        if (theAmount > 0){
            // Staking token balance and boosted balance
            _locked_balances[msg.sender] = _locked_balances[msg.sender].sub(theAmount);
            _boosted_balances[msg.sender] = _boosted_balances[msg.sender].sub(boostedAmount);

            // Staking token supply and boosted supply
            _staking_token_supply = _staking_token_supply.sub(theAmount);
            _staking_token_boosted_supply = _staking_token_boosted_supply.sub(boostedAmount);

            // Remove the stake from the array
            delete lockedStakes[msg.sender][theIndex];

            // Give the tokens to the withdrawer
            // stakingToken.safeTransfer(msg.sender, theAmount);
            stakingToken.transfer(msg.sender, theAmount);

            emit WithdrawnLocked(msg.sender, theAmount, kek_id);
        }

    }
    // TEST CASE DONE
    function getReward() public override nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardsToken.transfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }
/*
    function exit() external override {
        withdraw(_balances[msg.sender]);

        // Add locked stakes too?

        getReward();
    }
*/
    // TODO: [LATER]
    function renewIfApplicable() external {
        if (block.timestamp > periodFinish) {
            retroCatchUp();
        }
    }

    function rewardsToken_balance() external view returns (uint256) {
        return rewardsToken.balanceOf(address(this));
    }

    // If the period expired, renew it
    function retroCatchUp() internal {
        // Failsafe check
        require(block.timestamp > periodFinish, "Period has not expired yet!");

        // Ensure the provided reward amount is not more than the balance in the contract.
        // This keeps the reward rate in the right range, preventing overflows due to
        // very high values of rewardRate in the earned and rewardsPerToken functions;
        // Reward + leftover must be less than 2^256 / 10^18 to avoid overflow.
        uint256 num_periods_elapsed = uint256(block.timestamp.sub(periodFinish)) / rewardsDuration; // Floor division to the nearest period
        uint balance = rewardsToken.balanceOf(address(this));
        require(rewardRate.mul(rewardsDuration).mul(crBoostMultiplier()).mul(num_periods_elapsed + 1).div(PRICE_PRECISION) <= balance, "Not enough CSS available for rewards!");

        // uint256 old_lastUpdateTime = lastUpdateTime;
        // uint256 new_lastUpdateTime = block.timestamp;

        // lastUpdateTime = periodFinish;
        periodFinish = periodFinish.add((num_periods_elapsed.add(1)).mul(rewardsDuration));

        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();

        emit RewardsPeriodRenewed(address(stakingToken));
    }

    /* ========== RESTRICTED FUNCTIONS ========== */
/*
    // This notifies people that the reward is being changed
    function notifyRewardAmount(uint256 reward) external override onlyRewardsDistribution updateReward(address(0)) {
        // Needed to make compiler happy

        
        // if (block.timestamp >= periodFinish) {
        //     rewardRate = reward.mul(crBoostMultiplier()).div(rewardsDuration).div(PRICE_PRECISION);
        // } else {
        //     uint256 remaining = periodFinish.sub(block.timestamp);
        //     uint256 leftover = remaining.mul(rewardRate);
        //     rewardRate = reward.mul(crBoostMultiplier()).add(leftover).div(rewardsDuration).div(PRICE_PRECISION);
        // }

        // // Ensure the provided reward amount is not more than the balance in the contract.
        // // This keeps the reward rate in the right range, preventing overflows due to
        // // very high values of rewardRate in the earned and rewardsPerToken functions;
        // // Reward + leftover must be less than 2^256 / 10^18 to avoid overflow.
        // uint balance = rewardsToken.balanceOf(address(this));
        // require(rewardRate <= balance.div(rewardsDuration), "Provided reward too high");

        // lastUpdateTime = block.timestamp;
        // periodFinish = block.timestamp.add(rewardsDuration);
        // emit RewardAdded(reward);
    }
*/
    // Added to support recovering LP Rewards from other systems to be distributed to holders
    function recoverERC20(address tokenAddress, uint256 tokenAmount) external onlyByOwnerOrGovernance {
        // Admin cannot withdraw the staking token from the contract
        require(tokenAddress != address(stakingToken));
        ERC20(tokenAddress).transfer(owner_address, tokenAmount);
        emit Recovered(tokenAddress, tokenAmount);
    }

    function setRewardsDuration(uint256 _rewardsDuration) external onlyByOwnerOrGovernance {
        require(
            periodFinish == 0 || block.timestamp > periodFinish,
            "Previous rewards period must be complete before changing the duration for the new period"
        );
        rewardsDuration = _rewardsDuration;
        emit RewardsDurationUpdated(rewardsDuration);
    }

    function setMultipliers(uint256 _locked_stake_max_multiplier, uint256 _cr_boost_max_multiplier) external onlyByOwnerOrGovernance {
        require(_locked_stake_max_multiplier >= 1, "Multiplier must be greater than or equal to 1");
        require(_cr_boost_max_multiplier >= 1, "Max CR Boost must be greater than or equal to 1");

        locked_stake_max_multiplier = _locked_stake_max_multiplier;
        cr_boost_max_multiplier = _cr_boost_max_multiplier;
        
        emit MaxCRBoostMultiplier(cr_boost_max_multiplier);
        emit LockedStakeMaxMultiplierUpdated(locked_stake_max_multiplier);
    }

    function setLockedStakeTimeForMinAndMaxMultiplier(uint256 _locked_stake_time_for_max_multiplier, uint256 _locked_stake_min_time) external onlyByOwnerOrGovernance {
        require(_locked_stake_time_for_max_multiplier >= 1, "Multiplier Max Time must be greater than or equal to 1");
        require(_locked_stake_min_time >= 1, "Multiplier Min Time must be greater than or equal to 1");
        
        locked_stake_time_for_max_multiplier = _locked_stake_time_for_max_multiplier;

        locked_stake_min_time = _locked_stake_min_time;
        locked_stake_min_time_str = StringHelpers.uint2str(_locked_stake_min_time);

        emit LockedStakeTimeForMaxMultiplier(locked_stake_time_for_max_multiplier);
        emit LockedStakeMinTime(_locked_stake_min_time);
    }
    // TEST CASE DONE
    function initializeDefault() external onlyByOwnerOrGovernance {
        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp.add(rewardsDuration);
        emit DefaultInitialization();
    }
    // TEST CASE DONE
    function greylistAddress(address _address) external onlyByOwnerOrGovernance {
        greylist[_address] = !(greylist[_address]);
    }
    // TEST CASE DONE
    function unlockStakes() external onlyByOwnerOrGovernance {
        unlockedStakes = !unlockedStakes;
    }
    // TEST CASE DONE
    function setRewardRate(uint256 _new_rate) external onlyByOwnerOrGovernance {
        rewardRate = _new_rate;
    }
    // TEST CASE DONE
    function setOwnerAndTimelock(address _new_owner, address _new_timelock) external onlyByOwnerOrGovernance {
        owner_address = _new_owner;
        timelock_address = _new_timelock;
    }

    /* ========== MODIFIERS ========== */

    modifier updateReward(address account) {
        // Need to retro-adjust some things if the period hasn't been renewed, then start a new one
        if (block.timestamp > periodFinish) {
            retroCatchUp();
        }
        else {
            rewardPerTokenStored = rewardPerToken();
            lastUpdateTime = lastTimeRewardApplicable();
        }
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    modifier onlyByOwnerOrGovernance() {
        require(msg.sender == owner_address || msg.sender == timelock_address, "You are not the owner or the governance timelock");
        _;
    }

    /* ========== EVENTS ========== */

    event RewardAdded(uint256 reward);
    event Staked(address indexed user, uint256 amount);
    event StakeLocked(address indexed user, uint256 amount, uint256 secs);
    event Withdrawn(address indexed user, uint256 amount);
    event WithdrawnLocked(address indexed user, uint256 amount, bytes32 kek_id);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardsDurationUpdated(uint256 newDuration);
    event Recovered(address token, uint256 amount);
    event RewardsPeriodRenewed(address token);
    event DefaultInitialization();
    event LockedStakeMaxMultiplierUpdated(uint256 multiplier);
    event LockedStakeTimeForMaxMultiplier(uint256 secs);
    event LockedStakeMinTime(uint256 secs);
    event MaxCRBoostMultiplier(uint256 multiplier);
}
