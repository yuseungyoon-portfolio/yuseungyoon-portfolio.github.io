const upperCaseLangs = [
  "CSS",
  "HTML",
  "JAVASCRIPT",
  "JSON",
  "MD",
  "TYPESCRIPT",
  "JSX",
  "TSX",
  "XML",
  "YAML",
  "SVG",
  "PLAIN TEXT",
];

const convert: Record<string, string> = {
  JAVASCRIPT: "JS",
  TYPESCRIPT: "TS",
  "PLAIN TEXT": "Plain text",
};

export const getCodeLang = (str: string) => {
  const upper = str.toUpperCase();
  const converted = convert[upper] ? convert[upper] : upper;
  return upperCaseLangs.includes(upper) ? converted : str.charAt(0).toUpperCase() + str.slice(1);
};
