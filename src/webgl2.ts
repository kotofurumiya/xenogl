import { Program } from './shader_program';
import { COLOR_BUFFER_BIT } from './constants';
import { TransformFeedback } from './transform_feedback';
import { Texture } from './texture';

export class WebGL2 {
  protected _context: WebGL2RenderingContext;
  protected _programs: Array<Program | null>;
  protected _activeProgram: Program | null;
  protected _transformFeedbacks: Array<TransformFeedback | null>;
  protected _textures: Texture[];
  protected _activeTexture: Texture | null;

  constructor(canvas: HTMLCanvasElement) {
    this._context = <WebGL2RenderingContext>canvas.getContext('webgl2');
    this._programs = [];
    this._activeProgram = null;
    this._transformFeedbacks = [];
    this._textures = [];
    this._activeTexture = null;
  }

  /**
   * Adds the program to the `WebGL2` and returns ID number of the program.
   * If any program is activated yet, this method activates the program.
   * @param {Program} program
   * @returns {number} Program ID
   */
  addProgram(program: Program): number {
    if(!program.isLinked) {
      program._link(this._context);
    }

    this._programs.push(program);

    if(this._activeProgram === null) {
      this._activeProgram = program;
      this._context.useProgram(program.glProgram);
    }

    const id = this._programs.length - 1;
    program.id = id;

    return id;
  }

  /**
   * Adds the transform feedback to `WebGL2`.
   * @param {TransformFeedback} tf
   */
  addTransformFeedback(tf: TransformFeedback) {
    this._transformFeedbacks.push(tf);
    tf._init(this._context);
  }

  addTexture(texture: Texture) {
    const id = this._textures.length;
    this._textures.push(texture);
    texture._init(this._context, id);

    if(this._activeTexture === null) {
      texture.activate();
    }
  }

  /**
   * Activates a program and deactivates the previous program.
   * Throws an error when the program is not attached to WebGL2.
   * @param {Program} program
   */
  activateProgram(program: Program) {
    if(program.id === null) {
      throw new Error(`This program is not added to WebGL2 yet. Add it by using addProgram method.`);
    } else {
      this.activateProgramByID(program.id);
    }
  }

  /**
   * Activates a program by ID and deactivates the previous program.
   * Throws an error when the ID does not exist.
   * @param {number} id
   */
  activateProgramByID(id: number): void {
    if(id > this._programs.length) {
      throw new Error(`ID ${id} does not exist.`);
    }

    if(this._activeProgram !== null) {
      this._activeProgram.deactivate();
    }

    const program = <Program>this._programs[id];
    this._context.useProgram(program.glProgram);
    program.activate();

    this._activeProgram = program;
  }

  /**
   * Uses the program as a current program.
   * @param {Program} program
   */
  useProgram(program: Program) {
    if(program.id === null) {
      throw new Error(`This program is not added to WebGL2 yet. Add it by using addProgram method.`);
    } else {
      this.useProgramByID(program.id);
    }
  }

  /**
   * Uses the program as a current program.
   * @param {number} id
   */
  useProgramByID(id: number) {
    if(id > this._programs.length) {
      throw new Error(`ID ${id} does not exist.`);
    }

    const program = <Program>this._programs[id];
    this._context.useProgram(program.glProgram);

    this._activeProgram = program;
  }

  activateTexture(texture: Texture) {

  }

  /**
   * Deactivates the program.
   * @param {Program} program
   */
  deactivateProgram(program: Program): void {
    program.deactivate();
  }

  draw(mode: number, count: number | null = null): void {
    if(this._activeProgram !== null) {
      this._activeProgram.draw(mode, count);
    }
  }

  clear(mask: number = COLOR_BUFFER_BIT): void {
    this._context.clear(mask);
  }

  clearColor(r: number, g: number, b: number, a: number) {
    this._context.clearColor(r, b, g, a);
  }

  enable(cap: number): void {
    this._context.enable(cap);
  }

  disable(cap: number): void {
    this._context.disable(cap);
  }

  viewport(x: number, y: number, width: number, height: number): void {
    this._context.viewport(x, y, width, height);
  }
}
