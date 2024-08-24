// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface IPublicGoodsLottery {
    error InvalidExpiration(uint256 expiration);

    error InsufficientValue(uint256 value);

    error NonexistentLottery(uint256 lotteryId);
    error LotteryHasEnded(uint256 lotteryId);
    error LotteryInProgress(uint256 lotteryId);

    error LotteryEndAlreadyRequested(uint256 lotteryId, uint256 requestId);
    error LotteryVRFUnfulfilled(uint256 lotteryId, uint256 requestId);

    error InvalidTicketIds(uint256 lowerId, uint256 upperId);

    event LotteryCreated(
        uint256 indexed lotteryId,
        uint256 indexed expiration,
        address indexed receiver
    );

    event TicketPurchased(
        uint256 indexed lotteryId,
        uint256 indexed ticketId,
        address indexed receiver,
        uint256 amount
    );

    event LotteryEnded(
        uint256 indexed lotteryId,
        address indexed pgReceiver,
        uint256 pgValue,
        address[] winners,
        uint256[] winnersValues
    );

    struct Lottery {
        uint256 expiration;
        address receiver;
        Ticket[] tickets;
        uint256 totalTickets;
        uint256 vrfRequestId;
        uint256[] vrfResponses;
    }

    struct Ticket {
        address holder;
        uint256 upperBound;
    }

    function createLottery(
        uint256 expiration,
        address receiver
    ) external returns (uint256 lotteryId);

    function buyTicket(
        uint256 lotteryId,
        address receiver
    ) external payable returns (uint256 ticketId);

    function requestEndLottery(uint256 lotteryId) external;

    function fulfillEndLottery(
        uint256 lotteryId,
        uint256[] memory lowerTicketIds,
        uint256[] memory upperTicketIds
    ) external;
}
