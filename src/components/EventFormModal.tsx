"use client";

import { useCalendarStore, type ModalPosition } from "@/store/calendarStore"; // ModalPosition 타입 임포트
import { useEffect, useState, useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
    createEventAction,
    CreateEventFormState,
} from "@/actions/eventActions";

const initialState: CreateEventFormState = {
    success: false,
    message: "",
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
            {pending ? "저장 중..." : "저장"}
        </button>
    );
}

export default function EventFormModal() {
    const {
        closeEventModal,
        isEventModalOpen,
        selectedDateForEvent,
        modalPosition, // 스토어에서 위치 기준점 가져오기 (이름 변경)
    } = useCalendarStore();

    const [shouldRender, setShouldRender] = useState(false);
    // 실제 모달 너비를 저장할 상태
    const [actualModalWidth, setActualModalWidth] = useState<number | null>(
        448 // 초기 추정치 또는 최대 너비
    );
    const [isAnimatingIn, setIsAnimatingIn] = useState(false);

    const [formState, formAction] = useActionState(
        createEventAction,
        initialState
    );
    const formRef = useRef<HTMLFormElement>(null);
    const modalContentRef = useRef<HTMLDivElement>(null); // 모달 내용 div에 대한 ref

    // 폼 리셋을 위한 상태 관리
    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("10:00");

    useEffect(() => {
        if (formState.success) {
            closeEventModal(); // 모달 닫기 (애니메이션 트리거)
        }
    }, [formState.success, closeEventModal]);

    useEffect(() => {
        if (isEventModalOpen && selectedDateForEvent && modalPosition) {
            setShouldRender(true);
            // DOM에 요소가 실제로 추가된 후 애니메이션 클래스를 적용하기 위해 약간의 지연(requestAnimationFrame)을 줍니다.
            const rafId = requestAnimationFrame(() => {
                // 모달 내용이 실제로 그려진 후 너비를 측정
                if (modalContentRef.current) {
                    setActualModalWidth(modalContentRef.current.offsetWidth);
                }
                setIsAnimatingIn(true);
            });
            return () => cancelAnimationFrame(rafId);
        } else {
            setIsAnimatingIn(false); // 퇴장 애니메이션 시작
            const timer = setTimeout(() => {
                // eslint-disable-line no-undef
                setShouldRender(false); // 애니메이션 후 DOM에서 제거
                // 스토어의 closeEventModal이 modalPosition 재설정을 처리합니다.
                // 너비에 대한 로컬 컴포넌트 상태를 재설정합니다.
                setActualModalWidth(448); // 너비 초기화 (다음 열릴 때를 위해)
            }, 300); // 애니메이션 지속 시간과 일치 (duration-300)
            return () => clearTimeout(timer);
        }
    }, [isEventModalOpen, selectedDateForEvent, modalPosition]);

    useEffect(() => {
        // 모달이 열리거나 성공적으로 제출되어 resetKey가 변경되면 폼 필드 초기화
        if (isEventModalOpen && selectedDateForEvent) {
            setTitle("");
            setStartTime("09:00");
            setEndTime("10:00");
            if (formRef.current) {
                formRef.current.reset(); // 네이티브 폼 리셋
            }
        }
    }, [formState.resetKey, isEventModalOpen, selectedDateForEvent]);

    // 모달 외부 클릭 시 닫기 처리를 위한 Effect
    useEffect(() => {
        if (!isEventModalOpen) {
            return; // 모달이 열려 있지 않으면 아무것도 하지 않음
        }

        // EventFormModal.tsx
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;

            // '특별 구역' 표지판이 보이면, 즉시 후진!
            if (target.closest('[data-calendar-cell="true"]')) {
                return; // 아무것도 하지 않고 함수를 종료합니다.
            }

            // 그 외의 경우에만 기존 로직을 수행합니다.
            if (
                modalContentRef.current &&
                !modalContentRef.current.contains(target)
            ) {
                closeEventModal();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isEventModalOpen, closeEventModal]); // modalContentRef는 안정적이므로 의존성 배열에 넣을 필요 없음

    if (!shouldRender && !isEventModalOpen) {
        // 완전히 닫힌 상태면 렌더링 안함
        return null;
    }

    // 모달 위치 계산 (렌더링 시 스타일 적용)
    const modalStyle: React.CSSProperties = {};
    if (modalPosition) {
        // const modalWidth = 448; // 더 이상 고정된 최대 너비에만 의존하지 않음
        const modalHeightEstimate = 450; // 모달의 대략적인 높이
        const gap = 10; // 클릭된 요소와의 간격
        const currentModalWidth = actualModalWidth || 448; // 측정된 너비 또는 fallback

        let top = modalPosition.top;
        let calculatedLeft = modalPosition.right + gap; // 기본적으로 오른쪽에 표시

        // 모달이 오른쪽에 표시될 경우 화면을 벗어나는지 확인
        if (
            typeof window !== "undefined" &&
            calculatedLeft + currentModalWidth > window.innerWidth - gap
        ) {
            // 화면을 벗어나면 왼쪽에 표시하도록 위치 재계산
            // 목표: 모달의 오른쪽 가장자리가 (클릭된 셀의 왼쪽 가장자리 - gap) 위치에 오도록 한다.
            // L_modal = (L_cell - gap) - W_modal_actual
            calculatedLeft = modalPosition.left - currentModalWidth - gap;
        }

        // 화면 아래쪽에 너무 가까우면 위로 조정
        if (
            typeof window !== "undefined" &&
            top + modalHeightEstimate > window.innerHeight - gap
        ) {
            top = window.innerHeight - modalHeightEstimate - gap;
        }
        modalStyle.top = `${Math.max(gap, top)}px`;
        modalStyle.left = `${Math.max(gap, calculatedLeft)}px`; // 화면 좌측 가장자리 벗어나지 않도록
    }

    // selectedDateForEvent가 null일 수 있는 경우(특히 모달 닫힘 애니메이션 중)를 대비합니다.
    let formattedDate = "";
    let selectedDateISO = "";

    if (selectedDateForEvent) {
        formattedDate = selectedDateForEvent.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
        });
        selectedDateISO = selectedDateForEvent.toISOString().split("T")[0]; // YYYY-MM-DD
    } else if (shouldRender) {
        // 모달이 렌더링 되어야 하지만 (애니메이션 중) 날짜 정보가 없는 경우,
        // 날짜 관련 UI는 표시되지 않거나 플레이스홀더를 사용해야 합니다.
        // 현재는 빈 문자열로 두어 관련 UI가 비어있게 됩니다.
    }

    return (
        <div
            style={modalStyle}
            className={`fixed z-50 transition-all duration-300 ease-in-out
                        ${
                            isAnimatingIn && modalPosition
                                ? "opacity-100 translate-x-0" // 최종 보이는 상태
                                : "opacity-0 translate-x-2.5" // 초기 숨김 및 약간 오른쪽 상태 (10px)
                        }`}
            // translate-x-2.5 (10px)로 변경하여 초기 오프셋을 줄임
            // 필요시 translate-x-full 또는 더 큰 값으로 변경하여 더 멀리서 나타나도록 조정 가능
        >
            <div
                ref={modalContentRef} // ref 연결
                className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md border border-gray-200"
            >
                <h2 className="text-xl font-semibold mb-2">새 일정 추가</h2>
                {/* selectedDateForEvent가 있을 때만 날짜 표시 */}
                {selectedDateForEvent && (
                    <p className="text-sm text-gray-600 mb-4">
                        {formattedDate}
                    </p>
                )}
                <form action={formAction} ref={formRef}>
                    {/* selectedDateForEvent가 있을 때만 hidden input 렌더링 */}
                    {selectedDateForEvent && (
                        <input
                            type="hidden"
                            name="selectedDate"
                            value={selectedDateISO}
                        />
                    )}

                    <div className="mb-4">
                        <label
                            htmlFor="event-title"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            일정 제목
                        </label>
                        <input
                            type="text"
                            id="event-title"
                            name="title" // name 속성 추가
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                        {formState.errors?.title && (
                            <p className="text-xs text-red-500 mt-1">
                                {formState.errors.title.join(", ")}
                            </p>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label
                                htmlFor="start-time"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                시작 시간
                            </label>
                            <input
                                type="time"
                                id="start-time"
                                name="startTime" // name 속성 추가
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                            {formState.errors?.start_datetime && (
                                <p className="text-xs text-red-500 mt-1">
                                    {formState.errors.start_datetime.join(", ")}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="end-time"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                종료 시간
                            </label>
                            <input
                                type="time"
                                id="end-time"
                                name="endTime" // name 속성 추가
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                            {formState.errors?.end_datetime && (
                                <p className="text-xs text-red-500 mt-1">
                                    {formState.errors.end_datetime.join(", ")}
                                </p>
                            )}
                        </div>
                    </div>
                    {/* 일반 오류 메시지 (필드 특정 오류가 아닐 경우) */}
                    {formState.message &&
                        !formState.success &&
                        !formState.errors?.general && (
                            <p className="text-sm text-red-600 mb-4">
                                {formState.message}
                            </p>
                        )}
                    {formState.errors?.general && (
                        <p className="text-sm text-red-600 mb-4">
                            {formState.errors.general.join(", ")}
                        </p>
                    )}
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={closeEventModal}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            취소
                        </button>
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
}
