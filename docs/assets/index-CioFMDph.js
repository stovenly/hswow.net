(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ol="170",_0=0,Sh=1,x0=2,ef=1,nf=2,Fn=3,ni=0,Be=1,hn=2,Hn=0,rs=1,Tc=2,Eh=3,Th=4,w0=5,xi=100,M0=101,b0=102,S0=103,E0=104,T0=200,A0=201,R0=202,C0=203,Ac=204,Rc=205,P0=206,L0=207,I0=208,D0=209,N0=210,U0=211,F0=212,O0=213,z0=214,Cc=0,Pc=1,Lc=2,cs=3,Ic=4,Dc=5,Nc=6,Uc=7,zl=0,k0=1,B0=2,ei=0,sf=1,rf=2,of=3,af=4,H0=5,cf=6,lf=7,hf=300,ls=301,hs=302,Fc=303,Oc=304,Go=306,Ti=1e3,Mi=1001,zc=1002,Ae=1003,G0=1004,yr=1005,un=1006,na=1007,ti=1008,Vn=1009,uf=1010,df=1011,er=1012,kl=1013,Ai=1014,kn=1015,ii=1016,Bl=1017,Hl=1018,us=1020,ff=35902,pf=1021,mf=1022,nn=1023,gf=1024,vf=1025,os=1026,ds=1027,Gl=1028,Vl=1029,yf=1030,Wl=1031,Xl=1033,vo=33776,yo=33777,_o=33778,xo=33779,kc=35840,Bc=35841,Hc=35842,Gc=35843,Vc=36196,Wc=37492,Xc=37496,qc=37808,Yc=37809,$c=37810,Zc=37811,Kc=37812,jc=37813,Jc=37814,Qc=37815,tl=37816,el=37817,nl=37818,il=37819,sl=37820,rl=37821,wo=36492,ol=36494,al=36495,_f=36283,cl=36284,ll=36285,hl=36286,V0=3200,W0=3201,ql=0,X0=1,zn="",je="srgb",ys="srgb-linear",Vo="linear",le="srgb",Ni=7680,Ah=519,q0=512,Y0=513,$0=514,xf=515,Z0=516,K0=517,j0=518,J0=519,Rh=35044,Ch="300 es",Bn=2e3,Eo=2001;class _s{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const Ne=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ph=1234567;const qs=Math.PI/180,fs=180/Math.PI;function Pi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ne[i&255]+Ne[i>>8&255]+Ne[i>>16&255]+Ne[i>>24&255]+"-"+Ne[t&255]+Ne[t>>8&255]+"-"+Ne[t>>16&15|64]+Ne[t>>24&255]+"-"+Ne[e&63|128]+Ne[e>>8&255]+"-"+Ne[e>>16&255]+Ne[e>>24&255]+Ne[n&255]+Ne[n>>8&255]+Ne[n>>16&255]+Ne[n>>24&255]).toLowerCase()}function Te(i,t,e){return Math.max(t,Math.min(e,i))}function Yl(i,t){return(i%t+t)%t}function Q0(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function tm(i,t,e){return i!==t?(e-i)/(t-i):0}function Ys(i,t,e){return(1-e)*i+e*t}function em(i,t,e,n){return Ys(i,t,1-Math.exp(-e*n))}function nm(i,t=1){return t-Math.abs(Yl(i,t*2)-t)}function im(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function sm(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function rm(i,t){return i+Math.floor(Math.random()*(t-i+1))}function om(i,t){return i+Math.random()*(t-i)}function am(i){return i*(.5-Math.random())}function cm(i){i!==void 0&&(Ph=i);let t=Ph+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function lm(i){return i*qs}function hm(i){return i*fs}function um(i){return(i&i-1)===0&&i!==0}function dm(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function fm(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function pm(i,t,e,n,s){const r=Math.cos,o=Math.sin,a=r(e/2),c=o(e/2),l=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),f=o((t-n)/2),d=r((n-t)/2),m=o((n-t)/2);switch(s){case"XYX":i.set(a*h,c*u,c*f,a*l);break;case"YZY":i.set(c*f,a*h,c*u,a*l);break;case"ZXZ":i.set(c*u,c*f,a*h,a*l);break;case"XZX":i.set(a*h,c*m,c*d,a*l);break;case"YXY":i.set(c*d,a*h,c*m,a*l);break;case"ZYZ":i.set(c*m,c*d,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ts(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ze(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const mm={DEG2RAD:qs,RAD2DEG:fs,generateUUID:Pi,clamp:Te,euclideanModulo:Yl,mapLinear:Q0,inverseLerp:tm,lerp:Ys,damp:em,pingpong:nm,smoothstep:im,smootherstep:sm,randInt:rm,randFloat:om,randFloatSpread:am,seededRandom:cm,degToRad:lm,radToDeg:hm,isPowerOfTwo:um,ceilPowerOfTwo:dm,floorPowerOfTwo:fm,setQuaternionFromProperEuler:pm,normalize:ze,denormalize:ts};class et{constructor(t=0,e=0){et.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Te(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Yt{constructor(t,e,n,s,r,o,a,c,l){Yt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l)}set(t,e,n,s,r,o,a,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],f=n[2],d=n[5],m=n[8],v=s[0],g=s[3],p=s[6],_=s[1],y=s[4],x=s[7],b=s[2],S=s[5],E=s[8];return r[0]=o*v+a*_+c*b,r[3]=o*g+a*y+c*S,r[6]=o*p+a*x+c*E,r[1]=l*v+h*_+u*b,r[4]=l*g+h*y+u*S,r[7]=l*p+h*x+u*E,r[2]=f*v+d*_+m*b,r[5]=f*g+d*y+m*S,r[8]=f*p+d*x+m*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*o-a*l,f=a*c-h*r,d=l*r-o*c,m=e*u+n*f+s*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/m;return t[0]=u*v,t[1]=(s*l-h*n)*v,t[2]=(a*n-s*o)*v,t[3]=f*v,t[4]=(h*e-s*c)*v,t[5]=(s*r-a*e)*v,t[6]=d*v,t[7]=(n*c-l*e)*v,t[8]=(o*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(ia.makeScale(t,e)),this}rotate(t){return this.premultiply(ia.makeRotation(-t)),this}translate(t,e){return this.premultiply(ia.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const ia=new Yt;function wf(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function To(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function gm(){const i=To("canvas");return i.style.display="block",i}const Lh={};function Vs(i){i in Lh||(Lh[i]=!0,console.warn(i))}function vm(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function ym(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function _m(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const ie={enabled:!0,workingColorSpace:ys,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===le&&(i.r=Gn(i.r),i.g=Gn(i.g),i.b=Gn(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===le&&(i.r=as(i.r),i.g=as(i.g),i.b=as(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===zn?Vo:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Gn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function as(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Ih=[.64,.33,.3,.6,.15,.06],Dh=[.2126,.7152,.0722],Nh=[.3127,.329],Uh=new Yt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Fh=new Yt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);ie.define({[ys]:{primaries:Ih,whitePoint:Nh,transfer:Vo,toXYZ:Uh,fromXYZ:Fh,luminanceCoefficients:Dh,workingColorSpaceConfig:{unpackColorSpace:je},outputColorSpaceConfig:{drawingBufferColorSpace:je}},[je]:{primaries:Ih,whitePoint:Nh,transfer:le,toXYZ:Uh,fromXYZ:Fh,luminanceCoefficients:Dh,outputColorSpaceConfig:{drawingBufferColorSpace:je}}});let Ui;class xm{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Ui===void 0&&(Ui=To("canvas")),Ui.width=t.width,Ui.height=t.height;const n=Ui.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Ui}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=To("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Gn(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Gn(e[n]/255)*255):e[n]=Gn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let wm=0;class Mf{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:wm++}),this.uuid=Pi(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(sa(s[o].image)):r.push(sa(s[o]))}else r=sa(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function sa(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?xm.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Mm=0;class He extends _s{constructor(t=He.DEFAULT_IMAGE,e=He.DEFAULT_MAPPING,n=Mi,s=Mi,r=un,o=ti,a=nn,c=Vn,l=He.DEFAULT_ANISOTROPY,h=zn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Mm++}),this.uuid=Pi(),this.name="",this.source=new Mf(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new et(0,0),this.repeat=new et(1,1),this.center=new et(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==hf)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ti:t.x=t.x-Math.floor(t.x);break;case Mi:t.x=t.x<0?0:1;break;case zc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ti:t.y=t.y-Math.floor(t.y);break;case Mi:t.y=t.y<0?0:1;break;case zc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}He.DEFAULT_IMAGE=null;He.DEFAULT_MAPPING=hf;He.DEFAULT_ANISOTROPY=1;class he{constructor(t=0,e=0,n=0,s=1){he.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,l=c[0],h=c[4],u=c[8],f=c[1],d=c[5],m=c[9],v=c[2],g=c[6],p=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-v)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+v)<.1&&Math.abs(m+g)<.1&&Math.abs(l+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const y=(l+1)/2,x=(d+1)/2,b=(p+1)/2,S=(h+f)/4,E=(u+v)/4,T=(m+g)/4;return y>x&&y>b?y<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(y),s=S/n,r=E/n):x>b?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=S/s,r=T/s):b<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(b),n=E/r,s=T/r),this.set(n,s,r,e),this}let _=Math.sqrt((g-m)*(g-m)+(u-v)*(u-v)+(f-h)*(f-h));return Math.abs(_)<.001&&(_=1),this.x=(g-m)/_,this.y=(u-v)/_,this.z=(f-h)/_,this.w=Math.acos((l+d+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class bm extends _s{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new he(0,0,t,e),this.scissorTest=!1,this.viewport=new he(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:un,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new He(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Mf(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class wn extends bm{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class bf extends He{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ae,this.minFilter=Ae,this.wrapR=Mi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Sm extends He{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ae,this.minFilter=Ae,this.wrapR=Mi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ai{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3];const f=r[o+0],d=r[o+1],m=r[o+2],v=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=f,t[e+1]=d,t[e+2]=m,t[e+3]=v;return}if(u!==v||c!==f||l!==d||h!==m){let g=1-a;const p=c*f+l*d+h*m+u*v,_=p>=0?1:-1,y=1-p*p;if(y>Number.EPSILON){const b=Math.sqrt(y),S=Math.atan2(b,p*_);g=Math.sin(g*S)/b,a=Math.sin(a*S)/b}const x=a*_;if(c=c*g+f*x,l=l*g+d*x,h=h*g+m*x,u=u*g+v*x,g===1-a){const b=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=b,l*=b,h*=b,u*=b}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[o],f=r[o+1],d=r[o+2],m=r[o+3];return t[e]=a*m+h*u+c*d-l*f,t[e+1]=c*m+h*f+l*u-a*d,t[e+2]=l*m+h*d+a*f-c*u,t[e+3]=h*m-a*u-c*f-l*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),u=a(r/2),f=c(n/2),d=c(s/2),m=c(r/2);switch(o){case"XYZ":this._x=f*h*u+l*d*m,this._y=l*d*u-f*h*m,this._z=l*h*m+f*d*u,this._w=l*h*u-f*d*m;break;case"YXZ":this._x=f*h*u+l*d*m,this._y=l*d*u-f*h*m,this._z=l*h*m-f*d*u,this._w=l*h*u+f*d*m;break;case"ZXY":this._x=f*h*u-l*d*m,this._y=l*d*u+f*h*m,this._z=l*h*m+f*d*u,this._w=l*h*u-f*d*m;break;case"ZYX":this._x=f*h*u-l*d*m,this._y=l*d*u+f*h*m,this._z=l*h*m-f*d*u,this._w=l*h*u+f*d*m;break;case"YZX":this._x=f*h*u+l*d*m,this._y=l*d*u+f*h*m,this._z=l*h*m-f*d*u,this._w=l*h*u-f*d*m;break;case"XZY":this._x=f*h*u-l*d*m,this._y=l*d*u-f*h*m,this._z=l*h*m+f*d*u,this._w=l*h*u+f*d*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],f=n+a+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-c)*d,this._y=(r-l)*d,this._z=(o-s)*d}else if(n>a&&n>u){const d=2*Math.sqrt(1+n-a-u);this._w=(h-c)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+l)/d}else if(a>u){const d=2*Math.sqrt(1+a-n-u);this._w=(r-l)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(c+h)/d}else{const d=2*Math.sqrt(1+u-n-a);this._w=(o-s)/d,this._x=(r+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Te(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const d=1-e;return this._w=d*o+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,f=Math.sin(e*h)/l;return this._w=o*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(t=0,e=0,n=0){C.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Oh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Oh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=s+c*u+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ra.copy(this).projectOnVector(t),this.sub(ra)}reflect(t){return this.sub(ra.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Te(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ra=new C,Oh=new ai;class Ri{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(an.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(an.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=an.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,an):an.fromBufferAttribute(r,o),an.applyMatrix4(t.matrixWorld),this.expandByPoint(an);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),_r.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),_r.copy(n.boundingBox)),_r.applyMatrix4(t.matrixWorld),this.union(_r)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,an),an.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Es),xr.subVectors(this.max,Es),Fi.subVectors(t.a,Es),Oi.subVectors(t.b,Es),zi.subVectors(t.c,Es),Yn.subVectors(Oi,Fi),$n.subVectors(zi,Oi),hi.subVectors(Fi,zi);let e=[0,-Yn.z,Yn.y,0,-$n.z,$n.y,0,-hi.z,hi.y,Yn.z,0,-Yn.x,$n.z,0,-$n.x,hi.z,0,-hi.x,-Yn.y,Yn.x,0,-$n.y,$n.x,0,-hi.y,hi.x,0];return!oa(e,Fi,Oi,zi,xr)||(e=[1,0,0,0,1,0,0,0,1],!oa(e,Fi,Oi,zi,xr))?!1:(wr.crossVectors(Yn,$n),e=[wr.x,wr.y,wr.z],oa(e,Fi,Oi,zi,xr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,an).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(an).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Cn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Cn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Cn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Cn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Cn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Cn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Cn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Cn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Cn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Cn=[new C,new C,new C,new C,new C,new C,new C,new C],an=new C,_r=new Ri,Fi=new C,Oi=new C,zi=new C,Yn=new C,$n=new C,hi=new C,Es=new C,xr=new C,wr=new C,ui=new C;function oa(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){ui.fromArray(i,r);const a=s.x*Math.abs(ui.x)+s.y*Math.abs(ui.y)+s.z*Math.abs(ui.z),c=t.dot(ui),l=e.dot(ui),h=n.dot(ui);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const Em=new Ri,Ts=new C,aa=new C;class xs{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Em.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ts.subVectors(t,this.center);const e=Ts.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Ts,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(aa.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ts.copy(t.center).add(aa)),this.expandByPoint(Ts.copy(t.center).sub(aa))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Pn=new C,ca=new C,Mr=new C,Zn=new C,la=new C,br=new C,ha=new C;class cr{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Pn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Pn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Pn.copy(this.origin).addScaledVector(this.direction,e),Pn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){ca.copy(t).add(e).multiplyScalar(.5),Mr.copy(e).sub(t).normalize(),Zn.copy(this.origin).sub(ca);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Mr),a=Zn.dot(this.direction),c=-Zn.dot(Mr),l=Zn.lengthSq(),h=Math.abs(1-o*o);let u,f,d,m;if(h>0)if(u=o*c-a,f=o*a-c,m=r*h,u>=0)if(f>=-m)if(f<=m){const v=1/h;u*=v,f*=v,d=u*(u+o*f+2*a)+f*(o*u+f+2*c)+l}else f=r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;else f=-r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;else f<=-m?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l):f<=m?(u=0,f=Math.min(Math.max(-r,-c),r),d=f*(f+2*c)+l):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ca).addScaledVector(Mr,f),d}intersectSphere(t,e){Pn.subVectors(t.center,this.origin);const n=Pn.dot(this.direction),s=Pn.dot(Pn)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),h>=0?(r=(t.min.y-f.y)*h,o=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,o=(t.min.y-f.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(a=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Pn)!==null}intersectTriangle(t,e,n,s,r){la.subVectors(e,t),br.subVectors(n,t),ha.crossVectors(la,br);let o=this.direction.dot(ha),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Zn.subVectors(this.origin,t);const c=a*this.direction.dot(br.crossVectors(Zn,br));if(c<0)return null;const l=a*this.direction.dot(la.cross(Zn));if(l<0||c+l>o)return null;const h=-a*Zn.dot(ha);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ue{constructor(t,e,n,s,r,o,a,c,l,h,u,f,d,m,v,g){ue.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l,h,u,f,d,m,v,g)}set(t,e,n,s,r,o,a,c,l,h,u,f,d,m,v,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=m,p[11]=v,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ue().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/ki.setFromMatrixColumn(t,0).length(),r=1/ki.setFromMatrixColumn(t,1).length(),o=1/ki.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=o*h,d=o*u,m=a*h,v=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=d+m*l,e[5]=f-v*l,e[9]=-a*c,e[2]=v-f*l,e[6]=m+d*l,e[10]=o*c}else if(t.order==="YXZ"){const f=c*h,d=c*u,m=l*h,v=l*u;e[0]=f+v*a,e[4]=m*a-d,e[8]=o*l,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=d*a-m,e[6]=v+f*a,e[10]=o*c}else if(t.order==="ZXY"){const f=c*h,d=c*u,m=l*h,v=l*u;e[0]=f-v*a,e[4]=-o*u,e[8]=m+d*a,e[1]=d+m*a,e[5]=o*h,e[9]=v-f*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const f=o*h,d=o*u,m=a*h,v=a*u;e[0]=c*h,e[4]=m*l-d,e[8]=f*l+v,e[1]=c*u,e[5]=v*l+f,e[9]=d*l-m,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const f=o*c,d=o*l,m=a*c,v=a*l;e[0]=c*h,e[4]=v-f*u,e[8]=m*u+d,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=d*u+m,e[10]=f-v*u}else if(t.order==="XZY"){const f=o*c,d=o*l,m=a*c,v=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=f*u+v,e[5]=o*h,e[9]=d*u-m,e[2]=m*u-d,e[6]=a*h,e[10]=v*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Tm,t,Am)}lookAt(t,e,n){const s=this.elements;return $e.subVectors(t,e),$e.lengthSq()===0&&($e.z=1),$e.normalize(),Kn.crossVectors(n,$e),Kn.lengthSq()===0&&(Math.abs(n.z)===1?$e.x+=1e-4:$e.z+=1e-4,$e.normalize(),Kn.crossVectors(n,$e)),Kn.normalize(),Sr.crossVectors($e,Kn),s[0]=Kn.x,s[4]=Sr.x,s[8]=$e.x,s[1]=Kn.y,s[5]=Sr.y,s[9]=$e.y,s[2]=Kn.z,s[6]=Sr.z,s[10]=$e.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],f=n[9],d=n[13],m=n[2],v=n[6],g=n[10],p=n[14],_=n[3],y=n[7],x=n[11],b=n[15],S=s[0],E=s[4],T=s[8],M=s[12],w=s[1],A=s[5],N=s[9],L=s[13],U=s[2],F=s[6],D=s[10],H=s[14],k=s[3],Y=s[7],rt=s[11],ft=s[15];return r[0]=o*S+a*w+c*U+l*k,r[4]=o*E+a*A+c*F+l*Y,r[8]=o*T+a*N+c*D+l*rt,r[12]=o*M+a*L+c*H+l*ft,r[1]=h*S+u*w+f*U+d*k,r[5]=h*E+u*A+f*F+d*Y,r[9]=h*T+u*N+f*D+d*rt,r[13]=h*M+u*L+f*H+d*ft,r[2]=m*S+v*w+g*U+p*k,r[6]=m*E+v*A+g*F+p*Y,r[10]=m*T+v*N+g*D+p*rt,r[14]=m*M+v*L+g*H+p*ft,r[3]=_*S+y*w+x*U+b*k,r[7]=_*E+y*A+x*F+b*Y,r[11]=_*T+y*N+x*D+b*rt,r[15]=_*M+y*L+x*H+b*ft,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],f=t[10],d=t[14],m=t[3],v=t[7],g=t[11],p=t[15];return m*(+r*c*u-s*l*u-r*a*f+n*l*f+s*a*d-n*c*d)+v*(+e*c*d-e*l*f+r*o*f-s*o*d+s*l*h-r*c*h)+g*(+e*l*u-e*a*d-r*o*u+n*o*d+r*a*h-n*l*h)+p*(-s*a*h-e*c*u+e*a*f+s*o*u-n*o*f+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],f=t[10],d=t[11],m=t[12],v=t[13],g=t[14],p=t[15],_=u*g*l-v*f*l+v*c*d-a*g*d-u*c*p+a*f*p,y=m*f*l-h*g*l-m*c*d+o*g*d+h*c*p-o*f*p,x=h*v*l-m*u*l+m*a*d-o*v*d-h*a*p+o*u*p,b=m*u*c-h*v*c-m*a*f+o*v*f+h*a*g-o*u*g,S=e*_+n*y+s*x+r*b;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/S;return t[0]=_*E,t[1]=(v*f*r-u*g*r-v*s*d+n*g*d+u*s*p-n*f*p)*E,t[2]=(a*g*r-v*c*r+v*s*l-n*g*l-a*s*p+n*c*p)*E,t[3]=(u*c*r-a*f*r-u*s*l+n*f*l+a*s*d-n*c*d)*E,t[4]=y*E,t[5]=(h*g*r-m*f*r+m*s*d-e*g*d-h*s*p+e*f*p)*E,t[6]=(m*c*r-o*g*r-m*s*l+e*g*l+o*s*p-e*c*p)*E,t[7]=(o*f*r-h*c*r+h*s*l-e*f*l-o*s*d+e*c*d)*E,t[8]=x*E,t[9]=(m*u*r-h*v*r-m*n*d+e*v*d+h*n*p-e*u*p)*E,t[10]=(o*v*r-m*a*r+m*n*l-e*v*l-o*n*p+e*a*p)*E,t[11]=(h*a*r-o*u*r-h*n*l+e*u*l+o*n*d-e*a*d)*E,t[12]=b*E,t[13]=(h*v*s-m*u*s+m*n*f-e*v*f-h*n*g+e*u*g)*E,t[14]=(m*a*s-o*v*s-m*n*c+e*v*c+o*n*g-e*a*g)*E,t[15]=(o*u*s-h*a*s+h*n*c-e*u*c-o*n*f+e*a*f)*E,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,u=a+a,f=r*l,d=r*h,m=r*u,v=o*h,g=o*u,p=a*u,_=c*l,y=c*h,x=c*u,b=n.x,S=n.y,E=n.z;return s[0]=(1-(v+p))*b,s[1]=(d+x)*b,s[2]=(m-y)*b,s[3]=0,s[4]=(d-x)*S,s[5]=(1-(f+p))*S,s[6]=(g+_)*S,s[7]=0,s[8]=(m+y)*E,s[9]=(g-_)*E,s[10]=(1-(f+v))*E,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=ki.set(s[0],s[1],s[2]).length();const o=ki.set(s[4],s[5],s[6]).length(),a=ki.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],cn.copy(this);const l=1/r,h=1/o,u=1/a;return cn.elements[0]*=l,cn.elements[1]*=l,cn.elements[2]*=l,cn.elements[4]*=h,cn.elements[5]*=h,cn.elements[6]*=h,cn.elements[8]*=u,cn.elements[9]*=u,cn.elements[10]*=u,e.setFromRotationMatrix(cn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Bn){const c=this.elements,l=2*r/(e-t),h=2*r/(n-s),u=(e+t)/(e-t),f=(n+s)/(n-s);let d,m;if(a===Bn)d=-(o+r)/(o-r),m=-2*o*r/(o-r);else if(a===Eo)d=-o/(o-r),m=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=d,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Bn){const c=this.elements,l=1/(e-t),h=1/(n-s),u=1/(o-r),f=(e+t)*l,d=(n+s)*h;let m,v;if(a===Bn)m=(o+r)*u,v=-2*u;else if(a===Eo)m=r*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-d,c[2]=0,c[6]=0,c[10]=v,c[14]=-m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const ki=new C,cn=new ue,Tm=new C(0,0,0),Am=new C(1,1,1),Kn=new C,Sr=new C,$e=new C,zh=new ue,kh=new ai;class Mn{constructor(t=0,e=0,n=0,s=Mn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Te(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Te(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Te(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Te(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Te(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Te(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return zh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(zh,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return kh.setFromEuler(this),this.setFromQuaternion(kh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Mn.DEFAULT_ORDER="XYZ";class Wo{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Rm=0;const Bh=new C,Bi=new ai,Ln=new ue,Er=new C,As=new C,Cm=new C,Pm=new ai,Hh=new C(1,0,0),Gh=new C(0,1,0),Vh=new C(0,0,1),Wh={type:"added"},Lm={type:"removed"},Hi={type:"childadded",child:null},ua={type:"childremoved",child:null};class be extends _s{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Rm++}),this.uuid=Pi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=be.DEFAULT_UP.clone();const t=new C,e=new Mn,n=new ai,s=new C(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ue},normalMatrix:{value:new Yt}}),this.matrix=new ue,this.matrixWorld=new ue,this.matrixAutoUpdate=be.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Wo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Bi.setFromAxisAngle(t,e),this.quaternion.multiply(Bi),this}rotateOnWorldAxis(t,e){return Bi.setFromAxisAngle(t,e),this.quaternion.premultiply(Bi),this}rotateX(t){return this.rotateOnAxis(Hh,t)}rotateY(t){return this.rotateOnAxis(Gh,t)}rotateZ(t){return this.rotateOnAxis(Vh,t)}translateOnAxis(t,e){return Bh.copy(t).applyQuaternion(this.quaternion),this.position.add(Bh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Hh,t)}translateY(t){return this.translateOnAxis(Gh,t)}translateZ(t){return this.translateOnAxis(Vh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ln.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Er.copy(t):Er.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),As.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ln.lookAt(As,Er,this.up):Ln.lookAt(Er,As,this.up),this.quaternion.setFromRotationMatrix(Ln),s&&(Ln.extractRotation(s.matrixWorld),Bi.setFromRotationMatrix(Ln),this.quaternion.premultiply(Bi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Wh),Hi.child=t,this.dispatchEvent(Hi),Hi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Lm),ua.child=t,this.dispatchEvent(ua),ua.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ln.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ln.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ln),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Wh),Hi.child=t,this.dispatchEvent(Hi),Hi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(As,t,Cm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(As,Pm,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),u=o(t.shapes),f=o(t.skeletons),d=o(t.animations),m=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),m.length>0&&(n.nodes=m)}return n.object=s,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}be.DEFAULT_UP=new C(0,1,0);be.DEFAULT_MATRIX_AUTO_UPDATE=!0;be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ln=new C,In=new C,da=new C,Dn=new C,Gi=new C,Vi=new C,Xh=new C,fa=new C,pa=new C,ma=new C,ga=new he,va=new he,ya=new he;class en{constructor(t=new C,e=new C,n=new C){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),ln.subVectors(t,e),s.cross(ln);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){ln.subVectors(s,e),In.subVectors(n,e),da.subVectors(t,e);const o=ln.dot(ln),a=ln.dot(In),c=ln.dot(da),l=In.dot(In),h=In.dot(da),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;const f=1/u,d=(l*c-a*h)*f,m=(o*h-a*c)*f;return r.set(1-d-m,m,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Dn)===null?!1:Dn.x>=0&&Dn.y>=0&&Dn.x+Dn.y<=1}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,Dn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Dn.x),c.addScaledVector(o,Dn.y),c.addScaledVector(a,Dn.z),c)}static getInterpolatedAttribute(t,e,n,s,r,o){return ga.setScalar(0),va.setScalar(0),ya.setScalar(0),ga.fromBufferAttribute(t,e),va.fromBufferAttribute(t,n),ya.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(ga,r.x),o.addScaledVector(va,r.y),o.addScaledVector(ya,r.z),o}static isFrontFacing(t,e,n,s){return ln.subVectors(n,e),In.subVectors(t,e),ln.cross(In).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return ln.subVectors(this.c,this.b),In.subVectors(this.a,this.b),ln.cross(In).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return en.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return en.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return en.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return en.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return en.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;Gi.subVectors(s,n),Vi.subVectors(r,n),fa.subVectors(t,n);const c=Gi.dot(fa),l=Vi.dot(fa);if(c<=0&&l<=0)return e.copy(n);pa.subVectors(t,s);const h=Gi.dot(pa),u=Vi.dot(pa);if(h>=0&&u<=h)return e.copy(s);const f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(Gi,o);ma.subVectors(t,r);const d=Gi.dot(ma),m=Vi.dot(ma);if(m>=0&&d<=m)return e.copy(r);const v=d*l-c*m;if(v<=0&&l>=0&&m<=0)return a=l/(l-m),e.copy(n).addScaledVector(Vi,a);const g=h*m-d*u;if(g<=0&&u-h>=0&&d-m>=0)return Xh.subVectors(r,s),a=(u-h)/(u-h+(d-m)),e.copy(s).addScaledVector(Xh,a);const p=1/(g+v+f);return o=v*p,a=f*p,e.copy(n).addScaledVector(Gi,o).addScaledVector(Vi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Sf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},jn={h:0,s:0,l:0},Tr={h:0,s:0,l:0};function _a(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Vt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=je){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ie.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=ie.workingColorSpace){return this.r=t,this.g=e,this.b=n,ie.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=ie.workingColorSpace){if(t=Yl(t,1),e=Te(e,0,1),n=Te(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=_a(o,r,t+1/3),this.g=_a(o,r,t),this.b=_a(o,r,t-1/3)}return ie.toWorkingColorSpace(this,s),this}setStyle(t,e=je){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=je){const n=Sf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Gn(t.r),this.g=Gn(t.g),this.b=Gn(t.b),this}copyLinearToSRGB(t){return this.r=as(t.r),this.g=as(t.g),this.b=as(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=je){return ie.fromWorkingColorSpace(Ue.copy(this),t),Math.round(Te(Ue.r*255,0,255))*65536+Math.round(Te(Ue.g*255,0,255))*256+Math.round(Te(Ue.b*255,0,255))}getHexString(t=je){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ie.workingColorSpace){ie.fromWorkingColorSpace(Ue.copy(this),e);const n=Ue.r,s=Ue.g,r=Ue.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=ie.workingColorSpace){return ie.fromWorkingColorSpace(Ue.copy(this),e),t.r=Ue.r,t.g=Ue.g,t.b=Ue.b,t}getStyle(t=je){ie.fromWorkingColorSpace(Ue.copy(this),t);const e=Ue.r,n=Ue.g,s=Ue.b;return t!==je?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(jn),this.setHSL(jn.h+t,jn.s+e,jn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(jn),t.getHSL(Tr);const n=Ys(jn.h,Tr.h,e),s=Ys(jn.s,Tr.s,e),r=Ys(jn.l,Tr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ue=new Vt;Vt.NAMES=Sf;let Im=0;class ci extends _s{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Im++}),this.uuid=Pi(),this.name="",this.blending=rs,this.side=ni,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ac,this.blendDst=Rc,this.blendEquation=xi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Vt(0,0,0),this.blendAlpha=0,this.depthFunc=cs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ah,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ni,this.stencilZFail=Ni,this.stencilZPass=Ni,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==rs&&(n.blending=this.blending),this.side!==ni&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ac&&(n.blendSrc=this.blendSrc),this.blendDst!==Rc&&(n.blendDst=this.blendDst),this.blendEquation!==xi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==cs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ah&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ni&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ni&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ni&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class lr extends ci{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Vt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mn,this.combine=zl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ee=new C,Ar=new et;class qe{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Rh,this.updateRanges=[],this.gpuType=kn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Ar.fromBufferAttribute(this,e),Ar.applyMatrix3(t),this.setXY(e,Ar.x,Ar.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix3(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix4(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyNormalMatrix(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.transformDirection(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=ts(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ze(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ts(e,this.array)),e}setX(t,e){return this.normalized&&(e=ze(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ts(e,this.array)),e}setY(t,e){return this.normalized&&(e=ze(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ts(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ze(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ts(e,this.array)),e}setW(t,e){return this.normalized&&(e=ze(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ze(e,this.array),n=ze(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ze(e,this.array),n=ze(n,this.array),s=ze(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=ze(e,this.array),n=ze(n,this.array),s=ze(s,this.array),r=ze(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Rh&&(t.usage=this.usage),t}}class Ef extends qe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Tf extends qe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class se extends qe{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Dm=0;const tn=new ue,xa=new be,Wi=new C,Ze=new Ri,Rs=new Ri,Le=new C;class Pe extends _s{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Dm++}),this.uuid=Pi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(wf(t)?Tf:Ef)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Yt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return tn.makeRotationFromQuaternion(t),this.applyMatrix4(tn),this}rotateX(t){return tn.makeRotationX(t),this.applyMatrix4(tn),this}rotateY(t){return tn.makeRotationY(t),this.applyMatrix4(tn),this}rotateZ(t){return tn.makeRotationZ(t),this.applyMatrix4(tn),this}translate(t,e,n){return tn.makeTranslation(t,e,n),this.applyMatrix4(tn),this}scale(t,e,n){return tn.makeScale(t,e,n),this.applyMatrix4(tn),this}lookAt(t){return xa.lookAt(t),xa.updateMatrix(),this.applyMatrix4(xa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Wi).negate(),this.translate(Wi.x,Wi.y,Wi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new se(n,3))}else{for(let n=0,s=e.count;n<s;n++){const r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ri);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Ze.setFromBufferAttribute(r),this.morphTargetsRelative?(Le.addVectors(this.boundingBox.min,Ze.min),this.boundingBox.expandByPoint(Le),Le.addVectors(this.boundingBox.max,Ze.max),this.boundingBox.expandByPoint(Le)):(this.boundingBox.expandByPoint(Ze.min),this.boundingBox.expandByPoint(Ze.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new xs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(t){const n=this.boundingSphere.center;if(Ze.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];Rs.setFromBufferAttribute(a),this.morphTargetsRelative?(Le.addVectors(Ze.min,Rs.min),Ze.expandByPoint(Le),Le.addVectors(Ze.max,Rs.max),Ze.expandByPoint(Le)):(Ze.expandByPoint(Rs.min),Ze.expandByPoint(Rs.max))}Ze.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Le.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Le));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Le.fromBufferAttribute(a,l),c&&(Wi.fromBufferAttribute(t,l),Le.add(Wi)),s=Math.max(s,n.distanceToSquared(Le))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new qe(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let T=0;T<n.count;T++)a[T]=new C,c[T]=new C;const l=new C,h=new C,u=new C,f=new et,d=new et,m=new et,v=new C,g=new C;function p(T,M,w){l.fromBufferAttribute(n,T),h.fromBufferAttribute(n,M),u.fromBufferAttribute(n,w),f.fromBufferAttribute(r,T),d.fromBufferAttribute(r,M),m.fromBufferAttribute(r,w),h.sub(l),u.sub(l),d.sub(f),m.sub(f);const A=1/(d.x*m.y-m.x*d.y);isFinite(A)&&(v.copy(h).multiplyScalar(m.y).addScaledVector(u,-d.y).multiplyScalar(A),g.copy(u).multiplyScalar(d.x).addScaledVector(h,-m.x).multiplyScalar(A),a[T].add(v),a[M].add(v),a[w].add(v),c[T].add(g),c[M].add(g),c[w].add(g))}let _=this.groups;_.length===0&&(_=[{start:0,count:t.count}]);for(let T=0,M=_.length;T<M;++T){const w=_[T],A=w.start,N=w.count;for(let L=A,U=A+N;L<U;L+=3)p(t.getX(L+0),t.getX(L+1),t.getX(L+2))}const y=new C,x=new C,b=new C,S=new C;function E(T){b.fromBufferAttribute(s,T),S.copy(b);const M=a[T];y.copy(M),y.sub(b.multiplyScalar(b.dot(M))).normalize(),x.crossVectors(S,M);const A=x.dot(c[T])<0?-1:1;o.setXYZW(T,y.x,y.y,y.z,A)}for(let T=0,M=_.length;T<M;++T){const w=_[T],A=w.start,N=w.count;for(let L=A,U=A+N;L<U;L+=3)E(t.getX(L+0)),E(t.getX(L+1)),E(t.getX(L+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new qe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const s=new C,r=new C,o=new C,a=new C,c=new C,l=new C,h=new C,u=new C;if(t)for(let f=0,d=t.count;f<d;f+=3){const m=t.getX(f+0),v=t.getX(f+1),g=t.getX(f+2);s.fromBufferAttribute(e,m),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,g),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,m),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,g),a.add(h),c.add(h),l.add(h),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let f=0,d=e.count;f<d;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Le.fromBufferAttribute(t,e),Le.normalize(),t.setXYZ(e,Le.x,Le.y,Le.z)}toNonIndexed(){function t(a,c){const l=a.array,h=a.itemSize,u=a.normalized,f=new l.constructor(c.length*h);let d=0,m=0;for(let v=0,g=c.length;v<g;v++){a.isInterleavedBufferAttribute?d=c[v]*a.data.stride+a.offset:d=c[v]*h;for(let p=0;p<h;p++)f[m++]=l[d++]}return new qe(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Pe,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,n);e.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){const f=l[h],d=t(f,n);c.push(d)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){const d=l[u];h.push(d.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],u=r[l];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,h=o.length;l<h;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const qh=new ue,di=new cr,Rr=new xs,Yh=new C,Cr=new C,Pr=new C,Lr=new C,wa=new C,Ir=new C,$h=new C,Dr=new C;class Kt extends be{constructor(t=new Pe,e=new lr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){Ir.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=a[c],u=r[c];h!==0&&(wa.fromBufferAttribute(u,t),o?Ir.addScaledVector(wa,h):Ir.addScaledVector(wa.sub(e),h))}e.add(Ir)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Rr.copy(n.boundingSphere),Rr.applyMatrix4(r),di.copy(t.ray).recast(t.near),!(Rr.containsPoint(di.origin)===!1&&(di.intersectSphere(Rr,Yh)===null||di.origin.distanceToSquared(Yh)>(t.far-t.near)**2))&&(qh.copy(r).invert(),di.copy(t.ray).applyMatrix4(qh),!(n.boundingBox!==null&&di.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,di)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,v=f.length;m<v;m++){const g=f[m],p=o[g.materialIndex],_=Math.max(g.start,d.start),y=Math.min(a.count,Math.min(g.start+g.count,d.start+d.count));for(let x=_,b=y;x<b;x+=3){const S=a.getX(x),E=a.getX(x+1),T=a.getX(x+2);s=Nr(this,p,t,n,l,h,u,S,E,T),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,d.start),v=Math.min(a.count,d.start+d.count);for(let g=m,p=v;g<p;g+=3){const _=a.getX(g),y=a.getX(g+1),x=a.getX(g+2);s=Nr(this,o,t,n,l,h,u,_,y,x),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let m=0,v=f.length;m<v;m++){const g=f[m],p=o[g.materialIndex],_=Math.max(g.start,d.start),y=Math.min(c.count,Math.min(g.start+g.count,d.start+d.count));for(let x=_,b=y;x<b;x+=3){const S=x,E=x+1,T=x+2;s=Nr(this,p,t,n,l,h,u,S,E,T),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,d.start),v=Math.min(c.count,d.start+d.count);for(let g=m,p=v;g<p;g+=3){const _=g,y=g+1,x=g+2;s=Nr(this,o,t,n,l,h,u,_,y,x),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function Nm(i,t,e,n,s,r,o,a){let c;if(t.side===Be?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===ni,a),c===null)return null;Dr.copy(a),Dr.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Dr);return l<e.near||l>e.far?null:{distance:l,point:Dr.clone(),object:i}}function Nr(i,t,e,n,s,r,o,a,c,l){i.getVertexPosition(a,Cr),i.getVertexPosition(c,Pr),i.getVertexPosition(l,Lr);const h=Nm(i,t,e,n,Cr,Pr,Lr,$h);if(h){const u=new C;en.getBarycoord($h,Cr,Pr,Lr,u),s&&(h.uv=en.getInterpolatedAttribute(s,a,c,l,u,new et)),r&&(h.uv1=en.getInterpolatedAttribute(r,a,c,l,u,new et)),o&&(h.normal=en.getInterpolatedAttribute(o,a,c,l,u,new C),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a,b:c,c:l,normal:new C,materialIndex:0};en.getNormal(Cr,Pr,Lr,f.normal),h.face=f,h.barycoord=u}return h}class V extends Pe{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],h=[],u=[];let f=0,d=0;m("z","y","x",-1,-1,n,e,t,o,r,0),m("z","y","x",1,-1,n,e,-t,o,r,1),m("x","z","y",1,1,t,n,e,s,o,2),m("x","z","y",1,-1,t,n,-e,s,o,3),m("x","y","z",1,-1,t,e,n,s,r,4),m("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new se(l,3)),this.setAttribute("normal",new se(h,3)),this.setAttribute("uv",new se(u,2));function m(v,g,p,_,y,x,b,S,E,T,M){const w=x/E,A=b/T,N=x/2,L=b/2,U=S/2,F=E+1,D=T+1;let H=0,k=0;const Y=new C;for(let rt=0;rt<D;rt++){const ft=rt*A-L;for(let Ft=0;Ft<F;Ft++){const te=Ft*w-N;Y[v]=te*_,Y[g]=ft*y,Y[p]=U,l.push(Y.x,Y.y,Y.z),Y[v]=0,Y[g]=0,Y[p]=S>0?1:-1,h.push(Y.x,Y.y,Y.z),u.push(Ft/E),u.push(1-rt/T),H+=1}}for(let rt=0;rt<T;rt++)for(let ft=0;ft<E;ft++){const Ft=f+ft+F*rt,te=f+ft+F*(rt+1),J=f+(ft+1)+F*(rt+1),at=f+(ft+1)+F*rt;c.push(Ft,te,at),c.push(te,J,at),k+=6}a.addGroup(d,k,M),d+=k,f+=H}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new V(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ps(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function ke(i){const t={};for(let e=0;e<i.length;e++){const n=ps(i[e]);for(const s in n)t[s]=n[s]}return t}function Um(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Af(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ie.workingColorSpace}const Xo={clone:ps,merge:ke};var Fm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Om=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Je extends ci{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Fm,this.fragmentShader=Om,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ps(t.uniforms),this.uniformsGroups=Um(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Rf extends be{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ue,this.projectionMatrix=new ue,this.projectionMatrixInverse=new ue,this.coordinateSystem=Bn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Jn=new C,Zh=new et,Kh=new et;class We extends Rf{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=fs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(qs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return fs*2*Math.atan(Math.tan(qs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Jn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Jn.x,Jn.y).multiplyScalar(-t/Jn.z),Jn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Jn.x,Jn.y).multiplyScalar(-t/Jn.z)}getViewSize(t,e){return this.getViewBounds(t,Zh,Kh),e.subVectors(Kh,Zh)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(qs*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Xi=-90,qi=1;class zm extends be{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new We(Xi,qi,t,e);s.layers=this.layers,this.add(s);const r=new We(Xi,qi,t,e);r.layers=this.layers,this.add(r);const o=new We(Xi,qi,t,e);o.layers=this.layers,this.add(o);const a=new We(Xi,qi,t,e);a.layers=this.layers,this.add(a);const c=new We(Xi,qi,t,e);c.layers=this.layers,this.add(c);const l=new We(Xi,qi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(const l of e)this.remove(l);if(t===Bn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Eo)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,f,d),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class Cf extends He{constructor(t,e,n,s,r,o,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:ls,super(t,e,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class km extends wn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Cf(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:un}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new V(5,5,5),r=new Je({name:"CubemapFromEquirect",uniforms:ps(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Be,blending:Hn});r.uniforms.tEquirect.value=e;const o=new Kt(s,r),a=e.minFilter;return e.minFilter===ti&&(e.minFilter=un),new zm(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}const Ma=new C,Bm=new C,Hm=new Yt;class Qn{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Ma.subVectors(n,e).cross(Bm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Ma),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Hm.getNormalMatrix(t),s=this.coplanarPoint(Ma).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const fi=new xs,Ur=new C;class $l{constructor(t=new Qn,e=new Qn,n=new Qn,s=new Qn,r=new Qn,o=new Qn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Bn){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],c=s[3],l=s[4],h=s[5],u=s[6],f=s[7],d=s[8],m=s[9],v=s[10],g=s[11],p=s[12],_=s[13],y=s[14],x=s[15];if(n[0].setComponents(c-r,f-l,g-d,x-p).normalize(),n[1].setComponents(c+r,f+l,g+d,x+p).normalize(),n[2].setComponents(c+o,f+h,g+m,x+_).normalize(),n[3].setComponents(c-o,f-h,g-m,x-_).normalize(),n[4].setComponents(c-a,f-u,g-v,x-y).normalize(),e===Bn)n[5].setComponents(c+a,f+u,g+v,x+y).normalize();else if(e===Eo)n[5].setComponents(a,u,v,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),fi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),fi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(fi)}intersectsSprite(t){return fi.center.set(0,0,0),fi.radius=.7071067811865476,fi.applyMatrix4(t.matrixWorld),this.intersectsSphere(fi)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Ur.x=s.normal.x>0?t.max.x:t.min.x,Ur.y=s.normal.y>0?t.max.y:t.min.y,Ur.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Ur)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Pf(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Gm(i){const t=new WeakMap;function e(a,c){const l=a.array,h=a.usage,u=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,h),a.onUploadCallback();let d;if(l instanceof Float32Array)d=i.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=i.SHORT;else if(l instanceof Uint32Array)d=i.UNSIGNED_INT;else if(l instanceof Int32Array)d=i.INT;else if(l instanceof Int8Array)d=i.BYTE;else if(l instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){const h=c.array,u=c.updateRanges;if(i.bindBuffer(l,a),u.length===0)i.bufferSubData(l,0,h);else{u.sort((d,m)=>d.start-m.start);let f=0;for(let d=1;d<u.length;d++){const m=u[f],v=u[d];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++f,u[f]=v)}u.length=f+1;for(let d=0,m=u.length;d<m;d++){const v=u[d];i.bufferSubData(l,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}class si extends Pe{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,u=t/a,f=e/c,d=[],m=[],v=[],g=[];for(let p=0;p<h;p++){const _=p*f-o;for(let y=0;y<l;y++){const x=y*u-r;m.push(x,-_,0),v.push(0,0,1),g.push(y/a),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let _=0;_<a;_++){const y=_+l*p,x=_+l*(p+1),b=_+1+l*(p+1),S=_+1+l*p;d.push(y,x,S),d.push(x,b,S)}this.setIndex(d),this.setAttribute("position",new se(m,3)),this.setAttribute("normal",new se(v,3)),this.setAttribute("uv",new se(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new si(t.width,t.height,t.widthSegments,t.heightSegments)}}var Vm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Wm=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Xm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,qm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ym=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,$m=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Zm=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Km=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,jm=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Jm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Qm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,tg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,eg=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ng=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ig=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,sg=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,rg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,og=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ag=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,cg=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,lg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,hg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,ug=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,dg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,fg=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,pg=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,mg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,gg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,vg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,yg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,_g="gl_FragColor = linearToOutputTexel( gl_FragColor );",xg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,wg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Mg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,bg=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Sg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Eg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Tg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ag=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Rg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Cg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Pg=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Lg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ig=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Dg=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ng=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Ug=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Fg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Og=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,zg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,kg=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Bg=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Hg=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Gg=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Vg=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Wg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Xg=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,qg=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Yg=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,$g=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Zg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Kg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,jg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Jg=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Qg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,tv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ev=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,nv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,iv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,sv=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,rv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ov=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,av=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,cv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,lv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,uv=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,dv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,fv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,pv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,mv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,gv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,vv=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,yv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,_v=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,xv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,wv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Mv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,bv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Sv=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Ev=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Tv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Av=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Rv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Cv=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Pv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Lv=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Iv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Dv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Nv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Uv=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Fv=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Ov=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,zv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,kv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Bv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Hv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Gv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Vv=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Xv=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$v=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Zv=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Kv=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,jv=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Jv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Qv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,t1=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,e1=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,n1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,i1=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,s1=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,r1=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,o1=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,a1=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,c1=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,l1=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,h1=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,u1=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,d1=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,f1=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,p1=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,m1=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,g1=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,v1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,y1=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_1=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,x1=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,w1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Zt={alphahash_fragment:Vm,alphahash_pars_fragment:Wm,alphamap_fragment:Xm,alphamap_pars_fragment:qm,alphatest_fragment:Ym,alphatest_pars_fragment:$m,aomap_fragment:Zm,aomap_pars_fragment:Km,batching_pars_vertex:jm,batching_vertex:Jm,begin_vertex:Qm,beginnormal_vertex:tg,bsdfs:eg,iridescence_fragment:ng,bumpmap_pars_fragment:ig,clipping_planes_fragment:sg,clipping_planes_pars_fragment:rg,clipping_planes_pars_vertex:og,clipping_planes_vertex:ag,color_fragment:cg,color_pars_fragment:lg,color_pars_vertex:hg,color_vertex:ug,common:dg,cube_uv_reflection_fragment:fg,defaultnormal_vertex:pg,displacementmap_pars_vertex:mg,displacementmap_vertex:gg,emissivemap_fragment:vg,emissivemap_pars_fragment:yg,colorspace_fragment:_g,colorspace_pars_fragment:xg,envmap_fragment:wg,envmap_common_pars_fragment:Mg,envmap_pars_fragment:bg,envmap_pars_vertex:Sg,envmap_physical_pars_fragment:Ug,envmap_vertex:Eg,fog_vertex:Tg,fog_pars_vertex:Ag,fog_fragment:Rg,fog_pars_fragment:Cg,gradientmap_pars_fragment:Pg,lightmap_pars_fragment:Lg,lights_lambert_fragment:Ig,lights_lambert_pars_fragment:Dg,lights_pars_begin:Ng,lights_toon_fragment:Fg,lights_toon_pars_fragment:Og,lights_phong_fragment:zg,lights_phong_pars_fragment:kg,lights_physical_fragment:Bg,lights_physical_pars_fragment:Hg,lights_fragment_begin:Gg,lights_fragment_maps:Vg,lights_fragment_end:Wg,logdepthbuf_fragment:Xg,logdepthbuf_pars_fragment:qg,logdepthbuf_pars_vertex:Yg,logdepthbuf_vertex:$g,map_fragment:Zg,map_pars_fragment:Kg,map_particle_fragment:jg,map_particle_pars_fragment:Jg,metalnessmap_fragment:Qg,metalnessmap_pars_fragment:tv,morphinstance_vertex:ev,morphcolor_vertex:nv,morphnormal_vertex:iv,morphtarget_pars_vertex:sv,morphtarget_vertex:rv,normal_fragment_begin:ov,normal_fragment_maps:av,normal_pars_fragment:cv,normal_pars_vertex:lv,normal_vertex:hv,normalmap_pars_fragment:uv,clearcoat_normal_fragment_begin:dv,clearcoat_normal_fragment_maps:fv,clearcoat_pars_fragment:pv,iridescence_pars_fragment:mv,opaque_fragment:gv,packing:vv,premultiplied_alpha_fragment:yv,project_vertex:_v,dithering_fragment:xv,dithering_pars_fragment:wv,roughnessmap_fragment:Mv,roughnessmap_pars_fragment:bv,shadowmap_pars_fragment:Sv,shadowmap_pars_vertex:Ev,shadowmap_vertex:Tv,shadowmask_pars_fragment:Av,skinbase_vertex:Rv,skinning_pars_vertex:Cv,skinning_vertex:Pv,skinnormal_vertex:Lv,specularmap_fragment:Iv,specularmap_pars_fragment:Dv,tonemapping_fragment:Nv,tonemapping_pars_fragment:Uv,transmission_fragment:Fv,transmission_pars_fragment:Ov,uv_pars_fragment:zv,uv_pars_vertex:kv,uv_vertex:Bv,worldpos_vertex:Hv,background_vert:Gv,background_frag:Vv,backgroundCube_vert:Wv,backgroundCube_frag:Xv,cube_vert:qv,cube_frag:Yv,depth_vert:$v,depth_frag:Zv,distanceRGBA_vert:Kv,distanceRGBA_frag:jv,equirect_vert:Jv,equirect_frag:Qv,linedashed_vert:t1,linedashed_frag:e1,meshbasic_vert:n1,meshbasic_frag:i1,meshlambert_vert:s1,meshlambert_frag:r1,meshmatcap_vert:o1,meshmatcap_frag:a1,meshnormal_vert:c1,meshnormal_frag:l1,meshphong_vert:h1,meshphong_frag:u1,meshphysical_vert:d1,meshphysical_frag:f1,meshtoon_vert:p1,meshtoon_frag:m1,points_vert:g1,points_frag:v1,shadow_vert:y1,shadow_frag:_1,sprite_vert:x1,sprite_frag:w1},mt={common:{diffuse:{value:new Vt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Yt}},envmap:{envMap:{value:null},envMapRotation:{value:new Yt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Yt},normalScale:{value:new et(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Vt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Vt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0},uvTransform:{value:new Yt}},sprite:{diffuse:{value:new Vt(16777215)},opacity:{value:1},center:{value:new et(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}}},gn={basic:{uniforms:ke([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.fog]),vertexShader:Zt.meshbasic_vert,fragmentShader:Zt.meshbasic_frag},lambert:{uniforms:ke([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,mt.lights,{emissive:{value:new Vt(0)}}]),vertexShader:Zt.meshlambert_vert,fragmentShader:Zt.meshlambert_frag},phong:{uniforms:ke([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,mt.lights,{emissive:{value:new Vt(0)},specular:{value:new Vt(1118481)},shininess:{value:30}}]),vertexShader:Zt.meshphong_vert,fragmentShader:Zt.meshphong_frag},standard:{uniforms:ke([mt.common,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.roughnessmap,mt.metalnessmap,mt.fog,mt.lights,{emissive:{value:new Vt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Zt.meshphysical_vert,fragmentShader:Zt.meshphysical_frag},toon:{uniforms:ke([mt.common,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.gradientmap,mt.fog,mt.lights,{emissive:{value:new Vt(0)}}]),vertexShader:Zt.meshtoon_vert,fragmentShader:Zt.meshtoon_frag},matcap:{uniforms:ke([mt.common,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,{matcap:{value:null}}]),vertexShader:Zt.meshmatcap_vert,fragmentShader:Zt.meshmatcap_frag},points:{uniforms:ke([mt.points,mt.fog]),vertexShader:Zt.points_vert,fragmentShader:Zt.points_frag},dashed:{uniforms:ke([mt.common,mt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Zt.linedashed_vert,fragmentShader:Zt.linedashed_frag},depth:{uniforms:ke([mt.common,mt.displacementmap]),vertexShader:Zt.depth_vert,fragmentShader:Zt.depth_frag},normal:{uniforms:ke([mt.common,mt.bumpmap,mt.normalmap,mt.displacementmap,{opacity:{value:1}}]),vertexShader:Zt.meshnormal_vert,fragmentShader:Zt.meshnormal_frag},sprite:{uniforms:ke([mt.sprite,mt.fog]),vertexShader:Zt.sprite_vert,fragmentShader:Zt.sprite_frag},background:{uniforms:{uvTransform:{value:new Yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Zt.background_vert,fragmentShader:Zt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Yt}},vertexShader:Zt.backgroundCube_vert,fragmentShader:Zt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Zt.cube_vert,fragmentShader:Zt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Zt.equirect_vert,fragmentShader:Zt.equirect_frag},distanceRGBA:{uniforms:ke([mt.common,mt.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Zt.distanceRGBA_vert,fragmentShader:Zt.distanceRGBA_frag},shadow:{uniforms:ke([mt.lights,mt.fog,{color:{value:new Vt(0)},opacity:{value:1}}]),vertexShader:Zt.shadow_vert,fragmentShader:Zt.shadow_frag}};gn.physical={uniforms:ke([gn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Yt},clearcoatNormalScale:{value:new et(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Yt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Yt},sheen:{value:0},sheenColor:{value:new Vt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Yt},transmissionSamplerSize:{value:new et},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Yt},attenuationDistance:{value:0},attenuationColor:{value:new Vt(0)},specularColor:{value:new Vt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Yt},anisotropyVector:{value:new et},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Yt}}]),vertexShader:Zt.meshphysical_vert,fragmentShader:Zt.meshphysical_frag};const Fr={r:0,b:0,g:0},pi=new Mn,M1=new ue;function b1(i,t,e,n,s,r,o){const a=new Vt(0);let c=r===!0?0:1,l,h,u=null,f=0,d=null;function m(_){let y=_.isScene===!0?_.background:null;return y&&y.isTexture&&(y=(_.backgroundBlurriness>0?e:t).get(y)),y}function v(_){let y=!1;const x=m(_);x===null?p(a,c):x&&x.isColor&&(p(x,1),y=!0);const b=i.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,o):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(_,y){const x=m(y);x&&(x.isCubeTexture||x.mapping===Go)?(h===void 0&&(h=new Kt(new V(1,1,1),new Je({name:"BackgroundCubeMaterial",uniforms:ps(gn.backgroundCube.uniforms),vertexShader:gn.backgroundCube.vertexShader,fragmentShader:gn.backgroundCube.fragmentShader,side:Be,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(b,S,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),pi.copy(y.backgroundRotation),pi.x*=-1,pi.y*=-1,pi.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(pi.y*=-1,pi.z*=-1),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(M1.makeRotationFromEuler(pi)),h.material.toneMapped=ie.getTransfer(x.colorSpace)!==le,(u!==x||f!==x.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,u=x,f=x.version,d=i.toneMapping),h.layers.enableAll(),_.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new Kt(new si(2,2),new Je({name:"BackgroundMaterial",uniforms:ps(gn.background.uniforms),vertexShader:gn.background.vertexShader,fragmentShader:gn.background.fragmentShader,side:ni,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.toneMapped=ie.getTransfer(x.colorSpace)!==le,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||f!==x.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,u=x,f=x.version,d=i.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null))}function p(_,y){_.getRGB(Fr,Af(i)),n.buffers.color.setClear(Fr.r,Fr.g,Fr.b,y,o)}return{getClearColor:function(){return a},setClearColor:function(_,y=1){a.set(_),c=y,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(_){c=_,p(a,c)},render:v,addToRenderList:g}}function S1(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,o=!1;function a(w,A,N,L,U){let F=!1;const D=u(L,N,A);r!==D&&(r=D,l(r.object)),F=d(w,L,N,U),F&&m(w,L,N,U),U!==null&&t.update(U,i.ELEMENT_ARRAY_BUFFER),(F||o)&&(o=!1,x(w,A,N,L),U!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(U).buffer))}function c(){return i.createVertexArray()}function l(w){return i.bindVertexArray(w)}function h(w){return i.deleteVertexArray(w)}function u(w,A,N){const L=N.wireframe===!0;let U=n[w.id];U===void 0&&(U={},n[w.id]=U);let F=U[A.id];F===void 0&&(F={},U[A.id]=F);let D=F[L];return D===void 0&&(D=f(c()),F[L]=D),D}function f(w){const A=[],N=[],L=[];for(let U=0;U<e;U++)A[U]=0,N[U]=0,L[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:A,enabledAttributes:N,attributeDivisors:L,object:w,attributes:{},index:null}}function d(w,A,N,L){const U=r.attributes,F=A.attributes;let D=0;const H=N.getAttributes();for(const k in H)if(H[k].location>=0){const rt=U[k];let ft=F[k];if(ft===void 0&&(k==="instanceMatrix"&&w.instanceMatrix&&(ft=w.instanceMatrix),k==="instanceColor"&&w.instanceColor&&(ft=w.instanceColor)),rt===void 0||rt.attribute!==ft||ft&&rt.data!==ft.data)return!0;D++}return r.attributesNum!==D||r.index!==L}function m(w,A,N,L){const U={},F=A.attributes;let D=0;const H=N.getAttributes();for(const k in H)if(H[k].location>=0){let rt=F[k];rt===void 0&&(k==="instanceMatrix"&&w.instanceMatrix&&(rt=w.instanceMatrix),k==="instanceColor"&&w.instanceColor&&(rt=w.instanceColor));const ft={};ft.attribute=rt,rt&&rt.data&&(ft.data=rt.data),U[k]=ft,D++}r.attributes=U,r.attributesNum=D,r.index=L}function v(){const w=r.newAttributes;for(let A=0,N=w.length;A<N;A++)w[A]=0}function g(w){p(w,0)}function p(w,A){const N=r.newAttributes,L=r.enabledAttributes,U=r.attributeDivisors;N[w]=1,L[w]===0&&(i.enableVertexAttribArray(w),L[w]=1),U[w]!==A&&(i.vertexAttribDivisor(w,A),U[w]=A)}function _(){const w=r.newAttributes,A=r.enabledAttributes;for(let N=0,L=A.length;N<L;N++)A[N]!==w[N]&&(i.disableVertexAttribArray(N),A[N]=0)}function y(w,A,N,L,U,F,D){D===!0?i.vertexAttribIPointer(w,A,N,U,F):i.vertexAttribPointer(w,A,N,L,U,F)}function x(w,A,N,L){v();const U=L.attributes,F=N.getAttributes(),D=A.defaultAttributeValues;for(const H in F){const k=F[H];if(k.location>=0){let Y=U[H];if(Y===void 0&&(H==="instanceMatrix"&&w.instanceMatrix&&(Y=w.instanceMatrix),H==="instanceColor"&&w.instanceColor&&(Y=w.instanceColor)),Y!==void 0){const rt=Y.normalized,ft=Y.itemSize,Ft=t.get(Y);if(Ft===void 0)continue;const te=Ft.buffer,J=Ft.type,at=Ft.bytesPerElement,St=J===i.INT||J===i.UNSIGNED_INT||Y.gpuType===kl;if(Y.isInterleavedBufferAttribute){const ht=Y.data,Nt=ht.stride,kt=Y.offset;if(ht.isInstancedInterleavedBuffer){for(let Ot=0;Ot<k.locationSize;Ot++)p(k.location+Ot,ht.meshPerAttribute);w.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=ht.meshPerAttribute*ht.count)}else for(let Ot=0;Ot<k.locationSize;Ot++)g(k.location+Ot);i.bindBuffer(i.ARRAY_BUFFER,te);for(let Ot=0;Ot<k.locationSize;Ot++)y(k.location+Ot,ft/k.locationSize,J,rt,Nt*at,(kt+ft/k.locationSize*Ot)*at,St)}else{if(Y.isInstancedBufferAttribute){for(let ht=0;ht<k.locationSize;ht++)p(k.location+ht,Y.meshPerAttribute);w.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let ht=0;ht<k.locationSize;ht++)g(k.location+ht);i.bindBuffer(i.ARRAY_BUFFER,te);for(let ht=0;ht<k.locationSize;ht++)y(k.location+ht,ft/k.locationSize,J,rt,ft*at,ft/k.locationSize*ht*at,St)}}else if(D!==void 0){const rt=D[H];if(rt!==void 0)switch(rt.length){case 2:i.vertexAttrib2fv(k.location,rt);break;case 3:i.vertexAttrib3fv(k.location,rt);break;case 4:i.vertexAttrib4fv(k.location,rt);break;default:i.vertexAttrib1fv(k.location,rt)}}}}_()}function b(){T();for(const w in n){const A=n[w];for(const N in A){const L=A[N];for(const U in L)h(L[U].object),delete L[U];delete A[N]}delete n[w]}}function S(w){if(n[w.id]===void 0)return;const A=n[w.id];for(const N in A){const L=A[N];for(const U in L)h(L[U].object),delete L[U];delete A[N]}delete n[w.id]}function E(w){for(const A in n){const N=n[A];if(N[w.id]===void 0)continue;const L=N[w.id];for(const U in L)h(L[U].object),delete L[U];delete N[w.id]}}function T(){M(),o=!0,r!==s&&(r=s,l(r.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:T,resetDefaultState:M,dispose:b,releaseStatesOfGeometry:S,releaseStatesOfProgram:E,initAttributes:v,enableAttribute:g,disableUnusedAttributes:_}}function E1(i,t,e){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function o(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function a(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let d=0;for(let m=0;m<u;m++)d+=h[m];e.update(d,n,1)}function c(l,h,u,f){if(u===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let m=0;m<l.length;m++)o(l[m],h[m],f[m]);else{d.multiDrawArraysInstancedWEBGL(n,l,0,h,0,f,0,u);let m=0;for(let v=0;v<u;v++)m+=h[v]*f[v];e.update(m,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function T1(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(E){return!(E!==nn&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(E){const T=E===ii&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==Vn&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==kn&&!T)}function c(E){if(E==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,f=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),_=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),b=m>0,S=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:f,maxTextures:d,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:_,maxVaryings:y,maxFragmentUniforms:x,vertexTextures:b,maxSamples:S}}function A1(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new Qn,a=new Yt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||n!==0||s;return s=f,n=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,d){const m=u.clippingPlanes,v=u.clipIntersection,g=u.clipShadows,p=i.get(u);if(!s||m===null||m.length===0||r&&!g)r?h(null):l();else{const _=r?0:n,y=_*4;let x=p.clippingState||null;c.value=x,x=h(m,f,y,d);for(let b=0;b!==y;++b)x[b]=e[b];p.clippingState=x,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=_}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,d,m){const v=u!==null?u.length:0;let g=null;if(v!==0){if(g=c.value,m!==!0||g===null){const p=d+v*4,_=f.matrixWorldInverse;a.getNormalMatrix(_),(g===null||g.length<p)&&(g=new Float32Array(p));for(let y=0,x=d;y!==v;++y,x+=4)o.copy(u[y]).applyMatrix4(_,a),o.normal.toArray(g,x),g[x+3]=o.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,g}}function R1(i){let t=new WeakMap;function e(o,a){return a===Fc?o.mapping=ls:a===Oc&&(o.mapping=hs),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Fc||a===Oc)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new km(c.height);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class Zl extends Rf{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const ns=4,jh=[.125,.215,.35,.446,.526,.582],wi=20,ba=new Zl,Jh=new Vt;let Sa=null,Ea=0,Ta=0,Aa=!1;const _i=(1+Math.sqrt(5))/2,Yi=1/_i,Qh=[new C(-_i,Yi,0),new C(_i,Yi,0),new C(-Yi,0,_i),new C(Yi,0,_i),new C(0,_i,-Yi),new C(0,_i,Yi),new C(-1,1,-1),new C(1,1,-1),new C(-1,1,1),new C(1,1,1)];class tu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Sa=this._renderer.getRenderTarget(),Ea=this._renderer.getActiveCubeFace(),Ta=this._renderer.getActiveMipmapLevel(),Aa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=iu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=nu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Sa,Ea,Ta),this._renderer.xr.enabled=Aa,t.scissorTest=!1,Or(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ls||t.mapping===hs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Sa=this._renderer.getRenderTarget(),Ea=this._renderer.getActiveCubeFace(),Ta=this._renderer.getActiveMipmapLevel(),Aa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:un,minFilter:un,generateMipmaps:!1,type:ii,format:nn,colorSpace:ys,depthBuffer:!1},s=eu(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=eu(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=C1(r)),this._blurMaterial=P1(r,t,e)}return s}_compileMaterial(t){const e=new Kt(this._lodPlanes[0],t);this._renderer.compile(e,ba)}_sceneToCubeUV(t,e,n,s){const a=new We(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(Jh),h.toneMapping=ei,h.autoClear=!1;const d=new lr({name:"PMREM.Background",side:Be,depthWrite:!1,depthTest:!1}),m=new Kt(new V,d);let v=!1;const g=t.background;g?g.isColor&&(d.color.copy(g),t.background=null,v=!0):(d.color.copy(Jh),v=!0);for(let p=0;p<6;p++){const _=p%3;_===0?(a.up.set(0,c[p],0),a.lookAt(l[p],0,0)):_===1?(a.up.set(0,0,c[p]),a.lookAt(0,l[p],0)):(a.up.set(0,c[p],0),a.lookAt(0,0,l[p]));const y=this._cubeSize;Or(s,_*y,p>2?y:0,y,y),h.setRenderTarget(s),v&&h.render(m,a),h.render(t,a)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=f,h.autoClear=u,t.background=g}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===ls||t.mapping===hs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=iu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=nu());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new Kt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const c=this._cubeSize;Or(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,ba)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Qh[(s-r-1)%Qh.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Kt(this._lodPlanes[s],l),f=l.uniforms,d=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*wi-1),v=r/m,g=isFinite(r)?1+Math.floor(h*v):wi;g>wi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${wi}`);const p=[];let _=0;for(let E=0;E<wi;++E){const T=E/v,M=Math.exp(-T*T/2);p.push(M),E===0?_+=M:E<g&&(_+=2*M)}for(let E=0;E<p.length;E++)p[E]=p[E]/_;f.envMap.value=t.texture,f.samples.value=g,f.weights.value=p,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:y}=this;f.dTheta.value=m,f.mipInt.value=y-n;const x=this._sizeLods[s],b=3*x*(s>y-ns?s-y+ns:0),S=4*(this._cubeSize-x);Or(e,b,S,3*x,2*x),c.setRenderTarget(e),c.render(u,ba)}}function C1(i){const t=[],e=[],n=[];let s=i;const r=i-ns+1+jh.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let c=1/a;o>i-ns?c=jh[o-i+ns-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,m=6,v=3,g=2,p=1,_=new Float32Array(v*m*d),y=new Float32Array(g*m*d),x=new Float32Array(p*m*d);for(let S=0;S<d;S++){const E=S%3*2/3-1,T=S>2?0:-1,M=[E,T,0,E+2/3,T,0,E+2/3,T+1,0,E,T,0,E+2/3,T+1,0,E,T+1,0];_.set(M,v*m*S),y.set(f,g*m*S);const w=[S,S,S,S,S,S];x.set(w,p*m*S)}const b=new Pe;b.setAttribute("position",new qe(_,v)),b.setAttribute("uv",new qe(y,g)),b.setAttribute("faceIndex",new qe(x,p)),t.push(b),s>ns&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function eu(i,t,e){const n=new wn(i,t,e);return n.texture.mapping=Go,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Or(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function P1(i,t,e){const n=new Float32Array(wi),s=new C(0,1,0);return new Je({name:"SphericalGaussianBlur",defines:{n:wi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Kl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Hn,depthTest:!1,depthWrite:!1})}function nu(){return new Je({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Kl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Hn,depthTest:!1,depthWrite:!1})}function iu(){return new Je({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Kl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Hn,depthTest:!1,depthWrite:!1})}function Kl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function L1(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===Fc||c===Oc,h=c===ls||c===hs;if(l||h){let u=t.get(a);const f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return e===null&&(e=new tu(i)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{const d=a.image;return l&&d&&d.height>0||h&&d&&s(d)?(e===null&&(e=new tu(i)),u=l?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function I1(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Vs("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function D1(i,t,e,n){const s={},r=new WeakMap;function o(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const m in f.attributes)t.remove(f.attributes[m]);for(const m in f.morphAttributes){const v=f.morphAttributes[m];for(let g=0,p=v.length;g<p;g++)t.remove(v[g])}f.removeEventListener("dispose",o),delete s[f.id];const d=r.get(f);d&&(t.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const m in f)t.update(f[m],i.ARRAY_BUFFER);const d=u.morphAttributes;for(const m in d){const v=d[m];for(let g=0,p=v.length;g<p;g++)t.update(v[g],i.ARRAY_BUFFER)}}function l(u){const f=[],d=u.index,m=u.attributes.position;let v=0;if(d!==null){const _=d.array;v=d.version;for(let y=0,x=_.length;y<x;y+=3){const b=_[y+0],S=_[y+1],E=_[y+2];f.push(b,S,S,E,E,b)}}else if(m!==void 0){const _=m.array;v=m.version;for(let y=0,x=_.length/3-1;y<x;y+=3){const b=y+0,S=y+1,E=y+2;f.push(b,S,S,E,E,b)}}else return;const g=new(wf(f)?Tf:Ef)(f,1);g.version=v;const p=r.get(u);p&&t.remove(p),r.set(u,g)}function h(u){const f=r.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function N1(i,t,e){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function c(f,d){i.drawElements(n,d,r,f*o),e.update(d,n,1)}function l(f,d,m){m!==0&&(i.drawElementsInstanced(n,d,r,f*o,m),e.update(d,n,m))}function h(f,d,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,f,0,m);let g=0;for(let p=0;p<m;p++)g+=d[p];e.update(g,n,1)}function u(f,d,m,v){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<f.length;p++)l(f[p]/o,d[p],v[p]);else{g.multiDrawElementsInstancedWEBGL(n,d,0,r,f,0,v,0,m);let p=0;for(let _=0;_<m;_++)p+=d[_]*v[_];e.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function U1(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function F1(i,t,e){const n=new WeakMap,s=new he;function r(o,a,c){const l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let f=n.get(a);if(f===void 0||f.count!==u){let M=function(){E.dispose(),n.delete(a),a.removeEventListener("dispose",M)};f!==void 0&&f.texture.dispose();const d=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],_=a.morphAttributes.color||[];let y=0;d===!0&&(y=1),m===!0&&(y=2),v===!0&&(y=3);let x=a.attributes.position.count*y,b=1;x>t.maxTextureSize&&(b=Math.ceil(x/t.maxTextureSize),x=t.maxTextureSize);const S=new Float32Array(x*b*4*u),E=new bf(S,x,b,u);E.type=kn,E.needsUpdate=!0;const T=y*4;for(let w=0;w<u;w++){const A=g[w],N=p[w],L=_[w],U=x*b*4*w;for(let F=0;F<A.count;F++){const D=F*T;d===!0&&(s.fromBufferAttribute(A,F),S[U+D+0]=s.x,S[U+D+1]=s.y,S[U+D+2]=s.z,S[U+D+3]=0),m===!0&&(s.fromBufferAttribute(N,F),S[U+D+4]=s.x,S[U+D+5]=s.y,S[U+D+6]=s.z,S[U+D+7]=0),v===!0&&(s.fromBufferAttribute(L,F),S[U+D+8]=s.x,S[U+D+9]=s.y,S[U+D+10]=s.z,S[U+D+11]=L.itemSize===4?s.w:1)}}f={count:u,texture:E,size:new et(x,b)},n.set(a,f),a.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let d=0;for(let v=0;v<l.length;v++)d+=l[v];const m=a.morphTargetsRelative?1:1-d;c.getUniforms().setValue(i,"morphTargetBaseInfluence",m),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function O1(i,t,e,n){let s=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function o(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}class jl extends He{constructor(t,e,n,s,r,o,a,c,l,h=os){if(h!==os&&h!==ds)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===os&&(n=Ai),n===void 0&&h===ds&&(n=us),super(null,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Ae,this.minFilter=c!==void 0?c:Ae,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Lf=new He,su=new jl(1,1),If=new bf,Df=new Sm,Nf=new Cf,ru=[],ou=[],au=new Float32Array(16),cu=new Float32Array(9),lu=new Float32Array(4);function ws(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=ru[s];if(r===void 0&&(r=new Float32Array(s),ru[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Re(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ce(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function qo(i,t){let e=ou[t];e===void 0&&(e=new Int32Array(t),ou[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function z1(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function k1(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;i.uniform2fv(this.addr,t),Ce(e,t)}}function B1(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Re(e,t))return;i.uniform3fv(this.addr,t),Ce(e,t)}}function H1(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;i.uniform4fv(this.addr,t),Ce(e,t)}}function G1(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ce(e,t)}else{if(Re(e,n))return;lu.set(n),i.uniformMatrix2fv(this.addr,!1,lu),Ce(e,n)}}function V1(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ce(e,t)}else{if(Re(e,n))return;cu.set(n),i.uniformMatrix3fv(this.addr,!1,cu),Ce(e,n)}}function W1(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ce(e,t)}else{if(Re(e,n))return;au.set(n),i.uniformMatrix4fv(this.addr,!1,au),Ce(e,n)}}function X1(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function q1(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;i.uniform2iv(this.addr,t),Ce(e,t)}}function Y1(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;i.uniform3iv(this.addr,t),Ce(e,t)}}function $1(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;i.uniform4iv(this.addr,t),Ce(e,t)}}function Z1(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function K1(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;i.uniform2uiv(this.addr,t),Ce(e,t)}}function j1(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;i.uniform3uiv(this.addr,t),Ce(e,t)}}function J1(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;i.uniform4uiv(this.addr,t),Ce(e,t)}}function Q1(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(su.compareFunction=xf,r=su):r=Lf,e.setTexture2D(t||r,s)}function ty(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Df,s)}function ey(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Nf,s)}function ny(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||If,s)}function iy(i){switch(i){case 5126:return z1;case 35664:return k1;case 35665:return B1;case 35666:return H1;case 35674:return G1;case 35675:return V1;case 35676:return W1;case 5124:case 35670:return X1;case 35667:case 35671:return q1;case 35668:case 35672:return Y1;case 35669:case 35673:return $1;case 5125:return Z1;case 36294:return K1;case 36295:return j1;case 36296:return J1;case 35678:case 36198:case 36298:case 36306:case 35682:return Q1;case 35679:case 36299:case 36307:return ty;case 35680:case 36300:case 36308:case 36293:return ey;case 36289:case 36303:case 36311:case 36292:return ny}}function sy(i,t){i.uniform1fv(this.addr,t)}function ry(i,t){const e=ws(t,this.size,2);i.uniform2fv(this.addr,e)}function oy(i,t){const e=ws(t,this.size,3);i.uniform3fv(this.addr,e)}function ay(i,t){const e=ws(t,this.size,4);i.uniform4fv(this.addr,e)}function cy(i,t){const e=ws(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function ly(i,t){const e=ws(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function hy(i,t){const e=ws(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function uy(i,t){i.uniform1iv(this.addr,t)}function dy(i,t){i.uniform2iv(this.addr,t)}function fy(i,t){i.uniform3iv(this.addr,t)}function py(i,t){i.uniform4iv(this.addr,t)}function my(i,t){i.uniform1uiv(this.addr,t)}function gy(i,t){i.uniform2uiv(this.addr,t)}function vy(i,t){i.uniform3uiv(this.addr,t)}function yy(i,t){i.uniform4uiv(this.addr,t)}function _y(i,t,e){const n=this.cache,s=t.length,r=qo(e,s);Re(n,r)||(i.uniform1iv(this.addr,r),Ce(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Lf,r[o])}function xy(i,t,e){const n=this.cache,s=t.length,r=qo(e,s);Re(n,r)||(i.uniform1iv(this.addr,r),Ce(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Df,r[o])}function wy(i,t,e){const n=this.cache,s=t.length,r=qo(e,s);Re(n,r)||(i.uniform1iv(this.addr,r),Ce(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Nf,r[o])}function My(i,t,e){const n=this.cache,s=t.length,r=qo(e,s);Re(n,r)||(i.uniform1iv(this.addr,r),Ce(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||If,r[o])}function by(i){switch(i){case 5126:return sy;case 35664:return ry;case 35665:return oy;case 35666:return ay;case 35674:return cy;case 35675:return ly;case 35676:return hy;case 5124:case 35670:return uy;case 35667:case 35671:return dy;case 35668:case 35672:return fy;case 35669:case 35673:return py;case 5125:return my;case 36294:return gy;case 36295:return vy;case 36296:return yy;case 35678:case 36198:case 36298:case 36306:case 35682:return _y;case 35679:case 36299:case 36307:return xy;case 35680:case 36300:case 36308:case 36293:return wy;case 36289:case 36303:case 36311:case 36292:return My}}class Sy{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=iy(e.type)}}class Ey{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=by(e.type)}}class Ty{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const Ra=/(\w+)(\])?(\[|\.)?/g;function hu(i,t){i.seq.push(t),i.map[t.id]=t}function Ay(i,t,e){const n=i.name,s=n.length;for(Ra.lastIndex=0;;){const r=Ra.exec(n),o=Ra.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){hu(e,l===void 0?new Sy(a,i,t):new Ey(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new Ty(a),hu(e,u)),e=u}}}class Mo{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);Ay(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function uu(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Ry=37297;let Cy=0;function Py(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const du=new Yt;function Ly(i){ie._getMatrix(du,ie.workingColorSpace,i);const t=`mat3( ${du.elements.map(e=>e.toFixed(4))} )`;switch(ie.getTransfer(i)){case Vo:return[t,"LinearTransferOETF"];case le:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function fu(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+Py(i.getShaderSource(t),o)}else return s}function Iy(i,t){const e=Ly(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Dy(i,t){let e;switch(t){case sf:e="Linear";break;case rf:e="Reinhard";break;case of:e="Cineon";break;case af:e="ACESFilmic";break;case cf:e="AgX";break;case lf:e="Neutral";break;case H0:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const zr=new C;function Ny(){ie.getLuminanceCoefficients(zr);const i=zr.x.toFixed(4),t=zr.y.toFixed(4),e=zr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Uy(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ws).join(`
`)}function Fy(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Oy(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Ws(i){return i!==""}function pu(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function mu(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const zy=/^[ \t]*#include +<([\w\d./]+)>/gm;function ul(i){return i.replace(zy,By)}const ky=new Map;function By(i,t){let e=Zt[t];if(e===void 0){const n=ky.get(t);if(n!==void 0)e=Zt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return ul(e)}const Hy=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function gu(i){return i.replace(Hy,Gy)}function Gy(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function vu(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Vy(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===ef?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===nf?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Fn&&(t="SHADOWMAP_TYPE_VSM"),t}function Wy(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ls:case hs:t="ENVMAP_TYPE_CUBE";break;case Go:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Xy(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case hs:t="ENVMAP_MODE_REFRACTION";break}return t}function qy(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case zl:t="ENVMAP_BLENDING_MULTIPLY";break;case k0:t="ENVMAP_BLENDING_MIX";break;case B0:t="ENVMAP_BLENDING_ADD";break}return t}function Yy(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function $y(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=Vy(e),l=Wy(e),h=Xy(e),u=qy(e),f=Yy(e),d=Uy(e),m=Fy(r),v=s.createProgram();let g,p,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Ws).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Ws).join(`
`),p.length>0&&(p+=`
`)):(g=[vu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ws).join(`
`),p=[vu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ei?"#define TONE_MAPPING":"",e.toneMapping!==ei?Zt.tonemapping_pars_fragment:"",e.toneMapping!==ei?Dy("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Zt.colorspace_pars_fragment,Iy("linearToOutputTexel",e.outputColorSpace),Ny(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ws).join(`
`)),o=ul(o),o=pu(o,e),o=mu(o,e),a=ul(a),a=pu(a,e),a=mu(a,e),o=gu(o),a=gu(a),e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===Ch?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ch?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const y=_+g+o,x=_+p+a,b=uu(s,s.VERTEX_SHADER,y),S=uu(s,s.FRAGMENT_SHADER,x);s.attachShader(v,b),s.attachShader(v,S),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function E(A){if(i.debug.checkShaderErrors){const N=s.getProgramInfoLog(v).trim(),L=s.getShaderInfoLog(b).trim(),U=s.getShaderInfoLog(S).trim();let F=!0,D=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(F=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,b,S);else{const H=fu(s,b,"vertex"),k=fu(s,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+N+`
`+H+`
`+k)}else N!==""?console.warn("THREE.WebGLProgram: Program Info Log:",N):(L===""||U==="")&&(D=!1);D&&(A.diagnostics={runnable:F,programLog:N,vertexShader:{log:L,prefix:g},fragmentShader:{log:U,prefix:p}})}s.deleteShader(b),s.deleteShader(S),T=new Mo(s,v),M=Oy(s,v)}let T;this.getUniforms=function(){return T===void 0&&E(this),T};let M;this.getAttributes=function(){return M===void 0&&E(this),M};let w=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return w===!1&&(w=s.getProgramParameter(v,Ry)),w},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Cy++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=b,this.fragmentShader=S,this}let Zy=0;class Ky{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new jy(t),e.set(t,n)),n}}class jy{constructor(t){this.id=Zy++,this.code=t,this.usedTimes=0}}function Jy(i,t,e,n,s,r,o){const a=new Wo,c=new Ky,l=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures;let d=s.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(M){return l.add(M),M===0?"uv":`uv${M}`}function g(M,w,A,N,L){const U=N.fog,F=L.geometry,D=M.isMeshStandardMaterial?N.environment:null,H=(M.isMeshStandardMaterial?e:t).get(M.envMap||D),k=H&&H.mapping===Go?H.image.height:null,Y=m[M.type];M.precision!==null&&(d=s.getMaxPrecision(M.precision),d!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",d,"instead."));const rt=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,ft=rt!==void 0?rt.length:0;let Ft=0;F.morphAttributes.position!==void 0&&(Ft=1),F.morphAttributes.normal!==void 0&&(Ft=2),F.morphAttributes.color!==void 0&&(Ft=3);let te,J,at,St;if(Y){const ce=gn[Y];te=ce.vertexShader,J=ce.fragmentShader}else te=M.vertexShader,J=M.fragmentShader,c.update(M),at=c.getVertexShaderID(M),St=c.getFragmentShaderID(M);const ht=i.getRenderTarget(),Nt=i.state.buffers.depth.getReversed(),kt=L.isInstancedMesh===!0,Ot=L.isBatchedMesh===!0,Jt=!!M.map,nt=!!M.matcap,lt=!!H,O=!!M.aoMap,yt=!!M.lightMap,ot=!!M.bumpMap,pt=!!M.normalMap,ut=!!M.displacementMap,zt=!!M.emissiveMap,Mt=!!M.metalnessMap,I=!!M.roughnessMap,R=M.anisotropy>0,q=M.clearcoat>0,Q=M.dispersion>0,st=M.iridescence>0,tt=M.sheen>0,Ct=M.transmission>0,gt=R&&!!M.anisotropyMap,bt=q&&!!M.clearcoatMap,Qt=q&&!!M.clearcoatNormalMap,ct=q&&!!M.clearcoatRoughnessMap,Et=st&&!!M.iridescenceMap,Bt=st&&!!M.iridescenceThicknessMap,Ht=tt&&!!M.sheenColorMap,Tt=tt&&!!M.sheenRoughnessMap,ne=!!M.specularMap,$t=!!M.specularColorMap,de=!!M.specularIntensityMap,G=Ct&&!!M.transmissionMap,vt=Ct&&!!M.thicknessMap,j=!!M.gradientMap,it=!!M.alphaMap,wt=M.alphaTest>0,_t=!!M.alphaHash,Xt=!!M.extensions;let xe=ei;M.toneMapped&&(ht===null||ht.isXRRenderTarget===!0)&&(xe=i.toneMapping);const De={shaderID:Y,shaderType:M.type,shaderName:M.name,vertexShader:te,fragmentShader:J,defines:M.defines,customVertexShaderID:at,customFragmentShaderID:St,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:d,batching:Ot,batchingColor:Ot&&L._colorsTexture!==null,instancing:kt,instancingColor:kt&&L.instanceColor!==null,instancingMorph:kt&&L.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ht===null?i.outputColorSpace:ht.isXRRenderTarget===!0?ht.texture.colorSpace:ys,alphaToCoverage:!!M.alphaToCoverage,map:Jt,matcap:nt,envMap:lt,envMapMode:lt&&H.mapping,envMapCubeUVHeight:k,aoMap:O,lightMap:yt,bumpMap:ot,normalMap:pt,displacementMap:f&&ut,emissiveMap:zt,normalMapObjectSpace:pt&&M.normalMapType===X0,normalMapTangentSpace:pt&&M.normalMapType===ql,metalnessMap:Mt,roughnessMap:I,anisotropy:R,anisotropyMap:gt,clearcoat:q,clearcoatMap:bt,clearcoatNormalMap:Qt,clearcoatRoughnessMap:ct,dispersion:Q,iridescence:st,iridescenceMap:Et,iridescenceThicknessMap:Bt,sheen:tt,sheenColorMap:Ht,sheenRoughnessMap:Tt,specularMap:ne,specularColorMap:$t,specularIntensityMap:de,transmission:Ct,transmissionMap:G,thicknessMap:vt,gradientMap:j,opaque:M.transparent===!1&&M.blending===rs&&M.alphaToCoverage===!1,alphaMap:it,alphaTest:wt,alphaHash:_t,combine:M.combine,mapUv:Jt&&v(M.map.channel),aoMapUv:O&&v(M.aoMap.channel),lightMapUv:yt&&v(M.lightMap.channel),bumpMapUv:ot&&v(M.bumpMap.channel),normalMapUv:pt&&v(M.normalMap.channel),displacementMapUv:ut&&v(M.displacementMap.channel),emissiveMapUv:zt&&v(M.emissiveMap.channel),metalnessMapUv:Mt&&v(M.metalnessMap.channel),roughnessMapUv:I&&v(M.roughnessMap.channel),anisotropyMapUv:gt&&v(M.anisotropyMap.channel),clearcoatMapUv:bt&&v(M.clearcoatMap.channel),clearcoatNormalMapUv:Qt&&v(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ct&&v(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Et&&v(M.iridescenceMap.channel),iridescenceThicknessMapUv:Bt&&v(M.iridescenceThicknessMap.channel),sheenColorMapUv:Ht&&v(M.sheenColorMap.channel),sheenRoughnessMapUv:Tt&&v(M.sheenRoughnessMap.channel),specularMapUv:ne&&v(M.specularMap.channel),specularColorMapUv:$t&&v(M.specularColorMap.channel),specularIntensityMapUv:de&&v(M.specularIntensityMap.channel),transmissionMapUv:G&&v(M.transmissionMap.channel),thicknessMapUv:vt&&v(M.thicknessMap.channel),alphaMapUv:it&&v(M.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(pt||R),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!F.attributes.uv&&(Jt||it),fog:!!U,useFog:M.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:Nt,skinning:L.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:ft,morphTextureStride:Ft,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&A.length>0,shadowMapType:i.shadowMap.type,toneMapping:xe,decodeVideoTexture:Jt&&M.map.isVideoTexture===!0&&ie.getTransfer(M.map.colorSpace)===le,decodeVideoTextureEmissive:zt&&M.emissiveMap.isVideoTexture===!0&&ie.getTransfer(M.emissiveMap.colorSpace)===le,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===hn,flipSided:M.side===Be,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Xt&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Xt&&M.extensions.multiDraw===!0||Ot)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return De.vertexUv1s=l.has(1),De.vertexUv2s=l.has(2),De.vertexUv3s=l.has(3),l.clear(),De}function p(M){const w=[];if(M.shaderID?w.push(M.shaderID):(w.push(M.customVertexShaderID),w.push(M.customFragmentShaderID)),M.defines!==void 0)for(const A in M.defines)w.push(A),w.push(M.defines[A]);return M.isRawShaderMaterial===!1&&(_(w,M),y(w,M),w.push(i.outputColorSpace)),w.push(M.customProgramCacheKey),w.join()}function _(M,w){M.push(w.precision),M.push(w.outputColorSpace),M.push(w.envMapMode),M.push(w.envMapCubeUVHeight),M.push(w.mapUv),M.push(w.alphaMapUv),M.push(w.lightMapUv),M.push(w.aoMapUv),M.push(w.bumpMapUv),M.push(w.normalMapUv),M.push(w.displacementMapUv),M.push(w.emissiveMapUv),M.push(w.metalnessMapUv),M.push(w.roughnessMapUv),M.push(w.anisotropyMapUv),M.push(w.clearcoatMapUv),M.push(w.clearcoatNormalMapUv),M.push(w.clearcoatRoughnessMapUv),M.push(w.iridescenceMapUv),M.push(w.iridescenceThicknessMapUv),M.push(w.sheenColorMapUv),M.push(w.sheenRoughnessMapUv),M.push(w.specularMapUv),M.push(w.specularColorMapUv),M.push(w.specularIntensityMapUv),M.push(w.transmissionMapUv),M.push(w.thicknessMapUv),M.push(w.combine),M.push(w.fogExp2),M.push(w.sizeAttenuation),M.push(w.morphTargetsCount),M.push(w.morphAttributeCount),M.push(w.numDirLights),M.push(w.numPointLights),M.push(w.numSpotLights),M.push(w.numSpotLightMaps),M.push(w.numHemiLights),M.push(w.numRectAreaLights),M.push(w.numDirLightShadows),M.push(w.numPointLightShadows),M.push(w.numSpotLightShadows),M.push(w.numSpotLightShadowsWithMaps),M.push(w.numLightProbes),M.push(w.shadowMapType),M.push(w.toneMapping),M.push(w.numClippingPlanes),M.push(w.numClipIntersection),M.push(w.depthPacking)}function y(M,w){a.disableAll(),w.supportsVertexTextures&&a.enable(0),w.instancing&&a.enable(1),w.instancingColor&&a.enable(2),w.instancingMorph&&a.enable(3),w.matcap&&a.enable(4),w.envMap&&a.enable(5),w.normalMapObjectSpace&&a.enable(6),w.normalMapTangentSpace&&a.enable(7),w.clearcoat&&a.enable(8),w.iridescence&&a.enable(9),w.alphaTest&&a.enable(10),w.vertexColors&&a.enable(11),w.vertexAlphas&&a.enable(12),w.vertexUv1s&&a.enable(13),w.vertexUv2s&&a.enable(14),w.vertexUv3s&&a.enable(15),w.vertexTangents&&a.enable(16),w.anisotropy&&a.enable(17),w.alphaHash&&a.enable(18),w.batching&&a.enable(19),w.dispersion&&a.enable(20),w.batchingColor&&a.enable(21),M.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reverseDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.decodeVideoTextureEmissive&&a.enable(20),w.alphaToCoverage&&a.enable(21),M.push(a.mask)}function x(M){const w=m[M.type];let A;if(w){const N=gn[w];A=Xo.clone(N.uniforms)}else A=M.uniforms;return A}function b(M,w){let A;for(let N=0,L=h.length;N<L;N++){const U=h[N];if(U.cacheKey===w){A=U,++A.usedTimes;break}}return A===void 0&&(A=new $y(i,w,M,r),h.push(A)),A}function S(M){if(--M.usedTimes===0){const w=h.indexOf(M);h[w]=h[h.length-1],h.pop(),M.destroy()}}function E(M){c.remove(M)}function T(){c.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:x,acquireProgram:b,releaseProgram:S,releaseShaderCache:E,programs:h,dispose:T}}function Qy(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function t_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function yu(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function _u(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,f,d,m,v,g){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:m,renderOrder:u.renderOrder,z:v,group:g},i[t]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=v,p.group=g),t++,p}function a(u,f,d,m,v,g){const p=o(u,f,d,m,v,g);d.transmission>0?n.push(p):d.transparent===!0?s.push(p):e.push(p)}function c(u,f,d,m,v,g){const p=o(u,f,d,m,v,g);d.transmission>0?n.unshift(p):d.transparent===!0?s.unshift(p):e.unshift(p)}function l(u,f){e.length>1&&e.sort(u||t_),n.length>1&&n.sort(f||yu),s.length>1&&s.sort(f||yu)}function h(){for(let u=t,f=i.length;u<f;u++){const d=i[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function e_(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new _u,i.set(n,[o])):s>=r.length?(o=new _u,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function n_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new Vt};break;case"SpotLight":e={position:new C,direction:new C,color:new Vt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new Vt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new Vt,groundColor:new Vt};break;case"RectAreaLight":e={color:new Vt,position:new C,halfWidth:new C,halfHeight:new C};break}return i[t.id]=e,e}}}function i_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new et};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new et};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new et,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let s_=0;function r_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function o_(i){const t=new n_,e=i_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new C);const s=new C,r=new ue,o=new ue;function a(l){let h=0,u=0,f=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let d=0,m=0,v=0,g=0,p=0,_=0,y=0,x=0,b=0,S=0,E=0;l.sort(r_);for(let M=0,w=l.length;M<w;M++){const A=l[M],N=A.color,L=A.intensity,U=A.distance,F=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)h+=N.r*L,u+=N.g*L,f+=N.b*L;else if(A.isLightProbe){for(let D=0;D<9;D++)n.probe[D].addScaledVector(A.sh.coefficients[D],L);E++}else if(A.isDirectionalLight){const D=t.get(A);if(D.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const H=A.shadow,k=e.get(A);k.shadowIntensity=H.intensity,k.shadowBias=H.bias,k.shadowNormalBias=H.normalBias,k.shadowRadius=H.radius,k.shadowMapSize=H.mapSize,n.directionalShadow[d]=k,n.directionalShadowMap[d]=F,n.directionalShadowMatrix[d]=A.shadow.matrix,_++}n.directional[d]=D,d++}else if(A.isSpotLight){const D=t.get(A);D.position.setFromMatrixPosition(A.matrixWorld),D.color.copy(N).multiplyScalar(L),D.distance=U,D.coneCos=Math.cos(A.angle),D.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),D.decay=A.decay,n.spot[v]=D;const H=A.shadow;if(A.map&&(n.spotLightMap[b]=A.map,b++,H.updateMatrices(A),A.castShadow&&S++),n.spotLightMatrix[v]=H.matrix,A.castShadow){const k=e.get(A);k.shadowIntensity=H.intensity,k.shadowBias=H.bias,k.shadowNormalBias=H.normalBias,k.shadowRadius=H.radius,k.shadowMapSize=H.mapSize,n.spotShadow[v]=k,n.spotShadowMap[v]=F,x++}v++}else if(A.isRectAreaLight){const D=t.get(A);D.color.copy(N).multiplyScalar(L),D.halfWidth.set(A.width*.5,0,0),D.halfHeight.set(0,A.height*.5,0),n.rectArea[g]=D,g++}else if(A.isPointLight){const D=t.get(A);if(D.color.copy(A.color).multiplyScalar(A.intensity),D.distance=A.distance,D.decay=A.decay,A.castShadow){const H=A.shadow,k=e.get(A);k.shadowIntensity=H.intensity,k.shadowBias=H.bias,k.shadowNormalBias=H.normalBias,k.shadowRadius=H.radius,k.shadowMapSize=H.mapSize,k.shadowCameraNear=H.camera.near,k.shadowCameraFar=H.camera.far,n.pointShadow[m]=k,n.pointShadowMap[m]=F,n.pointShadowMatrix[m]=A.shadow.matrix,y++}n.point[m]=D,m++}else if(A.isHemisphereLight){const D=t.get(A);D.skyColor.copy(A.color).multiplyScalar(L),D.groundColor.copy(A.groundColor).multiplyScalar(L),n.hemi[p]=D,p++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=mt.LTC_FLOAT_1,n.rectAreaLTC2=mt.LTC_FLOAT_2):(n.rectAreaLTC1=mt.LTC_HALF_1,n.rectAreaLTC2=mt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;const T=n.hash;(T.directionalLength!==d||T.pointLength!==m||T.spotLength!==v||T.rectAreaLength!==g||T.hemiLength!==p||T.numDirectionalShadows!==_||T.numPointShadows!==y||T.numSpotShadows!==x||T.numSpotMaps!==b||T.numLightProbes!==E)&&(n.directional.length=d,n.spot.length=v,n.rectArea.length=g,n.point.length=m,n.hemi.length=p,n.directionalShadow.length=_,n.directionalShadowMap.length=_,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=_,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=x+b-S,n.spotLightMap.length=b,n.numSpotLightShadowsWithMaps=S,n.numLightProbes=E,T.directionalLength=d,T.pointLength=m,T.spotLength=v,T.rectAreaLength=g,T.hemiLength=p,T.numDirectionalShadows=_,T.numPointShadows=y,T.numSpotShadows=x,T.numSpotMaps=b,T.numLightProbes=E,n.version=s_++)}function c(l,h){let u=0,f=0,d=0,m=0,v=0;const g=h.matrixWorldInverse;for(let p=0,_=l.length;p<_;p++){const y=l[p];if(y.isDirectionalLight){const x=n.directional[u];x.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(g),u++}else if(y.isSpotLight){const x=n.spot[d];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(g),x.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(g),d++}else if(y.isRectAreaLight){const x=n.rectArea[m];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(g),o.identity(),r.copy(y.matrixWorld),r.premultiply(g),o.extractRotation(r),x.halfWidth.set(y.width*.5,0,0),x.halfHeight.set(0,y.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),m++}else if(y.isPointLight){const x=n.point[f];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(g),f++}else if(y.isHemisphereLight){const x=n.hemi[v];x.direction.setFromMatrixPosition(y.matrixWorld),x.direction.transformDirection(g),v++}}}return{setup:a,setupView:c,state:n}}function xu(i){const t=new o_(i),e=[],n=[];function s(h){l.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function a_(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new xu(i),t.set(s,[a])):r>=o.length?(a=new xu(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class c_ extends ci{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=V0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class l_ extends ci{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const h_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,u_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function d_(i,t,e){let n=new $l;const s=new et,r=new et,o=new he,a=new c_({depthPacking:W0}),c=new l_,l={},h=e.maxTextureSize,u={[ni]:Be,[Be]:ni,[hn]:hn},f=new Je({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new et},radius:{value:4}},vertexShader:h_,fragmentShader:u_}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const m=new Pe;m.setAttribute("position",new qe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Kt(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ef;let p=this.type;this.render=function(S,E,T){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;const M=i.getRenderTarget(),w=i.getActiveCubeFace(),A=i.getActiveMipmapLevel(),N=i.state;N.setBlending(Hn),N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const L=p!==Fn&&this.type===Fn,U=p===Fn&&this.type!==Fn;for(let F=0,D=S.length;F<D;F++){const H=S[F],k=H.shadow;if(k===void 0){console.warn("THREE.WebGLShadowMap:",H,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;s.copy(k.mapSize);const Y=k.getFrameExtents();if(s.multiply(Y),r.copy(k.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Y.x),s.x=r.x*Y.x,k.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Y.y),s.y=r.y*Y.y,k.mapSize.y=r.y)),k.map===null||L===!0||U===!0){const ft=this.type!==Fn?{minFilter:Ae,magFilter:Ae}:{};k.map!==null&&k.map.dispose(),k.map=new wn(s.x,s.y,ft),k.map.texture.name=H.name+".shadowMap",k.camera.updateProjectionMatrix()}i.setRenderTarget(k.map),i.clear();const rt=k.getViewportCount();for(let ft=0;ft<rt;ft++){const Ft=k.getViewport(ft);o.set(r.x*Ft.x,r.y*Ft.y,r.x*Ft.z,r.y*Ft.w),N.viewport(o),k.updateMatrices(H,ft),n=k.getFrustum(),x(E,T,k.camera,H,this.type)}k.isPointLightShadow!==!0&&this.type===Fn&&_(k,T),k.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(M,w,A)};function _(S,E){const T=t.update(v);f.defines.VSM_SAMPLES!==S.blurSamples&&(f.defines.VSM_SAMPLES=S.blurSamples,d.defines.VSM_SAMPLES=S.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new wn(s.x,s.y)),f.uniforms.shadow_pass.value=S.map.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(E,null,T,f,v,null),d.uniforms.shadow_pass.value=S.mapPass.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(E,null,T,d,v,null)}function y(S,E,T,M){let w=null;const A=T.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(A!==void 0)w=A;else if(w=T.isPointLight===!0?c:a,i.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const N=w.uuid,L=E.uuid;let U=l[N];U===void 0&&(U={},l[N]=U);let F=U[L];F===void 0&&(F=w.clone(),U[L]=F,E.addEventListener("dispose",b)),w=F}if(w.visible=E.visible,w.wireframe=E.wireframe,M===Fn?w.side=E.shadowSide!==null?E.shadowSide:E.side:w.side=E.shadowSide!==null?E.shadowSide:u[E.side],w.alphaMap=E.alphaMap,w.alphaTest=E.alphaTest,w.map=E.map,w.clipShadows=E.clipShadows,w.clippingPlanes=E.clippingPlanes,w.clipIntersection=E.clipIntersection,w.displacementMap=E.displacementMap,w.displacementScale=E.displacementScale,w.displacementBias=E.displacementBias,w.wireframeLinewidth=E.wireframeLinewidth,w.linewidth=E.linewidth,T.isPointLight===!0&&w.isMeshDistanceMaterial===!0){const N=i.properties.get(w);N.light=T}return w}function x(S,E,T,M,w){if(S.visible===!1)return;if(S.layers.test(E.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&w===Fn)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,S.matrixWorld);const L=t.update(S),U=S.material;if(Array.isArray(U)){const F=L.groups;for(let D=0,H=F.length;D<H;D++){const k=F[D],Y=U[k.materialIndex];if(Y&&Y.visible){const rt=y(S,Y,M,w);S.onBeforeShadow(i,S,E,T,L,rt,k),i.renderBufferDirect(T,null,L,rt,S,k),S.onAfterShadow(i,S,E,T,L,rt,k)}}}else if(U.visible){const F=y(S,U,M,w);S.onBeforeShadow(i,S,E,T,L,F,null),i.renderBufferDirect(T,null,L,F,S,null),S.onAfterShadow(i,S,E,T,L,F,null)}}const N=S.children;for(let L=0,U=N.length;L<U;L++)x(N[L],E,T,M,w)}function b(S){S.target.removeEventListener("dispose",b);for(const T in l){const M=l[T],w=S.target.uuid;w in M&&(M[w].dispose(),delete M[w])}}}const f_={[Cc]:Pc,[Lc]:Nc,[Ic]:Uc,[cs]:Dc,[Pc]:Cc,[Nc]:Lc,[Uc]:Ic,[Dc]:cs};function p_(i,t){function e(){let G=!1;const vt=new he;let j=null;const it=new he(0,0,0,0);return{setMask:function(wt){j!==wt&&!G&&(i.colorMask(wt,wt,wt,wt),j=wt)},setLocked:function(wt){G=wt},setClear:function(wt,_t,Xt,xe,De){De===!0&&(wt*=xe,_t*=xe,Xt*=xe),vt.set(wt,_t,Xt,xe),it.equals(vt)===!1&&(i.clearColor(wt,_t,Xt,xe),it.copy(vt))},reset:function(){G=!1,j=null,it.set(-1,0,0,0)}}}function n(){let G=!1,vt=!1,j=null,it=null,wt=null;return{setReversed:function(_t){if(vt!==_t){const Xt=t.get("EXT_clip_control");vt?Xt.clipControlEXT(Xt.LOWER_LEFT_EXT,Xt.ZERO_TO_ONE_EXT):Xt.clipControlEXT(Xt.LOWER_LEFT_EXT,Xt.NEGATIVE_ONE_TO_ONE_EXT);const xe=wt;wt=null,this.setClear(xe)}vt=_t},getReversed:function(){return vt},setTest:function(_t){_t?ht(i.DEPTH_TEST):Nt(i.DEPTH_TEST)},setMask:function(_t){j!==_t&&!G&&(i.depthMask(_t),j=_t)},setFunc:function(_t){if(vt&&(_t=f_[_t]),it!==_t){switch(_t){case Cc:i.depthFunc(i.NEVER);break;case Pc:i.depthFunc(i.ALWAYS);break;case Lc:i.depthFunc(i.LESS);break;case cs:i.depthFunc(i.LEQUAL);break;case Ic:i.depthFunc(i.EQUAL);break;case Dc:i.depthFunc(i.GEQUAL);break;case Nc:i.depthFunc(i.GREATER);break;case Uc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}it=_t}},setLocked:function(_t){G=_t},setClear:function(_t){wt!==_t&&(vt&&(_t=1-_t),i.clearDepth(_t),wt=_t)},reset:function(){G=!1,j=null,it=null,wt=null,vt=!1}}}function s(){let G=!1,vt=null,j=null,it=null,wt=null,_t=null,Xt=null,xe=null,De=null;return{setTest:function(ce){G||(ce?ht(i.STENCIL_TEST):Nt(i.STENCIL_TEST))},setMask:function(ce){vt!==ce&&!G&&(i.stencilMask(ce),vt=ce)},setFunc:function(ce,rn,An){(j!==ce||it!==rn||wt!==An)&&(i.stencilFunc(ce,rn,An),j=ce,it=rn,wt=An)},setOp:function(ce,rn,An){(_t!==ce||Xt!==rn||xe!==An)&&(i.stencilOp(ce,rn,An),_t=ce,Xt=rn,xe=An)},setLocked:function(ce){G=ce},setClear:function(ce){De!==ce&&(i.clearStencil(ce),De=ce)},reset:function(){G=!1,vt=null,j=null,it=null,wt=null,_t=null,Xt=null,xe=null,De=null}}}const r=new e,o=new n,a=new s,c=new WeakMap,l=new WeakMap;let h={},u={},f=new WeakMap,d=[],m=null,v=!1,g=null,p=null,_=null,y=null,x=null,b=null,S=null,E=new Vt(0,0,0),T=0,M=!1,w=null,A=null,N=null,L=null,U=null;const F=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let D=!1,H=0;const k=i.getParameter(i.VERSION);k.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(k)[1]),D=H>=1):k.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),D=H>=2);let Y=null,rt={};const ft=i.getParameter(i.SCISSOR_BOX),Ft=i.getParameter(i.VIEWPORT),te=new he().fromArray(ft),J=new he().fromArray(Ft);function at(G,vt,j,it){const wt=new Uint8Array(4),_t=i.createTexture();i.bindTexture(G,_t),i.texParameteri(G,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(G,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Xt=0;Xt<j;Xt++)G===i.TEXTURE_3D||G===i.TEXTURE_2D_ARRAY?i.texImage3D(vt,0,i.RGBA,1,1,it,0,i.RGBA,i.UNSIGNED_BYTE,wt):i.texImage2D(vt+Xt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,wt);return _t}const St={};St[i.TEXTURE_2D]=at(i.TEXTURE_2D,i.TEXTURE_2D,1),St[i.TEXTURE_CUBE_MAP]=at(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),St[i.TEXTURE_2D_ARRAY]=at(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),St[i.TEXTURE_3D]=at(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ht(i.DEPTH_TEST),o.setFunc(cs),ot(!1),pt(Sh),ht(i.CULL_FACE),O(Hn);function ht(G){h[G]!==!0&&(i.enable(G),h[G]=!0)}function Nt(G){h[G]!==!1&&(i.disable(G),h[G]=!1)}function kt(G,vt){return u[G]!==vt?(i.bindFramebuffer(G,vt),u[G]=vt,G===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=vt),G===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=vt),!0):!1}function Ot(G,vt){let j=d,it=!1;if(G){j=f.get(vt),j===void 0&&(j=[],f.set(vt,j));const wt=G.textures;if(j.length!==wt.length||j[0]!==i.COLOR_ATTACHMENT0){for(let _t=0,Xt=wt.length;_t<Xt;_t++)j[_t]=i.COLOR_ATTACHMENT0+_t;j.length=wt.length,it=!0}}else j[0]!==i.BACK&&(j[0]=i.BACK,it=!0);it&&i.drawBuffers(j)}function Jt(G){return m!==G?(i.useProgram(G),m=G,!0):!1}const nt={[xi]:i.FUNC_ADD,[M0]:i.FUNC_SUBTRACT,[b0]:i.FUNC_REVERSE_SUBTRACT};nt[S0]=i.MIN,nt[E0]=i.MAX;const lt={[T0]:i.ZERO,[A0]:i.ONE,[R0]:i.SRC_COLOR,[Ac]:i.SRC_ALPHA,[N0]:i.SRC_ALPHA_SATURATE,[I0]:i.DST_COLOR,[P0]:i.DST_ALPHA,[C0]:i.ONE_MINUS_SRC_COLOR,[Rc]:i.ONE_MINUS_SRC_ALPHA,[D0]:i.ONE_MINUS_DST_COLOR,[L0]:i.ONE_MINUS_DST_ALPHA,[U0]:i.CONSTANT_COLOR,[F0]:i.ONE_MINUS_CONSTANT_COLOR,[O0]:i.CONSTANT_ALPHA,[z0]:i.ONE_MINUS_CONSTANT_ALPHA};function O(G,vt,j,it,wt,_t,Xt,xe,De,ce){if(G===Hn){v===!0&&(Nt(i.BLEND),v=!1);return}if(v===!1&&(ht(i.BLEND),v=!0),G!==w0){if(G!==g||ce!==M){if((p!==xi||x!==xi)&&(i.blendEquation(i.FUNC_ADD),p=xi,x=xi),ce)switch(G){case rs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Tc:i.blendFunc(i.ONE,i.ONE);break;case Eh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Th:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",G);break}else switch(G){case rs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Tc:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Eh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Th:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",G);break}_=null,y=null,b=null,S=null,E.set(0,0,0),T=0,g=G,M=ce}return}wt=wt||vt,_t=_t||j,Xt=Xt||it,(vt!==p||wt!==x)&&(i.blendEquationSeparate(nt[vt],nt[wt]),p=vt,x=wt),(j!==_||it!==y||_t!==b||Xt!==S)&&(i.blendFuncSeparate(lt[j],lt[it],lt[_t],lt[Xt]),_=j,y=it,b=_t,S=Xt),(xe.equals(E)===!1||De!==T)&&(i.blendColor(xe.r,xe.g,xe.b,De),E.copy(xe),T=De),g=G,M=!1}function yt(G,vt){G.side===hn?Nt(i.CULL_FACE):ht(i.CULL_FACE);let j=G.side===Be;vt&&(j=!j),ot(j),G.blending===rs&&G.transparent===!1?O(Hn):O(G.blending,G.blendEquation,G.blendSrc,G.blendDst,G.blendEquationAlpha,G.blendSrcAlpha,G.blendDstAlpha,G.blendColor,G.blendAlpha,G.premultipliedAlpha),o.setFunc(G.depthFunc),o.setTest(G.depthTest),o.setMask(G.depthWrite),r.setMask(G.colorWrite);const it=G.stencilWrite;a.setTest(it),it&&(a.setMask(G.stencilWriteMask),a.setFunc(G.stencilFunc,G.stencilRef,G.stencilFuncMask),a.setOp(G.stencilFail,G.stencilZFail,G.stencilZPass)),zt(G.polygonOffset,G.polygonOffsetFactor,G.polygonOffsetUnits),G.alphaToCoverage===!0?ht(i.SAMPLE_ALPHA_TO_COVERAGE):Nt(i.SAMPLE_ALPHA_TO_COVERAGE)}function ot(G){w!==G&&(G?i.frontFace(i.CW):i.frontFace(i.CCW),w=G)}function pt(G){G!==_0?(ht(i.CULL_FACE),G!==A&&(G===Sh?i.cullFace(i.BACK):G===x0?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Nt(i.CULL_FACE),A=G}function ut(G){G!==N&&(D&&i.lineWidth(G),N=G)}function zt(G,vt,j){G?(ht(i.POLYGON_OFFSET_FILL),(L!==vt||U!==j)&&(i.polygonOffset(vt,j),L=vt,U=j)):Nt(i.POLYGON_OFFSET_FILL)}function Mt(G){G?ht(i.SCISSOR_TEST):Nt(i.SCISSOR_TEST)}function I(G){G===void 0&&(G=i.TEXTURE0+F-1),Y!==G&&(i.activeTexture(G),Y=G)}function R(G,vt,j){j===void 0&&(Y===null?j=i.TEXTURE0+F-1:j=Y);let it=rt[j];it===void 0&&(it={type:void 0,texture:void 0},rt[j]=it),(it.type!==G||it.texture!==vt)&&(Y!==j&&(i.activeTexture(j),Y=j),i.bindTexture(G,vt||St[G]),it.type=G,it.texture=vt)}function q(){const G=rt[Y];G!==void 0&&G.type!==void 0&&(i.bindTexture(G.type,null),G.type=void 0,G.texture=void 0)}function Q(){try{i.compressedTexImage2D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function st(){try{i.compressedTexImage3D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function tt(){try{i.texSubImage2D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Ct(){try{i.texSubImage3D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function gt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function bt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Qt(){try{i.texStorage2D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function ct(){try{i.texStorage3D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Et(){try{i.texImage2D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Bt(){try{i.texImage3D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Ht(G){te.equals(G)===!1&&(i.scissor(G.x,G.y,G.z,G.w),te.copy(G))}function Tt(G){J.equals(G)===!1&&(i.viewport(G.x,G.y,G.z,G.w),J.copy(G))}function ne(G,vt){let j=l.get(vt);j===void 0&&(j=new WeakMap,l.set(vt,j));let it=j.get(G);it===void 0&&(it=i.getUniformBlockIndex(vt,G.name),j.set(G,it))}function $t(G,vt){const it=l.get(vt).get(G);c.get(vt)!==it&&(i.uniformBlockBinding(vt,it,G.__bindingPointIndex),c.set(vt,it))}function de(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},Y=null,rt={},u={},f=new WeakMap,d=[],m=null,v=!1,g=null,p=null,_=null,y=null,x=null,b=null,S=null,E=new Vt(0,0,0),T=0,M=!1,w=null,A=null,N=null,L=null,U=null,te.set(0,0,i.canvas.width,i.canvas.height),J.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ht,disable:Nt,bindFramebuffer:kt,drawBuffers:Ot,useProgram:Jt,setBlending:O,setMaterial:yt,setFlipSided:ot,setCullFace:pt,setLineWidth:ut,setPolygonOffset:zt,setScissorTest:Mt,activeTexture:I,bindTexture:R,unbindTexture:q,compressedTexImage2D:Q,compressedTexImage3D:st,texImage2D:Et,texImage3D:Bt,updateUBOMapping:ne,uniformBlockBinding:$t,texStorage2D:Qt,texStorage3D:ct,texSubImage2D:tt,texSubImage3D:Ct,compressedTexSubImage2D:gt,compressedTexSubImage3D:bt,scissor:Ht,viewport:Tt,reset:de}}function wu(i,t,e,n){const s=m_(n);switch(e){case pf:return i*t;case gf:return i*t;case vf:return i*t*2;case Gl:return i*t/s.components*s.byteLength;case Vl:return i*t/s.components*s.byteLength;case yf:return i*t*2/s.components*s.byteLength;case Wl:return i*t*2/s.components*s.byteLength;case mf:return i*t*3/s.components*s.byteLength;case nn:return i*t*4/s.components*s.byteLength;case Xl:return i*t*4/s.components*s.byteLength;case vo:case yo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case _o:case xo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Bc:case Gc:return Math.max(i,16)*Math.max(t,8)/4;case kc:case Hc:return Math.max(i,8)*Math.max(t,8)/2;case Vc:case Wc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Xc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case qc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Yc:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case $c:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Zc:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Kc:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case jc:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Jc:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Qc:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case tl:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case el:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case nl:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case il:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case sl:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case rl:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case wo:case ol:case al:return Math.ceil(i/4)*Math.ceil(t/4)*16;case _f:case cl:return Math.ceil(i/4)*Math.ceil(t/4)*8;case ll:case hl:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function m_(i){switch(i){case Vn:case uf:return{byteLength:1,components:1};case er:case df:case ii:return{byteLength:2,components:1};case Bl:case Hl:return{byteLength:2,components:4};case Ai:case kl:case kn:return{byteLength:4,components:1};case ff:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function g_(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new et,h=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(I,R){return d?new OffscreenCanvas(I,R):To("canvas")}function v(I,R,q){let Q=1;const st=Mt(I);if((st.width>q||st.height>q)&&(Q=q/Math.max(st.width,st.height)),Q<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){const tt=Math.floor(Q*st.width),Ct=Math.floor(Q*st.height);u===void 0&&(u=m(tt,Ct));const gt=R?m(tt,Ct):u;return gt.width=tt,gt.height=Ct,gt.getContext("2d").drawImage(I,0,0,tt,Ct),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+st.width+"x"+st.height+") to ("+tt+"x"+Ct+")."),gt}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+st.width+"x"+st.height+")."),I;return I}function g(I){return I.generateMipmaps}function p(I){i.generateMipmap(I)}function _(I){return I.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?i.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(I,R,q,Q,st=!1){if(I!==null){if(i[I]!==void 0)return i[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let tt=R;if(R===i.RED&&(q===i.FLOAT&&(tt=i.R32F),q===i.HALF_FLOAT&&(tt=i.R16F),q===i.UNSIGNED_BYTE&&(tt=i.R8)),R===i.RED_INTEGER&&(q===i.UNSIGNED_BYTE&&(tt=i.R8UI),q===i.UNSIGNED_SHORT&&(tt=i.R16UI),q===i.UNSIGNED_INT&&(tt=i.R32UI),q===i.BYTE&&(tt=i.R8I),q===i.SHORT&&(tt=i.R16I),q===i.INT&&(tt=i.R32I)),R===i.RG&&(q===i.FLOAT&&(tt=i.RG32F),q===i.HALF_FLOAT&&(tt=i.RG16F),q===i.UNSIGNED_BYTE&&(tt=i.RG8)),R===i.RG_INTEGER&&(q===i.UNSIGNED_BYTE&&(tt=i.RG8UI),q===i.UNSIGNED_SHORT&&(tt=i.RG16UI),q===i.UNSIGNED_INT&&(tt=i.RG32UI),q===i.BYTE&&(tt=i.RG8I),q===i.SHORT&&(tt=i.RG16I),q===i.INT&&(tt=i.RG32I)),R===i.RGB_INTEGER&&(q===i.UNSIGNED_BYTE&&(tt=i.RGB8UI),q===i.UNSIGNED_SHORT&&(tt=i.RGB16UI),q===i.UNSIGNED_INT&&(tt=i.RGB32UI),q===i.BYTE&&(tt=i.RGB8I),q===i.SHORT&&(tt=i.RGB16I),q===i.INT&&(tt=i.RGB32I)),R===i.RGBA_INTEGER&&(q===i.UNSIGNED_BYTE&&(tt=i.RGBA8UI),q===i.UNSIGNED_SHORT&&(tt=i.RGBA16UI),q===i.UNSIGNED_INT&&(tt=i.RGBA32UI),q===i.BYTE&&(tt=i.RGBA8I),q===i.SHORT&&(tt=i.RGBA16I),q===i.INT&&(tt=i.RGBA32I)),R===i.RGB&&q===i.UNSIGNED_INT_5_9_9_9_REV&&(tt=i.RGB9_E5),R===i.RGBA){const Ct=st?Vo:ie.getTransfer(Q);q===i.FLOAT&&(tt=i.RGBA32F),q===i.HALF_FLOAT&&(tt=i.RGBA16F),q===i.UNSIGNED_BYTE&&(tt=Ct===le?i.SRGB8_ALPHA8:i.RGBA8),q===i.UNSIGNED_SHORT_4_4_4_4&&(tt=i.RGBA4),q===i.UNSIGNED_SHORT_5_5_5_1&&(tt=i.RGB5_A1)}return(tt===i.R16F||tt===i.R32F||tt===i.RG16F||tt===i.RG32F||tt===i.RGBA16F||tt===i.RGBA32F)&&t.get("EXT_color_buffer_float"),tt}function x(I,R){let q;return I?R===null||R===Ai||R===us?q=i.DEPTH24_STENCIL8:R===kn?q=i.DEPTH32F_STENCIL8:R===er&&(q=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):R===null||R===Ai||R===us?q=i.DEPTH_COMPONENT24:R===kn?q=i.DEPTH_COMPONENT32F:R===er&&(q=i.DEPTH_COMPONENT16),q}function b(I,R){return g(I)===!0||I.isFramebufferTexture&&I.minFilter!==Ae&&I.minFilter!==un?Math.log2(Math.max(R.width,R.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?R.mipmaps.length:1}function S(I){const R=I.target;R.removeEventListener("dispose",S),T(R),R.isVideoTexture&&h.delete(R)}function E(I){const R=I.target;R.removeEventListener("dispose",E),w(R)}function T(I){const R=n.get(I);if(R.__webglInit===void 0)return;const q=I.source,Q=f.get(q);if(Q){const st=Q[R.__cacheKey];st.usedTimes--,st.usedTimes===0&&M(I),Object.keys(Q).length===0&&f.delete(q)}n.remove(I)}function M(I){const R=n.get(I);i.deleteTexture(R.__webglTexture);const q=I.source,Q=f.get(q);delete Q[R.__cacheKey],o.memory.textures--}function w(I){const R=n.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),n.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(R.__webglFramebuffer[Q]))for(let st=0;st<R.__webglFramebuffer[Q].length;st++)i.deleteFramebuffer(R.__webglFramebuffer[Q][st]);else i.deleteFramebuffer(R.__webglFramebuffer[Q]);R.__webglDepthbuffer&&i.deleteRenderbuffer(R.__webglDepthbuffer[Q])}else{if(Array.isArray(R.__webglFramebuffer))for(let Q=0;Q<R.__webglFramebuffer.length;Q++)i.deleteFramebuffer(R.__webglFramebuffer[Q]);else i.deleteFramebuffer(R.__webglFramebuffer);if(R.__webglDepthbuffer&&i.deleteRenderbuffer(R.__webglDepthbuffer),R.__webglMultisampledFramebuffer&&i.deleteFramebuffer(R.__webglMultisampledFramebuffer),R.__webglColorRenderbuffer)for(let Q=0;Q<R.__webglColorRenderbuffer.length;Q++)R.__webglColorRenderbuffer[Q]&&i.deleteRenderbuffer(R.__webglColorRenderbuffer[Q]);R.__webglDepthRenderbuffer&&i.deleteRenderbuffer(R.__webglDepthRenderbuffer)}const q=I.textures;for(let Q=0,st=q.length;Q<st;Q++){const tt=n.get(q[Q]);tt.__webglTexture&&(i.deleteTexture(tt.__webglTexture),o.memory.textures--),n.remove(q[Q])}n.remove(I)}let A=0;function N(){A=0}function L(){const I=A;return I>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+s.maxTextures),A+=1,I}function U(I){const R=[];return R.push(I.wrapS),R.push(I.wrapT),R.push(I.wrapR||0),R.push(I.magFilter),R.push(I.minFilter),R.push(I.anisotropy),R.push(I.internalFormat),R.push(I.format),R.push(I.type),R.push(I.generateMipmaps),R.push(I.premultiplyAlpha),R.push(I.flipY),R.push(I.unpackAlignment),R.push(I.colorSpace),R.join()}function F(I,R){const q=n.get(I);if(I.isVideoTexture&&ut(I),I.isRenderTargetTexture===!1&&I.version>0&&q.__version!==I.version){const Q=I.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{J(q,I,R);return}}e.bindTexture(i.TEXTURE_2D,q.__webglTexture,i.TEXTURE0+R)}function D(I,R){const q=n.get(I);if(I.version>0&&q.__version!==I.version){J(q,I,R);return}e.bindTexture(i.TEXTURE_2D_ARRAY,q.__webglTexture,i.TEXTURE0+R)}function H(I,R){const q=n.get(I);if(I.version>0&&q.__version!==I.version){J(q,I,R);return}e.bindTexture(i.TEXTURE_3D,q.__webglTexture,i.TEXTURE0+R)}function k(I,R){const q=n.get(I);if(I.version>0&&q.__version!==I.version){at(q,I,R);return}e.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture,i.TEXTURE0+R)}const Y={[Ti]:i.REPEAT,[Mi]:i.CLAMP_TO_EDGE,[zc]:i.MIRRORED_REPEAT},rt={[Ae]:i.NEAREST,[G0]:i.NEAREST_MIPMAP_NEAREST,[yr]:i.NEAREST_MIPMAP_LINEAR,[un]:i.LINEAR,[na]:i.LINEAR_MIPMAP_NEAREST,[ti]:i.LINEAR_MIPMAP_LINEAR},ft={[q0]:i.NEVER,[J0]:i.ALWAYS,[Y0]:i.LESS,[xf]:i.LEQUAL,[$0]:i.EQUAL,[j0]:i.GEQUAL,[Z0]:i.GREATER,[K0]:i.NOTEQUAL};function Ft(I,R){if(R.type===kn&&t.has("OES_texture_float_linear")===!1&&(R.magFilter===un||R.magFilter===na||R.magFilter===yr||R.magFilter===ti||R.minFilter===un||R.minFilter===na||R.minFilter===yr||R.minFilter===ti)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(I,i.TEXTURE_WRAP_S,Y[R.wrapS]),i.texParameteri(I,i.TEXTURE_WRAP_T,Y[R.wrapT]),(I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY)&&i.texParameteri(I,i.TEXTURE_WRAP_R,Y[R.wrapR]),i.texParameteri(I,i.TEXTURE_MAG_FILTER,rt[R.magFilter]),i.texParameteri(I,i.TEXTURE_MIN_FILTER,rt[R.minFilter]),R.compareFunction&&(i.texParameteri(I,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(I,i.TEXTURE_COMPARE_FUNC,ft[R.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(R.magFilter===Ae||R.minFilter!==yr&&R.minFilter!==ti||R.type===kn&&t.has("OES_texture_float_linear")===!1)return;if(R.anisotropy>1||n.get(R).__currentAnisotropy){const q=t.get("EXT_texture_filter_anisotropic");i.texParameterf(I,q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(R.anisotropy,s.getMaxAnisotropy())),n.get(R).__currentAnisotropy=R.anisotropy}}}function te(I,R){let q=!1;I.__webglInit===void 0&&(I.__webglInit=!0,R.addEventListener("dispose",S));const Q=R.source;let st=f.get(Q);st===void 0&&(st={},f.set(Q,st));const tt=U(R);if(tt!==I.__cacheKey){st[tt]===void 0&&(st[tt]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,q=!0),st[tt].usedTimes++;const Ct=st[I.__cacheKey];Ct!==void 0&&(st[I.__cacheKey].usedTimes--,Ct.usedTimes===0&&M(R)),I.__cacheKey=tt,I.__webglTexture=st[tt].texture}return q}function J(I,R,q){let Q=i.TEXTURE_2D;(R.isDataArrayTexture||R.isCompressedArrayTexture)&&(Q=i.TEXTURE_2D_ARRAY),R.isData3DTexture&&(Q=i.TEXTURE_3D);const st=te(I,R),tt=R.source;e.bindTexture(Q,I.__webglTexture,i.TEXTURE0+q);const Ct=n.get(tt);if(tt.version!==Ct.__version||st===!0){e.activeTexture(i.TEXTURE0+q);const gt=ie.getPrimaries(ie.workingColorSpace),bt=R.colorSpace===zn?null:ie.getPrimaries(R.colorSpace),Qt=R.colorSpace===zn||gt===bt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,R.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,R.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Qt);let ct=v(R.image,!1,s.maxTextureSize);ct=zt(R,ct);const Et=r.convert(R.format,R.colorSpace),Bt=r.convert(R.type);let Ht=y(R.internalFormat,Et,Bt,R.colorSpace,R.isVideoTexture);Ft(Q,R);let Tt;const ne=R.mipmaps,$t=R.isVideoTexture!==!0,de=Ct.__version===void 0||st===!0,G=tt.dataReady,vt=b(R,ct);if(R.isDepthTexture)Ht=x(R.format===ds,R.type),de&&($t?e.texStorage2D(i.TEXTURE_2D,1,Ht,ct.width,ct.height):e.texImage2D(i.TEXTURE_2D,0,Ht,ct.width,ct.height,0,Et,Bt,null));else if(R.isDataTexture)if(ne.length>0){$t&&de&&e.texStorage2D(i.TEXTURE_2D,vt,Ht,ne[0].width,ne[0].height);for(let j=0,it=ne.length;j<it;j++)Tt=ne[j],$t?G&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,Tt.width,Tt.height,Et,Bt,Tt.data):e.texImage2D(i.TEXTURE_2D,j,Ht,Tt.width,Tt.height,0,Et,Bt,Tt.data);R.generateMipmaps=!1}else $t?(de&&e.texStorage2D(i.TEXTURE_2D,vt,Ht,ct.width,ct.height),G&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ct.width,ct.height,Et,Bt,ct.data)):e.texImage2D(i.TEXTURE_2D,0,Ht,ct.width,ct.height,0,Et,Bt,ct.data);else if(R.isCompressedTexture)if(R.isCompressedArrayTexture){$t&&de&&e.texStorage3D(i.TEXTURE_2D_ARRAY,vt,Ht,ne[0].width,ne[0].height,ct.depth);for(let j=0,it=ne.length;j<it;j++)if(Tt=ne[j],R.format!==nn)if(Et!==null)if($t){if(G)if(R.layerUpdates.size>0){const wt=wu(Tt.width,Tt.height,R.format,R.type);for(const _t of R.layerUpdates){const Xt=Tt.data.subarray(_t*wt/Tt.data.BYTES_PER_ELEMENT,(_t+1)*wt/Tt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,_t,Tt.width,Tt.height,1,Et,Xt)}R.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,Tt.width,Tt.height,ct.depth,Et,Tt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,j,Ht,Tt.width,Tt.height,ct.depth,0,Tt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else $t?G&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,Tt.width,Tt.height,ct.depth,Et,Bt,Tt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,j,Ht,Tt.width,Tt.height,ct.depth,0,Et,Bt,Tt.data)}else{$t&&de&&e.texStorage2D(i.TEXTURE_2D,vt,Ht,ne[0].width,ne[0].height);for(let j=0,it=ne.length;j<it;j++)Tt=ne[j],R.format!==nn?Et!==null?$t?G&&e.compressedTexSubImage2D(i.TEXTURE_2D,j,0,0,Tt.width,Tt.height,Et,Tt.data):e.compressedTexImage2D(i.TEXTURE_2D,j,Ht,Tt.width,Tt.height,0,Tt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):$t?G&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,Tt.width,Tt.height,Et,Bt,Tt.data):e.texImage2D(i.TEXTURE_2D,j,Ht,Tt.width,Tt.height,0,Et,Bt,Tt.data)}else if(R.isDataArrayTexture)if($t){if(de&&e.texStorage3D(i.TEXTURE_2D_ARRAY,vt,Ht,ct.width,ct.height,ct.depth),G)if(R.layerUpdates.size>0){const j=wu(ct.width,ct.height,R.format,R.type);for(const it of R.layerUpdates){const wt=ct.data.subarray(it*j/ct.data.BYTES_PER_ELEMENT,(it+1)*j/ct.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,it,ct.width,ct.height,1,Et,Bt,wt)}R.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ct.width,ct.height,ct.depth,Et,Bt,ct.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ht,ct.width,ct.height,ct.depth,0,Et,Bt,ct.data);else if(R.isData3DTexture)$t?(de&&e.texStorage3D(i.TEXTURE_3D,vt,Ht,ct.width,ct.height,ct.depth),G&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ct.width,ct.height,ct.depth,Et,Bt,ct.data)):e.texImage3D(i.TEXTURE_3D,0,Ht,ct.width,ct.height,ct.depth,0,Et,Bt,ct.data);else if(R.isFramebufferTexture){if(de)if($t)e.texStorage2D(i.TEXTURE_2D,vt,Ht,ct.width,ct.height);else{let j=ct.width,it=ct.height;for(let wt=0;wt<vt;wt++)e.texImage2D(i.TEXTURE_2D,wt,Ht,j,it,0,Et,Bt,null),j>>=1,it>>=1}}else if(ne.length>0){if($t&&de){const j=Mt(ne[0]);e.texStorage2D(i.TEXTURE_2D,vt,Ht,j.width,j.height)}for(let j=0,it=ne.length;j<it;j++)Tt=ne[j],$t?G&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,Et,Bt,Tt):e.texImage2D(i.TEXTURE_2D,j,Ht,Et,Bt,Tt);R.generateMipmaps=!1}else if($t){if(de){const j=Mt(ct);e.texStorage2D(i.TEXTURE_2D,vt,Ht,j.width,j.height)}G&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Et,Bt,ct)}else e.texImage2D(i.TEXTURE_2D,0,Ht,Et,Bt,ct);g(R)&&p(Q),Ct.__version=tt.version,R.onUpdate&&R.onUpdate(R)}I.__version=R.version}function at(I,R,q){if(R.image.length!==6)return;const Q=te(I,R),st=R.source;e.bindTexture(i.TEXTURE_CUBE_MAP,I.__webglTexture,i.TEXTURE0+q);const tt=n.get(st);if(st.version!==tt.__version||Q===!0){e.activeTexture(i.TEXTURE0+q);const Ct=ie.getPrimaries(ie.workingColorSpace),gt=R.colorSpace===zn?null:ie.getPrimaries(R.colorSpace),bt=R.colorSpace===zn||Ct===gt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,R.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,R.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,bt);const Qt=R.isCompressedTexture||R.image[0].isCompressedTexture,ct=R.image[0]&&R.image[0].isDataTexture,Et=[];for(let it=0;it<6;it++)!Qt&&!ct?Et[it]=v(R.image[it],!0,s.maxCubemapSize):Et[it]=ct?R.image[it].image:R.image[it],Et[it]=zt(R,Et[it]);const Bt=Et[0],Ht=r.convert(R.format,R.colorSpace),Tt=r.convert(R.type),ne=y(R.internalFormat,Ht,Tt,R.colorSpace),$t=R.isVideoTexture!==!0,de=tt.__version===void 0||Q===!0,G=st.dataReady;let vt=b(R,Bt);Ft(i.TEXTURE_CUBE_MAP,R);let j;if(Qt){$t&&de&&e.texStorage2D(i.TEXTURE_CUBE_MAP,vt,ne,Bt.width,Bt.height);for(let it=0;it<6;it++){j=Et[it].mipmaps;for(let wt=0;wt<j.length;wt++){const _t=j[wt];R.format!==nn?Ht!==null?$t?G&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,wt,0,0,_t.width,_t.height,Ht,_t.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,wt,ne,_t.width,_t.height,0,_t.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):$t?G&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,wt,0,0,_t.width,_t.height,Ht,Tt,_t.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,wt,ne,_t.width,_t.height,0,Ht,Tt,_t.data)}}}else{if(j=R.mipmaps,$t&&de){j.length>0&&vt++;const it=Mt(Et[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,vt,ne,it.width,it.height)}for(let it=0;it<6;it++)if(ct){$t?G&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,Et[it].width,Et[it].height,Ht,Tt,Et[it].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,ne,Et[it].width,Et[it].height,0,Ht,Tt,Et[it].data);for(let wt=0;wt<j.length;wt++){const Xt=j[wt].image[it].image;$t?G&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,wt+1,0,0,Xt.width,Xt.height,Ht,Tt,Xt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,wt+1,ne,Xt.width,Xt.height,0,Ht,Tt,Xt.data)}}else{$t?G&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,Ht,Tt,Et[it]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,ne,Ht,Tt,Et[it]);for(let wt=0;wt<j.length;wt++){const _t=j[wt];$t?G&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,wt+1,0,0,Ht,Tt,_t.image[it]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,wt+1,ne,Ht,Tt,_t.image[it])}}}g(R)&&p(i.TEXTURE_CUBE_MAP),tt.__version=st.version,R.onUpdate&&R.onUpdate(R)}I.__version=R.version}function St(I,R,q,Q,st,tt){const Ct=r.convert(q.format,q.colorSpace),gt=r.convert(q.type),bt=y(q.internalFormat,Ct,gt,q.colorSpace),Qt=n.get(R),ct=n.get(q);if(ct.__renderTarget=R,!Qt.__hasExternalTextures){const Et=Math.max(1,R.width>>tt),Bt=Math.max(1,R.height>>tt);st===i.TEXTURE_3D||st===i.TEXTURE_2D_ARRAY?e.texImage3D(st,tt,bt,Et,Bt,R.depth,0,Ct,gt,null):e.texImage2D(st,tt,bt,Et,Bt,0,Ct,gt,null)}e.bindFramebuffer(i.FRAMEBUFFER,I),pt(R)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Q,st,ct.__webglTexture,0,ot(R)):(st===i.TEXTURE_2D||st>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&st<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Q,st,ct.__webglTexture,tt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function ht(I,R,q){if(i.bindRenderbuffer(i.RENDERBUFFER,I),R.depthBuffer){const Q=R.depthTexture,st=Q&&Q.isDepthTexture?Q.type:null,tt=x(R.stencilBuffer,st),Ct=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,gt=ot(R);pt(R)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,gt,tt,R.width,R.height):q?i.renderbufferStorageMultisample(i.RENDERBUFFER,gt,tt,R.width,R.height):i.renderbufferStorage(i.RENDERBUFFER,tt,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ct,i.RENDERBUFFER,I)}else{const Q=R.textures;for(let st=0;st<Q.length;st++){const tt=Q[st],Ct=r.convert(tt.format,tt.colorSpace),gt=r.convert(tt.type),bt=y(tt.internalFormat,Ct,gt,tt.colorSpace),Qt=ot(R);q&&pt(R)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Qt,bt,R.width,R.height):pt(R)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Qt,bt,R.width,R.height):i.renderbufferStorage(i.RENDERBUFFER,bt,R.width,R.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Nt(I,R){if(R&&R.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,I),!(R.depthTexture&&R.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Q=n.get(R.depthTexture);Q.__renderTarget=R,(!Q.__webglTexture||R.depthTexture.image.width!==R.width||R.depthTexture.image.height!==R.height)&&(R.depthTexture.image.width=R.width,R.depthTexture.image.height=R.height,R.depthTexture.needsUpdate=!0),F(R.depthTexture,0);const st=Q.__webglTexture,tt=ot(R);if(R.depthTexture.format===os)pt(R)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,st,0,tt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,st,0);else if(R.depthTexture.format===ds)pt(R)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,st,0,tt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,st,0);else throw new Error("Unknown depthTexture format")}function kt(I){const R=n.get(I),q=I.isWebGLCubeRenderTarget===!0;if(R.__boundDepthTexture!==I.depthTexture){const Q=I.depthTexture;if(R.__depthDisposeCallback&&R.__depthDisposeCallback(),Q){const st=()=>{delete R.__boundDepthTexture,delete R.__depthDisposeCallback,Q.removeEventListener("dispose",st)};Q.addEventListener("dispose",st),R.__depthDisposeCallback=st}R.__boundDepthTexture=Q}if(I.depthTexture&&!R.__autoAllocateDepthBuffer){if(q)throw new Error("target.depthTexture not supported in Cube render targets");Nt(R.__webglFramebuffer,I)}else if(q){R.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(e.bindFramebuffer(i.FRAMEBUFFER,R.__webglFramebuffer[Q]),R.__webglDepthbuffer[Q]===void 0)R.__webglDepthbuffer[Q]=i.createRenderbuffer(),ht(R.__webglDepthbuffer[Q],I,!1);else{const st=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,tt=R.__webglDepthbuffer[Q];i.bindRenderbuffer(i.RENDERBUFFER,tt),i.framebufferRenderbuffer(i.FRAMEBUFFER,st,i.RENDERBUFFER,tt)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,R.__webglFramebuffer),R.__webglDepthbuffer===void 0)R.__webglDepthbuffer=i.createRenderbuffer(),ht(R.__webglDepthbuffer,I,!1);else{const Q=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,st=R.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,st),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,st)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ot(I,R,q){const Q=n.get(I);R!==void 0&&St(Q.__webglFramebuffer,I,I.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),q!==void 0&&kt(I)}function Jt(I){const R=I.texture,q=n.get(I),Q=n.get(R);I.addEventListener("dispose",E);const st=I.textures,tt=I.isWebGLCubeRenderTarget===!0,Ct=st.length>1;if(Ct||(Q.__webglTexture===void 0&&(Q.__webglTexture=i.createTexture()),Q.__version=R.version,o.memory.textures++),tt){q.__webglFramebuffer=[];for(let gt=0;gt<6;gt++)if(R.mipmaps&&R.mipmaps.length>0){q.__webglFramebuffer[gt]=[];for(let bt=0;bt<R.mipmaps.length;bt++)q.__webglFramebuffer[gt][bt]=i.createFramebuffer()}else q.__webglFramebuffer[gt]=i.createFramebuffer()}else{if(R.mipmaps&&R.mipmaps.length>0){q.__webglFramebuffer=[];for(let gt=0;gt<R.mipmaps.length;gt++)q.__webglFramebuffer[gt]=i.createFramebuffer()}else q.__webglFramebuffer=i.createFramebuffer();if(Ct)for(let gt=0,bt=st.length;gt<bt;gt++){const Qt=n.get(st[gt]);Qt.__webglTexture===void 0&&(Qt.__webglTexture=i.createTexture(),o.memory.textures++)}if(I.samples>0&&pt(I)===!1){q.__webglMultisampledFramebuffer=i.createFramebuffer(),q.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,q.__webglMultisampledFramebuffer);for(let gt=0;gt<st.length;gt++){const bt=st[gt];q.__webglColorRenderbuffer[gt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,q.__webglColorRenderbuffer[gt]);const Qt=r.convert(bt.format,bt.colorSpace),ct=r.convert(bt.type),Et=y(bt.internalFormat,Qt,ct,bt.colorSpace,I.isXRRenderTarget===!0),Bt=ot(I);i.renderbufferStorageMultisample(i.RENDERBUFFER,Bt,Et,I.width,I.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+gt,i.RENDERBUFFER,q.__webglColorRenderbuffer[gt])}i.bindRenderbuffer(i.RENDERBUFFER,null),I.depthBuffer&&(q.__webglDepthRenderbuffer=i.createRenderbuffer(),ht(q.__webglDepthRenderbuffer,I,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(tt){e.bindTexture(i.TEXTURE_CUBE_MAP,Q.__webglTexture),Ft(i.TEXTURE_CUBE_MAP,R);for(let gt=0;gt<6;gt++)if(R.mipmaps&&R.mipmaps.length>0)for(let bt=0;bt<R.mipmaps.length;bt++)St(q.__webglFramebuffer[gt][bt],I,R,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,bt);else St(q.__webglFramebuffer[gt],I,R,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0);g(R)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ct){for(let gt=0,bt=st.length;gt<bt;gt++){const Qt=st[gt],ct=n.get(Qt);e.bindTexture(i.TEXTURE_2D,ct.__webglTexture),Ft(i.TEXTURE_2D,Qt),St(q.__webglFramebuffer,I,Qt,i.COLOR_ATTACHMENT0+gt,i.TEXTURE_2D,0),g(Qt)&&p(i.TEXTURE_2D)}e.unbindTexture()}else{let gt=i.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(gt=I.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(gt,Q.__webglTexture),Ft(gt,R),R.mipmaps&&R.mipmaps.length>0)for(let bt=0;bt<R.mipmaps.length;bt++)St(q.__webglFramebuffer[bt],I,R,i.COLOR_ATTACHMENT0,gt,bt);else St(q.__webglFramebuffer,I,R,i.COLOR_ATTACHMENT0,gt,0);g(R)&&p(gt),e.unbindTexture()}I.depthBuffer&&kt(I)}function nt(I){const R=I.textures;for(let q=0,Q=R.length;q<Q;q++){const st=R[q];if(g(st)){const tt=_(I),Ct=n.get(st).__webglTexture;e.bindTexture(tt,Ct),p(tt),e.unbindTexture()}}}const lt=[],O=[];function yt(I){if(I.samples>0){if(pt(I)===!1){const R=I.textures,q=I.width,Q=I.height;let st=i.COLOR_BUFFER_BIT;const tt=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ct=n.get(I),gt=R.length>1;if(gt)for(let bt=0;bt<R.length;bt++)e.bindFramebuffer(i.FRAMEBUFFER,Ct.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+bt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Ct.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+bt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Ct.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ct.__webglFramebuffer);for(let bt=0;bt<R.length;bt++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(st|=i.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(st|=i.STENCIL_BUFFER_BIT)),gt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ct.__webglColorRenderbuffer[bt]);const Qt=n.get(R[bt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Qt,0)}i.blitFramebuffer(0,0,q,Q,0,0,q,Q,st,i.NEAREST),c===!0&&(lt.length=0,O.length=0,lt.push(i.COLOR_ATTACHMENT0+bt),I.depthBuffer&&I.resolveDepthBuffer===!1&&(lt.push(tt),O.push(tt),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,O)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,lt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),gt)for(let bt=0;bt<R.length;bt++){e.bindFramebuffer(i.FRAMEBUFFER,Ct.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+bt,i.RENDERBUFFER,Ct.__webglColorRenderbuffer[bt]);const Qt=n.get(R[bt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Ct.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+bt,i.TEXTURE_2D,Qt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ct.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&c){const R=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[R])}}}function ot(I){return Math.min(s.maxSamples,I.samples)}function pt(I){const R=n.get(I);return I.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&R.__useRenderToTexture!==!1}function ut(I){const R=o.render.frame;h.get(I)!==R&&(h.set(I,R),I.update())}function zt(I,R){const q=I.colorSpace,Q=I.format,st=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||q!==ys&&q!==zn&&(ie.getTransfer(q)===le?(Q!==nn||st!==Vn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",q)),R}function Mt(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(l.width=I.naturalWidth||I.width,l.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(l.width=I.displayWidth,l.height=I.displayHeight):(l.width=I.width,l.height=I.height),l}this.allocateTextureUnit=L,this.resetTextureUnits=N,this.setTexture2D=F,this.setTexture2DArray=D,this.setTexture3D=H,this.setTextureCube=k,this.rebindTextures=Ot,this.setupRenderTarget=Jt,this.updateRenderTargetMipmap=nt,this.updateMultisampleRenderTarget=yt,this.setupDepthRenderbuffer=kt,this.setupFrameBufferTexture=St,this.useMultisampledRTT=pt}function v_(i,t){function e(n,s=zn){let r;const o=ie.getTransfer(s);if(n===Vn)return i.UNSIGNED_BYTE;if(n===Bl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Hl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===ff)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===uf)return i.BYTE;if(n===df)return i.SHORT;if(n===er)return i.UNSIGNED_SHORT;if(n===kl)return i.INT;if(n===Ai)return i.UNSIGNED_INT;if(n===kn)return i.FLOAT;if(n===ii)return i.HALF_FLOAT;if(n===pf)return i.ALPHA;if(n===mf)return i.RGB;if(n===nn)return i.RGBA;if(n===gf)return i.LUMINANCE;if(n===vf)return i.LUMINANCE_ALPHA;if(n===os)return i.DEPTH_COMPONENT;if(n===ds)return i.DEPTH_STENCIL;if(n===Gl)return i.RED;if(n===Vl)return i.RED_INTEGER;if(n===yf)return i.RG;if(n===Wl)return i.RG_INTEGER;if(n===Xl)return i.RGBA_INTEGER;if(n===vo||n===yo||n===_o||n===xo)if(o===le)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===vo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===yo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===_o)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===xo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===vo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===yo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===_o)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===xo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===kc||n===Bc||n===Hc||n===Gc)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===kc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Bc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Hc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Gc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Vc||n===Wc||n===Xc)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Vc||n===Wc)return o===le?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Xc)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===qc||n===Yc||n===$c||n===Zc||n===Kc||n===jc||n===Jc||n===Qc||n===tl||n===el||n===nl||n===il||n===sl||n===rl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===qc)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Yc)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===$c)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Zc)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Kc)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===jc)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Jc)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Qc)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===tl)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===el)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===nl)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===il)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===sl)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===rl)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===wo||n===ol||n===al)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===wo)return o===le?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ol)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===al)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===_f||n===cl||n===ll||n===hl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===wo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===cl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ll)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===hl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===us?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class y_ extends We{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class ye extends be{constructor(){super(),this.isGroup=!0,this.type="Group"}}const __={type:"move"};class Ca{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ye,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ye,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ye,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const v of t.hand.values()){const g=e.getJointPose(v,n),p=this._getHandJoint(l,v);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,m=.005;l.inputState.pinching&&f>d+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=d-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(__)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new ye;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const x_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,w_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class M_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new He,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Je({vertexShader:x_,fragmentShader:w_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Kt(new si(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class b_ extends _s{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,f=null,d=null,m=null;const v=new M_,g=e.getContextAttributes();let p=null,_=null;const y=[],x=[],b=new et;let S=null;const E=new We;E.viewport=new he;const T=new We;T.viewport=new he;const M=[E,T],w=new y_;let A=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let at=y[J];return at===void 0&&(at=new Ca,y[J]=at),at.getTargetRaySpace()},this.getControllerGrip=function(J){let at=y[J];return at===void 0&&(at=new Ca,y[J]=at),at.getGripSpace()},this.getHand=function(J){let at=y[J];return at===void 0&&(at=new Ca,y[J]=at),at.getHandSpace()};function L(J){const at=x.indexOf(J.inputSource);if(at===-1)return;const St=y[at];St!==void 0&&(St.update(J.inputSource,J.frame,l||o),St.dispatchEvent({type:J.type,data:J.inputSource}))}function U(){s.removeEventListener("select",L),s.removeEventListener("selectstart",L),s.removeEventListener("selectend",L),s.removeEventListener("squeeze",L),s.removeEventListener("squeezestart",L),s.removeEventListener("squeezeend",L),s.removeEventListener("end",U),s.removeEventListener("inputsourceschange",F);for(let J=0;J<y.length;J++){const at=x[J];at!==null&&(x[J]=null,y[J].disconnect(at))}A=null,N=null,v.reset(),t.setRenderTarget(p),d=null,f=null,u=null,s=null,_=null,te.stop(),n.isPresenting=!1,t.setPixelRatio(S),t.setSize(b.width,b.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){a=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",L),s.addEventListener("selectstart",L),s.addEventListener("selectend",L),s.addEventListener("squeeze",L),s.addEventListener("squeezestart",L),s.addEventListener("squeezeend",L),s.addEventListener("end",U),s.addEventListener("inputsourceschange",F),g.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(b),s.renderState.layers===void 0){const at={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,at),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),_=new wn(d.framebufferWidth,d.framebufferHeight,{format:nn,type:Vn,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let at=null,St=null,ht=null;g.depth&&(ht=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,at=g.stencil?ds:os,St=g.stencil?us:Ai);const Nt={colorFormat:e.RGBA8,depthFormat:ht,scaleFactor:r};u=new XRWebGLBinding(s,e),f=u.createProjectionLayer(Nt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),_=new wn(f.textureWidth,f.textureHeight,{format:nn,type:Vn,depthTexture:new jl(f.textureWidth,f.textureHeight,St,void 0,void 0,void 0,void 0,void 0,void 0,at),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),te.setContext(s),te.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function F(J){for(let at=0;at<J.removed.length;at++){const St=J.removed[at],ht=x.indexOf(St);ht>=0&&(x[ht]=null,y[ht].disconnect(St))}for(let at=0;at<J.added.length;at++){const St=J.added[at];let ht=x.indexOf(St);if(ht===-1){for(let kt=0;kt<y.length;kt++)if(kt>=x.length){x.push(St),ht=kt;break}else if(x[kt]===null){x[kt]=St,ht=kt;break}if(ht===-1)break}const Nt=y[ht];Nt&&Nt.connect(St)}}const D=new C,H=new C;function k(J,at,St){D.setFromMatrixPosition(at.matrixWorld),H.setFromMatrixPosition(St.matrixWorld);const ht=D.distanceTo(H),Nt=at.projectionMatrix.elements,kt=St.projectionMatrix.elements,Ot=Nt[14]/(Nt[10]-1),Jt=Nt[14]/(Nt[10]+1),nt=(Nt[9]+1)/Nt[5],lt=(Nt[9]-1)/Nt[5],O=(Nt[8]-1)/Nt[0],yt=(kt[8]+1)/kt[0],ot=Ot*O,pt=Ot*yt,ut=ht/(-O+yt),zt=ut*-O;if(at.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(zt),J.translateZ(ut),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),Nt[10]===-1)J.projectionMatrix.copy(at.projectionMatrix),J.projectionMatrixInverse.copy(at.projectionMatrixInverse);else{const Mt=Ot+ut,I=Jt+ut,R=ot-zt,q=pt+(ht-zt),Q=nt*Jt/I*Mt,st=lt*Jt/I*Mt;J.projectionMatrix.makePerspective(R,q,Q,st,Mt,I),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function Y(J,at){at===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(at.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let at=J.near,St=J.far;v.texture!==null&&(v.depthNear>0&&(at=v.depthNear),v.depthFar>0&&(St=v.depthFar)),w.near=T.near=E.near=at,w.far=T.far=E.far=St,(A!==w.near||N!==w.far)&&(s.updateRenderState({depthNear:w.near,depthFar:w.far}),A=w.near,N=w.far),E.layers.mask=J.layers.mask|2,T.layers.mask=J.layers.mask|4,w.layers.mask=E.layers.mask|T.layers.mask;const ht=J.parent,Nt=w.cameras;Y(w,ht);for(let kt=0;kt<Nt.length;kt++)Y(Nt[kt],ht);Nt.length===2?k(w,E,T):w.projectionMatrix.copy(E.projectionMatrix),rt(J,w,ht)};function rt(J,at,St){St===null?J.matrix.copy(at.matrixWorld):(J.matrix.copy(St.matrixWorld),J.matrix.invert(),J.matrix.multiply(at.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(at.projectionMatrix),J.projectionMatrixInverse.copy(at.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=fs*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return w},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(J){c=J,f!==null&&(f.fixedFoveation=J),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=J)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(w)};let ft=null;function Ft(J,at){if(h=at.getViewerPose(l||o),m=at,h!==null){const St=h.views;d!==null&&(t.setRenderTargetFramebuffer(_,d.framebuffer),t.setRenderTarget(_));let ht=!1;St.length!==w.cameras.length&&(w.cameras.length=0,ht=!0);for(let kt=0;kt<St.length;kt++){const Ot=St[kt];let Jt=null;if(d!==null)Jt=d.getViewport(Ot);else{const lt=u.getViewSubImage(f,Ot);Jt=lt.viewport,kt===0&&(t.setRenderTargetTextures(_,lt.colorTexture,f.ignoreDepthValues?void 0:lt.depthStencilTexture),t.setRenderTarget(_))}let nt=M[kt];nt===void 0&&(nt=new We,nt.layers.enable(kt),nt.viewport=new he,M[kt]=nt),nt.matrix.fromArray(Ot.transform.matrix),nt.matrix.decompose(nt.position,nt.quaternion,nt.scale),nt.projectionMatrix.fromArray(Ot.projectionMatrix),nt.projectionMatrixInverse.copy(nt.projectionMatrix).invert(),nt.viewport.set(Jt.x,Jt.y,Jt.width,Jt.height),kt===0&&(w.matrix.copy(nt.matrix),w.matrix.decompose(w.position,w.quaternion,w.scale)),ht===!0&&w.cameras.push(nt)}const Nt=s.enabledFeatures;if(Nt&&Nt.includes("depth-sensing")){const kt=u.getDepthInformation(St[0]);kt&&kt.isValid&&kt.texture&&v.init(t,kt,s.renderState)}}for(let St=0;St<y.length;St++){const ht=x[St],Nt=y[St];ht!==null&&Nt!==void 0&&Nt.update(ht,at,l||o)}ft&&ft(J,at),at.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:at}),m=null}const te=new Pf;te.setAnimationLoop(Ft),this.setAnimationLoop=function(J){ft=J},this.dispose=function(){}}}const mi=new Mn,S_=new ue;function E_(i,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,Af(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,_,y,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(g,p):p.isMeshToonMaterial?(r(g,p),u(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p)):p.isMeshStandardMaterial?(r(g,p),f(g,p),p.isMeshPhysicalMaterial&&d(g,p,x)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),v(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&a(g,p)):p.isPointsMaterial?c(g,p,_,y):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Be&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Be&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const _=t.get(p),y=_.envMap,x=_.envMapRotation;y&&(g.envMap.value=y,mi.copy(x),mi.x*=-1,mi.y*=-1,mi.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(mi.y*=-1,mi.z*=-1),g.envMapRotation.value.setFromMatrix4(S_.makeRotationFromEuler(mi)),g.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function a(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,_,y){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*_,g.scale.value=y*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function f(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function d(g,p,_){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Be&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function v(g,p){const _=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(_.matrixWorld),g.nearDistance.value=_.shadow.camera.near,g.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function T_(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(_,y){const x=y.program;n.uniformBlockBinding(_,x)}function l(_,y){let x=s[_.id];x===void 0&&(m(_),x=h(_),s[_.id]=x,_.addEventListener("dispose",g));const b=y.program;n.updateUBOMapping(_,b);const S=t.render.frame;r[_.id]!==S&&(f(_),r[_.id]=S)}function h(_){const y=u();_.__bindingPointIndex=y;const x=i.createBuffer(),b=_.__size,S=_.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,b,S),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,x),x}function u(){for(let _=0;_<a;_++)if(o.indexOf(_)===-1)return o.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(_){const y=s[_.id],x=_.uniforms,b=_.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let S=0,E=x.length;S<E;S++){const T=Array.isArray(x[S])?x[S]:[x[S]];for(let M=0,w=T.length;M<w;M++){const A=T[M];if(d(A,S,M,b)===!0){const N=A.__offset,L=Array.isArray(A.value)?A.value:[A.value];let U=0;for(let F=0;F<L.length;F++){const D=L[F],H=v(D);typeof D=="number"||typeof D=="boolean"?(A.__data[0]=D,i.bufferSubData(i.UNIFORM_BUFFER,N+U,A.__data)):D.isMatrix3?(A.__data[0]=D.elements[0],A.__data[1]=D.elements[1],A.__data[2]=D.elements[2],A.__data[3]=0,A.__data[4]=D.elements[3],A.__data[5]=D.elements[4],A.__data[6]=D.elements[5],A.__data[7]=0,A.__data[8]=D.elements[6],A.__data[9]=D.elements[7],A.__data[10]=D.elements[8],A.__data[11]=0):(D.toArray(A.__data,U),U+=H.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,N,A.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(_,y,x,b){const S=_.value,E=y+"_"+x;if(b[E]===void 0)return typeof S=="number"||typeof S=="boolean"?b[E]=S:b[E]=S.clone(),!0;{const T=b[E];if(typeof S=="number"||typeof S=="boolean"){if(T!==S)return b[E]=S,!0}else if(T.equals(S)===!1)return T.copy(S),!0}return!1}function m(_){const y=_.uniforms;let x=0;const b=16;for(let E=0,T=y.length;E<T;E++){const M=Array.isArray(y[E])?y[E]:[y[E]];for(let w=0,A=M.length;w<A;w++){const N=M[w],L=Array.isArray(N.value)?N.value:[N.value];for(let U=0,F=L.length;U<F;U++){const D=L[U],H=v(D),k=x%b,Y=k%H.boundary,rt=k+Y;x+=Y,rt!==0&&b-rt<H.storage&&(x+=b-rt),N.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=x,x+=H.storage}}}const S=x%b;return S>0&&(x+=b-S),_.__size=x,_.__cache={},this}function v(_){const y={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(y.boundary=4,y.storage=4):_.isVector2?(y.boundary=8,y.storage=8):_.isVector3||_.isColor?(y.boundary=16,y.storage=12):_.isVector4?(y.boundary=16,y.storage=16):_.isMatrix3?(y.boundary=48,y.storage=48):_.isMatrix4?(y.boundary=64,y.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),y}function g(_){const y=_.target;y.removeEventListener("dispose",g);const x=o.indexOf(y.__bindingPointIndex);o.splice(x,1),i.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function p(){for(const _ in s)i.deleteBuffer(s[_]);o=[],s={},r={}}return{bind:c,update:l,dispose:p}}class A_{constructor(t={}){const{canvas:e=gm(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;const m=new Uint32Array(4),v=new Int32Array(4);let g=null,p=null;const _=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=je,this.toneMapping=ei,this.toneMappingExposure=1;const x=this;let b=!1,S=0,E=0,T=null,M=-1,w=null;const A=new he,N=new he;let L=null;const U=new Vt(0);let F=0,D=e.width,H=e.height,k=1,Y=null,rt=null;const ft=new he(0,0,D,H),Ft=new he(0,0,D,H);let te=!1;const J=new $l;let at=!1,St=!1;const ht=new ue,Nt=new ue,kt=new C,Ot=new he,Jt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let nt=!1;function lt(){return T===null?k:1}let O=n;function yt(P,W){return e.getContext(P,W)}try{const P={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ol}`),e.addEventListener("webglcontextlost",it,!1),e.addEventListener("webglcontextrestored",wt,!1),e.addEventListener("webglcontextcreationerror",_t,!1),O===null){const W="webgl2";if(O=yt(W,P),O===null)throw yt(W)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(P){throw console.error("THREE.WebGLRenderer: "+P.message),P}let ot,pt,ut,zt,Mt,I,R,q,Q,st,tt,Ct,gt,bt,Qt,ct,Et,Bt,Ht,Tt,ne,$t,de,G;function vt(){ot=new I1(O),ot.init(),$t=new v_(O,ot),pt=new T1(O,ot,t,$t),ut=new p_(O,ot),pt.reverseDepthBuffer&&f&&ut.buffers.depth.setReversed(!0),zt=new U1(O),Mt=new Qy,I=new g_(O,ot,ut,Mt,pt,$t,zt),R=new R1(x),q=new L1(x),Q=new Gm(O),de=new S1(O,Q),st=new D1(O,Q,zt,de),tt=new O1(O,st,Q,zt),Ht=new F1(O,pt,I),ct=new A1(Mt),Ct=new Jy(x,R,q,ot,pt,de,ct),gt=new E_(x,Mt),bt=new e_,Qt=new a_(ot),Bt=new b1(x,R,q,ut,tt,d,c),Et=new d_(x,tt,pt),G=new T_(O,zt,pt,ut),Tt=new E1(O,ot,zt),ne=new N1(O,ot,zt),zt.programs=Ct.programs,x.capabilities=pt,x.extensions=ot,x.properties=Mt,x.renderLists=bt,x.shadowMap=Et,x.state=ut,x.info=zt}vt();const j=new b_(x,O);this.xr=j,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const P=ot.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=ot.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return k},this.setPixelRatio=function(P){P!==void 0&&(k=P,this.setSize(D,H,!1))},this.getSize=function(P){return P.set(D,H)},this.setSize=function(P,W,$=!0){if(j.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}D=P,H=W,e.width=Math.floor(P*k),e.height=Math.floor(W*k),$===!0&&(e.style.width=P+"px",e.style.height=W+"px"),this.setViewport(0,0,P,W)},this.getDrawingBufferSize=function(P){return P.set(D*k,H*k).floor()},this.setDrawingBufferSize=function(P,W,$){D=P,H=W,k=$,e.width=Math.floor(P*$),e.height=Math.floor(W*$),this.setViewport(0,0,P,W)},this.getCurrentViewport=function(P){return P.copy(A)},this.getViewport=function(P){return P.copy(ft)},this.setViewport=function(P,W,$,Z){P.isVector4?ft.set(P.x,P.y,P.z,P.w):ft.set(P,W,$,Z),ut.viewport(A.copy(ft).multiplyScalar(k).round())},this.getScissor=function(P){return P.copy(Ft)},this.setScissor=function(P,W,$,Z){P.isVector4?Ft.set(P.x,P.y,P.z,P.w):Ft.set(P,W,$,Z),ut.scissor(N.copy(Ft).multiplyScalar(k).round())},this.getScissorTest=function(){return te},this.setScissorTest=function(P){ut.setScissorTest(te=P)},this.setOpaqueSort=function(P){Y=P},this.setTransparentSort=function(P){rt=P},this.getClearColor=function(P){return P.copy(Bt.getClearColor())},this.setClearColor=function(){Bt.setClearColor.apply(Bt,arguments)},this.getClearAlpha=function(){return Bt.getClearAlpha()},this.setClearAlpha=function(){Bt.setClearAlpha.apply(Bt,arguments)},this.clear=function(P=!0,W=!0,$=!0){let Z=0;if(P){let X=!1;if(T!==null){const dt=T.texture.format;X=dt===Xl||dt===Wl||dt===Vl}if(X){const dt=T.texture.type,xt=dt===Vn||dt===Ai||dt===er||dt===us||dt===Bl||dt===Hl,Pt=Bt.getClearColor(),Lt=Bt.getClearAlpha(),Gt=Pt.r,qt=Pt.g,It=Pt.b;xt?(m[0]=Gt,m[1]=qt,m[2]=It,m[3]=Lt,O.clearBufferuiv(O.COLOR,0,m)):(v[0]=Gt,v[1]=qt,v[2]=It,v[3]=Lt,O.clearBufferiv(O.COLOR,0,v))}else Z|=O.COLOR_BUFFER_BIT}W&&(Z|=O.DEPTH_BUFFER_BIT),$&&(Z|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(Z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",it,!1),e.removeEventListener("webglcontextrestored",wt,!1),e.removeEventListener("webglcontextcreationerror",_t,!1),bt.dispose(),Qt.dispose(),Mt.dispose(),R.dispose(),q.dispose(),tt.dispose(),de.dispose(),G.dispose(),Ct.dispose(),j.dispose(),j.removeEventListener("sessionstart",gh),j.removeEventListener("sessionend",vh),li.stop()};function it(P){P.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function wt(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;const P=zt.autoReset,W=Et.enabled,$=Et.autoUpdate,Z=Et.needsUpdate,X=Et.type;vt(),zt.autoReset=P,Et.enabled=W,Et.autoUpdate=$,Et.needsUpdate=Z,Et.type=X}function _t(P){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function Xt(P){const W=P.target;W.removeEventListener("dispose",Xt),xe(W)}function xe(P){De(P),Mt.remove(P)}function De(P){const W=Mt.get(P).programs;W!==void 0&&(W.forEach(function($){Ct.releaseProgram($)}),P.isShaderMaterial&&Ct.releaseShaderCache(P))}this.renderBufferDirect=function(P,W,$,Z,X,dt){W===null&&(W=Jt);const xt=X.isMesh&&X.matrixWorld.determinant()<0,Pt=g0(P,W,$,Z,X);ut.setMaterial(Z,xt);let Lt=$.index,Gt=1;if(Z.wireframe===!0){if(Lt=st.getWireframeAttribute($),Lt===void 0)return;Gt=2}const qt=$.drawRange,It=$.attributes.position;let re=qt.start*Gt,fe=(qt.start+qt.count)*Gt;dt!==null&&(re=Math.max(re,dt.start*Gt),fe=Math.min(fe,(dt.start+dt.count)*Gt)),Lt!==null?(re=Math.max(re,0),fe=Math.min(fe,Lt.count)):It!=null&&(re=Math.max(re,0),fe=Math.min(fe,It.count));const me=fe-re;if(me<0||me===1/0)return;de.setup(X,Z,Pt,$,Lt);let Ge,oe=Tt;if(Lt!==null&&(Ge=Q.get(Lt),oe=ne,oe.setIndex(Ge)),X.isMesh)Z.wireframe===!0?(ut.setLineWidth(Z.wireframeLinewidth*lt()),oe.setMode(O.LINES)):oe.setMode(O.TRIANGLES);else if(X.isLine){let Ut=Z.linewidth;Ut===void 0&&(Ut=1),ut.setLineWidth(Ut*lt()),X.isLineSegments?oe.setMode(O.LINES):X.isLineLoop?oe.setMode(O.LINE_LOOP):oe.setMode(O.LINE_STRIP)}else X.isPoints?oe.setMode(O.POINTS):X.isSprite&&oe.setMode(O.TRIANGLES);if(X.isBatchedMesh)if(X._multiDrawInstances!==null)oe.renderMultiDrawInstances(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount,X._multiDrawInstances);else if(ot.get("WEBGL_multi_draw"))oe.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{const Ut=X._multiDrawStarts,Rn=X._multiDrawCounts,ae=X._multiDrawCount,on=Lt?Q.get(Lt).bytesPerElement:1,Di=Mt.get(Z).currentProgram.getUniforms();for(let Ye=0;Ye<ae;Ye++)Di.setValue(O,"_gl_DrawID",Ye),oe.render(Ut[Ye]/on,Rn[Ye])}else if(X.isInstancedMesh)oe.renderInstances(re,me,X.count);else if($.isInstancedBufferGeometry){const Ut=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,Rn=Math.min($.instanceCount,Ut);oe.renderInstances(re,me,Rn)}else oe.render(re,me)};function ce(P,W,$){P.transparent===!0&&P.side===hn&&P.forceSinglePass===!1?(P.side=Be,P.needsUpdate=!0,vr(P,W,$),P.side=ni,P.needsUpdate=!0,vr(P,W,$),P.side=hn):vr(P,W,$)}this.compile=function(P,W,$=null){$===null&&($=P),p=Qt.get($),p.init(W),y.push(p),$.traverseVisible(function(X){X.isLight&&X.layers.test(W.layers)&&(p.pushLight(X),X.castShadow&&p.pushShadow(X))}),P!==$&&P.traverseVisible(function(X){X.isLight&&X.layers.test(W.layers)&&(p.pushLight(X),X.castShadow&&p.pushShadow(X))}),p.setupLights();const Z=new Set;return P.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;const dt=X.material;if(dt)if(Array.isArray(dt))for(let xt=0;xt<dt.length;xt++){const Pt=dt[xt];ce(Pt,$,X),Z.add(Pt)}else ce(dt,$,X),Z.add(dt)}),y.pop(),p=null,Z},this.compileAsync=function(P,W,$=null){const Z=this.compile(P,W,$);return new Promise(X=>{function dt(){if(Z.forEach(function(xt){Mt.get(xt).currentProgram.isReady()&&Z.delete(xt)}),Z.size===0){X(P);return}setTimeout(dt,10)}ot.get("KHR_parallel_shader_compile")!==null?dt():setTimeout(dt,10)})};let rn=null;function An(P){rn&&rn(P)}function gh(){li.stop()}function vh(){li.start()}const li=new Pf;li.setAnimationLoop(An),typeof self<"u"&&li.setContext(self),this.setAnimationLoop=function(P){rn=P,j.setAnimationLoop(P),P===null?li.stop():li.start()},j.addEventListener("sessionstart",gh),j.addEventListener("sessionend",vh),this.render=function(P,W){if(W!==void 0&&W.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;if(P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),W.parent===null&&W.matrixWorldAutoUpdate===!0&&W.updateMatrixWorld(),j.enabled===!0&&j.isPresenting===!0&&(j.cameraAutoUpdate===!0&&j.updateCamera(W),W=j.getCamera()),P.isScene===!0&&P.onBeforeRender(x,P,W,T),p=Qt.get(P,y.length),p.init(W),y.push(p),Nt.multiplyMatrices(W.projectionMatrix,W.matrixWorldInverse),J.setFromProjectionMatrix(Nt),St=this.localClippingEnabled,at=ct.init(this.clippingPlanes,St),g=bt.get(P,_.length),g.init(),_.push(g),j.enabled===!0&&j.isPresenting===!0){const dt=x.xr.getDepthSensingMesh();dt!==null&&ea(dt,W,-1/0,x.sortObjects)}ea(P,W,0,x.sortObjects),g.finish(),x.sortObjects===!0&&g.sort(Y,rt),nt=j.enabled===!1||j.isPresenting===!1||j.hasDepthSensing()===!1,nt&&Bt.addToRenderList(g,P),this.info.render.frame++,at===!0&&ct.beginShadows();const $=p.state.shadowsArray;Et.render($,P,W),at===!0&&ct.endShadows(),this.info.autoReset===!0&&this.info.reset();const Z=g.opaque,X=g.transmissive;if(p.setupLights(),W.isArrayCamera){const dt=W.cameras;if(X.length>0)for(let xt=0,Pt=dt.length;xt<Pt;xt++){const Lt=dt[xt];_h(Z,X,P,Lt)}nt&&Bt.render(P);for(let xt=0,Pt=dt.length;xt<Pt;xt++){const Lt=dt[xt];yh(g,P,Lt,Lt.viewport)}}else X.length>0&&_h(Z,X,P,W),nt&&Bt.render(P),yh(g,P,W);T!==null&&(I.updateMultisampleRenderTarget(T),I.updateRenderTargetMipmap(T)),P.isScene===!0&&P.onAfterRender(x,P,W),de.resetDefaultState(),M=-1,w=null,y.pop(),y.length>0?(p=y[y.length-1],at===!0&&ct.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,_.pop(),_.length>0?g=_[_.length-1]:g=null};function ea(P,W,$,Z){if(P.visible===!1)return;if(P.layers.test(W.layers)){if(P.isGroup)$=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(W);else if(P.isLight)p.pushLight(P),P.castShadow&&p.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||J.intersectsSprite(P)){Z&&Ot.setFromMatrixPosition(P.matrixWorld).applyMatrix4(Nt);const xt=tt.update(P),Pt=P.material;Pt.visible&&g.push(P,xt,Pt,$,Ot.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||J.intersectsObject(P))){const xt=tt.update(P),Pt=P.material;if(Z&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),Ot.copy(P.boundingSphere.center)):(xt.boundingSphere===null&&xt.computeBoundingSphere(),Ot.copy(xt.boundingSphere.center)),Ot.applyMatrix4(P.matrixWorld).applyMatrix4(Nt)),Array.isArray(Pt)){const Lt=xt.groups;for(let Gt=0,qt=Lt.length;Gt<qt;Gt++){const It=Lt[Gt],re=Pt[It.materialIndex];re&&re.visible&&g.push(P,xt,re,$,Ot.z,It)}}else Pt.visible&&g.push(P,xt,Pt,$,Ot.z,null)}}const dt=P.children;for(let xt=0,Pt=dt.length;xt<Pt;xt++)ea(dt[xt],W,$,Z)}function yh(P,W,$,Z){const X=P.opaque,dt=P.transmissive,xt=P.transparent;p.setupLightsView($),at===!0&&ct.setGlobalState(x.clippingPlanes,$),Z&&ut.viewport(A.copy(Z)),X.length>0&&gr(X,W,$),dt.length>0&&gr(dt,W,$),xt.length>0&&gr(xt,W,$),ut.buffers.depth.setTest(!0),ut.buffers.depth.setMask(!0),ut.buffers.color.setMask(!0),ut.setPolygonOffset(!1)}function _h(P,W,$,Z){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Z.id]===void 0&&(p.state.transmissionRenderTarget[Z.id]=new wn(1,1,{generateMipmaps:!0,type:ot.has("EXT_color_buffer_half_float")||ot.has("EXT_color_buffer_float")?ii:Vn,minFilter:ti,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ie.workingColorSpace}));const dt=p.state.transmissionRenderTarget[Z.id],xt=Z.viewport||A;dt.setSize(xt.z,xt.w);const Pt=x.getRenderTarget();x.setRenderTarget(dt),x.getClearColor(U),F=x.getClearAlpha(),F<1&&x.setClearColor(16777215,.5),x.clear(),nt&&Bt.render($);const Lt=x.toneMapping;x.toneMapping=ei;const Gt=Z.viewport;if(Z.viewport!==void 0&&(Z.viewport=void 0),p.setupLightsView(Z),at===!0&&ct.setGlobalState(x.clippingPlanes,Z),gr(P,$,Z),I.updateMultisampleRenderTarget(dt),I.updateRenderTargetMipmap(dt),ot.has("WEBGL_multisampled_render_to_texture")===!1){let qt=!1;for(let It=0,re=W.length;It<re;It++){const fe=W[It],me=fe.object,Ge=fe.geometry,oe=fe.material,Ut=fe.group;if(oe.side===hn&&me.layers.test(Z.layers)){const Rn=oe.side;oe.side=Be,oe.needsUpdate=!0,xh(me,$,Z,Ge,oe,Ut),oe.side=Rn,oe.needsUpdate=!0,qt=!0}}qt===!0&&(I.updateMultisampleRenderTarget(dt),I.updateRenderTargetMipmap(dt))}x.setRenderTarget(Pt),x.setClearColor(U,F),Gt!==void 0&&(Z.viewport=Gt),x.toneMapping=Lt}function gr(P,W,$){const Z=W.isScene===!0?W.overrideMaterial:null;for(let X=0,dt=P.length;X<dt;X++){const xt=P[X],Pt=xt.object,Lt=xt.geometry,Gt=Z===null?xt.material:Z,qt=xt.group;Pt.layers.test($.layers)&&xh(Pt,W,$,Lt,Gt,qt)}}function xh(P,W,$,Z,X,dt){P.onBeforeRender(x,W,$,Z,X,dt),P.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),X.onBeforeRender(x,W,$,Z,P,dt),X.transparent===!0&&X.side===hn&&X.forceSinglePass===!1?(X.side=Be,X.needsUpdate=!0,x.renderBufferDirect($,W,Z,X,P,dt),X.side=ni,X.needsUpdate=!0,x.renderBufferDirect($,W,Z,X,P,dt),X.side=hn):x.renderBufferDirect($,W,Z,X,P,dt),P.onAfterRender(x,W,$,Z,X,dt)}function vr(P,W,$){W.isScene!==!0&&(W=Jt);const Z=Mt.get(P),X=p.state.lights,dt=p.state.shadowsArray,xt=X.state.version,Pt=Ct.getParameters(P,X.state,dt,W,$),Lt=Ct.getProgramCacheKey(Pt);let Gt=Z.programs;Z.environment=P.isMeshStandardMaterial?W.environment:null,Z.fog=W.fog,Z.envMap=(P.isMeshStandardMaterial?q:R).get(P.envMap||Z.environment),Z.envMapRotation=Z.environment!==null&&P.envMap===null?W.environmentRotation:P.envMapRotation,Gt===void 0&&(P.addEventListener("dispose",Xt),Gt=new Map,Z.programs=Gt);let qt=Gt.get(Lt);if(qt!==void 0){if(Z.currentProgram===qt&&Z.lightsStateVersion===xt)return Mh(P,Pt),qt}else Pt.uniforms=Ct.getUniforms(P),P.onBeforeCompile(Pt,x),qt=Ct.acquireProgram(Pt,Lt),Gt.set(Lt,qt),Z.uniforms=Pt.uniforms;const It=Z.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(It.clippingPlanes=ct.uniform),Mh(P,Pt),Z.needsLights=y0(P),Z.lightsStateVersion=xt,Z.needsLights&&(It.ambientLightColor.value=X.state.ambient,It.lightProbe.value=X.state.probe,It.directionalLights.value=X.state.directional,It.directionalLightShadows.value=X.state.directionalShadow,It.spotLights.value=X.state.spot,It.spotLightShadows.value=X.state.spotShadow,It.rectAreaLights.value=X.state.rectArea,It.ltc_1.value=X.state.rectAreaLTC1,It.ltc_2.value=X.state.rectAreaLTC2,It.pointLights.value=X.state.point,It.pointLightShadows.value=X.state.pointShadow,It.hemisphereLights.value=X.state.hemi,It.directionalShadowMap.value=X.state.directionalShadowMap,It.directionalShadowMatrix.value=X.state.directionalShadowMatrix,It.spotShadowMap.value=X.state.spotShadowMap,It.spotLightMatrix.value=X.state.spotLightMatrix,It.spotLightMap.value=X.state.spotLightMap,It.pointShadowMap.value=X.state.pointShadowMap,It.pointShadowMatrix.value=X.state.pointShadowMatrix),Z.currentProgram=qt,Z.uniformsList=null,qt}function wh(P){if(P.uniformsList===null){const W=P.currentProgram.getUniforms();P.uniformsList=Mo.seqWithValue(W.seq,P.uniforms)}return P.uniformsList}function Mh(P,W){const $=Mt.get(P);$.outputColorSpace=W.outputColorSpace,$.batching=W.batching,$.batchingColor=W.batchingColor,$.instancing=W.instancing,$.instancingColor=W.instancingColor,$.instancingMorph=W.instancingMorph,$.skinning=W.skinning,$.morphTargets=W.morphTargets,$.morphNormals=W.morphNormals,$.morphColors=W.morphColors,$.morphTargetsCount=W.morphTargetsCount,$.numClippingPlanes=W.numClippingPlanes,$.numIntersection=W.numClipIntersection,$.vertexAlphas=W.vertexAlphas,$.vertexTangents=W.vertexTangents,$.toneMapping=W.toneMapping}function g0(P,W,$,Z,X){W.isScene!==!0&&(W=Jt),I.resetTextureUnits();const dt=W.fog,xt=Z.isMeshStandardMaterial?W.environment:null,Pt=T===null?x.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:ys,Lt=(Z.isMeshStandardMaterial?q:R).get(Z.envMap||xt),Gt=Z.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,qt=!!$.attributes.tangent&&(!!Z.normalMap||Z.anisotropy>0),It=!!$.morphAttributes.position,re=!!$.morphAttributes.normal,fe=!!$.morphAttributes.color;let me=ei;Z.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(me=x.toneMapping);const Ge=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,oe=Ge!==void 0?Ge.length:0,Ut=Mt.get(Z),Rn=p.state.lights;if(at===!0&&(St===!0||P!==w)){const Qe=P===w&&Z.id===M;ct.setState(Z,P,Qe)}let ae=!1;Z.version===Ut.__version?(Ut.needsLights&&Ut.lightsStateVersion!==Rn.state.version||Ut.outputColorSpace!==Pt||X.isBatchedMesh&&Ut.batching===!1||!X.isBatchedMesh&&Ut.batching===!0||X.isBatchedMesh&&Ut.batchingColor===!0&&X.colorTexture===null||X.isBatchedMesh&&Ut.batchingColor===!1&&X.colorTexture!==null||X.isInstancedMesh&&Ut.instancing===!1||!X.isInstancedMesh&&Ut.instancing===!0||X.isSkinnedMesh&&Ut.skinning===!1||!X.isSkinnedMesh&&Ut.skinning===!0||X.isInstancedMesh&&Ut.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&Ut.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&Ut.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&Ut.instancingMorph===!1&&X.morphTexture!==null||Ut.envMap!==Lt||Z.fog===!0&&Ut.fog!==dt||Ut.numClippingPlanes!==void 0&&(Ut.numClippingPlanes!==ct.numPlanes||Ut.numIntersection!==ct.numIntersection)||Ut.vertexAlphas!==Gt||Ut.vertexTangents!==qt||Ut.morphTargets!==It||Ut.morphNormals!==re||Ut.morphColors!==fe||Ut.toneMapping!==me||Ut.morphTargetsCount!==oe)&&(ae=!0):(ae=!0,Ut.__version=Z.version);let on=Ut.currentProgram;ae===!0&&(on=vr(Z,W,X));let Di=!1,Ye=!1,bs=!1;const ge=on.getUniforms(),dn=Ut.uniforms;if(ut.useProgram(on.program)&&(Di=!0,Ye=!0,bs=!0),Z.id!==M&&(M=Z.id,Ye=!0),Di||w!==P){ut.buffers.depth.getReversed()?(ht.copy(P.projectionMatrix),ym(ht),_m(ht),ge.setValue(O,"projectionMatrix",ht)):ge.setValue(O,"projectionMatrix",P.projectionMatrix),ge.setValue(O,"viewMatrix",P.matrixWorldInverse);const Xn=ge.map.cameraPosition;Xn!==void 0&&Xn.setValue(O,kt.setFromMatrixPosition(P.matrixWorld)),pt.logarithmicDepthBuffer&&ge.setValue(O,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(Z.isMeshPhongMaterial||Z.isMeshToonMaterial||Z.isMeshLambertMaterial||Z.isMeshBasicMaterial||Z.isMeshStandardMaterial||Z.isShaderMaterial)&&ge.setValue(O,"isOrthographic",P.isOrthographicCamera===!0),w!==P&&(w=P,Ye=!0,bs=!0)}if(X.isSkinnedMesh){ge.setOptional(O,X,"bindMatrix"),ge.setOptional(O,X,"bindMatrixInverse");const Qe=X.skeleton;Qe&&(Qe.boneTexture===null&&Qe.computeBoneTexture(),ge.setValue(O,"boneTexture",Qe.boneTexture,I))}X.isBatchedMesh&&(ge.setOptional(O,X,"batchingTexture"),ge.setValue(O,"batchingTexture",X._matricesTexture,I),ge.setOptional(O,X,"batchingIdTexture"),ge.setValue(O,"batchingIdTexture",X._indirectTexture,I),ge.setOptional(O,X,"batchingColorTexture"),X._colorsTexture!==null&&ge.setValue(O,"batchingColorTexture",X._colorsTexture,I));const Ss=$.morphAttributes;if((Ss.position!==void 0||Ss.normal!==void 0||Ss.color!==void 0)&&Ht.update(X,$,on),(Ye||Ut.receiveShadow!==X.receiveShadow)&&(Ut.receiveShadow=X.receiveShadow,ge.setValue(O,"receiveShadow",X.receiveShadow)),Z.isMeshGouraudMaterial&&Z.envMap!==null&&(dn.envMap.value=Lt,dn.flipEnvMap.value=Lt.isCubeTexture&&Lt.isRenderTargetTexture===!1?-1:1),Z.isMeshStandardMaterial&&Z.envMap===null&&W.environment!==null&&(dn.envMapIntensity.value=W.environmentIntensity),Ye&&(ge.setValue(O,"toneMappingExposure",x.toneMappingExposure),Ut.needsLights&&v0(dn,bs),dt&&Z.fog===!0&&gt.refreshFogUniforms(dn,dt),gt.refreshMaterialUniforms(dn,Z,k,H,p.state.transmissionRenderTarget[P.id]),Mo.upload(O,wh(Ut),dn,I)),Z.isShaderMaterial&&Z.uniformsNeedUpdate===!0&&(Mo.upload(O,wh(Ut),dn,I),Z.uniformsNeedUpdate=!1),Z.isSpriteMaterial&&ge.setValue(O,"center",X.center),ge.setValue(O,"modelViewMatrix",X.modelViewMatrix),ge.setValue(O,"normalMatrix",X.normalMatrix),ge.setValue(O,"modelMatrix",X.matrixWorld),Z.isShaderMaterial||Z.isRawShaderMaterial){const Qe=Z.uniformsGroups;for(let Xn=0,qn=Qe.length;Xn<qn;Xn++){const bh=Qe[Xn];G.update(bh,on),G.bind(bh,on)}}return on}function v0(P,W){P.ambientLightColor.needsUpdate=W,P.lightProbe.needsUpdate=W,P.directionalLights.needsUpdate=W,P.directionalLightShadows.needsUpdate=W,P.pointLights.needsUpdate=W,P.pointLightShadows.needsUpdate=W,P.spotLights.needsUpdate=W,P.spotLightShadows.needsUpdate=W,P.rectAreaLights.needsUpdate=W,P.hemisphereLights.needsUpdate=W}function y0(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(P,W,$){Mt.get(P.texture).__webglTexture=W,Mt.get(P.depthTexture).__webglTexture=$;const Z=Mt.get(P);Z.__hasExternalTextures=!0,Z.__autoAllocateDepthBuffer=$===void 0,Z.__autoAllocateDepthBuffer||ot.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Z.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(P,W){const $=Mt.get(P);$.__webglFramebuffer=W,$.__useDefaultFramebuffer=W===void 0},this.setRenderTarget=function(P,W=0,$=0){T=P,S=W,E=$;let Z=!0,X=null,dt=!1,xt=!1;if(P){const Lt=Mt.get(P);if(Lt.__useDefaultFramebuffer!==void 0)ut.bindFramebuffer(O.FRAMEBUFFER,null),Z=!1;else if(Lt.__webglFramebuffer===void 0)I.setupRenderTarget(P);else if(Lt.__hasExternalTextures)I.rebindTextures(P,Mt.get(P.texture).__webglTexture,Mt.get(P.depthTexture).__webglTexture);else if(P.depthBuffer){const It=P.depthTexture;if(Lt.__boundDepthTexture!==It){if(It!==null&&Mt.has(It)&&(P.width!==It.image.width||P.height!==It.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");I.setupDepthRenderbuffer(P)}}const Gt=P.texture;(Gt.isData3DTexture||Gt.isDataArrayTexture||Gt.isCompressedArrayTexture)&&(xt=!0);const qt=Mt.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray(qt[W])?X=qt[W][$]:X=qt[W],dt=!0):P.samples>0&&I.useMultisampledRTT(P)===!1?X=Mt.get(P).__webglMultisampledFramebuffer:Array.isArray(qt)?X=qt[$]:X=qt,A.copy(P.viewport),N.copy(P.scissor),L=P.scissorTest}else A.copy(ft).multiplyScalar(k).floor(),N.copy(Ft).multiplyScalar(k).floor(),L=te;if(ut.bindFramebuffer(O.FRAMEBUFFER,X)&&Z&&ut.drawBuffers(P,X),ut.viewport(A),ut.scissor(N),ut.setScissorTest(L),dt){const Lt=Mt.get(P.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+W,Lt.__webglTexture,$)}else if(xt){const Lt=Mt.get(P.texture),Gt=W||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,Lt.__webglTexture,$||0,Gt)}M=-1},this.readRenderTargetPixels=function(P,W,$,Z,X,dt,xt){if(!(P&&P.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pt=Mt.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&xt!==void 0&&(Pt=Pt[xt]),Pt){ut.bindFramebuffer(O.FRAMEBUFFER,Pt);try{const Lt=P.texture,Gt=Lt.format,qt=Lt.type;if(!pt.textureFormatReadable(Gt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!pt.textureTypeReadable(qt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}W>=0&&W<=P.width-Z&&$>=0&&$<=P.height-X&&O.readPixels(W,$,Z,X,$t.convert(Gt),$t.convert(qt),dt)}finally{const Lt=T!==null?Mt.get(T).__webglFramebuffer:null;ut.bindFramebuffer(O.FRAMEBUFFER,Lt)}}},this.readRenderTargetPixelsAsync=async function(P,W,$,Z,X,dt,xt){if(!(P&&P.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pt=Mt.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&xt!==void 0&&(Pt=Pt[xt]),Pt){const Lt=P.texture,Gt=Lt.format,qt=Lt.type;if(!pt.textureFormatReadable(Gt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!pt.textureTypeReadable(qt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(W>=0&&W<=P.width-Z&&$>=0&&$<=P.height-X){ut.bindFramebuffer(O.FRAMEBUFFER,Pt);const It=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,It),O.bufferData(O.PIXEL_PACK_BUFFER,dt.byteLength,O.STREAM_READ),O.readPixels(W,$,Z,X,$t.convert(Gt),$t.convert(qt),0);const re=T!==null?Mt.get(T).__webglFramebuffer:null;ut.bindFramebuffer(O.FRAMEBUFFER,re);const fe=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await vm(O,fe,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,It),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,dt),O.deleteBuffer(It),O.deleteSync(fe),dt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(P,W=null,$=0){P.isTexture!==!0&&(Vs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),W=arguments[0]||null,P=arguments[1]);const Z=Math.pow(2,-$),X=Math.floor(P.image.width*Z),dt=Math.floor(P.image.height*Z),xt=W!==null?W.x:0,Pt=W!==null?W.y:0;I.setTexture2D(P,0),O.copyTexSubImage2D(O.TEXTURE_2D,$,0,0,xt,Pt,X,dt),ut.unbindTexture()},this.copyTextureToTexture=function(P,W,$=null,Z=null,X=0){P.isTexture!==!0&&(Vs("WebGLRenderer: copyTextureToTexture function signature has changed."),Z=arguments[0]||null,P=arguments[1],W=arguments[2],X=arguments[3]||0,$=null);let dt,xt,Pt,Lt,Gt,qt,It,re,fe;const me=P.isCompressedTexture?P.mipmaps[X]:P.image;$!==null?(dt=$.max.x-$.min.x,xt=$.max.y-$.min.y,Pt=$.isBox3?$.max.z-$.min.z:1,Lt=$.min.x,Gt=$.min.y,qt=$.isBox3?$.min.z:0):(dt=me.width,xt=me.height,Pt=me.depth||1,Lt=0,Gt=0,qt=0),Z!==null?(It=Z.x,re=Z.y,fe=Z.z):(It=0,re=0,fe=0);const Ge=$t.convert(W.format),oe=$t.convert(W.type);let Ut;W.isData3DTexture?(I.setTexture3D(W,0),Ut=O.TEXTURE_3D):W.isDataArrayTexture||W.isCompressedArrayTexture?(I.setTexture2DArray(W,0),Ut=O.TEXTURE_2D_ARRAY):(I.setTexture2D(W,0),Ut=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,W.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,W.unpackAlignment);const Rn=O.getParameter(O.UNPACK_ROW_LENGTH),ae=O.getParameter(O.UNPACK_IMAGE_HEIGHT),on=O.getParameter(O.UNPACK_SKIP_PIXELS),Di=O.getParameter(O.UNPACK_SKIP_ROWS),Ye=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,me.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,me.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Lt),O.pixelStorei(O.UNPACK_SKIP_ROWS,Gt),O.pixelStorei(O.UNPACK_SKIP_IMAGES,qt);const bs=P.isDataArrayTexture||P.isData3DTexture,ge=W.isDataArrayTexture||W.isData3DTexture;if(P.isRenderTargetTexture||P.isDepthTexture){const dn=Mt.get(P),Ss=Mt.get(W),Qe=Mt.get(dn.__renderTarget),Xn=Mt.get(Ss.__renderTarget);ut.bindFramebuffer(O.READ_FRAMEBUFFER,Qe.__webglFramebuffer),ut.bindFramebuffer(O.DRAW_FRAMEBUFFER,Xn.__webglFramebuffer);for(let qn=0;qn<Pt;qn++)bs&&O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Mt.get(P).__webglTexture,X,qt+qn),P.isDepthTexture?(ge&&O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Mt.get(W).__webglTexture,X,fe+qn),O.blitFramebuffer(Lt,Gt,dt,xt,It,re,dt,xt,O.DEPTH_BUFFER_BIT,O.NEAREST)):ge?O.copyTexSubImage3D(Ut,X,It,re,fe+qn,Lt,Gt,dt,xt):O.copyTexSubImage2D(Ut,X,It,re,fe+qn,Lt,Gt,dt,xt);ut.bindFramebuffer(O.READ_FRAMEBUFFER,null),ut.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else ge?P.isDataTexture||P.isData3DTexture?O.texSubImage3D(Ut,X,It,re,fe,dt,xt,Pt,Ge,oe,me.data):W.isCompressedArrayTexture?O.compressedTexSubImage3D(Ut,X,It,re,fe,dt,xt,Pt,Ge,me.data):O.texSubImage3D(Ut,X,It,re,fe,dt,xt,Pt,Ge,oe,me):P.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,X,It,re,dt,xt,Ge,oe,me.data):P.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,X,It,re,me.width,me.height,Ge,me.data):O.texSubImage2D(O.TEXTURE_2D,X,It,re,dt,xt,Ge,oe,me);O.pixelStorei(O.UNPACK_ROW_LENGTH,Rn),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,ae),O.pixelStorei(O.UNPACK_SKIP_PIXELS,on),O.pixelStorei(O.UNPACK_SKIP_ROWS,Di),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Ye),X===0&&W.generateMipmaps&&O.generateMipmap(Ut),ut.unbindTexture()},this.copyTextureToTexture3D=function(P,W,$=null,Z=null,X=0){return P.isTexture!==!0&&(Vs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),$=arguments[0]||null,Z=arguments[1]||null,P=arguments[2],W=arguments[3],X=arguments[4]||0),Vs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(P,W,$,Z,X)},this.initRenderTarget=function(P){Mt.get(P).__webglFramebuffer===void 0&&I.setupRenderTarget(P)},this.initTexture=function(P){P.isCubeTexture?I.setTextureCube(P,0):P.isData3DTexture?I.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?I.setTexture2DArray(P,0):I.setTexture2D(P,0),ut.unbindTexture()},this.resetState=function(){S=0,E=0,T=null,ut.reset(),de.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=ie._getDrawingBufferColorSpace(t),e.unpackColorSpace=ie._getUnpackColorSpace()}}class Yo{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Vt(t),this.near=e,this.far=n}clone(){return new Yo(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class R_ extends be{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Mn,this.environmentIntensity=1,this.environmentRotation=new Mn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Uf extends He{constructor(t=null,e=1,n=1,s,r,o,a,c,l=Ae,h=Ae,u,f){super(null,o,a,c,l,h,s,r,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ff extends ci{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Vt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Ao=new C,Ro=new C,Mu=new ue,Cs=new cr,kr=new xs,Pa=new C,bu=new C;class C_ extends be{constructor(t=new Pe,e=new Ff){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Ao.fromBufferAttribute(e,s-1),Ro.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Ao.distanceTo(Ro);t.setAttribute("lineDistance",new se(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),kr.copy(n.boundingSphere),kr.applyMatrix4(s),kr.radius+=r,t.ray.intersectsSphere(kr)===!1)return;Mu.copy(s).invert(),Cs.copy(t.ray).applyMatrix4(Mu);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){const d=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let v=d,g=m-1;v<g;v+=l){const p=h.getX(v),_=h.getX(v+1),y=Br(this,t,Cs,c,p,_);y&&e.push(y)}if(this.isLineLoop){const v=h.getX(m-1),g=h.getX(d),p=Br(this,t,Cs,c,v,g);p&&e.push(p)}}else{const d=Math.max(0,o.start),m=Math.min(f.count,o.start+o.count);for(let v=d,g=m-1;v<g;v+=l){const p=Br(this,t,Cs,c,v,v+1);p&&e.push(p)}if(this.isLineLoop){const v=Br(this,t,Cs,c,m-1,d);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Br(i,t,e,n,s,r){const o=i.geometry.attributes.position;if(Ao.fromBufferAttribute(o,s),Ro.fromBufferAttribute(o,r),e.distanceSqToSegment(Ao,Ro,Pa,bu)>n)return;Pa.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Pa);if(!(c<t.near||c>t.far))return{distance:c,point:bu.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const Su=new C,Eu=new C;class Jl extends C_{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)Su.fromBufferAttribute(e,s),Eu.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Su.distanceTo(Eu);t.setAttribute("lineDistance",new se(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class P_ extends ci{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new Vt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Tu=new ue,dl=new cr,Hr=new xs,Gr=new C;class L_ extends be{constructor(t=new Pe,e=new P_){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Hr.copy(n.boundingSphere),Hr.applyMatrix4(s),Hr.radius+=r,t.ray.intersectsSphere(Hr)===!1)return;Tu.copy(s).invert(),dl.copy(t.ray).applyMatrix4(Tu);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,u=n.attributes.position;if(l!==null){const f=Math.max(0,o.start),d=Math.min(l.count,o.start+o.count);for(let m=f,v=d;m<v;m++){const g=l.getX(m);Gr.fromBufferAttribute(u,g),Au(Gr,g,c,s,t,e,this)}}else{const f=Math.max(0,o.start),d=Math.min(u.count,o.start+o.count);for(let m=f,v=d;m<v;m++)Gr.fromBufferAttribute(u,m),Au(Gr,m,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Au(i,t,e,n,s,r,o){const a=dl.distanceSqToPoint(i);if(a<e){const c=new C;dl.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class Tn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);const h=n[s],f=n[s+1]-h,d=(o-h)/f;return(s+d)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),c=e||(o.isVector2?new et:new C);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new C,s=[],r=[],o=[],a=new C,c=new ue;for(let d=0;d<=t;d++){const m=d/t;s[d]=this.getTangentAt(m,new C)}r[0]=new C,o[0]=new C;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),f<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(s[d-1],s[d]),a.length()>Number.EPSILON){a.normalize();const m=Math.acos(Te(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(c.makeRotationAxis(a,m))}o[d].crossVectors(s[d],r[d])}if(e===!0){let d=Math.acos(Te(r[0].dot(r[t]),-1,1));d/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(d=-d);for(let m=1;m<=t;m++)r[m].applyMatrix4(c.makeRotationAxis(s[m],d*m)),o[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Ql extends Tn{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new et){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,d=l-this.aY;c=f*h-d*u+this.aX,l=f*u+d*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class I_ extends Ql{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function th(){let i=0,t=0,e=0,n=0;function s(r,o,a,c){i=r,t=a,e=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,u){let f=(o-r)/l-(a-r)/(l+h)+(a-o)/h,d=(a-o)/h-(c-o)/(h+u)+(c-a)/u;f*=h,d*=h,s(o,a,f,d)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const Vr=new C,La=new th,Ia=new th,Da=new th;class D_ extends Tn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new C){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%r]:(Vr.subVectors(s[0],s[1]).add(s[0]),l=Vr);const u=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(Vr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Vr),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let m=Math.pow(l.distanceToSquared(u),d),v=Math.pow(u.distanceToSquared(f),d),g=Math.pow(f.distanceToSquared(h),d);v<1e-4&&(v=1),m<1e-4&&(m=v),g<1e-4&&(g=v),La.initNonuniformCatmullRom(l.x,u.x,f.x,h.x,m,v,g),Ia.initNonuniformCatmullRom(l.y,u.y,f.y,h.y,m,v,g),Da.initNonuniformCatmullRom(l.z,u.z,f.z,h.z,m,v,g)}else this.curveType==="catmullrom"&&(La.initCatmullRom(l.x,u.x,f.x,h.x,this.tension),Ia.initCatmullRom(l.y,u.y,f.y,h.y,this.tension),Da.initCatmullRom(l.z,u.z,f.z,h.z,this.tension));return n.set(La.calc(c),Ia.calc(c),Da.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new C().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Ru(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+r+o)*c+(-3*e+3*n-2*r-o)*a+r*i+e}function N_(i,t){const e=1-i;return e*e*t}function U_(i,t){return 2*(1-i)*i*t}function F_(i,t){return i*i*t}function $s(i,t,e,n){return N_(i,t)+U_(i,e)+F_(i,n)}function O_(i,t){const e=1-i;return e*e*e*t}function z_(i,t){const e=1-i;return 3*e*e*i*t}function k_(i,t){return 3*(1-i)*i*i*t}function B_(i,t){return i*i*i*t}function Zs(i,t,e,n,s){return O_(i,t)+z_(i,e)+k_(i,n)+B_(i,s)}class Of extends Tn{constructor(t=new et,e=new et,n=new et,s=new et){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new et){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Zs(t,s.x,r.x,o.x,a.x),Zs(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class H_ extends Tn{constructor(t=new C,e=new C,n=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new C){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Zs(t,s.x,r.x,o.x,a.x),Zs(t,s.y,r.y,o.y,a.y),Zs(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class zf extends Tn{constructor(t=new et,e=new et){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new et){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new et){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class G_ extends Tn{constructor(t=new C,e=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new C){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new C){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class kf extends Tn{constructor(t=new et,e=new et,n=new et){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new et){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set($s(t,s.x,r.x,o.x),$s(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class V_ extends Tn{constructor(t=new C,e=new C,n=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new C){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set($s(t,s.x,r.x,o.x),$s(t,s.y,r.y,o.y),$s(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Bf extends Tn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new et){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(Ru(a,c.x,l.x,h.x,u.x),Ru(a,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new et().fromArray(s))}return this}}var fl=Object.freeze({__proto__:null,ArcCurve:I_,CatmullRomCurve3:D_,CubicBezierCurve:Of,CubicBezierCurve3:H_,EllipseCurve:Ql,LineCurve:zf,LineCurve3:G_,QuadraticBezierCurve:kf,QuadraticBezierCurve3:V_,SplineCurve:Bf});class W_ extends Tn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new fl[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new fl[s.type]().fromJSON(s))}return this}}class Cu extends W_{constructor(t){super(),this.type="Path",this.currentPoint=new et,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new zf(this.currentPoint.clone(),new et(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new kf(this.currentPoint.clone(),new et(t,e),new et(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){const a=new Of(this.currentPoint.clone(),new et(t,e),new et(n,s),new et(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Bf(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,s,r,o,a,c),this}absellipse(t,e,n,s,r,o,a,c){const l=new Ql(t,e,n,s,r,o,a,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Li extends Pe{constructor(t=[new et(0,-.5),new et(.5,0),new et(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Te(s,0,Math.PI*2);const r=[],o=[],a=[],c=[],l=[],h=1/e,u=new C,f=new et,d=new C,m=new C,v=new C;let g=0,p=0;for(let _=0;_<=t.length-1;_++)switch(_){case 0:g=t[_+1].x-t[_].x,p=t[_+1].y-t[_].y,d.x=p*1,d.y=-g,d.z=p*0,v.copy(d),d.normalize(),c.push(d.x,d.y,d.z);break;case t.length-1:c.push(v.x,v.y,v.z);break;default:g=t[_+1].x-t[_].x,p=t[_+1].y-t[_].y,d.x=p*1,d.y=-g,d.z=p*0,m.copy(d),d.x+=v.x,d.y+=v.y,d.z+=v.z,d.normalize(),c.push(d.x,d.y,d.z),v.copy(m)}for(let _=0;_<=e;_++){const y=n+_*h*s,x=Math.sin(y),b=Math.cos(y);for(let S=0;S<=t.length-1;S++){u.x=t[S].x*x,u.y=t[S].y,u.z=t[S].x*b,o.push(u.x,u.y,u.z),f.x=_/e,f.y=S/(t.length-1),a.push(f.x,f.y);const E=c[3*S+0]*x,T=c[3*S+1],M=c[3*S+0]*b;l.push(E,T,M)}}for(let _=0;_<e;_++)for(let y=0;y<t.length-1;y++){const x=y+_*t.length,b=x,S=x+t.length,E=x+t.length+1,T=x+1;r.push(b,S,T),r.push(E,T,S)}this.setIndex(r),this.setAttribute("position",new se(o,3)),this.setAttribute("uv",new se(a,2)),this.setAttribute("normal",new se(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Li(t.points,t.segments,t.phiStart,t.phiLength)}}class K extends Pe{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],f=[],d=[];let m=0;const v=[],g=n/2;let p=0;_(),o===!1&&(t>0&&y(!0),e>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new se(u,3)),this.setAttribute("normal",new se(f,3)),this.setAttribute("uv",new se(d,2));function _(){const x=new C,b=new C;let S=0;const E=(e-t)/n;for(let T=0;T<=r;T++){const M=[],w=T/r,A=w*(e-t)+t;for(let N=0;N<=s;N++){const L=N/s,U=L*c+a,F=Math.sin(U),D=Math.cos(U);b.x=A*F,b.y=-w*n+g,b.z=A*D,u.push(b.x,b.y,b.z),x.set(F,E,D).normalize(),f.push(x.x,x.y,x.z),d.push(L,1-w),M.push(m++)}v.push(M)}for(let T=0;T<s;T++)for(let M=0;M<r;M++){const w=v[M][T],A=v[M+1][T],N=v[M+1][T+1],L=v[M][T+1];(t>0||M!==0)&&(h.push(w,A,L),S+=3),(e>0||M!==r-1)&&(h.push(A,N,L),S+=3)}l.addGroup(p,S,0),p+=S}function y(x){const b=m,S=new et,E=new C;let T=0;const M=x===!0?t:e,w=x===!0?1:-1;for(let N=1;N<=s;N++)u.push(0,g*w,0),f.push(0,w,0),d.push(.5,.5),m++;const A=m;for(let N=0;N<=s;N++){const U=N/s*c+a,F=Math.cos(U),D=Math.sin(U);E.x=M*D,E.y=g*w,E.z=M*F,u.push(E.x,E.y,E.z),f.push(0,w,0),S.x=F*.5+.5,S.y=D*.5*w+.5,d.push(S.x,S.y),m++}for(let N=0;N<s;N++){const L=b+N,U=A+N;x===!0?h.push(U,U+1,L):h.push(U+1,U,L),T+=3}l.addGroup(p,T,x===!0?1:2),p+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new K(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class jt extends K{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new jt(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class $o extends Pe{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],o=[];a(s),l(n),h(),this.setAttribute("position",new se(r,3)),this.setAttribute("normal",new se(r.slice(),3)),this.setAttribute("uv",new se(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(_){const y=new C,x=new C,b=new C;for(let S=0;S<e.length;S+=3)d(e[S+0],y),d(e[S+1],x),d(e[S+2],b),c(y,x,b,_)}function c(_,y,x,b){const S=b+1,E=[];for(let T=0;T<=S;T++){E[T]=[];const M=_.clone().lerp(x,T/S),w=y.clone().lerp(x,T/S),A=S-T;for(let N=0;N<=A;N++)N===0&&T===S?E[T][N]=M:E[T][N]=M.clone().lerp(w,N/A)}for(let T=0;T<S;T++)for(let M=0;M<2*(S-T)-1;M++){const w=Math.floor(M/2);M%2===0?(f(E[T][w+1]),f(E[T+1][w]),f(E[T][w])):(f(E[T][w+1]),f(E[T+1][w+1]),f(E[T+1][w]))}}function l(_){const y=new C;for(let x=0;x<r.length;x+=3)y.x=r[x+0],y.y=r[x+1],y.z=r[x+2],y.normalize().multiplyScalar(_),r[x+0]=y.x,r[x+1]=y.y,r[x+2]=y.z}function h(){const _=new C;for(let y=0;y<r.length;y+=3){_.x=r[y+0],_.y=r[y+1],_.z=r[y+2];const x=g(_)/2/Math.PI+.5,b=p(_)/Math.PI+.5;o.push(x,1-b)}m(),u()}function u(){for(let _=0;_<o.length;_+=6){const y=o[_+0],x=o[_+2],b=o[_+4],S=Math.max(y,x,b),E=Math.min(y,x,b);S>.9&&E<.1&&(y<.2&&(o[_+0]+=1),x<.2&&(o[_+2]+=1),b<.2&&(o[_+4]+=1))}}function f(_){r.push(_.x,_.y,_.z)}function d(_,y){const x=_*3;y.x=t[x+0],y.y=t[x+1],y.z=t[x+2]}function m(){const _=new C,y=new C,x=new C,b=new C,S=new et,E=new et,T=new et;for(let M=0,w=0;M<r.length;M+=9,w+=6){_.set(r[M+0],r[M+1],r[M+2]),y.set(r[M+3],r[M+4],r[M+5]),x.set(r[M+6],r[M+7],r[M+8]),S.set(o[w+0],o[w+1]),E.set(o[w+2],o[w+3]),T.set(o[w+4],o[w+5]),b.copy(_).add(y).add(x).divideScalar(3);const A=g(b);v(S,w+0,_,A),v(E,w+2,y,A),v(T,w+4,x,A)}}function v(_,y,x,b){b<0&&_.x===1&&(o[y]=_.x-1),x.x===0&&x.z===0&&(o[y]=b/2/Math.PI+.5)}function g(_){return Math.atan2(_.z,-_.x)}function p(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $o(t.vertices,t.indices,t.radius,t.details)}}class Hf extends Cu{constructor(t){super(t),this.uuid=Pi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new Cu().fromJSON(s))}return this}}const X_={triangulate:function(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=Gf(i,0,s,e,!0);const o=[];if(!r||r.next===r.prev)return o;let a,c,l,h,u,f,d;if(n&&(r=K_(i,t,r,e)),i.length>80*e){a=l=i[0],c=h=i[1];for(let m=e;m<s;m+=e)u=i[m],f=i[m+1],u<a&&(a=u),f<c&&(c=f),u>l&&(l=u),f>h&&(h=f);d=Math.max(l-a,h-c),d=d!==0?32767/d:0}return nr(r,o,e,a,c,d,0),o}};function Gf(i,t,e,n,s){let r,o;if(s===ax(i,t,e,n)>0)for(r=t;r<e;r+=n)o=Pu(r,i[r],i[r+1],o);else for(r=e-n;r>=t;r-=n)o=Pu(r,i[r],i[r+1],o);return o&&Zo(o,o.next)&&(sr(o),o=o.next),o}function Ci(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Zo(e,e.next)||_e(e.prev,e,e.next)===0)){if(sr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function nr(i,t,e,n,s,r,o){if(!i)return;!o&&r&&ex(i,n,s,r);let a=i,c,l;for(;i.prev!==i.next;){if(c=i.prev,l=i.next,r?Y_(i,n,s,r):q_(i)){t.push(c.i/e|0),t.push(i.i/e|0),t.push(l.i/e|0),sr(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=$_(Ci(i),t,e),nr(i,t,e,n,s,r,2)):o===2&&Z_(i,t,e,n,s,r):nr(Ci(i),t,e,n,s,r,1);break}}}function q_(i){const t=i.prev,e=i,n=i.next;if(_e(t,e,n)>=0)return!1;const s=t.x,r=e.x,o=n.x,a=t.y,c=e.y,l=n.y,h=s<r?s<o?s:o:r<o?r:o,u=a<c?a<l?a:l:c<l?c:l,f=s>r?s>o?s:o:r>o?r:o,d=a>c?a>l?a:l:c>l?c:l;let m=n.next;for(;m!==t;){if(m.x>=h&&m.x<=f&&m.y>=u&&m.y<=d&&is(s,a,r,c,o,l,m.x,m.y)&&_e(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Y_(i,t,e,n){const s=i.prev,r=i,o=i.next;if(_e(s,r,o)>=0)return!1;const a=s.x,c=r.x,l=o.x,h=s.y,u=r.y,f=o.y,d=a<c?a<l?a:l:c<l?c:l,m=h<u?h<f?h:f:u<f?u:f,v=a>c?a>l?a:l:c>l?c:l,g=h>u?h>f?h:f:u>f?u:f,p=pl(d,m,t,e,n),_=pl(v,g,t,e,n);let y=i.prevZ,x=i.nextZ;for(;y&&y.z>=p&&x&&x.z<=_;){if(y.x>=d&&y.x<=v&&y.y>=m&&y.y<=g&&y!==s&&y!==o&&is(a,h,c,u,l,f,y.x,y.y)&&_e(y.prev,y,y.next)>=0||(y=y.prevZ,x.x>=d&&x.x<=v&&x.y>=m&&x.y<=g&&x!==s&&x!==o&&is(a,h,c,u,l,f,x.x,x.y)&&_e(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;y&&y.z>=p;){if(y.x>=d&&y.x<=v&&y.y>=m&&y.y<=g&&y!==s&&y!==o&&is(a,h,c,u,l,f,y.x,y.y)&&_e(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;x&&x.z<=_;){if(x.x>=d&&x.x<=v&&x.y>=m&&x.y<=g&&x!==s&&x!==o&&is(a,h,c,u,l,f,x.x,x.y)&&_e(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function $_(i,t,e){let n=i;do{const s=n.prev,r=n.next.next;!Zo(s,r)&&Vf(s,n,n.next,r)&&ir(s,r)&&ir(r,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),sr(n),sr(n.next),n=i=r),n=n.next}while(n!==i);return Ci(n)}function Z_(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&sx(o,a)){let c=Wf(o,a);o=Ci(o,o.next),c=Ci(c,c.next),nr(o,t,e,n,s,r,0),nr(c,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function K_(i,t,e,n){const s=[];let r,o,a,c,l;for(r=0,o=t.length;r<o;r++)a=t[r]*n,c=r<o-1?t[r+1]*n:i.length,l=Gf(i,a,c,n,!1),l===l.next&&(l.steiner=!0),s.push(ix(l));for(s.sort(j_),r=0;r<s.length;r++)e=J_(s[r],e);return e}function j_(i,t){return i.x-t.x}function J_(i,t){const e=Q_(i,t);if(!e)return t;const n=Wf(e,i);return Ci(n,n.next),Ci(e,e.next)}function Q_(i,t){let e=t,n=-1/0,s;const r=i.x,o=i.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const f=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=r&&f>n&&(n=f,s=e.x<e.next.x?e:e.next,f===r))return s}e=e.next}while(e!==t);if(!s)return null;const a=s,c=s.x,l=s.y;let h=1/0,u;e=s;do r>=e.x&&e.x>=c&&r!==e.x&&is(o<l?r:n,o,c,l,o<l?n:r,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(r-e.x),ir(e,i)&&(u<h||u===h&&(e.x>s.x||e.x===s.x&&tx(s,e)))&&(s=e,h=u)),e=e.next;while(e!==a);return s}function tx(i,t){return _e(i.prev,i,t.prev)<0&&_e(t.next,i,i.next)<0}function ex(i,t,e,n){let s=i;do s.z===0&&(s.z=pl(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,nx(s)}function nx(i){let t,e,n,s,r,o,a,c,l=1;do{for(e=i,i=null,r=null,o=0;e;){for(o++,n=e,a=0,t=0;t<l&&(a++,n=n.nextZ,!!n);t++);for(c=l;a>0||c>0&&n;)a!==0&&(c===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,a--):(s=n,n=n.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;e=n}r.nextZ=null,l*=2}while(o>1);return i}function pl(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function ix(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function is(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function sx(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!rx(i,t)&&(ir(i,t)&&ir(t,i)&&ox(i,t)&&(_e(i.prev,i,t.prev)||_e(i,t.prev,t))||Zo(i,t)&&_e(i.prev,i,i.next)>0&&_e(t.prev,t,t.next)>0)}function _e(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Zo(i,t){return i.x===t.x&&i.y===t.y}function Vf(i,t,e,n){const s=Xr(_e(i,t,e)),r=Xr(_e(i,t,n)),o=Xr(_e(e,n,i)),a=Xr(_e(e,n,t));return!!(s!==r&&o!==a||s===0&&Wr(i,e,t)||r===0&&Wr(i,n,t)||o===0&&Wr(e,i,n)||a===0&&Wr(e,t,n))}function Wr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Xr(i){return i>0?1:i<0?-1:0}function rx(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Vf(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function ir(i,t){return _e(i.prev,i,i.next)<0?_e(i,t,i.next)>=0&&_e(i,i.prev,t)>=0:_e(i,t,i.prev)<0||_e(i,i.next,t)<0}function ox(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Wf(i,t){const e=new ml(i.i,i.x,i.y),n=new ml(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Pu(i,t,e,n){const s=new ml(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function sr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function ml(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function ax(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}class Ks{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Ks.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];Lu(t),Iu(n,t);let o=t.length;e.forEach(Lu);for(let c=0;c<e.length;c++)s.push(o),o+=e[c].length,Iu(n,e[c]);const a=X_.triangulate(n,s);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}}function Lu(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Iu(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class eh extends Pe{constructor(t=new Hf([new et(.5,.5),new et(-.5,.5),new et(-.5,-.5),new et(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let a=0,c=t.length;a<c;a++){const l=t[a];o(l)}this.setAttribute("position",new se(s,3)),this.setAttribute("uv",new se(r,2)),this.computeVertexNormals();function o(a){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,m=e.bevelSize!==void 0?e.bevelSize:d-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,_=e.UVGenerator!==void 0?e.UVGenerator:cx;let y,x=!1,b,S,E,T;p&&(y=p.getSpacedPoints(h),x=!0,f=!1,b=p.computeFrenetFrames(h,!1),S=new C,E=new C,T=new C),f||(g=0,d=0,m=0,v=0);const M=a.extractPoints(l);let w=M.shape;const A=M.holes;if(!Ks.isClockWise(w)){w=w.reverse();for(let nt=0,lt=A.length;nt<lt;nt++){const O=A[nt];Ks.isClockWise(O)&&(A[nt]=O.reverse())}}const L=Ks.triangulateShape(w,A),U=w;for(let nt=0,lt=A.length;nt<lt;nt++){const O=A[nt];w=w.concat(O)}function F(nt,lt,O){return lt||console.error("THREE.ExtrudeGeometry: vec does not exist"),nt.clone().addScaledVector(lt,O)}const D=w.length,H=L.length;function k(nt,lt,O){let yt,ot,pt;const ut=nt.x-lt.x,zt=nt.y-lt.y,Mt=O.x-nt.x,I=O.y-nt.y,R=ut*ut+zt*zt,q=ut*I-zt*Mt;if(Math.abs(q)>Number.EPSILON){const Q=Math.sqrt(R),st=Math.sqrt(Mt*Mt+I*I),tt=lt.x-zt/Q,Ct=lt.y+ut/Q,gt=O.x-I/st,bt=O.y+Mt/st,Qt=((gt-tt)*I-(bt-Ct)*Mt)/(ut*I-zt*Mt);yt=tt+ut*Qt-nt.x,ot=Ct+zt*Qt-nt.y;const ct=yt*yt+ot*ot;if(ct<=2)return new et(yt,ot);pt=Math.sqrt(ct/2)}else{let Q=!1;ut>Number.EPSILON?Mt>Number.EPSILON&&(Q=!0):ut<-Number.EPSILON?Mt<-Number.EPSILON&&(Q=!0):Math.sign(zt)===Math.sign(I)&&(Q=!0),Q?(yt=-zt,ot=ut,pt=Math.sqrt(R)):(yt=ut,ot=zt,pt=Math.sqrt(R/2))}return new et(yt/pt,ot/pt)}const Y=[];for(let nt=0,lt=U.length,O=lt-1,yt=nt+1;nt<lt;nt++,O++,yt++)O===lt&&(O=0),yt===lt&&(yt=0),Y[nt]=k(U[nt],U[O],U[yt]);const rt=[];let ft,Ft=Y.concat();for(let nt=0,lt=A.length;nt<lt;nt++){const O=A[nt];ft=[];for(let yt=0,ot=O.length,pt=ot-1,ut=yt+1;yt<ot;yt++,pt++,ut++)pt===ot&&(pt=0),ut===ot&&(ut=0),ft[yt]=k(O[yt],O[pt],O[ut]);rt.push(ft),Ft=Ft.concat(ft)}for(let nt=0;nt<g;nt++){const lt=nt/g,O=d*Math.cos(lt*Math.PI/2),yt=m*Math.sin(lt*Math.PI/2)+v;for(let ot=0,pt=U.length;ot<pt;ot++){const ut=F(U[ot],Y[ot],yt);ht(ut.x,ut.y,-O)}for(let ot=0,pt=A.length;ot<pt;ot++){const ut=A[ot];ft=rt[ot];for(let zt=0,Mt=ut.length;zt<Mt;zt++){const I=F(ut[zt],ft[zt],yt);ht(I.x,I.y,-O)}}}const te=m+v;for(let nt=0;nt<D;nt++){const lt=f?F(w[nt],Ft[nt],te):w[nt];x?(E.copy(b.normals[0]).multiplyScalar(lt.x),S.copy(b.binormals[0]).multiplyScalar(lt.y),T.copy(y[0]).add(E).add(S),ht(T.x,T.y,T.z)):ht(lt.x,lt.y,0)}for(let nt=1;nt<=h;nt++)for(let lt=0;lt<D;lt++){const O=f?F(w[lt],Ft[lt],te):w[lt];x?(E.copy(b.normals[nt]).multiplyScalar(O.x),S.copy(b.binormals[nt]).multiplyScalar(O.y),T.copy(y[nt]).add(E).add(S),ht(T.x,T.y,T.z)):ht(O.x,O.y,u/h*nt)}for(let nt=g-1;nt>=0;nt--){const lt=nt/g,O=d*Math.cos(lt*Math.PI/2),yt=m*Math.sin(lt*Math.PI/2)+v;for(let ot=0,pt=U.length;ot<pt;ot++){const ut=F(U[ot],Y[ot],yt);ht(ut.x,ut.y,u+O)}for(let ot=0,pt=A.length;ot<pt;ot++){const ut=A[ot];ft=rt[ot];for(let zt=0,Mt=ut.length;zt<Mt;zt++){const I=F(ut[zt],ft[zt],yt);x?ht(I.x,I.y+y[h-1].y,y[h-1].x+O):ht(I.x,I.y,u+O)}}}J(),at();function J(){const nt=s.length/3;if(f){let lt=0,O=D*lt;for(let yt=0;yt<H;yt++){const ot=L[yt];Nt(ot[2]+O,ot[1]+O,ot[0]+O)}lt=h+g*2,O=D*lt;for(let yt=0;yt<H;yt++){const ot=L[yt];Nt(ot[0]+O,ot[1]+O,ot[2]+O)}}else{for(let lt=0;lt<H;lt++){const O=L[lt];Nt(O[2],O[1],O[0])}for(let lt=0;lt<H;lt++){const O=L[lt];Nt(O[0]+D*h,O[1]+D*h,O[2]+D*h)}}n.addGroup(nt,s.length/3-nt,0)}function at(){const nt=s.length/3;let lt=0;St(U,lt),lt+=U.length;for(let O=0,yt=A.length;O<yt;O++){const ot=A[O];St(ot,lt),lt+=ot.length}n.addGroup(nt,s.length/3-nt,1)}function St(nt,lt){let O=nt.length;for(;--O>=0;){const yt=O;let ot=O-1;ot<0&&(ot=nt.length-1);for(let pt=0,ut=h+g*2;pt<ut;pt++){const zt=D*pt,Mt=D*(pt+1),I=lt+yt+zt,R=lt+ot+zt,q=lt+ot+Mt,Q=lt+yt+Mt;kt(I,R,q,Q)}}}function ht(nt,lt,O){c.push(nt),c.push(lt),c.push(O)}function Nt(nt,lt,O){Ot(nt),Ot(lt),Ot(O);const yt=s.length/3,ot=_.generateTopUV(n,s,yt-3,yt-2,yt-1);Jt(ot[0]),Jt(ot[1]),Jt(ot[2])}function kt(nt,lt,O,yt){Ot(nt),Ot(lt),Ot(yt),Ot(lt),Ot(O),Ot(yt);const ot=s.length/3,pt=_.generateSideWallUV(n,s,ot-6,ot-3,ot-2,ot-1);Jt(pt[0]),Jt(pt[1]),Jt(pt[3]),Jt(pt[1]),Jt(pt[2]),Jt(pt[3])}function Ot(nt){s.push(c[nt*3+0]),s.push(c[nt*3+1]),s.push(c[nt*3+2])}function Jt(nt){r.push(nt.x),r.push(nt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return lx(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,o=t.shapes.length;r<o;r++){const a=e[t.shapes[r]];n.push(a)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new fl[s.type]().fromJSON(s)),new eh(n,t.options)}}const cx={generateTopUV:function(i,t,e,n,s){const r=t[e*3],o=t[e*3+1],a=t[n*3],c=t[n*3+1],l=t[s*3],h=t[s*3+1];return[new et(r,o),new et(a,c),new et(l,h)]},generateSideWallUV:function(i,t,e,n,s,r){const o=t[e*3],a=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],u=t[n*3+2],f=t[s*3],d=t[s*3+1],m=t[s*3+2],v=t[r*3],g=t[r*3+1],p=t[r*3+2];return Math.abs(a-h)<Math.abs(o-l)?[new et(o,1-c),new et(l,1-u),new et(f,1-m),new et(v,1-p)]:[new et(a,1-c),new et(h,1-u),new et(d,1-m),new et(g,1-p)]}};function lx(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class ee extends $o{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ee(t.radius,t.detail)}}class bn extends $o{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new bn(t.radius,t.detail)}}class Ko extends Pe{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const h=[],u=new C,f=new C,d=[],m=[],v=[],g=[];for(let p=0;p<=n;p++){const _=[],y=p/n;let x=0;p===0&&o===0?x=.5/e:p===n&&c===Math.PI&&(x=-.5/e);for(let b=0;b<=e;b++){const S=b/e;u.x=-t*Math.cos(s+S*r)*Math.sin(o+y*a),u.y=t*Math.cos(o+y*a),u.z=t*Math.sin(s+S*r)*Math.sin(o+y*a),m.push(u.x,u.y,u.z),f.copy(u).normalize(),v.push(f.x,f.y,f.z),g.push(S+x,1-y),_.push(l++)}h.push(_)}for(let p=0;p<n;p++)for(let _=0;_<e;_++){const y=h[p][_+1],x=h[p][_],b=h[p+1][_],S=h[p+1][_+1];(p!==0||o>0)&&d.push(y,x,S),(p!==n-1||c<Math.PI)&&d.push(x,b,S)}this.setIndex(d),this.setAttribute("position",new se(m,3)),this.setAttribute("normal",new se(v,3)),this.setAttribute("uv",new se(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ko(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class hr extends Pe{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],c=[],l=[],h=new C,u=new C,f=new C;for(let d=0;d<=n;d++)for(let m=0;m<=s;m++){const v=m/s*r,g=d/n*Math.PI*2;u.x=(t+e*Math.cos(g))*Math.cos(v),u.y=(t+e*Math.cos(g))*Math.sin(v),u.z=e*Math.sin(g),a.push(u.x,u.y,u.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),f.subVectors(u,h).normalize(),c.push(f.x,f.y,f.z),l.push(m/s),l.push(d/n)}for(let d=1;d<=n;d++)for(let m=1;m<=s;m++){const v=(s+1)*d+m-1,g=(s+1)*(d-1)+m-1,p=(s+1)*(d-1)+m,_=(s+1)*d+m;o.push(v,g,_),o.push(g,p,_)}this.setIndex(o),this.setAttribute("position",new se(a,3)),this.setAttribute("normal",new se(c,3)),this.setAttribute("uv",new se(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new hr(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class hx extends Je{static get type(){return"RawShaderMaterial"}constructor(t){super(t),this.isRawShaderMaterial=!0}}class ux extends ci{static get type(){return"MeshNormalMaterial"}constructor(t){super(),this.isMeshNormalMaterial=!0,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ql,this.normalScale=new et(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}}class sn extends ci{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Vt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Vt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ql,this.normalScale=new et(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mn,this.combine=zl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class jo extends be{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Vt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class dx extends jo{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Vt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Na=new ue,Du=new C,Nu=new C;class nh{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new et(512,512),this.map=null,this.mapPass=null,this.matrix=new ue,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new $l,this._frameExtents=new et(1,1),this._viewportCount=1,this._viewports=[new he(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Du.setFromMatrixPosition(t.matrixWorld),e.position.copy(Du),Nu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Nu),e.updateMatrixWorld(),Na.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Na),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Na)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class fx extends nh{constructor(){super(new We(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){const e=this.camera,n=fs*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height,r=t.distance||e.far;(n!==e.fov||s!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=s,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class px extends jo{constructor(t,e,n=0,s=Math.PI/3,r=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.target=new be,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new fx}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const Uu=new ue,Ps=new C,Ua=new C;class mx extends nh{constructor(){super(new We(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new et(4,2),this._viewportCount=6,this._viewports=[new he(2,1,1,1),new he(0,1,1,1),new he(3,1,1,1),new he(1,1,1,1),new he(3,0,1,1),new he(1,0,1,1)],this._cubeDirections=[new C(1,0,0),new C(-1,0,0),new C(0,0,1),new C(0,0,-1),new C(0,1,0),new C(0,-1,0)],this._cubeUps=[new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,0,1),new C(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Ps.setFromMatrixPosition(t.matrixWorld),n.position.copy(Ps),Ua.copy(n.position),Ua.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Ua),n.updateMatrixWorld(),s.makeTranslation(-Ps.x,-Ps.y,-Ps.z),Uu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Uu)}}class Jo extends jo{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new mx}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class gx extends nh{constructor(){super(new Zl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Fu extends jo{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.target=new be,this.shadow=new gx}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class vx{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Ou(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=Ou();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Ou(){return performance.now()}const zu=new ue;class yx{constructor(t,e,n=0,s=1/0){this.ray=new cr(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Wo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return zu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(zu),this}intersectObject(t,e=!0,n=[]){return gl(t,this,n,e),n.sort(ku),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)gl(t[s],this,n,e);return n.sort(ku),n}}function ku(i,t){return i.distance-t.distance}function gl(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let o=0,a=r.length;o<a;o++)gl(r[o],t,e,!0)}}const Bu=new C,qr=new C;class ih{constructor(t=new C,e=new C){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){Bu.subVectors(t,this.start),qr.subVectors(this.end,this.start);const n=qr.dot(qr);let r=qr.dot(Bu)/n;return e&&(r=Te(r,0,1)),r}closestPointToPoint(t,e,n){const s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}class _x extends Jl{constructor(t=1){const e=[0,0,0,t,0,0,0,0,0,0,t,0,0,0,0,0,0,t],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new Pe;s.setAttribute("position",new se(e,3)),s.setAttribute("color",new se(n,3));const r=new Ff({vertexColors:!0,toneMapped:!1});super(s,r),this.type="AxesHelper"}setColors(t,e,n){const s=new Vt,r=this.geometry.attributes.color.array;return s.set(t),s.toArray(r,0),s.toArray(r,3),s.set(e),s.toArray(r,6),s.toArray(r,9),s.set(n),s.toArray(r,12),s.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ol}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ol);class xx{renderer;scene;camera;onResize=null;canvas;handleResize=()=>this.resize();constructor(t){this.canvas=t,this.renderer=new A_({canvas:t,antialias:!1,powerPreference:"high-performance",stencil:!1}),this.renderer.setClearColor(657935,1),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=nf,this.scene=new R_,this.camera=new We(70,1,.1,500),this.resize(),window.addEventListener("resize",this.handleResize),window.addEventListener("orientationchange",this.handleResize)}resize(){const t=this.canvas.clientWidth||window.innerWidth,e=this.canvas.clientHeight||window.innerHeight;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(t,e,!1),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.onResize?.()}render(){this.renderer.render(this.scene,this.camera)}dispose(){window.removeEventListener("resize",this.handleResize),window.removeEventListener("orientationchange",this.handleResize),this.renderer.dispose()}}class wx{subscribers=new Set;handle=0;last=0;elapsed=0;running=!1;add(t){return this.subscribers.add(t),()=>this.subscribers.delete(t)}start(){if(this.running)return;this.running=!0,this.last=performance.now();const t=e=>{this.handle=requestAnimationFrame(t);const n=Math.min((e-this.last)/1e3,.1);this.last=e,this.elapsed+=n;for(const s of this.subscribers)s(n,this.elapsed)};this.handle=requestAnimationFrame(t)}stop(){this.running&&(cancelAnimationFrame(this.handle),this.running=!1)}}const Mx={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class ur{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const bx=new Zl(-1,1,1,-1,0,1);class Sx extends Pe{constructor(){super(),this.setAttribute("position",new se([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new se([0,2,0,0,2,0],2))}}const Ex=new Sx;class sh{constructor(t){this._mesh=new Kt(Ex,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,bx)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class Xf extends ur{constructor(t,e){super(),this.textureID=e!==void 0?e:"tDiffuse",t instanceof Je?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=Xo.clone(t.uniforms),this.material=new Je({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new sh(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class Hu extends ur{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class Tx extends ur{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class Ax{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new et);this._width=n.width,this._height=n.height,e=new wn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ii}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Xf(Mx),this.copyPass.material.blending=Hn,this.clock=new vx}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),o.needsSwap){if(n){const a=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),c.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Hu!==void 0&&(o instanceof Hu?n=!0:o instanceof Tx&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new et);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Rx extends ur{constructor(t,e,n,s={}){super(),this.pixelSize=t,this.resolution=new et,this.renderResolution=new et,this.pixelatedMaterial=this.createPixelatedMaterial(),this.normalMaterial=new ux,this.fsQuad=new sh(this.pixelatedMaterial),this.scene=e,this.camera=n,this.normalEdgeStrength=s.normalEdgeStrength||.3,this.depthEdgeStrength=s.depthEdgeStrength||.4,this.beautyRenderTarget=new wn,this.beautyRenderTarget.texture.minFilter=Ae,this.beautyRenderTarget.texture.magFilter=Ae,this.beautyRenderTarget.texture.type=ii,this.beautyRenderTarget.depthTexture=new jl,this.normalRenderTarget=new wn,this.normalRenderTarget.texture.minFilter=Ae,this.normalRenderTarget.texture.magFilter=Ae,this.normalRenderTarget.texture.type=ii}dispose(){this.beautyRenderTarget.dispose(),this.normalRenderTarget.dispose(),this.pixelatedMaterial.dispose(),this.normalMaterial.dispose(),this.fsQuad.dispose()}setSize(t,e){this.resolution.set(t,e),this.renderResolution.set(t/this.pixelSize|0,e/this.pixelSize|0);const{x:n,y:s}=this.renderResolution;this.beautyRenderTarget.setSize(n,s),this.normalRenderTarget.setSize(n,s),this.fsQuad.material.uniforms.resolution.value.set(n,s,1/n,1/s)}setPixelSize(t){this.pixelSize=t,this.setSize(this.resolution.x,this.resolution.y)}render(t,e){const n=this.fsQuad.material.uniforms;n.normalEdgeStrength.value=this.normalEdgeStrength,n.depthEdgeStrength.value=this.depthEdgeStrength,t.setRenderTarget(this.beautyRenderTarget),t.render(this.scene,this.camera);const s=this.scene.overrideMaterial;t.setRenderTarget(this.normalRenderTarget),this.scene.overrideMaterial=this.normalMaterial,t.render(this.scene,this.camera),this.scene.overrideMaterial=s,n.tDiffuse.value=this.beautyRenderTarget.texture,n.tDepth.value=this.beautyRenderTarget.depthTexture,n.tNormal.value=this.normalRenderTarget.texture,this.renderToScreen?t.setRenderTarget(null):(t.setRenderTarget(e),this.clear&&t.clear()),this.fsQuad.render(t)}createPixelatedMaterial(){return new Je({uniforms:{tDiffuse:{value:null},tDepth:{value:null},tNormal:{value:null},resolution:{value:new he(this.renderResolution.x,this.renderResolution.y,1/this.renderResolution.x,1/this.renderResolution.y)},normalEdgeStrength:{value:0},depthEdgeStrength:{value:0}},vertexShader:`
				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}
			`,fragmentShader:`
				uniform sampler2D tDiffuse;
				uniform sampler2D tDepth;
				uniform sampler2D tNormal;
				uniform vec4 resolution;
				uniform float normalEdgeStrength;
				uniform float depthEdgeStrength;
				varying vec2 vUv;

				float getDepth(int x, int y) {

					return texture2D( tDepth, vUv + vec2(x, y) * resolution.zw ).r;

				}

				vec3 getNormal(int x, int y) {

					return texture2D( tNormal, vUv + vec2(x, y) * resolution.zw ).rgb * 2.0 - 1.0;

				}

				float depthEdgeIndicator(float depth, vec3 normal) {

					float diff = 0.0;
					diff += clamp(getDepth(1, 0) - depth, 0.0, 1.0);
					diff += clamp(getDepth(-1, 0) - depth, 0.0, 1.0);
					diff += clamp(getDepth(0, 1) - depth, 0.0, 1.0);
					diff += clamp(getDepth(0, -1) - depth, 0.0, 1.0);
					return floor(smoothstep(0.01, 0.02, diff) * 2.) / 2.;

				}

				float neighborNormalEdgeIndicator(int x, int y, float depth, vec3 normal) {

					float depthDiff = getDepth(x, y) - depth;
					vec3 neighborNormal = getNormal(x, y);

					// Edge pixels should yield to faces who's normals are closer to the bias normal.
					vec3 normalEdgeBias = vec3(1., 1., 1.); // This should probably be a parameter.
					float normalDiff = dot(normal - neighborNormal, normalEdgeBias);
					float normalIndicator = clamp(smoothstep(-.01, .01, normalDiff), 0.0, 1.0);

					// Only the shallower pixel should detect the normal edge.
					float depthIndicator = clamp(sign(depthDiff * .25 + .0025), 0.0, 1.0);

					return (1.0 - dot(normal, neighborNormal)) * depthIndicator * normalIndicator;

				}

				float normalEdgeIndicator(float depth, vec3 normal) {

					float indicator = 0.0;

					indicator += neighborNormalEdgeIndicator(0, -1, depth, normal);
					indicator += neighborNormalEdgeIndicator(0, 1, depth, normal);
					indicator += neighborNormalEdgeIndicator(-1, 0, depth, normal);
					indicator += neighborNormalEdgeIndicator(1, 0, depth, normal);

					return step(0.1, indicator);

				}

				void main() {

					vec4 texel = texture2D( tDiffuse, vUv );

					float depth = 0.0;
					vec3 normal = vec3(0.0);

					if (depthEdgeStrength > 0.0 || normalEdgeStrength > 0.0) {

						depth = getDepth(0, 0);
						normal = getNormal(0, 0);

					}

					float dei = 0.0;
					if (depthEdgeStrength > 0.0)
						dei = depthEdgeIndicator(depth, normal);

					float nei = 0.0;
					if (normalEdgeStrength > 0.0)
						nei = normalEdgeIndicator(depth, normal);

					float Strength = dei > 0.0 ? (1.0 - depthEdgeStrength * dei) : (1.0 + normalEdgeStrength * nei);

					gl_FragColor = texel * Strength;

				}
			`})}}const Cx={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class Px extends ur{constructor(){super();const t=Cx;this.uniforms=Xo.clone(t.uniforms),this.material=new hx({name:t.name,uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.fsQuad=new sh(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},ie.getTransfer(this._outputColorSpace)===le&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===sf?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===rf?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===of?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===af?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===cf?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===lf&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const Co=16,Lx={name:"RetroShader",uniforms:{tDiffuse:{value:null},uPixelSize:{value:1},uDither:{value:.06},uPattern:{value:1},uMatrix:{value:8},tDither:{value:null},uDitherSize:{value:64},uQuantize:{value:1},uLevels:{value:8},uPalette:{value:[]},uPaletteCount:{value:0},uVignette:{value:.35},uVignetteRadius:{value:.55},uVignetteSoftness:{value:.6}},vertexShader:`
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float uPixelSize;
    uniform float uDither;
    uniform int uPattern;
    uniform float uMatrix;
    uniform sampler2D tDither;
    uniform float uDitherSize;
    uniform int uQuantize;
    uniform float uLevels;
    uniform vec3 uPalette[${Co}];
    uniform int uPaletteCount;
    uniform float uVignette;
    uniform float uVignetteRadius;
    uniform float uVignetteSoftness;

    varying vec2 vUv;

    // The recursive Bayer construction, without the lookup table: each level
    // is the level below at half scale, plus a quarter of the 2x2 pattern.
    float bayer2(vec2 a) {
      a = floor(a);
      return fract(a.x * 0.5 + a.y * a.y * 0.75);
    }
    float bayer4(vec2 a) { return bayer2(a * 0.5) * 0.25 + bayer2(a); }
    float bayer8(vec2 a) { return bayer4(a * 0.5) * 0.25 + bayer2(a); }

    // Interleaved gradient noise. One line, no texture, and it breaks up flat
    // colour far better than Bayer does — though it keeps a faint diagonal
    // weave of its own, which is either character or a defect depending on
    // what you wanted.
    float interleavedGradient(vec2 a) {
      return fract(52.9829189 * fract(dot(floor(a), vec2(0.06711056, 0.00583715))));
    }

    float thresholdAt(vec2 cell) {
      if (uPattern == 1) {
        // Nearest-sampled and wrap-repeated, so one texel is one chunky pixel.
        return texture2D(tDither, (floor(cell) + 0.5) / uDitherSize).r;
      }
      if (uPattern == 2) return interleavedGradient(cell);
      if (uMatrix < 3.0) return bayer2(cell);
      if (uMatrix < 6.0) return bayer4(cell);
      return bayer8(cell);
    }

    // Squared distances throughout — the square root would not change which
    // swatch wins. Named 'd2' rather than 'distance' because that is a GLSL
    // built-in, and shadowing it is legal but upsets strict drivers.
    vec3 nearestInPalette(vec3 colour) {
      vec3 best = uPalette[0];
      float bestD2 = 1e9;

      for (int i = 0; i < ${Co}; i++) {
        if (i >= uPaletteCount) break;
        // Weighted because the eye does not read the channels equally: green
        // carries most of the luminance and blue almost none, so an unweighted
        // distance picks swatches that measure close and look wrong.
        vec3 delta = (uPalette[i] - colour) * vec3(0.6, 1.0, 0.35);
        float d2 = dot(delta, delta);
        if (d2 < bestD2) {
          bestD2 = d2;
          best = uPalette[i];
        }
      }
      return best;
    }

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      vec3 colour = texel.rgb;

      vec2 offset = vUv - 0.5;
      float radius = length(offset) * 2.0;
      colour *= 1.0 - uVignette * smoothstep(
        uVignetteRadius,
        uVignetteRadius + uVignetteSoftness,
        radius
      );

      // One threshold value per chunky pixel, not per screen pixel — a dither
      // finer than the pixelation reads as noise rather than as pattern.
      vec2 cell = gl_FragCoord.xy / max(uPixelSize, 1.0);
      colour += (thresholdAt(cell) - 0.5) * uDither;

      if (uQuantize == 1) {
        float steps = max(uLevels - 1.0, 1.0);
        colour = floor(colour * steps + 0.5) / steps;
      } else if (uQuantize == 2 && uPaletteCount > 0) {
        colour = nearestInPalette(colour);
      }

      gl_FragColor = vec4(clamp(colour, 0.0, 1.0), texel.a);
    }
  `},Gu=1.9,Yr=5,Ix=.1;function Dx(i){let t=i>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function Nx(i,t=2654435769){const e=i*i,n=new Uint8Array(e),s=new Float32Array(e),r=[],o=[];for(let p=-Yr;p<=Yr;p++)for(let _=-Yr;_<=Yr;_++)r.push(_,p),o.push(Math.exp(-(_*_+p*p)/(2*Gu*Gu)));const a=o.length,c=(p,_)=>{const y=p%i,x=p/i|0;for(let b=0;b<a;b++){const S=(y+r[b*2]+i)%i,E=(x+r[b*2+1]+i)%i;s[E*i+S]+=_*o[b]}},l=(p,_)=>{let y=-1,x=_?-1/0:1/0;for(let b=0;b<e;b++){if(n[b]!==p)continue;const S=s[b];(_?S>x:S<x)&&(x=S,y=b)}return y},h=Dx(t),u=Math.max(1,Math.round(e*Ix));let f=0;for(;f<u;){const p=h()*e|0;n[p]!==1&&(n[p]=1,c(p,1),f++)}for(let p=0;p<e*4;p++){const _=l(1,!0);n[_]=0,c(_,-1);const y=l(0,!1);if(y===_){n[_]=1,c(_,1);break}n[y]=1,c(y,1)}const d=n.slice(),m=s.slice(),v=new Int32Array(e).fill(-1);for(let p=u-1;p>=0;p--){const _=l(1,!0);n[_]=0,c(_,-1),v[_]=p}n.set(d),s.set(m);for(let p=u;p<e;p++){const _=l(0,!1);n[_]=1,c(_,1),v[_]=p}const g=new Uint8Array(new ArrayBuffer(e));for(let p=0;p<e;p++)g[p]=Math.min(255,(v[p]+.5)/e*256);return g}const Ux=400,Fa={uniforms:{uHorizon:{value:new Vt},uZenith:{value:new Vt},uGround:{value:new Vt},uCurve:{value:1},uCloudColor:{value:new Vt},uCloudCover:{value:.5},uCloudSoftness:{value:.2},uCloudScale:{value:1.2},uCloudOpacity:{value:1},uCloudDrift:{value:.01},uTime:{value:0},uSunDirection:{value:new C(0,1,0)},uSunColor:{value:new Vt},uSunSize:{value:.9993},uSunGlow:{value:260},uSunIntensity:{value:1}},vertexShader:`
    varying vec3 vDirection;

    void main() {
      // Left unnormalized and normalized per-fragment instead: interpolating
      // between normalized vertex directions bends toward the chord and would
      // facet the gradient at low segment counts.
      vDirection = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform vec3 uHorizon;
    uniform vec3 uZenith;
    uniform vec3 uGround;
    uniform float uCurve;
    uniform vec3 uCloudColor;
    uniform float uCloudCover;
    uniform float uCloudSoftness;
    uniform float uCloudScale;
    uniform float uCloudOpacity;
    uniform float uCloudDrift;
    uniform float uTime;
    uniform vec3 uSunDirection;
    uniform vec3 uSunColor;
    uniform float uSunSize;
    uniform float uSunGlow;
    uniform float uSunIntensity;

    varying vec3 vDirection;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float valueNoise(vec2 p) {
      vec2 cell = floor(p);
      vec2 f = fract(p);
      // Smoothstep on the interpolant: linear blending between cells leaves
      // visible creases along every cell boundary.
      vec2 blend = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(cell), hash(cell + vec2(1.0, 0.0)), blend.x),
        mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), blend.x),
        blend.y
      );
    }

    // Five octaves, each half the amplitude and twice the frequency. The big
    // ones are the cloud masses, the small ones are their ragged edges.
    float fbm(vec2 p) {
      float sum = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 5; i++) {
        sum += amplitude * valueNoise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return sum;
    }

    void main() {
      vec3 direction = normalize(vDirection);
      float height = direction.y;
      float curve = max(uCurve, 0.01);

      vec3 above = mix(uHorizon, uZenith, pow(clamp(height, 0.0, 1.0), curve));
      vec3 below = mix(uHorizon, uGround, pow(clamp(-height, 0.0, 1.0), curve));
      vec3 colour = height > 0.0 ? above : below;

      // The sun, drawn before the clouds so they pass in front of it.
      //
      // A disc plus a halo, both from the same dot product. The disc alone is a
      // sticker: a real sun is surrounded by scattered light for many times its
      // own diameter, and that halo is most of what makes the sky look lit
      // *by* it rather than merely containing it.
      //
      // uSunSize is a cosine rather than an angle, so the comparison is against
      // the dot product directly and no inverse cosine runs per pixel. (No
      // backticks in here: this whole shader is a template literal, and one
      // inside a comment ends the string several hundred lines early.)
      if (uSunIntensity > 0.0) {
        float toSun = dot(direction, normalize(uSunDirection));
        float halo = pow(max(toSun, 0.0), uSunGlow);
        colour = mix(colour, uSunColor, clamp(halo * 0.6, 0.0, 1.0) * uSunIntensity);
        // A soft edge on the disc. Hard-edged, it aliases badly against a
        // pipeline that renders at a third of display resolution.
        float disc = smoothstep(uSunSize - 0.0004, uSunSize + 0.0004, toSun);
        colour = mix(colour, uSunColor, disc * uSunIntensity);
      }

      if (height > 0.0) {
        // Project the view ray onto a flat layer overhead. Rays close to the
        // horizon travel much further across it before they arrive, so the
        // pattern stretches and crowds toward the horizon on its own — which
        // is the whole reason clouds read as a ceiling rather than a dome.
        vec2 plane = direction.xz / max(height, 0.02);
        vec2 drift = vec2(uTime * uCloudDrift, uTime * uCloudDrift * 0.6);

        float density = fbm(plane * uCloudScale + drift);
        float amount = smoothstep(uCloudCover, uCloudCover + uCloudSoftness, density);
        // Faded out at the horizon, where the projection stretches to
        // infinity and the noise turns to mush.
        amount *= smoothstep(0.0, 0.18, height) * uCloudOpacity;

        colour = mix(colour, uCloudColor, amount);
      }

      gl_FragColor = vec4(colour, 1.0);
    }
  `},qf={horizon:"#bcd4e6",zenith:"#3f7fbf",ground:"#5d6469",curve:.35,cloudColor:"#f2f5f8",cloudCover:.5,cloudSoftness:.22,cloudScale:1.1,cloudOpacity:.95,cloudDrift:.012,sun:!0,sunColor:"#fff6e0",sunSize:1.1,sunGlow:240};class Fx{mesh;material;constructor(){this.material=new Je({name:"Sky",uniforms:Xo.clone(Fa.uniforms),vertexShader:Fa.vertexShader,fragmentShader:Fa.fragmentShader,side:Be,depthWrite:!1,depthTest:!1,fog:!1}),this.mesh=new Kt(new Ko(Ux,32,16),this.material),this.mesh.name="Sky",this.mesh.renderOrder=-1,this.mesh.frustumCulled=!1}apply(t){const e=this.material.uniforms;e.uHorizon.value.set(t.horizon),e.uZenith.value.set(t.zenith),e.uGround.value.set(t.ground),e.uCloudColor.value.set(t.cloudColor),e.uCurve.value=t.curve,e.uCloudCover.value=t.cloudCover,e.uCloudSoftness.value=t.cloudSoftness,e.uCloudScale.value=t.cloudScale,e.uCloudOpacity.value=t.cloudOpacity,e.uCloudDrift.value=t.cloudDrift,e.uSunColor.value.set(t.sunColor),e.uSunIntensity.value=t.sun?1:0,e.uSunSize.value=Math.cos(t.sunSize*Math.PI/180),e.uSunGlow.value=t.sunGlow}aimAt(t){this.material.uniforms.uSunDirection.value.copy(t).normalize()}follow(t,e){this.mesh.position.setFromMatrixPosition(t.matrixWorld),this.material.uniforms.uTime.value=e}dispose(){this.mesh.geometry.dispose(),this.material.dispose()}}const rh="hswow.preset.";function Ox(i){try{const t=window.localStorage.getItem(rh+i);if(t===null)return null;const e=JSON.parse(t);return typeof e!="object"||e===null?null:e}catch{return null}}function zx(i,t){try{return window.localStorage.setItem(rh+i,JSON.stringify(t)),!0}catch{return!1}}function kx(i){try{window.localStorage.removeItem(rh+i)}catch{}}const vl=new lr({vertexColors:!0,transparent:!0,blending:Tc,depthWrite:!1,side:hn,fog:!1});function dr(i,t){const e=new Kt(i,vl);return e.name=t,e.userData.noCollide=!0,e.renderOrder=2,e}const Oa="render",$r=64,Bx=["#0a0a0f","#141a24","#1e2733","#2e3640","#3d4a54","#525f66","#6f7a7d","#8d9491","#b0b3a8","#dcdcc8","#3a2f28","#5c3a2e","#7a5238","#9a7248","#b08040","#c9a25e"],Vu={pixelSize:3,normalEdgeStrength:.3,depthEdgeStrength:.4,ditherScale:.6,ditherPattern:"bayer",ditherMatrix:8,quantize:"levels",levels:5,palette:[...Bx],vignetteStrength:0,vignetteRadius:.5,vignetteSoftness:.7,sky:{...qf},linkFogToSky:!0,fogColor:"#bcd4e6",fogNear:25,fogFar:140},Hx={off:0,levels:1,palette:2},Wu={bayer:0,blue:1,noise:2};class Gx{settings;viewport;composer;pixelPass;retroPass;sky=new Fx;paletteBuffer=new Float32Array(Co*3);ditherTexture=null;air=null;constructor(t){this.viewport=t;const e=Ox(Oa)??{};this.settings={...Vu,...e,sky:{...qf,...e.sky}},t.scene.add(this.sky.mesh),this.hideGlowFromEdges(t.scene),this.composer=new Ax(t.renderer),this.pixelPass=new Rx(1,t.scene,t.camera),this.retroPass=new Xf(Lx),this.composer.addPass(this.pixelPass),this.composer.addPass(new Px),this.composer.addPass(this.retroPass),this.retroPass.uniforms.uPalette.value=this.paletteBuffer,this.retroPass.uniforms.uDitherSize.value=$r,this.resize(),this.apply()}setEnvironment(t){this.air=t,this.apply()}aimSun(t){this.sky.aimAt(t)}apply(){const t=this.settings,e=this.viewport.renderer.getPixelRatio(),n=Math.max(1,Math.round(t.pixelSize*e));this.pixelPass.pixelSize!==n&&this.pixelPass.setPixelSize(n),this.pixelPass.normalEdgeStrength=t.normalEdgeStrength,this.pixelPass.depthEdgeStrength=t.depthEdgeStrength;const s=this.retroPass.uniforms;s.uPixelSize.value=n;const r=1/Math.max(t.levels-1,1);s.uDither.value=t.ditherScale*r,s.uPattern.value=Wu[t.ditherPattern]??Wu.bayer,s.uMatrix.value=t.ditherMatrix,t.ditherPattern==="blue"&&this.ensureBlueNoise(),s.uQuantize.value=Hx[t.quantize],s.uLevels.value=t.levels,s.uVignette.value=t.vignetteStrength,s.uVignetteRadius.value=t.vignetteRadius,s.uVignetteSoftness.value=t.vignetteSoftness;const o=Math.min(t.palette.length,Co);for(let c=0;c<o;c++)Vx(t.palette[c],this.paletteBuffer,c*3);s.uPaletteCount.value=o,this.sky.apply(t.sky),this.sky.mesh.visible=this.air===null||this.air.sky;const a=this.viewport.scene.fog;a instanceof Yo&&(this.air&&!this.air.sky?a.color.set(this.air.fogColor):t.linkFogToSky?a.color.set(t.sky.horizon):a.color.set(this.air?.fogColor??t.fogColor),a.near=this.air?.fogNear??t.fogNear,a.far=this.air?.fogFar??t.fogFar,this.viewport.renderer.setClearColor(a.color,1))}hideGlowFromEdges(t){t.onBeforeRender=(e,n)=>{vl.visible=n.overrideMaterial===null}}ensureBlueNoise(){this.ditherTexture===null&&(this.ditherTexture=new Uf(Nx($r),$r,$r,Gl),this.ditherTexture.magFilter=Ae,this.ditherTexture.minFilter=Ae,this.ditherTexture.wrapS=Ti,this.ditherTexture.wrapT=Ti,this.ditherTexture.needsUpdate=!0,this.retroPass.uniforms.tDither.value=this.ditherTexture)}render(t){this.sky.follow(this.viewport.camera,t),this.composer.render()}resize(){const t=this.viewport.renderer.getSize(new et);this.composer.setPixelRatio(this.viewport.renderer.getPixelRatio()),this.composer.setSize(t.x,t.y),this.apply()}save(){return zx(Oa,this.settings)}reset(){kx(Oa),Object.assign(this.settings,structuredClone(Vu)),this.apply()}dispose(){this.ditherTexture?.dispose(),this.viewport.scene.onBeforeRender=()=>{},vl.visible=!0,this.viewport.scene.remove(this.sky.mesh),this.sky.dispose(),this.composer.dispose()}}function Vx(i,t,e){const n=Number.parseInt(i.replace("#",""),16);t[e]=(n>>16&255)/255,t[e+1]=(n>>8&255)/255,t[e+2]=(n&255)/255}const za=new URLSearchParams(window.location.search),Yf={debug:za.has("debug"),level:za.get("level")??"proving",touch:za.has("touch")},Wx=["KeyW","ArrowUp"],Xx=["KeyS","ArrowDown"],qx=["KeyA","ArrowLeft"],Yx=["KeyD","ArrowRight"],$x=["ShiftLeft","ShiftRight"],Zx=["CapsLock"],Xu=["Space"],Kx=["KeyE"],Zr=200,jx=3e3,Jx=120;class Qx{lookX=0;lookY=0;locked=!1;needsCapture;onLockChange=null;canvas;keys=new Set;stickX=0;stickZ=0;stickSprint=!1;jumpPressedAt=0;jumpHeld=!1;interactPressed=!1;settling=!1;relocking=!1;constructor(t){this.canvas=t,this.needsCapture=!$f(),window.addEventListener("keydown",this.handleKeyDown),window.addEventListener("keyup",this.handleKeyUp),window.addEventListener("blur",this.handleBlur),this.needsCapture?(t.addEventListener("pointerdown",this.handleCanvasPointerDown),document.addEventListener("pointerlockchange",this.handleLockChange),document.addEventListener("mousemove",this.handleMouseMove)):this.locked=!0}get moveX(){const t=qu(this.pressed(Yx),this.pressed(qx));return Kr(t+this.stickX,-1,1)}get moveZ(){const t=qu(this.pressed(Wx),this.pressed(Xx));return Kr(t+this.stickZ,-1,1)}get sprint(){return this.pressed($x)||this.stickSprint}get crouching(){return this.pressed(Zx)}get jumping(){return this.jumpHeld}takeJump(t){return this.jumpPressedAt===0||(performance.now()-this.jumpPressedAt)/1e3>t?!1:(this.jumpPressedAt=0,!0)}takeInteract(){return this.interactPressed?(this.interactPressed=!1,!0):!1}drainLook(t){t.x=this.lookX,t.y=this.lookY,this.lookX=0,this.lookY=0}setStick(t,e,n){this.stickX=t,this.stickZ=e,this.stickSprint=n}addLook(t,e){this.lookX+=t,this.lookY+=e}pressJump(){this.jumpPressedAt=performance.now(),this.jumpHeld=!0}releaseJump(){this.jumpHeld=!1}pressInteract(){this.interactPressed=!0}pressed(t){return t.some(e=>this.keys.has(e))}handleKeyDown=t=>{if(t.code==="Tab"&&this.locked){t.preventDefault();return}t.repeat||(this.keys.add(t.code),Xu.includes(t.code)&&(t.preventDefault(),this.pressJump()),Kx.includes(t.code)&&this.locked&&this.pressInteract())};handleKeyUp=t=>{this.keys.delete(t.code),Xu.includes(t.code)&&this.releaseJump()};handleBlur=()=>{this.keys.clear(),this.releaseJump()};handleCanvasPointerDown=t=>{this.locked||t.button!==0||this.requestLock()};async requestLock(){if(this.relocking)return;this.relocking=!0;const t=performance.now()+jx;for(;!this.locked&&performance.now()<t;)await this.tryLock(),await tw(Jx);this.relocking=!1}async tryLock(){try{await this.canvas.requestPointerLock({unadjustedMovement:!0})}catch{try{await this.canvas.requestPointerLock()}catch{}}}handleLockChange=()=>{this.locked=document.pointerLockElement===this.canvas,this.locked||this.keys.clear(),this.lookX=0,this.lookY=0,this.settling=this.locked,this.onLockChange?.(this.locked)};handleMouseMove=t=>{if(this.locked){if(this.settling){this.settling=!1;return}this.lookX+=Kr(t.movementX,-Zr,Zr),this.lookY+=Kr(t.movementY,-Zr,Zr)}};dispose(){window.removeEventListener("keydown",this.handleKeyDown),window.removeEventListener("keyup",this.handleKeyUp),window.removeEventListener("blur",this.handleBlur),this.canvas.removeEventListener("pointerdown",this.handleCanvasPointerDown),document.removeEventListener("pointerlockchange",this.handleLockChange),document.removeEventListener("mousemove",this.handleMouseMove)}}function $f(){return Yf.touch||window.matchMedia("(pointer: coarse)").matches}function tw(i){return new Promise(t=>window.setTimeout(t,i))}function qu(i,t){return(i?1:0)-(t?1:0)}function Kr(i,t,e){return Math.min(Math.max(i,t),e)}class fr{constructor(t=new C(0,0,0),e=new C(0,1,0),n=1){this.start=t,this.end=e,this.radius=n}clone(){return new fr(this.start.clone(),this.end.clone(),this.radius)}set(t,e,n){this.start.copy(t),this.end.copy(e),this.radius=n}copy(t){this.start.copy(t.start),this.end.copy(t.end),this.radius=t.radius}getCenter(t){return t.copy(this.end).add(this.start).multiplyScalar(.5)}translate(t){this.start.add(t),this.end.add(t)}checkAABBAxis(t,e,n,s,r,o,a,c,l){return(r-t<l||r-n<l)&&(t-o<l||n-o<l)&&(a-e<l||a-s<l)&&(e-c<l||s-c<l)}intersectsBox(t){return this.checkAABBAxis(this.start.x,this.start.y,this.end.x,this.end.y,t.min.x,t.max.x,t.min.y,t.max.y,this.radius)&&this.checkAABBAxis(this.start.x,this.start.z,this.end.x,this.end.z,t.min.x,t.max.x,t.min.z,t.max.z,this.radius)&&this.checkAABBAxis(this.start.y,this.start.z,this.end.y,this.end.z,t.min.y,t.max.y,t.min.z,t.max.z,this.radius)}}const Ls=new C,Is=new C,jr=new C,Ds=new C,fn=new Qn,ka=new ih,ew=new ih,Jr=new xs,Ns=new fr,nw=new C,iw=new C,sw=new C,rw=1e-10;function ow(i,t,e=null,n=null){const s=nw.copy(i.end).sub(i.start),r=iw.copy(t.end).sub(t.start),o=sw.copy(t.start).sub(i.start),a=s.dot(r),c=s.dot(s),l=r.dot(r),h=r.dot(o),u=s.dot(o);let f,d;const m=c*l-a*a;if(Math.abs(m)<rw){const v=-h/l,g=(a-h)/l;Math.abs(v-.5)<Math.abs(g-.5)?(f=0,d=v):(f=1,d=g)}else f=(h*a+u*l)/m,d=(f*a-h)/l;d=Math.max(0,Math.min(1,d)),f=Math.max(0,Math.min(1,f)),e&&e.copy(s).multiplyScalar(f).add(i.start),n&&n.copy(r).multiplyScalar(d).add(t.start)}class Po{constructor(t){this.box=t,this.bounds=new Ri,this.subTrees=[],this.triangles=[],this.layers=new Wo}addTriangle(t){return this.bounds.min.x=Math.min(this.bounds.min.x,t.a.x,t.b.x,t.c.x),this.bounds.min.y=Math.min(this.bounds.min.y,t.a.y,t.b.y,t.c.y),this.bounds.min.z=Math.min(this.bounds.min.z,t.a.z,t.b.z,t.c.z),this.bounds.max.x=Math.max(this.bounds.max.x,t.a.x,t.b.x,t.c.x),this.bounds.max.y=Math.max(this.bounds.max.y,t.a.y,t.b.y,t.c.y),this.bounds.max.z=Math.max(this.bounds.max.z,t.a.z,t.b.z,t.c.z),this.triangles.push(t),this}calcBox(){return this.box=this.bounds.clone(),this.box.min.x-=.01,this.box.min.y-=.01,this.box.min.z-=.01,this}split(t){if(!this.box)return;const e=[],n=Is.copy(this.box.max).sub(this.box.min).multiplyScalar(.5);for(let r=0;r<2;r++)for(let o=0;o<2;o++)for(let a=0;a<2;a++){const c=new Ri,l=Ls.set(r,o,a);c.min.copy(this.box.min).add(l.multiply(n)),c.max.copy(c.min).add(n),e.push(new Po(c))}let s;for(;s=this.triangles.pop();)for(let r=0;r<e.length;r++)e[r].box.intersectsTriangle(s)&&e[r].triangles.push(s);for(let r=0;r<e.length;r++){const o=e[r].triangles.length;o>8&&t<16&&e[r].split(t+1),o!==0&&this.subTrees.push(e[r])}return this}build(){return this.calcBox(),this.split(0),this}getRayTriangles(t,e){for(let n=0;n<this.subTrees.length;n++){const s=this.subTrees[n];if(t.intersectsBox(s.box))if(s.triangles.length>0)for(let r=0;r<s.triangles.length;r++)e.indexOf(s.triangles[r])===-1&&e.push(s.triangles[r]);else s.getRayTriangles(t,e)}return e}triangleCapsuleIntersect(t,e){e.getPlane(fn);const n=fn.distanceToPoint(t.start)-t.radius,s=fn.distanceToPoint(t.end)-t.radius;if(n>0&&s>0||n<-t.radius&&s<-t.radius)return!1;const r=Math.abs(n/(Math.abs(n)+Math.abs(s))),o=Ls.copy(t.start).lerp(t.end,r);if(e.containsPoint(o))return{normal:fn.normal.clone(),point:o.clone(),depth:Math.abs(Math.min(n,s))};const a=t.radius*t.radius,c=ka.set(t.start,t.end),l=[[e.a,e.b],[e.b,e.c],[e.c,e.a]];for(let h=0;h<l.length;h++){const u=ew.set(l[h][0],l[h][1]);if(ow(c,u,jr,Ds),jr.distanceToSquared(Ds)<a)return{normal:jr.clone().sub(Ds).normalize(),point:Ds.clone(),depth:t.radius-jr.distanceTo(Ds)}}return!1}triangleSphereIntersect(t,e){if(e.getPlane(fn),!t.intersectsPlane(fn))return!1;const n=Math.abs(fn.distanceToSphere(t)),s=t.radius*t.radius-n*n,r=fn.projectPoint(t.center,Ls);if(e.containsPoint(t.center))return{normal:fn.normal.clone(),point:r.clone(),depth:Math.abs(fn.distanceToSphere(t))};const o=[[e.a,e.b],[e.b,e.c],[e.c,e.a]];for(let a=0;a<o.length;a++){ka.set(o[a][0],o[a][1]),ka.closestPointToPoint(r,!0,Is);const c=Is.distanceToSquared(t.center);if(c<s)return{normal:t.center.clone().sub(Is).normalize(),point:Is.clone(),depth:t.radius-Math.sqrt(c)}}return!1}getSphereTriangles(t,e){for(let n=0;n<this.subTrees.length;n++){const s=this.subTrees[n];if(t.intersectsBox(s.box))if(s.triangles.length>0)for(let r=0;r<s.triangles.length;r++)e.indexOf(s.triangles[r])===-1&&e.push(s.triangles[r]);else s.getSphereTriangles(t,e)}}getCapsuleTriangles(t,e){for(let n=0;n<this.subTrees.length;n++){const s=this.subTrees[n];if(t.intersectsBox(s.box))if(s.triangles.length>0)for(let r=0;r<s.triangles.length;r++)e.indexOf(s.triangles[r])===-1&&e.push(s.triangles[r]);else s.getCapsuleTriangles(t,e)}}sphereIntersect(t){Jr.copy(t);const e=[];let n,s=!1;this.getSphereTriangles(t,e);for(let r=0;r<e.length;r++)(n=this.triangleSphereIntersect(Jr,e[r]))&&(s=!0,Jr.center.add(n.normal.multiplyScalar(n.depth)));if(s){const r=Jr.center.clone().sub(t.center),o=r.length();return{normal:r.normalize(),depth:o}}return!1}capsuleIntersect(t){Ns.copy(t);const e=[];let n,s=!1;this.getCapsuleTriangles(Ns,e);for(let r=0;r<e.length;r++)(n=this.triangleCapsuleIntersect(Ns,e[r]))&&(s=!0,Ns.translate(n.normal.multiplyScalar(n.depth)));if(s){const r=Ns.getCenter(new C).sub(t.getCenter(Ls)),o=r.length();return{normal:r.normalize(),depth:o}}return!1}rayIntersect(t){if(t.direction.length()===0)return;const e=[];let n,s,r=1e100;this.getRayTriangles(t,e);for(let o=0;o<e.length;o++){const a=t.intersectTriangle(e[o].a,e[o].b,e[o].c,!0,Ls);if(a){const c=a.sub(t.origin).length();r>c&&(s=a.clone().add(t.origin),r=c,n=e[o])}}return r<1e100?{distance:r,triangle:n,position:s}:!1}fromGraphNode(t){return t.updateWorldMatrix(!0,!0),t.traverse(e=>{if(e.isMesh===!0&&this.layers.test(e.layers)){let n,s=!1;e.geometry.index!==null?(s=!0,n=e.geometry.toNonIndexed()):n=e.geometry;const r=n.getAttribute("position");for(let o=0;o<r.count;o+=3){const a=new C().fromBufferAttribute(r,o),c=new C().fromBufferAttribute(r,o+1),l=new C().fromBufferAttribute(r,o+2);a.applyMatrix4(e.matrixWorld),c.applyMatrix4(e.matrixWorld),l.applyMatrix4(e.matrixWorld),this.addTriangle(new en(a,c,l))}s&&n.dispose()}}),this.build(),this}clear(){return this.box=null,this.bounds.makeEmpty(),this.subTrees.length=0,this.triangles.length=0,this}}const Zf=1;function Se(i){return Kf(i),i}function Kf(i){if(i.userData.noCollide!==!0){i.layers.enable(Zf);for(const t of i.children)Kf(t)}}const $i=[],Ba=new C,Us=new C,Ha=new C,Yu=new C,Ga=new C,$u=new C,es=new C,Zu=new ih,Va={normal:new C,depth:0};class Lo{index={octree:new Po,triangles:0};cache=new Map;build(t,e){if(e!==void 0){const s=this.cache.get(e);if(s){this.index=s;return}}const n=Lo.index(t);e!==void 0&&this.cache.set(e,n),this.index=n}warm(t,e){this.cache.has(e)||this.cache.set(e,Lo.index(t))}invalidate(t){this.cache.delete(t)}static index(t){const e=new Po;return e.layers.disableAll(),e.layers.enable(Zf),e.fromGraphNode(t),{octree:e,triangles:jf(e)}}get triangles(){return this.index.triangles}intersectCapsule(t){$i.length=0,this.index.octree.getCapsuleTriangles(t,$i);let e=0;for(const n of $i){const s=Ku(t,n);s<=e||(e=s,Va.normal.copy(es))}return e===0?null:(Va.depth=e,Va)}overlaps(t){$i.length=0,this.index.octree.getCapsuleTriangles(t,$i);for(const e of $i)if(Ku(t,e)>0)return!0;return!1}raycast(t,e){const n=this.index.octree.rayIntersect(new cr(t,e));return n?n.distance:null}}function Ku(i,t){t.getNormal(Us),Ba.subVectors(i.end,i.start);const e=Us.dot(Ba);let n=0;Math.abs(e)>1e-6&&(n=Us.dot(Ha.subVectors(t.a,i.start))/e,n=Math.min(Math.max(n,0),1)),Ha.copy(i.start).addScaledVector(Ba,n),t.closestPointToPoint(Ha,Yu),Zu.set(i.start,i.end),Zu.closestPointToPoint(Yu,!0,Ga),t.closestPointToPoint(Ga,$u),es.subVectors(Ga,$u);const s=es.length();return s>=i.radius||(s>1e-6?es.divideScalar(s):es.copy(Us),es.dot(Us)<=0)?0:i.radius-s}function jf(i){let t=i.triangles.length;for(const e of i.subTrees)t+=jf(e);return t}const Wa=1/120,ju=16,aw=4,Qr=6,cw=.28,Jf={radius:.32,height:1.8,eyeHeight:1.35,walkSpeed:4.2,sprintScale:1.75,crouchScale:.52,crouchHeight:.58,crouchSpeed:22,crouchDrag:.45,stepSmoothing:16,groundAccel:14,airAccel:7.5,friction:10,stopSpeed:1.6,gravity:26,jumpSpeed:7.2,coyoteTime:.22,jumpBuffer:.15,autoHop:!1,slopeLimitDeg:50,stepHeight:.45,lookSensitivity:.0022,invertY:!1,bobAmount:.02,bobSway:.012,bobRoll:.004,bobStepsPerSecond:1.9,bobSpeedInfluence:.5,firstStepFraction:.65,maxAirSpeed:1.12,fov:74,sprintFov:82,landDip:.02},pn=new C,Ju=new C,to=new C,Xa=new C,Qu=new C,eo=new C,qa=new C,lw=new C,no=new C,td=new C,Fe=new fr,Ya={x:0,y:0};let hw=class{tuning={...Jf};velocity=new C;onFootstep=null;onLand=null;onJump=null;camera;input;collider;capsule=new fr;yaw=0;pitch=0;sprintFov=!1;crouch=0;stepLag=0;stance=0;lastFeetY=null;groundNormal=new C(0,1,0);wishX=0;wishZ=0;grounded=!1;jumped=!1;timeOffGround=0;timeSinceLand=1/0;bobPhase=0;strideProgress=.65;dip=0;accumulator=0;constructor(t,e,n){this.camera=t,this.input=e,this.collider=n,this.camera.rotation.order="YXZ",this.camera.fov=this.tuning.fov,this.camera.updateProjectionMatrix(),this.teleport(new C(0,2,6),0)}teleport(t,e=this.yaw){const{radius:n,height:s}=this.tuning;this.capsule.set(new C(t.x,t.y+n,t.z),new C(t.x,t.y+s-n,t.z),n),this.velocity.set(0,0,0),this.yaw=e,this.grounded=!1,this.stance=0,this.crouch=0,this.stepLag=0,this.lastFeetY=null}get position(){return lw.copy(this.capsule.start).setY(this.capsule.start.y-this.tuning.radius)}get heading(){return this.yaw}get isGrounded(){return this.grounded}get speed(){return Math.hypot(this.velocity.x,this.velocity.z)}update(t){this.applyLook(),this.accumulator+=t;let e=0;for(;this.accumulator>=Wa&&e<ju;)this.step(Wa),this.accumulator-=Wa,e+=1;e===ju&&(this.accumulator=0),this.applyCamera(t)}applyLook(){this.input.drainLook(Ya);const{lookSensitivity:t,invertY:e}=this.tuning;this.yaw-=Ya.x*t,this.pitch-=Ya.y*t*(e?-1:1);const n=Math.PI/2-.001;this.pitch=Math.min(Math.max(this.pitch,-n),n),this.yaw=this.yaw%(Math.PI*2)}step(t){const e=this.tuning;this.jumped=!1,this.grounded?(this.timeOffGround=0,this.timeSinceLand+=t,this.applyFriction(t)):(this.timeOffGround+=t,this.velocity.y-=e.gravity*t),this.applyWish(t),this.applyJump(),this.capAirSpeed();const n=this.grounded,s=-this.velocity.y;this.move(t),this.grounded&&!n&&(this.timeSinceLand=0,s>1&&(this.dip+=Math.min(s,18)*e.landDip,this.onLand?.(s))),this.advanceBob(t)}applyFriction(t){const e=this.tuning,n=this.velocity.length();if(n<1e-4){this.velocity.set(0,0,0);return}const s=Math.max(n,e.stopSpeed)*e.friction*t;this.velocity.multiplyScalar(Math.max(n-s,0)/n)}applyWish(t){const e=this.tuning,{moveX:n,moveZ:s}=this.input;Ju.set(-Math.sin(this.yaw),0,-Math.cos(this.yaw)),to.set(Math.cos(this.yaw),0,-Math.sin(this.yaw)),pn.set(0,0,0).addScaledVector(Ju,s).addScaledVector(to,n);const r=pn.length();if(r<1e-4){this.wishX=0,this.wishZ=0;return}if(pn.divideScalar(r),this.wishX=pn.x,this.wishZ=pn.z,this.grounded){pn.projectOnPlane(this.groundNormal);const h=pn.length();if(h<1e-4)return;pn.divideScalar(h)}const o=e.walkSpeed*Math.min(r,1)*(this.input.sprint?e.sprintScale:1)*(1-this.stance*(1-e.crouchDrag)),a=this.velocity.dot(pn),c=o-a;if(c<=0)return;const l=this.grounded?e.groundAccel:e.airAccel;this.velocity.addScaledVector(pn,Math.min(l*o*t,c))}capAirSpeed(){if(this.grounded)return;const t=this.tuning,e=t.walkSpeed*t.sprintScale*t.maxAirSpeed,n=Math.hypot(this.velocity.x,this.velocity.z);if(n<=e||n<1e-6)return;const s=e/n;this.velocity.x*=s,this.velocity.z*=s}applyJump(){const t=this.tuning;!(this.grounded||this.timeOffGround<t.coyoteTime)||!(this.input.takeJump(t.jumpBuffer)||t.autoHop&&this.input.jumping)||(this.velocity.y=t.jumpSpeed,this.grounded=!1,this.jumped=!0,this.timeSinceLand>cw&&this.onJump?.(),this.timeSinceLand=0,this.timeOffGround=t.coyoteTime)}move(t){const e=this.tuning;Qu.copy(this.velocity).multiplyScalar(t),qa.copy(this.capsule.start);const n=this.grounded,s=this.velocity.x,r=this.velocity.z;this.grounded=!1,this.capsule.translate(Qu),this.resolve(),n&&!this.grounded&&!this.jumped&&this.snapToGround(),!(e.stepHeight<=0||this.wishX===0&&this.wishZ===0||this.velocity.y>.1||(this.capsule.start.x-qa.x)*this.wishX+(this.capsule.start.z-qa.z)*this.wishZ>=e.walkSpeed*t*.5)&&this.tryStepUp(t)&&(this.velocity.x=s,this.velocity.z=r,this.velocity.y=0)}resolve(){const t=Math.cos(this.tuning.slopeLimitDeg*Math.PI/180);for(let e=0;e<aw;e++){const n=this.collider.intersectCapsule(this.capsule);if(!n)break;this.capsule.translate(Xa.copy(n.normal).multiplyScalar(n.depth)),n.normal.y>t&&(this.grounded=!0,this.groundNormal.copy(n.normal));const s=this.velocity.dot(n.normal);s<0&&this.velocity.addScaledVector(n.normal,-s)}this.grounded||this.groundNormal.set(0,1,0)}headroom(){if(this.stance<.01)return!0;const t=this.tuning,e=this.capsule.start.y-t.radius;return Fe.copy(this.capsule),Fe.start.set(this.capsule.start.x,e+t.radius,this.capsule.start.z),Fe.end.set(this.capsule.start.x,e+t.height-t.radius,this.capsule.start.z),!this.collider.overlaps(Fe)}applyStance(){if(Math.abs(this.crouch-this.stance)<.001)return;this.stance=this.crouch;const t=this.tuning,e=this.capsule.start.y-t.radius,n=t.height*(1-this.stance*(1-t.crouchHeight));this.capsule.end.set(this.capsule.start.x,e+Math.max(n-t.radius,t.radius+.01),this.capsule.start.z)}snapToGround(){const t=this.tuning,e=Math.cos(t.slopeLimitDeg*Math.PI/180),n=Math.max(t.stepHeight,.05)/Qr;eo.set(0,-n,0),Fe.copy(this.capsule);for(let s=0;s<Qr;s++){Fe.translate(eo);const r=this.collider.intersectCapsule(Fe);if(r){if(r.normal.y<=e)return;Fe.translate(Xa.set(0,n,0)),this.capsule.copy(Fe),this.grounded=!0,this.groundNormal.copy(r.normal);return}}}tryStepUp(t){const e=this.tuning,n=Math.max(e.walkSpeed*t,.02);if(no.set(this.capsule.start.x+this.wishX*n,this.capsule.start.y+e.stepHeight,this.capsule.start.z+this.wishZ*n),td.copy(no).setY(no.y+e.height-e.radius*2),Fe.set(no,td,e.radius),this.collider.overlaps(Fe))return!1;const s=e.stepHeight/Qr;eo.set(0,-s,0);for(let r=0;r<Qr;r++)if(Fe.translate(eo),this.collider.overlaps(Fe))return Fe.translate(Xa.set(0,s,0)),this.capsule.copy(Fe),this.grounded=!0,this.groundNormal.set(0,1,0),!0;return!1}advanceBob(t){const e=this.tuning;if(!this.grounded)return;const n=this.speed;if(n<.15){this.bobPhase+=(Math.round(this.bobPhase)-this.bobPhase)*Math.min(t*8,1),this.strideProgress=e.firstStepFraction;return}const s=e.walkSpeed/Math.max(e.bobStepsPerSecond,.1),r=Math.max(.2,s*Math.pow(n/e.walkSpeed,1-e.bobSpeedInfluence));for(this.strideProgress+=n*t/r,this.bobPhase+=n*t/(r*2);this.strideProgress>=1;)this.strideProgress-=1,this.onFootstep?.(n)}applyCamera(t){const e=this.tuning,n=this.input.crouching||!this.headroom()?1:0;this.crouch+=(n-this.crouch)*Math.min(t*e.crouchSpeed,1),this.applyStance();const s=this.bobPhase*Math.PI*2;to.set(Math.cos(this.yaw),0,-Math.sin(this.yaw));const r=Math.min(this.speed/e.walkSpeed,1);this.dip=Math.max(this.dip-this.dip*Math.min(t*9,1),0);const o=this.capsule.start.y-e.radius;if(this.lastFeetY!==null&&this.grounded){const l=o-this.lastFeetY;l>.001&&l<e.stepHeight*1.2&&(this.stepLag+=l)}this.lastFeetY=o,this.stepLag=Math.max(0,this.stepLag-this.stepLag*Math.min(t*e.stepSmoothing,1)),this.camera.position.set(this.capsule.start.x,o-this.stepLag+e.eyeHeight*(1-this.stance*(1-e.crouchScale))-this.dip+Math.sin(s*2)*e.bobAmount*r,this.capsule.start.z),this.camera.position.addScaledVector(to,Math.sin(s)*e.bobSway*r),this.camera.rotation.set(this.pitch,this.yaw,Math.sin(s)*e.bobRoll*r),this.sprintFov?(!this.input.sprint||this.speed<.4)&&(this.sprintFov=!1):this.input.sprint&&this.speed>1.2&&(this.sprintFov=!0);const a=this.sprintFov?e.sprintFov:e.fov,c=mm.damp(this.camera.fov,a,6,t);Math.abs(c-this.camera.fov)>.001&&(this.camera.fov=c,this.camera.updateProjectionMatrix())}};const Zi=64,uw=.85,ed=2.2;class dw{input;root;stickBase;stickKnob;jumpPad;stick=null;lookPointer=null;lastLookX=0;lastLookY=0;constructor(t,e){this.input=t,this.root=document.createElement("div"),this.root.className="touch",this.stickBase=document.createElement("div"),this.stickBase.className="touch-stick",this.stickKnob=document.createElement("div"),this.stickKnob.className="touch-stick-knob",this.stickBase.appendChild(this.stickKnob),this.jumpPad=document.createElement("div"),this.jumpPad.className="touch-jump",this.jumpPad.textContent="↑",this.root.append(this.stickBase,this.jumpPad),e.appendChild(this.root),this.root.addEventListener("pointerdown",this.handleDown),window.addEventListener("pointermove",this.handleMove),window.addEventListener("pointerup",this.handleUp),window.addEventListener("pointercancel",this.handleUp),this.jumpPad.addEventListener("pointerdown",this.handleJumpDown),this.jumpPad.addEventListener("pointerup",this.handleJumpUp),this.jumpPad.addEventListener("pointercancel",this.handleJumpUp)}handleDown=t=>{const e=t.clientX<window.innerWidth/2;if(e&&this.stick===null){this.stick={pointerId:t.pointerId,originX:t.clientX,originY:t.clientY},this.stickBase.style.left=`${t.clientX}px`,this.stickBase.style.top=`${t.clientY}px`,this.stickBase.classList.add("is-active"),this.updateStick(t.clientX,t.clientY);return}!e&&this.lookPointer===null&&(this.lookPointer=t.pointerId,this.lastLookX=t.clientX,this.lastLookY=t.clientY)};handleMove=t=>{if(this.stick?.pointerId===t.pointerId){this.updateStick(t.clientX,t.clientY);return}this.lookPointer===t.pointerId&&(this.input.addLook((t.clientX-this.lastLookX)*ed,(t.clientY-this.lastLookY)*ed),this.lastLookX=t.clientX,this.lastLookY=t.clientY)};handleUp=t=>{this.stick?.pointerId===t.pointerId&&(this.stick=null,this.input.setStick(0,0,!1),this.stickBase.classList.remove("is-active"),this.stickKnob.style.transform="translate(-50%, -50%)"),this.lookPointer===t.pointerId&&(this.lookPointer=null)};handleJumpDown=t=>{t.stopPropagation(),this.jumpPad.classList.add("is-active"),this.input.pressJump()};handleJumpUp=()=>{this.jumpPad.classList.remove("is-active"),this.input.releaseJump()};updateStick(t,e){if(!this.stick)return;let n=t-this.stick.originX,s=e-this.stick.originY;const r=Math.hypot(n,s);if(r>Zi){const a=Zi/r;n*=a,s*=a}this.stickKnob.style.transform=`translate(calc(-50% + ${n}px), calc(-50% + ${s}px))`;const o=Math.min(r,Zi)/Zi;this.input.setStick(n/Zi,-s/Zi,o>uw)}dispose(){this.root.removeEventListener("pointerdown",this.handleDown),window.removeEventListener("pointermove",this.handleMove),window.removeEventListener("pointerup",this.handleUp),window.removeEventListener("pointercancel",this.handleUp),this.root.remove()}}const Io=4,mn=256,nd=mn/Io,fw=.82,pw=.6,mw=4,id=.6,sd=1.4;function io(i,t){return Math.min(Math.max(t+.5-i,0),1)}function so(i,t){const e=(i%t+t)%t;return Math.min(e,t-e)}let $a=null;function rd(){if($a)return $a;const i=new Uint8Array(mn*mn*4);for(let e=0;e<mn;e++)for(let n=0;n<mn;n++){const s=n+.5,r=e+.5,o=Math.max(io(so(s,mn),sd),io(so(r,mn),sd)),a=Math.max(io(so(s,nd),id),io(so(r,nd),id)),c=Math.min(1-o*(1-pw),1-a*(1-fw)),l=Math.round(c*255),h=(e*mn+n)*4;i[h]=l,i[h+1]=l,i[h+2]=l,i[h+3]=255}const t=new Uf(i,mn,mn,nn);return t.wrapS=Ti,t.wrapT=Ti,t.colorSpace=zn,t.generateMipmaps=!0,t.minFilter=ti,t.magFilter=un,t.anisotropy=16,t.needsUpdate=!0,$a=t,t}function oh(i=400,t={}){const e=t.segments??Math.max(8,Math.round(i/mw)),n=new si(i,i,e,e);n.rotateX(-Math.PI/2);const s=n.getAttribute("uv");for(let a=0;a<s.count;a++)s.setXY(a,(s.getX(a)-.5)*(i/Io),(s.getY(a)-.5)*(i/Io));s.needsUpdate=!0;const r=t.material??new sn({color:t.color??13286300});r.map!==rd()&&(r.map=rd(),r.needsUpdate=!0);const o=new Kt(n,r);return o.name="flatGround",o.position.y=t.y??-.01,t.collidable===!1?o:Se(o)}const Qf=Io;function gw(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,c=new Pe;let l=0;for(let h=0;h<i.length;++h){const u=i[h];let f=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in u.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.attributes[d]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in u.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[d]===void 0&&(o[d]=[]),o[d].push(u.morphAttributes[d])}if(t){let d;if(e)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,d,h),l+=d}}if(e){let h=0;const u=[];for(let f=0;f<i.length;++f){const d=i[f].index;for(let m=0;m<d.count;++m)u.push(d.getX(m)+h);h+=i[f].attributes.position.count}c.setIndex(u)}for(const h in r){const u=od(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in o){const u=o[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let f=0;f<u;++f){const d=[];for(let v=0;v<o[h].length;++v)d.push(o[h][v][f]);const m=od(d);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(m)}}return c}function od(i){let t,e,n,s=-1,r=0;for(let l=0;l<i.length;++l){const h=i[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const o=new t(r),a=new qe(o,e,n);let c=0;for(let l=0;l<i.length;++l){const h=i[l];if(h.isInterleavedBufferAttribute){const u=c/e;for(let f=0,d=h.count;f<d;f++)for(let m=0;m<e;m++){const v=h.getComponent(f,m);a.setComponent(f+u,m,v)}}else o.set(h.array,c);c+=h.count*e}return s!==void 0&&(a.gpuType=s),a}function ah(i,t=1e-4){t=Math.max(t,Number.EPSILON);const e={},n=i.getIndex(),s=i.getAttribute("position"),r=n?n.count:s.count;let o=0;const a=Object.keys(i.attributes),c={},l={},h=[],u=["getX","getY","getZ","getW"],f=["setX","setY","setZ","setW"];for(let _=0,y=a.length;_<y;_++){const x=a[_],b=i.attributes[x];c[x]=new b.constructor(new b.array.constructor(b.count*b.itemSize),b.itemSize,b.normalized);const S=i.morphAttributes[x];S&&(l[x]||(l[x]=[]),S.forEach((E,T)=>{const M=new E.array.constructor(E.count*E.itemSize);l[x][T]=new E.constructor(M,E.itemSize,E.normalized)}))}const d=t*.5,m=Math.log10(1/t),v=Math.pow(10,m),g=d*v;for(let _=0;_<r;_++){const y=n?n.getX(_):_;let x="";for(let b=0,S=a.length;b<S;b++){const E=a[b],T=i.getAttribute(E),M=T.itemSize;for(let w=0;w<M;w++)x+=`${~~(T[u[w]](y)*v+g)},`}if(x in e)h.push(e[x]);else{for(let b=0,S=a.length;b<S;b++){const E=a[b],T=i.getAttribute(E),M=i.morphAttributes[E],w=T.itemSize,A=c[E],N=l[E];for(let L=0;L<w;L++){const U=u[L],F=f[L];if(A[F](o,T[U](y)),M)for(let D=0,H=M.length;D<H;D++)N[D][F](o,M[D][U](y))}}e[x]=o,h.push(o),o++}}const p=i.clone();for(const _ in i.attributes){const y=c[_];if(p.setAttribute(_,new y.constructor(y.array.slice(0,o*y.itemSize),y.itemSize,y.normalized)),_ in l)for(let x=0;x<l[_].length;x++){const b=l[_][x];p.morphAttributes[_][x]=new b.constructor(b.array.slice(0,o*b.itemSize),b.itemSize,b.normalized)}}return p.setIndex(h),p}const tp="sway",vw=new sn({vertexColors:!0,flatShading:!0});function At(i){const t=i.map(n=>{const s=n.geometry,r=s.index===null?s:s.toNonIndexed();r!==s&&s.dispose(),r.deleteAttribute("uv");const o=r.getAttribute("position"),a=o.count,c=new Float32Array(a*3),l=new Vt;if(typeof n.color=="function")for(let u=0;u<a;u+=3){const f=(o.getX(u)+o.getX(u+1)+o.getX(u+2))/3,d=(o.getY(u)+o.getY(u+1)+o.getY(u+2))/3,m=(o.getZ(u)+o.getZ(u+1)+o.getZ(u+2))/3;l.set(n.color(f,d,m)),l.toArray(c,u*3),l.toArray(c,(u+1)*3),l.toArray(c,(u+2)*3)}else{l.set(n.color);for(let u=0;u<a;u++)l.toArray(c,u*3)}r.setAttribute("color",new qe(c,3));const h=new Float32Array(a);if(typeof n.sway=="function")for(let u=0;u<a;u++)h[u]=yl(n.sway(o.getX(u),o.getY(u),o.getZ(u)));else n.sway&&h.fill(yl(n.sway));return r.setAttribute(tp,new qe(h,1)),r.getAttribute("normal")||r.computeVertexNormals(),r}),e=gw(t,!1);for(const n of t)n.dispose();if(!e)throw new Error("assemble: geometries did not share an attribute set");return e}function Dt(i,t,e){const n=new Kt(i,vw);return n.name=t,n.userData.swayPhase=e,n}function js(i,t,e=1.6){return(n,s)=>{const r=yl((s-i)/Math.max(t-i,1e-6));return(r*r*(3-2*r))**e}}function yl(i){return i>0?i<1?i:1:0}function Rt(i){let t=i>>>0||2654435769;t=Math.imul(t^t>>>16,73244475),t=Math.imul(t^t>>>16,73244475),t=(t^t>>>16)>>>0;const e=()=>{t=t+1831565813>>>0;let s=t;return s=Math.imul(s^s>>>15,s|1),s^=s+Math.imul(s^s>>>7,s|61),((s^s>>>14)>>>0)/4294967296},n=e;return n.range=(s,r)=>s+e()*(r-s),n.int=(s,r)=>Math.floor(s+e()*(r-s+1)),n.chance=s=>e()<s,n.pick=s=>s[Math.floor(e()*s.length)],n.around=(s,r)=>s+(e()*2-1)*r,n}const z={BARK:4602672,BARK_PALE:5720636,LEAF:5201977,LEAF_DARK:4017196,LEAF_DRY:7039548,GRASS:6056762,GRASS_DRY:8025156,STONE:9869984,STONE_DARK:7699072,STONE_PALE:11449014,EARTH:4998454,TIMBER:9073506,TIMBER_DARK:7035469,TIMBER_PALE:11047798,IRON:5922659,IRON_DARK:4146248,RUST:8014384,BRONZE:9072696,PATINA:6058080,WATER:2899782,LAMPLIGHT:16769192,CLOTH:9274994,SKIN:11047546,HIDE:7165505,HIDE_DARK:4273193,HIDE_PALE:10653813,WOOL:12433060,HOG:11042938,FOWL:10260343,COMB:10240564,MARKER_YELLOW:13213770,COW_BLACK:2367775};function B(i,t){const e=Math.min(255,Math.round((i>>16&255)*t)),n=Math.min(255,Math.round((i>>8&255)*t)),s=Math.min(255,Math.round((i&255)*t));return e<<16|n<<8|s}const ch={name:"tree",category:"foliage",radius:2.2,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(3.2,4.6),r=e.range(0,Math.PI*2),o=s*e.range(.55,.68),a=new K(e.range(.11,.17),e.range(.24,.34),o,6);a.translate(0,o/2,0),n.push({geometry:a,color:z.BARK,sway:js(0,s,2.2)});const c=e.int(2,4);for(let f=0;f<c;f++){const d=o*e.range(.6,.95),m=e.range(.7,1.3),v=new K(.045,.09,m,4);v.translate(0,m/2,0),v.rotateZ(e.range(.5,1.05)),v.rotateY(r+f/c*Math.PI*2+e.around(0,.4)),v.translate(0,d,0),n.push({geometry:v,color:z.BARK_PALE,sway:js(0,s,1.4)})}const l=e.int(3,5),h=o+e.range(.3,.7);for(let f=0;f<l;f++){const d=e.range(.75,1.35),m=new ee(d,0);m.rotateX(e.range(0,Math.PI)),m.rotateY(e.range(0,Math.PI)),m.scale(1,e.range(.72,.95),1);const v=e.range(0,.95),g=r+f/l*Math.PI*2+e.around(0,.5);m.translate(Math.cos(g)*v,h+e.around(0,.45),Math.sin(g)*v),n.push({geometry:m,color:e.chance(.25)?z.LEAF_DARK:z.LEAF,sway:e.range(.82,1)})}const u=At(n);return t!==1&&u.scale(t,t,t),Dt(u,"tree",e()*Math.PI*2)}},Do={name:"bush",category:"foliage",radius:1,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.int(3,5),r=e.range(.35,.7);for(let a=0;a<s;a++){const c=e.range(.3,.62),l=new ee(c,0);l.rotateX(e.range(0,Math.PI)),l.rotateY(e.range(0,Math.PI)),l.scale(1,e.range(.6,.85),1);const h=a/s*Math.PI*2+e.around(0,.6),u=e.range(0,r),f=c*e.range(.55,.85);l.translate(Math.cos(h)*u,f,Math.sin(h)*u),n.push({geometry:l,color:e.chance(.2)?z.LEAF_DRY:z.LEAF,sway:(d,m)=>Math.min(1,.35+m*.75)})}const o=At(n);return t!==1&&o.scale(t,t,t),Dt(o,"bush",e()*Math.PI*2)}},ad={ground:"#cabb9c",cube:"#525f66",marker:"#b08040",ramp:"#38474a",stair:"#3d4b52",platform:"#46505c",wall:"#2e3640",metal:"#6a6f74",creature:"#b8a06a"},yw=208,_w=52,xw=14474440,ww=6044206,Mw=new C(0,.1,10);function ve(i,t,e,n,s,r,o){const a=new Kt(new V(i,t,e),n);return a.position.set(s,r+t/2,o),a}function bw(i,t,e,n){const s=new Hf;s.moveTo(0,0),s.lineTo(t,0),s.lineTo(t,t*Math.tan(e*Math.PI/180)),s.closePath();const r=new eh(s,{depth:i,bevelEnabled:!1});return r.translate(0,0,-i/2),r.rotateY(Math.PI/2),new Kt(r,n)}function Za(i,t,e,n,s,r){const a=new si(i,t,96,1),c=a.getAttribute("position"),l=new Float32Array(c.count*3),h=new Vt;for(let f=0;f<c.count;f++){const d=c.getX(f)/i+.5,[m,v,g]=r(Math.min(Math.max(d,0),1));h.setRGB(m,v,g,je),h.toArray(l,f*3)}a.setAttribute("color",new qe(l,3));const u=new Kt(a,new lr({vertexColors:!0}));return u.position.set(e,n,s),u}class Sw{root=new ye;colors={...ad};materials={};anchors={tree:new C(14,3.6,12),bush:new C(10.5,.5,15.5),bird:new C(14.9,4.1,11.4),machine:new C(22,1.1,-12)};rooms=[{name:"hall",min:new C(15,0,-18),max:new C(29,7,-4)},{name:"cell",min:new C(19,0,-4),max:new C(27,3,4)}];wheel=null;constructor(){this.root.name="ProvingGround";for(const t of Object.keys(this.colors))this.materials[t]=new sn({color:this.colors[t],flatShading:!0});this.addGround(),this.addHeightReference(),this.addMeasuredCubes(),this.addDistanceMarkers(),this.addMovementGym(),this.addCalibrationBoard(),this.addSoundGarden(),this.addRooms()}update(t,e){this.wheel&&(this.wheel.rotation.z+=e/60*Math.PI*2*t)}roomAt(t){for(const e of this.rooms)if(t.x>e.min.x&&t.x<e.max.x&&t.z>e.min.z&&t.z<e.max.z&&t.y<e.max.y)return e.name;return null}applyColors(){for(const t of Object.keys(this.colors))this.materials[t].color.set(this.colors[t])}resetColors(){Object.assign(this.colors,ad),this.applyColors()}addGround(){this.root.add(oh(yw,{segments:_w,material:this.materials.ground})),this.root.add(new _x(2))}addHeightReference(){const t=new ye,e=.3,n=6;for(let s=0;s<n;s++){const r=new Kt(new V(.08,e,.08),new sn({color:s%2===0?xw:ww,flatShading:!0}));r.position.y=e*(s+.5),t.add(r)}t.position.set(-2,0,0),this.root.add(t)}addMeasuredCubes(){const t=[1,2,4];let e=4;for(const n of t)this.root.add(Se(ve(n,n,n,this.materials.cube,e+n/2,0,0))),e+=n+1}addDistanceMarkers(){for(const t of[5,10,20,30])this.root.add(Se(ve(.1,2,.1,this.materials.marker,0,0,-t)))}addMovementGym(){const t=new ye;t.name="MovementGym",this.addRamps(t),this.addStairs(t),this.addKerbs(t),this.addJumpGaps(t),this.addStrafeWall(t),this.addFallWalkway(t),this.root.add(Se(t))}addRamps(t){const e=[10,20,30,45],n=4;e.forEach((s,r)=>{const o=bw(2.5,n,s,this.materials.ramp);o.position.set(-6-r*4,0,-2),t.add(o);const a=n*Math.tan(s*Math.PI/180);t.add(ve(2.5,.2,2,this.materials.ramp,-6-r*4,a-.2,-7))})}addStairs(t){const e=[{rise:.18,run:.3,x:-24},{rise:.3,run:.3,x:-28}];for(const n of e)for(let s=0;s<8;s++){const r=n.rise*(s+1);t.add(ve(2.5,r,n.run,this.materials.stair,n.x,0,-2-s*n.run))}}addKerbs(t){[.2,.35,.5,.9].forEach((e,n)=>{t.add(ve(3,e,2,this.materials.platform,-8-n*4,0,5))})}addJumpGaps(t){const e=[1.5,2.5,3.5],n=3,s=1.2;let r=18;t.add(ve(3,s,n,this.materials.platform,-26,0,r));for(const o of e)r-=n+o,t.add(ve(3,s,n,this.materials.platform,-26,0,r))}addStrafeWall(t){t.add(ve(.4,3,16,this.materials.wall,-4,0,8)),t.add(ve(6,3,.4,this.materials.wall,-7,0,15.8))}addFallWalkway(t){t.add(ve(2.5,.2,8,this.materials.platform,-18,3.8,-12))}addCalibrationBoard(){const t=new ye;t.name="CalibrationBoard";const e=7,n=-12;t.add(Se(ve(12,6,.3,this.materials.wall,e,0,n)));const s=[[16711680,65280,255,16777215],[65535,16711935,16776960,0],[3355443,6710886,10066329,13421772],[9278609,6044206,11567168,3028544]],r=.9;s.forEach((l,h)=>{l.forEach((u,f)=>{const d=new Kt(new si(r,r),new lr({color:u}));d.position.set(e-4.6+f*(r+.15),5.1-h*(r+.15),n+.16),t.add(d)})}),t.add(Za(5.2,.7,e+2.6,4.3,n+.16,l=>[l,l,l])),t.add(Za(5.2,.7,e+2.6,3.4,n+.16,l=>[l,l*.35,.12])),t.add(Za(5.2,.7,e+2.6,2.5,n+.16,l=>[.1,l*.6,l]));const o=new Kt(new Ko(1.1,48,32),new sn({color:9278609}));o.position.set(e-8.5,1.1,n),t.add(Se(o));const a=Math.PI/6,c=new Kt(new si(6,4),new sn({color:7305853,side:hn}));c.position.set(e-13.5,2*Math.cos(a),n),c.rotation.x=-a,t.add(Se(c)),this.root.add(t)}addSoundGarden(){const t=new ye;t.name="SoundGarden";const e=ch.build({seed:4021});e.position.set(this.anchors.tree.x,0,this.anchors.tree.z),t.add(Se(e)),e.geometry.computeBoundingBox();const n=e.geometry.boundingBox;n&&(this.anchors.tree.setY(n.max.y*.75),this.anchors.bird.set(this.anchors.tree.x+n.max.x*.45,n.max.y*.66,this.anchors.tree.z+n.max.z*.3));const s=Do.build({seed:771});s.position.set(this.anchors.bush.x,0,this.anchors.bush.z),t.add(s);const r=Do.build({seed:9114,scale:.8});r.position.set(9.2,0,16.8),t.add(r),t.add(this.bird()),t.add(this.machine()),this.root.add(t)}bird(){const t=new ye,e=this.anchors.bird,n=new Kt(new ee(.16,0),this.materials.creature);n.position.copy(e),n.scale.set(1,.85,1.3);const s=new Kt(new jt(.045,.14,4),this.materials.marker);s.position.set(e.x,e.y+.02,e.z+.2),s.rotation.x=Math.PI/2;const r=new Kt(new jt(.07,.26,4),this.materials.creature);return r.position.set(e.x,e.y+.03,e.z-.22),r.rotation.x=-Math.PI/2,t.add(n,s,r),t}machine(){const t=new ye,e=this.anchors.machine;t.add(Se(ve(1.8,1.6,1.2,this.materials.metal,e.x,0,e.z))),this.wheel=new Kt(new K(.7,.7,.16,12),this.materials.metal),this.wheel.position.set(e.x+1.05,1.2,e.z),this.wheel.rotation.x=Math.PI/2,t.add(this.wheel);for(let s=0;s<4;s++){const r=new Kt(new V(.1,1.3,.08),this.materials.marker);r.rotation.z=s/4*Math.PI,this.wheel.add(r)}const n=new Kt(new K(.14,.14,2.6,8),this.materials.metal);return n.position.set(e.x-.6,2.4,e.z),t.add(n),t}addRooms(){const t=new ye;t.name="Rooms";const e=.4,n=this.materials.wall;t.add(ve(14+e*2,7,e,n,22,0,-18-e/2)),t.add(ve(e,7,14,n,15-e/2,0,-11)),t.add(ve(e,7,14,n,29+e/2,0,-11)),t.add(ve(14+e*2,e,14+e*2,n,22,7,-11)),t.add(ve(7,7,e,n,18.5,0,-4)),t.add(ve(5,7,e,n,26.5,0,-4)),t.add(ve(2,4.6,e,n,23,2.4,-4)),t.add(ve(e,3,8,n,19-e/2,0,0)),t.add(ve(e,3,8,n,27+e/2,0,0)),t.add(ve(8+e*2,e,8,n,23,3,0)),t.add(ve(3,3,e,n,20.5,0,4)),t.add(ve(3,3,e,n,25.5,0,4)),t.add(ve(2,.6,e,n,23,2.4,4)),this.root.add(Se(t))}dispose(){this.root.traverse(t=>{if(t instanceof Kt||t instanceof Jl||t instanceof L_){t.geometry.dispose();const e=t.material;if(Array.isArray(e))for(const n of e)n.dispose();else e.dispose()}}),this.root.clear()}}function Ew(i,t){return Math.PI*i*t}function ms(i,t,e,n={}){const s=n.ring??"excitation",r=n.compensation??"energy",o=n.maxQ??(s==="filter"?220:14),a=[],c=[];return{inputs:t.map(h=>{const u=i.createGain(),f=i.createBiquadFilter();f.type="bandpass",f.frequency.value=h.hz;const d=h.q??(s==="filter"?Math.min(o,Math.max(1,Ew(h.hz,h.decay))):Math.min(o,Math.max(4,4+h.decay*24)));f.Q.value=d,c.push(d);const m=i.createGain();return m.gain.value=r==="energy"?Math.sqrt(d):1/Math.sqrt(d),u.connect(f).connect(m).connect(e),a.push(u,f,m),u}),modes:t,qs:c,dispose(){for(const h of a)h.disconnect()}}}const _l=8,Ka=48;function ep(i){return Array.from({length:_l},(t,e)=>{const n=((e+1)/_l)**2,s=new Float32Array(Ka);for(let r=0;r<Ka;r++)s[r]=n*i(r/(Ka-1));return s})}const Tw=ep(i=>.5*(1-Math.cos(2*Math.PI*i)));ep(i=>{if(i<.05)return .5*(1-Math.cos(Math.PI*(i/.05)));const e=(i-.05)/(1-.05);return Math.exp(-5*e)*(1-e)});function Aw(i){return i[Math.floor(Math.random()*_l)]}function pr(i,t,e,n,s){i.setValueAtTime(0,t),i.linearRampToValueAtTime(e,t+n),i.setTargetAtTime(0,t+n,s/3)}function np(i,t,e){const n=i.createGain(),s=i.createBiquadFilter();return s.type="bandpass",s.frequency.value=t.hz,s.Q.value=t.q,n.connect(s).connect(e),{input:n,dispose(){n.disconnect(),s.disconnect()}}}function ip(i,t,e,n,s,r){const o=n.count/Math.max(n.over,.001);let a=0;for(let c=0;c<n.count&&(a+=-Math.log(1-Math.random()*.999-.001)/o,!(a>n.over*1.4));c++){const l=Math.exp(-a/n.energyDecay),h=r*n.level*l*(.35+Math.random()*.65);if(h<.002)continue;const u=i.createBufferSource();u.buffer=t,u.playbackRate.value=.7+Math.random()*.7;const f=i.createGain(),d=s+a;pr(f.gain,d,h,8e-4,.012),u.connect(f).connect(e),u.start(d,Math.random()*Math.max(t.duration-.2,0),.06),u.stop(d+.07)}}function Sn(i,t,e,n,s,r){if(s<=5e-4)return;const o=i.createBufferSource();o.buffer=t;const a=i.createGain();pr(a.gain,n,s,Math.min(.0012,r*.3),r*1.6),o.connect(a).connect(e),o.start(n,Math.random()*Math.max(t.duration-.5,0),r+.05),o.stop(n+r+.06)}function Qo(i,t,e,n,s,r,o,a=.002){if(n<=5e-4)return;const c=i.createOscillator();c.type="sine",c.frequency.setValueAtTime(s,e),c.frequency.exponentialRampToValueAtTime(Math.max(r,1),e+o);const l=i.createGain();pr(l.gain,e,n,a,o),c.connect(l).connect(t),c.start(e),c.stop(e+o*3+.06)}const ro={stone:{level:.5,impact:{level:.9,duration:.011,tone:3800},modes:[{hz:620,decay:.06,level:.6},{hz:1450,decay:.03,level:.32},{hz:2600,decay:.018,level:.12}],grit:{count:5,over:.06,energyDecay:.025,hz:2600,q:1.2,level:.12},toe:.45,roll:.075},wood:{level:.6,impact:{level:.7,duration:.018,tone:1700},modes:[{hz:155,decay:.22,level:1},{hz:390,decay:.15,level:.6},{hz:720,decay:.075,level:.22}],grit:{count:4,over:.05,energyDecay:.02,hz:1200,q:.9,level:.08},toe:.6,roll:.085},earth:{level:.5,impact:{level:1,duration:.022,tone:900},modes:[{hz:120,decay:.05,level:.55}],grit:{count:9,over:.07,energyDecay:.028,hz:1600,q:1,level:.22},toe:.4,roll:.085},gravel:{level:.5,impact:{level:.45,duration:.012,tone:2400},modes:[],grit:{count:26,over:.16,energyDecay:.06,hz:3e3,q:1.4,level:.75},toe:.7,roll:.09},grass:{level:.32,impact:{level:.5,duration:.03,tone:1400},modes:[],grit:{count:16,over:.11,energyDecay:.045,hz:5200,q:.9,level:.4},toe:.6,roll:.085},leaves:{level:.4,impact:{level:.35,duration:.02,tone:2600},modes:[],grit:{count:34,over:.2,energyDecay:.08,hz:4200,q:2.2,level:.55},toe:.75,roll:.09},metal:{level:.45,impact:{level:.9,duration:.004,tone:9e3},modes:[{hz:480,decay:.5,level:.5},{hz:1270,decay:.42,level:.45},{hz:2340,decay:.3,level:.3},{hz:4100,decay:.18,level:.2}],grit:null,toe:.5,roll:.07},mud:{level:.5,impact:{level:1,duration:.05,tone:700},modes:[{hz:240,decay:.06,level:.35}],grit:{count:6,over:.09,energyDecay:.03,hz:900,q:3.2,level:.3},toe:.3,roll:.1}},Rw=6,cd=.35,Cw=9;function Fs(i,t){return i+Math.random()*(t-i)}class Pw{surface="earth";engine;output;body;panner;reverbSend;chains=new Map;left=!1;constructor(t,e=.55){this.engine=t;const n=t.context;this.output=n.createGain(),this.output.gain.value=e,this.body=n.createBiquadFilter(),this.body.type="lowpass",this.body.frequency.value=5200,this.body.Q.value=.6,this.panner=n.createStereoPanner(),this.reverbSend=n.createGain(),this.reverbSend.gain.value=.6,this.output.connect(this.body),this.body.connect(this.panner),this.panner.connect(t.dry),this.panner.connect(this.reverbSend),this.reverbSend.connect(t.send)}setReverb(t){this.reverbSend.gain.setTargetAtTime(Math.max(0,t),this.engine.context.currentTime,.1)}step(t){const e=this.engine.context;if(e.state!=="running"||!this.engine.noise)return;const n=ro[this.surface],s=this.chainFor(this.surface),r=e.currentTime+.004,o=cd+(1-cd)*(1-Math.exp(-t/(Rw*.45))),a=n.level*Math.min(o,1);if(this.panner.pan.setValueAtTime(this.takeFoot()*.2,r),this.strike(s,n,r,a*Fs(.9,1.1)),n.toe>0){const c=n.roll*Math.max(.35,1-t/12);this.strike(s,n,r+c,a*n.toe*Fs(.8,1.1))}}land(t){const e=this.engine.context;if(e.state!=="running"||!this.engine.noise)return;const n=ro[this.surface],s=this.chainFor(this.surface),r=e.currentTime+.004,o=Math.min(t/Cw,1),a=n.level*(.7+o*.85);this.panner.pan.setValueAtTime(0,r),this.strike(s,n,r,a),this.strike(s,n,r+Fs(.012,.03),a*Fs(.4,.6))}jump(){const t=this.engine.context;if(t.state!=="running"||!this.engine.noise)return;const e=ro[this.surface],n=this.chainFor(this.surface),s=t.currentTime+.004;this.panner.pan.setValueAtTime(this.takeFoot()*.12,s),this.strike(n,e,s,e.level*Fs(.42,.55),{stretch:3.2,modes:.28,grit:1.7})}takeFoot(){const t=this.left?-1:1;return this.left=!this.left,t}strike(t,e,n,s,r){const o=this.engine.context,a=this.engine.noise;if(!a)return;const c=r?.stretch??1,l=r?.modes??1,h=r?.grit??1;Sn(o,a.white,t.impactInput,n,s*e.impact.level,e.impact.duration*c);for(let u=0;u<e.modes.length;u++)Sn(o,a.white,t.bank.inputs[u],n,s*e.modes[u].level*.5*l,.002);e.grit&&t.gritInput&&ip(o,a.white,t.gritInput,e.grit,n,s*h)}chainFor(t){const e=this.chains.get(t);if(e)return e;const n=this.engine.context,s=ro[t],r=n.createGain(),o=n.createBiquadFilter();o.type="lowpass",o.frequency.value=s.impact.tone,r.connect(o).connect(this.output);const a=ms(n,s.modes,this.output,{ring:"filter",compensation:"inverse"});let c=null;s.grit&&(c=np(n,s.grit,this.output).input);const l={impactInput:r,bank:a,gritInput:c};return this.chains.set(t,l),l}dispose(){this.output.disconnect(),this.body.disconnect(),this.panner.disconnect(),this.reverbSend.disconnect()}}const Lw=6;function sp(i){const t=Math.floor(i.sampleRate*Lw);return{white:ja(i,t,Dw()),pink:ja(i,t,Nw()),brown:ja(i,t,Uw())}}function ja(i,t,e){const n=i.createBuffer(1,t,i.sampleRate),s=n.getChannelData(0);for(let o=0;o<t;o++)s[o]=e();const r=Math.min(2048,t/4|0);for(let o=0;o<r;o++){const a=o/r;s[o]=s[o]*a+s[t-r+o]*(1-a)}return Iw(s),n}function Iw(i){let t=0;for(let n=0;n<i.length;n++)t=Math.max(t,Math.abs(i[n]));if(t===0)return;const e=.95/t;for(let n=0;n<i.length;n++)i[n]*=e}function Dw(){return()=>Math.random()*2-1}function Nw(){let i=0,t=0,e=0,n=0,s=0,r=0,o=0;return()=>{const a=Math.random()*2-1;i=.99886*i+a*.0555179,t=.99332*t+a*.0750759,e=.969*e+a*.153852,n=.8665*n+a*.3104856,s=.55*s+a*.5329522,r=-.7616*r-a*.016898;const c=i+t+e+n+s+r+o+a*.5362;return o=a*.115926,c*.11}}function Uw(){let i=0;return()=>{const t=Math.random()*2-1;return i=(i+.02*t)/1.02,i*3.5}}function _n(i,t,e,n=.06){const s=i.createBufferSource();return s.buffer=t,s.loop=!0,s.playbackRate.value=1+(Math.random()*2-1)*n,s.connect(e),s.start(0,Math.random()*t.duration),{source:s,stop(r=0){try{s.stop(r)}catch{}}}}const oo={open:{rt60:.7,preDelay:.012,damping:.7,wet:.12},cell:{rt60:.45,preDelay:.004,damping:.55,wet:.3},hall:{rt60:4.2,preDelay:.035,damping:.18,wet:.62}};async function Fw(i,t){const e=Math.max(t.rt60,.05),n=Math.ceil(i*(e+t.preDelay)),s=new OfflineAudioContext(2,n,i),r=s.createBufferSource();r.buffer=Ow(s,n,i,t);const o=s.createBiquadFilter();o.type="lowpass",o.frequency.value=700+(1-t.damping)**2*17300;const a=s.createBiquadFilter();return a.type="highpass",a.frequency.value=90,r.connect(o).connect(a).connect(s.destination),r.start(0),s.startRendering()}function Ow(i,t,e,n){const s=i.createBuffer(2,t,e),r=Math.floor(n.preDelay*e),o=Math.exp(-Math.log(1e3)/(n.rt60*e));for(let a=0;a<2;a++){const c=s.getChannelData(a);let l=1;for(let h=r;h<t;h++)c[h]=(Math.random()*2-1)*l,l*=o}return s}const Ja=[1,.4,.2,.1],zw=[1,2.7,6.1,13.3],kw=.11;function ld(i){let t=Math.imul(i|0,668265261);return t^=t>>>15,t=Math.imul(t,2246822507),t^=t>>>13,(t>>>0)/4294967296}function rp(i){const t=Math.floor(i),e=i-t,n=(1-Math.cos(e*Math.PI))*.5;return ld(t)*(1-n)+ld(t+1)*n}const Bw=1.35;function Hw(i){let t=0,e=0;for(let s=0;s<Ja.length;s++)t+=rp(i*zw[s]+s*17.3)*Ja[s],e+=Ja[s];const n=t/e;return Math.min(1,Math.max(0,.5+(n-.5)*Bw))}const Gw={windSpeed:.5,gustDepth:.6,gustRate:.06,windDirection:2.1};class op{settings={...Gw};gust=0;swell=.5;strength=0;time=0;update(t){this.time+=t*this.settings.gustRate,this.gust=Hw(this.time),this.swell=rp(this.time*kw+91.7);const{windSpeed:e,gustDepth:n}=this.settings,s=e*(.45+this.swell*1.1);this.strength=Math.min(1,Math.max(0,s+(this.gust-.5)*n))}}const Vw=""+new URL("processor-Xg0mnuxH.js",import.meta.url).href,hd=new WeakMap;function Ww(i){let t=hd.get(i);return t||(t=i.audioWorklet.addModule(Vw),hd.set(i,t)),t}const ud=new Map;async function Xw(i,t){let e=ud.get(i);return e||(e=fetch(i).then(n=>{if(!n.ok)throw new Error(`${n.status} ${n.statusText}`);return n.arrayBuffer()}).then(n=>({wasm:n,meta:t})).catch(n=>(console.warn(`faust: could not load ${i} — falling back`,n),null)),ud.set(i,e)),e}async function ap(i,t,e){try{const[n]=await Promise.all([Xw(t,e),Ww(i)]);if(!n)return null;const s=new AudioWorkletNode(i,"faust-processor",{numberOfInputs:e.inputs>0?1:0,numberOfOutputs:1,outputChannelCount:[Math.max(e.outputs,1)],processorOptions:{wasm:n.wasm,meta:n.meta}}),r=new Map;for(const[o,a]of Object.entries(e.params))r.set(o,a.init);return{node:s,meta:e,set(o,a){r.set(o,a),s.port.postMessage({type:"param",key:o,value:a})},get(o){return r.get(o)??0},dispose(){s.port.onmessage=null,s.disconnect()}}}catch(n){return console.warn("faust: worklet unavailable — falling back",n),null}}const cp=Object.freeze(Object.defineProperty({__proto__:null,createFaustNode:ap},Symbol.toStringTag,{value:"Module"})),qw=""+new URL("reverb-BkEOyDCs.wasm",import.meta.url).href,Yw=qw,$w={name:"reverb",inputs:1,outputs:2,size:1982988,params:{crossover:{at:36,init:200,min:50,max:1e3,step:1},damping:{at:16,init:6e3,min:700,max:16e3,step:1},decayLow:{at:24,init:2,min:.2,max:12,step:.01},decayMid:{at:28,init:2,min:.2,max:12,step:.01},preDelay:{at:327756,init:20,min:0,max:100,step:1}}},lp={masterVolume:.7,reverbAmount:1,airAbsorption:.65,occlusion:.8},Zw=.12,dd=8,fd=24;class Kw{context;settings={...lp};weather=new op;dry;send;duck;master;noise=null;ready;started=!1;rooms=new Map;currentRoom=null;occlusionTimer=0;emitters=new Set;ranking=[];faust=null;faustWet=null;tap=null;constructor(){this.context=new AudioContext({latencyHint:"interactive"}),this.master=this.context.createGain(),this.duck=this.context.createGain(),this.dry=this.context.createGain(),this.send=this.context.createGain();const t=this.context.createDynamicsCompressor();t.threshold.value=-6,t.knee.value=6,t.ratio.value=12,t.attack.value=.003,t.release.value=.25,this.dry.connect(this.duck),this.duck.connect(this.master),this.master.connect(t),t.connect(this.context.destination),this.ready=this.build(),this.listenForGesture(),document.addEventListener("visibilitychange",this.handleVisibility)}async build(){this.noise=sp(this.context);const t=await ap(this.context,Yw,$w);if(t){const s=this.context.createGain();s.gain.value=0,this.send.connect(t.node),t.node.connect(s),s.connect(this.duck),this.faust=t,this.faustWet=s}const e=Object.keys(oo),n=await Promise.all(e.map(s=>Fw(this.context.sampleRate,oo[s])));this.faust||(e.forEach((s,r)=>{const o=this.context.createConvolver();o.normalize=!0,o.buffer=n[r];const a=this.context.createGain();a.gain.value=0,this.send.connect(o),o.connect(a),a.connect(this.duck),this.rooms.set(s,{convolver:o,gain:a})}),this.currentRoom!==null&&this.setRoom(this.currentRoom))}setRoom(t,e=.45){this.currentRoom=t;const n=this.context.currentTime,s=oo[t];if(this.faust&&this.faustWet){this.faust.set("decayLow",s.rt60*1.5),this.faust.set("decayMid",s.rt60),this.faust.set("crossover",200),this.faust.set("damping",700+(1-s.damping)**2*15300),this.faust.set("preDelay",s.preDelay*1e3),this.faustWet.gain.cancelScheduledValues(n),this.faustWet.gain.setTargetAtTime(s.wet*this.settings.reverbAmount,n,e/3);return}if(this.rooms.size!==0)for(const[r,o]of this.rooms){const a=r===t?oo[r].wet*this.settings.reverbAmount:0;o.gain.gain.cancelScheduledValues(n),o.gain.gain.setTargetAtTime(a,n,e/3)}}get reverbKind(){return this.faust?"fdn":"convolution"}get reverbControls(){return this.faust}get analyser(){if(!this.tap){const t=this.context.createAnalyser();t.fftSize=2048,t.smoothingTimeConstant=.6,this.master.connect(t),this.tap=t}return this.tap}get room(){return this.currentRoom}register(t){this.emitters.add(t)}unregister(t){this.emitters.delete(t)}update(t,e){return this.weather.update(t),this.updateListener(e),this.master.gain.value=this.settings.masterVolume,this.occlusionTimer-=t,this.occlusionTimer>0?!1:(this.occlusionTimer=Zw,this.allocateVoices(),!0)}allocateVoices(){this.ranking.length=0;for(const e of this.emitters){if(!e.enabled){e.setDetail("virtual");continue}const n=e.position.distanceTo(Nn);if(n>e.maxDistance){e.setDetail("virtual");continue}this.ranking.push({emitter:e,priority:n/Math.max(e.importance,.01)})}this.ranking.sort((e,n)=>e.priority-n.priority);const t=2;for(let e=0;e<this.ranking.length;e++){const{emitter:n}=this.ranking[e],s=n.detailLevel;let r;e<dd?r="hrtf":e<fd?r="panned":r="virtual",s==="hrtf"&&e<dd+t?r="hrtf":s==="panned"&&r==="virtual"&&e<fd+t&&(r="panned"),n.setDetail(r)}}get voiceCounts(){let t=0,e=0,n=0;for(const s of this.emitters)s.detailLevel==="hrtf"?t++:s.detailLevel==="panned"?e++:n++;return{hrtf:t,panned:e,virtual:n}}updateListener(t){const e=this.context.listener;if(t.updateWorldMatrix(!0,!1),Nn.setFromMatrixPosition(t.matrixWorld),gi.set(0,0,-1).applyQuaternion(t.getWorldQuaternion(pd)),vi.set(0,1,0).applyQuaternion(pd),e.positionX){const n=this.context.currentTime,s=.02;e.positionX.linearRampToValueAtTime(Nn.x,n+s),e.positionY.linearRampToValueAtTime(Nn.y,n+s),e.positionZ.linearRampToValueAtTime(Nn.z,n+s),e.forwardX.linearRampToValueAtTime(gi.x,n+s),e.forwardY.linearRampToValueAtTime(gi.y,n+s),e.forwardZ.linearRampToValueAtTime(gi.z,n+s),e.upX.linearRampToValueAtTime(vi.x,n+s),e.upY.linearRampToValueAtTime(vi.y,n+s),e.upZ.linearRampToValueAtTime(vi.z,n+s)}else{const n=e;n.setPosition(Nn.x,Nn.y,Nn.z),n.setOrientation(gi.x,gi.y,gi.z,vi.x,vi.y,vi.z)}}get listenerPosition(){return Nn}applyReverbAmount(){this.currentRoom!==null&&this.setRoom(this.currentRoom,.05)}listenForGesture(){const t=()=>{this.context.resume().then(()=>{this.started=this.context.state==="running"}),window.removeEventListener("pointerdown",t),window.removeEventListener("keydown",t),window.removeEventListener("touchstart",t)};window.addEventListener("pointerdown",t),window.addEventListener("keydown",t),window.addEventListener("touchstart",t)}handleVisibility=()=>{document.hidden?this.context.suspend():this.started&&this.context.resume()};dispose(){document.removeEventListener("visibilitychange",this.handleVisibility),this.context.close()}}const Nn=new C,gi=new C,vi=new C,pd=new ai;/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.21.0
 * @author George Michael Brower
 * @license MIT
 */class xn{constructor(t,e,n,s,r="div"){this.parent=t,this.object=e,this.property=n,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(r),this.domElement.classList.add("lil-controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("lil-name"),xn.nextNameID=xn.nextNameID||0,this.$name.id=`lil-gui-name-${++xn.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("lil-widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(n)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("lil-disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class jw extends xn{constructor(t,e,n){super(t,e,n,"lil-boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function xl(i){let t,e;return(t=i.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=i.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=i.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const Jw={isPrimitive:!0,match:i=>typeof i=="string",fromHexString:xl,toHexString:xl},rr={isPrimitive:!0,match:i=>typeof i=="number",fromHexString:i=>parseInt(i.substring(1),16),toHexString:i=>"#"+i.toString(16).padStart(6,0)},Qw={isPrimitive:!1,match:i=>Array.isArray(i)||ArrayBuffer.isView(i),fromHexString(i,t,e=1){const n=rr.fromHexString(i);t[0]=(n>>16&255)/255*e,t[1]=(n>>8&255)/255*e,t[2]=(n&255)/255*e},toHexString([i,t,e],n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return rr.toHexString(s)}},tM={isPrimitive:!1,match:i=>Object(i)===i,fromHexString(i,t,e=1){const n=rr.fromHexString(i);t.r=(n>>16&255)/255*e,t.g=(n>>8&255)/255*e,t.b=(n&255)/255*e},toHexString({r:i,g:t,b:e},n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return rr.toHexString(s)}},eM=[Jw,rr,Qw,tM];function nM(i){return eM.find(t=>t.match(i))}class iM extends xn{constructor(t,e,n,s){super(t,e,n,"lil-color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=nM(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const r=xl(this.$text.value);r&&this._setValueFromHexString(r)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Qa extends xn{constructor(t,e,n){super(t,e,n,"lil-function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class sM extends xn{constructor(t,e,n,s,r,o){super(t,e,n,"lil-number"),this._initInput(),this.min(s),this.max(r);const a=o!==void 0;this.step(a?o:this._getImplicitStep(),a),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let _=parseFloat(this.$input.value);isNaN(_)||(this._stepExplicit&&(_=this._snap(_)),this.setValue(this._clamp(_)))},n=_=>{const y=parseFloat(this.$input.value);isNaN(y)||(this._snapClampSetValue(y+_),this.$input.value=this.getValue())},s=_=>{_.key==="Enter"&&this.$input.blur(),_.code==="ArrowUp"&&(_.preventDefault(),n(this._step*this._arrowKeyMultiplier(_))),_.code==="ArrowDown"&&(_.preventDefault(),n(this._step*this._arrowKeyMultiplier(_)*-1))},r=_=>{this._inputFocused&&(_.preventDefault(),n(this._step*this._normalizeMouseWheel(_)))};let o=!1,a,c,l,h,u;const f=5,d=_=>{a=_.clientX,c=l=_.clientY,o=!0,h=this.getValue(),u=0,window.addEventListener("mousemove",m),window.addEventListener("mouseup",v)},m=_=>{if(o){const y=_.clientX-a,x=_.clientY-c;Math.abs(x)>f?(_.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(y)>f&&v()}if(!o){const y=_.clientY-l;u-=y*this._step*this._arrowKeyMultiplier(_),h+u>this._max?u=this._max-h:h+u<this._min&&(u=this._min-h),this._snapClampSetValue(h+u)}l=_.clientY},v=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",v)},g=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",r,{passive:!1}),this.$input.addEventListener("mousedown",d),this.$input.addEventListener("focus",g),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("lil-slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("lil-fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("lil-has-slider");const t=(p,_,y,x,b)=>(p-_)/(y-_)*(b-x)+x,e=p=>{const _=this.$slider.getBoundingClientRect();let y=t(p,_.left,_.right,this._min,this._max);this._snapClampSetValue(y)},n=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",r)},s=p=>{e(p.clientX)},r=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",r)};let o=!1,a,c;const l=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},h=p=>{p.touches.length>1||(this._hasScrollBar?(a=p.touches[0].clientX,c=p.touches[0].clientY,o=!0):l(p),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",f))},u=p=>{if(o){const _=p.touches[0].clientX-a,y=p.touches[0].clientY-c;Math.abs(_)>Math.abs(y)?l(p):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",f))}else p.preventDefault(),e(p.touches[0].clientX)},f=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",f)},d=this._callOnFinishChange.bind(this),m=400;let v;const g=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const y=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+y),this.$input.value=this.getValue(),clearTimeout(v),v=setTimeout(d,m)};this.$slider.addEventListener("mousedown",n),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",g,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("lil-active",t),document.body.classList.toggle("lil-dragging",t),document.body.classList.toggle(`lil-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:n}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,n=-t.wheelDelta/120,n*=this._stepExplicit?1:10),e+-n}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){let e=0;return this._hasMin?e=this._min:this._hasMax&&(e=this._max),t-=e,t=Math.round(t/this._step)*this._step,t+=e,t=parseFloat(t.toPrecision(15)),t}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class rM extends xn{constructor(t,e,n,s){super(t,e,n,"lil-option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("lil-focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("lil-focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const n=document.createElement("option");n.textContent=e,this.$select.appendChild(n)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class oM extends xn{constructor(t,e,n){super(t,e,n,"lil-string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}var aM=`.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.lil-root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.lil-root > .lil-children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.lil-allow-touch-styles, .lil-gui.lil-allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.lil-force-touch-styles, .lil-gui.lil-force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.lil-auto-place, .lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-controller.lil-disabled {
  opacity: 0.5;
}
.lil-controller.lil-disabled, .lil-controller.lil-disabled * {
  pointer-events: none !important;
}
.lil-controller > .lil-name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-controller .lil-widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-controller.lil-string input {
  color: var(--string-color);
}
.lil-controller.lil-boolean {
  cursor: pointer;
}
.lil-controller.lil-color .lil-display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-controller.lil-color .lil-display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-controller.lil-color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-controller.lil-color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-controller.lil-option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-controller.lil-option .lil-display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-display.lil-focus {
    background: var(--focus-color);
  }
}
.lil-controller.lil-option .lil-display.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-option .lil-display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-controller.lil-option .lil-widget,
.lil-controller.lil-option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-widget:hover .lil-display {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number input {
  color: var(--number-color);
}
.lil-controller.lil-number.lil-has-slider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-controller.lil-number .lil-slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-controller.lil-number .lil-slider:hover {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number .lil-slider.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-number .lil-slider.lil-active .lil-fill {
  opacity: 0.95;
}
.lil-controller.lil-number .lil-fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-dragging * {
  cursor: ew-resize !important;
}
.lil-dragging.lil-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .lil-title {
  height: var(--title-height);
  font-weight: 600;
  padding: 0 var(--padding);
  width: 100%;
  text-align: left;
  background: none;
  text-decoration-skip: objects;
}
.lil-gui .lil-title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .lil-title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-dragging) .lil-gui .lil-title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .lil-title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.lil-root > .lil-title:focus {
  text-decoration: none !important;
}
.lil-gui.lil-closed > .lil-title:before {
  content: "▸";
}
.lil-gui.lil-closed > .lil-children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.lil-closed:not(.lil-transition) > .lil-children {
  display: none;
}
.lil-gui.lil-transition > .lil-children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .lil-children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.lil-root > .lil-children > .lil-gui > .lil-title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.lil-root > .lil-children > .lil-gui.lil-closed > .lil-title {
  border-bottom-color: transparent;
}
.lil-gui + .lil-controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .lil-title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .lil-children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .lil-controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  border: none;
}
.lil-gui .lil-controller button {
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
}
@media (hover: hover) {
  .lil-gui .lil-controller button:hover {
    background: var(--hover-color);
  }
  .lil-gui .lil-controller button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui .lil-controller button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff2;charset=utf-8;base64,d09GMgABAAAAAALkAAsAAAAABtQAAAKVAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDMgqBBIEbATYCJAMUCwwABCAFhAoHgQQbHAbIDiUFEYVARAAAYQTVWNmz9MxhEgodq49wYRUFKE8GWNiUBxI2LBRaVnc51U83Gmhs0Q7JXWMiz5eteLwrKwuxHO8VFxUX9UpZBs6pa5ABRwHA+t3UxUnH20EvVknRerzQgX6xC/GH6ZUvTcAjAv122dF28OTqCXrPuyaDER30YBA1xnkVutDDo4oCi71Ca7rrV9xS8dZHbPHefsuwIyCpmT7j+MnjAH5X3984UZoFFuJ0yiZ4XEJFxjagEBeqs+e1iyK8Xf/nOuwF+vVK0ur765+vf7txotUi0m3N0m/84RGSrBCNrh8Ee5GjODjF4gnWP+dJrH/Lk9k4oT6d+gr6g/wssA2j64JJGP6cmx554vUZnpZfn6ZfX2bMwPPrlANsB86/DiHjhl0OP+c87+gaJo/gY084s3HoYL/ZkWHTRfBXvvoHnnkHvngKun4KBE/ede7tvq3/vQOxDXB1/fdNz6XbPdcr0Vhpojj9dG+owuSKFsslCi1tgEjirjXdwMiov2EioadxmqTHUCIwo8NgQaeIasAi0fTYSPTbSmwbMOFduyh9wvBrESGY0MtgRjtgQR8Q1bRPohn2UoCRZf9wyYANMXFeJTysqAe0I4mrherOekFdKMrYvJjLvOIUM9SuwYB5DVZUwwVjJJOaUnZCmcEkIZZrKqNvRGRMvmFZsmhP4VMKCSXBhSqUBxgMS7h0cZvEd71AWkEhGWaeMFcNnpqyJkyXgYL7PQ1MoSq0wDAkRtJIijkZSmqYTiSImfLiSWXIZwhRh3Rug2X0kk1Dgj+Iu43u5p98ghopcpSo0Uyc8SnjlYX59WUeaMoDqmVD2TOWD9a4pCRAzf2ECgwGcrHjPOWY9bNxq/OL3I/QjwEAAAA=") format("woff2");
}`;function cM(i){const t=document.createElement("style");t.innerHTML=i;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let md=!1;class lh{constructor({parent:t,autoPlace:e=t===void 0,container:n,width:s,title:r="Controls",closeFolders:o=!1,injectStyles:a=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("button"),this.$title.classList.add("lil-title"),this.$title.setAttribute("aria-expanded",!0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("lil-children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(r),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("lil-root"),c&&this.domElement.classList.add("lil-allow-touch-styles"),!md&&a&&(cM(aM),md=!0),n?n.appendChild(this.domElement):e&&(this.domElement.classList.add("lil-auto-place","autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=o}add(t,e,n,s,r){if(Object(n)===n)return new rM(this,t,e,n);const o=t[e];switch(typeof o){case"number":return new sM(this,t,e,n,s,r);case"boolean":return new jw(this,t,e);case"string":return new oM(this,t,e);case"function":return new Qa(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,n=1){return new iM(this,t,e,n)}addFolder(t){const e=new lh({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(n=>{n instanceof Qa||n._name in t.controllers&&n.load(t.controllers[n._name])}),e&&t.folders&&this.folders.forEach(n=>{n._title in t.folders&&n.load(t.folders[n._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(n=>{if(!(n instanceof Qa)){if(n._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${n._name}"`);e.controllers[n._name]=n.save()}}),t&&this.folders.forEach(n=>{if(n._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${n._title}"`);e.folders[n._title]=n.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("lil-closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("lil-transition");const n=r=>{r.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("lil-transition"),this.$children.removeEventListener("transitionend",n))};this.$children.addEventListener("transitionend",n);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("lil-closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(n=>n.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}var Js=function(){var i=0,t=document.createElement("div");t.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",t.addEventListener("click",function(h){h.preventDefault(),n(++i%t.children.length)},!1);function e(h){return t.appendChild(h.dom),h}function n(h){for(var u=0;u<t.children.length;u++)t.children[u].style.display=u===h?"block":"none";i=h}var s=(performance||Date).now(),r=s,o=0,a=e(new Js.Panel("FPS","#0ff","#002")),c=e(new Js.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var l=e(new Js.Panel("MB","#f08","#201"));return n(0),{REVISION:16,dom:t,addPanel:e,showPanel:n,begin:function(){s=(performance||Date).now()},end:function(){o++;var h=(performance||Date).now();if(c.update(h-s,200),h>=r+1e3&&(a.update(o*1e3/(h-r),100),r=h,o=0,l)){var u=performance.memory;l.update(u.usedJSHeapSize/1048576,u.jsHeapSizeLimit/1048576)}return h},update:function(){s=this.end()},domElement:t,setMode:n}};Js.Panel=function(i,t,e){var n=1/0,s=0,r=Math.round,o=r(window.devicePixelRatio||1),a=80*o,c=48*o,l=3*o,h=2*o,u=3*o,f=15*o,d=74*o,m=30*o,v=document.createElement("canvas");v.width=a,v.height=c,v.style.cssText="width:80px;height:48px";var g=v.getContext("2d");return g.font="bold "+9*o+"px Helvetica,Arial,sans-serif",g.textBaseline="top",g.fillStyle=e,g.fillRect(0,0,a,c),g.fillStyle=t,g.fillText(i,l,h),g.fillRect(u,f,d,m),g.fillStyle=e,g.globalAlpha=.9,g.fillRect(u,f,d,m),{dom:v,update:function(p,_){n=Math.min(n,p),s=Math.max(s,p),g.fillStyle=e,g.globalAlpha=1,g.fillRect(0,0,a,f),g.fillStyle=t,g.fillText(r(p)+" "+i+" ("+r(n)+"-"+r(s)+")",l,h),g.drawImage(v,u+o,f,d-o,m,u,f,d-o,m),g.fillRect(u+d-o,f,o,m),g.fillStyle=e,g.globalAlpha=.9,g.fillRect(u+d-o,f,o,r((1-p/_)*m))}}};function lM(){if(!Yf.debug)return{gui:null,stats:null,update:()=>{},dispose:()=>{}};const i=new Js;i.dom.style.position="fixed",i.dom.style.top="0",i.dom.style.left="0",document.body.appendChild(i.dom);const t=new lh({title:"hswow"});return t.domElement.style.setProperty("--width","280px"),{gui:t,stats:i,update:()=>i.update(),dispose:()=>{t.destroy(),i.dom.remove()}}}const ao=2e4,hM=420,uM=.32,dM=.08,tc=.04,ec=.5;class hp{position=new C;enabled=!0;importance;maxDistance;engine;model;absorption;occlusion;swap;panner;sendGain;reverb;ignoreAbsorption;ignoreOcclusion;invertDistance;occluded=!1;detail="panned";connected=!1;pending=0;constructor(t,e,n){this.engine=t,this.model=e,this.position.copy(n.position),this.maxDistance=n.maxDistance??60,this.reverb=n.reverb??1,this.importance=n.importance??1,this.ignoreAbsorption=n.ignoreAbsorption??!1,this.ignoreOcclusion=n.ignoreOcclusion??!1,this.invertDistance=n.invertDistance??!1;const s=t.context;this.absorption=s.createBiquadFilter(),this.absorption.type="lowpass",this.absorption.frequency.value=ao,this.occlusion=s.createGain(),this.swap=s.createGain(),this.panner=s.createPanner(),this.panner.panningModel="equalpower",this.panner.distanceModel="inverse",this.panner.refDistance=n.refDistance??1.5,this.panner.maxDistance=this.maxDistance,this.panner.rolloffFactor=this.invertDistance?0:n.rolloff??1.1,n.direction&&(this.panner.coneInnerAngle=n.coneInner??90,this.panner.coneOuterAngle=n.coneOuter??240,this.panner.coneOuterGain=n.coneOuterGain??.35,fM(this.panner,n.direction)),gd(this.panner,this.position),this.sendGain=s.createGain(),this.sendGain.gain.value=this.reverb,this.absorption.connect(this.occlusion),this.occlusion.connect(this.swap),this.swap.connect(this.panner),this.panner.connect(t.dry),this.panner.connect(this.sendGain),this.sendGain.connect(t.send),this.connect(),t.register(this)}moveTo(t){this.position.copy(t),gd(this.panner,this.position)}setDetail(t){t!==this.detail&&(this.detail=t,this.retarget())}retarget(){const t=this.engine.context,e=t.currentTime;this.swap.gain.cancelScheduledValues(e),this.swap.gain.setValueAtTime(this.swap.gain.value,e),this.swap.gain.linearRampToValueAtTime(0,e+tc),window.clearTimeout(this.pending),this.pending=window.setTimeout(()=>{const n=this.detail;if(n==="virtual"){this.connected&&(this.disconnect(),this.model.setActive?.(!1));return}this.connected||(this.connect(),this.model.setActive?.(!0)),this.panner.panningModel=n==="hrtf"?"HRTF":"equalpower";const s=t.currentTime;this.swap.gain.cancelScheduledValues(s),this.swap.gain.setValueAtTime(0,s),this.swap.gain.linearRampToValueAtTime(1,s+tc)},tc*1e3+10)}update(t,e,n){if(this.detail==="virtual"||!this.enabled){this.enabled===!1&&this.connected&&this.glide(this.occlusion.gain,0);return}const s=this.position.distanceTo(this.engine.listenerPosition);this.model.update?.(t,this.engine),n&&!this.ignoreOcclusion&&(this.occluded=this.testOcclusion(e,s));const r=this.engine.settings,o=Math.min(s/this.maxDistance,1),a=this.ignoreAbsorption?ao:ao*(1-r.airAbsorption*Math.sqrt(o)*.94),c=this.occluded?r.occlusion:0,l=Math.min(a,vd(ao,hM,c)),h=this.invertDistance?yd(o):o<=ec?1:1-yd((o-ec)/(1-ec));this.glide(this.absorption.frequency,Math.max(l,180)),this.glide(this.occlusion.gain,vd(1,uM,c)*h),this.sendGain.gain.value=this.reverb*r.reverbAmount}testOcclusion(t,e){if(e<.5)return!1;On.subVectors(this.position,this.engine.listenerPosition).divideScalar(e);const n=t.raycast(this.engine.listenerPosition,On);return n!==null&&n<e-.35}connect(){this.connected||(this.model.output.connect(this.absorption),this.connected=!0)}disconnect(){if(this.connected){try{this.model.output.disconnect(this.absorption)}catch{}this.connected=!1}}glide(t,e){t.setTargetAtTime(e,this.engine.context.currentTime,dM)}get isOccluded(){return this.occluded}get isVirtual(){return this.detail==="virtual"}get detailLevel(){return this.detail}dispose(){this.engine.unregister(this),this.disconnect(),this.model.dispose(),this.panner.disconnect(),this.sendGain.disconnect(),this.absorption.disconnect(),this.occlusion.disconnect(),this.swap.disconnect()}}function gd(i,t){i.positionX?(i.positionX.value=t.x,i.positionY.value=t.y,i.positionZ.value=t.z):i.setPosition(t.x,t.y,t.z)}function fM(i,t){On.copy(t).normalize(),i.orientationX?(i.orientationX.value=On.x,i.orientationY.value=On.y,i.orientationZ.value=On.z):i.setOrientation(On.x,On.y,On.z)}function vd(i,t,e){return i+(t-i)*e}function yd(i){const t=i<0?0:i>1?1:i;return t*t*t*(t*(t*6-15)+10)}const On=new C,pM=220,mM=560,gM=1.4,nc=1300,vM=2900,ic=4,yM=9;function up(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("wind model built before the noise buffers were ready");const s=e.createGain();s.gain.value=t.gain??.5;const r=e.createBiquadFilter();r.type="lowpass",r.frequency.value=t.tone??3400,r.Q.value=.4;const o=e.createBiquadFilter();o.type="highshelf",o.frequency.value=2200,o.gain.value=-7;const a=e.createGain();a.gain.value=.5,r.connect(o).connect(a).connect(s);const c=e.createGain(),l=e.createGain(),h=e.createGain(),u=e.createBiquadFilter();u.type="lowpass",u.frequency.value=pM;const f=e.createBiquadFilter();f.type="bandpass",f.frequency.value=mM,f.Q.value=gM;const d=e.createBiquadFilter();d.type="bandpass",d.frequency.value=nc,d.Q.value=ic;const m=[_n(e,n.brown,u),_n(e,n.pink,f),_n(e,n.white,d)];u.connect(c).connect(r),f.connect(l).connect(r),d.connect(h).connect(r);const v=t.whistle??1;return{output:s,setTone(g){r.frequency.setTargetAtTime(g,e.currentTime,.1)},update(g,p){const _=p.weather.strength,y=e.currentTime,x=.09;c.gain.setTargetAtTime(.1+_*.85,y,x),l.gain.setTargetAtTime(.03+_*_*.5,y,x),h.gain.setTargetAtTime(_**3*.2*v,y,x),a.gain.setTargetAtTime(.25+_*.75,y,x*1.6),d.frequency.setTargetAtTime(nc+(vM-nc)*_,y,x),d.Q.setTargetAtTime(ic+(yM-ic)*_,y,x)},dispose(){for(const g of m)g.stop();s.disconnect()}}}const _M=.14,xM=160;function En(i,t=_M){let e=0;return{pump(n,s,r="immediate"){const o=i.currentTime;e<o&&(e=o+(r==="oneGap"?s():0));const a=o+t;let c=0;for(;e<a&&c<xM;)n(e),e+=Math.max(s(),1e-4),c++},reset(){e=0}}}function ri(i){const t=Math.max(i,.01);return()=>-Math.log(1-Math.random())/t}function dp(i,t=.06){return()=>i*(1+(Math.random()*2-1)*t)}function hh(i,t,e,n=1){const s=t.map(r=>{const o=i.createBiquadFilter();return o.type="bandpass",o.frequency.value=r.hz*n,o.Q.value=r.q,o.connect(e),{filter:o,weight:r.weight,hz:r.hz}});return{pick(){let r=Math.random();for(const o of s)if(r-=o.weight,r<=0)return o.filter;return s[s.length-1].filter},setTone(r,o){for(const a of s)a.filter.frequency.setTargetAtTime(a.hz*r,o,.15)},overlap(r,o){return r*o},dispose(){for(const r of s)r.filter.disconnect()}}}function wM(i,t,e,n,s={}){const r=s.minDuration??.055,o=s.maxDuration??.165,a=r+Math.random()*(o-r),c=i.createBufferSource();c.buffer=t;const l=s.minRate??.7,h=s.maxRate??1.4;c.playbackRate.value=l+Math.random()*(h-l);const u=i.createGain();u.gain.setValueCurveAtTime(Aw(s.pool??Tw),n,a),c.connect(u).connect(e),c.start(n,Math.random()*Math.max(t.duration-.3,0),a+.02),c.stop(n+a+.03)}const MM=[{hz:1150,q:2.6,weight:.4},{hz:2400,q:3.2,weight:.46},{hz:4600,q:3.8,weight:.14}];function fp(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("foliage model built before the noise buffers were ready");const s=t.density??240,r=t.tone??1,o=t.restlessness??.2,a=e.createGain();a.gain.value=t.gain??.5;const c=e.createGain();c.gain.value=0,c.connect(a);const l=hh(e,MM,c,r),h=e.createBiquadFilter();h.type="bandpass",h.frequency.value=1800*r,h.Q.value=.75;const u=e.createGain();u.gain.value=0;const f=_n(e,n.pink,h);h.connect(u).connect(a);let d=t.articulation??.3,m=!0;const v=En(e),g=p=>wM(e,n.white,l.pick(),p,{minDuration:.055,maxDuration:.165});return{output:a,setArticulation(p){d=p},setActive(p){m=p,p&&v.reset(),p||(u.gain.value=0,c.gain.value=0)},update(p,_){if(!m)return;const y=Math.max(_.weather.strength,o),x=e.currentTime;u.gain.setTargetAtTime(.1+y*.5,x,.15),h.frequency.setTargetAtTime((1500+y*1900)*r,x,.15),c.gain.setTargetAtTime(d*(.25+y*.75),x,.15);const b=Math.max(20,s*y*y);v.pump(g,ri(b))},dispose(){f.stop(),l.dispose(),c.disconnect(),a.disconnect()}}}const _d=[1,2,3.02,4.05,5.97],bM=[1,.5,.28,.16,.09],co={steady:{speed:1,wear:1,clank:1,min:9,max:26,next:["labouring","surging","idling"]},labouring:{speed:.62,wear:1.8,clank:1.7,min:5,max:14,next:["steady","stalling","surging"]},surging:{speed:1.34,wear:1.3,clank:.8,min:3,max:9,next:["steady","labouring"]},stalling:{speed:.22,wear:2.2,clank:2.4,min:1.5,max:4,next:["labouring","idling"]},idling:{speed:.45,wear:.7,clank:.5,min:8,max:20,next:["steady","surging"]}};function pp(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("machine model built before the noise buffers were ready");const s=t.fundamental??46,r=t.clank??.5,o=e.createGain();o.gain.value=t.gain??.35;const a=e.createGain();a.gain.value=.5;const c=e.createBiquadFilter();c.type="lowpass",c.frequency.value=520,c.Q.value=.9;const l=[];_d.forEach((A,N)=>{const L=e.createOscillator();L.type=N===0?"sawtooth":"triangle",L.frequency.value=s*A,L.detune.value=(Math.random()*2-1)*9;const U=e.createGain();U.gain.value=bM[N],L.connect(U).connect(c),L.start(),l.push(L)}),c.connect(a);const h=e.createGain();h.gain.value=1;const u=e.createOscillator();u.type="sine";const f=e.createGain();f.gain.value=.22,u.connect(f).connect(h.gain),u.start(),a.connect(h).connect(o);const d=e.createBiquadFilter();d.type="bandpass",d.frequency.value=2600,d.Q.value=.8;const m=e.createGain();m.gain.value=(t.wear??.4)*.22;const v=_n(e,n.pink,d);d.connect(m).connect(o);const g=e.createGain();g.gain.value=r,g.connect(o);let p=t.rpm??52,_=p,y=!0;const x=En(e,.15);let b="steady",S=12;const E=(t.wear??.4)*.22,T=A=>{if(r<=0)return;const N=e.createBufferSource();N.buffer=n.white;const L=e.createBiquadFilter();L.type="bandpass",L.frequency.value=190+Math.random()*90,L.Q.value=14;const U=e.createGain();pr(U.gain,A,.9+Math.random()*.3,.001,.15),N.connect(L).connect(U).connect(g),N.start(A,Math.random()*2,.4),N.stop(A+.45)},M=(A=.9)=>{const N=e.currentTime,L=co[b];u.frequency.setTargetAtTime(_/60,N,A*.4);const U=Math.max(_,4)/52;_d.forEach((F,D)=>{l[D].frequency.setTargetAtTime(s*F*U,N,A)}),c.frequency.setTargetAtTime(420+U*260,N,A),m.gain.setTargetAtTime(E*L.wear,N,A),g.gain.setTargetAtTime(r*L.clank,N,A)},w=A=>{b=A;const N=co[A];S=N.min+Math.random()*(N.max-N.min),M()};return M(.01),{output:o,get phase(){return b},get currentRpm(){return _},setRpm(A){p=A},setActive(A){y=A,A&&x.reset()},update(A){if(!y)return;if(S-=A,S<=0){const F=co[b].next;w(F[Math.floor(Math.random()*F.length)])}const N=p*co[b].speed,L=Math.min(A*.55,1);Math.abs(N-_)>.05&&(_+=(N-_)*L,M());const U=60/Math.max(_,3);x.pump(T,dp(U,.06),"oneGap")},dispose(){for(const A of l)A.stop();u.stop(),v.stop(),o.disconnect()}}}function mp(i,t={}){const e=i.context,n=t.pitch??2400,s=t.interval??7,r=t.shySpeed??.72,o=e.createGain();o.gain.value=t.gain??.16;const a=e.createBiquadFilter();a.type="lowpass",a.frequency.value=t.tone??3200,a.Q.value=.5,a.connect(o);let c=!0,l=0;const h=(m,v,g,p)=>{const _=e.createOscillator();_.type="sine",_.frequency.setValueAtTime(v,m),_.frequency.exponentialRampToValueAtTime(g,m+p);const y=e.createOscillator();y.type="sine",y.frequency.setValueAtTime(v*2.02,m),y.frequency.exponentialRampToValueAtTime(g*2.02,m+p);const x=e.createGain();x.gain.value=.18;const b=e.createGain();b.gain.setValueAtTime(0,m),b.gain.linearRampToValueAtTime(1,m+p*.18),b.gain.setValueAtTime(1,m+p*.6),b.gain.linearRampToValueAtTime(0,m+p),_.connect(b),y.connect(x).connect(b),b.connect(a),_.start(m),y.start(m),_.stop(m+p+.02),y.stop(m+p+.02)},u=[{name:"rising",weight:.26},{name:"falling",weight:.2},{name:"trill",weight:.16},{name:"pair",weight:.22},{name:"single",weight:.1},{name:"chatter",weight:.06}],f=()=>{let m=Math.random();for(const v of u)if(m-=v.weight,m<=0)return v.name;return"pair"},d=m=>{const v=n*(.82+Math.random()*.36);let g=m;switch(f()){case"rising":{const p=2+Math.floor(Math.random()*3);for(let _=0;_<p;_++){const y=1+_*(.1+Math.random()*.09),x=.06+Math.random()*.07;h(g,v*y,v*y*1.22,x),g+=x+.03+Math.random()*.05}break}case"falling":{const p=2+Math.floor(Math.random()*2);for(let _=0;_<p;_++){const y=1-_*(.08+Math.random()*.07),x=.08+Math.random()*.1;h(g,v*y*1.18,v*y*.82,x),g+=x+.04+Math.random()*.06}break}case"trill":{const p=5+Math.floor(Math.random()*7),_=.028+Math.random()*.022;for(let y=0;y<p;y++){const x=y%2===0?1:1.09;h(g,v*x,v*x*1.05,_*.8),g+=_}break}case"pair":{const p=.07+Math.random()*.06;h(g,v,v*1.3,p),g+=p+.05+Math.random()*.04,h(g,v*1.28,v*1.05,p*1.2),g+=p*1.2;break}case"single":{const p=.22+Math.random()*.3;h(g,v*.95,v*1.12,p),g+=p;break}case"chatter":{const p=3+Math.floor(Math.random()*4);for(let _=0;_<p;_++){const y=.02+Math.random()*.02;h(g,v*.6,v*.5,y),g+=y+.02+Math.random()*.03}break}}return g};return{output:o,setActive(m){c=m,m&&(l=0)},update(m,v){if(!c)return;const g=e.currentTime;l<g&&(l=g+Math.random()*s),!(l>g+.2)&&(v.weather.strength<r?l=d(l)+(Math.random()<.34?.4+Math.random()*2.2:-Math.log(1-Math.random())*s):l=g+1.5)},dispose(){o.disconnect()}}}const sc=8e3,SM=12,EM=7,TM=[{hz:1500,q:6,weight:.34},{hz:2800,q:7,weight:.42},{hz:5200,q:8,weight:.24}],AM=.6,RM=.3,CM=.2,xd=new WeakMap;function PM(i){const t=xd.get(i);if(t)return t;const e=Math.floor(sc*SM),n=i.createBuffer(1,e,sc),s=n.getChannelData(0),r=Math.exp(-2*Math.PI*EM/sc);let o=0;for(let l=0;l<e;l++)o=r*o+(1-r)*(Math.random()*2-1),s[l]=o;const a=Math.min(1024,e/4|0);for(let l=0;l<a;l++){const h=l/a;s[l]=s[l]*h+s[e-a+l]*(1-h)}let c=0;for(let l=0;l<e;l++)c=Math.max(c,Math.abs(s[l]));if(c>0)for(let l=0;l<e;l++)s[l]/=c;return xd.set(i,n),n}function gp(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("fire model built before the noise buffers were ready");const s=t.tone??1,r=t.crackle??1,o=t.draught??.35,a=e.createGain();a.gain.value=t.gain??.5;const c=e.createBiquadFilter();c.type="bandpass",c.frequency.value=110*s,c.Q.value=.9;const l=e.createGain();l.gain.value=0;const h=_n(e,n.brown,c);c.connect(l).connect(a);const u=e.createGain();u.gain.value=0;const f=_n(e,PM(e),u,.12);u.connect(l.gain);const d=e.createBiquadFilter();d.type="highpass",d.frequency.value=800*s,d.Q.value=.6;const m=e.createBiquadFilter();m.type="highshelf",m.frequency.value=4200,m.gain.value=-7;const v=e.createGain();v.gain.value=0;const g=_n(e,n.white,d);d.connect(m).connect(v).connect(a);const p=e.createGain();p.gain.value=CM*r,p.connect(a);const _=hh(e,TM,p,s);let y=t.intensity??.7,x=!0;const b=En(e),S=E=>{const T=Math.random()<.09,M=T?.45+Math.random()*.5:.06+Math.random()*.26,w=T?.006+Math.random()*.014:.0015+Math.random()*.005;Sn(e,n.white,_.pick(),E,M,w),T&&Qo(e,p,E,.16,95*s,42*s,.085,.004)};return{output:a,setIntensity(E){y=Math.min(1,Math.max(0,E))},setActive(E){x=E,E&&b.reset(),E||(l.gain.value=0,u.gain.value=0,v.gain.value=0)},update(E,T){if(!x)return;const M=e.currentTime,w=Math.min(1.35,y*(1+T.weather.strength*o)),A=AM*(.3+w*.7);l.gain.setTargetAtTime(A*.72,M,.4),u.gain.setTargetAtTime(A*.62,M,.4),c.frequency.setTargetAtTime((85+w*60)*s,M,.4),v.gain.setTargetAtTime(RM*(.15+w*.85),M,.3),d.frequency.setTargetAtTime((650+w*900)*s,M,.3),b.pump(S,ri(Math.max(.6,22*w*w)))},dispose(){h.stop(),g.stop(),f.stop(),u.disconnect(),_.dispose(),p.disconnect(),l.disconnect(),v.disconnect(),a.disconnect()}}}function vp(i){return 3.26/Math.max(i,5e-5)}const LM=20,IM=.28;function No(i,t,e,n){const s=vp(n.radius),r=n.cycles??LM,o=n.rise??IM,a=r/s,c=i.createOscillator();c.type="sine",c.frequency.setValueAtTime(s,e),c.frequency.linearRampToValueAtTime(s*(1+o),e+a);const l=i.createGain();return l.gain.setValueAtTime(n.level,e),l.gain.exponentialRampToValueAtTime(n.level*.001,e+a),c.connect(l).connect(t),c.start(e),c.stop(e+a+.01),a}function Uo(i,t){return i*Math.pow(t/i,Math.random())}const rc={canopy:{channels:[{hz:900,q:2.4,weight:.42},{hz:1900,q:2.8,weight:.4},{hz:3600,q:3.2,weight:.18}],contact:[.004,.012],drop:.16,bedHz:1600,bedQ:.7,density:420},stone:{channels:[{hz:2400,q:5,weight:.34},{hz:4200,q:6,weight:.42},{hz:6800,q:7,weight:.24}],contact:[.0012,.004],drop:.26,bedHz:3200,bedQ:.55,density:300},earth:{channels:[{hz:420,q:1.8,weight:.5},{hz:780,q:2,weight:.36},{hz:1500,q:2.4,weight:.14}],contact:[.01,.028],drop:.14,bedHz:800,bedQ:.6,density:260},water:{channels:[{hz:1400,q:3,weight:.5},{hz:2600,q:3.5,weight:.5}],contact:[.002,.006],drop:.07,bedHz:2e3,bedQ:.6,density:240,bubbles:[4e-4,.0016]}};function yp(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("rain model built before the noise buffers were ready");const s=t.tone??1,r=t.eaves??0;let o=rc[t.surface??"canopy"];const a=o.bubbles,c=e.createGain();c.gain.value=t.gain??.5;const l=e.createGain();l.gain.value=0,l.connect(c);const h=hh(e,o.channels,l,s),u=e.createBiquadFilter();u.type="bandpass",u.frequency.value=o.bedHz*s,u.Q.value=o.bedQ;const f=e.createGain();f.gain.value=0;const d=_n(e,n.pink,u);u.connect(f).connect(c);let m=t.intensity??.5;const v=t.articulation??.35;let g=!0;const p=En(e),_=En(e),y=b=>{if(a){No(e,l,b,{radius:Uo(a[0],a[1]),level:o.drop*(.4+Math.random()*.6),cycles:13});return}const[S,E]=o.contact;Sn(e,n.white,h.pick(),b,o.drop*(.35+Math.random()*.65),S+Math.random()*(E-S))},x=b=>{No(e,l,b,{radius:Uo(.0022,.0065),level:.5+Math.random()*.5,cycles:22})};return{output:c,setIntensity(b){m=Math.min(1,Math.max(0,b))},setSurface(b){if(a)return;o=rc[b];const S=e.currentTime;u.frequency.setTargetAtTime(o.bedHz*s,S,.25),u.Q.setTargetAtTime(o.bedQ,S,.25),h.setTone(o.bedHz/rc.canopy.bedHz*s,S)},setActive(b){g=b,b?(p.reset(),_.reset()):(f.gain.value=0,l.gain.value=0)},update(b,S){if(!g)return;const E=e.currentTime,T=Math.min(1,m*(1+S.weather.strength*.22));if(T<.02){f.gain.setTargetAtTime(0,E,.6),l.gain.setTargetAtTime(0,E,.6),p.reset(),_.reset();return}f.gain.setTargetAtTime(T*.55,E,.6),u.frequency.setTargetAtTime(o.bedHz*s*(.7+T*.55),E,.6),l.gain.setTargetAtTime(v*(.2+T*.8),E,.6),p.pump(y,ri(Math.max(8,o.density*T*T))),r>0&&_.pump(x,ri(r*(.35+T*.65)),"oneGap")},dispose(){d.stop(),h.dispose(),l.disconnect(),f.disconnect(),c.disconnect()}}}const DM={brook:{rate:95,radius:[4e-4,.0026],cycles:15,bedHz:1500,bedQ:.75,bedLevel:.28,voice:.1},stream:{rate:62,radius:[9e-4,.005],cycles:18,bedHz:900,bedQ:.7,bedLevel:.36,voice:.13},fountain:{rate:150,radius:[5e-4,.0035],cycles:14,bedHz:2100,bedQ:.6,bedLevel:.34,voice:.09},cistern:{rate:.45,radius:[.003,.009],cycles:30,bedHz:260,bedQ:1.3,bedLevel:.02,voice:.62}};function _p(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("water model built before the noise buffers were ready");const s=DM[t.flow??"brook"],r=t.tone??1,o=s.radius[0]/r,a=s.radius[1]/r,c=e.createGain();c.gain.value=t.gain??.5;const l=e.createGain();l.gain.value=1;const h=e.createBiquadFilter();h.type="highshelf",h.frequency.value=3e3,h.gain.value=-3,l.connect(h).connect(c);const u=e.createBiquadFilter();u.type="bandpass",u.frequency.value=s.bedHz*r,u.Q.value=s.bedQ;const f=e.createGain();f.gain.value=0;const d=_n(e,n.pink,u);u.connect(f).connect(c);let m=t.rate??1,v=!0;const g=En(e),p=_=>{No(e,l,_,{radius:Uo(o,a),level:s.voice*(.3+Math.random()*.7),cycles:s.cycles*(.75+Math.random()*.5)})};return{output:c,get voiceHz(){return vp(Math.sqrt(o*a))},setRate(_){m=Math.min(1,Math.max(0,_))},setActive(_){v=_,_?g.reset():f.gain.value=0},update(_){if(!v)return;const y=e.currentTime;if(f.gain.setTargetAtTime(s.bedLevel*m,y,.5),u.frequency.setTargetAtTime(s.bedHz*r*(.75+m*.4),y,.5),m<.02){g.reset();return}g.pump(p,ri(s.rate*m))},dispose(){d.stop(),h.disconnect(),l.disconnect(),f.disconnect(),c.disconnect()}}}function xp(i,t,e){const n=i.createGain(),s=t.map(o=>{const a=i.createBiquadFilter();a.type="bandpass",a.frequency.value=o.hz,a.Q.value=o.q;const c=i.createGain();return c.gain.value=o.level,n.connect(a).connect(c).connect(e),{filter:a,level:c}}),r=t.map(o=>({...o}));return{input:n,shape(o,a,c=0){for(let l=0;l<s.length;l++){const h=o[l];if(!h)continue;const{filter:u,level:f}=s[l];c<=0?(u.frequency.setValueAtTime(h.hz,a),f.gain.setValueAtTime(h.level,a)):(u.frequency.setValueAtTime(r[l].hz,a),u.frequency.exponentialRampToValueAtTime(Math.max(h.hz,20),a+c),f.gain.setValueAtTime(r[l].level,a),f.gain.linearRampToValueAtTime(h.level,a+c)),u.Q.setValueAtTime(h.q,a),r[l]={...h}}},dispose(){n.disconnect();for(const{filter:o,level:a}of s)o.disconnect(),a.disconnect()}}}const Os={a:[{hz:730,q:8,level:1},{hz:1090,q:10,level:.5},{hz:2440,q:14,level:.25}],e:[{hz:530,q:7,level:1},{hz:1840,q:12,level:.45},{hz:2480,q:15,level:.22}],i:[{hz:270,q:5,level:1},{hz:2290,q:14,level:.4},{hz:3010,q:17,level:.2}],o:[{hz:570,q:7,level:1},{hz:840,q:8,level:.55},{hz:2410,q:15,level:.16}],u:[{hz:300,q:5,level:1},{hz:870,q:8,level:.4},{hz:2240,q:14,level:.12}]},oc=[Os.a,Os.e,Os.i,Os.o,Os.u];function wp(i,t={}){const e=i.context,n=Math.max(1,Math.min(10,t.voices??6)),s=Math.min(.95,Math.max(.05,t.density??.45)),r=t.pitch??135,o=t.variety??.5,a=e.createGain();a.gain.value=t.gain??.5;const c=e.createBiquadFilter();c.type="lowpass",c.frequency.value=t.distance??1700,c.Q.value=.6,c.connect(a);const l=[];for(let d=0;d<n;d++){const m=n===1?0:d/(n-1)*2-1,v=1+m*o*.35+(Math.random()*2-1)*.05,g=r*(1-m*o*.4)*(.95+Math.random()*.1),p=e.createGain();p.gain.value=.85/Math.sqrt(n),p.connect(c);const _=xp(e,oc[0].map(b=>({...b,hz:b.hz*v})),p),y=e.createGain();y.gain.value=0,y.connect(_.input);const x=e.createOscillator();x.type="sawtooth",x.frequency.value=g,x.connect(y),x.start(),l.push({osc:x,envelope:y,bank:_,clock:En(e),length:.2,left:0,pitch:g,tract:v})}let h=!0;const u=(d,m)=>d.map(v=>({...v,hz:v.hz*m})),f=(d,m)=>{const v=.12+Math.random()*.14;d.length=v,d.left--;const g=d.left>=4,p=d.pitch*(g?1.1:.9+Math.random()*.2);d.osc.frequency.setTargetAtTime(p,m,v*.6);const _=.55+Math.random()*.45,y=v*.22;d.envelope.gain.setValueAtTime(0,m),d.envelope.gain.linearRampToValueAtTime(_,m+y),d.envelope.gain.linearRampToValueAtTime(_*.75,m+v*.75),d.envelope.gain.setTargetAtTime(0,m+v*.75,v*.12);const x=oc[Math.random()*oc.length|0];d.bank.shape(u(x,d.tract),m,v*.8)};return{output:a,setActive(d){if(h=d,d)for(const m of l)m.clock.reset();else for(const m of l)m.envelope.gain.value=0},update(){if(h)for(const d of l)d.clock.pump(m=>f(d,m),()=>{if(d.left>0)return d.length+.015+Math.random()*.06;d.left=3+Math.floor(Math.random()*6);const m=(1-s)*5.5;return d.length+.35+Math.random()*(.6+m)},"immediate")},dispose(){for(const d of l){try{d.osc.stop()}catch{}d.osc.disconnect(),d.envelope.disconnect(),d.bank.dispose()}l.length=0,c.disconnect(),a.disconnect()}}}const NM="modulepreload",UM=function(i,t){return new URL(i,t).href},wd={},Fo=function(t,e,n){let s=Promise.resolve();if(e&&e.length>0){const o=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),c=a?.nonce||a?.getAttribute("nonce");s=Promise.allSettled(e.map(l=>{if(l=UM(l,n),l in wd)return;wd[l]=!0;const h=l.endsWith(".css"),u=h?'[rel="stylesheet"]':"";if(!!n)for(let m=o.length-1;m>=0;m--){const v=o[m];if(v.href===l&&(!h||v.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${l}"]${u}`))return;const d=document.createElement("link");if(d.rel=h?"stylesheet":NM,h||(d.as="script"),d.crossOrigin="",d.href=l,c&&d.setAttribute("nonce",c),document.head.appendChild(d),h)return new Promise((m,v)=>{d.addEventListener("load",m),d.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${l}`)))})}))}function r(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return s.then(o=>{for(const a of o||[])a.status==="rejected"&&r(a.reason);return t().catch(r)})};async function FM(i){try{const[{createFaustNode:t},{frictionMeta:e,frictionUrl:n}]=await Promise.all([Fo(()=>Promise.resolve().then(()=>cp),void 0,import.meta.url),Fo(()=>import("./friction-COj10vMJ.js"),[],import.meta.url)]);return await t(i,n,e)}catch(t){return console.warn("friction: faust tier unavailable — using the event fallback",t),null}}const Md=.42,OM=.08,bd=.4;function Mp(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("friction model built before the noise buffers were ready");const s=t.force??.55,r=t.pitch??180,o=t.decay??.5,a=t.bright??.5,c=t.roughness??.4,l=t.motion??"cycle",h=t.speed??.3,u=e.createGain();u.gain.value=t.gain??.5;const f=e.createGain();f.gain.value=1,f.connect(u);const d=e.createGain();d.gain.value=0,d.connect(u);const m=e.createGain();m.connect(f);const v=22+a*22,g=ms(e,[{hz:r,decay:o,level:1,q:v},{hz:r*2.41,decay:o*.7,level:.12+.55*a,q:v*.8},{hz:r*4.17,decay:o*.45,level:.06+.32*a,q:v*.6},{hz:r*6.83,decay:o*.3,level:.03+.18*a,q:v*.5}],m,{ring:"excitation"}),p=e.createBufferSource();p.buffer=n.pink,p.loop=!0;const _=e.createBiquadFilter();_.type="bandpass",_.frequency.value=r*1.6,_.Q.value=3.5;const y=e.createGain();y.gain.value=0,p.connect(_).connect(y).connect(f),p.start();const x=En(e);let b=0,S=l==="steady"?h:0,E=s,T=null,M=!0,w=1+Math.random()*4,A=!1,N=h,L=.8,U=Math.random(),F=null,D=!1;const H=FM(e).then(Y=>{if(!Y)return;if(D){Y.dispose();return}F=Y,Y.node.connect(d),Y.set("force",s),Y.set("pitch",r),Y.set("decay",o),Y.set("bright",a),Y.set("roughness",c),Y.set("gain",.7),Y.set("speed",b);const rt=e.currentTime;d.gain.setTargetAtTime(1,rt,bd/3),f.gain.setTargetAtTime(0,rt,bd/3)});function k(Y){if(w-=Y,w<=0&&(A=!A,w=A?2+Math.random()*5:5+Math.random()*14,N=h*(.6+Math.random()*.7),L=.55+Math.random()*.65,U=0),!A){S=0;return}U+=Y*L,S=N*Math.max(0,Math.sin(U*Math.PI*2))**.55}return{output:u,ready:H,setSpeed(Y){T=Math.max(0,Math.min(1,Y))},setForce(Y){E=Math.max(0,Math.min(1,Y)),F?.set("force",E)},get usingFaust(){return F!==null},get loop(){return F},get currentSpeed(){return b},update(Y,rt){if(!M)return;if(T!==null)S=T,T=null;else if(l==="cycle")k(Y);else if(l==="weather"){const J=Math.max(0,rt.weather.strength-Md);S=Math.min(1,(J/(1-Md))**1.6)*h}if(b+=(S-b)*Math.min(1,Y/OM),F?.set("speed",b),F)return;const ft=e.currentTime;if(b<.01){y.gain.setTargetAtTime(0,ft,.2),x.reset();return}y.gain.setTargetAtTime(.022*E*b**.7,ft,.12);const Ft=2+b*26,te=E*.5*(.3+.7/(1+b*6));x.pump(J=>{const at=.7+Math.random()*.6;for(const St of g.inputs)Sn(e,n.white,St,J,te*at,.003)},ri(Ft),"immediate")},setActive(Y){M=Y,Y||(y.gain.setTargetAtTime(0,e.currentTime,.1),x.reset(),F?.set("speed",0),b=0)},dispose(){D=!0,p.stop(),p.disconnect(),_.disconnect(),y.disconnect(),g.dispose(),m.disconnect(),F?.dispose(),d.disconnect(),f.disconnect(),u.disconnect()}}}const zM=7,Sd=.3,Ed=.4;async function kM(i){try{const[{createFaustNode:t},{waveguideMeta:e,waveguideUrl:n}]=await Promise.all([Fo(()=>Promise.resolve().then(()=>cp),void 0,import.meta.url),Fo(()=>import("./waveguide-DEcBmVT0.js"),[],import.meta.url)]);return await t(i,n,e)}catch(t){return console.warn("waveguide: faust tier unavailable — using the modal fallback",t),null}}function bp(i,t={}){const e=i.context,n=i.noise;if(n===null)throw new Error("waveguide built before the noise buffers were ready");const s=n.white,r=t.pitch??440,o=t.decay??2,a=t.bright??.5,c=t.closed??!1,l=t.place??.22,h=t.excite??"chime",u=t.drive??.5,f=t.weather??!1,d=e.createGain();d.gain.value=(t.gain??.5)*3.2;const m=e.createGain();m.gain.value=0,m.connect(d);const v=e.createGain();v.gain.value=1,v.connect(d);const g=e.createGain();g.gain.value=1;const p=e.createBufferSource();p.buffer=s,p.loop=!0;const _=e.createBiquadFilter();_.type="bandpass",_.frequency.value=r*(c?.5:1),_.Q.value=.9;const y=e.createGain();y.gain.value=0,p.connect(_).connect(y).connect(g),p.start();const x=c?r*.5:r,S=ms(e,(c?[1,3,5,7]:[1,2,3,4]).map((L,U)=>({hz:x*L,decay:o/(1+U*.6),level:(.2+a*.8)**U,q:60+a*60})),v,{ring:"filter",maxQ:200});for(const L of S.inputs)g.connect(L);const E=En(e);let T=null,M=!1,w=!0;const A=kM(e).then(L=>{if(!L)return;if(M){L.dispose();return}T=L,g.connect(L.node),L.node.connect(m),L.set("pitch",r),L.set("decay",o),L.set("bright",a),L.set("closed",c?1:0),L.set("place",l),L.set("gain",.7);const U=e.currentTime;m.gain.setTargetAtTime(1,U,Ed/3),v.gain.setTargetAtTime(0,U,Ed/3)});function N(L,U){Sn(e,s,g,L,U*.5,.0016)}return{output:d,ready:A,get loop(){return T},get usingFaust(){return T!==null},strike(L=1){N(e.currentTime+.02,L)},update(L,U){if(!w)return;const F=Math.max(0,U.weather.strength-Sd)/(1-Sd),D=f?u*F**2:u,H=e.currentTime;if(h==="breath"){y.gain.setTargetAtTime(D*.09,H,.25);return}if(y.gain.setTargetAtTime(0,H,.25),D<.02){E.reset();return}E.pump(k=>N(k,.35+Math.random()*.65),ri(zM*D),"oneGap")},setActive(L){w=L,L||(y.gain.setTargetAtTime(0,e.currentTime,.1),E.reset())},dispose(){M=!0,p.stop(),p.disconnect(),_.disconnect(),y.disconnect(),S.dispose(),g.disconnect(),T?.dispose(),m.disconnect(),v.disconnect(),d.disconnect()}}}function BM(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("drip built before the noise buffers were ready");const s=t.radius??[.0018,.0032],r=t.cycles??30,o=t.tick??.35,a=e.createGain();a.gain.value=t.gain??.5;const c=e.createBiquadFilter();return c.type="bandpass",c.frequency.value=3800,c.Q.value=3,c.connect(a),{output:a,fire(l,h){return Sn(e,n.white,c,l,h*o,.0016),No(e,a,l+.0015,{radius:Uo(s[0],s[1]),level:h*.55,cycles:r*(.85+Math.random()*.3),rise:.34})+.02},dispose(){c.disconnect(),a.disconnect()}}}const HM=[{ratio:.5,decay:1,level:.5},{ratio:1,decay:.72,level:.85},{ratio:1.2,decay:.55,level:.7},{ratio:1.5,decay:.42,level:.45},{ratio:2,decay:.35,level:1},{ratio:2.5,decay:.2,level:.3},{ratio:2.67,decay:.17,level:.26},{ratio:3,decay:.13,level:.22},{ratio:4,decay:.09,level:.16},{ratio:5.33,decay:.06,level:.1},{ratio:6.4,decay:.04,level:.07}];function GM(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("bell built before the noise buffers were ready");const s=t.hz??168,r=t.decay??14,o=t.strike??.4,a=t.warble??1,c=Math.max(1,t.strokes??1),l=t.interval??2.4,h=e.createGain();h.gain.value=t.gain??.5;const u=e.createBiquadFilter();u.type="bandpass",u.frequency.value=s*9,u.Q.value=1.6,u.connect(h);const f=(m,v,g,p,_)=>{const y=e.createOscillator();y.type="sine",y.frequency.value=s*v,y.detune.value=_;const x=e.createGain();x.gain.setValueAtTime(p,m),x.gain.exponentialRampToValueAtTime(p*5e-4,m+g),y.connect(x).connect(h),y.start(m),y.stop(m+g+.02)},d=(m,v)=>{Sn(e,n.white,u,m,v*o,.004);let g=0;for(const p of HM){const _=v*p.level*.14*(.85+Math.random()*.3),y=r*p.decay*(.9+Math.random()*.2),x=a*p.ratio*1.6;f(m,p.ratio,y,_,-x),f(m,p.ratio,y,_,x),g=Math.max(g,y)}return g};return{output:h,fire(m,v){let g=0;for(let p=0;p<c;p++){const _=m+p*l*(1+(Math.random()*2-1)*.02);g=_-m+d(_,v*(p===0?1:.9))}return g},dispose(){u.disconnect(),h.disconnect()}}}const Td=[{hz:512,decay:.3,level:.4},{hz:1183,decay:.85,level:.72},{hz:1794,decay:1.15,level:1},{hz:2741,decay:.7,level:.5},{hz:4310,decay:.4,level:.28}];function VM(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("hammer built before the noise buffers were ready");const s=t.tone??1,r=Math.min(.9,Math.max(0,t.damping??.3)),o=t.bounces??2,a=e.createGain();a.gain.value=t.gain??.7;const c=ms(e,Td.map(h=>({hz:h.hz*s,decay:h.decay*(1-r),level:h.level})),a),l=(h,u,f)=>{const d=f?.0022:.0035;c.inputs.forEach((m,v)=>{Sn(e,n.white,m,h,u*Td[v].level,d)}),Qo(e,a,h,u*(f?.5:.16),165*s,62*s,.075,.003)};return{output:a,fire(h,u){l(h,u,!0);let f=.13+Math.random()*.05,d=u*.3;for(let m=0;m<o;m++)l(h+f,d*(.7+Math.random()*.5),!1),f+=(.13+Math.random()*.05)*Math.pow(.66,m+1),d*=.5;return f+1.3*(1-r)+.2},dispose(){c.dispose(),a.disconnect()}}}const WM={wood:{count:9,over:.34,energyDecay:.13,hz:380,q:2.1,level:.5,thumpHz:120},pot:{count:7,over:.28,energyDecay:.1,hz:950,q:4.2,level:.42,thumpHz:175},metal:{count:11,over:.42,energyDecay:.16,hz:1750,q:5.5,level:.4,thumpHz:210},stone:{count:6,over:.22,energyDecay:.07,hz:640,q:1.6,level:.55,thumpHz:95}};function XM(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("clatter built before the noise buffers were ready");const s=WM[t.material??"wood"],r=t.tone??1,o=t.heft??.5,a=e.createGain();a.gain.value=t.gain??.6;const c={...s,hz:s.hz*r,count:t.pieces??s.count},l=np(e,c,a);return{output:a,fire(h,u){return Sn(e,n.white,l.input,h,u*1.4,.012+Math.random()*.01),Qo(e,a,h,u*o*.55,s.thumpHz*r,s.thumpHz*r*.45,.08,.004),ip(e,n.white,l.input,c,h+.02,u),c.over*1.4+.15},dispose(){l.dispose(),a.disconnect()}}}const qM={dog:{f0:[440,235],onset:.62,syllables:[2,4],length:[.085,.135],gap:[.2,.34],attack:.06,rasp:.34,open:[{hz:880,q:6,level:1},{hz:1620,q:9,level:.55},{hz:3100,q:12,level:.3}],close:[{hz:520,q:7,level:.7},{hz:1180,q:8,level:.3},{hz:2600,q:12,level:.12}],variance:.14},sheep:{f0:[355,300],onset:.82,syllables:[1,2],length:[.55,1.05],gap:[.35,.6],attack:.14,rasp:.22,open:[{hz:620,q:7,level:1},{hz:1720,q:11,level:.42},{hz:2650,q:14,level:.18}],close:[{hz:700,q:7,level:.9},{hz:1500,q:10,level:.3},{hz:2600,q:14,level:.12}],vibrato:{hz:13,cents:105},variance:.1},cow:{f0:[168,108],onset:.72,syllables:[1,1],length:[1.1,1.8],gap:[.5,.8],attack:.22,rasp:.16,open:[{hz:390,q:6,level:1},{hz:800,q:8,level:.5},{hz:1900,q:12,level:.14}],close:[{hz:330,q:6,level:.85},{hz:720,q:8,level:.3},{hz:1750,q:12,level:.08}],vibrato:{hz:5.5,cents:35},variance:.08},fowl:{f0:[880,620],onset:.7,syllables:[3,6],length:[.045,.085],gap:[.09,.21],attack:.12,rasp:.55,open:[{hz:1450,q:8,level:1},{hz:2700,q:11,level:.5},{hz:4200,q:14,level:.22}],close:[{hz:1150,q:8,level:.6},{hz:2400,q:11,level:.25},{hz:3900,q:14,level:.1}],variance:.16}};function ac(i){return i[0]+Math.random()*(i[1]-i[0])}function Ad(i,t){return i.map(e=>({...e,hz:e.hz*t}))}function YM(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("animal built before the noise buffers were ready");const s=qM[t.kind??"dog"],r=t.tone??1,o=Math.min(1,(t.rasp??0)+s.rasp),a=e.createGain();a.gain.value=t.gain??.6;const c=Ad(s.open,r),l=Ad(s.close,r),h=xp(e,c,a),u=[];let f=0;const d=(v,g,p,_)=>{const y=e.createGain();y.connect(h.input);const x=e.createOscillator();x.type="sawtooth";const b=_,S=b*s.onset,E=g*s.attack;x.frequency.setValueAtTime(S,v),x.frequency.exponentialRampToValueAtTime(b,v+E),x.frequency.exponentialRampToValueAtTime(Math.max(b*(s.f0[1]/s.f0[0]),20),v+g),x.connect(y),x.start(v);let T=null;if(s.vibrato){T=e.createOscillator(),T.frequency.value=s.vibrato.hz*(.85+Math.random()*.3);const N=e.createGain();N.gain.value=s.vibrato.cents,T.connect(N).connect(x.detune),T.start(v),u.push(N)}let M=null;if(o>.01){M=e.createBufferSource(),M.buffer=n.white,M.playbackRate.value=.8+Math.random()*.5;const N=e.createGain();N.gain.value=o*.55,M.connect(N).connect(y),M.start(v,Math.random()*Math.max(n.white.duration-2,0)),u.push(N)}const w=Math.max(.02,g*.28);y.gain.setValueAtTime(0,v),y.gain.linearRampToValueAtTime(p,v+E),y.gain.linearRampToValueAtTime(p*.62,v+g-w),y.gain.setTargetAtTime(0,v+g-w,w/3);const A=v+g+w*3;x.stop(A),T?.stop(A),M?.stop(A),u.push(y),f=Math.max(f,A),h.shape(c,v,E),h.shape(l,v+g*.55,g*.45)};let m=0;return{output:a,fire(v,g){f=v;const p=Math.round(ac(s.syllables)),_=s.f0[0]*r*(1+(Math.random()*2-1)*s.variance);let y=v;for(let b=0;b<p;b++){const S=ac(s.length);d(y,S,g*Math.pow(.86,b)*(.85+Math.random()*.3),_),y+=S+ac(s.gap)}const x=f-v;return window.clearTimeout(m),m=window.setTimeout(()=>{for(const b of u)b.disconnect();u.length=0},(x+.4)*1e3),x},dispose(){window.clearTimeout(m);for(const v of u)v.disconnect();u.length=0,h.dispose(),a.disconnect()}}}function Sp(i,t){switch(t.sound){case"hammer":return VM(i,t.options);case"clatter":return XM(i,t.options);case"animal":return YM(i,t.options);case"drip":return BM(i,t.options);case"bell":return GM(i,t.options)}}const $M=[5,.4,5];class ZM{context;voices=[];clock;centre=new C;spread=new C;force;gap;active=!0;constructor(t,e){this.context=t.context,this.centre.set(...e.at),this.spread.set(...e.spread??$M),this.force=e.force??[.55,1];const n=Math.max(e.every,.05);this.gap=e.rhythm==="periodic"?dp(n,.09):ri(1/n),this.clock=En(t.context);const s=Math.max(1,e.voices??2);for(let r=0;r<s;r++){const o=Sp(t,e);this.voices.push({shot:o,busyUntil:0,emitter:new hp(t,o,{position:this.centre,refDistance:e.refDistance,maxDistance:e.maxDistance,rolloff:e.rolloff,reverb:e.reverb,importance:e.importance,ignoreAbsorption:e.ignoreAbsorption,ignoreOcclusion:e.ignoreOcclusion,invertDistance:e.invertDistance})})}}setActive(t){if(t!==this.active){this.active=t,t&&this.clock.reset();for(const e of this.voices)e.emitter.enabled=t}}update(t,e,n){for(const s of this.voices)s.emitter.update(t,e,n);if(this.active){if(this.voices.every(s=>s.emitter.isVirtual)){this.clock.reset();return}this.clock.pump(s=>this.fire(s),this.gap,"oneGap")}}fire(t){const e=this.voices.find(o=>o.busyUntil<=t);if(!e||e.emitter.isVirtual)return;Rd.set(this.centre.x+(Math.random()*2-1)*this.spread.x,this.centre.y+(Math.random()*2-1)*this.spread.y,this.centre.z+(Math.random()*2-1)*this.spread.z),e.emitter.moveTo(Rd);const[n,s]=this.force,r=e.shot.fire(t,n+Math.random()*(s-n));e.busyUntil=t+r}trigger(){this.fire(this.context.currentTime+.02)}get shots(){return this.voices.map(t=>t.shot)}get voiceCount(){return this.voices.length}dispose(){for(const t of this.voices)t.emitter.dispose();this.voices.length=0}}const Rd=new C,Ep={};function Cd(i,t){switch(t.model){case"wind":return up(i,t.options);case"foliage":return fp(i,t.options);case"machine":return pp(i,t.options);case"bird":return mp(i,t.options);case"fire":return gp(i,t.options);case"rain":return yp(i,t.options);case"water":return _p(i,t.options);case"crowd":return wp(i,t.options);case"friction":return Mp(i,t.options);case"waveguide":return bp(i,t.options)}}class KM{engine;emitters=[];models=new Map;emitterById=new Map;fields=new Map;beds=[];bedBus=null;scatter=[];active=!0;constructor(t,e){this.engine=t;const n=e.bed?Array.isArray(e.bed)?e.bed:[e.bed]:[];if(n.length>0){const s=t.context.createGain();s.connect(t.dry),this.bedBus=s;for(const r of n){const o=Cd(t,r),a=t.context.createGain();a.gain.value=r.gain??1,o.output.connect(a).connect(s),this.beds.push(o),r.id&&this.models.set(r.id,o)}}for(const s of e.emitters??[]){const r=Cd(t,s);s.id&&this.models.set(s.id,r);const o=new hp(t,r,{position:new C(...s.at),refDistance:s.refDistance,maxDistance:s.maxDistance,rolloff:s.rolloff,reverb:s.reverb,importance:s.importance,ignoreAbsorption:s.ignoreAbsorption,ignoreOcclusion:s.ignoreOcclusion,invertDistance:s.invertDistance});this.emitters.push(o),s.id&&this.emitterById.set(s.id,o)}for(const s of e.scatter??[]){const r=new ZM(t,s);this.scatter.push(r),s.id&&this.fields.set(s.id,r)}}setActive(t){if(t!==this.active){this.active=t;for(const e of this.emitters)e.enabled=t;for(const e of this.scatter)e.setActive(t);this.bedBus?.gain.setTargetAtTime(t?1:0,this.engine.context.currentTime,.15)}}setBedLevel(t,e=.35){!this.bedBus||!this.active||this.bedBus.gain.setTargetAtTime(t,this.engine.context.currentTime,e)}update(t,e,n){if(this.active){for(const s of this.beds)s.update?.(t,this.engine);for(const s of this.emitters)s.update(t,e,n);for(const s of this.scatter)s.update(t,e,n)}}find(t){return this.models.get(t)??null}findField(t){return this.fields.get(t)??null}setSolo(t){if(this.active){for(const[e,n]of this.emitterById)n.enabled=t===null||e===t;for(const[e,n]of this.fields)n.setActive(t===null||e===t)}}get emitterCount(){return this.emitters.length+this.scatter.reduce((t,e)=>t+e.voiceCount,0)}get occludedCount(){return this.emitters.filter(t=>t.isOccluded).length}dispose(){for(const t of this.emitters)t.dispose();this.emitters.length=0,this.emitterById.clear();for(const t of this.scatter)t.dispose();this.scatter.length=0,this.fields.clear();for(const t of this.beds)t.dispose();this.beds.length=0,this.bedBus?.disconnect(),this.models.clear()}}const ta={sky:!0,fogColor:"#bcd4e6",fogNear:25,fogFar:140,sunIntensity:2.2,sunColor:16773848,fillIntensity:1.15,fillColor:14735040,ambientIntensity:1.8,ambientSky:10339560,ambientGround:9076584,room:"open",surface:"earth",footstepReverb:.7,soundscape:{bed:{model:"wind",id:"wind",options:{gain:.17,tone:3400}}}},Pd={sky:!1,fogColor:"#0d0f12",fogNear:6,fogFar:34,sunIntensity:1.1,sunColor:16770748,fillIntensity:.75,fillColor:9412792,ambientIntensity:2.1,ambientSky:9078390,ambientGround:4867130,room:"cell",surface:"wood",footstepReverb:.5,soundscape:Ep},jM=.12;class JM{definition;group=null;constructor(t){this.definition=t}get id(){return this.definition.id}get name(){return this.definition.name}get environment(){return this.definition.environment}get spawn(){return this.definition.spawn}get floor(){return this.definition.floor??-20}settle(t){const e=this.definition.groundAt;if(!e)return t;const n=t.position.clone();return n.y=e(n.x,n.z)+jM,{position:n,yaw:t.yaw}}root(){return this.group===null&&(this.group=this.definition.build(),this.group.name=`zone:${this.definition.id}`,this.group.updateWorldMatrix(!0,!0)),this.group}get isBuilt(){return this.group!==null}dispose(){this.group!==null&&(this.group.traverse(t=>{(t instanceof Kt||t instanceof Jl)&&t.geometry.dispose()}),this.group.clear(),this.group=null)}}const QM=1.15;function t2(i,t=new C){return t.set(Math.sin(i),0,Math.cos(i))}function e2(i){if(i.arrival)return{position:i.arrival.position.clone(),yaw:i.arrival.yaw};const t=t2(i.yaw);return{position:i.position.clone().addScaledVector(t,QM),yaw:i.yaw+Math.PI}}class n2{byZone=new Map;byDoor=new Map;add(t,e){this.addSide(t.id,t.a,t.b,e),this.addSide(t.id,t.b,t.a,e)}addSide(t,e,n,s){const r={portal:t,end:e,target:n,arrival:e2(n),door:null,title:"Door",label:e.label??s(n.zone)},o=this.byZone.get(e.zone);o?o.push(r):this.byZone.set(e.zone,[r])}in(t){return this.byZone.get(t)??[]}bind(t,e,n){t.door=e,t.title=n,e.userData.portal=t,this.byDoor.set(e,t)}sideOf(t){let e=t;for(;e;){const n=this.byDoor.get(e);if(n)return n;e=e.parent}return null}all(){return[...this.byZone.values()].flat()}}const i2=3.2,s2=.15;function r2(i,t){return i.userData.label=t,i}function o2(i){for(let t=i;t;t=t.parent){const e=t.userData.label;if(typeof e=="string")return e}return null}class a2{reach=i2;raycaster=new yx;targets=[];constructor(){this.raycaster.far=this.reach}setTargets(t){this.targets=t}get targetCount(){return this.targets.length}probe(t,e){if(this.targets.length===0)return null;t.updateWorldMatrix(!0,!1),cc.setFromMatrixPosition(t.matrixWorld),lc.set(0,0,-1).applyQuaternion(t.getWorldQuaternion(c2)),this.raycaster.far=this.reach,this.raycaster.set(cc,lc);const n=this.raycaster.intersectObjects(this.targets,!0);if(n.length===0)return null;const s=n[0],r=e.raycast(cc,lc);return r!==null&&r<s.distance-s2?null:{object:s.object,distance:s.distance}}}const cc=new C,lc=new C,c2=new ai,l2={timber:{leaf:z.TIMBER,ledge:z.TIMBER_DARK,iron:z.IRON,frame:z.STONE_DARK},iron:{leaf:z.IRON,ledge:z.STONE_DARK,iron:z.RUST,frame:z.STONE},plank:{leaf:z.TIMBER_PALE,ledge:z.TIMBER,iron:z.RUST,frame:z.TIMBER_DARK}},h2=["timber","iron","plank"],u2={timber:"Wooden Door",iron:"Iron Door",plank:"Plank Door"};function d2(i){return u2[i]}function Ld(i){return i.userData.door}function Tp(i={}){const{seed:t=1,scale:e=1}=i,n=Rt(t),s=[],r=i.material??n.pick(h2),o=l2[r],a=n.range(.94,1.16),c=n.range(2,2.28),l=n.range(.07,.1),h=n.range(.13,.18),u=l*2.4;for(const M of[-1,1]){const w=new V(h,c+h,u);w.translate(M*(a+h)/2,(c+h)/2,-u*.18),s.push({geometry:w,color:o.frame,sway:0})}const f=new V(a+h*2.6,h,u*1.1);if(f.translate(0,c+h/2,-u*.18),s.push({geometry:f,color:o.frame,sway:0}),n.chance(.55)){const M=new V(a+h*2.2,.06,u*1.5);M.translate(0,.03,-u*.1),s.push({geometry:M,color:o.frame,sway:0})}const d=new V(a,c,.02);d.translate(0,c/2,-l*.5),s.push({geometry:d,color:1316378,sway:0});const m=n.int(4,6),v=a/m;for(let M=0;M<m;M++){const w=l*n.range(.88,1),A=new V(v*.94,c*n.range(.985,1),w);A.translate(-a/2+v*(M+.5),c/2,w/2),s.push({geometry:A,color:o.leaf,sway:0})}const g=n.chance(.4)?[c*.16,c*.52,c*.87]:[c*.18,c*.82],p=l*.42;for(const M of g){const w=new V(a*.96,n.range(.1,.15),p);w.translate(0,M,l+p/2),s.push({geometry:w,color:o.ledge,sway:0})}const _=n.chance(.5)?-1:1,y=p*.5;for(const M of[g[0],g[g.length-1]]){const w=a*n.range(.45,.7),A=new V(w,.055,y);A.translate(_*(a/2-w/2),M,l+p+y/2),s.push({geometry:A,color:o.iron,sway:0});const N=new V(.07,.09,y*2.2);N.translate(_*(a/2+.02),M,l+y),s.push({geometry:N,color:o.iron,sway:0})}const x=-_*a*n.range(.3,.36),b=c*n.range(.44,.5);if(n.chance(.5)){const M=new K(.062,.062,.02,8);M.rotateX(Math.PI/2),M.translate(x,b,l+.01),s.push({geometry:M,color:o.iron,sway:0});const w=new K(.022,.026,.05,6);w.rotateX(Math.PI/2),w.translate(x,b,l+.043),s.push({geometry:w,color:o.iron,sway:0});const A=new ee(.052,0);A.scale(1,1,.78),A.translate(x,b,l+.095),s.push({geometry:A,color:o.iron,sway:0})}else{const M=new V(.045,.2,.045);M.translate(x,b,l+.055),s.push({geometry:M,color:o.iron,sway:0});for(const w of[-.09,.09]){const A=new V(.05,.05,.05);A.translate(x,b+w,l+.025),s.push({geometry:A,color:o.iron,sway:0})}}const S=At(s);e!==1&&S.scale(e,e,e);const E=Dt(S,"door",0),T={width:(a+h*2)*e,height:(c+h)*e,depth:(l+p+y)*e,material:r};return E.userData.door=T,E}const f2={name:"door",category:"structures",radius:.9,build:Tp},p2={level:.55,click:{hz:3200,q:6,duration:.004,level:.5},modes:[{hz:180,decay:.16,q:5,level:1},{hz:430,decay:.1,q:6,level:.55},{hz:950,decay:.055,q:7,level:.25}],thump:{from:112,to:82,decay:.13,level:.55}},m2={level:.5,click:{hz:5200,q:9,duration:.005,level:.6},modes:[{hz:240,decay:.34,q:9,level:.8},{hz:620,decay:.28,q:11,level:.6},{hz:1450,decay:.2,q:12,level:.35},{hz:2900,decay:.12,q:10,level:.18}],thump:{from:78,to:62,decay:.3,level:.7}},g2={level:.42,click:{hz:2400,q:5,duration:.003,level:.35},modes:[{hz:320,decay:.08,q:5,level:.8},{hz:720,decay:.055,q:6,level:.45},{hz:1600,decay:.035,q:6,level:.2}],thump:{from:150,to:120,decay:.07,level:.3}},v2={timber:p2,iron:m2,plank:g2};function y2(i){return Math.max(i.thump.decay,...i.modes.map(e=>e.decay))*3+Ap+.05}const Ap=.032;function lo(i,t){return i+Math.random()*(t-i)}class _2{engine;constructor(t){this.engine=t}play(t,e="timber"){const n=v2[e],s=this.engine.context;if(s.state!=="running"||!this.engine.noise)return;const r=s.currentTime+.02,o=[],a=this.buildOutput(n,t,o),c=ms(s,[{hz:n.click.hz,decay:n.click.duration,level:n.click.level,q:n.click.q}],a),l=ms(s,n.modes,a);this.excite(c.inputs[0],n.click.level,r,6e-4,n.click.duration*1.5,o);const h=r+Ap;n.modes.forEach((f,d)=>{this.excite(l.inputs[d],f.level*lo(.92,1.08),h,.002,f.decay,o)}),Qo(s,a,h,n.thump.level,n.thump.from*lo(.96,1.04),n.thump.to,n.thump.decay,.004);const u=y2(n);window.setTimeout(()=>{for(const f of o)f.disconnect();c.dispose(),l.dispose()},(r-s.currentTime+u)*1e3+250)}buildOutput(t,e,n){const s=this.engine.context,r=s.createGain();r.gain.value=t.level;const o=s.createPanner();o.panningModel="HRTF",o.distanceModel="inverse",o.refDistance=1.6,o.maxDistance=45,o.rolloffFactor=1.1,x2(o,e);const a=s.createGain();return a.gain.value=.9,r.connect(o),o.connect(this.engine.dry),o.connect(a),a.connect(this.engine.send),n.push(r,o,a),r}excite(t,e,n,s,r,o){const a=this.engine.context,c=this.engine.noise;if(!c)return;const l=a.createBufferSource();l.buffer=c.white,l.playbackRate.value=lo(.9,1.1);const h=a.createGain();pr(h.gain,n,e,s,r),l.connect(h).connect(t),l.start(n,lo(0,c.white.duration-1),r*3+.05),l.stop(n+r*3+.06),o.push(l,h)}}function x2(i,t){i.positionX?(i.positionX.value=t.x,i.positionY.value=t.y,i.positionZ.value=t.z):i.setPosition(t.x,t.y,t.z)}class w2{zones=new Map;portals=new n2;lights;options;audio=null;doorAudio=null;soundscapes=new Map;active=null;doored=new Set;transitioning=!1;hovered=null;crossings=0;onZoneChange=null;constructor(t){this.options=t,this.lights={sun:new Fu(16773848,2.2),fill:new Fu(9412792,0),ambient:new dx(10339560,4998454,1.5)},this.lights.sun.position.set(-70,90,50);const e=this.lights.sun.shadow;e.mapSize.set(4096,4096);const n=48;e.camera.left=-n,e.camera.right=n,e.camera.top=n,e.camera.bottom=-n,e.camera.near=55,e.camera.far=225,e.bias=-8e-5,e.normalBias=.006,e.intensity=.34,this.lights.fill.position.set(9,7,-7),t.scene.add(this.lights.sun,this.lights.fill,this.lights.ambient)}get sunDirection(){return this.lights.sun.position}setShadows(t){this.lights.sun.castShadow=t}register(t){const e=new JM(t);return this.zones.set(e.id,e),e}link(t){for(const e of[t.a,t.b])if(!this.zones.has(e.zone))throw new Error(`portal ${t.id} refers to unknown zone "${e.zone}"`);this.portals.add(t,e=>this.zones.get(e)?.name??e)}prebuild(t){const e=this.zones.get(t);if(!e)return;const n=this.prepare(e);n.updateWorldMatrix(!0,!0),this.options.collider.warm(n,e.id)}surfaceAt(t,e){const n=this.active;return n?n.definition.surfaceAt?.(t,e)??n.environment.surface:"earth"}attachAudio(t){this.audio=t,this.doorAudio=new _2(t.engine),this.active&&this.applyAudio(this.active)}get current(){return this.active}get isTransitioning(){return this.transitioning}enter(t,e){const n=this.zones.get(t);if(!n)throw new Error(`no such zone "${t}"`);const{scene:s,collider:r,player:o,postfx:a,interaction:c}=this.options;this.active&&this.active!==n&&s.remove(this.active.root());const l=this.prepare(n);s.add(l),this.active=n,l.updateWorldMatrix(!0,!0),r.build(l,n.id);const h=n.environment;a.setEnvironment({sky:h.sky,fogColor:h.fogColor,fogNear:h.fogNear,fogFar:h.fogFar}),this.lights.sun.intensity=h.sunIntensity,this.lights.sun.color.setHex(h.sunColor),this.lights.fill.intensity=h.fillIntensity,this.lights.fill.color.setHex(h.fillColor),this.lights.ambient.intensity=h.ambientIntensity,this.lights.ambient.color.setHex(h.ambientSky),this.lights.ambient.groundColor.setHex(h.ambientGround),this.applyAudio(n);const u=this.portals.in(n.id).map(d=>d.door).filter(d=>d!==null);l.traverse(d=>{typeof d.userData.label=="string"&&u.push(d)}),c.setTargets(u);const f=n.settle(e??n.spawn);o.teleport(f.position,f.yaw),this.hovered=null,this.options.reticle.set(null),this.onZoneChange?.(n)}applyAudio(t){if(!this.audio)return;this.audio.engine.setRoom(t.environment.room),this.audio.footsteps.surface=t.environment.surface,this.audio.footsteps.setReverb(t.environment.footstepReverb);let e=this.soundscapes.get(t.id);e||(e=new KM(this.audio.engine,t.environment.soundscape),this.soundscapes.set(t.id,e));for(const[n,s]of this.soundscapes)s.setActive(n===t.id)}updateSound(t,e){this.active&&this.soundscapes.get(this.active.id)?.update(t,this.options.collider,e)}get sound(){return this.active?this.soundscapes.get(this.active.id)??null:null}prepare(t){const e=t.root();if(this.doored.has(t.id))return e;this.doored.add(t.id);for(const n of this.portals.in(t.id)){const s=n.end,r=Tp({seed:s.seed??1,material:s.material});r.position.copy(s.position),r.rotation.y=s.yaw,Se(r),e.add(r),this.portals.bind(n,r,d2(Ld(r).material))}return e.traverse(n=>{if(!(n instanceof Kt))return;const s=n.userData.noCollide===!0,r=n.name==="flatGround"||n.name==="terrain";n.castShadow=!s&&!r,n.receiveShadow=!s}),e}update(){const{interaction:t,collider:e,player:n,reticle:s}=this.options;if(this.transitioning)return s.set(null),null;const r=t.probe(n.camera,e);if(this.hovered=r?this.portals.sideOf(r.object):null,this.hovered)s.set({title:this.hovered.title,target:this.hovered.label});else{const o=o2(r?.object??null);s.set(o?{title:o}:null)}return this.hovered}async use(t){if(this.transitioning)return;this.transitioning=!0,this.options.reticle.set(null);const e=t.door?Ld(t.door).material:"timber";Id.copy(t.end.position).setY(t.end.position.y+1.2),this.doorAudio?.play(Id,e),await this.options.fade.cover(()=>{this.enter(t.target.zone,t.arrival),this.crossings++}),this.transitioning=!1}respawn(){const t=this.active;t&&this.options.player.teleport(t.spawn.position,t.spawn.yaw)}dispose(){const{scene:t}=this.options;this.active&&t.remove(this.active.root()),t.remove(this.lights.sun,this.lights.fill,this.lights.ambient);for(const e of this.soundscapes.values())e.dispose();this.soundscapes.clear();for(const e of this.zones.values())e.dispose();this.zones.clear(),this.doored.clear()}}const Id=new C,M2=.14,Dd=.22;class b2{element;title;target;joiner;shown=!1;showing="";constructor(t){this.element=document.createElement("div"),this.element.id="prompt",this.element.setAttribute("aria-live","polite");const e=document.createElement("span");e.className="prompt-lines",this.title=document.createElement("span"),this.title.className="prompt-title",this.joiner=document.createElement("span"),this.joiner.className="prompt-to",this.joiner.textContent="to",this.target=document.createElement("span"),this.target.className="prompt-target",e.append(this.title,this.joiner,this.target),this.element.append(e),t.appendChild(this.element)}set(t){const e=t!==null;if(t){const n=`${t.title}\0${t.target}`;if(n!==this.showing){this.showing=n,this.title.textContent=t.title,this.target.textContent=t.target??"";const s=!!t.target;this.joiner.hidden=!s,this.target.hidden=!s}}e!==this.shown&&(this.shown=e,this.element.classList.toggle("is-shown",e))}dispose(){this.element.remove()}}class S2{element;constructor(t){this.element=document.createElement("div"),this.element.id="fade",t.appendChild(this.element)}async cover(t){this.element.classList.add("is-black"),await hc(Dd),t(),await hc(M2),this.element.classList.remove("is-black"),await hc(Dd)}dispose(){this.element.remove()}}function hc(i){return new Promise(t=>window.setTimeout(t,i*1e3))}const E2=6,T2=.55,A2=.42;class R2{element;renderer;pixel=new Uint8Array(4);countdown=0;onLight=!1;constructor(t,e=document.getElementById("crosshair")){this.renderer=t,this.element=e}update(){if(!this.element||this.countdown-- >0)return;this.countdown=E2;const t=this.renderer.getContext();this.renderer.setRenderTarget(null);const e=t.drawingBufferWidth,n=t.drawingBufferHeight;if(e===0||n===0)return;t.readPixels(e>>1,n>>1,1,1,t.RGBA,t.UNSIGNED_BYTE,this.pixel);const s=(.2126*this.pixel[0]+.7152*this.pixel[1]+.0722*this.pixel[2])/255,r=this.onLight?s>A2:s>T2;r!==this.onLight&&(this.onLight=r,this.element.classList.toggle("on-light",r))}}const Rp={floor:z.TIMBER,floorSeam:1315085,wall:z.CLOTH,wallTrim:z.TIMBER_DARK,ceiling:z.TIMBER_DARK,beam:z.BARK},C2={floor:z.STONE_DARK,floorSeam:921618,wall:z.STONE,wallTrim:z.IRON,ceiling:4015178,beam:z.RUST};function Cp(i){const{width:t,depth:e,height:n,seed:s=1,style:r=Rp,planks:o=!0,beams:a=3,thickness:c=.35}=i,l=Rt(s),h=[],u=c,f=t+u*2,d=e+u*2,m=o?-.006:0,v=new V(f,u,d);v.translate(0,m-u/2,0),h.push({geometry:v,color:o?r.floorSeam:r.floor,sway:0});const g=new V(f,u,d);g.translate(0,n+u/2,0),h.push({geometry:g,color:r.ceiling,sway:0});for(const _ of[-1,1]){const y=new V(f,n,u);y.translate(0,n/2,_*(e+u)/2),h.push({geometry:y,color:r.wall,sway:0})}for(const _ of[-1,1]){const y=new V(u,n,d);y.translate(_*(t+u)/2,n/2,0),h.push({geometry:y,color:r.wall,sway:0})}if(o){const _=l.range(.24,.34),y=Math.ceil(t/_),x=.012;for(let b=0;b<y;b++){const S=-t/2+(b+.5)*_,E=new V(_-x,.03,e);E.translate(S,-.015,0),h.push({geometry:E,color:B(r.floor,l.around(1,.09)),sway:0})}}if(a>0){const _=l.range(.16,.24);for(let y=0;y<a;y++){const x=-e/2+(y+.5)/a*e,b=new V(f,_,l.range(.18,.26));b.translate(0,n-_/2,x),h.push({geometry:b,color:r.beam,sway:0})}}const p=.16;for(const _ of[-1,1]){const y=new V(t,p,.06);y.translate(0,p/2,_*(e-.06)/2),h.push({geometry:y,color:r.wallTrim,sway:0})}for(const _ of[-1,1]){const y=new V(.06,p,e);y.translate(_*(t-.06)/2,p/2,0),h.push({geometry:y,color:r.wallTrim,sway:0})}return Dt(At(h),"interior",0)}const uh={name:"hut",category:"structures",radius:2.6,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(3,4.4),r=e.range(2.6,3.8),o=e.range(2,2.6),a=e.range(.4,.8),c=e.range(.9,1.5),l=new K(c,c,s*1.16,3,1);l.rotateZ(Math.PI/2),l.rotateX(Math.PI/6),l.scale(1,1,r*1.2/(c*2)),l.computeBoundingBox(),l.translate(0,o-(l.boundingBox?.min.y??0),0),n.push({geometry:l,color:z.STONE,sway:0});const h=o,u=new V(s,a,r);u.translate(0,a/2,0),n.push({geometry:u,color:z.STONE_DARK,sway:0});const f=new V(s*.97,h-a,r*.97);f.translate(0,a+(h-a)/2,0),n.push({geometry:f,color:z.TIMBER,sway:0});const d=e.range(.75,.95),m=e.range(1.5,1.8),v=e.around(0,s*.15),g=new V(d,m,.08);g.translate(v,m/2,r*.487),n.push({geometry:g,color:1514012,sway:0});const p=new V(d*1.3,.14,.16);p.translate(v,m+.07,r*.49),n.push({geometry:p,color:z.TIMBER_DARK,sway:0});for(const b of[-1,1])for(const S of[-1,1]){const E=new V(.16,h,.16);E.translate(b*s/2,h/2,S*r/2),n.push({geometry:E,color:z.TIMBER_DARK,sway:0})}const _=At(n);t!==1&&_.scale(t,t,t);const y=Dt(_,"hut",0),x={x:v*t,z:r*.487*t,width:d*t,height:m*t};return y.userData.doorAnchor=x,y}};function P2(i){return i.userData.doorAnchor}const Nd=[{name:"small",weight:.3,scale:[.55,.75]},{name:"ordinary",weight:.45,scale:[.85,1.15]},{name:"large",weight:.18,scale:[1.5,1.9]},{name:"huge",weight:.07,scale:[2.1,2.6]}],or={name:"crate",category:"objects",radius:1.2,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[];let s=e(),r=Nd[1];for(const g of Nd)if(s-=g.weight,s<=0){r=g;break}const o=e.range(r.scale[0],r.scale[1]),a=e.range(.5,.9)*o,c=e.range(.45,.8)*o,l=e.range(.5,.9)*o,h=e.around(0,.35),u=new V(a,c,l);u.translate(0,c/2,0),u.rotateY(h),n.push({geometry:u,color:z.TIMBER,sway:0});const f=Math.max(2,Math.round(2+o*.9+(e.chance(.3)?1:0))),d=.05*Math.min(o,1.5),m=1.02;for(let g=0;g<f;g++){const p=c*(.13+g/Math.max(f-1,1)*.74),_=new V(a*m,d,l*m);_.translate(0,p,0),_.rotateY(h),n.push({geometry:_,color:z.TIMBER_DARK,sway:0})}if(o>1.2||e.chance(.25)){const g=.055*Math.min(o,1.6);for(const p of[-1,1])for(const _ of[-1,1]){const y=new V(g,c*.96,g);y.translate(p*a/2,c*.48,_*l/2),y.rotateY(h),n.push({geometry:y,color:z.RUST,sway:0})}}if(e.chance(.35)){const g=new V(a*.92,.05*o,l*.92);g.translate(e.around(0,.08*o),c+.03*o,e.around(0,.08*o)),g.rotateY(h+e.around(0,.25)),n.push({geometry:g,color:z.TIMBER_DARK,sway:0})}const v=At(n);return t!==1&&v.scale(t,t,t),Dt(v,"crate",0)}},ar={name:"barrel",category:"objects",radius:.55,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(.75,1.05),r=e.range(.3,.4),o=r*e.range(.78,.88),a=e.int(8,11),c=e.chance(.25),l=[new et(0,0),new et(o,0),new et(r,s*.35),new et(r,s*.65),new et(o,s),new et(0,s)];n.push({geometry:new Li(l,a),color:z.TIMBER,sway:0});for(const u of[.14,.5,.86]){const f=u>.3&&u<.7?r:o+(r-o)*.45,d=new K(f*1.04,f*1.04,.055,a);d.translate(0,s*u,0),n.push({geometry:d,color:z.IRON,sway:0})}let h=At(n);return c&&(h.rotateX(Math.PI/2),h.rotateY(e.range(0,Math.PI*2)),h.translate(0,r,0)),t!==1&&(h=h.scale(t,t,t)),Dt(h,"barrel",0)}},Pp={name:"bed",category:"furniture",radius:1.3,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(.9,1.25),r=e.range(1.85,2.15),o=e.range(.26,.4),a=e.range(.07,.1),c=e.chance(.55)?z.TIMBER_DARK:z.BARK,l=e.pick([z.CLOTH,z.WOOL,z.HIDE_PALE]),h=e.pick([z.HIDE,z.LEAF_DARK,z.RUST,z.STONE_DARK]),u=e.chance(.5)?-1:1;for(const E of[-1,1]){const T=new V(a,o*.55,r);T.translate(E*(s-a)/2,o*.72,0),n.push({geometry:T,color:c,sway:0})}for(const E of[-1,1])for(const T of[-1,1]){const M=o*(T===u?1.05:.98),w=new V(a,M,a);w.translate(E*(s-a)/2,M/2,T*(r-a)/2),n.push({geometry:w,color:c,sway:0})}const f=e.range(.34,.62),d=new V(s,f,.055);if(d.translate(0,o+f/2-.04,u*r/2),n.push({geometry:d,color:c,sway:0}),e.chance(.55)){const E=f*e.range(.3,.5),T=new V(s,E,.05);T.translate(0,o+E/2-.04,-u*r/2),n.push({geometry:T,color:c,sway:0})}const m=o+e.range(.14,.2),v=6,g=(r-.1)/v;for(let E=0;E<v;E++){const T=-r/2+.05+(E+.5)*g,M=u<0?E/(v-1):1-E/(v-1),w=1-.22*Math.sin(M*Math.PI)*e.range(.4,1),A=(m-o*.72)*w,N=new V(s-a*1.4,A,g*1.04);N.translate(0,o*.72+A/2,T),n.push({geometry:N,color:l,sway:0})}const p=r*e.range(.6,.75),_=4,y=p/_,x=-u*r/2;for(let E=0;E<_;E++){const T=x+u*((E+.5)*y),M=e.range(.045,.075),w=new V(s-a*.6,M,y*1.02);w.translate(0,m+M/2-.01,T),n.push({geometry:w,color:h,sway:0})}const b=new V(s-a*.6,.05,.09);if(b.translate(0,m+.05,x+u*p),n.push({geometry:b,color:B(h,1.18),sway:0}),e.chance(.85)){const E=e.range(.26,.36),T=new V(s*e.range(.5,.72),e.range(.09,.14),E);T.translate(e.around(0,s*.1),m+.06,u*(r/2-E*.8)),T.rotateY(e.around(0,.18)),n.push({geometry:T,color:B(l,1.12),sway:0})}const S=At(n);return t!==1&&S.scale(t,t,t),Dt(S,"bed",0)}},Ud=[{weight:.28,width:[.7,1],depth:[.5,.68]},{weight:.47,width:[1.2,1.7],depth:[.7,.95]},{weight:.25,width:[2.1,3],depth:[.85,1.1]}],Oo={name:"table",category:"furniture",radius:1.6,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[];let s=e(),r=Ud[1];for(const _ of Ud)if(s-=_.weight,s<=0){r=_;break}const o=e.range(r.width[0],r.width[1]),a=e.range(r.depth[0],r.depth[1]),c=e.range(.68,.78),l=e.range(.045,.07),h=o>1.5&&e.chance(.45),u=e.chance(.6)?z.TIMBER:z.TIMBER_DARK,f=u===z.TIMBER?z.TIMBER_DARK:z.TIMBER,d=e.int(3,5),m=a/d,v=.008;for(let _=0;_<d;_++){const y=new V(o,l*e.range(.93,1),m-v);y.translate(0,c-l/2,-a/2+(_+.5)*m),n.push({geometry:y,color:B(u,e.around(1,.07)),sway:0})}const g=c-l;if(h){const _=o*e.range(.16,.24);for(const x of[-1,1]){const b=x*(o/2-_),S=new V(.09,.07,a*.86);S.translate(b,.035,0),n.push({geometry:S,color:f,sway:0});const E=e.range(.09,.13),T=new V(E,g-.07,a*.2);T.translate(b,.07+(g-.07)/2,0),n.push({geometry:T,color:f,sway:0});const M=new V(.09,.06,a*.8);M.translate(b,g-.03,0),n.push({geometry:M,color:f,sway:0})}const y=new V(o-_*1.2,.07,.07);y.translate(0,g*e.range(.32,.42),0),n.push({geometry:y,color:f,sway:0})}else{const _=e.range(.055,.085),y=o/2-_*.9,x=a/2-_*.9;for(const b of[-1,1])for(const S of[-1,1]){const E=new V(_,g,_);E.translate(b*y,g/2,S*x),n.push({geometry:E,color:f,sway:0})}if(e.chance(.7)){for(const S of[-1,1]){const E=new V(y*2,.07,.03);E.translate(0,g-.07/2-.02,S*x),n.push({geometry:E,color:f,sway:0})}for(const S of[-1,1]){const E=new V(.03,.07,x*2);E.translate(S*y,g-.07/2-.02,0),n.push({geometry:E,color:f,sway:0})}}}const p=At(n);return t!==1&&p.scale(t,t,t),Dt(p,"table",0)}},wl={name:"chair",category:"furniture",radius:.45,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(.42,.5),r=e.range(.38,.46),o=e.range(.36,.44),a=e.range(.04,.06),c=e.range(.44,.66),l=e.pick(["slats","spindles","board"]),h=e.chance(.55)?z.TIMBER:z.TIMBER_DARK,u=h===z.TIMBER?z.TIMBER_DARK:z.TIMBER,f=new V(r,a,o);f.translate(0,s-a/2,0),n.push({geometry:f,color:h,sway:0});const d=e.range(.035,.048),m=r/2-d*.7,v=o/2-d*.7;for(const _ of[-1,1]){const y=new V(d,s,d);y.translate(_*m,s/2,v),n.push({geometry:y,color:u,sway:0})}for(const _ of[-1,1]){const y=new V(d,s,d);y.translate(_*m,s/2,-v),n.push({geometry:y,color:u,sway:0});const x=.03,b=new V(d,c+x,d);b.translate(_*m,s+c/2-x/2,-v),n.push({geometry:b,color:u,sway:0})}const g=(_,y)=>{_.translate(0,s+y,-v)};if(l==="board"){const _=c*e.range(.4,.55),y=new V(r*.86,_,.03);g(y,c-_*.62),n.push({geometry:y,color:h,sway:0})}else if(l==="slats"){const _=e.int(2,3);for(let y=0;y<_;y++){const x=c*(.42+y/Math.max(_-1,1)*.5),b=new V(r*.84,e.range(.06,.1),.026);g(b,x),n.push({geometry:b,color:h,sway:0})}}else{const _=e.int(3,5),y=r*.72,x=c*.93,b=.02,S=x+b;for(let T=0;T<_;T++){const M=-y/2+T/(_-1)*y,w=new V(.026,S,.026);w.translate(M,S/2-b,0),g(w,0),n.push({geometry:w,color:u,sway:0})}const E=new V(r*.84,.055,.032);g(E,x),n.push({geometry:E,color:h,sway:0})}if(e.chance(.6)){const _=new V(m*2,.026,.026);_.translate(0,s*e.range(.28,.36),v),n.push({geometry:_,color:u,sway:0})}const p=At(n);return t!==1&&p.scale(t,t,t),Dt(p,"chair",0)}},Ml={name:"stool",category:"furniture",radius:.42,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.chance(.45)?3:4,r=e.range(.42,.56),o=e.range(.16,.23),a=e.range(.04,.07),c=e.chance(.5)?z.TIMBER:z.TIMBER_DARK,l=c===z.TIMBER?z.TIMBER_DARK:z.TIMBER,h=s===3?new K(o,o*.96,a,6):new V(o*1.9,a,o*1.9);h.translate(0,r-a/2,0),s===4&&h.rotateY(e.around(0,.2)),n.push({geometry:h,color:c,sway:0});const u=r-a,f=e.range(.14,.26),d=o*.66,m=u/Math.cos(f);for(let p=0;p<s;p++){const _=p/s*Math.PI*2+(s===4?Math.PI/4:0),y=e.range(.035,.05),x=Math.cos(_),b=Math.sin(_),S=new V(y,m,y);S.translate(0,-m/2,0),S.rotateZ(f),S.rotateY(-_),S.translate(x*d,u,b*d),n.push({geometry:S,color:l,sway:0})}const v=d+m*Math.sin(f);if(s===4&&e.chance(.45)){const p=e.range(.28,.38),_=d+(v-d)*(1-p);for(const y of[0,Math.PI/2]){const x=new V(_*2,.028,.028);x.translate(0,u*p,0),x.rotateY(y+Math.PI/4),n.push({geometry:x,color:l,sway:0})}}const g=At(n);return t!==1&&g.scale(t,t,t),Dt(g,"stool",0)}},L2=[{shape:"cone",weight:.3},{shape:"orb",weight:.2},{shape:"wedge",weight:.16},{shape:"drum",weight:.14},{shape:"block",weight:.11},{shape:"spike",weight:.09}];function I2(i){let t=i();for(const e of L2)if(t-=e.weight,t<=0)return e.shape;return"cone"}const D2={cone:.3,wedge:.3,drum:.4,block:.4,orb:.5,spike:.85};function N2(i,t,e){switch(i){case"cone":return new jt(t*1.15,t*e.range(2.2,3.2),e.int(5,8));case"wedge":return new jt(t*1.3,t*e.range(1.6,2.2),4);case"drum":return new K(t*1.1,t*1.15,t*e.range(1.1,1.7),7);case"block":return new V(t*1.7,t*e.range(1.6,2.3),t*1.5);case"spike":return new bn(t*1.3,0);case"orb":default:return new ee(t,0)}}function U2(i,t,e,n){switch(i.int(0,3)){case 0:return{geometry:new V(t*2,n,t*1.3),halfDepth:t*.65};case 1:return{geometry:new K(e,t,n,i.int(5,7)),halfDepth:t*.85};case 2:return{geometry:new K(t,e,n,4),halfDepth:t*.75};default:return{geometry:new K(t,e,n,i.int(5,7)),halfDepth:t*.85}}}function Fd(i,t,e,n){return i?new V(t*2,n,t*2):new K(t,e,n,5)}function Un(i,t,e=0){return new C(t*(i.reach+.03+e),i.hold,.16)}const F2=[(i,t,e)=>{const n=i.range(.11,.16),s=Un(t,e,n*.6),r=new K(n*.6,n*.4,n,7);return r.translate(s.x,s.y+n/2,s.z),[{geometry:r,color:i.pick([z.WOOL,z.RUST]),sway:0}]},(i,t,e)=>{const n=i.range(.14,.2),s=Un(t,e,n),r=new ee(n,0);r.scale(1,1.15,1),r.translate(s.x,s.y+n*.7,s.z);const o=new K(n*.32,n*.45,n*.8,6);o.translate(s.x,s.y+n*1.8,s.z);const a=i.pick([z.RUST,z.COW_BLACK]);return[{geometry:r,color:a,sway:0},{geometry:o,color:a,sway:0}]},(i,t,e)=>{const n=i.range(.1,.15),s=Un(t,e,n),r=new ee(n,0);return r.scale(1,i.range(.7,.95),i.range(.8,1.1)),r.rotateX(i.range(0,Math.PI)),r.rotateY(i.range(0,Math.PI)),r.translate(s.x,s.y,s.z),[{geometry:r,color:i.pick([z.STONE_DARK,z.COW_BLACK]),sway:0}]},(i,t,e)=>{const n=[],s=Un(t,e,.04),r=i.range(.28,.45),o=new K(.012,.016,r,4);o.translate(s.x,s.y+r/2,s.z),n.push({geometry:o,color:z.BARK,sway:.45});const a=i.int(3,6);for(let c=0;c<a;c++){const l=new ee(i.range(.055,.085),0);l.scale(1,.4,.85),l.rotateY(i.range(0,Math.PI)),l.rotateZ(i.around(0,.5)),l.translate(s.x+i.around(0,.07),s.y+r*i.range(.6,1.05),s.z+i.around(0,.06)),n.push({geometry:l,color:z.LEAF,sway:.7})}return n},(i,t,e)=>{const n=i.range(.11,.16),s=Un(t,e,n*1.5),r=new ee(n,0);return r.scale(1.5,.75,.9),r.rotateY(i.around(0,.4)),r.translate(s.x,s.y+.03,s.z),[{geometry:r,color:i.pick([z.BARK_PALE,z.MARKER_YELLOW]),sway:0}]},(i,t,e)=>{const n=i.range(.16,.23),s=Un(t,e,n),r=new ee(n,0);return r.scale(1,i.range(.8,1.05),.9),r.rotateX(i.range(0,Math.PI)),r.translate(s.x,s.y+.06,s.z),[{geometry:r,color:i.pick([z.WOOL,z.RUST]),sway:0}]},(i,t,e)=>{const n=i.range(.2,.28),s=Un(t,e,n*.55),r=new V(n*.75,n,.03);return r.rotateZ(e*i.range(.15,.45)),r.translate(s.x,s.y+n*.3,s.z),[{geometry:r,color:i.pick([z.COW_BLACK,z.WOOL]),sway:0}]},(i,t,e)=>{const n=Un(t,e,.07),s=i.range(.1,.18),r=new K(.01,.01,s,4);r.translate(n.x,n.y+s/2,n.z);const o=new V(.12,.15,.12);o.translate(n.x,n.y-.07,n.z);const a=new jt(.095,.06,4);return a.translate(n.x,n.y+.02,n.z),[{geometry:r,color:z.IRON,sway:0},{geometry:o,color:z.MARKER_YELLOW,sway:0},{geometry:a,color:z.IRON,sway:0}]},(i,t,e)=>{const n=i.range(.24,.36),s=Un(t,e,n*.5),r=new bn(n*.36,0);r.scale(1.9,.85,.5),r.rotateZ(e*.8),r.translate(s.x,s.y-n*.25,s.z);const o=new jt(n*.16,n*.24,3);return o.scale(1,1,.4),o.rotateZ(e*.8+Math.PI),o.translate(s.x+e*n*.32,s.y-n*.25-n*.42,s.z),[{geometry:r,color:z.STONE_PALE,sway:0},{geometry:o,color:z.STONE,sway:0}]}],uc=[{name:"held",weight:.52,build:(i,t,e)=>i.pick(F2)(i,t,e)},{name:"pauldron",weight:.18,build:(i,t,e)=>{const n=new ee(i.range(.09,.14),0);return n.scale(1.15,.65,1.05),n.rotateY(i.range(0,Math.PI)),n.translate(e*(t.chest+.04),t.shoulder-.02,0),[{geometry:n,color:z.IRON,sway:0}]}},{name:"pack",weight:.19,build:(i,t,e)=>{const n=i.range(.2,.32),s=i.range(.24,.4),r=i.range(.12,.2),o=new V(n,s,r);return o.rotateY(i.around(0,.2)),o.translate(e*i.range(0,.07),t.shoulder-s*.55,-(t.depth+r*.4)),[{geometry:o,color:z.TIMBER_DARK,sway:0}]}},{name:"horn",weight:.08,build:(i,t,e)=>{const n=i.range(.14,.3),s=new jt(i.range(.02,.035),n,4);return s.translate(0,n/2,0),s.rotateZ(e*i.range(.5,1.1)),s.rotateX(i.around(0,.3)),s.translate(e*.05,t.height*.97,0),[{geometry:s,color:z.SKIN,sway:0}]}}];function Od(i){let t=i()*uc.reduce((e,n)=>e+n.weight,0);for(const e of uc)if(t-=e.weight,t<=0)return e;return uc[0]}const Qs={name:"figure",category:"people",radius:.55,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(1.55,2.05),r=e.range(.72,1.24),o=s*e.range(.44,.58),a=s*e.range(.78,.87),c=e.pick([z.CLOTH,z.TIMBER_DARK,z.STONE_DARK]),l=e.chance(.45),h=e.chance(.5)?1:-1,u=.19*r*e.range(.8,1.25),f=.15*r*e.range(.8,1.3),{geometry:d,halfDepth:m}=U2(e,u,f,a-o);d.translate(0,(a+o)/2,0),d.rotateY(e.around(0,.25)),n.push({geometry:d,color:c,sway:0});const v=e.range(.04,.22),g=new K(.045,.06,v,5);g.translate(0,a+v/2,0),n.push({geometry:g,color:z.SKIN,sway:0});const p=e.range(.085,.15),_=I2(e),y=N2(_,p,e);y.scale(e.range(.82,1.08),e.range(.95,1.3),e.range(.85,1.12)),y.rotateZ(e.around(0,.16)),y.rotateY(e.range(0,Math.PI)),y.computeBoundingBox();const x=p*D2[_];y.translate(0,a+v-x-(y.boundingBox?.min.y??0),0),n.push({geometry:y,color:l?c:z.SKIN,sway:0});const b=e.range(.045,.075)*r,S=e.range(.03,.055)*r,E=(a-o)*e.range(.95,1.5),T=e.chance(.25),M=e.range(-.02,.09),w=e.range(.06,.11)*r,A=e.chance(.25),N=e.range(.04,.22);for(const F of[-1,1]){const D=o,H=Fd(T,b,b*.8,D);H.translate(0,-D/2,0),H.rotateZ(F*M),H.translate(F*w,o,0),n.push({geometry:H,color:z.TIMBER_DARK,sway:0});const k=Fd(A,S,S*.82,E);k.translate(0,-E/2,0),k.rotateZ(F*N),k.translate(F*(u+S*1.4),a-.03,0),n.push({geometry:k,color:c,sway:0})}const L={height:s,shoulder:a,hip:o,chest:u,reach:u+S*2.6,hold:a-E*.82,depth:m};e.chance(.62)&&(n.push(...Od(e).build(e,L,h)),e.chance(.22)&&n.push(...Od(e).build(e,L,h)));const U=At(n);return t!==1&&U.scale(t,t,t),Dt(U,"figure",0)}},bl={name:"machine",category:"structures",radius:1.6,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(2.1,2.8),r=e.range(.9,1.3),o=e.range(.32,.46),a=e.chance(.5)?z.IRON:z.STONE_DARK,c=e.chance(.6)?z.RUST:z.IRON,l=new V(s,o,r);l.translate(0,o/2,0),n.push({geometry:l,color:z.STONE_DARK,sway:0});for(const D of[-1,1])for(const H of[-1,1]){const k=new V(.22,.08,.22);k.translate(D*(s-.3)/2,.04,H*(r-.3)/2),n.push({geometry:k,color:c,sway:0})}const h=e.chance(.4)?"twin":e.chance(.5)?"stacked":"single",u=e.range(.34,.46)*(h==="single"?1:.82),f=s*e.range(.62,.74),d=-s*.12,m=(D,H,k)=>{const Y=new K(D,D,f,10);Y.rotateZ(Math.PI/2),Y.translate(d,H,k),n.push({geometry:Y,color:a,sway:0});for(const rt of[-.28,.08,.34]){const ft=new K(D*1.06,D*1.06,.07,10);ft.rotateZ(Math.PI/2),ft.translate(d+f*rt,H,k),n.push({geometry:ft,color:c,sway:0})}};let v=o+u*2;if(h==="twin"){const D=u*1.02;m(u,o+u,-D),m(u,o+u,D)}else if(h==="stacked"){const D=u*e.range(.7,.86);m(u,o+u,0),m(D,o+u*2+D*.92,0),v=o+u*2+D*1.9;for(const H of[-.3,.3]){const k=new V(.1,D*1.1,u*1.1);k.translate(d+f*H,o+u*2,0),n.push({geometry:k,color:c,sway:0})}}else m(u,o+u,0);const g=e.range(.52,.72),p=o+g*.82,_=e.chance(.5)?4:3,y=e.chance(.3),x=s/2+e.range(.16,.26),b=y?x*2:x+s*.28,S=y?0:x-b/2,E=new K(.075,.075,b,8);E.rotateZ(Math.PI/2),E.translate(S,p,0),n.push({geometry:E,color:B(c,1.1),sway:0});const T=y?[-s*.34,s*.34]:[s*.16,s*.4];for(const D of T){const H=new V(.26,p-o+.12,.3);H.translate(D,o+(p-o)/2,0),n.push({geometry:H,color:z.STONE_DARK,sway:0});const k=new V(.3,.1,.34);k.translate(D,p,0),n.push({geometry:k,color:c,sway:0})}for(const D of y?[x,-x]:[x]){const H=new K(g,g,.12,12);H.rotateZ(Math.PI/2),H.translate(D,p,0),n.push({geometry:H,color:a,sway:0});const k=new K(.15,.15,.26,8);k.rotateZ(Math.PI/2),k.translate(D,p,0),n.push({geometry:k,color:c,sway:0});for(let Y=0;Y<_;Y++){const rt=new V(.07,g*1.85,.06);rt.rotateX(Math.PI/2),rt.rotateX(Y/_*Math.PI),rt.translate(D,p,0),n.push({geometry:rt,color:B(a,.86),sway:0})}}const M=new V(s*.42,.08,.08);M.translate(d+f*.45,o+u*.9,g*.42),n.push({geometry:M,color:c,sway:0});const w=e.range(1.1,1.8),A=e.range(.11,.16),N=new K(A*.85,A,w,8);N.translate(-s*.3,v+w/2-.1,0),n.push({geometry:N,color:a,sway:0});const L=new K(A*1.3,A*1.1,.1,8);L.translate(-s*.3,v+w-.14,0),n.push({geometry:L,color:c,sway:0});const U=e.int(1,2);for(let D=0;D<U;D++){const H=e.range(-.3,.25),k=new K(.07,.09,e.range(.16,.26),6);k.translate(d+f*H,v,0),n.push({geometry:k,color:c,sway:0});const Y=new K(.1,.1,.035,8);Y.translate(d+f*H,v+.16,0),n.push({geometry:Y,color:B(c,1.2),sway:0})}const F=At(n);return t!==1&&F.scale(t,t,t),Dt(F,"machine",0)}},dh={name:"sink",category:"objects",radius:.65,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(.62,.86),r=e.range(.45,.6),o=e.range(.24,.34),a=e.range(.5,.68),c=e.range(.02,.032),l=B(9410203,e.range(.9,1.08)),h=B(l,.84),u=B(z.IRON,e.range(.85,1.05)),f=a+o,d=new V(s,c,r);d.translate(0,a+c/2,0),n.push({geometry:d,color:h,sway:0});for(const U of[-1,1]){const F=new V(s*.99,o,c);F.translate(0,a+o/2,U*(r-c)/2),n.push({geometry:F,color:l,sway:0});const D=new V(c,o*.985,r*.985);D.translate(U*(s-c)/2,a+o/2,0),n.push({geometry:D,color:l,sway:0})}for(const U of[-1,1]){const F=new V(s*1.04,c*1.4,c*2.2);F.translate(0,f,U*r/2),n.push({geometry:F,color:B(l,1.14),sway:0});const D=new V(c*2.2,c*1.35,r*.96);D.translate(U*s/2,f,0),n.push({geometry:D,color:B(l,1.14),sway:0})}if(e.chance(.4)){const U=new V(s-c*2.2,.02,r-c*2.2);U.translate(0,a+c+o*e.range(.12,.3),0),n.push({geometry:U,color:z.WATER,sway:0})}const m=e.range(.018,.026),v=e.range(.06,.1);for(const U of[-1,1])for(const F of[-1,1]){const D=new K(m*.85,m,a,6);D.translate(U*(s-v*2)/2,a/2,F*(r-v*2)/2),n.push({geometry:D,color:u,sway:0})}if(e.chance(.55)){const U=a*e.range(.2,.32);for(const F of[0,1]){const D=F===0;for(const H of[-1,1]){const k=new V(D?s-v*2:m*1.2,m*1.1,D?m*1.2:r-v*2.4);k.translate(D?0:H*(s-v*2)/2,U,D?H*(r-v*2)/2:0),n.push({geometry:k,color:B(u,.88),sway:0})}}}const g=e.range(.16,.3),p=new V(s*1.02,g,c*1.6);p.translate(0,f+g/2,-r/2-c),n.push({geometry:p,color:B(l,.94),sway:0});const _=g+e.range(.1,.2),y=e.range(.012,.018),x=-r/2-c,b=new K(y,y*1.15,_,6);b.translate(0,f+_/2,x),n.push({geometry:b,color:B(u,1.15),sway:0});const S=e.range(.14,.22),E=new K(y*.9,y*.9,S,6);E.rotateX(Math.PI/2),E.translate(0,f+_,x+S/2),n.push({geometry:E,color:B(u,1.15),sway:0});const T=e.range(.05,.09),M=new K(y*.8,y*.95,T,6);M.translate(0,f+_-T/2,x+S),n.push({geometry:M,color:B(u,1.05),sway:0});const w=e.chance(.75)?2:1,A=e.range(.1,.16),N=x+y*3.4;for(let U=0;U<w;U++){const F=w===1?0:U===0?-A:A,D=e.range(.05,.085),H=new K(y*1.25,y*1.5,D,6);H.translate(F,f+D/2,N),n.push({geometry:H,color:B(u,1.05),sway:0});const k=new K(y*.4,y*.5,y*1.4,6);k.translate(F,f+D+y*.7,N),n.push({geometry:k,color:B(u,1.15),sway:0});const Y=e.range(0,Math.PI/2);for(const rt of[0,1]){const ft=new V(y*3.4,y*.75,y*.72);ft.rotateY(Y+(rt?Math.PI/2:0)),ft.translate(F,f+D+y*1.5,N),n.push({geometry:ft,color:B(z.RUST,1.05),sway:0})}}const L=At(n);return t!==1&&L.scale(t,t,t),Dt(L,"sink",0)}},zd=[{color:16760948,light:16758629,weight:.5},{color:16747100,light:16742984,weight:.32},{color:10475775,light:9423103,weight:.18}];function Lp(i){const t=i.range(0,1);let e=0;for(const n of zd)if(e+=n.weight,t<=e)return n;return zd[0]}const Ip=1.25;function Dp(i,t,e,n,s,r){const o=new bn(r,0);o.scale(1,2.4,1),o.translate(e,n,s),i.push({geometry:o,color:t.color,sway:0});const a=new bn(r*4.2,0);a.scale(1,1.5,1),a.translate(e,n,s);const c=r*4.2*1.5;i.push({geometry:a,color:(l,h,u)=>{const f=Math.hypot(l-e,h-n,u-s)/c;return O2(t.color,Math.max(0,.34*(1-f)))},sway:0})}function O2(i,t){const e=Math.round((i>>16&255)*t),n=Math.round((i>>8&255)*t),s=Math.round((i&255)*t);return e<<16|n<<8|s}const z2=2.15,k2=14,Sl={name:"candle",category:"objects",radius:.3,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=[],r=Lp(e),o=e.chance(.5)?14208430:12564904,a=e.chance(.35),c=e.range(.075,.11),l=B(z.IRON,e.range(.85,1.05));let h=0;if(a){const b=e.range(.16,.3),S=new K(c*.62,c*1.05,.022,8);S.translate(0,.011,0),n.push({geometry:S,color:B(l,.86),sway:0});const E=new K(.014,.019,b,6);if(E.translate(0,.022+b/2,0),n.push({geometry:E,color:l,sway:0}),e.chance(.6)){const T=new K(c*.78,c*.5,.016,8);T.translate(0,.022+b*e.range(.45,.62),0),n.push({geometry:T,color:B(l,1.08),sway:0})}h=.022+b}const u=new K(c,c*.88,.018,10);u.translate(0,h+.009,0),n.push({geometry:u,color:B(l,.94),sway:0}),h+=.018;const f=1+(e.chance(.42)?1:0)+(e.chance(.18)?1:0),d=c*.42;for(let b=0;b<f;b++){const S=b/f*Math.PI*2+e.range(0,Math.PI*2),E=f===1?0:Math.cos(S)*d,T=f===1?0:Math.sin(S)*d,M=e.range(.05,.16),w=e.range(.011,.016),A=e.range(0,.13),N=e.range(0,Math.PI*2),L=new K(w*.92,w,M,7);L.translate(0,M/2,0),L.rotateX(Math.cos(N)*A),L.rotateZ(Math.sin(N)*A),L.translate(E,h,T);const U=h+M*.55;n.push({geometry:L,color:(k,Y)=>Y>U?r.color:o,sway:0});const F=E+Math.sin(Math.sin(N)*A)*M,D=T-Math.sin(Math.cos(N)*A)*M,H=h+M;Dp(s,r,F,H+w*2.2,D,w*1.35),b===0&&Ki.set(F,H+w*2.2,D)}const m=At(n),v=At(s),g=e.range(0,Math.PI*2);m.rotateY(g),v.rotateY(g),t!==1&&(m.scale(t,t,t),v.scale(t,t,t));const p=Dt(m,"candle",0);p.add(dr(v,"candle:glow"));const _=Math.cos(g)*Ki.x+Math.sin(g)*Ki.z,y=-Math.sin(g)*Ki.x+Math.cos(g)*Ki.z,x=new Jo(r.light,z2*e.around(1,.15)*t*t,k2*t,Ip);return x.position.set(_*t,Ki.y*t,y*t),x.castShadow=!1,p.add(x),p}},Ki=new C,B2=60,H2=22,ho=15922406,bo={name:"floodlight",category:"structures",radius:.6,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=[],r=e.range(1.9,2.7),o=e.range(.3,.42),a=o*e.range(.58,.72),c=o*e.range(.34,.46),l=e.range(.32,.6),h=B(z.IRON,e.range(.85,1.05)),u=B(8159880,e.range(.9,1.1)),f=e.range(.035,.05),d=new K(f,f*1.1,r,6);d.translate(0,r/2,0),n.push({geometry:d,color:h,sway:0});const m=new K(f*3.2,f*3.6,f*1.1,8);m.translate(0,f*.55,0),n.push({geometry:m,color:B(h,.85),sway:0});const v=new K(f*1.5,f*1.5,f*2.6,6);v.rotateZ(Math.PI/2),v.translate(0,r,0),n.push({geometry:v,color:B(h,1.1),sway:0});const g=F=>{F.rotateX(l),F.translate(0,r,c*.6)},p=new V(o,a,c);g(p),n.push({geometry:p,color:u,sway:0});const _=new V(o*1.12,a*.16,c*1.5);_.translate(0,a*.56,c*.22),g(_),n.push({geometry:_,color:B(u,1.14),sway:0});const y=new V(o*.72,a*.62,c*.5);y.translate(0,0,-c*.68),g(y),n.push({geometry:y,color:B(u,.84),sway:0});const x=new V(o*.86,a*.7,c*.12);x.translate(0,0,c*.52),g(x),n.push({geometry:x,color:ho,sway:0});const b=e.range(5.5,8),S=e.range(.22,.34),E=o*.42,T=new jt(E+Math.tan(S)*b,b,10,1,!0);T.rotateX(-Math.PI/2),T.translate(0,0,c*.55+b/2),g(T),s.push({geometry:T,color:(F,D,H)=>{const k=Math.hypot(F,D-r,H)/b;return G2(ho,.3*Math.max(0,1-k)**1.6)},sway:0});const M=new bn(E*.9,0);M.scale(1,.8,.5),M.translate(0,0,c*.56),g(M),s.push({geometry:M,color:ho,sway:0});const w=At(n),A=At(s);t!==1&&(w.scale(t,t,t),A.scale(t,t,t));const N=Dt(w,"floodlight",0);N.add(dr(A,"floodlight:glow"));const L=new px(ho,B2*e.around(1,.1)*t*t,H2*t,S*1.15,.55,2);L.position.set(0,r*t,0);const U=new be;return U.position.set(0,(r-Math.sin(l)*b)*t,Math.cos(l)*b*t),N.add(U),L.target=U,L.castShadow=!1,N.add(L),N}};function G2(i,t){const e=Math.round((i>>16&255)*t),n=Math.round((i>>8&255)*t),s=Math.round((i&255)*t);return e<<16|n<<8|s}const Np={name:"pipes",category:"structures",radius:1.7,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(2.6,3.6),r=2,o=e.range(.06,.11),a=[z.RUST,4877172,7039548,z.IRON,8018492],c=B(e.pick(a),e.range(.9,1.1)),l=B(z.IRON,e.range(.85,1.05)),h=(v,g,p,_)=>{const y=new K(_,_,g,8);y.rotateZ(Math.PI/2),y.translate(v,p,0),n.push({geometry:y,color:c,sway:0})},u=(v,g,p,_=1.45)=>{const y=new K(p*_,p*_,p*.55,8);y.rotateZ(Math.PI/2),y.translate(v,g,0),n.push({geometry:y,color:B(l,1.05),sway:0})},f=e.int(3,5),d=[-s/2];for(let v=1;v<f;v++)d.push(-s/2+s*(v/f)*e.range(.82,1.18));d.push(s/2),d.sort((v,g)=>v-g);for(let v=0;v<d.length-1;v++){const g=d[v+1]-d[v];h((d[v]+d[v+1])/2,g+o*.5,r,o),v>0&&u(d[v],r,o)}if(u(-s/2,r,o,1.6),u(s/2,r,o,1.6),e.chance(.75)){const v=e.range(-s*.3,s*.3),g=new K(o*1.5,o*1.5,o*1.8,6);g.rotateZ(Math.PI/2),g.translate(v,r,0),n.push({geometry:g,color:B(l,1.1),sway:0});const p=new K(o*.28,o*.34,o*1.6,6);p.translate(v,r+o*2.2,0),n.push({geometry:p,color:l,sway:0});const _=new hr(o*1.1,o*.2,4,10);_.rotateX(Math.PI/2),_.translate(v,r+o*3,0),n.push({geometry:_,color:B(z.RUST,1.1),sway:0})}const m=At(n);return t!==1&&m.scale(t,t,t),Dt(m,"pipes",0)}},Up={name:"tank",category:"structures",radius:1.9,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(.4,1.05),r=s*e.range(2.1,4.6),o=e.range(.16,.62),a=o+s,c=e.chance(.45),l=c?B(z.RUST,e.range(.78,.95)):B(7173499,e.range(.9,1.08)),h=B(z.IRON,e.range(.85,1.05)),u=new K(s,s,r,10);u.rotateZ(Math.PI/2),u.translate(0,a,0),n.push({geometry:u,color:c?(y,x)=>x<a?B(l,.82):l:l,sway:0});for(const y of[-1,1]){const x=new K(s*.42,s,s*.45,10);x.rotateZ(y*Math.PI/2),x.translate(y*(r+s*.44)/2,a,0),n.push({geometry:x,color:B(l,1.06),sway:0});const b=new K(s*.42,s*.42,s*.12,10);b.rotateZ(Math.PI/2),b.translate(y*(r+s*.88)/2,a,0),n.push({geometry:b,color:B(h,.95),sway:0})}const f=Math.max(2,Math.round(r/e.range(.7,1.2)));for(let y=1;y<f;y++){const x=-r/2+r*y/f,b=new K(s*1.035,s*1.035,s*.1,10);b.rotateZ(Math.PI/2),b.translate(x,a,0),n.push({geometry:b,color:B(h,1.05),sway:0})}for(const y of[-1,1]){const x=y*r/2*e.range(.5,.66),b=new V(s*.5,o,s*1.8);b.translate(x,o/2,0),n.push({geometry:b,color:B(h,.82),sway:0});const S=new V(s*.42,s*.34,s*1.55);S.translate(x,o+s*.1,0),n.push({geometry:S,color:B(h,.92),sway:0});const E=new V(s*.8,s*.09,s*2);E.translate(x,s*.045,0),n.push({geometry:E,color:B(h,.74),sway:0})}const d=s*e.range(.3,.5),m=e.range(-r*.2,r*.2),v=new K(d,d*1.1,s*.22,8);v.translate(m,a+s*.98,0),n.push({geometry:v,color:B(h,.95),sway:0});const g=new K(d*1.2,d*1.2,s*.09,8);g.translate(m,a+s*1.12,0),n.push({geometry:g,color:B(h,1.12),sway:0});for(let y=0;y<8;y++){const x=y/8*Math.PI*2,b=new V(s*.055,s*.05,s*.055);b.translate(m+Math.cos(x)*d*1.05,a+s*1.17,Math.sin(x)*d*1.05),n.push({geometry:b,color:B(h,.8),sway:0})}const p=e.int(0,4);for(let y=0;y<p;y++){const x=-r*.35+r*.7*(y+.5)/p;if(Math.abs(x-m)<d*1.6)continue;const b=s*e.range(.1,.16),S=s*e.range(.3,.6),E=new K(b,b,S,6);E.translate(x,a+s*.9+S/2,0),n.push({geometry:E,color:B(l,1.1),sway:0});const T=new K(b*1.6,b*1.6,b*.5,6);T.translate(x,a+s*.9+S,0),n.push({geometry:T,color:B(h,1.05),sway:0})}const _=At(n);return t!==1&&_.scale(t,t,t),Dt(_,"tank",0)}},Fp={name:"vent",category:"structures",radius:.7,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(.55,.85),r=e.range(.45,.7),o=e.range(.16,.26),a=e.range(.035,.055),c=1.7,l=B(8883859,e.range(.9,1.08)),h=e.chance(.4),u=c,f=u+r;for(const y of[-1,1]){const x=new V(a,r,o);x.translate(y*(s-a)/2,u+r/2,0),n.push({geometry:x,color:l,sway:0});const b=new V(s,a*.92,o*.98);b.translate(0,y<0?u+a*.46:f-a*.46,0),n.push({geometry:b,color:B(l,.94),sway:0})}const d=new V(s*1.14,a*.8,o*1.5);d.rotateX(-.14),d.translate(0,f+a*.4,o*.2),n.push({geometry:d,color:B(l,1.12),sway:0});const m=r-a*2.2,v=Math.max(3,Math.round(m/e.range(.055,.085))),g=m/v,p=g*.42;for(let y=0;y<v;y++){const x=u+a*1.1+g*(y+.5),b=new V(s-a*2.2,p,o*.66);b.rotateX(e.range(.5,.72)),b.translate(0,x,o*.1-y/v*o*.24),n.push({geometry:b,color:h&&e.chance(.3)?B(z.RUST,.95):B(l,1.06),sway:0})}if(s>.7){const y=new V(a*.7,m,o*.5);y.translate(0,u+r/2,-o*.06),n.push({geometry:y,color:B(l,.88),sway:0})}const _=At(n);return t!==1&&_.scale(t,t,t),Dt(_,"vent",0)}},Op={name:"railing",category:"structures",radius:1.5,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(2.2,3.2),r=e.range(1.04,1.14),o=e.range(.021,.028),a=o*e.range(1.05,1.25),c=e.chance(.55),l=B(c?12097838:9278618,e.range(.92,1.08)),h=B(z.IRON,e.range(.85,1.05)),u=Math.max(2,Math.round(s/e.range(1.1,1.5)));for(let v=0;v<=u;v++){const g=-s/2+s*v/u,p=new K(a*.92,a,r,6);p.translate(g,r/2,0),n.push({geometry:p,color:l,sway:0});const _=new V(a*4.6,a*.7,a*4.6);_.translate(g,a*.35,0),n.push({geometry:_,color:B(h,.88),sway:0})}for(const v of[r-o,r*e.range(.48,.56)]){const g=new K(o,o,s+a*2.4,8);g.rotateZ(Math.PI/2),g.translate(0,v,0),n.push({geometry:g,color:l,sway:0})}for(const v of[-1,1]){const g=new K(o*1.1,o*1.1,o*1.6,8);g.rotateZ(Math.PI/2),g.translate(v*(s+a*2.4)/2,r-o,0),n.push({geometry:g,color:B(l,.9),sway:0})}const f=e.range(.1,.15),d=new V(s,f,o*.7);d.translate(0,f/2+e.range(.005,.02),a*.8),n.push({geometry:d,color:B(l,.86),sway:0});const m=At(n);return t!==1&&m.scale(t,t,t),Dt(m,"railing",0)}},zp={name:"chainlink",category:"structures",radius:1.6,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(2.4,3.2),r=e.range(1.8,2.4),o=e.range(.04,.055),a=B(9278618,e.range(.92,1.08)),c=B(10133926,e.range(.9,1.1));for(const p of[-1,1]){const _=new K(o,o*1.06,r,6);_.translate(p*s/2,r/2,0),n.push({geometry:_,color:a,sway:0});const y=new K(o*1.15,o*1.15,o*.5,6);y.translate(p*s/2,r+o*.2,0),n.push({geometry:y,color:B(a,.9),sway:0})}const l=[r-o*1.4];e.chance(.75)&&l.push(o*1.6);for(const p of l){const _=new K(o*.62,o*.62,s,6);_.rotateZ(Math.PI/2),_.translate(0,p,0),n.push({geometry:_,color:B(a,1.05),sway:0})}const h=e.range(.2,.26),u=e.range(.008,.011),f=l[0],d=l.length>1?l[1]:0,m=f-d,v=s/2;for(const p of[1,-1])for(let _=-v-m;_<=v+m;_+=h){const y=Math.max(-v,Math.min(v,_)),x=Math.max(-v,Math.min(v,_+p*m));if(Math.abs(x-y)<.001)continue;const b=d+Math.abs(y-_),S=d+Math.abs(x-_),E=Math.hypot(x-y,S-b),T=new V(u,E,u);T.rotateZ(-Math.atan2(x-y,S-b)),T.translate((y+x)/2,(b+S)/2,p>0?u:-u),n.push({geometry:T,color:c,sway:0})}const g=At(n);return t!==1&&g.scale(t,t,t),Dt(g,"chainlink",0)}};function yn(i,t,e,n=e,s=4){dc.copy(t).sub(i);const r=dc.length();if(r<1e-6)return new K(e,e,1e-4,s);const o=new K(n,e,r,s);return o.translate(0,r/2,0),o.applyQuaternion(W2.setFromUnitVectors(V2,dc.divideScalar(r))),o.translate(i.x,i.y,i.z),o}const V2=new C(0,1,0),dc=new C,W2=new ai,kp={name:"hoist",category:"structures",radius:2.4,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(2.8,5.4),r=e.range(2.5,4.2),o=B(z.IRON,e.range(.85,1.05)),a=e.range(.08,.11),c=r;for(const[m,v,g]of[[c+.11,.3,.05],[c-.11,.3,.05]]){const p=new V(s,g,v);p.translate(0,m,0),n.push({geometry:p,color:B(o,1.06),sway:0})}const l=new V(s*.995,.24,.07);l.translate(0,c,0),n.push({geometry:l,color:o,sway:0});for(const m of[-1,1]){const v=m*s/2-m*.3,g=new K(a*.85,a,r,6);g.translate(v,r/2,0),n.push({geometry:g,color:o,sway:0});const p=new V(a*4.4,.07,a*4.4);p.translate(v,.035,0),n.push({geometry:p,color:B(o,.84),sway:0});const _=new C(v,r-.75,0),y=new C(v-m*.7,c-.16,0);n.push({geometry:yn(_,y,.045,.04),color:B(o,.9),sway:0})}const h=e.range(-s*.28,s*.28),u=new V(.38,.26,.3);u.translate(h,c-.28,0),n.push({geometry:u,color:B(o,1.14),sway:0});const f=new K(.13,.13,.12,8);if(f.rotateX(Math.PI/2),f.translate(h,c-.28,.2),n.push({geometry:f,color:B(z.RUST,1.05),sway:0}),e.chance(.72)){const m=e.range(.8,Math.max(1,c-1.4)),v=.035,g=.011,p=v*1.35,_=.075,y=m+_,x=y+_,b=x+.11,S=c-.42,E=b-v*.5,T=Math.max(p*2,S-E),M=Math.max(3,Math.round(T/p)+1);for(let F=0;F<M;F++){const D=S-F*T/(M-1),H=new hr(v,g,4,6);H.rotateY(F%2===0?0:Math.PI/2),H.translate(h,D,0),n.push({geometry:H,color:B(o,.92),sway:0})}n.push({geometry:yn(new C(h,b,0),new C(h,x,0),.03,.026,6),color:B(o,1.1),sway:0});const w=new C(h,y,0),A=6,N=F=>{const D=F/A*Math.PI*1.55;return new C(w.x+Math.sin(D)*_,w.y+Math.cos(D)*_,w.z)};for(let F=0;F<A;F++)n.push({geometry:yn(N(F),N(F+1),.024*(1-F/(A*2.4)),.022,5),color:B(o,1.05),sway:0});const L=N(A),U=new C(L.x-_*.5,L.y+_*.55,L.z);n.push({geometry:yn(L,U,.021,.005,5),color:B(o,1.15),sway:0})}const d=At(n);return t!==1&&d.scale(t,t,t),Dt(d,"hoist",0)}},X2=5,q2=18,El={name:"lantern",category:"objects",radius:.28,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=[],r=Lp(e),o=B(z.IRON,e.range(.85,1.08)),c=e.chance(.35)?B(z.RUST,e.range(.85,1.05)):o,l=e.chance(.45),h=e.range(.062,.082),u=h*(l?3.1:2.1)*e.range(.92,1.08),f=h*.16,d=h*.24,m=new K(h*1.24,h*1.4,d,8);m.translate(0,d/2,0),n.push({geometry:m,color:B(c,.82),sway:0});const v=h*.16,g=new V(h*2.1,v,h*2.1);g.translate(0,d+v/2,0),n.push({geometry:g,color:B(c,.9),sway:0});const p=d+v;for(const D of[-1,1])for(const H of[-1,1]){const k=new V(f,u,f);k.translate(D*(h*2-f)/2,p+u/2,H*(h*2-f)/2),n.push({geometry:k,color:c,sway:0})}for(const D of[p+u*.06,p+u*.94])for(const H of[0,1]){const k=H===0,Y=new V(k?h*2:f*.9,f*.9,k?f*.9:h*2-f*2.2);for(const rt of[-1,1]){const ft=Y.clone(),Ft=(h*2-f)/2;ft.translate(k?0:rt*Ft,D,k?rt*Ft:0),n.push({geometry:ft,color:B(c,.92),sway:0})}Y.dispose()}const _=p+u,y=h*.7,x=new K(h*.5,h*1.55,y,4);x.rotateY(Math.PI/4),x.translate(0,_+y/2,0),n.push({geometry:x,color:B(c,1.1),sway:0});const b=h*.3,S=new K(h*.34,h*.42,b,6);S.translate(0,_+y+b/2,0),n.push({geometry:S,color:B(c,.88),sway:0});const E=h*.5,T=new hr(E,f*.42,4,10);T.rotateY(e.chance(.5)?0:Math.PI/2),T.translate(0,_+y+b+E*.85,0),n.push({geometry:T,color:B(c,1.05),sway:0});const M=p+u*e.range(.24,.34),w=new K(h*.46,h*.56,h*.3,8);w.translate(0,p+h*.15,0),n.push({geometry:w,color:r.color,sway:0}),Dp(s,r,0,M,0,h*.42);const A=At(n),N=At(s),L=e.range(0,Math.PI*2);A.rotateY(L),N.rotateY(L),t!==1&&(A.scale(t,t,t),N.scale(t,t,t));const U=Dt(A,"lantern",0);U.add(dr(N,"lantern:glow"));const F=new Jo(r.light,X2*e.around(1,.12)*t*t,q2*t,Ip);return F.position.set(0,M*t,0),F.castShadow=!1,U.add(F),U}},Bp={name:"cistern",category:"objects",radius:.75,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(.5,.68),r=e.range(.09,.13),o=s-r,a=e.range(.44,.62),c=e.range(.1,.15),l=B(z.STONE,e.range(.9,1.08)),h=new K(s*.99,s*1.02,c,10);h.translate(0,c/2,0),n.push({geometry:h,color:B(l,.92),sway:0});const u=[new et(s,c*.5),new et(s*.96,a),new et(o,a),new et(o*.97,c*.5),new et(s,c*.5)],f=new Li(u,10);n.push({geometry:f,color:(g,p)=>p>a*.9?B(l,1.18):l,sway:0});const d=c+(a-c)*e.range(.3,.55),m=new K(o*.97,o*.97,.02,10);if(m.translate(0,d,0),n.push({geometry:m,color:z.WATER,sway:0}),e.chance(.55)){const g=new K(s*1.28,s*1.34,.07,10);g.translate(0,.03,0),n.push({geometry:g,color:B(z.STONE_DARK,e.range(.94,1.06)),sway:0})}if(e.chance(.45)){const g=e.range(.14,.22),p=a*e.range(.72,.9);for(const y of[-1,1]){const x=new V(.05,.09,g);x.translate(y*.055,p,s*.86+g/2),n.push({geometry:x,color:B(l,.92),sway:0})}const _=new V(.16,.035,g);_.translate(0,p-.05,s*.86+g/2),n.push({geometry:_,color:B(l,.86),sway:0})}const v=At(n);return v.rotateY(e.range(0,Math.PI*2)),t!==1&&v.scale(t,t,t),Dt(v,"cistern",0)}},Y2=.28,kd={turf:{color:z.GRASS,variation:.1,step:"grass"},meadow:{color:z.GRASS_DRY,variation:.13,step:"grass"},dirt:{color:z.EARTH,variation:.09,step:"earth"},gravel:{color:7235158,variation:.16,step:"gravel"},cobble:{color:z.STONE,variation:.19,step:"stone"},flagstone:{color:z.STONE_PALE,variation:.08,step:"stone"},boards:{color:z.TIMBER,variation:.11,step:"wood"},crop:{color:z.LEAF_DRY,variation:.15,step:"grass"},mire:{color:4536876,variation:.12,step:"mud"},rock:{color:z.STONE_DARK,variation:.13,step:"stone"}};function $2(i,t,e,n,s,r){const o=s-e,a=r-n,c=o*o+a*a,l=c===0?0:Math.max(0,Math.min(1,((i-e)*o+(t-n)*a)/c));return Math.hypot(i-(e+o*l),t-(n+a*l))}function Bd(i,t,e){for(let n=i.length-1;n>=0;n--){const s=i[n];switch(s.kind){case"blot":if(Math.hypot(t-s.at[0],e-s.at[1])<=s.radius)return s.material;break;case"field":if(t>=s.min[0]&&t<=s.max[0]&&e>=s.min[1]&&e<=s.max[1])return s.material;break;case"path":{const r=s.width/2;for(let o=0;o+1<s.through.length;o++){const a=s.through[o],c=s.through[o+1];if($2(t,e,a[0],a[1],c[0],c[1])<=r)return s.material}break}}}return null}function Z2(i,t){let e=Math.round(i/1.2)*374761393+Math.round(t/1.2)*668265263|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function zs(i){const t=i<0?0:i>1?1:i;return t*t*t*(t*(t*6-15)+10)}function K2(i,t,e,n,s,r){const o=s-e,a=r-n,c=o*o+a*a,l=c===0?0:Math.max(0,Math.min(1,((i-e)*o+(t-n)*a)/c));return Math.hypot(i-(e+o*l),t-(n+a*l))}class j2{size;resolution;landforms;patches;detail;rockAngle;base;constructor(t){this.size=t.size,this.resolution=t.resolution,this.landforms=t.landforms,this.patches=t.patches??[],this.detail=t.detail??[],this.rockAngle=t.rockAngle??34,this.base=t.base??"turf"}heightAt(t,e){let n=0;for(const s of this.landforms)switch(s.kind){case"terrace":break;case"hill":{const r=Math.hypot(t-s.at[0],e-s.at[1]),o=zs(1-r/s.radius);n+=s.height*(s.falloff?o**s.falloff:o);break}case"ridge":{const r=K2(t,e,s.from[0],s.from[1],s.to[0],s.to[1]);n+=s.height*zs(1-r/s.width);break}case"basin":{const r=Math.hypot(t-s.at[0],e-s.at[1]);n-=s.depth*zs(1-r/s.radius);break}case"rim":{const o=this.size/2-Math.max(Math.abs(t),Math.abs(e));n+=s.height*zs(1-o/s.inset);break}}for(const s of this.landforms){if(s.kind!=="terrace")continue;const r=Math.hypot(t-s.at[0],e-s.at[1]);if(r>=s.radius+s.blend)continue;const o=r<=s.radius?1:zs((s.radius+s.blend-r)/s.blend);n=n*(1-o)+s.height*o}return n}get detailRegions(){return this.detail}slopeAt(t,e,n=this.resolution){const s=(this.heightAt(t+n,e)-this.heightAt(t-n,e))/(2*n),r=(this.heightAt(t,e+n)-this.heightAt(t,e-n))/(2*n);return Math.atan(Math.hypot(s,r))*180/Math.PI}build(){const t=Math.round(this.size/this.resolution),e=this.size/2,n=this.resolution,s=new Uint8Array(t*t);for(let _=0;_<t;_++)for(let y=0;y<t;y++){const x=-e+(y+.5)*n,b=-e+(_+.5)*n;let S=1;for(const E of this.detail)Math.hypot(x-E.at[0],b-E.at[1])<=E.radius&&(S=Math.max(S,E.level));s[_*t+y]=S}const r=(_,y)=>_<0||y<0||_>=t||y>=t?1:s[_*t+y],o=[],a=[],c=[],l=new C,h=new C,u=new C,f=new C,d=new C,m=new C,v=new Vt,g=(_,y)=>{o.push(_.x,_.y,_.z),a.push(y.x,y.y,y.z),c.push(v.r,v.g,v.b)};for(let _=0;_<t;_++)for(let y=0;y<t;y++){const x=s[_*t+y],b=-e+y*n,S=-e+_*n,E=r(_,y-1),T=r(_,y+1),M=r(_-1,y),w=r(_+1,y),A=(N,L)=>N===0&&E<x?this.alongEdge(b,S,b,S+n,L,E):N===1&&T<x?this.alongEdge(b+n,S,b+n,S+n,L,T):L===0&&M<x?this.alongEdge(b,S,b+n,S,N,M):L===1&&w<x?this.alongEdge(b,S+n,b+n,S+n,N,w):this.heightAt(b+N*n,S+L*n);for(let N=0;N<x;N++)for(let L=0;L<x;L++){const U=L/x,F=(L+1)/x,D=N/x,H=(N+1)/x,k=[[b+U*n,A(U,D),S+D*n],[b+U*n,A(U,H),S+H*n],[b+F*n,A(F,H),S+H*n],[b+F*n,A(F,D),S+D*n]];for(const[Y,rt,ft]of[[0,1,2],[0,2,3]])l.set(...k[Y]),h.set(...k[rt]),u.set(...k[ft]),f.subVectors(h,l),d.subVectors(u,l),m.crossVectors(f,d).normalize(),m.y<0&&m.negate(),v.set(this.faceColor(m.y,(l.y+h.y+u.y)/3,(l.x+h.x+u.x)/3,(l.z+h.z+u.z)/3)),g(l,m),g(h,m),g(u,m)}}const p=new Pe;return p.setAttribute("position",new se(o,3)),p.setAttribute("normal",new se(a,3)),p.setAttribute("color",new se(c,3)),p.setAttribute(tp,new se(new Float32Array(o.length/3),1)),Dt(p,"terrain",0)}alongEdge(t,e,n,s,r,o){const a=1/o,l=Math.min(o-1,Math.floor(r/a))*a,h=l+a,u=this.heightAt(t+(n-t)*l,e+(s-e)*l),f=this.heightAt(t+(n-t)*h,e+(s-e)*h);return u+(f-u)*((r-l)/a)}materialAt(t,e){return this.slopeAt(t,e)>this.rockAngle?"rock":Bd(this.patches,t,e)??this.base}stepAt(t,e){return kd[this.materialAt(t,e)].step}faceColor(t,e,n,s){const o=Math.acos(Math.min(1,Math.max(-1,t)))*180/Math.PI>this.rockAngle?"rock":Bd(this.patches,n,s)??this.base,a=kd[o],c=1+(Z2(n,s)-.5)*a.variation*2,l=1-Math.min(Math.max(e/55,0),1)*.16;return B(a.color,c*l)}}const Hp={name:"small-grass-clump",category:"foliage",radius:.55,solid:!1,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.int(30,46);for(let o=0;o<s;o++){const a=e.range(.16,.6),c=new jt(e.range(.016,.032),a,3);c.translate(0,a/2,0),c.scale(1,1,e.range(.3,.55));const l=e.range(.1,.75)*(a/.6);c.rotateZ(e.chance(.5)?l:-l),c.rotateY(e.range(0,Math.PI*2));const h=e.range(0,Math.PI*2),u=Math.sqrt(e())*.26;c.translate(Math.cos(h)*u,0,Math.sin(h)*u),n.push({geometry:c,color:e.chance(.3)?z.GRASS_DRY:z.GRASS,sway:(f,d)=>Math.max(0,d/a)**1.5})}const r=At(n);return t!==1&&r.scale(t,t,t),Dt(r,"small-grass-clump",e()*Math.PI*2)}},Gp={name:"large-grass-clump",category:"foliage",radius:1.6,solid:!1,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(.7,.95),r=e.int(5,8),o=[];for(let h=0;h<r;h++){const u=h/r*Math.PI*2+e.range(-.5,.5),f=e.range(.25,.85)*s;o.push({x:Math.cos(u)*f,z:Math.sin(u)*f,grip:e.range(.24,.42)})}const a=e.int(430,620);for(let h=0;h<a;h++){let u,f,d=!1;if(e.chance(.5)){const p=o[e.int(0,o.length-1)],_=e.range(0,Math.PI*2),y=Math.sqrt(e())*p.grip;u=p.x+Math.cos(_)*y,f=p.z+Math.sin(_)*y,d=!0}else{const p=e.range(0,Math.PI*2),_=Math.sqrt(e())*s;u=Math.cos(p)*_,f=Math.sin(p)*_}const m=d?e.range(.3,.72):e.range(.1,.34),v=new jt(e.range(.014,.03),m,3);v.translate(0,m/2,0),v.scale(1,1,e.range(.3,.55));const g=e.range(.1,.8)*(m/.72);v.rotateZ(e.chance(.5)?g:-g),v.rotateY(e.range(0,Math.PI*2)),v.translate(u,0,f),n.push({geometry:v,color:e.chance(d?.2:.4)?z.GRASS_DRY:z.GRASS,sway:(p,_)=>Math.max(0,_/m)**1.5})}const c=e.int(14,26);for(let h=0;h<c;h++){const u=o[e.int(0,o.length-1)],f=e.range(0,Math.PI*2),d=Math.sqrt(e())*(e.chance(.7)?u.grip*1.4:s),m=(e.chance(.7)?u.x:0)+Math.cos(f)*d,v=(e.chance(.7)?u.z:0)+Math.sin(f)*d,g=e.range(.6,1.05),p=e.range(.05,.34),_=e.range(0,Math.PI*2),y=Math.cos(_)*p,x=Math.sin(_)*p,b=new K(.0035,.006,g,4);b.translate(0,g/2,0),b.rotateX(y),b.rotateZ(x),b.translate(m,0,v),n.push({geometry:b,color:B(z.GRASS_DRY,e.range(.9,1.1)),sway:(T,M)=>Math.max(0,M/g)**1.3}),uo.set(0,g,0).applyAxisAngle(J2,y).applyAxisAngle(Q2,x);const S=e.int(3,6),E=g*e.range(.14,.24);for(let T=0;T<S;T++){const M=T/S,w=.011*(1-M*.4),A=new jt(w,w*e.range(3,4.5),3);A.translate(0,w*1.8,0),A.scale(1,1,.6),A.rotateZ(e.range(.5,1.1)),A.rotateY(T/S*Math.PI*2+e.range(0,.6)),A.translate(m+uo.x,uo.y-E*M,v+uo.z),n.push({geometry:A,color:B(e.chance(.4)?10260316:z.GRASS_DRY,e.range(.9,1.12)),sway:1})}}const l=At(n);return t!==1&&l.scale(t,t,t),Dt(l,"large-grass-clump",e()*Math.PI*2)}},J2=new C(1,0,0),Q2=new C(0,0,1),uo=new C,Vp={name:"mushroom",category:"foliage",radius:.4,solid:!1,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.chance(.42)?"button":e.chance(.55)?"open":"puffball",r=e.pick([z.RUST,z.EARTH,z.STONE_PALE,z.BARK_PALE,9058862,12100712]),o=e.chance(.5)?z.CLOTH:14209212,a=s==="puffball"?e.int(4,9):e.int(3,7);for(let l=0;l<a;l++){const h=e(),u=e.range(.045,.13)*(.5+h*.75),f=e.range(0,Math.PI*2),d=Math.sqrt(e())*.22,m=Math.cos(f)*d,v=Math.sin(f)*d;if(s==="puffball"){const x=u*e.range(.5,.9),b=new K(u*.62,u*.4,x,6);b.translate(m,x/2,v),n.push({geometry:b,color:B(o,.9),sway:0});const S=new ee(u*1.15,1);S.scale(1,e.range(.78,.95),1),S.translate(m,x+u*.72,v),n.push({geometry:S,color:B(o,e.range(.92,1.1)),sway:0});continue}const g=e.around(0,.2),p=u*e.range(1.1,2.4),_=u*e.range(.24,.36),y=new K(_*.86,_*1.2,p,6);if(y.translate(0,p/2,0),y.rotateZ(g),y.translate(m,0,v),n.push({geometry:y,color:B(o,e.range(.94,1.06)),sway:0}),s==="button"){const x=u*(.8+h*.5),b=u*(1.35-h*.6),S=new jt(x,b,e.int(7,9));S.translate(0,b*.34,0),S.rotateZ(g),S.translate(m,p,v),n.push({geometry:S,color:r,sway:0})}else{const x=u*(1.3+h*.7),b=new K(x*.55,x,u*.2,9);b.rotateZ(g),b.translate(m,p+u*.08,v),n.push({geometry:b,color:r,sway:0});const S=new K(x*1.04,x*.9,u*.13,9);S.rotateZ(g),S.translate(m,p+u*.2,v),n.push({geometry:S,color:B(r,1.14),sway:0});const E=new K(x*.86,x*.5,u*.1,9);E.rotateZ(g),E.translate(m,p-u*.02,v),n.push({geometry:E,color:B(o,.88),sway:0})}}const c=At(n);return t!==1&&c.scale(t,t,t),Dt(c,"mushroom",0)}},Wp={name:"rock",category:"nature",radius:.9,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=e.range(.35,1.1),s=new ee(n,n>.7?1:0);s.deleteAttribute("normal"),s.deleteAttribute("uv");const r=ah(s);s.dispose();const o=r.getAttribute("position"),a=new C;for(let h=0;h<o.count;h++)a.fromBufferAttribute(o,h),a.multiplyScalar(e.range(.72,1.28)),o.setXYZ(h,a.x,a.y,a.z);o.needsUpdate=!0,r.scale(1,e.range(.6,.85),e.range(.85,1.15)),r.translate(0,n*e.range(.28,.45),0),r.computeVertexNormals();const c=[{geometry:r,color:e.chance(.3)?z.STONE_DARK:z.STONE,sway:0}],l=At(c);return t!==1&&l.scale(t,t,t),Dt(l,"rock",0)}};function tb(i,t){const e=new ee(t,0);e.deleteAttribute("normal"),e.deleteAttribute("uv");const n=ah(e);e.dispose();const s=n.getAttribute("position"),r=new C;for(let o=0;o<s.count;o++)r.fromBufferAttribute(s,o),r.multiplyScalar(i.range(.78,1.2)),s.setXYZ(o,r.x,r.y,r.z);return s.needsUpdate=!0,n.scale(1,i.range(.45,.7),i.range(.85,1.1)),n.computeVertexNormals(),n}const Xp={name:"cairn",category:"nature",radius:.7,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.int(4,7);let r=e.range(.26,.38),o=0;for(let c=0;c<s;c++){const l=tb(e,r);l.computeBoundingBox();const h=l.boundingBox,u=h?(h.max.y-h.min.y)/2:r*.5;l.rotateY(e.range(0,Math.PI*2)),o+=u*(c===0?1:1.55),l.translate(e.around(0,r*.14),o,e.around(0,r*.14)),n.push({geometry:l,color:e.chance(.35)?z.STONE_DARK:z.STONE,sway:0}),r*=e.range(.76,.9)}const a=At(n);return t!==1&&a.scale(t,t,t),Dt(a,"cairn",0)}},qp={name:"stump",category:"foliage",radius:.75,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(.3,.7),r=e.range(.22,.36),o=r*e.range(1.25,1.6),a=e.int(6,9),c=e.range(0,.12),l=new K(r,o,s,a);l.translate(0,s/2,0),l.rotateZ(c),n.push({geometry:l,color:z.BARK,sway:0});const h=new K(r*.94,r*.94,.04,a);h.translate(0,s,0),h.rotateZ(c),n.push({geometry:h,color:z.BARK_PALE,sway:0});const u=e.int(3,6);for(let d=0;d<u;d++){const m=e.range(.3,.6),v=new K(.04,.11,m,4);v.translate(0,-m/2,0),v.rotateZ(e.range(1.05,1.45)),v.rotateY(d/u*Math.PI*2+e.around(0,.5)),v.translate(0,e.range(.05,.16),0),n.push({geometry:v,color:z.BARK,sway:0})}const f=At(n);return t!==1&&f.scale(t,t,t),Dt(f,"stump",0)}},Yp={name:"fence",category:"structures",radius:2.4,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.int(3,5),r=e.range(1.1,1.6),o=e.range(.85,1.25),a=e.int(2,3),c=s*r;for(let h=0;h<=s;h++){const u=h*r-c/2,f=e.around(0,.09),d=o*e.range(.85,1.1),m=new V(.11,d,.11);m.translate(0,d/2,0),m.rotateZ(f),m.rotateY(e.around(0,.25)),m.translate(u,0,e.around(0,.06)),n.push({geometry:m,color:z.TIMBER,sway:0})}for(let h=0;h<s;h++){if(e.chance(.22))continue;const u=h*r-c/2+r/2;for(let f=0;f<a;f++){const d=o*(.32+f/Math.max(a-1,1)*.52),m=new V(r*1.02,.07,.05);m.rotateZ(e.around(0,.05)),m.translate(u,d+e.around(0,.03),e.around(0,.03)),n.push({geometry:m,color:z.TIMBER_DARK,sway:0})}}const l=At(n);return l.rotateY(e.range(0,Math.PI)),t!==1&&l.scale(t,t,t),Dt(l,"fence",0)}},$p={name:"post",category:"structures",radius:.4,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(.9,2.1),r=e.range(.07,.13),o=e.range(.02,.16),a=e.range(0,Math.PI*2),c=new V(r*2,s,r*2);if(c.translate(0,s/2,0),c.rotateZ(o),c.rotateY(a),n.push({geometry:c,color:z.TIMBER,sway:0}),e.chance(.4)){const h=e.range(.5,1.1),u=new V(h,r*1.4,r*1.4);u.translate(0,s*e.range(.6,.85),0),u.rotateZ(o),u.rotateY(a+e.around(0,.3)),n.push({geometry:u,color:z.TIMBER_DARK,sway:0})}if(e.chance(.45)){const h=new V(r*2.5,.09,r*2.5);h.translate(0,s-.09,0),h.rotateZ(o),h.rotateY(a),n.push({geometry:h,color:z.RUST,sway:0})}const l=At(n);return t!==1&&l.scale(t,t,t),Dt(l,"post",0)}},Zp={name:"trough",category:"objects",radius:1.1,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(1.4,2.1),r=e.range(.5,.75),o=e.range(.4,.6),a=e.range(.09,.14),c=e.chance(.55),l=c?z.STONE:z.TIMBER,h=new V(s,a,r);h.translate(0,a/2,0),n.push({geometry:h,color:c?z.STONE_DARK:z.TIMBER_DARK,sway:0});for(const f of[-1,1]){const d=new V(s*.99,o,a);d.translate(0,o/2,f*(r-a)/2),n.push({geometry:d,color:l,sway:0});const m=new V(a,o*.985,r*.985);m.translate(f*(s-a)/2,o/2,0),n.push({geometry:m,color:l,sway:0})}if(e.chance(.6)){const f=new V(s-a*2,.03,r-a*2);f.translate(0,o*e.range(.55,.78),0),n.push({geometry:f,color:2899782,sway:0})}const u=At(n);return u.rotateY(e.range(0,Math.PI)),t!==1&&u.scale(t,t,t),Dt(u,"trough",0)}};function zo(i,t,e,n,s){const r=new ee(t,e);r.deleteAttribute("normal"),r.deleteAttribute("uv");const o=ah(r);r.dispose();const a=o.getAttribute("position"),c=new C;for(let l=0;l<a.count;l++)c.fromBufferAttribute(a,l),c.multiplyScalar(i.range(n,s)),a.setXYZ(l,c.x,c.y,c.z);return a.needsUpdate=!0,o.computeVertexNormals(),o}function ji(i,t){return i.range(t[0],t[1])}function eb(i,t,e,n,s){const r=e.range(0,100),o=e.range(0,100),a=e.range(0,100),c=(h,u,f)=>{let d=Math.imul(Math.round(h)*374761393+Math.round(u)*668265263,1);return d=Math.imul(d^d>>>13,1274126177)+Math.round(f)*951274213,d^=d>>>16,(d>>>0)%1e3/1e3},l=(h,u,f)=>{const d=Math.floor(h),m=Math.floor(u),v=Math.floor(f),g=fc(h-d),p=fc(u-m),_=fc(f-v);let y=0;for(let x=0;x<=1;x++)for(let b=0;b<=1;b++)for(let S=0;S<=1;S++){const E=(S?g:1-g)*(b?p:1-p)*(x?_:1-_);y+=c(d+S,m+b,v+x)*E}return y};return(h,u,f)=>l(h*n+r,u*n+o,f*n+a)<s?t:i}function fc(i){return i*i*(3-2*i)}function mr(i,t,e,{scale:n=1}){const s=[],r=ji(e,t.length),o=ji(e,t.girth),a=ji(e,t.legLength),c=o*e.range(.62,.78),l=e.pick(t.hide),h=a+o/2,u=t.woolly||r>1.2?1:0,f=t.woolly?zo(e,o/2,u,.86,1.24):new ee(o/2,u);f.scale(c/o,1,r/o),f.rotateZ(e.around(0,.05)),f.translate(0,h,0);const d=t.woolly?nb:t.patch?eb(l,e.pick(t.patch),e,2.6/o,t.patchCoverage??.45):l;s.push({geometry:f,color:d,sway:0});const m=ji(e,t.neck),v=ji(e,t.neckRise),g=new C(0,h+o*.18,r*.4),p=o*.45,_=m+p,y=new K(o*.17,o*.24,_,6);y.translate(0,_/2-p,0),y.rotateX(Math.PI/2-v),y.translate(g.x,g.y,g.z),s.push({geometry:y,color:d,sway:0});const x=new C(0,g.y+Math.sin(v)*m,g.z+Math.cos(v)*m),b=ji(e,t.headSize);if(t.head)s.push(...t.head({at:x,size:b,coat:d,extremity:t.extremity,rng:e}));else{const E=new ee(b,0);if(E.scale(.85,.9,t.headStretch),E.rotateY(e.around(0,.2)),E.translate(x.x,x.y,x.z),s.push({geometry:E,color:d,sway:0}),t.snout>0){const T=new K(b*t.snout*.52,b*t.snout*.66,b*.62,6);T.rotateX(Math.PI/2),T.translate(x.x,x.y-b*.13,x.z+b*t.headStretch*.66),s.push({geometry:T,color:t.extremity,sway:0})}}for(const E of[-1,1]){if(!t.head&&t.ears!=="none"){const T=new jt(b*.28,b*.85,4);T.translate(0,b*.42,0),t.ears==="floppy"?T.rotateZ(E*2.4):t.ears==="side"?T.rotateZ(E*1.5):T.rotateZ(E*.35),T.translate(x.x+E*b*.6,x.y+b*.4,x.z),s.push({geometry:T,color:t.extremity,sway:0})}if(t.horns!=="none"){const T=b*(t.horns==="curved"?1.5:.7),M=new jt(b*.16,T,5);M.translate(0,T/2,0),M.rotateZ(E*(t.horns==="curved"?1.1:.5)),M.translate(x.x+E*b*.45,x.y+b*.55,x.z),s.push({geometry:M,color:Hd,sway:0})}for(const T of[-1,1]){const M=h,w=new K(t.legThickness*.78,t.legThickness,M,5);if(w.translate(0,M/2,0),w.rotateZ(E*e.range(-.02,.07)),w.translate(E*c*.34,0,T*r*e.range(.26,.34)),s.push({geometry:w,color:l,sway:0}),t.feet==="paw"){const A=new V(t.legThickness*2.4,a*.11,t.legThickness*3.6);A.translate(E*c*.34,a*.055,T*r*.3+t.legThickness*.9),s.push({geometry:A,color:t.extremity,sway:0})}else{const A=new K(t.legThickness*1.15,t.legThickness*1.05,a*.13,5);A.translate(E*c*.34,a*.06,T*r*.3),s.push({geometry:A,color:ib,sway:0})}}}if(t.tail!=="none"){const E=new C(0,h+o*.16,-r*.42);if(t.tail==="carried"){const w=r*e.range(.16,.6)/4;let A=-e.range(.7,1),N=E.x,L=E.y,U=E.z;for(let F=0;F<4;F++){const D=o*.075*(1-F/5),H=new K(D*.7,D,w*1.15,4);H.translate(0,w/2,0),H.rotateX(A),H.translate(N,L,U),s.push({geometry:H,color:l,sway:pc}),L+=w*Math.cos(A),U+=w*Math.sin(A),A+=e.range(.15,.35)}}else if(t.tail==="curl"){const M=o*.06;for(let w=0;w<9;w++){const A=w/8,N=A*Math.PI*2.2,L=new ee(M*(1-A*.25),0);L.translate(Math.sin(N)*o*.1,E.y+A*o*.2,E.z-o*.04-(1-Math.cos(N))*o*.05),s.push({geometry:L,color:t.extremity,sway:0})}}else{const T=r*(t.tail==="flowing"?.4:.3),M=e.range(.08,.42),w=new K(o*.07,o*.028,T,4);w.translate(0,-T/2,0),w.rotateX(M),w.translate(E.x,E.y,E.z),s.push({geometry:w,color:l,sway:pc});const A=T*.94,N=new ee(o*.115,0);N.scale(.75,t.tail==="flowing"?1.7:1.05,.75),N.rotateX(M),N.translate(E.x,E.y-A*Math.cos(M),E.z-A*Math.sin(M)),s.push({geometry:N,color:Hd,sway:pc})}}const S=At(s);return S.rotateY(e.range(0,Math.PI*2)),n!==1&&S.scale(n,n,n),Dt(S,i,e()*Math.PI*2)}const nb=12433060,Hd=9076841,ib=3814187,pc=.4,sb={length:[1.9,2.3],girth:[.85,1.05],legLength:[.62,.78],legThickness:.085,neck:[.4,.55],neckRise:[.05,.3],headSize:[.24,.3],headStretch:1.5,snout:.38,ears:"side",horns:"stub",tail:"switch",woolly:!1,hide:[z.WOOL,z.STONE_PALE],extremity:z.HOG,patch:[z.COW_BLACK,z.COW_BLACK,z.HIDE_DARK],patchCoverage:.46},Kp={name:"bovine",category:"animals",radius:1.4,build:(i={})=>mr("bovine",sb,Rt(i.seed??1),i)},rb={length:[.95,1.25],girth:[.55,.7],legLength:[.34,.46],legThickness:.045,neck:[.18,.28],neckRise:[.2,.5],headSize:[.13,.17],headStretch:1.4,snout:.32,ears:"side",horns:"none",tail:"switch",woolly:!0,hide:[z.HIDE_DARK,z.STONE_DARK],extremity:z.HIDE_DARK},jp={name:"ovine",category:"animals",radius:.8,build:(i={})=>mr("ovine",rb,Rt(i.seed??1),i)},ob={length:[1.9,2.2],girth:[.75,.9],legLength:[.95,1.15],legThickness:.07,neck:[.6,.8],neckRise:[.75,1.05],headSize:[.2,.25],headStretch:1.9,snout:.3,ears:"perked",horns:"none",tail:"flowing",woolly:!1,hide:[z.HIDE_DARK,z.HIDE,z.BARK],extremity:z.HIDE_DARK},Jp={name:"equine",category:"animals",radius:1.4,build:(i={})=>mr("equine",ob,Rt(i.seed??1),i)},ab={length:[1.1,1.5],girth:[.6,.78],legLength:[.25,.36],legThickness:.055,neck:[.1,.2],neckRise:[0,.2],headSize:[.19,.24],headStretch:1.45,snout:.75,ears:"floppy",horns:"none",tail:"curl",woolly:!1,hide:[z.HOG,z.HIDE_PALE,z.HIDE_DARK],extremity:z.HOG,patch:[z.HIDE_DARK,z.HIDE],patchCoverage:.3},Qp={name:"porcine",category:"animals",radius:.95,build:(i={})=>mr("porcine",ab,Rt(i.seed??1),i)},t0={name:"poultry",category:"animals",radius:.35,solid:!1,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(.16,.23),r=e.range(.09,.16),o=e.pick([z.FOWL,z.HIDE_PALE,z.HIDE_DARK,z.CLOTH]),a=r+s*.75,c=new ee(s,0);c.scale(.8,.95,1.25),c.rotateX(e.range(.15,.35)),c.translate(0,a,0),n.push({geometry:c,color:o,sway:0});const l=s*e.range(.42,.55),h=new C(0,a+s*e.range(.75,1.05),s*.6),u=new K(s*.2,s*.28,s*.55,5);u.rotateX(-.5),u.translate(0,a+s*.5,s*.42),n.push({geometry:u,color:o,sway:0});const f=new ee(l,0);f.translate(h.x,h.y,h.z),n.push({geometry:f,color:o,sway:0});const d=new jt(l*.35,l*.8,4);d.rotateX(Math.PI/2),d.translate(h.x,h.y-l*.15,h.z+l*.9),n.push({geometry:d,color:z.MARKER_YELLOW,sway:0});const m=e.int(2,4);for(let p=0;p<m;p++){const _=p/Math.max(m-1,1),y=new jt(l*.14,l*(.7-_*.3),3);y.scale(1,1,.4),y.translate(h.x,h.y+l*.95,h.z-_*l*.7),n.push({geometry:y,color:z.COMB,sway:.4})}if(e.chance(.6)){const p=new ee(l*.22,0);p.scale(.5,1.1,.7),p.translate(h.x,h.y-l*.75,h.z+l*.5),n.push({geometry:p,color:z.COMB,sway:.3})}const v=e.int(3,5);for(let p=0;p<v;p++){const _=(p/Math.max(v-1,1)-.5)*.8,y=new jt(s*.2,s*e.range(.9,1.4),3);y.scale(1,1,.35),y.translate(0,s*.55,0),y.rotateX(e.range(-1.1,-.7)),y.rotateY(_),y.translate(0,a+s*.35,-s*.85),n.push({geometry:y,color:o,sway:.45})}for(const p of[-1,1]){const _=a,y=new K(s*.055,s*.05,_,4);y.translate(0,_/2,0),y.rotateZ(p*e.range(0,.12)),y.translate(p*s*.24,0,e.around(0,s*.1)),n.push({geometry:y,color:z.MARKER_YELLOW,sway:0});const x=new jt(s*.13,s*.09,3);x.rotateX(Math.PI),x.translate(p*s*.24,s*.04,s*.06),n.push({geometry:x,color:z.MARKER_YELLOW,sway:0})}const g=At(n);return g.rotateY(e.range(0,Math.PI*2)),t!==1&&g.scale(t,t,t),Dt(g,"poultry",e()*Math.PI*2)}},e0={name:"archway",category:"structures",radius:1.8,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(1.5,1.9),r=e.range(2.6,3.1),o=e.range(.42,.58),a=e.range(.5,.7),c=e.chance(.5)?z.STONE:z.STONE_DARK;for(const u of[-1,1]){const f=e.int(3,4),d=r/f;for(let m=0;m<f;m++){const v=1-m/f*.12,g=new V(o*v,d*1.02,a*v);g.translate(u*(s+o)/2+e.around(0,.02),d*(m+.5),e.around(0,.02)),n.push({geometry:g,color:B(c,e.around(1,.08)),sway:0})}}const l=new V(s+o*2.5,e.range(.34,.46),a*1.1);if(l.translate(0,r+.18,0),n.push({geometry:l,color:B(c,.92),sway:0}),e.chance(.55)){const u=new V(s+o*1.6,.18,a*.8);u.translate(e.around(0,.06),r+.48,0),n.push({geometry:u,color:B(c,1.08),sway:0})}const h=At(n);return t!==1&&h.scale(t,t,t),Dt(h,"archway",0)}},cb=4.5,lb=11,hb=16747068,ub=.86,n0={name:"forge",category:"structures",radius:1.3,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=[],r=e.range(.85,1.8),o=e.range(.7,1.25),a=e.range(.62,.92),c=e.range(.3,1),l=B(z.IRON,e.range(.85,1.05)),h=B(e.chance(.5)?8014392:7029814,e.range(.9,1.1)),u=2762532,f=e.int(2,4);for(let F=0;F<f;F++){const D=a/f,H=new V(r*(1-F*.015),D,o*(1-F*.015));H.translate(0,D*(F+.5),0),n.push({geometry:H,color:B(h,e.range(.9,1.12)),sway:0})}const d=new V(r*1.02,.06,o*1.02);d.translate(0,a+.03,0),n.push({geometry:d,color:u,sway:0});const m=.1;for(const[F,D,H,k]of[[r*1.02,m,0,-o/2],[m,o*1.02,-r/2,0],[m,o*1.02,r/2,0]]){const Y=new V(F,m*1.6,D);Y.translate(H,a+m*.8,k),n.push({geometry:Y,color:B(h,.86),sway:0})}const v=e.int(5,9);for(let F=0;F<v;F++){const D=e.range(0,Math.PI*2),H=Math.sqrt(e())*r*.22,k=e.range(.035,.075),Y=new ee(k,0);Y.rotateY(e.range(0,Math.PI)),Y.translate(Math.cos(D)*H,a+.06+k*.5,Math.sin(D)*H),n.push({geometry:Y,color:e.chance(c*.45)?10239780:B(u,e.range(.85,1.3)),sway:0})}const g=a+.09,p=new bn(r*.2*(.6+c*.6),0);p.scale(1,.32,.8),p.translate(0,g,0),s.push({geometry:p,color:hb,sway:0});const _=new bn(r*.09,0);_.scale(1,.5,1),_.translate(e.around(0,.05),g+.02,e.around(0,.05)),s.push({geometry:_,color:16765066,sway:0});const y=a+e.range(.6,1.15),x=y+e.range(.65,1.3),b=r*e.range(.62,.75),S=e.range(.16,.22),E=.03,T=new Li([new et(b,y),new et(S,x),new et(S-E,x),new et(b-E,y),new et(b,y)],6);T.rotateY(Math.PI/6),n.push({geometry:T,color:B(l,.92),sway:0});const M=new K(b*1.05,b*1.05,E*2.2,6);M.rotateY(Math.PI/6),M.translate(0,y+E,0),n.push({geometry:M,color:B(l,1.1),sway:0});const w=new K(S*.94,S*.94,2.4,6);w.translate(0,x+1.2,0),n.push({geometry:w,color:B(l,.86),sway:0});for(const F of[-1,1]){const D=new V(.06,y-a,.06);D.translate(F*r/2*.86,a+(y-a)/2,-o*.36),n.push({geometry:D,color:l,sway:0})}const A=At(n),N=At(s);t!==1&&(A.scale(t,t,t),N.scale(t,t,t));const L=Dt(A,"forge",0);L.add(dr(N,"forge:glow"));const U=new Jo(16749632,cb*(.35+c*.9)*e.around(1,.1)*t*t,lb*t,1.35);return U.position.set(0,(g+.1)*t,0),U.castShadow=!1,L.add(U),L}},i0={name:"anvil",category:"objects",radius:.5,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(.42,.56),r=e.range(.2,.26),o=e.range(.44,.58),a=e.range(.12,.16),c=B(z.IRON,e.range(.88,1.06)),l=new K(r,r*1.12,s,8);l.translate(0,s/2,0),n.push({geometry:l,color:z.TIMBER_DARK,sway:0});const h=e.range(.055,.08),u=new V(o*.62,h,a*1.5);u.translate(0,s+h/2,0),n.push({geometry:u,color:B(c,.88),sway:0});const f=e.range(.1,.15),d=new V(o*.34,f,a*.78);d.translate(0,s+h+f/2,0),n.push({geometry:d,color:B(c,.94),sway:0});const m=e.range(.09,.13),v=s+h+f,g=new V(o,m,a);g.translate(0,v+m/2,0),n.push({geometry:g,color:(b,S)=>S>v+m*.85?B(c,1.22):c,sway:0});const p=e.range(.16,.24),_=new jt(a*.46,p,6);_.rotateZ(-Math.PI/2),_.translate(o/2+p/2-.01,v+m*.55,0),n.push({geometry:_,color:B(c,1.06),sway:0});const y=new V(e.range(.07,.11),m*.86,a*.92);y.translate(-o/2-.03,v+m*.5,0),n.push({geometry:y,color:B(c,.98),sway:0});const x=At(n);return x.rotateY(e.range(0,Math.PI*2)),t!==1&&x.scale(t,t,t),Dt(x,"anvil",0)}},db=.78,fb=[[.3,0],[.275,.05],[.225,.14],[.195,.25],[.178,.36],[.172,.44],[.125,.51],[.062,.56],[.045,.56],[.05,.5],[.092,.43],[.122,.35],[.146,.25],[.175,.14],[.222,.05],[.258,0],[.3,0]],s0={name:"bell",category:"objects",radius:.75,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(.85,1.25),r=.56*s,o=.3*s,a=r+e.range(.55,.85),c=e.range(.09,.12),l=o*2+e.range(.28,.44);for(const x of[-1,1]){const b=new V(c,a,c*.92);b.translate(0,a/2,0),b.rotateZ(x*-.055),b.translate(x*l/2,0,0),n.push({geometry:b,color:z.TIMBER,sway:0});const S=new V(c*.62,l*.42,c*.6);S.translate(0,l*.21,0),S.rotateZ(x*.72),S.translate(x*l/2,a-l*.3,0),n.push({geometry:S,color:z.TIMBER_DARK,sway:0})}const h=new V(l+c*2.4,c,c);h.translate(0,a-c/2,0),n.push({geometry:h,color:z.TIMBER,sway:0});const f=a-c-r-e.range(.05,.1),d=fb.map(([x,b])=>new et(x*s,b*s)),m=new Li(d,10);m.translate(0,f,0);const v=B(z.BRONZE,e.range(.9,1.1)),g=f+r*e.range(.42,.62);n.push({geometry:m,color:(x,b)=>b>g?z.PATINA:v,sway:0});const p=new V(.055*s,.12*s,.055*s);p.translate(0,f+r+.05*s,0),n.push({geometry:p,color:B(v,.85),sway:0});const _=new ee(.055*s,0);_.translate(e.around(0,.02),f+.09*s,e.around(0,.02)),n.push({geometry:_,color:z.IRON_DARK,sway:0});const y=At(n);return y.rotateY(e.range(0,Math.PI*2)),t!==1&&y.scale(t,t,t),Dt(y,"bell",0)}},pb=.72;function mb({at:i,size:t,coat:e,extremity:n,rng:s}){const r=[],o=t*1.45,a=new K(t*.62,t*.78,t*1.5,4);a.rotateX(Math.PI/2),a.rotateZ(Math.PI/4),a.scale(o/(t*1.1),t*1.15/(t*1.1),1),a.translate(i.x,i.y,i.z-t*.15),r.push({geometry:a,color:e,sway:0});const c=t*s.range(.45,1.05),l=i.y-t*.34,h=i.z+t*.6,u=new K(t*.3,t*.46,c,4);u.rotateX(Math.PI/2),u.rotateZ(Math.PI/4),u.scale(1,.78,1),u.translate(i.x,l,h+c/2),r.push({geometry:u,color:e,sway:0});const f=new V(t*.52,t*.26,c*.8);f.translate(i.x,l-t*.28,h+c*.44),r.push({geometry:f,color:n,sway:0});const d=new V(t*.36,t*.3,t*.22);d.translate(i.x,l+t*.08,h+c+t*.05),r.push({geometry:d,color:2367260,sway:0});const m=new V(o*.82,t*.2,t*.28);m.translate(i.x,i.y+t*.22,h-t*.08),r.push({geometry:m,color:e,sway:0});const v=s.range(.75,1.05);for(const g of[-1,1]){const p=new jt(t*.34,t*v,3);p.translate(0,t*v/2,0),p.scale(1,1,.34),p.rotateZ(g*s.range(.16,.34)),p.rotateX(-s.range(.05,.22)),p.translate(i.x+g*o*.34,i.y+t*.4,i.z-t*.35),r.push({geometry:p,color:n,sway:0})}return r}const gb={length:[.5,.68],girth:[.19,.24],legLength:[.19,.38],legThickness:.026,feet:"paw",neck:[.15,.21],neckRise:[.6,1],headSize:[.1,.13],headStretch:1,snout:0,ears:"none",head:mb,horns:"none",tail:"carried",woolly:!1,hide:[z.HIDE,z.HIDE_DARK,z.HIDE_PALE,z.STONE_DARK],extremity:z.HIDE_DARK},r0={name:"dog",category:"animals",radius:.55,build:(i={})=>mr("dog",gb,Rt(i.seed??1),i)},fh="village",o0=96,Gd=o0/2,vb=[{kind:"basin",at:[0,0],radius:34,depth:3},{kind:"hill",at:[18,-12],radius:12,height:4.5,falloff:1.3},{kind:"hill",at:[20,8],radius:10,height:3.5,falloff:1.4},{kind:"hill",at:[8,20],radius:11,height:3,falloff:1.5},{kind:"terrace",at:[-6,1],radius:26,height:-3,blend:9},{kind:"terrace",at:[0,34],radius:6,height:-.4,blend:7},{kind:"rim",inset:13,height:14}],yb=[{kind:"field",min:[16,-6],max:[30,8],material:"crop"},{kind:"field",min:[-30,14],max:[-16,28],material:"meadow"},{kind:"blot",at:[-24,-6],radius:11,material:"meadow"},{kind:"path",through:[[0,34],[0,22],[0,15]],width:3,material:"dirt"},{kind:"path",through:[[4,2],[14,-2],[24,-2]],width:2.4,material:"dirt"},{kind:"path",through:[[-9,13],[0,8],[9,1]],width:2.2,material:"cobble"},{kind:"path",through:[[-2,17],[0,8],[1,-2]],width:2.2,material:"cobble"},{kind:"path",through:[[7,15],[0,8],[-7,0]],width:2.2,material:"cobble"},{kind:"path",through:[[11,8],[0,8],[-12,6]],width:2.2,material:"cobble"},{kind:"blot",at:[-16,-10],radius:7,material:"mire"}],oi=new j2({size:o0,resolution:3,landforms:vb,patches:yb,detail:[{at:[-6,1],radius:26,level:2},{at:[-6,1],radius:20,level:4},{at:[0,34],radius:5,level:3}]}),_b=oi,Ei=new C(0,0,34),ss={forge:[14.2,5.6],anvil:[13,3.8]},Tl=[-5.4,19.2],Al=[-8.5,4.5];function fo(i,t){return[i[0],oi.heightAt(i[0],i[1])+t,i[1]]}const xb={bed:[{model:"wind",id:"wind",options:{gain:.15,tone:3e3}},{model:"rain",id:"rain",options:{gain:.5,intensity:0,surface:"earth",articulation:.3}}],emitters:[{model:"foliage",id:"wood-north",at:[-26,4,-31],options:{density:260,tone:.78,gain:.4,articulation:.2},refDistance:3,maxDistance:24,rolloff:1.6,reverb:.3},{model:"foliage",id:"wood-east",at:[33,4,-9],options:{density:240,tone:.85,gain:.38,articulation:.22},refDistance:3,maxDistance:22,rolloff:1.6,reverb:.3},{model:"foliage",id:"hedge",at:[-11,1,14],options:{density:150,tone:1.5,gain:.24,articulation:.34},refDistance:1.4,maxDistance:13,reverb:.22},{model:"bird",id:"bird-west",at:[-24,6,4],options:{pitch:2500,interval:7,gain:.07,tone:2700},refDistance:5,maxDistance:46,rolloff:1.3,reverb:.9},{model:"bird",id:"bird-south",at:[17,5.5,34],options:{pitch:3100,interval:11,gain:.055,tone:3e3},refDistance:5,maxDistance:44,rolloff:1.35,reverb:.9},{model:"fire",id:"forge",at:fo(ss.forge,ub),options:{gain:.5,intensity:.85,tone:1.15,crackle:.65,draught:.12},refDistance:2,maxDistance:20,rolloff:1.5,reverb:.35},{model:"friction",id:"gate",at:[Ei.x+.9,1.7,Ei.z],options:{motion:"weather",speed:.22,force:.85,pitch:150,decay:1.1,bright:.2,roughness:.15,gain:.3},refDistance:3,maxDistance:40,rolloff:1.4,reverb:.5},{model:"crowd",id:"folk",at:[-3,1.4,16],options:{voices:5,density:.4,pitch:132,variety:.55,gain:.36,distance:1450},refDistance:5,maxDistance:30,rolloff:1.5,reverb:.6}],scatter:[{sound:"hammer",id:"smith",at:fo(ss.anvil,db),spread:[.7,.2,.7],every:13,force:[.45,1],options:{gain:.5,tone:.95,damping:.35,bounces:2},refDistance:3,maxDistance:52,rolloff:1.1,reverb:.55},{sound:"clatter",id:"yards",at:[0,1,8],spread:[13,.5,11],every:26,force:[.3,.85],options:{material:"wood",gain:.45,tone:1.05},refDistance:2.5,maxDistance:34,rolloff:1.25,reverb:.4},{sound:"animal",id:"cattle",at:[-16,1.1,-10],spread:[4,.2,4],every:44,force:[.5,.9],voices:1,options:{kind:"cow",gain:.55,tone:.97},refDistance:4,maxDistance:48,rolloff:1.1,reverb:.5},{sound:"animal",id:"sheep",at:[-16.5,.9,-11],spread:[5,.2,5],every:27,force:[.4,.85],voices:1,options:{kind:"sheep",gain:.42,tone:1.06},refDistance:3.5,maxDistance:40,rolloff:1.2,reverb:.45},{sound:"animal",id:"fowl",at:[-2,.7,6],spread:[8,.15,8],every:16,force:[.3,.7],voices:1,options:{kind:"fowl",gain:.3,tone:1},refDistance:2.5,maxDistance:26,rolloff:1.35,reverb:.35},{sound:"animal",id:"dog",at:fo(Al,.4),spread:[2.2,.2,2.2],every:36,force:[.45,1],voices:1,options:{kind:"dog",gain:.5,tone:.94},refDistance:4,maxDistance:50,rolloff:1.15,reverb:.55},{sound:"bell",id:"bell",at:fo(Tl,pb),spread:[0,0,0],every:95,rhythm:"periodic",force:[.8,1],voices:1,options:{hz:186,decay:12,gain:.34,strokes:2,interval:2.6,warble:1.1},refDistance:8,maxDistance:70,rolloff:.9,reverb:1}]};function wb(){return{id:fh,name:"Arkstin Village",environment:{...ta,fogNear:30,fogFar:190,footstepReverb:.5,soundscape:xb},spawn:{position:a0(0,28),yaw:Math.PI},floor:-20,surfaceAt:(i,t)=>oi.stepAt(i,t),groundAt:(i,t)=>oi.heightAt(i,t),build:bb}}function a0(i,t,e=0){return new C(i,oi.heightAt(i,t)+e,t)}function Ie(i,t,e,n,s,r=!0){t.position.copy(a0(e,n)),t.rotation.y=s,i.add(r?Se(t):t)}function Ke(i,t,e){const n=Rt(e.seed),[s,r]=e.from??[0,0],o=e.maxSlope??26,a=e.avoid??[],c=t.solid!==!1;for(let l=0;l<e.count;l++){const h=n.range(0,Math.PI*2),u=Math.sqrt(n())*e.within,f=s+Math.cos(h)*u,d=r+Math.sin(h)*u,m=n.range(0,Math.PI*2),v=e.scale?n.range(e.scale[0],e.scale[1]):1,g=n.int(1,1e6);if(Math.abs(f)>Gd-8||Math.abs(d)>Gd-8||oi.slopeAt(f,d)>o)continue;const p=oi.heightAt(f,d);if(e.minHeight!==void 0&&p<e.minHeight||e.maxHeight!==void 0&&p>e.maxHeight)continue;let _=!1;for(const[y,x,b]of a)if(Math.hypot(f-y,d-x)<b){_=!0;break}_||Ie(i,t.build({seed:g,scale:v}),f,d,m,c)}}const Ji=[[0,8,17],[0,24,10],[0,33,8],[-16,-10,9]],Mb=[[-9,13],[-2,17],[7,15],[11,8],[9,1],[1,-2],[-7,0],[-12,6]],Vd=[0,8];function bb(){const i=new ye;i.name="ArkstinVillage",i.add(Se(oi.build())),Ie(i,e0.build({seed:4714}),Ei.x,Ei.z,Math.PI),Mb.forEach(([t,e],n)=>{Ie(i,uh.build({seed:700+n*131}),t,e,Math.atan2(Vd[0]-t,Vd[1]-e))});for(let t=0;t<5;t++){const e=t/5*Math.PI*2;Ie(i,Yp.build({seed:400+t}),-16+Math.cos(e)*8,-10+Math.sin(e)*8,e)}return Ie(i,Zp.build({seed:91}),-13,-13,.4),Ke(i,Kp,{seed:8801,count:2,within:5,from:[-16,-10],maxSlope:20}),Ke(i,jp,{seed:8802,count:4,within:6,from:[-16,-10],maxSlope:20}),Ke(i,Qp,{seed:8803,count:2,within:5,from:[-17,-8],maxSlope:20}),Ke(i,t0,{seed:8804,count:6,within:9,from:[-2,6],maxSlope:18}),Ke(i,Jp,{seed:8805,count:2,within:6,from:[-24,4],maxSlope:18}),Ie(i,Oo.build({seed:2211}),4,11,.3),Ie(i,or.build({seed:2212}),6,12,1.1),Ie(i,ar.build({seed:2213}),-4,5,0),Ie(i,ar.build({seed:2214}),-5,6.5,.7),Ie(i,or.build({seed:2215}),9,5,.5),Ie(i,$p.build({seed:2216}),-2,11,0),Ie(i,n0.build({seed:5401}),ss.forge[0],ss.forge[1],Math.PI),Ie(i,i0.build({seed:5402}),ss.anvil[0],ss.anvil[1],.6),Ie(i,s0.build({seed:5403}),Tl[0],Tl[1],-.5),Ie(i,r0.build({seed:5404}),Al[0],Al[1],1.9,!1),Ie(i,Qs.build({seed:3301}),3,7,2.2),Ie(i,Qs.build({seed:3302}),-3,9,1.1),Ie(i,Qs.build({seed:3303}),6,3,-.8),Ke(i,ch,{seed:5001,count:130,within:42,maxSlope:30,maxHeight:9,avoid:Ji,scale:[.8,1.35]}),Ke(i,Do,{seed:5002,count:90,within:42,maxSlope:32,avoid:Ji}),Ke(i,Gp,{seed:5002,count:40,within:42,maxSlope:24,avoid:Ji}),Ke(i,Hp,{seed:5003,count:120,within:42,maxSlope:28,avoid:Ji}),Ke(i,Vp,{seed:5004,count:40,within:36,maxSlope:22,avoid:Ji}),Ke(i,qp,{seed:5005,count:16,within:36,maxSlope:24,avoid:Ji}),Ke(i,Wp,{seed:6001,count:70,within:45,maxSlope:44,minHeight:4,scale:[.7,1.6]}),Ke(i,Xp,{seed:6002,count:7,within:38,maxSlope:20,minHeight:5}),i}const Sb={name:"small-tree",category:"foliage",radius:1.1,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(1.6,2.8),r=e.range(.035,.06),o=r*e.range(.62,.78),a=s*e.range(.45,.6),c=e.chance(.4)?z.BARK_PALE:z.BARK,l=e.chance(.25)?z.LEAF_DRY:z.LEAF,h=s*e.range(.5,.65),u=e.range(.03,.13),f=e.range(0,Math.PI*2),d=new K(r*.8,r,h,5);d.translate(0,h/2,0),n.push({geometry:d,color:c,sway:js(0,s,2.2)});const m=new K(o,r*.82,s-h,5);m.translate(0,(s-h)/2,0),m.rotateX(Math.cos(f)*u),m.rotateZ(Math.sin(f)*u),m.translate(0,h,0),n.push({geometry:m,color:c,sway:js(0,s,2.2)});const v=Math.sin(Math.sin(f)*u)*(s-h),g=-Math.sin(Math.cos(f)*u)*(s-h),p=e.int(3,5);for(let x=0;x<p;x++){const b=x/p,S=a+(s-a)*b*e.range(.7,1),E=e.range(.28,.62)*(1-b*.4),T=e.range(0,Math.PI*2),M=e.range(.75,1.15),w=new K(r*.22,r*.4,E,4);w.translate(0,E/2,0),w.rotateZ(Math.PI/2-M),w.rotateY(T),w.translate(v*(S/s),S,g*(S/s)),n.push({geometry:w,color:c,sway:js(0,s,1.8)});const A=Math.cos(M)*E,N=v*(S/s)+Math.sin(T)*A,L=g*(S/s)+Math.cos(T)*A,U=S+Math.sin(M)*E,F=zo(e,e.range(.22,.38),0,.7,1.3);F.scale(1,e.range(.7,.95),1),F.translate(N,U,L),n.push({geometry:F,color:e.chance(.3)?z.LEAF_DARK:l,sway:1})}const _=zo(e,e.range(.26,.42),0,.72,1.28);_.scale(1,1.15,1),_.translate(v,s+.06,g),n.push({geometry:_,color:l,sway:1});const y=At(n);return y.rotateY(e.range(0,Math.PI*2)),t!==1&&y.scale(t,t,t),Dt(y,"small-tree",e.range(0,Math.PI*2))}},Eb={name:"fallen-log",category:"nature",radius:2.2,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(2.4,4.6),r=e.range(.16,.26),o=r*e.range(.6,.8),a=e.chance(.45)?z.BARK_PALE:z.BARK,c=e.range(0,1),l=5334330,h=r*.86,u=new K(o,r,s,8);u.rotateZ(Math.PI/2),u.rotateX(e.around(0,.12)),u.translate(0,h,0),n.push({geometry:u,color:(v,g)=>g>h+r*.35&&e.chance(0)===!1&&c>.45?l:a,sway:0});const f=new jt(r*.92,r*1.1,6);f.rotateZ(-Math.PI/2),f.translate(s/2+r*.4,h,0),n.push({geometry:f,color:B(z.TIMBER,.86),sway:0});const d=e.int(2,4);for(let v=0;v<d;v++){const g=e.range(-s*.42,s*.35),p=e.range(.18,.42),_=e.range(.3,Math.PI-.3)*(e.chance(.5)?1:-1),y=new K(r*.16,r*.26,p,5);y.translate(0,p/2,0),y.rotateX(Math.PI/2-e.range(.4,1.1)),y.rotateY(_),y.translate(g,h+r*.4,0),n.push({geometry:y,color:B(a,.9),sway:0})}if(c>.6){const v=e.int(2,4);for(let g=0;g<v;g++){const p=e.range(-s*.4,s*.4),_=e.chance(.5)?1:-1,y=new K(e.range(.06,.12),e.range(.03,.06),.025,6);y.rotateZ(_*.5),y.translate(p,h+e.range(0,r*.5),_*r*.85),n.push({geometry:y,color:12430988,sway:0})}}const m=At(n);return t!==1&&m.scale(t,t,t),Dt(m,"fallen-log",0)}},Tb={name:"sticks",category:"nature",radius:1,solid:!1,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.int(6,11),r=e.range(.5,.95),o=e.chance(.5)?z.BARK:z.BARK_PALE;for(let c=0;c<s;c++){const l=e.range(.4,1.5),h=e.range(.018,.05),u=e.chance(.1)?e.range(.12,.26):e.range(0,.06),f=e.range(0,Math.PI*2),d=new K(h*.7,h,l,4);d.rotateZ(Math.PI/2),d.rotateZ(u),d.rotateY(f);const m=e.range(0,.05)+Math.sin(u)*l*.4,v=Math.sqrt(e())*r*(1-m*.5),g=e.range(0,Math.PI*2);d.translate(Math.cos(g)*v,h+m,Math.sin(g)*v),n.push({geometry:d,color:B(o,e.range(.82,1.14)),sway:0})}const a=At(n);return t!==1&&a.scale(t,t,t),Dt(a,"sticks",0)}},Ab={name:"bramble",category:"foliage",radius:1.3,solid:!1,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.int(5,8),r=e.range(.85,1.4),o=e.chance(.5)?5917240:7033392,a=e.chance(.5)?z.LEAF_DARK:z.LEAF,c=e.range(0,Math.PI*2);for(let h=0;h<s;h++){const u=c+e.range(-1.5,1.5),f=r*e.range(.65,1.1),d=4,m=f/d,v=e.range(.013,.022);let g=e.range(1,1.35);const p=e.range(0,.09),_=e.range(0,Math.PI*2);let y=Math.cos(_)*p,x=.02,b=Math.sin(_)*p;for(let S=0;S<d;S++){const E=new K(v*.72,v,m*1.1,4);E.translate(0,m/2,0),E.rotateX(Math.PI/2-g),E.rotateY(u),E.translate(y,x,b);const T=(S/d)**1.4;n.push({geometry:E,color:B(o,e.range(.88,1.1)),sway:T});const M=Math.cos(g)*m,w=y+Math.sin(u)*M,A=x+Math.sin(g)*m,N=b+Math.cos(u)*M;if(A>.05)for(let L=0;L<3;L++){const U=v*e.range(3.6,5.4),F=new jt(U*.55,U*1.5,3);F.translate(0,U*.75,0),F.scale(1,1,.3),F.rotateZ(e.range(.9,1.4)),F.rotateY(L/3*Math.PI*2+e.range(0,.4)),F.translate(w,A,N),n.push({geometry:F,color:B(a,e.range(.85,1.15)),sway:T})}y=w,x=Math.max(.03,A),b=N,g-=e.range(.4,.7)}}const l=At(n);return t!==1&&l.scale(t,t,t),Dt(l,"bramble",e.range(0,Math.PI*2))}},Rb={name:"fern",category:"foliage",radius:.8,solid:!1,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.int(6,9),r=e.range(.42,.72),o=e.chance(.4)?z.LEAF_DARK:z.LEAF;for(let l=0;l<s;l++){const h=l/s*Math.PI*2+e.range(-.22,.22),u=r*e.range(.72,1.15),f=4,d=u/f;let m=e.range(1.1,1.45),v=0,g=e.range(.02,.08),p=0;for(let _=0;_<f;_++){const y=_/f,x=new K(.006,.009,d*1.1,4);x.translate(0,d/2,0),x.rotateX(Math.PI/2-m),x.rotateY(h),x.translate(v,g,p),n.push({geometry:x,color:B(o,.82),sway:y**1.2});const b=3;for(let E=0;E<b;E++){const T=(E+.5)/b,M=y+T/f,w=u*.2*(1-M*.75);if(w<.012)continue;const A=Math.cos(m)*d*T,N=v+Math.sin(h)*A,L=g+Math.sin(m)*d*T,U=p+Math.cos(h)*A;for(const F of[-1,1]){const D=w*e.range(.88,1.12),H=new jt(D*.3,D,3);H.translate(0,D*.5,0),H.scale(1,1,.22),H.rotateZ(F*e.range(1.2,1.45)),H.rotateY(h+F*e.range(.1,.35)),H.translate(N,L,U),n.push({geometry:H,color:B(o,e.range(.9,1.14)),sway:M**1.2})}}const S=Math.cos(m)*d;v+=Math.sin(h)*S,g+=Math.sin(m)*d,p+=Math.cos(h)*S,m-=e.range(.3,.5)}}const a=new ee(r*.1,0);a.scale(1,1.5,1),a.translate(0,r*.1,0),n.push({geometry:a,color:B(o,.75),sway:.3});const c=At(n);return c.rotateY(e.range(0,Math.PI*2)),t!==1&&c.scale(t,t,t),Dt(c,"fern",e.range(0,Math.PI*2))}},Cb={name:"nettle",category:"foliage",radius:.6,solid:!1,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.int(4,8),r=e.range(.26,.42),o=e.chance(.5)?4612154:4019507;for(let c=0;c<s;c++){const l=e.range(0,Math.PI*2),h=Math.sqrt(e())*r,u=Math.cos(l)*h,f=Math.sin(l)*h,d=e.range(.62,1.05)*(1-h/r*.18),m=e.range(0,.09),v=e.range(0,Math.PI*2),g=e.range(.0055,.0095),p=new K(g*.7,g,d,4);p.translate(0,d/2,0),p.rotateX(Math.cos(v)*m),p.rotateZ(Math.sin(v)*m),p.translate(u,0,f),n.push({geometry:p,color:B(o,.85),sway:(y,x)=>Math.max(0,x/d)**1.4});const _=2+Math.floor(d*2);for(let y=1;y<=_;y++){const x=y/(_+.6)*d,b=d*e.range(.1,.16)*(1-y/_*.35);for(const S of[-1,1]){const E=b*e.range(.9,1.1),T=new jt(E*.5,E*1.7,3);T.translate(0,E*.85,0),T.scale(1,1,.3),T.rotateZ(S*e.range(1.15,1.5)),T.rotateY(y*(Math.PI/2)+e.around(0,.2)),T.translate(u,x,f),n.push({geometry:T,color:B(o,e.range(.92,1.12)),sway:Math.max(0,x/d)**1.4})}}if(e.chance(.6))for(const y of[-1,1]){const x=new K(e.range(.0035,.0048),e.range(.007,.0092),d*e.range(.14,.19),4);x.translate(0,-d*.08,0),x.rotateZ(y*e.range(.66,.94)),x.translate(u,d*.86,f),n.push({geometry:x,color:11053186,sway:.9})}}const a=At(n);return a.rotateY(e.range(0,Math.PI*2)),t!==1&&a.scale(t,t,t),Dt(a,"nettle",e.range(0,Math.PI*2))}},Pb={name:"reeds",category:"foliage",radius:.7,solid:!1,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.int(9,18),r=e.range(.28,.5),o=e.chance(.4)?8223300:6253368,a=e.chance(.5)?4863268:6045994;for(let l=0;l<s;l++){const h=e.range(0,Math.PI*2),u=Math.sqrt(e())*r,f=Math.cos(h)*u,d=Math.sin(h)*u,m=e.range(1.4,2.4)*(1-u/r*.22),v=e.range(0,.14),g=e.range(0,Math.PI*2),p=Math.cos(g)*v,_=Math.sin(g)*v,y=new K(.008,.013,m,4);y.translate(0,m/2,0),y.rotateX(p),y.rotateZ(_),y.translate(f,0,d),n.push({geometry:y,sway:(M,w)=>Math.max(0,w/m)**1.2,color:B(o,e.range(.88,1.12))}),po.set(0,m,0).applyAxisAngle(Lb,p).applyAxisAngle(Ib,_);const x=e.range(.16,.26),b=[],S=new K(.024,.028,x,6);S.translate(0,-x/2,0),b.push([S,B(a,e.range(.9,1.1))]);const E=new jt(.026,x*.46,6);E.translate(0,x*.17,0),b.push([E,B(a,1.15)]);const T=new K(.004,.007,x*.5,4);T.translate(0,x*.63,0),b.push([T,B(o,.9)]);for(const[M,w]of b)M.rotateX(p),M.rotateZ(_),M.translate(f+po.x,po.y,d+po.z),n.push({geometry:M,color:w,sway:1});if(e.chance(.5)){const M=m*e.range(.3,.5),w=new jt(.018,M,3);w.translate(0,M/2,0),w.scale(1,1,.28),w.rotateZ(e.range(.25,.6)*(e.chance(.5)?1:-1)),w.rotateY(e.range(0,Math.PI*2)),w.translate(f,m*e.range(.1,.3),d),n.push({geometry:w,color:B(o,.92),sway:.8})}}const c=At(n);return t!==1&&c.scale(t,t,t),Dt(c,"reeds",e.range(0,Math.PI*2))}},Lb=new C(1,0,0),Ib=new C(0,0,1),po=new C,Db={name:"moss",category:"foliage",radius:.55,solid:!1,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.chance(.4)?"cushion":e.chance(.5)?"carpet":"fruiting",r=e.chance(.5)?4678447:3495740,o=e.range(.2,.34),a=s==="cushion"?e.int(3,6):e.int(4,8);for(let l=0;l<a;l++){const h=l===0,u=h?e.range(.16,.26):e.range(.08,.18)*(s==="cushion"?1:1.35),f=h?0:Math.sqrt(e())*o,d=e.range(0,Math.PI*2),m=s==="cushion"?e.range(.34,.46):e.range(.13,.2),v=zo(e,u,1,.86,1.18);v.scale(1,m,1),v.translate(Math.cos(d)*f,u*m*.35,Math.sin(d)*f),n.push({geometry:v,color:B(r,e.range(.86,1.16)),sway:0})}if(s==="fruiting"){const l=e.int(14,26),h=e.chance(.5)?9075274:7167802;for(let u=0;u<l;u++){const f=e.range(0,Math.PI*2),d=Math.sqrt(e())*o*.9,m=Math.cos(f)*d,v=Math.sin(f)*d,g=e.range(.045,.1),p=e.range(0,.3),_=e.range(0,Math.PI*2),y=new K(.0018,.0028,g,4);y.translate(0,g/2,0),y.rotateX(Math.cos(_)*p),y.rotateZ(Math.sin(_)*p),y.translate(m,.02,v),n.push({geometry:y,color:B(h,.9),sway:.7});const x=new K(.006,.0045,g*.3,5);x.rotateX(Math.cos(_)*p*1.6),x.rotateZ(Math.sin(_)*p*1.6),x.translate(m+Math.sin(Math.sin(_)*p)*-g,.02+g*Math.cos(p),v+Math.sin(Math.cos(_)*p)*g),n.push({geometry:x,color:B(h,1.2),sway:1})}}const c=At(n);return t!==1&&c.scale(t,t,t),Dt(c,"moss",e.range(0,Math.PI*2))}},Nb={name:"pinecone",category:"nature",radius:.4,solid:!1,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.int(3,7),r=e.range(.16,.3);for(let a=0;a<s;a++){const c=e.range(0,Math.PI*2),l=Math.sqrt(e())*r,h=Math.cos(c)*l,u=Math.sin(c)*l,f=e.range(.11,.18),d=f*e.range(.36,.46),m=B(e.chance(.5)?z.BARK:7031340,e.range(.85,1.15)),v=e.range(.9,1.35),g=e.range(0,Math.PI*2),p=S=>{S.rotateX(v),S.rotateY(g),S.translate(h,d*.55,u)},_=new K(d*.18,d*.5,f*.82,6);p(_),n.push({geometry:_,color:B(m,.8),sway:0});const y=new jt(d*.2,f*.3,6);y.translate(0,f*.55,0),p(y),n.push({geometry:y,color:B(m,.75),sway:0});const x=4,b=5;for(let S=0;S<x;S++){const E=-f*.34+S/(x-1)*f*.66,T=1-Math.abs(S/(x-1)-.35)*.9;for(let M=0;M<b;M++){const w=M/b*Math.PI*2+S*.62,A=new V(d*.42,d*.16,d*.34);A.rotateX(-.5),A.translate(0,0,d*.5*T),A.rotateY(w),A.translate(0,E,0),p(A),n.push({geometry:A,color:B(m,e.range(.95,1.2)),sway:0})}}}const o=At(n);return t!==1&&o.scale(t,t,t),Dt(o,"pinecone",0)}},Ub=4874292,Fb=6124608,Ob=z.LEAF;function zb(i,t,e,{scale:n=1}){const s=[],r=e.int(t.count[0],t.count[1]),o=e.pick(t.petal),a=e.range(0,Math.PI*2);for(let l=0;l<r;l++){const h=e.range(0,Math.PI*2),u=Math.sqrt(e())*t.spread,f=Math.cos(h)*u,d=Math.sin(h)*u,m=1-u/t.spread*e.range(.1,.35),v=e.range(t.height[0],t.height[1])*m,g=e.range(0,.22),p=e.range(0,Math.PI*2),_=Math.cos(p)*g,y=Math.sin(p)*g,x=new K(t.stemThickness*.7,t.stemThickness,v,4);x.translate(0,v/2,0),x.rotateX(_),x.rotateZ(y),x.translate(f,0,d),s.push({geometry:x,color:e.chance(.4)?Fb:Ub,sway:(D,H)=>Math.max(0,H/v)**1.4});for(let D=0;D<t.leaves;D++){const H=v*(.2+D/Math.max(1,t.leaves)*.45);go.set(0,H,0).applyAxisAngle(mc,_).applyAxisAngle(gc,y);for(const k of[-1,1]){const Y=v*e.range(.16,.28),rt=new jt(Y*.3,Y,3);rt.translate(0,Y/2,0),rt.scale(1,1,.35),rt.rotateZ(k*e.range(1,1.35)),rt.rotateY(e.range(0,Math.PI*2)),rt.translate(f+go.x,go.y,d+go.z),s.push({geometry:rt,color:Ob,sway:()=>Math.max(0,H/v)**1.4})}}mo.set(0,v,0).applyAxisAngle(mc,_).applyAxisAngle(gc,y);const b=f+mo.x,S=mo.y,E=d+mo.z,T=1;if(t.head){s.push(...t.head({axis:D=>new C(0,v*D,0).applyAxisAngle(mc,_).applyAxisAngle(gc,y).add(new C(f,0,d)),height:v,rng:e}));continue}const M=e.range(t.headSize[0],t.headSize[1])*m,w=e.chance(t.nod)?e.range(.5,1.1):e.range(0,.18),A=e.range(-Math.PI,Math.PI),N=t.facing===void 0?A:a+A/Math.PI*t.facing,L=D=>{D.rotateX(Math.cos(N)*w),D.rotateZ(Math.sin(N)*w),D.translate(b,S,E)},U=new K(M,M*.9,M*.5,8);L(U),s.push({geometry:U,color:t.centre,sway:T});const F=M*t.reach;for(let D=0;D<t.petals;D++){const H=D/t.petals*Math.PI*2+e.range(-.12,.12),k=F*e.range(.88,1.12),Y=new jt(k*t.petalWidth*e.range(.9,1.1),k,3);Y.translate(0,F/2,0),Y.scale(1,1,.28),Y.rotateX(Math.PI/2-e.range(t.cup[0],t.cup[1])),Y.rotateY(H),Y.translate(0,M*.12,0),L(Y),s.push({geometry:Y,color:o,sway:T})}}const c=At(s);return c.rotateY(e.range(0,Math.PI*2)),n!==1&&c.scale(n,n,n),Dt(c,i,e.range(0,Math.PI*2))}function Wn(i,t,e){return{name:i,category:"foliage",radius:e,solid:!1,build:(n={})=>zb(i,t,Rt(n.seed??1),n)}}const mc=new C(1,0,0),gc=new C(0,0,1),mo=new C,go=new C,Wd=[{petals:5,reach:2.1,width:.62,cup:[.5,.95],size:[.026,.042],petal:[15255624,14465074,14996042],centre:11045420,nod:.1},{petals:14,reach:2.3,width:.18,cup:[.05,.3],size:[.028,.046],petal:[15789280,15262932,16050360],centre:14202944,nod:.1},{petals:12,reach:1.15,width:.42,cup:[.35,.8],size:[.03,.05],petal:[11576528,10259648,12891356],centre:7298966,nod:.15},{petals:5,reach:1.7,width:.5,cup:[.15,.45],size:[.024,.04],petal:[14183060,13128834,14715560],centre:15786192,nod:.12},{petals:4,reach:2.4,width:.55,cup:[0,.2],size:[.016,.028],petal:[8363992,7048392,10138848],centre:15790304,nod:.05},{petals:8,reach:2.6,width:.24,cup:[.6,1.1],size:[.022,.036],petal:[14717034,13925464,15247488],centre:9194028,nod:.6}];function kb({axis:i,rng:t}){const e=[],n=Wd[t.int(0,Wd.length-1)],s=i(1),r=t.range(n.size[0],n.size[1]),o=t.pick(n.petal),a=t.chance(n.nod)?t.range(.5,1.1):t.range(0,.18),c=t.range(0,Math.PI*2),l=f=>{f.rotateX(Math.cos(c)*a),f.rotateZ(Math.sin(c)*a),f.translate(s.x,s.y,s.z)},h=new K(r,r*.9,r*.5,8);l(h),e.push({geometry:h,color:n.centre,sway:1});const u=r*n.reach;for(let f=0;f<n.petals;f++){const d=f/n.petals*Math.PI*2+t.range(-.12,.12),m=u*t.range(.88,1.12),v=new jt(m*n.width*t.range(.9,1.1),m,3);v.translate(0,m/2,0),v.scale(1,1,.28),v.rotateX(Math.PI/2-t.range(n.cup[0],n.cup[1])),v.rotateY(d),v.translate(0,r*.12,0),l(v),e.push({geometry:v,color:o,sway:1})}return e}const Bb=Wn("wildflower",{height:[.14,.62],stemThickness:.0085,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[14209252],centre:14205024,count:[14,26],spread:.6,leaves:1,nod:0,head:kb},.75);function Hb({axis:i,height:t,rng:e}){const n=[],s=e.int(4,6),r=e.range(0,Math.PI*2),o=e.range(.5,.62),c=e.chance(.06)?15789800:5926837;for(let l=0;l<s;l++){const h=s===1?0:l/(s-1),u=o+(1-o)*h,f=i(u),d=h*h*t*.3,m=t*.12*(1-h*.3),v=r+e.range(-.22,.22),g=m*.9+d,p=new C(f.x+Math.sin(v)*g,f.y-d*.5,f.z+Math.cos(v)*g);n.push({geometry:yn(f,p,.0035,.0025),color:6124608,sway:u});const _=new K(m*.3,m*.62,m*1.4,6);_.translate(0,-m*.7,0),_.rotateZ(e.around(0,.16)),_.translate(p.x,p.y,p.z),n.push({geometry:_,color:c,sway:u})}return n}const Gb=Wn("bluebell",{height:[.35,.62],stemThickness:.008,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[5926837],centre:5926837,count:[9,16],spread:.5,leaves:0,nod:0,head:Hb},.65);function Vb({axis:i,height:t,rng:e}){const n=[],s=i(1),r=e.int(6,11),o=t*e.range(.1,.16),a=s.y+o*e.range(.5,.8);for(let c=0;c<r;c++){const l=c/r*Math.PI*2+e.range(-.2,.2),h=o*e.range(.5,1.15),u=new C(s.x+Math.cos(l)*h,a,s.z+Math.sin(l)*h);n.push({geometry:yn(s,u,.0028,.0018),color:6978116,sway:1});const f=new ee(o*e.range(.16,.26),0);if(f.scale(1,.32,1),f.translate(u.x,u.y,u.z),n.push({geometry:f,color:16250348,sway:1}),e.chance(.55)){const d=new ee(o*.1,0);d.scale(1,.3,1),d.translate(u.x+e.around(0,.008),u.y+.004,u.z+e.around(0,.008)),n.push({geometry:d,color:14210720,sway:1})}}return n}const Wb=Wn("cowparsley",{height:[.55,1.15],stemThickness:.009,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[16250348],centre:14210720,count:[5,12],spread:.5,leaves:2,nod:0,head:Vb},.7),c0=11555727,l0=13070244,Xb=9256307,Xd=8211058;function qb({axis:i,height:t,rng:e}){const n=[],s=e.int(11,16),r=e.range(0,Math.PI*2),o=e.range(.4,.5);for(let c=0;c<s;c++){const l=c/(s-1),h=o+(1-o)*l,u=i(h),f=r+e.range(-.16,.16),d=t*.09*(1-l*.55),m=Math.min(1,Math.max(0,1.35-l*1.8)),v=d*(.35+m*.3),g=u.x+Math.sin(f)*v,p=u.z+Math.cos(f)*v,_=d*(.8+m*.9),y=d*(.2+m*.28),x=.18+m*.3,b=new K(d*.22,y,_,7);b.translate(0,-_/2,0),b.rotateZ(x),b.rotateY(-f+Math.PI/2),b.translate(g,u.y,p),n.push({geometry:b,color:(E,T)=>T>u.y-_*.45?l0:c0,sway:h});const S=new K(y*(m>.3?1.22:.4),y*(m>.3?1.05:.15),d*.26,7);S.translate(0,-_-d*.06,0),S.rotateZ(x),S.rotateY(-f+Math.PI/2),S.translate(g,u.y,p),n.push({geometry:S,color:m>.3?Xb:Xd,sway:h})}const a=i(1);for(let c=0;c<3;c++){const l=new ee(t*.014*(1-c*.22),0);l.scale(.75,1.5,.75),l.translate(a.x+Math.sin(r)*t*.01,a.y-c*t*.02,a.z+Math.cos(r)*t*.01),n.push({geometry:l,color:Xd,sway:1})}return n}const Yb=Wn("foxglove",{height:[1,1.8],stemThickness:.014,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[c0],centre:l0,count:[1,4],spread:.3,leaves:2,nod:0,head:qb},.6);function $b({axis:i,height:t,rng:e}){const n=[],s=e.range(.62,.72),r=e.int(4,7),o=e.chance(.5)?8154022:9140920;for(let a=0;a<r;a++){const c=s+(1-s)*(a+.4)/r,l=i(c),h=(c-s)/(1-s),u=t*.028*(1-h**2.6*.42);for(let d=0;d<4;d++){const m=d/4*Math.PI*2+a*.7,v=new ee(u,0);v.scale(.8,1.15,.8),v.translate(l.x+Math.cos(m)*u*.85,l.y,l.z+Math.sin(m)*u*.85),n.push({geometry:v,color:o,sway:c})}const f=new K(u*.5,u*.6,u*.8,5);f.translate(l.x,l.y-u*.9,l.z),n.push({geometry:f,color:9149051,sway:c})}return n}const Zb=Wn("lavender",{height:[.5,.95],stemThickness:.007,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[8154022],centre:9149051,count:[16,30],spread:.26,leaves:1,nod:0,head:$b},.5);function Kb({axis:i,height:t,rng:e}){const n=[],s=e.int(4,7);for(let d=0;d<s;d++){const m=.1+d/(s-1)*.78,v=i(m),g=t*e.range(.2,.34)*(1-m*.55),p=e.range(0,Math.PI*2)+d*1.9;for(const _ of[-1,1]){const y=g*e.range(.85,1.05),x=new C(v.x+Math.sin(p)*y*_,v.y-y*e.range(.25,.5),v.z+Math.cos(p)*y*_);n.push({geometry:yn(v,x,.008,.003),color:6781258,sway:m});const b=e.int(3,5);for(let S=0;S<b;S++){const E=(S+.6)/(b+.4),T=new C().lerpVectors(v,x,E),M=g*.3*(1-Math.abs(E-.4)*.9);for(const w of[-1,1]){const A=new jt(M*e.range(.3,.42),M*1.4,3);A.translate(0,M*.7,0),A.scale(1,1,.28),A.rotateZ(w*e.range(1.05,1.4)),A.rotateY(p*_+w*e.range(.2,.5)),A.translate(T.x,T.y,T.z),n.push({geometry:A,color:e.chance(.25)?9149034:6257210,sway:m})}}}}const r=i(1),o=t*e.range(.055,.085),a=new ee(o*.72,1);a.scale(.86,1.25,.86),a.translate(r.x,r.y+o*.85,r.z),n.push({geometry:a,color:6257210,sway:1});const c=9;for(let d=0;d<c;d++){const m=d/c*Math.PI*2+e.around(0,.2),v=o*e.range(.5,.8),g=new jt(o*e.range(.07,.1),v,3);g.translate(0,v*.45,0),g.scale(1,1,.4),g.rotateZ(e.range(1.7,2.1)),g.rotateY(m),g.translate(r.x,r.y+o*1.35,r.z),n.push({geometry:g,color:7046978,sway:1})}const l=18;for(let d=0;d<l;d++){const m=d/l*Math.PI*2+e.around(0,.15),v=e.range(.35,.85),g=o*e.range(.8,1.3),p=new jt(o*e.range(.035,.055),g,3);p.translate(0,g*.42,0),p.scale(1,1,.55),p.rotateZ(Math.PI/2-v*.8),p.rotateY(m),p.translate(r.x,r.y+o*e.range(.55,1),r.z),n.push({geometry:p,color:5335343,sway:1})}const h=e.int(26,38),u=r.y+o*1.5;for(let d=0;d<h;d++){const m=e.range(0,Math.PI*2),v=Math.sqrt(e()),g=v*.95,p=o*e.range(.75,1.15)*(1-v*.2),_=new jt(o*e.range(.035,.055),p,3);_.translate(0,p*.5-p*e.range(.1,.3),0),_.rotateZ(g),_.rotateY(m),_.translate(r.x+Math.sin(m)*o*.22*v,u,r.z+Math.cos(m)*o*.22*v),n.push({geometry:_,color:(y,x)=>x>u+p*.35?14711496:11029654,sway:1})}const f=new ee(o*.34,0);return f.scale(1,.6,1),f.translate(r.x,u,r.z),n.push({geometry:f,color:9322366,sway:1}),n}const jb=Wn("thistle",{height:[.42,.9],stemThickness:.012,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[14711496],centre:11029654,count:[1,4],spread:.35,leaves:0,nod:0,head:Kb},.55),Jb=Wn("daisy",{height:[.16,.36],stemThickness:.009,headSize:[.034,.05],petals:12,reach:1.9,petalWidth:.24,cup:[.05,.3],petal:[15921124,15263450,15786726],centre:15254346,count:[14,26],spread:.42,leaves:0,nod:0},.45),Qb=Wn("poppy",{height:[.42,.75],stemThickness:.011,headSize:[.032,.05],petals:5,reach:2.2,petalWidth:.62,cup:[.55,.95],petal:[12071978,12861484,11021364],centre:2761500,count:[4,9],spread:.5,leaves:1,nod:.25},.55),tS=Wn("sunflower",{height:[1.1,1.9],stemThickness:.022,headSize:[.1,.16],petals:16,reach:1.5,petalWidth:.3,cup:[.15,.5],petal:[15250746,14460460,15713106],centre:5981226,count:[3,7],spread:.4,leaves:2,nod:.85,facing:.6},.75),eS="gallery-foliage",nS=[ch,Sb,Do,Ab,qp,Eb,Tb,Pb,Cb,Rb,Gp,Hp,Vp,Db,Nb,Wp,Xp,Yb,jb,tS,Wb,Zb,Qb,Gb,Jb,Bb],iS={id:eS,name:"Foliage Gallery",builders:nS},sS="gallery-animal",rS=[Kp,jp,Jp,Qp,t0,r0],oS={id:sS,name:"Animal Gallery",builders:rS},aS=22,cS=12,lS=16767392,qd=Math.SQRT2,hS={name:"streetlamp",category:"structures",radius:.9,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=[],r=e.range(2.9,3.6),o=e.range(.046,.062),a=e.range(.34,.5),c=e.chance(.35)?z.RUST:z.IRON,l=e.chance(.5)?z.STONE:z.STONE_DARK,h=o*6.2,u=new V(h,.15,h);u.translate(0,.075,0),n.push({geometry:u,color:B(l,e.around(1,.06)),sway:0});const f=new V(o*4.2,.12,o*4.2);f.translate(0,.2,0),n.push({geometry:f,color:B(c,1.05),sway:0});const d=.24,m=e.int(3,4),v=(r-d)/m;for(let yt=0;yt<m;yt++){const ot=1-.28*(yt/m),pt=o*2*ot,ut=new V(pt,v*1.06,pt);ut.translate(0,d+v*(yt+.5),0),n.push({geometry:ut,color:B(c,e.around(1,.07)),sway:0})}const g=o*2*(1-.28*(m-1)/m),p=g*.78,_=r-p*.62,y=new V(a+p,p,p);y.translate(a/2,_,0),n.push({geometry:y,color:B(c,.94),sway:0});const x=o*.5,b=_-e.range(.36,.5),S=a*.72,E=_-p*.5,T=S-x,M=E-b,w=Math.hypot(T,M)*1.18,A=new V(o*1.05,w,o*1.05);A.translate(0,w*.41,0),A.rotateZ(-Math.atan2(T,M)),A.translate(x,b,0),n.push({geometry:A,color:B(c,.88),sway:0});const N=new V(g*1.9,.07,g*1.9);if(N.translate(0,r-.02,0),n.push({geometry:N,color:B(c,1.1),sway:0}),e.chance(.5)){const yt=new jt(g*.6,.16,4);yt.rotateY(Math.PI/4),yt.translate(0,r+.07,0),n.push({geometry:yt,color:B(c,1),sway:0})}const L=a,U=_-p/2,F=e.range(.05,.1),D=new V(o*.8,F*1.6,o*.8);D.translate(L,U-F*.5,0),n.push({geometry:D,color:B(c,.86),sway:0});const H=e.range(.115,.145),k=e.range(.26,.34),Y=U-F,rt=.13,ft=new K(H*.45*qd,H*1.28*qd,rt,4);ft.rotateY(Math.PI/4),ft.translate(L,Y-rt/2+.01,0),n.push({geometry:ft,color:B(c,1.02),sway:0});const Ft=o*.75;for(const yt of[-1,1])for(const ot of[-1,1]){const pt=new V(Ft,k*1.1,Ft);pt.translate(L+yt*(H-Ft*.5),Y-rt-k/2+.02,ot*(H-Ft*.5)),n.push({geometry:pt,color:B(c,.9),sway:0})}const te=Y-rt-k,J=o*.9,at=H*2.2;for(const yt of[0,1])for(const ot of[-1,1]){const pt=yt===0,ut=new V(pt?at:J,.06,pt?J:at-J*1.8),zt=at/2-J/2;ut.translate(L+(pt?0:ot*zt),te-.01,pt?ot*zt:0),n.push({geometry:ut,color:B(c,.8),sway:0})}const St=te+k*.5,ht=new bn(H*.5,0);ht.scale(1,1.6,1),ht.translate(L,St,0),s.push({geometry:ht,color:z.LAMPLIGHT,sway:0});const Nt=At(n),kt=At(s),Ot=e.range(0,Math.PI*2);Nt.rotateY(Ot),kt.rotateY(Ot),t!==1&&(Nt.scale(t,t,t),kt.scale(t,t,t));const Jt=Dt(Nt,"streetlamp",0);Jt.add(dr(kt,"streetlamp:glow"));const nt=Math.cos(Ot)*L*t,lt=-Math.sin(Ot)*L*t,O=new Jo(lS,aS*e.around(1,.12)*t*t,cS*t,2);return O.position.set(nt,St*t,lt),O.castShadow=!1,Jt.add(O),Jt}},uS={name:"hopper",category:"structures",radius:1.3,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(.45,1.1),r=s*e.range(.14,.26),o=s*e.range(1.1,1.9),a=s*e.range(.25,.6),c=e.range(1.1,2.6),l=s*.05,h=B(7173499,e.range(.88,1.08)),u=B(z.IRON,e.range(.85,1.05)),f=e.chance(.45),d=c,m=c+o,v=m+a,g=[new et(r,d),new et(s,m),new et(s,v),new et(s-l,v),new et(s-l,m),new et(r-l*.6,d),new et(r,d)],p=new Li(g,6);n.push({geometry:p,color:f?(M,w)=>w<m?B(z.RUST,.9):h:h,sway:0});const _=new K(s*1.06,s*1.06,l*2.4,6);_.translate(0,v-l,0),n.push({geometry:_,color:B(u,1.05),sway:0});const y=new K(r*1.28,r*1.28,c*.45,6);y.translate(0,d-c*.18,0),n.push({geometry:y,color:B(u,.95),sway:0});const x=new V(r*2.4,r*.9,r*.28);x.rotateY(e.range(0,Math.PI)),x.translate(0,d-c*.34,0),n.push({geometry:x,color:B(z.RUST,1.08),sway:0});const b=4,S=s*1.05,E=m+a*.25;for(let M=0;M<b;M++){const w=M/b*Math.PI*2+Math.PI/4,A=new C(Math.sin(w)*S,0,Math.cos(w)*S),N=new C(Math.sin(w)*s*.88,E,Math.cos(w)*s*.88);n.push({geometry:yn(A,N,.05,.042),color:u,sway:0});const L=new V(.18,.05,.18);L.translate(A.x,.025,A.z),n.push({geometry:L,color:B(u,.84),sway:0})}for(let M=0;M<b;M++){const w=M/b*Math.PI*2+Math.PI/4,A=(M+1)/b*Math.PI*2+Math.PI/4,N=L=>new C(Math.sin(L)*(S+s*.88)*.5,E*.45,Math.cos(L)*(S+s*.88)*.5);n.push({geometry:yn(N(w),N(A),.032,.03),color:B(u,.88),sway:0})}const T=At(n);return t!==1&&T.scale(t,t,t),Dt(T,"hopper",0)}},dS={name:"ladder",category:"structures",radius:.4,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(2.4,4.6),r=e.range(.36,.48),o=e.range(.02,.028),a=.3,c=Math.floor(s/a),l=e.chance(.45),h=B(l?z.TIMBER:z.IRON,e.range(.85,1.05)),u=l?B(z.TIMBER_DARK,e.range(.9,1.1)):B(z.IRON,e.range(1,1.15));for(const d of[-1,1]){const m=new V(o*(l?2:1.5),s,o*(l?2.2:3));m.translate(d*r/2,s/2,0),n.push({geometry:m,color:h,sway:0})}for(let d=0;d<c;d++){const m=l?new V(r*1.02,o*1.5,o*1.5):new K(o*.72,o*.72,r*1.02,6);l||m.rotateZ(Math.PI/2),m.translate(0,a*(d+.6),0),n.push({geometry:m,color:u,sway:0})}const f=At(n);return t!==1&&f.scale(t,t,t),Dt(f,"ladder",0)}},fS={name:"panel",category:"structures",radius:.9,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(1,1.5),r=e.range(.85,1.15),o=e.range(.35,.6),a=e.range(.18,.26),c=B(z.IRON,e.range(.85,1.05)),l=e.chance(.5)?3093304:3814192,h=10124348,u=new V(s*.94,o,a*1.15);u.translate(0,o/2,0),n.push({geometry:u,color:B(c,.8),sway:0});const f=e.range(.1,.2),d=new V(s,r,a*.5);d.rotateX(-f),d.translate(0,o+r/2,a*.16),n.push({geometry:d,color:l,sway:0});for(const[E,T,M]of[[s*1.06,.06,o],[s*1.06,.06,o+r]]){const w=new V(E,T,a*.62);w.rotateX(-f),w.translate(0,M,a*.16+(M>o+.1?-r*f*.5:r*f*.5)),n.push({geometry:w,color:c,sway:0})}const m=e.int(3,5),v=e.int(2,3),g=s*.84/m,p=r*.78/v,_=o+r/2,y=a*.16,x=a*.25,b=(E,T)=>{const M=-s*.42+g*(E+.5),w=r*.4-p*(T+.5)+p*.5;return new C(M,_+w*Math.cos(f)+x*Math.sin(f),y-w*Math.sin(f)+x*Math.cos(f))};for(let E=0;E<v;E++)for(let T=0;T<m;T++){const M=b(T,E),w=E===0,A=e(),N=w?A<.6?"gauge":A<.8?"lamp":"dial":A<.4?"lever":A<.65?"knife":A<.85?"button":"dial";if(N==="gauge"){const L=Math.min(g,p)*.36,U=new K(L,L,a*.3,10);U.rotateX(Math.PI/2-f),U.translate(M.x,M.y,M.z),n.push({geometry:U,color:h,sway:0});const F=new K(L*.76,L*.76,a*.34,10);F.rotateX(Math.PI/2-f),F.translate(M.x,M.y,M.z+a*.04),n.push({geometry:F,color:14209726,sway:0});const D=e.range(-1.1,1.1),H=new V(L*.09,L*1.25,a*.12);H.translate(0,L*.5,0),H.rotateZ(D),H.rotateX(-f),H.translate(M.x,M.y,M.z+a*.1),n.push({geometry:H,color:2367260,sway:0})}else if(N==="lamp"){const L=Math.min(g,p)*.18,U=new K(L*1.5,L*1.5,a*.26,8);U.rotateX(Math.PI/2-f),U.translate(M.x,M.y,M.z),n.push({geometry:U,color:B(c,.9),sway:0});const F=new jt(L*1.15,L*1.5,8);F.rotateX(Math.PI/2-f),F.translate(M.x,M.y,M.z+a*.14),n.push({geometry:F,color:e.chance(.5)?12075052:10135610,sway:0})}else if(N==="dial"){const L=Math.min(g,p)*.22,U=new K(L,L,a*.4,8);U.rotateX(Math.PI/2-f),U.translate(M.x,M.y,M.z+a*.08),n.push({geometry:U,color:B(c,1.18),sway:0});const F=new V(L*.24,L*1.5,a*.16);F.translate(0,L*.7,0),F.rotateZ(e.range(-2.4,2.4)),F.rotateX(-f),F.translate(M.x,M.y,M.z+a*.22),n.push({geometry:F,color:h,sway:0})}else if(N==="button")for(let L=0;L<3;L++){const U=Math.min(g,p)*.11,F=M.x+(L-1)*g*.26,D=new K(U,U*1.2,a*.34,8);D.rotateX(Math.PI/2-f),D.translate(F,M.y,M.z+a*.06),n.push({geometry:D,color:L===0?10135610:L===2?12075052:B(c,1.2),sway:0})}else if(N==="knife"){const L=g*.34;for(const D of[-1,1]){const H=new V(L*.34,p*.16,a*.34);H.rotateX(-f),H.translate(M.x+D*L,M.y-p*.12,M.z+a*.06),n.push({geometry:H,color:h,sway:0})}const U=e.chance(.5),F=new V(L*2.2,p*.1,a*.16);F.rotateZ(U?0:e.range(.6,1)),F.rotateX(-f),F.translate(M.x,M.y-p*(U?.12:-.05),M.z+a*.14),n.push({geometry:F,color:B(h,1.15),sway:0})}else{const L=p*e.range(.55,.85),U=e.range(-.9,.9),F=new K(.013,.018,L,5);F.translate(0,L/2,0),F.rotateZ(U),F.rotateX(-f-.85),F.translate(M.x,M.y-p*.2,M.z+a*.06),n.push({geometry:F,color:B(c,1.15),sway:0});const D=new ee(.03,0);D.translate(M.x+Math.sin(U)*-L,M.y-p*.2+Math.cos(U)*L*.66,M.z+a*.06+L*.7),n.push({geometry:D,color:e.chance(.5)?z.RUST:h,sway:0})}}const S=At(n);return t!==1&&S.scale(t,t,t),Dt(S,"panel",0)}},pS={name:"stair",category:"structures",radius:2.2,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(.17,.2),r=e.range(.23,.27),o=e.int(11,16),a=e.range(.85,1.05),c=s*o,l=r*o,h=B(z.IRON,e.range(.85,1.05)),u=B(z.IRON,e.range(.95,1.15)),f=Math.atan2(c,l),d=Math.hypot(c,l);for(const b of[-1,1]){const S=new V(.06,.28,d+.2);S.rotateX(f),S.translate(b*a/2,c/2-.06,-l/2),n.push({geometry:S,color:h,sway:0})}for(let b=0;b<o;b++){const S=new V(a*.94,.035,r*.72);S.translate(0,s*(b+1),-r*(b+.5)),n.push({geometry:S,color:u,sway:0});const E=new V(a*.94,.05,.03);E.translate(0,s*(b+1)-.012,-r*(b+.5)-r*.36),n.push({geometry:E,color:B(u,.86),sway:0})}const m=e.range(.9,1.3),v=new V(a+.12,.07,m);v.translate(0,c,-l-m/2+.02),n.push({geometry:v,color:B(u,1.06),sway:0});for(const b of[-1,1]){const S=new K(.045,.05,c,6);S.translate(b*a/2,c/2,-l-m+.12),n.push({geometry:S,color:B(h,.9),sway:0})}const g=e.chance(.5)?1:-1,p=1.05,_=4;for(let b=0;b<=_;b++){const S=b/_,E=new K(.022,.026,p,6);E.translate(g*a/2,s*o*S+p/2,-l*S),n.push({geometry:E,color:h,sway:0})}const y=new K(.026,.026,d+.16,6);y.rotateX(Math.PI/2+f),y.translate(g*a/2,c/2+p,-l/2),n.push({geometry:y,color:B(h,1.12),sway:0});const x=At(n);return t!==1&&x.scale(t,t,t),Dt(x,"stair",0)}},mS={name:"workbench",category:"furniture",radius:1.2,build({seed:i=1,scale:t=1}={}){const e=Rt(i),n=[],s=e.range(1.4,2.1),r=e.range(.6,.75),o=e.range(.86,.92),a=e.range(.06,.09),c=B(z.IRON,e.range(.85,1.05)),l=B(z.TIMBER,e.range(.82,1)),h=e.int(3,5);for(let T=0;T<h;T++){const M=new V(s,a,r/h*.97);M.translate(0,o-a/2,-r/2+r/h*(T+.5)),n.push({geometry:M,color:B(l,e.range(.9,1.12)),sway:0})}const u=e.range(.032,.045),f=.1;for(const T of[-1,1])for(const M of[-1,1]){const w=new V(u*2,o-a,u*2);w.translate(T*(s-f*2)/2,(o-a)/2,M*(r-f*2)/2),n.push({geometry:w,color:c,sway:0})}for(const T of[-1,1]){const M=new V(s-f*2,u*1.5,u*1.4);M.translate(0,o*.22,T*(r-f*2)/2),n.push({geometry:M,color:B(c,.86),sway:0})}if(e.chance(.6)){const T=new V(s-f*2.4,.03,r-f*2.4);T.translate(0,o*.26,0),n.push({geometry:T,color:B(l,.8),sway:0})}if(!e.chance(.5)){const T=At(n);return t!==1&&T.scale(t,t,t),Dt(T,"workbench",0)}const d=s*e.range(.2,.34)*(e.chance(.5)?1:-1),m=r/2,v=e.range(.13,.18),g=e.range(.02,.12),p=new V(v*1.1,v*.85,v*1.5);p.translate(d,o+v*.42,m-v*.35),n.push({geometry:p,color:B(c,1.1),sway:0});for(const[T,M]of[[m+g*.5,1],[m-g*.5-v*.28,.95]]){const w=new V(v*1.25*M,v*.7,v*.24);w.translate(d,o+v*.5,T),n.push({geometry:w,color:B(c,1.2),sway:0})}const _=new K(v*.11,v*.11,v*1.1,6);_.rotateX(Math.PI/2),_.translate(d,o+v*.5,m+v*.55),n.push({geometry:_,color:B(c,1.25),sway:0});const y=e.range(0,Math.PI),x=v*.8,b=new C(d,o+v*.5,m+v*1.02),S=[-1,1].map(T=>new C(b.x+Math.cos(y)*x*T,b.y+Math.sin(y)*x*T,b.z));n.push({geometry:yn(S[0],S[1],v*.06,v*.06,5),color:B(c,1.1),sway:0});for(const T of S){const M=new ee(v*.085,0);M.translate(T.x,T.y,T.z),n.push({geometry:M,color:B(c,1.2),sway:0})}const E=At(n);return t!==1&&E.scale(t,t,t),Dt(E,"workbench",0)}},gS="gallery-village",vS="gallery-factory",yS=[Qs,uh,e0,f2,Yp,$p,hS,Zp,Bp,i0,s0,or,ar,Sl,El,Oo,wl,Ml,Pp],_S={id:gS,name:"Village Gallery",builders:yS},xS=[bl,n0,Up,uS,Np,kp,Fp,mS,fS,dh,pS,dS,Op,zp,bo],wS={id:vS,name:"Factory Gallery",builders:xS},h0=8,MS=1.4,Rl=Qf,ph=16,Yd=new sn({color:3813928,flatShading:!0}),bS=new sn({color:12168594,flatShading:!0}),SS=new sn({color:2827808,flatShading:!0});function ES(i,t,e){let n=2166136261;for(let h=0;h<i.length;h++)n=Math.imul(n^i.charCodeAt(h),16777619);const s=Rt(n>>>0),r=[],o=t*.1,a=t-o*2,c=2+(s.chance(.45)?1:0),l=e/(c+.9);for(let h=0;h<c;h++){const u=e/2-l*(h+.95),f=h===c-1?s.range(.4,.8):s.range(.82,1);let d=-a/2;const m=-a/2+a*f;for(;d<m;){const v=Math.min(s.range(a*.08,a*.26),m-d);if(v<a*.04)break;const g=new Kt(new V(v,l*s.range(.3,.42),.008),SS);g.position.set(d+v/2,u,0),r.push(g),d+=v+a*s.range(.045,.09)}}return r}function u0(i){const t=new ye;t.name=`sign:${i}`;const e=Jf.eyeHeight*.68,n=new Kt(new V(.09,e,.09),Yd);n.position.y=e/2,t.add(n);const s=.62,r=.26,o=new ye;o.position.set(0,e-.1,.045),o.rotation.x=-.16;const a=new Kt(new V(s,r,.05),bS);o.add(a);for(const l of ES(i,s,r))l.position.z+=.026,o.add(l);t.add(o);const c=new Kt(new V(.13,.05,.13),Yd);return c.position.y=e+.02,t.add(c),r2(t,TS(i))}function TS(i){return i.split("-").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}function d0(i){const t=[];let e=0;for(let n=0;n<i.length;n++){t.push(e);const s=i[n+1];s&&(e+=i[n].radius+s.radius+MS)}return{offsets:t,width:e}}function AS(i){const t=new ye;t.name="rows";const{offsets:e,width:n}=d0(i),s=-n/2;for(let r=0;r<i.length;r++){const o=i[r],a=s+e[r],c=new ye;c.name=`row:${o.name}`;const l=u0(o.name);l.position.set(a,0,Rl),c.add(l);for(let h=0;h<h0;h++){const u=o.build({seed:1e3+h*7919});u.position.set(a,0,-h*Rl),c.add(o.solid===!1?u:Se(u))}t.add(c)}return t}function vc(i){const{width:t}=d0(i),e=Math.max(t,ph+h0*Rl)+40;return Math.min(200,Math.max(120,Math.ceil(e/20)*20))}function $d(i){return i*.46}function RS(i){return{zone:i.id,position:new C(0,0,ph),yaw:Math.PI,material:"timber",seed:3300+i.id.length*137}}function CS(i){return{id:i.id,name:i.name,environment:{...ta,fogNear:$d(vc(i.builders))*.45,fogFar:$d(vc(i.builders)),ambientGround:12563096,surface:"stone",room:"open",soundscape:i.soundscape??Ep},spawn:{position:new C(0,.1,ph-2),yaw:0},floor:-20,groundAt:()=>0,build(){const t=new ye;t.add(oh(vc(i.builders))),t.add(AS(i.builders));for(const e of i.extras?.()??[])t.add(e);return t}}}function PS(i,t){return{id:`portal:${i.id}`,a:t,b:RS(i)}}const LS=[iS,oS,_S,wS],IS="sound-stage",Cl=Qf*1.5,f0=14,So=1.15,Oe={refDistance:2,maxDistance:42,rolloff:1.2,reverb:.4},gs=[{kind:"emitter",name:"wind",spec:{model:"wind",id:"wind",options:{gain:.3},...Oe}},{kind:"emitter",name:"foliage",spec:{model:"foliage",id:"foliage",options:{gain:.4},...Oe}},{kind:"emitter",name:"rain",spec:{model:"rain",id:"rain",options:{gain:.5,intensity:.6,surface:"earth"},...Oe}},{kind:"emitter",name:"water",spec:{model:"water",id:"water",options:{gain:.4},...Oe}},{kind:"scatter",name:"drip",spec:{sound:"drip",id:"drip",every:3.5,spread:[.2,.1,.2],...Oe}},{kind:"emitter",name:"fire",spec:{model:"fire",id:"fire",options:{gain:.5},...Oe}},{kind:"emitter",name:"machine",spec:{model:"machine",id:"machine",options:{gain:.35},...Oe}},{kind:"emitter",name:"friction",spec:{model:"friction",id:"friction",options:{motion:"steady",speed:.28,gain:.4},...Oe}},{kind:"emitter",name:"waveguide",spec:{model:"waveguide",id:"waveguide",options:{excite:"chime",pitch:900,decay:3,bright:.7,drive:.3,gain:.4},...Oe}},{kind:"scatter",name:"hammer",spec:{sound:"hammer",id:"hammer",every:4,spread:[.3,.2,.3],...Oe}},{kind:"scatter",name:"clatter",spec:{sound:"clatter",id:"clatter",every:6,spread:[.5,.2,.5],...Oe}},{kind:"emitter",name:"bird",spec:{model:"bird",id:"bird",options:{gain:.2},...Oe}},{kind:"emitter",name:"crowd",spec:{model:"crowd",id:"crowd",options:{gain:.4},...Oe}},{kind:"scatter",name:"animal",spec:{sound:"animal",id:"animal",every:5,spread:[.4,.2,.4],...Oe}},{kind:"scatter",name:"bell",spec:{sound:"bell",id:"bell",every:11,spread:[.2,.1,.2],...Oe,reverb:1}}],DS=gs.map(i=>i.spec.id);function Pl(i){return[-((gs.length-1)*Cl)/2+i*Cl,So+.25,0]}const NS={emitters:gs.flatMap((i,t)=>i.kind==="emitter"?[{...i.spec,at:Pl(t)}]:[]),scatter:gs.flatMap((i,t)=>i.kind==="scatter"?[{...i.spec,at:Pl(t)}]:[])},US=new sn({color:B(z.STONE,.94),flatShading:!0}),FS=new sn({color:B(z.STONE_PALE,1.02),flatShading:!0});function OS(i,t){const e=new ye;e.name=`station:${i}`;const n=new Kt(new V(.8,So,.8),US);n.position.set(t,So/2,0),e.add(Se(n));const s=new Kt(new V(1,.09,1),FS);s.position.set(t,So+.045,0),e.add(Se(s));const r=u0(i);return r.position.set(t,0,1.5),e.add(r),e}function yc(){const i=(gs.length-1)*Cl+f0*2+40;return Math.min(200,Math.max(120,Math.ceil(i/20)*20))}function zS(){return{id:IS,name:"Sound Stage",environment:{...ta,fogNear:yc()*.2,fogFar:yc()*.46,ambientGround:12563096,surface:"stone",room:"open",soundscape:NS},spawn:{position:new C(0,.1,f0-2),yaw:0},floor:-20,groundAt:()=>0,build(){const i=new ye;return i.add(oh(yc())),gs.forEach((t,e)=>{i.add(OS(t.name,Pl(e)[0]))}),i}}}const bi="exterior",Zd="example",Kd="factory",jd=new C(5,0,6),_c=0,kS=new C(14,0,6),BS=0,xc=.07,HS=new C(10,0,6),GS=0,wc=new C(-10,0,22),VS=5,WS=Math.PI,Mc={width:10,depth:8,height:3.4},Qi={width:15,depth:11,height:5.6},XS=new C(0,1,0),Ll=new C(19.7,0,0),qS=Math.PI/2,ks=new C(25.5,0,2.4),YS=[Ll.x-.14,1.2,Ll.z],Il=-5.4,Dl=[-2.4,1.1,4.4],Nl=[1.5,.9,1.9],Ul=[-1.8,2.6,2.4],Fl=[15/2-.34,1.5,1.6],$S={emitters:[{model:"machine",id:"engine-north",at:[Il+1,1.1,Dl[0]],options:{rpm:74,fundamental:52,gain:.15,wear:.55,clank:.45},refDistance:1.4,maxDistance:22,rolloff:1.7,reverb:.3},{model:"machine",id:"engine-south",at:[Il+1,1.1,Dl[2]],options:{rpm:46,fundamental:35,gain:.16,wear:.8,clank:.7},refDistance:1.4,maxDistance:22,rolloff:1.7,reverb:.35},{model:"friction",id:"gantry",at:Ul,options:{motion:"cycle",speed:.26,force:.8,pitch:210,decay:1.4,bright:.4,roughness:.22,gain:.18},refDistance:1.6,maxDistance:22,rolloff:1.5,reverb:.8,importance:1.5},{model:"waveguide",id:"pipe-air",at:Fl,options:{excite:"breath",closed:!0,pitch:190,decay:.9,bright:.28,drive:.55,gain:.3},refDistance:1.2,maxDistance:9,rolloff:1.8,reverb:.4}],scatter:[{sound:"clatter",id:"fitting",at:Nl,spread:[1.1,.4,1.1],every:17,force:[.3,.85],options:{material:"metal",gain:.2,pieces:3},refDistance:1.8,maxDistance:22,rolloff:1.3,reverb:.85}]};function ZS(i){return{zone:bi,position:new C(wc.x+i*VS,wc.y,wc.z),yaw:WS,material:"timber",seed:5200+i*17}}function KS(i){const t=uh.build({seed:5511});t.position.copy(jd),t.rotation.y=_c;const e=P2(t),n=new C(e.x,0,e.z+xc).applyAxisAngle(XS,_c).add(jd),s=[{id:bi,name:"Outside",environment:{...ta,ambientGround:12563096,soundscape:{bed:{model:"wind",id:"wind",options:{gain:.17,tone:3400}},emitters:[{model:"foliage",id:"canopy",at:[i.anchors.tree.x,i.anchors.tree.y,i.anchors.tree.z],options:{density:240,tone:.8,gain:.42,articulation:.22},refDistance:2.5,maxDistance:20,rolloff:1.7,reverb:.35},{model:"friction",id:"limb",at:[i.anchors.tree.x-.4,i.anchors.tree.y-1.2,i.anchors.tree.z],options:{motion:"weather",speed:.22,force:.7,pitch:78,decay:.35,bright:.2,roughness:.4,gain:.4},refDistance:2,maxDistance:22,rolloff:1.6,reverb:.3},{model:"foliage",id:"shrub-a",at:[i.anchors.bush.x,i.anchors.bush.y,i.anchors.bush.z],options:{density:160,tone:1.45,gain:.26,articulation:.34},refDistance:1.4,maxDistance:14,reverb:.25},{model:"foliage",id:"shrub-b",at:[9.2,.5,16.8],options:{density:160,tone:1.45,gain:.26,articulation:.34},refDistance:1.4,maxDistance:14,reverb:.25},{model:"bird",id:"bird",at:[i.anchors.bird.x,i.anchors.bird.y,i.anchors.bird.z],options:{pitch:2600,interval:6,gain:.075,tone:2800},refDistance:4,maxDistance:38,rolloff:1.4,reverb:.85},{model:"machine",id:"mill",at:[i.anchors.machine.x,i.anchors.machine.y,i.anchors.machine.z],options:{rpm:52,fundamental:42,gain:.4},refDistance:2.5,maxDistance:34,rolloff:1.8,reverb:.9,importance:1.6},{model:"water",id:"cistern",at:[ks.x,Y2,ks.z],options:{flow:"cistern",gain:.4,tone:.9},refDistance:1.5,maxDistance:12,rolloff:1.6,reverb:1}],scatter:[{sound:"drip",id:"seep",at:YS,spread:[.3,0,.3],every:3.6,rhythm:"periodic",force:[.7,1],voices:1,options:{gain:.5,radius:[.0019,.0027],cycles:32},refDistance:2,maxDistance:16,rolloff:1.4,reverb:1},{sound:"drip",id:"seep-far",at:[ks.x,1.4,ks.z],spread:[.3,0,.3],every:7.1,rhythm:"periodic",force:[.5,.8],voices:1,options:{gain:.4,radius:[.0031,.0042],cycles:26},refDistance:2,maxDistance:16,rolloff:1.4,reverb:1}]}},spawn:{position:Mw.clone(),yaw:0},floor:-20,build(){const o=i.root;o.add(Se(t));const a=dh.build({seed:8811});a.position.copy(Ll),a.rotation.y=qS,o.add(Se(a));const c=Bp.build({seed:8812});return c.position.copy(ks),o.add(Se(c)),o}},{id:Zd,name:"Example Interior",environment:{...Pd,room:"cell",surface:"wood",fogColor:"#181309",fogNear:9,fogFar:34,ambientSky:10655612,ambientGround:5721148,ambientIntensity:2.3,sunIntensity:1.2,fillIntensity:.8,fillColor:10521706,footstepReverb:.45},spawn:{position:new C(0,.1,1),yaw:Math.PI},floor:-5,build:()=>jS()},{id:Kd,name:"The Factory",environment:{...Pd,room:"hall",surface:"stone",fogColor:"#111519",fogNear:12,fogFar:48,ambientSky:8161172,ambientGround:9077624,ambientIntensity:2.2,sunIntensity:.9,fillIntensity:.85,fillColor:9675701,footstepReverb:.34,soundscape:$S},spawn:{position:new C(0,.1,2),yaw:Math.PI},floor:-5,build:()=>JS()},wb()],r=[{id:"example-door",a:{zone:bi,position:n,yaw:_c,material:"timber",seed:8801},b:{zone:Zd,position:new C(0,0,-8/2+xc),yaw:0,material:"timber",seed:8802}},{id:"factory-door",a:{zone:bi,position:kS,yaw:BS,material:"iron",seed:9301},b:{zone:Kd,position:new C(0,0,-11/2+xc),yaw:0,material:"iron",seed:9302}},{id:"village-gate",a:{zone:bi,position:HS,yaw:GS,material:"timber",seed:4712},b:{zone:fh,position:Ei.clone().setY(_b.heightAt(Ei.x,Ei.z)),yaw:Math.PI,material:"timber",seed:4713}}];return LS.forEach((o,a)=>{s.push(CS(o)),r.push(PS(o,ZS(a)))}),s.push(zS()),{zones:s,portals:r}}function jS(){const i=new ye;i.add(Cp({...Mc,seed:4400,style:Rp,planks:!0,beams:3}));const t=Mc.width/2,e=Mc.depth/2;pe(i,Pp.build({seed:3120}),-t+.9,0,-1.4,0),pe(i,Ml.build({seed:415}),-t+1.1,0,.7,.6);const n=Oo.build({seed:2077});pe(i,n,2.2,0,.6,.08),pe(i,wl.build({seed:411}),2.1,0,2.1,Math.PI),pe(i,wl.build({seed:412}),2.3,0,-.9,0),pe(i,Ml.build({seed:413}),3.6,0,1.8,.4);const s=Oo.build({seed:2078});pe(i,s,-1.6,0,e-.9,Math.PI),pe(i,Qs.build({seed:6602}),-.2,0,2.4,Math.PI*.85);const r=or.build({seed:61});return pe(i,r,t-.9,0,-e+1,.4),pe(i,or.build({seed:66}),t-1,0,-e+2.3,1.1),pe(i,ar.build({seed:63}),-t+.7,0,e-.9,-.3),pe(i,ar.build({seed:67}),t-.8,0,e-1,.2),pe(i,Sl.build({seed:7101}),2.35,bc(n),.35,.6),pe(i,Sl.build({seed:7102}),-1.75,bc(s),e-.95,-.4),pe(i,El.build({seed:7103}),t-.95,bc(r),-e+1,.9),pe(i,El.build({seed:7104}),-t+.55,0,.15,-.5),Se(i)}function JS(){const i=new ye;i.add(Cp({...Qi,seed:7700,style:C2,planks:!1,beams:0}));const t=Qi.width/2,e=Qi.depth/2,n=Il;Dl.forEach((l,h)=>{pe(i,bl.build({seed:3301+h}),n,0,l,Math.PI/2)}),pe(i,Up.build({seed:4401}),5.1,0,2.1,Math.PI/2),pe(i,bl.build({seed:3304}),Nl[0],0,Nl[2],-.35);const s=[[-3.6,-e+.34,0],[3.6,-e+.34,0],[Fl[0],Fl[2],Math.PI/2],[t-.34,-2.4,Math.PI/2]];for(let l=0;l<s.length;l++){const[h,u,f]=s[l],d=Np.build({seed:9101+l});d.position.set(h,0,u),d.rotation.y=f,i.add(d)}const r=Fp.build({seed:9201});r.position.set(t-.22,1.4,-1.4),r.rotation.y=-Math.PI/2,i.add(r);const o=new sn({color:B(z.IRON,.92),flatShading:!0}),a=Qi.height-.12,c=.42;for(const l of[-4.2,-1.4,1.4,4.2]){const h=new ye;for(const[d,m]of[[a,.13],[a-c,.1]]){const v=new Kt(new V(Qi.width,m,m*1.25),o);v.position.set(0,d,0),h.add(v)}const u=9,f=Qi.width/u;for(let d=0;d<u;d++){const m=new Kt(new V(.07,Math.hypot(f,c),.09),o);m.position.set(-15/2+f*(d+.5),a-c/2,0),m.rotation.z=(d%2===0?1:-1)*Math.atan2(f,c),h.add(m)}h.position.z=l,i.add(h)}return pe(i,Op.build({seed:9301}),n+1.9,0,1,Math.PI/2),pe(i,zp.build({seed:9302}),2.4,0,e-.7,0),pe(i,dh.build({seed:9401}),t-.55,0,-e+1.5,-Math.PI/2),pe(i,kp.build({seed:8110}),Ul[0],0,Ul[2],Math.PI/2),pe(i,bo.build({seed:5501}),-.6,0,-2.4,-Math.PI/2),pe(i,bo.build({seed:5502}),-.6,0,4.4,-Math.PI/2),pe(i,bo.build({seed:5503}),1.2,0,-.6,Math.PI/2),Se(i)}function bc(i){return i.geometry.computeBoundingBox(),(i.geometry.boundingBox?.max.y??0)+i.position.y}function pe(i,t,e,n,s,r){t.position.set(e,n,s),t.rotation.y=r,i.add(t)}const Xs=[0,125,250,500,1e3,2e3,5e3,1e4];function QS(i){let t=0,e=0,n=0;for(let r=0;r<i.length;r++){const o=i[r],a=Math.abs(o);a>t&&(t=a),e+=o,n+=o*o}const s=Math.sqrt(n/Math.max(i.length,1));return{peak:t,rms:s,dc:e/Math.max(i.length,1),crest:s>1e-9?20*Math.log10(t/s):0}}function tE(i,t){const e=Math.min(i.length,16384),n=12,s=l=>{let h=0,u=0;const f=2*Math.PI*l/t;for(let d=0;d<e;d++){const m=f*d;h+=i[d]*Math.cos(m),u+=i[d]*Math.sin(m)}return(h*h+u*u)/e},r=[];let o=0,a=0;for(let l=0;l<Xs.length;l++){const h=Math.max(Xs[l],20),u=l+1<Xs.length?Xs[l+1]:Math.min(t/2,2e4);let f=0;for(let d=0;d<n;d++){const m=h*Math.pow(u/h,(d+.5)/n),v=s(m);f+=v,o+=v*m,a+=v}r.push(f)}const c=r.reduce((l,h)=>l+h,0);return{bands:c>0?r.map(l=>l/c):r.map(()=>0),centroid:a>0?o/a:0}}function eE(i,t){if(t<=1e-9)return-1/0;const e=[.15,.4,.7,.95,1.1,1.15,.9,.5];let n=0;for(let s=0;s<i.length;s++)n+=i[s]*(e[s]??.5);return 20*Math.log10(t)+10*Math.log10(Math.max(n,1e-6))}function nE(i,t){const e=QS(i),{bands:n,centroid:s}=tE(i,t);return{...e,bands:n,centroid:s,loudness:eE(n,e.rms)}}function iE(i,t){let e=0;for(let a=0;a<i.length;a++)e+=i[a];e/=Math.max(i.length,1);let n=0;for(let a=0;a<i.length;a++)n+=(i[a]-e)**2;if(n/=Math.max(i.length,1),n<1e-12)return 0;const s=a=>{if(a>=i.length)return 0;let c=0;for(let l=0;l+a<i.length;l++)c+=(i[l]-e)*(i[l+a]-e);return Math.abs(c/((i.length-a)*n))},r=t.map(s),o=r.findIndex(a=>a<.2);return o===-1?1:Math.max(0,...r.slice(o))}const Bs=1024,sE=6;function rE(i,t){const e={context:i,settings:{...lp},weather:new op,noise:sp(i),dry:i.createGain(),send:i.createGain(),register:()=>{},unregister:()=>{}};return e.dry.connect(t),e.send.connect(t),e}async function oE(i,t=48e3){const e=i.seconds??sE,n=Math.ceil(e*t/Bs)*Bs,s=new OfflineAudioContext(1,n,t),r=rE(s,s.destination),o=i.build(r);o.output.connect(s.destination),i.ready&&await i.ready(o);const a=Bs/t,c=Math.floor(n/Bs);for(let h=1;h<c;h++)s.suspend(h*Bs/t).then(()=>{r.weather.update(a),o.update?.(a,r),s.resume()});return r.weather.update(a),o.update?.(a,r),{signal:(await s.startRendering()).getChannelData(0),model:o,rate:t}}const aE={peak:.95,dc:.01,crest:[4,26],loudnessSpread:3,periodicity:.35},cE={loudness:1.5,crest:2.5,centroid:.5,band:.12},lE={},hE={rules:aE,drift:cE,models:lE},vs=hE;function Hs(i,t,e,n=8){return{name:i,seconds:n,build(s){const r=Sp(s,t);let o=0;return{output:r.output,update(a){o-=a,!(o>0)&&(o=e,r.fire(s.context.currentTime+.05,.45+Math.random()*.55))},dispose:()=>r.dispose()}}}}const uE=[{name:"wind",seconds:12,build:i=>up(i)},{name:"foliage",seconds:12,build:i=>fp(i)},{name:"rain",seconds:8,build:i=>yp(i,{intensity:.6})},{name:"water",seconds:8,build:i=>_p(i)},{name:"fire",seconds:8,build:i=>gp(i)},{name:"machine",seconds:12,build:i=>pp(i)},{name:"friction",seconds:10,build:i=>Mp(i,{motion:"steady"}),ready:i=>i.ready},{name:"waveguide",seconds:10,build:i=>bp(i,{excite:"chime",drive:.3}),ready:i=>i.ready},{name:"bird",seconds:16,build:i=>mp(i)},{name:"crowd",seconds:10,build:i=>wp(i)},Hs("hammer",{sound:"hammer"},1.1),Hs("clatter",{sound:"clatter"},1.6),Hs("animal",{sound:"animal"},1.8),Hs("drip",{sound:"drip"},.9),Hs("bell",{sound:"bell"},3.5,12)];function dE(i,t){const e=Math.round(t*.05),n=Math.floor(i.length/e),s=new Float32Array(n);for(let r=0;r<n;r++){let o=0;for(let a=0;a<e;a++){const c=i[r*e+a];o+=c*c}s[r]=Math.sqrt(o/e)}return s}function fE(i,t){const e=[],{rules:n}=vs;return i.peak>n.peak&&e.push(`peak ${i.peak.toFixed(2)} — clipping`),Math.abs(i.dc)>n.dc&&e.push(`dc ${i.dc.toFixed(4)}`),i.crest<n.crest[0]&&e.push(`crest ${i.crest.toFixed(1)} dB — a drone`),i.crest>n.crest[1]&&e.push(`crest ${i.crest.toFixed(1)} dB — bubble wrap`),t>n.periodicity&&e.push(`periodicity ${t.toFixed(2)} — it loops`),e}function pE(i,t){const e=vs.models[i];if(!e)return[];const n=[],{drift:s}=vs;Math.abs(t.loudness-e.loudness)>s.loudness&&n.push(`loudness ${e.loudness.toFixed(1)} → ${t.loudness.toFixed(1)}`),Math.abs(t.crest-e.crest)>s.crest&&n.push(`crest ${e.crest.toFixed(1)} → ${t.crest.toFixed(1)}`),Math.abs(Math.log2(Math.max(t.centroid,1)/Math.max(e.centroid,1)))>s.centroid&&n.push(`centroid ${e.centroid.toFixed(0)} → ${t.centroid.toFixed(0)} Hz`);for(let r=0;r<t.bands.length;r++)Math.abs(t.bands[r]-(e.bands[r]??0))>s.band&&n.push(`band ${Xs[r]}+ Hz moved ${((t.bands[r]-e.bands[r])*100).toFixed(0)}%`);return n}async function mE(){const i=[],t={};for(const s of uE){const{signal:r,model:o,rate:a}=await oE(s),c=nE(r,a),l=dE(r,a),h=[];for(let f=4;f<l.length/4;f+=2)h.push(f);const u=iE(l,h);i.push({name:s.name,measurements:c,periodicity:u,problems:[...fE(c,u),...pE(s.name,c)],novel:vs.models[s.name]===void 0}),t[s.name]={loudness:Number(c.loudness.toFixed(2)),crest:Number(c.crest.toFixed(2)),centroid:Number(c.centroid.toFixed(0)),bands:c.bands.map(f=>Number(f.toFixed(4)))},o.dispose()}const e=i.map(s=>s.measurements.loudness).filter(Number.isFinite),n=e.length>1?Math.max(...e)-Math.min(...e):0;if(n>vs.rules.loudnessSpread){const s=[...i].sort((a,c)=>c.measurements.loudness-a.measurements.loudness),r=s[0],o=s[s.length-1];r.problems.push(`loudest in the library, ${n.toFixed(1)} above ${o.name}`),o.problems.push(`quietest in the library, ${n.toFixed(1)} below ${r.name}`)}return{rows:i,spread:n,failures:i.filter(s=>s.problems.length>0).length,captured:t}}async function gE(){console.log("audition: rendering the library…");const i=await mE();console.table(i.rows.map(n=>({model:n.name,loudness:n.measurements.loudness.toFixed(1),crest:n.measurements.crest.toFixed(1),"centroid Hz":n.measurements.centroid.toFixed(0),peak:n.measurements.peak.toFixed(3),loop:n.periodicity.toFixed(2),status:n.problems.length===0?n.novel?"new":"ok":n.problems.join("; ")}))),console.log(`audition: loudness spread ${i.spread.toFixed(1)} (rule: ${vs.rules.loudnessSpread}), ${i.failures} of ${i.rows.length} flagged`);const t=JSON.stringify(i.captured,null,2),e=i.rows.filter(n=>n.novel).map(n=>n.name);console.log(e.length>0?`audition: no baseline yet for ${e.join(", ")}.`:"audition: current measurements, for re-capture after a deliberate change."),console.log("If this run sounded right, replace the `models` block of src/audio/baselines.json with the object below and commit it — drift is only visible against something."),console.log(t);try{await navigator.clipboard.writeText(t),console.log("audition: copied to the clipboard.")}catch{console.log("audition: could not reach the clipboard — copy the block above.")}return i}const Sc=-90,yi=240,Gs=92;function vE(i){const t=document.createElement("canvas"),e=Math.min(window.devicePixelRatio||1,2);t.width=yi*e,t.height=Gs*e,Object.assign(t.style,{position:"fixed",right:"8px",bottom:"8px",width:`${yi}px`,height:`${Gs}px`,zIndex:"20",pointerEvents:"none",display:"none",background:"rgba(8, 10, 12, 0.72)",borderRadius:"3px"}),document.body.appendChild(t);const n=t.getContext("2d"),s=i.analyser,r=new Uint8Array(s.frequencyBinCount),o=new Float32Array(s.fftSize);let a=0;return{visible:!1,update(){if(t.style.display=this.visible?"block":"none",!this.visible||!n)return;s.getByteFrequencyData(r),s.getFloatTimeDomainData(o);let l=0;for(let v=0;v<o.length;v++){const g=Math.abs(o[v]);g>l&&(l=g)}a=Math.max(l,a*.94),n.setTransform(e,0,0,e,0,0),n.clearRect(0,0,yi,Gs);const h=i.context.sampleRate/2,u=Gs-12,f=30;n.fillStyle="#7fb2c9";for(let v=0;v<yi;v++){const g=f*Math.pow(h/f,v/yi),p=Math.min(r.length-1,Math.round(g/h*r.length)),_=r[p]/255*u;n.fillRect(v,u-_,1,_)}n.fillStyle="rgba(255, 255, 255, 0.16)";for(let v=100;v<h;v*=10){const g=Math.log(v/f)/Math.log(h/f)*yi;n.fillRect(g,0,1,u)}const d=a>0?20*Math.log10(a):Sc,m=Math.max(0,(d-Sc)/-Sc)*yi;n.fillStyle=d>-1?"#e05a4a":d>-6?"#e0b44a":"#6fbf73",n.fillRect(0,Gs-8,m,6)},dispose(){t.remove()}}}const yE=new Set(["speed"]);function Ec(i,t,e){let n=null,s=null;const r={};function o(a){const c=Object.keys(a.meta.params).sort();for(const h of c)r[h]=a.get(h);const l=i.addFolder(t).close();for(const h of c){const u=a.meta.params[h];l.add(r,h,u.min,u.max,u.step).name(yE.has(h)?`${h} (driven)`:h).onChange(f=>a.set(h,f)).listen()}n=l,s=a}return{sync(){const a=e();if(a===null){n?.destroy(),n=null,s=null;return}if(a!==s){n?.destroy(),o(a);return}for(const c of Object.keys(a.meta.params))r[c]=a.get(c)},dispose(){n?.destroy(),n=null,s=null}}}const _E=.35;class xE{root;bar;label;constructor(t){const e=document.getElementById("loading"),n=e?.querySelector(".loading-bar")??null,s=e?.querySelector(".loading-label")??null;if(e&&n&&s)this.root=e,this.bar=n,this.label=s;else{this.root=document.createElement("div"),this.root.id="loading";const r=document.createElement("div");r.className="loading-track",this.bar=document.createElement("div"),this.bar.className="loading-bar",r.appendChild(this.bar),this.label=document.createElement("div"),this.label.className="loading-label",this.root.append(r,this.label),t.appendChild(this.root)}document.body.classList.add("is-loading")}async step(t,e,n){return this.label.textContent=t,this.bar.style.transform=`scaleX(${Math.min(Math.max(e,0),1)})`,await Jd(),n()}async done(){this.bar.style.transform="scaleX(1)",this.label.textContent="ready",await Jd(),await Qd(.18),this.root.classList.add("is-gone"),document.body.classList.remove("is-loading"),await Qd(_E),this.root.remove()}fail(t){this.label.textContent=t,this.bar.style.transform="scaleX(1)",this.root.classList.add("is-failed")}}function Jd(){return new Promise(i=>{requestAnimationFrame(()=>requestAnimationFrame(()=>i()))})}function Qd(i){return new Promise(t=>window.setTimeout(t,i*1e3))}const mh=document.getElementById("viewport");if(!(mh instanceof HTMLCanvasElement))throw new Error("#viewport canvas is missing from index.html");const ko=document.getElementById("overlay");if(!(ko instanceof HTMLElement))throw new Error("#overlay is missing from index.html");const Ii=new xx(mh),tr=new wx,we=lM();Ii.scene.fog=new Yo(657935,20,90);const vn=new Gx(Ii),wE=new R2(Ii.renderer);Ii.onResize=()=>vn.resize();const Bo=new Lo,Ho=new Qx(mh),Xe=new hw(Ii.camera,Ho,Bo),Ms=new xE(document.body),Si=await Ms.step("shaping the ground",.12,()=>new Sw),Wt=new w2({scene:Ii.scene,collider:Bo,player:Xe,postfx:vn,interaction:new a2,reticle:new b2(ko),fade:new S2(ko)}),p0={shadows:!0},m0=KS(Si);for(const i of m0.zones)Wt.register(i);for(const i of m0.portals)Wt.link(i);Wt.setShadows(p0.shadows);vn.aimSun(Wt.sunDirection);await Ms.step("settling the world",.6,()=>Wt.enter(bi));await Ms.step("raising arkstin",.78,()=>Wt.prebuild(fh));const Me=new Kw;let Ve=null,tf;const ME=new Map([["canopy",.22],["shrub-a",.34],["shrub-b",.34],["wood-north",.2],["wood-east",.22],["hedge",.34]]);await Ms.step("rendering the rooms",.86,()=>Me.ready);await Ms.step("tuning the air",.96,()=>{Ve=new Pw(Me,.55),Xe.onFootstep=i=>{if(!Ve)return;const t=Xe.position;Ve.surface=Wt.surfaceAt(t.x,t.z),Ve.step(i)},Xe.onLand=i=>{if(!Ve)return;const t=Xe.position;Ve.surface=Wt.surfaceAt(t.x,t.z),Ve.land(i)},Xe.onJump=()=>{if(!Ve)return;const i=Xe.position;Ve.surface=Wt.surfaceAt(i.x,i.z),Ve.jump()},Wt.attachAudio({engine:Me,footsteps:Ve})});$f()?(new dw(Ho,ko),document.body.classList.add("is-touch","is-playing")):Ho.onLockChange=i=>document.body.classList.toggle("is-playing",i);if(we.gui){const i=vn.settings,t=()=>vn.apply(),e=we.gui.addFolder("look");e.add(p0,"shadows").name("cast shadows").onChange(w=>Wt.setShadows(w)),e.add(i,"pixelSize",1,12,1).onChange(t),e.add(i,"normalEdgeStrength",0,2,.05).onChange(t),e.add(i,"depthEdgeStrength",0,2,.05).onChange(t),e.add(i,"quantize",["off","levels","palette"]).onChange(t),e.add(i,"levels",2,16,1).onChange(t),e.add(i,"ditherScale",0,2,.05).name("dither (steps)").onChange(t),e.add(i,"ditherPattern",{bayer:"bayer","blue noise":"blue","gradient noise":"noise"}).onChange(t),e.add(i,"ditherMatrix",{"2×2":2,"4×4":4,"8×8":8}).name("bayer size").onChange(t);const n=we.gui.addFolder("vignette").close();n.add(i,"vignetteStrength",0,1,.01).onChange(t),n.add(i,"vignetteRadius",0,1.5,.01).onChange(t),n.add(i,"vignetteSoftness",.01,1.5,.01).onChange(t);const s=we.gui.addFolder("sky");s.addColor(i.sky,"zenith").onChange(t),s.addColor(i.sky,"horizon").onChange(t),s.addColor(i.sky,"ground").name("below horizon").onChange(t),s.add(i.sky,"curve",.1,3,.05).onChange(t);const r=we.gui.addFolder("clouds");r.addColor(i.sky,"cloudColor").name("colour").onChange(t),r.add(i.sky,"cloudCover",.1,.9,.01).name("cover").onChange(t),r.add(i.sky,"cloudSoftness",.01,.6,.01).name("softness").onChange(t),r.add(i.sky,"cloudScale",.2,4,.05).name("scale").onChange(t),r.add(i.sky,"cloudOpacity",0,1,.01).name("opacity").onChange(t),r.add(i.sky,"cloudDrift",0,.1,.001).name("drift").onChange(t);const o=we.gui.addFolder("light").close();o.add(Wt.lights.sun,"intensity",0,5,.1).name("sun"),o.add(Wt.lights.ambient,"intensity",0,5,.1).name("ambient");const a=we.gui.addFolder("fog").close();a.add(i,"linkFogToSky").name("match horizon").onChange(t),a.addColor(i,"fogColor").onChange(t),a.add(i,"fogNear",0,200,1).onChange(t),a.add(i,"fogFar",0,400,1).onChange(t);const c=we.gui.addFolder("palette").close();i.palette.forEach((w,A)=>{c.addColor(i.palette,A).name(`${A}`).onChange(t)});const l=we.gui.addFolder("surfaces").close();for(const w of Object.keys(Si.colors))l.addColor(Si.colors,w).onChange(()=>Si.applyColors());l.add({reset:()=>{Si.resetColors(),we.gui?.controllersRecursive().forEach(w=>w.updateDisplay())}},"reset");const h=we.gui.addFolder("preset");h.add({save:()=>{const w=vn.save();h.title(w?"preset · saved":"preset · SAVE FAILED")}},"save"),h.add({reset:()=>{vn.reset(),we.gui?.controllersRecursive().forEach(w=>w.updateDisplay())}},"reset"),h.add({copy:()=>{navigator.clipboard?.writeText(JSON.stringify(vn.settings,null,2))}},"copy").name("copy JSON");const u=Xe.tuning,f=we.gui.addFolder("movement");f.add(u,"walkSpeed",1,12,.1),f.add(u,"sprintScale",1,3,.05),f.add(u,"groundAccel",1,60,.5),f.add(u,"airAccel",0,20,.1),f.add(u,"friction",0,30,.5),f.add(u,"gravity",5,60,.5),f.add(u,"jumpSpeed",2,14,.1),f.add(u,"autoHop");const d=we.gui.addFolder("contact").close();d.add(u,"slopeLimitDeg",5,85,1),d.add(u,"stepHeight",0,1,.01),d.add(u,"coyoteTime",0,.5,.01),d.add(u,"jumpBuffer",0,.5,.01);const m=we.gui.addFolder("view");m.add(u,"lookSensitivity",2e-4,.008,1e-4),m.add(u,"invertY"),m.add(u,"eyeHeight",1,2,.01),m.add(u,"fov",50,110,1),m.add(u,"sprintFov",50,120,1);const v=we.gui.addFolder("head bob").close();v.add(u,"bobAmount",0,.15,.001),v.add(u,"bobSway",0,.15,.001),v.add(u,"bobRoll",0,.05,5e-4),v.add(u,"bobStepsPerSecond",.5,5,.05),v.add(u,"bobSpeedInfluence",0,1,.05),v.add(u,"landDip",0,.1,.001);const g=we.gui.addFolder("audio");g.add(Me.settings,"masterVolume",0,1,.01).name("volume"),g.add(Me.settings,"reverbAmount",0,2,.01).name("reverb").onChange(()=>Me.applyReverbAmount()),g.add(Me.settings,"airAbsorption",0,1,.01).name("air absorption"),g.add(Me.settings,"occlusion",0,1,.01).name("occlusion");const p=we.gui.addFolder("weather");p.add(Me.weather.settings,"windSpeed",0,1,.01).name("wind"),p.add(Me.weather.settings,"gustDepth",0,1,.01).name("gust depth"),p.add(Me.weather.settings,"gustRate",.01,.6,.01).name("gust rate");const _={windTone:3400,leaves:1,machineRpm:52,fireIntensity:.85,rain:0,water:1,strike:()=>Wt.sound?.findField("smith")?.trigger(),drop:()=>Wt.sound?.findField("yards")?.trigger(),toll:()=>Wt.sound?.findField("bell")?.trigger()};p.add(_,"windTone",700,9e3,50).name("wind tone (Hz)").onChange(w=>{Wt.sound?.find("wind")?.setTone(w)}),p.add(_,"leaves",0,2,.01).name("leaf articulation").onChange(w=>{for(const[A,N]of ME)Wt.sound?.find(A)?.setArticulation(N*w)}),p.add(_,"machineRpm",0,200,1).name("mill rpm").onChange(w=>{Wt.sound?.find("mill")?.setRpm(w)}),p.add(_,"fireIntensity",0,1,.01).name("forge intensity").onChange(w=>{Wt.sound?.find("forge")?.setIntensity(w)}),p.add(_,"rain",0,1,.01).name("rain").onChange(w=>{Wt.sound?.find("rain")?.setIntensity(w)}),p.add(_,"water",0,1,.01).name("water flow").onChange(w=>{Wt.sound?.find("cistern")?.setRate(w)}),p.add(_,"strike").name("hammer now"),p.add(_,"drop").name("clatter now"),p.add(_,"toll").name("bell now");const y={speed:"0.00",grounded:"no",position:"",triangles:Bo.triangles,zone:"—",crossings:0,room:"—",audio:"waiting for a click",gust:"0.00",swell:"0.00",machine:"—",emitters:"—"},x=we.gui.addFolder("state");x.add(y,"speed").listen().disable(),x.add(y,"grounded").listen().disable(),x.add(y,"position").listen().disable(),x.add(y,"zone").listen().disable(),x.add(y,"crossings").listen().disable(),x.add(y,"room").listen().disable(),x.add(y,"audio").listen().disable(),x.add(y,"gust").listen().disable(),x.add(y,"swell").listen().disable(),x.add(y,"machine").listen().disable(),x.add(y,"emitters").name("hrtf / panned / virtual").listen().disable(),x.add(y,"triangles").listen().disable(),x.add({respawn:()=>Wt.respawn()},"respawn");const b=we.gui.addFolder("zones");for(const w of Wt.zones.values())b.add({go:()=>Wt.enter(w.id)},"go").name(w.name);const S=vE(Me);tr.add(()=>S.update());const E=we.gui.addFolder("sound stage").close(),T={solo:"all",reverb:"—",audition:()=>{gE()}};E.add(T,"solo",["all",...DS]).name("solo").onChange(w=>{Wt.sound?.setSolo(w==="all"?null:w)}),E.add(T,"reverb").listen().disable(),E.add(T,"audition").name("audition the library"),E.add(S,"visible").name("spectrum");const M=[Ec(E,"reverb",()=>Me.reverbControls),...["gantry","gate","limb","friction"].map(w=>Ec(E,w,()=>Wt.sound?.find(w)?.loop??null)),...["pipe-air","waveguide"].map(w=>Ec(E,w,()=>Wt.sound?.find(w)?.loop??null))];tr.add(()=>{for(const w of M)w.sync()}),tr.add(()=>{y.speed=Xe.speed.toFixed(2),y.grounded=Xe.isGrounded?"yes":"no";const w=Xe.position;y.position=`${w.x.toFixed(1)}, ${w.y.toFixed(1)}, ${w.z.toFixed(1)}`,y.zone=Wt.current?.name??"—",y.crossings=Wt.crossings,y.triangles=Bo.triangles,y.room=Me.room??"open",T.reverb=Me.reverbKind==="fdn"?"fdn — tunable":"convolution — fixed",y.audio=Ve===null?"rendering…":Me.context.state,y.gust=Me.weather.strength.toFixed(2),y.swell=Me.weather.swell.toFixed(2),y.machine=Wt.sound?.find("mill")?.phase??"—";const A=Me.voiceCounts;y.emitters=Wt.sound===null?"—":`${A.hrtf} / ${A.panned} / ${A.virtual} · ${Wt.sound.occludedCount} occl`})}tr.add((i,t)=>{Xe.update(i);const e=Wt.current;e&&Xe.position.y<e.floor&&Wt.respawn();const n=Wt.update();Ho.takeInteract()&&n&&Wt.use(n);const r=Me.update(i,Ii.camera);if(Wt.updateSound(i,r),Wt.current?.id===bi){const o=Si.roomAt(Me.listenerPosition);o!==tf&&(tf=o,Me.setRoom(o??"open"),Wt.sound?.setBedLevel(o===null?1:.22),Wt.sound?.find("wind")?.setTone(o===null?3400:900),Ve&&(Ve.surface=o===null?"earth":"stone"))}Si.update(i,Wt.sound?.find("mill")?.currentRpm??0),vn.render(t),wE.update(),we.update()});Xe.update(0);vn.render(0);await Ms.done();tr.start();
