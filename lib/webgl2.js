"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var WebGL2 = /** @class */ (function () {
    function WebGL2(canvas) {
        this._context = canvas.getContext('webgl2');
        this._programs = [];
        this._activeProgram = null;
        this._transformFeedbacks = [];
        this._textures = [];
        this._activeTexture = null;
    }
    /**
     * Adds the program to the `WebGL2` and returns ID number of the program.
     * If any program is activated yet, this method activates the program.
     * @param {Program} program
     * @returns {number} Program ID
     */
    WebGL2.prototype.addProgram = function (program) {
        if (!program.isLinked) {
            program._link(this._context);
        }
        this._programs.push(program);
        if (this._activeProgram === null) {
            this._activeProgram = program;
            this._context.useProgram(program.glProgram);
        }
        var id = this._programs.length - 1;
        program.id = id;
        return id;
    };
    /**
     * Adds the transform feedback to `WebGL2`.
     * @param {TransformFeedback} tf
     */
    WebGL2.prototype.addTransformFeedback = function (tf) {
        this._transformFeedbacks.push(tf);
        tf._init(this._context);
    };
    WebGL2.prototype.addTexture = function (texture) {
        var id = this._textures.length;
        this._textures.push(texture);
        texture._init(this._context, id);
        if (this._activeTexture === null) {
            texture.activate();
        }
    };
    /**
     * Activates a program and deactivates the previous program.
     * Throws an error when the program is not attached to WebGL2.
     * @param {Program} program
     */
    WebGL2.prototype.activateProgram = function (program) {
        if (program.id === null) {
            throw new Error("This program is not added to WebGL2 yet. Add it by using addProgram method.");
        }
        else {
            this.activateProgramByID(program.id);
        }
    };
    /**
     * Activates a program by ID and deactivates the previous program.
     * Throws an error when the ID does not exist.
     * @param {number} id
     */
    WebGL2.prototype.activateProgramByID = function (id) {
        if (id > this._programs.length) {
            throw new Error("ID " + id + " does not exist.");
        }
        if (this._activeProgram !== null) {
            this._activeProgram.deactivate();
        }
        var program = this._programs[id];
        this._context.useProgram(program.glProgram);
        program.activate();
        this._activeProgram = program;
    };
    /**
     * Uses the program as a current program.
     * @param {Program} program
     */
    WebGL2.prototype.useProgram = function (program) {
        if (program.id === null) {
            throw new Error("This program is not added to WebGL2 yet. Add it by using addProgram method.");
        }
        else {
            this.useProgramByID(program.id);
        }
    };
    /**
     * Uses the program as a current program.
     * @param {number} id
     */
    WebGL2.prototype.useProgramByID = function (id) {
        if (id > this._programs.length) {
            throw new Error("ID " + id + " does not exist.");
        }
        var program = this._programs[id];
        this._context.useProgram(program.glProgram);
        this._activeProgram = program;
    };
    WebGL2.prototype.activateTexture = function (texture) {
    };
    /**
     * Deactivates the program.
     * @param {Program} program
     */
    WebGL2.prototype.deactivateProgram = function (program) {
        program.deactivate();
    };
    WebGL2.prototype.draw = function (mode, count) {
        if (count === void 0) { count = null; }
        if (this._activeProgram !== null) {
            this._activeProgram.draw(mode, count);
        }
    };
    WebGL2.prototype.clear = function (mask) {
        if (mask === void 0) { mask = constants_1.COLOR_BUFFER_BIT; }
        this._context.clear(mask);
    };
    WebGL2.prototype.clearColor = function (r, g, b, a) {
        this._context.clearColor(r, b, g, a);
    };
    WebGL2.prototype.enable = function (cap) {
        this._context.enable(cap);
    };
    WebGL2.prototype.disable = function (cap) {
        this._context.disable(cap);
    };
    return WebGL2;
}());
exports.WebGL2 = WebGL2;
