function renderTree(gp, data) {
  updateEvent({el: gp}, data.roots[0], data.ts, data.tf, 0)
}

function shortString(stringId, symbol) {
  if (!data.short_strings[stringId]) {
    var str = data.strings[stringId];
    var c = 2;
    var i = str.length;
    while (c > 0 && --i > 0) {
      if (str[i] == symbol) {
        c--;
      }
    }
    data.short_strings[stringId] = i == 0 ? str : str.substr(i + 1)
  }

  return data.short_strings[stringId];
}

function updateEvent(evp, ev, gts, gtf, level) {
  if (typeof ev.level == "undefined") {
    ev.level = level;
  }
  var w = (ev.tsc_end - ev.tsc_start) / (gtf - gts) * 100;
  if (w < 0.01) {
    if (ev.el) {
      ev.el.setAttribute('display', 'none');
    }
   return;
  }

  var x = (ev.tsc_start - gts) / (gtf - gts) * 100;
  var y = level * 16;

  if (!ev.el) {
    ev.el = document.createElementNS(SVG_NS, 'g');
    evp.el.appendChild(ev.el);
    var g = document.createElementNS(SVG_NS, 'g');
    ev.el.appendChild(g);
    g.addEventListener('click', eventClick.bind(ev));
    g.classList.add('function-call-event');

    var rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('y', y);
    rect.setAttribute('height', '15');
    g.appendChild(rect);
  } else {
    ev.el.removeAttribute('display');
    var rect = ev.el.children[0].children[0];
  }

  rect.setAttribute('x', x + '%');
  rect.setAttribute('width', w + '%');
  updateEventText(ev, x, y, w);

  for (var i = 0; i < ev.children.length; i++) {
    updateEvent(ev, ev.children[i], gts, gtf, level + 1);
    if (!ev.children[i].parent) {
      ev.children[i].parent = ev;
    }
  }
}

function updateEventText(ev, x, y, w) {
  var hasText = ev.el.children[0].childElementCount > 1;
  if (w < 3) {
    if (hasText) {
      ev.el.children[0].children[1].setAttribute('display', 'none');
    }
    return;
  }

  if (!hasText) {
    var text = document.createElementNS(SVG_NS, 'text');
    text.setAttribute('x', x + '%');
    text.setAttribute('y', y + 11);
    ev.el.children[0].appendChild(text);
    var name = '';
    if (ev.class_name_id) {
      name = shortString(ev.class_name_id, '\\') + '::';
    }
    if (ev.function_name_id) {
      name += data.strings[ev.function_name_id];
    }
    if (!name) {
      name = shortString(ev.filename_id, '/');
      if (ev.compile) {
        name = 'COMPILE:' + name;
      } else {
        name = name + ':' + ev.line_start;
      }
    }



    var tspan = document.createElementNS(SVG_NS, 'tspan');
    tspan.textContent = name;
    tspan.setAttribute('dx', '4');
    text.appendChild(tspan);
  } else {
    var text = ev.el.children[0].children[1];
    text.removeAttribute('display');
  }

  text.setAttribute('x', x + '%');
  text.setAttribute('y', y + 11);
}

function hideParentSiblings(ev) {
  if (!ev.parent) {
    return;
  }

  for (var i = 0; i < ev.parent.children.length; i++) {
    cev = ev.parent.children[i];
    if (cev == ev) {
      continue;
    }
    if (cev.el) {
      cev.el.setAttribute('display', 'none');
    }
  }

  hideParentSiblings(ev.parent);
}

function scaleParentsTo100(ev) {
  if (!ev.parent) {
    return;
  }

  var rect = ev.parent.el.children[0].children[0];
  rect.setAttribute('x', '0%');
  rect.setAttribute('width', '100%');
  updateEventText(ev.parent, 0, ev.parent.level * 16, 100);

  scaleParentsTo100(ev.parent);
}

function selectParents(ev) {
  ev.el.children[0].classList.add('selected');
  if (ev.parent) {
    selectParents(ev.parent);
  }
}

function clearSelection() {
  var els = document.getElementById('fcs').querySelectorAll('.selected');
  for (var i = 0; i < els.length; i++) {
    els[i].classList.remove('selected');
  }
}

function eventClick() {
  clearSelection();
  hideParentSiblings(this);
  scaleParentsTo100(this);
  selectParents(this);
  updateEvent(this.parent, this, this.tsc_start, this.tsc_end, this.level);
}
