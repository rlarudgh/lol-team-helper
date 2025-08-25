import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useIsMobile } from "./use-mobile"; 

// matchMedia mock
const mockMatchMedia = vi.fn();

// window.innerWidth mock을 위한 설정
const mockInnerWidth = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
};

// matchMedia 이벤트 리스너 관리를 위한 mock
let mockListeners: Array<() => void> = [];

describe("useIsMobile", () => {
  beforeEach(() => {
    // matchMedia mock 설정
    mockListeners = [];

    mockMatchMedia.mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((event: string, callback: () => void) => {
        if (event === "change") {
          mockListeners.push(callback);
        }
      }),
      removeEventListener: vi.fn((event: string, callback: () => void) => {
        if (event === "change") {
          mockListeners = mockListeners.filter(
            (listener) => listener !== callback
          );
        }
      }),
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: mockMatchMedia,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    mockListeners = [];
  });

  it("데스크톱 크기에서 false를 반환해야 한다", () => {
    mockInnerWidth(1024);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
    expect(mockMatchMedia).toHaveBeenCalledWith("(max-width: 767px)");
  });

  it("모바일 크기에서 true를 반환해야 한다", () => {
    mockInnerWidth(375);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
    expect(mockMatchMedia).toHaveBeenCalledWith("(max-width: 767px)");
  });

  it("정확히 768px에서 false를 반환해야 한다 (경계값)", () => {
    mockInnerWidth(768);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it("767px에서 true를 반환해야 한다 (경계값)", () => {
    mockInnerWidth(767);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it("window resize 이벤트에 반응해야 한다", () => {
    // 처음에는 데스크톱 크기
    mockInnerWidth(1024);

    const { result, rerender } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    // 모바일 크기로 변경
    mockInnerWidth(375);

    // matchMedia 이벤트 리스너 트리거
    mockListeners.forEach((listener) => listener());

    rerender();

    expect(result.current).toBe(true);
  });

  it("여러 번의 크기 변경에 올바르게 반응해야 한다", () => {
    // 모바일에서 시작
    mockInnerWidth(375);

    const { result, rerender } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);

    // 데스크톱으로 변경
    mockInnerWidth(1024);
    mockListeners.forEach((listener) => listener());
    rerender();
    expect(result.current).toBe(false);

    // 태블릿으로 변경
    mockInnerWidth(700);
    mockListeners.forEach((listener) => listener());
    rerender();
    expect(result.current).toBe(true);

    // 다시 데스크톱으로 변경
    mockInnerWidth(1200);
    mockListeners.forEach((listener) => listener());
    rerender();
    expect(result.current).toBe(false);
  });

  it("컴포넌트 언마운트 시 이벤트 리스너가 정리되어야 한다", () => {
    mockInnerWidth(1024);

    const { unmount } = renderHook(() => useIsMobile());

    expect(mockListeners.length).toBe(1);

    unmount();

    // removeEventListener가 호출되었는지 확인
    const mockMediaQueryList = mockMatchMedia.mock.results[0].value;
    expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });

  it("초기값이 undefined에서 boolean으로 변경되어야 한다", () => {
    mockInnerWidth(1024);

    const { result } = renderHook(() => useIsMobile());

    // !!undefined는 false이므로, 초기 렌더링에서도 boolean을 반환
    expect(typeof result.current).toBe("boolean");
    expect(result.current).toBe(false);
  });

  it("매우 작은 모바일 화면에서도 올바르게 동작해야 한다", () => {
    mockInnerWidth(320); // iPhone SE 크기

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it("매우 큰 데스크톱 화면에서도 올바르게 동작해야 한다", () => {
    mockInnerWidth(2560); // 4K 모니터 크기

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it("matchMedia를 올바른 쿼리로 호출해야 한다", () => {
    mockInnerWidth(1024);

    renderHook(() => useIsMobile());

    expect(mockMatchMedia).toHaveBeenCalledTimes(1);
    expect(mockMatchMedia).toHaveBeenCalledWith("(max-width: 767px)");
  });

  it("addEventListener와 removeEventListener가 올바르게 호출되어야 한다", () => {
    mockInnerWidth(1024);

    const { unmount } = renderHook(() => useIsMobile());

    const mockMediaQueryList = mockMatchMedia.mock.results[0].value;

    // addEventListener가 호출되었는지 확인
    expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );

    unmount();

    // removeEventListener가 호출되었는지 확인
    expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });
});
