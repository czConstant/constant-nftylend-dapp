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

export const isUrl = (str: string) => {
  const regex = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  return regex.test(str);
};

export const isSameAddress = (a: string, b: string): boolean => {
  if (!a) return false;
  return a.toLowerCase() === b.toLowerCase();
}

export const injectScript = ({ fromSrc, fromCode, attrs = [] }) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    if (fromSrc) {
      script.async = true;
      script.src = fromSrc;
      script.addEventListener('load', resolve);
      script.addEventListener('error', () => reject(`Error loading script. ${String(fromSrc)}`));
      script.addEventListener('abort', () => reject(`Script loading aborted. ${String(fromSrc)}`));
    } else if (fromCode) {
      script.text = String(fromCode);
    }
    Object.entries(attrs)
      .forEach(([key, value]) => {
        script[key] = value; 
      });
    document.head.appendChild(script);
  });
}
