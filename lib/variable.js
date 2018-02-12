"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
/**
 * An attribute variable.
 */
var Attribute = /** @class */ (function () {
    function Attribute(name, size) {
        this._name = name;
        this._size = size;
    }
    Attribute.prototype.equals = function (other) {
        return this.name === other.name && this.size === other.size;
    };
    Object.defineProperty(Attribute.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Attribute.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    return Attribute;
}());
exports.Attribute = Attribute;
/**
 * An uniform variable.
 */
var Uniform = /** @class */ (function () {
    function Uniform(name) {
        this._name = name;
        this._location = null;
        this._glContext = null;
        this._glProgram = null;
        this._flushData = function (context, location) { };
    }
    /**
     * Sets the uniform variable to the value.
     * @param {number} value
     * @param {number} type
     */
    Uniform.prototype.setValue = function (value, type) {
        if (type === constants_1.FLOAT) {
            this._flushData = function (context, location) {
                context.uniform1f(location, value);
            };
        }
        else if (type === constants_1.INT) {
            this._flushData = function (context, location) {
                context.uniform1i(location, value);
            };
        }
        else if (type === constants_1.UNSIGNED_INT) {
            this._flushData = function (context, location) {
                context.uniform1ui(location, value);
            };
        }
        this._flush();
    };
    /**
     * Sets the uniform variable to the vector.
     * @param {TypedArrayLike} value
     * @param {number} type
     */
    Uniform.prototype.setVector = function (value, type) {
        var length = value.length;
        if (length === 1) {
            this.setVector1(value, type);
        }
        else if (length === 2) {
            this.setVector2(value, type);
        }
        else if (length === 3) {
            this.setVector3(value, type);
        }
        else if (length === 4) {
            this.setVector4(value, type);
        }
        else {
            throw new Error("Length of value must be 1, 2, 3 or 4. Your value length is " + length);
        }
    };
    Uniform.prototype.setVector1 = function (value, type) {
        if (type === constants_1.FLOAT) {
            this._flushData = function (context, location) {
                context.uniform1fv(location, value);
            };
        }
        else if (type === constants_1.INT) {
            this._flushData = function (context, location) {
                context.uniform1iv(location, value);
            };
        }
        else if (type === constants_1.UNSIGNED_INT) {
            this._flushData = function (context, location) {
                context.uniform1uiv(location, value);
            };
        }
        this._flush();
    };
    Uniform.prototype.setVector2 = function (value, type) {
        if (type === constants_1.FLOAT) {
            this._flushData = function (context, location) {
                context.uniform2fv(location, value);
            };
        }
        else if (type === constants_1.INT) {
            this._flushData = function (context, location) {
                context.uniform2iv(location, value);
            };
        }
        else if (type === constants_1.UNSIGNED_INT) {
            this._flushData = function (context, location) {
                context.uniform2uiv(location, value);
            };
        }
        this._flush();
    };
    Uniform.prototype.setVector3 = function (value, type) {
        if (type === constants_1.FLOAT) {
            this._flushData = function (context, location) {
                context.uniform3fv(location, value);
            };
        }
        else if (type === constants_1.INT) {
            this._flushData = function (context, location) {
                context.uniform3iv(location, value);
            };
        }
        else if (type === constants_1.UNSIGNED_INT) {
            this._flushData = function (context, location) {
                context.uniform3uiv(location, value);
            };
        }
        this._flush();
    };
    Uniform.prototype.setVector4 = function (value, type) {
        if (type === constants_1.FLOAT) {
            this._flushData = function (context, location) {
                context.uniform4fv(location, value);
            };
        }
        else if (type === constants_1.INT) {
            this._flushData = function (context, location) {
                context.uniform4iv(location, value);
            };
        }
        else if (type === constants_1.UNSIGNED_INT) {
            this._flushData = function (context, location) {
                context.uniform4uiv(location, value);
            };
        }
        this._flush();
    };
    /**
     * Sets the uniform variable to the matrix.
     * @param {Float32Array} value
     */
    Uniform.prototype.setMatrix = function (value) {
        var size = value.length;
        if (size === 4) {
            this.setMatrix2(value);
        }
        else if (size === 9) {
            this.setMatrix3(value);
        }
        else if (size === 16) {
            this.setMatrix4(value);
        }
        else {
            throw new Error("Failed to detect size of the matrix. If you use a non-square matrix, use setMatrixNxN instead.");
        }
    };
    Uniform.prototype.setMatrix2 = function (value) {
        this._flushData = function (context, location) {
            context.uniformMatrix2fv(location, false, value);
        };
        this._flush();
    };
    Uniform.prototype.setMatrix3 = function (value) {
        this._flushData = function (context, location) {
            context.uniformMatrix3fv(location, false, value);
        };
        this._flush();
    };
    Uniform.prototype.setMatrix4 = function (value) {
        this._flushData = function (context, location) {
            context.uniformMatrix4fv(location, false, value);
        };
        this._flush();
    };
    Uniform.prototype._flush = function () {
        if (this.isLocated && this._glContext !== null) {
            this._flushData(this._glContext, this._location);
        }
    };
    Uniform.prototype._init = function (context, program) {
        this._location = context.getUniformLocation(program, this._name);
        this._glContext = context;
        this._glProgram = program;
        this._flush();
    };
    Object.defineProperty(Uniform.prototype, "isLocated", {
        get: function () {
            return this._location !== null;
        },
        enumerable: true,
        configurable: true
    });
    return Uniform;
}());
exports.Uniform = Uniform;
