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
                    .filter(k => !["__runAfter__", "__runBefore__", "__render__", "page"].includes(k))
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
                    .filter(k => !["__runAfter__", "__runBefore__", "__render__", "page"].includes(k))
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
const rouxCache = {};
rouxCache.add = function (key, value)
{
    rouxCache[key] = value;
}
rouxCache.remove = function (key)
{
    rouxCache[key] = undefined;
}
rouxCache.contains = function (key)
{
    return Object.exists(rouxCache[key]);
}
rouxCache.get = function (key, selector = i => i)
{
    return selector(rouxCache[key]);
}
const tracker =
{
    page: "",
    tracked: [],
    globals: [],
    track: function (page, name, value, readonly = false)
    {
        if (!this.isTracking(page, name))
        {
            this.tracked.push(Object({
                page: page,
                name: name,
                values: value.exists() ? [value] : [],
                readonly: readonly
            }));
            this.onTrack.invoke({ page, name, value });
            return this;
        }
        else
        {
            return this.setValue(page, name, value);
        }
    },
    trackGlobal: function (name, value, readonly = false)
    {
        if (!this.isGlobals(name))
        {
            this.globals.push(Object({
                name: name,
                values: value.exists() ? [value] : [],
                readonly: readonly
            }));
            this.onTrackGlobal.invoke({ name, value });
            return this;
        }
        else
        {
            return this.setGlobalValue(name, value);
        }
    },
    untrack: function (name, page)
    {
        this.tracked = this.tracked.filter(v => v.name !== name || v.page !== page);
        this.onUntrack.invoke({ page, name });
        return this;
    },
    untrackGlobal: function (name)
    {
        this.globals = this.globals.filter(v => v.name !== name);
        this.onUntrackGlobal.invoke({ name });
        return this;
    },
    unTrackFrom: function (page)
    {
        this.tracked = this.tracked.filter(v => v.page !== page);
        this.onUntrackFrom.invoke({ page });
        return this;
    },
    isTracking: function (page, name)
    {
        return this.tracked.some(v => v.page === page && v.name === name);
    },
    isGlobals: function (name)
    {
        return this.globals.some(v => v.name === name);
    },
    setValue: function (page, name, value)
    {
        this.tracked.filter(v => v.page === page && v.name === name)
                    .forEach(v =>
                    {
                        const lastValue = v.values[v.values.length - 1];
                        if (!v.readonly && lastValue !== value)
                        {
                            v.values.push(value);
                            this.onValueChanged.invoke({ page, name, value });
                            v.readonly = value.is(FrozenValue);
                        }
                    });
        return this;
    },
    getValues: function (page, name)
    {
        return this.tracked.filter(v => v.name === name && v.page === page)
                           .flatMap(v => v.values);
    },
    setGlobalValue: function (name, value)
    {
        this.globals.filter(v => v.name === name)
                    .forEach(v =>
                    {
                        const lastValue = v.values[v.values.length - 1];
                        if(!v.readonly && lastValue !== value)
                        {
                            v.values.push(value);
                            this.onGlobalValueChanged.invoke({ name, value });
                            v.readonly = value.is(FrozenValue);
                        }
                    });
        return this;
    },
    getGlobalValues: function (name)
    {
        return this.globals.filter(v => v.name === name)
                           .flatMap(v => v.values);
    },
    getValue: function (page, name, position)
    {
        const values = this.getValues(page, name);
        if (values)
        {
            const result = position >= 0 ? values[position]
                                         : values[values.length + position];
            return result ?? name;
        }
        return undefined;
    },
    getGlobalValue: function (name, position)
    {
        const values = this.getGlobalValues(name);
        if (values)
        {
            const result = position >= 0 ? values[position]
                                         : values[values.length + position];
            return result ?? name;
        }
        return undefined;
    },
    getCurrentValue: function (page, name)
    {
        return this.getValue(page, name, -1);
    },
    getCurrentGlobalValue: function (name)
    {
        return this.getGlobalValue(name, -1);
    },
    onTrack: Function.createMulticast(() => {}),
    onTrackGlobal: Function.createMulticast(() => {}),
    onUntrack: Function.createMulticast(() => {}),
    onUntrackGlobal: Function.createMulticast(() => {}),
    onUntrackFrom: Function.createMulticast(() => {}),
    onValueChanged: Function.createMulticast(() => {}),
    onGlobalValueChanged: Function.createMulticast(() => {})
};
const scopes =
{
    subscribe: (obj) => obj.subscribe(handler, true),
    unsubscribe: (obj) => obj.unsubscribe()
};
const handler =
{
    setter: (page, name, value) => tracker.setValue(page, name, value),
    getter: (page, name) => tracker.getCurrentValue(page, name),
    globalSetter: (name, value) => tracker.setGlobalValue(name, value),
    globalGetter: (name) => tracker.getCurrentGlobalValue(name)
};
class FrozenValue
{
    constructor(value)
    {
        this.value = value;
    }

    static create(value)
    {
        return new FrozenValue(value);
    }

    valueOf()
    {
        return this.value;
    }
};
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
const rouxRenderer =
{
    getComponents: function(componentTags)
    {
        return componentTags.map(t =>
        {
            const name = t.tagName.toLowerCase();
            return Object({
                'tag': name.removeSuffix("-js"),
                'groupTag': t.toNormalTag("div").removeSuffix("</div>"),
                'element': t
            });
        })
        .groupBy(t => `${t.tag}::${t.groupTag}`)
        .map(g =>
        {
            const parts = g.key.split("::");
            return Object({
                "tag": parts[0],
                "groupTag": parts[1],
                "elements": g.groups.map(g => g.element)
            });
        })
        .harvestAll({
            "tag": "tags",
            "groupTag": "groupTags",
            "elements": "elements",
        });
    },
    renderComponents: function (app, componentTags)
    {
        if (componentTags.length <= 0)
        {
            this.processAttributes(app)
                .then(o =>
                {
                    if (!roux.isDevelopment)
                    {
                        rouxCache.add(tracker.page, o);
                    }
                })
                .then(_ => console.log(`${tracker.page} has been rendered`));
            return;
        }
        const components = this.getComponents(componentTags);
        const json = JSON.stringify({ "tags": components.tags[0], "groupTags": components.groupTags[0] });
        web_request("https://localhost/server/render_component.php",
        {
            method: "POST",
            headers:
            {
                "Content-Type": "application/json"
            },
            mode: "cors",
            cache: "default",
            body: `${json}`
        })
        .then(r => r.json())
        .then(j => j.content)
        .then(c => c.forEach(c => components.elements[0].flatMap(e => e)
                    .filter(e => e.toNormalTag("div").removeSuffix("</div>") === c.groupTag)
                    .forEach(e => e.outerHTML = c.content)))
        .then(_ => this.processAttributes(app)
                       .then(o =>
                       {
                           if (!roux.isDevelopment)
                           {
                               rouxCache.add(tracker.page, o);
                           }
                       })
                       .then(_ => console.log(`${tracker.page} has been rendered`)));
    },
    processAttributes: function (app)
    {
        return new Promise((res, rej) =>
        {
            try
            {
                const beforeScript = app.querySelector("script")
                                        .innerHTML
                                        .trim()
                                        .append("\r\n");
                const afterScript = converter(app.querySelectorAll("*"))
                                        .map(t => {
                                            const attributeNames = t.getAttributeNames()
                                                .filter(n => n.isCustomAttribute());
                                            return Object({
                                                "tag": t,
                                                "selector": Math.nextWord(32),
                                                "attribute": attributeNames.zip(attributeNames.map(n => t.getAttribute(n)),
                                                    (x, y) => `${x}::${y}`)
                                            });
                                        })
                                        .filter(t => t.attribute.some(t => t))
                                        .groupBy(t => t.tag.outerHTML)
                                        .flatMap(g => scriptRunner.createScript(g.groups))
                                        .join("");
            const generatedName = Math.nextWord(32);
            const code = `"use strict";
const function_${generatedName} = scope =>
{
    tracker.globals.forEach(g =>
    {
        scope[g.name] = g.values[g.values.length - 1];
    });
    ${beforeScript}
    scopes.subscribe(scope);
    if(scope.__runBefore__)
    {
        scope.__runBefore__();
    }
    ${afterScript}
    if(scope.__render__)
    {
        scope.__render__(app);
    }
    if(scope.__runAfter__)
    {
        scope.__runAfter__();
    }
    app.hidden = false;
}
function_${generatedName}(Object({ page: "${tracker.page}" }));`;
                code.eval();
                res(Object({
                    html: app.innerHTML,
                    script: code
                }));
            }
            catch (ex)
            {
                console.error(ex);
                console.warn("Roux failed to execute.");
                rej(ex);
            }
        });
    }
};
const roux =
{
    id: "#app",
    page: "",
    isDevelopment: false,
    getApp: function ()
    {
        return document.querySelector(this.id);
    },
    navigate: function (page)
    {
        if (page && this.page !== page)
        {
            this.page = page;
        }
    },
    run: function ()
    {
        const app = this.getApp();
        app.onHTMLChange = function()
        {
            const tags = converter(this.querySelectorAll("*")).filter(t => t.isCustomTag());
            rouxRenderer.renderComponents(this, tags);
        }
    }
};
const rouxHandler =
{
    onNavigate: function (_, page)
    {
        if (roux.page !== page)
        {
            tracker.page = page;
            const app = roux.getApp();
            if (!roux.isDevelopment)
            {
                if (rouxCache.contains(page))
                {
                    rouxCache.get(page, v =>
                    {
                        app.innerHTML = v.html;
                        eval(v.script);
                    });
                    return;
                }
            }
            web_request("https://localhost/server/app.php",
            {
                method: "POST",
                headers:
                {
                    "Content-Type": "application/json"
                },
                mode: "cors",
                cache: "default",
                body: `{ "name": "${page}", "options": { "js": true, "css": true } }`
            })
            .then(r => r.json())
            .then(j => j.content)
            .then(c =>
            {
                app.hidden = true;
                app.innerHTML = `
                <style>
                ${c.css}
                </style>
                ${c.html}
                <script>
                ${c.js}
                </script>
                `;
                app.onHTMLChange();
            });
        }
    },
    getCurrentPage: function (_)
    {
        return tracker.page;
    }
};
roux.addProxyHandler("page", rouxHandler.onNavigate, rouxHandler.getCurrentPage);
roux.run();
roux.page = "home";