(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Jl="170",om=0,kh=1,am=2,C0=1,P0=2,Bn=3,ci=0,We=1,mn=2,qn=0,fs=1,Uc=2,Bh=3,Hh=4,cm=5,Ri=100,lm=101,hm=102,um=103,dm=104,fm=200,pm=201,mm=202,gm=203,Fc=204,Oc=205,ym=206,vm=207,_m=208,wm=209,xm=210,Mm=211,bm=212,Sm=213,Em=214,zc=0,kc=1,Bc=2,gs=3,Hc=4,Gc=5,Vc=6,Wc=7,Ql=0,Am=1,Tm=2,ai=0,I0=1,L0=2,D0=3,N0=4,Rm=5,U0=6,F0=7,O0=300,ys=301,vs=302,Xc=303,qc=304,Ko=306,lr=1e3,Vn=1001,Yc=1002,Ue=1003,Cm=1004,Sr=1005,nn=1006,ca=1007,oi=1008,En=1009,z0=1010,k0=1011,hr=1012,th=1013,Di=1014,Wn=1015,li=1016,eh=1017,nh=1018,_s=1020,B0=35902,H0=1021,G0=1022,cn=1023,V0=1024,W0=1025,ps=1026,ws=1027,ih=1028,sh=1029,X0=1030,rh=1031,oh=1033,So=33776,Eo=33777,Ao=33778,To=33779,$c=35840,Zc=35841,Kc=35842,jc=35843,Jc=36196,Qc=37492,tl=37496,el=37808,nl=37809,il=37810,sl=37811,rl=37812,ol=37813,al=37814,cl=37815,ll=37816,hl=37817,ul=37818,dl=37819,fl=37820,pl=37821,Ro=36492,ml=36494,gl=36495,q0=36283,yl=36284,vl=36285,_l=36286,Pm=3200,Y0=3201,ah=0,Im=1,Gn="",en="srgb",As="srgb-linear",jo="linear",ue="srgb",Hi=7680,Gh=519,Lm=512,Dm=513,Nm=514,$0=515,Um=516,Fm=517,Om=518,zm=519,Vh=35044,Wh="300 es",Xn=2e3,Lo=2001;class Ts{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const Oe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Xh=1234567;const er=Math.PI/180,xs=180/Math.PI;function Fi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Oe[i&255]+Oe[i>>8&255]+Oe[i>>16&255]+Oe[i>>24&255]+"-"+Oe[t&255]+Oe[t>>8&255]+"-"+Oe[t>>16&15|64]+Oe[t>>24&255]+"-"+Oe[e&63|128]+Oe[e>>8&255]+"-"+Oe[e>>16&255]+Oe[e>>24&255]+Oe[n&255]+Oe[n>>8&255]+Oe[n>>16&255]+Oe[n>>24&255]).toLowerCase()}function Te(i,t,e){return Math.max(t,Math.min(e,i))}function ch(i,t){return(i%t+t)%t}function km(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Bm(i,t,e){return i!==t?(e-i)/(t-i):0}function nr(i,t,e){return(1-e)*i+e*t}function Hm(i,t,e,n){return nr(i,t,1-Math.exp(-e*n))}function Gm(i,t=1){return t-Math.abs(ch(i,t*2)-t)}function Vm(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Wm(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Xm(i,t){return i+Math.floor(Math.random()*(t-i+1))}function qm(i,t){return i+Math.random()*(t-i)}function Ym(i){return i*(.5-Math.random())}function $m(i){i!==void 0&&(Xh=i);let t=Xh+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Zm(i){return i*er}function Km(i){return i*xs}function jm(i){return(i&i-1)===0&&i!==0}function Jm(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Qm(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function tg(i,t,e,n,s){const r=Math.cos,o=Math.sin,a=r(e/2),c=o(e/2),l=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),f=o((t-n)/2),d=r((n-t)/2),g=o((n-t)/2);switch(s){case"XYX":i.set(a*h,c*u,c*f,a*l);break;case"YZY":i.set(c*f,a*h,c*u,a*l);break;case"ZXZ":i.set(c*u,c*f,a*h,a*l);break;case"XZX":i.set(a*h,c*g,c*d,a*l);break;case"YXY":i.set(c*d,a*h,c*g,a*l);break;case"ZYZ":i.set(c*g,c*d,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function as(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ge(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const eg={DEG2RAD:er,RAD2DEG:xs,generateUUID:Fi,clamp:Te,euclideanModulo:ch,mapLinear:km,inverseLerp:Bm,lerp:nr,damp:Hm,pingpong:Gm,smoothstep:Vm,smootherstep:Wm,randInt:Xm,randFloat:qm,randFloatSpread:Ym,seededRandom:$m,degToRad:Zm,radToDeg:Km,isPowerOfTwo:jm,ceilPowerOfTwo:Jm,floorPowerOfTwo:Qm,setQuaternionFromProperEuler:tg,normalize:Ge,denormalize:as};class tt{constructor(t=0,e=0){tt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Te(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class jt{constructor(t,e,n,s,r,o,a,c,l){jt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l)}set(t,e,n,s,r,o,a,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],f=n[2],d=n[5],g=n[8],y=s[0],m=s[3],p=s[6],_=s[1],v=s[4],w=s[7],M=s[2],S=s[5],E=s[8];return r[0]=o*y+a*_+c*M,r[3]=o*m+a*v+c*S,r[6]=o*p+a*w+c*E,r[1]=l*y+h*_+u*M,r[4]=l*m+h*v+u*S,r[7]=l*p+h*w+u*E,r[2]=f*y+d*_+g*M,r[5]=f*m+d*v+g*S,r[8]=f*p+d*w+g*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*o-a*l,f=a*c-h*r,d=l*r-o*c,g=e*u+n*f+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/g;return t[0]=u*y,t[1]=(s*l-h*n)*y,t[2]=(a*n-s*o)*y,t[3]=f*y,t[4]=(h*e-s*c)*y,t[5]=(s*r-a*e)*y,t[6]=d*y,t[7]=(n*c-l*e)*y,t[8]=(o*e-n*r)*y,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(la.makeScale(t,e)),this}rotate(t){return this.premultiply(la.makeRotation(-t)),this}translate(t,e){return this.premultiply(la.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const la=new jt;function Z0(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Do(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function ng(){const i=Do("canvas");return i.style.display="block",i}const qh={};function Qs(i){i in qh||(qh[i]=!0,console.warn(i))}function ig(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function sg(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function rg(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const re={enabled:!0,workingColorSpace:As,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ue&&(i.r=Yn(i.r),i.g=Yn(i.g),i.b=Yn(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ue&&(i.r=ms(i.r),i.g=ms(i.g),i.b=ms(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Gn?jo:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Yn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ms(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Yh=[.64,.33,.3,.6,.15,.06],$h=[.2126,.7152,.0722],Zh=[.3127,.329],Kh=new jt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),jh=new jt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);re.define({[As]:{primaries:Yh,whitePoint:Zh,transfer:jo,toXYZ:Kh,fromXYZ:jh,luminanceCoefficients:$h,workingColorSpaceConfig:{unpackColorSpace:en},outputColorSpaceConfig:{drawingBufferColorSpace:en}},[en]:{primaries:Yh,whitePoint:Zh,transfer:ue,toXYZ:Kh,fromXYZ:jh,luminanceCoefficients:$h,outputColorSpaceConfig:{drawingBufferColorSpace:en}}});let Gi;class og{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Gi===void 0&&(Gi=Do("canvas")),Gi.width=t.width,Gi.height=t.height;const n=Gi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Gi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Do("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Yn(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Yn(e[n]/255)*255):e[n]=Yn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let ag=0;class K0{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ag++}),this.uuid=Fi(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(ha(s[o].image)):r.push(ha(s[o]))}else r=ha(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function ha(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?og.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let cg=0;class Xe extends Ts{constructor(t=Xe.DEFAULT_IMAGE,e=Xe.DEFAULT_MAPPING,n=Vn,s=Vn,r=nn,o=oi,a=cn,c=En,l=Xe.DEFAULT_ANISOTROPY,h=Gn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:cg++}),this.uuid=Fi(),this.name="",this.source=new K0(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new tt(0,0),this.repeat=new tt(1,1),this.center=new tt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==O0)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case lr:t.x=t.x-Math.floor(t.x);break;case Vn:t.x=t.x<0?0:1;break;case Yc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case lr:t.y=t.y-Math.floor(t.y);break;case Vn:t.y=t.y<0?0:1;break;case Yc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Xe.DEFAULT_IMAGE=null;Xe.DEFAULT_MAPPING=O0;Xe.DEFAULT_ANISOTROPY=1;class de{constructor(t=0,e=0,n=0,s=1){de.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,l=c[0],h=c[4],u=c[8],f=c[1],d=c[5],g=c[9],y=c[2],m=c[6],p=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+y)<.1&&Math.abs(g+m)<.1&&Math.abs(l+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const v=(l+1)/2,w=(d+1)/2,M=(p+1)/2,S=(h+f)/4,E=(u+y)/4,A=(g+m)/4;return v>w&&v>M?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=S/n,r=E/n):w>M?w<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(w),n=S/s,r=A/s):M<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(M),n=E/r,s=A/r),this.set(n,s,r,e),this}let _=Math.sqrt((m-g)*(m-g)+(u-y)*(u-y)+(f-h)*(f-h));return Math.abs(_)<.001&&(_=1),this.x=(m-g)/_,this.y=(u-y)/_,this.z=(f-h)/_,this.w=Math.acos((l+d+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class lg extends Ts{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new de(0,0,t,e),this.scissorTest=!1,this.viewport=new de(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:nn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Xe(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new K0(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class An extends lg{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class j0 extends Xe{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ue,this.minFilter=Ue,this.wrapR=Vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class hg extends Xe{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ue,this.minFilter=Ue,this.wrapR=Vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class $n{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3];const f=r[o+0],d=r[o+1],g=r[o+2],y=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=f,t[e+1]=d,t[e+2]=g,t[e+3]=y;return}if(u!==y||c!==f||l!==d||h!==g){let m=1-a;const p=c*f+l*d+h*g+u*y,_=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){const M=Math.sqrt(v),S=Math.atan2(M,p*_);m=Math.sin(m*S)/M,a=Math.sin(a*S)/M}const w=a*_;if(c=c*m+f*w,l=l*m+d*w,h=h*m+g*w,u=u*m+y*w,m===1-a){const M=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=M,l*=M,h*=M,u*=M}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[o],f=r[o+1],d=r[o+2],g=r[o+3];return t[e]=a*g+h*u+c*d-l*f,t[e+1]=c*g+h*f+l*u-a*d,t[e+2]=l*g+h*d+a*f-c*u,t[e+3]=h*g-a*u-c*f-l*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),u=a(r/2),f=c(n/2),d=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=f*h*u+l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u-f*d*g;break;case"YXZ":this._x=f*h*u+l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u+f*d*g;break;case"ZXY":this._x=f*h*u-l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u-f*d*g;break;case"ZYX":this._x=f*h*u-l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u+f*d*g;break;case"YZX":this._x=f*h*u+l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u-f*d*g;break;case"XZY":this._x=f*h*u-l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],f=n+a+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-c)*d,this._y=(r-l)*d,this._z=(o-s)*d}else if(n>a&&n>u){const d=2*Math.sqrt(1+n-a-u);this._w=(h-c)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+l)/d}else if(a>u){const d=2*Math.sqrt(1+a-n-u);this._w=(r-l)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(c+h)/d}else{const d=2*Math.sqrt(1+u-n-a);this._w=(o-s)/d,this._x=(r+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Te(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const d=1-e;return this._w=d*o+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,f=Math.sin(e*h)/l;return this._w=o*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{constructor(t=0,e=0,n=0){R.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Jh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Jh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=s+c*u+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ua.copy(this).projectOnVector(t),this.sub(ua)}reflect(t){return this.sub(ua.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Te(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ua=new R,Jh=new $n;class Ni{constructor(t=new R(1/0,1/0,1/0),e=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(dn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(dn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=dn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,dn):dn.fromBufferAttribute(r,o),dn.applyMatrix4(t.matrixWorld),this.expandByPoint(dn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Er.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Er.copy(n.boundingBox)),Er.applyMatrix4(t.matrixWorld),this.union(Er)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,dn),dn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ds),Ar.subVectors(this.max,Ds),Vi.subVectors(t.a,Ds),Wi.subVectors(t.b,Ds),Xi.subVectors(t.c,Ds),Qn.subVectors(Wi,Vi),ti.subVectors(Xi,Wi),gi.subVectors(Vi,Xi);let e=[0,-Qn.z,Qn.y,0,-ti.z,ti.y,0,-gi.z,gi.y,Qn.z,0,-Qn.x,ti.z,0,-ti.x,gi.z,0,-gi.x,-Qn.y,Qn.x,0,-ti.y,ti.x,0,-gi.y,gi.x,0];return!da(e,Vi,Wi,Xi,Ar)||(e=[1,0,0,0,1,0,0,0,1],!da(e,Vi,Wi,Xi,Ar))?!1:(Tr.crossVectors(Qn,ti),e=[Tr.x,Tr.y,Tr.z],da(e,Vi,Wi,Xi,Ar))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,dn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(dn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Dn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Dn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Dn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Dn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Dn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Dn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Dn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Dn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Dn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Dn=[new R,new R,new R,new R,new R,new R,new R,new R],dn=new R,Er=new Ni,Vi=new R,Wi=new R,Xi=new R,Qn=new R,ti=new R,gi=new R,Ds=new R,Ar=new R,Tr=new R,yi=new R;function da(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){yi.fromArray(i,r);const a=s.x*Math.abs(yi.x)+s.y*Math.abs(yi.y)+s.z*Math.abs(yi.z),c=t.dot(yi),l=e.dot(yi),h=n.dot(yi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const ug=new Ni,Ns=new R,fa=new R;class Rs{constructor(t=new R,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):ug.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ns.subVectors(t,this.center);const e=Ns.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Ns,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(fa.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ns.copy(t.center).add(fa)),this.expandByPoint(Ns.copy(t.center).sub(fa))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Nn=new R,pa=new R,Rr=new R,ei=new R,ma=new R,Cr=new R,ga=new R;class mr{constructor(t=new R,e=new R(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Nn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Nn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Nn.copy(this.origin).addScaledVector(this.direction,e),Nn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){pa.copy(t).add(e).multiplyScalar(.5),Rr.copy(e).sub(t).normalize(),ei.copy(this.origin).sub(pa);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Rr),a=ei.dot(this.direction),c=-ei.dot(Rr),l=ei.lengthSq(),h=Math.abs(1-o*o);let u,f,d,g;if(h>0)if(u=o*c-a,f=o*a-c,g=r*h,u>=0)if(f>=-g)if(f<=g){const y=1/h;u*=y,f*=y,d=u*(u+o*f+2*a)+f*(o*u+f+2*c)+l}else f=r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;else f=-r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;else f<=-g?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l):f<=g?(u=0,f=Math.min(Math.max(-r,-c),r),d=f*(f+2*c)+l):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(pa).addScaledVector(Rr,f),d}intersectSphere(t,e){Nn.subVectors(t.center,this.origin);const n=Nn.dot(this.direction),s=Nn.dot(Nn)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),h>=0?(r=(t.min.y-f.y)*h,o=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,o=(t.min.y-f.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(a=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Nn)!==null}intersectTriangle(t,e,n,s,r){ma.subVectors(e,t),Cr.subVectors(n,t),ga.crossVectors(ma,Cr);let o=this.direction.dot(ga),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ei.subVectors(this.origin,t);const c=a*this.direction.dot(Cr.crossVectors(ei,Cr));if(c<0)return null;const l=a*this.direction.dot(ma.cross(ei));if(l<0||c+l>o)return null;const h=-a*ei.dot(ga);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class fe{constructor(t,e,n,s,r,o,a,c,l,h,u,f,d,g,y,m){fe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l,h,u,f,d,g,y,m)}set(t,e,n,s,r,o,a,c,l,h,u,f,d,g,y,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=g,p[11]=y,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new fe().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/qi.setFromMatrixColumn(t,0).length(),r=1/qi.setFromMatrixColumn(t,1).length(),o=1/qi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=o*h,d=o*u,g=a*h,y=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=d+g*l,e[5]=f-y*l,e[9]=-a*c,e[2]=y-f*l,e[6]=g+d*l,e[10]=o*c}else if(t.order==="YXZ"){const f=c*h,d=c*u,g=l*h,y=l*u;e[0]=f+y*a,e[4]=g*a-d,e[8]=o*l,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=d*a-g,e[6]=y+f*a,e[10]=o*c}else if(t.order==="ZXY"){const f=c*h,d=c*u,g=l*h,y=l*u;e[0]=f-y*a,e[4]=-o*u,e[8]=g+d*a,e[1]=d+g*a,e[5]=o*h,e[9]=y-f*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const f=o*h,d=o*u,g=a*h,y=a*u;e[0]=c*h,e[4]=g*l-d,e[8]=f*l+y,e[1]=c*u,e[5]=y*l+f,e[9]=d*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const f=o*c,d=o*l,g=a*c,y=a*l;e[0]=c*h,e[4]=y-f*u,e[8]=g*u+d,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=d*u+g,e[10]=f-y*u}else if(t.order==="XZY"){const f=o*c,d=o*l,g=a*c,y=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=f*u+y,e[5]=o*h,e[9]=d*u-g,e[2]=g*u-d,e[6]=a*h,e[10]=y*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(dg,t,fg)}lookAt(t,e,n){const s=this.elements;return Je.subVectors(t,e),Je.lengthSq()===0&&(Je.z=1),Je.normalize(),ni.crossVectors(n,Je),ni.lengthSq()===0&&(Math.abs(n.z)===1?Je.x+=1e-4:Je.z+=1e-4,Je.normalize(),ni.crossVectors(n,Je)),ni.normalize(),Pr.crossVectors(Je,ni),s[0]=ni.x,s[4]=Pr.x,s[8]=Je.x,s[1]=ni.y,s[5]=Pr.y,s[9]=Je.y,s[2]=ni.z,s[6]=Pr.z,s[10]=Je.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],f=n[9],d=n[13],g=n[2],y=n[6],m=n[10],p=n[14],_=n[3],v=n[7],w=n[11],M=n[15],S=s[0],E=s[4],A=s[8],x=s[12],b=s[1],T=s[5],P=s[9],C=s[13],F=s[2],N=s[6],D=s[10],B=s[14],H=s[3],V=s[7],et=s[11],lt=s[15];return r[0]=o*S+a*b+c*F+l*H,r[4]=o*E+a*T+c*N+l*V,r[8]=o*A+a*P+c*D+l*et,r[12]=o*x+a*C+c*B+l*lt,r[1]=h*S+u*b+f*F+d*H,r[5]=h*E+u*T+f*N+d*V,r[9]=h*A+u*P+f*D+d*et,r[13]=h*x+u*C+f*B+d*lt,r[2]=g*S+y*b+m*F+p*H,r[6]=g*E+y*T+m*N+p*V,r[10]=g*A+y*P+m*D+p*et,r[14]=g*x+y*C+m*B+p*lt,r[3]=_*S+v*b+w*F+M*H,r[7]=_*E+v*T+w*N+M*V,r[11]=_*A+v*P+w*D+M*et,r[15]=_*x+v*C+w*B+M*lt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],f=t[10],d=t[14],g=t[3],y=t[7],m=t[11],p=t[15];return g*(+r*c*u-s*l*u-r*a*f+n*l*f+s*a*d-n*c*d)+y*(+e*c*d-e*l*f+r*o*f-s*o*d+s*l*h-r*c*h)+m*(+e*l*u-e*a*d-r*o*u+n*o*d+r*a*h-n*l*h)+p*(-s*a*h-e*c*u+e*a*f+s*o*u-n*o*f+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],f=t[10],d=t[11],g=t[12],y=t[13],m=t[14],p=t[15],_=u*m*l-y*f*l+y*c*d-a*m*d-u*c*p+a*f*p,v=g*f*l-h*m*l-g*c*d+o*m*d+h*c*p-o*f*p,w=h*y*l-g*u*l+g*a*d-o*y*d-h*a*p+o*u*p,M=g*u*c-h*y*c-g*a*f+o*y*f+h*a*m-o*u*m,S=e*_+n*v+s*w+r*M;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/S;return t[0]=_*E,t[1]=(y*f*r-u*m*r-y*s*d+n*m*d+u*s*p-n*f*p)*E,t[2]=(a*m*r-y*c*r+y*s*l-n*m*l-a*s*p+n*c*p)*E,t[3]=(u*c*r-a*f*r-u*s*l+n*f*l+a*s*d-n*c*d)*E,t[4]=v*E,t[5]=(h*m*r-g*f*r+g*s*d-e*m*d-h*s*p+e*f*p)*E,t[6]=(g*c*r-o*m*r-g*s*l+e*m*l+o*s*p-e*c*p)*E,t[7]=(o*f*r-h*c*r+h*s*l-e*f*l-o*s*d+e*c*d)*E,t[8]=w*E,t[9]=(g*u*r-h*y*r-g*n*d+e*y*d+h*n*p-e*u*p)*E,t[10]=(o*y*r-g*a*r+g*n*l-e*y*l-o*n*p+e*a*p)*E,t[11]=(h*a*r-o*u*r-h*n*l+e*u*l+o*n*d-e*a*d)*E,t[12]=M*E,t[13]=(h*y*s-g*u*s+g*n*f-e*y*f-h*n*m+e*u*m)*E,t[14]=(g*a*s-o*y*s-g*n*c+e*y*c+o*n*m-e*a*m)*E,t[15]=(o*u*s-h*a*s+h*n*c-e*u*c-o*n*f+e*a*f)*E,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,u=a+a,f=r*l,d=r*h,g=r*u,y=o*h,m=o*u,p=a*u,_=c*l,v=c*h,w=c*u,M=n.x,S=n.y,E=n.z;return s[0]=(1-(y+p))*M,s[1]=(d+w)*M,s[2]=(g-v)*M,s[3]=0,s[4]=(d-w)*S,s[5]=(1-(f+p))*S,s[6]=(m+_)*S,s[7]=0,s[8]=(g+v)*E,s[9]=(m-_)*E,s[10]=(1-(f+y))*E,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=qi.set(s[0],s[1],s[2]).length();const o=qi.set(s[4],s[5],s[6]).length(),a=qi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],fn.copy(this);const l=1/r,h=1/o,u=1/a;return fn.elements[0]*=l,fn.elements[1]*=l,fn.elements[2]*=l,fn.elements[4]*=h,fn.elements[5]*=h,fn.elements[6]*=h,fn.elements[8]*=u,fn.elements[9]*=u,fn.elements[10]*=u,e.setFromRotationMatrix(fn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Xn){const c=this.elements,l=2*r/(e-t),h=2*r/(n-s),u=(e+t)/(e-t),f=(n+s)/(n-s);let d,g;if(a===Xn)d=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Lo)d=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=d,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Xn){const c=this.elements,l=1/(e-t),h=1/(n-s),u=1/(o-r),f=(e+t)*l,d=(n+s)*h;let g,y;if(a===Xn)g=(o+r)*u,y=-2*u;else if(a===Lo)g=r*u,y=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-d,c[2]=0,c[6]=0,c[10]=y,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const qi=new R,fn=new fe,dg=new R(0,0,0),fg=new R(1,1,1),ni=new R,Pr=new R,Je=new R,Qh=new fe,tu=new $n;class Tn{constructor(t=0,e=0,n=0,s=Tn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Te(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Te(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Te(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Te(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Te(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Te(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Qh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Qh,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return tu.setFromEuler(this),this.setFromQuaternion(tu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Tn.DEFAULT_ORDER="XYZ";class Jo{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let pg=0;const eu=new R,Yi=new $n,Un=new fe,Ir=new R,Us=new R,mg=new R,gg=new $n,nu=new R(1,0,0),iu=new R(0,1,0),su=new R(0,0,1),ru={type:"added"},yg={type:"removed"},$i={type:"childadded",child:null},ya={type:"childremoved",child:null};class be extends Ts{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:pg++}),this.uuid=Fi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=be.DEFAULT_UP.clone();const t=new R,e=new Tn,n=new $n,s=new R(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new fe},normalMatrix:{value:new jt}}),this.matrix=new fe,this.matrixWorld=new fe,this.matrixAutoUpdate=be.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Jo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Yi.setFromAxisAngle(t,e),this.quaternion.multiply(Yi),this}rotateOnWorldAxis(t,e){return Yi.setFromAxisAngle(t,e),this.quaternion.premultiply(Yi),this}rotateX(t){return this.rotateOnAxis(nu,t)}rotateY(t){return this.rotateOnAxis(iu,t)}rotateZ(t){return this.rotateOnAxis(su,t)}translateOnAxis(t,e){return eu.copy(t).applyQuaternion(this.quaternion),this.position.add(eu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(nu,t)}translateY(t){return this.translateOnAxis(iu,t)}translateZ(t){return this.translateOnAxis(su,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Un.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ir.copy(t):Ir.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Us.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Un.lookAt(Us,Ir,this.up):Un.lookAt(Ir,Us,this.up),this.quaternion.setFromRotationMatrix(Un),s&&(Un.extractRotation(s.matrixWorld),Yi.setFromRotationMatrix(Un),this.quaternion.premultiply(Yi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(ru),$i.child=t,this.dispatchEvent($i),$i.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(yg),ya.child=t,this.dispatchEvent(ya),ya.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Un.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Un.multiply(t.parent.matrixWorld)),t.applyMatrix4(Un),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(ru),$i.child=t,this.dispatchEvent($i),$i.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Us,t,mg),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Us,gg,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),u=o(t.shapes),f=o(t.skeletons),d=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}be.DEFAULT_UP=new R(0,1,0);be.DEFAULT_MATRIX_AUTO_UPDATE=!0;be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const pn=new R,Fn=new R,va=new R,On=new R,Zi=new R,Ki=new R,ou=new R,_a=new R,wa=new R,xa=new R,Ma=new de,ba=new de,Sa=new de;class an{constructor(t=new R,e=new R,n=new R){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),pn.subVectors(t,e),s.cross(pn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){pn.subVectors(s,e),Fn.subVectors(n,e),va.subVectors(t,e);const o=pn.dot(pn),a=pn.dot(Fn),c=pn.dot(va),l=Fn.dot(Fn),h=Fn.dot(va),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;const f=1/u,d=(l*c-a*h)*f,g=(o*h-a*c)*f;return r.set(1-d-g,g,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,On)===null?!1:On.x>=0&&On.y>=0&&On.x+On.y<=1}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,On)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,On.x),c.addScaledVector(o,On.y),c.addScaledVector(a,On.z),c)}static getInterpolatedAttribute(t,e,n,s,r,o){return Ma.setScalar(0),ba.setScalar(0),Sa.setScalar(0),Ma.fromBufferAttribute(t,e),ba.fromBufferAttribute(t,n),Sa.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Ma,r.x),o.addScaledVector(ba,r.y),o.addScaledVector(Sa,r.z),o}static isFrontFacing(t,e,n,s){return pn.subVectors(n,e),Fn.subVectors(t,e),pn.cross(Fn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return pn.subVectors(this.c,this.b),Fn.subVectors(this.a,this.b),pn.cross(Fn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return an.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return an.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return an.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return an.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return an.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;Zi.subVectors(s,n),Ki.subVectors(r,n),_a.subVectors(t,n);const c=Zi.dot(_a),l=Ki.dot(_a);if(c<=0&&l<=0)return e.copy(n);wa.subVectors(t,s);const h=Zi.dot(wa),u=Ki.dot(wa);if(h>=0&&u<=h)return e.copy(s);const f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(Zi,o);xa.subVectors(t,r);const d=Zi.dot(xa),g=Ki.dot(xa);if(g>=0&&d<=g)return e.copy(r);const y=d*l-c*g;if(y<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(Ki,a);const m=h*g-d*u;if(m<=0&&u-h>=0&&d-g>=0)return ou.subVectors(r,s),a=(u-h)/(u-h+(d-g)),e.copy(s).addScaledVector(ou,a);const p=1/(m+y+f);return o=y*p,a=f*p,e.copy(n).addScaledVector(Zi,o).addScaledVector(Ki,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const J0={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ii={h:0,s:0,l:0},Lr={h:0,s:0,l:0};function Ea(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class qt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=en){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,re.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=re.workingColorSpace){return this.r=t,this.g=e,this.b=n,re.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=re.workingColorSpace){if(t=ch(t,1),e=Te(e,0,1),n=Te(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Ea(o,r,t+1/3),this.g=Ea(o,r,t),this.b=Ea(o,r,t-1/3)}return re.toWorkingColorSpace(this,s),this}setStyle(t,e=en){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=en){const n=J0[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Yn(t.r),this.g=Yn(t.g),this.b=Yn(t.b),this}copyLinearToSRGB(t){return this.r=ms(t.r),this.g=ms(t.g),this.b=ms(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=en){return re.fromWorkingColorSpace(ze.copy(this),t),Math.round(Te(ze.r*255,0,255))*65536+Math.round(Te(ze.g*255,0,255))*256+Math.round(Te(ze.b*255,0,255))}getHexString(t=en){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=re.workingColorSpace){re.fromWorkingColorSpace(ze.copy(this),e);const n=ze.r,s=ze.g,r=ze.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=re.workingColorSpace){return re.fromWorkingColorSpace(ze.copy(this),e),t.r=ze.r,t.g=ze.g,t.b=ze.b,t}getStyle(t=en){re.fromWorkingColorSpace(ze.copy(this),t);const e=ze.r,n=ze.g,s=ze.b;return t!==en?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(ii),this.setHSL(ii.h+t,ii.s+e,ii.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ii),t.getHSL(Lr);const n=nr(ii.h,Lr.h,e),s=nr(ii.s,Lr.s,e),r=nr(ii.l,Lr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const ze=new qt;qt.NAMES=J0;let vg=0;class fi extends Ts{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:vg++}),this.uuid=Fi(),this.name="",this.blending=fs,this.side=ci,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Fc,this.blendDst=Oc,this.blendEquation=Ri,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qt(0,0,0),this.blendAlpha=0,this.depthFunc=gs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Gh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Hi,this.stencilZFail=Hi,this.stencilZPass=Hi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==fs&&(n.blending=this.blending),this.side!==ci&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Fc&&(n.blendSrc=this.blendSrc),this.blendDst!==Oc&&(n.blendDst=this.blendDst),this.blendEquation!==Ri&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==gs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Gh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Hi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Hi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Hi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class gr extends fi{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.combine=Ql,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ae=new R,Dr=new tt;class Ke{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Vh,this.updateRanges=[],this.gpuType=Wn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Dr.fromBufferAttribute(this,e),Dr.applyMatrix3(t),this.setXY(e,Dr.x,Dr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyMatrix3(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyMatrix4(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyNormalMatrix(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.transformDirection(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=as(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ge(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=as(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ge(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=as(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ge(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=as(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ge(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=as(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ge(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ge(e,this.array),n=Ge(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Ge(e,this.array),n=Ge(n,this.array),s=Ge(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Ge(e,this.array),n=Ge(n,this.array),s=Ge(s,this.array),r=Ge(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Vh&&(t.usage=this.usage),t}}class Q0 extends Ke{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class tf extends Ke{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class oe extends Ke{constructor(t,e,n){super(new Float32Array(t),e,n)}}let _g=0;const on=new fe,Aa=new be,ji=new R,Qe=new Ni,Fs=new Ni,Le=new R;class Ie extends Ts{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:_g++}),this.uuid=Fi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Z0(t)?tf:Q0)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new jt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return on.makeRotationFromQuaternion(t),this.applyMatrix4(on),this}rotateX(t){return on.makeRotationX(t),this.applyMatrix4(on),this}rotateY(t){return on.makeRotationY(t),this.applyMatrix4(on),this}rotateZ(t){return on.makeRotationZ(t),this.applyMatrix4(on),this}translate(t,e,n){return on.makeTranslation(t,e,n),this.applyMatrix4(on),this}scale(t,e,n){return on.makeScale(t,e,n),this.applyMatrix4(on),this}lookAt(t){return Aa.lookAt(t),Aa.updateMatrix(),this.applyMatrix4(Aa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ji).negate(),this.translate(ji.x,ji.y,ji.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new oe(n,3))}else{for(let n=0,s=e.count;n<s;n++){const r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ni);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Qe.setFromBufferAttribute(r),this.morphTargetsRelative?(Le.addVectors(this.boundingBox.min,Qe.min),this.boundingBox.expandByPoint(Le),Le.addVectors(this.boundingBox.max,Qe.max),this.boundingBox.expandByPoint(Le)):(this.boundingBox.expandByPoint(Qe.min),this.boundingBox.expandByPoint(Qe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Rs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(t){const n=this.boundingSphere.center;if(Qe.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];Fs.setFromBufferAttribute(a),this.morphTargetsRelative?(Le.addVectors(Qe.min,Fs.min),Qe.expandByPoint(Le),Le.addVectors(Qe.max,Fs.max),Qe.expandByPoint(Le)):(Qe.expandByPoint(Fs.min),Qe.expandByPoint(Fs.max))}Qe.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Le.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Le));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Le.fromBufferAttribute(a,l),c&&(ji.fromBufferAttribute(t,l),Le.add(ji)),s=Math.max(s,n.distanceToSquared(Le))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ke(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let A=0;A<n.count;A++)a[A]=new R,c[A]=new R;const l=new R,h=new R,u=new R,f=new tt,d=new tt,g=new tt,y=new R,m=new R;function p(A,x,b){l.fromBufferAttribute(n,A),h.fromBufferAttribute(n,x),u.fromBufferAttribute(n,b),f.fromBufferAttribute(r,A),d.fromBufferAttribute(r,x),g.fromBufferAttribute(r,b),h.sub(l),u.sub(l),d.sub(f),g.sub(f);const T=1/(d.x*g.y-g.x*d.y);isFinite(T)&&(y.copy(h).multiplyScalar(g.y).addScaledVector(u,-d.y).multiplyScalar(T),m.copy(u).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(T),a[A].add(y),a[x].add(y),a[b].add(y),c[A].add(m),c[x].add(m),c[b].add(m))}let _=this.groups;_.length===0&&(_=[{start:0,count:t.count}]);for(let A=0,x=_.length;A<x;++A){const b=_[A],T=b.start,P=b.count;for(let C=T,F=T+P;C<F;C+=3)p(t.getX(C+0),t.getX(C+1),t.getX(C+2))}const v=new R,w=new R,M=new R,S=new R;function E(A){M.fromBufferAttribute(s,A),S.copy(M);const x=a[A];v.copy(x),v.sub(M.multiplyScalar(M.dot(x))).normalize(),w.crossVectors(S,x);const T=w.dot(c[A])<0?-1:1;o.setXYZW(A,v.x,v.y,v.z,T)}for(let A=0,x=_.length;A<x;++A){const b=_[A],T=b.start,P=b.count;for(let C=T,F=T+P;C<F;C+=3)E(t.getX(C+0)),E(t.getX(C+1)),E(t.getX(C+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ke(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const s=new R,r=new R,o=new R,a=new R,c=new R,l=new R,h=new R,u=new R;if(t)for(let f=0,d=t.count;f<d;f+=3){const g=t.getX(f+0),y=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,y),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,y),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(y,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,d=e.count;f<d;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Le.fromBufferAttribute(t,e),Le.normalize(),t.setXYZ(e,Le.x,Le.y,Le.z)}toNonIndexed(){function t(a,c){const l=a.array,h=a.itemSize,u=a.normalized,f=new l.constructor(c.length*h);let d=0,g=0;for(let y=0,m=c.length;y<m;y++){a.isInterleavedBufferAttribute?d=c[y]*a.data.stride+a.offset:d=c[y]*h;for(let p=0;p<h;p++)f[g++]=l[d++]}return new Ke(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ie,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,n);e.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){const f=l[h],d=t(f,n);c.push(d)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){const d=l[u];h.push(d.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],u=r[l];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,h=o.length;l<h;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const au=new fe,vi=new mr,Nr=new Rs,cu=new R,Ur=new R,Fr=new R,Or=new R,Ta=new R,zr=new R,lu=new R,kr=new R;class ee extends be{constructor(t=new Ie,e=new gr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){zr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=a[c],u=r[c];h!==0&&(Ta.fromBufferAttribute(u,t),o?zr.addScaledVector(Ta,h):zr.addScaledVector(Ta.sub(e),h))}e.add(zr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Nr.copy(n.boundingSphere),Nr.applyMatrix4(r),vi.copy(t.ray).recast(t.near),!(Nr.containsPoint(vi.origin)===!1&&(vi.intersectSphere(Nr,cu)===null||vi.origin.distanceToSquared(cu)>(t.far-t.near)**2))&&(au.copy(r).invert(),vi.copy(t.ray).applyMatrix4(au),!(n.boundingBox!==null&&vi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,vi)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,y=f.length;g<y;g++){const m=f[g],p=o[m.materialIndex],_=Math.max(m.start,d.start),v=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let w=_,M=v;w<M;w+=3){const S=a.getX(w),E=a.getX(w+1),A=a.getX(w+2);s=Br(this,p,t,n,l,h,u,S,E,A),s&&(s.faceIndex=Math.floor(w/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),y=Math.min(a.count,d.start+d.count);for(let m=g,p=y;m<p;m+=3){const _=a.getX(m),v=a.getX(m+1),w=a.getX(m+2);s=Br(this,o,t,n,l,h,u,_,v,w),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,y=f.length;g<y;g++){const m=f[g],p=o[m.materialIndex],_=Math.max(m.start,d.start),v=Math.min(c.count,Math.min(m.start+m.count,d.start+d.count));for(let w=_,M=v;w<M;w+=3){const S=w,E=w+1,A=w+2;s=Br(this,p,t,n,l,h,u,S,E,A),s&&(s.faceIndex=Math.floor(w/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),y=Math.min(c.count,d.start+d.count);for(let m=g,p=y;m<p;m+=3){const _=m,v=m+1,w=m+2;s=Br(this,o,t,n,l,h,u,_,v,w),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function wg(i,t,e,n,s,r,o,a){let c;if(t.side===We?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===ci,a),c===null)return null;kr.copy(a),kr.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(kr);return l<e.near||l>e.far?null:{distance:l,point:kr.clone(),object:i}}function Br(i,t,e,n,s,r,o,a,c,l){i.getVertexPosition(a,Ur),i.getVertexPosition(c,Fr),i.getVertexPosition(l,Or);const h=wg(i,t,e,n,Ur,Fr,Or,lu);if(h){const u=new R;an.getBarycoord(lu,Ur,Fr,Or,u),s&&(h.uv=an.getInterpolatedAttribute(s,a,c,l,u,new tt)),r&&(h.uv1=an.getInterpolatedAttribute(r,a,c,l,u,new tt)),o&&(h.normal=an.getInterpolatedAttribute(o,a,c,l,u,new R),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a,b:c,c:l,normal:new R,materialIndex:0};an.getNormal(Ur,Fr,Or,f.normal),h.face=f,h.barycoord=u}return h}class G extends Ie{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],h=[],u=[];let f=0,d=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new oe(l,3)),this.setAttribute("normal",new oe(h,3)),this.setAttribute("uv",new oe(u,2));function g(y,m,p,_,v,w,M,S,E,A,x){const b=w/E,T=M/A,P=w/2,C=M/2,F=S/2,N=E+1,D=A+1;let B=0,H=0;const V=new R;for(let et=0;et<D;et++){const lt=et*T-C;for(let Mt=0;Mt<N;Mt++){const Lt=Mt*b-P;V[y]=Lt*_,V[m]=lt*v,V[p]=F,l.push(V.x,V.y,V.z),V[y]=0,V[m]=0,V[p]=S>0?1:-1,h.push(V.x,V.y,V.z),u.push(Mt/E),u.push(1-et/A),B+=1}}for(let et=0;et<A;et++)for(let lt=0;lt<E;lt++){const Mt=f+lt+N*et,Lt=f+lt+N*(et+1),J=f+(lt+1)+N*(et+1),ot=f+(lt+1)+N*et;c.push(Mt,Lt,ot),c.push(Lt,J,ot),H+=6}a.addGroup(d,H,x),d+=H,f+=B}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new G(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ms(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ve(i){const t={};for(let e=0;e<i.length;e++){const n=Ms(i[e]);for(const s in n)t[s]=n[s]}return t}function xg(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function ef(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:re.workingColorSpace}const Qo={clone:Ms,merge:Ve};var Mg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,bg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class sn extends fi{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Mg,this.fragmentShader=bg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ms(t.uniforms),this.uniformsGroups=xg(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class nf extends be{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new fe,this.projectionMatrix=new fe,this.projectionMatrixInverse=new fe,this.coordinateSystem=Xn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const si=new R,hu=new tt,uu=new tt;class $e extends nf{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=xs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(er*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return xs*2*Math.atan(Math.tan(er*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){si.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(si.x,si.y).multiplyScalar(-t/si.z),si.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(si.x,si.y).multiplyScalar(-t/si.z)}getViewSize(t,e){return this.getViewBounds(t,hu,uu),e.subVectors(uu,hu)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(er*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ji=-90,Qi=1;class Sg extends be{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new $e(Ji,Qi,t,e);s.layers=this.layers,this.add(s);const r=new $e(Ji,Qi,t,e);r.layers=this.layers,this.add(r);const o=new $e(Ji,Qi,t,e);o.layers=this.layers,this.add(o);const a=new $e(Ji,Qi,t,e);a.layers=this.layers,this.add(a);const c=new $e(Ji,Qi,t,e);c.layers=this.layers,this.add(c);const l=new $e(Ji,Qi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(const l of e)this.remove(l);if(t===Xn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Lo)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=y,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,f,d),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class sf extends Xe{constructor(t,e,n,s,r,o,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:ys,super(t,e,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Eg extends An{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new sf(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:nn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new G(5,5,5),r=new sn({name:"CubemapFromEquirect",uniforms:Ms(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:We,blending:qn});r.uniforms.tEquirect.value=e;const o=new ee(s,r),a=e.minFilter;return e.minFilter===oi&&(e.minFilter=nn),new Sg(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}const Ra=new R,Ag=new R,Tg=new jt;class ri{constructor(t=new R(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Ra.subVectors(n,e).cross(Ag.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Ra),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Tg.getNormalMatrix(t),s=this.coplanarPoint(Ra).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const _i=new Rs,Hr=new R;class lh{constructor(t=new ri,e=new ri,n=new ri,s=new ri,r=new ri,o=new ri){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Xn){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],c=s[3],l=s[4],h=s[5],u=s[6],f=s[7],d=s[8],g=s[9],y=s[10],m=s[11],p=s[12],_=s[13],v=s[14],w=s[15];if(n[0].setComponents(c-r,f-l,m-d,w-p).normalize(),n[1].setComponents(c+r,f+l,m+d,w+p).normalize(),n[2].setComponents(c+o,f+h,m+g,w+_).normalize(),n[3].setComponents(c-o,f-h,m-g,w-_).normalize(),n[4].setComponents(c-a,f-u,m-y,w-v).normalize(),e===Xn)n[5].setComponents(c+a,f+u,m+y,w+v).normalize();else if(e===Lo)n[5].setComponents(a,u,y,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),_i.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),_i.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(_i)}intersectsSprite(t){return _i.center.set(0,0,0),_i.radius=.7071067811865476,_i.applyMatrix4(t.matrixWorld),this.intersectsSphere(_i)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Hr.x=s.normal.x>0?t.max.x:t.min.x,Hr.y=s.normal.y>0?t.max.y:t.min.y,Hr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Hr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function rf(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Rg(i){const t=new WeakMap;function e(a,c){const l=a.array,h=a.usage,u=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,h),a.onUploadCallback();let d;if(l instanceof Float32Array)d=i.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=i.SHORT;else if(l instanceof Uint32Array)d=i.UNSIGNED_INT;else if(l instanceof Int32Array)d=i.INT;else if(l instanceof Int8Array)d=i.BYTE;else if(l instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){const h=c.array,u=c.updateRanges;if(i.bindBuffer(l,a),u.length===0)i.bufferSubData(l,0,h);else{u.sort((d,g)=>d.start-g.start);let f=0;for(let d=1;d<u.length;d++){const g=u[f],y=u[d];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++f,u[f]=y)}u.length=f+1;for(let d=0,g=u.length;d<g;d++){const y=u[d];i.bufferSubData(l,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}class hi extends Ie{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,u=t/a,f=e/c,d=[],g=[],y=[],m=[];for(let p=0;p<h;p++){const _=p*f-o;for(let v=0;v<l;v++){const w=v*u-r;g.push(w,-_,0),y.push(0,0,1),m.push(v/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let _=0;_<a;_++){const v=_+l*p,w=_+l*(p+1),M=_+1+l*(p+1),S=_+1+l*p;d.push(v,w,S),d.push(w,M,S)}this.setIndex(d),this.setAttribute("position",new oe(g,3)),this.setAttribute("normal",new oe(y,3)),this.setAttribute("uv",new oe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new hi(t.width,t.height,t.widthSegments,t.heightSegments)}}var Cg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Pg=`#ifdef USE_ALPHAHASH
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
#endif`,Ig=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Lg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Dg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ng=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ug=`#ifdef USE_AOMAP
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
#endif`,Fg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Og=`#ifdef USE_BATCHING
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
#endif`,zg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,kg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Bg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Hg=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Gg=`#ifdef USE_IRIDESCENCE
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
#endif`,Vg=`#ifdef USE_BUMPMAP
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
#endif`,Wg=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Xg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,qg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Yg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,$g=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Zg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Kg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,jg=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Jg=`#define PI 3.141592653589793
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
} // validated`,Qg=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,t1=`vec3 transformedNormal = objectNormal;
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
#endif`,e1=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,n1=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,i1=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,s1=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,r1="gl_FragColor = linearToOutputTexel( gl_FragColor );",o1=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,a1=`#ifdef USE_ENVMAP
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
#endif`,c1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,l1=`#ifdef USE_ENVMAP
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
#endif`,h1=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,u1=`#ifdef USE_ENVMAP
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
#endif`,d1=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,f1=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,p1=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,m1=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,g1=`#ifdef USE_GRADIENTMAP
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
}`,y1=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,v1=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,_1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,w1=`uniform bool receiveShadow;
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
#endif`,x1=`#ifdef USE_ENVMAP
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
#endif`,M1=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,b1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,S1=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,E1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,A1=`PhysicalMaterial material;
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
#endif`,T1=`struct PhysicalMaterial {
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
}`,R1=`
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
#endif`,C1=`#if defined( RE_IndirectDiffuse )
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
#endif`,P1=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,I1=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,L1=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,D1=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,N1=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,U1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,F1=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,O1=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,z1=`#if defined( USE_POINTS_UV )
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
#endif`,k1=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,B1=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,H1=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,G1=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,V1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,W1=`#ifdef USE_MORPHTARGETS
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
#endif`,X1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,q1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Y1=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,$1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Z1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,K1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,j1=`#ifdef USE_NORMALMAP
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
#endif`,J1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Q1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ty=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ey=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ny=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,iy=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,sy=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ry=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,oy=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ay=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,cy=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ly=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,hy=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,uy=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,dy=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,fy=`float getShadowMask() {
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
}`,py=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,my=`#ifdef USE_SKINNING
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
#endif`,gy=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,yy=`#ifdef USE_SKINNING
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
#endif`,vy=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,_y=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,wy=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,xy=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,My=`#ifdef USE_TRANSMISSION
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
#endif`,by=`#ifdef USE_TRANSMISSION
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
#endif`,Sy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ey=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ay=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ty=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Ry=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Cy=`uniform sampler2D t2D;
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
}`,Py=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Iy=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Ly=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Dy=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ny=`#include <common>
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
}`,Uy=`#if DEPTH_PACKING == 3200
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
}`,Fy=`#define DISTANCE
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
}`,Oy=`#define DISTANCE
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
}`,zy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ky=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,By=`uniform float scale;
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
}`,Hy=`uniform vec3 diffuse;
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
}`,Gy=`#include <common>
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
}`,Vy=`uniform vec3 diffuse;
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
}`,Wy=`#define LAMBERT
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
}`,Xy=`#define LAMBERT
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
}`,qy=`#define MATCAP
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
}`,Yy=`#define MATCAP
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
}`,$y=`#define NORMAL
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
}`,Zy=`#define NORMAL
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
}`,Ky=`#define PHONG
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
}`,jy=`#define PHONG
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
}`,Jy=`#define STANDARD
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
}`,Qy=`#define STANDARD
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
}`,tv=`#define TOON
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
}`,ev=`#define TOON
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
}`,nv=`uniform float size;
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
}`,iv=`uniform vec3 diffuse;
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
}`,sv=`#include <common>
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
}`,rv=`uniform vec3 color;
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
}`,ov=`uniform float rotation;
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
}`,av=`uniform vec3 diffuse;
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
}`,Qt={alphahash_fragment:Cg,alphahash_pars_fragment:Pg,alphamap_fragment:Ig,alphamap_pars_fragment:Lg,alphatest_fragment:Dg,alphatest_pars_fragment:Ng,aomap_fragment:Ug,aomap_pars_fragment:Fg,batching_pars_vertex:Og,batching_vertex:zg,begin_vertex:kg,beginnormal_vertex:Bg,bsdfs:Hg,iridescence_fragment:Gg,bumpmap_pars_fragment:Vg,clipping_planes_fragment:Wg,clipping_planes_pars_fragment:Xg,clipping_planes_pars_vertex:qg,clipping_planes_vertex:Yg,color_fragment:$g,color_pars_fragment:Zg,color_pars_vertex:Kg,color_vertex:jg,common:Jg,cube_uv_reflection_fragment:Qg,defaultnormal_vertex:t1,displacementmap_pars_vertex:e1,displacementmap_vertex:n1,emissivemap_fragment:i1,emissivemap_pars_fragment:s1,colorspace_fragment:r1,colorspace_pars_fragment:o1,envmap_fragment:a1,envmap_common_pars_fragment:c1,envmap_pars_fragment:l1,envmap_pars_vertex:h1,envmap_physical_pars_fragment:x1,envmap_vertex:u1,fog_vertex:d1,fog_pars_vertex:f1,fog_fragment:p1,fog_pars_fragment:m1,gradientmap_pars_fragment:g1,lightmap_pars_fragment:y1,lights_lambert_fragment:v1,lights_lambert_pars_fragment:_1,lights_pars_begin:w1,lights_toon_fragment:M1,lights_toon_pars_fragment:b1,lights_phong_fragment:S1,lights_phong_pars_fragment:E1,lights_physical_fragment:A1,lights_physical_pars_fragment:T1,lights_fragment_begin:R1,lights_fragment_maps:C1,lights_fragment_end:P1,logdepthbuf_fragment:I1,logdepthbuf_pars_fragment:L1,logdepthbuf_pars_vertex:D1,logdepthbuf_vertex:N1,map_fragment:U1,map_pars_fragment:F1,map_particle_fragment:O1,map_particle_pars_fragment:z1,metalnessmap_fragment:k1,metalnessmap_pars_fragment:B1,morphinstance_vertex:H1,morphcolor_vertex:G1,morphnormal_vertex:V1,morphtarget_pars_vertex:W1,morphtarget_vertex:X1,normal_fragment_begin:q1,normal_fragment_maps:Y1,normal_pars_fragment:$1,normal_pars_vertex:Z1,normal_vertex:K1,normalmap_pars_fragment:j1,clearcoat_normal_fragment_begin:J1,clearcoat_normal_fragment_maps:Q1,clearcoat_pars_fragment:ty,iridescence_pars_fragment:ey,opaque_fragment:ny,packing:iy,premultiplied_alpha_fragment:sy,project_vertex:ry,dithering_fragment:oy,dithering_pars_fragment:ay,roughnessmap_fragment:cy,roughnessmap_pars_fragment:ly,shadowmap_pars_fragment:hy,shadowmap_pars_vertex:uy,shadowmap_vertex:dy,shadowmask_pars_fragment:fy,skinbase_vertex:py,skinning_pars_vertex:my,skinning_vertex:gy,skinnormal_vertex:yy,specularmap_fragment:vy,specularmap_pars_fragment:_y,tonemapping_fragment:wy,tonemapping_pars_fragment:xy,transmission_fragment:My,transmission_pars_fragment:by,uv_pars_fragment:Sy,uv_pars_vertex:Ey,uv_vertex:Ay,worldpos_vertex:Ty,background_vert:Ry,background_frag:Cy,backgroundCube_vert:Py,backgroundCube_frag:Iy,cube_vert:Ly,cube_frag:Dy,depth_vert:Ny,depth_frag:Uy,distanceRGBA_vert:Fy,distanceRGBA_frag:Oy,equirect_vert:zy,equirect_frag:ky,linedashed_vert:By,linedashed_frag:Hy,meshbasic_vert:Gy,meshbasic_frag:Vy,meshlambert_vert:Wy,meshlambert_frag:Xy,meshmatcap_vert:qy,meshmatcap_frag:Yy,meshnormal_vert:$y,meshnormal_frag:Zy,meshphong_vert:Ky,meshphong_frag:jy,meshphysical_vert:Jy,meshphysical_frag:Qy,meshtoon_vert:tv,meshtoon_frag:ev,points_vert:nv,points_frag:iv,shadow_vert:sv,shadow_frag:rv,sprite_vert:ov,sprite_frag:av},St={common:{diffuse:{value:new qt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new jt}},envmap:{envMap:{value:null},envMapRotation:{value:new jt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new jt},normalScale:{value:new tt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new qt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0},uvTransform:{value:new jt}},sprite:{diffuse:{value:new qt(16777215)},opacity:{value:1},center:{value:new tt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}}},wn={basic:{uniforms:Ve([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.fog]),vertexShader:Qt.meshbasic_vert,fragmentShader:Qt.meshbasic_frag},lambert:{uniforms:Ve([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new qt(0)}}]),vertexShader:Qt.meshlambert_vert,fragmentShader:Qt.meshlambert_frag},phong:{uniforms:Ve([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new qt(0)},specular:{value:new qt(1118481)},shininess:{value:30}}]),vertexShader:Qt.meshphong_vert,fragmentShader:Qt.meshphong_frag},standard:{uniforms:Ve([St.common,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.roughnessmap,St.metalnessmap,St.fog,St.lights,{emissive:{value:new qt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag},toon:{uniforms:Ve([St.common,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.gradientmap,St.fog,St.lights,{emissive:{value:new qt(0)}}]),vertexShader:Qt.meshtoon_vert,fragmentShader:Qt.meshtoon_frag},matcap:{uniforms:Ve([St.common,St.bumpmap,St.normalmap,St.displacementmap,St.fog,{matcap:{value:null}}]),vertexShader:Qt.meshmatcap_vert,fragmentShader:Qt.meshmatcap_frag},points:{uniforms:Ve([St.points,St.fog]),vertexShader:Qt.points_vert,fragmentShader:Qt.points_frag},dashed:{uniforms:Ve([St.common,St.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Qt.linedashed_vert,fragmentShader:Qt.linedashed_frag},depth:{uniforms:Ve([St.common,St.displacementmap]),vertexShader:Qt.depth_vert,fragmentShader:Qt.depth_frag},normal:{uniforms:Ve([St.common,St.bumpmap,St.normalmap,St.displacementmap,{opacity:{value:1}}]),vertexShader:Qt.meshnormal_vert,fragmentShader:Qt.meshnormal_frag},sprite:{uniforms:Ve([St.sprite,St.fog]),vertexShader:Qt.sprite_vert,fragmentShader:Qt.sprite_frag},background:{uniforms:{uvTransform:{value:new jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Qt.background_vert,fragmentShader:Qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new jt}},vertexShader:Qt.backgroundCube_vert,fragmentShader:Qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Qt.cube_vert,fragmentShader:Qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Qt.equirect_vert,fragmentShader:Qt.equirect_frag},distanceRGBA:{uniforms:Ve([St.common,St.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Qt.distanceRGBA_vert,fragmentShader:Qt.distanceRGBA_frag},shadow:{uniforms:Ve([St.lights,St.fog,{color:{value:new qt(0)},opacity:{value:1}}]),vertexShader:Qt.shadow_vert,fragmentShader:Qt.shadow_frag}};wn.physical={uniforms:Ve([wn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new jt},clearcoatNormalScale:{value:new tt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new jt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new jt},sheen:{value:0},sheenColor:{value:new qt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new jt},transmissionSamplerSize:{value:new tt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new jt},attenuationDistance:{value:0},attenuationColor:{value:new qt(0)},specularColor:{value:new qt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new jt},anisotropyVector:{value:new tt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new jt}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag};const Gr={r:0,b:0,g:0},wi=new Tn,cv=new fe;function lv(i,t,e,n,s,r,o){const a=new qt(0);let c=r===!0?0:1,l,h,u=null,f=0,d=null;function g(_){let v=_.isScene===!0?_.background:null;return v&&v.isTexture&&(v=(_.backgroundBlurriness>0?e:t).get(v)),v}function y(_){let v=!1;const w=g(_);w===null?p(a,c):w&&w.isColor&&(p(w,1),v=!0);const M=i.xr.getEnvironmentBlendMode();M==="additive"?n.buffers.color.setClear(0,0,0,1,o):M==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(_,v){const w=g(v);w&&(w.isCubeTexture||w.mapping===Ko)?(h===void 0&&(h=new ee(new G(1,1,1),new sn({name:"BackgroundCubeMaterial",uniforms:Ms(wn.backgroundCube.uniforms),vertexShader:wn.backgroundCube.vertexShader,fragmentShader:wn.backgroundCube.fragmentShader,side:We,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(M,S,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),wi.copy(v.backgroundRotation),wi.x*=-1,wi.y*=-1,wi.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(wi.y*=-1,wi.z*=-1),h.material.uniforms.envMap.value=w,h.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(cv.makeRotationFromEuler(wi)),h.material.toneMapped=re.getTransfer(w.colorSpace)!==ue,(u!==w||f!==w.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,u=w,f=w.version,d=i.toneMapping),h.layers.enableAll(),_.unshift(h,h.geometry,h.material,0,0,null)):w&&w.isTexture&&(l===void 0&&(l=new ee(new hi(2,2),new sn({name:"BackgroundMaterial",uniforms:Ms(wn.background.uniforms),vertexShader:wn.background.vertexShader,fragmentShader:wn.background.fragmentShader,side:ci,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=w,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=re.getTransfer(w.colorSpace)!==ue,w.matrixAutoUpdate===!0&&w.updateMatrix(),l.material.uniforms.uvTransform.value.copy(w.matrix),(u!==w||f!==w.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,u=w,f=w.version,d=i.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null))}function p(_,v){_.getRGB(Gr,ef(i)),n.buffers.color.setClear(Gr.r,Gr.g,Gr.b,v,o)}return{getClearColor:function(){return a},setClearColor:function(_,v=1){a.set(_),c=v,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(_){c=_,p(a,c)},render:y,addToRenderList:m}}function hv(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,o=!1;function a(b,T,P,C,F){let N=!1;const D=u(C,P,T);r!==D&&(r=D,l(r.object)),N=d(b,C,P,F),N&&g(b,C,P,F),F!==null&&t.update(F,i.ELEMENT_ARRAY_BUFFER),(N||o)&&(o=!1,w(b,T,P,C),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(F).buffer))}function c(){return i.createVertexArray()}function l(b){return i.bindVertexArray(b)}function h(b){return i.deleteVertexArray(b)}function u(b,T,P){const C=P.wireframe===!0;let F=n[b.id];F===void 0&&(F={},n[b.id]=F);let N=F[T.id];N===void 0&&(N={},F[T.id]=N);let D=N[C];return D===void 0&&(D=f(c()),N[C]=D),D}function f(b){const T=[],P=[],C=[];for(let F=0;F<e;F++)T[F]=0,P[F]=0,C[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:T,enabledAttributes:P,attributeDivisors:C,object:b,attributes:{},index:null}}function d(b,T,P,C){const F=r.attributes,N=T.attributes;let D=0;const B=P.getAttributes();for(const H in B)if(B[H].location>=0){const et=F[H];let lt=N[H];if(lt===void 0&&(H==="instanceMatrix"&&b.instanceMatrix&&(lt=b.instanceMatrix),H==="instanceColor"&&b.instanceColor&&(lt=b.instanceColor)),et===void 0||et.attribute!==lt||lt&&et.data!==lt.data)return!0;D++}return r.attributesNum!==D||r.index!==C}function g(b,T,P,C){const F={},N=T.attributes;let D=0;const B=P.getAttributes();for(const H in B)if(B[H].location>=0){let et=N[H];et===void 0&&(H==="instanceMatrix"&&b.instanceMatrix&&(et=b.instanceMatrix),H==="instanceColor"&&b.instanceColor&&(et=b.instanceColor));const lt={};lt.attribute=et,et&&et.data&&(lt.data=et.data),F[H]=lt,D++}r.attributes=F,r.attributesNum=D,r.index=C}function y(){const b=r.newAttributes;for(let T=0,P=b.length;T<P;T++)b[T]=0}function m(b){p(b,0)}function p(b,T){const P=r.newAttributes,C=r.enabledAttributes,F=r.attributeDivisors;P[b]=1,C[b]===0&&(i.enableVertexAttribArray(b),C[b]=1),F[b]!==T&&(i.vertexAttribDivisor(b,T),F[b]=T)}function _(){const b=r.newAttributes,T=r.enabledAttributes;for(let P=0,C=T.length;P<C;P++)T[P]!==b[P]&&(i.disableVertexAttribArray(P),T[P]=0)}function v(b,T,P,C,F,N,D){D===!0?i.vertexAttribIPointer(b,T,P,F,N):i.vertexAttribPointer(b,T,P,C,F,N)}function w(b,T,P,C){y();const F=C.attributes,N=P.getAttributes(),D=T.defaultAttributeValues;for(const B in N){const H=N[B];if(H.location>=0){let V=F[B];if(V===void 0&&(B==="instanceMatrix"&&b.instanceMatrix&&(V=b.instanceMatrix),B==="instanceColor"&&b.instanceColor&&(V=b.instanceColor)),V!==void 0){const et=V.normalized,lt=V.itemSize,Mt=t.get(V);if(Mt===void 0)continue;const Lt=Mt.buffer,J=Mt.type,ot=Mt.bytesPerElement,K=J===i.INT||J===i.UNSIGNED_INT||V.gpuType===th;if(V.isInterleavedBufferAttribute){const Y=V.data,rt=Y.stride,pt=V.offset;if(Y.isInstancedInterleavedBuffer){for(let wt=0;wt<H.locationSize;wt++)p(H.location+wt,Y.meshPerAttribute);b.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let wt=0;wt<H.locationSize;wt++)m(H.location+wt);i.bindBuffer(i.ARRAY_BUFFER,Lt);for(let wt=0;wt<H.locationSize;wt++)v(H.location+wt,lt/H.locationSize,J,et,rt*ot,(pt+lt/H.locationSize*wt)*ot,K)}else{if(V.isInstancedBufferAttribute){for(let Y=0;Y<H.locationSize;Y++)p(H.location+Y,V.meshPerAttribute);b.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=V.meshPerAttribute*V.count)}else for(let Y=0;Y<H.locationSize;Y++)m(H.location+Y);i.bindBuffer(i.ARRAY_BUFFER,Lt);for(let Y=0;Y<H.locationSize;Y++)v(H.location+Y,lt/H.locationSize,J,et,lt*ot,lt/H.locationSize*Y*ot,K)}}else if(D!==void 0){const et=D[B];if(et!==void 0)switch(et.length){case 2:i.vertexAttrib2fv(H.location,et);break;case 3:i.vertexAttrib3fv(H.location,et);break;case 4:i.vertexAttrib4fv(H.location,et);break;default:i.vertexAttrib1fv(H.location,et)}}}}_()}function M(){A();for(const b in n){const T=n[b];for(const P in T){const C=T[P];for(const F in C)h(C[F].object),delete C[F];delete T[P]}delete n[b]}}function S(b){if(n[b.id]===void 0)return;const T=n[b.id];for(const P in T){const C=T[P];for(const F in C)h(C[F].object),delete C[F];delete T[P]}delete n[b.id]}function E(b){for(const T in n){const P=n[T];if(P[b.id]===void 0)continue;const C=P[b.id];for(const F in C)h(C[F].object),delete C[F];delete P[b.id]}}function A(){x(),o=!0,r!==s&&(r=s,l(r.object))}function x(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:A,resetDefaultState:x,dispose:M,releaseStatesOfGeometry:S,releaseStatesOfProgram:E,initAttributes:y,enableAttribute:m,disableUnusedAttributes:_}}function uv(i,t,e){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function o(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function a(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let d=0;for(let g=0;g<u;g++)d+=h[g];e.update(d,n,1)}function c(l,h,u,f){if(u===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<l.length;g++)o(l[g],h[g],f[g]);else{d.multiDrawArraysInstancedWEBGL(n,l,0,h,0,f,0,u);let g=0;for(let y=0;y<u;y++)g+=h[y]*f[y];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function dv(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(E){return!(E!==cn&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(E){const A=E===li&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==En&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==Wn&&!A)}function c(E){if(E==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,f=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),_=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),w=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),M=g>0,S=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:f,maxTextures:d,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:_,maxVaryings:v,maxFragmentUniforms:w,vertexTextures:M,maxSamples:S}}function fv(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new ri,a=new jt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||n!==0||s;return s=f,n=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,d){const g=u.clippingPlanes,y=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):l();else{const _=r?0:n,v=_*4;let w=p.clippingState||null;c.value=w,w=h(g,f,v,d);for(let M=0;M!==v;++M)w[M]=e[M];p.clippingState=w,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=_}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,d,g){const y=u!==null?u.length:0;let m=null;if(y!==0){if(m=c.value,g!==!0||m===null){const p=d+y*4,_=f.matrixWorldInverse;a.getNormalMatrix(_),(m===null||m.length<p)&&(m=new Float32Array(p));for(let v=0,w=d;v!==y;++v,w+=4)o.copy(u[v]).applyMatrix4(_,a),o.normal.toArray(m,w),m[w+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,m}}function pv(i){let t=new WeakMap;function e(o,a){return a===Xc?o.mapping=ys:a===qc&&(o.mapping=vs),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Xc||a===qc)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new Eg(c.height);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class hh extends nf{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const ls=4,du=[.125,.215,.35,.446,.526,.582],Ci=20,Ca=new hh,fu=new qt;let Pa=null,Ia=0,La=0,Da=!1;const Ti=(1+Math.sqrt(5))/2,ts=1/Ti,pu=[new R(-Ti,ts,0),new R(Ti,ts,0),new R(-ts,0,Ti),new R(ts,0,Ti),new R(0,Ti,-ts),new R(0,Ti,ts),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)];class mu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Pa=this._renderer.getRenderTarget(),Ia=this._renderer.getActiveCubeFace(),La=this._renderer.getActiveMipmapLevel(),Da=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=vu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=yu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Pa,Ia,La),this._renderer.xr.enabled=Da,t.scissorTest=!1,Vr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ys||t.mapping===vs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Pa=this._renderer.getRenderTarget(),Ia=this._renderer.getActiveCubeFace(),La=this._renderer.getActiveMipmapLevel(),Da=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:nn,minFilter:nn,generateMipmaps:!1,type:li,format:cn,colorSpace:As,depthBuffer:!1},s=gu(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=gu(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=mv(r)),this._blurMaterial=gv(r,t,e)}return s}_compileMaterial(t){const e=new ee(this._lodPlanes[0],t);this._renderer.compile(e,Ca)}_sceneToCubeUV(t,e,n,s){const a=new $e(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(fu),h.toneMapping=ai,h.autoClear=!1;const d=new gr({name:"PMREM.Background",side:We,depthWrite:!1,depthTest:!1}),g=new ee(new G,d);let y=!1;const m=t.background;m?m.isColor&&(d.color.copy(m),t.background=null,y=!0):(d.color.copy(fu),y=!0);for(let p=0;p<6;p++){const _=p%3;_===0?(a.up.set(0,c[p],0),a.lookAt(l[p],0,0)):_===1?(a.up.set(0,0,c[p]),a.lookAt(0,l[p],0)):(a.up.set(0,c[p],0),a.lookAt(0,0,l[p]));const v=this._cubeSize;Vr(s,_*v,p>2?v:0,v,v),h.setRenderTarget(s),y&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===ys||t.mapping===vs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=vu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=yu());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new ee(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const c=this._cubeSize;Vr(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,Ca)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=pu[(s-r-1)%pu.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new ee(this._lodPlanes[s],l),f=l.uniforms,d=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*Ci-1),y=r/g,m=isFinite(r)?1+Math.floor(h*y):Ci;m>Ci&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ci}`);const p=[];let _=0;for(let E=0;E<Ci;++E){const A=E/y,x=Math.exp(-A*A/2);p.push(x),E===0?_+=x:E<m&&(_+=2*x)}for(let E=0;E<p.length;E++)p[E]=p[E]/_;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:v}=this;f.dTheta.value=g,f.mipInt.value=v-n;const w=this._sizeLods[s],M=3*w*(s>v-ls?s-v+ls:0),S=4*(this._cubeSize-w);Vr(e,M,S,3*w,2*w),c.setRenderTarget(e),c.render(u,Ca)}}function mv(i){const t=[],e=[],n=[];let s=i;const r=i-ls+1+du.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let c=1/a;o>i-ls?c=du[o-i+ls-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,g=6,y=3,m=2,p=1,_=new Float32Array(y*g*d),v=new Float32Array(m*g*d),w=new Float32Array(p*g*d);for(let S=0;S<d;S++){const E=S%3*2/3-1,A=S>2?0:-1,x=[E,A,0,E+2/3,A,0,E+2/3,A+1,0,E,A,0,E+2/3,A+1,0,E,A+1,0];_.set(x,y*g*S),v.set(f,m*g*S);const b=[S,S,S,S,S,S];w.set(b,p*g*S)}const M=new Ie;M.setAttribute("position",new Ke(_,y)),M.setAttribute("uv",new Ke(v,m)),M.setAttribute("faceIndex",new Ke(w,p)),t.push(M),s>ls&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function gu(i,t,e){const n=new An(i,t,e);return n.texture.mapping=Ko,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Vr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function gv(i,t,e){const n=new Float32Array(Ci),s=new R(0,1,0);return new sn({name:"SphericalGaussianBlur",defines:{n:Ci,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:uh(),fragmentShader:`

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
		`,blending:qn,depthTest:!1,depthWrite:!1})}function yu(){return new sn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:uh(),fragmentShader:`

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
		`,blending:qn,depthTest:!1,depthWrite:!1})}function vu(){return new sn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:uh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:qn,depthTest:!1,depthWrite:!1})}function uh(){return`

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
	`}function yv(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===Xc||c===qc,h=c===ys||c===vs;if(l||h){let u=t.get(a);const f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return e===null&&(e=new mu(i)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{const d=a.image;return l&&d&&d.height>0||h&&d&&s(d)?(e===null&&(e=new mu(i)),u=l?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function vv(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Qs("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function _v(i,t,e,n){const s={},r=new WeakMap;function o(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);for(const g in f.morphAttributes){const y=f.morphAttributes[g];for(let m=0,p=y.length;m<p;m++)t.remove(y[m])}f.removeEventListener("dispose",o),delete s[f.id];const d=r.get(f);d&&(t.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const g in f)t.update(f[g],i.ARRAY_BUFFER);const d=u.morphAttributes;for(const g in d){const y=d[g];for(let m=0,p=y.length;m<p;m++)t.update(y[m],i.ARRAY_BUFFER)}}function l(u){const f=[],d=u.index,g=u.attributes.position;let y=0;if(d!==null){const _=d.array;y=d.version;for(let v=0,w=_.length;v<w;v+=3){const M=_[v+0],S=_[v+1],E=_[v+2];f.push(M,S,S,E,E,M)}}else if(g!==void 0){const _=g.array;y=g.version;for(let v=0,w=_.length/3-1;v<w;v+=3){const M=v+0,S=v+1,E=v+2;f.push(M,S,S,E,E,M)}}else return;const m=new(Z0(f)?tf:Q0)(f,1);m.version=y;const p=r.get(u);p&&t.remove(p),r.set(u,m)}function h(u){const f=r.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function wv(i,t,e){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function c(f,d){i.drawElements(n,d,r,f*o),e.update(d,n,1)}function l(f,d,g){g!==0&&(i.drawElementsInstanced(n,d,r,f*o,g),e.update(d,n,g))}function h(f,d,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,f,0,g);let m=0;for(let p=0;p<g;p++)m+=d[p];e.update(m,n,1)}function u(f,d,g,y){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)l(f[p]/o,d[p],y[p]);else{m.multiDrawElementsInstancedWEBGL(n,d,0,r,f,0,y,0,g);let p=0;for(let _=0;_<g;_++)p+=d[_]*y[_];e.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function xv(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Mv(i,t,e){const n=new WeakMap,s=new de;function r(o,a,c){const l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let f=n.get(a);if(f===void 0||f.count!==u){let x=function(){E.dispose(),n.delete(a),a.removeEventListener("dispose",x)};f!==void 0&&f.texture.dispose();const d=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,y=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],_=a.morphAttributes.color||[];let v=0;d===!0&&(v=1),g===!0&&(v=2),y===!0&&(v=3);let w=a.attributes.position.count*v,M=1;w>t.maxTextureSize&&(M=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const S=new Float32Array(w*M*4*u),E=new j0(S,w,M,u);E.type=Wn,E.needsUpdate=!0;const A=v*4;for(let b=0;b<u;b++){const T=m[b],P=p[b],C=_[b],F=w*M*4*b;for(let N=0;N<T.count;N++){const D=N*A;d===!0&&(s.fromBufferAttribute(T,N),S[F+D+0]=s.x,S[F+D+1]=s.y,S[F+D+2]=s.z,S[F+D+3]=0),g===!0&&(s.fromBufferAttribute(P,N),S[F+D+4]=s.x,S[F+D+5]=s.y,S[F+D+6]=s.z,S[F+D+7]=0),y===!0&&(s.fromBufferAttribute(C,N),S[F+D+8]=s.x,S[F+D+9]=s.y,S[F+D+10]=s.z,S[F+D+11]=C.itemSize===4?s.w:1)}}f={count:u,texture:E,size:new tt(w,M)},n.set(a,f),a.addEventListener("dispose",x)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let d=0;for(let y=0;y<l.length;y++)d+=l[y];const g=a.morphTargetsRelative?1:1-d;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function bv(i,t,e,n){let s=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function o(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}class dh extends Xe{constructor(t,e,n,s,r,o,a,c,l,h=ps){if(h!==ps&&h!==ws)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===ps&&(n=Di),n===void 0&&h===ws&&(n=_s),super(null,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Ue,this.minFilter=c!==void 0?c:Ue,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const of=new Xe,_u=new dh(1,1),af=new j0,cf=new hg,lf=new sf,wu=[],xu=[],Mu=new Float32Array(16),bu=new Float32Array(9),Su=new Float32Array(4);function Cs(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=wu[s];if(r===void 0&&(r=new Float32Array(s),wu[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Ce(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Pe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function ta(i,t){let e=xu[t];e===void 0&&(e=new Int32Array(t),xu[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Sv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Ev(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;i.uniform2fv(this.addr,t),Pe(e,t)}}function Av(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ce(e,t))return;i.uniform3fv(this.addr,t),Pe(e,t)}}function Tv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;i.uniform4fv(this.addr,t),Pe(e,t)}}function Rv(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ce(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Pe(e,t)}else{if(Ce(e,n))return;Su.set(n),i.uniformMatrix2fv(this.addr,!1,Su),Pe(e,n)}}function Cv(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ce(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Pe(e,t)}else{if(Ce(e,n))return;bu.set(n),i.uniformMatrix3fv(this.addr,!1,bu),Pe(e,n)}}function Pv(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ce(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Pe(e,t)}else{if(Ce(e,n))return;Mu.set(n),i.uniformMatrix4fv(this.addr,!1,Mu),Pe(e,n)}}function Iv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Lv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;i.uniform2iv(this.addr,t),Pe(e,t)}}function Dv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ce(e,t))return;i.uniform3iv(this.addr,t),Pe(e,t)}}function Nv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;i.uniform4iv(this.addr,t),Pe(e,t)}}function Uv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Fv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;i.uniform2uiv(this.addr,t),Pe(e,t)}}function Ov(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ce(e,t))return;i.uniform3uiv(this.addr,t),Pe(e,t)}}function zv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;i.uniform4uiv(this.addr,t),Pe(e,t)}}function kv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(_u.compareFunction=$0,r=_u):r=of,e.setTexture2D(t||r,s)}function Bv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||cf,s)}function Hv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||lf,s)}function Gv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||af,s)}function Vv(i){switch(i){case 5126:return Sv;case 35664:return Ev;case 35665:return Av;case 35666:return Tv;case 35674:return Rv;case 35675:return Cv;case 35676:return Pv;case 5124:case 35670:return Iv;case 35667:case 35671:return Lv;case 35668:case 35672:return Dv;case 35669:case 35673:return Nv;case 5125:return Uv;case 36294:return Fv;case 36295:return Ov;case 36296:return zv;case 35678:case 36198:case 36298:case 36306:case 35682:return kv;case 35679:case 36299:case 36307:return Bv;case 35680:case 36300:case 36308:case 36293:return Hv;case 36289:case 36303:case 36311:case 36292:return Gv}}function Wv(i,t){i.uniform1fv(this.addr,t)}function Xv(i,t){const e=Cs(t,this.size,2);i.uniform2fv(this.addr,e)}function qv(i,t){const e=Cs(t,this.size,3);i.uniform3fv(this.addr,e)}function Yv(i,t){const e=Cs(t,this.size,4);i.uniform4fv(this.addr,e)}function $v(i,t){const e=Cs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Zv(i,t){const e=Cs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Kv(i,t){const e=Cs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function jv(i,t){i.uniform1iv(this.addr,t)}function Jv(i,t){i.uniform2iv(this.addr,t)}function Qv(i,t){i.uniform3iv(this.addr,t)}function t_(i,t){i.uniform4iv(this.addr,t)}function e_(i,t){i.uniform1uiv(this.addr,t)}function n_(i,t){i.uniform2uiv(this.addr,t)}function i_(i,t){i.uniform3uiv(this.addr,t)}function s_(i,t){i.uniform4uiv(this.addr,t)}function r_(i,t,e){const n=this.cache,s=t.length,r=ta(e,s);Ce(n,r)||(i.uniform1iv(this.addr,r),Pe(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||of,r[o])}function o_(i,t,e){const n=this.cache,s=t.length,r=ta(e,s);Ce(n,r)||(i.uniform1iv(this.addr,r),Pe(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||cf,r[o])}function a_(i,t,e){const n=this.cache,s=t.length,r=ta(e,s);Ce(n,r)||(i.uniform1iv(this.addr,r),Pe(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||lf,r[o])}function c_(i,t,e){const n=this.cache,s=t.length,r=ta(e,s);Ce(n,r)||(i.uniform1iv(this.addr,r),Pe(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||af,r[o])}function l_(i){switch(i){case 5126:return Wv;case 35664:return Xv;case 35665:return qv;case 35666:return Yv;case 35674:return $v;case 35675:return Zv;case 35676:return Kv;case 5124:case 35670:return jv;case 35667:case 35671:return Jv;case 35668:case 35672:return Qv;case 35669:case 35673:return t_;case 5125:return e_;case 36294:return n_;case 36295:return i_;case 36296:return s_;case 35678:case 36198:case 36298:case 36306:case 35682:return r_;case 35679:case 36299:case 36307:return o_;case 35680:case 36300:case 36308:case 36293:return a_;case 36289:case 36303:case 36311:case 36292:return c_}}class h_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Vv(e.type)}}class u_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=l_(e.type)}}class d_{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const Na=/(\w+)(\])?(\[|\.)?/g;function Eu(i,t){i.seq.push(t),i.map[t.id]=t}function f_(i,t,e){const n=i.name,s=n.length;for(Na.lastIndex=0;;){const r=Na.exec(n),o=Na.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){Eu(e,l===void 0?new h_(a,i,t):new u_(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new d_(a),Eu(e,u)),e=u}}}class Co{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);f_(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function Au(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const p_=37297;let m_=0;function g_(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const Tu=new jt;function y_(i){re._getMatrix(Tu,re.workingColorSpace,i);const t=`mat3( ${Tu.elements.map(e=>e.toFixed(4))} )`;switch(re.getTransfer(i)){case jo:return[t,"LinearTransferOETF"];case ue:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Ru(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+g_(i.getShaderSource(t),o)}else return s}function v_(i,t){const e=y_(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function __(i,t){let e;switch(t){case I0:e="Linear";break;case L0:e="Reinhard";break;case D0:e="Cineon";break;case N0:e="ACESFilmic";break;case U0:e="AgX";break;case F0:e="Neutral";break;case Rm:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Wr=new R;function w_(){re.getLuminanceCoefficients(Wr);const i=Wr.x.toFixed(4),t=Wr.y.toFixed(4),e=Wr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function x_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(tr).join(`
`)}function M_(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function b_(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function tr(i){return i!==""}function Cu(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Pu(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const S_=/^[ \t]*#include +<([\w\d./]+)>/gm;function wl(i){return i.replace(S_,A_)}const E_=new Map;function A_(i,t){let e=Qt[t];if(e===void 0){const n=E_.get(t);if(n!==void 0)e=Qt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return wl(e)}const T_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Iu(i){return i.replace(T_,R_)}function R_(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Lu(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function C_(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===C0?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===P0?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Bn&&(t="SHADOWMAP_TYPE_VSM"),t}function P_(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ys:case vs:t="ENVMAP_TYPE_CUBE";break;case Ko:t="ENVMAP_TYPE_CUBE_UV";break}return t}function I_(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case vs:t="ENVMAP_MODE_REFRACTION";break}return t}function L_(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ql:t="ENVMAP_BLENDING_MULTIPLY";break;case Am:t="ENVMAP_BLENDING_MIX";break;case Tm:t="ENVMAP_BLENDING_ADD";break}return t}function D_(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function N_(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=C_(e),l=P_(e),h=I_(e),u=L_(e),f=D_(e),d=x_(e),g=M_(r),y=s.createProgram();let m,p,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(tr).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(tr).join(`
`),p.length>0&&(p+=`
`)):(m=[Lu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(tr).join(`
`),p=[Lu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ai?"#define TONE_MAPPING":"",e.toneMapping!==ai?Qt.tonemapping_pars_fragment:"",e.toneMapping!==ai?__("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Qt.colorspace_pars_fragment,v_("linearToOutputTexel",e.outputColorSpace),w_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(tr).join(`
`)),o=wl(o),o=Cu(o,e),o=Pu(o,e),a=wl(a),a=Cu(a,e),a=Pu(a,e),o=Iu(o),a=Iu(a),e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===Wh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Wh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const v=_+m+o,w=_+p+a,M=Au(s,s.VERTEX_SHADER,v),S=Au(s,s.FRAGMENT_SHADER,w);s.attachShader(y,M),s.attachShader(y,S),e.index0AttributeName!==void 0?s.bindAttribLocation(y,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function E(T){if(i.debug.checkShaderErrors){const P=s.getProgramInfoLog(y).trim(),C=s.getShaderInfoLog(M).trim(),F=s.getShaderInfoLog(S).trim();let N=!0,D=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(N=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,y,M,S);else{const B=Ru(s,M,"vertex"),H=Ru(s,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+T.name+`
Material Type: `+T.type+`

Program Info Log: `+P+`
`+B+`
`+H)}else P!==""?console.warn("THREE.WebGLProgram: Program Info Log:",P):(C===""||F==="")&&(D=!1);D&&(T.diagnostics={runnable:N,programLog:P,vertexShader:{log:C,prefix:m},fragmentShader:{log:F,prefix:p}})}s.deleteShader(M),s.deleteShader(S),A=new Co(s,y),x=b_(s,y)}let A;this.getUniforms=function(){return A===void 0&&E(this),A};let x;this.getAttributes=function(){return x===void 0&&E(this),x};let b=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(y,p_)),b},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=m_++,this.cacheKey=t,this.usedTimes=1,this.program=y,this.vertexShader=M,this.fragmentShader=S,this}let U_=0;class F_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new O_(t),e.set(t,n)),n}}class O_{constructor(t){this.id=U_++,this.code=t,this.usedTimes=0}}function z_(i,t,e,n,s,r,o){const a=new Jo,c=new F_,l=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures;let d=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(x){return l.add(x),x===0?"uv":`uv${x}`}function m(x,b,T,P,C){const F=P.fog,N=C.geometry,D=x.isMeshStandardMaterial?P.environment:null,B=(x.isMeshStandardMaterial?e:t).get(x.envMap||D),H=B&&B.mapping===Ko?B.image.height:null,V=g[x.type];x.precision!==null&&(d=s.getMaxPrecision(x.precision),d!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",d,"instead."));const et=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,lt=et!==void 0?et.length:0;let Mt=0;N.morphAttributes.position!==void 0&&(Mt=1),N.morphAttributes.normal!==void 0&&(Mt=2),N.morphAttributes.color!==void 0&&(Mt=3);let Lt,J,ot,K;if(V){const he=wn[V];Lt=he.vertexShader,J=he.fragmentShader}else Lt=x.vertexShader,J=x.fragmentShader,c.update(x),ot=c.getVertexShaderID(x),K=c.getFragmentShaderID(x);const Y=i.getRenderTarget(),rt=i.state.buffers.depth.getReversed(),pt=C.isInstancedMesh===!0,wt=C.isBatchedMesh===!0,Ft=!!x.map,nt=!!x.matcap,ht=!!B,k=!!x.aoMap,ft=!!x.lightMap,st=!!x.bumpMap,gt=!!x.normalMap,yt=!!x.displacementMap,Gt=!!x.emissiveMap,Pt=!!x.metalnessMap,z=!!x.roughnessMap,L=x.anisotropy>0,Z=x.clearcoat>0,at=x.dispersion>0,dt=x.iridescence>0,ct=x.sheen>0,Ut=x.transmission>0,Et=L&&!!x.anisotropyMap,It=Z&&!!x.clearcoatMap,ne=Z&&!!x.clearcoatNormalMap,mt=Z&&!!x.clearcoatRoughnessMap,Dt=dt&&!!x.iridescenceMap,Vt=dt&&!!x.iridescenceThicknessMap,Wt=ct&&!!x.sheenColorMap,Nt=ct&&!!x.sheenRoughnessMap,se=!!x.specularMap,Jt=!!x.specularColorMap,pe=!!x.specularIntensityMap,W=Ut&&!!x.transmissionMap,At=Ut&&!!x.thicknessMap,it=!!x.gradientMap,ut=!!x.alphaMap,Ct=x.alphaTest>0,Tt=!!x.alphaHash,Zt=!!x.extensions;let Me=ai;x.toneMapped&&(Y===null||Y.isXRRenderTarget===!0)&&(Me=i.toneMapping);const Fe={shaderID:V,shaderType:x.type,shaderName:x.name,vertexShader:Lt,fragmentShader:J,defines:x.defines,customVertexShaderID:ot,customFragmentShaderID:K,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:d,batching:wt,batchingColor:wt&&C._colorsTexture!==null,instancing:pt,instancingColor:pt&&C.instanceColor!==null,instancingMorph:pt&&C.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:Y===null?i.outputColorSpace:Y.isXRRenderTarget===!0?Y.texture.colorSpace:As,alphaToCoverage:!!x.alphaToCoverage,map:Ft,matcap:nt,envMap:ht,envMapMode:ht&&B.mapping,envMapCubeUVHeight:H,aoMap:k,lightMap:ft,bumpMap:st,normalMap:gt,displacementMap:f&&yt,emissiveMap:Gt,normalMapObjectSpace:gt&&x.normalMapType===Im,normalMapTangentSpace:gt&&x.normalMapType===ah,metalnessMap:Pt,roughnessMap:z,anisotropy:L,anisotropyMap:Et,clearcoat:Z,clearcoatMap:It,clearcoatNormalMap:ne,clearcoatRoughnessMap:mt,dispersion:at,iridescence:dt,iridescenceMap:Dt,iridescenceThicknessMap:Vt,sheen:ct,sheenColorMap:Wt,sheenRoughnessMap:Nt,specularMap:se,specularColorMap:Jt,specularIntensityMap:pe,transmission:Ut,transmissionMap:W,thicknessMap:At,gradientMap:it,opaque:x.transparent===!1&&x.blending===fs&&x.alphaToCoverage===!1,alphaMap:ut,alphaTest:Ct,alphaHash:Tt,combine:x.combine,mapUv:Ft&&y(x.map.channel),aoMapUv:k&&y(x.aoMap.channel),lightMapUv:ft&&y(x.lightMap.channel),bumpMapUv:st&&y(x.bumpMap.channel),normalMapUv:gt&&y(x.normalMap.channel),displacementMapUv:yt&&y(x.displacementMap.channel),emissiveMapUv:Gt&&y(x.emissiveMap.channel),metalnessMapUv:Pt&&y(x.metalnessMap.channel),roughnessMapUv:z&&y(x.roughnessMap.channel),anisotropyMapUv:Et&&y(x.anisotropyMap.channel),clearcoatMapUv:It&&y(x.clearcoatMap.channel),clearcoatNormalMapUv:ne&&y(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:mt&&y(x.clearcoatRoughnessMap.channel),iridescenceMapUv:Dt&&y(x.iridescenceMap.channel),iridescenceThicknessMapUv:Vt&&y(x.iridescenceThicknessMap.channel),sheenColorMapUv:Wt&&y(x.sheenColorMap.channel),sheenRoughnessMapUv:Nt&&y(x.sheenRoughnessMap.channel),specularMapUv:se&&y(x.specularMap.channel),specularColorMapUv:Jt&&y(x.specularColorMap.channel),specularIntensityMapUv:pe&&y(x.specularIntensityMap.channel),transmissionMapUv:W&&y(x.transmissionMap.channel),thicknessMapUv:At&&y(x.thicknessMap.channel),alphaMapUv:ut&&y(x.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(gt||L),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,pointsUvs:C.isPoints===!0&&!!N.attributes.uv&&(Ft||ut),fog:!!F,useFog:x.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:x.flatShading===!0,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:rt,skinning:C.isSkinnedMesh===!0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:lt,morphTextureStride:Mt,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&T.length>0,shadowMapType:i.shadowMap.type,toneMapping:Me,decodeVideoTexture:Ft&&x.map.isVideoTexture===!0&&re.getTransfer(x.map.colorSpace)===ue,decodeVideoTextureEmissive:Gt&&x.emissiveMap.isVideoTexture===!0&&re.getTransfer(x.emissiveMap.colorSpace)===ue,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===mn,flipSided:x.side===We,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:Zt&&x.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Zt&&x.extensions.multiDraw===!0||wt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Fe.vertexUv1s=l.has(1),Fe.vertexUv2s=l.has(2),Fe.vertexUv3s=l.has(3),l.clear(),Fe}function p(x){const b=[];if(x.shaderID?b.push(x.shaderID):(b.push(x.customVertexShaderID),b.push(x.customFragmentShaderID)),x.defines!==void 0)for(const T in x.defines)b.push(T),b.push(x.defines[T]);return x.isRawShaderMaterial===!1&&(_(b,x),v(b,x),b.push(i.outputColorSpace)),b.push(x.customProgramCacheKey),b.join()}function _(x,b){x.push(b.precision),x.push(b.outputColorSpace),x.push(b.envMapMode),x.push(b.envMapCubeUVHeight),x.push(b.mapUv),x.push(b.alphaMapUv),x.push(b.lightMapUv),x.push(b.aoMapUv),x.push(b.bumpMapUv),x.push(b.normalMapUv),x.push(b.displacementMapUv),x.push(b.emissiveMapUv),x.push(b.metalnessMapUv),x.push(b.roughnessMapUv),x.push(b.anisotropyMapUv),x.push(b.clearcoatMapUv),x.push(b.clearcoatNormalMapUv),x.push(b.clearcoatRoughnessMapUv),x.push(b.iridescenceMapUv),x.push(b.iridescenceThicknessMapUv),x.push(b.sheenColorMapUv),x.push(b.sheenRoughnessMapUv),x.push(b.specularMapUv),x.push(b.specularColorMapUv),x.push(b.specularIntensityMapUv),x.push(b.transmissionMapUv),x.push(b.thicknessMapUv),x.push(b.combine),x.push(b.fogExp2),x.push(b.sizeAttenuation),x.push(b.morphTargetsCount),x.push(b.morphAttributeCount),x.push(b.numDirLights),x.push(b.numPointLights),x.push(b.numSpotLights),x.push(b.numSpotLightMaps),x.push(b.numHemiLights),x.push(b.numRectAreaLights),x.push(b.numDirLightShadows),x.push(b.numPointLightShadows),x.push(b.numSpotLightShadows),x.push(b.numSpotLightShadowsWithMaps),x.push(b.numLightProbes),x.push(b.shadowMapType),x.push(b.toneMapping),x.push(b.numClippingPlanes),x.push(b.numClipIntersection),x.push(b.depthPacking)}function v(x,b){a.disableAll(),b.supportsVertexTextures&&a.enable(0),b.instancing&&a.enable(1),b.instancingColor&&a.enable(2),b.instancingMorph&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),b.dispersion&&a.enable(20),b.batchingColor&&a.enable(21),x.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reverseDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),x.push(a.mask)}function w(x){const b=g[x.type];let T;if(b){const P=wn[b];T=Qo.clone(P.uniforms)}else T=x.uniforms;return T}function M(x,b){let T;for(let P=0,C=h.length;P<C;P++){const F=h[P];if(F.cacheKey===b){T=F,++T.usedTimes;break}}return T===void 0&&(T=new N_(i,b,x,r),h.push(T)),T}function S(x){if(--x.usedTimes===0){const b=h.indexOf(x);h[b]=h[h.length-1],h.pop(),x.destroy()}}function E(x){c.remove(x)}function A(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:w,acquireProgram:M,releaseProgram:S,releaseShaderCache:E,programs:h,dispose:A}}function k_(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function B_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Du(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Nu(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,f,d,g,y,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:g,renderOrder:u.renderOrder,z:y,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=y,p.group=m),t++,p}function a(u,f,d,g,y,m){const p=o(u,f,d,g,y,m);d.transmission>0?n.push(p):d.transparent===!0?s.push(p):e.push(p)}function c(u,f,d,g,y,m){const p=o(u,f,d,g,y,m);d.transmission>0?n.unshift(p):d.transparent===!0?s.unshift(p):e.unshift(p)}function l(u,f){e.length>1&&e.sort(u||B_),n.length>1&&n.sort(f||Du),s.length>1&&s.sort(f||Du)}function h(){for(let u=t,f=i.length;u<f;u++){const d=i[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function H_(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new Nu,i.set(n,[o])):s>=r.length?(o=new Nu,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function G_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new R,color:new qt};break;case"SpotLight":e={position:new R,direction:new R,color:new qt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new R,color:new qt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new R,skyColor:new qt,groundColor:new qt};break;case"RectAreaLight":e={color:new qt,position:new R,halfWidth:new R,halfHeight:new R};break}return i[t.id]=e,e}}}function V_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let W_=0;function X_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function q_(i){const t=new G_,e=V_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new R);const s=new R,r=new fe,o=new fe;function a(l){let h=0,u=0,f=0;for(let x=0;x<9;x++)n.probe[x].set(0,0,0);let d=0,g=0,y=0,m=0,p=0,_=0,v=0,w=0,M=0,S=0,E=0;l.sort(X_);for(let x=0,b=l.length;x<b;x++){const T=l[x],P=T.color,C=T.intensity,F=T.distance,N=T.shadow&&T.shadow.map?T.shadow.map.texture:null;if(T.isAmbientLight)h+=P.r*C,u+=P.g*C,f+=P.b*C;else if(T.isLightProbe){for(let D=0;D<9;D++)n.probe[D].addScaledVector(T.sh.coefficients[D],C);E++}else if(T.isDirectionalLight){const D=t.get(T);if(D.color.copy(T.color).multiplyScalar(T.intensity),T.castShadow){const B=T.shadow,H=e.get(T);H.shadowIntensity=B.intensity,H.shadowBias=B.bias,H.shadowNormalBias=B.normalBias,H.shadowRadius=B.radius,H.shadowMapSize=B.mapSize,n.directionalShadow[d]=H,n.directionalShadowMap[d]=N,n.directionalShadowMatrix[d]=T.shadow.matrix,_++}n.directional[d]=D,d++}else if(T.isSpotLight){const D=t.get(T);D.position.setFromMatrixPosition(T.matrixWorld),D.color.copy(P).multiplyScalar(C),D.distance=F,D.coneCos=Math.cos(T.angle),D.penumbraCos=Math.cos(T.angle*(1-T.penumbra)),D.decay=T.decay,n.spot[y]=D;const B=T.shadow;if(T.map&&(n.spotLightMap[M]=T.map,M++,B.updateMatrices(T),T.castShadow&&S++),n.spotLightMatrix[y]=B.matrix,T.castShadow){const H=e.get(T);H.shadowIntensity=B.intensity,H.shadowBias=B.bias,H.shadowNormalBias=B.normalBias,H.shadowRadius=B.radius,H.shadowMapSize=B.mapSize,n.spotShadow[y]=H,n.spotShadowMap[y]=N,w++}y++}else if(T.isRectAreaLight){const D=t.get(T);D.color.copy(P).multiplyScalar(C),D.halfWidth.set(T.width*.5,0,0),D.halfHeight.set(0,T.height*.5,0),n.rectArea[m]=D,m++}else if(T.isPointLight){const D=t.get(T);if(D.color.copy(T.color).multiplyScalar(T.intensity),D.distance=T.distance,D.decay=T.decay,T.castShadow){const B=T.shadow,H=e.get(T);H.shadowIntensity=B.intensity,H.shadowBias=B.bias,H.shadowNormalBias=B.normalBias,H.shadowRadius=B.radius,H.shadowMapSize=B.mapSize,H.shadowCameraNear=B.camera.near,H.shadowCameraFar=B.camera.far,n.pointShadow[g]=H,n.pointShadowMap[g]=N,n.pointShadowMatrix[g]=T.shadow.matrix,v++}n.point[g]=D,g++}else if(T.isHemisphereLight){const D=t.get(T);D.skyColor.copy(T.color).multiplyScalar(C),D.groundColor.copy(T.groundColor).multiplyScalar(C),n.hemi[p]=D,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=St.LTC_FLOAT_1,n.rectAreaLTC2=St.LTC_FLOAT_2):(n.rectAreaLTC1=St.LTC_HALF_1,n.rectAreaLTC2=St.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;const A=n.hash;(A.directionalLength!==d||A.pointLength!==g||A.spotLength!==y||A.rectAreaLength!==m||A.hemiLength!==p||A.numDirectionalShadows!==_||A.numPointShadows!==v||A.numSpotShadows!==w||A.numSpotMaps!==M||A.numLightProbes!==E)&&(n.directional.length=d,n.spot.length=y,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=_,n.directionalShadowMap.length=_,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=w,n.spotShadowMap.length=w,n.directionalShadowMatrix.length=_,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=w+M-S,n.spotLightMap.length=M,n.numSpotLightShadowsWithMaps=S,n.numLightProbes=E,A.directionalLength=d,A.pointLength=g,A.spotLength=y,A.rectAreaLength=m,A.hemiLength=p,A.numDirectionalShadows=_,A.numPointShadows=v,A.numSpotShadows=w,A.numSpotMaps=M,A.numLightProbes=E,n.version=W_++)}function c(l,h){let u=0,f=0,d=0,g=0,y=0;const m=h.matrixWorldInverse;for(let p=0,_=l.length;p<_;p++){const v=l[p];if(v.isDirectionalLight){const w=n.directional[u];w.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(m),u++}else if(v.isSpotLight){const w=n.spot[d];w.position.setFromMatrixPosition(v.matrixWorld),w.position.applyMatrix4(m),w.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(m),d++}else if(v.isRectAreaLight){const w=n.rectArea[g];w.position.setFromMatrixPosition(v.matrixWorld),w.position.applyMatrix4(m),o.identity(),r.copy(v.matrixWorld),r.premultiply(m),o.extractRotation(r),w.halfWidth.set(v.width*.5,0,0),w.halfHeight.set(0,v.height*.5,0),w.halfWidth.applyMatrix4(o),w.halfHeight.applyMatrix4(o),g++}else if(v.isPointLight){const w=n.point[f];w.position.setFromMatrixPosition(v.matrixWorld),w.position.applyMatrix4(m),f++}else if(v.isHemisphereLight){const w=n.hemi[y];w.direction.setFromMatrixPosition(v.matrixWorld),w.direction.transformDirection(m),y++}}}return{setup:a,setupView:c,state:n}}function Uu(i){const t=new q_(i),e=[],n=[];function s(h){l.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function Y_(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new Uu(i),t.set(s,[a])):r>=o.length?(a=new Uu(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class hf extends fi{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Pm,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class $_ extends fi{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Z_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,K_=`uniform sampler2D shadow_pass;
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
}`;function j_(i,t,e){let n=new lh;const s=new tt,r=new tt,o=new de,a=new hf({depthPacking:Y0}),c=new $_,l={},h=e.maxTextureSize,u={[ci]:We,[We]:ci,[mn]:mn},f=new sn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new tt},radius:{value:4}},vertexShader:Z_,fragmentShader:K_}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const g=new Ie;g.setAttribute("position",new Ke(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new ee(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=C0;let p=this.type;this.render=function(S,E,A){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;const x=i.getRenderTarget(),b=i.getActiveCubeFace(),T=i.getActiveMipmapLevel(),P=i.state;P.setBlending(qn),P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);const C=p!==Bn&&this.type===Bn,F=p===Bn&&this.type!==Bn;for(let N=0,D=S.length;N<D;N++){const B=S[N],H=B.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",B,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const V=H.getFrameExtents();if(s.multiply(V),r.copy(H.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/V.x),s.x=r.x*V.x,H.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/V.y),s.y=r.y*V.y,H.mapSize.y=r.y)),H.map===null||C===!0||F===!0){const lt=this.type!==Bn?{minFilter:Ue,magFilter:Ue}:{};H.map!==null&&H.map.dispose(),H.map=new An(s.x,s.y,lt),H.map.texture.name=B.name+".shadowMap",H.camera.updateProjectionMatrix()}i.setRenderTarget(H.map),i.clear();const et=H.getViewportCount();for(let lt=0;lt<et;lt++){const Mt=H.getViewport(lt);o.set(r.x*Mt.x,r.y*Mt.y,r.x*Mt.z,r.y*Mt.w),P.viewport(o),H.updateMatrices(B,lt),n=H.getFrustum(),w(E,A,H.camera,B,this.type)}H.isPointLightShadow!==!0&&this.type===Bn&&_(H,A),H.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(x,b,T)};function _(S,E){const A=t.update(y);f.defines.VSM_SAMPLES!==S.blurSamples&&(f.defines.VSM_SAMPLES=S.blurSamples,d.defines.VSM_SAMPLES=S.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new An(s.x,s.y)),f.uniforms.shadow_pass.value=S.map.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(E,null,A,f,y,null),d.uniforms.shadow_pass.value=S.mapPass.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(E,null,A,d,y,null)}function v(S,E,A,x){let b=null;const T=A.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(T!==void 0)b=T;else if(b=A.isPointLight===!0?c:a,i.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const P=b.uuid,C=E.uuid;let F=l[P];F===void 0&&(F={},l[P]=F);let N=F[C];N===void 0&&(N=b.clone(),F[C]=N,E.addEventListener("dispose",M)),b=N}if(b.visible=E.visible,b.wireframe=E.wireframe,x===Bn?b.side=E.shadowSide!==null?E.shadowSide:E.side:b.side=E.shadowSide!==null?E.shadowSide:u[E.side],b.alphaMap=E.alphaMap,b.alphaTest=E.alphaTest,b.map=E.map,b.clipShadows=E.clipShadows,b.clippingPlanes=E.clippingPlanes,b.clipIntersection=E.clipIntersection,b.displacementMap=E.displacementMap,b.displacementScale=E.displacementScale,b.displacementBias=E.displacementBias,b.wireframeLinewidth=E.wireframeLinewidth,b.linewidth=E.linewidth,A.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const P=i.properties.get(b);P.light=A}return b}function w(S,E,A,x,b){if(S.visible===!1)return;if(S.layers.test(E.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&b===Bn)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,S.matrixWorld);const C=t.update(S),F=S.material;if(Array.isArray(F)){const N=C.groups;for(let D=0,B=N.length;D<B;D++){const H=N[D],V=F[H.materialIndex];if(V&&V.visible){const et=v(S,V,x,b);S.onBeforeShadow(i,S,E,A,C,et,H),i.renderBufferDirect(A,null,C,et,S,H),S.onAfterShadow(i,S,E,A,C,et,H)}}}else if(F.visible){const N=v(S,F,x,b);S.onBeforeShadow(i,S,E,A,C,N,null),i.renderBufferDirect(A,null,C,N,S,null),S.onAfterShadow(i,S,E,A,C,N,null)}}const P=S.children;for(let C=0,F=P.length;C<F;C++)w(P[C],E,A,x,b)}function M(S){S.target.removeEventListener("dispose",M);for(const A in l){const x=l[A],b=S.target.uuid;b in x&&(x[b].dispose(),delete x[b])}}}const J_={[zc]:kc,[Bc]:Vc,[Hc]:Wc,[gs]:Gc,[kc]:zc,[Vc]:Bc,[Wc]:Hc,[Gc]:gs};function Q_(i,t){function e(){let W=!1;const At=new de;let it=null;const ut=new de(0,0,0,0);return{setMask:function(Ct){it!==Ct&&!W&&(i.colorMask(Ct,Ct,Ct,Ct),it=Ct)},setLocked:function(Ct){W=Ct},setClear:function(Ct,Tt,Zt,Me,Fe){Fe===!0&&(Ct*=Me,Tt*=Me,Zt*=Me),At.set(Ct,Tt,Zt,Me),ut.equals(At)===!1&&(i.clearColor(Ct,Tt,Zt,Me),ut.copy(At))},reset:function(){W=!1,it=null,ut.set(-1,0,0,0)}}}function n(){let W=!1,At=!1,it=null,ut=null,Ct=null;return{setReversed:function(Tt){if(At!==Tt){const Zt=t.get("EXT_clip_control");At?Zt.clipControlEXT(Zt.LOWER_LEFT_EXT,Zt.ZERO_TO_ONE_EXT):Zt.clipControlEXT(Zt.LOWER_LEFT_EXT,Zt.NEGATIVE_ONE_TO_ONE_EXT);const Me=Ct;Ct=null,this.setClear(Me)}At=Tt},getReversed:function(){return At},setTest:function(Tt){Tt?Y(i.DEPTH_TEST):rt(i.DEPTH_TEST)},setMask:function(Tt){it!==Tt&&!W&&(i.depthMask(Tt),it=Tt)},setFunc:function(Tt){if(At&&(Tt=J_[Tt]),ut!==Tt){switch(Tt){case zc:i.depthFunc(i.NEVER);break;case kc:i.depthFunc(i.ALWAYS);break;case Bc:i.depthFunc(i.LESS);break;case gs:i.depthFunc(i.LEQUAL);break;case Hc:i.depthFunc(i.EQUAL);break;case Gc:i.depthFunc(i.GEQUAL);break;case Vc:i.depthFunc(i.GREATER);break;case Wc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ut=Tt}},setLocked:function(Tt){W=Tt},setClear:function(Tt){Ct!==Tt&&(At&&(Tt=1-Tt),i.clearDepth(Tt),Ct=Tt)},reset:function(){W=!1,it=null,ut=null,Ct=null,At=!1}}}function s(){let W=!1,At=null,it=null,ut=null,Ct=null,Tt=null,Zt=null,Me=null,Fe=null;return{setTest:function(he){W||(he?Y(i.STENCIL_TEST):rt(i.STENCIL_TEST))},setMask:function(he){At!==he&&!W&&(i.stencilMask(he),At=he)},setFunc:function(he,hn,In){(it!==he||ut!==hn||Ct!==In)&&(i.stencilFunc(he,hn,In),it=he,ut=hn,Ct=In)},setOp:function(he,hn,In){(Tt!==he||Zt!==hn||Me!==In)&&(i.stencilOp(he,hn,In),Tt=he,Zt=hn,Me=In)},setLocked:function(he){W=he},setClear:function(he){Fe!==he&&(i.clearStencil(he),Fe=he)},reset:function(){W=!1,At=null,it=null,ut=null,Ct=null,Tt=null,Zt=null,Me=null,Fe=null}}}const r=new e,o=new n,a=new s,c=new WeakMap,l=new WeakMap;let h={},u={},f=new WeakMap,d=[],g=null,y=!1,m=null,p=null,_=null,v=null,w=null,M=null,S=null,E=new qt(0,0,0),A=0,x=!1,b=null,T=null,P=null,C=null,F=null;const N=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let D=!1,B=0;const H=i.getParameter(i.VERSION);H.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec(H)[1]),D=B>=1):H.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),D=B>=2);let V=null,et={};const lt=i.getParameter(i.SCISSOR_BOX),Mt=i.getParameter(i.VIEWPORT),Lt=new de().fromArray(lt),J=new de().fromArray(Mt);function ot(W,At,it,ut){const Ct=new Uint8Array(4),Tt=i.createTexture();i.bindTexture(W,Tt),i.texParameteri(W,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(W,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Zt=0;Zt<it;Zt++)W===i.TEXTURE_3D||W===i.TEXTURE_2D_ARRAY?i.texImage3D(At,0,i.RGBA,1,1,ut,0,i.RGBA,i.UNSIGNED_BYTE,Ct):i.texImage2D(At+Zt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ct);return Tt}const K={};K[i.TEXTURE_2D]=ot(i.TEXTURE_2D,i.TEXTURE_2D,1),K[i.TEXTURE_CUBE_MAP]=ot(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),K[i.TEXTURE_2D_ARRAY]=ot(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),K[i.TEXTURE_3D]=ot(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),Y(i.DEPTH_TEST),o.setFunc(gs),st(!1),gt(kh),Y(i.CULL_FACE),k(qn);function Y(W){h[W]!==!0&&(i.enable(W),h[W]=!0)}function rt(W){h[W]!==!1&&(i.disable(W),h[W]=!1)}function pt(W,At){return u[W]!==At?(i.bindFramebuffer(W,At),u[W]=At,W===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=At),W===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=At),!0):!1}function wt(W,At){let it=d,ut=!1;if(W){it=f.get(At),it===void 0&&(it=[],f.set(At,it));const Ct=W.textures;if(it.length!==Ct.length||it[0]!==i.COLOR_ATTACHMENT0){for(let Tt=0,Zt=Ct.length;Tt<Zt;Tt++)it[Tt]=i.COLOR_ATTACHMENT0+Tt;it.length=Ct.length,ut=!0}}else it[0]!==i.BACK&&(it[0]=i.BACK,ut=!0);ut&&i.drawBuffers(it)}function Ft(W){return g!==W?(i.useProgram(W),g=W,!0):!1}const nt={[Ri]:i.FUNC_ADD,[lm]:i.FUNC_SUBTRACT,[hm]:i.FUNC_REVERSE_SUBTRACT};nt[um]=i.MIN,nt[dm]=i.MAX;const ht={[fm]:i.ZERO,[pm]:i.ONE,[mm]:i.SRC_COLOR,[Fc]:i.SRC_ALPHA,[xm]:i.SRC_ALPHA_SATURATE,[_m]:i.DST_COLOR,[ym]:i.DST_ALPHA,[gm]:i.ONE_MINUS_SRC_COLOR,[Oc]:i.ONE_MINUS_SRC_ALPHA,[wm]:i.ONE_MINUS_DST_COLOR,[vm]:i.ONE_MINUS_DST_ALPHA,[Mm]:i.CONSTANT_COLOR,[bm]:i.ONE_MINUS_CONSTANT_COLOR,[Sm]:i.CONSTANT_ALPHA,[Em]:i.ONE_MINUS_CONSTANT_ALPHA};function k(W,At,it,ut,Ct,Tt,Zt,Me,Fe,he){if(W===qn){y===!0&&(rt(i.BLEND),y=!1);return}if(y===!1&&(Y(i.BLEND),y=!0),W!==cm){if(W!==m||he!==x){if((p!==Ri||w!==Ri)&&(i.blendEquation(i.FUNC_ADD),p=Ri,w=Ri),he)switch(W){case fs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Uc:i.blendFunc(i.ONE,i.ONE);break;case Bh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Hh:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}else switch(W){case fs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Uc:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Bh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Hh:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}_=null,v=null,M=null,S=null,E.set(0,0,0),A=0,m=W,x=he}return}Ct=Ct||At,Tt=Tt||it,Zt=Zt||ut,(At!==p||Ct!==w)&&(i.blendEquationSeparate(nt[At],nt[Ct]),p=At,w=Ct),(it!==_||ut!==v||Tt!==M||Zt!==S)&&(i.blendFuncSeparate(ht[it],ht[ut],ht[Tt],ht[Zt]),_=it,v=ut,M=Tt,S=Zt),(Me.equals(E)===!1||Fe!==A)&&(i.blendColor(Me.r,Me.g,Me.b,Fe),E.copy(Me),A=Fe),m=W,x=!1}function ft(W,At){W.side===mn?rt(i.CULL_FACE):Y(i.CULL_FACE);let it=W.side===We;At&&(it=!it),st(it),W.blending===fs&&W.transparent===!1?k(qn):k(W.blending,W.blendEquation,W.blendSrc,W.blendDst,W.blendEquationAlpha,W.blendSrcAlpha,W.blendDstAlpha,W.blendColor,W.blendAlpha,W.premultipliedAlpha),o.setFunc(W.depthFunc),o.setTest(W.depthTest),o.setMask(W.depthWrite),r.setMask(W.colorWrite);const ut=W.stencilWrite;a.setTest(ut),ut&&(a.setMask(W.stencilWriteMask),a.setFunc(W.stencilFunc,W.stencilRef,W.stencilFuncMask),a.setOp(W.stencilFail,W.stencilZFail,W.stencilZPass)),Gt(W.polygonOffset,W.polygonOffsetFactor,W.polygonOffsetUnits),W.alphaToCoverage===!0?Y(i.SAMPLE_ALPHA_TO_COVERAGE):rt(i.SAMPLE_ALPHA_TO_COVERAGE)}function st(W){b!==W&&(W?i.frontFace(i.CW):i.frontFace(i.CCW),b=W)}function gt(W){W!==om?(Y(i.CULL_FACE),W!==T&&(W===kh?i.cullFace(i.BACK):W===am?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):rt(i.CULL_FACE),T=W}function yt(W){W!==P&&(D&&i.lineWidth(W),P=W)}function Gt(W,At,it){W?(Y(i.POLYGON_OFFSET_FILL),(C!==At||F!==it)&&(i.polygonOffset(At,it),C=At,F=it)):rt(i.POLYGON_OFFSET_FILL)}function Pt(W){W?Y(i.SCISSOR_TEST):rt(i.SCISSOR_TEST)}function z(W){W===void 0&&(W=i.TEXTURE0+N-1),V!==W&&(i.activeTexture(W),V=W)}function L(W,At,it){it===void 0&&(V===null?it=i.TEXTURE0+N-1:it=V);let ut=et[it];ut===void 0&&(ut={type:void 0,texture:void 0},et[it]=ut),(ut.type!==W||ut.texture!==At)&&(V!==it&&(i.activeTexture(it),V=it),i.bindTexture(W,At||K[W]),ut.type=W,ut.texture=At)}function Z(){const W=et[V];W!==void 0&&W.type!==void 0&&(i.bindTexture(W.type,null),W.type=void 0,W.texture=void 0)}function at(){try{i.compressedTexImage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function dt(){try{i.compressedTexImage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function ct(){try{i.texSubImage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Ut(){try{i.texSubImage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Et(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function It(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function ne(){try{i.texStorage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function mt(){try{i.texStorage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Dt(){try{i.texImage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Vt(){try{i.texImage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Wt(W){Lt.equals(W)===!1&&(i.scissor(W.x,W.y,W.z,W.w),Lt.copy(W))}function Nt(W){J.equals(W)===!1&&(i.viewport(W.x,W.y,W.z,W.w),J.copy(W))}function se(W,At){let it=l.get(At);it===void 0&&(it=new WeakMap,l.set(At,it));let ut=it.get(W);ut===void 0&&(ut=i.getUniformBlockIndex(At,W.name),it.set(W,ut))}function Jt(W,At){const ut=l.get(At).get(W);c.get(At)!==ut&&(i.uniformBlockBinding(At,ut,W.__bindingPointIndex),c.set(At,ut))}function pe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},V=null,et={},u={},f=new WeakMap,d=[],g=null,y=!1,m=null,p=null,_=null,v=null,w=null,M=null,S=null,E=new qt(0,0,0),A=0,x=!1,b=null,T=null,P=null,C=null,F=null,Lt.set(0,0,i.canvas.width,i.canvas.height),J.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:Y,disable:rt,bindFramebuffer:pt,drawBuffers:wt,useProgram:Ft,setBlending:k,setMaterial:ft,setFlipSided:st,setCullFace:gt,setLineWidth:yt,setPolygonOffset:Gt,setScissorTest:Pt,activeTexture:z,bindTexture:L,unbindTexture:Z,compressedTexImage2D:at,compressedTexImage3D:dt,texImage2D:Dt,texImage3D:Vt,updateUBOMapping:se,uniformBlockBinding:Jt,texStorage2D:ne,texStorage3D:mt,texSubImage2D:ct,texSubImage3D:Ut,compressedTexSubImage2D:Et,compressedTexSubImage3D:It,scissor:Wt,viewport:Nt,reset:pe}}function Fu(i,t,e,n){const s=tw(n);switch(e){case H0:return i*t;case V0:return i*t;case W0:return i*t*2;case ih:return i*t/s.components*s.byteLength;case sh:return i*t/s.components*s.byteLength;case X0:return i*t*2/s.components*s.byteLength;case rh:return i*t*2/s.components*s.byteLength;case G0:return i*t*3/s.components*s.byteLength;case cn:return i*t*4/s.components*s.byteLength;case oh:return i*t*4/s.components*s.byteLength;case So:case Eo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ao:case To:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Zc:case jc:return Math.max(i,16)*Math.max(t,8)/4;case $c:case Kc:return Math.max(i,8)*Math.max(t,8)/2;case Jc:case Qc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case tl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case el:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case nl:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case il:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case sl:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case rl:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case ol:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case al:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case cl:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case ll:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case hl:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case ul:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case dl:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case fl:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case pl:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Ro:case ml:case gl:return Math.ceil(i/4)*Math.ceil(t/4)*16;case q0:case yl:return Math.ceil(i/4)*Math.ceil(t/4)*8;case vl:case _l:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function tw(i){switch(i){case En:case z0:return{byteLength:1,components:1};case hr:case k0:case li:return{byteLength:2,components:1};case eh:case nh:return{byteLength:2,components:4};case Di:case th:case Wn:return{byteLength:4,components:1};case B0:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function ew(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new tt,h=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(z,L){return d?new OffscreenCanvas(z,L):Do("canvas")}function y(z,L,Z){let at=1;const dt=Pt(z);if((dt.width>Z||dt.height>Z)&&(at=Z/Math.max(dt.width,dt.height)),at<1)if(typeof HTMLImageElement<"u"&&z instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&z instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&z instanceof ImageBitmap||typeof VideoFrame<"u"&&z instanceof VideoFrame){const ct=Math.floor(at*dt.width),Ut=Math.floor(at*dt.height);u===void 0&&(u=g(ct,Ut));const Et=L?g(ct,Ut):u;return Et.width=ct,Et.height=Ut,Et.getContext("2d").drawImage(z,0,0,ct,Ut),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+dt.width+"x"+dt.height+") to ("+ct+"x"+Ut+")."),Et}else return"data"in z&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+dt.width+"x"+dt.height+")."),z;return z}function m(z){return z.generateMipmaps}function p(z){i.generateMipmap(z)}function _(z){return z.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:z.isWebGL3DRenderTarget?i.TEXTURE_3D:z.isWebGLArrayRenderTarget||z.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(z,L,Z,at,dt=!1){if(z!==null){if(i[z]!==void 0)return i[z];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+z+"'")}let ct=L;if(L===i.RED&&(Z===i.FLOAT&&(ct=i.R32F),Z===i.HALF_FLOAT&&(ct=i.R16F),Z===i.UNSIGNED_BYTE&&(ct=i.R8)),L===i.RED_INTEGER&&(Z===i.UNSIGNED_BYTE&&(ct=i.R8UI),Z===i.UNSIGNED_SHORT&&(ct=i.R16UI),Z===i.UNSIGNED_INT&&(ct=i.R32UI),Z===i.BYTE&&(ct=i.R8I),Z===i.SHORT&&(ct=i.R16I),Z===i.INT&&(ct=i.R32I)),L===i.RG&&(Z===i.FLOAT&&(ct=i.RG32F),Z===i.HALF_FLOAT&&(ct=i.RG16F),Z===i.UNSIGNED_BYTE&&(ct=i.RG8)),L===i.RG_INTEGER&&(Z===i.UNSIGNED_BYTE&&(ct=i.RG8UI),Z===i.UNSIGNED_SHORT&&(ct=i.RG16UI),Z===i.UNSIGNED_INT&&(ct=i.RG32UI),Z===i.BYTE&&(ct=i.RG8I),Z===i.SHORT&&(ct=i.RG16I),Z===i.INT&&(ct=i.RG32I)),L===i.RGB_INTEGER&&(Z===i.UNSIGNED_BYTE&&(ct=i.RGB8UI),Z===i.UNSIGNED_SHORT&&(ct=i.RGB16UI),Z===i.UNSIGNED_INT&&(ct=i.RGB32UI),Z===i.BYTE&&(ct=i.RGB8I),Z===i.SHORT&&(ct=i.RGB16I),Z===i.INT&&(ct=i.RGB32I)),L===i.RGBA_INTEGER&&(Z===i.UNSIGNED_BYTE&&(ct=i.RGBA8UI),Z===i.UNSIGNED_SHORT&&(ct=i.RGBA16UI),Z===i.UNSIGNED_INT&&(ct=i.RGBA32UI),Z===i.BYTE&&(ct=i.RGBA8I),Z===i.SHORT&&(ct=i.RGBA16I),Z===i.INT&&(ct=i.RGBA32I)),L===i.RGB&&Z===i.UNSIGNED_INT_5_9_9_9_REV&&(ct=i.RGB9_E5),L===i.RGBA){const Ut=dt?jo:re.getTransfer(at);Z===i.FLOAT&&(ct=i.RGBA32F),Z===i.HALF_FLOAT&&(ct=i.RGBA16F),Z===i.UNSIGNED_BYTE&&(ct=Ut===ue?i.SRGB8_ALPHA8:i.RGBA8),Z===i.UNSIGNED_SHORT_4_4_4_4&&(ct=i.RGBA4),Z===i.UNSIGNED_SHORT_5_5_5_1&&(ct=i.RGB5_A1)}return(ct===i.R16F||ct===i.R32F||ct===i.RG16F||ct===i.RG32F||ct===i.RGBA16F||ct===i.RGBA32F)&&t.get("EXT_color_buffer_float"),ct}function w(z,L){let Z;return z?L===null||L===Di||L===_s?Z=i.DEPTH24_STENCIL8:L===Wn?Z=i.DEPTH32F_STENCIL8:L===hr&&(Z=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):L===null||L===Di||L===_s?Z=i.DEPTH_COMPONENT24:L===Wn?Z=i.DEPTH_COMPONENT32F:L===hr&&(Z=i.DEPTH_COMPONENT16),Z}function M(z,L){return m(z)===!0||z.isFramebufferTexture&&z.minFilter!==Ue&&z.minFilter!==nn?Math.log2(Math.max(L.width,L.height))+1:z.mipmaps!==void 0&&z.mipmaps.length>0?z.mipmaps.length:z.isCompressedTexture&&Array.isArray(z.image)?L.mipmaps.length:1}function S(z){const L=z.target;L.removeEventListener("dispose",S),A(L),L.isVideoTexture&&h.delete(L)}function E(z){const L=z.target;L.removeEventListener("dispose",E),b(L)}function A(z){const L=n.get(z);if(L.__webglInit===void 0)return;const Z=z.source,at=f.get(Z);if(at){const dt=at[L.__cacheKey];dt.usedTimes--,dt.usedTimes===0&&x(z),Object.keys(at).length===0&&f.delete(Z)}n.remove(z)}function x(z){const L=n.get(z);i.deleteTexture(L.__webglTexture);const Z=z.source,at=f.get(Z);delete at[L.__cacheKey],o.memory.textures--}function b(z){const L=n.get(z);if(z.depthTexture&&(z.depthTexture.dispose(),n.remove(z.depthTexture)),z.isWebGLCubeRenderTarget)for(let at=0;at<6;at++){if(Array.isArray(L.__webglFramebuffer[at]))for(let dt=0;dt<L.__webglFramebuffer[at].length;dt++)i.deleteFramebuffer(L.__webglFramebuffer[at][dt]);else i.deleteFramebuffer(L.__webglFramebuffer[at]);L.__webglDepthbuffer&&i.deleteRenderbuffer(L.__webglDepthbuffer[at])}else{if(Array.isArray(L.__webglFramebuffer))for(let at=0;at<L.__webglFramebuffer.length;at++)i.deleteFramebuffer(L.__webglFramebuffer[at]);else i.deleteFramebuffer(L.__webglFramebuffer);if(L.__webglDepthbuffer&&i.deleteRenderbuffer(L.__webglDepthbuffer),L.__webglMultisampledFramebuffer&&i.deleteFramebuffer(L.__webglMultisampledFramebuffer),L.__webglColorRenderbuffer)for(let at=0;at<L.__webglColorRenderbuffer.length;at++)L.__webglColorRenderbuffer[at]&&i.deleteRenderbuffer(L.__webglColorRenderbuffer[at]);L.__webglDepthRenderbuffer&&i.deleteRenderbuffer(L.__webglDepthRenderbuffer)}const Z=z.textures;for(let at=0,dt=Z.length;at<dt;at++){const ct=n.get(Z[at]);ct.__webglTexture&&(i.deleteTexture(ct.__webglTexture),o.memory.textures--),n.remove(Z[at])}n.remove(z)}let T=0;function P(){T=0}function C(){const z=T;return z>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+z+" texture units while this GPU supports only "+s.maxTextures),T+=1,z}function F(z){const L=[];return L.push(z.wrapS),L.push(z.wrapT),L.push(z.wrapR||0),L.push(z.magFilter),L.push(z.minFilter),L.push(z.anisotropy),L.push(z.internalFormat),L.push(z.format),L.push(z.type),L.push(z.generateMipmaps),L.push(z.premultiplyAlpha),L.push(z.flipY),L.push(z.unpackAlignment),L.push(z.colorSpace),L.join()}function N(z,L){const Z=n.get(z);if(z.isVideoTexture&&yt(z),z.isRenderTargetTexture===!1&&z.version>0&&Z.__version!==z.version){const at=z.image;if(at===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(at.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{J(Z,z,L);return}}e.bindTexture(i.TEXTURE_2D,Z.__webglTexture,i.TEXTURE0+L)}function D(z,L){const Z=n.get(z);if(z.version>0&&Z.__version!==z.version){J(Z,z,L);return}e.bindTexture(i.TEXTURE_2D_ARRAY,Z.__webglTexture,i.TEXTURE0+L)}function B(z,L){const Z=n.get(z);if(z.version>0&&Z.__version!==z.version){J(Z,z,L);return}e.bindTexture(i.TEXTURE_3D,Z.__webglTexture,i.TEXTURE0+L)}function H(z,L){const Z=n.get(z);if(z.version>0&&Z.__version!==z.version){ot(Z,z,L);return}e.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture,i.TEXTURE0+L)}const V={[lr]:i.REPEAT,[Vn]:i.CLAMP_TO_EDGE,[Yc]:i.MIRRORED_REPEAT},et={[Ue]:i.NEAREST,[Cm]:i.NEAREST_MIPMAP_NEAREST,[Sr]:i.NEAREST_MIPMAP_LINEAR,[nn]:i.LINEAR,[ca]:i.LINEAR_MIPMAP_NEAREST,[oi]:i.LINEAR_MIPMAP_LINEAR},lt={[Lm]:i.NEVER,[zm]:i.ALWAYS,[Dm]:i.LESS,[$0]:i.LEQUAL,[Nm]:i.EQUAL,[Om]:i.GEQUAL,[Um]:i.GREATER,[Fm]:i.NOTEQUAL};function Mt(z,L){if(L.type===Wn&&t.has("OES_texture_float_linear")===!1&&(L.magFilter===nn||L.magFilter===ca||L.magFilter===Sr||L.magFilter===oi||L.minFilter===nn||L.minFilter===ca||L.minFilter===Sr||L.minFilter===oi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(z,i.TEXTURE_WRAP_S,V[L.wrapS]),i.texParameteri(z,i.TEXTURE_WRAP_T,V[L.wrapT]),(z===i.TEXTURE_3D||z===i.TEXTURE_2D_ARRAY)&&i.texParameteri(z,i.TEXTURE_WRAP_R,V[L.wrapR]),i.texParameteri(z,i.TEXTURE_MAG_FILTER,et[L.magFilter]),i.texParameteri(z,i.TEXTURE_MIN_FILTER,et[L.minFilter]),L.compareFunction&&(i.texParameteri(z,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(z,i.TEXTURE_COMPARE_FUNC,lt[L.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(L.magFilter===Ue||L.minFilter!==Sr&&L.minFilter!==oi||L.type===Wn&&t.has("OES_texture_float_linear")===!1)return;if(L.anisotropy>1||n.get(L).__currentAnisotropy){const Z=t.get("EXT_texture_filter_anisotropic");i.texParameterf(z,Z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(L.anisotropy,s.getMaxAnisotropy())),n.get(L).__currentAnisotropy=L.anisotropy}}}function Lt(z,L){let Z=!1;z.__webglInit===void 0&&(z.__webglInit=!0,L.addEventListener("dispose",S));const at=L.source;let dt=f.get(at);dt===void 0&&(dt={},f.set(at,dt));const ct=F(L);if(ct!==z.__cacheKey){dt[ct]===void 0&&(dt[ct]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,Z=!0),dt[ct].usedTimes++;const Ut=dt[z.__cacheKey];Ut!==void 0&&(dt[z.__cacheKey].usedTimes--,Ut.usedTimes===0&&x(L)),z.__cacheKey=ct,z.__webglTexture=dt[ct].texture}return Z}function J(z,L,Z){let at=i.TEXTURE_2D;(L.isDataArrayTexture||L.isCompressedArrayTexture)&&(at=i.TEXTURE_2D_ARRAY),L.isData3DTexture&&(at=i.TEXTURE_3D);const dt=Lt(z,L),ct=L.source;e.bindTexture(at,z.__webglTexture,i.TEXTURE0+Z);const Ut=n.get(ct);if(ct.version!==Ut.__version||dt===!0){e.activeTexture(i.TEXTURE0+Z);const Et=re.getPrimaries(re.workingColorSpace),It=L.colorSpace===Gn?null:re.getPrimaries(L.colorSpace),ne=L.colorSpace===Gn||Et===It?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,L.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,L.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ne);let mt=y(L.image,!1,s.maxTextureSize);mt=Gt(L,mt);const Dt=r.convert(L.format,L.colorSpace),Vt=r.convert(L.type);let Wt=v(L.internalFormat,Dt,Vt,L.colorSpace,L.isVideoTexture);Mt(at,L);let Nt;const se=L.mipmaps,Jt=L.isVideoTexture!==!0,pe=Ut.__version===void 0||dt===!0,W=ct.dataReady,At=M(L,mt);if(L.isDepthTexture)Wt=w(L.format===ws,L.type),pe&&(Jt?e.texStorage2D(i.TEXTURE_2D,1,Wt,mt.width,mt.height):e.texImage2D(i.TEXTURE_2D,0,Wt,mt.width,mt.height,0,Dt,Vt,null));else if(L.isDataTexture)if(se.length>0){Jt&&pe&&e.texStorage2D(i.TEXTURE_2D,At,Wt,se[0].width,se[0].height);for(let it=0,ut=se.length;it<ut;it++)Nt=se[it],Jt?W&&e.texSubImage2D(i.TEXTURE_2D,it,0,0,Nt.width,Nt.height,Dt,Vt,Nt.data):e.texImage2D(i.TEXTURE_2D,it,Wt,Nt.width,Nt.height,0,Dt,Vt,Nt.data);L.generateMipmaps=!1}else Jt?(pe&&e.texStorage2D(i.TEXTURE_2D,At,Wt,mt.width,mt.height),W&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,mt.width,mt.height,Dt,Vt,mt.data)):e.texImage2D(i.TEXTURE_2D,0,Wt,mt.width,mt.height,0,Dt,Vt,mt.data);else if(L.isCompressedTexture)if(L.isCompressedArrayTexture){Jt&&pe&&e.texStorage3D(i.TEXTURE_2D_ARRAY,At,Wt,se[0].width,se[0].height,mt.depth);for(let it=0,ut=se.length;it<ut;it++)if(Nt=se[it],L.format!==cn)if(Dt!==null)if(Jt){if(W)if(L.layerUpdates.size>0){const Ct=Fu(Nt.width,Nt.height,L.format,L.type);for(const Tt of L.layerUpdates){const Zt=Nt.data.subarray(Tt*Ct/Nt.data.BYTES_PER_ELEMENT,(Tt+1)*Ct/Nt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,Tt,Nt.width,Nt.height,1,Dt,Zt)}L.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,0,Nt.width,Nt.height,mt.depth,Dt,Nt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,it,Wt,Nt.width,Nt.height,mt.depth,0,Nt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Jt?W&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,0,Nt.width,Nt.height,mt.depth,Dt,Vt,Nt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,it,Wt,Nt.width,Nt.height,mt.depth,0,Dt,Vt,Nt.data)}else{Jt&&pe&&e.texStorage2D(i.TEXTURE_2D,At,Wt,se[0].width,se[0].height);for(let it=0,ut=se.length;it<ut;it++)Nt=se[it],L.format!==cn?Dt!==null?Jt?W&&e.compressedTexSubImage2D(i.TEXTURE_2D,it,0,0,Nt.width,Nt.height,Dt,Nt.data):e.compressedTexImage2D(i.TEXTURE_2D,it,Wt,Nt.width,Nt.height,0,Nt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Jt?W&&e.texSubImage2D(i.TEXTURE_2D,it,0,0,Nt.width,Nt.height,Dt,Vt,Nt.data):e.texImage2D(i.TEXTURE_2D,it,Wt,Nt.width,Nt.height,0,Dt,Vt,Nt.data)}else if(L.isDataArrayTexture)if(Jt){if(pe&&e.texStorage3D(i.TEXTURE_2D_ARRAY,At,Wt,mt.width,mt.height,mt.depth),W)if(L.layerUpdates.size>0){const it=Fu(mt.width,mt.height,L.format,L.type);for(const ut of L.layerUpdates){const Ct=mt.data.subarray(ut*it/mt.data.BYTES_PER_ELEMENT,(ut+1)*it/mt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ut,mt.width,mt.height,1,Dt,Vt,Ct)}L.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,mt.width,mt.height,mt.depth,Dt,Vt,mt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Wt,mt.width,mt.height,mt.depth,0,Dt,Vt,mt.data);else if(L.isData3DTexture)Jt?(pe&&e.texStorage3D(i.TEXTURE_3D,At,Wt,mt.width,mt.height,mt.depth),W&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,mt.width,mt.height,mt.depth,Dt,Vt,mt.data)):e.texImage3D(i.TEXTURE_3D,0,Wt,mt.width,mt.height,mt.depth,0,Dt,Vt,mt.data);else if(L.isFramebufferTexture){if(pe)if(Jt)e.texStorage2D(i.TEXTURE_2D,At,Wt,mt.width,mt.height);else{let it=mt.width,ut=mt.height;for(let Ct=0;Ct<At;Ct++)e.texImage2D(i.TEXTURE_2D,Ct,Wt,it,ut,0,Dt,Vt,null),it>>=1,ut>>=1}}else if(se.length>0){if(Jt&&pe){const it=Pt(se[0]);e.texStorage2D(i.TEXTURE_2D,At,Wt,it.width,it.height)}for(let it=0,ut=se.length;it<ut;it++)Nt=se[it],Jt?W&&e.texSubImage2D(i.TEXTURE_2D,it,0,0,Dt,Vt,Nt):e.texImage2D(i.TEXTURE_2D,it,Wt,Dt,Vt,Nt);L.generateMipmaps=!1}else if(Jt){if(pe){const it=Pt(mt);e.texStorage2D(i.TEXTURE_2D,At,Wt,it.width,it.height)}W&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Dt,Vt,mt)}else e.texImage2D(i.TEXTURE_2D,0,Wt,Dt,Vt,mt);m(L)&&p(at),Ut.__version=ct.version,L.onUpdate&&L.onUpdate(L)}z.__version=L.version}function ot(z,L,Z){if(L.image.length!==6)return;const at=Lt(z,L),dt=L.source;e.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+Z);const ct=n.get(dt);if(dt.version!==ct.__version||at===!0){e.activeTexture(i.TEXTURE0+Z);const Ut=re.getPrimaries(re.workingColorSpace),Et=L.colorSpace===Gn?null:re.getPrimaries(L.colorSpace),It=L.colorSpace===Gn||Ut===Et?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,L.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,L.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,It);const ne=L.isCompressedTexture||L.image[0].isCompressedTexture,mt=L.image[0]&&L.image[0].isDataTexture,Dt=[];for(let ut=0;ut<6;ut++)!ne&&!mt?Dt[ut]=y(L.image[ut],!0,s.maxCubemapSize):Dt[ut]=mt?L.image[ut].image:L.image[ut],Dt[ut]=Gt(L,Dt[ut]);const Vt=Dt[0],Wt=r.convert(L.format,L.colorSpace),Nt=r.convert(L.type),se=v(L.internalFormat,Wt,Nt,L.colorSpace),Jt=L.isVideoTexture!==!0,pe=ct.__version===void 0||at===!0,W=dt.dataReady;let At=M(L,Vt);Mt(i.TEXTURE_CUBE_MAP,L);let it;if(ne){Jt&&pe&&e.texStorage2D(i.TEXTURE_CUBE_MAP,At,se,Vt.width,Vt.height);for(let ut=0;ut<6;ut++){it=Dt[ut].mipmaps;for(let Ct=0;Ct<it.length;Ct++){const Tt=it[Ct];L.format!==cn?Wt!==null?Jt?W&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct,0,0,Tt.width,Tt.height,Wt,Tt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct,se,Tt.width,Tt.height,0,Tt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Jt?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct,0,0,Tt.width,Tt.height,Wt,Nt,Tt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct,se,Tt.width,Tt.height,0,Wt,Nt,Tt.data)}}}else{if(it=L.mipmaps,Jt&&pe){it.length>0&&At++;const ut=Pt(Dt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,At,se,ut.width,ut.height)}for(let ut=0;ut<6;ut++)if(mt){Jt?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,0,0,Dt[ut].width,Dt[ut].height,Wt,Nt,Dt[ut].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,se,Dt[ut].width,Dt[ut].height,0,Wt,Nt,Dt[ut].data);for(let Ct=0;Ct<it.length;Ct++){const Zt=it[Ct].image[ut].image;Jt?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct+1,0,0,Zt.width,Zt.height,Wt,Nt,Zt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct+1,se,Zt.width,Zt.height,0,Wt,Nt,Zt.data)}}else{Jt?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,0,0,Wt,Nt,Dt[ut]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,se,Wt,Nt,Dt[ut]);for(let Ct=0;Ct<it.length;Ct++){const Tt=it[Ct];Jt?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct+1,0,0,Wt,Nt,Tt.image[ut]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct+1,se,Wt,Nt,Tt.image[ut])}}}m(L)&&p(i.TEXTURE_CUBE_MAP),ct.__version=dt.version,L.onUpdate&&L.onUpdate(L)}z.__version=L.version}function K(z,L,Z,at,dt,ct){const Ut=r.convert(Z.format,Z.colorSpace),Et=r.convert(Z.type),It=v(Z.internalFormat,Ut,Et,Z.colorSpace),ne=n.get(L),mt=n.get(Z);if(mt.__renderTarget=L,!ne.__hasExternalTextures){const Dt=Math.max(1,L.width>>ct),Vt=Math.max(1,L.height>>ct);dt===i.TEXTURE_3D||dt===i.TEXTURE_2D_ARRAY?e.texImage3D(dt,ct,It,Dt,Vt,L.depth,0,Ut,Et,null):e.texImage2D(dt,ct,It,Dt,Vt,0,Ut,Et,null)}e.bindFramebuffer(i.FRAMEBUFFER,z),gt(L)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,at,dt,mt.__webglTexture,0,st(L)):(dt===i.TEXTURE_2D||dt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&dt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,at,dt,mt.__webglTexture,ct),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Y(z,L,Z){if(i.bindRenderbuffer(i.RENDERBUFFER,z),L.depthBuffer){const at=L.depthTexture,dt=at&&at.isDepthTexture?at.type:null,ct=w(L.stencilBuffer,dt),Ut=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Et=st(L);gt(L)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Et,ct,L.width,L.height):Z?i.renderbufferStorageMultisample(i.RENDERBUFFER,Et,ct,L.width,L.height):i.renderbufferStorage(i.RENDERBUFFER,ct,L.width,L.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ut,i.RENDERBUFFER,z)}else{const at=L.textures;for(let dt=0;dt<at.length;dt++){const ct=at[dt],Ut=r.convert(ct.format,ct.colorSpace),Et=r.convert(ct.type),It=v(ct.internalFormat,Ut,Et,ct.colorSpace),ne=st(L);Z&&gt(L)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,ne,It,L.width,L.height):gt(L)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ne,It,L.width,L.height):i.renderbufferStorage(i.RENDERBUFFER,It,L.width,L.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function rt(z,L){if(L&&L.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,z),!(L.depthTexture&&L.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const at=n.get(L.depthTexture);at.__renderTarget=L,(!at.__webglTexture||L.depthTexture.image.width!==L.width||L.depthTexture.image.height!==L.height)&&(L.depthTexture.image.width=L.width,L.depthTexture.image.height=L.height,L.depthTexture.needsUpdate=!0),N(L.depthTexture,0);const dt=at.__webglTexture,ct=st(L);if(L.depthTexture.format===ps)gt(L)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,dt,0,ct):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,dt,0);else if(L.depthTexture.format===ws)gt(L)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,dt,0,ct):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,dt,0);else throw new Error("Unknown depthTexture format")}function pt(z){const L=n.get(z),Z=z.isWebGLCubeRenderTarget===!0;if(L.__boundDepthTexture!==z.depthTexture){const at=z.depthTexture;if(L.__depthDisposeCallback&&L.__depthDisposeCallback(),at){const dt=()=>{delete L.__boundDepthTexture,delete L.__depthDisposeCallback,at.removeEventListener("dispose",dt)};at.addEventListener("dispose",dt),L.__depthDisposeCallback=dt}L.__boundDepthTexture=at}if(z.depthTexture&&!L.__autoAllocateDepthBuffer){if(Z)throw new Error("target.depthTexture not supported in Cube render targets");rt(L.__webglFramebuffer,z)}else if(Z){L.__webglDepthbuffer=[];for(let at=0;at<6;at++)if(e.bindFramebuffer(i.FRAMEBUFFER,L.__webglFramebuffer[at]),L.__webglDepthbuffer[at]===void 0)L.__webglDepthbuffer[at]=i.createRenderbuffer(),Y(L.__webglDepthbuffer[at],z,!1);else{const dt=z.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ct=L.__webglDepthbuffer[at];i.bindRenderbuffer(i.RENDERBUFFER,ct),i.framebufferRenderbuffer(i.FRAMEBUFFER,dt,i.RENDERBUFFER,ct)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,L.__webglFramebuffer),L.__webglDepthbuffer===void 0)L.__webglDepthbuffer=i.createRenderbuffer(),Y(L.__webglDepthbuffer,z,!1);else{const at=z.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,dt=L.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,dt),i.framebufferRenderbuffer(i.FRAMEBUFFER,at,i.RENDERBUFFER,dt)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function wt(z,L,Z){const at=n.get(z);L!==void 0&&K(at.__webglFramebuffer,z,z.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),Z!==void 0&&pt(z)}function Ft(z){const L=z.texture,Z=n.get(z),at=n.get(L);z.addEventListener("dispose",E);const dt=z.textures,ct=z.isWebGLCubeRenderTarget===!0,Ut=dt.length>1;if(Ut||(at.__webglTexture===void 0&&(at.__webglTexture=i.createTexture()),at.__version=L.version,o.memory.textures++),ct){Z.__webglFramebuffer=[];for(let Et=0;Et<6;Et++)if(L.mipmaps&&L.mipmaps.length>0){Z.__webglFramebuffer[Et]=[];for(let It=0;It<L.mipmaps.length;It++)Z.__webglFramebuffer[Et][It]=i.createFramebuffer()}else Z.__webglFramebuffer[Et]=i.createFramebuffer()}else{if(L.mipmaps&&L.mipmaps.length>0){Z.__webglFramebuffer=[];for(let Et=0;Et<L.mipmaps.length;Et++)Z.__webglFramebuffer[Et]=i.createFramebuffer()}else Z.__webglFramebuffer=i.createFramebuffer();if(Ut)for(let Et=0,It=dt.length;Et<It;Et++){const ne=n.get(dt[Et]);ne.__webglTexture===void 0&&(ne.__webglTexture=i.createTexture(),o.memory.textures++)}if(z.samples>0&&gt(z)===!1){Z.__webglMultisampledFramebuffer=i.createFramebuffer(),Z.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,Z.__webglMultisampledFramebuffer);for(let Et=0;Et<dt.length;Et++){const It=dt[Et];Z.__webglColorRenderbuffer[Et]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,Z.__webglColorRenderbuffer[Et]);const ne=r.convert(It.format,It.colorSpace),mt=r.convert(It.type),Dt=v(It.internalFormat,ne,mt,It.colorSpace,z.isXRRenderTarget===!0),Vt=st(z);i.renderbufferStorageMultisample(i.RENDERBUFFER,Vt,Dt,z.width,z.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Et,i.RENDERBUFFER,Z.__webglColorRenderbuffer[Et])}i.bindRenderbuffer(i.RENDERBUFFER,null),z.depthBuffer&&(Z.__webglDepthRenderbuffer=i.createRenderbuffer(),Y(Z.__webglDepthRenderbuffer,z,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ct){e.bindTexture(i.TEXTURE_CUBE_MAP,at.__webglTexture),Mt(i.TEXTURE_CUBE_MAP,L);for(let Et=0;Et<6;Et++)if(L.mipmaps&&L.mipmaps.length>0)for(let It=0;It<L.mipmaps.length;It++)K(Z.__webglFramebuffer[Et][It],z,L,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,It);else K(Z.__webglFramebuffer[Et],z,L,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0);m(L)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ut){for(let Et=0,It=dt.length;Et<It;Et++){const ne=dt[Et],mt=n.get(ne);e.bindTexture(i.TEXTURE_2D,mt.__webglTexture),Mt(i.TEXTURE_2D,ne),K(Z.__webglFramebuffer,z,ne,i.COLOR_ATTACHMENT0+Et,i.TEXTURE_2D,0),m(ne)&&p(i.TEXTURE_2D)}e.unbindTexture()}else{let Et=i.TEXTURE_2D;if((z.isWebGL3DRenderTarget||z.isWebGLArrayRenderTarget)&&(Et=z.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Et,at.__webglTexture),Mt(Et,L),L.mipmaps&&L.mipmaps.length>0)for(let It=0;It<L.mipmaps.length;It++)K(Z.__webglFramebuffer[It],z,L,i.COLOR_ATTACHMENT0,Et,It);else K(Z.__webglFramebuffer,z,L,i.COLOR_ATTACHMENT0,Et,0);m(L)&&p(Et),e.unbindTexture()}z.depthBuffer&&pt(z)}function nt(z){const L=z.textures;for(let Z=0,at=L.length;Z<at;Z++){const dt=L[Z];if(m(dt)){const ct=_(z),Ut=n.get(dt).__webglTexture;e.bindTexture(ct,Ut),p(ct),e.unbindTexture()}}}const ht=[],k=[];function ft(z){if(z.samples>0){if(gt(z)===!1){const L=z.textures,Z=z.width,at=z.height;let dt=i.COLOR_BUFFER_BIT;const ct=z.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ut=n.get(z),Et=L.length>1;if(Et)for(let It=0;It<L.length;It++)e.bindFramebuffer(i.FRAMEBUFFER,Ut.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Ut.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Ut.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ut.__webglFramebuffer);for(let It=0;It<L.length;It++){if(z.resolveDepthBuffer&&(z.depthBuffer&&(dt|=i.DEPTH_BUFFER_BIT),z.stencilBuffer&&z.resolveStencilBuffer&&(dt|=i.STENCIL_BUFFER_BIT)),Et){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ut.__webglColorRenderbuffer[It]);const ne=n.get(L[It]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ne,0)}i.blitFramebuffer(0,0,Z,at,0,0,Z,at,dt,i.NEAREST),c===!0&&(ht.length=0,k.length=0,ht.push(i.COLOR_ATTACHMENT0+It),z.depthBuffer&&z.resolveDepthBuffer===!1&&(ht.push(ct),k.push(ct),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,k)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ht))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Et)for(let It=0;It<L.length;It++){e.bindFramebuffer(i.FRAMEBUFFER,Ut.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.RENDERBUFFER,Ut.__webglColorRenderbuffer[It]);const ne=n.get(L[It]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Ut.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.TEXTURE_2D,ne,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ut.__webglMultisampledFramebuffer)}else if(z.depthBuffer&&z.resolveDepthBuffer===!1&&c){const L=z.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[L])}}}function st(z){return Math.min(s.maxSamples,z.samples)}function gt(z){const L=n.get(z);return z.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&L.__useRenderToTexture!==!1}function yt(z){const L=o.render.frame;h.get(z)!==L&&(h.set(z,L),z.update())}function Gt(z,L){const Z=z.colorSpace,at=z.format,dt=z.type;return z.isCompressedTexture===!0||z.isVideoTexture===!0||Z!==As&&Z!==Gn&&(re.getTransfer(Z)===ue?(at!==cn||dt!==En)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Z)),L}function Pt(z){return typeof HTMLImageElement<"u"&&z instanceof HTMLImageElement?(l.width=z.naturalWidth||z.width,l.height=z.naturalHeight||z.height):typeof VideoFrame<"u"&&z instanceof VideoFrame?(l.width=z.displayWidth,l.height=z.displayHeight):(l.width=z.width,l.height=z.height),l}this.allocateTextureUnit=C,this.resetTextureUnits=P,this.setTexture2D=N,this.setTexture2DArray=D,this.setTexture3D=B,this.setTextureCube=H,this.rebindTextures=wt,this.setupRenderTarget=Ft,this.updateRenderTargetMipmap=nt,this.updateMultisampleRenderTarget=ft,this.setupDepthRenderbuffer=pt,this.setupFrameBufferTexture=K,this.useMultisampledRTT=gt}function nw(i,t){function e(n,s=Gn){let r;const o=re.getTransfer(s);if(n===En)return i.UNSIGNED_BYTE;if(n===eh)return i.UNSIGNED_SHORT_4_4_4_4;if(n===nh)return i.UNSIGNED_SHORT_5_5_5_1;if(n===B0)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===z0)return i.BYTE;if(n===k0)return i.SHORT;if(n===hr)return i.UNSIGNED_SHORT;if(n===th)return i.INT;if(n===Di)return i.UNSIGNED_INT;if(n===Wn)return i.FLOAT;if(n===li)return i.HALF_FLOAT;if(n===H0)return i.ALPHA;if(n===G0)return i.RGB;if(n===cn)return i.RGBA;if(n===V0)return i.LUMINANCE;if(n===W0)return i.LUMINANCE_ALPHA;if(n===ps)return i.DEPTH_COMPONENT;if(n===ws)return i.DEPTH_STENCIL;if(n===ih)return i.RED;if(n===sh)return i.RED_INTEGER;if(n===X0)return i.RG;if(n===rh)return i.RG_INTEGER;if(n===oh)return i.RGBA_INTEGER;if(n===So||n===Eo||n===Ao||n===To)if(o===ue)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===So)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Eo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ao)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===To)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===So)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Eo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ao)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===To)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===$c||n===Zc||n===Kc||n===jc)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===$c)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Zc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Kc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===jc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Jc||n===Qc||n===tl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Jc||n===Qc)return o===ue?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===tl)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===el||n===nl||n===il||n===sl||n===rl||n===ol||n===al||n===cl||n===ll||n===hl||n===ul||n===dl||n===fl||n===pl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===el)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===nl)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===il)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===sl)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===rl)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ol)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===al)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===cl)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ll)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===hl)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ul)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===dl)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===fl)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===pl)return o===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ro||n===ml||n===gl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Ro)return o===ue?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ml)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===gl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===q0||n===yl||n===vl||n===_l)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ro)return r.COMPRESSED_RED_RGTC1_EXT;if(n===yl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===vl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===_l)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===_s?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class iw extends $e{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class we extends be{constructor(){super(),this.isGroup=!0,this.type="Group"}}const sw={type:"move"};class Ua{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new we,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new we,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new we,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const y of t.hand.values()){const m=e.getJointPose(y,n),p=this._getHandJoint(l,y);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,g=.005;l.inputState.pinching&&f>d+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=d-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(sw)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new we;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const rw=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ow=`
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

}`;class aw{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new Xe,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new sn({vertexShader:rw,fragmentShader:ow,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ee(new hi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class cw extends Ts{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,f=null,d=null,g=null;const y=new aw,m=e.getContextAttributes();let p=null,_=null;const v=[],w=[],M=new tt;let S=null;const E=new $e;E.viewport=new de;const A=new $e;A.viewport=new de;const x=[E,A],b=new iw;let T=null,P=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let ot=v[J];return ot===void 0&&(ot=new Ua,v[J]=ot),ot.getTargetRaySpace()},this.getControllerGrip=function(J){let ot=v[J];return ot===void 0&&(ot=new Ua,v[J]=ot),ot.getGripSpace()},this.getHand=function(J){let ot=v[J];return ot===void 0&&(ot=new Ua,v[J]=ot),ot.getHandSpace()};function C(J){const ot=w.indexOf(J.inputSource);if(ot===-1)return;const K=v[ot];K!==void 0&&(K.update(J.inputSource,J.frame,l||o),K.dispatchEvent({type:J.type,data:J.inputSource}))}function F(){s.removeEventListener("select",C),s.removeEventListener("selectstart",C),s.removeEventListener("selectend",C),s.removeEventListener("squeeze",C),s.removeEventListener("squeezestart",C),s.removeEventListener("squeezeend",C),s.removeEventListener("end",F),s.removeEventListener("inputsourceschange",N);for(let J=0;J<v.length;J++){const ot=w[J];ot!==null&&(w[J]=null,v[J].disconnect(ot))}T=null,P=null,y.reset(),t.setRenderTarget(p),d=null,f=null,u=null,s=null,_=null,Lt.stop(),n.isPresenting=!1,t.setPixelRatio(S),t.setSize(M.width,M.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){a=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",C),s.addEventListener("selectstart",C),s.addEventListener("selectend",C),s.addEventListener("squeeze",C),s.addEventListener("squeezestart",C),s.addEventListener("squeezeend",C),s.addEventListener("end",F),s.addEventListener("inputsourceschange",N),m.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(M),s.renderState.layers===void 0){const ot={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,ot),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),_=new An(d.framebufferWidth,d.framebufferHeight,{format:cn,type:En,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let ot=null,K=null,Y=null;m.depth&&(Y=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,ot=m.stencil?ws:ps,K=m.stencil?_s:Di);const rt={colorFormat:e.RGBA8,depthFormat:Y,scaleFactor:r};u=new XRWebGLBinding(s,e),f=u.createProjectionLayer(rt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),_=new An(f.textureWidth,f.textureHeight,{format:cn,type:En,depthTexture:new dh(f.textureWidth,f.textureHeight,K,void 0,void 0,void 0,void 0,void 0,void 0,ot),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),Lt.setContext(s),Lt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function N(J){for(let ot=0;ot<J.removed.length;ot++){const K=J.removed[ot],Y=w.indexOf(K);Y>=0&&(w[Y]=null,v[Y].disconnect(K))}for(let ot=0;ot<J.added.length;ot++){const K=J.added[ot];let Y=w.indexOf(K);if(Y===-1){for(let pt=0;pt<v.length;pt++)if(pt>=w.length){w.push(K),Y=pt;break}else if(w[pt]===null){w[pt]=K,Y=pt;break}if(Y===-1)break}const rt=v[Y];rt&&rt.connect(K)}}const D=new R,B=new R;function H(J,ot,K){D.setFromMatrixPosition(ot.matrixWorld),B.setFromMatrixPosition(K.matrixWorld);const Y=D.distanceTo(B),rt=ot.projectionMatrix.elements,pt=K.projectionMatrix.elements,wt=rt[14]/(rt[10]-1),Ft=rt[14]/(rt[10]+1),nt=(rt[9]+1)/rt[5],ht=(rt[9]-1)/rt[5],k=(rt[8]-1)/rt[0],ft=(pt[8]+1)/pt[0],st=wt*k,gt=wt*ft,yt=Y/(-k+ft),Gt=yt*-k;if(ot.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Gt),J.translateZ(yt),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),rt[10]===-1)J.projectionMatrix.copy(ot.projectionMatrix),J.projectionMatrixInverse.copy(ot.projectionMatrixInverse);else{const Pt=wt+yt,z=Ft+yt,L=st-Gt,Z=gt+(Y-Gt),at=nt*Ft/z*Pt,dt=ht*Ft/z*Pt;J.projectionMatrix.makePerspective(L,Z,at,dt,Pt,z),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function V(J,ot){ot===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(ot.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let ot=J.near,K=J.far;y.texture!==null&&(y.depthNear>0&&(ot=y.depthNear),y.depthFar>0&&(K=y.depthFar)),b.near=A.near=E.near=ot,b.far=A.far=E.far=K,(T!==b.near||P!==b.far)&&(s.updateRenderState({depthNear:b.near,depthFar:b.far}),T=b.near,P=b.far),E.layers.mask=J.layers.mask|2,A.layers.mask=J.layers.mask|4,b.layers.mask=E.layers.mask|A.layers.mask;const Y=J.parent,rt=b.cameras;V(b,Y);for(let pt=0;pt<rt.length;pt++)V(rt[pt],Y);rt.length===2?H(b,E,A):b.projectionMatrix.copy(E.projectionMatrix),et(J,b,Y)};function et(J,ot,K){K===null?J.matrix.copy(ot.matrixWorld):(J.matrix.copy(K.matrixWorld),J.matrix.invert(),J.matrix.multiply(ot.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(ot.projectionMatrix),J.projectionMatrixInverse.copy(ot.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=xs*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(J){c=J,f!==null&&(f.fixedFoveation=J),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=J)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(b)};let lt=null;function Mt(J,ot){if(h=ot.getViewerPose(l||o),g=ot,h!==null){const K=h.views;d!==null&&(t.setRenderTargetFramebuffer(_,d.framebuffer),t.setRenderTarget(_));let Y=!1;K.length!==b.cameras.length&&(b.cameras.length=0,Y=!0);for(let pt=0;pt<K.length;pt++){const wt=K[pt];let Ft=null;if(d!==null)Ft=d.getViewport(wt);else{const ht=u.getViewSubImage(f,wt);Ft=ht.viewport,pt===0&&(t.setRenderTargetTextures(_,ht.colorTexture,f.ignoreDepthValues?void 0:ht.depthStencilTexture),t.setRenderTarget(_))}let nt=x[pt];nt===void 0&&(nt=new $e,nt.layers.enable(pt),nt.viewport=new de,x[pt]=nt),nt.matrix.fromArray(wt.transform.matrix),nt.matrix.decompose(nt.position,nt.quaternion,nt.scale),nt.projectionMatrix.fromArray(wt.projectionMatrix),nt.projectionMatrixInverse.copy(nt.projectionMatrix).invert(),nt.viewport.set(Ft.x,Ft.y,Ft.width,Ft.height),pt===0&&(b.matrix.copy(nt.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),Y===!0&&b.cameras.push(nt)}const rt=s.enabledFeatures;if(rt&&rt.includes("depth-sensing")){const pt=u.getDepthInformation(K[0]);pt&&pt.isValid&&pt.texture&&y.init(t,pt,s.renderState)}}for(let K=0;K<v.length;K++){const Y=w[K],rt=v[K];Y!==null&&rt!==void 0&&rt.update(Y,ot,l||o)}lt&&lt(J,ot),ot.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ot}),g=null}const Lt=new rf;Lt.setAnimationLoop(Mt),this.setAnimationLoop=function(J){lt=J},this.dispose=function(){}}}const xi=new Tn,lw=new fe;function hw(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,ef(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,_,v,w){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,w)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),y(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,_,v):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===We&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===We&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const _=t.get(p),v=_.envMap,w=_.envMapRotation;v&&(m.envMap.value=v,xi.copy(w),xi.x*=-1,xi.y*=-1,xi.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(xi.y*=-1,xi.z*=-1),m.envMapRotation.value.setFromMatrix4(lw.makeRotationFromEuler(xi)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,_,v){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*_,m.scale.value=v*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,_){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===We&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=_.texture,m.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function y(m,p){const _=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(_.matrixWorld),m.nearDistance.value=_.shadow.camera.near,m.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function uw(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(_,v){const w=v.program;n.uniformBlockBinding(_,w)}function l(_,v){let w=s[_.id];w===void 0&&(g(_),w=h(_),s[_.id]=w,_.addEventListener("dispose",m));const M=v.program;n.updateUBOMapping(_,M);const S=t.render.frame;r[_.id]!==S&&(f(_),r[_.id]=S)}function h(_){const v=u();_.__bindingPointIndex=v;const w=i.createBuffer(),M=_.__size,S=_.usage;return i.bindBuffer(i.UNIFORM_BUFFER,w),i.bufferData(i.UNIFORM_BUFFER,M,S),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,w),w}function u(){for(let _=0;_<a;_++)if(o.indexOf(_)===-1)return o.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(_){const v=s[_.id],w=_.uniforms,M=_.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let S=0,E=w.length;S<E;S++){const A=Array.isArray(w[S])?w[S]:[w[S]];for(let x=0,b=A.length;x<b;x++){const T=A[x];if(d(T,S,x,M)===!0){const P=T.__offset,C=Array.isArray(T.value)?T.value:[T.value];let F=0;for(let N=0;N<C.length;N++){const D=C[N],B=y(D);typeof D=="number"||typeof D=="boolean"?(T.__data[0]=D,i.bufferSubData(i.UNIFORM_BUFFER,P+F,T.__data)):D.isMatrix3?(T.__data[0]=D.elements[0],T.__data[1]=D.elements[1],T.__data[2]=D.elements[2],T.__data[3]=0,T.__data[4]=D.elements[3],T.__data[5]=D.elements[4],T.__data[6]=D.elements[5],T.__data[7]=0,T.__data[8]=D.elements[6],T.__data[9]=D.elements[7],T.__data[10]=D.elements[8],T.__data[11]=0):(D.toArray(T.__data,F),F+=B.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,P,T.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(_,v,w,M){const S=_.value,E=v+"_"+w;if(M[E]===void 0)return typeof S=="number"||typeof S=="boolean"?M[E]=S:M[E]=S.clone(),!0;{const A=M[E];if(typeof S=="number"||typeof S=="boolean"){if(A!==S)return M[E]=S,!0}else if(A.equals(S)===!1)return A.copy(S),!0}return!1}function g(_){const v=_.uniforms;let w=0;const M=16;for(let E=0,A=v.length;E<A;E++){const x=Array.isArray(v[E])?v[E]:[v[E]];for(let b=0,T=x.length;b<T;b++){const P=x[b],C=Array.isArray(P.value)?P.value:[P.value];for(let F=0,N=C.length;F<N;F++){const D=C[F],B=y(D),H=w%M,V=H%B.boundary,et=H+V;w+=V,et!==0&&M-et<B.storage&&(w+=M-et),P.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=w,w+=B.storage}}}const S=w%M;return S>0&&(w+=M-S),_.__size=w,_.__cache={},this}function y(_){const v={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(v.boundary=4,v.storage=4):_.isVector2?(v.boundary=8,v.storage=8):_.isVector3||_.isColor?(v.boundary=16,v.storage=12):_.isVector4?(v.boundary=16,v.storage=16):_.isMatrix3?(v.boundary=48,v.storage=48):_.isMatrix4?(v.boundary=64,v.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),v}function m(_){const v=_.target;v.removeEventListener("dispose",m);const w=o.indexOf(v.__bindingPointIndex);o.splice(w,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function p(){for(const _ in s)i.deleteBuffer(s[_]);o=[],s={},r={}}return{bind:c,update:l,dispose:p}}class dw{constructor(t={}){const{canvas:e=ng(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;const g=new Uint32Array(4),y=new Int32Array(4);let m=null,p=null;const _=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=en,this.toneMapping=ai,this.toneMappingExposure=1;const w=this;let M=!1,S=0,E=0,A=null,x=-1,b=null;const T=new de,P=new de;let C=null;const F=new qt(0);let N=0,D=e.width,B=e.height,H=1,V=null,et=null;const lt=new de(0,0,D,B),Mt=new de(0,0,D,B);let Lt=!1;const J=new lh;let ot=!1,K=!1;const Y=new fe,rt=new fe,pt=new R,wt=new de,Ft={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let nt=!1;function ht(){return A===null?H:1}let k=n;function ft(O,X){return e.getContext(O,X)}try{const O={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Jl}`),e.addEventListener("webglcontextlost",ut,!1),e.addEventListener("webglcontextrestored",Ct,!1),e.addEventListener("webglcontextcreationerror",Tt,!1),k===null){const X="webgl2";if(k=ft(X,O),k===null)throw ft(X)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(O){throw console.error("THREE.WebGLRenderer: "+O.message),O}let st,gt,yt,Gt,Pt,z,L,Z,at,dt,ct,Ut,Et,It,ne,mt,Dt,Vt,Wt,Nt,se,Jt,pe,W;function At(){st=new vv(k),st.init(),Jt=new nw(k,st),gt=new dv(k,st,t,Jt),yt=new Q_(k,st),gt.reverseDepthBuffer&&f&&yt.buffers.depth.setReversed(!0),Gt=new xv(k),Pt=new k_,z=new ew(k,st,yt,Pt,gt,Jt,Gt),L=new pv(w),Z=new yv(w),at=new Rg(k),pe=new hv(k,at),dt=new _v(k,at,Gt,pe),ct=new bv(k,dt,at,Gt),Wt=new Mv(k,gt,z),mt=new fv(Pt),Ut=new z_(w,L,Z,st,gt,pe,mt),Et=new hw(w,Pt),It=new H_,ne=new Y_(st),Vt=new lv(w,L,Z,yt,ct,d,c),Dt=new j_(w,ct,gt),W=new uw(k,Gt,gt,yt),Nt=new uv(k,st,Gt),se=new wv(k,st,Gt),Gt.programs=Ut.programs,w.capabilities=gt,w.extensions=st,w.properties=Pt,w.renderLists=It,w.shadowMap=Dt,w.state=yt,w.info=Gt}At();const it=new cw(w,k);this.xr=it,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const O=st.get("WEBGL_lose_context");O&&O.loseContext()},this.forceContextRestore=function(){const O=st.get("WEBGL_lose_context");O&&O.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(O){O!==void 0&&(H=O,this.setSize(D,B,!1))},this.getSize=function(O){return O.set(D,B)},this.setSize=function(O,X,j=!0){if(it.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}D=O,B=X,e.width=Math.floor(O*H),e.height=Math.floor(X*H),j===!0&&(e.style.width=O+"px",e.style.height=X+"px"),this.setViewport(0,0,O,X)},this.getDrawingBufferSize=function(O){return O.set(D*H,B*H).floor()},this.setDrawingBufferSize=function(O,X,j){D=O,B=X,H=j,e.width=Math.floor(O*j),e.height=Math.floor(X*j),this.setViewport(0,0,O,X)},this.getCurrentViewport=function(O){return O.copy(T)},this.getViewport=function(O){return O.copy(lt)},this.setViewport=function(O,X,j,Q){O.isVector4?lt.set(O.x,O.y,O.z,O.w):lt.set(O,X,j,Q),yt.viewport(T.copy(lt).multiplyScalar(H).round())},this.getScissor=function(O){return O.copy(Mt)},this.setScissor=function(O,X,j,Q){O.isVector4?Mt.set(O.x,O.y,O.z,O.w):Mt.set(O,X,j,Q),yt.scissor(P.copy(Mt).multiplyScalar(H).round())},this.getScissorTest=function(){return Lt},this.setScissorTest=function(O){yt.setScissorTest(Lt=O)},this.setOpaqueSort=function(O){V=O},this.setTransparentSort=function(O){et=O},this.getClearColor=function(O){return O.copy(Vt.getClearColor())},this.setClearColor=function(){Vt.setClearColor.apply(Vt,arguments)},this.getClearAlpha=function(){return Vt.getClearAlpha()},this.setClearAlpha=function(){Vt.setClearAlpha.apply(Vt,arguments)},this.clear=function(O=!0,X=!0,j=!0){let Q=0;if(O){let q=!1;if(A!==null){const _t=A.texture.format;q=_t===oh||_t===rh||_t===sh}if(q){const _t=A.texture.type,Rt=_t===En||_t===Di||_t===hr||_t===_s||_t===eh||_t===nh,Ot=Vt.getClearColor(),zt=Vt.getClearAlpha(),Xt=Ot.r,Kt=Ot.g,kt=Ot.b;Rt?(g[0]=Xt,g[1]=Kt,g[2]=kt,g[3]=zt,k.clearBufferuiv(k.COLOR,0,g)):(y[0]=Xt,y[1]=Kt,y[2]=kt,y[3]=zt,k.clearBufferiv(k.COLOR,0,y))}else Q|=k.COLOR_BUFFER_BIT}X&&(Q|=k.DEPTH_BUFFER_BIT),j&&(Q|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ut,!1),e.removeEventListener("webglcontextrestored",Ct,!1),e.removeEventListener("webglcontextcreationerror",Tt,!1),It.dispose(),ne.dispose(),Pt.dispose(),L.dispose(),Z.dispose(),ct.dispose(),pe.dispose(),W.dispose(),Ut.dispose(),it.dispose(),it.removeEventListener("sessionstart",Ih),it.removeEventListener("sessionend",Lh),mi.stop()};function ut(O){O.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function Ct(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const O=Gt.autoReset,X=Dt.enabled,j=Dt.autoUpdate,Q=Dt.needsUpdate,q=Dt.type;At(),Gt.autoReset=O,Dt.enabled=X,Dt.autoUpdate=j,Dt.needsUpdate=Q,Dt.type=q}function Tt(O){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",O.statusMessage)}function Zt(O){const X=O.target;X.removeEventListener("dispose",Zt),Me(X)}function Me(O){Fe(O),Pt.remove(O)}function Fe(O){const X=Pt.get(O).programs;X!==void 0&&(X.forEach(function(j){Ut.releaseProgram(j)}),O.isShaderMaterial&&Ut.releaseShaderCache(O))}this.renderBufferDirect=function(O,X,j,Q,q,_t){X===null&&(X=Ft);const Rt=q.isMesh&&q.matrixWorld.determinant()<0,Ot=im(O,X,j,Q,q);yt.setMaterial(Q,Rt);let zt=j.index,Xt=1;if(Q.wireframe===!0){if(zt=dt.getWireframeAttribute(j),zt===void 0)return;Xt=2}const Kt=j.drawRange,kt=j.attributes.position;let ae=Kt.start*Xt,me=(Kt.start+Kt.count)*Xt;_t!==null&&(ae=Math.max(ae,_t.start*Xt),me=Math.min(me,(_t.start+_t.count)*Xt)),zt!==null?(ae=Math.max(ae,0),me=Math.min(me,zt.count)):kt!=null&&(ae=Math.max(ae,0),me=Math.min(me,kt.count));const ge=me-ae;if(ge<0||ge===1/0)return;pe.setup(q,Q,Ot,j,zt);let qe,ce=Nt;if(zt!==null&&(qe=at.get(zt),ce=se,ce.setIndex(qe)),q.isMesh)Q.wireframe===!0?(yt.setLineWidth(Q.wireframeLinewidth*ht()),ce.setMode(k.LINES)):ce.setMode(k.TRIANGLES);else if(q.isLine){let Ht=Q.linewidth;Ht===void 0&&(Ht=1),yt.setLineWidth(Ht*ht()),q.isLineSegments?ce.setMode(k.LINES):q.isLineLoop?ce.setMode(k.LINE_LOOP):ce.setMode(k.LINE_STRIP)}else q.isPoints?ce.setMode(k.POINTS):q.isSprite&&ce.setMode(k.TRIANGLES);if(q.isBatchedMesh)if(q._multiDrawInstances!==null)ce.renderMultiDrawInstances(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount,q._multiDrawInstances);else if(st.get("WEBGL_multi_draw"))ce.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{const Ht=q._multiDrawStarts,Ln=q._multiDrawCounts,le=q._multiDrawCount,un=zt?at.get(zt).bytesPerElement:1,Bi=Pt.get(Q).currentProgram.getUniforms();for(let je=0;je<le;je++)Bi.setValue(k,"_gl_DrawID",je),ce.render(Ht[je]/un,Ln[je])}else if(q.isInstancedMesh)ce.renderInstances(ae,ge,q.count);else if(j.isInstancedBufferGeometry){const Ht=j._maxInstanceCount!==void 0?j._maxInstanceCount:1/0,Ln=Math.min(j.instanceCount,Ht);ce.renderInstances(ae,ge,Ln)}else ce.render(ae,ge)};function he(O,X,j){O.transparent===!0&&O.side===mn&&O.forceSinglePass===!1?(O.side=We,O.needsUpdate=!0,br(O,X,j),O.side=ci,O.needsUpdate=!0,br(O,X,j),O.side=mn):br(O,X,j)}this.compile=function(O,X,j=null){j===null&&(j=O),p=ne.get(j),p.init(X),v.push(p),j.traverseVisible(function(q){q.isLight&&q.layers.test(X.layers)&&(p.pushLight(q),q.castShadow&&p.pushShadow(q))}),O!==j&&O.traverseVisible(function(q){q.isLight&&q.layers.test(X.layers)&&(p.pushLight(q),q.castShadow&&p.pushShadow(q))}),p.setupLights();const Q=new Set;return O.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;const _t=q.material;if(_t)if(Array.isArray(_t))for(let Rt=0;Rt<_t.length;Rt++){const Ot=_t[Rt];he(Ot,j,q),Q.add(Ot)}else he(_t,j,q),Q.add(_t)}),v.pop(),p=null,Q},this.compileAsync=function(O,X,j=null){const Q=this.compile(O,X,j);return new Promise(q=>{function _t(){if(Q.forEach(function(Rt){Pt.get(Rt).currentProgram.isReady()&&Q.delete(Rt)}),Q.size===0){q(O);return}setTimeout(_t,10)}st.get("KHR_parallel_shader_compile")!==null?_t():setTimeout(_t,10)})};let hn=null;function In(O){hn&&hn(O)}function Ih(){mi.stop()}function Lh(){mi.start()}const mi=new rf;mi.setAnimationLoop(In),typeof self<"u"&&mi.setContext(self),this.setAnimationLoop=function(O){hn=O,it.setAnimationLoop(O),O===null?mi.stop():mi.start()},it.addEventListener("sessionstart",Ih),it.addEventListener("sessionend",Lh),this.render=function(O,X){if(X!==void 0&&X.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;if(O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),X.parent===null&&X.matrixWorldAutoUpdate===!0&&X.updateMatrixWorld(),it.enabled===!0&&it.isPresenting===!0&&(it.cameraAutoUpdate===!0&&it.updateCamera(X),X=it.getCamera()),O.isScene===!0&&O.onBeforeRender(w,O,X,A),p=ne.get(O,v.length),p.init(X),v.push(p),rt.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),J.setFromProjectionMatrix(rt),K=this.localClippingEnabled,ot=mt.init(this.clippingPlanes,K),m=It.get(O,_.length),m.init(),_.push(m),it.enabled===!0&&it.isPresenting===!0){const _t=w.xr.getDepthSensingMesh();_t!==null&&aa(_t,X,-1/0,w.sortObjects)}aa(O,X,0,w.sortObjects),m.finish(),w.sortObjects===!0&&m.sort(V,et),nt=it.enabled===!1||it.isPresenting===!1||it.hasDepthSensing()===!1,nt&&Vt.addToRenderList(m,O),this.info.render.frame++,ot===!0&&mt.beginShadows();const j=p.state.shadowsArray;Dt.render(j,O,X),ot===!0&&mt.endShadows(),this.info.autoReset===!0&&this.info.reset();const Q=m.opaque,q=m.transmissive;if(p.setupLights(),X.isArrayCamera){const _t=X.cameras;if(q.length>0)for(let Rt=0,Ot=_t.length;Rt<Ot;Rt++){const zt=_t[Rt];Nh(Q,q,O,zt)}nt&&Vt.render(O);for(let Rt=0,Ot=_t.length;Rt<Ot;Rt++){const zt=_t[Rt];Dh(m,O,zt,zt.viewport)}}else q.length>0&&Nh(Q,q,O,X),nt&&Vt.render(O),Dh(m,O,X);A!==null&&(z.updateMultisampleRenderTarget(A),z.updateRenderTargetMipmap(A)),O.isScene===!0&&O.onAfterRender(w,O,X),pe.resetDefaultState(),x=-1,b=null,v.pop(),v.length>0?(p=v[v.length-1],ot===!0&&mt.setGlobalState(w.clippingPlanes,p.state.camera)):p=null,_.pop(),_.length>0?m=_[_.length-1]:m=null};function aa(O,X,j,Q){if(O.visible===!1)return;if(O.layers.test(X.layers)){if(O.isGroup)j=O.renderOrder;else if(O.isLOD)O.autoUpdate===!0&&O.update(X);else if(O.isLight)p.pushLight(O),O.castShadow&&p.pushShadow(O);else if(O.isSprite){if(!O.frustumCulled||J.intersectsSprite(O)){Q&&wt.setFromMatrixPosition(O.matrixWorld).applyMatrix4(rt);const Rt=ct.update(O),Ot=O.material;Ot.visible&&m.push(O,Rt,Ot,j,wt.z,null)}}else if((O.isMesh||O.isLine||O.isPoints)&&(!O.frustumCulled||J.intersectsObject(O))){const Rt=ct.update(O),Ot=O.material;if(Q&&(O.boundingSphere!==void 0?(O.boundingSphere===null&&O.computeBoundingSphere(),wt.copy(O.boundingSphere.center)):(Rt.boundingSphere===null&&Rt.computeBoundingSphere(),wt.copy(Rt.boundingSphere.center)),wt.applyMatrix4(O.matrixWorld).applyMatrix4(rt)),Array.isArray(Ot)){const zt=Rt.groups;for(let Xt=0,Kt=zt.length;Xt<Kt;Xt++){const kt=zt[Xt],ae=Ot[kt.materialIndex];ae&&ae.visible&&m.push(O,Rt,ae,j,wt.z,kt)}}else Ot.visible&&m.push(O,Rt,Ot,j,wt.z,null)}}const _t=O.children;for(let Rt=0,Ot=_t.length;Rt<Ot;Rt++)aa(_t[Rt],X,j,Q)}function Dh(O,X,j,Q){const q=O.opaque,_t=O.transmissive,Rt=O.transparent;p.setupLightsView(j),ot===!0&&mt.setGlobalState(w.clippingPlanes,j),Q&&yt.viewport(T.copy(Q)),q.length>0&&Mr(q,X,j),_t.length>0&&Mr(_t,X,j),Rt.length>0&&Mr(Rt,X,j),yt.buffers.depth.setTest(!0),yt.buffers.depth.setMask(!0),yt.buffers.color.setMask(!0),yt.setPolygonOffset(!1)}function Nh(O,X,j,Q){if((j.isScene===!0?j.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Q.id]===void 0&&(p.state.transmissionRenderTarget[Q.id]=new An(1,1,{generateMipmaps:!0,type:st.has("EXT_color_buffer_half_float")||st.has("EXT_color_buffer_float")?li:En,minFilter:oi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:re.workingColorSpace}));const _t=p.state.transmissionRenderTarget[Q.id],Rt=Q.viewport||T;_t.setSize(Rt.z,Rt.w);const Ot=w.getRenderTarget();w.setRenderTarget(_t),w.getClearColor(F),N=w.getClearAlpha(),N<1&&w.setClearColor(16777215,.5),w.clear(),nt&&Vt.render(j);const zt=w.toneMapping;w.toneMapping=ai;const Xt=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),p.setupLightsView(Q),ot===!0&&mt.setGlobalState(w.clippingPlanes,Q),Mr(O,j,Q),z.updateMultisampleRenderTarget(_t),z.updateRenderTargetMipmap(_t),st.has("WEBGL_multisampled_render_to_texture")===!1){let Kt=!1;for(let kt=0,ae=X.length;kt<ae;kt++){const me=X[kt],ge=me.object,qe=me.geometry,ce=me.material,Ht=me.group;if(ce.side===mn&&ge.layers.test(Q.layers)){const Ln=ce.side;ce.side=We,ce.needsUpdate=!0,Uh(ge,j,Q,qe,ce,Ht),ce.side=Ln,ce.needsUpdate=!0,Kt=!0}}Kt===!0&&(z.updateMultisampleRenderTarget(_t),z.updateRenderTargetMipmap(_t))}w.setRenderTarget(Ot),w.setClearColor(F,N),Xt!==void 0&&(Q.viewport=Xt),w.toneMapping=zt}function Mr(O,X,j){const Q=X.isScene===!0?X.overrideMaterial:null;for(let q=0,_t=O.length;q<_t;q++){const Rt=O[q],Ot=Rt.object,zt=Rt.geometry,Xt=Q===null?Rt.material:Q,Kt=Rt.group;Ot.layers.test(j.layers)&&Uh(Ot,X,j,zt,Xt,Kt)}}function Uh(O,X,j,Q,q,_t){O.onBeforeRender(w,X,j,Q,q,_t),O.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,O.matrixWorld),O.normalMatrix.getNormalMatrix(O.modelViewMatrix),q.onBeforeRender(w,X,j,Q,O,_t),q.transparent===!0&&q.side===mn&&q.forceSinglePass===!1?(q.side=We,q.needsUpdate=!0,w.renderBufferDirect(j,X,Q,q,O,_t),q.side=ci,q.needsUpdate=!0,w.renderBufferDirect(j,X,Q,q,O,_t),q.side=mn):w.renderBufferDirect(j,X,Q,q,O,_t),O.onAfterRender(w,X,j,Q,q,_t)}function br(O,X,j){X.isScene!==!0&&(X=Ft);const Q=Pt.get(O),q=p.state.lights,_t=p.state.shadowsArray,Rt=q.state.version,Ot=Ut.getParameters(O,q.state,_t,X,j),zt=Ut.getProgramCacheKey(Ot);let Xt=Q.programs;Q.environment=O.isMeshStandardMaterial?X.environment:null,Q.fog=X.fog,Q.envMap=(O.isMeshStandardMaterial?Z:L).get(O.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&O.envMap===null?X.environmentRotation:O.envMapRotation,Xt===void 0&&(O.addEventListener("dispose",Zt),Xt=new Map,Q.programs=Xt);let Kt=Xt.get(zt);if(Kt!==void 0){if(Q.currentProgram===Kt&&Q.lightsStateVersion===Rt)return Oh(O,Ot),Kt}else Ot.uniforms=Ut.getUniforms(O),O.onBeforeCompile(Ot,w),Kt=Ut.acquireProgram(Ot,zt),Xt.set(zt,Kt),Q.uniforms=Ot.uniforms;const kt=Q.uniforms;return(!O.isShaderMaterial&&!O.isRawShaderMaterial||O.clipping===!0)&&(kt.clippingPlanes=mt.uniform),Oh(O,Ot),Q.needsLights=rm(O),Q.lightsStateVersion=Rt,Q.needsLights&&(kt.ambientLightColor.value=q.state.ambient,kt.lightProbe.value=q.state.probe,kt.directionalLights.value=q.state.directional,kt.directionalLightShadows.value=q.state.directionalShadow,kt.spotLights.value=q.state.spot,kt.spotLightShadows.value=q.state.spotShadow,kt.rectAreaLights.value=q.state.rectArea,kt.ltc_1.value=q.state.rectAreaLTC1,kt.ltc_2.value=q.state.rectAreaLTC2,kt.pointLights.value=q.state.point,kt.pointLightShadows.value=q.state.pointShadow,kt.hemisphereLights.value=q.state.hemi,kt.directionalShadowMap.value=q.state.directionalShadowMap,kt.directionalShadowMatrix.value=q.state.directionalShadowMatrix,kt.spotShadowMap.value=q.state.spotShadowMap,kt.spotLightMatrix.value=q.state.spotLightMatrix,kt.spotLightMap.value=q.state.spotLightMap,kt.pointShadowMap.value=q.state.pointShadowMap,kt.pointShadowMatrix.value=q.state.pointShadowMatrix),Q.currentProgram=Kt,Q.uniformsList=null,Kt}function Fh(O){if(O.uniformsList===null){const X=O.currentProgram.getUniforms();O.uniformsList=Co.seqWithValue(X.seq,O.uniforms)}return O.uniformsList}function Oh(O,X){const j=Pt.get(O);j.outputColorSpace=X.outputColorSpace,j.batching=X.batching,j.batchingColor=X.batchingColor,j.instancing=X.instancing,j.instancingColor=X.instancingColor,j.instancingMorph=X.instancingMorph,j.skinning=X.skinning,j.morphTargets=X.morphTargets,j.morphNormals=X.morphNormals,j.morphColors=X.morphColors,j.morphTargetsCount=X.morphTargetsCount,j.numClippingPlanes=X.numClippingPlanes,j.numIntersection=X.numClipIntersection,j.vertexAlphas=X.vertexAlphas,j.vertexTangents=X.vertexTangents,j.toneMapping=X.toneMapping}function im(O,X,j,Q,q){X.isScene!==!0&&(X=Ft),z.resetTextureUnits();const _t=X.fog,Rt=Q.isMeshStandardMaterial?X.environment:null,Ot=A===null?w.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:As,zt=(Q.isMeshStandardMaterial?Z:L).get(Q.envMap||Rt),Xt=Q.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,Kt=!!j.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),kt=!!j.morphAttributes.position,ae=!!j.morphAttributes.normal,me=!!j.morphAttributes.color;let ge=ai;Q.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(ge=w.toneMapping);const qe=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,ce=qe!==void 0?qe.length:0,Ht=Pt.get(Q),Ln=p.state.lights;if(ot===!0&&(K===!0||O!==b)){const rn=O===b&&Q.id===x;mt.setState(Q,O,rn)}let le=!1;Q.version===Ht.__version?(Ht.needsLights&&Ht.lightsStateVersion!==Ln.state.version||Ht.outputColorSpace!==Ot||q.isBatchedMesh&&Ht.batching===!1||!q.isBatchedMesh&&Ht.batching===!0||q.isBatchedMesh&&Ht.batchingColor===!0&&q.colorTexture===null||q.isBatchedMesh&&Ht.batchingColor===!1&&q.colorTexture!==null||q.isInstancedMesh&&Ht.instancing===!1||!q.isInstancedMesh&&Ht.instancing===!0||q.isSkinnedMesh&&Ht.skinning===!1||!q.isSkinnedMesh&&Ht.skinning===!0||q.isInstancedMesh&&Ht.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&Ht.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&Ht.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&Ht.instancingMorph===!1&&q.morphTexture!==null||Ht.envMap!==zt||Q.fog===!0&&Ht.fog!==_t||Ht.numClippingPlanes!==void 0&&(Ht.numClippingPlanes!==mt.numPlanes||Ht.numIntersection!==mt.numIntersection)||Ht.vertexAlphas!==Xt||Ht.vertexTangents!==Kt||Ht.morphTargets!==kt||Ht.morphNormals!==ae||Ht.morphColors!==me||Ht.toneMapping!==ge||Ht.morphTargetsCount!==ce)&&(le=!0):(le=!0,Ht.__version=Q.version);let un=Ht.currentProgram;le===!0&&(un=br(Q,X,q));let Bi=!1,je=!1,Is=!1;const ye=un.getUniforms(),gn=Ht.uniforms;if(yt.useProgram(un.program)&&(Bi=!0,je=!0,Is=!0),Q.id!==x&&(x=Q.id,je=!0),Bi||b!==O){yt.buffers.depth.getReversed()?(Y.copy(O.projectionMatrix),sg(Y),rg(Y),ye.setValue(k,"projectionMatrix",Y)):ye.setValue(k,"projectionMatrix",O.projectionMatrix),ye.setValue(k,"viewMatrix",O.matrixWorldInverse);const jn=ye.map.cameraPosition;jn!==void 0&&jn.setValue(k,pt.setFromMatrixPosition(O.matrixWorld)),gt.logarithmicDepthBuffer&&ye.setValue(k,"logDepthBufFC",2/(Math.log(O.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&ye.setValue(k,"isOrthographic",O.isOrthographicCamera===!0),b!==O&&(b=O,je=!0,Is=!0)}if(q.isSkinnedMesh){ye.setOptional(k,q,"bindMatrix"),ye.setOptional(k,q,"bindMatrixInverse");const rn=q.skeleton;rn&&(rn.boneTexture===null&&rn.computeBoneTexture(),ye.setValue(k,"boneTexture",rn.boneTexture,z))}q.isBatchedMesh&&(ye.setOptional(k,q,"batchingTexture"),ye.setValue(k,"batchingTexture",q._matricesTexture,z),ye.setOptional(k,q,"batchingIdTexture"),ye.setValue(k,"batchingIdTexture",q._indirectTexture,z),ye.setOptional(k,q,"batchingColorTexture"),q._colorsTexture!==null&&ye.setValue(k,"batchingColorTexture",q._colorsTexture,z));const Ls=j.morphAttributes;if((Ls.position!==void 0||Ls.normal!==void 0||Ls.color!==void 0)&&Wt.update(q,j,un),(je||Ht.receiveShadow!==q.receiveShadow)&&(Ht.receiveShadow=q.receiveShadow,ye.setValue(k,"receiveShadow",q.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(gn.envMap.value=zt,gn.flipEnvMap.value=zt.isCubeTexture&&zt.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&X.environment!==null&&(gn.envMapIntensity.value=X.environmentIntensity),je&&(ye.setValue(k,"toneMappingExposure",w.toneMappingExposure),Ht.needsLights&&sm(gn,Is),_t&&Q.fog===!0&&Et.refreshFogUniforms(gn,_t),Et.refreshMaterialUniforms(gn,Q,H,B,p.state.transmissionRenderTarget[O.id]),Co.upload(k,Fh(Ht),gn,z)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(Co.upload(k,Fh(Ht),gn,z),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&ye.setValue(k,"center",q.center),ye.setValue(k,"modelViewMatrix",q.modelViewMatrix),ye.setValue(k,"normalMatrix",q.normalMatrix),ye.setValue(k,"modelMatrix",q.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){const rn=Q.uniformsGroups;for(let jn=0,Jn=rn.length;jn<Jn;jn++){const zh=rn[jn];W.update(zh,un),W.bind(zh,un)}}return un}function sm(O,X){O.ambientLightColor.needsUpdate=X,O.lightProbe.needsUpdate=X,O.directionalLights.needsUpdate=X,O.directionalLightShadows.needsUpdate=X,O.pointLights.needsUpdate=X,O.pointLightShadows.needsUpdate=X,O.spotLights.needsUpdate=X,O.spotLightShadows.needsUpdate=X,O.rectAreaLights.needsUpdate=X,O.hemisphereLights.needsUpdate=X}function rm(O){return O.isMeshLambertMaterial||O.isMeshToonMaterial||O.isMeshPhongMaterial||O.isMeshStandardMaterial||O.isShadowMaterial||O.isShaderMaterial&&O.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(O,X,j){Pt.get(O.texture).__webglTexture=X,Pt.get(O.depthTexture).__webglTexture=j;const Q=Pt.get(O);Q.__hasExternalTextures=!0,Q.__autoAllocateDepthBuffer=j===void 0,Q.__autoAllocateDepthBuffer||st.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Q.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(O,X){const j=Pt.get(O);j.__webglFramebuffer=X,j.__useDefaultFramebuffer=X===void 0},this.setRenderTarget=function(O,X=0,j=0){A=O,S=X,E=j;let Q=!0,q=null,_t=!1,Rt=!1;if(O){const zt=Pt.get(O);if(zt.__useDefaultFramebuffer!==void 0)yt.bindFramebuffer(k.FRAMEBUFFER,null),Q=!1;else if(zt.__webglFramebuffer===void 0)z.setupRenderTarget(O);else if(zt.__hasExternalTextures)z.rebindTextures(O,Pt.get(O.texture).__webglTexture,Pt.get(O.depthTexture).__webglTexture);else if(O.depthBuffer){const kt=O.depthTexture;if(zt.__boundDepthTexture!==kt){if(kt!==null&&Pt.has(kt)&&(O.width!==kt.image.width||O.height!==kt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");z.setupDepthRenderbuffer(O)}}const Xt=O.texture;(Xt.isData3DTexture||Xt.isDataArrayTexture||Xt.isCompressedArrayTexture)&&(Rt=!0);const Kt=Pt.get(O).__webglFramebuffer;O.isWebGLCubeRenderTarget?(Array.isArray(Kt[X])?q=Kt[X][j]:q=Kt[X],_t=!0):O.samples>0&&z.useMultisampledRTT(O)===!1?q=Pt.get(O).__webglMultisampledFramebuffer:Array.isArray(Kt)?q=Kt[j]:q=Kt,T.copy(O.viewport),P.copy(O.scissor),C=O.scissorTest}else T.copy(lt).multiplyScalar(H).floor(),P.copy(Mt).multiplyScalar(H).floor(),C=Lt;if(yt.bindFramebuffer(k.FRAMEBUFFER,q)&&Q&&yt.drawBuffers(O,q),yt.viewport(T),yt.scissor(P),yt.setScissorTest(C),_t){const zt=Pt.get(O.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+X,zt.__webglTexture,j)}else if(Rt){const zt=Pt.get(O.texture),Xt=X||0;k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,zt.__webglTexture,j||0,Xt)}x=-1},this.readRenderTargetPixels=function(O,X,j,Q,q,_t,Rt){if(!(O&&O.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ot=Pt.get(O).__webglFramebuffer;if(O.isWebGLCubeRenderTarget&&Rt!==void 0&&(Ot=Ot[Rt]),Ot){yt.bindFramebuffer(k.FRAMEBUFFER,Ot);try{const zt=O.texture,Xt=zt.format,Kt=zt.type;if(!gt.textureFormatReadable(Xt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!gt.textureTypeReadable(Kt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}X>=0&&X<=O.width-Q&&j>=0&&j<=O.height-q&&k.readPixels(X,j,Q,q,Jt.convert(Xt),Jt.convert(Kt),_t)}finally{const zt=A!==null?Pt.get(A).__webglFramebuffer:null;yt.bindFramebuffer(k.FRAMEBUFFER,zt)}}},this.readRenderTargetPixelsAsync=async function(O,X,j,Q,q,_t,Rt){if(!(O&&O.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ot=Pt.get(O).__webglFramebuffer;if(O.isWebGLCubeRenderTarget&&Rt!==void 0&&(Ot=Ot[Rt]),Ot){const zt=O.texture,Xt=zt.format,Kt=zt.type;if(!gt.textureFormatReadable(Xt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!gt.textureTypeReadable(Kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(X>=0&&X<=O.width-Q&&j>=0&&j<=O.height-q){yt.bindFramebuffer(k.FRAMEBUFFER,Ot);const kt=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,kt),k.bufferData(k.PIXEL_PACK_BUFFER,_t.byteLength,k.STREAM_READ),k.readPixels(X,j,Q,q,Jt.convert(Xt),Jt.convert(Kt),0);const ae=A!==null?Pt.get(A).__webglFramebuffer:null;yt.bindFramebuffer(k.FRAMEBUFFER,ae);const me=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await ig(k,me,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,kt),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,_t),k.deleteBuffer(kt),k.deleteSync(me),_t}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(O,X=null,j=0){O.isTexture!==!0&&(Qs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),X=arguments[0]||null,O=arguments[1]);const Q=Math.pow(2,-j),q=Math.floor(O.image.width*Q),_t=Math.floor(O.image.height*Q),Rt=X!==null?X.x:0,Ot=X!==null?X.y:0;z.setTexture2D(O,0),k.copyTexSubImage2D(k.TEXTURE_2D,j,0,0,Rt,Ot,q,_t),yt.unbindTexture()},this.copyTextureToTexture=function(O,X,j=null,Q=null,q=0){O.isTexture!==!0&&(Qs("WebGLRenderer: copyTextureToTexture function signature has changed."),Q=arguments[0]||null,O=arguments[1],X=arguments[2],q=arguments[3]||0,j=null);let _t,Rt,Ot,zt,Xt,Kt,kt,ae,me;const ge=O.isCompressedTexture?O.mipmaps[q]:O.image;j!==null?(_t=j.max.x-j.min.x,Rt=j.max.y-j.min.y,Ot=j.isBox3?j.max.z-j.min.z:1,zt=j.min.x,Xt=j.min.y,Kt=j.isBox3?j.min.z:0):(_t=ge.width,Rt=ge.height,Ot=ge.depth||1,zt=0,Xt=0,Kt=0),Q!==null?(kt=Q.x,ae=Q.y,me=Q.z):(kt=0,ae=0,me=0);const qe=Jt.convert(X.format),ce=Jt.convert(X.type);let Ht;X.isData3DTexture?(z.setTexture3D(X,0),Ht=k.TEXTURE_3D):X.isDataArrayTexture||X.isCompressedArrayTexture?(z.setTexture2DArray(X,0),Ht=k.TEXTURE_2D_ARRAY):(z.setTexture2D(X,0),Ht=k.TEXTURE_2D),k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,X.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,X.unpackAlignment);const Ln=k.getParameter(k.UNPACK_ROW_LENGTH),le=k.getParameter(k.UNPACK_IMAGE_HEIGHT),un=k.getParameter(k.UNPACK_SKIP_PIXELS),Bi=k.getParameter(k.UNPACK_SKIP_ROWS),je=k.getParameter(k.UNPACK_SKIP_IMAGES);k.pixelStorei(k.UNPACK_ROW_LENGTH,ge.width),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,ge.height),k.pixelStorei(k.UNPACK_SKIP_PIXELS,zt),k.pixelStorei(k.UNPACK_SKIP_ROWS,Xt),k.pixelStorei(k.UNPACK_SKIP_IMAGES,Kt);const Is=O.isDataArrayTexture||O.isData3DTexture,ye=X.isDataArrayTexture||X.isData3DTexture;if(O.isRenderTargetTexture||O.isDepthTexture){const gn=Pt.get(O),Ls=Pt.get(X),rn=Pt.get(gn.__renderTarget),jn=Pt.get(Ls.__renderTarget);yt.bindFramebuffer(k.READ_FRAMEBUFFER,rn.__webglFramebuffer),yt.bindFramebuffer(k.DRAW_FRAMEBUFFER,jn.__webglFramebuffer);for(let Jn=0;Jn<Ot;Jn++)Is&&k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Pt.get(O).__webglTexture,q,Kt+Jn),O.isDepthTexture?(ye&&k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Pt.get(X).__webglTexture,q,me+Jn),k.blitFramebuffer(zt,Xt,_t,Rt,kt,ae,_t,Rt,k.DEPTH_BUFFER_BIT,k.NEAREST)):ye?k.copyTexSubImage3D(Ht,q,kt,ae,me+Jn,zt,Xt,_t,Rt):k.copyTexSubImage2D(Ht,q,kt,ae,me+Jn,zt,Xt,_t,Rt);yt.bindFramebuffer(k.READ_FRAMEBUFFER,null),yt.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else ye?O.isDataTexture||O.isData3DTexture?k.texSubImage3D(Ht,q,kt,ae,me,_t,Rt,Ot,qe,ce,ge.data):X.isCompressedArrayTexture?k.compressedTexSubImage3D(Ht,q,kt,ae,me,_t,Rt,Ot,qe,ge.data):k.texSubImage3D(Ht,q,kt,ae,me,_t,Rt,Ot,qe,ce,ge):O.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,q,kt,ae,_t,Rt,qe,ce,ge.data):O.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,q,kt,ae,ge.width,ge.height,qe,ge.data):k.texSubImage2D(k.TEXTURE_2D,q,kt,ae,_t,Rt,qe,ce,ge);k.pixelStorei(k.UNPACK_ROW_LENGTH,Ln),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,le),k.pixelStorei(k.UNPACK_SKIP_PIXELS,un),k.pixelStorei(k.UNPACK_SKIP_ROWS,Bi),k.pixelStorei(k.UNPACK_SKIP_IMAGES,je),q===0&&X.generateMipmaps&&k.generateMipmap(Ht),yt.unbindTexture()},this.copyTextureToTexture3D=function(O,X,j=null,Q=null,q=0){return O.isTexture!==!0&&(Qs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),j=arguments[0]||null,Q=arguments[1]||null,O=arguments[2],X=arguments[3],q=arguments[4]||0),Qs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(O,X,j,Q,q)},this.initRenderTarget=function(O){Pt.get(O).__webglFramebuffer===void 0&&z.setupRenderTarget(O)},this.initTexture=function(O){O.isCubeTexture?z.setTextureCube(O,0):O.isData3DTexture?z.setTexture3D(O,0):O.isDataArrayTexture||O.isCompressedArrayTexture?z.setTexture2DArray(O,0):z.setTexture2D(O,0),yt.unbindTexture()},this.resetState=function(){S=0,E=0,A=null,yt.reset(),pe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Xn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=re._getDrawingBufferColorSpace(t),e.unpackColorSpace=re._getUnpackColorSpace()}}class ea{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new qt(t),this.near=e,this.far=n}clone(){return new ea(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class fw extends be{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Tn,this.environmentIntensity=1,this.environmentRotation=new Tn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class uf extends Xe{constructor(t=null,e=1,n=1,s,r,o,a,c,l=Ue,h=Ue,u,f){super(null,o,a,c,l,h,s,r,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class df extends fi{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new qt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const No=new R,Uo=new R,Ou=new fe,Os=new mr,Xr=new Rs,Fa=new R,zu=new R;class pw extends be{constructor(t=new Ie,e=new df){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)No.fromBufferAttribute(e,s-1),Uo.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=No.distanceTo(Uo);t.setAttribute("lineDistance",new oe(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Xr.copy(n.boundingSphere),Xr.applyMatrix4(s),Xr.radius+=r,t.ray.intersectsSphere(Xr)===!1)return;Ou.copy(s).invert(),Os.copy(t.ray).applyMatrix4(Ou);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){const d=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let y=d,m=g-1;y<m;y+=l){const p=h.getX(y),_=h.getX(y+1),v=qr(this,t,Os,c,p,_);v&&e.push(v)}if(this.isLineLoop){const y=h.getX(g-1),m=h.getX(d),p=qr(this,t,Os,c,y,m);p&&e.push(p)}}else{const d=Math.max(0,o.start),g=Math.min(f.count,o.start+o.count);for(let y=d,m=g-1;y<m;y+=l){const p=qr(this,t,Os,c,y,y+1);p&&e.push(p)}if(this.isLineLoop){const y=qr(this,t,Os,c,g-1,d);y&&e.push(y)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function qr(i,t,e,n,s,r){const o=i.geometry.attributes.position;if(No.fromBufferAttribute(o,s),Uo.fromBufferAttribute(o,r),e.distanceSqToSegment(No,Uo,Fa,zu)>n)return;Fa.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Fa);if(!(c<t.near||c>t.far))return{distance:c,point:zu.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const ku=new R,Bu=new R;class fh extends pw{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)ku.fromBufferAttribute(e,s),Bu.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+ku.distanceTo(Bu);t.setAttribute("lineDistance",new oe(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class mw extends fi{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new qt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Hu=new fe,xl=new mr,Yr=new Rs,$r=new R;class gw extends be{constructor(t=new Ie,e=new mw){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Yr.copy(n.boundingSphere),Yr.applyMatrix4(s),Yr.radius+=r,t.ray.intersectsSphere(Yr)===!1)return;Hu.copy(s).invert(),xl.copy(t.ray).applyMatrix4(Hu);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,u=n.attributes.position;if(l!==null){const f=Math.max(0,o.start),d=Math.min(l.count,o.start+o.count);for(let g=f,y=d;g<y;g++){const m=l.getX(g);$r.fromBufferAttribute(u,m),Gu($r,m,c,s,t,e,this)}}else{const f=Math.max(0,o.start),d=Math.min(u.count,o.start+o.count);for(let g=f,y=d;g<y;g++)$r.fromBufferAttribute(u,g),Gu($r,g,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Gu(i,t,e,n,s,r,o){const a=xl.distanceSqToPoint(i);if(a<e){const c=new R;xl.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class Pn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);const h=n[s],f=n[s+1]-h,d=(o-h)/f;return(s+d)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),c=e||(o.isVector2?new tt:new R);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new R,s=[],r=[],o=[],a=new R,c=new fe;for(let d=0;d<=t;d++){const g=d/t;s[d]=this.getTangentAt(g,new R)}r[0]=new R,o[0]=new R;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),f<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(s[d-1],s[d]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Te(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(c.makeRotationAxis(a,g))}o[d].crossVectors(s[d],r[d])}if(e===!0){let d=Math.acos(Te(r[0].dot(r[t]),-1,1));d/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(d=-d);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],d*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class ph extends Pn{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new tt){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,d=l-this.aY;c=f*h-d*u+this.aX,l=f*u+d*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class yw extends ph{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function mh(){let i=0,t=0,e=0,n=0;function s(r,o,a,c){i=r,t=a,e=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,u){let f=(o-r)/l-(a-r)/(l+h)+(a-o)/h,d=(a-o)/h-(c-o)/(h+u)+(c-a)/u;f*=h,d*=h,s(o,a,f,d)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const Zr=new R,Oa=new mh,za=new mh,ka=new mh;class vw extends Pn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new R){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%r]:(Zr.subVectors(s[0],s[1]).add(s[0]),l=Zr);const u=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(Zr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Zr),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),d),y=Math.pow(u.distanceToSquared(f),d),m=Math.pow(f.distanceToSquared(h),d);y<1e-4&&(y=1),g<1e-4&&(g=y),m<1e-4&&(m=y),Oa.initNonuniformCatmullRom(l.x,u.x,f.x,h.x,g,y,m),za.initNonuniformCatmullRom(l.y,u.y,f.y,h.y,g,y,m),ka.initNonuniformCatmullRom(l.z,u.z,f.z,h.z,g,y,m)}else this.curveType==="catmullrom"&&(Oa.initCatmullRom(l.x,u.x,f.x,h.x,this.tension),za.initCatmullRom(l.y,u.y,f.y,h.y,this.tension),ka.initCatmullRom(l.z,u.z,f.z,h.z,this.tension));return n.set(Oa.calc(c),za.calc(c),ka.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new R().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Vu(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+r+o)*c+(-3*e+3*n-2*r-o)*a+r*i+e}function _w(i,t){const e=1-i;return e*e*t}function ww(i,t){return 2*(1-i)*i*t}function xw(i,t){return i*i*t}function ir(i,t,e,n){return _w(i,t)+ww(i,e)+xw(i,n)}function Mw(i,t){const e=1-i;return e*e*e*t}function bw(i,t){const e=1-i;return 3*e*e*i*t}function Sw(i,t){return 3*(1-i)*i*i*t}function Ew(i,t){return i*i*i*t}function sr(i,t,e,n,s){return Mw(i,t)+bw(i,e)+Sw(i,n)+Ew(i,s)}class ff extends Pn{constructor(t=new tt,e=new tt,n=new tt,s=new tt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new tt){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(sr(t,s.x,r.x,o.x,a.x),sr(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Aw extends Pn{constructor(t=new R,e=new R,n=new R,s=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new R){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(sr(t,s.x,r.x,o.x,a.x),sr(t,s.y,r.y,o.y,a.y),sr(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class pf extends Pn{constructor(t=new tt,e=new tt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new tt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new tt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Tw extends Pn{constructor(t=new R,e=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new R){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new R){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class mf extends Pn{constructor(t=new tt,e=new tt,n=new tt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new tt){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(ir(t,s.x,r.x,o.x),ir(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Rw extends Pn{constructor(t=new R,e=new R,n=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new R){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(ir(t,s.x,r.x,o.x),ir(t,s.y,r.y,o.y),ir(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class gf extends Pn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new tt){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(Vu(a,c.x,l.x,h.x,u.x),Vu(a,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new tt().fromArray(s))}return this}}var Ml=Object.freeze({__proto__:null,ArcCurve:yw,CatmullRomCurve3:vw,CubicBezierCurve:ff,CubicBezierCurve3:Aw,EllipseCurve:ph,LineCurve:pf,LineCurve3:Tw,QuadraticBezierCurve:mf,QuadraticBezierCurve3:Rw,SplineCurve:gf});class Cw extends Pn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ml[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Ml[s.type]().fromJSON(s))}return this}}class Wu extends Cw{constructor(t){super(),this.type="Path",this.currentPoint=new tt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new pf(this.currentPoint.clone(),new tt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new mf(this.currentPoint.clone(),new tt(t,e),new tt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){const a=new ff(this.currentPoint.clone(),new tt(t,e),new tt(n,s),new tt(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new gf(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,s,r,o,a,c),this}absellipse(t,e,n,s,r,o,a,c){const l=new ph(t,e,n,s,r,o,a,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Zn extends Ie{constructor(t=[new tt(0,-.5),new tt(.5,0),new tt(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Te(s,0,Math.PI*2);const r=[],o=[],a=[],c=[],l=[],h=1/e,u=new R,f=new tt,d=new R,g=new R,y=new R;let m=0,p=0;for(let _=0;_<=t.length-1;_++)switch(_){case 0:m=t[_+1].x-t[_].x,p=t[_+1].y-t[_].y,d.x=p*1,d.y=-m,d.z=p*0,y.copy(d),d.normalize(),c.push(d.x,d.y,d.z);break;case t.length-1:c.push(y.x,y.y,y.z);break;default:m=t[_+1].x-t[_].x,p=t[_+1].y-t[_].y,d.x=p*1,d.y=-m,d.z=p*0,g.copy(d),d.x+=y.x,d.y+=y.y,d.z+=y.z,d.normalize(),c.push(d.x,d.y,d.z),y.copy(g)}for(let _=0;_<=e;_++){const v=n+_*h*s,w=Math.sin(v),M=Math.cos(v);for(let S=0;S<=t.length-1;S++){u.x=t[S].x*w,u.y=t[S].y,u.z=t[S].x*M,o.push(u.x,u.y,u.z),f.x=_/e,f.y=S/(t.length-1),a.push(f.x,f.y);const E=c[3*S+0]*w,A=c[3*S+1],x=c[3*S+0]*M;l.push(E,A,x)}}for(let _=0;_<e;_++)for(let v=0;v<t.length-1;v++){const w=v+_*t.length,M=w,S=w+t.length,E=w+t.length+1,A=w+1;r.push(M,S,A),r.push(E,A,S)}this.setIndex(r),this.setAttribute("position",new oe(o,3)),this.setAttribute("uv",new oe(a,2)),this.setAttribute("normal",new oe(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zn(t.points,t.segments,t.phiStart,t.phiLength)}}class $ extends Ie{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],f=[],d=[];let g=0;const y=[],m=n/2;let p=0;_(),o===!1&&(t>0&&v(!0),e>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new oe(u,3)),this.setAttribute("normal",new oe(f,3)),this.setAttribute("uv",new oe(d,2));function _(){const w=new R,M=new R;let S=0;const E=(e-t)/n;for(let A=0;A<=r;A++){const x=[],b=A/r,T=b*(e-t)+t;for(let P=0;P<=s;P++){const C=P/s,F=C*c+a,N=Math.sin(F),D=Math.cos(F);M.x=T*N,M.y=-b*n+m,M.z=T*D,u.push(M.x,M.y,M.z),w.set(N,E,D).normalize(),f.push(w.x,w.y,w.z),d.push(C,1-b),x.push(g++)}y.push(x)}for(let A=0;A<s;A++)for(let x=0;x<r;x++){const b=y[x][A],T=y[x+1][A],P=y[x+1][A+1],C=y[x][A+1];(t>0||x!==0)&&(h.push(b,T,C),S+=3),(e>0||x!==r-1)&&(h.push(T,P,C),S+=3)}l.addGroup(p,S,0),p+=S}function v(w){const M=g,S=new tt,E=new R;let A=0;const x=w===!0?t:e,b=w===!0?1:-1;for(let P=1;P<=s;P++)u.push(0,m*b,0),f.push(0,b,0),d.push(.5,.5),g++;const T=g;for(let P=0;P<=s;P++){const F=P/s*c+a,N=Math.cos(F),D=Math.sin(F);E.x=x*D,E.y=m*b,E.z=x*N,u.push(E.x,E.y,E.z),f.push(0,b,0),S.x=N*.5+.5,S.y=D*.5*b+.5,d.push(S.x,S.y),g++}for(let P=0;P<s;P++){const C=M+P,F=T+P;w===!0?h.push(F,F+1,C):h.push(F+1,F,C),A+=3}l.addGroup(p,A,w===!0?1:2),p+=A}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class $t extends ${constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new $t(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class na extends Ie{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],o=[];a(s),l(n),h(),this.setAttribute("position",new oe(r,3)),this.setAttribute("normal",new oe(r.slice(),3)),this.setAttribute("uv",new oe(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(_){const v=new R,w=new R,M=new R;for(let S=0;S<e.length;S+=3)d(e[S+0],v),d(e[S+1],w),d(e[S+2],M),c(v,w,M,_)}function c(_,v,w,M){const S=M+1,E=[];for(let A=0;A<=S;A++){E[A]=[];const x=_.clone().lerp(w,A/S),b=v.clone().lerp(w,A/S),T=S-A;for(let P=0;P<=T;P++)P===0&&A===S?E[A][P]=x:E[A][P]=x.clone().lerp(b,P/T)}for(let A=0;A<S;A++)for(let x=0;x<2*(S-A)-1;x++){const b=Math.floor(x/2);x%2===0?(f(E[A][b+1]),f(E[A+1][b]),f(E[A][b])):(f(E[A][b+1]),f(E[A+1][b+1]),f(E[A+1][b]))}}function l(_){const v=new R;for(let w=0;w<r.length;w+=3)v.x=r[w+0],v.y=r[w+1],v.z=r[w+2],v.normalize().multiplyScalar(_),r[w+0]=v.x,r[w+1]=v.y,r[w+2]=v.z}function h(){const _=new R;for(let v=0;v<r.length;v+=3){_.x=r[v+0],_.y=r[v+1],_.z=r[v+2];const w=m(_)/2/Math.PI+.5,M=p(_)/Math.PI+.5;o.push(w,1-M)}g(),u()}function u(){for(let _=0;_<o.length;_+=6){const v=o[_+0],w=o[_+2],M=o[_+4],S=Math.max(v,w,M),E=Math.min(v,w,M);S>.9&&E<.1&&(v<.2&&(o[_+0]+=1),w<.2&&(o[_+2]+=1),M<.2&&(o[_+4]+=1))}}function f(_){r.push(_.x,_.y,_.z)}function d(_,v){const w=_*3;v.x=t[w+0],v.y=t[w+1],v.z=t[w+2]}function g(){const _=new R,v=new R,w=new R,M=new R,S=new tt,E=new tt,A=new tt;for(let x=0,b=0;x<r.length;x+=9,b+=6){_.set(r[x+0],r[x+1],r[x+2]),v.set(r[x+3],r[x+4],r[x+5]),w.set(r[x+6],r[x+7],r[x+8]),S.set(o[b+0],o[b+1]),E.set(o[b+2],o[b+3]),A.set(o[b+4],o[b+5]),M.copy(_).add(v).add(w).divideScalar(3);const T=m(M);y(S,b+0,_,T),y(E,b+2,v,T),y(A,b+4,w,T)}}function y(_,v,w,M){M<0&&_.x===1&&(o[v]=_.x-1),w.x===0&&w.z===0&&(o[v]=M/2/Math.PI+.5)}function m(_){return Math.atan2(_.z,-_.x)}function p(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new na(t.vertices,t.indices,t.radius,t.details)}}class yf extends Wu{constructor(t){super(t),this.uuid=Fi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new Wu().fromJSON(s))}return this}}const Pw={triangulate:function(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=vf(i,0,s,e,!0);const o=[];if(!r||r.next===r.prev)return o;let a,c,l,h,u,f,d;if(n&&(r=Uw(i,t,r,e)),i.length>80*e){a=l=i[0],c=h=i[1];for(let g=e;g<s;g+=e)u=i[g],f=i[g+1],u<a&&(a=u),f<c&&(c=f),u>l&&(l=u),f>h&&(h=f);d=Math.max(l-a,h-c),d=d!==0?32767/d:0}return ur(r,o,e,a,c,d,0),o}};function vf(i,t,e,n,s){let r,o;if(s===qw(i,t,e,n)>0)for(r=t;r<e;r+=n)o=Xu(r,i[r],i[r+1],o);else for(r=e-n;r>=t;r-=n)o=Xu(r,i[r],i[r+1],o);return o&&ia(o,o.next)&&(fr(o),o=o.next),o}function Ui(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(ia(e,e.next)||xe(e.prev,e,e.next)===0)){if(fr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function ur(i,t,e,n,s,r,o){if(!i)return;!o&&r&&Bw(i,n,s,r);let a=i,c,l;for(;i.prev!==i.next;){if(c=i.prev,l=i.next,r?Lw(i,n,s,r):Iw(i)){t.push(c.i/e|0),t.push(i.i/e|0),t.push(l.i/e|0),fr(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=Dw(Ui(i),t,e),ur(i,t,e,n,s,r,2)):o===2&&Nw(i,t,e,n,s,r):ur(Ui(i),t,e,n,s,r,1);break}}}function Iw(i){const t=i.prev,e=i,n=i.next;if(xe(t,e,n)>=0)return!1;const s=t.x,r=e.x,o=n.x,a=t.y,c=e.y,l=n.y,h=s<r?s<o?s:o:r<o?r:o,u=a<c?a<l?a:l:c<l?c:l,f=s>r?s>o?s:o:r>o?r:o,d=a>c?a>l?a:l:c>l?c:l;let g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=f&&g.y>=u&&g.y<=d&&hs(s,a,r,c,o,l,g.x,g.y)&&xe(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Lw(i,t,e,n){const s=i.prev,r=i,o=i.next;if(xe(s,r,o)>=0)return!1;const a=s.x,c=r.x,l=o.x,h=s.y,u=r.y,f=o.y,d=a<c?a<l?a:l:c<l?c:l,g=h<u?h<f?h:f:u<f?u:f,y=a>c?a>l?a:l:c>l?c:l,m=h>u?h>f?h:f:u>f?u:f,p=bl(d,g,t,e,n),_=bl(y,m,t,e,n);let v=i.prevZ,w=i.nextZ;for(;v&&v.z>=p&&w&&w.z<=_;){if(v.x>=d&&v.x<=y&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&hs(a,h,c,u,l,f,v.x,v.y)&&xe(v.prev,v,v.next)>=0||(v=v.prevZ,w.x>=d&&w.x<=y&&w.y>=g&&w.y<=m&&w!==s&&w!==o&&hs(a,h,c,u,l,f,w.x,w.y)&&xe(w.prev,w,w.next)>=0))return!1;w=w.nextZ}for(;v&&v.z>=p;){if(v.x>=d&&v.x<=y&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&hs(a,h,c,u,l,f,v.x,v.y)&&xe(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;w&&w.z<=_;){if(w.x>=d&&w.x<=y&&w.y>=g&&w.y<=m&&w!==s&&w!==o&&hs(a,h,c,u,l,f,w.x,w.y)&&xe(w.prev,w,w.next)>=0)return!1;w=w.nextZ}return!0}function Dw(i,t,e){let n=i;do{const s=n.prev,r=n.next.next;!ia(s,r)&&_f(s,n,n.next,r)&&dr(s,r)&&dr(r,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),fr(n),fr(n.next),n=i=r),n=n.next}while(n!==i);return Ui(n)}function Nw(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Vw(o,a)){let c=wf(o,a);o=Ui(o,o.next),c=Ui(c,c.next),ur(o,t,e,n,s,r,0),ur(c,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function Uw(i,t,e,n){const s=[];let r,o,a,c,l;for(r=0,o=t.length;r<o;r++)a=t[r]*n,c=r<o-1?t[r+1]*n:i.length,l=vf(i,a,c,n,!1),l===l.next&&(l.steiner=!0),s.push(Gw(l));for(s.sort(Fw),r=0;r<s.length;r++)e=Ow(s[r],e);return e}function Fw(i,t){return i.x-t.x}function Ow(i,t){const e=zw(i,t);if(!e)return t;const n=wf(e,i);return Ui(n,n.next),Ui(e,e.next)}function zw(i,t){let e=t,n=-1/0,s;const r=i.x,o=i.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const f=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=r&&f>n&&(n=f,s=e.x<e.next.x?e:e.next,f===r))return s}e=e.next}while(e!==t);if(!s)return null;const a=s,c=s.x,l=s.y;let h=1/0,u;e=s;do r>=e.x&&e.x>=c&&r!==e.x&&hs(o<l?r:n,o,c,l,o<l?n:r,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(r-e.x),dr(e,i)&&(u<h||u===h&&(e.x>s.x||e.x===s.x&&kw(s,e)))&&(s=e,h=u)),e=e.next;while(e!==a);return s}function kw(i,t){return xe(i.prev,i,t.prev)<0&&xe(t.next,i,i.next)<0}function Bw(i,t,e,n){let s=i;do s.z===0&&(s.z=bl(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Hw(s)}function Hw(i){let t,e,n,s,r,o,a,c,l=1;do{for(e=i,i=null,r=null,o=0;e;){for(o++,n=e,a=0,t=0;t<l&&(a++,n=n.nextZ,!!n);t++);for(c=l;a>0||c>0&&n;)a!==0&&(c===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,a--):(s=n,n=n.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;e=n}r.nextZ=null,l*=2}while(o>1);return i}function bl(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Gw(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function hs(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function Vw(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Ww(i,t)&&(dr(i,t)&&dr(t,i)&&Xw(i,t)&&(xe(i.prev,i,t.prev)||xe(i,t.prev,t))||ia(i,t)&&xe(i.prev,i,i.next)>0&&xe(t.prev,t,t.next)>0)}function xe(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function ia(i,t){return i.x===t.x&&i.y===t.y}function _f(i,t,e,n){const s=jr(xe(i,t,e)),r=jr(xe(i,t,n)),o=jr(xe(e,n,i)),a=jr(xe(e,n,t));return!!(s!==r&&o!==a||s===0&&Kr(i,e,t)||r===0&&Kr(i,n,t)||o===0&&Kr(e,i,n)||a===0&&Kr(e,t,n))}function Kr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function jr(i){return i>0?1:i<0?-1:0}function Ww(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&_f(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function dr(i,t){return xe(i.prev,i,i.next)<0?xe(i,t,i.next)>=0&&xe(i,i.prev,t)>=0:xe(i,t,i.prev)<0||xe(i,i.next,t)<0}function Xw(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function wf(i,t){const e=new Sl(i.i,i.x,i.y),n=new Sl(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Xu(i,t,e,n){const s=new Sl(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function fr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Sl(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function qw(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}class rr{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return rr.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];qu(t),Yu(n,t);let o=t.length;e.forEach(qu);for(let c=0;c<e.length;c++)s.push(o),o+=e[c].length,Yu(n,e[c]);const a=Pw.triangulate(n,s);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}}function qu(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Yu(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class gh extends Ie{constructor(t=new yf([new tt(.5,.5),new tt(-.5,.5),new tt(-.5,-.5),new tt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let a=0,c=t.length;a<c;a++){const l=t[a];o(l)}this.setAttribute("position",new oe(s,3)),this.setAttribute("uv",new oe(r,2)),this.computeVertexNormals();function o(a){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:d-.1,y=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,_=e.UVGenerator!==void 0?e.UVGenerator:Yw;let v,w=!1,M,S,E,A;p&&(v=p.getSpacedPoints(h),w=!0,f=!1,M=p.computeFrenetFrames(h,!1),S=new R,E=new R,A=new R),f||(m=0,d=0,g=0,y=0);const x=a.extractPoints(l);let b=x.shape;const T=x.holes;if(!rr.isClockWise(b)){b=b.reverse();for(let nt=0,ht=T.length;nt<ht;nt++){const k=T[nt];rr.isClockWise(k)&&(T[nt]=k.reverse())}}const C=rr.triangulateShape(b,T),F=b;for(let nt=0,ht=T.length;nt<ht;nt++){const k=T[nt];b=b.concat(k)}function N(nt,ht,k){return ht||console.error("THREE.ExtrudeGeometry: vec does not exist"),nt.clone().addScaledVector(ht,k)}const D=b.length,B=C.length;function H(nt,ht,k){let ft,st,gt;const yt=nt.x-ht.x,Gt=nt.y-ht.y,Pt=k.x-nt.x,z=k.y-nt.y,L=yt*yt+Gt*Gt,Z=yt*z-Gt*Pt;if(Math.abs(Z)>Number.EPSILON){const at=Math.sqrt(L),dt=Math.sqrt(Pt*Pt+z*z),ct=ht.x-Gt/at,Ut=ht.y+yt/at,Et=k.x-z/dt,It=k.y+Pt/dt,ne=((Et-ct)*z-(It-Ut)*Pt)/(yt*z-Gt*Pt);ft=ct+yt*ne-nt.x,st=Ut+Gt*ne-nt.y;const mt=ft*ft+st*st;if(mt<=2)return new tt(ft,st);gt=Math.sqrt(mt/2)}else{let at=!1;yt>Number.EPSILON?Pt>Number.EPSILON&&(at=!0):yt<-Number.EPSILON?Pt<-Number.EPSILON&&(at=!0):Math.sign(Gt)===Math.sign(z)&&(at=!0),at?(ft=-Gt,st=yt,gt=Math.sqrt(L)):(ft=yt,st=Gt,gt=Math.sqrt(L/2))}return new tt(ft/gt,st/gt)}const V=[];for(let nt=0,ht=F.length,k=ht-1,ft=nt+1;nt<ht;nt++,k++,ft++)k===ht&&(k=0),ft===ht&&(ft=0),V[nt]=H(F[nt],F[k],F[ft]);const et=[];let lt,Mt=V.concat();for(let nt=0,ht=T.length;nt<ht;nt++){const k=T[nt];lt=[];for(let ft=0,st=k.length,gt=st-1,yt=ft+1;ft<st;ft++,gt++,yt++)gt===st&&(gt=0),yt===st&&(yt=0),lt[ft]=H(k[ft],k[gt],k[yt]);et.push(lt),Mt=Mt.concat(lt)}for(let nt=0;nt<m;nt++){const ht=nt/m,k=d*Math.cos(ht*Math.PI/2),ft=g*Math.sin(ht*Math.PI/2)+y;for(let st=0,gt=F.length;st<gt;st++){const yt=N(F[st],V[st],ft);Y(yt.x,yt.y,-k)}for(let st=0,gt=T.length;st<gt;st++){const yt=T[st];lt=et[st];for(let Gt=0,Pt=yt.length;Gt<Pt;Gt++){const z=N(yt[Gt],lt[Gt],ft);Y(z.x,z.y,-k)}}}const Lt=g+y;for(let nt=0;nt<D;nt++){const ht=f?N(b[nt],Mt[nt],Lt):b[nt];w?(E.copy(M.normals[0]).multiplyScalar(ht.x),S.copy(M.binormals[0]).multiplyScalar(ht.y),A.copy(v[0]).add(E).add(S),Y(A.x,A.y,A.z)):Y(ht.x,ht.y,0)}for(let nt=1;nt<=h;nt++)for(let ht=0;ht<D;ht++){const k=f?N(b[ht],Mt[ht],Lt):b[ht];w?(E.copy(M.normals[nt]).multiplyScalar(k.x),S.copy(M.binormals[nt]).multiplyScalar(k.y),A.copy(v[nt]).add(E).add(S),Y(A.x,A.y,A.z)):Y(k.x,k.y,u/h*nt)}for(let nt=m-1;nt>=0;nt--){const ht=nt/m,k=d*Math.cos(ht*Math.PI/2),ft=g*Math.sin(ht*Math.PI/2)+y;for(let st=0,gt=F.length;st<gt;st++){const yt=N(F[st],V[st],ft);Y(yt.x,yt.y,u+k)}for(let st=0,gt=T.length;st<gt;st++){const yt=T[st];lt=et[st];for(let Gt=0,Pt=yt.length;Gt<Pt;Gt++){const z=N(yt[Gt],lt[Gt],ft);w?Y(z.x,z.y+v[h-1].y,v[h-1].x+k):Y(z.x,z.y,u+k)}}}J(),ot();function J(){const nt=s.length/3;if(f){let ht=0,k=D*ht;for(let ft=0;ft<B;ft++){const st=C[ft];rt(st[2]+k,st[1]+k,st[0]+k)}ht=h+m*2,k=D*ht;for(let ft=0;ft<B;ft++){const st=C[ft];rt(st[0]+k,st[1]+k,st[2]+k)}}else{for(let ht=0;ht<B;ht++){const k=C[ht];rt(k[2],k[1],k[0])}for(let ht=0;ht<B;ht++){const k=C[ht];rt(k[0]+D*h,k[1]+D*h,k[2]+D*h)}}n.addGroup(nt,s.length/3-nt,0)}function ot(){const nt=s.length/3;let ht=0;K(F,ht),ht+=F.length;for(let k=0,ft=T.length;k<ft;k++){const st=T[k];K(st,ht),ht+=st.length}n.addGroup(nt,s.length/3-nt,1)}function K(nt,ht){let k=nt.length;for(;--k>=0;){const ft=k;let st=k-1;st<0&&(st=nt.length-1);for(let gt=0,yt=h+m*2;gt<yt;gt++){const Gt=D*gt,Pt=D*(gt+1),z=ht+ft+Gt,L=ht+st+Gt,Z=ht+st+Pt,at=ht+ft+Pt;pt(z,L,Z,at)}}}function Y(nt,ht,k){c.push(nt),c.push(ht),c.push(k)}function rt(nt,ht,k){wt(nt),wt(ht),wt(k);const ft=s.length/3,st=_.generateTopUV(n,s,ft-3,ft-2,ft-1);Ft(st[0]),Ft(st[1]),Ft(st[2])}function pt(nt,ht,k,ft){wt(nt),wt(ht),wt(ft),wt(ht),wt(k),wt(ft);const st=s.length/3,gt=_.generateSideWallUV(n,s,st-6,st-3,st-2,st-1);Ft(gt[0]),Ft(gt[1]),Ft(gt[3]),Ft(gt[1]),Ft(gt[2]),Ft(gt[3])}function wt(nt){s.push(c[nt*3+0]),s.push(c[nt*3+1]),s.push(c[nt*3+2])}function Ft(nt){r.push(nt.x),r.push(nt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return $w(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,o=t.shapes.length;r<o;r++){const a=e[t.shapes[r]];n.push(a)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Ml[s.type]().fromJSON(s)),new gh(n,t.options)}}const Yw={generateTopUV:function(i,t,e,n,s){const r=t[e*3],o=t[e*3+1],a=t[n*3],c=t[n*3+1],l=t[s*3],h=t[s*3+1];return[new tt(r,o),new tt(a,c),new tt(l,h)]},generateSideWallUV:function(i,t,e,n,s,r){const o=t[e*3],a=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],u=t[n*3+2],f=t[s*3],d=t[s*3+1],g=t[s*3+2],y=t[r*3],m=t[r*3+1],p=t[r*3+2];return Math.abs(a-h)<Math.abs(o-l)?[new tt(o,1-c),new tt(l,1-u),new tt(f,1-g),new tt(y,1-p)]:[new tt(a,1-c),new tt(h,1-u),new tt(d,1-g),new tt(m,1-p)]}};function $w(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class te extends na{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new te(t.radius,t.detail)}}class ke extends na{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ke(t.radius,t.detail)}}class yr extends Ie{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const h=[],u=new R,f=new R,d=[],g=[],y=[],m=[];for(let p=0;p<=n;p++){const _=[],v=p/n;let w=0;p===0&&o===0?w=.5/e:p===n&&c===Math.PI&&(w=-.5/e);for(let M=0;M<=e;M++){const S=M/e;u.x=-t*Math.cos(s+S*r)*Math.sin(o+v*a),u.y=t*Math.cos(o+v*a),u.z=t*Math.sin(s+S*r)*Math.sin(o+v*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),y.push(f.x,f.y,f.z),m.push(S+w,1-v),_.push(l++)}h.push(_)}for(let p=0;p<n;p++)for(let _=0;_<e;_++){const v=h[p][_+1],w=h[p][_],M=h[p+1][_],S=h[p+1][_+1];(p!==0||o>0)&&d.push(v,w,S),(p!==n-1||c<Math.PI)&&d.push(w,M,S)}this.setIndex(d),this.setAttribute("position",new oe(g,3)),this.setAttribute("normal",new oe(y,3)),this.setAttribute("uv",new oe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new yr(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Oi extends Ie{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],c=[],l=[],h=new R,u=new R,f=new R;for(let d=0;d<=n;d++)for(let g=0;g<=s;g++){const y=g/s*r,m=d/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(y),u.y=(t+e*Math.cos(m))*Math.sin(y),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(y),h.y=t*Math.sin(y),f.subVectors(u,h).normalize(),c.push(f.x,f.y,f.z),l.push(g/s),l.push(d/n)}for(let d=1;d<=n;d++)for(let g=1;g<=s;g++){const y=(s+1)*d+g-1,m=(s+1)*(d-1)+g-1,p=(s+1)*(d-1)+g,_=(s+1)*d+g;o.push(y,m,_),o.push(m,p,_)}this.setIndex(o),this.setAttribute("position",new oe(a,3)),this.setAttribute("normal",new oe(c,3)),this.setAttribute("uv",new oe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Oi(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Zw extends sn{static get type(){return"RawShaderMaterial"}constructor(t){super(t),this.isRawShaderMaterial=!0}}class Kw extends fi{static get type(){return"MeshNormalMaterial"}constructor(t){super(),this.isMeshNormalMaterial=!0,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ah,this.normalScale=new tt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}}class ln extends fi{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ah,this.normalScale=new tt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.combine=Ql,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class sa extends be{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new qt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class jw extends sa{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.groundColor=new qt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Ba=new fe,$u=new R,Zu=new R;class yh{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new tt(512,512),this.map=null,this.mapPass=null,this.matrix=new fe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new lh,this._frameExtents=new tt(1,1),this._viewportCount=1,this._viewports=[new de(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;$u.setFromMatrixPosition(t.matrixWorld),e.position.copy($u),Zu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Zu),e.updateMatrixWorld(),Ba.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ba),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ba)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Jw extends yh{constructor(){super(new $e(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){const e=this.camera,n=xs*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height,r=t.distance||e.far;(n!==e.fov||s!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=s,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class Qw extends sa{constructor(t,e,n=0,s=Math.PI/3,r=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.target=new be,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new Jw}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const Ku=new fe,zs=new R,Ha=new R;class tx extends yh{constructor(){super(new $e(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new tt(4,2),this._viewportCount=6,this._viewports=[new de(2,1,1,1),new de(0,1,1,1),new de(3,1,1,1),new de(1,1,1,1),new de(3,0,1,1),new de(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),zs.setFromMatrixPosition(t.matrixWorld),n.position.copy(zs),Ha.copy(n.position),Ha.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Ha),n.updateMatrixWorld(),s.makeTranslation(-zs.x,-zs.y,-zs.z),Ku.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ku)}}class zi extends sa{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new tx}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class ex extends yh{constructor(){super(new hh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ju extends sa{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.target=new be,this.shadow=new ex}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class nx{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Ju(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=Ju();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Ju(){return performance.now()}const Qu=new fe;class ix{constructor(t,e,n=0,s=1/0){this.ray=new mr(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Jo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Qu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Qu),this}intersectObject(t,e=!0,n=[]){return El(t,this,n,e),n.sort(td),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)El(t[s],this,n,e);return n.sort(td),n}}function td(i,t){return i.distance-t.distance}function El(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let o=0,a=r.length;o<a;o++)El(r[o],t,e,!0)}}const ed=new R,Jr=new R;class vh{constructor(t=new R,e=new R){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){ed.subVectors(t,this.start),Jr.subVectors(this.end,this.start);const n=Jr.dot(Jr);let r=Jr.dot(ed)/n;return e&&(r=Te(r,0,1)),r}closestPointToPoint(t,e,n){const s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}class sx extends fh{constructor(t=1){const e=[0,0,0,t,0,0,0,0,0,0,t,0,0,0,0,0,0,t],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new Ie;s.setAttribute("position",new oe(e,3)),s.setAttribute("color",new oe(n,3));const r=new df({vertexColors:!0,toneMapped:!1});super(s,r),this.type="AxesHelper"}setColors(t,e,n){const s=new qt,r=this.geometry.attributes.color.array;return s.set(t),s.toArray(r,0),s.toArray(r,3),s.set(e),s.toArray(r,6),s.toArray(r,9),s.set(n),s.toArray(r,12),s.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Jl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Jl);class rx{renderer;scene;camera;onResize=null;canvas;handleResize=()=>this.resize();constructor(t){this.canvas=t,this.renderer=new dw({canvas:t,antialias:!1,powerPreference:"high-performance",stencil:!1}),this.renderer.setClearColor(657935,1),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=P0,this.scene=new fw,this.camera=new $e(70,1,.1,500),this.resize(),window.addEventListener("resize",this.handleResize),window.addEventListener("orientationchange",this.handleResize)}resize(){const t=this.canvas.clientWidth||window.innerWidth,e=this.canvas.clientHeight||window.innerHeight;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(t,e,!1),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.onResize?.()}render(){this.renderer.render(this.scene,this.camera)}dispose(){window.removeEventListener("resize",this.handleResize),window.removeEventListener("orientationchange",this.handleResize),this.renderer.dispose()}}class ox{subscribers=new Set;handle=0;last=0;elapsed=0;running=!1;add(t){return this.subscribers.add(t),()=>this.subscribers.delete(t)}start(){if(this.running)return;this.running=!0,this.last=performance.now();const t=e=>{this.handle=requestAnimationFrame(t);const n=Math.min((e-this.last)/1e3,.1);this.last=e,this.elapsed+=n;for(const s of this.subscribers)s(n,this.elapsed)};this.handle=requestAnimationFrame(t)}stop(){this.running&&(cancelAnimationFrame(this.handle),this.running=!1)}}const ax={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class vr{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const cx=new hh(-1,1,1,-1,0,1);class lx extends Ie{constructor(){super(),this.setAttribute("position",new oe([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new oe([0,2,0,0,2,0],2))}}const hx=new lx;class _h{constructor(t){this._mesh=new ee(hx,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,cx)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class xf extends vr{constructor(t,e){super(),this.textureID=e!==void 0?e:"tDiffuse",t instanceof sn?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=Qo.clone(t.uniforms),this.material=new sn({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new _h(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class nd extends vr{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class ux extends vr{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class dx{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new tt);this._width=n.width,this._height=n.height,e=new An(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:li}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new xf(ax),this.copyPass.material.blending=qn,this.clock=new nx}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),o.needsSwap){if(n){const a=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),c.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}nd!==void 0&&(o instanceof nd?n=!0:o instanceof ux&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new tt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class fx extends vr{constructor(t,e,n,s={}){super(),this.pixelSize=t,this.resolution=new tt,this.renderResolution=new tt,this.pixelatedMaterial=this.createPixelatedMaterial(),this.normalMaterial=new Kw,this.fsQuad=new _h(this.pixelatedMaterial),this.scene=e,this.camera=n,this.normalEdgeStrength=s.normalEdgeStrength||.3,this.depthEdgeStrength=s.depthEdgeStrength||.4,this.beautyRenderTarget=new An,this.beautyRenderTarget.texture.minFilter=Ue,this.beautyRenderTarget.texture.magFilter=Ue,this.beautyRenderTarget.texture.type=li,this.beautyRenderTarget.depthTexture=new dh,this.normalRenderTarget=new An,this.normalRenderTarget.texture.minFilter=Ue,this.normalRenderTarget.texture.magFilter=Ue,this.normalRenderTarget.texture.type=li}dispose(){this.beautyRenderTarget.dispose(),this.normalRenderTarget.dispose(),this.pixelatedMaterial.dispose(),this.normalMaterial.dispose(),this.fsQuad.dispose()}setSize(t,e){this.resolution.set(t,e),this.renderResolution.set(t/this.pixelSize|0,e/this.pixelSize|0);const{x:n,y:s}=this.renderResolution;this.beautyRenderTarget.setSize(n,s),this.normalRenderTarget.setSize(n,s),this.fsQuad.material.uniforms.resolution.value.set(n,s,1/n,1/s)}setPixelSize(t){this.pixelSize=t,this.setSize(this.resolution.x,this.resolution.y)}render(t,e){const n=this.fsQuad.material.uniforms;n.normalEdgeStrength.value=this.normalEdgeStrength,n.depthEdgeStrength.value=this.depthEdgeStrength,t.setRenderTarget(this.beautyRenderTarget),t.render(this.scene,this.camera);const s=this.scene.overrideMaterial;t.setRenderTarget(this.normalRenderTarget),this.scene.overrideMaterial=this.normalMaterial,t.render(this.scene,this.camera),this.scene.overrideMaterial=s,n.tDiffuse.value=this.beautyRenderTarget.texture,n.tDepth.value=this.beautyRenderTarget.depthTexture,n.tNormal.value=this.normalRenderTarget.texture,this.renderToScreen?t.setRenderTarget(null):(t.setRenderTarget(e),this.clear&&t.clear()),this.fsQuad.render(t)}createPixelatedMaterial(){return new sn({uniforms:{tDiffuse:{value:null},tDepth:{value:null},tNormal:{value:null},resolution:{value:new de(this.renderResolution.x,this.renderResolution.y,1/this.renderResolution.x,1/this.renderResolution.y)},normalEdgeStrength:{value:0},depthEdgeStrength:{value:0}},vertexShader:`
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
			`})}}const px={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class mx extends vr{constructor(){super();const t=px;this.uniforms=Qo.clone(t.uniforms),this.material=new Zw({name:t.name,uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.fsQuad=new _h(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},re.getTransfer(this._outputColorSpace)===ue&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===I0?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===L0?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===D0?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===N0?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===U0?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===F0&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}function gx(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,c=new Ie;let l=0;for(let h=0;h<i.length;++h){const u=i[h];let f=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in u.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.attributes[d]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in u.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[d]===void 0&&(o[d]=[]),o[d].push(u.morphAttributes[d])}if(t){let d;if(e)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,d,h),l+=d}}if(e){let h=0;const u=[];for(let f=0;f<i.length;++f){const d=i[f].index;for(let g=0;g<d.count;++g)u.push(d.getX(g)+h);h+=i[f].attributes.position.count}c.setIndex(u)}for(const h in r){const u=id(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in o){const u=o[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let f=0;f<u;++f){const d=[];for(let y=0;y<o[h].length;++y)d.push(o[h][y][f]);const g=id(d);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function id(i){let t,e,n,s=-1,r=0;for(let l=0;l<i.length;++l){const h=i[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const o=new t(r),a=new Ke(o,e,n);let c=0;for(let l=0;l<i.length;++l){const h=i[l];if(h.isInterleavedBufferAttribute){const u=c/e;for(let f=0,d=h.count;f<d;f++)for(let g=0;g<e;g++){const y=h.getComponent(f,g);a.setComponent(f+u,g,y)}}else o.set(h.array,c);c+=h.count*e}return s!==void 0&&(a.gpuType=s),a}function wh(i,t=1e-4){t=Math.max(t,Number.EPSILON);const e={},n=i.getIndex(),s=i.getAttribute("position"),r=n?n.count:s.count;let o=0;const a=Object.keys(i.attributes),c={},l={},h=[],u=["getX","getY","getZ","getW"],f=["setX","setY","setZ","setW"];for(let _=0,v=a.length;_<v;_++){const w=a[_],M=i.attributes[w];c[w]=new M.constructor(new M.array.constructor(M.count*M.itemSize),M.itemSize,M.normalized);const S=i.morphAttributes[w];S&&(l[w]||(l[w]=[]),S.forEach((E,A)=>{const x=new E.array.constructor(E.count*E.itemSize);l[w][A]=new E.constructor(x,E.itemSize,E.normalized)}))}const d=t*.5,g=Math.log10(1/t),y=Math.pow(10,g),m=d*y;for(let _=0;_<r;_++){const v=n?n.getX(_):_;let w="";for(let M=0,S=a.length;M<S;M++){const E=a[M],A=i.getAttribute(E),x=A.itemSize;for(let b=0;b<x;b++)w+=`${~~(A[u[b]](v)*y+m)},`}if(w in e)h.push(e[w]);else{for(let M=0,S=a.length;M<S;M++){const E=a[M],A=i.getAttribute(E),x=i.morphAttributes[E],b=A.itemSize,T=c[E],P=l[E];for(let C=0;C<b;C++){const F=u[C],N=f[C];if(T[N](o,A[F](v)),x)for(let D=0,B=x.length;D<B;D++)P[D][N](o,x[D][F](v))}}e[w]=o,h.push(o),o++}}const p=i.clone();for(const _ in i.attributes){const v=c[_];if(p.setAttribute(_,new v.constructor(v.array.slice(0,o*v.itemSize),v.itemSize,v.normalized)),_ in l)for(let w=0;w<l[_].length;w++){const M=l[_][w];p.morphAttributes[_][w]=new M.constructor(M.array.slice(0,o*M.itemSize),M.itemSize,M.normalized)}}return p.setIndex(h),p}const yx={reeds:1,"small-grass-clump":.95,"large-grass-clump":.9,cowparsley:.85,wildflower:.8,poppy:.8,bluebell:.8,daisy:.75,lavender:.7,foxglove:.5,fern:.6,nettle:.6,"small-tree":.6,tree:.55,bush:.5,elder:.65,hazel:.6,gorse:.25,"small-birch":.8,birch:.75,"small-oak":.5,oak:.35,"small-rowan":.7,rowan:.6,"small-spruce":.4,spruce:.3,bramble:.4,thistle:.35,sunflower:.2},bs="sway",Mf=new ln({vertexColors:!0,flatShading:!0});function vt(i){const t=i.map(n=>{const s=n.geometry,r=s.index===null?s:s.toNonIndexed();r!==s&&s.dispose(),r.deleteAttribute("uv");const o=r.getAttribute("position"),a=o.count,c=new Float32Array(a*3),l=new qt;if(typeof n.color=="function")for(let u=0;u<a;u+=3){const f=(o.getX(u)+o.getX(u+1)+o.getX(u+2))/3,d=(o.getY(u)+o.getY(u+1)+o.getY(u+2))/3,g=(o.getZ(u)+o.getZ(u+1)+o.getZ(u+2))/3;l.set(n.color(f,d,g)),l.toArray(c,u*3),l.toArray(c,(u+1)*3),l.toArray(c,(u+2)*3)}else{l.set(n.color);for(let u=0;u<a;u++)l.toArray(c,u*3)}r.setAttribute("color",new Ke(c,3));const h=new Float32Array(a);if(typeof n.sway=="function")for(let u=0;u<a;u++)h[u]=Al(n.sway(o.getX(u),o.getY(u),o.getZ(u)));else n.sway&&h.fill(Al(n.sway));return r.setAttribute(bs,new Ke(h,1)),r.getAttribute("normal")||r.computeVertexNormals(),r}),e=gx(t,!1);for(const n of t)n.dispose();if(!e)throw new Error("assemble: geometries did not share an attribute set");return e}function bt(i,t,e){const n=yx[t]??0,s=i.getAttribute(bs);if(s&&n!==1){const o=s.array;for(let a=0;a<o.length;a++)o[a]*=n;s.needsUpdate=!0}const r=new ee(i,Mf);return r.name=t,r.userData.swayPhase=e,r.customDepthMaterial=bf,r}function Re(i,t,e=1.6){return(n,s)=>{const r=Al((s-i)/Math.max(t-i,1e-6));return(r*r*(3-2*r))**e}}function Al(i){return i>0?i<1?i:1:0}const Fo=256,vx=140,_x=.16,wx=.05,pi=new uf(new Uint8Array(Fo),Fo,1,ih,En);pi.minFilter=nn;pi.magFilter=nn;pi.wrapS=Vn;pi.wrapT=Vn;pi.needsUpdate=!0;const us={gustField:{value:pi},windDir:{value:new tt(1,0)},windLagScale:{value:0},windHalfSpan:{value:1},swayTime:{value:0},swayAmount:{value:1}},bf=new hf({depthPacking:Y0});let sd=!1;function xx(){if(sd)return;sd=!0,Tl=t=>{Object.assign(t.uniforms,us),t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
        attribute float ${bs};
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
          float weight = ${bs} * swayAmount;
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
            transformed += windObj * (push * lean * ${_x.toFixed(3)})
                         + crossObj * (push * flutter * ${wx.toFixed(3)});
          }
        }
        `)},Rl(Mf),Rl(bf)}let Tl=null;function Rl(i){Tl&&(i.onBeforeCompile=Tl,i.defaultAttributeValues={...i.defaultAttributeValues,[bs]:[0]},i.customProgramCacheKey=()=>"sway",i.needsUpdate=!0)}const Mx=pi.image.data;function bx(i,t){const{windDirection:e,frontSpeed:n,gustRate:s}=i.settings;us.windDir.value.set(Math.cos(e),Math.sin(e));const r=s/Math.max(n,.5),o=vx*r;us.windLagScale.value=r,us.windHalfSpan.value=o,us.swayTime.value=t;const a=i.phase;for(let c=0;c<Fo;c++){const l=c/(Fo-1),h=a+(l-.5)*2*o;Mx[c]=Math.round(i.fieldAt(h)*255)}pi.needsUpdate=!0}const Sx={name:"RetroShader",uniforms:{tDiffuse:{value:null},uPixelSize:{value:1},uDitherScale:{value:1.65},uPeriod:{value:3},uQuantize:{value:1},uLevels:{value:16},uVignette:{value:.35},uVignetteRadius:{value:.55},uVignetteSoftness:{value:.6}},vertexShader:`
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

    varying vec2 vUv;

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
  `},Ex=400,Ga={uniforms:{uHorizon:{value:new qt},uZenith:{value:new qt},uGround:{value:new qt},uCurve:{value:1},uCloudColor:{value:new qt},uCloudCover:{value:.5},uCloudSoftness:{value:.2},uCloudScale:{value:1.2},uCloudOpacity:{value:1},uCloudDrift:{value:.01},uTime:{value:0},uSunDirection:{value:new R(0,1,0)},uSunColor:{value:new qt},uSunSize:{value:.9993},uSunGlow:{value:260},uSunIntensity:{value:1}},vertexShader:`
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
  `},Sf={horizon:"#bcd4e6",zenith:"#3f7fbf",ground:"#5d6469",curve:.35,cloudColor:"#f2f5f8",cloudCover:.5,cloudSoftness:.22,cloudScale:1.1,cloudOpacity:.95,cloudDrift:.012,sun:!0,sunColor:"#fff6e0",sunSize:1.1,sunGlow:240};class Ax{mesh;material;constructor(){this.material=new sn({name:"Sky",uniforms:Qo.clone(Ga.uniforms),vertexShader:Ga.vertexShader,fragmentShader:Ga.fragmentShader,side:We,depthWrite:!1,depthTest:!1,fog:!1}),this.mesh=new ee(new yr(Ex,32,16),this.material),this.mesh.name="Sky",this.mesh.renderOrder=-1,this.mesh.frustumCulled=!1}apply(t){const e=this.material.uniforms;e.uHorizon.value.set(t.horizon),e.uZenith.value.set(t.zenith),e.uGround.value.set(t.ground),e.uCloudColor.value.set(t.cloudColor),e.uCurve.value=t.curve,e.uCloudCover.value=t.cloudCover,e.uCloudSoftness.value=t.cloudSoftness,e.uCloudScale.value=t.cloudScale,e.uCloudOpacity.value=t.cloudOpacity,e.uCloudDrift.value=t.cloudDrift,e.uSunColor.value.set(t.sunColor),e.uSunIntensity.value=t.sun?1:0,e.uSunSize.value=Math.cos(t.sunSize*Math.PI/180),e.uSunGlow.value=t.sunGlow}aimAt(t){this.material.uniforms.uSunDirection.value.copy(t).normalize()}follow(t,e){this.mesh.position.setFromMatrixPosition(t.matrixWorld),this.material.uniforms.uTime.value=e}dispose(){this.mesh.geometry.dispose(),this.material.dispose()}}const xh="hswow.preset.";function Tx(i){try{const t=window.localStorage.getItem(xh+i);if(t===null)return null;const e=JSON.parse(t);return typeof e!="object"||e===null?null:e}catch{return null}}function Rx(i,t){try{return window.localStorage.setItem(xh+i,JSON.stringify(t)),!0}catch{return!1}}function Cx(i){try{window.localStorage.removeItem(xh+i)}catch{}}const Cl=new gr({vertexColors:!0,transparent:!0,blending:Uc,depthWrite:!1,side:mn,fog:!1});function Mn(i,t){const e=new ee(i,Cl);return e.name=t,e.userData.noCollide=!0,e.renderOrder=2,e}const Va="render",rd={pixelSize:2,normalEdgeStrength:.5,depthEdgeStrength:.5,ditherScale:1.65,screenPeriod:3,quantize:"levels",levels:16,vignetteStrength:0,vignetteRadius:.5,vignetteSoftness:.7,sky:{...Sf},linkFogToSky:!0,fogColor:"#bcd4e6",fogNear:25,fogFar:140},od={off:0,levels:1};class Px{settings;viewport;composer;pixelPass;retroPass;sky=new Ax;air=null;constructor(t){this.viewport=t;const e=Tx(Va)??{};this.settings={...rd,...e,sky:{...Sf,...e.sky}},this.settings.quantize in od||(this.settings.quantize="levels"),t.scene.add(this.sky.mesh),this.hideGlowFromEdges(t.scene),this.composer=new dx(t.renderer),this.pixelPass=new fx(1,t.scene,t.camera),Rl(this.pixelPass.normalMaterial),this.retroPass=new xf(Sx),this.composer.addPass(this.pixelPass),this.composer.addPass(new mx),this.composer.addPass(this.retroPass),this.resize(),this.apply()}setEnvironment(t){this.air=t,this.apply()}aimSun(t){this.sky.aimAt(t)}apply(){const t=this.settings,e=this.viewport.renderer.getPixelRatio(),n=Math.max(1,Math.round(t.pixelSize*e));this.pixelPass.pixelSize!==n&&this.pixelPass.setPixelSize(n),this.pixelPass.normalEdgeStrength=t.normalEdgeStrength,this.pixelPass.depthEdgeStrength=t.depthEdgeStrength;const s=this.retroPass.uniforms;s.uPixelSize.value=n,s.uDitherScale.value=t.ditherScale,s.uPeriod.value=t.screenPeriod,s.uQuantize.value=od[t.quantize],s.uLevels.value=t.levels,s.uVignette.value=t.vignetteStrength,s.uVignetteRadius.value=t.vignetteRadius,s.uVignetteSoftness.value=t.vignetteSoftness,this.sky.apply(t.sky),this.sky.mesh.visible=this.air===null||this.air.sky;const r=this.viewport.scene.fog;r instanceof ea&&(this.air&&!this.air.sky?r.color.set(this.air.fogColor):t.linkFogToSky?r.color.set(t.sky.horizon):r.color.set(this.air?.fogColor??t.fogColor),r.near=this.air?.fogNear??t.fogNear,r.far=this.air?.fogFar??t.fogFar,this.viewport.renderer.setClearColor(r.color,1))}hideGlowFromEdges(t){t.onBeforeRender=(e,n)=>{Cl.visible=n.overrideMaterial===null}}render(t){this.sky.follow(this.viewport.camera,t),this.composer.render()}resize(){const t=this.viewport.renderer.getSize(new tt);this.composer.setPixelRatio(this.viewport.renderer.getPixelRatio()),this.composer.setSize(t.x,t.y),this.apply()}save(){return Rx(Va,this.settings)}reset(){Cx(Va),Object.assign(this.settings,structuredClone(rd)),this.apply()}dispose(){this.viewport.scene.onBeforeRender=()=>{},Cl.visible=!0,this.viewport.scene.remove(this.sky.mesh),this.sky.dispose(),this.composer.dispose()}}const Wa=new URLSearchParams(window.location.search),Ef={debug:Wa.has("debug"),level:Wa.get("level")??"proving",touch:Wa.has("touch")},Ix=["KeyW","ArrowUp"],Lx=["KeyS","ArrowDown"],Dx=["KeyA","ArrowLeft"],Nx=["KeyD","ArrowRight"],Ux=["ShiftLeft","ShiftRight"],Fx=["CapsLock"],ad=["Space"],Ox=["KeyE"],Qr=200,zx=3e3,kx=120;class Bx{lookX=0;lookY=0;locked=!1;needsCapture;onLockChange=null;canvas;keys=new Set;stickX=0;stickZ=0;stickSprint=!1;jumpPressedAt=0;jumpHeld=!1;interactPressed=!1;settling=!1;relocking=!1;constructor(t){this.canvas=t,this.needsCapture=!Af(),window.addEventListener("keydown",this.handleKeyDown),window.addEventListener("keyup",this.handleKeyUp),window.addEventListener("blur",this.handleBlur),this.needsCapture?(t.addEventListener("pointerdown",this.handleCanvasPointerDown),document.addEventListener("pointerlockchange",this.handleLockChange),document.addEventListener("mousemove",this.handleMouseMove)):this.locked=!0}get moveX(){const t=cd(this.pressed(Nx),this.pressed(Dx));return to(t+this.stickX,-1,1)}get moveZ(){const t=cd(this.pressed(Ix),this.pressed(Lx));return to(t+this.stickZ,-1,1)}get sprint(){return this.pressed(Ux)||this.stickSprint}get crouching(){return this.pressed(Fx)}get jumping(){return this.jumpHeld}takeJump(t){return this.jumpPressedAt===0||(performance.now()-this.jumpPressedAt)/1e3>t?!1:(this.jumpPressedAt=0,!0)}takeInteract(){return this.interactPressed?(this.interactPressed=!1,!0):!1}drainLook(t){t.x=this.lookX,t.y=this.lookY,this.lookX=0,this.lookY=0}setStick(t,e,n){this.stickX=t,this.stickZ=e,this.stickSprint=n}addLook(t,e){this.lookX+=t,this.lookY+=e}pressJump(){this.jumpPressedAt=performance.now(),this.jumpHeld=!0}releaseJump(){this.jumpHeld=!1}pressInteract(){this.interactPressed=!0}pressed(t){return t.some(e=>this.keys.has(e))}handleKeyDown=t=>{if(t.code==="Tab"&&this.locked){t.preventDefault();return}t.repeat||(this.keys.add(t.code),ad.includes(t.code)&&(t.preventDefault(),this.pressJump()),Ox.includes(t.code)&&this.locked&&this.pressInteract())};handleKeyUp=t=>{this.keys.delete(t.code),ad.includes(t.code)&&this.releaseJump()};handleBlur=()=>{this.keys.clear(),this.releaseJump()};handleCanvasPointerDown=t=>{this.locked||t.button!==0||this.requestLock()};async requestLock(){if(this.relocking)return;this.relocking=!0;const t=performance.now()+zx;for(;!this.locked&&performance.now()<t;)await this.tryLock(),await Hx(kx);this.relocking=!1}async tryLock(){try{await this.canvas.requestPointerLock({unadjustedMovement:!0})}catch{try{await this.canvas.requestPointerLock()}catch{}}}handleLockChange=()=>{this.locked=document.pointerLockElement===this.canvas,this.locked||this.keys.clear(),this.lookX=0,this.lookY=0,this.settling=this.locked,this.onLockChange?.(this.locked)};handleMouseMove=t=>{if(this.locked){if(this.settling){this.settling=!1;return}this.lookX+=to(t.movementX,-Qr,Qr),this.lookY+=to(t.movementY,-Qr,Qr)}};dispose(){window.removeEventListener("keydown",this.handleKeyDown),window.removeEventListener("keyup",this.handleKeyUp),window.removeEventListener("blur",this.handleBlur),this.canvas.removeEventListener("pointerdown",this.handleCanvasPointerDown),document.removeEventListener("pointerlockchange",this.handleLockChange),document.removeEventListener("mousemove",this.handleMouseMove)}}function Af(){return Ef.touch||window.matchMedia("(pointer: coarse)").matches}function Hx(i){return new Promise(t=>window.setTimeout(t,i))}function cd(i,t){return(i?1:0)-(t?1:0)}function to(i,t,e){return Math.min(Math.max(i,t),e)}class _r{constructor(t=new R(0,0,0),e=new R(0,1,0),n=1){this.start=t,this.end=e,this.radius=n}clone(){return new _r(this.start.clone(),this.end.clone(),this.radius)}set(t,e,n){this.start.copy(t),this.end.copy(e),this.radius=n}copy(t){this.start.copy(t.start),this.end.copy(t.end),this.radius=t.radius}getCenter(t){return t.copy(this.end).add(this.start).multiplyScalar(.5)}translate(t){this.start.add(t),this.end.add(t)}checkAABBAxis(t,e,n,s,r,o,a,c,l){return(r-t<l||r-n<l)&&(t-o<l||n-o<l)&&(a-e<l||a-s<l)&&(e-c<l||s-c<l)}intersectsBox(t){return this.checkAABBAxis(this.start.x,this.start.y,this.end.x,this.end.y,t.min.x,t.max.x,t.min.y,t.max.y,this.radius)&&this.checkAABBAxis(this.start.x,this.start.z,this.end.x,this.end.z,t.min.x,t.max.x,t.min.z,t.max.z,this.radius)&&this.checkAABBAxis(this.start.y,this.start.z,this.end.y,this.end.z,t.min.y,t.max.y,t.min.z,t.max.z,this.radius)}}const ks=new R,Bs=new R,eo=new R,Hs=new R,yn=new ri,Xa=new vh,Gx=new vh,no=new Rs,Gs=new _r,Vx=new R,Wx=new R,Xx=new R,qx=1e-10;function Yx(i,t,e=null,n=null){const s=Vx.copy(i.end).sub(i.start),r=Wx.copy(t.end).sub(t.start),o=Xx.copy(t.start).sub(i.start),a=s.dot(r),c=s.dot(s),l=r.dot(r),h=r.dot(o),u=s.dot(o);let f,d;const g=c*l-a*a;if(Math.abs(g)<qx){const y=-h/l,m=(a-h)/l;Math.abs(y-.5)<Math.abs(m-.5)?(f=0,d=y):(f=1,d=m)}else f=(h*a+u*l)/g,d=(f*a-h)/l;d=Math.max(0,Math.min(1,d)),f=Math.max(0,Math.min(1,f)),e&&e.copy(s).multiplyScalar(f).add(i.start),n&&n.copy(r).multiplyScalar(d).add(t.start)}class Oo{constructor(t){this.box=t,this.bounds=new Ni,this.subTrees=[],this.triangles=[],this.layers=new Jo}addTriangle(t){return this.bounds.min.x=Math.min(this.bounds.min.x,t.a.x,t.b.x,t.c.x),this.bounds.min.y=Math.min(this.bounds.min.y,t.a.y,t.b.y,t.c.y),this.bounds.min.z=Math.min(this.bounds.min.z,t.a.z,t.b.z,t.c.z),this.bounds.max.x=Math.max(this.bounds.max.x,t.a.x,t.b.x,t.c.x),this.bounds.max.y=Math.max(this.bounds.max.y,t.a.y,t.b.y,t.c.y),this.bounds.max.z=Math.max(this.bounds.max.z,t.a.z,t.b.z,t.c.z),this.triangles.push(t),this}calcBox(){return this.box=this.bounds.clone(),this.box.min.x-=.01,this.box.min.y-=.01,this.box.min.z-=.01,this}split(t){if(!this.box)return;const e=[],n=Bs.copy(this.box.max).sub(this.box.min).multiplyScalar(.5);for(let r=0;r<2;r++)for(let o=0;o<2;o++)for(let a=0;a<2;a++){const c=new Ni,l=ks.set(r,o,a);c.min.copy(this.box.min).add(l.multiply(n)),c.max.copy(c.min).add(n),e.push(new Oo(c))}let s;for(;s=this.triangles.pop();)for(let r=0;r<e.length;r++)e[r].box.intersectsTriangle(s)&&e[r].triangles.push(s);for(let r=0;r<e.length;r++){const o=e[r].triangles.length;o>8&&t<16&&e[r].split(t+1),o!==0&&this.subTrees.push(e[r])}return this}build(){return this.calcBox(),this.split(0),this}getRayTriangles(t,e){for(let n=0;n<this.subTrees.length;n++){const s=this.subTrees[n];if(t.intersectsBox(s.box))if(s.triangles.length>0)for(let r=0;r<s.triangles.length;r++)e.indexOf(s.triangles[r])===-1&&e.push(s.triangles[r]);else s.getRayTriangles(t,e)}return e}triangleCapsuleIntersect(t,e){e.getPlane(yn);const n=yn.distanceToPoint(t.start)-t.radius,s=yn.distanceToPoint(t.end)-t.radius;if(n>0&&s>0||n<-t.radius&&s<-t.radius)return!1;const r=Math.abs(n/(Math.abs(n)+Math.abs(s))),o=ks.copy(t.start).lerp(t.end,r);if(e.containsPoint(o))return{normal:yn.normal.clone(),point:o.clone(),depth:Math.abs(Math.min(n,s))};const a=t.radius*t.radius,c=Xa.set(t.start,t.end),l=[[e.a,e.b],[e.b,e.c],[e.c,e.a]];for(let h=0;h<l.length;h++){const u=Gx.set(l[h][0],l[h][1]);if(Yx(c,u,eo,Hs),eo.distanceToSquared(Hs)<a)return{normal:eo.clone().sub(Hs).normalize(),point:Hs.clone(),depth:t.radius-eo.distanceTo(Hs)}}return!1}triangleSphereIntersect(t,e){if(e.getPlane(yn),!t.intersectsPlane(yn))return!1;const n=Math.abs(yn.distanceToSphere(t)),s=t.radius*t.radius-n*n,r=yn.projectPoint(t.center,ks);if(e.containsPoint(t.center))return{normal:yn.normal.clone(),point:r.clone(),depth:Math.abs(yn.distanceToSphere(t))};const o=[[e.a,e.b],[e.b,e.c],[e.c,e.a]];for(let a=0;a<o.length;a++){Xa.set(o[a][0],o[a][1]),Xa.closestPointToPoint(r,!0,Bs);const c=Bs.distanceToSquared(t.center);if(c<s)return{normal:t.center.clone().sub(Bs).normalize(),point:Bs.clone(),depth:t.radius-Math.sqrt(c)}}return!1}getSphereTriangles(t,e){for(let n=0;n<this.subTrees.length;n++){const s=this.subTrees[n];if(t.intersectsBox(s.box))if(s.triangles.length>0)for(let r=0;r<s.triangles.length;r++)e.indexOf(s.triangles[r])===-1&&e.push(s.triangles[r]);else s.getSphereTriangles(t,e)}}getCapsuleTriangles(t,e){for(let n=0;n<this.subTrees.length;n++){const s=this.subTrees[n];if(t.intersectsBox(s.box))if(s.triangles.length>0)for(let r=0;r<s.triangles.length;r++)e.indexOf(s.triangles[r])===-1&&e.push(s.triangles[r]);else s.getCapsuleTriangles(t,e)}}sphereIntersect(t){no.copy(t);const e=[];let n,s=!1;this.getSphereTriangles(t,e);for(let r=0;r<e.length;r++)(n=this.triangleSphereIntersect(no,e[r]))&&(s=!0,no.center.add(n.normal.multiplyScalar(n.depth)));if(s){const r=no.center.clone().sub(t.center),o=r.length();return{normal:r.normalize(),depth:o}}return!1}capsuleIntersect(t){Gs.copy(t);const e=[];let n,s=!1;this.getCapsuleTriangles(Gs,e);for(let r=0;r<e.length;r++)(n=this.triangleCapsuleIntersect(Gs,e[r]))&&(s=!0,Gs.translate(n.normal.multiplyScalar(n.depth)));if(s){const r=Gs.getCenter(new R).sub(t.getCenter(ks)),o=r.length();return{normal:r.normalize(),depth:o}}return!1}rayIntersect(t){if(t.direction.length()===0)return;const e=[];let n,s,r=1e100;this.getRayTriangles(t,e);for(let o=0;o<e.length;o++){const a=t.intersectTriangle(e[o].a,e[o].b,e[o].c,!0,ks);if(a){const c=a.sub(t.origin).length();r>c&&(s=a.clone().add(t.origin),r=c,n=e[o])}}return r<1e100?{distance:r,triangle:n,position:s}:!1}fromGraphNode(t){return t.updateWorldMatrix(!0,!0),t.traverse(e=>{if(e.isMesh===!0&&this.layers.test(e.layers)){let n,s=!1;e.geometry.index!==null?(s=!0,n=e.geometry.toNonIndexed()):n=e.geometry;const r=n.getAttribute("position");for(let o=0;o<r.count;o+=3){const a=new R().fromBufferAttribute(r,o),c=new R().fromBufferAttribute(r,o+1),l=new R().fromBufferAttribute(r,o+2);a.applyMatrix4(e.matrixWorld),c.applyMatrix4(e.matrixWorld),l.applyMatrix4(e.matrixWorld),this.addTriangle(new an(a,c,l))}s&&n.dispose()}}),this.build(),this}clear(){return this.box=null,this.bounds.makeEmpty(),this.subTrees.length=0,this.triangles.length=0,this}}const Tf=1;function Ee(i){return Rf(i),i}function Rf(i){if(i.userData.noCollide!==!0){i.layers.enable(Tf);for(const t of i.children)Rf(t)}}const es=[],qa=new R,Vs=new R,Ya=new R,ld=new R,$a=new R,hd=new R,cs=new R,ud=new vh,Za={normal:new R,depth:0};class zo{index={octree:new Oo,triangles:0};cache=new Map;build(t,e){if(e!==void 0){const s=this.cache.get(e);if(s){this.index=s;return}}const n=zo.index(t);e!==void 0&&this.cache.set(e,n),this.index=n}warm(t,e){this.cache.has(e)||this.cache.set(e,zo.index(t))}invalidate(t){this.cache.delete(t)}static index(t){const e=new Oo;return e.layers.disableAll(),e.layers.enable(Tf),e.fromGraphNode(t),{octree:e,triangles:Cf(e)}}get triangles(){return this.index.triangles}intersectCapsule(t){es.length=0,this.index.octree.getCapsuleTriangles(t,es);let e=0;for(const n of es){const s=dd(t,n);s<=e||(e=s,Za.normal.copy(cs))}return e===0?null:(Za.depth=e,Za)}overlaps(t){es.length=0,this.index.octree.getCapsuleTriangles(t,es);for(const e of es)if(dd(t,e)>0)return!0;return!1}raycast(t,e){const n=this.index.octree.rayIntersect(new mr(t,e));return n?n.distance:null}}function dd(i,t){t.getNormal(Vs),qa.subVectors(i.end,i.start);const e=Vs.dot(qa);let n=0;Math.abs(e)>1e-6&&(n=Vs.dot(Ya.subVectors(t.a,i.start))/e,n=Math.min(Math.max(n,0),1)),Ya.copy(i.start).addScaledVector(qa,n),t.closestPointToPoint(Ya,ld),ud.set(i.start,i.end),ud.closestPointToPoint(ld,!0,$a),t.closestPointToPoint($a,hd),cs.subVectors($a,hd);const s=cs.length();return s>=i.radius||(s>1e-6?cs.divideScalar(s):cs.copy(Vs),cs.dot(Vs)<=0)?0:i.radius-s}function Cf(i){let t=i.triangles.length;for(const e of i.subTrees)t+=Cf(e);return t}const Ka=1/120,fd=16,$x=4,io=6,Zx=.28,Pf={radius:.32,height:1.8,eyeHeight:1.35,walkSpeed:4.2,sprintScale:1.75,crouchScale:.52,crouchHeight:.58,crouchSpeed:22,crouchDrag:.45,stepSmoothing:16,groundAccel:14,airAccel:7.5,friction:10,stopSpeed:1.6,gravity:26,jumpSpeed:7.2,coyoteTime:.22,jumpBuffer:.15,autoHop:!1,slopeLimitDeg:50,stepHeight:.45,lookSensitivity:.0022,invertY:!1,bobAmount:.02,bobSway:.012,bobRoll:.004,bobStepsPerSecond:1.9,bobSpeedInfluence:.5,firstStepFraction:.65,maxAirSpeed:1.12,fov:74,sprintFov:82,landDip:.02},vn=new R,pd=new R,so=new R,ja=new R,md=new R,ro=new R,Ja=new R,Kx=new R,oo=new R,gd=new R,Be=new _r,Qa={x:0,y:0};let jx=class{tuning={...Pf};velocity=new R;onFootstep=null;onLand=null;onJump=null;camera;input;collider;capsule=new _r;yaw=0;pitch=0;sprintFov=!1;crouch=0;stepLag=0;stance=0;lastFeetY=null;groundNormal=new R(0,1,0);wishX=0;wishZ=0;grounded=!1;jumped=!1;timeOffGround=0;timeSinceLand=1/0;bobPhase=0;strideProgress=.65;dip=0;accumulator=0;constructor(t,e,n){this.camera=t,this.input=e,this.collider=n,this.camera.rotation.order="YXZ",this.camera.fov=this.tuning.fov,this.camera.updateProjectionMatrix(),this.teleport(new R(0,2,6),0)}teleport(t,e=this.yaw){const{radius:n,height:s}=this.tuning;this.capsule.set(new R(t.x,t.y+n,t.z),new R(t.x,t.y+s-n,t.z),n),this.velocity.set(0,0,0),this.yaw=e,this.grounded=!1,this.stance=0,this.crouch=0,this.stepLag=0,this.lastFeetY=null}get position(){return Kx.copy(this.capsule.start).setY(this.capsule.start.y-this.tuning.radius)}get heading(){return this.yaw}get isGrounded(){return this.grounded}get speed(){return Math.hypot(this.velocity.x,this.velocity.z)}update(t){this.applyLook(),this.accumulator+=t;let e=0;for(;this.accumulator>=Ka&&e<fd;)this.step(Ka),this.accumulator-=Ka,e+=1;e===fd&&(this.accumulator=0),this.applyCamera(t)}applyLook(){this.input.drainLook(Qa);const{lookSensitivity:t,invertY:e}=this.tuning;this.yaw-=Qa.x*t,this.pitch-=Qa.y*t*(e?-1:1);const n=Math.PI/2-.001;this.pitch=Math.min(Math.max(this.pitch,-n),n),this.yaw=this.yaw%(Math.PI*2)}step(t){const e=this.tuning;this.jumped=!1,this.grounded?(this.timeOffGround=0,this.timeSinceLand+=t,this.applyFriction(t)):(this.timeOffGround+=t,this.velocity.y-=e.gravity*t),this.applyWish(t),this.applyJump(),this.capAirSpeed();const n=this.grounded,s=-this.velocity.y;this.move(t),this.grounded&&!n&&(this.timeSinceLand=0,s>1&&(this.dip+=Math.min(s,18)*e.landDip,this.onLand?.(s))),this.advanceBob(t)}applyFriction(t){const e=this.tuning,n=this.velocity.length();if(n<1e-4){this.velocity.set(0,0,0);return}const s=Math.max(n,e.stopSpeed)*e.friction*t;this.velocity.multiplyScalar(Math.max(n-s,0)/n)}applyWish(t){const e=this.tuning,{moveX:n,moveZ:s}=this.input;pd.set(-Math.sin(this.yaw),0,-Math.cos(this.yaw)),so.set(Math.cos(this.yaw),0,-Math.sin(this.yaw)),vn.set(0,0,0).addScaledVector(pd,s).addScaledVector(so,n);const r=vn.length();if(r<1e-4){this.wishX=0,this.wishZ=0;return}if(vn.divideScalar(r),this.wishX=vn.x,this.wishZ=vn.z,this.grounded){vn.projectOnPlane(this.groundNormal);const h=vn.length();if(h<1e-4)return;vn.divideScalar(h)}const o=e.walkSpeed*Math.min(r,1)*(this.input.sprint?e.sprintScale:1)*(1-this.stance*(1-e.crouchDrag)),a=this.velocity.dot(vn),c=o-a;if(c<=0)return;const l=this.grounded?e.groundAccel:e.airAccel;this.velocity.addScaledVector(vn,Math.min(l*o*t,c))}capAirSpeed(){if(this.grounded)return;const t=this.tuning,e=t.walkSpeed*t.sprintScale*t.maxAirSpeed,n=Math.hypot(this.velocity.x,this.velocity.z);if(n<=e||n<1e-6)return;const s=e/n;this.velocity.x*=s,this.velocity.z*=s}applyJump(){const t=this.tuning;!(this.grounded||this.timeOffGround<t.coyoteTime)||!(this.input.takeJump(t.jumpBuffer)||t.autoHop&&this.input.jumping)||(this.velocity.y=t.jumpSpeed,this.grounded=!1,this.jumped=!0,this.timeSinceLand>Zx&&this.onJump?.(),this.timeSinceLand=0,this.timeOffGround=t.coyoteTime)}move(t){const e=this.tuning;md.copy(this.velocity).multiplyScalar(t),Ja.copy(this.capsule.start);const n=this.grounded,s=this.velocity.x,r=this.velocity.z;this.grounded=!1,this.capsule.translate(md),this.resolve(),n&&!this.grounded&&!this.jumped&&this.snapToGround(),!(e.stepHeight<=0||this.wishX===0&&this.wishZ===0||this.velocity.y>.1||(this.capsule.start.x-Ja.x)*this.wishX+(this.capsule.start.z-Ja.z)*this.wishZ>=e.walkSpeed*t*.5)&&this.tryStepUp(t)&&(this.velocity.x=s,this.velocity.z=r,this.velocity.y=0)}resolve(){const t=Math.cos(this.tuning.slopeLimitDeg*Math.PI/180);for(let e=0;e<$x;e++){const n=this.collider.intersectCapsule(this.capsule);if(!n)break;this.capsule.translate(ja.copy(n.normal).multiplyScalar(n.depth)),n.normal.y>t&&(this.grounded=!0,this.groundNormal.copy(n.normal));const s=this.velocity.dot(n.normal);s<0&&this.velocity.addScaledVector(n.normal,-s)}this.grounded||this.groundNormal.set(0,1,0)}headroom(){if(this.stance<.01)return!0;const t=this.tuning,e=this.capsule.start.y-t.radius;return Be.copy(this.capsule),Be.start.set(this.capsule.start.x,e+t.radius,this.capsule.start.z),Be.end.set(this.capsule.start.x,e+t.height-t.radius,this.capsule.start.z),!this.collider.overlaps(Be)}applyStance(){if(Math.abs(this.crouch-this.stance)<.001)return;this.stance=this.crouch;const t=this.tuning,e=this.capsule.start.y-t.radius,n=t.height*(1-this.stance*(1-t.crouchHeight));this.capsule.end.set(this.capsule.start.x,e+Math.max(n-t.radius,t.radius+.01),this.capsule.start.z)}snapToGround(){const t=this.tuning,e=Math.cos(t.slopeLimitDeg*Math.PI/180),n=Math.max(t.stepHeight,.05)/io;ro.set(0,-n,0),Be.copy(this.capsule);for(let s=0;s<io;s++){Be.translate(ro);const r=this.collider.intersectCapsule(Be);if(r){if(r.normal.y<=e)return;Be.translate(ja.set(0,n,0)),this.capsule.copy(Be),this.grounded=!0,this.groundNormal.copy(r.normal);return}}}tryStepUp(t){const e=this.tuning,n=Math.max(e.walkSpeed*t,.02);if(oo.set(this.capsule.start.x+this.wishX*n,this.capsule.start.y+e.stepHeight,this.capsule.start.z+this.wishZ*n),gd.copy(oo).setY(oo.y+e.height-e.radius*2),Be.set(oo,gd,e.radius),this.collider.overlaps(Be))return!1;const s=e.stepHeight/io;ro.set(0,-s,0);for(let r=0;r<io;r++)if(Be.translate(ro),this.collider.overlaps(Be))return Be.translate(ja.set(0,s,0)),this.capsule.copy(Be),this.grounded=!0,this.groundNormal.set(0,1,0),!0;return!1}advanceBob(t){const e=this.tuning;if(!this.grounded)return;const n=this.speed;if(n<.15){this.bobPhase+=(Math.round(this.bobPhase)-this.bobPhase)*Math.min(t*8,1),this.strideProgress=e.firstStepFraction;return}const s=e.walkSpeed/Math.max(e.bobStepsPerSecond,.1),r=Math.max(.2,s*Math.pow(n/e.walkSpeed,1-e.bobSpeedInfluence));for(this.strideProgress+=n*t/r,this.bobPhase+=n*t/(r*2);this.strideProgress>=1;)this.strideProgress-=1,this.onFootstep?.(n)}applyCamera(t){const e=this.tuning,n=this.input.crouching||!this.headroom()?1:0;this.crouch+=(n-this.crouch)*Math.min(t*e.crouchSpeed,1),this.applyStance();const s=this.bobPhase*Math.PI*2;so.set(Math.cos(this.yaw),0,-Math.sin(this.yaw));const r=Math.min(this.speed/e.walkSpeed,1);this.dip=Math.max(this.dip-this.dip*Math.min(t*9,1),0);const o=this.capsule.start.y-e.radius;if(this.lastFeetY!==null&&this.grounded){const l=o-this.lastFeetY;l>.001&&l<e.stepHeight*1.2&&(this.stepLag+=l)}this.lastFeetY=o,this.stepLag=Math.max(0,this.stepLag-this.stepLag*Math.min(t*e.stepSmoothing,1)),this.camera.position.set(this.capsule.start.x,o-this.stepLag+e.eyeHeight*(1-this.stance*(1-e.crouchScale))-this.dip+Math.sin(s*2)*e.bobAmount*r,this.capsule.start.z),this.camera.position.addScaledVector(so,Math.sin(s)*e.bobSway*r),this.camera.rotation.set(this.pitch,this.yaw,Math.sin(s)*e.bobRoll*r),this.sprintFov?(!this.input.sprint||this.speed<.4)&&(this.sprintFov=!1):this.input.sprint&&this.speed>1.2&&(this.sprintFov=!0);const a=this.sprintFov?e.sprintFov:e.fov,c=eg.damp(this.camera.fov,a,6,t);Math.abs(c-this.camera.fov)>.001&&(this.camera.fov=c,this.camera.updateProjectionMatrix())}};const ns=64,Jx=.85,yd=2.2;class Qx{input;root;stickBase;stickKnob;jumpPad;stick=null;lookPointer=null;lastLookX=0;lastLookY=0;constructor(t,e){this.input=t,this.root=document.createElement("div"),this.root.className="touch",this.stickBase=document.createElement("div"),this.stickBase.className="touch-stick",this.stickKnob=document.createElement("div"),this.stickKnob.className="touch-stick-knob",this.stickBase.appendChild(this.stickKnob),this.jumpPad=document.createElement("div"),this.jumpPad.className="touch-jump",this.jumpPad.textContent="↑",this.root.append(this.stickBase,this.jumpPad),e.appendChild(this.root),this.root.addEventListener("pointerdown",this.handleDown),window.addEventListener("pointermove",this.handleMove),window.addEventListener("pointerup",this.handleUp),window.addEventListener("pointercancel",this.handleUp),this.jumpPad.addEventListener("pointerdown",this.handleJumpDown),this.jumpPad.addEventListener("pointerup",this.handleJumpUp),this.jumpPad.addEventListener("pointercancel",this.handleJumpUp)}handleDown=t=>{const e=t.clientX<window.innerWidth/2;if(e&&this.stick===null){this.stick={pointerId:t.pointerId,originX:t.clientX,originY:t.clientY},this.stickBase.style.left=`${t.clientX}px`,this.stickBase.style.top=`${t.clientY}px`,this.stickBase.classList.add("is-active"),this.updateStick(t.clientX,t.clientY);return}!e&&this.lookPointer===null&&(this.lookPointer=t.pointerId,this.lastLookX=t.clientX,this.lastLookY=t.clientY)};handleMove=t=>{if(this.stick?.pointerId===t.pointerId){this.updateStick(t.clientX,t.clientY);return}this.lookPointer===t.pointerId&&(this.input.addLook((t.clientX-this.lastLookX)*yd,(t.clientY-this.lastLookY)*yd),this.lastLookX=t.clientX,this.lastLookY=t.clientY)};handleUp=t=>{this.stick?.pointerId===t.pointerId&&(this.stick=null,this.input.setStick(0,0,!1),this.stickBase.classList.remove("is-active"),this.stickKnob.style.transform="translate(-50%, -50%)"),this.lookPointer===t.pointerId&&(this.lookPointer=null)};handleJumpDown=t=>{t.stopPropagation(),this.jumpPad.classList.add("is-active"),this.input.pressJump()};handleJumpUp=()=>{this.jumpPad.classList.remove("is-active"),this.input.releaseJump()};updateStick(t,e){if(!this.stick)return;let n=t-this.stick.originX,s=e-this.stick.originY;const r=Math.hypot(n,s);if(r>ns){const a=ns/r;n*=a,s*=a}this.stickKnob.style.transform=`translate(calc(-50% + ${n}px), calc(-50% + ${s}px))`;const o=Math.min(r,ns)/ns;this.input.setStick(n/ns,-s/ns,o>Jx)}dispose(){this.root.removeEventListener("pointerdown",this.handleDown),window.removeEventListener("pointermove",this.handleMove),window.removeEventListener("pointerup",this.handleUp),window.removeEventListener("pointercancel",this.handleUp),this.root.remove()}}const ko=4,_n=256,vd=_n/ko,t2=.82,e2=.6,n2=4,_d=.6,wd=1.4;function ao(i,t){return Math.min(Math.max(t+.5-i,0),1)}function co(i,t){const e=(i%t+t)%t;return Math.min(e,t-e)}let tc=null;function xd(){if(tc)return tc;const i=new Uint8Array(_n*_n*4);for(let e=0;e<_n;e++)for(let n=0;n<_n;n++){const s=n+.5,r=e+.5,o=Math.max(ao(co(s,_n),wd),ao(co(r,_n),wd)),a=Math.max(ao(co(s,vd),_d),ao(co(r,vd),_d)),c=Math.min(1-o*(1-e2),1-a*(1-t2)),l=Math.round(c*255),h=(e*_n+n)*4;i[h]=l,i[h+1]=l,i[h+2]=l,i[h+3]=255}const t=new uf(i,_n,_n,cn);return t.wrapS=lr,t.wrapT=lr,t.colorSpace=Gn,t.generateMipmaps=!0,t.minFilter=oi,t.magFilter=nn,t.anisotropy=16,t.needsUpdate=!0,tc=t,t}function Mh(i=400,t={}){const e=t.segments??Math.max(8,Math.round(i/n2)),n=new hi(i,i,e,e);n.rotateX(-Math.PI/2);const s=n.getAttribute("uv");for(let a=0;a<s.count;a++)s.setXY(a,(s.getX(a)-.5)*(i/ko),(s.getY(a)-.5)*(i/ko));s.needsUpdate=!0;const r=t.material??new ln({color:t.color??13286300});r.map!==xd()&&(r.map=xd(),r.needsUpdate=!0);const o=new ee(n,r);return o.name="flatGround",o.position.y=t.y??-.01,t.collidable===!1?o:Ee(o)}const If=ko;function xt(i){let t=i>>>0||2654435769;t=Math.imul(t^t>>>16,73244475),t=Math.imul(t^t>>>16,73244475),t=(t^t>>>16)>>>0;const e=()=>{t=t+1831565813>>>0;let s=t;return s=Math.imul(s^s>>>15,s|1),s^=s+Math.imul(s^s>>>7,s|61),((s^s>>>14)>>>0)/4294967296},n=e;return n.range=(s,r)=>s+e()*(r-s),n.int=(s,r)=>Math.floor(s+e()*(r-s+1)),n.chance=s=>e()<s,n.pick=s=>s[Math.floor(e()*s.length)],n.around=(s,r)=>s+(e()*2-1)*r,n}const I={BARK:4602672,BARK_PALE:5720636,LEAF:5201977,LEAF_DARK:4017196,LEAF_DRY:7039548,GRASS:6056762,GRASS_DRY:8025156,STONE:9869984,STONE_DARK:7699072,STONE_PALE:11449014,EARTH:4998454,TIMBER:9073506,TIMBER_DARK:7035469,TIMBER_PALE:11047798,IRON:5922659,IRON_DARK:4146248,RUST:8014384,BRONZE:9072696,PATINA:6058080,WATER:2899782,LAMPLIGHT:16769192,CLOTH:9274994,SKIN:11047546,HIDE:7165505,HIDE_DARK:4273193,HIDE_PALE:10653813,WOOL:12433060,HOG:11042938,FOWL:10260343,COMB:10240564,MARKER_YELLOW:13213770,COW_BLACK:2367775};function U(i,t){const e=Math.min(255,Math.round((i>>16&255)*t)),n=Math.min(255,Math.round((i>>8&255)*t)),s=Math.min(255,Math.round((i&255)*t));return e<<16|n<<8|s}const Lf={name:"tree",category:"foliage",radius:2.2,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(3.2,4.6),r=e.range(0,Math.PI*2),o=s*e.range(.55,.68),a=new $(e.range(.11,.17),e.range(.24,.34),o,6);a.translate(0,o/2,0),n.push({geometry:a,color:I.BARK,sway:Re(0,s,2.2)});const c=e.int(2,4);for(let f=0;f<c;f++){const d=o*e.range(.6,.95),g=e.range(.7,1.3),y=new $(.045,.09,g,4);y.translate(0,g/2,0),y.rotateZ(e.range(.5,1.05)),y.rotateY(r+f/c*Math.PI*2+e.around(0,.4)),y.translate(0,d,0),n.push({geometry:y,color:I.BARK_PALE,sway:Re(0,s,1.4)})}const l=e.int(3,5),h=o+e.range(.3,.7);for(let f=0;f<l;f++){const d=e.range(.75,1.35),g=new te(d,0);g.rotateX(e.range(0,Math.PI)),g.rotateY(e.range(0,Math.PI)),g.scale(1,e.range(.72,.95),1);const y=e.range(0,.95),m=r+f/l*Math.PI*2+e.around(0,.5);g.translate(Math.cos(m)*y,h+e.around(0,.45),Math.sin(m)*y),n.push({geometry:g,color:e.chance(.25)?I.LEAF_DARK:I.LEAF,sway:e.range(.82,1)})}const u=vt(n);return t!==1&&u.scale(t,t,t),bt(u,"tree",e()*Math.PI*2)}},Pl={name:"bush",category:"foliage",radius:1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.int(3,5),r=e.range(.35,.7);for(let a=0;a<s;a++){const c=e.range(.3,.62),l=new te(c,0);l.rotateX(e.range(0,Math.PI)),l.rotateY(e.range(0,Math.PI)),l.scale(1,e.range(.6,.85),1);const h=a/s*Math.PI*2+e.around(0,.6),u=e.range(0,r),f=c*e.range(.55,.85);l.translate(Math.cos(h)*u,f,Math.sin(h)*u),n.push({geometry:l,color:e.chance(.2)?I.LEAF_DRY:I.LEAF,sway:(d,g)=>Math.min(1,.35+g*.75)})}const o=vt(n);return t!==1&&o.scale(t,t,t),bt(o,"bush",e()*Math.PI*2)}},Md={ground:"#cabb9c",cube:"#525f66",marker:"#b08040",ramp:"#38474a",stair:"#3d4b52",platform:"#46505c",wall:"#2e3640",metal:"#6a6f74",creature:"#b8a06a"},i2=208,s2=52,r2=14474440,o2=6044206,a2=new R(0,.1,10);function ve(i,t,e,n,s,r,o){const a=new ee(new G(i,t,e),n);return a.position.set(s,r+t/2,o),a}function c2(i,t,e,n){const s=new yf;s.moveTo(0,0),s.lineTo(t,0),s.lineTo(t,t*Math.tan(e*Math.PI/180)),s.closePath();const r=new gh(s,{depth:i,bevelEnabled:!1});return r.translate(0,0,-i/2),r.rotateY(Math.PI/2),new ee(r,n)}function ec(i,t,e,n,s,r){const a=new hi(i,t,96,1),c=a.getAttribute("position"),l=new Float32Array(c.count*3),h=new qt;for(let f=0;f<c.count;f++){const d=c.getX(f)/i+.5,[g,y,m]=r(Math.min(Math.max(d,0),1));h.setRGB(g,y,m,en),h.toArray(l,f*3)}a.setAttribute("color",new Ke(l,3));const u=new ee(a,new gr({vertexColors:!0}));return u.position.set(e,n,s),u}class l2{root=new we;colors={...Md};materials={};anchors={tree:new R(14,3.6,12),bush:new R(10.5,.5,15.5),bird:new R(14.9,4.1,11.4),machine:new R(22,1.1,-12)};rooms=[{name:"hall",min:new R(15,0,-18),max:new R(29,7,-4)},{name:"cell",min:new R(19,0,-4),max:new R(27,3,4)}];wheel=null;constructor(){this.root.name="ProvingGround";for(const t of Object.keys(this.colors))this.materials[t]=new ln({color:this.colors[t],flatShading:!0});this.addGround(),this.addHeightReference(),this.addMeasuredCubes(),this.addDistanceMarkers(),this.addMovementGym(),this.addCalibrationBoard(),this.addSoundGarden(),this.addRooms()}update(t,e){this.wheel&&(this.wheel.rotation.z+=e/60*Math.PI*2*t)}roomAt(t){for(const e of this.rooms)if(t.x>e.min.x&&t.x<e.max.x&&t.z>e.min.z&&t.z<e.max.z&&t.y<e.max.y)return e.name;return null}applyColors(){for(const t of Object.keys(this.colors))this.materials[t].color.set(this.colors[t])}resetColors(){Object.assign(this.colors,Md),this.applyColors()}addGround(){this.root.add(Mh(i2,{segments:s2,material:this.materials.ground})),this.root.add(new sx(2))}addHeightReference(){const t=new we,e=.3,n=6;for(let s=0;s<n;s++){const r=new ee(new G(.08,e,.08),new ln({color:s%2===0?r2:o2,flatShading:!0}));r.position.y=e*(s+.5),t.add(r)}t.position.set(-2,0,0),this.root.add(t)}addMeasuredCubes(){const t=[1,2,4];let e=4;for(const n of t)this.root.add(Ee(ve(n,n,n,this.materials.cube,e+n/2,0,0))),e+=n+1}addDistanceMarkers(){for(const t of[5,10,20,30])this.root.add(Ee(ve(.1,2,.1,this.materials.marker,0,0,-t)))}addMovementGym(){const t=new we;t.name="MovementGym",this.addRamps(t),this.addStairs(t),this.addKerbs(t),this.addJumpGaps(t),this.addStrafeWall(t),this.addFallWalkway(t),this.root.add(Ee(t))}addRamps(t){const e=[10,20,30,45],n=4;e.forEach((s,r)=>{const o=c2(2.5,n,s,this.materials.ramp);o.position.set(-6-r*4,0,-2),t.add(o);const a=n*Math.tan(s*Math.PI/180);t.add(ve(2.5,.2,2,this.materials.ramp,-6-r*4,a-.2,-7))})}addStairs(t){const e=[{rise:.18,run:.3,x:-24},{rise:.3,run:.3,x:-28}];for(const n of e)for(let s=0;s<8;s++){const r=n.rise*(s+1);t.add(ve(2.5,r,n.run,this.materials.stair,n.x,0,-2-s*n.run))}}addKerbs(t){[.2,.35,.5,.9].forEach((e,n)=>{t.add(ve(3,e,2,this.materials.platform,-8-n*4,0,5))})}addJumpGaps(t){const e=[1.5,2.5,3.5],n=3,s=1.2;let r=18;t.add(ve(3,s,n,this.materials.platform,-26,0,r));for(const o of e)r-=n+o,t.add(ve(3,s,n,this.materials.platform,-26,0,r))}addStrafeWall(t){t.add(ve(.4,3,16,this.materials.wall,-4,0,8)),t.add(ve(6,3,.4,this.materials.wall,-7,0,15.8))}addFallWalkway(t){t.add(ve(2.5,.2,8,this.materials.platform,-18,3.8,-12))}addCalibrationBoard(){const t=new we;t.name="CalibrationBoard";const e=7,n=-12;t.add(Ee(ve(12,6,.3,this.materials.wall,e,0,n)));const s=[[16711680,65280,255,16777215],[65535,16711935,16776960,0],[3355443,6710886,10066329,13421772],[9278609,6044206,11567168,3028544]],r=.9;s.forEach((l,h)=>{l.forEach((u,f)=>{const d=new ee(new hi(r,r),new gr({color:u}));d.position.set(e-4.6+f*(r+.15),5.1-h*(r+.15),n+.16),t.add(d)})}),t.add(ec(5.2,.7,e+2.6,4.3,n+.16,l=>[l,l,l])),t.add(ec(5.2,.7,e+2.6,3.4,n+.16,l=>[l,l*.35,.12])),t.add(ec(5.2,.7,e+2.6,2.5,n+.16,l=>[.1,l*.6,l]));const o=new ee(new yr(1.1,48,32),new ln({color:9278609}));o.position.set(e-8.5,1.1,n),t.add(Ee(o));const a=Math.PI/6,c=new ee(new hi(6,4),new ln({color:7305853,side:mn}));c.position.set(e-13.5,2*Math.cos(a),n),c.rotation.x=-a,t.add(Ee(c)),this.root.add(t)}addSoundGarden(){const t=new we;t.name="SoundGarden";const e=Lf.build({seed:4021});e.position.set(this.anchors.tree.x,0,this.anchors.tree.z),t.add(Ee(e)),e.geometry.computeBoundingBox();const n=e.geometry.boundingBox;n&&(this.anchors.tree.setY(n.max.y*.75),this.anchors.bird.set(this.anchors.tree.x+n.max.x*.45,n.max.y*.66,this.anchors.tree.z+n.max.z*.3));const s=Pl.build({seed:771});s.position.set(this.anchors.bush.x,0,this.anchors.bush.z),t.add(s);const r=Pl.build({seed:9114,scale:.8});r.position.set(9.2,0,16.8),t.add(r),t.add(this.bird()),t.add(this.machine()),this.root.add(t)}bird(){const t=new we,e=this.anchors.bird,n=new ee(new te(.16,0),this.materials.creature);n.position.copy(e),n.scale.set(1,.85,1.3);const s=new ee(new $t(.045,.14,4),this.materials.marker);s.position.set(e.x,e.y+.02,e.z+.2),s.rotation.x=Math.PI/2;const r=new ee(new $t(.07,.26,4),this.materials.creature);return r.position.set(e.x,e.y+.03,e.z-.22),r.rotation.x=-Math.PI/2,t.add(n,s,r),t}machine(){const t=new we,e=this.anchors.machine;t.add(Ee(ve(1.8,1.6,1.2,this.materials.metal,e.x,0,e.z))),this.wheel=new ee(new $(.7,.7,.16,12),this.materials.metal),this.wheel.position.set(e.x+1.05,1.2,e.z),this.wheel.rotation.x=Math.PI/2,t.add(this.wheel);for(let s=0;s<4;s++){const r=new ee(new G(.1,1.3,.08),this.materials.marker);r.rotation.z=s/4*Math.PI,this.wheel.add(r)}const n=new ee(new $(.14,.14,2.6,8),this.materials.metal);return n.position.set(e.x-.6,2.4,e.z),t.add(n),t}addRooms(){const t=new we;t.name="Rooms";const e=.4,n=this.materials.wall;t.add(ve(14+e*2,7,e,n,22,0,-18-e/2)),t.add(ve(e,7,14,n,15-e/2,0,-11)),t.add(ve(e,7,14,n,29+e/2,0,-11)),t.add(ve(14+e*2,e,14+e*2,n,22,7,-11)),t.add(ve(7,7,e,n,18.5,0,-4)),t.add(ve(5,7,e,n,26.5,0,-4)),t.add(ve(2,4.6,e,n,23,2.4,-4)),t.add(ve(e,3,8,n,19-e/2,0,0)),t.add(ve(e,3,8,n,27+e/2,0,0)),t.add(ve(8+e*2,e,8,n,23,3,0)),t.add(ve(3,3,e,n,20.5,0,4)),t.add(ve(3,3,e,n,25.5,0,4)),t.add(ve(2,.6,e,n,23,2.4,4)),this.root.add(Ee(t))}dispose(){this.root.traverse(t=>{if(t instanceof ee||t instanceof fh||t instanceof gw){t.geometry.dispose();const e=t.material;if(Array.isArray(e))for(const n of e)n.dispose();else e.dispose()}}),this.root.clear()}}function h2(i,t){return Math.PI*i*t}function Ss(i,t,e,n={}){const s=n.ring??"excitation",r=n.compensation??"energy",o=n.maxQ??(s==="filter"?220:14),a=[],c=[];return{inputs:t.map(h=>{const u=i.createGain(),f=i.createBiquadFilter();f.type="bandpass",f.frequency.value=h.hz;const d=h.q??(s==="filter"?Math.min(o,Math.max(1,h2(h.hz,h.decay))):Math.min(o,Math.max(4,4+h.decay*24)));f.Q.value=d,c.push(d);const g=i.createGain();return g.gain.value=r==="energy"?Math.sqrt(d):1/Math.sqrt(d),u.connect(f).connect(g).connect(e),a.push(u,f,g),u}),modes:t,qs:c,dispose(){for(const h of a)h.disconnect()}}}const Il=8,nc=48;function Df(i){return Array.from({length:Il},(t,e)=>{const n=((e+1)/Il)**2,s=new Float32Array(nc);for(let r=0;r<nc;r++)s[r]=n*i(r/(nc-1));return s})}const u2=Df(i=>.5*(1-Math.cos(2*Math.PI*i)));Df(i=>{if(i<.05)return .5*(1-Math.cos(Math.PI*(i/.05)));const e=(i-.05)/(1-.05);return Math.exp(-5*e)*(1-e)});function d2(i){return i[Math.floor(Math.random()*Il)]}function wr(i,t,e,n,s){i.setValueAtTime(0,t),i.linearRampToValueAtTime(e,t+n),i.setTargetAtTime(0,t+n,s/3)}function Nf(i,t,e){const n=i.createGain(),s=i.createBiquadFilter();return s.type="bandpass",s.frequency.value=t.hz,s.Q.value=t.q,n.connect(s).connect(e),{input:n,dispose(){n.disconnect(),s.disconnect()}}}function Uf(i,t,e,n,s,r){const o=n.count/Math.max(n.over,.001);let a=0;for(let c=0;c<n.count&&(a+=-Math.log(1-Math.random()*.999-.001)/o,!(a>n.over*1.4));c++){const l=Math.exp(-a/n.energyDecay),h=r*n.level*l*(.35+Math.random()*.65);if(h<.002)continue;const u=i.createBufferSource();u.buffer=t,u.playbackRate.value=.7+Math.random()*.7;const f=i.createGain(),d=s+a;wr(f.gain,d,h,8e-4,.012),u.connect(f).connect(e),u.start(d,Math.random()*Math.max(t.duration-.2,0),.06),u.stop(d+.07)}}function Rn(i,t,e,n,s,r){if(s<=5e-4)return;const o=i.createBufferSource();o.buffer=t;const a=i.createGain();wr(a.gain,n,s,Math.min(.0012,r*.3),r*1.6),o.connect(a).connect(e),o.start(n,Math.random()*Math.max(t.duration-.5,0),r+.05),o.stop(n+r+.06)}function ra(i,t,e,n,s,r,o,a=.002){if(n<=5e-4)return;const c=i.createOscillator();c.type="sine",c.frequency.setValueAtTime(s,e),c.frequency.exponentialRampToValueAtTime(Math.max(r,1),e+o);const l=i.createGain();wr(l.gain,e,n,a,o),c.connect(l).connect(t),c.start(e),c.stop(e+o*3+.06)}const lo={stone:{level:.5,impact:{level:.9,duration:.011,tone:3800},modes:[{hz:620,decay:.06,level:.6},{hz:1450,decay:.03,level:.32},{hz:2600,decay:.018,level:.12}],grit:{count:5,over:.06,energyDecay:.025,hz:2600,q:1.2,level:.12},toe:.45,roll:.075},wood:{level:.6,impact:{level:.7,duration:.018,tone:1700},modes:[{hz:155,decay:.22,level:1},{hz:390,decay:.15,level:.6},{hz:720,decay:.075,level:.22}],grit:{count:4,over:.05,energyDecay:.02,hz:1200,q:.9,level:.08},toe:.6,roll:.085},earth:{level:.5,impact:{level:1,duration:.022,tone:900},modes:[{hz:120,decay:.05,level:.55}],grit:{count:9,over:.07,energyDecay:.028,hz:1600,q:1,level:.22},toe:.4,roll:.085},gravel:{level:.5,impact:{level:.45,duration:.012,tone:2400},modes:[],grit:{count:26,over:.16,energyDecay:.06,hz:3e3,q:1.4,level:.75},toe:.7,roll:.09},grass:{level:.32,impact:{level:.5,duration:.03,tone:1400},modes:[],grit:{count:16,over:.11,energyDecay:.045,hz:5200,q:.9,level:.4},toe:.6,roll:.085},leaves:{level:.4,impact:{level:.35,duration:.02,tone:2600},modes:[],grit:{count:34,over:.2,energyDecay:.08,hz:4200,q:2.2,level:.55},toe:.75,roll:.09},metal:{level:.45,impact:{level:.9,duration:.004,tone:9e3},modes:[{hz:480,decay:.5,level:.5},{hz:1270,decay:.42,level:.45},{hz:2340,decay:.3,level:.3},{hz:4100,decay:.18,level:.2}],grit:null,toe:.5,roll:.07},mud:{level:.5,impact:{level:1,duration:.05,tone:700},modes:[{hz:240,decay:.06,level:.35}],grit:{count:6,over:.09,energyDecay:.03,hz:900,q:3.2,level:.3},toe:.3,roll:.1}},f2=6,bd=.35,p2=9;function Ws(i,t){return i+Math.random()*(t-i)}class m2{surface="earth";engine;output;body;panner;reverbSend;chains=new Map;left=!1;constructor(t,e=.55){this.engine=t;const n=t.context;this.output=n.createGain(),this.output.gain.value=e,this.body=n.createBiquadFilter(),this.body.type="lowpass",this.body.frequency.value=5200,this.body.Q.value=.6,this.panner=n.createStereoPanner(),this.reverbSend=n.createGain(),this.reverbSend.gain.value=.6,this.output.connect(this.body),this.body.connect(this.panner),this.panner.connect(t.dry),this.panner.connect(this.reverbSend),this.reverbSend.connect(t.send)}setReverb(t){this.reverbSend.gain.setTargetAtTime(Math.max(0,t),this.engine.context.currentTime,.1)}step(t){const e=this.engine.context;if(e.state!=="running"||!this.engine.noise)return;const n=lo[this.surface],s=this.chainFor(this.surface),r=e.currentTime+.004,o=bd+(1-bd)*(1-Math.exp(-t/(f2*.45))),a=n.level*Math.min(o,1);if(this.panner.pan.setValueAtTime(this.takeFoot()*.2,r),this.strike(s,n,r,a*Ws(.9,1.1)),n.toe>0){const c=n.roll*Math.max(.35,1-t/12);this.strike(s,n,r+c,a*n.toe*Ws(.8,1.1))}}land(t){const e=this.engine.context;if(e.state!=="running"||!this.engine.noise)return;const n=lo[this.surface],s=this.chainFor(this.surface),r=e.currentTime+.004,o=Math.min(t/p2,1),a=n.level*(.7+o*.85);this.panner.pan.setValueAtTime(0,r),this.strike(s,n,r,a),this.strike(s,n,r+Ws(.012,.03),a*Ws(.4,.6))}jump(){const t=this.engine.context;if(t.state!=="running"||!this.engine.noise)return;const e=lo[this.surface],n=this.chainFor(this.surface),s=t.currentTime+.004;this.panner.pan.setValueAtTime(this.takeFoot()*.12,s),this.strike(n,e,s,e.level*Ws(.42,.55),{stretch:3.2,modes:.28,grit:1.7})}takeFoot(){const t=this.left?-1:1;return this.left=!this.left,t}strike(t,e,n,s,r){const o=this.engine.context,a=this.engine.noise;if(!a)return;const c=r?.stretch??1,l=r?.modes??1,h=r?.grit??1;Rn(o,a.white,t.impactInput,n,s*e.impact.level,e.impact.duration*c);for(let u=0;u<e.modes.length;u++)Rn(o,a.white,t.bank.inputs[u],n,s*e.modes[u].level*.5*l,.002);e.grit&&t.gritInput&&Uf(o,a.white,t.gritInput,e.grit,n,s*h)}chainFor(t){const e=this.chains.get(t);if(e)return e;const n=this.engine.context,s=lo[t],r=n.createGain(),o=n.createBiquadFilter();o.type="lowpass",o.frequency.value=s.impact.tone,r.connect(o).connect(this.output);const a=Ss(n,s.modes,this.output,{ring:"filter",compensation:"inverse"});let c=null;s.grit&&(c=Nf(n,s.grit,this.output).input);const l={impactInput:r,bank:a,gritInput:c};return this.chains.set(t,l),l}dispose(){this.output.disconnect(),this.body.disconnect(),this.panner.disconnect(),this.reverbSend.disconnect()}}const g2=6;function Ff(i){const t=Math.floor(i.sampleRate*g2);return{white:ic(i,t,v2()),pink:ic(i,t,_2()),brown:ic(i,t,w2())}}function ic(i,t,e){const n=i.createBuffer(1,t,i.sampleRate),s=n.getChannelData(0);for(let o=0;o<t;o++)s[o]=e();const r=Math.min(2048,t/4|0);for(let o=0;o<r;o++){const a=o/r;s[o]=s[o]*a+s[t-r+o]*(1-a)}return y2(s),n}function y2(i){let t=0;for(let n=0;n<i.length;n++)t=Math.max(t,Math.abs(i[n]));if(t===0)return;const e=.95/t;for(let n=0;n<i.length;n++)i[n]*=e}function v2(){return()=>Math.random()*2-1}function _2(){let i=0,t=0,e=0,n=0,s=0,r=0,o=0;return()=>{const a=Math.random()*2-1;i=.99886*i+a*.0555179,t=.99332*t+a*.0750759,e=.969*e+a*.153852,n=.8665*n+a*.3104856,s=.55*s+a*.5329522,r=-.7616*r-a*.016898;const c=i+t+e+n+s+r+o+a*.5362;return o=a*.115926,c*.11}}function w2(){let i=0;return()=>{const t=Math.random()*2-1;return i=(i+.02*t)/1.02,i*3.5}}function bn(i,t,e,n=.06){const s=i.createBufferSource();return s.buffer=t,s.loop=!0,s.playbackRate.value=1+(Math.random()*2-1)*n,s.connect(e),s.start(0,Math.random()*t.duration),{source:s,stop(r=0){try{s.stop(r)}catch{}}}}const ho={open:{rt60:.7,preDelay:.012,damping:.7,wet:.12},cell:{rt60:.45,preDelay:.004,damping:.55,wet:.3},hall:{rt60:4.2,preDelay:.035,damping:.18,wet:.62}};async function x2(i,t){const e=Math.max(t.rt60,.05),n=Math.ceil(i*(e+t.preDelay)),s=new OfflineAudioContext(2,n,i),r=s.createBufferSource();r.buffer=M2(s,n,i,t);const o=s.createBiquadFilter();o.type="lowpass",o.frequency.value=700+(1-t.damping)**2*17300;const a=s.createBiquadFilter();return a.type="highpass",a.frequency.value=90,r.connect(o).connect(a).connect(s.destination),r.start(0),s.startRendering()}function M2(i,t,e,n){const s=i.createBuffer(2,t,e),r=Math.floor(n.preDelay*e),o=Math.exp(-Math.log(1e3)/(n.rt60*e));for(let a=0;a<2;a++){const c=s.getChannelData(a);let l=1;for(let h=r;h<t;h++)c[h]=(Math.random()*2-1)*l,l*=o}return s}const sc=[1,.4,.2,.1],b2=[1,2.7,6.1,13.3],Sd=.11;function Ed(i){let t=Math.imul(i|0,668265261);return t^=t>>>15,t=Math.imul(t,2246822507),t^=t>>>13,(t>>>0)/4294967296}function Ll(i){const t=Math.floor(i),e=i-t,n=(1-Math.cos(e*Math.PI))*.5;return Ed(t)*(1-n)+Ed(t+1)*n}const S2=1.35;function Ad(i){let t=0,e=0;for(let s=0;s<sc.length;s++)t+=Ll(i*b2[s]+s*17.3)*sc[s],e+=sc[s];const n=t/e;return Math.min(1,Math.max(0,.5+(n-.5)*S2))}const E2={windSpeed:.5,gustDepth:.6,gustRate:.06,windDirection:2.1,frontSpeed:9};class Of{settings={...E2};gust=0;swell=.5;strength=0;time=0;update(t){this.time+=t*this.settings.gustRate,this.gust=Ad(this.time),this.swell=Ll(this.time*Sd+91.7),this.strength=this.fieldAt(this.time)}fieldAt(t){const{windSpeed:e,gustDepth:n}=this.settings,s=Ad(t),r=Ll(t*Sd+91.7),o=e*(.45+r*1.1);return Math.min(1,Math.max(0,o+(s-.5)*n))}lagAt(t,e){const{windDirection:n,frontSpeed:s,gustRate:r}=this.settings;return(t*Math.cos(n)+e*Math.sin(n))/Math.max(s,.5)*r}strengthAt(t,e){return this.fieldAt(this.time-this.lagAt(t,e))}get phase(){return this.time}}const A2=""+new URL("processor-Xg0mnuxH.js",import.meta.url).href,Td=new WeakMap;function T2(i){let t=Td.get(i);return t||(t=i.audioWorklet.addModule(A2),Td.set(i,t)),t}const Rd=new Map;async function R2(i,t){let e=Rd.get(i);return e||(e=fetch(i).then(n=>{if(!n.ok)throw new Error(`${n.status} ${n.statusText}`);return n.arrayBuffer()}).then(n=>({wasm:n,meta:t})).catch(n=>(console.warn(`faust: could not load ${i} — falling back`,n),null)),Rd.set(i,e)),e}async function zf(i,t,e){try{const[n]=await Promise.all([R2(t,e),T2(i)]);if(!n)return null;const s=new AudioWorkletNode(i,"faust-processor",{numberOfInputs:e.inputs>0?1:0,numberOfOutputs:1,outputChannelCount:[Math.max(e.outputs,1)],processorOptions:{wasm:n.wasm,meta:n.meta}}),r=new Map;for(const[o,a]of Object.entries(e.params))r.set(o,a.init);return{node:s,meta:e,set(o,a){r.set(o,a),s.port.postMessage({type:"param",key:o,value:a})},get(o){return r.get(o)??0},dispose(){s.port.onmessage=null,s.disconnect()}}}catch(n){return console.warn("faust: worklet unavailable — falling back",n),null}}const kf=Object.freeze(Object.defineProperty({__proto__:null,createFaustNode:zf},Symbol.toStringTag,{value:"Module"})),C2=""+new URL("reverb-BkEOyDCs.wasm",import.meta.url).href,P2=C2,I2={name:"reverb",inputs:1,outputs:2,size:1982988,params:{crossover:{at:36,init:200,min:50,max:1e3,step:1},damping:{at:16,init:6e3,min:700,max:16e3,step:1},decayLow:{at:24,init:2,min:.2,max:12,step:.01},decayMid:{at:28,init:2,min:.2,max:12,step:.01},preDelay:{at:327756,init:20,min:0,max:100,step:1}}},Bf={masterVolume:.7,reverbAmount:1,airAbsorption:.65,occlusion:.8},L2=.12,Cd=8,Pd=24;class D2{context;settings={...Bf};weather=new Of;dry;send;duck;master;noise=null;ready;started=!1;rooms=new Map;currentRoom=null;occlusionTimer=0;emitters=new Set;ranking=[];faust=null;faustWet=null;tap=null;constructor(){this.context=new AudioContext({latencyHint:"interactive"}),this.master=this.context.createGain(),this.duck=this.context.createGain(),this.dry=this.context.createGain(),this.send=this.context.createGain();const t=this.context.createDynamicsCompressor();t.threshold.value=-6,t.knee.value=6,t.ratio.value=12,t.attack.value=.003,t.release.value=.25,this.dry.connect(this.duck),this.duck.connect(this.master),this.master.connect(t),t.connect(this.context.destination),this.ready=this.build(),this.listenForGesture(),document.addEventListener("visibilitychange",this.handleVisibility)}async build(){this.noise=Ff(this.context);const t=await zf(this.context,P2,I2);if(t){const s=this.context.createGain();s.gain.value=0,this.send.connect(t.node),t.node.connect(s),s.connect(this.duck),this.faust=t,this.faustWet=s}const e=Object.keys(ho),n=await Promise.all(e.map(s=>x2(this.context.sampleRate,ho[s])));this.faust||(e.forEach((s,r)=>{const o=this.context.createConvolver();o.normalize=!0,o.buffer=n[r];const a=this.context.createGain();a.gain.value=0,this.send.connect(o),o.connect(a),a.connect(this.duck),this.rooms.set(s,{convolver:o,gain:a})}),this.currentRoom!==null&&this.setRoom(this.currentRoom))}setRoom(t,e=.45){this.currentRoom=t;const n=this.context.currentTime,s=ho[t];if(this.faust&&this.faustWet){this.faust.set("decayLow",s.rt60*1.5),this.faust.set("decayMid",s.rt60),this.faust.set("crossover",200),this.faust.set("damping",700+(1-s.damping)**2*15300),this.faust.set("preDelay",s.preDelay*1e3),this.faustWet.gain.cancelScheduledValues(n),this.faustWet.gain.setTargetAtTime(s.wet*this.settings.reverbAmount,n,e/3);return}if(this.rooms.size!==0)for(const[r,o]of this.rooms){const a=r===t?ho[r].wet*this.settings.reverbAmount:0;o.gain.gain.cancelScheduledValues(n),o.gain.gain.setTargetAtTime(a,n,e/3)}}get reverbKind(){return this.faust?"fdn":"convolution"}get reverbControls(){return this.faust}get analyser(){if(!this.tap){const t=this.context.createAnalyser();t.fftSize=2048,t.smoothingTimeConstant=.6,this.master.connect(t),this.tap=t}return this.tap}get room(){return this.currentRoom}register(t){this.emitters.add(t)}unregister(t){this.emitters.delete(t)}update(t,e){return this.weather.update(t),this.updateListener(e),this.master.gain.value=this.settings.masterVolume,this.occlusionTimer-=t,this.occlusionTimer>0?!1:(this.occlusionTimer=L2,this.allocateVoices(),!0)}allocateVoices(){this.ranking.length=0;for(const e of this.emitters){if(!e.enabled){e.setDetail("virtual");continue}const n=e.position.distanceTo(zn);if(n>e.maxDistance){e.setDetail("virtual");continue}this.ranking.push({emitter:e,priority:n/Math.max(e.importance,.01)})}this.ranking.sort((e,n)=>e.priority-n.priority);const t=2;for(let e=0;e<this.ranking.length;e++){const{emitter:n}=this.ranking[e],s=n.detailLevel;let r;e<Cd?r="hrtf":e<Pd?r="panned":r="virtual",s==="hrtf"&&e<Cd+t?r="hrtf":s==="panned"&&r==="virtual"&&e<Pd+t&&(r="panned"),n.setDetail(r)}}get voiceCounts(){let t=0,e=0,n=0;for(const s of this.emitters)s.detailLevel==="hrtf"?t++:s.detailLevel==="panned"?e++:n++;return{hrtf:t,panned:e,virtual:n}}updateListener(t){const e=this.context.listener;if(t.updateWorldMatrix(!0,!1),zn.setFromMatrixPosition(t.matrixWorld),Mi.set(0,0,-1).applyQuaternion(t.getWorldQuaternion(Id)),bi.set(0,1,0).applyQuaternion(Id),e.positionX){const n=this.context.currentTime,s=.02;e.positionX.linearRampToValueAtTime(zn.x,n+s),e.positionY.linearRampToValueAtTime(zn.y,n+s),e.positionZ.linearRampToValueAtTime(zn.z,n+s),e.forwardX.linearRampToValueAtTime(Mi.x,n+s),e.forwardY.linearRampToValueAtTime(Mi.y,n+s),e.forwardZ.linearRampToValueAtTime(Mi.z,n+s),e.upX.linearRampToValueAtTime(bi.x,n+s),e.upY.linearRampToValueAtTime(bi.y,n+s),e.upZ.linearRampToValueAtTime(bi.z,n+s)}else{const n=e;n.setPosition(zn.x,zn.y,zn.z),n.setOrientation(Mi.x,Mi.y,Mi.z,bi.x,bi.y,bi.z)}}get listenerPosition(){return zn}applyReverbAmount(){this.currentRoom!==null&&this.setRoom(this.currentRoom,.05)}listenForGesture(){const t=()=>{this.context.resume().then(()=>{this.started=this.context.state==="running"}),window.removeEventListener("pointerdown",t),window.removeEventListener("keydown",t),window.removeEventListener("touchstart",t)};window.addEventListener("pointerdown",t),window.addEventListener("keydown",t),window.addEventListener("touchstart",t)}handleVisibility=()=>{document.hidden?this.context.suspend():this.started&&this.context.resume()};dispose(){document.removeEventListener("visibilitychange",this.handleVisibility),this.context.close()}}const zn=new R,Mi=new R,bi=new R,Id=new $n;/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.21.0
 * @author George Michael Brower
 * @license MIT
 */class Sn{constructor(t,e,n,s,r="div"){this.parent=t,this.object=e,this.property=n,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(r),this.domElement.classList.add("lil-controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("lil-name"),Sn.nextNameID=Sn.nextNameID||0,this.$name.id=`lil-gui-name-${++Sn.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("lil-widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(n)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("lil-disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class N2 extends Sn{constructor(t,e,n){super(t,e,n,"lil-boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Dl(i){let t,e;return(t=i.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=i.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=i.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const U2={isPrimitive:!0,match:i=>typeof i=="string",fromHexString:Dl,toHexString:Dl},pr={isPrimitive:!0,match:i=>typeof i=="number",fromHexString:i=>parseInt(i.substring(1),16),toHexString:i=>"#"+i.toString(16).padStart(6,0)},F2={isPrimitive:!1,match:i=>Array.isArray(i)||ArrayBuffer.isView(i),fromHexString(i,t,e=1){const n=pr.fromHexString(i);t[0]=(n>>16&255)/255*e,t[1]=(n>>8&255)/255*e,t[2]=(n&255)/255*e},toHexString([i,t,e],n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return pr.toHexString(s)}},O2={isPrimitive:!1,match:i=>Object(i)===i,fromHexString(i,t,e=1){const n=pr.fromHexString(i);t.r=(n>>16&255)/255*e,t.g=(n>>8&255)/255*e,t.b=(n&255)/255*e},toHexString({r:i,g:t,b:e},n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return pr.toHexString(s)}},z2=[U2,pr,F2,O2];function k2(i){return z2.find(t=>t.match(i))}class B2 extends Sn{constructor(t,e,n,s){super(t,e,n,"lil-color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=k2(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const r=Dl(this.$text.value);r&&this._setValueFromHexString(r)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class rc extends Sn{constructor(t,e,n){super(t,e,n,"lil-function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class H2 extends Sn{constructor(t,e,n,s,r,o){super(t,e,n,"lil-number"),this._initInput(),this.min(s),this.max(r);const a=o!==void 0;this.step(a?o:this._getImplicitStep(),a),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let _=parseFloat(this.$input.value);isNaN(_)||(this._stepExplicit&&(_=this._snap(_)),this.setValue(this._clamp(_)))},n=_=>{const v=parseFloat(this.$input.value);isNaN(v)||(this._snapClampSetValue(v+_),this.$input.value=this.getValue())},s=_=>{_.key==="Enter"&&this.$input.blur(),_.code==="ArrowUp"&&(_.preventDefault(),n(this._step*this._arrowKeyMultiplier(_))),_.code==="ArrowDown"&&(_.preventDefault(),n(this._step*this._arrowKeyMultiplier(_)*-1))},r=_=>{this._inputFocused&&(_.preventDefault(),n(this._step*this._normalizeMouseWheel(_)))};let o=!1,a,c,l,h,u;const f=5,d=_=>{a=_.clientX,c=l=_.clientY,o=!0,h=this.getValue(),u=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",y)},g=_=>{if(o){const v=_.clientX-a,w=_.clientY-c;Math.abs(w)>f?(_.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(v)>f&&y()}if(!o){const v=_.clientY-l;u-=v*this._step*this._arrowKeyMultiplier(_),h+u>this._max?u=this._max-h:h+u<this._min&&(u=this._min-h),this._snapClampSetValue(h+u)}l=_.clientY},y=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",y)},m=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",r,{passive:!1}),this.$input.addEventListener("mousedown",d),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("lil-slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("lil-fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("lil-has-slider");const t=(p,_,v,w,M)=>(p-_)/(v-_)*(M-w)+w,e=p=>{const _=this.$slider.getBoundingClientRect();let v=t(p,_.left,_.right,this._min,this._max);this._snapClampSetValue(v)},n=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",r)},s=p=>{e(p.clientX)},r=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",r)};let o=!1,a,c;const l=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},h=p=>{p.touches.length>1||(this._hasScrollBar?(a=p.touches[0].clientX,c=p.touches[0].clientY,o=!0):l(p),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",f))},u=p=>{if(o){const _=p.touches[0].clientX-a,v=p.touches[0].clientY-c;Math.abs(_)>Math.abs(v)?l(p):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",f))}else p.preventDefault(),e(p.touches[0].clientX)},f=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",f)},d=this._callOnFinishChange.bind(this),g=400;let y;const m=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const v=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+v),this.$input.value=this.getValue(),clearTimeout(y),y=setTimeout(d,g)};this.$slider.addEventListener("mousedown",n),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("lil-active",t),document.body.classList.toggle("lil-dragging",t),document.body.classList.toggle(`lil-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:n}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,n=-t.wheelDelta/120,n*=this._stepExplicit?1:10),e+-n}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){let e=0;return this._hasMin?e=this._min:this._hasMax&&(e=this._max),t-=e,t=Math.round(t/this._step)*this._step,t+=e,t=parseFloat(t.toPrecision(15)),t}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class G2 extends Sn{constructor(t,e,n,s){super(t,e,n,"lil-option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("lil-focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("lil-focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const n=document.createElement("option");n.textContent=e,this.$select.appendChild(n)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class V2 extends Sn{constructor(t,e,n){super(t,e,n,"lil-string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}var W2=`.lil-gui {
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
}`;function X2(i){const t=document.createElement("style");t.innerHTML=i;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Ld=!1;class bh{constructor({parent:t,autoPlace:e=t===void 0,container:n,width:s,title:r="Controls",closeFolders:o=!1,injectStyles:a=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("button"),this.$title.classList.add("lil-title"),this.$title.setAttribute("aria-expanded",!0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("lil-children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(r),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("lil-root"),c&&this.domElement.classList.add("lil-allow-touch-styles"),!Ld&&a&&(X2(W2),Ld=!0),n?n.appendChild(this.domElement):e&&(this.domElement.classList.add("lil-auto-place","autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=o}add(t,e,n,s,r){if(Object(n)===n)return new G2(this,t,e,n);const o=t[e];switch(typeof o){case"number":return new H2(this,t,e,n,s,r);case"boolean":return new N2(this,t,e);case"string":return new V2(this,t,e);case"function":return new rc(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,n=1){return new B2(this,t,e,n)}addFolder(t){const e=new bh({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(n=>{n instanceof rc||n._name in t.controllers&&n.load(t.controllers[n._name])}),e&&t.folders&&this.folders.forEach(n=>{n._title in t.folders&&n.load(t.folders[n._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(n=>{if(!(n instanceof rc)){if(n._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${n._name}"`);e.controllers[n._name]=n.save()}}),t&&this.folders.forEach(n=>{if(n._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${n._title}"`);e.folders[n._title]=n.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("lil-closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("lil-transition");const n=r=>{r.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("lil-transition"),this.$children.removeEventListener("transitionend",n))};this.$children.addEventListener("transitionend",n);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("lil-closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(n=>n.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}var or=function(){var i=0,t=document.createElement("div");t.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",t.addEventListener("click",function(h){h.preventDefault(),n(++i%t.children.length)},!1);function e(h){return t.appendChild(h.dom),h}function n(h){for(var u=0;u<t.children.length;u++)t.children[u].style.display=u===h?"block":"none";i=h}var s=(performance||Date).now(),r=s,o=0,a=e(new or.Panel("FPS","#0ff","#002")),c=e(new or.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var l=e(new or.Panel("MB","#f08","#201"));return n(0),{REVISION:16,dom:t,addPanel:e,showPanel:n,begin:function(){s=(performance||Date).now()},end:function(){o++;var h=(performance||Date).now();if(c.update(h-s,200),h>=r+1e3&&(a.update(o*1e3/(h-r),100),r=h,o=0,l)){var u=performance.memory;l.update(u.usedJSHeapSize/1048576,u.jsHeapSizeLimit/1048576)}return h},update:function(){s=this.end()},domElement:t,setMode:n}};or.Panel=function(i,t,e){var n=1/0,s=0,r=Math.round,o=r(window.devicePixelRatio||1),a=80*o,c=48*o,l=3*o,h=2*o,u=3*o,f=15*o,d=74*o,g=30*o,y=document.createElement("canvas");y.width=a,y.height=c,y.style.cssText="width:80px;height:48px";var m=y.getContext("2d");return m.font="bold "+9*o+"px Helvetica,Arial,sans-serif",m.textBaseline="top",m.fillStyle=e,m.fillRect(0,0,a,c),m.fillStyle=t,m.fillText(i,l,h),m.fillRect(u,f,d,g),m.fillStyle=e,m.globalAlpha=.9,m.fillRect(u,f,d,g),{dom:y,update:function(p,_){n=Math.min(n,p),s=Math.max(s,p),m.fillStyle=e,m.globalAlpha=1,m.fillRect(0,0,a,f),m.fillStyle=t,m.fillText(r(p)+" "+i+" ("+r(n)+"-"+r(s)+")",l,h),m.drawImage(y,u+o,f,d-o,g,u,f,d-o,g),m.fillRect(u+d-o,f,o,g),m.fillStyle=e,m.globalAlpha=.9,m.fillRect(u+d-o,f,o,r((1-p/_)*g))}}};function q2(){if(!Ef.debug)return{gui:null,stats:null,update:()=>{},dispose:()=>{}};const i=new or;i.dom.style.position="fixed",i.dom.style.top="0",i.dom.style.left="0",document.body.appendChild(i.dom);const t=new bh({title:"hswow"});return t.domElement.style.setProperty("--width","280px"),{gui:t,stats:i,update:()=>i.update(),dispose:()=>{t.destroy(),i.dom.remove()}}}const uo=2e4,Y2=420,$2=.32,Z2=.08,oc=.04,ac=.5;class Hf{position=new R;enabled=!0;importance;maxDistance;engine;model;absorption;occlusion;swap;panner;sendGain;reverb;ignoreAbsorption;ignoreOcclusion;invertDistance;occluded=!1;detail="panned";connected=!1;pending=0;constructor(t,e,n){this.engine=t,this.model=e,this.position.copy(n.position),this.maxDistance=n.maxDistance??60,this.reverb=n.reverb??1,this.importance=n.importance??1,this.ignoreAbsorption=n.ignoreAbsorption??!1,this.ignoreOcclusion=n.ignoreOcclusion??!1,this.invertDistance=n.invertDistance??!1;const s=t.context;this.absorption=s.createBiquadFilter(),this.absorption.type="lowpass",this.absorption.frequency.value=uo,this.occlusion=s.createGain(),this.swap=s.createGain(),this.panner=s.createPanner(),this.panner.panningModel="equalpower",this.panner.distanceModel="inverse",this.panner.refDistance=n.refDistance??1.5,this.panner.maxDistance=this.maxDistance,this.panner.rolloffFactor=this.invertDistance?0:n.rolloff??1.1,n.direction&&(this.panner.coneInnerAngle=n.coneInner??90,this.panner.coneOuterAngle=n.coneOuter??240,this.panner.coneOuterGain=n.coneOuterGain??.35,K2(this.panner,n.direction)),Dd(this.panner,this.position),this.sendGain=s.createGain(),this.sendGain.gain.value=this.reverb,this.absorption.connect(this.occlusion),this.occlusion.connect(this.swap),this.swap.connect(this.panner),this.panner.connect(t.dry),this.panner.connect(this.sendGain),this.sendGain.connect(t.send),this.connect(),t.register(this)}moveTo(t){this.position.copy(t),Dd(this.panner,this.position)}setDetail(t){t!==this.detail&&(this.detail=t,this.retarget())}retarget(){const t=this.engine.context,e=t.currentTime;this.swap.gain.cancelScheduledValues(e),this.swap.gain.setValueAtTime(this.swap.gain.value,e),this.swap.gain.linearRampToValueAtTime(0,e+oc),window.clearTimeout(this.pending),this.pending=window.setTimeout(()=>{const n=this.detail;if(n==="virtual"){this.connected&&(this.disconnect(),this.model.setActive?.(!1));return}this.connected||(this.connect(),this.model.setActive?.(!0)),this.panner.panningModel=n==="hrtf"?"HRTF":"equalpower";const s=t.currentTime;this.swap.gain.cancelScheduledValues(s),this.swap.gain.setValueAtTime(0,s),this.swap.gain.linearRampToValueAtTime(1,s+oc)},oc*1e3+10)}update(t,e,n){if(this.detail==="virtual"||!this.enabled){this.enabled===!1&&this.connected&&this.glide(this.occlusion.gain,0);return}const s=this.position.distanceTo(this.engine.listenerPosition);this.model.update?.(t,this.engine,this.position),n&&!this.ignoreOcclusion&&(this.occluded=this.testOcclusion(e,s));const r=this.engine.settings,o=Math.min(s/this.maxDistance,1),a=this.ignoreAbsorption?uo:uo*(1-r.airAbsorption*Math.sqrt(o)*.94),c=this.occluded?r.occlusion:0,l=Math.min(a,Nd(uo,Y2,c)),h=this.invertDistance?Ud(o):o<=ac?1:1-Ud((o-ac)/(1-ac));this.glide(this.absorption.frequency,Math.max(l,180)),this.glide(this.occlusion.gain,Nd(1,$2,c)*h),this.sendGain.gain.value=this.reverb*r.reverbAmount}testOcclusion(t,e){if(e<.5)return!1;Hn.subVectors(this.position,this.engine.listenerPosition).divideScalar(e);const n=t.raycast(this.engine.listenerPosition,Hn);return n!==null&&n<e-.35}connect(){this.connected||(this.model.output.connect(this.absorption),this.connected=!0)}disconnect(){if(this.connected){try{this.model.output.disconnect(this.absorption)}catch{}this.connected=!1}}glide(t,e){t.setTargetAtTime(e,this.engine.context.currentTime,Z2)}get isOccluded(){return this.occluded}get isVirtual(){return this.detail==="virtual"}get detailLevel(){return this.detail}dispose(){this.engine.unregister(this),this.disconnect(),this.model.dispose(),this.panner.disconnect(),this.sendGain.disconnect(),this.absorption.disconnect(),this.occlusion.disconnect(),this.swap.disconnect()}}function Dd(i,t){i.positionX?(i.positionX.value=t.x,i.positionY.value=t.y,i.positionZ.value=t.z):i.setPosition(t.x,t.y,t.z)}function K2(i,t){Hn.copy(t).normalize(),i.orientationX?(i.orientationX.value=Hn.x,i.orientationY.value=Hn.y,i.orientationZ.value=Hn.z):i.setOrientation(Hn.x,Hn.y,Hn.z)}function Nd(i,t,e){return i+(t-i)*e}function Ud(i){const t=i<0?0:i>1?1:i;return t*t*t*(t*(t*6-15)+10)}const Hn=new R,j2=220,J2=560,Q2=1.4,cc=1300,tM=2900,lc=4,eM=9;function Gf(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("wind model built before the noise buffers were ready");const s=e.createGain();s.gain.value=t.gain??.5;const r=e.createBiquadFilter();r.type="lowpass",r.frequency.value=t.tone??3400,r.Q.value=.4;const o=e.createBiquadFilter();o.type="highshelf",o.frequency.value=2200,o.gain.value=-7;const a=e.createGain();a.gain.value=.5,r.connect(o).connect(a).connect(s);const c=e.createGain(),l=e.createGain(),h=e.createGain(),u=e.createBiquadFilter();u.type="lowpass",u.frequency.value=j2;const f=e.createBiquadFilter();f.type="bandpass",f.frequency.value=J2,f.Q.value=Q2;const d=e.createBiquadFilter();d.type="bandpass",d.frequency.value=cc,d.Q.value=lc;const g=[bn(e,n.brown,u),bn(e,n.pink,f),bn(e,n.white,d)];u.connect(c).connect(r),f.connect(l).connect(r),d.connect(h).connect(r);const y=t.whistle??1;return{output:s,setTone(m){r.frequency.setTargetAtTime(m,e.currentTime,.1)},update(m,p,_){const v=p.weather.strengthAt(_.x,_.z),w=e.currentTime,M=.09;c.gain.setTargetAtTime(.1+v*.85,w,M),l.gain.setTargetAtTime(.03+v*v*.5,w,M),h.gain.setTargetAtTime(v**3*.2*y,w,M),a.gain.setTargetAtTime(.25+v*.75,w,M*1.6),d.frequency.setTargetAtTime(cc+(tM-cc)*v,w,M),d.Q.setTargetAtTime(lc+(eM-lc)*v,w,M)},dispose(){for(const m of g)m.stop();s.disconnect()}}}const nM=.14,iM=160;function Cn(i,t=nM){let e=0;return{pump(n,s,r="immediate"){const o=i.currentTime;e<o&&(e=o+(r==="oneGap"?s():0));const a=o+t;let c=0;for(;e<a&&c<iM;)n(e),e+=Math.max(s(),1e-4),c++},reset(){e=0}}}function ui(i){const t=Math.max(i,.01);return()=>-Math.log(1-Math.random())/t}function Vf(i,t=.06){return()=>i*(1+(Math.random()*2-1)*t)}function Sh(i,t,e,n=1){const s=t.map(r=>{const o=i.createBiquadFilter();return o.type="bandpass",o.frequency.value=r.hz*n,o.Q.value=r.q,o.connect(e),{filter:o,weight:r.weight,hz:r.hz}});return{pick(){let r=Math.random();for(const o of s)if(r-=o.weight,r<=0)return o.filter;return s[s.length-1].filter},setTone(r,o){for(const a of s)a.filter.frequency.setTargetAtTime(a.hz*r,o,.15)},overlap(r,o){return r*o},dispose(){for(const r of s)r.filter.disconnect()}}}function sM(i,t,e,n,s={}){const r=s.minDuration??.055,o=s.maxDuration??.165,a=r+Math.random()*(o-r),c=i.createBufferSource();c.buffer=t;const l=s.minRate??.7,h=s.maxRate??1.4;c.playbackRate.value=l+Math.random()*(h-l);const u=i.createGain();u.gain.setValueCurveAtTime(d2(s.pool??u2),n,a),c.connect(u).connect(e),c.start(n,Math.random()*Math.max(t.duration-.3,0),a+.02),c.stop(n+a+.03)}const rM=[{hz:1150,q:2.6,weight:.4},{hz:2400,q:3.2,weight:.46},{hz:4600,q:3.8,weight:.14}];function Wf(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("foliage model built before the noise buffers were ready");const s=t.density??240,r=t.tone??1,o=t.restlessness??.2,a=e.createGain();a.gain.value=t.gain??.5;const c=e.createGain();c.gain.value=0,c.connect(a);const l=Sh(e,rM,c,r),h=e.createBiquadFilter();h.type="bandpass",h.frequency.value=1800*r,h.Q.value=.75;const u=e.createGain();u.gain.value=0;const f=bn(e,n.pink,h);h.connect(u).connect(a);let d=t.articulation??.3,g=!0;const y=Cn(e),m=p=>sM(e,n.white,l.pick(),p,{minDuration:.055,maxDuration:.165});return{output:a,setArticulation(p){d=p},setActive(p){g=p,p&&y.reset(),p||(u.gain.value=0,c.gain.value=0)},update(p,_,v){if(!g)return;const w=Math.max(_.weather.strengthAt(v.x,v.z),o),M=e.currentTime;u.gain.setTargetAtTime(.1+w*.5,M,.15),h.frequency.setTargetAtTime((1500+w*1900)*r,M,.15),c.gain.setTargetAtTime(d*(.25+w*.75),M,.15);const S=Math.max(20,s*w*w);y.pump(m,ui(S))},dispose(){f.stop(),l.dispose(),c.disconnect(),a.disconnect()}}}const Fd=[1,2,3.02,4.05,5.97],oM=[1,.5,.28,.16,.09],fo={steady:{speed:1,wear:1,clank:1,min:9,max:26,next:["labouring","surging","idling"]},labouring:{speed:.62,wear:1.8,clank:1.7,min:5,max:14,next:["steady","stalling","surging"]},surging:{speed:1.34,wear:1.3,clank:.8,min:3,max:9,next:["steady","labouring"]},stalling:{speed:.22,wear:2.2,clank:2.4,min:1.5,max:4,next:["labouring","idling"]},idling:{speed:.45,wear:.7,clank:.5,min:8,max:20,next:["steady","surging"]}};function Xf(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("machine model built before the noise buffers were ready");const s=t.fundamental??46,r=t.clank??.5,o=e.createGain();o.gain.value=t.gain??.35;const a=e.createGain();a.gain.value=.5;const c=e.createBiquadFilter();c.type="lowpass",c.frequency.value=520,c.Q.value=.9;const l=[];Fd.forEach((T,P)=>{const C=e.createOscillator();C.type=P===0?"sawtooth":"triangle",C.frequency.value=s*T,C.detune.value=(Math.random()*2-1)*9;const F=e.createGain();F.gain.value=oM[P],C.connect(F).connect(c),C.start(),l.push(C)}),c.connect(a);const h=e.createGain();h.gain.value=1;const u=e.createOscillator();u.type="sine";const f=e.createGain();f.gain.value=.22,u.connect(f).connect(h.gain),u.start(),a.connect(h).connect(o);const d=e.createBiquadFilter();d.type="bandpass",d.frequency.value=2600,d.Q.value=.8;const g=e.createGain();g.gain.value=(t.wear??.4)*.22;const y=bn(e,n.pink,d);d.connect(g).connect(o);const m=e.createGain();m.gain.value=r,m.connect(o);let p=t.rpm??52,_=p,v=!0;const w=Cn(e,.15);let M="steady",S=12;const E=(t.wear??.4)*.22,A=T=>{if(r<=0)return;const P=e.createBufferSource();P.buffer=n.white;const C=e.createBiquadFilter();C.type="bandpass",C.frequency.value=190+Math.random()*90,C.Q.value=14;const F=e.createGain();wr(F.gain,T,.9+Math.random()*.3,.001,.15),P.connect(C).connect(F).connect(m),P.start(T,Math.random()*2,.4),P.stop(T+.45)},x=(T=.9)=>{const P=e.currentTime,C=fo[M];u.frequency.setTargetAtTime(_/60,P,T*.4);const F=Math.max(_,4)/52;Fd.forEach((N,D)=>{l[D].frequency.setTargetAtTime(s*N*F,P,T)}),c.frequency.setTargetAtTime(420+F*260,P,T),g.gain.setTargetAtTime(E*C.wear,P,T),m.gain.setTargetAtTime(r*C.clank,P,T)},b=T=>{M=T;const P=fo[T];S=P.min+Math.random()*(P.max-P.min),x()};return x(.01),{output:o,get phase(){return M},get currentRpm(){return _},setRpm(T){p=T},setActive(T){v=T,T&&w.reset()},update(T){if(!v)return;if(S-=T,S<=0){const N=fo[M].next;b(N[Math.floor(Math.random()*N.length)])}const P=p*fo[M].speed,C=Math.min(T*.55,1);Math.abs(P-_)>.05&&(_+=(P-_)*C,x());const F=60/Math.max(_,3);w.pump(A,Vf(F,.06),"oneGap")},dispose(){for(const T of l)T.stop();u.stop(),y.stop(),o.disconnect()}}}function qf(i,t={}){const e=i.context,n=t.pitch??2400,s=t.interval??7,r=t.shySpeed??.72,o=e.createGain();o.gain.value=t.gain??.16;const a=e.createBiquadFilter();a.type="lowpass",a.frequency.value=t.tone??3200,a.Q.value=.5,a.connect(o);let c=!0,l=0;const h=(g,y,m,p)=>{const _=e.createOscillator();_.type="sine",_.frequency.setValueAtTime(y,g),_.frequency.exponentialRampToValueAtTime(m,g+p);const v=e.createOscillator();v.type="sine",v.frequency.setValueAtTime(y*2.02,g),v.frequency.exponentialRampToValueAtTime(m*2.02,g+p);const w=e.createGain();w.gain.value=.18;const M=e.createGain();M.gain.setValueAtTime(0,g),M.gain.linearRampToValueAtTime(1,g+p*.18),M.gain.setValueAtTime(1,g+p*.6),M.gain.linearRampToValueAtTime(0,g+p),_.connect(M),v.connect(w).connect(M),M.connect(a),_.start(g),v.start(g),_.stop(g+p+.02),v.stop(g+p+.02)},u=[{name:"rising",weight:.26},{name:"falling",weight:.2},{name:"trill",weight:.16},{name:"pair",weight:.22},{name:"single",weight:.1},{name:"chatter",weight:.06}],f=()=>{let g=Math.random();for(const y of u)if(g-=y.weight,g<=0)return y.name;return"pair"},d=g=>{const y=n*(.82+Math.random()*.36);let m=g;switch(f()){case"rising":{const p=2+Math.floor(Math.random()*3);for(let _=0;_<p;_++){const v=1+_*(.1+Math.random()*.09),w=.06+Math.random()*.07;h(m,y*v,y*v*1.22,w),m+=w+.03+Math.random()*.05}break}case"falling":{const p=2+Math.floor(Math.random()*2);for(let _=0;_<p;_++){const v=1-_*(.08+Math.random()*.07),w=.08+Math.random()*.1;h(m,y*v*1.18,y*v*.82,w),m+=w+.04+Math.random()*.06}break}case"trill":{const p=5+Math.floor(Math.random()*7),_=.028+Math.random()*.022;for(let v=0;v<p;v++){const w=v%2===0?1:1.09;h(m,y*w,y*w*1.05,_*.8),m+=_}break}case"pair":{const p=.07+Math.random()*.06;h(m,y,y*1.3,p),m+=p+.05+Math.random()*.04,h(m,y*1.28,y*1.05,p*1.2),m+=p*1.2;break}case"single":{const p=.22+Math.random()*.3;h(m,y*.95,y*1.12,p),m+=p;break}case"chatter":{const p=3+Math.floor(Math.random()*4);for(let _=0;_<p;_++){const v=.02+Math.random()*.02;h(m,y*.6,y*.5,v),m+=v+.02+Math.random()*.03}break}}return m};return{output:o,setActive(g){c=g,g&&(l=0)},update(g,y,m){if(!c)return;const p=e.currentTime;l<p&&(l=p+Math.random()*s),!(l>p+.2)&&(y.weather.strengthAt(m.x,m.z)<r?l=d(l)+(Math.random()<.34?.4+Math.random()*2.2:-Math.log(1-Math.random())*s):l=p+1.5)},dispose(){o.disconnect()}}}const hc=8e3,aM=12,cM=7,lM=[{hz:1500,q:6,weight:.34},{hz:2800,q:7,weight:.42},{hz:5200,q:8,weight:.24}],hM=.6,uM=.3,dM=.2,Od=new WeakMap;function fM(i){const t=Od.get(i);if(t)return t;const e=Math.floor(hc*aM),n=i.createBuffer(1,e,hc),s=n.getChannelData(0),r=Math.exp(-2*Math.PI*cM/hc);let o=0;for(let l=0;l<e;l++)o=r*o+(1-r)*(Math.random()*2-1),s[l]=o;const a=Math.min(1024,e/4|0);for(let l=0;l<a;l++){const h=l/a;s[l]=s[l]*h+s[e-a+l]*(1-h)}let c=0;for(let l=0;l<e;l++)c=Math.max(c,Math.abs(s[l]));if(c>0)for(let l=0;l<e;l++)s[l]/=c;return Od.set(i,n),n}function Yf(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("fire model built before the noise buffers were ready");const s=t.tone??1,r=t.crackle??1,o=t.draught??.35,a=e.createGain();a.gain.value=t.gain??.5;const c=e.createBiquadFilter();c.type="bandpass",c.frequency.value=110*s,c.Q.value=.9;const l=e.createGain();l.gain.value=0;const h=bn(e,n.brown,c);c.connect(l).connect(a);const u=e.createGain();u.gain.value=0;const f=bn(e,fM(e),u,.12);u.connect(l.gain);const d=e.createBiquadFilter();d.type="highpass",d.frequency.value=800*s,d.Q.value=.6;const g=e.createBiquadFilter();g.type="highshelf",g.frequency.value=4200,g.gain.value=-7;const y=e.createGain();y.gain.value=0;const m=bn(e,n.white,d);d.connect(g).connect(y).connect(a);const p=e.createGain();p.gain.value=dM*r,p.connect(a);const _=Sh(e,lM,p,s);let v=t.intensity??.7,w=!0;const M=Cn(e),S=E=>{const A=Math.random()<.09,x=A?.45+Math.random()*.5:.06+Math.random()*.26,b=A?.006+Math.random()*.014:.0015+Math.random()*.005;Rn(e,n.white,_.pick(),E,x,b),A&&ra(e,p,E,.16,95*s,42*s,.085,.004)};return{output:a,setIntensity(E){v=Math.min(1,Math.max(0,E))},setActive(E){w=E,E&&M.reset(),E||(l.gain.value=0,u.gain.value=0,y.gain.value=0)},update(E,A,x){if(!w)return;const b=e.currentTime,T=Math.min(1.35,v*(1+A.weather.strengthAt(x.x,x.z)*o)),P=hM*(.3+T*.7);l.gain.setTargetAtTime(P*.72,b,.4),u.gain.setTargetAtTime(P*.62,b,.4),c.frequency.setTargetAtTime((85+T*60)*s,b,.4),y.gain.setTargetAtTime(uM*(.15+T*.85),b,.3),d.frequency.setTargetAtTime((650+T*900)*s,b,.3),M.pump(S,ui(Math.max(.6,22*T*T)))},dispose(){h.stop(),m.stop(),f.stop(),u.disconnect(),_.dispose(),p.disconnect(),l.disconnect(),y.disconnect(),a.disconnect()}}}function $f(i){return 3.26/Math.max(i,5e-5)}const pM=20,mM=.28;function Bo(i,t,e,n){const s=$f(n.radius),r=n.cycles??pM,o=n.rise??mM,a=r/s,c=i.createOscillator();c.type="sine",c.frequency.setValueAtTime(s,e),c.frequency.linearRampToValueAtTime(s*(1+o),e+a);const l=i.createGain();return l.gain.setValueAtTime(n.level,e),l.gain.exponentialRampToValueAtTime(n.level*.001,e+a),c.connect(l).connect(t),c.start(e),c.stop(e+a+.01),a}function Ho(i,t){return i*Math.pow(t/i,Math.random())}const uc={canopy:{channels:[{hz:900,q:2.4,weight:.42},{hz:1900,q:2.8,weight:.4},{hz:3600,q:3.2,weight:.18}],contact:[.004,.012],drop:.16,bedHz:1600,bedQ:.7,density:420},stone:{channels:[{hz:2400,q:5,weight:.34},{hz:4200,q:6,weight:.42},{hz:6800,q:7,weight:.24}],contact:[.0012,.004],drop:.26,bedHz:3200,bedQ:.55,density:300},earth:{channels:[{hz:420,q:1.8,weight:.5},{hz:780,q:2,weight:.36},{hz:1500,q:2.4,weight:.14}],contact:[.01,.028],drop:.14,bedHz:800,bedQ:.6,density:260},water:{channels:[{hz:1400,q:3,weight:.5},{hz:2600,q:3.5,weight:.5}],contact:[.002,.006],drop:.07,bedHz:2e3,bedQ:.6,density:240,bubbles:[4e-4,.0016]}};function Zf(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("rain model built before the noise buffers were ready");const s=t.tone??1,r=t.eaves??0;let o=uc[t.surface??"canopy"];const a=o.bubbles,c=e.createGain();c.gain.value=t.gain??.5;const l=e.createGain();l.gain.value=0,l.connect(c);const h=Sh(e,o.channels,l,s),u=e.createBiquadFilter();u.type="bandpass",u.frequency.value=o.bedHz*s,u.Q.value=o.bedQ;const f=e.createGain();f.gain.value=0;const d=bn(e,n.pink,u);u.connect(f).connect(c);let g=t.intensity??.5;const y=t.articulation??.35;let m=!0;const p=Cn(e),_=Cn(e),v=M=>{if(a){Bo(e,l,M,{radius:Ho(a[0],a[1]),level:o.drop*(.4+Math.random()*.6),cycles:13});return}const[S,E]=o.contact;Rn(e,n.white,h.pick(),M,o.drop*(.35+Math.random()*.65),S+Math.random()*(E-S))},w=M=>{Bo(e,l,M,{radius:Ho(.0022,.0065),level:.5+Math.random()*.5,cycles:22})};return{output:c,setIntensity(M){g=Math.min(1,Math.max(0,M))},setSurface(M){if(a)return;o=uc[M];const S=e.currentTime;u.frequency.setTargetAtTime(o.bedHz*s,S,.25),u.Q.setTargetAtTime(o.bedQ,S,.25),h.setTone(o.bedHz/uc.canopy.bedHz*s,S)},setActive(M){m=M,M?(p.reset(),_.reset()):(f.gain.value=0,l.gain.value=0)},update(M,S,E){if(!m)return;const A=e.currentTime,x=Math.min(1,g*(1+S.weather.strengthAt(E.x,E.z)*.22));if(x<.02){f.gain.setTargetAtTime(0,A,.6),l.gain.setTargetAtTime(0,A,.6),p.reset(),_.reset();return}f.gain.setTargetAtTime(x*.55,A,.6),u.frequency.setTargetAtTime(o.bedHz*s*(.7+x*.55),A,.6),l.gain.setTargetAtTime(y*(.2+x*.8),A,.6),p.pump(v,ui(Math.max(8,o.density*x*x))),r>0&&_.pump(w,ui(r*(.35+x*.65)),"oneGap")},dispose(){d.stop(),h.dispose(),l.disconnect(),f.disconnect(),c.disconnect()}}}const gM={brook:{rate:95,radius:[4e-4,.0026],cycles:15,bedHz:1500,bedQ:.75,bedLevel:.28,voice:.1},stream:{rate:62,radius:[9e-4,.005],cycles:18,bedHz:900,bedQ:.7,bedLevel:.36,voice:.13},fountain:{rate:150,radius:[5e-4,.0035],cycles:14,bedHz:2100,bedQ:.6,bedLevel:.34,voice:.09},cistern:{rate:.45,radius:[.003,.009],cycles:30,bedHz:260,bedQ:1.3,bedLevel:.02,voice:.62}};function Kf(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("water model built before the noise buffers were ready");const s=gM[t.flow??"brook"],r=t.tone??1,o=s.radius[0]/r,a=s.radius[1]/r,c=e.createGain();c.gain.value=t.gain??.5;const l=e.createGain();l.gain.value=1;const h=e.createBiquadFilter();h.type="highshelf",h.frequency.value=3e3,h.gain.value=-3,l.connect(h).connect(c);const u=e.createBiquadFilter();u.type="bandpass",u.frequency.value=s.bedHz*r,u.Q.value=s.bedQ;const f=e.createGain();f.gain.value=0;const d=bn(e,n.pink,u);u.connect(f).connect(c);let g=t.rate??1,y=!0;const m=Cn(e),p=_=>{Bo(e,l,_,{radius:Ho(o,a),level:s.voice*(.3+Math.random()*.7),cycles:s.cycles*(.75+Math.random()*.5)})};return{output:c,get voiceHz(){return $f(Math.sqrt(o*a))},setRate(_){g=Math.min(1,Math.max(0,_))},setActive(_){y=_,_?m.reset():f.gain.value=0},update(_){if(!y)return;const v=e.currentTime;if(f.gain.setTargetAtTime(s.bedLevel*g,v,.5),u.frequency.setTargetAtTime(s.bedHz*r*(.75+g*.4),v,.5),g<.02){m.reset();return}m.pump(p,ui(s.rate*g))},dispose(){d.stop(),h.disconnect(),l.disconnect(),f.disconnect(),c.disconnect()}}}function jf(i,t,e){const n=i.createGain(),s=t.map(o=>{const a=i.createBiquadFilter();a.type="bandpass",a.frequency.value=o.hz,a.Q.value=o.q;const c=i.createGain();return c.gain.value=o.level,n.connect(a).connect(c).connect(e),{filter:a,level:c}}),r=t.map(o=>({...o}));return{input:n,shape(o,a,c=0){for(let l=0;l<s.length;l++){const h=o[l];if(!h)continue;const{filter:u,level:f}=s[l];c<=0?(u.frequency.setValueAtTime(h.hz,a),f.gain.setValueAtTime(h.level,a)):(u.frequency.setValueAtTime(r[l].hz,a),u.frequency.exponentialRampToValueAtTime(Math.max(h.hz,20),a+c),f.gain.setValueAtTime(r[l].level,a),f.gain.linearRampToValueAtTime(h.level,a+c)),u.Q.setValueAtTime(h.q,a),r[l]={...h}}},dispose(){n.disconnect();for(const{filter:o,level:a}of s)o.disconnect(),a.disconnect()}}}const Xs={a:[{hz:730,q:8,level:1},{hz:1090,q:10,level:.5},{hz:2440,q:14,level:.25}],e:[{hz:530,q:7,level:1},{hz:1840,q:12,level:.45},{hz:2480,q:15,level:.22}],i:[{hz:270,q:5,level:1},{hz:2290,q:14,level:.4},{hz:3010,q:17,level:.2}],o:[{hz:570,q:7,level:1},{hz:840,q:8,level:.55},{hz:2410,q:15,level:.16}],u:[{hz:300,q:5,level:1},{hz:870,q:8,level:.4},{hz:2240,q:14,level:.12}]},dc=[Xs.a,Xs.e,Xs.i,Xs.o,Xs.u];function Jf(i,t={}){const e=i.context,n=Math.max(1,Math.min(10,t.voices??6)),s=Math.min(.95,Math.max(.05,t.density??.45)),r=t.pitch??135,o=t.variety??.5,a=e.createGain();a.gain.value=t.gain??.5;const c=e.createBiquadFilter();c.type="lowpass",c.frequency.value=t.distance??1700,c.Q.value=.6,c.connect(a);const l=[];for(let d=0;d<n;d++){const g=n===1?0:d/(n-1)*2-1,y=1+g*o*.35+(Math.random()*2-1)*.05,m=r*(1-g*o*.4)*(.95+Math.random()*.1),p=e.createGain();p.gain.value=.85/Math.sqrt(n),p.connect(c);const _=jf(e,dc[0].map(M=>({...M,hz:M.hz*y})),p),v=e.createGain();v.gain.value=0,v.connect(_.input);const w=e.createOscillator();w.type="sawtooth",w.frequency.value=m,w.connect(v),w.start(),l.push({osc:w,envelope:v,bank:_,clock:Cn(e),length:.2,left:0,pitch:m,tract:y})}let h=!0;const u=(d,g)=>d.map(y=>({...y,hz:y.hz*g})),f=(d,g)=>{const y=.12+Math.random()*.14;d.length=y,d.left--;const m=d.left>=4,p=d.pitch*(m?1.1:.9+Math.random()*.2);d.osc.frequency.setTargetAtTime(p,g,y*.6);const _=.55+Math.random()*.45,v=y*.22;d.envelope.gain.setValueAtTime(0,g),d.envelope.gain.linearRampToValueAtTime(_,g+v),d.envelope.gain.linearRampToValueAtTime(_*.75,g+y*.75),d.envelope.gain.setTargetAtTime(0,g+y*.75,y*.12);const w=dc[Math.random()*dc.length|0];d.bank.shape(u(w,d.tract),g,y*.8)};return{output:a,setActive(d){if(h=d,d)for(const g of l)g.clock.reset();else for(const g of l)g.envelope.gain.value=0},update(){if(h)for(const d of l)d.clock.pump(g=>f(d,g),()=>{if(d.left>0)return d.length+.015+Math.random()*.06;d.left=3+Math.floor(Math.random()*6);const g=(1-s)*5.5;return d.length+.35+Math.random()*(.6+g)},"immediate")},dispose(){for(const d of l){try{d.osc.stop()}catch{}d.osc.disconnect(),d.envelope.disconnect(),d.bank.dispose()}l.length=0,c.disconnect(),a.disconnect()}}}const yM="modulepreload",vM=function(i,t){return new URL(i,t).href},zd={},Go=function(t,e,n){let s=Promise.resolve();if(e&&e.length>0){const o=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),c=a?.nonce||a?.getAttribute("nonce");s=Promise.allSettled(e.map(l=>{if(l=vM(l,n),l in zd)return;zd[l]=!0;const h=l.endsWith(".css"),u=h?'[rel="stylesheet"]':"";if(!!n)for(let g=o.length-1;g>=0;g--){const y=o[g];if(y.href===l&&(!h||y.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${l}"]${u}`))return;const d=document.createElement("link");if(d.rel=h?"stylesheet":yM,h||(d.as="script"),d.crossOrigin="",d.href=l,c&&d.setAttribute("nonce",c),document.head.appendChild(d),h)return new Promise((g,y)=>{d.addEventListener("load",g),d.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${l}`)))})}))}function r(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return s.then(o=>{for(const a of o||[])a.status==="rejected"&&r(a.reason);return t().catch(r)})};async function _M(i){try{const[{createFaustNode:t},{frictionMeta:e,frictionUrl:n}]=await Promise.all([Go(()=>Promise.resolve().then(()=>kf),void 0,import.meta.url),Go(()=>import("./friction-COj10vMJ.js"),[],import.meta.url)]);return await t(i,n,e)}catch(t){return console.warn("friction: faust tier unavailable — using the event fallback",t),null}}const kd=.42,wM=.08,Bd=.4;function Qf(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("friction model built before the noise buffers were ready");const s=t.force??.55,r=t.pitch??180,o=t.decay??.5,a=t.bright??.5,c=t.roughness??.4,l=t.motion??"cycle",h=t.speed??.3,u=e.createGain();u.gain.value=t.gain??.5;const f=e.createGain();f.gain.value=1,f.connect(u);const d=e.createGain();d.gain.value=0,d.connect(u);const g=e.createGain();g.connect(f);const y=22+a*22,m=Ss(e,[{hz:r,decay:o,level:1,q:y},{hz:r*2.41,decay:o*.7,level:.12+.55*a,q:y*.8},{hz:r*4.17,decay:o*.45,level:.06+.32*a,q:y*.6},{hz:r*6.83,decay:o*.3,level:.03+.18*a,q:y*.5}],g,{ring:"excitation"}),p=e.createBufferSource();p.buffer=n.pink,p.loop=!0;const _=e.createBiquadFilter();_.type="bandpass",_.frequency.value=r*1.6,_.Q.value=3.5;const v=e.createGain();v.gain.value=0,p.connect(_).connect(v).connect(f),p.start();const w=Cn(e);let M=0,S=l==="steady"?h:0,E=s,A=null,x=!0,b=1+Math.random()*4,T=!1,P=h,C=.8,F=Math.random(),N=null,D=!1;const B=_M(e).then(V=>{if(!V)return;if(D){V.dispose();return}N=V,V.node.connect(d),V.set("force",s),V.set("pitch",r),V.set("decay",o),V.set("bright",a),V.set("roughness",c),V.set("gain",.7),V.set("speed",M);const et=e.currentTime;d.gain.setTargetAtTime(1,et,Bd/3),f.gain.setTargetAtTime(0,et,Bd/3)});function H(V){if(b-=V,b<=0&&(T=!T,b=T?2+Math.random()*5:5+Math.random()*14,P=h*(.6+Math.random()*.7),C=.55+Math.random()*.65,F=0),!T){S=0;return}F+=V*C,S=P*Math.max(0,Math.sin(F*Math.PI*2))**.55}return{output:u,ready:B,setSpeed(V){A=Math.max(0,Math.min(1,V))},setForce(V){E=Math.max(0,Math.min(1,V)),N?.set("force",E)},get usingFaust(){return N!==null},get loop(){return N},get currentSpeed(){return M},update(V,et,lt){if(!x)return;if(A!==null)S=A,A=null;else if(l==="cycle")H(V);else if(l==="weather"){const ot=Math.max(0,et.weather.strengthAt(lt.x,lt.z)-kd);S=Math.min(1,(ot/(1-kd))**1.6)*h}if(M+=(S-M)*Math.min(1,V/wM),N?.set("speed",M),N)return;const Mt=e.currentTime;if(M<.01){v.gain.setTargetAtTime(0,Mt,.2),w.reset();return}v.gain.setTargetAtTime(.022*E*M**.7,Mt,.12);const Lt=2+M*26,J=E*.5*(.3+.7/(1+M*6));w.pump(ot=>{const K=.7+Math.random()*.6;for(const Y of m.inputs)Rn(e,n.white,Y,ot,J*K,.003)},ui(Lt),"immediate")},setActive(V){x=V,V||(v.gain.setTargetAtTime(0,e.currentTime,.1),w.reset(),N?.set("speed",0),M=0)},dispose(){D=!0,p.stop(),p.disconnect(),_.disconnect(),v.disconnect(),m.dispose(),g.disconnect(),N?.dispose(),d.disconnect(),f.disconnect(),u.disconnect()}}}const xM=7,Hd=.3,Gd=.4;async function MM(i){try{const[{createFaustNode:t},{waveguideMeta:e,waveguideUrl:n}]=await Promise.all([Go(()=>Promise.resolve().then(()=>kf),void 0,import.meta.url),Go(()=>import("./waveguide-DEcBmVT0.js"),[],import.meta.url)]);return await t(i,n,e)}catch(t){return console.warn("waveguide: faust tier unavailable — using the modal fallback",t),null}}function tp(i,t={}){const e=i.context,n=i.noise;if(n===null)throw new Error("waveguide built before the noise buffers were ready");const s=n.white,r=t.pitch??440,o=t.decay??2,a=t.bright??.5,c=t.closed??!1,l=t.place??.22,h=t.excite??"chime",u=t.drive??.5,f=t.weather??!1,d=e.createGain();d.gain.value=(t.gain??.5)*3.2;const g=e.createGain();g.gain.value=0,g.connect(d);const y=e.createGain();y.gain.value=1,y.connect(d);const m=e.createGain();m.gain.value=1;const p=e.createBufferSource();p.buffer=s,p.loop=!0;const _=e.createBiquadFilter();_.type="bandpass",_.frequency.value=r*(c?.5:1),_.Q.value=.9;const v=e.createGain();v.gain.value=0,p.connect(_).connect(v).connect(m),p.start();const w=c?r*.5:r,S=Ss(e,(c?[1,3,5,7]:[1,2,3,4]).map((C,F)=>({hz:w*C,decay:o/(1+F*.6),level:(.2+a*.8)**F,q:60+a*60})),y,{ring:"filter",maxQ:200});for(const C of S.inputs)m.connect(C);const E=Cn(e);let A=null,x=!1,b=!0;const T=MM(e).then(C=>{if(!C)return;if(x){C.dispose();return}A=C,m.connect(C.node),C.node.connect(g),C.set("pitch",r),C.set("decay",o),C.set("bright",a),C.set("closed",c?1:0),C.set("place",l),C.set("gain",.7);const F=e.currentTime;g.gain.setTargetAtTime(1,F,Gd/3),y.gain.setTargetAtTime(0,F,Gd/3)});function P(C,F){Rn(e,s,m,C,F*.5,.0016)}return{output:d,ready:T,get loop(){return A},get usingFaust(){return A!==null},strike(C=1){P(e.currentTime+.02,C)},update(C,F,N){if(!b)return;const D=Math.max(0,F.weather.strengthAt(N.x,N.z)-Hd)/(1-Hd),B=f?u*D**2:u,H=e.currentTime;if(h==="breath"){v.gain.setTargetAtTime(B*.09,H,.25);return}if(v.gain.setTargetAtTime(0,H,.25),B<.02){E.reset();return}E.pump(V=>P(V,.35+Math.random()*.65),ui(xM*B),"oneGap")},setActive(C){b=C,C||(v.gain.setTargetAtTime(0,e.currentTime,.1),E.reset())},dispose(){x=!0,p.stop(),p.disconnect(),_.disconnect(),v.disconnect(),S.dispose(),m.disconnect(),A?.dispose(),g.disconnect(),y.disconnect(),d.disconnect()}}}function bM(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("drip built before the noise buffers were ready");const s=t.radius??[.0018,.0032],r=t.cycles??30,o=t.tick??.35,a=e.createGain();a.gain.value=t.gain??.5;const c=e.createBiquadFilter();return c.type="bandpass",c.frequency.value=3800,c.Q.value=3,c.connect(a),{output:a,fire(l,h){return Rn(e,n.white,c,l,h*o,.0016),Bo(e,a,l+.0015,{radius:Ho(s[0],s[1]),level:h*.55,cycles:r*(.85+Math.random()*.3),rise:.34})+.02},dispose(){c.disconnect(),a.disconnect()}}}const SM=[{ratio:.5,decay:1,level:.5},{ratio:1,decay:.72,level:.85},{ratio:1.2,decay:.55,level:.7},{ratio:1.5,decay:.42,level:.45},{ratio:2,decay:.35,level:1},{ratio:2.5,decay:.2,level:.3},{ratio:2.67,decay:.17,level:.26},{ratio:3,decay:.13,level:.22},{ratio:4,decay:.09,level:.16},{ratio:5.33,decay:.06,level:.1},{ratio:6.4,decay:.04,level:.07}];function EM(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("bell built before the noise buffers were ready");const s=t.hz??168,r=t.decay??14,o=t.strike??.4,a=t.warble??1,c=Math.max(1,t.strokes??1),l=t.interval??2.4,h=e.createGain();h.gain.value=t.gain??.5;const u=e.createBiquadFilter();u.type="bandpass",u.frequency.value=s*9,u.Q.value=1.6,u.connect(h);const f=(g,y,m,p,_)=>{const v=e.createOscillator();v.type="sine",v.frequency.value=s*y,v.detune.value=_;const w=e.createGain();w.gain.setValueAtTime(p,g),w.gain.exponentialRampToValueAtTime(p*5e-4,g+m),v.connect(w).connect(h),v.start(g),v.stop(g+m+.02)},d=(g,y)=>{Rn(e,n.white,u,g,y*o,.004);let m=0;for(const p of SM){const _=y*p.level*.14*(.85+Math.random()*.3),v=r*p.decay*(.9+Math.random()*.2),w=a*p.ratio*1.6;f(g,p.ratio,v,_,-w),f(g,p.ratio,v,_,w),m=Math.max(m,v)}return m};return{output:h,fire(g,y){let m=0;for(let p=0;p<c;p++){const _=g+p*l*(1+(Math.random()*2-1)*.02);m=_-g+d(_,y*(p===0?1:.9))}return m},dispose(){u.disconnect(),h.disconnect()}}}const Vd=[{hz:512,decay:.3,level:.4},{hz:1183,decay:.85,level:.72},{hz:1794,decay:1.15,level:1},{hz:2741,decay:.7,level:.5},{hz:4310,decay:.4,level:.28}];function AM(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("hammer built before the noise buffers were ready");const s=t.tone??1,r=Math.min(.9,Math.max(0,t.damping??.3)),o=t.bounces??2,a=e.createGain();a.gain.value=t.gain??.7;const c=Ss(e,Vd.map(h=>({hz:h.hz*s,decay:h.decay*(1-r),level:h.level})),a),l=(h,u,f)=>{const d=f?.0022:.0035;c.inputs.forEach((g,y)=>{Rn(e,n.white,g,h,u*Vd[y].level,d)}),ra(e,a,h,u*(f?.5:.16),165*s,62*s,.075,.003)};return{output:a,fire(h,u){l(h,u,!0);let f=.13+Math.random()*.05,d=u*.3;for(let g=0;g<o;g++)l(h+f,d*(.7+Math.random()*.5),!1),f+=(.13+Math.random()*.05)*Math.pow(.66,g+1),d*=.5;return f+1.3*(1-r)+.2},dispose(){c.dispose(),a.disconnect()}}}const TM={wood:{count:9,over:.34,energyDecay:.13,hz:380,q:2.1,level:.5,thumpHz:120},pot:{count:7,over:.28,energyDecay:.1,hz:950,q:4.2,level:.42,thumpHz:175},metal:{count:11,over:.42,energyDecay:.16,hz:1750,q:5.5,level:.4,thumpHz:210},stone:{count:6,over:.22,energyDecay:.07,hz:640,q:1.6,level:.55,thumpHz:95}};function RM(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("clatter built before the noise buffers were ready");const s=TM[t.material??"wood"],r=t.tone??1,o=t.heft??.5,a=e.createGain();a.gain.value=t.gain??.6;const c={...s,hz:s.hz*r,count:t.pieces??s.count},l=Nf(e,c,a);return{output:a,fire(h,u){return Rn(e,n.white,l.input,h,u*1.4,.012+Math.random()*.01),ra(e,a,h,u*o*.55,s.thumpHz*r,s.thumpHz*r*.45,.08,.004),Uf(e,n.white,l.input,c,h+.02,u),c.over*1.4+.15},dispose(){l.dispose(),a.disconnect()}}}const CM={dog:{f0:[440,235],onset:.62,syllables:[2,4],length:[.085,.135],gap:[.2,.34],attack:.06,rasp:.34,open:[{hz:880,q:6,level:1},{hz:1620,q:9,level:.55},{hz:3100,q:12,level:.3}],close:[{hz:520,q:7,level:.7},{hz:1180,q:8,level:.3},{hz:2600,q:12,level:.12}],variance:.14},sheep:{f0:[355,300],onset:.82,syllables:[1,2],length:[.55,1.05],gap:[.35,.6],attack:.14,rasp:.22,open:[{hz:620,q:7,level:1},{hz:1720,q:11,level:.42},{hz:2650,q:14,level:.18}],close:[{hz:700,q:7,level:.9},{hz:1500,q:10,level:.3},{hz:2600,q:14,level:.12}],vibrato:{hz:13,cents:105},variance:.1},cow:{f0:[168,108],onset:.72,syllables:[1,1],length:[1.1,1.8],gap:[.5,.8],attack:.22,rasp:.16,open:[{hz:390,q:6,level:1},{hz:800,q:8,level:.5},{hz:1900,q:12,level:.14}],close:[{hz:330,q:6,level:.85},{hz:720,q:8,level:.3},{hz:1750,q:12,level:.08}],vibrato:{hz:5.5,cents:35},variance:.08},fowl:{f0:[880,620],onset:.7,syllables:[3,6],length:[.045,.085],gap:[.09,.21],attack:.12,rasp:.55,open:[{hz:1450,q:8,level:1},{hz:2700,q:11,level:.5},{hz:4200,q:14,level:.22}],close:[{hz:1150,q:8,level:.6},{hz:2400,q:11,level:.25},{hz:3900,q:14,level:.1}],variance:.16}};function fc(i){return i[0]+Math.random()*(i[1]-i[0])}function Wd(i,t){return i.map(e=>({...e,hz:e.hz*t}))}function PM(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("animal built before the noise buffers were ready");const s=CM[t.kind??"dog"],r=t.tone??1,o=Math.min(1,(t.rasp??0)+s.rasp),a=e.createGain();a.gain.value=t.gain??.6;const c=Wd(s.open,r),l=Wd(s.close,r),h=jf(e,c,a),u=[];let f=0;const d=(y,m,p,_)=>{const v=e.createGain();v.connect(h.input);const w=e.createOscillator();w.type="sawtooth";const M=_,S=M*s.onset,E=m*s.attack;w.frequency.setValueAtTime(S,y),w.frequency.exponentialRampToValueAtTime(M,y+E),w.frequency.exponentialRampToValueAtTime(Math.max(M*(s.f0[1]/s.f0[0]),20),y+m),w.connect(v),w.start(y);let A=null;if(s.vibrato){A=e.createOscillator(),A.frequency.value=s.vibrato.hz*(.85+Math.random()*.3);const P=e.createGain();P.gain.value=s.vibrato.cents,A.connect(P).connect(w.detune),A.start(y),u.push(P)}let x=null;if(o>.01){x=e.createBufferSource(),x.buffer=n.white,x.playbackRate.value=.8+Math.random()*.5;const P=e.createGain();P.gain.value=o*.55,x.connect(P).connect(v),x.start(y,Math.random()*Math.max(n.white.duration-2,0)),u.push(P)}const b=Math.max(.02,m*.28);v.gain.setValueAtTime(0,y),v.gain.linearRampToValueAtTime(p,y+E),v.gain.linearRampToValueAtTime(p*.62,y+m-b),v.gain.setTargetAtTime(0,y+m-b,b/3);const T=y+m+b*3;w.stop(T),A?.stop(T),x?.stop(T),u.push(v),f=Math.max(f,T),h.shape(c,y,E),h.shape(l,y+m*.55,m*.45)};let g=0;return{output:a,fire(y,m){f=y;const p=Math.round(fc(s.syllables)),_=s.f0[0]*r*(1+(Math.random()*2-1)*s.variance);let v=y;for(let M=0;M<p;M++){const S=fc(s.length);d(v,S,m*Math.pow(.86,M)*(.85+Math.random()*.3),_),v+=S+fc(s.gap)}const w=f-y;return window.clearTimeout(g),g=window.setTimeout(()=>{for(const M of u)M.disconnect();u.length=0},(w+.4)*1e3),w},dispose(){window.clearTimeout(g);for(const y of u)y.disconnect();u.length=0,h.dispose(),a.disconnect()}}}function ep(i,t){switch(t.sound){case"hammer":return AM(i,t.options);case"clatter":return RM(i,t.options);case"animal":return PM(i,t.options);case"drip":return bM(i,t.options);case"bell":return EM(i,t.options)}}const IM=[5,.4,5];class LM{context;voices=[];clock;centre=new R;spread=new R;force;gap;active=!0;constructor(t,e){this.context=t.context,this.centre.set(...e.at),this.spread.set(...e.spread??IM),this.force=e.force??[.55,1];const n=Math.max(e.every,.05);this.gap=e.rhythm==="periodic"?Vf(n,.09):ui(1/n),this.clock=Cn(t.context);const s=Math.max(1,e.voices??2);for(let r=0;r<s;r++){const o=ep(t,e);this.voices.push({shot:o,busyUntil:0,emitter:new Hf(t,o,{position:this.centre,refDistance:e.refDistance,maxDistance:e.maxDistance,rolloff:e.rolloff,reverb:e.reverb,importance:e.importance,ignoreAbsorption:e.ignoreAbsorption,ignoreOcclusion:e.ignoreOcclusion,invertDistance:e.invertDistance})})}}setActive(t){if(t!==this.active){this.active=t,t&&this.clock.reset();for(const e of this.voices)e.emitter.enabled=t}}update(t,e,n){for(const s of this.voices)s.emitter.update(t,e,n);if(this.active){if(this.voices.every(s=>s.emitter.isVirtual)){this.clock.reset();return}this.clock.pump(s=>this.fire(s),this.gap,"oneGap")}}fire(t){const e=this.voices.find(o=>o.busyUntil<=t);if(!e||e.emitter.isVirtual)return;Xd.set(this.centre.x+(Math.random()*2-1)*this.spread.x,this.centre.y+(Math.random()*2-1)*this.spread.y,this.centre.z+(Math.random()*2-1)*this.spread.z),e.emitter.moveTo(Xd);const[n,s]=this.force,r=e.shot.fire(t,n+Math.random()*(s-n));e.busyUntil=t+r}trigger(){this.fire(this.context.currentTime+.02)}get shots(){return this.voices.map(t=>t.shot)}get voiceCount(){return this.voices.length}dispose(){for(const t of this.voices)t.emitter.dispose();this.voices.length=0}}const Xd=new R,np={};function qd(i,t){switch(t.model){case"wind":return Gf(i,t.options);case"foliage":return Wf(i,t.options);case"machine":return Xf(i,t.options);case"bird":return qf(i,t.options);case"fire":return Yf(i,t.options);case"rain":return Zf(i,t.options);case"water":return Kf(i,t.options);case"crowd":return Jf(i,t.options);case"friction":return Qf(i,t.options);case"waveguide":return tp(i,t.options)}}class DM{engine;emitters=[];models=new Map;emitterById=new Map;fields=new Map;beds=[];bedBus=null;scatter=[];active=!0;constructor(t,e){this.engine=t;const n=e.bed?Array.isArray(e.bed)?e.bed:[e.bed]:[];if(n.length>0){const s=t.context.createGain();s.connect(t.dry),this.bedBus=s;for(const r of n){const o=qd(t,r),a=t.context.createGain();a.gain.value=r.gain??1,o.output.connect(a).connect(s),this.beds.push(o),r.id&&this.models.set(r.id,o)}}for(const s of e.emitters??[]){const r=qd(t,s);s.id&&this.models.set(s.id,r);const o=new Hf(t,r,{position:new R(...s.at),refDistance:s.refDistance,maxDistance:s.maxDistance,rolloff:s.rolloff,reverb:s.reverb,importance:s.importance,ignoreAbsorption:s.ignoreAbsorption,ignoreOcclusion:s.ignoreOcclusion,invertDistance:s.invertDistance});this.emitters.push(o),s.id&&this.emitterById.set(s.id,o)}for(const s of e.scatter??[]){const r=new LM(t,s);this.scatter.push(r),s.id&&this.fields.set(s.id,r)}}setActive(t){if(t!==this.active){this.active=t;for(const e of this.emitters)e.enabled=t;for(const e of this.scatter)e.setActive(t);this.bedBus?.gain.setTargetAtTime(t?1:0,this.engine.context.currentTime,.15)}}setBedLevel(t,e=.35){!this.bedBus||!this.active||this.bedBus.gain.setTargetAtTime(t,this.engine.context.currentTime,e)}update(t,e,n){if(this.active){for(const s of this.beds)s.update?.(t,this.engine,this.engine.listenerPosition);for(const s of this.emitters)s.update(t,e,n);for(const s of this.scatter)s.update(t,e,n)}}find(t){return this.models.get(t)??null}findField(t){return this.fields.get(t)??null}setSolo(t){if(this.active){for(const[e,n]of this.emitterById)n.enabled=t===null||e===t;for(const[e,n]of this.fields)n.setActive(t===null||e===t)}}get emitterCount(){return this.emitters.length+this.scatter.reduce((t,e)=>t+e.voiceCount,0)}get occludedCount(){return this.emitters.filter(t=>t.isOccluded).length}dispose(){for(const t of this.emitters)t.dispose();this.emitters.length=0,this.emitterById.clear();for(const t of this.scatter)t.dispose();this.scatter.length=0,this.fields.clear();for(const t of this.beds)t.dispose();this.beds.length=0,this.bedBus?.disconnect(),this.models.clear()}}const oa={sky:!0,fogColor:"#bcd4e6",fogNear:25,fogFar:140,sunIntensity:2.2,sunColor:16773848,fillIntensity:1.15,fillColor:14735040,ambientIntensity:1.8,ambientSky:10339560,ambientGround:9076584,room:"open",surface:"earth",footstepReverb:.7,soundscape:{bed:{model:"wind",id:"wind",options:{gain:.17,tone:3400}}}},Yd={sky:!1,fogColor:"#0d0f12",fogNear:6,fogFar:34,sunIntensity:1.1,sunColor:16770748,fillIntensity:.75,fillColor:9412792,ambientIntensity:2.1,ambientSky:9078390,ambientGround:4867130,room:"cell",surface:"wood",footstepReverb:.5,soundscape:np},NM=.12;class UM{definition;group=null;constructor(t){this.definition=t}get id(){return this.definition.id}get name(){return this.definition.name}get environment(){return this.definition.environment}get spawn(){return this.definition.spawn}get floor(){return this.definition.floor??-20}settle(t){const e=this.definition.groundAt;if(!e)return t;const n=t.position.clone();return n.y=e(n.x,n.z)+NM,{position:n,yaw:t.yaw}}root(){return this.group===null&&(this.group=this.definition.build(),this.group.name=`zone:${this.definition.id}`,this.group.updateWorldMatrix(!0,!0)),this.group}get isBuilt(){return this.group!==null}dispose(){this.group!==null&&(this.group.traverse(t=>{(t instanceof ee||t instanceof fh)&&t.geometry.dispose()}),this.group.clear(),this.group=null)}}const FM=1.15;function OM(i,t=new R){return t.set(Math.sin(i),0,Math.cos(i))}function zM(i){if(i.arrival)return{position:i.arrival.position.clone(),yaw:i.arrival.yaw};const t=OM(i.yaw);return{position:i.position.clone().addScaledVector(t,FM),yaw:i.yaw+Math.PI}}class kM{byZone=new Map;byDoor=new Map;add(t,e){this.addSide(t.id,t.a,t.b,e),this.addSide(t.id,t.b,t.a,e)}addSide(t,e,n,s){const r={portal:t,end:e,target:n,arrival:zM(n),door:null,title:"Door",label:e.label??s(n.zone)},o=this.byZone.get(e.zone);o?o.push(r):this.byZone.set(e.zone,[r])}in(t){return this.byZone.get(t)??[]}bind(t,e,n){t.door=e,t.title=n,e.userData.portal=t,this.byDoor.set(e,t)}sideOf(t){let e=t;for(;e;){const n=this.byDoor.get(e);if(n)return n;e=e.parent}return null}all(){return[...this.byZone.values()].flat()}}const BM=3.2,HM=.15;function GM(i,t){return i.userData.label=t,i}function VM(i){for(let t=i;t;t=t.parent){const e=t.userData.label;if(typeof e=="string")return e}return null}class WM{reach=BM;raycaster=new ix;targets=[];constructor(){this.raycaster.far=this.reach}setTargets(t){this.targets=t}get targetCount(){return this.targets.length}probe(t,e){if(this.targets.length===0)return null;t.updateWorldMatrix(!0,!1),pc.setFromMatrixPosition(t.matrixWorld),mc.set(0,0,-1).applyQuaternion(t.getWorldQuaternion(XM)),this.raycaster.far=this.reach,this.raycaster.set(pc,mc);const n=this.raycaster.intersectObjects(this.targets,!0);if(n.length===0)return null;const s=n[0],r=e.raycast(pc,mc);return r!==null&&r<s.distance-HM?null:{object:s.object,distance:s.distance}}}const pc=new R,mc=new R,XM=new $n,qM={timber:{leaf:I.TIMBER,ledge:I.TIMBER_DARK,iron:I.IRON,frame:I.STONE_DARK},iron:{leaf:I.IRON,ledge:I.STONE_DARK,iron:I.RUST,frame:I.STONE},plank:{leaf:I.TIMBER_PALE,ledge:I.TIMBER,iron:I.RUST,frame:I.TIMBER_DARK}},YM=["timber","iron","plank"],$M={timber:"Wooden Door",iron:"Iron Door",plank:"Plank Door"};function ZM(i){return $M[i]}function $d(i){return i.userData.door}function ip(i={}){const{seed:t=1,scale:e=1}=i,n=xt(t),s=[],r=i.material??n.pick(YM),o=qM[r],a=n.range(.94,1.16),c=n.range(2,2.28),l=n.range(.07,.1),h=n.range(.13,.18),u=l*2.4;for(const x of[-1,1]){const b=new G(h,c+h,u);b.translate(x*(a+h)/2,(c+h)/2,-u*.18),s.push({geometry:b,color:o.frame,sway:0})}const f=new G(a+h*2.6,h,u*1.1);if(f.translate(0,c+h/2,-u*.18),s.push({geometry:f,color:o.frame,sway:0}),n.chance(.55)){const x=new G(a+h*2.2,.06,u*1.5);x.translate(0,.03,-u*.1),s.push({geometry:x,color:o.frame,sway:0})}const d=new G(a,c,.02);d.translate(0,c/2,-l*.5),s.push({geometry:d,color:1316378,sway:0});const g=n.int(4,6),y=a/g;for(let x=0;x<g;x++){const b=l*n.range(.88,1),T=new G(y*.94,c*n.range(.985,1),b);T.translate(-a/2+y*(x+.5),c/2,b/2),s.push({geometry:T,color:o.leaf,sway:0})}const m=n.chance(.4)?[c*.16,c*.52,c*.87]:[c*.18,c*.82],p=l*.42;for(const x of m){const b=new G(a*.96,n.range(.1,.15),p);b.translate(0,x,l+p/2),s.push({geometry:b,color:o.ledge,sway:0})}const _=n.chance(.5)?-1:1,v=p*.5;for(const x of[m[0],m[m.length-1]]){const b=a*n.range(.45,.7),T=new G(b,.055,v);T.translate(_*(a/2-b/2),x,l+p+v/2),s.push({geometry:T,color:o.iron,sway:0});const P=new G(.07,.09,v*2.2);P.translate(_*(a/2+.02),x,l+v),s.push({geometry:P,color:o.iron,sway:0})}const w=-_*a*n.range(.3,.36),M=c*n.range(.44,.5);if(n.chance(.5)){const x=new $(.062,.062,.02,8);x.rotateX(Math.PI/2),x.translate(w,M,l+.01),s.push({geometry:x,color:o.iron,sway:0});const b=new $(.022,.026,.05,6);b.rotateX(Math.PI/2),b.translate(w,M,l+.043),s.push({geometry:b,color:o.iron,sway:0});const T=new te(.052,0);T.scale(1,1,.78),T.translate(w,M,l+.095),s.push({geometry:T,color:o.iron,sway:0})}else{const x=new G(.045,.2,.045);x.translate(w,M,l+.055),s.push({geometry:x,color:o.iron,sway:0});for(const b of[-.09,.09]){const T=new G(.05,.05,.05);T.translate(w,M+b,l+.025),s.push({geometry:T,color:o.iron,sway:0})}}const S=vt(s);e!==1&&S.scale(e,e,e);const E=bt(S,"door",0),A={width:(a+h*2)*e,height:(c+h)*e,depth:(l+p+v)*e,material:r};return E.userData.door=A,E}const KM={name:"door",category:"structures",radius:.9,build:ip};function Zd(){return new Promise(i=>{requestAnimationFrame(()=>requestAnimationFrame(()=>i()))})}class jM{root;bar;label;shown=!1;constructor(t){this.root=document.createElement("div"),this.root.id="building";const e=document.createElement("div");e.className="loading-track",this.bar=document.createElement("div"),this.bar.className="loading-bar",e.appendChild(this.bar),this.label=document.createElement("div"),this.label.className="loading-label",this.root.append(e,this.label),t.appendChild(this.root)}async show(t){this.label.textContent=t,this.bar.style.animation="none",this.bar.style.transform="scaleX(0.04)",this.root.classList.add("is-shown"),this.shown=!0,await Zd()}async step(t,e){this.shown&&(this.label.textContent=t,e===void 0?(this.bar.style.transition="none",this.bar.style.animation="building-sweep 900ms ease-in-out infinite"):(this.bar.style.animation="none",this.bar.style.transition="",this.bar.style.transform=`scaleX(${Math.min(Math.max(e,0),1)})`),await Zd())}hide(){this.shown&&(this.shown=!1,this.bar.style.animation="none",this.root.classList.remove("is-shown"))}dispose(){this.root.remove()}}const JM={level:.55,click:{hz:3200,q:6,duration:.004,level:.5},modes:[{hz:180,decay:.16,q:5,level:1},{hz:430,decay:.1,q:6,level:.55},{hz:950,decay:.055,q:7,level:.25}],thump:{from:112,to:82,decay:.13,level:.55}},QM={level:.5,click:{hz:5200,q:9,duration:.005,level:.6},modes:[{hz:240,decay:.34,q:9,level:.8},{hz:620,decay:.28,q:11,level:.6},{hz:1450,decay:.2,q:12,level:.35},{hz:2900,decay:.12,q:10,level:.18}],thump:{from:78,to:62,decay:.3,level:.7}},tb={level:.42,click:{hz:2400,q:5,duration:.003,level:.35},modes:[{hz:320,decay:.08,q:5,level:.8},{hz:720,decay:.055,q:6,level:.45},{hz:1600,decay:.035,q:6,level:.2}],thump:{from:150,to:120,decay:.07,level:.3}},eb={timber:JM,iron:QM,plank:tb};function nb(i){return Math.max(i.thump.decay,...i.modes.map(e=>e.decay))*3+sp+.05}const sp=.032;function po(i,t){return i+Math.random()*(t-i)}class ib{engine;constructor(t){this.engine=t}play(t,e="timber"){const n=eb[e],s=this.engine.context;if(s.state!=="running"||!this.engine.noise)return;const r=s.currentTime+.02,o=[],a=this.buildOutput(n,t,o),c=Ss(s,[{hz:n.click.hz,decay:n.click.duration,level:n.click.level,q:n.click.q}],a),l=Ss(s,n.modes,a);this.excite(c.inputs[0],n.click.level,r,6e-4,n.click.duration*1.5,o);const h=r+sp;n.modes.forEach((f,d)=>{this.excite(l.inputs[d],f.level*po(.92,1.08),h,.002,f.decay,o)}),ra(s,a,h,n.thump.level,n.thump.from*po(.96,1.04),n.thump.to,n.thump.decay,.004);const u=nb(n);window.setTimeout(()=>{for(const f of o)f.disconnect();c.dispose(),l.dispose()},(r-s.currentTime+u)*1e3+250)}buildOutput(t,e,n){const s=this.engine.context,r=s.createGain();r.gain.value=t.level;const o=s.createPanner();o.panningModel="HRTF",o.distanceModel="inverse",o.refDistance=1.6,o.maxDistance=45,o.rolloffFactor=1.1,sb(o,e);const a=s.createGain();return a.gain.value=.9,r.connect(o),o.connect(this.engine.dry),o.connect(a),a.connect(this.engine.send),n.push(r,o,a),r}excite(t,e,n,s,r,o){const a=this.engine.context,c=this.engine.noise;if(!c)return;const l=a.createBufferSource();l.buffer=c.white,l.playbackRate.value=po(.9,1.1);const h=a.createGain();wr(h.gain,n,e,s,r),l.connect(h).connect(t),l.start(n,po(0,c.white.duration-1),r*3+.05),l.stop(n+r*3+.06),o.push(l,h)}}function sb(i,t){i.positionX?(i.positionX.value=t.x,i.positionY.value=t.y,i.positionZ.value=t.z):i.setPosition(t.x,t.y,t.z)}class rb{zones=new Map;portals=new kM;lights;options;audio=null;doorAudio=null;soundscapes=new Map;warmed=new Set;entering=0;building=new jM(document.body);arrived=!1;active=null;doored=new Set;transitioning=!1;hovered=null;crossings=0;onZoneChange=null;constructor(t){this.options=t,this.lights={sun:new ju(16773848,2.2),fill:new ju(9412792,0),ambient:new jw(10339560,4998454,1.5)},this.lights.sun.position.set(-70,90,50);const e=this.lights.sun.shadow;e.mapSize.set(4096,4096);const n=48;e.camera.left=-n,e.camera.right=n,e.camera.top=n,e.camera.bottom=-n,e.camera.near=55,e.camera.far=225,e.bias=-8e-5,e.normalBias=.006,e.intensity=.34,this.lights.fill.position.set(9,7,-7),t.scene.add(this.lights.sun,this.lights.fill,this.lights.ambient)}get sunDirection(){return this.lights.sun.position}setShadows(t){this.lights.sun.castShadow=t}register(t){const e=new UM(t);return this.zones.set(e.id,e),e}link(t){for(const e of[t.a,t.b])if(!this.zones.has(e.zone))throw new Error(`portal ${t.id} refers to unknown zone "${e.zone}"`);this.portals.add(t,e=>this.zones.get(e)?.name??e)}prebuild(t){const e=this.zones.get(t);if(!e)return;const n=this.prepare(e);n.updateWorldMatrix(!0,!0),this.options.collider.warm(n,e.id),this.warmed.add(e.id)}surfaceAt(t,e){const n=this.active;return n?n.definition.surfaceAt?.(t,e)??n.environment.surface:"earth"}attachAudio(t){this.audio=t,this.doorAudio=new ib(t.engine),this.active&&this.applyAudio(this.active)}get current(){return this.active}get isTransitioning(){return this.transitioning}async enter(t,e){const n=this.zones.get(t);if(!n)throw new Error(`no such zone "${t}"`);const s=++this.entering,r=()=>s!==this.entering,{scene:o,collider:a,player:c,postfx:l,interaction:h}=this.options,u=!this.warmed.has(n.id)&&this.arrived;if(u&&(await this.building.show(`entering ${n.name.toLowerCase()}`),await this.building.step("raising the world"),r()))return;this.active&&this.active!==n&&o.remove(this.active.root());const f=this.prepare(n);if(u&&(await this.building.step("settling the ground"),r()))return;o.add(f),this.active=n,f.updateWorldMatrix(!0,!0),a.build(f,n.id),this.warmed.add(n.id),u&&await this.building.step("almost there",.96);const d=n.environment;l.setEnvironment({sky:d.sky,fogColor:d.fogColor,fogNear:d.fogNear,fogFar:d.fogFar}),this.lights.sun.intensity=d.sunIntensity,this.lights.sun.color.setHex(d.sunColor),this.lights.fill.intensity=d.fillIntensity,this.lights.fill.color.setHex(d.fillColor),this.lights.ambient.intensity=d.ambientIntensity,this.lights.ambient.color.setHex(d.ambientSky),this.lights.ambient.groundColor.setHex(d.ambientGround),this.applyAudio(n);const g=this.portals.in(n.id).map(m=>m.door).filter(m=>m!==null);f.traverse(m=>{typeof m.userData.label=="string"&&g.push(m)}),h.setTargets(g);const y=n.settle(e??n.spawn);c.teleport(y.position,y.yaw),this.hovered=null,this.options.reticle.set(null),this.onZoneChange?.(n),this.arrived=!0,this.building.hide()}applyAudio(t){if(!this.audio)return;this.audio.engine.setRoom(t.environment.room),this.audio.footsteps.surface=t.environment.surface,this.audio.footsteps.setReverb(t.environment.footstepReverb);let e=this.soundscapes.get(t.id);e||(e=new DM(this.audio.engine,t.environment.soundscape),this.soundscapes.set(t.id,e));for(const[n,s]of this.soundscapes)s.setActive(n===t.id)}updateSound(t,e){this.active&&this.soundscapes.get(this.active.id)?.update(t,this.options.collider,e)}get sound(){return this.active?this.soundscapes.get(this.active.id)??null:null}prepare(t){const e=t.root();if(this.doored.has(t.id))return e;this.doored.add(t.id);for(const n of this.portals.in(t.id)){const s=n.end,r=ip({seed:s.seed??1,material:s.material});r.position.copy(s.position),r.rotation.y=s.yaw,Ee(r),e.add(r),this.portals.bind(n,r,ZM($d(r).material))}return e.traverse(n=>{if(!(n instanceof ee))return;const s=n.userData.noCollide===!0,r=n.name==="flatGround"||n.name==="terrain";n.castShadow=!s&&!r,n.receiveShadow=!s}),e}update(){const{interaction:t,collider:e,player:n,reticle:s}=this.options;if(this.transitioning)return s.set(null),null;const r=t.probe(n.camera,e);if(this.hovered=r?this.portals.sideOf(r.object):null,this.hovered)s.set({title:this.hovered.title,target:this.hovered.label});else{const o=VM(r?.object??null);s.set(o?{title:o}:null)}return this.hovered}async use(t){if(this.transitioning)return;this.transitioning=!0,this.options.reticle.set(null);const e=t.door?$d(t.door).material:"timber";Kd.copy(t.end.position).setY(t.end.position.y+1.2),this.doorAudio?.play(Kd,e),await this.options.fade.cover(async()=>{await this.enter(t.target.zone,t.arrival),this.crossings++}),this.transitioning=!1}respawn(){const t=this.active;t&&this.options.player.teleport(t.spawn.position,t.spawn.yaw)}dispose(){const{scene:t}=this.options;this.active&&t.remove(this.active.root()),t.remove(this.lights.sun,this.lights.fill,this.lights.ambient);for(const e of this.soundscapes.values())e.dispose();this.soundscapes.clear();for(const e of this.zones.values())e.dispose();this.zones.clear(),this.doored.clear()}}const Kd=new R,ob=.14,jd=.22;class ab{element;title;target;joiner;shown=!1;showing="";constructor(t){this.element=document.createElement("div"),this.element.id="prompt",this.element.setAttribute("aria-live","polite");const e=document.createElement("span");e.className="prompt-lines",this.title=document.createElement("span"),this.title.className="prompt-title",this.joiner=document.createElement("span"),this.joiner.className="prompt-to",this.joiner.textContent="to",this.target=document.createElement("span"),this.target.className="prompt-target",e.append(this.title,this.joiner,this.target),this.element.append(e),t.appendChild(this.element)}set(t){const e=t!==null;if(t){const n=`${t.title}\0${t.target}`;if(n!==this.showing){this.showing=n,this.title.textContent=t.title,this.target.textContent=t.target??"";const s=!!t.target;this.joiner.hidden=!s,this.target.hidden=!s}}e!==this.shown&&(this.shown=e,this.element.classList.toggle("is-shown",e))}dispose(){this.element.remove()}}class cb{element;constructor(t){this.element=document.createElement("div"),this.element.id="fade",t.appendChild(this.element)}async cover(t){this.element.classList.add("is-black"),await gc(jd),t(),await gc(ob),this.element.classList.remove("is-black"),await gc(jd)}dispose(){this.element.remove()}}function gc(i){return new Promise(t=>window.setTimeout(t,i*1e3))}const lb=6,hb=.55,ub=.42;class db{element;renderer;pixel=new Uint8Array(4);countdown=0;onLight=!1;constructor(t,e=document.getElementById("crosshair")){this.renderer=t,this.element=e}update(){if(!this.element||this.countdown-- >0)return;this.countdown=lb;const t=this.renderer.getContext();this.renderer.setRenderTarget(null);const e=t.drawingBufferWidth,n=t.drawingBufferHeight;if(e===0||n===0)return;t.readPixels(e>>1,n>>1,1,1,t.RGBA,t.UNSIGNED_BYTE,this.pixel);const s=(.2126*this.pixel[0]+.7152*this.pixel[1]+.0722*this.pixel[2])/255,r=this.onLight?s>ub:s>hb;r!==this.onLight&&(this.onLight=r,this.element.classList.toggle("on-light",r))}}const rp={floor:I.TIMBER,floorSeam:1315085,wall:I.CLOTH,wallTrim:I.TIMBER_DARK,ceiling:I.TIMBER_DARK,beam:I.BARK},fb={floor:I.STONE_DARK,floorSeam:921618,wall:I.STONE,wallTrim:I.IRON,ceiling:4015178,beam:I.RUST};function op(i){const{width:t,depth:e,height:n,seed:s=1,style:r=rp,planks:o=!0,beams:a=3,thickness:c=.35}=i,l=xt(s),h=[],u=c,f=t+u*2,d=e+u*2,g=o?-.006:0,y=new G(f,u,d);y.translate(0,g-u/2,0),h.push({geometry:y,color:o?r.floorSeam:r.floor,sway:0});const m=new G(f,u,d);m.translate(0,n+u/2,0),h.push({geometry:m,color:r.ceiling,sway:0});for(const _ of[-1,1]){const v=new G(f,n,u);v.translate(0,n/2,_*(e+u)/2),h.push({geometry:v,color:r.wall,sway:0})}for(const _ of[-1,1]){const v=new G(u,n,d);v.translate(_*(t+u)/2,n/2,0),h.push({geometry:v,color:r.wall,sway:0})}if(o){const _=l.range(.24,.34),v=Math.ceil(t/_),w=.012;for(let M=0;M<v;M++){const S=-t/2+(M+.5)*_,E=new G(_-w,.03,e);E.translate(S,-.015,0),h.push({geometry:E,color:U(r.floor,l.around(1,.09)),sway:0})}}if(a>0){const _=l.range(.16,.24);for(let v=0;v<a;v++){const w=-e/2+(v+.5)/a*e,M=new G(f,_,l.range(.18,.26));M.translate(0,n-_/2,w),h.push({geometry:M,color:r.beam,sway:0})}}const p=.16;for(const _ of[-1,1]){const v=new G(t,p,.06);v.translate(0,p/2,_*(e-.06)/2),h.push({geometry:v,color:r.wallTrim,sway:0})}for(const _ of[-1,1]){const v=new G(.06,p,e);v.translate(_*(t-.06)/2,p/2,0),h.push({geometry:v,color:r.wallTrim,sway:0})}return bt(vt(h),"interior",0)}const Eh={name:"hut",category:"structures",radius:2.6,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(3,4.4),r=e.range(2.6,3.8),o=e.range(2,2.6),a=e.range(.4,.8),c=e.range(.9,1.5),l=new $(c,c,s*1.16,3,1);l.rotateZ(Math.PI/2),l.rotateX(Math.PI/6),l.scale(1,1,r*1.2/(c*2)),l.computeBoundingBox(),l.translate(0,o-(l.boundingBox?.min.y??0),0),n.push({geometry:l,color:I.STONE,sway:0});const h=o,u=new G(s,a,r);u.translate(0,a/2,0),n.push({geometry:u,color:I.STONE_DARK,sway:0});const f=new G(s*.97,h-a,r*.97);f.translate(0,a+(h-a)/2,0),n.push({geometry:f,color:I.TIMBER,sway:0});const d=e.range(.75,.95),g=e.range(1.5,1.8),y=e.around(0,s*.15),m=new G(d,g,.08);m.translate(y,g/2,r*.487),n.push({geometry:m,color:1514012,sway:0});const p=new G(d*1.3,.14,.16);p.translate(y,g+.07,r*.49),n.push({geometry:p,color:I.TIMBER_DARK,sway:0});for(const M of[-1,1])for(const S of[-1,1]){const E=new G(.16,h,.16);E.translate(M*s/2,h/2,S*r/2),n.push({geometry:E,color:I.TIMBER_DARK,sway:0})}const _=vt(n);t!==1&&_.scale(t,t,t);const v=bt(_,"hut",0),w={x:y*t,z:r*.487*t,width:d*t,height:g*t};return v.userData.doorAnchor=w,v}};function pb(i){return i.userData.doorAnchor}const Jd=[{name:"small",weight:.3,scale:[.55,.75]},{name:"ordinary",weight:.45,scale:[.85,1.15]},{name:"large",weight:.18,scale:[1.5,1.9]},{name:"huge",weight:.07,scale:[2.1,2.6]}],Vo={name:"crate",category:"objects",radius:1.2,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[];let s=e(),r=Jd[1];for(const m of Jd)if(s-=m.weight,s<=0){r=m;break}const o=e.range(r.scale[0],r.scale[1]),a=e.range(.5,.9)*o,c=e.range(.45,.8)*o,l=e.range(.5,.9)*o,h=e.around(0,.35),u=new G(a,c,l);u.translate(0,c/2,0),u.rotateY(h),n.push({geometry:u,color:I.TIMBER,sway:0});const f=Math.max(2,Math.round(2+o*.9+(e.chance(.3)?1:0))),d=.05*Math.min(o,1.5),g=1.02;for(let m=0;m<f;m++){const p=c*(.13+m/Math.max(f-1,1)*.74),_=new G(a*g,d,l*g);_.translate(0,p,0),_.rotateY(h),n.push({geometry:_,color:I.TIMBER_DARK,sway:0})}if(o>1.2||e.chance(.25)){const m=.055*Math.min(o,1.6);for(const p of[-1,1])for(const _ of[-1,1]){const v=new G(m,c*.96,m);v.translate(p*a/2,c*.48,_*l/2),v.rotateY(h),n.push({geometry:v,color:I.RUST,sway:0})}}if(e.chance(.35)){const m=new G(a*.92,.05*o,l*.92);m.translate(e.around(0,.08*o),c+.03*o,e.around(0,.08*o)),m.rotateY(h+e.around(0,.25)),n.push({geometry:m,color:I.TIMBER_DARK,sway:0})}const y=vt(n);return t!==1&&y.scale(t,t,t),bt(y,"crate",0)}},Wo={name:"barrel",category:"objects",radius:.55,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.75,1.05),r=e.range(.3,.4),o=r*e.range(.78,.88),a=e.int(8,11),c=e.chance(.25),l=[new tt(0,0),new tt(o,0),new tt(r,s*.35),new tt(r,s*.65),new tt(o,s),new tt(0,s)];n.push({geometry:new Zn(l,a),color:I.TIMBER,sway:0});for(const u of[.14,.5,.86]){const f=u>.3&&u<.7?r:o+(r-o)*.45,d=new $(f*1.04,f*1.04,.055,a);d.translate(0,s*u,0),n.push({geometry:d,color:I.IRON,sway:0})}let h=vt(n);return c&&(h.rotateX(Math.PI/2),h.rotateY(e.range(0,Math.PI*2)),h.translate(0,r,0)),t!==1&&(h=h.scale(t,t,t)),bt(h,"barrel",0)}},ap={name:"bed",category:"furniture",radius:1.3,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.9,1.25),r=e.range(1.85,2.15),o=e.range(.26,.4),a=e.range(.07,.1),c=e.chance(.55)?I.TIMBER_DARK:I.BARK,l=e.pick([I.CLOTH,I.WOOL,I.HIDE_PALE]),h=e.pick([I.HIDE,I.LEAF_DARK,I.RUST,I.STONE_DARK]),u=e.chance(.5)?-1:1;for(const E of[-1,1]){const A=new G(a,o*.55,r);A.translate(E*(s-a)/2,o*.72,0),n.push({geometry:A,color:c,sway:0})}for(const E of[-1,1])for(const A of[-1,1]){const x=o*(A===u?1.05:.98),b=new G(a,x,a);b.translate(E*(s-a)/2,x/2,A*(r-a)/2),n.push({geometry:b,color:c,sway:0})}const f=e.range(.34,.62),d=new G(s,f,.055);if(d.translate(0,o+f/2-.04,u*r/2),n.push({geometry:d,color:c,sway:0}),e.chance(.55)){const E=f*e.range(.3,.5),A=new G(s,E,.05);A.translate(0,o+E/2-.04,-u*r/2),n.push({geometry:A,color:c,sway:0})}const g=o+e.range(.14,.2),y=6,m=(r-.1)/y;for(let E=0;E<y;E++){const A=-r/2+.05+(E+.5)*m,x=u<0?E/(y-1):1-E/(y-1),b=1-.22*Math.sin(x*Math.PI)*e.range(.4,1),T=(g-o*.72)*b,P=new G(s-a*1.4,T,m*1.04);P.translate(0,o*.72+T/2,A),n.push({geometry:P,color:l,sway:0})}const p=r*e.range(.6,.75),_=4,v=p/_,w=-u*r/2;for(let E=0;E<_;E++){const A=w+u*((E+.5)*v),x=e.range(.045,.075),b=new G(s-a*.6,x,v*1.02);b.translate(0,g+x/2-.01,A),n.push({geometry:b,color:h,sway:0})}const M=new G(s-a*.6,.05,.09);if(M.translate(0,g+.05,w+u*p),n.push({geometry:M,color:U(h,1.18),sway:0}),e.chance(.85)){const E=e.range(.26,.36),A=new G(s*e.range(.5,.72),e.range(.09,.14),E);A.translate(e.around(0,s*.1),g+.06,u*(r/2-E*.8)),A.rotateY(e.around(0,.18)),n.push({geometry:A,color:U(l,1.12),sway:0})}const S=vt(n);return t!==1&&S.scale(t,t,t),bt(S,"bed",0)}},Qd=[{weight:.28,width:[.7,1],depth:[.5,.68]},{weight:.47,width:[1.2,1.7],depth:[.7,.95]},{weight:.25,width:[2.1,3],depth:[.85,1.1]}],Xo={name:"table",category:"furniture",radius:1.6,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[];let s=e(),r=Qd[1];for(const _ of Qd)if(s-=_.weight,s<=0){r=_;break}const o=e.range(r.width[0],r.width[1]),a=e.range(r.depth[0],r.depth[1]),c=e.range(.68,.78),l=e.range(.045,.07),h=o>1.5&&e.chance(.45),u=e.chance(.6)?I.TIMBER:I.TIMBER_DARK,f=u===I.TIMBER?I.TIMBER_DARK:I.TIMBER,d=e.int(3,5),g=a/d,y=.008;for(let _=0;_<d;_++){const v=new G(o,l*e.range(.93,1),g-y);v.translate(0,c-l/2,-a/2+(_+.5)*g),n.push({geometry:v,color:U(u,e.around(1,.07)),sway:0})}const m=c-l;if(h){const _=o*e.range(.16,.24);for(const w of[-1,1]){const M=w*(o/2-_),S=new G(.09,.07,a*.86);S.translate(M,.035,0),n.push({geometry:S,color:f,sway:0});const E=e.range(.09,.13),A=new G(E,m-.07,a*.2);A.translate(M,.07+(m-.07)/2,0),n.push({geometry:A,color:f,sway:0});const x=new G(.09,.06,a*.8);x.translate(M,m-.03,0),n.push({geometry:x,color:f,sway:0})}const v=new G(o-_*1.2,.07,.07);v.translate(0,m*e.range(.32,.42),0),n.push({geometry:v,color:f,sway:0})}else{const _=e.range(.055,.085),v=o/2-_*.9,w=a/2-_*.9;for(const M of[-1,1])for(const S of[-1,1]){const E=new G(_,m,_);E.translate(M*v,m/2,S*w),n.push({geometry:E,color:f,sway:0})}if(e.chance(.7)){for(const S of[-1,1]){const E=new G(v*2,.07,.03);E.translate(0,m-.07/2-.02,S*w),n.push({geometry:E,color:f,sway:0})}for(const S of[-1,1]){const E=new G(.03,.07,w*2);E.translate(S*v,m-.07/2-.02,0),n.push({geometry:E,color:f,sway:0})}}}const p=vt(n);return t!==1&&p.scale(t,t,t),bt(p,"table",0)}},Nl={name:"chair",category:"furniture",radius:.45,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.42,.5),r=e.range(.38,.46),o=e.range(.36,.44),a=e.range(.04,.06),c=e.range(.44,.66),l=e.pick(["slats","spindles","board"]),h=e.chance(.55)?I.TIMBER:I.TIMBER_DARK,u=h===I.TIMBER?I.TIMBER_DARK:I.TIMBER,f=new G(r,a,o);f.translate(0,s-a/2,0),n.push({geometry:f,color:h,sway:0});const d=e.range(.035,.048),g=r/2-d*.7,y=o/2-d*.7;for(const _ of[-1,1]){const v=new G(d,s,d);v.translate(_*g,s/2,y),n.push({geometry:v,color:u,sway:0})}for(const _ of[-1,1]){const v=new G(d,s,d);v.translate(_*g,s/2,-y),n.push({geometry:v,color:u,sway:0});const w=.03,M=new G(d,c+w,d);M.translate(_*g,s+c/2-w/2,-y),n.push({geometry:M,color:u,sway:0})}const m=(_,v)=>{_.translate(0,s+v,-y)};if(l==="board"){const _=c*e.range(.4,.55),v=new G(r*.86,_,.03);m(v,c-_*.62),n.push({geometry:v,color:h,sway:0})}else if(l==="slats"){const _=e.int(2,3);for(let v=0;v<_;v++){const w=c*(.42+v/Math.max(_-1,1)*.5),M=new G(r*.84,e.range(.06,.1),.026);m(M,w),n.push({geometry:M,color:h,sway:0})}}else{const _=e.int(3,5),v=r*.72,w=c*.93,M=.02,S=w+M;for(let A=0;A<_;A++){const x=-v/2+A/(_-1)*v,b=new G(.026,S,.026);b.translate(x,S/2-M,0),m(b,0),n.push({geometry:b,color:u,sway:0})}const E=new G(r*.84,.055,.032);m(E,w),n.push({geometry:E,color:h,sway:0})}if(e.chance(.6)){const _=new G(g*2,.026,.026);_.translate(0,s*e.range(.28,.36),y),n.push({geometry:_,color:u,sway:0})}const p=vt(n);return t!==1&&p.scale(t,t,t),bt(p,"chair",0)}},Ul={name:"stool",category:"furniture",radius:.42,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.chance(.45)?3:4,r=e.range(.42,.56),o=e.range(.16,.23),a=e.range(.04,.07),c=e.chance(.5)?I.TIMBER:I.TIMBER_DARK,l=c===I.TIMBER?I.TIMBER_DARK:I.TIMBER,h=s===3?new $(o,o*.96,a,6):new G(o*1.9,a,o*1.9);h.translate(0,r-a/2,0),s===4&&h.rotateY(e.around(0,.2)),n.push({geometry:h,color:c,sway:0});const u=r-a,f=e.range(.14,.26),d=o*.66,g=u/Math.cos(f);for(let p=0;p<s;p++){const _=p/s*Math.PI*2+(s===4?Math.PI/4:0),v=e.range(.035,.05),w=Math.cos(_),M=Math.sin(_),S=new G(v,g,v);S.translate(0,-g/2,0),S.rotateZ(f),S.rotateY(-_),S.translate(w*d,u,M*d),n.push({geometry:S,color:l,sway:0})}const y=d+g*Math.sin(f);if(s===4&&e.chance(.45)){const p=e.range(.28,.38),_=d+(y-d)*(1-p);for(const v of[0,Math.PI/2]){const w=new G(_*2,.028,.028);w.translate(0,u*p,0),w.rotateY(v+Math.PI/4),n.push({geometry:w,color:l,sway:0})}}const m=vt(n);return t!==1&&m.scale(t,t,t),bt(m,"stool",0)}},mb=[{shape:"cone",weight:.3},{shape:"orb",weight:.2},{shape:"wedge",weight:.16},{shape:"drum",weight:.14},{shape:"block",weight:.11},{shape:"spike",weight:.09}];function gb(i){let t=i();for(const e of mb)if(t-=e.weight,t<=0)return e.shape;return"cone"}const yb={cone:.3,wedge:.3,drum:.4,block:.4,orb:.5,spike:.85};function vb(i,t,e){switch(i){case"cone":return new $t(t*1.15,t*e.range(2.2,3.2),e.int(5,8));case"wedge":return new $t(t*1.3,t*e.range(1.6,2.2),4);case"drum":return new $(t*1.1,t*1.15,t*e.range(1.1,1.7),7);case"block":return new G(t*1.7,t*e.range(1.6,2.3),t*1.5);case"spike":return new ke(t*1.3,0);case"orb":default:return new te(t,0)}}function _b(i,t,e,n){switch(i.int(0,3)){case 0:return{geometry:new G(t*2,n,t*1.3),halfDepth:t*.65};case 1:return{geometry:new $(e,t,n,i.int(5,7)),halfDepth:t*.85};case 2:return{geometry:new $(t,e,n,4),halfDepth:t*.75};default:return{geometry:new $(t,e,n,i.int(5,7)),halfDepth:t*.85}}}function t0(i,t,e,n){return i?new G(t*2,n,t*2):new $(t,e,n,5)}function kn(i,t,e=0){return new R(t*(i.reach+.03+e),i.hold,.16)}const wb=[(i,t,e)=>{const n=i.range(.11,.16),s=kn(t,e,n*.6),r=new $(n*.6,n*.4,n,7);return r.translate(s.x,s.y+n/2,s.z),[{geometry:r,color:i.pick([I.WOOL,I.RUST]),sway:0}]},(i,t,e)=>{const n=i.range(.14,.2),s=kn(t,e,n),r=new te(n,0);r.scale(1,1.15,1),r.translate(s.x,s.y+n*.7,s.z);const o=new $(n*.32,n*.45,n*.8,6);o.translate(s.x,s.y+n*1.8,s.z);const a=i.pick([I.RUST,I.COW_BLACK]);return[{geometry:r,color:a,sway:0},{geometry:o,color:a,sway:0}]},(i,t,e)=>{const n=i.range(.1,.15),s=kn(t,e,n),r=new te(n,0);return r.scale(1,i.range(.7,.95),i.range(.8,1.1)),r.rotateX(i.range(0,Math.PI)),r.rotateY(i.range(0,Math.PI)),r.translate(s.x,s.y,s.z),[{geometry:r,color:i.pick([I.STONE_DARK,I.COW_BLACK]),sway:0}]},(i,t,e)=>{const n=[],s=kn(t,e,.04),r=i.range(.28,.45),o=new $(.012,.016,r,4);o.translate(s.x,s.y+r/2,s.z),n.push({geometry:o,color:I.BARK,sway:.45});const a=i.int(3,6);for(let c=0;c<a;c++){const l=new te(i.range(.055,.085),0);l.scale(1,.4,.85),l.rotateY(i.range(0,Math.PI)),l.rotateZ(i.around(0,.5)),l.translate(s.x+i.around(0,.07),s.y+r*i.range(.6,1.05),s.z+i.around(0,.06)),n.push({geometry:l,color:I.LEAF,sway:.7})}return n},(i,t,e)=>{const n=i.range(.11,.16),s=kn(t,e,n*1.5),r=new te(n,0);return r.scale(1.5,.75,.9),r.rotateY(i.around(0,.4)),r.translate(s.x,s.y+.03,s.z),[{geometry:r,color:i.pick([I.BARK_PALE,I.MARKER_YELLOW]),sway:0}]},(i,t,e)=>{const n=i.range(.16,.23),s=kn(t,e,n),r=new te(n,0);return r.scale(1,i.range(.8,1.05),.9),r.rotateX(i.range(0,Math.PI)),r.translate(s.x,s.y+.06,s.z),[{geometry:r,color:i.pick([I.WOOL,I.RUST]),sway:0}]},(i,t,e)=>{const n=i.range(.2,.28),s=kn(t,e,n*.55),r=new G(n*.75,n,.03);return r.rotateZ(e*i.range(.15,.45)),r.translate(s.x,s.y+n*.3,s.z),[{geometry:r,color:i.pick([I.COW_BLACK,I.WOOL]),sway:0}]},(i,t,e)=>{const n=kn(t,e,.07),s=i.range(.1,.18),r=new $(.01,.01,s,4);r.translate(n.x,n.y+s/2,n.z);const o=new G(.12,.15,.12);o.translate(n.x,n.y-.07,n.z);const a=new $t(.095,.06,4);return a.translate(n.x,n.y+.02,n.z),[{geometry:r,color:I.IRON,sway:0},{geometry:o,color:I.MARKER_YELLOW,sway:0},{geometry:a,color:I.IRON,sway:0}]},(i,t,e)=>{const n=i.range(.24,.36),s=kn(t,e,n*.5),r=new ke(n*.36,0);r.scale(1.9,.85,.5),r.rotateZ(e*.8),r.translate(s.x,s.y-n*.25,s.z);const o=new $t(n*.16,n*.24,3);return o.scale(1,1,.4),o.rotateZ(e*.8+Math.PI),o.translate(s.x+e*n*.32,s.y-n*.25-n*.42,s.z),[{geometry:r,color:I.STONE_PALE,sway:0},{geometry:o,color:I.STONE,sway:0}]}],yc=[{name:"held",weight:.52,build:(i,t,e)=>i.pick(wb)(i,t,e)},{name:"pauldron",weight:.18,build:(i,t,e)=>{const n=new te(i.range(.09,.14),0);return n.scale(1.15,.65,1.05),n.rotateY(i.range(0,Math.PI)),n.translate(e*(t.chest+.04),t.shoulder-.02,0),[{geometry:n,color:I.IRON,sway:0}]}},{name:"pack",weight:.19,build:(i,t,e)=>{const n=i.range(.2,.32),s=i.range(.24,.4),r=i.range(.12,.2),o=new G(n,s,r);return o.rotateY(i.around(0,.2)),o.translate(e*i.range(0,.07),t.shoulder-s*.55,-(t.depth+r*.4)),[{geometry:o,color:I.TIMBER_DARK,sway:0}]}},{name:"horn",weight:.08,build:(i,t,e)=>{const n=i.range(.14,.3),s=new $t(i.range(.02,.035),n,4);return s.translate(0,n/2,0),s.rotateZ(e*i.range(.5,1.1)),s.rotateX(i.around(0,.3)),s.translate(e*.05,t.height*.97,0),[{geometry:s,color:I.SKIN,sway:0}]}}];function e0(i){let t=i()*yc.reduce((e,n)=>e+n.weight,0);for(const e of yc)if(t-=e.weight,t<=0)return e;return yc[0]}const ar={name:"figure",category:"people",radius:.55,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(1.55,2.05),r=e.range(.72,1.24),o=s*e.range(.44,.58),a=s*e.range(.78,.87),c=e.pick([I.CLOTH,I.TIMBER_DARK,I.STONE_DARK]),l=e.chance(.45),h=e.chance(.5)?1:-1,u=.19*r*e.range(.8,1.25),f=.15*r*e.range(.8,1.3),{geometry:d,halfDepth:g}=_b(e,u,f,a-o);d.translate(0,(a+o)/2,0),d.rotateY(e.around(0,.25)),n.push({geometry:d,color:c,sway:0});const y=e.range(.04,.22),m=new $(.045,.06,y,5);m.translate(0,a+y/2,0),n.push({geometry:m,color:I.SKIN,sway:0});const p=e.range(.085,.15),_=gb(e),v=vb(_,p,e);v.scale(e.range(.82,1.08),e.range(.95,1.3),e.range(.85,1.12)),v.rotateZ(e.around(0,.16)),v.rotateY(e.range(0,Math.PI)),v.computeBoundingBox();const w=p*yb[_];v.translate(0,a+y-w-(v.boundingBox?.min.y??0),0),n.push({geometry:v,color:l?c:I.SKIN,sway:0});const M=e.range(.045,.075)*r,S=e.range(.03,.055)*r,E=(a-o)*e.range(.95,1.5),A=e.chance(.25),x=e.range(-.02,.09),b=e.range(.06,.11)*r,T=e.chance(.25),P=e.range(.04,.22);for(const N of[-1,1]){const D=o,B=t0(A,M,M*.8,D);B.translate(0,-D/2,0),B.rotateZ(N*x),B.translate(N*b,o,0),n.push({geometry:B,color:I.TIMBER_DARK,sway:0});const H=t0(T,S,S*.82,E);H.translate(0,-E/2,0),H.rotateZ(N*P),H.translate(N*(u+S*1.4),a-.03,0),n.push({geometry:H,color:c,sway:0})}const C={height:s,shoulder:a,hip:o,chest:u,reach:u+S*2.6,hold:a-E*.82,depth:g};e.chance(.62)&&(n.push(...e0(e).build(e,C,h)),e.chance(.22)&&n.push(...e0(e).build(e,C,h)));const F=vt(n);return t!==1&&F.scale(t,t,t),bt(F,"figure",0)}},Fl={name:"machine",category:"structures",radius:1.6,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(2.1,2.8),r=e.range(.9,1.3),o=e.range(.32,.46),a=e.chance(.5)?I.IRON:I.STONE_DARK,c=e.chance(.6)?I.RUST:I.IRON,l=new G(s,o,r);l.translate(0,o/2,0),n.push({geometry:l,color:I.STONE_DARK,sway:0});for(const D of[-1,1])for(const B of[-1,1]){const H=new G(.22,.08,.22);H.translate(D*(s-.3)/2,.04,B*(r-.3)/2),n.push({geometry:H,color:c,sway:0})}const h=e.chance(.4)?"twin":e.chance(.5)?"stacked":"single",u=e.range(.34,.46)*(h==="single"?1:.82),f=s*e.range(.62,.74),d=-s*.12,g=(D,B,H)=>{const V=new $(D,D,f,10);V.rotateZ(Math.PI/2),V.translate(d,B,H),n.push({geometry:V,color:a,sway:0});for(const et of[-.28,.08,.34]){const lt=new $(D*1.06,D*1.06,.07,10);lt.rotateZ(Math.PI/2),lt.translate(d+f*et,B,H),n.push({geometry:lt,color:c,sway:0})}};let y=o+u*2;if(h==="twin"){const D=u*1.02;g(u,o+u,-D),g(u,o+u,D)}else if(h==="stacked"){const D=u*e.range(.7,.86);g(u,o+u,0),g(D,o+u*2+D*.92,0),y=o+u*2+D*1.9;for(const B of[-.3,.3]){const H=new G(.1,D*1.1,u*1.1);H.translate(d+f*B,o+u*2,0),n.push({geometry:H,color:c,sway:0})}}else g(u,o+u,0);const m=e.range(.52,.72),p=o+m*.82,_=e.chance(.5)?4:3,v=e.chance(.3),w=s/2+e.range(.16,.26),M=v?w*2:w+s*.28,S=v?0:w-M/2,E=new $(.075,.075,M,8);E.rotateZ(Math.PI/2),E.translate(S,p,0),n.push({geometry:E,color:U(c,1.1),sway:0});const A=v?[-s*.34,s*.34]:[s*.16,s*.4];for(const D of A){const B=new G(.26,p-o+.12,.3);B.translate(D,o+(p-o)/2,0),n.push({geometry:B,color:I.STONE_DARK,sway:0});const H=new G(.3,.1,.34);H.translate(D,p,0),n.push({geometry:H,color:c,sway:0})}for(const D of v?[w,-w]:[w]){const B=new $(m,m,.12,12);B.rotateZ(Math.PI/2),B.translate(D,p,0),n.push({geometry:B,color:a,sway:0});const H=new $(.15,.15,.26,8);H.rotateZ(Math.PI/2),H.translate(D,p,0),n.push({geometry:H,color:c,sway:0});for(let V=0;V<_;V++){const et=new G(.07,m*1.85,.06);et.rotateX(Math.PI/2),et.rotateX(V/_*Math.PI),et.translate(D,p,0),n.push({geometry:et,color:U(a,.86),sway:0})}}const x=new G(s*.42,.08,.08);x.translate(d+f*.45,o+u*.9,m*.42),n.push({geometry:x,color:c,sway:0});const b=e.range(1.1,1.8),T=e.range(.11,.16),P=new $(T*.85,T,b,8);P.translate(-s*.3,y+b/2-.1,0),n.push({geometry:P,color:a,sway:0});const C=new $(T*1.3,T*1.1,.1,8);C.translate(-s*.3,y+b-.14,0),n.push({geometry:C,color:c,sway:0});const F=e.int(1,2);for(let D=0;D<F;D++){const B=e.range(-.3,.25),H=new $(.07,.09,e.range(.16,.26),6);H.translate(d+f*B,y,0),n.push({geometry:H,color:c,sway:0});const V=new $(.1,.1,.035,8);V.translate(d+f*B,y+.16,0),n.push({geometry:V,color:U(c,1.2),sway:0})}const N=vt(n);return t!==1&&N.scale(t,t,t),bt(N,"machine",0)}},Ah={name:"sink",category:"objects",radius:.65,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.62,.86),r=e.range(.45,.6),o=e.range(.24,.34),a=e.range(.5,.68),c=e.range(.02,.032),l=U(9410203,e.range(.9,1.08)),h=U(l,.84),u=U(I.IRON,e.range(.85,1.05)),f=a+o,d=new G(s,c,r);d.translate(0,a+c/2,0),n.push({geometry:d,color:h,sway:0});for(const F of[-1,1]){const N=new G(s*.99,o,c);N.translate(0,a+o/2,F*(r-c)/2),n.push({geometry:N,color:l,sway:0});const D=new G(c,o*.985,r*.985);D.translate(F*(s-c)/2,a+o/2,0),n.push({geometry:D,color:l,sway:0})}for(const F of[-1,1]){const N=new G(s*1.04,c*1.4,c*2.2);N.translate(0,f,F*r/2),n.push({geometry:N,color:U(l,1.14),sway:0});const D=new G(c*2.2,c*1.35,r*.96);D.translate(F*s/2,f,0),n.push({geometry:D,color:U(l,1.14),sway:0})}if(e.chance(.4)){const F=new G(s-c*2.2,.02,r-c*2.2);F.translate(0,a+c+o*e.range(.12,.3),0),n.push({geometry:F,color:I.WATER,sway:0})}const g=e.range(.018,.026),y=e.range(.06,.1);for(const F of[-1,1])for(const N of[-1,1]){const D=new $(g*.85,g,a,6);D.translate(F*(s-y*2)/2,a/2,N*(r-y*2)/2),n.push({geometry:D,color:u,sway:0})}if(e.chance(.55)){const F=a*e.range(.2,.32);for(const N of[0,1]){const D=N===0;for(const B of[-1,1]){const H=new G(D?s-y*2:g*1.2,g*1.1,D?g*1.2:r-y*2.4);H.translate(D?0:B*(s-y*2)/2,F,D?B*(r-y*2)/2:0),n.push({geometry:H,color:U(u,.88),sway:0})}}}const m=e.range(.16,.3),p=new G(s*1.02,m,c*1.6);p.translate(0,f+m/2,-r/2-c),n.push({geometry:p,color:U(l,.94),sway:0});const _=m+e.range(.1,.2),v=e.range(.012,.018),w=-r/2-c,M=new $(v,v*1.15,_,6);M.translate(0,f+_/2,w),n.push({geometry:M,color:U(u,1.15),sway:0});const S=e.range(.14,.22),E=new $(v*.9,v*.9,S,6);E.rotateX(Math.PI/2),E.translate(0,f+_,w+S/2),n.push({geometry:E,color:U(u,1.15),sway:0});const A=e.range(.05,.09),x=new $(v*.8,v*.95,A,6);x.translate(0,f+_-A/2,w+S),n.push({geometry:x,color:U(u,1.05),sway:0});const b=e.chance(.75)?2:1,T=e.range(.1,.16),P=w+v*3.4;for(let F=0;F<b;F++){const N=b===1?0:F===0?-T:T,D=e.range(.05,.085),B=new $(v*1.25,v*1.5,D,6);B.translate(N,f+D/2,P),n.push({geometry:B,color:U(u,1.05),sway:0});const H=new $(v*.4,v*.5,v*1.4,6);H.translate(N,f+D+v*.7,P),n.push({geometry:H,color:U(u,1.15),sway:0});const V=e.range(0,Math.PI/2);for(const et of[0,1]){const lt=new G(v*3.4,v*.75,v*.72);lt.rotateY(V+(et?Math.PI/2:0)),lt.translate(N,f+D+v*1.5,P),n.push({geometry:lt,color:U(I.RUST,1.05),sway:0})}}const C=vt(n);return t!==1&&C.scale(t,t,t),bt(C,"sink",0)}},n0=[{color:16760948,light:16758629,weight:.5},{color:16747100,light:16742984,weight:.32},{color:10475775,light:9423103,weight:.18}];function cp(i){const t=i.range(0,1);let e=0;for(const n of n0)if(e+=n.weight,t<=e)return n;return n0[0]}const Th=1.25;function lp(i,t,e,n,s,r){const o=new ke(r,0);o.scale(1,2.4,1),o.translate(e,n,s),i.push({geometry:o,color:t.color,sway:0});const a=new ke(r*4.2,0);a.scale(1,1.5,1),a.translate(e,n,s);const c=r*4.2*1.5;i.push({geometry:a,color:(l,h,u)=>{const f=Math.hypot(l-e,h-n,u-s)/c;return xb(t.color,Math.max(0,.34*(1-f)))},sway:0})}function xb(i,t){const e=Math.round((i>>16&255)*t),n=Math.round((i>>8&255)*t),s=Math.round((i&255)*t);return e<<16|n<<8|s}const Mb=2.15,bb=14,Ol={name:"candle",category:"objects",radius:.3,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=[],r=cp(e),o=e.chance(.5)?14208430:12564904,a=e.chance(.35),c=e.range(.075,.11),l=U(I.IRON,e.range(.85,1.05));let h=0;if(a){const M=e.range(.16,.3),S=new $(c*.62,c*1.05,.022,8);S.translate(0,.011,0),n.push({geometry:S,color:U(l,.86),sway:0});const E=new $(.014,.019,M,6);if(E.translate(0,.022+M/2,0),n.push({geometry:E,color:l,sway:0}),e.chance(.6)){const A=new $(c*.78,c*.5,.016,8);A.translate(0,.022+M*e.range(.45,.62),0),n.push({geometry:A,color:U(l,1.08),sway:0})}h=.022+M}const u=new $(c,c*.88,.018,10);u.translate(0,h+.009,0),n.push({geometry:u,color:U(l,.94),sway:0}),h+=.018;const f=1+(e.chance(.42)?1:0)+(e.chance(.18)?1:0),d=c*.42;for(let M=0;M<f;M++){const S=M/f*Math.PI*2+e.range(0,Math.PI*2),E=f===1?0:Math.cos(S)*d,A=f===1?0:Math.sin(S)*d,x=e.range(.05,.16),b=e.range(.011,.016),T=e.range(0,.13),P=e.range(0,Math.PI*2),C=new $(b*.92,b,x,7);C.translate(0,x/2,0),C.rotateX(Math.cos(P)*T),C.rotateZ(Math.sin(P)*T),C.translate(E,h,A);const F=h+x*.55;n.push({geometry:C,color:(H,V)=>V>F?r.color:o,sway:0});const N=E+Math.sin(Math.sin(P)*T)*x,D=A-Math.sin(Math.cos(P)*T)*x,B=h+x;lp(s,r,N,B+b*2.2,D,b*1.35),M===0&&is.set(N,B+b*2.2,D)}const g=vt(n),y=vt(s),m=e.range(0,Math.PI*2);g.rotateY(m),y.rotateY(m),t!==1&&(g.scale(t,t,t),y.scale(t,t,t));const p=bt(g,"candle",0);p.add(Mn(y,"candle:glow"));const _=Math.cos(m)*is.x+Math.sin(m)*is.z,v=-Math.sin(m)*is.x+Math.cos(m)*is.z,w=new zi(r.light,Mb*e.around(1,.15)*t*t,bb*t,Th);return w.position.set(_*t,is.y*t,v*t),w.castShadow=!1,p.add(w),p}},is=new R,Sb=60,Eb=22,mo=15922406,Po={name:"floodlight",category:"structures",radius:.6,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=[],r=e.range(1.9,2.7),o=e.range(.3,.42),a=o*e.range(.58,.72),c=o*e.range(.34,.46),l=e.range(.32,.6),h=U(I.IRON,e.range(.85,1.05)),u=U(8159880,e.range(.9,1.1)),f=e.range(.035,.05),d=new $(f,f*1.1,r,6);d.translate(0,r/2,0),n.push({geometry:d,color:h,sway:0});const g=new $(f*3.2,f*3.6,f*1.1,8);g.translate(0,f*.55,0),n.push({geometry:g,color:U(h,.85),sway:0});const y=new $(f*1.5,f*1.5,f*2.6,6);y.rotateZ(Math.PI/2),y.translate(0,r,0),n.push({geometry:y,color:U(h,1.1),sway:0});const m=N=>{N.rotateX(l),N.translate(0,r,c*.6)},p=new G(o,a,c);m(p),n.push({geometry:p,color:u,sway:0});const _=new G(o*1.12,a*.16,c*1.5);_.translate(0,a*.56,c*.22),m(_),n.push({geometry:_,color:U(u,1.14),sway:0});const v=new G(o*.72,a*.62,c*.5);v.translate(0,0,-c*.68),m(v),n.push({geometry:v,color:U(u,.84),sway:0});const w=new G(o*.86,a*.7,c*.12);w.translate(0,0,c*.52),m(w),n.push({geometry:w,color:mo,sway:0});const M=e.range(5.5,8),S=e.range(.22,.34),E=o*.42,A=new $t(E+Math.tan(S)*M,M,10,1,!0);A.rotateX(-Math.PI/2),A.translate(0,0,c*.55+M/2),m(A),s.push({geometry:A,color:(N,D,B)=>{const H=Math.hypot(N,D-r,B)/M;return Ab(mo,.3*Math.max(0,1-H)**1.6)},sway:0});const x=new ke(E*.9,0);x.scale(1,.8,.5),x.translate(0,0,c*.56),m(x),s.push({geometry:x,color:mo,sway:0});const b=vt(n),T=vt(s);t!==1&&(b.scale(t,t,t),T.scale(t,t,t));const P=bt(b,"floodlight",0);P.add(Mn(T,"floodlight:glow"));const C=new Qw(mo,Sb*e.around(1,.1)*t*t,Eb*t,S*1.15,.55,2);C.position.set(0,r*t,0);const F=new be;return F.position.set(0,(r-Math.sin(l)*M)*t,Math.cos(l)*M*t),P.add(F),C.target=F,C.castShadow=!1,P.add(C),P}};function Ab(i,t){const e=Math.round((i>>16&255)*t),n=Math.round((i>>8&255)*t),s=Math.round((i&255)*t);return e<<16|n<<8|s}const hp={name:"pipes",category:"structures",radius:1.7,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(2.6,3.6),r=2,o=e.range(.06,.11),a=[I.RUST,4877172,7039548,I.IRON,8018492],c=U(e.pick(a),e.range(.9,1.1)),l=U(I.IRON,e.range(.85,1.05)),h=(y,m,p,_)=>{const v=new $(_,_,m,8);v.rotateZ(Math.PI/2),v.translate(y,p,0),n.push({geometry:v,color:c,sway:0})},u=(y,m,p,_=1.45)=>{const v=new $(p*_,p*_,p*.55,8);v.rotateZ(Math.PI/2),v.translate(y,m,0),n.push({geometry:v,color:U(l,1.05),sway:0})},f=e.int(3,5),d=[-s/2];for(let y=1;y<f;y++)d.push(-s/2+s*(y/f)*e.range(.82,1.18));d.push(s/2),d.sort((y,m)=>y-m);for(let y=0;y<d.length-1;y++){const m=d[y+1]-d[y];h((d[y]+d[y+1])/2,m+o*.5,r,o),y>0&&u(d[y],r,o)}if(u(-s/2,r,o,1.6),u(s/2,r,o,1.6),e.chance(.75)){const y=e.range(-s*.3,s*.3),m=new $(o*1.5,o*1.5,o*1.8,6);m.rotateZ(Math.PI/2),m.translate(y,r,0),n.push({geometry:m,color:U(l,1.1),sway:0});const p=new $(o*.28,o*.34,o*1.6,6);p.translate(y,r+o*2.2,0),n.push({geometry:p,color:l,sway:0});const _=new Oi(o*1.1,o*.2,4,10);_.rotateX(Math.PI/2),_.translate(y,r+o*3,0),n.push({geometry:_,color:U(I.RUST,1.1),sway:0})}const g=vt(n);return t!==1&&g.scale(t,t,t),bt(g,"pipes",0)}},up={name:"tank",category:"structures",radius:1.9,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.4,1.05),r=s*e.range(2.1,4.6),o=e.range(.16,.62),a=o+s,c=e.chance(.45),l=c?U(I.RUST,e.range(.78,.95)):U(7173499,e.range(.9,1.08)),h=U(I.IRON,e.range(.85,1.05)),u=new $(s,s,r,10);u.rotateZ(Math.PI/2),u.translate(0,a,0),n.push({geometry:u,color:c?(v,w)=>w<a?U(l,.82):l:l,sway:0});for(const v of[-1,1]){const w=new $(s*.42,s,s*.45,10);w.rotateZ(v*Math.PI/2),w.translate(v*(r+s*.44)/2,a,0),n.push({geometry:w,color:U(l,1.06),sway:0});const M=new $(s*.42,s*.42,s*.12,10);M.rotateZ(Math.PI/2),M.translate(v*(r+s*.88)/2,a,0),n.push({geometry:M,color:U(h,.95),sway:0})}const f=Math.max(2,Math.round(r/e.range(.7,1.2)));for(let v=1;v<f;v++){const w=-r/2+r*v/f,M=new $(s*1.035,s*1.035,s*.1,10);M.rotateZ(Math.PI/2),M.translate(w,a,0),n.push({geometry:M,color:U(h,1.05),sway:0})}for(const v of[-1,1]){const w=v*r/2*e.range(.5,.66),M=new G(s*.5,o,s*1.8);M.translate(w,o/2,0),n.push({geometry:M,color:U(h,.82),sway:0});const S=new G(s*.42,s*.34,s*1.55);S.translate(w,o+s*.1,0),n.push({geometry:S,color:U(h,.92),sway:0});const E=new G(s*.8,s*.09,s*2);E.translate(w,s*.045,0),n.push({geometry:E,color:U(h,.74),sway:0})}const d=s*e.range(.3,.5),g=e.range(-r*.2,r*.2),y=new $(d,d*1.1,s*.22,8);y.translate(g,a+s*.98,0),n.push({geometry:y,color:U(h,.95),sway:0});const m=new $(d*1.2,d*1.2,s*.09,8);m.translate(g,a+s*1.12,0),n.push({geometry:m,color:U(h,1.12),sway:0});for(let v=0;v<8;v++){const w=v/8*Math.PI*2,M=new G(s*.055,s*.05,s*.055);M.translate(g+Math.cos(w)*d*1.05,a+s*1.17,Math.sin(w)*d*1.05),n.push({geometry:M,color:U(h,.8),sway:0})}const p=e.int(0,4);for(let v=0;v<p;v++){const w=-r*.35+r*.7*(v+.5)/p;if(Math.abs(w-g)<d*1.6)continue;const M=s*e.range(.1,.16),S=s*e.range(.3,.6),E=new $(M,M,S,6);E.translate(w,a+s*.9+S/2,0),n.push({geometry:E,color:U(l,1.1),sway:0});const A=new $(M*1.6,M*1.6,M*.5,6);A.translate(w,a+s*.9+S,0),n.push({geometry:A,color:U(h,1.05),sway:0})}const _=vt(n);return t!==1&&_.scale(t,t,t),bt(_,"tank",0)}},dp={name:"vent",category:"structures",radius:.7,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.55,.85),r=e.range(.45,.7),o=e.range(.16,.26),a=e.range(.035,.055),c=1.7,l=U(8883859,e.range(.9,1.08)),h=e.chance(.4),u=c,f=u+r;for(const v of[-1,1]){const w=new G(a,r,o);w.translate(v*(s-a)/2,u+r/2,0),n.push({geometry:w,color:l,sway:0});const M=new G(s,a*.92,o*.98);M.translate(0,v<0?u+a*.46:f-a*.46,0),n.push({geometry:M,color:U(l,.94),sway:0})}const d=new G(s*1.14,a*.8,o*1.5);d.rotateX(-.14),d.translate(0,f+a*.4,o*.2),n.push({geometry:d,color:U(l,1.12),sway:0});const g=r-a*2.2,y=Math.max(3,Math.round(g/e.range(.055,.085))),m=g/y,p=m*.42;for(let v=0;v<y;v++){const w=u+a*1.1+m*(v+.5),M=new G(s-a*2.2,p,o*.66);M.rotateX(e.range(.5,.72)),M.translate(0,w,o*.1-v/y*o*.24),n.push({geometry:M,color:h&&e.chance(.3)?U(I.RUST,.95):U(l,1.06),sway:0})}if(s>.7){const v=new G(a*.7,g,o*.5);v.translate(0,u+r/2,-o*.06),n.push({geometry:v,color:U(l,.88),sway:0})}const _=vt(n);return t!==1&&_.scale(t,t,t),bt(_,"vent",0)}},fp={name:"railing",category:"structures",radius:1.5,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(2.2,3.2),r=e.range(1.04,1.14),o=e.range(.021,.028),a=o*e.range(1.05,1.25),c=e.chance(.55),l=U(c?12097838:9278618,e.range(.92,1.08)),h=U(I.IRON,e.range(.85,1.05)),u=Math.max(2,Math.round(s/e.range(1.1,1.5)));for(let y=0;y<=u;y++){const m=-s/2+s*y/u,p=new $(a*.92,a,r,6);p.translate(m,r/2,0),n.push({geometry:p,color:l,sway:0});const _=new G(a*4.6,a*.7,a*4.6);_.translate(m,a*.35,0),n.push({geometry:_,color:U(h,.88),sway:0})}for(const y of[r-o,r*e.range(.48,.56)]){const m=new $(o,o,s+a*2.4,8);m.rotateZ(Math.PI/2),m.translate(0,y,0),n.push({geometry:m,color:l,sway:0})}for(const y of[-1,1]){const m=new $(o*1.1,o*1.1,o*1.6,8);m.rotateZ(Math.PI/2),m.translate(y*(s+a*2.4)/2,r-o,0),n.push({geometry:m,color:U(l,.9),sway:0})}const f=e.range(.1,.15),d=new G(s,f,o*.7);d.translate(0,f/2+e.range(.005,.02),a*.8),n.push({geometry:d,color:U(l,.86),sway:0});const g=vt(n);return t!==1&&g.scale(t,t,t),bt(g,"railing",0)}},pp={name:"chainlink",category:"structures",radius:1.6,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(2.4,3.2),r=e.range(1.8,2.4),o=e.range(.04,.055),a=U(9278618,e.range(.92,1.08)),c=U(10133926,e.range(.9,1.1));for(const p of[-1,1]){const _=new $(o,o*1.06,r,6);_.translate(p*s/2,r/2,0),n.push({geometry:_,color:a,sway:0});const v=new $(o*1.15,o*1.15,o*.5,6);v.translate(p*s/2,r+o*.2,0),n.push({geometry:v,color:U(a,.9),sway:0})}const l=[r-o*1.4];e.chance(.75)&&l.push(o*1.6);for(const p of l){const _=new $(o*.62,o*.62,s,6);_.rotateZ(Math.PI/2),_.translate(0,p,0),n.push({geometry:_,color:U(a,1.05),sway:0})}const h=e.range(.2,.26),u=e.range(.008,.011),f=l[0],d=l.length>1?l[1]:0,g=f-d,y=s/2;for(const p of[1,-1])for(let _=-y-g;_<=y+g;_+=h){const v=Math.max(-y,Math.min(y,_)),w=Math.max(-y,Math.min(y,_+p*g));if(Math.abs(w-v)<.001)continue;const M=d+Math.abs(v-_),S=d+Math.abs(w-_),E=Math.hypot(w-v,S-M),A=new G(u,E,u);A.rotateZ(-Math.atan2(w-v,S-M)),A.translate((v+w)/2,(M+S)/2,p>0?u:-u),n.push({geometry:A,color:c,sway:0})}const m=vt(n);return t!==1&&m.scale(t,t,t),bt(m,"chainlink",0)}},Tb=6.5,Rb=15,Cb=1.3,i0=16747068,Pb=16758371,qs=2236445,mp={name:"fireplace",category:"structures",radius:1.2,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=[],r=e.range(1.35,2),o=e.range(.42,.62),a=r*e.range(.46,.58),c=e.range(.62,.85),l=e.range(.14,.22),h=e.range(.07,.1),u=c+l,f=u+h/2-e.range(.012,.03),d=e.range(2.1,2.5),g=e.range(.3,1),y=e.chance(.5)?U(e.chance(.5)?8014392:7029814,e.range(.92,1.1)):U(I.STONE,e.range(.86,1.02)),m=e.chance(.55),p=m?U(I.TIMBER_DARK,e.range(.9,1.1)):U(y,.92),_=(r-a)/2,v=.07,w=e.range(.3,.5),M=new G(r+e.range(.2,.4),v,o+w);M.translate(0,v/2,(o+w)/2),n.push({geometry:M,color:U(I.STONE_DARK,e.range(.9,1.05)),sway:0});const S=e.int(3,5);for(const K of[-1,1])for(let Y=0;Y<S;Y++){const rt=(u-v)/S,pt=_*(1-Y*.014),wt=o*(1-Y*.02),Ft=new G(pt,rt,wt);Ft.translate(K*(a+_)/2,v+rt*(Y+.5),wt/2),n.push({geometry:Ft,color:U(y,e.range(.88,1.12)),sway:0})}const E=new G(a+_*.7,l,o*1.04);E.translate(0,c+l/2,o*1.04/2),n.push({geometry:E,color:p,sway:0});const A=new G(a*1.02,c*1.02,.09);A.translate(0,v+c*1.02/2-.02,.05),n.push({geometry:A,color:qs,sway:0});for(const K of[-1,1]){const Y=new G(.07,c*.98,o*.82);Y.rotateY(K*.16),Y.translate(K*a/2-K*.02,v+c*.98/2,o*.44),n.push({geometry:Y,color:U(qs,e.range(1.1,1.5)),sway:0})}const x=new G(a*.96,.08,o*.9);x.rotateX(.22),x.translate(0,c-.05,o*.44),n.push({geometry:x,color:U(qs,1.25),sway:0});const b=o+e.range(.06,.14),T=new G(r+e.range(.1,.2),h,b);T.translate(0,f,b/2-.02),n.push({geometry:T,color:m?U(I.TIMBER,e.range(.95,1.1)):U(y,1.12),sway:0});const P=e.int(2,4);for(let K=0;K<P;K++){const Y=K/P,rt=(K+1)/P,pt=(d-f)/P,wt=r*(.9-Y*.3)*e.range(.98,1.02),Ft=o*(.86-Y*.24),nt=new G(wt,pt*(1+(rt-Y)*.1),Ft);nt.translate(0,f+pt*(K+.5),Ft/2),n.push({geometry:nt,color:U(y,e.range(.9,1.08)),sway:0})}const C=v+.06;for(const K of[-1,1]){const Y=new G(.035,.05,o*.44);Y.translate(K*a/2*e.range(.5,.62),C,o*.34),n.push({geometry:Y,color:U(I.IRON,.8),sway:0});const rt=new G(.04,.16,.042);rt.translate(K*a/2*e.range(.5,.62),C+.09,o*.16),n.push({geometry:rt,color:U(I.IRON,.9),sway:0})}const F=o*.34,N=v+.15,D=e.int(3,5);for(let K=0;K<D;K++){const Y=e.range(.045,.075),rt=a*e.range(.5,.78),pt=new $(Y,Y*e.range(.85,.98),rt,6);pt.rotateZ(Math.PI/2),pt.rotateY(e.range(-.5,.5)),pt.rotateZ(e.range(-.14,.14));const wt=v+.09+K*e.range(.05,.08);pt.translate(e.around(0,a*.08),wt,F+e.around(0,.05));const Ft=U(I.BARK,e.range(.85,1.15)),ht=e.chance(g*.9)&&K<D-1?9320990:qs,k=wt+Y*.15;n.push({geometry:pt,color:(ft,st)=>st<k?ht:Ft,sway:0})}const B=e.int(5,9);for(let K=0;K<B;K++){const Y=e.range(.025,.05),rt=new te(Y,0);rt.rotateY(e.range(0,Math.PI)),rt.translate(e.around(0,a*.3),v+Y*.6,F+e.around(0,o*.16)),n.push({geometry:rt,color:e.chance(g*.5)?10239780:U(qs,e.range(.9,1.4)),sway:0})}const H=new ke(a*.3*(.6+g*.55),0);H.scale(1,.3,.55),H.translate(0,N-.05,F),s.push({geometry:H,color:i0,sway:0});const V=2+(e.chance(g)?1:0);for(let K=0;K<V;K++){const Y=a*e.range(.07,.12)*(.5+g*.7),rt=new ke(Y,0);rt.scale(1,e.range(2.2,3.4),1),rt.translate(e.around(0,a*.2),N+Y*e.range(1.4,2.2),F+e.around(0,.04)),s.push({geometry:rt,color:Pb,sway:0})}const et=a*.55,lt=new ke(et,1);lt.scale(1,.9,.6),lt.translate(0,N+.06,F),s.push({geometry:lt,color:(K,Y,rt)=>{const pt=Math.hypot(K,(Y-N-.06)/.9,(rt-F)/.6)/et;return Ib(i0,Math.max(0,.3*(.4+g*.6)*(1-pt)))},sway:0});const Mt=vt(n),Lt=vt(s);t!==1&&(Mt.scale(t,t,t),Lt.scale(t,t,t));const J=bt(Mt,"fireplace",0);J.add(Mn(Lt,"fireplace:glow"));const ot=new zi(16750149,Tb*(.4+g*.8)*e.around(1,.1)*t*t,Rb*t,Cb);return ot.position.set(0,(N+.06)*t,o*.62*t),ot.castShadow=!1,J.add(ot),J}};function Ib(i,t){const e=t<0?0:t>1?1:t,n=Math.round((i>>16&255)*e),s=Math.round((i>>8&255)*e),r=Math.round((i&255)*e);return n<<16|s<<8|r}const Lb=3.4,Db=12,vc=16748354,Nb=16747068,Ub=[I.IRON_DARK,2435114,14077364,3362879,7024424],gp={name:"stove",category:"furniture",radius:.5,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=[],r=e.range(.4,.56),o=e.range(.33,.46),a=e.range(.44,.6),c=e.range(.1,.18),l=c+a/2,h=o/2,u=U(e.pick(Ub),e.range(.92,1.08)),f=U(I.IRON,e.range(.82,1.02)),d=e.range(.35,1);for(const k of[-1,1])for(const ft of[-1,1]){const st=e.range(.032,.042),gt=new $(st,st*e.range(1.15,1.4),c*1.12,5);gt.rotateZ(k*-.08),gt.rotateX(ft*.08),gt.translate(k*(r-st*3)/2,c*1.12/2,ft*(o-st*3)/2),n.push({geometry:gt,color:f,sway:0})}const g=new G(r,a,o);g.translate(0,l,0),n.push({geometry:g,color:u,sway:0});const y=new G(r*1.04,.045,o*.24);y.translate(0,c+.035,h*e.range(.9,1.02)),n.push({geometry:y,color:U(f,.9),sway:0});const m=e.range(.028,.04),p=new G(r+.055,m,o+.05);p.translate(0,c+a-m*.35,0),n.push({geometry:p,color:U(f,1.06),sway:0});const _=.022,v=c+a+m*.5,w=r+.055,M=o+.05;for(const[k,ft,st,gt]of[[w-_,_,0,-M/2+_*.8],[_,o*.86,-w/2+_*.8,0],[_,o*.82,w/2-_*.8,0]]){const yt=new G(k,.028,ft);yt.translate(st,v-.006,gt),n.push({geometry:yt,color:U(f,1.14),sway:0})}const S=r*e.range(.6,.72),E=a*e.range(.5,.62),A=l+a*e.range(.02,.1),x=new G(S,E,.016);x.translate(0,A,h+.005),n.push({geometry:x,color:_c(vc,.45+d*.5),sway:0});const b=h+.032,T=.038;for(const k of[-1,1]){const ft=new G(S+T*2.1,T,.03);ft.translate(0,A+k*E/2,b),n.push({geometry:ft,color:f,sway:0});const st=new G(T*.92,E+T*.4,.028);st.translate(k*S/2,A,b*.999),n.push({geometry:st,color:U(f,1.08),sway:0})}const P=e.chance(.5)?-1:1;for(const k of[-.3,.3]){const ft=new G(.03,.05,.04);ft.translate(P*(S+T*2.1)/2,A+E*k,b+.006),n.push({geometry:ft,color:U(f,.86),sway:0})}const C=-P*(S+T*2.4)/2,F=new $(.012,.012,.05,6);F.rotateX(Math.PI/2),F.translate(C,A,b+.025),n.push({geometry:F,color:U(f,1.1),sway:0});const N=new G(.026,.1,.026);N.rotateZ(e.range(-.4,.4)),N.translate(C,A,b+.056),n.push({geometry:N,color:U(f,.94),sway:0});const D=new $(.03,.03,.018,6);D.rotateX(Math.PI/2),D.rotateZ(e.range(0,Math.PI)),D.translate(e.around(0,r*.18),A-E*.5-.055,h+.012),n.push({geometry:D,color:U(f,1.12),sway:0});const B=e.range(.055,.075),H=e.range(.05,.075),V=-o*e.range(.08,.2),et=new $(B*1.3,B*1.45,H,8);et.translate(0,v+H*.4,V),n.push({geometry:et,color:U(f,.9),sway:0});const lt=e.chance(.45),Mt=lt?e.range(1.5,1.95):e.range(2.35,2.7),Lt=v+H*.5,J=new $(B,B*1.03,Mt-Lt,8);J.translate(0,(Mt+Lt)/2,V),n.push({geometry:J,color:U(f,.96),sway:0});const ot=new $(B*1.22,B*1.22,B*.5,8);if(ot.translate(0,Lt+(Mt-Lt)*e.range(.4,.6),V),n.push({geometry:ot,color:U(f,1.1),sway:0}),lt){const k=e.range(.45,.7),ft=new $(B*.98,B*.98,k,8);ft.rotateX(Math.PI/2),ft.translate(0,Mt-B*.9,V-k/2+B*.4),n.push({geometry:ft,color:U(f,.92),sway:0});const st=new $(B*1.18,B*1.18,B*.55,8);st.rotateX(Math.PI/2),st.translate(0,Mt-B*.9,V-k+B*.6),n.push({geometry:st,color:U(f,1.08),sway:0})}if(e.chance(.6)){const k=new G(r+e.range(.16,.3),.014,o+e.range(.24,.42));k.translate(0,.007,e.range(.04,.12)),n.push({geometry:k,color:U(I.IRON_DARK,e.range(.9,1.15)),sway:0})}const K=h+.022,Y=new G(S*.78,E*.6,.02);Y.translate(0,A-E*.1,K),s.push({geometry:Y,color:_c(vc,.55+d*.45),sway:0});const rt=Math.max(S,E)*.85,pt=new ke(rt,1);pt.scale(1,.85,.55),pt.translate(0,A-E*.08,K+.03),s.push({geometry:pt,color:(k,ft,st)=>{const gt=Math.hypot(k,(ft-A+E*.08)/.85,(st-K-.03)/.55)/rt;return _c(vc,Math.max(0,.26*(.4+d*.6)*(1-gt)))},sway:0});const wt=vt(n),Ft=vt(s);t!==1&&(wt.scale(t,t,t),Ft.scale(t,t,t));const nt=bt(wt,"stove",0);nt.add(Mn(Ft,"stove:glow"));const ht=new zi(Nb,Lb*(.45+d*.75)*e.around(1,.12)*t*t,Db*t,Th);return ht.position.set(0,A*t,(h+.06)*t),ht.castShadow=!1,nt.add(ht),nt}};function _c(i,t){const e=t<0?0:t>1?1:t,n=Math.round((i>>16&255)*e),s=Math.round((i>>8&255)*e),r=Math.round((i&255)*e);return n<<16|s<<8|r}const Fb=.1,Ob=1.45,s0=1.3,r0=9,zb=4.5,kb=16,Bb=1.5;function Hb(i,t,e){const n=i.userData.window;if(!n)return;const s=kl(t,-s0,s0),r=kl(e,Fb,Ob);n.azimuth=s,n.elevation=r;const o=Math.cos(r),a=Math.sin(s)*o,c=-Math.sin(r),l=Math.cos(s)*o,h=n.centreY/Math.sin(r),u=Math.min(h,r0),f=i.getObjectByName("window:shaft");f&&(f.matrixAutoUpdate=!1,f.matrix.set(1,0,a*u,0,0,1,c*u,0,0,0,l*u,0,0,0,0,1),f.matrixWorldNeedsUpdate=!0);const d=i.getObjectByName("window:pool");if(d){const g=n.height/Math.sin(r);d.matrixAutoUpdate=!1,d.matrix.set(n.width,0,g*a,h*a,0,1,0,0,0,0,g*l,h*l,0,0,0,1),d.matrixWorldNeedsUpdate=!0,d.visible=h<=r0}}const zl={name:"window",category:"structures",radius:1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=[],r=e.chance(.6),o=r&&e.chance(.35),a=e.range(.66,1.1),c=e.range(.8,1.3),l=e.range(.85,1.15),h=l+c/2,u=e.range(.09,.14),f=e.range(.1,.16),d=e.chance(.72),g=d?16773586:14477558,y=d?16769966:12505832,m=U(e.chance(.55)?I.TIMBER:I.TIMBER_DARK,e.range(.9,1.08)),p=U(I.STONE_DARK,e.range(.9,1.1)),_=new G(a+.024,c+.024,.018);_.translate(0,h,.011),n.push({geometry:_,color:g,sway:0});const v=c+u*2.4;for(const K of[-1,1]){const Y=new G(u,v,f);Y.translate(K*(a+u)/2,h,f/2),n.push({geometry:Y,color:m,sway:0})}const w=new G(a+u*2+.1,u*.92,f*1.06);w.translate(0,l+c+u*.46,f*.5),n.push({geometry:w,color:U(m,.92),sway:0});const M=new G(a+u*2+.17,.068,f*1.9);if(M.rotateX(-.07),M.translate(0,l-.028,f*.6),n.push({geometry:M,color:p,sway:0}),e.chance(.5))for(const K of[-1,1]){const Y=new G(.07,.13,f*1.25);Y.translate(K*a/2,l-.1,f*.62),n.push({geometry:Y,color:U(p,.88),sway:0})}const S=.028,E=f*.82;for(const K of[-1,1]){const Y=new G(a+S*1.4,S,S*1.1);Y.translate(0,h+K*c/2,E),n.push({geometry:Y,color:U(m,1.08),sway:0});const rt=new G(S*.9,c-S*1.6,S);rt.translate(K*a/2,h,E*.97),n.push({geometry:rt,color:U(m,1.12),sway:0})}const A=e.int(2,3),x=e.int(2,3),b=f*.62;for(let K=1;K<A;K++){const Y=new G(.026,c,.03);Y.translate(-a/2+a*K/A,h,b),n.push({geometry:Y,color:U(m,1.02),sway:0})}for(let K=1;K<x;K++){const Y=new G(a,.023,.027);Y.translate(0,l+c*K/x,b*1.02),n.push({geometry:Y,color:U(m,.96),sway:0})}if(r){const K=e.chance(.5)?U(I.CLOTH,e.range(.85,1.05)):U(I.WOOL,e.range(.85,1.05)),Y=l+c+e.range(.04,.09),rt=e.range(.05,.08),pt=c*e.range(.94,1.06),wt=new $(.016,.016,a+u*2.2,6);wt.rotateZ(Math.PI/2),wt.translate(0,Y,rt),n.push({geometry:wt,color:U(I.TIMBER_DARK,.95),sway:0});for(const Ft of[-1,1]){const nt=o?a*e.range(.52,.56):a*e.range(.2,.3),ht=o?e.range(.022,.032):e.range(.05,.08),k=o?Ft*(a/2-nt/2):Ft*(a/2-nt*e.range(.3,.45)),ft=new G(nt,pt,ht);ft.translate(k,Y-pt/2-.01,rt+ht*.5),n.push({geometry:ft,color:K,sway:0});const st=new G(nt*1.02,.05,ht*1.15);if(st.translate(k,Y,rt+ht*.5),n.push({geometry:st,color:U(K,.88),sway:0}),!o){const gt=new G(nt*1.15,.05,ht*1.2);gt.translate(k,Y-pt*e.range(.45,.6),rt+ht*.5),n.push({geometry:gt,color:U(K,.78),sway:0})}}}const T=o?.07:1,P=o?.3:1,C=new G(a*.97,c*.97,.012);C.translate(0,h,.026),s.push({geometry:C,color:go(g,P),sway:0});const F=new ke(1,1);F.scale(a*.85,c*.8,.3),F.translate(0,h,.05);const N=Math.max(a,c)*.85;s.push({geometry:F,color:(K,Y)=>{const rt=Math.hypot(K/N,(Y-h)/N);return go(g,Math.max(0,.3*P*(1-rt)))},sway:0});const D=a*.94,B=c*.94,H=vt([{geometry:(()=>{const K=new G(D,B,1,1,1,12);return K.translate(0,h,.5),K})(),color:(K,Y,rt)=>go(g,.22*Math.max(0,1-rt)**1.35),sway:0}]),V=.014,et=vt([{geometry:(()=>{const K=new G(1,.012,1,4,1,4);return K.translate(0,V,0),K})(),color:(K,Y,rt)=>{const pt=Math.max(Math.abs(K),Math.abs(rt))*2;return go(g,.62*(1-Gb(.6,1.02,pt)))},sway:0}]),lt=vt(n),Mt=vt(s);t!==1&&(lt.scale(t,t,t),Mt.scale(t,t,t),H.scale(t,t,1),et.scale(1,t,1));const Lt=bt(lt,"window",0);Lt.add(Mn(Mt,"window:glow"));const J={width:D*t,height:B*t,centreY:h*t,openness:T,azimuth:0,elevation:.6};if(Lt.userData.window=J,o)H.dispose(),et.dispose();else{const K=Mn(H,"window:shaft");K.matrixAutoUpdate=!1,Lt.add(K);const Y=Mn(et,"window:pool");Y.matrixAutoUpdate=!1,Lt.add(Y)}const ot=new zi(y,zb*T*e.around(1,.1)*t*t,kb*t,Bb);return ot.name="window:sun",ot.position.set(0,h*t,f*t+.25),ot.castShadow=!1,Lt.add(ot),Hb(Lt,e.range(-.7,.7),e.range(.38,.95)),Lt}};function kl(i,t,e){return i<t?t:i>e?e:i}function Gb(i,t,e){const n=kl((e-i)/Math.max(t-i,1e-6),0,1);return n*n*(3-2*n)}function go(i,t){const e=t<0?0:t>1?1:t,n=Math.round((i>>16&255)*e),s=Math.round((i>>8&255)*e),r=Math.round((i&255)*e);return n<<16|s<<8|r}const yp={name:"dresser",category:"furniture",radius:.7,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.92,1.24),r=e.range(.44,.56),o=e.range(.86,1.14),a=e.chance(.55)?I.TIMBER:I.TIMBER_DARK,c=a===I.TIMBER?I.TIMBER_DARK:I.TIMBER_PALE,l=e.chance(.45)?I.IRON:U(c,1.15),h=e.range(.07,.11),u=e.range(.03,.045),f=new G(s*.96,h,r*.94);f.translate(0,h/2,r/2),n.push({geometry:f,color:U(c,.86),sway:0});const d=o-h-u,g=new G(s,d+.03,r);g.translate(0,h+d/2,r/2),n.push({geometry:g,color:U(a,e.range(.95,1.05)),sway:0});const y=e.range(.015,.03),m=new G(s+y*2,u+.02,r+y);m.translate(0,o-u/2,r/2+y/2),n.push({geometry:m,color:U(c,e.range(.95,1.08)),sway:0});const p=e.int(4,6),_=r+e.range(.012,.02),v=e.range(.02,.035),w=.012,M=e.range(1.1,1.45),S=[];for(let T=0;T<p;T++)S.push(M**T);const E=S.reduce((T,P)=>T+P,0),A=d-w*(p+1);let x=h+w;for(let T=p-1;T>=0;T--){const P=A*S[T]/E,C=new G(s-v*2,P,.026);C.translate(0,x+P/2,_),n.push({geometry:C,color:U(a,e.range(.9,1.12)),sway:0});const N=s>1.05&&P<d*.26?[-s*.22,s*.22]:[0];for(const D of N){const B=new $(e.range(.017,.024),e.range(.013,.018),e.range(.03,.045),6);B.rotateX(Math.PI/2),B.translate(D,x+P/2,_+.02),n.push({geometry:B,color:U(l,e.range(.92,1.1)),sway:0})}x+=P+w}const b=vt(n);return t!==1&&b.scale(t,t,t),bt(b,"dresser",0)}},vp={name:"chest",category:"furniture",radius:.6,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.82,1.08),r=e.range(.44,.56),o=e.range(.04,.075),a=e.range(.3,.4),c=e.range(.055,.075),l=e.chance(.45),h=e.chance(.5)?I.TIMBER_DARK:I.BARK_PALE,u=U(I.IRON,e.range(.82,1)),d=e.chance(.35)?I.RUST:u;e();const g=o,y=g+a;if(e.chance(.35))for(const N of[-1,1]){const D=new G(s*e.range(.92,.97),o+.015,r*.16);D.translate(0,(o+.015)/2,N*(r-r*.16)/2),n.push({geometry:D,color:U(h,.85),sway:0})}else for(const N of[-1,1])for(const D of[-1,1]){const B=e.range(.075,.1),H=new G(B,o+.015,B*e.range(.9,1.1));H.translate(N*(s-B)/2,(o+.015)/2,D*(r-B)/2),n.push({geometry:H,color:U(h,.85),sway:0})}const p=new G(s,a,r);p.translate(0,g+a/2,0),n.push({geometry:p,color:h,sway:0});const _=e.range(.05,.07);for(const N of[-1,1]){const D=new G(_*e.range(.95,1.05),a*1.02,r*1.03);D.translate(N*(s-_*.5)/2,g+a/2,0),n.push({geometry:D,color:U(h,.8),sway:0})}const v=e.int(2,3),w=s*e.range(.5,.66),M=[];for(let N=0;N<v;N++){const D=v===1?0:-w/2+N/(v-1)*w;M.push(D);for(const B of[-1,1]){const H=new G(e.range(.035,.055),a*e.range(.96,1.02),.014);H.translate(D,g+a/2,B*(r+.012)/2),n.push({geometry:H,color:d,sway:0})}}if(e.chance(.5)){const N=new G(s*1.02,e.range(.026,.038),r*1.02);N.translate(0,y-.035,0),n.push({geometry:N,color:U(d,.9),sway:0})}const S=e.range(.07,.1),E=new G(S,S*e.range(1,1.35),.016);E.translate(0,y-S*.75,r/2+.006),n.push({geometry:E,color:U(d,1.15),sway:0});const A=new G(.012,.022,.008);A.translate(0,y-S*.75,r/2+.016),n.push({geometry:A,color:I.IRON_DARK,sway:0});const x=y-.012,b=-r/2+.025,T=r-.025+.02,P=(N,D)=>{N.rotateX(-0),N.translate(0,x,b),n.push({geometry:N,color:D,sway:0})};if(l)for(let D=0;D<3;D++){const B=D/2,H=new G(s*(1.03-B*.22)*e.range(.99,1.01),c*.62,(T+.03)*(1-B*.26));H.translate(0,B*c*.52+c*.2,T/2-.005),P(H,U(h,1.05+D*.04))}else{const N=new G(s*1.03,c,T+.03);N.translate(0,c/2,T/2-.005),P(N,U(h,1.06))}for(const N of M){const D=new G(e.range(.035,.055),c*(l?1.5:1.05),T*e.range(.86,.96));D.translate(N,c*(l?.75:.5),T*.48),P(D,d)}const C=new G(S*.55,S*1.15,.014);C.translate(0,c*.35-S*.4,T+.012),P(C,U(d,1.2));for(const N of[-s*.3,s*.3]){const D=new $(.014,.014,e.range(.05,.07),6);D.rotateZ(Math.PI/2),D.translate(N,x,b-.006),n.push({geometry:D,color:U(d,.92),sway:0})}const F=vt(n);return t!==1&&F.scale(t,t,t),bt(F,"chest",0)}},_p={name:"washtub",category:"objects",radius:.5,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.34,.46),r=e.range(.26,.36),o=s*e.range(.72,.82),a=e.range(.028,.04),c=e.range(.04,.06),l=e.int(10,14),h=e.chance(.5)?I.TIMBER:I.TIMBER_DARK,u=U(I.IRON,e.range(.85,1.05)),f=[new tt(0,0),new tt(o,.006),new tt(s,r),new tt(s-a*.8,r),new tt(o-a,c),new tt(0,c)];n.push({geometry:new Zn(f,l),color:h,sway:0});const d=p=>o+(s-o)*p;for(const p of[e.range(.16,.26),e.range(.72,.84)]){const _=e.range(.03,.045),v=d(p-_/(2*r))*1.03,w=d(p+_/(2*r))*1.03,M=new $(w,v,_,l);M.translate(0,r*p,0),n.push({geometry:M,color:u,sway:0})}const g=e.chance(.7),y=r*e.range(.35,.6);if(g){const p=d(y/r)-a,_=new $(p,p*.96,.02,l);_.translate(0,y,0),n.push({geometry:_,color:I.WATER,sway:0})}const m=vt(n);return t!==1&&m.scale(t,t,t),bt(m,"washtub",0)}};function Bt(i,t,e,n=e,s=4){wc.copy(t).sub(i);const r=wc.length();if(r<1e-6)return new $(e,e,1e-4,s);const o=new $(n,e,r,s);return o.translate(0,r/2,0),o.applyQuaternion(Wb.setFromUnitVectors(Vb,wc.divideScalar(r))),o.translate(i.x,i.y,i.z),o}const Vb=new R(0,1,0),wc=new R,Wb=new $n,wp={name:"broom",category:"objects",radius:.4,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(1.15,1.45),r=0,o=0,a=U(e.chance(.5)?I.BARK_PALE:I.TIMBER,e.range(.9,1.1)),c=e.pick([I.LEAF_DRY,I.GRASS_DRY,I.BARK]),l=e.chance(.6)?I.CLOTH:I.IRON,h=new R(Math.sin(r)*Math.cos(o),Math.cos(r),Math.sin(r)*Math.sin(o)),u=E=>h.clone().multiplyScalar(E),f=new R().crossVectors(h,new R(0,0,1)).normalize(),d=new R().crossVectors(h,f).normalize(),g=(E,A)=>f.clone().multiplyScalar(Math.cos(E)*A).add(d.clone().multiplyScalar(Math.sin(E)*A)),y=e.range(.26,.38),m=e.range(.07,.13),p=-1,_=y+.03,v=y*.35,w=s;n.push({geometry:Bt(u(v),u(w),e.range(.014,.019),e.range(.011,.015),6),color:a,sway:0});const M=e.int(24,34);for(let E=0;E<M;E++){const A=u(_+p*e.range(0,y*.35)),x=Math.PI*2/M,b=E*x+e.range(0,x*.6),T=e.range(.72,1.05),P=u(_+p*y*T).add(g(b,m*e.range(.35,1)*T));P.y=Math.max(P.y,e.range(.004,.018)),n.push({geometry:Bt(A.add(g(b,e.range(.006,.011))),P,e.range(.009,.014),.005,4),color:U(c,e.range(.82,1.18)),sway:0})}for(const E of[e.range(.02,.08),e.range(.18,.3)]){const A=_+p*y*E,x=e.range(.015,.024);n.push({geometry:Bt(u(A-x),u(A+x),e.range(.028,.036),e.range(.028,.036),8),color:U(l,e.range(.9,1.1)),sway:0})}for(const E of n)E.geometry.translate(0,.02,0);const S=vt(n);return t!==1&&S.scale(t,t,t),bt(S,"broom",0)}},xp={name:"hanging-herbs",category:"objects",radius:.7,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(1.68,1.9),r=e.range(.8,1.35),o=e.range(.08,.12),a=U(I.BARK_PALE,e.range(.9,1.1)),c=new R(-r/2,s,o),l=new R(r/2,s,o);n.push({geometry:Bt(c,l,e.range(.016,.022),e.range(.016,.022),6),color:a,sway:0});for(const g of[c,l]){const y=new R(g.x,s+e.range(.05,.09),.012);n.push({geometry:Bt(y,g.clone(),e.range(.014,.019),.012,5),color:U(a,.88),sway:0});const m=new G(.05,e.range(.06,.09),.024);m.translate(g.x,y.y,.012),n.push({geometry:m,color:U(a,.8),sway:0})}const h=(g,y)=>(m,p)=>{const _=Math.max(0,Math.min(1,(s-p)/Math.max(g,1e-6)));return _*_*(3-2*_)*y},u=e.int(2,4),f=r*.82;for(let g=0;g<u;g++){const y=-f/2+(g+.5)/u*f+e.around(0,f/(u*3)),m=s+e.around(0,.006),p=o+e.around(0,.004);if(e.chance(.68)){const _=e.range(.24,.42),v=e.range(.05,.1),w=e.pick([I.LEAF_DRY,I.LEAF_DARK,I.GRASS_DRY,I.LEAF]),M=new $(.026,.021,e.range(.03,.045),5);M.translate(y,m,p),n.push({geometry:M,color:I.CLOTH,sway:h(_,.06)});const S=e.int(3,5);for(let E=0;E<S;E++){const A=E/S*Math.PI*2+e.range(0,.6),x=e.range(.72,1),b=new R(y+Math.cos(A)*.008,m-.01,p+Math.sin(A)*.008),T=new R(y+Math.cos(A)*v*x,m-_*x,p+Math.sin(A)*v*x);n.push({geometry:Bt(b,T,e.range(.006,.009),.004,4),color:U(w,e.range(.8,1.05)),sway:h(_,e.range(.2,.32))});const P=e.int(1,2);for(let C=0;C<P;C++){const F=e.range(.45,.95),N=new G(e.range(.03,.055),e.range(.05,.1),e.range(.022,.04));N.rotateY(A),N.translate(b.x+(T.x-b.x)*F,b.y+(T.y-b.y)*F,b.z+(T.z-b.z)*F),n.push({geometry:N,color:U(w,e.range(.75,1.15)),sway:h(_,e.range(.24,.36))})}}}else{const _=e.int(4,7),v=e.range(.055,.08),w=v*_+.06,M=e.pick([I.MARKER_YELLOW,I.HIDE_PALE,I.WOOL,I.RUST]);n.push({geometry:Bt(new R(y,m+.03,p),new R(y+e.around(0,.02),m-w,p+e.around(0,.02)),.008,.006,4),color:I.CLOTH,sway:h(w,.28)});for(let S=0;S<_;S++){const E=m-.05-S*v,A=(S%2*2-1)*e.range(.012,.03),x=new te(e.range(.028,.042),0);x.scale(1,e.range(.8,1.05),1),x.translate(y+A,E,p+e.around(0,.012)),n.push({geometry:x,color:U(M,e.range(.85,1.12)),sway:h(w,e.range(.15,.26))})}}}const d=vt(n);return t!==1&&d.scale(t,t,t),bt(d,"hanging-herbs",0)}},Mp={name:"spinning-wheel",category:"furniture",radius:.5,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.62,.78),r=e.range(.13,.17),o=e.range(.038,.05),a=e.range(.05,.12),c=e.range(.42,.48),l=rt=>c-rt*Math.tan(a),h=e.chance(.5)?I.TIMBER:I.TIMBER_DARK,u=h===I.TIMBER?I.TIMBER_DARK:I.TIMBER_PALE,f=U(I.IRON,e.range(.85,1.05)),d=new G(s/Math.cos(a),o,r);d.rotateZ(-a),d.translate(0,c-o*Math.cos(a)/2,0),n.push({geometry:d,color:h,sway:0});const g=[[s*.32,r*.38,.34,.94],[s*.32,-r*.38,.34,-.94],[-s*.36,e.around(0,.015),-1,0]];for(const[rt,pt,wt,Ft]of g){const nt=e.range(.05,.09),ht=new R(rt,l(rt)-.018,pt),k=new R(rt+wt*nt,0,pt+Ft*nt);n.push({geometry:Bt(k,ht,e.range(.015,.019),e.range(.012,.016),5),color:u,sway:0})}const y=e.range(.2,.28),m=s*e.range(.28,.34),p=y*e.range(1.04,1.14),_=e.range(.05,.065),v=new R(m,l(m)+p,0);for(const rt of[-1,1]){const pt=rt*_;n.push({geometry:Bt(new R(m+e.around(0,.006),l(m)-.02,pt),new R(v.x,v.y,pt),e.range(.02,.026),e.range(.012,.016),5),color:u,sway:0})}const w=new $(.011,.011,_*2+.04,5);w.rotateX(Math.PI/2),w.translate(v.x,v.y,v.z),n.push({geometry:w,color:f,sway:0});const M=e.range(.028,.036),S=new $(M,M,e.range(.05,.07),6);S.rotateX(Math.PI/2),S.translate(v.x,v.y,v.z),n.push({geometry:S,color:u,sway:0});const E=new Oi(y,e.range(.013,.019),4,14);E.translate(v.x,v.y,v.z),n.push({geometry:E,color:h,sway:0});const A=e.int(6,10),x=e.range(0,Math.PI*2);for(let rt=0;rt<A;rt++){const pt=x+rt/A*Math.PI*2,wt=Math.cos(pt),Ft=Math.sin(pt);n.push({geometry:Bt(new R(v.x+wt*M*.9,v.y+Ft*M*.9,0),new R(v.x+wt*(y-.005),v.y+Ft*(y-.005),0),e.range(.007,.009),e.range(.005,.007),4),color:u,sway:0})}const b=s*e.range(.06,.16),T=e.around(0,.025),P=e.range(.2,.28),C=new G(P,.02,e.range(.09,.13));C.rotateZ(e.around(0,.07)),C.translate(b,e.range(.03,.045),T),n.push({geometry:C,color:h,sway:0});const F=new G(.03,.035,r*1.1);F.translate(b-P/2,.02,T),n.push({geometry:F,color:U(h,.85),sway:0});const N=e.range(0,Math.PI*2),D=e.range(.028,.042);n.push({geometry:Bt(new R(b+P*.36,.05,T+.02),new R(v.x+Math.cos(N)*D,v.y+Math.sin(N)*D,_+.02),.008,.007,4),color:u,sway:0});const B=-s*e.range(.26,.34),H=l(B),V=new G(e.range(.09,.12),.05,e.range(.06,.08));V.translate(B,H+.015,0),n.push({geometry:V,color:U(h,1.06),sway:0});const et=e.range(.11,.15),lt=H+.03+et,Mt=e.range(.06,.085);for(const rt of[-1,1]){const pt=new R(B+rt*Mt,H+.01,0);n.push({geometry:Bt(pt,new R(pt.x,lt,0),e.range(.015,.019),e.range(.009,.012),5),color:u,sway:0})}n.push({geometry:Bt(new R(B-Mt,lt,0),new R(B+Mt+.05,lt+.004,0),.007,.006,4),color:f,sway:0});const Lt=new $(e.range(.02,.028),e.range(.02,.028),.07,7);Lt.rotateZ(Math.PI/2),Lt.translate(B,lt,0),n.push({geometry:Lt,color:U(e.pick([I.WOOL,I.CLOTH,I.HIDE_PALE]),e.range(.95,1.1)),sway:0});const J=B+Mt+.03,ot=e.range(.026,.034),K=new $(ot,ot,.013,8);K.rotateZ(Math.PI/2),K.translate(J,lt,0),n.push({geometry:K,color:u,sway:0});for(const rt of[-1,1])n.push({geometry:Bt(new R(v.x,v.y+rt*y,0),new R(J,lt+rt*ot,0),.005,.004,4),color:U(I.CLOTH,.85),sway:0});if(e.chance(.55)){const rt=B-e.range(.08,.13),pt=new R(rt,l(rt)-.01,e.around(0,.02)),wt=new R(rt-e.range(.03,.09),l(rt)+e.range(.42,.56),pt.z+e.around(0,.05));n.push({geometry:Bt(pt,wt,e.range(.016,.021),e.range(.009,.013),5),color:u,sway:0});const Ft=e.pick([I.WOOL,I.LEAF_DRY,I.CLOTH]),nt=new $(.026,.022,.03,6);nt.translate(wt.x,wt.y-.01,wt.z),n.push({geometry:nt,color:I.CLOTH,sway:0});const ht=e.int(4,6);for(let k=0;k<ht;k++){const ft=k/ht*Math.PI*2+e.range(0,.5),st=e.range(.03,.07);n.push({geometry:Bt(new R(wt.x+Math.cos(ft)*.01,wt.y-.02,wt.z+Math.sin(ft)*.01),new R(wt.x+Math.cos(ft)*st,wt.y+e.range(.05,.12),wt.z+Math.sin(ft)*st),e.range(.008,.013),e.range(.004,.007),4),color:U(Ft,e.range(.88,1.12)),sway:0})}}const Y=vt(n);return t!==1&&Y.scale(t,t,t),bt(Y,"spinning-wheel",0)}},o0=["coat","coat","hat","bag","rope"],Xb=new R(0,1,0),qb=new $n,bp={name:"wall-pegs",category:"furniture",radius:.65,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(1.5,1.76),r=e.range(.7,1.3),o=e.chance(.5)?I.TIMBER_DARK:I.BARK_PALE,a=new G(r,e.range(.08,.11),.028);a.translate(0,s,.014),n.push({geometry:a,color:o,sway:0});for(const m of[-1,1]){const p=new G(e.range(.05,.07),.14,.02);p.translate(m*r*.86/2,s,.008),n.push({geometry:p,color:U(o,.82),sway:0})}const c=e.int(3,6),l=r*.78,h=Array.from({length:c},(m,p)=>c===1?0:-l/2+p/(c-1)*l),u=e.int(0,c-1),f={coat:.22,hat:.19,rope:.17,bag:.14},d=new Array(c).fill(null),g=(m,p)=>{for(let _=0;_<c;_++){const v=d[_];if(v&&Math.abs(h[m]-h[_])<f[p]+f[v]+.03)return}d[m]=p};g(u,e.pick(o0));for(let m=0;m<c;m++)m===u||!e.chance(.62)||g(m,e.pick(o0));for(let m=0;m<c;m++){const p=h[m],_=new R(p,s-e.range(0,.012),.02),v=new R(p,s+e.range(.02,.04),e.range(.09,.13)),w=e.range(.013,.017),M=e.range(.017,.022);n.push({geometry:Bt(_,v,w,M,6),color:U(o,e.range(.95,1.15)),sway:0});const S=d[m];if(!S)continue;const E=v.z*.72;if(S==="coat"){const A=e.pick([I.CLOTH,I.WOOL,I.LEAF_DARK,I.HIDE,I.STONE_DARK]),x=e.range(.45,.8),b=e.range(.24,.34),T=e.int(3,5),P=(F,N)=>{const D=Math.max(0,Math.min(1,(s-N)/x));return D*D*(3-2*D)*.12};for(let F=0;F<T;F++){const N=F/(T-1),D=s-.02-N*x*.92,B=x*1.06/T,H=new G(b*(1-N*e.range(.18,.34)),B,e.range(.07,.12)*(1-N*.3));H.rotateY(e.around(0,.22)),H.rotateZ(e.around(0,.09)),H.translate(p+e.around(0,.02),D-B/2,E+e.around(0,.012)),n.push({geometry:H,color:U(A,e.range(.88,1.1)),sway:P})}const C=new G(b*.42,.06,.09);C.rotateY(e.around(0,.2)),C.translate(p,s+.005,E),n.push({geometry:C,color:U(A,1.14),sway:0})}else if(S==="hat"){const A=U(e.pick([I.HIDE_DARK,I.CLOTH,I.EARTH]),e.range(.9,1.1)),x=e.range(.13,.18),b=e.range(.1,.15),T=.011,P=e.range(.014,.02),C=x*.66,F=[new tt(C-T,0),new tt(x,0),new tt(x*.985,P),new tt(C,P),new tt(C*.95,b*.62),new tt(C*.7,b*.93),new tt(.006,b),new tt(.005,b-T*.8),new tt(C*.7-T*.8,b*.93-T*.5),new tt(C*.95-T,b*.62),new tt(C-T,P),new tt(C-T,0)],N=e.range(.06,.14),D=new R(0,-Math.sin(N),Math.cos(N)),B=x*Math.sin(N)+.014,H=Math.min(v.z-B,b*.45),V=(B-_.z)/(v.z-_.z),et=w+(M-w)*V,lt=H*((v.y-_.y)/(v.z-_.z)+Math.tan(N)),Mt=(C-T)*(1-.35*(H/b)**2),Lt=Math.max(0,Mt-et-lt-.004),J=new R(p,_.y+(v.y-_.y)*V-Lt,B),ot=new Zn(F,8);ot.applyQuaternion(qb.setFromUnitVectors(Xb,D)),ot.translate(J.x,J.y,J.z),n.push({geometry:ot,color:A,sway:0});const K=J.clone().addScaledVector(D,b-T*.4),Y=new yr(.015,6,4);Y.translate(K.x,K.y,K.z),n.push({geometry:Y,color:U(A,.86),sway:0})}else if(S==="bag"){const A=U(e.pick([I.HIDE,I.HIDE_DARK,I.TIMBER_DARK]),e.range(.9,1.1)),x=e.range(.17,.24),b=e.range(.18,.26),T=s-e.range(.14,.24),P=_.clone().lerp(v,.55),C=.009,F=w+(M-w)*.55+C,N=new R(p,P.y-.05,P.z+.028);for(const V of[-1,1])n.push({geometry:Bt(new R(p+V*x*.34,T-.02,E+.012),N.clone().add(new R(V*.006,V*.003,0)),C,C*.85,4),color:U(A,V>0?1.04:.96),sway:0});const D=new R(p,P.y+F,P.z+.004);n.push({geometry:Bt(N,D,C,C*.9,4),color:U(A,1.08),sway:0}),n.push({geometry:Bt(N.clone().lerp(D,.82),new R(p,P.y-.03,Math.max(P.z-.042,.012)),C*.78,C*.7,4),color:U(A,.92),sway:0});const B=new G(x,b,e.range(.07,.1));B.rotateY(e.around(0,.16)),B.translate(p,T-b/2+.02,E+.012),n.push({geometry:B,color:A,sway:0});const H=new G(x*1.04,b*.4,.02);H.translate(p,T-b*.2+.02,E+.012+e.range(.04,.055)),n.push({geometry:H,color:U(A,1.15),sway:0})}else{const A=e.range(.09,.13),x=e.range(.02,.03),b=(E-_.z)/(v.z-_.z),T=w+(M-w)*b,P=A-x,C=Math.max(0,P-T*1.2-.006),F=new Oi(A,x,4,9);F.rotateY(e.around(0,.25)),F.translate(p,_.y+(v.y-_.y)*b-C,E),n.push({geometry:F,color:U(I.CLOTH,e.range(.85,1.05)),sway:0})}}const y=vt(n);return t!==1&&y.scale(t,t,t),bt(y,"wall-pegs",0)}},Sp={name:"hoist",category:"structures",radius:2.4,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(2.8,5.4),r=e.range(2.5,4.2),o=U(I.IRON,e.range(.85,1.05)),a=e.range(.08,.11),c=r;for(const[g,y,m]of[[c+.11,.3,.05],[c-.11,.3,.05]]){const p=new G(s,m,y);p.translate(0,g,0),n.push({geometry:p,color:U(o,1.06),sway:0})}const l=new G(s*.995,.24,.07);l.translate(0,c,0),n.push({geometry:l,color:o,sway:0});for(const g of[-1,1]){const y=g*s/2-g*.3,m=new $(a*.85,a,r,6);m.translate(y,r/2,0),n.push({geometry:m,color:o,sway:0});const p=new G(a*4.4,.07,a*4.4);p.translate(y,.035,0),n.push({geometry:p,color:U(o,.84),sway:0});const _=new R(y,r-.75,0),v=new R(y-g*.7,c-.16,0);n.push({geometry:Bt(_,v,.045,.04),color:U(o,.9),sway:0})}const h=e.range(-s*.28,s*.28),u=new G(.38,.26,.3);u.translate(h,c-.28,0),n.push({geometry:u,color:U(o,1.14),sway:0});const f=new $(.13,.13,.12,8);if(f.rotateX(Math.PI/2),f.translate(h,c-.28,.2),n.push({geometry:f,color:U(I.RUST,1.05),sway:0}),e.chance(.72)){const g=e.range(.8,Math.max(1,c-1.4)),y=.035,m=.011,p=y*1.35,_=.075,v=g+_,w=v+_,M=w+.11,S=c-.42,E=M-y*.5,A=Math.max(p*2,S-E),x=Math.max(3,Math.round(A/p)+1);for(let N=0;N<x;N++){const D=S-N*A/(x-1),B=new Oi(y,m,4,6);B.rotateY(N%2===0?0:Math.PI/2),B.translate(h,D,0),n.push({geometry:B,color:U(o,.92),sway:0})}n.push({geometry:Bt(new R(h,M,0),new R(h,w,0),.03,.026,6),color:U(o,1.1),sway:0});const b=new R(h,v,0),T=6,P=N=>{const D=N/T*Math.PI*1.55;return new R(b.x+Math.sin(D)*_,b.y+Math.cos(D)*_,b.z)};for(let N=0;N<T;N++)n.push({geometry:Bt(P(N),P(N+1),.024*(1-N/(T*2.4)),.022,5),color:U(o,1.05),sway:0});const C=P(T),F=new R(C.x-_*.5,C.y+_*.55,C.z);n.push({geometry:Bt(C,F,.021,.005,5),color:U(o,1.15),sway:0})}const d=vt(n);return t!==1&&d.scale(t,t,t),bt(d,"hoist",0)}},Yb=5,$b=18,Bl={name:"lantern",category:"objects",radius:.28,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=[],r=cp(e),o=U(I.IRON,e.range(.85,1.08)),c=e.chance(.35)?U(I.RUST,e.range(.85,1.05)):o,l=e.chance(.45),h=e.range(.062,.082),u=h*(l?3.1:2.1)*e.range(.92,1.08),f=h*.16,d=h*.24,g=new $(h*1.24,h*1.4,d,8);g.translate(0,d/2,0),n.push({geometry:g,color:U(c,.82),sway:0});const y=h*.16,m=new G(h*2.1,y,h*2.1);m.translate(0,d+y/2,0),n.push({geometry:m,color:U(c,.9),sway:0});const p=d+y;for(const D of[-1,1])for(const B of[-1,1]){const H=new G(f,u,f);H.translate(D*(h*2-f)/2,p+u/2,B*(h*2-f)/2),n.push({geometry:H,color:c,sway:0})}for(const D of[p+u*.06,p+u*.94])for(const B of[0,1]){const H=B===0,V=new G(H?h*2:f*.9,f*.9,H?f*.9:h*2-f*2.2);for(const et of[-1,1]){const lt=V.clone(),Mt=(h*2-f)/2;lt.translate(H?0:et*Mt,D,H?et*Mt:0),n.push({geometry:lt,color:U(c,.92),sway:0})}V.dispose()}const _=p+u,v=h*.7,w=new $(h*.5,h*1.55,v,4);w.rotateY(Math.PI/4),w.translate(0,_+v/2,0),n.push({geometry:w,color:U(c,1.1),sway:0});const M=h*.3,S=new $(h*.34,h*.42,M,6);S.translate(0,_+v+M/2,0),n.push({geometry:S,color:U(c,.88),sway:0});const E=h*.5,A=new Oi(E,f*.42,4,10);A.rotateY(e.chance(.5)?0:Math.PI/2),A.translate(0,_+v+M+E*.85,0),n.push({geometry:A,color:U(c,1.05),sway:0});const x=p+u*e.range(.24,.34),b=new $(h*.46,h*.56,h*.3,8);b.translate(0,p+h*.15,0),n.push({geometry:b,color:r.color,sway:0}),lp(s,r,0,x,0,h*.42);const T=vt(n),P=vt(s),C=e.range(0,Math.PI*2);T.rotateY(C),P.rotateY(C),t!==1&&(T.scale(t,t,t),P.scale(t,t,t));const F=bt(T,"lantern",0);F.add(Mn(P,"lantern:glow"));const N=new zi(r.light,Yb*e.around(1,.12)*t*t,$b*t,Th);return N.position.set(0,x*t,0),N.castShadow=!1,F.add(N),F}},Ep={name:"cistern",category:"objects",radius:.75,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.5,.68),r=e.range(.09,.13),o=s-r,a=e.range(.44,.62),c=e.range(.1,.15),l=U(I.STONE,e.range(.9,1.08)),h=new $(s*.99,s*1.02,c,10);h.translate(0,c/2,0),n.push({geometry:h,color:U(l,.92),sway:0});const u=[new tt(s,c*.5),new tt(s*.96,a),new tt(o,a),new tt(o*.97,c*.5),new tt(s,c*.5)],f=new Zn(u,10);n.push({geometry:f,color:(m,p)=>p>a*.9?U(l,1.18):l,sway:0});const d=c+(a-c)*e.range(.3,.55),g=new $(o*.97,o*.97,.02,10);if(g.translate(0,d,0),n.push({geometry:g,color:I.WATER,sway:0}),e.chance(.55)){const m=new $(s*1.28,s*1.34,.07,10);m.translate(0,.03,0),n.push({geometry:m,color:U(I.STONE_DARK,e.range(.94,1.06)),sway:0})}if(e.chance(.45)){const m=e.range(.14,.22),p=a*e.range(.72,.9);for(const v of[-1,1]){const w=new G(.05,.09,m);w.translate(v*.055,p,s*.86+m/2),n.push({geometry:w,color:U(l,.92),sway:0})}const _=new G(.16,.035,m);_.translate(0,p-.05,s*.86+m/2),n.push({geometry:_,color:U(l,.86),sway:0})}const y=vt(n);return y.rotateY(e.range(0,Math.PI*2)),t!==1&&y.scale(t,t,t),bt(y,"cistern",0)}},Zb=.28,a0={turf:{color:I.GRASS,variation:.1,step:"grass"},meadow:{color:I.GRASS_DRY,variation:.13,step:"grass"},dirt:{color:I.EARTH,variation:.09,step:"earth"},gravel:{color:7235158,variation:.16,step:"gravel"},cobble:{color:I.STONE,variation:.19,step:"stone"},flagstone:{color:I.STONE_PALE,variation:.08,step:"stone"},boards:{color:I.TIMBER,variation:.11,step:"wood"},crop:{color:I.LEAF_DRY,variation:.15,step:"grass"},mire:{color:4536876,variation:.12,step:"mud"},rock:{color:I.STONE_DARK,variation:.13,step:"stone"}};function Kb(i,t,e,n,s,r){const o=s-e,a=r-n,c=o*o+a*a,l=c===0?0:Math.max(0,Math.min(1,((i-e)*o+(t-n)*a)/c));return Math.hypot(i-(e+o*l),t-(n+a*l))}function c0(i,t,e){for(let n=i.length-1;n>=0;n--){const s=i[n];switch(s.kind){case"blot":if(Math.hypot(t-s.at[0],e-s.at[1])<=s.radius)return s.material;break;case"field":if(t>=s.min[0]&&t<=s.max[0]&&e>=s.min[1]&&e<=s.max[1])return s.material;break;case"path":{const r=s.width/2;for(let o=0;o+1<s.through.length;o++){const a=s.through[o],c=s.through[o+1];if(Kb(t,e,a[0],a[1],c[0],c[1])<=r)return s.material}break}}}return null}function jb(i,t){let e=Math.round(i/1.2)*374761393+Math.round(t/1.2)*668265263|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function Ys(i){const t=i<0?0:i>1?1:i;return t*t*t*(t*(t*6-15)+10)}function Jb(i,t,e,n,s,r){const o=s-e,a=r-n,c=o*o+a*a,l=c===0?0:Math.max(0,Math.min(1,((i-e)*o+(t-n)*a)/c));return Math.hypot(i-(e+o*l),t-(n+a*l))}class Qb{size;resolution;landforms;patches;detail;rockAngle;base;constructor(t){this.size=t.size,this.resolution=t.resolution,this.landforms=t.landforms,this.patches=t.patches??[],this.detail=t.detail??[],this.rockAngle=t.rockAngle??34,this.base=t.base??"turf"}heightAt(t,e){let n=0;for(const s of this.landforms)switch(s.kind){case"terrace":break;case"hill":{const r=Math.hypot(t-s.at[0],e-s.at[1]),o=Ys(1-r/s.radius);n+=s.height*(s.falloff?o**s.falloff:o);break}case"ridge":{const r=Jb(t,e,s.from[0],s.from[1],s.to[0],s.to[1]);n+=s.height*Ys(1-r/s.width);break}case"basin":{const r=Math.hypot(t-s.at[0],e-s.at[1]);n-=s.depth*Ys(1-r/s.radius);break}case"rim":{const o=this.size/2-Math.max(Math.abs(t),Math.abs(e));n+=s.height*Ys(1-o/s.inset);break}}for(const s of this.landforms){if(s.kind!=="terrace")continue;const r=Math.hypot(t-s.at[0],e-s.at[1]);if(r>=s.radius+s.blend)continue;const o=r<=s.radius?1:Ys((s.radius+s.blend-r)/s.blend);n=n*(1-o)+s.height*o}return n}get detailRegions(){return this.detail}slopeAt(t,e,n=this.resolution){const s=(this.heightAt(t+n,e)-this.heightAt(t-n,e))/(2*n),r=(this.heightAt(t,e+n)-this.heightAt(t,e-n))/(2*n);return Math.atan(Math.hypot(s,r))*180/Math.PI}build(){const t=Math.round(this.size/this.resolution),e=this.size/2,n=this.resolution,s=new Uint8Array(t*t);for(let _=0;_<t;_++)for(let v=0;v<t;v++){const w=-e+(v+.5)*n,M=-e+(_+.5)*n;let S=1;for(const E of this.detail)Math.hypot(w-E.at[0],M-E.at[1])<=E.radius&&(S=Math.max(S,E.level));s[_*t+v]=S}const r=(_,v)=>_<0||v<0||_>=t||v>=t?1:s[_*t+v],o=[],a=[],c=[],l=new R,h=new R,u=new R,f=new R,d=new R,g=new R,y=new qt,m=(_,v)=>{o.push(_.x,_.y,_.z),a.push(v.x,v.y,v.z),c.push(y.r,y.g,y.b)};for(let _=0;_<t;_++)for(let v=0;v<t;v++){const w=s[_*t+v],M=-e+v*n,S=-e+_*n,E=r(_,v-1),A=r(_,v+1),x=r(_-1,v),b=r(_+1,v),T=(P,C)=>P===0&&E<w?this.alongEdge(M,S,M,S+n,C,E):P===1&&A<w?this.alongEdge(M+n,S,M+n,S+n,C,A):C===0&&x<w?this.alongEdge(M,S,M+n,S,P,x):C===1&&b<w?this.alongEdge(M,S+n,M+n,S+n,P,b):this.heightAt(M+P*n,S+C*n);for(let P=0;P<w;P++)for(let C=0;C<w;C++){const F=C/w,N=(C+1)/w,D=P/w,B=(P+1)/w,H=[[M+F*n,T(F,D),S+D*n],[M+F*n,T(F,B),S+B*n],[M+N*n,T(N,B),S+B*n],[M+N*n,T(N,D),S+D*n]];for(const[V,et,lt]of[[0,1,2],[0,2,3]])l.set(...H[V]),h.set(...H[et]),u.set(...H[lt]),f.subVectors(h,l),d.subVectors(u,l),g.crossVectors(f,d).normalize(),g.y<0&&g.negate(),y.set(this.faceColor(g.y,(l.y+h.y+u.y)/3,(l.x+h.x+u.x)/3,(l.z+h.z+u.z)/3)),m(l,g),m(h,g),m(u,g)}}const p=new Ie;return p.setAttribute("position",new oe(o,3)),p.setAttribute("normal",new oe(a,3)),p.setAttribute("color",new oe(c,3)),p.setAttribute(bs,new oe(new Float32Array(o.length/3),1)),bt(p,"terrain",0)}alongEdge(t,e,n,s,r,o){const a=1/o,l=Math.min(o-1,Math.floor(r/a))*a,h=l+a,u=this.heightAt(t+(n-t)*l,e+(s-e)*l),f=this.heightAt(t+(n-t)*h,e+(s-e)*h);return u+(f-u)*((r-l)/a)}materialAt(t,e){return this.slopeAt(t,e)>this.rockAngle?"rock":c0(this.patches,t,e)??this.base}stepAt(t,e){return a0[this.materialAt(t,e)].step}faceColor(t,e,n,s){const o=Math.acos(Math.min(1,Math.max(-1,t)))*180/Math.PI>this.rockAngle?"rock":c0(this.patches,n,s)??this.base,a=a0[o],c=1+(jb(n,s)-.5)*a.variation*2,l=1-Math.min(Math.max(e/55,0),1)*.16;return U(a.color,c*l)}}const Ap={name:"small-grass-clump",category:"foliage",radius:.55,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.int(30,46);for(let o=0;o<s;o++){const a=e.range(.16,.6),c=new $t(e.range(.016,.032),a,3);c.translate(0,a/2,0),c.scale(1,1,e.range(.3,.55));const l=e.range(.1,.75)*(a/.6);c.rotateZ(e.chance(.5)?l:-l),c.rotateY(e.range(0,Math.PI*2));const h=e.range(0,Math.PI*2),u=Math.sqrt(e())*.26;c.translate(Math.cos(h)*u,0,Math.sin(h)*u),n.push({geometry:c,color:e.chance(.3)?I.GRASS_DRY:I.GRASS,sway:(f,d)=>Math.max(0,d/a)**1.5})}const r=vt(n);return t!==1&&r.scale(t,t,t),bt(r,"small-grass-clump",e()*Math.PI*2)}},Tp={name:"large-grass-clump",category:"foliage",radius:1.6,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.7,.95),r=e.int(5,8),o=[];for(let h=0;h<r;h++){const u=h/r*Math.PI*2+e.range(-.5,.5),f=e.range(.25,.85)*s;o.push({x:Math.cos(u)*f,z:Math.sin(u)*f,grip:e.range(.24,.42)})}const a=e.int(430,620);for(let h=0;h<a;h++){let u,f,d=!1;if(e.chance(.5)){const p=o[e.int(0,o.length-1)],_=e.range(0,Math.PI*2),v=Math.sqrt(e())*p.grip;u=p.x+Math.cos(_)*v,f=p.z+Math.sin(_)*v,d=!0}else{const p=e.range(0,Math.PI*2),_=Math.sqrt(e())*s;u=Math.cos(p)*_,f=Math.sin(p)*_}const g=d?e.range(.3,.72):e.range(.1,.34),y=new $t(e.range(.014,.03),g,3);y.translate(0,g/2,0),y.scale(1,1,e.range(.3,.55));const m=e.range(.1,.8)*(g/.72);y.rotateZ(e.chance(.5)?m:-m),y.rotateY(e.range(0,Math.PI*2)),y.translate(u,0,f),n.push({geometry:y,color:e.chance(d?.2:.4)?I.GRASS_DRY:I.GRASS,sway:(p,_)=>Math.max(0,_/g)**1.5})}const c=e.int(14,26);for(let h=0;h<c;h++){const u=o[e.int(0,o.length-1)],f=e.range(0,Math.PI*2),d=Math.sqrt(e())*(e.chance(.7)?u.grip*1.4:s),g=(e.chance(.7)?u.x:0)+Math.cos(f)*d,y=(e.chance(.7)?u.z:0)+Math.sin(f)*d,m=e.range(.6,1.05),p=e.range(.05,.34),_=e.range(0,Math.PI*2),v=Math.cos(_)*p,w=Math.sin(_)*p,M=new $(.0035,.006,m,4);M.translate(0,m/2,0),M.rotateX(v),M.rotateZ(w),M.translate(g,0,y),n.push({geometry:M,color:U(I.GRASS_DRY,e.range(.9,1.1)),sway:(x,b)=>Math.max(0,b/m)**1.3});const S=x=>nS.set(0,x*m,0).applyAxisAngle(tS,v).applyAxisAngle(eS,w).add(iS.set(g,0,y)),E=e.int(3,6),A=e.range(.14,.24);for(let x=0;x<E;x++){const b=x/E,T=.011*(1-b*.4),P=T*e.range(3,4.5),C=new $t(T,P,3);C.translate(0,P/2,0),C.scale(1,1,.6),C.rotateZ(e.range(.5,1.1)),C.rotateY(x/E*Math.PI*2+e.range(0,.6));const F=S(1-A*b);C.translate(F.x,F.y,F.z),n.push({geometry:C,color:U(e.chance(.4)?10260316:I.GRASS_DRY,e.range(.9,1.12)),sway:1})}}const l=vt(n);return t!==1&&l.scale(t,t,t),bt(l,"large-grass-clump",e()*Math.PI*2)}},tS=new R(1,0,0),eS=new R(0,0,1),nS=new R,iS=new R,Rp={name:"mushroom",category:"foliage",radius:.4,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.chance(.42)?"button":e.chance(.55)?"open":"puffball",r=e.pick([I.RUST,I.EARTH,I.STONE_PALE,I.BARK_PALE,9058862,12100712]),o=e.chance(.5)?I.CLOTH:14209212,a=s==="puffball"?e.int(4,9):e.int(3,7);for(let l=0;l<a;l++){const h=e(),u=e.range(.045,.13)*(.5+h*.75),f=e.range(0,Math.PI*2),d=Math.sqrt(e())*.22,g=Math.cos(f)*d,y=Math.sin(f)*d;if(s==="puffball"){const w=u*e.range(.5,.9),M=new $(u*.62,u*.4,w,6);M.translate(g,w/2,y),n.push({geometry:M,color:U(o,.9),sway:0});const S=new te(u*1.15,1);S.scale(1,e.range(.78,.95),1),S.translate(g,w+u*.72,y),n.push({geometry:S,color:U(o,e.range(.92,1.1)),sway:0});continue}const m=e.around(0,.2),p=u*e.range(1.1,2.4),_=u*e.range(.24,.36),v=new $(_*.86,_*1.2,p,6);if(v.translate(0,p/2,0),v.rotateZ(m),v.translate(g,0,y),n.push({geometry:v,color:U(o,e.range(.94,1.06)),sway:0}),s==="button"){const w=u*(.8+h*.5),M=u*(1.35-h*.6),S=new $t(w,M,e.int(7,9));S.translate(0,M*.34,0),S.rotateZ(m),S.translate(g,p,y),n.push({geometry:S,color:r,sway:0})}else{const w=u*(1.3+h*.7),M=new $(w*.55,w,u*.2,9);M.rotateZ(m),M.translate(g,p+u*.08,y),n.push({geometry:M,color:r,sway:0});const S=new $(w*1.04,w*.9,u*.13,9);S.rotateZ(m),S.translate(g,p+u*.2,y),n.push({geometry:S,color:U(r,1.14),sway:0});const E=new $(w*.86,w*.5,u*.1,9);E.rotateZ(m),E.translate(g,p-u*.02,y),n.push({geometry:E,color:U(o,.88),sway:0})}}const c=vt(n);return t!==1&&c.scale(t,t,t),bt(c,"mushroom",0)}},Cp={name:"rock",category:"nature",radius:.9,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=e.range(.35,1.1),s=new te(n,n>.7?1:0);s.deleteAttribute("normal"),s.deleteAttribute("uv");const r=wh(s);s.dispose();const o=r.getAttribute("position"),a=new R;for(let h=0;h<o.count;h++)a.fromBufferAttribute(o,h),a.multiplyScalar(e.range(.72,1.28)),o.setXYZ(h,a.x,a.y,a.z);o.needsUpdate=!0,r.scale(1,e.range(.6,.85),e.range(.85,1.15)),r.translate(0,n*e.range(.28,.45),0),r.computeVertexNormals();const c=[{geometry:r,color:e.chance(.3)?I.STONE_DARK:I.STONE,sway:0}],l=vt(c);return t!==1&&l.scale(t,t,t),bt(l,"rock",0)}};function sS(i,t){const e=new te(t,0);e.deleteAttribute("normal"),e.deleteAttribute("uv");const n=wh(e);e.dispose();const s=n.getAttribute("position"),r=new R;for(let o=0;o<s.count;o++)r.fromBufferAttribute(s,o),r.multiplyScalar(i.range(.78,1.2)),s.setXYZ(o,r.x,r.y,r.z);return s.needsUpdate=!0,n.scale(1,i.range(.45,.7),i.range(.85,1.1)),n.computeVertexNormals(),n}const Pp={name:"cairn",category:"nature",radius:.7,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.int(4,7);let r=e.range(.26,.38),o=0;for(let c=0;c<s;c++){const l=sS(e,r);l.computeBoundingBox();const h=l.boundingBox,u=h?(h.max.y-h.min.y)/2:r*.5;l.rotateY(e.range(0,Math.PI*2)),o+=u*(c===0?1:1.55),l.translate(e.around(0,r*.14),o,e.around(0,r*.14)),n.push({geometry:l,color:e.chance(.35)?I.STONE_DARK:I.STONE,sway:0}),r*=e.range(.76,.9)}const a=vt(n);return t!==1&&a.scale(t,t,t),bt(a,"cairn",0)}},Ip={name:"stump",category:"foliage",radius:.75,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.3,.7),r=e.range(.22,.36),o=r*e.range(1.25,1.6),a=e.int(6,9),c=e.range(0,.12),l=new $(r,o,s,a);l.translate(0,s/2,0),l.rotateZ(c),n.push({geometry:l,color:I.BARK,sway:0});const h=new $(r*.94,r*.94,.04,a);h.translate(0,s,0),h.rotateZ(c),n.push({geometry:h,color:I.BARK_PALE,sway:0});const u=e.int(3,6);for(let d=0;d<u;d++){const g=e.range(.3,.6),y=new $(.04,.11,g,4);y.translate(0,-g/2,0),y.rotateZ(e.range(1.05,1.45)),y.rotateY(d/u*Math.PI*2+e.around(0,.5)),y.translate(0,e.range(.05,.16),0),n.push({geometry:y,color:I.BARK,sway:0})}const f=vt(n);return t!==1&&f.scale(t,t,t),bt(f,"stump",0)}},Lp={name:"fence",category:"structures",radius:2.4,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.int(3,5),r=e.range(1.1,1.6),o=e.range(.85,1.25),a=e.int(2,3),c=s*r;for(let h=0;h<=s;h++){const u=h*r-c/2,f=e.around(0,.09),d=o*e.range(.85,1.1),g=new G(.11,d,.11);g.translate(0,d/2,0),g.rotateZ(f),g.rotateY(e.around(0,.25)),g.translate(u,0,e.around(0,.06)),n.push({geometry:g,color:I.TIMBER,sway:0})}for(let h=0;h<s;h++){if(e.chance(.22))continue;const u=h*r-c/2+r/2;for(let f=0;f<a;f++){const d=o*(.32+f/Math.max(a-1,1)*.52),g=new G(r*1.02,.07,.05);g.rotateZ(e.around(0,.05)),g.translate(u,d+e.around(0,.03),e.around(0,.03)),n.push({geometry:g,color:I.TIMBER_DARK,sway:0})}}const l=vt(n);return l.rotateY(e.range(0,Math.PI)),t!==1&&l.scale(t,t,t),bt(l,"fence",0)}},Dp={name:"post",category:"structures",radius:.4,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.9,2.1),r=e.range(.07,.13),o=e.range(.02,.16),a=e.range(0,Math.PI*2),c=new G(r*2,s,r*2);if(c.translate(0,s/2,0),c.rotateZ(o),c.rotateY(a),n.push({geometry:c,color:I.TIMBER,sway:0}),e.chance(.4)){const h=e.range(.5,1.1),u=new G(h,r*1.4,r*1.4);u.translate(0,s*e.range(.6,.85),0),u.rotateZ(o),u.rotateY(a+e.around(0,.3)),n.push({geometry:u,color:I.TIMBER_DARK,sway:0})}if(e.chance(.45)){const h=new G(r*2.5,.09,r*2.5);h.translate(0,s-.09,0),h.rotateZ(o),h.rotateY(a),n.push({geometry:h,color:I.RUST,sway:0})}const l=vt(n);return t!==1&&l.scale(t,t,t),bt(l,"post",0)}},Np={name:"trough",category:"objects",radius:1.1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(1.4,2.1),r=e.range(.5,.75),o=e.range(.4,.6),a=e.range(.09,.14),c=e.chance(.55),l=c?I.STONE:I.TIMBER,h=new G(s,a,r);h.translate(0,a/2,0),n.push({geometry:h,color:c?I.STONE_DARK:I.TIMBER_DARK,sway:0});for(const f of[-1,1]){const d=new G(s*.99,o,a);d.translate(0,o/2,f*(r-a)/2),n.push({geometry:d,color:l,sway:0});const g=new G(a,o*.985,r*.985);g.translate(f*(s-a)/2,o/2,0),n.push({geometry:g,color:l,sway:0})}if(e.chance(.6)){const f=new G(s-a*2,.03,r-a*2);f.translate(0,o*e.range(.55,.78),0),n.push({geometry:f,color:2899782,sway:0})}const u=vt(n);return u.rotateY(e.range(0,Math.PI)),t!==1&&u.scale(t,t,t),bt(u,"trough",0)}};function Ne(i,t,e,n,s){const r=new te(t,e);r.deleteAttribute("normal"),r.deleteAttribute("uv");const o=wh(r);r.dispose();const a=o.getAttribute("position"),c=new R;for(let l=0;l<a.count;l++)c.fromBufferAttribute(a,l),c.multiplyScalar(i.range(n,s)),a.setXYZ(l,c.x,c.y,c.z);return a.needsUpdate=!0,o.computeVertexNormals(),o}function ss(i,t){return i.range(t[0],t[1])}function rS(i,t,e,n,s){const r=e.range(0,100),o=e.range(0,100),a=e.range(0,100),c=(h,u,f)=>{let d=Math.imul(Math.round(h)*374761393+Math.round(u)*668265263,1);return d=Math.imul(d^d>>>13,1274126177)+Math.round(f)*951274213,d^=d>>>16,(d>>>0)%1e3/1e3},l=(h,u,f)=>{const d=Math.floor(h),g=Math.floor(u),y=Math.floor(f),m=xc(h-d),p=xc(u-g),_=xc(f-y);let v=0;for(let w=0;w<=1;w++)for(let M=0;M<=1;M++)for(let S=0;S<=1;S++){const E=(S?m:1-m)*(M?p:1-p)*(w?_:1-_);v+=c(d+S,g+M,y+w)*E}return v};return(h,u,f)=>l(h*n+r,u*n+o,f*n+a)<s?t:i}function xc(i){return i*i*(3-2*i)}function xr(i,t,e,{scale:n=1}){const s=[],r=ss(e,t.length),o=ss(e,t.girth),a=ss(e,t.legLength),c=o*e.range(.62,.78),l=e.pick(t.hide),h=a+o/2,u=t.woolly||r>1.2?1:0,f=t.woolly?Ne(e,o/2,u,.86,1.24):new te(o/2,u);f.scale(c/o,1,r/o),f.rotateZ(e.around(0,.05)),f.translate(0,h,0);const d=t.woolly?oS:t.patch?rS(l,e.pick(t.patch),e,2.6/o,t.patchCoverage??.45):l;s.push({geometry:f,color:d,sway:0});const g=ss(e,t.neck),y=ss(e,t.neckRise),m=new R(0,h+o*.18,r*.4),p=o*.45,_=g+p,v=new $(o*.17,o*.24,_,6);v.translate(0,_/2-p,0),v.rotateX(Math.PI/2-y),v.translate(m.x,m.y,m.z),s.push({geometry:v,color:d,sway:0});const w=new R(0,m.y+Math.sin(y)*g,m.z+Math.cos(y)*g),M=ss(e,t.headSize);if(t.head)s.push(...t.head({at:w,size:M,coat:d,extremity:t.extremity,rng:e}));else{const E=new te(M,0);if(E.scale(.85,.9,t.headStretch),E.rotateY(e.around(0,.2)),E.translate(w.x,w.y,w.z),s.push({geometry:E,color:d,sway:0}),t.snout>0){const A=new $(M*t.snout*.52,M*t.snout*.66,M*.62,6);A.rotateX(Math.PI/2),A.translate(w.x,w.y-M*.13,w.z+M*t.headStretch*.66),s.push({geometry:A,color:t.extremity,sway:0})}}for(const E of[-1,1]){if(!t.head&&t.ears!=="none"){const A=new $t(M*.28,M*.85,4);A.translate(0,M*.42,0),t.ears==="floppy"?A.rotateZ(E*2.4):t.ears==="side"?A.rotateZ(E*1.5):A.rotateZ(E*.35),A.translate(w.x+E*M*.6,w.y+M*.4,w.z),s.push({geometry:A,color:t.extremity,sway:0})}if(t.horns!=="none"){const A=M*(t.horns==="curved"?1.5:.7),x=new $t(M*.16,A,5);x.translate(0,A/2,0),x.rotateZ(E*(t.horns==="curved"?1.1:.5)),x.translate(w.x+E*M*.45,w.y+M*.55,w.z),s.push({geometry:x,color:l0,sway:0})}for(const A of[-1,1]){const x=h,b=new $(t.legThickness*.78,t.legThickness,x,5);if(b.translate(0,x/2,0),b.rotateZ(E*e.range(-.02,.07)),b.translate(E*c*.34,0,A*r*e.range(.26,.34)),s.push({geometry:b,color:l,sway:0}),t.feet==="paw"){const T=new G(t.legThickness*2.4,a*.11,t.legThickness*3.6);T.translate(E*c*.34,a*.055,A*r*.3+t.legThickness*.9),s.push({geometry:T,color:t.extremity,sway:0})}else{const T=new $(t.legThickness*1.15,t.legThickness*1.05,a*.13,5);T.translate(E*c*.34,a*.06,A*r*.3),s.push({geometry:T,color:aS,sway:0})}}}if(t.tail!=="none"){const E=new R(0,h+o*.16,-r*.42);if(t.tail==="carried"){const b=r*e.range(.16,.6)/4;let T=-e.range(.7,1),P=E.x,C=E.y,F=E.z;for(let N=0;N<4;N++){const D=o*.075*(1-N/5),B=new $(D*.7,D,b*1.15,4);B.translate(0,b/2,0),B.rotateX(T),B.translate(P,C,F),s.push({geometry:B,color:l,sway:Mc}),C+=b*Math.cos(T),F+=b*Math.sin(T),T+=e.range(.15,.35)}}else if(t.tail==="curl"){const x=o*.06;for(let b=0;b<9;b++){const T=b/8,P=T*Math.PI*2.2,C=new te(x*(1-T*.25),0);C.translate(Math.sin(P)*o*.1,E.y+T*o*.2,E.z-o*.04-(1-Math.cos(P))*o*.05),s.push({geometry:C,color:t.extremity,sway:0})}}else{const A=r*(t.tail==="flowing"?.4:.3),x=e.range(.08,.42),b=new $(o*.07,o*.028,A,4);b.translate(0,-A/2,0),b.rotateX(x),b.translate(E.x,E.y,E.z),s.push({geometry:b,color:l,sway:Mc});const T=A*.94,P=new te(o*.115,0);P.scale(.75,t.tail==="flowing"?1.7:1.05,.75),P.rotateX(x),P.translate(E.x,E.y-T*Math.cos(x),E.z-T*Math.sin(x)),s.push({geometry:P,color:l0,sway:Mc})}}const S=vt(s);return S.rotateY(e.range(0,Math.PI*2)),n!==1&&S.scale(n,n,n),bt(S,i,e()*Math.PI*2)}const oS=12433060,l0=9076841,aS=3814187,Mc=.4,cS={length:[1.9,2.3],girth:[.85,1.05],legLength:[.62,.78],legThickness:.085,neck:[.4,.55],neckRise:[.05,.3],headSize:[.24,.3],headStretch:1.5,snout:.38,ears:"side",horns:"stub",tail:"switch",woolly:!1,hide:[I.WOOL,I.STONE_PALE],extremity:I.HOG,patch:[I.COW_BLACK,I.COW_BLACK,I.HIDE_DARK],patchCoverage:.46},Up={name:"bovine",category:"animals",radius:1.4,build:(i={})=>xr("bovine",cS,xt(i.seed??1),i)},lS={length:[.95,1.25],girth:[.55,.7],legLength:[.34,.46],legThickness:.045,neck:[.18,.28],neckRise:[.2,.5],headSize:[.13,.17],headStretch:1.4,snout:.32,ears:"side",horns:"none",tail:"switch",woolly:!0,hide:[I.HIDE_DARK,I.STONE_DARK],extremity:I.HIDE_DARK},Fp={name:"ovine",category:"animals",radius:.8,build:(i={})=>xr("ovine",lS,xt(i.seed??1),i)},hS={length:[1.9,2.2],girth:[.75,.9],legLength:[.95,1.15],legThickness:.07,neck:[.6,.8],neckRise:[.75,1.05],headSize:[.2,.25],headStretch:1.9,snout:.3,ears:"perked",horns:"none",tail:"flowing",woolly:!1,hide:[I.HIDE_DARK,I.HIDE,I.BARK],extremity:I.HIDE_DARK},Op={name:"equine",category:"animals",radius:1.4,build:(i={})=>xr("equine",hS,xt(i.seed??1),i)},uS={length:[1.1,1.5],girth:[.6,.78],legLength:[.25,.36],legThickness:.055,neck:[.1,.2],neckRise:[0,.2],headSize:[.19,.24],headStretch:1.45,snout:.75,ears:"floppy",horns:"none",tail:"curl",woolly:!1,hide:[I.HOG,I.HIDE_PALE,I.HIDE_DARK],extremity:I.HOG,patch:[I.HIDE_DARK,I.HIDE],patchCoverage:.3},zp={name:"porcine",category:"animals",radius:.95,build:(i={})=>xr("porcine",uS,xt(i.seed??1),i)},kp={name:"poultry",category:"animals",radius:.35,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.16,.23),r=e.range(.09,.16),o=e.pick([I.FOWL,I.HIDE_PALE,I.HIDE_DARK,I.CLOTH]),a=r+s*.75,c=new te(s,0);c.scale(.8,.95,1.25),c.rotateX(e.range(.15,.35)),c.translate(0,a,0),n.push({geometry:c,color:o,sway:0});const l=s*e.range(.42,.55),h=new R(0,a+s*e.range(.75,1.05),s*.6),u=new $(s*.2,s*.28,s*.55,5);u.rotateX(-.5),u.translate(0,a+s*.5,s*.42),n.push({geometry:u,color:o,sway:0});const f=new te(l,0);f.translate(h.x,h.y,h.z),n.push({geometry:f,color:o,sway:0});const d=new $t(l*.35,l*.8,4);d.rotateX(Math.PI/2),d.translate(h.x,h.y-l*.15,h.z+l*.9),n.push({geometry:d,color:I.MARKER_YELLOW,sway:0});const g=e.int(2,4);for(let p=0;p<g;p++){const _=p/Math.max(g-1,1),v=new $t(l*.14,l*(.7-_*.3),3);v.scale(1,1,.4),v.translate(h.x,h.y+l*.95,h.z-_*l*.7),n.push({geometry:v,color:I.COMB,sway:.4})}if(e.chance(.6)){const p=new te(l*.22,0);p.scale(.5,1.1,.7),p.translate(h.x,h.y-l*.75,h.z+l*.5),n.push({geometry:p,color:I.COMB,sway:.3})}const y=e.int(3,5);for(let p=0;p<y;p++){const _=(p/Math.max(y-1,1)-.5)*.8,v=new $t(s*.2,s*e.range(.9,1.4),3);v.scale(1,1,.35),v.translate(0,s*.55,0),v.rotateX(e.range(-1.1,-.7)),v.rotateY(_),v.translate(0,a+s*.35,-s*.85),n.push({geometry:v,color:o,sway:.45})}for(const p of[-1,1]){const _=a,v=new $(s*.055,s*.05,_,4);v.translate(0,_/2,0),v.rotateZ(p*e.range(0,.12)),v.translate(p*s*.24,0,e.around(0,s*.1)),n.push({geometry:v,color:I.MARKER_YELLOW,sway:0});const w=new $t(s*.13,s*.09,3);w.rotateX(Math.PI),w.translate(p*s*.24,s*.04,s*.06),n.push({geometry:w,color:I.MARKER_YELLOW,sway:0})}const m=vt(n);return m.rotateY(e.range(0,Math.PI*2)),t!==1&&m.scale(t,t,t),bt(m,"poultry",e()*Math.PI*2)}},Bp={name:"archway",category:"structures",radius:1.8,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(1.5,1.9),r=e.range(2.6,3.1),o=e.range(.42,.58),a=e.range(.5,.7),c=e.chance(.5)?I.STONE:I.STONE_DARK;for(const u of[-1,1]){const f=e.int(3,4),d=r/f;for(let g=0;g<f;g++){const y=1-g/f*.12,m=new G(o*y,d*1.02,a*y);m.translate(u*(s+o)/2+e.around(0,.02),d*(g+.5),e.around(0,.02)),n.push({geometry:m,color:U(c,e.around(1,.08)),sway:0})}}const l=new G(s+o*2.5,e.range(.34,.46),a*1.1);if(l.translate(0,r+.18,0),n.push({geometry:l,color:U(c,.92),sway:0}),e.chance(.55)){const u=new G(s+o*1.6,.18,a*.8);u.translate(e.around(0,.06),r+.48,0),n.push({geometry:u,color:U(c,1.08),sway:0})}const h=vt(n);return t!==1&&h.scale(t,t,t),bt(h,"archway",0)}},dS=4.5,fS=11,pS=16747068,mS=.86,Hp={name:"forge",category:"structures",radius:1.3,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=[],r=e.range(.85,1.8),o=e.range(.7,1.25),a=e.range(.62,.92),c=e.range(.3,1),l=U(I.IRON,e.range(.85,1.05)),h=U(e.chance(.5)?8014392:7029814,e.range(.9,1.1)),u=2762532,f=e.int(2,4);for(let N=0;N<f;N++){const D=a/f,B=new G(r*(1-N*.015),D,o*(1-N*.015));B.translate(0,D*(N+.5),0),n.push({geometry:B,color:U(h,e.range(.9,1.12)),sway:0})}const d=new G(r*1.02,.06,o*1.02);d.translate(0,a+.03,0),n.push({geometry:d,color:u,sway:0});const g=.1;for(const[N,D,B,H]of[[r*1.02,g,0,-o/2],[g,o*1.02,-r/2,0],[g,o*1.02,r/2,0]]){const V=new G(N,g*1.6,D);V.translate(B,a+g*.8,H),n.push({geometry:V,color:U(h,.86),sway:0})}const y=e.int(5,9);for(let N=0;N<y;N++){const D=e.range(0,Math.PI*2),B=Math.sqrt(e())*r*.22,H=e.range(.035,.075),V=new te(H,0);V.rotateY(e.range(0,Math.PI)),V.translate(Math.cos(D)*B,a+.06+H*.5,Math.sin(D)*B),n.push({geometry:V,color:e.chance(c*.45)?10239780:U(u,e.range(.85,1.3)),sway:0})}const m=a+.09,p=new ke(r*.2*(.6+c*.6),0);p.scale(1,.32,.8),p.translate(0,m,0),s.push({geometry:p,color:pS,sway:0});const _=new ke(r*.09,0);_.scale(1,.5,1),_.translate(e.around(0,.05),m+.02,e.around(0,.05)),s.push({geometry:_,color:16765066,sway:0});const v=a+e.range(.6,1.15),w=v+e.range(.65,1.3),M=r*e.range(.62,.75),S=e.range(.16,.22),E=.03,A=new Zn([new tt(M,v),new tt(S,w),new tt(S-E,w),new tt(M-E,v),new tt(M,v)],6);A.rotateY(Math.PI/6),n.push({geometry:A,color:U(l,.92),sway:0});const x=new $(M*1.05,M*1.05,E*2.2,6);x.rotateY(Math.PI/6),x.translate(0,v+E,0),n.push({geometry:x,color:U(l,1.1),sway:0});const b=new $(S*.94,S*.94,2.4,6);b.translate(0,w+1.2,0),n.push({geometry:b,color:U(l,.86),sway:0});for(const N of[-1,1]){const D=new G(.06,v-a,.06);D.translate(N*r/2*.86,a+(v-a)/2,-o*.36),n.push({geometry:D,color:l,sway:0})}const T=vt(n),P=vt(s);t!==1&&(T.scale(t,t,t),P.scale(t,t,t));const C=bt(T,"forge",0);C.add(Mn(P,"forge:glow"));const F=new zi(16749632,dS*(.35+c*.9)*e.around(1,.1)*t*t,fS*t,1.35);return F.position.set(0,(m+.1)*t,0),F.castShadow=!1,C.add(F),C}},Gp={name:"anvil",category:"objects",radius:.5,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.42,.56),r=e.range(.2,.26),o=e.range(.44,.58),a=e.range(.12,.16),c=U(I.IRON,e.range(.88,1.06)),l=new $(r,r*1.12,s,8);l.translate(0,s/2,0),n.push({geometry:l,color:I.TIMBER_DARK,sway:0});const h=e.range(.055,.08),u=new G(o*.62,h,a*1.5);u.translate(0,s+h/2,0),n.push({geometry:u,color:U(c,.88),sway:0});const f=e.range(.1,.15),d=new G(o*.34,f,a*.78);d.translate(0,s+h+f/2,0),n.push({geometry:d,color:U(c,.94),sway:0});const g=e.range(.09,.13),y=s+h+f,m=new G(o,g,a);m.translate(0,y+g/2,0),n.push({geometry:m,color:(M,S)=>S>y+g*.85?U(c,1.22):c,sway:0});const p=e.range(.16,.24),_=new $t(a*.46,p,6);_.rotateZ(-Math.PI/2),_.translate(o/2+p/2-.01,y+g*.55,0),n.push({geometry:_,color:U(c,1.06),sway:0});const v=new G(e.range(.07,.11),g*.86,a*.92);v.translate(-o/2-.03,y+g*.5,0),n.push({geometry:v,color:U(c,.98),sway:0});const w=vt(n);return w.rotateY(e.range(0,Math.PI*2)),t!==1&&w.scale(t,t,t),bt(w,"anvil",0)}},gS=.78,yS=[[.3,0],[.275,.05],[.225,.14],[.195,.25],[.178,.36],[.172,.44],[.125,.51],[.062,.56],[.045,.56],[.05,.5],[.092,.43],[.122,.35],[.146,.25],[.175,.14],[.222,.05],[.258,0],[.3,0]],Vp={name:"bell",category:"objects",radius:.75,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.85,1.25),r=.56*s,o=.3*s,a=r+e.range(.55,.85),c=e.range(.09,.12),l=o*2+e.range(.28,.44);for(const w of[-1,1]){const M=new G(c,a,c*.92);M.translate(0,a/2,0),M.rotateZ(w*-.055),M.translate(w*l/2,0,0),n.push({geometry:M,color:I.TIMBER,sway:0});const S=new G(c*.62,l*.42,c*.6);S.translate(0,l*.21,0),S.rotateZ(w*.72),S.translate(w*l/2,a-l*.3,0),n.push({geometry:S,color:I.TIMBER_DARK,sway:0})}const h=new G(l+c*2.4,c,c);h.translate(0,a-c/2,0),n.push({geometry:h,color:I.TIMBER,sway:0});const f=a-c-r-e.range(.05,.1),d=yS.map(([w,M])=>new tt(w*s,M*s)),g=new Zn(d,10);g.translate(0,f,0);const y=U(I.BRONZE,e.range(.9,1.1)),m=f+r*e.range(.42,.62);n.push({geometry:g,color:(w,M)=>M>m?I.PATINA:y,sway:0});const p=new G(.055*s,.12*s,.055*s);p.translate(0,f+r+.05*s,0),n.push({geometry:p,color:U(y,.85),sway:0});const _=new te(.055*s,0);_.translate(e.around(0,.02),f+.09*s,e.around(0,.02)),n.push({geometry:_,color:I.IRON_DARK,sway:0});const v=vt(n);return v.rotateY(e.range(0,Math.PI*2)),t!==1&&v.scale(t,t,t),bt(v,"bell",0)}},vS=.72;function _S({at:i,size:t,coat:e,extremity:n,rng:s}){const r=[],o=t*1.45,a=new $(t*.62,t*.78,t*1.5,4);a.rotateX(Math.PI/2),a.rotateZ(Math.PI/4),a.scale(o/(t*1.1),t*1.15/(t*1.1),1),a.translate(i.x,i.y,i.z-t*.15),r.push({geometry:a,color:e,sway:0});const c=t*s.range(.45,1.05),l=i.y-t*.34,h=i.z+t*.6,u=new $(t*.3,t*.46,c,4);u.rotateX(Math.PI/2),u.rotateZ(Math.PI/4),u.scale(1,.78,1),u.translate(i.x,l,h+c/2),r.push({geometry:u,color:e,sway:0});const f=new G(t*.52,t*.26,c*.8);f.translate(i.x,l-t*.28,h+c*.44),r.push({geometry:f,color:n,sway:0});const d=new G(t*.36,t*.3,t*.22);d.translate(i.x,l+t*.08,h+c+t*.05),r.push({geometry:d,color:2367260,sway:0});const g=new G(o*.82,t*.2,t*.28);g.translate(i.x,i.y+t*.22,h-t*.08),r.push({geometry:g,color:e,sway:0});const y=s.range(.75,1.05);for(const m of[-1,1]){const p=new $t(t*.34,t*y,3);p.translate(0,t*y/2,0),p.scale(1,1,.34),p.rotateZ(m*s.range(.16,.34)),p.rotateX(-s.range(.05,.22)),p.translate(i.x+m*o*.34,i.y+t*.4,i.z-t*.35),r.push({geometry:p,color:n,sway:0})}return r}const wS={length:[.5,.68],girth:[.19,.24],legLength:[.19,.38],legThickness:.026,feet:"paw",neck:[.15,.21],neckRise:[.6,1],headSize:[.1,.13],headStretch:1,snout:0,ears:"none",head:_S,horns:"none",tail:"carried",woolly:!1,hide:[I.HIDE,I.HIDE_DARK,I.HIDE_PALE,I.STONE_DARK],extremity:I.HIDE_DARK},Wp={name:"dog",category:"animals",radius:.55,build:(i={})=>xr("dog",wS,xt(i.seed??1),i)},Rh="village",Xp=96,h0=Xp/2,xS=[{kind:"basin",at:[0,0],radius:34,depth:3},{kind:"hill",at:[18,-12],radius:12,height:4.5,falloff:1.3},{kind:"hill",at:[20,8],radius:10,height:3.5,falloff:1.4},{kind:"hill",at:[8,20],radius:11,height:3,falloff:1.5},{kind:"terrace",at:[-6,1],radius:26,height:-3,blend:9},{kind:"terrace",at:[0,34],radius:6,height:-.4,blend:7},{kind:"rim",inset:13,height:14}],MS=[{kind:"field",min:[16,-6],max:[30,8],material:"crop"},{kind:"field",min:[-30,14],max:[-16,28],material:"meadow"},{kind:"blot",at:[-24,-6],radius:11,material:"meadow"},{kind:"path",through:[[0,34],[0,22],[0,15]],width:3,material:"dirt"},{kind:"path",through:[[4,2],[14,-2],[24,-2]],width:2.4,material:"dirt"},{kind:"path",through:[[-9,13],[0,8],[9,1]],width:2.2,material:"cobble"},{kind:"path",through:[[-2,17],[0,8],[1,-2]],width:2.2,material:"cobble"},{kind:"path",through:[[7,15],[0,8],[-7,0]],width:2.2,material:"cobble"},{kind:"path",through:[[11,8],[0,8],[-12,6]],width:2.2,material:"cobble"},{kind:"blot",at:[-16,-10],radius:7,material:"mire"}],di=new Qb({size:Xp,resolution:3,landforms:xS,patches:MS,detail:[{at:[-6,1],radius:26,level:2},{at:[-6,1],radius:20,level:4},{at:[0,34],radius:5,level:3}]}),bS=di,Li=new R(0,0,34),ds={forge:[14.2,5.6],anvil:[13,3.8]},Hl=[-5.4,19.2],Gl=[-8.5,4.5];function yo(i,t){return[i[0],di.heightAt(i[0],i[1])+t,i[1]]}const SS={bed:[{model:"wind",id:"wind",options:{gain:.15,tone:3e3}},{model:"rain",id:"rain",options:{gain:.5,intensity:0,surface:"earth",articulation:.3}}],emitters:[{model:"foliage",id:"wood-north",at:[-26,4,-31],options:{density:260,tone:.78,gain:.4,articulation:.2},refDistance:3,maxDistance:24,rolloff:1.6,reverb:.3},{model:"foliage",id:"wood-east",at:[33,4,-9],options:{density:240,tone:.85,gain:.38,articulation:.22},refDistance:3,maxDistance:22,rolloff:1.6,reverb:.3},{model:"foliage",id:"hedge",at:[-11,1,14],options:{density:150,tone:1.5,gain:.24,articulation:.34},refDistance:1.4,maxDistance:13,reverb:.22},{model:"bird",id:"bird-west",at:[-24,6,4],options:{pitch:2500,interval:7,gain:.07,tone:2700},refDistance:5,maxDistance:46,rolloff:1.3,reverb:.9},{model:"bird",id:"bird-south",at:[17,5.5,34],options:{pitch:3100,interval:11,gain:.055,tone:3e3},refDistance:5,maxDistance:44,rolloff:1.35,reverb:.9},{model:"fire",id:"forge",at:yo(ds.forge,mS),options:{gain:.5,intensity:.85,tone:1.15,crackle:.65,draught:.12},refDistance:2,maxDistance:20,rolloff:1.5,reverb:.35},{model:"friction",id:"gate",at:[Li.x+.9,1.7,Li.z],options:{motion:"weather",speed:.22,force:.85,pitch:150,decay:1.1,bright:.2,roughness:.15,gain:.3},refDistance:3,maxDistance:40,rolloff:1.4,reverb:.5},{model:"crowd",id:"folk",at:[-3,1.4,16],options:{voices:5,density:.4,pitch:132,variety:.55,gain:.36,distance:1450},refDistance:5,maxDistance:30,rolloff:1.5,reverb:.6}],scatter:[{sound:"hammer",id:"smith",at:yo(ds.anvil,gS),spread:[.7,.2,.7],every:13,force:[.45,1],options:{gain:.5,tone:.95,damping:.35,bounces:2},refDistance:3,maxDistance:52,rolloff:1.1,reverb:.55},{sound:"clatter",id:"yards",at:[0,1,8],spread:[13,.5,11],every:26,force:[.3,.85],options:{material:"wood",gain:.45,tone:1.05},refDistance:2.5,maxDistance:34,rolloff:1.25,reverb:.4},{sound:"animal",id:"cattle",at:[-16,1.1,-10],spread:[4,.2,4],every:44,force:[.5,.9],voices:1,options:{kind:"cow",gain:.55,tone:.97},refDistance:4,maxDistance:48,rolloff:1.1,reverb:.5},{sound:"animal",id:"sheep",at:[-16.5,.9,-11],spread:[5,.2,5],every:27,force:[.4,.85],voices:1,options:{kind:"sheep",gain:.42,tone:1.06},refDistance:3.5,maxDistance:40,rolloff:1.2,reverb:.45},{sound:"animal",id:"fowl",at:[-2,.7,6],spread:[8,.15,8],every:16,force:[.3,.7],voices:1,options:{kind:"fowl",gain:.3,tone:1},refDistance:2.5,maxDistance:26,rolloff:1.35,reverb:.35},{sound:"animal",id:"dog",at:yo(Gl,.4),spread:[2.2,.2,2.2],every:36,force:[.45,1],voices:1,options:{kind:"dog",gain:.5,tone:.94},refDistance:4,maxDistance:50,rolloff:1.15,reverb:.55},{sound:"bell",id:"bell",at:yo(Hl,vS),spread:[0,0,0],every:95,rhythm:"periodic",force:[.8,1],voices:1,options:{hz:186,decay:12,gain:.34,strokes:2,interval:2.6,warble:1.1},refDistance:8,maxDistance:70,rolloff:.9,reverb:1}]};function ES(){return{id:Rh,name:"Arkstin Village",environment:{...oa,fogNear:30,fogFar:190,footstepReverb:.5,soundscape:SS},spawn:{position:qp(0,28),yaw:Math.PI},floor:-20,surfaceAt:(i,t)=>di.stepAt(i,t),groundAt:(i,t)=>di.heightAt(i,t),build:TS}}function qp(i,t,e=0){return new R(i,di.heightAt(i,t)+e,t)}function De(i,t,e,n,s,r=!0){t.position.copy(qp(e,n)),t.rotation.y=s,i.add(r?Ee(t):t)}function tn(i,t,e){const n=xt(e.seed),[s,r]=e.from??[0,0],o=e.maxSlope??26,a=e.avoid??[],c=t.solid!==!1;for(let l=0;l<e.count;l++){const h=n.range(0,Math.PI*2),u=Math.sqrt(n())*e.within,f=s+Math.cos(h)*u,d=r+Math.sin(h)*u,g=n.range(0,Math.PI*2),y=e.scale?n.range(e.scale[0],e.scale[1]):1,m=n.int(1,1e6);if(Math.abs(f)>h0-8||Math.abs(d)>h0-8||di.slopeAt(f,d)>o)continue;const p=di.heightAt(f,d);if(e.minHeight!==void 0&&p<e.minHeight||e.maxHeight!==void 0&&p>e.maxHeight)continue;let _=!1;for(const[v,w,M]of a)if(Math.hypot(f-v,d-w)<M){_=!0;break}_||De(i,t.build({seed:m,scale:y}),f,d,g,c)}}const rs=[[0,8,17],[0,24,10],[0,33,8],[-16,-10,9]],AS=[[-9,13],[-2,17],[7,15],[11,8],[9,1],[1,-2],[-7,0],[-12,6]],u0=[0,8];function TS(){const i=new we;i.name="ArkstinVillage",i.add(Ee(di.build())),De(i,Bp.build({seed:4714}),Li.x,Li.z,Math.PI),AS.forEach(([t,e],n)=>{De(i,Eh.build({seed:700+n*131}),t,e,Math.atan2(u0[0]-t,u0[1]-e))});for(let t=0;t<5;t++){const e=t/5*Math.PI*2;De(i,Lp.build({seed:400+t}),-16+Math.cos(e)*8,-10+Math.sin(e)*8,e)}return De(i,Np.build({seed:91}),-13,-13,.4),tn(i,Up,{seed:8801,count:2,within:5,from:[-16,-10],maxSlope:20}),tn(i,Fp,{seed:8802,count:4,within:6,from:[-16,-10],maxSlope:20}),tn(i,zp,{seed:8803,count:2,within:5,from:[-17,-8],maxSlope:20}),tn(i,kp,{seed:8804,count:6,within:9,from:[-2,6],maxSlope:18}),tn(i,Op,{seed:8805,count:2,within:6,from:[-24,4],maxSlope:18}),De(i,Xo.build({seed:2211}),4,11,.3),De(i,Vo.build({seed:2212}),6,12,1.1),De(i,Wo.build({seed:2213}),-4,5,0),De(i,Wo.build({seed:2214}),-5,6.5,.7),De(i,Vo.build({seed:2215}),9,5,.5),De(i,Dp.build({seed:2216}),-2,11,0),De(i,Hp.build({seed:5401}),ds.forge[0],ds.forge[1],Math.PI),De(i,Gp.build({seed:5402}),ds.anvil[0],ds.anvil[1],.6),De(i,Vp.build({seed:5403}),Hl[0],Hl[1],-.5),De(i,Wp.build({seed:5404}),Gl[0],Gl[1],1.9,!1),De(i,ar.build({seed:3301}),3,7,2.2),De(i,ar.build({seed:3302}),-3,9,1.1),De(i,ar.build({seed:3303}),6,3,-.8),tn(i,Lf,{seed:5001,count:130,within:42,maxSlope:30,maxHeight:9,avoid:rs,scale:[.8,1.35]}),tn(i,Pl,{seed:5002,count:90,within:42,maxSlope:32,avoid:rs}),tn(i,Tp,{seed:5002,count:40,within:42,maxSlope:24,avoid:rs}),tn(i,Ap,{seed:5003,count:120,within:42,maxSlope:28,avoid:rs}),tn(i,Rp,{seed:5004,count:40,within:36,maxSlope:22,avoid:rs}),tn(i,Ip,{seed:5005,count:16,within:36,maxSlope:24,avoid:rs}),tn(i,Cp,{seed:6001,count:70,within:45,maxSlope:44,minHeight:4,scale:[.7,1.6]}),tn(i,Pp,{seed:6002,count:7,within:38,maxSlope:20,minHeight:5}),i}const Si=Math.PI*2,RS={name:"oak",category:"foliage",radius:3.4,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(7.3,9.4),r=e.range(.38,.52),o=s*e.range(.2,.27),a=s*e.range(.27,.34),c=s*e.range(.7,.77),l=e.range(0,Si),h=e.range(.02,.09),u=w=>{const M=w/s,S=h*M**2;return new R(Math.cos(l)*S,w,Math.sin(l)*S)},f=()=>U(I.BARK,e.range(.88,1.12)),d=e.range(.38,.55);n.push({geometry:Bt(new R(0,0,0),u(d*1.08),r*e.range(1.28,1.45),r*1.02,8),color:f(),sway:Re(0,s,3)});const g=2;for(let w=0;w<g;w++){const M=d+(o-d)*w/g,S=d+(o-d)*(w+1)/g,E=u(M),A=u(S);A.lerp(E,-.06),n.push({geometry:Bt(E,A,r*(1.02-.1*w),r*(1.02-.1*(w+1)),8),color:f(),sway:Re(0,s,3)})}const y=e.int(4,6),m=e.range(0,Si);for(let w=0;w<y;w++){const M=u(o*e.range(.6,.95)),S=m+w*2.399963+e.around(0,.4),E=a*e.range(.34,.5),A=new R(M.x+Math.cos(S)*E,M.y+e.range(1,1.8),M.z+Math.sin(S)*E);if(n.push({geometry:Bt(M,A,r*.46,r*.32,6),color:f(),sway:Re(0,s,2)}),e.chance(.75)){const F=E*e.range(.72,1.02),N=Ne(e,e.range(.34,.58),0,.74,1.26);N.scale(1,e.range(.58,.8),1),N.translate(M.x+Math.cos(S)*F,A.y+e.around(.05,.3),M.z+Math.sin(S)*F),n.push({geometry:N,color:e.chance(.6)?I.LEAF_DARK:U(I.LEAF,e.range(.84,.98)),sway:e.range(.5,.7)})}const x=S+e.around(0,.3),b=a*e.range(.48,.64),T=new R(M.x+Math.cos(x)*b,A.y+(c-A.y)*e.range(.42,.6),M.z+Math.sin(x)*b),P=A.clone().lerp(M,.09);if(n.push({geometry:Bt(P,T,r*.35,r*.22,5),color:f(),sway:Re(0,s,1.6)}),e.chance(.8)){const F=Ne(e,e.range(.4,.68),0,.75,1.25);F.scale(1,e.range(.62,.84),1),F.translate(T.x+e.around(0,.22),T.y+e.around(.1,.28),T.z+e.around(0,.22)),n.push({geometry:F,color:e.chance(.45)?I.LEAF_DARK:U(I.LEAF,e.range(.88,1.02)),sway:e.range(.68,.84)})}const C=e.int(2,3);for(let F=0;F<C;F++){const N=x+e.around((F-(C-1)/2)*.6,.22),D=a*e.range(.45,.95),B=Math.sqrt(Math.max(0,1-(D/a)**2))*a*.4,H=new R(M.x+Math.cos(N)*D,c+B+e.around(0,.3),M.z+Math.sin(N)*D);n.push({geometry:Bt(T.clone().lerp(P,.1+F*.1),H,r*(.25+F*.015),r*.13,4),color:U(I.BARK_PALE,e.range(.9,1.1)),sway:Re(0,s,1.2)});const V=Ne(e,e.range(.52,.8),0,.78,1.22);V.scale(1,e.range(.72,.9),1),V.translate(H.x,H.y+e.range(.1,.35),H.z),n.push({geometry:V,color:e.chance(.3)?I.LEAF_DARK:U(I.LEAF,e.range(.92,1.08)),sway:e.range(.82,.95)})}}const p=e.int(15,21);for(let w=0;w<p;w++){const M=e.range(0,Si),S=a*Math.sqrt(e())*.92,E=Math.sqrt(Math.max(0,1-(S/a)**2)),A=e.range(.55,.92)*(.78+.32*E),x=Ne(e,A,0,.76,1.24);x.rotateY(e.range(0,Si)),x.scale(1,e.range(.82,1),1),x.translate(Math.cos(M)*S,c+E*a*e.range(.42,.7)+e.around(0,.34)+(e.chance(.2)?e.range(.25,.75):0),Math.sin(M)*S),n.push({geometry:x,color:e.chance(.28)?I.LEAF_DARK:e.chance(.15)&&S>a*.6?I.LEAF_DRY:U(I.LEAF,e.range(.9,1.1)),sway:e.range(.85,1)})}const _=e.int(3,6);for(let w=0;w<_;w++){const M=e.range(0,Si),S=a*e.range(.6,.95),E=Ne(e,e.range(.42,.7),0,.74,1.26);E.scale(1,e.range(.6,.8),1),E.translate(Math.cos(M)*S,c-e.range(.35,1),Math.sin(M)*S),n.push({geometry:E,color:e.chance(.55)?I.LEAF_DARK:U(I.LEAF,e.range(.86,1)),sway:e.range(.8,.95)})}const v=vt(n);return v.rotateY(e.range(0,Si)),t!==1&&v.scale(t,t,t),bt(v,"oak",e.range(0,Si))}},$s=Math.PI*2,CS={name:"small-oak",category:"foliage",radius:1.4,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(2.1,3),r=e.range(.055,.085),o=s*e.range(.28,.38),a=e.range(0,$s),c=e.range(.04,.13),l=p=>{const _=p/s,v=c*_**1.9;return new R(Math.cos(a)*v,p,Math.sin(a)*v)},h=3;for(let p=0;p<h;p++){const _=s*p/h,v=s*(p+1)/h,w=l(_),M=l(v);M.lerp(w,-.07),n.push({geometry:Bt(w,M,r*(1-.22*p),r*(1-.22*(p+1)),6),color:U(I.BARK,e.range(.9,1.12)),sway:Re(0,s,2.2)})}const u=e.int(5,7),f=e.range(0,$s),d=e.chance(.25)?I.LEAF_DARK:I.LEAF;for(let p=0;p<u;p++){const _=u>1?p/(u-1):0,v=Math.min(s*.95,o+(s-o)*_*e.range(.85,1)),w=l(v),M=f+p*2.399963+e.around(0,.35),S=e.range(.42,.72)*(1.15-.5*_),E=e.range(.35,.8),A=new R(w.x+Math.cos(M)*Math.cos(E)*S,w.y+Math.sin(E)*S,w.z+Math.sin(M)*Math.cos(E)*S);n.push({geometry:Bt(w,A,r*.4,r*.2,4),color:U(I.BARK_PALE,e.range(.88,1.12)),sway:Re(0,s,1.4)});const x=S>.55?2:1;for(let b=0;b<x;b++){const T=x===1?1:.55+.45*b,P=Ne(e,e.range(.26,.4)*(1.1-.3*_),0,.76,1.24);P.rotateY(e.range(0,$s)),P.scale(1,e.range(.78,.95),1),P.translate(w.x+(A.x-w.x)*T,w.y+(A.y-w.y)*T+e.range(.02,.1),w.z+(A.z-w.z)*T),n.push({geometry:P,color:e.chance(.3)?I.LEAF_DARK:U(d,e.range(.9,1.1)),sway:e.range(.8,.95)})}}const g=l(s),y=Ne(e,e.range(.26,.36),0,.76,1.24);y.scale(1,e.range(.85,1.05),1),y.translate(g.x,g.y+e.range(.02,.12),g.z),n.push({geometry:y,color:U(d,e.range(.94,1.08)),sway:1});const m=vt(n);return m.rotateY(e.range(0,$s)),t!==1&&m.scale(t,t,t),bt(m,"small-oak",e.range(0,$s))}},Ei=Math.PI*2,bc=14144195,PS=3814701,IS=4933181,LS={name:"birch",category:"foliage",radius:2.4,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(6,8.2),r=e.range(.13,.19),o=s*e.range(.5,.6),a=e.range(.14,.38),c=e.range(0,Ei),l=e.range(.08,.3),h=A=>{const x=A/s,b=l*x**2.4;return new R(Math.cos(c)*b,A,Math.sin(c)*b)},u=A=>{const x=A/s,b=1+.35*Math.max(0,1-A/.55);return r*(1-.72*x)*b},f=[];{let A=a;for(;A<s-.05;){const b=.8-.3*(A/s);if(e.chance(b)){const T=e(),P=T<.32?e.range(.5,1.2):T<.8?e.range(1.2,2.5):e.range(Math.PI,Math.PI*1.25);f.push({y:A,phi:e.range(0,Ei),half:P,tone:e.range(.75,1.4)})}A+=e.chance(.45)?e.range(.03,.09):e.range(.12,.5)}}const d=.026,g=(A,x,b)=>{if(x<a){const C=Math.sin(x*90+A*40)*Math.cos(b*55+x*20);return C>-.15?U(IS,.85+(C+1)*.2):U(bc,.72)}const T=h(x),P=Math.atan2(b-T.z,A-T.x);for(const C of f){if(Math.abs(x-C.y)>d)continue;let F=Math.abs(P-C.phi)%Ei;if(F>Math.PI&&(F=Ei-F),F<C.half)return U(PS,C.tone)}return U(bc,.94+Math.sin(x*31+A*17)*.06)},y=14,m=Math.max(24,Math.round(s/.09)),p=new $(1,1,s,y,m,!1);p.translate(0,s/2,0);{const A=p.getAttribute("position");for(let x=0;x<A.count;x++){const b=Math.min(s,Math.max(0,A.getY(x))),T=h(b),P=u(b);A.setXYZ(x,A.getX(x)*P+T.x,A.getY(x),A.getZ(x)*P+T.z)}p.deleteAttribute("normal")}n.push({geometry:p,color:g,sway:Re(0,s,2.4)});const _=e.int(8,11),v=e.range(0,Ei),w=e.chance(.3)?I.LEAF_DRY:I.LEAF;for(let A=0;A<_;A++){const x=_>1?A/(_-1):0,b=Math.min(s*.985,o+(s-o)*x*e.range(.88,1)),T=h(b),P=v+A*2.399963+e.around(0,.45),C=(.45+.85*(1-x)**1.2)*e.range(.85,1.12),F=e.range(.85,1.2),N=new R(T.x+Math.cos(P)*Math.cos(F)*C,T.y+Math.sin(F)*C,T.z+Math.sin(P)*Math.cos(F)*C);n.push({geometry:Bt(T,N,r*.26,r*.15,4),color:U(bc,e.range(.72,.86)),sway:Re(0,s,1.5)});const D=e.chance(.55)?2:1;for(let B=0;B<D;B++){const H=B===0?0:e.chance(.5)?.8:-.8,V=P+e.around(H,.35),et=e.range(-.85,-.35),lt=C*e.range(.6,.95),Mt=new R(N.x+Math.cos(V)*Math.cos(et)*lt,N.y+Math.sin(et)*lt,N.z+Math.sin(V)*Math.cos(et)*lt),Lt=B===0?.1:.2,J=N.clone().lerp(T,Lt);n.push({geometry:Bt(J,Mt,r*(B===0?.17:.195),r*.07,4),color:U(I.BARK_PALE,e.range(.9,1.1)),sway:.9});const ot=e.int(1,3);for(let K=0;K<ot;K++){const Y=(K+1)/ot,rt=e.range(.18,.3)*(1.15-.4*x),pt=Ne(e,rt,0,.7,1.3);pt.scale(.85,e.range(1.2,1.5),.85),pt.translate(N.x+(Mt.x-N.x)*Y,N.y+(Mt.y-N.y)*Y-Y*Y*e.range(.08,.2),N.z+(Mt.z-N.z)*Y),n.push({geometry:pt,color:e.chance(.3)?I.LEAF_DARK:U(w,e.range(.92,1.08)),sway:e.range(.9,1)})}}}const M=h(s),S=e.int(2,3);for(let A=0;A<S;A++){const x=Ne(e,e.range(.16,.26),0,.72,1.28);x.scale(.85,e.range(1.15,1.4),.85);const b=v+A*2.399963,T=e.range(.05,.28);x.translate(M.x+Math.cos(b)*T,M.y-e.range(.05,.35),M.z+Math.sin(b)*T),n.push({geometry:x,color:U(w,e.range(.9,1.06)),sway:1})}const E=vt(n);return E.rotateY(e.range(0,Ei)),t!==1&&E.scale(t,t,t),bt(E,"birch",e.range(0,Ei))}},vo=Math.PI*2,Sc=12761506,DS=6050885,NS={name:"small-birch",category:"foliage",radius:1.3,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(2.2,3.05),r=e.range(.032,.05),o=s*e.range(.5,.62),a=e.range(0,vo),c=e.range(.18,.42),l=M=>{const S=M/s,E=c*S**1.7;return new R(Math.cos(a)*E,M,Math.sin(a)*E)},h=M=>r*(1-.4*(M/s));let u=0,f=0,d=!1,g=0;for(;u<s-.05;){let M,S,E=!1;f>0&&!d?(E=!0,f-=1,g+=1,M=e.range(.03,.075),S=U(DS,e.range(.85,1.2))):f>0?(M=e.range(.04,.09),S=U(Sc,e.range(.86,.98))):(M=e.chance(.3)?e.range(.3,.5):e.range(.11,.26),S=U(Sc,e.range(.92,1.06)),f=g===0&&u>s*.3||u>s*.1&&e.chance(.58)?e.chance(.25)?2:1:0);const A=Math.min(s,u+M),x=l(u),b=l(A),T=Math.max(b.distanceTo(x),1e-6);b.lerp(x,-Math.max(.02,T*.09)/T),n.push({geometry:Bt(x,b,h(u),h(A),5),color:S,sway:Re(0,s,2)}),d=E,u=A}const y=e.int(3,5),m=e.range(0,vo),p=e.chance(.3)?I.LEAF_DRY:I.LEAF;for(let M=0;M<y;M++){const S=y>1?M/(y-1):0,E=Math.min(s*.97,o+(s-o)*S*e.range(.85,1)),A=l(E),x=m+M*2.399963+e.around(0,.4),b=e.range(.28,.52)*(1.1-.35*S),T=e.range(1,1.3),P=new R(A.x+Math.cos(x)*Math.cos(T)*b,A.y+Math.sin(T)*b,A.z+Math.sin(x)*Math.cos(T)*b);n.push({geometry:Bt(A,P,r*.42,r*.24,4),color:U(Sc,e.range(.78,.9)),sway:Re(0,s,1.3)});const C=x+e.around(0,.3),F=e.range(-.5,-.1),N=b*e.range(.6,.95),D=new R(P.x+Math.cos(C)*Math.cos(F)*N,P.y+Math.sin(F)*N,P.z+Math.sin(C)*Math.cos(F)*N),B=P.clone().lerp(A,.12);n.push({geometry:Bt(B,D,r*.27,r*.12,4),color:U(I.BARK_PALE,e.range(.9,1.1)),sway:.92});const H=e.int(1,2);for(let V=0;V<H;V++){const et=(V+1)/H,lt=Ne(e,e.range(.15,.24),0,.7,1.3);lt.scale(.85,e.range(1.15,1.45),.85),lt.translate(P.x+(D.x-P.x)*et,P.y+(D.y-P.y)*et-et*et*e.range(.03,.09),P.z+(D.z-P.z)*et),n.push({geometry:lt,color:e.chance(.3)?I.LEAF_DARK:U(p,e.range(.92,1.08)),sway:1})}}const _=l(s),v=Ne(e,e.range(.18,.27),0,.72,1.28);v.scale(.9,e.range(1.2,1.5),.9),v.translate(_.x,_.y+.04,_.z),n.push({geometry:v,color:U(p,e.range(.94,1.06)),sway:1});const w=vt(n);return w.rotateY(e.range(0,vo)),t!==1&&w.scale(t,t,t),bt(w,"small-birch",e.range(0,vo))}};function Yp(i,t){const{y:e,radius:n,droop:s,slots:r,azimuth:o,thickness:a,gaps:c,floor:l}=t,h=[],u=new R,f=new R,d=new R;for(let g=0;g<r;g++){if(i.chance(c))continue;const y=o+(g+i.around(0,.3))/r*Math.PI*2,m=Math.max(.1,n*i.range(.66,1.16)),p=m*s*i.range(.75,1.25),_=Math.cos(y),v=Math.sin(y),w=a*.8,M=i.range(.4,.6),S=i.range(.26,.4),E=i.around(0,.22),A=Math.max(a*1.4,m*i.range(.17,.23)),x=l+A*S;u.set(_*w,e,v*w),f.set(_*(w+m*M),Math.max(x,e-p*i.range(.14,.3)),v*(w+m*M)),d.set(_*(w+m),Math.max(x,e-p),v*(w+m)),h.push(d0(u,f,a,A,S,E)),h.push(d0(f,d,A*.88,Math.max(a*.55,m*.03),S*i.range(.92,1.08),E+i.around(0,.12)))}return h}function d0(i,t,e,n,s,r){const o=t.x-i.x,a=t.y-i.y,c=t.z-i.z,l=Math.hypot(o,c),h=Math.hypot(l,a),u=new $(n,e,h,4);return u.translate(0,h/2,0),u.scale(1,1,s),u.rotateY(r),u.rotateX(Math.PI/2+Math.atan2(-a,l)),u.rotateY(Math.PI/2-Math.atan2(c,o)),u.translate(i.x,i.y,i.z),u}const US={name:"spruce",category:"foliage",radius:2.6,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(6.2,8.8),r=s*e.range(.2,.25),o=e.chance(.3)?U(I.LEAF_DARK,.82):I.LEAF_DARK,a=e.range(.16,.24),c=new $(a*.16,a,s,6);c.translate(0,s/2,0);const l=Re(0,s,3);n.push({geometry:c,color:I.BARK,sway:(y,m)=>l(y,m)*.5});const h=e.int(12,16),u=s*e.range(.14,.24),f=s*e.range(.94,.98);let d=e.range(0,Math.PI*2);for(let y=0;y<h;y++){const m=y/(h-1),p=m**.8,_=y===0?e.range(.74,.9):1,v=r*(1-m)**.78*e.range(.83,1.17)*_+.14,w=e.range(.34,.55),M=Math.max(4,Math.min(9,Math.round(4.4+v*1.8))),S=Math.max(u+(f-u)*p,v*(w*1.45+.25)+.15),E=Yp(e,{y:S,radius:v,droop:w,slots:M,azimuth:d,thickness:Math.min(.1,Math.max(.035,v*.12)),gaps:e.range(.02,.1),floor:.12}),A=U(o,(.76+m*.34)*e.range(.94,1.06));E.forEach((x,b)=>{n.push({geometry:x,color:A,sway:.06+m*m*.4+b%2*.06})}),d+=Math.PI*2/M*e.range(.32,.7)+e.around(0,.22)}const g=vt(n);return g.rotateY(e.range(0,Math.PI*2)),t!==1&&g.scale(t,t,t),bt(g,"spruce",e.range(0,Math.PI*2))}},FS=12862239,f0=9383704,OS=9340792;function $p(i,t){const e=[],n=t?i.range(1.9,3.1):i.range(4.2,5.8),s=n*i.range(.021,.03),r=n*i.range(.3,.4),o=U(OS,i.range(.9,1.1)),a=i.chance(.35)?I.LEAF_DARK:I.LEAF,c=Re(0,n,2),l=i.range(0,Math.PI*2),h=i.range(.05,.22),u=m=>{const p=r*h*m**2.2;return new R(Math.cos(l)*p,n*m,Math.sin(l)*p)},f=t?i.range(.42,.55):i.range(.3,.4),d=5;for(let m=0;m<d;m++){const p=f*m/d,_=f*(m+1)/d,v=u(p),w=u(_),M=Math.max(w.distanceTo(v),1e-6);w.lerp(v,-Math.max(.02,M*.1)/M),e.push({geometry:Bt(v,w,s*(1-p*.3),s*(1-_*.3),6),color:U(o,i.range(.92,1.08)),sway:c})}const g=t?i.int(3,4):i.int(5,6),y=i.range(0,Math.PI*2);for(let m=0;m<g;m++){const p=y+m*2.399963+i.around(0,.35),_=u(f*i.range(.62,1)),v=r*i.range(.5,1),w=i.range(.78,.99),M=n*w,S=new R(_.x+Math.cos(p)*v*i.range(.42,.56),_.y+(M-_.y)*i.range(.45,.62),_.z+Math.sin(p)*v*i.range(.42,.56));e.push({geometry:Bt(_,S,s*.55,s*.34,5),color:U(o,i.range(.9,1.06)),sway:c});const E=t?2:i.int(2,3);for(let A=0;A<E;A++){const x=p+i.around((A-(E-1)/2)*.55,.22),b=v*i.range(.62,1),T=Math.min(1,b/Math.max(r,1e-6)),P=new R(_.x+Math.cos(x)*b,S.y+(M-S.y)*Math.sqrt(Math.max(0,1-T*T*.75)),_.z+Math.sin(x)*b),C=S.clone().lerp(_,.1+A*.06);e.push({geometry:Bt(C,P,s*(.3+A*.015),s*.16,4),color:U(o,i.range(.92,1.1)),sway:c});const F=t?2:i.int(2,3);for(let N=0;N<F;N++){const D=i.range(.3,1),B=C.clone().lerp(P,D),H=x+i.around(0,1.1),V=r*i.range(.18,.34),et=new R(B.x+Math.cos(H)*V,B.y+i.range(-.16,.3)*V*2,B.z+Math.sin(H)*V),lt=B.clone().lerp(C,.12);e.push({geometry:Bt(lt,et,s*.24,s*.12,4),color:U(o,i.range(1,1.15)),sway:c});const Mt=2;for(let Lt=0;Lt<Mt;Lt++){const J=lt.clone().lerp(et,.35+Lt/Mt*.65);p0(e,i,J,n,a,H+i.around(0,.8))}if(i.chance(.75)){const Lt=C.clone().lerp(P,i.range(.12,.6));p0(e,i,Lt,n,a,x+i.around(0,1.5))}!t&&D>.55&&i.chance(.38)&&zS(e,i,et,n)}}}return e}function p0(i,t,e,n,s,r){const o=n*t.range(.075,.12),a=t.range(.1,.5),c=new R(Math.cos(r)*Math.cos(a),-Math.sin(a),Math.sin(r)*Math.cos(a)),l=e.clone().addScaledVector(c,o);i.push({geometry:Bt(e,l,n*.004,n*.0025,3),color:U(s,.7),sway:1});const h=2;for(let u=0;u<h;u++){const f=(u+.6)/(h+.4),d=e.clone().lerp(l,f);for(const g of[-1,1]){const y=o*t.range(.3,.46)*(1-f*.25),m=new $t(y*.34,y*1.9,3);m.translate(0,y*.95,0),m.scale(1,1,t.range(.28,.42)),m.rotateZ(g*t.range(1.1,1.45)),m.rotateY(r+t.around(0,.3));const p=g*.012*o;m.translate(d.x+p,d.y+t.around(0,.004),d.z-p),i.push({geometry:m,color:U(s,t.range(.85,1.12)),sway:1})}}}function zS(i,t,e,n){const s=n*t.range(.028,.045),r=s*t.range(.5,1.1),o=t.int(7,10),a=new R(e.x,e.y-r,e.z);i.push({geometry:Bt(e,a.clone().addScaledVector(new R(0,1,0),s*.3),n*.003,n*.002,3),color:U(f0,.7),sway:1});for(let c=0;c<o;c++){const l=c*2.399963,h=s*Math.sqrt((c+.5)/o),u=s*t.range(.2,.29),f=new te(u,0);f.scale(t.range(.9,1.1),t.range(.85,1.05),t.range(.9,1.1)),f.translate(a.x+Math.cos(l)*h,a.y+(1-(h/s)**2)*s*.3+t.around(0,u*.4),a.z+Math.sin(l)*h),i.push({geometry:f,color:t.chance(.3)?U(f0,t.range(.9,1.1)):U(FS,t.range(.9,1.12)),sway:1})}}const kS={name:"rowan",category:"foliage",radius:1.8,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=vt($p(e,!1));return n.rotateY(e.range(0,Math.PI*2)),t!==1&&n.scale(t,t,t),bt(n,"rowan",e.range(0,Math.PI*2))}},BS={name:"small-rowan",category:"foliage",radius:.9,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=vt($p(e,!0));return n.rotateY(e.range(0,Math.PI*2)),t!==1&&n.scale(t,t,t),bt(n,"small-rowan",e.range(0,Math.PI*2))}},HS={name:"small-spruce",category:"foliage",radius:1.1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(2.1,3.4),r=s*e.range(.19,.24),o=e.chance(.35)?U(I.LEAF_DARK,.86):I.LEAF_DARK,a=e.range(.045,.07),c=new $(a*.35,a,s,5);c.translate(0,s/2,0);const l=Re(0,s,2.6);n.push({geometry:c,color:I.BARK,sway:(p,_)=>l(p,_)*.65});const h=s*e.range(.84,.91),u=e.int(6,9),f=e.range(.06,.16);let d=e.range(0,Math.PI*2);for(let p=0;p<u;p++){const _=p/(u-1),v=_**.85,w=r*(1-_*.86)**.85*e.range(.86,1.14)+.07,M=e.range(.24,.42),S=Math.max(4,Math.min(7,Math.round(4.4+w*2.2))),E=Math.max(f+(h-f)*v,w*(M*1.3+.25)+.05),A=Yp(e,{y:E,radius:w,droop:M,slots:S,azimuth:d,thickness:Math.min(.06,Math.max(.022,w*.11)),gaps:e.range(.02,.12),floor:.03}),x=U(o,(.8+_*.32)*e.range(.95,1.05));A.forEach((b,T)=>{n.push({geometry:b,color:x,sway:.1+_*_*.5+T%2*.06})}),d+=Math.PI*2/S*e.range(.32,.7)+e.around(0,.22)}const g=(s-h)*e.range(.55,.8),y=new $t(e.range(.05,.085),g,7);y.translate(0,s-g/2-.03,0),n.push({geometry:y,color:U(o,1.15),sway:.6});const m=vt(n);return m.rotateY(e.range(0,Math.PI*2)),t!==1&&m.scale(t,t,t),bt(m,"small-spruce",e.range(0,Math.PI*2))}},GS=2956342,VS=4864606,m0=9125196,g0=14999234,WS=12893598,XS={name:"elder",category:"foliage",radius:1.15,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(1.08,1.42),r=e.range(.64,.84),o=Re(0,s,1.3),a=w=>Math.min(1,o(0,w)*1.15),c=e.chance(.6)?I.BARK_PALE:I.BARK,l=e.chance(.45)?I.LEAF:I.LEAF_DARK,h=!e.chance(.12),u=Ne(e,e.range(.13,.19),0,.8,1.18);u.scale(1,e.range(.42,.6),1),u.translate(0,e.range(.02,.05),0),n.push({geometry:u,color:U(c,.85),sway:o});const f=e.int(7,9),d=e.range(0,Math.PI*2);for(let w=0;w<f;w++){const M=d+w/f*Math.PI*2+e.around(0,.3),S=M+Math.PI/2,E=s*(w===0?e.range(.92,1):e.range(.58,1)),A=r*e.range(.8,1),x=A*e.around(0,.26),b=e.range(.022,.034),T=new R(Math.sin(M)*e.range(.02,.06),e.range(.03,.07),Math.cos(M)*e.range(.02,.06)),P=D=>{const B=A*D**1.5,H=x*Math.sin(Math.PI*D);return new R(T.x+Math.sin(M)*B+Math.sin(S)*H,T.y+(E-T.y)*(1-(1-D)**1.6),T.z+Math.cos(M)*B+Math.cos(S)*H)},C=[P(0),P(1/3),P(2/3),P(1)];let F=null;for(let D=0;D<3;D++){const B=F?new R().lerpVectors(C[D],F,e.range(.07,.15)):C[D];n.push({geometry:Bt(B,C[D+1],b*(1-D*.22),b*(1-(D+1)*.22),4),color:U(c,e.range(.92,1.08)),sway:o}),F=C[D]}y(P(e.range(.24,.34)),M),y(P(e.range(.55,.66)),M),y(P(e.range(.86,.95)),M);const N=new R().lerpVectors(C[3],C[2],e.range(.08,.2));h?p(N,M):_(N,M)}const g=e.int(3,4);for(let w=0;w<g;w++){const M=d+e.range(0,Math.PI*2),S=s*e.range(.34,.5),E=e.range(1,1.35),A=new R(Math.sin(M)*e.range(.03,.08),e.range(.02,.05),Math.cos(M)*e.range(.03,.08)),x=new R(A.x+Math.sin(M)*Math.cos(E)*S,A.y+Math.sin(E)*S,A.z+Math.cos(M)*Math.cos(E)*S);n.push({geometry:Bt(A,x,e.range(.012,.017),e.range(.006,.009),4),color:U(c,e.range(1,1.12)),sway:o}),y(x,M)}function y(w,M){const S=s*e.range(.19,.27);for(const E of[-1,1]){const A=M+E*e.range(1,1.45),x=e.range(-.42,.04),b=new R(w.x+Math.sin(A)*Math.cos(x)*S,w.y+Math.sin(x)*S,w.z+Math.cos(A)*Math.cos(x)*S),T=new R().lerpVectors(w,b,e.range(.03,.07));n.push({geometry:Bt(T,b,e.range(.0072,.0092),.0035,3),color:U(l,.78),sway:o});const P=2;for(let C=0;C<P;C++){const F=(C+.85)/(P+1.15),N=S*e.range(.36,.46);for(const D of[-1,1]){const B=new R().lerpVectors(w,b,F+e.around(0,.045));n.push({geometry:m(N*e.range(.94,1.08),A+D*e.range(1.05,1.35),x+e.around(0,.22),B),color:U(l,e.range(.86,1.14)),sway:o})}}n.push({geometry:m(S*e.range(.38,.48),A,x,b),color:U(l,e.range(.86,1.14)),sway:o})}}function m(w,M,S,E){const A=new $t(w*e.range(.28,.36),w,3);return A.translate(0,w*.5,0),A.scale(1,1,e.range(.2,.3)),A.rotateX(Math.PI/2+S),A.rotateY(M),A.translate(E.x,E.y,E.z),A}function p(w,M){const S=s*e.range(.1,.16),E=new R(w.x+Math.sin(M)*S*e.range(.25,.55),w.y-S,w.z+Math.cos(M)*S*e.range(.25,.55));n.push({geometry:Bt(w,E,e.range(.008,.011),e.range(.005,.007),4),color:U(m0,e.range(.9,1.1)),sway:a(E.y)});const A=[E];for(const b of[-1,1]){const T=M+b*e.range(1.6,2.4),P=S*e.range(.38,.62),C=new R().lerpVectors(w,E,e.range(.5,.78)),F=new R(C.x+Math.sin(T)*P,C.y-P*e.range(.35,.75),C.z+Math.cos(T)*P);n.push({geometry:Bt(C,F,e.range(.0032,.0045),.0026,3),color:U(m0,e.range(.85,1.05)),sway:a(F.y)}),A.push(F)}const x=e.int(6,7);for(let b=0;b<x;b++){const T=A[b%A.length],P=b/x*Math.PI*2+e.around(0,.8),C=e.range(.026,.04),F=C*e.range(.5,1.5),N=new R(T.x+Math.sin(P)*F,T.y-e.range(0,C*1.2),T.z+Math.cos(P)*F),D=new ke(C,0);D.scale(e.range(.85,1.15),e.range(.8,1.05),e.range(.85,1.15)),D.rotateY(e.range(0,Math.PI)),D.rotateX(e.range(0,Math.PI)),D.translate(N.x,N.y,N.z),n.push({geometry:D,color:(B,H)=>H>N.y?VS:GS,sway:a(N.y)})}}function _(w,M){const S=s*e.range(.12,.16),E=new R(w.x+Math.sin(M)*S*e.range(.1,.35),w.y+S*e.range(.18,.38),w.z+Math.cos(M)*S*e.range(.1,.35));n.push({geometry:Bt(w,E,e.range(.009,.012),.007,4),color:U(l,.8),sway:a(E.y)});const A=3;for(let b=0;b<A;b++){const T=b/A*Math.PI*2+e.around(0,.35),P=new R(E.x+Math.sin(T)*S*e.range(.42,.6),E.y+S*e.around(0,.07),E.z+Math.cos(T)*S*e.range(.42,.6)),C=Ne(e,S*e.range(.3,.42),0,.82,1.12);C.scale(1,e.range(.34,.46),1),C.translate(P.x,P.y,P.z),n.push({geometry:C,color:(F,N)=>N>P.y?g0:WS,sway:a(P.y)})}const x=Ne(e,S*e.range(.34,.44),0,.84,1.1);x.scale(1,e.range(.38,.5),1),x.translate(E.x,E.y+S*e.range(.03,.08),E.z),n.push({geometry:x,color:g0,sway:a(E.y)})}const v=vt(n);return v.rotateY(e.range(0,Math.PI*2)),t!==1&&v.scale(t,t,t),bt(v,"elder",e.range(0,Math.PI*2))}},qS={name:"hazel",category:"foliage",radius:1.2,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(1.08,1.45),r=e.range(.62,.82),o=Re(0,s,1.9),a=e.chance(.65)?I.BARK_PALE:I.BARK,c=e.chance(.3)?I.LEAF_DARK:I.LEAF,l=Ne(e,e.range(.14,.2),0,.76,1.2);l.scale(1,e.range(.45,.62),1),l.translate(0,e.range(.02,.05),0),n.push({geometry:l,color:U(I.BARK,.85),sway:o});const h=e.int(7,10),u=e.range(0,Math.PI*2);for(let g=0;g<h;g++){const y=u+g/h*Math.PI*2+e.around(0,.36),m=s*e.range(.74,1),p=r*e.range(.66,1),_=s*e.range(.026,.04),v=new R(Math.sin(y)*e.range(.02,.08),e.range(.01,.05),Math.cos(y)*e.range(.02,.08)),w=new R(v.x+Math.sin(y)*p,m,v.z+Math.cos(y)*p),M=E=>v.clone().lerp(w,E);n.push({geometry:Bt(v,w,_,_*e.range(.38,.5),5),color:U(a,e.range(.9,1.1)),sway:o});const S=e.int(3,5);for(let E=0;E<S;E++){const A=e.range(.16,.95),x=M(A),b=s*e.range(.1,.18),T=e.range(-.3,.95),P=y+e.around(0,1.5),C=new R(x.x+Math.sin(P)*Math.cos(T)*b,x.y+Math.sin(T)*b,x.z+Math.cos(P)*Math.cos(T)*b);n.push({geometry:Bt(x,C,_*.34,_*.19,3),color:U(a,1.12),sway:o}),f(C)}f(w)}function f(g){const y=e.int(2,3);for(let m=0;m<y;m++){const p=s*e.range(.055,.078),_=new te(p,0);_.scale(1,1,e.range(.12,.19)),_.rotateX(Math.PI/2+e.around(0,.5)),_.rotateY(e.range(0,Math.PI*2));const v=m/y*Math.PI*2+e.around(0,.6),w=p*e.range(.6,1.35);_.translate(g.x+Math.sin(v)*w,g.y+e.around(0,p*.55),g.z+Math.cos(v)*w),n.push({geometry:_,color:U(c,e.range(.85,1.18)),sway:o})}}const d=vt(n);return d.rotateY(e.range(0,Math.PI*2)),t!==1&&d.scale(t,t,t),bt(d,"hazel",e.range(0,Math.PI*2))}},YS=14263323,$S=15254609,ZS={name:"gorse",category:"foliage",radius:1.2,solid:!0,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.98,1.5),r=e.range(.62,.9),o=Re(0,s,1.6),a=[],c=e.int(5,7);for(let g=0;g<c;g++){const y=g===0,m=g/c*Math.PI*2+e.around(0,.55),p=y?0:r*e.range(.16,.44),_=s*(y?e.range(.9,1):e.range(.58,.9)),v=_*e.range(.44,.6);a.push({at:new R(Math.sin(m)*p,v,Math.cos(m)*p),radius:_-v})}for(const g of a){const y=Ne(e,g.radius,0,.82,1.14);y.scale(1,e.range(.82,1),1),y.translate(g.at.x,g.at.y,g.at.z),n.push({geometry:y,color:U(I.LEAF_DARK,e.range(.82,1.02)),sway:o})}const l=e.int(38,55);for(let g=0;g<l;g++){const y=a[e.int(0,a.length-1)],m=e.range(-.22,1),p=Math.sqrt(Math.max(0,1-m*m)),_=e.range(0,Math.PI*2),v=new R(Math.sin(_)*p,m,Math.cos(_)*p),w=s*e.range(.035,.075),M=y.at.clone().addScaledVector(v,y.radius*e.range(.5,.78)),S=y.at.clone().addScaledVector(v,y.radius+w);S.y<.06||n.push({geometry:Bt(M,S,s*e.range(.005,.0085),0,3),color:U(5598003,e.range(.85,1.2)),sway:o})}const h=e.int(70,100),u=a.map(g=>g.radius*g.radius),f=u.reduce((g,y)=>g+y,0)||1;for(let g=0;g<a.length;g++){const y=a[g],m=Math.max(3,Math.round(h*u[g]/f));for(let p=0;p<m;p++){const _=1-(p+.5)/m*1.06,v=Math.sqrt(Math.max(0,1-_*_)),w=p*2.399963+e.around(0,.55),M=new R(Math.sin(w)*v,Math.min(1,_+e.around(0,.06)),Math.cos(w)*v),S=y.at.clone().addScaledVector(M,y.radius*e.range(.74,.88));if(S.y<s*.14)continue;const E=s*e.range(.05,.078),A=new te(E,0);A.scale(e.range(.9,1.25),e.range(.6,.88),e.range(.9,1.25)),A.rotateY(e.range(0,Math.PI)),A.rotateX(e.range(0,Math.PI)),A.translate(S.x,S.y,S.z),n.push({geometry:A,color:e.chance(.45)?$S:YS,sway:o})}}const d=vt(n);return d.rotateY(e.range(0,Math.PI*2)),t!==1&&d.scale(t,t,t),bt(d,"gorse",e.range(0,Math.PI*2))}},KS={name:"fallen-log",category:"nature",radius:2.2,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(2.4,4.6),r=e.range(.16,.26),o=r*e.range(.6,.8),a=e.chance(.45)?I.BARK_PALE:I.BARK,c=e.range(0,1),l=5334330,h=r*.86,u=new $(o,r,s,8);u.rotateZ(Math.PI/2),u.rotateX(e.around(0,.12)),u.translate(0,h,0),n.push({geometry:u,color:(y,m)=>m>h+r*.35&&e.chance(0)===!1&&c>.45?l:a,sway:0});const f=new $t(r*.92,r*1.1,6);f.rotateZ(-Math.PI/2),f.translate(s/2+r*.4,h,0),n.push({geometry:f,color:U(I.TIMBER,.86),sway:0});const d=e.int(2,4);for(let y=0;y<d;y++){const m=e.range(-s*.42,s*.35),p=e.range(.18,.42),_=e.range(.3,Math.PI-.3)*(e.chance(.5)?1:-1),v=new $(r*.16,r*.26,p,5);v.translate(0,p/2,0),v.rotateX(Math.PI/2-e.range(.4,1.1)),v.rotateY(_),v.translate(m,h+r*.4,0),n.push({geometry:v,color:U(a,.9),sway:0})}if(c>.6){const y=e.int(2,4);for(let m=0;m<y;m++){const p=e.range(-s*.4,s*.4),_=e.chance(.5)?1:-1,v=new $(e.range(.06,.12),e.range(.03,.06),.025,6);v.rotateZ(_*.5),v.translate(p,h+e.range(0,r*.5),_*r*.85),n.push({geometry:v,color:12430988,sway:0})}}const g=vt(n);return t!==1&&g.scale(t,t,t),bt(g,"fallen-log",0)}},jS={name:"sticks",category:"nature",radius:1,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.int(6,11),r=e.range(.5,.95),o=e.chance(.5)?I.BARK:I.BARK_PALE;for(let c=0;c<s;c++){const l=e.range(.4,1.5),h=e.range(.018,.05),u=e.chance(.1)?e.range(.12,.26):e.range(0,.06),f=e.range(0,Math.PI*2),d=new $(h*.7,h,l,4);d.rotateZ(Math.PI/2),d.rotateZ(u),d.rotateY(f);const g=e.range(0,.05)+Math.sin(u)*l*.4,y=Math.sqrt(e())*r*(1-g*.5),m=e.range(0,Math.PI*2);d.translate(Math.cos(m)*y,h+g,Math.sin(m)*y),n.push({geometry:d,color:U(o,e.range(.82,1.14)),sway:0})}const a=vt(n);return t!==1&&a.scale(t,t,t),bt(a,"sticks",0)}},JS={name:"bramble",category:"foliage",radius:1.3,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.int(5,8),r=e.range(.85,1.4),o=e.chance(.5)?5917240:7033392,a=e.chance(.5)?I.LEAF_DARK:I.LEAF,c=e.range(0,Math.PI*2);for(let h=0;h<s;h++){const u=c+e.range(-1.5,1.5),f=r*e.range(.65,1.1),d=4,g=f/d,y=e.range(.013,.022);let m=e.range(1,1.35);const p=e.range(0,.09),_=e.range(0,Math.PI*2);let v=Math.cos(_)*p,w=.02,M=Math.sin(_)*p;for(let S=0;S<d;S++){const E=new $(y*.72,y,g*1.1,4);E.translate(0,g/2,0),E.rotateX(Math.PI/2-m),E.rotateY(u),E.translate(v,w,M);const A=(S/d)**1.4;n.push({geometry:E,color:U(o,e.range(.88,1.1)),sway:A});const x=Math.cos(m)*g,b=v+Math.sin(u)*x,T=w+Math.sin(m)*g,P=M+Math.cos(u)*x;if(T>.05)for(let C=0;C<3;C++){const F=y*e.range(3.6,5.4),N=new $t(F*.55,F*1.5,3);N.translate(0,F*.75,0),N.scale(1,1,.3),N.rotateZ(e.range(.9,1.4)),N.rotateY(C/3*Math.PI*2+e.range(0,.4)),N.translate(b,T,P),n.push({geometry:N,color:U(a,e.range(.85,1.15)),sway:A})}v=b,w=Math.max(.03,T),M=P,m-=e.range(.4,.7)}}const l=vt(n);return t!==1&&l.scale(t,t,t),bt(l,"bramble",e.range(0,Math.PI*2))}},QS={name:"fern",category:"foliage",radius:.8,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e()**2,r=.3+s*.62,o=Math.max(3,Math.round(4+s*8+e.around(0,1.2))),a=e.chance(.4)?I.LEAF_DARK:I.LEAF;for(let h=0;h<o;h++){const u=h/o*Math.PI*2+e.range(-.22,.22),f=r*e.range(.72,1.15),d=4,g=f/d;let y=e.range(1.1,1.45),m=0,p=e.range(.02,.08),_=0;for(let v=0;v<d;v++){const w=v/d,M=new $(.006,.009,g*1.1,4);M.translate(0,g/2,0),M.rotateX(Math.PI/2-y),M.rotateY(u),M.translate(m,p,_),n.push({geometry:M,color:U(a,.82),sway:w**1.2});const S=3;for(let A=0;A<S;A++){const x=(A+.5)/S,b=w+x/d,T=f*.2*(1-b*.75);if(T<.012)continue;const P=Math.cos(y)*g*x,C=m+Math.sin(u)*P,F=p+Math.sin(y)*g*x,N=_+Math.cos(u)*P;for(const D of[-1,1]){const B=T*e.range(.88,1.12),H=new $t(B*.3,B,3);H.translate(0,B*.5,0),H.scale(1,1,.22),H.rotateZ(D*e.range(1.2,1.45)),H.rotateY(u+D*e.range(.1,.35)),H.translate(C,F,N),n.push({geometry:H,color:U(a,e.range(.9,1.14)),sway:b**1.2})}}const E=Math.cos(y)*g;m+=Math.sin(u)*E,p+=Math.sin(y)*g,_+=Math.cos(u)*E,y-=e.range(.3,.5)}}const c=new te(r*.1,0);c.scale(1,1.5,1),c.translate(0,r*.1,0),n.push({geometry:c,color:U(a,.75),sway:.3});const l=vt(n);return l.rotateY(e.range(0,Math.PI*2)),t!==1&&l.scale(t,t,t),bt(l,"fern",e.range(0,Math.PI*2))}},tE={name:"nettle",category:"foliage",radius:.6,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.int(4,8),r=e.range(.26,.42),o=e.chance(.5)?4612154:4019507;for(let c=0;c<s;c++){const l=e.range(0,Math.PI*2),h=Math.sqrt(e())*r,u=Math.cos(l)*h,f=Math.sin(l)*h,d=e.range(.62,1.05)*(1-h/r*.18),g=e.range(0,.09),y=e.range(0,Math.PI*2),m=e.range(.0055,.0095),p=new $(m*.7,m,d,4);p.translate(0,d/2,0),p.rotateX(Math.cos(y)*g),p.rotateZ(Math.sin(y)*g),p.translate(u,0,f),n.push({geometry:p,color:U(o,.85),sway:(w,M)=>Math.max(0,M/d)**1.4});const _=2+Math.floor(d*2);for(let w=1;w<=_;w++){const M=w/(_+.6)*d,S=d*e.range(.1,.16)*(1-w/_*.72);for(const E of[-1,1]){const A=S*e.range(.9,1.1),x=new $t(A*.5,A*1.7,3);x.translate(0,A*.85,0),x.scale(1,1,.3),x.rotateZ(E*e.range(1.15,1.5)),x.rotateY(w*(Math.PI/2)+e.around(0,.2)),x.translate(u,M,f),n.push({geometry:x,color:U(o,e.range(.92,1.12)),sway:Math.max(0,M/d)**1.4})}}const v=e.int(3,5);for(let w=0;w<v;w++){const M=d*e.range(.022,.04),S=new $t(M*.5,M*1.6,3);S.translate(0,M*.8,0),S.scale(1,1,.3),S.rotateZ(e.range(.25,.6)),S.rotateY(w*2.399963+e.around(0,.4)),S.translate(u,d*(.9+w*.022),f),n.push({geometry:S,color:U(o,e.range(1.1,1.25)),sway:1})}if(e.chance(.6))for(const w of[-1,1]){const M=new $(e.range(.0035,.0048),e.range(.007,.0092),d*e.range(.14,.19),4);M.translate(0,-d*.08,0),M.rotateZ(w*e.range(.66,.94)),M.translate(u,d*.86,f),n.push({geometry:M,color:11053186,sway:.9})}}const a=vt(n);return a.rotateY(e.range(0,Math.PI*2)),t!==1&&a.scale(t,t,t),bt(a,"nettle",e.range(0,Math.PI*2))}},eE={name:"reeds",category:"foliage",radius:.7,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.int(9,18),r=e.range(.28,.5),o=e.chance(.4)?8223300:6253368,a=e.chance(.5)?4863268:6045994;for(let l=0;l<s;l++){const h=e.range(0,Math.PI*2),u=Math.sqrt(e())*r,f=Math.cos(h)*u,d=Math.sin(h)*u,g=e.range(1.4,2.4)*(1-u/r*.22),y=e.range(0,.14),m=e.range(0,Math.PI*2),p=Math.cos(m)*y,_=Math.sin(m)*y,v=new $(.008,.013,g,4);v.translate(0,g/2,0),v.rotateX(p),v.rotateZ(_),v.translate(f,0,d),n.push({geometry:v,sway:(x,b)=>Math.max(0,b/g)**1.2,color:U(o,e.range(.88,1.12))}),_o.set(0,g,0).applyAxisAngle(nE,p).applyAxisAngle(iE,_);const w=e.range(.16,.26),M=[],S=new $(.024,.028,w,6);S.translate(0,-w/2,0),M.push([S,U(a,e.range(.9,1.1))]);const E=new $t(.026,w*.46,6);E.translate(0,w*.17,0),M.push([E,U(a,1.15)]);const A=new $(.004,.007,w*.5,4);A.translate(0,w*.63,0),M.push([A,U(o,.9)]);for(const[x,b]of M)x.rotateX(p),x.rotateZ(_),x.translate(f+_o.x,_o.y,d+_o.z),n.push({geometry:x,color:b,sway:1});if(e.chance(.5)){const x=g*e.range(.3,.5),b=new $t(.018,x,3);b.translate(0,x/2,0),b.scale(1,1,.28),b.rotateZ(e.range(.25,.6)*(e.chance(.5)?1:-1)),b.rotateY(e.range(0,Math.PI*2)),b.translate(f,g*e.range(.1,.3),d),n.push({geometry:b,color:U(o,.92),sway:.8})}}const c=vt(n);return t!==1&&c.scale(t,t,t),bt(c,"reeds",e.range(0,Math.PI*2))}},nE=new R(1,0,0),iE=new R(0,0,1),_o=new R,sE={name:"moss",category:"foliage",radius:.55,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.chance(.4)?"cushion":e.chance(.5)?"carpet":"fruiting",r=e.chance(.5)?4678447:3495740,o=e.range(.2,.34),a=s==="cushion"?e.int(3,6):e.int(4,8);for(let l=0;l<a;l++){const h=l===0,u=h?e.range(.16,.26):e.range(.08,.18)*(s==="cushion"?1:1.35),f=h?0:Math.sqrt(e())*o,d=e.range(0,Math.PI*2),g=s==="cushion"?e.range(.34,.46):e.range(.13,.2),y=Ne(e,u,1,.86,1.18);y.scale(1,g,1),y.translate(Math.cos(d)*f,u*g*.35,Math.sin(d)*f),n.push({geometry:y,color:U(r,e.range(.86,1.16)),sway:0})}if(s==="fruiting"){const l=e.int(14,26),h=e.chance(.5)?9075274:7167802;for(let u=0;u<l;u++){const f=e.range(0,Math.PI*2),d=Math.sqrt(e())*o*.9,g=Math.cos(f)*d,y=Math.sin(f)*d,m=e.range(.045,.1),p=e.range(0,.3),_=e.range(0,Math.PI*2),v=new $(.0018,.0028,m,4);v.translate(0,m/2,0),v.rotateX(Math.cos(_)*p),v.rotateZ(Math.sin(_)*p),v.translate(g,.02,y),n.push({geometry:v,color:U(h,.9),sway:.7});const w=new $(.006,.0045,m*.3,5);w.rotateX(Math.cos(_)*p*1.6),w.rotateZ(Math.sin(_)*p*1.6),w.translate(g+Math.sin(Math.sin(_)*p)*-m,.02+m*Math.cos(p),y+Math.sin(Math.cos(_)*p)*m),n.push({geometry:w,color:U(h,1.2),sway:1})}}const c=vt(n);return t!==1&&c.scale(t,t,t),bt(c,"moss",e.range(0,Math.PI*2))}},rE={name:"pinecone",category:"nature",radius:.4,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.int(3,7),r=e.range(.16,.3);for(let a=0;a<s;a++){const c=e.range(0,Math.PI*2),l=Math.sqrt(e())*r,h=Math.cos(c)*l,u=Math.sin(c)*l,f=e.range(.11,.18),d=f*e.range(.36,.46),g=U(e.chance(.5)?I.BARK:7031340,e.range(.85,1.15)),y=e.range(.9,1.35),m=e.range(0,Math.PI*2),p=S=>{S.rotateX(y),S.rotateY(m),S.translate(h,d*.55,u)},_=new $(d*.18,d*.5,f*.82,6);p(_),n.push({geometry:_,color:U(g,.8),sway:0});const v=new $t(d*.2,f*.3,6);v.translate(0,f*.55,0),p(v),n.push({geometry:v,color:U(g,.75),sway:0});const w=4,M=5;for(let S=0;S<w;S++){const E=-f*.34+S/(w-1)*f*.66,A=1-Math.abs(S/(w-1)-.35)*.9;for(let x=0;x<M;x++){const b=x/M*Math.PI*2+S*.62,T=new G(d*.42,d*.16,d*.34);T.rotateX(-.5),T.translate(0,0,d*.5*A),T.rotateY(b),T.translate(0,E,0),p(T),n.push({geometry:T,color:U(g,e.range(.95,1.2)),sway:0})}}}const o=vt(n);return t!==1&&o.scale(t,t,t),bt(o,"pinecone",0)}},oE=4874292,aE=6124608,cE=I.LEAF;function lE(i,t,e,{scale:n=1}){const s=[],r=e.int(t.count[0],t.count[1]),o=e.pick(t.petal),a=e.range(0,Math.PI*2);for(let l=0;l<r;l++){const h=e.range(0,Math.PI*2),u=Math.sqrt(e())*t.spread,f=Math.cos(h)*u,d=Math.sin(h)*u,g=1-u/t.spread*e.range(.1,.35),y=e.range(t.height[0],t.height[1])*g,m=e.range(0,.22),p=e.range(0,Math.PI*2),_=Math.cos(p)*m,v=Math.sin(p)*m,w=new $(t.stemThickness*.7,t.stemThickness,y,4);w.translate(0,y/2,0),w.rotateX(_),w.rotateZ(v),w.translate(f,0,d),s.push({geometry:w,color:e.chance(.4)?aE:oE,sway:(D,B)=>Math.max(0,B/y)**1.4});for(let D=0;D<t.leaves;D++){const B=y*(.2+D/Math.max(1,t.leaves)*.45);xo.set(0,B,0).applyAxisAngle(Ec,_).applyAxisAngle(Ac,v);for(const H of[-1,1]){const V=y*e.range(.16,.28),et=new $t(V*.3,V,3);et.translate(0,V/2,0),et.scale(1,1,.35),et.rotateZ(H*e.range(1,1.35)),et.rotateY(e.range(0,Math.PI*2)),et.translate(f+xo.x,xo.y,d+xo.z),s.push({geometry:et,color:cE,sway:()=>Math.max(0,B/y)**1.4})}}wo.set(0,y,0).applyAxisAngle(Ec,_).applyAxisAngle(Ac,v);const M=f+wo.x,S=wo.y,E=d+wo.z,A=1;if(t.head){s.push(...t.head({axis:D=>new R(0,y*D,0).applyAxisAngle(Ec,_).applyAxisAngle(Ac,v).add(new R(f,0,d)),height:y,rng:e}));continue}const x=e.range(t.headSize[0],t.headSize[1])*g,b=e.chance(t.nod)?e.range(.5,1.1):e.range(0,.18),T=e.range(-Math.PI,Math.PI),P=t.facing===void 0?T:a+T/Math.PI*t.facing,C=D=>{D.rotateX(Math.cos(P)*b),D.rotateZ(Math.sin(P)*b),D.translate(M,S,E)},F=new $(x,x*.9,x*.5,8);C(F),s.push({geometry:F,color:t.centre,sway:A});const N=x*t.reach;for(let D=0;D<t.petals;D++){const B=D/t.petals*Math.PI*2+e.range(-.12,.12),H=N*e.range(.88,1.12),V=new $t(H*t.petalWidth*e.range(.9,1.1),H,3);V.translate(0,N/2,0),V.scale(1,1,.28),V.rotateX(Math.PI/2-e.range(t.cup[0],t.cup[1])),V.rotateY(B),V.translate(0,x*.12,0),C(V),s.push({geometry:V,color:o,sway:A})}}const c=vt(s);return c.rotateY(e.range(0,Math.PI*2)),n!==1&&c.scale(n,n,n),bt(c,i,e.range(0,Math.PI*2))}function Kn(i,t,e){return{name:i,category:"foliage",radius:e,solid:!1,build:(n={})=>lE(i,t,xt(n.seed??1),n)}}const Ec=new R(1,0,0),Ac=new R(0,0,1),wo=new R,xo=new R,y0=[{petals:5,reach:2.1,width:.62,cup:[.5,.95],size:[.026,.042],petal:[15255624,14465074,14996042],centre:11045420,nod:.1},{petals:14,reach:2.3,width:.18,cup:[.05,.3],size:[.028,.046],petal:[15789280,15262932,16050360],centre:14202944,nod:.1},{petals:12,reach:1.15,width:.42,cup:[.35,.8],size:[.03,.05],petal:[11576528,10259648,12891356],centre:7298966,nod:.15},{petals:5,reach:1.7,width:.5,cup:[.15,.45],size:[.024,.04],petal:[14183060,13128834,14715560],centre:15786192,nod:.12},{petals:4,reach:2.4,width:.55,cup:[0,.2],size:[.016,.028],petal:[8363992,7048392,10138848],centre:15790304,nod:.05},{petals:8,reach:2.6,width:.24,cup:[.6,1.1],size:[.022,.036],petal:[14717034,13925464,15247488],centre:9194028,nod:.6}];function hE({axis:i,rng:t}){const e=[],n=y0[t.int(0,y0.length-1)],s=i(1),r=t.range(n.size[0],n.size[1]),o=t.pick(n.petal),a=t.chance(n.nod)?t.range(.5,1.1):t.range(0,.18),c=t.range(0,Math.PI*2),l=f=>{f.rotateX(Math.cos(c)*a),f.rotateZ(Math.sin(c)*a),f.translate(s.x,s.y,s.z)},h=new $(r,r*.9,r*.5,8);l(h),e.push({geometry:h,color:n.centre,sway:1});const u=r*n.reach;for(let f=0;f<n.petals;f++){const d=f/n.petals*Math.PI*2+t.range(-.12,.12),g=u*t.range(.88,1.12),y=new $t(g*n.width*t.range(.9,1.1),g,3);y.translate(0,g/2,0),y.scale(1,1,.28),y.rotateX(Math.PI/2-t.range(n.cup[0],n.cup[1])),y.rotateY(d),y.translate(0,r*.12,0),l(y),e.push({geometry:y,color:o,sway:1})}return e}const uE=Kn("wildflower",{height:[.14,.62],stemThickness:.0085,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[14209252],centre:14205024,count:[14,26],spread:.6,leaves:1,nod:0,head:hE},.75);function dE({axis:i,height:t,rng:e}){const n=[],s=e.int(4,6),r=e.range(0,Math.PI*2),o=e.range(.5,.62),c=e.chance(.06)?15789800:5926837;for(let l=0;l<s;l++){const h=s===1?0:l/(s-1),u=o+(1-o)*h,f=i(u),d=h*h*t*.3,g=t*.12*(1-h*.3),y=r+e.range(-.22,.22),m=g*.9+d,p=new R(f.x+Math.sin(y)*m,f.y-d*.5,f.z+Math.cos(y)*m);n.push({geometry:Bt(f,p,.0035,.0025),color:6124608,sway:u});const _=new $(g*.3,g*.62,g*1.4,6);_.translate(0,-g*.7,0),_.rotateZ(e.around(0,.16)),_.translate(p.x,p.y,p.z),n.push({geometry:_,color:c,sway:u})}return n}const fE=Kn("bluebell",{height:[.35,.62],stemThickness:.008,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[5926837],centre:5926837,count:[9,16],spread:.5,leaves:0,nod:0,head:dE},.65);function pE({axis:i,height:t,rng:e}){const n=[],s=i(1),r=e.int(6,11),o=t*e.range(.1,.16),a=s.y+o*e.range(.5,.8);for(let c=0;c<r;c++){const l=c/r*Math.PI*2+e.range(-.2,.2),h=o*e.range(.5,1.15),u=new R(s.x+Math.cos(l)*h,a,s.z+Math.sin(l)*h);n.push({geometry:Bt(s,u,.0028,.0018),color:6978116,sway:1});const f=new te(o*e.range(.16,.26),0);if(f.scale(1,.32,1),f.translate(u.x,u.y,u.z),n.push({geometry:f,color:16250348,sway:1}),e.chance(.55)){const d=new te(o*.1,0);d.scale(1,.3,1),d.translate(u.x+e.around(0,.008),u.y+.004,u.z+e.around(0,.008)),n.push({geometry:d,color:14210720,sway:1})}}return n}const mE=Kn("cowparsley",{height:[.55,1.15],stemThickness:.009,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[16250348],centre:14210720,count:[5,12],spread:.5,leaves:2,nod:0,head:pE},.7),Zp=11555727,Kp=13070244,gE=9256307,v0=8211058;function yE({axis:i,height:t,rng:e}){const n=[],s=e.int(11,16),r=e.range(0,Math.PI*2),o=e.range(.4,.5);for(let c=0;c<s;c++){const l=c/(s-1),h=o+(1-o)*l,u=i(h),f=r+e.range(-.38,.38),d=t*.09*(1-l*.55),g=Math.min(1,Math.max(0,1.35-l*1.8)),y={x:Math.sin(f),z:Math.cos(f)},m=d*.12,p=u.x+y.x*m,_=u.z+y.z*m,v=d*(.8+g*.9),w=d*(.2+g*.28),M=.28+g*.42,S=f-Math.PI/2,E=new $(d*.22,w,v,7);E.translate(0,-v/2,0),E.rotateZ(M),E.rotateY(S),E.translate(p,u.y,_),n.push({geometry:E,color:(x,b)=>b>u.y-v*.45?Kp:Zp,sway:h});const A=new $(w*(g>.3?1.22:.4),w*(g>.3?1.05:.15),d*.26,7);A.translate(0,-v-d*.06,0),A.rotateZ(M),A.rotateY(S),A.translate(p,u.y,_),n.push({geometry:A,color:g>.3?gE:v0,sway:h})}const a=i(1);for(let c=0;c<3;c++){const l=new te(t*.014*(1-c*.22),0);l.scale(.75,1.5,.75),l.translate(a.x+Math.sin(r)*t*.01,a.y-c*t*.02,a.z+Math.cos(r)*t*.01),n.push({geometry:l,color:v0,sway:1})}return n}const vE=Kn("foxglove",{height:[1,1.8],stemThickness:.014,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[Zp],centre:Kp,count:[1,4],spread:.3,leaves:2,nod:0,head:yE},.6);function _E({axis:i,height:t,rng:e}){const n=[],s=e.range(.62,.72),r=e.int(4,7),o=e.chance(.5)?8154022:9140920;for(let a=0;a<r;a++){const c=s+(1-s)*(a+.4)/r,l=i(c),h=(c-s)/(1-s),u=t*.028*(1-h**2.6*.42);for(let d=0;d<4;d++){const g=d/4*Math.PI*2+a*.7,y=new te(u,0);y.scale(.8,1.15,.8),y.translate(l.x+Math.cos(g)*u*.85,l.y,l.z+Math.sin(g)*u*.85),n.push({geometry:y,color:o,sway:c})}const f=new $(u*.5,u*.6,u*.8,5);f.translate(l.x,l.y-u*.9,l.z),n.push({geometry:f,color:9149051,sway:c})}return n}const wE=Kn("lavender",{height:[.5,.95],stemThickness:.007,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[8154022],centre:9149051,count:[16,30],spread:.26,leaves:1,nod:0,head:_E},.5);function xE({axis:i,height:t,rng:e}){const n=[],s=e.int(4,7);for(let d=0;d<s;d++){const g=.1+d/(s-1)*.78,y=i(g),m=t*e.range(.2,.34)*(1-g*.55),p=e.range(0,Math.PI*2)+d*1.9;for(const _ of[-1,1]){const v=m*e.range(.85,1.05),w=new R(y.x+Math.sin(p)*v*_,y.y-v*e.range(.25,.5),y.z+Math.cos(p)*v*_);n.push({geometry:Bt(y,w,.008,.003),color:6781258,sway:g});const M=e.int(3,5);for(let S=0;S<M;S++){const E=(S+.6)/(M+.4),A=new R().lerpVectors(y,w,E),x=m*.3*(1-Math.abs(E-.4)*.9);for(const b of[-1,1]){const T=new $t(x*e.range(.3,.42),x*1.4,3);T.translate(0,x*.7,0),T.scale(1,1,.28),T.rotateZ(b*e.range(1.05,1.4)),T.rotateY(p*_+b*e.range(.2,.5)),T.translate(A.x,A.y,A.z),n.push({geometry:T,color:e.chance(.25)?9149034:6257210,sway:g})}}}}const r=i(1),o=t*e.range(.055,.085),a=new te(o*.72,1);a.scale(.86,1.25,.86),a.translate(r.x,r.y+o*.85,r.z),n.push({geometry:a,color:6257210,sway:1});const c=9;for(let d=0;d<c;d++){const g=d/c*Math.PI*2+e.around(0,.2),y=o*e.range(.5,.8),m=new $t(o*e.range(.07,.1),y,3);m.translate(0,y*.45,0),m.scale(1,1,.4),m.rotateZ(e.range(1.7,2.1)),m.rotateY(g),m.translate(r.x,r.y+o*1.35,r.z),n.push({geometry:m,color:7046978,sway:1})}const l=18;for(let d=0;d<l;d++){const g=d/l*Math.PI*2+e.around(0,.15),y=e.range(.35,.85),m=o*e.range(.8,1.3),p=new $t(o*e.range(.035,.055),m,3);p.translate(0,m*.42,0),p.scale(1,1,.55),p.rotateZ(Math.PI/2-y*.8),p.rotateY(g),p.translate(r.x,r.y+o*e.range(.55,1),r.z),n.push({geometry:p,color:5335343,sway:1})}const h=e.int(26,38),u=r.y+o*1.5;for(let d=0;d<h;d++){const g=e.range(0,Math.PI*2),y=Math.sqrt(e()),m=y*.95,p=o*e.range(.75,1.15)*(1-y*.2),_=new $t(o*e.range(.035,.055),p,3);_.translate(0,p*.5-p*e.range(.1,.3),0),_.rotateZ(m),_.rotateY(g),_.translate(r.x+Math.sin(g)*o*.22*y,u,r.z+Math.cos(g)*o*.22*y),n.push({geometry:_,color:(v,w)=>w>u+p*.35?14711496:11029654,sway:1})}const f=new te(o*.34,0);return f.scale(1,.6,1),f.translate(r.x,u,r.z),n.push({geometry:f,color:9322366,sway:1}),n}const ME=Kn("thistle",{height:[.42,.9],stemThickness:.012,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[14711496],centre:11029654,count:[1,4],spread:.35,leaves:0,nod:0,head:xE},.55),bE=Kn("daisy",{height:[.16,.36],stemThickness:.009,headSize:[.034,.05],petals:12,reach:1.9,petalWidth:.24,cup:[.05,.3],petal:[15921124,15263450,15786726],centre:15254346,count:[14,26],spread:.42,leaves:0,nod:0},.45),SE=Kn("poppy",{height:[.42,.75],stemThickness:.011,headSize:[.032,.05],petals:5,reach:2.2,petalWidth:.62,cup:[.55,.95],petal:[12071978,12861484,11021364],centre:2761500,count:[4,9],spread:.5,leaves:1,nod:.25},.55),EE=Kn("sunflower",{height:[1.1,1.9],stemThickness:.022,headSize:[.1,.16],petals:16,reach:1.5,petalWidth:.3,cup:[.15,.5],petal:[15250746,14460460,15713106],centre:5981226,count:[3,7],spread:.4,leaves:2,nod:.85,facing:.6},.75),AE="gallery-foliage",TE=[RS,CS,LS,NS,US,HS,kS,BS,XS,qS,ZS,JS,Ip,KS,jS,eE,tE,QS,Tp,Ap,Rp,sE,rE,Cp,Pp,vE,ME,EE,mE,wE,SE,fE,bE,uE],RE={id:AE,name:"Foliage Gallery",builders:TE},CE="gallery-animal",PE=[Up,Fp,Op,zp,kp,Wp],IE={id:CE,name:"Animal Gallery",builders:PE},LE=22,DE=12,NE=16767392,_0=Math.SQRT2,UE={name:"streetlamp",category:"structures",radius:.9,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=[],r=e.range(2.9,3.6),o=e.range(.046,.062),a=e.range(.34,.5),c=e.chance(.35)?I.RUST:I.IRON,l=e.chance(.5)?I.STONE:I.STONE_DARK,h=o*6.2,u=new G(h,.15,h);u.translate(0,.075,0),n.push({geometry:u,color:U(l,e.around(1,.06)),sway:0});const f=new G(o*4.2,.12,o*4.2);f.translate(0,.2,0),n.push({geometry:f,color:U(c,1.05),sway:0});const d=.24,g=e.int(3,4),y=(r-d)/g;for(let ft=0;ft<g;ft++){const st=1-.28*(ft/g),gt=o*2*st,yt=new G(gt,y*1.06,gt);yt.translate(0,d+y*(ft+.5),0),n.push({geometry:yt,color:U(c,e.around(1,.07)),sway:0})}const m=o*2*(1-.28*(g-1)/g),p=m*.78,_=r-p*.62,v=new G(a+p,p,p);v.translate(a/2,_,0),n.push({geometry:v,color:U(c,.94),sway:0});const w=o*.5,M=_-e.range(.36,.5),S=a*.72,E=_-p*.5,A=S-w,x=E-M,b=Math.hypot(A,x)*1.18,T=new G(o*1.05,b,o*1.05);T.translate(0,b*.41,0),T.rotateZ(-Math.atan2(A,x)),T.translate(w,M,0),n.push({geometry:T,color:U(c,.88),sway:0});const P=new G(m*1.9,.07,m*1.9);if(P.translate(0,r-.02,0),n.push({geometry:P,color:U(c,1.1),sway:0}),e.chance(.5)){const ft=new $t(m*.6,.16,4);ft.rotateY(Math.PI/4),ft.translate(0,r+.07,0),n.push({geometry:ft,color:U(c,1),sway:0})}const C=a,F=_-p/2,N=e.range(.05,.1),D=new G(o*.8,N*1.6,o*.8);D.translate(C,F-N*.5,0),n.push({geometry:D,color:U(c,.86),sway:0});const B=e.range(.115,.145),H=e.range(.26,.34),V=F-N,et=.13,lt=new $(B*.45*_0,B*1.28*_0,et,4);lt.rotateY(Math.PI/4),lt.translate(C,V-et/2+.01,0),n.push({geometry:lt,color:U(c,1.02),sway:0});const Mt=o*.75;for(const ft of[-1,1])for(const st of[-1,1]){const gt=new G(Mt,H*1.1,Mt);gt.translate(C+ft*(B-Mt*.5),V-et-H/2+.02,st*(B-Mt*.5)),n.push({geometry:gt,color:U(c,.9),sway:0})}const Lt=V-et-H,J=o*.9,ot=B*2.2;for(const ft of[0,1])for(const st of[-1,1]){const gt=ft===0,yt=new G(gt?ot:J,.06,gt?J:ot-J*1.8),Gt=ot/2-J/2;yt.translate(C+(gt?0:st*Gt),Lt-.01,gt?st*Gt:0),n.push({geometry:yt,color:U(c,.8),sway:0})}const K=Lt+H*.5,Y=new ke(B*.5,0);Y.scale(1,1.6,1),Y.translate(C,K,0),s.push({geometry:Y,color:I.LAMPLIGHT,sway:0});const rt=vt(n),pt=vt(s),wt=e.range(0,Math.PI*2);rt.rotateY(wt),pt.rotateY(wt),t!==1&&(rt.scale(t,t,t),pt.scale(t,t,t));const Ft=bt(rt,"streetlamp",0);Ft.add(Mn(pt,"streetlamp:glow"));const nt=Math.cos(wt)*C*t,ht=-Math.sin(wt)*C*t,k=new zi(NE,LE*e.around(1,.12)*t*t,DE*t,2);return k.position.set(nt,K*t,ht),k.castShadow=!1,Ft.add(k),Ft}},FE={name:"hopper",category:"structures",radius:1.3,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.45,1.1),r=s*e.range(.14,.26),o=s*e.range(1.1,1.9),a=s*e.range(.25,.6),c=e.range(1.1,2.6),l=s*.05,h=U(7173499,e.range(.88,1.08)),u=U(I.IRON,e.range(.85,1.05)),f=e.chance(.45),d=c,g=c+o,y=g+a,m=[new tt(r,d),new tt(s,g),new tt(s,y),new tt(s-l,y),new tt(s-l,g),new tt(r-l*.6,d),new tt(r,d)],p=new Zn(m,6);n.push({geometry:p,color:f?(x,b)=>b<g?U(I.RUST,.9):h:h,sway:0});const _=new $(s*1.06,s*1.06,l*2.4,6);_.translate(0,y-l,0),n.push({geometry:_,color:U(u,1.05),sway:0});const v=new $(r*1.28,r*1.28,c*.45,6);v.translate(0,d-c*.18,0),n.push({geometry:v,color:U(u,.95),sway:0});const w=new G(r*2.4,r*.9,r*.28);w.rotateY(e.range(0,Math.PI)),w.translate(0,d-c*.34,0),n.push({geometry:w,color:U(I.RUST,1.08),sway:0});const M=4,S=s*1.05,E=g+a*.25;for(let x=0;x<M;x++){const b=x/M*Math.PI*2+Math.PI/4,T=new R(Math.sin(b)*S,0,Math.cos(b)*S),P=new R(Math.sin(b)*s*.88,E,Math.cos(b)*s*.88);n.push({geometry:Bt(T,P,.05,.042),color:u,sway:0});const C=new G(.18,.05,.18);C.translate(T.x,.025,T.z),n.push({geometry:C,color:U(u,.84),sway:0})}for(let x=0;x<M;x++){const b=x/M*Math.PI*2+Math.PI/4,T=(x+1)/M*Math.PI*2+Math.PI/4,P=C=>new R(Math.sin(C)*(S+s*.88)*.5,E*.45,Math.cos(C)*(S+s*.88)*.5);n.push({geometry:Bt(P(b),P(T),.032,.03),color:U(u,.88),sway:0})}const A=vt(n);return t!==1&&A.scale(t,t,t),bt(A,"hopper",0)}},OE={name:"ladder",category:"structures",radius:.4,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(2.4,4.6),r=e.range(.36,.48),o=e.range(.02,.028),a=.3,c=Math.floor(s/a),l=e.chance(.45),h=U(l?I.TIMBER:I.IRON,e.range(.85,1.05)),u=l?U(I.TIMBER_DARK,e.range(.9,1.1)):U(I.IRON,e.range(1,1.15));for(const d of[-1,1]){const g=new G(o*(l?2:1.5),s,o*(l?2.2:3));g.translate(d*r/2,s/2,0),n.push({geometry:g,color:h,sway:0})}for(let d=0;d<c;d++){const g=l?new G(r*1.02,o*1.5,o*1.5):new $(o*.72,o*.72,r*1.02,6);l||g.rotateZ(Math.PI/2),g.translate(0,a*(d+.6),0),n.push({geometry:g,color:u,sway:0})}const f=vt(n);return t!==1&&f.scale(t,t,t),bt(f,"ladder",0)}},zE={name:"panel",category:"structures",radius:.9,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(1,1.5),r=e.range(.85,1.15),o=e.range(.35,.6),a=e.range(.18,.26),c=U(I.IRON,e.range(.85,1.05)),l=e.chance(.5)?3093304:3814192,h=10124348,u=new G(s*.94,o,a*1.15);u.translate(0,o/2,0),n.push({geometry:u,color:U(c,.8),sway:0});const f=e.range(.1,.2),d=new G(s,r,a*.5);d.rotateX(-f),d.translate(0,o+r/2,a*.16),n.push({geometry:d,color:l,sway:0});for(const[E,A,x]of[[s*1.06,.06,o],[s*1.06,.06,o+r]]){const b=new G(E,A,a*.62);b.rotateX(-f),b.translate(0,x,a*.16+(x>o+.1?-r*f*.5:r*f*.5)),n.push({geometry:b,color:c,sway:0})}const g=e.int(3,5),y=e.int(2,3),m=s*.84/g,p=r*.78/y,_=o+r/2,v=a*.16,w=a*.25,M=(E,A)=>{const x=-s*.42+m*(E+.5),b=r*.4-p*(A+.5)+p*.5;return new R(x,_+b*Math.cos(f)+w*Math.sin(f),v-b*Math.sin(f)+w*Math.cos(f))};for(let E=0;E<y;E++)for(let A=0;A<g;A++){const x=M(A,E),b=E===0,T=e(),P=b?T<.6?"gauge":T<.8?"lamp":"dial":T<.4?"lever":T<.65?"knife":T<.85?"button":"dial";if(P==="gauge"){const C=Math.min(m,p)*.36,F=new $(C,C,a*.3,10);F.rotateX(Math.PI/2-f),F.translate(x.x,x.y,x.z),n.push({geometry:F,color:h,sway:0});const N=new $(C*.76,C*.76,a*.34,10);N.rotateX(Math.PI/2-f),N.translate(x.x,x.y,x.z+a*.04),n.push({geometry:N,color:14209726,sway:0});const D=e.range(-1.1,1.1),B=new G(C*.09,C*1.25,a*.12);B.translate(0,C*.5,0),B.rotateZ(D),B.rotateX(-f),B.translate(x.x,x.y,x.z+a*.1),n.push({geometry:B,color:2367260,sway:0})}else if(P==="lamp"){const C=Math.min(m,p)*.18,F=new $(C*1.5,C*1.5,a*.26,8);F.rotateX(Math.PI/2-f),F.translate(x.x,x.y,x.z),n.push({geometry:F,color:U(c,.9),sway:0});const N=new $t(C*1.15,C*1.5,8);N.rotateX(Math.PI/2-f),N.translate(x.x,x.y,x.z+a*.14),n.push({geometry:N,color:e.chance(.5)?12075052:10135610,sway:0})}else if(P==="dial"){const C=Math.min(m,p)*.22,F=new $(C,C,a*.4,8);F.rotateX(Math.PI/2-f),F.translate(x.x,x.y,x.z+a*.08),n.push({geometry:F,color:U(c,1.18),sway:0});const N=new G(C*.24,C*1.5,a*.16);N.translate(0,C*.7,0),N.rotateZ(e.range(-2.4,2.4)),N.rotateX(-f),N.translate(x.x,x.y,x.z+a*.22),n.push({geometry:N,color:h,sway:0})}else if(P==="button")for(let C=0;C<3;C++){const F=Math.min(m,p)*.11,N=x.x+(C-1)*m*.26,D=new $(F,F*1.2,a*.34,8);D.rotateX(Math.PI/2-f),D.translate(N,x.y,x.z+a*.06),n.push({geometry:D,color:C===0?10135610:C===2?12075052:U(c,1.2),sway:0})}else if(P==="knife"){const C=m*.34;for(const D of[-1,1]){const B=new G(C*.34,p*.16,a*.34);B.rotateX(-f),B.translate(x.x+D*C,x.y-p*.12,x.z+a*.06),n.push({geometry:B,color:h,sway:0})}const F=e.chance(.5),N=new G(C*2.2,p*.1,a*.16);N.rotateZ(F?0:e.range(.6,1)),N.rotateX(-f),N.translate(x.x,x.y-p*(F?.12:-.05),x.z+a*.14),n.push({geometry:N,color:U(h,1.15),sway:0})}else{const C=p*e.range(.55,.85),F=e.range(-.9,.9),N=new $(.013,.018,C,5);N.translate(0,C/2,0),N.rotateZ(F),N.rotateX(-f-.85),N.translate(x.x,x.y-p*.2,x.z+a*.06),n.push({geometry:N,color:U(c,1.15),sway:0});const D=new te(.03,0);D.translate(x.x+Math.sin(F)*-C,x.y-p*.2+Math.cos(F)*C*.66,x.z+a*.06+C*.7),n.push({geometry:D,color:e.chance(.5)?I.RUST:h,sway:0})}}const S=vt(n);return t!==1&&S.scale(t,t,t),bt(S,"panel",0)}},kE={name:"stair",category:"structures",radius:2.2,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.17,.2),r=e.range(.23,.27),o=e.int(11,16),a=e.range(.85,1.05),c=s*o,l=r*o,h=U(I.IRON,e.range(.85,1.05)),u=U(I.IRON,e.range(.95,1.15)),f=Math.atan2(c,l),d=Math.hypot(c,l);for(const M of[-1,1]){const S=new G(.06,.28,d+.2);S.rotateX(f),S.translate(M*a/2,c/2-.06,-l/2),n.push({geometry:S,color:h,sway:0})}for(let M=0;M<o;M++){const S=new G(a*.94,.035,r*.72);S.translate(0,s*(M+1),-r*(M+.5)),n.push({geometry:S,color:u,sway:0});const E=new G(a*.94,.05,.03);E.translate(0,s*(M+1)-.012,-r*(M+.5)-r*.36),n.push({geometry:E,color:U(u,.86),sway:0})}const g=e.range(.9,1.3),y=new G(a+.12,.07,g);y.translate(0,c,-l-g/2+.02),n.push({geometry:y,color:U(u,1.06),sway:0});for(const M of[-1,1]){const S=new $(.045,.05,c,6);S.translate(M*a/2,c/2,-l-g+.12),n.push({geometry:S,color:U(h,.9),sway:0})}const m=e.chance(.5)?1:-1,p=1.05,_=4;for(let M=0;M<=_;M++){const S=M/_,E=new $(.022,.026,p,6);E.translate(m*a/2,s*o*S+p/2,-l*S),n.push({geometry:E,color:h,sway:0})}const v=new $(.026,.026,d+.16,6);v.rotateX(Math.PI/2+f),v.translate(m*a/2,c/2+p,-l/2),n.push({geometry:v,color:U(h,1.12),sway:0});const w=vt(n);return t!==1&&w.scale(t,t,t),bt(w,"stair",0)}},BE={name:"workbench",category:"furniture",radius:1.2,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(1.4,2.1),r=e.range(.6,.75),o=e.range(.86,.92),a=e.range(.06,.09),c=U(I.IRON,e.range(.85,1.05)),l=U(I.TIMBER,e.range(.82,1)),h=e.int(3,5);for(let A=0;A<h;A++){const x=new G(s,a,r/h*.97);x.translate(0,o-a/2,-r/2+r/h*(A+.5)),n.push({geometry:x,color:U(l,e.range(.9,1.12)),sway:0})}const u=e.range(.032,.045),f=.1;for(const A of[-1,1])for(const x of[-1,1]){const b=new G(u*2,o-a,u*2);b.translate(A*(s-f*2)/2,(o-a)/2,x*(r-f*2)/2),n.push({geometry:b,color:c,sway:0})}for(const A of[-1,1]){const x=new G(s-f*2,u*1.5,u*1.4);x.translate(0,o*.22,A*(r-f*2)/2),n.push({geometry:x,color:U(c,.86),sway:0})}if(e.chance(.6)){const A=new G(s-f*2.4,.03,r-f*2.4);A.translate(0,o*.26,0),n.push({geometry:A,color:U(l,.8),sway:0})}if(!e.chance(.5)){const A=vt(n);return t!==1&&A.scale(t,t,t),bt(A,"workbench",0)}const d=s*e.range(.2,.34)*(e.chance(.5)?1:-1),g=r/2,y=e.range(.13,.18),m=e.range(.02,.12),p=new G(y*1.1,y*.85,y*1.5);p.translate(d,o+y*.42,g-y*.35),n.push({geometry:p,color:U(c,1.1),sway:0});for(const[A,x]of[[g+m*.5,1],[g-m*.5-y*.28,.95]]){const b=new G(y*1.25*x,y*.7,y*.24);b.translate(d,o+y*.5,A),n.push({geometry:b,color:U(c,1.2),sway:0})}const _=new $(y*.11,y*.11,y*1.1,6);_.rotateX(Math.PI/2),_.translate(d,o+y*.5,g+y*.55),n.push({geometry:_,color:U(c,1.25),sway:0});const v=e.range(0,Math.PI),w=y*.8,M=new R(d,o+y*.5,g+y*1.02),S=[-1,1].map(A=>new R(M.x+Math.cos(v)*w*A,M.y+Math.sin(v)*w*A,M.z));n.push({geometry:Bt(S[0],S[1],y*.06,y*.06,5),color:U(c,1.1),sway:0});for(const A of S){const x=new te(y*.085,0);x.translate(A.x,A.y,A.z),n.push({geometry:x,color:U(c,1.2),sway:0})}const E=vt(n);return t!==1&&E.scale(t,t,t),bt(E,"workbench",0)}},HE="gallery-village",GE="gallery-factory",VE=[ar,Eh,Bp,KM,Lp,Dp,UE,Np,Ep,Gp,Vp,Vo,Wo,Ol,Bl,Xo,Nl,Ul,ap,zl,mp,yp,gp,Mp,bp,xp,_p,vp,wp],WE={id:HE,name:"Village Gallery",builders:VE},XE=[Fl,Hp,up,FE,hp,Sp,dp,BE,zE,Ah,kE,OE,fp,pp,Po],qE={id:GE,name:"Factory Gallery",builders:XE},jp=8,YE=1.4,Vl=If,Ch=16,w0=new ln({color:3813928,flatShading:!0}),$E=new ln({color:12168594,flatShading:!0}),ZE=new ln({color:2827808,flatShading:!0});function KE(i,t,e){let n=2166136261;for(let h=0;h<i.length;h++)n=Math.imul(n^i.charCodeAt(h),16777619);const s=xt(n>>>0),r=[],o=t*.1,a=t-o*2,c=2+(s.chance(.45)?1:0),l=e/(c+.9);for(let h=0;h<c;h++){const u=e/2-l*(h+.95),f=h===c-1?s.range(.4,.8):s.range(.82,1);let d=-a/2;const g=-a/2+a*f;for(;d<g;){const y=Math.min(s.range(a*.08,a*.26),g-d);if(y<a*.04)break;const m=new ee(new G(y,l*s.range(.3,.42),.008),ZE);m.position.set(d+y/2,u,0),r.push(m),d+=y+a*s.range(.045,.09)}}return r}function Jp(i){const t=new we;t.name=`sign:${i}`;const e=Pf.eyeHeight*.68,n=new ee(new G(.09,e,.09),w0);n.position.y=e/2,t.add(n);const s=.62,r=.26,o=new we;o.position.set(0,e-.1,.045),o.rotation.x=-.16;const a=new ee(new G(s,r,.05),$E);o.add(a);for(const l of KE(i,s,r))l.position.z+=.026,o.add(l);t.add(o);const c=new ee(new G(.13,.05,.13),w0);return c.position.y=e+.02,t.add(c),GM(t,jE(i))}function jE(i){return i.split("-").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}function Qp(i){const t=[];let e=0;for(let n=0;n<i.length;n++){t.push(e);const s=i[n+1];s&&(e+=i[n].radius+s.radius+YE)}return{offsets:t,width:e}}function JE(i){const t=new we;t.name="rows";const{offsets:e,width:n}=Qp(i),s=-n/2;for(let r=0;r<i.length;r++){const o=i[r],a=s+e[r],c=new we;c.name=`row:${o.name}`;const l=Jp(o.name);l.position.set(a,0,Vl),c.add(l);for(let h=0;h<jp;h++){const u=o.build({seed:1e3+h*7919});u.position.set(a,0,-h*Vl),c.add(o.solid===!1?u:Ee(u))}t.add(c)}return t}function Tc(i){const{width:t}=Qp(i),e=Math.max(t,Ch+jp*Vl)+40;return Math.min(200,Math.max(120,Math.ceil(e/20)*20))}function x0(i){return i*.46}function QE(i){return{zone:i.id,position:new R(0,0,Ch),yaw:Math.PI,material:"timber",seed:3300+i.id.length*137}}function tA(i){return{id:i.id,name:i.name,environment:{...oa,fogNear:x0(Tc(i.builders))*.45,fogFar:x0(Tc(i.builders)),ambientGround:12563096,surface:"stone",room:"open",soundscape:i.soundscape??np},spawn:{position:new R(0,.1,Ch-2),yaw:0},floor:-20,groundAt:()=>0,build(){const t=new we;t.add(Mh(Tc(i.builders))),t.add(JE(i.builders));for(const e of i.extras?.()??[])t.add(e);return t}}}function eA(i,t){return{id:`portal:${i.id}`,a:t,b:QE(i)}}const nA=[RE,IE,WE,qE],iA="sound-stage",Wl=If*1.5,tm=14,Io=1.15,He={refDistance:2,maxDistance:42,rolloff:1.2,reverb:.4},Es=[{kind:"emitter",name:"wind",spec:{model:"wind",id:"wind",options:{gain:.3},...He}},{kind:"emitter",name:"foliage",spec:{model:"foliage",id:"foliage",options:{gain:.4},...He}},{kind:"emitter",name:"rain",spec:{model:"rain",id:"rain",options:{gain:.5,intensity:.6,surface:"earth"},...He}},{kind:"emitter",name:"water",spec:{model:"water",id:"water",options:{gain:.4},...He}},{kind:"scatter",name:"drip",spec:{sound:"drip",id:"drip",every:3.5,spread:[.2,.1,.2],...He}},{kind:"emitter",name:"fire",spec:{model:"fire",id:"fire",options:{gain:.5},...He}},{kind:"emitter",name:"machine",spec:{model:"machine",id:"machine",options:{gain:.35},...He}},{kind:"emitter",name:"friction",spec:{model:"friction",id:"friction",options:{motion:"steady",speed:.28,gain:.4},...He}},{kind:"emitter",name:"waveguide",spec:{model:"waveguide",id:"waveguide",options:{excite:"chime",pitch:900,decay:3,bright:.7,drive:.3,gain:.4},...He}},{kind:"scatter",name:"hammer",spec:{sound:"hammer",id:"hammer",every:4,spread:[.3,.2,.3],...He}},{kind:"scatter",name:"clatter",spec:{sound:"clatter",id:"clatter",every:6,spread:[.5,.2,.5],...He}},{kind:"emitter",name:"bird",spec:{model:"bird",id:"bird",options:{gain:.2},...He}},{kind:"emitter",name:"crowd",spec:{model:"crowd",id:"crowd",options:{gain:.4},...He}},{kind:"scatter",name:"animal",spec:{sound:"animal",id:"animal",every:5,spread:[.4,.2,.4],...He}},{kind:"scatter",name:"bell",spec:{sound:"bell",id:"bell",every:11,spread:[.2,.1,.2],...He,reverb:1}}],sA=Es.map(i=>i.spec.id);function Xl(i){return[-((Es.length-1)*Wl)/2+i*Wl,Io+.25,0]}const rA={emitters:Es.flatMap((i,t)=>i.kind==="emitter"?[{...i.spec,at:Xl(t)}]:[]),scatter:Es.flatMap((i,t)=>i.kind==="scatter"?[{...i.spec,at:Xl(t)}]:[])},oA=new ln({color:U(I.STONE,.94),flatShading:!0}),aA=new ln({color:U(I.STONE_PALE,1.02),flatShading:!0});function cA(i,t){const e=new we;e.name=`station:${i}`;const n=new ee(new G(.8,Io,.8),oA);n.position.set(t,Io/2,0),e.add(Ee(n));const s=new ee(new G(1,.09,1),aA);s.position.set(t,Io+.045,0),e.add(Ee(s));const r=Jp(i);return r.position.set(t,0,1.5),e.add(r),e}function Rc(){const i=(Es.length-1)*Wl+tm*2+40;return Math.min(200,Math.max(120,Math.ceil(i/20)*20))}function lA(){return{id:iA,name:"Sound Stage",environment:{...oa,fogNear:Rc()*.2,fogFar:Rc()*.46,ambientGround:12563096,surface:"stone",room:"open",soundscape:rA},spawn:{position:new R(0,.1,tm-2),yaw:0},floor:-20,groundAt:()=>0,build(){const i=new we;return i.add(Mh(Rc())),Es.forEach((t,e)=>{i.add(cA(t.name,Xl(e)[0]))}),i}}}const Pi="exterior",M0="example",b0="factory",S0=new R(5,0,6),Cc=0,hA=new R(14,0,6),uA=0,Pc=.07,dA=new R(10,0,6),fA=0,Ic=new R(-10,0,22),pA=5,mA=Math.PI,Lc={width:10,depth:8,height:3.4},os={width:15,depth:11,height:5.6},gA=new R(0,1,0),ql=new R(19.7,0,0),yA=Math.PI/2,Zs=new R(25.5,0,2.4),vA=[ql.x-.14,1.2,ql.z],Yl=-5.4,$l=[-2.4,1.1,4.4],Zl=[1.5,.9,1.9],Kl=[-1.8,2.6,2.4],jl=[15/2-.34,1.5,1.6],_A={emitters:[{model:"machine",id:"engine-north",at:[Yl+1,1.1,$l[0]],options:{rpm:74,fundamental:52,gain:.15,wear:.55,clank:.45},refDistance:1.4,maxDistance:22,rolloff:1.7,reverb:.3},{model:"machine",id:"engine-south",at:[Yl+1,1.1,$l[2]],options:{rpm:46,fundamental:35,gain:.16,wear:.8,clank:.7},refDistance:1.4,maxDistance:22,rolloff:1.7,reverb:.35},{model:"friction",id:"gantry",at:Kl,options:{motion:"cycle",speed:.26,force:.8,pitch:210,decay:1.4,bright:.4,roughness:.22,gain:.18},refDistance:1.6,maxDistance:22,rolloff:1.5,reverb:.8,importance:1.5},{model:"waveguide",id:"pipe-air",at:jl,options:{excite:"breath",closed:!0,pitch:190,decay:.9,bright:.28,drive:.55,gain:.3},refDistance:1.2,maxDistance:9,rolloff:1.8,reverb:.4}],scatter:[{sound:"clatter",id:"fitting",at:Zl,spread:[1.1,.4,1.1],every:17,force:[.3,.85],options:{material:"metal",gain:.2,pieces:3},refDistance:1.8,maxDistance:22,rolloff:1.3,reverb:.85}]};function wA(i){return{zone:Pi,position:new R(Ic.x+i*pA,Ic.y,Ic.z),yaw:mA,material:"timber",seed:5200+i*17}}function xA(i){const t=Eh.build({seed:5511});t.position.copy(S0),t.rotation.y=Cc;const e=pb(t),n=new R(e.x,0,e.z+Pc).applyAxisAngle(gA,Cc).add(S0),s=[{id:Pi,name:"Outside",environment:{...oa,ambientGround:12563096,soundscape:{bed:{model:"wind",id:"wind",options:{gain:.17,tone:3400}},emitters:[{model:"foliage",id:"canopy",at:[i.anchors.tree.x,i.anchors.tree.y,i.anchors.tree.z],options:{density:240,tone:.8,gain:.42,articulation:.22},refDistance:2.5,maxDistance:20,rolloff:1.7,reverb:.35},{model:"friction",id:"limb",at:[i.anchors.tree.x-.4,i.anchors.tree.y-1.2,i.anchors.tree.z],options:{motion:"weather",speed:.22,force:.7,pitch:78,decay:.35,bright:.2,roughness:.4,gain:.4},refDistance:2,maxDistance:22,rolloff:1.6,reverb:.3},{model:"foliage",id:"shrub-a",at:[i.anchors.bush.x,i.anchors.bush.y,i.anchors.bush.z],options:{density:160,tone:1.45,gain:.26,articulation:.34},refDistance:1.4,maxDistance:14,reverb:.25},{model:"foliage",id:"shrub-b",at:[9.2,.5,16.8],options:{density:160,tone:1.45,gain:.26,articulation:.34},refDistance:1.4,maxDistance:14,reverb:.25},{model:"bird",id:"bird",at:[i.anchors.bird.x,i.anchors.bird.y,i.anchors.bird.z],options:{pitch:2600,interval:6,gain:.075,tone:2800},refDistance:4,maxDistance:38,rolloff:1.4,reverb:.85},{model:"machine",id:"mill",at:[i.anchors.machine.x,i.anchors.machine.y,i.anchors.machine.z],options:{rpm:52,fundamental:42,gain:.4},refDistance:2.5,maxDistance:34,rolloff:1.8,reverb:.9,importance:1.6},{model:"water",id:"cistern",at:[Zs.x,Zb,Zs.z],options:{flow:"cistern",gain:.4,tone:.9},refDistance:1.5,maxDistance:12,rolloff:1.6,reverb:1}],scatter:[{sound:"drip",id:"seep",at:vA,spread:[.3,0,.3],every:3.6,rhythm:"periodic",force:[.7,1],voices:1,options:{gain:.5,radius:[.0019,.0027],cycles:32},refDistance:2,maxDistance:16,rolloff:1.4,reverb:1},{sound:"drip",id:"seep-far",at:[Zs.x,1.4,Zs.z],spread:[.3,0,.3],every:7.1,rhythm:"periodic",force:[.5,.8],voices:1,options:{gain:.4,radius:[.0031,.0042],cycles:26},refDistance:2,maxDistance:16,rolloff:1.4,reverb:1}]}},spawn:{position:a2.clone(),yaw:0},floor:-20,build(){const o=i.root;o.add(Ee(t));const a=Ah.build({seed:8811});a.position.copy(ql),a.rotation.y=yA,o.add(Ee(a));const c=Ep.build({seed:8812});return c.position.copy(Zs),o.add(Ee(c)),o}},{id:M0,name:"Example Interior",environment:{...Yd,room:"cell",surface:"wood",fogColor:"#181309",fogNear:9,fogFar:34,ambientSky:10655612,ambientGround:5721148,ambientIntensity:2.3,sunIntensity:1.2,fillIntensity:.8,fillColor:10521706,footstepReverb:.45},spawn:{position:new R(0,.1,1),yaw:Math.PI},floor:-5,build:()=>MA()},{id:b0,name:"The Factory",environment:{...Yd,room:"hall",surface:"stone",fogColor:"#111519",fogNear:12,fogFar:48,ambientSky:8161172,ambientGround:9077624,ambientIntensity:2.2,sunIntensity:.9,fillIntensity:.85,fillColor:9675701,footstepReverb:.34,soundscape:_A},spawn:{position:new R(0,.1,2),yaw:Math.PI},floor:-5,build:()=>bA()},ES()],r=[{id:"example-door",a:{zone:Pi,position:n,yaw:Cc,material:"timber",seed:8801},b:{zone:M0,position:new R(0,0,-8/2+Pc),yaw:0,material:"timber",seed:8802}},{id:"factory-door",a:{zone:Pi,position:hA,yaw:uA,material:"iron",seed:9301},b:{zone:b0,position:new R(0,0,-11/2+Pc),yaw:0,material:"iron",seed:9302}},{id:"village-gate",a:{zone:Pi,position:dA,yaw:fA,material:"timber",seed:4712},b:{zone:Rh,position:Li.clone().setY(bS.heightAt(Li.x,Li.z)),yaw:Math.PI,material:"timber",seed:4713}}];return nA.forEach((o,a)=>{s.push(tA(o)),r.push(eA(o,wA(a)))}),s.push(lA()),{zones:s,portals:r}}function MA(){const i=new we;i.add(op({...Lc,seed:4400,style:rp,planks:!0,beams:3}));const t=Lc.width/2,e=Lc.depth/2;ie(i,mp.build({seed:8801}),-t+.12,0,.4,Math.PI/2),ie(i,zl.build({seed:8810}),-2.6,0,e-.1,Math.PI),ie(i,zl.build({seed:8811}),2.4,0,e-.1,Math.PI),ie(i,gp.build({seed:8820}),t-.35,0,-1.6,-Math.PI/2),ie(i,ap.build({seed:3120}),-t+.95,0,-2.5,0);const n=vp.build({seed:8830});ie(i,n,-t+1,0,-1,.06);const s=Xo.build({seed:2077});ie(i,s,.6,0,.9,.08),ie(i,Nl.build({seed:411}),-.5,0,1.5,Math.PI*.4),ie(i,Nl.build({seed:412}),.9,0,-.4,.1),ie(i,Ul.build({seed:413}),1.7,0,.4,.4),ie(i,Ul.build({seed:415}),-t+1.6,0,.2,-.5),ie(i,Mp.build({seed:8840}),-2.9,0,e-2.2,Math.PI*.85);const r=Xo.build({seed:2078});ie(i,r,-.2,0,e-.8,Math.PI),ie(i,yp.build({seed:8850}),2.6,0,-e+.35,0),ie(i,_p.build({seed:8860}),-t+.75,0,3.3,.4),ie(i,xp.build({seed:8870}),-t+.16,0,2.4,Math.PI/2),ie(i,bp.build({seed:8880}),-1.5,0,-e+.14,0),ie(i,wp.build({seed:8890}),-2.3,0,-e+.45,.25),ie(i,ar.build({seed:6602}),.4,0,2.1,Math.PI*.9);const o=Vo.build({seed:61});return ie(i,o,t-.9,0,-e+1,.4),ie(i,Wo.build({seed:67}),t-.7,0,-.2,.2),ie(i,Ol.build({seed:7101}),.75,Mo(s),.65,.6),ie(i,Ol.build({seed:7102}),-.35,Mo(r),e-.85,-.4),ie(i,Bl.build({seed:7103}),t-.95,Mo(o),-e+1,.9),ie(i,Bl.build({seed:7104}),-t+1.05,Mo(n),-1.05,-.5),Ee(i)}function bA(){const i=new we;i.add(op({...os,seed:7700,style:fb,planks:!1,beams:0}));const t=os.width/2,e=os.depth/2,n=Yl;$l.forEach((l,h)=>{ie(i,Fl.build({seed:3301+h}),n,0,l,Math.PI/2)}),ie(i,up.build({seed:4401}),5.1,0,2.1,Math.PI/2),ie(i,Fl.build({seed:3304}),Zl[0],0,Zl[2],-.35);const s=[[-3.6,-e+.34,0],[3.6,-e+.34,0],[jl[0],jl[2],Math.PI/2],[t-.34,-2.4,Math.PI/2]];for(let l=0;l<s.length;l++){const[h,u,f]=s[l],d=hp.build({seed:9101+l});d.position.set(h,0,u),d.rotation.y=f,i.add(d)}const r=dp.build({seed:9201});r.position.set(t-.22,1.4,-1.4),r.rotation.y=-Math.PI/2,i.add(r);const o=new ln({color:U(I.IRON,.92),flatShading:!0}),a=os.height-.12,c=.42;for(const l of[-4.2,-1.4,1.4,4.2]){const h=new we;for(const[d,g]of[[a,.13],[a-c,.1]]){const y=new ee(new G(os.width,g,g*1.25),o);y.position.set(0,d,0),h.add(y)}const u=9,f=os.width/u;for(let d=0;d<u;d++){const g=new ee(new G(.07,Math.hypot(f,c),.09),o);g.position.set(-15/2+f*(d+.5),a-c/2,0),g.rotation.z=(d%2===0?1:-1)*Math.atan2(f,c),h.add(g)}h.position.z=l,i.add(h)}return ie(i,fp.build({seed:9301}),n+1.9,0,1,Math.PI/2),ie(i,pp.build({seed:9302}),2.4,0,e-.7,0),ie(i,Ah.build({seed:9401}),t-.55,0,-e+1.5,-Math.PI/2),ie(i,Sp.build({seed:8110}),Kl[0],0,Kl[2],Math.PI/2),ie(i,Po.build({seed:5501}),-.6,0,-2.4,-Math.PI/2),ie(i,Po.build({seed:5502}),-.6,0,4.4,-Math.PI/2),ie(i,Po.build({seed:5503}),1.2,0,-.6,Math.PI/2),Ee(i)}function Mo(i){return i.geometry.computeBoundingBox(),(i.geometry.boundingBox?.max.y??0)+i.position.y}function ie(i,t,e,n,s,r){t.position.set(e,n,s),t.rotation.y=r,i.add(t)}const bo=[0,125,250,500,1e3,2e3,5e3,1e4];function SA(i){let t=0,e=0,n=0;for(let r=0;r<i.length;r++){const o=i[r],a=Math.abs(o);a>t&&(t=a),e+=o,n+=o*o}const s=Math.sqrt(n/Math.max(i.length,1));return{peak:t,rms:s,dc:e/Math.max(i.length,1),crest:s>1e-9?20*Math.log10(t/s):0}}function EA(i,t){const e=Math.min(i.length,16384),n=12,s=l=>{let h=0,u=0;const f=2*Math.PI*l/t;for(let d=0;d<e;d++){const g=f*d;h+=i[d]*Math.cos(g),u+=i[d]*Math.sin(g)}return(h*h+u*u)/e},r=[];let o=0,a=0;for(let l=0;l<bo.length;l++){const h=Math.max(bo[l],20),u=l+1<bo.length?bo[l+1]:Math.min(t/2,2e4);let f=0;for(let d=0;d<n;d++){const g=h*Math.pow(u/h,(d+.5)/n),y=s(g);f+=y,o+=y*g,a+=y}r.push(f)}const c=r.reduce((l,h)=>l+h,0);return{bands:c>0?r.map(l=>l/c):r.map(()=>0),centroid:a>0?o/a:0}}function AA(i,t){if(t<=1e-9)return-1/0;const e=[.15,.4,.7,.95,1.1,1.15,.9,.5];let n=0;for(let s=0;s<i.length;s++)n+=i[s]*(e[s]??.5);return 20*Math.log10(t)+10*Math.log10(Math.max(n,1e-6))}function TA(i,t){const e=SA(i),{bands:n,centroid:s}=EA(i,t);return{...e,bands:n,centroid:s,loudness:AA(n,e.rms)}}function RA(i,t){let e=0;for(let a=0;a<i.length;a++)e+=i[a];e/=Math.max(i.length,1);let n=0;for(let a=0;a<i.length;a++)n+=(i[a]-e)**2;if(n/=Math.max(i.length,1),n<1e-12)return 0;const s=a=>{if(a>=i.length)return 0;let c=0;for(let l=0;l+a<i.length;l++)c+=(i[l]-e)*(i[l+a]-e);return Math.abs(c/((i.length-a)*n))},r=t.map(s),o=r.findIndex(a=>a<.2);return o===-1?1:Math.max(0,...r.slice(o))}const Ks=1024,CA=6,E0=new R;function PA(i,t){const e={context:i,settings:{...Bf},weather:new Of,noise:Ff(i),dry:i.createGain(),send:i.createGain(),register:()=>{},unregister:()=>{}};return e.dry.connect(t),e.send.connect(t),e}async function IA(i,t=48e3){const e=i.seconds??CA,n=Math.ceil(e*t/Ks)*Ks,s=new OfflineAudioContext(1,n,t),r=PA(s,s.destination),o=i.build(r);o.output.connect(s.destination),i.ready&&await i.ready(o);const a=Ks/t,c=Math.floor(n/Ks);for(let h=1;h<c;h++)s.suspend(h*Ks/t).then(()=>{r.weather.update(a),o.update?.(a,r,E0),s.resume()});return r.weather.update(a),o.update?.(a,r,E0),{signal:(await s.startRendering()).getChannelData(0),model:o,rate:t}}const LA={peak:.95,dc:.01,periodicity:.35,crest:{_comment:["Peak over average, in dB, and it means opposite things for the two","kinds of source — which is why there are two bands rather than one.","A continuous texture with a very high crest is bubble wrap: audible","individual grains. An impulsive source with a *low* one has lost its","transient and turned into a wash. Bounds are drawn wide around the","first captured run rather than derived; the drift check below is the","sharp instrument, and these only catch a model that has fallen over."],texture:[4,26],event:[12,36]}},DA={loudness:1.5,crest:2.5,centroid:.5},NA={wind:{loudness:-46.69,crest:23.33,centroid:121,bands:[.6522,.2851,.0387,.012,.0116,5e-4,0,0]},foliage:{loudness:-41.22,crest:15.96,centroid:1230,bands:[.0262,.0512,.1118,.3525,.2948,.1401,.0225,9e-4]},rain:{loudness:-37.53,crest:14.73,centroid:1062,bands:[.0363,.1044,.1761,.253,.3241,.0975,.0082,4e-4]},water:{loudness:-38.89,crest:15.12,centroid:741,bands:[.1976,.1233,.1289,.2884,.2154,.0417,.0047,1e-4]},fire:{loudness:-32.04,crest:13.58,centroid:558,bands:[.2647,.5285,.0244,.0299,.0722,.0644,.0114,.0046]},machine:{loudness:-26.53,crest:11.53,centroid:69,bands:[.8421,.141,.0164,5e-4,0,0,0,0]},friction:{loudness:-30.89,crest:6.46,centroid:200,bands:[.3474,.5838,.0541,.0094,.0042,.0011,0,0]},waveguide:{loudness:-33.2,crest:27.71,centroid:857,bands:[3e-4,9e-4,.5233,.2708,.1788,.0165,.0049,.0044]},bird:{loudness:-29.91,crest:16.97,centroid:2340,bands:[2e-4,2e-4,2e-4,3e-4,6e-4,.9979,6e-4,0]},crowd:{loudness:-37.17,crest:17.34,centroid:566,bands:[.0078,.0791,.1582,.7432,.0115,2e-4,0,0]},hammer:{loudness:-37.04,crest:26.58,centroid:144,bands:[.1803,.8117,.0051,1e-4,.0022,5e-4,0,0]},clatter:{loudness:-50.07,crest:26.39,centroid:109,bands:[.806,.1784,.0094,.0051,9e-4,1e-4,0,0]},animal:{loudness:-36.57,crest:22.36,centroid:776,bands:[0,4e-4,.1835,.7314,.0769,.0076,1e-4,0]},drip:{loudness:-44.1,crest:30.46,centroid:600,bands:[.171,.1695,.1649,.1835,.3106,5e-4,1e-4,0]},bell:{loudness:-33.5,crest:19.34,centroid:130,bands:[.6331,.3079,.056,.0028,2e-4,0,0,0]}},UA={rules:LA,drift:DA,models:NA},qo=UA;function js(i,t,e,n=8){return{name:i,kind:"event",seconds:n,build(s){const r=ep(s,t);let o=0;return{output:r.output,update(a){o-=a,!(o>0)&&(o=e,r.fire(s.context.currentTime+.05,.45+Math.random()*.55))},dispose:()=>r.dispose()}}}}const FA=[{name:"wind",seconds:12,build:i=>Gf(i)},{name:"foliage",seconds:12,build:i=>Wf(i)},{name:"rain",seconds:8,build:i=>Zf(i,{intensity:.6})},{name:"water",seconds:8,build:i=>Kf(i)},{name:"fire",seconds:8,build:i=>Yf(i)},{name:"machine",seconds:12,build:i=>Xf(i)},{name:"friction",seconds:10,build:i=>Qf(i,{motion:"steady"}),ready:i=>i.ready},{name:"waveguide",kind:"event",seconds:10,build:i=>tp(i,{excite:"chime",drive:.3}),ready:i=>i.ready},{name:"bird",kind:"event",seconds:16,build:i=>qf(i)},{name:"crowd",seconds:10,build:i=>Jf(i)},js("hammer",{sound:"hammer"},1.1),js("clatter",{sound:"clatter"},1.6),js("animal",{sound:"animal"},1.8),js("drip",{sound:"drip"},.9),js("bell",{sound:"bell"},3.5,12)];function OA(i,t){const e=Math.round(t*.05),n=Math.floor(i.length/e),s=new Float32Array(n);for(let r=0;r<n;r++){let o=0;for(let a=0;a<e;a++){const c=i[r*e+a];o+=c*c}s[r]=Math.sqrt(o/e)}return s}function zA(i,t,e){const n=[],{rules:s}=qo,[r,o]=s.crest[e];return i.peak>s.peak&&n.push(`peak ${i.peak.toFixed(2)} — clipping`),Math.abs(i.dc)>s.dc&&n.push(`dc ${i.dc.toFixed(4)}`),i.crest<r&&n.push(`crest ${i.crest.toFixed(1)} dB — ${e==="event"?"no transient left":"a drone"}`),i.crest>o&&n.push(`crest ${i.crest.toFixed(1)} dB — ${e==="event"?"nothing but spikes":"bubble wrap"}`),t>s.periodicity&&n.push(`periodicity ${t.toFixed(2)} — it loops`),n}function kA(i,t){const e=qo.models[i];if(!e)return[];const n=[],{drift:s}=qo;return Math.abs(t.loudness-e.loudness)>s.loudness&&n.push(`loudness ${e.loudness.toFixed(1)} → ${t.loudness.toFixed(1)}`),Math.abs(t.crest-e.crest)>s.crest&&n.push(`crest ${e.crest.toFixed(1)} → ${t.crest.toFixed(1)}`),Math.abs(Math.log2(Math.max(t.centroid,1)/Math.max(e.centroid,1)))>s.centroid&&n.push(`centroid ${e.centroid.toFixed(0)} → ${t.centroid.toFixed(0)} Hz`),n}async function BA(){const i=[],t={};for(const s of FA){const{signal:r,model:o,rate:a}=await IA(s),c=TA(r,a),l=OA(r,a),h=[];for(let d=4;d<l.length/4;d+=2)h.push(d);const u=RA(l,h),f=s.kind??"texture";i.push({name:s.name,measurements:c,periodicity:u,problems:[...zA(c,u,f),...kA(s.name,c)],novel:qo.models[s.name]===void 0}),t[s.name]={loudness:Number(c.loudness.toFixed(2)),crest:Number(c.crest.toFixed(2)),centroid:Number(c.centroid.toFixed(0)),bands:c.bands.map(d=>Number(d.toFixed(4)))},o.dispose()}const e=i.map(s=>s.measurements.loudness).filter(Number.isFinite),n=e.length>1?Math.max(...e)-Math.min(...e):0;return{rows:i,spread:n,failures:i.filter(s=>s.problems.length>0).length,captured:t}}async function HA(){console.log("audition: rendering the library…");const i=await BA();console.table(i.rows.map(n=>({model:n.name,loudness:n.measurements.loudness.toFixed(1),crest:n.measurements.crest.toFixed(1),"centroid Hz":n.measurements.centroid.toFixed(0),peak:n.measurements.peak.toFixed(3),loop:n.periodicity.toFixed(2),status:n.problems.length===0?n.novel?"new":"ok":n.problems.join("; ")}))),console.log(`audition: ${i.failures} of ${i.rows.length} flagged. Loudness spread ${i.spread.toFixed(1)} — reported, not a rule; see baselines.json.`);const t=JSON.stringify(i.captured,null,2),e=i.rows.filter(n=>n.novel).map(n=>n.name);console.log(e.length>0?`audition: no baseline yet for ${e.join(", ")}.`:"audition: current measurements, for re-capture after a deliberate change."),console.log("If this run sounded right, replace the `models` block of src/audio/baselines.json with the object below and commit it — drift is only visible against something."),console.log(t);try{await navigator.clipboard.writeText(t),console.log("audition: copied to the clipboard.")}catch{console.log("audition: could not reach the clipboard — copy the block above.")}return i}const Dc=-90,Ai=240,Js=92;function GA(i){const t=document.createElement("canvas"),e=Math.min(window.devicePixelRatio||1,2);t.width=Ai*e,t.height=Js*e,Object.assign(t.style,{position:"fixed",right:"8px",bottom:"8px",width:`${Ai}px`,height:`${Js}px`,zIndex:"20",pointerEvents:"none",display:"none",background:"rgba(8, 10, 12, 0.72)",borderRadius:"3px"}),document.body.appendChild(t);const n=t.getContext("2d"),s=i.analyser,r=new Uint8Array(s.frequencyBinCount),o=new Float32Array(s.fftSize);let a=0;return{visible:!1,update(){if(t.style.display=this.visible?"block":"none",!this.visible||!n)return;s.getByteFrequencyData(r),s.getFloatTimeDomainData(o);let l=0;for(let y=0;y<o.length;y++){const m=Math.abs(o[y]);m>l&&(l=m)}a=Math.max(l,a*.94),n.setTransform(e,0,0,e,0,0),n.clearRect(0,0,Ai,Js);const h=i.context.sampleRate/2,u=Js-12,f=30;n.fillStyle="#7fb2c9";for(let y=0;y<Ai;y++){const m=f*Math.pow(h/f,y/Ai),p=Math.min(r.length-1,Math.round(m/h*r.length)),_=r[p]/255*u;n.fillRect(y,u-_,1,_)}n.fillStyle="rgba(255, 255, 255, 0.16)";for(let y=100;y<h;y*=10){const m=Math.log(y/f)/Math.log(h/f)*Ai;n.fillRect(m,0,1,u)}const d=a>0?20*Math.log10(a):Dc,g=Math.max(0,(d-Dc)/-Dc)*Ai;n.fillStyle=d>-1?"#e05a4a":d>-6?"#e0b44a":"#6fbf73",n.fillRect(0,Js-8,g,6)},dispose(){t.remove()}}}const VA=new Set(["speed"]);function Nc(i,t,e){let n=null,s=null;const r={};function o(a){const c=Object.keys(a.meta.params).sort();for(const h of c)r[h]=a.get(h);const l=i.addFolder(t).close();for(const h of c){const u=a.meta.params[h];l.add(r,h,u.min,u.max,u.step).name(VA.has(h)?`${h} (driven)`:h).onChange(f=>a.set(h,f)).listen()}n=l,s=a}return{sync(){const a=e();if(a===null){n?.destroy(),n=null,s=null;return}if(a!==s){n?.destroy(),o(a);return}for(const c of Object.keys(a.meta.params))r[c]=a.get(c)},dispose(){n?.destroy(),n=null,s=null}}}const WA=.35;class XA{root;bar;label;constructor(t){const e=document.getElementById("loading"),n=e?.querySelector(".loading-bar")??null,s=e?.querySelector(".loading-label")??null;if(e&&n&&s)this.root=e,this.bar=n,this.label=s;else{this.root=document.createElement("div"),this.root.id="loading";const r=document.createElement("div");r.className="loading-track",this.bar=document.createElement("div"),this.bar.className="loading-bar",r.appendChild(this.bar),this.label=document.createElement("div"),this.label.className="loading-label",this.root.append(r,this.label),t.appendChild(this.root)}document.body.classList.add("is-loading")}async step(t,e,n){return this.label.textContent=t,this.bar.style.transform=`scaleX(${Math.min(Math.max(e,0),1)})`,await A0(),n()}async done(){this.bar.style.transform="scaleX(1)",this.label.textContent="ready",await A0(),await T0(.18),this.root.classList.add("is-gone"),document.body.classList.remove("is-loading"),await T0(WA),this.root.remove()}fail(t){this.label.textContent=t,this.bar.style.transform="scaleX(1)",this.root.classList.add("is-failed")}}function A0(){return new Promise(i=>{requestAnimationFrame(()=>requestAnimationFrame(()=>i()))})}function T0(i){return new Promise(t=>window.setTimeout(t,i*1e3))}const Ph=document.getElementById("viewport");if(!(Ph instanceof HTMLCanvasElement))throw new Error("#viewport canvas is missing from index.html");const Yo=document.getElementById("overlay");if(!(Yo instanceof HTMLElement))throw new Error("#overlay is missing from index.html");const ki=new rx(Ph),cr=new ox,Se=q2();ki.scene.fog=new ea(657935,20,90);xx();const xn=new Px(ki),qA=new db(ki.renderer);ki.onResize=()=>xn.resize();const $o=new zo,Zo=new Bx(Ph),Ze=new jx(ki.camera,Zo,$o),Ps=new XA(document.body),Ii=await Ps.step("shaping the ground",.12,()=>new l2),Yt=new rb({scene:ki.scene,collider:$o,player:Ze,postfx:xn,interaction:new WM,reticle:new ab(Yo),fade:new cb(Yo)}),em={shadows:!0},nm=xA(Ii);for(const i of nm.zones)Yt.register(i);for(const i of nm.portals)Yt.link(i);Yt.setShadows(em.shadows);xn.aimSun(Yt.sunDirection);await Ps.step("settling the world",.6,()=>Yt.enter(Pi));await Ps.step("raising arkstin",.78,()=>Yt.prebuild(Rh));const _e=new D2;let Ye=null,R0;const YA=new Map([["canopy",.22],["shrub-a",.34],["shrub-b",.34],["wood-north",.2],["wood-east",.22],["hedge",.34]]);await Ps.step("rendering the rooms",.86,()=>_e.ready);await Ps.step("tuning the air",.96,()=>{Ye=new m2(_e,.55),Ze.onFootstep=i=>{if(!Ye)return;const t=Ze.position;Ye.surface=Yt.surfaceAt(t.x,t.z),Ye.step(i)},Ze.onLand=i=>{if(!Ye)return;const t=Ze.position;Ye.surface=Yt.surfaceAt(t.x,t.z),Ye.land(i)},Ze.onJump=()=>{if(!Ye)return;const i=Ze.position;Ye.surface=Yt.surfaceAt(i.x,i.z),Ye.jump()},Yt.attachAudio({engine:_e,footsteps:Ye})});Af()?(new Qx(Zo,Yo),document.body.classList.add("is-touch","is-playing")):Zo.onLockChange=i=>document.body.classList.toggle("is-playing",i);if(Se.gui){const i=xn.settings,t=()=>xn.apply(),e=Se.gui.addFolder("look");e.add(em,"shadows").name("cast shadows").onChange(x=>Yt.setShadows(x)),e.add(i,"pixelSize",1,12,1).onChange(t),e.add(i,"normalEdgeStrength",0,2,.05).onChange(t),e.add(i,"depthEdgeStrength",0,2,.05).onChange(t),e.add(i,"quantize",["off","levels"]).onChange(t),e.add(i,"levels",2,16,1).onChange(t),e.add(i,"ditherScale",0,2,.05).name("dither (steps)").onChange(t),e.add(i,"screenPeriod",2,32,1).name("screen period").onChange(t);const n=Se.gui.addFolder("vignette").close();n.add(i,"vignetteStrength",0,1,.01).onChange(t),n.add(i,"vignetteRadius",0,1.5,.01).onChange(t),n.add(i,"vignetteSoftness",.01,1.5,.01).onChange(t);const s=Se.gui.addFolder("sky");s.addColor(i.sky,"zenith").onChange(t),s.addColor(i.sky,"horizon").onChange(t),s.addColor(i.sky,"ground").name("below horizon").onChange(t),s.add(i.sky,"curve",.1,3,.05).onChange(t);const r=Se.gui.addFolder("clouds");r.addColor(i.sky,"cloudColor").name("colour").onChange(t),r.add(i.sky,"cloudCover",.1,.9,.01).name("cover").onChange(t),r.add(i.sky,"cloudSoftness",.01,.6,.01).name("softness").onChange(t),r.add(i.sky,"cloudScale",.2,4,.05).name("scale").onChange(t),r.add(i.sky,"cloudOpacity",0,1,.01).name("opacity").onChange(t),r.add(i.sky,"cloudDrift",0,.1,.001).name("drift").onChange(t);const o=Se.gui.addFolder("light").close();o.add(Yt.lights.sun,"intensity",0,5,.1).name("sun"),o.add(Yt.lights.ambient,"intensity",0,5,.1).name("ambient");const a=Se.gui.addFolder("fog").close();a.add(i,"linkFogToSky").name("match horizon").onChange(t),a.addColor(i,"fogColor").onChange(t),a.add(i,"fogNear",0,200,1).onChange(t),a.add(i,"fogFar",0,400,1).onChange(t);const c=Se.gui.addFolder("surfaces").close();for(const x of Object.keys(Ii.colors))c.addColor(Ii.colors,x).onChange(()=>Ii.applyColors());c.add({reset:()=>{Ii.resetColors(),Se.gui?.controllersRecursive().forEach(x=>x.updateDisplay())}},"reset");const l=Se.gui.addFolder("preset");l.add({save:()=>{const x=xn.save();l.title(x?"preset · saved":"preset · SAVE FAILED")}},"save"),l.add({reset:()=>{xn.reset(),Se.gui?.controllersRecursive().forEach(x=>x.updateDisplay())}},"reset"),l.add({copy:()=>{navigator.clipboard?.writeText(JSON.stringify(xn.settings,null,2))}},"copy").name("copy JSON");const h=Ze.tuning,u=Se.gui.addFolder("movement");u.add(h,"walkSpeed",1,12,.1),u.add(h,"sprintScale",1,3,.05),u.add(h,"groundAccel",1,60,.5),u.add(h,"airAccel",0,20,.1),u.add(h,"friction",0,30,.5),u.add(h,"gravity",5,60,.5),u.add(h,"jumpSpeed",2,14,.1),u.add(h,"autoHop");const f=Se.gui.addFolder("contact").close();f.add(h,"slopeLimitDeg",5,85,1),f.add(h,"stepHeight",0,1,.01),f.add(h,"coyoteTime",0,.5,.01),f.add(h,"jumpBuffer",0,.5,.01);const d=Se.gui.addFolder("view");d.add(h,"lookSensitivity",2e-4,.008,1e-4),d.add(h,"invertY"),d.add(h,"eyeHeight",1,2,.01),d.add(h,"fov",50,110,1),d.add(h,"sprintFov",50,120,1);const g=Se.gui.addFolder("head bob").close();g.add(h,"bobAmount",0,.15,.001),g.add(h,"bobSway",0,.15,.001),g.add(h,"bobRoll",0,.05,5e-4),g.add(h,"bobStepsPerSecond",.5,5,.05),g.add(h,"bobSpeedInfluence",0,1,.05),g.add(h,"landDip",0,.1,.001);const y=Se.gui.addFolder("audio");y.add(_e.settings,"masterVolume",0,1,.01).name("volume"),y.add(_e.settings,"reverbAmount",0,2,.01).name("reverb").onChange(()=>_e.applyReverbAmount()),y.add(_e.settings,"airAbsorption",0,1,.01).name("air absorption"),y.add(_e.settings,"occlusion",0,1,.01).name("occlusion");const m=Se.gui.addFolder("weather");m.add(_e.weather.settings,"windSpeed",0,1,.01).name("wind"),m.add(_e.weather.settings,"gustDepth",0,1,.01).name("gust depth"),m.add(_e.weather.settings,"gustRate",.01,.6,.01).name("gust rate"),m.add(_e.weather.settings,"windDirection",0,Math.PI*2,.01).name("wind direction"),m.add(_e.weather.settings,"frontSpeed",1,60,.5).name("front speed (m/s)"),m.add(us.swayAmount,"value",0,2,.01).name("sway");const p={windTone:3400,leaves:1,machineRpm:52,fireIntensity:.85,rain:0,water:1,strike:()=>Yt.sound?.findField("smith")?.trigger(),drop:()=>Yt.sound?.findField("yards")?.trigger(),toll:()=>Yt.sound?.findField("bell")?.trigger()};m.add(p,"windTone",700,9e3,50).name("wind tone (Hz)").onChange(x=>{Yt.sound?.find("wind")?.setTone(x)}),m.add(p,"leaves",0,2,.01).name("leaf articulation").onChange(x=>{for(const[b,T]of YA)Yt.sound?.find(b)?.setArticulation(T*x)}),m.add(p,"machineRpm",0,200,1).name("mill rpm").onChange(x=>{Yt.sound?.find("mill")?.setRpm(x)}),m.add(p,"fireIntensity",0,1,.01).name("forge intensity").onChange(x=>{Yt.sound?.find("forge")?.setIntensity(x)}),m.add(p,"rain",0,1,.01).name("rain").onChange(x=>{Yt.sound?.find("rain")?.setIntensity(x)}),m.add(p,"water",0,1,.01).name("water flow").onChange(x=>{Yt.sound?.find("cistern")?.setRate(x)}),m.add(p,"strike").name("hammer now"),m.add(p,"drop").name("clatter now"),m.add(p,"toll").name("bell now");const _={speed:"0.00",grounded:"no",position:"",triangles:$o.triangles,zone:"—",crossings:0,room:"—",audio:"waiting for a click",gust:"0.00",swell:"0.00",machine:"—",emitters:"—"},v=Se.gui.addFolder("state");v.add(_,"speed").listen().disable(),v.add(_,"grounded").listen().disable(),v.add(_,"position").listen().disable(),v.add(_,"zone").listen().disable(),v.add(_,"crossings").listen().disable(),v.add(_,"room").listen().disable(),v.add(_,"audio").listen().disable(),v.add(_,"gust").listen().disable(),v.add(_,"swell").listen().disable(),v.add(_,"machine").listen().disable(),v.add(_,"emitters").name("hrtf / panned / virtual").listen().disable(),v.add(_,"triangles").listen().disable(),v.add({respawn:()=>Yt.respawn()},"respawn");const w=Se.gui.addFolder("zones");for(const x of Yt.zones.values())w.add({go:()=>void Yt.enter(x.id)},"go").name(x.name);const M=GA(_e);cr.add(()=>M.update());const S=Se.gui.addFolder("sound stage").close(),E={solo:"all",reverb:"—",audition:()=>{HA()}};S.add(E,"solo",["all",...sA]).name("solo").onChange(x=>{Yt.sound?.setSolo(x==="all"?null:x)}),S.add(E,"reverb").listen().disable(),S.add(E,"audition").name("audition the library"),S.add(M,"visible").name("spectrum");const A=[Nc(S,"reverb",()=>_e.reverbControls),...["gantry","gate","limb","friction"].map(x=>Nc(S,x,()=>Yt.sound?.find(x)?.loop??null)),...["pipe-air","waveguide"].map(x=>Nc(S,x,()=>Yt.sound?.find(x)?.loop??null))];cr.add(()=>{for(const x of A)x.sync()}),cr.add(()=>{_.speed=Ze.speed.toFixed(2),_.grounded=Ze.isGrounded?"yes":"no";const x=Ze.position;_.position=`${x.x.toFixed(1)}, ${x.y.toFixed(1)}, ${x.z.toFixed(1)}`,_.zone=Yt.current?.name??"—",_.crossings=Yt.crossings,_.triangles=$o.triangles,_.room=_e.room??"open",E.reverb=_e.reverbKind==="fdn"?"fdn — tunable":"convolution — fixed",_.audio=Ye===null?"rendering…":_e.context.state,_.gust=_e.weather.strength.toFixed(2),_.swell=_e.weather.swell.toFixed(2),_.machine=Yt.sound?.find("mill")?.phase??"—";const b=_e.voiceCounts;_.emitters=Yt.sound===null?"—":`${b.hrtf} / ${b.panned} / ${b.virtual} · ${Yt.sound.occludedCount} occl`})}cr.add((i,t)=>{Ze.update(i);const e=Yt.current;e&&Ze.position.y<e.floor&&Yt.respawn();const n=Yt.update();Zo.takeInteract()&&n&&Yt.use(n);const r=_e.update(i,ki.camera);if(Yt.updateSound(i,r),bx(_e.weather,t),Yt.current?.id===Pi){const o=Ii.roomAt(_e.listenerPosition);o!==R0&&(R0=o,_e.setRoom(o??"open"),Yt.sound?.setBedLevel(o===null?1:.22),Yt.sound?.find("wind")?.setTone(o===null?3400:900),Ye&&(Ye.surface=o===null?"earth":"stone"))}Ii.update(i,Yt.sound?.find("mill")?.currentRpm??0),xn.render(t),qA.update(),Se.update()});Ze.update(0);xn.render(0);await Ps.done();cr.start();
