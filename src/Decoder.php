<?php

class Decoder {
  public function decode($content) {
    $len = strlen($content);
    $p = 0;
    $stack = [];
    $roots = [];
    $strings = [];
    $maxDepth = 0;
    $evc = 0;
    $t = microtime(true);
    while ($p < $len) {
      $evType = unpack("@$p/Cevent_type", $content)['event_type'];
      $p += 1;
      $evc++;

      switch($evType) {
        case 3:
          $ev = unpack(
            "@$p/"
            .'Qtsc_start/'
            .'Lfilename_id/'
            .'Lfunction_name_id/'
            .'Lclass_name_id/'
            .'Lline_start',
            $content
          );
          $ev['internal'] = false;
          $p += 8 + 4 * 4;

          $o = new FunctionCallEvent($ev);
          if ($stack) {
            $stack[count($stack) - 1]->addChild($o);
          } else {
            $roots[] = $o;
          }

          array_push($stack, $o);
          $maxDepth = count($stack) > $maxDepth ? count($stack) : $maxDepth;

          break;
        case 6:
          $ev = unpack(
            "@$p/"
            .'Qtsc_start/'
            .'Lfunction_name_id/'
            .'Lclass_name_id/',
            $content
          );
          $ev['internal'] = true;
          $p += 8 + 2 * 4;

          $o = new FunctionCallEvent($ev);
          if ($stack) {
            $stack[count($stack) - 1]->addChild($o);
          } else {
            $roots[] = $o;
          }

          array_push($stack, $o);
          $maxDepth = count($stack) > $maxDepth ? count($stack) : $maxDepth;

          break;

        case 4:
          $ev = unpack("@$p/Qtsc_end", $content);
          $p += 8;

          $o = array_pop($stack);
          $o->addData($ev);

          break;
        case 5:
          $ev = unpack("@$p/Lstring_id/Z*string", $content);
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
      $children = $o->getChildren();
      $tscEnd = $children
        ? $children[count($children) - 1]->getData('tsc_end')
        : $o->getData('tsc_start');
      $o->addData(['tsc_end' => $tscEnd]);
    }

    $rootsCount = count($roots);
    $ts = $roots[0]->getData('tsc_start');
    $tf = $roots[count($roots) - 1]->getData('tsc_end');
    $tw = $tf - $ts;

    return [
      'roots' => $roots,
      'strings' => $strings,
      'max_depth' => $maxDepth,
      'ts' => $ts,
      'tf' => $tf,
      'events_count' => $evc,
      'time_to_decode' => microtime(true) - $t,
    ];
  }
}
