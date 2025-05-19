import { create } from "zustand";

// User 모델의 타입 정의 (prisma/schema.prisma에 정의된 모델과 일치해야 함)
// 예시 타입이며, 실제 프로젝트의 User 모델에 맞게 필드를 조정해야 합니다.
export interface Profile {
    id: string; // UUID
    email: string;
    name: string;
    avatar_url?: string | null;
    // Famender 프로젝트에 필요한 추가 프로필 필드가 있다면 여기에 추가
}

interface AuthState {
    profile: Profile | null; // 우리 서비스의 User 객체
    isLoading: boolean; // 인증 상태 로딩 중 여부
    setProfile: (profile: Profile | null) => void;
    setIsLoading: (loading: boolean) => void;
    clearAuth: () => void; // 로그아웃 시 상태 초기화
}

export const useAuthStore = create<AuthState>((set) => ({
    profile: null,
    isLoading: true, // 앱 시작 시 인증 상태를 확인하므로 초기값은 true
    setProfile: (profile) => set({ profile }),
    setIsLoading: (loading) => set({ isLoading: loading }),
    clearAuth: () => set({ profile: null, isLoading: false }),
}));
