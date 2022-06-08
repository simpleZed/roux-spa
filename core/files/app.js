"use strict";
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
                                        .join("")
                                        .append(`app.hidden = false;`);
            const generatedName = Math.nextWord(32);
                const code = `"strict mode";
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
    if(scope.__runAfter__)
    {
        scope.__runAfter__();
    }
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