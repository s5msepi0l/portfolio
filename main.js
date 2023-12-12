/*  main.js
 * - This file contains functions and such that act as a "kernel" of sorts for handling user input in a 
 * neet and easy to user API for furthur expansions
 * 
 * Note: variables with the "__" prefix are reserved by the kernel
 * Note: stdin is just a global array that can be accessed via user defined software
*/

const __header_ptr__ = document.getElementById("header");
const __terminal_ptr = document.getElementById("terminal");

const __std_out_ptr__ = document.getElementById("__std_out__");
//const __std_in_ptr__ = document.getElementById("__std_in__");

const stdin = 0;
const stdout = 1;
const stderr = 2;

const __INPUT_BUFFER_SIZE__ = 1024;
const __OUTPUT_BUFFER_SIZE__ = 1024 * 8;

var __input_buffer_index__ = 0;
var __input_buffer__ = "";

var __output_buffer__ = "";

//stderr is treated the same as stdout
function fflush(fd) {
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
function _stringify() {
    let str_buf = "";
    let arr = __input_buffer__.substring(0, __input_buffer_index__);
    for (let i = 0; i<arr.length; i++) {
        str_buf += String(arr[i]);
    }

    return str_buf;
}

// expects string array as parameter | does not have a return value | also assumes that the user already did all of the error checking
// Note this does not flush the output buffer nor the input buffer
function write(fd, buffer, n_bytes) {
    switch(fd) {
        case stdout:
            __output_buffer__ += buffer;

            __std_out_ptr__.innerHTML = __output_buffer__;

            //console.log(_stringify());
            break;

    }
}

//clears output buffer
function cls() {
    fflush(stdout);
    write(stdout, "", 0);
}

//  implement me | returns a string parameter to the user application | flushes input buffer after reading
async function read(fd, n_bytes) {

}

//  updates input buffer if event is not the enter key
function w_key_event(event) {
    write(stdout, __input_buffer__, __input_buffer_index__);
    fflush(stdout);
    console.log(String(event.key));

    switch (String(event.key)) {
        case "Enter": 
            cls();
            fflush(stdin);
            break;
        
        case "Backspace":
            if (__input_buffer_index__ > 0) {
                __input_buffer__ = __input_buffer__.substring(0, __input_buffer__.length - 1);
                __input_buffer_index__--;
                
                cls();

                fflush(stdout);
                write(stdout, __input_buffer__, __input_buffer_index__);
            }

            break;


        default:
            __input_buffer__ += String(event.key);
            __input_buffer_index__++;
            console.log("arr: " + __input_buffer__ + " len: " + __input_buffer_index__);   
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
    fflush(stdin);
}

__init__();

function allat() {
    alert("I aint implementing allat \n 🗣️🗣️🗣️🗣️🗣️💯💯💯💯💯💯💯");
}