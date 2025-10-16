import{sX as be,em as Re,i as Pe,m0 as dt,kk as Ae,pb as ft,J as pt,ih as ht,k2 as Fe,kn as gt,v as P,lJ as Ie,dW as pe,ic as Ge,aR as Xe,X as ce,n as k,a6 as Z,as as Se,$ as We,a8 as q,l$ as Qe,a3 as Ze,S as G,U as oe,ad as Ye,bi as vt,a9 as Ee,fI as mt,B as bt,a4 as St,i8 as xt,T as Ot,O as $t,o1 as Ct,b1 as Tt}from"./test-DMnSxVQs.js";import{o as Pt}from"./floatRGBA-BSE9nSch.js";import{a7 as At,L as Et,ae as yt,a_ as zt,s as Rt,H as Ft,M as It,a9 as wt,o as _t,R as we,ad as ge,c as _e,I as De,w as Dt,a$ as Mt,i as jt,D as H,k as Lt,e as Nt,K as Ut,aH as ee,V as Bt,W as Vt,ar as qt,b0 as Ht,as as kt,O as Gt,at as Xt,au as A,av as Wt,aw as Q,t as Qt,b1 as Je,b2 as Ke,b3 as Zt,ai as Yt,b4 as Jt,ay as Kt,aC as eo,b5 as to,b6 as oo,b7 as ao,b8 as io,b9 as Me,ba as je,bb as so,aD as ro,bc as Le}from"./OutputColorHighlightOID.glsl-CWvEBBaj.js";import{s as no,g as lo,o as Ne,f as co,y as uo,T as Ue}from"./BufferView-CRrbrpVC.js";import{O as fo}from"./InterleavedLayout-K5bAoJD_.js";import{n as N,u as et,w as ve}from"./ShaderOutput-Bdd80V3g.js";import{l as tt,u as po,n as ho,b as go,d as vo}from"./dehydratedFeatureUtils-CWDkZZCe.js";import{e as d}from"./VertexAttribute-BfkzOMLV.js";import{a as mo}from"./index-BJQUWR-1.js";import{B as bo,o as So,g as xo,p as Oo}from"./renderState-206FkoAR.js";import{n as f,t as y}from"./glsl-Cj7KC756.js";import{a as $o}from"./BindType-BBwFZqyN.js";import{i as Co}from"./ShaderBuilder-C0_MvlxS.js";let To=class extends At{constructor(e,t){super(e,"vec4",$o.Draw,((a,i,s)=>a.setUniform4fv(e,t(i,s))))}};const ye=128,W=.5,pa=be(W/2,W/2,1-W/2,1-W/2);function ha(o){return o==="cross"||o==="x"}function ga(o,e=ye,t=e*W,a=0){const{data:i,parameters:s}=Po(o,e,t,a);return new Et(i,s)}function Po(o,e=ye,t=e*W,a=0){return{data:Ao(o,e,t,a),parameters:{mipmap:!1,wrap:{s:Re.CLAMP_TO_EDGE,t:Re.CLAMP_TO_EDGE},width:e,height:e,components:4,noUnpackFlip:!0,reloadable:!0}}}function Ao(o,e=ye,t=e*W,a=0){switch(o){case"circle":default:return Eo(e,t);case"square":return yo(e,t);case"cross":return Ro(e,t,a);case"x":return Fo(e,t,a);case"kite":return zo(e,t);case"triangle":return Io(e,t);case"arrow":return wo(e,t)}}function Eo(o,e){const t=o/2-.5;return ie(o,it(t,t,e/2))}function yo(o,e){return ot(o,e,!1)}function zo(o,e){return ot(o,e,!0)}function Ro(o,e,t=0){return at(o,e,!1,t)}function Fo(o,e,t=0){return at(o,e,!0,t)}function Io(o,e){return ie(o,st(o/2,e,e/2))}function wo(o,e){const t=e,a=e/2,i=o/2,s=.8*t,r=it(i,(o-e)/2-s,Math.sqrt(s*s+a*a)),l=st(i,t,a);return ie(o,((u,n)=>Math.max(l(u,n),-r(u,n))))}function ot(o,e,t){return t&&(e/=Math.SQRT2),ie(o,((a,i)=>{let s=a-.5*o+.25,r=.5*o-i-.75;if(t){const l=(s+r)/Math.SQRT2;r=(r-s)/Math.SQRT2,s=l}return Math.max(Math.abs(s),Math.abs(r))-.5*e}))}function at(o,e,t,a=0){e-=a,t&&(e*=Math.SQRT2);const i=.5*e;return ie(o,((s,r)=>{let l,u=s-.5*o,n=.5*o-r-1;if(t){const b=(u+n)/Math.SQRT2;n=(n-u)/Math.SQRT2,u=b}return u=Math.abs(u),n=Math.abs(n),l=u>n?u>i?Math.sqrt((u-i)*(u-i)+n*n):n:n>i?Math.sqrt(u*u+(n-i)*(n-i)):u,l-=a/2,l}))}function it(o,e,t){return(a,i)=>{const s=a-o,r=i-e;return Math.sqrt(s*s+r*r)-t}}function st(o,e,t){const a=Math.sqrt(e*e+t*t);return(i,s)=>{const r=Math.abs(i-o)-t,l=s-o+e/2+.75,u=(e*r+t*l)/a,n=-l;return Math.max(u,n)}}function ie(o,e){const t=new Uint8Array(4*o*o);for(let a=0;a<o;a++)for(let i=0;i<o;i++){const s=i+o*a;let r=e(i,a);r=r/o+.5,Pt(r,t,4*s)}return t}function _o(o){return o instanceof Float32Array&&o.length>=16}function Do(o){return Array.isArray(o)&&o.length>=16}function Mo(o){return _o(o)||Do(o)}class jo{constructor(){this.factor=new Be,this.factorAlignment=new Be}}class Be{constructor(){this.scale=0,this.factor=0,this.minScaleFactor=0}}function Lo(o,e){const{vertex:t,fragment:a}=o;o.include(yt,e),t.include(tt),t.main.add(f`vec4 posProjCenter;
if (dot(position, position) > 0.0) {
ProjectHUDAux projectAux;
vec4 posProj = projectPositionHUD(projectAux);
posProjCenter = alignToPixelCenter(posProj, viewport.zw);
forwardViewPosDepth(projectAux.posView);
vec3 vpos = projectAux.posModel;
if (rejectBySlice(vpos)) {
posProjCenter = vec4(1e038, 1e038, 1e038, 1.0);
}
} else {
posProjCenter = vec4(1e038, 1e038, 1e038, 1.0);
}
gl_Position = posProjCenter;
gl_PointSize = 1.0;`),a.main.add(f`fragColor = vec4(1);
if(discardByTerrainDepth()) {
fragColor.g = 0.5;
}`)}function rt(o){const e=new Co,{signedDistanceFieldEnabled:t,occlusionTestEnabled:a,horizonCullingEnabled:i,pixelSnappingEnabled:s,hasScreenSizePerspective:r,debugDrawLabelBorder:l,vvSize:u,vvColor:n,hasRotation:b,occludedFragmentFade:p,sampleSignedDistanceFieldTexelCenter:h}=o;e.include(po,o),e.vertex.include(zt,o);const{occlusionPass:$,output:R,oitPass:F}=o;if($)return e.include(Lo,o),e;const{vertex:x,fragment:S}=e;e.include(Rt),e.include(Ft,o),e.include(It,o),a&&e.include(ho),S.include(go),S.include(wt),e.varyings.add("vcolor","vec4"),e.varyings.add("vtc","vec2"),e.varyings.add("vsize","vec2");const T=R===N.Highlight,z=T&&a;z&&e.varyings.add("voccluded","float"),x.uniforms.add(new _t("viewport",(c=>c.camera.fullViewport)),new we("screenOffset",((c,M)=>Ae(ue,2*c.screenOffset[0]*M.camera.pixelRatio,2*c.screenOffset[1]*M.camera.pixelRatio))),new we("anchorPosition",(c=>J(c))),new ge("materialColor",(c=>c.color)),new _e("materialRotation",(c=>c.rotation)),new De("tex",(c=>c.texture))),Dt(x),t&&(x.uniforms.add(new ge("outlineColor",(c=>c.outlineColor))),S.uniforms.add(new ge("outlineColor",(c=>Ve(c)?c.outlineColor:ft)),new _e("outlineSize",(c=>Ve(c)?c.outlineSize:0)))),i&&x.uniforms.add(new To("pointDistanceSphere",((c,M)=>{const w=M.camera.eye,_=c.origin;return pt(_[0]-w[0],_[1]-w[1],_[2]-w[2],ht.radius)}))),s&&x.include(tt),r&&(Mt(x),jt(x)),l&&e.varyings.add("debugBorderCoords","vec4"),e.attributes.add(d.UVI,"vec2"),e.attributes.add(d.COLOR,"vec4"),e.attributes.add(d.SIZE,"vec2"),e.attributes.add(d.ROTATION,"float"),(u||n)&&e.attributes.add(d.FEATUREATTRIBUTE,"vec4"),x.code.add(i?f`bool behindHorizon(vec3 posModel) {
vec3 camToEarthCenter = pointDistanceSphere.xyz - localOrigin;
vec3 camToPos = pointDistanceSphere.xyz + posModel;
float earthRadius = pointDistanceSphere.w;
float a = dot(camToPos, camToPos);
float b = dot(camToPos, camToEarthCenter);
float c = dot(camToEarthCenter, camToEarthCenter) - earthRadius * earthRadius;
return b > 0.0 && b < a && b * b  > a * c;
}`:f`bool behindHorizon(vec3 posModel) { return false; }`),x.main.add(f`
    ProjectHUDAux projectAux;
    vec4 posProj = projectPositionHUD(projectAux);
    forwardObjectAndLayerIdColor();

    if (rejectBySlice(projectAux.posModel)) {
      // Project outside of clip plane
      gl_Position = vec4(1e038, 1e038, 1e038, 1.0);
      return;
    }

    if (behindHorizon(projectAux.posModel)) {
      // Project outside of clip plane
      gl_Position = vec4(1e038, 1e038, 1e038, 1.0);
      return;
    }

    vec2 inputSize;
    ${y(r,f`
        inputSize = screenSizePerspectiveScaleVec2(size, projectAux.absCosAngle, projectAux.distanceToCamera, screenSizePerspective);
        vec2 screenOffsetScaled = screenSizePerspectiveScaleVec2(screenOffset, projectAux.absCosAngle, projectAux.distanceToCamera, screenSizePerspectiveAlignment);`,f`
        inputSize = size;
        vec2 screenOffsetScaled = screenOffset;`)}
    ${y(u,f`inputSize *= vvScale(featureAttribute).xx;`)}

    vec2 combinedSize = inputSize * pixelRatio;
    vec4 quadOffset = vec4(0.0);

    ${y(a,f`
    bool visible = testHUDVisibility(posProj);
    if (!visible) {
      vtc = vec2(0.0);
      ${y(l,"debugBorderCoords = vec4(0.5, 0.5, 1.5 / combinedSize);")}
      return;
    }`)}
    ${y(z,f`voccluded = visible ? 0.0 : 1.0;`)}
  `);const I=f`
      vec2 uvi1 = vec2(uvi.x < 0.0 ? 1.0 : 0.0, uvi.y < 0.0 ? 1.0 : 0.0);
      vec2 uv = abs(uvi + uvi1);
      vec2 texSize = vec2(textureSize(tex, 0));
      uv.x = uv.x >= ${qe} ? 1.0 : uv.x / texSize.x;
      uv.y = uv.y >= ${qe} ? 1.0 : uv.y / texSize.y;
      quadOffset.xy = (uvi1 - anchorPosition) * 2.0 * combinedSize;

      ${y(b,f`
          float angle = radians(materialRotation + rotation);
          float cosAngle = cos(angle);
          float sinAngle = sin(angle);
          mat2 rotate = mat2(cosAngle, -sinAngle, sinAngle,  cosAngle);

          quadOffset.xy = rotate * quadOffset.xy;
        `)}

      quadOffset.xy = (quadOffset.xy + screenOffsetScaled) / viewport.zw * posProj.w;
  `,g=s?t?f`posProj = alignToPixelOrigin(posProj, viewport.zw) + quadOffset;`:f`posProj += quadOffset;
if (inputSize.x == size.x) {
posProj = alignToPixelOrigin(posProj, viewport.zw);
}`:f`posProj += quadOffset;`;x.main.add(f`
    ${I}
    ${n?"vcolor = interpolateVVColor(featureAttribute.y) * materialColor;":"vcolor = color / 255.0 * materialColor;"}

    ${y(R===N.ObjectAndLayerIdColor,f`vcolor.a = 1.0;`)}

    bool alphaDiscard = vcolor.a < ${f.float(H)};
    ${y(t,`alphaDiscard = alphaDiscard && outlineColor.a < ${f.float(H)};`)}
    if (alphaDiscard) {
      // "early discard" if both symbol color (= fill) and outline color (if applicable) are transparent
      gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
      return;
    } else {
      ${g}
      gl_Position = posProj;
    }

    vtc = uv;

    ${y(l,f`debugBorderCoords = vec4(uv01, 1.5 / combinedSize);`)}
    vsize = inputSize;
  `),S.uniforms.add(new De("tex",(c=>c.texture))),p&&!T&&S.uniforms.add(new Lt("depthMap",(c=>c.mainDepth)),new Nt("occludedOpacity",(c=>c.hudOccludedFragmentOpacity)));const L=l?f`(isBorder > 0.0 ? 0.0 : ${f.float(H)})`:f.float(H),D=f`
    ${y(l,f`float isBorder = float(any(lessThan(debugBorderCoords.xy, debugBorderCoords.zw)) || any(greaterThan(debugBorderCoords.xy, 1.0 - debugBorderCoords.zw)));`)}

    vec2 samplePos = vtc;

    ${y(h,f`
      float txSize = float(textureSize(tex, 0).x);
      float texelSize = 1.0 / txSize;

      // Calculate how much we have to add/subtract to/from each texel to reach the size of an onscreen pixel
      vec2 scaleFactor = (vsize - txSize) * texelSize;
      samplePos += (vec2(1.0, -1.0) * texelSize) * scaleFactor;`)}

    ${t?f`
      vec4 fillPixelColor = vcolor;

      // Get distance and map it into [-0.5, 0.5]
      float d = rgbaTofloat(texture(tex, samplePos)) - 0.5;

      // Distance in output units (i.e. pixels)
      float dist = d * vsize.x;

      // Create smooth transition from the icon into its outline
      float fillAlphaFactor = clamp(0.5 - dist, 0.0, 1.0);
      fillPixelColor.a *= fillAlphaFactor;

      if (outlineSize > 0.25) {
        vec4 outlinePixelColor = outlineColor;
        float clampedOutlineSize = min(outlineSize, 0.5*vsize.x);

        // Create smooth transition around outline
        float outlineAlphaFactor = clamp(0.5 - (abs(dist) - 0.5*clampedOutlineSize), 0.0, 1.0);
        outlinePixelColor.a *= outlineAlphaFactor;

        if (
          outlineAlphaFactor + fillAlphaFactor < ${L} ||
          fillPixelColor.a + outlinePixelColor.a < ${f.float(H)}
        ) {
          discard;
        }

        // perform un-premultiplied over operator (see https://en.wikipedia.org/wiki/Alpha_compositing#Description)
        float compositeAlpha = outlinePixelColor.a + fillPixelColor.a * (1.0 - outlinePixelColor.a);
        vec3 compositeColor = vec3(outlinePixelColor) * outlinePixelColor.a +
          vec3(fillPixelColor) * fillPixelColor.a * (1.0 - outlinePixelColor.a);

        ${y(!T,f`fragColor = vec4(compositeColor, compositeAlpha);`)}
      } else {
        if (fillAlphaFactor < ${L}) {
          discard;
        }

        ${y(!T,f`fragColor = premultiplyAlpha(fillPixelColor);`)}
      }

      // visualize SDF:
      // fragColor = vec4(clamp(-dist/vsize.x*2.0, 0.0, 1.0), clamp(dist/vsize.x*2.0, 0.0, 1.0), 0.0, 1.0);
      `:f`
          vec4 texColor = texture(tex, samplePos, -0.5);
          if (texColor.a < ${L}) {
            discard;
          }
          ${y(!T,f`fragColor = texColor * premultiplyAlpha(vcolor);`)}
          `}

    ${y(p&&!T,f`
        float zSample = texelFetch(depthMap, ivec2(gl_FragCoord.xy), 0).x;
        if (zSample < gl_FragCoord.z) {
          fragColor *= occludedOpacity;
        }
        `)}

    ${y(!T&&l,f`fragColor = mix(fragColor, vec4(1.0, 0.0, 1.0, 1.0), isBorder * 0.5);`)}
  `;switch(R){case N.Color:case N.ColorEmission:e.outputs.add("fragColor","vec4",0),R===N.ColorEmission&&e.outputs.add("fragEmission","vec4",1),F===ee.ColorAlpha&&e.outputs.add("fragAlpha","float",R===N.ColorEmission?2:1),S.main.add(f`
        ${D}
        ${y(F===ee.FrontFace,f`fragColor.rgb /= fragColor.a;`)}
        ${y(R===N.ColorEmission,f`fragEmission = vec4(0.0);`)}
        ${y(F===ee.ColorAlpha,f`fragAlpha = fragColor.a;`)}`);break;case N.ObjectAndLayerIdColor:S.main.add(f`
        ${D}
        outputObjectAndLayerIdColor();`);break;case N.Highlight:e.include(Ut,o),S.main.add(f`
        ${D}
        outputHighlight(${y(z,f`voccluded == 1.0`,f`false`)});`)}return e}function Ve(o){return o.outlineColor[3]>0&&o.outlineSize>0}function J(o){return o.textureIsSignedDistanceField?No(o.anchorPosition,o.distanceFieldBoundingBox,ue):dt(ue,o.anchorPosition),ue}function No(o,e,t){Ae(t,o[0]*(e[2]-e[0])+e[0],o[1]*(e[3]-e[1])+e[1])}const ue=Pe(),ae=32e3,qe=f.float(ae),Uo=Object.freeze(Object.defineProperty({__proto__:null,build:rt,calculateAnchorPosition:J,fullUV:ae},Symbol.toStringTag,{value:"Module"}));class Bo extends Bt{constructor(e,t){super(e,t,new Vt(Uo,(()=>mo(()=>Promise.resolve().then(()=>Jo),void 0)))),this.primitiveType=t.occlusionPass?Fe.POINTS:Fe.TRIANGLES}initializePipeline(e){const{oitPass:t,hasPolygonOffset:a,draped:i,output:s,depthTestEnabled:r,occlusionPass:l}=e,u=t===ee.NONE,n=t===ee.ColorAlpha,b=s===N.Highlight,p=r&&!i&&!n&&!l&&!b;return bo({blending:et(s)?u?So:Ht(t):null,depthTest:r&&!i?{func:gt.LEQUAL}:null,depthWrite:p?Oo:null,drawBuffers:qt(t,s),colorWrite:xo,polygonOffset:a?Vo:null})}}const Vo={factor:0,units:-4};class C extends kt{constructor(e){super(),this.spherical=e,this.screenCenterOffsetUnitsEnabled=!1,this.occlusionTestEnabled=!0,this.signedDistanceFieldEnabled=!1,this.sampleSignedDistanceFieldTexelCenter=!1,this.vvSize=!1,this.vvColor=!1,this.hasVerticalOffset=!1,this.hasScreenSizePerspective=!1,this.hasRotation=!1,this.debugDrawLabelBorder=!1,this.hasPolygonOffset=!1,this.depthTestEnabled=!0,this.pixelSnappingEnabled=!0,this.draped=!1,this.terrainDepthTest=!1,this.cullAboveTerrain=!1,this.occlusionPass=!1,this.occludedFragmentFade=!1,this.objectAndLayerIdColorInstanced=!1,this.horizonCullingEnabled=!0,this.isFocused=!0,this.textureCoordinateType=Gt.None,this.emissionSource=Xt.None,this.discardInvisibleFragments=!0,this.hasVvInstancing=!1,this.snowCover=!1}}P([A()],C.prototype,"screenCenterOffsetUnitsEnabled",void 0),P([A()],C.prototype,"occlusionTestEnabled",void 0),P([A()],C.prototype,"signedDistanceFieldEnabled",void 0),P([A()],C.prototype,"sampleSignedDistanceFieldTexelCenter",void 0),P([A()],C.prototype,"vvSize",void 0),P([A()],C.prototype,"vvColor",void 0),P([A()],C.prototype,"hasVerticalOffset",void 0),P([A()],C.prototype,"hasScreenSizePerspective",void 0),P([A()],C.prototype,"hasRotation",void 0),P([A()],C.prototype,"debugDrawLabelBorder",void 0),P([A()],C.prototype,"hasPolygonOffset",void 0),P([A()],C.prototype,"depthTestEnabled",void 0),P([A()],C.prototype,"pixelSnappingEnabled",void 0),P([A()],C.prototype,"draped",void 0),P([A()],C.prototype,"terrainDepthTest",void 0),P([A()],C.prototype,"cullAboveTerrain",void 0),P([A()],C.prototype,"occlusionPass",void 0),P([A()],C.prototype,"occludedFragmentFade",void 0),P([A()],C.prototype,"objectAndLayerIdColorInstanced",void 0),P([A()],C.prototype,"horizonCullingEnabled",void 0),P([A()],C.prototype,"isFocused",void 0);let va=class extends Wt{constructor(e,t){super(e,Qo),this.produces=new Map([[Q.HUD_MATERIAL,a=>ve(a)&&!this.parameters.drawAsLabel],[Q.LABEL_MATERIAL,a=>ve(a)&&this.parameters.drawAsLabel],[Q.OCCLUSION_PIXELS,()=>this.parameters.occlusionTest],[Q.DRAPED_MATERIAL,a=>this.parameters.draped&&ve(a)]]),this._visible=!0,this._configuration=new C(t)}getConfiguration(e,t){const a=this.parameters.draped;return super.getConfiguration(e,t,this._configuration),this._configuration.hasSlicePlane=this.parameters.hasSlicePlane,this._configuration.hasVerticalOffset=!!this.parameters.verticalOffset,this._configuration.hasScreenSizePerspective=!!this.parameters.screenSizePerspective,this._configuration.screenCenterOffsetUnitsEnabled=this.parameters.centerOffsetUnits==="screen",this._configuration.hasPolygonOffset=this.parameters.polygonOffset,this._configuration.draped=a,this._configuration.occlusionTestEnabled=this.parameters.occlusionTest,this._configuration.pixelSnappingEnabled=this.parameters.pixelSnappingEnabled,this._configuration.signedDistanceFieldEnabled=this.parameters.textureIsSignedDistanceField,this._configuration.sampleSignedDistanceFieldTexelCenter=this.parameters.sampleSignedDistanceFieldTexelCenter,this._configuration.hasRotation=this.parameters.hasRotation,this._configuration.vvSize=!!this.parameters.vvSize,this._configuration.vvColor=!!this.parameters.vvColor,this._configuration.occlusionPass=t.slot===Q.OCCLUSION_PIXELS,this._configuration.occludedFragmentFade=!a&&this.parameters.occludedFragmentFade,this._configuration.horizonCullingEnabled=this.parameters.horizonCullingEnabled,this._configuration.isFocused=this.parameters.isFocused,this._configuration.depthTestEnabled=this.parameters.depthEnabled||t.slot===Q.OCCLUSION_PIXELS,et(e)&&(this._configuration.debugDrawLabelBorder=!!Qt.LABELS_SHOW_BORDER),this._configuration.oitPass=t.oitPass,this._configuration.terrainDepthTest=t.terrainDepthTest,this._configuration.cullAboveTerrain=t.cullAboveTerrain,this._configuration}intersect(e,t,a,i,s,r){const{options:{selectionMode:l,hud:u,excludeLabels:n},point:b,camera:p}=a,{parameters:h}=this;if(!l||!u||n&&h.isLabel||!e.visible||!b||!p)return;const $=e.attributes.get(d.FEATUREATTRIBUTE),R=$==null?null:Ie($.data,$e),{scaleX:F,scaleY:x}=Ce(R,h,p.pixelRatio);Ge(de,t),e.attributes.has(d.FEATUREATTRIBUTE)&&ko(de);const S=e.attributes.get(d.POSITION),T=e.attributes.get(d.SIZE),z=e.attributes.get(d.NORMAL),I=e.attributes.get(d.ROTATION),g=e.attributes.get(d.CENTEROFFSETANDDISTANCE);no(S.size>=3);const L=J(h),D=this.parameters.centerOffsetUnits==="screen";for(let c=0;c<S.data.length/S.size;c++){const M=c*S.size;ce(v,S.data[M],S.data[M+1],S.data[M+2]),Z(v,v,t),Z(v,v,p.viewMatrix);const w=c*g.size;if(ce(O,g.data[w],g.data[w+1],g.data[w+2]),!D&&(v[0]+=O[0],v[1]+=O[1],O[2]!==0)){const U=O[2];Se(O,v),We(v,v,q(O,O,U))}const _=c*z.size;if(ce(X,z.data[_],z.data[_+1],z.data[_+2]),xe(X,de,p,te),Te(this.parameters,v,te,p,Y),p.applyProjection(v,m),m[0]>-1){D&&(O[0]||O[1])&&(m[0]+=O[0]*p.pixelRatio,O[1]!==0&&(m[1]+=Je(O[1],Y.factorAlignment)*p.pixelRatio),p.unapplyProjection(m,v)),m[0]+=this.parameters.screenOffset[0]*p.pixelRatio,m[1]+=this.parameters.screenOffset[1]*p.pixelRatio,m[0]=Math.floor(m[0]),m[1]=Math.floor(m[1]);const U=c*T.size;E[0]=T.data[U],E[1]=T.data[U+1],Ke(E,Y.factor,E);const se=ct*p.pixelRatio;let re=0;h.textureIsSignedDistanceField&&(re=Math.min(h.outlineSize,.5*E[0])*p.pixelRatio/2),E[0]*=F,E[1]*=x;const he=c*I.size,ne=h.rotation+I.data[he];if(Oe(b,m[0],m[1],E,se,re,ne,h,L)){const B=a.ray;if(Z(fe,v,Ze(lt,p.viewMatrix)),m[0]=b[0],m[1]=b[1],p.unprojectFromRenderScreen(m,v)){const V=k();G(V,B.direction);const ze=1/oe(V);q(V,V,ze),r(Ye(B.origin,v)*ze,V,-1,fe)}}}}}intersectDraped(e,t,a,i,s){const r=e.attributes.get(d.POSITION),l=e.attributes.get(d.SIZE),u=e.attributes.get(d.ROTATION),n=this.parameters,b=J(n),p=e.attributes.get(d.FEATUREATTRIBUTE),h=p==null?null:Ie(p.data,$e),{scaleX:$,scaleY:R}=Ce(h,n,e.screenToWorldRatio),F=Xo*e.screenToWorldRatio;for(let x=0;x<r.data.length/r.size;x++){const S=x*r.size,T=r.data[S],z=r.data[S+1],I=x*l.size;E[0]=l.data[I],E[1]=l.data[I+1];let g=0;n.textureIsSignedDistanceField&&(g=Math.min(n.outlineSize,.5*E[0])*e.screenToWorldRatio/2),E[0]*=$,E[1]*=R;const L=x*u.size,D=n.rotation+u.data[L];Oe(a,T,z,E,F,g,D,n,b)&&i(s.distance,s.normal,-1)}}createBufferWriter(){return new Yo}applyShaderOffsetsView(e,t,a,i,s,r,l){const u=xe(t,a,s,te);return this._applyVerticalGroundOffsetView(e,u,s,l),Te(this.parameters,l,u,s,r),this._applyPolygonOffsetView(l,u,i[3],s,l),this._applyCenterOffsetView(l,i,l),l}applyShaderOffsetsNDC(e,t,a,i,s){return this._applyCenterOffsetNDC(e,t,a,i),s!=null&&G(s,i),this._applyPolygonOffsetNDC(i,t,a,i),i}_applyPolygonOffsetView(e,t,a,i,s){const r=i.aboveGround?1:-1;let l=Math.sign(a);l===0&&(l=r);const u=r*l;if(this.parameters.shaderPolygonOffset<=0)return G(s,e);const n=vt(Math.abs(t.cosAngle),.01,1),b=1-Math.sqrt(1-n*n)/n/i.viewport[2];return q(s,e,u>0?b:1/b),s}_applyVerticalGroundOffsetView(e,t,a,i){const s=oe(e),r=a.aboveGround?1:-1,l=a.computeRenderPixelSizeAtDist(s)*vo,u=q(v,t.normal,r*l);return Ee(i,e,u),i}_applyCenterOffsetView(e,t,a){const i=this.parameters.centerOffsetUnits!=="screen";return a!==e&&G(a,e),i&&(a[0]+=t[0],a[1]+=t[1],t[2]&&(Se(X,a),mt(a,a,q(X,X,t[2])))),a}_applyCenterOffsetNDC(e,t,a,i){const s=this.parameters.centerOffsetUnits!=="screen";return i!==e&&G(i,e),s||(i[0]+=t[0]/a.fullWidth*2,i[1]+=t[1]/a.fullHeight*2),i}_applyPolygonOffsetNDC(e,t,a,i){const s=this.parameters.shaderPolygonOffset;if(e!==i&&G(i,e),s){const r=a.aboveGround?1:-1,l=r*Math.sign(t[3]);i[2]-=(l||r)*s}return i}set visible(e){this._visible=e}get visible(){const{color:e,outlineSize:t,outlineColor:a}=this.parameters,i=e[3]>=H||t>=H&&a[3]>=H;return this._visible&&i}createGLMaterial(e){return new qo(e)}calculateRelativeScreenBounds(e,t,a=bt()){return Ho(this.parameters,e,t,a),a[2]=a[0]+e[0],a[3]=a[1]+e[1],a}};class qo extends ro{constructor(e){super({...e,...e.material.parameters})}beginSlot(e){return this.updateTexture(this._material.parameters.textureId),this._material.setParameters(this.textureBindParameters),this.getTechnique(Bo,e)}}function Ho(o,e,t,a){a[0]=o.anchorPosition[0]*-e[0]+o.screenOffset[0]*t,a[1]=o.anchorPosition[1]*-e[1]+o.screenOffset[1]*t}function xe(o,e,t,a){return Mo(e)&&(e=Ge(Go,e)),xt(a.normal,o,e),Z(a.normal,a.normal,t.viewInverseTransposeMatrix),a.cosAngle=Ot(nt,Wo),a}function ko(o){const e=o[0],t=o[1],a=o[2],i=o[3],s=o[4],r=o[5],l=o[6],u=o[7],n=o[8],b=1/Math.sqrt(e*e+t*t+a*a),p=1/Math.sqrt(i*i+s*s+r*r),h=1/Math.sqrt(l*l+u*u+n*n);return o[0]=e*b,o[1]=t*b,o[2]=a*b,o[3]=i*p,o[4]=s*p,o[5]=r*p,o[6]=l*h,o[7]=u*h,o[8]=n*h,o}function Oe(o,e,t,a,i,s,r,l,u){let n=e-i-a[0]*u[0],b=n+a[0]+2*i,p=t-i-a[1]*u[1],h=p+a[1]+2*i;const $=l.distanceFieldBoundingBox;return l.textureIsSignedDistanceField&&$!=null&&(n+=a[0]*$[0],p+=a[1]*$[1],b-=a[0]*(1-$[2]),h-=a[1]*(1-$[3]),n-=s,b+=s,p-=s,h+=s),Ae(He,e,t),Ct(K,o,He,Tt(r)),K[0]>n&&K[0]<b&&K[1]>p&&K[1]<h}const Y=new jo,v=k(),X=k(),m=pe(),nt=k(),fe=k(),K=Pe(),He=Pe(),de=Xe(),Go=Xe(),lt=St(),le=pe(),O=k(),me=k(),$e=pe(),te={normal:nt,cosAngle:0},ct=1,Xo=2,E=Qe(0,0),j=6,Wo=$t(0,0,1);class Qo extends Zt{constructor(){super(...arguments),this.renderOccluded=Yt.Occlude,this.isDecoration=!1,this.color=be(1,1,1,1),this.polygonOffset=!1,this.anchorPosition=Qe(.5,.5),this.screenOffset=[0,0],this.shaderPolygonOffset=1e-5,this.textureIsSignedDistanceField=!1,this.sampleSignedDistanceFieldTexelCenter=!1,this.outlineColor=be(1,1,1,1),this.outlineSize=0,this.distanceFieldBoundingBox=pe(),this.rotation=0,this.hasRotation=!1,this.vvSizeEnabled=!1,this.vvSize=null,this.vvColor=null,this.vvOpacity=null,this.vvSymbolAnchor=null,this.vvSymbolRotationMatrix=null,this.hasSlicePlane=!1,this.pixelSnappingEnabled=!0,this.occlusionTest=!0,this.occludedFragmentFade=!1,this.horizonCullingEnabled=!1,this.centerOffsetUnits="world",this.drawAsLabel=!1,this.depthEnabled=!0,this.isFocused=!0,this.focusStyle="bright",this.draped=!1,this.isLabel=!1}}const ut=fo().vec3f(d.POSITION).vec3f(d.NORMAL).vec2i16(d.UVI).vec4u8(d.COLOR).vec2f(d.SIZE).f32(d.ROTATION).vec4f(d.CENTEROFFSETANDDISTANCE).vec4f(d.FEATUREATTRIBUTE),Zo=ut.clone().vec4u8(d.OLIDCOLOR);class Yo{constructor(){this.vertexBufferLayout=eo()?Zo:ut}elementCount(e){return e.get(d.POSITION).indices.length*j}write(e,t,a,i,s,r){const{position:l,normal:u,uvi:n,color:b,size:p,rotation:h,centerOffsetAndDistance:$,featureAttribute:R}=s;to(a.get(d.POSITION),e,l,r,j),oo(a.get(d.NORMAL),t,u,r,j);const F=a.get(d.UVI)?.data;let x=0,S=0,T=-1-ae,z=-1-ae;F&&F.length>=4&&(x=F[0],S=F[1],T=-1-F[2],z=-1-F[3]);let I=a.get(d.POSITION).indices.length,g=r;for(let c=0;c<I;++c)n.set(g,0,x),n.set(g,1,S),g++,n.set(g,0,T),n.set(g,1,S),g++,n.set(g,0,T),n.set(g,1,z),g++,n.set(g,0,T),n.set(g,1,z),g++,n.set(g,0,x),n.set(g,1,z),g++,n.set(g,0,x),n.set(g,1,S),g++;ao(a.get(d.COLOR),4,b,r,j);const{data:L,indices:D}=a.get(d.SIZE);I=D.length,g=r;for(let c=0;c<I;++c){const M=L[2*D[c]],w=L[2*D[c]+1];for(let _=0;_<j;++_)p.set(g,0,M),p.set(g,1,w),g++}if(io(a.get(d.ROTATION),h,r,j),a.get(d.CENTEROFFSETANDDISTANCE)?Me(a.get(d.CENTEROFFSETANDDISTANCE),$,r,j):je($,r,I*j),a.get(d.FEATUREATTRIBUTE)?Me(a.get(d.FEATUREATTRIBUTE),R,r,j):je(R,r,I*j),i!=null){const c=a.get(d.POSITION)?.indices;if(c){const M=c.length,w=s.getField(d.OLIDCOLOR,lo);so(i,w,M,r,j)}}return{numVerticesPerItem:j,numItems:I}}intersect(e,t,a,i,s,r,l){const{options:{selectionMode:u,hud:n,excludeLabels:b},point:p,camera:h}=i;if(!u||!n||b&&t.isLabel||!p)return;const $=this.vertexBufferLayout.createView(e),R=$.getField(d.POSITION,Ne),F=$.getField(d.NORMAL,Ne),x=$.getField(d.ROTATION,co),S=$.getField(d.SIZE,uo),T=$.getField(d.FEATUREATTRIBUTE,Ue),z=$.getField(d.CENTEROFFSETANDDISTANCE,Ue),I=t.centerOffsetUnits==="screen",g=J(t);if(R==null||F==null||x==null||S==null||z==null||h==null)return;const L=T==null?null:T.getVec(0,$e),{scaleX:D,scaleY:c}=Ce(L,t,h.pixelRatio),M=R.count/j;for(let w=0;w<M;w++){const _=w*j;if(R.getVec(_,v),a!=null&&Ee(v,v,a),Z(v,v,h.viewMatrix),z.getVec(_,le),ce(O,le[0],le[1],le[2]),!I&&(v[0]+=O[0],v[1]+=O[1],O[2]!==0)){const U=O[2];Se(O,v),We(v,v,q(O,O,U))}if(F.getVec(_,X),xe(X,de,h,te),Te(t,v,te,h,Y),h.applyProjection(v,m),m[0]>-1){I&&(O[0]||O[1])&&(m[0]+=O[0]*h.pixelRatio,O[1]!==0&&(m[1]+=Je(O[1],Y.factorAlignment)*h.pixelRatio),h.unapplyProjection(m,v)),m[0]+=t.screenOffset[0]*h.pixelRatio,m[1]+=t.screenOffset[1]*h.pixelRatio,m[0]=Math.floor(m[0]),m[1]=Math.floor(m[1]),S.getVec(_,E),Ke(E,Y.factor,E);const U=ct*h.pixelRatio;let se=0;t.textureIsSignedDistanceField&&(se=Math.min(t.outlineSize,.5*E[0])*h.pixelRatio/2),E[0]*=D,E[1]*=c;const re=x.get(_),he=t.rotation+re;if(Oe(p,m[0],m[1],E,U,se,he,t,g)){const ne=i.ray;if(Z(fe,v,Ze(lt,h.viewMatrix)),m[0]=p[0],m[1]=p[1],h.unprojectFromRenderScreen(m,v)){const B=k();G(B,ne.direction);const V=1/oe(B);q(B,B,V),l(Ye(ne.origin,v)*V,B,w,fe)}}}}}}function Ce(o,e,t){return o==null||e.vvSize==null?{scaleX:t,scaleY:t}:(Jt(me,e,o),{scaleX:me[0]*t,scaleY:me[1]*t})}function Te(o,e,t,a,i){if(!o.verticalOffset?.screenLength)return o.screenSizePerspective||o.screenSizePerspectiveAlignment?ke(o,i,oe(e),t.cosAngle):(i.factor.scale=1,i.factorAlignment.scale=1),e;const s=oe(e),r=o.screenSizePerspectiveAlignment??o.screenSizePerspective,l=Kt(a,s,o.verticalOffset,t.cosAngle,r);return ke(o,i,s,t.cosAngle),q(t.normal,t.normal,l),Ee(e,e,t.normal)}function ke(o,e,t,a){o.screenSizePerspective!=null?Le(a,t,o.screenSizePerspective,e.factor):(e.factor.scale=1,e.factor.factor=0,e.factor.minScaleFactor=0),o.screenSizePerspectiveAlignment!=null?Le(a,t,o.screenSizePerspectiveAlignment,e.factorAlignment):(e.factorAlignment.factor=e.factor.factor,e.factorAlignment.scale=e.factor.scale,e.factorAlignment.minScaleFactor=e.factor.minScaleFactor)}const Jo=Object.freeze(Object.defineProperty({__proto__:null,build:rt,calculateAnchorPosition:J,fullUV:ae},Symbol.toStringTag,{value:"Module"}));export{ga as a,ye as b,ha as c,Po as i,W as o,pa as s,va as u};
