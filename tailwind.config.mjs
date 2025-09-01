const config = {
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {},
	},
	plugins: [
		({ addVariant }) => {
			addVariant("has-disabled", "&:has(:disabled)");
		},
	],
};

export default config;
