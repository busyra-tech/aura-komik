import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	poweredByHeader: false,
	images: {
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
