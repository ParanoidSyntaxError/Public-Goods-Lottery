// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {VRFV2PlusWrapperConsumerBase} from "@chainlink/vrf/dev/VRFV2PlusWrapperConsumerBase.sol";
import {VRFV2PlusClient} from "@chainlink/vrf/dev/libraries/VRFV2PlusClient.sol";

contract PgLottery is VRFV2PlusWrapperConsumerBase {
    event TicketsPurchased(uint256 indexed lotteryId, address indexed receiver, uint256 amount);

    struct Lottery {
        uint256 expiration;
        Ticket[] tickets;
        uint256 totalTickets;
        uint256 vrfRequestId;
        uint256 vrfResponse;
        bool vrfFulfilled;
    }

    struct Ticket {
        address owner;
        uint256 upperBound;
    }

    mapping(uint256 => Lottery) private _lotteries;
    uint256 private _totalLotteries;

    // VRF request ID => Lottery ID
    mapping(uint256 => uint256) private _vrfLotteryIds;

    uint256 public constant TICKET_DECIMALS = 15;

    uint32 public constant VRF_CALLBACK_GAS_LIMIT = 100000;
    uint16 public constant VRF_REQUEST_CONFIRMATIONS = 16;

    constructor(address vrfWrapper) VRFV2PlusWrapperConsumerBase(vrfWrapper) {}

    function createLottery(
        uint256 expiration
    ) external returns (uint256 lotteryId) {
        if (expiration <= block.timestamp) {
            revert("Expiration must be greater than block.timestamp!");
        }

        lotteryId = _totalLotteries;

        _lotteries[lotteryId].expiration = expiration;

        _totalLotteries++;
    }

    function buyTicket(uint256 lotteryId, address receiver) external payable {
        if (_lotteries[lotteryId].expiration <= block.timestamp) {
            revert("This lottery has ended!");
        }

        if (receiver == address(0)) {
            revert("Receiver cannot be the zero address!");
        }

        uint256 amount = _valueToTickets(msg.value);

        if(amount == 0) {
            revert("Insufficient msg.value!");
        }

        _lotteries[lotteryId].totalTickets += amount;
        _lotteries[lotteryId].tickets.push(
            Ticket(receiver, _lotteries[lotteryId].totalTickets)
        );

        emit TicketsPurchased(lotteryId, receiver, amount);
    }

    function requestEndLottery(uint256 lotteryId) external {
        if (lotteryId >= _totalLotteries) {
            revert("Lottery does not exist!");
        }

        if (_lotteries[lotteryId].expiration >= block.timestamp) {
            revert("This lottery has not ended!");
        }

        if (_lotteries[lotteryId].vrfRequestId != 0) {
            revert("Lottery end has already been requested!");
        }

        (uint256 requestId, ) = requestRandomness(
            VRF_CALLBACK_GAS_LIMIT,
            VRF_REQUEST_CONFIRMATIONS,
            1,
            VRFV2PlusClient._argsToBytes(
                VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
            )
        );

        _lotteries[lotteryId].vrfRequestId = requestId;
        _vrfLotteryIds[requestId] = lotteryId;
    }

    function fulfillEndLottery(uint256 lotteryId, uint256 lowerTicketId, uint256 upperTicketId) external {
        if (!_lotteries[lotteryId].vrfFulfilled) {
            revert("Lottery VRF request has not been fulfilled!");
        }
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        _lotteries[_vrfLotteryIds[_requestId]].vrfResponse = _randomWords[0];
        _lotteries[_vrfLotteryIds[_requestId]].vrfFulfilled = true;
    }

    function _valueToTickets(uint256 value) private pure returns (uint256) {
        return value / (10 ** TICKET_DECIMALS);
    }
}
