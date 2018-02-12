import { Attribute, TypedArrayLike } from './variable';
import { STATIC_DRAW, FLOAT, UNSIGNED_SHORT, ARRAY_BUFFER, ELEMENT_ARRAY_BUFFER, UNIFORM_BUFFER } from './constants';
import { getBytesPerElementByGlType } from './utils';

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
  _createWebGLVertexArrayObject(context: WebGL2RenderingContext, program?: WebGLProgram | null,
                                attributes?: Attribute[] | null): WebGLVertexArrayObject;
}

export abstract class BufferBase implements Buffer {
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
      dataOrLength?: TypedArrayLike | number | null,
      attributes?: Attribute[],
      dataType?: number,
      usage?: number
  } = {dataOrLength: null, attributes: [], dataType: FLOAT, usage: STATIC_DRAW}, bufferType: number) {
    this._glContext = null;
    this._glProgram = null;
    this._glBuffer = null;

    this._dataOrLength = ('dataOrLength' in args) ? <TypedArrayLike | number | null>args.dataOrLength : null;
    this._attributes = ('attributes' in args) ? <Attribute[]>args.attributes : [];
    this._enabledAttributes = this._attributes;
    this._attributeToLocation = new Map();
    this._dataType = ('dataType' in args) ? <number>args.dataType : FLOAT;
    this._usage = ('usage' in args) ? <number>args.usage : STATIC_DRAW;
    this._bufferType = bufferType;

    this._isInitialized = false;

    this._flushData = (context: WebGL2RenderingContext, buffer: WebGLBuffer) => {};

    this._totalAttributesSize = this._attributes.reduce((prev, attr) => prev + attr.size, 0);

    if(this._dataOrLength === null) {
      this._data = null;
    } else if(typeof this._dataOrLength === 'number') {
      this._data = null;
      this._flushData = (context: WebGL2RenderingContext, buffer: WebGLBuffer) => {
        context.bindBuffer(this._bufferType, buffer);
        context.bufferData(this._bufferType, <number>this._dataOrLength, this._usage);
        context.bindBuffer(this._bufferType, null);
      }
    } else {
      this._data = this._dataOrLength;
      this._flushData = (context: WebGL2RenderingContext, buffer: WebGLBuffer) => {
        context.bindBuffer(this._bufferType, buffer);
        context.bufferData(this._bufferType, <TypedArrayLike>this._dataOrLength, this._usage);
        context.bindBuffer(this._bufferType, null);
      }
    }
  }

  /**
   * Send data to the buffer.
   * @param {TypedArrayLike | number} dataOrLength
   */
  bufferData(dataOrLength: TypedArrayLike | number) {
    this._flushData = (context: WebGL2RenderingContext, buffer: WebGLBuffer) => {
      this._dataOrLength = dataOrLength;
      context.bindBuffer(this._bufferType, buffer);

      if(typeof dataOrLength === 'number') {
        context.bufferData(this._bufferType, dataOrLength, this._usage);
      } else {
        context.bufferData(this._bufferType, dataOrLength, this._usage);
        this._data = dataOrLength;
      }

      context.bindBuffer(this._bufferType, null);
    };

    this._flush();
  }

  activate(): void {
    this._enableAttributes();
  }

  deactivate(): void {
    this._disableAttributes();
  }

  _flush(): void {
    if(this._glContext !== null && this._glBuffer !== null) {
      this._flushData(this._glContext, this._glBuffer);
    }
  }

  /**
   * Initializes attributes.
   * Do not call this method manually.
   * @param {WebGL2RenderingContext} context
   * @param {WebGLProgram | null} program
   * @param {Attribute[] | null} attributes
   * @private
   */
  _initAttributes(context: WebGL2RenderingContext, program: WebGLProgram, attributes: Attribute[] | null = null): void {
    this._enabledAttributes = this._attributes;
    if(attributes !== null) {
      this._enabledAttributes = attributes;
    }

    this._attributes.forEach((attr) => {
      const location = context.getAttribLocation(program, attr.name);
      this._attributeToLocation.set(attr, location);
    });

    const bytesPerElement = <number>getBytesPerElementByGlType(this._dataType);
    const strideBytes = bytesPerElement * this._totalAttributesSize;
    let offsetBytes = 0;

    for(let i = 0; i < this._attributes.length; i++) {
      const attr = this._attributes[i];
      const location = <number>this._attributeToLocation.get(attr);
      if(this._enabledAttributes.find((e) => e.equals(attr))) {
        context.enableVertexAttribArray(location);
        context.vertexAttribPointer(
          location,
          attr.size,
          this._dataType,
          false,
          strideBytes,
          offsetBytes
        );
      }

      offsetBytes += attr.size * bytesPerElement;
    }
  }

  _enableAttributes(): void {
    if(this._glContext !== null) {
      const context = <WebGL2RenderingContext>this._glContext;
      const program = <WebGLProgram>this._glProgram;

      context.bindBuffer(this.bufferType, this._glBuffer);
      this._initAttributes(context, program, this._enabledAttributes);
      context.bindBuffer(this.bufferType, null);
    }
  }

  _disableAttributes(): void {
    if(this._glContext !== null) {
      const context = <WebGL2RenderingContext>this._glContext;

      this._enabledAttributes.forEach((attr) => {
        const location = <number>this._attributeToLocation.get(attr);
        context.disableVertexAttribArray(location);
      });
    }
  }

  /**
   * Initializes the buffer.
   * Do not call this method manually.
   * @param {WebGL2RenderingContext} context
   * @param {WebGLProgram | null} program
   * @param {Attribute[] | null} attributes
   * @private
   */
  _init(context: WebGL2RenderingContext,
        program: WebGLProgram | null = null,
        attributes: Attribute[] | null = null): void {
    const buffer = context.createBuffer();
    context.bindBuffer(this._bufferType, buffer);

    if(program !== null) {
      this._initAttributes(context, program, attributes);
    }

    this._glContext = context;
    this._glProgram = program;
    this._glBuffer = buffer;

    this._flush();

    // unbind
    context.bindBuffer(this._bufferType, null);

    this._isInitialized = true;
  }

  /**
   * Initializes the buffer.
   * Do not call this method manually.
   * @param {WebGL2RenderingContext} context
   * @param {WebGLProgram | null} program
   * @param {Attribute[] | null} attributes
   * @private
   */
  _initOnce(context: WebGL2RenderingContext,
            program: WebGLProgram | null = null,
            attributes: Attribute[] | null = null): void {
    if(!this.isInitialized) {
      this._init(context, program, attributes);
    }
  }

  /**
   * Creates and return `WebGLVertexArrayObject`.
   * You don't have to call this method manually.
   * @param {WebGL2RenderingContext} context
   * @param {WebGLProgram | null} program
   * @param {Attribute[] | null} attributes
   * @returns {WebGLVertexArrayObject}
   * @private
   */
  _createWebGLVertexArrayObject(context: WebGL2RenderingContext, program: WebGLProgram | null = null,
                                       attributes: Attribute[] | null = null): WebGLVertexArrayObject {
    const buffer = this._glBuffer;
    const vao = <WebGLVertexArrayObject>context.createVertexArray();
    context.bindVertexArray(vao);
    context.bindBuffer(this._bufferType, buffer);

    if(program !== null) {
      this._initAttributes(context, program, attributes);
    }

    if (this._dataOrLength !== null && typeof this._dataOrLength === 'number') {
      context.bufferData(this._bufferType, this._dataOrLength, this._usage);
    } else if (this._dataOrLength !== null) {
      context.bufferData(this._bufferType, this._dataOrLength, this._usage);
    }

    context.bindBuffer(this._bufferType, null);
    context.bindVertexArray(null);

    return vao;
  }

  /**
   * Returns data of the buffer.
   * @returns {TypedArrayLike | null}
   */
  get data(): TypedArrayLike | null {
    return this._data;
  }

  /**
   * Returns data type of the buffer.
   * @returns {number}
   */
  get dataType(): number {
    return this._dataType;
  }

  /**
   * Returns how many data set stored in the buffer.
   * @returns {number}
   */
  get dataCount(): number {
    if(this.data !== null) {
      return this.data.length / this._totalAttributesSize;
    } else {
      return 0;
    }
  }

  /**
   * Returns usage of the buffer.
   * @returns {number}
   */
  get usage(): number {
    return this._usage;
  }

  /**
   * Returns if the buffer is initialized.
   * @returns {boolean}
   */
  get isInitialized(): boolean {
    return this._isInitialized;
  }

  /**
   * Returns total size of attributes.
   * @returns {number}
   */
  get totalAttributesSize(): number {
    return this._totalAttributesSize;
  }

  /**
   * Returns type of the buffer.
   * It can be `XenoGL..ARRAY_BUFFER` or `XenoGL..ELEMENT_ARRAY_BUFFER`.
   * @returns {number}
   */
  get bufferType(): number {
    return this._bufferType;
  }

  /**
   * Returns `WebGLBuffer` if the buffer is initialized.
   * Otherwise, throws an error.
   * @returns {WebGLBuffer}
   */
  get glBuffer(): WebGLBuffer {
    if(this.isInitialized) {
      return <WebGLBuffer>this._glBuffer;
    } else {
      throw new Error('This buffer is not initialized yet.');
    }
  }
}

/**
 * ArrayBuffer.
 */
export class ArrayBuffer extends BufferBase {
  constructor(args: {
    dataOrLength?: TypedArrayLike | number | null,
    attributes?: Attribute[],
    dataType?: number,
    usage?: number
  } = {dataOrLength: null, attributes: [], dataType: FLOAT, usage: STATIC_DRAW}) {
    super(args, ARRAY_BUFFER);
  }
}

/**
 * ElementArrayBuffer.
 */
export class ElementArrayBuffer extends BufferBase {
  constructor(args: {
    dataOrLength?: TypedArrayLike | number | null,
    attributes?: Attribute[],
    dataType?: number,
    usage?: number
  } = {dataOrLength: null, attributes: [], dataType: UNSIGNED_SHORT, usage: STATIC_DRAW}) {
    super(args, ELEMENT_ARRAY_BUFFER);
  }
}

/**
 * UniformBuffer.
 */
export class UniformBuffer extends BufferBase {
  constructor(args: {
    dataOrLength?: TypedArrayLike | number | null,
    dataType?: number,
    usage?: number
  } = {dataOrLength: null, dataType: UNSIGNED_SHORT, usage: STATIC_DRAW}) {
    super(args, UNIFORM_BUFFER);
  }
}