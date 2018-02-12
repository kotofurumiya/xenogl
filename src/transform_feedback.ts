import { TRANSFORM_FEEDBACK, TRANSFORM_FEEDBACK_BUFFER } from './constants';
import { Buffer } from './buffer';

export class TransformFeedback {
  protected _glContext: WebGL2RenderingContext | null;
  protected _glTransformFeedback: WebGLTransformFeedback | null;

  constructor() {
    this._glContext = null;
    this._glTransformFeedback = null;
  }

  feedback(args: {mode: number, targetBuffers: Buffer[], count: number}) {
    if(this._glContext === null) {
      throw new Error('This transform feedback is not added to any WebGL2 yet.');
    }

    for(let i = 0; i < args.targetBuffers.length; i++) {
      this._glContext.bindBufferBase(TRANSFORM_FEEDBACK_BUFFER, i, args.targetBuffers[i].glBuffer);
    }

    this._glContext.beginTransformFeedback(args.mode);
    this._glContext.drawArrays(args.mode, 0, args.count);
    this._glContext.endTransformFeedback();

    for(let i = 0; i < args.targetBuffers.length; i++) {
      this._glContext.bindBufferBase(TRANSFORM_FEEDBACK_BUFFER, i, null);
    }
  }

  _init(context: WebGL2RenderingContext) {
    this._glContext = context;
    this._glTransformFeedback = context.createTransformFeedback();
    context.bindTransformFeedback(TRANSFORM_FEEDBACK, this._glTransformFeedback);
  }
}
