#!/usr/bin/env node

import {Shuffle} from "../index.js"

/*
Usage
node bin/entrypoint-shuffle.js "[[folder]]"
npx entrypoint-shuffle [[folder]]
entrypoint-shuffle [[folder]]
*/
var args = process.argv;
if (args.length < 2) {
  console.error('Please enter the folder parameter');
  process.exit(1); //an error occurred
}
args = args.slice(2);
console.log(args)

var d = args[0];
var r = Shuffle.apply(d)
console.log(r);
process.exit(0);