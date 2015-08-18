#!/usr/bin/env node
var phantomas = require('phantomas')
var async = require('async')
var mathjs = require('mathjs')
var program = require('commander')
var fs = require('fs')

var options = {}

var metrics = [
  'timeToFirstByte',
  'httpTrafficCompleted'
]

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

function startRequests(site, count) {
  console.log('Starting ' + count + ' requests.')

  async.timesSeries(count, function (num, callback) {
    phantomas(site, options, function (err, json, results) {
      if (err) {
        console.log('Request ' + num + ' failed')
        console.log(err)
      } else {
        console.log('Request ' + num + ' OK')
      }
      callback(null, json.metrics)
    })

  }, function (err, data) {

    if (err) {
      console.log(err)
    } else {

      metrics.forEach(function (metric) {
        gathered = []
        data.forEach(function (item) {
          if (!item) return
          gathered.push(item[metric])
        })
        printStats(metric, gathered)
      })

    }
  })
}

function prof() {
  program
    .version(JSON.parse(fs.readFileSync('package.json')).version)
    .description('Profile a site')
    .usage('./prof.js -s http://google.com -c 10')
    .option('-s, --site <h>', 'Site to profile')
    .option('-c, --count <c>', 'Number of requests')
    .parse(process.argv)

  if (!program.site) {
    console.log('Please provide a site!')
    process.exit(1)
  }

  var site = program.site
  var count = program.count || 10

  console.log('Profiling ' + site + '...')
  startRequests(site, count)

}

prof()
