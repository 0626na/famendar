"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        const supabase = createClient();

        // Supabase 클라이언트 SDK는 URL의 해시(#) 부분에서 세션 정보를 자동으로 처리합니다.
        // onAuthStateChange 리스너를 통해 세션이 성공적으로 설정되었는지 확인합니다.
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            // OAuth 로그인 후 'SIGNED_IN' 이벤트와 함께 세션이 감지되면
            // 사용자를 홈페이지 또는 원하는 다른 페이지로 리디렉션합니다.
            if (
                session &&
                (event === "SIGNED_IN" || event === "INITIAL_SESSION")
            ) {
                // OAuth 로그인 성공 또는 페이지 로드 시 세션 존재
                subscription.unsubscribe();
                router.replace("/"); // 홈페이지로 리디렉션
            } else if (
                event === "SIGNED_OUT" ||
                (event === "INITIAL_SESSION" && !session)
            ) {
                // 로그아웃 또는 세션 없는 초기 상태
                subscription.unsubscribe();
                router.replace("/login"); // 로그인 페이지로 리디렉션
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <p className="text-lg font-semibold">로그인 처리 중입니다...</p>
            <p className="text-sm text-gray-600 mt-2">잠시만 기다려주세요.</p>
        </div>
    );
}
