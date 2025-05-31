"use client";

import { useMemo } from "react";
import { useCalendarStore } from "@/store/calendarStore";
import { generateMonthDays } from "@/utils/calendarUtils";

const shortDaysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

export default function MainCalendar() {
    const { displayedDate } = useCalendarStore();
    const monthDays = useMemo(
        () => generateMonthDays(displayedDate),
        [displayedDate]
    );

    return (
        <div className="flex flex-col h-full sm:p-2 md:p-3">
            <div className="grid grid-cols-7 grid-rows-6 flex-1 gap-px bg-gray-200 border border-gray-200 rounded-4xl shadow-lg overflow-hidden">
                {/* monthDays 배열을 순회하며 42개의 각 날짜 칸을 렌더링합니다. */}
                {monthDays.map((dayData, index) => {
                    // index를 사용하여 첫 번째 주에 요일 표시
                    return (
                        <div
                            key={dayData.date.toISOString()}
                            className={`bg-white p-2 sm:p-3 flex flex-col items-center justify-start ${
                                dayData.isCurrentMonth
                                    ? "text-gray-800" // 현재 달
                                    : "text-gray-400" // 이전/다음 달
                            }`}
                        >
                            {/* 첫 번째 주(index < 7)에만 요일 표시 */}
                            {index < 7 && (
                                <span className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                                    {shortDaysOfWeek[index]}
                                </span>
                            )}
                            {/* 날짜 숫자 표시 */}
                            <span
                                className={`text-sm sm:text-base md:text-lg font-medium ${
                                    dayData.isToday
                                        ? "bg-blue-600 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center"
                                        : "w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center" // '오늘'이 아닐 때도 크기 유지를 위해 flex 컨테이너 역할
                                }`}
                            >
                                {dayData.dayOfMonth}
                            </span>
                            {/* TODO: 여기에 이벤트 표시 영역 (예: <div className="mt-1 space-y-0.5">...이벤트들...</div>) */}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
