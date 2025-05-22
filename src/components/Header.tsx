"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

export default function Header() {
    const { profile, isLoading } = useAuthStore();

    return (
        <header className="bg-gray-800 text-white p-4">
            <nav className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                    Famender
                </Link>

                {profile && (
                    <div>
                        {isLoading ? (
                            <div className="size-10 bg-gray-700 rounded-full animate-pulse" />
                        ) : profile?.avatar_url ? (
                            <div className="size-10 avatar">
                                <Image
                                    src={profile.avatar_url}
                                    alt={profile.name}
                                    fill
                                    className="object-cover cursor-pointer rounded-full"
                                    // TODO: 클릭 시 드롭다운 메뉴 (프로필, 설정, 로그아웃 등)
                                />
                            </div>
                        ) : (
                            <div className="size-10 avatar avatar-placeholder">
                                <div className="h-full w-full bg-gray-700 text-white rounded-full">
                                    {profile?.name?.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
}
