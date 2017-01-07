<?php

class FunctionCallEvent implements JsonSerializable
{
  protected $data;

  public function __construct(array $data) {
    $this->data = $data + ['children' => []];
  }

  public function addData(array $data) {
    $this->data = array_merge($this->data, $data);
  }

  public function getData(string $key) {
    return $this->data[$key];
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
      $result = $strings[$this->data['filename_id']] . ':' . $this->data['line_start'];
    }

    return $result;
  }

  public function addChild(FunctionCallEvent $f) {
    $this->data['children'][] = $f;
  }

  public function jsonSerialize() {
    return $this->data;
  }
}

$file = '/tmp/' . $_GET['profile'] . '.phtrace';
if (!file_exists($file)) {
  http_response_code(404);
  return;
}

//echo '<pre>';

$content = file_get_contents($file);
$len = strlen($content);
$p = 0;
$t = microtime(true);
$evc = 0;
$evcs = 0;
$evcf = 0;
$stack = [];
$roots = [];
$strings = [];
$maxDepth = 0;
while ($p < $len) {
  $evType = unpack("@$p/Cevent_type", $content)['event_type'];
  $p += 1;
  $evc++;

  switch($evType) {
    case 3:
      $ev = [];
      $ev = unpack(
        "@$p/"
        .'Qtsc_start/'
        .'Lfilename_id/'
        .'Lfunction_name_id/'
        .'Lclass_name_id/'
        .'Lline_start',
        $content
      );
      $p += 8 + 4 * 4;

      $o = new FunctionCallEvent($ev);
      if ($stack) {
        $stack[count($stack) - 1]->addChild($o);
      } else {
        $roots[] = $o;
      }

      array_push($stack, $o);
      $maxDepth = count($stack) > $maxDepth ? count($stack) : $maxDepth;

      //echo "FNC START => ", json_encode($ev, JSON_PRETTY_PRINT), "\n";
      $evcs++;
      break;

    case 4:
      $ev = unpack("@$p/Qtsc_end", $content);
      $p += 8;

      $o = array_pop($stack);
      $o->addData($ev);

      //echo "FNC END => ", json_encode($ev, JSON_PRETTY_PRINT), "\n";
      $evcf++;
      break;
    case 5:
      $ev = unpack("@$p/Lstring_id/Z*string", $content);
      //echo "STRING => ", json_encode($ev, JSON_PRETTY_PRINT), "\n";
      $p += 4 + strlen($ev['string']) + 1;
      $strings[$ev['string_id']] = $ev['string'];
      break;

    default:
      echo "unknown event type => $evType, exiting...\n";
      exit;
      break;
  }
}
while ($stack) {
  $o = array_pop($stack);
  $children = $o->getData('children');
  $tscEnd = $children
    ? $children[count($children) - 1]->getData('tsc_end')
    : $o->getData('tsc_start');
  $o->addData(['tsc_end' => $tscEnd]);
}
$rootsCount = count($roots);
$ts = $roots[0]->getData('tsc_start');
$tf = $roots[count($roots) - 1]->getData('tsc_end');
$tw = $tf - $ts;
$info = "Events: $evc($evcs, $evcf), Roots: {$rootsCount}, Time to decode: " . (microtime(true) - $t);

function printTree(array $events, int $level = 0) {
  if (!$events) {return;}
  global $ts, $tw;
  foreach ($events as $event) {
    $ets = ($event->getData('tsc_start') - $ts) / $tw * 100;
    $etf = ($event->getData('tsc_end') - $ts) / $tw * 100;
    if ($etf - $ets < 0.0001 * 100) {
      continue;
    }
    ?><g>
      <rect  x="<?php echo $ets ?>%"
        y="<?php echo $level * 16 ?>"
        width="<?php echo $etf - $ets ?>%"
        height="<?php echo 15 ?>"
        fill="#00545C"
        ></rect>
      <text
        font-size="10"
        fill="#FFFFFF"
        x="<?php echo $ets ?>%"
        y="<?php echo $level * 16 + 11 ?>"
        ><?php echo $event->getName(); ?></text>
        <?php printTree($event->getData('children'), $level + 1); ?>
      </g><?php
  }
}

?><!DOCTYPE html>
<html>
<head>
  <style>
    html, body {height: 100%;}
  </style>
</head>
<body>
  <div><?php echo $info; ?></div>
  <svg xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="<?php echo $maxDepth * 16 ?>"
    preserveAspectRatio="none"
    viewBox="<?php echo 0, ' ', 0, ' ', '100%', ' ', $maxDepth * 16 ?>"
    >
    <?php printTree($roots); ?>
  </svg>
</body>
</html>
