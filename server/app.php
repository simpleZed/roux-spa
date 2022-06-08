<?php
include "global_include.php";
echo request_on("post", function()
{
    $response = array("content" => "", "status" => 200);
    $item = json_decode(file_get_contents("php://input"));
    $page = array("htmlName" => $item->name . ".html",
                  "options" => array("css" => $item->options->css, "js" => $item->options->js));
    $response["content"] = get_page_content($page);
    return json_encode($response);
});
?>