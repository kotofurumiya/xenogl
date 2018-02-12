import { TRANSFORM_FEEDBACK, TRANSFORM_FEEDBACK_BUFFER } from './constants';
import { Buffer } from './buffer';

export class TransformFeedback {
  protected _index: number | null;
  protected _glContext: WebGL2RenderingContext | null;
  protected _glTransformFeedback: WebGLTransformFeedback | null;

  constructor() {
    this._index = null;
    this._glContext = null;
    this._glTransformFeedback = null;
  }

  feedback(args: {mode: number, targetBuffer: Buffer, count: number}) {
    if(this._glContext === null) {
      throw new Error('This transform feedback is not added to any WebGL2 yet.');
    }

    this._glContext.bindBufferBase(TRANSFORM_FEEDBACK_BUFFER, <number>this._index, args.targetBuffer.glBuffer);
    this._glContext.beginTransformFeedback(args.mode);
    this._glContext.drawArrays(args.mode, 0, args.count);
    this._glContext.endTransformFeedback();
    this._glContext.bindBufferBase(TRANSFORM_FEEDBACK_BUFFER, <number>this._index, null);
  }

  _init(context: WebGL2RenderingContext, index: number) {
    this._glContext = context;
    this._glTransformFeedback = context.createTransformFeedback();
    this._index = index;
    context.bindTransformFeedback(TRANSFORM_FEEDBACK, this._glTransformFeedback);
  }
}
