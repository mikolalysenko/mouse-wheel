'use strict'

var toPX = require('to-px')
var now = require('right-now')
var sgn = require('signum')

var SCROLL_CUTOFF = 100

module.exports = mouseWheelListen

function mouseWheelListen(element, callback, noScroll) {
  if(typeof element === 'function') {
    noScroll = !!callback
    callback = element
    element = window
  }
  var lineHeight = toPX('ex', element)
  var lastT = now()
  var lastX = 0
  var lastY = 0
  var lastZ = 0
  element.addEventListener('wheel', function(ev) {
    if(noScroll) {
      ev.preventDefault()
    }
    var t  = now()
    var dt = t - lastT
    var dx = ev.deltaX || 0
    var dy = ev.deltaY || 0
    var dz = ev.deltaZ || 0
    var mode = ev.deltaMode
    var scale = 1
    lastT = t
    switch(mode) {
      case 1:
        scale = lineHeight
      break
      case 2:
        scale = window.innerHeight
      break
    }
    dx *= scale
    dy *= scale
    dz *= scale
    if(dt < SCROLL_CUTOFF) {
      var cx = dx, cy = dy, cz = dz
      dx = sgn(dx) * Math.max(0, Math.abs(dx) - Math.abs(lastX))
      dy = sgn(dy) * Math.max(0, Math.abs(dy) - Math.abs(lastY))
      dz = sgn(dz) * Math.max(0, Math.abs(dz) - Math.abs(lastZ))
      lastX = cx
      lastY = cy
      lastZ = cz
    } else {
      lastX = dx
      lastY = dy
      lastZ = dz
    }
    if(dx || dy || dz) {
      return callback(dx, dy, dz)
    }
  })
}