<div class="flex flex-col items-center gap-4">
	<p>{browser.i18n.getMessage('options_support_donations')}:</p>

	<Select bind:value={currentCrypto}>
		{#each Object.entries(cryptos) as [crypto, wallet] (crypto)}
			<option value={crypto}>{wallet.label}</option>
		{/each}
	</Select>

	<div class="border border-gray-300 dark:border-none rounded-3xl overflow-hidden" use:qrCode></div>

	<div class="flex flex-col items-center gap-1">
		<p class="font-medium">{currentWallet.label} {browser.i18n.getMessage('options_address')}:</p>
		<p class="font-mono">{currentWallet.address}</p>
		<ButtonCopy text={currentWallet.address} />
	</div>
</div>

<script lang="ts">
import type { Action } from 'svelte/action';
import Select from '~/lib/Select.svelte';
import ButtonCopy from './lib/ButtonCopy.svelte';
import QRCodeStyling, { Options } from 'qr-code-styling';
import { type Crypto, type Wallet, cryptos, makeCryptoURI } from './utils/cryptos';

let qr = $state<QRCodeStyling>();
let currentCrypto = $state<Crypto>('bitcoin');

let currentWallet = $derived<Wallet>(cryptos[currentCrypto]);
let cryptoURI = $derived<string>(makeCryptoURI(currentCrypto));
let options = $derived<Options>({
	width: 290,
	height: 290,
	margin: 6,
	data: cryptoURI,
	image: currentWallet.image,
	imageOptions: {
		hideBackgroundDots: true,
		crossOrigin: 'anonymous',
		margin: 3,
		imageSize: 0.3,
	},
	dotsOptions: { type: 'extra-rounded' },
	cornersSquareOptions: { type: 'extra-rounded' },
});

const qrCode: Action<HTMLDivElement> = node => {
	qr = new QRCodeStyling(options);
	qr.append(node);
};

$effect(() => {
	qr?.update(options);
});
</script>
