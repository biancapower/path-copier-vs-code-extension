import * as path from 'path';
import Mocha from 'mocha';
import fg from 'fast-glob';

export function run(): Promise<void> {
	const mocha = new Mocha({
			ui: 'tdd',
			color: true,
			timeout: 10000
	});

	const testsRoot = path.resolve(__dirname, '..');

	return new Promise((c, e) => {
		try {
			const files = fg.sync('**/extension.test.js', { cwd: testsRoot });
			files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

			mocha.run((failures: number) => {
				if (failures > 0) {
					e(new Error(`${failures} tests failed.`));
				} else {
					c();
				}
			});
		} catch (err) {
			console.error(err);
			e(err);
		}
	});
}
