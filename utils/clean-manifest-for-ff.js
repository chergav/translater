import { writeFile } from 'node:fs';
import manifest from '../dist/manifest.json' assert { type: 'json' };

for (const item of manifest.web_accessible_resources) {
	delete item.use_dynamic_url
}

const data = JSON.stringify(manifest, null, 4);

writeFile('dist/manifest.json', data, err => {
	if (err) throw err;
});
