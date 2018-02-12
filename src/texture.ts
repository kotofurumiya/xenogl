import { TEXTURE_2D, RGBA, UNSIGNED_BYTE, TEXTURE0 } from './constants';

export type TextureSource = HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap | ImageData;

export interface Texture {
  activate(): void;
  _init(context: WebGL2RenderingContext, textureNumber: number): void;
}

export abstract class TextureBase implements Texture {
  abstract activate(): void;
  abstract _init(context: WebGL2RenderingContext, textureNumber: number): void;

  protected _getTextureIdFromNumber(n: number) {
    return TEXTURE0 + n;
  }
}

export class Texture2D extends TextureBase {
  protected _source: TextureSource | ArrayBufferView;
  protected _glContext: WebGL2RenderingContext | null;
  protected _glTexture: WebGLTexture | null;
  protected _textureID: number | null;

  protected _target: number;
  protected _mipmapLevel: number;
  protected _internalFormat: number;
  protected _format: number;
  protected _dataType: number;
  protected _width?: number;
  protected _height?: number;

  protected _flushData: Function;

  constructor(dataSource: TextureSource | ArrayBufferView, options: {
    target?: number,
    mipmapLevel?: number,
    internalFormat?: number,
    format?: number,
    dataType?: number,
    width?: number,
    height?: number
  } = {}) {
    super();
    this._source = dataSource;
    this._glContext = null;
    this._glTexture = null;
    this._textureID = null;

    this._target = ('target' in options) ? <number>options.target : TEXTURE_2D;
    this._mipmapLevel = ('mipmapLevel' in options) ? <number>options.mipmapLevel : 0;
    this._internalFormat = ('internalFormat' in options) ? <number>options.internalFormat : RGBA;
    this._format = ('format' in options) ? <number>options.mipmapLevel : RGBA;
    this._dataType = ('dataType' in options) ? <number>options.mipmapLevel : UNSIGNED_BYTE;

    this._width = ('width' in options) ? <number>options.width : undefined;
    this._height = ('height' in options) ? <number>options.height : undefined;

    this._flushData = () => {};
  }

  activate(): void {
    this._flushData = (context: WebGL2RenderingContext) => {
      context.activeTexture(<number>this._textureID);
    };
  }

  _init(context: WebGL2RenderingContext, textureNumber: number): void {
    this._glContext = context;
    this._textureID = this._getTextureIdFromNumber(textureNumber);
    context.activeTexture(this._textureID);

    this._glTexture = context.createTexture();
    context.bindTexture(this._target, this._glTexture);

    if(typeof this._width === 'undefined' || typeof this._height === 'undefined') {
      context.texImage2D(this._target, this._mipmapLevel, this._internalFormat,
                         this._format, this._dataType, <TextureSource>this._source);
    } else {
      context.texImage2D(this._target, this._mipmapLevel, this._internalFormat,
                         this._width, this._height, 0, this._format,
                         this._dataType, <any>this._source);
    }

    context.generateMipmap(this._target);

    this._flush();
  }

  _flush() {
    if(this._glContext !== null) {
      this._flushData(this._glContext);
      this._flushData = () => {};
    }
  }
}