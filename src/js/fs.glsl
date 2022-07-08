// #extension GL_OES_standard_derivatives : enable
// #extension GL_EXT_shader_texture_lod : enable
#ifdef GL_ES
precision highp float;
#endif


uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 viewMatrixInverse;
uniform mat4 projectionMatrix;
uniform mat4 projectionMatrixInverse;


uniform vec3      iResolution;
uniform float     iGlobalTime;
uniform float     iChannelTime[4];
uniform vec4      iMouse;
uniform vec4      iDate;
uniform float     iSampleRate;
uniform vec3      iChannelResolution[4];
uniform int       iFrame;
uniform float     iTimeDelta;
uniform float     iFrameRate;
struct Channel
{
    vec3  resolution;
    float time;
};
uniform Channel iChannel[4];
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;
void mainImage(out vec4 c, in vec2 f);

float iTime = iGlobalTime;


vec3 getColor(vec2 uv){

    vec2 screen11pos = (uv-0.5)*2.0;
    screen11pos.y*=-1.0;
    vec4 Hs = vec4(screen11pos, 0.5, 1);
    return Hs.xyz;
    Hs = projectionMatrixInverse * Hs;

    vec3 hs3 = normalize(Hs.xyz);
    vec4 hs4 = vec4(hs3, 0);

    vec4 dir = viewMatrixInverse * hs4;

    return dir.xyz;
}

void main(void){
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

    color.w = 1.0;

    vec2 uv = gl_FragCoord.xy/iResolution.xy;
    gl_FragColor = vec4(getColor(uv),1);
}