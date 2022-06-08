<?php
declare(strict_types = 1);
/**
 * Verify if a request has cross-origin header.
 * @param array request the request to verify.
 * @return bool true if the request has the cross-origin header set, otherwise false.
 */
function request_is_cors(array $request) : bool
{
    return isset($_SERVER["HTTP_SEC_FETCH_MODE"]) &&
           $_SERVER["HTTP_SEC_FETCH_MODE"] === "cors";
}
/**
 * Verify if a request has an http origin.
 * @param array request the request to verify.
 * @return bool true if the request has an http origin, otherwise false.
 */
function request_has_origin(array $request) : bool
{
    return isset($_SERVER["HTTP_ORIGIN"]);
}
/**
 * Verify if the request origin is valid.
 * @param array request the request to verify.
 * @return bool true if the request origin has a valid http origin, otherwise false.
 */
function request_is_valid_origin(array $request) : bool
{
    $valid_origins = [

    ];
    return request_has_origin($request) &&
           in_array($request["HTTP_ORIGIN"], $valid_origins);
}
/**
 * Verify if a request has a valid cross-origin header.
 * @param array request the request to verify.
 * @return bool true if the request has the cross-origin header set, otherwise false.
 */
function request_has_cors(array $request) : bool
{
    return request_is_cors($request) &&
           request_is_valid_origin($request);
}
?>