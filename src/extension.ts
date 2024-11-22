// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

function isPathAllowed(filePath: string, restrictToPath: string): boolean {
	if (!restrictToPath) {
		return true; // If no restriction is set, allow all paths
	}

	// Normalize paths to use forward slashes and remove trailing slashes
	const normalizedPath = filePath.replace(/\\/g, '/').replace(/\/+$/, '');
	const normalizedRestriction = restrictToPath.replace(/\\/g, '/').replace(/\/+$/, '');

	return normalizedPath.includes(normalizedRestriction);
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "demo" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('demo.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello VS Code!');
	});

	let copyPathCommand = vscode.commands.registerCommand('demo.copyPathToTerminal', () => {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			vscode.window.showErrorMessage('No file is currently open');
			return;
		}

		const config = vscode.workspace.getConfiguration('pathCopier');
		const restrictToPath = config.get<string>('restrictToPath', '');
		const excludePrefix = config.get<string>('excludePrefix', '');
		let filePath = editor.document.uri.fsPath;

		if (!isPathAllowed(filePath, restrictToPath)) {
			vscode.window.showErrorMessage(`This command can only be used on files within: ${restrictToPath}`);
			return;
		}

		// Remove the prefix if it exists at the start of the path
		if (excludePrefix && filePath.startsWith(excludePrefix)) {
			filePath = filePath.substring(excludePrefix.length);
			// Remove leading slash if present
			if (filePath.startsWith('/')) {
				filePath = filePath.substring(1);
			}
		}

		// Get the active terminal or create one
		let terminal = vscode.window.activeTerminal;
		if (!terminal) {
			terminal = vscode.window.createTerminal();
		}

		terminal.show();
		terminal.sendText(filePath, false);
	});

	let copyPathWithPrefixCommand = vscode.commands.registerCommand('demo.copyPathWithPrefix', () => {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			vscode.window.showErrorMessage('No file is currently open');
			return;
		}

		const config = vscode.workspace.getConfiguration('pathCopier');
		const restrictToPath = config.get<string>('restrictToPath', '');
		let filePath = editor.document.uri.fsPath;

		if (!isPathAllowed(filePath, restrictToPath)) {
			vscode.window.showErrorMessage(`This command can only be used on files within: ${restrictToPath}`);
			return;
		}

		// Remove the exclude prefix if it exists
		const excludePrefix = config.get<string>('excludePrefix', '');
		const commandPrefix = config.get<string>('commandPrefix', '');

		// Remove the exclude prefix if it exists
		if (excludePrefix && filePath.startsWith(excludePrefix)) {
			filePath = filePath.substring(excludePrefix.length);
			if (filePath.startsWith('/')) {
				filePath = filePath.substring(1);
			}
		}

		// Construct the full command
		const fullCommand = `${commandPrefix}${filePath}`;

		// Get the active terminal or create one
		let terminal = vscode.window.activeTerminal;
		if (!terminal) {
			terminal = vscode.window.createTerminal();
		}

		terminal.show();
		terminal.sendText(fullCommand, false); // false means don't execute the command
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(copyPathCommand);
	context.subscriptions.push(copyPathWithPrefixCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
