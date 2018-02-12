"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var ShaderBase = /** @class */ (function () {
    function ShaderBase(source, shaderType) {
        this._source = source;
        this._glShader = null;
        this._isCompiled = false;
        this._shaderType = shaderType;
    }
    ShaderBase.prototype._compile = function (context) {
        var shader = context.createShader(this._shaderType);
        context.shaderSource(shader, this._source);
        context.compileShader(shader);
        var compileStatus = context.getShaderParameter(shader, context.COMPILE_STATUS);
        if (!compileStatus) {
            var info = context.getShaderInfoLog(shader);
            throw new Error(info);
        }
        this._glShader = shader;
        this._isCompiled = true;
        return shader;
    };
    Object.defineProperty(ShaderBase.prototype, "isCompiled", {
        /**
         * Returns if the shader is compiled.
         * @returns {boolean}
         */
        get: function () {
            return this._isCompiled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderBase.prototype, "glShader", {
        /**
         * Returns `WebGLShader` when the shader is already compiled.
         * Otherwise throws an error.
         * @returns {WebGLShader}
         */
        get: function () {
            if (!this._glShader === null) {
                throw new Error('This shader is not compiled yet.');
            }
            return this._glShader;
        },
        enumerable: true,
        configurable: true
    });
    return ShaderBase;
}());
exports.ShaderBase = ShaderBase;
/**
 * A vertex shader.
 */
var VertexShader = /** @class */ (function (_super) {
    __extends(VertexShader, _super);
    function VertexShader(source) {
        return _super.call(this, source, constants_1.VERTEX_SHADER) || this;
    }
    return VertexShader;
}(ShaderBase));
exports.VertexShader = VertexShader;
/**
 * A fragment shader.
 */
var FragmentShader = /** @class */ (function (_super) {
    __extends(FragmentShader, _super);
    function FragmentShader(source) {
        return _super.call(this, source, constants_1.FRAGMENT_SHADER) || this;
    }
    return FragmentShader;
}(ShaderBase));
exports.FragmentShader = FragmentShader;
/**
 * A shader program.
 */
var Program = /** @class */ (function () {
    function Program(args) {
        this._vertexShader = args.vertexShader;
        this._fragmentShader = args.fragmentShader;
        this._feedbackVaryings = ('feedbackVaryings' in args) ? args.feedbackVaryings : [];
        this._feedbackBufferMode = ('feedbackBufferMode' in args) ? args.feedbackBufferMode : constants_1.INTERLEAVED_ATTRIBS;
        this._isLinked = false;
        this._glContext = null;
        this._glProgram = null;
        this._initializedBuffers = [];
        this._uninitializedBuffers = [];
        this._initializedUniforms = [];
        this._uninitializedUniforms = [];
        this._initializedVertexArrayObjects = [];
        this._uninitializedVertexArrayObject = [];
        this._initializedUniformBufferObjects = [];
        this._uninitializedUniformBufferObjects = [];
        this._currentIndexBuffer = null;
        this._currentVertexArrayObject = null;
        this.id = null;
    }
    /**
     * Adds a buffer to the program.
     * @param {Buffer} buffer
     */
    Program.prototype.addBuffer = function (buffer) {
        if (buffer.bufferType === constants_1.ELEMENT_ARRAY_BUFFER) {
            this._currentIndexBuffer = buffer;
        }
        if (this.isLinked) {
            buffer._initOnce(this._glContext, this._glProgram);
            if (buffer.bufferType === constants_1.ELEMENT_ARRAY_BUFFER && this._glContext !== null) {
                this._glContext.bindBuffer(constants_1.ELEMENT_ARRAY_BUFFER, buffer.glBuffer);
            }
            this._initializedBuffers.push(buffer);
        }
        else {
            if (buffer.isInitialized) {
                this._initializedBuffers.push(buffer);
            }
            else {
                this._uninitializedBuffers.push(buffer);
            }
        }
    };
    /**
     * Activates the `ElementArrayBuffer` as a index buffer.
     * @param {ElementArrayBuffer} buffer
     */
    Program.prototype.activateElementArrayBuffer = function (buffer) {
        this._currentIndexBuffer = buffer;
        if (this.isLinked && this._glContext !== null) {
            this._glContext.bindBuffer(constants_1.ELEMENT_ARRAY_BUFFER, buffer.glBuffer);
        }
    };
    /**
     * Adds an uniform variable to the program.
     * @param {Uniform} uniform
     */
    Program.prototype.addUniform = function (uniform) {
        if (this.isLinked) {
            uniform._init(this._glContext, this._glProgram);
            this._initializedUniforms.push(uniform);
        }
        else {
            this._uninitializedUniforms.push(uniform);
        }
    };
    /**
     * Adds a `VertexArrayObject` to the program.
     * @param {VertexArrayObject} vao
     */
    Program.prototype.addVertexArrayObject = function (vao) {
        if (this.isLinked) {
            vao._init(this._glContext, this._glProgram);
            this._initializedVertexArrayObjects.push(vao);
            this._initializedBuffers.push(vao.buffer);
        }
        else {
            this._uninitializedVertexArrayObject.push(vao);
        }
    };
    /**
     * Activates the `VertexArrayObject`.
     * @param {VertexArrayObject} vao
     */
    Program.prototype.activateVertexArrayObject = function (vao) {
        this._currentVertexArrayObject = vao;
        if (this.isLinked) {
            var context = this._glContext;
            context.bindVertexArray(vao.glVertexArrayObject);
        }
    };
    /**
     * Adds an `UniformBufferObject` to the program.
     * @param {UniformBufferObject} ubo
     */
    Program.prototype.addUniformBufferObject = function (ubo) {
        if (this.isLinked) {
            var index = this._initializedUniformBufferObjects.length;
            ubo._init(this._glContext, this._glProgram, index);
            this._initializedUniformBufferObjects.push(ubo);
        }
        else {
            this._uninitializedUniformBufferObjects.push(ubo);
        }
    };
    /**
     * Issues a draw call, which draws graphics.
     * @param {number} mode
     * @param {number | null} count
     */
    Program.prototype.draw = function (mode, count) {
        if (count === void 0) { count = null; }
        if (this._glContext !== null) {
            if (this._currentIndexBuffer !== null && this._currentIndexBuffer.data !== null) {
                this._glContext.drawElements(mode, this._currentIndexBuffer.data.length, this._currentIndexBuffer.dataType, 0);
            }
            else if (this._initializedBuffers.length > 0) {
                var c = (count !== null) ? count : this._initializedBuffers[0].dataCount;
                this._glContext.drawArrays(mode, 0, c);
            }
        }
    };
    Program.prototype.activate = function () {
        this._initializedBuffers.forEach(function (b) { return b.activate(); });
    };
    Program.prototype.deactivate = function () {
        this._initializedBuffers.forEach(function (b) { return b.deactivate(); });
    };
    /**
     * Links the shader program.
     * This method is called internally. So you don't have to call this method manually.
     * @param {WebGL2RenderingContext} context
     */
    Program.prototype._link = function (context) {
        // compile shaders.
        this._vertexShader._compile(context);
        this._fragmentShader._compile(context);
        // create a program.
        var program = context.createProgram();
        context.attachShader(program, this._vertexShader.glShader);
        context.attachShader(program, this._fragmentShader.glShader);
        if (this._feedbackVaryings.length > 0) {
            context.transformFeedbackVaryings(program, this._feedbackVaryings, this._feedbackBufferMode);
        }
        context.linkProgram(program);
        var linkStatus = context.getProgramParameter(program, context.LINK_STATUS);
        if (!linkStatus) {
            var info = context.getProgramInfoLog(program);
            throw new Error(info);
        }
        this._glContext = context;
        this._glProgram = program;
        this._isLinked = true;
        // initialize buffers.
        var buffer = null;
        while (buffer = this._uninitializedBuffers.shift()) {
            buffer._init(context, program);
            if (buffer.bufferType === constants_1.ELEMENT_ARRAY_BUFFER && this._currentIndexBuffer === null) {
                this._currentIndexBuffer = buffer;
            }
            this._initializedBuffers.push(buffer);
        }
        if (this._currentIndexBuffer !== null) {
            context.bindBuffer(constants_1.ELEMENT_ARRAY_BUFFER, this._currentIndexBuffer);
        }
        // initialize uniforms.
        var uniform = null;
        while (uniform = this._uninitializedUniforms.shift()) {
            uniform._init(context, program);
            this._initializedUniforms.push(uniform);
        }
        // initialize VertexArrayObjects.
        var vao = null;
        while (vao = this._uninitializedVertexArrayObject.shift()) {
            vao._init(context, program);
            this._initializedVertexArrayObjects.push(vao);
            this._initializedBuffers.push(vao.buffer);
        }
        if (this._currentVertexArrayObject !== null) {
            context.bindVertexArray(this._currentVertexArrayObject.glVertexArrayObject);
        }
        // initialize UniformBufferObjects
        var ubo = null;
        while (ubo = this._uninitializedUniformBufferObjects.shift()) {
            var index = this._initializedUniformBufferObjects.length;
            ubo._init(context, program, index);
            this._initializedUniformBufferObjects.push(ubo);
        }
    };
    Object.defineProperty(Program.prototype, "isLinked", {
        /**
         * Returns if the program is linked.
         * @returns {boolean}
         */
        get: function () {
            return this._isLinked;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Program.prototype, "glProgram", {
        /**
         * Returns `WebGLProgram` when the program is already linked.
         * Otherwise throws an error.
         * @returns {WebGLProgram}
         */
        get: function () {
            if (this._glProgram === null) {
                throw new Error("This program is not linked yet.");
            }
            return this._glProgram;
        },
        enumerable: true,
        configurable: true
    });
    return Program;
}());
exports.Program = Program;
