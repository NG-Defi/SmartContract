## [0.1.210709-a](https://github.com/Ceres-Coin/SmartContract/compare/0.1.210708-c...0.1.210709-a) (2021-07-08)
1. [ADDED][FILE]: test/test_Staking_CERES_WETH_P4.js
   1. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.stake() FUNC"
   2. [FIX][BUGS]
   3. [fix][bugs]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.stake() FUNC
   4. [MODIFY][SCRIPTS][REMOVED UNUSED CODE]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.stake() FUNC"
   5. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.stakeLocked() FUNC"
   6. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.getReward()"
2. [MODIFY][FILE][SOLIDITY]: contracts/Staking/StakingRewards.sol
   1. REMOVE UNUSED CODE
3. [MODIFIED][FILE][MIGRATIONS]: migrations/8_deploy_Uniswap_CERES_Oracle_Contract.js
4. [MODIFIED][FILE][MIGRATIONS]: migrations/9_deploy_Pool_USDC.js
5. [MODIFIED][FILE][MIGRATIONS]: migrations/12_timelock.js
6. FINISH DEPLOYMENT ON BSC-TESTNET

TODO: NEXT TO INVESTIGATE OTHER CONTRACTS


## [0.1.210708-c](https://github.com/Ceres-Coin/SmartContract/compare/0.1.210708-b...0.1.210708-c) (2021-07-08)
1. [ADDED][FILE]: test/test_Staking_CERES_WETH_P3.js
   1. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.lastTimeRewardApplicable(), check its default value"
   2. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.rewardPerToken(), check its default value"
   3. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.getRewardForDuration(), check its default value is gt 0"
   4. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.earned(account0 - account7), check its default value for account0 - account7"
   5. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.renewIfApplicable"
   6. [FIX][BUGS]
   7. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.initializeDefault()"
   8. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.greylistAddress(account3)"
   9. [MODIFIED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.greylistAddress(account3)"
   10. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.unlockStakes()"
   11. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.setRewardRate() OWNER FUNC"
   12. [MODIFIED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.setRewardRate() OWNER FUNC"
   13. [FIX][BUGS]
   14. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.setOwnerAndTimelock() OWNER FUNC"

NEXT : CREATED NEW test/test_Staking_CERES_WETH_P4.js

## [0.1.210708-b](https://github.com/Ceres-Coin/SmartContract/compare/0.1.210708-a...0.1.210708-b) (2021-07-08)
1. [ADD][FILE]: test/test_Staking_CERES_WETH_P2.js
   1. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.periodFinish, its default value is 0"
   2. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.stakingToken instance's NAME,SYMBOL,DECIMALS func"
   3. fix bugs
   4. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.stakingToken instance's token0,token1,reserve0,reserve1 func"
   5. FIX BUGS
   6. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.rewardsToken instance's NAME,SYMBOL,DECIMALS func"
   7. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.CERES, its value should ceresInstance"
   8. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.CERES instance's NAME,SYMBOL,DECIMALS func"
   9. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.CERES instance's owner_address & timelock_address"
   10. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.lastUpdateTime, its default value is 0"
   11. fix bugs
   12. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.totalSupply(), its default value is 0"
   13. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.totalBoostedSupply(), its default value is 0"
   14. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.balanceOf(account0 - account7), check its default value for account0 - account7"
   15. FIX BUGS
   16. fix bugs
   17. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.lockedBalanceOf(account0 - account7), check its default value for account0 - account7 is 0"
   18. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.boostedBalanceOf(account0 - account7), check its default value for account0 - account7"
   19. [MODIFY][SCRIPTS]: FIX BUGS
   20. [ADDED][SCRIPTS]: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.rewardsFor(account0 - account7), check its default value for account0 - account7 is 0"

2. [MOFIFIED][FILE]: contracts/CSS/CSS.sol
   1. REMOVE [TODO] TASKS

NEXT : CREATED NEW test/test_Staking_CERES_WETH_P3.js


## [0.1.210708-a](https://github.com/Ceres-Coin/SmartContract/compare/0.1.210706-b...0.1.210708-a) (2021-07-08)
1. ADDED: test/test_Staking_CERES_WETH_P1.js
   1. ADDED: "Test Scripts for stakingInstance_CERES_WETH.rewardRate"
   2. ADDED: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.rewardsDuration, its default value is 7 days"
   3. ADDED: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.rewardPerTokenStored, its default value is 0"
   4. ADDED: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.pool_weight, its default value is 500000"
   5. ADDED: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.owner_address, its default value is STAKING_OWNER"
   6. added: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.timelock_address, its default value is timelockInstance"
   7. added: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.locked_stake_max_multiplier, its default value is 3000000"
   8. added: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.locked_stake_time_for_max_multiplier, its default value is 3 years"
   9. added: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.locked_stake_min_time, its default value is 7 days"
   10. ADDED: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.locked_stake_min_time_str, its default value is `604800`"
   11. ADDED: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.cr_boost_max_multiplier, its default value is 3000000"
   12. "TEST SCRIPTS FOR stakingInstance_CERES_WETH.rewards(account0 - account7), check its default value for account0 - account7"
   13. added: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.userRewardPerTokenPaid(account0 - account7), check its default value for account0 - account7 should ALL be 0 "
   14. "TEST SCRIPTS FOR stakingInstance_CERES_WETH.greylist(account0 - account7), check its default value for account0 - account7 should ALL be FALSE "
   15. Added: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.unlockedStakes, its default value is FALSE"
   16. ADDED: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.lockedStakesOf(account0)"
   17. ADDED: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.stakingDecimals()"
   18. ADDED: "TEST SCRIPTS FOR stakingToken"
   19. added: "TEST SCRIPTS FOR stakingInstance_CERES_WETH.stakingToken PARAMETER"

CREATED NEW test/test_Staking_CERES_WETH_P2.js


## [0.1.210706-b](https://github.com/Ceres-Coin/SmartContract/compare/0.1.210706-a...0.1.210706-b) (2021-07-06)
1. ADDED: STAKING FOLDERS
   1. contracts/Staking/IStakingRewards.sol
   2. contracts/Staking/IStakingRewardsDual.sol
   3. contracts/Staking/IStakingRewardsDualForMigrator.sol
   4. contracts/Staking/Owned.sol
   5. contracts/Staking/Pausable.sol
   6. contracts/Staking/RewardsDistributionRecipient.sol
   7. contracts/Staking/StakingRewards.sol
   8. contracts/Staking/StakingRewardsDual.sol
   9. contracts/Staking/StakingRewardsDualV2.sol
   10. contracts/Staking/UniLPToSushiLPMigrator.sol
2. ADDED Contracts in Utils folder
   1. contracts/Utils/StringHelpers.sol
   2. contracts/Utils/ReentrancyGuard.sol
3. FIX COMPILE BUGS
   1. RUN SCRIPTS PASSED: "rm -rf build & truffle compile --all "
   2. "clean_build_migrate_all" TASK PASSED
4. MODIFIED: migrations/8_deploy_Uniswap_CERES_Oracle_Contract.js
   1. ADDED:
      1. StakingRewards_CERES_WETH
      2. StakingRewards_CERES_USDC
      3. StakingRewards_CERES_CSS
      4. StakingRewards_CSS_WETH
   2. TUNING CODE
   3. rename file name
   4. ADDED DEPLOYMENT SCRIPTS OF StakingRewards_CERES_WETH & other staking contracts in migrations/8_deploy_Uniswap_CERES_Oracle_Contract.js
   5. ADDED pair_address_ceres_weth/ceres_usdc/css_weth
   6. ADDED: TRANSFER CSS TO STAKING CONTRACT
   7. ADDED: test/test_Staking_CERES_WETH_P1.js
   8. MODIFY NPM RUN SCRIPTS
5. CREATED: test/test_Staking_CERES_WETH_P1.js
   1. Initialized "test/test_Staking_CERES_WETH_P1.js"
   2. ADDED: "Test Scripts for stakingInstance_CERES_WETH.address" 

NEXT TO DO: ADD MORE TEST SCRIPTS FOR test/test_Staking_CERES_WETH_P1.js & CERES_USDC & CSS_WETH  

## [0.1.210706-a](https://github.com/Ceres-Coin/SmartContract/compare/0.1.210705-a...0.1.210706-a) (2021-07-06)
1. ADDED: ./test/test_Governance_proposal.js
   1. remove unused code
   2. ADDED: "TEST SCRIPTS for governanceInstance.propose P1"
   3. removed FAILED TEST CASES
   4. ADDED: "Check up on the oracles and make sure the prices are set"
   5. added new CODE FOR SWAP NEW PRICE
   6. ADDED: Mints USDC 1-to-1
   7. REMOVE "mints 6dec 1-to-1"
   8. ADDED: "Deploys a vesting contract and then executes a governance proposal to revoke it"
   9. updates
   10. UPDATES TokenVesting.sol
   11. MODIFY DEPLOYMENT SCRIPTS migrations/13_token_vesting.js
   12. ADDED TEST SCRIPTS "TEST SCRIPTS FOR TokenVesting.getBeneficiary()"
   13. FINISH: "TEST SCRIPTS FOR TokenVesting.getBeneficiary()"
   14. ADDED: "TEST SCRIPTS FOR TokenVesting.getCliff()"
   15. added: "TEST SCRIPTS FOR TokenVesting.getStart()"
   16. ADDED: "TEST SCRIPTS FOR vestingInstance.getDuration()"
   17. ADDED: "TEST SCRIPTS FOR vestingInstance.getRevocable()"
   18. ADDED: "TEST SCRIPTS FOR vestingInstance.getReleased()"
   19. added: "TEST SCRIPTS FOR vestingInstance.getRevoked(), default value is false"
   20. ADDED: "TEST SCRIPTS FOR vestingInstance.release()"
   21. added: "Deploys a vesting contract and then executes a governance proposal to revoke it"
   22. MODIFY BEFICIARY = ACCOUNTS[5]
2. ADD NEW TEST SCRIPTS OF Governance Proposal
3. modify ./test/test_New_Test.js
4. RENAME TO ./test/test_Token_Vesting.js

next to do: ADD Stake_CERES_USDC.sol & ADD to deployment script & add test scripts


## [0.1.210705-a](https://github.com/Ceres-Coin/SmartContract/compare/0.1.210704-b...0.1.210705-a) (2021-07-05)
1. ADDED: test/test_6DEC_Tests.js
   1. added: "[mintFractionalCERES]: Mint some CERES using CSS and 6DEC (collateral ratio between .000001 and .999999)"
   2. fix bugs for "[mintFractionalCERES]: Mint some CERES using CSS and 6DEC (collateral ratio between .000001 and .999999)"
   3. ADDED: "[redeemFractionalCERES]: Redeem some CERES for CSS and USDC (collateral ratio between .000001 and .999999)"
   4. tuning to fix bugs
   5. update two_million constants
   6. FINISH TEST CASES [redeemFractionalCERES]: Redeem some CERES for CSS and USDC (collateral ratio between .000001 and .999999)
   7. ADDED: "[redeemFractionalCERES][ACCOUNT5]: Redeem some CERES for CSS and USDC FROM ACCOUNT5"
   8. fix bugs
   9. FINISH "[redeemFractionalCERES][ACCOUNT5]: Redeem some CERES for CSS and USDC FROM ACCOUNT5"
   10. ADDED: "[redeem1t1CERES][account5]: Redeem USDC 1-TO-1"
   11. ADDED: "[recollateralizeCERES][ACCOUNT5]: Recollateralizes the system using recollateralizeCERES()"
   12. ADDED: "[mintAlgorithmicCERES][ACCOUNT5]: Mint some CERES using CSS (collateral ratio = 0) FROM ACCOUNT5"
   13. ADDED: "[redeemAlgorithmicCERES][ACCOUNT5]: redeemAlgorithmicCERES (collateral ratio = 0) FROM ACCOUNT5"
2. ADDED: new code in test_helpers.js
   1. ADDED TEST SCRIPTS OF erc20.transFrom

FINISH WRITE CORE CODE -->
WRITE TEST SCRIPT for MINT1T1CERES/redeem1t1ceres -->
WRITE TEST SCRIPT for mintFractionalCERES/redeemFractionalCERES/ --> 
WRITE TEST SCRIPT for mintAlgorithmicCERES/redeemAlgorithmicCERES/ --> 

NEXT TO DO: TokenVesting.sol & test scripts -->

## [0.1.210704-b](https://github.com/Ceres-Coin/SmartContract/compare/0.1.210704-a...0.1.210704-b) (2021-07-04)
1. ADDED test/test_6DEC_Tests.js
   1. ADDED "Test Scripts for ceresInstance.address"
   2. ADDED 'Check up on the oracles and make sure the prices are set'
   3. ADDED "Mints 6DEC 1-to-1"
2. MODIFIED: migrations/10_price_and_addresses.js
   1. removed ceresInstance.refreshCollateralRatio() func

START WRITE CORE CODE -->
WRITE TEST SCRIPT for MINT1T1CERES/redeem1t1ceres -->
WRITE TEST SCRIPT for mintFractionalCERES/redeemFractionalCERES/ --> 
WRITE TEST SCRIPT for mintAlgorithmicCERES/redeemAlgorithmicCERES/ --> 


## [0.1.210704-a](https://github.com/Ceres-Coin/SmartContract/compare/0.1.210703-a...0.1.210704-a) (2021-07-04)
1. package.json
   1. change version number
   2. TUNING NPM RUN SCRIPTS
2. ADDED: test/test_CSS_Contract_P1.js
   1. ADDED: "Test Scripts for cssInstance.name/symbol/decimals"
   2. ADDED: "TEST SCRIPTS FOR cssInstance.CEREStablecoinAdd"
   3. ADDED: "TEST SCRIPTS FOR cssInstance.genesis_supply, default value is 100million_dec18"
   4. ADDED: TEST SCRIPTS FOR cssInstance.CSS_DAO_min()
   5. added: "TEST SCRIPTS FOR cssInstance.CSS_DAO_min(), default value is 0"
   6. ADDED: "TEST SCRIPTS FOR cssInstance.owner_address"
   7. added: "TEST SCRIPTS FOR cssInstance.oracle_address"
   8. ADDED: "TEST SCRIPTS FOR cssInstance.oracle_address, default value is OWNER"
   9. added: "TEST SCRIPTS FOR cssInstance.timelock_address, default value is timelocakInstance.address"
   10. ADDED: "TEST SCRIPTS FOR cssInstance.trackingVotes, default value is TRUE"
   11. added: "TEST SCRIPTS FOR cssInstance.checkpoints"
   12. added: "TEST SCRIPTS FOR cssInstance.numCheckpoints"
   13. ADDED: "TEST SCRIPTS FOR cssInstance.setOracle()"
3. ADDED test/test_CSS_Contract_P2.js
   1. ADDED: "TEST SCRIPTS FOR cssInstance.setOracle()"
   2. ADDED: "TEST SCRIPTS FOR cssInstance.setTimelock()"
   3. ADDED: "TEST SCRIPTS FOR cssInstance.setCSSMinDAO()"
   4. ADDED: "TEST SCRIPTS FOR cssInstance.setOwner()"
   5. added: "TEST SCRIPTS FOR cssInstance.toggleVotes()"
   6. ADDED: "TEST SCRIPTS FOR cssInstance.transfer()"
   7. ADDED: "TEST SCRIPTS FOR cssInstance.transferFrom()"
   8. added: "TEST SCRIPTS FOR cssInstance.getCurrentVotes()"
4. CSS/CSS.sol
   1. ADDED TODO TASK
   
Continue to investigate other contracts -->

## [0.1.210703-a](https://github.com/Ceres-Coin/SmartContract/compare/0.1.210702-b...0.1.210703-a) (2021-07-03)
1. ADDED: "test/test_CERES_Contract_P3.js"
   1. ADDED: "Test Scripts for ceresInstance.pool_mint()"
   2. added test scripts
   3. ADDED: "Test Scripts for ceresInstance.ceres_pools"
   4. ADDED: Test Scripts for ceresInstance.addPool() & removePool()
   5. MODIFIED: "Test Scripts for ceresInstance.pool_mint()"
   6. ADDED: "Test Scripts for ceresInstance.pool_burn_from()"
   7. ADDED: "Test Scripts for ceresInstance.setOwner()"
   8. ADDED: "TEST SCRIPTS FOR ceresInstance.setRedemptionFee()"
   9. ADDED: "TEST SCRIPTS FOR ceresInstance.setCeresStep()"
   10. ADDED: "TEST SCRIPTS FOR ceresInstance.setPriceTarget()"
   11. ADDED: "TEST SCRIPTS FOR ceresInstance.setPriceBand()"
   12. ADDED: "TEST SCRIPTS FOR ceresInstance.setRefreshCooldown()
   13. ADDED: "TEST SCRIPTS FOR ceresInstance.setCSSAddress()"
   14. ADDED "TEST SCRIPTS FOR ceresInstance.setCSSAddress()"
   15. ADDED: "TEST SCRIPTS FOR ceresInstance.setTimelock()"
   16. ADDED: "TEST SCRIPTS FOR ceresInstance.setTimelock()"
   17. REMOVE TODO TASKS
   18. ADDED: "TEST SCRIPTS FOR ceresInstance.setController()"
   19. ADDED: "TEST SCRIPTS FOR ceresInstance.toggleCollateralRatio()"
   20. fix bugs for toggleCollateralRatio()
2. MODIFIED test/test_CERES_Contract_P2.js
   1. MOVE ceres_info() test scripts from P2 to P3

Add new test scripts & new tasks for CSS.sol contract-->


## [0.1.210702-b](https://github.com/Ceres-Coin/SmartContract/compare/0.1.210702-a...0.1.210702-b) (2021-07-02)
1. test/test_CERES_Contract_P2.js
   1. ADDED TEST CASES FOR ceres_pools_array[0]
   2. ADDED TEST CASES FOR ceres_pools_array.length
   3. ADDED TEST CASES FOR ceres_pools.state
   4. ADDED: "Test Scripts for ceresInstance.global_collateral_ratio"
   5. ADDED: "Test Scripts for ceresInstance.redemption_fee & minting_fee"
   6. ADDED: "Test Scripts for ceresInstance.ceres_step, its default value is 2500"
   7. ADDED: "Test Scripts for ceresInstance.refresh_cooldown, its default value is 60"
   8. Test Scripts for ceresInstance.price_target, its default value is 1000000
   9. ADDED: "Test Scripts for ceresInstance.price_band, its default value is 5000"
   10. ADDED: "Test Scripts for ceresInstance.COLLATERAL_RATIO_PAUSER"
   11. ADDED: "Test Scripts for ceresInstance.ceres_price() func"
   12. REMOVE UNUSED CODE: console.log
   13. ADDED ASSERTION FOR ceresInstance.address
   14. ADDED: "Test Scripts for ceresInstance.css_price() func"
   15. added: "Test Scripts for ceresInstance.eth_usd_price() func"
   16. added: "Test Scripts for ceresInstance.globalCollateralValue() func"
   17. added: "Test Scripts for ceresInstance.ceresInfo() func"
2. contracts/ceres/ceres.sol
   1. REMOVE TODO

Continue to write test scripts in test/test_CERES_Contract_P3.js -->


## [0.1.210702-a](https://github.com/Ceres-Coin/SmartContract/compare/0.1.210701-b...0.1.210701-c) (2021-07-02)
1. ADDED TODO TASK
2. Oracle/ChainlinkETHUSDPriceConsumerTest.sol
   1. MODIFY ETH's price from 2690 to 2118
3. ADDED test/test_CERES_Contract_P2.js
   1. ADDED: "Test Scripts for ceresInstance.eth_usd_pricer CONTRACT INSTANCE"
   2. ADDED: "Test Scripts for ceresInstance.eth_usd_pricer_decimals"
   3. ADDED: "Test Scripts for ceresInstance.eth_usd_consumer_address"
   4. ADDED: test/test_CERES_Contract_P2.js
4. ADDED test/test_CERES_Contract_P1.js
   1. ADDED: "Test Scripts for ceresInstance.CSSEthOracle consult()"
   2. ADDED: "Test Scripts for ceresInstance.CSSEthOracle UPDATE()"
   3. ADDED: "Test Scripts for ceresInstance.CSSEthOracle instances"
   4. ADDED: "Test Scripts for ceresInstance.CeresEthOracle consult()"
   5. ADDED: "Test Scripts for ceresInstance.CeresEthOracle UPDATE()"
   6. ADDED: pair_address
   7. ADDED SOME SCENARIOS:
      1. price0CumulativeLast
      2. price1CumulativeLast
      3. price0Average
      4. price1Average
      5. reserve0
      6. reserve1
      7. blockTimestampLast
   8. ADDED: "Test Scripts for ceresInstance.CeresEthOracle instances"
      1. token0()
      2. token1()
      3. PERIOD()
   9. ADDED: instanceCeresEthOracle
   10. ADDED: "Test Scripts for ceresInstance.CeresEthOracle"
   11. Update test_CERES_Contract_P1.js
   12. ADDED: "Test Scripts for ceresInstance.css_address & weth_address"
   13. ADDED: "Test Scripts for ceresInstance.owner_address,creator_address,timelock_address,controller_address"
   14. ADDED: "Test Scripts for ceresInstance.genesis_supply, its default value is one_million_dec18"
   15. ADDED: "Test Scripts for ceresInstance.name/symbol/decimals"
   16. ADDED: "Test scripts for ceresInstance.PRICE_PRECISION, its default should be BIG6"
   17. ADDED: "Test Scripts for ceresInstance.DEFAULT_ADMIN_ADDRESS"
   18. ADDED: "Test Scripts for ceresInstance.collateral_ratio_paused(), its default value is false"
   19. ADDED: Test Scripts for ceresIntance.last_call_time()
   20. finish test scripts "ceresInstance.setRefreshCooldown() & refreshCollateralRatio() func"
   21. finish first test scripts "PRINT ceresInstance.address"
   22. ADDED new test scripts "test/test_CERES_Contract_P1.js"
5. contracts/Ceres/Ceres.sol
   1. ADDED: added todo task in Ceres Contract 
6. package.json
   1. remove unused DEPLOYMENT SCRIPTS TASK
7. ADD TODO TASKs

Continue to write test scripts in test/test_CERES_Contract_P2.js -->


## [0.1.210701-b](https://github.com/Ceres-Coin/SmartContract/compare/0.1.210701-a...0.1.210701-b) (2021-07-01)
FINISH DEPLOYMENT SCRIPTS IN "Migrations" folder
1. FINISH DEPLOYMENT SCRIPTS "migrations/13_token_vesting.js"
2. ADDED NEW DEPLOYMENT SCRIPTS
   1. "migrations/13_token_vesting.js"
3. ADD NEW TODO: TASKS

ADD More Test Scripts under "Test" folder -->


## [0.1.210701-a](https://github.com/Ceres-Coin/SmartContract/compare/0.1.210630-a...0.1.210701-a) (2021-06-30)
1. Test for submit proposal from Timelock Contracts
   1. FINISH timelock deployment scripts "migrations/12_timelock.js"
   2. ADDED deployment scripts of GovernanceAlpha.sol
   3. added Governance.sol & timelock proposal
2. ADD NEW DEPLOYMENT SCRIPTS "migrations/12_timelock.js"
3. ADDED UPDATE CODE FOR UniswapPairOracle
4. tuning FAILED TEST CASES
5. add swap code
   1. ceres-usdc and execute SWAP
   2. css-usdc and execute SWAP
   3. added APPROVE CODE for swapToPriceInstance
   4. added APPROVE CODE for routherInstance
6. added DEPLOYMENT SCRIPTS: "migrations/11_swap.js"
7. added DEPLOYMENT SCRIPTS OF
   1. refreshCollateralRatio()
   2. ceres_info
8. added test cases for transfer CERES & CSS to METAMASK_ADDRESS
9. added usdc_price_from_USDC_WETH
10. added test scripts of get Price from
    1. ceres_weth
    2.  ceres_usdc
    3.  css_weth
    4.  css_usdc
11. added code to avoid ADDED DUPLICATE POOLS
12. added pair_instance
   1. added pair_instance_CERES_USDC
   2. added pair_instance_CERES_WETH
   3. added pair_instance_USDC_WETH
13. CREATE NEW "migrations/10_price_and_addresses.js"
14. ADDED NEW DEPLOYMENT SCRIPTS
15. tuning test scripts for ADDED DEPLOYMENT SCRIPTS
16. add deployment script "TRANSFER COLLATERAL_SEED_DEC6 TO pool_instance_usdc"
17. add oracle_instance.update() func
18. add NEXT TO DO TASKS

Next Release: add other deployment scritps -->


## [0.1.210630-a](https://github.com/Ceres-Coin/SmartContract/compare/0.1.210628-b...0.1.210630-a) (2021-06-29)
1. create a new test scripts "test_CERES_USDC_Pool_P3.js"
   1. ADDED Print Parameters func
   2. added test scripts for ASSERTION of CERES_USDC_Pool's PARAMETERS
   3. added assertion for
      1. address public ceres_contract_address; //TEST CASE DONE
      2. address public css_contract_address; //TEST CASE DONE
      3. address public collateral_address; //TEST CASE DONE
      4. address public weth_address; //TEST CASE DONE
   4. ADDED TEST SCRIPTS OF owner_address parameter
   5. added test scripts of timelock_address parameter
   6. add new test scripts for PARAMETERS CONSTANTS
      1. PRICE_PRECISION
      2. COLLATERAL_RATIO_PRECISION
      3. COLLATERAL_RATIO_MAX
   7. added test scripts of CONSTANTS missing_decimals
   8. added test scripts of PARAMETERS
      1. missing_decimals
      2. pausedPrice
      3. redemption_delay
      4. bonus_rate
   9. added test scripts of ACCESS Control STATE
      1.  mintPaused
      2.  redeemPaused
      3.  recollateralizePaused
      4.  buyBackPaused
      5.  collateralPricePaused
   10. add test cases for CERES() & CSS() in CERES_USDC_POOL contract
   11. added test cases for Invoke CERES & CSS from CERES_USDC_POOL
   12. ADDED "Test Cases for CERES Invoke Func in CERES_USDC_POOL" test scripts
   13. ADD TEST SCRIPTS "Test Cases for CSS Invoke Func in CERES_USDC_POOL"
   14. verify the instance's invoke func is equal to pool's public func
   15. ADDED TEST SCRIPTS OF "Test Cases for collatEthOracle_eth_collat_price()"
   16. added test cases for tmpValue & tmpValue2 & collatDollarBalance()
   17. added test cases for availableExcessCollatDV
   18. added test cases for getCollateralPrice() func

Next Release: Continue to Investigate the Contract Code and Deployment Scripts -->


## [0.1.210629-b](https://github.com/Ceres-Coin/SmartContract/compare/0.1.210628-b...0.1.210629-b) (2021-06-29)
1. ADDED test scripts in test/test_CERES_USDC_Pool_P2.js
   1. availableExcessCollatDV
   2. toggleRecollateralize
   3. toggleRedeeming
   4. toggleCollateralPrice
   5. setCollatETHOracle
   6. getCollateralPrice
   7. ADD test scripts of pool_instance_USDC.ceres_eth_usd_price()
   8. ADD test scripts of pool_instance_USDC.collatEthOracle_eth_collat_price()
   9. add test scripts of pool_instance_USDC.collateral_token()
   10. add test scripts of pool_instance_USDC.ceres_eth_usd_price()
   11. missing_decimals
2. UPDATE TODO Tasks
3. Refactor CeresPool.sol
4. Remove unused code "BEFORE EACH TEST CASE"
5. Remove unused code "SET CONSTANTS"


## [0.1.210629-a](https://github.com/Ceres-Coin/SmartContract/compare/0.1.210628-b...0.1.210629-a) (2021-06-28)
1. Finish Tuning Deployment Scripts
   1. FINISH migrations/9_deploy_CERES_CSS_Pools.js
   2. FINISH migrations/8_deploy_Uniswap_CERES_Oracle_Contract.js
   3. FINISH migrations/7_deploy_Uniswap_Contract.js
   4. FINISH migrations/6_deploy_ceres_cereshares_contract.js
   5. FINISH migrations/5_link_contract_phrase_1.js
   6. FINISH migrations/4_deploy_contract_phase_3.js

Debug the USDC_POOL contracts & Test Scripts
   1. contracts/ceres/pools/Pool_USDC.sol
   2. contracts/ceres/pools/CeresPool.sol
   3. migrations/9_deploy_CERES_CSS_Pools.js
   4. test/test_CERES_USDC_Pool_P2.js


## [0.1.210628-c](https://github.com/Ceres-Coin/SmartContract/compare/0.1.210628-b...0.1.210628-c) (2021-06-28)
1. Finish Test Scripts test_Openzeppelin_Test_Helpers.js
   1. constants.ZERO_ADDRESS & constants.MAX_UINT256
   2. Test for time.increase(3) func
   3. Test for time.increase(1000000) func
   4. Test for time.advanceBlock() 3 times
   5. Test for time.advanceBlock() 100 times
   6. Test for time.advanceBlockTo(latestBlock+3)
   7. Test for time.advanceBlockTo(latestBlock+100)

2. remove unneccessary code from test/test_Openzeppelin_Test_Helpers.js
3. tuning 3_deploy_contract_phase_2.js deployment scripts
   1. FINISH migrations/1_initial_migration.js
   2. FINISH migrations/2_deploy_contract_phase_1.js
   3. FINISH migrations/3_deploy_contract_phase_2.js

<!-- Next Release: Continue to Tuning deployment scripts under MIGRATIONS folders -->



## 0.1.210628-b (2021-06-28)
1. add NPM run tasks
   1. migration_clean
   2. migrate_singleFile_1
   3. migrate_singleFile_2
   4. migrate_singleFile_3
   5. migrate_singleFile_4
   6. migrate_singleFile_5
   7. migrate_singleFile_6
   8. migrate_singleFile_7
   9. migrate_singleFile_8
   10. migrate_singleFile_9
   11. clean_build_migrate_all
2. finish 3 deployment scripts tuning
   1. 1_initial_migration
   2. 2_deploy_contract_phase_1
   3. 3_deploy_contract_phase_2
3. ADD Test Scritps for time & constants from @openzeppelin/test-helpers


## 0.1.210628-a (2021-06-28)
1. tuning deployment scripts
   1. to reduce deployment time
   2. Get more information for development
   3. fix deployment bugs
2. add test cases for UniswapPairOracle
   1. getCollateralPrice
   2. toggleBuyBack
   3. getCollateralPrice
3. add truffleTestSingleP1 npm scripts
4. Attach debug process


## 0.1.210627-b (2021-06-27)
add new test script file: test_CERES_USDC_Pool_P2.js


## 0.1.210627 (2021-06-27)
##### add test cases of CeresPool Contract
##### add TODO tasks of CeresPool Contract



# 0.1.0 (2021-06-26)
initialize code





