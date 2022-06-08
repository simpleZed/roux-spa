"use strict";
const scriptRunner =
{
    createScript: function (attributes)
    {
        return attributes.flatMap(a => this.processElements(a.tag, a.selector, a.attribute));
    },
    processElements: function (element, selector, attributes)
    {
        return attributes.map(a =>
        {
            const parts = a.split("::");
            return Object({ "key": parts[0], "value": parts[1] });
        })
        .map(s => this.processAttribute(element, selector, s));
    },
    processAttribute: function (element, selector, attribute)
    {
        element.removeAttribute(attribute.key);
        element.setAttribute(selector, "");
        const innerCode = selector === "code" ? this.generateCode(element) : "";
        switch (attribute.key)
        {
            case "if":
                return element.createConditional(attribute.value, selector);
            case "repeat":
                return element.createRepeat(attribute.value, selector);
                case "bind":
                    return element.createBinder(attribute.value, selector);
            case "code":
                return element.createCode(selector)
                              .prepend(innerCode);
        }
    },
    generateCode: function (element)
    {
        return converter(element.querySelectorAll("*"))
                    .map(e => {
                        const attributes = e.getAttributeNames()
                                            .filter(n => n.isCustomAttribute());
                        return Object({
                            tag: e,
                            selector: Math.nextWord(32),
                            attribute: attributes.zip(attributes.map(a => e.getAttribute(a)),
                                                        (x, y) => `${x}::${y}`)
                        });
                    })
                    .filter(t => t.attribute.some(a => a))
                    .groupBy(t => t.tag.outerHTML)
                    .flatMap(g => this.createScript(g.groups))
                    .join("");
    }
};