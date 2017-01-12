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

  public function addChild(FunctionCallEvent $f) {
    $this->children[] = $f;
  }

  public function jsonSerialize() {
    return $this->data + ['children' => $this->children];
  }
}
