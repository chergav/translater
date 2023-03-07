import { writeFile } from 'node:fs';
import manifest from '../dist/firefox/manifest.json' assert { type: 'json' };

for (const item of manifest.web_accessible_resources) {
	delete item.use_dynamic_url
}

const data = JSON.stringify(manifest, null, 4);

writeFile('dist/firefox/manifest.json', data, err => {
	if (err) throw err;
});
