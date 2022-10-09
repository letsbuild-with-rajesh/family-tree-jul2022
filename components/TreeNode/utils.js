import html2canvas from "html2canvas";

const TREE_NODE_LEVEL_COLORS = [
  "#dbc2a6",
  "#17d9a7",
  "#a955a1",
  "#6fe9f1",
  "#fda54f",
  "#d9ed9e",
  "#2ad783",
  "#65bad7",
  "#be5572",
  "#9ed832",
];

const MAX_LEVEL = TREE_NODE_LEVEL_COLORS.length;

export const getTreeNodeLevelColor = (level) => {
  if (level > MAX_LEVEL) {
    level = level % MAX_LEVEL;
  }
  return {
    backgroundColor: TREE_NODE_LEVEL_COLORS[level - 1],
    color: "black",
  };
};

export const exportAsImage = async (element, imageFileName) => {
  const canvas = await html2canvas(element, { scale: 6 });
  const image = canvas.toDataURL("image/png", 1.0);
  downloadImage(image, imageFileName);
};

const downloadImage = (blob, fileName) => {
  const link = document.createElement("a");
  link.download = fileName;
  link.href = blob;
  link.click();
  link.remove();
};
