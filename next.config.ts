import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	poweredByHeader: false,
	images: {
		unoptimized: true,
		remotePatterns: [
			{ protocol: "https", hostname: "assets.shngm.id" },
			{ protocol: "https", hostname: "assets.shngm.io" },
		],
	},
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{ key: "X-Powered-By", value: "" },
					{ key: "Server", value: "" },
				],
			},
		];
	},
};

export default nextConfig;
