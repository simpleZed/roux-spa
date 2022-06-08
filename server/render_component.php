<?php
include "global_include.php";
echo request_on("post", function()
{
    $response = array("content" => "", "status" => 200);
    $item = json_decode(file_get_contents("php://input"));
    $response["content"] = zip($item->tags, $item->groupTags, function ($n, $d) {
        $component = array("htmlName" => "{$n}.html");
        $content = get_component_content($component);
        return array("component" => $n,
                     "groupTag" => $d,
                     "content" => str_is_empty($n) ? "" : <<<HTML
                    $d
                    $content
                    </div>
                    HTML);
    });
    return json_encode($response);
});
?>