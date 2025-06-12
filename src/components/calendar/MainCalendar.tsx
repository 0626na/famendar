"use client";

import { useMemo } from "react";
import { useCalendarStore } from "@/store/calendarStore"; // CalendarState 타입 임포트
import { generateMonthDays } from "@/utils/calendarUtils";

const shortDaysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

export default function MainCalendar() {
    // 각 상태와 액션을 개별적으로 선택하여 불필요한 리렌더링 방지
    const displayedDate = useCalendarStore((state) => state.displayedDate);
    const openEventModal = useCalendarStore((state) => state.openEventModal);
    const closeEventModal = useCalendarStore((state) => state.closeEventModal);
    const isEventModalOpen = useCalendarStore(
        (state) => state.isEventModalOpen
    );

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
                        <button
                            key={dayData.date.toISOString()}
                            data-calendar-cell="true"
                            onClick={(
                                event: React.MouseEvent<HTMLButtonElement>
                            ) => {
                                // 현재 모달 상태를 확인합니다.
                                if (isEventModalOpen) {
                                    // 모달이 열려 있으면, 어떤 날짜를 클릭하든 모달을 닫습니다.
                                    closeEventModal();
                                } else {
                                    // 모달이 닫혀 있으면, 클릭된 날짜에 대해 모달을 엽니다.
                                    const rect =
                                        event.currentTarget.getBoundingClientRect();
                                    openEventModal(dayData.date, rect);
                                }
                            }}
                            className={`bg-white p-2 sm:p-3 flex flex-col items-center justify-start relative ${
                                dayData.isCurrentMonth
                                    ? "text-gray-800" // 현재 달
                                    : "text-gray-400" // 이전/다음 달
                            }`}
                            // 이전/다음 달 날짜는 클릭해도 모달이 뜨지만, UI적으로 비활성화된 것처럼 보이게 할 수도 있습니다.
                            // 예를 들어, dayData.isCurrentMonth가 false일 경우 onClick 핸들러를 비활성화하거나,
                            // openEventModal 호출 전에 조건을 추가할 수 있습니다.
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
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
