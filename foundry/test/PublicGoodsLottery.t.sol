// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";

import {PublicGoodsLottery} from "src/PublicGoodsLottery.sol";

contract TestPublicGoodsLottery is Test {
    PublicGoodsLottery public pgLottery;

    function setUp() public {
        pgLottery = new PublicGoodsLottery(address(10));
    }

    function testCreateLottery() public {
        uint256 expiration = block.timestamp + vm.randomUint() + 1;
        address pgReceiver = makeAddr("LotteryReceiver");

        pgLottery.createLottery(expiration, pgReceiver);
    }
}