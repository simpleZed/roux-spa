"strict mode";
const rouxHTML =
{
    render: function (tag, content, attributes = null)
    {
        if (Object.exists(attributes))
        {
            const attribute = attributes?.keys()
                                        ?.zip(attributes.values(),
                                            (k, v) => `${k}="${v}"`)
                                        ?.join("");
            return `<${tag} ${attribute}>${content}</${tag}>`;
        }
        return `<${tag}>${content}</${tag}>`;
    }
};