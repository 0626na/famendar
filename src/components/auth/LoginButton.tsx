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

        //Todo: 지금은 alert로 간단하게 처리 했지만 추후 Toast 로 변경할 예정
        if (error)
            alert(
                `카카오 로그인에 실패했습니다: ${error.message}\n잠시 후 다시 시도해 주세요.`
            );
    };

    return (
        <button
            onClick={handleLoginWithKakao}
            className="btn p-0 relative w-24 h-11 hover:opacity-90 hover:brightness-90 rounded-lg cursor-pointer overflow-hidden"
            aria-label="카카오 계정으로 로그인"
        >
            {" "}
            <Image
                src="/kakao_login_medium.png"
                layout="fill"
                alt="카카오 로그인"
                objectFit="cover"
            />
        </button>
    );
}
