/// <reference types="webgl2" />
import { UniformBuffer } from './buffer';
import { TypedArrayLike } from './variable';
/**
 * An uniform buffer object.
 */
export declare class UniformBufferObject {
    protected _buffer: UniformBuffer;
    protected _blockName: string;
    protected _blockIndex: number | null;
    protected _javascriptIndex: number | null;
    protected _isInitialized: boolean;
    constructor(blockName: string, bufferOrBufferArgs?: UniformBuffer | {
        dataOrLength?: TypedArrayLike | number | null;
        dataType?: number;
        usage?: number;
    });
    /**
     * Initializes the uniform buffer object.
     * Do not call this method manually.
     * @param {WebGL2RenderingContext} context
     * @param {WebGLProgram} program
     * @param {number} jsIndex
     * @private
     */
    _init(context: WebGL2RenderingContext, program: WebGLProgram, jsIndex: number): void;
}
