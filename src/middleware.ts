import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(
                    cookiesToSet: Array<{
                        name: string;
                        value: string;
                        options: CookieOptions;
                    }>
                ) {
                    // 먼저 요청 객체의 쿠키를 업데이트합니다 (Supabase 클라이언트가 내부적으로 사용할 수 있도록).
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set({ name, value, ...options });
                    });

                    // 기존 패턴에 따라 응답 객체를 재생성합니다.
                    // 이렇게 하면 요청 헤더의 변경사항(쿠키 포함)이 반영된 새 응답 객체가 만들어집니다.
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    });

                    // 이제 새로 생성된 응답 객체에 쿠키를 설정합니다.
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    // 사용자의 세션 정보를 가져옵니다.
    // supabase.auth.getUser()는 세션을 갱신하고 사용자 정보를 반환합니다.
    // 이 호출은 또한 쿠키에 최신 인증 토큰을 설정하는 데 도움이 됩니다.
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // 인증된 사용자가 없으면 로그인 페이지로 리디렉션합니다.
    // matcher 설정에 의해 /login 경로는 이미 이 미들웨어 실행에서 제외됩니다.
    if (!user) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 그 외의 경우에는 요청을 그대로 통과시킵니다.
    return response;
}

// 미들웨어가 실행될 경로를 지정합니다.
export const config = {
    matcher: [
        /*
         * 다음으로 시작하는 경로를 제외한 모든 요청 경로와 일치시킵니다:
         * - api (API 라우트)
         * - _next/static (정적 파일)
         * - _next/image (이미지 최적화 파일)
         * - favicon.ico (파비콘 파일)
         * - /login (로그인 페이지 자체는 보호하지 않음)
         * - / (메인 페이지도 이 matcher에 의해 보호됩니다)
         * - /auth/callback (OAuth 콜백 처리를 위한 페이지)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|login|auth/callback).*)",
        // 만약 모든 페이지를 기본적으로 보호하고 싶다면 위 matcher를 사용하고,
        // 특정 페이지만 보호하고 싶다면 아래처럼 명시적으로 추가합니다.
        // "/dashboard/:path*",
        // "/profile/:path*",
        // "/protected-page/:path*",
    ],
};
