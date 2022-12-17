<?php
declare(strict_types = 1);
include "dir_utils.php";
include "array_utils.php";
/**
 * Gets a html file filename from a given directory, that has a given page.htmlName.
 * @param array the page to find inside the directory.
 * @param string the directory name in which to look for files.
 * @return string the filename if one is found, otherwise NULL.
 */
function get_page(array $page, string $directory) : string
{
    $html_files = array_filter(get_files($directory),
                               function($file)
                               {
                                   return str_is_html($file);
                               });
    return array_find($html_files,
                      function($file) use ($page)
                      {
                          return $page["htmlName"] === $file;
                      });
}
/**
 * Gets the content from a given page that locates inside a given directory,
 * if none is found them 404 is shown.
 * @param array the page to read its contents.
 * @param string the directory where the page is located.
 * @return array an array containing the html, css and javascript content of the given page.
 */
function get_page_content(array $page,
                          string $directory = "../views/html") : array
{
    $file = get_page($page, $directory);
    $file = $file === NULL ? "404" : str_replace(".html", "", $file);
    return read_file($file, $page["options"]);
}
/**
 * Gets the content inside a component that locates inside a given directory,
 * if none is found them a string is returned.
 * @param array the component to read its contents.
 * @param string the directory where the page is located.
 * @return string the component content.
 */
function get_component_content(array $component,
                               string $directory = "../views/components") : string
{
    $file = get_page($component, $directory);
    if($file !== NULL)
    {
        $file_path = "{$directory}/{$file}";
        return file_exists($file_path) ? file_get_contents($file_path)  : "";
    }
    return "";
}
/**
 * Reads all content that is necessary to render a given page.
 * @param string the page filename.
 * @param array the options used when getting the needed files to render the page,
 * js: to get the javascript associated with this page, the javascript must reside on
 * the same parent folder and on a folder named js, and have the same name name as the page.
 * css: to get the stylesheets associated with this page, the css must reside on
 * the same parent folder and on a folder named css, and have the same name as the page.
 * @return array an array containing html, css, js code needed for the given page,
 * if file is none them NULL is returned.
 */
function read_file(string $file, array $options) : array
{
    if($file === NULL)
    {
        return "";
    }
    $result = array("html" => true, "css" => $options["css"], "js" => $options["js"]);
    foreach ($result as $contentType => $value)
    {
        if($value)
        {
            $file_with_ext = "{$file}.{$contentType}";
            $file_path = "../views/{$contentType}/{$file_with_ext}";
            $result[$contentType] = file_exists($file_path) ? file_get_contents($file_path) : "";
        }
    }
    return $result;
}
?>