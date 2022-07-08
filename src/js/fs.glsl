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

uniform sampler2D texture1;

void mainImage(out vec4 c, in vec2 f);

const float pi = 3.141592653589793238462643383279502884197169;

vec2 mapDirToUV(vec3 direction){
    vec2 longlat = vec2(atan(direction.z, direction.x), acos(-direction.y)) ;
    vec2 quv = longlat / vec2(2.0 * pi, pi);
    quv.x += 0.5;
    return quv;
}
float map(float x){
//    return x;
    return x + pow(x,3.0);
    //    if(len<0.5)
    //        return len;
    //    return  (len - 0.5)*3.0+0.5;
}


vec3 map(vec3 x){
//    x.z = 0.1;
    vec2 posInPlane =  normalize(x.xy) * map(length(x.xy));
    return normalize(vec3(posInPlane,x.z));
}

float angle(vec3 a,vec3 b){
   return acos(dot(a,b));
}

vec3 map2(vec3 x){
    vec3 dir = normalize(x);
//    return dir;

    // 角度 0 - 180> 0-pi/2
    float a = angle(dir,vec3(0,0,-1));
    a = map(a);

    float b = atan(x.y,x.x);


    vec3 c = vec3(sin(a)*cos(b),sin(a)*sin(b),-cos(a));
    return c;

}


vec3 mapScreenCoordToDir(vec2 screenUV){
    // (-1.1)
    vec2 screenpos = (screenUV-0.5)*2.0;
    vec4 posHS = vec4(screenpos, 1, 1);

    vec3 posVS = (projectionMatrixInverse * posHS).xyz;
    posVS.z = -1.0;

//    return posVS;
    posVS = map2(posVS);

//    posVS = normalize(posVS);

//    return posVS;

    vec4 dirWS = vec4(posVS.xyz, 0) * viewMatrixInverse;
    return normalize(dirWS.xyz);
}

vec3 getColor(vec2 uv){
    vec3 dir = mapScreenCoordToDir(uv);

//    return dir;
    vec2 quv = mapDirToUV(dir.xyz);
    return texture2D(texture1, quv).xyz;
}

void main(void){
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

    color.w = 1.0;

    vec2 uv = gl_FragCoord.xy/iResolution.xy;
    gl_FragColor = vec4(pow(getColor(uv), vec3(1.0)),1);
}