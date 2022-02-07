# SimpleTools

A collection of tools.

## Available Scripts

This is not an exhaustive list of the scripts available, just the important ones. For a full list
look in `package.json`.

| Script             | Description                          |
| ------------------ | ------------------------------------ |
| npm run start      | Launch the development server.       |
| npm run test       | Run the tests/linting with coverage. |
| npm run test:watch | Run the tests in watch mode.         |
| npm run build      | Build the assets.                    |

## Known Issues

The 'indent' rule from eslint or its TS alternative '@typescript-eslint/indent' do not work properly
as of 01/24/2022. Please see for details:
https://github.com/typescript-eslint/typescript-eslint/issues/1824
