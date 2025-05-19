import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
    // 이 환경 변수들은 .env.local 파일에 정의되어 있어야 하며,
    // Next.js에 의해 클라이언트 사이드에서도 접근 가능하도록 NEXT_PUBLIC_ 접두사가 붙어있어야 합니다.
    // 예:
    // NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    // NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
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

    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
}
