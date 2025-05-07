import bitcoinIcon from '/customIcons/bitcoin.png';
import ethereumIcon from '/customIcons/ethereum.png';
import tonIcon from '/customIcons/ton.png';
import usdtIcon from '/customIcons/tether.png';

export type Crypto = 'bitcoin' | 'ethereum' | 'ton' | 'usdt-erc20' | 'usdt-tron' | 'usdt-ton';

export interface Wallet {
	label: string
	address: string
	image: string
}

export const cryptos: Record<Crypto, Wallet> = {
	bitcoin: {
		label: 'Bitcoin (BTC)',
		address: '164b2eVpUtNphJ5YkYeF3XAqJoUZpTFXkx',
		image: bitcoinIcon,
	},
	ethereum: {
		label: 'Ethereum (ETH)',
		address: '0x049104fDb01B09Fef911d42CBfFF7Aa68FcC4BB0',
		image: ethereumIcon,
	},
	ton: {
		label: 'Toncoin (TON)',
		address: 'UQAN6guklm9-sg7P8yX6JKHWOUU1ZYETXeAjxCAtzk6ifsHg',
		image: tonIcon,
	},
	'usdt-erc20': {
		label: 'USDT (Ethereum – ERC20)',
		address: '0x049104fDb01B09Fef911d42CBfFF7Aa68FcC4BB0',
		image: usdtIcon,
	},
	'usdt-tron': {
		label: 'USDT (Tron – TRC20)',
		address: 'TNLoGpCgsoXZVNGFhzZX7UMX13oPQi9L8U',
		image: usdtIcon,
	},
	'usdt-ton': {
		label: 'USDT (TON – TIP-3)',
		address: 'UQAN6guklm9-sg7P8yX6JKHWOUU1ZYETXeAjxCAtzk6ifsHg',
		image: usdtIcon,
	},
};

export function makeCryptoURI(crypto: Crypto): string {
	const { address } = cryptos[crypto];
	const comment = 'Thanks for Translator';
	const usdtTonJettonMaster = 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs';
	const usdtErc20Contract = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
	let uri: string;

	switch (crypto) {
		case 'bitcoin':
			uri = `bitcoin:${address}?message=${encodeURIComponent(comment)}`;
			break;
		case 'ethereum':
			uri = `ethereum:${address}`;
			break;
		case 'usdt-erc20':
			uri = `ethereum:${usdtErc20Contract}@1/transfer?address=${address}`;
			break;
		case 'usdt-tron':
			uri = address;
			break;
		case 'ton':
			uri = `ton://transfer/${address}?text=${encodeURIComponent(comment)}`;
			break;
		case 'usdt-ton':
			uri = `ton://transfer/${address}?jetton=${usdtTonJettonMaster}&text=${encodeURIComponent(comment)}`;
			break;
		default:
			throw new Error(`Unsupported crypto: ${crypto}`);
	}

	return uri;
}
