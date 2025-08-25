import { act, renderHook } from "@testing-library/react";
import { ChangeEvent } from "react";
import { describe, it, expect, vi } from "vitest";
import { useForm } from "./use-form";

// 테스트용 초기값 타입 정의
interface TestFormData {
  name: string;
  email: string;
  age: number;
  description: string;
  category: string;
  file: File | null;
}

const initialFormData: TestFormData = {
  name: "",
  email: "",
  age: 0,
  description: "",
  category: "",
  file: null,
};

describe("useForm", () => {
  it("초기값으로 state가 올바르게 설정되어야 한다", () => {
    const { result } = renderHook(() => useForm(initialFormData));

    expect(result.current.state).toEqual(initialFormData);
  });

  it("handleChange로 input 필드 값이 변경되어야 한다", () => {
    const { result } = renderHook(() => useForm(initialFormData));

    const mockEvent = {
      preventDefault: vi.fn(),
      target: {
        name: "name",
        value: "John Doe",
        type: "text",
      },
      currentTarget: {
        name: "name",
        value: "John Doe",
        type: "text",
      },
    } as unknown as ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleChange(mockEvent);
    });

    expect(result.current.state.name).toBe("John Doe");
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it("handleChange로 textarea 필드 값이 변경되어야 한다", () => {
    const { result } = renderHook(() => useForm(initialFormData));

    const mockEvent = {
      preventDefault: vi.fn(),
      target: {
        name: "description",
        value: "테스트 설명입니다.",
        type: "textarea",
      },
      currentTarget: {
        name: "description",
        value: "테스트 설명입니다.",
        type: "textarea",
      },
    } as unknown as ChangeEvent<HTMLTextAreaElement>;

    act(() => {
      result.current.handleChange(mockEvent);
    });

    expect(result.current.state.description).toBe("테스트 설명입니다.");
  });

  it("handleChange로 select 필드 값이 변경되어야 한다", () => {
    const { result } = renderHook(() => useForm(initialFormData));

    const mockEvent = {
      preventDefault: vi.fn(),
      target: {
        name: "category",
        value: "technology",
        type: "select-one",
      },
      currentTarget: {
        name: "category",
        value: "technology",
        type: "select-one",
      },
    } as unknown as ChangeEvent<HTMLSelectElement>;

    act(() => {
      result.current.handleChange(mockEvent);
    });

    expect(result.current.state.category).toBe("technology");
  });

  it("handleChange로 파일 input이 변경되어야 한다", () => {
    const { result } = renderHook(() => useForm(initialFormData));

    const mockFile = new File(["test"], "test.txt", { type: "text/plain" });
    const mockEvent = {
      preventDefault: vi.fn(),
      target: {
        name: "file",
        value: "",
        type: "file",
      },
      currentTarget: {
        name: "file",
        files: [mockFile],
        type: "file",
      },
    } as unknown as ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleChange(mockEvent);
    });

    expect(result.current.state.file).toBe(mockFile);
  });

  it("파일이 선택되지 않았을 때 null로 설정되어야 한다", () => {
    const { result } = renderHook(() => useForm(initialFormData));

    const mockEvent = {
      preventDefault: vi.fn(),
      target: {
        name: "file",
        value: "",
        type: "file",
      },
      currentTarget: {
        name: "file",
        files: null,
        type: "file",
      },
    } as unknown as ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleChange(mockEvent);
    });

    expect(result.current.state.file).toBe(null);
  });

  it("setState로 전체 state가 변경되어야 한다", () => {
    const { result } = renderHook(() => useForm(initialFormData));

    const newState: TestFormData = {
      name: "Jane Doe",
      email: "jane@example.com",
      age: 25,
      description: "새로운 설명",
      category: "design",
      file: null,
    };

    act(() => {
      result.current.setState(newState);
    });

    expect(result.current.state).toEqual(newState);
  });

  it("setState 함수형 업데이트가 동작해야 한다", () => {
    const { result } = renderHook(() => useForm(initialFormData));

    act(() => {
      result.current.setState((prevState) => ({
        ...prevState,
        name: "Updated Name",
        age: 30,
      }));
    });

    expect(result.current.state.name).toBe("Updated Name");
    expect(result.current.state.age).toBe(30);
    expect(result.current.state.email).toBe(""); // 다른 필드는 유지
  });

  it("여러 필드가 순차적으로 변경되어야 한다", () => {
    const { result } = renderHook(() => useForm(initialFormData));

    // 첫 번째 필드 변경
    const nameEvent = {
      preventDefault: vi.fn(),
      target: {
        name: "name",
        value: "John",
        type: "text",
      },
    } as unknown as ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleChange(nameEvent);
    });

    // 두 번째 필드 변경
    const emailEvent = {
      preventDefault: vi.fn(),
      target: {
        name: "email",
        value: "john@example.com",
        type: "email",
      },
    } as unknown as ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleChange(emailEvent);
    });

    expect(result.current.state.name).toBe("John");
    expect(result.current.state.email).toBe("john@example.com");
    expect(result.current.state.age).toBe(0); // 초기값 유지
  });

  it("숫자 타입 필드도 문자열로 저장되어야 한다", () => {
    const { result } = renderHook(() => useForm(initialFormData));

    const ageEvent = {
      preventDefault: vi.fn(),
      target: {
        name: "age",
        value: "25",
        type: "number",
      },
    } as unknown as ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleChange(ageEvent);
    });

    // handleChange는 항상 value를 문자열로 처리
    expect(result.current.state.age).toBe("25");
  });
});
