
<button onclick={loginWithGoogle} type="button">login</button>

<script lang="ts">
// interface AuthTokens {
// 	accessToken: string;
// 	refreshToken: string;
// 	expiresAt: number;
// }

// async function loginWithGoogle(): Promise<AuthTokens> {
async function loginWithGoogle() {
	const redirectUri = browser.identity.getRedirectURL();
	console.log('redirectUri', redirectUri);
	console.log('GOOGLE_CLIENT_ID', import.meta.env.VITE_GOOGLE_CLIENT_ID);
	console.log('extension ID:', browser.runtime.id);

	const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth'); // new
	// const authUrl = new URL('https://accounts.google.com/o/oauth2/auth');
	authUrl.searchParams.set('client_id', import.meta.env.VITE_GOOGLE_CLIENT_ID);
	authUrl.searchParams.set('response_type', 'code'); // ← CODE, не token!
	// authUrl.searchParams.set('response_type', 'token');
	authUrl.searchParams.set('redirect_uri', redirectUri);
	authUrl.searchParams.set('scope', 'openid profile email');
	// authUrl.searchParams.set('access_type', 'online');
	authUrl.searchParams.set('access_type', 'offline'); // ← получить refresh token!
	// authUrl.searchParams.set('prompt', 'consent'); // force consent to get refresh token
	authUrl.searchParams.set('prompt', 'select_account');
	// authUrl.searchParams.set('display', 'popup');

	console.log('authUrl', authUrl.search);

	// Show popup
	const responseUrl = await browser.identity.launchWebAuthFlow({
		url: authUrl.toString(),
		interactive: true,
	});

	if (!responseUrl) return;

	console.log('responseUrl', responseUrl);

	// Extract authorization code
	// const params = new URLSearchParams(responseUrl.split('?')[1]);
	// const params = new URLSearchParams(responseUrl.split('#')[1]);
	// const code = params.get('code');
	// const accessToken = params.get('access_token');
	// console.log('params', params.toString());
	// console.log('code', code);
	// console.log('accessToken', accessToken);

	const url = new URL(responseUrl);
	const code = url.searchParams.get('code');

	if (!code) {
		throw new Error('No code in response');
	}

	// Send to your server
	const response = await fetch('http://localhost:8080/api/auth/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ code	}),
	});

	const data = await response.json();
	console.log('data', data);
}
</script>
