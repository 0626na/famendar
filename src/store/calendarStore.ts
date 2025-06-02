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
            const currentDate = state.displayedDate;
            const currentDay = currentDate.getDate();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();

            let targetMonth = currentMonth + 1;
            let targetYear = currentYear;

            if (targetMonth > 11) {
                // 12월에서 1월로 넘어갈 때 연도 변경 처리
                targetMonth = 0; // 0은 1월을 의미
                targetYear += 1;
            }

            // 현재 '일'을 유지하면서 대상 월의 새 날짜 객체 생성
            const newDate = new Date(targetYear, targetMonth, currentDay);

            // 만약 newDate의 월이 targetMonth와 다르다면, 이는 '일'이 targetMonth의 최대 일수보다 커서
            // 월이 넘어간 경우입니다 (예: 1월 31일 -> 2월 31일 시도 -> 3월 3일이 됨).
            // 이 경우, 날짜를 targetMonth의 마지막 날로 설정합니다.
            if (newDate.getMonth() !== targetMonth) {
                // newDate는 현재 targetMonth의 *다음* 달로 설정되어 있습니다 (예: targetMonth가 2월일 때 newDate는 3월).
                // setDate(0)은 이전 달의 마지막 날로 설정하므로, 결과적으로 targetMonth의 마지막 날로 설정됩니다.
                newDate.setDate(0);
            }
            return { displayedDate: newDate };
        }),
    goToPreviousMonth: () =>
        set((state) => {
            const currentDate = state.displayedDate;
            const currentDay = currentDate.getDate();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();

            let targetMonth = currentMonth - 1;
            let targetYear = currentYear;

            if (targetMonth < 0) {
                // 1월에서 12월로 넘어갈 때 연도 변경 처리
                targetMonth = 11; // 11은 12월을 의미
                targetYear -= 1;
            }

            // 현재 '일'을 유지하면서 대상 월의 새 날짜 객체 생성
            const newDate = new Date(targetYear, targetMonth, currentDay);

            // 만약 newDate의 월이 targetMonth와 다르다면, 이는 '일'이 targetMonth의 최대 일수보다 커서
            // 월이 넘어간 경우입니다 (예: 3월 31일 -> 2월 31일 시도 -> 3월 3일이 됨).
            // 이 경우, 날짜를 targetMonth의 마지막 날로 설정합니다.
            if (newDate.getMonth() !== targetMonth) {
                // 만약 newDate가 targetMonth가 아닌 다른 달로 설정되었다면 (예: targetMonth가 2월이었으나, 일자 초과로 3월로 설정된 경우),
                // setDate(0)은 해당 월(예: 3월)의 이전 달, 즉 targetMonth(2월)의 마지막 날로 설정합니다.
                newDate.setDate(0);
            }
            return { displayedDate: newDate };
        }),
}));
