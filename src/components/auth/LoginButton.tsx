"use client";

import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

export default function LoginButton() {
    const supabase = createClient();

    const handleLoginWithKakao = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "kakao",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) console.error("카카오 로그인 중 오류 발생:", error.message);
    };

    return (
        <button
            onClick={handleLoginWithKakao}
            className="btn p-0 relative w-23 h-11 hover:opacity-90 hover:brightness-90 rounded-lg cursor-pointer"
            aria-label="카카오 계정으로 로그인"
        >
            {" "}
            <Image
                src="/kakao_login_medium.png"
                layout="fill"
                alt="카카오 로그인"
            />
        </button>
    );
}
