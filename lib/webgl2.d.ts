/// <reference types="webgl2" />
import { Program } from './shader_program';
import { TransformFeedback } from './transform_feedback';
import { Texture } from './texture';
export declare class WebGL2 {
    protected _context: WebGL2RenderingContext;
    protected _programs: Array<Program | null>;
    protected _activeProgram: Program | null;
    protected _transformFeedbacks: Array<TransformFeedback | null>;
    protected _textures: Texture[];
    protected _activeTexture: Texture | null;
    constructor(canvas: HTMLCanvasElement);
    /**
     * Adds the program to the `WebGL2` and returns ID number of the program.
     * If any program is activated yet, this method activates the program.
     * @param {Program} program
     * @returns {number} Program ID
     */
    addProgram(program: Program): number;
    /**
     * Adds the transform feedback to `WebGL2`.
     * @param {TransformFeedback} tf
     */
    addTransformFeedback(tf: TransformFeedback): void;
    addTexture(texture: Texture): void;
    /**
     * Activates a program and deactivates the previous program.
     * Throws an error when the program is not attached to WebGL2.
     * @param {Program} program
     */
    activateProgram(program: Program): void;
    /**
     * Activates a program by ID and deactivates the previous program.
     * Throws an error when the ID does not exist.
     * @param {number} id
     */
    activateProgramByID(id: number): void;
    /**
     * Uses the program as a current program.
     * @param {Program} program
     */
    useProgram(program: Program): void;
    /**
     * Uses the program as a current program.
     * @param {number} id
     */
    useProgramByID(id: number): void;
    activateTexture(texture: Texture): void;
    /**
     * Deactivates the program.
     * @param {Program} program
     */
    deactivateProgram(program: Program): void;
    draw(mode: number, count?: number | null): void;
    clear(mask?: number): void;
    clearColor(r: number, g: number, b: number, a: number): void;
    enable(cap: number): void;
    disable(cap: number): void;
}
