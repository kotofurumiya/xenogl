/// <reference types="webgl2" />
export declare type TypedArrayLike = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array;
/**
 * An attribute variable.
 */
export declare class Attribute {
    protected _name: string;
    protected _size: number;
    constructor(name: string, size: number);
    equals(other: Attribute): boolean;
    readonly name: string;
    readonly size: number;
}
/**
 * An uniform variable.
 */
export declare class Uniform {
    protected _name: string;
    protected _location: WebGLUniformLocation | null;
    protected _glContext: WebGL2RenderingContext | null;
    protected _glProgram: WebGLProgram | null;
    protected _flushData: (context: WebGL2RenderingContext, location: WebGLUniformLocation) => void;
    constructor(name: string);
    /**
     * Sets the uniform variable to the value.
     * @param {number} value
     * @param {number} type
     */
    setValue(value: number, type: number): void;
    /**
     * Sets the uniform variable to the vector.
     * @param {TypedArrayLike} value
     * @param {number} type
     */
    setVector(value: TypedArrayLike, type: number): void;
    setVector1(value: TypedArrayLike, type: number): void;
    setVector2(value: TypedArrayLike, type: number): void;
    setVector3(value: TypedArrayLike, type: number): void;
    setVector4(value: TypedArrayLike, type: number): void;
    /**
     * Sets the uniform variable to the matrix.
     * @param {Float32Array} value
     */
    setMatrix(value: Float32Array): void;
    setMatrix2(value: Float32Array): void;
    setMatrix3(value: Float32Array): void;
    setMatrix4(value: Float32Array): void;
    _flush(): void;
    _init(context: WebGL2RenderingContext, program: WebGLProgram): void;
    readonly isLocated: boolean;
}
