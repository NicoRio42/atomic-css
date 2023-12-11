import { camelToKebab, escapeCss } from "./utils";

const PSEUDO_CLASS_IDENTIFIERS = ["hover", "visited"] as const;

const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

let globalCssObject: CssGlobalObject = {};

export function css(cssObject: CssObject) {
  return Object.entries(cssObject)
    .map(([key, value]) => {
      if (
        // @ts-ignore
        PSEUDO_CLASS_IDENTIFIERS.includes(key) ||
        Object.keys(BREAKPOINTS).includes(key)
      ) {
        return Object.entries(value as Partial<CSSStyleDeclaration>).map(
          ([hoverKey, hoverValue]) => {
            // @ts-ignore
            if (globalCssObject[key] === undefined) {
              // @ts-ignore
              globalCssObject[key] = {};
            }

            // @ts-ignore
            if (globalCssObject[key][hoverKey] === undefined) {
              // @ts-ignore
              globalCssObject[key][hoverKey] = [];
            }

            // @ts-ignore
            globalCssObject[key][hoverKey].push(hoverValue);
            return `${key}-${hoverKey}-${hoverValue}`;
          }
        );
      }

      // @ts-ignore
      if (globalCssObject[key] === undefined) globalCssObject[key] = [];
      // @ts-ignore
      globalCssObject[key].push(value);
      return `${key}-${value}`;
    })
    .join(" ");
}

export function generateCssString() {
  let cssString = Object.entries(globalCssObject)
    .map(([key, values]) => {
      // @ts-ignore
      if (PSEUDO_CLASS_IDENTIFIERS.includes(key)) {
        return Object.entries(
          values as Partial<Record<keyof CSSStyleDeclaration, string[]>>
        ).map(([pseudoClassKey, pseudoClassValues]) => {
          return (pseudoClassValues as string[])
            .map(
              (value) =>
                `.${key}-${pseudoClassKey}-${escapeCss(
                  value
                )}:${key}{${camelToKebab(pseudoClassKey)}:${value};}`
            )
            .join("");
        });
      }

      if (Object.keys(BREAKPOINTS).includes(key)) {
        // @ts-ignore
        return `@media (min-width: ${BREAKPOINTS[key]}) {${Object.entries(
          values as Partial<Record<keyof CSSStyleDeclaration, string[]>>
        )
          .map(([breackpointKey, breackpointValues]) => {
            return (breackpointValues as string[])
              .map(
                (value) =>
                  `.${key}-${breackpointKey}-${escapeCss(value)}{${camelToKebab(
                    breackpointKey
                  )}:${value};}`
              )
              .join("");
          })
          .join("")}}`;
      }

      return (values as string[])
        .map(
          (value) =>
            `.${key}-${escapeCss(value)}{${camelToKebab(key)}:${value};}`
        )
        .join("");
    })
    .join("");

  globalCssObject = {};
  return cssString;
}

type CssObject = Partial<
  CSSStyleDeclaration & { color: "green" | "blue" | "#123456" } & Record<
      (typeof PSEUDO_CLASS_IDENTIFIERS)[number],
      Partial<CSSStyleDeclaration>
    > &
    Record<keyof typeof BREAKPOINTS, Partial<CSSStyleDeclaration>>
>;

type CssGlobalObject = Partial<
  Record<keyof CSSStyleDeclaration, string[]> &
    Record<
      (typeof PSEUDO_CLASS_IDENTIFIERS)[number],
      Record<keyof CSSStyleDeclaration, string[]>
    > &
    Record<
      keyof typeof BREAKPOINTS,
      Record<keyof CSSStyleDeclaration, string[]>
    >
>;
