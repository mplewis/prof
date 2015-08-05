#!/usr/bin/env node
var phantomas = require('phantomas')
var async = require('async')
var mathjs = require('mathjs')

var options = {}

var metrics = [
  'timeToFirstByte',
  'httpTrafficCompleted'
]

var url = 'http://ptd-website.herokuapp.com'
var count = 10

function printStats(title, data) {
  var mean = mathjs.mean(data)
  var median = mathjs.median(data)
  var max = mathjs.max(data)
  var min = mathjs.min(data)
  console.log(title)
  console.log('    Min:     ' + min)
  console.log('    Median:  ' + median)
  console.log('    Mean:    ' + mean)
  console.log('    Max:     ' + max)
}


console.log('Starting ' + count + ' requests.')

async.timesSeries(count, function(num, callback) {
  phantomas(url, options, function(err, json, results) {
    if (err) {
      console.log('Request ' + num + ' failed')
      console.log(err)
    } else {
      console.log('Request ' + num + ' OK')
    }
    callback(null, json.metrics)
  })

}, function(err, data) {

  if (err) {
    console.log(err)
  } else {

    metrics.forEach(function(metric) {
      gathered = []
      data.forEach(function(item) {
        if (!item) return
        gathered.push(item[metric])
      })
      printStats(metric, gathered)
    })

  }
})
