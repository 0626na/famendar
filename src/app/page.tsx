import MainCalendar from "@/components/calendar/MainCalendar";
import MiniCalendar from "@/components/calendar/MiniCalendar";
import EventFormModal from "@/components/EventFormModal";

export default function Home() {
    return (
        <div className="flex flex-col h-full bg-[#F8FAFD]">
            <div className="flex flex-1 h-full pt-3 px-3 pb-3">
                {/* MiniCalendar를 왼쪽에 배치 */}
                <div className="w-64 p-1 space-y-4 hidden md:block">
                    {" "}
                    {/* md 이상 화면에서만 보이도록 수정 */}
                    <MiniCalendar />
                    {/* 필요하다면 여기에 다른 사이드바 컨텐츠 추가 */}
                </div>
                {/* MainCalendar를 오른쪽에 배치하고 남은 공간을 모두 사용 */}
                <div className="flex-1 p-1">
                    <MainCalendar />
                </div>
            </div>
            <EventFormModal /> {/* 모달은 페이지 레벨에 렌더링 */}
        </div>
    );
}
