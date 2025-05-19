"use client";

import { useAuthStore } from "@/store/authStore";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

export default function LoginButton() {
    const supabase = createClient();

    const { profile } = useAuthStore();

    const handleLoginWithKakao = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "kakao",
            options: {
                redirectTo: `${window.location.origin}/`,
            },
        });

        if (error) console.error("카카오 로그인 중 오류 발생:", error.message);
    };

    return (
        <button
            onClick={handleLoginWithKakao}
            className="relative text-[#000000] w-[90px] h-[45px] hover:bg-yellow-400 rounded-lg bg-amber-500  transition-colors duration-200 ease-in-out"
            aria-label="카카오 계정으로 로그인"
        >
            {" "}
            
            <Image
                src="/kakao_login_medium.png"
                layout="fill"
                alt="카카오 로그인"
                objectFit="contain"
            />
        </button>
    );
}
