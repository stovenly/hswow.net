(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const eu="170",zg=0,ad=1,Bg=2,ap=1,cp=2,Vn=3,wi=0,Ke=1,yn=2,Kn=0,Is=1,Bl=2,cd=3,ld=4,Hg=5,Hi=100,Gg=101,Vg=102,Wg=103,Xg=104,qg=200,Yg=201,$g=202,Zg=203,Hl=204,Gl=205,Kg=206,jg=207,Jg=208,Qg=209,t1=210,e1=211,n1=212,i1=213,s1=214,Vl=0,Wl=1,Xl=2,ks=3,ql=4,Yl=5,$l=6,Zl=7,nu=0,o1=1,r1=2,vi=0,lp=1,hp=2,up=3,dp=4,a1=5,fp=6,pp=7,mp=300,zs=301,Bs=302,Kl=303,jl=304,Va=306,Yi=1e3,qn=1001,Jl=1002,Oe=1003,c1=1004,cr=1005,Fe=1006,rc=1007,gi=1008,vn=1009,gp=1010,yp=1011,Go=1012,iu=1013,$i=1014,Yn=1015,Ei=1016,su=1017,ou=1018,Hs=1020,vp=35902,wp=1021,_p=1022,un=1023,xp=1024,Mp=1025,Ls=1026,Gs=1027,Wa=1028,ru=1029,bp=1030,au=1031,cu=1033,da=33776,fa=33777,pa=33778,ma=33779,Ql=35840,th=35841,eh=35842,nh=35843,ih=36196,sh=37492,oh=37496,rh=37808,ah=37809,ch=37810,lh=37811,hh=37812,uh=37813,dh=37814,fh=37815,ph=37816,mh=37817,gh=37818,yh=37819,vh=37820,wh=37821,ga=36492,_h=36494,xh=36495,Sp=36283,Mh=36284,bh=36285,Sh=36286,l1=3200,Ep=3201,lu=0,h1=1,Xn="",on="srgb",Ks="srgb-linear",Xa="linear",me="srgb",ns=7680,hd=519,u1=512,d1=513,f1=514,Tp=515,p1=516,m1=517,g1=518,y1=519,ud=35044,dd="300 es",$n=2e3,ba=2001;class js{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const o=s.indexOf(e);o!==-1&&s.splice(o,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let o=0,r=s.length;o<r;o++)s[o].call(this,t);t.target=null}}}const ze=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let fd=1234567;const Uo=Math.PI/180,Vs=180/Math.PI;function Ji(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ze[i&255]+ze[i>>8&255]+ze[i>>16&255]+ze[i>>24&255]+"-"+ze[t&255]+ze[t>>8&255]+"-"+ze[t>>16&15|64]+ze[t>>24&255]+"-"+ze[e&63|128]+ze[e>>8&255]+"-"+ze[e>>16&255]+ze[e>>24&255]+ze[n&255]+ze[n>>8&255]+ze[n>>16&255]+ze[n>>24&255]).toLowerCase()}function Re(i,t,e){return Math.max(t,Math.min(e,i))}function hu(i,t){return(i%t+t)%t}function v1(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function w1(i,t,e){return i!==t?(e-i)/(t-i):0}function Fo(i,t,e){return(1-e)*i+e*t}function _1(i,t,e,n){return Fo(i,t,1-Math.exp(-e*n))}function x1(i,t=1){return t-Math.abs(hu(i,t*2)-t)}function M1(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function b1(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function S1(i,t){return i+Math.floor(Math.random()*(t-i+1))}function E1(i,t){return i+Math.random()*(t-i)}function T1(i){return i*(.5-Math.random())}function A1(i){i!==void 0&&(fd=i);let t=fd+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function R1(i){return i*Uo}function C1(i){return i*Vs}function P1(i){return(i&i-1)===0&&i!==0}function I1(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function L1(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function D1(i,t,e,n,s){const o=Math.cos,r=Math.sin,a=o(e/2),c=r(e/2),l=o((t+n)/2),h=r((t+n)/2),u=o((t-n)/2),f=r((t-n)/2),d=o((n-t)/2),g=r((n-t)/2);switch(s){case"XYX":i.set(a*h,c*u,c*f,a*l);break;case"YZY":i.set(c*f,a*h,c*u,a*l);break;case"ZXZ":i.set(c*u,c*f,a*h,a*l);break;case"XZX":i.set(a*h,c*g,c*d,a*l);break;case"YXY":i.set(c*d,a*h,c*g,a*l);break;case"ZYZ":i.set(c*g,c*d,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function bs(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function qe(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Oo={DEG2RAD:Uo,RAD2DEG:Vs,generateUUID:Ji,clamp:Re,euclideanModulo:hu,mapLinear:v1,inverseLerp:w1,lerp:Fo,damp:_1,pingpong:x1,smoothstep:M1,smootherstep:b1,randInt:S1,randFloat:E1,randFloatSpread:T1,seededRandom:A1,degToRad:R1,radToDeg:C1,isPowerOfTwo:P1,ceilPowerOfTwo:I1,floorPowerOfTwo:L1,setQuaternionFromProperEuler:D1,normalize:qe,denormalize:bs};class tt{constructor(t=0,e=0){tt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Re(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),o=this.x-t.x,r=this.y-t.y;return this.x=o*n-r*s+t.x,this.y=o*s+r*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Kt{constructor(t,e,n,s,o,r,a,c,l){Kt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,o,r,a,c,l)}set(t,e,n,s,o,r,a,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=o,h[5]=c,h[6]=n,h[7]=r,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,o=this.elements,r=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],f=n[2],d=n[5],g=n[8],y=s[0],m=s[3],p=s[6],_=s[1],w=s[4],v=s[7],b=s[2],S=s[5],E=s[8];return o[0]=r*y+a*_+c*b,o[3]=r*m+a*w+c*S,o[6]=r*p+a*v+c*E,o[1]=l*y+h*_+u*b,o[4]=l*m+h*w+u*S,o[7]=l*p+h*v+u*E,o[2]=f*y+d*_+g*b,o[5]=f*m+d*w+g*S,o[8]=f*p+d*v+g*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],r=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*r*h-e*a*l-n*o*h+n*a*c+s*o*l-s*r*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],r=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*r-a*l,f=a*c-h*o,d=l*o-r*c,g=e*u+n*f+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/g;return t[0]=u*y,t[1]=(s*l-h*n)*y,t[2]=(a*n-s*r)*y,t[3]=f*y,t[4]=(h*e-s*c)*y,t[5]=(s*o-a*e)*y,t[6]=d*y,t[7]=(n*c-l*e)*y,t[8]=(r*e-n*o)*y,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,o,r,a){const c=Math.cos(o),l=Math.sin(o);return this.set(n*c,n*l,-n*(c*r+l*a)+r+t,-s*l,s*c,-s*(-l*r+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(ac.makeScale(t,e)),this}rotate(t){return this.premultiply(ac.makeRotation(-t)),this}translate(t,e){return this.premultiply(ac.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const ac=new Kt;function Ap(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Sa(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function N1(){const i=Sa("canvas");return i.style.display="block",i}const pd={};function Ro(i){i in pd||(pd[i]=!0,console.warn(i))}function U1(i,t,e){return new Promise(function(n,s){function o(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(o,e);break;default:n()}}setTimeout(o,e)})}function F1(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function O1(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const re={enabled:!0,workingColorSpace:Ks,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===me&&(i.r=jn(i.r),i.g=jn(i.g),i.b=jn(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===me&&(i.r=Ds(i.r),i.g=Ds(i.g),i.b=Ds(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Xn?Xa:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function jn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ds(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const md=[.64,.33,.3,.6,.15,.06],gd=[.2126,.7152,.0722],yd=[.3127,.329],vd=new Kt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),wd=new Kt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);re.define({[Ks]:{primaries:md,whitePoint:yd,transfer:Xa,toXYZ:vd,fromXYZ:wd,luminanceCoefficients:gd,workingColorSpaceConfig:{unpackColorSpace:on},outputColorSpaceConfig:{drawingBufferColorSpace:on}},[on]:{primaries:md,whitePoint:yd,transfer:me,toXYZ:vd,fromXYZ:wd,luminanceCoefficients:gd,outputColorSpaceConfig:{drawingBufferColorSpace:on}}});let is;class k1{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{is===void 0&&(is=Sa("canvas")),is.width=t.width,is.height=t.height;const n=is.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=is}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Sa("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),o=s.data;for(let r=0;r<o.length;r++)o[r]=jn(o[r]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(jn(e[n]/255)*255):e[n]=jn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let z1=0;class Rp{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:z1++}),this.uuid=Ji(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let o;if(Array.isArray(s)){o=[];for(let r=0,a=s.length;r<a;r++)s[r].isDataTexture?o.push(cc(s[r].image)):o.push(cc(s[r]))}else o=cc(s);n.url=o}return e||(t.images[this.uuid]=n),n}}function cc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?k1.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let B1=0;class je extends js{constructor(t=je.DEFAULT_IMAGE,e=je.DEFAULT_MAPPING,n=qn,s=qn,o=Fe,r=gi,a=un,c=vn,l=je.DEFAULT_ANISOTROPY,h=Xn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:B1++}),this.uuid=Ji(),this.name="",this.source=new Rp(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=o,this.minFilter=r,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new tt(0,0),this.repeat=new tt(1,1),this.center=new tt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Kt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==mp)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Yi:t.x=t.x-Math.floor(t.x);break;case qn:t.x=t.x<0?0:1;break;case Jl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Yi:t.y=t.y-Math.floor(t.y);break;case qn:t.y=t.y<0?0:1;break;case Jl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}je.DEFAULT_IMAGE=null;je.DEFAULT_MAPPING=mp;je.DEFAULT_ANISOTROPY=1;class le{constructor(t=0,e=0,n=0,s=1){le.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,o=this.w,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s+r[12]*o,this.y=r[1]*e+r[5]*n+r[9]*s+r[13]*o,this.z=r[2]*e+r[6]*n+r[10]*s+r[14]*o,this.w=r[3]*e+r[7]*n+r[11]*s+r[15]*o,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,o;const c=t.elements,l=c[0],h=c[4],u=c[8],f=c[1],d=c[5],g=c[9],y=c[2],m=c[6],p=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+y)<.1&&Math.abs(g+m)<.1&&Math.abs(l+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const w=(l+1)/2,v=(d+1)/2,b=(p+1)/2,S=(h+f)/4,E=(u+y)/4,T=(g+m)/4;return w>v&&w>b?w<.01?(n=0,s=.707106781,o=.707106781):(n=Math.sqrt(w),s=S/n,o=E/n):v>b?v<.01?(n=.707106781,s=0,o=.707106781):(s=Math.sqrt(v),n=S/s,o=T/s):b<.01?(n=.707106781,s=.707106781,o=0):(o=Math.sqrt(b),n=E/o,s=T/o),this.set(n,s,o,e),this}let _=Math.sqrt((m-g)*(m-g)+(u-y)*(u-y)+(f-h)*(f-h));return Math.abs(_)<.001&&(_=1),this.x=(m-g)/_,this.y=(u-y)/_,this.z=(f-h)/_,this.w=Math.acos((l+d+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class H1 extends js{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new le(0,0,t,e),this.scissorTest=!1,this.viewport=new le(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Fe,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const o=new je(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);o.flipY=!1,o.generateMipmaps=n.generateMipmaps,o.internalFormat=n.internalFormat,this.textures=[];const r=n.count;for(let a=0;a<r;a++)this.textures[a]=o.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,o=this.textures.length;s<o;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Rp(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class wn extends H1{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Cp extends je{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Oe,this.minFilter=Oe,this.wrapR=qn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class G1 extends je{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Oe,this.minFilter=Oe,this.wrapR=qn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ti{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,o,r,a){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3];const f=o[r+0],d=o[r+1],g=o[r+2],y=o[r+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=f,t[e+1]=d,t[e+2]=g,t[e+3]=y;return}if(u!==y||c!==f||l!==d||h!==g){let m=1-a;const p=c*f+l*d+h*g+u*y,_=p>=0?1:-1,w=1-p*p;if(w>Number.EPSILON){const b=Math.sqrt(w),S=Math.atan2(b,p*_);m=Math.sin(m*S)/b,a=Math.sin(a*S)/b}const v=a*_;if(c=c*m+f*v,l=l*m+d*v,h=h*m+g*v,u=u*m+y*v,m===1-a){const b=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=b,l*=b,h*=b,u*=b}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,o,r){const a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=o[r],f=o[r+1],d=o[r+2],g=o[r+3];return t[e]=a*g+h*u+c*d-l*f,t[e+1]=c*g+h*f+l*u-a*d,t[e+2]=l*g+h*d+a*f-c*u,t[e+3]=h*g-a*u-c*f-l*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,o=t._z,r=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),u=a(o/2),f=c(n/2),d=c(s/2),g=c(o/2);switch(r){case"XYZ":this._x=f*h*u+l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u-f*d*g;break;case"YXZ":this._x=f*h*u+l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u+f*d*g;break;case"ZXY":this._x=f*h*u-l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u-f*d*g;break;case"ZYX":this._x=f*h*u-l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u+f*d*g;break;case"YZX":this._x=f*h*u+l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u-f*d*g;break;case"XZY":this._x=f*h*u-l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],o=e[8],r=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],f=n+a+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-c)*d,this._y=(o-l)*d,this._z=(r-s)*d}else if(n>a&&n>u){const d=2*Math.sqrt(1+n-a-u);this._w=(h-c)/d,this._x=.25*d,this._y=(s+r)/d,this._z=(o+l)/d}else if(a>u){const d=2*Math.sqrt(1+a-n-u);this._w=(o-l)/d,this._x=(s+r)/d,this._y=.25*d,this._z=(c+h)/d}else{const d=2*Math.sqrt(1+u-n-a);this._w=(r-s)/d,this._x=(o+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Re(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,o=t._z,r=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+r*a+s*l-o*c,this._y=s*h+r*c+o*a-n*l,this._z=o*h+r*l+n*c-s*a,this._w=r*h-n*a-s*c-o*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,o=this._z,r=this._w;let a=r*t._w+n*t._x+s*t._y+o*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=r,this._x=n,this._y=s,this._z=o,this;const c=1-a*a;if(c<=Number.EPSILON){const d=1-e;return this._w=d*r+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*o+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,f=Math.sin(e*h)/l;return this._w=r*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=o*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),o=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),o*Math.sin(e),o*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(t=0,e=0,n=0){C.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(_d.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(_d.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[3]*n+o[6]*s,this.y=o[1]*e+o[4]*n+o[7]*s,this.z=o[2]*e+o[5]*n+o[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,o=t.elements,r=1/(o[3]*e+o[7]*n+o[11]*s+o[15]);return this.x=(o[0]*e+o[4]*n+o[8]*s+o[12])*r,this.y=(o[1]*e+o[5]*n+o[9]*s+o[13])*r,this.z=(o[2]*e+o[6]*n+o[10]*s+o[14])*r,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,o=t.x,r=t.y,a=t.z,c=t.w,l=2*(r*s-a*n),h=2*(a*e-o*s),u=2*(o*n-r*e);return this.x=e+c*l+r*u-a*h,this.y=n+c*h+a*l-o*u,this.z=s+c*u+o*h-r*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s,this.y=o[1]*e+o[5]*n+o[9]*s,this.z=o[2]*e+o[6]*n+o[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,o=t.z,r=e.x,a=e.y,c=e.z;return this.x=s*c-o*a,this.y=o*r-n*c,this.z=n*a-s*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return lc.copy(this).projectOnVector(t),this.sub(lc)}reflect(t){return this.sub(lc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Re(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const lc=new C,_d=new ti;class Zi{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(pn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(pn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=pn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const o=n.getAttribute("position");if(e===!0&&o!==void 0&&t.isInstancedMesh!==!0)for(let r=0,a=o.count;r<a;r++)t.isMesh===!0?t.getVertexPosition(r,pn):pn.fromBufferAttribute(o,r),pn.applyMatrix4(t.matrixWorld),this.expandByPoint(pn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),lr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),lr.copy(n.boundingBox)),lr.applyMatrix4(t.matrixWorld),this.union(lr)}const s=t.children;for(let o=0,r=s.length;o<r;o++)this.expandByObject(s[o],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,pn),pn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(so),hr.subVectors(this.max,so),ss.subVectors(t.a,so),os.subVectors(t.b,so),rs.subVectors(t.c,so),ri.subVectors(os,ss),ai.subVectors(rs,os),Ci.subVectors(ss,rs);let e=[0,-ri.z,ri.y,0,-ai.z,ai.y,0,-Ci.z,Ci.y,ri.z,0,-ri.x,ai.z,0,-ai.x,Ci.z,0,-Ci.x,-ri.y,ri.x,0,-ai.y,ai.x,0,-Ci.y,Ci.x,0];return!hc(e,ss,os,rs,hr)||(e=[1,0,0,0,1,0,0,0,1],!hc(e,ss,os,rs,hr))?!1:(ur.crossVectors(ri,ai),e=[ur.x,ur.y,ur.z],hc(e,ss,os,rs,hr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,pn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(pn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Un[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Un[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Un[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Un[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Un[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Un[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Un[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Un[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Un),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Un=[new C,new C,new C,new C,new C,new C,new C,new C],pn=new C,lr=new Zi,ss=new C,os=new C,rs=new C,ri=new C,ai=new C,Ci=new C,so=new C,hr=new C,ur=new C,Pi=new C;function hc(i,t,e,n,s){for(let o=0,r=i.length-3;o<=r;o+=3){Pi.fromArray(i,o);const a=s.x*Math.abs(Pi.x)+s.y*Math.abs(Pi.y)+s.z*Math.abs(Pi.z),c=t.dot(Pi),l=e.dot(Pi),h=n.dot(Pi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const V1=new Zi,oo=new C,uc=new C;class Js{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):V1.setFromPoints(t).getCenter(n);let s=0;for(let o=0,r=t.length;o<r;o++)s=Math.max(s,n.distanceToSquared(t[o]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;oo.subVectors(t,this.center);const e=oo.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(oo,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(uc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(oo.copy(t.center).add(uc)),this.expandByPoint(oo.copy(t.center).sub(uc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Fn=new C,dc=new C,dr=new C,ci=new C,fc=new C,fr=new C,pc=new C;class Ko{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Fn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Fn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Fn.copy(this.origin).addScaledVector(this.direction,e),Fn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){dc.copy(t).add(e).multiplyScalar(.5),dr.copy(e).sub(t).normalize(),ci.copy(this.origin).sub(dc);const o=t.distanceTo(e)*.5,r=-this.direction.dot(dr),a=ci.dot(this.direction),c=-ci.dot(dr),l=ci.lengthSq(),h=Math.abs(1-r*r);let u,f,d,g;if(h>0)if(u=r*c-a,f=r*a-c,g=o*h,u>=0)if(f>=-g)if(f<=g){const y=1/h;u*=y,f*=y,d=u*(u+r*f+2*a)+f*(r*u+f+2*c)+l}else f=o,u=Math.max(0,-(r*f+a)),d=-u*u+f*(f+2*c)+l;else f=-o,u=Math.max(0,-(r*f+a)),d=-u*u+f*(f+2*c)+l;else f<=-g?(u=Math.max(0,-(-r*o+a)),f=u>0?-o:Math.min(Math.max(-o,-c),o),d=-u*u+f*(f+2*c)+l):f<=g?(u=0,f=Math.min(Math.max(-o,-c),o),d=f*(f+2*c)+l):(u=Math.max(0,-(r*o+a)),f=u>0?o:Math.min(Math.max(-o,-c),o),d=-u*u+f*(f+2*c)+l);else f=r>0?-o:o,u=Math.max(0,-(r*f+a)),d=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(dc).addScaledVector(dr,f),d}intersectSphere(t,e){Fn.subVectors(t.center,this.origin);const n=Fn.dot(this.direction),s=Fn.dot(Fn)-n*n,o=t.radius*t.radius;if(s>o)return null;const r=Math.sqrt(o-s),a=n-r,c=n+r;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,o,r,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),h>=0?(o=(t.min.y-f.y)*h,r=(t.max.y-f.y)*h):(o=(t.max.y-f.y)*h,r=(t.min.y-f.y)*h),n>r||o>s||((o>n||isNaN(n))&&(n=o),(r<s||isNaN(s))&&(s=r),u>=0?(a=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(a=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Fn)!==null}intersectTriangle(t,e,n,s,o){fc.subVectors(e,t),fr.subVectors(n,t),pc.crossVectors(fc,fr);let r=this.direction.dot(pc),a;if(r>0){if(s)return null;a=1}else if(r<0)a=-1,r=-r;else return null;ci.subVectors(this.origin,t);const c=a*this.direction.dot(fr.crossVectors(ci,fr));if(c<0)return null;const l=a*this.direction.dot(fc.cross(ci));if(l<0||c+l>r)return null;const h=-a*ci.dot(pc);return h<0?null:this.at(h/r,o)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class fe{constructor(t,e,n,s,o,r,a,c,l,h,u,f,d,g,y,m){fe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,o,r,a,c,l,h,u,f,d,g,y,m)}set(t,e,n,s,o,r,a,c,l,h,u,f,d,g,y,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=o,p[5]=r,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=g,p[11]=y,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new fe().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/as.setFromMatrixColumn(t,0).length(),o=1/as.setFromMatrixColumn(t,1).length(),r=1/as.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*o,e[5]=n[5]*o,e[6]=n[6]*o,e[7]=0,e[8]=n[8]*r,e[9]=n[9]*r,e[10]=n[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,o=t.z,r=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(o),u=Math.sin(o);if(t.order==="XYZ"){const f=r*h,d=r*u,g=a*h,y=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=d+g*l,e[5]=f-y*l,e[9]=-a*c,e[2]=y-f*l,e[6]=g+d*l,e[10]=r*c}else if(t.order==="YXZ"){const f=c*h,d=c*u,g=l*h,y=l*u;e[0]=f+y*a,e[4]=g*a-d,e[8]=r*l,e[1]=r*u,e[5]=r*h,e[9]=-a,e[2]=d*a-g,e[6]=y+f*a,e[10]=r*c}else if(t.order==="ZXY"){const f=c*h,d=c*u,g=l*h,y=l*u;e[0]=f-y*a,e[4]=-r*u,e[8]=g+d*a,e[1]=d+g*a,e[5]=r*h,e[9]=y-f*a,e[2]=-r*l,e[6]=a,e[10]=r*c}else if(t.order==="ZYX"){const f=r*h,d=r*u,g=a*h,y=a*u;e[0]=c*h,e[4]=g*l-d,e[8]=f*l+y,e[1]=c*u,e[5]=y*l+f,e[9]=d*l-g,e[2]=-l,e[6]=a*c,e[10]=r*c}else if(t.order==="YZX"){const f=r*c,d=r*l,g=a*c,y=a*l;e[0]=c*h,e[4]=y-f*u,e[8]=g*u+d,e[1]=u,e[5]=r*h,e[9]=-a*h,e[2]=-l*h,e[6]=d*u+g,e[10]=f-y*u}else if(t.order==="XZY"){const f=r*c,d=r*l,g=a*c,y=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=f*u+y,e[5]=r*h,e[9]=d*u-g,e[2]=g*u-d,e[6]=a*h,e[10]=y*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(W1,t,X1)}lookAt(t,e,n){const s=this.elements;return en.subVectors(t,e),en.lengthSq()===0&&(en.z=1),en.normalize(),li.crossVectors(n,en),li.lengthSq()===0&&(Math.abs(n.z)===1?en.x+=1e-4:en.z+=1e-4,en.normalize(),li.crossVectors(n,en)),li.normalize(),pr.crossVectors(en,li),s[0]=li.x,s[4]=pr.x,s[8]=en.x,s[1]=li.y,s[5]=pr.y,s[9]=en.y,s[2]=li.z,s[6]=pr.z,s[10]=en.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,o=this.elements,r=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],f=n[9],d=n[13],g=n[2],y=n[6],m=n[10],p=n[14],_=n[3],w=n[7],v=n[11],b=n[15],S=s[0],E=s[4],T=s[8],M=s[12],x=s[1],A=s[5],P=s[9],R=s[13],F=s[2],D=s[6],N=s[10],H=s[14],G=s[3],V=s[7],et=s[11],lt=s[15];return o[0]=r*S+a*x+c*F+l*G,o[4]=r*E+a*A+c*D+l*V,o[8]=r*T+a*P+c*N+l*et,o[12]=r*M+a*R+c*H+l*lt,o[1]=h*S+u*x+f*F+d*G,o[5]=h*E+u*A+f*D+d*V,o[9]=h*T+u*P+f*N+d*et,o[13]=h*M+u*R+f*H+d*lt,o[2]=g*S+y*x+m*F+p*G,o[6]=g*E+y*A+m*D+p*V,o[10]=g*T+y*P+m*N+p*et,o[14]=g*M+y*R+m*H+p*lt,o[3]=_*S+w*x+v*F+b*G,o[7]=_*E+w*A+v*D+b*V,o[11]=_*T+w*P+v*N+b*et,o[15]=_*M+w*R+v*H+b*lt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],o=t[12],r=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],f=t[10],d=t[14],g=t[3],y=t[7],m=t[11],p=t[15];return g*(+o*c*u-s*l*u-o*a*f+n*l*f+s*a*d-n*c*d)+y*(+e*c*d-e*l*f+o*r*f-s*r*d+s*l*h-o*c*h)+m*(+e*l*u-e*a*d-o*r*u+n*r*d+o*a*h-n*l*h)+p*(-s*a*h-e*c*u+e*a*f+s*r*u-n*r*f+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],r=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],f=t[10],d=t[11],g=t[12],y=t[13],m=t[14],p=t[15],_=u*m*l-y*f*l+y*c*d-a*m*d-u*c*p+a*f*p,w=g*f*l-h*m*l-g*c*d+r*m*d+h*c*p-r*f*p,v=h*y*l-g*u*l+g*a*d-r*y*d-h*a*p+r*u*p,b=g*u*c-h*y*c-g*a*f+r*y*f+h*a*m-r*u*m,S=e*_+n*w+s*v+o*b;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/S;return t[0]=_*E,t[1]=(y*f*o-u*m*o-y*s*d+n*m*d+u*s*p-n*f*p)*E,t[2]=(a*m*o-y*c*o+y*s*l-n*m*l-a*s*p+n*c*p)*E,t[3]=(u*c*o-a*f*o-u*s*l+n*f*l+a*s*d-n*c*d)*E,t[4]=w*E,t[5]=(h*m*o-g*f*o+g*s*d-e*m*d-h*s*p+e*f*p)*E,t[6]=(g*c*o-r*m*o-g*s*l+e*m*l+r*s*p-e*c*p)*E,t[7]=(r*f*o-h*c*o+h*s*l-e*f*l-r*s*d+e*c*d)*E,t[8]=v*E,t[9]=(g*u*o-h*y*o-g*n*d+e*y*d+h*n*p-e*u*p)*E,t[10]=(r*y*o-g*a*o+g*n*l-e*y*l-r*n*p+e*a*p)*E,t[11]=(h*a*o-r*u*o-h*n*l+e*u*l+r*n*d-e*a*d)*E,t[12]=b*E,t[13]=(h*y*s-g*u*s+g*n*f-e*y*f-h*n*m+e*u*m)*E,t[14]=(g*a*s-r*y*s-g*n*c+e*y*c+r*n*m-e*a*m)*E,t[15]=(r*u*s-h*a*s+h*n*c-e*u*c-r*n*f+e*a*f)*E,this}scale(t){const e=this.elements,n=t.x,s=t.y,o=t.z;return e[0]*=n,e[4]*=s,e[8]*=o,e[1]*=n,e[5]*=s,e[9]*=o,e[2]*=n,e[6]*=s,e[10]*=o,e[3]*=n,e[7]*=s,e[11]*=o,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),o=1-n,r=t.x,a=t.y,c=t.z,l=o*r,h=o*a;return this.set(l*r+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*r,0,l*c-s*a,h*c+s*r,o*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,o,r){return this.set(1,n,o,0,t,1,r,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,o=e._x,r=e._y,a=e._z,c=e._w,l=o+o,h=r+r,u=a+a,f=o*l,d=o*h,g=o*u,y=r*h,m=r*u,p=a*u,_=c*l,w=c*h,v=c*u,b=n.x,S=n.y,E=n.z;return s[0]=(1-(y+p))*b,s[1]=(d+v)*b,s[2]=(g-w)*b,s[3]=0,s[4]=(d-v)*S,s[5]=(1-(f+p))*S,s[6]=(m+_)*S,s[7]=0,s[8]=(g+w)*E,s[9]=(m-_)*E,s[10]=(1-(f+y))*E,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let o=as.set(s[0],s[1],s[2]).length();const r=as.set(s[4],s[5],s[6]).length(),a=as.set(s[8],s[9],s[10]).length();this.determinant()<0&&(o=-o),t.x=s[12],t.y=s[13],t.z=s[14],mn.copy(this);const l=1/o,h=1/r,u=1/a;return mn.elements[0]*=l,mn.elements[1]*=l,mn.elements[2]*=l,mn.elements[4]*=h,mn.elements[5]*=h,mn.elements[6]*=h,mn.elements[8]*=u,mn.elements[9]*=u,mn.elements[10]*=u,e.setFromRotationMatrix(mn),n.x=o,n.y=r,n.z=a,this}makePerspective(t,e,n,s,o,r,a=$n){const c=this.elements,l=2*o/(e-t),h=2*o/(n-s),u=(e+t)/(e-t),f=(n+s)/(n-s);let d,g;if(a===$n)d=-(r+o)/(r-o),g=-2*r*o/(r-o);else if(a===ba)d=-r/(r-o),g=-r*o/(r-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=d,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,o,r,a=$n){const c=this.elements,l=1/(e-t),h=1/(n-s),u=1/(r-o),f=(e+t)*l,d=(n+s)*h;let g,y;if(a===$n)g=(r+o)*u,y=-2*u;else if(a===ba)g=o*u,y=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-d,c[2]=0,c[6]=0,c[10]=y,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const as=new C,mn=new fe,W1=new C(0,0,0),X1=new C(1,1,1),li=new C,pr=new C,en=new C,xd=new fe,Md=new ti;class Cn{constructor(t=0,e=0,n=0,s=Cn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,o=s[0],r=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Re(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-r,o)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Re(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,o),this._z=0);break;case"ZXY":this._x=Math.asin(Re(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-r,l)):(this._y=0,this._z=Math.atan2(c,o));break;case"ZYX":this._y=Math.asin(-Re(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,o)):(this._x=0,this._z=Math.atan2(-r,l));break;case"YZX":this._z=Math.asin(Re(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,o)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Re(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,o)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return xd.makeRotationFromQuaternion(t),this.setFromRotationMatrix(xd,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Md.setFromEuler(this),this.setFromQuaternion(Md,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Cn.DEFAULT_ORDER="XYZ";class qa{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let q1=0;const bd=new C,cs=new ti,On=new fe,mr=new C,ro=new C,Y1=new C,$1=new ti,Sd=new C(1,0,0),Ed=new C(0,1,0),Td=new C(0,0,1),Ad={type:"added"},Z1={type:"removed"},ls={type:"childadded",child:null},mc={type:"childremoved",child:null};class Ee extends js{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:q1++}),this.uuid=Ji(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ee.DEFAULT_UP.clone();const t=new C,e=new Cn,n=new ti,s=new C(1,1,1);function o(){n.setFromEuler(e,!1)}function r(){e.setFromQuaternion(n,void 0,!1)}e._onChange(o),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new fe},normalMatrix:{value:new Kt}}),this.matrix=new fe,this.matrixWorld=new fe,this.matrixAutoUpdate=Ee.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ee.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new qa,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return cs.setFromAxisAngle(t,e),this.quaternion.multiply(cs),this}rotateOnWorldAxis(t,e){return cs.setFromAxisAngle(t,e),this.quaternion.premultiply(cs),this}rotateX(t){return this.rotateOnAxis(Sd,t)}rotateY(t){return this.rotateOnAxis(Ed,t)}rotateZ(t){return this.rotateOnAxis(Td,t)}translateOnAxis(t,e){return bd.copy(t).applyQuaternion(this.quaternion),this.position.add(bd.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Sd,t)}translateY(t){return this.translateOnAxis(Ed,t)}translateZ(t){return this.translateOnAxis(Td,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(On.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?mr.copy(t):mr.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ro.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?On.lookAt(ro,mr,this.up):On.lookAt(mr,ro,this.up),this.quaternion.setFromRotationMatrix(On),s&&(On.extractRotation(s.matrixWorld),cs.setFromRotationMatrix(On),this.quaternion.premultiply(cs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Ad),ls.child=t,this.dispatchEvent(ls),ls.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Z1),mc.child=t,this.dispatchEvent(mc),mc.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),On.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),On.multiply(t.parent.matrixWorld)),t.applyMatrix4(On),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Ad),ls.child=t,this.dispatchEvent(ls),ls.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const r=this.children[n].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let o=0,r=s.length;o<r;o++)s[o].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ro,t,Y1),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ro,$1,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let o=0,r=s.length;o<r;o++)s[o].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function o(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=o(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];o(t.shapes,u)}else o(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(o(t.materials,this.material[c]));s.material=a}else s.material=o(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(o(t.animations,c))}}if(e){const a=r(t.geometries),c=r(t.materials),l=r(t.textures),h=r(t.images),u=r(t.shapes),f=r(t.skeletons),d=r(t.animations),g=r(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=s,n;function r(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Ee.DEFAULT_UP=new C(0,1,0);Ee.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ee.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const gn=new C,kn=new C,gc=new C,zn=new C,hs=new C,us=new C,Rd=new C,yc=new C,vc=new C,wc=new C,_c=new le,xc=new le,Mc=new le;class hn{constructor(t=new C,e=new C,n=new C){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),gn.subVectors(t,e),s.cross(gn);const o=s.lengthSq();return o>0?s.multiplyScalar(1/Math.sqrt(o)):s.set(0,0,0)}static getBarycoord(t,e,n,s,o){gn.subVectors(s,e),kn.subVectors(n,e),gc.subVectors(t,e);const r=gn.dot(gn),a=gn.dot(kn),c=gn.dot(gc),l=kn.dot(kn),h=kn.dot(gc),u=r*l-a*a;if(u===0)return o.set(0,0,0),null;const f=1/u,d=(l*c-a*h)*f,g=(r*h-a*c)*f;return o.set(1-d-g,g,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,zn)===null?!1:zn.x>=0&&zn.y>=0&&zn.x+zn.y<=1}static getInterpolation(t,e,n,s,o,r,a,c){return this.getBarycoord(t,e,n,s,zn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(o,zn.x),c.addScaledVector(r,zn.y),c.addScaledVector(a,zn.z),c)}static getInterpolatedAttribute(t,e,n,s,o,r){return _c.setScalar(0),xc.setScalar(0),Mc.setScalar(0),_c.fromBufferAttribute(t,e),xc.fromBufferAttribute(t,n),Mc.fromBufferAttribute(t,s),r.setScalar(0),r.addScaledVector(_c,o.x),r.addScaledVector(xc,o.y),r.addScaledVector(Mc,o.z),r}static isFrontFacing(t,e,n,s){return gn.subVectors(n,e),kn.subVectors(t,e),gn.cross(kn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return gn.subVectors(this.c,this.b),kn.subVectors(this.a,this.b),gn.cross(kn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return hn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return hn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,o){return hn.getInterpolation(t,this.a,this.b,this.c,e,n,s,o)}containsPoint(t){return hn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return hn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,o=this.c;let r,a;hs.subVectors(s,n),us.subVectors(o,n),yc.subVectors(t,n);const c=hs.dot(yc),l=us.dot(yc);if(c<=0&&l<=0)return e.copy(n);vc.subVectors(t,s);const h=hs.dot(vc),u=us.dot(vc);if(h>=0&&u<=h)return e.copy(s);const f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return r=c/(c-h),e.copy(n).addScaledVector(hs,r);wc.subVectors(t,o);const d=hs.dot(wc),g=us.dot(wc);if(g>=0&&d<=g)return e.copy(o);const y=d*l-c*g;if(y<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(us,a);const m=h*g-d*u;if(m<=0&&u-h>=0&&d-g>=0)return Rd.subVectors(o,s),a=(u-h)/(u-h+(d-g)),e.copy(s).addScaledVector(Rd,a);const p=1/(m+y+f);return r=y*p,a=f*p,e.copy(n).addScaledVector(hs,r).addScaledVector(us,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Pp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},hi={h:0,s:0,l:0},gr={h:0,s:0,l:0};function bc(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Wt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=on){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,re.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=re.workingColorSpace){return this.r=t,this.g=e,this.b=n,re.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=re.workingColorSpace){if(t=hu(t,1),e=Re(e,0,1),n=Re(n,0,1),e===0)this.r=this.g=this.b=n;else{const o=n<=.5?n*(1+e):n+e-n*e,r=2*n-o;this.r=bc(r,o,t+1/3),this.g=bc(r,o,t),this.b=bc(r,o,t-1/3)}return re.toWorkingColorSpace(this,s),this}setStyle(t,e=on){function n(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let o;const r=s[1],a=s[2];switch(r){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,e);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,e);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const o=s[1],r=o.length;if(r===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(o,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=on){const n=Pp[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=jn(t.r),this.g=jn(t.g),this.b=jn(t.b),this}copyLinearToSRGB(t){return this.r=Ds(t.r),this.g=Ds(t.g),this.b=Ds(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=on){return re.fromWorkingColorSpace(Be.copy(this),t),Math.round(Re(Be.r*255,0,255))*65536+Math.round(Re(Be.g*255,0,255))*256+Math.round(Re(Be.b*255,0,255))}getHexString(t=on){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=re.workingColorSpace){re.fromWorkingColorSpace(Be.copy(this),e);const n=Be.r,s=Be.g,o=Be.b,r=Math.max(n,s,o),a=Math.min(n,s,o);let c,l;const h=(a+r)/2;if(a===r)c=0,l=0;else{const u=r-a;switch(l=h<=.5?u/(r+a):u/(2-r-a),r){case n:c=(s-o)/u+(s<o?6:0);break;case s:c=(o-n)/u+2;break;case o:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=re.workingColorSpace){return re.fromWorkingColorSpace(Be.copy(this),e),t.r=Be.r,t.g=Be.g,t.b=Be.b,t}getStyle(t=on){re.fromWorkingColorSpace(Be.copy(this),t);const e=Be.r,n=Be.g,s=Be.b;return t!==on?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(hi),this.setHSL(hi.h+t,hi.s+e,hi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(hi),t.getHSL(gr);const n=Fo(hi.h,gr.h,e),s=Fo(hi.s,gr.s,e),o=Fo(hi.l,gr.l,e);return this.setHSL(n,s,o),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,o=t.elements;return this.r=o[0]*e+o[3]*n+o[6]*s,this.g=o[1]*e+o[4]*n+o[7]*s,this.b=o[2]*e+o[5]*n+o[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Be=new Wt;Wt.NAMES=Pp;let K1=0;class Ti extends js{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:K1++}),this.uuid=Ji(),this.name="",this.blending=Is,this.side=wi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Hl,this.blendDst=Gl,this.blendEquation=Hi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Wt(0,0,0),this.blendAlpha=0,this.depthFunc=ks,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=hd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ns,this.stencilZFail=ns,this.stencilZPass=ns,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Is&&(n.blending=this.blending),this.side!==wi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Hl&&(n.blendSrc=this.blendSrc),this.blendDst!==Gl&&(n.blendDst=this.blendDst),this.blendEquation!==Hi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ks&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==hd&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ns&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ns&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ns&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(o){const r=[];for(const a in o){const c=o[a];delete c.metadata,r.push(c)}return r}if(e){const o=s(t.textures),r=s(t.images);o.length>0&&(n.textures=o),r.length>0&&(n.images=r)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let o=0;o!==s;++o)n[o]=e[o].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class jo extends Ti{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.combine=nu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ae=new C,yr=new tt;class He{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=ud,this.updateRanges=[],this.gpuType=Yn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,o=this.itemSize;s<o;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)yr.fromBufferAttribute(this,e),yr.applyMatrix3(t),this.setXY(e,yr.x,yr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyMatrix3(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyMatrix4(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyNormalMatrix(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.transformDirection(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=bs(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=qe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=bs(e,this.array)),e}setX(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=bs(e,this.array)),e}setY(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=bs(e,this.array)),e}setZ(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=bs(e,this.array)),e}setW(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=qe(e,this.array),n=qe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=qe(e,this.array),n=qe(n,this.array),s=qe(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,o){return t*=this.itemSize,this.normalized&&(e=qe(e,this.array),n=qe(n,this.array),s=qe(s,this.array),o=qe(o,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=o,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==ud&&(t.usage=this.usage),t}}class Ip extends He{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Lp extends He{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ae extends He{constructor(t,e,n){super(new Float32Array(t),e,n)}}let j1=0;const an=new fe,Sc=new Ee,ds=new C,nn=new Zi,ao=new Zi,De=new C;class Le extends js{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:j1++}),this.uuid=Ji(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Ap(t)?Lp:Ip)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const o=new Kt().getNormalMatrix(t);n.applyNormalMatrix(o),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return an.makeRotationFromQuaternion(t),this.applyMatrix4(an),this}rotateX(t){return an.makeRotationX(t),this.applyMatrix4(an),this}rotateY(t){return an.makeRotationY(t),this.applyMatrix4(an),this}rotateZ(t){return an.makeRotationZ(t),this.applyMatrix4(an),this}translate(t,e,n){return an.makeTranslation(t,e,n),this.applyMatrix4(an),this}scale(t,e,n){return an.makeScale(t,e,n),this.applyMatrix4(an),this}lookAt(t){return Sc.lookAt(t),Sc.updateMatrix(),this.applyMatrix4(Sc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ds).negate(),this.translate(ds.x,ds.y,ds.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,o=t.length;s<o;s++){const r=t[s];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new ae(n,3))}else{for(let n=0,s=e.count;n<s;n++){const o=t[n];e.setXYZ(n,o.x,o.y,o.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Zi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const o=e[n];nn.setFromBufferAttribute(o),this.morphTargetsRelative?(De.addVectors(this.boundingBox.min,nn.min),this.boundingBox.expandByPoint(De),De.addVectors(this.boundingBox.max,nn.max),this.boundingBox.expandByPoint(De)):(this.boundingBox.expandByPoint(nn.min),this.boundingBox.expandByPoint(nn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Js);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(t){const n=this.boundingSphere.center;if(nn.setFromBufferAttribute(t),e)for(let o=0,r=e.length;o<r;o++){const a=e[o];ao.setFromBufferAttribute(a),this.morphTargetsRelative?(De.addVectors(nn.min,ao.min),nn.expandByPoint(De),De.addVectors(nn.max,ao.max),nn.expandByPoint(De)):(nn.expandByPoint(ao.min),nn.expandByPoint(ao.max))}nn.getCenter(n);let s=0;for(let o=0,r=t.count;o<r;o++)De.fromBufferAttribute(t,o),s=Math.max(s,n.distanceToSquared(De));if(e)for(let o=0,r=e.length;o<r;o++){const a=e[o],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)De.fromBufferAttribute(a,l),c&&(ds.fromBufferAttribute(t,l),De.add(ds)),s=Math.max(s,n.distanceToSquared(De))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,o=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new He(new Float32Array(4*n.count),4));const r=this.getAttribute("tangent"),a=[],c=[];for(let T=0;T<n.count;T++)a[T]=new C,c[T]=new C;const l=new C,h=new C,u=new C,f=new tt,d=new tt,g=new tt,y=new C,m=new C;function p(T,M,x){l.fromBufferAttribute(n,T),h.fromBufferAttribute(n,M),u.fromBufferAttribute(n,x),f.fromBufferAttribute(o,T),d.fromBufferAttribute(o,M),g.fromBufferAttribute(o,x),h.sub(l),u.sub(l),d.sub(f),g.sub(f);const A=1/(d.x*g.y-g.x*d.y);isFinite(A)&&(y.copy(h).multiplyScalar(g.y).addScaledVector(u,-d.y).multiplyScalar(A),m.copy(u).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(A),a[T].add(y),a[M].add(y),a[x].add(y),c[T].add(m),c[M].add(m),c[x].add(m))}let _=this.groups;_.length===0&&(_=[{start:0,count:t.count}]);for(let T=0,M=_.length;T<M;++T){const x=_[T],A=x.start,P=x.count;for(let R=A,F=A+P;R<F;R+=3)p(t.getX(R+0),t.getX(R+1),t.getX(R+2))}const w=new C,v=new C,b=new C,S=new C;function E(T){b.fromBufferAttribute(s,T),S.copy(b);const M=a[T];w.copy(M),w.sub(b.multiplyScalar(b.dot(M))).normalize(),v.crossVectors(S,M);const A=v.dot(c[T])<0?-1:1;r.setXYZW(T,w.x,w.y,w.z,A)}for(let T=0,M=_.length;T<M;++T){const x=_[T],A=x.start,P=x.count;for(let R=A,F=A+P;R<F;R+=3)E(t.getX(R+0)),E(t.getX(R+1)),E(t.getX(R+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new He(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const s=new C,o=new C,r=new C,a=new C,c=new C,l=new C,h=new C,u=new C;if(t)for(let f=0,d=t.count;f<d;f+=3){const g=t.getX(f+0),y=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,g),o.fromBufferAttribute(e,y),r.fromBufferAttribute(e,m),h.subVectors(r,o),u.subVectors(s,o),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,y),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(y,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,d=e.count;f<d;f+=3)s.fromBufferAttribute(e,f+0),o.fromBufferAttribute(e,f+1),r.fromBufferAttribute(e,f+2),h.subVectors(r,o),u.subVectors(s,o),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)De.fromBufferAttribute(t,e),De.normalize(),t.setXYZ(e,De.x,De.y,De.z)}toNonIndexed(){function t(a,c){const l=a.array,h=a.itemSize,u=a.normalized,f=new l.constructor(c.length*h);let d=0,g=0;for(let y=0,m=c.length;y<m;y++){a.isInterleavedBufferAttribute?d=c[y]*a.data.stride+a.offset:d=c[y]*h;for(let p=0;p<h;p++)f[g++]=l[d++]}return new He(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Le,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,n);e.setAttribute(a,l)}const o=this.morphAttributes;for(const a in o){const c=[],l=o[a];for(let h=0,u=l.length;h<u;h++){const f=l[h],d=t(f,n);c.push(d)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let a=0,c=r.length;a<c;a++){const l=r[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let o=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){const d=l[u];h.push(d.toJSON(t.data))}h.length>0&&(s[c]=h,o=!0)}o&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const o=t.morphAttributes;for(const l in o){const h=[],u=o[l];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let l=0,h=r.length;l<h;l++){const u=r[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Cd=new fe,Ii=new Ko,vr=new Js,Pd=new C,wr=new C,_r=new C,xr=new C,Ec=new C,Mr=new C,Id=new C,br=new C;class ne extends Ee{constructor(t=new Le,e=new jo){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=s.length;o<r;o++){const a=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,o=n.morphAttributes.position,r=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(o&&a){Mr.set(0,0,0);for(let c=0,l=o.length;c<l;c++){const h=a[c],u=o[c];h!==0&&(Ec.fromBufferAttribute(u,t),r?Mr.addScaledVector(Ec,h):Mr.addScaledVector(Ec.sub(e),h))}e.add(Mr)}return e}raycast(t,e){const n=this.geometry,s=this.material,o=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),vr.copy(n.boundingSphere),vr.applyMatrix4(o),Ii.copy(t.ray).recast(t.near),!(vr.containsPoint(Ii.origin)===!1&&(Ii.intersectSphere(vr,Pd)===null||Ii.origin.distanceToSquared(Pd)>(t.far-t.near)**2))&&(Cd.copy(o).invert(),Ii.copy(t.ray).applyMatrix4(Cd),!(n.boundingBox!==null&&Ii.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ii)))}_computeIntersections(t,e,n){let s;const o=this.geometry,r=this.material,a=o.index,c=o.attributes.position,l=o.attributes.uv,h=o.attributes.uv1,u=o.attributes.normal,f=o.groups,d=o.drawRange;if(a!==null)if(Array.isArray(r))for(let g=0,y=f.length;g<y;g++){const m=f[g],p=r[m.materialIndex],_=Math.max(m.start,d.start),w=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let v=_,b=w;v<b;v+=3){const S=a.getX(v),E=a.getX(v+1),T=a.getX(v+2);s=Sr(this,p,t,n,l,h,u,S,E,T),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),y=Math.min(a.count,d.start+d.count);for(let m=g,p=y;m<p;m+=3){const _=a.getX(m),w=a.getX(m+1),v=a.getX(m+2);s=Sr(this,r,t,n,l,h,u,_,w,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let g=0,y=f.length;g<y;g++){const m=f[g],p=r[m.materialIndex],_=Math.max(m.start,d.start),w=Math.min(c.count,Math.min(m.start+m.count,d.start+d.count));for(let v=_,b=w;v<b;v+=3){const S=v,E=v+1,T=v+2;s=Sr(this,p,t,n,l,h,u,S,E,T),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),y=Math.min(c.count,d.start+d.count);for(let m=g,p=y;m<p;m+=3){const _=m,w=m+1,v=m+2;s=Sr(this,r,t,n,l,h,u,_,w,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function J1(i,t,e,n,s,o,r,a){let c;if(t.side===Ke?c=n.intersectTriangle(r,o,s,!0,a):c=n.intersectTriangle(s,o,r,t.side===wi,a),c===null)return null;br.copy(a),br.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(br);return l<e.near||l>e.far?null:{distance:l,point:br.clone(),object:i}}function Sr(i,t,e,n,s,o,r,a,c,l){i.getVertexPosition(a,wr),i.getVertexPosition(c,_r),i.getVertexPosition(l,xr);const h=J1(i,t,e,n,wr,_r,xr,Id);if(h){const u=new C;hn.getBarycoord(Id,wr,_r,xr,u),s&&(h.uv=hn.getInterpolatedAttribute(s,a,c,l,u,new tt)),o&&(h.uv1=hn.getInterpolatedAttribute(o,a,c,l,u,new tt)),r&&(h.normal=hn.getInterpolatedAttribute(r,a,c,l,u,new C),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a,b:c,c:l,normal:new C,materialIndex:0};hn.getNormal(wr,_r,xr,f.normal),h.face=f,h.barycoord=u}return h}class k extends Le{constructor(t=1,e=1,n=1,s=1,o=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:o,depthSegments:r};const a=this;s=Math.floor(s),o=Math.floor(o),r=Math.floor(r);const c=[],l=[],h=[],u=[];let f=0,d=0;g("z","y","x",-1,-1,n,e,t,r,o,0),g("z","y","x",1,-1,n,e,-t,r,o,1),g("x","z","y",1,1,t,n,e,s,r,2),g("x","z","y",1,-1,t,n,-e,s,r,3),g("x","y","z",1,-1,t,e,n,s,o,4),g("x","y","z",-1,-1,t,e,-n,s,o,5),this.setIndex(c),this.setAttribute("position",new ae(l,3)),this.setAttribute("normal",new ae(h,3)),this.setAttribute("uv",new ae(u,2));function g(y,m,p,_,w,v,b,S,E,T,M){const x=v/E,A=b/T,P=v/2,R=b/2,F=S/2,D=E+1,N=T+1;let H=0,G=0;const V=new C;for(let et=0;et<N;et++){const lt=et*A-R;for(let bt=0;bt<D;bt++){const Lt=bt*x-P;V[y]=Lt*_,V[m]=lt*w,V[p]=F,l.push(V.x,V.y,V.z),V[y]=0,V[m]=0,V[p]=S>0?1:-1,h.push(V.x,V.y,V.z),u.push(bt/E),u.push(1-et/T),H+=1}}for(let et=0;et<T;et++)for(let lt=0;lt<E;lt++){const bt=f+lt+D*et,Lt=f+lt+D*(et+1),J=f+(lt+1)+D*(et+1),rt=f+(lt+1)+D*et;c.push(bt,Lt,rt),c.push(Lt,J,rt),G+=6}a.addGroup(d,G,M),d+=G,f+=H}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new k(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ws(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ye(i){const t={};for(let e=0;e<i.length;e++){const n=Ws(i[e]);for(const s in n)t[s]=n[s]}return t}function Q1(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Dp(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:re.workingColorSpace}const Ya={clone:Ws,merge:Ye};var ty=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ey=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Te extends Ti{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ty,this.fragmentShader=ey,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ws(t.uniforms),this.uniformsGroups=Q1(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?e.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[s]={type:"m4",value:r.toArray()}:e.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Np extends Ee{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new fe,this.projectionMatrix=new fe,this.projectionMatrixInverse=new fe,this.coordinateSystem=$n}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ui=new C,Ld=new tt,Dd=new tt;class Qe extends Np{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Vs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Uo*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Vs*2*Math.atan(Math.tan(Uo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){ui.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ui.x,ui.y).multiplyScalar(-t/ui.z),ui.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ui.x,ui.y).multiplyScalar(-t/ui.z)}getViewSize(t,e){return this.getViewBounds(t,Ld,Dd),e.subVectors(Dd,Ld)}setViewOffset(t,e,n,s,o,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=o,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Uo*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,o=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,l=r.fullHeight;o+=r.offsetX*s/c,e-=r.offsetY*n/l,s*=r.width/c,n*=r.height/l}const a=this.filmOffset;a!==0&&(o+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const fs=-90,ps=1;class ny extends Ee{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Qe(fs,ps,t,e);s.layers=this.layers,this.add(s);const o=new Qe(fs,ps,t,e);o.layers=this.layers,this.add(o);const r=new Qe(fs,ps,t,e);r.layers=this.layers,this.add(r);const a=new Qe(fs,ps,t,e);a.layers=this.layers,this.add(a);const c=new Qe(fs,ps,t,e);c.layers=this.layers,this.add(c);const l=new Qe(fs,ps,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,o,r,a,c]=e;for(const l of e)this.remove(l);if(t===$n)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===ba)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[o,r,a,c,l,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,o),t.setRenderTarget(n,1,s),t.render(e,r),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=y,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,f,d),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Up extends je{constructor(t,e,n,s,o,r,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:zs,super(t,e,n,s,o,r,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class iy extends wn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Up(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Fe}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new k(5,5,5),o=new Te({name:"CubemapFromEquirect",uniforms:Ws(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ke,blending:Kn});o.uniforms.tEquirect.value=e;const r=new ne(s,o),a=e.minFilter;return e.minFilter===gi&&(e.minFilter=Fe),new ny(1,10,this).update(t,r),e.minFilter=a,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,n,s){const o=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,n,s);t.setRenderTarget(o)}}const Tc=new C,sy=new C,oy=new Kt;class mi{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Tc.subVectors(n,e).cross(sy.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Tc),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/s;return o<0||o>1?null:e.copy(t.start).addScaledVector(n,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||oy.getNormalMatrix(t),s=this.coplanarPoint(Tc).applyMatrix4(t),o=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(o),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Li=new Js,Er=new C;class uu{constructor(t=new mi,e=new mi,n=new mi,s=new mi,o=new mi,r=new mi){this.planes=[t,e,n,s,o,r]}set(t,e,n,s,o,r){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(o),a[5].copy(r),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=$n){const n=this.planes,s=t.elements,o=s[0],r=s[1],a=s[2],c=s[3],l=s[4],h=s[5],u=s[6],f=s[7],d=s[8],g=s[9],y=s[10],m=s[11],p=s[12],_=s[13],w=s[14],v=s[15];if(n[0].setComponents(c-o,f-l,m-d,v-p).normalize(),n[1].setComponents(c+o,f+l,m+d,v+p).normalize(),n[2].setComponents(c+r,f+h,m+g,v+_).normalize(),n[3].setComponents(c-r,f-h,m-g,v-_).normalize(),n[4].setComponents(c-a,f-u,m-y,v-w).normalize(),e===$n)n[5].setComponents(c+a,f+u,m+y,v+w).normalize();else if(e===ba)n[5].setComponents(a,u,y,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Li.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Li.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Li)}intersectsSprite(t){return Li.center.set(0,0,0),Li.radius=.7071067811865476,Li.applyMatrix4(t.matrixWorld),this.intersectsSphere(Li)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let o=0;o<6;o++)if(e[o].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Er.x=s.normal.x>0?t.max.x:t.min.x,Er.y=s.normal.y>0?t.max.y:t.min.y,Er.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Er)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Fp(){let i=null,t=!1,e=null,n=null;function s(o,r){e(o,r),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(o){e=o},setContext:function(o){i=o}}}function ry(i){const t=new WeakMap;function e(a,c){const l=a.array,h=a.usage,u=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,h),a.onUploadCallback();let d;if(l instanceof Float32Array)d=i.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=i.SHORT;else if(l instanceof Uint32Array)d=i.UNSIGNED_INT;else if(l instanceof Int32Array)d=i.INT;else if(l instanceof Int8Array)d=i.BYTE;else if(l instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){const h=c.array,u=c.updateRanges;if(i.bindBuffer(l,a),u.length===0)i.bufferSubData(l,0,h);else{u.sort((d,g)=>d.start-g.start);let f=0;for(let d=1;d<u.length;d++){const g=u[f],y=u[d];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++f,u[f]=y)}u.length=f+1;for(let d=0,g=u.length;d<g;d++){const y=u[d];i.bufferSubData(l,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function o(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function r(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:o,update:r}}class _i extends Le{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const o=t/2,r=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,u=t/a,f=e/c,d=[],g=[],y=[],m=[];for(let p=0;p<h;p++){const _=p*f-r;for(let w=0;w<l;w++){const v=w*u-o;g.push(v,-_,0),y.push(0,0,1),m.push(w/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let _=0;_<a;_++){const w=_+l*p,v=_+l*(p+1),b=_+1+l*(p+1),S=_+1+l*p;d.push(w,v,S),d.push(v,b,S)}this.setIndex(d),this.setAttribute("position",new ae(g,3)),this.setAttribute("normal",new ae(y,3)),this.setAttribute("uv",new ae(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new _i(t.width,t.height,t.widthSegments,t.heightSegments)}}var ay=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,cy=`#ifdef USE_ALPHAHASH
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
#endif`,ly=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,hy=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,uy=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,dy=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,fy=`#ifdef USE_AOMAP
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
#endif`,py=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,my=`#ifdef USE_BATCHING
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
#endif`,gy=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,yy=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,vy=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,wy=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,_y=`#ifdef USE_IRIDESCENCE
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
#endif`,xy=`#ifdef USE_BUMPMAP
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
#endif`,My=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,by=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Sy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ey=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ty=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Ay=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ry=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Cy=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Py=`#define PI 3.141592653589793
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
} // validated`,Iy=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Ly=`vec3 transformedNormal = objectNormal;
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
#endif`,Dy=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ny=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Uy=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Fy=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Oy="gl_FragColor = linearToOutputTexel( gl_FragColor );",ky=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,zy=`#ifdef USE_ENVMAP
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
#endif`,By=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Hy=`#ifdef USE_ENVMAP
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
#endif`,Gy=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Vy=`#ifdef USE_ENVMAP
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
#endif`,Wy=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Xy=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,qy=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Yy=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,$y=`#ifdef USE_GRADIENTMAP
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
}`,Zy=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ky=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,jy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Jy=`uniform bool receiveShadow;
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
#endif`,Qy=`#ifdef USE_ENVMAP
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
#endif`,tv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ev=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,nv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,iv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,sv=`PhysicalMaterial material;
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
#endif`,ov=`struct PhysicalMaterial {
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
}`,rv=`
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
#endif`,av=`#if defined( RE_IndirectDiffuse )
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
#endif`,cv=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lv=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,hv=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,uv=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dv=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,fv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,pv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,mv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,gv=`#if defined( USE_POINTS_UV )
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
#endif`,yv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,vv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,wv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,_v=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,xv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Mv=`#ifdef USE_MORPHTARGETS
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
#endif`,bv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Sv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Ev=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Tv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Av=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Cv=`#ifdef USE_NORMALMAP
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
#endif`,Pv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Iv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Lv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Dv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Nv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Uv=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Fv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ov=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,kv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,zv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Bv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Hv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Gv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Vv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Wv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Xv=`float getShadowMask() {
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
}`,qv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Yv=`#ifdef USE_SKINNING
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
#endif`,$v=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Zv=`#ifdef USE_SKINNING
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
#endif`,Kv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,jv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Jv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Qv=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,tw=`#ifdef USE_TRANSMISSION
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
#endif`,ew=`#ifdef USE_TRANSMISSION
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
#endif`,nw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,iw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ow=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const rw=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,aw=`uniform sampler2D t2D;
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
}`,cw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,lw=`#ifdef ENVMAP_TYPE_CUBE
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
}`,hw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,uw=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dw=`#include <common>
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
}`,fw=`#if DEPTH_PACKING == 3200
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
}`,pw=`#define DISTANCE
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
}`,mw=`#define DISTANCE
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
}`,gw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,yw=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vw=`uniform float scale;
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
}`,ww=`uniform vec3 diffuse;
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
}`,_w=`#include <common>
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
}`,xw=`uniform vec3 diffuse;
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
}`,Mw=`#define LAMBERT
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
}`,bw=`#define LAMBERT
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
}`,Sw=`#define MATCAP
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
}`,Ew=`#define MATCAP
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
}`,Tw=`#define NORMAL
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
}`,Aw=`#define NORMAL
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
}`,Rw=`#define PHONG
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
}`,Cw=`#define PHONG
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
}`,Pw=`#define STANDARD
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
}`,Iw=`#define STANDARD
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
}`,Lw=`#define TOON
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
}`,Dw=`#define TOON
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
}`,Nw=`uniform float size;
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
}`,Uw=`uniform vec3 diffuse;
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
}`,Fw=`#include <common>
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
}`,Ow=`uniform vec3 color;
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
}`,kw=`uniform float rotation;
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
}`,zw=`uniform vec3 diffuse;
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
}`,Qt={alphahash_fragment:ay,alphahash_pars_fragment:cy,alphamap_fragment:ly,alphamap_pars_fragment:hy,alphatest_fragment:uy,alphatest_pars_fragment:dy,aomap_fragment:fy,aomap_pars_fragment:py,batching_pars_vertex:my,batching_vertex:gy,begin_vertex:yy,beginnormal_vertex:vy,bsdfs:wy,iridescence_fragment:_y,bumpmap_pars_fragment:xy,clipping_planes_fragment:My,clipping_planes_pars_fragment:by,clipping_planes_pars_vertex:Sy,clipping_planes_vertex:Ey,color_fragment:Ty,color_pars_fragment:Ay,color_pars_vertex:Ry,color_vertex:Cy,common:Py,cube_uv_reflection_fragment:Iy,defaultnormal_vertex:Ly,displacementmap_pars_vertex:Dy,displacementmap_vertex:Ny,emissivemap_fragment:Uy,emissivemap_pars_fragment:Fy,colorspace_fragment:Oy,colorspace_pars_fragment:ky,envmap_fragment:zy,envmap_common_pars_fragment:By,envmap_pars_fragment:Hy,envmap_pars_vertex:Gy,envmap_physical_pars_fragment:Qy,envmap_vertex:Vy,fog_vertex:Wy,fog_pars_vertex:Xy,fog_fragment:qy,fog_pars_fragment:Yy,gradientmap_pars_fragment:$y,lightmap_pars_fragment:Zy,lights_lambert_fragment:Ky,lights_lambert_pars_fragment:jy,lights_pars_begin:Jy,lights_toon_fragment:tv,lights_toon_pars_fragment:ev,lights_phong_fragment:nv,lights_phong_pars_fragment:iv,lights_physical_fragment:sv,lights_physical_pars_fragment:ov,lights_fragment_begin:rv,lights_fragment_maps:av,lights_fragment_end:cv,logdepthbuf_fragment:lv,logdepthbuf_pars_fragment:hv,logdepthbuf_pars_vertex:uv,logdepthbuf_vertex:dv,map_fragment:fv,map_pars_fragment:pv,map_particle_fragment:mv,map_particle_pars_fragment:gv,metalnessmap_fragment:yv,metalnessmap_pars_fragment:vv,morphinstance_vertex:wv,morphcolor_vertex:_v,morphnormal_vertex:xv,morphtarget_pars_vertex:Mv,morphtarget_vertex:bv,normal_fragment_begin:Sv,normal_fragment_maps:Ev,normal_pars_fragment:Tv,normal_pars_vertex:Av,normal_vertex:Rv,normalmap_pars_fragment:Cv,clearcoat_normal_fragment_begin:Pv,clearcoat_normal_fragment_maps:Iv,clearcoat_pars_fragment:Lv,iridescence_pars_fragment:Dv,opaque_fragment:Nv,packing:Uv,premultiplied_alpha_fragment:Fv,project_vertex:Ov,dithering_fragment:kv,dithering_pars_fragment:zv,roughnessmap_fragment:Bv,roughnessmap_pars_fragment:Hv,shadowmap_pars_fragment:Gv,shadowmap_pars_vertex:Vv,shadowmap_vertex:Wv,shadowmask_pars_fragment:Xv,skinbase_vertex:qv,skinning_pars_vertex:Yv,skinning_vertex:$v,skinnormal_vertex:Zv,specularmap_fragment:Kv,specularmap_pars_fragment:jv,tonemapping_fragment:Jv,tonemapping_pars_fragment:Qv,transmission_fragment:tw,transmission_pars_fragment:ew,uv_pars_fragment:nw,uv_pars_vertex:iw,uv_vertex:sw,worldpos_vertex:ow,background_vert:rw,background_frag:aw,backgroundCube_vert:cw,backgroundCube_frag:lw,cube_vert:hw,cube_frag:uw,depth_vert:dw,depth_frag:fw,distanceRGBA_vert:pw,distanceRGBA_frag:mw,equirect_vert:gw,equirect_frag:yw,linedashed_vert:vw,linedashed_frag:ww,meshbasic_vert:_w,meshbasic_frag:xw,meshlambert_vert:Mw,meshlambert_frag:bw,meshmatcap_vert:Sw,meshmatcap_frag:Ew,meshnormal_vert:Tw,meshnormal_frag:Aw,meshphong_vert:Rw,meshphong_frag:Cw,meshphysical_vert:Pw,meshphysical_frag:Iw,meshtoon_vert:Lw,meshtoon_frag:Dw,points_vert:Nw,points_frag:Uw,shadow_vert:Fw,shadow_frag:Ow,sprite_vert:kw,sprite_frag:zw},St={common:{diffuse:{value:new Wt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Kt}},envmap:{envMap:{value:null},envMapRotation:{value:new Kt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Kt},normalScale:{value:new tt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Wt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Wt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0},uvTransform:{value:new Kt}},sprite:{diffuse:{value:new Wt(16777215)},opacity:{value:1},center:{value:new tt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}}},En={basic:{uniforms:Ye([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.fog]),vertexShader:Qt.meshbasic_vert,fragmentShader:Qt.meshbasic_frag},lambert:{uniforms:Ye([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new Wt(0)}}]),vertexShader:Qt.meshlambert_vert,fragmentShader:Qt.meshlambert_frag},phong:{uniforms:Ye([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new Wt(0)},specular:{value:new Wt(1118481)},shininess:{value:30}}]),vertexShader:Qt.meshphong_vert,fragmentShader:Qt.meshphong_frag},standard:{uniforms:Ye([St.common,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.roughnessmap,St.metalnessmap,St.fog,St.lights,{emissive:{value:new Wt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag},toon:{uniforms:Ye([St.common,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.gradientmap,St.fog,St.lights,{emissive:{value:new Wt(0)}}]),vertexShader:Qt.meshtoon_vert,fragmentShader:Qt.meshtoon_frag},matcap:{uniforms:Ye([St.common,St.bumpmap,St.normalmap,St.displacementmap,St.fog,{matcap:{value:null}}]),vertexShader:Qt.meshmatcap_vert,fragmentShader:Qt.meshmatcap_frag},points:{uniforms:Ye([St.points,St.fog]),vertexShader:Qt.points_vert,fragmentShader:Qt.points_frag},dashed:{uniforms:Ye([St.common,St.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Qt.linedashed_vert,fragmentShader:Qt.linedashed_frag},depth:{uniforms:Ye([St.common,St.displacementmap]),vertexShader:Qt.depth_vert,fragmentShader:Qt.depth_frag},normal:{uniforms:Ye([St.common,St.bumpmap,St.normalmap,St.displacementmap,{opacity:{value:1}}]),vertexShader:Qt.meshnormal_vert,fragmentShader:Qt.meshnormal_frag},sprite:{uniforms:Ye([St.sprite,St.fog]),vertexShader:Qt.sprite_vert,fragmentShader:Qt.sprite_frag},background:{uniforms:{uvTransform:{value:new Kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Qt.background_vert,fragmentShader:Qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Kt}},vertexShader:Qt.backgroundCube_vert,fragmentShader:Qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Qt.cube_vert,fragmentShader:Qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Qt.equirect_vert,fragmentShader:Qt.equirect_frag},distanceRGBA:{uniforms:Ye([St.common,St.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Qt.distanceRGBA_vert,fragmentShader:Qt.distanceRGBA_frag},shadow:{uniforms:Ye([St.lights,St.fog,{color:{value:new Wt(0)},opacity:{value:1}}]),vertexShader:Qt.shadow_vert,fragmentShader:Qt.shadow_frag}};En.physical={uniforms:Ye([En.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Kt},clearcoatNormalScale:{value:new tt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Kt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Kt},sheen:{value:0},sheenColor:{value:new Wt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Kt},transmissionSamplerSize:{value:new tt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Kt},attenuationDistance:{value:0},attenuationColor:{value:new Wt(0)},specularColor:{value:new Wt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Kt},anisotropyVector:{value:new tt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Kt}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag};const Tr={r:0,b:0,g:0},Di=new Cn,Bw=new fe;function Hw(i,t,e,n,s,o,r){const a=new Wt(0);let c=o===!0?0:1,l,h,u=null,f=0,d=null;function g(_){let w=_.isScene===!0?_.background:null;return w&&w.isTexture&&(w=(_.backgroundBlurriness>0?e:t).get(w)),w}function y(_){let w=!1;const v=g(_);v===null?p(a,c):v&&v.isColor&&(p(v,1),w=!0);const b=i.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(i.autoClear||w)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(_,w){const v=g(w);v&&(v.isCubeTexture||v.mapping===Va)?(h===void 0&&(h=new ne(new k(1,1,1),new Te({name:"BackgroundCubeMaterial",uniforms:Ws(En.backgroundCube.uniforms),vertexShader:En.backgroundCube.vertexShader,fragmentShader:En.backgroundCube.fragmentShader,side:Ke,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(b,S,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Di.copy(w.backgroundRotation),Di.x*=-1,Di.y*=-1,Di.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Di.y*=-1,Di.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Bw.makeRotationFromEuler(Di)),h.material.toneMapped=re.getTransfer(v.colorSpace)!==me,(u!==v||f!==v.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,u=v,f=v.version,d=i.toneMapping),h.layers.enableAll(),_.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new ne(new _i(2,2),new Te({name:"BackgroundMaterial",uniforms:Ws(En.background.uniforms),vertexShader:En.background.vertexShader,fragmentShader:En.background.fragmentShader,side:wi,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=re.getTransfer(v.colorSpace)!==me,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||f!==v.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,u=v,f=v.version,d=i.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null))}function p(_,w){_.getRGB(Tr,Dp(i)),n.buffers.color.setClear(Tr.r,Tr.g,Tr.b,w,r)}return{getClearColor:function(){return a},setClearColor:function(_,w=1){a.set(_),c=w,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(_){c=_,p(a,c)},render:y,addToRenderList:m}}function Gw(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let o=s,r=!1;function a(x,A,P,R,F){let D=!1;const N=u(R,P,A);o!==N&&(o=N,l(o.object)),D=d(x,R,P,F),D&&g(x,R,P,F),F!==null&&t.update(F,i.ELEMENT_ARRAY_BUFFER),(D||r)&&(r=!1,v(x,A,P,R),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(F).buffer))}function c(){return i.createVertexArray()}function l(x){return i.bindVertexArray(x)}function h(x){return i.deleteVertexArray(x)}function u(x,A,P){const R=P.wireframe===!0;let F=n[x.id];F===void 0&&(F={},n[x.id]=F);let D=F[A.id];D===void 0&&(D={},F[A.id]=D);let N=D[R];return N===void 0&&(N=f(c()),D[R]=N),N}function f(x){const A=[],P=[],R=[];for(let F=0;F<e;F++)A[F]=0,P[F]=0,R[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:A,enabledAttributes:P,attributeDivisors:R,object:x,attributes:{},index:null}}function d(x,A,P,R){const F=o.attributes,D=A.attributes;let N=0;const H=P.getAttributes();for(const G in H)if(H[G].location>=0){const et=F[G];let lt=D[G];if(lt===void 0&&(G==="instanceMatrix"&&x.instanceMatrix&&(lt=x.instanceMatrix),G==="instanceColor"&&x.instanceColor&&(lt=x.instanceColor)),et===void 0||et.attribute!==lt||lt&&et.data!==lt.data)return!0;N++}return o.attributesNum!==N||o.index!==R}function g(x,A,P,R){const F={},D=A.attributes;let N=0;const H=P.getAttributes();for(const G in H)if(H[G].location>=0){let et=D[G];et===void 0&&(G==="instanceMatrix"&&x.instanceMatrix&&(et=x.instanceMatrix),G==="instanceColor"&&x.instanceColor&&(et=x.instanceColor));const lt={};lt.attribute=et,et&&et.data&&(lt.data=et.data),F[G]=lt,N++}o.attributes=F,o.attributesNum=N,o.index=R}function y(){const x=o.newAttributes;for(let A=0,P=x.length;A<P;A++)x[A]=0}function m(x){p(x,0)}function p(x,A){const P=o.newAttributes,R=o.enabledAttributes,F=o.attributeDivisors;P[x]=1,R[x]===0&&(i.enableVertexAttribArray(x),R[x]=1),F[x]!==A&&(i.vertexAttribDivisor(x,A),F[x]=A)}function _(){const x=o.newAttributes,A=o.enabledAttributes;for(let P=0,R=A.length;P<R;P++)A[P]!==x[P]&&(i.disableVertexAttribArray(P),A[P]=0)}function w(x,A,P,R,F,D,N){N===!0?i.vertexAttribIPointer(x,A,P,F,D):i.vertexAttribPointer(x,A,P,R,F,D)}function v(x,A,P,R){y();const F=R.attributes,D=P.getAttributes(),N=A.defaultAttributeValues;for(const H in D){const G=D[H];if(G.location>=0){let V=F[H];if(V===void 0&&(H==="instanceMatrix"&&x.instanceMatrix&&(V=x.instanceMatrix),H==="instanceColor"&&x.instanceColor&&(V=x.instanceColor)),V!==void 0){const et=V.normalized,lt=V.itemSize,bt=t.get(V);if(bt===void 0)continue;const Lt=bt.buffer,J=bt.type,rt=bt.bytesPerElement,K=J===i.INT||J===i.UNSIGNED_INT||V.gpuType===iu;if(V.isInterleavedBufferAttribute){const $=V.data,ot=$.stride,mt=V.offset;if($.isInstancedInterleavedBuffer){for(let Mt=0;Mt<G.locationSize;Mt++)p(G.location+Mt,$.meshPerAttribute);x.isInstancedMesh!==!0&&R._maxInstanceCount===void 0&&(R._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let Mt=0;Mt<G.locationSize;Mt++)m(G.location+Mt);i.bindBuffer(i.ARRAY_BUFFER,Lt);for(let Mt=0;Mt<G.locationSize;Mt++)w(G.location+Mt,lt/G.locationSize,J,et,ot*rt,(mt+lt/G.locationSize*Mt)*rt,K)}else{if(V.isInstancedBufferAttribute){for(let $=0;$<G.locationSize;$++)p(G.location+$,V.meshPerAttribute);x.isInstancedMesh!==!0&&R._maxInstanceCount===void 0&&(R._maxInstanceCount=V.meshPerAttribute*V.count)}else for(let $=0;$<G.locationSize;$++)m(G.location+$);i.bindBuffer(i.ARRAY_BUFFER,Lt);for(let $=0;$<G.locationSize;$++)w(G.location+$,lt/G.locationSize,J,et,lt*rt,lt/G.locationSize*$*rt,K)}}else if(N!==void 0){const et=N[H];if(et!==void 0)switch(et.length){case 2:i.vertexAttrib2fv(G.location,et);break;case 3:i.vertexAttrib3fv(G.location,et);break;case 4:i.vertexAttrib4fv(G.location,et);break;default:i.vertexAttrib1fv(G.location,et)}}}}_()}function b(){T();for(const x in n){const A=n[x];for(const P in A){const R=A[P];for(const F in R)h(R[F].object),delete R[F];delete A[P]}delete n[x]}}function S(x){if(n[x.id]===void 0)return;const A=n[x.id];for(const P in A){const R=A[P];for(const F in R)h(R[F].object),delete R[F];delete A[P]}delete n[x.id]}function E(x){for(const A in n){const P=n[A];if(P[x.id]===void 0)continue;const R=P[x.id];for(const F in R)h(R[F].object),delete R[F];delete P[x.id]}}function T(){M(),r=!0,o!==s&&(o=s,l(o.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:T,resetDefaultState:M,dispose:b,releaseStatesOfGeometry:S,releaseStatesOfProgram:E,initAttributes:y,enableAttribute:m,disableUnusedAttributes:_}}function Vw(i,t,e){let n;function s(l){n=l}function o(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function r(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function a(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let d=0;for(let g=0;g<u;g++)d+=h[g];e.update(d,n,1)}function c(l,h,u,f){if(u===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<l.length;g++)r(l[g],h[g],f[g]);else{d.multiDrawArraysInstancedWEBGL(n,l,0,h,0,f,0,u);let g=0;for(let y=0;y<u;y++)g+=h[y]*f[y];e.update(g,n,1)}}this.setMode=s,this.render=o,this.renderInstances=r,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function Ww(i,t,e,n){let s;function o(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(E){return!(E!==un&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(E){const T=E===Ei&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==vn&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==Yn&&!T)}function c(E){if(E==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,f=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),_=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),w=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),b=g>0,S=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:o,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:f,maxTextures:d,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:_,maxVaryings:w,maxFragmentUniforms:v,vertexTextures:b,maxSamples:S}}function Xw(i){const t=this;let e=null,n=0,s=!1,o=!1;const r=new mi,a=new Kt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||n!==0||s;return s=f,n=u.length,d},this.beginShadows=function(){o=!0,h(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,d){const g=u.clippingPlanes,y=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||o&&!m)o?h(null):l();else{const _=o?0:n,w=_*4;let v=p.clippingState||null;c.value=v,v=h(g,f,w,d);for(let b=0;b!==w;++b)v[b]=e[b];p.clippingState=v,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=_}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,d,g){const y=u!==null?u.length:0;let m=null;if(y!==0){if(m=c.value,g!==!0||m===null){const p=d+y*4,_=f.matrixWorldInverse;a.getNormalMatrix(_),(m===null||m.length<p)&&(m=new Float32Array(p));for(let w=0,v=d;w!==y;++w,v+=4)r.copy(u[w]).applyMatrix4(_,a),r.normal.toArray(m,v),m[v+3]=r.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,m}}function qw(i){let t=new WeakMap;function e(r,a){return a===Kl?r.mapping=zs:a===jl&&(r.mapping=Bs),r}function n(r){if(r&&r.isTexture){const a=r.mapping;if(a===Kl||a===jl)if(t.has(r)){const c=t.get(r).texture;return e(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const l=new iy(c.height);return l.fromEquirectangularTexture(i,r),t.set(r,l),r.addEventListener("dispose",s),e(l.texture,r.mapping)}else return null}}return r}function s(r){const a=r.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function o(){t=new WeakMap}return{get:n,dispose:o}}class du extends Np{constructor(t=-1,e=1,n=1,s=-1,o=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=o,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,o,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=o,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let o=n-t,r=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=l*this.view.offsetX,r=o+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(o,r,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const As=4,Nd=[.125,.215,.35,.446,.526,.582],Gi=20,Ac=new du,Ud=new Wt;let Rc=null,Cc=0,Pc=0,Ic=!1;const Bi=(1+Math.sqrt(5))/2,ms=1/Bi,Fd=[new C(-Bi,ms,0),new C(Bi,ms,0),new C(-ms,0,Bi),new C(ms,0,Bi),new C(0,Bi,-ms),new C(0,Bi,ms),new C(-1,1,-1),new C(1,1,-1),new C(-1,1,1),new C(1,1,1)];class Od{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Rc=this._renderer.getRenderTarget(),Cc=this._renderer.getActiveCubeFace(),Pc=this._renderer.getActiveMipmapLevel(),Ic=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const o=this._allocateTargets();return o.depthBuffer=!0,this._sceneToCubeUV(t,n,s,o),e>0&&this._blur(o,0,0,e),this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Bd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=zd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Rc,Cc,Pc),this._renderer.xr.enabled=Ic,t.scissorTest=!1,Ar(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===zs||t.mapping===Bs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Rc=this._renderer.getRenderTarget(),Cc=this._renderer.getActiveCubeFace(),Pc=this._renderer.getActiveMipmapLevel(),Ic=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Fe,minFilter:Fe,generateMipmaps:!1,type:Ei,format:un,colorSpace:Ks,depthBuffer:!1},s=kd(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=kd(t,e,n);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Yw(o)),this._blurMaterial=$w(o,t,e)}return s}_compileMaterial(t){const e=new ne(this._lodPlanes[0],t);this._renderer.compile(e,Ac)}_sceneToCubeUV(t,e,n,s){const a=new Qe(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(Ud),h.toneMapping=vi,h.autoClear=!1;const d=new jo({name:"PMREM.Background",side:Ke,depthWrite:!1,depthTest:!1}),g=new ne(new k,d);let y=!1;const m=t.background;m?m.isColor&&(d.color.copy(m),t.background=null,y=!0):(d.color.copy(Ud),y=!0);for(let p=0;p<6;p++){const _=p%3;_===0?(a.up.set(0,c[p],0),a.lookAt(l[p],0,0)):_===1?(a.up.set(0,0,c[p]),a.lookAt(0,l[p],0)):(a.up.set(0,c[p],0),a.lookAt(0,0,l[p]));const w=this._cubeSize;Ar(s,_*w,p>2?w:0,w,w),h.setRenderTarget(s),y&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===zs||t.mapping===Bs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Bd()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=zd());const o=s?this._cubemapMaterial:this._equirectMaterial,r=new ne(this._lodPlanes[0],o),a=o.uniforms;a.envMap.value=t;const c=this._cubeSize;Ar(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(r,Ac)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let o=1;o<s;o++){const r=Math.sqrt(this._sigmas[o]*this._sigmas[o]-this._sigmas[o-1]*this._sigmas[o-1]),a=Fd[(s-o-1)%Fd.length];this._blur(t,o-1,o,r,a)}e.autoClear=n}_blur(t,e,n,s,o){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,n,s,"latitudinal",o),this._halfBlur(r,t,n,n,s,"longitudinal",o)}_halfBlur(t,e,n,s,o,r,a){const c=this._renderer,l=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new ne(this._lodPlanes[s],l),f=l.uniforms,d=this._sizeLods[n]-1,g=isFinite(o)?Math.PI/(2*d):2*Math.PI/(2*Gi-1),y=o/g,m=isFinite(o)?1+Math.floor(h*y):Gi;m>Gi&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Gi}`);const p=[];let _=0;for(let E=0;E<Gi;++E){const T=E/y,M=Math.exp(-T*T/2);p.push(M),E===0?_+=M:E<m&&(_+=2*M)}for(let E=0;E<p.length;E++)p[E]=p[E]/_;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=r==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:w}=this;f.dTheta.value=g,f.mipInt.value=w-n;const v=this._sizeLods[s],b=3*v*(s>w-As?s-w+As:0),S=4*(this._cubeSize-v);Ar(e,b,S,3*v,2*v),c.setRenderTarget(e),c.render(u,Ac)}}function Yw(i){const t=[],e=[],n=[];let s=i;const o=i-As+1+Nd.length;for(let r=0;r<o;r++){const a=Math.pow(2,s);e.push(a);let c=1/a;r>i-As?c=Nd[r-i+As-1]:r===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,g=6,y=3,m=2,p=1,_=new Float32Array(y*g*d),w=new Float32Array(m*g*d),v=new Float32Array(p*g*d);for(let S=0;S<d;S++){const E=S%3*2/3-1,T=S>2?0:-1,M=[E,T,0,E+2/3,T,0,E+2/3,T+1,0,E,T,0,E+2/3,T+1,0,E,T+1,0];_.set(M,y*g*S),w.set(f,m*g*S);const x=[S,S,S,S,S,S];v.set(x,p*g*S)}const b=new Le;b.setAttribute("position",new He(_,y)),b.setAttribute("uv",new He(w,m)),b.setAttribute("faceIndex",new He(v,p)),t.push(b),s>As&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function kd(i,t,e){const n=new wn(i,t,e);return n.texture.mapping=Va,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ar(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function $w(i,t,e){const n=new Float32Array(Gi),s=new C(0,1,0);return new Te({name:"SphericalGaussianBlur",defines:{n:Gi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:fu(),fragmentShader:`

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
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function zd(){return new Te({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:fu(),fragmentShader:`

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
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function Bd(){return new Te({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:fu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function fu(){return`

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
	`}function Zw(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===Kl||c===jl,h=c===zs||c===Bs;if(l||h){let u=t.get(a);const f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return e===null&&(e=new Od(i)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{const d=a.image;return l&&d&&d.height>0||h&&d&&s(d)?(e===null&&(e=new Od(i)),u=l?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",o),u.texture):null}}}return a}function s(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function o(a){const c=a.target;c.removeEventListener("dispose",o);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:r}}function Kw(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Ro("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function jw(i,t,e,n){const s={},o=new WeakMap;function r(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);for(const g in f.morphAttributes){const y=f.morphAttributes[g];for(let m=0,p=y.length;m<p;m++)t.remove(y[m])}f.removeEventListener("dispose",r),delete s[f.id];const d=o.get(f);d&&(t.remove(d),o.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",r),s[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const g in f)t.update(f[g],i.ARRAY_BUFFER);const d=u.morphAttributes;for(const g in d){const y=d[g];for(let m=0,p=y.length;m<p;m++)t.update(y[m],i.ARRAY_BUFFER)}}function l(u){const f=[],d=u.index,g=u.attributes.position;let y=0;if(d!==null){const _=d.array;y=d.version;for(let w=0,v=_.length;w<v;w+=3){const b=_[w+0],S=_[w+1],E=_[w+2];f.push(b,S,S,E,E,b)}}else if(g!==void 0){const _=g.array;y=g.version;for(let w=0,v=_.length/3-1;w<v;w+=3){const b=w+0,S=w+1,E=w+2;f.push(b,S,S,E,E,b)}}else return;const m=new(Ap(f)?Lp:Ip)(f,1);m.version=y;const p=o.get(u);p&&t.remove(p),o.set(u,m)}function h(u){const f=o.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&l(u)}else l(u);return o.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function Jw(i,t,e){let n;function s(f){n=f}let o,r;function a(f){o=f.type,r=f.bytesPerElement}function c(f,d){i.drawElements(n,d,o,f*r),e.update(d,n,1)}function l(f,d,g){g!==0&&(i.drawElementsInstanced(n,d,o,f*r,g),e.update(d,n,g))}function h(f,d,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,o,f,0,g);let m=0;for(let p=0;p<g;p++)m+=d[p];e.update(m,n,1)}function u(f,d,g,y){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)l(f[p]/r,d[p],y[p]);else{m.multiDrawElementsInstancedWEBGL(n,d,0,o,f,0,y,0,g);let p=0;for(let _=0;_<g;_++)p+=d[_]*y[_];e.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Qw(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(o,r,a){switch(e.calls++,r){case i.TRIANGLES:e.triangles+=a*(o/3);break;case i.LINES:e.lines+=a*(o/2);break;case i.LINE_STRIP:e.lines+=a*(o-1);break;case i.LINE_LOOP:e.lines+=a*o;break;case i.POINTS:e.points+=a*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function t2(i,t,e){const n=new WeakMap,s=new le;function o(r,a,c){const l=r.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let f=n.get(a);if(f===void 0||f.count!==u){let M=function(){E.dispose(),n.delete(a),a.removeEventListener("dispose",M)};f!==void 0&&f.texture.dispose();const d=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,y=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],_=a.morphAttributes.color||[];let w=0;d===!0&&(w=1),g===!0&&(w=2),y===!0&&(w=3);let v=a.attributes.position.count*w,b=1;v>t.maxTextureSize&&(b=Math.ceil(v/t.maxTextureSize),v=t.maxTextureSize);const S=new Float32Array(v*b*4*u),E=new Cp(S,v,b,u);E.type=Yn,E.needsUpdate=!0;const T=w*4;for(let x=0;x<u;x++){const A=m[x],P=p[x],R=_[x],F=v*b*4*x;for(let D=0;D<A.count;D++){const N=D*T;d===!0&&(s.fromBufferAttribute(A,D),S[F+N+0]=s.x,S[F+N+1]=s.y,S[F+N+2]=s.z,S[F+N+3]=0),g===!0&&(s.fromBufferAttribute(P,D),S[F+N+4]=s.x,S[F+N+5]=s.y,S[F+N+6]=s.z,S[F+N+7]=0),y===!0&&(s.fromBufferAttribute(R,D),S[F+N+8]=s.x,S[F+N+9]=s.y,S[F+N+10]=s.z,S[F+N+11]=R.itemSize===4?s.w:1)}}f={count:u,texture:E,size:new tt(v,b)},n.set(a,f),a.addEventListener("dispose",M)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",r.morphTexture,e);else{let d=0;for(let y=0;y<l.length;y++)d+=l[y];const g=a.morphTargetsRelative?1:1-d;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:o}}function e2(i,t,e,n){let s=new WeakMap;function o(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function r(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:o,dispose:r}}class pu extends je{constructor(t,e,n,s,o,r,a,c,l,h=Ls){if(h!==Ls&&h!==Gs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Ls&&(n=$i),n===void 0&&h===Gs&&(n=Hs),super(null,s,o,r,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Oe,this.minFilter=c!==void 0?c:Oe,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Op=new je,Hd=new pu(1,1),kp=new Cp,zp=new G1,Bp=new Up,Gd=[],Vd=[],Wd=new Float32Array(16),Xd=new Float32Array(9),qd=new Float32Array(4);function Qs(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let o=Gd[s];if(o===void 0&&(o=new Float32Array(s),Gd[s]=o),t!==0){n.toArray(o,0);for(let r=1,a=0;r!==t;++r)a+=e,i[r].toArray(o,a)}return o}function Pe(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ie(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function $a(i,t){let e=Vd[t];e===void 0&&(e=new Int32Array(t),Vd[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function n2(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function i2(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;i.uniform2fv(this.addr,t),Ie(e,t)}}function s2(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Pe(e,t))return;i.uniform3fv(this.addr,t),Ie(e,t)}}function o2(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;i.uniform4fv(this.addr,t),Ie(e,t)}}function r2(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Pe(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ie(e,t)}else{if(Pe(e,n))return;qd.set(n),i.uniformMatrix2fv(this.addr,!1,qd),Ie(e,n)}}function a2(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Pe(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ie(e,t)}else{if(Pe(e,n))return;Xd.set(n),i.uniformMatrix3fv(this.addr,!1,Xd),Ie(e,n)}}function c2(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Pe(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ie(e,t)}else{if(Pe(e,n))return;Wd.set(n),i.uniformMatrix4fv(this.addr,!1,Wd),Ie(e,n)}}function l2(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function h2(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;i.uniform2iv(this.addr,t),Ie(e,t)}}function u2(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Pe(e,t))return;i.uniform3iv(this.addr,t),Ie(e,t)}}function d2(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;i.uniform4iv(this.addr,t),Ie(e,t)}}function f2(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function p2(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;i.uniform2uiv(this.addr,t),Ie(e,t)}}function m2(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Pe(e,t))return;i.uniform3uiv(this.addr,t),Ie(e,t)}}function g2(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;i.uniform4uiv(this.addr,t),Ie(e,t)}}function y2(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let o;this.type===i.SAMPLER_2D_SHADOW?(Hd.compareFunction=Tp,o=Hd):o=Op,e.setTexture2D(t||o,s)}function v2(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||zp,s)}function w2(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Bp,s)}function _2(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||kp,s)}function x2(i){switch(i){case 5126:return n2;case 35664:return i2;case 35665:return s2;case 35666:return o2;case 35674:return r2;case 35675:return a2;case 35676:return c2;case 5124:case 35670:return l2;case 35667:case 35671:return h2;case 35668:case 35672:return u2;case 35669:case 35673:return d2;case 5125:return f2;case 36294:return p2;case 36295:return m2;case 36296:return g2;case 35678:case 36198:case 36298:case 36306:case 35682:return y2;case 35679:case 36299:case 36307:return v2;case 35680:case 36300:case 36308:case 36293:return w2;case 36289:case 36303:case 36311:case 36292:return _2}}function M2(i,t){i.uniform1fv(this.addr,t)}function b2(i,t){const e=Qs(t,this.size,2);i.uniform2fv(this.addr,e)}function S2(i,t){const e=Qs(t,this.size,3);i.uniform3fv(this.addr,e)}function E2(i,t){const e=Qs(t,this.size,4);i.uniform4fv(this.addr,e)}function T2(i,t){const e=Qs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function A2(i,t){const e=Qs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function R2(i,t){const e=Qs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function C2(i,t){i.uniform1iv(this.addr,t)}function P2(i,t){i.uniform2iv(this.addr,t)}function I2(i,t){i.uniform3iv(this.addr,t)}function L2(i,t){i.uniform4iv(this.addr,t)}function D2(i,t){i.uniform1uiv(this.addr,t)}function N2(i,t){i.uniform2uiv(this.addr,t)}function U2(i,t){i.uniform3uiv(this.addr,t)}function F2(i,t){i.uniform4uiv(this.addr,t)}function O2(i,t,e){const n=this.cache,s=t.length,o=$a(e,s);Pe(n,o)||(i.uniform1iv(this.addr,o),Ie(n,o));for(let r=0;r!==s;++r)e.setTexture2D(t[r]||Op,o[r])}function k2(i,t,e){const n=this.cache,s=t.length,o=$a(e,s);Pe(n,o)||(i.uniform1iv(this.addr,o),Ie(n,o));for(let r=0;r!==s;++r)e.setTexture3D(t[r]||zp,o[r])}function z2(i,t,e){const n=this.cache,s=t.length,o=$a(e,s);Pe(n,o)||(i.uniform1iv(this.addr,o),Ie(n,o));for(let r=0;r!==s;++r)e.setTextureCube(t[r]||Bp,o[r])}function B2(i,t,e){const n=this.cache,s=t.length,o=$a(e,s);Pe(n,o)||(i.uniform1iv(this.addr,o),Ie(n,o));for(let r=0;r!==s;++r)e.setTexture2DArray(t[r]||kp,o[r])}function H2(i){switch(i){case 5126:return M2;case 35664:return b2;case 35665:return S2;case 35666:return E2;case 35674:return T2;case 35675:return A2;case 35676:return R2;case 5124:case 35670:return C2;case 35667:case 35671:return P2;case 35668:case 35672:return I2;case 35669:case 35673:return L2;case 5125:return D2;case 36294:return N2;case 36295:return U2;case 36296:return F2;case 35678:case 36198:case 36298:case 36306:case 35682:return O2;case 35679:case 36299:case 36307:return k2;case 35680:case 36300:case 36308:case 36293:return z2;case 36289:case 36303:case 36311:case 36292:return B2}}class G2{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=x2(e.type)}}class V2{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=H2(e.type)}}class W2{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let o=0,r=s.length;o!==r;++o){const a=s[o];a.setValue(t,e[a.id],n)}}}const Lc=/(\w+)(\])?(\[|\.)?/g;function Yd(i,t){i.seq.push(t),i.map[t.id]=t}function X2(i,t,e){const n=i.name,s=n.length;for(Lc.lastIndex=0;;){const o=Lc.exec(n),r=Lc.lastIndex;let a=o[1];const c=o[2]==="]",l=o[3];if(c&&(a=a|0),l===void 0||l==="["&&r+2===s){Yd(e,l===void 0?new G2(a,i,t):new V2(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new W2(a),Yd(e,u)),e=u}}}class ya{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const o=t.getActiveUniform(e,s),r=t.getUniformLocation(e,o.name);X2(o,r,this)}}setValue(t,e,n,s){const o=this.map[e];o!==void 0&&o.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let o=0,r=e.length;o!==r;++o){const a=e[o],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,o=t.length;s!==o;++s){const r=t[s];r.id in e&&n.push(r)}return n}}function $d(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const q2=37297;let Y2=0;function $2(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),o=Math.min(t+6,e.length);for(let r=s;r<o;r++){const a=r+1;n.push(`${a===t?">":" "} ${a}: ${e[r]}`)}return n.join(`
`)}const Zd=new Kt;function Z2(i){re._getMatrix(Zd,re.workingColorSpace,i);const t=`mat3( ${Zd.elements.map(e=>e.toFixed(4))} )`;switch(re.getTransfer(i)){case Xa:return[t,"LinearTransferOETF"];case me:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Kd(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const r=parseInt(o[1]);return e.toUpperCase()+`

`+s+`

`+$2(i.getShaderSource(t),r)}else return s}function K2(i,t){const e=Z2(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function j2(i,t){let e;switch(t){case lp:e="Linear";break;case hp:e="Reinhard";break;case up:e="Cineon";break;case dp:e="ACESFilmic";break;case fp:e="AgX";break;case pp:e="Neutral";break;case a1:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Rr=new C;function J2(){re.getLuminanceCoefficients(Rr);const i=Rr.x.toFixed(4),t=Rr.y.toFixed(4),e=Rr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Q2(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Co).join(`
`)}function t_(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function e_(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const o=i.getActiveAttrib(t,s),r=o.name;let a=1;o.type===i.FLOAT_MAT2&&(a=2),o.type===i.FLOAT_MAT3&&(a=3),o.type===i.FLOAT_MAT4&&(a=4),e[r]={type:o.type,location:i.getAttribLocation(t,r),locationSize:a}}return e}function Co(i){return i!==""}function jd(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Jd(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const n_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Eh(i){return i.replace(n_,s_)}const i_=new Map;function s_(i,t){let e=Qt[t];if(e===void 0){const n=i_.get(t);if(n!==void 0)e=Qt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Eh(e)}const o_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Qd(i){return i.replace(o_,r_)}function r_(i,t,e,n){let s="";for(let o=parseInt(t);o<parseInt(e);o++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return s}function t0(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function a_(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===ap?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===cp?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Vn&&(t="SHADOWMAP_TYPE_VSM"),t}function c_(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case zs:case Bs:t="ENVMAP_TYPE_CUBE";break;case Va:t="ENVMAP_TYPE_CUBE_UV";break}return t}function l_(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Bs:t="ENVMAP_MODE_REFRACTION";break}return t}function h_(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case nu:t="ENVMAP_BLENDING_MULTIPLY";break;case o1:t="ENVMAP_BLENDING_MIX";break;case r1:t="ENVMAP_BLENDING_ADD";break}return t}function u_(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function d_(i,t,e,n){const s=i.getContext(),o=e.defines;let r=e.vertexShader,a=e.fragmentShader;const c=a_(e),l=c_(e),h=l_(e),u=h_(e),f=u_(e),d=Q2(e),g=t_(o),y=s.createProgram();let m,p,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Co).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Co).join(`
`),p.length>0&&(p+=`
`)):(m=[t0(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Co).join(`
`),p=[t0(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==vi?"#define TONE_MAPPING":"",e.toneMapping!==vi?Qt.tonemapping_pars_fragment:"",e.toneMapping!==vi?j2("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Qt.colorspace_pars_fragment,K2("linearToOutputTexel",e.outputColorSpace),J2(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Co).join(`
`)),r=Eh(r),r=jd(r,e),r=Jd(r,e),a=Eh(a),a=jd(a,e),a=Jd(a,e),r=Qd(r),a=Qd(a),e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===dd?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===dd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const w=_+m+r,v=_+p+a,b=$d(s,s.VERTEX_SHADER,w),S=$d(s,s.FRAGMENT_SHADER,v);s.attachShader(y,b),s.attachShader(y,S),e.index0AttributeName!==void 0?s.bindAttribLocation(y,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function E(A){if(i.debug.checkShaderErrors){const P=s.getProgramInfoLog(y).trim(),R=s.getShaderInfoLog(b).trim(),F=s.getShaderInfoLog(S).trim();let D=!0,N=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(D=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,y,b,S);else{const H=Kd(s,b,"vertex"),G=Kd(s,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+P+`
`+H+`
`+G)}else P!==""?console.warn("THREE.WebGLProgram: Program Info Log:",P):(R===""||F==="")&&(N=!1);N&&(A.diagnostics={runnable:D,programLog:P,vertexShader:{log:R,prefix:m},fragmentShader:{log:F,prefix:p}})}s.deleteShader(b),s.deleteShader(S),T=new ya(s,y),M=e_(s,y)}let T;this.getUniforms=function(){return T===void 0&&E(this),T};let M;this.getAttributes=function(){return M===void 0&&E(this),M};let x=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=s.getProgramParameter(y,q2)),x},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Y2++,this.cacheKey=t,this.usedTimes=1,this.program=y,this.vertexShader=b,this.fragmentShader=S,this}let f_=0;class p_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),o=this._getShaderStage(n),r=this._getShaderCacheForMaterial(t);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(o)===!1&&(r.add(o),o.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new m_(t),e.set(t,n)),n}}class m_{constructor(t){this.id=f_++,this.code=t,this.usedTimes=0}}function g_(i,t,e,n,s,o,r){const a=new qa,c=new p_,l=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures;let d=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(M){return l.add(M),M===0?"uv":`uv${M}`}function m(M,x,A,P,R){const F=P.fog,D=R.geometry,N=M.isMeshStandardMaterial?P.environment:null,H=(M.isMeshStandardMaterial?e:t).get(M.envMap||N),G=H&&H.mapping===Va?H.image.height:null,V=g[M.type];M.precision!==null&&(d=s.getMaxPrecision(M.precision),d!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",d,"instead."));const et=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,lt=et!==void 0?et.length:0;let bt=0;D.morphAttributes.position!==void 0&&(bt=1),D.morphAttributes.normal!==void 0&&(bt=2),D.morphAttributes.color!==void 0&&(bt=3);let Lt,J,rt,K;if(V){const pe=En[V];Lt=pe.vertexShader,J=pe.fragmentShader}else Lt=M.vertexShader,J=M.fragmentShader,c.update(M),rt=c.getVertexShaderID(M),K=c.getFragmentShaderID(M);const $=i.getRenderTarget(),ot=i.state.buffers.depth.getReversed(),mt=R.isInstancedMesh===!0,Mt=R.isBatchedMesh===!0,Ft=!!M.map,nt=!!M.matcap,ht=!!H,B=!!M.aoMap,ft=!!M.lightMap,st=!!M.bumpMap,yt=!!M.normalMap,vt=!!M.displacementMap,Gt=!!M.emissiveMap,Pt=!!M.metalnessMap,z=!!M.roughnessMap,U=M.anisotropy>0,Z=M.clearcoat>0,at=M.dispersion>0,dt=M.iridescence>0,ct=M.sheen>0,Ut=M.transmission>0,Et=U&&!!M.anisotropyMap,It=Z&&!!M.clearcoatMap,ie=Z&&!!M.clearcoatNormalMap,gt=Z&&!!M.clearcoatRoughnessMap,Dt=dt&&!!M.iridescenceMap,Vt=dt&&!!M.iridescenceThicknessMap,Xt=ct&&!!M.sheenColorMap,Nt=ct&&!!M.sheenRoughnessMap,oe=!!M.specularMap,Jt=!!M.specularColorMap,ye=!!M.specularIntensityMap,W=Ut&&!!M.transmissionMap,Tt=Ut&&!!M.thicknessMap,it=!!M.gradientMap,ut=!!M.alphaMap,Ct=M.alphaTest>0,At=!!M.alphaHash,Yt=!!M.extensions;let Se=vi;M.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(Se=i.toneMapping);const ke={shaderID:V,shaderType:M.type,shaderName:M.name,vertexShader:Lt,fragmentShader:J,defines:M.defines,customVertexShaderID:rt,customFragmentShaderID:K,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:d,batching:Mt,batchingColor:Mt&&R._colorsTexture!==null,instancing:mt,instancingColor:mt&&R.instanceColor!==null,instancingMorph:mt&&R.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:$===null?i.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:Ks,alphaToCoverage:!!M.alphaToCoverage,map:Ft,matcap:nt,envMap:ht,envMapMode:ht&&H.mapping,envMapCubeUVHeight:G,aoMap:B,lightMap:ft,bumpMap:st,normalMap:yt,displacementMap:f&&vt,emissiveMap:Gt,normalMapObjectSpace:yt&&M.normalMapType===h1,normalMapTangentSpace:yt&&M.normalMapType===lu,metalnessMap:Pt,roughnessMap:z,anisotropy:U,anisotropyMap:Et,clearcoat:Z,clearcoatMap:It,clearcoatNormalMap:ie,clearcoatRoughnessMap:gt,dispersion:at,iridescence:dt,iridescenceMap:Dt,iridescenceThicknessMap:Vt,sheen:ct,sheenColorMap:Xt,sheenRoughnessMap:Nt,specularMap:oe,specularColorMap:Jt,specularIntensityMap:ye,transmission:Ut,transmissionMap:W,thicknessMap:Tt,gradientMap:it,opaque:M.transparent===!1&&M.blending===Is&&M.alphaToCoverage===!1,alphaMap:ut,alphaTest:Ct,alphaHash:At,combine:M.combine,mapUv:Ft&&y(M.map.channel),aoMapUv:B&&y(M.aoMap.channel),lightMapUv:ft&&y(M.lightMap.channel),bumpMapUv:st&&y(M.bumpMap.channel),normalMapUv:yt&&y(M.normalMap.channel),displacementMapUv:vt&&y(M.displacementMap.channel),emissiveMapUv:Gt&&y(M.emissiveMap.channel),metalnessMapUv:Pt&&y(M.metalnessMap.channel),roughnessMapUv:z&&y(M.roughnessMap.channel),anisotropyMapUv:Et&&y(M.anisotropyMap.channel),clearcoatMapUv:It&&y(M.clearcoatMap.channel),clearcoatNormalMapUv:ie&&y(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:gt&&y(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Dt&&y(M.iridescenceMap.channel),iridescenceThicknessMapUv:Vt&&y(M.iridescenceThicknessMap.channel),sheenColorMapUv:Xt&&y(M.sheenColorMap.channel),sheenRoughnessMapUv:Nt&&y(M.sheenRoughnessMap.channel),specularMapUv:oe&&y(M.specularMap.channel),specularColorMapUv:Jt&&y(M.specularColorMap.channel),specularIntensityMapUv:ye&&y(M.specularIntensityMap.channel),transmissionMapUv:W&&y(M.transmissionMap.channel),thicknessMapUv:Tt&&y(M.thicknessMap.channel),alphaMapUv:ut&&y(M.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(yt||U),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,pointsUvs:R.isPoints===!0&&!!D.attributes.uv&&(Ft||ut),fog:!!F,useFog:M.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:ot,skinning:R.isSkinnedMesh===!0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:lt,morphTextureStride:bt,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&A.length>0,shadowMapType:i.shadowMap.type,toneMapping:Se,decodeVideoTexture:Ft&&M.map.isVideoTexture===!0&&re.getTransfer(M.map.colorSpace)===me,decodeVideoTextureEmissive:Gt&&M.emissiveMap.isVideoTexture===!0&&re.getTransfer(M.emissiveMap.colorSpace)===me,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===yn,flipSided:M.side===Ke,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Yt&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Yt&&M.extensions.multiDraw===!0||Mt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return ke.vertexUv1s=l.has(1),ke.vertexUv2s=l.has(2),ke.vertexUv3s=l.has(3),l.clear(),ke}function p(M){const x=[];if(M.shaderID?x.push(M.shaderID):(x.push(M.customVertexShaderID),x.push(M.customFragmentShaderID)),M.defines!==void 0)for(const A in M.defines)x.push(A),x.push(M.defines[A]);return M.isRawShaderMaterial===!1&&(_(x,M),w(x,M),x.push(i.outputColorSpace)),x.push(M.customProgramCacheKey),x.join()}function _(M,x){M.push(x.precision),M.push(x.outputColorSpace),M.push(x.envMapMode),M.push(x.envMapCubeUVHeight),M.push(x.mapUv),M.push(x.alphaMapUv),M.push(x.lightMapUv),M.push(x.aoMapUv),M.push(x.bumpMapUv),M.push(x.normalMapUv),M.push(x.displacementMapUv),M.push(x.emissiveMapUv),M.push(x.metalnessMapUv),M.push(x.roughnessMapUv),M.push(x.anisotropyMapUv),M.push(x.clearcoatMapUv),M.push(x.clearcoatNormalMapUv),M.push(x.clearcoatRoughnessMapUv),M.push(x.iridescenceMapUv),M.push(x.iridescenceThicknessMapUv),M.push(x.sheenColorMapUv),M.push(x.sheenRoughnessMapUv),M.push(x.specularMapUv),M.push(x.specularColorMapUv),M.push(x.specularIntensityMapUv),M.push(x.transmissionMapUv),M.push(x.thicknessMapUv),M.push(x.combine),M.push(x.fogExp2),M.push(x.sizeAttenuation),M.push(x.morphTargetsCount),M.push(x.morphAttributeCount),M.push(x.numDirLights),M.push(x.numPointLights),M.push(x.numSpotLights),M.push(x.numSpotLightMaps),M.push(x.numHemiLights),M.push(x.numRectAreaLights),M.push(x.numDirLightShadows),M.push(x.numPointLightShadows),M.push(x.numSpotLightShadows),M.push(x.numSpotLightShadowsWithMaps),M.push(x.numLightProbes),M.push(x.shadowMapType),M.push(x.toneMapping),M.push(x.numClippingPlanes),M.push(x.numClipIntersection),M.push(x.depthPacking)}function w(M,x){a.disableAll(),x.supportsVertexTextures&&a.enable(0),x.instancing&&a.enable(1),x.instancingColor&&a.enable(2),x.instancingMorph&&a.enable(3),x.matcap&&a.enable(4),x.envMap&&a.enable(5),x.normalMapObjectSpace&&a.enable(6),x.normalMapTangentSpace&&a.enable(7),x.clearcoat&&a.enable(8),x.iridescence&&a.enable(9),x.alphaTest&&a.enable(10),x.vertexColors&&a.enable(11),x.vertexAlphas&&a.enable(12),x.vertexUv1s&&a.enable(13),x.vertexUv2s&&a.enable(14),x.vertexUv3s&&a.enable(15),x.vertexTangents&&a.enable(16),x.anisotropy&&a.enable(17),x.alphaHash&&a.enable(18),x.batching&&a.enable(19),x.dispersion&&a.enable(20),x.batchingColor&&a.enable(21),M.push(a.mask),a.disableAll(),x.fog&&a.enable(0),x.useFog&&a.enable(1),x.flatShading&&a.enable(2),x.logarithmicDepthBuffer&&a.enable(3),x.reverseDepthBuffer&&a.enable(4),x.skinning&&a.enable(5),x.morphTargets&&a.enable(6),x.morphNormals&&a.enable(7),x.morphColors&&a.enable(8),x.premultipliedAlpha&&a.enable(9),x.shadowMapEnabled&&a.enable(10),x.doubleSided&&a.enable(11),x.flipSided&&a.enable(12),x.useDepthPacking&&a.enable(13),x.dithering&&a.enable(14),x.transmission&&a.enable(15),x.sheen&&a.enable(16),x.opaque&&a.enable(17),x.pointsUvs&&a.enable(18),x.decodeVideoTexture&&a.enable(19),x.decodeVideoTextureEmissive&&a.enable(20),x.alphaToCoverage&&a.enable(21),M.push(a.mask)}function v(M){const x=g[M.type];let A;if(x){const P=En[x];A=Ya.clone(P.uniforms)}else A=M.uniforms;return A}function b(M,x){let A;for(let P=0,R=h.length;P<R;P++){const F=h[P];if(F.cacheKey===x){A=F,++A.usedTimes;break}}return A===void 0&&(A=new d_(i,x,M,o),h.push(A)),A}function S(M){if(--M.usedTimes===0){const x=h.indexOf(M);h[x]=h[h.length-1],h.pop(),M.destroy()}}function E(M){c.remove(M)}function T(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:v,acquireProgram:b,releaseProgram:S,releaseShaderCache:E,programs:h,dispose:T}}function y_(){let i=new WeakMap;function t(r){return i.has(r)}function e(r){let a=i.get(r);return a===void 0&&(a={},i.set(r,a)),a}function n(r){i.delete(r)}function s(r,a,c){i.get(r)[a]=c}function o(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:o}}function v_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function e0(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function n0(){const i=[];let t=0;const e=[],n=[],s=[];function o(){t=0,e.length=0,n.length=0,s.length=0}function r(u,f,d,g,y,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:g,renderOrder:u.renderOrder,z:y,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=y,p.group=m),t++,p}function a(u,f,d,g,y,m){const p=r(u,f,d,g,y,m);d.transmission>0?n.push(p):d.transparent===!0?s.push(p):e.push(p)}function c(u,f,d,g,y,m){const p=r(u,f,d,g,y,m);d.transmission>0?n.unshift(p):d.transparent===!0?s.unshift(p):e.unshift(p)}function l(u,f){e.length>1&&e.sort(u||v_),n.length>1&&n.sort(f||e0),s.length>1&&s.sort(f||e0)}function h(){for(let u=t,f=i.length;u<f;u++){const d=i[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:o,push:a,unshift:c,finish:h,sort:l}}function w_(){let i=new WeakMap;function t(n,s){const o=i.get(n);let r;return o===void 0?(r=new n0,i.set(n,[r])):s>=o.length?(r=new n0,o.push(r)):r=o[s],r}function e(){i=new WeakMap}return{get:t,dispose:e}}function __(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new Wt};break;case"SpotLight":e={position:new C,direction:new C,color:new Wt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new Wt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new Wt,groundColor:new Wt};break;case"RectAreaLight":e={color:new Wt,position:new C,halfWidth:new C,halfHeight:new C};break}return i[t.id]=e,e}}}function x_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let M_=0;function b_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function S_(i){const t=new __,e=x_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new C);const s=new C,o=new fe,r=new fe;function a(l){let h=0,u=0,f=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let d=0,g=0,y=0,m=0,p=0,_=0,w=0,v=0,b=0,S=0,E=0;l.sort(b_);for(let M=0,x=l.length;M<x;M++){const A=l[M],P=A.color,R=A.intensity,F=A.distance,D=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)h+=P.r*R,u+=P.g*R,f+=P.b*R;else if(A.isLightProbe){for(let N=0;N<9;N++)n.probe[N].addScaledVector(A.sh.coefficients[N],R);E++}else if(A.isDirectionalLight){const N=t.get(A);if(N.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const H=A.shadow,G=e.get(A);G.shadowIntensity=H.intensity,G.shadowBias=H.bias,G.shadowNormalBias=H.normalBias,G.shadowRadius=H.radius,G.shadowMapSize=H.mapSize,n.directionalShadow[d]=G,n.directionalShadowMap[d]=D,n.directionalShadowMatrix[d]=A.shadow.matrix,_++}n.directional[d]=N,d++}else if(A.isSpotLight){const N=t.get(A);N.position.setFromMatrixPosition(A.matrixWorld),N.color.copy(P).multiplyScalar(R),N.distance=F,N.coneCos=Math.cos(A.angle),N.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),N.decay=A.decay,n.spot[y]=N;const H=A.shadow;if(A.map&&(n.spotLightMap[b]=A.map,b++,H.updateMatrices(A),A.castShadow&&S++),n.spotLightMatrix[y]=H.matrix,A.castShadow){const G=e.get(A);G.shadowIntensity=H.intensity,G.shadowBias=H.bias,G.shadowNormalBias=H.normalBias,G.shadowRadius=H.radius,G.shadowMapSize=H.mapSize,n.spotShadow[y]=G,n.spotShadowMap[y]=D,v++}y++}else if(A.isRectAreaLight){const N=t.get(A);N.color.copy(P).multiplyScalar(R),N.halfWidth.set(A.width*.5,0,0),N.halfHeight.set(0,A.height*.5,0),n.rectArea[m]=N,m++}else if(A.isPointLight){const N=t.get(A);if(N.color.copy(A.color).multiplyScalar(A.intensity),N.distance=A.distance,N.decay=A.decay,A.castShadow){const H=A.shadow,G=e.get(A);G.shadowIntensity=H.intensity,G.shadowBias=H.bias,G.shadowNormalBias=H.normalBias,G.shadowRadius=H.radius,G.shadowMapSize=H.mapSize,G.shadowCameraNear=H.camera.near,G.shadowCameraFar=H.camera.far,n.pointShadow[g]=G,n.pointShadowMap[g]=D,n.pointShadowMatrix[g]=A.shadow.matrix,w++}n.point[g]=N,g++}else if(A.isHemisphereLight){const N=t.get(A);N.skyColor.copy(A.color).multiplyScalar(R),N.groundColor.copy(A.groundColor).multiplyScalar(R),n.hemi[p]=N,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=St.LTC_FLOAT_1,n.rectAreaLTC2=St.LTC_FLOAT_2):(n.rectAreaLTC1=St.LTC_HALF_1,n.rectAreaLTC2=St.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;const T=n.hash;(T.directionalLength!==d||T.pointLength!==g||T.spotLength!==y||T.rectAreaLength!==m||T.hemiLength!==p||T.numDirectionalShadows!==_||T.numPointShadows!==w||T.numSpotShadows!==v||T.numSpotMaps!==b||T.numLightProbes!==E)&&(n.directional.length=d,n.spot.length=y,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=_,n.directionalShadowMap.length=_,n.pointShadow.length=w,n.pointShadowMap.length=w,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=_,n.pointShadowMatrix.length=w,n.spotLightMatrix.length=v+b-S,n.spotLightMap.length=b,n.numSpotLightShadowsWithMaps=S,n.numLightProbes=E,T.directionalLength=d,T.pointLength=g,T.spotLength=y,T.rectAreaLength=m,T.hemiLength=p,T.numDirectionalShadows=_,T.numPointShadows=w,T.numSpotShadows=v,T.numSpotMaps=b,T.numLightProbes=E,n.version=M_++)}function c(l,h){let u=0,f=0,d=0,g=0,y=0;const m=h.matrixWorldInverse;for(let p=0,_=l.length;p<_;p++){const w=l[p];if(w.isDirectionalLight){const v=n.directional[u];v.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),u++}else if(w.isSpotLight){const v=n.spot[d];v.position.setFromMatrixPosition(w.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),d++}else if(w.isRectAreaLight){const v=n.rectArea[g];v.position.setFromMatrixPosition(w.matrixWorld),v.position.applyMatrix4(m),r.identity(),o.copy(w.matrixWorld),o.premultiply(m),r.extractRotation(o),v.halfWidth.set(w.width*.5,0,0),v.halfHeight.set(0,w.height*.5,0),v.halfWidth.applyMatrix4(r),v.halfHeight.applyMatrix4(r),g++}else if(w.isPointLight){const v=n.point[f];v.position.setFromMatrixPosition(w.matrixWorld),v.position.applyMatrix4(m),f++}else if(w.isHemisphereLight){const v=n.hemi[y];v.direction.setFromMatrixPosition(w.matrixWorld),v.direction.transformDirection(m),y++}}}return{setup:a,setupView:c,state:n}}function i0(i){const t=new S_(i),e=[],n=[];function s(h){l.camera=h,e.length=0,n.length=0}function o(h){e.push(h)}function r(h){n.push(h)}function a(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:o,pushShadow:r}}function E_(i){let t=new WeakMap;function e(s,o=0){const r=t.get(s);let a;return r===void 0?(a=new i0(i),t.set(s,[a])):o>=r.length?(a=new i0(i),r.push(a)):a=r[o],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class Hp extends Ti{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=l1,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class T_ extends Ti{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const A_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,R_=`uniform sampler2D shadow_pass;
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
}`;function C_(i,t,e){let n=new uu;const s=new tt,o=new tt,r=new le,a=new Hp({depthPacking:Ep}),c=new T_,l={},h=e.maxTextureSize,u={[wi]:Ke,[Ke]:wi,[yn]:yn},f=new Te({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new tt},radius:{value:4}},vertexShader:A_,fragmentShader:R_}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const g=new Le;g.setAttribute("position",new He(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new ne(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ap;let p=this.type;this.render=function(S,E,T){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;const M=i.getRenderTarget(),x=i.getActiveCubeFace(),A=i.getActiveMipmapLevel(),P=i.state;P.setBlending(Kn),P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);const R=p!==Vn&&this.type===Vn,F=p===Vn&&this.type!==Vn;for(let D=0,N=S.length;D<N;D++){const H=S[D],G=H.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",H,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);const V=G.getFrameExtents();if(s.multiply(V),o.copy(G.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(o.x=Math.floor(h/V.x),s.x=o.x*V.x,G.mapSize.x=o.x),s.y>h&&(o.y=Math.floor(h/V.y),s.y=o.y*V.y,G.mapSize.y=o.y)),G.map===null||R===!0||F===!0){const lt=this.type!==Vn?{minFilter:Oe,magFilter:Oe}:{};G.map!==null&&G.map.dispose(),G.map=new wn(s.x,s.y,lt),G.map.texture.name=H.name+".shadowMap",G.camera.updateProjectionMatrix()}i.setRenderTarget(G.map),i.clear();const et=G.getViewportCount();for(let lt=0;lt<et;lt++){const bt=G.getViewport(lt);r.set(o.x*bt.x,o.y*bt.y,o.x*bt.z,o.y*bt.w),P.viewport(r),G.updateMatrices(H,lt),n=G.getFrustum(),v(E,T,G.camera,H,this.type)}G.isPointLightShadow!==!0&&this.type===Vn&&_(G,T),G.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(M,x,A)};function _(S,E){const T=t.update(y);f.defines.VSM_SAMPLES!==S.blurSamples&&(f.defines.VSM_SAMPLES=S.blurSamples,d.defines.VSM_SAMPLES=S.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new wn(s.x,s.y)),f.uniforms.shadow_pass.value=S.map.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(E,null,T,f,y,null),d.uniforms.shadow_pass.value=S.mapPass.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(E,null,T,d,y,null)}function w(S,E,T,M){let x=null;const A=T.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(A!==void 0)x=A;else if(x=T.isPointLight===!0?c:a,i.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const P=x.uuid,R=E.uuid;let F=l[P];F===void 0&&(F={},l[P]=F);let D=F[R];D===void 0&&(D=x.clone(),F[R]=D,E.addEventListener("dispose",b)),x=D}if(x.visible=E.visible,x.wireframe=E.wireframe,M===Vn?x.side=E.shadowSide!==null?E.shadowSide:E.side:x.side=E.shadowSide!==null?E.shadowSide:u[E.side],x.alphaMap=E.alphaMap,x.alphaTest=E.alphaTest,x.map=E.map,x.clipShadows=E.clipShadows,x.clippingPlanes=E.clippingPlanes,x.clipIntersection=E.clipIntersection,x.displacementMap=E.displacementMap,x.displacementScale=E.displacementScale,x.displacementBias=E.displacementBias,x.wireframeLinewidth=E.wireframeLinewidth,x.linewidth=E.linewidth,T.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const P=i.properties.get(x);P.light=T}return x}function v(S,E,T,M,x){if(S.visible===!1)return;if(S.layers.test(E.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&x===Vn)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,S.matrixWorld);const R=t.update(S),F=S.material;if(Array.isArray(F)){const D=R.groups;for(let N=0,H=D.length;N<H;N++){const G=D[N],V=F[G.materialIndex];if(V&&V.visible){const et=w(S,V,M,x);S.onBeforeShadow(i,S,E,T,R,et,G),i.renderBufferDirect(T,null,R,et,S,G),S.onAfterShadow(i,S,E,T,R,et,G)}}}else if(F.visible){const D=w(S,F,M,x);S.onBeforeShadow(i,S,E,T,R,D,null),i.renderBufferDirect(T,null,R,D,S,null),S.onAfterShadow(i,S,E,T,R,D,null)}}const P=S.children;for(let R=0,F=P.length;R<F;R++)v(P[R],E,T,M,x)}function b(S){S.target.removeEventListener("dispose",b);for(const T in l){const M=l[T],x=S.target.uuid;x in M&&(M[x].dispose(),delete M[x])}}}const P_={[Vl]:Wl,[Xl]:$l,[ql]:Zl,[ks]:Yl,[Wl]:Vl,[$l]:Xl,[Zl]:ql,[Yl]:ks};function I_(i,t){function e(){let W=!1;const Tt=new le;let it=null;const ut=new le(0,0,0,0);return{setMask:function(Ct){it!==Ct&&!W&&(i.colorMask(Ct,Ct,Ct,Ct),it=Ct)},setLocked:function(Ct){W=Ct},setClear:function(Ct,At,Yt,Se,ke){ke===!0&&(Ct*=Se,At*=Se,Yt*=Se),Tt.set(Ct,At,Yt,Se),ut.equals(Tt)===!1&&(i.clearColor(Ct,At,Yt,Se),ut.copy(Tt))},reset:function(){W=!1,it=null,ut.set(-1,0,0,0)}}}function n(){let W=!1,Tt=!1,it=null,ut=null,Ct=null;return{setReversed:function(At){if(Tt!==At){const Yt=t.get("EXT_clip_control");Tt?Yt.clipControlEXT(Yt.LOWER_LEFT_EXT,Yt.ZERO_TO_ONE_EXT):Yt.clipControlEXT(Yt.LOWER_LEFT_EXT,Yt.NEGATIVE_ONE_TO_ONE_EXT);const Se=Ct;Ct=null,this.setClear(Se)}Tt=At},getReversed:function(){return Tt},setTest:function(At){At?$(i.DEPTH_TEST):ot(i.DEPTH_TEST)},setMask:function(At){it!==At&&!W&&(i.depthMask(At),it=At)},setFunc:function(At){if(Tt&&(At=P_[At]),ut!==At){switch(At){case Vl:i.depthFunc(i.NEVER);break;case Wl:i.depthFunc(i.ALWAYS);break;case Xl:i.depthFunc(i.LESS);break;case ks:i.depthFunc(i.LEQUAL);break;case ql:i.depthFunc(i.EQUAL);break;case Yl:i.depthFunc(i.GEQUAL);break;case $l:i.depthFunc(i.GREATER);break;case Zl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ut=At}},setLocked:function(At){W=At},setClear:function(At){Ct!==At&&(Tt&&(At=1-At),i.clearDepth(At),Ct=At)},reset:function(){W=!1,it=null,ut=null,Ct=null,Tt=!1}}}function s(){let W=!1,Tt=null,it=null,ut=null,Ct=null,At=null,Yt=null,Se=null,ke=null;return{setTest:function(pe){W||(pe?$(i.STENCIL_TEST):ot(i.STENCIL_TEST))},setMask:function(pe){Tt!==pe&&!W&&(i.stencilMask(pe),Tt=pe)},setFunc:function(pe,dn,Dn){(it!==pe||ut!==dn||Ct!==Dn)&&(i.stencilFunc(pe,dn,Dn),it=pe,ut=dn,Ct=Dn)},setOp:function(pe,dn,Dn){(At!==pe||Yt!==dn||Se!==Dn)&&(i.stencilOp(pe,dn,Dn),At=pe,Yt=dn,Se=Dn)},setLocked:function(pe){W=pe},setClear:function(pe){ke!==pe&&(i.clearStencil(pe),ke=pe)},reset:function(){W=!1,Tt=null,it=null,ut=null,Ct=null,At=null,Yt=null,Se=null,ke=null}}}const o=new e,r=new n,a=new s,c=new WeakMap,l=new WeakMap;let h={},u={},f=new WeakMap,d=[],g=null,y=!1,m=null,p=null,_=null,w=null,v=null,b=null,S=null,E=new Wt(0,0,0),T=0,M=!1,x=null,A=null,P=null,R=null,F=null;const D=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let N=!1,H=0;const G=i.getParameter(i.VERSION);G.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(G)[1]),N=H>=1):G.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),N=H>=2);let V=null,et={};const lt=i.getParameter(i.SCISSOR_BOX),bt=i.getParameter(i.VIEWPORT),Lt=new le().fromArray(lt),J=new le().fromArray(bt);function rt(W,Tt,it,ut){const Ct=new Uint8Array(4),At=i.createTexture();i.bindTexture(W,At),i.texParameteri(W,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(W,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Yt=0;Yt<it;Yt++)W===i.TEXTURE_3D||W===i.TEXTURE_2D_ARRAY?i.texImage3D(Tt,0,i.RGBA,1,1,ut,0,i.RGBA,i.UNSIGNED_BYTE,Ct):i.texImage2D(Tt+Yt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ct);return At}const K={};K[i.TEXTURE_2D]=rt(i.TEXTURE_2D,i.TEXTURE_2D,1),K[i.TEXTURE_CUBE_MAP]=rt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),K[i.TEXTURE_2D_ARRAY]=rt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),K[i.TEXTURE_3D]=rt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),o.setClear(0,0,0,1),r.setClear(1),a.setClear(0),$(i.DEPTH_TEST),r.setFunc(ks),st(!1),yt(ad),$(i.CULL_FACE),B(Kn);function $(W){h[W]!==!0&&(i.enable(W),h[W]=!0)}function ot(W){h[W]!==!1&&(i.disable(W),h[W]=!1)}function mt(W,Tt){return u[W]!==Tt?(i.bindFramebuffer(W,Tt),u[W]=Tt,W===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=Tt),W===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=Tt),!0):!1}function Mt(W,Tt){let it=d,ut=!1;if(W){it=f.get(Tt),it===void 0&&(it=[],f.set(Tt,it));const Ct=W.textures;if(it.length!==Ct.length||it[0]!==i.COLOR_ATTACHMENT0){for(let At=0,Yt=Ct.length;At<Yt;At++)it[At]=i.COLOR_ATTACHMENT0+At;it.length=Ct.length,ut=!0}}else it[0]!==i.BACK&&(it[0]=i.BACK,ut=!0);ut&&i.drawBuffers(it)}function Ft(W){return g!==W?(i.useProgram(W),g=W,!0):!1}const nt={[Hi]:i.FUNC_ADD,[Gg]:i.FUNC_SUBTRACT,[Vg]:i.FUNC_REVERSE_SUBTRACT};nt[Wg]=i.MIN,nt[Xg]=i.MAX;const ht={[qg]:i.ZERO,[Yg]:i.ONE,[$g]:i.SRC_COLOR,[Hl]:i.SRC_ALPHA,[t1]:i.SRC_ALPHA_SATURATE,[Jg]:i.DST_COLOR,[Kg]:i.DST_ALPHA,[Zg]:i.ONE_MINUS_SRC_COLOR,[Gl]:i.ONE_MINUS_SRC_ALPHA,[Qg]:i.ONE_MINUS_DST_COLOR,[jg]:i.ONE_MINUS_DST_ALPHA,[e1]:i.CONSTANT_COLOR,[n1]:i.ONE_MINUS_CONSTANT_COLOR,[i1]:i.CONSTANT_ALPHA,[s1]:i.ONE_MINUS_CONSTANT_ALPHA};function B(W,Tt,it,ut,Ct,At,Yt,Se,ke,pe){if(W===Kn){y===!0&&(ot(i.BLEND),y=!1);return}if(y===!1&&($(i.BLEND),y=!0),W!==Hg){if(W!==m||pe!==M){if((p!==Hi||v!==Hi)&&(i.blendEquation(i.FUNC_ADD),p=Hi,v=Hi),pe)switch(W){case Is:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Bl:i.blendFunc(i.ONE,i.ONE);break;case cd:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ld:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}else switch(W){case Is:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Bl:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case cd:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ld:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}_=null,w=null,b=null,S=null,E.set(0,0,0),T=0,m=W,M=pe}return}Ct=Ct||Tt,At=At||it,Yt=Yt||ut,(Tt!==p||Ct!==v)&&(i.blendEquationSeparate(nt[Tt],nt[Ct]),p=Tt,v=Ct),(it!==_||ut!==w||At!==b||Yt!==S)&&(i.blendFuncSeparate(ht[it],ht[ut],ht[At],ht[Yt]),_=it,w=ut,b=At,S=Yt),(Se.equals(E)===!1||ke!==T)&&(i.blendColor(Se.r,Se.g,Se.b,ke),E.copy(Se),T=ke),m=W,M=!1}function ft(W,Tt){W.side===yn?ot(i.CULL_FACE):$(i.CULL_FACE);let it=W.side===Ke;Tt&&(it=!it),st(it),W.blending===Is&&W.transparent===!1?B(Kn):B(W.blending,W.blendEquation,W.blendSrc,W.blendDst,W.blendEquationAlpha,W.blendSrcAlpha,W.blendDstAlpha,W.blendColor,W.blendAlpha,W.premultipliedAlpha),r.setFunc(W.depthFunc),r.setTest(W.depthTest),r.setMask(W.depthWrite),o.setMask(W.colorWrite);const ut=W.stencilWrite;a.setTest(ut),ut&&(a.setMask(W.stencilWriteMask),a.setFunc(W.stencilFunc,W.stencilRef,W.stencilFuncMask),a.setOp(W.stencilFail,W.stencilZFail,W.stencilZPass)),Gt(W.polygonOffset,W.polygonOffsetFactor,W.polygonOffsetUnits),W.alphaToCoverage===!0?$(i.SAMPLE_ALPHA_TO_COVERAGE):ot(i.SAMPLE_ALPHA_TO_COVERAGE)}function st(W){x!==W&&(W?i.frontFace(i.CW):i.frontFace(i.CCW),x=W)}function yt(W){W!==zg?($(i.CULL_FACE),W!==A&&(W===ad?i.cullFace(i.BACK):W===Bg?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ot(i.CULL_FACE),A=W}function vt(W){W!==P&&(N&&i.lineWidth(W),P=W)}function Gt(W,Tt,it){W?($(i.POLYGON_OFFSET_FILL),(R!==Tt||F!==it)&&(i.polygonOffset(Tt,it),R=Tt,F=it)):ot(i.POLYGON_OFFSET_FILL)}function Pt(W){W?$(i.SCISSOR_TEST):ot(i.SCISSOR_TEST)}function z(W){W===void 0&&(W=i.TEXTURE0+D-1),V!==W&&(i.activeTexture(W),V=W)}function U(W,Tt,it){it===void 0&&(V===null?it=i.TEXTURE0+D-1:it=V);let ut=et[it];ut===void 0&&(ut={type:void 0,texture:void 0},et[it]=ut),(ut.type!==W||ut.texture!==Tt)&&(V!==it&&(i.activeTexture(it),V=it),i.bindTexture(W,Tt||K[W]),ut.type=W,ut.texture=Tt)}function Z(){const W=et[V];W!==void 0&&W.type!==void 0&&(i.bindTexture(W.type,null),W.type=void 0,W.texture=void 0)}function at(){try{i.compressedTexImage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function dt(){try{i.compressedTexImage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function ct(){try{i.texSubImage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Ut(){try{i.texSubImage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Et(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function It(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function ie(){try{i.texStorage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function gt(){try{i.texStorage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Dt(){try{i.texImage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Vt(){try{i.texImage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Xt(W){Lt.equals(W)===!1&&(i.scissor(W.x,W.y,W.z,W.w),Lt.copy(W))}function Nt(W){J.equals(W)===!1&&(i.viewport(W.x,W.y,W.z,W.w),J.copy(W))}function oe(W,Tt){let it=l.get(Tt);it===void 0&&(it=new WeakMap,l.set(Tt,it));let ut=it.get(W);ut===void 0&&(ut=i.getUniformBlockIndex(Tt,W.name),it.set(W,ut))}function Jt(W,Tt){const ut=l.get(Tt).get(W);c.get(Tt)!==ut&&(i.uniformBlockBinding(Tt,ut,W.__bindingPointIndex),c.set(Tt,ut))}function ye(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),r.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},V=null,et={},u={},f=new WeakMap,d=[],g=null,y=!1,m=null,p=null,_=null,w=null,v=null,b=null,S=null,E=new Wt(0,0,0),T=0,M=!1,x=null,A=null,P=null,R=null,F=null,Lt.set(0,0,i.canvas.width,i.canvas.height),J.set(0,0,i.canvas.width,i.canvas.height),o.reset(),r.reset(),a.reset()}return{buffers:{color:o,depth:r,stencil:a},enable:$,disable:ot,bindFramebuffer:mt,drawBuffers:Mt,useProgram:Ft,setBlending:B,setMaterial:ft,setFlipSided:st,setCullFace:yt,setLineWidth:vt,setPolygonOffset:Gt,setScissorTest:Pt,activeTexture:z,bindTexture:U,unbindTexture:Z,compressedTexImage2D:at,compressedTexImage3D:dt,texImage2D:Dt,texImage3D:Vt,updateUBOMapping:oe,uniformBlockBinding:Jt,texStorage2D:ie,texStorage3D:gt,texSubImage2D:ct,texSubImage3D:Ut,compressedTexSubImage2D:Et,compressedTexSubImage3D:It,scissor:Xt,viewport:Nt,reset:ye}}function s0(i,t,e,n){const s=L_(n);switch(e){case wp:return i*t;case xp:return i*t;case Mp:return i*t*2;case Wa:return i*t/s.components*s.byteLength;case ru:return i*t/s.components*s.byteLength;case bp:return i*t*2/s.components*s.byteLength;case au:return i*t*2/s.components*s.byteLength;case _p:return i*t*3/s.components*s.byteLength;case un:return i*t*4/s.components*s.byteLength;case cu:return i*t*4/s.components*s.byteLength;case da:case fa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case pa:case ma:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case th:case nh:return Math.max(i,16)*Math.max(t,8)/4;case Ql:case eh:return Math.max(i,8)*Math.max(t,8)/2;case ih:case sh:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case oh:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case rh:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ah:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case ch:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case lh:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case hh:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case uh:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case dh:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case fh:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case ph:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case mh:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case gh:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case yh:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case vh:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case wh:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case ga:case _h:case xh:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Sp:case Mh:return Math.ceil(i/4)*Math.ceil(t/4)*8;case bh:case Sh:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function L_(i){switch(i){case vn:case gp:return{byteLength:1,components:1};case Go:case yp:case Ei:return{byteLength:2,components:1};case su:case ou:return{byteLength:2,components:4};case $i:case iu:case Yn:return{byteLength:4,components:1};case vp:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function D_(i,t,e,n,s,o,r){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new tt,h=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(z,U){return d?new OffscreenCanvas(z,U):Sa("canvas")}function y(z,U,Z){let at=1;const dt=Pt(z);if((dt.width>Z||dt.height>Z)&&(at=Z/Math.max(dt.width,dt.height)),at<1)if(typeof HTMLImageElement<"u"&&z instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&z instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&z instanceof ImageBitmap||typeof VideoFrame<"u"&&z instanceof VideoFrame){const ct=Math.floor(at*dt.width),Ut=Math.floor(at*dt.height);u===void 0&&(u=g(ct,Ut));const Et=U?g(ct,Ut):u;return Et.width=ct,Et.height=Ut,Et.getContext("2d").drawImage(z,0,0,ct,Ut),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+dt.width+"x"+dt.height+") to ("+ct+"x"+Ut+")."),Et}else return"data"in z&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+dt.width+"x"+dt.height+")."),z;return z}function m(z){return z.generateMipmaps}function p(z){i.generateMipmap(z)}function _(z){return z.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:z.isWebGL3DRenderTarget?i.TEXTURE_3D:z.isWebGLArrayRenderTarget||z.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function w(z,U,Z,at,dt=!1){if(z!==null){if(i[z]!==void 0)return i[z];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+z+"'")}let ct=U;if(U===i.RED&&(Z===i.FLOAT&&(ct=i.R32F),Z===i.HALF_FLOAT&&(ct=i.R16F),Z===i.UNSIGNED_BYTE&&(ct=i.R8)),U===i.RED_INTEGER&&(Z===i.UNSIGNED_BYTE&&(ct=i.R8UI),Z===i.UNSIGNED_SHORT&&(ct=i.R16UI),Z===i.UNSIGNED_INT&&(ct=i.R32UI),Z===i.BYTE&&(ct=i.R8I),Z===i.SHORT&&(ct=i.R16I),Z===i.INT&&(ct=i.R32I)),U===i.RG&&(Z===i.FLOAT&&(ct=i.RG32F),Z===i.HALF_FLOAT&&(ct=i.RG16F),Z===i.UNSIGNED_BYTE&&(ct=i.RG8)),U===i.RG_INTEGER&&(Z===i.UNSIGNED_BYTE&&(ct=i.RG8UI),Z===i.UNSIGNED_SHORT&&(ct=i.RG16UI),Z===i.UNSIGNED_INT&&(ct=i.RG32UI),Z===i.BYTE&&(ct=i.RG8I),Z===i.SHORT&&(ct=i.RG16I),Z===i.INT&&(ct=i.RG32I)),U===i.RGB_INTEGER&&(Z===i.UNSIGNED_BYTE&&(ct=i.RGB8UI),Z===i.UNSIGNED_SHORT&&(ct=i.RGB16UI),Z===i.UNSIGNED_INT&&(ct=i.RGB32UI),Z===i.BYTE&&(ct=i.RGB8I),Z===i.SHORT&&(ct=i.RGB16I),Z===i.INT&&(ct=i.RGB32I)),U===i.RGBA_INTEGER&&(Z===i.UNSIGNED_BYTE&&(ct=i.RGBA8UI),Z===i.UNSIGNED_SHORT&&(ct=i.RGBA16UI),Z===i.UNSIGNED_INT&&(ct=i.RGBA32UI),Z===i.BYTE&&(ct=i.RGBA8I),Z===i.SHORT&&(ct=i.RGBA16I),Z===i.INT&&(ct=i.RGBA32I)),U===i.RGB&&Z===i.UNSIGNED_INT_5_9_9_9_REV&&(ct=i.RGB9_E5),U===i.RGBA){const Ut=dt?Xa:re.getTransfer(at);Z===i.FLOAT&&(ct=i.RGBA32F),Z===i.HALF_FLOAT&&(ct=i.RGBA16F),Z===i.UNSIGNED_BYTE&&(ct=Ut===me?i.SRGB8_ALPHA8:i.RGBA8),Z===i.UNSIGNED_SHORT_4_4_4_4&&(ct=i.RGBA4),Z===i.UNSIGNED_SHORT_5_5_5_1&&(ct=i.RGB5_A1)}return(ct===i.R16F||ct===i.R32F||ct===i.RG16F||ct===i.RG32F||ct===i.RGBA16F||ct===i.RGBA32F)&&t.get("EXT_color_buffer_float"),ct}function v(z,U){let Z;return z?U===null||U===$i||U===Hs?Z=i.DEPTH24_STENCIL8:U===Yn?Z=i.DEPTH32F_STENCIL8:U===Go&&(Z=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):U===null||U===$i||U===Hs?Z=i.DEPTH_COMPONENT24:U===Yn?Z=i.DEPTH_COMPONENT32F:U===Go&&(Z=i.DEPTH_COMPONENT16),Z}function b(z,U){return m(z)===!0||z.isFramebufferTexture&&z.minFilter!==Oe&&z.minFilter!==Fe?Math.log2(Math.max(U.width,U.height))+1:z.mipmaps!==void 0&&z.mipmaps.length>0?z.mipmaps.length:z.isCompressedTexture&&Array.isArray(z.image)?U.mipmaps.length:1}function S(z){const U=z.target;U.removeEventListener("dispose",S),T(U),U.isVideoTexture&&h.delete(U)}function E(z){const U=z.target;U.removeEventListener("dispose",E),x(U)}function T(z){const U=n.get(z);if(U.__webglInit===void 0)return;const Z=z.source,at=f.get(Z);if(at){const dt=at[U.__cacheKey];dt.usedTimes--,dt.usedTimes===0&&M(z),Object.keys(at).length===0&&f.delete(Z)}n.remove(z)}function M(z){const U=n.get(z);i.deleteTexture(U.__webglTexture);const Z=z.source,at=f.get(Z);delete at[U.__cacheKey],r.memory.textures--}function x(z){const U=n.get(z);if(z.depthTexture&&(z.depthTexture.dispose(),n.remove(z.depthTexture)),z.isWebGLCubeRenderTarget)for(let at=0;at<6;at++){if(Array.isArray(U.__webglFramebuffer[at]))for(let dt=0;dt<U.__webglFramebuffer[at].length;dt++)i.deleteFramebuffer(U.__webglFramebuffer[at][dt]);else i.deleteFramebuffer(U.__webglFramebuffer[at]);U.__webglDepthbuffer&&i.deleteRenderbuffer(U.__webglDepthbuffer[at])}else{if(Array.isArray(U.__webglFramebuffer))for(let at=0;at<U.__webglFramebuffer.length;at++)i.deleteFramebuffer(U.__webglFramebuffer[at]);else i.deleteFramebuffer(U.__webglFramebuffer);if(U.__webglDepthbuffer&&i.deleteRenderbuffer(U.__webglDepthbuffer),U.__webglMultisampledFramebuffer&&i.deleteFramebuffer(U.__webglMultisampledFramebuffer),U.__webglColorRenderbuffer)for(let at=0;at<U.__webglColorRenderbuffer.length;at++)U.__webglColorRenderbuffer[at]&&i.deleteRenderbuffer(U.__webglColorRenderbuffer[at]);U.__webglDepthRenderbuffer&&i.deleteRenderbuffer(U.__webglDepthRenderbuffer)}const Z=z.textures;for(let at=0,dt=Z.length;at<dt;at++){const ct=n.get(Z[at]);ct.__webglTexture&&(i.deleteTexture(ct.__webglTexture),r.memory.textures--),n.remove(Z[at])}n.remove(z)}let A=0;function P(){A=0}function R(){const z=A;return z>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+z+" texture units while this GPU supports only "+s.maxTextures),A+=1,z}function F(z){const U=[];return U.push(z.wrapS),U.push(z.wrapT),U.push(z.wrapR||0),U.push(z.magFilter),U.push(z.minFilter),U.push(z.anisotropy),U.push(z.internalFormat),U.push(z.format),U.push(z.type),U.push(z.generateMipmaps),U.push(z.premultiplyAlpha),U.push(z.flipY),U.push(z.unpackAlignment),U.push(z.colorSpace),U.join()}function D(z,U){const Z=n.get(z);if(z.isVideoTexture&&vt(z),z.isRenderTargetTexture===!1&&z.version>0&&Z.__version!==z.version){const at=z.image;if(at===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(at.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{J(Z,z,U);return}}e.bindTexture(i.TEXTURE_2D,Z.__webglTexture,i.TEXTURE0+U)}function N(z,U){const Z=n.get(z);if(z.version>0&&Z.__version!==z.version){J(Z,z,U);return}e.bindTexture(i.TEXTURE_2D_ARRAY,Z.__webglTexture,i.TEXTURE0+U)}function H(z,U){const Z=n.get(z);if(z.version>0&&Z.__version!==z.version){J(Z,z,U);return}e.bindTexture(i.TEXTURE_3D,Z.__webglTexture,i.TEXTURE0+U)}function G(z,U){const Z=n.get(z);if(z.version>0&&Z.__version!==z.version){rt(Z,z,U);return}e.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture,i.TEXTURE0+U)}const V={[Yi]:i.REPEAT,[qn]:i.CLAMP_TO_EDGE,[Jl]:i.MIRRORED_REPEAT},et={[Oe]:i.NEAREST,[c1]:i.NEAREST_MIPMAP_NEAREST,[cr]:i.NEAREST_MIPMAP_LINEAR,[Fe]:i.LINEAR,[rc]:i.LINEAR_MIPMAP_NEAREST,[gi]:i.LINEAR_MIPMAP_LINEAR},lt={[u1]:i.NEVER,[y1]:i.ALWAYS,[d1]:i.LESS,[Tp]:i.LEQUAL,[f1]:i.EQUAL,[g1]:i.GEQUAL,[p1]:i.GREATER,[m1]:i.NOTEQUAL};function bt(z,U){if(U.type===Yn&&t.has("OES_texture_float_linear")===!1&&(U.magFilter===Fe||U.magFilter===rc||U.magFilter===cr||U.magFilter===gi||U.minFilter===Fe||U.minFilter===rc||U.minFilter===cr||U.minFilter===gi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(z,i.TEXTURE_WRAP_S,V[U.wrapS]),i.texParameteri(z,i.TEXTURE_WRAP_T,V[U.wrapT]),(z===i.TEXTURE_3D||z===i.TEXTURE_2D_ARRAY)&&i.texParameteri(z,i.TEXTURE_WRAP_R,V[U.wrapR]),i.texParameteri(z,i.TEXTURE_MAG_FILTER,et[U.magFilter]),i.texParameteri(z,i.TEXTURE_MIN_FILTER,et[U.minFilter]),U.compareFunction&&(i.texParameteri(z,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(z,i.TEXTURE_COMPARE_FUNC,lt[U.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(U.magFilter===Oe||U.minFilter!==cr&&U.minFilter!==gi||U.type===Yn&&t.has("OES_texture_float_linear")===!1)return;if(U.anisotropy>1||n.get(U).__currentAnisotropy){const Z=t.get("EXT_texture_filter_anisotropic");i.texParameterf(z,Z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(U.anisotropy,s.getMaxAnisotropy())),n.get(U).__currentAnisotropy=U.anisotropy}}}function Lt(z,U){let Z=!1;z.__webglInit===void 0&&(z.__webglInit=!0,U.addEventListener("dispose",S));const at=U.source;let dt=f.get(at);dt===void 0&&(dt={},f.set(at,dt));const ct=F(U);if(ct!==z.__cacheKey){dt[ct]===void 0&&(dt[ct]={texture:i.createTexture(),usedTimes:0},r.memory.textures++,Z=!0),dt[ct].usedTimes++;const Ut=dt[z.__cacheKey];Ut!==void 0&&(dt[z.__cacheKey].usedTimes--,Ut.usedTimes===0&&M(U)),z.__cacheKey=ct,z.__webglTexture=dt[ct].texture}return Z}function J(z,U,Z){let at=i.TEXTURE_2D;(U.isDataArrayTexture||U.isCompressedArrayTexture)&&(at=i.TEXTURE_2D_ARRAY),U.isData3DTexture&&(at=i.TEXTURE_3D);const dt=Lt(z,U),ct=U.source;e.bindTexture(at,z.__webglTexture,i.TEXTURE0+Z);const Ut=n.get(ct);if(ct.version!==Ut.__version||dt===!0){e.activeTexture(i.TEXTURE0+Z);const Et=re.getPrimaries(re.workingColorSpace),It=U.colorSpace===Xn?null:re.getPrimaries(U.colorSpace),ie=U.colorSpace===Xn||Et===It?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,U.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,U.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ie);let gt=y(U.image,!1,s.maxTextureSize);gt=Gt(U,gt);const Dt=o.convert(U.format,U.colorSpace),Vt=o.convert(U.type);let Xt=w(U.internalFormat,Dt,Vt,U.colorSpace,U.isVideoTexture);bt(at,U);let Nt;const oe=U.mipmaps,Jt=U.isVideoTexture!==!0,ye=Ut.__version===void 0||dt===!0,W=ct.dataReady,Tt=b(U,gt);if(U.isDepthTexture)Xt=v(U.format===Gs,U.type),ye&&(Jt?e.texStorage2D(i.TEXTURE_2D,1,Xt,gt.width,gt.height):e.texImage2D(i.TEXTURE_2D,0,Xt,gt.width,gt.height,0,Dt,Vt,null));else if(U.isDataTexture)if(oe.length>0){Jt&&ye&&e.texStorage2D(i.TEXTURE_2D,Tt,Xt,oe[0].width,oe[0].height);for(let it=0,ut=oe.length;it<ut;it++)Nt=oe[it],Jt?W&&e.texSubImage2D(i.TEXTURE_2D,it,0,0,Nt.width,Nt.height,Dt,Vt,Nt.data):e.texImage2D(i.TEXTURE_2D,it,Xt,Nt.width,Nt.height,0,Dt,Vt,Nt.data);U.generateMipmaps=!1}else Jt?(ye&&e.texStorage2D(i.TEXTURE_2D,Tt,Xt,gt.width,gt.height),W&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,gt.width,gt.height,Dt,Vt,gt.data)):e.texImage2D(i.TEXTURE_2D,0,Xt,gt.width,gt.height,0,Dt,Vt,gt.data);else if(U.isCompressedTexture)if(U.isCompressedArrayTexture){Jt&&ye&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Tt,Xt,oe[0].width,oe[0].height,gt.depth);for(let it=0,ut=oe.length;it<ut;it++)if(Nt=oe[it],U.format!==un)if(Dt!==null)if(Jt){if(W)if(U.layerUpdates.size>0){const Ct=s0(Nt.width,Nt.height,U.format,U.type);for(const At of U.layerUpdates){const Yt=Nt.data.subarray(At*Ct/Nt.data.BYTES_PER_ELEMENT,(At+1)*Ct/Nt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,At,Nt.width,Nt.height,1,Dt,Yt)}U.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,0,Nt.width,Nt.height,gt.depth,Dt,Nt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,it,Xt,Nt.width,Nt.height,gt.depth,0,Nt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Jt?W&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,0,Nt.width,Nt.height,gt.depth,Dt,Vt,Nt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,it,Xt,Nt.width,Nt.height,gt.depth,0,Dt,Vt,Nt.data)}else{Jt&&ye&&e.texStorage2D(i.TEXTURE_2D,Tt,Xt,oe[0].width,oe[0].height);for(let it=0,ut=oe.length;it<ut;it++)Nt=oe[it],U.format!==un?Dt!==null?Jt?W&&e.compressedTexSubImage2D(i.TEXTURE_2D,it,0,0,Nt.width,Nt.height,Dt,Nt.data):e.compressedTexImage2D(i.TEXTURE_2D,it,Xt,Nt.width,Nt.height,0,Nt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Jt?W&&e.texSubImage2D(i.TEXTURE_2D,it,0,0,Nt.width,Nt.height,Dt,Vt,Nt.data):e.texImage2D(i.TEXTURE_2D,it,Xt,Nt.width,Nt.height,0,Dt,Vt,Nt.data)}else if(U.isDataArrayTexture)if(Jt){if(ye&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Tt,Xt,gt.width,gt.height,gt.depth),W)if(U.layerUpdates.size>0){const it=s0(gt.width,gt.height,U.format,U.type);for(const ut of U.layerUpdates){const Ct=gt.data.subarray(ut*it/gt.data.BYTES_PER_ELEMENT,(ut+1)*it/gt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ut,gt.width,gt.height,1,Dt,Vt,Ct)}U.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,gt.width,gt.height,gt.depth,Dt,Vt,gt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Xt,gt.width,gt.height,gt.depth,0,Dt,Vt,gt.data);else if(U.isData3DTexture)Jt?(ye&&e.texStorage3D(i.TEXTURE_3D,Tt,Xt,gt.width,gt.height,gt.depth),W&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,gt.width,gt.height,gt.depth,Dt,Vt,gt.data)):e.texImage3D(i.TEXTURE_3D,0,Xt,gt.width,gt.height,gt.depth,0,Dt,Vt,gt.data);else if(U.isFramebufferTexture){if(ye)if(Jt)e.texStorage2D(i.TEXTURE_2D,Tt,Xt,gt.width,gt.height);else{let it=gt.width,ut=gt.height;for(let Ct=0;Ct<Tt;Ct++)e.texImage2D(i.TEXTURE_2D,Ct,Xt,it,ut,0,Dt,Vt,null),it>>=1,ut>>=1}}else if(oe.length>0){if(Jt&&ye){const it=Pt(oe[0]);e.texStorage2D(i.TEXTURE_2D,Tt,Xt,it.width,it.height)}for(let it=0,ut=oe.length;it<ut;it++)Nt=oe[it],Jt?W&&e.texSubImage2D(i.TEXTURE_2D,it,0,0,Dt,Vt,Nt):e.texImage2D(i.TEXTURE_2D,it,Xt,Dt,Vt,Nt);U.generateMipmaps=!1}else if(Jt){if(ye){const it=Pt(gt);e.texStorage2D(i.TEXTURE_2D,Tt,Xt,it.width,it.height)}W&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Dt,Vt,gt)}else e.texImage2D(i.TEXTURE_2D,0,Xt,Dt,Vt,gt);m(U)&&p(at),Ut.__version=ct.version,U.onUpdate&&U.onUpdate(U)}z.__version=U.version}function rt(z,U,Z){if(U.image.length!==6)return;const at=Lt(z,U),dt=U.source;e.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+Z);const ct=n.get(dt);if(dt.version!==ct.__version||at===!0){e.activeTexture(i.TEXTURE0+Z);const Ut=re.getPrimaries(re.workingColorSpace),Et=U.colorSpace===Xn?null:re.getPrimaries(U.colorSpace),It=U.colorSpace===Xn||Ut===Et?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,U.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,U.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,It);const ie=U.isCompressedTexture||U.image[0].isCompressedTexture,gt=U.image[0]&&U.image[0].isDataTexture,Dt=[];for(let ut=0;ut<6;ut++)!ie&&!gt?Dt[ut]=y(U.image[ut],!0,s.maxCubemapSize):Dt[ut]=gt?U.image[ut].image:U.image[ut],Dt[ut]=Gt(U,Dt[ut]);const Vt=Dt[0],Xt=o.convert(U.format,U.colorSpace),Nt=o.convert(U.type),oe=w(U.internalFormat,Xt,Nt,U.colorSpace),Jt=U.isVideoTexture!==!0,ye=ct.__version===void 0||at===!0,W=dt.dataReady;let Tt=b(U,Vt);bt(i.TEXTURE_CUBE_MAP,U);let it;if(ie){Jt&&ye&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Tt,oe,Vt.width,Vt.height);for(let ut=0;ut<6;ut++){it=Dt[ut].mipmaps;for(let Ct=0;Ct<it.length;Ct++){const At=it[Ct];U.format!==un?Xt!==null?Jt?W&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct,0,0,At.width,At.height,Xt,At.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct,oe,At.width,At.height,0,At.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Jt?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct,0,0,At.width,At.height,Xt,Nt,At.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct,oe,At.width,At.height,0,Xt,Nt,At.data)}}}else{if(it=U.mipmaps,Jt&&ye){it.length>0&&Tt++;const ut=Pt(Dt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Tt,oe,ut.width,ut.height)}for(let ut=0;ut<6;ut++)if(gt){Jt?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,0,0,Dt[ut].width,Dt[ut].height,Xt,Nt,Dt[ut].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,oe,Dt[ut].width,Dt[ut].height,0,Xt,Nt,Dt[ut].data);for(let Ct=0;Ct<it.length;Ct++){const Yt=it[Ct].image[ut].image;Jt?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct+1,0,0,Yt.width,Yt.height,Xt,Nt,Yt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct+1,oe,Yt.width,Yt.height,0,Xt,Nt,Yt.data)}}else{Jt?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,0,0,Xt,Nt,Dt[ut]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,oe,Xt,Nt,Dt[ut]);for(let Ct=0;Ct<it.length;Ct++){const At=it[Ct];Jt?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct+1,0,0,Xt,Nt,At.image[ut]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct+1,oe,Xt,Nt,At.image[ut])}}}m(U)&&p(i.TEXTURE_CUBE_MAP),ct.__version=dt.version,U.onUpdate&&U.onUpdate(U)}z.__version=U.version}function K(z,U,Z,at,dt,ct){const Ut=o.convert(Z.format,Z.colorSpace),Et=o.convert(Z.type),It=w(Z.internalFormat,Ut,Et,Z.colorSpace),ie=n.get(U),gt=n.get(Z);if(gt.__renderTarget=U,!ie.__hasExternalTextures){const Dt=Math.max(1,U.width>>ct),Vt=Math.max(1,U.height>>ct);dt===i.TEXTURE_3D||dt===i.TEXTURE_2D_ARRAY?e.texImage3D(dt,ct,It,Dt,Vt,U.depth,0,Ut,Et,null):e.texImage2D(dt,ct,It,Dt,Vt,0,Ut,Et,null)}e.bindFramebuffer(i.FRAMEBUFFER,z),yt(U)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,at,dt,gt.__webglTexture,0,st(U)):(dt===i.TEXTURE_2D||dt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&dt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,at,dt,gt.__webglTexture,ct),e.bindFramebuffer(i.FRAMEBUFFER,null)}function $(z,U,Z){if(i.bindRenderbuffer(i.RENDERBUFFER,z),U.depthBuffer){const at=U.depthTexture,dt=at&&at.isDepthTexture?at.type:null,ct=v(U.stencilBuffer,dt),Ut=U.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Et=st(U);yt(U)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Et,ct,U.width,U.height):Z?i.renderbufferStorageMultisample(i.RENDERBUFFER,Et,ct,U.width,U.height):i.renderbufferStorage(i.RENDERBUFFER,ct,U.width,U.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ut,i.RENDERBUFFER,z)}else{const at=U.textures;for(let dt=0;dt<at.length;dt++){const ct=at[dt],Ut=o.convert(ct.format,ct.colorSpace),Et=o.convert(ct.type),It=w(ct.internalFormat,Ut,Et,ct.colorSpace),ie=st(U);Z&&yt(U)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,ie,It,U.width,U.height):yt(U)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ie,It,U.width,U.height):i.renderbufferStorage(i.RENDERBUFFER,It,U.width,U.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ot(z,U){if(U&&U.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,z),!(U.depthTexture&&U.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const at=n.get(U.depthTexture);at.__renderTarget=U,(!at.__webglTexture||U.depthTexture.image.width!==U.width||U.depthTexture.image.height!==U.height)&&(U.depthTexture.image.width=U.width,U.depthTexture.image.height=U.height,U.depthTexture.needsUpdate=!0),D(U.depthTexture,0);const dt=at.__webglTexture,ct=st(U);if(U.depthTexture.format===Ls)yt(U)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,dt,0,ct):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,dt,0);else if(U.depthTexture.format===Gs)yt(U)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,dt,0,ct):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,dt,0);else throw new Error("Unknown depthTexture format")}function mt(z){const U=n.get(z),Z=z.isWebGLCubeRenderTarget===!0;if(U.__boundDepthTexture!==z.depthTexture){const at=z.depthTexture;if(U.__depthDisposeCallback&&U.__depthDisposeCallback(),at){const dt=()=>{delete U.__boundDepthTexture,delete U.__depthDisposeCallback,at.removeEventListener("dispose",dt)};at.addEventListener("dispose",dt),U.__depthDisposeCallback=dt}U.__boundDepthTexture=at}if(z.depthTexture&&!U.__autoAllocateDepthBuffer){if(Z)throw new Error("target.depthTexture not supported in Cube render targets");ot(U.__webglFramebuffer,z)}else if(Z){U.__webglDepthbuffer=[];for(let at=0;at<6;at++)if(e.bindFramebuffer(i.FRAMEBUFFER,U.__webglFramebuffer[at]),U.__webglDepthbuffer[at]===void 0)U.__webglDepthbuffer[at]=i.createRenderbuffer(),$(U.__webglDepthbuffer[at],z,!1);else{const dt=z.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ct=U.__webglDepthbuffer[at];i.bindRenderbuffer(i.RENDERBUFFER,ct),i.framebufferRenderbuffer(i.FRAMEBUFFER,dt,i.RENDERBUFFER,ct)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,U.__webglFramebuffer),U.__webglDepthbuffer===void 0)U.__webglDepthbuffer=i.createRenderbuffer(),$(U.__webglDepthbuffer,z,!1);else{const at=z.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,dt=U.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,dt),i.framebufferRenderbuffer(i.FRAMEBUFFER,at,i.RENDERBUFFER,dt)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Mt(z,U,Z){const at=n.get(z);U!==void 0&&K(at.__webglFramebuffer,z,z.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),Z!==void 0&&mt(z)}function Ft(z){const U=z.texture,Z=n.get(z),at=n.get(U);z.addEventListener("dispose",E);const dt=z.textures,ct=z.isWebGLCubeRenderTarget===!0,Ut=dt.length>1;if(Ut||(at.__webglTexture===void 0&&(at.__webglTexture=i.createTexture()),at.__version=U.version,r.memory.textures++),ct){Z.__webglFramebuffer=[];for(let Et=0;Et<6;Et++)if(U.mipmaps&&U.mipmaps.length>0){Z.__webglFramebuffer[Et]=[];for(let It=0;It<U.mipmaps.length;It++)Z.__webglFramebuffer[Et][It]=i.createFramebuffer()}else Z.__webglFramebuffer[Et]=i.createFramebuffer()}else{if(U.mipmaps&&U.mipmaps.length>0){Z.__webglFramebuffer=[];for(let Et=0;Et<U.mipmaps.length;Et++)Z.__webglFramebuffer[Et]=i.createFramebuffer()}else Z.__webglFramebuffer=i.createFramebuffer();if(Ut)for(let Et=0,It=dt.length;Et<It;Et++){const ie=n.get(dt[Et]);ie.__webglTexture===void 0&&(ie.__webglTexture=i.createTexture(),r.memory.textures++)}if(z.samples>0&&yt(z)===!1){Z.__webglMultisampledFramebuffer=i.createFramebuffer(),Z.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,Z.__webglMultisampledFramebuffer);for(let Et=0;Et<dt.length;Et++){const It=dt[Et];Z.__webglColorRenderbuffer[Et]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,Z.__webglColorRenderbuffer[Et]);const ie=o.convert(It.format,It.colorSpace),gt=o.convert(It.type),Dt=w(It.internalFormat,ie,gt,It.colorSpace,z.isXRRenderTarget===!0),Vt=st(z);i.renderbufferStorageMultisample(i.RENDERBUFFER,Vt,Dt,z.width,z.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Et,i.RENDERBUFFER,Z.__webglColorRenderbuffer[Et])}i.bindRenderbuffer(i.RENDERBUFFER,null),z.depthBuffer&&(Z.__webglDepthRenderbuffer=i.createRenderbuffer(),$(Z.__webglDepthRenderbuffer,z,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ct){e.bindTexture(i.TEXTURE_CUBE_MAP,at.__webglTexture),bt(i.TEXTURE_CUBE_MAP,U);for(let Et=0;Et<6;Et++)if(U.mipmaps&&U.mipmaps.length>0)for(let It=0;It<U.mipmaps.length;It++)K(Z.__webglFramebuffer[Et][It],z,U,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,It);else K(Z.__webglFramebuffer[Et],z,U,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0);m(U)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ut){for(let Et=0,It=dt.length;Et<It;Et++){const ie=dt[Et],gt=n.get(ie);e.bindTexture(i.TEXTURE_2D,gt.__webglTexture),bt(i.TEXTURE_2D,ie),K(Z.__webglFramebuffer,z,ie,i.COLOR_ATTACHMENT0+Et,i.TEXTURE_2D,0),m(ie)&&p(i.TEXTURE_2D)}e.unbindTexture()}else{let Et=i.TEXTURE_2D;if((z.isWebGL3DRenderTarget||z.isWebGLArrayRenderTarget)&&(Et=z.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Et,at.__webglTexture),bt(Et,U),U.mipmaps&&U.mipmaps.length>0)for(let It=0;It<U.mipmaps.length;It++)K(Z.__webglFramebuffer[It],z,U,i.COLOR_ATTACHMENT0,Et,It);else K(Z.__webglFramebuffer,z,U,i.COLOR_ATTACHMENT0,Et,0);m(U)&&p(Et),e.unbindTexture()}z.depthBuffer&&mt(z)}function nt(z){const U=z.textures;for(let Z=0,at=U.length;Z<at;Z++){const dt=U[Z];if(m(dt)){const ct=_(z),Ut=n.get(dt).__webglTexture;e.bindTexture(ct,Ut),p(ct),e.unbindTexture()}}}const ht=[],B=[];function ft(z){if(z.samples>0){if(yt(z)===!1){const U=z.textures,Z=z.width,at=z.height;let dt=i.COLOR_BUFFER_BIT;const ct=z.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ut=n.get(z),Et=U.length>1;if(Et)for(let It=0;It<U.length;It++)e.bindFramebuffer(i.FRAMEBUFFER,Ut.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Ut.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Ut.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ut.__webglFramebuffer);for(let It=0;It<U.length;It++){if(z.resolveDepthBuffer&&(z.depthBuffer&&(dt|=i.DEPTH_BUFFER_BIT),z.stencilBuffer&&z.resolveStencilBuffer&&(dt|=i.STENCIL_BUFFER_BIT)),Et){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ut.__webglColorRenderbuffer[It]);const ie=n.get(U[It]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ie,0)}i.blitFramebuffer(0,0,Z,at,0,0,Z,at,dt,i.NEAREST),c===!0&&(ht.length=0,B.length=0,ht.push(i.COLOR_ATTACHMENT0+It),z.depthBuffer&&z.resolveDepthBuffer===!1&&(ht.push(ct),B.push(ct),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,B)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ht))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Et)for(let It=0;It<U.length;It++){e.bindFramebuffer(i.FRAMEBUFFER,Ut.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.RENDERBUFFER,Ut.__webglColorRenderbuffer[It]);const ie=n.get(U[It]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Ut.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.TEXTURE_2D,ie,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ut.__webglMultisampledFramebuffer)}else if(z.depthBuffer&&z.resolveDepthBuffer===!1&&c){const U=z.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[U])}}}function st(z){return Math.min(s.maxSamples,z.samples)}function yt(z){const U=n.get(z);return z.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&U.__useRenderToTexture!==!1}function vt(z){const U=r.render.frame;h.get(z)!==U&&(h.set(z,U),z.update())}function Gt(z,U){const Z=z.colorSpace,at=z.format,dt=z.type;return z.isCompressedTexture===!0||z.isVideoTexture===!0||Z!==Ks&&Z!==Xn&&(re.getTransfer(Z)===me?(at!==un||dt!==vn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Z)),U}function Pt(z){return typeof HTMLImageElement<"u"&&z instanceof HTMLImageElement?(l.width=z.naturalWidth||z.width,l.height=z.naturalHeight||z.height):typeof VideoFrame<"u"&&z instanceof VideoFrame?(l.width=z.displayWidth,l.height=z.displayHeight):(l.width=z.width,l.height=z.height),l}this.allocateTextureUnit=R,this.resetTextureUnits=P,this.setTexture2D=D,this.setTexture2DArray=N,this.setTexture3D=H,this.setTextureCube=G,this.rebindTextures=Mt,this.setupRenderTarget=Ft,this.updateRenderTargetMipmap=nt,this.updateMultisampleRenderTarget=ft,this.setupDepthRenderbuffer=mt,this.setupFrameBufferTexture=K,this.useMultisampledRTT=yt}function N_(i,t){function e(n,s=Xn){let o;const r=re.getTransfer(s);if(n===vn)return i.UNSIGNED_BYTE;if(n===su)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ou)return i.UNSIGNED_SHORT_5_5_5_1;if(n===vp)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===gp)return i.BYTE;if(n===yp)return i.SHORT;if(n===Go)return i.UNSIGNED_SHORT;if(n===iu)return i.INT;if(n===$i)return i.UNSIGNED_INT;if(n===Yn)return i.FLOAT;if(n===Ei)return i.HALF_FLOAT;if(n===wp)return i.ALPHA;if(n===_p)return i.RGB;if(n===un)return i.RGBA;if(n===xp)return i.LUMINANCE;if(n===Mp)return i.LUMINANCE_ALPHA;if(n===Ls)return i.DEPTH_COMPONENT;if(n===Gs)return i.DEPTH_STENCIL;if(n===Wa)return i.RED;if(n===ru)return i.RED_INTEGER;if(n===bp)return i.RG;if(n===au)return i.RG_INTEGER;if(n===cu)return i.RGBA_INTEGER;if(n===da||n===fa||n===pa||n===ma)if(r===me)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(n===da)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===fa)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===pa)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ma)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(n===da)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===fa)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===pa)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ma)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ql||n===th||n===eh||n===nh)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(n===Ql)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===th)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===eh)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===nh)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ih||n===sh||n===oh)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(n===ih||n===sh)return r===me?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(n===oh)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===rh||n===ah||n===ch||n===lh||n===hh||n===uh||n===dh||n===fh||n===ph||n===mh||n===gh||n===yh||n===vh||n===wh)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(n===rh)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ah)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ch)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===lh)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===hh)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===uh)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===dh)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===fh)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ph)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===mh)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===gh)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===yh)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===vh)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===wh)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ga||n===_h||n===xh)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(n===ga)return r===me?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===_h)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===xh)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Sp||n===Mh||n===bh||n===Sh)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(n===ga)return o.COMPRESSED_RED_RGTC1_EXT;if(n===Mh)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===bh)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Sh)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Hs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class U_ extends Qe{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class he extends Ee{constructor(){super(),this.isGroup=!0,this.type="Group"}}const F_={type:"move"};class Dc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new he,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new he,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new he,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,o=null,r=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){r=!0;for(const y of t.hand.values()){const m=e.getJointPose(y,n),p=this._getHandJoint(l,y);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,g=.005;l.inputState.pinching&&f>d+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=d-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(o=e.getPose(t.gripSpace,n),o!==null&&(c.matrix.fromArray(o.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,o.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(o.linearVelocity)):c.hasLinearVelocity=!1,o.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(o.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&o!==null&&(s=o),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(F_)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=o!==null),l!==null&&(l.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new he;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const O_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,k_=`
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

}`;class z_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new je,o=t.properties.get(s);o.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Te({vertexShader:O_,fragmentShader:k_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ne(new _i(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class B_ extends js{constructor(t,e){super();const n=this;let s=null,o=1,r=null,a="local-floor",c=1,l=null,h=null,u=null,f=null,d=null,g=null;const y=new z_,m=e.getContextAttributes();let p=null,_=null;const w=[],v=[],b=new tt;let S=null;const E=new Qe;E.viewport=new le;const T=new Qe;T.viewport=new le;const M=[E,T],x=new U_;let A=null,P=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let rt=w[J];return rt===void 0&&(rt=new Dc,w[J]=rt),rt.getTargetRaySpace()},this.getControllerGrip=function(J){let rt=w[J];return rt===void 0&&(rt=new Dc,w[J]=rt),rt.getGripSpace()},this.getHand=function(J){let rt=w[J];return rt===void 0&&(rt=new Dc,w[J]=rt),rt.getHandSpace()};function R(J){const rt=v.indexOf(J.inputSource);if(rt===-1)return;const K=w[rt];K!==void 0&&(K.update(J.inputSource,J.frame,l||r),K.dispatchEvent({type:J.type,data:J.inputSource}))}function F(){s.removeEventListener("select",R),s.removeEventListener("selectstart",R),s.removeEventListener("selectend",R),s.removeEventListener("squeeze",R),s.removeEventListener("squeezestart",R),s.removeEventListener("squeezeend",R),s.removeEventListener("end",F),s.removeEventListener("inputsourceschange",D);for(let J=0;J<w.length;J++){const rt=v[J];rt!==null&&(v[J]=null,w[J].disconnect(rt))}A=null,P=null,y.reset(),t.setRenderTarget(p),d=null,f=null,u=null,s=null,_=null,Lt.stop(),n.isPresenting=!1,t.setPixelRatio(S),t.setSize(b.width,b.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){o=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){a=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",R),s.addEventListener("selectstart",R),s.addEventListener("selectend",R),s.addEventListener("squeeze",R),s.addEventListener("squeezestart",R),s.addEventListener("squeezeend",R),s.addEventListener("end",F),s.addEventListener("inputsourceschange",D),m.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(b),s.renderState.layers===void 0){const rt={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:o};d=new XRWebGLLayer(s,e,rt),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),_=new wn(d.framebufferWidth,d.framebufferHeight,{format:un,type:vn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let rt=null,K=null,$=null;m.depth&&($=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,rt=m.stencil?Gs:Ls,K=m.stencil?Hs:$i);const ot={colorFormat:e.RGBA8,depthFormat:$,scaleFactor:o};u=new XRWebGLBinding(s,e),f=u.createProjectionLayer(ot),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),_=new wn(f.textureWidth,f.textureHeight,{format:un,type:vn,depthTexture:new pu(f.textureWidth,f.textureHeight,K,void 0,void 0,void 0,void 0,void 0,void 0,rt),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,r=await s.requestReferenceSpace(a),Lt.setContext(s),Lt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function D(J){for(let rt=0;rt<J.removed.length;rt++){const K=J.removed[rt],$=v.indexOf(K);$>=0&&(v[$]=null,w[$].disconnect(K))}for(let rt=0;rt<J.added.length;rt++){const K=J.added[rt];let $=v.indexOf(K);if($===-1){for(let mt=0;mt<w.length;mt++)if(mt>=v.length){v.push(K),$=mt;break}else if(v[mt]===null){v[mt]=K,$=mt;break}if($===-1)break}const ot=w[$];ot&&ot.connect(K)}}const N=new C,H=new C;function G(J,rt,K){N.setFromMatrixPosition(rt.matrixWorld),H.setFromMatrixPosition(K.matrixWorld);const $=N.distanceTo(H),ot=rt.projectionMatrix.elements,mt=K.projectionMatrix.elements,Mt=ot[14]/(ot[10]-1),Ft=ot[14]/(ot[10]+1),nt=(ot[9]+1)/ot[5],ht=(ot[9]-1)/ot[5],B=(ot[8]-1)/ot[0],ft=(mt[8]+1)/mt[0],st=Mt*B,yt=Mt*ft,vt=$/(-B+ft),Gt=vt*-B;if(rt.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Gt),J.translateZ(vt),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),ot[10]===-1)J.projectionMatrix.copy(rt.projectionMatrix),J.projectionMatrixInverse.copy(rt.projectionMatrixInverse);else{const Pt=Mt+vt,z=Ft+vt,U=st-Gt,Z=yt+($-Gt),at=nt*Ft/z*Pt,dt=ht*Ft/z*Pt;J.projectionMatrix.makePerspective(U,Z,at,dt,Pt,z),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function V(J,rt){rt===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(rt.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let rt=J.near,K=J.far;y.texture!==null&&(y.depthNear>0&&(rt=y.depthNear),y.depthFar>0&&(K=y.depthFar)),x.near=T.near=E.near=rt,x.far=T.far=E.far=K,(A!==x.near||P!==x.far)&&(s.updateRenderState({depthNear:x.near,depthFar:x.far}),A=x.near,P=x.far),E.layers.mask=J.layers.mask|2,T.layers.mask=J.layers.mask|4,x.layers.mask=E.layers.mask|T.layers.mask;const $=J.parent,ot=x.cameras;V(x,$);for(let mt=0;mt<ot.length;mt++)V(ot[mt],$);ot.length===2?G(x,E,T):x.projectionMatrix.copy(E.projectionMatrix),et(J,x,$)};function et(J,rt,K){K===null?J.matrix.copy(rt.matrixWorld):(J.matrix.copy(K.matrixWorld),J.matrix.invert(),J.matrix.multiply(rt.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(rt.projectionMatrix),J.projectionMatrixInverse.copy(rt.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Vs*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(J){c=J,f!==null&&(f.fixedFoveation=J),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=J)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(x)};let lt=null;function bt(J,rt){if(h=rt.getViewerPose(l||r),g=rt,h!==null){const K=h.views;d!==null&&(t.setRenderTargetFramebuffer(_,d.framebuffer),t.setRenderTarget(_));let $=!1;K.length!==x.cameras.length&&(x.cameras.length=0,$=!0);for(let mt=0;mt<K.length;mt++){const Mt=K[mt];let Ft=null;if(d!==null)Ft=d.getViewport(Mt);else{const ht=u.getViewSubImage(f,Mt);Ft=ht.viewport,mt===0&&(t.setRenderTargetTextures(_,ht.colorTexture,f.ignoreDepthValues?void 0:ht.depthStencilTexture),t.setRenderTarget(_))}let nt=M[mt];nt===void 0&&(nt=new Qe,nt.layers.enable(mt),nt.viewport=new le,M[mt]=nt),nt.matrix.fromArray(Mt.transform.matrix),nt.matrix.decompose(nt.position,nt.quaternion,nt.scale),nt.projectionMatrix.fromArray(Mt.projectionMatrix),nt.projectionMatrixInverse.copy(nt.projectionMatrix).invert(),nt.viewport.set(Ft.x,Ft.y,Ft.width,Ft.height),mt===0&&(x.matrix.copy(nt.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),$===!0&&x.cameras.push(nt)}const ot=s.enabledFeatures;if(ot&&ot.includes("depth-sensing")){const mt=u.getDepthInformation(K[0]);mt&&mt.isValid&&mt.texture&&y.init(t,mt,s.renderState)}}for(let K=0;K<w.length;K++){const $=v[K],ot=w[K];$!==null&&ot!==void 0&&ot.update($,rt,l||r)}lt&&lt(J,rt),rt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:rt}),g=null}const Lt=new Fp;Lt.setAnimationLoop(bt),this.setAnimationLoop=function(J){lt=J},this.dispose=function(){}}}const Ni=new Cn,H_=new fe;function G_(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Dp(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,_,w,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?o(m,p):p.isMeshToonMaterial?(o(m,p),u(m,p)):p.isMeshPhongMaterial?(o(m,p),h(m,p)):p.isMeshStandardMaterial?(o(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,v)):p.isMeshMatcapMaterial?(o(m,p),g(m,p)):p.isMeshDepthMaterial?o(m,p):p.isMeshDistanceMaterial?(o(m,p),y(m,p)):p.isMeshNormalMaterial?o(m,p):p.isLineBasicMaterial?(r(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,_,w):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function o(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ke&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ke&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const _=t.get(p),w=_.envMap,v=_.envMapRotation;w&&(m.envMap.value=w,Ni.copy(v),Ni.x*=-1,Ni.y*=-1,Ni.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Ni.y*=-1,Ni.z*=-1),m.envMapRotation.value.setFromMatrix4(H_.makeRotationFromEuler(Ni)),m.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function r(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,_,w){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*_,m.scale.value=w*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,_){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ke&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=_.texture,m.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function y(m,p){const _=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(_.matrixWorld),m.nearDistance.value=_.shadow.camera.near,m.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function V_(i,t,e,n){let s={},o={},r=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(_,w){const v=w.program;n.uniformBlockBinding(_,v)}function l(_,w){let v=s[_.id];v===void 0&&(g(_),v=h(_),s[_.id]=v,_.addEventListener("dispose",m));const b=w.program;n.updateUBOMapping(_,b);const S=t.render.frame;o[_.id]!==S&&(f(_),o[_.id]=S)}function h(_){const w=u();_.__bindingPointIndex=w;const v=i.createBuffer(),b=_.__size,S=_.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,b,S),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,w,v),v}function u(){for(let _=0;_<a;_++)if(r.indexOf(_)===-1)return r.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(_){const w=s[_.id],v=_.uniforms,b=_.__cache;i.bindBuffer(i.UNIFORM_BUFFER,w);for(let S=0,E=v.length;S<E;S++){const T=Array.isArray(v[S])?v[S]:[v[S]];for(let M=0,x=T.length;M<x;M++){const A=T[M];if(d(A,S,M,b)===!0){const P=A.__offset,R=Array.isArray(A.value)?A.value:[A.value];let F=0;for(let D=0;D<R.length;D++){const N=R[D],H=y(N);typeof N=="number"||typeof N=="boolean"?(A.__data[0]=N,i.bufferSubData(i.UNIFORM_BUFFER,P+F,A.__data)):N.isMatrix3?(A.__data[0]=N.elements[0],A.__data[1]=N.elements[1],A.__data[2]=N.elements[2],A.__data[3]=0,A.__data[4]=N.elements[3],A.__data[5]=N.elements[4],A.__data[6]=N.elements[5],A.__data[7]=0,A.__data[8]=N.elements[6],A.__data[9]=N.elements[7],A.__data[10]=N.elements[8],A.__data[11]=0):(N.toArray(A.__data,F),F+=H.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,P,A.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(_,w,v,b){const S=_.value,E=w+"_"+v;if(b[E]===void 0)return typeof S=="number"||typeof S=="boolean"?b[E]=S:b[E]=S.clone(),!0;{const T=b[E];if(typeof S=="number"||typeof S=="boolean"){if(T!==S)return b[E]=S,!0}else if(T.equals(S)===!1)return T.copy(S),!0}return!1}function g(_){const w=_.uniforms;let v=0;const b=16;for(let E=0,T=w.length;E<T;E++){const M=Array.isArray(w[E])?w[E]:[w[E]];for(let x=0,A=M.length;x<A;x++){const P=M[x],R=Array.isArray(P.value)?P.value:[P.value];for(let F=0,D=R.length;F<D;F++){const N=R[F],H=y(N),G=v%b,V=G%H.boundary,et=G+V;v+=V,et!==0&&b-et<H.storage&&(v+=b-et),P.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=v,v+=H.storage}}}const S=v%b;return S>0&&(v+=b-S),_.__size=v,_.__cache={},this}function y(_){const w={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(w.boundary=4,w.storage=4):_.isVector2?(w.boundary=8,w.storage=8):_.isVector3||_.isColor?(w.boundary=16,w.storage=12):_.isVector4?(w.boundary=16,w.storage=16):_.isMatrix3?(w.boundary=48,w.storage=48):_.isMatrix4?(w.boundary=64,w.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),w}function m(_){const w=_.target;w.removeEventListener("dispose",m);const v=r.indexOf(w.__bindingPointIndex);r.splice(v,1),i.deleteBuffer(s[w.id]),delete s[w.id],delete o[w.id]}function p(){for(const _ in s)i.deleteBuffer(s[_]);r=[],s={},o={}}return{bind:c,update:l,dispose:p}}class W_{constructor(t={}){const{canvas:e=N1(),context:n=null,depth:s=!0,stencil:o=!1,alpha:r=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=r;const g=new Uint32Array(4),y=new Int32Array(4);let m=null,p=null;const _=[],w=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=on,this.toneMapping=vi,this.toneMappingExposure=1;const v=this;let b=!1,S=0,E=0,T=null,M=-1,x=null;const A=new le,P=new le;let R=null;const F=new Wt(0);let D=0,N=e.width,H=e.height,G=1,V=null,et=null;const lt=new le(0,0,N,H),bt=new le(0,0,N,H);let Lt=!1;const J=new uu;let rt=!1,K=!1;const $=new fe,ot=new fe,mt=new C,Mt=new le,Ft={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let nt=!1;function ht(){return T===null?G:1}let B=n;function ft(O,X){return e.getContext(O,X)}try{const O={alpha:!0,depth:s,stencil:o,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${eu}`),e.addEventListener("webglcontextlost",ut,!1),e.addEventListener("webglcontextrestored",Ct,!1),e.addEventListener("webglcontextcreationerror",At,!1),B===null){const X="webgl2";if(B=ft(X,O),B===null)throw ft(X)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(O){throw console.error("THREE.WebGLRenderer: "+O.message),O}let st,yt,vt,Gt,Pt,z,U,Z,at,dt,ct,Ut,Et,It,ie,gt,Dt,Vt,Xt,Nt,oe,Jt,ye,W;function Tt(){st=new Kw(B),st.init(),Jt=new N_(B,st),yt=new Ww(B,st,t,Jt),vt=new I_(B,st),yt.reverseDepthBuffer&&f&&vt.buffers.depth.setReversed(!0),Gt=new Qw(B),Pt=new y_,z=new D_(B,st,vt,Pt,yt,Jt,Gt),U=new qw(v),Z=new Zw(v),at=new ry(B),ye=new Gw(B,at),dt=new jw(B,at,Gt,ye),ct=new e2(B,dt,at,Gt),Xt=new t2(B,yt,z),gt=new Xw(Pt),Ut=new g_(v,U,Z,st,yt,ye,gt),Et=new G_(v,Pt),It=new w_,ie=new E_(st),Vt=new Hw(v,U,Z,vt,ct,d,c),Dt=new C_(v,ct,yt),W=new V_(B,Gt,yt,vt),Nt=new Vw(B,st,Gt),oe=new Jw(B,st,Gt),Gt.programs=Ut.programs,v.capabilities=yt,v.extensions=st,v.properties=Pt,v.renderLists=It,v.shadowMap=Dt,v.state=vt,v.info=Gt}Tt();const it=new B_(v,B);this.xr=it,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const O=st.get("WEBGL_lose_context");O&&O.loseContext()},this.forceContextRestore=function(){const O=st.get("WEBGL_lose_context");O&&O.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(O){O!==void 0&&(G=O,this.setSize(N,H,!1))},this.getSize=function(O){return O.set(N,H)},this.setSize=function(O,X,j=!0){if(it.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}N=O,H=X,e.width=Math.floor(O*G),e.height=Math.floor(X*G),j===!0&&(e.style.width=O+"px",e.style.height=X+"px"),this.setViewport(0,0,O,X)},this.getDrawingBufferSize=function(O){return O.set(N*G,H*G).floor()},this.setDrawingBufferSize=function(O,X,j){N=O,H=X,G=j,e.width=Math.floor(O*j),e.height=Math.floor(X*j),this.setViewport(0,0,O,X)},this.getCurrentViewport=function(O){return O.copy(A)},this.getViewport=function(O){return O.copy(lt)},this.setViewport=function(O,X,j,Q){O.isVector4?lt.set(O.x,O.y,O.z,O.w):lt.set(O,X,j,Q),vt.viewport(A.copy(lt).multiplyScalar(G).round())},this.getScissor=function(O){return O.copy(bt)},this.setScissor=function(O,X,j,Q){O.isVector4?bt.set(O.x,O.y,O.z,O.w):bt.set(O,X,j,Q),vt.scissor(P.copy(bt).multiplyScalar(G).round())},this.getScissorTest=function(){return Lt},this.setScissorTest=function(O){vt.setScissorTest(Lt=O)},this.setOpaqueSort=function(O){V=O},this.setTransparentSort=function(O){et=O},this.getClearColor=function(O){return O.copy(Vt.getClearColor())},this.setClearColor=function(){Vt.setClearColor.apply(Vt,arguments)},this.getClearAlpha=function(){return Vt.getClearAlpha()},this.setClearAlpha=function(){Vt.setClearAlpha.apply(Vt,arguments)},this.clear=function(O=!0,X=!0,j=!0){let Q=0;if(O){let q=!1;if(T!==null){const xt=T.texture.format;q=xt===cu||xt===au||xt===ru}if(q){const xt=T.texture.type,Rt=xt===vn||xt===$i||xt===Go||xt===Hs||xt===su||xt===ou,Ot=Vt.getClearColor(),kt=Vt.getClearAlpha(),qt=Ot.r,$t=Ot.g,zt=Ot.b;Rt?(g[0]=qt,g[1]=$t,g[2]=zt,g[3]=kt,B.clearBufferuiv(B.COLOR,0,g)):(y[0]=qt,y[1]=$t,y[2]=zt,y[3]=kt,B.clearBufferiv(B.COLOR,0,y))}else Q|=B.COLOR_BUFFER_BIT}X&&(Q|=B.DEPTH_BUFFER_BIT),j&&(Q|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ut,!1),e.removeEventListener("webglcontextrestored",Ct,!1),e.removeEventListener("webglcontextcreationerror",At,!1),It.dispose(),ie.dispose(),Pt.dispose(),U.dispose(),Z.dispose(),ct.dispose(),ye.dispose(),W.dispose(),Ut.dispose(),it.dispose(),it.removeEventListener("sessionstart",Qu),it.removeEventListener("sessionend",td),Ri.stop()};function ut(O){O.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function Ct(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;const O=Gt.autoReset,X=Dt.enabled,j=Dt.autoUpdate,Q=Dt.needsUpdate,q=Dt.type;Tt(),Gt.autoReset=O,Dt.enabled=X,Dt.autoUpdate=j,Dt.needsUpdate=Q,Dt.type=q}function At(O){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",O.statusMessage)}function Yt(O){const X=O.target;X.removeEventListener("dispose",Yt),Se(X)}function Se(O){ke(O),Pt.remove(O)}function ke(O){const X=Pt.get(O).programs;X!==void 0&&(X.forEach(function(j){Ut.releaseProgram(j)}),O.isShaderMaterial&&Ut.releaseShaderCache(O))}this.renderBufferDirect=function(O,X,j,Q,q,xt){X===null&&(X=Ft);const Rt=q.isMesh&&q.matrixWorld.determinant()<0,Ot=Fg(O,X,j,Q,q);vt.setMaterial(Q,Rt);let kt=j.index,qt=1;if(Q.wireframe===!0){if(kt=dt.getWireframeAttribute(j),kt===void 0)return;qt=2}const $t=j.drawRange,zt=j.attributes.position;let ce=$t.start*qt,ve=($t.start+$t.count)*qt;xt!==null&&(ce=Math.max(ce,xt.start*qt),ve=Math.min(ve,(xt.start+xt.count)*qt)),kt!==null?(ce=Math.max(ce,0),ve=Math.min(ve,kt.count)):zt!=null&&(ce=Math.max(ce,0),ve=Math.min(ve,zt.count));const we=ve-ce;if(we<0||we===1/0)return;ye.setup(q,Q,Ot,j,kt);let Je,ue=Nt;if(kt!==null&&(Je=at.get(kt),ue=oe,ue.setIndex(Je)),q.isMesh)Q.wireframe===!0?(vt.setLineWidth(Q.wireframeLinewidth*ht()),ue.setMode(B.LINES)):ue.setMode(B.TRIANGLES);else if(q.isLine){let Ht=Q.linewidth;Ht===void 0&&(Ht=1),vt.setLineWidth(Ht*ht()),q.isLineSegments?ue.setMode(B.LINES):q.isLineLoop?ue.setMode(B.LINE_LOOP):ue.setMode(B.LINE_STRIP)}else q.isPoints?ue.setMode(B.POINTS):q.isSprite&&ue.setMode(B.TRIANGLES);if(q.isBatchedMesh)if(q._multiDrawInstances!==null)ue.renderMultiDrawInstances(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount,q._multiDrawInstances);else if(st.get("WEBGL_multi_draw"))ue.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{const Ht=q._multiDrawStarts,Nn=q._multiDrawCounts,de=q._multiDrawCount,fn=kt?at.get(kt).bytesPerElement:1,es=Pt.get(Q).currentProgram.getUniforms();for(let tn=0;tn<de;tn++)es.setValue(B,"_gl_DrawID",tn),ue.render(Ht[tn]/fn,Nn[tn])}else if(q.isInstancedMesh)ue.renderInstances(ce,we,q.count);else if(j.isInstancedBufferGeometry){const Ht=j._maxInstanceCount!==void 0?j._maxInstanceCount:1/0,Nn=Math.min(j.instanceCount,Ht);ue.renderInstances(ce,we,Nn)}else ue.render(ce,we)};function pe(O,X,j){O.transparent===!0&&O.side===yn&&O.forceSinglePass===!1?(O.side=Ke,O.needsUpdate=!0,ar(O,X,j),O.side=wi,O.needsUpdate=!0,ar(O,X,j),O.side=yn):ar(O,X,j)}this.compile=function(O,X,j=null){j===null&&(j=O),p=ie.get(j),p.init(X),w.push(p),j.traverseVisible(function(q){q.isLight&&q.layers.test(X.layers)&&(p.pushLight(q),q.castShadow&&p.pushShadow(q))}),O!==j&&O.traverseVisible(function(q){q.isLight&&q.layers.test(X.layers)&&(p.pushLight(q),q.castShadow&&p.pushShadow(q))}),p.setupLights();const Q=new Set;return O.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;const xt=q.material;if(xt)if(Array.isArray(xt))for(let Rt=0;Rt<xt.length;Rt++){const Ot=xt[Rt];pe(Ot,j,q),Q.add(Ot)}else pe(xt,j,q),Q.add(xt)}),w.pop(),p=null,Q},this.compileAsync=function(O,X,j=null){const Q=this.compile(O,X,j);return new Promise(q=>{function xt(){if(Q.forEach(function(Rt){Pt.get(Rt).currentProgram.isReady()&&Q.delete(Rt)}),Q.size===0){q(O);return}setTimeout(xt,10)}st.get("KHR_parallel_shader_compile")!==null?xt():setTimeout(xt,10)})};let dn=null;function Dn(O){dn&&dn(O)}function Qu(){Ri.stop()}function td(){Ri.start()}const Ri=new Fp;Ri.setAnimationLoop(Dn),typeof self<"u"&&Ri.setContext(self),this.setAnimationLoop=function(O){dn=O,it.setAnimationLoop(O),O===null?Ri.stop():Ri.start()},it.addEventListener("sessionstart",Qu),it.addEventListener("sessionend",td),this.render=function(O,X){if(X!==void 0&&X.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;if(O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),X.parent===null&&X.matrixWorldAutoUpdate===!0&&X.updateMatrixWorld(),it.enabled===!0&&it.isPresenting===!0&&(it.cameraAutoUpdate===!0&&it.updateCamera(X),X=it.getCamera()),O.isScene===!0&&O.onBeforeRender(v,O,X,T),p=ie.get(O,w.length),p.init(X),w.push(p),ot.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),J.setFromProjectionMatrix(ot),K=this.localClippingEnabled,rt=gt.init(this.clippingPlanes,K),m=It.get(O,_.length),m.init(),_.push(m),it.enabled===!0&&it.isPresenting===!0){const xt=v.xr.getDepthSensingMesh();xt!==null&&oc(xt,X,-1/0,v.sortObjects)}oc(O,X,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(V,et),nt=it.enabled===!1||it.isPresenting===!1||it.hasDepthSensing()===!1,nt&&Vt.addToRenderList(m,O),this.info.render.frame++,rt===!0&&gt.beginShadows();const j=p.state.shadowsArray;Dt.render(j,O,X),rt===!0&&gt.endShadows(),this.info.autoReset===!0&&this.info.reset();const Q=m.opaque,q=m.transmissive;if(p.setupLights(),X.isArrayCamera){const xt=X.cameras;if(q.length>0)for(let Rt=0,Ot=xt.length;Rt<Ot;Rt++){const kt=xt[Rt];nd(Q,q,O,kt)}nt&&Vt.render(O);for(let Rt=0,Ot=xt.length;Rt<Ot;Rt++){const kt=xt[Rt];ed(m,O,kt,kt.viewport)}}else q.length>0&&nd(Q,q,O,X),nt&&Vt.render(O),ed(m,O,X);T!==null&&(z.updateMultisampleRenderTarget(T),z.updateRenderTargetMipmap(T)),O.isScene===!0&&O.onAfterRender(v,O,X),ye.resetDefaultState(),M=-1,x=null,w.pop(),w.length>0?(p=w[w.length-1],rt===!0&&gt.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,_.pop(),_.length>0?m=_[_.length-1]:m=null};function oc(O,X,j,Q){if(O.visible===!1)return;if(O.layers.test(X.layers)){if(O.isGroup)j=O.renderOrder;else if(O.isLOD)O.autoUpdate===!0&&O.update(X);else if(O.isLight)p.pushLight(O),O.castShadow&&p.pushShadow(O);else if(O.isSprite){if(!O.frustumCulled||J.intersectsSprite(O)){Q&&Mt.setFromMatrixPosition(O.matrixWorld).applyMatrix4(ot);const Rt=ct.update(O),Ot=O.material;Ot.visible&&m.push(O,Rt,Ot,j,Mt.z,null)}}else if((O.isMesh||O.isLine||O.isPoints)&&(!O.frustumCulled||J.intersectsObject(O))){const Rt=ct.update(O),Ot=O.material;if(Q&&(O.boundingSphere!==void 0?(O.boundingSphere===null&&O.computeBoundingSphere(),Mt.copy(O.boundingSphere.center)):(Rt.boundingSphere===null&&Rt.computeBoundingSphere(),Mt.copy(Rt.boundingSphere.center)),Mt.applyMatrix4(O.matrixWorld).applyMatrix4(ot)),Array.isArray(Ot)){const kt=Rt.groups;for(let qt=0,$t=kt.length;qt<$t;qt++){const zt=kt[qt],ce=Ot[zt.materialIndex];ce&&ce.visible&&m.push(O,Rt,ce,j,Mt.z,zt)}}else Ot.visible&&m.push(O,Rt,Ot,j,Mt.z,null)}}const xt=O.children;for(let Rt=0,Ot=xt.length;Rt<Ot;Rt++)oc(xt[Rt],X,j,Q)}function ed(O,X,j,Q){const q=O.opaque,xt=O.transmissive,Rt=O.transparent;p.setupLightsView(j),rt===!0&&gt.setGlobalState(v.clippingPlanes,j),Q&&vt.viewport(A.copy(Q)),q.length>0&&rr(q,X,j),xt.length>0&&rr(xt,X,j),Rt.length>0&&rr(Rt,X,j),vt.buffers.depth.setTest(!0),vt.buffers.depth.setMask(!0),vt.buffers.color.setMask(!0),vt.setPolygonOffset(!1)}function nd(O,X,j,Q){if((j.isScene===!0?j.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Q.id]===void 0&&(p.state.transmissionRenderTarget[Q.id]=new wn(1,1,{generateMipmaps:!0,type:st.has("EXT_color_buffer_half_float")||st.has("EXT_color_buffer_float")?Ei:vn,minFilter:gi,samples:4,stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:re.workingColorSpace}));const xt=p.state.transmissionRenderTarget[Q.id],Rt=Q.viewport||A;xt.setSize(Rt.z,Rt.w);const Ot=v.getRenderTarget();v.setRenderTarget(xt),v.getClearColor(F),D=v.getClearAlpha(),D<1&&v.setClearColor(16777215,.5),v.clear(),nt&&Vt.render(j);const kt=v.toneMapping;v.toneMapping=vi;const qt=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),p.setupLightsView(Q),rt===!0&&gt.setGlobalState(v.clippingPlanes,Q),rr(O,j,Q),z.updateMultisampleRenderTarget(xt),z.updateRenderTargetMipmap(xt),st.has("WEBGL_multisampled_render_to_texture")===!1){let $t=!1;for(let zt=0,ce=X.length;zt<ce;zt++){const ve=X[zt],we=ve.object,Je=ve.geometry,ue=ve.material,Ht=ve.group;if(ue.side===yn&&we.layers.test(Q.layers)){const Nn=ue.side;ue.side=Ke,ue.needsUpdate=!0,id(we,j,Q,Je,ue,Ht),ue.side=Nn,ue.needsUpdate=!0,$t=!0}}$t===!0&&(z.updateMultisampleRenderTarget(xt),z.updateRenderTargetMipmap(xt))}v.setRenderTarget(Ot),v.setClearColor(F,D),qt!==void 0&&(Q.viewport=qt),v.toneMapping=kt}function rr(O,X,j){const Q=X.isScene===!0?X.overrideMaterial:null;for(let q=0,xt=O.length;q<xt;q++){const Rt=O[q],Ot=Rt.object,kt=Rt.geometry,qt=Q===null?Rt.material:Q,$t=Rt.group;Ot.layers.test(j.layers)&&id(Ot,X,j,kt,qt,$t)}}function id(O,X,j,Q,q,xt){O.onBeforeRender(v,X,j,Q,q,xt),O.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,O.matrixWorld),O.normalMatrix.getNormalMatrix(O.modelViewMatrix),q.onBeforeRender(v,X,j,Q,O,xt),q.transparent===!0&&q.side===yn&&q.forceSinglePass===!1?(q.side=Ke,q.needsUpdate=!0,v.renderBufferDirect(j,X,Q,q,O,xt),q.side=wi,q.needsUpdate=!0,v.renderBufferDirect(j,X,Q,q,O,xt),q.side=yn):v.renderBufferDirect(j,X,Q,q,O,xt),O.onAfterRender(v,X,j,Q,q,xt)}function ar(O,X,j){X.isScene!==!0&&(X=Ft);const Q=Pt.get(O),q=p.state.lights,xt=p.state.shadowsArray,Rt=q.state.version,Ot=Ut.getParameters(O,q.state,xt,X,j),kt=Ut.getProgramCacheKey(Ot);let qt=Q.programs;Q.environment=O.isMeshStandardMaterial?X.environment:null,Q.fog=X.fog,Q.envMap=(O.isMeshStandardMaterial?Z:U).get(O.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&O.envMap===null?X.environmentRotation:O.envMapRotation,qt===void 0&&(O.addEventListener("dispose",Yt),qt=new Map,Q.programs=qt);let $t=qt.get(kt);if($t!==void 0){if(Q.currentProgram===$t&&Q.lightsStateVersion===Rt)return od(O,Ot),$t}else Ot.uniforms=Ut.getUniforms(O),O.onBeforeCompile(Ot,v),$t=Ut.acquireProgram(Ot,kt),qt.set(kt,$t),Q.uniforms=Ot.uniforms;const zt=Q.uniforms;return(!O.isShaderMaterial&&!O.isRawShaderMaterial||O.clipping===!0)&&(zt.clippingPlanes=gt.uniform),od(O,Ot),Q.needsLights=kg(O),Q.lightsStateVersion=Rt,Q.needsLights&&(zt.ambientLightColor.value=q.state.ambient,zt.lightProbe.value=q.state.probe,zt.directionalLights.value=q.state.directional,zt.directionalLightShadows.value=q.state.directionalShadow,zt.spotLights.value=q.state.spot,zt.spotLightShadows.value=q.state.spotShadow,zt.rectAreaLights.value=q.state.rectArea,zt.ltc_1.value=q.state.rectAreaLTC1,zt.ltc_2.value=q.state.rectAreaLTC2,zt.pointLights.value=q.state.point,zt.pointLightShadows.value=q.state.pointShadow,zt.hemisphereLights.value=q.state.hemi,zt.directionalShadowMap.value=q.state.directionalShadowMap,zt.directionalShadowMatrix.value=q.state.directionalShadowMatrix,zt.spotShadowMap.value=q.state.spotShadowMap,zt.spotLightMatrix.value=q.state.spotLightMatrix,zt.spotLightMap.value=q.state.spotLightMap,zt.pointShadowMap.value=q.state.pointShadowMap,zt.pointShadowMatrix.value=q.state.pointShadowMatrix),Q.currentProgram=$t,Q.uniformsList=null,$t}function sd(O){if(O.uniformsList===null){const X=O.currentProgram.getUniforms();O.uniformsList=ya.seqWithValue(X.seq,O.uniforms)}return O.uniformsList}function od(O,X){const j=Pt.get(O);j.outputColorSpace=X.outputColorSpace,j.batching=X.batching,j.batchingColor=X.batchingColor,j.instancing=X.instancing,j.instancingColor=X.instancingColor,j.instancingMorph=X.instancingMorph,j.skinning=X.skinning,j.morphTargets=X.morphTargets,j.morphNormals=X.morphNormals,j.morphColors=X.morphColors,j.morphTargetsCount=X.morphTargetsCount,j.numClippingPlanes=X.numClippingPlanes,j.numIntersection=X.numClipIntersection,j.vertexAlphas=X.vertexAlphas,j.vertexTangents=X.vertexTangents,j.toneMapping=X.toneMapping}function Fg(O,X,j,Q,q){X.isScene!==!0&&(X=Ft),z.resetTextureUnits();const xt=X.fog,Rt=Q.isMeshStandardMaterial?X.environment:null,Ot=T===null?v.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Ks,kt=(Q.isMeshStandardMaterial?Z:U).get(Q.envMap||Rt),qt=Q.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,$t=!!j.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),zt=!!j.morphAttributes.position,ce=!!j.morphAttributes.normal,ve=!!j.morphAttributes.color;let we=vi;Q.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(we=v.toneMapping);const Je=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,ue=Je!==void 0?Je.length:0,Ht=Pt.get(Q),Nn=p.state.lights;if(rt===!0&&(K===!0||O!==x)){const rn=O===x&&Q.id===M;gt.setState(Q,O,rn)}let de=!1;Q.version===Ht.__version?(Ht.needsLights&&Ht.lightsStateVersion!==Nn.state.version||Ht.outputColorSpace!==Ot||q.isBatchedMesh&&Ht.batching===!1||!q.isBatchedMesh&&Ht.batching===!0||q.isBatchedMesh&&Ht.batchingColor===!0&&q.colorTexture===null||q.isBatchedMesh&&Ht.batchingColor===!1&&q.colorTexture!==null||q.isInstancedMesh&&Ht.instancing===!1||!q.isInstancedMesh&&Ht.instancing===!0||q.isSkinnedMesh&&Ht.skinning===!1||!q.isSkinnedMesh&&Ht.skinning===!0||q.isInstancedMesh&&Ht.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&Ht.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&Ht.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&Ht.instancingMorph===!1&&q.morphTexture!==null||Ht.envMap!==kt||Q.fog===!0&&Ht.fog!==xt||Ht.numClippingPlanes!==void 0&&(Ht.numClippingPlanes!==gt.numPlanes||Ht.numIntersection!==gt.numIntersection)||Ht.vertexAlphas!==qt||Ht.vertexTangents!==$t||Ht.morphTargets!==zt||Ht.morphNormals!==ce||Ht.morphColors!==ve||Ht.toneMapping!==we||Ht.morphTargetsCount!==ue)&&(de=!0):(de=!0,Ht.__version=Q.version);let fn=Ht.currentProgram;de===!0&&(fn=ar(Q,X,q));let es=!1,tn=!1,no=!1;const _e=fn.getUniforms(),_n=Ht.uniforms;if(vt.useProgram(fn.program)&&(es=!0,tn=!0,no=!0),Q.id!==M&&(M=Q.id,tn=!0),es||x!==O){vt.buffers.depth.getReversed()?($.copy(O.projectionMatrix),F1($),O1($),_e.setValue(B,"projectionMatrix",$)):_e.setValue(B,"projectionMatrix",O.projectionMatrix),_e.setValue(B,"viewMatrix",O.matrixWorldInverse);const si=_e.map.cameraPosition;si!==void 0&&si.setValue(B,mt.setFromMatrixPosition(O.matrixWorld)),yt.logarithmicDepthBuffer&&_e.setValue(B,"logDepthBufFC",2/(Math.log(O.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&_e.setValue(B,"isOrthographic",O.isOrthographicCamera===!0),x!==O&&(x=O,tn=!0,no=!0)}if(q.isSkinnedMesh){_e.setOptional(B,q,"bindMatrix"),_e.setOptional(B,q,"bindMatrixInverse");const rn=q.skeleton;rn&&(rn.boneTexture===null&&rn.computeBoneTexture(),_e.setValue(B,"boneTexture",rn.boneTexture,z))}q.isBatchedMesh&&(_e.setOptional(B,q,"batchingTexture"),_e.setValue(B,"batchingTexture",q._matricesTexture,z),_e.setOptional(B,q,"batchingIdTexture"),_e.setValue(B,"batchingIdTexture",q._indirectTexture,z),_e.setOptional(B,q,"batchingColorTexture"),q._colorsTexture!==null&&_e.setValue(B,"batchingColorTexture",q._colorsTexture,z));const io=j.morphAttributes;if((io.position!==void 0||io.normal!==void 0||io.color!==void 0)&&Xt.update(q,j,fn),(tn||Ht.receiveShadow!==q.receiveShadow)&&(Ht.receiveShadow=q.receiveShadow,_e.setValue(B,"receiveShadow",q.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(_n.envMap.value=kt,_n.flipEnvMap.value=kt.isCubeTexture&&kt.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&X.environment!==null&&(_n.envMapIntensity.value=X.environmentIntensity),tn&&(_e.setValue(B,"toneMappingExposure",v.toneMappingExposure),Ht.needsLights&&Og(_n,no),xt&&Q.fog===!0&&Et.refreshFogUniforms(_n,xt),Et.refreshMaterialUniforms(_n,Q,G,H,p.state.transmissionRenderTarget[O.id]),ya.upload(B,sd(Ht),_n,z)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(ya.upload(B,sd(Ht),_n,z),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&_e.setValue(B,"center",q.center),_e.setValue(B,"modelViewMatrix",q.modelViewMatrix),_e.setValue(B,"normalMatrix",q.normalMatrix),_e.setValue(B,"modelMatrix",q.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){const rn=Q.uniformsGroups;for(let si=0,oi=rn.length;si<oi;si++){const rd=rn[si];W.update(rd,fn),W.bind(rd,fn)}}return fn}function Og(O,X){O.ambientLightColor.needsUpdate=X,O.lightProbe.needsUpdate=X,O.directionalLights.needsUpdate=X,O.directionalLightShadows.needsUpdate=X,O.pointLights.needsUpdate=X,O.pointLightShadows.needsUpdate=X,O.spotLights.needsUpdate=X,O.spotLightShadows.needsUpdate=X,O.rectAreaLights.needsUpdate=X,O.hemisphereLights.needsUpdate=X}function kg(O){return O.isMeshLambertMaterial||O.isMeshToonMaterial||O.isMeshPhongMaterial||O.isMeshStandardMaterial||O.isShadowMaterial||O.isShaderMaterial&&O.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(O,X,j){Pt.get(O.texture).__webglTexture=X,Pt.get(O.depthTexture).__webglTexture=j;const Q=Pt.get(O);Q.__hasExternalTextures=!0,Q.__autoAllocateDepthBuffer=j===void 0,Q.__autoAllocateDepthBuffer||st.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Q.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(O,X){const j=Pt.get(O);j.__webglFramebuffer=X,j.__useDefaultFramebuffer=X===void 0},this.setRenderTarget=function(O,X=0,j=0){T=O,S=X,E=j;let Q=!0,q=null,xt=!1,Rt=!1;if(O){const kt=Pt.get(O);if(kt.__useDefaultFramebuffer!==void 0)vt.bindFramebuffer(B.FRAMEBUFFER,null),Q=!1;else if(kt.__webglFramebuffer===void 0)z.setupRenderTarget(O);else if(kt.__hasExternalTextures)z.rebindTextures(O,Pt.get(O.texture).__webglTexture,Pt.get(O.depthTexture).__webglTexture);else if(O.depthBuffer){const zt=O.depthTexture;if(kt.__boundDepthTexture!==zt){if(zt!==null&&Pt.has(zt)&&(O.width!==zt.image.width||O.height!==zt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");z.setupDepthRenderbuffer(O)}}const qt=O.texture;(qt.isData3DTexture||qt.isDataArrayTexture||qt.isCompressedArrayTexture)&&(Rt=!0);const $t=Pt.get(O).__webglFramebuffer;O.isWebGLCubeRenderTarget?(Array.isArray($t[X])?q=$t[X][j]:q=$t[X],xt=!0):O.samples>0&&z.useMultisampledRTT(O)===!1?q=Pt.get(O).__webglMultisampledFramebuffer:Array.isArray($t)?q=$t[j]:q=$t,A.copy(O.viewport),P.copy(O.scissor),R=O.scissorTest}else A.copy(lt).multiplyScalar(G).floor(),P.copy(bt).multiplyScalar(G).floor(),R=Lt;if(vt.bindFramebuffer(B.FRAMEBUFFER,q)&&Q&&vt.drawBuffers(O,q),vt.viewport(A),vt.scissor(P),vt.setScissorTest(R),xt){const kt=Pt.get(O.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+X,kt.__webglTexture,j)}else if(Rt){const kt=Pt.get(O.texture),qt=X||0;B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,kt.__webglTexture,j||0,qt)}M=-1},this.readRenderTargetPixels=function(O,X,j,Q,q,xt,Rt){if(!(O&&O.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ot=Pt.get(O).__webglFramebuffer;if(O.isWebGLCubeRenderTarget&&Rt!==void 0&&(Ot=Ot[Rt]),Ot){vt.bindFramebuffer(B.FRAMEBUFFER,Ot);try{const kt=O.texture,qt=kt.format,$t=kt.type;if(!yt.textureFormatReadable(qt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!yt.textureTypeReadable($t)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}X>=0&&X<=O.width-Q&&j>=0&&j<=O.height-q&&B.readPixels(X,j,Q,q,Jt.convert(qt),Jt.convert($t),xt)}finally{const kt=T!==null?Pt.get(T).__webglFramebuffer:null;vt.bindFramebuffer(B.FRAMEBUFFER,kt)}}},this.readRenderTargetPixelsAsync=async function(O,X,j,Q,q,xt,Rt){if(!(O&&O.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ot=Pt.get(O).__webglFramebuffer;if(O.isWebGLCubeRenderTarget&&Rt!==void 0&&(Ot=Ot[Rt]),Ot){const kt=O.texture,qt=kt.format,$t=kt.type;if(!yt.textureFormatReadable(qt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!yt.textureTypeReadable($t))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(X>=0&&X<=O.width-Q&&j>=0&&j<=O.height-q){vt.bindFramebuffer(B.FRAMEBUFFER,Ot);const zt=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,zt),B.bufferData(B.PIXEL_PACK_BUFFER,xt.byteLength,B.STREAM_READ),B.readPixels(X,j,Q,q,Jt.convert(qt),Jt.convert($t),0);const ce=T!==null?Pt.get(T).__webglFramebuffer:null;vt.bindFramebuffer(B.FRAMEBUFFER,ce);const ve=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await U1(B,ve,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,zt),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,xt),B.deleteBuffer(zt),B.deleteSync(ve),xt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(O,X=null,j=0){O.isTexture!==!0&&(Ro("WebGLRenderer: copyFramebufferToTexture function signature has changed."),X=arguments[0]||null,O=arguments[1]);const Q=Math.pow(2,-j),q=Math.floor(O.image.width*Q),xt=Math.floor(O.image.height*Q),Rt=X!==null?X.x:0,Ot=X!==null?X.y:0;z.setTexture2D(O,0),B.copyTexSubImage2D(B.TEXTURE_2D,j,0,0,Rt,Ot,q,xt),vt.unbindTexture()},this.copyTextureToTexture=function(O,X,j=null,Q=null,q=0){O.isTexture!==!0&&(Ro("WebGLRenderer: copyTextureToTexture function signature has changed."),Q=arguments[0]||null,O=arguments[1],X=arguments[2],q=arguments[3]||0,j=null);let xt,Rt,Ot,kt,qt,$t,zt,ce,ve;const we=O.isCompressedTexture?O.mipmaps[q]:O.image;j!==null?(xt=j.max.x-j.min.x,Rt=j.max.y-j.min.y,Ot=j.isBox3?j.max.z-j.min.z:1,kt=j.min.x,qt=j.min.y,$t=j.isBox3?j.min.z:0):(xt=we.width,Rt=we.height,Ot=we.depth||1,kt=0,qt=0,$t=0),Q!==null?(zt=Q.x,ce=Q.y,ve=Q.z):(zt=0,ce=0,ve=0);const Je=Jt.convert(X.format),ue=Jt.convert(X.type);let Ht;X.isData3DTexture?(z.setTexture3D(X,0),Ht=B.TEXTURE_3D):X.isDataArrayTexture||X.isCompressedArrayTexture?(z.setTexture2DArray(X,0),Ht=B.TEXTURE_2D_ARRAY):(z.setTexture2D(X,0),Ht=B.TEXTURE_2D),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,X.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,X.unpackAlignment);const Nn=B.getParameter(B.UNPACK_ROW_LENGTH),de=B.getParameter(B.UNPACK_IMAGE_HEIGHT),fn=B.getParameter(B.UNPACK_SKIP_PIXELS),es=B.getParameter(B.UNPACK_SKIP_ROWS),tn=B.getParameter(B.UNPACK_SKIP_IMAGES);B.pixelStorei(B.UNPACK_ROW_LENGTH,we.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,we.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,kt),B.pixelStorei(B.UNPACK_SKIP_ROWS,qt),B.pixelStorei(B.UNPACK_SKIP_IMAGES,$t);const no=O.isDataArrayTexture||O.isData3DTexture,_e=X.isDataArrayTexture||X.isData3DTexture;if(O.isRenderTargetTexture||O.isDepthTexture){const _n=Pt.get(O),io=Pt.get(X),rn=Pt.get(_n.__renderTarget),si=Pt.get(io.__renderTarget);vt.bindFramebuffer(B.READ_FRAMEBUFFER,rn.__webglFramebuffer),vt.bindFramebuffer(B.DRAW_FRAMEBUFFER,si.__webglFramebuffer);for(let oi=0;oi<Ot;oi++)no&&B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Pt.get(O).__webglTexture,q,$t+oi),O.isDepthTexture?(_e&&B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Pt.get(X).__webglTexture,q,ve+oi),B.blitFramebuffer(kt,qt,xt,Rt,zt,ce,xt,Rt,B.DEPTH_BUFFER_BIT,B.NEAREST)):_e?B.copyTexSubImage3D(Ht,q,zt,ce,ve+oi,kt,qt,xt,Rt):B.copyTexSubImage2D(Ht,q,zt,ce,ve+oi,kt,qt,xt,Rt);vt.bindFramebuffer(B.READ_FRAMEBUFFER,null),vt.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else _e?O.isDataTexture||O.isData3DTexture?B.texSubImage3D(Ht,q,zt,ce,ve,xt,Rt,Ot,Je,ue,we.data):X.isCompressedArrayTexture?B.compressedTexSubImage3D(Ht,q,zt,ce,ve,xt,Rt,Ot,Je,we.data):B.texSubImage3D(Ht,q,zt,ce,ve,xt,Rt,Ot,Je,ue,we):O.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,q,zt,ce,xt,Rt,Je,ue,we.data):O.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,q,zt,ce,we.width,we.height,Je,we.data):B.texSubImage2D(B.TEXTURE_2D,q,zt,ce,xt,Rt,Je,ue,we);B.pixelStorei(B.UNPACK_ROW_LENGTH,Nn),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,de),B.pixelStorei(B.UNPACK_SKIP_PIXELS,fn),B.pixelStorei(B.UNPACK_SKIP_ROWS,es),B.pixelStorei(B.UNPACK_SKIP_IMAGES,tn),q===0&&X.generateMipmaps&&B.generateMipmap(Ht),vt.unbindTexture()},this.copyTextureToTexture3D=function(O,X,j=null,Q=null,q=0){return O.isTexture!==!0&&(Ro("WebGLRenderer: copyTextureToTexture3D function signature has changed."),j=arguments[0]||null,Q=arguments[1]||null,O=arguments[2],X=arguments[3],q=arguments[4]||0),Ro('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(O,X,j,Q,q)},this.initRenderTarget=function(O){Pt.get(O).__webglFramebuffer===void 0&&z.setupRenderTarget(O)},this.initTexture=function(O){O.isCubeTexture?z.setTextureCube(O,0):O.isData3DTexture?z.setTexture3D(O,0):O.isDataArrayTexture||O.isCompressedArrayTexture?z.setTexture2DArray(O,0):z.setTexture2D(O,0),vt.unbindTexture()},this.resetState=function(){S=0,E=0,T=null,vt.reset(),ye.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return $n}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=re._getDrawingBufferColorSpace(t),e.unpackColorSpace=re._getUnpackColorSpace()}}class Za{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Wt(t),this.near=e,this.far=n}clone(){return new Za(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class X_ extends Ee{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Cn,this.environmentIntensity=1,this.environmentRotation=new Cn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class mu extends je{constructor(t=null,e=1,n=1,s,o,r,a,c,l=Oe,h=Oe,u,f){super(null,r,a,c,l,h,s,o,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Gp extends Ti{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Wt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Ea=new C,Ta=new C,o0=new fe,co=new Ko,Cr=new Js,Nc=new C,r0=new C;class q_ extends Ee{constructor(t=new Le,e=new Gp){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,o=e.count;s<o;s++)Ea.fromBufferAttribute(e,s-1),Ta.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Ea.distanceTo(Ta);t.setAttribute("lineDistance",new ae(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,o=t.params.Line.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Cr.copy(n.boundingSphere),Cr.applyMatrix4(s),Cr.radius+=o,t.ray.intersectsSphere(Cr)===!1)return;o0.copy(s).invert(),co.copy(t.ray).applyMatrix4(o0);const a=o/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){const d=Math.max(0,r.start),g=Math.min(h.count,r.start+r.count);for(let y=d,m=g-1;y<m;y+=l){const p=h.getX(y),_=h.getX(y+1),w=Pr(this,t,co,c,p,_);w&&e.push(w)}if(this.isLineLoop){const y=h.getX(g-1),m=h.getX(d),p=Pr(this,t,co,c,y,m);p&&e.push(p)}}else{const d=Math.max(0,r.start),g=Math.min(f.count,r.start+r.count);for(let y=d,m=g-1;y<m;y+=l){const p=Pr(this,t,co,c,y,y+1);p&&e.push(p)}if(this.isLineLoop){const y=Pr(this,t,co,c,g-1,d);y&&e.push(y)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=s.length;o<r;o++){const a=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}}function Pr(i,t,e,n,s,o){const r=i.geometry.attributes.position;if(Ea.fromBufferAttribute(r,s),Ta.fromBufferAttribute(r,o),e.distanceSqToSegment(Ea,Ta,Nc,r0)>n)return;Nc.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Nc);if(!(c<t.near||c>t.far))return{distance:c,point:r0.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const a0=new C,c0=new C;class gu extends q_{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,o=e.count;s<o;s+=2)a0.fromBufferAttribute(e,s),c0.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+a0.distanceTo(c0);t.setAttribute("lineDistance",new ae(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Y_ extends Ti{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new Wt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const l0=new fe,Th=new Ko,Ir=new Js,Lr=new C;class Vp extends Ee{constructor(t=new Le,e=new Y_){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,o=t.params.Points.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ir.copy(n.boundingSphere),Ir.applyMatrix4(s),Ir.radius+=o,t.ray.intersectsSphere(Ir)===!1)return;l0.copy(s).invert(),Th.copy(t.ray).applyMatrix4(l0);const a=o/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,u=n.attributes.position;if(l!==null){const f=Math.max(0,r.start),d=Math.min(l.count,r.start+r.count);for(let g=f,y=d;g<y;g++){const m=l.getX(g);Lr.fromBufferAttribute(u,m),h0(Lr,m,c,s,t,e,this)}}else{const f=Math.max(0,r.start),d=Math.min(u.count,r.start+r.count);for(let g=f,y=d;g<y;g++)Lr.fromBufferAttribute(u,g),h0(Lr,g,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=s.length;o<r;o++){const a=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}}function h0(i,t,e,n,s,o,r){const a=Th.distanceSqToPoint(i);if(a<e){const c=new C;Th.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;o.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:r})}}class Ln{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),o=0;e.push(0);for(let r=1;r<=t;r++)n=this.getPoint(r/t),o+=n.distanceTo(s),e.push(o),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const o=n.length;let r;e?r=e:r=t*n[o-1];let a=0,c=o-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-r,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===r)return s/(o-1);const h=n[s],f=n[s+1]-h,d=(r-h)/f;return(s+d)/(o-1)}getTangent(t,e){let s=t-1e-4,o=t+1e-4;s<0&&(s=0),o>1&&(o=1);const r=this.getPoint(s),a=this.getPoint(o),c=e||(r.isVector2?new tt:new C);return c.copy(a).sub(r).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new C,s=[],o=[],r=[],a=new C,c=new fe;for(let d=0;d<=t;d++){const g=d/t;s[d]=this.getTangentAt(g,new C)}o[0]=new C,r[0]=new C;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),f<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),o[0].crossVectors(s[0],a),r[0].crossVectors(s[0],o[0]);for(let d=1;d<=t;d++){if(o[d]=o[d-1].clone(),r[d]=r[d-1].clone(),a.crossVectors(s[d-1],s[d]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Re(s[d-1].dot(s[d]),-1,1));o[d].applyMatrix4(c.makeRotationAxis(a,g))}r[d].crossVectors(s[d],o[d])}if(e===!0){let d=Math.acos(Re(o[0].dot(o[t]),-1,1));d/=t,s[0].dot(a.crossVectors(o[0],o[t]))>0&&(d=-d);for(let g=1;g<=t;g++)o[g].applyMatrix4(c.makeRotationAxis(s[g],d*g)),r[g].crossVectors(s[g],o[g])}return{tangents:s,normals:o,binormals:r}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class yu extends Ln{constructor(t=0,e=0,n=1,s=1,o=0,r=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=o,this.aEndAngle=r,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new tt){const n=e,s=Math.PI*2;let o=this.aEndAngle-this.aStartAngle;const r=Math.abs(o)<Number.EPSILON;for(;o<0;)o+=s;for(;o>s;)o-=s;o<Number.EPSILON&&(r?o=0:o=s),this.aClockwise===!0&&!r&&(o===s?o=-s:o=o-s);const a=this.aStartAngle+t*o;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,d=l-this.aY;c=f*h-d*u+this.aX,l=f*u+d*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class $_ extends yu{constructor(t,e,n,s,o,r){super(t,e,n,n,s,o,r),this.isArcCurve=!0,this.type="ArcCurve"}}function vu(){let i=0,t=0,e=0,n=0;function s(o,r,a,c){i=o,t=a,e=-3*o+3*r-2*a-c,n=2*o-2*r+a+c}return{initCatmullRom:function(o,r,a,c,l){s(r,a,l*(a-o),l*(c-r))},initNonuniformCatmullRom:function(o,r,a,c,l,h,u){let f=(r-o)/l-(a-o)/(l+h)+(a-r)/h,d=(a-r)/h-(c-r)/(h+u)+(c-a)/u;f*=h,d*=h,s(r,a,f,d)},calc:function(o){const r=o*o,a=r*o;return i+t*o+e*r+n*a}}}const Dr=new C,Uc=new vu,Fc=new vu,Oc=new vu;class Z_ extends Ln{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new C){const n=e,s=this.points,o=s.length,r=(o-(this.closed?0:1))*t;let a=Math.floor(r),c=r-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/o)+1)*o:c===0&&a===o-1&&(a=o-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%o]:(Dr.subVectors(s[0],s[1]).add(s[0]),l=Dr);const u=s[a%o],f=s[(a+1)%o];if(this.closed||a+2<o?h=s[(a+2)%o]:(Dr.subVectors(s[o-1],s[o-2]).add(s[o-1]),h=Dr),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),d),y=Math.pow(u.distanceToSquared(f),d),m=Math.pow(f.distanceToSquared(h),d);y<1e-4&&(y=1),g<1e-4&&(g=y),m<1e-4&&(m=y),Uc.initNonuniformCatmullRom(l.x,u.x,f.x,h.x,g,y,m),Fc.initNonuniformCatmullRom(l.y,u.y,f.y,h.y,g,y,m),Oc.initNonuniformCatmullRom(l.z,u.z,f.z,h.z,g,y,m)}else this.curveType==="catmullrom"&&(Uc.initCatmullRom(l.x,u.x,f.x,h.x,this.tension),Fc.initCatmullRom(l.y,u.y,f.y,h.y,this.tension),Oc.initCatmullRom(l.z,u.z,f.z,h.z,this.tension));return n.set(Uc.calc(c),Fc.calc(c),Oc.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new C().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function u0(i,t,e,n,s){const o=(n-t)*.5,r=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+o+r)*c+(-3*e+3*n-2*o-r)*a+o*i+e}function K_(i,t){const e=1-i;return e*e*t}function j_(i,t){return 2*(1-i)*i*t}function J_(i,t){return i*i*t}function ko(i,t,e,n){return K_(i,t)+j_(i,e)+J_(i,n)}function Q_(i,t){const e=1-i;return e*e*e*t}function tx(i,t){const e=1-i;return 3*e*e*i*t}function ex(i,t){return 3*(1-i)*i*i*t}function nx(i,t){return i*i*i*t}function zo(i,t,e,n,s){return Q_(i,t)+tx(i,e)+ex(i,n)+nx(i,s)}class Wp extends Ln{constructor(t=new tt,e=new tt,n=new tt,s=new tt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new tt){const n=e,s=this.v0,o=this.v1,r=this.v2,a=this.v3;return n.set(zo(t,s.x,o.x,r.x,a.x),zo(t,s.y,o.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class ix extends Ln{constructor(t=new C,e=new C,n=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new C){const n=e,s=this.v0,o=this.v1,r=this.v2,a=this.v3;return n.set(zo(t,s.x,o.x,r.x,a.x),zo(t,s.y,o.y,r.y,a.y),zo(t,s.z,o.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Xp extends Ln{constructor(t=new tt,e=new tt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new tt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new tt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class sx extends Ln{constructor(t=new C,e=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new C){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new C){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class qp extends Ln{constructor(t=new tt,e=new tt,n=new tt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new tt){const n=e,s=this.v0,o=this.v1,r=this.v2;return n.set(ko(t,s.x,o.x,r.x),ko(t,s.y,o.y,r.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class ox extends Ln{constructor(t=new C,e=new C,n=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new C){const n=e,s=this.v0,o=this.v1,r=this.v2;return n.set(ko(t,s.x,o.x,r.x),ko(t,s.y,o.y,r.y),ko(t,s.z,o.z,r.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Yp extends Ln{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new tt){const n=e,s=this.points,o=(s.length-1)*t,r=Math.floor(o),a=o-r,c=s[r===0?r:r-1],l=s[r],h=s[r>s.length-2?s.length-1:r+1],u=s[r>s.length-3?s.length-1:r+2];return n.set(u0(a,c.x,l.x,h.x,u.x),u0(a,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new tt().fromArray(s))}return this}}var Ah=Object.freeze({__proto__:null,ArcCurve:$_,CatmullRomCurve3:Z_,CubicBezierCurve:Wp,CubicBezierCurve3:ix,EllipseCurve:yu,LineCurve:Xp,LineCurve3:sx,QuadraticBezierCurve:qp,QuadraticBezierCurve3:ox,SplineCurve:Yp});class rx extends Ln{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ah[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let o=0;for(;o<s.length;){if(s[o]>=n){const r=s[o]-n,a=this.curves[o],c=a.getLength(),l=c===0?0:1-r/c;return a.getPointAt(l,e)}o++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,o=this.curves;s<o.length;s++){const r=o[s],a=r.isEllipseCurve?t*2:r.isLineCurve||r.isLineCurve3?1:r.isSplineCurve?t*r.points.length:t,c=r.getPoints(a);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Ah[s.type]().fromJSON(s))}return this}}class d0 extends rx{constructor(t){super(),this.type="Path",this.currentPoint=new tt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Xp(this.currentPoint.clone(),new tt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const o=new qp(this.currentPoint.clone(),new tt(t,e),new tt(n,s));return this.curves.push(o),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,o,r){const a=new Wp(this.currentPoint.clone(),new tt(t,e),new tt(n,s),new tt(o,r));return this.curves.push(a),this.currentPoint.set(o,r),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Yp(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,o,r){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,s,o,r),this}absarc(t,e,n,s,o,r){return this.absellipse(t,e,n,n,s,o,r),this}ellipse(t,e,n,s,o,r,a,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,s,o,r,a,c),this}absellipse(t,e,n,s,o,r,a,c){const l=new yu(t,e,n,s,o,r,a,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class ei extends Le{constructor(t=[new tt(0,-.5),new tt(.5,0),new tt(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Re(s,0,Math.PI*2);const o=[],r=[],a=[],c=[],l=[],h=1/e,u=new C,f=new tt,d=new C,g=new C,y=new C;let m=0,p=0;for(let _=0;_<=t.length-1;_++)switch(_){case 0:m=t[_+1].x-t[_].x,p=t[_+1].y-t[_].y,d.x=p*1,d.y=-m,d.z=p*0,y.copy(d),d.normalize(),c.push(d.x,d.y,d.z);break;case t.length-1:c.push(y.x,y.y,y.z);break;default:m=t[_+1].x-t[_].x,p=t[_+1].y-t[_].y,d.x=p*1,d.y=-m,d.z=p*0,g.copy(d),d.x+=y.x,d.y+=y.y,d.z+=y.z,d.normalize(),c.push(d.x,d.y,d.z),y.copy(g)}for(let _=0;_<=e;_++){const w=n+_*h*s,v=Math.sin(w),b=Math.cos(w);for(let S=0;S<=t.length-1;S++){u.x=t[S].x*v,u.y=t[S].y,u.z=t[S].x*b,r.push(u.x,u.y,u.z),f.x=_/e,f.y=S/(t.length-1),a.push(f.x,f.y);const E=c[3*S+0]*v,T=c[3*S+1],M=c[3*S+0]*b;l.push(E,T,M)}}for(let _=0;_<e;_++)for(let w=0;w<t.length-1;w++){const v=w+_*t.length,b=v,S=v+t.length,E=v+t.length+1,T=v+1;o.push(b,S,T),o.push(E,T,S)}this.setIndex(o),this.setAttribute("position",new ae(r,3)),this.setAttribute("uv",new ae(a,2)),this.setAttribute("normal",new ae(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ei(t.points,t.segments,t.phiStart,t.phiLength)}}class Y extends Le{constructor(t=1,e=1,n=1,s=32,o=1,r=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:o,openEnded:r,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),o=Math.floor(o);const h=[],u=[],f=[],d=[];let g=0;const y=[],m=n/2;let p=0;_(),r===!1&&(t>0&&w(!0),e>0&&w(!1)),this.setIndex(h),this.setAttribute("position",new ae(u,3)),this.setAttribute("normal",new ae(f,3)),this.setAttribute("uv",new ae(d,2));function _(){const v=new C,b=new C;let S=0;const E=(e-t)/n;for(let T=0;T<=o;T++){const M=[],x=T/o,A=x*(e-t)+t;for(let P=0;P<=s;P++){const R=P/s,F=R*c+a,D=Math.sin(F),N=Math.cos(F);b.x=A*D,b.y=-x*n+m,b.z=A*N,u.push(b.x,b.y,b.z),v.set(D,E,N).normalize(),f.push(v.x,v.y,v.z),d.push(R,1-x),M.push(g++)}y.push(M)}for(let T=0;T<s;T++)for(let M=0;M<o;M++){const x=y[M][T],A=y[M+1][T],P=y[M+1][T+1],R=y[M][T+1];(t>0||M!==0)&&(h.push(x,A,R),S+=3),(e>0||M!==o-1)&&(h.push(A,P,R),S+=3)}l.addGroup(p,S,0),p+=S}function w(v){const b=g,S=new tt,E=new C;let T=0;const M=v===!0?t:e,x=v===!0?1:-1;for(let P=1;P<=s;P++)u.push(0,m*x,0),f.push(0,x,0),d.push(.5,.5),g++;const A=g;for(let P=0;P<=s;P++){const F=P/s*c+a,D=Math.cos(F),N=Math.sin(F);E.x=M*N,E.y=m*x,E.z=M*D,u.push(E.x,E.y,E.z),f.push(0,x,0),S.x=D*.5+.5,S.y=N*.5*x+.5,d.push(S.x,S.y),g++}for(let P=0;P<s;P++){const R=b+P,F=A+P;v===!0?h.push(F,F+1,R):h.push(F+1,F,R),T+=3}l.addGroup(p,T,v===!0?1:2),p+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Y(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class jt extends Y{constructor(t=1,e=1,n=32,s=1,o=!1,r=0,a=Math.PI*2){super(0,t,e,n,s,o,r,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:a}}static fromJSON(t){return new jt(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ka extends Le{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const o=[],r=[];a(s),l(n),h(),this.setAttribute("position",new ae(o,3)),this.setAttribute("normal",new ae(o.slice(),3)),this.setAttribute("uv",new ae(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(_){const w=new C,v=new C,b=new C;for(let S=0;S<e.length;S+=3)d(e[S+0],w),d(e[S+1],v),d(e[S+2],b),c(w,v,b,_)}function c(_,w,v,b){const S=b+1,E=[];for(let T=0;T<=S;T++){E[T]=[];const M=_.clone().lerp(v,T/S),x=w.clone().lerp(v,T/S),A=S-T;for(let P=0;P<=A;P++)P===0&&T===S?E[T][P]=M:E[T][P]=M.clone().lerp(x,P/A)}for(let T=0;T<S;T++)for(let M=0;M<2*(S-T)-1;M++){const x=Math.floor(M/2);M%2===0?(f(E[T][x+1]),f(E[T+1][x]),f(E[T][x])):(f(E[T][x+1]),f(E[T+1][x+1]),f(E[T+1][x]))}}function l(_){const w=new C;for(let v=0;v<o.length;v+=3)w.x=o[v+0],w.y=o[v+1],w.z=o[v+2],w.normalize().multiplyScalar(_),o[v+0]=w.x,o[v+1]=w.y,o[v+2]=w.z}function h(){const _=new C;for(let w=0;w<o.length;w+=3){_.x=o[w+0],_.y=o[w+1],_.z=o[w+2];const v=m(_)/2/Math.PI+.5,b=p(_)/Math.PI+.5;r.push(v,1-b)}g(),u()}function u(){for(let _=0;_<r.length;_+=6){const w=r[_+0],v=r[_+2],b=r[_+4],S=Math.max(w,v,b),E=Math.min(w,v,b);S>.9&&E<.1&&(w<.2&&(r[_+0]+=1),v<.2&&(r[_+2]+=1),b<.2&&(r[_+4]+=1))}}function f(_){o.push(_.x,_.y,_.z)}function d(_,w){const v=_*3;w.x=t[v+0],w.y=t[v+1],w.z=t[v+2]}function g(){const _=new C,w=new C,v=new C,b=new C,S=new tt,E=new tt,T=new tt;for(let M=0,x=0;M<o.length;M+=9,x+=6){_.set(o[M+0],o[M+1],o[M+2]),w.set(o[M+3],o[M+4],o[M+5]),v.set(o[M+6],o[M+7],o[M+8]),S.set(r[x+0],r[x+1]),E.set(r[x+2],r[x+3]),T.set(r[x+4],r[x+5]),b.copy(_).add(w).add(v).divideScalar(3);const A=m(b);y(S,x+0,_,A),y(E,x+2,w,A),y(T,x+4,v,A)}}function y(_,w,v,b){b<0&&_.x===1&&(r[w]=_.x-1),v.x===0&&v.z===0&&(r[w]=b/2/Math.PI+.5)}function m(_){return Math.atan2(_.z,-_.x)}function p(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ka(t.vertices,t.indices,t.radius,t.details)}}class $p extends d0{constructor(t){super(t),this.uuid=Ji(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new d0().fromJSON(s))}return this}}const ax={triangulate:function(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let o=Zp(i,0,s,e,!0);const r=[];if(!o||o.next===o.prev)return r;let a,c,l,h,u,f,d;if(n&&(o=dx(i,t,o,e)),i.length>80*e){a=l=i[0],c=h=i[1];for(let g=e;g<s;g+=e)u=i[g],f=i[g+1],u<a&&(a=u),f<c&&(c=f),u>l&&(l=u),f>h&&(h=f);d=Math.max(l-a,h-c),d=d!==0?32767/d:0}return Vo(o,r,e,a,c,d,0),r}};function Zp(i,t,e,n,s){let o,r;if(s===bx(i,t,e,n)>0)for(o=t;o<e;o+=n)r=f0(o,i[o],i[o+1],r);else for(o=e-n;o>=t;o-=n)r=f0(o,i[o],i[o+1],r);return r&&ja(r,r.next)&&(Xo(r),r=r.next),r}function Ki(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(ja(e,e.next)||be(e.prev,e,e.next)===0)){if(Xo(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Vo(i,t,e,n,s,o,r){if(!i)return;!r&&o&&yx(i,n,s,o);let a=i,c,l;for(;i.prev!==i.next;){if(c=i.prev,l=i.next,o?lx(i,n,s,o):cx(i)){t.push(c.i/e|0),t.push(i.i/e|0),t.push(l.i/e|0),Xo(i),i=l.next,a=l.next;continue}if(i=l,i===a){r?r===1?(i=hx(Ki(i),t,e),Vo(i,t,e,n,s,o,2)):r===2&&ux(i,t,e,n,s,o):Vo(Ki(i),t,e,n,s,o,1);break}}}function cx(i){const t=i.prev,e=i,n=i.next;if(be(t,e,n)>=0)return!1;const s=t.x,o=e.x,r=n.x,a=t.y,c=e.y,l=n.y,h=s<o?s<r?s:r:o<r?o:r,u=a<c?a<l?a:l:c<l?c:l,f=s>o?s>r?s:r:o>r?o:r,d=a>c?a>l?a:l:c>l?c:l;let g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=f&&g.y>=u&&g.y<=d&&Rs(s,a,o,c,r,l,g.x,g.y)&&be(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function lx(i,t,e,n){const s=i.prev,o=i,r=i.next;if(be(s,o,r)>=0)return!1;const a=s.x,c=o.x,l=r.x,h=s.y,u=o.y,f=r.y,d=a<c?a<l?a:l:c<l?c:l,g=h<u?h<f?h:f:u<f?u:f,y=a>c?a>l?a:l:c>l?c:l,m=h>u?h>f?h:f:u>f?u:f,p=Rh(d,g,t,e,n),_=Rh(y,m,t,e,n);let w=i.prevZ,v=i.nextZ;for(;w&&w.z>=p&&v&&v.z<=_;){if(w.x>=d&&w.x<=y&&w.y>=g&&w.y<=m&&w!==s&&w!==r&&Rs(a,h,c,u,l,f,w.x,w.y)&&be(w.prev,w,w.next)>=0||(w=w.prevZ,v.x>=d&&v.x<=y&&v.y>=g&&v.y<=m&&v!==s&&v!==r&&Rs(a,h,c,u,l,f,v.x,v.y)&&be(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;w&&w.z>=p;){if(w.x>=d&&w.x<=y&&w.y>=g&&w.y<=m&&w!==s&&w!==r&&Rs(a,h,c,u,l,f,w.x,w.y)&&be(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;v&&v.z<=_;){if(v.x>=d&&v.x<=y&&v.y>=g&&v.y<=m&&v!==s&&v!==r&&Rs(a,h,c,u,l,f,v.x,v.y)&&be(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function hx(i,t,e){let n=i;do{const s=n.prev,o=n.next.next;!ja(s,o)&&Kp(s,n,n.next,o)&&Wo(s,o)&&Wo(o,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(o.i/e|0),Xo(n),Xo(n.next),n=i=o),n=n.next}while(n!==i);return Ki(n)}function ux(i,t,e,n,s,o){let r=i;do{let a=r.next.next;for(;a!==r.prev;){if(r.i!==a.i&&_x(r,a)){let c=jp(r,a);r=Ki(r,r.next),c=Ki(c,c.next),Vo(r,t,e,n,s,o,0),Vo(c,t,e,n,s,o,0);return}a=a.next}r=r.next}while(r!==i)}function dx(i,t,e,n){const s=[];let o,r,a,c,l;for(o=0,r=t.length;o<r;o++)a=t[o]*n,c=o<r-1?t[o+1]*n:i.length,l=Zp(i,a,c,n,!1),l===l.next&&(l.steiner=!0),s.push(wx(l));for(s.sort(fx),o=0;o<s.length;o++)e=px(s[o],e);return e}function fx(i,t){return i.x-t.x}function px(i,t){const e=mx(i,t);if(!e)return t;const n=jp(e,i);return Ki(n,n.next),Ki(e,e.next)}function mx(i,t){let e=t,n=-1/0,s;const o=i.x,r=i.y;do{if(r<=e.y&&r>=e.next.y&&e.next.y!==e.y){const f=e.x+(r-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=o&&f>n&&(n=f,s=e.x<e.next.x?e:e.next,f===o))return s}e=e.next}while(e!==t);if(!s)return null;const a=s,c=s.x,l=s.y;let h=1/0,u;e=s;do o>=e.x&&e.x>=c&&o!==e.x&&Rs(r<l?o:n,r,c,l,r<l?n:o,r,e.x,e.y)&&(u=Math.abs(r-e.y)/(o-e.x),Wo(e,i)&&(u<h||u===h&&(e.x>s.x||e.x===s.x&&gx(s,e)))&&(s=e,h=u)),e=e.next;while(e!==a);return s}function gx(i,t){return be(i.prev,i,t.prev)<0&&be(t.next,i,i.next)<0}function yx(i,t,e,n){let s=i;do s.z===0&&(s.z=Rh(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,vx(s)}function vx(i){let t,e,n,s,o,r,a,c,l=1;do{for(e=i,i=null,o=null,r=0;e;){for(r++,n=e,a=0,t=0;t<l&&(a++,n=n.nextZ,!!n);t++);for(c=l;a>0||c>0&&n;)a!==0&&(c===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,a--):(s=n,n=n.nextZ,c--),o?o.nextZ=s:i=s,s.prevZ=o,o=s;e=n}o.nextZ=null,l*=2}while(r>1);return i}function Rh(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function wx(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Rs(i,t,e,n,s,o,r,a){return(s-r)*(t-a)>=(i-r)*(o-a)&&(i-r)*(n-a)>=(e-r)*(t-a)&&(e-r)*(o-a)>=(s-r)*(n-a)}function _x(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!xx(i,t)&&(Wo(i,t)&&Wo(t,i)&&Mx(i,t)&&(be(i.prev,i,t.prev)||be(i,t.prev,t))||ja(i,t)&&be(i.prev,i,i.next)>0&&be(t.prev,t,t.next)>0)}function be(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function ja(i,t){return i.x===t.x&&i.y===t.y}function Kp(i,t,e,n){const s=Ur(be(i,t,e)),o=Ur(be(i,t,n)),r=Ur(be(e,n,i)),a=Ur(be(e,n,t));return!!(s!==o&&r!==a||s===0&&Nr(i,e,t)||o===0&&Nr(i,n,t)||r===0&&Nr(e,i,n)||a===0&&Nr(e,t,n))}function Nr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Ur(i){return i>0?1:i<0?-1:0}function xx(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Kp(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Wo(i,t){return be(i.prev,i,i.next)<0?be(i,t,i.next)>=0&&be(i,i.prev,t)>=0:be(i,t,i.prev)<0||be(i,i.next,t)<0}function Mx(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,o=(i.y+t.y)/2;do e.y>o!=e.next.y>o&&e.next.y!==e.y&&s<(e.next.x-e.x)*(o-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function jp(i,t){const e=new Ch(i.i,i.x,i.y),n=new Ch(t.i,t.x,t.y),s=i.next,o=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,o.next=n,n.prev=o,n}function f0(i,t,e,n){const s=new Ch(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Xo(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Ch(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function bx(i,t,e,n){let s=0;for(let o=t,r=e-n;o<e;o+=n)s+=(i[r]-i[o])*(i[o+1]+i[r+1]),r=o;return s}class Bo{static area(t){const e=t.length;let n=0;for(let s=e-1,o=0;o<e;s=o++)n+=t[s].x*t[o].y-t[o].x*t[s].y;return n*.5}static isClockWise(t){return Bo.area(t)<0}static triangulateShape(t,e){const n=[],s=[],o=[];p0(t),m0(n,t);let r=t.length;e.forEach(p0);for(let c=0;c<e.length;c++)s.push(r),r+=e[c].length,m0(n,e[c]);const a=ax.triangulate(n,s);for(let c=0;c<a.length;c+=3)o.push(a.slice(c,c+3));return o}}function p0(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function m0(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class wu extends Le{constructor(t=new $p([new tt(.5,.5),new tt(-.5,.5),new tt(-.5,-.5),new tt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],o=[];for(let a=0,c=t.length;a<c;a++){const l=t[a];r(l)}this.setAttribute("position",new ae(s,3)),this.setAttribute("uv",new ae(o,2)),this.computeVertexNormals();function r(a){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:d-.1,y=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,_=e.UVGenerator!==void 0?e.UVGenerator:Sx;let w,v=!1,b,S,E,T;p&&(w=p.getSpacedPoints(h),v=!0,f=!1,b=p.computeFrenetFrames(h,!1),S=new C,E=new C,T=new C),f||(m=0,d=0,g=0,y=0);const M=a.extractPoints(l);let x=M.shape;const A=M.holes;if(!Bo.isClockWise(x)){x=x.reverse();for(let nt=0,ht=A.length;nt<ht;nt++){const B=A[nt];Bo.isClockWise(B)&&(A[nt]=B.reverse())}}const R=Bo.triangulateShape(x,A),F=x;for(let nt=0,ht=A.length;nt<ht;nt++){const B=A[nt];x=x.concat(B)}function D(nt,ht,B){return ht||console.error("THREE.ExtrudeGeometry: vec does not exist"),nt.clone().addScaledVector(ht,B)}const N=x.length,H=R.length;function G(nt,ht,B){let ft,st,yt;const vt=nt.x-ht.x,Gt=nt.y-ht.y,Pt=B.x-nt.x,z=B.y-nt.y,U=vt*vt+Gt*Gt,Z=vt*z-Gt*Pt;if(Math.abs(Z)>Number.EPSILON){const at=Math.sqrt(U),dt=Math.sqrt(Pt*Pt+z*z),ct=ht.x-Gt/at,Ut=ht.y+vt/at,Et=B.x-z/dt,It=B.y+Pt/dt,ie=((Et-ct)*z-(It-Ut)*Pt)/(vt*z-Gt*Pt);ft=ct+vt*ie-nt.x,st=Ut+Gt*ie-nt.y;const gt=ft*ft+st*st;if(gt<=2)return new tt(ft,st);yt=Math.sqrt(gt/2)}else{let at=!1;vt>Number.EPSILON?Pt>Number.EPSILON&&(at=!0):vt<-Number.EPSILON?Pt<-Number.EPSILON&&(at=!0):Math.sign(Gt)===Math.sign(z)&&(at=!0),at?(ft=-Gt,st=vt,yt=Math.sqrt(U)):(ft=vt,st=Gt,yt=Math.sqrt(U/2))}return new tt(ft/yt,st/yt)}const V=[];for(let nt=0,ht=F.length,B=ht-1,ft=nt+1;nt<ht;nt++,B++,ft++)B===ht&&(B=0),ft===ht&&(ft=0),V[nt]=G(F[nt],F[B],F[ft]);const et=[];let lt,bt=V.concat();for(let nt=0,ht=A.length;nt<ht;nt++){const B=A[nt];lt=[];for(let ft=0,st=B.length,yt=st-1,vt=ft+1;ft<st;ft++,yt++,vt++)yt===st&&(yt=0),vt===st&&(vt=0),lt[ft]=G(B[ft],B[yt],B[vt]);et.push(lt),bt=bt.concat(lt)}for(let nt=0;nt<m;nt++){const ht=nt/m,B=d*Math.cos(ht*Math.PI/2),ft=g*Math.sin(ht*Math.PI/2)+y;for(let st=0,yt=F.length;st<yt;st++){const vt=D(F[st],V[st],ft);$(vt.x,vt.y,-B)}for(let st=0,yt=A.length;st<yt;st++){const vt=A[st];lt=et[st];for(let Gt=0,Pt=vt.length;Gt<Pt;Gt++){const z=D(vt[Gt],lt[Gt],ft);$(z.x,z.y,-B)}}}const Lt=g+y;for(let nt=0;nt<N;nt++){const ht=f?D(x[nt],bt[nt],Lt):x[nt];v?(E.copy(b.normals[0]).multiplyScalar(ht.x),S.copy(b.binormals[0]).multiplyScalar(ht.y),T.copy(w[0]).add(E).add(S),$(T.x,T.y,T.z)):$(ht.x,ht.y,0)}for(let nt=1;nt<=h;nt++)for(let ht=0;ht<N;ht++){const B=f?D(x[ht],bt[ht],Lt):x[ht];v?(E.copy(b.normals[nt]).multiplyScalar(B.x),S.copy(b.binormals[nt]).multiplyScalar(B.y),T.copy(w[nt]).add(E).add(S),$(T.x,T.y,T.z)):$(B.x,B.y,u/h*nt)}for(let nt=m-1;nt>=0;nt--){const ht=nt/m,B=d*Math.cos(ht*Math.PI/2),ft=g*Math.sin(ht*Math.PI/2)+y;for(let st=0,yt=F.length;st<yt;st++){const vt=D(F[st],V[st],ft);$(vt.x,vt.y,u+B)}for(let st=0,yt=A.length;st<yt;st++){const vt=A[st];lt=et[st];for(let Gt=0,Pt=vt.length;Gt<Pt;Gt++){const z=D(vt[Gt],lt[Gt],ft);v?$(z.x,z.y+w[h-1].y,w[h-1].x+B):$(z.x,z.y,u+B)}}}J(),rt();function J(){const nt=s.length/3;if(f){let ht=0,B=N*ht;for(let ft=0;ft<H;ft++){const st=R[ft];ot(st[2]+B,st[1]+B,st[0]+B)}ht=h+m*2,B=N*ht;for(let ft=0;ft<H;ft++){const st=R[ft];ot(st[0]+B,st[1]+B,st[2]+B)}}else{for(let ht=0;ht<H;ht++){const B=R[ht];ot(B[2],B[1],B[0])}for(let ht=0;ht<H;ht++){const B=R[ht];ot(B[0]+N*h,B[1]+N*h,B[2]+N*h)}}n.addGroup(nt,s.length/3-nt,0)}function rt(){const nt=s.length/3;let ht=0;K(F,ht),ht+=F.length;for(let B=0,ft=A.length;B<ft;B++){const st=A[B];K(st,ht),ht+=st.length}n.addGroup(nt,s.length/3-nt,1)}function K(nt,ht){let B=nt.length;for(;--B>=0;){const ft=B;let st=B-1;st<0&&(st=nt.length-1);for(let yt=0,vt=h+m*2;yt<vt;yt++){const Gt=N*yt,Pt=N*(yt+1),z=ht+ft+Gt,U=ht+st+Gt,Z=ht+st+Pt,at=ht+ft+Pt;mt(z,U,Z,at)}}}function $(nt,ht,B){c.push(nt),c.push(ht),c.push(B)}function ot(nt,ht,B){Mt(nt),Mt(ht),Mt(B);const ft=s.length/3,st=_.generateTopUV(n,s,ft-3,ft-2,ft-1);Ft(st[0]),Ft(st[1]),Ft(st[2])}function mt(nt,ht,B,ft){Mt(nt),Mt(ht),Mt(ft),Mt(ht),Mt(B),Mt(ft);const st=s.length/3,yt=_.generateSideWallUV(n,s,st-6,st-3,st-2,st-1);Ft(yt[0]),Ft(yt[1]),Ft(yt[3]),Ft(yt[1]),Ft(yt[2]),Ft(yt[3])}function Mt(nt){s.push(c[nt*3+0]),s.push(c[nt*3+1]),s.push(c[nt*3+2])}function Ft(nt){o.push(nt.x),o.push(nt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Ex(e,n,t)}static fromJSON(t,e){const n=[];for(let o=0,r=t.shapes.length;o<r;o++){const a=e[t.shapes[o]];n.push(a)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Ah[s.type]().fromJSON(s)),new wu(n,t.options)}}const Sx={generateTopUV:function(i,t,e,n,s){const o=t[e*3],r=t[e*3+1],a=t[n*3],c=t[n*3+1],l=t[s*3],h=t[s*3+1];return[new tt(o,r),new tt(a,c),new tt(l,h)]},generateSideWallUV:function(i,t,e,n,s,o){const r=t[e*3],a=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],u=t[n*3+2],f=t[s*3],d=t[s*3+1],g=t[s*3+2],y=t[o*3],m=t[o*3+1],p=t[o*3+2];return Math.abs(a-h)<Math.abs(r-l)?[new tt(r,1-c),new tt(l,1-u),new tt(f,1-g),new tt(y,1-p)]:[new tt(a,1-c),new tt(h,1-u),new tt(d,1-g),new tt(m,1-p)]}};function Ex(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const o=i[n];e.shapes.push(o.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class ee extends Ka{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],o=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,o,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ee(t.radius,t.detail)}}class Ge extends Ka{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ge(t.radius,t.detail)}}class Jo extends Le{constructor(t=1,e=32,n=16,s=0,o=Math.PI*2,r=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:o,thetaStart:r,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(r+a,Math.PI);let l=0;const h=[],u=new C,f=new C,d=[],g=[],y=[],m=[];for(let p=0;p<=n;p++){const _=[],w=p/n;let v=0;p===0&&r===0?v=.5/e:p===n&&c===Math.PI&&(v=-.5/e);for(let b=0;b<=e;b++){const S=b/e;u.x=-t*Math.cos(s+S*o)*Math.sin(r+w*a),u.y=t*Math.cos(r+w*a),u.z=t*Math.sin(s+S*o)*Math.sin(r+w*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),y.push(f.x,f.y,f.z),m.push(S+v,1-w),_.push(l++)}h.push(_)}for(let p=0;p<n;p++)for(let _=0;_<e;_++){const w=h[p][_+1],v=h[p][_],b=h[p+1][_],S=h[p+1][_+1];(p!==0||r>0)&&d.push(w,v,S),(p!==n-1||c<Math.PI)&&d.push(v,b,S)}this.setIndex(d),this.setAttribute("position",new ae(g,3)),this.setAttribute("normal",new ae(y,3)),this.setAttribute("uv",new ae(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Jo(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Qi extends Le{constructor(t=1,e=.4,n=12,s=48,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:o},n=Math.floor(n),s=Math.floor(s);const r=[],a=[],c=[],l=[],h=new C,u=new C,f=new C;for(let d=0;d<=n;d++)for(let g=0;g<=s;g++){const y=g/s*o,m=d/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(y),u.y=(t+e*Math.cos(m))*Math.sin(y),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(y),h.y=t*Math.sin(y),f.subVectors(u,h).normalize(),c.push(f.x,f.y,f.z),l.push(g/s),l.push(d/n)}for(let d=1;d<=n;d++)for(let g=1;g<=s;g++){const y=(s+1)*d+g-1,m=(s+1)*(d-1)+g-1,p=(s+1)*(d-1)+g,_=(s+1)*d+g;r.push(y,m,_),r.push(m,p,_)}this.setIndex(r),this.setAttribute("position",new ae(a,3)),this.setAttribute("normal",new ae(c,3)),this.setAttribute("uv",new ae(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Qi(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Tx extends Te{static get type(){return"RawShaderMaterial"}constructor(t){super(t),this.isRawShaderMaterial=!0}}class Ax extends Ti{static get type(){return"MeshNormalMaterial"}constructor(t){super(),this.isMeshNormalMaterial=!0,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=lu,this.normalScale=new tt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}}class Ze extends Ti{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Wt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=lu,this.normalScale=new tt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.combine=nu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Ja extends Ee{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Wt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Rx extends Ja{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ee.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Wt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const kc=new fe,g0=new C,y0=new C;class _u{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new tt(512,512),this.map=null,this.mapPass=null,this.matrix=new fe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new uu,this._frameExtents=new tt(1,1),this._viewportCount=1,this._viewports=[new le(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;g0.setFromMatrixPosition(t.matrixWorld),e.position.copy(g0),y0.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(y0),e.updateMatrixWorld(),kc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(kc),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(kc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Cx extends _u{constructor(){super(new Qe(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){const e=this.camera,n=Vs*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height,o=t.distance||e.far;(n!==e.fov||s!==e.aspect||o!==e.far)&&(e.fov=n,e.aspect=s,e.far=o,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class Px extends Ja{constructor(t,e,n=0,s=Math.PI/3,o=0,r=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Ee.DEFAULT_UP),this.updateMatrix(),this.target=new Ee,this.distance=n,this.angle=s,this.penumbra=o,this.decay=r,this.map=null,this.shadow=new Cx}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const v0=new fe,lo=new C,zc=new C;class Ix extends _u{constructor(){super(new Qe(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new tt(4,2),this._viewportCount=6,this._viewports=[new le(2,1,1,1),new le(0,1,1,1),new le(3,1,1,1),new le(1,1,1,1),new le(3,0,1,1),new le(1,0,1,1)],this._cubeDirections=[new C(1,0,0),new C(-1,0,0),new C(0,0,1),new C(0,0,-1),new C(0,1,0),new C(0,-1,0)],this._cubeUps=[new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,0,1),new C(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,o=t.distance||n.far;o!==n.far&&(n.far=o,n.updateProjectionMatrix()),lo.setFromMatrixPosition(t.matrixWorld),n.position.copy(lo),zc.copy(n.position),zc.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(zc),n.updateMatrixWorld(),s.makeTranslation(-lo.x,-lo.y,-lo.z),v0.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(v0)}}class ts extends Ja{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Ix}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class Lx extends _u{constructor(){super(new du(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class w0 extends Ja{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ee.DEFAULT_UP),this.updateMatrix(),this.target=new Ee,this.shadow=new Lx}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Dx{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=_0(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=_0();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function _0(){return performance.now()}const x0=new fe;class Nx{constructor(t,e,n=0,s=1/0){this.ray=new Ko(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new qa,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return x0.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(x0),this}intersectObject(t,e=!0,n=[]){return Ph(t,this,n,e),n.sort(M0),n}intersectObjects(t,e=!0,n=[]){for(let s=0,o=t.length;s<o;s++)Ph(t[s],this,n,e);return n.sort(M0),n}}function M0(i,t){return i.distance-t.distance}function Ph(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const o=i.children;for(let r=0,a=o.length;r<a;r++)Ph(o[r],t,e,!0)}}const b0=new C,Fr=new C;class xu{constructor(t=new C,e=new C){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){b0.subVectors(t,this.start),Fr.subVectors(this.end,this.start);const n=Fr.dot(Fr);let o=Fr.dot(b0)/n;return e&&(o=Re(o,0,1)),o}closestPointToPoint(t,e,n){const s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}class Ux extends gu{constructor(t=1){const e=[0,0,0,t,0,0,0,0,0,0,t,0,0,0,0,0,0,t],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new Le;s.setAttribute("position",new ae(e,3)),s.setAttribute("color",new ae(n,3));const o=new Gp({vertexColors:!0,toneMapped:!1});super(s,o),this.type="AxesHelper"}setColors(t,e,n){const s=new Wt,o=this.geometry.attributes.color.array;return s.set(t),s.toArray(o,0),s.toArray(o,3),s.set(e),s.toArray(o,6),s.toArray(o,9),s.set(n),s.toArray(o,12),s.toArray(o,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:eu}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=eu);class Fx{renderer;scene;camera;onResize=null;canvas;handleResize=()=>this.resize();constructor(t){this.canvas=t,this.renderer=new W_({canvas:t,antialias:!1,powerPreference:"high-performance",stencil:!1}),this.renderer.setClearColor(657935,1),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=cp,this.renderer.shadowMap.autoUpdate=!1,this.renderer.info.autoReset=!1,this.scene=new X_,this.camera=new Qe(70,1,.1,500),this.resize(),window.addEventListener("resize",this.handleResize),window.addEventListener("orientationchange",this.handleResize)}resize(){const t=this.canvas.clientWidth||window.innerWidth,e=this.canvas.clientHeight||window.innerHeight;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(t,e,!1),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.onResize?.()}render(){this.renderer.info.reset(),this.renderer.shadowMap.needsUpdate=!0,this.renderer.render(this.scene,this.camera)}dispose(){window.removeEventListener("resize",this.handleResize),window.removeEventListener("orientationchange",this.handleResize),this.renderer.dispose()}}const Ox=1;class kx{subscribers=new Set;handle=0;last=0;elapsed=0;running=!1;minInterval=0;add(t){return this.subscribers.add(t),()=>this.subscribers.delete(t)}setFpsCap(t){this.minInterval=t&&t>0?1e3/t:0}start(){if(this.running)return;this.running=!0,this.last=performance.now();const t=e=>{if(this.handle=requestAnimationFrame(t),this.minInterval>0&&e-this.last<this.minInterval-Ox)return;const n=Math.min((e-this.last)/1e3,.1);this.last=e,this.elapsed+=n;for(const s of this.subscribers)s(n,this.elapsed)};this.handle=requestAnimationFrame(t)}stop(){this.running&&(cancelAnimationFrame(this.handle),this.running=!1)}}const zx={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Qo{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Bx=new du(-1,1,1,-1,0,1);class Hx extends Le{constructor(){super(),this.setAttribute("position",new ae([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ae([0,2,0,0,2,0],2))}}const Gx=new Hx;class to{constructor(t){this._mesh=new ne(Gx,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,Bx)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class Jp extends Qo{constructor(t,e){super(),this.textureID=e!==void 0?e:"tDiffuse",t instanceof Te?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=Ya.clone(t.uniforms),this.material=new Te({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new to(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class S0 extends Qo{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const s=t.getContext(),o=t.state;o.buffers.color.setMask(!1),o.buffers.depth.setMask(!1),o.buffers.color.setLocked(!0),o.buffers.depth.setLocked(!0);let r,a;this.inverse?(r=0,a=1):(r=1,a=0),o.buffers.stencil.setTest(!0),o.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),o.buffers.stencil.setFunc(s.ALWAYS,r,4294967295),o.buffers.stencil.setClear(a),o.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),o.buffers.color.setLocked(!1),o.buffers.depth.setLocked(!1),o.buffers.color.setMask(!0),o.buffers.depth.setMask(!0),o.buffers.stencil.setLocked(!1),o.buffers.stencil.setFunc(s.EQUAL,1,4294967295),o.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),o.buffers.stencil.setLocked(!0)}}class Vx extends Qo{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class Wx{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new tt);this._width=n.width,this._height=n.height,e=new wn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Ei}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Jp(zx),this.copyPass.material.blending=Kn,this.clock=new Dx}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let s=0,o=this.passes.length;s<o;s++){const r=this.passes[s];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),r.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),r.needsSwap){if(n){const a=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),c.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}S0!==void 0&&(r instanceof S0?n=!0:r instanceof Vx&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new tt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let o=0;o<this.passes.length;o++)this.passes[o].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}const Xx={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class qx extends Qo{constructor(){super();const t=Xx;this.uniforms=Ya.clone(t.uniforms),this.material=new Tx({name:t.name,uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.fsQuad=new to(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},re.getTransfer(this._outputColorSpace)===me&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===lp?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===hp?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===up?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===dp?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===fp?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===pp&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}function Qp(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),o={},r={},a=i[0].morphTargetsRelative,c=new Le;let l=0;for(let h=0;h<i.length;++h){const u=i[h];let f=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in u.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;o[d]===void 0&&(o[d]=[]),o[d].push(u.attributes[d]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in u.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.morphAttributes[d])}if(t){let d;if(e)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,d,h),l+=d}}if(e){let h=0;const u=[];for(let f=0;f<i.length;++f){const d=i[f].index;for(let g=0;g<d.count;++g)u.push(d.getX(g)+h);h+=i[f].attributes.position.count}c.setIndex(u)}for(const h in o){const u=E0(o[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in r){const u=r[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let f=0;f<u;++f){const d=[];for(let y=0;y<r[h].length;++y)d.push(r[h][y][f]);const g=E0(d);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function E0(i){let t,e,n,s=-1,o=0;for(let l=0;l<i.length;++l){const h=i[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;o+=h.count*e}const r=new t(o),a=new He(r,e,n);let c=0;for(let l=0;l<i.length;++l){const h=i[l];if(h.isInterleavedBufferAttribute){const u=c/e;for(let f=0,d=h.count;f<d;f++)for(let g=0;g<e;g++){const y=h.getComponent(f,g);a.setComponent(f+u,g,y)}}else r.set(h.array,c);c+=h.count*e}return s!==void 0&&(a.gpuType=s),a}function Mu(i,t=1e-4){t=Math.max(t,Number.EPSILON);const e={},n=i.getIndex(),s=i.getAttribute("position"),o=n?n.count:s.count;let r=0;const a=Object.keys(i.attributes),c={},l={},h=[],u=["getX","getY","getZ","getW"],f=["setX","setY","setZ","setW"];for(let _=0,w=a.length;_<w;_++){const v=a[_],b=i.attributes[v];c[v]=new b.constructor(new b.array.constructor(b.count*b.itemSize),b.itemSize,b.normalized);const S=i.morphAttributes[v];S&&(l[v]||(l[v]=[]),S.forEach((E,T)=>{const M=new E.array.constructor(E.count*E.itemSize);l[v][T]=new E.constructor(M,E.itemSize,E.normalized)}))}const d=t*.5,g=Math.log10(1/t),y=Math.pow(10,g),m=d*y;for(let _=0;_<o;_++){const w=n?n.getX(_):_;let v="";for(let b=0,S=a.length;b<S;b++){const E=a[b],T=i.getAttribute(E),M=T.itemSize;for(let x=0;x<M;x++)v+=`${~~(T[u[x]](w)*y+m)},`}if(v in e)h.push(e[v]);else{for(let b=0,S=a.length;b<S;b++){const E=a[b],T=i.getAttribute(E),M=i.morphAttributes[E],x=T.itemSize,A=c[E],P=l[E];for(let R=0;R<x;R++){const F=u[R],D=f[R];if(A[D](r,T[F](w)),M)for(let N=0,H=M.length;N<H;N++)P[N][D](r,M[N][F](w))}}e[v]=r,h.push(r),r++}}const p=i.clone();for(const _ in i.attributes){const w=c[_];if(p.setAttribute(_,new w.constructor(w.array.slice(0,r*w.itemSize),w.itemSize,w.normalized)),_ in l)for(let v=0;v<l[_].length;v++){const b=l[_][v];p.morphAttributes[_][v]=new b.constructor(b.array.slice(0,r*b.itemSize),b.itemSize,b.normalized)}}return p.setIndex(h),p}const Yx=new Set(["small-grass-clump","large-grass-clump","daisy","bluebell","poppy","lavender","wildflower","thistle"]),$x={reeds:1,"small-grass-clump":.95,"large-grass-clump":.9,cowparsley:.85,wildflower:.8,poppy:.8,bluebell:.8,daisy:.75,lavender:.7,foxglove:.5,fern:.6,nettle:.6,"small-tree":.6,tree:.55,bush:.5,elder:.65,hazel:.6,gorse:.25,"small-birch":.8,birch:.75,"small-oak":.5,oak:.35,"small-rowan":.7,rowan:.6,"small-spruce":.4,spruce:.3,bramble:.4,thistle:.35,sunflower:.2,banner:.35},L={BARK:4602672,BARK_PALE:5720636,LEAF:5201977,LEAF_DARK:4017196,LEAF_DRY:7039548,GRASS:6056762,GRASS_DRY:8025156,STONE:9869984,STONE_DARK:7699072,STONE_PALE:11449014,EARTH:4998454,TIMBER:9073506,TIMBER_DARK:7035469,TIMBER_PALE:11047798,IRON:5922659,IRON_DARK:4146248,RUST:8014384,BRONZE:9072696,PATINA:6058080,WATER:2899782,LAMPLIGHT:16769192,CLOTH:9274994,SKIN:11047546,INK:2827808,HIDE:7165505,HIDE_DARK:4273193,HIDE_PALE:10653813,WOOL:12433060,HOG:11042938,FOWL:10260343,COMB:10240564,MARKER_YELLOW:13213770,COW_BLACK:2367775};function I(i,t){const e=Math.min(255,Math.round((i>>16&255)*t)),n=Math.min(255,Math.round((i>>8&255)*t)),s=Math.min(255,Math.round((i&255)*t));return e<<16|n<<8|s}const va="wear",wa="wearTint";function Zx(i){const t=i.onBeforeCompile;i.onBeforeCompile=(e,n)=>{t?.call(i,e,n),e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
        attribute float ${va};
        attribute vec3 ${wa};
        varying float vWear;
        varying vec3 vWearTint;
        varying vec3 vWearPos;
        `).replace("#include <begin_vertex>",`#include <begin_vertex>
        vWear = ${va};
        vWearTint = ${wa};
        // The raw attribute, not 'transformed': sampled before sway displaces
        // anything, so the pattern is welded to the surface and does not swim
        // when the surface moves.
        vWearPos = position;
        `),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
        varying float vWear;
        varying vec3 vWearTint;
        varying vec3 vWearPos;

        // (No backticks anywhere below: this is a template literal, and one
        // would end it mid-GLSL. Same note as the sway patch.)
        float wearHash(vec3 p) {
          return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
        }

        // Trilinear value noise: blobs, where a raw hash is static.
        float wearNoise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          vec3 s = f * f * (3.0 - 2.0 * f);
          float n000 = wearHash(i);
          float n100 = wearHash(i + vec3(1.0, 0.0, 0.0));
          float n010 = wearHash(i + vec3(0.0, 1.0, 0.0));
          float n110 = wearHash(i + vec3(1.0, 1.0, 0.0));
          float n001 = wearHash(i + vec3(0.0, 0.0, 1.0));
          float n101 = wearHash(i + vec3(1.0, 0.0, 1.0));
          float n011 = wearHash(i + vec3(0.0, 1.0, 1.0));
          float n111 = wearHash(i + vec3(1.0, 1.0, 1.0));
          return mix(
            mix(mix(n000, n100, s.x), mix(n010, n110, s.x), s.y),
            mix(mix(n001, n101, s.x), mix(n011, n111, s.x), s.y),
            s.z
          );
        }
        `).replace("#include <color_fragment>",`#include <color_fragment>
        if (vWear > 0.004) {
          // Two scales: hand-sized clumps, finger-sized mottle inside them.
          float n = 0.62 * wearNoise(vWearPos * 9.0) + 0.38 * wearNoise(vWearPos * 47.0);
          if (n < vWear) {
            // Tone varies inside a patch — centres deeper, rims brighter —
            // from a third scale of the same noise, so no second attribute.
            float depth = wearNoise(vWearPos * 23.0 + 11.0);
            diffuseColor.rgb = vWearTint * (0.72 + 0.42 * depth);
          }
        }
        `)},i.defaultAttributeValues={...i.defaultAttributeValues,[va]:[0],[wa]:[0,0,0]},i.customProgramCacheKey=()=>"sway-wear",i.needsUpdate=!0}function tm(i,t,e){const n=o=>.2126*(o>>16&255)+.7152*(o>>8&255)+.0722*(o&255),s=Math.min(Math.max(n(t)/Math.max(n(e),1),.55),1.3);return I(i,s)}function Kx(i,t){return(e,n)=>{let s=0;for(const[o,r]of i){const a=Math.hypot(e-o,n-r);a<t&&(s=Math.max(s,1-a/t))}return s}}const Xs="sway",Ih=new Ze({vertexColors:!0,flatShading:!0});function pt(i){const t=i.map(n=>{const s=n.geometry,o=s.index===null?s:s.toNonIndexed();o!==s&&s.dispose(),o.deleteAttribute("uv");const r=o.getAttribute("position"),a=r.count,c=new Float32Array(a*3),l=new Wt;if(typeof n.color=="function")for(let d=0;d<a;d+=3){const g=(r.getX(d)+r.getX(d+1)+r.getX(d+2))/3,y=(r.getY(d)+r.getY(d+1)+r.getY(d+2))/3,m=(r.getZ(d)+r.getZ(d+1)+r.getZ(d+2))/3;l.set(n.color(g,y,m)),l.toArray(c,d*3),l.toArray(c,(d+1)*3),l.toArray(c,(d+2)*3)}else{l.set(n.color);for(let d=0;d<a;d++)l.toArray(c,d*3)}o.setAttribute("color",new He(c,3));const h=new Float32Array(a);if(typeof n.sway=="function")for(let d=0;d<a;d++)h[d]=Po(n.sway(r.getX(d),r.getY(d),r.getZ(d)));else n.sway&&h.fill(Po(n.sway));o.setAttribute(Xs,new He(h,1));const u=new Float32Array(a);if(typeof n.wear=="function")for(let d=0;d<a;d++)u[d]=Po(n.wear(r.getX(d),r.getY(d),r.getZ(d)));else n.wear&&u.fill(Po(n.wear));o.setAttribute(va,new He(u,1));const f=new Float32Array(a*3);if(n.wearTint!==void 0){l.set(n.wearTint);for(let d=0;d<a;d++)l.toArray(f,d*3)}return o.setAttribute(wa,new He(f,3)),o.getAttribute("normal")||o.computeVertexNormals(),o}),e=Qp(t,!1);for(const n of t)n.dispose();if(!e)throw new Error("assemble: geometries did not share an attribute set");return e}function _t(i,t,e){const n=$x[t]??0,s=i.getAttribute(Xs);if(s&&n!==1){const r=s.array;for(let a=0;a<r.length;a++)r[a]*=n;s.needsUpdate=!0}const o=new ne(i,Ih);return o.name=t,o.userData.swayPhase=e,Yx.has(t)&&(o.userData.clutter=!0),o.customDepthMaterial=em,o}function Ce(i,t,e=1.6){return(n,s)=>{const o=Po((s-i)/Math.max(t-i,1e-6));return(o*o*(3-2*o))**e}}function Po(i){return i>0?i<1?i:1:0}const Aa=256,jx=140,Jx=.16,Qx=.05,Ai=new mu(new Uint8Array(Aa),Aa,1,Wa,vn);Ai.minFilter=Fe;Ai.magFilter=Fe;Ai.wrapS=qn;Ai.wrapT=qn;Ai.needsUpdate=!0;const yi={gustField:{value:Ai},windDir:{value:new tt(1,0)},windLagScale:{value:0},windHalfSpan:{value:1},swayTime:{value:0},swayAmount:{value:1}},em=new Hp({depthPacking:Ep});let T0=!1;function tM(){if(T0)return;T0=!0,Lh=t=>{Object.assign(t.uniforms,yi),t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
        attribute float ${Xs};
        uniform sampler2D gustField;
        uniform vec2 windDir;
        uniform float windLagScale;
        uniform float windHalfSpan;
        uniform float swayTime;
        uniform float swayAmount;

        // A cheap hash, for the per-instance flutter offset. Two objects the
        // same distance downwind receive the same gust at the same moment,
        // which is correct — but they must not then flutter in lockstep, so
        // the fast component is offset by where the object stands.
        float swayHash(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        `).replace("#include <begin_vertex>",`#include <begin_vertex>
        {
          float weight = ${Xs} * swayAmount;
          if (weight > 0.0001) {
            // Where this vertex stands, and therefore when the gust reaches it.
            vec3 worldAt = (modelMatrix * vec4(transformed, 1.0)).xyz;
            float lag = dot(worldAt.xz, windDir) * windLagScale;
            // The window is centred on now, so upwind (negative lag) reads
            // ahead of the present and downwind reads behind it.
            float u = clamp(0.5 - lag / (2.0 * windHalfSpan), 0.0, 1.0);
            float strength = texture2D(gustField, vec2(u, 0.5)).r;

            // The wind, in this object's own space. Only Y rotation and a
            // uniform scale are ever used, so the inverse rotation is the
            // transpose over the scale squared — which avoids needing
            // inverse() or transpose(), neither of which exists in GLSL ES 1.
            vec3 c0 = modelMatrix[0].xyz;
            vec3 c1 = modelMatrix[1].xyz;
            vec3 c2 = modelMatrix[2].xyz;
            float scaleSq = max(dot(c0, c0), 0.0001);
            vec3 windWorld = vec3(windDir.x, 0.0, windDir.y);
            vec3 windObj =
              vec3(dot(c0, windWorld), dot(c1, windWorld), dot(c2, windWorld)) / scaleSq;
            vec3 crossObj = vec3(-windObj.z, 0.0, windObj.x);

            float offset = swayHash(floor(modelMatrix[3].xz * 4.0)) * 6.2831;

            // Two frequencies that do not divide evenly, so the pair never
            // visibly repeats. The slow one leans downwind and stays there —
            // wind pushes one way, and a symmetric sine reads as a metronome
            // rather than as a load.
            float lean = 0.62 + 0.38 * sin(swayTime * 1.1 + offset);
            float flutter = sin(swayTime * 3.7 + offset * 2.3);

            // Height is a factor, and it has to be. The sway weight is
            // relative to each plant's own height, so without this a daisy and
            // an oak move the same number of metres -- see BEND. Object-space
            // Y, taken before anything is displaced, which is the vertex's
            // height above its own base because every builder stands on y = 0.
            //
            // (No backticks anywhere in this shader source: it is a template
            // literal, and one would end it mid-GLSL.)
            float tall = max(transformed.y, 0.0);
            float push = weight * strength * tall;
            transformed += windObj * (push * lean * ${Jx.toFixed(3)})
                         + crossObj * (push * flutter * ${Qx.toFixed(3)});
          }
        }
        `)},Dh(Ih),Dh(em),Zx(Ih)}let Lh=null;function Dh(i){Lh&&(i.onBeforeCompile=Lh,i.defaultAttributeValues={...i.defaultAttributeValues,[Xs]:[0]},i.customProgramCacheKey=()=>"sway",i.needsUpdate=!0)}const eM=Ai.image.data;function nM(i,t){const{windDirection:e,frontSpeed:n,gustRate:s}=i.settings;yi.windDir.value.set(Math.cos(e),Math.sin(e));const o=s/Math.max(n,.5),r=jx*o;yi.windLagScale.value=o,yi.windHalfSpan.value=r,yi.swayTime.value=t;const a=i.phase;for(let c=0;c<Aa;c++){const l=c/(Aa-1),h=a+(l-.5)*2*r;eM[c]=Math.round(i.fieldAt(h)*255)}Ai.needsUpdate=!0}class iM extends Qo{pixelSize;normalEdgeStrength=.3;depthEdgeStrength=.4;time=0;effects=[];normalMaterial=new Ax;scene;camera;resolution=new tt;renderResolution=new tt;colourTarget;depthTexture;normalTarget;ping;edgeMaterial;blitMaterial;fsQuad;constructor(t,e,n){super(),this.pixelSize=t,this.scene=e,this.camera=n;const s=()=>{const o=new wn;return o.texture.minFilter=Oe,o.texture.magFilter=Oe,o.texture.type=Ei,o};this.colourTarget=s(),this.depthTexture=new pu(1,1),this.colourTarget.depthTexture=this.depthTexture,this.normalTarget=s(),this.ping=[s(),s()],this.edgeMaterial=sM(),this.blitMaterial=oM(),this.fsQuad=new to(this.edgeMaterial)}setSize(t,e){this.resolution.set(t,e),this.renderResolution.set(t/this.pixelSize|0,e/this.pixelSize|0);const{x:n,y:s}=this.renderResolution;this.colourTarget.setSize(n,s),this.normalTarget.setSize(n,s);for(const o of this.ping)o.setSize(n,s);for(const o of this.effects)o.setSize(n,s);this.edgeMaterial.uniforms.resolution.value.set(n,s,1/n,1/s)}setPixelSize(t){this.pixelSize=t,this.setSize(this.resolution.x,this.resolution.y)}render(t,e){t.setRenderTarget(this.colourTarget),t.render(this.scene,this.camera);const n=this.scene.overrideMaterial;t.setRenderTarget(this.normalTarget),this.scene.overrideMaterial=this.normalMaterial,t.render(this.scene,this.camera),this.scene.overrideMaterial=n;let s=this.colourTarget.texture,o=0;if(this.normalEdgeStrength>0||this.depthEdgeStrength>0){const r=this.edgeMaterial.uniforms;r.tDiffuse.value=s,r.tDepth.value=this.depthTexture,r.tNormal.value=this.normalTarget.texture,r.normalEdgeStrength.value=this.normalEdgeStrength,r.depthEdgeStrength.value=this.depthEdgeStrength,this.fsQuad.material=this.edgeMaterial,t.setRenderTarget(this.ping[0]),this.fsQuad.render(t),s=this.ping[0].texture,o=1}for(const r of this.effects){if(!r.enabled)continue;const a=this.ping[o];r.render(t,{colour:s,depth:this.depthTexture,normal:this.normalTarget.texture,write:a,camera:this.camera,size:this.renderResolution,scene:this.scene,time:this.time}),s=a.texture,o=1-o}this.blitMaterial.uniforms.tDiffuse.value=s,this.fsQuad.material=this.blitMaterial,this.renderToScreen?t.setRenderTarget(null):(t.setRenderTarget(e),this.clear&&t.clear()),this.fsQuad.render(t)}dispose(){this.colourTarget.dispose(),this.normalTarget.dispose();for(const t of this.ping)t.dispose();for(const t of this.effects)t.dispose();this.normalMaterial.dispose(),this.edgeMaterial.dispose(),this.blitMaterial.dispose(),this.fsQuad.dispose()}}function sM(){return new Te({uniforms:{tDiffuse:{value:null},tDepth:{value:null},tNormal:{value:null},resolution:{value:new le(1,1,1,1)},normalEdgeStrength:{value:0},depthEdgeStrength:{value:0}},vertexShader:`
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
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
        return texture2D(tDepth, vUv + vec2(x, y) * resolution.zw).r;
      }

      vec3 getNormal(int x, int y) {
        return texture2D(tNormal, vUv + vec2(x, y) * resolution.zw).rgb * 2.0 - 1.0;
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

        // Edge pixels should yield to faces whose normals are closer to the bias normal.
        vec3 normalEdgeBias = vec3(1., 1., 1.);
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
        vec4 texel = texture2D(tDiffuse, vUv);

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

        float strength = dei > 0.0 ? (1.0 - depthEdgeStrength * dei) : (1.0 + normalEdgeStrength * nei);

        gl_FragColor = texel * strength;
      }
    `})}function oM(){return new Te({uniforms:{tDiffuse:{value:null}},vertexShader:`
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform sampler2D tDiffuse;
      varying vec2 vUv;

      void main() {
        gl_FragColor = texture2D(tDiffuse, vUv);
      }
    `})}class rM{enabled=!0;strength=1;radius=.8;aoTarget;blurTarget;aoMaterial;blurMaterial;compositeMaterial;quad;fogNear=25;fogFar=140;constructor(){const t=()=>{const e=new wn;return e.texture.minFilter=Oe,e.texture.magFilter=Oe,e};this.aoTarget=t(),this.blurTarget=t(),this.aoMaterial=aM(),this.blurMaterial=cM(),this.compositeMaterial=lM(),this.quad=new to(this.aoMaterial)}setFog(t,e){this.fogNear=t,this.fogFar=e}setSize(t,e){this.aoTarget.setSize(t,e),this.blurTarget.setSize(t,e)}render(t,e){const{camera:n}=e,s=this.aoMaterial.uniforms;s.tDepth.value=e.depth,s.tNormal.value=e.normal,s.uProjInverse.value=n.projectionMatrixInverse,s.uProjScale.value=n.projectionMatrix.elements[5],s.uRadius.value=this.radius,s.uResolution.value.set(e.size.x,e.size.y,1/e.size.x,1/e.size.y),t.setRenderTarget(this.aoTarget),this.quad.material=this.aoMaterial,this.quad.render(t);const o=this.blurMaterial.uniforms;o.tDepth.value=e.depth,o.uNear.value=n.near,o.uFar.value=n.far,o.uTexel.value.set(1/e.size.x,1/e.size.y),this.quad.material=this.blurMaterial,o.tAO.value=this.aoTarget.texture,t.setRenderTarget(this.blurTarget),this.quad.render(t),o.tAO.value=this.blurTarget.texture,t.setRenderTarget(this.aoTarget),this.quad.render(t);const r=this.compositeMaterial.uniforms;r.tDiffuse.value=e.colour,r.tAO.value=this.aoTarget.texture,r.tDepth.value=e.depth,r.uNear.value=n.near,r.uFar.value=n.far,r.uFogNear.value=this.fogNear,r.uFogFar.value=this.fogFar,r.uStrength.value=this.strength,t.setRenderTarget(e.write),this.quad.material=this.compositeMaterial,this.quad.render(t)}dispose(){this.aoTarget.dispose(),this.blurTarget.dispose(),this.aoMaterial.dispose(),this.blurMaterial.dispose(),this.compositeMaterial.dispose(),this.quad.dispose()}}const bu=`
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;function aM(){return new Te({uniforms:{tDepth:{value:null},tNormal:{value:null},uProjInverse:{value:new fe},uProjScale:{value:1},uRadius:{value:.8},uResolution:{value:new le(1,1,1,1)}},vertexShader:bu,fragmentShader:`
      uniform sampler2D tDepth;
      uniform sampler2D tNormal;
      uniform mat4 uProjInverse;
      uniform float uProjScale;
      uniform float uRadius;
      uniform vec4 uResolution;
      varying vec2 vUv;

      #define SLICES 2
      #define STEPS 4
      #define PI 3.14159265
      #define HALF_PI 1.5707963

      // Interleaved gradient noise (Jimenez). Not a hash: neighbouring
      // pixels land on maximally different values, which is what lets the
      // 3x3 blurs downstream average a complete rotation set out of a small
      // neighbourhood. White noise here reads as grain no blur can fix.
      float gradientNoise(vec2 p) {
        return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y));
      }

      vec3 viewPosition(vec2 uv, float depth) {
        vec4 ndc = vec4(uv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
        vec4 p = uProjInverse * ndc;
        return p.xyz / p.w;
      }

      void main() {
        float depth = texture2D(tDepth, vUv).r;
        // Sky: nothing to occlude, and returning early keeps the far plane
        // out of every later calculation.
        if (depth >= 0.9999) {
          gl_FragColor = vec4(1.0);
          return;
        }

        vec3 P = viewPosition(vUv, depth);
        vec3 N = normalize(texture2D(tNormal, vUv).rgb * 2.0 - 1.0);
        vec3 V = normalize(-P);

        // The world radius on screen. Clamped: a wall against the camera
        // would otherwise march most of the frame for information the
        // falloff will throw away anyway.
        float radiusUv = min(uRadius * uProjScale * 0.5 / max(-P.z, 0.05), 0.35);

        float noise = gradientNoise(floor(gl_FragCoord.xy));
        float baseAngle = noise * PI;
        // The golden-ratio scramble decorrelates the step offset from the
        // rotation, so the two patterns do not reinforce into visible bands.
        float stepJitter = fract(noise * 61.803);

        float visibility = 0.0;
        // What the slices below would integrate to with nothing occluding
        // them. Accumulated alongside, because it is the denominator — see
        // the normalisation note after the loop.
        float open = 0.0;

        for (int slice = 0; slice < SLICES; slice++) {
          float angle = baseAngle + float(slice) * (PI / float(SLICES));
          vec2 dir2 = vec2(cos(angle), sin(angle));

          // The slice plane contains V and the screen direction. T is the
          // in-plane tangent, pointing the way +dir2 moves on screen.
          vec3 planeN = normalize(cross(vec3(dir2, 0.0), V));
          vec3 T = cross(V, planeN);

          // The surface normal projected into the slice plane, and its
          // signed angle from V — the GTAO reference frame.
          vec3 projected = N - planeN * dot(N, planeN);
          float projLen = length(projected);
          if (projLen < 1e-4) continue;
          vec3 pn = projected / projLen;
          float cosN = clamp(dot(pn, V), -1.0, 1.0);
          float n = sign(dot(pn, T)) * acos(cosN);

          // March both ways, tracking the highest horizon. The quadratic
          // falloff blends distant samples toward the open horizon, so the
          // radius is a soft reach rather than a hard window — and a sample
          // on the sky attenuates to nothing, which is the no-halo rule.
          float maxCos1 = -1.0;
          float maxCos2 = -1.0;
          for (int s = 0; s < STEPS; s++) {
            vec2 offset = dir2 * radiusUv * ((float(s) + stepJitter + 0.5) / float(STEPS));
            {
              vec2 uv = vUv + offset;
              vec3 D = viewPosition(uv, texture2D(tDepth, uv).r) - P;
              float dist2 = dot(D, D);
              float falloff = clamp(1.0 - dist2 / (uRadius * uRadius), 0.0, 1.0);
              float c = dot(D, V) * inversesqrt(max(dist2, 1e-6));
              maxCos2 = max(maxCos2, mix(-1.0, c, falloff));
            }
            {
              vec2 uv = vUv - offset;
              vec3 D = viewPosition(uv, texture2D(tDepth, uv).r) - P;
              float dist2 = dot(D, D);
              float falloff = clamp(1.0 - dist2 / (uRadius * uRadius), 0.0, 1.0);
              float c = dot(D, V) * inversesqrt(max(dist2, 1e-6));
              maxCos1 = max(maxCos1, mix(-1.0, c, falloff));
            }
          }

          // Horizon angles about V, clamped to the hemisphere around the
          // projected normal, then the analytic cosine-weighted arc.
          float h1 = n + max(-acos(clamp(maxCos1, -1.0, 1.0)) - n, -HALF_PI);
          float h2 = n + min(acos(clamp(maxCos2, -1.0, 1.0)) - n, HALF_PI);
          float arc1 = -cos(2.0 * h1 - n) + cosN + 2.0 * h1 * sin(n);
          float arc2 = -cos(2.0 * h2 - n) + cosN + 2.0 * h2 * sin(n);
          visibility += projLen * 0.25 * (arc1 + arc2);
          // The same integral with both horizons on the tangent plane, which
          // is what h1 and h2 collapse to when nothing occludes: substituting
          // n ± HALF_PI above reduces the whole expression to this.
          open += projLen * (cosN + n * sin(n));
        }

        // **Normalised against the unoccluded response, not the slice count.**
        // An open slice does not integrate to 1 — it integrates to
        // cos(n) + n sin(n), which is 1 only when the surface faces the camera
        // squarely and climbs above it as the surface tilts away. Dividing by
        // SLICES therefore discards visibility in proportion to how obliquely
        // the surface is seen: 3% at 40 degrees off the view axis. Small, but
        // its contours are circles centred on the optical axis, and a 16-level
        // quantizer downstream turns a smooth 3% ramp into one hard ring that
        // slides across a near wall as the camera turns. Note this is a
        // normalisation error, not a sampling one — more slices do not fix it.
        //
        // Dividing by the accumulated open response is exact for a flat
        // surface at any angle, and it also drops the slices skipped above
        // out of the denominator instead of counting them as fully occluded.
        visibility = open > 1e-4 ? clamp(visibility / open, 0.0, 1.0) : 1.0;
        gl_FragColor = vec4(vec3(visibility), 1.0);
      }
    `})}function cM(){return new Te({uniforms:{tAO:{value:null},tDepth:{value:null},uNear:{value:.1},uFar:{value:500},uTexel:{value:new tt(1,1)}},vertexShader:bu,fragmentShader:`
      uniform sampler2D tAO;
      uniform sampler2D tDepth;
      uniform float uNear;
      uniform float uFar;
      uniform vec2 uTexel;
      varying vec2 vUv;

      float viewDepth(vec2 uv) {
        float d = texture2D(tDepth, uv).r;
        // perspectiveDepthToViewZ, negated to metres in front of the camera.
        return -(uNear * uFar) / ((uFar - uNear) * d - uFar);
      }

      void main() {
        float centre = viewDepth(vUv);
        // **The tolerance is a fraction of distance, not a fixed number of
        // metres.** An absolute threshold looks correct and fails exactly
        // where it is needed most: a floor viewed at a grazing angle changes
        // depth fast from pixel to pixel, so every neighbour reads as "across
        // a silhouette", the blur rejects them all, and the raw noise stands
        // untouched on the one surface the player is always looking at. A
        // relative tolerance follows the surface instead of fighting it.
        float tolerance = max(centre * 0.03, 0.02);
        float total = 0.0;
        float weightSum = 0.0;
        for (int x = -1; x <= 1; x++) {
          for (int y = -1; y <= 1; y++) {
            vec2 uv = vUv + vec2(x, y) * uTexel;
            // Still depth-aware: a neighbour genuinely across a silhouette
            // contributes nothing, so the blur softens noise without bleeding
            // a wall's darkness onto the sky behind it.
            float weight = exp(-abs(viewDepth(uv) - centre) / tolerance);
            total += texture2D(tAO, uv).r * weight;
            weightSum += weight;
          }
        }
        gl_FragColor = vec4(vec3(total / max(weightSum, 1e-4)), 1.0);
      }
    `})}function lM(){return new Te({uniforms:{tDiffuse:{value:null},tAO:{value:null},tDepth:{value:null},uNear:{value:.1},uFar:{value:500},uFogNear:{value:25},uFogFar:{value:140},uStrength:{value:1}},vertexShader:bu,fragmentShader:`
      uniform sampler2D tDiffuse;
      uniform sampler2D tAO;
      uniform sampler2D tDepth;
      uniform float uNear;
      uniform float uFar;
      uniform float uFogNear;
      uniform float uFogFar;
      uniform float uStrength;
      varying vec2 vUv;

      void main() {
        vec4 colour = texture2D(tDiffuse, vUv);
        float ao = texture2D(tAO, vUv).r;

        // The same fog the materials applied — smoothstep, exactly as
        // three's linear fog chunk computes it, because AO multiplied on
        // after fog would darken the haze itself. Its strength fades out as
        // the fog fades in.
        float d = texture2D(tDepth, vUv).r;
        float dist = -(uNear * uFar) / ((uFar - uNear) * d - uFar);
        float fogAmount = smoothstep(uFogNear, uFogFar, dist);

        colour.rgb *= mix(1.0, ao, uStrength * (1.0 - fogAmount));
        gl_FragColor = colour;
      }
    `})}function wt(i){let t=i>>>0||2654435769;t=Math.imul(t^t>>>16,73244475),t=Math.imul(t^t>>>16,73244475),t=(t^t>>>16)>>>0;const e=()=>{t=t+1831565813>>>0;let s=t;return s=Math.imul(s^s>>>15,s|1),s^=s+Math.imul(s^s>>>7,s|61),((s^s>>>14)>>>0)/4294967296},n=e;return n.range=(s,o)=>s+e()*(o-s),n.int=(s,o)=>Math.floor(s+e()*(o-s+1)),n.chance=s=>e()<s,n.pick=s=>s[Math.floor(e()*s.length)],n.around=(s,o)=>s+(e()*2-1)*o,n}const hM=`
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
`,Io=64;let Bn=null;function uM(){if(Bn!==null)return Bn;const i=wt(24332),t=new Uint8Array(Io*Io);for(let e=0;e<t.length;e++)t[e]=Math.floor(i()*256);return Bn=new mu(t,Io,Io,Wa,vn),Bn.minFilter=Fe,Bn.magFilter=Fe,Bn.wrapS=Yi,Bn.wrapT=Yi,Bn.needsUpdate=!0,Bn}const dM=`
  uniform sampler2D uNoise;

  float noiseSlice(vec2 billows, float slice) {
    // Billows to UV: one texel per billow. The wrap is what decorrelates one
    // slice from the next — the texture repeats, so an irrational-looking
    // offset lands somewhere unrelated in it.
    vec2 uv = billows / ${Io.toFixed(1)};
    vec2 offset = vec2(slice * 0.1371, slice * 0.3793);
    return texture2D(uNoise, uv + offset).r;
  }

  float volumeNoise(vec3 p) {
    float slice = floor(p.y);
    // Smoothstep between slices for the same reason the sky's value noise
    // smoothsteps between cells: linear blending creases at every boundary,
    // and here the creases would be level horizontal planes, which is the one
    // artifact a mist pool cannot get away with.
    float blend = fract(p.y);
    blend = blend * blend * (3.0 - 2.0 * blend);
    return mix(noiseSlice(p.xz, slice), noiseSlice(p.xz, slice + 1.0), blend);
  }

  // Three octaves rather than the sky's five. This is sampled eight times per
  // volume per pixel instead of once, and at chunky resolution under a
  // halftone the fourth octave is not visible enough to pay for.
  float volumeFbm(vec3 p) {
    float sum = 0.0;
    float amplitude = 0.5;
    float total = 0.0;
    for (int i = 0; i < 3; i++) {
      sum += amplitude * volumeNoise(p);
      total += amplitude;
      p *= 2.0;
      amplitude *= 0.5;
    }
    // Normalised to 0..1. The sky's fbm does not bother, because its output
    // feeds a threshold that was tuned against whatever range it happened to
    // produce; density here is authored in real units and has to mean the
    // same thing whatever the octave count is.
    return sum / total;
  }
`,bn=8,A0=8;class fM{enabled=!1;volumes=[];material;quad;tint=new Wt;inverseProjectionView=new fe;constructor(){this.material=pM(),this.quad=new to(this.material)}setVolumes(t){this.volumes=t.slice(0,bn);const e=this.material.uniforms;e.uCount.value=this.volumes.length;for(let n=0;n<this.volumes.length;n++){const s=this.volumes[n];e.uCentre.value[n].set(s.center.x,s.center.y,s.center.z,s.density),e.uSize.value[n].set(Math.max(s.size.x,.001),Math.max(s.size.y,.001),Math.max(s.size.z,.001),Oo.clamp(s.softness,.01,1)),this.tint.set(s.tint),e.uTint.value[n].set(this.tint.r,this.tint.g,this.tint.b,Math.max(s.noiseScale,.01)),e.uDrift.value[n].set(0,0,Oo.clamp(s.turbulence,0,1),s.shape==="box"?1:0)}}get hasVolumes(){return this.volumes.length>0}setSize(){}render(t,e){const{camera:n}=e,s=this.material.uniforms;s.tDiffuse.value=e.colour,s.tDepth.value=e.depth,s.uTime.value=e.time,this.inverseProjectionView.copy(n.projectionMatrix).multiply(n.matrixWorldInverse).invert(),s.uInverseProjectionView.value.copy(this.inverseProjectionView),s.uCameraPosition.value.setFromMatrixPosition(n.matrixWorld),s.uFar.value=n.far;const o=yi.windDir.value;for(let r=0;r<this.volumes.length;r++){const a=this.volumes[r].drift,c=s.uDrift.value[r];c.x=a?.x??o.x,c.y=a?.y??o.y}t.setRenderTarget(e.write),this.quad.render(t)}dispose(){this.material.dispose(),this.quad.dispose()}}function Or(i){return Array.from({length:i},()=>new le)}function pM(){return new Te({uniforms:{tDiffuse:{value:null},tDepth:{value:null},uNoise:{value:uM()},uCount:{value:0},uCentre:{value:Or(bn)},uSize:{value:Or(bn)},uTint:{value:Or(bn)},uDrift:{value:Or(bn)},uInverseProjectionView:{value:new fe},uCameraPosition:{value:new C},uFar:{value:500},uTime:{value:0}},vertexShader:`
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform sampler2D tDiffuse;
      uniform sampler2D tDepth;
      uniform int uCount;
      uniform vec4 uCentre[${bn}];
      uniform vec4 uSize[${bn}];
      uniform vec4 uTint[${bn}];
      uniform vec4 uDrift[${bn}];
      uniform mat4 uInverseProjectionView;
      uniform vec3 uCameraPosition;
      uniform float uFar;
      uniform float uTime;
      varying vec2 vUv;

      ${dM}

      // Interleaved gradient noise, the same one GTAO rotates its slices by
      // and for a related reason: neighbouring pixels get maximally different
      // offsets, so the eight steps of one pixel interleave with its
      // neighbours' rather than lining up into shells.
      float gradientNoise(vec2 p) {
        return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y));
      }

      // Nudged off zero, keeping its sign.
      //
      // The slab test below divides by the ray direction, and a ray parallel to
      // one of a box's axes has a zero component. The usual answer is to let it
      // divide by zero and rely on the infinities cancelling in the min/max —
      // which works on most hardware and is *undefined* in GLSL ES, so "most"
      // is the whole problem: it would be a box that renders as garbage on one
      // driver and correctly everywhere it was tested.
      float nonzero(float v) {
        return v >= 0.0 ? max(v, 1e-6) : min(v, -1e-6);
      }

      void main() {
        vec4 colour = texture2D(tDiffuse, vUv);
        if (uCount == 0) {
          gl_FragColor = colour;
          return;
        }

        // The world ray, and where the scene stops it — both by unprojecting
        // clip space rather than by reconstructing a direction from the field
        // of view and converting axis depth to ray depth with a cosine. The
        // unprojection is two matrix multiplies and is *correct by
        // construction*: tScene comes out as a distance along the ray
        // already, because it is the length of a difference of two world
        // points, and there is no axis-versus-ray confusion left to get wrong.
        vec2 ndc = vUv * 2.0 - 1.0;
        vec3 origin = uCameraPosition;
        vec4 farPoint = uInverseProjectionView * vec4(ndc, 1.0, 1.0);
        vec3 direction = normalize(farPoint.xyz / farPoint.w - origin);

        float depth = texture2D(tDepth, vUv).r;
        float tScene;
        if (depth >= 0.9999) {
          // Sky: nothing stops the ray. The far plane rather than infinity, so
          // a bank standing against the horizon still has a back to it.
          tScene = uFar;
        } else {
          vec4 hit = uInverseProjectionView * vec4(ndc, depth * 2.0 - 1.0, 1.0);
          tScene = length(hit.xyz / hit.w - origin);
        }

        float jitter = gradientNoise(floor(gl_FragCoord.xy));

        vec3 scattered = vec3(0.0);
        float transmittance = 1.0;

        for (int i = 0; i < ${bn}; i++) {
          if (i >= uCount) break;
          if (transmittance < 0.01) break;

          vec3 centre = uCentre[i].xyz;
          float density = uCentre[i].w;
          vec3 size = uSize[i].xyz;
          float softness = uSize[i].w;
          vec3 tint = uTint[i].rgb;
          float noiseScale = uTint[i].w;
          float turbulence = uDrift[i].z;
          bool isBox = uDrift[i].w > 0.5;

          // Into the volume's own space, where an ellipsoid is a unit sphere
          // and a box is a unit cube. Scaling the direction by the same
          // extents leaves t in world metres, which is what the density and
          // the step length are authored in.
          vec3 p = (origin - centre) / size;
          vec3 d = direction / size;

          float t0;
          float t1;
          if (isBox) {
            // Slab test, over a direction guaranteed to have no zero component
            // — see nonzero above for why that is not paranoia.
            vec3 inv = 1.0 / vec3(nonzero(d.x), nonzero(d.y), nonzero(d.z));
            vec3 a = (-1.0 - p) * inv;
            vec3 b = (1.0 - p) * inv;
            vec3 lo = min(a, b);
            vec3 hi = max(a, b);
            t0 = max(max(lo.x, lo.y), lo.z);
            t1 = min(min(hi.x, hi.y), hi.z);
          } else {
            float A = dot(d, d);
            float B = 2.0 * dot(p, d);
            float C = dot(p, p) - 1.0;
            float disc = B * B - 4.0 * A * C;
            if (disc < 0.0) continue;
            float root = sqrt(disc);
            t0 = (-B - root) / (2.0 * A);
            t1 = (-B + root) / (2.0 * A);
          }

          // Clipped to the camera in front and the scene behind, which is what
          // puts a pillar *in* the mist and lets the player walk *into* the
          // bank rather than either being a backdrop.
          t0 = max(t0, 0.0);
          t1 = min(t1, tScene);
          if (t1 <= t0) continue;

          float span = t1 - t0;
          float dt = span / float(${A0});
          // Already resolved on the way in: a volume with no authored drift
          // arrives carrying the wind. See the render method above.
          vec2 drift = uDrift[i].xy;
          vec3 flow = vec3(drift.x, 0.0, drift.y) * uTime;

          for (int s = 0; s < ${A0}; s++) {
            vec3 world = origin + direction * (t0 + (float(s) + jitter) * dt);
            vec3 local = (world - centre) / size;

            // Distance to the shell, in the volume's own units: 1 at the
            // surface, 0 at the centre. A box measures it on its longest axis,
            // which is what feathers its corners rather than its faces.
            float edge = isBox
              ? max(max(abs(local.x), abs(local.y)), abs(local.z))
              : length(local);
            // Feathered inward from the shell so no volume ever shows its own
            // geometric edge.
            float fade = 1.0 - smoothstep(1.0 - softness, 1.0, edge);
            if (fade <= 0.0) continue;

            float shaped = mix(
              1.0,
              volumeFbm((world + flow) / noiseScale),
              turbulence
            );

            // Beer-Lambert over the step. Emission is the tint, weighted by
            // how much of the step is actually absorbing.
            float alpha = 1.0 - exp(-density * fade * shaped * dt);
            scattered += tint * alpha * transmittance;
            transmittance *= 1.0 - alpha;
            if (transmittance < 0.01) break;
          }
        }

        gl_FragColor = vec4(colour.rgb * transmittance + scattered, colour.a);
      }
    `})}const nm=1,im=2,di=3;class mM{enabled=!1;strength=1;radius=1;emitters;down=[];up=[];downMaterial;upMaterial;compositeMaterial;quad;priorClear=new Wt;priorMask=1;constructor(){this.emitters=Bc();for(let t=0;t<di;t++)this.down.push(Bc());for(let t=0;t<di-1;t++)this.up.push(Bc());this.downMaterial=gM(),this.upMaterial=yM(),this.compositeMaterial=vM(),this.quad=new to(this.downMaterial)}setSize(t,e){this.emitters.setSize(t,e);for(let n=0;n<di;n++){const s=2**(n+1),o=Math.max(1,Math.floor(t/s)),r=Math.max(1,Math.floor(e/s));this.down[n].setSize(o,r),n<di-1&&this.up[n].setSize(o,r)}}render(t,e){this.renderEmitters(t,e),this.quad.material=this.downMaterial;let n=this.emitters.texture,s=e.size.x,o=e.size.y;for(let a=0;a<di;a++){const c=this.down[a];this.downMaterial.uniforms.tDiffuse.value=n,this.downMaterial.uniforms.uHalfTexel.value.set(.5*this.radius/s,.5*this.radius/o),this.downMaterial.uniforms.uKaris.value=a===0?1:0,t.setRenderTarget(c),this.quad.render(t),n=c.texture,s=c.width,o=c.height}this.quad.material=this.upMaterial;for(let a=di-2;a>=0;a--){const c=a===di-2?this.down[di-1]:this.up[a+1];this.upMaterial.uniforms.tSource.value=c.texture,this.upMaterial.uniforms.tPrevious.value=this.down[a].texture,this.upMaterial.uniforms.uHalfTexel.value.set(.5*this.radius/c.width,.5*this.radius/c.height),t.setRenderTarget(this.up[a]),this.quad.render(t)}const r=this.compositeMaterial.uniforms;r.tDiffuse.value=e.colour,r.tBloom.value=this.up[0].texture,r.uStrength.value=this.strength,t.setRenderTarget(e.write),this.quad.material=this.compositeMaterial,this.quad.render(t)}renderEmitters(t,e){const{camera:n,scene:s}=e;this.emitters.depthTexture!==e.depth&&(this.emitters.depthTexture=e.depth,this.emitters.dispose());const o=t.autoClear,r=t.getClearAlpha();t.getClearColor(this.priorClear),this.priorMask=n.layers.mask,t.setRenderTarget(this.emitters),t.autoClear=!1,t.setClearColor(0,1),t.clearColor(),n.layers.set(im),t.render(s,n),n.layers.mask=this.priorMask,t.setClearColor(this.priorClear,r),t.autoClear=o}dispose(){this.emitters.dispose();for(const t of this.down)t.dispose();for(const t of this.up)t.dispose();this.downMaterial.dispose(),this.upMaterial.dispose(),this.compositeMaterial.dispose(),this.quad.dispose()}}function Bc(){const i=new wn(1,1);return i.texture.minFilter=Fe,i.texture.magFilter=Fe,i.texture.type=Ei,i}const Su=`
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;function gM(){return new Te({uniforms:{tDiffuse:{value:null},uHalfTexel:{value:new tt},uKaris:{value:0}},vertexShader:Su,fragmentShader:`
      uniform sampler2D tDiffuse;
      uniform vec2 uHalfTexel;
      uniform float uKaris;
      varying vec2 vUv;

      // **Karis average: weight each tap by the reciprocal of its brightness.**
      //
      // The other half of the flicker story. A blur is a mean, and a mean is
      // dominated by its largest term — so one texel far brighter than its
      // neighbours decides the result of every downsample it survives into, and
      // whether it survives depends on where it lands on the next grid down. At
      // an eighth resolution a single-texel flame is exactly that texel, and it
      // winks in and out as the camera moves.
      //
      // Weighting by 1/(1+luma) puts a very bright tap and a moderate one on
      // nearly the same footing, so the neighbourhood decides the result
      // instead of the outlier, and crossing a boundary stops mattering.
      //
      // First level only. After it the fireflies are already averaged away, and
      // applying this again would just flatten the falloff the bloom is for.
      float weigh(vec3 colour) {
        float luma = dot(colour, vec3(0.2126, 0.7152, 0.0722));
        return mix(1.0, 1.0 / (1.0 + luma), uKaris);
      }

      void main() {
        // Every tap sits half a texel off centre, so the bilinear filter
        // returns the average of the four texels around it — see the note in
        // the render loop on why a whole texel is the bug this replaced.
        vec4 c0 = texture2D(tDiffuse, vUv);
        vec4 c1 = texture2D(tDiffuse, vUv + vec2(-uHalfTexel.x, -uHalfTexel.y));
        vec4 c2 = texture2D(tDiffuse, vUv + vec2( uHalfTexel.x, -uHalfTexel.y));
        vec4 c3 = texture2D(tDiffuse, vUv + vec2(-uHalfTexel.x,  uHalfTexel.y));
        vec4 c4 = texture2D(tDiffuse, vUv + vec2( uHalfTexel.x,  uHalfTexel.y));

        float w0 = 4.0 * weigh(c0.rgb);
        float w1 = weigh(c1.rgb);
        float w2 = weigh(c2.rgb);
        float w3 = weigh(c3.rgb);
        float w4 = weigh(c4.rgb);

        vec4 sum = c0 * w0 + c1 * w1 + c2 * w2 + c3 * w3 + c4 * w4;
        gl_FragColor = sum / max(w0 + w1 + w2 + w3 + w4, 1e-4);
      }
    `})}function yM(){return new Te({uniforms:{tSource:{value:null},tPrevious:{value:null},uHalfTexel:{value:new tt}},vertexShader:Su,fragmentShader:`
      uniform sampler2D tSource;
      uniform sampler2D tPrevious;
      uniform vec2 uHalfTexel;
      varying vec2 vUv;

      void main() {
        vec4 sum = texture2D(tSource, vUv + vec2(-uHalfTexel.x * 2.0, 0.0));
        sum += texture2D(tSource, vUv + vec2(-uHalfTexel.x, uHalfTexel.y)) * 2.0;
        sum += texture2D(tSource, vUv + vec2(0.0, uHalfTexel.y * 2.0));
        sum += texture2D(tSource, vUv + vec2(uHalfTexel.x, uHalfTexel.y)) * 2.0;
        sum += texture2D(tSource, vUv + vec2(uHalfTexel.x * 2.0, 0.0));
        sum += texture2D(tSource, vUv + vec2(uHalfTexel.x, -uHalfTexel.y)) * 2.0;
        sum += texture2D(tSource, vUv + vec2(0.0, -uHalfTexel.y * 2.0));
        sum += texture2D(tSource, vUv + vec2(-uHalfTexel.x, -uHalfTexel.y)) * 2.0;
        gl_FragColor = sum / 12.0 + texture2D(tPrevious, vUv);
      }
    `})}function vM(){return new Te({uniforms:{tDiffuse:{value:null},tBloom:{value:null},uStrength:{value:1}},vertexShader:Su,fragmentShader:`
      uniform sampler2D tDiffuse;
      uniform sampler2D tBloom;
      uniform float uStrength;
      varying vec2 vUv;

      void main() {
        vec4 colour = texture2D(tDiffuse, vUv);
        // Additive, and in linear light, because this is light being added to
        // a scene rather than a screen effect being mixed over a picture.
        // Alpha is the scene's — the bloom contributes brightness, not cover.
        colour.rgb += texture2D(tBloom, vUv).rgb * uStrength;
        gl_FragColor = colour;
      }
    `})}const wM={off:0,protanopia:1,deuteranopia:2,tritanopia:3},_M={name:"RetroShader",uniforms:{tDiffuse:{value:null},uPixelSize:{value:1},uDitherScale:{value:1.65},uPeriod:{value:3},uQuantize:{value:1},uLevels:{value:16},uVignette:{value:.35},uVignetteRadius:{value:.55},uVignetteSoftness:{value:.6},uColorblind:{value:0},uColorblindStrength:{value:1}},vertexShader:`
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float uPixelSize;
    uniform float uDitherScale;
    uniform float uPeriod;
    uniform int uQuantize;
    uniform float uLevels;
    uniform float uVignette;
    uniform float uVignetteRadius;
    uniform float uVignetteSoftness;
    uniform int uColorblind;
    uniform float uColorblindStrength;

    varying vec2 vUv;

    /**
     * Colour vision deficiency **correction**, not simulation.
     *
     * The distinction matters and it is the whole design of this block. A
     * simulation shows a player with normal vision what a player without it
     * sees; it is a tool for the person making the game. What the person
     * playing needs is the opposite — the information their eye cannot
     * separate moved into channels it can — and that is what happens here.
     * Turning it on should make more of the world legible, not less.
     *
     * Correction still needs simulation inside it, and that is the whole
     * method: predict what the deficient eye receives, subtract it from what
     * was sent, and the remainder is precisely the information that was lost.
     * Push that into the channels that still work.
     *
     * ## Two things this gets right that most implementations do not
     *
     * (No backticks anywhere below: this is a template literal, and one would
     * end it mid-GLSL. The same note is on the sway patch, for the same
     * reason, after making the same mistake.)
     *
     * **It runs in linear light.** The widely-copied shader — Fidaner, Lin &
     * Ozguven's, which is where the 17.8824 / 43.5161 cone matrix in every
     * daltonize snippet comes from — applies those matrices straight to
     * gamma-encoded values. Cone response is linear in light and sRGB is not,
     * so the matrices are being fed numbers that are not what they describe;
     * DaltonLens measured the result and a whole range of colours comes out
     * far too dark. This pass runs *after* OutputPass, so it is handed sRGB
     * and has to decode, work, and re-encode. Three pow calls each way, only
     * when the filter is on.
     *
     * **Tritanopia uses two half-planes.** The single-matrix projection
     * everyone uses is Viénot 1999, and its own authors say it is only valid
     * for protanopia and deuteranopia — the blue axis needs Brettel 1997,
     * where the surviving colours form *two* half-planes meeting along the
     * neutral axis and which one a colour belongs to is decided per pixel.
     * Using one plane for tritanopia is not a small error; it is wrong on
     * roughly half the gamut. All three types use Brettel here, because once
     * the branch exists there is no reason to keep a second code path that is
     * only nearly as good.
     *
     * Constants are libDaltonLens's, which derive them from Smith & Pokorny
     * cone fundamentals — the ones the original perceptual experiments were
     * run against.
     */
    vec3 srgbToLinear(vec3 c) {
      return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(vec3(0.04045), c));
    }

    vec3 linearToSrgb(vec3 c) {
      return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
    }

    /**
     * What a dichromat's eye receives, given linear RGB.
     *
     * The plane is chosen by which side of a separating plane the colour falls
     * on — that is the sign test below, and it is the entire difference
     * between Brettel and the single-matrix approximations.
     */
    vec3 simulate(vec3 c) {
      vec3 normal;
      mat3 planeA;
      mat3 planeB;

      // **Transposed from how they are published.** A mat3 built from nine
      // floats fills its *columns* in order, and every source writes these
      // out as rows — so each group of three below is one column of the
      // published matrix, not one row of it. Getting this backwards still
      // compiles and still produces a colour, which is the worst kind of
      // wrong: it looks like a filter doing something.
      if (uColorblind == 1) {
        normal = vec3(0.00048, 0.00393, -0.00441);
        planeA = mat3(0.14980, 0.10764, 0.00384, 1.19548, 0.84864, -0.00540, -0.34528, 0.04372, 1.00156);
        planeB = mat3(0.14570, 0.10816, 0.00386, 1.16172, 0.85291, -0.00524, -0.30742, 0.03892, 1.00139);
      } else if (uColorblind == 2) {
        normal = vec3(-0.00281, -0.00611, 0.00892);
        planeA = mat3(0.36477, 0.26294, -0.02006, 0.86381, 0.64245, 0.02728, -0.22858, 0.09462, 0.99278);
        planeB = mat3(0.37298, 0.25954, -0.01980, 0.88166, 0.63506, 0.02784, -0.25464, 0.10540, 0.99196);
      } else {
        normal = vec3(0.03901, -0.02788, -0.01113);
        planeA = mat3(1.01277, -0.01243, 0.07589, 0.13548, 0.86812, 0.80500, -0.14826, 0.14431, 0.11911);
        planeB = mat3(0.93678, 0.06154, -0.37562, 0.18979, 0.81526, 1.12767, -0.12657, 0.12320, 0.24796);
      }

      return dot(c, normal) >= 0.0 ? planeA * c : planeB * c;
    }

    /**
     * The corrected colour, given sRGB in and sRGB out.
     */
    vec3 correctColour(vec3 srgb) {
      vec3 linear = srgbToLinear(clamp(srgb, 0.0, 1.0));
      vec3 error = linear - simulate(linear);

      // Where the lost information goes.
      //
      // There is no canonical answer to this half — the simulation is settled
      // science and the redistribution is a design choice, since it is asking
      // what to do with information the eye cannot receive at all. These are
      // the long-standing daltonize weights: a red-green deficiency has its
      // red error spread into green and blue, which are the axes still being
      // read.
      //
      // Blue-yellow is the mirror, and has to be. The same matrix used for all
      // three would push a blue error back into blue — handing it to the cone
      // that cannot read it, so the correction corrects nothing while looking
      // like it is doing something.
      vec3 shift = uColorblind == 3
        ? vec3(error.r + 0.7 * error.b, error.g + 0.7 * error.b, 0.0)
        : vec3(0.0, 0.7 * error.r + error.g, 0.7 * error.r + error.b);

      return linearToSrgb(clamp(linear + shift, 0.0, 1.0));
    }

    /**
     * Clustered-dot halftone: the classic rotated cosine spot function, whose
     * level sets are round through the middle of the range and square off
     * towards the ends.
     *
     * Rotated 45 degrees because that is where a print screen sits — square to
     * the pixel grid it beats against the pixelation and reads as a plaid.
     *
     * Honestly caveated: the tone response is exact at the mid-point and
     * compressed at both extremes, because a growing dot covers area slowly at
     * first and then has only the corners left to fill at the end. Every
     * halftone has this. It is why the levels count is high — at five, the
     * compression lands on the few tones there are and the whole thing reads
     * as a coarse repeating tile.
     */
    float halftone(vec2 cell, float period) {
      vec2 q = vec2(cell.x + cell.y, cell.x - cell.y) * 0.70710678 / period;
      return 0.5 - 0.25 * (cos(6.2831853 * q.x) + cos(6.2831853 * q.y));
    }

    /**
     * Quantizes to N levels per channel, dithering **in linear light**.
     *
     * The old form added the threshold to the colour and rounded. That is
     * wrong in a way that is easy to miss and affects every pixel in the game:
     * the eye and the display average two adjacent chunky pixels in *linear*
     * light, but this pass runs after OutputPass on display-referred sRGB. A
     * half-and-half dither between 0 and 1 therefore reads as 0.73, not as
     * 0.5, so every tone between two levels came out too bright — at five
     * levels, the middle of the first band was 41% high.
     *
     * So instead of nudging and rounding: find the two levels the colour falls
     * between, and solve for the *proportion* of the brighter one whose linear
     * average is the colour asked for. That proportion is the threshold to
     * compare against. Gamma 2.0 (c * c) rather than the exact sRGB curve —
     * visually indistinguishable here, three multiplies instead of a pow
     * chain, and it moves a ratio rather than a decision.
     *
     * uDitherScale is how many quantization steps the dither spreads across.
     * At 1 the whole gap dithers and every tone is reproduced exactly. Below
     * 1 the ends of each band go flat and some banding survives on purpose.
     * Above 1 nothing is ever flat, which is what keeps the dots visible as a
     * texture rather than only at the band boundaries.
     */
    vec3 quantizeLevels(vec3 colour, float threshold) {
      float steps = max(uLevels - 1.0, 1.0);

      vec3 scaled = clamp(colour, 0.0, 1.0) * steps;
      // At pure white the colour sits exactly on the top level and would name
      // a bracket one past the end; back it off so the pair is always real.
      vec3 lower = min(floor(scaled), vec3(steps - 1.0));

      vec3 low = lower / steps;
      vec3 high = (lower + 1.0) / steps;

      vec3 a = low * low;
      vec3 b = high * high;
      vec3 target = colour * colour;
      vec3 ratio = clamp((target - a) / max(b - a, vec3(1e-6)), 0.0, 1.0);

      // Spread the transition over uDitherScale of a step, centred on the
      // half-way point, so the knob widens or narrows the dithered band
      // without moving where it sits.
      ratio = clamp((ratio - 0.5) / max(uDitherScale, 0.001) + 0.5, 0.0, 1.0);

      return mix(low, high, step(vec3(threshold), ratio));
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

      // **Before the quantizer, not after.** The correction moves colours by
      // small amounts, and doing it last would move them off the levels the
      // dither is resolving between — the halftone would still be there but it
      // would no longer be dithering toward anything, and flat faces would
      // come back banded. Corrected first, the output is still exactly the
      // sixteen levels per channel the look is built on.
      if (uColorblind != 0) {
        colour = mix(colour, correctColour(colour), clamp(uColorblindStrength, 0.0, 1.0));
      }

      if (uQuantize == 1) {
        // One threshold value per chunky pixel, not per screen pixel. It has
        // to be: every device pixel inside a chunky block carries the same
        // colour, so a threshold that varied within the block would dither
        // *inside* it and dissolve the pixelation. The consequence is that the
        // dot cell is counted in chunky pixels, and its size on screen is
        // therefore uPeriod times uPixelSize.
        vec2 cell = gl_FragCoord.xy / max(uPixelSize, 1.0);
        colour = quantizeLevels(colour, halftone(cell, max(uPeriod, 2.0)));
      }

      gl_FragColor = vec4(clamp(colour, 0.0, 1.0), texel.a);
    }
  `},xM=400,Hc={uniforms:{uHorizon:{value:new Wt},uZenith:{value:new Wt},uGround:{value:new Wt},uCurve:{value:1},uCloudColor:{value:new Wt},uCloudCover:{value:.5},uCloudSoftness:{value:.2},uCloudScale:{value:1.2},uCloudOpacity:{value:1},uCloudDrift:{value:.01},uTime:{value:0},uSunDirection:{value:new C(0,1,0)},uSunColor:{value:new Wt},uSunSize:{value:.9993},uSunGlow:{value:260},uSunIntensity:{value:1}},vertexShader:`
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

    // Lifted into engine/noise when the fog volumes wanted the same functions.
    // Verbatim, so the clouds are the clouds they were tuned to be. (No
    // backticks in this comment either, for the reason given below.)
    ${hM}

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
  `},sm={horizon:"#bcd4e6",zenith:"#3f7fbf",ground:"#5d6469",curve:.35,cloudColor:"#f2f5f8",cloudCover:.5,cloudSoftness:.22,cloudScale:1.1,cloudOpacity:.95,cloudDrift:.012,sun:!0,sunColor:"#fff6e0",sunSize:1.1,sunGlow:240};class MM{mesh;material;constructor(){this.material=new Te({name:"Sky",uniforms:Ya.clone(Hc.uniforms),vertexShader:Hc.vertexShader,fragmentShader:Hc.fragmentShader,side:Ke,depthWrite:!1,depthTest:!1,fog:!1}),this.mesh=new ne(new Jo(xM,32,16),this.material),this.mesh.name="Sky",this.mesh.renderOrder=-1,this.mesh.frustumCulled=!1}apply(t){const e=this.material.uniforms;e.uHorizon.value.set(t.horizon),e.uZenith.value.set(t.zenith),e.uGround.value.set(t.ground),e.uCloudColor.value.set(t.cloudColor),e.uCurve.value=t.curve,e.uCloudCover.value=t.cloudCover,e.uCloudSoftness.value=t.cloudSoftness,e.uCloudScale.value=t.cloudScale,e.uCloudOpacity.value=t.cloudOpacity,e.uCloudDrift.value=t.cloudDrift,e.uSunColor.value.set(t.sunColor),e.uSunIntensity.value=t.sun?1:0,e.uSunSize.value=Math.cos(t.sunSize*Math.PI/180),e.uSunGlow.value=t.sunGlow}aimAt(t){this.material.uniforms.uSunDirection.value.copy(t).normalize()}follow(t,e){this.mesh.position.setFromMatrixPosition(t.matrixWorld),this.material.uniforms.uTime.value=e}dispose(){this.mesh.geometry.dispose(),this.material.dispose()}}const Eu="hswow.preset.";function om(i){try{const t=window.localStorage.getItem(Eu+i);if(t===null)return null;const e=JSON.parse(t);return typeof e!="object"||e===null?null:e}catch{return null}}function rm(i,t){try{return window.localStorage.setItem(Eu+i,JSON.stringify(t)),!0}catch{return!1}}function am(i){try{window.localStorage.removeItem(Eu+i)}catch{}}const Nh=new jo({vertexColors:!0,transparent:!0,blending:Bl,depthWrite:!1,side:yn,fog:!1});function Tn(i,t){const e=new ne(i,Nh);return e.name=t,e.userData.noCollide=!0,e.renderOrder=2,e.layers.enable(im),e}const Gc="render",kr={pixelSize:2,normalEdgeStrength:.5,depthEdgeStrength:.5,ditherScale:1.65,screenPeriod:3,quantize:"levels",levels:16,ao:{strength:.85,radius:.8},bloom:{strength:.28,radius:1},vignetteStrength:0,vignetteRadius:.5,vignetteSoftness:.7,sky:{...sm},linkFogToSky:!0,fogColor:"#bcd4e6",fogNear:25,fogFar:140},R0={off:0,levels:1};class bM{settings;viewport;composer;pixelStage;gtao;fog;bloom;retroPass;sky=new MM;air=null;dither=!0;pixelate=!0;occlusion=!0;volumetrics=!0;glow=!0;colorblind="off";colorblindStrength=1;constructor(t){this.viewport=t;const e=om(Gc)??{};this.settings={...kr,...e,sky:{...sm,...e.sky},ao:{...kr.ao,...e.ao},bloom:{...kr.bloom,...e.bloom}},this.settings.quantize in R0||(this.settings.quantize="levels"),t.scene.add(this.sky.mesh),this.hideGlowFromEdges(t.scene),this.composer=new Wx(t.renderer),this.pixelStage=new iM(1,t.scene,t.camera),Dh(this.pixelStage.normalMaterial),this.gtao=new rM,this.fog=new fM,this.bloom=new mM,this.pixelStage.effects.push(this.gtao,this.fog,this.bloom),this.retroPass=new Jp(_M),this.composer.addPass(this.pixelStage),this.composer.addPass(new qx),this.composer.addPass(this.retroPass),this.resize(),this.apply()}setEnvironment(t){this.air=t,this.fog.setVolumes(t?.fogVolumes??[]),this.apply()}aimSun(t){this.sky.aimAt(t)}setDither(t){this.dither=t,this.apply()}setPixelation(t){this.pixelate=t,this.apply()}setAmbientOcclusion(t){this.occlusion=t,this.apply()}setFogVolumes(t){this.volumetrics=t,this.apply()}setBloom(t){this.glow=t,this.apply()}setColorblind(t,e){this.colorblind=t,this.colorblindStrength=Math.min(Math.max(e,0),1),this.apply()}apply(){const t=this.settings,e=this.viewport.renderer.getPixelRatio(),n=this.pixelate?Math.max(1,Math.round(t.pixelSize*e)):1;this.pixelStage.pixelSize!==n&&this.pixelStage.setPixelSize(n),this.pixelStage.normalEdgeStrength=t.normalEdgeStrength,this.pixelStage.depthEdgeStrength=t.depthEdgeStrength,this.gtao.enabled=this.occlusion&&t.ao.strength>0,this.gtao.strength=t.ao.strength,this.gtao.radius=t.ao.radius,this.fog.enabled=this.volumetrics&&this.fog.hasVolumes,this.bloom.enabled=this.glow&&t.bloom.strength>0,this.bloom.strength=t.bloom.strength,this.bloom.radius=t.bloom.radius;const s=this.retroPass.uniforms;s.uPixelSize.value=n,s.uDitherScale.value=this.dither?t.ditherScale:0,s.uPeriod.value=t.screenPeriod,s.uQuantize.value=R0[t.quantize],s.uLevels.value=t.levels,s.uVignette.value=t.vignetteStrength,s.uVignetteRadius.value=t.vignetteRadius,s.uVignetteSoftness.value=t.vignetteSoftness,s.uColorblind.value=wM[this.colorblind],s.uColorblindStrength.value=this.colorblindStrength,this.sky.apply(t.sky),this.sky.mesh.visible=this.air===null||this.air.sky;const o=this.viewport.scene.fog;o instanceof Za&&(this.air&&!this.air.sky?o.color.set(this.air.fogColor):t.linkFogToSky?o.color.set(t.sky.horizon):o.color.set(this.air?.fogColor??t.fogColor),o.near=this.air?.fogNear??t.fogNear,o.far=this.air?.fogFar??t.fogFar,this.viewport.renderer.setClearColor(o.color,1),this.gtao.setFog(o.near,o.far))}hideGlowFromEdges(t){t.onBeforeRender=(e,n)=>{Nh.visible=n.overrideMaterial===null}}render(t){const{renderer:e}=this.viewport;e.info.reset(),e.shadowMap.needsUpdate=!0,this.sky.follow(this.viewport.camera,t),this.pixelStage.time=t,this.composer.render()}resize(){const t=this.viewport.renderer.getSize(new tt);this.composer.setPixelRatio(this.viewport.renderer.getPixelRatio()),this.composer.setSize(t.x,t.y),this.apply()}save(){return rm(Gc,this.settings)}reset(){am(Gc),Object.assign(this.settings,structuredClone(kr)),this.apply()}dispose(){this.viewport.scene.onBeforeRender=()=>{},Nh.visible=!0,this.viewport.scene.remove(this.sky.mesh),this.sky.dispose(),this.pixelStage.dispose(),this.composer.dispose()}}const Vc=new URLSearchParams(window.location.search),cm={debug:Vc.has("debug"),level:Vc.get("level")??"proving",touch:Vc.has("touch")},SM=["KeyW","ArrowUp"],EM=["KeyS","ArrowDown"],TM=["KeyA","ArrowLeft"],AM=["KeyD","ArrowRight"],C0=["ShiftLeft","ShiftRight"],P0=["CapsLock"],I0=["Space"],RM=["KeyE"],zr=200,CM=3e3,PM=120;class IM{lookX=0;lookY=0;locked=!1;needsCapture;onLockChange=null;canvas;keys=new Set;stickX=0;stickZ=0;stickSprint=!1;sprintMode="hold";crouchMode="hold";sprintLatch=!1;crouchLatch=!1;jumpPressedAt=0;jumpHeld=!1;interactPressed=!1;settling=!1;relocking=!1;constructor(t){this.canvas=t,this.needsCapture=!lm(),window.addEventListener("keydown",this.handleKeyDown),window.addEventListener("keyup",this.handleKeyUp),window.addEventListener("blur",this.handleBlur),this.needsCapture?(t.addEventListener("pointerdown",this.handleCanvasPointerDown),document.addEventListener("pointerlockchange",this.handleLockChange),document.addEventListener("mousemove",this.handleMouseMove)):this.locked=!0}get moveX(){const t=L0(this.pressed(AM),this.pressed(TM));return Br(t+this.stickX,-1,1)}get moveZ(){const t=L0(this.pressed(SM),this.pressed(EM));return Br(t+this.stickZ,-1,1)}get sprint(){return(this.sprintMode==="toggle"?this.sprintLatch:this.pressed(C0))||this.stickSprint}get crouching(){return this.crouchMode==="toggle"?this.crouchLatch:this.pressed(P0)}setSprintMode(t){t!==this.sprintMode&&(this.sprintMode=t,this.sprintLatch=!1)}setCrouchMode(t){t!==this.crouchMode&&(this.crouchMode=t,this.crouchLatch=!1)}get jumping(){return this.jumpHeld}takeJump(t){return this.jumpPressedAt===0||(performance.now()-this.jumpPressedAt)/1e3>t?!1:(this.jumpPressedAt=0,!0)}takeInteract(){return this.interactPressed?(this.interactPressed=!1,!0):!1}drainLook(t){t.x=this.lookX,t.y=this.lookY,this.lookX=0,this.lookY=0}setStick(t,e,n){this.stickX=t,this.stickZ=e,this.stickSprint=n}addLook(t,e){this.lookX+=t,this.lookY+=e}pressJump(){this.jumpPressedAt=performance.now(),this.jumpHeld=!0}releaseJump(){this.jumpHeld=!1}pressInteract(){this.interactPressed=!0}capture(){this.locked||!this.needsCapture||this.requestLock()}pressed(t){return t.some(e=>this.keys.has(e))}handleKeyDown=t=>{if(t.code==="Tab"&&this.locked){t.preventDefault();return}t.repeat||this.needsCapture&&!this.locked||(this.keys.add(t.code),I0.includes(t.code)&&(t.preventDefault(),this.pressJump()),this.sprintMode==="toggle"&&C0.includes(t.code)&&(this.sprintLatch=!this.sprintLatch),this.crouchMode==="toggle"&&P0.includes(t.code)&&(this.crouchLatch=!this.crouchLatch),RM.includes(t.code)&&this.pressInteract())};handleKeyUp=t=>{this.keys.delete(t.code),I0.includes(t.code)&&this.releaseJump()};handleBlur=()=>{this.keys.clear(),this.releaseJump()};handleCanvasPointerDown=t=>{this.locked||t.button!==0||this.requestLock()};async requestLock(){if(this.relocking)return;this.relocking=!0;const t=performance.now()+CM;for(;!this.locked&&performance.now()<t;)await this.tryLock(),await LM(PM);this.relocking=!1}async tryLock(){try{await this.canvas.requestPointerLock({unadjustedMovement:!0})}catch{try{await this.canvas.requestPointerLock()}catch{}}}handleLockChange=()=>{this.locked=document.pointerLockElement===this.canvas,this.locked||this.keys.clear(),this.lookX=0,this.lookY=0,this.settling=this.locked,this.onLockChange?.(this.locked)};handleMouseMove=t=>{if(this.locked){if(this.settling){this.settling=!1;return}this.lookX+=Br(t.movementX,-zr,zr),this.lookY+=Br(t.movementY,-zr,zr)}};dispose(){window.removeEventListener("keydown",this.handleKeyDown),window.removeEventListener("keyup",this.handleKeyUp),window.removeEventListener("blur",this.handleBlur),this.canvas.removeEventListener("pointerdown",this.handleCanvasPointerDown),document.removeEventListener("pointerlockchange",this.handleLockChange),document.removeEventListener("mousemove",this.handleMouseMove)}}function lm(){return cm.touch||window.matchMedia("(pointer: coarse)").matches}function LM(i){return new Promise(t=>window.setTimeout(t,i))}function L0(i,t){return(i?1:0)-(t?1:0)}function Br(i,t,e){return Math.min(Math.max(i,t),e)}class tr{constructor(t=new C(0,0,0),e=new C(0,1,0),n=1){this.start=t,this.end=e,this.radius=n}clone(){return new tr(this.start.clone(),this.end.clone(),this.radius)}set(t,e,n){this.start.copy(t),this.end.copy(e),this.radius=n}copy(t){this.start.copy(t.start),this.end.copy(t.end),this.radius=t.radius}getCenter(t){return t.copy(this.end).add(this.start).multiplyScalar(.5)}translate(t){this.start.add(t),this.end.add(t)}checkAABBAxis(t,e,n,s,o,r,a,c,l){return(o-t<l||o-n<l)&&(t-r<l||n-r<l)&&(a-e<l||a-s<l)&&(e-c<l||s-c<l)}intersectsBox(t){return this.checkAABBAxis(this.start.x,this.start.y,this.end.x,this.end.y,t.min.x,t.max.x,t.min.y,t.max.y,this.radius)&&this.checkAABBAxis(this.start.x,this.start.z,this.end.x,this.end.z,t.min.x,t.max.x,t.min.z,t.max.z,this.radius)&&this.checkAABBAxis(this.start.y,this.start.z,this.end.y,this.end.z,t.min.y,t.max.y,t.min.z,t.max.z,this.radius)}}const ho=new C,uo=new C,Hr=new C,fo=new C,xn=new mi,Wc=new xu,DM=new xu,Gr=new Js,po=new tr,NM=new C,UM=new C,FM=new C,OM=1e-10;function kM(i,t,e=null,n=null){const s=NM.copy(i.end).sub(i.start),o=UM.copy(t.end).sub(t.start),r=FM.copy(t.start).sub(i.start),a=s.dot(o),c=s.dot(s),l=o.dot(o),h=o.dot(r),u=s.dot(r);let f,d;const g=c*l-a*a;if(Math.abs(g)<OM){const y=-h/l,m=(a-h)/l;Math.abs(y-.5)<Math.abs(m-.5)?(f=0,d=y):(f=1,d=m)}else f=(h*a+u*l)/g,d=(f*a-h)/l;d=Math.max(0,Math.min(1,d)),f=Math.max(0,Math.min(1,f)),e&&e.copy(s).multiplyScalar(f).add(i.start),n&&n.copy(o).multiplyScalar(d).add(t.start)}class Ra{constructor(t){this.box=t,this.bounds=new Zi,this.subTrees=[],this.triangles=[],this.layers=new qa}addTriangle(t){return this.bounds.min.x=Math.min(this.bounds.min.x,t.a.x,t.b.x,t.c.x),this.bounds.min.y=Math.min(this.bounds.min.y,t.a.y,t.b.y,t.c.y),this.bounds.min.z=Math.min(this.bounds.min.z,t.a.z,t.b.z,t.c.z),this.bounds.max.x=Math.max(this.bounds.max.x,t.a.x,t.b.x,t.c.x),this.bounds.max.y=Math.max(this.bounds.max.y,t.a.y,t.b.y,t.c.y),this.bounds.max.z=Math.max(this.bounds.max.z,t.a.z,t.b.z,t.c.z),this.triangles.push(t),this}calcBox(){return this.box=this.bounds.clone(),this.box.min.x-=.01,this.box.min.y-=.01,this.box.min.z-=.01,this}split(t){if(!this.box)return;const e=[],n=uo.copy(this.box.max).sub(this.box.min).multiplyScalar(.5);for(let o=0;o<2;o++)for(let r=0;r<2;r++)for(let a=0;a<2;a++){const c=new Zi,l=ho.set(o,r,a);c.min.copy(this.box.min).add(l.multiply(n)),c.max.copy(c.min).add(n),e.push(new Ra(c))}let s;for(;s=this.triangles.pop();)for(let o=0;o<e.length;o++)e[o].box.intersectsTriangle(s)&&e[o].triangles.push(s);for(let o=0;o<e.length;o++){const r=e[o].triangles.length;r>8&&t<16&&e[o].split(t+1),r!==0&&this.subTrees.push(e[o])}return this}build(){return this.calcBox(),this.split(0),this}getRayTriangles(t,e){for(let n=0;n<this.subTrees.length;n++){const s=this.subTrees[n];if(t.intersectsBox(s.box))if(s.triangles.length>0)for(let o=0;o<s.triangles.length;o++)e.indexOf(s.triangles[o])===-1&&e.push(s.triangles[o]);else s.getRayTriangles(t,e)}return e}triangleCapsuleIntersect(t,e){e.getPlane(xn);const n=xn.distanceToPoint(t.start)-t.radius,s=xn.distanceToPoint(t.end)-t.radius;if(n>0&&s>0||n<-t.radius&&s<-t.radius)return!1;const o=Math.abs(n/(Math.abs(n)+Math.abs(s))),r=ho.copy(t.start).lerp(t.end,o);if(e.containsPoint(r))return{normal:xn.normal.clone(),point:r.clone(),depth:Math.abs(Math.min(n,s))};const a=t.radius*t.radius,c=Wc.set(t.start,t.end),l=[[e.a,e.b],[e.b,e.c],[e.c,e.a]];for(let h=0;h<l.length;h++){const u=DM.set(l[h][0],l[h][1]);if(kM(c,u,Hr,fo),Hr.distanceToSquared(fo)<a)return{normal:Hr.clone().sub(fo).normalize(),point:fo.clone(),depth:t.radius-Hr.distanceTo(fo)}}return!1}triangleSphereIntersect(t,e){if(e.getPlane(xn),!t.intersectsPlane(xn))return!1;const n=Math.abs(xn.distanceToSphere(t)),s=t.radius*t.radius-n*n,o=xn.projectPoint(t.center,ho);if(e.containsPoint(t.center))return{normal:xn.normal.clone(),point:o.clone(),depth:Math.abs(xn.distanceToSphere(t))};const r=[[e.a,e.b],[e.b,e.c],[e.c,e.a]];for(let a=0;a<r.length;a++){Wc.set(r[a][0],r[a][1]),Wc.closestPointToPoint(o,!0,uo);const c=uo.distanceToSquared(t.center);if(c<s)return{normal:t.center.clone().sub(uo).normalize(),point:uo.clone(),depth:t.radius-Math.sqrt(c)}}return!1}getSphereTriangles(t,e){for(let n=0;n<this.subTrees.length;n++){const s=this.subTrees[n];if(t.intersectsBox(s.box))if(s.triangles.length>0)for(let o=0;o<s.triangles.length;o++)e.indexOf(s.triangles[o])===-1&&e.push(s.triangles[o]);else s.getSphereTriangles(t,e)}}getCapsuleTriangles(t,e){for(let n=0;n<this.subTrees.length;n++){const s=this.subTrees[n];if(t.intersectsBox(s.box))if(s.triangles.length>0)for(let o=0;o<s.triangles.length;o++)e.indexOf(s.triangles[o])===-1&&e.push(s.triangles[o]);else s.getCapsuleTriangles(t,e)}}sphereIntersect(t){Gr.copy(t);const e=[];let n,s=!1;this.getSphereTriangles(t,e);for(let o=0;o<e.length;o++)(n=this.triangleSphereIntersect(Gr,e[o]))&&(s=!0,Gr.center.add(n.normal.multiplyScalar(n.depth)));if(s){const o=Gr.center.clone().sub(t.center),r=o.length();return{normal:o.normalize(),depth:r}}return!1}capsuleIntersect(t){po.copy(t);const e=[];let n,s=!1;this.getCapsuleTriangles(po,e);for(let o=0;o<e.length;o++)(n=this.triangleCapsuleIntersect(po,e[o]))&&(s=!0,po.translate(n.normal.multiplyScalar(n.depth)));if(s){const o=po.getCenter(new C).sub(t.getCenter(ho)),r=o.length();return{normal:o.normalize(),depth:r}}return!1}rayIntersect(t){if(t.direction.length()===0)return;const e=[];let n,s,o=1e100;this.getRayTriangles(t,e);for(let r=0;r<e.length;r++){const a=t.intersectTriangle(e[r].a,e[r].b,e[r].c,!0,ho);if(a){const c=a.sub(t.origin).length();o>c&&(s=a.clone().add(t.origin),o=c,n=e[r])}}return o<1e100?{distance:o,triangle:n,position:s}:!1}fromGraphNode(t){return t.updateWorldMatrix(!0,!0),t.traverse(e=>{if(e.isMesh===!0&&this.layers.test(e.layers)){let n,s=!1;e.geometry.index!==null?(s=!0,n=e.geometry.toNonIndexed()):n=e.geometry;const o=n.getAttribute("position");for(let r=0;r<o.count;r+=3){const a=new C().fromBufferAttribute(o,r),c=new C().fromBufferAttribute(o,r+1),l=new C().fromBufferAttribute(o,r+2);a.applyMatrix4(e.matrixWorld),c.applyMatrix4(e.matrixWorld),l.applyMatrix4(e.matrixWorld),this.addTriangle(new hn(a,c,l))}s&&n.dispose()}}),this.build(),this}clear(){return this.box=null,this.bounds.makeEmpty(),this.subTrees.length=0,this.triangles.length=0,this}}function ge(i){return hm(i),i}function hm(i){if(i.userData.noCollide!==!0){i.layers.enable(nm);for(const t of i.children)hm(t)}}const gs=[],Xc=new C,mo=new C,qc=new C,D0=new C,Yc=new C,N0=new C,Ss=new C,U0=new xu,$c={normal:new C,depth:0};class Ca{index={octree:new Ra,triangles:0};cache=new Map;build(t,e){if(e!==void 0){const s=this.cache.get(e);if(s){this.index=s;return}}const n=Ca.index(t);e!==void 0&&this.cache.set(e,n),this.index=n}warm(t,e){this.cache.has(e)||this.cache.set(e,Ca.index(t))}invalidate(t){this.cache.delete(t)}static index(t){const e=new Ra;return e.layers.disableAll(),e.layers.enable(nm),e.fromGraphNode(t),{octree:e,triangles:um(e)}}get triangles(){return this.index.triangles}intersectCapsule(t){gs.length=0,this.index.octree.getCapsuleTriangles(t,gs);let e=0;for(const n of gs){const s=F0(t,n);s<=e||(e=s,$c.normal.copy(Ss))}return e===0?null:($c.depth=e,$c)}overlaps(t){gs.length=0,this.index.octree.getCapsuleTriangles(t,gs);for(const e of gs)if(F0(t,e)>0)return!0;return!1}raycast(t,e){const n=this.index.octree.rayIntersect(new Ko(t,e));return n?n.distance:null}}function F0(i,t){t.getNormal(mo),Xc.subVectors(i.end,i.start);const e=mo.dot(Xc);let n=0;Math.abs(e)>1e-6&&(n=mo.dot(qc.subVectors(t.a,i.start))/e,n=Math.min(Math.max(n,0),1)),qc.copy(i.start).addScaledVector(Xc,n),t.closestPointToPoint(qc,D0),U0.set(i.start,i.end),U0.closestPointToPoint(D0,!0,Yc),t.closestPointToPoint(Yc,N0),Ss.subVectors(Yc,N0);const s=Ss.length();return s>=i.radius||(s>1e-6?Ss.divideScalar(s):Ss.copy(mo),Ss.dot(mo)<=0)?0:i.radius-s}function um(i){let t=i.triangles.length;for(const e of i.subTrees)t+=um(e);return t}const Zc=1/120,O0=16,zM=4,Vr=6,BM=.28,Zn={radius:.32,height:1.8,eyeHeight:1.35,walkSpeed:4.2,sprintScale:1.75,crouchScale:.52,crouchHeight:.58,crouchSpeed:22,crouchDrag:.45,stepSmoothing:16,groundAccel:14,airAccel:7.5,friction:10,stopSpeed:1.6,gravity:26,jumpSpeed:7.2,coyoteTime:.22,jumpBuffer:.15,autoHop:!1,slopeLimitDeg:50,stepHeight:.45,lookSensitivity:.0022,invertY:!1,invertX:!1,bobScale:1,bobAmount:.02,bobSway:.012,bobRoll:.004,bobStepsPerSecond:1.9,bobSpeedInfluence:.5,firstStepFraction:.65,maxAirSpeed:1.12,fov:80,fovScaling:"vertical",sprintFovBoost:8,landDip:.02},Mn=new C,k0=new C,Wr=new C,Kc=new C,z0=new C,Xr=new C,jc=new C,HM=new C,qr=new C,B0=new C,Ve=new tr,Jc={x:0,y:0};let GM=class{tuning={...Zn};velocity=new C;onFootstep=null;onLand=null;onJump=null;camera;input;collider;capsule=new tr;yaw=0;pitch=0;zoomedOut=!1;authoredFov=Zn.fov;crouch=0;stepLag=0;stance=0;lastFeetY=null;groundNormal=new C(0,1,0);wishX=0;wishZ=0;grounded=!1;jumped=!1;timeOffGround=0;timeSinceLand=1/0;bobPhase=0;strideProgress=.65;dip=0;accumulator=0;constructor(t,e,n){this.camera=t,this.input=e,this.collider=n,this.camera.rotation.order="YXZ",this.authoredFov=this.tuning.fov,this.applyProjection(),this.teleport(new C(0,2,6),0)}teleport(t,e=this.yaw){const{radius:n,height:s}=this.tuning;this.capsule.set(new C(t.x,t.y+n,t.z),new C(t.x,t.y+s-n,t.z),n),this.velocity.set(0,0,0),this.yaw=e,this.grounded=!1,this.stance=0,this.crouch=0,this.stepLag=0,this.lastFeetY=null}setFieldOfView(t,e,n){this.tuning.fov=t,this.tuning.sprintFovBoost=e,this.tuning.fovScaling=n,this.authoredFov=t+(this.zoomedOut?e:0),this.applyProjection()}applyProjection(){const t=this.authoredFov,e=this.tuning.fovScaling==="vertical"?t:Oo.radToDeg(2*Math.atan(Math.tan(Oo.degToRad(t)/2)/this.camera.aspect));Math.abs(e-this.camera.fov)>.001&&(this.camera.fov=e,this.camera.updateProjectionMatrix())}get position(){return HM.copy(this.capsule.start).setY(this.capsule.start.y-this.tuning.radius)}get heading(){return this.yaw}get isGrounded(){return this.grounded}get speed(){return Math.hypot(this.velocity.x,this.velocity.z)}update(t){this.applyLook(),this.accumulator+=t;let e=0;for(;this.accumulator>=Zc&&e<O0;)this.step(Zc),this.accumulator-=Zc,e+=1;e===O0&&(this.accumulator=0),this.applyCamera(t)}applyLook(){this.input.drainLook(Jc);const{lookSensitivity:t,invertY:e,invertX:n}=this.tuning;this.yaw-=Jc.x*t*(n?-1:1),this.pitch-=Jc.y*t*(e?-1:1);const s=Math.PI/2-.001;this.pitch=Math.min(Math.max(this.pitch,-s),s),this.yaw=this.yaw%(Math.PI*2)}step(t){const e=this.tuning;this.jumped=!1,this.grounded?(this.timeOffGround=0,this.timeSinceLand+=t,this.applyFriction(t)):(this.timeOffGround+=t,this.velocity.y-=e.gravity*t),this.applyWish(t),this.applyJump(),this.capAirSpeed();const n=this.grounded,s=-this.velocity.y;this.move(t),this.grounded&&!n&&(this.timeSinceLand=0,s>1&&(this.dip+=Math.min(s,18)*e.landDip,this.onLand?.(s))),this.advanceBob(t)}applyFriction(t){const e=this.tuning,n=this.velocity.length();if(n<1e-4){this.velocity.set(0,0,0);return}const s=Math.max(n,e.stopSpeed)*e.friction*t;this.velocity.multiplyScalar(Math.max(n-s,0)/n)}applyWish(t){const e=this.tuning,{moveX:n,moveZ:s}=this.input;k0.set(-Math.sin(this.yaw),0,-Math.cos(this.yaw)),Wr.set(Math.cos(this.yaw),0,-Math.sin(this.yaw)),Mn.set(0,0,0).addScaledVector(k0,s).addScaledVector(Wr,n);const o=Mn.length();if(o<1e-4){this.wishX=0,this.wishZ=0;return}if(Mn.divideScalar(o),this.wishX=Mn.x,this.wishZ=Mn.z,this.grounded){Mn.projectOnPlane(this.groundNormal);const h=Mn.length();if(h<1e-4)return;Mn.divideScalar(h)}const r=e.walkSpeed*Math.min(o,1)*(this.input.sprint?e.sprintScale:1)*(1-this.stance*(1-e.crouchDrag)),a=this.velocity.dot(Mn),c=r-a;if(c<=0)return;const l=this.grounded?e.groundAccel:e.airAccel;this.velocity.addScaledVector(Mn,Math.min(l*r*t,c))}capAirSpeed(){if(this.grounded)return;const t=this.tuning,e=t.walkSpeed*t.sprintScale*t.maxAirSpeed,n=Math.hypot(this.velocity.x,this.velocity.z);if(n<=e||n<1e-6)return;const s=e/n;this.velocity.x*=s,this.velocity.z*=s}applyJump(){const t=this.tuning;!(this.grounded||this.timeOffGround<t.coyoteTime)||!(this.input.takeJump(t.jumpBuffer)||t.autoHop&&this.input.jumping)||(this.velocity.y=t.jumpSpeed,this.grounded=!1,this.jumped=!0,this.timeSinceLand>BM&&this.onJump?.(),this.timeSinceLand=0,this.timeOffGround=t.coyoteTime)}move(t){const e=this.tuning;z0.copy(this.velocity).multiplyScalar(t),jc.copy(this.capsule.start);const n=this.grounded,s=this.velocity.x,o=this.velocity.z;this.grounded=!1,this.capsule.translate(z0),this.resolve(),n&&!this.grounded&&!this.jumped&&this.snapToGround(),!(e.stepHeight<=0||this.wishX===0&&this.wishZ===0||this.velocity.y>.1||(this.capsule.start.x-jc.x)*this.wishX+(this.capsule.start.z-jc.z)*this.wishZ>=e.walkSpeed*t*.5)&&this.tryStepUp(t)&&(this.velocity.x=s,this.velocity.z=o,this.velocity.y=0)}resolve(){const t=Math.cos(this.tuning.slopeLimitDeg*Math.PI/180);for(let e=0;e<zM;e++){const n=this.collider.intersectCapsule(this.capsule);if(!n)break;this.capsule.translate(Kc.copy(n.normal).multiplyScalar(n.depth)),n.normal.y>t&&(this.grounded=!0,this.groundNormal.copy(n.normal));const s=this.velocity.dot(n.normal);s<0&&this.velocity.addScaledVector(n.normal,-s)}this.grounded||this.groundNormal.set(0,1,0)}headroom(){if(this.stance<.01)return!0;const t=this.tuning,e=this.capsule.start.y-t.radius;return Ve.copy(this.capsule),Ve.start.set(this.capsule.start.x,e+t.radius,this.capsule.start.z),Ve.end.set(this.capsule.start.x,e+t.height-t.radius,this.capsule.start.z),!this.collider.overlaps(Ve)}applyStance(){if(Math.abs(this.crouch-this.stance)<.001)return;this.stance=this.crouch;const t=this.tuning,e=this.capsule.start.y-t.radius,n=t.height*(1-this.stance*(1-t.crouchHeight));this.capsule.end.set(this.capsule.start.x,e+Math.max(n-t.radius,t.radius+.01),this.capsule.start.z)}snapToGround(){const t=this.tuning,e=Math.cos(t.slopeLimitDeg*Math.PI/180),n=Math.max(t.stepHeight,.05)/Vr;Xr.set(0,-n,0),Ve.copy(this.capsule);for(let s=0;s<Vr;s++){Ve.translate(Xr);const o=this.collider.intersectCapsule(Ve);if(o){if(o.normal.y<=e)return;Ve.translate(Kc.set(0,n,0)),this.capsule.copy(Ve),this.grounded=!0,this.groundNormal.copy(o.normal);return}}}tryStepUp(t){const e=this.tuning,n=Math.max(e.walkSpeed*t,.02);if(qr.set(this.capsule.start.x+this.wishX*n,this.capsule.start.y+e.stepHeight,this.capsule.start.z+this.wishZ*n),B0.copy(qr).setY(qr.y+e.height-e.radius*2),Ve.set(qr,B0,e.radius),this.collider.overlaps(Ve))return!1;const s=e.stepHeight/Vr;Xr.set(0,-s,0);for(let o=0;o<Vr;o++)if(Ve.translate(Xr),this.collider.overlaps(Ve))return Ve.translate(Kc.set(0,s,0)),this.capsule.copy(Ve),this.grounded=!0,this.groundNormal.set(0,1,0),!0;return!1}advanceBob(t){const e=this.tuning;if(!this.grounded)return;const n=this.speed;if(n<.15){this.bobPhase+=(Math.round(this.bobPhase)-this.bobPhase)*Math.min(t*8,1),this.strideProgress=e.firstStepFraction;return}const s=e.walkSpeed/Math.max(e.bobStepsPerSecond,.1),o=Math.max(.2,s*Math.pow(n/e.walkSpeed,1-e.bobSpeedInfluence));for(this.strideProgress+=n*t/o,this.bobPhase+=n*t/(o*2);this.strideProgress>=1;)this.strideProgress-=1,this.onFootstep?.(n)}applyCamera(t){const e=this.tuning,n=this.input.crouching||!this.headroom()?1:0;this.crouch+=(n-this.crouch)*Math.min(t*e.crouchSpeed,1),this.applyStance();const s=this.bobPhase*Math.PI*2;Wr.set(Math.cos(this.yaw),0,-Math.sin(this.yaw));const o=Math.min(this.speed/e.walkSpeed,1)*e.bobScale;this.dip=Math.max(this.dip-this.dip*Math.min(t*9,1),0);const r=this.capsule.start.y-e.radius;if(this.lastFeetY!==null&&this.grounded){const c=r-this.lastFeetY;c>.001&&c<e.stepHeight*1.2&&(this.stepLag+=c)}this.lastFeetY=r,this.stepLag=Math.max(0,this.stepLag-this.stepLag*Math.min(t*e.stepSmoothing,1)),this.camera.position.set(this.capsule.start.x,r-this.stepLag+e.eyeHeight*(1-this.stance*(1-e.crouchScale))-this.dip+Math.sin(s*2)*e.bobAmount*o,this.capsule.start.z),this.camera.position.addScaledVector(Wr,Math.sin(s)*e.bobSway*o),this.camera.rotation.set(this.pitch,this.yaw,Math.sin(s)*e.bobRoll*o),this.zoomedOut?(!this.input.sprint||this.speed<.4)&&(this.zoomedOut=!1):this.input.sprint&&this.speed>1.2&&(this.zoomedOut=!0);const a=e.fov+(this.zoomedOut?e.sprintFovBoost:0);this.authoredFov=Oo.damp(this.authoredFov,a,6,t),this.applyProjection()}};const ys=64,VM=.85,H0=2.2;class WM{input;root;stickBase;stickKnob;jumpPad;stick=null;lookPointer=null;lastLookX=0;lastLookY=0;constructor(t,e){this.input=t,this.root=document.createElement("div"),this.root.className="touch",this.stickBase=document.createElement("div"),this.stickBase.className="touch-stick",this.stickKnob=document.createElement("div"),this.stickKnob.className="touch-stick-knob",this.stickBase.appendChild(this.stickKnob),this.jumpPad=document.createElement("div"),this.jumpPad.className="touch-jump",this.jumpPad.textContent="↑",this.root.append(this.stickBase,this.jumpPad),e.appendChild(this.root),this.root.addEventListener("pointerdown",this.handleDown),window.addEventListener("pointermove",this.handleMove),window.addEventListener("pointerup",this.handleUp),window.addEventListener("pointercancel",this.handleUp),this.jumpPad.addEventListener("pointerdown",this.handleJumpDown),this.jumpPad.addEventListener("pointerup",this.handleJumpUp),this.jumpPad.addEventListener("pointercancel",this.handleJumpUp)}handleDown=t=>{const e=t.clientX<window.innerWidth/2;if(e&&this.stick===null){this.stick={pointerId:t.pointerId,originX:t.clientX,originY:t.clientY},this.stickBase.style.left=`${t.clientX}px`,this.stickBase.style.top=`${t.clientY}px`,this.stickBase.classList.add("is-active"),this.updateStick(t.clientX,t.clientY);return}!e&&this.lookPointer===null&&(this.lookPointer=t.pointerId,this.lastLookX=t.clientX,this.lastLookY=t.clientY)};handleMove=t=>{if(this.stick?.pointerId===t.pointerId){this.updateStick(t.clientX,t.clientY);return}this.lookPointer===t.pointerId&&(this.input.addLook((t.clientX-this.lastLookX)*H0,(t.clientY-this.lastLookY)*H0),this.lastLookX=t.clientX,this.lastLookY=t.clientY)};handleUp=t=>{this.stick?.pointerId===t.pointerId&&(this.stick=null,this.input.setStick(0,0,!1),this.stickBase.classList.remove("is-active"),this.stickKnob.style.transform="translate(-50%, -50%)"),this.lookPointer===t.pointerId&&(this.lookPointer=null)};handleJumpDown=t=>{t.stopPropagation(),this.jumpPad.classList.add("is-active"),this.input.pressJump()};handleJumpUp=()=>{this.jumpPad.classList.remove("is-active"),this.input.releaseJump()};updateStick(t,e){if(!this.stick)return;let n=t-this.stick.originX,s=e-this.stick.originY;const o=Math.hypot(n,s);if(o>ys){const a=ys/o;n*=a,s*=a}this.stickKnob.style.transform=`translate(calc(-50% + ${n}px), calc(-50% + ${s}px))`;const r=Math.min(o,ys)/ys;this.input.setStick(n/ys,-s/ys,r>VM)}dispose(){this.root.removeEventListener("pointerdown",this.handleDown),window.removeEventListener("pointermove",this.handleMove),window.removeEventListener("pointerup",this.handleUp),window.removeEventListener("pointercancel",this.handleUp),this.root.remove()}}const Pa=4,Sn=256,G0=Sn/Pa,XM=.82,qM=.6,YM=4,V0=.6,W0=1.4;function Yr(i,t){return Math.min(Math.max(t+.5-i,0),1)}function $r(i,t){const e=(i%t+t)%t;return Math.min(e,t-e)}let Qc=null;function X0(){if(Qc)return Qc;const i=new Uint8Array(Sn*Sn*4);for(let e=0;e<Sn;e++)for(let n=0;n<Sn;n++){const s=n+.5,o=e+.5,r=Math.max(Yr($r(s,Sn),W0),Yr($r(o,Sn),W0)),a=Math.max(Yr($r(s,G0),V0),Yr($r(o,G0),V0)),c=Math.min(1-r*(1-qM),1-a*(1-XM)),l=Math.round(c*255),h=(e*Sn+n)*4;i[h]=l,i[h+1]=l,i[h+2]=l,i[h+3]=255}const t=new mu(i,Sn,Sn,un);return t.wrapS=Yi,t.wrapT=Yi,t.colorSpace=Xn,t.generateMipmaps=!0,t.minFilter=gi,t.magFilter=Fe,t.anisotropy=16,t.needsUpdate=!0,Qc=t,t}function Qa(i=400,t={}){const e=t.segments??Math.max(8,Math.round(i/YM)),n=new _i(i,i,e,e);n.rotateX(-Math.PI/2);const s=n.getAttribute("uv");for(let a=0;a<s.count;a++)s.setXY(a,(s.getX(a)-.5)*(i/Pa),(s.getY(a)-.5)*(i/Pa));s.needsUpdate=!0;const o=t.material??new Ze({color:t.color??13286300});o.map!==X0()&&(o.map=X0(),o.needsUpdate=!0);const r=new ne(n,o);return r.name="flatGround",r.position.y=t.y??-.01,t.collidable===!1?r:ge(r)}const dm=Pa,q0={ground:"#cabb9c",cube:"#525f66",marker:"#b08040",ramp:"#38474a",stair:"#3d4b52",platform:"#46505c",wall:"#2e3640"},$M=208,ZM=52,KM=14474440,jM=6044206,JM=new C(0,.1,10);function We(i,t,e,n,s,o,r){const a=new ne(new k(i,t,e),n);return a.position.set(s,o+t/2,r),a}function QM(i,t,e,n){const s=new $p;s.moveTo(0,0),s.lineTo(t,0),s.lineTo(t,t*Math.tan(e*Math.PI/180)),s.closePath();const o=new wu(s,{depth:i,bevelEnabled:!1});return o.translate(0,0,-i/2),o.rotateY(Math.PI/2),new ne(o,n)}function tl(i,t,e,n,s,o){const a=new _i(i,t,96,1),c=a.getAttribute("position"),l=new Float32Array(c.count*3),h=new Wt;for(let f=0;f<c.count;f++){const d=c.getX(f)/i+.5,[g,y,m]=o(Math.min(Math.max(d,0),1));h.setRGB(g,y,m,on),h.toArray(l,f*3)}a.setAttribute("color",new He(l,3));const u=new ne(a,new jo({vertexColors:!0}));return u.position.set(e,n,s),u}class tb{root=new he;colors={...q0};materials={};constructor(){this.root.name="ProvingGround";for(const t of Object.keys(this.colors))this.materials[t]=new Ze({color:this.colors[t],flatShading:!0});this.populate()}populate(){return this.root.children.length>0?this.root:(this.addGround(),this.addHeightReference(),this.addMeasuredCubes(),this.addDistanceMarkers(),this.addMovementGym(),this.addCalibrationBoard(),this.root)}applyColors(){for(const t of Object.keys(this.colors))this.materials[t].color.set(this.colors[t])}resetColors(){Object.assign(this.colors,q0),this.applyColors()}addGround(){this.root.add(Qa($M,{segments:ZM,material:this.materials.ground})),this.root.add(new Ux(2))}addHeightReference(){const t=new he,e=.3,n=6;for(let s=0;s<n;s++){const o=new ne(new k(.08,e,.08),new Ze({color:s%2===0?KM:jM,flatShading:!0}));o.position.y=e*(s+.5),t.add(o)}t.position.set(-2,0,0),this.root.add(t)}addMeasuredCubes(){const t=[1,2,4];let e=4;for(const n of t)this.root.add(ge(We(n,n,n,this.materials.cube,e+n/2,0,0))),e+=n+1}addDistanceMarkers(){for(const t of[5,10,20,30])this.root.add(ge(We(.1,2,.1,this.materials.marker,0,0,-t)))}addMovementGym(){const t=new he;t.name="MovementGym",this.addRamps(t),this.addStairs(t),this.addKerbs(t),this.addJumpGaps(t),this.addFallWalkway(t),this.addParkour(t),this.root.add(ge(t))}addRamps(t){const e=[10,20,30,45],n=4;e.forEach((s,o)=>{const r=QM(2.5,n,s,this.materials.ramp);r.position.set(-6-o*4,0,-2),t.add(r);const a=n*Math.tan(s*Math.PI/180);t.add(We(2.5,.2,2,this.materials.ramp,-6-o*4,a-.2,-7))})}addStairs(t){const e=[{rise:.18,run:.3,x:-24},{rise:.3,run:.3,x:-28}];for(const n of e)for(let s=0;s<8;s++){const o=n.rise*(s+1);t.add(We(2.5,o,n.run,this.materials.stair,n.x,0,-2-s*n.run))}}addKerbs(t){[.2,.35,.5,.9].forEach((e,n)=>{t.add(We(3,e,2,this.materials.platform,-8-n*4,0,5))})}addJumpGaps(t){const e=[1.5,2.5,3.5],n=3,s=1.2;let o=18;t.add(We(3,s,n,this.materials.platform,-26,0,o));for(const r of e)o-=n+r,t.add(We(3,s,n,this.materials.platform,-26,0,o))}addParkour(t){const e=new he;e.name="Parkour";let n=8;for(const o of[0,1.4,1.8,2.2,2.6])n+=o,e.add(We(.7,.9,.7,this.materials.platform,-6,0,n));const s=-10;for(const o of[-1,1])e.add(We(.3,2.2,7,this.materials.wall,s+o*1.05,0,11.5));for(const[o,r]of[[1.6,9],[1.3,11.5],[1.1,14]])e.add(We(2.4,.3,.5,this.materials.wall,s,o,r));e.add(We(1.2,.6,1.2,this.materials.platform,-14,0,7.4)),n=8.4;for(const o of[.9,.7,.5,.35])e.add(We(o,1.2,2.4,this.materials.platform,-14,0,n)),n+=3.4;n=8;for(const o of[.55,.65,.75,.9]){for(const r of[-1,1])e.add(We(1.4,2,.6,this.materials.wall,-18+r*(o/2+.7),0,n));n+=2.6}t.add(e)}addFallWalkway(t){t.add(We(2.5,.2,8,this.materials.platform,-18,3.8,-12))}addCalibrationBoard(){const t=new he;t.name="CalibrationBoard";const e=7,n=-12;t.add(ge(We(12,6,.3,this.materials.wall,e,0,n)));const s=[[16711680,65280,255,16777215],[65535,16711935,16776960,0],[3355443,6710886,10066329,13421772],[9278609,6044206,11567168,3028544]],o=.9;s.forEach((l,h)=>{l.forEach((u,f)=>{const d=new ne(new _i(o,o),new jo({color:u}));d.position.set(e-4.6+f*(o+.15),5.1-h*(o+.15),n+.16),t.add(d)})}),t.add(tl(5.2,.7,e+2.6,4.3,n+.16,l=>[l,l,l])),t.add(tl(5.2,.7,e+2.6,3.4,n+.16,l=>[l,l*.35,.12])),t.add(tl(5.2,.7,e+2.6,2.5,n+.16,l=>[.1,l*.6,l]));const r=new ne(new Jo(1.1,48,32),new Ze({color:9278609}));r.position.set(e-8.5,1.1,n),t.add(ge(r));const a=Math.PI/6,c=new ne(new _i(6,4),new Ze({color:7305853,side:yn}));c.position.set(e-13.5,2*Math.cos(a),n),c.rotation.x=-a,t.add(ge(c)),this.root.add(t)}dispose(){this.root.traverse(t=>{if(t instanceof ne||t instanceof gu||t instanceof Vp){t.geometry.dispose();const e=t.material;if(Array.isArray(e))for(const n of e)n.dispose();else e.dispose()}}),this.root.clear()}}function eb(i,t){return Math.PI*i*t}function qs(i,t,e,n={}){const s=n.ring??"excitation",o=n.compensation??"energy",r=n.maxQ??(s==="filter"?220:14),a=[],c=[];return{inputs:t.map(h=>{const u=i.createGain(),f=i.createBiquadFilter();f.type="bandpass",f.frequency.value=h.hz;const d=h.q??(s==="filter"?Math.min(r,Math.max(1,eb(h.hz,h.decay))):Math.min(r,Math.max(4,4+h.decay*24)));f.Q.value=d,c.push(d);const g=i.createGain();return g.gain.value=o==="energy"?Math.sqrt(d):1/Math.sqrt(d),u.connect(f).connect(g).connect(e),a.push(u,f,g),u}),modes:t,qs:c,dispose(){for(const h of a)h.disconnect()}}}const Uh=8,el=48;function fm(i){return Array.from({length:Uh},(t,e)=>{const n=((e+1)/Uh)**2,s=new Float32Array(el);for(let o=0;o<el;o++)s[o]=n*i(o/(el-1));return s})}const nb=fm(i=>.5*(1-Math.cos(2*Math.PI*i)));fm(i=>{if(i<.05)return .5*(1-Math.cos(Math.PI*(i/.05)));const e=(i-.05)/(1-.05);return Math.exp(-5*e)*(1-e)});function ib(i){return i[Math.floor(Math.random()*Uh)]}function er(i,t,e,n,s){i.setValueAtTime(0,t),i.linearRampToValueAtTime(e,t+n),i.setTargetAtTime(0,t+n,s/3)}function pm(i,t,e){const n=i.createGain(),s=i.createBiquadFilter();return s.type="bandpass",s.frequency.value=t.hz,s.Q.value=t.q,n.connect(s).connect(e),{input:n,dispose(){n.disconnect(),s.disconnect()}}}function mm(i,t,e,n,s,o){const r=n.count/Math.max(n.over,.001);let a=0;for(let c=0;c<n.count&&(a+=-Math.log(1-Math.random()*.999-.001)/r,!(a>n.over*1.4));c++){const l=Math.exp(-a/n.energyDecay),h=o*n.level*l*(.35+Math.random()*.65);if(h<.002)continue;const u=i.createBufferSource();u.buffer=t,u.playbackRate.value=.7+Math.random()*.7;const f=i.createGain(),d=s+a;er(f.gain,d,h,8e-4,.012),u.connect(f).connect(e),u.start(d,Math.random()*Math.max(t.duration-.2,0),.06),u.stop(d+.07)}}function Pn(i,t,e,n,s,o){if(s<=5e-4)return;const r=i.createBufferSource();r.buffer=t;const a=i.createGain();er(a.gain,n,s,Math.min(.0012,o*.3),o*1.6),r.connect(a).connect(e),r.start(n,Math.random()*Math.max(t.duration-.5,0),o+.05),r.stop(n+o+.06)}function tc(i,t,e,n,s,o,r,a=.002){if(n<=5e-4)return;const c=i.createOscillator();c.type="sine",c.frequency.setValueAtTime(s,e),c.frequency.exponentialRampToValueAtTime(Math.max(o,1),e+r);const l=i.createGain();er(l.gain,e,n,a,r),c.connect(l).connect(t),c.start(e),c.stop(e+r*3+.06)}const Zr={stone:{level:.5,impact:{level:.9,duration:.011,tone:3800},modes:[{hz:620,decay:.06,level:.6},{hz:1450,decay:.03,level:.32},{hz:2600,decay:.018,level:.12}],grit:{count:5,over:.06,energyDecay:.025,hz:2600,q:1.2,level:.12},toe:.45,roll:.075},wood:{level:.6,impact:{level:.7,duration:.018,tone:1700},modes:[{hz:155,decay:.22,level:1},{hz:390,decay:.15,level:.6},{hz:720,decay:.075,level:.22}],grit:{count:4,over:.05,energyDecay:.02,hz:1200,q:.9,level:.08},toe:.6,roll:.085},earth:{level:.5,impact:{level:1,duration:.022,tone:900},modes:[{hz:120,decay:.05,level:.55}],grit:{count:9,over:.07,energyDecay:.028,hz:1600,q:1,level:.22},toe:.4,roll:.085},gravel:{level:.5,impact:{level:.45,duration:.012,tone:2400},modes:[],grit:{count:26,over:.16,energyDecay:.06,hz:3e3,q:1.4,level:.75},toe:.7,roll:.09},grass:{level:.32,impact:{level:.5,duration:.03,tone:1400},modes:[],grit:{count:16,over:.11,energyDecay:.045,hz:5200,q:.9,level:.4},toe:.6,roll:.085},leaves:{level:.4,impact:{level:.35,duration:.02,tone:2600},modes:[],grit:{count:34,over:.2,energyDecay:.08,hz:4200,q:2.2,level:.55},toe:.75,roll:.09},metal:{level:.45,impact:{level:.9,duration:.004,tone:9e3},modes:[{hz:480,decay:.5,level:.5},{hz:1270,decay:.42,level:.45},{hz:2340,decay:.3,level:.3},{hz:4100,decay:.18,level:.2}],grit:null,toe:.5,roll:.07},mud:{level:.5,impact:{level:1,duration:.05,tone:700},modes:[{hz:240,decay:.06,level:.35}],grit:{count:6,over:.09,energyDecay:.03,hz:900,q:3.2,level:.3},toe:.3,roll:.1}},sb=6,Y0=.35,ob=9;function go(i,t){return i+Math.random()*(t-i)}class rb{surface="earth";engine;output;body;panner;reverbSend;chains=new Map;left=!1;constructor(t,e=.55){this.engine=t;const n=t.context;this.output=n.createGain(),this.output.gain.value=e,this.body=n.createBiquadFilter(),this.body.type="lowpass",this.body.frequency.value=5200,this.body.Q.value=.6,this.panner=n.createStereoPanner(),this.reverbSend=n.createGain(),this.reverbSend.gain.value=.6,this.output.connect(this.body),this.body.connect(this.panner),this.panner.connect(t.dry),this.panner.connect(this.reverbSend),this.reverbSend.connect(t.send)}setReverb(t){this.reverbSend.gain.setTargetAtTime(Math.max(0,t),this.engine.context.currentTime,.1)}step(t){const e=this.engine.context;if(e.state!=="running"||!this.engine.noise)return;const n=Zr[this.surface],s=this.chainFor(this.surface),o=e.currentTime+.004,r=Y0+(1-Y0)*(1-Math.exp(-t/(sb*.45))),a=n.level*Math.min(r,1);if(this.panner.pan.setValueAtTime(this.takeFoot()*.2,o),this.strike(s,n,o,a*go(.9,1.1)),n.toe>0){const c=n.roll*Math.max(.35,1-t/12);this.strike(s,n,o+c,a*n.toe*go(.8,1.1))}}land(t){const e=this.engine.context;if(e.state!=="running"||!this.engine.noise)return;const n=Zr[this.surface],s=this.chainFor(this.surface),o=e.currentTime+.004,r=Math.min(t/ob,1),a=n.level*(.7+r*.85);this.panner.pan.setValueAtTime(0,o),this.strike(s,n,o,a),this.strike(s,n,o+go(.012,.03),a*go(.4,.6))}jump(){const t=this.engine.context;if(t.state!=="running"||!this.engine.noise)return;const e=Zr[this.surface],n=this.chainFor(this.surface),s=t.currentTime+.004;this.panner.pan.setValueAtTime(this.takeFoot()*.12,s),this.strike(n,e,s,e.level*go(.42,.55),{stretch:3.2,modes:.28,grit:1.7})}takeFoot(){const t=this.left?-1:1;return this.left=!this.left,t}strike(t,e,n,s,o){const r=this.engine.context,a=this.engine.noise;if(!a)return;const c=o?.stretch??1,l=o?.modes??1,h=o?.grit??1;Pn(r,a.white,t.impactInput,n,s*e.impact.level,e.impact.duration*c);for(let u=0;u<e.modes.length;u++)Pn(r,a.white,t.bank.inputs[u],n,s*e.modes[u].level*.5*l,.002);e.grit&&t.gritInput&&mm(r,a.white,t.gritInput,e.grit,n,s*h)}chainFor(t){const e=this.chains.get(t);if(e)return e;const n=this.engine.context,s=Zr[t],o=n.createGain(),r=n.createBiquadFilter();r.type="lowpass",r.frequency.value=s.impact.tone,o.connect(r).connect(this.output);const a=qs(n,s.modes,this.output,{ring:"filter",compensation:"inverse"});let c=null;s.grit&&(c=pm(n,s.grit,this.output).input);const l={impactInput:o,bank:a,gritInput:c};return this.chains.set(t,l),l}dispose(){this.output.disconnect(),this.body.disconnect(),this.panner.disconnect(),this.reverbSend.disconnect()}}const ab=6;function gm(i){const t=Math.floor(i.sampleRate*ab);return{white:nl(i,t,lb()),pink:nl(i,t,hb()),brown:nl(i,t,ub())}}function nl(i,t,e){const n=i.createBuffer(1,t,i.sampleRate),s=n.getChannelData(0);for(let r=0;r<t;r++)s[r]=e();const o=Math.min(2048,t/4|0);for(let r=0;r<o;r++){const a=r/o;s[r]=s[r]*a+s[t-o+r]*(1-a)}return cb(s),n}function cb(i){let t=0;for(let n=0;n<i.length;n++)t=Math.max(t,Math.abs(i[n]));if(t===0)return;const e=.95/t;for(let n=0;n<i.length;n++)i[n]*=e}function lb(){return()=>Math.random()*2-1}function hb(){let i=0,t=0,e=0,n=0,s=0,o=0,r=0;return()=>{const a=Math.random()*2-1;i=.99886*i+a*.0555179,t=.99332*t+a*.0750759,e=.969*e+a*.153852,n=.8665*n+a*.3104856,s=.55*s+a*.5329522,o=-.7616*o-a*.016898;const c=i+t+e+n+s+o+r+a*.5362;return r=a*.115926,c*.11}}function ub(){let i=0;return()=>{const t=Math.random()*2-1;return i=(i+.02*t)/1.02,i*3.5}}function An(i,t,e,n=.06){const s=i.createBufferSource();return s.buffer=t,s.loop=!0,s.playbackRate.value=1+(Math.random()*2-1)*n,s.connect(e),s.start(0,Math.random()*t.duration),{source:s,stop(o=0){try{s.stop(o)}catch{}}}}const Kr={open:{rt60:.7,preDelay:.012,damping:.7,wet:.12},cell:{rt60:.45,preDelay:.004,damping:.55,wet:.3},hall:{rt60:4.2,preDelay:.035,damping:.18,wet:.62}};async function db(i,t){const e=Math.max(t.rt60,.05),n=Math.ceil(i*(e+t.preDelay)),s=new OfflineAudioContext(2,n,i),o=s.createBufferSource();o.buffer=fb(s,n,i,t);const r=s.createBiquadFilter();r.type="lowpass",r.frequency.value=700+(1-t.damping)**2*17300;const a=s.createBiquadFilter();return a.type="highpass",a.frequency.value=90,o.connect(r).connect(a).connect(s.destination),o.start(0),s.startRendering()}function fb(i,t,e,n){const s=i.createBuffer(2,t,e),o=Math.floor(n.preDelay*e),r=Math.exp(-Math.log(1e3)/(n.rt60*e));for(let a=0;a<2;a++){const c=s.getChannelData(a);let l=1;for(let h=o;h<t;h++)c[h]=(Math.random()*2-1)*l,l*=r}return s}const il=[1,.4,.2,.1],pb=[1,2.7,6.1,13.3],$0=.11;function Z0(i){let t=Math.imul(i|0,668265261);return t^=t>>>15,t=Math.imul(t,2246822507),t^=t>>>13,(t>>>0)/4294967296}function Fh(i){const t=Math.floor(i),e=i-t,n=(1-Math.cos(e*Math.PI))*.5;return Z0(t)*(1-n)+Z0(t+1)*n}const mb=1.35;function K0(i){let t=0,e=0;for(let s=0;s<il.length;s++)t+=Fh(i*pb[s]+s*17.3)*il[s],e+=il[s];const n=t/e;return Math.min(1,Math.max(0,.5+(n-.5)*mb))}const gb={windSpeed:.5,gustDepth:.6,gustRate:.06,windDirection:2.1,frontSpeed:9};class ym{settings={...gb};gust=0;swell=.5;strength=0;time=0;update(t){this.time+=t*this.settings.gustRate,this.gust=K0(this.time),this.swell=Fh(this.time*$0+91.7),this.strength=this.fieldAt(this.time)}fieldAt(t){const{windSpeed:e,gustDepth:n}=this.settings,s=K0(t),o=Fh(t*$0+91.7),r=e*(.45+o*1.1);return Math.min(1,Math.max(0,r+(s-.5)*n))}lagAt(t,e){const{windDirection:n,frontSpeed:s,gustRate:o}=this.settings;return(t*Math.cos(n)+e*Math.sin(n))/Math.max(s,.5)*o}strengthAt(t,e){return this.fieldAt(this.time-this.lagAt(t,e))}get phase(){return this.time}}const yb=""+new URL("processor-Xg0mnuxH.js",import.meta.url).href,j0=new WeakMap;function vb(i){let t=j0.get(i);return t||(t=i.audioWorklet.addModule(yb),j0.set(i,t)),t}const J0=new Map;async function wb(i,t){let e=J0.get(i);return e||(e=fetch(i).then(n=>{if(!n.ok)throw new Error(`${n.status} ${n.statusText}`);return n.arrayBuffer()}).then(n=>({wasm:n,meta:t})).catch(n=>(console.warn(`faust: could not load ${i} — falling back`,n),null)),J0.set(i,e)),e}async function vm(i,t,e){try{const[n]=await Promise.all([wb(t,e),vb(i)]);if(!n)return null;const s=new AudioWorkletNode(i,"faust-processor",{numberOfInputs:e.inputs>0?1:0,numberOfOutputs:1,outputChannelCount:[Math.max(e.outputs,1)],processorOptions:{wasm:n.wasm,meta:n.meta}}),o=new Map;for(const[r,a]of Object.entries(e.params))o.set(r,a.init);return{node:s,meta:e,set(r,a){o.set(r,a),s.port.postMessage({type:"param",key:r,value:a})},get(r){return o.get(r)??0},dispose(){s.port.onmessage=null,s.disconnect()}}}catch(n){return console.warn("faust: worklet unavailable — falling back",n),null}}const wm=Object.freeze(Object.defineProperty({__proto__:null,createFaustNode:vm},Symbol.toStringTag,{value:"Module"})),_b=""+new URL("reverb-BkEOyDCs.wasm",import.meta.url).href,xb=_b,Mb={name:"reverb",inputs:1,outputs:2,size:1982988,params:{crossover:{at:36,init:200,min:50,max:1e3,step:1},damping:{at:16,init:6e3,min:700,max:16e3,step:1},decayLow:{at:24,init:2,min:.2,max:12,step:.01},decayMid:{at:28,init:2,min:.2,max:12,step:.01},preDelay:{at:327756,init:20,min:0,max:100,step:1}}},Tu={masterVolume:.7,reverbAmount:1,airAbsorption:.65,occlusion:.8},bb=.12,Q0=8,tf=24;class Sb{context;settings={...Tu};weather=new ym;dry;send;duck;master;noise=null;ready;started=!1;rooms=new Map;currentRoom=null;occlusionTimer=0;emitters=new Set;ranking=[];faust=null;faustWet=null;tap=null;constructor(){this.context=new AudioContext({latencyHint:"interactive"}),this.master=this.context.createGain(),this.duck=this.context.createGain(),this.dry=this.context.createGain(),this.send=this.context.createGain();const t=this.context.createDynamicsCompressor();t.threshold.value=-6,t.knee.value=6,t.ratio.value=12,t.attack.value=.003,t.release.value=.25,this.dry.connect(this.duck),this.duck.connect(this.master),this.master.connect(t),t.connect(this.context.destination),this.ready=this.build(),this.listenForGesture(),document.addEventListener("visibilitychange",this.handleVisibility)}async build(){this.noise=gm(this.context);const t=await vm(this.context,xb,Mb);if(t){const s=this.context.createGain();s.gain.value=0,this.send.connect(t.node),t.node.connect(s),s.connect(this.duck),this.faust=t,this.faustWet=s}const e=Object.keys(Kr),n=await Promise.all(e.map(s=>db(this.context.sampleRate,Kr[s])));this.faust||(e.forEach((s,o)=>{const r=this.context.createConvolver();r.normalize=!0,r.buffer=n[o];const a=this.context.createGain();a.gain.value=0,this.send.connect(r),r.connect(a),a.connect(this.duck),this.rooms.set(s,{convolver:r,gain:a})}),this.currentRoom!==null&&this.setRoom(this.currentRoom))}setRoom(t,e=.45){this.currentRoom=t;const n=this.context.currentTime,s=Kr[t];if(this.faust&&this.faustWet){this.faust.set("decayLow",s.rt60*1.5),this.faust.set("decayMid",s.rt60),this.faust.set("crossover",200),this.faust.set("damping",700+(1-s.damping)**2*15300),this.faust.set("preDelay",s.preDelay*1e3),this.faustWet.gain.cancelScheduledValues(n),this.faustWet.gain.setTargetAtTime(s.wet*this.settings.reverbAmount,n,e/3);return}if(this.rooms.size!==0)for(const[o,r]of this.rooms){const a=o===t?Kr[o].wet*this.settings.reverbAmount:0;r.gain.gain.cancelScheduledValues(n),r.gain.gain.setTargetAtTime(a,n,e/3)}}get reverbKind(){return this.faust?"fdn":"convolution"}get reverbControls(){return this.faust}get analyser(){if(!this.tap){const t=this.context.createAnalyser();t.fftSize=2048,t.smoothingTimeConstant=.6,this.master.connect(t),this.tap=t}return this.tap}get room(){return this.currentRoom}register(t){this.emitters.add(t)}unregister(t){this.emitters.delete(t)}update(t,e){return this.weather.update(t),this.updateListener(e),this.master.gain.value=this.settings.masterVolume,this.occlusionTimer-=t,this.occlusionTimer>0?!1:(this.occlusionTimer=bb,this.allocateVoices(),!0)}allocateVoices(){this.ranking.length=0;for(const e of this.emitters){if(!e.enabled){e.setDetail("virtual");continue}const n=e.position.distanceTo(Hn);if(n>e.maxDistance){e.setDetail("virtual");continue}this.ranking.push({emitter:e,priority:n/Math.max(e.importance,.01)})}this.ranking.sort((e,n)=>e.priority-n.priority);const t=2;for(let e=0;e<this.ranking.length;e++){const{emitter:n}=this.ranking[e],s=n.detailLevel;let o;e<Q0?o="hrtf":e<tf?o="panned":o="virtual",s==="hrtf"&&e<Q0+t?o="hrtf":s==="panned"&&o==="virtual"&&e<tf+t&&(o="panned"),n.setDetail(o)}}get voiceCounts(){let t=0,e=0,n=0;for(const s of this.emitters)s.detailLevel==="hrtf"?t++:s.detailLevel==="panned"?e++:n++;return{hrtf:t,panned:e,virtual:n}}updateListener(t){const e=this.context.listener;if(t.updateWorldMatrix(!0,!1),Hn.setFromMatrixPosition(t.matrixWorld),Ui.set(0,0,-1).applyQuaternion(t.getWorldQuaternion(ef)),Fi.set(0,1,0).applyQuaternion(ef),e.positionX){const n=this.context.currentTime,s=.02;e.positionX.linearRampToValueAtTime(Hn.x,n+s),e.positionY.linearRampToValueAtTime(Hn.y,n+s),e.positionZ.linearRampToValueAtTime(Hn.z,n+s),e.forwardX.linearRampToValueAtTime(Ui.x,n+s),e.forwardY.linearRampToValueAtTime(Ui.y,n+s),e.forwardZ.linearRampToValueAtTime(Ui.z,n+s),e.upX.linearRampToValueAtTime(Fi.x,n+s),e.upY.linearRampToValueAtTime(Fi.y,n+s),e.upZ.linearRampToValueAtTime(Fi.z,n+s)}else{const n=e;n.setPosition(Hn.x,Hn.y,Hn.z),n.setOrientation(Ui.x,Ui.y,Ui.z,Fi.x,Fi.y,Fi.z)}}get listenerPosition(){return Hn}applyReverbAmount(){this.currentRoom!==null&&this.setRoom(this.currentRoom,.05)}listenForGesture(){const t=()=>{this.context.resume().then(()=>{this.started=this.context.state==="running"}),window.removeEventListener("pointerdown",t),window.removeEventListener("keydown",t),window.removeEventListener("touchstart",t)};window.addEventListener("pointerdown",t),window.addEventListener("keydown",t),window.addEventListener("touchstart",t)}handleVisibility=()=>{document.hidden?this.context.suspend():this.started&&this.context.resume()};dispose(){document.removeEventListener("visibilitychange",this.handleVisibility),this.context.close()}}const Hn=new C,Ui=new C,Fi=new C,ef=new ti;/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.21.0
 * @author George Michael Brower
 * @license MIT
 */class Rn{constructor(t,e,n,s,o="div"){this.parent=t,this.object=e,this.property=n,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(o),this.domElement.classList.add("lil-controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("lil-name"),Rn.nextNameID=Rn.nextNameID||0,this.$name.id=`lil-gui-name-${++Rn.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("lil-widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",r=>r.stopPropagation()),this.domElement.addEventListener("keyup",r=>r.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(n)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("lil-disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Eb extends Rn{constructor(t,e,n){super(t,e,n,"lil-boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Oh(i){let t,e;return(t=i.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=i.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=i.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const Tb={isPrimitive:!0,match:i=>typeof i=="string",fromHexString:Oh,toHexString:Oh},qo={isPrimitive:!0,match:i=>typeof i=="number",fromHexString:i=>parseInt(i.substring(1),16),toHexString:i=>"#"+i.toString(16).padStart(6,0)},Ab={isPrimitive:!1,match:i=>Array.isArray(i)||ArrayBuffer.isView(i),fromHexString(i,t,e=1){const n=qo.fromHexString(i);t[0]=(n>>16&255)/255*e,t[1]=(n>>8&255)/255*e,t[2]=(n&255)/255*e},toHexString([i,t,e],n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return qo.toHexString(s)}},Rb={isPrimitive:!1,match:i=>Object(i)===i,fromHexString(i,t,e=1){const n=qo.fromHexString(i);t.r=(n>>16&255)/255*e,t.g=(n>>8&255)/255*e,t.b=(n&255)/255*e},toHexString({r:i,g:t,b:e},n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return qo.toHexString(s)}},Cb=[Tb,qo,Ab,Rb];function Pb(i){return Cb.find(t=>t.match(i))}class Ib extends Rn{constructor(t,e,n,s){super(t,e,n,"lil-color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=Pb(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const o=Oh(this.$text.value);o&&this._setValueFromHexString(o)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class sl extends Rn{constructor(t,e,n){super(t,e,n,"lil-function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class Lb extends Rn{constructor(t,e,n,s,o,r){super(t,e,n,"lil-number"),this._initInput(),this.min(s),this.max(o);const a=r!==void 0;this.step(a?r:this._getImplicitStep(),a),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let _=parseFloat(this.$input.value);isNaN(_)||(this._stepExplicit&&(_=this._snap(_)),this.setValue(this._clamp(_)))},n=_=>{const w=parseFloat(this.$input.value);isNaN(w)||(this._snapClampSetValue(w+_),this.$input.value=this.getValue())},s=_=>{_.key==="Enter"&&this.$input.blur(),_.code==="ArrowUp"&&(_.preventDefault(),n(this._step*this._arrowKeyMultiplier(_))),_.code==="ArrowDown"&&(_.preventDefault(),n(this._step*this._arrowKeyMultiplier(_)*-1))},o=_=>{this._inputFocused&&(_.preventDefault(),n(this._step*this._normalizeMouseWheel(_)))};let r=!1,a,c,l,h,u;const f=5,d=_=>{a=_.clientX,c=l=_.clientY,r=!0,h=this.getValue(),u=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",y)},g=_=>{if(r){const w=_.clientX-a,v=_.clientY-c;Math.abs(v)>f?(_.preventDefault(),this.$input.blur(),r=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(w)>f&&y()}if(!r){const w=_.clientY-l;u-=w*this._step*this._arrowKeyMultiplier(_),h+u>this._max?u=this._max-h:h+u<this._min&&(u=this._min-h),this._snapClampSetValue(h+u)}l=_.clientY},y=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",y)},m=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",o,{passive:!1}),this.$input.addEventListener("mousedown",d),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("lil-slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("lil-fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("lil-has-slider");const t=(p,_,w,v,b)=>(p-_)/(w-_)*(b-v)+v,e=p=>{const _=this.$slider.getBoundingClientRect();let w=t(p,_.left,_.right,this._min,this._max);this._snapClampSetValue(w)},n=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",o)},s=p=>{e(p.clientX)},o=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",o)};let r=!1,a,c;const l=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),r=!1},h=p=>{p.touches.length>1||(this._hasScrollBar?(a=p.touches[0].clientX,c=p.touches[0].clientY,r=!0):l(p),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",f))},u=p=>{if(r){const _=p.touches[0].clientX-a,w=p.touches[0].clientY-c;Math.abs(_)>Math.abs(w)?l(p):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",f))}else p.preventDefault(),e(p.touches[0].clientX)},f=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",f)},d=this._callOnFinishChange.bind(this),g=400;let y;const m=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const w=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+w),this.$input.value=this.getValue(),clearTimeout(y),y=setTimeout(d,g)};this.$slider.addEventListener("mousedown",n),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("lil-active",t),document.body.classList.toggle("lil-dragging",t),document.body.classList.toggle(`lil-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:n}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,n=-t.wheelDelta/120,n*=this._stepExplicit?1:10),e+-n}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){let e=0;return this._hasMin?e=this._min:this._hasMax&&(e=this._max),t-=e,t=Math.round(t/this._step)*this._step,t+=e,t=parseFloat(t.toPrecision(15)),t}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class Db extends Rn{constructor(t,e,n,s){super(t,e,n,"lil-option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("lil-focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("lil-focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const n=document.createElement("option");n.textContent=e,this.$select.appendChild(n)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class Nb extends Rn{constructor(t,e,n){super(t,e,n,"lil-string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}var Ub=`.lil-gui {
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
}`;function Fb(i){const t=document.createElement("style");t.innerHTML=i;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let nf=!1;class Au{constructor({parent:t,autoPlace:e=t===void 0,container:n,width:s,title:o="Controls",closeFolders:r=!1,injectStyles:a=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("button"),this.$title.classList.add("lil-title"),this.$title.setAttribute("aria-expanded",!0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("lil-children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(o),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("lil-root"),c&&this.domElement.classList.add("lil-allow-touch-styles"),!nf&&a&&(Fb(Ub),nf=!0),n?n.appendChild(this.domElement):e&&(this.domElement.classList.add("lil-auto-place","autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=r}add(t,e,n,s,o){if(Object(n)===n)return new Db(this,t,e,n);const r=t[e];switch(typeof r){case"number":return new Lb(this,t,e,n,s,o);case"boolean":return new Eb(this,t,e);case"string":return new Nb(this,t,e);case"function":return new sl(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,r)}addColor(t,e,n=1){return new Ib(this,t,e,n)}addFolder(t){const e=new Au({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(n=>{n instanceof sl||n._name in t.controllers&&n.load(t.controllers[n._name])}),e&&t.folders&&this.folders.forEach(n=>{n._title in t.folders&&n.load(t.folders[n._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(n=>{if(!(n instanceof sl)){if(n._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${n._name}"`);e.controllers[n._name]=n.save()}}),t&&this.folders.forEach(n=>{if(n._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${n._title}"`);e.folders[n._title]=n.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("lil-closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("lil-transition");const n=o=>{o.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("lil-transition"),this.$children.removeEventListener("transitionend",n))};this.$children.addEventListener("transitionend",n);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("lil-closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(n=>n.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}var Ho=function(){var i=0,t=document.createElement("div");t.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",t.addEventListener("click",function(h){h.preventDefault(),n(++i%t.children.length)},!1);function e(h){return t.appendChild(h.dom),h}function n(h){for(var u=0;u<t.children.length;u++)t.children[u].style.display=u===h?"block":"none";i=h}var s=(performance||Date).now(),o=s,r=0,a=e(new Ho.Panel("FPS","#0ff","#002")),c=e(new Ho.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var l=e(new Ho.Panel("MB","#f08","#201"));return n(0),{REVISION:16,dom:t,addPanel:e,showPanel:n,begin:function(){s=(performance||Date).now()},end:function(){r++;var h=(performance||Date).now();if(c.update(h-s,200),h>=o+1e3&&(a.update(r*1e3/(h-o),100),o=h,r=0,l)){var u=performance.memory;l.update(u.usedJSHeapSize/1048576,u.jsHeapSizeLimit/1048576)}return h},update:function(){s=this.end()},domElement:t,setMode:n}};Ho.Panel=function(i,t,e){var n=1/0,s=0,o=Math.round,r=o(window.devicePixelRatio||1),a=80*r,c=48*r,l=3*r,h=2*r,u=3*r,f=15*r,d=74*r,g=30*r,y=document.createElement("canvas");y.width=a,y.height=c,y.style.cssText="width:80px;height:48px";var m=y.getContext("2d");return m.font="bold "+9*r+"px Helvetica,Arial,sans-serif",m.textBaseline="top",m.fillStyle=e,m.fillRect(0,0,a,c),m.fillStyle=t,m.fillText(i,l,h),m.fillRect(u,f,d,g),m.fillStyle=e,m.globalAlpha=.9,m.fillRect(u,f,d,g),{dom:y,update:function(p,_){n=Math.min(n,p),s=Math.max(s,p),m.fillStyle=e,m.globalAlpha=1,m.fillRect(0,0,a,f),m.fillStyle=t,m.fillText(o(p)+" "+i+" ("+o(n)+"-"+o(s)+")",l,h),m.drawImage(y,u+r,f,d-r,g,u,f,d-r,g),m.fillRect(u+d-r,f,r,g),m.fillStyle=e,m.globalAlpha=.9,m.fillRect(u+d-r,f,r,o((1-p/_)*g))}}};function Ob(){if(!cm.debug)return{gui:null,stats:null,update:()=>{},dispose:()=>{}};const i=new Ho;i.dom.style.position="fixed",i.dom.style.top="0",i.dom.style.left="0",document.body.appendChild(i.dom);const t=new Au({title:"hswow"});return t.domElement.style.setProperty("--width","280px"),{gui:t,stats:i,update:()=>i.update(),dispose:()=>{t.destroy(),i.dom.remove()}}}const jr=2e4,kb=420,zb=.32,Bb=.08,ol=.04,rl=.5;class _m{position=new C;enabled=!0;importance;maxDistance;engine;model;absorption;occlusion;swap;panner;sendGain;reverb;ignoreAbsorption;ignoreOcclusion;invertDistance;occluded=!1;detail="panned";connected=!1;pending=0;constructor(t,e,n){this.engine=t,this.model=e,this.position.copy(n.position),this.maxDistance=n.maxDistance??60,this.reverb=n.reverb??1,this.importance=n.importance??1,this.ignoreAbsorption=n.ignoreAbsorption??!1,this.ignoreOcclusion=n.ignoreOcclusion??!1,this.invertDistance=n.invertDistance??!1;const s=t.context;this.absorption=s.createBiquadFilter(),this.absorption.type="lowpass",this.absorption.frequency.value=jr,this.occlusion=s.createGain(),this.swap=s.createGain(),this.panner=s.createPanner(),this.panner.panningModel="equalpower",this.panner.distanceModel="inverse",this.panner.refDistance=n.refDistance??1.5,this.panner.maxDistance=this.maxDistance,this.panner.rolloffFactor=this.invertDistance?0:n.rolloff??1.1,n.direction&&(this.panner.coneInnerAngle=n.coneInner??90,this.panner.coneOuterAngle=n.coneOuter??240,this.panner.coneOuterGain=n.coneOuterGain??.35,Hb(this.panner,n.direction)),sf(this.panner,this.position),this.sendGain=s.createGain(),this.sendGain.gain.value=this.reverb,this.absorption.connect(this.occlusion),this.occlusion.connect(this.swap),this.swap.connect(this.panner),this.panner.connect(t.dry),this.panner.connect(this.sendGain),this.sendGain.connect(t.send),this.connect(),t.register(this)}moveTo(t){this.position.copy(t),sf(this.panner,this.position)}setDetail(t){t!==this.detail&&(this.detail=t,this.retarget())}retarget(){const t=this.engine.context,e=t.currentTime;this.swap.gain.cancelScheduledValues(e),this.swap.gain.setValueAtTime(this.swap.gain.value,e),this.swap.gain.linearRampToValueAtTime(0,e+ol),window.clearTimeout(this.pending),this.pending=window.setTimeout(()=>{const n=this.detail;if(n==="virtual"){this.connected&&(this.disconnect(),this.model.setActive?.(!1));return}this.connected||(this.connect(),this.model.setActive?.(!0)),this.panner.panningModel=n==="hrtf"?"HRTF":"equalpower";const s=t.currentTime;this.swap.gain.cancelScheduledValues(s),this.swap.gain.setValueAtTime(0,s),this.swap.gain.linearRampToValueAtTime(1,s+ol)},ol*1e3+10)}update(t,e,n){if(this.detail==="virtual"||!this.enabled){this.enabled===!1&&this.connected&&this.glide(this.occlusion.gain,0);return}const s=this.position.distanceTo(this.engine.listenerPosition);this.model.update?.(t,this.engine,this.position),n&&!this.ignoreOcclusion&&(this.occluded=this.testOcclusion(e,s));const o=this.engine.settings,r=Math.min(s/this.maxDistance,1),a=this.ignoreAbsorption?jr:jr*(1-o.airAbsorption*Math.sqrt(r)*.94),c=this.occluded?o.occlusion:0,l=Math.min(a,of(jr,kb,c)),h=this.invertDistance?rf(r):r<=rl?1:1-rf((r-rl)/(1-rl));this.glide(this.absorption.frequency,Math.max(l,180)),this.glide(this.occlusion.gain,of(1,zb,c)*h),this.sendGain.gain.value=this.reverb*o.reverbAmount}testOcclusion(t,e){if(e<.5)return!1;Wn.subVectors(this.position,this.engine.listenerPosition).divideScalar(e);const n=t.raycast(this.engine.listenerPosition,Wn);return n!==null&&n<e-.35}connect(){this.connected||(this.model.output.connect(this.absorption),this.connected=!0)}disconnect(){if(this.connected){try{this.model.output.disconnect(this.absorption)}catch{}this.connected=!1}}glide(t,e){t.setTargetAtTime(e,this.engine.context.currentTime,Bb)}get isOccluded(){return this.occluded}get isVirtual(){return this.detail==="virtual"}get detailLevel(){return this.detail}dispose(){this.engine.unregister(this),this.disconnect(),this.model.dispose(),this.panner.disconnect(),this.sendGain.disconnect(),this.absorption.disconnect(),this.occlusion.disconnect(),this.swap.disconnect()}}function sf(i,t){i.positionX?(i.positionX.value=t.x,i.positionY.value=t.y,i.positionZ.value=t.z):i.setPosition(t.x,t.y,t.z)}function Hb(i,t){Wn.copy(t).normalize(),i.orientationX?(i.orientationX.value=Wn.x,i.orientationY.value=Wn.y,i.orientationZ.value=Wn.z):i.setOrientation(Wn.x,Wn.y,Wn.z)}function of(i,t,e){return i+(t-i)*e}function rf(i){const t=i<0?0:i>1?1:i;return t*t*t*(t*(t*6-15)+10)}const Wn=new C,Gb=220,Vb=560,Wb=1.4,al=1300,Xb=2900,cl=4,qb=9;function xm(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("wind model built before the noise buffers were ready");const s=e.createGain();s.gain.value=t.gain??.5;const o=e.createBiquadFilter();o.type="lowpass",o.frequency.value=t.tone??3400,o.Q.value=.4;const r=e.createBiquadFilter();r.type="highshelf",r.frequency.value=2200,r.gain.value=-7;const a=e.createGain();a.gain.value=.5,o.connect(r).connect(a).connect(s);const c=e.createGain(),l=e.createGain(),h=e.createGain(),u=e.createBiquadFilter();u.type="lowpass",u.frequency.value=Gb;const f=e.createBiquadFilter();f.type="bandpass",f.frequency.value=Vb,f.Q.value=Wb;const d=e.createBiquadFilter();d.type="bandpass",d.frequency.value=al,d.Q.value=cl;const g=[An(e,n.brown,u),An(e,n.pink,f),An(e,n.white,d)];u.connect(c).connect(o),f.connect(l).connect(o),d.connect(h).connect(o);const y=t.whistle??1;return{output:s,setTone(m){o.frequency.setTargetAtTime(m,e.currentTime,.1)},update(m,p,_){const w=p.weather.strengthAt(_.x,_.z),v=e.currentTime,b=.09;c.gain.setTargetAtTime(.1+w*.85,v,b),l.gain.setTargetAtTime(.03+w*w*.5,v,b),h.gain.setTargetAtTime(w**3*.2*y,v,b),a.gain.setTargetAtTime(.25+w*.75,v,b*1.6),d.frequency.setTargetAtTime(al+(Xb-al)*w,v,b),d.Q.setTargetAtTime(cl+(qb-cl)*w,v,b)},dispose(){for(const m of g)m.stop();s.disconnect()}}}const Yb=.14,$b=160;function In(i,t=Yb){let e=0;return{pump(n,s,o="immediate"){const r=i.currentTime;e<r&&(e=r+(o==="oneGap"?s():0));const a=r+t;let c=0;for(;e<a&&c<$b;)n(e),e+=Math.max(s(),1e-4),c++},reset(){e=0}}}function xi(i){const t=Math.max(i,.01);return()=>-Math.log(1-Math.random())/t}function Mm(i,t=.06){return()=>i*(1+(Math.random()*2-1)*t)}function Ru(i,t,e,n=1){const s=t.map(o=>{const r=i.createBiquadFilter();return r.type="bandpass",r.frequency.value=o.hz*n,r.Q.value=o.q,r.connect(e),{filter:r,weight:o.weight,hz:o.hz}});return{pick(){let o=Math.random();for(const r of s)if(o-=r.weight,o<=0)return r.filter;return s[s.length-1].filter},setTone(o,r){for(const a of s)a.filter.frequency.setTargetAtTime(a.hz*o,r,.15)},overlap(o,r){return o*r},dispose(){for(const o of s)o.filter.disconnect()}}}function Zb(i,t,e,n,s={}){const o=s.minDuration??.055,r=s.maxDuration??.165,a=o+Math.random()*(r-o),c=i.createBufferSource();c.buffer=t;const l=s.minRate??.7,h=s.maxRate??1.4;c.playbackRate.value=l+Math.random()*(h-l);const u=i.createGain();u.gain.setValueCurveAtTime(ib(s.pool??nb),n,a),c.connect(u).connect(e),c.start(n,Math.random()*Math.max(t.duration-.3,0),a+.02),c.stop(n+a+.03)}const Kb=[{hz:1150,q:2.6,weight:.4},{hz:2400,q:3.2,weight:.46},{hz:4600,q:3.8,weight:.14}];function bm(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("foliage model built before the noise buffers were ready");const s=t.density??240,o=t.tone??1,r=t.restlessness??.2,a=e.createGain();a.gain.value=t.gain??.5;const c=e.createGain();c.gain.value=0,c.connect(a);const l=Ru(e,Kb,c,o),h=e.createBiquadFilter();h.type="bandpass",h.frequency.value=1800*o,h.Q.value=.75;const u=e.createGain();u.gain.value=0;const f=An(e,n.pink,h);h.connect(u).connect(a);let d=t.articulation??.3,g=!0;const y=In(e),m=p=>Zb(e,n.white,l.pick(),p,{minDuration:.055,maxDuration:.165});return{output:a,setArticulation(p){d=p},setActive(p){g=p,p&&y.reset(),p||(u.gain.value=0,c.gain.value=0)},update(p,_,w){if(!g)return;const v=Math.max(_.weather.strengthAt(w.x,w.z),r),b=e.currentTime;u.gain.setTargetAtTime(.1+v*.5,b,.15),h.frequency.setTargetAtTime((1500+v*1900)*o,b,.15),c.gain.setTargetAtTime(d*(.25+v*.75),b,.15);const S=Math.max(20,s*v*v);y.pump(m,xi(S))},dispose(){f.stop(),l.dispose(),c.disconnect(),a.disconnect()}}}const af=[1,2,3.02,4.05,5.97],jb=[1,.5,.28,.16,.09],Jr={steady:{speed:1,wear:1,clank:1,min:9,max:26,next:["labouring","surging","idling"]},labouring:{speed:.62,wear:1.8,clank:1.7,min:5,max:14,next:["steady","stalling","surging"]},surging:{speed:1.34,wear:1.3,clank:.8,min:3,max:9,next:["steady","labouring"]},stalling:{speed:.22,wear:2.2,clank:2.4,min:1.5,max:4,next:["labouring","idling"]},idling:{speed:.45,wear:.7,clank:.5,min:8,max:20,next:["steady","surging"]}};function Sm(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("machine model built before the noise buffers were ready");const s=t.fundamental??46,o=t.clank??.5,r=e.createGain();r.gain.value=t.gain??.35;const a=e.createGain();a.gain.value=.5;const c=e.createBiquadFilter();c.type="lowpass",c.frequency.value=520,c.Q.value=.9;const l=[];af.forEach((A,P)=>{const R=e.createOscillator();R.type=P===0?"sawtooth":"triangle",R.frequency.value=s*A,R.detune.value=(Math.random()*2-1)*9;const F=e.createGain();F.gain.value=jb[P],R.connect(F).connect(c),R.start(),l.push(R)}),c.connect(a);const h=e.createGain();h.gain.value=1;const u=e.createOscillator();u.type="sine";const f=e.createGain();f.gain.value=.22,u.connect(f).connect(h.gain),u.start(),a.connect(h).connect(r);const d=e.createBiquadFilter();d.type="bandpass",d.frequency.value=2600,d.Q.value=.8;const g=e.createGain();g.gain.value=(t.wear??.4)*.22;const y=An(e,n.pink,d);d.connect(g).connect(r);const m=e.createGain();m.gain.value=o,m.connect(r);let p=t.rpm??52,_=p,w=!0;const v=In(e,.15);let b="steady",S=12;const E=(t.wear??.4)*.22,T=A=>{if(o<=0)return;const P=e.createBufferSource();P.buffer=n.white;const R=e.createBiquadFilter();R.type="bandpass",R.frequency.value=190+Math.random()*90,R.Q.value=14;const F=e.createGain();er(F.gain,A,.9+Math.random()*.3,.001,.15),P.connect(R).connect(F).connect(m),P.start(A,Math.random()*2,.4),P.stop(A+.45)},M=(A=.9)=>{const P=e.currentTime,R=Jr[b];u.frequency.setTargetAtTime(_/60,P,A*.4);const F=Math.max(_,4)/52;af.forEach((D,N)=>{l[N].frequency.setTargetAtTime(s*D*F,P,A)}),c.frequency.setTargetAtTime(420+F*260,P,A),g.gain.setTargetAtTime(E*R.wear,P,A),m.gain.setTargetAtTime(o*R.clank,P,A)},x=A=>{b=A;const P=Jr[A];S=P.min+Math.random()*(P.max-P.min),M()};return M(.01),{output:r,get phase(){return b},get currentRpm(){return _},setRpm(A){p=A},setActive(A){w=A,A&&v.reset()},update(A){if(!w)return;if(S-=A,S<=0){const D=Jr[b].next;x(D[Math.floor(Math.random()*D.length)])}const P=p*Jr[b].speed,R=Math.min(A*.55,1);Math.abs(P-_)>.05&&(_+=(P-_)*R,M());const F=60/Math.max(_,3);v.pump(T,Mm(F,.06),"oneGap")},dispose(){for(const A of l)A.stop();u.stop(),y.stop(),r.disconnect()}}}function Em(i,t={}){const e=i.context,n=t.pitch??2400,s=t.interval??7,o=t.shySpeed??.72,r=e.createGain();r.gain.value=t.gain??.16;const a=e.createBiquadFilter();a.type="lowpass",a.frequency.value=t.tone??3200,a.Q.value=.5,a.connect(r);let c=!0,l=0;const h=(g,y,m,p)=>{const _=e.createOscillator();_.type="sine",_.frequency.setValueAtTime(y,g),_.frequency.exponentialRampToValueAtTime(m,g+p);const w=e.createOscillator();w.type="sine",w.frequency.setValueAtTime(y*2.02,g),w.frequency.exponentialRampToValueAtTime(m*2.02,g+p);const v=e.createGain();v.gain.value=.18;const b=e.createGain();b.gain.setValueAtTime(0,g),b.gain.linearRampToValueAtTime(1,g+p*.18),b.gain.setValueAtTime(1,g+p*.6),b.gain.linearRampToValueAtTime(0,g+p),_.connect(b),w.connect(v).connect(b),b.connect(a),_.start(g),w.start(g),_.stop(g+p+.02),w.stop(g+p+.02)},u=[{name:"rising",weight:.26},{name:"falling",weight:.2},{name:"trill",weight:.16},{name:"pair",weight:.22},{name:"single",weight:.1},{name:"chatter",weight:.06}],f=()=>{let g=Math.random();for(const y of u)if(g-=y.weight,g<=0)return y.name;return"pair"},d=g=>{const y=n*(.82+Math.random()*.36);let m=g;switch(f()){case"rising":{const p=2+Math.floor(Math.random()*3);for(let _=0;_<p;_++){const w=1+_*(.1+Math.random()*.09),v=.06+Math.random()*.07;h(m,y*w,y*w*1.22,v),m+=v+.03+Math.random()*.05}break}case"falling":{const p=2+Math.floor(Math.random()*2);for(let _=0;_<p;_++){const w=1-_*(.08+Math.random()*.07),v=.08+Math.random()*.1;h(m,y*w*1.18,y*w*.82,v),m+=v+.04+Math.random()*.06}break}case"trill":{const p=5+Math.floor(Math.random()*7),_=.028+Math.random()*.022;for(let w=0;w<p;w++){const v=w%2===0?1:1.09;h(m,y*v,y*v*1.05,_*.8),m+=_}break}case"pair":{const p=.07+Math.random()*.06;h(m,y,y*1.3,p),m+=p+.05+Math.random()*.04,h(m,y*1.28,y*1.05,p*1.2),m+=p*1.2;break}case"single":{const p=.22+Math.random()*.3;h(m,y*.95,y*1.12,p),m+=p;break}case"chatter":{const p=3+Math.floor(Math.random()*4);for(let _=0;_<p;_++){const w=.02+Math.random()*.02;h(m,y*.6,y*.5,w),m+=w+.02+Math.random()*.03}break}}return m};return{output:r,setActive(g){c=g,g&&(l=0)},update(g,y,m){if(!c)return;const p=e.currentTime;l<p&&(l=p+Math.random()*s),!(l>p+.2)&&(y.weather.strengthAt(m.x,m.z)<o?l=d(l)+(Math.random()<.34?.4+Math.random()*2.2:-Math.log(1-Math.random())*s):l=p+1.5)},dispose(){r.disconnect()}}}const ll=8e3,Jb=12,Qb=7,tS=[{hz:1500,q:6,weight:.34},{hz:2800,q:7,weight:.42},{hz:5200,q:8,weight:.24}],eS=.6,nS=.3,iS=.2,cf=new WeakMap;function sS(i){const t=cf.get(i);if(t)return t;const e=Math.floor(ll*Jb),n=i.createBuffer(1,e,ll),s=n.getChannelData(0),o=Math.exp(-2*Math.PI*Qb/ll);let r=0;for(let l=0;l<e;l++)r=o*r+(1-o)*(Math.random()*2-1),s[l]=r;const a=Math.min(1024,e/4|0);for(let l=0;l<a;l++){const h=l/a;s[l]=s[l]*h+s[e-a+l]*(1-h)}let c=0;for(let l=0;l<e;l++)c=Math.max(c,Math.abs(s[l]));if(c>0)for(let l=0;l<e;l++)s[l]/=c;return cf.set(i,n),n}function Tm(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("fire model built before the noise buffers were ready");const s=t.tone??1,o=t.crackle??1,r=t.draught??.35,a=e.createGain();a.gain.value=t.gain??.5;const c=e.createBiquadFilter();c.type="bandpass",c.frequency.value=110*s,c.Q.value=.9;const l=e.createGain();l.gain.value=0;const h=An(e,n.brown,c);c.connect(l).connect(a);const u=e.createGain();u.gain.value=0;const f=An(e,sS(e),u,.12);u.connect(l.gain);const d=e.createBiquadFilter();d.type="highpass",d.frequency.value=800*s,d.Q.value=.6;const g=e.createBiquadFilter();g.type="highshelf",g.frequency.value=4200,g.gain.value=-7;const y=e.createGain();y.gain.value=0;const m=An(e,n.white,d);d.connect(g).connect(y).connect(a);const p=e.createGain();p.gain.value=iS*o,p.connect(a);const _=Ru(e,tS,p,s);let w=t.intensity??.7,v=!0;const b=In(e),S=E=>{const T=Math.random()<.09,M=T?.45+Math.random()*.5:.06+Math.random()*.26,x=T?.006+Math.random()*.014:.0015+Math.random()*.005;Pn(e,n.white,_.pick(),E,M,x),T&&tc(e,p,E,.16,95*s,42*s,.085,.004)};return{output:a,setIntensity(E){w=Math.min(1,Math.max(0,E))},setActive(E){v=E,E&&b.reset(),E||(l.gain.value=0,u.gain.value=0,y.gain.value=0)},update(E,T,M){if(!v)return;const x=e.currentTime,A=Math.min(1.35,w*(1+T.weather.strengthAt(M.x,M.z)*r)),P=eS*(.3+A*.7);l.gain.setTargetAtTime(P*.72,x,.4),u.gain.setTargetAtTime(P*.62,x,.4),c.frequency.setTargetAtTime((85+A*60)*s,x,.4),y.gain.setTargetAtTime(nS*(.15+A*.85),x,.3),d.frequency.setTargetAtTime((650+A*900)*s,x,.3),b.pump(S,xi(Math.max(.6,22*A*A)))},dispose(){h.stop(),m.stop(),f.stop(),u.disconnect(),_.dispose(),p.disconnect(),l.disconnect(),y.disconnect(),a.disconnect()}}}function Am(i){return 3.26/Math.max(i,5e-5)}const oS=20,rS=.28;function Ia(i,t,e,n){const s=Am(n.radius),o=n.cycles??oS,r=n.rise??rS,a=o/s,c=i.createOscillator();c.type="sine",c.frequency.setValueAtTime(s,e),c.frequency.linearRampToValueAtTime(s*(1+r),e+a);const l=i.createGain();return l.gain.setValueAtTime(n.level,e),l.gain.exponentialRampToValueAtTime(n.level*.001,e+a),c.connect(l).connect(t),c.start(e),c.stop(e+a+.01),a}function La(i,t){return i*Math.pow(t/i,Math.random())}const hl={canopy:{channels:[{hz:900,q:2.4,weight:.42},{hz:1900,q:2.8,weight:.4},{hz:3600,q:3.2,weight:.18}],contact:[.004,.012],drop:.16,bedHz:1600,bedQ:.7,density:420},stone:{channels:[{hz:2400,q:5,weight:.34},{hz:4200,q:6,weight:.42},{hz:6800,q:7,weight:.24}],contact:[.0012,.004],drop:.26,bedHz:3200,bedQ:.55,density:300},earth:{channels:[{hz:420,q:1.8,weight:.5},{hz:780,q:2,weight:.36},{hz:1500,q:2.4,weight:.14}],contact:[.01,.028],drop:.14,bedHz:800,bedQ:.6,density:260},water:{channels:[{hz:1400,q:3,weight:.5},{hz:2600,q:3.5,weight:.5}],contact:[.002,.006],drop:.07,bedHz:2e3,bedQ:.6,density:240,bubbles:[4e-4,.0016]}};function Rm(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("rain model built before the noise buffers were ready");const s=t.tone??1,o=t.eaves??0;let r=hl[t.surface??"canopy"];const a=r.bubbles,c=e.createGain();c.gain.value=t.gain??.5;const l=e.createGain();l.gain.value=0,l.connect(c);const h=Ru(e,r.channels,l,s),u=e.createBiquadFilter();u.type="bandpass",u.frequency.value=r.bedHz*s,u.Q.value=r.bedQ;const f=e.createGain();f.gain.value=0;const d=An(e,n.pink,u);u.connect(f).connect(c);let g=t.intensity??.5;const y=t.articulation??.35;let m=!0;const p=In(e),_=In(e),w=b=>{if(a){Ia(e,l,b,{radius:La(a[0],a[1]),level:r.drop*(.4+Math.random()*.6),cycles:13});return}const[S,E]=r.contact;Pn(e,n.white,h.pick(),b,r.drop*(.35+Math.random()*.65),S+Math.random()*(E-S))},v=b=>{Ia(e,l,b,{radius:La(.0022,.0065),level:.5+Math.random()*.5,cycles:22})};return{output:c,setIntensity(b){g=Math.min(1,Math.max(0,b))},setSurface(b){if(a)return;r=hl[b];const S=e.currentTime;u.frequency.setTargetAtTime(r.bedHz*s,S,.25),u.Q.setTargetAtTime(r.bedQ,S,.25),h.setTone(r.bedHz/hl.canopy.bedHz*s,S)},setActive(b){m=b,b?(p.reset(),_.reset()):(f.gain.value=0,l.gain.value=0)},update(b,S,E){if(!m)return;const T=e.currentTime,M=Math.min(1,g*(1+S.weather.strengthAt(E.x,E.z)*.22));if(M<.02){f.gain.setTargetAtTime(0,T,.6),l.gain.setTargetAtTime(0,T,.6),p.reset(),_.reset();return}f.gain.setTargetAtTime(M*.55,T,.6),u.frequency.setTargetAtTime(r.bedHz*s*(.7+M*.55),T,.6),l.gain.setTargetAtTime(y*(.2+M*.8),T,.6),p.pump(w,xi(Math.max(8,r.density*M*M))),o>0&&_.pump(v,xi(o*(.35+M*.65)),"oneGap")},dispose(){d.stop(),h.dispose(),l.disconnect(),f.disconnect(),c.disconnect()}}}const aS={brook:{rate:95,radius:[4e-4,.0026],cycles:15,bedHz:1500,bedQ:.75,bedLevel:.28,voice:.1},stream:{rate:62,radius:[9e-4,.005],cycles:18,bedHz:900,bedQ:.7,bedLevel:.36,voice:.13},fountain:{rate:150,radius:[5e-4,.0035],cycles:14,bedHz:2100,bedQ:.6,bedLevel:.34,voice:.09},cistern:{rate:.45,radius:[.003,.009],cycles:30,bedHz:260,bedQ:1.3,bedLevel:.02,voice:.62}};function Cm(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("water model built before the noise buffers were ready");const s=aS[t.flow??"brook"],o=t.tone??1,r=s.radius[0]/o,a=s.radius[1]/o,c=e.createGain();c.gain.value=t.gain??.5;const l=e.createGain();l.gain.value=1;const h=e.createBiquadFilter();h.type="highshelf",h.frequency.value=3e3,h.gain.value=-3,l.connect(h).connect(c);const u=e.createBiquadFilter();u.type="bandpass",u.frequency.value=s.bedHz*o,u.Q.value=s.bedQ;const f=e.createGain();f.gain.value=0;const d=An(e,n.pink,u);u.connect(f).connect(c);let g=t.rate??1,y=!0;const m=In(e),p=_=>{Ia(e,l,_,{radius:La(r,a),level:s.voice*(.3+Math.random()*.7),cycles:s.cycles*(.75+Math.random()*.5)})};return{output:c,get voiceHz(){return Am(Math.sqrt(r*a))},setRate(_){g=Math.min(1,Math.max(0,_))},setActive(_){y=_,_?m.reset():f.gain.value=0},update(_){if(!y)return;const w=e.currentTime;if(f.gain.setTargetAtTime(s.bedLevel*g,w,.5),u.frequency.setTargetAtTime(s.bedHz*o*(.75+g*.4),w,.5),g<.02){m.reset();return}m.pump(p,xi(s.rate*g))},dispose(){d.stop(),h.disconnect(),l.disconnect(),f.disconnect(),c.disconnect()}}}function Pm(i,t,e){const n=i.createGain(),s=t.map(r=>{const a=i.createBiquadFilter();a.type="bandpass",a.frequency.value=r.hz,a.Q.value=r.q;const c=i.createGain();return c.gain.value=r.level,n.connect(a).connect(c).connect(e),{filter:a,level:c}}),o=t.map(r=>({...r}));return{input:n,shape(r,a,c=0){for(let l=0;l<s.length;l++){const h=r[l];if(!h)continue;const{filter:u,level:f}=s[l];c<=0?(u.frequency.setValueAtTime(h.hz,a),f.gain.setValueAtTime(h.level,a)):(u.frequency.setValueAtTime(o[l].hz,a),u.frequency.exponentialRampToValueAtTime(Math.max(h.hz,20),a+c),f.gain.setValueAtTime(o[l].level,a),f.gain.linearRampToValueAtTime(h.level,a+c)),u.Q.setValueAtTime(h.q,a),o[l]={...h}}},dispose(){n.disconnect();for(const{filter:r,level:a}of s)r.disconnect(),a.disconnect()}}}const yo={a:[{hz:730,q:8,level:1},{hz:1090,q:10,level:.5},{hz:2440,q:14,level:.25}],e:[{hz:530,q:7,level:1},{hz:1840,q:12,level:.45},{hz:2480,q:15,level:.22}],i:[{hz:270,q:5,level:1},{hz:2290,q:14,level:.4},{hz:3010,q:17,level:.2}],o:[{hz:570,q:7,level:1},{hz:840,q:8,level:.55},{hz:2410,q:15,level:.16}],u:[{hz:300,q:5,level:1},{hz:870,q:8,level:.4},{hz:2240,q:14,level:.12}]},ul=[yo.a,yo.e,yo.i,yo.o,yo.u];function Im(i,t={}){const e=i.context,n=Math.max(1,Math.min(10,t.voices??6)),s=Math.min(.95,Math.max(.05,t.density??.45)),o=t.pitch??135,r=t.variety??.5,a=e.createGain();a.gain.value=t.gain??.5;const c=e.createBiquadFilter();c.type="lowpass",c.frequency.value=t.distance??1700,c.Q.value=.6,c.connect(a);const l=[];for(let d=0;d<n;d++){const g=n===1?0:d/(n-1)*2-1,y=1+g*r*.35+(Math.random()*2-1)*.05,m=o*(1-g*r*.4)*(.95+Math.random()*.1),p=e.createGain();p.gain.value=.85/Math.sqrt(n),p.connect(c);const _=Pm(e,ul[0].map(b=>({...b,hz:b.hz*y})),p),w=e.createGain();w.gain.value=0,w.connect(_.input);const v=e.createOscillator();v.type="sawtooth",v.frequency.value=m,v.connect(w),v.start(),l.push({osc:v,envelope:w,bank:_,clock:In(e),length:.2,left:0,pitch:m,tract:y})}let h=!0;const u=(d,g)=>d.map(y=>({...y,hz:y.hz*g})),f=(d,g)=>{const y=.12+Math.random()*.14;d.length=y,d.left--;const m=d.left>=4,p=d.pitch*(m?1.1:.9+Math.random()*.2);d.osc.frequency.setTargetAtTime(p,g,y*.6);const _=.55+Math.random()*.45,w=y*.22;d.envelope.gain.setValueAtTime(0,g),d.envelope.gain.linearRampToValueAtTime(_,g+w),d.envelope.gain.linearRampToValueAtTime(_*.75,g+y*.75),d.envelope.gain.setTargetAtTime(0,g+y*.75,y*.12);const v=ul[Math.random()*ul.length|0];d.bank.shape(u(v,d.tract),g,y*.8)};return{output:a,setActive(d){if(h=d,d)for(const g of l)g.clock.reset();else for(const g of l)g.envelope.gain.value=0},update(){if(h)for(const d of l)d.clock.pump(g=>f(d,g),()=>{if(d.left>0)return d.length+.015+Math.random()*.06;d.left=3+Math.floor(Math.random()*6);const g=(1-s)*5.5;return d.length+.35+Math.random()*(.6+g)},"immediate")},dispose(){for(const d of l){try{d.osc.stop()}catch{}d.osc.disconnect(),d.envelope.disconnect(),d.bank.dispose()}l.length=0,c.disconnect(),a.disconnect()}}}const cS="modulepreload",lS=function(i,t){return new URL(i,t).href},lf={},Da=function(t,e,n){let s=Promise.resolve();if(e&&e.length>0){const r=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),c=a?.nonce||a?.getAttribute("nonce");s=Promise.allSettled(e.map(l=>{if(l=lS(l,n),l in lf)return;lf[l]=!0;const h=l.endsWith(".css"),u=h?'[rel="stylesheet"]':"";if(!!n)for(let g=r.length-1;g>=0;g--){const y=r[g];if(y.href===l&&(!h||y.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${l}"]${u}`))return;const d=document.createElement("link");if(d.rel=h?"stylesheet":cS,h||(d.as="script"),d.crossOrigin="",d.href=l,c&&d.setAttribute("nonce",c),document.head.appendChild(d),h)return new Promise((g,y)=>{d.addEventListener("load",g),d.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${l}`)))})}))}function o(r){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=r,window.dispatchEvent(a),!a.defaultPrevented)throw r}return s.then(r=>{for(const a of r||[])a.status==="rejected"&&o(a.reason);return t().catch(o)})};async function hS(i){try{const[{createFaustNode:t},{frictionMeta:e,frictionUrl:n}]=await Promise.all([Da(()=>Promise.resolve().then(()=>wm),void 0,import.meta.url),Da(()=>import("./friction-COj10vMJ.js"),[],import.meta.url)]);return await t(i,n,e)}catch(t){return console.warn("friction: faust tier unavailable — using the event fallback",t),null}}const hf=.42,uS=.08,uf=.4;function Lm(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("friction model built before the noise buffers were ready");const s=t.force??.55,o=t.pitch??180,r=t.decay??.5,a=t.bright??.5,c=t.roughness??.4,l=t.motion??"cycle",h=t.speed??.3,u=e.createGain();u.gain.value=t.gain??.5;const f=e.createGain();f.gain.value=1,f.connect(u);const d=e.createGain();d.gain.value=0,d.connect(u);const g=e.createGain();g.connect(f);const y=22+a*22,m=qs(e,[{hz:o,decay:r,level:1,q:y},{hz:o*2.41,decay:r*.7,level:.12+.55*a,q:y*.8},{hz:o*4.17,decay:r*.45,level:.06+.32*a,q:y*.6},{hz:o*6.83,decay:r*.3,level:.03+.18*a,q:y*.5}],g,{ring:"excitation"}),p=e.createBufferSource();p.buffer=n.pink,p.loop=!0;const _=e.createBiquadFilter();_.type="bandpass",_.frequency.value=o*1.6,_.Q.value=3.5;const w=e.createGain();w.gain.value=0,p.connect(_).connect(w).connect(f),p.start();const v=In(e);let b=0,S=l==="steady"?h:0,E=s,T=null,M=!0,x=1+Math.random()*4,A=!1,P=h,R=.8,F=Math.random(),D=null,N=!1;const H=hS(e).then(V=>{if(!V)return;if(N){V.dispose();return}D=V,V.node.connect(d),V.set("force",s),V.set("pitch",o),V.set("decay",r),V.set("bright",a),V.set("roughness",c),V.set("gain",.7),V.set("speed",b);const et=e.currentTime;d.gain.setTargetAtTime(1,et,uf/3),f.gain.setTargetAtTime(0,et,uf/3)});function G(V){if(x-=V,x<=0&&(A=!A,x=A?2+Math.random()*5:5+Math.random()*14,P=h*(.6+Math.random()*.7),R=.55+Math.random()*.65,F=0),!A){S=0;return}F+=V*R,S=P*Math.max(0,Math.sin(F*Math.PI*2))**.55}return{output:u,ready:H,setSpeed(V){T=Math.max(0,Math.min(1,V))},setForce(V){E=Math.max(0,Math.min(1,V)),D?.set("force",E)},get usingFaust(){return D!==null},get loop(){return D},get currentSpeed(){return b},update(V,et,lt){if(!M)return;if(T!==null)S=T,T=null;else if(l==="cycle")G(V);else if(l==="weather"){const rt=Math.max(0,et.weather.strengthAt(lt.x,lt.z)-hf);S=Math.min(1,(rt/(1-hf))**1.6)*h}if(b+=(S-b)*Math.min(1,V/uS),D?.set("speed",b),D)return;const bt=e.currentTime;if(b<.01){w.gain.setTargetAtTime(0,bt,.2),v.reset();return}w.gain.setTargetAtTime(.022*E*b**.7,bt,.12);const Lt=2+b*26,J=E*.5*(.3+.7/(1+b*6));v.pump(rt=>{const K=.7+Math.random()*.6;for(const $ of m.inputs)Pn(e,n.white,$,rt,J*K,.003)},xi(Lt),"immediate")},setActive(V){M=V,V||(w.gain.setTargetAtTime(0,e.currentTime,.1),v.reset(),D?.set("speed",0),b=0)},dispose(){N=!0,p.stop(),p.disconnect(),_.disconnect(),w.disconnect(),m.dispose(),g.disconnect(),D?.dispose(),d.disconnect(),f.disconnect(),u.disconnect()}}}const dS=7,df=.3,ff=.4;async function fS(i){try{const[{createFaustNode:t},{waveguideMeta:e,waveguideUrl:n}]=await Promise.all([Da(()=>Promise.resolve().then(()=>wm),void 0,import.meta.url),Da(()=>import("./waveguide-DEcBmVT0.js"),[],import.meta.url)]);return await t(i,n,e)}catch(t){return console.warn("waveguide: faust tier unavailable — using the modal fallback",t),null}}function Dm(i,t={}){const e=i.context,n=i.noise;if(n===null)throw new Error("waveguide built before the noise buffers were ready");const s=n.white,o=t.pitch??440,r=t.decay??2,a=t.bright??.5,c=t.closed??!1,l=t.place??.22,h=t.excite??"chime",u=t.drive??.5,f=t.weather??!1,d=e.createGain();d.gain.value=(t.gain??.5)*3.2;const g=e.createGain();g.gain.value=0,g.connect(d);const y=e.createGain();y.gain.value=1,y.connect(d);const m=e.createGain();m.gain.value=1;const p=e.createBufferSource();p.buffer=s,p.loop=!0;const _=e.createBiquadFilter();_.type="bandpass",_.frequency.value=o*(c?.5:1),_.Q.value=.9;const w=e.createGain();w.gain.value=0,p.connect(_).connect(w).connect(m),p.start();const v=c?o*.5:o,S=qs(e,(c?[1,3,5,7]:[1,2,3,4]).map((R,F)=>({hz:v*R,decay:r/(1+F*.6),level:(.2+a*.8)**F,q:60+a*60})),y,{ring:"filter",maxQ:200});for(const R of S.inputs)m.connect(R);const E=In(e);let T=null,M=!1,x=!0;const A=fS(e).then(R=>{if(!R)return;if(M){R.dispose();return}T=R,m.connect(R.node),R.node.connect(g),R.set("pitch",o),R.set("decay",r),R.set("bright",a),R.set("closed",c?1:0),R.set("place",l),R.set("gain",.7);const F=e.currentTime;g.gain.setTargetAtTime(1,F,ff/3),y.gain.setTargetAtTime(0,F,ff/3)});function P(R,F){Pn(e,s,m,R,F*.5,.0016)}return{output:d,ready:A,get loop(){return T},get usingFaust(){return T!==null},strike(R=1){P(e.currentTime+.02,R)},update(R,F,D){if(!x)return;const N=Math.max(0,F.weather.strengthAt(D.x,D.z)-df)/(1-df),H=f?u*N**2:u,G=e.currentTime;if(h==="breath"){w.gain.setTargetAtTime(H*.09,G,.25);return}if(w.gain.setTargetAtTime(0,G,.25),H<.02){E.reset();return}E.pump(V=>P(V,.35+Math.random()*.65),xi(dS*H),"oneGap")},setActive(R){x=R,R||(w.gain.setTargetAtTime(0,e.currentTime,.1),E.reset())},dispose(){M=!0,p.stop(),p.disconnect(),_.disconnect(),w.disconnect(),S.dispose(),m.disconnect(),T?.dispose(),g.disconnect(),y.disconnect(),d.disconnect()}}}function pS(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("drip built before the noise buffers were ready");const s=t.radius??[.0018,.0032],o=t.cycles??30,r=t.tick??.35,a=e.createGain();a.gain.value=t.gain??.5;const c=e.createBiquadFilter();return c.type="bandpass",c.frequency.value=3800,c.Q.value=3,c.connect(a),{output:a,fire(l,h){return Pn(e,n.white,c,l,h*r,.0016),Ia(e,a,l+.0015,{radius:La(s[0],s[1]),level:h*.55,cycles:o*(.85+Math.random()*.3),rise:.34})+.02},dispose(){c.disconnect(),a.disconnect()}}}const mS=[{ratio:.5,decay:1,level:.5},{ratio:1,decay:.72,level:.85},{ratio:1.2,decay:.55,level:.7},{ratio:1.5,decay:.42,level:.45},{ratio:2,decay:.35,level:1},{ratio:2.5,decay:.2,level:.3},{ratio:2.67,decay:.17,level:.26},{ratio:3,decay:.13,level:.22},{ratio:4,decay:.09,level:.16},{ratio:5.33,decay:.06,level:.1},{ratio:6.4,decay:.04,level:.07}];function gS(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("bell built before the noise buffers were ready");const s=t.hz??168,o=t.decay??14,r=t.strike??.4,a=t.warble??1,c=Math.max(1,t.strokes??1),l=t.interval??2.4,h=e.createGain();h.gain.value=t.gain??.5;const u=e.createBiquadFilter();u.type="bandpass",u.frequency.value=s*9,u.Q.value=1.6,u.connect(h);const f=(g,y,m,p,_)=>{const w=e.createOscillator();w.type="sine",w.frequency.value=s*y,w.detune.value=_;const v=e.createGain();v.gain.setValueAtTime(p,g),v.gain.exponentialRampToValueAtTime(p*5e-4,g+m),w.connect(v).connect(h),w.start(g),w.stop(g+m+.02)},d=(g,y)=>{Pn(e,n.white,u,g,y*r,.004);let m=0;for(const p of mS){const _=y*p.level*.14*(.85+Math.random()*.3),w=o*p.decay*(.9+Math.random()*.2),v=a*p.ratio*1.6;f(g,p.ratio,w,_,-v),f(g,p.ratio,w,_,v),m=Math.max(m,w)}return m};return{output:h,fire(g,y){let m=0;for(let p=0;p<c;p++){const _=g+p*l*(1+(Math.random()*2-1)*.02);m=_-g+d(_,y*(p===0?1:.9))}return m},dispose(){u.disconnect(),h.disconnect()}}}const pf=[{hz:512,decay:.3,level:.4},{hz:1183,decay:.85,level:.72},{hz:1794,decay:1.15,level:1},{hz:2741,decay:.7,level:.5},{hz:4310,decay:.4,level:.28}];function yS(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("hammer built before the noise buffers were ready");const s=t.tone??1,o=Math.min(.9,Math.max(0,t.damping??.3)),r=t.bounces??2,a=e.createGain();a.gain.value=t.gain??.7;const c=qs(e,pf.map(h=>({hz:h.hz*s,decay:h.decay*(1-o),level:h.level})),a),l=(h,u,f)=>{const d=f?.0022:.0035;c.inputs.forEach((g,y)=>{Pn(e,n.white,g,h,u*pf[y].level,d)}),tc(e,a,h,u*(f?.5:.16),165*s,62*s,.075,.003)};return{output:a,fire(h,u){l(h,u,!0);let f=.13+Math.random()*.05,d=u*.3;for(let g=0;g<r;g++)l(h+f,d*(.7+Math.random()*.5),!1),f+=(.13+Math.random()*.05)*Math.pow(.66,g+1),d*=.5;return f+1.3*(1-o)+.2},dispose(){c.dispose(),a.disconnect()}}}const vS={wood:{count:9,over:.34,energyDecay:.13,hz:380,q:2.1,level:.5,thumpHz:120},pot:{count:7,over:.28,energyDecay:.1,hz:950,q:4.2,level:.42,thumpHz:175},metal:{count:11,over:.42,energyDecay:.16,hz:1750,q:5.5,level:.4,thumpHz:210},stone:{count:6,over:.22,energyDecay:.07,hz:640,q:1.6,level:.55,thumpHz:95}};function wS(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("clatter built before the noise buffers were ready");const s=vS[t.material??"wood"],o=t.tone??1,r=t.heft??.5,a=e.createGain();a.gain.value=t.gain??.6;const c={...s,hz:s.hz*o,count:t.pieces??s.count},l=pm(e,c,a);return{output:a,fire(h,u){return Pn(e,n.white,l.input,h,u*1.4,.012+Math.random()*.01),tc(e,a,h,u*r*.55,s.thumpHz*o,s.thumpHz*o*.45,.08,.004),mm(e,n.white,l.input,c,h+.02,u),c.over*1.4+.15},dispose(){l.dispose(),a.disconnect()}}}const _S={dog:{f0:[440,235],onset:.62,syllables:[2,4],length:[.085,.135],gap:[.2,.34],attack:.06,rasp:.34,open:[{hz:880,q:6,level:1},{hz:1620,q:9,level:.55},{hz:3100,q:12,level:.3}],close:[{hz:520,q:7,level:.7},{hz:1180,q:8,level:.3},{hz:2600,q:12,level:.12}],variance:.14},sheep:{f0:[355,300],onset:.82,syllables:[1,2],length:[.55,1.05],gap:[.35,.6],attack:.14,rasp:.22,open:[{hz:620,q:7,level:1},{hz:1720,q:11,level:.42},{hz:2650,q:14,level:.18}],close:[{hz:700,q:7,level:.9},{hz:1500,q:10,level:.3},{hz:2600,q:14,level:.12}],vibrato:{hz:13,cents:105},variance:.1},cow:{f0:[168,108],onset:.72,syllables:[1,1],length:[1.1,1.8],gap:[.5,.8],attack:.22,rasp:.16,open:[{hz:390,q:6,level:1},{hz:800,q:8,level:.5},{hz:1900,q:12,level:.14}],close:[{hz:330,q:6,level:.85},{hz:720,q:8,level:.3},{hz:1750,q:12,level:.08}],vibrato:{hz:5.5,cents:35},variance:.08},fowl:{f0:[880,620],onset:.7,syllables:[3,6],length:[.045,.085],gap:[.09,.21],attack:.12,rasp:.55,open:[{hz:1450,q:8,level:1},{hz:2700,q:11,level:.5},{hz:4200,q:14,level:.22}],close:[{hz:1150,q:8,level:.6},{hz:2400,q:11,level:.25},{hz:3900,q:14,level:.1}],variance:.16}};function dl(i){return i[0]+Math.random()*(i[1]-i[0])}function mf(i,t){return i.map(e=>({...e,hz:e.hz*t}))}function xS(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("animal built before the noise buffers were ready");const s=_S[t.kind??"dog"],o=t.tone??1,r=Math.min(1,(t.rasp??0)+s.rasp),a=e.createGain();a.gain.value=t.gain??.6;const c=mf(s.open,o),l=mf(s.close,o),h=Pm(e,c,a),u=[];let f=0;const d=(y,m,p,_)=>{const w=e.createGain();w.connect(h.input);const v=e.createOscillator();v.type="sawtooth";const b=_,S=b*s.onset,E=m*s.attack;v.frequency.setValueAtTime(S,y),v.frequency.exponentialRampToValueAtTime(b,y+E),v.frequency.exponentialRampToValueAtTime(Math.max(b*(s.f0[1]/s.f0[0]),20),y+m),v.connect(w),v.start(y);let T=null;if(s.vibrato){T=e.createOscillator(),T.frequency.value=s.vibrato.hz*(.85+Math.random()*.3);const P=e.createGain();P.gain.value=s.vibrato.cents,T.connect(P).connect(v.detune),T.start(y),u.push(P)}let M=null;if(r>.01){M=e.createBufferSource(),M.buffer=n.white,M.playbackRate.value=.8+Math.random()*.5;const P=e.createGain();P.gain.value=r*.55,M.connect(P).connect(w),M.start(y,Math.random()*Math.max(n.white.duration-2,0)),u.push(P)}const x=Math.max(.02,m*.28);w.gain.setValueAtTime(0,y),w.gain.linearRampToValueAtTime(p,y+E),w.gain.linearRampToValueAtTime(p*.62,y+m-x),w.gain.setTargetAtTime(0,y+m-x,x/3);const A=y+m+x*3;v.stop(A),T?.stop(A),M?.stop(A),u.push(w),f=Math.max(f,A),h.shape(c,y,E),h.shape(l,y+m*.55,m*.45)};let g=0;return{output:a,fire(y,m){f=y;const p=Math.round(dl(s.syllables)),_=s.f0[0]*o*(1+(Math.random()*2-1)*s.variance);let w=y;for(let b=0;b<p;b++){const S=dl(s.length);d(w,S,m*Math.pow(.86,b)*(.85+Math.random()*.3),_),w+=S+dl(s.gap)}const v=f-y;return window.clearTimeout(g),g=window.setTimeout(()=>{for(const b of u)b.disconnect();u.length=0},(v+.4)*1e3),v},dispose(){window.clearTimeout(g);for(const y of u)y.disconnect();u.length=0,h.dispose(),a.disconnect()}}}function Nm(i,t){switch(t.sound){case"hammer":return yS(i,t.options);case"clatter":return wS(i,t.options);case"animal":return xS(i,t.options);case"drip":return pS(i,t.options);case"bell":return gS(i,t.options)}}const MS=[5,.4,5];class bS{context;voices=[];clock;centre=new C;spread=new C;force;gap;active=!0;constructor(t,e){this.context=t.context,this.centre.set(...e.at),this.spread.set(...e.spread??MS),this.force=e.force??[.55,1];const n=Math.max(e.every,.05);this.gap=e.rhythm==="periodic"?Mm(n,.09):xi(1/n),this.clock=In(t.context);const s=Math.max(1,e.voices??2);for(let o=0;o<s;o++){const r=Nm(t,e);this.voices.push({shot:r,busyUntil:0,emitter:new _m(t,r,{position:this.centre,refDistance:e.refDistance,maxDistance:e.maxDistance,rolloff:e.rolloff,reverb:e.reverb,importance:e.importance,ignoreAbsorption:e.ignoreAbsorption,ignoreOcclusion:e.ignoreOcclusion,invertDistance:e.invertDistance})})}}setActive(t){if(t!==this.active){this.active=t,t&&this.clock.reset();for(const e of this.voices)e.emitter.enabled=t}}update(t,e,n){for(const s of this.voices)s.emitter.update(t,e,n);if(this.active){if(this.voices.every(s=>s.emitter.isVirtual)){this.clock.reset();return}this.clock.pump(s=>this.fire(s),this.gap,"oneGap")}}fire(t){const e=this.voices.find(r=>r.busyUntil<=t);if(!e||e.emitter.isVirtual)return;gf.set(this.centre.x+(Math.random()*2-1)*this.spread.x,this.centre.y+(Math.random()*2-1)*this.spread.y,this.centre.z+(Math.random()*2-1)*this.spread.z),e.emitter.moveTo(gf);const[n,s]=this.force,o=e.shot.fire(t,n+Math.random()*(s-n));e.busyUntil=t+o}trigger(){this.fire(this.context.currentTime+.02)}get shots(){return this.voices.map(t=>t.shot)}get voiceCount(){return this.voices.length}dispose(){for(const t of this.voices)t.emitter.dispose();this.voices.length=0}}const gf=new C,Cu={};function yf(i,t){switch(t.model){case"wind":return xm(i,t.options);case"foliage":return bm(i,t.options);case"machine":return Sm(i,t.options);case"bird":return Em(i,t.options);case"fire":return Tm(i,t.options);case"rain":return Rm(i,t.options);case"water":return Cm(i,t.options);case"crowd":return Im(i,t.options);case"friction":return Lm(i,t.options);case"waveguide":return Dm(i,t.options)}}class SS{engine;emitters=[];models=new Map;emitterById=new Map;fields=new Map;beds=[];bedBus=null;scatter=[];active=!0;constructor(t,e){this.engine=t;const n=e.bed?Array.isArray(e.bed)?e.bed:[e.bed]:[];if(n.length>0){const s=t.context.createGain();s.connect(t.dry),this.bedBus=s;for(const o of n){const r=yf(t,o),a=t.context.createGain();a.gain.value=o.gain??1,r.output.connect(a).connect(s),this.beds.push(r),o.id&&this.models.set(o.id,r)}}for(const s of e.emitters??[]){const o=yf(t,s);s.id&&this.models.set(s.id,o);const r=new _m(t,o,{position:new C(...s.at),refDistance:s.refDistance,maxDistance:s.maxDistance,rolloff:s.rolloff,reverb:s.reverb,importance:s.importance,ignoreAbsorption:s.ignoreAbsorption,ignoreOcclusion:s.ignoreOcclusion,invertDistance:s.invertDistance});this.emitters.push(r),s.id&&this.emitterById.set(s.id,r)}for(const s of e.scatter??[]){const o=new bS(t,s);this.scatter.push(o),s.id&&this.fields.set(s.id,o)}}setActive(t){if(t!==this.active){this.active=t;for(const e of this.emitters)e.enabled=t;for(const e of this.scatter)e.setActive(t);this.bedBus?.gain.setTargetAtTime(t?1:0,this.engine.context.currentTime,.15)}}setBedLevel(t,e=.35){!this.bedBus||!this.active||this.bedBus.gain.setTargetAtTime(t,this.engine.context.currentTime,e)}update(t,e,n){if(this.active){for(const s of this.beds)s.update?.(t,this.engine,this.engine.listenerPosition);for(const s of this.emitters)s.update(t,e,n);for(const s of this.scatter)s.update(t,e,n)}}find(t){return this.models.get(t)??null}findField(t){return this.fields.get(t)??null}setSolo(t){if(this.active){for(const[e,n]of this.emitterById)n.enabled=t===null||e===t;for(const[e,n]of this.fields)n.setActive(t===null||e===t)}}get emitterCount(){return this.emitters.length+this.scatter.reduce((t,e)=>t+e.voiceCount,0)}get occludedCount(){return this.emitters.filter(t=>t.isOccluded).length}dispose(){for(const t of this.emitters)t.dispose();this.emitters.length=0,this.emitterById.clear();for(const t of this.scatter)t.dispose();this.scatter.length=0,this.fields.clear();for(const t of this.beds)t.dispose();this.beds.length=0,this.bedBus?.disconnect(),this.models.clear()}}const nr={sky:!0,fogColor:"#bcd4e6",fogNear:25,fogFar:140,sunIntensity:2.2,sunColor:16773848,fillIntensity:1.15,fillColor:14735040,ambientIntensity:1.8,ambientSky:10339560,ambientGround:9076584,room:"open",surface:"earth",footstepReverb:.7,soundscape:{bed:{model:"wind",id:"wind",options:{gain:.17,tone:3400}}}},Ys={sky:!1,fogColor:"#0d0f12",fogNear:6,fogFar:34,sunIntensity:1.1,sunColor:16770748,fillIntensity:.75,fillColor:9412792,ambientIntensity:2.1,ambientSky:9078390,ambientGround:4867130,room:"cell",surface:"wood",footstepReverb:.5,soundscape:Cu},ES=.12,TS=[];class AS{definition;group=null;constructor(t){this.definition=t}get id(){return this.definition.id}get name(){return this.definition.name}get environment(){return this.definition.environment}get spawn(){return this.definition.spawn}get fogVolumes(){return this.definition.fogVolumes??TS}get floor(){return this.definition.floor??-20}settle(t){const e=this.definition.groundAt;if(!e)return t;const n=t.position.clone();return n.y=e(n.x,n.z)+ES,{position:n,yaw:t.yaw}}root(){return this.group===null&&(this.group=this.definition.build(),this.group.name=`zone:${this.definition.id}`,this.group.updateWorldMatrix(!0,!0)),this.group}get isBuilt(){return this.group!==null}dispose(){this.group!==null&&(this.group.traverse(t=>{(t instanceof ne||t instanceof gu||t instanceof Vp)&&t.geometry.dispose()}),this.group.clear(),this.group=null)}}const RS=1.15;function CS(i,t=new C){return t.set(Math.sin(i),0,Math.cos(i))}function PS(i){if(i.arrival)return{position:i.arrival.position.clone(),yaw:i.arrival.yaw};const t=CS(i.yaw);return{position:i.position.clone().addScaledVector(t,RS),yaw:i.yaw+Math.PI}}class IS{byZone=new Map;byDoor=new Map;add(t,e){this.addSide(t.id,t.a,t.b,e),this.addSide(t.id,t.b,t.a,e)}addSide(t,e,n,s){const o={portal:t,end:e,target:n,arrival:PS(n),door:null,title:"Door",label:e.label??s(n.zone)},r=this.byZone.get(e.zone);r?r.push(o):this.byZone.set(e.zone,[o])}in(t){return this.byZone.get(t)??[]}bind(t,e,n){t.door=e,t.title=n,e.userData.portal=t,this.byDoor.set(e,t)}unbind(t){t.door&&this.byDoor.delete(t.door),t.door=null}sideOf(t){let e=t;for(;e;){const n=this.byDoor.get(e);if(n)return n;e=e.parent}return null}all(){return[...this.byZone.values()].flat()}}function LS(i,t,e){const n=new Set([t]);let s=[t];for(let o=0;o<e;o++){const r=[];for(const a of s)for(const c of i.in(a)){const l=c.target.zone;n.has(l)||(n.add(l),r.push(l))}if(r.length===0)break;s=r}return n}const DS=2,NS=3.2,US=.15;function FS(i,t){return i.userData.label=t,i}function OS(i){for(let t=i;t;t=t.parent){const e=t.userData.label;if(typeof e=="string")return e}return null}class kS{reach=NS;raycaster=new Nx;targets=[];constructor(){this.raycaster.far=this.reach}setTargets(t){this.targets=t}get targetCount(){return this.targets.length}probe(t,e){if(this.targets.length===0)return null;t.updateWorldMatrix(!0,!1),fl.setFromMatrixPosition(t.matrixWorld),pl.set(0,0,-1).applyQuaternion(t.getWorldQuaternion(zS)),this.raycaster.far=this.reach,this.raycaster.set(fl,pl);const n=this.raycaster.intersectObjects(this.targets,!0);if(n.length===0)return null;const s=n[0],o=e.raycast(fl,pl);return o!==null&&o<s.distance-US?null:{object:s.object,distance:s.distance}}}const fl=new C,pl=new C,zS=new ti,kh={timber:[{leaf:L.TIMBER,ledge:L.TIMBER_DARK,iron:L.IRON,frame:L.STONE_DARK},{leaf:I(L.TIMBER,1.18),ledge:L.TIMBER,iron:L.IRON_DARK,frame:L.STONE},{leaf:L.TIMBER_DARK,ledge:I(L.TIMBER_DARK,.78),iron:L.IRON_DARK,frame:L.STONE_DARK},{leaf:8212278,ledge:6044200,iron:L.IRON_DARK,frame:L.STONE_DARK},{leaf:4537395,ledge:5720380,iron:L.RUST,frame:L.STONE_DARK}],plank:[{leaf:L.TIMBER_PALE,ledge:L.TIMBER,iron:L.RUST,frame:L.TIMBER_DARK},{leaf:9866620,ledge:7564124,iron:L.RUST,frame:L.TIMBER_DARK},{leaf:10256993,ledge:8021323,iron:L.IRON,frame:I(L.TIMBER_DARK,.88)}]},BS=["timber","plank"];function Um(i={}){const{seed:t=1,scale:e=1}=i,n=wt(t),s=[],o=i.material??n.pick(BS),r=n.pick(kh[o]),a=I(r.leaf,n.range(.94,1.06)),c=n.range(.94,1.16),l=n.range(2,2.28),h=n.range(.07,.1),u=n.range(.13,.18),f=h*2.4;for(const x of[-1,1]){const A=new k(u,l+u,f);A.translate(x*(c+u)/2,(l+u)/2,-f*.18),s.push({geometry:A,color:r.frame,sway:0})}const d=new k(c+u*2.6,u,f*1.1);if(d.translate(0,l+u/2,-f*.18),s.push({geometry:d,color:r.frame,sway:0}),n.chance(.55)){const x=new k(c+u*2.2,.06,f*1.5);x.translate(0,.03,-f*.1),s.push({geometry:x,color:r.frame,sway:0})}const g=new k(c,l,.02);g.translate(0,l/2,-h*.5),s.push({geometry:g,color:1316378,sway:0});const y=n.int(4,6),m=c/y;for(let x=0;x<y;x++){const A=h*n.range(.88,1),P=new k(m*.94,l*n.range(.985,1),A);P.translate(-c/2+m*(x+.5),l/2,A/2),s.push({geometry:P,color:I(a,n.range(.95,1.05)),sway:0})}const p=n.chance(.4)?[l*.16,l*.52,l*.87]:[l*.18,l*.82],_=h*.42;for(const x of p){const A=new k(c*.96,n.range(.1,.15),_);A.translate(0,x,h+_/2),s.push({geometry:A,color:r.ledge,sway:0})}const w=n.chance(.5)?-1:1,v=_*.5;for(const x of[p[0],p[p.length-1]]){const A=c*n.range(.45,.7),P=new k(A,.055,v);P.translate(w*(c/2-A/2),x,h+_+v/2),s.push({geometry:P,color:r.iron,sway:0});const R=new k(.07,.09,v*2.2);R.translate(w*(c/2+.02),x,h+v),s.push({geometry:R,color:r.iron,sway:0})}const b=-w*c*n.range(.3,.36),S=l*n.range(.44,.5);if(n.chance(.5)){const x=new Y(.062,.062,.02,8);x.rotateX(Math.PI/2),x.translate(b,S,h+.01),s.push({geometry:x,color:r.iron,sway:0});const A=new Y(.022,.026,.05,6);A.rotateX(Math.PI/2),A.translate(b,S,h+.043),s.push({geometry:A,color:r.iron,sway:0});const P=new ee(.052,0);P.scale(1,1,.78),P.translate(b,S,h+.095),s.push({geometry:P,color:r.iron,sway:0})}else{const x=new k(.045,.2,.045);x.translate(b,S,h+.055),s.push({geometry:x,color:r.iron,sway:0});for(const A of[-.09,.09]){const P=new k(.05,.05,.05);P.translate(b,S+A,h+.025),s.push({geometry:P,color:r.iron,sway:0})}}const E=pt(s);e!==1&&E.scale(e,e,e);const T=_t(E,"hut-door",0),M={width:(c+u*2)*e,height:(l+u)*e,depth:(h+_+v)*e,material:o};return T.userData.door=M,T}const HS={name:"hut-door",display:"Wood Door",category:"structures",radius:.9,build:Um};function Fm(i={}){const{seed:t=1,scale:e=1}=i,n=wt(t),s=[],o=n.chance(.35)?n.range(.55,.9):n.range(.08,.3),r=n.range(1,1.24),a=n.range(2.1,2.35),c=.05,l=n.range(.11,.15),h=I(L.IRON,n.range(.92,1.06)),u=I(L.IRON_DARK,n.range(.9,1.05)),f=x=>tm(L.RUST,x,L.IRON),d=(x,A)=>{const P=1-Math.min(Math.max(A/a,0),1),R=Math.min(Math.abs(x)/(r/2),1);return Math.min(o*(.08+.4*P*P+.14*R*R),.85)},g=c*2.6;for(const x of[-1,1]){const A=new k(l,a+l,g);A.translate(x*(r+l)/2,(a+l)/2,-g*.18),s.push({geometry:A,color:u,sway:0,wear:o*.4,wearTint:f(u)});const P=new k(l*1.7,.035,g*1.4);P.translate(x*(r+l)/2,.018,-g*.1),s.push({geometry:P,color:I(u,.85),sway:0,wear:o*.55,wearTint:f(I(u,.85))})}const y=new k(r+l*2.4,l,g*1.05);if(y.translate(0,a+l/2,-g*.18),s.push({geometry:y,color:u,sway:0,wear:o*.3,wearTint:f(u)}),n.chance(.7)){const x=new k(r+l*1.6,.045,g*1.5);x.translate(0,.022,-g*.05),s.push({geometry:x,color:I(u,.8),sway:0,wear:o*.5,wearTint:f(I(u,.8))})}const m=new k(r,a,c,6,10,1);m.translate(0,a/2,c/2),s.push({geometry:m,color:h,sway:0,wear:(x,A)=>d(x,A),wearTint:f(h)});const p=.02,_=[a*.14,a*.5,a*.86];for(const x of _){const A=new k(r*.98,n.range(.09,.12),p);A.translate(0,x,c+p/2),s.push({geometry:A,color:I(h,1.08),sway:0,wear:o*.3,wearTint:f(I(h,1.08))});const P=5;for(let R=0;R<P;R++){const F=-r*.42+r*.84*R/(P-1),D=new Y(.016,.02,.016,6);D.rotateX(Math.PI/2),D.translate(F,x,c+p+.008),s.push({geometry:D,color:I(h,.85),sway:0,wear:o*.3,wearTint:f(I(h,.85))})}}const w=new k(r*.98,a*.13,.012);if(w.translate(0,a*.065,c+.006),s.push({geometry:w,color:I(h,.72),sway:0,wear:o*.2,wearTint:f(I(h,.72))}),n.chance(.45)){const x=n.range(.22,.3),A=n.range(.28,.36),P=a*.74,R=new k(x+.07,A+.07,.018);R.translate(0,P,c+.009),s.push({geometry:R,color:I(u,1.05),sway:0,wear:o*.25,wearTint:f(I(u,1.05))});const F=new k(x,A,.014);F.translate(0,P,c+.02),s.push({geometry:F,color:2305076,sway:0});for(const D of[-x/4,x/4]){const N=new Y(.011,.011,A+.05,6);N.translate(D,P,c+.032),s.push({geometry:N,color:I(u,.9),sway:0,wear:o*.3,wearTint:f(I(u,.9))})}}const v=n.chance(.5)?-1:1;for(const x of[a*.2,a*.8]){const A=new Y(.028,.028,.16,6);A.translate(v*(r/2+.02),x,c*.6),s.push({geometry:A,color:I(u,.9),sway:0,wear:o*.3,wearTint:f(I(u,.9))})}const b=-v*r*n.range(.32,.38),S=a*n.range(.44,.5);if(n.chance(.5)){for(const A of[-.12,.12]){const P=new k(.035,.035,.05);P.translate(b,S+A,c+.025),s.push({geometry:P,color:I(h,.8),sway:0})}const x=new Y(.017,.017,.3,6);x.translate(b,S,c+.058),s.push({geometry:x,color:I(h,1.15),sway:0})}else{const x=new Y(.042,.042,.024,8);x.rotateX(Math.PI/2),x.translate(b,S,c+.012),s.push({geometry:x,color:I(h,.8),sway:0});const A=new k(.16,.032,.026);A.rotateZ(n.range(-.25,.1)),A.translate(b-v*.055,S,c+.037),s.push({geometry:A,color:I(h,1.15),sway:0})}const E=pt(s);e!==1&&E.scale(e,e,e);const T=_t(E,"factory-door",0),M={width:(r+l*2)*e,height:(a+l)*e,depth:(c+p+.024)*e,material:"iron"};return T.userData.door=M,T}const GS={name:"factory-door",display:"Metal Door",category:"structures",radius:.9,build:Fm};function vf(i){return i.userData.door}const VS={timber:"Wood Door",plank:"Wood Door",iron:"Metal Door"};function WS(i){return VS[i]}const XS=["timber","iron","plank"];function qS(i={}){const{seed:t=1,scale:e=1}=i,n=i.material??wt(t).pick(XS);return n==="iron"?Fm({seed:t,scale:e}):Um({seed:t,scale:e,material:n})}function wf(){return new Promise(i=>{requestAnimationFrame(()=>requestAnimationFrame(()=>i()))})}class YS{root;bar;label;shown=!1;constructor(t){this.root=document.createElement("div"),this.root.id="building";const e=document.createElement("div");e.className="loading-track",this.bar=document.createElement("div"),this.bar.className="loading-bar",e.appendChild(this.bar),this.label=document.createElement("div"),this.label.className="loading-label",this.root.append(e,this.label),t.appendChild(this.root)}async show(t){this.label.textContent=t,this.bar.style.animation="none",this.bar.style.transform="scaleX(0.04)",this.root.classList.add("is-shown"),this.shown=!0,await wf()}async step(t,e){this.shown&&(this.label.textContent=t,e===void 0?(this.bar.style.transition="none",this.bar.style.animation="building-sweep 900ms ease-in-out infinite"):(this.bar.style.animation="none",this.bar.style.transition="",this.bar.style.transform=`scaleX(${Math.min(Math.max(e,0),1)})`),await wf())}hide(){this.shown&&(this.shown=!1,this.bar.style.animation="none",this.root.classList.remove("is-shown"))}dispose(){this.root.remove()}}const $S={level:.55,click:{hz:3200,q:6,duration:.004,level:.5},modes:[{hz:180,decay:.16,q:5,level:1},{hz:430,decay:.1,q:6,level:.55},{hz:950,decay:.055,q:7,level:.25}],thump:{from:112,to:82,decay:.13,level:.55}},ZS={level:.5,click:{hz:5200,q:9,duration:.005,level:.6},modes:[{hz:240,decay:.34,q:9,level:.8},{hz:620,decay:.28,q:11,level:.6},{hz:1450,decay:.2,q:12,level:.35},{hz:2900,decay:.12,q:10,level:.18}],thump:{from:78,to:62,decay:.3,level:.7}},KS={level:.42,click:{hz:2400,q:5,duration:.003,level:.35},modes:[{hz:320,decay:.08,q:5,level:.8},{hz:720,decay:.055,q:6,level:.45},{hz:1600,decay:.035,q:6,level:.2}],thump:{from:150,to:120,decay:.07,level:.3}},jS={timber:$S,iron:ZS,plank:KS};function JS(i){return Math.max(i.thump.decay,...i.modes.map(e=>e.decay))*3+Om+.05}const Om=.032;function Qr(i,t){return i+Math.random()*(t-i)}class QS{engine;constructor(t){this.engine=t}play(t,e="timber"){const n=jS[e],s=this.engine.context;if(s.state!=="running"||!this.engine.noise)return;const o=s.currentTime+.02,r=[],a=this.buildOutput(n,t,r),c=qs(s,[{hz:n.click.hz,decay:n.click.duration,level:n.click.level,q:n.click.q}],a),l=qs(s,n.modes,a);this.excite(c.inputs[0],n.click.level,o,6e-4,n.click.duration*1.5,r);const h=o+Om;n.modes.forEach((f,d)=>{this.excite(l.inputs[d],f.level*Qr(.92,1.08),h,.002,f.decay,r)}),tc(s,a,h,n.thump.level,n.thump.from*Qr(.96,1.04),n.thump.to,n.thump.decay,.004);const u=JS(n);window.setTimeout(()=>{for(const f of r)f.disconnect();c.dispose(),l.dispose()},(o-s.currentTime+u)*1e3+250)}buildOutput(t,e,n){const s=this.engine.context,o=s.createGain();o.gain.value=t.level;const r=s.createPanner();r.panningModel="HRTF",r.distanceModel="inverse",r.refDistance=1.6,r.maxDistance=45,r.rolloffFactor=1.1,tE(r,e);const a=s.createGain();return a.gain.value=.9,o.connect(r),r.connect(this.engine.dry),r.connect(a),a.connect(this.engine.send),n.push(o,r,a),o}excite(t,e,n,s,o,r){const a=this.engine.context,c=this.engine.noise;if(!c)return;const l=a.createBufferSource();l.buffer=c.white,l.playbackRate.value=Qr(.9,1.1);const h=a.createGain();er(h.gain,n,e,s,o),l.connect(h).connect(t),l.start(n,Qr(0,c.white.duration-1),o*3+.05),l.stop(n+o*3+.06),r.push(l,h)}}function tE(i,t){i.positionX?(i.positionX.value=t.x,i.positionY.value=t.y,i.positionZ.value=t.z):i.setPosition(t.x,t.y,t.z)}class eE{zones=new Map;portals=new IS;lights;options;audio=null;doorAudio=null;soundscapes=new Map;warmed=new Set;entering=0;building=new YS(document.body);arrived=!1;active=null;doored=new Set;clutterShadows=!1;transitioning=!1;hovered=null;crossings=0;onZoneChange=null;constructor(t){this.options=t,this.lights={sun:new w0(16773848,2.2),fill:new w0(9412792,0),ambient:new Rx(10339560,4998454,1.5)},this.lights.sun.position.set(-70,90,50);const e=this.lights.sun.shadow;e.mapSize.set(4096,4096);const n=48;e.camera.left=-n,e.camera.right=n,e.camera.top=n,e.camera.bottom=-n,e.camera.near=55,e.camera.far=225,e.bias=-8e-5,e.normalBias=.006,e.intensity=.34,this.lights.fill.position.set(9,7,-7),t.scene.add(this.lights.sun,this.lights.fill,this.lights.ambient)}get sunDirection(){return this.lights.sun.position}setShadows(t){this.lights.sun.castShadow=t}setClutterShadows(t){if(t!==this.clutterShadows){this.clutterShadows=t;for(const e of this.zones.values())e.isBuilt&&e.root().traverse(n=>{n instanceof ne&&n.userData.clutter===!0&&(n.castShadow=t)})}}register(t){const e=new AS(t);return this.zones.set(e.id,e),e}link(t){for(const e of[t.a,t.b])if(!this.zones.has(e.zone))throw new Error(`portal ${t.id} refers to unknown zone "${e.zone}"`);this.portals.add(t,e=>this.zones.get(e)?.name??e)}prebuild(t){const e=this.zones.get(t);if(!e)return;const n=this.prepare(e);n.updateWorldMatrix(!0,!0),this.options.collider.warm(n,e.id),this.warmed.add(e.id)}get builtZones(){return[...this.zones.values()].filter(t=>t.isBuilt).map(t=>t.id)}evict(){if(!this.active)return;const t=LS(this.portals,this.active.id,DS);for(const e of this.zones.values()){if(!e.isBuilt||t.has(e.id))continue;e.dispose(),this.options.collider.invalidate(e.id),this.doored.delete(e.id),this.warmed.delete(e.id);for(const s of this.portals.in(e.id))this.portals.unbind(s);const n=this.soundscapes.get(e.id);n&&(n.dispose(),this.soundscapes.delete(e.id)),this.evicted++}}evicted=0;get evictions(){return this.evicted}surfaceAt(t,e){const n=this.active;return n?n.definition.surfaceAt?.(t,e)??n.environment.surface:"earth"}attachAudio(t){this.audio=t,this.doorAudio=new QS(t.engine),this.active&&this.applyAudio(this.active)}get current(){return this.active}get isTransitioning(){return this.transitioning}async enter(t,e){const n=this.zones.get(t);if(!n)throw new Error(`no such zone "${t}"`);const s=++this.entering,o=()=>s!==this.entering,{scene:r,collider:a,player:c,postfx:l,interaction:h}=this.options,u=!this.warmed.has(n.id)&&this.arrived;if(u&&(await this.building.show(`entering ${n.name.toLowerCase()}`),await this.building.step("raising the world"),o()))return;this.active&&this.active!==n&&r.remove(this.active.root());const f=this.prepare(n);if(u&&(await this.building.step("settling the ground"),o()))return;r.add(f),this.active=n,f.updateWorldMatrix(!0,!0),a.build(f,n.id),this.warmed.add(n.id),u&&await this.building.step("almost there",.96);const d=n.environment;l.setEnvironment({sky:d.sky,fogColor:d.fogColor,fogNear:d.fogNear,fogFar:d.fogFar,fogVolumes:n.fogVolumes}),this.lights.sun.intensity=d.sunIntensity,this.lights.sun.color.setHex(d.sunColor),this.lights.fill.intensity=d.fillIntensity,this.lights.fill.color.setHex(d.fillColor),this.lights.ambient.intensity=d.ambientIntensity,this.lights.ambient.color.setHex(d.ambientSky),this.lights.ambient.groundColor.setHex(d.ambientGround),this.applyAudio(n);const g=this.portals.in(n.id).map(m=>m.door).filter(m=>m!==null);f.traverse(m=>{typeof m.userData.label=="string"&&g.push(m)}),h.setTargets(g);const y=n.settle(e??n.spawn);c.teleport(y.position,y.yaw),this.hovered=null,this.options.reticle.set(null),this.onZoneChange?.(n),this.arrived=!0,this.building.hide(),this.evict()}applyAudio(t){if(!this.audio)return;this.audio.engine.setRoom(t.environment.room),this.audio.footsteps.surface=t.environment.surface,this.audio.footsteps.setReverb(t.environment.footstepReverb);let e=this.soundscapes.get(t.id);e||(e=new SS(this.audio.engine,t.environment.soundscape),this.soundscapes.set(t.id,e));for(const[n,s]of this.soundscapes)s.setActive(n===t.id)}updateSound(t,e){this.active&&this.soundscapes.get(this.active.id)?.update(t,this.options.collider,e)}get sound(){return this.active?this.soundscapes.get(this.active.id)??null:null}prepare(t){const e=t.root();if(this.doored.has(t.id))return e;this.doored.add(t.id);for(const n of this.portals.in(t.id)){const s=n.end,o=qS({seed:s.seed??1,material:s.material});o.position.copy(s.position),o.rotation.y=s.yaw,ge(o),e.add(o),this.portals.bind(n,o,WS(vf(o).material))}return e.traverse(n=>{if(!(n instanceof ne))return;const s=n.userData.noCollide===!0,o=n.name==="flatGround"||n.name==="terrain",r=n.userData.clutter===!0;n.castShadow=!s&&!o&&(!r||this.clutterShadows),n.receiveShadow=!s}),e}update(){const{interaction:t,collider:e,player:n,reticle:s}=this.options;if(this.transitioning)return s.set(null),null;const o=t.probe(n.camera,e);if(this.hovered=o?this.portals.sideOf(o.object):null,this.hovered)s.set({title:this.hovered.title,target:this.hovered.label});else{const r=OS(o?.object??null);s.set(r?{title:r}:null)}return this.hovered}async use(t){if(this.transitioning)return;this.transitioning=!0,this.options.reticle.set(null);const e=t.door?vf(t.door).material:"timber";_f.copy(t.end.position).setY(t.end.position.y+1.2),this.doorAudio?.play(_f,e),await this.options.fade.cover(async()=>{await this.enter(t.target.zone,t.arrival),this.crossings++}),this.transitioning=!1}respawn(){const t=this.active;t&&this.options.player.teleport(t.spawn.position,t.spawn.yaw)}dispose(){const{scene:t}=this.options;this.active&&t.remove(this.active.root()),t.remove(this.lights.sun,this.lights.fill,this.lights.ambient);for(const e of this.soundscapes.values())e.dispose();this.soundscapes.clear();for(const e of this.zones.values())e.dispose();this.zones.clear(),this.doored.clear()}}const _f=new C,nE=.14,xf=.22;class iE{element;title;target;joiner;shown=!1;showing="";constructor(t){this.element=document.createElement("div"),this.element.id="prompt",this.element.setAttribute("aria-live","polite");const e=document.createElement("span");e.className="prompt-lines",this.title=document.createElement("span"),this.title.className="prompt-title",this.joiner=document.createElement("span"),this.joiner.className="prompt-to",this.joiner.textContent="to",this.target=document.createElement("span"),this.target.className="prompt-target",e.append(this.title,this.joiner,this.target),this.element.append(e),t.appendChild(this.element)}set(t){const e=t!==null;if(t){const n=`${t.title}\0${t.target}`;if(n!==this.showing){this.showing=n,this.title.textContent=t.title,this.target.textContent=t.target??"";const s=!!t.target;this.joiner.hidden=!s,this.target.hidden=!s}}e!==this.shown&&(this.shown=e,this.element.classList.toggle("is-shown",e))}dispose(){this.element.remove()}}class sE{element;constructor(t){this.element=document.createElement("div"),this.element.id="fade",t.appendChild(this.element)}async cover(t){this.element.classList.add("is-black"),await ml(xf),await t(),await ml(nE),this.element.classList.remove("is-black"),await ml(xf)}dispose(){this.element.remove()}}function ml(i){return new Promise(t=>window.setTimeout(t,i*1e3))}const oE=6,rE=.55,aE=.42;class cE{element;renderer;pixel=new Uint8Array(4);countdown=0;onLight=!1;constructor(t,e=document.getElementById("crosshair")){this.renderer=t,this.element=e}update(){if(!this.element||this.countdown-- >0)return;this.countdown=oE;const t=this.renderer.getContext();this.renderer.setRenderTarget(null);const e=t.drawingBufferWidth,n=t.drawingBufferHeight;if(e===0||n===0)return;t.readPixels(e>>1,n>>1,1,1,t.RGBA,t.UNSIGNED_BYTE,this.pixel);const s=(.2126*this.pixel[0]+.7152*this.pixel[1]+.0722*this.pixel[2])/255,o=this.onLight?s>aE:s>rE;o!==this.onLight&&(this.onLight=o,this.element.classList.toggle("on-light",o))}}const ir={floor:L.TIMBER,floorSeam:1315085,wall:L.CLOTH,wallTrim:L.TIMBER_DARK,ceiling:L.TIMBER_DARK,beam:L.BARK},ec={floor:L.STONE_DARK,floorSeam:921618,wall:L.STONE,wallTrim:L.IRON,ceiling:4015178,beam:L.RUST};function Mi(i){const{width:t,depth:e,height:n,seed:s=1,style:o=ir,planks:r=!0,beams:a=3,thickness:c=.35}=i,l=wt(s),h=[],u=c,f=t+u*2,d=e+u*2,g=r?-.006:0,y=new k(f,u,d);y.translate(0,g-u/2,0),h.push({geometry:y,color:r?o.floorSeam:o.floor,sway:0});const m=new k(f,u,d);m.translate(0,n+u/2,0),h.push({geometry:m,color:o.ceiling,sway:0});for(const _ of[-1,1]){const w=new k(f,n,u);w.translate(0,n/2,_*(e+u)/2),h.push({geometry:w,color:o.wall,sway:0})}for(const _ of[-1,1]){const w=new k(u,n,d);w.translate(_*(t+u)/2,n/2,0),h.push({geometry:w,color:o.wall,sway:0})}if(r){const _=l.range(.24,.34),w=Math.ceil(t/_),v=.012;for(let b=0;b<w;b++){const S=-t/2+(b+.5)*_,E=new k(_-v,.03,e);E.translate(S,-.015,0),h.push({geometry:E,color:I(o.floor,l.around(1,.09)),sway:0})}}if(a>0){const _=l.range(.16,.24);for(let w=0;w<a;w++){const v=-e/2+(w+.5)/a*e,b=new k(f,_,l.range(.18,.26));b.translate(0,n-_/2,v),h.push({geometry:b,color:o.beam,sway:0})}}const p=.16;for(const _ of[-1,1]){const w=new k(t,p,.06);w.translate(0,p/2,_*(e-.06)/2),h.push({geometry:w,color:o.wallTrim,sway:0})}for(const _ of[-1,1]){const w=new k(.06,p,e);w.translate(_*(t-.06)/2,p/2,0),h.push({geometry:w,color:o.wallTrim,sway:0})}return _t(pt(h),"interior",0)}const Na={name:"hut",category:"structures",radius:2.6,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(3,4.4),o=e.range(2.6,3.8),r=e.range(2,2.6),a=e.range(.4,.8),c=e.range(.9,1.5),l=new Y(c,c,s*1.16,3,1);l.rotateZ(Math.PI/2),l.rotateX(Math.PI/6),l.scale(1,1,o*1.2/(c*2)),l.computeBoundingBox(),l.translate(0,r-(l.boundingBox?.min.y??0),0),n.push({geometry:l,color:L.STONE,sway:0});const h=r,u=new k(s,a,o);u.translate(0,a/2,0),n.push({geometry:u,color:L.STONE_DARK,sway:0});const f=new k(s*.97,h-a,o*.97);f.translate(0,a+(h-a)/2,0),n.push({geometry:f,color:L.TIMBER,sway:0});const d=e.range(.75,.95),g=e.range(1.5,1.8),y=e.around(0,s*.15),m=new k(d,g,.08);m.translate(y,g/2,o*.487),n.push({geometry:m,color:1514012,sway:0});const p=new k(d*1.3,.14,.16);p.translate(y,g+.07,o*.49),n.push({geometry:p,color:L.TIMBER_DARK,sway:0});for(const b of[-1,1])for(const S of[-1,1]){const E=new k(.16,h,.16);E.translate(b*s/2,h/2,S*o/2),n.push({geometry:E,color:L.TIMBER_DARK,sway:0})}const _=pt(n);t!==1&&_.scale(t,t,t);const w=_t(_,"hut",0),v={x:y*t,z:o*.487*t,width:d*t,height:g*t};return w.userData.doorAnchor=v,w}};function lE(i){return i.userData.doorAnchor}const Mf=[{name:"small",weight:.3,scale:[.55,.75]},{name:"ordinary",weight:.45,scale:[.85,1.15]},{name:"large",weight:.18,scale:[1.5,1.9]},{name:"huge",weight:.07,scale:[2.1,2.6]}],ji={name:"crate",category:"objects",radius:1.2,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[];let s=e(),o=Mf[1];for(const m of Mf)if(s-=m.weight,s<=0){o=m;break}const r=e.range(o.scale[0],o.scale[1]),a=e.range(.5,.9)*r,c=e.range(.45,.8)*r,l=e.range(.5,.9)*r,h=e.around(0,.35),u=new k(a,c,l);u.translate(0,c/2,0),u.rotateY(h),n.push({geometry:u,color:L.TIMBER,sway:0});const f=Math.max(2,Math.round(2+r*.9+(e.chance(.3)?1:0))),d=.05*Math.min(r,1.5),g=1.02;for(let m=0;m<f;m++){const p=c*(.13+m/Math.max(f-1,1)*.74),_=new k(a*g,d,l*g);_.translate(0,p,0),_.rotateY(h),n.push({geometry:_,color:L.TIMBER_DARK,sway:0})}if(r>1.2||e.chance(.25)){const m=.055*Math.min(r,1.6);for(const p of[-1,1])for(const _ of[-1,1]){const w=new k(m,c*.96,m);w.translate(p*a/2,c*.48,_*l/2),w.rotateY(h),n.push({geometry:w,color:L.RUST,sway:0})}}if(e.chance(.35)){const m=new k(a*.92,.05*r,l*.92);m.translate(e.around(0,.08*r),c+.03*r,e.around(0,.08*r)),m.rotateY(h+e.around(0,.25)),n.push({geometry:m,color:L.TIMBER_DARK,sway:0})}const y=pt(n);return t!==1&&y.scale(t,t,t),_t(y,"crate",0)}},bi={name:"barrel",category:"objects",radius:.55,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(.75,1.05),o=e.range(.3,.4),r=o*e.range(.78,.88),a=e.int(8,11),c=e.chance(.25),l=[new tt(0,0),new tt(r,0),new tt(o,s*.35),new tt(o,s*.65),new tt(r,s),new tt(0,s)];n.push({geometry:new ei(l,a),color:L.TIMBER,sway:0});for(const u of[.14,.5,.86]){const f=u>.3&&u<.7?o:r+(o-r)*.45,d=new Y(f*1.04,f*1.04,.055,a);d.translate(0,s*u,0),n.push({geometry:d,color:L.IRON,sway:0})}let h=pt(n);return c&&(h.rotateX(Math.PI/2),h.rotateY(e.range(0,Math.PI*2)),h.translate(0,o,0)),t!==1&&(h=h.scale(t,t,t)),_t(h,"barrel",0)}},Pu={name:"bed",category:"furniture",radius:1.3,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(.9,1.25),o=e.range(1.85,2.15),r=e.range(.26,.4),a=e.range(.07,.1),c=e.chance(.55)?L.TIMBER_DARK:L.BARK,l=e.pick([L.CLOTH,L.WOOL,L.HIDE_PALE]),h=e.pick([L.HIDE,L.LEAF_DARK,L.RUST,L.STONE_DARK]),u=e.chance(.5)?-1:1;for(const E of[-1,1]){const T=new k(a,r*.55,o);T.translate(E*(s-a)/2,r*.72,0),n.push({geometry:T,color:c,sway:0})}for(const E of[-1,1])for(const T of[-1,1]){const M=r*(T===u?1.05:.98),x=new k(a,M,a);x.translate(E*(s-a)/2,M/2,T*(o-a)/2),n.push({geometry:x,color:c,sway:0})}const f=e.range(.34,.62),d=new k(s,f,.055);if(d.translate(0,r+f/2-.04,u*o/2),n.push({geometry:d,color:c,sway:0}),e.chance(.55)){const E=f*e.range(.3,.5),T=new k(s,E,.05);T.translate(0,r+E/2-.04,-u*o/2),n.push({geometry:T,color:c,sway:0})}const g=r+e.range(.14,.2),y=6,m=(o-.1)/y;for(let E=0;E<y;E++){const T=-o/2+.05+(E+.5)*m,M=u<0?E/(y-1):1-E/(y-1),x=1-.22*Math.sin(M*Math.PI)*e.range(.4,1),A=(g-r*.72)*x,P=new k(s-a*1.4,A,m*1.04);P.translate(0,r*.72+A/2,T),n.push({geometry:P,color:l,sway:0})}const p=o*e.range(.6,.75),_=4,w=p/_,v=-u*o/2;for(let E=0;E<_;E++){const T=v+u*((E+.5)*w),M=e.range(.045,.075),x=new k(s-a*.6,M,w*1.02);x.translate(0,g+M/2-.01,T),n.push({geometry:x,color:h,sway:0})}const b=new k(s-a*.6,.05,.09);if(b.translate(0,g+.05,v+u*p),n.push({geometry:b,color:I(h,1.18),sway:0}),e.chance(.85)){const E=e.range(.26,.36),T=new k(s*e.range(.5,.72),e.range(.09,.14),E);T.translate(e.around(0,s*.1),g+.06,u*(o/2-E*.8)),T.rotateY(e.around(0,.18)),n.push({geometry:T,color:I(l,1.12),sway:0})}const S=pt(n);return t!==1&&S.scale(t,t,t),_t(S,"bed",0)}},bf=[{weight:.28,width:[.7,1],depth:[.5,.68]},{weight:.47,width:[1.2,1.7],depth:[.7,.95]},{weight:.25,width:[2.1,3],depth:[.85,1.1]}],Yo={name:"table",category:"furniture",radius:1.6,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[];let s=e(),o=bf[1];for(const w of bf)if(s-=w.weight,s<=0){o=w;break}const r=e.range(o.width[0],o.width[1]),a=e.range(o.depth[0],o.depth[1]),c=e.range(.68,.78),l=e.range(.045,.07),h=r>1.5&&e.chance(.45),u=e.chance(.6)?L.TIMBER:L.TIMBER_DARK,f=u===L.TIMBER?L.TIMBER_DARK:L.TIMBER,d=e.int(3,5),g=a/d,y=.008;for(let w=0;w<d;w++){const v=new k(r,l*e.range(.93,1),g-y);v.translate(0,c-l/2,-a/2+(w+.5)*g),n.push({geometry:v,color:I(u,e.around(1,.07)),sway:0})}const m=c-l,p=c-l*.6;if(h){const w=r*e.range(.16,.24);for(const b of[-1,1]){const S=b*(r/2-w),E=new k(.09,.07,a*.86);E.translate(S,.035,0),n.push({geometry:E,color:f,sway:0});const T=e.range(.09,.13),M=new k(T,m-.07,a*.2);M.translate(S,.07+(m-.07)/2,0),n.push({geometry:M,color:f,sway:0});const x=new k(.09,.06,a*.8);x.translate(S,p-.03,0),n.push({geometry:x,color:f,sway:0})}const v=new k(r-w*1.2,.07,.07);v.translate(0,m*e.range(.32,.42),0),n.push({geometry:v,color:f,sway:0})}else{const w=e.range(.055,.085),v=r/2-w*.9,b=a/2-w*.9;for(const S of[-1,1])for(const E of[-1,1]){const T=new k(w,p,w);T.translate(S*v,p/2,E*b),n.push({geometry:T,color:f,sway:0})}if(e.chance(.7)){for(const E of[-1,1]){const T=new k(v*2,.07,.03);T.translate(0,m-.07/2-.02,E*b),n.push({geometry:T,color:f,sway:0})}for(const E of[-1,1]){const T=new k(.03,.07,b*2);T.translate(E*v,m-.07/2-.02,0),n.push({geometry:T,color:f,sway:0})}}}const _=pt(n);return t!==1&&_.scale(t,t,t),_t(_,"table",0)}},Ua={name:"chair",category:"furniture",radius:.45,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(.42,.5),o=e.range(.38,.46),r=e.range(.36,.44),a=e.range(.04,.06),c=e.range(.44,.66),l=e.pick(["slats","spindles","board"]),h=e.chance(.55)?L.TIMBER:L.TIMBER_DARK,u=h===L.TIMBER?L.TIMBER_DARK:L.TIMBER,f=new k(o,a,r);f.translate(0,s-a/2,0),n.push({geometry:f,color:h,sway:0});const d=e.range(.035,.048),g=o/2-d*.7,y=r/2-d*.7,m=s-a*.4;for(const w of[-1,1]){const v=new k(d,m,d);v.translate(w*g,m/2,y),n.push({geometry:v,color:u,sway:0})}for(const w of[-1,1]){const v=new k(d,m,d);v.translate(w*g,m/2,-y),n.push({geometry:v,color:u,sway:0});const b=a*.4+.02,S=new k(d,c+b,d);S.translate(w*g,s+c/2-b/2,-y),n.push({geometry:S,color:u,sway:0})}const p=(w,v)=>{w.translate(0,s+v,-y)};if(l==="board"){const w=c*e.range(.4,.55),v=new k(o*.86,w,.03);p(v,c-w*.62),n.push({geometry:v,color:h,sway:0})}else if(l==="slats"){const w=e.int(2,3);for(let v=0;v<w;v++){const b=c*(.42+v/Math.max(w-1,1)*.5),S=new k(o*.84,e.range(.06,.1),.026);p(S,b),n.push({geometry:S,color:h,sway:0})}}else{const w=e.int(3,5),v=o*.72,b=c*.93,S=.02,E=b+S;for(let M=0;M<w;M++){const x=-v/2+M/(w-1)*v,A=new k(.026,E,.026);A.translate(x,E/2-S,0),p(A,0),n.push({geometry:A,color:u,sway:0})}const T=new k(o*.84,.055,.032);p(T,b),n.push({geometry:T,color:h,sway:0})}if(e.chance(.6)){const w=new k(g*2,.026,.026);w.translate(0,s*e.range(.28,.36),y),n.push({geometry:w,color:u,sway:0})}const _=pt(n);return t!==1&&_.scale(t,t,t),_t(_,"chair",0)}},Fa={name:"stool",category:"furniture",radius:.42,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.chance(.45)?3:4,o=e.range(.42,.56),r=e.range(.16,.23),a=e.range(.04,.07),c=e.chance(.5)?L.TIMBER:L.TIMBER_DARK,l=c===L.TIMBER?L.TIMBER_DARK:L.TIMBER,h=s===3?new Y(r,r*.96,a,6):new k(r*1.9,a,r*1.9);h.translate(0,o-a/2,0),s===4&&h.rotateY(e.around(0,.2)),n.push({geometry:h,color:c,sway:0});const u=o-a,f=e.range(.14,.26),d=r*.66,g=u/Math.cos(f);for(let p=0;p<s;p++){const _=p/s*Math.PI*2+(s===4?Math.PI/4:0),w=e.range(.035,.05),v=Math.cos(_),b=Math.sin(_),S=new k(w,g,w);S.translate(0,-g/2,0),S.rotateZ(f),S.rotateY(-_),S.translate(v*d,u,b*d),n.push({geometry:S,color:l,sway:0})}const y=d+g*Math.sin(f);if(s===4&&e.chance(.45)){const p=e.range(.28,.38),_=d+(y-d)*(1-p);for(const w of[0,Math.PI/2]){const v=new k(_*2,.028,.028);v.translate(0,u*p,0),v.rotateY(w+Math.PI/4),n.push({geometry:v,color:l,sway:0})}}const m=pt(n);return t!==1&&m.scale(t,t,t),_t(m,"stool",0)}},hE=[{shape:"cone",weight:.3},{shape:"orb",weight:.2},{shape:"wedge",weight:.16},{shape:"drum",weight:.14},{shape:"block",weight:.11},{shape:"spike",weight:.09}];function uE(i){let t=i();for(const e of hE)if(t-=e.weight,t<=0)return e.shape;return"cone"}const dE={cone:.3,wedge:.3,drum:.4,block:.4,orb:.5,spike:.85};function fE(i,t,e){switch(i){case"cone":return new jt(t*1.15,t*e.range(2.2,3.2),e.int(5,8));case"wedge":return new jt(t*1.3,t*e.range(1.6,2.2),4);case"drum":return new Y(t*1.1,t*1.15,t*e.range(1.1,1.7),7);case"block":return new k(t*1.7,t*e.range(1.6,2.3),t*1.5);case"spike":return new Ge(t*1.3,0);case"orb":default:return new ee(t,0)}}function pE(i,t,e,n){switch(i.int(0,3)){case 0:return{geometry:new k(t*2,n,t*1.3),halfDepth:t*.65};case 1:return{geometry:new Y(e,t,n,i.int(5,7)),halfDepth:t*.85};case 2:return{geometry:new Y(t,e,n,4),halfDepth:t*.75};default:return{geometry:new Y(t,e,n,i.int(5,7)),halfDepth:t*.85}}}function Sf(i,t,e,n){return i?new k(t*2,n,t*2):new Y(t,e,n,5)}function Gn(i,t,e=0){return new C(t*(i.reach+.03+e),i.hold,.16)}const mE=[(i,t,e)=>{const n=i.range(.11,.16),s=Gn(t,e,n*.6),o=new Y(n*.6,n*.4,n,7);return o.translate(s.x,s.y+n/2,s.z),[{geometry:o,color:i.pick([L.WOOL,L.RUST]),sway:0}]},(i,t,e)=>{const n=i.range(.14,.2),s=Gn(t,e,n),o=new ee(n,0);o.scale(1,1.15,1),o.translate(s.x,s.y+n*.7,s.z);const r=new Y(n*.32,n*.45,n*.8,6);r.translate(s.x,s.y+n*1.8,s.z);const a=i.pick([L.RUST,L.COW_BLACK]);return[{geometry:o,color:a,sway:0},{geometry:r,color:a,sway:0}]},(i,t,e)=>{const n=i.range(.1,.15),s=Gn(t,e,n),o=new ee(n,0);return o.scale(1,i.range(.7,.95),i.range(.8,1.1)),o.rotateX(i.range(0,Math.PI)),o.rotateY(i.range(0,Math.PI)),o.translate(s.x,s.y,s.z),[{geometry:o,color:i.pick([L.STONE_DARK,L.COW_BLACK]),sway:0}]},(i,t,e)=>{const n=[],s=Gn(t,e,.04),o=i.range(.28,.45),r=new Y(.012,.016,o,4);r.translate(s.x,s.y+o/2,s.z),n.push({geometry:r,color:L.BARK,sway:.45});const a=i.int(3,6);for(let c=0;c<a;c++){const l=new ee(i.range(.055,.085),0);l.scale(1,.4,.85),l.rotateY(i.range(0,Math.PI)),l.rotateZ(i.around(0,.5)),l.translate(s.x+i.around(0,.07),s.y+o*i.range(.6,1.05),s.z+i.around(0,.06)),n.push({geometry:l,color:L.LEAF,sway:.7})}return n},(i,t,e)=>{const n=i.range(.11,.16),s=Gn(t,e,n*1.5),o=new ee(n,0);return o.scale(1.5,.75,.9),o.rotateY(i.around(0,.4)),o.translate(s.x,s.y+.03,s.z),[{geometry:o,color:i.pick([L.BARK_PALE,L.MARKER_YELLOW]),sway:0}]},(i,t,e)=>{const n=i.range(.16,.23),s=Gn(t,e,n),o=new ee(n,0);return o.scale(1,i.range(.8,1.05),.9),o.rotateX(i.range(0,Math.PI)),o.translate(s.x,s.y+.06,s.z),[{geometry:o,color:i.pick([L.WOOL,L.RUST]),sway:0}]},(i,t,e)=>{const n=i.range(.2,.28),s=Gn(t,e,n*.55),o=new k(n*.75,n,.03);return o.rotateZ(e*i.range(.15,.45)),o.translate(s.x,s.y+n*.3,s.z),[{geometry:o,color:i.pick([L.COW_BLACK,L.WOOL]),sway:0}]},(i,t,e)=>{const n=Gn(t,e,.07),s=i.range(.1,.18),o=new Y(.01,.01,s,4);o.translate(n.x,n.y+s/2,n.z);const r=new k(.12,.15,.12);r.translate(n.x,n.y-.07,n.z);const a=new jt(.095,.06,4);return a.translate(n.x,n.y+.02,n.z),[{geometry:o,color:L.IRON,sway:0},{geometry:r,color:L.MARKER_YELLOW,sway:0},{geometry:a,color:L.IRON,sway:0}]},(i,t,e)=>{const n=i.range(.24,.36),s=Gn(t,e,n*.5),o=new Ge(n*.36,0);o.scale(1.9,.85,.5),o.rotateZ(e*.8),o.translate(s.x,s.y-n*.25,s.z);const r=new jt(n*.16,n*.24,3);return r.scale(1,1,.4),r.rotateZ(e*.8+Math.PI),r.translate(s.x+e*n*.32,s.y-n*.25-n*.42,s.z),[{geometry:o,color:L.STONE_PALE,sway:0},{geometry:r,color:L.STONE,sway:0}]}],gl=[{name:"held",weight:.52,build:(i,t,e)=>i.pick(mE)(i,t,e)},{name:"pauldron",weight:.18,build:(i,t,e)=>{const n=new ee(i.range(.09,.14),0);return n.scale(1.15,.65,1.05),n.rotateY(i.range(0,Math.PI)),n.translate(e*(t.chest+.04),t.shoulder-.02,0),[{geometry:n,color:L.IRON,sway:0}]}},{name:"pack",weight:.19,build:(i,t,e)=>{const n=i.range(.2,.32),s=i.range(.24,.4),o=i.range(.12,.2),r=new k(n,s,o);return r.rotateY(i.around(0,.2)),r.translate(e*i.range(0,.07),t.shoulder-s*.55,-(t.depth+o*.4)),[{geometry:r,color:L.TIMBER_DARK,sway:0}]}},{name:"horn",weight:.08,build:(i,t,e)=>{const n=i.range(.14,.3),s=new jt(i.range(.02,.035),n,4);return s.translate(0,n/2,0),s.rotateZ(e*i.range(.5,1.1)),s.rotateX(i.around(0,.3)),s.translate(e*.05,t.height*.97,0),[{geometry:s,color:L.SKIN,sway:0}]}}];function Ef(i){let t=i()*gl.reduce((e,n)=>e+n.weight,0);for(const e of gl)if(t-=e.weight,t<=0)return e;return gl[0]}const Ns={name:"figure",category:"people",radius:.55,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(1.55,2.05),o=e.range(.72,1.24),r=s*e.range(.44,.58),a=s*e.range(.78,.87),c=e.pick([L.CLOTH,L.TIMBER_DARK,L.STONE_DARK]),l=e.chance(.45),h=e.chance(.5)?1:-1,u=.19*o*e.range(.8,1.25),f=.15*o*e.range(.8,1.3),{geometry:d,halfDepth:g}=pE(e,u,f,a-r);d.translate(0,(a+r)/2,0),d.rotateY(e.around(0,.25)),n.push({geometry:d,color:c,sway:0});const y=e.range(.04,.22),m=new Y(.045,.06,y,5);m.translate(0,a+y/2,0),n.push({geometry:m,color:L.SKIN,sway:0});const p=e.range(.085,.15),_=uE(e),w=fE(_,p,e);w.scale(e.range(.82,1.08),e.range(.95,1.3),e.range(.85,1.12)),w.rotateZ(e.around(0,.16)),w.rotateY(e.range(0,Math.PI)),w.computeBoundingBox();const v=p*dE[_];w.translate(0,a+y-v-(w.boundingBox?.min.y??0),0),n.push({geometry:w,color:l?c:L.SKIN,sway:0});const b=e.range(.045,.075)*o,S=e.range(.03,.055)*o,E=(a-r)*e.range(.95,1.5),T=e.chance(.25),M=e.range(-.02,.09),x=e.range(.06,.11)*o,A=e.chance(.25),P=e.range(.04,.22);for(const D of[-1,1]){const N=r,H=Sf(T,b,b*.8,N);H.translate(0,-N/2,0),H.rotateZ(D*M),H.translate(D*x,r,0),n.push({geometry:H,color:L.TIMBER_DARK,sway:0});const G=Sf(A,S,S*.82,E);G.translate(0,-E/2,0),G.rotateZ(D*P),G.translate(D*(u+S*1.4),a-.03,0),n.push({geometry:G,color:c,sway:0})}const R={height:s,shoulder:a,hip:r,chest:u,reach:u+S*2.6,hold:a-E*.82,depth:g};e.chance(.62)&&(n.push(...Ef(e).build(e,R,h)),e.chance(.22)&&n.push(...Ef(e).build(e,R,h)));const F=pt(n);return t!==1&&F.scale(t,t,t),_t(F,"figure",0)}},Oa={name:"machine",category:"structures",radius:1.6,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(2.1,2.8),o=e.range(.9,1.3),r=e.range(.32,.46),a=e.chance(.5)?L.IRON:L.STONE_DARK,c=e.chance(.6)?L.RUST:L.IRON,l=new k(s,r,o);l.translate(0,r/2,0),n.push({geometry:l,color:L.STONE_DARK,sway:0});for(const N of[-1,1])for(const H of[-1,1]){const G=new k(.22,.08,.22);G.translate(N*(s-.3)/2,.04,H*(o-.3)/2),n.push({geometry:G,color:c,sway:0})}const h=e.chance(.4)?"twin":e.chance(.5)?"stacked":"single",u=e.range(.34,.46)*(h==="single"?1:.82),f=s*e.range(.62,.74),d=-s*.12,g=(N,H,G)=>{const V=new Y(N,N,f,10);V.rotateZ(Math.PI/2),V.translate(d,H,G),n.push({geometry:V,color:a,sway:0});for(const et of[-.28,.08,.34]){const lt=new Y(N*1.06,N*1.06,.07,10);lt.rotateZ(Math.PI/2),lt.translate(d+f*et,H,G),n.push({geometry:lt,color:c,sway:0})}};let y=r+u*2;if(h==="twin"){const N=u*1.02;g(u,r+u,-N),g(u,r+u,N)}else if(h==="stacked"){const N=u*e.range(.7,.86);g(u,r+u,0),g(N,r+u*2+N*.92,0),y=r+u*2+N*1.9;for(const H of[-.3,.3]){const G=new k(.1,N*1.1,u*1.1);G.translate(d+f*H,r+u*2,0),n.push({geometry:G,color:c,sway:0})}}else g(u,r+u,0);const m=e.range(.52,.72),p=r+m*.82,_=e.chance(.5)?4:3,w=e.chance(.3),v=s/2+e.range(.16,.26),b=w?v*2:v+s*.28,S=w?0:v-b/2,E=new Y(.075,.075,b,8);E.rotateZ(Math.PI/2),E.translate(S,p,0),n.push({geometry:E,color:I(c,1.1),sway:0});const T=w?[-s*.34,s*.34]:[s*.16,s*.4];for(const N of T){const H=new k(.26,p-r+.12,.3);H.translate(N,r+(p-r)/2,0),n.push({geometry:H,color:L.STONE_DARK,sway:0});const G=new k(.3,.1,.34);G.translate(N,p,0),n.push({geometry:G,color:c,sway:0})}for(const N of w?[v,-v]:[v]){const H=new Y(m,m,.12,12);H.rotateZ(Math.PI/2),H.translate(N,p,0),n.push({geometry:H,color:a,sway:0});const G=new Y(.15,.15,.26,8);G.rotateZ(Math.PI/2),G.translate(N,p,0),n.push({geometry:G,color:c,sway:0});for(let V=0;V<_;V++){const et=new k(.07,m*1.85,.06);et.rotateX(Math.PI/2),et.rotateX(V/_*Math.PI),et.translate(N,p,0),n.push({geometry:et,color:I(a,.86),sway:0})}}const M=new k(s*.42,.08,.08);M.translate(d+f*.45,r+u*.9,m*.42),n.push({geometry:M,color:c,sway:0});const x=e.range(1.1,1.8),A=e.range(.11,.16),P=new Y(A*.85,A,x,8);P.translate(-s*.3,y+x/2-.1,0),n.push({geometry:P,color:a,sway:0});const R=new Y(A*1.3,A*1.1,.1,8);R.translate(-s*.3,y+x-.14,0),n.push({geometry:R,color:c,sway:0});const F=e.int(1,2);for(let N=0;N<F;N++){const H=e.range(-.3,.25),G=new Y(.07,.09,e.range(.16,.26),6);G.translate(d+f*H,y,0),n.push({geometry:G,color:c,sway:0});const V=new Y(.1,.1,.035,8);V.translate(d+f*H,y+.16,0),n.push({geometry:V,color:I(c,1.2),sway:0})}const D=pt(n);return t!==1&&D.scale(t,t,t),_t(D,"machine",0)}},Iu={name:"sink",category:"objects",radius:.65,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(.62,.86),o=e.range(.45,.6),r=e.range(.24,.34),a=e.range(.5,.68),c=e.range(.02,.032),l=I(9410203,e.range(.9,1.08)),h=I(l,.84),u=I(L.IRON,e.range(.85,1.05)),f=a+r,d=new k(s,c,o);d.translate(0,a+c/2,0),n.push({geometry:d,color:h,sway:0});for(const F of[-1,1]){const D=new k(s*.99,r,c);D.translate(0,a+r/2,F*(o-c)/2),n.push({geometry:D,color:l,sway:0});const N=new k(c,r*.985,o*.985);N.translate(F*(s-c)/2,a+r/2,0),n.push({geometry:N,color:l,sway:0})}for(const F of[-1,1]){const D=new k(s*1.04,c*1.4,c*2.2);D.translate(0,f,F*o/2),n.push({geometry:D,color:I(l,1.14),sway:0});const N=new k(c*2.2,c*1.35,o*.96);N.translate(F*s/2,f,0),n.push({geometry:N,color:I(l,1.14),sway:0})}if(e.chance(.4)){const F=new k(s-c*2.2,.02,o-c*2.2);F.translate(0,a+c+r*e.range(.12,.3),0),n.push({geometry:F,color:L.WATER,sway:0})}const g=e.range(.018,.026),y=e.range(.06,.1);for(const F of[-1,1])for(const D of[-1,1]){const N=new Y(g*.85,g,a,6);N.translate(F*(s-y*2)/2,a/2,D*(o-y*2)/2),n.push({geometry:N,color:u,sway:0})}if(e.chance(.55)){const F=a*e.range(.2,.32);for(const D of[0,1]){const N=D===0;for(const H of[-1,1]){const G=new k(N?s-y*2:g*1.2,g*1.1,N?g*1.2:o-y*2.4);G.translate(N?0:H*(s-y*2)/2,F,N?H*(o-y*2)/2:0),n.push({geometry:G,color:I(u,.88),sway:0})}}}const m=e.range(.16,.3),p=new k(s*1.02,m,c*1.6);p.translate(0,f+m/2,-o/2-c),n.push({geometry:p,color:I(l,.94),sway:0});const _=m+e.range(.1,.2),w=e.range(.012,.018),v=-o/2-c,b=new Y(w,w*1.15,_,6);b.translate(0,f+_/2,v),n.push({geometry:b,color:I(u,1.15),sway:0});const S=e.range(.14,.22),E=new Y(w*.9,w*.9,S,6);E.rotateX(Math.PI/2),E.translate(0,f+_,v+S/2),n.push({geometry:E,color:I(u,1.15),sway:0});const T=e.range(.05,.09),M=new Y(w*.8,w*.95,T,6);M.translate(0,f+_-T/2,v+S),n.push({geometry:M,color:I(u,1.05),sway:0});const x=e.chance(.75)?2:1,A=e.range(.1,.16),P=v+w*3.4;for(let F=0;F<x;F++){const D=x===1?0:F===0?-A:A,N=e.range(.05,.085),H=new Y(w*1.25,w*1.5,N,6);H.translate(D,f+N/2,P),n.push({geometry:H,color:I(u,1.05),sway:0});const G=new Y(w*.4,w*.5,w*1.4,6);G.translate(D,f+N+w*.7,P),n.push({geometry:G,color:I(u,1.15),sway:0});const V=e.range(0,Math.PI/2);for(const et of[0,1]){const lt=new k(w*3.4,w*.75,w*.72);lt.rotateY(V+(et?Math.PI/2:0)),lt.translate(D,f+N+w*1.5,P),n.push({geometry:lt,color:I(L.RUST,1.05),sway:0})}}const R=pt(n);return t!==1&&R.scale(t,t,t),_t(R,"sink",0)}},Tf=[{color:16760948,light:16758629,weight:.5},{color:16747100,light:16742984,weight:.32},{color:10475775,light:9423103,weight:.18}];function km(i){const t=i.range(0,1);let e=0;for(const n of Tf)if(e+=n.weight,t<=e)return n;return Tf[0]}const Lu=1.25;function zm(i,t,e,n,s,o){const r=new Ge(o,0);r.scale(1,2.4,1),r.translate(e,n,s),i.push({geometry:r,color:t.color,sway:0});const a=new Ge(o*4.2,0);a.scale(1,1.5,1),a.translate(e,n,s);const c=o*4.2*1.5;i.push({geometry:a,color:(l,h,u)=>{const f=Math.hypot(l-e,h-n,u-s)/c;return gE(t.color,Math.max(0,.34*(1-f)))},sway:0})}function gE(i,t){const e=Math.round((i>>16&255)*t),n=Math.round((i>>8&255)*t),s=Math.round((i&255)*t);return e<<16|n<<8|s}const yE=2.15,vE=14,ka={name:"candle",category:"objects",radius:.3,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=[],o=km(e),r=e.chance(.5)?14208430:12564904,a=e.chance(.35),c=e.range(.075,.11),l=I(L.IRON,e.range(.85,1.05));let h=0;if(a){const b=e.range(.16,.3),S=new Y(c*.62,c*1.05,.022,8);S.translate(0,.011,0),n.push({geometry:S,color:I(l,.86),sway:0});const E=new Y(.014,.019,b,6);if(E.translate(0,.022+b/2,0),n.push({geometry:E,color:l,sway:0}),e.chance(.6)){const T=new Y(c*.78,c*.5,.016,8);T.translate(0,.022+b*e.range(.45,.62),0),n.push({geometry:T,color:I(l,1.08),sway:0})}h=.022+b}const u=new Y(c,c*.88,.018,10);u.translate(0,h+.009,0),n.push({geometry:u,color:I(l,.94),sway:0}),h+=.018;const f=1+(e.chance(.42)?1:0)+(e.chance(.18)?1:0),d=c*.42;for(let b=0;b<f;b++){const S=b/f*Math.PI*2+e.range(0,Math.PI*2),E=f===1?0:Math.cos(S)*d,T=f===1?0:Math.sin(S)*d,M=e.range(.05,.16),x=e.range(.011,.016),A=e.range(0,.13),P=e.range(0,Math.PI*2),R=new Y(x*.92,x,M,7);R.translate(0,M/2,0),R.rotateX(Math.cos(P)*A),R.rotateZ(Math.sin(P)*A),R.translate(E,h,T);const F=h+M*.55;n.push({geometry:R,color:(G,V)=>V>F?o.color:r,sway:0});const D=E+Math.sin(Math.sin(P)*A)*M,N=T-Math.sin(Math.cos(P)*A)*M,H=h+M;zm(s,o,D,H+x*2.2,N,x*1.35),b===0&&vs.set(D,H+x*2.2,N)}const g=pt(n),y=pt(s),m=e.range(0,Math.PI*2);g.rotateY(m),y.rotateY(m),t!==1&&(g.scale(t,t,t),y.scale(t,t,t));const p=_t(g,"candle",0);p.add(Tn(y,"candle:glow"));const _=Math.cos(m)*vs.x+Math.sin(m)*vs.z,w=-Math.sin(m)*vs.x+Math.cos(m)*vs.z,v=new ts(o.light,yE*e.around(1,.15)*t*t,vE*t,Lu);return v.position.set(_*t,vs.y*t,w*t),v.castShadow=!1,p.add(v),p}},vs=new C,wE=60,_E=22,ta=15922406,Jn={name:"floodlight",category:"structures",radius:.6,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=[],o=e.range(1.9,2.7),r=e.range(.3,.42),a=r*e.range(.58,.72),c=r*e.range(.34,.46),l=e.range(.32,.6),h=I(L.IRON,e.range(.85,1.05)),u=I(8159880,e.range(.9,1.1)),f=e.range(.035,.05),d=new Y(f,f*1.1,o,6);d.translate(0,o/2,0),n.push({geometry:d,color:h,sway:0});const g=new Y(f*3.2,f*3.6,f*1.1,8);g.translate(0,f*.55,0),n.push({geometry:g,color:I(h,.85),sway:0});const y=new Y(f*1.5,f*1.5,f*2.6,6);y.rotateZ(Math.PI/2),y.translate(0,o,0),n.push({geometry:y,color:I(h,1.1),sway:0});const m=D=>{D.rotateX(l),D.translate(0,o,c*.6)},p=new k(r,a,c);m(p),n.push({geometry:p,color:u,sway:0});const _=new k(r*1.12,a*.16,c*1.5);_.translate(0,a*.56,c*.22),m(_),n.push({geometry:_,color:I(u,1.14),sway:0});const w=new k(r*.72,a*.62,c*.5);w.translate(0,0,-c*.68),m(w),n.push({geometry:w,color:I(u,.84),sway:0});const v=new k(r*.86,a*.7,c*.12);v.translate(0,0,c*.52),m(v),n.push({geometry:v,color:ta,sway:0});const b=e.range(5.5,8),S=e.range(.22,.34),E=r*.42,T=new jt(E+Math.tan(S)*b,b,10,1,!0);T.rotateX(-Math.PI/2),T.translate(0,0,c*.55+b/2),m(T),s.push({geometry:T,color:(D,N,H)=>{const G=Math.hypot(D,N-o,H)/b;return xE(ta,.3*Math.max(0,1-G)**1.6)},sway:0});const M=new Ge(E*.9,0);M.scale(1,.8,.5),M.translate(0,0,c*.56),m(M),s.push({geometry:M,color:ta,sway:0});const x=pt(n),A=pt(s);t!==1&&(x.scale(t,t,t),A.scale(t,t,t));const P=_t(x,"floodlight",0);P.add(Tn(A,"floodlight:glow"));const R=new Px(ta,wE*e.around(1,.1)*t*t,_E*t,S*1.15,.55,2);R.position.set(0,o*t,0);const F=new Ee;return F.position.set(0,(o-Math.sin(l)*b)*t,Math.cos(l)*b*t),P.add(F),R.target=F,R.castShadow=!1,P.add(R),P}};function xE(i,t){const e=Math.round((i>>16&255)*t),n=Math.round((i>>8&255)*t),s=Math.round((i&255)*t);return e<<16|n<<8|s}const Du={name:"pipes",category:"structures",radius:1.7,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(2.6,3.6),o=2,r=e.range(.06,.11),a=[L.RUST,4877172,7039548,L.IRON,8018492],c=I(e.pick(a),e.range(.9,1.1)),l=I(L.IRON,e.range(.85,1.05)),h=(y,m,p,_)=>{const w=new Y(_,_,m,8);w.rotateZ(Math.PI/2),w.translate(y,p,0),n.push({geometry:w,color:c,sway:0})},u=(y,m,p,_=1.45)=>{const w=new Y(p*_,p*_,p*.55,8);w.rotateZ(Math.PI/2),w.translate(y,m,0),n.push({geometry:w,color:I(l,1.05),sway:0})},f=e.int(3,5),d=[-s/2];for(let y=1;y<f;y++)d.push(-s/2+s*(y/f)*e.range(.82,1.18));d.push(s/2),d.sort((y,m)=>y-m);for(let y=0;y<d.length-1;y++){const m=d[y+1]-d[y];h((d[y]+d[y+1])/2,m+r*.5,o,r),y>0&&u(d[y],o,r)}if(u(-s/2,o,r,1.6),u(s/2,o,r,1.6),e.chance(.75)){const y=e.range(-s*.3,s*.3),m=new Y(r*1.5,r*1.5,r*1.8,6);m.rotateZ(Math.PI/2),m.translate(y,o,0),n.push({geometry:m,color:I(l,1.1),sway:0});const p=new Y(r*.28,r*.34,r*1.6,6);p.translate(y,o+r*2.2,0),n.push({geometry:p,color:l,sway:0});const _=new Qi(r*1.1,r*.2,4,10);_.rotateX(Math.PI/2),_.translate(y,o+r*3,0),n.push({geometry:_,color:I(L.RUST,1.1),sway:0})}const g=pt(n);return t!==1&&g.scale(t,t,t),_t(g,"pipes",0)}},Nu={name:"tank",category:"structures",radius:1.9,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(.4,1.05),o=s*e.range(2.1,4.6),r=e.range(.16,.62),a=r+s,c=e.chance(.45),l=c?I(L.RUST,e.range(.78,.95)):I(7173499,e.range(.9,1.08)),h=I(L.IRON,e.range(.85,1.05)),u=new Y(s,s,o,10);u.rotateZ(Math.PI/2),u.translate(0,a,0),n.push({geometry:u,color:c?(w,v)=>v<a?I(l,.82):l:l,sway:0});for(const w of[-1,1]){const v=new Y(s*.42,s,s*.45,10);v.rotateZ(w*Math.PI/2),v.translate(w*(o+s*.44)/2,a,0),n.push({geometry:v,color:I(l,1.06),sway:0});const b=new Y(s*.42,s*.42,s*.12,10);b.rotateZ(Math.PI/2),b.translate(w*(o+s*.88)/2,a,0),n.push({geometry:b,color:I(h,.95),sway:0})}const f=Math.max(2,Math.round(o/e.range(.7,1.2)));for(let w=1;w<f;w++){const v=-o/2+o*w/f,b=new Y(s*1.035,s*1.035,s*.1,10);b.rotateZ(Math.PI/2),b.translate(v,a,0),n.push({geometry:b,color:I(h,1.05),sway:0})}for(const w of[-1,1]){const v=w*o/2*e.range(.5,.66),b=new k(s*.5,r,s*1.8);b.translate(v,r/2,0),n.push({geometry:b,color:I(h,.82),sway:0});const S=new k(s*.42,s*.34,s*1.55);S.translate(v,r+s*.1,0),n.push({geometry:S,color:I(h,.92),sway:0});const E=new k(s*.8,s*.09,s*2);E.translate(v,s*.045,0),n.push({geometry:E,color:I(h,.74),sway:0})}const d=s*e.range(.3,.5),g=e.range(-o*.2,o*.2),y=new Y(d,d*1.1,s*.22,8);y.translate(g,a+s*.98,0),n.push({geometry:y,color:I(h,.95),sway:0});const m=new Y(d*1.2,d*1.2,s*.09,8);m.translate(g,a+s*1.12,0),n.push({geometry:m,color:I(h,1.12),sway:0});for(let w=0;w<8;w++){const v=w/8*Math.PI*2,b=new k(s*.055,s*.05,s*.055);b.translate(g+Math.cos(v)*d*1.05,a+s*1.17,Math.sin(v)*d*1.05),n.push({geometry:b,color:I(h,.8),sway:0})}const p=e.int(0,4);for(let w=0;w<p;w++){const v=-o*.35+o*.7*(w+.5)/p;if(Math.abs(v-g)<d*1.6)continue;const b=s*e.range(.1,.16),S=s*e.range(.3,.6),E=new Y(b,b,S,6);E.translate(v,a+s*.9+S/2,0),n.push({geometry:E,color:I(l,1.1),sway:0});const T=new Y(b*1.6,b*1.6,b*.5,6);T.translate(v,a+s*.9+S,0),n.push({geometry:T,color:I(h,1.05),sway:0})}const _=pt(n);return t!==1&&_.scale(t,t,t),_t(_,"tank",0)}},Uu={name:"vent",category:"structures",radius:.7,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(.55,.85),o=e.range(.45,.7),r=e.range(.16,.26),a=e.range(.035,.055),c=1.7,l=I(8883859,e.range(.9,1.08)),h=e.chance(.4),u=c,f=u+o;for(const w of[-1,1]){const v=new k(a,o,r);v.translate(w*(s-a)/2,u+o/2,0),n.push({geometry:v,color:l,sway:0});const b=new k(s,a*.92,r*.98);b.translate(0,w<0?u+a*.46:f-a*.46,0),n.push({geometry:b,color:I(l,.94),sway:0})}const d=new k(s*1.14,a*.8,r*1.5);d.rotateX(-.14),d.translate(0,f+a*.4,r*.2),n.push({geometry:d,color:I(l,1.12),sway:0});const g=o-a*2.2,y=Math.max(3,Math.round(g/e.range(.055,.085))),m=g/y,p=m*.42;for(let w=0;w<y;w++){const v=u+a*1.1+m*(w+.5),b=new k(s-a*2.2,p,r*.66);b.rotateX(e.range(.5,.72)),b.translate(0,v,r*.1-w/y*r*.24),n.push({geometry:b,color:h&&e.chance(.3)?I(L.RUST,.95):I(l,1.06),sway:0})}if(s>.7){const w=new k(a*.7,g,r*.5);w.translate(0,u+o/2,-r*.06),n.push({geometry:w,color:I(l,.88),sway:0})}const _=pt(n);return t!==1&&_.scale(t,t,t),_t(_,"vent",0)}},Fu={name:"railing",category:"structures",radius:1.5,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(2.2,3.2),o=e.range(1.04,1.14),r=e.range(.021,.028),a=r*e.range(1.05,1.25),c=e.chance(.55),l=I(c?12097838:9278618,e.range(.92,1.08)),h=I(L.IRON,e.range(.85,1.05)),u=Math.max(2,Math.round(s/e.range(1.1,1.5)));for(let y=0;y<=u;y++){const m=-s/2+s*y/u,p=new Y(a*.92,a,o,6);p.translate(m,o/2,0),n.push({geometry:p,color:l,sway:0});const _=new k(a*4.6,a*.7,a*4.6);_.translate(m,a*.35,0),n.push({geometry:_,color:I(h,.88),sway:0})}for(const y of[o-r,o*e.range(.48,.56)]){const m=new Y(r,r,s+a*2.4,8);m.rotateZ(Math.PI/2),m.translate(0,y,0),n.push({geometry:m,color:l,sway:0})}for(const y of[-1,1]){const m=new Y(r*1.1,r*1.1,r*1.6,8);m.rotateZ(Math.PI/2),m.translate(y*(s+a*2.4)/2,o-r,0),n.push({geometry:m,color:I(l,.9),sway:0})}const f=e.range(.1,.15),d=new k(s,f,r*.7);d.translate(0,f/2+e.range(.005,.02),a*.8),n.push({geometry:d,color:I(l,.86),sway:0});const g=pt(n);return t!==1&&g.scale(t,t,t),_t(g,"railing",0)}},Ou={name:"chainlink",category:"structures",radius:1.6,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(2.4,3.2),o=e.range(1.8,2.4),r=e.range(.04,.055),a=I(9278618,e.range(.92,1.08)),c=I(10133926,e.range(.9,1.1));for(const p of[-1,1]){const _=new Y(r,r*1.06,o,6);_.translate(p*s/2,o/2,0),n.push({geometry:_,color:a,sway:0});const w=new Y(r*1.15,r*1.15,r*.5,6);w.translate(p*s/2,o+r*.2,0),n.push({geometry:w,color:I(a,.9),sway:0})}const l=[o-r*1.4];e.chance(.75)&&l.push(r*1.6);for(const p of l){const _=new Y(r*.62,r*.62,s,6);_.rotateZ(Math.PI/2),_.translate(0,p,0),n.push({geometry:_,color:I(a,1.05),sway:0})}const h=e.range(.2,.26),u=e.range(.008,.011),f=l[0],d=l.length>1?l[1]:0,g=f-d,y=s/2;for(const p of[1,-1])for(let _=-y-g;_<=y+g;_+=h){const w=Math.max(-y,Math.min(y,_)),v=Math.max(-y,Math.min(y,_+p*g));if(Math.abs(v-w)<.001)continue;const b=d+Math.abs(w-_),S=d+Math.abs(v-_),E=Math.hypot(v-w,S-b),T=new k(u,E,u);T.rotateZ(-Math.atan2(v-w,S-b)),T.translate((w+v)/2,(b+S)/2,p>0?u:-u),n.push({geometry:T,color:c,sway:0})}const m=pt(n);return t!==1&&m.scale(t,t,t),_t(m,"chainlink",0)}},ME=6.5,bE=15,SE=1.3,Af=16747068,EE=16758371,vo=2236445,Bm={name:"fireplace",category:"structures",radius:1.2,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=[],o=e.range(1.35,2),r=e.range(.42,.62),a=o*e.range(.46,.58),c=e.range(.62,.85),l=e.range(.14,.22),h=e.range(.07,.1),u=c+l,f=u+h/2-e.range(.012,.03),d=e.range(2.1,2.5),g=e.range(.3,1),y=e.chance(.5)?I(e.chance(.5)?8014392:7029814,e.range(.92,1.1)):I(L.STONE,e.range(.86,1.02)),m=e.chance(.55),p=m?I(L.TIMBER_DARK,e.range(.9,1.1)):I(y,.92),_=(o-a)/2,w=.07,v=e.range(.3,.5),b=new k(o+e.range(.2,.4),w,r+v);b.translate(0,w/2,(r+v)/2),n.push({geometry:b,color:I(L.STONE_DARK,e.range(.9,1.05)),sway:0});const S=e.int(3,5);for(const K of[-1,1])for(let $=0;$<S;$++){const ot=(u-w)/S,mt=_*(1-$*.014),Mt=r*(1-$*.02),Ft=new k(mt,ot,Mt);Ft.translate(K*(a+_)/2,w+ot*($+.5),Mt/2),n.push({geometry:Ft,color:I(y,e.range(.88,1.12)),sway:0})}const E=new k(a+_*.7,l,r*1.04);E.translate(0,c+l/2,r*1.04/2),n.push({geometry:E,color:p,sway:0});const T=new k(a*1.02,c*1.02,.09);T.translate(0,w+c*1.02/2-.02,.05),n.push({geometry:T,color:vo,sway:0});for(const K of[-1,1]){const $=new k(.07,c*.98,r*.82);$.rotateY(K*.16),$.translate(K*a/2-K*.02,w+c*.98/2,r*.44),n.push({geometry:$,color:I(vo,e.range(1.1,1.5)),sway:0})}const M=new k(a*.96,.08,r*.9);M.rotateX(.22),M.translate(0,c-.05,r*.44),n.push({geometry:M,color:I(vo,1.25),sway:0});const x=r+e.range(.06,.14),A=new k(o+e.range(.1,.2),h,x);A.translate(0,f,x/2-.02),n.push({geometry:A,color:m?I(L.TIMBER,e.range(.95,1.1)):I(y,1.12),sway:0});const P=e.int(2,4);for(let K=0;K<P;K++){const $=K/P,ot=(K+1)/P,mt=(d-f)/P,Mt=o*(.9-$*.3)*e.range(.98,1.02),Ft=r*(.86-$*.24),nt=new k(Mt,mt*(1+(ot-$)*.1),Ft);nt.translate(0,f+mt*(K+.5),Ft/2),n.push({geometry:nt,color:I(y,e.range(.9,1.08)),sway:0})}const R=w+.06;for(const K of[-1,1]){const $=new k(.035,.05,r*.44);$.translate(K*a/2*e.range(.5,.62),R,r*.34),n.push({geometry:$,color:I(L.IRON,.8),sway:0});const ot=new k(.04,.16,.042);ot.translate(K*a/2*e.range(.5,.62),R+.09,r*.16),n.push({geometry:ot,color:I(L.IRON,.9),sway:0})}const F=r*.34,D=w+.15,N=e.int(3,5);for(let K=0;K<N;K++){const $=e.range(.045,.075),ot=a*e.range(.5,.78),mt=new Y($,$*e.range(.85,.98),ot,6);mt.rotateZ(Math.PI/2),mt.rotateY(e.range(-.5,.5)),mt.rotateZ(e.range(-.14,.14));const Mt=w+.09+K*e.range(.05,.08);mt.translate(e.around(0,a*.08),Mt,F+e.around(0,.05));const Ft=I(L.BARK,e.range(.85,1.15)),ht=e.chance(g*.9)&&K<N-1?9320990:vo,B=Mt+$*.15;n.push({geometry:mt,color:(ft,st)=>st<B?ht:Ft,sway:0})}const H=e.int(5,9);for(let K=0;K<H;K++){const $=e.range(.025,.05),ot=new ee($,0);ot.rotateY(e.range(0,Math.PI)),ot.translate(e.around(0,a*.3),w+$*.6,F+e.around(0,r*.16)),n.push({geometry:ot,color:e.chance(g*.5)?10239780:I(vo,e.range(.9,1.4)),sway:0})}const G=new Ge(a*.3*(.6+g*.55),0);G.scale(1,.3,.55),G.translate(0,D-.05,F),s.push({geometry:G,color:Af,sway:0});const V=2+(e.chance(g)?1:0);for(let K=0;K<V;K++){const $=a*e.range(.07,.12)*(.5+g*.7),ot=new Ge($,0);ot.scale(1,e.range(2.2,3.4),1),ot.translate(e.around(0,a*.2),D+$*e.range(1.4,2.2),F+e.around(0,.04)),s.push({geometry:ot,color:EE,sway:0})}const et=a*.55,lt=new Ge(et,1);lt.scale(1,.9,.6),lt.translate(0,D+.06,F),s.push({geometry:lt,color:(K,$,ot)=>{const mt=Math.hypot(K,($-D-.06)/.9,(ot-F)/.6)/et;return TE(Af,Math.max(0,.3*(.4+g*.6)*(1-mt)))},sway:0});const bt=pt(n),Lt=pt(s);t!==1&&(bt.scale(t,t,t),Lt.scale(t,t,t));const J=_t(bt,"fireplace",0);J.add(Tn(Lt,"fireplace:glow"));const rt=new ts(16750149,ME*(.4+g*.8)*e.around(1,.1)*t*t,bE*t,SE);return rt.position.set(0,(D+.06)*t,r*.62*t),rt.castShadow=!1,J.add(rt),J}};function TE(i,t){const e=t<0?0:t>1?1:t,n=Math.round((i>>16&255)*e),s=Math.round((i>>8&255)*e),o=Math.round((i&255)*e);return n<<16|s<<8|o}const AE=3.4,RE=12,yl=16748354,CE=16747068,PE=[L.IRON_DARK,2435114,14077364,3362879,7024424],Hm={name:"stove",category:"furniture",radius:.5,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=[],o=e.range(.4,.56),r=e.range(.33,.46),a=e.range(.44,.6),c=e.range(.1,.18),l=c+a/2,h=r/2,u=I(e.pick(PE),e.range(.92,1.08)),f=I(L.IRON,e.range(.82,1.02)),d=e.range(.35,1);for(const B of[-1,1])for(const ft of[-1,1]){const st=e.range(.032,.042),yt=new Y(st,st*e.range(1.15,1.4),c*1.12,5);yt.rotateZ(B*-.08),yt.rotateX(ft*.08),yt.translate(B*(o-st*3)/2,c*1.12/2,ft*(r-st*3)/2),n.push({geometry:yt,color:f,sway:0})}const g=new k(o,a,r);g.translate(0,l,0),n.push({geometry:g,color:u,sway:0});const y=new k(o*1.04,.045,r*.24);y.translate(0,c+.035,h*e.range(.9,1.02)),n.push({geometry:y,color:I(f,.9),sway:0});const m=e.range(.028,.04),p=new k(o+.055,m,r+.05);p.translate(0,c+a-m*.35,0),n.push({geometry:p,color:I(f,1.06),sway:0});const _=.022,w=c+a+m*.5,v=o+.055,b=r+.05;for(const[B,ft,st,yt]of[[v-_,_,0,-b/2+_*.8],[_,r*.86,-v/2+_*.8,0],[_,r*.82,v/2-_*.8,0]]){const vt=new k(B,.028,ft);vt.translate(st,w-.006,yt),n.push({geometry:vt,color:I(f,1.14),sway:0})}const S=o*e.range(.6,.72),E=a*e.range(.5,.62),T=l+a*e.range(.02,.1),M=new k(S,E,.016);M.translate(0,T,h+.005),n.push({geometry:M,color:vl(yl,.45+d*.5),sway:0});const x=h+.032,A=.038;for(const B of[-1,1]){const ft=new k(S+A*2.1,A,.03);ft.translate(0,T+B*E/2,x),n.push({geometry:ft,color:f,sway:0});const st=new k(A*.92,E+A*.4,.028);st.translate(B*S/2,T,x*.999),n.push({geometry:st,color:I(f,1.08),sway:0})}const P=e.chance(.5)?-1:1;for(const B of[-.3,.3]){const ft=new k(.03,.05,.04);ft.translate(P*(S+A*2.1)/2,T+E*B,x+.006),n.push({geometry:ft,color:I(f,.86),sway:0})}const R=-P*(S+A*2.4)/2,F=new Y(.012,.012,.05,6);F.rotateX(Math.PI/2),F.translate(R,T,x+.025),n.push({geometry:F,color:I(f,1.1),sway:0});const D=new k(.026,.1,.026);D.rotateZ(e.range(-.4,.4)),D.translate(R,T,x+.056),n.push({geometry:D,color:I(f,.94),sway:0});const N=new Y(.03,.03,.018,6);N.rotateX(Math.PI/2),N.rotateZ(e.range(0,Math.PI)),N.translate(e.around(0,o*.18),T-E*.5-.055,h+.012),n.push({geometry:N,color:I(f,1.12),sway:0});const H=e.range(.055,.075),G=e.range(.05,.075),V=-r*e.range(.08,.2),et=new Y(H*1.3,H*1.45,G,8);et.translate(0,w+G*.4,V),n.push({geometry:et,color:I(f,.9),sway:0});const lt=e.chance(.45),bt=lt?e.range(1.5,1.95):e.range(2.35,2.7),Lt=w+G*.5,J=new Y(H,H*1.03,bt-Lt,8);J.translate(0,(bt+Lt)/2,V),n.push({geometry:J,color:I(f,.96),sway:0});const rt=new Y(H*1.22,H*1.22,H*.5,8);if(rt.translate(0,Lt+(bt-Lt)*e.range(.4,.6),V),n.push({geometry:rt,color:I(f,1.1),sway:0}),lt){const B=e.range(.45,.7),ft=new Y(H*.98,H*.98,B,8);ft.rotateX(Math.PI/2),ft.translate(0,bt-H*.9,V-B/2+H*.4),n.push({geometry:ft,color:I(f,.92),sway:0});const st=new Y(H*1.18,H*1.18,H*.55,8);st.rotateX(Math.PI/2),st.translate(0,bt-H*.9,V-B+H*.6),n.push({geometry:st,color:I(f,1.08),sway:0})}if(e.chance(.6)){const B=new k(o+e.range(.16,.3),.014,r+e.range(.24,.42));B.translate(0,.007,e.range(.04,.12)),n.push({geometry:B,color:I(L.IRON_DARK,e.range(.9,1.15)),sway:0})}const K=h+.022,$=new k(S*.78,E*.6,.02);$.translate(0,T-E*.1,K),s.push({geometry:$,color:vl(yl,.55+d*.45),sway:0});const ot=Math.max(S,E)*.85,mt=new Ge(ot,1);mt.scale(1,.85,.55),mt.translate(0,T-E*.08,K+.03),s.push({geometry:mt,color:(B,ft,st)=>{const yt=Math.hypot(B,(ft-T+E*.08)/.85,(st-K-.03)/.55)/ot;return vl(yl,Math.max(0,.26*(.4+d*.6)*(1-yt)))},sway:0});const Mt=pt(n),Ft=pt(s);t!==1&&(Mt.scale(t,t,t),Ft.scale(t,t,t));const nt=_t(Mt,"stove",0);nt.add(Tn(Ft,"stove:glow"));const ht=new ts(CE,AE*(.45+d*.75)*e.around(1,.12)*t*t,RE*t,Lu);return ht.position.set(0,T*t,(h+.06)*t),ht.castShadow=!1,nt.add(ht),nt}};function vl(i,t){const e=t<0?0:t>1?1:t,n=Math.round((i>>16&255)*e),s=Math.round((i>>8&255)*e),o=Math.round((i&255)*e);return n<<16|s<<8|o}const IE=.1,LE=1.45,Rf=1.3,Cf=9,DE=4.5,NE=16,UE=1.5;function FE(i,t,e){const n=i.userData.window;if(!n)return;const s=zh(t,-Rf,Rf),o=zh(e,IE,LE);n.azimuth=s,n.elevation=o;const r=Math.cos(o),a=Math.sin(s)*r,c=-Math.sin(o),l=Math.cos(s)*r,h=n.centreY/Math.sin(o),u=Math.min(h,Cf),f=i.getObjectByName("window:shaft");f&&(f.matrixAutoUpdate=!1,f.matrix.set(1,0,a*u,0,0,1,c*u,0,0,0,l*u,0,0,0,0,1),f.matrixWorldNeedsUpdate=!0);const d=i.getObjectByName("window:pool");if(d){const g=n.height/Math.sin(o);d.matrixAutoUpdate=!1,d.matrix.set(n.width,0,g*a,h*a,0,1,0,0,0,0,g*l,h*l,0,0,0,1),d.matrixWorldNeedsUpdate=!0,d.visible=h<=Cf}}const Us={name:"window",category:"structures",radius:1,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=[],o=e.chance(.6),r=o&&e.chance(.35),a=e.range(.66,1.1),c=e.range(.8,1.3),l=e.range(.85,1.15),h=l+c/2,u=e.range(.09,.14),f=e.range(.1,.16),d=e.chance(.72),g=d?16773586:14477558,y=d?16769966:12505832,m=I(e.chance(.55)?L.TIMBER:L.TIMBER_DARK,e.range(.9,1.08)),p=I(L.STONE_DARK,e.range(.9,1.1)),_=new k(a+.024,c+.024,.018);_.translate(0,h,.011),n.push({geometry:_,color:g,sway:0});const w=c+u*2.4;for(const K of[-1,1]){const $=new k(u,w,f);$.translate(K*(a+u)/2,h,f/2),n.push({geometry:$,color:m,sway:0})}const v=new k(a+u*2+.1,u*.92,f*1.06);v.translate(0,l+c+u*.46,f*.5),n.push({geometry:v,color:I(m,.92),sway:0});const b=new k(a+u*2+.17,.068,f*1.9);if(b.rotateX(-.07),b.translate(0,l-.028,f*.6),n.push({geometry:b,color:p,sway:0}),e.chance(.5))for(const K of[-1,1]){const $=new k(.07,.13,f*1.25);$.translate(K*a/2,l-.1,f*.62),n.push({geometry:$,color:I(p,.88),sway:0})}const S=.028,E=f*.82;for(const K of[-1,1]){const $=new k(a+S*1.4,S,S*1.1);$.translate(0,h+K*c/2,E),n.push({geometry:$,color:I(m,1.08),sway:0});const ot=new k(S*.9,c-S*1.6,S);ot.translate(K*a/2,h,E*.97),n.push({geometry:ot,color:I(m,1.12),sway:0})}const T=e.int(2,3),M=e.int(2,3),x=f*.62;for(let K=1;K<T;K++){const $=new k(.026,c,.03);$.translate(-a/2+a*K/T,h,x),n.push({geometry:$,color:I(m,1.02),sway:0})}for(let K=1;K<M;K++){const $=new k(a,.023,.027);$.translate(0,l+c*K/M,x*1.02),n.push({geometry:$,color:I(m,.96),sway:0})}if(o){const K=e.chance(.5)?I(L.CLOTH,e.range(.85,1.05)):I(L.WOOL,e.range(.85,1.05)),$=l+c+e.range(.04,.09),ot=e.range(.05,.08),mt=c*e.range(.94,1.06),Mt=new Y(.016,.016,a+u*2.2,6);Mt.rotateZ(Math.PI/2),Mt.translate(0,$,ot),n.push({geometry:Mt,color:I(L.TIMBER_DARK,.95),sway:0});for(const Ft of[-1,1]){const nt=r?a*e.range(.52,.56):a*e.range(.2,.3),ht=r?e.range(.022,.032):e.range(.05,.08),B=r?Ft*(a/2-nt/2):Ft*(a/2-nt*e.range(.3,.45)),ft=new k(nt,mt,ht);ft.translate(B,$-mt/2-.01,ot+ht*.5),n.push({geometry:ft,color:K,sway:0});const st=new k(nt*1.02,.05,ht*1.15);if(st.translate(B,$,ot+ht*.5),n.push({geometry:st,color:I(K,.88),sway:0}),!r){const yt=new k(nt*1.15,.05,ht*1.2);yt.translate(B,$-mt*e.range(.45,.6),ot+ht*.5),n.push({geometry:yt,color:I(K,.78),sway:0})}}}const A=r?.07:1,P=r?.3:1,R=new k(a*.97,c*.97,.012);R.translate(0,h,.026),s.push({geometry:R,color:ea(g,P),sway:0});const F=new Ge(1,1);F.scale(a*.85,c*.8,.3),F.translate(0,h,.05);const D=Math.max(a,c)*.85;s.push({geometry:F,color:(K,$)=>{const ot=Math.hypot(K/D,($-h)/D);return ea(g,Math.max(0,.3*P*(1-ot)))},sway:0});const N=a*.94,H=c*.94,G=pt([{geometry:(()=>{const K=new k(N,H,1,1,1,12);return K.translate(0,h,.5),K})(),color:(K,$,ot)=>ea(g,.22*Math.max(0,1-ot)**1.35),sway:0}]),V=.014,et=pt([{geometry:(()=>{const K=new k(1,.012,1,4,1,4);return K.translate(0,V,0),K})(),color:(K,$,ot)=>{const mt=Math.max(Math.abs(K),Math.abs(ot))*2;return ea(g,.62*(1-OE(.6,1.02,mt)))},sway:0}]),lt=pt(n),bt=pt(s);t!==1&&(lt.scale(t,t,t),bt.scale(t,t,t),G.scale(t,t,1),et.scale(1,t,1));const Lt=_t(lt,"window",0);Lt.add(Tn(bt,"window:glow"));const J={width:N*t,height:H*t,centreY:h*t,openness:A,azimuth:0,elevation:.6};if(Lt.userData.window=J,r)G.dispose(),et.dispose();else{const K=Tn(G,"window:shaft");K.matrixAutoUpdate=!1,Lt.add(K);const $=Tn(et,"window:pool");$.matrixAutoUpdate=!1,Lt.add($)}const rt=new ts(y,DE*A*e.around(1,.1)*t*t,NE*t,UE);return rt.name="window:sun",rt.position.set(0,h*t,f*t+.25),rt.castShadow=!1,Lt.add(rt),FE(Lt,e.range(-.7,.7),e.range(.38,.95)),Lt}};function zh(i,t,e){return i<t?t:i>e?e:i}function OE(i,t,e){const n=zh((e-i)/Math.max(t-i,1e-6),0,1);return n*n*(3-2*n)}function ea(i,t){const e=t<0?0:t>1?1:t,n=Math.round((i>>16&255)*e),s=Math.round((i>>8&255)*e),o=Math.round((i&255)*e);return n<<16|s<<8|o}const nc={name:"dresser",category:"furniture",radius:.7,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(.92,1.24),o=e.range(.44,.56),r=e.range(.86,1.14),a=e.chance(.55)?L.TIMBER:L.TIMBER_DARK,c=a===L.TIMBER?L.TIMBER_DARK:L.TIMBER_PALE,l=e.chance(.45)?L.IRON:I(c,1.15),h=e.range(.07,.11),u=e.range(.03,.045),f=new k(s*.96,h,o*.94);f.translate(0,h/2,o/2),n.push({geometry:f,color:I(c,.86),sway:0});const d=r-h-u,g=new k(s,d+.03,o);g.translate(0,h+d/2,o/2),n.push({geometry:g,color:I(a,e.range(.95,1.05)),sway:0});const y=e.range(.015,.03),m=new k(s+y*2,u+.02,o+y);m.translate(0,r-u/2,o/2+y/2),n.push({geometry:m,color:I(c,e.range(.95,1.08)),sway:0});const p=e.int(4,6),_=o+e.range(.012,.02),w=e.range(.02,.035),v=.012,b=e.range(1.1,1.45),S=[];for(let A=0;A<p;A++)S.push(b**A);const E=S.reduce((A,P)=>A+P,0),T=d-v*(p+1);let M=h+v;for(let A=p-1;A>=0;A--){const P=T*S[A]/E,R=new k(s-w*2,P,.026);R.translate(0,M+P/2,_),n.push({geometry:R,color:I(a,e.range(.9,1.12)),sway:0});const D=s>1.05&&P<d*.26?[-s*.22,s*.22]:[0];for(const N of D){const H=new Y(e.range(.017,.024),e.range(.013,.018),e.range(.03,.045),6);H.rotateX(Math.PI/2),H.translate(N,M+P/2,_+.02),n.push({geometry:H,color:I(l,e.range(.92,1.1)),sway:0})}M+=P+v}const x=pt(n);return t!==1&&x.scale(t,t,t),_t(x,"dresser",0)}},ic={name:"chest",category:"furniture",radius:.6,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(.82,1.08),o=e.range(.44,.56),r=e.range(.04,.075),a=e.range(.3,.4),c=e.range(.055,.075),l=e.chance(.45),h=e.chance(.5)?L.TIMBER_DARK:L.BARK_PALE,u=I(L.IRON,e.range(.82,1)),d=e.chance(.35)?L.RUST:u;e();const g=r,y=g+a;if(e.chance(.35))for(const D of[-1,1]){const N=new k(s*e.range(.92,.97),r+.015,o*.16);N.translate(0,(r+.015)/2,D*(o-o*.16)/2),n.push({geometry:N,color:I(h,.85),sway:0})}else for(const D of[-1,1])for(const N of[-1,1]){const H=e.range(.075,.1),G=new k(H,r+.015,H*e.range(.9,1.1));G.translate(D*(s-H)/2,(r+.015)/2,N*(o-H)/2),n.push({geometry:G,color:I(h,.85),sway:0})}const p=new k(s,a,o);p.translate(0,g+a/2,0),n.push({geometry:p,color:h,sway:0});const _=e.range(.05,.07);for(const D of[-1,1]){const N=new k(_*e.range(.95,1.05),a*1.02,o*1.03);N.translate(D*(s-_*.5)/2,g+a/2,0),n.push({geometry:N,color:I(h,.8),sway:0})}const w=e.int(2,3),v=s*e.range(.5,.66),b=[];for(let D=0;D<w;D++){const N=w===1?0:-v/2+D/(w-1)*v;b.push(N);for(const H of[-1,1]){const G=new k(e.range(.035,.055),a*e.range(.96,1.02),.014);G.translate(N,g+a/2,H*(o+.012)/2),n.push({geometry:G,color:d,sway:0})}}if(e.chance(.5)){const D=new k(s*1.02,e.range(.026,.038),o*1.02);D.translate(0,y-.035,0),n.push({geometry:D,color:I(d,.9),sway:0})}const S=e.range(.07,.1),E=new k(S,S*e.range(1,1.35),.016);E.translate(0,y-S*.75,o/2+.006),n.push({geometry:E,color:I(d,1.15),sway:0});const T=new k(.012,.022,.008);T.translate(0,y-S*.75,o/2+.016),n.push({geometry:T,color:L.IRON_DARK,sway:0});const M=y-.012,x=-o/2+.025,A=o-.025+.02,P=(D,N)=>{D.rotateX(-0),D.translate(0,M,x),n.push({geometry:D,color:N,sway:0})};if(l)for(let N=0;N<3;N++){const H=N/2,G=new k(s*(1.03-H*.22)*e.range(.99,1.01),c*.62,(A+.03)*(1-H*.26));G.translate(0,H*c*.52+c*.2,A/2-.005),P(G,I(h,1.05+N*.04))}else{const D=new k(s*1.03,c,A+.03);D.translate(0,c/2,A/2-.005),P(D,I(h,1.06))}for(const D of b){const N=new k(e.range(.035,.055),c*(l?1.5:1.05),A*e.range(.86,.96));N.translate(D,c*(l?.75:.5),A*.48),P(N,d)}const R=new k(S*.55,S*1.15,.014);R.translate(0,c*.35-S*.4,A+.012),P(R,I(d,1.2));for(const D of[-s*.3,s*.3]){const N=new Y(.014,.014,e.range(.05,.07),6);N.rotateZ(Math.PI/2),N.translate(D,M,x-.006),n.push({geometry:N,color:I(d,.92),sway:0})}const F=pt(n);return t!==1&&F.scale(t,t,t),_t(F,"chest",0)}},ku={name:"washtub",category:"objects",radius:.5,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(.34,.46),o=e.range(.26,.36),r=s*e.range(.72,.82),a=e.range(.028,.04),c=e.range(.04,.06),l=e.int(10,14),h=e.chance(.5)?L.TIMBER:L.TIMBER_DARK,u=I(L.IRON,e.range(.85,1.05)),f=[new tt(0,0),new tt(r,.006),new tt(s,o),new tt(s-a*.8,o),new tt(r-a,c),new tt(0,c)];n.push({geometry:new ei(f,l),color:h,sway:0});const d=p=>r+(s-r)*p;for(const p of[e.range(.16,.26),e.range(.72,.84)]){const _=e.range(.03,.045),w=d(p-_/(2*o))*1.03,v=d(p+_/(2*o))*1.03,b=new Y(v,w,_,l);b.translate(0,o*p,0),n.push({geometry:b,color:u,sway:0})}const g=e.chance(.7),y=o*e.range(.35,.6);if(g){const p=d(y/o)-a,_=new Y(p,p*.96,.02,l);_.translate(0,y,0),n.push({geometry:_,color:L.WATER,sway:0})}const m=pt(n);return t!==1&&m.scale(t,t,t),_t(m,"washtub",0)}};function Bt(i,t,e,n=e,s=4){wl.copy(t).sub(i);const o=wl.length();if(o<1e-6)return new Y(e,e,1e-4,s);const r=new Y(n,e,o,s);return r.translate(0,o/2,0),r.applyQuaternion(zE.setFromUnitVectors(kE,wl.divideScalar(o))),r.translate(i.x,i.y,i.z),r}const kE=new C(0,1,0),wl=new C,zE=new ti,Gm={name:"broom",category:"objects",radius:.4,solid:!1,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(1.15,1.45),o=0,r=0,a=I(e.chance(.5)?L.BARK_PALE:L.TIMBER,e.range(.9,1.1)),c=e.pick([L.LEAF_DRY,L.GRASS_DRY,L.BARK]),l=e.chance(.6)?L.CLOTH:L.IRON,h=new C(Math.sin(o)*Math.cos(r),Math.cos(o),Math.sin(o)*Math.sin(r)),u=E=>h.clone().multiplyScalar(E),f=new C().crossVectors(h,new C(0,0,1)).normalize(),d=new C().crossVectors(h,f).normalize(),g=(E,T)=>f.clone().multiplyScalar(Math.cos(E)*T).add(d.clone().multiplyScalar(Math.sin(E)*T)),y=e.range(.26,.38),m=e.range(.07,.13),p=-1,_=y+.03,w=y*.35,v=s;n.push({geometry:Bt(u(w),u(v),e.range(.014,.019),e.range(.011,.015),6),color:a,sway:0});const b=e.int(24,34);for(let E=0;E<b;E++){const T=u(_+p*e.range(0,y*.35)),M=Math.PI*2/b,x=E*M+e.range(0,M*.6),A=e.range(.72,1.05),P=u(_+p*y*A).add(g(x,m*e.range(.35,1)*A));P.y=Math.max(P.y,e.range(.004,.018)),n.push({geometry:Bt(T.add(g(x,e.range(.006,.011))),P,e.range(.009,.014),.005,4),color:I(c,e.range(.82,1.18)),sway:0})}for(const E of[e.range(.02,.08),e.range(.18,.3)]){const T=_+p*y*E,M=e.range(.015,.024);n.push({geometry:Bt(u(T-M),u(T+M),e.range(.028,.036),e.range(.028,.036),8),color:I(l,e.range(.9,1.1)),sway:0})}for(const E of n)E.geometry.translate(0,.02,0);const S=pt(n);return t!==1&&S.scale(t,t,t),_t(S,"broom",0)}},zu={name:"hanging-herbs",category:"objects",radius:.7,solid:!1,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(1.68,1.9),o=e.range(.8,1.35),r=e.range(.08,.12),a=I(L.BARK_PALE,e.range(.9,1.1)),c=new C(-o/2,s,r),l=new C(o/2,s,r);n.push({geometry:Bt(c,l,e.range(.016,.022),e.range(.016,.022),6),color:a,sway:0});for(const g of[c,l]){const y=new C(g.x,s+e.range(.05,.09),.012);n.push({geometry:Bt(y,g.clone(),e.range(.014,.019),.012,5),color:I(a,.88),sway:0});const m=new k(.05,e.range(.06,.09),.024);m.translate(g.x,y.y,.012),n.push({geometry:m,color:I(a,.8),sway:0})}const h=(g,y)=>(m,p)=>{const _=Math.max(0,Math.min(1,(s-p)/Math.max(g,1e-6)));return _*_*(3-2*_)*y},u=e.int(2,4),f=o*.82;for(let g=0;g<u;g++){const y=-f/2+(g+.5)/u*f+e.around(0,f/(u*3)),m=s+e.around(0,.006),p=r+e.around(0,.004);if(e.chance(.68)){const _=e.range(.24,.42),w=e.range(.05,.1),v=e.pick([L.LEAF_DRY,L.LEAF_DARK,L.GRASS_DRY,L.LEAF]),b=new Y(.026,.021,e.range(.03,.045),5);b.translate(y,m,p),n.push({geometry:b,color:L.CLOTH,sway:h(_,.06)});const S=e.int(3,5);for(let E=0;E<S;E++){const T=E/S*Math.PI*2+e.range(0,.6),M=e.range(.72,1),x=new C(y+Math.cos(T)*.008,m-.01,p+Math.sin(T)*.008),A=new C(y+Math.cos(T)*w*M,m-_*M,p+Math.sin(T)*w*M);n.push({geometry:Bt(x,A,e.range(.006,.009),.004,4),color:I(v,e.range(.8,1.05)),sway:h(_,e.range(.2,.32))});const P=e.int(1,2);for(let R=0;R<P;R++){const F=e.range(.45,.95),D=new k(e.range(.03,.055),e.range(.05,.1),e.range(.022,.04));D.rotateY(T),D.translate(x.x+(A.x-x.x)*F,x.y+(A.y-x.y)*F,x.z+(A.z-x.z)*F),n.push({geometry:D,color:I(v,e.range(.75,1.15)),sway:h(_,e.range(.24,.36))})}}}else{const _=e.int(4,7),w=e.range(.055,.08),v=w*_+.06,b=e.pick([L.MARKER_YELLOW,L.HIDE_PALE,L.WOOL,L.RUST]);n.push({geometry:Bt(new C(y,m+.03,p),new C(y+e.around(0,.02),m-v,p+e.around(0,.02)),.008,.006,4),color:L.CLOTH,sway:h(v,.28)});for(let S=0;S<_;S++){const E=m-.05-S*w,T=(S%2*2-1)*e.range(.012,.03),M=new ee(e.range(.028,.042),0);M.scale(1,e.range(.8,1.05),1),M.translate(y+T,E,p+e.around(0,.012)),n.push({geometry:M,color:I(b,e.range(.85,1.12)),sway:h(v,e.range(.15,.26))})}}}const d=pt(n);return t!==1&&d.scale(t,t,t),_t(d,"hanging-herbs",0)}},Bu={name:"spinning-wheel",category:"furniture",radius:.5,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(.62,.78),o=e.range(.13,.17),r=e.range(.038,.05),a=e.range(.05,.12),c=e.range(.42,.48),l=ot=>c-ot*Math.tan(a),h=e.chance(.5)?L.TIMBER:L.TIMBER_DARK,u=h===L.TIMBER?L.TIMBER_DARK:L.TIMBER_PALE,f=I(L.IRON,e.range(.85,1.05)),d=new k(s/Math.cos(a),r,o);d.rotateZ(-a),d.translate(0,c-r*Math.cos(a)/2,0),n.push({geometry:d,color:h,sway:0});const g=[[s*.32,o*.38,.34,.94],[s*.32,-o*.38,.34,-.94],[-s*.36,e.around(0,.015),-1,0]];for(const[ot,mt,Mt,Ft]of g){const nt=e.range(.05,.09),ht=new C(ot,l(ot)-.018,mt),B=new C(ot+Mt*nt,0,mt+Ft*nt);n.push({geometry:Bt(B,ht,e.range(.015,.019),e.range(.012,.016),5),color:u,sway:0})}const y=e.range(.2,.28),m=s*e.range(.28,.34),p=y*e.range(1.04,1.14),_=e.range(.05,.065),w=new C(m,l(m)+p,0);for(const ot of[-1,1]){const mt=ot*_;n.push({geometry:Bt(new C(m+e.around(0,.006),l(m)-.02,mt),new C(w.x,w.y,mt),e.range(.02,.026),e.range(.012,.016),5),color:u,sway:0})}const v=new Y(.011,.011,_*2+.04,5);v.rotateX(Math.PI/2),v.translate(w.x,w.y,w.z),n.push({geometry:v,color:f,sway:0});const b=e.range(.028,.036),S=new Y(b,b,e.range(.05,.07),6);S.rotateX(Math.PI/2),S.translate(w.x,w.y,w.z),n.push({geometry:S,color:u,sway:0});const E=new Qi(y,e.range(.013,.019),4,14);E.translate(w.x,w.y,w.z),n.push({geometry:E,color:h,sway:0});const T=e.int(6,10),M=e.range(0,Math.PI*2);for(let ot=0;ot<T;ot++){const mt=M+ot/T*Math.PI*2,Mt=Math.cos(mt),Ft=Math.sin(mt);n.push({geometry:Bt(new C(w.x+Mt*b*.9,w.y+Ft*b*.9,0),new C(w.x+Mt*(y-.005),w.y+Ft*(y-.005),0),e.range(.007,.009),e.range(.005,.007),4),color:u,sway:0})}const x=s*e.range(.06,.16),A=e.around(0,.025),P=e.range(.2,.28),R=new k(P,.02,e.range(.09,.13));R.rotateZ(e.around(0,.07)),R.translate(x,e.range(.03,.045),A),n.push({geometry:R,color:h,sway:0});const F=new k(.03,.035,o*1.1);F.translate(x-P/2,.02,A),n.push({geometry:F,color:I(h,.85),sway:0});const D=e.range(0,Math.PI*2),N=e.range(.028,.042);n.push({geometry:Bt(new C(x+P*.36,.05,A+.02),new C(w.x+Math.cos(D)*N,w.y+Math.sin(D)*N,_+.02),.008,.007,4),color:u,sway:0});const H=-s*e.range(.26,.34),G=l(H),V=new k(e.range(.09,.12),.05,e.range(.06,.08));V.translate(H,G+.015,0),n.push({geometry:V,color:I(h,1.06),sway:0});const et=e.range(.11,.15),lt=G+.03+et,bt=e.range(.06,.085);for(const ot of[-1,1]){const mt=new C(H+ot*bt,G+.01,0);n.push({geometry:Bt(mt,new C(mt.x,lt,0),e.range(.015,.019),e.range(.009,.012),5),color:u,sway:0})}n.push({geometry:Bt(new C(H-bt,lt,0),new C(H+bt+.05,lt+.004,0),.007,.006,4),color:f,sway:0});const Lt=new Y(e.range(.02,.028),e.range(.02,.028),.07,7);Lt.rotateZ(Math.PI/2),Lt.translate(H,lt,0),n.push({geometry:Lt,color:I(e.pick([L.WOOL,L.CLOTH,L.HIDE_PALE]),e.range(.95,1.1)),sway:0});const J=H+bt+.03,rt=e.range(.026,.034),K=new Y(rt,rt,.013,8);K.rotateZ(Math.PI/2),K.translate(J,lt,0),n.push({geometry:K,color:u,sway:0});for(const ot of[-1,1])n.push({geometry:Bt(new C(w.x,w.y+ot*y,0),new C(J,lt+ot*rt,0),.005,.004,4),color:I(L.CLOTH,.85),sway:0});if(e.chance(.55)){const ot=H-e.range(.08,.13),mt=new C(ot,l(ot)-.01,e.around(0,.02)),Mt=new C(ot-e.range(.03,.09),l(ot)+e.range(.42,.56),mt.z+e.around(0,.05));n.push({geometry:Bt(mt,Mt,e.range(.016,.021),e.range(.009,.013),5),color:u,sway:0});const Ft=e.pick([L.WOOL,L.LEAF_DRY,L.CLOTH]),nt=new Y(.026,.022,.03,6);nt.translate(Mt.x,Mt.y-.01,Mt.z),n.push({geometry:nt,color:L.CLOTH,sway:0});const ht=e.int(4,6);for(let B=0;B<ht;B++){const ft=B/ht*Math.PI*2+e.range(0,.5),st=e.range(.03,.07);n.push({geometry:Bt(new C(Mt.x+Math.cos(ft)*.01,Mt.y-.02,Mt.z+Math.sin(ft)*.01),new C(Mt.x+Math.cos(ft)*st,Mt.y+e.range(.05,.12),Mt.z+Math.sin(ft)*st),e.range(.008,.013),e.range(.004,.007),4),color:I(Ft,e.range(.88,1.12)),sway:0})}}const $=pt(n);return t!==1&&$.scale(t,t,t),_t($,"spinning-wheel",0)}},Pf=["coat","coat","hat","bag","rope"],BE=new C(0,1,0),HE=new ti,Vm={name:"wall-pegs",category:"furniture",radius:.65,solid:!1,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(1.5,1.76),o=e.range(.7,1.3),r=e.chance(.5)?L.TIMBER_DARK:L.BARK_PALE,a=new k(o,e.range(.08,.11),.028);a.translate(0,s,.014),n.push({geometry:a,color:r,sway:0});for(const m of[-1,1]){const p=new k(e.range(.05,.07),.14,.02);p.translate(m*o*.86/2,s,.008),n.push({geometry:p,color:I(r,.82),sway:0})}const c=e.int(3,6),l=o*.78,h=Array.from({length:c},(m,p)=>c===1?0:-l/2+p/(c-1)*l),u=e.int(0,c-1),f={coat:.22,hat:.19,rope:.17,bag:.14},d=new Array(c).fill(null),g=(m,p)=>{for(let _=0;_<c;_++){const w=d[_];if(w&&Math.abs(h[m]-h[_])<f[p]+f[w]+.03)return}d[m]=p};g(u,e.pick(Pf));for(let m=0;m<c;m++)m===u||!e.chance(.62)||g(m,e.pick(Pf));for(let m=0;m<c;m++){const p=h[m],_=new C(p,s-e.range(0,.012),.02),w=new C(p,s+e.range(.02,.04),e.range(.09,.13)),v=e.range(.013,.017),b=e.range(.017,.022);n.push({geometry:Bt(_,w,v,b,6),color:I(r,e.range(.95,1.15)),sway:0});const S=d[m];if(!S)continue;const E=w.z*.72;if(S==="coat"){const T=e.pick([L.CLOTH,L.WOOL,L.LEAF_DARK,L.HIDE,L.STONE_DARK]),M=e.range(.45,.8),x=e.range(.24,.34),A=e.int(3,5),P=(F,D)=>{const N=Math.max(0,Math.min(1,(s-D)/M));return N*N*(3-2*N)*.12};for(let F=0;F<A;F++){const D=F/(A-1),N=s-.02-D*M*.92,H=M*1.06/A,G=new k(x*(1-D*e.range(.18,.34)),H,e.range(.07,.12)*(1-D*.3));G.rotateY(e.around(0,.22)),G.rotateZ(e.around(0,.09)),G.translate(p+e.around(0,.02),N-H/2,E+e.around(0,.012)),n.push({geometry:G,color:I(T,e.range(.88,1.1)),sway:P})}const R=new k(x*.42,.06,.09);R.rotateY(e.around(0,.2)),R.translate(p,s+.005,E),n.push({geometry:R,color:I(T,1.14),sway:0})}else if(S==="hat"){const T=I(e.pick([L.HIDE_DARK,L.CLOTH,L.EARTH]),e.range(.9,1.1)),M=e.range(.13,.18),x=e.range(.1,.15),A=.011,P=e.range(.014,.02),R=M*.66,F=[new tt(R-A,0),new tt(M,0),new tt(M*.985,P),new tt(R,P),new tt(R*.95,x*.62),new tt(R*.7,x*.93),new tt(.006,x),new tt(.005,x-A*.8),new tt(R*.7-A*.8,x*.93-A*.5),new tt(R*.95-A,x*.62),new tt(R-A,P),new tt(R-A,0)],D=e.range(.06,.14),N=new C(0,-Math.sin(D),Math.cos(D)),H=M*Math.sin(D)+.014,G=Math.min(w.z-H,x*.45),V=(H-_.z)/(w.z-_.z),et=v+(b-v)*V,lt=G*((w.y-_.y)/(w.z-_.z)+Math.tan(D)),bt=(R-A)*(1-.35*(G/x)**2),Lt=Math.max(0,bt-et-lt-.004),J=new C(p,_.y+(w.y-_.y)*V-Lt,H),rt=new ei(F,8);rt.applyQuaternion(HE.setFromUnitVectors(BE,N)),rt.translate(J.x,J.y,J.z),n.push({geometry:rt,color:T,sway:0});const K=J.clone().addScaledVector(N,x-A*.4),$=new Jo(.015,6,4);$.translate(K.x,K.y,K.z),n.push({geometry:$,color:I(T,.86),sway:0})}else if(S==="bag"){const T=I(e.pick([L.HIDE,L.HIDE_DARK,L.TIMBER_DARK]),e.range(.9,1.1)),M=e.range(.17,.24),x=e.range(.18,.26),A=s-e.range(.14,.24),P=_.clone().lerp(w,.55),R=.009,F=v+(b-v)*.55+R,D=new C(p,P.y-.05,P.z+.028);for(const V of[-1,1])n.push({geometry:Bt(new C(p+V*M*.34,A-.02,E+.012),D.clone().add(new C(V*.006,V*.003,0)),R,R*.85,4),color:I(T,V>0?1.04:.96),sway:0});const N=new C(p,P.y+F,P.z+.004);n.push({geometry:Bt(D,N,R,R*.9,4),color:I(T,1.08),sway:0}),n.push({geometry:Bt(D.clone().lerp(N,.82),new C(p,P.y-.03,Math.max(P.z-.042,.012)),R*.78,R*.7,4),color:I(T,.92),sway:0});const H=new k(M,x,e.range(.07,.1));H.rotateY(e.around(0,.16)),H.translate(p,A-x/2+.02,E+.012),n.push({geometry:H,color:T,sway:0});const G=new k(M*1.04,x*.4,.02);G.translate(p,A-x*.2+.02,E+.012+e.range(.04,.055)),n.push({geometry:G,color:I(T,1.15),sway:0})}else{const T=e.range(.09,.13),M=e.range(.02,.03),x=(E-_.z)/(w.z-_.z),A=v+(b-v)*x,P=T-M,R=Math.max(0,P-A*1.2-.006),F=new Qi(T,M,4,9);F.rotateY(e.around(0,.25)),F.translate(p,_.y+(w.y-_.y)*x-R,E),n.push({geometry:F,color:I(L.CLOTH,e.range(.85,1.05)),sway:0})}}const y=pt(n);return t!==1&&y.scale(t,t,t),_t(y,"wall-pegs",0)}},Hu={name:"hoist",category:"structures",radius:2.4,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(2.8,5.4),o=e.range(2.5,4.2),r=I(L.IRON,e.range(.85,1.05)),a=e.range(.08,.11),c=o;for(const[g,y,m]of[[c+.11,.3,.05],[c-.11,.3,.05]]){const p=new k(s,m,y);p.translate(0,g,0),n.push({geometry:p,color:I(r,1.06),sway:0})}const l=new k(s*.995,.24,.07);l.translate(0,c,0),n.push({geometry:l,color:r,sway:0});for(const g of[-1,1]){const y=g*s/2-g*.3,m=new Y(a*.85,a,o,6);m.translate(y,o/2,0),n.push({geometry:m,color:r,sway:0});const p=new k(a*4.4,.07,a*4.4);p.translate(y,.035,0),n.push({geometry:p,color:I(r,.84),sway:0});const _=new C(y,o-.75,0),w=new C(y-g*.7,c-.16,0);n.push({geometry:Bt(_,w,.045,.04),color:I(r,.9),sway:0})}const h=e.range(-s*.28,s*.28),u=new k(.38,.26,.3);u.translate(h,c-.28,0),n.push({geometry:u,color:I(r,1.14),sway:0});const f=new Y(.13,.13,.12,8);if(f.rotateX(Math.PI/2),f.translate(h,c-.28,.2),n.push({geometry:f,color:I(L.RUST,1.05),sway:0}),e.chance(.72)){const g=e.range(.8,Math.max(1,c-1.4)),y=.035,m=.011,p=y*1.35,_=.075,w=g+_,v=w+_,b=v+.11,S=c-.42,E=b-y*.5,T=Math.max(p*2,S-E),M=Math.max(3,Math.round(T/p)+1);for(let D=0;D<M;D++){const N=S-D*T/(M-1),H=new Qi(y,m,4,6);H.rotateY(D%2===0?0:Math.PI/2),H.translate(h,N,0),n.push({geometry:H,color:I(r,.92),sway:0})}n.push({geometry:Bt(new C(h,b,0),new C(h,v,0),.03,.026,6),color:I(r,1.1),sway:0});const x=new C(h,w,0),A=6,P=D=>{const N=D/A*Math.PI*1.55;return new C(x.x+Math.sin(N)*_,x.y+Math.cos(N)*_,x.z)};for(let D=0;D<A;D++)n.push({geometry:Bt(P(D),P(D+1),.024*(1-D/(A*2.4)),.022,5),color:I(r,1.05),sway:0});const R=P(A),F=new C(R.x-_*.5,R.y+_*.55,R.z);n.push({geometry:Bt(R,F,.021,.005,5),color:I(r,1.15),sway:0})}const d=pt(n);return t!==1&&d.scale(t,t,t),_t(d,"hoist",0)}},GE=5,VE=18,za={name:"lantern",category:"objects",radius:.28,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=[],o=km(e),r=I(L.IRON,e.range(.85,1.08)),c=e.chance(.35)?I(L.RUST,e.range(.85,1.05)):r,l=e.chance(.45),h=e.range(.062,.082),u=h*(l?3.1:2.1)*e.range(.92,1.08),f=h*.16,d=h*.24,g=new Y(h*1.24,h*1.4,d,8);g.translate(0,d/2,0),n.push({geometry:g,color:I(c,.82),sway:0});const y=h*.16,m=new k(h*2.1,y,h*2.1);m.translate(0,d+y/2,0),n.push({geometry:m,color:I(c,.9),sway:0});const p=d+y;for(const N of[-1,1])for(const H of[-1,1]){const G=new k(f,u,f);G.translate(N*(h*2-f)/2,p+u/2,H*(h*2-f)/2),n.push({geometry:G,color:c,sway:0})}for(const N of[p+u*.06,p+u*.94])for(const H of[0,1]){const G=H===0,V=new k(G?h*2:f*.9,f*.9,G?f*.9:h*2-f*2.2);for(const et of[-1,1]){const lt=V.clone(),bt=(h*2-f)/2;lt.translate(G?0:et*bt,N,G?et*bt:0),n.push({geometry:lt,color:I(c,.92),sway:0})}V.dispose()}const _=p+u,w=h*.7,v=new Y(h*.5,h*1.55,w,4);v.rotateY(Math.PI/4),v.translate(0,_+w/2,0),n.push({geometry:v,color:I(c,1.1),sway:0});const b=h*.3,S=new Y(h*.34,h*.42,b,6);S.translate(0,_+w+b/2,0),n.push({geometry:S,color:I(c,.88),sway:0});const E=h*.5,T=new Qi(E,f*.42,4,10);T.rotateY(e.chance(.5)?0:Math.PI/2),T.translate(0,_+w+b+E*.85,0),n.push({geometry:T,color:I(c,1.05),sway:0});const M=p+u*e.range(.24,.34),x=new Y(h*.46,h*.56,h*.3,8);x.translate(0,p+h*.15,0),n.push({geometry:x,color:o.color,sway:0}),zm(s,o,0,M,0,h*.42);const A=pt(n),P=pt(s),R=e.range(0,Math.PI*2);A.rotateY(R),P.rotateY(R),t!==1&&(A.scale(t,t,t),P.scale(t,t,t));const F=_t(A,"lantern",0);F.add(Tn(P,"lantern:glow"));const D=new ts(o.light,GE*e.around(1,.12)*t*t,VE*t,Lu);return D.position.set(0,M*t,0),D.castShadow=!1,F.add(D),F}},If={turf:{color:L.GRASS,variation:.1,step:"grass"},meadow:{color:L.GRASS_DRY,variation:.13,step:"grass"},dirt:{color:L.EARTH,variation:.09,step:"earth"},gravel:{color:7235158,variation:.16,step:"gravel"},cobble:{color:L.STONE,variation:.19,step:"stone"},flagstone:{color:L.STONE_PALE,variation:.08,step:"stone"},boards:{color:L.TIMBER,variation:.11,step:"wood"},crop:{color:L.LEAF_DRY,variation:.15,step:"grass"},mire:{color:4536876,variation:.12,step:"mud"},rock:{color:L.STONE_DARK,variation:.13,step:"stone"}};function WE(i,t,e,n,s,o){const r=s-e,a=o-n,c=r*r+a*a,l=c===0?0:Math.max(0,Math.min(1,((i-e)*r+(t-n)*a)/c));return Math.hypot(i-(e+r*l),t-(n+a*l))}function Lf(i,t,e){for(let n=i.length-1;n>=0;n--){const s=i[n];switch(s.kind){case"blot":if(Math.hypot(t-s.at[0],e-s.at[1])<=s.radius)return s.material;break;case"field":if(t>=s.min[0]&&t<=s.max[0]&&e>=s.min[1]&&e<=s.max[1])return s.material;break;case"path":{const o=s.width/2;for(let r=0;r+1<s.through.length;r++){const a=s.through[r],c=s.through[r+1];if(WE(t,e,a[0],a[1],c[0],c[1])<=o)return s.material}break}}}return null}function XE(i,t){let e=Math.round(i/1.2)*374761393+Math.round(t/1.2)*668265263|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function wo(i){const t=i<0?0:i>1?1:i;return t*t*t*(t*(t*6-15)+10)}function qE(i,t,e,n,s,o){const r=s-e,a=o-n,c=r*r+a*a,l=c===0?0:Math.max(0,Math.min(1,((i-e)*r+(t-n)*a)/c));return Math.hypot(i-(e+r*l),t-(n+a*l))}class YE{size;resolution;landforms;patches;detail;rockAngle;base;constructor(t){this.size=t.size,this.resolution=t.resolution,this.landforms=t.landforms,this.patches=t.patches??[],this.detail=t.detail??[],this.rockAngle=t.rockAngle??34,this.base=t.base??"turf"}heightAt(t,e){let n=0;for(const s of this.landforms)switch(s.kind){case"terrace":break;case"hill":{const o=Math.hypot(t-s.at[0],e-s.at[1]),r=wo(1-o/s.radius);n+=s.height*(s.falloff?r**s.falloff:r);break}case"ridge":{const o=qE(t,e,s.from[0],s.from[1],s.to[0],s.to[1]);n+=s.height*wo(1-o/s.width);break}case"basin":{const o=Math.hypot(t-s.at[0],e-s.at[1]);n-=s.depth*wo(1-o/s.radius);break}case"rim":{const r=this.size/2-Math.max(Math.abs(t),Math.abs(e));n+=s.height*wo(1-r/s.inset);break}}for(const s of this.landforms){if(s.kind!=="terrace")continue;const o=Math.hypot(t-s.at[0],e-s.at[1]);if(o>=s.radius+s.blend)continue;const r=o<=s.radius?1:wo((s.radius+s.blend-o)/s.blend);n=n*(1-r)+s.height*r}return n}get detailRegions(){return this.detail}slopeAt(t,e,n=this.resolution){const s=(this.heightAt(t+n,e)-this.heightAt(t-n,e))/(2*n),o=(this.heightAt(t,e+n)-this.heightAt(t,e-n))/(2*n);return Math.atan(Math.hypot(s,o))*180/Math.PI}build(){const t=Math.round(this.size/this.resolution),e=this.size/2,n=this.resolution,s=new Uint8Array(t*t);for(let _=0;_<t;_++)for(let w=0;w<t;w++){const v=-e+(w+.5)*n,b=-e+(_+.5)*n;let S=1;for(const E of this.detail)Math.hypot(v-E.at[0],b-E.at[1])<=E.radius&&(S=Math.max(S,E.level));s[_*t+w]=S}const o=(_,w)=>_<0||w<0||_>=t||w>=t?1:s[_*t+w],r=[],a=[],c=[],l=new C,h=new C,u=new C,f=new C,d=new C,g=new C,y=new Wt,m=(_,w)=>{r.push(_.x,_.y,_.z),a.push(w.x,w.y,w.z),c.push(y.r,y.g,y.b)};for(let _=0;_<t;_++)for(let w=0;w<t;w++){const v=s[_*t+w],b=-e+w*n,S=-e+_*n,E=o(_,w-1),T=o(_,w+1),M=o(_-1,w),x=o(_+1,w),A=(P,R)=>P===0&&E<v?this.alongEdge(b,S,b,S+n,R,E):P===1&&T<v?this.alongEdge(b+n,S,b+n,S+n,R,T):R===0&&M<v?this.alongEdge(b,S,b+n,S,P,M):R===1&&x<v?this.alongEdge(b,S+n,b+n,S+n,P,x):this.heightAt(b+P*n,S+R*n);for(let P=0;P<v;P++)for(let R=0;R<v;R++){const F=R/v,D=(R+1)/v,N=P/v,H=(P+1)/v,G=[[b+F*n,A(F,N),S+N*n],[b+F*n,A(F,H),S+H*n],[b+D*n,A(D,H),S+H*n],[b+D*n,A(D,N),S+N*n]];for(const[V,et,lt]of[[0,1,2],[0,2,3]])l.set(...G[V]),h.set(...G[et]),u.set(...G[lt]),f.subVectors(h,l),d.subVectors(u,l),g.crossVectors(f,d).normalize(),g.y<0&&g.negate(),y.set(this.faceColor(g.y,(l.y+h.y+u.y)/3,(l.x+h.x+u.x)/3,(l.z+h.z+u.z)/3)),m(l,g),m(h,g),m(u,g)}}const p=new Le;return p.setAttribute("position",new ae(r,3)),p.setAttribute("normal",new ae(a,3)),p.setAttribute("color",new ae(c,3)),p.setAttribute(Xs,new ae(new Float32Array(r.length/3),1)),_t(p,"terrain",0)}alongEdge(t,e,n,s,o,r){const a=1/r,l=Math.min(r-1,Math.floor(o/a))*a,h=l+a,u=this.heightAt(t+(n-t)*l,e+(s-e)*l),f=this.heightAt(t+(n-t)*h,e+(s-e)*h);return u+(f-u)*((o-l)/a)}materialAt(t,e){return this.slopeAt(t,e)>this.rockAngle?"rock":Lf(this.patches,t,e)??this.base}stepAt(t,e){return If[this.materialAt(t,e)].step}faceColor(t,e,n,s){const r=Math.acos(Math.min(1,Math.max(-1,t)))*180/Math.PI>this.rockAngle?"rock":Lf(this.patches,n,s)??this.base,a=If[r],c=1+(XE(n,s)-.5)*a.variation*2,l=1-Math.min(Math.max(e/55,0),1)*.16;return I(a.color,c*l)}}const $E={name:"tree",category:"foliage",radius:2.2,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(3.2,4.6),o=e.range(0,Math.PI*2),r=s*e.range(.55,.68),a=new Y(e.range(.11,.17),e.range(.24,.34),r,6);a.translate(0,r/2,0),n.push({geometry:a,color:L.BARK,sway:Ce(0,s,2.2)});const c=e.int(2,4);for(let f=0;f<c;f++){const d=r*e.range(.6,.95),g=e.range(.7,1.3),y=new Y(.045,.09,g,4);y.translate(0,g/2,0),y.rotateZ(e.range(.5,1.05)),y.rotateY(o+f/c*Math.PI*2+e.around(0,.4)),y.translate(0,d,0),n.push({geometry:y,color:L.BARK_PALE,sway:Ce(0,s,1.4)})}const l=e.int(3,5),h=r+e.range(.3,.7);for(let f=0;f<l;f++){const d=e.range(.75,1.35),g=new ee(d,0);g.rotateX(e.range(0,Math.PI)),g.rotateY(e.range(0,Math.PI)),g.scale(1,e.range(.72,.95),1);const y=e.range(0,.95),m=o+f/l*Math.PI*2+e.around(0,.5);g.translate(Math.cos(m)*y,h+e.around(0,.45),Math.sin(m)*y),n.push({geometry:g,color:e.chance(.25)?L.LEAF_DARK:L.LEAF,sway:e.range(.82,1)})}const u=pt(n);return t!==1&&u.scale(t,t,t),_t(u,"tree",e()*Math.PI*2)}},ZE={name:"bush",category:"foliage",radius:1,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.int(3,5),o=e.range(.35,.7);for(let a=0;a<s;a++){const c=e.range(.3,.62),l=new ee(c,0);l.rotateX(e.range(0,Math.PI)),l.rotateY(e.range(0,Math.PI)),l.scale(1,e.range(.6,.85),1);const h=a/s*Math.PI*2+e.around(0,.6),u=e.range(0,o),f=c*e.range(.55,.85);l.translate(Math.cos(h)*u,f,Math.sin(h)*u),n.push({geometry:l,color:e.chance(.2)?L.LEAF_DRY:L.LEAF,sway:(d,g)=>Math.min(1,.35+g*.75)})}const r=pt(n);return t!==1&&r.scale(t,t,t),_t(r,"bush",e()*Math.PI*2)}},Wm={name:"small-grass-clump",category:"foliage",radius:.55,solid:!1,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.int(30,46);for(let r=0;r<s;r++){const a=e.range(.16,.6),c=new jt(e.range(.016,.032),a,3);c.translate(0,a/2,0),c.scale(1,1,e.range(.3,.55));const l=e.range(.1,.75)*(a/.6);c.rotateZ(e.chance(.5)?l:-l),c.rotateY(e.range(0,Math.PI*2));const h=e.range(0,Math.PI*2),u=Math.sqrt(e())*.26;c.translate(Math.cos(h)*u,0,Math.sin(h)*u),n.push({geometry:c,color:e.chance(.3)?L.GRASS_DRY:L.GRASS,sway:(f,d)=>Math.max(0,d/a)**1.5})}const o=pt(n);return t!==1&&o.scale(t,t,t),_t(o,"small-grass-clump",e()*Math.PI*2)}},Xm={name:"large-grass-clump",category:"foliage",radius:1.6,solid:!1,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(.7,.95),o=e.int(5,8),r=[];for(let h=0;h<o;h++){const u=h/o*Math.PI*2+e.range(-.5,.5),f=e.range(.25,.85)*s;r.push({x:Math.cos(u)*f,z:Math.sin(u)*f,grip:e.range(.24,.42)})}const a=e.int(430,620);for(let h=0;h<a;h++){let u,f,d=!1;if(e.chance(.5)){const p=r[e.int(0,r.length-1)],_=e.range(0,Math.PI*2),w=Math.sqrt(e())*p.grip;u=p.x+Math.cos(_)*w,f=p.z+Math.sin(_)*w,d=!0}else{const p=e.range(0,Math.PI*2),_=Math.sqrt(e())*s;u=Math.cos(p)*_,f=Math.sin(p)*_}const g=d?e.range(.3,.72):e.range(.1,.34),y=new jt(e.range(.014,.03),g,3);y.translate(0,g/2,0),y.scale(1,1,e.range(.3,.55));const m=e.range(.1,.8)*(g/.72);y.rotateZ(e.chance(.5)?m:-m),y.rotateY(e.range(0,Math.PI*2)),y.translate(u,0,f),n.push({geometry:y,color:e.chance(d?.2:.4)?L.GRASS_DRY:L.GRASS,sway:(p,_)=>Math.max(0,_/g)**1.5})}const c=e.int(14,26);for(let h=0;h<c;h++){const u=r[e.int(0,r.length-1)],f=e.range(0,Math.PI*2),d=Math.sqrt(e())*(e.chance(.7)?u.grip*1.4:s),g=(e.chance(.7)?u.x:0)+Math.cos(f)*d,y=(e.chance(.7)?u.z:0)+Math.sin(f)*d,m=e.range(.6,1.05),p=e.range(.05,.34),_=e.range(0,Math.PI*2),w=Math.cos(_)*p,v=Math.sin(_)*p,b=new Y(.0035,.006,m,4);b.translate(0,m/2,0),b.rotateX(w),b.rotateZ(v),b.translate(g,0,y),n.push({geometry:b,color:I(L.GRASS_DRY,e.range(.9,1.1)),sway:(M,x)=>Math.max(0,x/m)**1.3});const S=M=>JE.set(0,M*m,0).applyAxisAngle(KE,w).applyAxisAngle(jE,v).add(QE.set(g,0,y)),E=e.int(3,6),T=e.range(.14,.24);for(let M=0;M<E;M++){const x=M/E,A=.011*(1-x*.4),P=A*e.range(3,4.5),R=new jt(A,P,3);R.translate(0,P/2,0),R.scale(1,1,.6),R.rotateZ(e.range(.5,1.1)),R.rotateY(M/E*Math.PI*2+e.range(0,.6));const F=S(1-T*x);R.translate(F.x,F.y,F.z),n.push({geometry:R,color:I(e.chance(.4)?10260316:L.GRASS_DRY,e.range(.9,1.12)),sway:1})}}const l=pt(n);return t!==1&&l.scale(t,t,t),_t(l,"large-grass-clump",e()*Math.PI*2)}},KE=new C(1,0,0),jE=new C(0,0,1),JE=new C,QE=new C,qm={name:"mushroom",category:"foliage",radius:.4,solid:!1,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.chance(.42)?"button":e.chance(.55)?"open":"puffball",o=e.pick([L.RUST,L.EARTH,L.STONE_PALE,L.BARK_PALE,9058862,12100712]),r=e.chance(.5)?L.CLOTH:14209212,a=s==="puffball"?e.int(4,9):e.int(3,7);for(let l=0;l<a;l++){const h=e(),u=e.range(.045,.13)*(.5+h*.75),f=e.range(0,Math.PI*2),d=Math.sqrt(e())*.22,g=Math.cos(f)*d,y=Math.sin(f)*d;if(s==="puffball"){const v=u*e.range(.5,.9),b=new Y(u*.62,u*.4,v,6);b.translate(g,v/2,y),n.push({geometry:b,color:I(r,.9),sway:0});const S=new ee(u*1.15,1);S.scale(1,e.range(.78,.95),1),S.translate(g,v+u*.72,y),n.push({geometry:S,color:I(r,e.range(.92,1.1)),sway:0});continue}const m=e.around(0,.2),p=u*e.range(1.1,2.4),_=u*e.range(.24,.36),w=new Y(_*.86,_*1.2,p,6);if(w.translate(0,p/2,0),w.rotateZ(m),w.translate(g,0,y),n.push({geometry:w,color:I(r,e.range(.94,1.06)),sway:0}),s==="button"){const v=u*(.8+h*.5),b=u*(1.35-h*.6),S=new jt(v,b,e.int(7,9));S.translate(0,b*.34,0),S.rotateZ(m),S.translate(g,p,y),n.push({geometry:S,color:o,sway:0})}else{const v=u*(1.3+h*.7),b=new Y(v*.55,v,u*.2,9);b.rotateZ(m),b.translate(g,p+u*.08,y),n.push({geometry:b,color:o,sway:0});const S=new Y(v*1.04,v*.9,u*.13,9);S.rotateZ(m),S.translate(g,p+u*.2,y),n.push({geometry:S,color:I(o,1.14),sway:0});const E=new Y(v*.86,v*.5,u*.1,9);E.rotateZ(m),E.translate(g,p-u*.02,y),n.push({geometry:E,color:I(r,.88),sway:0})}}const c=pt(n);return t!==1&&c.scale(t,t,t),_t(c,"mushroom",0)}},Ym={name:"rock",category:"nature",radius:.9,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=e.range(.35,1.1),s=new ee(n,n>.7?1:0);s.deleteAttribute("normal"),s.deleteAttribute("uv");const o=Mu(s);s.dispose();const r=o.getAttribute("position"),a=new C;for(let h=0;h<r.count;h++)a.fromBufferAttribute(r,h),a.multiplyScalar(e.range(.72,1.28)),r.setXYZ(h,a.x,a.y,a.z);r.needsUpdate=!0,o.scale(1,e.range(.6,.85),e.range(.85,1.15)),o.translate(0,n*e.range(.28,.45),0),o.computeVertexNormals();const c=[{geometry:o,color:e.chance(.3)?L.STONE_DARK:L.STONE,sway:0}],l=pt(c);return t!==1&&l.scale(t,t,t),_t(l,"rock",0)}};function tT(i,t){const e=new ee(t,0);e.deleteAttribute("normal"),e.deleteAttribute("uv");const n=Mu(e);e.dispose();const s=n.getAttribute("position"),o=new C;for(let r=0;r<s.count;r++)o.fromBufferAttribute(s,r),o.multiplyScalar(i.range(.78,1.2)),s.setXYZ(r,o.x,o.y,o.z);return s.needsUpdate=!0,n.scale(1,i.range(.45,.7),i.range(.85,1.1)),n.computeVertexNormals(),n}const $m={name:"cairn",category:"nature",radius:.7,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.int(4,7);let o=e.range(.26,.38),r=0;for(let c=0;c<s;c++){const l=tT(e,o);l.computeBoundingBox();const h=l.boundingBox,u=h?(h.max.y-h.min.y)/2:o*.5;l.rotateY(e.range(0,Math.PI*2)),r+=u*(c===0?1:1.55),l.translate(e.around(0,o*.14),r,e.around(0,o*.14)),n.push({geometry:l,color:e.chance(.35)?L.STONE_DARK:L.STONE,sway:0}),o*=e.range(.76,.9)}const a=pt(n);return t!==1&&a.scale(t,t,t),_t(a,"cairn",0)}},Zm={name:"stump",category:"foliage",radius:.75,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(.3,.7),o=e.range(.22,.36),r=o*e.range(1.25,1.6),a=e.int(6,9),c=e.range(0,.12),l=new Y(o,r,s,a);l.translate(0,s/2,0),l.rotateZ(c),n.push({geometry:l,color:L.BARK,sway:0});const h=new Y(o*.94,o*.94,.04,a);h.translate(0,s,0),h.rotateZ(c),n.push({geometry:h,color:L.BARK_PALE,sway:0});const u=e.int(3,6);for(let d=0;d<u;d++){const g=e.range(.3,.6),y=new Y(.04,.11,g,4);y.translate(0,-g/2,0),y.rotateZ(e.range(1.05,1.45)),y.rotateY(d/u*Math.PI*2+e.around(0,.5)),y.translate(0,e.range(.05,.16),0),n.push({geometry:y,color:L.BARK,sway:0})}const f=pt(n);return t!==1&&f.scale(t,t,t),_t(f,"stump",0)}},Km={name:"fence",category:"structures",radius:2.4,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.int(3,5),o=e.range(1.1,1.6),r=e.range(.85,1.25),a=e.int(2,3),c=s*o;for(let h=0;h<=s;h++){const u=h*o-c/2,f=e.around(0,.09),d=r*e.range(.85,1.1),g=new k(.11,d,.11);g.translate(0,d/2,0),g.rotateZ(f),g.rotateY(e.around(0,.25)),g.translate(u,0,e.around(0,.06)),n.push({geometry:g,color:L.TIMBER,sway:0})}for(let h=0;h<s;h++){if(e.chance(.22))continue;const u=h*o-c/2+o/2;for(let f=0;f<a;f++){const d=r*(.32+f/Math.max(a-1,1)*.52),g=new k(o*1.02,.07,.05);g.rotateZ(e.around(0,.05)),g.translate(u,d+e.around(0,.03),e.around(0,.03)),n.push({geometry:g,color:L.TIMBER_DARK,sway:0})}}const l=pt(n);return l.rotateY(e.range(0,Math.PI)),t!==1&&l.scale(t,t,t),_t(l,"fence",0)}},jm={name:"post",category:"structures",radius:.4,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(.9,2.1),o=e.range(.07,.13),r=e.range(.02,.16),a=e.range(0,Math.PI*2),c=new k(o*2,s,o*2);if(c.translate(0,s/2,0),c.rotateZ(r),c.rotateY(a),n.push({geometry:c,color:L.TIMBER,sway:0}),e.chance(.4)){const h=e.range(.5,1.1),u=new k(h,o*1.4,o*1.4);u.translate(0,s*e.range(.6,.85),0),u.rotateZ(r),u.rotateY(a+e.around(0,.3)),n.push({geometry:u,color:L.TIMBER_DARK,sway:0})}if(e.chance(.45)){const h=new k(o*2.5,.09,o*2.5);h.translate(0,s-.09,0),h.rotateZ(r),h.rotateY(a),n.push({geometry:h,color:L.RUST,sway:0})}const l=pt(n);return t!==1&&l.scale(t,t,t),_t(l,"post",0)}},Jm={name:"trough",category:"objects",radius:1.1,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(1.4,2.1),o=e.range(.5,.75),r=e.range(.4,.6),a=e.range(.09,.14),c=e.chance(.55),l=c?L.STONE:L.TIMBER,h=new k(s-a,a,o-a);h.translate(0,a/2+.01,0),n.push({geometry:h,color:c?L.STONE_DARK:L.TIMBER_DARK,sway:0});for(const f of[-1,1]){const d=new k(s*.99,r,a);d.translate(0,r/2,f*(o-a)/2),n.push({geometry:d,color:l,sway:0});const g=new k(a,r*.985,o*.985);g.translate(f*(s-a)/2,r/2,0),n.push({geometry:g,color:l,sway:0})}if(e.chance(.6)){const f=new k(s-a*1.6,.03,o-a*1.6);f.translate(0,r*e.range(.55,.78),0),n.push({geometry:f,color:2899782,sway:0})}const u=pt(n);return u.rotateY(e.range(0,Math.PI)),t!==1&&u.scale(t,t,t),_t(u,"trough",0)}};function Ue(i,t,e,n,s){const o=new ee(t,e);o.deleteAttribute("normal"),o.deleteAttribute("uv");const r=Mu(o);o.dispose();const a=r.getAttribute("position"),c=new C;for(let l=0;l<a.count;l++)c.fromBufferAttribute(a,l),c.multiplyScalar(i.range(n,s)),a.setXYZ(l,c.x,c.y,c.z);return a.needsUpdate=!0,r.computeVertexNormals(),r}function ws(i,t){return i.range(t[0],t[1])}function eT(i,t,e,n,s){const o=e.range(0,100),r=e.range(0,100),a=e.range(0,100),c=(h,u,f)=>{let d=Math.imul(Math.round(h)*374761393+Math.round(u)*668265263,1);return d=Math.imul(d^d>>>13,1274126177)+Math.round(f)*951274213,d^=d>>>16,(d>>>0)%1e3/1e3},l=(h,u,f)=>{const d=Math.floor(h),g=Math.floor(u),y=Math.floor(f),m=_l(h-d),p=_l(u-g),_=_l(f-y);let w=0;for(let v=0;v<=1;v++)for(let b=0;b<=1;b++)for(let S=0;S<=1;S++){const E=(S?m:1-m)*(b?p:1-p)*(v?_:1-_);w+=c(d+S,g+b,y+v)*E}return w};return(h,u,f)=>l(h*n+o,u*n+r,f*n+a)<s?t:i}function _l(i){return i*i*(3-2*i)}function sr(i,t,e,{scale:n=1}){const s=[],o=ws(e,t.length),r=ws(e,t.girth),a=ws(e,t.legLength),c=r*e.range(.62,.78),l=e.pick(t.hide),h=a+r/2,u=t.woolly||o>1.2?1:0,f=t.woolly?Ue(e,r/2,u,.86,1.24):new ee(r/2,u);f.scale(c/r,1,o/r),f.rotateZ(e.around(0,.05)),f.translate(0,h,0);const d=t.woolly?nT:t.patch?eT(l,e.pick(t.patch),e,2.6/r,t.patchCoverage??.45):l;s.push({geometry:f,color:d,sway:0});const g=ws(e,t.neck),y=ws(e,t.neckRise),m=new C(0,h+r*.18,o*.4),p=r*.45,_=g+p,w=new Y(r*.17,r*.24,_,6);w.translate(0,_/2-p,0),w.rotateX(Math.PI/2-y),w.translate(m.x,m.y,m.z),s.push({geometry:w,color:d,sway:0});const v=new C(0,m.y+Math.sin(y)*g,m.z+Math.cos(y)*g),b=ws(e,t.headSize);if(t.head)s.push(...t.head({at:v,size:b,coat:d,extremity:t.extremity,rng:e}));else{const E=new ee(b,0);if(E.scale(.85,.9,t.headStretch),E.rotateY(e.around(0,.2)),E.translate(v.x,v.y,v.z),s.push({geometry:E,color:d,sway:0}),t.snout>0){const T=new Y(b*t.snout*.52,b*t.snout*.66,b*.62,6);T.rotateX(Math.PI/2),T.translate(v.x,v.y-b*.13,v.z+b*t.headStretch*.66),s.push({geometry:T,color:t.extremity,sway:0})}}for(const E of[-1,1]){if(!t.head&&t.ears!=="none"){const T=new jt(b*.28,b*.85,4);T.translate(0,b*.42,0),t.ears==="floppy"?T.rotateZ(E*2.4):t.ears==="side"?T.rotateZ(E*1.5):T.rotateZ(E*.35),T.translate(v.x+E*b*.6,v.y+b*.4,v.z),s.push({geometry:T,color:t.extremity,sway:0})}if(t.horns!=="none"){const T=b*(t.horns==="curved"?1.5:.7),M=new jt(b*.16,T,5);M.translate(0,T/2,0),M.rotateZ(E*(t.horns==="curved"?1.1:.5)),M.translate(v.x+E*b*.45,v.y+b*.55,v.z),s.push({geometry:M,color:Df,sway:0})}for(const T of[-1,1]){const M=h,x=new Y(t.legThickness*.78,t.legThickness,M,5);if(x.translate(0,M/2,0),x.rotateZ(E*e.range(-.02,.07)),x.translate(E*c*.34,0,T*o*e.range(.26,.34)),s.push({geometry:x,color:l,sway:0}),t.feet==="paw"){const A=new k(t.legThickness*2.4,a*.11,t.legThickness*3.6);A.translate(E*c*.34,a*.055,T*o*.3+t.legThickness*.9),s.push({geometry:A,color:t.extremity,sway:0})}else{const A=new Y(t.legThickness*1.15,t.legThickness*1.05,a*.13,5);A.translate(E*c*.34,a*.06,T*o*.3),s.push({geometry:A,color:iT,sway:0})}}}if(t.tail!=="none"){const E=new C(0,h+r*.16,-o*.42);if(t.tail==="carried"){const x=o*e.range(.16,.6)/4;let A=-e.range(.7,1),P=E.x,R=E.y,F=E.z;for(let D=0;D<4;D++){const N=r*.075*(1-D/5),H=new Y(N*.7,N,x*1.15,4);H.translate(0,x/2,0),H.rotateX(A),H.translate(P,R,F),s.push({geometry:H,color:l,sway:xl}),R+=x*Math.cos(A),F+=x*Math.sin(A),A+=e.range(.15,.35)}}else if(t.tail==="curl"){const M=r*.06;for(let x=0;x<9;x++){const A=x/8,P=A*Math.PI*2.2,R=new ee(M*(1-A*.25),0);R.translate(Math.sin(P)*r*.1,E.y+A*r*.2,E.z-r*.04-(1-Math.cos(P))*r*.05),s.push({geometry:R,color:t.extremity,sway:0})}}else{const T=o*(t.tail==="flowing"?.4:.3),M=e.range(.08,.42),x=new Y(r*.07,r*.028,T,4);x.translate(0,-T/2,0),x.rotateX(M),x.translate(E.x,E.y,E.z),s.push({geometry:x,color:l,sway:xl});const A=T*.94,P=new ee(r*.115,0);P.scale(.75,t.tail==="flowing"?1.7:1.05,.75),P.rotateX(M),P.translate(E.x,E.y-A*Math.cos(M),E.z-A*Math.sin(M)),s.push({geometry:P,color:Df,sway:xl})}}const S=pt(s);return S.rotateY(e.range(0,Math.PI*2)),n!==1&&S.scale(n,n,n),_t(S,i,e()*Math.PI*2)}const nT=12433060,Df=9076841,iT=3814187,xl=.4,sT={length:[1.9,2.3],girth:[.85,1.05],legLength:[.62,.78],legThickness:.085,neck:[.4,.55],neckRise:[.05,.3],headSize:[.24,.3],headStretch:1.5,snout:.38,ears:"side",horns:"stub",tail:"switch",woolly:!1,hide:[L.WOOL,L.STONE_PALE],extremity:L.HOG,patch:[L.COW_BLACK,L.COW_BLACK,L.HIDE_DARK],patchCoverage:.46},Qm={name:"bovine",category:"animals",radius:1.4,build:(i={})=>sr("bovine",sT,wt(i.seed??1),i)},oT={length:[.95,1.25],girth:[.55,.7],legLength:[.34,.46],legThickness:.045,neck:[.18,.28],neckRise:[.2,.5],headSize:[.13,.17],headStretch:1.4,snout:.32,ears:"side",horns:"none",tail:"switch",woolly:!0,hide:[L.HIDE_DARK,L.STONE_DARK],extremity:L.HIDE_DARK},tg={name:"ovine",category:"animals",radius:.8,build:(i={})=>sr("ovine",oT,wt(i.seed??1),i)},rT={length:[1.9,2.2],girth:[.75,.9],legLength:[.95,1.15],legThickness:.07,neck:[.6,.8],neckRise:[.75,1.05],headSize:[.2,.25],headStretch:1.9,snout:.3,ears:"perked",horns:"none",tail:"flowing",woolly:!1,hide:[L.HIDE_DARK,L.HIDE,L.BARK],extremity:L.HIDE_DARK},eg={name:"equine",category:"animals",radius:1.4,build:(i={})=>sr("equine",rT,wt(i.seed??1),i)},aT={length:[1.1,1.5],girth:[.6,.78],legLength:[.25,.36],legThickness:.055,neck:[.1,.2],neckRise:[0,.2],headSize:[.19,.24],headStretch:1.45,snout:.75,ears:"floppy",horns:"none",tail:"curl",woolly:!1,hide:[L.HOG,L.HIDE_PALE,L.HIDE_DARK],extremity:L.HOG,patch:[L.HIDE_DARK,L.HIDE],patchCoverage:.3},ng={name:"porcine",category:"animals",radius:.95,build:(i={})=>sr("porcine",aT,wt(i.seed??1),i)},ig={name:"poultry",category:"animals",radius:.35,solid:!1,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(.16,.23),o=e.range(.09,.16),r=e.pick([L.FOWL,L.HIDE_PALE,L.HIDE_DARK,L.CLOTH]),a=o+s*.75,c=new ee(s,0);c.scale(.8,.95,1.25),c.rotateX(e.range(.15,.35)),c.translate(0,a,0),n.push({geometry:c,color:r,sway:0});const l=s*e.range(.42,.55),h=new C(0,a+s*e.range(.75,1.05),s*.6),u=new Y(s*.2,s*.28,s*.55,5);u.rotateX(-.5),u.translate(0,a+s*.5,s*.42),n.push({geometry:u,color:r,sway:0});const f=new ee(l,0);f.translate(h.x,h.y,h.z),n.push({geometry:f,color:r,sway:0});const d=new jt(l*.35,l*.8,4);d.rotateX(Math.PI/2),d.translate(h.x,h.y-l*.15,h.z+l*.9),n.push({geometry:d,color:L.MARKER_YELLOW,sway:0});const g=e.int(2,4);for(let p=0;p<g;p++){const _=p/Math.max(g-1,1),w=new jt(l*.14,l*(.7-_*.3),3);w.scale(1,1,.4),w.translate(h.x,h.y+l*.95,h.z-_*l*.7),n.push({geometry:w,color:L.COMB,sway:.4})}if(e.chance(.6)){const p=new ee(l*.22,0);p.scale(.5,1.1,.7),p.translate(h.x,h.y-l*.75,h.z+l*.5),n.push({geometry:p,color:L.COMB,sway:.3})}const y=e.int(3,5);for(let p=0;p<y;p++){const _=(p/Math.max(y-1,1)-.5)*.8,w=new jt(s*.2,s*e.range(.9,1.4),3);w.scale(1,1,.35),w.translate(0,s*.55,0),w.rotateX(e.range(-1.1,-.7)),w.rotateY(_),w.translate(0,a+s*.35,-s*.85),n.push({geometry:w,color:r,sway:.45})}for(const p of[-1,1]){const _=a,w=new Y(s*.055,s*.05,_,4);w.translate(0,_/2,0),w.rotateZ(p*e.range(0,.12)),w.translate(p*s*.24,0,e.around(0,s*.1)),n.push({geometry:w,color:L.MARKER_YELLOW,sway:0});const v=new jt(s*.13,s*.09,3);v.rotateX(Math.PI),v.translate(p*s*.24,s*.04,s*.06),n.push({geometry:v,color:L.MARKER_YELLOW,sway:0})}const m=pt(n);return m.rotateY(e.range(0,Math.PI*2)),t!==1&&m.scale(t,t,t),_t(m,"poultry",e()*Math.PI*2)}},sg={name:"archway",category:"structures",radius:1.8,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(1.5,1.9),o=e.range(2.6,3.1),r=e.range(.42,.58),a=e.range(.5,.7),c=e.chance(.5)?L.STONE:L.STONE_DARK;for(const u of[-1,1]){const f=e.int(3,4),d=o/f;for(let g=0;g<f;g++){const y=1-g/f*.12,m=new k(r*y,d*1.02,a*y);m.translate(u*(s+r)/2+e.around(0,.02),d*(g+.5),e.around(0,.02)),n.push({geometry:m,color:I(c,e.around(1,.08)),sway:0})}}const l=new k(s+r*2.5,e.range(.34,.46),a*1.1);if(l.translate(0,o+.18,0),n.push({geometry:l,color:I(c,.92),sway:0}),e.chance(.55)){const u=new k(s+r*1.6,.18,a*.8);u.translate(e.around(0,.06),o+.48,0),n.push({geometry:u,color:I(c,1.08),sway:0})}const h=pt(n);return t!==1&&h.scale(t,t,t),_t(h,"archway",0)}},cT=4.5,lT=11,hT=16747068,uT=.86,Gu={name:"forge",category:"structures",radius:1.3,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=[],o=e.range(.85,1.8),r=e.range(.7,1.25),a=e.range(.62,.92),c=e.range(.3,1),l=I(L.IRON,e.range(.85,1.05)),h=I(e.chance(.5)?8014392:7029814,e.range(.9,1.1)),u=2762532,f=e.int(2,4);for(let D=0;D<f;D++){const N=a/f,H=new k(o*(1-D*.015),N,r*(1-D*.015));H.translate(0,N*(D+.5),0),n.push({geometry:H,color:I(h,e.range(.9,1.12)),sway:0})}const d=new k(o*1.02,.06,r*1.02);d.translate(0,a+.03,0),n.push({geometry:d,color:u,sway:0});const g=.1;for(const[D,N,H,G]of[[o*1.02,g,0,-r/2],[g,r*1.02,-o/2,0],[g,r*1.02,o/2,0]]){const V=new k(D,g*1.6,N);V.translate(H,a+g*.8,G),n.push({geometry:V,color:I(h,.86),sway:0})}const y=e.int(5,9);for(let D=0;D<y;D++){const N=e.range(0,Math.PI*2),H=Math.sqrt(e())*o*.22,G=e.range(.035,.075),V=new ee(G,0);V.rotateY(e.range(0,Math.PI)),V.translate(Math.cos(N)*H,a+.06+G*.5,Math.sin(N)*H),n.push({geometry:V,color:e.chance(c*.45)?10239780:I(u,e.range(.85,1.3)),sway:0})}const m=a+.09,p=new Ge(o*.2*(.6+c*.6),0);p.scale(1,.32,.8),p.translate(0,m,0),s.push({geometry:p,color:hT,sway:0});const _=new Ge(o*.09,0);_.scale(1,.5,1),_.translate(e.around(0,.05),m+.02,e.around(0,.05)),s.push({geometry:_,color:16765066,sway:0});const w=a+e.range(.6,1.15),v=w+e.range(.65,1.3),b=o*e.range(.62,.75),S=e.range(.16,.22),E=.03,T=new ei([new tt(b,w),new tt(S,v),new tt(S-E,v),new tt(b-E,w),new tt(b,w)],6);T.rotateY(Math.PI/6),n.push({geometry:T,color:I(l,.92),sway:0});const M=new Y(b*1.05,b*1.05,E*2.2,6);M.rotateY(Math.PI/6),M.translate(0,w+E,0),n.push({geometry:M,color:I(l,1.1),sway:0});const x=new Y(S*.94,S*.94,2.4,6);x.translate(0,v+1.2,0),n.push({geometry:x,color:I(l,.86),sway:0});for(const D of[-1,1]){const N=new k(.06,w-a,.06);N.translate(D*o/2*.86,a+(w-a)/2,-r*.36),n.push({geometry:N,color:l,sway:0})}const A=pt(n),P=pt(s);t!==1&&(A.scale(t,t,t),P.scale(t,t,t));const R=_t(A,"forge",0);R.add(Tn(P,"forge:glow"));const F=new ts(16749632,cT*(.35+c*.9)*e.around(1,.1)*t*t,lT*t,1.35);return F.position.set(0,(m+.1)*t,0),F.castShadow=!1,R.add(F),R}},Vu={name:"anvil",category:"objects",radius:.5,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(.42,.56),o=e.range(.2,.26),r=e.range(.44,.58),a=e.range(.12,.16),c=I(L.IRON,e.range(.88,1.06)),l=new Y(o,o*1.12,s,8);l.translate(0,s/2,0),n.push({geometry:l,color:L.TIMBER_DARK,sway:0});const h=e.range(.055,.08),u=new k(r*.62,h,a*1.5);u.translate(0,s+h/2,0),n.push({geometry:u,color:I(c,.88),sway:0});const f=e.range(.1,.15),d=new k(r*.34,f,a*.78);d.translate(0,s+h+f/2,0),n.push({geometry:d,color:I(c,.94),sway:0});const g=e.range(.09,.13),y=s+h+f,m=new k(r,g,a);m.translate(0,y+g/2,0),n.push({geometry:m,color:(b,S)=>S>y+g*.85?I(c,1.22):c,sway:0});const p=e.range(.16,.24),_=new jt(a*.46,p,6);_.rotateZ(-Math.PI/2),_.translate(r/2+p/2-.01,y+g*.55,0),n.push({geometry:_,color:I(c,1.06),sway:0});const w=new k(e.range(.07,.11),g*.86,a*.92);w.translate(-r/2-.03,y+g*.5,0),n.push({geometry:w,color:I(c,.98),sway:0});const v=pt(n);return v.rotateY(e.range(0,Math.PI*2)),t!==1&&v.scale(t,t,t),_t(v,"anvil",0)}},dT=.78,fT=[[.3,0],[.275,.05],[.225,.14],[.195,.25],[.178,.36],[.172,.44],[.125,.51],[.062,.56],[.045,.56],[.05,.5],[.092,.43],[.122,.35],[.146,.25],[.175,.14],[.222,.05],[.258,0],[.3,0]],og={name:"bell",category:"objects",radius:.75,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(.85,1.25),o=.56*s,r=.3*s,a=o+e.range(.55,.85),c=e.range(.09,.12),l=r*2+e.range(.28,.44);for(const v of[-1,1]){const b=new k(c,a,c*.92);b.translate(0,a/2,0),b.rotateZ(v*-.055),b.translate(v*l/2,0,0),n.push({geometry:b,color:L.TIMBER,sway:0});const S=new k(c*.62,l*.42,c*.6);S.translate(0,l*.21,0),S.rotateZ(v*.72),S.translate(v*l/2,a-l*.3,0),n.push({geometry:S,color:L.TIMBER_DARK,sway:0})}const h=new k(l+c*2.4,c,c);h.translate(0,a-c/2,0),n.push({geometry:h,color:L.TIMBER,sway:0});const f=a-c-o-e.range(.05,.1),d=fT.map(([v,b])=>new tt(v*s,b*s)),g=new ei(d,10);g.translate(0,f,0);const y=I(L.BRONZE,e.range(.9,1.1)),m=f+o*e.range(.42,.62);n.push({geometry:g,color:(v,b)=>b>m?L.PATINA:y,sway:0});const p=new k(.055*s,.12*s,.055*s);p.translate(0,f+o+.05*s,0),n.push({geometry:p,color:I(y,.85),sway:0});const _=new ee(.055*s,0);_.translate(e.around(0,.02),f+.09*s,e.around(0,.02)),n.push({geometry:_,color:L.IRON_DARK,sway:0});const w=pt(n);return w.rotateY(e.range(0,Math.PI*2)),t!==1&&w.scale(t,t,t),_t(w,"bell",0)}},pT=.72;function mT({at:i,size:t,coat:e,extremity:n,rng:s}){const o=[],r=t*1.45,a=new Y(t*.62,t*.78,t*1.5,4);a.rotateX(Math.PI/2),a.rotateZ(Math.PI/4),a.scale(r/(t*1.1),t*1.15/(t*1.1),1),a.translate(i.x,i.y,i.z-t*.15),o.push({geometry:a,color:e,sway:0});const c=t*s.range(.45,1.05),l=i.y-t*.34,h=i.z+t*.6,u=new Y(t*.3,t*.46,c,4);u.rotateX(Math.PI/2),u.rotateZ(Math.PI/4),u.scale(1,.78,1),u.translate(i.x,l,h+c/2),o.push({geometry:u,color:e,sway:0});const f=new k(t*.52,t*.26,c*.8);f.translate(i.x,l-t*.28,h+c*.44),o.push({geometry:f,color:n,sway:0});const d=new k(t*.36,t*.3,t*.22);d.translate(i.x,l+t*.08,h+c+t*.05),o.push({geometry:d,color:2367260,sway:0});const g=new k(r*.82,t*.2,t*.28);g.translate(i.x,i.y+t*.22,h-t*.08),o.push({geometry:g,color:e,sway:0});const y=s.range(.75,1.05);for(const m of[-1,1]){const p=new jt(t*.34,t*y,3);p.translate(0,t*y/2,0),p.scale(1,1,.34),p.rotateZ(m*s.range(.16,.34)),p.rotateX(-s.range(.05,.22)),p.translate(i.x+m*r*.34,i.y+t*.4,i.z-t*.35),o.push({geometry:p,color:n,sway:0})}return o}const gT={length:[.5,.68],girth:[.19,.24],legLength:[.19,.38],legThickness:.026,feet:"paw",neck:[.15,.21],neckRise:[.6,1],headSize:[.1,.13],headStretch:1,snout:0,ears:"none",head:mT,horns:"none",tail:"carried",woolly:!1,hide:[L.HIDE,L.HIDE_DARK,L.HIDE_PALE,L.STONE_DARK],extremity:L.HIDE_DARK},rg={name:"dog",category:"animals",radius:.55,build:(i={})=>sr("dog",gT,wt(i.seed??1),i)},Wu="village",ag=96,Nf=ag/2,yT=[{kind:"basin",at:[0,0],radius:34,depth:3},{kind:"hill",at:[18,-12],radius:12,height:4.5,falloff:1.3},{kind:"hill",at:[20,8],radius:10,height:3.5,falloff:1.4},{kind:"hill",at:[8,20],radius:11,height:3,falloff:1.5},{kind:"terrace",at:[-6,1],radius:26,height:-3,blend:9},{kind:"terrace",at:[0,34],radius:6,height:-.4,blend:7},{kind:"rim",inset:13,height:14}],vT=[{kind:"field",min:[16,-6],max:[30,8],material:"crop"},{kind:"field",min:[-30,14],max:[-16,28],material:"meadow"},{kind:"blot",at:[-24,-6],radius:11,material:"meadow"},{kind:"path",through:[[0,34],[0,22],[0,15]],width:3,material:"dirt"},{kind:"path",through:[[4,2],[14,-2],[24,-2]],width:2.4,material:"dirt"},{kind:"path",through:[[-9,13],[0,8],[9,1]],width:2.2,material:"cobble"},{kind:"path",through:[[-2,17],[0,8],[1,-2]],width:2.2,material:"cobble"},{kind:"path",through:[[7,15],[0,8],[-7,0]],width:2.2,material:"cobble"},{kind:"path",through:[[11,8],[0,8],[-12,6]],width:2.2,material:"cobble"},{kind:"blot",at:[-16,-10],radius:7,material:"mire"}],Si=new YE({size:ag,resolution:3,landforms:yT,patches:vT,detail:[{at:[-6,1],radius:26,level:2},{at:[-6,1],radius:20,level:4},{at:[0,34],radius:5,level:3}]}),wT=Si,Xi=new C(0,0,34),Cs={forge:[14.2,5.6],anvil:[13,3.8]},Bh=[-5.4,19.2],Hh=[-8.5,4.5];function na(i,t){return[i[0],Si.heightAt(i[0],i[1])+t,i[1]]}const _T={bed:[{model:"wind",id:"wind",options:{gain:.15,tone:3e3}},{model:"rain",id:"rain",options:{gain:.5,intensity:0,surface:"earth",articulation:.3}}],emitters:[{model:"foliage",id:"wood-north",at:[-26,4,-31],options:{density:260,tone:.78,gain:.4,articulation:.2},refDistance:3,maxDistance:24,rolloff:1.6,reverb:.3},{model:"foliage",id:"wood-east",at:[33,4,-9],options:{density:240,tone:.85,gain:.38,articulation:.22},refDistance:3,maxDistance:22,rolloff:1.6,reverb:.3},{model:"foliage",id:"hedge",at:[-11,1,14],options:{density:150,tone:1.5,gain:.24,articulation:.34},refDistance:1.4,maxDistance:13,reverb:.22},{model:"bird",id:"bird-west",at:[-24,6,4],options:{pitch:2500,interval:7,gain:.07,tone:2700},refDistance:5,maxDistance:46,rolloff:1.3,reverb:.9},{model:"bird",id:"bird-south",at:[17,5.5,34],options:{pitch:3100,interval:11,gain:.055,tone:3e3},refDistance:5,maxDistance:44,rolloff:1.35,reverb:.9},{model:"fire",id:"forge",at:na(Cs.forge,uT),options:{gain:.5,intensity:.85,tone:1.15,crackle:.65,draught:.12},refDistance:2,maxDistance:20,rolloff:1.5,reverb:.35},{model:"friction",id:"gate",at:[Xi.x+.9,1.7,Xi.z],options:{motion:"weather",speed:.22,force:.85,pitch:150,decay:1.1,bright:.2,roughness:.15,gain:.3},refDistance:3,maxDistance:40,rolloff:1.4,reverb:.5},{model:"crowd",id:"folk",at:[-3,1.4,16],options:{voices:5,density:.4,pitch:132,variety:.55,gain:.36,distance:1450},refDistance:5,maxDistance:30,rolloff:1.5,reverb:.6}],scatter:[{sound:"hammer",id:"smith",at:na(Cs.anvil,dT),spread:[.7,.2,.7],every:13,force:[.45,1],options:{gain:.5,tone:.95,damping:.35,bounces:2},refDistance:3,maxDistance:52,rolloff:1.1,reverb:.55},{sound:"clatter",id:"yards",at:[0,1,8],spread:[13,.5,11],every:26,force:[.3,.85],options:{material:"wood",gain:.45,tone:1.05},refDistance:2.5,maxDistance:34,rolloff:1.25,reverb:.4},{sound:"animal",id:"cattle",at:[-16,1.1,-10],spread:[4,.2,4],every:44,force:[.5,.9],voices:1,options:{kind:"cow",gain:.55,tone:.97},refDistance:4,maxDistance:48,rolloff:1.1,reverb:.5},{sound:"animal",id:"sheep",at:[-16.5,.9,-11],spread:[5,.2,5],every:27,force:[.4,.85],voices:1,options:{kind:"sheep",gain:.42,tone:1.06},refDistance:3.5,maxDistance:40,rolloff:1.2,reverb:.45},{sound:"animal",id:"fowl",at:[-2,.7,6],spread:[8,.15,8],every:16,force:[.3,.7],voices:1,options:{kind:"fowl",gain:.3,tone:1},refDistance:2.5,maxDistance:26,rolloff:1.35,reverb:.35},{sound:"animal",id:"dog",at:na(Hh,.4),spread:[2.2,.2,2.2],every:36,force:[.45,1],voices:1,options:{kind:"dog",gain:.5,tone:.94},refDistance:4,maxDistance:50,rolloff:1.15,reverb:.55},{sound:"bell",id:"bell",at:na(Bh,pT),spread:[0,0,0],every:95,rhythm:"periodic",force:[.8,1],voices:1,options:{hz:186,decay:12,gain:.34,strokes:2,interval:2.6,warble:1.1},refDistance:8,maxDistance:70,rolloff:.9,reverb:1}]};function xT(){return{id:Wu,name:"Arkstin Village",environment:{...nr,fogNear:30,fogFar:190,footstepReverb:.5,soundscape:_T},spawn:{position:cg(0,28),yaw:Math.PI},floor:-20,surfaceAt:(i,t)=>Si.stepAt(i,t),groundAt:(i,t)=>Si.heightAt(i,t),build:bT}}function cg(i,t,e=0){return new C(i,Si.heightAt(i,t)+e,t)}function Ne(i,t,e,n,s,o=!0){t.position.copy(cg(e,n)),t.rotation.y=s,i.add(o?ge(t):t)}function sn(i,t,e){const n=wt(e.seed),[s,o]=e.from??[0,0],r=e.maxSlope??26,a=e.avoid??[],c=t.solid!==!1;for(let l=0;l<e.count;l++){const h=n.range(0,Math.PI*2),u=Math.sqrt(n())*e.within,f=s+Math.cos(h)*u,d=o+Math.sin(h)*u,g=n.range(0,Math.PI*2),y=e.scale?n.range(e.scale[0],e.scale[1]):1,m=n.int(1,1e6);if(Math.abs(f)>Nf-8||Math.abs(d)>Nf-8||Si.slopeAt(f,d)>r)continue;const p=Si.heightAt(f,d);if(e.minHeight!==void 0&&p<e.minHeight||e.maxHeight!==void 0&&p>e.maxHeight)continue;let _=!1;for(const[w,v,b]of a)if(Math.hypot(f-w,d-v)<b){_=!0;break}_||Ne(i,t.build({seed:m,scale:y}),f,d,g,c)}}const _s=[[0,8,17],[0,24,10],[0,33,8],[-16,-10,9]],MT=[[-9,13],[-2,17],[7,15],[11,8],[9,1],[1,-2],[-7,0],[-12,6]],Uf=[0,8];function bT(){const i=new he;i.name="ArkstinVillage",i.add(ge(Si.build())),Ne(i,sg.build({seed:4714}),Xi.x,Xi.z,Math.PI),MT.forEach(([t,e],n)=>{Ne(i,Na.build({seed:700+n*131}),t,e,Math.atan2(Uf[0]-t,Uf[1]-e))});for(let t=0;t<5;t++){const e=t/5*Math.PI*2;Ne(i,Km.build({seed:400+t}),-16+Math.cos(e)*8,-10+Math.sin(e)*8,e)}return Ne(i,Jm.build({seed:91}),-13,-13,.4),sn(i,Qm,{seed:8801,count:2,within:5,from:[-16,-10],maxSlope:20}),sn(i,tg,{seed:8802,count:4,within:6,from:[-16,-10],maxSlope:20}),sn(i,ng,{seed:8803,count:2,within:5,from:[-17,-8],maxSlope:20}),sn(i,ig,{seed:8804,count:6,within:9,from:[-2,6],maxSlope:18}),sn(i,eg,{seed:8805,count:2,within:6,from:[-24,4],maxSlope:18}),Ne(i,Yo.build({seed:2211}),4,11,.3),Ne(i,ji.build({seed:2212}),6,12,1.1),Ne(i,bi.build({seed:2213}),-4,5,0),Ne(i,bi.build({seed:2214}),-5,6.5,.7),Ne(i,ji.build({seed:2215}),9,5,.5),Ne(i,jm.build({seed:2216}),-2,11,0),Ne(i,Gu.build({seed:5401}),Cs.forge[0],Cs.forge[1],Math.PI),Ne(i,Vu.build({seed:5402}),Cs.anvil[0],Cs.anvil[1],.6),Ne(i,og.build({seed:5403}),Bh[0],Bh[1],-.5),Ne(i,rg.build({seed:5404}),Hh[0],Hh[1],1.9,!1),Ne(i,Ns.build({seed:3301}),3,7,2.2),Ne(i,Ns.build({seed:3302}),-3,9,1.1),Ne(i,Ns.build({seed:3303}),6,3,-.8),sn(i,$E,{seed:5001,count:130,within:42,maxSlope:30,maxHeight:9,avoid:_s,scale:[.8,1.35]}),sn(i,ZE,{seed:5002,count:90,within:42,maxSlope:32,avoid:_s}),sn(i,Xm,{seed:5002,count:40,within:42,maxSlope:24,avoid:_s}),sn(i,Wm,{seed:5003,count:120,within:42,maxSlope:28,avoid:_s}),sn(i,qm,{seed:5004,count:40,within:36,maxSlope:22,avoid:_s}),sn(i,Zm,{seed:5005,count:16,within:36,maxSlope:24,avoid:_s}),sn(i,Ym,{seed:6001,count:70,within:45,maxSlope:44,minHeight:4,scale:[.7,1.6]}),sn(i,$m,{seed:6002,count:7,within:38,maxSlope:20,minHeight:5}),i}const Oi=Math.PI*2,ST={name:"oak",category:"foliage",radius:3.4,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(7.3,9.4),o=e.range(.38,.52),r=s*e.range(.2,.27),a=s*e.range(.27,.34),c=s*e.range(.7,.77),l=e.range(0,Oi),h=e.range(.02,.09),u=v=>{const b=v/s,S=h*b**2;return new C(Math.cos(l)*S,v,Math.sin(l)*S)},f=()=>I(L.BARK,e.range(.88,1.12)),d=e.range(.38,.55);n.push({geometry:Bt(new C(0,0,0),u(d*1.08),o*e.range(1.28,1.45),o*1.02,8),color:f(),sway:Ce(0,s,3)});const g=2;for(let v=0;v<g;v++){const b=d+(r-d)*v/g,S=d+(r-d)*(v+1)/g,E=u(b),T=u(S);T.lerp(E,-.06),n.push({geometry:Bt(E,T,o*(1.02-.1*v),o*(1.02-.1*(v+1)),8),color:f(),sway:Ce(0,s,3)})}const y=e.int(4,6),m=e.range(0,Oi);for(let v=0;v<y;v++){const b=u(r*e.range(.6,.95)),S=m+v*2.399963+e.around(0,.4),E=a*e.range(.34,.5),T=new C(b.x+Math.cos(S)*E,b.y+e.range(1,1.8),b.z+Math.sin(S)*E);if(n.push({geometry:Bt(b,T,o*.46,o*.32,6),color:f(),sway:Ce(0,s,2)}),e.chance(.75)){const F=E*e.range(.72,1.02),D=Ue(e,e.range(.34,.58),0,.74,1.26);D.scale(1,e.range(.58,.8),1),D.translate(b.x+Math.cos(S)*F,T.y+e.around(.05,.3),b.z+Math.sin(S)*F),n.push({geometry:D,color:e.chance(.6)?L.LEAF_DARK:I(L.LEAF,e.range(.84,.98)),sway:e.range(.5,.7)})}const M=S+e.around(0,.3),x=a*e.range(.48,.64),A=new C(b.x+Math.cos(M)*x,T.y+(c-T.y)*e.range(.42,.6),b.z+Math.sin(M)*x),P=T.clone().lerp(b,.09);if(n.push({geometry:Bt(P,A,o*.35,o*.22,5),color:f(),sway:Ce(0,s,1.6)}),e.chance(.8)){const F=Ue(e,e.range(.4,.68),0,.75,1.25);F.scale(1,e.range(.62,.84),1),F.translate(A.x+e.around(0,.22),A.y+e.around(.1,.28),A.z+e.around(0,.22)),n.push({geometry:F,color:e.chance(.45)?L.LEAF_DARK:I(L.LEAF,e.range(.88,1.02)),sway:e.range(.68,.84)})}const R=e.int(2,3);for(let F=0;F<R;F++){const D=M+e.around((F-(R-1)/2)*.6,.22),N=a*e.range(.45,.95),H=Math.sqrt(Math.max(0,1-(N/a)**2))*a*.4,G=new C(b.x+Math.cos(D)*N,c+H+e.around(0,.3),b.z+Math.sin(D)*N);n.push({geometry:Bt(A.clone().lerp(P,.1+F*.1),G,o*(.25+F*.015),o*.13,4),color:I(L.BARK_PALE,e.range(.9,1.1)),sway:Ce(0,s,1.2)});const V=Ue(e,e.range(.52,.8),0,.78,1.22);V.scale(1,e.range(.72,.9),1),V.translate(G.x,G.y+e.range(.1,.35),G.z),n.push({geometry:V,color:e.chance(.3)?L.LEAF_DARK:I(L.LEAF,e.range(.92,1.08)),sway:e.range(.82,.95)})}}const p=e.int(15,21);for(let v=0;v<p;v++){const b=e.range(0,Oi),S=a*Math.sqrt(e())*.92,E=Math.sqrt(Math.max(0,1-(S/a)**2)),T=e.range(.55,.92)*(.78+.32*E),M=Ue(e,T,0,.76,1.24);M.rotateY(e.range(0,Oi)),M.scale(1,e.range(.82,1),1),M.translate(Math.cos(b)*S,c+E*a*e.range(.42,.7)+e.around(0,.34)+(e.chance(.2)?e.range(.25,.75):0),Math.sin(b)*S),n.push({geometry:M,color:e.chance(.28)?L.LEAF_DARK:e.chance(.15)&&S>a*.6?L.LEAF_DRY:I(L.LEAF,e.range(.9,1.1)),sway:e.range(.85,1)})}const _=e.int(3,6);for(let v=0;v<_;v++){const b=e.range(0,Oi),S=a*e.range(.6,.95),E=Ue(e,e.range(.42,.7),0,.74,1.26);E.scale(1,e.range(.6,.8),1),E.translate(Math.cos(b)*S,c-e.range(.35,1),Math.sin(b)*S),n.push({geometry:E,color:e.chance(.55)?L.LEAF_DARK:I(L.LEAF,e.range(.86,1)),sway:e.range(.8,.95)})}const w=pt(n);return w.rotateY(e.range(0,Oi)),t!==1&&w.scale(t,t,t),_t(w,"oak",e.range(0,Oi))}},_o=Math.PI*2,ET={name:"small-oak",category:"foliage",radius:1.4,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(2.1,3),o=e.range(.055,.085),r=s*e.range(.28,.38),a=e.range(0,_o),c=e.range(.04,.13),l=p=>{const _=p/s,w=c*_**1.9;return new C(Math.cos(a)*w,p,Math.sin(a)*w)},h=3;for(let p=0;p<h;p++){const _=s*p/h,w=s*(p+1)/h,v=l(_),b=l(w);b.lerp(v,-.07),n.push({geometry:Bt(v,b,o*(1-.22*p),o*(1-.22*(p+1)),6),color:I(L.BARK,e.range(.9,1.12)),sway:Ce(0,s,2.2)})}const u=e.int(5,7),f=e.range(0,_o),d=e.chance(.25)?L.LEAF_DARK:L.LEAF;for(let p=0;p<u;p++){const _=u>1?p/(u-1):0,w=Math.min(s*.95,r+(s-r)*_*e.range(.85,1)),v=l(w),b=f+p*2.399963+e.around(0,.35),S=e.range(.42,.72)*(1.15-.5*_),E=e.range(.35,.8),T=new C(v.x+Math.cos(b)*Math.cos(E)*S,v.y+Math.sin(E)*S,v.z+Math.sin(b)*Math.cos(E)*S);n.push({geometry:Bt(v,T,o*.4,o*.2,4),color:I(L.BARK_PALE,e.range(.88,1.12)),sway:Ce(0,s,1.4)});const M=S>.55?2:1;for(let x=0;x<M;x++){const A=M===1?1:.55+.45*x,P=Ue(e,e.range(.26,.4)*(1.1-.3*_),0,.76,1.24);P.rotateY(e.range(0,_o)),P.scale(1,e.range(.78,.95),1),P.translate(v.x+(T.x-v.x)*A,v.y+(T.y-v.y)*A+e.range(.02,.1),v.z+(T.z-v.z)*A),n.push({geometry:P,color:e.chance(.3)?L.LEAF_DARK:I(d,e.range(.9,1.1)),sway:e.range(.8,.95)})}}const g=l(s),y=Ue(e,e.range(.26,.36),0,.76,1.24);y.scale(1,e.range(.85,1.05),1),y.translate(g.x,g.y+e.range(.02,.12),g.z),n.push({geometry:y,color:I(d,e.range(.94,1.08)),sway:1});const m=pt(n);return m.rotateY(e.range(0,_o)),t!==1&&m.scale(t,t,t),_t(m,"small-oak",e.range(0,_o))}},ki=Math.PI*2,Ml=14144195,TT=3814701,AT=4933181,RT={name:"birch",category:"foliage",radius:2.4,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(6,8.2),o=e.range(.13,.19),r=s*e.range(.5,.6),a=e.range(.14,.38),c=e.range(0,ki),l=e.range(.08,.3),h=T=>{const M=T/s,x=l*M**2.4;return new C(Math.cos(c)*x,T,Math.sin(c)*x)},u=T=>{const M=T/s,x=1+.35*Math.max(0,1-T/.55);return o*(1-.72*M)*x},f=[];{let T=a;for(;T<s-.05;){const x=.8-.3*(T/s);if(e.chance(x)){const A=e(),P=A<.32?e.range(.5,1.2):A<.8?e.range(1.2,2.5):e.range(Math.PI,Math.PI*1.25);f.push({y:T,phi:e.range(0,ki),half:P,tone:e.range(.75,1.4)})}T+=e.chance(.45)?e.range(.03,.09):e.range(.12,.5)}}const d=.026,g=(T,M,x)=>{if(M<a){const R=Math.sin(M*90+T*40)*Math.cos(x*55+M*20);return R>-.15?I(AT,.85+(R+1)*.2):I(Ml,.72)}const A=h(M),P=Math.atan2(x-A.z,T-A.x);for(const R of f){if(Math.abs(M-R.y)>d)continue;let F=Math.abs(P-R.phi)%ki;if(F>Math.PI&&(F=ki-F),F<R.half)return I(TT,R.tone)}return I(Ml,.94+Math.sin(M*31+T*17)*.06)},y=14,m=Math.max(24,Math.round(s/.09)),p=new Y(1,1,s,y,m,!1);p.translate(0,s/2,0);{const T=p.getAttribute("position");for(let M=0;M<T.count;M++){const x=Math.min(s,Math.max(0,T.getY(M))),A=h(x),P=u(x);T.setXYZ(M,T.getX(M)*P+A.x,T.getY(M),T.getZ(M)*P+A.z)}p.deleteAttribute("normal")}n.push({geometry:p,color:g,sway:Ce(0,s,2.4)});const _=e.int(8,11),w=e.range(0,ki),v=e.chance(.3)?L.LEAF_DRY:L.LEAF;for(let T=0;T<_;T++){const M=_>1?T/(_-1):0,x=Math.min(s*.985,r+(s-r)*M*e.range(.88,1)),A=h(x),P=w+T*2.399963+e.around(0,.45),R=(.45+.85*(1-M)**1.2)*e.range(.85,1.12),F=e.range(.85,1.2),D=new C(A.x+Math.cos(P)*Math.cos(F)*R,A.y+Math.sin(F)*R,A.z+Math.sin(P)*Math.cos(F)*R);n.push({geometry:Bt(A,D,o*.26,o*.15,4),color:I(Ml,e.range(.72,.86)),sway:Ce(0,s,1.5)});const N=e.chance(.55)?2:1;for(let H=0;H<N;H++){const G=H===0?0:e.chance(.5)?.8:-.8,V=P+e.around(G,.35),et=e.range(-.85,-.35),lt=R*e.range(.6,.95),bt=new C(D.x+Math.cos(V)*Math.cos(et)*lt,D.y+Math.sin(et)*lt,D.z+Math.sin(V)*Math.cos(et)*lt),Lt=H===0?.1:.2,J=D.clone().lerp(A,Lt);n.push({geometry:Bt(J,bt,o*(H===0?.17:.195),o*.07,4),color:I(L.BARK_PALE,e.range(.9,1.1)),sway:.9});const rt=e.int(1,3);for(let K=0;K<rt;K++){const $=(K+1)/rt,ot=e.range(.18,.3)*(1.15-.4*M),mt=Ue(e,ot,0,.7,1.3);mt.scale(.85,e.range(1.2,1.5),.85),mt.translate(D.x+(bt.x-D.x)*$,D.y+(bt.y-D.y)*$-$*$*e.range(.08,.2),D.z+(bt.z-D.z)*$),n.push({geometry:mt,color:e.chance(.3)?L.LEAF_DARK:I(v,e.range(.92,1.08)),sway:e.range(.9,1)})}}}const b=h(s),S=e.int(2,3);for(let T=0;T<S;T++){const M=Ue(e,e.range(.16,.26),0,.72,1.28);M.scale(.85,e.range(1.15,1.4),.85);const x=w+T*2.399963,A=e.range(.05,.28);M.translate(b.x+Math.cos(x)*A,b.y-e.range(.05,.35),b.z+Math.sin(x)*A),n.push({geometry:M,color:I(v,e.range(.9,1.06)),sway:1})}const E=pt(n);return E.rotateY(e.range(0,ki)),t!==1&&E.scale(t,t,t),_t(E,"birch",e.range(0,ki))}},ia=Math.PI*2,bl=12761506,CT=6050885,PT={name:"small-birch",category:"foliage",radius:1.3,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(2.2,3.05),o=e.range(.032,.05),r=s*e.range(.5,.62),a=e.range(0,ia),c=e.range(.18,.42),l=b=>{const S=b/s,E=c*S**1.7;return new C(Math.cos(a)*E,b,Math.sin(a)*E)},h=b=>o*(1-.4*(b/s));let u=0,f=0,d=!1,g=0;for(;u<s-.05;){let b,S,E=!1;f>0&&!d?(E=!0,f-=1,g+=1,b=e.range(.03,.075),S=I(CT,e.range(.85,1.2))):f>0?(b=e.range(.04,.09),S=I(bl,e.range(.86,.98))):(b=e.chance(.3)?e.range(.3,.5):e.range(.11,.26),S=I(bl,e.range(.92,1.06)),f=g===0&&u>s*.3||u>s*.1&&e.chance(.58)?e.chance(.25)?2:1:0);const T=Math.min(s,u+b),M=l(u),x=l(T),A=Math.max(x.distanceTo(M),1e-6);x.lerp(M,-Math.max(.02,A*.09)/A),n.push({geometry:Bt(M,x,h(u),h(T),5),color:S,sway:Ce(0,s,2)}),d=E,u=T}const y=e.int(3,5),m=e.range(0,ia),p=e.chance(.3)?L.LEAF_DRY:L.LEAF;for(let b=0;b<y;b++){const S=y>1?b/(y-1):0,E=Math.min(s*.97,r+(s-r)*S*e.range(.85,1)),T=l(E),M=m+b*2.399963+e.around(0,.4),x=e.range(.28,.52)*(1.1-.35*S),A=e.range(1,1.3),P=new C(T.x+Math.cos(M)*Math.cos(A)*x,T.y+Math.sin(A)*x,T.z+Math.sin(M)*Math.cos(A)*x);n.push({geometry:Bt(T,P,o*.42,o*.24,4),color:I(bl,e.range(.78,.9)),sway:Ce(0,s,1.3)});const R=M+e.around(0,.3),F=e.range(-.5,-.1),D=x*e.range(.6,.95),N=new C(P.x+Math.cos(R)*Math.cos(F)*D,P.y+Math.sin(F)*D,P.z+Math.sin(R)*Math.cos(F)*D),H=P.clone().lerp(T,.12);n.push({geometry:Bt(H,N,o*.27,o*.12,4),color:I(L.BARK_PALE,e.range(.9,1.1)),sway:.92});const G=e.int(1,2);for(let V=0;V<G;V++){const et=(V+1)/G,lt=Ue(e,e.range(.15,.24),0,.7,1.3);lt.scale(.85,e.range(1.15,1.45),.85),lt.translate(P.x+(N.x-P.x)*et,P.y+(N.y-P.y)*et-et*et*e.range(.03,.09),P.z+(N.z-P.z)*et),n.push({geometry:lt,color:e.chance(.3)?L.LEAF_DARK:I(p,e.range(.92,1.08)),sway:1})}}const _=l(s),w=Ue(e,e.range(.18,.27),0,.72,1.28);w.scale(.9,e.range(1.2,1.5),.9),w.translate(_.x,_.y+.04,_.z),n.push({geometry:w,color:I(p,e.range(.94,1.06)),sway:1});const v=pt(n);return v.rotateY(e.range(0,ia)),t!==1&&v.scale(t,t,t),_t(v,"small-birch",e.range(0,ia))}};function lg(i,t){const{y:e,radius:n,droop:s,slots:o,azimuth:r,thickness:a,gaps:c,floor:l}=t,h=[],u=new C,f=new C,d=new C;for(let g=0;g<o;g++){if(i.chance(c))continue;const y=r+(g+i.around(0,.3))/o*Math.PI*2,m=Math.max(.1,n*i.range(.66,1.16)),p=m*s*i.range(.75,1.25),_=Math.cos(y),w=Math.sin(y),v=a*.8,b=i.range(.4,.6),S=i.range(.26,.4),E=i.around(0,.22),T=Math.max(a*1.4,m*i.range(.17,.23)),M=l+T*S;u.set(_*v,e,w*v),f.set(_*(v+m*b),Math.max(M,e-p*i.range(.14,.3)),w*(v+m*b)),d.set(_*(v+m),Math.max(M,e-p),w*(v+m)),h.push(Ff(u,f,a,T,S,E)),h.push(Ff(f,d,T*.88,Math.max(a*.55,m*.03),S*i.range(.92,1.08),E+i.around(0,.12)))}return h}function Ff(i,t,e,n,s,o){const r=t.x-i.x,a=t.y-i.y,c=t.z-i.z,l=Math.hypot(r,c),h=Math.hypot(l,a),u=new Y(n,e,h,4);return u.translate(0,h/2,0),u.scale(1,1,s),u.rotateY(o),u.rotateX(Math.PI/2+Math.atan2(-a,l)),u.rotateY(Math.PI/2-Math.atan2(c,r)),u.translate(i.x,i.y,i.z),u}const IT={name:"spruce",category:"foliage",radius:2.6,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(6.2,8.8),o=s*e.range(.2,.25),r=e.chance(.3)?I(L.LEAF_DARK,.82):L.LEAF_DARK,a=e.range(.16,.24),c=new Y(a*.16,a,s,6);c.translate(0,s/2,0);const l=Ce(0,s,3);n.push({geometry:c,color:L.BARK,sway:(y,m)=>l(y,m)*.5});const h=e.int(12,16),u=s*e.range(.14,.24),f=s*e.range(.94,.98);let d=e.range(0,Math.PI*2);for(let y=0;y<h;y++){const m=y/(h-1),p=m**.8,_=y===0?e.range(.74,.9):1,w=o*(1-m)**.78*e.range(.83,1.17)*_+.14,v=e.range(.34,.55),b=Math.max(4,Math.min(9,Math.round(4.4+w*1.8))),S=Math.max(u+(f-u)*p,w*(v*1.45+.25)+.15),E=lg(e,{y:S,radius:w,droop:v,slots:b,azimuth:d,thickness:Math.min(.1,Math.max(.035,w*.12)),gaps:e.range(.02,.1),floor:.12}),T=I(r,(.76+m*.34)*e.range(.94,1.06));E.forEach((M,x)=>{n.push({geometry:M,color:T,sway:.06+m*m*.4+x%2*.06})}),d+=Math.PI*2/b*e.range(.32,.7)+e.around(0,.22)}const g=pt(n);return g.rotateY(e.range(0,Math.PI*2)),t!==1&&g.scale(t,t,t),_t(g,"spruce",e.range(0,Math.PI*2))}},LT=12862239,Of=9383704,DT=9340792;function hg(i,t){const e=[],n=t?i.range(1.9,3.1):i.range(4.2,5.8),s=n*i.range(.021,.03),o=n*i.range(.3,.4),r=I(DT,i.range(.9,1.1)),a=i.chance(.35)?L.LEAF_DARK:L.LEAF,c=Ce(0,n,2),l=i.range(0,Math.PI*2),h=i.range(.05,.22),u=m=>{const p=o*h*m**2.2;return new C(Math.cos(l)*p,n*m,Math.sin(l)*p)},f=t?i.range(.42,.55):i.range(.3,.4),d=5;for(let m=0;m<d;m++){const p=f*m/d,_=f*(m+1)/d,w=u(p),v=u(_),b=Math.max(v.distanceTo(w),1e-6);v.lerp(w,-Math.max(.02,b*.1)/b),e.push({geometry:Bt(w,v,s*(1-p*.3),s*(1-_*.3),6),color:I(r,i.range(.92,1.08)),sway:c})}const g=t?i.int(3,4):i.int(5,6),y=i.range(0,Math.PI*2);for(let m=0;m<g;m++){const p=y+m*2.399963+i.around(0,.35),_=u(f*i.range(.62,1)),w=o*i.range(.5,1),v=i.range(.78,.99),b=n*v,S=new C(_.x+Math.cos(p)*w*i.range(.42,.56),_.y+(b-_.y)*i.range(.45,.62),_.z+Math.sin(p)*w*i.range(.42,.56));e.push({geometry:Bt(_,S,s*.55,s*.34,5),color:I(r,i.range(.9,1.06)),sway:c});const E=t?2:i.int(2,3);for(let T=0;T<E;T++){const M=p+i.around((T-(E-1)/2)*.55,.22),x=w*i.range(.62,1),A=Math.min(1,x/Math.max(o,1e-6)),P=new C(_.x+Math.cos(M)*x,S.y+(b-S.y)*Math.sqrt(Math.max(0,1-A*A*.75)),_.z+Math.sin(M)*x),R=S.clone().lerp(_,.1+T*.06);e.push({geometry:Bt(R,P,s*(.3+T*.015),s*.16,4),color:I(r,i.range(.92,1.1)),sway:c});const F=t?2:i.int(2,3);for(let D=0;D<F;D++){const N=i.range(.3,1),H=R.clone().lerp(P,N),G=M+i.around(0,1.1),V=o*i.range(.18,.34),et=new C(H.x+Math.cos(G)*V,H.y+i.range(-.16,.3)*V*2,H.z+Math.sin(G)*V),lt=H.clone().lerp(R,.12);e.push({geometry:Bt(lt,et,s*.24,s*.12,4),color:I(r,i.range(1,1.15)),sway:c});const bt=2;for(let Lt=0;Lt<bt;Lt++){const J=lt.clone().lerp(et,.35+Lt/bt*.65);kf(e,i,J,n,a,G+i.around(0,.8))}if(i.chance(.75)){const Lt=R.clone().lerp(P,i.range(.12,.6));kf(e,i,Lt,n,a,M+i.around(0,1.5))}!t&&N>.55&&i.chance(.38)&&NT(e,i,et,n)}}}return e}function kf(i,t,e,n,s,o){const r=n*t.range(.075,.12),a=t.range(.1,.5),c=new C(Math.cos(o)*Math.cos(a),-Math.sin(a),Math.sin(o)*Math.cos(a)),l=e.clone().addScaledVector(c,r);i.push({geometry:Bt(e,l,n*.004,n*.0025,3),color:I(s,.7),sway:1});const h=2;for(let u=0;u<h;u++){const f=(u+.6)/(h+.4),d=e.clone().lerp(l,f);for(const g of[-1,1]){const y=r*t.range(.3,.46)*(1-f*.25),m=new jt(y*.34,y*1.9,3);m.translate(0,y*.95,0),m.scale(1,1,t.range(.28,.42)),m.rotateZ(g*t.range(1.1,1.45)),m.rotateY(o+t.around(0,.3));const p=g*.012*r;m.translate(d.x+p,d.y+t.around(0,.004),d.z-p),i.push({geometry:m,color:I(s,t.range(.85,1.12)),sway:1})}}}function NT(i,t,e,n){const s=n*t.range(.028,.045),o=s*t.range(.5,1.1),r=t.int(7,10),a=new C(e.x,e.y-o,e.z);i.push({geometry:Bt(e,a.clone().addScaledVector(new C(0,1,0),s*.3),n*.003,n*.002,3),color:I(Of,.7),sway:1});for(let c=0;c<r;c++){const l=c*2.399963,h=s*Math.sqrt((c+.5)/r),u=s*t.range(.2,.29),f=new ee(u,0);f.scale(t.range(.9,1.1),t.range(.85,1.05),t.range(.9,1.1)),f.translate(a.x+Math.cos(l)*h,a.y+(1-(h/s)**2)*s*.3+t.around(0,u*.4),a.z+Math.sin(l)*h),i.push({geometry:f,color:t.chance(.3)?I(Of,t.range(.9,1.1)):I(LT,t.range(.9,1.12)),sway:1})}}const UT={name:"rowan",category:"foliage",radius:1.8,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=pt(hg(e,!1));return n.rotateY(e.range(0,Math.PI*2)),t!==1&&n.scale(t,t,t),_t(n,"rowan",e.range(0,Math.PI*2))}},FT={name:"small-rowan",category:"foliage",radius:.9,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=pt(hg(e,!0));return n.rotateY(e.range(0,Math.PI*2)),t!==1&&n.scale(t,t,t),_t(n,"small-rowan",e.range(0,Math.PI*2))}},OT={name:"small-spruce",category:"foliage",radius:1.1,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(2.1,3.4),o=s*e.range(.19,.24),r=e.chance(.35)?I(L.LEAF_DARK,.86):L.LEAF_DARK,a=e.range(.045,.07),c=new Y(a*.35,a,s,5);c.translate(0,s/2,0);const l=Ce(0,s,2.6);n.push({geometry:c,color:L.BARK,sway:(p,_)=>l(p,_)*.65});const h=s*e.range(.84,.91),u=e.int(6,9),f=e.range(.06,.16);let d=e.range(0,Math.PI*2);for(let p=0;p<u;p++){const _=p/(u-1),w=_**.85,v=o*(1-_*.86)**.85*e.range(.86,1.14)+.07,b=e.range(.24,.42),S=Math.max(4,Math.min(7,Math.round(4.4+v*2.2))),E=Math.max(f+(h-f)*w,v*(b*1.3+.25)+.05),T=lg(e,{y:E,radius:v,droop:b,slots:S,azimuth:d,thickness:Math.min(.06,Math.max(.022,v*.11)),gaps:e.range(.02,.12),floor:.03}),M=I(r,(.8+_*.32)*e.range(.95,1.05));T.forEach((x,A)=>{n.push({geometry:x,color:M,sway:.1+_*_*.5+A%2*.06})}),d+=Math.PI*2/S*e.range(.32,.7)+e.around(0,.22)}const g=(s-h)*e.range(.55,.8),y=new jt(e.range(.05,.085),g,7);y.translate(0,s-g/2-.03,0),n.push({geometry:y,color:I(r,1.15),sway:.6});const m=pt(n);return m.rotateY(e.range(0,Math.PI*2)),t!==1&&m.scale(t,t,t),_t(m,"small-spruce",e.range(0,Math.PI*2))}},kT=2956342,zT=4864606,zf=9125196,Bf=14999234,BT=12893598,HT={name:"elder",category:"foliage",radius:1.15,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(1.08,1.42),o=e.range(.64,.84),r=Ce(0,s,1.3),a=v=>Math.min(1,r(0,v)*1.15),c=e.chance(.6)?L.BARK_PALE:L.BARK,l=e.chance(.45)?L.LEAF:L.LEAF_DARK,h=!e.chance(.12),u=Ue(e,e.range(.13,.19),0,.8,1.18);u.scale(1,e.range(.42,.6),1),u.translate(0,e.range(.02,.05),0),n.push({geometry:u,color:I(c,.85),sway:r});const f=e.int(7,9),d=e.range(0,Math.PI*2);for(let v=0;v<f;v++){const b=d+v/f*Math.PI*2+e.around(0,.3),S=b+Math.PI/2,E=s*(v===0?e.range(.92,1):e.range(.58,1)),T=o*e.range(.8,1),M=T*e.around(0,.26),x=e.range(.022,.034),A=new C(Math.sin(b)*e.range(.02,.06),e.range(.03,.07),Math.cos(b)*e.range(.02,.06)),P=N=>{const H=T*N**1.5,G=M*Math.sin(Math.PI*N);return new C(A.x+Math.sin(b)*H+Math.sin(S)*G,A.y+(E-A.y)*(1-(1-N)**1.6),A.z+Math.cos(b)*H+Math.cos(S)*G)},R=[P(0),P(1/3),P(2/3),P(1)];let F=null;for(let N=0;N<3;N++){const H=F?new C().lerpVectors(R[N],F,e.range(.07,.15)):R[N];n.push({geometry:Bt(H,R[N+1],x*(1-N*.22),x*(1-(N+1)*.22),4),color:I(c,e.range(.92,1.08)),sway:r}),F=R[N]}y(P(e.range(.24,.34)),b),y(P(e.range(.55,.66)),b),y(P(e.range(.86,.95)),b);const D=new C().lerpVectors(R[3],R[2],e.range(.08,.2));h?p(D,b):_(D,b)}const g=e.int(3,4);for(let v=0;v<g;v++){const b=d+e.range(0,Math.PI*2),S=s*e.range(.34,.5),E=e.range(1,1.35),T=new C(Math.sin(b)*e.range(.03,.08),e.range(.02,.05),Math.cos(b)*e.range(.03,.08)),M=new C(T.x+Math.sin(b)*Math.cos(E)*S,T.y+Math.sin(E)*S,T.z+Math.cos(b)*Math.cos(E)*S);n.push({geometry:Bt(T,M,e.range(.012,.017),e.range(.006,.009),4),color:I(c,e.range(1,1.12)),sway:r}),y(M,b)}function y(v,b){const S=s*e.range(.19,.27);for(const E of[-1,1]){const T=b+E*e.range(1,1.45),M=e.range(-.42,.04),x=new C(v.x+Math.sin(T)*Math.cos(M)*S,v.y+Math.sin(M)*S,v.z+Math.cos(T)*Math.cos(M)*S),A=new C().lerpVectors(v,x,e.range(.03,.07));n.push({geometry:Bt(A,x,e.range(.0072,.0092),.0035,3),color:I(l,.78),sway:r});const P=2;for(let R=0;R<P;R++){const F=(R+.85)/(P+1.15),D=S*e.range(.36,.46);for(const N of[-1,1]){const H=new C().lerpVectors(v,x,F+e.around(0,.045));n.push({geometry:m(D*e.range(.94,1.08),T+N*e.range(1.05,1.35),M+e.around(0,.22),H),color:I(l,e.range(.86,1.14)),sway:r})}}n.push({geometry:m(S*e.range(.38,.48),T,M,x),color:I(l,e.range(.86,1.14)),sway:r})}}function m(v,b,S,E){const T=new jt(v*e.range(.28,.36),v,3);return T.translate(0,v*.5,0),T.scale(1,1,e.range(.2,.3)),T.rotateX(Math.PI/2+S),T.rotateY(b),T.translate(E.x,E.y,E.z),T}function p(v,b){const S=s*e.range(.1,.16),E=new C(v.x+Math.sin(b)*S*e.range(.25,.55),v.y-S,v.z+Math.cos(b)*S*e.range(.25,.55));n.push({geometry:Bt(v,E,e.range(.008,.011),e.range(.005,.007),4),color:I(zf,e.range(.9,1.1)),sway:a(E.y)});const T=[E];for(const x of[-1,1]){const A=b+x*e.range(1.6,2.4),P=S*e.range(.38,.62),R=new C().lerpVectors(v,E,e.range(.5,.78)),F=new C(R.x+Math.sin(A)*P,R.y-P*e.range(.35,.75),R.z+Math.cos(A)*P);n.push({geometry:Bt(R,F,e.range(.0032,.0045),.0026,3),color:I(zf,e.range(.85,1.05)),sway:a(F.y)}),T.push(F)}const M=e.int(6,7);for(let x=0;x<M;x++){const A=T[x%T.length],P=x/M*Math.PI*2+e.around(0,.8),R=e.range(.026,.04),F=R*e.range(.5,1.5),D=new C(A.x+Math.sin(P)*F,A.y-e.range(0,R*1.2),A.z+Math.cos(P)*F),N=new Ge(R,0);N.scale(e.range(.85,1.15),e.range(.8,1.05),e.range(.85,1.15)),N.rotateY(e.range(0,Math.PI)),N.rotateX(e.range(0,Math.PI)),N.translate(D.x,D.y,D.z),n.push({geometry:N,color:(H,G)=>G>D.y?zT:kT,sway:a(D.y)})}}function _(v,b){const S=s*e.range(.12,.16),E=new C(v.x+Math.sin(b)*S*e.range(.1,.35),v.y+S*e.range(.18,.38),v.z+Math.cos(b)*S*e.range(.1,.35));n.push({geometry:Bt(v,E,e.range(.009,.012),.007,4),color:I(l,.8),sway:a(E.y)});const T=3;for(let x=0;x<T;x++){const A=x/T*Math.PI*2+e.around(0,.35),P=new C(E.x+Math.sin(A)*S*e.range(.42,.6),E.y+S*e.around(0,.07),E.z+Math.cos(A)*S*e.range(.42,.6)),R=Ue(e,S*e.range(.3,.42),0,.82,1.12);R.scale(1,e.range(.34,.46),1),R.translate(P.x,P.y,P.z),n.push({geometry:R,color:(F,D)=>D>P.y?Bf:BT,sway:a(P.y)})}const M=Ue(e,S*e.range(.34,.44),0,.84,1.1);M.scale(1,e.range(.38,.5),1),M.translate(E.x,E.y+S*e.range(.03,.08),E.z),n.push({geometry:M,color:Bf,sway:a(E.y)})}const w=pt(n);return w.rotateY(e.range(0,Math.PI*2)),t!==1&&w.scale(t,t,t),_t(w,"elder",e.range(0,Math.PI*2))}},GT={name:"hazel",category:"foliage",radius:1.2,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(1.08,1.45),o=e.range(.62,.82),r=Ce(0,s,1.9),a=e.chance(.65)?L.BARK_PALE:L.BARK,c=e.chance(.3)?L.LEAF_DARK:L.LEAF,l=Ue(e,e.range(.14,.2),0,.76,1.2);l.scale(1,e.range(.45,.62),1),l.translate(0,e.range(.02,.05),0),n.push({geometry:l,color:I(L.BARK,.85),sway:r});const h=e.int(7,10),u=e.range(0,Math.PI*2);for(let g=0;g<h;g++){const y=u+g/h*Math.PI*2+e.around(0,.36),m=s*e.range(.74,1),p=o*e.range(.66,1),_=s*e.range(.026,.04),w=new C(Math.sin(y)*e.range(.02,.08),e.range(.01,.05),Math.cos(y)*e.range(.02,.08)),v=new C(w.x+Math.sin(y)*p,m,w.z+Math.cos(y)*p),b=E=>w.clone().lerp(v,E);n.push({geometry:Bt(w,v,_,_*e.range(.38,.5),5),color:I(a,e.range(.9,1.1)),sway:r});const S=e.int(3,5);for(let E=0;E<S;E++){const T=e.range(.16,.95),M=b(T),x=s*e.range(.1,.18),A=e.range(-.3,.95),P=y+e.around(0,1.5),R=new C(M.x+Math.sin(P)*Math.cos(A)*x,M.y+Math.sin(A)*x,M.z+Math.cos(P)*Math.cos(A)*x);n.push({geometry:Bt(M,R,_*.34,_*.19,3),color:I(a,1.12),sway:r}),f(R)}f(v)}function f(g){const y=e.int(2,3);for(let m=0;m<y;m++){const p=s*e.range(.055,.078),_=new ee(p,0);_.scale(1,1,e.range(.12,.19)),_.rotateX(Math.PI/2+e.around(0,.5)),_.rotateY(e.range(0,Math.PI*2));const w=m/y*Math.PI*2+e.around(0,.6),v=p*e.range(.6,1.35);_.translate(g.x+Math.sin(w)*v,g.y+e.around(0,p*.55),g.z+Math.cos(w)*v),n.push({geometry:_,color:I(c,e.range(.85,1.18)),sway:r})}}const d=pt(n);return d.rotateY(e.range(0,Math.PI*2)),t!==1&&d.scale(t,t,t),_t(d,"hazel",e.range(0,Math.PI*2))}},VT=14263323,WT=15254609,XT={name:"gorse",category:"foliage",radius:1.2,solid:!0,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(.98,1.5),o=e.range(.62,.9),r=Ce(0,s,1.6),a=[],c=e.int(5,7);for(let g=0;g<c;g++){const y=g===0,m=g/c*Math.PI*2+e.around(0,.55),p=y?0:o*e.range(.16,.44),_=s*(y?e.range(.9,1):e.range(.58,.9)),w=_*e.range(.44,.6);a.push({at:new C(Math.sin(m)*p,w,Math.cos(m)*p),radius:_-w})}for(const g of a){const y=Ue(e,g.radius,0,.82,1.14);y.scale(1,e.range(.82,1),1),y.translate(g.at.x,g.at.y,g.at.z),n.push({geometry:y,color:I(L.LEAF_DARK,e.range(.82,1.02)),sway:r})}const l=e.int(38,55);for(let g=0;g<l;g++){const y=a[e.int(0,a.length-1)],m=e.range(-.22,1),p=Math.sqrt(Math.max(0,1-m*m)),_=e.range(0,Math.PI*2),w=new C(Math.sin(_)*p,m,Math.cos(_)*p),v=s*e.range(.035,.075),b=y.at.clone().addScaledVector(w,y.radius*e.range(.5,.78)),S=y.at.clone().addScaledVector(w,y.radius+v);S.y<.06||n.push({geometry:Bt(b,S,s*e.range(.005,.0085),0,3),color:I(5598003,e.range(.85,1.2)),sway:r})}const h=e.int(70,100),u=a.map(g=>g.radius*g.radius),f=u.reduce((g,y)=>g+y,0)||1;for(let g=0;g<a.length;g++){const y=a[g],m=Math.max(3,Math.round(h*u[g]/f));for(let p=0;p<m;p++){const _=1-(p+.5)/m*1.06,w=Math.sqrt(Math.max(0,1-_*_)),v=p*2.399963+e.around(0,.55),b=new C(Math.sin(v)*w,Math.min(1,_+e.around(0,.06)),Math.cos(v)*w),S=y.at.clone().addScaledVector(b,y.radius*e.range(.74,.88));if(S.y<s*.14)continue;const E=s*e.range(.05,.078),T=new ee(E,0);T.scale(e.range(.9,1.25),e.range(.6,.88),e.range(.9,1.25)),T.rotateY(e.range(0,Math.PI)),T.rotateX(e.range(0,Math.PI)),T.translate(S.x,S.y,S.z),n.push({geometry:T,color:e.chance(.45)?WT:VT,sway:r})}}const d=pt(n);return d.rotateY(e.range(0,Math.PI*2)),t!==1&&d.scale(t,t,t),_t(d,"gorse",e.range(0,Math.PI*2))}},qT={name:"fallen-log",category:"nature",radius:2.2,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(2.4,4.6),o=e.range(.16,.26),r=o*e.range(.6,.8),a=e.chance(.45)?L.BARK_PALE:L.BARK,c=e.range(0,1),l=5334330,h=o*.86,u=new Y(r,o,s,8);u.rotateZ(Math.PI/2),u.rotateX(e.around(0,.12)),u.translate(0,h,0),n.push({geometry:u,color:(y,m)=>m>h+o*.35&&e.chance(0)===!1&&c>.45?l:a,sway:0});const f=new jt(o*.92,o*1.1,6);f.rotateZ(-Math.PI/2),f.translate(s/2+o*.4,h,0),n.push({geometry:f,color:I(L.TIMBER,.86),sway:0});const d=e.int(2,4);for(let y=0;y<d;y++){const m=e.range(-s*.42,s*.35),p=e.range(.18,.42),_=e.range(.3,Math.PI-.3)*(e.chance(.5)?1:-1),w=new Y(o*.16,o*.26,p,5);w.translate(0,p/2,0),w.rotateX(Math.PI/2-e.range(.4,1.1)),w.rotateY(_),w.translate(m,h+o*.4,0),n.push({geometry:w,color:I(a,.9),sway:0})}if(c>.6){const y=e.int(2,4);for(let m=0;m<y;m++){const p=e.range(-s*.4,s*.4),_=e.chance(.5)?1:-1,w=new Y(e.range(.06,.12),e.range(.03,.06),.025,6);w.rotateZ(_*.5),w.translate(p,h+e.range(0,o*.5),_*o*.85),n.push({geometry:w,color:12430988,sway:0})}}const g=pt(n);return t!==1&&g.scale(t,t,t),_t(g,"fallen-log",0)}},YT={name:"sticks",category:"nature",radius:1,solid:!1,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.int(6,11),o=e.range(.5,.95),r=e.chance(.5)?L.BARK:L.BARK_PALE;for(let c=0;c<s;c++){const l=e.range(.4,1.5),h=e.range(.018,.05),u=e.chance(.1)?e.range(.12,.26):e.range(0,.06),f=e.range(0,Math.PI*2),d=new Y(h*.7,h,l,4);d.rotateZ(Math.PI/2),d.rotateZ(u),d.rotateY(f);const g=e.range(0,.05)+Math.sin(u)*l*.4,y=Math.sqrt(e())*o*(1-g*.5),m=e.range(0,Math.PI*2);d.translate(Math.cos(m)*y,h+g,Math.sin(m)*y),n.push({geometry:d,color:I(r,e.range(.82,1.14)),sway:0})}const a=pt(n);return t!==1&&a.scale(t,t,t),_t(a,"sticks",0)}},$T={name:"bramble",category:"foliage",radius:1.3,solid:!1,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.int(5,8),o=e.range(.85,1.4),r=e.chance(.5)?5917240:7033392,a=e.chance(.5)?L.LEAF_DARK:L.LEAF,c=e.range(0,Math.PI*2);for(let h=0;h<s;h++){const u=c+e.range(-1.5,1.5),f=o*e.range(.65,1.1),d=4,g=f/d,y=e.range(.013,.022);let m=e.range(1,1.35);const p=e.range(0,.09),_=e.range(0,Math.PI*2);let w=Math.cos(_)*p,v=.02,b=Math.sin(_)*p;for(let S=0;S<d;S++){const E=new Y(y*.72,y,g*1.1,4);E.translate(0,g/2,0),E.rotateX(Math.PI/2-m),E.rotateY(u),E.translate(w,v,b);const T=(S/d)**1.4;n.push({geometry:E,color:I(r,e.range(.88,1.1)),sway:T});const M=Math.cos(m)*g,x=w+Math.sin(u)*M,A=v+Math.sin(m)*g,P=b+Math.cos(u)*M;if(A>.05)for(let R=0;R<3;R++){const F=y*e.range(3.6,5.4),D=new jt(F*.55,F*1.5,3);D.translate(0,F*.75,0),D.scale(1,1,.3),D.rotateZ(e.range(.9,1.4)),D.rotateY(R/3*Math.PI*2+e.range(0,.4)),D.translate(x,A,P),n.push({geometry:D,color:I(a,e.range(.85,1.15)),sway:T})}w=x,v=Math.max(.03,A),b=P,m-=e.range(.4,.7)}}const l=pt(n);return t!==1&&l.scale(t,t,t),_t(l,"bramble",e.range(0,Math.PI*2))}},ZT={name:"fern",category:"foliage",radius:.8,solid:!1,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e()**2,o=.3+s*.62,r=Math.max(3,Math.round(4+s*8+e.around(0,1.2))),a=e.chance(.4)?L.LEAF_DARK:L.LEAF;for(let h=0;h<r;h++){const u=h/r*Math.PI*2+e.range(-.22,.22),f=o*e.range(.72,1.15),d=4,g=f/d;let y=e.range(1.1,1.45),m=0,p=e.range(.02,.08),_=0;for(let w=0;w<d;w++){const v=w/d,b=new Y(.006,.009,g*1.1,4);b.translate(0,g/2,0),b.rotateX(Math.PI/2-y),b.rotateY(u),b.translate(m,p,_),n.push({geometry:b,color:I(a,.82),sway:v**1.2});const S=3;for(let T=0;T<S;T++){const M=(T+.5)/S,x=v+M/d,A=f*.2*(1-x*.75);if(A<.012)continue;const P=Math.cos(y)*g*M,R=m+Math.sin(u)*P,F=p+Math.sin(y)*g*M,D=_+Math.cos(u)*P;for(const N of[-1,1]){const H=A*e.range(.88,1.12),G=new jt(H*.3,H,3);G.translate(0,H*.5,0),G.scale(1,1,.22),G.rotateZ(N*e.range(1.2,1.45)),G.rotateY(u+N*e.range(.1,.35)),G.translate(R,F,D),n.push({geometry:G,color:I(a,e.range(.9,1.14)),sway:x**1.2})}}const E=Math.cos(y)*g;m+=Math.sin(u)*E,p+=Math.sin(y)*g,_+=Math.cos(u)*E,y-=e.range(.3,.5)}}const c=new ee(o*.1,0);c.scale(1,1.5,1),c.translate(0,o*.1,0),n.push({geometry:c,color:I(a,.75),sway:.3});const l=pt(n);return l.rotateY(e.range(0,Math.PI*2)),t!==1&&l.scale(t,t,t),_t(l,"fern",e.range(0,Math.PI*2))}},KT={name:"nettle",category:"foliage",radius:.6,solid:!1,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.int(4,8),o=e.range(.26,.42),r=e.chance(.5)?4612154:4019507;for(let c=0;c<s;c++){const l=e.range(0,Math.PI*2),h=Math.sqrt(e())*o,u=Math.cos(l)*h,f=Math.sin(l)*h,d=e.range(.62,1.05)*(1-h/o*.18),g=e.range(0,.09),y=e.range(0,Math.PI*2),m=e.range(.0055,.0095),p=new Y(m*.7,m,d,4);p.translate(0,d/2,0),p.rotateX(Math.cos(y)*g),p.rotateZ(Math.sin(y)*g),p.translate(u,0,f),n.push({geometry:p,color:I(r,.85),sway:(v,b)=>Math.max(0,b/d)**1.4});const _=2+Math.floor(d*2);for(let v=1;v<=_;v++){const b=v/(_+.6)*d,S=d*e.range(.1,.16)*(1-v/_*.72);for(const E of[-1,1]){const T=S*e.range(.9,1.1),M=new jt(T*.5,T*1.7,3);M.translate(0,T*.85,0),M.scale(1,1,.3),M.rotateZ(E*e.range(1.15,1.5)),M.rotateY(v*(Math.PI/2)+e.around(0,.2)),M.translate(u,b,f),n.push({geometry:M,color:I(r,e.range(.92,1.12)),sway:Math.max(0,b/d)**1.4})}}const w=e.int(3,5);for(let v=0;v<w;v++){const b=d*e.range(.022,.04),S=new jt(b*.5,b*1.6,3);S.translate(0,b*.8,0),S.scale(1,1,.3),S.rotateZ(e.range(.25,.6)),S.rotateY(v*2.399963+e.around(0,.4)),S.translate(u,d*(.9+v*.022),f),n.push({geometry:S,color:I(r,e.range(1.1,1.25)),sway:1})}if(e.chance(.6))for(const v of[-1,1]){const b=new Y(e.range(.0035,.0048),e.range(.007,.0092),d*e.range(.14,.19),4);b.translate(0,-d*.08,0),b.rotateZ(v*e.range(.66,.94)),b.translate(u,d*.86,f),n.push({geometry:b,color:11053186,sway:.9})}}const a=pt(n);return a.rotateY(e.range(0,Math.PI*2)),t!==1&&a.scale(t,t,t),_t(a,"nettle",e.range(0,Math.PI*2))}},jT={name:"reeds",category:"foliage",radius:.7,solid:!1,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.int(9,18),o=e.range(.28,.5),r=e.chance(.4)?8223300:6253368,a=e.chance(.5)?4863268:6045994;for(let l=0;l<s;l++){const h=e.range(0,Math.PI*2),u=Math.sqrt(e())*o,f=Math.cos(h)*u,d=Math.sin(h)*u,g=e.range(1.4,2.4)*(1-u/o*.22),y=e.range(0,.14),m=e.range(0,Math.PI*2),p=Math.cos(m)*y,_=Math.sin(m)*y,w=new Y(.008,.013,g,4);w.translate(0,g/2,0),w.rotateX(p),w.rotateZ(_),w.translate(f,0,d),n.push({geometry:w,sway:(M,x)=>Math.max(0,x/g)**1.2,color:I(r,e.range(.88,1.12))}),sa.set(0,g,0).applyAxisAngle(JT,p).applyAxisAngle(QT,_);const v=e.range(.16,.26),b=[],S=new Y(.024,.028,v,6);S.translate(0,-v/2,0),b.push([S,I(a,e.range(.9,1.1))]);const E=new jt(.026,v*.46,6);E.translate(0,v*.17,0),b.push([E,I(a,1.15)]);const T=new Y(.004,.007,v*.5,4);T.translate(0,v*.63,0),b.push([T,I(r,.9)]);for(const[M,x]of b)M.rotateX(p),M.rotateZ(_),M.translate(f+sa.x,sa.y,d+sa.z),n.push({geometry:M,color:x,sway:1});if(e.chance(.5)){const M=g*e.range(.3,.5),x=new jt(.018,M,3);x.translate(0,M/2,0),x.scale(1,1,.28),x.rotateZ(e.range(.25,.6)*(e.chance(.5)?1:-1)),x.rotateY(e.range(0,Math.PI*2)),x.translate(f,g*e.range(.1,.3),d),n.push({geometry:x,color:I(r,.92),sway:.8})}}const c=pt(n);return t!==1&&c.scale(t,t,t),_t(c,"reeds",e.range(0,Math.PI*2))}},JT=new C(1,0,0),QT=new C(0,0,1),sa=new C,tA={name:"moss",category:"foliage",radius:.55,solid:!1,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.chance(.4)?"cushion":e.chance(.5)?"carpet":"fruiting",o=e.chance(.5)?4678447:3495740,r=e.range(.2,.34),a=s==="cushion"?e.int(3,6):e.int(4,8);for(let l=0;l<a;l++){const h=l===0,u=h?e.range(.16,.26):e.range(.08,.18)*(s==="cushion"?1:1.35),f=h?0:Math.sqrt(e())*r,d=e.range(0,Math.PI*2),g=s==="cushion"?e.range(.34,.46):e.range(.13,.2),y=Ue(e,u,1,.86,1.18);y.scale(1,g,1),y.translate(Math.cos(d)*f,u*g*.35,Math.sin(d)*f),n.push({geometry:y,color:I(o,e.range(.86,1.16)),sway:0})}if(s==="fruiting"){const l=e.int(14,26),h=e.chance(.5)?9075274:7167802;for(let u=0;u<l;u++){const f=e.range(0,Math.PI*2),d=Math.sqrt(e())*r*.9,g=Math.cos(f)*d,y=Math.sin(f)*d,m=e.range(.045,.1),p=e.range(0,.3),_=e.range(0,Math.PI*2),w=new Y(.0018,.0028,m,4);w.translate(0,m/2,0),w.rotateX(Math.cos(_)*p),w.rotateZ(Math.sin(_)*p),w.translate(g,.02,y),n.push({geometry:w,color:I(h,.9),sway:.7});const v=new Y(.006,.0045,m*.3,5);v.rotateX(Math.cos(_)*p*1.6),v.rotateZ(Math.sin(_)*p*1.6),v.translate(g+Math.sin(Math.sin(_)*p)*-m,.02+m*Math.cos(p),y+Math.sin(Math.cos(_)*p)*m),n.push({geometry:v,color:I(h,1.2),sway:1})}}const c=pt(n);return t!==1&&c.scale(t,t,t),_t(c,"moss",e.range(0,Math.PI*2))}},eA={name:"pinecone",category:"nature",radius:.4,solid:!1,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.int(3,7),o=e.range(.16,.3);for(let a=0;a<s;a++){const c=e.range(0,Math.PI*2),l=Math.sqrt(e())*o,h=Math.cos(c)*l,u=Math.sin(c)*l,f=e.range(.11,.18),d=f*e.range(.36,.46),g=I(e.chance(.5)?L.BARK:7031340,e.range(.85,1.15)),y=e.range(.9,1.35),m=e.range(0,Math.PI*2),p=S=>{S.rotateX(y),S.rotateY(m),S.translate(h,d*.55,u)},_=new Y(d*.18,d*.5,f*.82,6);p(_),n.push({geometry:_,color:I(g,.8),sway:0});const w=new jt(d*.2,f*.3,6);w.translate(0,f*.55,0),p(w),n.push({geometry:w,color:I(g,.75),sway:0});const v=4,b=5;for(let S=0;S<v;S++){const E=-f*.34+S/(v-1)*f*.66,T=1-Math.abs(S/(v-1)-.35)*.9;for(let M=0;M<b;M++){const x=M/b*Math.PI*2+S*.62,A=new k(d*.42,d*.16,d*.34);A.rotateX(-.5),A.translate(0,0,d*.5*T),A.rotateY(x),A.translate(0,E,0),p(A),n.push({geometry:A,color:I(g,e.range(.95,1.2)),sway:0})}}}const r=pt(n);return t!==1&&r.scale(t,t,t),_t(r,"pinecone",0)}},nA=4874292,iA=6124608,sA=L.LEAF;function oA(i,t,e,{scale:n=1}){const s=[],o=e.int(t.count[0],t.count[1]),r=e.pick(t.petal),a=e.range(0,Math.PI*2);for(let l=0;l<o;l++){const h=e.range(0,Math.PI*2),u=Math.sqrt(e())*t.spread,f=Math.cos(h)*u,d=Math.sin(h)*u,g=1-u/t.spread*e.range(.1,.35),y=e.range(t.height[0],t.height[1])*g,m=e.range(0,.22),p=e.range(0,Math.PI*2),_=Math.cos(p)*m,w=Math.sin(p)*m,v=new Y(t.stemThickness*.7,t.stemThickness,y,4);v.translate(0,y/2,0),v.rotateX(_),v.rotateZ(w),v.translate(f,0,d),s.push({geometry:v,color:e.chance(.4)?iA:nA,sway:(N,H)=>Math.max(0,H/y)**1.4});for(let N=0;N<t.leaves;N++){const H=y*(.2+N/Math.max(1,t.leaves)*.45);ra.set(0,H,0).applyAxisAngle(Sl,_).applyAxisAngle(El,w);for(const G of[-1,1]){const V=y*e.range(.16,.28),et=new jt(V*.3,V,3);et.translate(0,V/2,0),et.scale(1,1,.35),et.rotateZ(G*e.range(1,1.35)),et.rotateY(e.range(0,Math.PI*2)),et.translate(f+ra.x,ra.y,d+ra.z),s.push({geometry:et,color:sA,sway:()=>Math.max(0,H/y)**1.4})}}oa.set(0,y,0).applyAxisAngle(Sl,_).applyAxisAngle(El,w);const b=f+oa.x,S=oa.y,E=d+oa.z,T=1;if(t.head){s.push(...t.head({axis:N=>new C(0,y*N,0).applyAxisAngle(Sl,_).applyAxisAngle(El,w).add(new C(f,0,d)),height:y,rng:e}));continue}const M=e.range(t.headSize[0],t.headSize[1])*g,x=e.chance(t.nod)?e.range(.5,1.1):e.range(0,.18),A=e.range(-Math.PI,Math.PI),P=t.facing===void 0?A:a+A/Math.PI*t.facing,R=N=>{N.rotateX(Math.cos(P)*x),N.rotateZ(Math.sin(P)*x),N.translate(b,S,E)},F=new Y(M,M*.9,M*.5,8);R(F),s.push({geometry:F,color:t.centre,sway:T});const D=M*t.reach;for(let N=0;N<t.petals;N++){const H=N/t.petals*Math.PI*2+e.range(-.12,.12),G=D*e.range(.88,1.12),V=new jt(G*t.petalWidth*e.range(.9,1.1),G,3);V.translate(0,D/2,0),V.scale(1,1,.28),V.rotateX(Math.PI/2-e.range(t.cup[0],t.cup[1])),V.rotateY(H),V.translate(0,M*.12,0),R(V),s.push({geometry:V,color:r,sway:T})}}const c=pt(s);return c.rotateY(e.range(0,Math.PI*2)),n!==1&&c.scale(n,n,n),_t(c,i,e.range(0,Math.PI*2))}function ni(i,t,e){return{name:i,category:"foliage",radius:e,solid:!1,build:(n={})=>oA(i,t,wt(n.seed??1),n)}}const Sl=new C(1,0,0),El=new C(0,0,1),oa=new C,ra=new C,Hf=[{petals:5,reach:2.1,width:.62,cup:[.5,.95],size:[.026,.042],petal:[15255624,14465074,14996042],centre:11045420,nod:.1},{petals:14,reach:2.3,width:.18,cup:[.05,.3],size:[.028,.046],petal:[15789280,15262932,16050360],centre:14202944,nod:.1},{petals:12,reach:1.15,width:.42,cup:[.35,.8],size:[.03,.05],petal:[11576528,10259648,12891356],centre:7298966,nod:.15},{petals:5,reach:1.7,width:.5,cup:[.15,.45],size:[.024,.04],petal:[14183060,13128834,14715560],centre:15786192,nod:.12},{petals:4,reach:2.4,width:.55,cup:[0,.2],size:[.016,.028],petal:[8363992,7048392,10138848],centre:15790304,nod:.05},{petals:8,reach:2.6,width:.24,cup:[.6,1.1],size:[.022,.036],petal:[14717034,13925464,15247488],centre:9194028,nod:.6}];function rA({axis:i,rng:t}){const e=[],n=Hf[t.int(0,Hf.length-1)],s=i(1),o=t.range(n.size[0],n.size[1]),r=t.pick(n.petal),a=t.chance(n.nod)?t.range(.5,1.1):t.range(0,.18),c=t.range(0,Math.PI*2),l=f=>{f.rotateX(Math.cos(c)*a),f.rotateZ(Math.sin(c)*a),f.translate(s.x,s.y,s.z)},h=new Y(o,o*.9,o*.5,8);l(h),e.push({geometry:h,color:n.centre,sway:1});const u=o*n.reach;for(let f=0;f<n.petals;f++){const d=f/n.petals*Math.PI*2+t.range(-.12,.12),g=u*t.range(.88,1.12),y=new jt(g*n.width*t.range(.9,1.1),g,3);y.translate(0,g/2,0),y.scale(1,1,.28),y.rotateX(Math.PI/2-t.range(n.cup[0],n.cup[1])),y.rotateY(d),y.translate(0,o*.12,0),l(y),e.push({geometry:y,color:r,sway:1})}return e}const aA=ni("wildflower",{height:[.14,.62],stemThickness:.0085,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[14209252],centre:14205024,count:[14,26],spread:.6,leaves:1,nod:0,head:rA},.75);function cA({axis:i,height:t,rng:e}){const n=[],s=e.int(4,6),o=e.range(0,Math.PI*2),r=e.range(.5,.62),c=e.chance(.06)?15789800:5926837;for(let l=0;l<s;l++){const h=s===1?0:l/(s-1),u=r+(1-r)*h,f=i(u),d=h*h*t*.3,g=t*.12*(1-h*.3),y=o+e.range(-.22,.22),m=g*.9+d,p=new C(f.x+Math.sin(y)*m,f.y-d*.5,f.z+Math.cos(y)*m);n.push({geometry:Bt(f,p,.0035,.0025),color:6124608,sway:u});const _=new Y(g*.3,g*.62,g*1.4,6);_.translate(0,-g*.7,0),_.rotateZ(e.around(0,.16)),_.translate(p.x,p.y,p.z),n.push({geometry:_,color:c,sway:u})}return n}const lA=ni("bluebell",{height:[.35,.62],stemThickness:.008,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[5926837],centre:5926837,count:[9,16],spread:.5,leaves:0,nod:0,head:cA},.65);function hA({axis:i,height:t,rng:e}){const n=[],s=i(1),o=e.int(6,11),r=t*e.range(.1,.16),a=s.y+r*e.range(.5,.8);for(let c=0;c<o;c++){const l=c/o*Math.PI*2+e.range(-.2,.2),h=r*e.range(.5,1.15),u=new C(s.x+Math.cos(l)*h,a,s.z+Math.sin(l)*h);n.push({geometry:Bt(s,u,.0028,.0018),color:6978116,sway:1});const f=new ee(r*e.range(.16,.26),0);if(f.scale(1,.32,1),f.translate(u.x,u.y,u.z),n.push({geometry:f,color:16250348,sway:1}),e.chance(.55)){const d=new ee(r*.1,0);d.scale(1,.3,1),d.translate(u.x+e.around(0,.008),u.y+.004,u.z+e.around(0,.008)),n.push({geometry:d,color:14210720,sway:1})}}return n}const uA=ni("cowparsley",{height:[.55,1.15],stemThickness:.009,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[16250348],centre:14210720,count:[5,12],spread:.5,leaves:2,nod:0,head:hA},.7),ug=11555727,dg=13070244,dA=9256307,Gf=8211058;function fA({axis:i,height:t,rng:e}){const n=[],s=e.int(11,16),o=e.range(0,Math.PI*2),r=e.range(.4,.5);for(let c=0;c<s;c++){const l=c/(s-1),h=r+(1-r)*l,u=i(h),f=o+e.range(-.38,.38),d=t*.09*(1-l*.55),g=Math.min(1,Math.max(0,1.35-l*1.8)),y={x:Math.sin(f),z:Math.cos(f)},m=d*.12,p=u.x+y.x*m,_=u.z+y.z*m,w=d*(.8+g*.9),v=d*(.2+g*.28),b=.28+g*.42,S=f-Math.PI/2,E=new Y(d*.22,v,w,7);E.translate(0,-w/2,0),E.rotateZ(b),E.rotateY(S),E.translate(p,u.y,_),n.push({geometry:E,color:(M,x)=>x>u.y-w*.45?dg:ug,sway:h});const T=new Y(v*(g>.3?1.22:.4),v*(g>.3?1.05:.15),d*.26,7);T.translate(0,-w-d*.06,0),T.rotateZ(b),T.rotateY(S),T.translate(p,u.y,_),n.push({geometry:T,color:g>.3?dA:Gf,sway:h})}const a=i(1);for(let c=0;c<3;c++){const l=new ee(t*.014*(1-c*.22),0);l.scale(.75,1.5,.75),l.translate(a.x+Math.sin(o)*t*.01,a.y-c*t*.02,a.z+Math.cos(o)*t*.01),n.push({geometry:l,color:Gf,sway:1})}return n}const pA=ni("foxglove",{height:[1,1.8],stemThickness:.014,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[ug],centre:dg,count:[1,4],spread:.3,leaves:2,nod:0,head:fA},.6);function mA({axis:i,height:t,rng:e}){const n=[],s=e.range(.62,.72),o=e.int(4,7),r=e.chance(.5)?8154022:9140920;for(let a=0;a<o;a++){const c=s+(1-s)*(a+.4)/o,l=i(c),h=(c-s)/(1-s),u=t*.028*(1-h**2.6*.42);for(let d=0;d<4;d++){const g=d/4*Math.PI*2+a*.7,y=new ee(u,0);y.scale(.8,1.15,.8),y.translate(l.x+Math.cos(g)*u*.85,l.y,l.z+Math.sin(g)*u*.85),n.push({geometry:y,color:r,sway:c})}const f=new Y(u*.5,u*.6,u*.8,5);f.translate(l.x,l.y-u*.9,l.z),n.push({geometry:f,color:9149051,sway:c})}return n}const gA=ni("lavender",{height:[.5,.95],stemThickness:.007,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[8154022],centre:9149051,count:[16,30],spread:.26,leaves:1,nod:0,head:mA},.5);function yA({axis:i,height:t,rng:e}){const n=[],s=e.int(4,7);for(let d=0;d<s;d++){const g=.1+d/(s-1)*.78,y=i(g),m=t*e.range(.2,.34)*(1-g*.55),p=e.range(0,Math.PI*2)+d*1.9;for(const _ of[-1,1]){const w=m*e.range(.85,1.05),v=new C(y.x+Math.sin(p)*w*_,y.y-w*e.range(.25,.5),y.z+Math.cos(p)*w*_);n.push({geometry:Bt(y,v,.008,.003),color:6781258,sway:g});const b=e.int(3,5);for(let S=0;S<b;S++){const E=(S+.6)/(b+.4),T=new C().lerpVectors(y,v,E),M=m*.3*(1-Math.abs(E-.4)*.9);for(const x of[-1,1]){const A=new jt(M*e.range(.3,.42),M*1.4,3);A.translate(0,M*.7,0),A.scale(1,1,.28),A.rotateZ(x*e.range(1.05,1.4)),A.rotateY(p*_+x*e.range(.2,.5)),A.translate(T.x,T.y,T.z),n.push({geometry:A,color:e.chance(.25)?9149034:6257210,sway:g})}}}}const o=i(1),r=t*e.range(.055,.085),a=new ee(r*.72,1);a.scale(.86,1.25,.86),a.translate(o.x,o.y+r*.85,o.z),n.push({geometry:a,color:6257210,sway:1});const c=9;for(let d=0;d<c;d++){const g=d/c*Math.PI*2+e.around(0,.2),y=r*e.range(.5,.8),m=new jt(r*e.range(.07,.1),y,3);m.translate(0,y*.45,0),m.scale(1,1,.4),m.rotateZ(e.range(1.7,2.1)),m.rotateY(g),m.translate(o.x,o.y+r*1.35,o.z),n.push({geometry:m,color:7046978,sway:1})}const l=18;for(let d=0;d<l;d++){const g=d/l*Math.PI*2+e.around(0,.15),y=e.range(.35,.85),m=r*e.range(.8,1.3),p=new jt(r*e.range(.035,.055),m,3);p.translate(0,m*.42,0),p.scale(1,1,.55),p.rotateZ(Math.PI/2-y*.8),p.rotateY(g),p.translate(o.x,o.y+r*e.range(.55,1),o.z),n.push({geometry:p,color:5335343,sway:1})}const h=e.int(26,38),u=o.y+r*1.5;for(let d=0;d<h;d++){const g=e.range(0,Math.PI*2),y=Math.sqrt(e()),m=y*.95,p=r*e.range(.75,1.15)*(1-y*.2),_=new jt(r*e.range(.035,.055),p,3);_.translate(0,p*.5-p*e.range(.1,.3),0),_.rotateZ(m),_.rotateY(g),_.translate(o.x+Math.sin(g)*r*.22*y,u,o.z+Math.cos(g)*r*.22*y),n.push({geometry:_,color:(w,v)=>v>u+p*.35?14711496:11029654,sway:1})}const f=new ee(r*.34,0);return f.scale(1,.6,1),f.translate(o.x,u,o.z),n.push({geometry:f,color:9322366,sway:1}),n}const vA=ni("thistle",{height:[.42,.9],stemThickness:.012,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[14711496],centre:11029654,count:[1,4],spread:.35,leaves:0,nod:0,head:yA},.55),wA=ni("daisy",{height:[.16,.36],stemThickness:.009,headSize:[.034,.05],petals:12,reach:1.9,petalWidth:.24,cup:[.05,.3],petal:[15921124,15263450,15786726],centre:15254346,count:[14,26],spread:.42,leaves:0,nod:0},.45),_A=ni("poppy",{height:[.42,.75],stemThickness:.011,headSize:[.032,.05],petals:5,reach:2.2,petalWidth:.62,cup:[.55,.95],petal:[12071978,12861484,11021364],centre:2761500,count:[4,9],spread:.5,leaves:1,nod:.25},.55),xA=ni("sunflower",{height:[1.1,1.9],stemThickness:.022,headSize:[.1,.16],petals:16,reach:1.5,petalWidth:.3,cup:[.15,.5],petal:[15250746,14460460,15713106],centre:5981226,count:[3,7],spread:.4,leaves:2,nod:.85,facing:.6},.75),MA="gallery-foliage",bA=[ST,ET,RT,PT,IT,OT,UT,FT,HT,GT,XT,$T,Zm,qT,YT,jT,KT,ZT,Xm,Wm,qm,tA,eA,Ym,$m,pA,vA,xA,uA,gA,_A,lA,wA,aA],fg={id:MA,name:"Countryside Forest Clutter",builders:bA},SA="gallery-animal",EA=[Ns,Qm,tg,eg,ng,ig,rg],pg={id:SA,name:"Countryside Village Life",builders:EA},mg=8,TA=1.4,Gh=dm,Xu=16,Vf=new Ze({color:3813928,flatShading:!0}),AA=new Ze({color:12168594,flatShading:!0}),RA=new Ze({color:2827808,flatShading:!0});function CA(i,t,e){let n=2166136261;for(let h=0;h<i.length;h++)n=Math.imul(n^i.charCodeAt(h),16777619);const s=wt(n>>>0),o=[],r=t*.1,a=t-r*2,c=2+(s.chance(.45)?1:0),l=e/(c+.9);for(let h=0;h<c;h++){const u=e/2-l*(h+.95),f=h===c-1?s.range(.4,.8):s.range(.82,1);let d=-a/2;const g=-a/2+a*f;for(;d<g;){const y=Math.min(s.range(a*.08,a*.26),g-d);if(y<a*.04)break;const m=new ne(new k(y,l*s.range(.3,.42),.008),RA);m.position.set(d+y/2,u,0),o.push(m),d+=y+a*s.range(.045,.09)}}return o}function $o(i,t){const e=new he;e.name=`sign:${i}`;const n=Zn.eyeHeight*.68,s=new ne(new k(.09,n,.09),Vf);s.position.y=n/2,e.add(s);const o=.62,r=.26,a=new he;a.position.set(0,n-.1,.045),a.rotation.x=-.16;const c=new ne(new k(o,r,.05),AA);a.add(c);for(const h of CA(i,o,r))h.position.z+=.026,a.add(h);e.add(a);const l=new ne(new k(.13,.05,.13),Vf);return l.position.y=n+.02,e.add(l),FS(e,t??PA(i))}function PA(i){return i.split("-").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}function gg(i){const t=[];let e=0;for(let n=0;n<i.length;n++){t.push(e);const s=i[n+1];s&&(e+=i[n].radius+s.radius+TA)}return{offsets:t,width:e}}function IA(i){const t=new he;t.name="rows";const{offsets:e,width:n}=gg(i),s=-n/2;for(let o=0;o<i.length;o++){const r=i[o],a=s+e[o],c=new he;c.name=`row:${r.name}`;const l=$o(r.name,r.display);l.position.set(a,0,Gh),c.add(l);for(let h=0;h<mg;h++){const u=r.build({seed:1e3+h*7919});u.position.set(a,0,-h*Gh),c.add(r.solid===!1?u:ge(u))}t.add(c)}return t}function Tl(i){const{width:t}=gg(i),e=Math.max(t,Xu+mg*Gh)+40;return Math.min(200,Math.max(120,Math.ceil(e/20)*20))}function Wf(i){return i*.46}function LA(i){return{zone:i.id,position:new C(0,0,Xu),yaw:Math.PI,material:i.door??"timber",seed:3300+DA(i.id)}}function DA(i){let t=0;for(let e=0;e<i.length;e++)t=(t*31+i.charCodeAt(e))%7919;return t}function NA(i){return{id:i.id,name:i.name,environment:{...nr,fogNear:Wf(Tl(i.builders))*.45,fogFar:Wf(Tl(i.builders)),ambientGround:12563096,surface:"stone",room:"open",soundscape:i.soundscape??Cu},spawn:{position:new C(0,.1,Xu-2),yaw:0},fogVolumes:i.fogVolumes,floor:-20,groundAt:()=>0,build(){const t=new he;t.add(Qa(Tl(i.builders))),t.add(IA(i.builders));for(const e of i.extras?.()??[])t.add(e);return t}}}function fi(i,t){return{id:`portal:${i.id}`,a:t,b:LA(i)}}const Fs=6,Xf=1.3,UA=2.6,FA={A:{w:4,strokes:[[0,0,2,6,4,0],[.7,2,3.3,2]]},B:{w:4,strokes:[[0,0,0,6],[0,6,2.8,6,4,5,4,3.8,2.8,3,0,3],[2.8,3,4,2.2,4,1,2.8,0,0,0]]},C:{w:4,strokes:[[4,5,3,6,1,6,0,5,0,1,1,0,3,0,4,1]]},D:{w:4,strokes:[[0,0,0,6,2.4,6,4,4.4,4,1.6,2.4,0,0,0]]},E:{w:4,strokes:[[4,6,0,6,0,0,4,0],[0,3,2.8,3]]},F:{w:4,strokes:[[4,6,0,6,0,0],[0,3,2.8,3]]},G:{w:4,strokes:[[4,5,3,6,1,6,0,5,0,1,1,0,3,0,4,1,4,2.6,2.2,2.6]]},H:{w:4,strokes:[[0,0,0,6],[4,0,4,6],[0,3,4,3]]},I:{w:2,strokes:[[0,6,2,6],[1,6,1,0],[0,0,2,0]]},J:{w:4,strokes:[[4,6,4,1,3,0,1,0,0,1]]},K:{w:4,strokes:[[0,0,0,6],[4,6,0,2.6],[1.5,3.6,4,0]]},L:{w:4,strokes:[[0,6,0,0,4,0]]},M:{w:4,strokes:[[0,0,0,6,2,2.6,4,6,4,0]]},N:{w:4,strokes:[[0,0,0,6,4,0,4,6]]},O:{w:4,strokes:[[1,0,0,1,0,5,1,6,3,6,4,5,4,1,3,0,1,0]]},P:{w:4,strokes:[[0,0,0,6,2.8,6,4,5,4,3.6,2.8,2.8,0,2.8]]},Q:{w:4,strokes:[[1,0,0,1,0,5,1,6,3,6,4,5,4,1,3,0,1,0],[2.4,1.6,4.4,-.4]]},R:{w:4,strokes:[[0,0,0,6,2.8,6,4,5,4,3.6,2.8,2.8,0,2.8],[2,2.8,4,0]]},S:{w:4,strokes:[[4,5,3,6,1,6,0,5,0,4.2,1,3.4,3,3,4,2.2,4,1,3,0,1,0,0,1]]},T:{w:4,strokes:[[0,6,4,6],[2,6,2,0]]},U:{w:4,strokes:[[0,6,0,1,1,0,3,0,4,1,4,6]]},V:{w:4,strokes:[[0,6,2,0,4,6]]},W:{w:4,strokes:[[0,6,1,0,2,3.4,3,0,4,6]]},X:{w:4,strokes:[[0,0,4,6],[0,6,4,0]]},Y:{w:4,strokes:[[0,6,2,3.2,4,6],[2,3.2,2,0]]},Z:{w:4,strokes:[[0,6,4,6,0,0,4,0]]},0:{w:4,strokes:[[1,0,0,1,0,5,1,6,3,6,4,5,4,1,3,0,1,0],[1,1.2,3,4.8]]},1:{w:4,strokes:[[.8,4.8,2,6,2,0],[.8,0,3.2,0]]},2:{w:4,strokes:[[0,5,1,6,3,6,4,5,4,3.8,0,0,4,0]]},3:{w:4,strokes:[[0,5,1,6,3,6,4,5,4,4,3,3.2,1.6,3.2],[3,3.2,4,2.4,4,1,3,0,1,0,0,1]]},4:{w:4,strokes:[[3,0,3,6,0,2,4,2]]},5:{w:4,strokes:[[4,6,0,6,0,3.4,2.8,3.4,4,2.4,4,1,3,0,1,0,0,1]]},6:{w:4,strokes:[[4,5,3,6,1,6,0,5,0,1,1,0,3,0,4,1,4,2,3,3,0,3]]},7:{w:4,strokes:[[0,6,4,6,1.6,0]]},8:{w:4,strokes:[[1,3.2,.4,4,.4,5,1.4,6,2.6,6,3.6,5,3.6,4,3,3.2,1,3.2],[1,3.2,0,2.4,0,1,1,0,3,0,4,1,4,2.4,3,3.2]]},9:{w:4,strokes:[[0,1,1,0,3,0,4,1,4,5,3,6,1,6,0,5,0,4,1,3,4,3]]},".":{w:1,strokes:[[.5,0]]},",":{w:1,strokes:[[.7,.6,.2,-.9]]},":":{w:1,strokes:[[.5,4],[.5,1]]},";":{w:1,strokes:[[.5,4],[.7,.6,.2,-.9]]},"!":{w:1,strokes:[[.5,6,.5,2],[.5,0]]},"?":{w:4,strokes:[[0,5,1,6,3,6,4,5,4,3.8,2,2.6,2,1.8],[2,0]]},"'":{w:.8,strokes:[[.4,6,.4,4.6]]},'"':{w:1.8,strokes:[[.4,6,.4,4.6],[1.4,6,1.4,4.6]]},"-":{w:2.6,strokes:[[0,2.8,2.6,2.8]]},"+":{w:2.6,strokes:[[0,2.8,2.6,2.8],[1.3,1.5,1.3,4.1]]},"/":{w:3,strokes:[[0,0,3,6]]},"(":{w:1.4,strokes:[[1.4,6.5,0,4.5,0,1.5,1.4,-.5]]},")":{w:1.4,strokes:[[0,6.5,1.4,4.5,1.4,1.5,0,-.5]]},"&":{w:4.4,strokes:[[4.4,0,1,3.6,.6,4.4,.6,5.2,1.4,6,2.2,6,3,5.2,3,4.4,0,1.8,0,1,1,0,2.6,0,4.4,1.8]]}},OA={w:4,strokes:[[0,0,4,0,4,6,0,6,0,0]]};function kA(i,t,e,n){const s=i.toUpperCase().split(`
`),o=t*Fs,r=s.map(h=>{const u=[];for(const d of h)if(d===" ")u.push({glyph:null,advance:UA+n});else{const g=FA[d]??OA;u.push({glyph:g,advance:g.w+n+Xf})}const f=u.reduce((d,g)=>d+g.advance,0)-(u.length?Xf:0);return{glyphs:u,width:Math.max(f,0)}}),a=Math.max(...r.map(h=>h.width),1),c=Fs+(s.length-1)*o,l=[];for(let h=0;h<r.length;h++){const u=c/2-Fs-h*o;let f=e==="center"?-r[h].width/2:-a/2;for(const{glyph:d,advance:g}of r[h].glyphs)d&&l.push({glyph:d,x:f+n/2,y:u}),f+=g}return{placed:l,unitWidth:a,unitHeight:c}}function sc(i,t={}){const{weight:e=.16,slant:n=0,depth:s=.55,lineHeight:o=1.5,align:r="center",fitWidth:a}=t,c=e*Fs,{placed:l,unitWidth:h,unitHeight:u}=kA(i,o,r,c);if(l.length===0)throw new Error("lettering: nothing to draw");let f=(t.capHeight??.15)/Fs;a!==void 0&&(f=Math.min(f,a/h));const d=f*Fs,g=e*d,y=Math.max(s*g,.004),m=[],p=(S,E,T,M)=>{const x=new k(S,g,y);E!==0&&x.rotateZ(E),x.translate(T,M,0),m.push(x)},_=g/2/Math.cos(Math.PI/8),w=new Set,v=(S,E,T=_)=>{const M=`${Math.round(S*8192)},${Math.round(E*8192)}`;if(w.has(M))return;w.add(M);const x=new Y(T,T,y,8,1,!1,Math.PI/8);x.rotateX(Math.PI/2),x.translate(S,E,0),m.push(x)};for(const{glyph:S,x:E,y:T}of l)for(const M of S.strokes){if(M.length===2){v((E+M[0]+n*M[1])*f,(T+M[1])*f,g*.75);continue}for(let x=0;x+3<M.length;x+=2){const A=(E+M[x]+n*M[x+1])*f,P=(T+M[x+1])*f,R=(E+M[x+2]+n*M[x+3])*f,F=(T+M[x+3])*f;v(A,P),v(R,F);const D=Math.hypot(R-A,F-P);D<1e-6||p(D,Math.atan2(F-P,R-A),(A+R)/2,(P+F)/2)}}const b=Qp(m,!1);for(const S of m)S.dispose();if(!b)throw new Error("lettering: merge failed");return{geometry:b,width:h*f,height:u*f,capHeight:d}}function qf(i,t=L.INK,e={}){const{geometry:n}=sc(i,e),s=_t(pt([{geometry:n,color:t,sway:0}]),"lettering",0);return s.userData.noCollide=!0,s}const yg={name:"signboard",category:"structures",radius:1,build({seed:i=1,scale:t=1,text:e="SIGNBOARD"}={}){const n=wt(i),s=[],o=n.range(1.9,2.2),r=n.range(1.3,1.7),a=n.range(.5,.64),c=.05,l=o-.08,h=I(L.TIMBER_DARK,n.range(.9,1.05)),u=b=>{const S=new k(.1,o,.1);S.translate(b,o/2,0),s.push({geometry:S,color:h,sway:0});const E=new k(.15,.05,.15);E.translate(b,o+.02,0),s.push({geometry:E,color:I(h,.9),sway:0})};u(-(r/2+.09)),u(r/2+.09);const f=n.int(3,4),d=a/f,g=l-a/2;for(let b=0;b<f;b++){const S=new k(r,d-.006,c);S.translate(0,l-d*(b+.5),0),s.push({geometry:S,color:I(L.TIMBER_PALE,n.range(.92,1.08)),sway:0})}for(const b of[l+.02,l-a-.02]){const S=new k(r+.34,.07,c*1.5);S.translate(0,b,0),s.push({geometry:S,color:h,sway:0})}const y=pt(s);t!==1&&y.scale(t,t,t);const m=_t(y,"signboard",0),p=e.split(`
`).length,_=sc(e,{capHeight:a*.72/(1+(p-1)*1.5),fitWidth:r*.86,weight:.18,depth:.4});_.geometry.translate(0,g,c/2+.008);const w=pt([{geometry:_.geometry,color:L.INK,sway:0}]);t!==1&&w.scale(t,t,t);const v=_t(w,"signboard",0);return v.userData.noCollide=!0,m.add(v),m}},vg={name:"banner",category:"structures",radius:1.6,build({seed:i=1,scale:t=1,text:e="BANNER"}={}){const n=wt(i),s=[],o=n.range(2.6,3),r=n.range(2.4,2.9),a=r-.22,c=n.range(.6,.78),l=o-.12,h=(w,v)=>{const b=1-Math.min(Math.abs(w)/(a/2),1),S=Math.min(Math.max((l-v)/c,0),1);return b*(.25+.75*S)},u=I(L.TIMBER_DARK,n.range(.88,1.02));for(const w of[-1,1]){const v=new Y(.035,.05,o,8);v.translate(w*(r/2),o/2,0),s.push({geometry:v,color:u,sway:0});const b=new jt(.055,.09,8);b.translate(w*(r/2),o+.04,0),s.push({geometry:b,color:I(u,.9),sway:0})}const f=new Y(.012,.012,r,6);f.rotateZ(Math.PI/2),f.translate(0,l+.01,0),s.push({geometry:f,color:I(L.TIMBER_PALE,.85),sway:0});const d=new k(a,c,.02,10,5,1);d.translate(0,l-c/2,0),s.push({geometry:d,color:I(L.CLOTH,n.range(.94,1.06)),sway:(w,v)=>h(w,v)});const g=pt(s);t!==1&&g.scale(t,t,t);const y=_t(g,"banner",0),m=sc(e,{capHeight:c*.52,fitWidth:a*.86,weight:.22,depth:.5});m.geometry.translate(0,l-c/2,.02);const p=pt([{geometry:m.geometry,color:L.INK,sway:(w,v)=>h(w,v)}]);t!==1&&p.scale(t,t,t);const _=_t(p,"banner",0);return _.userData.noCollide=!0,y.add(_),y}},zA="text-showcase",BA=[yg,vg];function or(i,t){const e=_t(pt(t),"text-station-ink",0);if(e.userData.noCollide=!0,i.length===0)return e;const n=new he;return n.add(_t(pt(i),"text-station",0)),n.add(e),n}function qi(i,t,e,n,s,o=L.INK){const r=sc(i,t);return r.geometry.translate(e,n,s),{geometry:r.geometry,color:o,sway:0}}function qu(i,t,e){const n=[],s=e+.1;for(const r of[-1,1]){const a=new k(.11,s,.11);a.translate(r*(i/2+.1),s/2,-.05),n.push({geometry:a,color:L.TIMBER_DARK,sway:0})}const o=new k(i,t,.05);return o.translate(0,e-t/2,0),n.push({geometry:o,color:L.TIMBER_PALE,sway:0}),n}const Ba=.05/2+.008;function HA(){const i=[[.5,"50"],[.34,"34"],[.24,"24 CM"],[.16,"16 THE FOX"],[.11,"11 QUICK BROWN FOX"],[.075,"7 PACK MY BOX WITH JUGS"],[.05,"5 THE FIVE BOXING WIZARDS JUMP"]],t=2.85,e=[];let n=t-.18;for(const[s,o]of i)n-=s/2,e.push(qi(o,{capHeight:s,fitWidth:2.26,depth:.4},0,n,Ba)),n-=s/2+.12;return or(qu(2.5,2.6,t),e)}function GA(){const i=[[.07,"HAIRLINE"],[.11,"LIGHT"],[.16,"REGULAR"],[.24,"BOLD"],[.34,"BLACK"]],t=[];return i.forEach(([e,n],s)=>{t.push(qi(n,{capHeight:.26,weight:e,depth:.8},0,2.3-s*.42,0))}),or([],t)}function VA(){const i=[[0,"UPRIGHT"],[.12,"OBLIQUE"],[.21,"ITALIC"],[.35,"SWEPT"]],t=[];return i.forEach(([e,n],s)=>{t.push(qi(n,{capHeight:.26,slant:e,depth:.8},0,2.1-s*.42,0))}),or([],t)}function WA(){const t=[qi("PAINTED",{capHeight:.24,fitWidth:1.5,depth:.15},0,1.68,Ba),qi("RAISED",{capHeight:.24,fitWidth:1.5,depth:1},0,1.26,Ba),qi("FREE",{capHeight:.32,weight:.2,depth:2.2},1.75,1.5,0)];return or(qu(1.7,1,2),t)}function XA(){const t=[qi(`ABCDEFGHIJKLM
NOPQRSTUVWXYZ
0123456789
.,:;!?'"()/-+&`,{capHeight:.26,fitWidth:2.26,depth:.4,lineHeight:1.6},0,1.75,Ba)];return or(qu(2.5,1.7,2.6),t)}const wg={id:zA,name:"Text Showcase",builders:BA,extras(){const i=[],t=(l,h,u,f)=>{l.position.set(u,0,f),i.push(l);const d=$o(h);d.position.set(u,0,f+2.5),i.push(d)};t(ge(HA()),"sizes",-10,2),t(GA(),"weights",-10,-8),t(VA(),"slant",-10,-18),t(ge(WA()),"forms",10,2);const e=qf(`FLOATING TEXT
NO BOARD BEHIND IT
READ AGAINST THE FOG`,L.INK,{capHeight:.22,weight:.18,depth:1.2});e.position.y=2.1,t(e,"floating-text",10,-8),t(ge(XA()),"character-set",10,-18);const n=$o("reading-range");n.position.set(20,0,6),i.push(n);const s=[[1,"FIVE METRES"],[-9,"FIFTEEN METRES"],[-19,"TWENTY FIVE METRES"]];for(const[l,h]of s){const u=qf(h,L.INK,{capHeight:.35,depth:.8});u.position.set(20,1.5,l),i.push(u)}const o={seed:4101,text:`ANY TEXT
ON ANY SIGN`},r=yg.build(o);r.position.set(-4.5,0,6),i.push(ge(r));const a={seed:4102,text:"WORDS AT RANGE"},c=vg.build(a);return c.position.set(4.5,0,6),i.push(ge(c)),i}},qA="fog-showcase",YA=new Ze({color:9143671,flatShading:!0}),Yf=-6,$f=-26,Zf=-18;function Qn(i,t,e,n,s,o){const r=new ne(new k(i,t,e),YA);return r.position.set(n,s+t/2,o),r.castShadow=!0,r.receiveShadow=!0,r}function $A(){const i=new he;return i.add(Qn(.9,.35,.9,0,0,0)),i.add(Qn(.62,4.2,.62,0,.35,0)),i.add(Qn(.9,.3,.9,0,4.55,0)),i}function ZA(){const i=new he;return i.add(Qn(14,7,5,-6,0,0)),i.add(Qn(12,5,5,5,0,-1.5)),i.add(Qn(9,3.2,4.5,14,0,.5)),i}function KA(){const i=new he;return i.add(Qn(2.4,.4,2.4,0,0,0)),i.add(Qn(1.5,5.4,1.5,0,.4,0)),i.add(Qn(1.9,.45,1.9,0,5.8,0)),i}const _g={id:qA,name:"Fog Showcase",builders:[],fogVolumes:[{shape:"ellipsoid",center:new C(-9,-1.2,Yf),size:new C(9,3.4,9),density:.55,tint:"#b9c6cc",softness:.75,noiseScale:5,turbulence:.65,drift:new tt(.05,.03)},{shape:"box",center:new C(4,4.5,$f),size:new C(26,5,7),density:.3,tint:"#ccd6e0",softness:.85,noiseScale:14,turbulence:.55},{shape:"ellipsoid",center:new C(12,8.5,Zf),size:new C(2.4,6,2.4),density:.5,tint:"#d8d2c6",softness:.9,noiseScale:3,turbulence:.85}],extras(){const i=[],t=(e,n,s,o)=>{e.position.set(s,0,o),i.push(ge(e));const r=$o(n);r.position.set(s,0,o+3),i.push(r)};return t($A(),"mist-pool",-6,Yf),t(KA(),"plume",12,Zf),t(ZA(),"cloud-bank",4,$f),i}},jA=[...kh.timber,...kh.plank];function JA(i={}){const{seed:t=1,scale:e=1}=i,n=wt(t),s=[],o=n.pick(jA),r=I(o.leaf,n.range(.94,1.06)),a=n.range(.95,1.25),c=n.range(.85,1.1),l=n.range(.08,.11),h=n.range(.09,.12);for(const v of[-1,1]){const b=new k(a+l*2,h,l);b.translate(0,h/2,v*(c/2+l/2)),s.push({geometry:b,color:o.frame,sway:0});const S=new k(l,h,c+l);S.translate(v*(a/2+l/2),h/2,0),s.push({geometry:S,color:o.frame,sway:0})}const u=h-.02,f=.05,d=new k(a,.015,c);d.translate(0,u-f-.01,0),s.push({geometry:d,color:1316378,sway:0});const g=n.int(4,6),y=c/g;for(let v=0;v<g;v++){const b=new k(a*n.range(.985,1),f*n.range(.88,1),y*.94);b.translate(0,u-f/2,-c/2+y*(v+.5)),s.push({geometry:b,color:I(r,n.range(.95,1.05)),sway:0})}const m=n.chance(.5)?-1:1,p=c*n.range(.5,.7);for(const v of[-a*.3,a*.3]){const b=new k(.055,.02,p);b.translate(v,u+.01,m*(c/2-p/2)),s.push({geometry:b,color:o.iron,sway:0});const S=new k(.07,.045,.06);S.translate(v,h-.01,m*(c/2+l/2)),s.push({geometry:S,color:o.iron,sway:0})}const _=-m*c*.34;if(n.chance(.55)){const v=new k(.2,.045,.045);v.translate(0,u+.045,_),s.push({geometry:v,color:o.iron,sway:0});for(const b of[-.09,.09]){const S=new k(.05,.05,.05);S.translate(b,u+.015,_),s.push({geometry:S,color:o.iron,sway:0})}}else{const v=new k(.06,.018,.22);v.translate(0,u+.012,_),s.push({geometry:v,color:o.iron,sway:0});const b=new k(.045,.05,.045);b.translate(0,u+.02,_-m*.13),s.push({geometry:b,color:o.iron,sway:0});const S=new k(.06,.075,.03);S.translate(0,u+.02,_-m*.17),s.push({geometry:S,color:I(o.iron,.8),sway:0})}const w=pt(s);return e!==1&&w.scale(e,e,e),_t(w,"hut-trapdoor",0)}const QA={name:"hut-trapdoor",display:"Wood Trapdoor",category:"structures",radius:.8,build:JA};function t3(i={}){const{seed:t=1,scale:e=1}=i,n=wt(t),s=[],o=n.chance(.35)?n.range(.5,.85):n.range(.08,.3),r=n.range(.95,1.3),a=n.range(.85,1.15),c=n.range(.07,.09),l=n.range(.07,.1),h=I(L.IRON,n.range(.9,1.05)),u=I(L.IRON_DARK,n.range(.9,1.05)),f=T=>tm(L.RUST,T,L.IRON),d=[],g=Kx(d,.13),y=(T,M)=>{const x=Math.max(Math.abs(T)/(r/2),Math.abs(M)/(a/2));return Math.min(o*(.1+.24*x*x)+o*.45*g(T,M),.85)},m=(T,M,x,A)=>{const P=new k(T,l,M);P.translate(x,l/2,A),s.push({geometry:P,color:u,sway:0,wear:o*.35,wearTint:f(u)})};for(const T of[-1,1])m(r+c*2,c,0,T*(a/2+c/2)),m(c,a+c*1.3,T*(r/2+c/2),0);const p=l-.015,_=.035,w=new k(r,_,a,9,1,9);if(w.translate(0,p-_/2,0),s.push({geometry:w,color:h,sway:0,wear:(T,M,x)=>y(T,x),wearTint:f(h)}),n.chance(.6))for(let x=0;x<4;x++)for(let A=0;A<4;A++){const P=-r*.36+r*.72*x/3,R=-a*.36+a*.72*A/3,F=new k(.045,.012,.045);F.translate(P,p+.006,R),s.push({geometry:F,color:I(h,.86),sway:0,wear:o*.3,wearTint:f(I(h,.86))}),d.push([P,R])}else for(const T of[-r*.22,r*.22]){const M=new k(.05,.014,a*.86);M.translate(T,p+.007,0),s.push({geometry:M,color:I(h,.86),sway:0,wear:o*.3,wearTint:f(I(h,.86))}),d.push([T,-a*.4],[T,a*.4])}const v=n.chance(.5)?-1:1;for(const T of[-r*.28,r*.28]){const M=new Y(.024,.024,.14,6);M.rotateZ(Math.PI/2),M.translate(T,p,v*(a/2+c*.35)),s.push({geometry:M,color:I(u,.9),sway:0,wear:o*.3,wearTint:f(I(u,.9))}),d.push([T,v*(a/2-.04)])}const b=-v*a*.32;for(const T of[-.08,.08]){const M=new k(.03,.045,.03);M.translate(T,p+.018,b),s.push({geometry:M,color:I(h,.8),sway:0,wear:o*.25,wearTint:f(I(h,.8))}),d.push([T,b])}const S=new Y(.015,.015,.19,6);S.rotateZ(Math.PI/2),S.translate(0,p+.042,b),s.push({geometry:S,color:I(h,1.12),sway:0});const E=pt(s);return e!==1&&E.scale(e,e,e),_t(E,"factory-trapdoor",0)}const e3={name:"factory-trapdoor",display:"Metal Trapdoor",category:"structures",radius:.8,build:t3},n3=22,i3=12,s3=16767392,Kf=Math.SQRT2,o3={name:"streetlamp",category:"structures",radius:.9,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=[],o=e.range(2.9,3.6),r=e.range(.046,.062),a=e.range(.34,.5),c=e.chance(.35)?L.RUST:L.IRON,l=e.chance(.5)?L.STONE:L.STONE_DARK,h=r*6.2,u=new k(h,.15,h);u.translate(0,.075,0),n.push({geometry:u,color:I(l,e.around(1,.06)),sway:0});const f=new k(r*4.2,.12,r*4.2);f.translate(0,.2,0),n.push({geometry:f,color:I(c,1.05),sway:0});const d=.24,g=e.int(3,4),y=(o-d)/g;for(let ft=0;ft<g;ft++){const st=1-.28*(ft/g),yt=r*2*st,vt=new k(yt,y*1.06,yt);vt.translate(0,d+y*(ft+.5),0),n.push({geometry:vt,color:I(c,e.around(1,.07)),sway:0})}const m=r*2*(1-.28*(g-1)/g),p=m*.78,_=o-p*.62,w=new k(a+p,p,p);w.translate(a/2,_,0),n.push({geometry:w,color:I(c,.94),sway:0});const v=r*.5,b=_-e.range(.36,.5),S=a*.72,E=_-p*.5,T=S-v,M=E-b,x=Math.hypot(T,M)*1.18,A=new k(r*1.05,x,r*1.05);A.translate(0,x*.41,0),A.rotateZ(-Math.atan2(T,M)),A.translate(v,b,0),n.push({geometry:A,color:I(c,.88),sway:0});const P=new k(m*1.9,.07,m*1.9);if(P.translate(0,o-.02,0),n.push({geometry:P,color:I(c,1.1),sway:0}),e.chance(.5)){const ft=new jt(m*.6,.16,4);ft.rotateY(Math.PI/4),ft.translate(0,o+.07,0),n.push({geometry:ft,color:I(c,1),sway:0})}const R=a,F=_-p/2,D=e.range(.05,.1),N=new k(r*.8,D*1.6,r*.8);N.translate(R,F-D*.5,0),n.push({geometry:N,color:I(c,.86),sway:0});const H=e.range(.115,.145),G=e.range(.26,.34),V=F-D,et=.13,lt=new Y(H*.45*Kf,H*1.28*Kf,et,4);lt.rotateY(Math.PI/4),lt.translate(R,V-et/2+.01,0),n.push({geometry:lt,color:I(c,1.02),sway:0});const bt=r*.75;for(const ft of[-1,1])for(const st of[-1,1]){const yt=new k(bt,G*1.1,bt);yt.translate(R+ft*(H-bt*.5),V-et-G/2+.02,st*(H-bt*.5)),n.push({geometry:yt,color:I(c,.9),sway:0})}const Lt=V-et-G,J=r*.9,rt=H*2.2;for(const ft of[0,1])for(const st of[-1,1]){const yt=ft===0,vt=new k(yt?rt:J,.06,yt?J:rt-J*1.8),Gt=rt/2-J/2;vt.translate(R+(yt?0:st*Gt),Lt-.01,yt?st*Gt:0),n.push({geometry:vt,color:I(c,.8),sway:0})}const K=Lt+G*.5,$=new Ge(H*.5,0);$.scale(1,1.6,1),$.translate(R,K,0),s.push({geometry:$,color:L.LAMPLIGHT,sway:0});const ot=pt(n),mt=pt(s),Mt=e.range(0,Math.PI*2);ot.rotateY(Mt),mt.rotateY(Mt),t!==1&&(ot.scale(t,t,t),mt.scale(t,t,t));const Ft=_t(ot,"streetlamp",0);Ft.add(Tn(mt,"streetlamp:glow"));const nt=Math.cos(Mt)*R*t,ht=-Math.sin(Mt)*R*t,B=new ts(s3,n3*e.around(1,.12)*t*t,i3*t,2);return B.position.set(nt,K*t,ht),B.castShadow=!1,Ft.add(B),Ft}},r3={name:"cistern",category:"objects",radius:.75,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(.5,.68),o=e.range(.09,.13),r=s-o,a=e.range(.44,.62),c=e.range(.1,.15),l=I(L.STONE,e.range(.9,1.08)),h=new Y(s*.99,s*1.02,c,10);h.translate(0,c/2,0),n.push({geometry:h,color:I(l,.92),sway:0});const u=[new tt(s,c*.5),new tt(s*.96,a),new tt(r,a),new tt(r*.97,c*.5),new tt(s,c*.5)],f=new ei(u,10);n.push({geometry:f,color:(m,p)=>p>a*.9?I(l,1.18):l,sway:0});const d=c+(a-c)*e.range(.3,.55),g=new Y(r*.97,r*.97,.02,10);if(g.translate(0,d,0),n.push({geometry:g,color:L.WATER,sway:0}),e.chance(.55)){const m=new Y(s*1.28,s*1.34,.07,10);m.translate(0,.03,0),n.push({geometry:m,color:I(L.STONE_DARK,e.range(.94,1.06)),sway:0})}if(e.chance(.45)){const m=e.range(.14,.22),p=a*e.range(.72,.9);for(const w of[-1,1]){const v=new k(.05,.09,m);v.translate(w*.055,p,s*.86+m/2),n.push({geometry:v,color:I(l,.92),sway:0})}const _=new k(.16,.035,m);_.translate(0,p-.05,s*.86+m/2),n.push({geometry:_,color:I(l,.86),sway:0})}const y=pt(n);return y.rotateY(e.range(0,Math.PI*2)),t!==1&&y.scale(t,t,t),_t(y,"cistern",0)}},xg={name:"hopper",category:"structures",radius:1.3,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(.45,1.1),o=s*e.range(.14,.26),r=s*e.range(1.1,1.9),a=s*e.range(.25,.6),c=e.range(1.1,2.6),l=s*.05,h=I(7173499,e.range(.88,1.08)),u=I(L.IRON,e.range(.85,1.05)),f=e.chance(.45),d=c,g=c+r,y=g+a,m=[new tt(o,d),new tt(s,g),new tt(s,y),new tt(s-l,y),new tt(s-l,g),new tt(o-l*.6,d),new tt(o,d)],p=new ei(m,6);n.push({geometry:p,color:f?(M,x)=>x<g?I(L.RUST,.9):h:h,sway:0});const _=new Y(s*1.06,s*1.06,l*2.4,6);_.translate(0,y-l,0),n.push({geometry:_,color:I(u,1.05),sway:0});const w=new Y(o*1.28,o*1.28,c*.45,6);w.translate(0,d-c*.18,0),n.push({geometry:w,color:I(u,.95),sway:0});const v=new k(o*2.4,o*.9,o*.28);v.rotateY(e.range(0,Math.PI)),v.translate(0,d-c*.34,0),n.push({geometry:v,color:I(L.RUST,1.08),sway:0});const b=4,S=s*1.05,E=g+a*.25;for(let M=0;M<b;M++){const x=M/b*Math.PI*2+Math.PI/4,A=new C(Math.sin(x)*S,0,Math.cos(x)*S),P=new C(Math.sin(x)*s*.88,E,Math.cos(x)*s*.88);n.push({geometry:Bt(A,P,.05,.042),color:u,sway:0});const R=new k(.18,.05,.18);R.translate(A.x,.025,A.z),n.push({geometry:R,color:I(u,.84),sway:0})}for(let M=0;M<b;M++){const x=M/b*Math.PI*2+Math.PI/4,A=(M+1)/b*Math.PI*2+Math.PI/4,P=R=>new C(Math.sin(R)*(S+s*.88)*.5,E*.45,Math.cos(R)*(S+s*.88)*.5);n.push({geometry:Bt(P(x),P(A),.032,.03),color:I(u,.88),sway:0})}const T=pt(n);return t!==1&&T.scale(t,t,t),_t(T,"hopper",0)}},Mg={name:"ladder",category:"structures",radius:.4,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(2.4,4.6),o=e.range(.36,.48),r=e.range(.02,.028),a=.3,c=Math.floor(s/a),l=e.chance(.45),h=I(l?L.TIMBER:L.IRON,e.range(.85,1.05)),u=l?I(L.TIMBER_DARK,e.range(.9,1.1)):I(L.IRON,e.range(1,1.15));for(const d of[-1,1]){const g=new k(r*(l?2:1.5),s,r*(l?2.2:3));g.translate(d*o/2,s/2,0),n.push({geometry:g,color:h,sway:0})}for(let d=0;d<c;d++){const g=l?new k(o*1.02,r*1.5,r*1.5):new Y(r*.72,r*.72,o*1.02,6);l||g.rotateZ(Math.PI/2),g.translate(0,a*(d+.6),0),n.push({geometry:g,color:u,sway:0})}const f=pt(n);return t!==1&&f.scale(t,t,t),_t(f,"ladder",0)}},a3={name:"panel",category:"structures",radius:.9,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(1,1.5),o=e.range(.85,1.15),r=e.range(.35,.6),a=e.range(.18,.26),c=I(L.IRON,e.range(.85,1.05)),l=e.chance(.5)?3093304:3814192,h=10124348,u=new k(s*.94,r,a*1.15);u.translate(0,r/2,0),n.push({geometry:u,color:I(c,.8),sway:0});const f=e.range(.1,.2),d=new k(s,o,a*.5);d.rotateX(-f),d.translate(0,r+o/2,a*.16),n.push({geometry:d,color:l,sway:0});for(const[E,T,M]of[[s*1.06,.06,r],[s*1.06,.06,r+o]]){const x=new k(E,T,a*.62);x.rotateX(-f),x.translate(0,M,a*.16+(M>r+.1?-o*f*.5:o*f*.5)),n.push({geometry:x,color:c,sway:0})}const g=e.int(3,5),y=e.int(2,3),m=s*.84/g,p=o*.78/y,_=r+o/2,w=a*.16,v=a*.25,b=(E,T)=>{const M=-s*.42+m*(E+.5),x=o*.4-p*(T+.5)+p*.5;return new C(M,_+x*Math.cos(f)+v*Math.sin(f),w-x*Math.sin(f)+v*Math.cos(f))};for(let E=0;E<y;E++)for(let T=0;T<g;T++){const M=b(T,E),x=E===0,A=e(),P=x?A<.6?"gauge":A<.8?"lamp":"dial":A<.4?"lever":A<.65?"knife":A<.85?"button":"dial";if(P==="gauge"){const R=Math.min(m,p)*.36,F=new Y(R,R,a*.3,10);F.rotateX(Math.PI/2-f),F.translate(M.x,M.y,M.z),n.push({geometry:F,color:h,sway:0});const D=new Y(R*.76,R*.76,a*.34,10);D.rotateX(Math.PI/2-f),D.translate(M.x,M.y,M.z+a*.04),n.push({geometry:D,color:14209726,sway:0});const N=e.range(-1.1,1.1),H=new k(R*.09,R*1.25,a*.12);H.translate(0,R*.5,0),H.rotateZ(N),H.rotateX(-f),H.translate(M.x,M.y,M.z+a*.1),n.push({geometry:H,color:2367260,sway:0})}else if(P==="lamp"){const R=Math.min(m,p)*.18,F=new Y(R*1.5,R*1.5,a*.26,8);F.rotateX(Math.PI/2-f),F.translate(M.x,M.y,M.z),n.push({geometry:F,color:I(c,.9),sway:0});const D=new jt(R*1.15,R*1.5,8);D.rotateX(Math.PI/2-f),D.translate(M.x,M.y,M.z+a*.14),n.push({geometry:D,color:e.chance(.5)?12075052:10135610,sway:0})}else if(P==="dial"){const R=Math.min(m,p)*.22,F=new Y(R,R,a*.4,8);F.rotateX(Math.PI/2-f),F.translate(M.x,M.y,M.z+a*.08),n.push({geometry:F,color:I(c,1.18),sway:0});const D=new k(R*.24,R*1.5,a*.16);D.translate(0,R*.7,0),D.rotateZ(e.range(-2.4,2.4)),D.rotateX(-f),D.translate(M.x,M.y,M.z+a*.22),n.push({geometry:D,color:h,sway:0})}else if(P==="button")for(let R=0;R<3;R++){const F=Math.min(m,p)*.11,D=M.x+(R-1)*m*.26,N=new Y(F,F*1.2,a*.34,8);N.rotateX(Math.PI/2-f),N.translate(D,M.y,M.z+a*.06),n.push({geometry:N,color:R===0?10135610:R===2?12075052:I(c,1.2),sway:0})}else if(P==="knife"){const R=m*.34;for(const N of[-1,1]){const H=new k(R*.34,p*.16,a*.34);H.rotateX(-f),H.translate(M.x+N*R,M.y-p*.12,M.z+a*.06),n.push({geometry:H,color:h,sway:0})}const F=e.chance(.5),D=new k(R*2.2,p*.1,a*.16);D.rotateZ(F?0:e.range(.6,1)),D.rotateX(-f),D.translate(M.x,M.y-p*(F?.12:-.05),M.z+a*.14),n.push({geometry:D,color:I(h,1.15),sway:0})}else{const R=p*e.range(.55,.85),F=e.range(-.9,.9),D=new Y(.013,.018,R,5);D.translate(0,R/2,0),D.rotateZ(F),D.rotateX(-f-.85),D.translate(M.x,M.y-p*.2,M.z+a*.06),n.push({geometry:D,color:I(c,1.15),sway:0});const N=new ee(.03,0);N.translate(M.x+Math.sin(F)*-R,M.y-p*.2+Math.cos(F)*R*.66,M.z+a*.06+R*.7),n.push({geometry:N,color:e.chance(.5)?L.RUST:h,sway:0})}}const S=pt(n);return t!==1&&S.scale(t,t,t),_t(S,"panel",0)}},c3={name:"stair",category:"structures",radius:2.2,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(.17,.2),o=e.range(.23,.27),r=e.int(11,16),a=e.range(.85,1.05),c=s*r,l=o*r,h=I(L.IRON,e.range(.85,1.05)),u=I(L.IRON,e.range(.95,1.15)),f=Math.atan2(c,l),d=Math.hypot(c,l);for(const b of[-1,1]){const S=new k(.06,.28,d+.2);S.rotateX(f),S.translate(b*a/2,c/2-.06,-l/2),n.push({geometry:S,color:h,sway:0})}for(let b=0;b<r;b++){const S=new k(a*.94,.035,o*.72);S.translate(0,s*(b+1),-o*(b+.5)),n.push({geometry:S,color:u,sway:0});const E=new k(a*.94,.05,.03);E.translate(0,s*(b+1)-.012,-o*(b+.5)-o*.36),n.push({geometry:E,color:I(u,.86),sway:0})}const g=e.range(.9,1.3),y=new k(a+.12,.07,g);y.translate(0,c,-l-g/2+.02),n.push({geometry:y,color:I(u,1.06),sway:0});for(const b of[-1,1]){const S=new Y(.045,.05,c,6);S.translate(b*a/2,c/2,-l-g+.12),n.push({geometry:S,color:I(h,.9),sway:0})}const m=e.chance(.5)?1:-1,p=1.05,_=4;for(let b=0;b<=_;b++){const S=b/_,E=new Y(.022,.026,p,6);E.translate(m*a/2,s*r*S+p/2,-l*S),n.push({geometry:E,color:h,sway:0})}const w=new Y(.026,.026,d+.16,6);w.rotateX(Math.PI/2+f),w.translate(m*a/2,c/2+p,-l/2),n.push({geometry:w,color:I(h,1.12),sway:0});const v=pt(n);return t!==1&&v.scale(t,t,t),_t(v,"stair",0)}},Yu={name:"workbench",category:"furniture",radius:1.2,build({seed:i=1,scale:t=1}={}){const e=wt(i),n=[],s=e.range(1.4,2.1),o=e.range(.6,.75),r=e.range(.86,.92),a=e.range(.06,.09),c=I(L.IRON,e.range(.85,1.05)),l=I(L.TIMBER,e.range(.82,1)),h=e.int(3,5);for(let M=0;M<h;M++){const x=new k(s,a,o/h*.97);x.translate(0,r-a/2,-o/2+o/h*(M+.5)),n.push({geometry:x,color:I(l,e.range(.9,1.12)),sway:0})}const u=e.range(.032,.045),f=.1,d=r-a*.4;for(const M of[-1,1])for(const x of[-1,1]){const A=new k(u*2,d,u*2);A.translate(M*(s-f*2)/2,d/2,x*(o-f*2)/2),n.push({geometry:A,color:c,sway:0})}for(const M of[-1,1]){const x=new k(s-f*2,u*1.5,u*1.4);x.translate(0,r*.22,M*(o-f*2)/2),n.push({geometry:x,color:I(c,.86),sway:0})}if(e.chance(.6)){const M=new k(s-f*2.4,.03,o-f*2.4);M.translate(0,r*.26,0),n.push({geometry:M,color:I(l,.8),sway:0})}if(!e.chance(.5)){const M=pt(n);return t!==1&&M.scale(t,t,t),_t(M,"workbench",0)}const g=s*e.range(.2,.34)*(e.chance(.5)?1:-1),y=o/2,m=e.range(.13,.18),p=e.range(.02,.12),_=new k(m*1.1,m*.85,m*1.5);_.translate(g,r+m*.42,y-m*.35),n.push({geometry:_,color:I(c,1.1),sway:0});for(const[M,x]of[[y+p*.5,1],[y-p*.5-m*.28,.95]]){const A=new k(m*1.25*x,m*.7,m*.24);A.translate(g,r+m*.5,M),n.push({geometry:A,color:I(c,1.2),sway:0})}const w=new Y(m*.11,m*.11,m*1.1,6);w.rotateX(Math.PI/2),w.translate(g,r+m*.5,y+m*.55),n.push({geometry:w,color:I(c,1.25),sway:0});const v=e.range(0,Math.PI),b=m*.8,S=new C(g,r+m*.5,y+m*1.02),E=[-1,1].map(M=>new C(S.x+Math.cos(v)*b*M,S.y+Math.sin(v)*b*M,S.z));n.push({geometry:Bt(E[0],E[1],m*.06,m*.06,5),color:I(c,1.1),sway:0});for(const M of E){const x=new ee(m*.085,0);x.translate(M.x,M.y,M.z),n.push({geometry:x,color:I(c,1.2),sway:0})}const T=pt(n);return t!==1&&T.scale(t,t,t),_t(T,"workbench",0)}},l3="gallery-village-interior",h3="gallery-village-exterior",u3="gallery-factory-interior",d3="gallery-factory-exterior",f3=[Na,sg,HS,QA,Km,jm,o3,Jm,r3,Vu,og,ji,bi,za],p3=[Us,Bm,nc,Hm,Bu,Vm,zu,ku,Pu,Yo,Ua,Fa,ic,Gm,ka],bg={id:h3,name:"Countryside Village Exterior Clutter",builders:f3},Sg={id:l3,name:"Countryside Village Interior Clutter",builders:p3},m3=[Oa,Gu,Nu,xg,Du,Hu,Uu,Yu,a3,Iu,c3,Mg,Fu,Jn],g3=[Ou,GS,e3],Eg={id:u3,name:"Industrial Factory Interior Clutter",builders:m3,door:"iron"},Tg={id:d3,name:"Industrial Factory Exterior Clutter",builders:g3,door:"iron"},y3=[fg,pg,Sg,bg,Eg,Tg,wg,_g],$u="sound-stage",Vh=dm*1.5,Zu=14,_a=1.15,Xe={refDistance:2,maxDistance:42,rolloff:1.2,reverb:.4},$s=[{kind:"emitter",name:"wind",spec:{model:"wind",id:"wind",options:{gain:.3},...Xe}},{kind:"emitter",name:"foliage",spec:{model:"foliage",id:"foliage",options:{gain:.4},...Xe}},{kind:"emitter",name:"rain",spec:{model:"rain",id:"rain",options:{gain:.5,intensity:.6,surface:"earth"},...Xe}},{kind:"emitter",name:"water",spec:{model:"water",id:"water",options:{gain:.4},...Xe}},{kind:"scatter",name:"drip",spec:{sound:"drip",id:"drip",every:3.5,spread:[.2,.1,.2],...Xe}},{kind:"emitter",name:"fire",spec:{model:"fire",id:"fire",options:{gain:.5},...Xe}},{kind:"emitter",name:"machine",spec:{model:"machine",id:"machine",options:{gain:.35},...Xe}},{kind:"emitter",name:"friction",spec:{model:"friction",id:"friction",options:{motion:"steady",speed:.28,gain:.4},...Xe}},{kind:"emitter",name:"waveguide",spec:{model:"waveguide",id:"waveguide",options:{excite:"chime",pitch:900,decay:3,bright:.7,drive:.3,gain:.4},...Xe}},{kind:"scatter",name:"hammer",spec:{sound:"hammer",id:"hammer",every:4,spread:[.3,.2,.3],...Xe}},{kind:"scatter",name:"clatter",spec:{sound:"clatter",id:"clatter",every:6,spread:[.5,.2,.5],...Xe}},{kind:"emitter",name:"bird",spec:{model:"bird",id:"bird",options:{gain:.2},...Xe}},{kind:"emitter",name:"crowd",spec:{model:"crowd",id:"crowd",options:{gain:.4},...Xe}},{kind:"scatter",name:"animal",spec:{sound:"animal",id:"animal",every:5,spread:[.4,.2,.4],...Xe}},{kind:"scatter",name:"bell",spec:{sound:"bell",id:"bell",every:11,spread:[.2,.1,.2],...Xe,reverb:1}}],v3=$s.map(i=>i.spec.id);function Wh(i){return[-(($s.length-1)*Vh)/2+i*Vh,_a+.25,0]}const w3={emitters:$s.flatMap((i,t)=>i.kind==="emitter"?[{...i.spec,at:Wh(t)}]:[]),scatter:$s.flatMap((i,t)=>i.kind==="scatter"?[{...i.spec,at:Wh(t)}]:[])},_3=new Ze({color:I(L.STONE,.94),flatShading:!0}),x3=new Ze({color:I(L.STONE_PALE,1.02),flatShading:!0});function M3(i,t){const e=new he;e.name=`station:${i}`;const n=new ne(new k(.8,_a,.8),_3);n.position.set(t,_a/2,0),e.add(ge(n));const s=new ne(new k(1,.09,1),x3);s.position.set(t,_a+.045,0),e.add(ge(s));const o=$o(i);return o.position.set(t,0,1.5),e.add(o),e}function Al(){const i=($s.length-1)*Vh+Zu*2+40;return Math.min(200,Math.max(120,Math.ceil(i/20)*20))}function b3(){return{id:$u,name:"Sound Showcase",environment:{...nr,fogNear:Al()*.2,fogFar:Al()*.46,ambientGround:12563096,surface:"stone",room:"open",soundscape:w3},spawn:{position:new C(0,.1,Zu-2),yaw:0},floor:-20,groundAt:()=>0,build(){const i=new he;return i.add(Qa(Al())),$s.forEach((t,e)=>{i.add(M3(t.name,Wh(e)[0]))}),i}}}function S3(){return{zone:$u,position:new C(0,0,Zu),yaw:Math.PI,material:"iron",seed:6601}}function E3(i){return{id:`portal:${$u}`,a:i,b:S3()}}const xa="industrial-props",Es="countryside-props",Lo="general-props",Xh=.07,qh={width:9,depth:30,height:4.5},Do={width:8,depth:30,height:3.2},Rl=120,Ag=16,T3=[-9,-3,3,9],A3={...Ys,room:"hall",surface:"stone",fogColor:"#0f1316",fogNear:8,fogFar:34,ambientSky:7766414,ambientGround:8682867,ambientIntensity:2.1,sunIntensity:.85,fillIntensity:.8,fillColor:9346736,footstepReverb:.34},R3={...Ys,room:"cell",surface:"wood",fogColor:"#181309",fogNear:8,fogFar:30,ambientSky:10655612,ambientGround:5721148,ambientIntensity:2.3,sunIntensity:1.2,fillIntensity:.8,fillColor:10521706,footstepReverb:.45};function C3(){return[{id:xa,name:"Industrial Props",environment:A3,spawn:{position:new C(0,.1,-30/2+2),yaw:Math.PI},floor:-5,build:()=>ge(new he().add(Mi({...qh,seed:7730,style:ec,planks:!1,beams:0})))},{id:Es,name:"Countryside Props",environment:R3,spawn:{position:new C(0,.1,-30/2+2),yaw:Math.PI},floor:-5,build:()=>ge(new he().add(Mi({...Do,seed:4470,style:ir,planks:!0,beams:7})))},{id:Lo,name:"General Props",environment:{...nr,fogNear:Rl*.46*.45,fogFar:Rl*.46,ambientGround:12563096,surface:"stone",room:"open",soundscape:Cu},spawn:{position:new C(0,.1,Ag-2),yaw:0},floor:-20,groundAt:()=>0,build(){const i=new he;return i.add(Qa(Rl)),i}}]}function xs(i,t,e,n,s){return{zone:i,position:new C(t.width/2-Xh,0,T3[e]),yaw:-Math.PI/2,material:n,seed:s}}function P3(i,t,e){return[{id:"industrial-props-door",a:i,b:{zone:xa,position:new C(0,0,-30/2+Xh),yaw:0,material:"iron",seed:6401}},{id:"countryside-props-door",a:t,b:{zone:Es,position:new C(0,0,-30/2+Xh),yaw:0,material:"timber",seed:6402}},{id:"general-props-door",a:e,b:{zone:Lo,position:new C(0,0,Ag),yaw:Math.PI,material:"timber",seed:6403}},fi(Eg,xs(xa,qh,0,"iron",6411)),fi(Tg,xs(xa,qh,1,"iron",6412)),fi(Sg,xs(Es,Do,0,"timber",6421)),fi(bg,xs(Es,Do,1,"timber",6422)),fi(pg,xs(Es,Do,2,"timber",6423)),fi(fg,xs(Es,Do,3,"timber",6424)),fi(wg,{zone:Lo,position:new C(0,0,0),yaw:0,material:"timber",seed:6431}),fi(_g,{zone:Lo,position:new C(-8,0,0),yaw:0,material:"timber",seed:6432}),E3({zone:Lo,position:new C(8,0,0),yaw:0,material:"iron",seed:6433})]}const Yh="factory-2",Rg="factory-3",$h="hut-room",Cg="hut-room-2",pi=.07,Ts={width:7,depth:22,height:4},xo={width:8.5,depth:8.5,height:9},Zh={width:5.5,depth:6,height:2.5},jf={width:9,depth:5,height:3},Jf={...Ys,room:"hall",surface:"stone",fogColor:"#0f1316",ambientSky:7766414,ambientGround:8682867,ambientIntensity:2.1,sunIntensity:.85,fillIntensity:.8,fillColor:9346736,footstepReverb:.34},Qf={...Ys,room:"cell",surface:"wood",fogColor:"#181309",ambientSky:10655612,ambientGround:5721148,ambientIntensity:2.3,sunIntensity:1.2,fillIntensity:.8,fillColor:10521706,footstepReverb:.45};function I3(){return[{id:Yh,name:"Factory 2",environment:{...Jf,fogNear:7,fogFar:30},spawn:{position:new C(0,.1,-22/2+2),yaw:Math.PI},floor:-5,build:()=>D3()},{id:Rg,name:"Factory 3",environment:{...Jf,fogNear:11,fogFar:42,ambientIntensity:2.4},spawn:{position:new C(0,.1,-8.5/2+2),yaw:Math.PI},floor:-5,build:()=>N3()},{id:$h,name:"Villager Hut Room",environment:{...Qf,fogNear:4,fogFar:20,ambientIntensity:1.9,sunIntensity:.7},spawn:{position:new C(0,.1,1),yaw:Math.PI},floor:-5,build:()=>U3()},{id:Cg,name:"Villager Hut Room 2",environment:{...Qf,fogNear:6,fogFar:26,ambientIntensity:2.6,sunIntensity:1.35},spawn:{position:new C(0,.1,1),yaw:Math.PI},floor:-5,build:()=>F3()}]}function L3(i,t){const e=Ts.depth/2;return[{id:"factory-2-door",a:{zone:i,position:new C(2.2,0,-11/2+pi),yaw:0,material:"iron",seed:9401},b:{zone:Yh,position:new C(0,0,-e+pi),yaw:0,material:"iron",seed:9402}},{id:"factory-3-door",a:{zone:Yh,position:new C(0,0,e-pi),yaw:Math.PI,material:"iron",seed:9403},b:{zone:Rg,position:new C(0,0,-4.25+pi),yaw:0,material:"iron",seed:9404}},{id:"hut-room-door",a:{zone:t,position:new C(10/2-pi,0,2),yaw:-Math.PI/2,material:"timber",seed:8901},b:{zone:$h,position:new C(0,0,-6/2+pi),yaw:0,material:"timber",seed:8902}},{id:"hut-room-2-door",a:{zone:$h,position:new C(Zh.width/2-pi,0,0),yaw:-Math.PI/2,material:"timber",seed:8903},b:{zone:Cg,position:new C(0,0,-5/2+pi),yaw:0,material:"timber",seed:8904}}]}function D3(){const i=new he;i.add(Mi({...Ts,seed:7710,style:ec,planks:!1,beams:0}));const t=Ts.width/2,e=-t+1.5,n=t-1.4;[-7.5,-2.5,2.5,7.5].forEach((r,a)=>{te(i,Oa.build({seed:3410+a}),e,0,r,Math.PI/2)}),[-5,0,5].forEach((r,a)=>{te(i,Fu.build({seed:9410+a}),e+1.6,0,r,Math.PI/2)}),te(i,Nu.build({seed:4410}),n,0,-6.4,Math.PI/2),te(i,xg.build({seed:4411}),n+.2,0,-1.2,-Math.PI/2),te(i,Yu.build({seed:4412}),n,0,3.4,-Math.PI/2),te(i,ji.build({seed:4413}),n+.1,0,6.2,.3),te(i,bi.build({seed:4414}),n-.3,0,7.4,.1),te(i,Iu.build({seed:4415}),t-.55,0,9.4,-Math.PI/2),[-8,-3,2,7].forEach((r,a)=>{const c=Du.build({seed:9420+a});c.position.set(-t+.34,0,r),c.rotation.y=Math.PI/2,i.add(c)});const s=Uu.build({seed:9430});s.position.set(t-.22,1.4,-9.2),s.rotation.y=-Math.PI/2,i.add(s);const o=new Ze({color:I(L.IRON,.9),flatShading:!0});for(let r=0;r<11;r++){const a=-11+(r+.5)/11*Ts.depth,c=new ne(new k(Ts.width,.16,.2),o);c.position.set(0,Ts.height-.12,a),i.add(c)}return te(i,Jn.build({seed:5510}),.9,0,-8,-Math.PI/2),te(i,Jn.build({seed:5511}),.9,0,0,-Math.PI/2),te(i,Jn.build({seed:5512}),.9,0,8,-Math.PI/2),ge(i)}function N3(){const i=new he;i.add(Mi({...xo,seed:7720,style:ec,planks:!1,beams:0}));const t=xo.width/2,e=xo.depth/2;te(i,Hu.build({seed:8120}),0,0,1.2,Math.PI/2),te(i,Mg.build({seed:6210}),-t+.42,0,-2.4,Math.PI/2),te(i,Gu.build({seed:6220}),-t+1.3,0,e-1.4,Math.PI*.25),te(i,Vu.build({seed:6221}),-1.6,0,2.6,.4),te(i,ji.build({seed:6230}),t-.9,0,-1.6,.2),te(i,bi.build({seed:6231}),t-.8,0,.1,.5),te(i,Yu.build({seed:6232}),t-1.2,0,2.4,-Math.PI/2),te(i,Ou.build({seed:6240}),2.2,0,e-.8,0);const n=new Ze({color:I(L.IRON,.86),flatShading:!0});for(const o of[-t+.6,t-.6]){const r=new ne(new k(1.2,.12,xo.depth-.7),n);r.position.set(o,4.2,0),i.add(r);const a=new ne(new k(.08,.9,xo.depth-.7),n);a.position.set(o+(o<0?.55:-.55),4.7,0),i.add(a)}te(i,Jn.build({seed:5520}),1.4,0,-2.8,Math.PI);const s=Jn.build({seed:5521});return s.position.set(t-1.1,4.3,-1.5),s.rotation.y=Math.PI/2,i.add(s),ge(i)}function U3(){const i=new he;i.add(Mi({...Zh,seed:4410,style:ir,planks:!0,beams:2}));const t=Zh.depth/2;te(i,nc.build({seed:4420}),-2.75+.4,0,-1.4,Math.PI/2),te(i,ic.build({seed:4421}),-2.75+.55,0,.6,Math.PI/2);const e=ji.build({seed:4422});return te(i,e,-2.75+.75,0,2.1,.15),te(i,bi.build({seed:4423}),-2.75+.7,0,t-.7,.4),te(i,bi.build({seed:4424}),.3,0,t-.65,.9),te(i,ku.build({seed:4425}),1.6,0,t-.7,.2),te(i,zu.build({seed:4426}),1.5,0,-t+.16,0),te(i,za.build({seed:7110}),-2.75+.8,Pg(e),2.1,.7),ge(i)}function F3(){const i=new he;i.add(Mi({...jf,seed:4430,style:ir,planks:!0,beams:4}));const t=jf.depth/2;te(i,Us.build({seed:4440}),-2.9,0,t-.1,Math.PI),te(i,Us.build({seed:4441}),.1,0,t-.1,Math.PI),te(i,Us.build({seed:4442}),3.1,0,t-.1,Math.PI);const e=Yo.build({seed:4451});return te(i,e,2.2,0,.9,.05),te(i,Ua.build({seed:4452}),2,0,.1,.2),te(i,Fa.build({seed:4453}),3.5,0,.9,-.3),te(i,nc.build({seed:4461}),3.8,0,-t+.6,0),te(i,Bu.build({seed:4450}),-3.4,0,t-1.1,Math.PI*.9),te(i,Pu.build({seed:4460}),-3.2,0,-1.2,Math.PI/2),te(i,ic.build({seed:4462}),-1.9,0,-t+.5,0),te(i,Ns.build({seed:6610}),-2.4,0,.9,Math.PI*.15),te(i,ka.build({seed:7120}),2.35,Pg(e),.7,.4),ge(i)}function Pg(i){return i.geometry.computeBoundingBox(),(i.geometry.boundingBox?.max.y??0)+i.position.y}function te(i,t,e,n,s,o){t.position.set(e,n,s),t.rotation.y=o,i.add(t)}const Ps="exterior",Cl="villager-hut",Pl="factory",Il=new C(5,0,6),aa=0,O3=new C(14,0,6),k3=0,Ll=.07,z3=new C(10,0,6),B3=0,Dl=new C(-10,0,22),H3=5,G3=Math.PI,Nl={width:10,depth:8,height:3.4},Ms={width:15,depth:11,height:5.6},V3=new C(0,1,0),Kh=-5.4,jh=[-2.4,1.1,4.4],Jh=[1.5,.9,1.9],Qh=[-1.8,2.6,2.4],tu=[15/2-.34,1.5,1.6],W3={emitters:[{model:"machine",id:"engine-north",at:[Kh+1,1.1,jh[0]],options:{rpm:74,fundamental:52,gain:.15,wear:.55,clank:.45},refDistance:1.4,maxDistance:22,rolloff:1.7,reverb:.3},{model:"machine",id:"engine-south",at:[Kh+1,1.1,jh[2]],options:{rpm:46,fundamental:35,gain:.16,wear:.8,clank:.7},refDistance:1.4,maxDistance:22,rolloff:1.7,reverb:.35},{model:"friction",id:"gantry",at:Qh,options:{motion:"cycle",speed:.26,force:.8,pitch:210,decay:1.4,bright:.4,roughness:.22,gain:.18},refDistance:1.6,maxDistance:22,rolloff:1.5,reverb:.8,importance:1.5},{model:"waveguide",id:"pipe-air",at:tu,options:{excite:"breath",closed:!0,pitch:190,decay:.9,bright:.28,drive:.55,gain:.3},refDistance:1.2,maxDistance:9,rolloff:1.8,reverb:.4}],scatter:[{sound:"clatter",id:"fitting",at:Jh,spread:[1.1,.4,1.1],every:17,force:[.3,.85],options:{material:"metal",gain:.2,pieces:3},refDistance:1.8,maxDistance:22,rolloff:1.3,reverb:.85}]};function Ul(i,t){return{zone:Ps,position:new C(Dl.x+i*H3,Dl.y,Dl.z),yaw:G3,material:t,seed:5200+i*17}}function X3(i){const t=Na.build({seed:5511});t.position.copy(Il),t.rotation.y=aa;const e=lE(t),n=new C(e.x,0,e.z+Ll).applyAxisAngle(V3,aa).add(Il),s=[{id:Ps,name:"Outside",environment:{...nr,ambientGround:12563096},spawn:{position:JM.clone(),yaw:0},floor:-20,build(){const r=i.populate(),a=Na.build({seed:5511});return a.position.copy(Il),a.rotation.y=aa,r.add(ge(a)),r}},{id:Cl,name:"Countryside Village Interior Demo",environment:{...Ys,room:"cell",surface:"wood",fogColor:"#181309",fogNear:9,fogFar:34,ambientSky:10655612,ambientGround:5721148,ambientIntensity:2.3,sunIntensity:1.2,fillIntensity:.8,fillColor:10521706,footstepReverb:.45},spawn:{position:new C(0,.1,1),yaw:Math.PI},floor:-5,build:()=>q3()},{id:Pl,name:"Industrial Factory Interior Demo",environment:{...Ys,room:"hall",surface:"stone",fogColor:"#111519",fogNear:12,fogFar:48,ambientSky:8161172,ambientGround:9077624,ambientIntensity:2.2,sunIntensity:.9,fillIntensity:.85,fillColor:9675701,footstepReverb:.34,soundscape:W3},spawn:{position:new C(0,.1,2),yaw:Math.PI},floor:-5,build:()=>Y3()},xT(),...I3()],o=[{id:"hut-door",a:{zone:Ps,position:n,yaw:aa,material:"timber",seed:8801},b:{zone:Cl,position:new C(0,0,-8/2+Ll),yaw:0,material:"timber",seed:8802}},{id:"factory-door",a:{zone:Ps,position:O3,yaw:k3,material:"iron",seed:9301},b:{zone:Pl,position:new C(0,0,-11/2+Ll),yaw:0,material:"iron",seed:9302}},{id:"village-gate",a:{zone:Ps,position:z3,yaw:B3,material:"timber",seed:4712},b:{zone:Wu,position:Xi.clone().setY(wT.heightAt(Xi.x,Xi.z)),yaw:Math.PI,material:"timber",seed:4713}},...L3(Pl,Cl)];for(const r of y3)s.push(NA(r));return s.push(...C3()),o.push(...P3(Ul(1,"iron"),Ul(0,"timber"),Ul(2,"timber"))),s.push(b3()),{zones:s,portals:o}}function q3(){const i=new he;i.add(Mi({...Nl,seed:4400,style:ir,planks:!0,beams:3}));const t=Nl.width/2,e=Nl.depth/2;se(i,Bm.build({seed:8801}),-t+.12,0,.4,Math.PI/2),se(i,Us.build({seed:8810}),-2.6,0,e-.1,Math.PI),se(i,Us.build({seed:8811}),2.4,0,e-.1,Math.PI),se(i,Hm.build({seed:8820}),t-.35,0,-1.6,-Math.PI/2),se(i,Pu.build({seed:3120}),-t+.95,0,-2.5,0);const n=ic.build({seed:8830});se(i,n,-t+1,0,-1,.06);const s=Yo.build({seed:2077});se(i,s,.6,0,.9,.08),se(i,Ua.build({seed:411}),-.5,0,1.5,Math.PI*.4),se(i,Ua.build({seed:412}),.9,0,-.4,.1),se(i,Fa.build({seed:413}),1.7,0,.4,.4),se(i,Fa.build({seed:415}),-t+1.6,0,.2,-.5),se(i,Bu.build({seed:8840}),-2.9,0,e-2.2,Math.PI*.85);const o=Yo.build({seed:2078});se(i,o,-.2,0,e-.8,Math.PI),se(i,nc.build({seed:8850}),2.6,0,-e+.35,0),se(i,ku.build({seed:8860}),-t+.75,0,3.3,.4),se(i,zu.build({seed:8870}),-t+.16,0,2.4,Math.PI/2),se(i,Vm.build({seed:8880}),-1.5,0,-e+.14,0),se(i,Gm.build({seed:8890}),-2.3,0,-e+.45,.25),se(i,Ns.build({seed:6602}),.4,0,2.1,Math.PI*.9);const r=ji.build({seed:61});return se(i,r,t-.9,0,-e+1,.4),se(i,bi.build({seed:67}),t-.7,0,-.2,.2),se(i,ka.build({seed:7101}),.75,ca(s),.65,.6),se(i,ka.build({seed:7102}),-.35,ca(o),e-.85,-.4),se(i,za.build({seed:7103}),t-.95,ca(r),-e+1,.9),se(i,za.build({seed:7104}),-t+1.05,ca(n),-1.05,-.5),ge(i)}function Y3(){const i=new he;i.add(Mi({...Ms,seed:7700,style:ec,planks:!1,beams:0}));const t=Ms.width/2,e=Ms.depth/2,n=Kh;jh.forEach((l,h)=>{se(i,Oa.build({seed:3301+h}),n,0,l,Math.PI/2)}),se(i,Nu.build({seed:4401}),5.1,0,2.1,Math.PI/2),se(i,Oa.build({seed:3304}),Jh[0],0,Jh[2],-.35);const s=[[-3.6,-e+.34,0],[3.6,-e+.34,0],[tu[0],tu[2],Math.PI/2],[t-.34,-2.4,Math.PI/2]];for(let l=0;l<s.length;l++){const[h,u,f]=s[l],d=Du.build({seed:9101+l});d.position.set(h,0,u),d.rotation.y=f,i.add(d)}const o=Uu.build({seed:9201});o.position.set(t-.22,1.4,-1.4),o.rotation.y=-Math.PI/2,i.add(o);const r=new Ze({color:I(L.IRON,.92),flatShading:!0}),a=Ms.height-.12,c=.42;for(const l of[-4.2,-1.4,1.4,4.2]){const h=new he;for(const[d,g]of[[a,.13],[a-c,.1]]){const y=new ne(new k(Ms.width,g,g*1.25),r);y.position.set(0,d,0),h.add(y)}const u=9,f=Ms.width/u;for(let d=0;d<u;d++){const g=new ne(new k(.07,Math.hypot(f,c),.09),r);g.position.set(-15/2+f*(d+.5),a-c/2,0),g.rotation.z=(d%2===0?1:-1)*Math.atan2(f,c),h.add(g)}h.position.z=l,i.add(h)}return se(i,Fu.build({seed:9301}),n+1.9,0,1,Math.PI/2),se(i,Ou.build({seed:9302}),2.4,0,e-.7,0),se(i,Iu.build({seed:9401}),t-.55,0,-e+1.5,-Math.PI/2),se(i,Hu.build({seed:8110}),Qh[0],0,Qh[2],Math.PI/2),se(i,Jn.build({seed:5501}),-.6,0,-2.4,-Math.PI/2),se(i,Jn.build({seed:5502}),-.6,0,4.4,-Math.PI/2),se(i,Jn.build({seed:5503}),1.2,0,-.6,Math.PI/2),ge(i)}function ca(i){return i.geometry.computeBoundingBox(),(i.geometry.boundingBox?.max.y??0)+i.position.y}function se(i,t,e,n,s,o){t.position.set(e,n,s),t.rotation.y=o,i.add(t)}const la=[0,125,250,500,1e3,2e3,5e3,1e4];function $3(i){let t=0,e=0,n=0;for(let o=0;o<i.length;o++){const r=i[o],a=Math.abs(r);a>t&&(t=a),e+=r,n+=r*r}const s=Math.sqrt(n/Math.max(i.length,1));return{peak:t,rms:s,dc:e/Math.max(i.length,1),crest:s>1e-9?20*Math.log10(t/s):0}}function Z3(i,t){const e=Math.min(i.length,16384),n=12,s=l=>{let h=0,u=0;const f=2*Math.PI*l/t;for(let d=0;d<e;d++){const g=f*d;h+=i[d]*Math.cos(g),u+=i[d]*Math.sin(g)}return(h*h+u*u)/e},o=[];let r=0,a=0;for(let l=0;l<la.length;l++){const h=Math.max(la[l],20),u=l+1<la.length?la[l+1]:Math.min(t/2,2e4);let f=0;for(let d=0;d<n;d++){const g=h*Math.pow(u/h,(d+.5)/n),y=s(g);f+=y,r+=y*g,a+=y}o.push(f)}const c=o.reduce((l,h)=>l+h,0);return{bands:c>0?o.map(l=>l/c):o.map(()=>0),centroid:a>0?r/a:0}}function K3(i,t){if(t<=1e-9)return-1/0;const e=[.15,.4,.7,.95,1.1,1.15,.9,.5];let n=0;for(let s=0;s<i.length;s++)n+=i[s]*(e[s]??.5);return 20*Math.log10(t)+10*Math.log10(Math.max(n,1e-6))}function j3(i,t){const e=$3(i),{bands:n,centroid:s}=Z3(i,t);return{...e,bands:n,centroid:s,loudness:K3(n,e.rms)}}function J3(i,t){let e=0;for(let a=0;a<i.length;a++)e+=i[a];e/=Math.max(i.length,1);let n=0;for(let a=0;a<i.length;a++)n+=(i[a]-e)**2;if(n/=Math.max(i.length,1),n<1e-12)return 0;const s=a=>{if(a>=i.length)return 0;let c=0;for(let l=0;l+a<i.length;l++)c+=(i[l]-e)*(i[l+a]-e);return Math.abs(c/((i.length-a)*n))},o=t.map(s),r=o.findIndex(a=>a<.2);return r===-1?1:Math.max(0,...o.slice(r))}const Mo=1024,Q3=6,tp=new C;function t5(i,t){const e={context:i,settings:{...Tu},weather:new ym,noise:gm(i),dry:i.createGain(),send:i.createGain(),register:()=>{},unregister:()=>{}};return e.dry.connect(t),e.send.connect(t),e}async function e5(i,t=48e3){const e=i.seconds??Q3,n=Math.ceil(e*t/Mo)*Mo,s=new OfflineAudioContext(1,n,t),o=t5(s,s.destination),r=i.build(o);r.output.connect(s.destination),i.ready&&await i.ready(r);const a=Mo/t,c=Math.floor(n/Mo);for(let h=1;h<c;h++)s.suspend(h*Mo/t).then(()=>{o.weather.update(a),r.update?.(a,o,tp),s.resume()});return o.weather.update(a),r.update?.(a,o,tp),{signal:(await s.startRendering()).getChannelData(0),model:r,rate:t}}const n5={peak:.95,dc:.01,periodicity:.35,crest:{_comment:["Peak over average, in dB, and it means opposite things for the two","kinds of source — which is why there are two bands rather than one.","A continuous texture with a very high crest is bubble wrap: audible","individual grains. An impulsive source with a *low* one has lost its","transient and turned into a wash. Bounds are drawn wide around the","first captured run rather than derived; the drift check below is the","sharp instrument, and these only catch a model that has fallen over."],texture:[4,26],event:[12,36]}},i5={loudness:1.5,crest:2.5,centroid:.5},s5={wind:{loudness:-46.69,crest:23.33,centroid:121,bands:[.6522,.2851,.0387,.012,.0116,5e-4,0,0]},foliage:{loudness:-41.22,crest:15.96,centroid:1230,bands:[.0262,.0512,.1118,.3525,.2948,.1401,.0225,9e-4]},rain:{loudness:-37.53,crest:14.73,centroid:1062,bands:[.0363,.1044,.1761,.253,.3241,.0975,.0082,4e-4]},water:{loudness:-38.89,crest:15.12,centroid:741,bands:[.1976,.1233,.1289,.2884,.2154,.0417,.0047,1e-4]},fire:{loudness:-32.04,crest:13.58,centroid:558,bands:[.2647,.5285,.0244,.0299,.0722,.0644,.0114,.0046]},machine:{loudness:-26.53,crest:11.53,centroid:69,bands:[.8421,.141,.0164,5e-4,0,0,0,0]},friction:{loudness:-30.89,crest:6.46,centroid:200,bands:[.3474,.5838,.0541,.0094,.0042,.0011,0,0]},waveguide:{loudness:-33.2,crest:27.71,centroid:857,bands:[3e-4,9e-4,.5233,.2708,.1788,.0165,.0049,.0044]},bird:{loudness:-29.91,crest:16.97,centroid:2340,bands:[2e-4,2e-4,2e-4,3e-4,6e-4,.9979,6e-4,0]},crowd:{loudness:-37.17,crest:17.34,centroid:566,bands:[.0078,.0791,.1582,.7432,.0115,2e-4,0,0]},hammer:{loudness:-37.04,crest:26.58,centroid:144,bands:[.1803,.8117,.0051,1e-4,.0022,5e-4,0,0]},clatter:{loudness:-50.07,crest:26.39,centroid:109,bands:[.806,.1784,.0094,.0051,9e-4,1e-4,0,0]},animal:{loudness:-36.57,crest:22.36,centroid:776,bands:[0,4e-4,.1835,.7314,.0769,.0076,1e-4,0]},drip:{loudness:-44.1,crest:30.46,centroid:600,bands:[.171,.1695,.1649,.1835,.3106,5e-4,1e-4,0]},bell:{loudness:-33.5,crest:19.34,centroid:130,bands:[.6331,.3079,.056,.0028,2e-4,0,0,0]}},o5={rules:n5,drift:i5,models:s5},Ha=o5;function bo(i,t,e,n=8){return{name:i,kind:"event",seconds:n,build(s){const o=Nm(s,t);let r=0;return{output:o.output,update(a){r-=a,!(r>0)&&(r=e,o.fire(s.context.currentTime+.05,.45+Math.random()*.55))},dispose:()=>o.dispose()}}}}const r5=[{name:"wind",seconds:12,build:i=>xm(i)},{name:"foliage",seconds:12,build:i=>bm(i)},{name:"rain",seconds:8,build:i=>Rm(i,{intensity:.6})},{name:"water",seconds:8,build:i=>Cm(i)},{name:"fire",seconds:8,build:i=>Tm(i)},{name:"machine",seconds:12,build:i=>Sm(i)},{name:"friction",seconds:10,build:i=>Lm(i,{motion:"steady"}),ready:i=>i.ready},{name:"waveguide",kind:"event",seconds:10,build:i=>Dm(i,{excite:"chime",drive:.3}),ready:i=>i.ready},{name:"bird",kind:"event",seconds:16,build:i=>Em(i)},{name:"crowd",seconds:10,build:i=>Im(i)},bo("hammer",{sound:"hammer"},1.1),bo("clatter",{sound:"clatter"},1.6),bo("animal",{sound:"animal"},1.8),bo("drip",{sound:"drip"},.9),bo("bell",{sound:"bell"},3.5,12)];function a5(i,t){const e=Math.round(t*.05),n=Math.floor(i.length/e),s=new Float32Array(n);for(let o=0;o<n;o++){let r=0;for(let a=0;a<e;a++){const c=i[o*e+a];r+=c*c}s[o]=Math.sqrt(r/e)}return s}function c5(i,t,e){const n=[],{rules:s}=Ha,[o,r]=s.crest[e];return i.peak>s.peak&&n.push(`peak ${i.peak.toFixed(2)} — clipping`),Math.abs(i.dc)>s.dc&&n.push(`dc ${i.dc.toFixed(4)}`),i.crest<o&&n.push(`crest ${i.crest.toFixed(1)} dB — ${e==="event"?"no transient left":"a drone"}`),i.crest>r&&n.push(`crest ${i.crest.toFixed(1)} dB — ${e==="event"?"nothing but spikes":"bubble wrap"}`),t>s.periodicity&&n.push(`periodicity ${t.toFixed(2)} — it loops`),n}function l5(i,t){const e=Ha.models[i];if(!e)return[];const n=[],{drift:s}=Ha;return Math.abs(t.loudness-e.loudness)>s.loudness&&n.push(`loudness ${e.loudness.toFixed(1)} → ${t.loudness.toFixed(1)}`),Math.abs(t.crest-e.crest)>s.crest&&n.push(`crest ${e.crest.toFixed(1)} → ${t.crest.toFixed(1)}`),Math.abs(Math.log2(Math.max(t.centroid,1)/Math.max(e.centroid,1)))>s.centroid&&n.push(`centroid ${e.centroid.toFixed(0)} → ${t.centroid.toFixed(0)} Hz`),n}async function h5(){const i=[],t={};for(const s of r5){const{signal:o,model:r,rate:a}=await e5(s),c=j3(o,a),l=a5(o,a),h=[];for(let d=4;d<l.length/4;d+=2)h.push(d);const u=J3(l,h),f=s.kind??"texture";i.push({name:s.name,measurements:c,periodicity:u,problems:[...c5(c,u,f),...l5(s.name,c)],novel:Ha.models[s.name]===void 0}),t[s.name]={loudness:Number(c.loudness.toFixed(2)),crest:Number(c.crest.toFixed(2)),centroid:Number(c.centroid.toFixed(0)),bands:c.bands.map(d=>Number(d.toFixed(4)))},r.dispose()}const e=i.map(s=>s.measurements.loudness).filter(Number.isFinite),n=e.length>1?Math.max(...e)-Math.min(...e):0;return{rows:i,spread:n,failures:i.filter(s=>s.problems.length>0).length,captured:t}}async function u5(){console.log("audition: rendering the library…");const i=await h5();console.table(i.rows.map(n=>({model:n.name,loudness:n.measurements.loudness.toFixed(1),crest:n.measurements.crest.toFixed(1),"centroid Hz":n.measurements.centroid.toFixed(0),peak:n.measurements.peak.toFixed(3),loop:n.periodicity.toFixed(2),status:n.problems.length===0?n.novel?"new":"ok":n.problems.join("; ")}))),console.log(`audition: ${i.failures} of ${i.rows.length} flagged. Loudness spread ${i.spread.toFixed(1)} — reported, not a rule; see baselines.json.`);const t=JSON.stringify(i.captured,null,2),e=i.rows.filter(n=>n.novel).map(n=>n.name);console.log(e.length>0?`audition: no baseline yet for ${e.join(", ")}.`:"audition: current measurements, for re-capture after a deliberate change."),console.log("If this run sounded right, replace the `models` block of src/audio/baselines.json with the object below and commit it — drift is only visible against something."),console.log(t);try{await navigator.clipboard.writeText(t),console.log("audition: copied to the clipboard.")}catch{console.log("audition: could not reach the clipboard — copy the block above.")}return i}const Fl=-90,zi=240,So=92;function d5(i){const t=document.createElement("canvas"),e=Math.min(window.devicePixelRatio||1,2);t.width=zi*e,t.height=So*e,Object.assign(t.style,{position:"fixed",right:"8px",bottom:"8px",width:`${zi}px`,height:`${So}px`,zIndex:"20",pointerEvents:"none",display:"none",background:"rgba(8, 10, 12, 0.72)",borderRadius:"3px"}),document.body.appendChild(t);const n=t.getContext("2d"),s=i.analyser,o=new Uint8Array(s.frequencyBinCount),r=new Float32Array(s.fftSize);let a=0;return{visible:!1,update(){if(t.style.display=this.visible?"block":"none",!this.visible||!n)return;s.getByteFrequencyData(o),s.getFloatTimeDomainData(r);let l=0;for(let y=0;y<r.length;y++){const m=Math.abs(r[y]);m>l&&(l=m)}a=Math.max(l,a*.94),n.setTransform(e,0,0,e,0,0),n.clearRect(0,0,zi,So);const h=i.context.sampleRate/2,u=So-12,f=30;n.fillStyle="#7fb2c9";for(let y=0;y<zi;y++){const m=f*Math.pow(h/f,y/zi),p=Math.min(o.length-1,Math.round(m/h*o.length)),_=o[p]/255*u;n.fillRect(y,u-_,1,_)}n.fillStyle="rgba(255, 255, 255, 0.16)";for(let y=100;y<h;y*=10){const m=Math.log(y/f)/Math.log(h/f)*zi;n.fillRect(m,0,1,u)}const d=a>0?20*Math.log10(a):Fl,g=Math.max(0,(d-Fl)/-Fl)*zi;n.fillStyle=d>-1?"#e05a4a":d>-6?"#e0b44a":"#6fbf73",n.fillRect(0,So-8,g,6)},dispose(){t.remove()}}}const f5=new Set(["speed"]);function Ol(i,t,e){let n=null,s=null;const o={};function r(a){const c=Object.keys(a.meta.params).sort();for(const h of c)o[h]=a.get(h);const l=i.addFolder(t).close();for(const h of c){const u=a.meta.params[h];l.add(o,h,u.min,u.max,u.step).name(f5.has(h)?`${h} (driven)`:h).onChange(f=>a.set(h,f)).listen()}n=l,s=a}return{sync(){const a=e();if(a===null){n?.destroy(),n=null,s=null;return}if(a!==s){n?.destroy(),r(a);return}for(const c of Object.keys(a.meta.params))o[c]=a.get(c)},dispose(){n?.destroy(),n=null,s=null}}}const p5=.35;class m5{root;bar;label;constructor(t){const e=document.getElementById("loading"),n=e?.querySelector(".loading-bar")??null,s=e?.querySelector(".loading-label")??null;if(e&&n&&s)this.root=e,this.bar=n,this.label=s;else{this.root=document.createElement("div"),this.root.id="loading";const o=document.createElement("div");o.className="loading-track",this.bar=document.createElement("div"),this.bar.className="loading-bar",o.appendChild(this.bar),this.label=document.createElement("div"),this.label.className="loading-label",this.root.append(o,this.label),t.appendChild(this.root)}document.body.classList.add("is-loading")}async step(t,e,n){return this.label.textContent=t,this.bar.style.transform=`scaleX(${Math.min(Math.max(e,0),1)})`,await ep(),n()}async done(){this.bar.style.transform="scaleX(1)",this.label.textContent="ready",await ep(),await np(.18),this.root.classList.add("is-gone"),document.body.classList.remove("is-loading"),await np(p5),this.root.remove()}fail(t){this.label.textContent=t,this.bar.style.transform="scaleX(1)",this.root.classList.add("is-failed")}}function ep(){return new Promise(i=>{requestAnimationFrame(()=>requestAnimationFrame(()=>i()))})}function np(i){return new Promise(t=>window.setTimeout(t,i*1e3))}const g5="OpenDyslexic",y5="./fonts/OpenDyslexic-Regular.otf",kl="is-dyslexic";let Vi="idle",ip=!1;const Ku=new Set;function v5(i){if(ip=i,!i){document.body.classList.remove(kl),ha();return}if(Vi==="ready"){document.body.classList.add(kl),ha();return}Vi==="loading"||Vi==="failed"||(Vi="loading",ha(),w5().then(t=>{Vi=t?"ready":"failed",t&&ip&&document.body.classList.add(kl),ha()}))}async function w5(){try{const i=new FontFace(g5,`url(${y5})`);return await i.load(),document.fonts.add(i),!0}catch{return!1}}function _5(i){return Vi==="failed"?"typeface unavailable":i.dyslexicFont&&Vi==="loading"?"fetching the typeface…":null}function x5(i){Ku.add(i)}function M5(i){Ku.delete(i)}function ha(){for(const i of Ku)i()}const ju="options",Ma={masterVolume:100,ambientVolume:100,footstepVolume:100,creatureVolume:100,npcVolume:100,fov:Zn.fov,fovScaling:Zn.fovScaling,dither:!0,pixelation:!0,ambientOcclusion:!0,bloom:!0,grassShadows:!1,shadows:!0,fpsCap:"uncapped",performance:"off",sensitivity:5,invertY:Zn.invertY,invertX:Zn.invertX,sprintMode:"hold",crouchMode:"hold",reducedMotion:!1,windSway:!0,headBob:!0,sprintZoom:!0,colorblind:"off",colorblindStrength:100,dyslexicFont:!1,fontSize:0};function Ig(i){const t=!i.reducedMotion;return{...i,grassShadows:i.grassShadows&&i.shadows,windSway:i.windSway&&t,headBob:i.headBob&&t,sprintZoom:i.sprintZoom&&t}}const Lg=i=>`${Math.round(i)}%`,sp=[{value:"hold",label:"hold"},{value:"toggle",label:"toggle"}],zl=i=>!i.reducedMotion,Eo=(i,t)=>({kind:"slider",key:i,label:t,min:0,max:100,step:1,format:Lg}),ua=()=>"not connected yet",Dg=[{id:"video",label:"Video",controls:[{kind:"slider",key:"fov",label:"field of view",min:60,max:120,step:1,format:i=>`${Math.round(i)}°`},{kind:"choice",key:"fovScaling",label:"field of view scaling",choices:[{value:"vertical",label:"vertical"},{value:"horizontal",label:"horizontal"}],note:i=>i.fovScaling==="horizontal"?"fixed side to side; a wider window loses height":"fixed top to bottom; a wider window shows more"},{kind:"toggle",key:"dither",label:"dither"},{kind:"toggle",key:"pixelation",label:"pixelation"},{kind:"toggle",key:"ambientOcclusion",label:"ambient occlusion"},{kind:"toggle",key:"bloom",label:"bloom"},{kind:"toggle",key:"shadows",label:"shadows"},{kind:"toggle",key:"grassShadows",label:"grass shadows",enabledWhen:i=>i.shadows,note:i=>i.shadows?null:"needs shadows"},{kind:"choice",key:"fpsCap",label:"frame rate cap",choices:[{value:"uncapped",label:"uncapped"},{value:"30",label:"30 fps"},{value:"60",label:"60 fps"},{value:"120",label:"120 fps"},{value:"144",label:"144 fps"},{value:"240",label:"240 fps"}]},{kind:"choice",key:"performance",label:"performance monitor",choices:[{value:"off",label:"off"},{value:"fps",label:"frame rate"},{value:"all",label:"everything"}]}]},{id:"audio",label:"Audio",controls:[Eo("masterVolume","master"),{...Eo("ambientVolume","ambience"),note:ua},{...Eo("footstepVolume","footsteps"),note:ua},{...Eo("creatureVolume","creatures"),note:ua},{...Eo("npcVolume","voices"),note:ua}]},{id:"controls",label:"Controls",controls:[{kind:"slider",key:"sensitivity",label:"mouse sensitivity",min:0,max:10,step:.1,format:i=>i.toFixed(1)},{kind:"toggle",key:"invertY",label:"invert vertical"},{kind:"toggle",key:"invertX",label:"invert horizontal"},{kind:"choice",key:"sprintMode",label:"sprint",choices:sp},{kind:"choice",key:"crouchMode",label:"crouch",choices:sp}]},{id:"accessibility",label:"Accessibility",controls:[{kind:"toggle",key:"reducedMotion",label:"reduced motion"},{kind:"toggle",key:"windSway",label:"wind sway",enabledWhen:zl,note:i=>i.reducedMotion?"held by reduced motion":null},{kind:"toggle",key:"headBob",label:"head bob",enabledWhen:zl,note:i=>i.reducedMotion?"held by reduced motion":null},{kind:"toggle",key:"sprintZoom",label:"sprint zoom",enabledWhen:zl,note:i=>i.reducedMotion?"held by reduced motion":null},{kind:"choice",key:"colorblind",label:"colourblind mode",choices:[{value:"off",label:"off"},{value:"protanopia",label:"protanopia (red blindness)"},{value:"deuteranopia",label:"deuteranopia (green blindness)"},{value:"tritanopia",label:"tritanopia (blue blindness)"}]},{kind:"slider",key:"colorblindStrength",label:"correction strength",min:0,max:100,step:1,format:Lg,shownWhen:i=>i.colorblind!=="off"},{kind:"toggle",key:"dyslexicFont",label:"dyslexia-friendly text",note:_5},{kind:"slider",key:"fontSize",label:"text size",min:-5,max:5,step:1,format:i=>i===0?"default":`${i>0?"+":""}${i}px`}]}];function b5(){const i=om(ju)??{},t={...Ma};for(const e of Dg)for(const n of e.controls){const s=i[n.key];if(n.kind==="slider"){if(typeof s!="number"||!Number.isFinite(s))continue;t[n.key]=Math.min(Math.max(s,n.min),n.max)}else if(n.kind==="toggle"){if(typeof s!="boolean")continue;t[n.key]=s}else n.choices.some(o=>o.value===s)&&S5(t,n.key,s)}return t}function S5(i,t,e){i[t]=e}function E5(i){rm(ju,i)}function T5(){am(ju)}const A5="video";class R5{options;onChange;onResume;root;opener;rows=[];tabs=[];current=A5;shown=!1;constructor(t,e,n){this.options=e,this.onChange=n.onChange,this.onResume=n.onResume,this.opener=document.createElement("button"),this.opener.id="options-open",this.opener.type="button",this.opener.textContent="options",this.opener.addEventListener("click",()=>this.show()),this.root=document.createElement("div"),this.root.id="options",this.root.hidden=!0;const s=document.createElement("div");s.className="options-scrim",s.addEventListener("click",()=>this.hide());const o=document.createElement("div");o.className="options-panel",o.setAttribute("role","dialog"),o.setAttribute("aria-modal","true"),o.setAttribute("aria-label","Options");const r=document.createElement("div");r.className="options-title",r.textContent="options";const a=document.createElement("div");a.className="options-tabs",a.setAttribute("role","tablist");const c=document.createElement("div");c.className="options-pages";for(const f of Dg){const{tab:d,page:g}=this.buildCategory(f);a.appendChild(d),c.appendChild(g)}const l=document.createElement("div");l.className="options-foot";const h=document.createElement("button");h.type="button",h.className="options-button",h.textContent="defaults",h.addEventListener("click",()=>this.reset());const u=document.createElement("button");u.type="button",u.className="options-button is-primary",u.textContent="resume",u.addEventListener("click",()=>{this.hide(),this.onResume()}),l.append(h,u),o.append(r,a,c,l),this.root.append(s,o),t.append(this.opener,this.root),window.addEventListener("keydown",this.handleKeyDown),x5(this.handleFontChange),this.sync()}buildCategory(t){const e=document.createElement("button");e.type="button",e.className="options-tab",e.textContent=t.label,e.setAttribute("role","tab"),e.addEventListener("click",()=>{this.current=t.id,this.syncTabs()});const n=document.createElement("div");n.className="options-page",n.setAttribute("role","tabpanel");for(const s of t.controls)n.appendChild(this.buildControl(s));return this.tabs.push({id:t.id,tab:e,page:n}),{tab:e,page:n}}buildControl(t){const e=document.createElement("div");e.className="options-row",e.appendChild(this.buildRevert(t));const n=document.createElement("span");n.className="options-row-label",n.textContent=t.label,e.appendChild(n);let s;t.kind==="slider"?s=this.buildSlider(e,t):t.kind==="toggle"?s=this.buildToggle(e,t):s=this.buildChoice(e,t);const o=document.createElement("span");return o.className="options-row-note",e.appendChild(o),this.rows.push({sync:()=>{e.hidden=!(t.shownWhen?.(this.options)??!0),e.classList.toggle("is-changed",this.options[t.key]!==Ma[t.key]);const r=t.enabledWhen?.(this.options)??!0;e.classList.toggle("is-disabled",!r);const a=t.note?.(this.options)??null;o.textContent=a??"",o.hidden=a===null,s(Ig(this.options))}}),e}buildRevert(t){const e=document.createElement("button");e.type="button",e.className="options-revert",e.setAttribute("aria-label",`Reset ${t.label} to default`);const n=document.createElement("span");n.className="options-revert-mark",n.textContent="*";const s=document.createElement("span");s.className="options-revert-icon",s.textContent="↺";const o=document.createElement("span");return o.className="options-revert-tip",o.textContent="Reset To Default",o.setAttribute("aria-hidden","true"),e.append(n,s,o),e.addEventListener("click",()=>this.set(t.key,Ma[t.key])),e}buildSlider(t,e){const n=document.createElement("input");n.type="range",n.className="options-slider",n.min=String(e.min),n.max=String(e.max),n.step=String(e.step);const s=document.createElement("span");return s.className="options-row-value",n.addEventListener("input",()=>this.set(e.key,Number(n.value))),t.append(s,n),o=>{const r=o[e.key];n.value=String(r),n.disabled=!(e.enabledWhen?.(this.options)??!0);const a=Math.max(e.max-e.min,1e-6);n.style.setProperty("--fill",`${(r-e.min)/a*100}%`),s.textContent=e.format?e.format(r):String(r)}}buildToggle(t,e){const n=document.createElement("button");n.type="button",n.className="options-switch",n.setAttribute("role","switch");const s=document.createElement("span");s.className="options-switch-knob";const o=document.createElement("span");return o.className="options-switch-word",n.append(s,o),n.addEventListener("click",()=>this.set(e.key,!this.options[e.key])),t.appendChild(n),r=>{const a=r[e.key];o.textContent=a?"on":"off",n.setAttribute("aria-checked",a?"true":"false"),n.classList.toggle("is-on",a),n.disabled=!(e.enabledWhen?.(this.options)??!0)}}buildChoice(t,e){const n=document.createElement("select");n.className="options-select";for(const s of e.choices){const o=document.createElement("option");o.value=s.value,o.textContent=s.label,n.appendChild(o)}return n.addEventListener("change",()=>this.set(e.key,n.value)),t.appendChild(n),s=>{n.value=s[e.key],n.disabled=!(e.enabledWhen?.(this.options)??!0)}}set(t,e){this.options[t]=e,this.sync(),this.onChange(this.options)}reset(){Object.assign(this.options,Ma),T5(),this.sync(),this.onChange(this.options)}sync(){for(const t of this.rows)t.sync();this.syncTabs()}syncTabs(){for(const t of this.tabs){const e=t.id===this.current;t.tab.classList.toggle("is-active",e),t.tab.setAttribute("aria-selected",e?"true":"false"),t.page.hidden=!e}}show(){this.shown||(this.shown=!0,this.root.hidden=!1,document.body.classList.add("is-options"),this.sync())}hide(){this.shown&&(this.shown=!1,this.root.hidden=!0,document.body.classList.remove("is-options"))}handleKeyDown=t=>{t.key!=="Escape"||!this.shown||this.hide()};handleFontChange=()=>this.sync();dispose(){window.removeEventListener("keydown",this.handleKeyDown),M5(this.handleFontChange),this.root.remove(),this.opener.remove()}}const C5=.1,P5=5,I5=18;function op(i,t){const{audio:e,postfx:n,zones:s,player:o,input:r,loop:a,performance:c}=t,l=o.tuning,h=Ig(i);e.settings.masterVolume=Tu.masterVolume*(h.masterVolume/100),o.setFieldOfView(h.fov,h.sprintZoom?Zn.sprintFovBoost:0,h.fovScaling),n.setDither(h.dither),n.setPixelation(h.pixelation),n.setAmbientOcclusion(h.ambientOcclusion),n.setBloom(h.bloom),n.setColorblind(h.colorblind,h.colorblindStrength/100),s.setShadows(h.shadows),s.setClutterShadows(h.grassShadows);const u=Number.parseInt(h.fpsCap,10);a.setFpsCap(Number.isFinite(u)?u:null),c.setMode(h.performance),l.lookSensitivity=Zn.lookSensitivity*Math.max(h.sensitivity,C5)/P5,l.invertY=h.invertY,l.invertX=h.invertX,r.setSprintMode(h.sprintMode),r.setCrouchMode(h.crouchMode),yi.swayAmount.value=h.windSway?1:0,l.bobScale=h.headBob?1:0,v5(h.dyslexicFont),document.documentElement.style.fontSize=`${I5+h.fontSize}px`}function L5(i,t,e){const n=()=>{op(i,e),E5(i)},s=new R5(t,i,{onChange:n,onResume:()=>e.input.capture()});return op(i,e),{options:i,commit:()=>{n(),s.sync()},open:()=>s.show(),dispose:()=>s.dispose()}}const To=180,D5=20,rp=.1;class N5{renderer;root;rows=new Map;samples=new Float32Array(To);count=0;cursor=0;sinceRefresh=0;mode="off";constructor(t,e){this.renderer=e,this.root=document.createElement("div"),this.root.id="perf",this.root.hidden=!0,t.appendChild(this.root)}setMode(t){t!==this.mode&&(this.mode=t,this.root.hidden=t==="off",this.root.classList.toggle("is-full",t==="all"),this.root.textContent="",this.rows.clear(),t!=="off"&&(this.addRow("fps"),t==="all"&&(this.addRow("1% low"),this.addRow("frame"),this.addRow("draws"),this.addRow("tris"),this.addRow("buffers"),this.addRow("memory"),this.addRow("size")),this.sinceRefresh=rp))}update(t){this.samples[this.cursor]=t*1e3,this.cursor=(this.cursor+1)%To,this.count=Math.min(this.count+1,To),this.mode!=="off"&&(this.sinceRefresh+=t,!(this.sinceRefresh<rp)&&(this.sinceRefresh=0,this.draw()))}draw(){const t=this.recentMean(D5);if(this.set("fps",t>0?Math.round(1e3/t).toString():"—"),this.mode!=="all")return;const e=this.onePercentLow();this.set("1% low",e>0?Math.round(1e3/e).toString():"—"),this.set("frame",`${t.toFixed(1)} ms`);const n=this.renderer.info;this.set("draws",n.render.calls.toString()),this.set("tris",n.render.triangles.toLocaleString()),this.set("buffers",`${n.memory.geometries} geo`);const s=performance.memory;this.set("memory",s?`${(s.usedJSHeapSize/1048576).toFixed(0)} MB`:"—");const o=this.renderer.getDrawingBufferSize(U5);this.set("size",`${o.x}×${o.y}`)}recentMean(t){const e=Math.min(t,this.count);if(e===0)return 0;let n=0;for(let s=1;s<=e;s++)n+=this.samples[(this.cursor-s+To)%To];return n/e}onePercentLow(){if(this.count===0)return 0;const t=Array.from(this.samples.subarray(0,this.count)).sort((s,o)=>o-s),e=Math.max(1,Math.round(this.count/100));let n=0;for(let s=0;s<e;s++)n+=t[s];return n/e}addRow(t){const e=document.createElement("div");e.className="perf-row";const n=document.createElement("span");n.className="perf-label",n.textContent=t;const s=document.createElement("span");s.className="perf-value",s.textContent="—",e.append(n,s),this.root.appendChild(e),this.rows.set(t,s)}set(t,e){const n=this.rows.get(t);n&&(n.textContent=e)}dispose(){this.root.remove()}}const U5=new tt,Ju=document.getElementById("viewport");if(!(Ju instanceof HTMLCanvasElement))throw new Error("#viewport canvas is missing from index.html");const Zs=document.getElementById("overlay");if(!(Zs instanceof HTMLElement))throw new Error("#overlay is missing from index.html");const ii=new Fx(Ju),Os=new kx,xe=Ob();ii.scene.fog=new Za(657935,20,90);tM();const ln=new bM(ii),F5=new cE(ii.renderer);ii.onResize=()=>ln.resize();const Ga=new Ca,Zo=new IM(Ju),$e=new GM(ii.camera,Zo,Ga),eo=new m5(document.body),No=await eo.step("shaping the ground",.12,()=>new tb),Zt=new eE({scene:ii.scene,collider:Ga,player:$e,postfx:ln,interaction:new kS,reticle:new iE(Zs),fade:new sE(Zs)}),Wi=b5(),Ng=X3(No);for(const i of Ng.zones)Zt.register(i);for(const i of Ng.portals)Zt.link(i);Zt.setShadows(Wi.shadows);Zt.setClutterShadows(Wi.grassShadows);ln.aimSun(Zt.sunDirection);await eo.step("settling the world",.6,()=>Zt.enter(Ps));await eo.step("raising arkstin",.78,()=>Zt.prebuild(Wu));const Me=new Sb;let cn=null;const O5=new Map([["canopy",.22],["foliage",.4],["shrub-a",.34],["shrub-b",.34],["wood-north",.2],["wood-east",.22],["hedge",.34]]);await eo.step("rendering the rooms",.86,()=>Me.ready);await eo.step("tuning the air",.96,()=>{cn=new rb(Me,.55),$e.onFootstep=i=>{if(!cn)return;const t=$e.position;cn.surface=Zt.surfaceAt(t.x,t.z),cn.step(i)},$e.onLand=i=>{if(!cn)return;const t=$e.position;cn.surface=Zt.surfaceAt(t.x,t.z),cn.land(i)},$e.onJump=()=>{if(!cn)return;const i=$e.position;cn.surface=Zt.surfaceAt(i.x,i.z),cn.jump()},Zt.attachAudio({engine:Me,footsteps:cn})});lm()?(new WM(Zo,Zs),document.body.classList.add("is-touch","is-playing")):Zo.onLockChange=i=>document.body.classList.toggle("is-playing",i);const Ug=new N5(Zs,ii.renderer),Ao=L5(Wi,Zs,{audio:Me,postfx:ln,zones:Zt,player:$e,input:Zo,loop:Os,performance:Ug});if(xe.gui){const i=ln.settings,t=()=>ln.apply(),e=xe.gui.addFolder("look");e.add(Wi,"shadows").name("cast shadows").listen().onChange(Ao.commit),e.add(Wi,"grassShadows").name("grass casts shadows").listen().onChange(Ao.commit),e.add({open:Ao.open},"open").name("open the player's menu"),e.add(i,"pixelSize",1,12,1).onChange(t),e.add(i,"normalEdgeStrength",0,2,.05).onChange(t),e.add(i,"depthEdgeStrength",0,2,.05).onChange(t),e.add(i,"quantize",["off","levels"]).onChange(t),e.add(i,"levels",2,16,1).onChange(t),e.add(i,"ditherScale",0,2,.05).name("dither (steps)").onChange(t),e.add(i,"screenPeriod",2,32,1).name("screen period").onChange(t);const n=xe.gui.addFolder("ambient occlusion");n.add(Wi,"ambientOcclusion").name("enabled").listen().onChange(Ao.commit),n.add(i.ao,"strength",0,1,.05).onChange(t),n.add(i.ao,"radius",.1,2,.05).name("radius (m)").onChange(t);const s=xe.gui.addFolder("bloom");s.add(Wi,"bloom").name("enabled").listen().onChange(Ao.commit),s.add(i.bloom,"strength",0,2,.05).onChange(t),s.add(i.bloom,"radius",.25,4,.05).onChange(t);const o=xe.gui.addFolder("vignette").close();o.add(i,"vignetteStrength",0,1,.01).onChange(t),o.add(i,"vignetteRadius",0,1.5,.01).onChange(t),o.add(i,"vignetteSoftness",.01,1.5,.01).onChange(t);const r=xe.gui.addFolder("sky");r.addColor(i.sky,"zenith").onChange(t),r.addColor(i.sky,"horizon").onChange(t),r.addColor(i.sky,"ground").name("below horizon").onChange(t),r.add(i.sky,"curve",.1,3,.05).onChange(t);const a=xe.gui.addFolder("clouds");a.addColor(i.sky,"cloudColor").name("colour").onChange(t),a.add(i.sky,"cloudCover",.1,.9,.01).name("cover").onChange(t),a.add(i.sky,"cloudSoftness",.01,.6,.01).name("softness").onChange(t),a.add(i.sky,"cloudScale",.2,4,.05).name("scale").onChange(t),a.add(i.sky,"cloudOpacity",0,1,.01).name("opacity").onChange(t),a.add(i.sky,"cloudDrift",0,.1,.001).name("drift").onChange(t);const c=xe.gui.addFolder("light").close();c.add(Zt.lights.sun,"intensity",0,5,.1).name("sun"),c.add(Zt.lights.ambient,"intensity",0,5,.1).name("ambient");const l={enabled:!0};xe.gui.addFolder("fog volumes").add(l,"enabled").name("enabled").onChange(()=>ln.setFogVolumes(l.enabled));const u=xe.gui.addFolder("fog").close();u.add(i,"linkFogToSky").name("match horizon").onChange(t),u.addColor(i,"fogColor").onChange(t),u.add(i,"fogNear",0,200,1).onChange(t),u.add(i,"fogFar",0,400,1).onChange(t);const f=xe.gui.addFolder("surfaces").close();for(const R of Object.keys(No.colors))f.addColor(No.colors,R).onChange(()=>No.applyColors());f.add({reset:()=>{No.resetColors(),xe.gui?.controllersRecursive().forEach(R=>R.updateDisplay())}},"reset");const d=xe.gui.addFolder("preset");d.add({save:()=>{const R=ln.save();d.title(R?"preset · saved":"preset · SAVE FAILED")}},"save"),d.add({reset:()=>{ln.reset(),xe.gui?.controllersRecursive().forEach(R=>R.updateDisplay())}},"reset"),d.add({copy:()=>{navigator.clipboard?.writeText(JSON.stringify(ln.settings,null,2))}},"copy").name("copy JSON");const g=$e.tuning,y=xe.gui.addFolder("movement");y.add(g,"walkSpeed",1,12,.1),y.add(g,"sprintScale",1,3,.05),y.add(g,"groundAccel",1,60,.5),y.add(g,"airAccel",0,20,.1),y.add(g,"friction",0,30,.5),y.add(g,"gravity",5,60,.5),y.add(g,"jumpSpeed",2,14,.1),y.add(g,"autoHop");const m=xe.gui.addFolder("contact").close();m.add(g,"slopeLimitDeg",5,85,1),m.add(g,"stepHeight",0,1,.01),m.add(g,"coyoteTime",0,.5,.01),m.add(g,"jumpBuffer",0,.5,.01);const p=xe.gui.addFolder("view");p.add(g,"lookSensitivity",2e-4,.008,1e-4),p.add(g,"invertY"),p.add(g,"eyeHeight",1,2,.01),p.add(g,"fov",50,110,1),p.add(g,"sprintFovBoost",0,30,1).name("sprint fov +");const _=xe.gui.addFolder("head bob").close();_.add(g,"bobAmount",0,.15,.001),_.add(g,"bobSway",0,.15,.001),_.add(g,"bobRoll",0,.05,5e-4),_.add(g,"bobStepsPerSecond",.5,5,.05),_.add(g,"bobSpeedInfluence",0,1,.05),_.add(g,"landDip",0,.1,.001);const w=xe.gui.addFolder("audio");w.add(Me.settings,"masterVolume",0,1,.01).name("volume"),w.add(Me.settings,"reverbAmount",0,2,.01).name("reverb").onChange(()=>Me.applyReverbAmount()),w.add(Me.settings,"airAbsorption",0,1,.01).name("air absorption"),w.add(Me.settings,"occlusion",0,1,.01).name("occlusion");const v=xe.gui.addFolder("weather");v.add(Me.weather.settings,"windSpeed",0,1,.01).name("wind"),v.add(Me.weather.settings,"gustDepth",0,1,.01).name("gust depth"),v.add(Me.weather.settings,"gustRate",.01,.6,.01).name("gust rate"),v.add(Me.weather.settings,"windDirection",0,Math.PI*2,.01).name("wind direction"),v.add(Me.weather.settings,"frontSpeed",1,60,.5).name("front speed (m/s)"),v.add(yi.swayAmount,"value",0,2,.01).name("sway");const b={windTone:3400,leaves:1,machineRpm:52,fireIntensity:.85,rain:0,water:1,strike:()=>Zt.sound?.findField("smith")?.trigger(),drop:()=>Zt.sound?.findField("yards")?.trigger(),toll:()=>Zt.sound?.findField("bell")?.trigger()};v.add(b,"windTone",700,9e3,50).name("wind tone (Hz)").onChange(R=>{Zt.sound?.find("wind")?.setTone(R)}),v.add(b,"leaves",0,2,.01).name("leaf articulation").onChange(R=>{for(const[F,D]of O5)Zt.sound?.find(F)?.setArticulation(D*R)}),v.add(b,"machineRpm",0,200,1).name("mill rpm").onChange(R=>{Zt.sound?.find("mill")?.setRpm(R)}),v.add(b,"fireIntensity",0,1,.01).name("forge intensity").onChange(R=>{Zt.sound?.find("forge")?.setIntensity(R)}),v.add(b,"rain",0,1,.01).name("rain").onChange(R=>{Zt.sound?.find("rain")?.setIntensity(R)}),v.add(b,"water",0,1,.01).name("water flow").onChange(R=>{Zt.sound?.find("cistern")?.setRate(R)}),v.add(b,"strike").name("hammer now"),v.add(b,"drop").name("clatter now"),v.add(b,"toll").name("bell now");const S={speed:"0.00",grounded:"no",position:"",triangles:Ga.triangles,draws:0,drawn:"0",heap:"—",resident:"—",zone:"—",crossings:0,room:"—",audio:"waiting for a click",gust:"0.00",swell:"0.00",machine:"—",emitters:"—"},E=xe.gui.addFolder("state");E.add(S,"speed").listen().disable(),E.add(S,"grounded").listen().disable(),E.add(S,"position").listen().disable(),E.add(S,"zone").listen().disable(),E.add(S,"crossings").listen().disable(),E.add(S,"room").listen().disable(),E.add(S,"audio").listen().disable(),E.add(S,"gust").listen().disable(),E.add(S,"swell").listen().disable(),E.add(S,"machine").listen().disable(),E.add(S,"emitters").name("hrtf / panned / virtual").listen().disable(),E.add(S,"draws").name("draw calls").listen().disable(),E.add(S,"drawn").name("drawn tris").listen().disable(),E.add(S,"heap").listen().disable(),E.add(S,"resident").name("zones built / evicted").listen().disable(),E.add(S,"triangles").name("collider tris").listen().disable(),E.add({respawn:()=>Zt.respawn()},"respawn");const T=xe.gui.addFolder("zones");for(const R of Zt.zones.values())T.add({go:()=>void Zt.enter(R.id)},"go").name(R.name);const M=d5(Me);Os.add(()=>M.update());const x=xe.gui.addFolder("sound stage").close(),A={solo:"all",reverb:"—",audition:()=>{u5()}};x.add(A,"solo",["all",...v3]).name("solo").onChange(R=>{Zt.sound?.setSolo(R==="all"?null:R)}),x.add(A,"reverb").listen().disable(),x.add(A,"audition").name("audition the library"),x.add(M,"visible").name("spectrum");const P=[Ol(x,"reverb",()=>Me.reverbControls),...["gantry","gate","limb","friction"].map(R=>Ol(x,R,()=>Zt.sound?.find(R)?.loop??null)),...["pipe-air","waveguide"].map(R=>Ol(x,R,()=>Zt.sound?.find(R)?.loop??null))];Os.add(()=>{for(const R of P)R.sync()}),Os.add(()=>{S.speed=$e.speed.toFixed(2),S.grounded=$e.isGrounded?"yes":"no";const R=$e.position;S.position=`${R.x.toFixed(1)}, ${R.y.toFixed(1)}, ${R.z.toFixed(1)}`,S.zone=Zt.current?.name??"—",S.crossings=Zt.crossings,S.triangles=Ga.triangles;const F=ii.renderer.info.render;S.draws=F.calls,S.drawn=F.triangles.toLocaleString();const D=performance.memory;S.heap=D?`${(D.usedJSHeapSize/1048576).toFixed(0)} MB`:"unavailable",S.resident=`${Zt.builtZones.length} / ${Zt.evictions}`,S.room=Me.room??"open",A.reverb=Me.reverbKind==="fdn"?"fdn — tunable":"convolution — fixed",S.audio=cn===null?"rendering…":Me.context.state,S.gust=Me.weather.strength.toFixed(2),S.swell=Me.weather.swell.toFixed(2),S.machine=Zt.sound?.find("mill")?.phase??"—";const N=Me.voiceCounts;S.emitters=Zt.sound===null?"—":`${N.hrtf} / ${N.panned} / ${N.virtual} · ${Zt.sound.occludedCount} occl`})}Os.add((i,t)=>{$e.update(i);const e=Zt.current;e&&$e.position.y<e.floor&&Zt.respawn();const n=Zt.update();Zo.takeInteract()&&n&&Zt.use(n);const o=Me.update(i,ii.camera);Zt.updateSound(i,o),nM(Me.weather,t),ln.render(t),F5.update(),Ug.update(i),xe.update()});$e.update(0);ln.render(0);await eo.done();Os.start();
