<div class="p-3 flex gap-2">
	<div>
		<a
			class="text-sm text-blue-600 hover:underline"
			href="https://github.com/chergav/translater"
			rel="noopener noreferrer"
			target="_blank"
		>
			Translater
		</a>
	</div>
	<div>
		<a
			class="text-sm text-blue-600 hover:underline"
			href="https://github.com/chergav/translater/releases"
			rel="noopener noreferrer"
			target="_blank"
		>
			{getMessage('app_version')} {version}
		</a>
	</div>
</div>

<script>
import { getMessage } from '~/common/browserApi';

const version = chrome.runtime.getManifest().version;
</script>
