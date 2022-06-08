<?php
declare(strict_types = 1);
/**
 * Verifies whether a given string is empty.
 * @param string the string to be verified.
 * @return bool true if the string is empty, otherwise false.
 */
function str_is_empty(string $text) : bool
{
    return str_word_count($text) === 0 || ctype_space($text);
}
/**
 * Verifies whether the given string ends with ".html"
 * @param string the string to be verified.
 * @return bool true if the string ends with html, otherwise false.
 */
function str_is_html(string $text) : bool
{
    return str_ends_with($text, ".html");
}
/**
 * Verifies if a given string is inside another.
 * @param string the text to be verified upon.
 * @param string the query to search for.
 * @return bool true if the query is inside the text.
 */
function in_str(string $text, string $query) : bool
{
    return strlen($text) >= strlen($query) &&
           strpos($text, $query) > 0;
}
?>