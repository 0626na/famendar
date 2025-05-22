"use client";

import LoginButton from "@/components/auth/LoginButton";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="h-full flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 sm:p-12 rounded-xl shadow-2xl w-full max-w-md">
                {/* 앱 로고 또는 이름 */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-blue-600">
                        <Link
                            href="/"
                            className="hover:text-blue-700 transition-colors"
                        >
                            Famender
                        </Link>
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm sm:text-base">
                        가족/친구의 일정을 한눈에, 쉽게 공유하세요.
                    </p>
                    <p className="text-gray-500 mt-1 text-xs sm:text-sm">
                        계속하려면 카카오 계정으로 로그인해주세요.
                    </p>
                </div>
                {/* 로그인 버튼 */}
                <div className="flex justify-center">
                    <LoginButton />
                </div>
            </div>
        </div>
    );
}
