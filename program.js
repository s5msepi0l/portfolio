import * as std from "./stdio.js"

const line_break = 100;

/* TODO:
 *  - Add some games or smt to justify the existence of executable programs 
 * 
 */

std.__routing__.insert("main", async (args, env) => {
    std.write(std.stdout, "what is 5 + 5" + std.newl);
    
    let ans = parseInt(await std.read(std.stdin, 2));

    if (ans == 10) {
        std.write(std.stdout, "Correct!");
    } else 
        std.write(std.stdout, "Incorrect!");

    return std.ext_normal;
});

std.__routing__.insert("help", async(args, env) => {
    std.write(std.stdout, 
        "/===== Hello friend... =====\\" + std.newl +
        "This terminal emulator supports the following inbuilt commands\n" +
        "-ls    - lists all files in the currect directory takes (0) parameters\n" +
        "-touch     - create empty file, takes (1) parameter\n" +
        "-rm    - remove file, takes (1) parameter\n" +
        "-cat   - concatenates file content to terminal, takes (1) parameter\n"

    );
   
    std.write(std.stdout, "By the way what's your name?: ");
    const name = await std.read(std.stdin, 32);
    std.write(std.stdout, `\nBeautiful name ${name}!`);

    env.client_name = name;

    console.log(env.client_name);
    std.env_update();

    return std.ext_normal;
});

std.__routing__.insert("ls", async(args, env) => {
    let files = env.f_storage.fetch_all_k();
    
    for (let i = 0; i<files.length; i++) {
        console.log(`file ${i}: ` + files[i]);
        std.write(std.stdout, files[i] + "\n");
    }

    return std.ext_normal;
});

std.__routing__.insert("touch", async(args, env) => {
    if (args.length < 2) return std.ext_err_no_arg;
    env.f_storage.f_insert(args[1], "");

    return std.ext_normal;
});

std.__routing__.insert("rm", async(args, env) => {
    if (args.length < 2) return std.ext_err_no_arg;
    env.f_storage.f_remove(args[1]);

    return std.ext_normal;
});

std.__routing__.insert("cat", async(args, env) => {
    if (args.length < 2) return std.ext_err_no_arg;

    const f_buffer = env.f_storage.f_fetch(args[1]);
    if (f_buffer == undefined) {
        std.write(std.stderr, "File either empty or does not exist");
        return std.ext_err_general;
    }

    std.write(std.stdout, f_buffer + "\n");

    return std.ext_normal;
});
//assumes line break stays at a constant 100
function translate_pos(x, y) {
    return (line_break * y) + x;
}

function upper_not(c, pos) {
    const k_code = c.charCodeAt(pos);
    if (k_code <= 65 && k_code <= 90) {
        return String(c[pos]).toLowerCase();
    } else
        return String(c[pos]).toUpperCase();


}

// Make this lessy "fucky"  to work w
std.__routing__.insert("nano", async(args, env) => {
    if (args.length < 2) return std.ext_err_no_arg;
    let f_buf = env.f_storage.f_fetch(args[1]);
    if (f_buf == undefined) {
        std.write(std.stderr, "Unable to open file");
        return std.ext_err_general;
    }

    let x_pos = 0;
    let y_pos = 0;

    while(true) {
        std.fflush(std.stdout);

        let pos;
        let check;
        if ((check = translate_pos(x_pos, y_pos)) <= f_buf.length) {
            pos = check;
            console.log("valid position");
        }
        
        std.write(std.stdout, f_buf);


        console.log("x_pos" + x_pos + ", y_pos: " + y_pos);

        let buf = await std.read(std.stdin, 1);
        const k_code = buf.charCodeAt(0);
        
        console.log("keyboard event: " + k_code);

        //kinda janky ngl but it works i guess
        if (k_code <= 31 && k_code >= 26) {
            switch(k_code) {
                case 26: // escape 
                    std.fflush(std.stdout);
                    
                    std.write(std.stdout, "Save written buffer? (Y/N): ");
                    let ans = await std.read(std.stdin, 1);
                    switch(ans) {
                        case "Y":
                            env.f_storage.f_insert(args[1], f_buf);
                            return std.ext_normal;
                        
                        case "N":
                            return std.ext_normal;
                    }
                
                case 27: // backspace
                    //erase character at current position
                    const pos = translate_pos(x_pos, y_pos);
                    console.log("pos: " + pos);
                    let f_str = f_buf.substring(0, pos-1);
                    let b_str = f_buf.substring(pos, f_buf.length);
                    f_buf = f_str + b_str;

                    if (x_pos > 0) x_pos--;

                    break;

                case 28: // arrow up
                if (y_pos > 0) y_pos--;    
                    break;

                case 29: // arrow down
                    y_pos++;
                break;

                case 30: // arrow left
                    if (x_pos > 0) x_pos--;
                    break;

                case 31: // arrow right
                    x_pos++;
                    break;
            }

            continue;
        }

        if (buf.length == 1) { // js equivalent of string::insert
            let f_str = f_buf.substring(0, pos) + buf;
            let b_str = f_buf.substring(pos, f_buf.length);
            f_buf = f_str + b_str;
            x_pos++;
        }
    }
    
    return std.ext_normal;
});