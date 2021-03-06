const BigNumber = require('bignumber.js');
const BN = BigNumber.clone({ DECIMAL_PLACES: 9 })
const util = require('util');
const chalk = require('chalk');
const Contract = require('web3-eth-contract');
const { expectRevert, time } = require('@openzeppelin/test-helpers');
const { assert, expect } = require('chai');
const constants = require('@openzeppelin/test-helpers/src/constants');

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

// set constants
const ONE_MILLION_DEC18 = new BigNumber("1000000e18");
const FIVE_MILLION_DEC18 = new BigNumber("5000000e18");
const FIVE_MILLION_DEC6 = new BigNumber("5000000e6");
const TEN_MILLION_DEC18 = new BigNumber("10000000e18");
const ONE_HUNDRED_MILLION_DEC18 = new BigNumber("100000000e18");
const ONE_HUNDRED_MILLION_DEC6 = new BigNumber("100000000e6");
const ONE_BILLION_DEC18 = new BigNumber("1000000000e18");
const COLLATERAL_SEED_DEC18 = new BigNumber(508500e18);

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
const UniswapPairOracle = artifacts.require("Oracle/UniswapPairOracle");

// ChainlinkETHUSD Contract
const ChainlinkETHUSDPriceConsumerTest = artifacts.require("Oracle/ChainlinkETHUSDPriceConsumerTest");
const ChainlinkETHUSDPriceConsumer = artifacts.require("Oracle/ChainlinkETHUSDPriceConsumer");

const Pool_USDC = artifacts.require("Ceres/Pools/Pool_USDC");

contract('test_CERES_Contract_P2', async (accounts) => {
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

    beforeEach(async() => {
		ADMIN = accounts[0];
		COLLATERAL_CERES_AND_CERESHARES_OWNER = accounts[1];
		OWNER = accounts[1];
		METAMASK_ADDRESS = accounts[2];
		const account0 = accounts[0];
		const account1 = accounts[1];
		const account2 = accounts[2];
		const account3 = accounts[3];
		const account4 = accounts[4];
		const account5 = accounts[5];
		const account6 = accounts[6];
		const account7 = accounts[7];

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

	it ("Test Scripts for ceresInstance.address", async() => {
		const ceresInstance_address = await ceresInstance.address;
		// console.log(chalk.blue(`ceresInstance_address: ${ceresInstance_address}`));
		expect(ceresInstance_address).to.not.be.empty;
		expect(ceresInstance_address).to.not.be.undefined;
	});

	it ("Test Scripts for ceresInstance.eth_usd_consumer_address", async() => {
		const eth_usd_consumer_address = await ceresInstance.eth_usd_consumer_address();
		// console.log(chalk.blue(`oracle_chainlink_ETH_USD: ${oracle_chainlink_ETH_USD.address}`));
		// console.log(chalk.yellow(`eth_usd_consumer_address: ${eth_usd_consumer_address}`));
		expect(eth_usd_consumer_address).to.equal(oracle_chainlink_ETH_USD.address);
	});

	it ("Test Scripts for ceresInstance.eth_usd_pricer_decimals", async() => {
		const eth_usd_pricer_decimals = parseFloat(await ceresInstance.eth_usd_pricer_decimals());
		// console.log(chalk.yellow(`eth_usd_pricer_decimals: ${eth_usd_pricer_decimals}`));
		expect(eth_usd_pricer_decimals).to.equal(8);
	});

	it ("Test Scripts for ceresInstance.eth_usd_pricer CONTRACT INSTANCE", async() => {
		const eth_usd_pricer = await ceresInstance.eth_usd_pricer();
		const instance_eth_usd_pricer = await ChainlinkETHUSDPriceConsumer.at(eth_usd_pricer);

		const getDecimals = parseFloat(await instance_eth_usd_pricer.getDecimals());
		// console.log(chalk.yellow(`getDecimals: ${getDecimals}`));
		expect(getDecimals).to.equal(8);

		const getLatestPrice = parseFloat(await instance_eth_usd_pricer.getLatestPrice());
		// console.log(chalk.yellow(`getLatestPrice: ${getLatestPrice}`));

	})

	// ADDED TEST CASES FOR ceres_pools_array[0]
	// ADDED TEST CASES FOR ceres_pools_array.length
	// ADDED TEST CASES FOR ceres_pools.state
	it ("Test Scripts for ceresInstance.ceres_pools_array", async() => {
		const ceres_pools_array_0 = await ceresInstance.ceres_pools_array(0);
		// console.log(chalk.yellow(`ceres_pools_array_0: ${ceres_pools_array_0}`));
		expect(ceres_pools_array_0).to.equal(pool_instance_USDC.address);

		const ceres_pools_array_lenth = parseFloat(await ceresInstance.ceres_pools_array_lenth());
		// console.log(chalk.yellow(`ceres_pools_array_lenth: ${ceres_pools_array_lenth}`));
		expect(ceres_pools_array_lenth).to.equal(1);

		const ceres_pools_0_state = await ceresInstance.ceres_pools.call(ceres_pools_array_0);
		// console.log(chalk.yellow(`ceres_pools_0_state: ${ceres_pools_0_state}`));
		expect(ceres_pools_0_state).to.equal(true);
	});

	it ("Test Scripts for ceresInstance.global_collateral_ratio",async() => {
		// Before
		await ceresInstance.setRefreshCooldown(1,{from: OWNER});
		// Action
		await ceresInstance.refreshCollateralRatio();
		// Print
		const global_collateral_ratio = parseFloat(await ceresInstance.global_collateral_ratio());
		expect(global_collateral_ratio).to.gt(0);
		expect(global_collateral_ratio).to.lt(global_collateral_ratio_initial_value);
		// ROLL BACK
		await ceresInstance.setRefreshCooldown(RefreshCooldown_Initial_Value,{from: OWNER}); //ROLL BACK
		expect(parseFloat(await ceresInstance.refresh_cooldown())).to.equal(RefreshCooldown_Initial_Value);
	});

	it ("Test Scripts for ceresInstance.redemption_fee & minting_fee", async() => {
		const MINTING_FEE = 300; // 0.03%
		const REDEMPTION_FEE = 400; // 0.04%

		const redemption_fee = parseFloat(await ceresInstance.redemption_fee());
		const minting_fee = parseFloat(await ceresInstance.minting_fee());

		expect(redemption_fee).to.equal(REDEMPTION_FEE);
		expect(minting_fee).to.equal(MINTING_FEE);
	})

	it ("Test Scripts for ceresInstance.ceres_step, its default value is 2500", async() => {
		const CERES_STEP_DEFAULT_VALUE = 2500; 
		const ceres_step = parseFloat(await ceresInstance.ceres_step());
		expect(ceres_step).to.equal(CERES_STEP_DEFAULT_VALUE);
	});

	it ("Test Scripts for ceresInstance.refresh_cooldown, its default value is 60", async() => {
		const refresh_cooldown_DEFAULT_VALUE = 60; 
		const refresh_cooldown = parseFloat(await ceresInstance.refresh_cooldown());
		expect(refresh_cooldown).to.equal(refresh_cooldown_DEFAULT_VALUE);
	});

	it ("Test Scripts for ceresInstance.price_target, its default value is 1000000", async() => {
		const price_target_DEFAULT_VALUE = 1000000; 
		const price_target = parseFloat(await ceresInstance.price_target());
		expect(price_target).to.equal(price_target_DEFAULT_VALUE);
	});

	it ("Test Scripts for ceresInstance.price_band, its default value is 5000", async() => {
		const price_band_DEFAULT_VALUE = 5000; 
		const price_band = parseFloat(await ceresInstance.price_band());
		expect(price_band).to.equal(price_band_DEFAULT_VALUE);
	});

	it ("Test Scripts for ceresInstance.COLLATERAL_RATIO_PAUSER", async() => {
		const COLLATERAL_RATIO_PAUSER = await ceresInstance.COLLATERAL_RATIO_PAUSER();
		// console.log(chalk.yellow(`COLLATERAL_RATIO_PAUSER: ${COLLATERAL_RATIO_PAUSER}`));
	});

	it ("Test Scripts for ceresInstance.ceres_price() func", async() => {
		const ceres_price = parseFloat(await ceresInstance.ceres_price());
		// console.log(chalk.yellow(`ceres_price: ${ceres_price}`));
		expect(ceres_price).to.not.equal(0);
		expect(ceres_price).to.gt(0);
	});

	it ("Test Scripts for ceresInstance.css_price() func", async() => {
		const css_price = parseFloat(await ceresInstance.css_price());
		// console.log(chalk.yellow(`css_price: ${css_price}`));
		expect(css_price).to.not.equal(0);
		expect(css_price).to.gt(0);
	});

	it ("Test Scripts for ceresInstance.eth_usd_price() func", async() => {
		const eth_usd_price = parseFloat(await ceresInstance.eth_usd_price());
		// console.log(chalk.yellow(`eth_usd_price: ${eth_usd_price}`));
		expect(eth_usd_price).to.not.equal(0);
		expect(eth_usd_price).to.gt(0);
	});

	it ("Test Scripts for ceresInstance.globalCollateralValue() func", async() => {
		const globalCollateralValue = parseFloat(await ceresInstance.globalCollateralValue());
		// console.log(chalk.yellow(`globalCollateralValue: ${globalCollateralValue}`));
		expect(globalCollateralValue).to.not.equal(0);
		expect(globalCollateralValue).to.gt(0);
	});





});













