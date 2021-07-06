import {die, log} from './err.js';

export function durationFromString(s) {
    let duration = Number.parseFloat(s);
    if (Number.isNaN(duration)) die("Couldn't parse: " + s + " as a duration");
    return duration;
}

export function contains(s, c) {
    return s.indexOf(c) != -1;
}
