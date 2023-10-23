const urlToDynamicElement = (
  url
) => `const script = document.createElement('script');
script.src = "${url}";
script.async = true;`;

/**
 * @description Injects an array of array list of script into the Astro site
 * @example
 * import injectScripts from "astro-inject-scripts";
 * injectScripts(["console.log(1337)", "/js/index.js", "https://example.com/script.js"])
 * @type {() => import('astro').AstroIntegration}
 */
export default (options: {
  injectionMap: string[] | string[2][] | { key: string; value: string }[];
}) => {
  return {
    name: "astro-inject-scripts",
    hooks: {
      "astro:config:setup": ({ injectScript }) => {
        options.injectionMap.map((x) => {
          if (typeof x === "string") {
            // ! if they put url, turn into inject compatible script
            if (
              x.toLowerCase().startsWith("http") &&
              x.toLowerCase().endsWith("js")
            )
              x = urlToDynamicElement(x);

            injectScript("head-inline", x);
          } else {
            injectScript(x[0], x[1]);
          }
        });
      },
    },
  };
};
