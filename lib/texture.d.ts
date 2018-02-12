/// <reference types="webgl2" />
export declare type TextureSource = HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap | ImageData;
export interface Texture {
    activate(): void;
    _init(context: WebGL2RenderingContext, textureNumber: number): void;
}
export declare abstract class TextureBase implements Texture {
    abstract activate(): void;
    abstract _init(context: WebGL2RenderingContext, textureNumber: number): void;
    protected _getTextureIdFromNumber(n: number): number;
}
export declare class Texture2D extends TextureBase {
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
    constructor(dataSource: TextureSource | ArrayBufferView, options?: {
        target?: number;
        mipmapLevel?: number;
        internalFormat?: number;
        format?: number;
        dataType?: number;
        width?: number;
        height?: number;
    });
    activate(): void;
    _init(context: WebGL2RenderingContext, textureNumber: number): void;
    _flush(): void;
}
