/// <reference types="webgl2" />
import { Attribute, TypedArrayLike } from './variable';
import { Buffer } from './buffer';
export declare class VertexArrayObject {
    protected _buffer: Buffer;
    protected _glContext: WebGL2RenderingContext | null;
    protected _glVertexArrayObject: WebGLVertexArrayObject | null;
    protected _enabledAttributes: Attribute[] | null;
    protected _mustWriteData: boolean;
    protected _dataOrLength?: TypedArrayLike | number;
    protected _isInitialized: boolean;
    constructor(buffer: Buffer, options?: {
        dataOrLength?: TypedArrayLike | number;
        attributes?: Attribute[];
    });
    /**
     * Initializes the vertex array object.
     * Do not call this method manually.
     * @param {WebGL2RenderingContext} context
     * @param {WebGLProgram} program
     * @private
     */
    _init(context: WebGL2RenderingContext, program: WebGLProgram): void;
    /**
     * Returns buffer bound to the vertex array object.
     * @returns {Buffer}
     */
    readonly buffer: Buffer;
    /**
     * Returns `WebGLVertexArrayObject` if the vertex array object is initialized.
     * Otherwise, throws an error.
     * @returns {WebGLVertexArrayObject}
     */
    readonly glVertexArrayObject: WebGLVertexArrayObject;
}
