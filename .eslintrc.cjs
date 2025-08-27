module.exports = {
	root: true,
	extends: ['expo', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	plugins: ['@typescript-eslint'],
	parser: '@typescript-eslint/parser',
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			rules: {
				'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			},
		},
	],
};


