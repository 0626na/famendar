import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// createServerClient 함수를 위한 래퍼 함수
export function createSupabaseServerClient() {
    const cookieStore = cookies();

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error(
            "Supabase URL이 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_URL 환경 변수를 확인해주세요."
        );
    }
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error(
            "Supabase Anon Key가 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_ANON_KEY 환경 변수를 확인해주세요."
        );
    }

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll: async () => {
                    const store = await cookieStore;
                    return store.getAll();
                },
                setAll: async (
                    cookiesToSet: Array<{
                        name: string;
                        value: string;
                        options: CookieOptions;
                    }>
                ) => {
                    const store = await cookieStore;
                    // Server Action에서는 쿠키 설정이 일반적으로 문제 없음
                    cookiesToSet.forEach(({ name, value, options }) => {
                        store.set(name, value, options);
                    });
                },
            },
        }
    );
}
