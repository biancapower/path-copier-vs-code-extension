# Path Copier

A VS Code extension for copying file paths to the terminal with optional command prefixes and path restrictions.

## Features

This extension provides two commands:
- **Copy filepath to terminal**: Copies the current file's path to the terminal
- **Copy filepath to terminal with command prefix**: Copies the path with a configurable command prefix

Example use cases:
- Running tests for specific files
- Executing commands that need file paths
- Working with path-dependent CLI tools

## Extension Settings

This extension contributes the following settings:

* `pathCopier.excludePrefix`: Path prefix to exclude when copying filepath (e.g., '/Users/name/project/')
* `pathCopier.commandPrefix`: Command to prefix before the filepath (e.g., 'rails test:rspec spec=')
* `pathCopier.restrictToPath`: Only allow commands to run on files within this path (e.g., '/test/spec/')

## Examples

If you have a file at `/Users/name/project/test/spec/models/user_spec.rb` and configure:

```json
{
"pathCopier.excludePrefix": "/Users/name/project/test/spec",
"pathCopier.commandPrefix": "rails test:rspec spec=",
"pathCopier.restrictToPath": "/test/spec/"
}
```


Using "Copy filepath to terminal with command prefix" will output:

```sh
rails test:rspec spec=models/user_spec.rb
```


## Release Notes

### 0.0.1

Initial release of Path Copier:
- Basic file path copying
- Command prefix support
- Path restriction capability
- Path prefix exclusion
