<?php
declare(strict_types = 1);
/**
 * Finds an item with a specific requirement in the array.
 * @param array the array to search on.
 * @param callable the function that specify the requirement.
 * @return mixed the item found in the array.
 */
function array_find(array $array, callable $callable)
{
    foreach ($array as $value)
    {
        if($callable($value))
        {
            return $value;
        }
    }
    return NULL;
}
/**
 * Zips two arrays into one.
 * @param array the array to zip, represented with the left element.
 * @param array the array to zip, represented with the right element.
 * @param callable the function that will map the elements into the new array.
 * @return array the zipped array.
 */
function zip(array $left, array $right, callable $callable) : array
{
    if(count($left) !== count($right))
    {
        throw new Exception("sequences must have the same length.");
    }
    $result = [];
    for ($i=0; $i < count($left); $i++)
    {
        array_push($result, $callable($left[$i], $right[$i]));
    }
    return $result;
}
/**
 * Verify if one item inside the array meets a specific requirement.
 * @param array the array to be verified.
 * @param callable the function that specifies the requirement.
 * @return bool true if the array has at least one item that
 * meets the specific requirement, otherwise false.
 */
function array_any(array $array, callable $callable) : bool
{
    foreach($array as $value)
    {
        if($callable($value))
        {
            return true;
        }
    }
    return false;
}
/**
 * Verify if all the item inside the array meets a specific requirement.
 * @param array the array to be verified.
 * @param callable the function that specifies the requirement.
 * @return bool true if all items inside the array
 * meets the specific requirement, otherwise false.
 */
function array_all(array $array, callable $callable) : bool
{
    foreach($array as $value)
    {
        if(!$callable($value))
        {
            return false;
        }
    }
    return true;
}
/**
 * Verify if all specified array keys are set.
 * @param array the target array to check.
 * @param array the array keys to check if is set.
 * @return bool true if the array has all the specific keys set.
 */
function array_is_set(array $target, array $values) : bool
{
    foreach ($values as $value)
    {
        if(!isset($target[$value]))
        {
            return false;
        }
    }
    return true;
}
function array_equals_at(array $target, array $values)
{
    foreach ($values as $leftValue => $rightValue)
    {
        if($target[$leftValue] !== $target[$rightValue])
        {
            return false;
        }
    }
    return true;
}
?>