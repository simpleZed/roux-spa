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