import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
    try {
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');
        const extensionTestsPath = path.resolve(__dirname, './suite/index');
        const testWorkspace = path.resolve(__dirname, '../../test-workspace');
        const vscodeVersion = process.env.VSCODE_VERSION || '1.95.3';

        console.log('Running tests with VS Code version:', vscodeVersion);
        console.log('Extension path:', extensionDevelopmentPath);

        await runTests({
            version: vscodeVersion,
            extensionDevelopmentPath,
            extensionTestsPath,
            launchArgs: [
                testWorkspace,
                '--disable-workspace-trust',
                '--disable-extensions',
                '--enable-proposed-api=biancapower.path-copier'
            ]
        });
    } catch (err) {
        console.error('Failed to run tests:', err);
        process.exit(1);
    }
}

main();
