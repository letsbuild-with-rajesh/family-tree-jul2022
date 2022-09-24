export const getRandomColor = () => {
  const getRandomNum = () => Math.floor(Math.random() * 255);
  const r = getRandomNum();
  const g = getRandomNum();
  const b = getRandomNum();
  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
    color: "black",
  };
};
