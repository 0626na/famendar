import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "k.kakaocdn.net",
                port: "",
                pathname: "/**", // 모든 경로 허용
            },
            {
                protocol: "http",
                hostname: "k.kakaocdn.net",
                port: "",
                pathname: "/**", // 모든 경로 허용
            },
        ],
    },
};

export default nextConfig;
