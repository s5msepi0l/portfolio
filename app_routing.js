/* routing.js
 * parses and routes user requests to user defined programs along with the appropriate args
 * every program contains the following two things a string that is used for routing purposes
 * and the self contained function that takes two parameters 
 * argv | a string array of args supplied by the caller
 * env  | json object of environment variables e.g directory
 * the function expects a int return value to indicate any possible errors
 * function ls(argv, env) {
 *     return 0;
 * }
 * TODO:
 *
*/

import * as std from "./stdio.js"

export class routing {
    insert(route, func) { //no clue why but js will only accept a string as the key
        this.routes[route] = func;
    }

    fetch(route) {
        let r = this.routes[route];
        return r === undefined ? null: r;
    }


    //parse user command into json object 
    parse(src) {
        let cmd_i;
        if ((cmd_i = src.indexOf(" ")) == -1 && src.length > 0) {
            cmd_i = src.length;
        } else { // args present inside of string
            cmd_i = src.indexOf(" "); // shoud probably for the love of god find the first instande of space
        }

        let cmd_r = src.substring(0, cmd_i);  
        let route_r = this.fetch(cmd_r);

        //parse args | slow but I'm not gonna bother refactoring this fucking mess | FUCK string parsing
        let args = (src.substring(cmd_i, src.length)).split(" ");
        
        let ret = {
            cmd: cmd_r,
            route: route_r,
            argv: args
        };

        return ret;
    }

    async run(cmd) {
        if (cmd.route != undefined) { //route is valid
            return await cmd.route(cmd.argv, std.__env__); //return value
        }
    }

    // execute program in the form of a string w a eval expression
    // doubt this is actually practical
    async alt_run(func, args) {
        let fn = async(args, env) => {
            const fn = new Function(`${func}; return main;`)();
            return await fn(args, env);
        }

        return await fn(args, std.__env__);
    }

    constructor() {
        this.routes = {};
    }
}