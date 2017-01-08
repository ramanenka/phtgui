<?php

class FunctionCallEvent implements JsonSerializable
{
  protected $data;

  protected $children = [];

  public function __construct(array $data) {
    $this->data = $data;
  }

  public function addData(array $data) {
    $this->data = array_merge($this->data, $data);
  }

  public function getData(string $key) {
    return $this->data[$key];
  }

  public function getChildren() {
    return $this->children;
  }

  public function getName() {
    global $strings;
    $result = "";

    if (!empty($this->data['class_name_id'])) {
      $result .= $strings[$this->data['class_name_id']] . '::';
    }

    if (!empty($this->data['function_name_id'])) {
      $result .= $strings[$this->data['function_name_id']];
    }

    if (!$result) {
      $result = $strings[$this->data['filename_id']]
        . ':' . $this->data['line_start'];
    }

    return $result;
  }

  public function addChild(FunctionCallEvent $f) {
    $this->children[] = $f;
  }

  public function jsonSerialize() {
    return $this->data + ['children' => $this->children];
  }
}
