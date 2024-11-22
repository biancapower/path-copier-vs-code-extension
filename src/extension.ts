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

function getProcessedFilePath(editor: vscode.TextEditor | undefined): string | undefined {
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
		if (filePath.startsWith('/')) {
			filePath = filePath.substring(1);
		}
	}

	return filePath;
}

function getOrCreateTerminal(): vscode.Terminal {
	return vscode.window.activeTerminal || vscode.window.createTerminal();
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Path Copier extension is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let copyPathCommand = vscode.commands.registerCommand('pathCopier.copyPathToTerminal', () => {
		const filePath = getProcessedFilePath(vscode.window.activeTextEditor);
		if (!filePath) {return;}

		const terminal = getOrCreateTerminal();
		terminal.show();
		terminal.sendText(filePath, false);
	});

	let copyPathWithPrefixCommand = vscode.commands.registerCommand('pathCopier.copyPathWithPrefix', () => {
		const filePath = getProcessedFilePath(vscode.window.activeTextEditor);
		if (!filePath) {return;}

		const commandPrefix = vscode.workspace.getConfiguration('pathCopier').get<string>('commandPrefix', '');
		const fullCommand = `${commandPrefix}${filePath}`;

		const terminal = getOrCreateTerminal();
		terminal.show();
		terminal.sendText(fullCommand, false);
	});

	context.subscriptions.push(copyPathCommand);
	context.subscriptions.push(copyPathWithPrefixCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
