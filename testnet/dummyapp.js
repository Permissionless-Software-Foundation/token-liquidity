/*
  A dummy app that never exits.
*/

"use strict"

setInterval(function() {
  const now = new Date()
  console.log(`Time now: ${now.toLocaleString()}`)
}, 60000)
