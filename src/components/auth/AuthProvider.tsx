"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { getOrUpdateUserProfile } from "@/actions/authActions";
import { useAuthStore } from "@/store/authStore";

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();
    const { setProfile, setIsLoading, clearAuth } = useAuthStore();

    useEffect(() => {
        setIsLoading(true);

        // 인증 상태 변경 리스너 설정
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            setIsLoading(true);
            const currentUser = session?.user ?? null;

            if (currentUser) {
                // 로그인 성공(SIGNED_IN) 또는 토큰 갱신(TOKEN_REFRESHED) 시 프로필 정보 가져오기
                try {
                    // 서버 액션을 호출하여 프로필 정보 가져오기/생성하기
                    const userProfile = await getOrUpdateUserProfile(
                        currentUser
                    );
                    setProfile(userProfile);
                } catch (error) {
                    console.error(
                        "AuthProvider: 프로필 처리 중 오류 발생 (Server Action 호출):",
                        error
                    );
                    setProfile(null); // 오류 발생 시 프로필 초기화
                }
            } else {
                // 로그아웃(SIGNED_OUT) 또는 USER_DELETED 시 프로필 정보 초기화
                setProfile(null);
            }

            setIsLoading(false);
        });

        // 컴포넌트 언마운트 시 리스너 구독 해제
        return () => {
            subscription?.unsubscribe();
        };
    }, [supabase, setProfile, setIsLoading, clearAuth]); // 의존성 배열에 Zustand setter 함수들 추가

    return <>{children}</>;
}
