const burmeseDays = [
  "တနင်္ဂနွေ",
  "တနင်္လာ",
  "အင်္ဂါ",
  "ဗုဒ္ဓဟူး",
  "ကြာသပတေး",
  "သောကြာ",
  "စနေ",
];
const burmeseEmptyValue = "၀";
const burmeseEmptyAge = "၆ လသား";
const burmeseDayNight = ["မနက်", "ညနေ"];
const burmeseNumber = {
  "0": "၀",
  "1": "၁",
  "2": "၂",
  "3": "၃",
  "4": "၄",
  "5": "၅",
  "6": "၆",
  "7": "၇",
  "8": "၈",
  "9": "၉",
};
const year = "နှစ်";
const half = "ခွဲ";

export function translateNumber(input) {
  return (input || "၀")
    .toString()
    .split("")
    .map((c) => burmeseNumber[c] || c)
    .join("");
}

export function translateAge(age) {
  let [Y, M] = (age || 0)
    .toString()
    .split(".")
    .map((a) => parseInt(a) || 0);
  if (Y == 0) {
    return burmeseEmptyAge;
  }
  return `${translateNumber(Y)} ${year}${M ? half : ""}`;
}

var defaultFormat = "d/m/Y D၊ A h:i:s";
// return format d/m/Y D, h:i(A)
export function translateDateTime(dt, format) {
  if (!dt instanceof Date) return dt;
  let d = translateNumber(dt.getDate());
  let m = translateNumber(dt.getMonth() + 1);
  let Y = translateNumber(dt.getFullYear());
  let D = dt.getDay();
  let H = dt.getHours();
  let i = translateNumber(dt.getMinutes());
  let s = translateNumber(dt.getSeconds());
  // let z = dt.getTimezoneOffset();
  let A = H < 12;
  let h = translateNumber(A ? H : H - 12);
  D = burmeseDays[D];
  H = translateNumber(H);
  A = burmeseDayNight[A ? 0 : 1];
  if (h.length < 2) h = burmeseEmptyValue + h;
  if (H.length < 2) H = burmeseEmptyValue + H;
  if (m.length < 2) m = burmeseEmptyValue + m;
  if (i.length < 2) i = burmeseEmptyValue + i;
  if (s.length < 2) s = burmeseEmptyValue + s;
  let formatted = (format || defaultFormat)
    .replace(/d/gm, d)
    .replace(/m/gm, m)
    .replace(/Y/gm, Y)
    .replace(/D/gm, D)
    .replace(/H/gm, H)
    .replace(/h/gm, h)
    .replace(/i/gm, i)
    .replace(/s/gm, s)
    .replace(/A/gm, A);
  return formatted;
}
