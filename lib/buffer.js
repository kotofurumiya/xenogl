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
var utils_1 = require("./utils");
var BufferBase = /** @class */ (function () {
    function BufferBase(args, bufferType) {
        if (args === void 0) { args = { dataOrLength: null, attributes: [], dataType: constants_1.FLOAT, usage: constants_1.STATIC_DRAW }; }
        var _this = this;
        this._glContext = null;
        this._glProgram = null;
        this._glBuffer = null;
        this._dataOrLength = ('dataOrLength' in args) ? args.dataOrLength : null;
        this._attributes = ('attributes' in args) ? args.attributes : [];
        this._enabledAttributes = this._attributes;
        this._attributeToLocation = new Map();
        this._dataType = ('dataType' in args) ? args.dataType : constants_1.FLOAT;
        this._usage = ('usage' in args) ? args.usage : constants_1.STATIC_DRAW;
        this._bufferType = bufferType;
        this._isInitialized = false;
        this._flushData = function (context, buffer) { };
        this._totalAttributesSize = this._attributes.reduce(function (prev, attr) { return prev + attr.size; }, 0);
        if (this._dataOrLength === null) {
            this._data = null;
        }
        else if (typeof this._dataOrLength === 'number') {
            this._data = null;
            this._flushData = function (context, buffer) {
                context.bindBuffer(_this._bufferType, buffer);
                context.bufferData(_this._bufferType, _this._dataOrLength, _this._usage);
                context.bindBuffer(_this._bufferType, null);
            };
        }
        else {
            this._data = this._dataOrLength;
            this._flushData = function (context, buffer) {
                context.bindBuffer(_this._bufferType, buffer);
                context.bufferData(_this._bufferType, _this._dataOrLength, _this._usage);
                context.bindBuffer(_this._bufferType, null);
            };
        }
    }
    /**
     * Send data to the buffer.
     * @param {TypedArrayLike | number} dataOrLength
     */
    BufferBase.prototype.bufferData = function (dataOrLength) {
        var _this = this;
        this._flushData = function (context, buffer) {
            _this._dataOrLength = dataOrLength;
            context.bindBuffer(_this._bufferType, buffer);
            if (typeof dataOrLength === 'number') {
                context.bufferData(_this._bufferType, dataOrLength, _this._usage);
            }
            else {
                context.bufferData(_this._bufferType, dataOrLength, _this._usage);
                _this._data = dataOrLength;
            }
            context.bindBuffer(_this._bufferType, null);
        };
        this._flush();
    };
    BufferBase.prototype.activate = function () {
        this._enableAttributes();
    };
    BufferBase.prototype.deactivate = function () {
        this._disableAttributes();
    };
    BufferBase.prototype._flush = function () {
        if (this._glContext !== null && this._glBuffer !== null) {
            this._flushData(this._glContext, this._glBuffer);
        }
    };
    /**
     * Initializes attributes.
     * Do not call this method manually.
     * @param {WebGL2RenderingContext} context
     * @param {WebGLProgram | null} program
     * @param {Attribute[] | null} attributes
     * @private
     */
    BufferBase.prototype._initAttributes = function (context, program, attributes) {
        var _this = this;
        if (attributes === void 0) { attributes = null; }
        this._enabledAttributes = this._attributes;
        if (attributes !== null) {
            this._enabledAttributes = attributes;
        }
        this._attributes.forEach(function (attr) {
            var location = context.getAttribLocation(program, attr.name);
            _this._attributeToLocation.set(attr, location);
        });
        var bytesPerElement = utils_1.getBytesPerElementByGlType(this._dataType);
        var strideBytes = bytesPerElement * this._totalAttributesSize;
        var offsetBytes = 0;
        var _loop_1 = function (i) {
            var attr = this_1._attributes[i];
            var location_1 = this_1._attributeToLocation.get(attr);
            if (this_1._enabledAttributes.find(function (e) { return e.equals(attr); })) {
                context.enableVertexAttribArray(location_1);
                context.vertexAttribPointer(location_1, attr.size, this_1._dataType, false, strideBytes, offsetBytes);
            }
            offsetBytes += attr.size * bytesPerElement;
        };
        var this_1 = this;
        for (var i = 0; i < this._attributes.length; i++) {
            _loop_1(i);
        }
    };
    BufferBase.prototype._enableAttributes = function () {
        if (this._glContext !== null) {
            var context = this._glContext;
            var program = this._glProgram;
            context.bindBuffer(this.bufferType, this._glBuffer);
            this._initAttributes(context, program, this._enabledAttributes);
            context.bindBuffer(this.bufferType, null);
        }
    };
    BufferBase.prototype._disableAttributes = function () {
        var _this = this;
        if (this._glContext !== null) {
            var context_1 = this._glContext;
            this._enabledAttributes.forEach(function (attr) {
                var location = _this._attributeToLocation.get(attr);
                context_1.disableVertexAttribArray(location);
            });
        }
    };
    /**
     * Initializes the buffer.
     * Do not call this method manually.
     * @param {WebGL2RenderingContext} context
     * @param {WebGLProgram | null} program
     * @param {Attribute[] | null} attributes
     * @private
     */
    BufferBase.prototype._init = function (context, program, attributes) {
        if (program === void 0) { program = null; }
        if (attributes === void 0) { attributes = null; }
        var buffer = context.createBuffer();
        context.bindBuffer(this._bufferType, buffer);
        if (program !== null) {
            this._initAttributes(context, program, attributes);
        }
        this._glContext = context;
        this._glProgram = program;
        this._glBuffer = buffer;
        this._flush();
        // unbind
        context.bindBuffer(this._bufferType, null);
        this._isInitialized = true;
    };
    /**
     * Initializes the buffer.
     * Do not call this method manually.
     * @param {WebGL2RenderingContext} context
     * @param {WebGLProgram | null} program
     * @param {Attribute[] | null} attributes
     * @private
     */
    BufferBase.prototype._initOnce = function (context, program, attributes) {
        if (program === void 0) { program = null; }
        if (attributes === void 0) { attributes = null; }
        if (!this.isInitialized) {
            this._init(context, program, attributes);
        }
    };
    /**
     * Creates and return `WebGLVertexArrayObject`.
     * You don't have to call this method manually.
     * @param {WebGL2RenderingContext} context
     * @param {WebGLProgram | null} program
     * @param {Attribute[] | null} attributes
     * @returns {WebGLVertexArrayObject}
     * @private
     */
    BufferBase.prototype._createWebGLVertexArrayObject = function (context, program, attributes) {
        if (program === void 0) { program = null; }
        if (attributes === void 0) { attributes = null; }
        var buffer = this._glBuffer;
        var vao = context.createVertexArray();
        context.bindVertexArray(vao);
        context.bindBuffer(this._bufferType, buffer);
        if (program !== null) {
            this._initAttributes(context, program, attributes);
        }
        if (this._dataOrLength !== null && typeof this._dataOrLength === 'number') {
            context.bufferData(this._bufferType, this._dataOrLength, this._usage);
        }
        else if (this._dataOrLength !== null) {
            context.bufferData(this._bufferType, this._dataOrLength, this._usage);
        }
        context.bindBuffer(this._bufferType, null);
        context.bindVertexArray(null);
        return vao;
    };
    Object.defineProperty(BufferBase.prototype, "data", {
        /**
         * Returns data of the buffer.
         * @returns {TypedArrayLike | null}
         */
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BufferBase.prototype, "dataType", {
        /**
         * Returns data type of the buffer.
         * @returns {number}
         */
        get: function () {
            return this._dataType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BufferBase.prototype, "dataCount", {
        /**
         * Returns how many data set stored in the buffer.
         * @returns {number}
         */
        get: function () {
            if (this.data !== null) {
                return this.data.length / this._totalAttributesSize;
            }
            else {
                return 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BufferBase.prototype, "usage", {
        /**
         * Returns usage of the buffer.
         * @returns {number}
         */
        get: function () {
            return this._usage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BufferBase.prototype, "isInitialized", {
        /**
         * Returns if the buffer is initialized.
         * @returns {boolean}
         */
        get: function () {
            return this._isInitialized;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BufferBase.prototype, "totalAttributesSize", {
        /**
         * Returns total size of attributes.
         * @returns {number}
         */
        get: function () {
            return this._totalAttributesSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BufferBase.prototype, "bufferType", {
        /**
         * Returns type of the buffer.
         * It can be `XenoGL..ARRAY_BUFFER` or `XenoGL..ELEMENT_ARRAY_BUFFER`.
         * @returns {number}
         */
        get: function () {
            return this._bufferType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BufferBase.prototype, "glBuffer", {
        /**
         * Returns `WebGLBuffer` if the buffer is initialized.
         * Otherwise, throws an error.
         * @returns {WebGLBuffer}
         */
        get: function () {
            if (this.isInitialized) {
                return this._glBuffer;
            }
            else {
                throw new Error('This buffer is not initialized yet.');
            }
        },
        enumerable: true,
        configurable: true
    });
    return BufferBase;
}());
exports.BufferBase = BufferBase;
/**
 * ArrayBuffer.
 */
var ArrayBuffer = /** @class */ (function (_super) {
    __extends(ArrayBuffer, _super);
    function ArrayBuffer(args) {
        if (args === void 0) { args = { dataOrLength: null, attributes: [], dataType: constants_1.FLOAT, usage: constants_1.STATIC_DRAW }; }
        return _super.call(this, args, constants_1.ARRAY_BUFFER) || this;
    }
    return ArrayBuffer;
}(BufferBase));
exports.ArrayBuffer = ArrayBuffer;
/**
 * ElementArrayBuffer.
 */
var ElementArrayBuffer = /** @class */ (function (_super) {
    __extends(ElementArrayBuffer, _super);
    function ElementArrayBuffer(args) {
        if (args === void 0) { args = { dataOrLength: null, attributes: [], dataType: constants_1.UNSIGNED_SHORT, usage: constants_1.STATIC_DRAW }; }
        return _super.call(this, args, constants_1.ELEMENT_ARRAY_BUFFER) || this;
    }
    return ElementArrayBuffer;
}(BufferBase));
exports.ElementArrayBuffer = ElementArrayBuffer;
/**
 * UniformBuffer.
 */
var UniformBuffer = /** @class */ (function (_super) {
    __extends(UniformBuffer, _super);
    function UniformBuffer(args) {
        if (args === void 0) { args = { dataOrLength: null, dataType: constants_1.UNSIGNED_SHORT, usage: constants_1.STATIC_DRAW }; }
        return _super.call(this, args, constants_1.UNIFORM_BUFFER) || this;
    }
    return UniformBuffer;
}(BufferBase));
exports.UniformBuffer = UniformBuffer;
