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
const ChainlinkETHUSDPriceConsumerTest2 = artifacts.require("Oracle/ChainlinkETHUSDPriceConsumerTest2");

const Pool_USDC = artifacts.require("Ceres/Pools/Pool_USDC");

contract('test_CERES_Contract_P1', async (accounts) => {
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
    });

	it ("Test Scripts for ceresInstance.address", async() => {
		const ceresInstance_address = await ceresInstance.address;
		// console.log(chalk.yellow(`ceresInstance_address: ${ceresInstance_address}`));
	});

	it ("Test Scripts for ceresInstance.setRefreshCooldown() & refreshCollateralRatio() func", async() => {

		// Before
		await ceresInstance.setRefreshCooldown(1,{from: OWNER});
		// Action
		await ceresInstance.refreshCollateralRatio();
		// Print
		const global_collateral_ratio = parseFloat(await ceresInstance.global_collateral_ratio());
		// console.log(chalk.yellow(`global_collateral_ratio: ${global_collateral_ratio}`));
		expect(global_collateral_ratio).to.gt(0);
		expect(global_collateral_ratio).to.lt(global_collateral_ratio_initial_value);
		// ROLL BACK
		await ceresInstance.setRefreshCooldown(RefreshCooldown_Initial_Value,{from: OWNER}); //ROLL BACK
		expect(parseFloat(await ceresInstance.refresh_cooldown())).to.equal(RefreshCooldown_Initial_Value);
	});

	it ("Test Scripts for ceresIntance.last_call_time()", async() => {
		const last_call_time = parseFloat(await ceresInstance.last_call_time());
		expect(last_call_time).to.gt(0);
	});

	it ("Test Scripts for ceresInstance.collateral_ratio_paused(), its default value is false", async() => {
		const collateral_ratio_paused = await ceresInstance.collateral_ratio_paused();
		expect(collateral_ratio_paused).to.equal(false);
	});

	it ("Test Scripts for ceresInstance.DEFAULT_ADMIN_ADDRESS, its default value should be ADMIN", async() => {
		const DEFAULT_ADMIN_ADDRESS = await ceresInstance.DEFAULT_ADMIN_ADDRESS();
		// console.log(chalk.yellow(`DEFAULT_ADMIN_ADDRESS: ${DEFAULT_ADMIN_ADDRESS}`));
		expect(DEFAULT_ADMIN_ADDRESS).to.equal(ADMIN);
	});

	it ("Test scripts for ceresInstance.PRICE_PRECISION, its default should be BIG6",async() => {
		const PRICE_PRECISION = parseFloat(await ceresInstance.PRICE_PRECISION());
		expect(PRICE_PRECISION).to.equal(parseFloat(BIG6));
	});

	it ("Test Scripts for ceresInstance.name/symbol/decimals", async() => {
		const name = await ceresInstance.name();
		const symbol = await ceresInstance.symbol();
		const decimals = parseFloat(await ceresInstance.decimals());

		expect(name).to.equal(NAME_DEFAULT_VALUE);
		expect(symbol).to.equal(SYMBOL_DEFAULT_VALUE);
		expect(decimals).to.equal(DECIMALS_DEFAULT_VALUE);
	});

	it ("Test Scripts for ceresInstance.genesis_supply, its default value is one_million_dec18", async() => {
		const genesis_supply = parseFloat(await ceresInstance.genesis_supply());
		expect(genesis_supply).to.equal(parseFloat(ONE_MILLION_DEC18));
	});

	it ("Test Scripts for ceresInstance.owner_address,creator_address,timelock_address,controller_address", async() => {
		const owner_address = await ceresInstance.owner_address();
		const creator_address = await ceresInstance.creator_address();
		const timelock_address = await ceresInstance.timelock_address();
		const controller_address = await ceresInstance.controller_address();

		// console.log(chalk.yellow(`owner_address: ${owner_address}`));
		// console.log(chalk.yellow(`creator_address: ${creator_address}`));
		// console.log(chalk.yellow(`timelock_address: ${timelock_address}`));
		// console.log(chalk.yellow(`controller_address: ${controller_address}`));

		expect(owner_address).to.equal(OWNER);
		expect(creator_address).to.equal(OWNER);
		expect(timelock_address).to.equal(timelockInstance.address);
		expect(controller_address).to.equal(constants.ZERO_ADDRESS);
	});

	it ("Test Scripts for ceresInstance.css_address & weth_address", async() => {
		const css_address = await ceresInstance.css_address();
		const weth_address = await ceresInstance.weth_address();

		// console.log(chalk.yellow(`css_address: ${css_address}`));
		// console.log(chalk.yellow(`weth_address: ${weth_address}`));

		expect(css_address).to.equal(constants.ZERO_ADDRESS);
		expect(weth_address).to.equal(wethInstance.address);
	});

	it ("Test Scripts for ceresInstance.ceres_eth_oracle_address & css_eth_oracle_address", async() => {
		const ceres_eth_oracle_address = await ceresInstance.ceres_eth_oracle_address();
		const css_eth_oracle_address = await ceresInstance.css_eth_oracle_address();

		// console.log(chalk.yellow(`ceres_eth_oracle_address: ${ceres_eth_oracle_address}`));
		// console.log(chalk.yellow(`css_eth_oracle_address: ${css_eth_oracle_address}`));
		// console.log(chalk.yellow(`oracle_instance_CERES_WETH.address: ${oracle_instance_CERES_WETH.address}`));
		// console.log(chalk.yellow(`oracle_instance_CSS_WETH.address: ${oracle_instance_CSS_WETH.address}`));

		expect(ceres_eth_oracle_address).to.equal(oracle_instance_CERES_WETH.address);
		expect(css_eth_oracle_address).to.equal(oracle_instance_CSS_WETH.address);
	});

	// Test for ceresInstance.CeresEthOracle address
	// Test for invoke parameters in "ceresInstance.CeresEthOracle"
	it ("Test Scripts for ceresInstance.CeresEthOracle instances", async() => {
		const CeresEthOracle_address = await ceresInstance.CeresEthOracle();
		// console.log(chalk.yellow(`CeresEthOracle_address: ${CeresEthOracle_address}`));
		const instanceCeresEthOracle = await UniswapPairOracle.at(CeresEthOracle_address);
		const PERIOD = parseFloat(await instanceCeresEthOracle.PERIOD());
		expect(PERIOD).to.equal(5);
		const CONSULT_LENIENCY = parseFloat(await instanceCeresEthOracle.CONSULT_LENIENCY());
		expect(CONSULT_LENIENCY).to.equal(120);
		const ALLOW_STALE_CONSULTS = await instanceCeresEthOracle.ALLOW_STALE_CONSULTS();
		expect(ALLOW_STALE_CONSULTS).to.equal(true);

		const token0 = await instanceCeresEthOracle.token0();
		const token1 = await instanceCeresEthOracle.token1();
		console.log(chalk.blue(`ceresInstance.address: ${ceresInstance.address}`));
		console.log(chalk.blue(`wethInstance.address: ${wethInstance.address}`));
		console.log(chalk.yellow(`token0: ${token0}`));
		console.log(chalk.yellow(`token1: ${token1}`));

		console.log(chalk.yellow("----------------------------- SEPERATOR ---------------------------"));
		const price0CumulativeLast = await instanceCeresEthOracle.price0CumulativeLast();
		const price1CumulativeLast = await instanceCeresEthOracle.price1CumulativeLast();
		console.log(chalk.yellow(`price0CumulativeLast: ${price0CumulativeLast}`));
		console.log(chalk.yellow(`price1CumulativeLast: ${price1CumulativeLast}`));

		const price0Average = await instanceCeresEthOracle.price0Average();
		const price1Average = await instanceCeresEthOracle.price1Average();
		console.log(chalk.yellow(`price0Average: ${price0Average}`));
		console.log(chalk.yellow(`price1Average: ${price1Average}`));

		const reserve0 = await instanceCeresEthOracle.reserve0();
		const reserve1 = await instanceCeresEthOracle.reserve1();
		console.log(chalk.yellow(`reserve0: ${reserve0}`));
		console.log(chalk.yellow(`reserve1: ${reserve1}`));

		const blockTimestampLast = await instanceCeresEthOracle.blockTimestampLast();
		console.log(chalk.yellow(`blockTimestampLast: ${blockTimestampLast}`));

		const pair_address = await instanceCeresEthOracle.pair_address();
		console.log(chalk.blue(`pair_addr_CERES_WETH: ${pair_addr_CERES_WETH}`));
		console.log(chalk.yellow(`pair_address: ${pair_address}`));
		const pair = await instanceCeresEthOracle.pair();
		expect(pair_address).to.equal(pair_addr_CERES_WETH);
		expect(pair_address).to.equal(pair);
		console.log(chalk.yellow("----------------------------- SEPERATOR ---------------------------"));
		const canUpdate = await instanceCeresEthOracle.canUpdate();
		console.log(chalk.yellow(`canUpdate: ${canUpdate}`));
	});

	it ("Test Scripts for ceresInstance.CeresEthOracle UPDATE()", async() => {
		const CeresEthOracle_address = await ceresInstance.CeresEthOracle();
		const instanceCeresEthOracle = await UniswapPairOracle.at(CeresEthOracle_address);
		await instanceCeresEthOracle.setPeriod(MIN_PERIOD, { from: OWNER });
		await instanceCeresEthOracle.update({from: OWNER});
		await instanceCeresEthOracle.setPeriod(DEFAULT_PERIOD, { from: OWNER });
	});

	it ("Test Scripts for ceresInstance.CeresEthOracle consult()", async() => {
		const CeresEthOracle_address = await ceresInstance.CeresEthOracle();
		const instanceCeresEthOracle = await UniswapPairOracle.at(CeresEthOracle_address);
		let ceres_price_from_CERES_WETH = parseFloat((new BigNumber(await instanceCeresEthOracle.consult.call(wethInstance.address, BIG6))).div(BIG6));
		// PRINT
		// console.log(chalk.yellow(`ceres_price_from_CERES_WETH: ${ceres_price_from_CERES_WETH}`));
		// ASSERTION
		expect(ceres_price_from_CERES_WETH).to.gt(0);
	});

	it ("Test Scripts for ceresInstance.CSSEthOracle instances", async() => { 
		const CSSEthOracle_address = await ceresInstance.CSSEthOracle();
		// console.log(chalk.blue(`oracle_instance_CSS_WETH.address: ${oracle_instance_CSS_WETH.address}`));
		// console.log(chalk.yellow(`CSSEthOracle_address: ${CSSEthOracle_address}`));
		const instanceCSSEthOracle = await UniswapPairOracle.at(CSSEthOracle_address);
		expect(CSSEthOracle_address).to.equal(oracle_instance_CSS_WETH.address);

		const token0 = await instanceCSSEthOracle.token0();
		const token1 = await instanceCSSEthOracle.token1();
		console.log(chalk.blue(`cssInstance.address: ${cssInstance.address}`));
		console.log(chalk.blue(`wethInstance.address: ${wethInstance.address}`));
		console.log(chalk.yellow(`token0: ${token0}`));
		console.log(chalk.yellow(`token1: ${token1}`));
		console.log(chalk.yellow("----------------------------- SEPERATOR ---------------------------"));

		const price0CumulativeLast = await instanceCSSEthOracle.price0CumulativeLast();
		const price1CumulativeLast = await instanceCSSEthOracle.price1CumulativeLast();
		console.log(chalk.yellow(`price0CumulativeLast: ${price0CumulativeLast}`));
		console.log(chalk.yellow(`price1CumulativeLast: ${price1CumulativeLast}`));

		const price0Average = await instanceCSSEthOracle.price0Average();
		const price1Average = await instanceCSSEthOracle.price1Average();
		console.log(chalk.yellow(`price0Average: ${price0Average}`));
		console.log(chalk.yellow(`price1Average: ${price1Average}`));

		const reserve0 = await instanceCSSEthOracle.reserve0();
		const reserve1 = await instanceCSSEthOracle.reserve1();
		console.log(chalk.yellow(`reserve0: ${reserve0}`));
		console.log(chalk.yellow(`reserve1: ${reserve1}`));
		console.log(chalk.yellow("----------------------------- SEPERATOR ---------------------------"));

		const pair_address = await instanceCSSEthOracle.pair_address();
		const pair = await instanceCSSEthOracle.pair();
		expect(pair_address).to.equal(pair_addr_CSS_WETH);
		expect(pair_address).to.equal(pair);

		const canUpdate = await instanceCSSEthOracle.canUpdate();
		expect(canUpdate).to.equal(true);
	});

	it ("Test Scripts for ceresInstance.CSSEthOracle UPDATE()", async() => {
		const CSSEthOracle_address = await ceresInstance.CSSEthOracle();
		const instanceCSSEthOracle = await UniswapPairOracle.at(CSSEthOracle_address);
		await instanceCSSEthOracle.setPeriod(MIN_PERIOD, { from: OWNER });
		await instanceCSSEthOracle.update({from: OWNER});
		await instanceCSSEthOracle.setPeriod(DEFAULT_PERIOD, { from: OWNER });
	});

	it ("Test Scripts for ceresInstance.CSSEthOracle consult()", async() => {
		const CSSEthOracle_address = await ceresInstance.CSSEthOracle();
		const instanceCSSEthOracle = await UniswapPairOracle.at(CSSEthOracle_address);
		let css_price_from_CSS_WETH = parseFloat((new BigNumber(await instanceCSSEthOracle.consult.call(wethInstance.address, BIG6))).div(BIG6));
		// PRINT
		console.log(chalk.yellow(`css_price_from_CSS_WETH: ${css_price_from_CSS_WETH}`));
		// ASSERTION
		expect(css_price_from_CSS_WETH).to.gt(0);
	});





});













