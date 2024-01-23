/* Client side storage to create and save files (yes it's janky asf)
 * also directories are NOT a thing
 */

export class storage {
    constructor() { }

    fetch_all_k() { //return all keys present
        let buffer = [];
        console.log("len: " + localStorage.getItem("Hello_friend"));
        for (let i = 0; i<localStorage.length; i++) {
            buffer.push(localStorage.key(i));
        }

        return buffer;
    }

    f_insert(src_f, f_content) {
        localStorage.setItem(src_f, f_content);
    }

    f_fetch(src_f) {
        return localStorage.getItem(src_f);
    }

    f_remove(src_f) {
        localStorage.removeItem(src_f);
    }

    f_clear() {
        localStorage.clear();
    }
}