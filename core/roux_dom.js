"strict mode";
const rouxDOM =
{
    createElement: function (tag, content, attributeBuilder = null)
    {
        const element = document.createElement(tag);
        if (attributeBuilder)
        {
            const attribute = attributeBuilder(Object({}));
            attribute.keys()
                     .filter(k => Object.exists(attribute[k]))
                     .forEach(k =>
                     {
                         if (k.startsWith("on"))
                         {
                             element.setAttribute(k, `const f = ${attribute[k]};
f(event.target, event);`);
                         }
                         else
                         {
                             element.setAttribute(k, attribute[k]);
                         }
                     });
        }
        if (content.is(Element))
        {
            element.insertAdjacentElement("beforeEnd", content);
        }
        else
        {
            element.innerHTML = content;
        }
        return Object({
            key: Math.nextWord(64),
            value: element
        });
    },
    render: function (renderer)
    {
        try
        {
            return renderer(Object({
                               elements: [],
                               add: function(tag, content, attributeBuilder = null)
                               {
                                   this.elements.push(rouxDOM.createElement(tag, content, o =>
                                                     {
                                                        if (attributeBuilder)
                                                        {
                                                            attributeBuilder(o);
                                                        }
                                                         return o;
                                                     }));
                                   return this;
                               },
                               remove: function(key)
                               {
                                   this.elements = this.elements.filter(e => e.key !== key);
                                   return this;
                               },
                               nest: function(tag, content, key, attributeBuilder = null)
                               {
                                   const element = this.elements.oneOf(e => e.key === key);
                                   const newElement = rouxDOM.createElement(tag, content, o =>
                                                                            {
                                                                                if (attributeBuilder)
                                                                                {
                                                                                    attributeBuilder(o);
                                                                                }
                                                                                return o;
                                                                            });
                                    element.value.insertAdjacentElement("beforeEnd", newElement.value);
                                    return this;
                               },
                               nestOnFirstElement: function(tag, content, attributeBuilder = null)
                               {
                                    const element = this.elements[0];
                                    const newElement = rouxDOM.createElement(tag, content, o =>
                                                                             {
                                                                                if (attributeBuilder)
                                                                                {
                                                                                    attributeBuilder(o);
                                                                                }
                                                                                 return o;
                                                                             });
                                    element.value.insertAdjacentElement("beforeEnd", newElement.value);
                                    return this;
                               },
                               nestOnLastElement: function(tag, content, attributeBuilder = null)
                               {
                                   const element = this.elements[this.elements.length - 1];
                                   const newElement = rouxDOM.createElement(tag, content, o =>
                                                                            {
                                                                                if (attributeBuilder)
                                                                                {
                                                                                    attributeBuilder(o);
                                                                                }
                                                                                return o;
                                                                            });
                                   element.value.insertAdjacentElement("beforeEnd", newElement.value);
                                   return this;
                               },
                               buildElement: function(renderer, builder)
                               {
                                   builder(this.nestOnLastElement.bind(renderer));
                                   return this;
                               },
                               getElements: function (tag)
                               {
                                   return this.elements.filter(e => e.value.tag === tag);
                               },
                               render: function ()
                               {
                                   return this.elements.map(e => e.value.outerHTML).join("");
                               }
                            })).render();
        }
        catch (ex)
        {
            console.error(ex);
            console.warn("Couldn't render the elements on the panel.");
        }
    },
    createForm: function (formOptions)
    {
        return this.render(r => {
            return r.add("form", "", o =>
            {
                o.action = formOptions.action;
                o.method = formOptions.method;
                o.onsubmit = (t, ev) =>
                {
                    ev.stopPropagation();
                    ev.preventDefault();
                    const promise = web_request(formOptions.action, {
                                            method: formOptions.method,
                                            headers:
                                            {
                                                "Content-Type": "application/json"
                                            },
                                            mode: "cors",
                                            cache: "default",
                                            body: formOptions.content.asJson()
                                    });
                    onResponse(promise);
                };
                if (formOptions.configure)
                {
                    formOptions.configure(o);
                }
            })
                .buildElement(r, f =>
                {
                    formOptions.render(f);
                    if (Object.exists(formOptions.submit))
                    {
                        f("input", "", o =>
                        {
                            o.type = "submit";
                            o.value = formOptions.submit.message;
                            if (formOptions.submit.configure)
                            {
                                formOptions.submit.configure(o);
                            }
                        });
                    }
                });
        });
    },
    createLink: function (linkOptions)
    {
        return this.render(r =>
        {
            return r.add("a", linkOptions.content, o =>
            {
                o.href = linkOptions.url;
                o.target = "_blank";
                if(linkOptions.configure)
                {
                    linkOptions.configure(o);
                }
            });
        });
    },
    createLocalLink: function (linkOptions)
    {
        return this.render(r =>
            {
                return r.add("a", linkOptions.content, o =>
                {
                    o.href = linkOptions.url;
                    o.onclick = (t, ev) =>
                    {
                        ev.stopPropagation();
                        ev.preventDefault();
                        roux.navigate(linkOptions.url);
                    };
                    if (linkOptions.configure)
                    {
                        linkOptions.configure(o);
                    }
                });
            });
    },
    createNestedInput: function (f, inputOptions)
    {
        f("input", "", o =>
        {
            const io = Math.nextWord(32);
            o[io] = false;
            o.value = inputOptions.placeholder;
            inputOptions.configure(o);
            const isGlobal = inputOptions.name.startsWith("$");
            if (inputOptions.hasBindings)
            {
                if (inputOptions.bindMode !== "js")
                {
                    o.oninput = (t, ev) => rouxBinder.bindOnInput(t, ev,
                                                                  Object({
                                                                      page: tracker.page,
                                                                      isGlobal: isGlobal
                                                                  }));
                }
                if (inputOptions.bindMode !== "html")
                {
                    const identifier = Math.nextWord(32);
                    o[identifier] = "";
                    rouxBinder.bind(`input[${identifier}='']`,
                                    inputOptions.name,
                                    isGlobal);
                }
            }
        });
    },
    createInput: function (inputOptions)
    {
        return this.render(r =>
        {
            return r.add("input", "", o =>
            {
                const io = Math.nextWord(32);
                o[io] = false;
                o.value = inputOptions.placeholder;
                inputOptions.configure(o);
                const isGlobal = inputOptions.name.startsWith("$");
                if (inputOptions.hasBindings)
                {
                    if (inputOptions.bindMode !== "js")
                    {
                        o.oninput = (t, ev) => rouxBinder.bindOnInput(t, ev,
                                                                      Object({
                                                                          page: tracker.page,
                                                                          isGlobal: isGlobal
                                                                      }));
                    }
                    if (inputOptions.bindMode !== "html")
                    {
                        const identifier = Math.nextWord(32);
                        o[identifier] = "";
                        rouxBinder.bind(`input[${identifier}='']`,
                                        inputOptions.name,
                                        isGlobal);
                    }
                }
            });
        });
    },
    createTable: function (tableOptions)
    {
        return this.render(r =>
        {
            return r.add("table", "", o =>
            {
                if (o.configureTable)
                {
                    tableOptions.configureTable(o);
                }
            }).buildElement(r, f =>
            {
                if (tableOptions.hasHead && Object.exists(tableOptions.headers))
                {
                    f("thead", this.render(r =>
                    {
                        return r.add("tr", "", o =>
                        {
                            if (tableOptions.configureHeaderRow)
                            {
                                tableOptions.configureHeaderRow(o);
                            }
                        }).buildElement(r, f =>
                        {
                            for (const header of tableOptions.headers)
                            {
                                f("th", header, o =>
                                {
                                    if (tableOptions.configureHeaderContent)
                                    {
                                        tableOptions.configureHeaderContent(o);
                                    }
                                });
                            }
                        });
                    }), o =>
                    {
                        if (tableOptions.configureHeader)
                        {
                            tableOptions.configureHeader(o);
                        }
                    });
                }
                f("tbody", this.render(r =>
                {
                    const results = tableOptions.content.crossJoin(tableOptions.functions, (x, f) => f(x));
                    for (const result of results)
                    {
                        r.add("tr", "", o =>
                        {
                            if (tableOptions.configureBodyRow)
                            {
                                tableOptions.configureBodyRow(o);
                            }
                        }).buildElement(r, f =>
                        {
                            for (const item of result)
                            {
                                f("td", item, o =>
                                {
                                    if (tableOptions.configureBodyContent)
                                    {
                                        tableOptions.configureBodyContent(o);
                                    }
                                })
                            }
                        })
                    }
                    return r;
                }), o =>
                {
                    if (tableOptions.configureBody)
                    {
                        tableOptions.configureBody(o);
                    }
                });
                const canCreateFooter = tableOptions.hasFooter &&
                                        Object.exists(tableOptions.createFooter);
                if (canCreateFooter)
                {
                    f("tfoot", this.render(r =>
                    {
                        tableOptions.createFooter(r);
                        return r;
                    }), o =>
                    {
                        if (tableOptions.configureHeader)
                        {
                            tableOptions.configureHeader(o);
                        }
                    });
                }
            });
        });
    },
    createFigure: function (imageOptions)
    {
        return this.render(r =>
        {
            return r.add("figure", "", o =>
            {
                if (imageOptions.configureFigure)
                {
                    imageOptions.configureFigure(o);
                }
            }).buildElement(r, f =>
            {
                const identifier = Math.nextWord(32);
                f("img", "", o =>
                {
                    o[identifier] = "";
                    if (imageOptions.configureImg)
                    {
                        imageOptions.configureImg(o);
                    }
                    o.src = imageOptions.source;
                    o.alt = imageOptions.text;
                    const isImageGlobal = imageOptions.imageName.startsWith("$");
                    rouxBinder.bind(`img[${identifier}='']`, imageOptions.imageName, isImageGlobal, "src");
                });
                const isCaptionGlobal = imageOptions.captionName.startsWith("$");
                rouxBinder.bind(`figcaption[${identifier}='']`, imageOptions.captionName, isCaptionGlobal, "innerHTML");
                f("figcaption", imageOptions.caption,
                o =>
                {
                    o[identifier] = "";
                    if (imageOptions.configureCaption)
                    {
                        imageOptions.configureCaption(o);
                    }
                });
            });
        });
    },
    createAudio: function (audioOptions)
    {
        return this.render(r =>
        {
            return r.add("audio", "", o =>
            {
                if (audioOptions.configureAudio)
                {
                    audioOptions.configureAudio(o);
                }
            }).buildElement(r, f =>
            {
                const identifier = Math.nextWord(32);
                for (const source of audioOptions.sources)
                {
                    f("source", "", o =>
                    {
                        source(o);
                        if (o.bind)
                        {
                            o[identifier] = "";
                            rouxBinder.bind(`source[${identifier}='']`,
                                            o.bind,
                                            o.bind.startsWith("$"),
                                            "src");
                            o.bind = undefined;
                        }
                    });
                }
            });
        });
    },
    createVideo: function (videoOptions)
    {
        return this.render(r =>
            {
                return r.add("video", "", o =>
                {
                    if (videoOptions.configureVideo)
                    {
                        videoOptions.configureVideo(o);
                    }
                }).buildElement(r, f =>
                {
                    const identifier = Math.nextWord(32);
                    for (const source of videoOptions.sources)
                    {
                        f("source", "", o =>
                        {
                            source(o);
                            if (o.bind)
                            {
                                o[identifier] = "";
                                rouxBinder.bind(`source[${identifier}='']`,
                                                o.bind,
                                                o.bind.startsWith("$"),
                                                "src");
                                o.bind = undefined;
                            }
                        });
                    }
                    if (Object.exists(videoOptions.tracks))
                    {
                        for (const track of videoOptions.tracks)
                        {
                            f("track", "", o =>
                            {
                                track(o);
                                if (o.bind)
                                {
                                    o[identifier] = "";
                                    rouxBinder.bind(`source[${identifier}='']`,
                                                    o.bind,
                                                    o.bind.startsWith("$"),
                                                    "src");
                                    o.bind = undefined;
                                }
                            });
                        }
                    }
                });
            });
    },
    createCanvas: function (canvasOptions)
    {
        return this.render(r =>
        {
            return r.add("canvas", "", o =>
            {
                if (canvasOptions.configure)
                {
                    canvasOptions.configure(o);
                }
                if (canvasOptions.events)
                {
                    canvasOptions.events.forEach(ev =>
                    {
                        o[ev.key] = ev.value;
                    });
                }
            });
        });
    },
    createFrame: function (frameOptions)
    {
        return this.render(r =>
        {
            return r.add("iframe", "", o =>
            {
                if (frameOptions.configure)
                {
                    frameOptions.configure(o);
                }
                o.src = frameOptions.source;
                o.title = frameOptions.title;
                if (o.bind)
                {
                    const identifier = Math.nextWord(32);
                    o[identifier] = "";
                    rouxBinder.bind(`iframe[${identifier}='']`,
                                    o.bind,
                                    o.bind.startsWith("$"),
                                    "src");
                    o.bind = undefined;
                }
            })
        });
    }
};
const rouxBinder =
{
    bind: function (selector, name, isGlobal, htmlProperty = "value")
    {
        const page = `${tracker.page}`;
        if (isGlobal)
        {
            tracker.onGlobalValueChanged.combine(parameters =>
            {
                if (parameters.name === name)
                {
                    const element = app.querySelector(selector);
                    element[htmlProperty] = parameters.value;
                }
            });
        }
        else
        {
            tracker.onValueChanged.combine(parameters =>
            {
                if (tracker.page === page && parameters.name === name)
                {
                    const element = app.querySelector(selector);
                    element[htmlProperty] = parameters.value;
                }
            });
        }
    },
    bindOnInput: function (target, event, options)
    {
        event.stopPropagation();
        event.preventDefault();
        const variable = options.isGlobal ? tracker.globals.oneOf(v => v.name === inputOptions.name)
                                          : tracker.tracked.oneOf(v => v.page === options.page && v.name === inputOptions.name);
        if (!target[io])
        {
            let timeout = undefined;
            timeout = setTimeout(() =>
            {
                variable.values.push(target.value);
                target[io] = false;
                clearTimeout(timeout);
            }, 5_000);
            target[io] = true;
        }
    },
    bindElements: function (bindOptions)
    {
            const parseProperty = s => s === "content" ? "innerHTML" : s;
            bindOptions.property = parseProperty(bindOptions.property);
            bindOptions.targetProperty = parseProperty(bindOptions.targetProperty);
            const element = app.querySelector(bindOptions.source);
            const target = app.querySelector(bindOptions.target);
            this.bindElement(element, target, (e, t) => t[bindOptions.targetProperty] = e[bindOptions.property]);
            this.bindElement(target, element, (e, t) => e[bindOptions.property] = t[bindOptions.targetProperty]);
    },
    bindElement: function (element, target, executor)
    {
        element.oninput = ev =>
        {
            ev.stopPropagation();
            ev.preventDefault();
            executor(element, target);
        };
    }
};
const rouxApp =
{
    render: function (html)
    {
        console.log(html);
        this.keys().forEach(k => console.log(k));
    }
};