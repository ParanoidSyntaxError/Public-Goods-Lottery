// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Address} from "@openzeppelin/utils/Address.sol";

import {VRFV2PlusWrapperConsumerBase} from "@chainlink/vrf/dev/VRFV2PlusWrapperConsumerBase.sol";
import {VRFV2PlusClient} from "@chainlink/vrf/dev/libraries/VRFV2PlusClient.sol";

import {IPublicGoodsLottery} from "./IPublicGoodsLottery.sol";

contract PublicGoodsLottery is
    IPublicGoodsLottery,
    VRFV2PlusWrapperConsumerBase
{
    mapping(uint256 => Lottery) private _lotteries;
    uint256 private _totalLotteries;

    // VRF request ID => Lottery ID
    mapping(uint256 => uint256) private _vrfLotteryIds;

    uint256 public constant TICKET_DECIMALS = 15;

    uint32 public constant VRF_CALLBACK_GAS_LIMIT = 100_000;
    uint16 public constant VRF_REQUEST_CONFIRMATIONS = 16;

    uint256 public constant PG_PERCENTAGE = 70_00;
    uint256 public constant WINNERS_PERCENTAGE = 30_00;

    uint256[3] public WINNERS_PERCENTAGES = [60_00, 30_00, 10_00];

    constructor(address vrfWrapper) VRFV2PlusWrapperConsumerBase(vrfWrapper) {}

    function createLottery(
        uint256 expiration,
        address receiver
    ) external override returns (uint256 lotteryId) {
        if (expiration <= block.timestamp) {
            revert InvalidExpiration(expiration);
        }

        lotteryId = _totalLotteries;

        _lotteries[lotteryId].expiration = expiration;
        _lotteries[lotteryId].receiver = receiver;

        _totalLotteries++;
    }

    function buyTicket(
        uint256 lotteryId,
        address receiver
    ) external payable override returns (uint256 ticketId) {
        if (_lotteries[lotteryId].expiration <= block.timestamp) {
            revert LotteryHasEnded(lotteryId);
        }

        uint256 amount = _valueToTickets(msg.value);

        if (amount == 0) {
            revert InsufficientValue(msg.value);
        }

        ticketId = _lotteries[lotteryId].tickets.length;

        _lotteries[lotteryId].totalTickets += amount;
        _lotteries[lotteryId].tickets.push(
            Ticket(receiver, _lotteries[lotteryId].totalTickets)
        );

        emit TicketPurchased(lotteryId, ticketId, receiver, amount);
    }

    function requestEndLottery(uint256 lotteryId) external override {
        if (lotteryId >= _totalLotteries) {
            revert NonexistentLottery(lotteryId);
        }

        if (_lotteries[lotteryId].expiration >= block.timestamp) {
            revert LotteryInProgress(lotteryId);
        }

        if (_lotteries[lotteryId].vrfRequestId != 0) {
            revert LotteryEndAlreadyRequested(
                lotteryId,
                _lotteries[lotteryId].vrfRequestId
            );
        }

        (uint256 vrfRequestId, ) = requestRandomness(
            VRF_CALLBACK_GAS_LIMIT,
            VRF_REQUEST_CONFIRMATIONS,
            uint32(WINNERS_PERCENTAGES.length),
            VRFV2PlusClient._argsToBytes(
                VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
            )
        );

        _lotteries[lotteryId].vrfRequestId = vrfRequestId;
        _vrfLotteryIds[vrfRequestId] = lotteryId;
    }

    function fulfillEndLottery(
        uint256 lotteryId,
        uint256[] memory lowerTicketIds,
        uint256[] memory upperTicketIds
    ) external override {
        if (_lotteries[lotteryId].vrfResponses.length == 0) {
            revert LotteryVRFUnfulfilled(
                lotteryId,
                _lotteries[lotteryId].vrfRequestId
            );
        }

        uint256 lotteryValue = _ticketsToValue(
            _lotteries[lotteryId].totalTickets
        );
        
        (uint256 winnersTotal, uint256[] memory winnersValues) = _winnersValues(
            lotteryValue
        );

        uint256 pgValue = lotteryValue - winnersTotal;

        address[] memory winners = _winnersAddresses(
            lotteryId,
            lowerTicketIds,
            upperTicketIds
        );

        Address.sendValue(
            payable(_lotteries[lotteryId].receiver),
            pgValue
        );

        for (uint256 i = 0; i < winners.length; i++) {
            Address.sendValue(payable(winners[i]), winnersValues[i]);
        }

        emit LotteryEnded(lotteryId, _lotteries[lotteryId].receiver, pgValue, winners, winnersValues);
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        _lotteries[_vrfLotteryIds[_requestId]].vrfResponses = _randomWords;
    }

    function _valueToTickets(uint256 value) private pure returns (uint256) {
        return value / (10 ** TICKET_DECIMALS);
    }

    function _ticketsToValue(uint256 tickets) private pure returns (uint256) {
        return tickets * (10 ** TICKET_DECIMALS);
    }

    function _percentage(
        uint256 amount,
        uint256 bps
    ) private pure returns (uint256) {
        return (amount * bps) / 10_000;
    }

    function _winnersAddresses(
        uint256 lotteryId,
        uint256[] memory lowerTicketIds,
        uint256[] memory upperTicketIds
    ) private view returns (address[] memory addresses) {
        addresses = new address[](WINNERS_PERCENTAGES.length);

        for (uint256 i = 0; i < addresses.length; i++) {
            if (lowerTicketIds[i] > upperTicketIds[i]) {
                revert InvalidTicketIds(lowerTicketIds[i], upperTicketIds[i]);
            }

            uint256 winningTicket = _lotteries[lotteryId].vrfResponses[i] %
                _lotteries[lotteryId].totalTickets;

            if (upperTicketIds[i] == 0) {
                if (
                    winningTicket >=
                    _lotteries[lotteryId].tickets[upperTicketIds[i]].upperBound
                ) {
                    revert InvalidTicketIds(
                        lowerTicketIds[i],
                        upperTicketIds[i]
                    );
                }
            } else {
                if (
                    winningTicket <
                    _lotteries[lotteryId]
                        .tickets[lowerTicketIds[i]]
                        .upperBound ||
                    winningTicket >=
                    _lotteries[lotteryId].tickets[upperTicketIds[i]].upperBound
                ) {
                    revert InvalidTicketIds(
                        lowerTicketIds[i],
                        upperTicketIds[i]
                    );
                }
            }

            addresses[i] = _lotteries[lotteryId]
                .tickets[upperTicketIds[i]]
                .holder;
        }
    }

    function _winnersValues(
        uint256 lotteryValue
    ) private view returns (uint256 total, uint256[] memory values) {
        total = _percentage(lotteryValue, WINNERS_PERCENTAGE);

        values = new uint256[](WINNERS_PERCENTAGES.length);
        for (uint256 i = 0; i < values.length; i++) {
            values[i] = _percentage(total, WINNERS_PERCENTAGES[i]);
        }
    }
}
