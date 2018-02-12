"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var TransformFeedback = /** @class */ (function () {
    function TransformFeedback() {
        this._glContext = null;
        this._glTransformFeedback = null;
    }
    TransformFeedback.prototype.feedback = function (args) {
        if (this._glContext === null) {
            throw new Error('This transform feedback is not added to any WebGL2 yet.');
        }
        for (var i = 0; i < args.targetBuffers.length; i++) {
            this._glContext.bindBufferBase(constants_1.TRANSFORM_FEEDBACK_BUFFER, i, args.targetBuffers[i].glBuffer);
        }
        this._glContext.beginTransformFeedback(args.mode);
        this._glContext.drawArrays(args.mode, 0, args.count);
        this._glContext.endTransformFeedback();
        for (var i = 0; i < args.targetBuffers.length; i++) {
            this._glContext.bindBufferBase(constants_1.TRANSFORM_FEEDBACK_BUFFER, i, null);
        }
    };
    TransformFeedback.prototype._init = function (context) {
        this._glContext = context;
        this._glTransformFeedback = context.createTransformFeedback();
        context.bindTransformFeedback(constants_1.TRANSFORM_FEEDBACK, this._glTransformFeedback);
    };
    return TransformFeedback;
}());
exports.TransformFeedback = TransformFeedback;
