// my-vite-plugin.js
export default function myVitePlugin() {
    let config;
    const compRegex = /components\/.*\.html$/g; // match files only for components folder
    const extractHtmlElRegex = /<(script|html|style)>([\s\S]*?)<\/(\1)>/g; // match script, html, style element/tags and it's inside codes
    const elTagCodeRegex = /^(\<(?<tag>.*?)\>)(?<code>[\s\S]*?)(\<\/\2>)/g; // Extract element tag (script, style or html) and inside codes


    return {
        name: 'vite-plugin-modular-component',
        configResolved(finalConfig) {
            config = finalConfig;
        },
        async transform(src, id) {
            const path = id.replace(config.root, '');
            if (compRegex.test(path)) {
                const compCodes = src.match(extractHtmlElRegex)
                    .reduce((acc, currVal) => {
                        const element = Array.from(currVal.matchAll(elTagCodeRegex))[0];
                        if (!['script', 'html', 'style'].includes(element.groups.tag)) {
                            console.log(`unknown tag: ${element.groups.tag} in the file '${id}'`) // TODO: add red color for this console.log
                            return acc
                        }

                        const replaceQuotes = (element.groups.code).replace(/['"`]/g, '\\$&');
                        return acc += `${element.groups.tag}: \`${replaceQuotes}\` ,`
                    }, '')

                return {
                    code: `export default {${compCodes}}`
                    // map: null, // Source map (optional)
                };
            }
        },
    };
}
