# XenoGL

XenoGL is a lightweight and Object-Oriented wrapper for WebGL2.

## Unstable

XenoGL is under unstable yet. APIs may be going to change, which breaks your code. **Do not use XenoGL for production softwares**.

## Install without Node.js

Download the zip file from [Release page on GitHub](https://github.com/kotofurumiya/xenogl/releases) and unzip the file.

Copy **build/xenogl.min.js** to your directory and append below code to your HTML file:

```html
<script src="xenogl.min.js"></script>
<script>
  // Write your code here.
</script>
```

## Install with Node.js

Run the install command.

```
$ npm install xenogl --save
```

Then import xenogl in JavaScript file.

```javascript
const XenoGL = require('xenogl');
```

## Basic usage

First, create a WebGL2 context from a canvas.

```javascript
// create a canvas.
const canvas = document.body.createElement('canvas');
canvas.width = 500;
canvas.height = 500;
document.body.appendChild(canvas);

// create a context.
const xgl = new XenoGL.WebGL2(canvas);
```

Next, create two shaders and a program. And add the program to the context.

```javascript
// load source as you like.
const vertexShaderSource = await fetch('vertex_shader.glsl').then((res) => res.text());
const fragmentShaderSource = await fetch('fragment_shader.glsl').then((res) => res.text());

// create shaders.
const vertexShader = new XenoGL.VertexShader(vertexShaderSource);
const fragmentShader = new XenoGL.FragmentShader(fragmentShaderSource);

// create a program.
const program = new XenoGL.Program({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
});

// add the program to the context.
xgl.addProgram(program);
```

You need data to draw. For example, vertex positions and colors.

```javascript
const vertices = new Float32Array([
  -0.5, 0.5,  0.0,
  -0.5, -0.5, 0.0,
  0.5,  0.5,  0.0,
  -0.5, -0.5, 0.0,
  0.5,  -0.5, 0.0,
  0.5,  0.5,  0.0
]);

const colors = new Float32Array([
  1.0, 0.0, 0.0, 1.0,
  0.0, 1.0, 0.0, 1.0,
  0.0, 0.0, 1.0, 1.0,
  0.0, 1.0, 0.0, 1.0,
  0.0, 0.0, 0.0, 1.0,
  0.0, 0.0, 1.0, 1.0
]);
```

Then, create a buffer from data.

```javascript
// create attributes which is defined in shaders.
const positionAttribute = new XenoGL.Attribute('vertexPosition', 3);
const colorAttribute = new XenoGL.Attribute('color', 4);

// create buffers with data and attributes.
const positionBuffer = new XenoGL.ArrayBuffer({
  dataOrLength: vertices,
  attributes: [positionAttribute],
  dataType: XenoGL.FLOAT
});

const colorBuffer = new XenoGL.ArrayBuffer({
  dataOrLength: colors,
  attributes: [colorAttribute],
  dataType: XenoGL.FLOAT
});

// add buffers to the program.
program.addBuffer(positionBuffer);
program.addBuffer(colorBuffer);
```

Finally, draw it!

```javascript
xgl.draw(XenoGL.TRIANGLES);
```

That's all.

## Program

You can use multiple programs.

To switch programs, use `activateProgram`.

```javascript
xgl.addProgram(updaterProgram);
xgl.addProgram(rendererProgram);

xgl.activateProgram(rendererProgram);
```

`activateProgram` is a very heavy operation. If you switch programs every frames, it causes performance issues. Because it toggles every attributes on buffers.

If you want just change the program without toggling attributes, use `useProgram` instead.

But if you don't have knowledge about OpenGL/WebGL, you should use `activateProgram`.

## Buffer

You can send data to buffers.

```javascript
const positionBuffer = new XenoGL.ArrayBuffer({
  attributes: [positionAttribute],
  dataType: XenoGL.FLOAT
});

program.addBuffer(positionBuffer);

positionBuffer.bufferData(new Float32Array([1.0, 1.0, 1.0]));
```

## Interleaved buffer

To make a buffer interleaved, pass an array of attributes to constructor of ArrayBuffer.

```javascript
const vertices = new Float32Array([
  -30.0, 30.0, 0.0,   // position
  0.0, 1.0, 0.0, 1.0, // color
  -30.0, -30.0, 0.0,
  1.0, 0.0, 0.0, 1.0,
  30.0, 30.0, 0.0,
  1.0, 0.0, 0.0, 1.0,
  30.0, -30.0, 0.0,
  0.0, 0.0, 1.0, 1.0
]);

const positionAttribute = new XenoGL.Attribute('vertexPosition', 3);
const colorAttribute = new XenoGL.Attribute('color', 4);

const buffer = new XenoGL.ArrayBuffer({
  dataOrLength: vertices,
  attributes: [positionAttribute, colorAttribute],
  dataType: XenoGL.FLOAT,
  usage: XenoGL.DYNAMIC_DRAW
});
```

XenoGL detect stride and offset automatically and make the buffer interleaved.

## Index buffer

You can create a index buffer by using `XenoGL.ElementArrayBuffer` object.

```javascript
const indices = new Uint16Array([0, 1, 2, 1, 3, 2]);

const indexBuffer = new XenoGL.ElementArrayBuffer({
  dataOrLength: indices,
  dataType: XenoGL.UNSIGNED_SHORT,
  usage: XenoGL.DYNAMIC_DRAW
});

program.addBuffer(indexBuffer);
```

An ElementArrayBuffer object is treated as an index buffer when it is added to the program.

When you add multiple ElementArrayBuffer to the program, latest one is used as an index buffer.

If you need to choose an index buffer manually, use `program.activateElemntArrayBuffer()`.

```javascript
program.activateElementArrayBuffer(firstBuffer);
```

## Other buffers

Not supported yet. Stay tuned.

## Uniform variables

To create uniform variables, use `XenoGL.Uniform` and add it to the program.

```javascript
const modelUniform = new XenoGL.Uniform('model');
const viewUniform = new XenoGL.Uniform('view');
const projectionUniform = new XenoGL.Uniform('projection');

modelUniform.setMatrix(model);
projectionUniform.setMatrix(projection);

program.addUniform(modelUniform);
program.addUniform(viewUniform);
program.addUniform(projectionUniform);
```

`XenoGL.Uniform` object has `setValue(value, type)`, `setVector(vector, type)` and `setMatrix(matrix)` to apply a value. `type` can be XenoGL.FLOAT, XenoGL.UNSIGNED_SHORT and other data types.

Don't forget to add an uniform to the program.

## Vertex Array Objects

XenoGL supports Vertex Array Object(VAO).

```javascript
const buffer = new XenoGL.ArrayBuffer({
  dataOrLength: particleInitialDataF32,
  attributes: [positionAttr, velocityAttr, ageAttr, lifeAttr],
  dataType: XenoGL.FLOAT,
  usage: XenoGL.DYNAMIC_COPY
});

// 2nd arg is optional.
const vao = new XenoGL.VertexArrayObject(buffer, { 
  dataOrLength: particleInitialDataF32, // initial data
  attributes: [positionAttr, velocityAttr] // attributes to enable
});

// add it to the program.
program.addVertexArrayObject(vao);
```

If you activate another VAO, use `program.activateVertexArrayObject`.

```javascript
program.activateVertexArrayObject(vao);
```

## Uniform Buffer Object

Uniform Buffer Objects(UBO) make you able to share values between programs.

```javascript
// create a buffer.
const sharedUniformBuffer = new XenoGL.UniformBuffer({
  dataOrLength: new Float32Array([1.0, 0.0, 0.0, 1.0]),
  dataType: XenoGL.FLOAT
});

// create ubos.
const ubo1 = new XenoGL.UniformBufferObject('param', sharedUniformBuffer);
const ubo2 = new XenoGL.UniformBufferObject('param', sharedUniformBuffer);

// add to programs.
program1.addUniformBufferObject(ubo1);
program2.addUniformBufferObject(ubo2);
```

## Transform Feedback

To use transform feedbacks, first, create a program with additional options.

```javascript
const program = new XenoGL.Program({
  vertexShader: vs,
  fragmentShader: fs,
  feedbackVaryings: ['vertexPosition', 'vertexVelocity', 'vertexAge', 'vertexLife'], // variables to feedback.
  feedbackBufferMode: XenoGL.INTERLEAVED_ATTRIBS // XenoGL.SEPARATE_ATTRIB or XenoGL.INTERLEAVED_ATTRIBS
});
```

Then, create a `TransformFeedback` object and add it to the context(**not to the program**).

```javascript
const tf = new XenoGL.TransformFeedback();
xgl.addTransformFeedback(tf);
```

`feedback` method executes a calc and feedback.

```javascript
tf.feedback({
  mode: XenoGL.POINTS,
  targetBuffers: [buffer], // buffers to feedback.
  count: 100 // how many calc.
});
```

## Textures

Using textures, create a `Texture2D` object and add it to the context.

```javascript
const textureSource = await fetch('texture-300x300.png').then((res) => res.blob())
                                                        .then((blob) => createImageBitmap(blob));
const texture = new XenoGL.Texture2D(textureSource);
xgl.addTexture(texture);
```

Source of texture can be img, canvas, video, ImageBitmap, ImageData or ArrayBufferView.

You can crete textures with options.

```javascript
const texture = new XenoGL.Texture2D(textureSource, {
    target: XenoGL.TEXTURE_2D,
    mipmapLevel: 0,
    internalFormat: XenoGL.RGBA,
    format: XenoGL.RGBA,
    dataType: XenoGL.UNSIGNED_BYTE,
    width: 500,
    height: 500
});
```

To use another texture, use `xgl.activateTexture(texture)`.

```javascript
xgl.activateTexture(texture2);
```


## Misc.

```javascript
xgl.clearColor(0.0, 0.0, 0.0, 1.0);
xgl.clear(XenoGL.COLOR_BUFFER_BIT | XenoGL.DEPTH_BUFFER_BIT);
xgl.enable(XenoGL.RASTERIZER_DISCARD);
xgl.disable(XenoGL.RASTERIZER_DISCARD);
```

## API Document

For more information, see [API Document](https://kotofurumiya.github.io/xenogl/).