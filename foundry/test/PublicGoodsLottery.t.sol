// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";

import {PublicGoodsLottery} from "src/PublicGoodsLottery.sol";

contract TestPublicGoodsLottery is Test {
    PublicGoodsLottery public pgLottery;

    function setUp() public {
        pgLottery = new PublicGoodsLottery(address(1));
    }

    function testCreateLottery() public {
        uint256 expiration = block.timestamp + vm.randomUint() + 1;
        address pgReceiver = makeAddr("LotteryReceiver");

        pgLottery.createLottery("Test name", "Test description", expiration, pgReceiver);
    }

    function testRequestEndLottery() public {
        uint256 duration = vm.randomUint() + 1;
        uint256 expiration = block.timestamp + duration;
        address pgReceiver = makeAddr("LotteryReceiver");

        uint256 lotteryId = pgLottery.createLottery("Test name", "Test description", expiration, pgReceiver);

        skip(duration * 2);

        pgLottery.requestEndLottery(lotteryId);
    }
}