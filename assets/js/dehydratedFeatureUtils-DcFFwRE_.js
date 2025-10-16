import{n as N}from"./glsl-Cj7KC756.js";import{nB as ze,nC as De,nD as Fe,ay as ge,nE as Ue,hg as Ee,nF as Ge,nG as je,aV as He,B as Le,aI as _e,a4 as Be,cF as ke,nH as qe,nI as Xe,nJ as Ze,nK as Ye,nL as Je,nM as Ke,hi as Qe,P as We,X as re,n as C,$ as j,as as V,S as W,a8 as F,a9 as D,nN as et,ae as tt,jh as nt,aE as B,a6 as ot,Q as xe,O as at,T as Se}from"./test-Dp3_P59c.js";import{u as st}from"./meshVertexSpaceUtils-DJqF3X5b.js";import{o as rt,x as lt}from"./hydratedFeatures-2dykQGkm.js";import{r as I,t as ye,n as U}from"./vec3f32-WCVSSNPR.js";import{n as E,p as G,a as be,b as Ae,s as it,f as ct,d as ut,o as Te,c as ft,e as me,g as ht,h as pt,w as dt,i as wt,j as mt,k as Ot}from"./OutputColorHighlightOID.glsl-BSerirNU.js";import{A as gt,U as Ie}from"./Indices-CFyKJVVM.js";import{t as S}from"./orientedBoundingBox-BdnKX1R-.js";import{s as ee}from"./BufferView-CgSr7tXI.js";import{e as x}from"./VertexAttribute-BfkzOMLV.js";function Xt(t){t.code.add(N`const float MAX_RGBA_FLOAT =
255.0 / 256.0 +
255.0 / 256.0 / 256.0 +
255.0 / 256.0 / 256.0 / 256.0 +
255.0 / 256.0 / 256.0 / 256.0 / 256.0;
const vec4 FIXED_POINT_FACTORS = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);
vec4 float2rgba(const float value) {
float valueInValidDomain = clamp(value, 0.0, MAX_RGBA_FLOAT);
vec4 fixedPointU8 = floor(fract(valueInValidDomain * FIXED_POINT_FACTORS) * 256.0);
const float toU8AsFloat = 1.0 / 255.0;
return fixedPointU8 * toU8AsFloat;
}`),t.code.add(N`const vec4 RGBA_TO_FLOAT_FACTORS = vec4(
255.0 / (256.0),
255.0 / (256.0 * 256.0),
255.0 / (256.0 * 256.0 * 256.0),
255.0 / (256.0 * 256.0 * 256.0 * 256.0)
);
float rgbaTofloat(vec4 rgba) {
return dot(rgba, RGBA_TO_FLOAT_FACTORS);
}`),t.code.add(N`const vec4 uninterpolatedRGBAToFloatFactors = vec4(
1.0 / 256.0,
1.0 / 256.0 / 256.0,
1.0 / 256.0 / 256.0 / 256.0,
1.0 / 256.0 / 256.0 / 256.0 / 256.0
);
float uninterpolatedRGBAToFloat(vec4 rgba) {
return (dot(round(rgba * 255.0), uninterpolatedRGBAToFloatFactors) - 0.5) * 2.0;
}`)}function Zt(t,n){if(t.type==="point")return _(t,n,!1);if(rt(t))switch(t.type){case"extent":return _(t.center,n,!1);case"polygon":return _(t.centroid,n,!1);case"polyline":return _(Pe(t),n,!0);case"mesh":return _(st(t.vertexSpace,t.spatialReference)??t.extent.center,n,!1);case"multipoint":return}else switch(t.type){case"extent":return _(vt(t),n,!0);case"polygon":return _(xt(t),n,!0);case"polyline":return _(Pe(t),n,!0);case"multipoint":return}}function Pe(t){const n=t.paths[0];if(!n||n.length===0)return null;const o=De(n,Fe(n)/2);return ge(o[0],o[1],o[2],t.spatialReference)}function vt(t){return ge(.5*(t.xmax+t.xmin),.5*(t.ymax+t.ymin),t.zmin!=null&&t.zmax!=null&&isFinite(t.zmin)&&isFinite(t.zmax)?.5*(t.zmax+t.zmin):void 0,t.spatialReference)}function xt(t){const n=t.rings[0];if(!n||n.length===0)return null;const o=Ue(t.rings,!!t.hasZ);return ge(o[0],o[1],o[2],t.spatialReference)}function _(t,n,o){const e=o?t:lt(t);return n&&t?ze(t,e,n)?e:null:e}function Yt(t,n,o,e=0){if(t){n||(n=Le());const a=t;let f=.5*a.width*(o-1),s=.5*a.height*(o-1);return a.width<1e-7*a.height?f+=s/20:a.height<1e-7*a.width&&(s+=f/20),_e(n,a.xmin-f-e,a.ymin-s-e,a.xmax+f+e,a.ymax+s+e),n}return null}function Jt(t,n,o=null){const e=Ge(je);return t!=null&&(e[0]=t[0],e[1]=t[1],e[2]=t[2]),n!=null?e[3]=n:t!=null&&t.length>3&&(e[3]=t[3]),o&&(e[0]*=o,e[1]*=o,e[2]*=o,e[3]*=o),e}function Kt(t=Ee,n,o,e=1){const a=new Array(3);if(n==null||o==null)a[0]=1,a[1]=1,a[2]=1;else{let f,s=0;for(let r=2;r>=0;r--){const i=t[r],l=i!=null,c=r===0&&!f&&!l,h=o[r];let y;i==="symbol-value"||c?y=h!==0?n[r]/h:1:l&&i!=="proportional"&&isFinite(i)&&(y=h!==0?i/h:1),y!=null&&(a[r]=y,f=y,s=Math.max(s,Math.abs(y)))}for(let r=2;r>=0;r--)a[r]==null?a[r]=f:a[r]===0&&(a[r]=.001*s)}for(let f=2;f>=0;f--)a[f]/=e;return He(a)}function yt(t){return t.isPrimitive!=null}function Qt(t){return At(yt(t)?[t.width,t.depth,t.height]:t)?null:"Symbol sizes may not be negative values"}function At(t){const n=o=>o==null||o>=0;return Array.isArray(t)?t.every(n):n(t)}function Wt(t,n,o,e=Be()){return t&&Ye(e,e,-t/180*Math.PI),n&&Je(e,e,n/180*Math.PI),o&&Ke(e,e,o/180*Math.PI),e}function en(t,n,o){if(o.minDemResolution!=null)return o.minDemResolution;const e=ke(n),a=qe(t)*e,f=Xe(t)*e,s=Ze(t)*(n.isGeographic?1:e);return a===0&&f===0&&s===0?o.minDemResolutionForPoints:.01*Math.max(a,f,s)}var Oe;(function(t){function n(s,r){const i=s[r],l=s[r+1],c=s[r+2];return Math.sqrt(i*i+l*l+c*c)}function o(s,r){const i=s[r],l=s[r+1],c=s[r+2],h=1/Math.sqrt(i*i+l*l+c*c);s[r]*=h,s[r+1]*=h,s[r+2]*=h}function e(s,r,i){s[r]*=i,s[r+1]*=i,s[r+2]*=i}function a(s,r,i,l,c,h=r){(c=c||s)[h]=s[r]+i[l],c[h+1]=s[r+1]+i[l+1],c[h+2]=s[r+2]+i[l+2]}function f(s,r,i,l,c,h=r){(c=c||s)[h]=s[r]-i[l],c[h+1]=s[r+1]-i[l+1],c[h+2]=s[r+2]-i[l+2]}t.length=n,t.normalize=o,t.scale=e,t.add=a,t.subtract=f})(Oe||(Oe={}));const q=Oe,he=[[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5],[-.5,-.5,-.5],[.5,-.5,-.5],[.5,.5,-.5],[-.5,.5,-.5]],Pt=[0,0,1,-1,0,0,1,0,0,0,-1,0,0,1,0,0,0,-1],Mt=[0,0,1,0,1,1,0,1],$t=[0,1,2,2,3,0,4,0,3,3,7,4,1,5,6,6,2,1,1,0,4,4,5,1,3,2,6,6,7,3,5,4,7,7,6,5],Re=new Array(36);for(let t=0;t<6;t++)for(let n=0;n<6;n++)Re[6*t+n]=t;const k=new Array(36);for(let t=0;t<6;t++)k[6*t]=0,k[6*t+1]=1,k[6*t+2]=2,k[6*t+3]=2,k[6*t+4]=3,k[6*t+5]=0;function tn(t,n){Array.isArray(n)||(n=[n,n,n]);const o=new Array(24);for(let e=0;e<8;e++)o[3*e]=he[e][0]*n[0],o[3*e+1]=he[e][1]*n[1],o[3*e+2]=he[e][2]*n[2];return new G(t,[[x.POSITION,new S(o,$t,3,!0)],[x.NORMAL,new S(Pt,Re,3)],[x.UV0,new S(Mt,k,2)]])}const pe=[[-.5,0,-.5],[.5,0,-.5],[.5,0,.5],[-.5,0,.5],[0,-.5,0],[0,.5,0]],St=[0,1,-1,1,1,0,0,1,1,-1,1,0,0,-1,-1,1,-1,0,0,-1,1,-1,-1,0],bt=[5,1,0,5,2,1,5,3,2,5,0,3,4,0,1,4,1,2,4,2,3,4,3,0],Tt=[0,0,0,1,1,1,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,7];function nn(t,n){Array.isArray(n)||(n=[n,n,n]);const o=new Array(18);for(let e=0;e<6;e++)o[3*e]=pe[e][0]*n[0],o[3*e+1]=pe[e][1]*n[1],o[3*e+2]=pe[e][2]*n[2];return new G(t,[[x.POSITION,new S(o,bt,3,!0)],[x.NORMAL,new S(St,Tt,3)]])}const ne=I(-.5,0,-.5),oe=I(.5,0,-.5),ae=I(0,0,.5),se=I(0,.5,0),X=U(),Z=U(),J=U(),K=U(),Q=U();j(X,ne,se),j(Z,ne,oe),B(J,X,Z),V(J,J),j(X,oe,se),j(Z,oe,ae),B(K,X,Z),V(K,K),j(X,ae,se),j(Z,ae,ne),B(Q,X,Z),V(Q,Q);const de=[ne,oe,ae,se],It=[0,-1,0,J[0],J[1],J[2],K[0],K[1],K[2],Q[0],Q[1],Q[2]],Rt=[0,1,2,3,1,0,3,2,1,3,0,2],Ct=[0,0,0,1,1,1,2,2,2,3,3,3];function on(t,n){Array.isArray(n)||(n=[n,n,n]);const o=new Array(12);for(let e=0;e<4;e++)o[3*e]=de[e][0]*n[0],o[3*e+1]=de[e][1]*n[1],o[3*e+2]=de[e][2]*n[2];return new G(t,[[x.POSITION,new S(o,Rt,3,!0)],[x.NORMAL,new S(It,Ct,3)]])}function an(t,n,o,e,a={uv:!0}){const f=-Math.PI,s=2*Math.PI,r=-Math.PI/2,i=Math.PI,l=Math.max(3,Math.floor(o)),c=Math.max(2,Math.floor(e)),h=(l+1)*(c+1),y=E(3*h),P=E(3*h),A=E(2*h),w=[];let p=0;for(let O=0;O<=c;O++){const T=[],u=O/c,M=r+u*i,$=Math.cos(M);for(let R=0;R<=l;R++){const H=R/l,g=f+H*s,z=Math.cos(g)*$,b=Math.sin(M),te=-Math.sin(g)*$;y[3*p]=z*n,y[3*p+1]=b*n,y[3*p+2]=te*n,P[3*p]=z,P[3*p+1]=b,P[3*p+2]=te,A[2*p]=H,A[2*p+1]=u,T.push(p),++p}w.push(T)}const d=new Array;for(let O=0;O<c;O++)for(let T=0;T<l;T++){const u=w[O][T],M=w[O][T+1],$=w[O+1][T+1],R=w[O+1][T];O===0?(d.push(u),d.push($),d.push(R)):O===c-1?(d.push(u),d.push(M),d.push($)):(d.push(u),d.push(M),d.push($),d.push($),d.push(R),d.push(u))}const m=[[x.POSITION,new S(y,d,3,!0)],[x.NORMAL,new S(P,d,3,!0)]];return a.uv&&m.push([x.UV0,new S(A,d,2,!0)]),a.offset&&(m[0][0]=x.OFFSET,m.push([x.POSITION,new S(Float64Array.from(a.offset),Ie(d.length),3,!0)])),new G(t,m)}function sn(t,n,o,e){const a=Nt(n,o);return new G(t,a)}function Nt(t,n,o){let e,a;e=[0,-1,0,1,0,0,0,0,1,-1,0,0,0,0,-1,0,1,0],a=[0,1,2,0,2,3,0,3,4,0,4,1,1,5,2,2,5,3,3,5,4,4,5,1];for(let i=0;i<e.length;i+=3)q.scale(e,i,t/q.length(e,i));let f={};function s(i,l){i>l&&([i,l]=[l,i]);const c=i.toString()+"."+l.toString();if(f[c])return f[c];let h=e.length;return e.length+=3,q.add(e,3*i,e,3*l,e,h),q.scale(e,h,t/q.length(e,h)),h/=3,f[c]=h,h}for(let i=0;i<n;i++){const l=a.length,c=new Array(4*l);for(let h=0;h<l;h+=3){const y=a[h],P=a[h+1],A=a[h+2],w=s(y,P),p=s(P,A),d=s(A,y),m=4*h;c[m]=y,c[m+1]=w,c[m+2]=d,c[m+3]=P,c[m+4]=p,c[m+5]=w,c[m+6]=A,c[m+7]=d,c[m+8]=p,c[m+9]=w,c[m+10]=p,c[m+11]=d}a=c,f={}}const r=Ae(e);for(let i=0;i<r.length;i+=3)q.normalize(r,i);return[[x.POSITION,new S(Ae(e),a,3,!0)],[x.NORMAL,new S(r,a,3,!0)]]}function rn(t,{normal:n,position:o,color:e,rotation:a,size:f,centerOffsetAndDistance:s,uvi:r,featureAttribute:i,objectAndLayerIdColor:l=null}={}){const c=o?xe(o):C(),h=n?xe(n):at(0,0,1),y=e?[255*e[0],255*e[1],255*e[2],e.length>3?255*e[3]:255]:[255,255,255,255],P=f!=null&&f.length===2?f:[1,1],A=a!=null?[a]:[0],w=Ie(1),p=[[x.POSITION,new S(c,w,3,!0)],[x.NORMAL,new S(h,w,3,!0)],[x.COLOR,new S(y,w,4,!0)],[x.SIZE,new S(P,w,2)],[x.ROTATION,new S(A,w,1,!0)]];if(r&&p.push([x.UVI,new S(r,w,r.length)]),s!=null){const d=[s[0],s[1],s[2],s[3]];p.push([x.CENTEROFFSETANDDISTANCE,new S(d,w,4)])}if(i){const d=[i[0],i[1],i[2],i[3]];p.push([x.FEATUREATTRIBUTE,new S(d,w,4)])}return new G(t,p,null,be.Point,l)}function Vt(t,n,o,e,a=!0,f=!0){let s=0;const r=n,i=t;let l=I(0,s,0),c=I(0,s+i,0),h=I(0,-1,0),y=I(0,1,0);e&&(s=i,c=I(0,0,0),l=I(0,s,0),h=I(0,1,0),y=I(0,-1,0));const P=[c,l],A=[h,y],w=o+2,p=Math.sqrt(i*i+r*r);if(e)for(let u=o-1;u>=0;u--){const M=u*(2*Math.PI/o),$=I(Math.cos(M)*r,s,Math.sin(M)*r);P.push($);const R=I(i*Math.cos(M)/p,-r/p,i*Math.sin(M)/p);A.push(R)}else for(let u=0;u<o;u++){const M=u*(2*Math.PI/o),$=I(Math.cos(M)*r,s,Math.sin(M)*r);P.push($);const R=I(i*Math.cos(M)/p,r/p,i*Math.sin(M)/p);A.push(R)}const d=new Array,m=new Array;if(a){for(let u=3;u<P.length;u++)d.push(1),d.push(u-1),d.push(u),m.push(0),m.push(0),m.push(0);d.push(P.length-1),d.push(2),d.push(1),m.push(0),m.push(0),m.push(0)}if(f){for(let u=3;u<P.length;u++)d.push(u),d.push(u-1),d.push(0),m.push(u),m.push(u-1),m.push(1);d.push(0),d.push(2),d.push(P.length-1),m.push(1),m.push(2),m.push(A.length-1)}const O=E(3*w);for(let u=0;u<w;u++)O[3*u]=P[u][0],O[3*u+1]=P[u][1],O[3*u+2]=P[u][2];const T=E(3*w);for(let u=0;u<w;u++)T[3*u]=A[u][0],T[3*u+1]=A[u][1],T[3*u+2]=A[u][2];return[[x.POSITION,new S(O,d,3,!0)],[x.NORMAL,new S(T,m,3,!0)]]}function ln(t,n,o,e,a,f=!0,s=!0){return new G(t,Vt(n,o,e,a,f,s))}function cn(t,n,o,e,a,f,s){const r=a?ye(a):I(1,0,0),i=f?ye(f):I(0,0,0);s??=!0;const l=U();V(l,r);const c=U();F(c,l,Math.abs(n));const h=U();F(h,c,-.5),D(h,h,i);const y=I(0,1,0);Math.abs(1-Se(l,y))<.2&&re(y,0,0,1);const P=U();B(P,l,y),V(P,P),B(y,P,l);const A=2*e+(s?2:0),w=e+(s?2:0),p=E(3*A),d=E(3*w),m=E(2*A),O=new Array(3*e*(s?4:2)),T=new Array(3*e*(s?4:2));s&&(p[3*(A-2)]=h[0],p[3*(A-2)+1]=h[1],p[3*(A-2)+2]=h[2],m[2*(A-2)]=0,m[2*(A-2)+1]=0,p[3*(A-1)]=p[3*(A-2)]+c[0],p[3*(A-1)+1]=p[3*(A-2)+1]+c[1],p[3*(A-1)+2]=p[3*(A-2)+2]+c[2],m[2*(A-1)]=1,m[2*(A-1)+1]=1,d[3*(w-2)]=-l[0],d[3*(w-2)+1]=-l[1],d[3*(w-2)+2]=-l[2],d[3*(w-1)]=l[0],d[3*(w-1)+1]=l[1],d[3*(w-1)+2]=l[2]);const u=(g,z,b)=>{O[g]=z,T[g]=b};let M=0;const $=U(),R=U();for(let g=0;g<e;g++){const z=g*(2*Math.PI/e);F($,y,Math.sin(z)),F(R,P,Math.cos(z)),D($,$,R),d[3*g]=$[0],d[3*g+1]=$[1],d[3*g+2]=$[2],F($,$,o),D($,$,h),p[3*g]=$[0],p[3*g+1]=$[1],p[3*g+2]=$[2],m[2*g]=g/e,m[2*g+1]=0,p[3*(g+e)]=p[3*g]+c[0],p[3*(g+e)+1]=p[3*g+1]+c[1],p[3*(g+e)+2]=p[3*g+2]+c[2],m[2*(g+e)]=g/e,m[2*g+1]=1;const b=(g+1)%e;u(M++,g,g),u(M++,g+e,g),u(M++,b,b),u(M++,b,b),u(M++,g+e,g),u(M++,b+e,b)}if(s){for(let g=0;g<e;g++){const z=(g+1)%e;u(M++,A-2,w-2),u(M++,g,w-2),u(M++,z,w-2)}for(let g=0;g<e;g++){const z=(g+1)%e;u(M++,g+e,w-1),u(M++,A-1,w-1),u(M++,z+e,w-1)}}const H=[[x.POSITION,new S(p,O,3,!0)],[x.NORMAL,new S(d,T,3,!0)],[x.UV0,new S(m,O,2,!0)]];return new G(t,H)}function un(t,n,o,e,a,f){e=e||10,a=a==null||a,ee(n.length>1);const s=[[0,0,0]],r=[],i=[];for(let l=0;l<e;l++){r.push([0,-l-1,-(l+1)%e-1]);const c=l/e*2*Math.PI;i.push([Math.cos(c)*o,Math.sin(c)*o])}return zt(t,i,n,s,r,a,f)}function zt(t,n,o,e,a,f,s=I(0,0,0)){const r=n.length,i=E(o.length*r*3+(6*e.length||0)),l=E(o.length*r*3+(e?6:0)),c=new Array,h=new Array;let y=0,P=0;const A=C(),w=C(),p=C(),d=C(),m=C(),O=C(),T=C(),u=C(),M=C(),$=C(),R=C(),H=C(),g=C(),z=We();re(M,0,1,0),j(w,o[1],o[0]),V(w,w),f?(D(u,o[0],s),V(p,u)):re(p,0,0,1),Me(w,p,M,M,m,p,$e),W(d,p),W(H,m);for(let v=0;v<e.length;v++)F(O,m,e[v][0]),F(u,p,e[v][2]),D(O,O,u),D(O,O,o[0]),i[y++]=O[0],i[y++]=O[1],i[y++]=O[2];l[P++]=-w[0],l[P++]=-w[1],l[P++]=-w[2];for(let v=0;v<a.length;v++)c.push(a[v][0]>0?a[v][0]:-a[v][0]-1+e.length),c.push(a[v][1]>0?a[v][1]:-a[v][1]-1+e.length),c.push(a[v][2]>0?a[v][2]:-a[v][2]-1+e.length),h.push(0),h.push(0),h.push(0);let b=e.length;const te=e.length-1;for(let v=0;v<o.length;v++){let ve=!1;v>0&&(W(A,w),v<o.length-1?(j(w,o[v+1],o[v]),V(w,w)):ve=!0,D($,A,w),V($,$),D(R,o[v-1],d),et(o[v],$,z),tt(z,nt(R,A),u)?(j(u,u,o[v]),V(p,u),B(m,$,p),V(m,m)):Me($,d,H,M,m,p,$e),W(d,p),W(H,m)),f&&(D(u,o[v],s),V(g,u));for(let L=0;L<r;L++)if(F(O,m,n[L][0]),F(u,p,n[L][1]),D(O,O,u),V(T,O),l[P++]=T[0],l[P++]=T[1],l[P++]=T[2],D(O,O,o[v]),i[y++]=O[0],i[y++]=O[1],i[y++]=O[2],!ve){const ue=(L+1)%r;c.push(b+L),c.push(b+r+L),c.push(b+ue),c.push(b+ue),c.push(b+r+L),c.push(b+r+ue);for(let fe=0;fe<6;fe++){const Ve=c.length-6;h.push(c[Ve+fe]-te)}}b+=r}const Ce=o[o.length-1];for(let v=0;v<e.length;v++)F(O,m,e[v][0]),F(u,p,e[v][1]),D(O,O,u),D(O,O,Ce),i[y++]=O[0],i[y++]=O[1],i[y++]=O[2];const ie=P/3;l[P++]=w[0],l[P++]=w[1],l[P++]=w[2];const ce=b-r;for(let v=0;v<a.length;v++)c.push(a[v][0]>=0?b+a[v][0]:-a[v][0]-1+ce),c.push(a[v][2]>=0?b+a[v][2]:-a[v][2]-1+ce),c.push(a[v][1]>=0?b+a[v][1]:-a[v][1]-1+ce),h.push(ie),h.push(ie),h.push(ie);const Ne=[[x.POSITION,new S(i,c,3,!0)],[x.NORMAL,new S(l,h,3,!0)]];return new G(t,Ne)}function fn(t,n,o,e){ee(n.length>1,"createPolylineGeometry(): polyline needs at least 2 points"),ee(n[0].length===3,"createPolylineGeometry(): malformed vertex"),ee(o==null||o.length===n.length,"createPolylineGeometry: need same number of points and normals"),ee(o==null||o[0].length===3,"createPolylineGeometry(): malformed normal");const a=Qe(3*n.length),f=new Array(2*(n.length-1));let s=0,r=0;for(let l=0;l<n.length;l++){for(let c=0;c<3;c++)a[s++]=n[l][c];l>0&&(f[r++]=l-1,f[r++]=l)}const i=[[x.POSITION,new S(a,f,3,!0)]];if(o){const l=E(3*o.length);let c=0;for(let h=0;h<n.length;h++)for(let y=0;y<3;y++)l[c++]=o[h][y];i.push([x.NORMAL,new S(l,f,3,!0)])}return e&&i.push([x.COLOR,new S(e,gt(e.length/4),4)]),new G(t,i,null,be.Line)}function hn(t,n,o,e,a,f=0){const s=new Array(18),r=[[-o,f,a/2],[e,f,a/2],[0,n+f,a/2],[-o,f,-a/2],[e,f,-a/2],[0,n+f,-a/2]],i=[0,1,2,3,0,2,2,5,3,1,4,5,5,2,1,1,0,3,3,4,1,4,3,5];for(let l=0;l<6;l++)s[3*l]=r[l][0],s[3*l+1]=r[l][1],s[3*l+2]=r[l][2];return new G(t,[[x.POSITION,new S(s,i,3,!0)]])}function pn(t,n){const o=t.getMutableAttribute(x.POSITION).data;for(let e=0;e<o.length;e+=3){const a=o[e],f=o[e+1],s=o[e+2];re(Y,a,f,s),ot(Y,Y,n),o[e]=Y[0],o[e+1]=Y[1],o[e+2]=Y[2]}}function dn(t,n=t){const o=t.attributes,e=o.get(x.POSITION).data,a=o.get(x.NORMAL).data;if(a){const f=n.getMutableAttribute(x.NORMAL).data;for(let s=0;s<a.length;s+=3){const r=a[s+1];f[s+1]=-a[s+2],f[s+2]=r}}if(e){const f=n.getMutableAttribute(x.POSITION).data;for(let s=0;s<e.length;s+=3){const r=e[s+1];f[s+1]=-e[s+2],f[s+2]=r}}}function we(t,n,o,e,a){return!(Math.abs(Se(n,t))>a)&&(B(o,t,n),V(o,o),B(e,o,t),V(e,e),!0)}function Me(t,n,o,e,a,f,s){return we(t,n,a,f,s)||we(t,o,a,f,s)||we(t,e,a,f,s)}const $e=.99619469809,Y=C(),Dt=.5;function wn(t,n){t.include(it),t.attributes.add(x.POSITION,"vec3"),t.attributes.add(x.NORMAL,"vec3"),t.attributes.add(x.CENTEROFFSETANDDISTANCE,"vec4");const o=t.vertex;ct(o,n),ut(o,n),o.uniforms.add(new Te("viewport",(e=>e.camera.fullViewport)),new ft("polygonOffset",(e=>e.shaderPolygonOffset)),new me("cameraGroundRelative",(e=>e.camera.aboveGround?1:-1))),n.hasVerticalOffset&&ht(o),o.code.add(N`struct ProjectHUDAux {
vec3 posModel;
vec3 posView;
vec3 vnormal;
float distanceToCamera;
float absCosAngle;
};`),o.code.add(N`
    float applyHUDViewDependentPolygonOffset(float pointGroundDistance, float absCosAngle, inout vec3 posView) {
      float pointGroundSign = ${n.terrainDepthTest?N.float(0):N`sign(pointGroundDistance)`};
      if (pointGroundSign == 0.0) {
        pointGroundSign = cameraGroundRelative;
      }

      // cameraGroundRelative is -1 if camera is below ground, 1 if above ground
      // groundRelative is 1 if both camera and symbol are on the same side of the ground, -1 otherwise
      float groundRelative = cameraGroundRelative * pointGroundSign;

      // view angle dependent part of polygon offset emulation: we take the absolute value because the sign that is
      // dropped is instead introduced using the ground-relative position of the symbol and the camera
      if (polygonOffset > .0) {
        float cosAlpha = clamp(absCosAngle, 0.01, 1.0);
        float tanAlpha = sqrt(1.0 - cosAlpha * cosAlpha) / cosAlpha;
        float factor = (1.0 - tanAlpha / viewport[2]);

        // same side of the terrain
        if (groundRelative > 0.0) {
          posView *= factor;
        }
        // opposite sides of the terrain
        else {
          posView /= factor;
        }
      }

      return groundRelative;
    }
  `),n.draped&&!n.hasVerticalOffset||pt(o),n.draped||(o.uniforms.add(new me("perDistancePixelRatio",(e=>Math.tan(e.camera.fovY/2)/(e.camera.fullViewport[2]/2)))),o.code.add(N`
    void applyHUDVerticalGroundOffset(vec3 normalModel, inout vec3 posModel, inout vec3 posView) {
      float distanceToCamera = length(posView);

      // Compute offset in world units for a half pixel shift
      float pixelOffset = distanceToCamera * perDistancePixelRatio * ${N.float(Dt)};

      // Apply offset along normal in the direction away from the ground surface
      vec3 modelOffset = normalModel * cameraGroundRelative * pixelOffset;

      // Apply the same offset also on the view space position
      vec3 viewOffset = (viewNormal * vec4(modelOffset, 1.0)).xyz;

      posModel += modelOffset;
      posView += viewOffset;
    }
  `)),n.screenCenterOffsetUnitsEnabled&&dt(o),n.hasScreenSizePerspective&&wt(o),o.code.add(N`
    vec4 projectPositionHUD(out ProjectHUDAux aux) {
      vec3 centerOffset = centerOffsetAndDistance.xyz;
      float pointGroundDistance = centerOffsetAndDistance.w;

      aux.posModel = position;
      aux.posView = (view * vec4(aux.posModel, 1.0)).xyz;
      aux.vnormal = normal;
      ${n.draped?"":"applyHUDVerticalGroundOffset(aux.vnormal, aux.posModel, aux.posView);"}

      // Screen sized offset in world space, used for example for line callouts
      // Note: keep this implementation in sync with the CPU implementation, see
      //   - MaterialUtil.verticalOffsetAtDistance
      //   - HUDMaterial.applyVerticalOffsetTransformation

      aux.distanceToCamera = length(aux.posView);

      vec3 viewDirObjSpace = normalize(cameraPosition - aux.posModel);
      float cosAngle = dot(aux.vnormal, viewDirObjSpace);

      aux.absCosAngle = abs(cosAngle);

      ${n.hasScreenSizePerspective&&(n.hasVerticalOffset||n.screenCenterOffsetUnitsEnabled)?"vec3 perspectiveFactor = screenSizePerspectiveScaleFactor(aux.absCosAngle, aux.distanceToCamera, screenSizePerspectiveAlignment);":""}

      ${n.hasVerticalOffset?n.hasScreenSizePerspective?"float verticalOffsetScreenHeight = applyScreenSizePerspectiveScaleFactorFloat(verticalOffset.x, perspectiveFactor);":"float verticalOffsetScreenHeight = verticalOffset.x;":""}

      ${n.hasVerticalOffset?N`
            float worldOffset = clamp(verticalOffsetScreenHeight * verticalOffset.y * aux.distanceToCamera, verticalOffset.z, verticalOffset.w);
            vec3 modelOffset = aux.vnormal * worldOffset;
            aux.posModel += modelOffset;
            vec3 viewOffset = (viewNormal * vec4(modelOffset, 1.0)).xyz;
            aux.posView += viewOffset;
            // Since we elevate the object, we need to take that into account
            // in the distance to ground
            pointGroundDistance += worldOffset;`:""}

      float groundRelative = applyHUDViewDependentPolygonOffset(pointGroundDistance, aux.absCosAngle, aux.posView);

      ${n.screenCenterOffsetUnitsEnabled?"":N`
            // Apply x/y in view space, but z in screen space (i.e. along posView direction)
            aux.posView += vec3(centerOffset.x, centerOffset.y, 0.0);

            // Same material all have same z != 0.0 condition so should not lead to
            // branch fragmentation and will save a normalization if it's not needed
            if (centerOffset.z != 0.0) {
              aux.posView -= normalize(aux.posView) * centerOffset.z;
            }
          `}

      vec4 posProj = proj * vec4(aux.posView, 1.0);

      ${n.screenCenterOffsetUnitsEnabled?n.hasScreenSizePerspective?"float centerOffsetY = applyScreenSizePerspectiveScaleFactorFloat(centerOffset.y, perspectiveFactor);":"float centerOffsetY = centerOffset.y;":""}

      ${n.screenCenterOffsetUnitsEnabled?"posProj.xy += vec2(centerOffset.x, centerOffsetY) * pixelRatio * 2.0 / viewport.zw * posProj.w;":""}

      // constant part of polygon offset emulation
      posProj.z -= groundRelative * polygonOffset * posProj.w;
      return posProj;
    }
  `)}function Ft(t){t.uniforms.add(new mt("alignPixelEnabled",(n=>n.alignPixelEnabled))),t.code.add(N`vec4 alignToPixelCenter(vec4 clipCoord, vec2 widthHeight) {
if (!alignPixelEnabled)
return clipCoord;
vec2 xy = vec2(0.500123) + 0.5 * clipCoord.xy / clipCoord.w;
vec2 pixelSz = vec2(1.0) / widthHeight;
vec2 ij = (floor(xy * widthHeight) + vec2(0.5)) * pixelSz;
vec2 result = (ij * 2.0 - vec2(1.0)) * clipCoord.w;
return vec4(result, clipCoord.zw);
}`),t.code.add(N`vec4 alignToPixelOrigin(vec4 clipCoord, vec2 widthHeight) {
if (!alignPixelEnabled)
return clipCoord;
vec2 xy = vec2(0.5) + 0.5 * clipCoord.xy / clipCoord.w;
vec2 pixelSz = vec2(1.0) / widthHeight;
vec2 ij = floor((xy + 0.5 * pixelSz) * widthHeight) * pixelSz;
vec2 result = (ij * 2.0 - vec2(1.0)) * clipCoord.w;
return vec4(result, clipCoord.zw);
}`)}var le;(function(t){t[t.Occluded=0]="Occluded",t[t.NotOccluded=1]="NotOccluded",t[t.Both=2]="Both",t[t.COUNT=3]="COUNT"})(le||(le={}));function mn(t){t.vertex.uniforms.add(new me("renderTransparentlyOccludedHUD",(n=>n.hudRenderStyle===le.Occluded?1:n.hudRenderStyle===le.NotOccluded?0:.75)),new Te("viewport",(n=>n.camera.fullViewport)),new Ot("hudVisibilityTexture",(n=>n.hudVisibility?.getTexture()))),t.vertex.include(Ft),t.vertex.code.add(N`bool testHUDVisibility(vec4 posProj) {
vec4 posProjCenter = alignToPixelCenter(posProj, viewport.zw);
vec4 occlusionPixel = texture(hudVisibilityTexture, .5 + .5 * posProjCenter.xy / posProjCenter.w);
if (renderTransparentlyOccludedHUD > 0.5) {
return occlusionPixel.r * occlusionPixel.g > 0.0 && occlusionPixel.g * renderTransparentlyOccludedHUD < 1.0;
}
return occlusionPixel.r * occlusionPixel.g > 0.0 && occlusionPixel.g == 1.0;
}`)}function On(t){return t.type==="point"}export{Kt as B,tn as C,en as E,Qt as I,Me as M,pn as O,Yt as S,Jt as U,At as Z,le as a,Xt as b,Vt as c,Dt as d,Zt as e,nn as f,on as g,cn as h,ln as i,rn as j,Wt as k,Ft as l,dn as m,mn as n,an as o,hn as p,un as q,Nt as r,sn as s,On as t,wn as u,zt as v,fn as w};
