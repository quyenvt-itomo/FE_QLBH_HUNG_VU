import { useState, useMemo } from "react";

const useFloatLabel = (value: any) => {
  const [focus, setFocus] = useState(false);
  const isOccupied = useMemo(
    () =>
      focus ||
      (value !== undefined && value !== null && value.toString().length !== 0),
    [focus, value],
  );
  return { focus, setFocus, isOccupied };
};

export default useFloatLabel;
