"use server";

import prisma from "@/utils/prisma";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export interface CreateEventFormState {
    success: boolean;
    message: string;
    errors?: {
        title?: string[];
        start_datetime?: string[];
        end_datetime?: string[];
        general?: string[];
    };
    resetKey?: string; // 폼 필드 초기화를 위한 키
}

export async function createEventAction(
    _prevState: CreateEventFormState, // 이전 상태 (useFormState에서 사용)
    formData: FormData // 클라이언트 폼에서 넘어온 데이터
): Promise<CreateEventFormState> {
    const supabase = createSupabaseServerClient();

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
        return {
            success: false,
            message: "오류: 사용자가 인증되지 않았습니다.",
            errors: { general: ["사용자가 인증되지 않았습니다."] },
        };
    }
    const userId = session.user.id;

    const title = formData.get("title") as string;
    const selectedDate = formData.get("selectedDate") as string; // YYYY-MM-DD 형식
    const startTime = formData.get("startTime") as string; // HH:mm 형식
    const endTime = formData.get("endTime") as string; // HH:mm 형식

    // 기본 유효성 검사
    if (!title || title.trim() === "") {
        return {
            success: false,
            message: "일정 제목을 입력해주세요.",
            errors: { title: ["일정 제목을 입력해주세요."] },
        };
    }
    if (!selectedDate || !startTime || !endTime) {
        return {
            success: false,
            message: "날짜와 시간을 모두 입력해주세요.",
            errors: { general: ["날짜와 시간을 모두 입력해주세요."] },
        };
    }

    // ISO 8601 형식의 DateTime 문자열로 변환 (UTC 기준)
    const start_datetime = new Date(`${selectedDate}T${startTime}:00.000Z`);
    const end_datetime = new Date(`${selectedDate}T${endTime}:00.000Z`);

    if (isNaN(start_datetime.getTime()) || isNaN(end_datetime.getTime())) {
        return {
            success: false,
            message: "유효하지 않은 날짜 또는 시간 형식입니다.",
            errors: { general: ["유효하지 않은 날짜 또는 시간 형식입니다."] },
        };
    }

    if (end_datetime <= start_datetime) {
        return {
            success: false,
            message: "종료 시간은 시작 시간보다 늦어야 합니다.",
            errors: {
                end_datetime: ["종료 시간은 시작 시간보다 늦어야 합니다."],
            },
        };
    }

    try {
        await prisma.event.create({
            data: {
                title,
                start_datetime,
                end_datetime,
                userId, // 인증된 사용자 ID 사용
            },
        });
        revalidatePath("/");

        return {
            success: true,
            message: "일정이 성공적으로 추가되었습니다.",
            resetKey: Date.now().toString(),
        };
    } catch (error) {
        console.error("Error creating event:", error);
        return {
            success: false,
            message: "일정 추가 중 오류가 발생했습니다. 다시 시도해주세요.",
            errors: { general: ["서버 오류가 발생했습니다."] },
        };
    }
}
