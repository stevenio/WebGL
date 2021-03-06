/*
** Copyright (c) 2015 The Khronos Group Inc.
**
** Permission is hereby granted, free of charge, to any person obtaining a
** copy of this software and/or associated documentation files (the
** "Materials"), to deal in the Materials without restriction, including
** without limitation the rights to use, copy, modify, merge, publish,
** distribute, sublicense, and/or sell copies of the Materials, and to
** permit persons to whom the Materials are furnished to do so, subject to
** the following conditions:
**
** The above copyright notice and this permission notice shall be included
** in all copies or substantial portions of the Materials.
**
** THE MATERIALS ARE PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
** EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
** MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
** IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
** CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
** TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
** MATERIALS OR THE USE OR OTHER DEALINGS IN THE MATERIALS.
*/

// This test relies on the surrounding web page defining a variable
// "contextVersion" which indicates what version of WebGL it's running
// on -- 1 for WebGL 1.0, 2 for WebGL 2.0, etc.

"use strict";
description("This test ensures various WebGL functions fail when passed invalid OpenGL ES enums.");

debug("");
debug("Canvas.getContext");

var wtu = WebGLTestUtils;
var gl = wtu.create3DContext("canvas");
if (!gl) {
  testFailed("context does not exist");
} else {
  testPassed("context exists");

  debug("");
  debug("Checking gl enums.");

  var buffer = new ArrayBuffer(2);
  var buf = new Uint16Array(buffer);
  var tex = gl.createTexture();
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  wtu.glErrorShouldBe(gl, gl.NO_ERROR);

  var tests = [
    "gl.blendEquation(desktopGL['MIN'])",
    "gl.blendEquation(desktopGL['MAX'])",
    "gl.blendEquationSeparate(desktopGL['MIN'], gl.FUNC_ADD)",
    "gl.blendEquationSeparate(desktopGL['MAX'], gl.FUNC_ADD)",
    "gl.blendEquationSeparate(gl.FUNC_ADD, desktopGL['MIN'])",
    "gl.blendEquationSeparate(gl.FUNC_ADD, desktopGL['MAX'])",
    "gl.bufferData(gl.ARRAY_BUFFER, 3, desktopGL['STATIC_READ'])",
    "gl.disable(desktopGL['CLIP_PLANE0'])",
    "gl.disable(desktopGL['POINT_SPRITE'])",
    "gl.getBufferParameter(gl.ARRAY_BUFFER, desktopGL['PIXEL_PACK_BUFFER'])",
    "gl.hint(desktopGL['PERSPECTIVE_CORRECTION_HINT'], gl.FASTEST)",
    "gl.isEnabled(desktopGL['CLIP_PLANE0'])",
    "gl.isEnabled(desktopGL['POINT_SPRITE'])",
    "gl.pixelStorei(desktopGL['PACK_SWAP_BYTES'], 1)",
  ];

  if (contextVersion < 2) {
    tests = tests.concat([
      "gl.bindTexture(desktopGL['TEXTURE_2D_ARRAY'], tex)",
      "gl.bindTexture(desktopGL['TEXTURE_3D'], tex)",
    ]);
  } else {
    tests = tests.concat([
      "gl.bindTexture(desktopGL['TEXTURE_RECTANGLE_EXT'], tex)",
    ]);
  }

  for (var ii = 0; ii < tests.length; ++ii) {
    TestEval(tests[ii]);
    wtu.glErrorShouldBe(gl, gl.INVALID_ENUM, tests[ii] + " should return INVALID_ENUM.");
  }

  gl.bindTexture(gl.TEXTURE_2D, tex);
  wtu.glErrorShouldBe(gl, gl.NO_ERROR);

  tests = [
    "gl.getTexParameter(gl.TEXTURE_2D, desktopGL['GENERATE_MIPMAP'])",
    "gl.texParameteri(gl.TEXTURE_2D, desktopGL['GENERATE_MIPMAP'], 1)",
    "gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, desktopGL['CLAMP_TO_BORDER'])",
  ];

  if (contextVersion < 2) {
    tests = tests.concat([
      "gl.texParameteri(desktopGL['TEXTURE_2D_ARRAY'], gl.TEXTURE_MAG_FILTER, gl.NEAREST)",
      "gl.texParameteri(desktopGL['TEXTURE_3D'], gl.TEXTURE_MAG_FILTER, gl.NEAREST)",
    ]);
  } else {
    tests = tests.concat([
      "gl.texParameteri(desktopGL['TEXTURE_2D'], gl.TEXTURE_SWIZZLE_R, gl.RED)",
      "gl.texParameteri(desktopGL['TEXTURE_2D'], gl.TEXTURE_WRAP_R, desktopGL['CLAMP_TO_BORDER'])",
    ]);
  }

  for (var ii = 0; ii < tests.length; ++ii) {
    TestEval(tests[ii]);
    wtu.glErrorShouldBe(gl, gl.INVALID_ENUM, tests[ii] + " should return INVALID_ENUM.");
  }
}

debug("");
var successfullyParsed = true;
