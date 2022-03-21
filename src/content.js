(async () => {
	'use strict';

	const storage = chrome.storage.sync;

	const handleTranlater = async e => {
		await waitTime(10);

		const selection = window.getSelection().toString();

		const isLeftClick = e.button === 0;
		if (!isLeftClick) return;

		const inCodeElement = e.target.tagName === 'CODE' || e.target.closest('code');
		if (inCodeElement) return;

		const isInThisElement =
			document.querySelector('#trlr-contaner') &&
			document.querySelector('#trlr-contaner').contains(e.target);
		if (isInThisElement) return;

		removeTranslateContaner();

		if (selection.length < 2) return;

		const sourseLang = await detectLanguage(selection);
		if (sourseLang && sourseLang === targetLang) return;

		const translate = await translateObjToTpl(selection);
		if (!translate) return;

		document.body.insertAdjacentHTML(
			'beforeend',
			`<div id="trlr-contaner" class="${theme}"></div>`
		);

		showTranslateContaner(translate, getSelectedRect());
	};

	let { settings: { targetLang, theme }} = await storage.get('settings');
	const { languages } = await storage.get('languages');

	const waitTime = time => new Promise(resolve => setTimeout(() => resolve(), time));

	const detectLanguage = text =>
		chrome.i18n
			.detectLanguage(text)
			.then(response => (response.isReliable ? response.languages[0].language : false))
			.catch(error => console.log(error));

	const removeTranslateContaner = () => {
		const elem = document.querySelector('#trlr-contaner');
		if (!elem) return;
		elem.remove();
	};

	const showTranslateContaner = (translate, selectionRect) => {
		let trlrc = document.querySelector('#trlr-contaner');
		trlrc.innerHTML = translate;
		const { width, height } = trlrc.getBoundingClientRect(); //self width
		let left = selectionRect.left + selectionRect.width / 2 - width / 2;
		let top = pageYOffset + selectionRect.bottom + 8;
		if (left < 0) left = 8;
		if (left + width > innerWidth) left = innerWidth - width - 8;
		if (selectionRect.top + 8 + height > innerHeight)
			top = pageYOffset + innerHeight - height - 8;
		trlrc.style.left = `${left}px`;
		trlrc.style.top = `${top}px`;
		trlrc.style.visibility = 'visible';
	};

	const translateObjToTpl = async text => {
		const tr = await getTranslate(text);
		let dict = '';
		if (tr.src === targetLang) return false;
		if (tr.dict) {
			dict = `
				<table>
					${tr.dict.reduce(
						(a, v) =>
							(a += `
							<tr>
								<td class="trlr-td no-wrap">${v.pos}:&nbsp;</td>
								<td class="trlr-td">${v.terms.join(', ')}</td>
							</tr>`),
						''
					)}
				</table>
			`;
		}
		return `
			<p class="trlr-par lang">${languages[tr.src] || tr.src}</p>
			<p class="trlr-par orig">${tr.sentences.reduce((a, v) => (a += v.orig), '')}</p>
			<p class="trlr-par orig">${tr.sentences.reduce((a, v) => (a += v.trans), '')}</p>
			${dict}
		`;
	};

	const getTranslate = async text => {
		const url = `
			https://translate.googleapis.com/translate_a/single?client=gtx
			&sl=auto&tl=${targetLang}&dt=t&dt=bd&dj=1&q=${encodeURIComponent(text)}
		`;
		return (await fetch(url)).json();
	};

	const getSelectedRect = () => {
		const element = document.activeElement;
		const isInTextField = element.tagName === 'INPUT' || element.tagName === 'TEXTAREA';
		return isInTextField
			? element.getBoundingClientRect()
			: window.getSelection().getRangeAt(0).getBoundingClientRect();
	};

	chrome.storage.onChanged.addListener(i => ({ targetLang, theme } = i.settings.newValue));

	document.addEventListener('mouseup', handleTranlater);
})();
