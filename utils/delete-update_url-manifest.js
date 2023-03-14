import { writeFile } from 'node:fs';
import manifest from '../dist/chrome/manifest.json' assert { type: 'json' };

delete manifest.update_url

const data = JSON.stringify(manifest, null, 4);

writeFile('dist/chrome/manifest.json', data, err => {
	if (err) throw err;
});
