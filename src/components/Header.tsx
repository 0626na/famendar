"use client";

import { useAuthStore } from "@/store/authStore";
import { useCalendarStore } from "@/store/calendarStore";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import UserProfile from "@/components/UserProfile";

export default function Header() {
    const { profile, isLoading: authLoading } = useAuthStore();

    // Calendar Store 사용
    const { displayedDate, goToToday, goToPreviousMonth, goToNextMonth } =
        useCalendarStore();

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
                {/* 로고 */}
                <div className="flex-shrink-0">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl sm:text-2xl font-bold text-blue-600">
                            Famender
                        </span>
                    </Link>
                </div>

                {/* 달력 네비게이션 (로그인 상태일 때만 표시) */}
                {profile && !authLoading && (
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        <button
                            onClick={goToToday}
                            className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            오늘
                        </button>
                        <button
                            onClick={goToPreviousMonth}
                            aria-label="이전 달"
                            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        </button>
                        <button
                            onClick={goToNextMonth}
                            aria-label="다음 달"
                            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        </button>
                        <h2 className="text-sm sm:text-base font-semibold text-gray-700 w-24 sm:w-28 text-center tabular-nums">
                            {displayedDate.getFullYear()}년{" "}
                            {displayedDate.getMonth() + 1}월
                        </h2>
                    </div>
                )}

                {/* 사용자 프로필 또는 로그인 버튼 (AuthStore 사용) */}
                <div className="flex items-center min-w-[100px] justify-end">
                    {" "}
                    {/* 로그인 버튼 영역 너비 확보 */}
                    {authLoading ? (
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    ) : (
                        profile && <UserProfile user={profile} />
                    )}
                </div>
            </div>
        </header>
    );
}
