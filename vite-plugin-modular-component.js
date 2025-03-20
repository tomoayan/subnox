// my-vite-plugin.js
export default function myVitePlugin() {
    let config;
    const compRegex = /components\/.*\.html$/g; // match files only for components folder
    const extractHtmlElRegex = /<(.*)>([\s\S]*?)<\/(\1)>/g; // match script, html, style element/tags and it's inside codes
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
                            console.log(`\x1b[48;5;215m\x1b[38;5;9m unknown tag:\x1b[0m\x1b[38;5;229m ${element.groups.tag}\x1b[0m in the file '${id}' \x1b[0m`) // TODO: add red color for this console.log
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
