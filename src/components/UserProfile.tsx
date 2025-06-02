import { Profile, useAuthStore } from "@/store/authStore";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

// UserProfile 컴포넌트 (로그인 상태일 때 표시)
export default function UserProfile({ user }: { user: Profile }) {
    const supabase = createClient();
    const { clearAuth } = useAuthStore();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            //TODO: 로그아웃 시에 에러가 발생할 경우, 토스트 알람으로 유저에게 표시하기.
            console.error("로그아웃 중 오류 발생:", error.message);
        } else {
            clearAuth();
            // 로그인 페이지로 리디렉션은 미들웨어가 처리
        }
    };

    // 프로필 이미지가 없을 경우 표시할 이니셜 생성
    const getInitials = (email?: string | null): string => {
        if (!email || email.trim() === "") {
            // 이메일이 없는 경우 기본값 (예: 'P' for Profile)
            return "P";
        }
        return email.substring(0, Math.min(email.length, 2)).toUpperCase();
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
