/**
 * 달력에 표기되는 날짜 데이터
 */
export interface CalendarDay {
    date: Date; //날짜의 Date object
    dayOfMonth: number; //해당 날짜의 날짜의 숫자. (ex 1,2,3,... 23,24)
    isCurrentMonth: boolean; //현재 달력의 달에 속하는 날짜인지 확인
    isPreviousMonth: boolean; //현재 달력의 이전 달에 속하는 날짜인지 확인
    isNextMonth: boolean; //현재 달력의 다음 달에 속하는 날짜인지 확인
    isToday: boolean; //날짜가 오늘 날짜인지를 확인
}

/**
 * 특정 날짜의 CalendarDay 타입에 필요한 플래그들
 */
export interface PeriodDayFlags {
    isCurrentMonth: boolean;
    isPreviousMonth: boolean;
    isNextMonth: boolean;
}

/**
 * 두 날짜가 같은 날인지 확인하는 함수 (시간 무시)
 * @param date1
 * @param date2
 * @returns
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
    if (!date1 || !date2) return false;
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
};

/**
 * 달력의 조건에 맞게 날짜를 계산해서 반환하는 함수.
 *
 * 예를들어 25년 6월이라고 한다면 6월은 30일까지 존재하기에 1부터 30까지의 날짜를 입력해서 전달한다. 그리고
 * 다음달인 7월의 앞부분 날짜를 6월달 마지막날짜를 입력하고도 남은 달력의 칸수만큼 채우는 계산도 한다.
 * @param periodYear 계산하려는 시간의 연도
 * @param periodMonth 계산하려는 시간의 달
 * @param startDay 해당 기간에서 시작될 날짜
 * @param numDays 생성할 날짜 갯수
 * @param flags CalendarDay interface의 프로퍼티 일부
 * @param today 현재 오늘 날짜
 */
export const generatePeriodDays = (
    periodYear: number,
    periodMonth: number,
    startDay: number,
    numDays: number,
    flags: PeriodDayFlags,
    today: Date
): CalendarDay[] => {
    if (numDays <= 0) return [];

    return Array.from({ length: numDays }, (_, k) => {
        const dayOfMonth = startDay + k;
        const date = new Date(periodYear, periodMonth, dayOfMonth);
        return {
            date,
            dayOfMonth,
            ...flags,
            isToday: isSameDay(date, today),
        };
    });
};

/**
 * 현재달의 달력 ui에 표기할 날짜를 생성합니다.
 * @param currentDate
 * @returns
 */
export const generateMonthDays = (currentDate: Date): CalendarDay[] => {
    //TODO: 유틸 함수의 단위 테스트 작성하기
    const today = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-indexed
    const totalCells = 42; // 6주 * 7일
    const monthStartWeekday = new Date(year, month, 1).getDay(); //0 (Sun) - 6 (Sat) 1일의 요일
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate(); //달의 마지막 날짜
    const previousMonthEndDate = new Date(year, month, 0).getDate(); // 이전 달의 마지막 날짜

    const prevMonthDateForCalc = new Date(year, month - 1, 1);
    const prevMonthDays = generatePeriodDays(
        prevMonthDateForCalc.getFullYear(),
        prevMonthDateForCalc.getMonth(),
        previousMonthEndDate - monthStartWeekday + 1,
        monthStartWeekday,
        { isCurrentMonth: false, isPreviousMonth: true, isNextMonth: false },
        today
    );

    const currentMonthDays = generatePeriodDays(
        year,
        month,
        1,
        lastDateOfMonth,
        { isCurrentMonth: true, isPreviousMonth: false, isNextMonth: false },
        today
    );
    const remainingCells =
        totalCells - (prevMonthDays.length + currentMonthDays.length);
    const nextMonthDateForCalc = new Date(year, month + 1, 1);
    const nextMonthDays = generatePeriodDays(
        nextMonthDateForCalc.getFullYear(),
        nextMonthDateForCalc.getMonth(),
        1,
        remainingCells,
        { isCurrentMonth: false, isPreviousMonth: false, isNextMonth: true },
        today
    );
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
};
