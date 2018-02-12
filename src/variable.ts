import { FLOAT, INT, UNSIGNED_INT } from './constants';

export type TypedArrayLike = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array;

/**
 * An attribute variable.
 */
export class Attribute {
  protected _name: string;
  protected _size: number;

  constructor(name: string, size: number) {
    this._name = name;
    this._size = size;
  }

  equals(other: Attribute): boolean {
    return this.name === other.name && this.size === other.size;
  }

  get name(): string {
    return this._name;
  }

  get size(): number {
    return this._size;
  }
}

/**
 * An uniform variable.
 */
export class Uniform {
  protected _name: string;
  protected _location: WebGLUniformLocation | null;
  protected _glContext: WebGL2RenderingContext | null;
  protected _glProgram: WebGLProgram | null;
  protected _flushData: (context: WebGL2RenderingContext, location: WebGLUniformLocation) => void;

  constructor(name: string) {
    this._name = name;
    this._location = null;
    this._glContext = null;
    this._glProgram = null;
    this._flushData = (context: WebGL2RenderingContext, location: WebGLUniformLocation) => {};
  }

  /**
   * Sets the uniform variable to the value.
   * @param {number} value
   * @param {number} type
   */
  setValue(value: number, type: number) {
    if(type === FLOAT) {
      this._flushData = (context: WebGL2RenderingContext, location: WebGLUniformLocation) => {
        context.uniform1f(location, value);
      };
    } else if (type === INT) {
      this._flushData = (context: WebGL2RenderingContext, location: WebGLUniformLocation) => {
        context.uniform1i(location, value);
      };
    } else if (type === UNSIGNED_INT) {
      this._flushData = (context: WebGL2RenderingContext, location: WebGLUniformLocation) => {
        context.uniform1ui(location, value);
      };
    }

    this._flush();
  }

  /**
   * Sets the uniform variable to the vector.
   * @param {TypedArrayLike} value
   * @param {number} type
   */
  setVector(value: TypedArrayLike, type: number) {
    const length = value.length;

    if(length === 1) {
      this.setVector1(value, type);
    } else if(length === 2) {
      this.setVector2(value, type);
    } else if(length === 3) {
      this.setVector3(value, type);
    } else if(length === 4) {
      this.setVector4(value, type);
    } else {
      throw new Error(`Length of value must be 1, 2, 3 or 4. Your value length is ${length}`);
    }
  }

  setVector1(value: TypedArrayLike, type: number) {
    if(type === FLOAT) {
      this._flushData = (context: WebGL2RenderingContext, location: WebGLUniformLocation) => {
        context.uniform1fv(location, <Float32Array>value);
      };
    } else if (type === INT) {
      this._flushData = (context: WebGL2RenderingContext, location: WebGLUniformLocation) => {
        context.uniform1iv(location, <Int32Array>value);
      };
    } else if (type === UNSIGNED_INT) {
      this._flushData = (context: WebGL2RenderingContext, location: WebGLUniformLocation) => {
        context.uniform1uiv(location, <Uint32Array>value);
      };
    }

    this._flush();
  }

  setVector2(value: TypedArrayLike, type: number) {
    if(type === FLOAT) {
      this._flushData = (context: WebGL2RenderingContext, location: WebGLUniformLocation) => {
        context.uniform2fv(location, <Float32Array>value);
      };
    } else if (type === INT) {
      this._flushData = (context: WebGL2RenderingContext, location: WebGLUniformLocation) => {
        context.uniform2iv(location, <Int32Array>value);
      };
    } else if (type === UNSIGNED_INT) {
      this._flushData = (context: WebGL2RenderingContext, location: WebGLUniformLocation) => {
        context.uniform2uiv(location, <Uint32Array>value);
      };
    }

    this._flush();
  }

  setVector3(value: TypedArrayLike, type: number) {
    if(type === FLOAT) {
      this._flushData = (context: WebGL2RenderingContext, location: WebGLUniformLocation) => {
        context.uniform3fv(location, <Float32Array>value);
      };
    } else if (type === INT) {
      this._flushData = (context: WebGL2RenderingContext, location: WebGLUniformLocation) => {
        context.uniform3iv(location, <Int32Array>value);
      };
    } else if (type === UNSIGNED_INT) {
      this._flushData = (context: WebGL2RenderingContext, location: WebGLUniformLocation) => {
        context.uniform3uiv(location, <Uint32Array>value);
      };
    }

    this._flush();
  }

  setVector4(value: TypedArrayLike, type: number) {
    if(type === FLOAT) {
      this._flushData = (context: WebGL2RenderingContext, location: WebGLUniformLocation) => {
        context.uniform4fv(location, <Float32Array>value);
      };
    } else if (type === INT) {
      this._flushData = (context: WebGL2RenderingContext, location: WebGLUniformLocation) => {
        context.uniform4iv(location, <Int32Array>value);
      };
    } else if (type === UNSIGNED_INT) {
      this._flushData = (context: WebGL2RenderingContext, location: WebGLUniformLocation) => {
        context.uniform4uiv(location, <Uint32Array>value);
      };
    }

    this._flush();
  }

  /**
   * Sets the uniform variable to the matrix.
   * @param {Float32Array} value
   */
  setMatrix(value: Float32Array) {
    const size = value.length;
    if(size === 4) {
      this.setMatrix2(value);
    } else if(size === 9) {
      this.setMatrix3(value);
    } else if(size === 16) {
      this.setMatrix4(value);
    } else {
      throw new Error(`Failed to detect size of the matrix. If you use a non-square matrix, use setMatrixNxN instead.`);
    }
  }

  setMatrix2(value: Float32Array): void {
    this._flushData = (context: WebGL2RenderingContext, location: WebGLUniformLocation) => {
      context.uniformMatrix2fv(location, false, value);
    };

    this._flush();
  }

  setMatrix3(value: Float32Array): void {
    this._flushData = (context: WebGL2RenderingContext, location: WebGLUniformLocation) => {
      context.uniformMatrix3fv(location, false, value);
    };

    this._flush();
  }

  setMatrix4(value: Float32Array): void {
    this._flushData = (context: WebGL2RenderingContext, location: WebGLUniformLocation) => {
      context.uniformMatrix4fv(location, false, value);
    };

    this._flush();
  }

  _flush() {
    if(this.isLocated && this._glContext !== null) {
      this._flushData(this._glContext, <WebGLUniformLocation>this._location);
    }
  }

  _init(context: WebGL2RenderingContext, program: WebGLProgram) {
    this._location = context.getUniformLocation(program, this._name);
    this._glContext = context;
    this._glProgram = program;
    this._flush();
  }

  get isLocated(): boolean {
    return this._location !== null;
  }
}