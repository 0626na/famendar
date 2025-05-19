"use server";

import { Profile } from "@/store/authStore";
import prisma from "@/utils/prisma";
import type { User as SupabaseUser } from "@supabase/supabase-js";

/**
 * Supabase 사용자 정보를 기반으로 Profile 테이블에서 사용자 정보를 조회하거나 생성합니다.
 * 최초 로그인 시 카카오에서 제공된 정보 (user_metadata)를 사용하여 프로필을 만듭니다.
 * @param supabaseUser - Supabase의 인증된 사용자 객체입니다.
 * @returns Profile 객체 또는 null을 반환합니다.
 */
export async function getOrUpdateUserProfile(
    supabaseUser: SupabaseUser
): Promise<Profile | null> {
    if (!supabaseUser) {
        console.error(
            "Server Action (getOrUpdateUserProfile): supabaseUser가 제공되지 않았습니다."
        );
        return null;
    }

    const userId = supabaseUser.id;

    try {
        let profile = await prisma.profile.findUnique({
            where: { id: userId },
        });

        // 최초 로그인 시, Supabase 사용자 정보 기반으로 프로필 생성
        if (!profile) {
            profile = await prisma.profile.create({
                data: {
                    id: userId,
                    email: supabaseUser.user_metadata?.email,
                    name: supabaseUser.user_metadata?.name,
                    avatar_url: supabaseUser.user_metadata?.avatar_url,
                },
            });
        }

        return profile;
    } catch (error) {
        console.error(
            `Server Action (getOrUpdateUserProfile) 오류 - 사용자 ID [${userId}]:`,
            error
        );
        return null;
    }
}
