/*  main.js
 * - This file contains functions and such that act as a "kernel" of sorts for handling user input in a 
 * neet and easy to user API for furthur expansions
 * 
 * Note: variables with the "__" prefix are reserved by the kernel
 * Note: stdin is just a global array that can be accessed via user defined software
 * Note: Not sure as to why but backspaces and normal key presses are only registered after 2 presses then it works normally in sequence
*/

import * as std from "./stdio.js"
import * as bin from "./program.js"

//  updates input buffer if event is not the enter key
async function w_key_event(event) {
    if (std.routing_running) {
        std.fflush(std.stdin);
        if (event.key.length == 1) {
            std.__input_buffer_app__(String(event.key));
            std.__input_buffer_index_inc__();

            std.write(std.stdout, std.__input_buffer__);
        }

        switch(event.key) {
            case "Enter":
                std.__pipeline_input__("\n");
                console.log("ENTER");
                break;

            case "Escape":
                std.__pipeline_input__(String.fromCharCode(26));

            case "Backspace":
                std.__pipeline_input__(String.fromCharCode(27));
                break;

            case "ArrowUp":
                std.__pipeline_input__(String.fromCharCode(28));
                break;

            case "ArrowDown":
                std.__pipeline_input__(String.fromCharCode(29));
                break;

            case "ArrowLeft":
                std.__pipeline_input__(String.fromCharCode(30));
                break;

            case "ArrowRight":
                std.__pipeline_input__(String.fromCharCode(31));
                break;

            default:
                console.log(event.key);
                if (event.key.length == 1)
                    std.__pipeline_input__(String(event.key));
            
            
                break;
            }
        return ;
    }
    
    console.log("W_KEY_EVENT: " + event.key);


    std.fflush(std.stdout);
    switch (String(event.key)) {
        
        case "Enter": 
            if (std.__input_buffer__.length == 0) {
                return ;
            } 

            let exc = std.__input_buffer__.indexOf("./");
            if (exc != -1) { // client executes local file
                const func = std.__env__.f_storage.f_fetch(std.__input_buffer__.substring(
                    new String("./").length,
                    std.__input_buffer__.length
                ));

                let args = (std.__input_buffer__.substring(0, std.__input_buffer__.length)).split(" ");
    
                console.log("executing" + func);
                console.log("alt_run return value: " + await std.__routing__.alt_run(func, args));
                return ;
            }

            //parse user input into json object
            let parsed_cmd = std.__routing__.parse(std.__input_buffer__);
            if (parsed_cmd.route != undefined) { // invalid command
                std.__routing_status__(true); // enter routing
                let ext_code = await std.__routing__.run(parsed_cmd);
                std.ext_code_handle(ext_code);
                std.__routing_status__(false);

            } else  { // unable to fetch route, print err msg 
                console.log("err condition");
                std.write(std.stderr, `"${std.__input_buffer__}" Unrecognized command or expression`);
                
            }
            
            std.fflush(std.stdin);    
            console.log("cmd: " + parsed_cmd.route);
            std.write(std.stdout, "\n");
            //fetch and execute user defined programs


            break;
        
        case "Backspace":
            if (std.__input_buffer_index__ > 0) {
                

                std.__input_buffer_asign__(std.__input_buffer__.substring(0, std.__input_buffer__.length - 1));
                std.__input_buffer_index_dec__();
                
                std.cls();

                std.fflush(std.stdout);
                std.write(std.stdout, std.__input_buffer__);
            }
   
            break;


        default:

            if (String(event.key).length > 1) {
                return 0;
            }
            
            std.__input_buffer_app__(String(event.key));
            std.__input_buffer_index_inc__();
     
            std.write(std.stdout, std.__input_buffer__);
            break;
    }
}

window.addEventListener(
    "keydown",
    w_key_event
)


//  does some basic user setup before giving control over to user created software, terminal, etc
function
__init__() {
    console.log("__init__");
    std.env_update();
    std.fflush(std.stdin);
}

__init__();