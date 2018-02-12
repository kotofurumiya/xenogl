/// <reference types="webgl2" />
import { Buffer, ElementArrayBuffer } from './buffer';
import { Uniform } from './variable';
import { VertexArrayObject } from './vertex_array_object';
import { UniformBufferObject } from './uniform_buffer_object';
export declare abstract class ShaderBase {
    protected _source: string;
    protected _glShader: WebGLShader | null;
    protected _isCompiled: boolean;
    protected _shaderType: number;
    constructor(source: string, shaderType: number);
    _compile(context: WebGL2RenderingContext): WebGLShader | null;
    /**
     * Returns if the shader is compiled.
     * @returns {boolean}
     */
    readonly isCompiled: boolean;
    /**
     * Returns `WebGLShader` when the shader is already compiled.
     * Otherwise throws an error.
     * @returns {WebGLShader}
     */
    readonly glShader: WebGLShader;
}
/**
 * A vertex shader.
 */
export declare class VertexShader extends ShaderBase {
    constructor(source: string);
}
/**
 * A fragment shader.
 */
export declare class FragmentShader extends ShaderBase {
    constructor(source: string);
}
/**
 * A shader program.
 */
export declare class Program {
    protected _vertexShader: VertexShader;
    protected _fragmentShader: FragmentShader;
    protected _feedbackVaryings: string[];
    protected _feedbackBufferMode: number;
    protected _isLinked: boolean;
    protected _glContext: WebGL2RenderingContext | null;
    protected _glProgram: WebGLProgram | null;
    protected _initializedBuffers: Buffer[];
    protected _uninitializedBuffers: Buffer[];
    protected _currentIndexBuffer: ElementArrayBuffer | null;
    protected _initializedUniforms: Uniform[];
    protected _uninitializedUniforms: Uniform[];
    protected _initializedVertexArrayObjects: VertexArrayObject[];
    protected _uninitializedVertexArrayObject: VertexArrayObject[];
    protected _currentVertexArrayObject: VertexArrayObject | null;
    protected _initializedUniformBufferObjects: UniformBufferObject[];
    protected _uninitializedUniformBufferObjects: UniformBufferObject[];
    id: number | null;
    constructor(args: {
        vertexShader: VertexShader;
        fragmentShader: FragmentShader;
        feedbackVaryings?: string[];
        feedbackBufferMode?: number;
    });
    /**
     * Adds a buffer to the program.
     * @param {Buffer} buffer
     */
    addBuffer(buffer: Buffer): void;
    /**
     * Activates the `ElementArrayBuffer` as a index buffer.
     * @param {ElementArrayBuffer} buffer
     */
    activateElementArrayBuffer(buffer: ElementArrayBuffer): void;
    /**
     * Adds an uniform variable to the program.
     * @param {Uniform} uniform
     */
    addUniform(uniform: Uniform): void;
    /**
     * Adds a `VertexArrayObject` to the program.
     * @param {VertexArrayObject} vao
     */
    addVertexArrayObject(vao: VertexArrayObject): void;
    /**
     * Activates the `VertexArrayObject`.
     * @param {VertexArrayObject} vao
     */
    activateVertexArrayObject(vao: VertexArrayObject): void;
    /**
     * Adds an `UniformBufferObject` to the program.
     * @param {UniformBufferObject} ubo
     */
    addUniformBufferObject(ubo: UniformBufferObject): void;
    /**
     * Issues a draw call, which draws graphics.
     * @param {number} mode
     * @param {number | null} count
     */
    draw(mode: number, count?: number | null): void;
    activate(): void;
    deactivate(): void;
    /**
     * Links the shader program.
     * This method is called internally. So you don't have to call this method manually.
     * @param {WebGL2RenderingContext} context
     */
    _link(context: WebGL2RenderingContext): void;
    /**
     * Returns if the program is linked.
     * @returns {boolean}
     */
    readonly isLinked: boolean;
    /**
     * Returns `WebGLProgram` when the program is already linked.
     * Otherwise throws an error.
     * @returns {WebGLProgram}
     */
    readonly glProgram: WebGLProgram;
}
