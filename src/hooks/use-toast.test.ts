import { act, renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useToast, toast, reducer } from "./use-toast";

// Timer mocks
vi.useFakeTimers();

describe("useToast", () => {
  beforeEach(() => {
    vi.clearAllTimers();
    // 전역 상태 초기화를 위해 모든 토스트 제거
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.dismiss();
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe("useToast hook", () => {
    it("초기 상태가 빈 배열이어야 한다", () => {
      const { result } = renderHook(() => useToast());

      expect(result.current.toasts).toEqual([]);
    });

    it("toast 함수를 포함해야 한다", () => {
      const { result } = renderHook(() => useToast());

      expect(typeof result.current.toast).toBe("function");
      expect(typeof result.current.dismiss).toBe("function");
    });

    it("toast를 추가할 수 있어야 한다", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({
          title: "테스트 토스트",
          description: "테스트 설명",
        });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe("테스트 토스트");
      expect(result.current.toasts[0].description).toBe("테스트 설명");
      expect(result.current.toasts[0].open).toBe(true);
    });

    it("토스트 제한(TOAST_LIMIT)을 준수해야 한다", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: "첫 번째 토스트" });
        result.current.toast({ title: "두 번째 토스트" });
        result.current.toast({ title: "세 번째 토스트" });
      });

      // TOAST_LIMIT이 1이므로 마지막 토스트만 남아있어야 함
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe("세 번째 토스트");
    });

    it("특정 토스트를 dismiss할 수 있어야 한다", async () => {
      const { result } = renderHook(() => useToast());

      let toastId: string;
      act(() => {
        const toastResult = result.current.toast({
          title: "테스트 토스트",
        });
        toastId = toastResult.id;
      });

      expect(result.current.toasts[0].open).toBe(true);

      act(() => {
        result.current.dismiss(toastId);
      });

      expect(result.current.toasts[0].open).toBe(false);

      // TOAST_REMOVE_DELAY 후에 토스트가 제거되어야 함
      act(() => {
        vi.advanceTimersByTime(1000000);
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it("모든 토스트를 dismiss할 수 있어야 한다", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: "첫 번째" });
      });

      act(() => {
        result.current.dismiss(); // toastId 없이 호출
      });

      expect(result.current.toasts[0].open).toBe(false);
    });
  });

  describe("toast function", () => {
    it("toast 객체를 반환해야 한다", () => {
      const toastResult = toast({
        title: "테스트",
        description: "설명",
      });

      expect(toastResult).toHaveProperty("id");
      expect(toastResult).toHaveProperty("dismiss");
      expect(toastResult).toHaveProperty("update");
      expect(typeof toastResult.id).toBe("string");
      expect(typeof toastResult.dismiss).toBe("function");
      expect(typeof toastResult.update).toBe("function");
    });

    it("고유한 ID를 생성해야 한다", () => {
      const toast1 = toast({ title: "첫 번째" });
      const toast2 = toast({ title: "두 번째" });

      expect(toast1.id).not.toBe(toast2.id);
    });

    it("update 함수가 작동해야 한다", () => {
      const { result } = renderHook(() => useToast());

      let toastResult: ReturnType<typeof toast>;
      act(() => {
        toastResult = result.current.toast({
          title: "원래 제목",
        });
      });

      act(() => {
        toastResult.update({
          id: toastResult.id,
          title: "업데이트된 제목",
          description: "새로운 설명",
        });
      });

      expect(result.current.toasts[0].title).toBe("업데이트된 제목");
      expect(result.current.toasts[0].description).toBe("새로운 설명");
    });

    it("dismiss 함수가 작동해야 한다", () => {
      const { result } = renderHook(() => useToast());

      let toastResult: ReturnType<typeof toast>;
      act(() => {
        toastResult = result.current.toast({
          title: "테스트",
        });
      });

      expect(result.current.toasts[0].open).toBe(true);

      act(() => {
        toastResult.dismiss();
      });

      expect(result.current.toasts[0].open).toBe(false);
    });

    it("onOpenChange가 false일 때 dismiss되어야 한다", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({
          title: "테스트",
        });
      });

      expect(result.current.toasts[0].open).toBe(true);

      act(() => {
        result.current.toasts[0].onOpenChange?.(false);
      });

      expect(result.current.toasts[0].open).toBe(false);
    });
  });

  describe("reducer", () => {
    const initialState = { toasts: [] };

    it("ADD_TOAST 액션을 처리해야 한다", () => {
      const toast = {
        id: "1",
        title: "테스트",
        open: true,
      };

      const newState = reducer(initialState, {
        type: "ADD_TOAST",
        toast,
      });

      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0]).toEqual(toast);
    });

    it("UPDATE_TOAST 액션을 처리해야 한다", () => {
      const initialToast = {
        id: "1",
        title: "원래 제목",
        open: true,
      };

      const stateWithToast = {
        toasts: [initialToast],
      };

      const newState = reducer(stateWithToast, {
        type: "UPDATE_TOAST",
        toast: {
          id: "1",
          title: "업데이트된 제목",
        },
      });

      expect(newState.toasts[0].title).toBe("업데이트된 제목");
      expect(newState.toasts[0].id).toBe("1");
    });

    it("DISMISS_TOAST 액션을 처리해야 한다", () => {
      const initialToast = {
        id: "1",
        title: "테스트",
        open: true,
      };

      const stateWithToast = {
        toasts: [initialToast],
      };

      const newState = reducer(stateWithToast, {
        type: "DISMISS_TOAST",
        toastId: "1",
      });

      expect(newState.toasts[0].open).toBe(false);
    });

    it("DISMISS_TOAST에서 toastId가 없으면 모든 토스트를 dismiss해야 한다", () => {
      const stateWithToasts = {
        toasts: [
          { id: "1", title: "첫 번째", open: true },
          { id: "2", title: "두 번째", open: true },
        ],
      };

      const newState = reducer(stateWithToasts, {
        type: "DISMISS_TOAST",
      });

      expect(newState.toasts[0].open).toBe(false);
      expect(newState.toasts[1].open).toBe(false);
    });

    it("REMOVE_TOAST 액션을 처리해야 한다", () => {
      const stateWithToasts = {
        toasts: [
          { id: "1", title: "첫 번째", open: true },
          { id: "2", title: "두 번째", open: true },
        ],
      };

      const newState = reducer(stateWithToasts, {
        type: "REMOVE_TOAST",
        toastId: "1",
      });

      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].id).toBe("2");
    });

    it("REMOVE_TOAST에서 toastId가 없으면 모든 토스트를 제거해야 한다", () => {
      const stateWithToasts = {
        toasts: [
          { id: "1", title: "첫 번째", open: true },
          { id: "2", title: "두 번째", open: true },
        ],
      };

      const newState = reducer(stateWithToasts, {
        type: "REMOVE_TOAST",
      });

      expect(newState.toasts).toHaveLength(0);
    });

    it("TOAST_LIMIT을 준수해야 한다", () => {
      const newState = reducer(initialState, {
        type: "ADD_TOAST",
        toast: { id: "1", title: "첫 번째", open: true },
      });

      const finalState = reducer(newState, {
        type: "ADD_TOAST",
        toast: { id: "2", title: "두 번째", open: true },
      });

      // TOAST_LIMIT이 1이므로 하나만 남아있어야 함
      expect(finalState.toasts).toHaveLength(1);
      expect(finalState.toasts[0].id).toBe("2");
    });
  });

  describe("Memory management", () => {
    it("컴포넌트 언마운트 시 리스너가 제거되어야 한다", () => {
      const { unmount } = renderHook(() => useToast());

      // 리스너 정리는 내부적으로 처리되므로 에러 없이 언마운트되어야 함
      expect(() => unmount()).not.toThrow();
    });

    it("여러 컴포넌트에서 동일한 상태를 공유해야 한다", () => {
      const { result: result1 } = renderHook(() => useToast());
      const { result: result2 } = renderHook(() => useToast());

      act(() => {
        result1.current.toast({ title: "공유 토스트" });
      });

      expect(result2.current.toasts).toHaveLength(1);
      expect(result2.current.toasts[0].title).toBe("공유 토스트");
    });
  });

  describe("Timer management", () => {
    it("dismiss 후 TOAST_REMOVE_DELAY만큼 기다린 후 토스트가 제거되어야 한다", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: "테스트" });
      });

      const toastId = result.current.toasts[0].id;

      act(() => {
        result.current.dismiss(toastId);
      });

      expect(result.current.toasts[0].open).toBe(false);
      expect(result.current.toasts).toHaveLength(1);

      // 시간이 지나기 전에는 여전히 존재
      act(() => {
        vi.advanceTimersByTime(999999);
      });
      expect(result.current.toasts).toHaveLength(1);

      // TOAST_REMOVE_DELAY 후에 제거됨
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(result.current.toasts).toHaveLength(0);
    });

    it("동일한 토스트에 대해 중복 타이머가 설정되지 않아야 한다", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: "테스트" });
      });

      const toastId = result.current.toasts[0].id;

      // 여러 번 dismiss 호출
      act(() => {
        result.current.dismiss(toastId);
        result.current.dismiss(toastId);
        result.current.dismiss(toastId);
      });

      // 한 번만 제거되어야 함
      act(() => {
        vi.advanceTimersByTime(1000000);
      });

      expect(result.current.toasts).toHaveLength(0);
    });
  });
});
