"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var TextureBase = /** @class */ (function () {
    function TextureBase() {
    }
    TextureBase.prototype._getTextureIdFromNumber = function (n) {
        return constants_1.TEXTURE0 + n;
    };
    return TextureBase;
}());
exports.TextureBase = TextureBase;
var Texture2D = /** @class */ (function (_super) {
    __extends(Texture2D, _super);
    function Texture2D(dataSource, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this._source = dataSource;
        _this._glContext = null;
        _this._glTexture = null;
        _this._textureID = null;
        _this._target = ('target' in options) ? options.target : constants_1.TEXTURE_2D;
        _this._mipmapLevel = ('mipmapLevel' in options) ? options.mipmapLevel : 0;
        _this._internalFormat = ('internalFormat' in options) ? options.internalFormat : constants_1.RGBA;
        _this._format = ('format' in options) ? options.mipmapLevel : constants_1.RGBA;
        _this._dataType = ('dataType' in options) ? options.mipmapLevel : constants_1.UNSIGNED_BYTE;
        _this._width = ('width' in options) ? options.width : undefined;
        _this._height = ('height' in options) ? options.height : undefined;
        _this._flushData = function () { };
        return _this;
    }
    Texture2D.prototype.activate = function () {
        var _this = this;
        this._flushData = function (context) {
            context.activeTexture(_this._textureID);
        };
    };
    Texture2D.prototype._init = function (context, textureNumber) {
        this._glContext = context;
        this._textureID = this._getTextureIdFromNumber(textureNumber);
        context.activeTexture(this._textureID);
        this._glTexture = context.createTexture();
        context.bindTexture(this._target, this._glTexture);
        if (typeof this._width === 'undefined' || typeof this._height === 'undefined') {
            context.texImage2D(this._target, this._mipmapLevel, this._internalFormat, this._format, this._dataType, this._source);
        }
        else {
            context.texImage2D(this._target, this._mipmapLevel, this._internalFormat, this._width, this._height, 0, this._format, this._dataType, this._source);
        }
        context.generateMipmap(this._target);
        this._flush();
    };
    Texture2D.prototype._flush = function () {
        if (this._glContext !== null) {
            this._flushData(this._glContext);
            this._flushData = function () { };
        }
    };
    return Texture2D;
}(TextureBase));
exports.Texture2D = Texture2D;
