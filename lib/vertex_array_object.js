"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VertexArrayObject = /** @class */ (function () {
    function VertexArrayObject(buffer, options) {
        if (options === void 0) { options = {}; }
        this._buffer = buffer;
        this._glContext = null;
        this._glVertexArrayObject = null;
        this._enabledAttributes = ('attributes' in options) ? options.attributes : null;
        this._mustWriteData = 'dataOrLength' in options;
        if (this._mustWriteData) {
            this._dataOrLength = options.dataOrLength;
        }
        this._isInitialized = false;
    }
    /**
     * Initializes the vertex array object.
     * Do not call this method manually.
     * @param {WebGL2RenderingContext} context
     * @param {WebGLProgram} program
     * @private
     */
    VertexArrayObject.prototype._init = function (context, program) {
        if (this._mustWriteData) {
            this._buffer.bufferData(this._dataOrLength);
        }
        this._buffer._initOnce(context, program, this._enabledAttributes);
        var vao = this._buffer._createWebGLVertexArrayObject(context, program, this._enabledAttributes);
        this._glContext = context;
        this._glVertexArrayObject = vao;
        this._isInitialized = true;
    };
    Object.defineProperty(VertexArrayObject.prototype, "buffer", {
        /**
         * Returns buffer bound to the vertex array object.
         * @returns {Buffer}
         */
        get: function () {
            return this._buffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VertexArrayObject.prototype, "glVertexArrayObject", {
        /**
         * Returns `WebGLVertexArrayObject` if the vertex array object is initialized.
         * Otherwise, throws an error.
         * @returns {WebGLVertexArrayObject}
         */
        get: function () {
            if (this._isInitialized) {
                return this._glVertexArrayObject;
            }
            else {
                throw new Error('This vertex array object is not added to any program yet.');
            }
        },
        enumerable: true,
        configurable: true
    });
    return VertexArrayObject;
}());
exports.VertexArrayObject = VertexArrayObject;
