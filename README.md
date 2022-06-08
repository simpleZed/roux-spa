# Roux SPA

> Simple SPA library made in javascript with PHP at backend.

The SPA is rendered at the server side, the PHP just finds the file and give all the related contents to a javascript endpoint.

The library adds new array, function, object methods into javascript through its prototyping mechanisms.

This project uses variable tracing, that means is memory expensive and focused on applications that requires to hold important states on the application.

## The directives

## if="@variable|@function"

Renders an element if a condition is true.

## else="css selector"

Renders the selected element if a condition is false.

## repeat="@variable|number"

Repeats an element an x amount of times.

## code

### _variables

>> To use variables.

### @(code)

>> To use inline code.

> @{
>     code...
> }

>> To use functions.

## bind="@value"

>> Binds an input to a value.

## bind-mode="html|js|both"

>> The mode in which to bind the value.

### HTML

> All changes made in html are visible to the variable, but javascript changes are not.

### JS

> All changes made in script are visible to the html, but html changes are not.

### BOTH

> All changes are visible no matter the direction of the bind.