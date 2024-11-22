import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

let extensionContext: vscode.ExtensionContext;

suite('Path Copier Extension Test Suite', () => {
    suiteSetup(async function() {
        this.timeout(20000);
        console.log('Starting test suite setup...');

        // Wait for VS Code to fully initialize
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Get all extensions and log them
        const allExtensions = vscode.extensions.all;
        console.log('Available extensions:', allExtensions.map(e => e.id));

        // Try to get the extension
        const extension = vscode.extensions.getExtension('biancapower.path-copier');

        if (!extension) {
            throw new Error('Extension not found. Available extensions: ' +
                allExtensions.map(e => e.id).join(', '));
        }

        if (!extension.isActive) {
            console.log('Activating extension...');
            await extension.activate();
            // Wait for activation to complete
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('Extension setup complete');
    });

    test('Extension should be present', () => {
        const extension = vscode.extensions.getExtension('biancapower.path-copier');
        assert.ok(extension, 'Extension should be registered');
        assert.ok(extension.isActive, 'Extension should be active');
    });

    suite('Command Tests', function() {
        this.timeout(10000); // Increase timeout for async operations
        let workspaceDir: string;
        let testFilePath: string;

        suiteSetup(async () => {
            try {
                // Create temporary test file structure
                workspaceDir = path.join(os.tmpdir(), `path-copier-test-${Date.now()}`);
                const testSpecDir = path.join(workspaceDir, 'test', 'spec');
                fs.mkdirSync(testSpecDir, { recursive: true });

                // Create test file
                testFilePath = path.join(testSpecDir, 'example_spec.rb');
                fs.writeFileSync(testFilePath, '# Test file content');
            } catch (err) {
                console.error('Test setup failed:', err);
                throw err;
            }
        });

        test('Path restriction should work', async () => {
            // Set test configuration
            await vscode.workspace.getConfiguration('pathCopier').update('restrictToPath', 'test/spec', vscode.ConfigurationTarget.Global);

            const document = await vscode.workspace.openTextDocument(testFilePath);
            await vscode.window.showTextDocument(document);

            let errorThrown = false;
            try {
                await vscode.commands.executeCommand('pathCopier.copyPathToTerminal');
            } catch (e) {
                errorThrown = true;
            }

            assert.strictEqual(errorThrown, false, 'Command should execute without error for valid path');
        });

        test('Command prefix should be applied', async () => {
            // Set test configuration
            await vscode.workspace.getConfiguration('pathCopier').update('commandPrefix', 'rspec ', vscode.ConfigurationTarget.Global);

            const document = await vscode.workspace.openTextDocument(testFilePath);
            await vscode.window.showTextDocument(document);

            let errorThrown = false;
            try {
                await vscode.commands.executeCommand('pathCopier.copyPathWithPrefix');
            } catch (e) {
                errorThrown = true;
            }

            assert.strictEqual(errorThrown, false, 'Command should execute without error with prefix');
        });

        suiteTeardown(async () => {
            // Clean up configurations
            await vscode.workspace.getConfiguration('pathCopier').update('restrictToPath', undefined, vscode.ConfigurationTarget.Global);
            await vscode.workspace.getConfiguration('pathCopier').update('commandPrefix', undefined, vscode.ConfigurationTarget.Global);

            // Clean up test files
            try {
                if (workspaceDir && fs.existsSync(workspaceDir)) {
                    fs.rmSync(workspaceDir, { recursive: true, force: true });
                }
            } catch (err) {
                console.error('Cleanup failed:', err);
            }
        });
    });
});
