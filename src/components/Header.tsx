"use client";

import Image from "next/image";
import Link from "next/link";
import LoginButton from "./auth/LoginButton";
import { useAuthStore } from "@/store/authStore";

export default function Header() {
    const { profile, isLoading } = useAuthStore();

    return (
        <header className="bg-gray-800 text-white p-4">
            <nav className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                    Famender
                </Link>

                <div>
                    {isLoading ? (
                        <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse" />
                    ) : profile ? (
                        <div className="w-10 h-10 rounded-full relative overflow-hidden">
                            {profile.avatar_url ? (
                                <Image
                                    src={profile.avatar_url}
                                    alt={profile.name}
                                    fill
                                    className="object-cover cursor-pointer "
                                    // TODO: 클릭 시 드롭다운 메뉴 (프로필, 설정, 로그아웃 등)
                                />
                            ) : (
                                <div
                                    className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold cursor-pointer"
                                    // TODO: 클릭 시 드롭다운 메뉴
                                >
                                    {profile.name}
                                </div>
                            )}
                        </div>
                    ) : (
                        <LoginButton />
                    )}
                </div>
            </nav>
        </header>
    );
}
