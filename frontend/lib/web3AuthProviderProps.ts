import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

const pgLotterySepoliaBase = "0x739D1F083f3cE8C11E80bA9A802257dd3238350F";

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x14a34",
    rpcTarget: "https://sepolia.base.org	",
    displayName: "Base",
    blockExplorerUrl: "https://sepolia.basescan.org/",
    ticker: "ETH",
    tickerName: "Base",
    logo: "https://raw.githubusercontent.com/base-org/brand-kit/main/logo/symbol/Base_Symbol_Blue.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig: chainConfig },
});

export const web3AuthOptions: Web3AuthOptions = {
    clientId: "BDhOEfaMgfaibgbZIAUB78QRULCzjuDZpYu1v_gW8liPrfqgfbaBUvdDHbF-5Sgf0R6F3b7raVfHTv6PMtCF4QI",
    web3AuthNetwork: WEB3AUTH_NETWORK.MAINNET,
    privateKeyProvider: privateKeyProvider
};

export const web3Auth = new Web3Auth(web3AuthOptions);