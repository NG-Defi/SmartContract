const BigNumber = require('bignumber.js');
const BN = BigNumber.clone({ DECIMAL_PLACES: 9 })
const util = require('util');
const chalk = require('chalk');
const Contract = require('web3-eth-contract');
const { assert, expect } = require('chai');
const { expectEvent, send, shouldFail, time, constants, balance} = require('@openzeppelin/test-helpers');

// Set provider for all later instances to use
Contract.setProvider('http://127.0.0.1:8545');

global.artifacts = artifacts;
global.web3 = web3;

const BIG6 = new BigNumber("1e6");
const BIG18 = new BigNumber("1e18");

const Address = artifacts.require("Utils/Address");
const BlockMiner = artifacts.require("Utils/BlockMiner");
const Math = artifacts.require("Math/Math");
const SafeMath = artifacts.require("Math/SafeMath");
const Babylonian = artifacts.require("Math/Babylonian");
const FixedPoint = artifacts.require("Math/FixedPoint");
const UQ112x112 = artifacts.require("Math/UQ112x112");
const Owned = artifacts.require("Staking/Owned");
const ERC20 = artifacts.require("ERC20/ERC20");
const ERC20Custom = artifacts.require("ERC20/ERC20Custom");
const SafeERC20 = artifacts.require("ERC20/SafeERC20");

// Uniswap related
const TransferHelper = artifacts.require("Uniswap/TransferHelper");
const SwapToPrice = artifacts.require("Uniswap/SwapToPrice");
const UniswapV2ERC20 = artifacts.require("Uniswap/UniswapV2ERC20");
const UniswapV2Factory = artifacts.require("Uniswap/UniswapV2Factory");
const UniswapV2Library = artifacts.require("Uniswap/UniswapV2Library");
const UniswapV2OracleLibrary = artifacts.require("Uniswap/UniswapV2OracleLibrary");
const UniswapV2Pair = artifacts.require("Uniswap/UniswapV2Pair");
const UniswapV2Router02_Modified = artifacts.require("Uniswap/UniswapV2Router02_Modified");

// Collateral
const WETH = artifacts.require("ERC20/WETH");
const FakeCollateral_USDC = artifacts.require("FakeCollateral/FakeCollateral_USDC");
const FakeCollateral_USDT = artifacts.require("FakeCollateral/FakeCollateral_USDT");
const FakeCollateral_6DEC = artifacts.require("FakeCollateral/FakeCollateral_6DEC");

// Core Contract CERES & CSS
const CEREStable = artifacts.require("Ceres/CEREStable");
const CEREShares = artifacts.require("CSS/CEREShares");

// Timelock
const Timelock = artifacts.require("Governance/Timelock");
const TimelockTest = artifacts.require("Governance/TimelockTest");

// Fake Oracle
const UniswapPairOracle_CERES_WETH = artifacts.require("Oracle/Fakes/UniswapPairOracle_CERES_WETH");
const UniswapPairOracle_CERES_USDC = artifacts.require("Oracle/Fakes/UniswapPairOracle_CERES_USDC");
const UniswapPairOracle_CSS_WETH = artifacts.require("Oracle/Fakes/UniswapPairOracle_CSS_WETH");
const UniswapPairOracle_CSS_USDC = artifacts.require("Oracle/Fakes/UniswapPairOracle_CSS_USDC");
const UniswapPairOracle_USDC_WETH = artifacts.require("Oracle/Variants/UniswapPairOracle_USDC_WETH");
const UniswapPairOracle = artifacts.require("Oracle/UniswapPairOracle");

// ChainlinkETHUSD Contract
const ChainlinkETHUSDPriceConsumerTest = artifacts.require("Oracle/ChainlinkETHUSDPriceConsumerTest");
const ChainlinkETHUSDPriceConsumer = artifacts.require("Oracle/ChainlinkETHUSDPriceConsumer");

const Pool_USDC = artifacts.require("Ceres/Pools/Pool_USDC");

// set constants
const ONE_HUNDRED_DEC18 = new BigNumber("100e18");
const ONE_HUNDRED_DEC6 = new BigNumber("100e6");
const FIVE_HUNDRED_DEC18 = new BigNumber("500e18");
const ONE_THOUSAND_DEC18 = new BigNumber("1000e18");
const ONE_MILLION_DEC18 = new BigNumber("1000000e18");
const ONE_MILLION_DEC6 = new BigNumber("1000000e6");
const FIVE_MILLION_DEC18 = new BigNumber("5000000e18");
const FIVE_MILLION_DEC6 = new BigNumber("5000000e6");
const TEN_MILLION_DEC18 = new BigNumber("10000000e18");
const ONE_HUNDRED_MILLION_DEC18 = new BigNumber("100000000e18");
const ONE_HUNDRED_MILLION_DEC6 = new BigNumber("100000000e6");
const ONE_BILLION_DEC18 = new BigNumber("1000000000e18");
const COLLATERAL_SEED_DEC18 = new BigNumber(508500e18);
const TWO_MILLION_DEC18 = (new BigNumber("2000000e18")).toNumber();
const TWO_MILLION_DEC6 = (new BigNumber("2000000e6")).toNumber();

// ADD TEST Scripts for @openzeppelin/test-helpers
contract('test_Openzeppelin_Test_Helpers', async (accounts) => {
	// deploy address;
	let ADMIN;
	let COLLATERAL_CERES_AND_CERESHARES_OWNER;
	let OWNER;
	let METAMASK_ADDRESS;

	// CERES Core  Contract instances
	let ceresInstance;
	let cssInstance;

	// UniswapV2Router
	let routerInstance;

	// timelock instance
	let timelockInstance;

	// uniswapFactoryInstance 
	let uniswapFactoryInstance;

	// uniswap library
	let uniswapLibraryInstance;
	let uniswapOracleLibraryInstance;
	let swapToPriceInstance;

	// ceres price pair
	let pair_addr_CERES_WETH;
	let pair_addr_CERES_USDC;

	// css price pair
	let pair_addr_CSS_WETH;
	let pair_addr_CSS_USDC;

	// uniswap oracle price
	let oracle_instance_CERES_WETH;
	let oracle_instance_CERES_USDC;
	let oracle_instance_CSS_WETH;
	let oracle_instance_CSS_USDC;
	let oracle_instance_USDC_WETH;

	let first_CERES_WETH;
	let first_CERES_USDC;
	let first_CSS_WETH;
	let first_CSS_USDC;
	// chainlink address
	let oracle_chainlink_ETH_USD;

	// USDC_Pool Parameter
	let pool_instance_USDC;
	// USDC_Pool Public Variants
	let collateral_token;
	let collateral_address;
	let owner_address;
	let ceres_contract_address;
	let css_contract_address;
	let timelock_address;

	let minting_fee;
	let redemption_fee;
	let buyback_fee;
	let recollat_fee;

	const MINTING_FEE = 300; // 0.03%
	const REDEMPTION_FEE = 400; // 0.04%
	const BUYBACK_FEE = 100; //0.01%
	const RECOLLAT_FEE = 100; //0.01%

	const MINTING_FEE_MODIFIED = 600; // 0.06%
	const REDEMPTION_FEE_MODIFIED = 800; // 0.08%
	const BUYBACK_FEE_MODIFIED = 200; //0.02%
	const RECOLLAT_FEE_MODIFIED = 200; //0.02%

	const CERES_STEP = 2500; 
	const CERES_STEP_MODIFIED = 5000; 
	const PRICE_TARGET = 1000000; 
	const PRICE_TARGET_MODIFIED = 1000000; 
	const PRICE_BAND = 5000; 
	const PRICE_BAND_MODIFIED = 10000; 
	const refresh_cooldown_default = 60; 
	const refresh_cooldown_modified = 120; 

	
	// USDC_Pool Constants
	const PRICE_PRECISION = new BigNumber(1e6);
	const COLLATERAL_RATIO_PRECISION = new BigNumber(1e6);
	const COLLATERAL_RATIO_MAX = new BigNumber(1e6);
	const MISSING_DECIMALS = 12;
	const TIMELOCK_DELAY = 300

	let price_precision;
	let collateral_ratio_precision;
	let collateral_ratio_max;
	let missing_decimals;

	let pool_ceiling;
	const POOL_CEILING = FIVE_MILLION_DEC6;

	let pausedPrice;
	const PAUSEDPRICE = 0;

	let bonus_rate;
	const BONUS_RATE = 7500;

	let redemption_delay;
	const REDEMPTION_DELAY = 1;

	// AccessControl state variables
	const er_mintPaused = false;
	const er_redeemPaused = false;
	const er_recollateralizePaused = false;
	const er_buyBackPaused = false;
	const er_collateralPricePaused = false;

	// AccessControl state variables
	let ar_mintPaused;
	let ar_redeemPaused;
	let ar_recollateralizePaused;
	let ar_buyBackPaused;
	let ar_collateralPricePaused;

	const global_collateral_ratio_initial_value = 1000000;
	const RefreshCooldown_Initial_Value = 60;
	const DECIMALS_DEFAULT_VALUE = 18;
	const NAME_DEFAULT_VALUE = "CERES";
	const SYMBOL_DEFAULT_VALUE = "CERES";
	const MIN_PERIOD = 1;
	const DEFAULT_PERIOD = 5;

    let account0;
    let account1;
    let account2;
    let account3;
    let account4;
    let account5;
    let account6;
    let account7;

    beforeEach(async() => {
		ADMIN = accounts[0];
		COLLATERAL_CERES_AND_CERESHARES_OWNER = accounts[1];
		OWNER = accounts[1];
		METAMASK_ADDRESS = accounts[2];
		account0 = accounts[0];
		account1 = accounts[1];
		account2 = accounts[2];
		account3 = accounts[3];
		account4 = accounts[4];
		account5 = accounts[5];
		account6 = accounts[6];
		account7 = accounts[7];

		ceresInstance = await CEREStable.deployed();
		cssInstance = await CEREShares.deployed();
		wethInstance = await WETH.deployed();

		col_instance_USDC = await FakeCollateral_USDC.deployed(); 
		col_instance_USDT = await FakeCollateral_USDT.deployed(); 
		col_instance_6DEC = await FakeCollateral_6DEC.deployed();

		routerInstance = await UniswapV2Router02_Modified.deployed(); 
		timelockInstance = await Timelock.deployed(); 
		uniswapFactoryInstance = await UniswapV2Factory.deployed(); 
		uniswapLibraryInstance = await UniswapV2Library.deployed(); 
		uniswapOracleLibraryInstance = await UniswapV2OracleLibrary.deployed(); 
		swapToPriceInstance = await SwapToPrice.deployed(); 

		pair_addr_CERES_WETH = await uniswapFactoryInstance.getPair(ceresInstance.address, wethInstance.address, { from: COLLATERAL_CERES_AND_CERESHARES_OWNER });
		pair_addr_CERES_USDC = await uniswapFactoryInstance.getPair(ceresInstance.address, FakeCollateral_USDC.address, { from: COLLATERAL_CERES_AND_CERESHARES_OWNER });
		pair_addr_CSS_WETH = await uniswapFactoryInstance.getPair(cssInstance.address, wethInstance.address, { from: COLLATERAL_CERES_AND_CERESHARES_OWNER });
		pair_addr_CSS_USDC = await uniswapFactoryInstance.getPair(cssInstance.address, FakeCollateral_USDC.address, { from: COLLATERAL_CERES_AND_CERESHARES_OWNER });

		oracle_instance_CERES_WETH = await UniswapPairOracle_CERES_WETH.deployed();
		oracle_instance_CERES_USDC = await UniswapPairOracle_CERES_USDC.deployed();
		oracle_instance_USDC_WETH = await UniswapPairOracle_USDC_WETH.deployed();
		oracle_instance_CSS_WETH = await UniswapPairOracle_CSS_WETH.deployed();
		oracle_instance_CSS_USDC = await UniswapPairOracle_CSS_USDC.deployed();

		first_CERES_WETH = await oracle_instance_CERES_WETH.token0();
		first_CERES_USDC = await oracle_instance_CERES_USDC.token0();
		first_CSS_WETH = await oracle_instance_CSS_WETH.token0();
		first_CSS_USDC = await oracle_instance_CSS_USDC.token0();

		first_CERES_WETH = ceresInstance.address == first_CERES_WETH;
		first_CERES_USDC = ceresInstance.address == first_CERES_USDC;
		first_CSS_WETH = cssInstance.address == first_CSS_WETH;
		first_CSS_USDC = cssInstance.address == first_CSS_USDC;

		pool_instance_USDC = await Pool_USDC.deployed();
		oracle_chainlink_ETH_USD = await ChainlinkETHUSDPriceConsumerTest.deployed();
    });









	it ("Test for constants.ZERO_ADDRESS & constants.MAX_UINT256", async() => {
		console.log(chalk.yellow(constants.ZERO_ADDRESS));
		console.log(chalk.yellow(constants.MAX_UINT256));
	});

	it ("Test for time.increase(3) func", async() => {
		const THREE = 3;
		const timestamp_before = (new BigNumber(await time.latest())).toNumber();
		await time.increase(THREE);
		// const timestamp_after = (new BigNumber(await time.latest())).toNumber();

		// ASSERTION
		// expect(timestamp_after-timestamp_before).to.equal(THREE);
	});

	// Test for increase 1million seconds(1000000) to verify that it works for future timestamp
	it ("Test for time.increase(1000000) func", async() => {
		const ONE_MILLION = 1000000;
		const timestamp_before = (new BigNumber(await time.latest())).toNumber();
		await time.increase(ONE_MILLION);
		// const timestamp_after = (new BigNumber(await time.latest())).toNumber();

		// ASSERTION
		// expect(timestamp_after-timestamp_before).to.equal(ONE_MILLION);
	});

	it ("Test for time.advanceBlock() 3 times", async() => {
		const THREE = 3;
		const latestBlock_before = (new BigNumber(await time.latestBlock())).toNumber();
		for (var i=0;i<THREE; i++) { await time.advanceBlock()};
		const latestBlock_after = (new BigNumber(await time.latestBlock())).toNumber();

		// ASSERTION
		expect(latestBlock_after-latestBlock_before).to.equal(THREE);
	});

	it ("Test for time.advanceBlock() 100 times", async() => {
		const ONE_HUNDRED = 100;
		const latestBlock_before = (new BigNumber(await time.latestBlock())).toNumber();
		for (var i=0;i<ONE_HUNDRED; i++) { await time.advanceBlock()};
		const latestBlock_after = (new BigNumber(await time.latestBlock())).toNumber();

		// ASSERTION
		expect(latestBlock_after-latestBlock_before).to.equal(ONE_HUNDRED);
	});

	it ("Test for time.advanceBlockTo(latestBlock+3)", async() => {
		const NUMBER = 3;
		const latestBlock_before = (new BigNumber(await time.latestBlock())).toNumber();
		const advanceBlockTo = latestBlock_before + NUMBER;
		await time.advanceBlockTo(advanceBlockTo);
		const latestBlock_after = (new BigNumber(await time.latestBlock())).toNumber();

		// ASSERTION
		expect(latestBlock_after-latestBlock_before).to.equal(NUMBER);
	});

	it ("Test for time.advanceBlockTo(latestBlock+100)", async() => {
		const NUMBER = 100;
		const latestBlock_before = (new BigNumber(await time.latestBlock())).toNumber();
		const advanceBlockTo = latestBlock_before + NUMBER;
		await time.advanceBlockTo(advanceBlockTo);
		const latestBlock_after = (new BigNumber(await time.latestBlock())).toNumber();

		// ASSERTION
		expect(latestBlock_after-latestBlock_before).to.equal(NUMBER);
	});

	it ("Test for ERC20.transFrom() func", async() => {
		console.log(chalk.red(`====================== transFrom ================`));
		// const USDC_METAMASK_ADDRESS_BEFORE = await col_instance_USDC.balanceOf(METAMASK_ADDRESS);
		// console.log(chalk.yellow(`USDC_METAMASK_ADDRESS_BEFORE: ${USDC_METAMASK_ADDRESS_BEFORE}`));

		await col_instance_USDC.approve(account2, TWO_MILLION_DEC6, { from: account1 });
		console.log(chalk.yellow(`allowance ${account1} to ${account2}: ${await col_instance_USDC.allowance(account1,account2)}`));

		await col_instance_USDC.increaseAllowance(account2,TWO_MILLION_DEC6,{ from: account1 });
		console.log(chalk.yellow(`allowance ${account1} to ${account2}: ${await col_instance_USDC.allowance(account1,account2)}`));

		const balance_account1 = parseFloat(await col_instance_USDC.balanceOf(account1));
		const balance_account2 = parseFloat(await col_instance_USDC.balanceOf(account2));
		const balance_account3 = parseFloat(await col_instance_USDC.balanceOf(account3));
		console.log(chalk.yellow(`balance_account1: ${balance_account1}; balance_account2: ${balance_account2}; balance_account3: ${balance_account3};`));
		
		await col_instance_USDC.transferFrom(account1,account3,ONE_MILLION_DEC6,{from: account2});
		await col_instance_USDC.transferFrom(account1,account4,ONE_MILLION_DEC6,{from: account2});
		await col_instance_USDC.transferFrom(account1,account3,ONE_MILLION_DEC6,{from: account2});
		await col_instance_USDC.transferFrom(account1,account3,ONE_MILLION_DEC6,{from: account2});

		const balance_account1_after = parseFloat(await col_instance_USDC.balanceOf(account1));
		const balance_account2_after = parseFloat(await col_instance_USDC.balanceOf(account2));
		const balance_account3_after = parseFloat(await col_instance_USDC.balanceOf(account3));
		const balance_account4_after = parseFloat(await col_instance_USDC.balanceOf(account4));
		console.log(chalk.yellow(`allowance ${account1} to ${account2}: ${await col_instance_USDC.allowance(account1,account2)}`));
		console.log(chalk.yellow(`balance_account1_after: ${balance_account1_after}; balance_account2_after: ${balance_account2_after}; balance_account3_after: ${balance_account3_after}; balance_account4_after: ${balance_account4_after};`));

	


	});

	it ("Test For collateral_token.transferFrom(address(this), msg.sender, collateral_amount)", async() => {
		// PREPARE
		const account_source = OWNER;
		// const account_target = pool_instance_USDC.address;
		const account_target = ADMIN;
		const account_3rd = METAMASK_ADDRESS;
		
		// BEFORE
		col_instance_USDC.approve(account_target,TWO_MILLION_DEC6,{from: account_source});
		console.log(chalk.yellow(`allowance ${account_source} to ${account_target}: ${await col_instance_USDC.allowance(account_source,account_target)}`));
		const balance_account_3rd_before = parseFloat(await col_instance_USDC.balanceOf(account_3rd));
		console.log(chalk.yellow(`balance_account_3rd_before: ${balance_account_3rd_before}`));
		
		// AFTER
		col_instance_USDC.transferFrom(account_source,account_3rd,ONE_MILLION_DEC6,{from: account_target});
		console.log(chalk.yellow(`allowance ${account_source} to ${account_target}: ${await col_instance_USDC.allowance(account_source,account_target)}`));

		const balance_account_3rd_after = parseFloat(await col_instance_USDC.balanceOf(account_3rd));
		console.log(chalk.yellow(`balance_account_3rd_after: ${balance_account_3rd_after}`));

		// AFTER
		col_instance_USDC.transferFrom(account_source,account_3rd,ONE_MILLION_DEC6,{from: account_target});
		console.log(chalk.yellow(`allowance ${account_source} to ${account_target}: ${await col_instance_USDC.allowance(account_source,account_target)}`));

		const balance_account_3rd_after2 = parseFloat(await col_instance_USDC.balanceOf(account_3rd));
		console.log(chalk.yellow(`balance_account_3rd_after2: ${balance_account_3rd_after2}`));
	});

	it ("Test For collateral_token.transferFrom(address(this), msg.sender, collateral_amount)", async() => {
		// PREPARE
		const account_source = OWNER;
		// const account_target = pool_instance_USDC.address;
		const account_target = ADMIN;
		const account_3rd = METAMASK_ADDRESS;
		
		// BEFORE
		col_instance_USDC.approve(account_target,TWO_MILLION_DEC6,{from: account_source});
		console.log(chalk.yellow(`allowance ${account_source} to ${account_target}: ${await col_instance_USDC.allowance(account_source,account_target)}`));
		const balance_account_3rd_before = parseFloat(await col_instance_USDC.balanceOf(account_3rd));
		console.log(chalk.yellow(`balance_account_3rd_before: ${balance_account_3rd_before}`));
		
		// AFTER
		col_instance_USDC.transferFrom(account_source,account_3rd,ONE_MILLION_DEC6,{from: account_target});
		console.log(chalk.yellow(`allowance ${account_source} to ${account_target}: ${await col_instance_USDC.allowance(account_source,account_target)}`));

		const balance_account_3rd_after = parseFloat(await col_instance_USDC.balanceOf(account_3rd));
		console.log(chalk.yellow(`balance_account_3rd_after: ${balance_account_3rd_after}`));

		// AFTER
		col_instance_USDC.transferFrom(account_source,account_3rd,ONE_MILLION_DEC6,{from: account_target});
		console.log(chalk.yellow(`allowance ${account_source} to ${account_target}: ${await col_instance_USDC.allowance(account_source,account_target)}`));

		const balance_account_3rd_after2 = parseFloat(await col_instance_USDC.balanceOf(account_3rd));
		console.log(chalk.yellow(`balance_account_3rd_after2: ${balance_account_3rd_after2}`));
	});
	
});













