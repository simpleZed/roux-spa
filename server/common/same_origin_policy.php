<?php
declare(strict_types = 1);
/**
 * Verifies if a request has the same-origin header.
 * @param array request the request to verify.
 * @return bool true if and only if the request has the same-origin header, otherwise false.
 */
function request_is_same_origin(array $request) : bool
{
    return isset($request["HTTP_SEC_FETCH_SITE"]) &&
           $request["HTTP_SEC_FETCH_SITE"] === "same-origin";
}
/**
 * Verifies if a request has been made by the same-origin.
 * @param array request the request to verify.
 * @return bool true if and only if the requester has the same port, address, hostname, otherwise false.
 */
function request_has_same_origin(array $request) : bool
{
    return request_is_same_origin($request) &&
           array_is_set($request,
                        [
                         "SERVER_PORT",
                         "REMOTE_PORT",
                         "SERVER_ADDR",
                         "REMOTE_ADDR",
                         "SERVER_NAME",
                         "REMOTE_HOST"
                        ]) &&
            array_equals_at($request, [
                "SERVER_PORT" => "REMOTE_PORT",
                "SERVER_ADDR" => "REMOTE_ADDR",
                "SERVER_NAME" => "REMOTE_HOST"
            ]);
}
/**
 * Verifies if a request has the same-site header.
 * @param array request the request to verify.
 * @return bool true if and only if the request has the same-site header, otherwise false.
 */
function request_is_same_site(array $request) : bool
{
    return isset($request["HTTP_SEC_FETCH_SITE"]) &&
           $request["HTTP_SEC_FETCH_SITE"] === "same-site";
}
/**
 * Verifies if a request has the same-site.
 * @param array the request to verify.
 * @return bool true if and only if the requester is on same-site, otherwise false.
 */
function request_has_same_site(array $request) : bool
{
    $parts = explode(".", $_SERVER["REMOTE_HOST"]);
    $hasSubDomain = array_any($parts, function($s) {
        return in_str($s, $request["SERVER_NAME"]);
    });
    return request_is_same_site($request) && $hasSubDomain;
}
?>