const ContentTooltip: React.FC<{
  content?: string;
  width?: number;
}> = ({ content, width = 120 }) => {
  return (
    <span
      className="truncate block"
      title={content}
      style={{
        width,
      }}
    >
      {content}
    </span>
  );
};

export { ContentTooltip };
