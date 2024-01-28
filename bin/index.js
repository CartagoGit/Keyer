#!/usr/bin/env node

console.log('Init -> Keyer Cli');
// import { keyer } from './keyer/exports.js';

// import { keyer } from '../src/exports';
const { keyer } = require('./keyer/exports');
keyer();
