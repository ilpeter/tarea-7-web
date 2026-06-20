export interface CryptoMarket {
	id: string;
	symbol: string;
	name: string;
	image: string;
	market_cap_rank: number;
	current_price: number;
}

const COINGECKO_MARKETS_URL = 'https://api.coingecko.com/api/v3/coins/markets';

/** Datos de respaldo si CoinGecko limita la tasa en build time */
const FALLBACK_CRYPTOS: CryptoMarket[] = [
	{
		id: 'bitcoin',
		name: 'Bitcoin',
		symbol: 'btc',
		image:
			'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400',
		market_cap_rank: 1,
		current_price: 0,
	},
	{
		id: 'ethereum',
		name: 'Ethereum',
		symbol: 'eth',
		image:
			'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1696501628',
		market_cap_rank: 2,
		current_price: 0,
	},
	{
		id: 'tether',
		name: 'Tether',
		symbol: 'usdt',
		image:
			'https://coin-images.coingecko.com/coins/images/325/large/Tether.png?1696501661',
		market_cap_rank: 3,
		current_price: 0,
	},
	{
		id: 'binancecoin',
		name: 'BNB',
		symbol: 'bnb',
		image:
			'https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1696501970',
		market_cap_rank: 4,
		current_price: 0,
	},
	{
		id: 'solana',
		name: 'Solana',
		symbol: 'sol',
		image:
			'https://coin-images.coingecko.com/coins/images/4128/large/solana.png?1718769756',
		market_cap_rank: 5,
		current_price: 0,
	},
	{
		id: 'ripple',
		name: 'XRP',
		symbol: 'xrp',
		image:
			'https://coin-images.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1696501442',
		market_cap_rank: 6,
		current_price: 0,
	},
];

export async function fetchTopCryptos(limit = 15): Promise<CryptoMarket[]> {
	const url = new URL(COINGECKO_MARKETS_URL);
	url.searchParams.set('vs_currency', 'usd');
	url.searchParams.set('order', 'market_cap_desc');
	url.searchParams.set('per_page', String(limit));
	url.searchParams.set('page', '1');
	url.searchParams.set('sparkline', 'false');

	const response = await fetch(url);

	if (response.status === 429) {
		console.warn(
			'[CoinGecko] Rate limit alcanzado — usando lista de respaldo para el build.',
		);
		return FALLBACK_CRYPTOS.slice(0, limit);
	}

	if (!response.ok) {
		throw new Error(`CoinGecko respondió con status ${response.status}`);
	}

	return response.json();
}
