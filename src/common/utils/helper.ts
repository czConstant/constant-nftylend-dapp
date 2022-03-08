export const getAvatarName = (name: string) => {
  let words = "";
  if (name && name.split(" ").length > 0) {
    name.split(" ").length = 2;
    const arrName = name.split(" ");
    words = arrName[0].charAt(0);
    if (arrName[1]) {
      words += arrName[1].charAt(0);
    } else if (arrName[0].charAt(1)) {
      words += arrName[0].charAt(1);
    }
    words = words.toUpperCase();
  }
  return words;
};
