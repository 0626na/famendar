"use client";

import { useAuthStore, Profile } from "@/store/authStore"; // Profile 타입을 authStore에서 가져온다고 가정
import { useCalendarStore } from "@/store/calendarStore";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client"; // UserProfile 내에서 로그아웃에 사용
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

// UserProfile 컴포넌트 (로그인 상태일 때 표시)
function UserProfile({ user }: { user: Profile }) {
    // user prop 타입을 Profile로 명시
    const supabase = createClient();
    const { clearAuth } = useAuthStore();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            //TODO: 로그아웃 시에 에러가 발생할 경우, 토스트 알람으로 유저에게 표시하기.
            console.error("로그아웃 중 오류 발생:", error.message);
        } else {
            clearAuth(); // 로그아웃 성공 시 스토어 상태 초기화
            // 로그인 페이지로 리디렉션은 미들웨어가 처리
        }
    };

    // 프로필 이미지가 없을 경우 표시할 이니셜 생성
    const getInitials = (email?: string | null): string => {
        if (!email || email.trim() === "") {
            // 이메일이 없는 경우 기본값 (예: 'P' for Profile)
            return "P";
        }
        return email.substring(0, 2).toUpperCase();
    };

    const avatarUrl = user.avatar_url; // string | null | undefined 일 수 있음
    const userEmailForAlt = user.email || "사용자 프로필"; // alt 텍스트용

    return (
        <div className="flex items-center space-x-3">
            <div className="avatar">
                {/* daisyUI avatar 컨테이너 */}
                <div className="w-8 h-8 rounded-full">
                    {/* 이미지/플레이스홀더 래퍼: 크기 및 모양 */}
                    {avatarUrl ? (
                        <Image
                            src={avatarUrl} // 유효한 URL 문자열이어야 함
                            alt={userEmailForAlt}
                            width={32} // w-8 (32px)에 해당
                            height={32} // h-8 (32px)에 해당
                            className="rounded-full" // 이미지 자체도 둥글게 처리
                        />
                    ) : (
                        // avatar_url이 없을 때 표시할 플레이스홀더
                        <div className="flex items-center justify-center w-full h-full rounded-full bg-neutral-focus text-neutral-content">
                            <span className="text-xs font-medium">
                                {getInitials(user.email)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
            >
                로그아웃
            </button>
        </div>
    );
}

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
