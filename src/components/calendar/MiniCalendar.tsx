"use client";

import { useMemo } from "react";
import { useCalendarStore } from "@/store/calendarStore";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import {
    generateMonthDays,
    type CalendarDay as MiniCalendarDay,
} from "@/utils/calendarUtils";

const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

export default function MiniCalendar() {
    const {
        displayedDate,
        setDisplayedDate,
        goToPreviousMonth,
        goToNextMonth,
    } = useCalendarStore();

    const displayMonth = `${displayedDate.getFullYear()}년 ${
        displayedDate.getMonth() + 1
    }월`;

    const calendarDays = useMemo(() => {
        return generateMonthDays(displayedDate);
    }, [displayedDate]);

    return (
        <div className=" rounded-lg">
            {/* 헤더: 월/년도 표시 및 네비게이션 */}
            <div className="flex items-center justify-between px-2 py-2">
                <button
                    aria-label="이전 달"
                    onClick={goToPreviousMonth}
                    className="p-1 rounded-full hover:bg-gray-100"
                >
                    <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-sm font-semibold text-gray-700">
                    {displayMonth}
                </h2>
                <button
                    aria-label="다음 달"
                    onClick={goToNextMonth}
                    className="p-1 rounded-full hover:bg-gray-100"
                >
                    <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* 요일 표시 */}
            <div className="grid grid-cols-7 gap-px text-xs text-center text-gray-500 border-t border-b border-gray-200">
                {daysOfWeek.map((day) => (
                    <div key={day} className="py-1">
                        {day}
                    </div>
                ))}
            </div>

            {/* 날짜 그리드 */}
            <div className="grid grid-cols-7 gap-px text-sm text-black  ">
                {calendarDays.map((dayObj) => {
                    const dayKey = dayObj.date.toISOString(); // 고유한 key 생성
                    let buttonClass =
                        "py-1.5 text-center hover:bg-blue-100 rounded-full aspect-square focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-100";
                    if (!dayObj.isCurrentMonth) {
                        buttonClass += " text-gray-400";
                    }
                    if (dayObj.isToday) {
                        // 오직 실제 시스템의 '오늘' 날짜인 경우에만 파란색 원 표시
                        buttonClass += " rounded-full bg-blue-600 text-white";
                    }

                    return (
                        <button
                            key={dayKey}
                            className={buttonClass}
                            onClick={() => setDisplayedDate(dayObj.date)}
                        >
                            {dayObj.dayOfMonth}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
