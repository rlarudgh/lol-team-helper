import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

/**
 * ### useForm
 * form을 관리하기 위해 만들어진 훅입니다.
 * state를 관리하고 state를 변경하는 함수를 제공합니다.
 *
 * **returns**
 * - state: form state
 * - handleChange: form state 변경 함수
 * - setState: form state 변경 함수
 */
export function useForm<T>(initial: T) {
  const [state, setState] = useState<T>(initial);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    e.preventDefault();
    const { name, value, type } = e.target;

    if (type === "file") {
      const file =
        (e.currentTarget as HTMLInputElement | null)?.files?.[0] || null;
      setState({ ...state, [name]: file });
      return;
    }
    setState({ ...state, [name]: value });
  };

  return { state, handleChange, setState } as {
    state: T;
    handleChange: (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void;
    setState: Dispatch<SetStateAction<T>>;
  };
}
