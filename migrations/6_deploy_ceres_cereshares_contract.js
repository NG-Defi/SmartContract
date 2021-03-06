const path = require('path');
const envPath = path.join(__dirname, '../../.env');
require('dotenv').config({ path: envPath });
const BigNumber = require('bignumber.js');

const { expectEvent, send, shouldFail, time, constants } = require('@openzeppelin/test-helpers');
const BIG6 = new BigNumber("1e6");
const BIG18 = new BigNumber("1e18");
const chalk = require('chalk');

const Timelock = artifacts.require("Governance/Timelock");
const MigrationHelper = artifacts.require("Utils/MigrationHelper");
const CEREStable = artifacts.require("Ceres/CEREStable");
const CEREShares = artifacts.require("CSS/CEREShares");

const GovernorAlpha = artifacts.require("Governance/GovernorAlpha");

module.exports = async function(deployer, network, accounts) {
	// Set the Network Settings
	const IS_MAINNET = (network == 'mainnet');
	const IS_ROPSTEN = (network == 'ropsten');
	const IS_DEV = (network == 'development');
	const IS_GANACHE = (network == 'devganache');
    const IS_BSC_TESTNET = (network == 'testnet');
	const IS_RINKEBY = (network == 'rinkeby');

	// set the deploy address
	const ADMIN = accounts[0];
	const COLLATERAL_CERES_AND_CERESHARES_OWNER = accounts[1];
	const OWNER = accounts[1];
	const account0 = accounts[0];
	const account1 = accounts[1];
	const account2 = accounts[2];
	const account3 = accounts[3];

	// Deploy Timelock & MigrationHelp 
	const TIMELOCK_DELAY = 300 // 5 minutes in test phrase
	await deployer.deploy(Timelock, ADMIN, TIMELOCK_DELAY,{from: OWNER});
	await deployer.deploy(MigrationHelper, ADMIN,{from: OWNER});
	const timelockInstance = await Timelock.deployed();
	console.log(chalk.red(`timelockInstance: ${timelockInstance.address}`));
	const migrationHelperInstance = await MigrationHelper.deployed();
	
	// For Test USE 
	if (IS_DEV || IS_BSC_TESTNET || IS_ROPSTEN || IS_GANACHE) {
		const TimelockTest = artifacts.require("Governance/TimelockTest");
		await deployer.deploy(TimelockTest,ADMIN,TIMELOCK_DELAY);
	}

	// CERES DEPLOYMENT
	await deployer.deploy(CEREStable, "CERES", "CERES", COLLATERAL_CERES_AND_CERESHARES_OWNER, timelockInstance.address);
	const ceresInstance = await CEREStable.deployed();
	// CSS DEPLOYMENT
	await deployer.deploy(CEREShares, "CERES Share", "CSS", COLLATERAL_CERES_AND_CERESHARES_OWNER, COLLATERAL_CERES_AND_CERESHARES_OWNER, timelockInstance.address);
	const cssInstance = await CEREShares.deployed();

	// ======== Deploy the governance contract and its associated timelock ========
	await deployer.deploy(GovernorAlpha, timelockInstance.address, ceresInstance.address, OWNER);
	const governanceInstance = await GovernorAlpha.deployed();
	await governanceInstance.__setTimelockAddress(timelockInstance.address, { from: OWNER });
}
