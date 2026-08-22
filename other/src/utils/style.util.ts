export const getDelayStyle = (index?: number, rate?: number) => {
  return {
    "--delay": `${(index || 0) * (rate || 0.1)}s`,
  } as React.CSSProperties;
};
