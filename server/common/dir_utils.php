<?php
declare(strict_types = 1);
/**
 * Gets all the files inside a given directory.
 * @param string the directory name
 * @return array the files inside the directory or
 * null in case the directory does not exist or isn't a directory.
 */
function get_files(string $directory) : array
{
    if(file_exists($directory) && is_dir($directory))
    {
        return scandir($directory);
    }
}
?>