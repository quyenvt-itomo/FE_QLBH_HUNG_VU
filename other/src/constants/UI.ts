export const COLORS = {
  PRIMARY: "#006EC4",
  SECONDARY: "#747E76",
  ERROR: "#FF0000",
  BACKGROUND: "#F1F1F1",
  TEXT: "#333333",

  BLACK: "#16151C",

  // side bar
  SIDEBAR_BG: "#C4DAEB",

  BORDER: "#CCC",

  ORANGE: "#FF5400",
};

export const FONT_SIZES = {
  SMALL: ".75rem",
  MEDIUM: "1rem",
  LARGE: "1.125rem",
};

export const TAG_COLORS = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
];

export const CSS = {
  container: {
    // padding: "20px",
    border: ".5px solid #d9d9d9",
    borderRadius: "8px",
    backgroundColor: "#FFF",
  },
  center_column: {
    onHeaderCell: () => ({
      style: {
        position: "relative",
        textAlign: "center",
        borderRightWidth: 0.5,
        borderStyle: "solid",
        borderColor: "#d9d9d9",
      },
    }),
    ellipsis: true,
  },
};

export const CLASSNAME = {
  table: `
    table-h-full
    no-radius-table
    table-custom-row
    `,
  detail_table: `
    table-h-full
    no-radius-table
    table-custom-row
    product__table
    highlight-table
    order-detail-table
    `,
};
