"use client";

import MainCalendar from "@/components/calendar/MainCalendar";
import MiniCalendar from "@/components/calendar/MiniCalendar";

export default function CalendarPage() {
    return (
        <div className="flex flex-1 h-full bg-[#F8FAFD]">
            <div className="w-64 p-1 space-y-4">
                <MiniCalendar />
            </div>
            <div className="flex-1 p-1">
                <MainCalendar />
            </div>
        </div>
    );
}
