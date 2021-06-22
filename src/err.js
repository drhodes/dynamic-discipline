

export function die(msg) {
    throw new Error(msg);
}

export function log(msg) {
    console.log("dyndisc> " + msg);
}

export function ok(val) {
    return {ok: true, value:val};
}
