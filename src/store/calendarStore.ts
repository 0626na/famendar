import { create } from "zustand";

interface CalendarState {
    displayedDate: Date;
    setDisplayedDate: (date: Date) => void;
    goToToday: () => void;
    goToNextMonth: () => void;
    goToPreviousMonth: () => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
    displayedDate: new Date(), // 초기값은 현재 날짜
    setDisplayedDate: (date) => set({ displayedDate: date }),
    goToToday: () => set({ displayedDate: new Date() }),
    goToNextMonth: () =>
        set((state) => {
            const newDate = new Date(state.displayedDate);
            newDate.setMonth(newDate.getMonth() + 1);
            // 일자 변경으로 인해 월이 두 단계 넘어가는 경우 방지 (예: 1월 31일 -> 3월 3일)
            if (
                newDate.getMonth() !==
                (state.displayedDate.getMonth() + 1) % 12
            ) {
                newDate.setDate(0); // 이전 달의 마지막 날로 설정
            }
            return { displayedDate: newDate };
        }),
    goToPreviousMonth: () =>
        set((state) => {
            const newDate = new Date(state.displayedDate);
            newDate.setMonth(newDate.getMonth() - 1);
            // 일자 변경으로 인해 월이 두 단계 넘어가는 경우 방지
            if (
                newDate.getMonth() !==
                (state.displayedDate.getMonth() - 1 + 12) % 12
            ) {
                newDate.setDate(0); // 이전 달의 마지막 날로 설정
            }
            return { displayedDate: newDate };
        }),
}));
