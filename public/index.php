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
      rect { fill: #00545C; }
      g#fcs g.function-call-event:hover {opacity: 0.5; cursor:pointer;}
    </style>
    <g id="fcs"></g>
  </svg>
  <script type="text/javascript" src="js.js"></script>
  <script type="text/javascript">
    const SVG_NS = 'http://www.w3.org/2000/svg';
    var data = <?php echo json_encode($data); ?>;
    data.short_strings = {};
    renderTree(document.getElementById('fcs'), data);
  </script>
</body>
</html>
