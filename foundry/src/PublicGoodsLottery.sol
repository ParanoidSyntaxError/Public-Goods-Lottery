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

    uint32 public constant VRF_CALLBACK_GAS_LIMIT = 1_000_000;
    uint16 public constant VRF_REQUEST_CONFIRMATIONS = 16;

    uint256 public constant PG_PERCENTAGE = 70_00;
    uint256 public constant WINNERS_PERCENTAGE = 30_00;

    uint256[3] public WINNERS_PERCENTAGES = [60_00, 30_00, 10_00];

    constructor(address vrfWrapper) VRFV2PlusWrapperConsumerBase(vrfWrapper) {}

    function lottery(
        uint256 lotteryId
    )
        external
        view
        override
        returns (uint256, address, uint256, uint256, uint256[] memory)
    {
        return (
            _lotteries[lotteryId].expiration,
            _lotteries[lotteryId].receiver,
            _lotteries[lotteryId].totalTickets,
            _lotteries[lotteryId].vrfRequestId,
            _lotteries[lotteryId].vrfResponses
        );
    }

    function totalLotteries() external view override returns (uint256) {
        return _totalLotteries;
    }

    function onTokenTransfer(
        address /* sender */,
        uint256 /* amount */,
        bytes calldata data
    ) external override {
        if (msg.sender != address(getLinkToken())) {
            revert InvalidOnTokenTransferMsgSender(msg.sender);
        }

        uint256 lotteryId = abi.decode(data, (uint256));

        requestEndLottery(lotteryId);
    }

    function createLottery(
        string memory name,
        string memory description,
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

        emit LotteryCreated(lotteryId, name, description, expiration, receiver);
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

        emit TicketPurchased(lotteryId, ticketId, receiver, amount, msg.value);
    }

    function requestEndLottery(uint256 lotteryId) public override {
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

        bytes memory extraArgs = VRFV2PlusClient._argsToBytes(
            VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
        );

        (uint256 vrfRequestId, ) = requestRandomness(
            VRF_CALLBACK_GAS_LIMIT,
            VRF_REQUEST_CONFIRMATIONS,
            uint32(WINNERS_PERCENTAGES.length),
            extraArgs
        );

        _lotteries[lotteryId].vrfRequestId = vrfRequestId;
        _vrfLotteryIds[vrfRequestId] = lotteryId;

        emit LotteryEndRequested(lotteryId, vrfRequestId);
    }

    function fulfillEndLottery(
        uint256 lotteryId,
        uint256[] memory ticketIds
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

        address[] memory winners = _winnersAddresses(lotteryId, ticketIds);

        Address.sendValue(payable(_lotteries[lotteryId].receiver), pgValue);

        for (uint256 i = 0; i < winners.length; i++) {
            Address.sendValue(payable(winners[i]), winnersValues[i]);
        }

        emit LotteryEnded(lotteryId, winners, winnersValues);
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
        uint256[] memory ticketIds
    ) private view returns (address[] memory addresses) {
        addresses = new address[](WINNERS_PERCENTAGES.length);

        for (uint256 i = 0; i < addresses.length; i++) {
            uint256 winningTicket = _lotteries[lotteryId].vrfResponses[i] %
                _lotteries[lotteryId].totalTickets;

            if (ticketIds[i] == 0) {
                if (winningTicket >= _lotteries[lotteryId].tickets[ticketIds[i]].upperBound) {
                    revert InvalidTicketId(ticketIds[i]);
                }
            } else {
                if (winningTicket >= _lotteries[lotteryId].tickets[ticketIds[i]].upperBound || 
                    winningTicket < _lotteries[lotteryId].tickets[ticketIds[i] - 1].upperBound) {
                    revert InvalidTicketId(ticketIds[i]);
                }
            }

            addresses[i] = _lotteries[lotteryId].tickets[ticketIds[i]].holder;
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
