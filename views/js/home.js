scope.number = 1;
setTimeout(() => scope.number = 6, 1_000);
const content = `<createElement name="Mateus Arruda" age="22"/><createElement name="Le Roux" age="45"/>`
scope.__render__ = _ =>
{
    rouxApp.render(content)
           .then(r => eval(r));
};
rouxApp.createElement = (obj) =>
{
    return `<div repeat="5">
<h1>${obj.name}</h1>
<h1>${obj.age}</h1>
</div>`;
};