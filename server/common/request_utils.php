<?php
declare(strict_types = 1);
include "cors.php";
include "same_origin_policy.php";
/**
 * Verifies if the request has an https scheme.
 * @param array the request to be verified.
 * @return bool true if the request has an https scheme, otherwise false.
 */
function request_is_https(array $request) : bool
{
    return isset($request["HTTPS"]);
}
/**
 * Verifies if the request has a specific http verb.
 * @param array the request to be verified.
 * @return bool true if the request has a specific http verb, otherwise false.
 */
function request_is(array $request, string $verb) : bool
{
    return isset($request["REQUEST_METHOD"]) &&
           $request["REQUEST_METHOD"] === strtoupper($verb);
}
/**
 * Verifies if the request http verb is one of the allowed verbs.
 * @param array the request to be verified.
 * @return boolean true if the request has an allowed http verb, otherwise false.
 */
function request_is_oneOf(array $request, array $verbs) : bool
{
    return isset($request["REQUEST_METHOD"]) &&
           in_array($request["REQUEST_METHOD"], array_map($verbs, function($v)
           {
               return strtoupper($v);
           }));
}
function request_on(string $verb, callable $callable)
{
    if(request_is_https($_SERVER) && request_is($_SERVER, $verb))
    {
        return execute_server_code($callable);
    }
    return NULL;
}
function request_on_oneOf(array $verbs, callable $callable)
{
    if (request_is_https($_SERVER) && request_is_oneOf($_SERVER, $verbs))
    {
        return execute_server_code($callable);
    }
    return NULL;
}
function execute_server_code(callable $callable)
{
    $response = NULL;
    if(request_has_same_origin($_SERVER) || $_SERVER["REMOTE_ADDR"] === "127.0.0.1")
    {
        $response = $callable();
    }
    else if(request_has_cors($_SERVER))
    {
        $response = $callable();
        header("Access-Control-Allow-Origin: ${_SERVER['HTTP_ORIGIN']}");
    }
    header_remove("Server");
    header_remove("X-Powered-By");
    return $response;
}
?>