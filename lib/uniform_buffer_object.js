"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_1 = require("./buffer");
var constants_1 = require("./constants");
/**
 * An uniform buffer object.
 */
var UniformBufferObject = /** @class */ (function () {
    function UniformBufferObject(blockName, bufferOrBufferArgs) {
        if (bufferOrBufferArgs === void 0) { bufferOrBufferArgs = { dataOrLength: null, dataType: constants_1.FLOAT, usage: constants_1.STATIC_DRAW }; }
        this._blockName = blockName;
        this._blockIndex = null;
        this._javascriptIndex = null;
        this._isInitialized = false;
        if (bufferOrBufferArgs instanceof buffer_1.UniformBuffer) {
            this._buffer = bufferOrBufferArgs;
        }
        else {
            this._buffer = new buffer_1.UniformBuffer(bufferOrBufferArgs);
        }
    }
    /**
     * Initializes the uniform buffer object.
     * Do not call this method manually.
     * @param {WebGL2RenderingContext} context
     * @param {WebGLProgram} program
     * @param {number} jsIndex
     * @private
     */
    UniformBufferObject.prototype._init = function (context, program, jsIndex) {
        this._blockIndex = context.getUniformBlockIndex(program, this._blockName);
        this._javascriptIndex = jsIndex;
        context.uniformBlockBinding(program, this._blockIndex, jsIndex);
        this._buffer._initOnce(context, program);
        context.bindBufferBase(constants_1.UNIFORM_BUFFER, jsIndex, this._buffer.glBuffer);
    };
    return UniformBufferObject;
}());
exports.UniformBufferObject = UniformBufferObject;
