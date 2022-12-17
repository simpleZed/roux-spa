"use strict";const rouxPolyfill={bootstrap:function(){Object.isNull||(Object.isNull=e=>null===e),Object.isNotDefined||(Object.isNotDefined=e=>void 0===e),Object.exists||(Object.exists=e=>!Object.isNotDefined(e)&&!Object.isNull(e)),Object.prototype.exists||(Object.prototype.exists=function(){return Object.exists(this)}),Object.parse||(Object.parse=text=>eval(`Object({ ${text} })`)),Object.values||(Object.values=e=>e.keys().map((t=>e[t]))),Object.createCollector||(Object.createCollector=e=>e.values().map((e=>`'${e}': []`)).join(", ").toObject()),Object.prototype.is||(Object.prototype.is=function(e){return this instanceof e}),Object.prototype.isOneOf||(Object.prototype.isOneOf=function(e){return e.some((e=>this.is(e)))}),Object.prototype.keys||(Object.prototype.keys=function(){return Object.keys(this)}),Object.prototype.values||(Object.prototype.values=function(){return Object.values(this)}),Object.prototype.mapKeys||(Object.prototype.mapKeys=function(){return this.keys().map((e=>`${e}: ${v}`)).join(", ").toObject()}),Object.prototype.subscribe||(Object.prototype.subscribe=function(e,t=!0){this.keys().filter((e=>!["__runAfter__","__runBefore__","__render__","page"].includes(e))).forEach((n=>{const r=this[n],o=r.is(FrozenValue);n.startsWith("$")?(t&&tracker.trackGlobal(n,r,o),this.addProxyHandler(n,e.globalSetter,e.globalGetter)):(t&&tracker.track(this.page,n,r,o),this.addPagedProxyHandler(n,e.setter,e.getter))}))}),Object.prototype.unsubscribe||(Object.prototype.unsubscribe=function(){this.keys().filter((e=>!["__runAfter__","__runBefore__","__render__","page"].includes(e))).forEach((e=>{e.startsWith("$")?(tracker.untrackGlobal(e),this.removeProxyHandler(e,this[e])):(tracker.untrack(e,this.page),this.removeProxyHandler(e,this[e]))}))}),Object.prototype.removeProxyHandler||(Object.prototype.removeProxyHandler=function(e,t){Object.defineProperty?Object.defineProperty(this,e,{enumerable:!0,configurable:!0,value:t,writable:!t.is(FrozenValue)}):(this.__defineSetter__(e,(t=>{if(t.is(FrozenValue))throw`${e} is a readonly field`;this.__defineGetter__(e,(()=>t))})),this.__defineGetter__(e,(()=>t)))}),Object.prototype.addProxyHandler||(Object.prototype.addProxyHandler=function(e,t,n){let r=this[e].is(FrozenValue);const o=n=>{if(r)throw`${e} is readonly and can't be changed.`;t(e,n),r=n.is(FrozenValue)},a=()=>n(e);Object.defineProperty?Object.defineProperty(this,e,{configurable:!0,enumerable:!0,set:o,get:a}):(this.__defineSetter__(e,o),this.__defineGetter__(e,a))}),Object.prototype.addPagedProxyHandler||(Object.prototype.addPagedProxyHandler=function(e,t,n){let r=this[e].is(FrozenValue);const o=n=>{if(r)throw`${e} is readonly and can't be changed`;t(tracker.page,e,n),r=n.is(FrozenValue)},a=()=>n(tracker.page,e);Object.defineProperty?Object.defineProperty(this,e,{configurable:!0,enumerable:!0,set:o,get:a}):(this.__defineSetter__(e,o),this.__defineGetter__(e,a))}),Object.prototype.asJson||(Object.prototype.asJson=function(){return JSON.stringify(this)}),String.prototype.toObject||(String.prototype.toObject=function(){return Object.parse(this)}),String.prototype.prepend||(String.prototype.prepend=function(e){return`${e}${this}`}),String.prototype.prependIf||(String.prototype.prependIf=function(e,t){return t(this)?this.prepend(e):this}),String.prototype.append||(String.prototype.append=function(e){return`${this}${e}`}),String.prototype.appendIf||(String.prototype.appendIf=function(e,t){return t(this)?this.append(e):this}),String.prototype.eval||(String.prototype.eval=function(){return eval(this)}),String.prototype.dump||(String.prototype.dump=function(){console.log(this)}),String.prototype.endsWith||(String.prototype.endsWith=function(e){return this.length>=e.length&&this.substring(this.length-e.length,this.length)===e}),String.prototype.startsWith||(String.prototype.startsWith=function(e){return this.length>=e.length&&this.substring(0,e.length)===e}),String.prototype.isNullOrWhiteSpace||(String.prototype.isNullOrWhiteSpace=function(){return null===this||this.trim().length<=0}),String.prototype.repeatWith||(String.prototype.repeatWith=function(e,t){return Array.repeat(e,this).join(t)}),String.prototype.removeSuffix||(String.prototype.removeSuffix=function(e){return this.endsWith(e)?this.substring(0,this.length-e.length):this}),String.prototype.removePrefix||(String.prototype.removePrefix=function(e){return this.startsWith(e)?this.substring(e.length,this.length):this}),String.prototype.isCustomAttribute||(String.prototype.isCustomAttribute=function(){return["if","repeat","code","bind"].includes(this)}),String.prototype.toJsCode||(String.prototype.toJsCode=function(){return this.replaceAll("&amp;&amp;","&&").replaceAll("&gt;",">").replaceAll("&lt;","<")}),String.prototype.asFunction||(String.prototype.asFunction=function(e){return`${e} => ${this}`.eval()}),Array.range||(Array.range=(e,t,n=1)=>{[e,t]=rouxUtils.swap(e,t),n=Math.abs(n);const r=[];for(let o=e;o<t;o+=n)r.push(o);return r}),Array.repeat||(Array.repeat=(e,t)=>Array.range(0,e).map((e=>t))),Array.prototype.mapAllKeys||(Array.prototype.mapAllKeys=function(){return this.map((e=>e.mapKeys()))}),Array.prototype.harvestAll||(Array.prototype.harvestAll=function(e=null){e??=this.mapAllKeys();const t=Object.createCollector(e);return e.keys().zip(e.values(),((e,n)=>Object({key:t[n],value:this.map((t=>t[e]))}))).forEach((e=>e.key.push(e.value))),t}),Array.prototype.oneOf||(Array.prototype.oneOf=function(e=(e=>!0)){for(const t of this)if(e(t))return t}),Array.prototype.groupBy||(Array.prototype.groupBy=function(e){const t=[];for(const n of this){const r=t.oneOf((t=>t.key===e(n)));r?r.groups.push(n):t.push({key:e(n),groups:[n]})}return t}),Array.prototype.forEach||(Array.prototype.forEach=function(e){for(const t of this)e(t)}),Array.prototype.map||(Array.prototype.map=function(e){const t=[];for(const n of this)t.push(e(n));return t}),Array.prototype.except||(Array.prototype.except=function(e){let t=[];for(const n of this)t.includes(n)||e.includes(n)||t.push(n);return t}),Array.prototype.intersect||(Array.prototype.intersect=function(e){let t=[];for(const n of this)!t.includes(n)&&e.includes(n)&&t.push(n);return t}),Array.prototype.union||(Array.prototype.union=function(e){let t=[];for(const e of this)t.includes(e)||t.push(e);for(const n of e)t.includes(n)||t.push(n);return t}),Array.prototype.unique||(Array.prototype.unique=function(){let e=[];for(const t of this)e.includes(t)||e.push(t);return e}),Array.prototype.uniqueBy||(Array.prototype.uniqueBy=function(e){let t=[];for(const n of this)t.some((t=>e(t)===e(n)))||t.push(n);return t}),Array.prototype.symmetricExcept||(Array.prototype.symmetricExcept=function(e){return this.except(e).union(e.except(this))}),Array.prototype.crossJoin||(Array.prototype.crossJoin=function(e,t=((e,t)=>[e,t])){return this.map((n=>e.map((e=>t(n,e)))))}),Array.prototype.zip||(Array.prototype.zip=function(e,t=((e,t)=>[e,t])){return this.map(((n,r)=>t(n,e[r])))}),Array.prototype.zipAll||(Array.prototype.zipAll=function(e=((e,t)=>[e,t])){return this[0].map(((t,n)=>this.skip(1).map((r=>e(t,r[n])))))}),Array.prototype.crossJoinAll||(Array.prototype.crossJoinAll=function(e=((e,t)=>[e,t])){return this[0].map((t=>this.skip(1).flatMap((n=>n.map((n=>e(t,n)))))))}),Array.prototype.flatZipAll||(Array.prototype.flatZipAll=function(e=((e,t)=>[e,t])){return this[0].flatMap(((t,n)=>this.skip(1).map((r=>e(t,r[n])))))}),Array.prototype.flatCrossJoinAll||(Array.prototype.flatCrossJoinAll=function(e=((e,t)=>[e,t])){return this[0].flatMap((t=>this.skip(1).flatMap((n=>n.map((n=>e(t,n)))))))}),Array.prototype.skip||(Array.prototype.skip=function(e){let t=[],n=0;for(const r of this)++n>e&&t.push(r);return t}),Array.prototype.take||(Array.prototype.take=function(e){let t=[],n=0;for(const r of this)++n<=e&&t.push(r);return t}),Array.prototype.takeWhile||(Array.prototype.takeWhile=function(e){let t=[];for(const n of this){if(!e(n))return t;t.push(n)}}),Array.prototype.skipWhile||(Array.prototype.skipWhile=function(e){let t=[],n=!0;for(const r of this)n&&e(r)||(n=!1,t.push(r));return t}),Array.prototype.chunks||(Array.prototype.chunks=function(e){if(0===this.length)return;const t=[[this[0]]];let n=0,r=0,o=0;for(const a of this)n++,1!==n&&(++o<e?t[r].push(a):(o=0,r++,t.push([a])));return t}),Function.createMulticast||(Function.createMulticast=e=>{if(e.is(Function))return e.functions=[],e;throw"value must be a Function"}),Function.prototype.combine||(Function.prototype.combine=function(e){return this.functions??=[this],this.functions.push(e),this}),Function.prototype.removeFunction||(Function.prototype.removeFunction=function(e){return this.functions&&0!==this.functions.length?(this.functions=this.functions.filter((t=>t!==e)),this):this}),Function.prototype.invoke||(Function.prototype.invoke=function(e){return this.functions.map((t=>t(e)))}),Function.prototype.compose||(Function.prototype.compose=function(){return this.functions.reduce(((e,t)=>n=>e(t(n))))}),Function.prototype.composeWith||(Function.prototype.composeWith=function(e){return this.compose()(e)}),Function.prototype.decorate||(Function.prototype.decorate=function(e,t){return this.functions.map((n=>r=>t(n(e(r)))))}),Function.prototype.decorateWith||(Function.prototype.decorateWith=function(e,t,n){return this.decorate(t,n).map((t=>t(e)))}),Element.prototype.HTMLWithoutAttribute||(Element.prototype.HTMLWithoutAttribute=function(e){return this.removeAttribute(e),this.outerHTML}),Element.prototype.isCustomTag||(Element.prototype.isCustomTag=function(){return this.tagName.toLowerCase().endsWith("-js")}),Element.prototype.toNormalTag||(Element.prototype.toNormalTag=function(e){return this.isCustomTag()?this.outerHTML.replaceAll(this.tagName.toLowerCase(),e):this.outerHTML}),Element.prototype.createConditional||(Element.prototype.createConditional=function(e,t){try{const n=this.getAttribute("else");n&&this.removeAttribute("else");const r=e.replaceAll("@","scope.");return`const generated_conditional_${t} = (value, hasElse) =>\n{\n    try\n    {\n        const elements = app.querySelectorAll("[${t}='']");\n        if(!Object.exists(elements))\n        {\n            return;\n        }\n        if(!value)\n        {\n            elements.forEach(e => e.hidden = true);\n            if(hasElse)\n            {\n                app.querySelectorAll("${n}")\n                   .forEach(e => e.hidden = false);\n            }\n        }\n        else\n        {\n            elements.forEach(e => e.hidden = false);\n            if(hasElse)\n            {\n                app.querySelectorAll("${n}")\n                   .forEach(e => e.hidden = true);\n            }\n        }\n    }\n    catch(ex)\n    {\n        console.error(ex);\n        console.info("Incorrect if syntax");\n        console.info("use @ to refer to variables");\n        console.info("Correct syntax: if='@condition' and an optional else='selector'");\n    }\n}\nconst execute_conditional_${t} = () =>\n{\n    try\n    {\n        const variableNames = "${r}";\n        if(variableNames.includes("scope."))\n        {\n            ${rouxCodeGenerator.generateHandlerCode(`generated_conditional_${t}`,`${r}, ${Boolean(n)}`)}\n        }\n        generated_conditional_${t}(${r}, ${Boolean(n)});\n    }\n    catch(ex)\n    {\n        console.error(ex);\n        console.info("Incorrect if syntax");\n        console.info("use @ to refer to variables");\n        console.info("Correct syntax: if='@condition' and an optional else='selector'");\n    }\n}\nexecute_conditional_${t}();\n`}catch(e){return console.error(e),console.info("Incorrect if syntax"),console.info("use @ to refer to variables"),console.info("Correct if syntax: if='@condition' and an optional else='selector'"),""}}),Element.prototype.createRepeat||(Element.prototype.createRepeat=function(e,t){try{const n=e.includes("@"),r=n?e.replaceAll("@","Math.abs(scope.").append(")"):Math.abs(e);return`const generated_repeat_${t} = (quantity) =>\n{\n    try\n    {\n        const elements = converter(app.querySelectorAll("[${t}='']"));\n        const element = elements.oneOf();\n        if(!Object.exists(element))\n        {\n            return;\n        }\n        if(quantity === 0)\n        {\n            elements.forEach(e => e.hidden = true);\n            return;\n        }\n        elements.forEach(e => e.hidden = false);\n        quantity -= elements.length;\n        if(quantity === 0)\n        {\n            return;\n        }\n        else if(quantity < 0)\n        {\n            elements.take(-quantity).forEach(e => e.remove());\n        }\n        else\n        {\n            const html = Array.repeat(quantity, element.outerHTML).join("");\n            element.insertAdjacentHTML("afterEnd", html);\n        }\n    }\n    catch(ex)\n    {\n        console.error(ex);\n        console.info("Incorrect repeat syntax");\n        console.info("use @ to refer to variables");\n        console.info("Correct repeat syntax: repeat=Number or repeat=@variable");\n    }\n}\nconst execute_repeat_${t} = () =>\n{\n    try\n    {\n        if(${n})\n        {\n            const variableNames = "${r}";\n            ${rouxCodeGenerator.generateHandlerCode(`generated_repeat_${t}`,r)}\n        }\n        generated_repeat_${t}(${r});\n    }\n    catch(ex)\n    {\n        console.error(ex);\n        console.info("Incorrect repeat syntax");\n        console.info("use @ to refer to variables");\n        console.info("Correct repeat syntax: repeat=Number or repeat=@variable");\n    }\n}\nexecute_repeat_${t}();\n`}catch(e){return console.error(e),console.info("Incorrect repeat syntax"),console.info("use @ to refer to variables"),console.info("Correct repeat syntax: repeat=Number or repeat=@variable"),""}}),Element.prototype.createCode||(Element.prototype.createCode=function(e){try{const t=rouxCodeGenerator.generateCodeFromHtml(this.outerHTML,e),n=rouxCodeGenerator.parseVariablesInHtml(this.outerHTML),r=converter(n.matchAll(RegExp("scope..*(?=})","g"))).flatMap((e=>e)).join("");this.outerHTML=n.replaceAll(RegExp("@{([^@]*)}","g"),`value_${e}`);return`const generated_code_${e} = (code) =>\n{\n    try\n    {\n        const element = app.querySelector("[${e}='']");\n        if(!Object.exists(element))\n        {\n            return;\n        }\n        element.hidden = true;\n        const g = ${t}.eval();\n        const result = g(scope);\n        const value = result !== undefined ? result : "";\n        code = code.replace("value_${e}", value.is(Array) ? value.join("") : value)\n                   .replaceAll("value_${e}", "");\n        const f = ("\`" + code.toJsCode() + "\`;").asFunction("scope");\n        element.outerHTML = f(scope);\n        element.hidden = false;\n    }\n    catch(ex)\n    {\n        console.error(ex);\n        console.warn("Invalid syntax detected");\n        console.warn("@(code) for inline code and @{code} for multiline code.");\n    }\n}\nconst execute_code_${e} = () =>\n{\n    try\n    {\n        const variableNames = "${r}";\n        const element = app.querySelector("[${e}='']");\n        if(variableNames.includes("scope."))\n        {\n            ${rouxCodeGenerator.generateHandlerCode(`generated_code_${e}`,"element.outerHTML")}\n        }\n        generated_code_${e}(element.outerHTML);\n    }\n    catch(ex)\n    {\n        console.error(ex);\n        console.warn("Invalid syntax detected");\n        console.warn("@(code) for inline code and @{code} for multiline code.");\n    }\n}\nexecute_code_${e}();\n`}catch(e){console.error(e),console.warn("Invalid syntax detected"),console.warn("@(code) for inline code and @{code} for multiline code.")}}),Element.prototype.createBinder||(Element.prototype.createBinder=function(e,t){const n=Math.nextWord(32);this.setAttribute(n,!1);const r=e.replaceAll("@",""),o=e.replaceAll("@","scope.").asJson();return`const generated_binder_${t} = (variable) =>\n{\n    try\n    {\n            converter(app.querySelectorAll("[${t}='']"))\n                .forEach(e =>\n                {\n                    let timeoutId = undefined;\n                    switch("${this.hasAttribute("bind-mode")?this.getAttribute("bind-mode"):"both"}")\n                    {\n                        case "html":\n                            e.oninput = ev =>\n                            {\n                                ev.stopPropagation();\n                                ev.preventDefault();\n                                if(!ev.target["${n}"])\n                                {\n                                    timeoutId = setTimeout(() =>\n                                    {\n                                        scope["${r}"] = e.value;\n                                        ev.target["${n}"] = false;\n                                        clearTimeout(timeoutId);\n                                    }, 5_000);\n                                    ev.target["${n}"] = true;\n                                }\n                            };\n                            break;\n                        case "js":\n                            e.value = scope["${r}"];\n                            break;\n                        case "both":\n                        default:\n                            e.value = scope["${r}"];\n                            e.oninput = ev =>\n                            {\n                                ev.stopPropagation();\n                                ev.preventDefault();\n                                if(!ev.target["${n}"])\n                                {\n                                    timeoutId = setTimeout(() =>\n                                    {\n                                        scope["${r}"] = e.value;\n                                        ev.target["${n}"] = false;\n                                        clearTimeout(timeoutId);\n                                    }, 5_000);\n                                    ev.target["${n}"] = true;\n                                }\n                            };\n                            break;\n                    }\n                });\n    }\n    catch(ex)\n    {\n        console.error(ex);\n        console.warn("Incorrect bind syntax.");\n        console.warn("The correct usage of bind is bind='@value'");\n    }\n}\nconst execute_binder_${t} = () =>\n{\n    try\n    {\n        const variableNames = ${o};\n        if(variableNames.includes("scope."))\n        {\n            ${rouxCodeGenerator.generateHandlerCode(`generated_binder_${t}`,"eval(variableNames)")}\n        }\n        generated_binder_${t}(eval(variableNames));\n    }\n    catch(ex)\n    {\n        console.error(ex);\n        console.warn("Incorrect bind syntax.");\n        console.warn("The correct usage of bind is bind='@value'");\n    }\n}\nexecute_binder_${t}();\n`}),Math.nextNumber||(Math.nextNumber=function(e,t){return[e,t]=rouxUtils.swap(e,t),e+Math.ceil(Math.abs(e-t)*Math.random())}),Math.nextWord||(Math.nextWord=function(e){return Array.range(0,e).map((e=>Math.nextNumber(97,122))).map((e=>String.fromCharCode(e))).join("")})}};rouxPolyfill.bootstrap();const rouxUtils={request:function(e,t){return new Promise(((n,r)=>{try{const r=new XMLHttpRequest;r.onload=()=>n({url:r.responseURL,text:()=>r.responseText,json(){return JSON.parse(this.text())}}),r.open(t.method,e,!0),r.send(t.body)}catch(e){console.log(e),r(e)}}))},toArray:function(e){const t=[];for(const n of e)t.push(n);return t},swap:function(e,t){try{return e>t?[t,e]:[e,t]}catch(n){if(console.error(n),e>t){const n=e;e=t,t=n}return[e,t]}}},rouxCodeGenerator={generateHandlerCode:function(e,t){return`if(rouxCodeGenerator.hasGlobalVariables(variableNames))\n{\n    tracker.onGlobalValueChanged.combine(parameters =>\n    {\n        const variable = "scope." + parameters.name;\n        if(variableNames.includes(variable))\n        {\n            ${e}(${t});\n        }\n    });\n}\ntracker.onValueChanged.combine(parameters =>\n{\n    const variable = "scope." + parameters.name;\n    if(parameters.page === "${tracker.page}" && variableNames.includes(variable))\n    {\n        ${e}(${t});\n    }\n});\n`},hasGlobalVariables:function(e){return e.includes("scope.$")},isGlobalVariable:function(e){return e.startsWith("$")},generateReplaceCode:function(e,t,n=!0){return n?`replaceAll("${e}", ${t})`:`replace("${e}", ${t})`},parseVariablesInHtml:function(e){return converter(e.matchAll(RegExp("(?<=@{1}[(]{1})(.*)(?=[)]{1})","g"),"$1")).flatMap((e=>e)).unique().map((e=>Object({placeholder:`@(${e})`,sub:`\${${e.replaceAll("_","scope.")}}`}))).forEach((t=>e=e.replaceAll(t.placeholder,t.sub))),e},generateCodeFromHtml:function(e,t,n){return`${converter(e.matchAll(RegExp("@{([^@]*)}","g"))).flatMap((e=>e)).filter((e=>!e.startsWith("@"))).map((e=>this.generateFunction(e.trim()))).join("").trim().prepend("const functions = Function.createMulticast(() => {});\r\n")}\nscope =>\n{\n    const element = roux.getApp()\n                        .querySelector("[${t}='']");\n    return functions.invoke(Object({element, scope}));\n}\n`.asJson()},generateFunction:function(e){return`functions.combine((parameter) =>\n{\n        try\n        {\n            const element = parameter.element;\n            const scope = parameter.scope;\n            ${e}\n        }\n        catch(ex)\n        {\n            console.error(ex);\n            console.warn("check your syntax.");\n        }\n});\n`.toJsCode()}},web_request=fetch??rouxUtils.request,converter=Array.from??rouxUtils.toArray,rouxCache={add:function(e,t){rouxCache[e]=t},remove:function(e){rouxCache[e]=void 0},contains:function(e){return Object.exists(rouxCache[e])},get:function(e,t=(e=>e)){return t(rouxCache[e])}},tracker={page:"",tracked:[],globals:[],track:function(e,t,n,r=!1){return this.isTracking(e,t)?this.setValue(e,t,n):(this.tracked.push(Object({page:e,name:t,values:n.exists()?[n]:[],readonly:r})),this.onTrack.invoke({page:e,name:t,value:n}),this)},trackGlobal:function(e,t,n=!1){return this.isGlobals(e)?this.setGlobalValue(e,t):(this.globals.push(Object({name:e,values:t.exists()?[t]:[],readonly:n})),this.onTrackGlobal.invoke({name:e,value:t}),this)},untrack:function(e,t){return this.tracked=this.tracked.filter((n=>n.name!==e||n.page!==t)),this.onUntrack.invoke({page:t,name:e}),this},untrackGlobal:function(e){return this.globals=this.globals.filter((t=>t.name!==e)),this.onUntrackGlobal.invoke({name:e}),this},unTrackFrom:function(e){return this.tracked=this.tracked.filter((t=>t.page!==e)),this.onUntrackFrom.invoke({page:e}),this},isTracking:function(e,t){return this.tracked.some((n=>n.page===e&&n.name===t))},isGlobals:function(e){return this.globals.some((t=>t.name===e))},setValue:function(e,t,n){return this.tracked.filter((n=>n.page===e&&n.name===t)).forEach((r=>{const o=r.values[r.values.length-1];r.readonly||o===n||(r.values.push(n),this.onValueChanged.invoke({page:e,name:t,value:n}),r.readonly=n.is(FrozenValue))})),this},getValues:function(e,t){return this.tracked.filter((n=>n.name===t&&n.page===e)).flatMap((e=>e.values))},setGlobalValue:function(e,t){return this.globals.filter((t=>t.name===e)).forEach((n=>{const r=n.values[n.values.length-1];n.readonly||r===t||(n.values.push(t),this.onGlobalValueChanged.invoke({name:e,value:t}),n.readonly=t.is(FrozenValue))})),this},getGlobalValues:function(e){return this.globals.filter((t=>t.name===e)).flatMap((e=>e.values))},getValue:function(e,t,n){const r=this.getValues(e,t);if(r){return(n>=0?r[n]:r[r.length+n])??t}},getGlobalValue:function(e,t){const n=this.getGlobalValues(e);if(n){return(t>=0?n[t]:n[n.length+t])??e}},getCurrentValue:function(e,t){return this.getValue(e,t,-1)},getCurrentGlobalValue:function(e){return this.getGlobalValue(e,-1)},onTrack:Function.createMulticast((()=>{})),onTrackGlobal:Function.createMulticast((()=>{})),onUntrack:Function.createMulticast((()=>{})),onUntrackGlobal:Function.createMulticast((()=>{})),onUntrackFrom:Function.createMulticast((()=>{})),onValueChanged:Function.createMulticast((()=>{})),onGlobalValueChanged:Function.createMulticast((()=>{}))},scopes={subscribe:e=>e.subscribe(handler,!0),unsubscribe:e=>e.unsubscribe()},handler={setter:(e,t,n)=>tracker.setValue(e,t,n),getter:(e,t)=>tracker.getCurrentValue(e,t),globalSetter:(e,t)=>tracker.setGlobalValue(e,t),globalGetter:e=>tracker.getCurrentGlobalValue(e)};class FrozenValue{constructor(e){this.value=e}static create(e){return new FrozenValue(e)}valueOf(){return this.value}}const scriptRunner={createScript:function(e){return e.flatMap((e=>this.processElements(e.tag,e.selector,e.attribute)))},processElements:function(e,t,n){return n.map((e=>{const t=e.split("::");return Object({key:t[0],value:t[1]})})).map((n=>this.processAttribute(e,t,n)))},processAttribute:function(e,t,n){e.removeAttribute(n.key),e.setAttribute(t,"");const r="code"===t?this.generateCode(e):"";switch(n.key){case"if":return e.createConditional(n.value,t);case"repeat":return e.createRepeat(n.value,t);case"bind":return e.createBinder(n.value,t);case"code":return e.createCode(t).prepend(r)}},generateCode:function(e){return converter(e.querySelectorAll("*")).map((e=>{const t=e.getAttributeNames().filter((e=>e.isCustomAttribute()));return Object({tag:e,selector:Math.nextWord(32),attribute:t.zip(t.map((t=>e.getAttribute(t))),((e,t)=>`${e}::${t}`))})})).filter((e=>e.attribute.some((e=>e)))).groupBy((e=>e.tag.outerHTML)).flatMap((e=>this.createScript(e.groups))).join("")}},rouxRenderer={getComponents:function(e){return e.map((e=>{const t=e.tagName.toLowerCase();return Object({tag:t.removeSuffix("-js"),groupTag:e.toNormalTag("div").removeSuffix("</div>"),element:e})})).groupBy((e=>`${e.tag}::${e.groupTag}`)).map((e=>{const t=e.key.split("::");return Object({tag:t[0],groupTag:t[1],elements:e.groups.map((e=>e.element))})})).harvestAll({tag:"tags",groupTag:"groupTags",elements:"elements"})},renderComponents:function(e,t){if(t.length<=0)return void this.processAttributes(e).then((e=>{roux.isDevelopment||rouxCache.add(tracker.page,e)})).then((e=>console.log(`${tracker.page} has been rendered`)));const n=this.getComponents(t),r=JSON.stringify({tags:n.tags[0],groupTags:n.groupTags[0]});web_request("https://localhost/server/render_component.php",{method:"POST",headers:{"Content-Type":"application/json"},mode:"cors",cache:"default",body:`${r}`}).then((e=>e.json())).then((e=>e.content)).then((e=>e.forEach((e=>n.elements[0].flatMap((e=>e)).filter((t=>t.toNormalTag("div").removeSuffix("</div>")===e.groupTag)).forEach((t=>t.outerHTML=e.content)))))).then((t=>this.processAttributes(e).then((e=>{roux.isDevelopment||rouxCache.add(tracker.page,e)})).then((e=>console.log(`${tracker.page} has been rendered`)))))},processAttributes:function(e){return new Promise(((t,n)=>{try{const n=e.querySelector("script").innerHTML.trim().append("\r\n"),r=converter(e.querySelectorAll("*")).map((e=>{const t=e.getAttributeNames().filter((e=>e.isCustomAttribute()));return Object({tag:e,selector:Math.nextWord(32),attribute:t.zip(t.map((t=>e.getAttribute(t))),((e,t)=>`${e}::${t}`))})})).filter((e=>e.attribute.some((e=>e)))).groupBy((e=>e.tag.outerHTML)).flatMap((e=>scriptRunner.createScript(e.groups))).join(""),o=Math.nextWord(32),a=`"use strict";\nconst component =\n{\n    render: (content, evaluate = true) =>\n    {\n        return evaluate ? rouxApp.render(content).then(r => eval(r))\n                        : rouxApp.render(content);\n    }\n};\nconst function_${o} = scope =>\n{\n    tracker.globals.forEach(g =>\n    {\n        scope[g.name] = g.values[g.values.length - 1];\n    });\n    ${n}\n    scopes.subscribe(scope);\n    if(scope.__runBefore__)\n    {\n        scope.__runBefore__();\n    }\n    ${r}\n    if(scope.__render__)\n    {\n        scope.__render__(app);\n    }\n    if(scope.__runAfter__)\n    {\n        scope.__runAfter__();\n    }\n    app.hidden = false;\n}\nfunction_${o}(Object({ page: "${tracker.page}" }));`;a.eval(),t(Object({html:e.innerHTML,script:a}))}catch(e){console.error(e),console.warn("Roux failed to execute."),n(e)}}))}},roux={id:"#app",page:"",isDevelopment:!1,getApp:function(){return document.querySelector(this.id)},navigate:function(e){e&&this.page!==e&&(this.page=e)},run:function(){this.getApp().onHTMLChange=function(){const e=converter(this.querySelectorAll("*")).filter((e=>e.isCustomTag()));rouxRenderer.renderComponents(this,e)}}},rouxHandler={onNavigate:function(_,page){if(roux.page!==page){tracker.page=page;const app=roux.getApp();if(!roux.isDevelopment&&rouxCache.contains(page))return void rouxCache.get(page,(v=>{app.innerHTML=v.html,eval(v.script)}));web_request("https://localhost/server/app.php",{method:"POST",headers:{"Content-Type":"application/json"},mode:"cors",cache:"default",body:`{ "name": "${page}", "options": { "js": true, "css": true } }`}).then((e=>e.json())).then((e=>e.content)).then((e=>{app.hidden=!0,app.innerHTML=`\n                <style>\n                ${e.css}\n                </style>\n                ${e.html}\n                <script>\n                ${e.js}\n                <\/script>\n                `,app.onHTMLChange()}))}},getCurrentPage:function(e){return tracker.page}};roux.addProxyHandler("page",rouxHandler.onNavigate,rouxHandler.getCurrentPage),roux.run(),roux.page="home";