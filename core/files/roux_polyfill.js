"use strict";
const rouxPolyfill =
{
    bootstrap: function ()
    {
        if (!Object.isNull)
        {
            Object.isNull = (obj) => obj === null;
        }
        if (!Object.isNotDefined)
        {
            Object.isNotDefined = (obj) => obj === undefined;
        }
        if (!Object.exists)
        {
            Object.exists = (obj) => !Object.isNotDefined(obj) && !Object.isNull(obj);
        }
        if (!Object.prototype.exists)
        {
            Object.prototype.exists = function ()
            {
                return Object.exists(this);
            }
        }
        if (!Object.parse)
        {
            Object.parse = (text) => eval(`Object({ ${text} })`);
        }
        if (!Object.values)
        {
            Object.values = (item) => item.keys().map(k => item[k]);
        }
        if (!Object.createCollector)
        {
            Object.createCollector = (mapping) => mapping.values()
                                                         .map(v => `'${v}': []`)
                                                         .join(", ")
                                                         .toObject();
        }
        if (!Object.prototype.is)
        {
            Object.prototype.is = function (type)
            {
                return this instanceof type;
            }
        }
        if (!Object.prototype.isOneOf)
        {
            Object.prototype.isOneOf = function (types)
            {
                return types.some(t => this.is(t));
            }
        }
        if (!Object.prototype.keys)
        {
            Object.prototype.keys = function ()
            {
                return Object.keys(this);
            }
        }
        if (!Object.prototype.values)
        {
            Object.prototype.values = function ()
            {
                return Object.values(this);
            }
        }
        if (!Object.prototype.mapKeys)
        {
            Object.prototype.mapKeys = function ()
            {
                return this.keys()
                           .map(k => `${k}: ${v}`)
                           .join(", ")
                           .toObject();
            }
        }
        if (!Object.prototype.subscribe)
        {
            Object.prototype.subscribe = function (handler, track = true)
            {
                this.keys()
                    .filter(k => !["__runAfter__", "__runBefore__", "page"].includes(k))
                    .forEach(k =>
                    {
                        const value = this[k];
                        const isReadOnly = value.is(FrozenValue);
                        if (!k.startsWith("$"))
                        {
                            if (track)
                            {
                                tracker.track(this.page, k, value, isReadOnly);
                            }
                            this.addPagedProxyHandler(k, handler.setter, handler.getter);
                        }
                        else
                        {
                            if (track)
                            {
                                tracker.trackGlobal(k, value, isReadOnly);
                            }
                            this.addProxyHandler(k, handler.globalSetter, handler.globalGetter);
                        }
                    });
            }
        }
        if (!Object.prototype.unsubscribe)
        {
            Object.prototype.unsubscribe = function ()
            {
                this.keys()
                    .filter(k => !["__runAfter__", "__runBefore__", "page"].includes(k))
                    .forEach(k =>
                    {
                        if (!k.startsWith("$"))
                        {
                            tracker.untrack(k, this.page);
                            this.removeProxyHandler(k, this[k]);
                        }
                        else
                        {
                            tracker.untrackGlobal(k);
                            this.removeProxyHandler(k, this[k]);
                        }
                    });
            }
        }
        if (!Object.prototype.removeProxyHandler)
        {
            Object.prototype.removeProxyHandler = function (name, value)
            {
                if (Object.defineProperty)
                {
                    Object.defineProperty(this, name,
                    {
                            enumerable: true,
                            configurable: true,
                            value: value,
                            writable: !value.is(FrozenValue)
                    });
                }
                else
                {
                    this.__defineSetter__(name, value =>
                    {
                        if (!value.is(FrozenValue))
                        {
                            this.__defineGetter__(name, () => value);
                        }
                        else
                        {
                            throw `${name} is a readonly field`;
                        }
                    });
                    this.__defineGetter__(name, () => value);
                }
            }
        }
        if (!Object.prototype.addProxyHandler)
        {
            Object.prototype.addProxyHandler = function (name, set, get)
            {
                let isReadOnly = this[name].is(FrozenValue);
                const setter = (value) =>
                {
                    if (!isReadOnly)
                    {
                        set(name, value);
                        isReadOnly = value.is(FrozenValue);
                    }
                    else
                    {
                        throw `${name} is readonly and can't be changed.`;
                    }
                };
                const getter = () => get(name);
                if (Object.defineProperty)
                {
                    Object.defineProperty(this, name,
                    {
                        configurable: true,
                        enumerable: true,
                        set: setter,
                        get: getter
                    });
                }
                else
                {
                    this.__defineSetter__(name, setter);
                    this.__defineGetter__(name, getter);
                }
            }
        }
        if (!Object.prototype.addPagedProxyHandler)
        {
            Object.prototype.addPagedProxyHandler = function (name, set, get)
            {
                let isReadOnly = this[name].is(FrozenValue);
                const setter = (value) =>
                {
                    if (!isReadOnly)
                    {
                        set(tracker.page, name, value);
                        isReadOnly = value.is(FrozenValue);
                    }
                    else
                    {
                        throw `${name} is readonly and can't be changed`;
                    }
                };
                const getter = () => get(tracker.page, name);
                if (Object.defineProperty)
                {
                    Object.defineProperty(this, name,
                    {
                        configurable: true,
                        enumerable: true,
                        set: setter,
                        get: getter
                    });
                }
                else
                {
                    this.__defineSetter__(name, setter);
                    this.__defineGetter__(name, getter);
                }
            }
        }
        if (!Object.prototype.asJson)
        {
            Object.prototype.asJson = function ()
            {
                return JSON.stringify(this);
            }
        }
        if (!String.prototype.toObject)
        {
            String.prototype.toObject = function ()
            {
                return Object.parse(this);
            }
        }
        if (!String.prototype.prepend)
        {
            String.prototype.prepend = function (text)
            {
                return `${text}${this}`;
            }
        }
        if (!String.prototype.prependIf)
        {
            String.prototype.prependIf = function (text, condition)
            {
                return condition(this) ? this.prepend(text) : this;
            }
        }
        if (!String.prototype.append)
        {
            String.prototype.append = function (text)
            {
                return `${this}${text}`;
            }
        }
        if (!String.prototype.appendIf)
        {
            String.prototype.appendIf = function (text, condition)
            {
                return condition(this) ? this.append(text) : this;
            }
        }
        if (!String.prototype.eval)
        {
            String.prototype.eval = function ()
            {
                return eval(this);
            }
        }
        if (!String.prototype.dump)
        {
            String.prototype.dump = function ()
            {
                console.log(this);
            }
        }
        if (!String.prototype.endsWith)
        {
            String.prototype.endsWith = function (query)
            {
                return this.length >= query.length &&
                       this.substring(this.length - query.length, this.length) === query;
            }
        }
        if (!String.prototype.startsWith)
        {
            String.prototype.startsWith = function (query)
            {
                return this.length >= query.length &&
                       this.substring(0, query.length) === query;
            }
        }
        if (!String.prototype.isNullOrWhiteSpace)
        {
            String.prototype.isNullOrWhiteSpace = function ()
            {
                return this === null || this.trim().length <= 0;
            }
        }
        if (!String.prototype.repeatWith)
        {
            String.prototype.repeatWith = function (quantity, separator)
            {
                return Array.repeat(quantity, this).join(separator);
            }
        }
        if (!String.prototype.removeSuffix)
        {
            String.prototype.removeSuffix = function (suffix)
            {
                return this.endsWith(suffix) ? this.substring(0, this.length - suffix.length)
                                             : this;
            }
        }
        if (!String.prototype.removePrefix)
        {
            String.prototype.removePrefix = function (prefix)
            {
                return this.startsWith(prefix) ? this.substring(prefix.length, this.length)
                                               : this;
            }
        }
        if (!String.prototype.isCustomAttribute)
        {
            String.prototype.isCustomAttribute = function ()
            {
                return ["if", "repeat", "code", "bind"].includes(this);
            }
        }
        if (!String.prototype.toJsCode)
        {
            String.prototype.toJsCode = function ()
            {
                return this.replaceAll("&amp;&amp;", "&&")
                           .replaceAll("&gt;", ">")
                           .replaceAll("&lt;", "<");
            }
        }
        if (!String.prototype.asFunction)
        {
            String.prototype.asFunction = function (parameterList)
            {
                return `${parameterList} => ${this}`.eval();
            }
        }
        if (!Array.range)
        {
            Array.range = (from, to, step = 1) =>
            {
                [from, to] = rouxUtils.swap(from, to);
                step = Math.abs(step);
                const result = [];
                for (let index = from; index < to; index += step)
                {
                    result.push(index);
                }
                return result;
            }
        }
        if (!Array.repeat)
        {
            Array.repeat = (quantity, item) =>
            {
                return Array.range(0, quantity).map(_ => item);
            }
        }
        if(!Array.prototype.mapAllKeys)
        {
            Array.prototype.mapAllKeys = function ()
            {
                return this.map(o => o.mapKeys());
            }
        }
        if (!Array.prototype.harvestAll)
        {
            Array.prototype.harvestAll = function (mapping = null)
            {
                mapping ??= this.mapAllKeys();
                const collector = Object.createCollector(mapping);
                mapping.keys()
                       .zip(mapping.values(),
                           (k, v) => Object({
                                 "key": collector[v],
                                 "value": this.map(m => m[k])
                           }))
                    .forEach(c => c.key.push(c.value));
                return collector;
            }
        }
        if (!Array.prototype.oneOf)
        {
            Array.prototype.oneOf = function (predicate = i => true)
            {
                for (const item of this)
                {
                    if (predicate(item))
                    {
                        return item;
                    }
                }
            }
        }
        if (!Array.prototype.groupBy)
        {
            Array.prototype.groupBy = function (by)
            {
                const groupings = [];
                for (const item of this)
                {
                    const grouping = groupings.oneOf(g => g.key === by(item));
                    if (grouping)
                    {
                        grouping.groups.push(item);
                    }
                    else
                    {
                        groupings.push({
                            "key": by(item),
                            "groups": [item]
                        });
                    }
                }
                return groupings;
            }
        }
        if (!Array.prototype.forEach)
        {
            Array.prototype.forEach = function (action)
            {
                for (const item of this)
                {
                    action(item);
                }
            }
        }
        if (!Array.prototype.map)
        {
            Array.prototype.map = function (selector)
            {
                const result = [];
                for (const item of this)
                {
                    result.push(selector(item));
                }
                return result;
            }
        }
        if (!Array.prototype.except)
        {
            Array.prototype.except = function (array)
            {
                let result = [];
                for (const item of this)
                {
                    if (!result.includes(item) && !array.includes(item))
                    {
                        result.push(item);
                    }
                }
                return result;
            }
        }
        if (!Array.prototype.intersect)
        {
            Array.prototype.intersect = function (array)
            {
                let result = [];
                for (const item of this)
                {
                    if (!result.includes(item) && array.includes(item))
                    {
                        result.push(item);
                    }
                }
                return result;
            }
        }
        if (!Array.prototype.union)
        {
            Array.prototype.union = function (array)
            {
                let result = [];
                for (const item of this)
                {
                    if (!result.includes(item))
                    {
                        result.push(item);
                    }
                }
                for (const item of array)
                {
                    if (!result.includes(item))
                    {
                        result.push(item);
                    }
                }
                return result;
            }
        }
        if (!Array.prototype.unique)
        {
            Array.prototype.unique = function ()
            {
                let result = [];
                for (const item of this)
                {
                    if (!result.includes(item))
                    {
                        result.push(item);
                    }
                }
                return result;
            }
        }
        if (!Array.prototype.uniqueBy)
        {
            Array.prototype.uniqueBy = function (by)
            {
                let result = [];
                for (const item of this)
                {
                    if (!result.some(i => by(i) === by(item)))
                    {
                        result.push(item);
                    }
                }
                return result;
            }
        }
        if (!Array.prototype.symmetricExcept)
        {
            Array.prototype.symmetricExcept = function (array)
            {
                return this.except(array).union(array.except(this));
            }
        }
        if (!Array.prototype.crossJoin)
        {
            Array.prototype.crossJoin = function (array, selector = (x, y) => [x, y])
            {
                return this.map(x => array.map(y => selector(x, y)));
            }
        }
        if (!Array.prototype.zip)
        {
            Array.prototype.zip = function (array, selector = (x, y) => [x, y])
            {
                return this.map((x, i) => selector(x, array[i]));
            }
        }
        if(!Array.prototype.zipAll)
        {
            Array.prototype.zipAll = function (selector = (x, y) => [x, y])
            {
                return this[0].map((e, i) => this.skip(1).map(a => selector(e, a[i])));
            }
        }
        if (!Array.prototype.crossJoinAll)
        {
            Array.prototype.crossJoinAll = function (selector = (x, y) => [x, y])
            {
                return this[0].map(e => this.skip(1).flatMap(a => a.map(x => selector(e, x))));
            }
        }
        if (!Array.prototype.flatZipAll)
        {
            Array.prototype.flatZipAll = function (selector = (x, y) => [x, y])
            {
                return this[0].flatMap((e, i) => this.skip(1).map(a => selector(e, a[i])));
            }
        }
        if (!Array.prototype.flatCrossJoinAll)
        {
            Array.prototype.flatCrossJoinAll = function (selector = (x, y) => [x, y])
            {
                return this[0].flatMap(e => this.skip(1).flatMap(a => a.map(x => selector(e, x))));
            }
        }
        if (!Array.prototype.skip)
        {
            Array.prototype.skip = function (quantity)
            {
                let result = [];
                let counter = 0;
                for (const item of this)
                {
                    if (++counter > quantity)
                    {
                        result.push(item);
                    }
                }
                return result;
            }
        }
        if (!Array.prototype.take)
        {
            Array.prototype.take = function (quantity)
            {
                let result = [];
                let counter = 0;
                for (const item of this)
                {
                    if (++counter <= quantity)
                    {
                        result.push(item);
                    }
                }
                return result;
            }
        }
        if (!Array.prototype.takeWhile)
        {
            Array.prototype.takeWhile = function (predicate)
            {
                let result = [];
                for (const item of this)
                {
                    if (predicate(item))
                    {
                        result.push(item);
                    }
                    else
                    {
                        return result;
                    }
                }
            }
        }
        if (!Array.prototype.skipWhile)
        {
            Array.prototype.skipWhile = function (predicate)
            {
                let result = [];
                let canJump = true;
                for (const item of this)
                {
                    if(canJump && predicate(item))
                    {
                        continue;
                    }
                    canJump = false;
                    result.push(item);
                }
                return result;
            }
        }
        if (!Array.prototype.chunks)
        {
            Array.prototype.chunks = function (quantity)
            {
                if (this.length === 0)
                {
                    return;
                }
                const results = [[this[0]]];
                let total = 0;
                let groups = 0;
                let counter = 0;
                for (const item of this)
                {
                    total++;
                    if (total === 1)
                    {
                        continue;
                    }
                    if (++counter < quantity)
                    {
                        results[groups].push(item);
                    }
                    else
                    {
                        counter = 0;
                        groups++;
                        results.push([item]);
                    }
                }
                return results;
            }
        }
        if (!Function.createMulticast)
        {
            Function.createMulticast = (f) =>
            {
                if (f.is(Function))
                {
                    f.functions = [];
                    return f;
                }
                throw "value must be a Function";
            }
        }
        if (!Function.prototype.combine)
        {
            Function.prototype.combine = function (f)
            {
                this.functions ??= [this];
                this.functions.push(f);
                return this;
            }
        }
        if (!Function.prototype.removeFunction)
        {
            Function.prototype.removeFunction = function (f)
            {
                if (!this.functions || this.functions.length === 0)
                {
                    return this;
                }
                this.functions = this.functions.filter(g => g !== f);
                return this;
            }
        }
        if (!Function.prototype.invoke)
        {
            Function.prototype.invoke = function (parameter)
            {
                return this.functions.map(f => f(parameter));
            }
        }
        if (!Function.prototype.compose)
        {
            Function.prototype.compose = function ()
            {
                return this.functions.reduce((f, g) => p => f(g(p)));
            }
        }
        if (!Function.prototype.composeWith)
        {
            Function.prototype.composeWith = function (parameter)
            {
                return this.compose()(parameter);
            }
        }
        if (!Function.prototype.decorate)
        {
            Function.prototype.decorate = function (before, after)
            {
                return this.functions.map(f => p => after(f(before(p))));
            }
        }
        if (!Function.prototype.decorateWith)
        {
            Function.prototype.decorateWith = function (parameter, before, after)
            {
                return this.decorate(before, after).map(d => d(parameter));
            }
        }
        if (!Element.prototype.HTMLWithoutAttribute)
        {
            Element.prototype.HTMLWithoutAttribute = function (attribute)
            {
                this.removeAttribute(attribute);
                return this.outerHTML;
            }
        }
        if (!Element.prototype.isCustomTag)
        {
            Element.prototype.isCustomTag = function ()
            {
                return this.tagName.toLowerCase().endsWith("-js");
            }
        }
        if (!Element.prototype.toNormalTag)
        {
            Element.prototype.toNormalTag = function (newTag)
            {
                return !this.isCustomTag() ? this.outerHTML
                                           : this.outerHTML.replaceAll(this.tagName.toLowerCase(), newTag);
            }
        }
        if (!Element.prototype.createConditional)
        {
            Element.prototype.createConditional = function (condition, selector)
            {
                try
                {
                    const otherValue = this.getAttribute("else");
                    if (otherValue)
                    {
                        this.removeAttribute("else");
                    }
                    const code = condition.replaceAll("@", "scope.");
                    const handlerCode = rouxCodeGenerator.generateHandlerCode(`generated_conditional_${selector}`,
                                                                              `${code}, ${Boolean(otherValue)}`);
                    return `const generated_conditional_${selector} = (value, hasElse) =>
{
    try
    {
        const elements = app.querySelectorAll("[${selector}='']");
        if(!Object.exists(elements))
        {
            return;
        }
        if(!value)
        {
            elements.forEach(e => e.hidden = true);
            if(hasElse)
            {
                app.querySelectorAll("${otherValue}")
                   .forEach(e => e.hidden = false);
            }
        }
        else
        {
            elements.forEach(e => e.hidden = false);
            if(hasElse)
            {
                app.querySelectorAll("${otherValue}")
                   .forEach(e => e.hidden = true);
            }
        }
    }
    catch(ex)
    {
        console.error(ex);
        console.info("Incorrect if syntax");
        console.info("use @ to refer to variables");
        console.info("Correct syntax: if='@condition' and an optional else='selector'");
    }
}
const execute_conditional_${selector} = () =>
{
    try
    {
        const variableNames = "${code}";
        if(variableNames.includes("scope."))
        {
            ${handlerCode}
        }
        generated_conditional_${selector}(${code}, ${Boolean(otherValue)});
    }
    catch(ex)
    {
        console.error(ex);
        console.info("Incorrect if syntax");
        console.info("use @ to refer to variables");
        console.info("Correct syntax: if='@condition' and an optional else='selector'");
    }
}
execute_conditional_${selector}();
`;
                }
                catch (ex)
                {
                    console.error(ex);
                    console.info("Incorrect if syntax");
                    console.info("use @ to refer to variables");
                    console.info("Correct if syntax: if='@condition' and an optional else='selector'");
                    return "";
                }
            }
        }
        if (!Element.prototype.createRepeat)
        {
            Element.prototype.createRepeat = function(value, selector)
            {
                try
                {
                    const hasVariable = value.includes("@");
                    const quantity = hasVariable ? value.replaceAll("@", "Math.abs(scope.").append(")")
                                                 : Math.abs(value);
                    const handlerCode = rouxCodeGenerator.generateHandlerCode(`generated_repeat_${selector}`, quantity);
                    return `const generated_repeat_${selector} = (quantity) =>
{
    try
    {
        const elements = converter(app.querySelectorAll("[${selector}='']"));
        const element = elements.oneOf();
        if(!Object.exists(element))
        {
            return;
        }
        if(quantity === 0)
        {
            elements.forEach(e => e.hidden = true);
            return;
        }
        elements.forEach(e => e.hidden = false);
        quantity -= elements.length;
        if(quantity === 0)
        {
            return;
        }
        else if(quantity < 0)
        {
            elements.take(-quantity).forEach(e => e.remove());
        }
        else
        {
            const html = Array.repeat(quantity, element.outerHTML).join("");
            element.insertAdjacentHTML("afterEnd", html);
        }
    }
    catch(ex)
    {
        console.error(ex);
        console.info("Incorrect repeat syntax");
        console.info("use @ to refer to variables");
        console.info("Correct repeat syntax: repeat=Number or repeat=@variable");
    }
}
const execute_repeat_${selector} = () =>
{
    try
    {
        if(${hasVariable})
        {
            const variableNames = "${quantity}";
            ${handlerCode}
        }
        generated_repeat_${selector}(${quantity});
    }
    catch(ex)
    {
        console.error(ex);
        console.info("Incorrect repeat syntax");
        console.info("use @ to refer to variables");
        console.info("Correct repeat syntax: repeat=Number or repeat=@variable");
    }
}
execute_repeat_${selector}();
`;
                }
                catch (ex)
                {
                    console.error(ex);
                    console.info("Incorrect repeat syntax");
                    console.info("use @ to refer to variables");
                    console.info("Correct repeat syntax: repeat=Number or repeat=@variable");
                    return "";
                }
            }
        }
        if (!Element.prototype.createCode)
        {
            Element.prototype.createCode = function (selector)
            {
                try
                {
                    const script = rouxCodeGenerator.generateCodeFromHtml(this.outerHTML, selector);
                    const html = rouxCodeGenerator.parseVariablesInHtml(this.outerHTML);
                    const variableNames = converter(html.matchAll(RegExp(`scope..*(?=})`, "g")))
                                                .flatMap(m => m)
                                                .join("");
                    this.outerHTML = html.replaceAll(RegExp(`@{([^@]*)}`, 'g'), `value_${selector}`);
                    const handlerCode = rouxCodeGenerator.generateHandlerCode(`generated_code_${selector}`, "element.outerHTML");
                    return `const generated_code_${selector} = (code) =>
{
    try
    {
        const element = app.querySelector("[${selector}='']");
        if(!Object.exists(element))
        {
            return;
        }
        element.hidden = true;
        const g = ${script}.eval();
        const result = g(scope);
        const value = result !== undefined ? result : "";
        code = code.replace("value_${selector}", value.is(Array) ? value.join("") : value)
                   .replaceAll("value_${selector}", "");
        const f = ("\`" + code.toJsCode() + "\`;").asFunction("scope");
        element.outerHTML = f(scope);
        element.hidden = false;
    }
    catch(ex)
    {
        console.error(ex);
        console.warn("Invalid syntax detected");
        console.warn("@(code) for inline code and @{code} for multiline code.");
    }
}
const execute_code_${selector} = () =>
{
    try
    {
        const variableNames = "${variableNames}";
        const element = app.querySelector("[${selector}='']");
        if(variableNames.includes("scope."))
        {
            ${handlerCode}
        }
        generated_code_${selector}(element.outerHTML);
    }
    catch(ex)
    {
        console.error(ex);
        console.warn("Invalid syntax detected");
        console.warn("@(code) for inline code and @{code} for multiline code.");
    }
}
execute_code_${selector}();
`;
                }
                catch (ex)
                {
                    console.error(ex);
                    console.warn("Invalid syntax detected");
                    console.warn("@(code) for inline code and @{code} for multiline code.");
                }
            }
        }
        if (!Element.prototype.createBinder)
        {
            Element.prototype.createBinder = function (binderOptions, selector)
            {
                const io = Math.nextWord(32);
                this.setAttribute(io, false);
                const variable = binderOptions.replaceAll('@', '');
                const code = binderOptions.replaceAll("@", "scope.").asJson();
                const bindMode = this.hasAttribute("bind-mode") ? this.getAttribute("bind-mode")
                                                                : "both";
                const handlerCode = rouxCodeGenerator.generateHandlerCode(`generated_binder_${selector}`, "eval(variableNames)");
                return `const generated_binder_${selector} = (variable) =>
{
    try
    {
            converter(app.querySelectorAll("[${selector}='']"))
                .forEach(e =>
                {
                    let timeoutId = undefined;
                    switch("${bindMode}")
                    {
                        case "html":
                            e.oninput = ev =>
                            {
                                ev.stopPropagation();
                                ev.preventDefault();
                                if(!ev.target["${io}"])
                                {
                                    timeoutId = setTimeout(() =>
                                    {
                                        scope["${variable}"] = e.value;
                                        ev.target["${io}"] = false;
                                        clearTimeout(timeoutId);
                                    }, 5_000);
                                    ev.target["${io}"] = true;
                                }
                            };
                            break;
                        case "js":
                            e.value = scope["${variable}"];
                            break;
                        case "both":
                        default:
                            e.value = scope["${variable}"];
                            e.oninput = ev =>
                            {
                                ev.stopPropagation();
                                ev.preventDefault();
                                if(!ev.target["${io}"])
                                {
                                    timeoutId = setTimeout(() =>
                                    {
                                        scope["${variable}"] = e.value;
                                        ev.target["${io}"] = false;
                                        clearTimeout(timeoutId);
                                    }, 5_000);
                                    ev.target["${io}"] = true;
                                }
                            };
                            break;
                    }
                });
    }
    catch(ex)
    {
        console.error(ex);
        console.warn("Incorrect bind syntax.");
        console.warn("The correct usage of bind is bind='@value'");
    }
}
const execute_binder_${selector} = () =>
{
    try
    {
        const variableNames = ${code};
        if(variableNames.includes("scope."))
        {
            ${handlerCode}
        }
        generated_binder_${selector}(eval(variableNames));
    }
    catch(ex)
    {
        console.error(ex);
        console.warn("Incorrect bind syntax.");
        console.warn("The correct usage of bind is bind='@value'");
    }
}
execute_binder_${selector}();
`
            }
        }
        if (!Math.nextNumber)
        {
            Math.nextNumber = function (from, to)
            {
                [from, to] = rouxUtils.swap(from, to);
                return from + Math.ceil(Math.abs(from - to) * Math.random());
            }
        }
        if (!Math.nextWord)
        {
            Math.nextWord = function (wordCount)
            {
                return Array.range(0, wordCount)
                            .map(_ => Math.nextNumber(97, 122))
                            .map(n => String.fromCharCode(n))
                            .join("");
            }
        }
    }
};
rouxPolyfill.bootstrap();