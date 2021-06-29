

export function die(msg) {
    throw new Error(msg);
}

export function log(msg) {
    console.log("dyndisc> " + msg);
}

export function ok(val) {
    return {ok: true, value:val};
}

export function err(msg) {
    return {ok: false, value:msg};
}

export function unimplemented(msg) {
    die("unimplemented: " + msg);
}


