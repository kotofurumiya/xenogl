/// <reference types="webgl2" />
import { Buffer } from './buffer';
export declare class TransformFeedback {
    protected _glContext: WebGL2RenderingContext | null;
    protected _glTransformFeedback: WebGLTransformFeedback | null;
    constructor();
    feedback(args: {
        mode: number;
        targetBuffers: Buffer[];
        count: number;
    }): void;
    _init(context: WebGL2RenderingContext): void;
}
