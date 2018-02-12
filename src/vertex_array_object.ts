import { Attribute, TypedArrayLike } from './variable';
import { Buffer } from './buffer';
import { ARRAY_BUFFER, STATIC_DRAW } from './constants';
import { getBytesPerElementByGlType } from './utils';

export class VertexArrayObject {
  protected _buffer: Buffer;
  protected _glContext: WebGL2RenderingContext | null;
  protected _glVertexArrayObject: WebGLVertexArrayObject | null;
  protected _enabledAttributes: Attribute[] | null;

  protected _mustWriteData: boolean;
  protected _dataOrLength?: TypedArrayLike | number;

  protected _isInitialized: boolean;

  constructor(buffer: Buffer, options: {
    dataOrLength?: TypedArrayLike | number,
    attributes?: Attribute[]
  } = {}) {
    this._buffer = buffer;
    this._glContext = null;
    this._glVertexArrayObject = null;
    this._enabledAttributes = ('attributes' in options) ? <Attribute[] | null>options.attributes : null;
    this._mustWriteData = 'dataOrLength' in options;

    if(this._mustWriteData) {
      this._dataOrLength = options.dataOrLength;
    }

    this._isInitialized = false;
  }

  /**
   * Initializes the vertex array object.
   * Do not call this method manually.
   * @param {WebGL2RenderingContext} context
   * @param {WebGLProgram} program
   * @private
   */
  _init(context: WebGL2RenderingContext, program: WebGLProgram) {
    if(this._mustWriteData) {
      this._buffer.bufferData(<TypedArrayLike>this._dataOrLength);
    }

    this._buffer._initOnce(context, program, this._enabledAttributes);

    const vao = this._buffer._createWebGLVertexArrayObject(context, program, this._enabledAttributes);

    this._glContext = context;
    this._glVertexArrayObject = vao;

    this._isInitialized = true;
  }

  /**
   * Returns buffer bound to the vertex array object.
   * @returns {Buffer}
   */
  get buffer(): Buffer {
    return this._buffer;
  }

  /**
   * Returns `WebGLVertexArrayObject` if the vertex array object is initialized.
   * Otherwise, throws an error.
   * @returns {WebGLVertexArrayObject}
   */
  get glVertexArrayObject(): WebGLVertexArrayObject {
    if(this._isInitialized) {
      return <WebGLVertexArrayObject>this._glVertexArrayObject;
    } else {
      throw new Error('This vertex array object is not added to any program yet.');
    }
  }
}