"use strict";const rouxDOM={createElement:function(e,t,n=null){const r=document.createElement(e);if(n){const e=n(Object({}));e.keys().filter((t=>Object.exists(e[t]))).forEach((t=>{t.startsWith("on")?r.setAttribute(t,`const f = ${e[t]};\nf(event.target, event);`):r.setAttribute(t,e[t])}))}return t.is(Element)?r.insertAdjacentElement("beforeEnd",t):r.innerHTML=t,Object({key:Math.nextWord(64),value:r})},render:function(e){try{return e(Object({elements:[],add:function(e,t,n=null){return this.elements.push(rouxDOM.createElement(e,t,(e=>(n&&n(e),e)))),this},remove:function(e){return this.elements=this.elements.filter((t=>t.key!==e)),this},nest:function(e,t,n,r=null){const o=this.elements.oneOf((e=>e.key===n)),i=rouxDOM.createElement(e,t,(e=>(r&&r(e),e)));return o.value.insertAdjacentElement("beforeEnd",i.value),this},nestOnFirstElement:function(e,t,n=null){const r=this.elements[0],o=rouxDOM.createElement(e,t,(e=>(n&&n(e),e)));return r.value.insertAdjacentElement("beforeEnd",o.value),this},nestOnLastElement:function(e,t,n=null){const r=this.elements[this.elements.length-1],o=rouxDOM.createElement(e,t,(e=>(n&&n(e),e)));return r.value.insertAdjacentElement("beforeEnd",o.value),this},buildElement:function(e,t){return t(this.nestOnLastElement.bind(e)),this},getElements:function(e){return this.elements.filter((t=>t.value.tag===e))},render:function(){return this.elements.map((e=>e.value.outerHTML)).join("")}})).render()}catch(e){console.error(e),console.warn("Couldn't render the elements on the panel.")}},createForm:function(e){return this.render((t=>t.add("form","",(t=>{t.action=e.action,t.method=e.method,t.onsubmit=(t,n)=>{n.stopPropagation(),n.preventDefault();const r=web_request(e.action,{method:e.method,headers:{"Content-Type":"application/json"},mode:"cors",cache:"default",body:e.content.asJson()});onResponse(r)},e.configure&&e.configure(t)})).buildElement(t,(t=>{e.render(t),Object.exists(e.submit)&&t("input","",(t=>{t.type="submit",t.value=e.submit.message,e.submit.configure&&e.submit.configure(t)}))}))))},createLink:function(e){return this.render((t=>t.add("a",e.content,(t=>{t.href=e.url,t.target="_blank",e.configure&&e.configure(t)}))))},createLocalLink:function(e){return this.render((t=>t.add("a",e.content,(t=>{t.href=e.url,t.onclick=(t,n)=>{n.stopPropagation(),n.preventDefault(),roux.navigate(e.url)},e.configure&&e.configure(t)}))))},createNestedInput:function(e,t){e("input","",(e=>{e[Math.nextWord(32)]=!1,e.value=t.placeholder,t.configure(e);const n=t.name.startsWith("$");if(t.hasBindings&&("js"!==t.bindMode&&(e.oninput=(e,t)=>rouxBinder.bindOnInput(e,t,Object({page:tracker.page,isGlobal:n}))),"html"!==t.bindMode)){const r=Math.nextWord(32);e[r]="",rouxBinder.bind(`input[${r}='']`,t.name,n)}}))},createInput:function(e){return this.render((t=>t.add("input","",(t=>{t[Math.nextWord(32)]=!1,t.value=e.placeholder,e.configure(t);const n=e.name.startsWith("$");if(e.hasBindings&&("js"!==e.bindMode&&(t.oninput=(e,t)=>rouxBinder.bindOnInput(e,t,Object({page:tracker.page,isGlobal:n}))),"html"!==e.bindMode)){const r=Math.nextWord(32);t[r]="",rouxBinder.bind(`input[${r}='']`,e.name,n)}}))))},createTable:function(e){return this.render((t=>t.add("table","",(t=>{t.configureTable&&e.configureTable(t)})).buildElement(t,(t=>{e.hasHead&&Object.exists(e.headers)&&t("thead",this.render((t=>t.add("tr","",(t=>{e.configureHeaderRow&&e.configureHeaderRow(t)})).buildElement(t,(t=>{for(const n of e.headers)t("th",n,(t=>{e.configureHeaderContent&&e.configureHeaderContent(t)}))})))),(t=>{e.configureHeader&&e.configureHeader(t)})),t("tbody",this.render((t=>{const n=e.content.crossJoin(e.functions,((e,t)=>t(e)));for(const r of n)t.add("tr","",(t=>{e.configureBodyRow&&e.configureBodyRow(t)})).buildElement(t,(t=>{for(const n of r)t("td",n,(t=>{e.configureBodyContent&&e.configureBodyContent(t)}))}));return t})),(t=>{e.configureBody&&e.configureBody(t)}));e.hasFooter&&Object.exists(e.createFooter)&&t("tfoot",this.render((t=>(e.createFooter(t),t))),(t=>{e.configureHeader&&e.configureHeader(t)}))}))))},createFigure:function(e){return this.render((t=>t.add("figure","",(t=>{e.configureFigure&&e.configureFigure(t)})).buildElement(t,(t=>{const n=Math.nextWord(32);t("img","",(t=>{t[n]="",e.configureImg&&e.configureImg(t),t.src=e.source,t.alt=e.text;const r=e.imageName.startsWith("$");rouxBinder.bind(`img[${n}='']`,e.imageName,r,"src")}));const r=e.captionName.startsWith("$");rouxBinder.bind(`figcaption[${n}='']`,e.captionName,r,"innerHTML"),t("figcaption",e.caption,(t=>{t[n]="",e.configureCaption&&e.configureCaption(t)}))}))))},createAudio:function(e){return this.render((t=>t.add("audio","",(t=>{e.configureAudio&&e.configureAudio(t)})).buildElement(t,(t=>{const n=Math.nextWord(32);for(const r of e.sources)t("source","",(e=>{r(e),e.bind&&(e[n]="",rouxBinder.bind(`source[${n}='']`,e.bind,e.bind.startsWith("$"),"src"),e.bind=void 0)}))}))))},createVideo:function(e){return this.render((t=>t.add("video","",(t=>{e.configureVideo&&e.configureVideo(t)})).buildElement(t,(t=>{const n=Math.nextWord(32);for(const r of e.sources)t("source","",(e=>{r(e),e.bind&&(e[n]="",rouxBinder.bind(`source[${n}='']`,e.bind,e.bind.startsWith("$"),"src"),e.bind=void 0)}));if(Object.exists(e.tracks))for(const r of e.tracks)t("track","",(e=>{r(e),e.bind&&(e[n]="",rouxBinder.bind(`source[${n}='']`,e.bind,e.bind.startsWith("$"),"src"),e.bind=void 0)}))}))))},createCanvas:function(e){return this.render((t=>t.add("canvas","",(t=>{e.configure&&e.configure(t),e.events&&e.events.forEach((e=>{t[e.key]=e.value}))}))))},createFrame:function(e){return this.render((t=>t.add("iframe","",(t=>{if(e.configure&&e.configure(t),t.src=e.source,t.title=e.title,t.bind){const e=Math.nextWord(32);t[e]="",rouxBinder.bind(`iframe[${e}='']`,t.bind,t.bind.startsWith("$"),"src"),t.bind=void 0}}))))}},rouxBinder={bind:function(e,t,n,r="value"){const o=`${tracker.page}`;n?tracker.onGlobalValueChanged.combine((n=>{if(n.name===t){app.querySelector(e)[r]=n.value}})):tracker.onValueChanged.combine((n=>{if(tracker.page===o&&n.name===t){app.querySelector(e)[r]=n.value}}))},bindOnInput:function(e,t,n){t.stopPropagation(),t.preventDefault();const r=n.isGlobal?tracker.globals.oneOf((e=>e.name===inputOptions.name)):tracker.tracked.oneOf((e=>e.page===n.page&&e.name===inputOptions.name));if(!e[io]){let t;t=setTimeout((()=>{r.values.push(e.value),e[io]=!1,clearTimeout(t)}),5e3),e[io]=!0}},bindElements:function(e){const t=e=>"content"===e?"innerHTML":e;e.property=t(e.property),e.targetProperty=t(e.targetProperty);const n=app.querySelector(e.source),r=app.querySelector(e.target);this.bindElement(n,r,((t,n)=>n[e.targetProperty]=t[e.property])),this.bindElement(r,n,((t,n)=>t[e.property]=n[e.targetProperty]))},bindElement:function(e,t,n){e.oninput=r=>{r.stopPropagation(),r.preventDefault(),n(e,t)}}},rouxApp={render:function(e,t=null){return new Promise(((n,r)=>{try{const r=Object.exists(t)?"afterBegin":"afterEnd";t??=app.querySelector("style");const o=Math.nextWord(32);this.parse(e).then((e=>t.insertAdjacentHTML(r,`<div ${o}>${e}</div>`))).then((()=>{const e=app.querySelector(`[${o}='']`);return scriptRunner.generateCode(e)})).then((e=>n(e)))}catch(e){console.error(e),console.warn("Could not render."),r(e)}}))},parse:function(e){return new Promise(((t,n)=>{try{const n=document.createElement("div");n.insertAdjacentHTML("afterbegin",e);t(converter(n.querySelectorAll("*")).map((e=>{const t=rouxApp.keys().filter((e=>!["parse","render"].includes(e))).oneOf((t=>t.toLowerCase()===e.tagName.toLowerCase()));if(t){const n={};e.getAttributeNames().forEach((t=>n[t]=e.getAttribute(t)));const r=rouxApp[t](n);return Object.exists(r)?r:""}return e.outerHTML})).join(""))}catch(e){console.error(e),console.warn("Couldn't parse the provided html."),n(e)}}))}};