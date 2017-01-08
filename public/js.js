function renderTree(gp, data) {
  updateEvent(gp, data.roots[0], data.ts, data.tf, 0)
}

function updateEvent(gp, ev, gts, gtf, level) {
  var w = (ev.tsc_end - ev.tsc_start) / (gtf - gts) * 100;
  //if (w < 0.01) {
  //  return;
  //}

  var x = (ev.tsc_start - gts) / (gtf - gts) * 100;
  var y = level * 15;

  if (!ev.el) {
    ev.el = document.createElementNS(SVG_NS, 'g');
    gp.appendChild(ev.el);

    var rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('x', x + '%');
    rect.setAttribute('y', y);
    rect.setAttribute('height', '15');
    rect.setAttribute('width', w + '%');
    ev.el.appendChild(rect);

    /*
    <text
      x="<?php echo $ets ?>%"
      y="<?php echo $level * 16 + 11 ?>"
      ><tspan dx="5"><?php echo $event->getName(); ?></tspan></text>
    */
  }
  for (var i = 0; i < ev.children.length; i++) {
    updateEvent(ev.el, ev.children[i], gts, gtf, level + 1)
  }
}
