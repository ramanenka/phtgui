<?php
chdir(dirname(__DIR__));

require 'src/FunctionCallEvent.php';
require 'src/Decoder.php';

$file = '/tmp/' . $_GET['profile'] . '.phtrace';
if (!file_exists($file)) {
  http_response_code(404);
  return;
}

$content = file_get_contents($file);

$decoder = new Decoder();
$data = $decoder->decode($content);

$rootsCount = count($data['roots']);
$stringsCount = count($data['strings']);
$info = "Events: {$data['events_count']}, "
  . "Roots: {$rootsCount}, "
  . "Strings: {$stringsCount}, "
  . "Max depth: {$data['max_depth']}, "
  . "TS: {$data['ts']}, "
  . "TF: {$data['tf']}, "
  . "Time to decode: {$data['time_to_decode']}";

function printTree(array $events, int $level = 0) {
  if (!$events) {return;}
  global $ts, $tw;
  foreach ($events as $event) {
    $ets = ($event->getData('tsc_start') - $ts) / $tw * 100;
    $etf = ($event->getData('tsc_end') - $ts) / $tw * 100;
    if ($etf - $ets < 0.0005 * 100) {
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
        x="<?php echo $ets ?>%"
        y="<?php echo $level * 16 + 11 ?>"
        ><tspan dx="5"><?php echo $event->getName(); ?></tspan></text>
        <?php printTree($event->getChildren(), $level + 1); ?>
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
    height="<?php echo $data['max_depth'] * 16 ?>"
    preserveAspectRatio="none"
    >
    <style>
      text { font-size: 10px; fill: #FFFFFF; }
      /*rect { fill: none; stroke: #add8e6; }*/
    </style>
    <?php //printTree($roots); ?>
  </svg>
  <script type="text/javascript">
    function Event(attrs) {
      this.attrs = attrs;
      this.parent = null;
      this.children = [];
    }
    Event.prototype.addChild = function(child) {
      this.children.push(child);
      child.setParent(this);
    }
    Event.prototype.setParent = function(parent) {
      this.parent = parent;
    }
    var a = <?php echo json_encode($data); ?>;
    function createTree(ev) {
      var r = new Event(ev.attributes);
      for (var i = 0; i < ev.children.length; i++) {
        r.addChild(createTree(ev.children[i]))
      }
      return r;
    }
    var t = window.performance.now();
    var tree = createTree(a['roots'][0])
    console.log('tree created in ', window.performance.now() - t)
  </script>
</body>
</html>
