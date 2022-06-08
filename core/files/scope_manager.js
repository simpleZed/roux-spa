"use strict";
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