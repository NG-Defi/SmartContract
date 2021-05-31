const BigNumber = require('bignumber.js');
const util = require('util');
const chalk = require('chalk');
const Contract = require('web3-eth-contract');
const { expectRevert, time } = require('@openzeppelin/test-helpers');

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

// Fake Oracle
const UniswapPairOracle_CERES_WETH = artifacts.require("Oracle/Fakes/UniswapPairOracle_CERES_WETH");
const UniswapPairOracle_CERES_USDC = artifacts.require("Oracle/Fakes/UniswapPairOracle_CERES_USDC");
const UniswapPairOracle_CSS_WETH = artifacts.require("Oracle/Fakes/UniswapPairOracle_CSS_WETH");
const UniswapPairOracle_CSS_USDC = artifacts.require("Oracle/Fakes/UniswapPairOracle_CSS_USDC");



contract('CERES', async (accounts) => {
	// deploy address;
	let ADMIN;
	let COLLATERAL_CERES_AND_CERESHARES_OWNER;

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

	// CERES Constants
	let totalSupplyCERES;
	let totalSupplyCSS;
	let globalCollateralRatio;
	let globalCollateralValue;
	// CERES public constants
	let global_collateral_ratio;
	let redemption_fee;
	let minting_fee;
	let ceres_step;
	let refresh_cooldown;
	let price_target;
	let price_band;
	let DEFAULT_ADMIN_ADDRESS;
	let COLLATERAL_RATIO_PAUSER;
	let collateral_ratio_paused;

	// CERES ERC20 info
	let symbol;
	let name;
	let decimals;
	let owner_address;
	let creator_address;
	let timelock_address;
	let controller_address;
	let css_address;
	let ceres_eth_oracle_address;
	let css_eth_oracle_address;
	let weth_address;
	let eth_usd_consumer_address;
	let genesis_supply;


	

    beforeEach(async() => {
		console.log("begin test");

		// set the deploy address
		console.log(chalk.yellow('===== SET THE DEPLOY ADDRESSES ====='));
		ADMIN = accounts[0];
		COLLATERAL_CERES_AND_CERESHARES_OWNER = accounts[1];
		console.log("ADMIN: ",ADMIN.address);
		console.log("COLLATERAL_CERES_AND_CERESHARES_OWNER: ",COLLATERAL_CERES_AND_CERESHARES_OWNER.address);

		// CERES Core  Contract instances
		console.log(chalk.red('===== GET THE CORE ADDRESSES ====='));
		ceresInstance = await CEREStable.deployed();
		cssInstance = await CEREShares.deployed();
		console.log(chalk.yellow("ceresInstance: ",ceresInstance.address));
		console.log(chalk.yellow("cssInstance: ",cssInstance.address));


		console.log(chalk.red('====== Get Fake WETH & USDC & USDT ======='));
		// Fill collateral instances
		wethInstance = await WETH.deployed();
		col_instance_USDC = await FakeCollateral_USDC.deployed(); 
		col_instance_USDT = await FakeCollateral_USDT.deployed(); 
		col_instance_6DEC = await FakeCollateral_6DEC.deployed();

		console.log("wethInstance: ",wethInstance.address);
		console.log("col_instance_USDC: ",col_instance_USDC.address);
		console.log("col_instance_USDT: ",col_instance_USDT.address);
		console.log("col_instance_6DEC: ",col_instance_6DEC.address);

		// Fill the Uniswap Router Instance
		console.log(chalk.red('====== UniswapV2Router02_Modified ======='));		
		routerInstance = await UniswapV2Router02_Modified.deployed(); 
		console.log("routerInstance: ",routerInstance.address);

		// Fill the Timelock instance
		timelockInstance = await Timelock.deployed(); 
		console.log(chalk.red('====== timelockInstance ======='));	
		console.log("timelockInstance: ",timelockInstance.address);

		// Initialize the Uniswap Factory Instance
		uniswapFactoryInstance = await UniswapV2Factory.deployed(); 
		console.log(chalk.red('====== uniswapFactoryInstance ======='));	
		console.log("uniswapFactoryInstance: ",uniswapFactoryInstance.address);

		// Initialize the Uniswap Libraries
		uniswapLibraryInstance = await UniswapV2Library.deployed(); 
		uniswapOracleLibraryInstance = await UniswapV2OracleLibrary.deployed(); 
		// Initialize the swap to price contract
		swapToPriceInstance = await SwapToPrice.deployed(); 

		console.log(chalk.red('====== uniswap Libraries & swapToPrice ======='));	
		console.log("uniswapLibraryInstance: ",uniswapLibraryInstance.address);
		console.log("uniswapOracleLibraryInstance: ",uniswapOracleLibraryInstance.address);
		console.log("swapToPriceInstance: ",swapToPriceInstance.address);


		// Get the addresses of the pairs
		console.log(chalk.red('======= get uniswap pair ceres_xxxx addresses ====='));
		// ceres_weth
		pair_addr_CERES_WETH = await uniswapFactoryInstance.getPair(ceresInstance.address, wethInstance.address, { from: COLLATERAL_CERES_AND_CERESHARES_OWNER });
		console.log("pair_addr_CERES_WETH: ",pair_addr_CERES_WETH);
		// ceres_usdc
		pair_addr_CERES_USDC = await uniswapFactoryInstance.getPair(ceresInstance.address, FakeCollateral_USDC.address, { from: COLLATERAL_CERES_AND_CERESHARES_OWNER });
		console.log("pair_addr_CERES_USDC: ",pair_addr_CERES_USDC);


		// Get the addresses of the pairs
		console.log(chalk.red('======= get uniswap pair css_xxxx addresses ====='));
		// css_weth
		pair_addr_CSS_WETH = await uniswapFactoryInstance.getPair(cssInstance.address, wethInstance.address, { from: COLLATERAL_CERES_AND_CERESHARES_OWNER });
		console.log("pair_addr_CSS_WETH: ",pair_addr_CSS_WETH);
		// ceres_usdc
		pair_addr_CSS_USDC = await uniswapFactoryInstance.getPair(cssInstance.address, FakeCollateral_USDC.address, { from: COLLATERAL_CERES_AND_CERESHARES_OWNER });
		console.log("pair_addr_CSS_USDC: ",pair_addr_CSS_USDC);

		// Fill oracle instances
		oracle_instance_CERES_WETH = await UniswapPairOracle_CERES_WETH.deployed();
		console.log("oracle_instance_CERES_WETH",oracle_instance_CERES_WETH.address);
		oracle_instance_CERES_USDC = await UniswapPairOracle_CERES_USDC.deployed();
		console.log("oracle_instance_CERES_USDC",oracle_instance_CERES_USDC.address);

		// Fill oracle instances
		oracle_instance_CSS_WETH = await UniswapPairOracle_CSS_WETH.deployed();
		console.log("oracle_instance_CSS_WETH",oracle_instance_CSS_WETH.address);
		oracle_instance_CSS_USDC = await UniswapPairOracle_CSS_USDC.deployed();
		console.log("oracle_instance_CSS_USDC",oracle_instance_CSS_USDC.address);

		// Get the pair order results
		first_CERES_WETH = await oracle_instance_CERES_WETH.token0();
		first_CERES_USDC = await oracle_instance_CERES_USDC.token0();


		first_CSS_WETH = await oracle_instance_CSS_WETH.token0();
		first_CSS_USDC = await oracle_instance_CSS_USDC.token0();


		first_CERES_WETH = ceresInstance.address == first_CERES_WETH;
		first_CERES_USDC = ceresInstance.address == first_CERES_USDC;
		first_CSS_WETH = cssInstance.address == first_CSS_WETH;
		first_CSS_USDC = cssInstance.address == first_CSS_USDC;

		console.log("first_CERES_WETH: ",first_CERES_WETH);
		console.log("first_CERES_USDC: ",first_CERES_USDC);
		console.log("first_CSS_WETH: ",first_CSS_WETH);
		console.log("first_CSS_USDC: ",first_CSS_USDC);


		

    });


	// ============================= test scripts for oracle price===================================
	it('Check up on the oracles prices', async () => {
		console.log("Check up on the oracles and make sure the prices are set");

		// time.increase 1 day
		console.log(chalk.yellow("Time.increase 1 day"));
		await time.increase(86400 + 1);
		await time.advanceBlock();

		// ceres_weth & ceres_usdc update
		console.log(chalk.yellow("oracle_instance_ceres_xxxx & css_xxxx update()"));
		await oracle_instance_CERES_WETH.update({ from: COLLATERAL_CERES_AND_CERESHARES_OWNER });
		await oracle_instance_CERES_USDC.update({ from: COLLATERAL_CERES_AND_CERESHARES_OWNER });
		await oracle_instance_CSS_WETH.update({ from: COLLATERAL_CERES_AND_CERESHARES_OWNER });
		await oracle_instance_CSS_USDC.update({ from: COLLATERAL_CERES_AND_CERESHARES_OWNER });

		// test for the price of ceres for 1 eth;
		console.log(chalk.blue("==== old price ===="));
		let ceres_price_from_CERES_WETH;
		let ceres_price_from_CERES_USDC;
		ceres_price_from_CERES_WETH = (new BigNumber(await oracle_instance_CERES_WETH.consult.call(wethInstance.address, 1e6))).div(BIG6).toNumber();
		console.log("ceres_price_from_CERES_WETH: ", ceres_price_from_CERES_WETH.toString(), " CERES = 1 WETH");
		ceres_price_from_CERES_USDC = (new BigNumber(await oracle_instance_CERES_USDC.consult.call(col_instance_USDC.address, 1e6))).div(BIG18).toNumber();
		console.log("ceres_price_from_CERES_USDC: ", ceres_price_from_CERES_USDC.toString(), " CERES = 1 USDC");

		let css_price_from_CSS_WETH;
		let css_price_from_CSS_USDC;
		css_price_from_CSS_WETH = (new BigNumber(await oracle_instance_CSS_WETH.consult.call(wethInstance.address, 1e6))).div(BIG6).toNumber();
		console.log("css_price_from_CSS_WETH: ", css_price_from_CSS_WETH.toString(), " CSS = 1 WETH");
		css_price_from_CSS_USDC = (new BigNumber(await oracle_instance_CSS_USDC.consult.call(col_instance_USDC.address, 1e6))).div(BIG18).toNumber();
		console.log("css_price_from_CSS_USDC: ", css_price_from_CSS_USDC.toString(), " CSS = 1 USDC");
	});

	// it("test scripts for ceresInstance.ceres_info", async () => {
	// 	console.log(chalk.blue("============ ceresInstance.ceres_info============"));
		

	// 	console.log(chalk.blue('Try ceres_info'));
	// 	let info;
	// 	info = await ceresInstance.ceres_info();
	// 	console.log("oracle_price CERES: ",info[0].toString());
	// 	console.log("oracle_price CSS : ",info[1].toString());
	// 	console.log("totalSupply: ",info[2].toString());
	// 	console.log("global_collateral_ratio: ",info[3].toString());
	// 	console.log("globalCollateralValue: ",info[4].toString());
	// 	console.log("minting_fee: ",info[5].toString());
	// 	console.log("redemption_fee: ",info[6].toString());
	// 	console.log("eth_usd_price: ",info[7].toString());

	// });

	it("test scripts for ceresInstance public variants ", async () => {
		console.log(chalk.red("============ ceresInstance public info ============"));
		console.log(chalk.red("============ ceresInstance public info ============"));
		console.log(chalk.red("============ ceresInstance public info ============"));
		
		global_collateral_ratio = await ceresInstance.global_collateral_ratio.call();
		redemption_fee = await ceresInstance.redemption_fee.call();
		minting_fee = await ceresInstance.minting_fee.call();
		ceres_step = await ceresInstance.ceres_step.call();
		refresh_cooldown = await ceresInstance.refresh_cooldown.call();
		price_target = await ceresInstance.price_target.call();
		price_band = await ceresInstance.price_band.call();

		console.log(chalk.blue("global_collateral_ratio: ",global_collateral_ratio.toString()));
		console.log(chalk.blue("redemption_fee: ",redemption_fee.toString()));
		console.log(chalk.blue("minting_fee: ",minting_fee.toString()));
		console.log(chalk.blue("ceres_step: ",ceres_step.toString()));
		console.log(chalk.blue("refresh_cooldown: ",refresh_cooldown.toString()));
		console.log(chalk.blue("price_target: ",price_target.toString()));
		console.log(chalk.blue("price_band: ",price_band.toString()));

		console.log(chalk.blue("========================= ceresInstantce public admin addresses ==========================="));

		DEFAULT_ADMIN_ADDRESS = await ceresInstance.DEFAULT_ADMIN_ADDRESS.call();
		COLLATERAL_RATIO_PAUSER = await ceresInstance.COLLATERAL_RATIO_PAUSER.call();
		collateral_ratio_paused = await ceresInstance.collateral_ratio_paused.call();

		console.log(chalk.blue("DEFAULT_ADMIN_ADDRESS: ",DEFAULT_ADMIN_ADDRESS.toString()));
		console.log(chalk.blue("COLLATERAL_RATIO_PAUSER: ",COLLATERAL_RATIO_PAUSER.toString()));
		console.log(chalk.blue("collateral_ratio_paused: ",collateral_ratio_paused.toString()));


	});

	it("test scripts for ceresInstance ERC20 info ", async () => {
		console.log(chalk.red("============ ceresInstance ERC20 info ============"));
		console.log(chalk.red("============ ceresInstance ERC20 info ============"));
		console.log(chalk.red("============ ceresInstance ERC20 info ============"));
		
		symbol = await ceresInstance.symbol.call();
		name = await ceresInstance.name.call();
		decimals = await ceresInstance.decimals.call();
		owner_address = await ceresInstance.owner_address.call();
		creator_address = await ceresInstance.creator_address.call();
		timelock_address = await ceresInstance.timelock_address.call();
		controller_address = await ceresInstance.controller_address.call();
		
		css_address = await ceresInstance.css_address.call();
		ceres_eth_oracle_address = await ceresInstance.ceres_eth_oracle_address.call();
		css_eth_oracle_address = await ceresInstance.css_eth_oracle_address.call();
		weth_address = await ceresInstance.weth_address.call();
		eth_usd_consumer_address = await ceresInstance.eth_usd_consumer_address.call();
		genesis_supply = await ceresInstance.genesis_supply.call();

		console.log(chalk.blue("symbol: ",symbol.toString()));
		console.log(chalk.blue("name: ",name.toString()));
		console.log(chalk.blue("decimals: ",decimals.toString()));
		console.log(chalk.blue("owner_address: ",owner_address.toString()));
		console.log(chalk.blue("creator_address: ",creator_address.toString()));
		console.log(chalk.blue("timelock_address: ",timelock_address.toString()));
		console.log(chalk.blue("controller_address: ",controller_address.toString()));
		console.log(chalk.blue("css_address: ",css_address.toString()));

		console.log(chalk.blue("ceres_eth_oracle_address: ",ceres_eth_oracle_address.toString()));
		console.log(chalk.blue("css_eth_oracle_address: ",css_eth_oracle_address.toString()));
		console.log(chalk.blue("weth_address: ",weth_address.toString()));
		console.log(chalk.blue("eth_usd_consumer_address: ",eth_usd_consumer_address.toString()));
		console.log(chalk.blue("genesis_supply: ",genesis_supply.toString()));
		


	});

	it("Mints 1 USDC to 1 CERES test scripts", async () => {
		console.log(chalk.blue("============ mint 1 USDC 1CERES()============"));
		console.log(chalk.blue("============ mint 1 USDC 1CERES()============"));
		console.log(chalk.blue("============ mint 1 USDC 1CERES()============"));
		

		totalSupplyCERES = new BigNumber(await ceresInstance.totalSupply.call()).div(BIG18).toNumber();
		totalSupplyCSS = new BigNumber(await cssInstance.totalSupply.call()).div(BIG18).toNumber();
		console.log("totalSupplyCERES: ",totalSupplyCERES);
		console.log("totalSupplyCSS: ",totalSupplyCSS);

		globalCollateralRatio = new BigNumber(await ceresInstance.global_collateral_ratio.call()).div(BIG6).toNumber();
		globalCollateralValue = new BigNumber(await ceresInstance.globalCollateralValue.call()).div(BIG18).toNumber();
		console.log("globalCollateralRatio: ",globalCollateralRatio);
		console.log("globalCollateralValue: ",globalCollateralValue);

		// const eth_usd_price = await ceresInstance.eth_usd_price.call();
		// console.log("eth_usd_price: ",eth_usd_price.toString());

		
		// const ceres_price = await ceresInstance.ceres_price.call();
		// console.log("ceres_price: ",ceres_price.toString());

		// console.log("CERES price (USD): ", (new BigNumber(await ceresInstance.ceres_price.call()).div(BIG6)).toNumber());
		// console.log("CSS price (USD): ", (new BigNumber(await ceresInstance.css_price.call()).div(BIG6)).toNumber());

	});

});