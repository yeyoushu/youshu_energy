import{V as w,s as l}from"./test-Dp3_P59c.js";import{a as c}from"./BindType-BBwFZqyN.js";const f=()=>w.getLogger("esri.views.3d.webgl-engine.core.shaderModules.shaderBuilder");class S{constructor(){this._includedModules=new Map}include(e,n){this._includedModules.has(e)?this._includedModules.get(e):(this._includedModules.set(e,n),e(this.builder,n))}}class k extends S{constructor(){super(...arguments),this.vertex=new b,this.fragment=new b,this.attributes=new E,this.varyings=new F,this.extensions=new p,this.outputs=new g}get fragmentUniforms(){return this.fragment.uniforms.entries}get builder(){return this}generate(e,n=!1){const t=this.extensions.generateSource(e),i=this.attributes.generateSource(e),a=this.varyings.generateSource(e),s=e==="vertex"?this.vertex:this.fragment,u=s.uniforms.generateSource(),d=s.code.generateSource(),$=s.main.generateSource(n),_=e==="vertex"?D:x,T=s.constants.generateSource(),v=this.outputs.generateSource(e);return`#version 300 es
${t.join(`
`)}
${_}
${T.join(`
`)}
${u.join(`
`)}
${i.join(`
`)}
${a.join(`
`)}
${v.join(`
`)}
${d.join(`
`)}
${$.join(`
`)}`}generateBind(e){const n=new Map;this.vertex.uniforms.entries.forEach((a=>{const s=a.bind[c.Bind];s&&n.set(a.name,s)})),this.fragment.uniforms.entries.forEach((a=>{const s=a.bind[c.Bind];s&&n.set(a.name,s)}));const t=Array.from(n.values()),i=t.length;return a=>{for(let s=0;s<i;++s)t[s](e,a)}}generateBindPass(e){const n=new Map;this.vertex.uniforms.entries.forEach((a=>{const s=a.bind[c.Pass];s&&n.set(a.name,s)})),this.fragment.uniforms.entries.forEach((a=>{const s=a.bind[c.Pass];s&&n.set(a.name,s)}));const t=Array.from(n.values()),i=t.length;return(a,s)=>{for(let u=0;u<i;++u)t[u](e,a,s)}}generateBindDraw(e){const n=new Map;this.vertex.uniforms.entries.forEach((a=>{const s=a.bind[c.Draw];s&&n.set(a.name,s)})),this.fragment.uniforms.entries.forEach((a=>{const s=a.bind[c.Draw];s&&n.set(a.name,s)}));const t=Array.from(n.values()),i=t.length;return(a,s,u)=>{for(let d=0;d<i;++d)t[d](e,u,a,s)}}}class y{constructor(e){this._stage=e,this._entries=new Map}add(...e){for(const n of e)this._add(n);return this._stage}get(e){return this._entries.get(e)}_add(e){if(e!=null){if(this._entries.has(e.name)&&!this._entries.get(e.name).equals(e))throw new l("shaderbuilder:duplicate-uniform",`Duplicate uniform name ${e.name} for different uniform type`);this._entries.set(e.name,e)}else f().error(`Trying to add null Uniform from ${new Error().stack}.`)}generateSource(){return Array.from(this._entries.values()).map((({name:e,arraySize:n,type:t})=>n!=null?`uniform ${t} ${e}[${n}];`:`uniform ${t} ${e};`))}get entries(){return Array.from(this._entries.values())}}class I{constructor(e){this._stage=e,this._bodies=new Array}add(e){return this._bodies.push(e),this._stage}generateSource(e){if(this._bodies.length>0)return[`void main() {
 ${this._bodies.join(`
`)||""} 
}`];if(e)throw new l("shaderbuilder:missing-main","Shader does not contain main function body.");return[]}}class A{constructor(e){this._stage=e,this._entries=new Array}add(e){return this._entries.push(e),this._stage}generateSource(){return this._entries}}class b extends S{constructor(){super(...arguments),this.uniforms=new y(this),this.main=new I(this),this.code=new A(this),this.constants=new r(this)}get builder(){return this}}class E{constructor(){this._entries=new Array}add(e,n){this._entries.push([e,n])}generateSource(e){return e==="fragment"?[]:this._entries.map((n=>`in ${n[1]} ${n[0]};`))}}class F{constructor(){this._entries=new Map}add(e,n,t){this._entries.has(e)?f().warn(`Ignoring duplicate varying ${n} ${e}`):this._entries.set(e,{type:n,invariant:t?.invariant??!1})}generateSource(e){const n=new Array;return this._entries.forEach(((t,i)=>n.push((t.invariant&&e==="vertex"?"invariant ":"")+(e==="vertex"?"out":"in")+` ${t.type} ${i};`))),n}}const h=class h{constructor(){this._entries=new Set}add(e){this._entries.add(e)}generateSource(e){const n=e==="vertex"?h.ALLOWLIST_VERTEX:h.ALLOWLIST_FRAGMENT;return Array.from(this._entries).filter((t=>n.includes(t))).map((t=>`#extension ${t} : enable`))}};h.ALLOWLIST_FRAGMENT=["GL_EXT_shader_texture_lod","GL_OES_standard_derivatives"],h.ALLOWLIST_VERTEX=[];let p=h;const m=class m{constructor(){this._entries=new Map}add(e,n,t=0){const i=this._entries.get(t);i?.name!==e||i?.type!==n?this._entries.set(t,{name:e,type:n}):f().warn(`Fragment shader output location ${t} occupied`)}generateSource(e){if(e==="vertex")return[];this._entries.size===0&&this._entries.set(0,{name:m.DEFAULT_NAME,type:m.DEFAULT_TYPE});const n=new Array;return this._entries.forEach(((t,i)=>n.push(`layout(location = ${i}) out ${t.type} ${t.name};`))),n}};m.DEFAULT_TYPE="vec4",m.DEFAULT_NAME="fragColor";let g=m;class r{constructor(e){this._stage=e,this._entries=new Set}add(e,n,t){let i="ERROR_CONSTRUCTOR_STRING";switch(n){case"float":i=r._numberToFloatStr(t);break;case"int":i=r._numberToIntStr(t);break;case"bool":i=t.toString();break;case"vec2":i=`vec2(${r._numberToFloatStr(t[0])},                            ${r._numberToFloatStr(t[1])})`;break;case"vec3":i=`vec3(${r._numberToFloatStr(t[0])},                            ${r._numberToFloatStr(t[1])},                            ${r._numberToFloatStr(t[2])})`;break;case"vec4":i=`vec4(${r._numberToFloatStr(t[0])},                            ${r._numberToFloatStr(t[1])},                            ${r._numberToFloatStr(t[2])},                            ${r._numberToFloatStr(t[3])})`;break;case"ivec2":i=`ivec2(${r._numberToIntStr(t[0])},                             ${r._numberToIntStr(t[1])})`;break;case"ivec3":i=`ivec3(${r._numberToIntStr(t[0])},                             ${r._numberToIntStr(t[1])},                             ${r._numberToIntStr(t[2])})`;break;case"ivec4":i=`ivec4(${r._numberToIntStr(t[0])},                             ${r._numberToIntStr(t[1])},                             ${r._numberToIntStr(t[2])},                             ${r._numberToIntStr(t[3])})`;break;case"uvec2":i=`uvec2(${r._numberToIntStr(t[0])},                             ${r._numberToIntStr(t[1])})`;break;case"uvec3":i=`uvec3(${r._numberToIntStr(t[0])},                             ${r._numberToIntStr(t[1])},                             ${r._numberToIntStr(t[2])})`;break;case"uvec4":i=`uvec4(${r._numberToIntStr(t[0])},                             ${r._numberToIntStr(t[1])},                             ${r._numberToIntStr(t[2])},                             ${r._numberToIntStr(t[3])})`;break;case"mat2":case"mat3":case"mat4":i=`${n}(${Array.prototype.map.call(t,(a=>r._numberToFloatStr(a))).join(", ")})`}return this._entries.add(`const ${n} ${e} = ${i};`),this._stage}static _numberToIntStr(e){return e.toFixed(0)}static _numberToFloatStr(e){return Number.isInteger(e)?e.toFixed(1):e.toString()}generateSource(){return Array.from(this._entries)}}const x=`#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  precision highp int;
  precision highp sampler2D;
  precision highp usampler2D;
  precision highp sampler2DArray;
  precision highp sampler2DShadow;
#else
  precision mediump float;
  precision mediump int;
  precision mediump sampler2D;
  precision mediump usampler2D;
  precision mediump sampler2DArray;
  precision mediump sampler2DShadow;
#endif`,D=`precision highp float;
 precision highp sampler2D;
 precision highp usampler2D;
 precision highp sampler2DArray;
 precision highp sampler2DShadow;


 invariant gl_Position;
 `;export{k as i};
