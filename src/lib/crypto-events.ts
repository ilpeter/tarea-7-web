export const CRYPTO_CHANGED_EVENT = 'crypto-changed';

export interface CryptoSelectionItem {
	id: string;
	name: string;
	symbol: string;
	image: string;
}

export function dispatchCryptoChanged(detail: CryptoSelectionItem[]) {
	window.dispatchEvent(new CustomEvent(CRYPTO_CHANGED_EVENT, { detail }));
}
