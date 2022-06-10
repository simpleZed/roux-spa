"use strict";
const rouxUtils =
{
    request: function (url, requestInfo)
    {
        return new Promise((resolve, reject) => {
            try
            {
                const requester = new XMLHttpRequest();
                requester.onload = () => resolve({
                    url: requester.responseURL,
                    text()
                    {
                        return requester.responseText;
                    },
                    json()
                    {
                        return JSON.parse(this.text());
                    }
                });
                requester.open(requestInfo.method, url, true);
                requester.send(requestInfo.body);
            }
            catch (ex)
            {
                console.log(ex);
                reject(ex);
            }
        });
    },
    toArray: function (iterable)
    {
        const result = [];
        for (const item of iterable)
        {
            result.push(item);
        }
        return result;
    },
    swap: function (min, max)
    {
        try
        {
            return min > max ? [max, min] : [min, max];
        }
        catch (ex)
        {
            console.error(ex);
            if (min > max)
            {
                const temp = min;
                min = max;
                max = temp;
            }
            return [min, max];
        }
    }
};
const rouxCodeGenerator =
{
    generateHandlerCode: function (f, parameters)
    {
        return `if(rouxCodeGenerator.hasGlobalVariables(variableNames))
{
    tracker.onGlobalValueChanged.combine(parameters =>
    {
        const variable = "scope." + parameters.name;
        if(variableNames.includes(variable))
        {
            ${f}(${parameters});
        }
    });
}
tracker.onValueChanged.combine(parameters =>
{
    const variable = "scope." + parameters.name;
    if(parameters.page === "${tracker.page}" && variableNames.includes(variable))
    {
        ${f}(${parameters});
    }
});
`;
    },
    hasGlobalVariables: function (variableNames)
    {
        return variableNames.includes("scope.$");
    },
    isGlobalVariable: function (variableNames)
    {
        return variableNames.startsWith("$");
    },
    generateReplaceCode: function (text, value, all = true)
    {
        return all ? `replaceAll("${text}", ${value})`
                   : `replace("${text}", ${value})`;
    },
    parseVariablesInHtml: function (html)
    {
        converter(html.matchAll(RegExp(`(?<=@{1}[(]{1})(.*)(?=[)]{1})`, 'g'), `$1`))
            .flatMap(m => m)
            .unique()
            .map(m => Object({
                placeholder: `@(${m})`,
                sub: `\${${m.replaceAll("_", "scope.")}}`
            }))
            .forEach(s => html = html.replaceAll(s.placeholder, s.sub));
        return html;
    },
    generateCodeFromHtml: function (html, selector, scope)
    {
        const code =  converter(html.matchAll(RegExp(`@{([^@]*)}`, 'g')))
                        .flatMap(m => m)
                        .filter(m => !m.startsWith("@"))
                        .map(s => this.generateFunction(s.trim()))
                        .join("")
                        .trim()
                        .prepend("const functions = Function.createMulticast(() => {});\r\n");
return `${code}
scope =>
{
    const element = roux.getApp()
                        .querySelector("[${selector}='']");
    return functions.invoke(Object({element, scope}));
}
`.asJson();
    },
    generateFunction: function (code)
    {
        return `functions.combine((parameter) =>
{
        try
        {
            const element = parameter.element;
            const scope = parameter.scope;
            ${code}
        }
        catch(ex)
        {
            console.error(ex);
            console.warn("check your syntax.");
        }
});
`.toJsCode();
    }
};
const web_request = fetch ?? rouxUtils.request;
const converter = Array.from ?? rouxUtils.toArray;