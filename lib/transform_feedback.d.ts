/// <reference types="webgl2" />
import { Buffer } from './buffer';
export declare class TransformFeedback {
    protected _index: number | null;
    protected _glContext: WebGL2RenderingContext | null;
    protected _glTransformFeedback: WebGLTransformFeedback | null;
    constructor();
    feedback(args: {
        mode: number;
        targetBuffer: Buffer;
        count: number;
    }): void;
    _init(context: WebGL2RenderingContext, index: number): void;
}
