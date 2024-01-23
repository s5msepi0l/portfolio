/* stdio.js
 *
 * general interface to interact with browser terminal and "files"
 */

import  {routing} from "./app_routing.js"
import {storage} from "./storage.js"

export const __header_ptr__ = document.getElementById("header");
export const __terminal_ptr = document.getElementById("terminal");

export const __std_out_ptr__ = document.getElementById("__std_out__");
//const __std_in_ptr__ = document.getElementById("__std_in__");

export const __header_out_ptr__ = document.getElementById("header");

export var __routing__ = new routing;

// system fd's
export const stdin = 0;
export const stdout = 1;
export const stderr = 2;

// recognized program exit codes | add exit codes as needed
export const ext_normal = 0;
export const ext_err_general = -1; // general program failure;
export const ext_err_no_arg = -2; // program closed due to lack of args

export function ext_code_handle(code) {
    switch(code) {
        case ext_normal:
            console.log("program exited gracefully");
            break;
        
        
        default: // not important enough to have a special label
            console.log("program exited ungracefully, code: " + code);
            write(stderr, "program exited unexpectedly, code: " + code);
    }
}

let str = "function main() {;;}"

let func = str;

//default pollrate unless specified
export const __SYS_POLL_RATE__ = 192;

export const __INPUT_BUFFER_SIZE__ = 1024;
export const __OUTPUT_BUFFER_SIZE__ = 1024 * 8;

export var __input_buffer_index__ = 0;
export var __input_buffer__ = "";

export var __output_buffer__ = "";

export var newl = "<br>";
export var err_clr = "rgb(221, 44, 76)";

// if the current terminal state is executing a program
export var routing_running = false;
export var __input_pipeline__ = "";
//export var __input_pipeline_n__ = 0;

export function __routing_status__(val) {
    routing_running = val;
}

export function __pipeline_input__(char) {
    __input_pipeline__ += char;
}

// fr bout to end my shi
export function __input_buffer_asign__(src) {
    __input_buffer__ = src;
}

export function __input_buffer_app__(char) {
    __input_buffer__ += char;
}

export function __input_buffer_index_inc__() {
    __input_buffer_index__++;
}

export function __input_buffer_index_dec__() {
    __input_buffer_index__--;
}

// no clue why i decided this was a good design choice
export var __env__ = {
    client_name: "root",
    path: "~",
    f_storage: new storage()
};

export function env_update() {
    __header_out_ptr__.innerHTML = __env__.client_name + ": " + __env__.path;
}

// no clue why this isn't a standard function | 
const sleep = ms => new Promise(r => setTimeout(r, ms));

//stderr is treated the same as stdout
export function fflush(fd) {
    switch(fd) {
        case stdin: 
            __input_buffer__ = "";
            //__input_buffer__ = new Array(__INPUT_BUFFER_SIZE__);
            __input_buffer_index__ = 0;
            break;
        
        case stdout: 
            __output_buffer__ = "";
            break;

        case stderr:
            __OUTPUT_BUFFER_SIZE__ = "";
            break;
    }
}

//returns the input buffer but in a js style string
export function _stringify() {
    let str_buf = "";
    let arr = __input_buffer__.substring(0, __input_buffer_index__);
    for (let i = 0; i<arr.length; i++) {
        str_buf += String(arr[i]);
    }

    return str_buf;
}

// expects string array as parameter | does not have a return value | also assumes that the user already did all of the error checking
// Note this does not flush the output buffer nor the input buffer
export function write(fd, buffer) {
    switch(fd) {
        case stdout:
            buffer = buffer.replace("\n", "<br>");

            __output_buffer__ += buffer;

            __std_out_ptr__.innerHTML = __output_buffer__;
            //console.log(_stringify());
            break;

        case stderr:  // it's just stdout but with red text hahahahahahaha
            __output_buffer__ += `<span style="color: ${err_clr};"> ${buffer} </span>`

            __std_out_ptr__.innerHTML = __output_buffer__;
            break;
        
        default:
            console.log("here\n\n\n\n\n");
    }
}

//clears output buffer
export function cls() {
    fflush(stdout);
    write(stdout, "", 0);
}

//  implement me | returns a string parameter to the user application | flushes input buffer after reading
//  can only be used by external software
export async function read(fd, n_bytes, poll_rate = __SYS_POLL_RATE__) {
    if (n_bytes == 0) return ;
    
    if (routing_running) {
        switch(fd) {
            case stdin:
                const sleep_time = 1000 / poll_rate; 
                let len = __input_pipeline__.length;
                while ((len = __input_pipeline__.length) < n_bytes) {
                    
                    if (__input_pipeline__.endsWith("\n")) {
                        //write(stdout, newl);
                        break;
                    }

                    await sleep(sleep_time);
                }

                const buffer = __input_pipeline__;
                __input_pipeline__ = "";
                
                return buffer;
        
            default: // check internal unreserved fd list | implement me!
                break;
        }
    }

}