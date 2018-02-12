"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var TransformFeedback = /** @class */ (function () {
    function TransformFeedback() {
        this._index = null;
        this._glContext = null;
        this._glTransformFeedback = null;
    }
    TransformFeedback.prototype.feedback = function (args) {
        if (this._glContext === null) {
            throw new Error('This transform feedback is not added to any WebGL2 yet.');
        }
        this._glContext.bindBufferBase(constants_1.TRANSFORM_FEEDBACK_BUFFER, this._index, args.targetBuffer.glBuffer);
        this._glContext.beginTransformFeedback(args.mode);
        this._glContext.drawArrays(args.mode, 0, args.count);
        this._glContext.endTransformFeedback();
        this._glContext.bindBufferBase(constants_1.TRANSFORM_FEEDBACK_BUFFER, this._index, null);
    };
    TransformFeedback.prototype._init = function (context, index) {
        this._glContext = context;
        this._glTransformFeedback = context.createTransformFeedback();
        this._index = index;
        context.bindTransformFeedback(constants_1.TRANSFORM_FEEDBACK, this._glTransformFeedback);
    };
    return TransformFeedback;
}());
exports.TransformFeedback = TransformFeedback;
