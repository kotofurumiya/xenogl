/// <reference types="webgl2" />
import { Attribute, TypedArrayLike } from './variable';
export interface Buffer {
    readonly data: TypedArrayLike | null;
    readonly dataType: number;
    readonly usage: number;
    readonly bufferType: number;
    readonly totalAttributesSize: number;
    readonly dataCount: number;
    readonly glBuffer: WebGLBuffer | null;
    readonly isInitialized: boolean;
    bufferData(data: TypedArrayLike | number): void;
    activate(): void;
    deactivate(): void;
    _init(context: WebGL2RenderingContext, program?: WebGLProgram | null, attributes?: Attribute[] | null): void;
    _initOnce(context: WebGL2RenderingContext, program?: WebGLProgram | null, attributes?: Attribute[] | null): void;
    _createWebGLVertexArrayObject(context: WebGL2RenderingContext, program?: WebGLProgram | null, attributes?: Attribute[] | null): WebGLVertexArrayObject;
}
export declare abstract class BufferBase implements Buffer {
    protected _glContext: WebGL2RenderingContext | null;
    protected _glProgram: WebGLProgram | null;
    protected _glBuffer: WebGLBuffer | null;
    protected _dataOrLength: TypedArrayLike | number | null;
    protected _data: TypedArrayLike | null;
    protected _attributes: Attribute[];
    protected _enabledAttributes: Attribute[];
    protected _attributeToLocation: Map<Attribute, number>;
    protected _dataType: number;
    protected _usage: number;
    protected _bufferType: number;
    protected _isInitialized: boolean;
    protected _flushData: (context: WebGL2RenderingContext, buffer: WebGLBuffer) => void;
    protected _totalAttributesSize: number;
    constructor(args: {
        dataOrLength?: number | Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | null | undefined;
        attributes?: Attribute[] | undefined;
        dataType?: number | undefined;
        usage?: number | undefined;
    } | undefined, bufferType: number);
    /**
     * Send data to the buffer.
     * @param {TypedArrayLike | number} dataOrLength
     */
    bufferData(dataOrLength: TypedArrayLike | number): void;
    activate(): void;
    deactivate(): void;
    _flush(): void;
    /**
     * Initializes attributes.
     * Do not call this method manually.
     * @param {WebGL2RenderingContext} context
     * @param {WebGLProgram | null} program
     * @param {Attribute[] | null} attributes
     * @private
     */
    _initAttributes(context: WebGL2RenderingContext, program: WebGLProgram, attributes?: Attribute[] | null): void;
    _enableAttributes(): void;
    _disableAttributes(): void;
    /**
     * Initializes the buffer.
     * Do not call this method manually.
     * @param {WebGL2RenderingContext} context
     * @param {WebGLProgram | null} program
     * @param {Attribute[] | null} attributes
     * @private
     */
    _init(context: WebGL2RenderingContext, program?: WebGLProgram | null, attributes?: Attribute[] | null): void;
    /**
     * Initializes the buffer.
     * Do not call this method manually.
     * @param {WebGL2RenderingContext} context
     * @param {WebGLProgram | null} program
     * @param {Attribute[] | null} attributes
     * @private
     */
    _initOnce(context: WebGL2RenderingContext, program?: WebGLProgram | null, attributes?: Attribute[] | null): void;
    /**
     * Creates and return `WebGLVertexArrayObject`.
     * You don't have to call this method manually.
     * @param {WebGL2RenderingContext} context
     * @param {WebGLProgram | null} program
     * @param {Attribute[] | null} attributes
     * @returns {WebGLVertexArrayObject}
     * @private
     */
    _createWebGLVertexArrayObject(context: WebGL2RenderingContext, program?: WebGLProgram | null, attributes?: Attribute[] | null): WebGLVertexArrayObject;
    /**
     * Returns data of the buffer.
     * @returns {TypedArrayLike | null}
     */
    readonly data: TypedArrayLike | null;
    /**
     * Returns data type of the buffer.
     * @returns {number}
     */
    readonly dataType: number;
    /**
     * Returns how many data set stored in the buffer.
     * @returns {number}
     */
    readonly dataCount: number;
    /**
     * Returns usage of the buffer.
     * @returns {number}
     */
    readonly usage: number;
    /**
     * Returns if the buffer is initialized.
     * @returns {boolean}
     */
    readonly isInitialized: boolean;
    /**
     * Returns total size of attributes.
     * @returns {number}
     */
    readonly totalAttributesSize: number;
    /**
     * Returns type of the buffer.
     * It can be `XenoGL..ARRAY_BUFFER` or `XenoGL..ELEMENT_ARRAY_BUFFER`.
     * @returns {number}
     */
    readonly bufferType: number;
    /**
     * Returns `WebGLBuffer` if the buffer is initialized.
     * Otherwise, throws an error.
     * @returns {WebGLBuffer}
     */
    readonly glBuffer: WebGLBuffer;
}
/**
 * ArrayBuffer.
 */
export declare class ArrayBuffer extends BufferBase {
    constructor(args?: {
        dataOrLength?: TypedArrayLike | number | null;
        attributes?: Attribute[];
        dataType?: number;
        usage?: number;
    });
}
/**
 * ElementArrayBuffer.
 */
export declare class ElementArrayBuffer extends BufferBase {
    constructor(args?: {
        dataOrLength?: TypedArrayLike | number | null;
        attributes?: Attribute[];
        dataType?: number;
        usage?: number;
    });
}
/**
 * UniformBuffer.
 */
export declare class UniformBuffer extends BufferBase {
    constructor(args?: {
        dataOrLength?: TypedArrayLike | number | null;
        dataType?: number;
        usage?: number;
    });
}
