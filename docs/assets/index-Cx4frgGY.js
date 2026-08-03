(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Cu="170",N1=0,kd=1,F1=2,Gp=1,Vp=2,Jn=3,Ii=0,en=1,mn=2,Ln=0,Ks=1,dh=2,zd=3,Bd=4,U1=5,es=100,O1=101,k1=102,z1=103,B1=104,H1=200,G1=201,V1=202,W1=203,fh=204,ph=205,X1=206,q1=207,Y1=208,$1=209,Z1=210,K1=211,j1=212,J1=213,Q1=214,mh=0,gh=1,vh=2,so=3,yh=4,wh=5,xh=6,_h=7,Pu=0,tv=1,ev=2,Pi=0,Wp=1,Xp=2,qp=3,Yp=4,nv=5,$p=6,Zp=7,Kp=300,oo=301,ro=302,Mh=303,bh=304,hc=306,cs=1e3,ni=1001,Sh=1002,Ge=1003,iv=1004,Ar=1005,He=1006,Cc=1007,Ai=1008,bn=1009,jp=1010,Jp=1011,lr=1012,Iu=1013,ls=1014,ii=1015,Oi=1016,Du=1017,Lu=1018,ao=1020,Qp=35902,tm=1021,em=1022,vn=1023,nm=1024,im=1025,js=1026,co=1027,uc=1028,Nu=1029,sm=1030,Fu=1031,Uu=1033,Da=33776,La=33777,Na=33778,Fa=33779,Eh=35840,Th=35841,Ah=35842,Rh=35843,Ch=36196,Ph=37492,Ih=37496,Dh=37808,Lh=37809,Nh=37810,Fh=37811,Uh=37812,Oh=37813,kh=37814,zh=37815,Bh=37816,Hh=37817,Gh=37818,Vh=37819,Wh=37820,Xh=37821,Ua=36492,qh=36494,Yh=36495,om=36283,$h=36284,Zh=36285,Kh=36286,sv=3200,rm=3201,Ou=0,ov=1,ei="",hn="srgb",vo="srgb-linear",dc="linear",ge="srgb",ys=7680,Hd=519,rv=512,av=513,cv=514,am=515,lv=516,hv=517,uv=518,dv=519,Gd=35044,Vd="300 es",si=2e3,Va=2001;class yo{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const o=s.indexOf(e);o!==-1&&s.splice(o,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let o=0,r=s.length;o<r;o++)s[o].call(this,t);t.target=null}}}const We=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Wd=1234567;const er=Math.PI/180,lo=180/Math.PI;function fs(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(We[i&255]+We[i>>8&255]+We[i>>16&255]+We[i>>24&255]+"-"+We[t&255]+We[t>>8&255]+"-"+We[t>>16&15|64]+We[t>>24&255]+"-"+We[e&63|128]+We[e>>8&255]+"-"+We[e>>16&255]+We[e>>24&255]+We[n&255]+We[n>>8&255]+We[n>>16&255]+We[n>>24&255]).toLowerCase()}function Pe(i,t,e){return Math.max(t,Math.min(e,i))}function ku(i,t){return(i%t+t)%t}function fv(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function pv(i,t,e){return i!==t?(e-i)/(t-i):0}function nr(i,t,e){return(1-e)*i+e*t}function mv(i,t,e,n){return nr(i,t,1-Math.exp(-e*n))}function gv(i,t=1){return t-Math.abs(ku(i,t*2)-t)}function vv(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function yv(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function wv(i,t){return i+Math.floor(Math.random()*(t-i+1))}function xv(i,t){return i+Math.random()*(t-i)}function _v(i){return i*(.5-Math.random())}function Mv(i){i!==void 0&&(Wd=i);let t=Wd+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function bv(i){return i*er}function Sv(i){return i*lo}function Ev(i){return(i&i-1)===0&&i!==0}function Tv(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Av(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Rv(i,t,e,n,s){const o=Math.cos,r=Math.sin,a=o(e/2),c=r(e/2),l=o((t+n)/2),h=r((t+n)/2),u=o((t-n)/2),f=r((t-n)/2),d=o((n-t)/2),g=r((n-t)/2);switch(s){case"XYX":i.set(a*h,c*u,c*f,a*l);break;case"YZY":i.set(c*f,a*h,c*u,a*l);break;case"ZXZ":i.set(c*u,c*f,a*h,a*l);break;case"XZX":i.set(a*h,c*g,c*d,a*l);break;case"YXY":i.set(c*d,a*h,c*g,a*l);break;case"ZYZ":i.set(c*g,c*d,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Bs(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function je(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const ir={DEG2RAD:er,RAD2DEG:lo,generateUUID:fs,clamp:Pe,euclideanModulo:ku,mapLinear:fv,inverseLerp:pv,lerp:nr,damp:mv,pingpong:gv,smoothstep:vv,smootherstep:yv,randInt:wv,randFloat:xv,randFloatSpread:_v,seededRandom:Mv,degToRad:bv,radToDeg:Sv,isPowerOfTwo:Ev,ceilPowerOfTwo:Tv,floorPowerOfTwo:Av,setQuaternionFromProperEuler:Rv,normalize:je,denormalize:Bs};class tt{constructor(t=0,e=0){tt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Pe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),o=this.x-t.x,r=this.y-t.y;return this.x=o*n-r*s+t.x,this.y=o*s+r*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Jt{constructor(t,e,n,s,o,r,a,c,l){Jt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,o,r,a,c,l)}set(t,e,n,s,o,r,a,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=o,h[5]=c,h[6]=n,h[7]=r,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,o=this.elements,r=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],f=n[2],d=n[5],g=n[8],v=s[0],m=s[3],p=s[6],x=s[1],y=s[4],w=s[7],b=s[2],S=s[5],E=s[8];return o[0]=r*v+a*x+c*b,o[3]=r*m+a*y+c*S,o[6]=r*p+a*w+c*E,o[1]=l*v+h*x+u*b,o[4]=l*m+h*y+u*S,o[7]=l*p+h*w+u*E,o[2]=f*v+d*x+g*b,o[5]=f*m+d*y+g*S,o[8]=f*p+d*w+g*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],r=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*r*h-e*a*l-n*o*h+n*a*c+s*o*l-s*r*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],r=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*r-a*l,f=a*c-h*o,d=l*o-r*c,g=e*u+n*f+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=u*v,t[1]=(s*l-h*n)*v,t[2]=(a*n-s*r)*v,t[3]=f*v,t[4]=(h*e-s*c)*v,t[5]=(s*o-a*e)*v,t[6]=d*v,t[7]=(n*c-l*e)*v,t[8]=(r*e-n*o)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,o,r,a){const c=Math.cos(o),l=Math.sin(o);return this.set(n*c,n*l,-n*(c*r+l*a)+r+t,-s*l,s*c,-s*(-l*r+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Pc.makeScale(t,e)),this}rotate(t){return this.premultiply(Pc.makeRotation(-t)),this}translate(t,e){return this.premultiply(Pc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Pc=new Jt;function cm(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Wa(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Cv(){const i=Wa("canvas");return i.style.display="block",i}const Xd={};function $o(i){i in Xd||(Xd[i]=!0,console.warn(i))}function Pv(i,t,e){return new Promise(function(n,s){function o(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(o,e);break;default:n()}}setTimeout(o,e)})}function Iv(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Dv(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const ce={enabled:!0,workingColorSpace:vo,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ge&&(i.r=ai(i.r),i.g=ai(i.g),i.b=ai(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ge&&(i.r=Js(i.r),i.g=Js(i.g),i.b=Js(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===ei?dc:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function ai(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Js(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const qd=[.64,.33,.3,.6,.15,.06],Yd=[.2126,.7152,.0722],$d=[.3127,.329],Zd=new Jt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Kd=new Jt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);ce.define({[vo]:{primaries:qd,whitePoint:$d,transfer:dc,toXYZ:Zd,fromXYZ:Kd,luminanceCoefficients:Yd,workingColorSpaceConfig:{unpackColorSpace:hn},outputColorSpaceConfig:{drawingBufferColorSpace:hn}},[hn]:{primaries:qd,whitePoint:$d,transfer:ge,toXYZ:Zd,fromXYZ:Kd,luminanceCoefficients:Yd,outputColorSpaceConfig:{drawingBufferColorSpace:hn}}});let ws;class Lv{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ws===void 0&&(ws=Wa("canvas")),ws.width=t.width,ws.height=t.height;const n=ws.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=ws}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Wa("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),o=s.data;for(let r=0;r<o.length;r++)o[r]=ai(o[r]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(ai(e[n]/255)*255):e[n]=ai(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Nv=0;class lm{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Nv++}),this.uuid=fs(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let o;if(Array.isArray(s)){o=[];for(let r=0,a=s.length;r<a;r++)s[r].isDataTexture?o.push(Ic(s[r].image)):o.push(Ic(s[r]))}else o=Ic(s);n.url=o}return e||(t.images[this.uuid]=n),n}}function Ic(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Lv.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Fv=0;class nn extends yo{constructor(t=nn.DEFAULT_IMAGE,e=nn.DEFAULT_MAPPING,n=ni,s=ni,o=He,r=Ai,a=vn,c=bn,l=nn.DEFAULT_ANISOTROPY,h=ei){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Fv++}),this.uuid=fs(),this.name="",this.source=new lm(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=o,this.minFilter=r,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new tt(0,0),this.repeat=new tt(1,1),this.center=new tt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Kp)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case cs:t.x=t.x-Math.floor(t.x);break;case ni:t.x=t.x<0?0:1;break;case Sh:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case cs:t.y=t.y-Math.floor(t.y);break;case ni:t.y=t.y<0?0:1;break;case Sh:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}nn.DEFAULT_IMAGE=null;nn.DEFAULT_MAPPING=Kp;nn.DEFAULT_ANISOTROPY=1;class de{constructor(t=0,e=0,n=0,s=1){de.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,o=this.w,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s+r[12]*o,this.y=r[1]*e+r[5]*n+r[9]*s+r[13]*o,this.z=r[2]*e+r[6]*n+r[10]*s+r[14]*o,this.w=r[3]*e+r[7]*n+r[11]*s+r[15]*o,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,o;const c=t.elements,l=c[0],h=c[4],u=c[8],f=c[1],d=c[5],g=c[9],v=c[2],m=c[6],p=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(l+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const y=(l+1)/2,w=(d+1)/2,b=(p+1)/2,S=(h+f)/4,E=(u+v)/4,T=(g+m)/4;return y>w&&y>b?y<.01?(n=0,s=.707106781,o=.707106781):(n=Math.sqrt(y),s=S/n,o=E/n):w>b?w<.01?(n=.707106781,s=0,o=.707106781):(s=Math.sqrt(w),n=S/s,o=T/s):b<.01?(n=.707106781,s=.707106781,o=0):(o=Math.sqrt(b),n=E/o,s=T/o),this.set(n,s,o,e),this}let x=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(f-h)*(f-h));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(u-v)/x,this.z=(f-h)/x,this.w=Math.acos((l+d+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Uv extends yo{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new de(0,0,t,e),this.scissorTest=!1,this.viewport=new de(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:He,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const o=new nn(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);o.flipY=!1,o.generateMipmaps=n.generateMipmaps,o.internalFormat=n.internalFormat,this.textures=[];const r=n.count;for(let a=0;a<r;a++)this.textures[a]=o.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,o=this.textures.length;s<o;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new lm(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Sn extends Uv{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class hm extends nn{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ge,this.minFilter=Ge,this.wrapR=ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Ov extends nn{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ge,this.minFilter=Ge,this.wrapR=ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ui{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,o,r,a){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3];const f=o[r+0],d=o[r+1],g=o[r+2],v=o[r+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=f,t[e+1]=d,t[e+2]=g,t[e+3]=v;return}if(u!==v||c!==f||l!==d||h!==g){let m=1-a;const p=c*f+l*d+h*g+u*v,x=p>=0?1:-1,y=1-p*p;if(y>Number.EPSILON){const b=Math.sqrt(y),S=Math.atan2(b,p*x);m=Math.sin(m*S)/b,a=Math.sin(a*S)/b}const w=a*x;if(c=c*m+f*w,l=l*m+d*w,h=h*m+g*w,u=u*m+v*w,m===1-a){const b=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=b,l*=b,h*=b,u*=b}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,o,r){const a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=o[r],f=o[r+1],d=o[r+2],g=o[r+3];return t[e]=a*g+h*u+c*d-l*f,t[e+1]=c*g+h*f+l*u-a*d,t[e+2]=l*g+h*d+a*f-c*u,t[e+3]=h*g-a*u-c*f-l*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,o=t._z,r=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),u=a(o/2),f=c(n/2),d=c(s/2),g=c(o/2);switch(r){case"XYZ":this._x=f*h*u+l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u-f*d*g;break;case"YXZ":this._x=f*h*u+l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u+f*d*g;break;case"ZXY":this._x=f*h*u-l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u-f*d*g;break;case"ZYX":this._x=f*h*u-l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u+f*d*g;break;case"YZX":this._x=f*h*u+l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u-f*d*g;break;case"XZY":this._x=f*h*u-l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],o=e[8],r=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],f=n+a+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-c)*d,this._y=(o-l)*d,this._z=(r-s)*d}else if(n>a&&n>u){const d=2*Math.sqrt(1+n-a-u);this._w=(h-c)/d,this._x=.25*d,this._y=(s+r)/d,this._z=(o+l)/d}else if(a>u){const d=2*Math.sqrt(1+a-n-u);this._w=(o-l)/d,this._x=(s+r)/d,this._y=.25*d,this._z=(c+h)/d}else{const d=2*Math.sqrt(1+u-n-a);this._w=(r-s)/d,this._x=(o+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Pe(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,o=t._z,r=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+r*a+s*l-o*c,this._y=s*h+r*c+o*a-n*l,this._z=o*h+r*l+n*c-s*a,this._w=r*h-n*a-s*c-o*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,o=this._z,r=this._w;let a=r*t._w+n*t._x+s*t._y+o*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=r,this._x=n,this._y=s,this._z=o,this;const c=1-a*a;if(c<=Number.EPSILON){const d=1-e;return this._w=d*r+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*o+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,f=Math.sin(e*h)/l;return this._w=r*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=o*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),o=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),o*Math.sin(e),o*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{constructor(t=0,e=0,n=0){R.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(jd.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(jd.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[3]*n+o[6]*s,this.y=o[1]*e+o[4]*n+o[7]*s,this.z=o[2]*e+o[5]*n+o[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,o=t.elements,r=1/(o[3]*e+o[7]*n+o[11]*s+o[15]);return this.x=(o[0]*e+o[4]*n+o[8]*s+o[12])*r,this.y=(o[1]*e+o[5]*n+o[9]*s+o[13])*r,this.z=(o[2]*e+o[6]*n+o[10]*s+o[14])*r,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,o=t.x,r=t.y,a=t.z,c=t.w,l=2*(r*s-a*n),h=2*(a*e-o*s),u=2*(o*n-r*e);return this.x=e+c*l+r*u-a*h,this.y=n+c*h+a*l-o*u,this.z=s+c*u+o*h-r*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s,this.y=o[1]*e+o[5]*n+o[9]*s,this.z=o[2]*e+o[6]*n+o[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,o=t.z,r=e.x,a=e.y,c=e.z;return this.x=s*c-o*a,this.y=o*r-n*c,this.z=n*a-s*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Dc.copy(this).projectOnVector(t),this.sub(Dc)}reflect(t){return this.sub(Dc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Pe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Dc=new R,jd=new ui;class Di{constructor(t=new R(1/0,1/0,1/0),e=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(xn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(xn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=xn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const o=n.getAttribute("position");if(e===!0&&o!==void 0&&t.isInstancedMesh!==!0)for(let r=0,a=o.count;r<a;r++)t.isMesh===!0?t.getVertexPosition(r,xn):xn.fromBufferAttribute(o,r),xn.applyMatrix4(t.matrixWorld),this.expandByPoint(xn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Rr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Rr.copy(n.boundingBox)),Rr.applyMatrix4(t.matrixWorld),this.union(Rr)}const s=t.children;for(let o=0,r=s.length;o<r;o++)this.expandByObject(s[o],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,xn),xn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(So),Cr.subVectors(this.max,So),xs.subVectors(t.a,So),_s.subVectors(t.b,So),Ms.subVectors(t.c,So),vi.subVectors(_s,xs),yi.subVectors(Ms,_s),Gi.subVectors(xs,Ms);let e=[0,-vi.z,vi.y,0,-yi.z,yi.y,0,-Gi.z,Gi.y,vi.z,0,-vi.x,yi.z,0,-yi.x,Gi.z,0,-Gi.x,-vi.y,vi.x,0,-yi.y,yi.x,0,-Gi.y,Gi.x,0];return!Lc(e,xs,_s,Ms,Cr)||(e=[1,0,0,0,1,0,0,0,1],!Lc(e,xs,_s,Ms,Cr))?!1:(Pr.crossVectors(vi,yi),e=[Pr.x,Pr.y,Pr.z],Lc(e,xs,_s,Ms,Cr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,xn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(xn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Vn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Vn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Vn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Vn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Vn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Vn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Vn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Vn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Vn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Vn=[new R,new R,new R,new R,new R,new R,new R,new R],xn=new R,Rr=new Di,xs=new R,_s=new R,Ms=new R,vi=new R,yi=new R,Gi=new R,So=new R,Cr=new R,Pr=new R,Vi=new R;function Lc(i,t,e,n,s){for(let o=0,r=i.length-3;o<=r;o+=3){Vi.fromArray(i,o);const a=s.x*Math.abs(Vi.x)+s.y*Math.abs(Vi.y)+s.z*Math.abs(Vi.z),c=t.dot(Vi),l=e.dot(Vi),h=n.dot(Vi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const kv=new Di,Eo=new R,Nc=new R;class wo{constructor(t=new R,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):kv.setFromPoints(t).getCenter(n);let s=0;for(let o=0,r=t.length;o<r;o++)s=Math.max(s,n.distanceToSquared(t[o]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Eo.subVectors(t,this.center);const e=Eo.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Eo,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Nc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Eo.copy(t.center).add(Nc)),this.expandByPoint(Eo.copy(t.center).sub(Nc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Wn=new R,Fc=new R,Ir=new R,wi=new R,Uc=new R,Dr=new R,Oc=new R;class gr{constructor(t=new R,e=new R(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Wn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Wn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Wn.copy(this.origin).addScaledVector(this.direction,e),Wn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Fc.copy(t).add(e).multiplyScalar(.5),Ir.copy(e).sub(t).normalize(),wi.copy(this.origin).sub(Fc);const o=t.distanceTo(e)*.5,r=-this.direction.dot(Ir),a=wi.dot(this.direction),c=-wi.dot(Ir),l=wi.lengthSq(),h=Math.abs(1-r*r);let u,f,d,g;if(h>0)if(u=r*c-a,f=r*a-c,g=o*h,u>=0)if(f>=-g)if(f<=g){const v=1/h;u*=v,f*=v,d=u*(u+r*f+2*a)+f*(r*u+f+2*c)+l}else f=o,u=Math.max(0,-(r*f+a)),d=-u*u+f*(f+2*c)+l;else f=-o,u=Math.max(0,-(r*f+a)),d=-u*u+f*(f+2*c)+l;else f<=-g?(u=Math.max(0,-(-r*o+a)),f=u>0?-o:Math.min(Math.max(-o,-c),o),d=-u*u+f*(f+2*c)+l):f<=g?(u=0,f=Math.min(Math.max(-o,-c),o),d=f*(f+2*c)+l):(u=Math.max(0,-(r*o+a)),f=u>0?o:Math.min(Math.max(-o,-c),o),d=-u*u+f*(f+2*c)+l);else f=r>0?-o:o,u=Math.max(0,-(r*f+a)),d=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Fc).addScaledVector(Ir,f),d}intersectSphere(t,e){Wn.subVectors(t.center,this.origin);const n=Wn.dot(this.direction),s=Wn.dot(Wn)-n*n,o=t.radius*t.radius;if(s>o)return null;const r=Math.sqrt(o-s),a=n-r,c=n+r;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,o,r,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),h>=0?(o=(t.min.y-f.y)*h,r=(t.max.y-f.y)*h):(o=(t.max.y-f.y)*h,r=(t.min.y-f.y)*h),n>r||o>s||((o>n||isNaN(n))&&(n=o),(r<s||isNaN(s))&&(s=r),u>=0?(a=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(a=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Wn)!==null}intersectTriangle(t,e,n,s,o){Uc.subVectors(e,t),Dr.subVectors(n,t),Oc.crossVectors(Uc,Dr);let r=this.direction.dot(Oc),a;if(r>0){if(s)return null;a=1}else if(r<0)a=-1,r=-r;else return null;wi.subVectors(this.origin,t);const c=a*this.direction.dot(Dr.crossVectors(wi,Dr));if(c<0)return null;const l=a*this.direction.dot(Uc.cross(wi));if(l<0||c+l>r)return null;const h=-a*wi.dot(Oc);return h<0?null:this.at(h/r,o)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class oe{constructor(t,e,n,s,o,r,a,c,l,h,u,f,d,g,v,m){oe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,o,r,a,c,l,h,u,f,d,g,v,m)}set(t,e,n,s,o,r,a,c,l,h,u,f,d,g,v,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=o,p[5]=r,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new oe().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/bs.setFromMatrixColumn(t,0).length(),o=1/bs.setFromMatrixColumn(t,1).length(),r=1/bs.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*o,e[5]=n[5]*o,e[6]=n[6]*o,e[7]=0,e[8]=n[8]*r,e[9]=n[9]*r,e[10]=n[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,o=t.z,r=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(o),u=Math.sin(o);if(t.order==="XYZ"){const f=r*h,d=r*u,g=a*h,v=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=d+g*l,e[5]=f-v*l,e[9]=-a*c,e[2]=v-f*l,e[6]=g+d*l,e[10]=r*c}else if(t.order==="YXZ"){const f=c*h,d=c*u,g=l*h,v=l*u;e[0]=f+v*a,e[4]=g*a-d,e[8]=r*l,e[1]=r*u,e[5]=r*h,e[9]=-a,e[2]=d*a-g,e[6]=v+f*a,e[10]=r*c}else if(t.order==="ZXY"){const f=c*h,d=c*u,g=l*h,v=l*u;e[0]=f-v*a,e[4]=-r*u,e[8]=g+d*a,e[1]=d+g*a,e[5]=r*h,e[9]=v-f*a,e[2]=-r*l,e[6]=a,e[10]=r*c}else if(t.order==="ZYX"){const f=r*h,d=r*u,g=a*h,v=a*u;e[0]=c*h,e[4]=g*l-d,e[8]=f*l+v,e[1]=c*u,e[5]=v*l+f,e[9]=d*l-g,e[2]=-l,e[6]=a*c,e[10]=r*c}else if(t.order==="YZX"){const f=r*c,d=r*l,g=a*c,v=a*l;e[0]=c*h,e[4]=v-f*u,e[8]=g*u+d,e[1]=u,e[5]=r*h,e[9]=-a*h,e[2]=-l*h,e[6]=d*u+g,e[10]=f-v*u}else if(t.order==="XZY"){const f=r*c,d=r*l,g=a*c,v=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=f*u+v,e[5]=r*h,e[9]=d*u-g,e[2]=g*u-d,e[6]=a*h,e[10]=v*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(zv,t,Bv)}lookAt(t,e,n){const s=this.elements;return an.subVectors(t,e),an.lengthSq()===0&&(an.z=1),an.normalize(),xi.crossVectors(n,an),xi.lengthSq()===0&&(Math.abs(n.z)===1?an.x+=1e-4:an.z+=1e-4,an.normalize(),xi.crossVectors(n,an)),xi.normalize(),Lr.crossVectors(an,xi),s[0]=xi.x,s[4]=Lr.x,s[8]=an.x,s[1]=xi.y,s[5]=Lr.y,s[9]=an.y,s[2]=xi.z,s[6]=Lr.z,s[10]=an.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,o=this.elements,r=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],f=n[9],d=n[13],g=n[2],v=n[6],m=n[10],p=n[14],x=n[3],y=n[7],w=n[11],b=n[15],S=s[0],E=s[4],T=s[8],_=s[12],M=s[1],A=s[5],P=s[9],C=s[13],L=s[2],N=s[6],F=s[10],H=s[14],G=s[3],V=s[7],et=s[11],lt=s[15];return o[0]=r*S+a*M+c*L+l*G,o[4]=r*E+a*A+c*N+l*V,o[8]=r*T+a*P+c*F+l*et,o[12]=r*_+a*C+c*H+l*lt,o[1]=h*S+u*M+f*L+d*G,o[5]=h*E+u*A+f*N+d*V,o[9]=h*T+u*P+f*F+d*et,o[13]=h*_+u*C+f*H+d*lt,o[2]=g*S+v*M+m*L+p*G,o[6]=g*E+v*A+m*N+p*V,o[10]=g*T+v*P+m*F+p*et,o[14]=g*_+v*C+m*H+p*lt,o[3]=x*S+y*M+w*L+b*G,o[7]=x*E+y*A+w*N+b*V,o[11]=x*T+y*P+w*F+b*et,o[15]=x*_+y*C+w*H+b*lt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],o=t[12],r=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],f=t[10],d=t[14],g=t[3],v=t[7],m=t[11],p=t[15];return g*(+o*c*u-s*l*u-o*a*f+n*l*f+s*a*d-n*c*d)+v*(+e*c*d-e*l*f+o*r*f-s*r*d+s*l*h-o*c*h)+m*(+e*l*u-e*a*d-o*r*u+n*r*d+o*a*h-n*l*h)+p*(-s*a*h-e*c*u+e*a*f+s*r*u-n*r*f+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],r=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],f=t[10],d=t[11],g=t[12],v=t[13],m=t[14],p=t[15],x=u*m*l-v*f*l+v*c*d-a*m*d-u*c*p+a*f*p,y=g*f*l-h*m*l-g*c*d+r*m*d+h*c*p-r*f*p,w=h*v*l-g*u*l+g*a*d-r*v*d-h*a*p+r*u*p,b=g*u*c-h*v*c-g*a*f+r*v*f+h*a*m-r*u*m,S=e*x+n*y+s*w+o*b;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/S;return t[0]=x*E,t[1]=(v*f*o-u*m*o-v*s*d+n*m*d+u*s*p-n*f*p)*E,t[2]=(a*m*o-v*c*o+v*s*l-n*m*l-a*s*p+n*c*p)*E,t[3]=(u*c*o-a*f*o-u*s*l+n*f*l+a*s*d-n*c*d)*E,t[4]=y*E,t[5]=(h*m*o-g*f*o+g*s*d-e*m*d-h*s*p+e*f*p)*E,t[6]=(g*c*o-r*m*o-g*s*l+e*m*l+r*s*p-e*c*p)*E,t[7]=(r*f*o-h*c*o+h*s*l-e*f*l-r*s*d+e*c*d)*E,t[8]=w*E,t[9]=(g*u*o-h*v*o-g*n*d+e*v*d+h*n*p-e*u*p)*E,t[10]=(r*v*o-g*a*o+g*n*l-e*v*l-r*n*p+e*a*p)*E,t[11]=(h*a*o-r*u*o-h*n*l+e*u*l+r*n*d-e*a*d)*E,t[12]=b*E,t[13]=(h*v*s-g*u*s+g*n*f-e*v*f-h*n*m+e*u*m)*E,t[14]=(g*a*s-r*v*s-g*n*c+e*v*c+r*n*m-e*a*m)*E,t[15]=(r*u*s-h*a*s+h*n*c-e*u*c-r*n*f+e*a*f)*E,this}scale(t){const e=this.elements,n=t.x,s=t.y,o=t.z;return e[0]*=n,e[4]*=s,e[8]*=o,e[1]*=n,e[5]*=s,e[9]*=o,e[2]*=n,e[6]*=s,e[10]*=o,e[3]*=n,e[7]*=s,e[11]*=o,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),o=1-n,r=t.x,a=t.y,c=t.z,l=o*r,h=o*a;return this.set(l*r+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*r,0,l*c-s*a,h*c+s*r,o*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,o,r){return this.set(1,n,o,0,t,1,r,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,o=e._x,r=e._y,a=e._z,c=e._w,l=o+o,h=r+r,u=a+a,f=o*l,d=o*h,g=o*u,v=r*h,m=r*u,p=a*u,x=c*l,y=c*h,w=c*u,b=n.x,S=n.y,E=n.z;return s[0]=(1-(v+p))*b,s[1]=(d+w)*b,s[2]=(g-y)*b,s[3]=0,s[4]=(d-w)*S,s[5]=(1-(f+p))*S,s[6]=(m+x)*S,s[7]=0,s[8]=(g+y)*E,s[9]=(m-x)*E,s[10]=(1-(f+v))*E,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let o=bs.set(s[0],s[1],s[2]).length();const r=bs.set(s[4],s[5],s[6]).length(),a=bs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(o=-o),t.x=s[12],t.y=s[13],t.z=s[14],_n.copy(this);const l=1/o,h=1/r,u=1/a;return _n.elements[0]*=l,_n.elements[1]*=l,_n.elements[2]*=l,_n.elements[4]*=h,_n.elements[5]*=h,_n.elements[6]*=h,_n.elements[8]*=u,_n.elements[9]*=u,_n.elements[10]*=u,e.setFromRotationMatrix(_n),n.x=o,n.y=r,n.z=a,this}makePerspective(t,e,n,s,o,r,a=si){const c=this.elements,l=2*o/(e-t),h=2*o/(n-s),u=(e+t)/(e-t),f=(n+s)/(n-s);let d,g;if(a===si)d=-(r+o)/(r-o),g=-2*r*o/(r-o);else if(a===Va)d=-r/(r-o),g=-r*o/(r-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=d,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,o,r,a=si){const c=this.elements,l=1/(e-t),h=1/(n-s),u=1/(r-o),f=(e+t)*l,d=(n+s)*h;let g,v;if(a===si)g=(r+o)*u,v=-2*u;else if(a===Va)g=o*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-d,c[2]=0,c[6]=0,c[10]=v,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const bs=new R,_n=new oe,zv=new R(0,0,0),Bv=new R(1,1,1),xi=new R,Lr=new R,an=new R,Jd=new oe,Qd=new ui;class On{constructor(t=0,e=0,n=0,s=On.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,o=s[0],r=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Pe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-r,o)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Pe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,o),this._z=0);break;case"ZXY":this._x=Math.asin(Pe(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-r,l)):(this._y=0,this._z=Math.atan2(c,o));break;case"ZYX":this._y=Math.asin(-Pe(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,o)):(this._x=0,this._z=Math.atan2(-r,l));break;case"YZX":this._z=Math.asin(Pe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,o)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Pe(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,o)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Jd.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Jd,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Qd.setFromEuler(this),this.setFromQuaternion(Qd,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}On.DEFAULT_ORDER="XYZ";class fc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Hv=0;const t0=new R,Ss=new ui,Xn=new oe,Nr=new R,To=new R,Gv=new R,Vv=new ui,e0=new R(1,0,0),n0=new R(0,1,0),i0=new R(0,0,1),s0={type:"added"},Wv={type:"removed"},Es={type:"childadded",child:null},kc={type:"childremoved",child:null};class Te extends yo{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Hv++}),this.uuid=fs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Te.DEFAULT_UP.clone();const t=new R,e=new On,n=new ui,s=new R(1,1,1);function o(){n.setFromEuler(e,!1)}function r(){e.setFromQuaternion(n,void 0,!1)}e._onChange(o),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new oe},normalMatrix:{value:new Jt}}),this.matrix=new oe,this.matrixWorld=new oe,this.matrixAutoUpdate=Te.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Te.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new fc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ss.setFromAxisAngle(t,e),this.quaternion.multiply(Ss),this}rotateOnWorldAxis(t,e){return Ss.setFromAxisAngle(t,e),this.quaternion.premultiply(Ss),this}rotateX(t){return this.rotateOnAxis(e0,t)}rotateY(t){return this.rotateOnAxis(n0,t)}rotateZ(t){return this.rotateOnAxis(i0,t)}translateOnAxis(t,e){return t0.copy(t).applyQuaternion(this.quaternion),this.position.add(t0.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(e0,t)}translateY(t){return this.translateOnAxis(n0,t)}translateZ(t){return this.translateOnAxis(i0,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Xn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Nr.copy(t):Nr.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),To.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Xn.lookAt(To,Nr,this.up):Xn.lookAt(Nr,To,this.up),this.quaternion.setFromRotationMatrix(Xn),s&&(Xn.extractRotation(s.matrixWorld),Ss.setFromRotationMatrix(Xn),this.quaternion.premultiply(Ss.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(s0),Es.child=t,this.dispatchEvent(Es),Es.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Wv),kc.child=t,this.dispatchEvent(kc),kc.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Xn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Xn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Xn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(s0),Es.child=t,this.dispatchEvent(Es),Es.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const r=this.children[n].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let o=0,r=s.length;o<r;o++)s[o].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(To,t,Gv),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(To,Vv,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let o=0,r=s.length;o<r;o++)s[o].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function o(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=o(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];o(t.shapes,u)}else o(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(o(t.materials,this.material[c]));s.material=a}else s.material=o(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(o(t.animations,c))}}if(e){const a=r(t.geometries),c=r(t.materials),l=r(t.textures),h=r(t.images),u=r(t.shapes),f=r(t.skeletons),d=r(t.animations),g=r(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=s,n;function r(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Te.DEFAULT_UP=new R(0,1,0);Te.DEFAULT_MATRIX_AUTO_UPDATE=!0;Te.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Mn=new R,qn=new R,zc=new R,Yn=new R,Ts=new R,As=new R,o0=new R,Bc=new R,Hc=new R,Gc=new R,Vc=new de,Wc=new de,Xc=new de;class gn{constructor(t=new R,e=new R,n=new R){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Mn.subVectors(t,e),s.cross(Mn);const o=s.lengthSq();return o>0?s.multiplyScalar(1/Math.sqrt(o)):s.set(0,0,0)}static getBarycoord(t,e,n,s,o){Mn.subVectors(s,e),qn.subVectors(n,e),zc.subVectors(t,e);const r=Mn.dot(Mn),a=Mn.dot(qn),c=Mn.dot(zc),l=qn.dot(qn),h=qn.dot(zc),u=r*l-a*a;if(u===0)return o.set(0,0,0),null;const f=1/u,d=(l*c-a*h)*f,g=(r*h-a*c)*f;return o.set(1-d-g,g,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Yn)===null?!1:Yn.x>=0&&Yn.y>=0&&Yn.x+Yn.y<=1}static getInterpolation(t,e,n,s,o,r,a,c){return this.getBarycoord(t,e,n,s,Yn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(o,Yn.x),c.addScaledVector(r,Yn.y),c.addScaledVector(a,Yn.z),c)}static getInterpolatedAttribute(t,e,n,s,o,r){return Vc.setScalar(0),Wc.setScalar(0),Xc.setScalar(0),Vc.fromBufferAttribute(t,e),Wc.fromBufferAttribute(t,n),Xc.fromBufferAttribute(t,s),r.setScalar(0),r.addScaledVector(Vc,o.x),r.addScaledVector(Wc,o.y),r.addScaledVector(Xc,o.z),r}static isFrontFacing(t,e,n,s){return Mn.subVectors(n,e),qn.subVectors(t,e),Mn.cross(qn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Mn.subVectors(this.c,this.b),qn.subVectors(this.a,this.b),Mn.cross(qn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return gn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return gn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,o){return gn.getInterpolation(t,this.a,this.b,this.c,e,n,s,o)}containsPoint(t){return gn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return gn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,o=this.c;let r,a;Ts.subVectors(s,n),As.subVectors(o,n),Bc.subVectors(t,n);const c=Ts.dot(Bc),l=As.dot(Bc);if(c<=0&&l<=0)return e.copy(n);Hc.subVectors(t,s);const h=Ts.dot(Hc),u=As.dot(Hc);if(h>=0&&u<=h)return e.copy(s);const f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return r=c/(c-h),e.copy(n).addScaledVector(Ts,r);Gc.subVectors(t,o);const d=Ts.dot(Gc),g=As.dot(Gc);if(g>=0&&d<=g)return e.copy(o);const v=d*l-c*g;if(v<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(As,a);const m=h*g-d*u;if(m<=0&&u-h>=0&&d-g>=0)return o0.subVectors(o,s),a=(u-h)/(u-h+(d-g)),e.copy(s).addScaledVector(o0,a);const p=1/(m+v+f);return r=v*p,a=f*p,e.copy(n).addScaledVector(Ts,r).addScaledVector(As,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const um={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},_i={h:0,s:0,l:0},Fr={h:0,s:0,l:0};function qc(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Vt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=hn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ce.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=ce.workingColorSpace){return this.r=t,this.g=e,this.b=n,ce.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=ce.workingColorSpace){if(t=ku(t,1),e=Pe(e,0,1),n=Pe(n,0,1),e===0)this.r=this.g=this.b=n;else{const o=n<=.5?n*(1+e):n+e-n*e,r=2*n-o;this.r=qc(r,o,t+1/3),this.g=qc(r,o,t),this.b=qc(r,o,t-1/3)}return ce.toWorkingColorSpace(this,s),this}setStyle(t,e=hn){function n(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let o;const r=s[1],a=s[2];switch(r){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,e);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,e);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const o=s[1],r=o.length;if(r===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(o,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=hn){const n=um[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ai(t.r),this.g=ai(t.g),this.b=ai(t.b),this}copyLinearToSRGB(t){return this.r=Js(t.r),this.g=Js(t.g),this.b=Js(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=hn){return ce.fromWorkingColorSpace(Xe.copy(this),t),Math.round(Pe(Xe.r*255,0,255))*65536+Math.round(Pe(Xe.g*255,0,255))*256+Math.round(Pe(Xe.b*255,0,255))}getHexString(t=hn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ce.workingColorSpace){ce.fromWorkingColorSpace(Xe.copy(this),e);const n=Xe.r,s=Xe.g,o=Xe.b,r=Math.max(n,s,o),a=Math.min(n,s,o);let c,l;const h=(a+r)/2;if(a===r)c=0,l=0;else{const u=r-a;switch(l=h<=.5?u/(r+a):u/(2-r-a),r){case n:c=(s-o)/u+(s<o?6:0);break;case s:c=(o-n)/u+2;break;case o:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=ce.workingColorSpace){return ce.fromWorkingColorSpace(Xe.copy(this),e),t.r=Xe.r,t.g=Xe.g,t.b=Xe.b,t}getStyle(t=hn){ce.fromWorkingColorSpace(Xe.copy(this),t);const e=Xe.r,n=Xe.g,s=Xe.b;return t!==hn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(_i),this.setHSL(_i.h+t,_i.s+e,_i.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(_i),t.getHSL(Fr);const n=nr(_i.h,Fr.h,e),s=nr(_i.s,Fr.s,e),o=nr(_i.l,Fr.l,e);return this.setHSL(n,s,o),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,o=t.elements;return this.r=o[0]*e+o[3]*n+o[6]*s,this.g=o[1]*e+o[4]*n+o[7]*s,this.b=o[2]*e+o[5]*n+o[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Xe=new Vt;Vt.NAMES=um;let Xv=0;class ki extends yo{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Xv++}),this.uuid=fs(),this.name="",this.blending=Ks,this.side=Ii,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=fh,this.blendDst=ph,this.blendEquation=es,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Vt(0,0,0),this.blendAlpha=0,this.depthFunc=so,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Hd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ys,this.stencilZFail=ys,this.stencilZPass=ys,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ks&&(n.blending=this.blending),this.side!==Ii&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==fh&&(n.blendSrc=this.blendSrc),this.blendDst!==ph&&(n.blendDst=this.blendDst),this.blendEquation!==es&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==so&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Hd&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ys&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ys&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ys&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(o){const r=[];for(const a in o){const c=o[a];delete c.metadata,r.push(c)}return r}if(e){const o=s(t.textures),r=s(t.images);o.length>0&&(n.textures=o),r.length>0&&(n.images=r)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let o=0;o!==s;++o)n[o]=e[o].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class vr extends ki{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Vt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new On,this.combine=Pu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ae=new R,Ur=new tt;class ze{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Gd,this.updateRanges=[],this.gpuType=ii,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,o=this.itemSize;s<o;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Ur.fromBufferAttribute(this,e),Ur.applyMatrix3(t),this.setXY(e,Ur.x,Ur.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyMatrix3(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyMatrix4(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyNormalMatrix(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.transformDirection(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Bs(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=je(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Bs(e,this.array)),e}setX(t,e){return this.normalized&&(e=je(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Bs(e,this.array)),e}setY(t,e){return this.normalized&&(e=je(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Bs(e,this.array)),e}setZ(t,e){return this.normalized&&(e=je(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Bs(e,this.array)),e}setW(t,e){return this.normalized&&(e=je(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=je(e,this.array),n=je(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=je(e,this.array),n=je(n,this.array),s=je(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,o){return t*=this.itemSize,this.normalized&&(e=je(e,this.array),n=je(n,this.array),s=je(s,this.array),o=je(o,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=o,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Gd&&(t.usage=this.usage),t}}class dm extends ze{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class fm extends ze{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class le extends ze{constructor(t,e,n){super(new Float32Array(t),e,n)}}let qv=0;const dn=new oe,Yc=new Te,Rs=new R,cn=new Di,Ao=new Di,Ue=new R;class Fe extends yo{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:qv++}),this.uuid=fs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(cm(t)?fm:dm)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const o=new Jt().getNormalMatrix(t);n.applyNormalMatrix(o),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return dn.makeRotationFromQuaternion(t),this.applyMatrix4(dn),this}rotateX(t){return dn.makeRotationX(t),this.applyMatrix4(dn),this}rotateY(t){return dn.makeRotationY(t),this.applyMatrix4(dn),this}rotateZ(t){return dn.makeRotationZ(t),this.applyMatrix4(dn),this}translate(t,e,n){return dn.makeTranslation(t,e,n),this.applyMatrix4(dn),this}scale(t,e,n){return dn.makeScale(t,e,n),this.applyMatrix4(dn),this}lookAt(t){return Yc.lookAt(t),Yc.updateMatrix(),this.applyMatrix4(Yc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Rs).negate(),this.translate(Rs.x,Rs.y,Rs.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,o=t.length;s<o;s++){const r=t[s];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new le(n,3))}else{for(let n=0,s=e.count;n<s;n++){const o=t[n];e.setXYZ(n,o.x,o.y,o.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Di);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const o=e[n];cn.setFromBufferAttribute(o),this.morphTargetsRelative?(Ue.addVectors(this.boundingBox.min,cn.min),this.boundingBox.expandByPoint(Ue),Ue.addVectors(this.boundingBox.max,cn.max),this.boundingBox.expandByPoint(Ue)):(this.boundingBox.expandByPoint(cn.min),this.boundingBox.expandByPoint(cn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new wo);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(t){const n=this.boundingSphere.center;if(cn.setFromBufferAttribute(t),e)for(let o=0,r=e.length;o<r;o++){const a=e[o];Ao.setFromBufferAttribute(a),this.morphTargetsRelative?(Ue.addVectors(cn.min,Ao.min),cn.expandByPoint(Ue),Ue.addVectors(cn.max,Ao.max),cn.expandByPoint(Ue)):(cn.expandByPoint(Ao.min),cn.expandByPoint(Ao.max))}cn.getCenter(n);let s=0;for(let o=0,r=t.count;o<r;o++)Ue.fromBufferAttribute(t,o),s=Math.max(s,n.distanceToSquared(Ue));if(e)for(let o=0,r=e.length;o<r;o++){const a=e[o],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Ue.fromBufferAttribute(a,l),c&&(Rs.fromBufferAttribute(t,l),Ue.add(Rs)),s=Math.max(s,n.distanceToSquared(Ue))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,o=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ze(new Float32Array(4*n.count),4));const r=this.getAttribute("tangent"),a=[],c=[];for(let T=0;T<n.count;T++)a[T]=new R,c[T]=new R;const l=new R,h=new R,u=new R,f=new tt,d=new tt,g=new tt,v=new R,m=new R;function p(T,_,M){l.fromBufferAttribute(n,T),h.fromBufferAttribute(n,_),u.fromBufferAttribute(n,M),f.fromBufferAttribute(o,T),d.fromBufferAttribute(o,_),g.fromBufferAttribute(o,M),h.sub(l),u.sub(l),d.sub(f),g.sub(f);const A=1/(d.x*g.y-g.x*d.y);isFinite(A)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(u,-d.y).multiplyScalar(A),m.copy(u).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(A),a[T].add(v),a[_].add(v),a[M].add(v),c[T].add(m),c[_].add(m),c[M].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let T=0,_=x.length;T<_;++T){const M=x[T],A=M.start,P=M.count;for(let C=A,L=A+P;C<L;C+=3)p(t.getX(C+0),t.getX(C+1),t.getX(C+2))}const y=new R,w=new R,b=new R,S=new R;function E(T){b.fromBufferAttribute(s,T),S.copy(b);const _=a[T];y.copy(_),y.sub(b.multiplyScalar(b.dot(_))).normalize(),w.crossVectors(S,_);const A=w.dot(c[T])<0?-1:1;r.setXYZW(T,y.x,y.y,y.z,A)}for(let T=0,_=x.length;T<_;++T){const M=x[T],A=M.start,P=M.count;for(let C=A,L=A+P;C<L;C+=3)E(t.getX(C+0)),E(t.getX(C+1)),E(t.getX(C+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new ze(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const s=new R,o=new R,r=new R,a=new R,c=new R,l=new R,h=new R,u=new R;if(t)for(let f=0,d=t.count;f<d;f+=3){const g=t.getX(f+0),v=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,g),o.fromBufferAttribute(e,v),r.fromBufferAttribute(e,m),h.subVectors(r,o),u.subVectors(s,o),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,d=e.count;f<d;f+=3)s.fromBufferAttribute(e,f+0),o.fromBufferAttribute(e,f+1),r.fromBufferAttribute(e,f+2),h.subVectors(r,o),u.subVectors(s,o),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ue.fromBufferAttribute(t,e),Ue.normalize(),t.setXYZ(e,Ue.x,Ue.y,Ue.z)}toNonIndexed(){function t(a,c){const l=a.array,h=a.itemSize,u=a.normalized,f=new l.constructor(c.length*h);let d=0,g=0;for(let v=0,m=c.length;v<m;v++){a.isInterleavedBufferAttribute?d=c[v]*a.data.stride+a.offset:d=c[v]*h;for(let p=0;p<h;p++)f[g++]=l[d++]}return new ze(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Fe,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,n);e.setAttribute(a,l)}const o=this.morphAttributes;for(const a in o){const c=[],l=o[a];for(let h=0,u=l.length;h<u;h++){const f=l[h],d=t(f,n);c.push(d)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let a=0,c=r.length;a<c;a++){const l=r[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let o=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){const d=l[u];h.push(d.toJSON(t.data))}h.length>0&&(s[c]=h,o=!0)}o&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const o=t.morphAttributes;for(const l in o){const h=[],u=o[l];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let l=0,h=r.length;l<h;l++){const u=r[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const r0=new oe,Wi=new gr,Or=new wo,a0=new R,kr=new R,zr=new R,Br=new R,$c=new R,Hr=new R,c0=new R,Gr=new R;class $t extends Te{constructor(t=new Fe,e=new vr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=s.length;o<r;o++){const a=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,o=n.morphAttributes.position,r=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(o&&a){Hr.set(0,0,0);for(let c=0,l=o.length;c<l;c++){const h=a[c],u=o[c];h!==0&&($c.fromBufferAttribute(u,t),r?Hr.addScaledVector($c,h):Hr.addScaledVector($c.sub(e),h))}e.add(Hr)}return e}raycast(t,e){const n=this.geometry,s=this.material,o=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Or.copy(n.boundingSphere),Or.applyMatrix4(o),Wi.copy(t.ray).recast(t.near),!(Or.containsPoint(Wi.origin)===!1&&(Wi.intersectSphere(Or,a0)===null||Wi.origin.distanceToSquared(a0)>(t.far-t.near)**2))&&(r0.copy(o).invert(),Wi.copy(t.ray).applyMatrix4(r0),!(n.boundingBox!==null&&Wi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Wi)))}_computeIntersections(t,e,n){let s;const o=this.geometry,r=this.material,a=o.index,c=o.attributes.position,l=o.attributes.uv,h=o.attributes.uv1,u=o.attributes.normal,f=o.groups,d=o.drawRange;if(a!==null)if(Array.isArray(r))for(let g=0,v=f.length;g<v;g++){const m=f[g],p=r[m.materialIndex],x=Math.max(m.start,d.start),y=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let w=x,b=y;w<b;w+=3){const S=a.getX(w),E=a.getX(w+1),T=a.getX(w+2);s=Vr(this,p,t,n,l,h,u,S,E,T),s&&(s.faceIndex=Math.floor(w/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),v=Math.min(a.count,d.start+d.count);for(let m=g,p=v;m<p;m+=3){const x=a.getX(m),y=a.getX(m+1),w=a.getX(m+2);s=Vr(this,r,t,n,l,h,u,x,y,w),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let g=0,v=f.length;g<v;g++){const m=f[g],p=r[m.materialIndex],x=Math.max(m.start,d.start),y=Math.min(c.count,Math.min(m.start+m.count,d.start+d.count));for(let w=x,b=y;w<b;w+=3){const S=w,E=w+1,T=w+2;s=Vr(this,p,t,n,l,h,u,S,E,T),s&&(s.faceIndex=Math.floor(w/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),v=Math.min(c.count,d.start+d.count);for(let m=g,p=v;m<p;m+=3){const x=m,y=m+1,w=m+2;s=Vr(this,r,t,n,l,h,u,x,y,w),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Yv(i,t,e,n,s,o,r,a){let c;if(t.side===en?c=n.intersectTriangle(r,o,s,!0,a):c=n.intersectTriangle(s,o,r,t.side===Ii,a),c===null)return null;Gr.copy(a),Gr.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Gr);return l<e.near||l>e.far?null:{distance:l,point:Gr.clone(),object:i}}function Vr(i,t,e,n,s,o,r,a,c,l){i.getVertexPosition(a,kr),i.getVertexPosition(c,zr),i.getVertexPosition(l,Br);const h=Yv(i,t,e,n,kr,zr,Br,c0);if(h){const u=new R;gn.getBarycoord(c0,kr,zr,Br,u),s&&(h.uv=gn.getInterpolatedAttribute(s,a,c,l,u,new tt)),o&&(h.uv1=gn.getInterpolatedAttribute(o,a,c,l,u,new tt)),r&&(h.normal=gn.getInterpolatedAttribute(r,a,c,l,u,new R),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a,b:c,c:l,normal:new R,materialIndex:0};gn.getNormal(kr,zr,Br,f.normal),h.face=f,h.barycoord=u}return h}class k extends Fe{constructor(t=1,e=1,n=1,s=1,o=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:o,depthSegments:r};const a=this;s=Math.floor(s),o=Math.floor(o),r=Math.floor(r);const c=[],l=[],h=[],u=[];let f=0,d=0;g("z","y","x",-1,-1,n,e,t,r,o,0),g("z","y","x",1,-1,n,e,-t,r,o,1),g("x","z","y",1,1,t,n,e,s,r,2),g("x","z","y",1,-1,t,n,-e,s,r,3),g("x","y","z",1,-1,t,e,n,s,o,4),g("x","y","z",-1,-1,t,e,-n,s,o,5),this.setIndex(c),this.setAttribute("position",new le(l,3)),this.setAttribute("normal",new le(h,3)),this.setAttribute("uv",new le(u,2));function g(v,m,p,x,y,w,b,S,E,T,_){const M=w/E,A=b/T,P=w/2,C=b/2,L=S/2,N=E+1,F=T+1;let H=0,G=0;const V=new R;for(let et=0;et<F;et++){const lt=et*A-C;for(let bt=0;bt<N;bt++){const Dt=bt*M-P;V[v]=Dt*x,V[m]=lt*y,V[p]=L,l.push(V.x,V.y,V.z),V[v]=0,V[m]=0,V[p]=S>0?1:-1,h.push(V.x,V.y,V.z),u.push(bt/E),u.push(1-et/T),H+=1}}for(let et=0;et<T;et++)for(let lt=0;lt<E;lt++){const bt=f+lt+N*et,Dt=f+lt+N*(et+1),J=f+(lt+1)+N*(et+1),rt=f+(lt+1)+N*et;c.push(bt,Dt,rt),c.push(Dt,J,rt),G+=6}a.addGroup(d,G,_),d+=G,f+=H}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new k(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ho(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Je(i){const t={};for(let e=0;e<i.length;e++){const n=ho(i[e]);for(const s in n)t[s]=n[s]}return t}function $v(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function pm(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ce.workingColorSpace}const pc={clone:ho,merge:Je};var Zv=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Kv=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class be extends ki{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Zv,this.fragmentShader=Kv,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ho(t.uniforms),this.uniformsGroups=$v(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?e.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[s]={type:"m4",value:r.toArray()}:e.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class mm extends Te{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new oe,this.projectionMatrix=new oe,this.projectionMatrixInverse=new oe,this.coordinateSystem=si}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Mi=new R,l0=new tt,h0=new tt;class on extends mm{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=lo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(er*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return lo*2*Math.atan(Math.tan(er*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Mi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Mi.x,Mi.y).multiplyScalar(-t/Mi.z),Mi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Mi.x,Mi.y).multiplyScalar(-t/Mi.z)}getViewSize(t,e){return this.getViewBounds(t,l0,h0),e.subVectors(h0,l0)}setViewOffset(t,e,n,s,o,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=o,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(er*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,o=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,l=r.fullHeight;o+=r.offsetX*s/c,e-=r.offsetY*n/l,s*=r.width/c,n*=r.height/l}const a=this.filmOffset;a!==0&&(o+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Cs=-90,Ps=1;class jv extends Te{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new on(Cs,Ps,t,e);s.layers=this.layers,this.add(s);const o=new on(Cs,Ps,t,e);o.layers=this.layers,this.add(o);const r=new on(Cs,Ps,t,e);r.layers=this.layers,this.add(r);const a=new on(Cs,Ps,t,e);a.layers=this.layers,this.add(a);const c=new on(Cs,Ps,t,e);c.layers=this.layers,this.add(c);const l=new on(Cs,Ps,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,o,r,a,c]=e;for(const l of e)this.remove(l);if(t===si)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Va)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[o,r,a,c,l,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,o),t.setRenderTarget(n,1,s),t.render(e,r),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,f,d),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class gm extends nn{constructor(t,e,n,s,o,r,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:oo,super(t,e,n,s,o,r,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Jv extends Sn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new gm(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:He}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new k(5,5,5),o=new be({name:"CubemapFromEquirect",uniforms:ho(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:en,blending:Ln});o.uniforms.tEquirect.value=e;const r=new $t(s,o),a=e.minFilter;return e.minFilter===Ai&&(e.minFilter=He),new jv(1,10,this).update(t,r),e.minFilter=a,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,n,s){const o=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,n,s);t.setRenderTarget(o)}}const Zc=new R,Qv=new R,ty=new Jt;class Ti{constructor(t=new R(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Zc.subVectors(n,e).cross(Qv.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Zc),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/s;return o<0||o>1?null:e.copy(t.start).addScaledVector(n,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||ty.getNormalMatrix(t),s=this.coplanarPoint(Zc).applyMatrix4(t),o=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(o),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Xi=new wo,Wr=new R;class zu{constructor(t=new Ti,e=new Ti,n=new Ti,s=new Ti,o=new Ti,r=new Ti){this.planes=[t,e,n,s,o,r]}set(t,e,n,s,o,r){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(o),a[5].copy(r),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=si){const n=this.planes,s=t.elements,o=s[0],r=s[1],a=s[2],c=s[3],l=s[4],h=s[5],u=s[6],f=s[7],d=s[8],g=s[9],v=s[10],m=s[11],p=s[12],x=s[13],y=s[14],w=s[15];if(n[0].setComponents(c-o,f-l,m-d,w-p).normalize(),n[1].setComponents(c+o,f+l,m+d,w+p).normalize(),n[2].setComponents(c+r,f+h,m+g,w+x).normalize(),n[3].setComponents(c-r,f-h,m-g,w-x).normalize(),n[4].setComponents(c-a,f-u,m-v,w-y).normalize(),e===si)n[5].setComponents(c+a,f+u,m+v,w+y).normalize();else if(e===Va)n[5].setComponents(a,u,v,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Xi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Xi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Xi)}intersectsSprite(t){return Xi.center.set(0,0,0),Xi.radius=.7071067811865476,Xi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Xi)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let o=0;o<6;o++)if(e[o].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Wr.x=s.normal.x>0?t.max.x:t.min.x,Wr.y=s.normal.y>0?t.max.y:t.min.y,Wr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Wr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function vm(){let i=null,t=!1,e=null,n=null;function s(o,r){e(o,r),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(o){e=o},setContext:function(o){i=o}}}function ey(i){const t=new WeakMap;function e(a,c){const l=a.array,h=a.usage,u=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,h),a.onUploadCallback();let d;if(l instanceof Float32Array)d=i.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=i.SHORT;else if(l instanceof Uint32Array)d=i.UNSIGNED_INT;else if(l instanceof Int32Array)d=i.INT;else if(l instanceof Int8Array)d=i.BYTE;else if(l instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){const h=c.array,u=c.updateRanges;if(i.bindBuffer(l,a),u.length===0)i.bufferSubData(l,0,h);else{u.sort((d,g)=>d.start-g.start);let f=0;for(let d=1;d<u.length;d++){const g=u[f],v=u[d];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++f,u[f]=v)}u.length=f+1;for(let d=0,g=u.length;d<g;d++){const v=u[d];i.bufferSubData(l,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function o(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function r(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:o,update:r}}class En extends Fe{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const o=t/2,r=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,u=t/a,f=e/c,d=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const x=p*f-r;for(let y=0;y<l;y++){const w=y*u-o;g.push(w,-x,0),v.push(0,0,1),m.push(y/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let x=0;x<a;x++){const y=x+l*p,w=x+l*(p+1),b=x+1+l*(p+1),S=x+1+l*p;d.push(y,w,S),d.push(w,b,S)}this.setIndex(d),this.setAttribute("position",new le(g,3)),this.setAttribute("normal",new le(v,3)),this.setAttribute("uv",new le(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new En(t.width,t.height,t.widthSegments,t.heightSegments)}}var ny=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,iy=`#ifdef USE_ALPHAHASH
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
#endif`,sy=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,oy=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ry=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ay=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,cy=`#ifdef USE_AOMAP
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
#endif`,ly=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,hy=`#ifdef USE_BATCHING
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
#endif`,uy=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,dy=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,fy=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,py=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,my=`#ifdef USE_IRIDESCENCE
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
#endif`,gy=`#ifdef USE_BUMPMAP
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
#endif`,vy=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,yy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,wy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,xy=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,_y=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,My=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,by=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Sy=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Ey=`#define PI 3.141592653589793
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
} // validated`,Ty=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Ay=`vec3 transformedNormal = objectNormal;
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
#endif`,Ry=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Cy=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Py=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Iy=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Dy="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ly=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ny=`#ifdef USE_ENVMAP
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
#endif`,Fy=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Uy=`#ifdef USE_ENVMAP
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
#endif`,Oy=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ky=`#ifdef USE_ENVMAP
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
#endif`,zy=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,By=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Hy=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Gy=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Vy=`#ifdef USE_GRADIENTMAP
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
}`,Wy=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Xy=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,qy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Yy=`uniform bool receiveShadow;
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
#endif`,$y=`#ifdef USE_ENVMAP
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
#endif`,Zy=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ky=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,jy=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Jy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Qy=`PhysicalMaterial material;
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
#endif`,tw=`struct PhysicalMaterial {
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
}`,ew=`
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
#endif`,nw=`#if defined( RE_IndirectDiffuse )
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
#endif`,iw=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,sw=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ow=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,rw=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,aw=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,cw=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,lw=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,hw=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,uw=`#if defined( USE_POINTS_UV )
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
#endif`,dw=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,fw=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,pw=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,mw=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,gw=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,vw=`#ifdef USE_MORPHTARGETS
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
#endif`,yw=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ww=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,xw=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,_w=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Mw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,bw=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Sw=`#ifdef USE_NORMALMAP
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
#endif`,Ew=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Tw=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Aw=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Rw=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Cw=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Pw=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Iw=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Dw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Lw=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Nw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Fw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Uw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ow=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,kw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,zw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Bw=`float getShadowMask() {
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
}`,Hw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Gw=`#ifdef USE_SKINNING
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
#endif`,Vw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ww=`#ifdef USE_SKINNING
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
#endif`,Xw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,qw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Yw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,$w=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Zw=`#ifdef USE_TRANSMISSION
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
#endif`,Kw=`#ifdef USE_TRANSMISSION
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
#endif`,jw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Jw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Qw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,t2=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const e2=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,n2=`uniform sampler2D t2D;
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
}`,i2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,s2=`#ifdef ENVMAP_TYPE_CUBE
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
}`,o2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,r2=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,a2=`#include <common>
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
}`,c2=`#if DEPTH_PACKING == 3200
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
}`,l2=`#define DISTANCE
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
}`,h2=`#define DISTANCE
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
}`,u2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,d2=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,f2=`uniform float scale;
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
}`,p2=`uniform vec3 diffuse;
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
}`,m2=`#include <common>
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
}`,g2=`uniform vec3 diffuse;
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
}`,v2=`#define LAMBERT
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
}`,y2=`#define LAMBERT
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
}`,w2=`#define MATCAP
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
}`,x2=`#define MATCAP
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
}`,_2=`#define NORMAL
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
}`,M2=`#define NORMAL
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
}`,b2=`#define PHONG
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
}`,S2=`#define PHONG
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
}`,E2=`#define STANDARD
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
}`,T2=`#define STANDARD
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
}`,A2=`#define TOON
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
}`,R2=`#define TOON
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
}`,C2=`uniform float size;
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
}`,P2=`uniform vec3 diffuse;
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
}`,I2=`#include <common>
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
}`,D2=`uniform vec3 color;
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
}`,L2=`uniform float rotation;
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
}`,N2=`uniform vec3 diffuse;
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
}`,ee={alphahash_fragment:ny,alphahash_pars_fragment:iy,alphamap_fragment:sy,alphamap_pars_fragment:oy,alphatest_fragment:ry,alphatest_pars_fragment:ay,aomap_fragment:cy,aomap_pars_fragment:ly,batching_pars_vertex:hy,batching_vertex:uy,begin_vertex:dy,beginnormal_vertex:fy,bsdfs:py,iridescence_fragment:my,bumpmap_pars_fragment:gy,clipping_planes_fragment:vy,clipping_planes_pars_fragment:yy,clipping_planes_pars_vertex:wy,clipping_planes_vertex:xy,color_fragment:_y,color_pars_fragment:My,color_pars_vertex:by,color_vertex:Sy,common:Ey,cube_uv_reflection_fragment:Ty,defaultnormal_vertex:Ay,displacementmap_pars_vertex:Ry,displacementmap_vertex:Cy,emissivemap_fragment:Py,emissivemap_pars_fragment:Iy,colorspace_fragment:Dy,colorspace_pars_fragment:Ly,envmap_fragment:Ny,envmap_common_pars_fragment:Fy,envmap_pars_fragment:Uy,envmap_pars_vertex:Oy,envmap_physical_pars_fragment:$y,envmap_vertex:ky,fog_vertex:zy,fog_pars_vertex:By,fog_fragment:Hy,fog_pars_fragment:Gy,gradientmap_pars_fragment:Vy,lightmap_pars_fragment:Wy,lights_lambert_fragment:Xy,lights_lambert_pars_fragment:qy,lights_pars_begin:Yy,lights_toon_fragment:Zy,lights_toon_pars_fragment:Ky,lights_phong_fragment:jy,lights_phong_pars_fragment:Jy,lights_physical_fragment:Qy,lights_physical_pars_fragment:tw,lights_fragment_begin:ew,lights_fragment_maps:nw,lights_fragment_end:iw,logdepthbuf_fragment:sw,logdepthbuf_pars_fragment:ow,logdepthbuf_pars_vertex:rw,logdepthbuf_vertex:aw,map_fragment:cw,map_pars_fragment:lw,map_particle_fragment:hw,map_particle_pars_fragment:uw,metalnessmap_fragment:dw,metalnessmap_pars_fragment:fw,morphinstance_vertex:pw,morphcolor_vertex:mw,morphnormal_vertex:gw,morphtarget_pars_vertex:vw,morphtarget_vertex:yw,normal_fragment_begin:ww,normal_fragment_maps:xw,normal_pars_fragment:_w,normal_pars_vertex:Mw,normal_vertex:bw,normalmap_pars_fragment:Sw,clearcoat_normal_fragment_begin:Ew,clearcoat_normal_fragment_maps:Tw,clearcoat_pars_fragment:Aw,iridescence_pars_fragment:Rw,opaque_fragment:Cw,packing:Pw,premultiplied_alpha_fragment:Iw,project_vertex:Dw,dithering_fragment:Lw,dithering_pars_fragment:Nw,roughnessmap_fragment:Fw,roughnessmap_pars_fragment:Uw,shadowmap_pars_fragment:Ow,shadowmap_pars_vertex:kw,shadowmap_vertex:zw,shadowmask_pars_fragment:Bw,skinbase_vertex:Hw,skinning_pars_vertex:Gw,skinning_vertex:Vw,skinnormal_vertex:Ww,specularmap_fragment:Xw,specularmap_pars_fragment:qw,tonemapping_fragment:Yw,tonemapping_pars_fragment:$w,transmission_fragment:Zw,transmission_pars_fragment:Kw,uv_pars_fragment:jw,uv_pars_vertex:Jw,uv_vertex:Qw,worldpos_vertex:t2,background_vert:e2,background_frag:n2,backgroundCube_vert:i2,backgroundCube_frag:s2,cube_vert:o2,cube_frag:r2,depth_vert:a2,depth_frag:c2,distanceRGBA_vert:l2,distanceRGBA_frag:h2,equirect_vert:u2,equirect_frag:d2,linedashed_vert:f2,linedashed_frag:p2,meshbasic_vert:m2,meshbasic_frag:g2,meshlambert_vert:v2,meshlambert_frag:y2,meshmatcap_vert:w2,meshmatcap_frag:x2,meshnormal_vert:_2,meshnormal_frag:M2,meshphong_vert:b2,meshphong_frag:S2,meshphysical_vert:E2,meshphysical_frag:T2,meshtoon_vert:A2,meshtoon_frag:R2,points_vert:C2,points_frag:P2,shadow_vert:I2,shadow_frag:D2,sprite_vert:L2,sprite_frag:N2},St={common:{diffuse:{value:new Vt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Jt}},envmap:{envMap:{value:null},envMapRotation:{value:new Jt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Jt},normalScale:{value:new tt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Vt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Vt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0},uvTransform:{value:new Jt}},sprite:{diffuse:{value:new Vt(16777215)},opacity:{value:1},center:{value:new tt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}}},Dn={basic:{uniforms:Je([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.fog]),vertexShader:ee.meshbasic_vert,fragmentShader:ee.meshbasic_frag},lambert:{uniforms:Je([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new Vt(0)}}]),vertexShader:ee.meshlambert_vert,fragmentShader:ee.meshlambert_frag},phong:{uniforms:Je([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new Vt(0)},specular:{value:new Vt(1118481)},shininess:{value:30}}]),vertexShader:ee.meshphong_vert,fragmentShader:ee.meshphong_frag},standard:{uniforms:Je([St.common,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.roughnessmap,St.metalnessmap,St.fog,St.lights,{emissive:{value:new Vt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ee.meshphysical_vert,fragmentShader:ee.meshphysical_frag},toon:{uniforms:Je([St.common,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.gradientmap,St.fog,St.lights,{emissive:{value:new Vt(0)}}]),vertexShader:ee.meshtoon_vert,fragmentShader:ee.meshtoon_frag},matcap:{uniforms:Je([St.common,St.bumpmap,St.normalmap,St.displacementmap,St.fog,{matcap:{value:null}}]),vertexShader:ee.meshmatcap_vert,fragmentShader:ee.meshmatcap_frag},points:{uniforms:Je([St.points,St.fog]),vertexShader:ee.points_vert,fragmentShader:ee.points_frag},dashed:{uniforms:Je([St.common,St.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ee.linedashed_vert,fragmentShader:ee.linedashed_frag},depth:{uniforms:Je([St.common,St.displacementmap]),vertexShader:ee.depth_vert,fragmentShader:ee.depth_frag},normal:{uniforms:Je([St.common,St.bumpmap,St.normalmap,St.displacementmap,{opacity:{value:1}}]),vertexShader:ee.meshnormal_vert,fragmentShader:ee.meshnormal_frag},sprite:{uniforms:Je([St.sprite,St.fog]),vertexShader:ee.sprite_vert,fragmentShader:ee.sprite_frag},background:{uniforms:{uvTransform:{value:new Jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ee.background_vert,fragmentShader:ee.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Jt}},vertexShader:ee.backgroundCube_vert,fragmentShader:ee.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ee.cube_vert,fragmentShader:ee.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ee.equirect_vert,fragmentShader:ee.equirect_frag},distanceRGBA:{uniforms:Je([St.common,St.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ee.distanceRGBA_vert,fragmentShader:ee.distanceRGBA_frag},shadow:{uniforms:Je([St.lights,St.fog,{color:{value:new Vt(0)},opacity:{value:1}}]),vertexShader:ee.shadow_vert,fragmentShader:ee.shadow_frag}};Dn.physical={uniforms:Je([Dn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Jt},clearcoatNormalScale:{value:new tt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Jt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Jt},sheen:{value:0},sheenColor:{value:new Vt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Jt},transmissionSamplerSize:{value:new tt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Jt},attenuationDistance:{value:0},attenuationColor:{value:new Vt(0)},specularColor:{value:new Vt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Jt},anisotropyVector:{value:new tt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Jt}}]),vertexShader:ee.meshphysical_vert,fragmentShader:ee.meshphysical_frag};const Xr={r:0,b:0,g:0},qi=new On,F2=new oe;function U2(i,t,e,n,s,o,r){const a=new Vt(0);let c=o===!0?0:1,l,h,u=null,f=0,d=null;function g(x){let y=x.isScene===!0?x.background:null;return y&&y.isTexture&&(y=(x.backgroundBlurriness>0?e:t).get(y)),y}function v(x){let y=!1;const w=g(x);w===null?p(a,c):w&&w.isColor&&(p(w,1),y=!0);const b=i.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(x,y){const w=g(y);w&&(w.isCubeTexture||w.mapping===hc)?(h===void 0&&(h=new $t(new k(1,1,1),new be({name:"BackgroundCubeMaterial",uniforms:ho(Dn.backgroundCube.uniforms),vertexShader:Dn.backgroundCube.vertexShader,fragmentShader:Dn.backgroundCube.fragmentShader,side:en,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(b,S,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),qi.copy(y.backgroundRotation),qi.x*=-1,qi.y*=-1,qi.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(qi.y*=-1,qi.z*=-1),h.material.uniforms.envMap.value=w,h.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(F2.makeRotationFromEuler(qi)),h.material.toneMapped=ce.getTransfer(w.colorSpace)!==ge,(u!==w||f!==w.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,u=w,f=w.version,d=i.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):w&&w.isTexture&&(l===void 0&&(l=new $t(new En(2,2),new be({name:"BackgroundMaterial",uniforms:ho(Dn.background.uniforms),vertexShader:Dn.background.vertexShader,fragmentShader:Dn.background.fragmentShader,side:Ii,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=w,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.toneMapped=ce.getTransfer(w.colorSpace)!==ge,w.matrixAutoUpdate===!0&&w.updateMatrix(),l.material.uniforms.uvTransform.value.copy(w.matrix),(u!==w||f!==w.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,u=w,f=w.version,d=i.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function p(x,y){x.getRGB(Xr,pm(i)),n.buffers.color.setClear(Xr.r,Xr.g,Xr.b,y,r)}return{getClearColor:function(){return a},setClearColor:function(x,y=1){a.set(x),c=y,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,p(a,c)},render:v,addToRenderList:m}}function O2(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let o=s,r=!1;function a(M,A,P,C,L){let N=!1;const F=u(C,P,A);o!==F&&(o=F,l(o.object)),N=d(M,C,P,L),N&&g(M,C,P,L),L!==null&&t.update(L,i.ELEMENT_ARRAY_BUFFER),(N||r)&&(r=!1,w(M,A,P,C),L!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(L).buffer))}function c(){return i.createVertexArray()}function l(M){return i.bindVertexArray(M)}function h(M){return i.deleteVertexArray(M)}function u(M,A,P){const C=P.wireframe===!0;let L=n[M.id];L===void 0&&(L={},n[M.id]=L);let N=L[A.id];N===void 0&&(N={},L[A.id]=N);let F=N[C];return F===void 0&&(F=f(c()),N[C]=F),F}function f(M){const A=[],P=[],C=[];for(let L=0;L<e;L++)A[L]=0,P[L]=0,C[L]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:A,enabledAttributes:P,attributeDivisors:C,object:M,attributes:{},index:null}}function d(M,A,P,C){const L=o.attributes,N=A.attributes;let F=0;const H=P.getAttributes();for(const G in H)if(H[G].location>=0){const et=L[G];let lt=N[G];if(lt===void 0&&(G==="instanceMatrix"&&M.instanceMatrix&&(lt=M.instanceMatrix),G==="instanceColor"&&M.instanceColor&&(lt=M.instanceColor)),et===void 0||et.attribute!==lt||lt&&et.data!==lt.data)return!0;F++}return o.attributesNum!==F||o.index!==C}function g(M,A,P,C){const L={},N=A.attributes;let F=0;const H=P.getAttributes();for(const G in H)if(H[G].location>=0){let et=N[G];et===void 0&&(G==="instanceMatrix"&&M.instanceMatrix&&(et=M.instanceMatrix),G==="instanceColor"&&M.instanceColor&&(et=M.instanceColor));const lt={};lt.attribute=et,et&&et.data&&(lt.data=et.data),L[G]=lt,F++}o.attributes=L,o.attributesNum=F,o.index=C}function v(){const M=o.newAttributes;for(let A=0,P=M.length;A<P;A++)M[A]=0}function m(M){p(M,0)}function p(M,A){const P=o.newAttributes,C=o.enabledAttributes,L=o.attributeDivisors;P[M]=1,C[M]===0&&(i.enableVertexAttribArray(M),C[M]=1),L[M]!==A&&(i.vertexAttribDivisor(M,A),L[M]=A)}function x(){const M=o.newAttributes,A=o.enabledAttributes;for(let P=0,C=A.length;P<C;P++)A[P]!==M[P]&&(i.disableVertexAttribArray(P),A[P]=0)}function y(M,A,P,C,L,N,F){F===!0?i.vertexAttribIPointer(M,A,P,L,N):i.vertexAttribPointer(M,A,P,C,L,N)}function w(M,A,P,C){v();const L=C.attributes,N=P.getAttributes(),F=A.defaultAttributeValues;for(const H in N){const G=N[H];if(G.location>=0){let V=L[H];if(V===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(V=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(V=M.instanceColor)),V!==void 0){const et=V.normalized,lt=V.itemSize,bt=t.get(V);if(bt===void 0)continue;const Dt=bt.buffer,J=bt.type,rt=bt.bytesPerElement,K=J===i.INT||J===i.UNSIGNED_INT||V.gpuType===Iu;if(V.isInterleavedBufferAttribute){const $=V.data,ot=$.stride,mt=V.offset;if($.isInstancedInterleavedBuffer){for(let Mt=0;Mt<G.locationSize;Mt++)p(G.location+Mt,$.meshPerAttribute);M.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let Mt=0;Mt<G.locationSize;Mt++)m(G.location+Mt);i.bindBuffer(i.ARRAY_BUFFER,Dt);for(let Mt=0;Mt<G.locationSize;Mt++)y(G.location+Mt,lt/G.locationSize,J,et,ot*rt,(mt+lt/G.locationSize*Mt)*rt,K)}else{if(V.isInstancedBufferAttribute){for(let $=0;$<G.locationSize;$++)p(G.location+$,V.meshPerAttribute);M.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=V.meshPerAttribute*V.count)}else for(let $=0;$<G.locationSize;$++)m(G.location+$);i.bindBuffer(i.ARRAY_BUFFER,Dt);for(let $=0;$<G.locationSize;$++)y(G.location+$,lt/G.locationSize,J,et,lt*rt,lt/G.locationSize*$*rt,K)}}else if(F!==void 0){const et=F[H];if(et!==void 0)switch(et.length){case 2:i.vertexAttrib2fv(G.location,et);break;case 3:i.vertexAttrib3fv(G.location,et);break;case 4:i.vertexAttrib4fv(G.location,et);break;default:i.vertexAttrib1fv(G.location,et)}}}}x()}function b(){T();for(const M in n){const A=n[M];for(const P in A){const C=A[P];for(const L in C)h(C[L].object),delete C[L];delete A[P]}delete n[M]}}function S(M){if(n[M.id]===void 0)return;const A=n[M.id];for(const P in A){const C=A[P];for(const L in C)h(C[L].object),delete C[L];delete A[P]}delete n[M.id]}function E(M){for(const A in n){const P=n[A];if(P[M.id]===void 0)continue;const C=P[M.id];for(const L in C)h(C[L].object),delete C[L];delete P[M.id]}}function T(){_(),r=!0,o!==s&&(o=s,l(o.object))}function _(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:T,resetDefaultState:_,dispose:b,releaseStatesOfGeometry:S,releaseStatesOfProgram:E,initAttributes:v,enableAttribute:m,disableUnusedAttributes:x}}function k2(i,t,e){let n;function s(l){n=l}function o(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function r(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function a(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let d=0;for(let g=0;g<u;g++)d+=h[g];e.update(d,n,1)}function c(l,h,u,f){if(u===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<l.length;g++)r(l[g],h[g],f[g]);else{d.multiDrawArraysInstancedWEBGL(n,l,0,h,0,f,0,u);let g=0;for(let v=0;v<u;v++)g+=h[v]*f[v];e.update(g,n,1)}}this.setMode=s,this.render=o,this.renderInstances=r,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function z2(i,t,e,n){let s;function o(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(E){return!(E!==vn&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(E){const T=E===Oi&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==bn&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==ii&&!T)}function c(E){if(E==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,f=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),w=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),b=g>0,S=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:o,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:f,maxTextures:d,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:x,maxVaryings:y,maxFragmentUniforms:w,vertexTextures:b,maxSamples:S}}function B2(i){const t=this;let e=null,n=0,s=!1,o=!1;const r=new Ti,a=new Jt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||n!==0||s;return s=f,n=u.length,d},this.beginShadows=function(){o=!0,h(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,d){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||o&&!m)o?h(null):l();else{const x=o?0:n,y=x*4;let w=p.clippingState||null;c.value=w,w=h(g,f,y,d);for(let b=0;b!==y;++b)w[b]=e[b];p.clippingState=w,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,d,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=c.value,g!==!0||m===null){const p=d+v*4,x=f.matrixWorldInverse;a.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let y=0,w=d;y!==v;++y,w+=4)r.copy(u[y]).applyMatrix4(x,a),r.normal.toArray(m,w),m[w+3]=r.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function H2(i){let t=new WeakMap;function e(r,a){return a===Mh?r.mapping=oo:a===bh&&(r.mapping=ro),r}function n(r){if(r&&r.isTexture){const a=r.mapping;if(a===Mh||a===bh)if(t.has(r)){const c=t.get(r).texture;return e(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const l=new Jv(c.height);return l.fromEquirectangularTexture(i,r),t.set(r,l),r.addEventListener("dispose",s),e(l.texture,r.mapping)}else return null}}return r}function s(r){const a=r.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function o(){t=new WeakMap}return{get:n,dispose:o}}class Bu extends mm{constructor(t=-1,e=1,n=1,s=-1,o=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=o,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,o,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=o,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let o=n-t,r=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=l*this.view.offsetX,r=o+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(o,r,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Xs=4,u0=[.125,.215,.35,.446,.526,.582],ns=20,Kc=new Bu,d0=new Vt;let jc=null,Jc=0,Qc=0,tl=!1;const Qi=(1+Math.sqrt(5))/2,Is=1/Qi,f0=[new R(-Qi,Is,0),new R(Qi,Is,0),new R(-Is,0,Qi),new R(Is,0,Qi),new R(0,Qi,-Is),new R(0,Qi,Is),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)];class p0{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){jc=this._renderer.getRenderTarget(),Jc=this._renderer.getActiveCubeFace(),Qc=this._renderer.getActiveMipmapLevel(),tl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const o=this._allocateTargets();return o.depthBuffer=!0,this._sceneToCubeUV(t,n,s,o),e>0&&this._blur(o,0,0,e),this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=v0(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=g0(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(jc,Jc,Qc),this._renderer.xr.enabled=tl,t.scissorTest=!1,qr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===oo||t.mapping===ro?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),jc=this._renderer.getRenderTarget(),Jc=this._renderer.getActiveCubeFace(),Qc=this._renderer.getActiveMipmapLevel(),tl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:He,minFilter:He,generateMipmaps:!1,type:Oi,format:vn,colorSpace:vo,depthBuffer:!1},s=m0(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=m0(t,e,n);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=G2(o)),this._blurMaterial=V2(o,t,e)}return s}_compileMaterial(t){const e=new $t(this._lodPlanes[0],t);this._renderer.compile(e,Kc)}_sceneToCubeUV(t,e,n,s){const a=new on(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(d0),h.toneMapping=Pi,h.autoClear=!1;const d=new vr({name:"PMREM.Background",side:en,depthWrite:!1,depthTest:!1}),g=new $t(new k,d);let v=!1;const m=t.background;m?m.isColor&&(d.color.copy(m),t.background=null,v=!0):(d.color.copy(d0),v=!0);for(let p=0;p<6;p++){const x=p%3;x===0?(a.up.set(0,c[p],0),a.lookAt(l[p],0,0)):x===1?(a.up.set(0,0,c[p]),a.lookAt(0,l[p],0)):(a.up.set(0,c[p],0),a.lookAt(0,0,l[p]));const y=this._cubeSize;qr(s,x*y,p>2?y:0,y,y),h.setRenderTarget(s),v&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===oo||t.mapping===ro;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=v0()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=g0());const o=s?this._cubemapMaterial:this._equirectMaterial,r=new $t(this._lodPlanes[0],o),a=o.uniforms;a.envMap.value=t;const c=this._cubeSize;qr(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(r,Kc)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let o=1;o<s;o++){const r=Math.sqrt(this._sigmas[o]*this._sigmas[o]-this._sigmas[o-1]*this._sigmas[o-1]),a=f0[(s-o-1)%f0.length];this._blur(t,o-1,o,r,a)}e.autoClear=n}_blur(t,e,n,s,o){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,n,s,"latitudinal",o),this._halfBlur(r,t,n,n,s,"longitudinal",o)}_halfBlur(t,e,n,s,o,r,a){const c=this._renderer,l=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new $t(this._lodPlanes[s],l),f=l.uniforms,d=this._sizeLods[n]-1,g=isFinite(o)?Math.PI/(2*d):2*Math.PI/(2*ns-1),v=o/g,m=isFinite(o)?1+Math.floor(h*v):ns;m>ns&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ns}`);const p=[];let x=0;for(let E=0;E<ns;++E){const T=E/v,_=Math.exp(-T*T/2);p.push(_),E===0?x+=_:E<m&&(x+=2*_)}for(let E=0;E<p.length;E++)p[E]=p[E]/x;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=r==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:y}=this;f.dTheta.value=g,f.mipInt.value=y-n;const w=this._sizeLods[s],b=3*w*(s>y-Xs?s-y+Xs:0),S=4*(this._cubeSize-w);qr(e,b,S,3*w,2*w),c.setRenderTarget(e),c.render(u,Kc)}}function G2(i){const t=[],e=[],n=[];let s=i;const o=i-Xs+1+u0.length;for(let r=0;r<o;r++){const a=Math.pow(2,s);e.push(a);let c=1/a;r>i-Xs?c=u0[r-i+Xs-1]:r===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,g=6,v=3,m=2,p=1,x=new Float32Array(v*g*d),y=new Float32Array(m*g*d),w=new Float32Array(p*g*d);for(let S=0;S<d;S++){const E=S%3*2/3-1,T=S>2?0:-1,_=[E,T,0,E+2/3,T,0,E+2/3,T+1,0,E,T,0,E+2/3,T+1,0,E,T+1,0];x.set(_,v*g*S),y.set(f,m*g*S);const M=[S,S,S,S,S,S];w.set(M,p*g*S)}const b=new Fe;b.setAttribute("position",new ze(x,v)),b.setAttribute("uv",new ze(y,m)),b.setAttribute("faceIndex",new ze(w,p)),t.push(b),s>Xs&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function m0(i,t,e){const n=new Sn(i,t,e);return n.texture.mapping=hc,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function qr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function V2(i,t,e){const n=new Float32Array(ns),s=new R(0,1,0);return new be({name:"SphericalGaussianBlur",defines:{n:ns,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Hu(),fragmentShader:`

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
		`,blending:Ln,depthTest:!1,depthWrite:!1})}function g0(){return new be({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Hu(),fragmentShader:`

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
		`,blending:Ln,depthTest:!1,depthWrite:!1})}function v0(){return new be({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Hu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ln,depthTest:!1,depthWrite:!1})}function Hu(){return`

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
	`}function W2(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===Mh||c===bh,h=c===oo||c===ro;if(l||h){let u=t.get(a);const f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return e===null&&(e=new p0(i)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{const d=a.image;return l&&d&&d.height>0||h&&d&&s(d)?(e===null&&(e=new p0(i)),u=l?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",o),u.texture):null}}}return a}function s(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function o(a){const c=a.target;c.removeEventListener("dispose",o);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:r}}function X2(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&$o("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function q2(i,t,e,n){const s={},o=new WeakMap;function r(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);for(const g in f.morphAttributes){const v=f.morphAttributes[g];for(let m=0,p=v.length;m<p;m++)t.remove(v[m])}f.removeEventListener("dispose",r),delete s[f.id];const d=o.get(f);d&&(t.remove(d),o.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",r),s[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const g in f)t.update(f[g],i.ARRAY_BUFFER);const d=u.morphAttributes;for(const g in d){const v=d[g];for(let m=0,p=v.length;m<p;m++)t.update(v[m],i.ARRAY_BUFFER)}}function l(u){const f=[],d=u.index,g=u.attributes.position;let v=0;if(d!==null){const x=d.array;v=d.version;for(let y=0,w=x.length;y<w;y+=3){const b=x[y+0],S=x[y+1],E=x[y+2];f.push(b,S,S,E,E,b)}}else if(g!==void 0){const x=g.array;v=g.version;for(let y=0,w=x.length/3-1;y<w;y+=3){const b=y+0,S=y+1,E=y+2;f.push(b,S,S,E,E,b)}}else return;const m=new(cm(f)?fm:dm)(f,1);m.version=v;const p=o.get(u);p&&t.remove(p),o.set(u,m)}function h(u){const f=o.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&l(u)}else l(u);return o.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function Y2(i,t,e){let n;function s(f){n=f}let o,r;function a(f){o=f.type,r=f.bytesPerElement}function c(f,d){i.drawElements(n,d,o,f*r),e.update(d,n,1)}function l(f,d,g){g!==0&&(i.drawElementsInstanced(n,d,o,f*r,g),e.update(d,n,g))}function h(f,d,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,o,f,0,g);let m=0;for(let p=0;p<g;p++)m+=d[p];e.update(m,n,1)}function u(f,d,g,v){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)l(f[p]/r,d[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(n,d,0,o,f,0,v,0,g);let p=0;for(let x=0;x<g;x++)p+=d[x]*v[x];e.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function $2(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(o,r,a){switch(e.calls++,r){case i.TRIANGLES:e.triangles+=a*(o/3);break;case i.LINES:e.lines+=a*(o/2);break;case i.LINE_STRIP:e.lines+=a*(o-1);break;case i.LINE_LOOP:e.lines+=a*o;break;case i.POINTS:e.points+=a*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Z2(i,t,e){const n=new WeakMap,s=new de;function o(r,a,c){const l=r.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let f=n.get(a);if(f===void 0||f.count!==u){let _=function(){E.dispose(),n.delete(a),a.removeEventListener("dispose",_)};f!==void 0&&f.texture.dispose();const d=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],x=a.morphAttributes.color||[];let y=0;d===!0&&(y=1),g===!0&&(y=2),v===!0&&(y=3);let w=a.attributes.position.count*y,b=1;w>t.maxTextureSize&&(b=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const S=new Float32Array(w*b*4*u),E=new hm(S,w,b,u);E.type=ii,E.needsUpdate=!0;const T=y*4;for(let M=0;M<u;M++){const A=m[M],P=p[M],C=x[M],L=w*b*4*M;for(let N=0;N<A.count;N++){const F=N*T;d===!0&&(s.fromBufferAttribute(A,N),S[L+F+0]=s.x,S[L+F+1]=s.y,S[L+F+2]=s.z,S[L+F+3]=0),g===!0&&(s.fromBufferAttribute(P,N),S[L+F+4]=s.x,S[L+F+5]=s.y,S[L+F+6]=s.z,S[L+F+7]=0),v===!0&&(s.fromBufferAttribute(C,N),S[L+F+8]=s.x,S[L+F+9]=s.y,S[L+F+10]=s.z,S[L+F+11]=C.itemSize===4?s.w:1)}}f={count:u,texture:E,size:new tt(w,b)},n.set(a,f),a.addEventListener("dispose",_)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",r.morphTexture,e);else{let d=0;for(let v=0;v<l.length;v++)d+=l[v];const g=a.morphTargetsRelative?1:1-d;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:o}}function K2(i,t,e,n){let s=new WeakMap;function o(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function r(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:o,dispose:r}}class Gu extends nn{constructor(t,e,n,s,o,r,a,c,l,h=js){if(h!==js&&h!==co)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===js&&(n=ls),n===void 0&&h===co&&(n=ao),super(null,s,o,r,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Ge,this.minFilter=c!==void 0?c:Ge,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const ym=new nn,y0=new Gu(1,1),wm=new hm,xm=new Ov,_m=new gm,w0=[],x0=[],_0=new Float32Array(16),M0=new Float32Array(9),b0=new Float32Array(4);function xo(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let o=w0[s];if(o===void 0&&(o=new Float32Array(s),w0[s]=o),t!==0){n.toArray(o,0);for(let r=1,a=0;r!==t;++r)a+=e,i[r].toArray(o,a)}return o}function Le(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ne(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function mc(i,t){let e=x0[t];e===void 0&&(e=new Int32Array(t),x0[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function j2(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function J2(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;i.uniform2fv(this.addr,t),Ne(e,t)}}function Q2(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Le(e,t))return;i.uniform3fv(this.addr,t),Ne(e,t)}}function tx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;i.uniform4fv(this.addr,t),Ne(e,t)}}function ex(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Le(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ne(e,t)}else{if(Le(e,n))return;b0.set(n),i.uniformMatrix2fv(this.addr,!1,b0),Ne(e,n)}}function nx(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Le(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ne(e,t)}else{if(Le(e,n))return;M0.set(n),i.uniformMatrix3fv(this.addr,!1,M0),Ne(e,n)}}function ix(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Le(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ne(e,t)}else{if(Le(e,n))return;_0.set(n),i.uniformMatrix4fv(this.addr,!1,_0),Ne(e,n)}}function sx(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function ox(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;i.uniform2iv(this.addr,t),Ne(e,t)}}function rx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Le(e,t))return;i.uniform3iv(this.addr,t),Ne(e,t)}}function ax(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;i.uniform4iv(this.addr,t),Ne(e,t)}}function cx(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function lx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;i.uniform2uiv(this.addr,t),Ne(e,t)}}function hx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Le(e,t))return;i.uniform3uiv(this.addr,t),Ne(e,t)}}function ux(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;i.uniform4uiv(this.addr,t),Ne(e,t)}}function dx(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let o;this.type===i.SAMPLER_2D_SHADOW?(y0.compareFunction=am,o=y0):o=ym,e.setTexture2D(t||o,s)}function fx(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||xm,s)}function px(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||_m,s)}function mx(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||wm,s)}function gx(i){switch(i){case 5126:return j2;case 35664:return J2;case 35665:return Q2;case 35666:return tx;case 35674:return ex;case 35675:return nx;case 35676:return ix;case 5124:case 35670:return sx;case 35667:case 35671:return ox;case 35668:case 35672:return rx;case 35669:case 35673:return ax;case 5125:return cx;case 36294:return lx;case 36295:return hx;case 36296:return ux;case 35678:case 36198:case 36298:case 36306:case 35682:return dx;case 35679:case 36299:case 36307:return fx;case 35680:case 36300:case 36308:case 36293:return px;case 36289:case 36303:case 36311:case 36292:return mx}}function vx(i,t){i.uniform1fv(this.addr,t)}function yx(i,t){const e=xo(t,this.size,2);i.uniform2fv(this.addr,e)}function wx(i,t){const e=xo(t,this.size,3);i.uniform3fv(this.addr,e)}function xx(i,t){const e=xo(t,this.size,4);i.uniform4fv(this.addr,e)}function _x(i,t){const e=xo(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Mx(i,t){const e=xo(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function bx(i,t){const e=xo(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Sx(i,t){i.uniform1iv(this.addr,t)}function Ex(i,t){i.uniform2iv(this.addr,t)}function Tx(i,t){i.uniform3iv(this.addr,t)}function Ax(i,t){i.uniform4iv(this.addr,t)}function Rx(i,t){i.uniform1uiv(this.addr,t)}function Cx(i,t){i.uniform2uiv(this.addr,t)}function Px(i,t){i.uniform3uiv(this.addr,t)}function Ix(i,t){i.uniform4uiv(this.addr,t)}function Dx(i,t,e){const n=this.cache,s=t.length,o=mc(e,s);Le(n,o)||(i.uniform1iv(this.addr,o),Ne(n,o));for(let r=0;r!==s;++r)e.setTexture2D(t[r]||ym,o[r])}function Lx(i,t,e){const n=this.cache,s=t.length,o=mc(e,s);Le(n,o)||(i.uniform1iv(this.addr,o),Ne(n,o));for(let r=0;r!==s;++r)e.setTexture3D(t[r]||xm,o[r])}function Nx(i,t,e){const n=this.cache,s=t.length,o=mc(e,s);Le(n,o)||(i.uniform1iv(this.addr,o),Ne(n,o));for(let r=0;r!==s;++r)e.setTextureCube(t[r]||_m,o[r])}function Fx(i,t,e){const n=this.cache,s=t.length,o=mc(e,s);Le(n,o)||(i.uniform1iv(this.addr,o),Ne(n,o));for(let r=0;r!==s;++r)e.setTexture2DArray(t[r]||wm,o[r])}function Ux(i){switch(i){case 5126:return vx;case 35664:return yx;case 35665:return wx;case 35666:return xx;case 35674:return _x;case 35675:return Mx;case 35676:return bx;case 5124:case 35670:return Sx;case 35667:case 35671:return Ex;case 35668:case 35672:return Tx;case 35669:case 35673:return Ax;case 5125:return Rx;case 36294:return Cx;case 36295:return Px;case 36296:return Ix;case 35678:case 36198:case 36298:case 36306:case 35682:return Dx;case 35679:case 36299:case 36307:return Lx;case 35680:case 36300:case 36308:case 36293:return Nx;case 36289:case 36303:case 36311:case 36292:return Fx}}class Ox{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=gx(e.type)}}class kx{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Ux(e.type)}}class zx{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let o=0,r=s.length;o!==r;++o){const a=s[o];a.setValue(t,e[a.id],n)}}}const el=/(\w+)(\])?(\[|\.)?/g;function S0(i,t){i.seq.push(t),i.map[t.id]=t}function Bx(i,t,e){const n=i.name,s=n.length;for(el.lastIndex=0;;){const o=el.exec(n),r=el.lastIndex;let a=o[1];const c=o[2]==="]",l=o[3];if(c&&(a=a|0),l===void 0||l==="["&&r+2===s){S0(e,l===void 0?new Ox(a,i,t):new kx(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new zx(a),S0(e,u)),e=u}}}class Oa{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const o=t.getActiveUniform(e,s),r=t.getUniformLocation(e,o.name);Bx(o,r,this)}}setValue(t,e,n,s){const o=this.map[e];o!==void 0&&o.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let o=0,r=e.length;o!==r;++o){const a=e[o],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,o=t.length;s!==o;++s){const r=t[s];r.id in e&&n.push(r)}return n}}function E0(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Hx=37297;let Gx=0;function Vx(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),o=Math.min(t+6,e.length);for(let r=s;r<o;r++){const a=r+1;n.push(`${a===t?">":" "} ${a}: ${e[r]}`)}return n.join(`
`)}const T0=new Jt;function Wx(i){ce._getMatrix(T0,ce.workingColorSpace,i);const t=`mat3( ${T0.elements.map(e=>e.toFixed(4))} )`;switch(ce.getTransfer(i)){case dc:return[t,"LinearTransferOETF"];case ge:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function A0(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const r=parseInt(o[1]);return e.toUpperCase()+`

`+s+`

`+Vx(i.getShaderSource(t),r)}else return s}function Xx(i,t){const e=Wx(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function qx(i,t){let e;switch(t){case Wp:e="Linear";break;case Xp:e="Reinhard";break;case qp:e="Cineon";break;case Yp:e="ACESFilmic";break;case $p:e="AgX";break;case Zp:e="Neutral";break;case nv:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Yr=new R;function Yx(){ce.getLuminanceCoefficients(Yr);const i=Yr.x.toFixed(4),t=Yr.y.toFixed(4),e=Yr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function $x(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Zo).join(`
`)}function Zx(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Kx(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const o=i.getActiveAttrib(t,s),r=o.name;let a=1;o.type===i.FLOAT_MAT2&&(a=2),o.type===i.FLOAT_MAT3&&(a=3),o.type===i.FLOAT_MAT4&&(a=4),e[r]={type:o.type,location:i.getAttribLocation(t,r),locationSize:a}}return e}function Zo(i){return i!==""}function R0(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function C0(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const jx=/^[ \t]*#include +<([\w\d./]+)>/gm;function jh(i){return i.replace(jx,Qx)}const Jx=new Map;function Qx(i,t){let e=ee[t];if(e===void 0){const n=Jx.get(t);if(n!==void 0)e=ee[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return jh(e)}const t_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function P0(i){return i.replace(t_,e_)}function e_(i,t,e,n){let s="";for(let o=parseInt(t);o<parseInt(e);o++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return s}function I0(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function n_(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Gp?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Vp?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Jn&&(t="SHADOWMAP_TYPE_VSM"),t}function i_(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case oo:case ro:t="ENVMAP_TYPE_CUBE";break;case hc:t="ENVMAP_TYPE_CUBE_UV";break}return t}function s_(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ro:t="ENVMAP_MODE_REFRACTION";break}return t}function o_(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Pu:t="ENVMAP_BLENDING_MULTIPLY";break;case tv:t="ENVMAP_BLENDING_MIX";break;case ev:t="ENVMAP_BLENDING_ADD";break}return t}function r_(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function a_(i,t,e,n){const s=i.getContext(),o=e.defines;let r=e.vertexShader,a=e.fragmentShader;const c=n_(e),l=i_(e),h=s_(e),u=o_(e),f=r_(e),d=$x(e),g=Zx(o),v=s.createProgram();let m,p,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Zo).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Zo).join(`
`),p.length>0&&(p+=`
`)):(m=[I0(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Zo).join(`
`),p=[I0(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Pi?"#define TONE_MAPPING":"",e.toneMapping!==Pi?ee.tonemapping_pars_fragment:"",e.toneMapping!==Pi?qx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ee.colorspace_pars_fragment,Xx("linearToOutputTexel",e.outputColorSpace),Yx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Zo).join(`
`)),r=jh(r),r=R0(r,e),r=C0(r,e),a=jh(a),a=R0(a,e),a=C0(a,e),r=P0(r),a=P0(a),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===Vd?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Vd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const y=x+m+r,w=x+p+a,b=E0(s,s.VERTEX_SHADER,y),S=E0(s,s.FRAGMENT_SHADER,w);s.attachShader(v,b),s.attachShader(v,S),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function E(A){if(i.debug.checkShaderErrors){const P=s.getProgramInfoLog(v).trim(),C=s.getShaderInfoLog(b).trim(),L=s.getShaderInfoLog(S).trim();let N=!0,F=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(N=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,b,S);else{const H=A0(s,b,"vertex"),G=A0(s,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+P+`
`+H+`
`+G)}else P!==""?console.warn("THREE.WebGLProgram: Program Info Log:",P):(C===""||L==="")&&(F=!1);F&&(A.diagnostics={runnable:N,programLog:P,vertexShader:{log:C,prefix:m},fragmentShader:{log:L,prefix:p}})}s.deleteShader(b),s.deleteShader(S),T=new Oa(s,v),_=Kx(s,v)}let T;this.getUniforms=function(){return T===void 0&&E(this),T};let _;this.getAttributes=function(){return _===void 0&&E(this),_};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(v,Hx)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Gx++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=b,this.fragmentShader=S,this}let c_=0;class l_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),o=this._getShaderStage(n),r=this._getShaderCacheForMaterial(t);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(o)===!1&&(r.add(o),o.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new h_(t),e.set(t,n)),n}}class h_{constructor(t){this.id=c_++,this.code=t,this.usedTimes=0}}function u_(i,t,e,n,s,o,r){const a=new fc,c=new l_,l=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures;let d=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(_){return l.add(_),_===0?"uv":`uv${_}`}function m(_,M,A,P,C){const L=P.fog,N=C.geometry,F=_.isMeshStandardMaterial?P.environment:null,H=(_.isMeshStandardMaterial?e:t).get(_.envMap||F),G=H&&H.mapping===hc?H.image.height:null,V=g[_.type];_.precision!==null&&(d=s.getMaxPrecision(_.precision),d!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",d,"instead."));const et=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,lt=et!==void 0?et.length:0;let bt=0;N.morphAttributes.position!==void 0&&(bt=1),N.morphAttributes.normal!==void 0&&(bt=2),N.morphAttributes.color!==void 0&&(bt=3);let Dt,J,rt,K;if(V){const me=Dn[V];Dt=me.vertexShader,J=me.fragmentShader}else Dt=_.vertexShader,J=_.fragmentShader,c.update(_),rt=c.getVertexShaderID(_),K=c.getFragmentShaderID(_);const $=i.getRenderTarget(),ot=i.state.buffers.depth.getReversed(),mt=C.isInstancedMesh===!0,Mt=C.isBatchedMesh===!0,Ut=!!_.map,nt=!!_.matcap,ht=!!H,B=!!_.aoMap,ft=!!_.lightMap,st=!!_.bumpMap,yt=!!_.normalMap,wt=!!_.displacementMap,Gt=!!_.emissiveMap,Pt=!!_.metalnessMap,z=!!_.roughnessMap,U=_.anisotropy>0,Z=_.clearcoat>0,at=_.dispersion>0,dt=_.iridescence>0,ct=_.sheen>0,Ft=_.transmission>0,Et=U&&!!_.anisotropyMap,It=Z&&!!_.clearcoatMap,se=Z&&!!_.clearcoatNormalMap,vt=Z&&!!_.clearcoatRoughnessMap,Lt=dt&&!!_.iridescenceMap,Wt=dt&&!!_.iridescenceThicknessMap,qt=ct&&!!_.sheenColorMap,Nt=ct&&!!_.sheenRoughnessMap,ae=!!_.specularMap,te=!!_.specularColorMap,ve=!!_.specularIntensityMap,W=Ft&&!!_.transmissionMap,Tt=Ft&&!!_.thicknessMap,it=!!_.gradientMap,ut=!!_.alphaMap,Ct=_.alphaTest>0,At=!!_.alphaHash,Zt=!!_.extensions;let Ee=Pi;_.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(Ee=i.toneMapping);const Ve={shaderID:V,shaderType:_.type,shaderName:_.name,vertexShader:Dt,fragmentShader:J,defines:_.defines,customVertexShaderID:rt,customFragmentShaderID:K,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:d,batching:Mt,batchingColor:Mt&&C._colorsTexture!==null,instancing:mt,instancingColor:mt&&C.instanceColor!==null,instancingMorph:mt&&C.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:$===null?i.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:vo,alphaToCoverage:!!_.alphaToCoverage,map:Ut,matcap:nt,envMap:ht,envMapMode:ht&&H.mapping,envMapCubeUVHeight:G,aoMap:B,lightMap:ft,bumpMap:st,normalMap:yt,displacementMap:f&&wt,emissiveMap:Gt,normalMapObjectSpace:yt&&_.normalMapType===ov,normalMapTangentSpace:yt&&_.normalMapType===Ou,metalnessMap:Pt,roughnessMap:z,anisotropy:U,anisotropyMap:Et,clearcoat:Z,clearcoatMap:It,clearcoatNormalMap:se,clearcoatRoughnessMap:vt,dispersion:at,iridescence:dt,iridescenceMap:Lt,iridescenceThicknessMap:Wt,sheen:ct,sheenColorMap:qt,sheenRoughnessMap:Nt,specularMap:ae,specularColorMap:te,specularIntensityMap:ve,transmission:Ft,transmissionMap:W,thicknessMap:Tt,gradientMap:it,opaque:_.transparent===!1&&_.blending===Ks&&_.alphaToCoverage===!1,alphaMap:ut,alphaTest:Ct,alphaHash:At,combine:_.combine,mapUv:Ut&&v(_.map.channel),aoMapUv:B&&v(_.aoMap.channel),lightMapUv:ft&&v(_.lightMap.channel),bumpMapUv:st&&v(_.bumpMap.channel),normalMapUv:yt&&v(_.normalMap.channel),displacementMapUv:wt&&v(_.displacementMap.channel),emissiveMapUv:Gt&&v(_.emissiveMap.channel),metalnessMapUv:Pt&&v(_.metalnessMap.channel),roughnessMapUv:z&&v(_.roughnessMap.channel),anisotropyMapUv:Et&&v(_.anisotropyMap.channel),clearcoatMapUv:It&&v(_.clearcoatMap.channel),clearcoatNormalMapUv:se&&v(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:vt&&v(_.clearcoatRoughnessMap.channel),iridescenceMapUv:Lt&&v(_.iridescenceMap.channel),iridescenceThicknessMapUv:Wt&&v(_.iridescenceThicknessMap.channel),sheenColorMapUv:qt&&v(_.sheenColorMap.channel),sheenRoughnessMapUv:Nt&&v(_.sheenRoughnessMap.channel),specularMapUv:ae&&v(_.specularMap.channel),specularColorMapUv:te&&v(_.specularColorMap.channel),specularIntensityMapUv:ve&&v(_.specularIntensityMap.channel),transmissionMapUv:W&&v(_.transmissionMap.channel),thicknessMapUv:Tt&&v(_.thicknessMap.channel),alphaMapUv:ut&&v(_.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(yt||U),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,pointsUvs:C.isPoints===!0&&!!N.attributes.uv&&(Ut||ut),fog:!!L,useFog:_.fog===!0,fogExp2:!!L&&L.isFogExp2,flatShading:_.flatShading===!0,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:ot,skinning:C.isSkinnedMesh===!0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:lt,morphTextureStride:bt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&A.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ee,decodeVideoTexture:Ut&&_.map.isVideoTexture===!0&&ce.getTransfer(_.map.colorSpace)===ge,decodeVideoTextureEmissive:Gt&&_.emissiveMap.isVideoTexture===!0&&ce.getTransfer(_.emissiveMap.colorSpace)===ge,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===mn,flipSided:_.side===en,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:Zt&&_.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Zt&&_.extensions.multiDraw===!0||Mt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Ve.vertexUv1s=l.has(1),Ve.vertexUv2s=l.has(2),Ve.vertexUv3s=l.has(3),l.clear(),Ve}function p(_){const M=[];if(_.shaderID?M.push(_.shaderID):(M.push(_.customVertexShaderID),M.push(_.customFragmentShaderID)),_.defines!==void 0)for(const A in _.defines)M.push(A),M.push(_.defines[A]);return _.isRawShaderMaterial===!1&&(x(M,_),y(M,_),M.push(i.outputColorSpace)),M.push(_.customProgramCacheKey),M.join()}function x(_,M){_.push(M.precision),_.push(M.outputColorSpace),_.push(M.envMapMode),_.push(M.envMapCubeUVHeight),_.push(M.mapUv),_.push(M.alphaMapUv),_.push(M.lightMapUv),_.push(M.aoMapUv),_.push(M.bumpMapUv),_.push(M.normalMapUv),_.push(M.displacementMapUv),_.push(M.emissiveMapUv),_.push(M.metalnessMapUv),_.push(M.roughnessMapUv),_.push(M.anisotropyMapUv),_.push(M.clearcoatMapUv),_.push(M.clearcoatNormalMapUv),_.push(M.clearcoatRoughnessMapUv),_.push(M.iridescenceMapUv),_.push(M.iridescenceThicknessMapUv),_.push(M.sheenColorMapUv),_.push(M.sheenRoughnessMapUv),_.push(M.specularMapUv),_.push(M.specularColorMapUv),_.push(M.specularIntensityMapUv),_.push(M.transmissionMapUv),_.push(M.thicknessMapUv),_.push(M.combine),_.push(M.fogExp2),_.push(M.sizeAttenuation),_.push(M.morphTargetsCount),_.push(M.morphAttributeCount),_.push(M.numDirLights),_.push(M.numPointLights),_.push(M.numSpotLights),_.push(M.numSpotLightMaps),_.push(M.numHemiLights),_.push(M.numRectAreaLights),_.push(M.numDirLightShadows),_.push(M.numPointLightShadows),_.push(M.numSpotLightShadows),_.push(M.numSpotLightShadowsWithMaps),_.push(M.numLightProbes),_.push(M.shadowMapType),_.push(M.toneMapping),_.push(M.numClippingPlanes),_.push(M.numClipIntersection),_.push(M.depthPacking)}function y(_,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),_.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reverseDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),_.push(a.mask)}function w(_){const M=g[_.type];let A;if(M){const P=Dn[M];A=pc.clone(P.uniforms)}else A=_.uniforms;return A}function b(_,M){let A;for(let P=0,C=h.length;P<C;P++){const L=h[P];if(L.cacheKey===M){A=L,++A.usedTimes;break}}return A===void 0&&(A=new a_(i,M,_,o),h.push(A)),A}function S(_){if(--_.usedTimes===0){const M=h.indexOf(_);h[M]=h[h.length-1],h.pop(),_.destroy()}}function E(_){c.remove(_)}function T(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:w,acquireProgram:b,releaseProgram:S,releaseShaderCache:E,programs:h,dispose:T}}function d_(){let i=new WeakMap;function t(r){return i.has(r)}function e(r){let a=i.get(r);return a===void 0&&(a={},i.set(r,a)),a}function n(r){i.delete(r)}function s(r,a,c){i.get(r)[a]=c}function o(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:o}}function f_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function D0(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function L0(){const i=[];let t=0;const e=[],n=[],s=[];function o(){t=0,e.length=0,n.length=0,s.length=0}function r(u,f,d,g,v,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=v,p.group=m),t++,p}function a(u,f,d,g,v,m){const p=r(u,f,d,g,v,m);d.transmission>0?n.push(p):d.transparent===!0?s.push(p):e.push(p)}function c(u,f,d,g,v,m){const p=r(u,f,d,g,v,m);d.transmission>0?n.unshift(p):d.transparent===!0?s.unshift(p):e.unshift(p)}function l(u,f){e.length>1&&e.sort(u||f_),n.length>1&&n.sort(f||D0),s.length>1&&s.sort(f||D0)}function h(){for(let u=t,f=i.length;u<f;u++){const d=i[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:o,push:a,unshift:c,finish:h,sort:l}}function p_(){let i=new WeakMap;function t(n,s){const o=i.get(n);let r;return o===void 0?(r=new L0,i.set(n,[r])):s>=o.length?(r=new L0,o.push(r)):r=o[s],r}function e(){i=new WeakMap}return{get:t,dispose:e}}function m_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new R,color:new Vt};break;case"SpotLight":e={position:new R,direction:new R,color:new Vt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new R,color:new Vt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new R,skyColor:new Vt,groundColor:new Vt};break;case"RectAreaLight":e={color:new Vt,position:new R,halfWidth:new R,halfHeight:new R};break}return i[t.id]=e,e}}}function g_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let v_=0;function y_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function w_(i){const t=new m_,e=g_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new R);const s=new R,o=new oe,r=new oe;function a(l){let h=0,u=0,f=0;for(let _=0;_<9;_++)n.probe[_].set(0,0,0);let d=0,g=0,v=0,m=0,p=0,x=0,y=0,w=0,b=0,S=0,E=0;l.sort(y_);for(let _=0,M=l.length;_<M;_++){const A=l[_],P=A.color,C=A.intensity,L=A.distance,N=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)h+=P.r*C,u+=P.g*C,f+=P.b*C;else if(A.isLightProbe){for(let F=0;F<9;F++)n.probe[F].addScaledVector(A.sh.coefficients[F],C);E++}else if(A.isDirectionalLight){const F=t.get(A);if(F.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const H=A.shadow,G=e.get(A);G.shadowIntensity=H.intensity,G.shadowBias=H.bias,G.shadowNormalBias=H.normalBias,G.shadowRadius=H.radius,G.shadowMapSize=H.mapSize,n.directionalShadow[d]=G,n.directionalShadowMap[d]=N,n.directionalShadowMatrix[d]=A.shadow.matrix,x++}n.directional[d]=F,d++}else if(A.isSpotLight){const F=t.get(A);F.position.setFromMatrixPosition(A.matrixWorld),F.color.copy(P).multiplyScalar(C),F.distance=L,F.coneCos=Math.cos(A.angle),F.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),F.decay=A.decay,n.spot[v]=F;const H=A.shadow;if(A.map&&(n.spotLightMap[b]=A.map,b++,H.updateMatrices(A),A.castShadow&&S++),n.spotLightMatrix[v]=H.matrix,A.castShadow){const G=e.get(A);G.shadowIntensity=H.intensity,G.shadowBias=H.bias,G.shadowNormalBias=H.normalBias,G.shadowRadius=H.radius,G.shadowMapSize=H.mapSize,n.spotShadow[v]=G,n.spotShadowMap[v]=N,w++}v++}else if(A.isRectAreaLight){const F=t.get(A);F.color.copy(P).multiplyScalar(C),F.halfWidth.set(A.width*.5,0,0),F.halfHeight.set(0,A.height*.5,0),n.rectArea[m]=F,m++}else if(A.isPointLight){const F=t.get(A);if(F.color.copy(A.color).multiplyScalar(A.intensity),F.distance=A.distance,F.decay=A.decay,A.castShadow){const H=A.shadow,G=e.get(A);G.shadowIntensity=H.intensity,G.shadowBias=H.bias,G.shadowNormalBias=H.normalBias,G.shadowRadius=H.radius,G.shadowMapSize=H.mapSize,G.shadowCameraNear=H.camera.near,G.shadowCameraFar=H.camera.far,n.pointShadow[g]=G,n.pointShadowMap[g]=N,n.pointShadowMatrix[g]=A.shadow.matrix,y++}n.point[g]=F,g++}else if(A.isHemisphereLight){const F=t.get(A);F.skyColor.copy(A.color).multiplyScalar(C),F.groundColor.copy(A.groundColor).multiplyScalar(C),n.hemi[p]=F,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=St.LTC_FLOAT_1,n.rectAreaLTC2=St.LTC_FLOAT_2):(n.rectAreaLTC1=St.LTC_HALF_1,n.rectAreaLTC2=St.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;const T=n.hash;(T.directionalLength!==d||T.pointLength!==g||T.spotLength!==v||T.rectAreaLength!==m||T.hemiLength!==p||T.numDirectionalShadows!==x||T.numPointShadows!==y||T.numSpotShadows!==w||T.numSpotMaps!==b||T.numLightProbes!==E)&&(n.directional.length=d,n.spot.length=v,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=w,n.spotShadowMap.length=w,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=w+b-S,n.spotLightMap.length=b,n.numSpotLightShadowsWithMaps=S,n.numLightProbes=E,T.directionalLength=d,T.pointLength=g,T.spotLength=v,T.rectAreaLength=m,T.hemiLength=p,T.numDirectionalShadows=x,T.numPointShadows=y,T.numSpotShadows=w,T.numSpotMaps=b,T.numLightProbes=E,n.version=v_++)}function c(l,h){let u=0,f=0,d=0,g=0,v=0;const m=h.matrixWorldInverse;for(let p=0,x=l.length;p<x;p++){const y=l[p];if(y.isDirectionalLight){const w=n.directional[u];w.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(m),u++}else if(y.isSpotLight){const w=n.spot[d];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(m),w.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(m),d++}else if(y.isRectAreaLight){const w=n.rectArea[g];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(m),r.identity(),o.copy(y.matrixWorld),o.premultiply(m),r.extractRotation(o),w.halfWidth.set(y.width*.5,0,0),w.halfHeight.set(0,y.height*.5,0),w.halfWidth.applyMatrix4(r),w.halfHeight.applyMatrix4(r),g++}else if(y.isPointLight){const w=n.point[f];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(m),f++}else if(y.isHemisphereLight){const w=n.hemi[v];w.direction.setFromMatrixPosition(y.matrixWorld),w.direction.transformDirection(m),v++}}}return{setup:a,setupView:c,state:n}}function N0(i){const t=new w_(i),e=[],n=[];function s(h){l.camera=h,e.length=0,n.length=0}function o(h){e.push(h)}function r(h){n.push(h)}function a(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:o,pushShadow:r}}function x_(i){let t=new WeakMap;function e(s,o=0){const r=t.get(s);let a;return r===void 0?(a=new N0(i),t.set(s,[a])):o>=r.length?(a=new N0(i),r.push(a)):a=r[o],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class Mm extends ki{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=sv,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class __ extends ki{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const M_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,b_=`uniform sampler2D shadow_pass;
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
}`;function S_(i,t,e){let n=new zu;const s=new tt,o=new tt,r=new de,a=new Mm({depthPacking:rm}),c=new __,l={},h=e.maxTextureSize,u={[Ii]:en,[en]:Ii,[mn]:mn},f=new be({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new tt},radius:{value:4}},vertexShader:M_,fragmentShader:b_}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const g=new Fe;g.setAttribute("position",new ze(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new $t(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Gp;let p=this.type;this.render=function(S,E,T){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;const _=i.getRenderTarget(),M=i.getActiveCubeFace(),A=i.getActiveMipmapLevel(),P=i.state;P.setBlending(Ln),P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);const C=p!==Jn&&this.type===Jn,L=p===Jn&&this.type!==Jn;for(let N=0,F=S.length;N<F;N++){const H=S[N],G=H.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",H,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);const V=G.getFrameExtents();if(s.multiply(V),o.copy(G.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(o.x=Math.floor(h/V.x),s.x=o.x*V.x,G.mapSize.x=o.x),s.y>h&&(o.y=Math.floor(h/V.y),s.y=o.y*V.y,G.mapSize.y=o.y)),G.map===null||C===!0||L===!0){const lt=this.type!==Jn?{minFilter:Ge,magFilter:Ge}:{};G.map!==null&&G.map.dispose(),G.map=new Sn(s.x,s.y,lt),G.map.texture.name=H.name+".shadowMap",G.camera.updateProjectionMatrix()}i.setRenderTarget(G.map),i.clear();const et=G.getViewportCount();for(let lt=0;lt<et;lt++){const bt=G.getViewport(lt);r.set(o.x*bt.x,o.y*bt.y,o.x*bt.z,o.y*bt.w),P.viewport(r),G.updateMatrices(H,lt),n=G.getFrustum(),w(E,T,G.camera,H,this.type)}G.isPointLightShadow!==!0&&this.type===Jn&&x(G,T),G.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(_,M,A)};function x(S,E){const T=t.update(v);f.defines.VSM_SAMPLES!==S.blurSamples&&(f.defines.VSM_SAMPLES=S.blurSamples,d.defines.VSM_SAMPLES=S.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Sn(s.x,s.y)),f.uniforms.shadow_pass.value=S.map.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(E,null,T,f,v,null),d.uniforms.shadow_pass.value=S.mapPass.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(E,null,T,d,v,null)}function y(S,E,T,_){let M=null;const A=T.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(A!==void 0)M=A;else if(M=T.isPointLight===!0?c:a,i.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const P=M.uuid,C=E.uuid;let L=l[P];L===void 0&&(L={},l[P]=L);let N=L[C];N===void 0&&(N=M.clone(),L[C]=N,E.addEventListener("dispose",b)),M=N}if(M.visible=E.visible,M.wireframe=E.wireframe,_===Jn?M.side=E.shadowSide!==null?E.shadowSide:E.side:M.side=E.shadowSide!==null?E.shadowSide:u[E.side],M.alphaMap=E.alphaMap,M.alphaTest=E.alphaTest,M.map=E.map,M.clipShadows=E.clipShadows,M.clippingPlanes=E.clippingPlanes,M.clipIntersection=E.clipIntersection,M.displacementMap=E.displacementMap,M.displacementScale=E.displacementScale,M.displacementBias=E.displacementBias,M.wireframeLinewidth=E.wireframeLinewidth,M.linewidth=E.linewidth,T.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const P=i.properties.get(M);P.light=T}return M}function w(S,E,T,_,M){if(S.visible===!1)return;if(S.layers.test(E.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&M===Jn)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,S.matrixWorld);const C=t.update(S),L=S.material;if(Array.isArray(L)){const N=C.groups;for(let F=0,H=N.length;F<H;F++){const G=N[F],V=L[G.materialIndex];if(V&&V.visible){const et=y(S,V,_,M);S.onBeforeShadow(i,S,E,T,C,et,G),i.renderBufferDirect(T,null,C,et,S,G),S.onAfterShadow(i,S,E,T,C,et,G)}}}else if(L.visible){const N=y(S,L,_,M);S.onBeforeShadow(i,S,E,T,C,N,null),i.renderBufferDirect(T,null,C,N,S,null),S.onAfterShadow(i,S,E,T,C,N,null)}}const P=S.children;for(let C=0,L=P.length;C<L;C++)w(P[C],E,T,_,M)}function b(S){S.target.removeEventListener("dispose",b);for(const T in l){const _=l[T],M=S.target.uuid;M in _&&(_[M].dispose(),delete _[M])}}}const E_={[mh]:gh,[vh]:xh,[yh]:_h,[so]:wh,[gh]:mh,[xh]:vh,[_h]:yh,[wh]:so};function T_(i,t){function e(){let W=!1;const Tt=new de;let it=null;const ut=new de(0,0,0,0);return{setMask:function(Ct){it!==Ct&&!W&&(i.colorMask(Ct,Ct,Ct,Ct),it=Ct)},setLocked:function(Ct){W=Ct},setClear:function(Ct,At,Zt,Ee,Ve){Ve===!0&&(Ct*=Ee,At*=Ee,Zt*=Ee),Tt.set(Ct,At,Zt,Ee),ut.equals(Tt)===!1&&(i.clearColor(Ct,At,Zt,Ee),ut.copy(Tt))},reset:function(){W=!1,it=null,ut.set(-1,0,0,0)}}}function n(){let W=!1,Tt=!1,it=null,ut=null,Ct=null;return{setReversed:function(At){if(Tt!==At){const Zt=t.get("EXT_clip_control");Tt?Zt.clipControlEXT(Zt.LOWER_LEFT_EXT,Zt.ZERO_TO_ONE_EXT):Zt.clipControlEXT(Zt.LOWER_LEFT_EXT,Zt.NEGATIVE_ONE_TO_ONE_EXT);const Ee=Ct;Ct=null,this.setClear(Ee)}Tt=At},getReversed:function(){return Tt},setTest:function(At){At?$(i.DEPTH_TEST):ot(i.DEPTH_TEST)},setMask:function(At){it!==At&&!W&&(i.depthMask(At),it=At)},setFunc:function(At){if(Tt&&(At=E_[At]),ut!==At){switch(At){case mh:i.depthFunc(i.NEVER);break;case gh:i.depthFunc(i.ALWAYS);break;case vh:i.depthFunc(i.LESS);break;case so:i.depthFunc(i.LEQUAL);break;case yh:i.depthFunc(i.EQUAL);break;case wh:i.depthFunc(i.GEQUAL);break;case xh:i.depthFunc(i.GREATER);break;case _h:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ut=At}},setLocked:function(At){W=At},setClear:function(At){Ct!==At&&(Tt&&(At=1-At),i.clearDepth(At),Ct=At)},reset:function(){W=!1,it=null,ut=null,Ct=null,Tt=!1}}}function s(){let W=!1,Tt=null,it=null,ut=null,Ct=null,At=null,Zt=null,Ee=null,Ve=null;return{setTest:function(me){W||(me?$(i.STENCIL_TEST):ot(i.STENCIL_TEST))},setMask:function(me){Tt!==me&&!W&&(i.stencilMask(me),Tt=me)},setFunc:function(me,yn,Hn){(it!==me||ut!==yn||Ct!==Hn)&&(i.stencilFunc(me,yn,Hn),it=me,ut=yn,Ct=Hn)},setOp:function(me,yn,Hn){(At!==me||Zt!==yn||Ee!==Hn)&&(i.stencilOp(me,yn,Hn),At=me,Zt=yn,Ee=Hn)},setLocked:function(me){W=me},setClear:function(me){Ve!==me&&(i.clearStencil(me),Ve=me)},reset:function(){W=!1,Tt=null,it=null,ut=null,Ct=null,At=null,Zt=null,Ee=null,Ve=null}}}const o=new e,r=new n,a=new s,c=new WeakMap,l=new WeakMap;let h={},u={},f=new WeakMap,d=[],g=null,v=!1,m=null,p=null,x=null,y=null,w=null,b=null,S=null,E=new Vt(0,0,0),T=0,_=!1,M=null,A=null,P=null,C=null,L=null;const N=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let F=!1,H=0;const G=i.getParameter(i.VERSION);G.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(G)[1]),F=H>=1):G.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),F=H>=2);let V=null,et={};const lt=i.getParameter(i.SCISSOR_BOX),bt=i.getParameter(i.VIEWPORT),Dt=new de().fromArray(lt),J=new de().fromArray(bt);function rt(W,Tt,it,ut){const Ct=new Uint8Array(4),At=i.createTexture();i.bindTexture(W,At),i.texParameteri(W,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(W,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Zt=0;Zt<it;Zt++)W===i.TEXTURE_3D||W===i.TEXTURE_2D_ARRAY?i.texImage3D(Tt,0,i.RGBA,1,1,ut,0,i.RGBA,i.UNSIGNED_BYTE,Ct):i.texImage2D(Tt+Zt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ct);return At}const K={};K[i.TEXTURE_2D]=rt(i.TEXTURE_2D,i.TEXTURE_2D,1),K[i.TEXTURE_CUBE_MAP]=rt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),K[i.TEXTURE_2D_ARRAY]=rt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),K[i.TEXTURE_3D]=rt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),o.setClear(0,0,0,1),r.setClear(1),a.setClear(0),$(i.DEPTH_TEST),r.setFunc(so),st(!1),yt(kd),$(i.CULL_FACE),B(Ln);function $(W){h[W]!==!0&&(i.enable(W),h[W]=!0)}function ot(W){h[W]!==!1&&(i.disable(W),h[W]=!1)}function mt(W,Tt){return u[W]!==Tt?(i.bindFramebuffer(W,Tt),u[W]=Tt,W===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=Tt),W===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=Tt),!0):!1}function Mt(W,Tt){let it=d,ut=!1;if(W){it=f.get(Tt),it===void 0&&(it=[],f.set(Tt,it));const Ct=W.textures;if(it.length!==Ct.length||it[0]!==i.COLOR_ATTACHMENT0){for(let At=0,Zt=Ct.length;At<Zt;At++)it[At]=i.COLOR_ATTACHMENT0+At;it.length=Ct.length,ut=!0}}else it[0]!==i.BACK&&(it[0]=i.BACK,ut=!0);ut&&i.drawBuffers(it)}function Ut(W){return g!==W?(i.useProgram(W),g=W,!0):!1}const nt={[es]:i.FUNC_ADD,[O1]:i.FUNC_SUBTRACT,[k1]:i.FUNC_REVERSE_SUBTRACT};nt[z1]=i.MIN,nt[B1]=i.MAX;const ht={[H1]:i.ZERO,[G1]:i.ONE,[V1]:i.SRC_COLOR,[fh]:i.SRC_ALPHA,[Z1]:i.SRC_ALPHA_SATURATE,[Y1]:i.DST_COLOR,[X1]:i.DST_ALPHA,[W1]:i.ONE_MINUS_SRC_COLOR,[ph]:i.ONE_MINUS_SRC_ALPHA,[$1]:i.ONE_MINUS_DST_COLOR,[q1]:i.ONE_MINUS_DST_ALPHA,[K1]:i.CONSTANT_COLOR,[j1]:i.ONE_MINUS_CONSTANT_COLOR,[J1]:i.CONSTANT_ALPHA,[Q1]:i.ONE_MINUS_CONSTANT_ALPHA};function B(W,Tt,it,ut,Ct,At,Zt,Ee,Ve,me){if(W===Ln){v===!0&&(ot(i.BLEND),v=!1);return}if(v===!1&&($(i.BLEND),v=!0),W!==U1){if(W!==m||me!==_){if((p!==es||w!==es)&&(i.blendEquation(i.FUNC_ADD),p=es,w=es),me)switch(W){case Ks:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case dh:i.blendFunc(i.ONE,i.ONE);break;case zd:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Bd:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}else switch(W){case Ks:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case dh:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case zd:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Bd:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}x=null,y=null,b=null,S=null,E.set(0,0,0),T=0,m=W,_=me}return}Ct=Ct||Tt,At=At||it,Zt=Zt||ut,(Tt!==p||Ct!==w)&&(i.blendEquationSeparate(nt[Tt],nt[Ct]),p=Tt,w=Ct),(it!==x||ut!==y||At!==b||Zt!==S)&&(i.blendFuncSeparate(ht[it],ht[ut],ht[At],ht[Zt]),x=it,y=ut,b=At,S=Zt),(Ee.equals(E)===!1||Ve!==T)&&(i.blendColor(Ee.r,Ee.g,Ee.b,Ve),E.copy(Ee),T=Ve),m=W,_=!1}function ft(W,Tt){W.side===mn?ot(i.CULL_FACE):$(i.CULL_FACE);let it=W.side===en;Tt&&(it=!it),st(it),W.blending===Ks&&W.transparent===!1?B(Ln):B(W.blending,W.blendEquation,W.blendSrc,W.blendDst,W.blendEquationAlpha,W.blendSrcAlpha,W.blendDstAlpha,W.blendColor,W.blendAlpha,W.premultipliedAlpha),r.setFunc(W.depthFunc),r.setTest(W.depthTest),r.setMask(W.depthWrite),o.setMask(W.colorWrite);const ut=W.stencilWrite;a.setTest(ut),ut&&(a.setMask(W.stencilWriteMask),a.setFunc(W.stencilFunc,W.stencilRef,W.stencilFuncMask),a.setOp(W.stencilFail,W.stencilZFail,W.stencilZPass)),Gt(W.polygonOffset,W.polygonOffsetFactor,W.polygonOffsetUnits),W.alphaToCoverage===!0?$(i.SAMPLE_ALPHA_TO_COVERAGE):ot(i.SAMPLE_ALPHA_TO_COVERAGE)}function st(W){M!==W&&(W?i.frontFace(i.CW):i.frontFace(i.CCW),M=W)}function yt(W){W!==N1?($(i.CULL_FACE),W!==A&&(W===kd?i.cullFace(i.BACK):W===F1?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ot(i.CULL_FACE),A=W}function wt(W){W!==P&&(F&&i.lineWidth(W),P=W)}function Gt(W,Tt,it){W?($(i.POLYGON_OFFSET_FILL),(C!==Tt||L!==it)&&(i.polygonOffset(Tt,it),C=Tt,L=it)):ot(i.POLYGON_OFFSET_FILL)}function Pt(W){W?$(i.SCISSOR_TEST):ot(i.SCISSOR_TEST)}function z(W){W===void 0&&(W=i.TEXTURE0+N-1),V!==W&&(i.activeTexture(W),V=W)}function U(W,Tt,it){it===void 0&&(V===null?it=i.TEXTURE0+N-1:it=V);let ut=et[it];ut===void 0&&(ut={type:void 0,texture:void 0},et[it]=ut),(ut.type!==W||ut.texture!==Tt)&&(V!==it&&(i.activeTexture(it),V=it),i.bindTexture(W,Tt||K[W]),ut.type=W,ut.texture=Tt)}function Z(){const W=et[V];W!==void 0&&W.type!==void 0&&(i.bindTexture(W.type,null),W.type=void 0,W.texture=void 0)}function at(){try{i.compressedTexImage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function dt(){try{i.compressedTexImage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function ct(){try{i.texSubImage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Ft(){try{i.texSubImage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Et(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function It(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function se(){try{i.texStorage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function vt(){try{i.texStorage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Lt(){try{i.texImage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Wt(){try{i.texImage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function qt(W){Dt.equals(W)===!1&&(i.scissor(W.x,W.y,W.z,W.w),Dt.copy(W))}function Nt(W){J.equals(W)===!1&&(i.viewport(W.x,W.y,W.z,W.w),J.copy(W))}function ae(W,Tt){let it=l.get(Tt);it===void 0&&(it=new WeakMap,l.set(Tt,it));let ut=it.get(W);ut===void 0&&(ut=i.getUniformBlockIndex(Tt,W.name),it.set(W,ut))}function te(W,Tt){const ut=l.get(Tt).get(W);c.get(Tt)!==ut&&(i.uniformBlockBinding(Tt,ut,W.__bindingPointIndex),c.set(Tt,ut))}function ve(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),r.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},V=null,et={},u={},f=new WeakMap,d=[],g=null,v=!1,m=null,p=null,x=null,y=null,w=null,b=null,S=null,E=new Vt(0,0,0),T=0,_=!1,M=null,A=null,P=null,C=null,L=null,Dt.set(0,0,i.canvas.width,i.canvas.height),J.set(0,0,i.canvas.width,i.canvas.height),o.reset(),r.reset(),a.reset()}return{buffers:{color:o,depth:r,stencil:a},enable:$,disable:ot,bindFramebuffer:mt,drawBuffers:Mt,useProgram:Ut,setBlending:B,setMaterial:ft,setFlipSided:st,setCullFace:yt,setLineWidth:wt,setPolygonOffset:Gt,setScissorTest:Pt,activeTexture:z,bindTexture:U,unbindTexture:Z,compressedTexImage2D:at,compressedTexImage3D:dt,texImage2D:Lt,texImage3D:Wt,updateUBOMapping:ae,uniformBlockBinding:te,texStorage2D:se,texStorage3D:vt,texSubImage2D:ct,texSubImage3D:Ft,compressedTexSubImage2D:Et,compressedTexSubImage3D:It,scissor:qt,viewport:Nt,reset:ve}}function F0(i,t,e,n){const s=A_(n);switch(e){case tm:return i*t;case nm:return i*t;case im:return i*t*2;case uc:return i*t/s.components*s.byteLength;case Nu:return i*t/s.components*s.byteLength;case sm:return i*t*2/s.components*s.byteLength;case Fu:return i*t*2/s.components*s.byteLength;case em:return i*t*3/s.components*s.byteLength;case vn:return i*t*4/s.components*s.byteLength;case Uu:return i*t*4/s.components*s.byteLength;case Da:case La:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Na:case Fa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Th:case Rh:return Math.max(i,16)*Math.max(t,8)/4;case Eh:case Ah:return Math.max(i,8)*Math.max(t,8)/2;case Ch:case Ph:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ih:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Dh:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Lh:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Nh:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Fh:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Uh:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Oh:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case kh:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case zh:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Bh:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Hh:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Gh:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Vh:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Wh:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Xh:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Ua:case qh:case Yh:return Math.ceil(i/4)*Math.ceil(t/4)*16;case om:case $h:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Zh:case Kh:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function A_(i){switch(i){case bn:case jp:return{byteLength:1,components:1};case lr:case Jp:case Oi:return{byteLength:2,components:1};case Du:case Lu:return{byteLength:2,components:4};case ls:case Iu:case ii:return{byteLength:4,components:1};case Qp:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function R_(i,t,e,n,s,o,r){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new tt,h=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(z,U){return d?new OffscreenCanvas(z,U):Wa("canvas")}function v(z,U,Z){let at=1;const dt=Pt(z);if((dt.width>Z||dt.height>Z)&&(at=Z/Math.max(dt.width,dt.height)),at<1)if(typeof HTMLImageElement<"u"&&z instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&z instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&z instanceof ImageBitmap||typeof VideoFrame<"u"&&z instanceof VideoFrame){const ct=Math.floor(at*dt.width),Ft=Math.floor(at*dt.height);u===void 0&&(u=g(ct,Ft));const Et=U?g(ct,Ft):u;return Et.width=ct,Et.height=Ft,Et.getContext("2d").drawImage(z,0,0,ct,Ft),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+dt.width+"x"+dt.height+") to ("+ct+"x"+Ft+")."),Et}else return"data"in z&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+dt.width+"x"+dt.height+")."),z;return z}function m(z){return z.generateMipmaps}function p(z){i.generateMipmap(z)}function x(z){return z.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:z.isWebGL3DRenderTarget?i.TEXTURE_3D:z.isWebGLArrayRenderTarget||z.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(z,U,Z,at,dt=!1){if(z!==null){if(i[z]!==void 0)return i[z];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+z+"'")}let ct=U;if(U===i.RED&&(Z===i.FLOAT&&(ct=i.R32F),Z===i.HALF_FLOAT&&(ct=i.R16F),Z===i.UNSIGNED_BYTE&&(ct=i.R8)),U===i.RED_INTEGER&&(Z===i.UNSIGNED_BYTE&&(ct=i.R8UI),Z===i.UNSIGNED_SHORT&&(ct=i.R16UI),Z===i.UNSIGNED_INT&&(ct=i.R32UI),Z===i.BYTE&&(ct=i.R8I),Z===i.SHORT&&(ct=i.R16I),Z===i.INT&&(ct=i.R32I)),U===i.RG&&(Z===i.FLOAT&&(ct=i.RG32F),Z===i.HALF_FLOAT&&(ct=i.RG16F),Z===i.UNSIGNED_BYTE&&(ct=i.RG8)),U===i.RG_INTEGER&&(Z===i.UNSIGNED_BYTE&&(ct=i.RG8UI),Z===i.UNSIGNED_SHORT&&(ct=i.RG16UI),Z===i.UNSIGNED_INT&&(ct=i.RG32UI),Z===i.BYTE&&(ct=i.RG8I),Z===i.SHORT&&(ct=i.RG16I),Z===i.INT&&(ct=i.RG32I)),U===i.RGB_INTEGER&&(Z===i.UNSIGNED_BYTE&&(ct=i.RGB8UI),Z===i.UNSIGNED_SHORT&&(ct=i.RGB16UI),Z===i.UNSIGNED_INT&&(ct=i.RGB32UI),Z===i.BYTE&&(ct=i.RGB8I),Z===i.SHORT&&(ct=i.RGB16I),Z===i.INT&&(ct=i.RGB32I)),U===i.RGBA_INTEGER&&(Z===i.UNSIGNED_BYTE&&(ct=i.RGBA8UI),Z===i.UNSIGNED_SHORT&&(ct=i.RGBA16UI),Z===i.UNSIGNED_INT&&(ct=i.RGBA32UI),Z===i.BYTE&&(ct=i.RGBA8I),Z===i.SHORT&&(ct=i.RGBA16I),Z===i.INT&&(ct=i.RGBA32I)),U===i.RGB&&Z===i.UNSIGNED_INT_5_9_9_9_REV&&(ct=i.RGB9_E5),U===i.RGBA){const Ft=dt?dc:ce.getTransfer(at);Z===i.FLOAT&&(ct=i.RGBA32F),Z===i.HALF_FLOAT&&(ct=i.RGBA16F),Z===i.UNSIGNED_BYTE&&(ct=Ft===ge?i.SRGB8_ALPHA8:i.RGBA8),Z===i.UNSIGNED_SHORT_4_4_4_4&&(ct=i.RGBA4),Z===i.UNSIGNED_SHORT_5_5_5_1&&(ct=i.RGB5_A1)}return(ct===i.R16F||ct===i.R32F||ct===i.RG16F||ct===i.RG32F||ct===i.RGBA16F||ct===i.RGBA32F)&&t.get("EXT_color_buffer_float"),ct}function w(z,U){let Z;return z?U===null||U===ls||U===ao?Z=i.DEPTH24_STENCIL8:U===ii?Z=i.DEPTH32F_STENCIL8:U===lr&&(Z=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):U===null||U===ls||U===ao?Z=i.DEPTH_COMPONENT24:U===ii?Z=i.DEPTH_COMPONENT32F:U===lr&&(Z=i.DEPTH_COMPONENT16),Z}function b(z,U){return m(z)===!0||z.isFramebufferTexture&&z.minFilter!==Ge&&z.minFilter!==He?Math.log2(Math.max(U.width,U.height))+1:z.mipmaps!==void 0&&z.mipmaps.length>0?z.mipmaps.length:z.isCompressedTexture&&Array.isArray(z.image)?U.mipmaps.length:1}function S(z){const U=z.target;U.removeEventListener("dispose",S),T(U),U.isVideoTexture&&h.delete(U)}function E(z){const U=z.target;U.removeEventListener("dispose",E),M(U)}function T(z){const U=n.get(z);if(U.__webglInit===void 0)return;const Z=z.source,at=f.get(Z);if(at){const dt=at[U.__cacheKey];dt.usedTimes--,dt.usedTimes===0&&_(z),Object.keys(at).length===0&&f.delete(Z)}n.remove(z)}function _(z){const U=n.get(z);i.deleteTexture(U.__webglTexture);const Z=z.source,at=f.get(Z);delete at[U.__cacheKey],r.memory.textures--}function M(z){const U=n.get(z);if(z.depthTexture&&(z.depthTexture.dispose(),n.remove(z.depthTexture)),z.isWebGLCubeRenderTarget)for(let at=0;at<6;at++){if(Array.isArray(U.__webglFramebuffer[at]))for(let dt=0;dt<U.__webglFramebuffer[at].length;dt++)i.deleteFramebuffer(U.__webglFramebuffer[at][dt]);else i.deleteFramebuffer(U.__webglFramebuffer[at]);U.__webglDepthbuffer&&i.deleteRenderbuffer(U.__webglDepthbuffer[at])}else{if(Array.isArray(U.__webglFramebuffer))for(let at=0;at<U.__webglFramebuffer.length;at++)i.deleteFramebuffer(U.__webglFramebuffer[at]);else i.deleteFramebuffer(U.__webglFramebuffer);if(U.__webglDepthbuffer&&i.deleteRenderbuffer(U.__webglDepthbuffer),U.__webglMultisampledFramebuffer&&i.deleteFramebuffer(U.__webglMultisampledFramebuffer),U.__webglColorRenderbuffer)for(let at=0;at<U.__webglColorRenderbuffer.length;at++)U.__webglColorRenderbuffer[at]&&i.deleteRenderbuffer(U.__webglColorRenderbuffer[at]);U.__webglDepthRenderbuffer&&i.deleteRenderbuffer(U.__webglDepthRenderbuffer)}const Z=z.textures;for(let at=0,dt=Z.length;at<dt;at++){const ct=n.get(Z[at]);ct.__webglTexture&&(i.deleteTexture(ct.__webglTexture),r.memory.textures--),n.remove(Z[at])}n.remove(z)}let A=0;function P(){A=0}function C(){const z=A;return z>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+z+" texture units while this GPU supports only "+s.maxTextures),A+=1,z}function L(z){const U=[];return U.push(z.wrapS),U.push(z.wrapT),U.push(z.wrapR||0),U.push(z.magFilter),U.push(z.minFilter),U.push(z.anisotropy),U.push(z.internalFormat),U.push(z.format),U.push(z.type),U.push(z.generateMipmaps),U.push(z.premultiplyAlpha),U.push(z.flipY),U.push(z.unpackAlignment),U.push(z.colorSpace),U.join()}function N(z,U){const Z=n.get(z);if(z.isVideoTexture&&wt(z),z.isRenderTargetTexture===!1&&z.version>0&&Z.__version!==z.version){const at=z.image;if(at===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(at.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{J(Z,z,U);return}}e.bindTexture(i.TEXTURE_2D,Z.__webglTexture,i.TEXTURE0+U)}function F(z,U){const Z=n.get(z);if(z.version>0&&Z.__version!==z.version){J(Z,z,U);return}e.bindTexture(i.TEXTURE_2D_ARRAY,Z.__webglTexture,i.TEXTURE0+U)}function H(z,U){const Z=n.get(z);if(z.version>0&&Z.__version!==z.version){J(Z,z,U);return}e.bindTexture(i.TEXTURE_3D,Z.__webglTexture,i.TEXTURE0+U)}function G(z,U){const Z=n.get(z);if(z.version>0&&Z.__version!==z.version){rt(Z,z,U);return}e.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture,i.TEXTURE0+U)}const V={[cs]:i.REPEAT,[ni]:i.CLAMP_TO_EDGE,[Sh]:i.MIRRORED_REPEAT},et={[Ge]:i.NEAREST,[iv]:i.NEAREST_MIPMAP_NEAREST,[Ar]:i.NEAREST_MIPMAP_LINEAR,[He]:i.LINEAR,[Cc]:i.LINEAR_MIPMAP_NEAREST,[Ai]:i.LINEAR_MIPMAP_LINEAR},lt={[rv]:i.NEVER,[dv]:i.ALWAYS,[av]:i.LESS,[am]:i.LEQUAL,[cv]:i.EQUAL,[uv]:i.GEQUAL,[lv]:i.GREATER,[hv]:i.NOTEQUAL};function bt(z,U){if(U.type===ii&&t.has("OES_texture_float_linear")===!1&&(U.magFilter===He||U.magFilter===Cc||U.magFilter===Ar||U.magFilter===Ai||U.minFilter===He||U.minFilter===Cc||U.minFilter===Ar||U.minFilter===Ai)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(z,i.TEXTURE_WRAP_S,V[U.wrapS]),i.texParameteri(z,i.TEXTURE_WRAP_T,V[U.wrapT]),(z===i.TEXTURE_3D||z===i.TEXTURE_2D_ARRAY)&&i.texParameteri(z,i.TEXTURE_WRAP_R,V[U.wrapR]),i.texParameteri(z,i.TEXTURE_MAG_FILTER,et[U.magFilter]),i.texParameteri(z,i.TEXTURE_MIN_FILTER,et[U.minFilter]),U.compareFunction&&(i.texParameteri(z,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(z,i.TEXTURE_COMPARE_FUNC,lt[U.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(U.magFilter===Ge||U.minFilter!==Ar&&U.minFilter!==Ai||U.type===ii&&t.has("OES_texture_float_linear")===!1)return;if(U.anisotropy>1||n.get(U).__currentAnisotropy){const Z=t.get("EXT_texture_filter_anisotropic");i.texParameterf(z,Z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(U.anisotropy,s.getMaxAnisotropy())),n.get(U).__currentAnisotropy=U.anisotropy}}}function Dt(z,U){let Z=!1;z.__webglInit===void 0&&(z.__webglInit=!0,U.addEventListener("dispose",S));const at=U.source;let dt=f.get(at);dt===void 0&&(dt={},f.set(at,dt));const ct=L(U);if(ct!==z.__cacheKey){dt[ct]===void 0&&(dt[ct]={texture:i.createTexture(),usedTimes:0},r.memory.textures++,Z=!0),dt[ct].usedTimes++;const Ft=dt[z.__cacheKey];Ft!==void 0&&(dt[z.__cacheKey].usedTimes--,Ft.usedTimes===0&&_(U)),z.__cacheKey=ct,z.__webglTexture=dt[ct].texture}return Z}function J(z,U,Z){let at=i.TEXTURE_2D;(U.isDataArrayTexture||U.isCompressedArrayTexture)&&(at=i.TEXTURE_2D_ARRAY),U.isData3DTexture&&(at=i.TEXTURE_3D);const dt=Dt(z,U),ct=U.source;e.bindTexture(at,z.__webglTexture,i.TEXTURE0+Z);const Ft=n.get(ct);if(ct.version!==Ft.__version||dt===!0){e.activeTexture(i.TEXTURE0+Z);const Et=ce.getPrimaries(ce.workingColorSpace),It=U.colorSpace===ei?null:ce.getPrimaries(U.colorSpace),se=U.colorSpace===ei||Et===It?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,U.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,U.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,se);let vt=v(U.image,!1,s.maxTextureSize);vt=Gt(U,vt);const Lt=o.convert(U.format,U.colorSpace),Wt=o.convert(U.type);let qt=y(U.internalFormat,Lt,Wt,U.colorSpace,U.isVideoTexture);bt(at,U);let Nt;const ae=U.mipmaps,te=U.isVideoTexture!==!0,ve=Ft.__version===void 0||dt===!0,W=ct.dataReady,Tt=b(U,vt);if(U.isDepthTexture)qt=w(U.format===co,U.type),ve&&(te?e.texStorage2D(i.TEXTURE_2D,1,qt,vt.width,vt.height):e.texImage2D(i.TEXTURE_2D,0,qt,vt.width,vt.height,0,Lt,Wt,null));else if(U.isDataTexture)if(ae.length>0){te&&ve&&e.texStorage2D(i.TEXTURE_2D,Tt,qt,ae[0].width,ae[0].height);for(let it=0,ut=ae.length;it<ut;it++)Nt=ae[it],te?W&&e.texSubImage2D(i.TEXTURE_2D,it,0,0,Nt.width,Nt.height,Lt,Wt,Nt.data):e.texImage2D(i.TEXTURE_2D,it,qt,Nt.width,Nt.height,0,Lt,Wt,Nt.data);U.generateMipmaps=!1}else te?(ve&&e.texStorage2D(i.TEXTURE_2D,Tt,qt,vt.width,vt.height),W&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,vt.width,vt.height,Lt,Wt,vt.data)):e.texImage2D(i.TEXTURE_2D,0,qt,vt.width,vt.height,0,Lt,Wt,vt.data);else if(U.isCompressedTexture)if(U.isCompressedArrayTexture){te&&ve&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Tt,qt,ae[0].width,ae[0].height,vt.depth);for(let it=0,ut=ae.length;it<ut;it++)if(Nt=ae[it],U.format!==vn)if(Lt!==null)if(te){if(W)if(U.layerUpdates.size>0){const Ct=F0(Nt.width,Nt.height,U.format,U.type);for(const At of U.layerUpdates){const Zt=Nt.data.subarray(At*Ct/Nt.data.BYTES_PER_ELEMENT,(At+1)*Ct/Nt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,At,Nt.width,Nt.height,1,Lt,Zt)}U.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,0,Nt.width,Nt.height,vt.depth,Lt,Nt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,it,qt,Nt.width,Nt.height,vt.depth,0,Nt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else te?W&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,0,Nt.width,Nt.height,vt.depth,Lt,Wt,Nt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,it,qt,Nt.width,Nt.height,vt.depth,0,Lt,Wt,Nt.data)}else{te&&ve&&e.texStorage2D(i.TEXTURE_2D,Tt,qt,ae[0].width,ae[0].height);for(let it=0,ut=ae.length;it<ut;it++)Nt=ae[it],U.format!==vn?Lt!==null?te?W&&e.compressedTexSubImage2D(i.TEXTURE_2D,it,0,0,Nt.width,Nt.height,Lt,Nt.data):e.compressedTexImage2D(i.TEXTURE_2D,it,qt,Nt.width,Nt.height,0,Nt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):te?W&&e.texSubImage2D(i.TEXTURE_2D,it,0,0,Nt.width,Nt.height,Lt,Wt,Nt.data):e.texImage2D(i.TEXTURE_2D,it,qt,Nt.width,Nt.height,0,Lt,Wt,Nt.data)}else if(U.isDataArrayTexture)if(te){if(ve&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Tt,qt,vt.width,vt.height,vt.depth),W)if(U.layerUpdates.size>0){const it=F0(vt.width,vt.height,U.format,U.type);for(const ut of U.layerUpdates){const Ct=vt.data.subarray(ut*it/vt.data.BYTES_PER_ELEMENT,(ut+1)*it/vt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ut,vt.width,vt.height,1,Lt,Wt,Ct)}U.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,vt.width,vt.height,vt.depth,Lt,Wt,vt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,qt,vt.width,vt.height,vt.depth,0,Lt,Wt,vt.data);else if(U.isData3DTexture)te?(ve&&e.texStorage3D(i.TEXTURE_3D,Tt,qt,vt.width,vt.height,vt.depth),W&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,vt.width,vt.height,vt.depth,Lt,Wt,vt.data)):e.texImage3D(i.TEXTURE_3D,0,qt,vt.width,vt.height,vt.depth,0,Lt,Wt,vt.data);else if(U.isFramebufferTexture){if(ve)if(te)e.texStorage2D(i.TEXTURE_2D,Tt,qt,vt.width,vt.height);else{let it=vt.width,ut=vt.height;for(let Ct=0;Ct<Tt;Ct++)e.texImage2D(i.TEXTURE_2D,Ct,qt,it,ut,0,Lt,Wt,null),it>>=1,ut>>=1}}else if(ae.length>0){if(te&&ve){const it=Pt(ae[0]);e.texStorage2D(i.TEXTURE_2D,Tt,qt,it.width,it.height)}for(let it=0,ut=ae.length;it<ut;it++)Nt=ae[it],te?W&&e.texSubImage2D(i.TEXTURE_2D,it,0,0,Lt,Wt,Nt):e.texImage2D(i.TEXTURE_2D,it,qt,Lt,Wt,Nt);U.generateMipmaps=!1}else if(te){if(ve){const it=Pt(vt);e.texStorage2D(i.TEXTURE_2D,Tt,qt,it.width,it.height)}W&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Lt,Wt,vt)}else e.texImage2D(i.TEXTURE_2D,0,qt,Lt,Wt,vt);m(U)&&p(at),Ft.__version=ct.version,U.onUpdate&&U.onUpdate(U)}z.__version=U.version}function rt(z,U,Z){if(U.image.length!==6)return;const at=Dt(z,U),dt=U.source;e.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+Z);const ct=n.get(dt);if(dt.version!==ct.__version||at===!0){e.activeTexture(i.TEXTURE0+Z);const Ft=ce.getPrimaries(ce.workingColorSpace),Et=U.colorSpace===ei?null:ce.getPrimaries(U.colorSpace),It=U.colorSpace===ei||Ft===Et?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,U.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,U.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,It);const se=U.isCompressedTexture||U.image[0].isCompressedTexture,vt=U.image[0]&&U.image[0].isDataTexture,Lt=[];for(let ut=0;ut<6;ut++)!se&&!vt?Lt[ut]=v(U.image[ut],!0,s.maxCubemapSize):Lt[ut]=vt?U.image[ut].image:U.image[ut],Lt[ut]=Gt(U,Lt[ut]);const Wt=Lt[0],qt=o.convert(U.format,U.colorSpace),Nt=o.convert(U.type),ae=y(U.internalFormat,qt,Nt,U.colorSpace),te=U.isVideoTexture!==!0,ve=ct.__version===void 0||at===!0,W=dt.dataReady;let Tt=b(U,Wt);bt(i.TEXTURE_CUBE_MAP,U);let it;if(se){te&&ve&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Tt,ae,Wt.width,Wt.height);for(let ut=0;ut<6;ut++){it=Lt[ut].mipmaps;for(let Ct=0;Ct<it.length;Ct++){const At=it[Ct];U.format!==vn?qt!==null?te?W&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct,0,0,At.width,At.height,qt,At.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct,ae,At.width,At.height,0,At.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):te?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct,0,0,At.width,At.height,qt,Nt,At.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct,ae,At.width,At.height,0,qt,Nt,At.data)}}}else{if(it=U.mipmaps,te&&ve){it.length>0&&Tt++;const ut=Pt(Lt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Tt,ae,ut.width,ut.height)}for(let ut=0;ut<6;ut++)if(vt){te?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,0,0,Lt[ut].width,Lt[ut].height,qt,Nt,Lt[ut].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,ae,Lt[ut].width,Lt[ut].height,0,qt,Nt,Lt[ut].data);for(let Ct=0;Ct<it.length;Ct++){const Zt=it[Ct].image[ut].image;te?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct+1,0,0,Zt.width,Zt.height,qt,Nt,Zt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct+1,ae,Zt.width,Zt.height,0,qt,Nt,Zt.data)}}else{te?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,0,0,qt,Nt,Lt[ut]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,ae,qt,Nt,Lt[ut]);for(let Ct=0;Ct<it.length;Ct++){const At=it[Ct];te?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct+1,0,0,qt,Nt,At.image[ut]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct+1,ae,qt,Nt,At.image[ut])}}}m(U)&&p(i.TEXTURE_CUBE_MAP),ct.__version=dt.version,U.onUpdate&&U.onUpdate(U)}z.__version=U.version}function K(z,U,Z,at,dt,ct){const Ft=o.convert(Z.format,Z.colorSpace),Et=o.convert(Z.type),It=y(Z.internalFormat,Ft,Et,Z.colorSpace),se=n.get(U),vt=n.get(Z);if(vt.__renderTarget=U,!se.__hasExternalTextures){const Lt=Math.max(1,U.width>>ct),Wt=Math.max(1,U.height>>ct);dt===i.TEXTURE_3D||dt===i.TEXTURE_2D_ARRAY?e.texImage3D(dt,ct,It,Lt,Wt,U.depth,0,Ft,Et,null):e.texImage2D(dt,ct,It,Lt,Wt,0,Ft,Et,null)}e.bindFramebuffer(i.FRAMEBUFFER,z),yt(U)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,at,dt,vt.__webglTexture,0,st(U)):(dt===i.TEXTURE_2D||dt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&dt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,at,dt,vt.__webglTexture,ct),e.bindFramebuffer(i.FRAMEBUFFER,null)}function $(z,U,Z){if(i.bindRenderbuffer(i.RENDERBUFFER,z),U.depthBuffer){const at=U.depthTexture,dt=at&&at.isDepthTexture?at.type:null,ct=w(U.stencilBuffer,dt),Ft=U.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Et=st(U);yt(U)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Et,ct,U.width,U.height):Z?i.renderbufferStorageMultisample(i.RENDERBUFFER,Et,ct,U.width,U.height):i.renderbufferStorage(i.RENDERBUFFER,ct,U.width,U.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ft,i.RENDERBUFFER,z)}else{const at=U.textures;for(let dt=0;dt<at.length;dt++){const ct=at[dt],Ft=o.convert(ct.format,ct.colorSpace),Et=o.convert(ct.type),It=y(ct.internalFormat,Ft,Et,ct.colorSpace),se=st(U);Z&&yt(U)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,se,It,U.width,U.height):yt(U)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,se,It,U.width,U.height):i.renderbufferStorage(i.RENDERBUFFER,It,U.width,U.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ot(z,U){if(U&&U.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,z),!(U.depthTexture&&U.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const at=n.get(U.depthTexture);at.__renderTarget=U,(!at.__webglTexture||U.depthTexture.image.width!==U.width||U.depthTexture.image.height!==U.height)&&(U.depthTexture.image.width=U.width,U.depthTexture.image.height=U.height,U.depthTexture.needsUpdate=!0),N(U.depthTexture,0);const dt=at.__webglTexture,ct=st(U);if(U.depthTexture.format===js)yt(U)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,dt,0,ct):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,dt,0);else if(U.depthTexture.format===co)yt(U)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,dt,0,ct):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,dt,0);else throw new Error("Unknown depthTexture format")}function mt(z){const U=n.get(z),Z=z.isWebGLCubeRenderTarget===!0;if(U.__boundDepthTexture!==z.depthTexture){const at=z.depthTexture;if(U.__depthDisposeCallback&&U.__depthDisposeCallback(),at){const dt=()=>{delete U.__boundDepthTexture,delete U.__depthDisposeCallback,at.removeEventListener("dispose",dt)};at.addEventListener("dispose",dt),U.__depthDisposeCallback=dt}U.__boundDepthTexture=at}if(z.depthTexture&&!U.__autoAllocateDepthBuffer){if(Z)throw new Error("target.depthTexture not supported in Cube render targets");ot(U.__webglFramebuffer,z)}else if(Z){U.__webglDepthbuffer=[];for(let at=0;at<6;at++)if(e.bindFramebuffer(i.FRAMEBUFFER,U.__webglFramebuffer[at]),U.__webglDepthbuffer[at]===void 0)U.__webglDepthbuffer[at]=i.createRenderbuffer(),$(U.__webglDepthbuffer[at],z,!1);else{const dt=z.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ct=U.__webglDepthbuffer[at];i.bindRenderbuffer(i.RENDERBUFFER,ct),i.framebufferRenderbuffer(i.FRAMEBUFFER,dt,i.RENDERBUFFER,ct)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,U.__webglFramebuffer),U.__webglDepthbuffer===void 0)U.__webglDepthbuffer=i.createRenderbuffer(),$(U.__webglDepthbuffer,z,!1);else{const at=z.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,dt=U.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,dt),i.framebufferRenderbuffer(i.FRAMEBUFFER,at,i.RENDERBUFFER,dt)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Mt(z,U,Z){const at=n.get(z);U!==void 0&&K(at.__webglFramebuffer,z,z.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),Z!==void 0&&mt(z)}function Ut(z){const U=z.texture,Z=n.get(z),at=n.get(U);z.addEventListener("dispose",E);const dt=z.textures,ct=z.isWebGLCubeRenderTarget===!0,Ft=dt.length>1;if(Ft||(at.__webglTexture===void 0&&(at.__webglTexture=i.createTexture()),at.__version=U.version,r.memory.textures++),ct){Z.__webglFramebuffer=[];for(let Et=0;Et<6;Et++)if(U.mipmaps&&U.mipmaps.length>0){Z.__webglFramebuffer[Et]=[];for(let It=0;It<U.mipmaps.length;It++)Z.__webglFramebuffer[Et][It]=i.createFramebuffer()}else Z.__webglFramebuffer[Et]=i.createFramebuffer()}else{if(U.mipmaps&&U.mipmaps.length>0){Z.__webglFramebuffer=[];for(let Et=0;Et<U.mipmaps.length;Et++)Z.__webglFramebuffer[Et]=i.createFramebuffer()}else Z.__webglFramebuffer=i.createFramebuffer();if(Ft)for(let Et=0,It=dt.length;Et<It;Et++){const se=n.get(dt[Et]);se.__webglTexture===void 0&&(se.__webglTexture=i.createTexture(),r.memory.textures++)}if(z.samples>0&&yt(z)===!1){Z.__webglMultisampledFramebuffer=i.createFramebuffer(),Z.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,Z.__webglMultisampledFramebuffer);for(let Et=0;Et<dt.length;Et++){const It=dt[Et];Z.__webglColorRenderbuffer[Et]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,Z.__webglColorRenderbuffer[Et]);const se=o.convert(It.format,It.colorSpace),vt=o.convert(It.type),Lt=y(It.internalFormat,se,vt,It.colorSpace,z.isXRRenderTarget===!0),Wt=st(z);i.renderbufferStorageMultisample(i.RENDERBUFFER,Wt,Lt,z.width,z.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Et,i.RENDERBUFFER,Z.__webglColorRenderbuffer[Et])}i.bindRenderbuffer(i.RENDERBUFFER,null),z.depthBuffer&&(Z.__webglDepthRenderbuffer=i.createRenderbuffer(),$(Z.__webglDepthRenderbuffer,z,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ct){e.bindTexture(i.TEXTURE_CUBE_MAP,at.__webglTexture),bt(i.TEXTURE_CUBE_MAP,U);for(let Et=0;Et<6;Et++)if(U.mipmaps&&U.mipmaps.length>0)for(let It=0;It<U.mipmaps.length;It++)K(Z.__webglFramebuffer[Et][It],z,U,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,It);else K(Z.__webglFramebuffer[Et],z,U,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0);m(U)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ft){for(let Et=0,It=dt.length;Et<It;Et++){const se=dt[Et],vt=n.get(se);e.bindTexture(i.TEXTURE_2D,vt.__webglTexture),bt(i.TEXTURE_2D,se),K(Z.__webglFramebuffer,z,se,i.COLOR_ATTACHMENT0+Et,i.TEXTURE_2D,0),m(se)&&p(i.TEXTURE_2D)}e.unbindTexture()}else{let Et=i.TEXTURE_2D;if((z.isWebGL3DRenderTarget||z.isWebGLArrayRenderTarget)&&(Et=z.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Et,at.__webglTexture),bt(Et,U),U.mipmaps&&U.mipmaps.length>0)for(let It=0;It<U.mipmaps.length;It++)K(Z.__webglFramebuffer[It],z,U,i.COLOR_ATTACHMENT0,Et,It);else K(Z.__webglFramebuffer,z,U,i.COLOR_ATTACHMENT0,Et,0);m(U)&&p(Et),e.unbindTexture()}z.depthBuffer&&mt(z)}function nt(z){const U=z.textures;for(let Z=0,at=U.length;Z<at;Z++){const dt=U[Z];if(m(dt)){const ct=x(z),Ft=n.get(dt).__webglTexture;e.bindTexture(ct,Ft),p(ct),e.unbindTexture()}}}const ht=[],B=[];function ft(z){if(z.samples>0){if(yt(z)===!1){const U=z.textures,Z=z.width,at=z.height;let dt=i.COLOR_BUFFER_BIT;const ct=z.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ft=n.get(z),Et=U.length>1;if(Et)for(let It=0;It<U.length;It++)e.bindFramebuffer(i.FRAMEBUFFER,Ft.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Ft.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Ft.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ft.__webglFramebuffer);for(let It=0;It<U.length;It++){if(z.resolveDepthBuffer&&(z.depthBuffer&&(dt|=i.DEPTH_BUFFER_BIT),z.stencilBuffer&&z.resolveStencilBuffer&&(dt|=i.STENCIL_BUFFER_BIT)),Et){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ft.__webglColorRenderbuffer[It]);const se=n.get(U[It]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,se,0)}i.blitFramebuffer(0,0,Z,at,0,0,Z,at,dt,i.NEAREST),c===!0&&(ht.length=0,B.length=0,ht.push(i.COLOR_ATTACHMENT0+It),z.depthBuffer&&z.resolveDepthBuffer===!1&&(ht.push(ct),B.push(ct),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,B)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ht))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Et)for(let It=0;It<U.length;It++){e.bindFramebuffer(i.FRAMEBUFFER,Ft.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.RENDERBUFFER,Ft.__webglColorRenderbuffer[It]);const se=n.get(U[It]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Ft.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.TEXTURE_2D,se,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ft.__webglMultisampledFramebuffer)}else if(z.depthBuffer&&z.resolveDepthBuffer===!1&&c){const U=z.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[U])}}}function st(z){return Math.min(s.maxSamples,z.samples)}function yt(z){const U=n.get(z);return z.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&U.__useRenderToTexture!==!1}function wt(z){const U=r.render.frame;h.get(z)!==U&&(h.set(z,U),z.update())}function Gt(z,U){const Z=z.colorSpace,at=z.format,dt=z.type;return z.isCompressedTexture===!0||z.isVideoTexture===!0||Z!==vo&&Z!==ei&&(ce.getTransfer(Z)===ge?(at!==vn||dt!==bn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Z)),U}function Pt(z){return typeof HTMLImageElement<"u"&&z instanceof HTMLImageElement?(l.width=z.naturalWidth||z.width,l.height=z.naturalHeight||z.height):typeof VideoFrame<"u"&&z instanceof VideoFrame?(l.width=z.displayWidth,l.height=z.displayHeight):(l.width=z.width,l.height=z.height),l}this.allocateTextureUnit=C,this.resetTextureUnits=P,this.setTexture2D=N,this.setTexture2DArray=F,this.setTexture3D=H,this.setTextureCube=G,this.rebindTextures=Mt,this.setupRenderTarget=Ut,this.updateRenderTargetMipmap=nt,this.updateMultisampleRenderTarget=ft,this.setupDepthRenderbuffer=mt,this.setupFrameBufferTexture=K,this.useMultisampledRTT=yt}function C_(i,t){function e(n,s=ei){let o;const r=ce.getTransfer(s);if(n===bn)return i.UNSIGNED_BYTE;if(n===Du)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Lu)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Qp)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===jp)return i.BYTE;if(n===Jp)return i.SHORT;if(n===lr)return i.UNSIGNED_SHORT;if(n===Iu)return i.INT;if(n===ls)return i.UNSIGNED_INT;if(n===ii)return i.FLOAT;if(n===Oi)return i.HALF_FLOAT;if(n===tm)return i.ALPHA;if(n===em)return i.RGB;if(n===vn)return i.RGBA;if(n===nm)return i.LUMINANCE;if(n===im)return i.LUMINANCE_ALPHA;if(n===js)return i.DEPTH_COMPONENT;if(n===co)return i.DEPTH_STENCIL;if(n===uc)return i.RED;if(n===Nu)return i.RED_INTEGER;if(n===sm)return i.RG;if(n===Fu)return i.RG_INTEGER;if(n===Uu)return i.RGBA_INTEGER;if(n===Da||n===La||n===Na||n===Fa)if(r===ge)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(n===Da)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===La)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Na)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Fa)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(n===Da)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===La)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Na)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Fa)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Eh||n===Th||n===Ah||n===Rh)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(n===Eh)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Th)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ah)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Rh)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ch||n===Ph||n===Ih)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(n===Ch||n===Ph)return r===ge?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(n===Ih)return r===ge?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Dh||n===Lh||n===Nh||n===Fh||n===Uh||n===Oh||n===kh||n===zh||n===Bh||n===Hh||n===Gh||n===Vh||n===Wh||n===Xh)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(n===Dh)return r===ge?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Lh)return r===ge?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Nh)return r===ge?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Fh)return r===ge?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Uh)return r===ge?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Oh)return r===ge?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===kh)return r===ge?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===zh)return r===ge?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Bh)return r===ge?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Hh)return r===ge?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Gh)return r===ge?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Vh)return r===ge?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Wh)return r===ge?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Xh)return r===ge?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ua||n===qh||n===Yh)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(n===Ua)return r===ge?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===qh)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Yh)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===om||n===$h||n===Zh||n===Kh)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(n===Ua)return o.COMPRESSED_RED_RGTC1_EXT;if(n===$h)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Zh)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Kh)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ao?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class P_ extends on{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class he extends Te{constructor(){super(),this.isGroup=!0,this.type="Group"}}const I_={type:"move"};class nl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new he,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new he,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new he,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,o=null,r=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){r=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),p=this._getHandJoint(l,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,g=.005;l.inputState.pinching&&f>d+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=d-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(o=e.getPose(t.gripSpace,n),o!==null&&(c.matrix.fromArray(o.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,o.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(o.linearVelocity)):c.hasLinearVelocity=!1,o.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(o.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&o!==null&&(s=o),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(I_)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=o!==null),l!==null&&(l.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new he;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const D_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,L_=`
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

}`;class N_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new nn,o=t.properties.get(s);o.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new be({vertexShader:D_,fragmentShader:L_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new $t(new En(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class F_ extends yo{constructor(t,e){super();const n=this;let s=null,o=1,r=null,a="local-floor",c=1,l=null,h=null,u=null,f=null,d=null,g=null;const v=new N_,m=e.getContextAttributes();let p=null,x=null;const y=[],w=[],b=new tt;let S=null;const E=new on;E.viewport=new de;const T=new on;T.viewport=new de;const _=[E,T],M=new P_;let A=null,P=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let rt=y[J];return rt===void 0&&(rt=new nl,y[J]=rt),rt.getTargetRaySpace()},this.getControllerGrip=function(J){let rt=y[J];return rt===void 0&&(rt=new nl,y[J]=rt),rt.getGripSpace()},this.getHand=function(J){let rt=y[J];return rt===void 0&&(rt=new nl,y[J]=rt),rt.getHandSpace()};function C(J){const rt=w.indexOf(J.inputSource);if(rt===-1)return;const K=y[rt];K!==void 0&&(K.update(J.inputSource,J.frame,l||r),K.dispatchEvent({type:J.type,data:J.inputSource}))}function L(){s.removeEventListener("select",C),s.removeEventListener("selectstart",C),s.removeEventListener("selectend",C),s.removeEventListener("squeeze",C),s.removeEventListener("squeezestart",C),s.removeEventListener("squeezeend",C),s.removeEventListener("end",L),s.removeEventListener("inputsourceschange",N);for(let J=0;J<y.length;J++){const rt=w[J];rt!==null&&(w[J]=null,y[J].disconnect(rt))}A=null,P=null,v.reset(),t.setRenderTarget(p),d=null,f=null,u=null,s=null,x=null,Dt.stop(),n.isPresenting=!1,t.setPixelRatio(S),t.setSize(b.width,b.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){o=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){a=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",C),s.addEventListener("selectstart",C),s.addEventListener("selectend",C),s.addEventListener("squeeze",C),s.addEventListener("squeezestart",C),s.addEventListener("squeezeend",C),s.addEventListener("end",L),s.addEventListener("inputsourceschange",N),m.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(b),s.renderState.layers===void 0){const rt={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:o};d=new XRWebGLLayer(s,e,rt),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),x=new Sn(d.framebufferWidth,d.framebufferHeight,{format:vn,type:bn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let rt=null,K=null,$=null;m.depth&&($=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,rt=m.stencil?co:js,K=m.stencil?ao:ls);const ot={colorFormat:e.RGBA8,depthFormat:$,scaleFactor:o};u=new XRWebGLBinding(s,e),f=u.createProjectionLayer(ot),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),x=new Sn(f.textureWidth,f.textureHeight,{format:vn,type:bn,depthTexture:new Gu(f.textureWidth,f.textureHeight,K,void 0,void 0,void 0,void 0,void 0,void 0,rt),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,r=await s.requestReferenceSpace(a),Dt.setContext(s),Dt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function N(J){for(let rt=0;rt<J.removed.length;rt++){const K=J.removed[rt],$=w.indexOf(K);$>=0&&(w[$]=null,y[$].disconnect(K))}for(let rt=0;rt<J.added.length;rt++){const K=J.added[rt];let $=w.indexOf(K);if($===-1){for(let mt=0;mt<y.length;mt++)if(mt>=w.length){w.push(K),$=mt;break}else if(w[mt]===null){w[mt]=K,$=mt;break}if($===-1)break}const ot=y[$];ot&&ot.connect(K)}}const F=new R,H=new R;function G(J,rt,K){F.setFromMatrixPosition(rt.matrixWorld),H.setFromMatrixPosition(K.matrixWorld);const $=F.distanceTo(H),ot=rt.projectionMatrix.elements,mt=K.projectionMatrix.elements,Mt=ot[14]/(ot[10]-1),Ut=ot[14]/(ot[10]+1),nt=(ot[9]+1)/ot[5],ht=(ot[9]-1)/ot[5],B=(ot[8]-1)/ot[0],ft=(mt[8]+1)/mt[0],st=Mt*B,yt=Mt*ft,wt=$/(-B+ft),Gt=wt*-B;if(rt.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Gt),J.translateZ(wt),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),ot[10]===-1)J.projectionMatrix.copy(rt.projectionMatrix),J.projectionMatrixInverse.copy(rt.projectionMatrixInverse);else{const Pt=Mt+wt,z=Ut+wt,U=st-Gt,Z=yt+($-Gt),at=nt*Ut/z*Pt,dt=ht*Ut/z*Pt;J.projectionMatrix.makePerspective(U,Z,at,dt,Pt,z),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function V(J,rt){rt===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(rt.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let rt=J.near,K=J.far;v.texture!==null&&(v.depthNear>0&&(rt=v.depthNear),v.depthFar>0&&(K=v.depthFar)),M.near=T.near=E.near=rt,M.far=T.far=E.far=K,(A!==M.near||P!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),A=M.near,P=M.far),E.layers.mask=J.layers.mask|2,T.layers.mask=J.layers.mask|4,M.layers.mask=E.layers.mask|T.layers.mask;const $=J.parent,ot=M.cameras;V(M,$);for(let mt=0;mt<ot.length;mt++)V(ot[mt],$);ot.length===2?G(M,E,T):M.projectionMatrix.copy(E.projectionMatrix),et(J,M,$)};function et(J,rt,K){K===null?J.matrix.copy(rt.matrixWorld):(J.matrix.copy(K.matrixWorld),J.matrix.invert(),J.matrix.multiply(rt.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(rt.projectionMatrix),J.projectionMatrixInverse.copy(rt.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=lo*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(J){c=J,f!==null&&(f.fixedFoveation=J),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=J)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(M)};let lt=null;function bt(J,rt){if(h=rt.getViewerPose(l||r),g=rt,h!==null){const K=h.views;d!==null&&(t.setRenderTargetFramebuffer(x,d.framebuffer),t.setRenderTarget(x));let $=!1;K.length!==M.cameras.length&&(M.cameras.length=0,$=!0);for(let mt=0;mt<K.length;mt++){const Mt=K[mt];let Ut=null;if(d!==null)Ut=d.getViewport(Mt);else{const ht=u.getViewSubImage(f,Mt);Ut=ht.viewport,mt===0&&(t.setRenderTargetTextures(x,ht.colorTexture,f.ignoreDepthValues?void 0:ht.depthStencilTexture),t.setRenderTarget(x))}let nt=_[mt];nt===void 0&&(nt=new on,nt.layers.enable(mt),nt.viewport=new de,_[mt]=nt),nt.matrix.fromArray(Mt.transform.matrix),nt.matrix.decompose(nt.position,nt.quaternion,nt.scale),nt.projectionMatrix.fromArray(Mt.projectionMatrix),nt.projectionMatrixInverse.copy(nt.projectionMatrix).invert(),nt.viewport.set(Ut.x,Ut.y,Ut.width,Ut.height),mt===0&&(M.matrix.copy(nt.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),$===!0&&M.cameras.push(nt)}const ot=s.enabledFeatures;if(ot&&ot.includes("depth-sensing")){const mt=u.getDepthInformation(K[0]);mt&&mt.isValid&&mt.texture&&v.init(t,mt,s.renderState)}}for(let K=0;K<y.length;K++){const $=w[K],ot=y[K];$!==null&&ot!==void 0&&ot.update($,rt,l||r)}lt&&lt(J,rt),rt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:rt}),g=null}const Dt=new vm;Dt.setAnimationLoop(bt),this.setAnimationLoop=function(J){lt=J},this.dispose=function(){}}}const Yi=new On,U_=new oe;function O_(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,pm(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,x,y,w){p.isMeshBasicMaterial||p.isMeshLambertMaterial?o(m,p):p.isMeshToonMaterial?(o(m,p),u(m,p)):p.isMeshPhongMaterial?(o(m,p),h(m,p)):p.isMeshStandardMaterial?(o(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,w)):p.isMeshMatcapMaterial?(o(m,p),g(m,p)):p.isMeshDepthMaterial?o(m,p):p.isMeshDistanceMaterial?(o(m,p),v(m,p)):p.isMeshNormalMaterial?o(m,p):p.isLineBasicMaterial?(r(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,x,y):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function o(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===en&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===en&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=t.get(p),y=x.envMap,w=x.envMapRotation;y&&(m.envMap.value=y,Yi.copy(w),Yi.x*=-1,Yi.y*=-1,Yi.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Yi.y*=-1,Yi.z*=-1),m.envMapRotation.value.setFromMatrix4(U_.makeRotationFromEuler(Yi)),m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function r(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,x,y){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=y*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===en&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const x=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function k_(i,t,e,n){let s={},o={},r=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,y){const w=y.program;n.uniformBlockBinding(x,w)}function l(x,y){let w=s[x.id];w===void 0&&(g(x),w=h(x),s[x.id]=w,x.addEventListener("dispose",m));const b=y.program;n.updateUBOMapping(x,b);const S=t.render.frame;o[x.id]!==S&&(f(x),o[x.id]=S)}function h(x){const y=u();x.__bindingPointIndex=y;const w=i.createBuffer(),b=x.__size,S=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,w),i.bufferData(i.UNIFORM_BUFFER,b,S),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,w),w}function u(){for(let x=0;x<a;x++)if(r.indexOf(x)===-1)return r.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(x){const y=s[x.id],w=x.uniforms,b=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let S=0,E=w.length;S<E;S++){const T=Array.isArray(w[S])?w[S]:[w[S]];for(let _=0,M=T.length;_<M;_++){const A=T[_];if(d(A,S,_,b)===!0){const P=A.__offset,C=Array.isArray(A.value)?A.value:[A.value];let L=0;for(let N=0;N<C.length;N++){const F=C[N],H=v(F);typeof F=="number"||typeof F=="boolean"?(A.__data[0]=F,i.bufferSubData(i.UNIFORM_BUFFER,P+L,A.__data)):F.isMatrix3?(A.__data[0]=F.elements[0],A.__data[1]=F.elements[1],A.__data[2]=F.elements[2],A.__data[3]=0,A.__data[4]=F.elements[3],A.__data[5]=F.elements[4],A.__data[6]=F.elements[5],A.__data[7]=0,A.__data[8]=F.elements[6],A.__data[9]=F.elements[7],A.__data[10]=F.elements[8],A.__data[11]=0):(F.toArray(A.__data,L),L+=H.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,P,A.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(x,y,w,b){const S=x.value,E=y+"_"+w;if(b[E]===void 0)return typeof S=="number"||typeof S=="boolean"?b[E]=S:b[E]=S.clone(),!0;{const T=b[E];if(typeof S=="number"||typeof S=="boolean"){if(T!==S)return b[E]=S,!0}else if(T.equals(S)===!1)return T.copy(S),!0}return!1}function g(x){const y=x.uniforms;let w=0;const b=16;for(let E=0,T=y.length;E<T;E++){const _=Array.isArray(y[E])?y[E]:[y[E]];for(let M=0,A=_.length;M<A;M++){const P=_[M],C=Array.isArray(P.value)?P.value:[P.value];for(let L=0,N=C.length;L<N;L++){const F=C[L],H=v(F),G=w%b,V=G%H.boundary,et=G+V;w+=V,et!==0&&b-et<H.storage&&(w+=b-et),P.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=w,w+=H.storage}}}const S=w%b;return S>0&&(w+=b-S),x.__size=w,x.__cache={},this}function v(x){const y={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(y.boundary=4,y.storage=4):x.isVector2?(y.boundary=8,y.storage=8):x.isVector3||x.isColor?(y.boundary=16,y.storage=12):x.isVector4?(y.boundary=16,y.storage=16):x.isMatrix3?(y.boundary=48,y.storage=48):x.isMatrix4?(y.boundary=64,y.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),y}function m(x){const y=x.target;y.removeEventListener("dispose",m);const w=r.indexOf(y.__bindingPointIndex);r.splice(w,1),i.deleteBuffer(s[y.id]),delete s[y.id],delete o[y.id]}function p(){for(const x in s)i.deleteBuffer(s[x]);r=[],s={},o={}}return{bind:c,update:l,dispose:p}}class z_{constructor(t={}){const{canvas:e=Cv(),context:n=null,depth:s=!0,stencil:o=!1,alpha:r=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=r;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,p=null;const x=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=hn,this.toneMapping=Pi,this.toneMappingExposure=1;const w=this;let b=!1,S=0,E=0,T=null,_=-1,M=null;const A=new de,P=new de;let C=null;const L=new Vt(0);let N=0,F=e.width,H=e.height,G=1,V=null,et=null;const lt=new de(0,0,F,H),bt=new de(0,0,F,H);let Dt=!1;const J=new zu;let rt=!1,K=!1;const $=new oe,ot=new oe,mt=new R,Mt=new de,Ut={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let nt=!1;function ht(){return T===null?G:1}let B=n;function ft(O,X){return e.getContext(O,X)}try{const O={alpha:!0,depth:s,stencil:o,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Cu}`),e.addEventListener("webglcontextlost",ut,!1),e.addEventListener("webglcontextrestored",Ct,!1),e.addEventListener("webglcontextcreationerror",At,!1),B===null){const X="webgl2";if(B=ft(X,O),B===null)throw ft(X)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(O){throw console.error("THREE.WebGLRenderer: "+O.message),O}let st,yt,wt,Gt,Pt,z,U,Z,at,dt,ct,Ft,Et,It,se,vt,Lt,Wt,qt,Nt,ae,te,ve,W;function Tt(){st=new X2(B),st.init(),te=new C_(B,st),yt=new z2(B,st,t,te),wt=new T_(B,st),yt.reverseDepthBuffer&&f&&wt.buffers.depth.setReversed(!0),Gt=new $2(B),Pt=new d_,z=new R_(B,st,wt,Pt,yt,te,Gt),U=new H2(w),Z=new W2(w),at=new ey(B),ve=new O2(B,at),dt=new q2(B,at,Gt,ve),ct=new K2(B,dt,at,Gt),qt=new Z2(B,yt,z),vt=new B2(Pt),Ft=new u_(w,U,Z,st,yt,ve,vt),Et=new O_(w,Pt),It=new p_,se=new x_(st),Wt=new U2(w,U,Z,wt,ct,d,c),Lt=new S_(w,ct,yt),W=new k_(B,Gt,yt,wt),Nt=new k2(B,st,Gt),ae=new Y2(B,st,Gt),Gt.programs=Ft.programs,w.capabilities=yt,w.extensions=st,w.properties=Pt,w.renderLists=It,w.shadowMap=Lt,w.state=wt,w.info=Gt}Tt();const it=new F_(w,B);this.xr=it,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const O=st.get("WEBGL_lose_context");O&&O.loseContext()},this.forceContextRestore=function(){const O=st.get("WEBGL_lose_context");O&&O.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(O){O!==void 0&&(G=O,this.setSize(F,H,!1))},this.getSize=function(O){return O.set(F,H)},this.setSize=function(O,X,j=!0){if(it.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=O,H=X,e.width=Math.floor(O*G),e.height=Math.floor(X*G),j===!0&&(e.style.width=O+"px",e.style.height=X+"px"),this.setViewport(0,0,O,X)},this.getDrawingBufferSize=function(O){return O.set(F*G,H*G).floor()},this.setDrawingBufferSize=function(O,X,j){F=O,H=X,G=j,e.width=Math.floor(O*j),e.height=Math.floor(X*j),this.setViewport(0,0,O,X)},this.getCurrentViewport=function(O){return O.copy(A)},this.getViewport=function(O){return O.copy(lt)},this.setViewport=function(O,X,j,Q){O.isVector4?lt.set(O.x,O.y,O.z,O.w):lt.set(O,X,j,Q),wt.viewport(A.copy(lt).multiplyScalar(G).round())},this.getScissor=function(O){return O.copy(bt)},this.setScissor=function(O,X,j,Q){O.isVector4?bt.set(O.x,O.y,O.z,O.w):bt.set(O,X,j,Q),wt.scissor(P.copy(bt).multiplyScalar(G).round())},this.getScissorTest=function(){return Dt},this.setScissorTest=function(O){wt.setScissorTest(Dt=O)},this.setOpaqueSort=function(O){V=O},this.setTransparentSort=function(O){et=O},this.getClearColor=function(O){return O.copy(Wt.getClearColor())},this.setClearColor=function(){Wt.setClearColor.apply(Wt,arguments)},this.getClearAlpha=function(){return Wt.getClearAlpha()},this.setClearAlpha=function(){Wt.setClearAlpha.apply(Wt,arguments)},this.clear=function(O=!0,X=!0,j=!0){let Q=0;if(O){let q=!1;if(T!==null){const _t=T.texture.format;q=_t===Uu||_t===Fu||_t===Nu}if(q){const _t=T.texture.type,Rt=_t===bn||_t===ls||_t===lr||_t===ao||_t===Du||_t===Lu,Ot=Wt.getClearColor(),kt=Wt.getClearAlpha(),Yt=Ot.r,Kt=Ot.g,zt=Ot.b;Rt?(g[0]=Yt,g[1]=Kt,g[2]=zt,g[3]=kt,B.clearBufferuiv(B.COLOR,0,g)):(v[0]=Yt,v[1]=Kt,v[2]=zt,v[3]=kt,B.clearBufferiv(B.COLOR,0,v))}else Q|=B.COLOR_BUFFER_BIT}X&&(Q|=B.DEPTH_BUFFER_BIT),j&&(Q|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ut,!1),e.removeEventListener("webglcontextrestored",Ct,!1),e.removeEventListener("webglcontextcreationerror",At,!1),It.dispose(),se.dispose(),Pt.dispose(),U.dispose(),Z.dispose(),ct.dispose(),ve.dispose(),W.dispose(),Ft.dispose(),it.dispose(),it.removeEventListener("sessionstart",Pd),it.removeEventListener("sessionend",Id),Hi.stop()};function ut(O){O.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function Ct(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;const O=Gt.autoReset,X=Lt.enabled,j=Lt.autoUpdate,Q=Lt.needsUpdate,q=Lt.type;Tt(),Gt.autoReset=O,Lt.enabled=X,Lt.autoUpdate=j,Lt.needsUpdate=Q,Lt.type=q}function At(O){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",O.statusMessage)}function Zt(O){const X=O.target;X.removeEventListener("dispose",Zt),Ee(X)}function Ee(O){Ve(O),Pt.remove(O)}function Ve(O){const X=Pt.get(O).programs;X!==void 0&&(X.forEach(function(j){Ft.releaseProgram(j)}),O.isShaderMaterial&&Ft.releaseShaderCache(O))}this.renderBufferDirect=function(O,X,j,Q,q,_t){X===null&&(X=Ut);const Rt=q.isMesh&&q.matrixWorld.determinant()<0,Ot=I1(O,X,j,Q,q);wt.setMaterial(Q,Rt);let kt=j.index,Yt=1;if(Q.wireframe===!0){if(kt=dt.getWireframeAttribute(j),kt===void 0)return;Yt=2}const Kt=j.drawRange,zt=j.attributes.position;let ue=Kt.start*Yt,ye=(Kt.start+Kt.count)*Yt;_t!==null&&(ue=Math.max(ue,_t.start*Yt),ye=Math.min(ye,(_t.start+_t.count)*Yt)),kt!==null?(ue=Math.max(ue,0),ye=Math.min(ye,kt.count)):zt!=null&&(ue=Math.max(ue,0),ye=Math.min(ye,zt.count));const we=ye-ue;if(we<0||we===1/0)return;ve.setup(q,Q,Ot,j,kt);let sn,fe=Nt;if(kt!==null&&(sn=at.get(kt),fe=ae,fe.setIndex(sn)),q.isMesh)Q.wireframe===!0?(wt.setLineWidth(Q.wireframeLinewidth*ht()),fe.setMode(B.LINES)):fe.setMode(B.TRIANGLES);else if(q.isLine){let Ht=Q.linewidth;Ht===void 0&&(Ht=1),wt.setLineWidth(Ht*ht()),q.isLineSegments?fe.setMode(B.LINES):q.isLineLoop?fe.setMode(B.LINE_LOOP):fe.setMode(B.LINE_STRIP)}else q.isPoints?fe.setMode(B.POINTS):q.isSprite&&fe.setMode(B.TRIANGLES);if(q.isBatchedMesh)if(q._multiDrawInstances!==null)fe.renderMultiDrawInstances(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount,q._multiDrawInstances);else if(st.get("WEBGL_multi_draw"))fe.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{const Ht=q._multiDrawStarts,Gn=q._multiDrawCounts,pe=q._multiDrawCount,wn=kt?at.get(kt).bytesPerElement:1,vs=Pt.get(Q).currentProgram.getUniforms();for(let rn=0;rn<pe;rn++)vs.setValue(B,"_gl_DrawID",rn),fe.render(Ht[rn]/wn,Gn[rn])}else if(q.isInstancedMesh)fe.renderInstances(ue,we,q.count);else if(j.isInstancedBufferGeometry){const Ht=j._maxInstanceCount!==void 0?j._maxInstanceCount:1/0,Gn=Math.min(j.instanceCount,Ht);fe.renderInstances(ue,we,Gn)}else fe.render(ue,we)};function me(O,X,j){O.transparent===!0&&O.side===mn&&O.forceSinglePass===!1?(O.side=en,O.needsUpdate=!0,Tr(O,X,j),O.side=Ii,O.needsUpdate=!0,Tr(O,X,j),O.side=mn):Tr(O,X,j)}this.compile=function(O,X,j=null){j===null&&(j=O),p=se.get(j),p.init(X),y.push(p),j.traverseVisible(function(q){q.isLight&&q.layers.test(X.layers)&&(p.pushLight(q),q.castShadow&&p.pushShadow(q))}),O!==j&&O.traverseVisible(function(q){q.isLight&&q.layers.test(X.layers)&&(p.pushLight(q),q.castShadow&&p.pushShadow(q))}),p.setupLights();const Q=new Set;return O.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;const _t=q.material;if(_t)if(Array.isArray(_t))for(let Rt=0;Rt<_t.length;Rt++){const Ot=_t[Rt];me(Ot,j,q),Q.add(Ot)}else me(_t,j,q),Q.add(_t)}),y.pop(),p=null,Q},this.compileAsync=function(O,X,j=null){const Q=this.compile(O,X,j);return new Promise(q=>{function _t(){if(Q.forEach(function(Rt){Pt.get(Rt).currentProgram.isReady()&&Q.delete(Rt)}),Q.size===0){q(O);return}setTimeout(_t,10)}st.get("KHR_parallel_shader_compile")!==null?_t():setTimeout(_t,10)})};let yn=null;function Hn(O){yn&&yn(O)}function Pd(){Hi.stop()}function Id(){Hi.start()}const Hi=new vm;Hi.setAnimationLoop(Hn),typeof self<"u"&&Hi.setContext(self),this.setAnimationLoop=function(O){yn=O,it.setAnimationLoop(O),O===null?Hi.stop():Hi.start()},it.addEventListener("sessionstart",Pd),it.addEventListener("sessionend",Id),this.render=function(O,X){if(X!==void 0&&X.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;if(O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),X.parent===null&&X.matrixWorldAutoUpdate===!0&&X.updateMatrixWorld(),it.enabled===!0&&it.isPresenting===!0&&(it.cameraAutoUpdate===!0&&it.updateCamera(X),X=it.getCamera()),O.isScene===!0&&O.onBeforeRender(w,O,X,T),p=se.get(O,y.length),p.init(X),y.push(p),ot.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),J.setFromProjectionMatrix(ot),K=this.localClippingEnabled,rt=vt.init(this.clippingPlanes,K),m=It.get(O,x.length),m.init(),x.push(m),it.enabled===!0&&it.isPresenting===!0){const _t=w.xr.getDepthSensingMesh();_t!==null&&Rc(_t,X,-1/0,w.sortObjects)}Rc(O,X,0,w.sortObjects),m.finish(),w.sortObjects===!0&&m.sort(V,et),nt=it.enabled===!1||it.isPresenting===!1||it.hasDepthSensing()===!1,nt&&Wt.addToRenderList(m,O),this.info.render.frame++,rt===!0&&vt.beginShadows();const j=p.state.shadowsArray;Lt.render(j,O,X),rt===!0&&vt.endShadows(),this.info.autoReset===!0&&this.info.reset();const Q=m.opaque,q=m.transmissive;if(p.setupLights(),X.isArrayCamera){const _t=X.cameras;if(q.length>0)for(let Rt=0,Ot=_t.length;Rt<Ot;Rt++){const kt=_t[Rt];Ld(Q,q,O,kt)}nt&&Wt.render(O);for(let Rt=0,Ot=_t.length;Rt<Ot;Rt++){const kt=_t[Rt];Dd(m,O,kt,kt.viewport)}}else q.length>0&&Ld(Q,q,O,X),nt&&Wt.render(O),Dd(m,O,X);T!==null&&(z.updateMultisampleRenderTarget(T),z.updateRenderTargetMipmap(T)),O.isScene===!0&&O.onAfterRender(w,O,X),ve.resetDefaultState(),_=-1,M=null,y.pop(),y.length>0?(p=y[y.length-1],rt===!0&&vt.setGlobalState(w.clippingPlanes,p.state.camera)):p=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function Rc(O,X,j,Q){if(O.visible===!1)return;if(O.layers.test(X.layers)){if(O.isGroup)j=O.renderOrder;else if(O.isLOD)O.autoUpdate===!0&&O.update(X);else if(O.isLight)p.pushLight(O),O.castShadow&&p.pushShadow(O);else if(O.isSprite){if(!O.frustumCulled||J.intersectsSprite(O)){Q&&Mt.setFromMatrixPosition(O.matrixWorld).applyMatrix4(ot);const Rt=ct.update(O),Ot=O.material;Ot.visible&&m.push(O,Rt,Ot,j,Mt.z,null)}}else if((O.isMesh||O.isLine||O.isPoints)&&(!O.frustumCulled||J.intersectsObject(O))){const Rt=ct.update(O),Ot=O.material;if(Q&&(O.boundingSphere!==void 0?(O.boundingSphere===null&&O.computeBoundingSphere(),Mt.copy(O.boundingSphere.center)):(Rt.boundingSphere===null&&Rt.computeBoundingSphere(),Mt.copy(Rt.boundingSphere.center)),Mt.applyMatrix4(O.matrixWorld).applyMatrix4(ot)),Array.isArray(Ot)){const kt=Rt.groups;for(let Yt=0,Kt=kt.length;Yt<Kt;Yt++){const zt=kt[Yt],ue=Ot[zt.materialIndex];ue&&ue.visible&&m.push(O,Rt,ue,j,Mt.z,zt)}}else Ot.visible&&m.push(O,Rt,Ot,j,Mt.z,null)}}const _t=O.children;for(let Rt=0,Ot=_t.length;Rt<Ot;Rt++)Rc(_t[Rt],X,j,Q)}function Dd(O,X,j,Q){const q=O.opaque,_t=O.transmissive,Rt=O.transparent;p.setupLightsView(j),rt===!0&&vt.setGlobalState(w.clippingPlanes,j),Q&&wt.viewport(A.copy(Q)),q.length>0&&Er(q,X,j),_t.length>0&&Er(_t,X,j),Rt.length>0&&Er(Rt,X,j),wt.buffers.depth.setTest(!0),wt.buffers.depth.setMask(!0),wt.buffers.color.setMask(!0),wt.setPolygonOffset(!1)}function Ld(O,X,j,Q){if((j.isScene===!0?j.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Q.id]===void 0&&(p.state.transmissionRenderTarget[Q.id]=new Sn(1,1,{generateMipmaps:!0,type:st.has("EXT_color_buffer_half_float")||st.has("EXT_color_buffer_float")?Oi:bn,minFilter:Ai,samples:4,stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ce.workingColorSpace}));const _t=p.state.transmissionRenderTarget[Q.id],Rt=Q.viewport||A;_t.setSize(Rt.z,Rt.w);const Ot=w.getRenderTarget();w.setRenderTarget(_t),w.getClearColor(L),N=w.getClearAlpha(),N<1&&w.setClearColor(16777215,.5),w.clear(),nt&&Wt.render(j);const kt=w.toneMapping;w.toneMapping=Pi;const Yt=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),p.setupLightsView(Q),rt===!0&&vt.setGlobalState(w.clippingPlanes,Q),Er(O,j,Q),z.updateMultisampleRenderTarget(_t),z.updateRenderTargetMipmap(_t),st.has("WEBGL_multisampled_render_to_texture")===!1){let Kt=!1;for(let zt=0,ue=X.length;zt<ue;zt++){const ye=X[zt],we=ye.object,sn=ye.geometry,fe=ye.material,Ht=ye.group;if(fe.side===mn&&we.layers.test(Q.layers)){const Gn=fe.side;fe.side=en,fe.needsUpdate=!0,Nd(we,j,Q,sn,fe,Ht),fe.side=Gn,fe.needsUpdate=!0,Kt=!0}}Kt===!0&&(z.updateMultisampleRenderTarget(_t),z.updateRenderTargetMipmap(_t))}w.setRenderTarget(Ot),w.setClearColor(L,N),Yt!==void 0&&(Q.viewport=Yt),w.toneMapping=kt}function Er(O,X,j){const Q=X.isScene===!0?X.overrideMaterial:null;for(let q=0,_t=O.length;q<_t;q++){const Rt=O[q],Ot=Rt.object,kt=Rt.geometry,Yt=Q===null?Rt.material:Q,Kt=Rt.group;Ot.layers.test(j.layers)&&Nd(Ot,X,j,kt,Yt,Kt)}}function Nd(O,X,j,Q,q,_t){O.onBeforeRender(w,X,j,Q,q,_t),O.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,O.matrixWorld),O.normalMatrix.getNormalMatrix(O.modelViewMatrix),q.onBeforeRender(w,X,j,Q,O,_t),q.transparent===!0&&q.side===mn&&q.forceSinglePass===!1?(q.side=en,q.needsUpdate=!0,w.renderBufferDirect(j,X,Q,q,O,_t),q.side=Ii,q.needsUpdate=!0,w.renderBufferDirect(j,X,Q,q,O,_t),q.side=mn):w.renderBufferDirect(j,X,Q,q,O,_t),O.onAfterRender(w,X,j,Q,q,_t)}function Tr(O,X,j){X.isScene!==!0&&(X=Ut);const Q=Pt.get(O),q=p.state.lights,_t=p.state.shadowsArray,Rt=q.state.version,Ot=Ft.getParameters(O,q.state,_t,X,j),kt=Ft.getProgramCacheKey(Ot);let Yt=Q.programs;Q.environment=O.isMeshStandardMaterial?X.environment:null,Q.fog=X.fog,Q.envMap=(O.isMeshStandardMaterial?Z:U).get(O.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&O.envMap===null?X.environmentRotation:O.envMapRotation,Yt===void 0&&(O.addEventListener("dispose",Zt),Yt=new Map,Q.programs=Yt);let Kt=Yt.get(kt);if(Kt!==void 0){if(Q.currentProgram===Kt&&Q.lightsStateVersion===Rt)return Ud(O,Ot),Kt}else Ot.uniforms=Ft.getUniforms(O),O.onBeforeCompile(Ot,w),Kt=Ft.acquireProgram(Ot,kt),Yt.set(kt,Kt),Q.uniforms=Ot.uniforms;const zt=Q.uniforms;return(!O.isShaderMaterial&&!O.isRawShaderMaterial||O.clipping===!0)&&(zt.clippingPlanes=vt.uniform),Ud(O,Ot),Q.needsLights=L1(O),Q.lightsStateVersion=Rt,Q.needsLights&&(zt.ambientLightColor.value=q.state.ambient,zt.lightProbe.value=q.state.probe,zt.directionalLights.value=q.state.directional,zt.directionalLightShadows.value=q.state.directionalShadow,zt.spotLights.value=q.state.spot,zt.spotLightShadows.value=q.state.spotShadow,zt.rectAreaLights.value=q.state.rectArea,zt.ltc_1.value=q.state.rectAreaLTC1,zt.ltc_2.value=q.state.rectAreaLTC2,zt.pointLights.value=q.state.point,zt.pointLightShadows.value=q.state.pointShadow,zt.hemisphereLights.value=q.state.hemi,zt.directionalShadowMap.value=q.state.directionalShadowMap,zt.directionalShadowMatrix.value=q.state.directionalShadowMatrix,zt.spotShadowMap.value=q.state.spotShadowMap,zt.spotLightMatrix.value=q.state.spotLightMatrix,zt.spotLightMap.value=q.state.spotLightMap,zt.pointShadowMap.value=q.state.pointShadowMap,zt.pointShadowMatrix.value=q.state.pointShadowMatrix),Q.currentProgram=Kt,Q.uniformsList=null,Kt}function Fd(O){if(O.uniformsList===null){const X=O.currentProgram.getUniforms();O.uniformsList=Oa.seqWithValue(X.seq,O.uniforms)}return O.uniformsList}function Ud(O,X){const j=Pt.get(O);j.outputColorSpace=X.outputColorSpace,j.batching=X.batching,j.batchingColor=X.batchingColor,j.instancing=X.instancing,j.instancingColor=X.instancingColor,j.instancingMorph=X.instancingMorph,j.skinning=X.skinning,j.morphTargets=X.morphTargets,j.morphNormals=X.morphNormals,j.morphColors=X.morphColors,j.morphTargetsCount=X.morphTargetsCount,j.numClippingPlanes=X.numClippingPlanes,j.numIntersection=X.numClipIntersection,j.vertexAlphas=X.vertexAlphas,j.vertexTangents=X.vertexTangents,j.toneMapping=X.toneMapping}function I1(O,X,j,Q,q){X.isScene!==!0&&(X=Ut),z.resetTextureUnits();const _t=X.fog,Rt=Q.isMeshStandardMaterial?X.environment:null,Ot=T===null?w.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:vo,kt=(Q.isMeshStandardMaterial?Z:U).get(Q.envMap||Rt),Yt=Q.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,Kt=!!j.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),zt=!!j.morphAttributes.position,ue=!!j.morphAttributes.normal,ye=!!j.morphAttributes.color;let we=Pi;Q.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(we=w.toneMapping);const sn=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,fe=sn!==void 0?sn.length:0,Ht=Pt.get(Q),Gn=p.state.lights;if(rt===!0&&(K===!0||O!==M)){const un=O===M&&Q.id===_;vt.setState(Q,O,un)}let pe=!1;Q.version===Ht.__version?(Ht.needsLights&&Ht.lightsStateVersion!==Gn.state.version||Ht.outputColorSpace!==Ot||q.isBatchedMesh&&Ht.batching===!1||!q.isBatchedMesh&&Ht.batching===!0||q.isBatchedMesh&&Ht.batchingColor===!0&&q.colorTexture===null||q.isBatchedMesh&&Ht.batchingColor===!1&&q.colorTexture!==null||q.isInstancedMesh&&Ht.instancing===!1||!q.isInstancedMesh&&Ht.instancing===!0||q.isSkinnedMesh&&Ht.skinning===!1||!q.isSkinnedMesh&&Ht.skinning===!0||q.isInstancedMesh&&Ht.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&Ht.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&Ht.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&Ht.instancingMorph===!1&&q.morphTexture!==null||Ht.envMap!==kt||Q.fog===!0&&Ht.fog!==_t||Ht.numClippingPlanes!==void 0&&(Ht.numClippingPlanes!==vt.numPlanes||Ht.numIntersection!==vt.numIntersection)||Ht.vertexAlphas!==Yt||Ht.vertexTangents!==Kt||Ht.morphTargets!==zt||Ht.morphNormals!==ue||Ht.morphColors!==ye||Ht.toneMapping!==we||Ht.morphTargetsCount!==fe)&&(pe=!0):(pe=!0,Ht.__version=Q.version);let wn=Ht.currentProgram;pe===!0&&(wn=Tr(Q,X,q));let vs=!1,rn=!1,Mo=!1;const xe=wn.getUniforms(),Tn=Ht.uniforms;if(wt.useProgram(wn.program)&&(vs=!0,rn=!0,Mo=!0),Q.id!==_&&(_=Q.id,rn=!0),vs||M!==O){wt.buffers.depth.getReversed()?($.copy(O.projectionMatrix),Iv($),Dv($),xe.setValue(B,"projectionMatrix",$)):xe.setValue(B,"projectionMatrix",O.projectionMatrix),xe.setValue(B,"viewMatrix",O.matrixWorldInverse);const mi=xe.map.cameraPosition;mi!==void 0&&mi.setValue(B,mt.setFromMatrixPosition(O.matrixWorld)),yt.logarithmicDepthBuffer&&xe.setValue(B,"logDepthBufFC",2/(Math.log(O.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&xe.setValue(B,"isOrthographic",O.isOrthographicCamera===!0),M!==O&&(M=O,rn=!0,Mo=!0)}if(q.isSkinnedMesh){xe.setOptional(B,q,"bindMatrix"),xe.setOptional(B,q,"bindMatrixInverse");const un=q.skeleton;un&&(un.boneTexture===null&&un.computeBoneTexture(),xe.setValue(B,"boneTexture",un.boneTexture,z))}q.isBatchedMesh&&(xe.setOptional(B,q,"batchingTexture"),xe.setValue(B,"batchingTexture",q._matricesTexture,z),xe.setOptional(B,q,"batchingIdTexture"),xe.setValue(B,"batchingIdTexture",q._indirectTexture,z),xe.setOptional(B,q,"batchingColorTexture"),q._colorsTexture!==null&&xe.setValue(B,"batchingColorTexture",q._colorsTexture,z));const bo=j.morphAttributes;if((bo.position!==void 0||bo.normal!==void 0||bo.color!==void 0)&&qt.update(q,j,wn),(rn||Ht.receiveShadow!==q.receiveShadow)&&(Ht.receiveShadow=q.receiveShadow,xe.setValue(B,"receiveShadow",q.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(Tn.envMap.value=kt,Tn.flipEnvMap.value=kt.isCubeTexture&&kt.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&X.environment!==null&&(Tn.envMapIntensity.value=X.environmentIntensity),rn&&(xe.setValue(B,"toneMappingExposure",w.toneMappingExposure),Ht.needsLights&&D1(Tn,Mo),_t&&Q.fog===!0&&Et.refreshFogUniforms(Tn,_t),Et.refreshMaterialUniforms(Tn,Q,G,H,p.state.transmissionRenderTarget[O.id]),Oa.upload(B,Fd(Ht),Tn,z)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(Oa.upload(B,Fd(Ht),Tn,z),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&xe.setValue(B,"center",q.center),xe.setValue(B,"modelViewMatrix",q.modelViewMatrix),xe.setValue(B,"normalMatrix",q.normalMatrix),xe.setValue(B,"modelMatrix",q.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){const un=Q.uniformsGroups;for(let mi=0,gi=un.length;mi<gi;mi++){const Od=un[mi];W.update(Od,wn),W.bind(Od,wn)}}return wn}function D1(O,X){O.ambientLightColor.needsUpdate=X,O.lightProbe.needsUpdate=X,O.directionalLights.needsUpdate=X,O.directionalLightShadows.needsUpdate=X,O.pointLights.needsUpdate=X,O.pointLightShadows.needsUpdate=X,O.spotLights.needsUpdate=X,O.spotLightShadows.needsUpdate=X,O.rectAreaLights.needsUpdate=X,O.hemisphereLights.needsUpdate=X}function L1(O){return O.isMeshLambertMaterial||O.isMeshToonMaterial||O.isMeshPhongMaterial||O.isMeshStandardMaterial||O.isShadowMaterial||O.isShaderMaterial&&O.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(O,X,j){Pt.get(O.texture).__webglTexture=X,Pt.get(O.depthTexture).__webglTexture=j;const Q=Pt.get(O);Q.__hasExternalTextures=!0,Q.__autoAllocateDepthBuffer=j===void 0,Q.__autoAllocateDepthBuffer||st.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Q.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(O,X){const j=Pt.get(O);j.__webglFramebuffer=X,j.__useDefaultFramebuffer=X===void 0},this.setRenderTarget=function(O,X=0,j=0){T=O,S=X,E=j;let Q=!0,q=null,_t=!1,Rt=!1;if(O){const kt=Pt.get(O);if(kt.__useDefaultFramebuffer!==void 0)wt.bindFramebuffer(B.FRAMEBUFFER,null),Q=!1;else if(kt.__webglFramebuffer===void 0)z.setupRenderTarget(O);else if(kt.__hasExternalTextures)z.rebindTextures(O,Pt.get(O.texture).__webglTexture,Pt.get(O.depthTexture).__webglTexture);else if(O.depthBuffer){const zt=O.depthTexture;if(kt.__boundDepthTexture!==zt){if(zt!==null&&Pt.has(zt)&&(O.width!==zt.image.width||O.height!==zt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");z.setupDepthRenderbuffer(O)}}const Yt=O.texture;(Yt.isData3DTexture||Yt.isDataArrayTexture||Yt.isCompressedArrayTexture)&&(Rt=!0);const Kt=Pt.get(O).__webglFramebuffer;O.isWebGLCubeRenderTarget?(Array.isArray(Kt[X])?q=Kt[X][j]:q=Kt[X],_t=!0):O.samples>0&&z.useMultisampledRTT(O)===!1?q=Pt.get(O).__webglMultisampledFramebuffer:Array.isArray(Kt)?q=Kt[j]:q=Kt,A.copy(O.viewport),P.copy(O.scissor),C=O.scissorTest}else A.copy(lt).multiplyScalar(G).floor(),P.copy(bt).multiplyScalar(G).floor(),C=Dt;if(wt.bindFramebuffer(B.FRAMEBUFFER,q)&&Q&&wt.drawBuffers(O,q),wt.viewport(A),wt.scissor(P),wt.setScissorTest(C),_t){const kt=Pt.get(O.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+X,kt.__webglTexture,j)}else if(Rt){const kt=Pt.get(O.texture),Yt=X||0;B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,kt.__webglTexture,j||0,Yt)}_=-1},this.readRenderTargetPixels=function(O,X,j,Q,q,_t,Rt){if(!(O&&O.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ot=Pt.get(O).__webglFramebuffer;if(O.isWebGLCubeRenderTarget&&Rt!==void 0&&(Ot=Ot[Rt]),Ot){wt.bindFramebuffer(B.FRAMEBUFFER,Ot);try{const kt=O.texture,Yt=kt.format,Kt=kt.type;if(!yt.textureFormatReadable(Yt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!yt.textureTypeReadable(Kt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}X>=0&&X<=O.width-Q&&j>=0&&j<=O.height-q&&B.readPixels(X,j,Q,q,te.convert(Yt),te.convert(Kt),_t)}finally{const kt=T!==null?Pt.get(T).__webglFramebuffer:null;wt.bindFramebuffer(B.FRAMEBUFFER,kt)}}},this.readRenderTargetPixelsAsync=async function(O,X,j,Q,q,_t,Rt){if(!(O&&O.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ot=Pt.get(O).__webglFramebuffer;if(O.isWebGLCubeRenderTarget&&Rt!==void 0&&(Ot=Ot[Rt]),Ot){const kt=O.texture,Yt=kt.format,Kt=kt.type;if(!yt.textureFormatReadable(Yt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!yt.textureTypeReadable(Kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(X>=0&&X<=O.width-Q&&j>=0&&j<=O.height-q){wt.bindFramebuffer(B.FRAMEBUFFER,Ot);const zt=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,zt),B.bufferData(B.PIXEL_PACK_BUFFER,_t.byteLength,B.STREAM_READ),B.readPixels(X,j,Q,q,te.convert(Yt),te.convert(Kt),0);const ue=T!==null?Pt.get(T).__webglFramebuffer:null;wt.bindFramebuffer(B.FRAMEBUFFER,ue);const ye=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await Pv(B,ye,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,zt),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,_t),B.deleteBuffer(zt),B.deleteSync(ye),_t}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(O,X=null,j=0){O.isTexture!==!0&&($o("WebGLRenderer: copyFramebufferToTexture function signature has changed."),X=arguments[0]||null,O=arguments[1]);const Q=Math.pow(2,-j),q=Math.floor(O.image.width*Q),_t=Math.floor(O.image.height*Q),Rt=X!==null?X.x:0,Ot=X!==null?X.y:0;z.setTexture2D(O,0),B.copyTexSubImage2D(B.TEXTURE_2D,j,0,0,Rt,Ot,q,_t),wt.unbindTexture()},this.copyTextureToTexture=function(O,X,j=null,Q=null,q=0){O.isTexture!==!0&&($o("WebGLRenderer: copyTextureToTexture function signature has changed."),Q=arguments[0]||null,O=arguments[1],X=arguments[2],q=arguments[3]||0,j=null);let _t,Rt,Ot,kt,Yt,Kt,zt,ue,ye;const we=O.isCompressedTexture?O.mipmaps[q]:O.image;j!==null?(_t=j.max.x-j.min.x,Rt=j.max.y-j.min.y,Ot=j.isBox3?j.max.z-j.min.z:1,kt=j.min.x,Yt=j.min.y,Kt=j.isBox3?j.min.z:0):(_t=we.width,Rt=we.height,Ot=we.depth||1,kt=0,Yt=0,Kt=0),Q!==null?(zt=Q.x,ue=Q.y,ye=Q.z):(zt=0,ue=0,ye=0);const sn=te.convert(X.format),fe=te.convert(X.type);let Ht;X.isData3DTexture?(z.setTexture3D(X,0),Ht=B.TEXTURE_3D):X.isDataArrayTexture||X.isCompressedArrayTexture?(z.setTexture2DArray(X,0),Ht=B.TEXTURE_2D_ARRAY):(z.setTexture2D(X,0),Ht=B.TEXTURE_2D),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,X.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,X.unpackAlignment);const Gn=B.getParameter(B.UNPACK_ROW_LENGTH),pe=B.getParameter(B.UNPACK_IMAGE_HEIGHT),wn=B.getParameter(B.UNPACK_SKIP_PIXELS),vs=B.getParameter(B.UNPACK_SKIP_ROWS),rn=B.getParameter(B.UNPACK_SKIP_IMAGES);B.pixelStorei(B.UNPACK_ROW_LENGTH,we.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,we.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,kt),B.pixelStorei(B.UNPACK_SKIP_ROWS,Yt),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Kt);const Mo=O.isDataArrayTexture||O.isData3DTexture,xe=X.isDataArrayTexture||X.isData3DTexture;if(O.isRenderTargetTexture||O.isDepthTexture){const Tn=Pt.get(O),bo=Pt.get(X),un=Pt.get(Tn.__renderTarget),mi=Pt.get(bo.__renderTarget);wt.bindFramebuffer(B.READ_FRAMEBUFFER,un.__webglFramebuffer),wt.bindFramebuffer(B.DRAW_FRAMEBUFFER,mi.__webglFramebuffer);for(let gi=0;gi<Ot;gi++)Mo&&B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Pt.get(O).__webglTexture,q,Kt+gi),O.isDepthTexture?(xe&&B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Pt.get(X).__webglTexture,q,ye+gi),B.blitFramebuffer(kt,Yt,_t,Rt,zt,ue,_t,Rt,B.DEPTH_BUFFER_BIT,B.NEAREST)):xe?B.copyTexSubImage3D(Ht,q,zt,ue,ye+gi,kt,Yt,_t,Rt):B.copyTexSubImage2D(Ht,q,zt,ue,ye+gi,kt,Yt,_t,Rt);wt.bindFramebuffer(B.READ_FRAMEBUFFER,null),wt.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else xe?O.isDataTexture||O.isData3DTexture?B.texSubImage3D(Ht,q,zt,ue,ye,_t,Rt,Ot,sn,fe,we.data):X.isCompressedArrayTexture?B.compressedTexSubImage3D(Ht,q,zt,ue,ye,_t,Rt,Ot,sn,we.data):B.texSubImage3D(Ht,q,zt,ue,ye,_t,Rt,Ot,sn,fe,we):O.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,q,zt,ue,_t,Rt,sn,fe,we.data):O.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,q,zt,ue,we.width,we.height,sn,we.data):B.texSubImage2D(B.TEXTURE_2D,q,zt,ue,_t,Rt,sn,fe,we);B.pixelStorei(B.UNPACK_ROW_LENGTH,Gn),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,pe),B.pixelStorei(B.UNPACK_SKIP_PIXELS,wn),B.pixelStorei(B.UNPACK_SKIP_ROWS,vs),B.pixelStorei(B.UNPACK_SKIP_IMAGES,rn),q===0&&X.generateMipmaps&&B.generateMipmap(Ht),wt.unbindTexture()},this.copyTextureToTexture3D=function(O,X,j=null,Q=null,q=0){return O.isTexture!==!0&&($o("WebGLRenderer: copyTextureToTexture3D function signature has changed."),j=arguments[0]||null,Q=arguments[1]||null,O=arguments[2],X=arguments[3],q=arguments[4]||0),$o('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(O,X,j,Q,q)},this.initRenderTarget=function(O){Pt.get(O).__webglFramebuffer===void 0&&z.setupRenderTarget(O)},this.initTexture=function(O){O.isCubeTexture?z.setTextureCube(O,0):O.isData3DTexture?z.setTexture3D(O,0):O.isDataArrayTexture||O.isCompressedArrayTexture?z.setTexture2DArray(O,0):z.setTexture2D(O,0),wt.unbindTexture()},this.resetState=function(){S=0,E=0,T=null,wt.reset(),ve.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return si}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=ce._getDrawingBufferColorSpace(t),e.unpackColorSpace=ce._getUnpackColorSpace()}}class gc{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Vt(t),this.near=e,this.far=n}clone(){return new gc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class B_ extends Te{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new On,this.environmentIntensity=1,this.environmentRotation=new On,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Vu extends nn{constructor(t=null,e=1,n=1,s,o,r,a,c,l=Ge,h=Ge,u,f){super(null,r,a,c,l,h,s,o,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class bm extends ki{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Vt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Xa=new R,qa=new R,U0=new oe,Ro=new gr,$r=new wo,il=new R,O0=new R;class H_ extends Te{constructor(t=new Fe,e=new bm){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,o=e.count;s<o;s++)Xa.fromBufferAttribute(e,s-1),qa.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Xa.distanceTo(qa);t.setAttribute("lineDistance",new le(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,o=t.params.Line.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),$r.copy(n.boundingSphere),$r.applyMatrix4(s),$r.radius+=o,t.ray.intersectsSphere($r)===!1)return;U0.copy(s).invert(),Ro.copy(t.ray).applyMatrix4(U0);const a=o/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){const d=Math.max(0,r.start),g=Math.min(h.count,r.start+r.count);for(let v=d,m=g-1;v<m;v+=l){const p=h.getX(v),x=h.getX(v+1),y=Zr(this,t,Ro,c,p,x);y&&e.push(y)}if(this.isLineLoop){const v=h.getX(g-1),m=h.getX(d),p=Zr(this,t,Ro,c,v,m);p&&e.push(p)}}else{const d=Math.max(0,r.start),g=Math.min(f.count,r.start+r.count);for(let v=d,m=g-1;v<m;v+=l){const p=Zr(this,t,Ro,c,v,v+1);p&&e.push(p)}if(this.isLineLoop){const v=Zr(this,t,Ro,c,g-1,d);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=s.length;o<r;o++){const a=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}}function Zr(i,t,e,n,s,o){const r=i.geometry.attributes.position;if(Xa.fromBufferAttribute(r,s),qa.fromBufferAttribute(r,o),e.distanceSqToSegment(Xa,qa,il,O0)>n)return;il.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(il);if(!(c<t.near||c>t.far))return{distance:c,point:O0.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const k0=new R,z0=new R;class Wu extends H_{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,o=e.count;s<o;s+=2)k0.fromBufferAttribute(e,s),z0.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+k0.distanceTo(z0);t.setAttribute("lineDistance",new le(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class G_ extends ki{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new Vt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const B0=new oe,Jh=new gr,Kr=new wo,jr=new R;class Sm extends Te{constructor(t=new Fe,e=new G_){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,o=t.params.Points.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Kr.copy(n.boundingSphere),Kr.applyMatrix4(s),Kr.radius+=o,t.ray.intersectsSphere(Kr)===!1)return;B0.copy(s).invert(),Jh.copy(t.ray).applyMatrix4(B0);const a=o/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,u=n.attributes.position;if(l!==null){const f=Math.max(0,r.start),d=Math.min(l.count,r.start+r.count);for(let g=f,v=d;g<v;g++){const m=l.getX(g);jr.fromBufferAttribute(u,m),H0(jr,m,c,s,t,e,this)}}else{const f=Math.max(0,r.start),d=Math.min(u.count,r.start+r.count);for(let g=f,v=d;g<v;g++)jr.fromBufferAttribute(u,g),H0(jr,g,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=s.length;o<r;o++){const a=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}}function H0(i,t,e,n,s,o,r){const a=Jh.distanceSqToPoint(i);if(a<e){const c=new R;Jh.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;o.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:r})}}class Bn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),o=0;e.push(0);for(let r=1;r<=t;r++)n=this.getPoint(r/t),o+=n.distanceTo(s),e.push(o),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const o=n.length;let r;e?r=e:r=t*n[o-1];let a=0,c=o-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-r,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===r)return s/(o-1);const h=n[s],f=n[s+1]-h,d=(r-h)/f;return(s+d)/(o-1)}getTangent(t,e){let s=t-1e-4,o=t+1e-4;s<0&&(s=0),o>1&&(o=1);const r=this.getPoint(s),a=this.getPoint(o),c=e||(r.isVector2?new tt:new R);return c.copy(a).sub(r).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new R,s=[],o=[],r=[],a=new R,c=new oe;for(let d=0;d<=t;d++){const g=d/t;s[d]=this.getTangentAt(g,new R)}o[0]=new R,r[0]=new R;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),f<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),o[0].crossVectors(s[0],a),r[0].crossVectors(s[0],o[0]);for(let d=1;d<=t;d++){if(o[d]=o[d-1].clone(),r[d]=r[d-1].clone(),a.crossVectors(s[d-1],s[d]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Pe(s[d-1].dot(s[d]),-1,1));o[d].applyMatrix4(c.makeRotationAxis(a,g))}r[d].crossVectors(s[d],o[d])}if(e===!0){let d=Math.acos(Pe(o[0].dot(o[t]),-1,1));d/=t,s[0].dot(a.crossVectors(o[0],o[t]))>0&&(d=-d);for(let g=1;g<=t;g++)o[g].applyMatrix4(c.makeRotationAxis(s[g],d*g)),r[g].crossVectors(s[g],o[g])}return{tangents:s,normals:o,binormals:r}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Xu extends Bn{constructor(t=0,e=0,n=1,s=1,o=0,r=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=o,this.aEndAngle=r,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new tt){const n=e,s=Math.PI*2;let o=this.aEndAngle-this.aStartAngle;const r=Math.abs(o)<Number.EPSILON;for(;o<0;)o+=s;for(;o>s;)o-=s;o<Number.EPSILON&&(r?o=0:o=s),this.aClockwise===!0&&!r&&(o===s?o=-s:o=o-s);const a=this.aStartAngle+t*o;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,d=l-this.aY;c=f*h-d*u+this.aX,l=f*u+d*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class V_ extends Xu{constructor(t,e,n,s,o,r){super(t,e,n,n,s,o,r),this.isArcCurve=!0,this.type="ArcCurve"}}function qu(){let i=0,t=0,e=0,n=0;function s(o,r,a,c){i=o,t=a,e=-3*o+3*r-2*a-c,n=2*o-2*r+a+c}return{initCatmullRom:function(o,r,a,c,l){s(r,a,l*(a-o),l*(c-r))},initNonuniformCatmullRom:function(o,r,a,c,l,h,u){let f=(r-o)/l-(a-o)/(l+h)+(a-r)/h,d=(a-r)/h-(c-r)/(h+u)+(c-a)/u;f*=h,d*=h,s(r,a,f,d)},calc:function(o){const r=o*o,a=r*o;return i+t*o+e*r+n*a}}}const Jr=new R,sl=new qu,ol=new qu,rl=new qu;class W_ extends Bn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new R){const n=e,s=this.points,o=s.length,r=(o-(this.closed?0:1))*t;let a=Math.floor(r),c=r-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/o)+1)*o:c===0&&a===o-1&&(a=o-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%o]:(Jr.subVectors(s[0],s[1]).add(s[0]),l=Jr);const u=s[a%o],f=s[(a+1)%o];if(this.closed||a+2<o?h=s[(a+2)%o]:(Jr.subVectors(s[o-1],s[o-2]).add(s[o-1]),h=Jr),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),d),v=Math.pow(u.distanceToSquared(f),d),m=Math.pow(f.distanceToSquared(h),d);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),sl.initNonuniformCatmullRom(l.x,u.x,f.x,h.x,g,v,m),ol.initNonuniformCatmullRom(l.y,u.y,f.y,h.y,g,v,m),rl.initNonuniformCatmullRom(l.z,u.z,f.z,h.z,g,v,m)}else this.curveType==="catmullrom"&&(sl.initCatmullRom(l.x,u.x,f.x,h.x,this.tension),ol.initCatmullRom(l.y,u.y,f.y,h.y,this.tension),rl.initCatmullRom(l.z,u.z,f.z,h.z,this.tension));return n.set(sl.calc(c),ol.calc(c),rl.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new R().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function G0(i,t,e,n,s){const o=(n-t)*.5,r=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+o+r)*c+(-3*e+3*n-2*o-r)*a+o*i+e}function X_(i,t){const e=1-i;return e*e*t}function q_(i,t){return 2*(1-i)*i*t}function Y_(i,t){return i*i*t}function sr(i,t,e,n){return X_(i,t)+q_(i,e)+Y_(i,n)}function $_(i,t){const e=1-i;return e*e*e*t}function Z_(i,t){const e=1-i;return 3*e*e*i*t}function K_(i,t){return 3*(1-i)*i*i*t}function j_(i,t){return i*i*i*t}function or(i,t,e,n,s){return $_(i,t)+Z_(i,e)+K_(i,n)+j_(i,s)}class Em extends Bn{constructor(t=new tt,e=new tt,n=new tt,s=new tt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new tt){const n=e,s=this.v0,o=this.v1,r=this.v2,a=this.v3;return n.set(or(t,s.x,o.x,r.x,a.x),or(t,s.y,o.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class J_ extends Bn{constructor(t=new R,e=new R,n=new R,s=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new R){const n=e,s=this.v0,o=this.v1,r=this.v2,a=this.v3;return n.set(or(t,s.x,o.x,r.x,a.x),or(t,s.y,o.y,r.y,a.y),or(t,s.z,o.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Tm extends Bn{constructor(t=new tt,e=new tt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new tt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new tt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Q_ extends Bn{constructor(t=new R,e=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new R){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new R){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Am extends Bn{constructor(t=new tt,e=new tt,n=new tt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new tt){const n=e,s=this.v0,o=this.v1,r=this.v2;return n.set(sr(t,s.x,o.x,r.x),sr(t,s.y,o.y,r.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class tM extends Bn{constructor(t=new R,e=new R,n=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new R){const n=e,s=this.v0,o=this.v1,r=this.v2;return n.set(sr(t,s.x,o.x,r.x),sr(t,s.y,o.y,r.y),sr(t,s.z,o.z,r.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Rm extends Bn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new tt){const n=e,s=this.points,o=(s.length-1)*t,r=Math.floor(o),a=o-r,c=s[r===0?r:r-1],l=s[r],h=s[r>s.length-2?s.length-1:r+1],u=s[r>s.length-3?s.length-1:r+2];return n.set(G0(a,c.x,l.x,h.x,u.x),G0(a,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new tt().fromArray(s))}return this}}var Qh=Object.freeze({__proto__:null,ArcCurve:V_,CatmullRomCurve3:W_,CubicBezierCurve:Em,CubicBezierCurve3:J_,EllipseCurve:Xu,LineCurve:Tm,LineCurve3:Q_,QuadraticBezierCurve:Am,QuadraticBezierCurve3:tM,SplineCurve:Rm});class eM extends Bn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Qh[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let o=0;for(;o<s.length;){if(s[o]>=n){const r=s[o]-n,a=this.curves[o],c=a.getLength(),l=c===0?0:1-r/c;return a.getPointAt(l,e)}o++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,o=this.curves;s<o.length;s++){const r=o[s],a=r.isEllipseCurve?t*2:r.isLineCurve||r.isLineCurve3?1:r.isSplineCurve?t*r.points.length:t,c=r.getPoints(a);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Qh[s.type]().fromJSON(s))}return this}}class V0 extends eM{constructor(t){super(),this.type="Path",this.currentPoint=new tt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Tm(this.currentPoint.clone(),new tt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const o=new Am(this.currentPoint.clone(),new tt(t,e),new tt(n,s));return this.curves.push(o),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,o,r){const a=new Em(this.currentPoint.clone(),new tt(t,e),new tt(n,s),new tt(o,r));return this.curves.push(a),this.currentPoint.set(o,r),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Rm(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,o,r){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,s,o,r),this}absarc(t,e,n,s,o,r){return this.absellipse(t,e,n,n,s,o,r),this}ellipse(t,e,n,s,o,r,a,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,s,o,r,a,c),this}absellipse(t,e,n,s,o,r,a,c){const l=new Xu(t,e,n,s,o,r,a,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class di extends Fe{constructor(t=[new tt(0,-.5),new tt(.5,0),new tt(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Pe(s,0,Math.PI*2);const o=[],r=[],a=[],c=[],l=[],h=1/e,u=new R,f=new tt,d=new R,g=new R,v=new R;let m=0,p=0;for(let x=0;x<=t.length-1;x++)switch(x){case 0:m=t[x+1].x-t[x].x,p=t[x+1].y-t[x].y,d.x=p*1,d.y=-m,d.z=p*0,v.copy(d),d.normalize(),c.push(d.x,d.y,d.z);break;case t.length-1:c.push(v.x,v.y,v.z);break;default:m=t[x+1].x-t[x].x,p=t[x+1].y-t[x].y,d.x=p*1,d.y=-m,d.z=p*0,g.copy(d),d.x+=v.x,d.y+=v.y,d.z+=v.z,d.normalize(),c.push(d.x,d.y,d.z),v.copy(g)}for(let x=0;x<=e;x++){const y=n+x*h*s,w=Math.sin(y),b=Math.cos(y);for(let S=0;S<=t.length-1;S++){u.x=t[S].x*w,u.y=t[S].y,u.z=t[S].x*b,r.push(u.x,u.y,u.z),f.x=x/e,f.y=S/(t.length-1),a.push(f.x,f.y);const E=c[3*S+0]*w,T=c[3*S+1],_=c[3*S+0]*b;l.push(E,T,_)}}for(let x=0;x<e;x++)for(let y=0;y<t.length-1;y++){const w=y+x*t.length,b=w,S=w+t.length,E=w+t.length+1,T=w+1;o.push(b,S,T),o.push(E,T,S)}this.setIndex(o),this.setAttribute("position",new le(r,3)),this.setAttribute("uv",new le(a,2)),this.setAttribute("normal",new le(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new di(t.points,t.segments,t.phiStart,t.phiLength)}}class Y extends Fe{constructor(t=1,e=1,n=1,s=32,o=1,r=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:o,openEnded:r,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),o=Math.floor(o);const h=[],u=[],f=[],d=[];let g=0;const v=[],m=n/2;let p=0;x(),r===!1&&(t>0&&y(!0),e>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new le(u,3)),this.setAttribute("normal",new le(f,3)),this.setAttribute("uv",new le(d,2));function x(){const w=new R,b=new R;let S=0;const E=(e-t)/n;for(let T=0;T<=o;T++){const _=[],M=T/o,A=M*(e-t)+t;for(let P=0;P<=s;P++){const C=P/s,L=C*c+a,N=Math.sin(L),F=Math.cos(L);b.x=A*N,b.y=-M*n+m,b.z=A*F,u.push(b.x,b.y,b.z),w.set(N,E,F).normalize(),f.push(w.x,w.y,w.z),d.push(C,1-M),_.push(g++)}v.push(_)}for(let T=0;T<s;T++)for(let _=0;_<o;_++){const M=v[_][T],A=v[_+1][T],P=v[_+1][T+1],C=v[_][T+1];(t>0||_!==0)&&(h.push(M,A,C),S+=3),(e>0||_!==o-1)&&(h.push(A,P,C),S+=3)}l.addGroup(p,S,0),p+=S}function y(w){const b=g,S=new tt,E=new R;let T=0;const _=w===!0?t:e,M=w===!0?1:-1;for(let P=1;P<=s;P++)u.push(0,m*M,0),f.push(0,M,0),d.push(.5,.5),g++;const A=g;for(let P=0;P<=s;P++){const L=P/s*c+a,N=Math.cos(L),F=Math.sin(L);E.x=_*F,E.y=m*M,E.z=_*N,u.push(E.x,E.y,E.z),f.push(0,M,0),S.x=N*.5+.5,S.y=F*.5*M+.5,d.push(S.x,S.y),g++}for(let P=0;P<s;P++){const C=b+P,L=A+P;w===!0?h.push(L,L+1,C):h.push(L+1,L,C),T+=3}l.addGroup(p,T,w===!0?1:2),p+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Y(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Qt extends Y{constructor(t=1,e=1,n=32,s=1,o=!1,r=0,a=Math.PI*2){super(0,t,e,n,s,o,r,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:a}}static fromJSON(t){return new Qt(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class vc extends Fe{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const o=[],r=[];a(s),l(n),h(),this.setAttribute("position",new le(o,3)),this.setAttribute("normal",new le(o.slice(),3)),this.setAttribute("uv",new le(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(x){const y=new R,w=new R,b=new R;for(let S=0;S<e.length;S+=3)d(e[S+0],y),d(e[S+1],w),d(e[S+2],b),c(y,w,b,x)}function c(x,y,w,b){const S=b+1,E=[];for(let T=0;T<=S;T++){E[T]=[];const _=x.clone().lerp(w,T/S),M=y.clone().lerp(w,T/S),A=S-T;for(let P=0;P<=A;P++)P===0&&T===S?E[T][P]=_:E[T][P]=_.clone().lerp(M,P/A)}for(let T=0;T<S;T++)for(let _=0;_<2*(S-T)-1;_++){const M=Math.floor(_/2);_%2===0?(f(E[T][M+1]),f(E[T+1][M]),f(E[T][M])):(f(E[T][M+1]),f(E[T+1][M+1]),f(E[T+1][M]))}}function l(x){const y=new R;for(let w=0;w<o.length;w+=3)y.x=o[w+0],y.y=o[w+1],y.z=o[w+2],y.normalize().multiplyScalar(x),o[w+0]=y.x,o[w+1]=y.y,o[w+2]=y.z}function h(){const x=new R;for(let y=0;y<o.length;y+=3){x.x=o[y+0],x.y=o[y+1],x.z=o[y+2];const w=m(x)/2/Math.PI+.5,b=p(x)/Math.PI+.5;r.push(w,1-b)}g(),u()}function u(){for(let x=0;x<r.length;x+=6){const y=r[x+0],w=r[x+2],b=r[x+4],S=Math.max(y,w,b),E=Math.min(y,w,b);S>.9&&E<.1&&(y<.2&&(r[x+0]+=1),w<.2&&(r[x+2]+=1),b<.2&&(r[x+4]+=1))}}function f(x){o.push(x.x,x.y,x.z)}function d(x,y){const w=x*3;y.x=t[w+0],y.y=t[w+1],y.z=t[w+2]}function g(){const x=new R,y=new R,w=new R,b=new R,S=new tt,E=new tt,T=new tt;for(let _=0,M=0;_<o.length;_+=9,M+=6){x.set(o[_+0],o[_+1],o[_+2]),y.set(o[_+3],o[_+4],o[_+5]),w.set(o[_+6],o[_+7],o[_+8]),S.set(r[M+0],r[M+1]),E.set(r[M+2],r[M+3]),T.set(r[M+4],r[M+5]),b.copy(x).add(y).add(w).divideScalar(3);const A=m(b);v(S,M+0,x,A),v(E,M+2,y,A),v(T,M+4,w,A)}}function v(x,y,w,b){b<0&&x.x===1&&(r[y]=x.x-1),w.x===0&&w.z===0&&(r[y]=b/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new vc(t.vertices,t.indices,t.radius,t.details)}}class Cm extends V0{constructor(t){super(t),this.uuid=fs(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new V0().fromJSON(s))}return this}}const nM={triangulate:function(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let o=Pm(i,0,s,e,!0);const r=[];if(!o||o.next===o.prev)return r;let a,c,l,h,u,f,d;if(n&&(o=aM(i,t,o,e)),i.length>80*e){a=l=i[0],c=h=i[1];for(let g=e;g<s;g+=e)u=i[g],f=i[g+1],u<a&&(a=u),f<c&&(c=f),u>l&&(l=u),f>h&&(h=f);d=Math.max(l-a,h-c),d=d!==0?32767/d:0}return hr(o,r,e,a,c,d,0),r}};function Pm(i,t,e,n,s){let o,r;if(s===yM(i,t,e,n)>0)for(o=t;o<e;o+=n)r=W0(o,i[o],i[o+1],r);else for(o=e-n;o>=t;o-=n)r=W0(o,i[o],i[o+1],r);return r&&yc(r,r.next)&&(dr(r),r=r.next),r}function hs(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(yc(e,e.next)||Se(e.prev,e,e.next)===0)){if(dr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function hr(i,t,e,n,s,o,r){if(!i)return;!r&&o&&dM(i,n,s,o);let a=i,c,l;for(;i.prev!==i.next;){if(c=i.prev,l=i.next,o?sM(i,n,s,o):iM(i)){t.push(c.i/e|0),t.push(i.i/e|0),t.push(l.i/e|0),dr(i),i=l.next,a=l.next;continue}if(i=l,i===a){r?r===1?(i=oM(hs(i),t,e),hr(i,t,e,n,s,o,2)):r===2&&rM(i,t,e,n,s,o):hr(hs(i),t,e,n,s,o,1);break}}}function iM(i){const t=i.prev,e=i,n=i.next;if(Se(t,e,n)>=0)return!1;const s=t.x,o=e.x,r=n.x,a=t.y,c=e.y,l=n.y,h=s<o?s<r?s:r:o<r?o:r,u=a<c?a<l?a:l:c<l?c:l,f=s>o?s>r?s:r:o>r?o:r,d=a>c?a>l?a:l:c>l?c:l;let g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=f&&g.y>=u&&g.y<=d&&qs(s,a,o,c,r,l,g.x,g.y)&&Se(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function sM(i,t,e,n){const s=i.prev,o=i,r=i.next;if(Se(s,o,r)>=0)return!1;const a=s.x,c=o.x,l=r.x,h=s.y,u=o.y,f=r.y,d=a<c?a<l?a:l:c<l?c:l,g=h<u?h<f?h:f:u<f?u:f,v=a>c?a>l?a:l:c>l?c:l,m=h>u?h>f?h:f:u>f?u:f,p=tu(d,g,t,e,n),x=tu(v,m,t,e,n);let y=i.prevZ,w=i.nextZ;for(;y&&y.z>=p&&w&&w.z<=x;){if(y.x>=d&&y.x<=v&&y.y>=g&&y.y<=m&&y!==s&&y!==r&&qs(a,h,c,u,l,f,y.x,y.y)&&Se(y.prev,y,y.next)>=0||(y=y.prevZ,w.x>=d&&w.x<=v&&w.y>=g&&w.y<=m&&w!==s&&w!==r&&qs(a,h,c,u,l,f,w.x,w.y)&&Se(w.prev,w,w.next)>=0))return!1;w=w.nextZ}for(;y&&y.z>=p;){if(y.x>=d&&y.x<=v&&y.y>=g&&y.y<=m&&y!==s&&y!==r&&qs(a,h,c,u,l,f,y.x,y.y)&&Se(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;w&&w.z<=x;){if(w.x>=d&&w.x<=v&&w.y>=g&&w.y<=m&&w!==s&&w!==r&&qs(a,h,c,u,l,f,w.x,w.y)&&Se(w.prev,w,w.next)>=0)return!1;w=w.nextZ}return!0}function oM(i,t,e){let n=i;do{const s=n.prev,o=n.next.next;!yc(s,o)&&Im(s,n,n.next,o)&&ur(s,o)&&ur(o,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(o.i/e|0),dr(n),dr(n.next),n=i=o),n=n.next}while(n!==i);return hs(n)}function rM(i,t,e,n,s,o){let r=i;do{let a=r.next.next;for(;a!==r.prev;){if(r.i!==a.i&&mM(r,a)){let c=Dm(r,a);r=hs(r,r.next),c=hs(c,c.next),hr(r,t,e,n,s,o,0),hr(c,t,e,n,s,o,0);return}a=a.next}r=r.next}while(r!==i)}function aM(i,t,e,n){const s=[];let o,r,a,c,l;for(o=0,r=t.length;o<r;o++)a=t[o]*n,c=o<r-1?t[o+1]*n:i.length,l=Pm(i,a,c,n,!1),l===l.next&&(l.steiner=!0),s.push(pM(l));for(s.sort(cM),o=0;o<s.length;o++)e=lM(s[o],e);return e}function cM(i,t){return i.x-t.x}function lM(i,t){const e=hM(i,t);if(!e)return t;const n=Dm(e,i);return hs(n,n.next),hs(e,e.next)}function hM(i,t){let e=t,n=-1/0,s;const o=i.x,r=i.y;do{if(r<=e.y&&r>=e.next.y&&e.next.y!==e.y){const f=e.x+(r-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=o&&f>n&&(n=f,s=e.x<e.next.x?e:e.next,f===o))return s}e=e.next}while(e!==t);if(!s)return null;const a=s,c=s.x,l=s.y;let h=1/0,u;e=s;do o>=e.x&&e.x>=c&&o!==e.x&&qs(r<l?o:n,r,c,l,r<l?n:o,r,e.x,e.y)&&(u=Math.abs(r-e.y)/(o-e.x),ur(e,i)&&(u<h||u===h&&(e.x>s.x||e.x===s.x&&uM(s,e)))&&(s=e,h=u)),e=e.next;while(e!==a);return s}function uM(i,t){return Se(i.prev,i,t.prev)<0&&Se(t.next,i,i.next)<0}function dM(i,t,e,n){let s=i;do s.z===0&&(s.z=tu(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,fM(s)}function fM(i){let t,e,n,s,o,r,a,c,l=1;do{for(e=i,i=null,o=null,r=0;e;){for(r++,n=e,a=0,t=0;t<l&&(a++,n=n.nextZ,!!n);t++);for(c=l;a>0||c>0&&n;)a!==0&&(c===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,a--):(s=n,n=n.nextZ,c--),o?o.nextZ=s:i=s,s.prevZ=o,o=s;e=n}o.nextZ=null,l*=2}while(r>1);return i}function tu(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function pM(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function qs(i,t,e,n,s,o,r,a){return(s-r)*(t-a)>=(i-r)*(o-a)&&(i-r)*(n-a)>=(e-r)*(t-a)&&(e-r)*(o-a)>=(s-r)*(n-a)}function mM(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!gM(i,t)&&(ur(i,t)&&ur(t,i)&&vM(i,t)&&(Se(i.prev,i,t.prev)||Se(i,t.prev,t))||yc(i,t)&&Se(i.prev,i,i.next)>0&&Se(t.prev,t,t.next)>0)}function Se(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function yc(i,t){return i.x===t.x&&i.y===t.y}function Im(i,t,e,n){const s=ta(Se(i,t,e)),o=ta(Se(i,t,n)),r=ta(Se(e,n,i)),a=ta(Se(e,n,t));return!!(s!==o&&r!==a||s===0&&Qr(i,e,t)||o===0&&Qr(i,n,t)||r===0&&Qr(e,i,n)||a===0&&Qr(e,t,n))}function Qr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function ta(i){return i>0?1:i<0?-1:0}function gM(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Im(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function ur(i,t){return Se(i.prev,i,i.next)<0?Se(i,t,i.next)>=0&&Se(i,i.prev,t)>=0:Se(i,t,i.prev)<0||Se(i,i.next,t)<0}function vM(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,o=(i.y+t.y)/2;do e.y>o!=e.next.y>o&&e.next.y!==e.y&&s<(e.next.x-e.x)*(o-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Dm(i,t){const e=new eu(i.i,i.x,i.y),n=new eu(t.i,t.x,t.y),s=i.next,o=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,o.next=n,n.prev=o,n}function W0(i,t,e,n){const s=new eu(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function dr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function eu(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function yM(i,t,e,n){let s=0;for(let o=t,r=e-n;o<e;o+=n)s+=(i[r]-i[o])*(i[o+1]+i[r+1]),r=o;return s}class rr{static area(t){const e=t.length;let n=0;for(let s=e-1,o=0;o<e;s=o++)n+=t[s].x*t[o].y-t[o].x*t[s].y;return n*.5}static isClockWise(t){return rr.area(t)<0}static triangulateShape(t,e){const n=[],s=[],o=[];X0(t),q0(n,t);let r=t.length;e.forEach(X0);for(let c=0;c<e.length;c++)s.push(r),r+=e[c].length,q0(n,e[c]);const a=nM.triangulate(n,s);for(let c=0;c<a.length;c+=3)o.push(a.slice(c,c+3));return o}}function X0(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function q0(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class Yu extends Fe{constructor(t=new Cm([new tt(.5,.5),new tt(-.5,.5),new tt(-.5,-.5),new tt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],o=[];for(let a=0,c=t.length;a<c;a++){const l=t[a];r(l)}this.setAttribute("position",new le(s,3)),this.setAttribute("uv",new le(o,2)),this.computeVertexNormals();function r(a){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:d-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,x=e.UVGenerator!==void 0?e.UVGenerator:wM;let y,w=!1,b,S,E,T;p&&(y=p.getSpacedPoints(h),w=!0,f=!1,b=p.computeFrenetFrames(h,!1),S=new R,E=new R,T=new R),f||(m=0,d=0,g=0,v=0);const _=a.extractPoints(l);let M=_.shape;const A=_.holes;if(!rr.isClockWise(M)){M=M.reverse();for(let nt=0,ht=A.length;nt<ht;nt++){const B=A[nt];rr.isClockWise(B)&&(A[nt]=B.reverse())}}const C=rr.triangulateShape(M,A),L=M;for(let nt=0,ht=A.length;nt<ht;nt++){const B=A[nt];M=M.concat(B)}function N(nt,ht,B){return ht||console.error("THREE.ExtrudeGeometry: vec does not exist"),nt.clone().addScaledVector(ht,B)}const F=M.length,H=C.length;function G(nt,ht,B){let ft,st,yt;const wt=nt.x-ht.x,Gt=nt.y-ht.y,Pt=B.x-nt.x,z=B.y-nt.y,U=wt*wt+Gt*Gt,Z=wt*z-Gt*Pt;if(Math.abs(Z)>Number.EPSILON){const at=Math.sqrt(U),dt=Math.sqrt(Pt*Pt+z*z),ct=ht.x-Gt/at,Ft=ht.y+wt/at,Et=B.x-z/dt,It=B.y+Pt/dt,se=((Et-ct)*z-(It-Ft)*Pt)/(wt*z-Gt*Pt);ft=ct+wt*se-nt.x,st=Ft+Gt*se-nt.y;const vt=ft*ft+st*st;if(vt<=2)return new tt(ft,st);yt=Math.sqrt(vt/2)}else{let at=!1;wt>Number.EPSILON?Pt>Number.EPSILON&&(at=!0):wt<-Number.EPSILON?Pt<-Number.EPSILON&&(at=!0):Math.sign(Gt)===Math.sign(z)&&(at=!0),at?(ft=-Gt,st=wt,yt=Math.sqrt(U)):(ft=wt,st=Gt,yt=Math.sqrt(U/2))}return new tt(ft/yt,st/yt)}const V=[];for(let nt=0,ht=L.length,B=ht-1,ft=nt+1;nt<ht;nt++,B++,ft++)B===ht&&(B=0),ft===ht&&(ft=0),V[nt]=G(L[nt],L[B],L[ft]);const et=[];let lt,bt=V.concat();for(let nt=0,ht=A.length;nt<ht;nt++){const B=A[nt];lt=[];for(let ft=0,st=B.length,yt=st-1,wt=ft+1;ft<st;ft++,yt++,wt++)yt===st&&(yt=0),wt===st&&(wt=0),lt[ft]=G(B[ft],B[yt],B[wt]);et.push(lt),bt=bt.concat(lt)}for(let nt=0;nt<m;nt++){const ht=nt/m,B=d*Math.cos(ht*Math.PI/2),ft=g*Math.sin(ht*Math.PI/2)+v;for(let st=0,yt=L.length;st<yt;st++){const wt=N(L[st],V[st],ft);$(wt.x,wt.y,-B)}for(let st=0,yt=A.length;st<yt;st++){const wt=A[st];lt=et[st];for(let Gt=0,Pt=wt.length;Gt<Pt;Gt++){const z=N(wt[Gt],lt[Gt],ft);$(z.x,z.y,-B)}}}const Dt=g+v;for(let nt=0;nt<F;nt++){const ht=f?N(M[nt],bt[nt],Dt):M[nt];w?(E.copy(b.normals[0]).multiplyScalar(ht.x),S.copy(b.binormals[0]).multiplyScalar(ht.y),T.copy(y[0]).add(E).add(S),$(T.x,T.y,T.z)):$(ht.x,ht.y,0)}for(let nt=1;nt<=h;nt++)for(let ht=0;ht<F;ht++){const B=f?N(M[ht],bt[ht],Dt):M[ht];w?(E.copy(b.normals[nt]).multiplyScalar(B.x),S.copy(b.binormals[nt]).multiplyScalar(B.y),T.copy(y[nt]).add(E).add(S),$(T.x,T.y,T.z)):$(B.x,B.y,u/h*nt)}for(let nt=m-1;nt>=0;nt--){const ht=nt/m,B=d*Math.cos(ht*Math.PI/2),ft=g*Math.sin(ht*Math.PI/2)+v;for(let st=0,yt=L.length;st<yt;st++){const wt=N(L[st],V[st],ft);$(wt.x,wt.y,u+B)}for(let st=0,yt=A.length;st<yt;st++){const wt=A[st];lt=et[st];for(let Gt=0,Pt=wt.length;Gt<Pt;Gt++){const z=N(wt[Gt],lt[Gt],ft);w?$(z.x,z.y+y[h-1].y,y[h-1].x+B):$(z.x,z.y,u+B)}}}J(),rt();function J(){const nt=s.length/3;if(f){let ht=0,B=F*ht;for(let ft=0;ft<H;ft++){const st=C[ft];ot(st[2]+B,st[1]+B,st[0]+B)}ht=h+m*2,B=F*ht;for(let ft=0;ft<H;ft++){const st=C[ft];ot(st[0]+B,st[1]+B,st[2]+B)}}else{for(let ht=0;ht<H;ht++){const B=C[ht];ot(B[2],B[1],B[0])}for(let ht=0;ht<H;ht++){const B=C[ht];ot(B[0]+F*h,B[1]+F*h,B[2]+F*h)}}n.addGroup(nt,s.length/3-nt,0)}function rt(){const nt=s.length/3;let ht=0;K(L,ht),ht+=L.length;for(let B=0,ft=A.length;B<ft;B++){const st=A[B];K(st,ht),ht+=st.length}n.addGroup(nt,s.length/3-nt,1)}function K(nt,ht){let B=nt.length;for(;--B>=0;){const ft=B;let st=B-1;st<0&&(st=nt.length-1);for(let yt=0,wt=h+m*2;yt<wt;yt++){const Gt=F*yt,Pt=F*(yt+1),z=ht+ft+Gt,U=ht+st+Gt,Z=ht+st+Pt,at=ht+ft+Pt;mt(z,U,Z,at)}}}function $(nt,ht,B){c.push(nt),c.push(ht),c.push(B)}function ot(nt,ht,B){Mt(nt),Mt(ht),Mt(B);const ft=s.length/3,st=x.generateTopUV(n,s,ft-3,ft-2,ft-1);Ut(st[0]),Ut(st[1]),Ut(st[2])}function mt(nt,ht,B,ft){Mt(nt),Mt(ht),Mt(ft),Mt(ht),Mt(B),Mt(ft);const st=s.length/3,yt=x.generateSideWallUV(n,s,st-6,st-3,st-2,st-1);Ut(yt[0]),Ut(yt[1]),Ut(yt[3]),Ut(yt[1]),Ut(yt[2]),Ut(yt[3])}function Mt(nt){s.push(c[nt*3+0]),s.push(c[nt*3+1]),s.push(c[nt*3+2])}function Ut(nt){o.push(nt.x),o.push(nt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return xM(e,n,t)}static fromJSON(t,e){const n=[];for(let o=0,r=t.shapes.length;o<r;o++){const a=e[t.shapes[o]];n.push(a)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Qh[s.type]().fromJSON(s)),new Yu(n,t.options)}}const wM={generateTopUV:function(i,t,e,n,s){const o=t[e*3],r=t[e*3+1],a=t[n*3],c=t[n*3+1],l=t[s*3],h=t[s*3+1];return[new tt(o,r),new tt(a,c),new tt(l,h)]},generateSideWallUV:function(i,t,e,n,s,o){const r=t[e*3],a=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],u=t[n*3+2],f=t[s*3],d=t[s*3+1],g=t[s*3+2],v=t[o*3],m=t[o*3+1],p=t[o*3+2];return Math.abs(a-h)<Math.abs(r-l)?[new tt(r,1-c),new tt(l,1-u),new tt(f,1-g),new tt(v,1-p)]:[new tt(a,1-c),new tt(h,1-u),new tt(d,1-g),new tt(m,1-p)]}};function xM(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const o=i[n];e.shapes.push(o.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class ie extends vc{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],o=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,o,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ie(t.radius,t.detail)}}class Ye extends vc{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ye(t.radius,t.detail)}}class yr extends Fe{constructor(t=1,e=32,n=16,s=0,o=Math.PI*2,r=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:o,thetaStart:r,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(r+a,Math.PI);let l=0;const h=[],u=new R,f=new R,d=[],g=[],v=[],m=[];for(let p=0;p<=n;p++){const x=[],y=p/n;let w=0;p===0&&r===0?w=.5/e:p===n&&c===Math.PI&&(w=-.5/e);for(let b=0;b<=e;b++){const S=b/e;u.x=-t*Math.cos(s+S*o)*Math.sin(r+y*a),u.y=t*Math.cos(r+y*a),u.z=t*Math.sin(s+S*o)*Math.sin(r+y*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),v.push(f.x,f.y,f.z),m.push(S+w,1-y),x.push(l++)}h.push(x)}for(let p=0;p<n;p++)for(let x=0;x<e;x++){const y=h[p][x+1],w=h[p][x],b=h[p+1][x],S=h[p+1][x+1];(p!==0||r>0)&&d.push(y,w,S),(p!==n-1||c<Math.PI)&&d.push(w,b,S)}this.setIndex(d),this.setAttribute("position",new le(g,3)),this.setAttribute("normal",new le(v,3)),this.setAttribute("uv",new le(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new yr(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class ps extends Fe{constructor(t=1,e=.4,n=12,s=48,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:o},n=Math.floor(n),s=Math.floor(s);const r=[],a=[],c=[],l=[],h=new R,u=new R,f=new R;for(let d=0;d<=n;d++)for(let g=0;g<=s;g++){const v=g/s*o,m=d/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(v),u.y=(t+e*Math.cos(m))*Math.sin(v),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),f.subVectors(u,h).normalize(),c.push(f.x,f.y,f.z),l.push(g/s),l.push(d/n)}for(let d=1;d<=n;d++)for(let g=1;g<=s;g++){const v=(s+1)*d+g-1,m=(s+1)*(d-1)+g-1,p=(s+1)*(d-1)+g,x=(s+1)*d+g;r.push(v,m,x),r.push(m,p,x)}this.setIndex(r),this.setAttribute("position",new le(a,3)),this.setAttribute("normal",new le(c,3)),this.setAttribute("uv",new le(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ps(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class _M extends be{static get type(){return"RawShaderMaterial"}constructor(t){super(t),this.isRawShaderMaterial=!0}}class MM extends ki{static get type(){return"MeshNormalMaterial"}constructor(t){super(),this.isMeshNormalMaterial=!0,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ou,this.normalScale=new tt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}}class Re extends ki{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Vt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Vt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ou,this.normalScale=new tt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new On,this.combine=Pu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class wc extends Te{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Vt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class bM extends wc{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Te.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Vt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const al=new oe,Y0=new R,$0=new R;class $u{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new tt(512,512),this.map=null,this.mapPass=null,this.matrix=new oe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new zu,this._frameExtents=new tt(1,1),this._viewportCount=1,this._viewports=[new de(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Y0.setFromMatrixPosition(t.matrixWorld),e.position.copy(Y0),$0.setFromMatrixPosition(t.target.matrixWorld),e.lookAt($0),e.updateMatrixWorld(),al.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(al),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(al)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class SM extends $u{constructor(){super(new on(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){const e=this.camera,n=lo*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height,o=t.distance||e.far;(n!==e.fov||s!==e.aspect||o!==e.far)&&(e.fov=n,e.aspect=s,e.far=o,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class EM extends wc{constructor(t,e,n=0,s=Math.PI/3,o=0,r=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Te.DEFAULT_UP),this.updateMatrix(),this.target=new Te,this.distance=n,this.angle=s,this.penumbra=o,this.decay=r,this.map=null,this.shadow=new SM}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const Z0=new oe,Co=new R,cl=new R;class TM extends $u{constructor(){super(new on(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new tt(4,2),this._viewportCount=6,this._viewports=[new de(2,1,1,1),new de(0,1,1,1),new de(3,1,1,1),new de(1,1,1,1),new de(3,0,1,1),new de(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,o=t.distance||n.far;o!==n.far&&(n.far=o,n.updateProjectionMatrix()),Co.setFromMatrixPosition(t.matrixWorld),n.position.copy(Co),cl.copy(n.position),cl.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(cl),n.updateMatrixWorld(),s.makeTranslation(-Co.x,-Co.y,-Co.z),Z0.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Z0)}}class ms extends wc{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new TM}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class AM extends $u{constructor(){super(new Bu(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class K0 extends wc{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Te.DEFAULT_UP),this.updateMatrix(),this.target=new Te,this.shadow=new AM}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class RM{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=j0(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=j0();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function j0(){return performance.now()}const J0=new oe;class CM{constructor(t,e,n=0,s=1/0){this.ray=new gr(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new fc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return J0.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(J0),this}intersectObject(t,e=!0,n=[]){return nu(t,this,n,e),n.sort(Q0),n}intersectObjects(t,e=!0,n=[]){for(let s=0,o=t.length;s<o;s++)nu(t[s],this,n,e);return n.sort(Q0),n}}function Q0(i,t){return i.distance-t.distance}function nu(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const o=i.children;for(let r=0,a=o.length;r<a;r++)nu(o[r],t,e,!0)}}const tf=new R,ea=new R;class Zu{constructor(t=new R,e=new R){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){tf.subVectors(t,this.start),ea.subVectors(this.end,this.start);const n=ea.dot(ea);let o=ea.dot(tf)/n;return e&&(o=Pe(o,0,1)),o}closestPointToPoint(t,e,n){const s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}class PM extends Wu{constructor(t=1){const e=[0,0,0,t,0,0,0,0,0,0,t,0,0,0,0,0,0,t],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new Fe;s.setAttribute("position",new le(e,3)),s.setAttribute("color",new le(n,3));const o=new bm({vertexColors:!0,toneMapped:!1});super(s,o),this.type="AxesHelper"}setColors(t,e,n){const s=new Vt,o=this.geometry.attributes.color.array;return s.set(t),s.toArray(o,0),s.toArray(o,3),s.set(e),s.toArray(o,6),s.toArray(o,9),s.set(n),s.toArray(o,12),s.toArray(o,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Cu}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Cu);class IM{renderer;scene;camera;onResize=null;canvas;handleResize=()=>this.resize();constructor(t){this.canvas=t,this.renderer=new z_({canvas:t,antialias:!1,powerPreference:"high-performance",stencil:!1}),this.renderer.setClearColor(657935,1),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Vp,this.renderer.shadowMap.autoUpdate=!1,this.renderer.info.autoReset=!1,this.scene=new B_,this.camera=new on(70,1,.1,500),this.resize(),window.addEventListener("resize",this.handleResize),window.addEventListener("orientationchange",this.handleResize)}resize(){const t=this.canvas.clientWidth||window.innerWidth,e=this.canvas.clientHeight||window.innerHeight;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(t,e,!1),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.onResize?.()}render(){this.renderer.info.reset(),this.renderer.shadowMap.needsUpdate=!0,this.renderer.render(this.scene,this.camera)}dispose(){window.removeEventListener("resize",this.handleResize),window.removeEventListener("orientationchange",this.handleResize),this.renderer.dispose()}}const DM=1;class LM{subscribers=new Set;handle=0;last=0;elapsed=0;running=!1;minInterval=0;add(t){return this.subscribers.add(t),()=>this.subscribers.delete(t)}setFpsCap(t){this.minInterval=t&&t>0?1e3/t:0}start(){if(this.running)return;this.running=!0,this.last=performance.now();const t=e=>{if(this.handle=requestAnimationFrame(t),this.minInterval>0&&e-this.last<this.minInterval-DM)return;const n=Math.min((e-this.last)/1e3,.1);this.last=e,this.elapsed+=n;for(const s of this.subscribers)s(n,this.elapsed)};this.handle=requestAnimationFrame(t)}stop(){this.running&&(cancelAnimationFrame(this.handle),this.running=!1)}}const NM={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class wr{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const FM=new Bu(-1,1,1,-1,0,1);class UM extends Fe{constructor(){super(),this.setAttribute("position",new le([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new le([0,2,0,0,2,0],2))}}const OM=new UM;class zi{constructor(t){this._mesh=new $t(OM,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,FM)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class Lm extends wr{constructor(t,e){super(),this.textureID=e!==void 0?e:"tDiffuse",t instanceof be?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=pc.clone(t.uniforms),this.material=new be({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new zi(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class ef extends wr{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const s=t.getContext(),o=t.state;o.buffers.color.setMask(!1),o.buffers.depth.setMask(!1),o.buffers.color.setLocked(!0),o.buffers.depth.setLocked(!0);let r,a;this.inverse?(r=0,a=1):(r=1,a=0),o.buffers.stencil.setTest(!0),o.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),o.buffers.stencil.setFunc(s.ALWAYS,r,4294967295),o.buffers.stencil.setClear(a),o.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),o.buffers.color.setLocked(!1),o.buffers.depth.setLocked(!1),o.buffers.color.setMask(!0),o.buffers.depth.setMask(!0),o.buffers.stencil.setLocked(!1),o.buffers.stencil.setFunc(s.EQUAL,1,4294967295),o.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),o.buffers.stencil.setLocked(!0)}}class kM extends wr{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class zM{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new tt);this._width=n.width,this._height=n.height,e=new Sn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Oi}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Lm(NM),this.copyPass.material.blending=Ln,this.clock=new RM}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let s=0,o=this.passes.length;s<o;s++){const r=this.passes[s];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),r.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),r.needsSwap){if(n){const a=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),c.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}ef!==void 0&&(r instanceof ef?n=!0:r instanceof kM&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new tt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let o=0;o<this.passes.length;o++)this.passes[o].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}const BM={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class HM extends wr{constructor(){super();const t=BM;this.uniforms=pc.clone(t.uniforms),this.material=new _M({name:t.name,uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.fsQuad=new zi(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},ce.getTransfer(this._outputColorSpace)===ge&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Wp?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Xp?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===qp?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Yp?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===$p?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Zp&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}function Nm(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),o={},r={},a=i[0].morphTargetsRelative,c=new Fe;let l=0;for(let h=0;h<i.length;++h){const u=i[h];let f=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in u.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;o[d]===void 0&&(o[d]=[]),o[d].push(u.attributes[d]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in u.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.morphAttributes[d])}if(t){let d;if(e)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,d,h),l+=d}}if(e){let h=0;const u=[];for(let f=0;f<i.length;++f){const d=i[f].index;for(let g=0;g<d.count;++g)u.push(d.getX(g)+h);h+=i[f].attributes.position.count}c.setIndex(u)}for(const h in o){const u=nf(o[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in r){const u=r[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let f=0;f<u;++f){const d=[];for(let v=0;v<r[h].length;++v)d.push(r[h][v][f]);const g=nf(d);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function nf(i){let t,e,n,s=-1,o=0;for(let l=0;l<i.length;++l){const h=i[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;o+=h.count*e}const r=new t(o),a=new ze(r,e,n);let c=0;for(let l=0;l<i.length;++l){const h=i[l];if(h.isInterleavedBufferAttribute){const u=c/e;for(let f=0,d=h.count;f<d;f++)for(let g=0;g<e;g++){const v=h.getComponent(f,g);a.setComponent(f+u,g,v)}}else r.set(h.array,c);c+=h.count*e}return s!==void 0&&(a.gpuType=s),a}function Ku(i,t=1e-4){t=Math.max(t,Number.EPSILON);const e={},n=i.getIndex(),s=i.getAttribute("position"),o=n?n.count:s.count;let r=0;const a=Object.keys(i.attributes),c={},l={},h=[],u=["getX","getY","getZ","getW"],f=["setX","setY","setZ","setW"];for(let x=0,y=a.length;x<y;x++){const w=a[x],b=i.attributes[w];c[w]=new b.constructor(new b.array.constructor(b.count*b.itemSize),b.itemSize,b.normalized);const S=i.morphAttributes[w];S&&(l[w]||(l[w]=[]),S.forEach((E,T)=>{const _=new E.array.constructor(E.count*E.itemSize);l[w][T]=new E.constructor(_,E.itemSize,E.normalized)}))}const d=t*.5,g=Math.log10(1/t),v=Math.pow(10,g),m=d*v;for(let x=0;x<o;x++){const y=n?n.getX(x):x;let w="";for(let b=0,S=a.length;b<S;b++){const E=a[b],T=i.getAttribute(E),_=T.itemSize;for(let M=0;M<_;M++)w+=`${~~(T[u[M]](y)*v+m)},`}if(w in e)h.push(e[w]);else{for(let b=0,S=a.length;b<S;b++){const E=a[b],T=i.getAttribute(E),_=i.morphAttributes[E],M=T.itemSize,A=c[E],P=l[E];for(let C=0;C<M;C++){const L=u[C],N=f[C];if(A[N](r,T[L](y)),_)for(let F=0,H=_.length;F<H;F++)P[F][N](r,_[F][L](y))}}e[w]=r,h.push(r),r++}}const p=i.clone();for(const x in i.attributes){const y=c[x];if(p.setAttribute(x,new y.constructor(y.array.slice(0,r*y.itemSize),y.itemSize,y.normalized)),x in l)for(let w=0;w<l[x].length;w++){const b=l[x][w];p.morphAttributes[x][w]=new b.constructor(b.array.slice(0,r*b.itemSize),b.itemSize,b.normalized)}}return p.setIndex(h),p}const GM=new Set(["small-grass-clump","large-grass-clump","daisy","bluebell","poppy","lavender","wildflower","thistle"]),VM={reeds:1,"small-grass-clump":.95,"large-grass-clump":.9,cowparsley:.85,wildflower:.8,poppy:.8,bluebell:.8,daisy:.75,lavender:.7,foxglove:.5,fern:.6,nettle:.6,"small-tree":.6,tree:.55,bush:.5,elder:.65,hazel:.6,gorse:.25,"small-birch":.8,birch:.75,"small-oak":.5,oak:.35,"small-rowan":.7,rowan:.6,"small-spruce":.4,spruce:.3,bramble:.4,thistle:.35,sunflower:.2,banner:.35},D={BARK:4602672,BARK_PALE:5720636,LEAF:5201977,LEAF_DARK:4017196,LEAF_DRY:7039548,GRASS:6056762,GRASS_DRY:8025156,STONE:9869984,STONE_DARK:7699072,STONE_PALE:11449014,EARTH:4998454,TIMBER:9073506,TIMBER_DARK:7035469,TIMBER_PALE:11047798,IRON:5922659,IRON_DARK:4146248,RUST:8014384,BRONZE:9072696,PATINA:6058080,WATER:2899782,LAMPLIGHT:16769192,CLOTH:9274994,SKIN:11047546,INK:2827808,HIDE:7165505,HIDE_DARK:4273193,HIDE_PALE:10653813,WOOL:12433060,HOG:11042938,FOWL:10260343,COMB:10240564,MARKER_YELLOW:13213770,COW_BLACK:2367775};function I(i,t){const e=Math.min(255,Math.round((i>>16&255)*t)),n=Math.min(255,Math.round((i>>8&255)*t)),s=Math.min(255,Math.round((i&255)*t));return e<<16|n<<8|s}const ka="wear",za="wearTint";function WM(i){const t=i.onBeforeCompile;i.onBeforeCompile=(e,n)=>{t?.call(i,e,n),e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
        attribute float ${ka};
        attribute vec3 ${za};
        varying float vWear;
        varying vec3 vWearTint;
        varying vec3 vWearPos;
        `).replace("#include <begin_vertex>",`#include <begin_vertex>
        vWear = ${ka};
        vWearTint = ${za};
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
        `)},i.defaultAttributeValues={...i.defaultAttributeValues,[ka]:[0],[za]:[0,0,0]},i.customProgramCacheKey=()=>"sway-wear",i.needsUpdate=!0}function Fm(i,t,e){const n=o=>.2126*(o>>16&255)+.7152*(o>>8&255)+.0722*(o&255),s=Math.min(Math.max(n(t)/Math.max(n(e),1),.55),1.3);return I(i,s)}function XM(i,t){return(e,n)=>{let s=0;for(const[o,r]of i){const a=Math.hypot(e-o,n-r);a<t&&(s=Math.max(s,1-a/t))}return s}}const uo="sway",iu=new Re({vertexColors:!0,flatShading:!0});function pt(i){const t=i.map(n=>{const s=n.geometry,o=s.index===null?s:s.toNonIndexed();o!==s&&s.dispose(),o.deleteAttribute("uv");const r=o.getAttribute("position"),a=r.count,c=new Float32Array(a*3),l=new Vt;if(typeof n.color=="function")for(let d=0;d<a;d+=3){const g=(r.getX(d)+r.getX(d+1)+r.getX(d+2))/3,v=(r.getY(d)+r.getY(d+1)+r.getY(d+2))/3,m=(r.getZ(d)+r.getZ(d+1)+r.getZ(d+2))/3;l.set(n.color(g,v,m)),l.toArray(c,d*3),l.toArray(c,(d+1)*3),l.toArray(c,(d+2)*3)}else{l.set(n.color);for(let d=0;d<a;d++)l.toArray(c,d*3)}o.setAttribute("color",new ze(c,3));const h=new Float32Array(a);if(typeof n.sway=="function")for(let d=0;d<a;d++)h[d]=Ko(n.sway(r.getX(d),r.getY(d),r.getZ(d)));else n.sway&&h.fill(Ko(n.sway));o.setAttribute(uo,new ze(h,1));const u=new Float32Array(a);if(typeof n.wear=="function")for(let d=0;d<a;d++)u[d]=Ko(n.wear(r.getX(d),r.getY(d),r.getZ(d)));else n.wear&&u.fill(Ko(n.wear));o.setAttribute(ka,new ze(u,1));const f=new Float32Array(a*3);if(n.wearTint!==void 0){l.set(n.wearTint);for(let d=0;d<a;d++)l.toArray(f,d*3)}return o.setAttribute(za,new ze(f,3)),o.getAttribute("normal")||o.computeVertexNormals(),o}),e=Nm(t,!1);for(const n of t)n.dispose();if(!e)throw new Error("assemble: geometries did not share an attribute set");return e}function xt(i,t,e){const n=VM[t]??0,s=i.getAttribute(uo);if(s&&n!==1){const r=s.array;for(let a=0;a<r.length;a++)r[a]*=n;s.needsUpdate=!0}const o=new $t(i,iu);return o.name=t,o.userData.swayPhase=e,GM.has(t)&&(o.userData.clutter=!0),o.customDepthMaterial=Um,o}function Ie(i,t,e=1.6){return(n,s)=>{const o=Ko((s-i)/Math.max(t-i,1e-6));return(o*o*(3-2*o))**e}}function Ko(i){return i>0?i<1?i:1:0}const Ya=256,qM=140,YM=.16,$M=.05,Bi=new Vu(new Uint8Array(Ya),Ya,1,uc,bn);Bi.minFilter=He;Bi.magFilter=He;Bi.wrapS=ni;Bi.wrapT=ni;Bi.needsUpdate=!0;const oi={gustField:{value:Bi},windDir:{value:new tt(1,0)},windLagScale:{value:0},windHalfSpan:{value:1},swayTime:{value:0},swayAmount:{value:1}},Um=new Mm({depthPacking:rm});let sf=!1;function ZM(){if(sf)return;sf=!0,su=t=>{Object.assign(t.uniforms,oi),t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
        attribute float ${uo};
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
          float weight = ${uo} * swayAmount;
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
            transformed += windObj * (push * lean * ${YM.toFixed(3)})
                         + crossObj * (push * flutter * ${$M.toFixed(3)});
          }
        }
        `)},ou(iu),ou(Um),WM(iu)}let su=null;function ou(i){su&&(i.onBeforeCompile=su,i.defaultAttributeValues={...i.defaultAttributeValues,[uo]:[0]},i.customProgramCacheKey=()=>"sway",i.needsUpdate=!0)}const KM=Bi.image.data;function jM(i,t){const{windDirection:e,frontSpeed:n,gustRate:s}=i.settings;oi.windDir.value.set(Math.cos(e),Math.sin(e));const o=s/Math.max(n,.5),r=qM*o;oi.windLagScale.value=o,oi.windHalfSpan.value=r,oi.swayTime.value=t;const a=i.phase;for(let c=0;c<Ya;c++){const l=c/(Ya-1),h=a+(l-.5)*2*r;KM[c]=Math.round(i.fieldAt(h)*255)}Bi.needsUpdate=!0}class JM extends wr{pixelSize;normalEdgeStrength=.3;depthEdgeStrength=.4;time=0;effects=[];normalMaterial=new MM;scene;camera;resolution=new tt;renderResolution=new tt;colourTarget;depthTexture;normalTarget;ping;edgeMaterial;blitMaterial;fsQuad;constructor(t,e,n){super(),this.pixelSize=t,this.scene=e,this.camera=n;const s=()=>{const o=new Sn;return o.texture.minFilter=Ge,o.texture.magFilter=Ge,o.texture.type=Oi,o};this.colourTarget=s(),this.depthTexture=new Gu(1,1),this.colourTarget.depthTexture=this.depthTexture,this.normalTarget=s(),this.ping=[s(),s()],this.edgeMaterial=QM(),this.blitMaterial=tb(),this.fsQuad=new zi(this.edgeMaterial)}setSize(t,e){this.resolution.set(t,e),this.renderResolution.set(t/this.pixelSize|0,e/this.pixelSize|0);const{x:n,y:s}=this.renderResolution;this.colourTarget.setSize(n,s),this.normalTarget.setSize(n,s);for(const o of this.ping)o.setSize(n,s);for(const o of this.effects)o.setSize(n,s);this.edgeMaterial.uniforms.resolution.value.set(n,s,1/n,1/s)}setPixelSize(t){this.pixelSize=t,this.setSize(this.resolution.x,this.resolution.y)}render(t,e){t.setRenderTarget(this.colourTarget),t.render(this.scene,this.camera);const n=this.scene.overrideMaterial;t.setRenderTarget(this.normalTarget),this.scene.overrideMaterial=this.normalMaterial,t.render(this.scene,this.camera),this.scene.overrideMaterial=n;let s=this.colourTarget.texture,o=0;if(this.normalEdgeStrength>0||this.depthEdgeStrength>0){const r=this.edgeMaterial.uniforms;r.tDiffuse.value=s,r.tDepth.value=this.depthTexture,r.tNormal.value=this.normalTarget.texture,r.normalEdgeStrength.value=this.normalEdgeStrength,r.depthEdgeStrength.value=this.depthEdgeStrength,this.fsQuad.material=this.edgeMaterial,t.setRenderTarget(this.ping[0]),this.fsQuad.render(t),s=this.ping[0].texture,o=1}for(const r of this.effects){if(!r.enabled)continue;const a=this.ping[o];r.render(t,{colour:s,depth:this.depthTexture,normal:this.normalTarget.texture,write:a,camera:this.camera,size:this.renderResolution,scene:this.scene,time:this.time}),s=a.texture,o=1-o}this.blitMaterial.uniforms.tDiffuse.value=s,this.fsQuad.material=this.blitMaterial,this.renderToScreen?t.setRenderTarget(null):(t.setRenderTarget(e),this.clear&&t.clear()),this.fsQuad.render(t)}dispose(){this.colourTarget.dispose(),this.normalTarget.dispose();for(const t of this.ping)t.dispose();for(const t of this.effects)t.dispose();this.normalMaterial.dispose(),this.edgeMaterial.dispose(),this.blitMaterial.dispose(),this.fsQuad.dispose()}}function QM(){return new be({uniforms:{tDiffuse:{value:null},tDepth:{value:null},tNormal:{value:null},resolution:{value:new de(1,1,1,1)},normalEdgeStrength:{value:0},depthEdgeStrength:{value:0}},vertexShader:`
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
    `})}function tb(){return new be({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
    `})}class eb{enabled=!0;strength=1;radius=.8;aoTarget;blurTarget;aoMaterial;blurMaterial;compositeMaterial;quad;fogNear=25;fogFar=140;constructor(){const t=()=>{const e=new Sn;return e.texture.minFilter=Ge,e.texture.magFilter=Ge,e};this.aoTarget=t(),this.blurTarget=t(),this.aoMaterial=nb(),this.blurMaterial=ib(),this.compositeMaterial=sb(),this.quad=new zi(this.aoMaterial)}setFog(t,e){this.fogNear=t,this.fogFar=e}setSize(t,e){this.aoTarget.setSize(t,e),this.blurTarget.setSize(t,e)}render(t,e){const{camera:n}=e,s=this.aoMaterial.uniforms;s.tDepth.value=e.depth,s.tNormal.value=e.normal,s.uProjInverse.value=n.projectionMatrixInverse,s.uProjScale.value=n.projectionMatrix.elements[5],s.uRadius.value=this.radius,s.uResolution.value.set(e.size.x,e.size.y,1/e.size.x,1/e.size.y),t.setRenderTarget(this.aoTarget),this.quad.material=this.aoMaterial,this.quad.render(t);const o=this.blurMaterial.uniforms;o.tDepth.value=e.depth,o.uNear.value=n.near,o.uFar.value=n.far,o.uTexel.value.set(1/e.size.x,1/e.size.y),this.quad.material=this.blurMaterial,o.tAO.value=this.aoTarget.texture,t.setRenderTarget(this.blurTarget),this.quad.render(t),o.tAO.value=this.blurTarget.texture,t.setRenderTarget(this.aoTarget),this.quad.render(t);const r=this.compositeMaterial.uniforms;r.tDiffuse.value=e.colour,r.tAO.value=this.aoTarget.texture,r.tDepth.value=e.depth,r.uNear.value=n.near,r.uFar.value=n.far,r.uFogNear.value=this.fogNear,r.uFogFar.value=this.fogFar,r.uStrength.value=this.strength,t.setRenderTarget(e.write),this.quad.material=this.compositeMaterial,this.quad.render(t)}dispose(){this.aoTarget.dispose(),this.blurTarget.dispose(),this.aoMaterial.dispose(),this.blurMaterial.dispose(),this.compositeMaterial.dispose(),this.quad.dispose()}}const ju=`
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;function nb(){return new be({uniforms:{tDepth:{value:null},tNormal:{value:null},uProjInverse:{value:new oe},uProjScale:{value:1},uRadius:{value:.8},uResolution:{value:new de(1,1,1,1)}},vertexShader:ju,fragmentShader:`
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
    `})}function ib(){return new be({uniforms:{tAO:{value:null},tDepth:{value:null},uNear:{value:.1},uFar:{value:500},uTexel:{value:new tt(1,1)}},vertexShader:ju,fragmentShader:`
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
    `})}function sb(){return new be({uniforms:{tDiffuse:{value:null},tAO:{value:null},tDepth:{value:null},uNear:{value:.1},uFar:{value:500},uFogNear:{value:25},uFogFar:{value:140},uStrength:{value:1}},vertexShader:ju,fragmentShader:`
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
    `})}function gt(i){let t=i>>>0||2654435769;t=Math.imul(t^t>>>16,73244475),t=Math.imul(t^t>>>16,73244475),t=(t^t>>>16)>>>0;const e=()=>{t=t+1831565813>>>0;let s=t;return s=Math.imul(s^s>>>15,s|1),s^=s+Math.imul(s^s>>>7,s|61),((s^s>>>14)>>>0)/4294967296},n=e;return n.range=(s,o)=>s+e()*(o-s),n.int=(s,o)=>Math.floor(s+e()*(o-s+1)),n.chance=s=>e()<s,n.pick=s=>s[Math.floor(e()*s.length)],n.around=(s,o)=>s+(e()*2-1)*o,n}const Om=`
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
`,jo=64;let $n=null;function ob(){if($n!==null)return $n;const i=gt(24332),t=new Uint8Array(jo*jo);for(let e=0;e<t.length;e++)t[e]=Math.floor(i()*256);return $n=new Vu(t,jo,jo,uc,bn),$n.minFilter=He,$n.magFilter=He,$n.wrapS=cs,$n.wrapT=cs,$n.needsUpdate=!0,$n}const rb=`
  uniform sampler2D uNoise;

  float noiseSlice(vec2 billows, float slice) {
    // Billows to UV: one texel per billow. The wrap is what decorrelates one
    // slice from the next — the texture repeats, so an irrational-looking
    // offset lands somewhere unrelated in it.
    vec2 uv = billows / ${jo.toFixed(1)};
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
`,Cn=8,of=8;class ab{enabled=!1;volumes=[];material;quad;tint=new Vt;inverseProjectionView=new oe;constructor(){this.material=cb(),this.quad=new zi(this.material)}setVolumes(t){this.volumes=t.slice(0,Cn);const e=this.material.uniforms;e.uCount.value=this.volumes.length;for(let n=0;n<this.volumes.length;n++){const s=this.volumes[n];e.uCentre.value[n].set(s.center.x,s.center.y,s.center.z,s.density),e.uSize.value[n].set(Math.max(s.size.x,.001),Math.max(s.size.y,.001),Math.max(s.size.z,.001),ir.clamp(s.softness,.01,1)),this.tint.set(s.tint),e.uTint.value[n].set(this.tint.r,this.tint.g,this.tint.b,Math.max(s.noiseScale,.01)),e.uDrift.value[n].set(0,0,ir.clamp(s.turbulence,0,1),s.shape==="box"?1:0)}}get hasVolumes(){return this.volumes.length>0}setSize(){}render(t,e){const{camera:n}=e,s=this.material.uniforms;s.tDiffuse.value=e.colour,s.tDepth.value=e.depth,s.uTime.value=e.time,this.inverseProjectionView.copy(n.projectionMatrix).multiply(n.matrixWorldInverse).invert(),s.uInverseProjectionView.value.copy(this.inverseProjectionView),s.uCameraPosition.value.setFromMatrixPosition(n.matrixWorld),s.uFar.value=n.far;const o=oi.windDir.value;for(let r=0;r<this.volumes.length;r++){const a=this.volumes[r].drift,c=s.uDrift.value[r];c.x=a?.x??o.x,c.y=a?.y??o.y}t.setRenderTarget(e.write),this.quad.render(t)}dispose(){this.material.dispose(),this.quad.dispose()}}function na(i){return Array.from({length:i},()=>new de)}function cb(){return new be({uniforms:{tDiffuse:{value:null},tDepth:{value:null},uNoise:{value:ob()},uCount:{value:0},uCentre:{value:na(Cn)},uSize:{value:na(Cn)},uTint:{value:na(Cn)},uDrift:{value:na(Cn)},uInverseProjectionView:{value:new oe},uCameraPosition:{value:new R},uFar:{value:500},uTime:{value:0}},vertexShader:`
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform sampler2D tDiffuse;
      uniform sampler2D tDepth;
      uniform int uCount;
      uniform vec4 uCentre[${Cn}];
      uniform vec4 uSize[${Cn}];
      uniform vec4 uTint[${Cn}];
      uniform vec4 uDrift[${Cn}];
      uniform mat4 uInverseProjectionView;
      uniform vec3 uCameraPosition;
      uniform float uFar;
      uniform float uTime;
      varying vec2 vUv;

      ${rb}

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

        for (int i = 0; i < ${Cn}; i++) {
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
          float dt = span / float(${of});
          // Already resolved on the way in: a volume with no authored drift
          // arrives carrying the wind. See the render method above.
          vec2 drift = uDrift[i].xy;
          vec3 flow = vec3(drift.x, 0.0, drift.y) * uTime;

          for (int s = 0; s < ${of}; s++) {
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
    `})}const km=1,zm=2,Bm=3,lb=400,Hm={uHorizon:{value:new Vt},uZenith:{value:new Vt},uGround:{value:new Vt},uCurve:{value:1},uCloudColor:{value:new Vt},uCloudCover:{value:.5},uCloudSoftness:{value:.2},uCloudScale:{value:1.2},uCloudOpacity:{value:1},uCloudDrift:{value:.01},uTime:{value:0},uSunDirection:{value:new R(0,1,0)},uSunColor:{value:new Vt},uSunSize:{value:.9993},uSunGlow:{value:260},uSunIntensity:{value:1}},Gm=`
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

  vec3 skyColour(vec3 direction) {
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
    // the dot product directly and no inverse cosine runs per pixel.
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

    return colour;
  }
`,rf={vertexShader:`
    varying vec3 vDirection;

    void main() {
      // Left unnormalized and normalized per-fragment instead: interpolating
      // between normalized vertex directions bends toward the chord and would
      // facet the gradient at low segment counts.
      vDirection = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    varying vec3 vDirection;

    // Lifted into engine/noise when the fog volumes wanted the same functions.
    // Verbatim, so the clouds are the clouds they were tuned to be. (No
    // backticks in this comment either, for the reason given above.)
    ${Om}
    ${Gm}

    void main() {
      gl_FragColor = vec4(skyColour(normalize(vDirection)), 1.0);
    }
  `},Vm={horizon:"#bcd4e6",zenith:"#3f7fbf",ground:"#5d6469",curve:.35,cloudColor:"#f2f5f8",cloudCover:.5,cloudSoftness:.22,cloudScale:1.1,cloudOpacity:.95,cloudDrift:.012,sun:!0,sunColor:"#fff6e0",sunSize:1.1,sunGlow:240};class hb{mesh;material;constructor(){this.material=new be({name:"Sky",uniforms:Hm,vertexShader:rf.vertexShader,fragmentShader:rf.fragmentShader,side:en,depthWrite:!1,depthTest:!1,fog:!1}),this.mesh=new $t(new yr(lb,32,16),this.material),this.mesh.name="Sky",this.mesh.renderOrder=-1,this.mesh.frustumCulled=!1}apply(t){const e=this.material.uniforms;e.uHorizon.value.set(t.horizon),e.uZenith.value.set(t.zenith),e.uGround.value.set(t.ground),e.uCloudColor.value.set(t.cloudColor),e.uCurve.value=t.curve,e.uCloudCover.value=t.cloudCover,e.uCloudSoftness.value=t.cloudSoftness,e.uCloudScale.value=t.cloudScale,e.uCloudOpacity.value=t.cloudOpacity,e.uCloudDrift.value=t.cloudDrift,e.uSunColor.value.set(t.sunColor),e.uSunIntensity.value=t.sun?1:0,e.uSunSize.value=Math.cos(t.sunSize*Math.PI/180),e.uSunGlow.value=t.sunGlow}aimAt(t){this.material.uniforms.uSunDirection.value.copy(t).normalize()}follow(t,e){this.mesh.position.setFromMatrixPosition(t.matrixWorld),this.material.uniforms.uTime.value=e}dispose(){this.mesh.geometry.dispose(),this.material.dispose()}}const ub=.5,db=4.3,fb=2.6,pb=.055,mb=.03,Wm=2*Math.PI/db,Xm=2*Math.PI/fb,gb=1.05/Wm,vb=1.63/Xm,qm=.42,Ri=new be({name:"Water",uniforms:{tScene:{value:null},tDepth:{value:null},uResolution:{value:new tt(1,1)},uProjectionView:{value:new oe},uInverseProjectionView:{value:new oe},uFar:{value:500},uWaveScale:{value:1},uWaterMotion:{value:1},uReflections:{value:1},uSubmerged:{value:0},uMurkDensity:{value:.085},uShallow:{value:new Vt("#6d8f8a")},uDeep:{value:new Vt("#1f3a41")},uFoam:{value:new Vt("#e8f0f2")},uShoreDepth:{value:1.1},uClarity:{value:.9},uFoamDepth:{value:.34},...pc.clone(St.fog),...oi,...Hm},fog:!0,transparent:!0,blending:Ln,depthTest:!1,depthWrite:!1,side:mn,vertexShader:`
    attribute float aChop;
    attribute vec2 aFlow;

    uniform sampler2D gustField;
    uniform vec2 windDir;
    uniform float windLagScale;
    uniform float windHalfSpan;
    uniform float swayTime;
    uniform float uWaveScale;
    uniform float uWaterMotion;

    varying vec3 vWorld;
    varying vec3 vSurfaceNormal;
    /** This vertex's chop, after the gust and the global scale. */
    varying float vChop;
    /** Where on the wave this vertex sits, -1 in a trough to 1 on a crest. */
    varying float vCrest;
    /** Which way the surface is travelling, m/s, for the fragment stage. */
    varying vec2 vFlow;
    /** The authored flow speed. Zero on a pond, and the fragment stage cares. */
    varying float vStreak;

    void main() {
      vec3 world = (modelMatrix * vec4(position, 1.0)).xyz;

      // **The same lookup the plants do**, texel for texel: how far downwind
      // this point stands decides which gust it is in. See art/sway.ts, which
      // owns this window and rebuilds it from the audio weather every frame —
      // so a gust that quickens a rustle roughens the water it crosses at the
      // same moment, without either side reimplementing the field.
      float lag = dot(world.xz, windDir) * windLagScale;
      float u = clamp(0.5 - lag / (2.0 * windHalfSpan), 0.0, 1.0);
      float gust = texture2D(gustField, vec2(u, 0.5)).r;

      // Never all the way to nothing: water in a lull is calmer, not glass.
      // uWaterMotion is the accessibility switch, and it is a hard zero — a
      // pond that has stopped is glass, which is the point of asking for it.
      float chop = aChop * uWaveScale * uWaterMotion * (0.35 + 0.65 * gust);

      // **Which way the surface is going.** Flowing water carries its own
      // direction and speed in aFlow; still water answers the wind, which is
      // what every pond does and what the channels deliberately do not.
      float rate = length(aFlow);
      // Two trains, crossed at about fifty degrees. The first runs with the
      // water; the second is it, rotated, so both turn together.
      vec2 d1 = rate > 0.001 ? aFlow / rate : normalize(windDir + vec2(1e-4, 0.0));
      vec2 d2 = vec2(d1.x * 0.62 - d1.y * 0.78, d1.x * 0.78 + d1.y * 0.62);

      float k1 = ${Wm.toFixed(5)};
      float k2 = ${Xm.toFixed(5)};
      // Phase speed is the train's own celerity **plus the speed of the water
      // under it**, projected onto the direction that train runs in. With no
      // flow this is exactly the still-water phase the pools were tuned at.
      float p1 = (dot(world.xz, d1) - swayTime * (${gb.toFixed(4)} + dot(aFlow, d1))) * k1;
      float p2 = (dot(world.xz, d2) - swayTime * (${vb.toFixed(4)} + dot(aFlow, d2))) * k2;

      float a1 = ${pb.toFixed(3)} * chop;
      float a2 = ${mb.toFixed(3)} * chop;
      float height = a1 * sin(p1) + a2 * sin(p2);

      // **Plain sines so the slope is exact.** A Gerstner sum would look better
      // in a screenshot and would need either a finite difference or a second
      // evaluation to get its normal; the derivative of a sine is a cosine, and
      // the surface normal is most of what water looks like.
      vec2 slope = d1 * (a1 * k1 * cos(p1)) + d2 * (a2 * k2 * cos(p2));

      world.y += height;
      vWorld = world;
      vSurfaceNormal = normalize(vec3(-slope.x, 1.0, -slope.y));
      vChop = chop;
      vCrest = height / max(a1 + a2, 1e-4);
      // What the fragment stage advects its noise along. Still water still
      // drifts, slowly, downwind — a surface pattern nailed to the world reads
      // as ice.
      vFlow = rate > 0.001 ? aFlow : windDir * 0.25;
      // Zero on still water, which is what keeps a pond from looking combed.
      vStreak = rate;

      gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tScene;
    uniform sampler2D tDepth;
    uniform vec2 uResolution;
    uniform mat4 uProjectionView;
    uniform mat4 uInverseProjectionView;
    uniform float uFar;
    uniform float uReflections;
    uniform float uSubmerged;
    uniform float uMurkDensity;
    uniform vec3 uShallow;
    uniform vec3 uDeep;
    uniform vec3 uFoam;
    uniform float uShoreDepth;
    uniform float uClarity;
    uniform float uFoamDepth;

    uniform vec2 windDir;
    uniform float swayTime;
    uniform float uWaterMotion;

    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;

    varying vec3 vWorld;
    varying vec3 vSurfaceNormal;
    varying float vChop;
    varying float vCrest;
    varying vec2 vFlow;
    varying float vStreak;

    ${Om}
    ${Gm}

    /**
     * How far along the camera ray the scene stops, at a screen position.
     *
     * By unprojection rather than by converting axis depth to ray depth, for
     * the reason the fog march gives: the result is a length between two world
     * points and is therefore a distance along the ray by construction, with
     * no axis-versus-ray confusion left to get wrong.
     *
     * Sky comes back as the far plane, so a reflection ray crossing open sky
     * finds nothing to hit and carries on.
     */
    float sceneDistance(vec2 uv) {
      float d = texture2D(tDepth, uv).r;
      if (d >= 0.9999) return uFar;
      vec4 p = uInverseProjectionView * vec4(uv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
      return length(p.xyz / p.w - cameraPosition);
    }

    /** Two scales of value noise. Cheaper than fbm, and this is not a cloud. */
    float ripple(vec2 p) {
      return valueNoise(p) * 0.66 + valueNoise(p * 2.17 + 11.3) * 0.34;
    }

    /**
     * The same noise, drawn in a frame that runs with the water and is squeezed
     * along it.
     *
     * **This is what makes flow read as flow rather than as texture sliding
     * about.** Isotropic noise carried downstream moves, and moving is all it
     * does — nothing in the pattern says which way. Compressing the coordinate
     * along the flow stretches every feature *out* along it in world space, and
     * what comes back is streaklines: the shape water actually draws on itself,
     * and the shape a photograph of a river is made of.
     *
     * It is also the cheapest speed cue there is. The stretch grows with the
     * flow, so a slow channel is faintly combed and a fast one is drawn in long
     * lines, side by side, with nothing else different between them.
     *
     * And it is the whole answer to a bend. The frame is built from a varying,
     * so it rotates across the surface exactly as the flow does — the streaks
     * bend round the corner because they are drawn in the water's own frame
     * rather than in the world's. A height field cannot do this (see the note on
     * shear on WaterPlaneOptions.flow); noise can, and does it for free.
     */
    float streaked(vec2 p, vec2 along, float stretch, float scale) {
      vec2 across = vec2(-along.y, along.x);
      return ripple(vec2(dot(p, along) / stretch, dot(p, across)) * scale);
    }

    // Interleaved gradient noise, the same offset the fog march and GTAO use:
    // neighbouring pixels get maximally different values, so the reflection
    // steps of one pixel interleave with its neighbours' instead of banding.
    float gradientNoise(vec2 p) {
      return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y));
    }

    /**
     * Screen-space reflection: march the depth buffer for what the ray hits.
     *
     * **Marched in world space, not screen space.** The depth texture is read
     * here as a *distance* in metres, so a metre-sized step is a step the
     * acceptance band can be written in metres too — and metres are the only
     * unit anything else in this file is authored in. The stride grows
     * geometrically, so a near hit is found precisely and a far one is still
     * reached inside the step budget.
     *
     * The weight comes back as how much to trust the hit: zero for no hit at
     * all, and faded down near the edge of the frame where the ray is about to
     * run out of screen. The caller crossfades that against the analytic sky,
     * which is the answer a miss deserves anyway.
     *
     * Water is absent from the depth buffer entirely — see layers.ts — so this
     * ray has nothing of its own to intersect, and none of the usual
     * self-intersection guards are needed.
     */
    vec3 marchReflection(
      vec3 origin,
      vec3 direction,
      float jitter,
      out float weight,
      out float travelled
    ) {
      weight = 0.0;
      travelled = 0.0;
      vec3 found = vec3(0.0);

      float stride = 0.35;
      float t = stride * (0.5 + jitter);

      for (int i = 0; i < 16; i++) {
        t += stride;
        vec3 p = origin + direction * t;

        vec4 clip = uProjectionView * vec4(p, 1.0);
        if (clip.w <= 0.0) break;
        vec2 uv = clip.xy / clip.w * 0.5 + 0.5;
        if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) break;

        float along = length(p - cameraPosition);
        float behind = along - sceneDistance(uv);

        // Behind the recorded surface, but not so far behind that the ray has
        // passed clean through something thin and come out the other side.
        if (behind > 0.0 && behind < stride * 2.5) {
          // Refine between the last miss and here. Four halvings turns a step
          // that may be metres long into centimetres, which is the difference
          // between a reflection that sits on its object and one that floats.
          float lo = t - stride;
          float hi = t;
          for (int r = 0; r < 4; r++) {
            float mid = (lo + hi) * 0.5;
            vec3 q = origin + direction * mid;
            vec4 qc = uProjectionView * vec4(q, 1.0);
            vec2 quv = qc.xy / qc.w * 0.5 + 0.5;
            if (length(q - cameraPosition) - sceneDistance(quv) > 0.0) hi = mid;
            else lo = mid;
          }

          vec3 q = origin + direction * hi;
          vec4 qc = uProjectionView * vec4(q, 1.0);
          vec2 quv = qc.xy / qc.w * 0.5 + 0.5;
          found = texture2D(tScene, quv).rgb;

          vec2 edge = min(quv, 1.0 - quv);
          weight = smoothstep(0.0, 0.12, min(edge.x, edge.y));
          travelled = hi;
          break;
        }

        stride *= 1.22;
      }

      return found;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution;

      vec3 toEye = cameraPosition - vWorld;
      float surfaceDistance = length(toEye);
      vec3 view = toEye / surfaceDistance;

      // **The depth test, done by hand.** Everything opaque was drawn before
      // this pass and its distance is in tDepth; anything nearer than the
      // surface is in front of it. The centimetre of slack keeps a bed that
      // breaks the surface from flickering along its own waterline.
      float bedDistance = sceneDistance(uv);
      if (bedDistance < surfaceDistance - 0.02) discard;

      // How much water the eye is looking through, in metres. Everything below
      // is a function of this number.
      float thickness = max(bedDistance - surfaceDistance, 0.0);

      // --- the surface normal ------------------------------------------------
      // The wave slope from the vertex stage, plus fine ripple that would need
      // a mesh ten times denser to carry as displacement. Gradient by finite
      // difference, which is the honest cost of using noise for it.
      // **How far the surface has carried its own pattern**, in metres. Every
      // noise lookup below is offset by this rather than being nailed to the
      // world, which is the whole of what makes flowing water read as flowing:
      // the wave trains say which way it is going and this says that the
      // *stuff* is going with them. It is a varying, so a channel can turn a
      // corner and the pattern turns with it — noise shears cleanly where a
      // height field would tear.
      //
      // **The honest limit**: this grows without bound, and the value noise is
      // a hash of its coordinate, so after twenty-odd minutes of watching one
      // fast channel the offset is large enough that float32 starts to coarsen
      // the pattern. The fix, if it is ever wanted, is the tiled noise
      // *texture* that engine/noise already builds for the fog volumes, which
      // wraps and therefore cannot drift out of precision.
      vec2 stream = vFlow * (swayTime * uWaterMotion);

      // The frame the surface pattern is drawn in — see streaked above. Still water
      // gets a stretch of exactly 1, which is no streaking at all: a pond that
      // looked combed downwind would be a worse lie than one that looked
      // featureless.
      float carried = length(vFlow);
      vec2 along = carried > 1e-4 ? vFlow / carried : vec2(1.0, 0.0);
      float stretch = 1.0 + min(vStreak, 3.0) * 1.15;

      // **How broken the surface is, which is not the same as how big its waves
      // are.** A race carries almost no swell — its wave trains have to stay
      // small, because a channel that turns shears the phase — and the first
      // version therefore came out glassy: a mirror with a pattern sliding over
      // it, which reads as still water with something wrong about it. Fast water
      // is not smooth. Speed drives the surface break directly here, so a
      // channel is agitated in proportion to how hard it is running without any
      // of that going through the vertex stage.
      float rushing = min(vStreak, 3.0) / 3.0;
      float agitation = max(vChop, rushing * 1.15);

      vec3 normal = normalize(vSurfaceNormal);
      if (agitation > 0.002) {
        vec2 q = vWorld.xz - stream * 1.35;
        float e = 0.18;
        float n0 = streaked(q, along, stretch, 1.35);
        float gx = streaked(q + vec2(e, 0.0), along, stretch, 1.35) - n0;
        float gz = streaked(q + vec2(0.0, e), along, stretch, 1.35) - n0;
        // **Small.** This tilts the normal, and the normal decides both the
        // fresnel weight and where the reflection ray goes — so at anything
        // past about ten degrees the reflected image stops being a reflection
        // and becomes a warp. Ripple is meant to make the surface *sparkle*,
        // which is a few degrees of scatter; the shape of the water is the
        // vertex stage's business.
        normal = normalize(normal + vec3(-gx, 0.0, -gz) * (0.16 * agitation / e));
      }

      // --- seen from below ----------------------------------------------------
      //
      // A different surface, not a fainter one. Everything past this point
      // assumes the eye is in air, and every term of it inverts underwater.
      //
      // Snell's window: light from above reaches an eye in water only through a
      // cone about 49 degrees wide, cos = sqrt(1 - 1/1.333^2) = 0.661. Outside
      // it, total internal reflection — the same march, pointed down at the bed.
      if (!gl_FrontFacing) {
        vec3 upward = -view;
        float facing = clamp(dot(normal, upward), 0.0, 1.0);
        float window = smoothstep(0.60, 0.71, facing);

        vec3 mirrored = uDeep;
        if (uReflections > 0.5) {
          vec3 down = reflect(upward, normal);
          // Never let a grazing ray run flat along the underside of the surface,
          // where it would march for fifty metres and find whatever is at the
          // far end of the pool.
          down.y = min(down.y, -0.03);
          float found;
          float travelled;
          vec3 marched = marchReflection(
            vWorld,
            normalize(down),
            gradientNoise(floor(gl_FragCoord.xy)),
            found,
            travelled
          );
          // Absorbed with distance, unlike the air side: without this, grazing
          // TIR marches twenty metres and returns crisp bright sand.
          mirrored = mix(uDeep, marched, found * exp(-travelled * 0.32));
        }

        vec3 seen = mix(mirrored, texture2D(tScene, uv).rgb, window);
        seen = mix(seen, uShallow, 0.26);

        // This surface murks itself: the depth buffer has no water in it, so
        // the underwater pass has no distance for these pixels. Same density and
        // far colour, so the two converge at range with no seam.
        float murk = 1.0 - exp(-surfaceDistance * uMurkDensity);
        vec3 scattered = mix(uDeep, uShallow, ${qm.toFixed(2)});
        seen = mix(seen, scattered, murk * uSubmerged);

        // Alpha zero: nothing left for the underwater pass to do here.
        gl_FragColor = vec4(seen, 0.0);
        return;
      }

      // --- what is under the water -------------------------------------------
      vec3 bed = texture2D(tScene, uv).rgb;
      // Beer-Lambert on the column, the same shape the fog volumes use: the bed
      // does not vanish at a threshold, it fades out at a rate.
      float opacity = 1.0 - exp(-thickness / max(uClarity, 0.01));
      vec3 body = mix(uShallow, uDeep, 1.0 - exp(-thickness / max(uShoreDepth, 0.01)));
      vec3 below = mix(bed, body, opacity);

      // --- reflection ---------------------------------------------------------
      vec3 bounce = reflect(-view, normal);
      // A wave normal at a grazing angle can send the ray below the horizon,
      // where the sky shader returns ground colour and the march finds the
      // floor at the camera's feet. Neither is a reflection of anything.
      bounce.y = max(bounce.y, 0.015);
      bounce = normalize(bounce);

      vec3 sky = skyColour(bounce);
      vec3 reflection = sky;
      float hit = 0.0;
      if (uReflections > 0.5) {
        float found;
        float travelled;
        vec3 marched = marchReflection(
          vWorld,
          bounce,
          gradientNoise(floor(gl_FragCoord.xy)),
          found,
          travelled
        );
        reflection = mix(sky, marched, found);
        hit = found;
      }

      // Schlick, with water's own 0.02 at normal incidence. Looking straight
      // down you see the bed; looking along the pool you see the sky. That is
      // not a stylistic choice, it is what the number does, and it is why the
      // still pool is long — the reflection lives at the far end of it.
      float fresnel = clamp(
        0.02 + 0.98 * pow(1.0 - clamp(dot(normal, view), 0.0, 1.0), 5.0),
        0.0,
        1.0
      );

      vec3 colour = mix(below, reflection, fresnel);

      // --- foam ---------------------------------------------------------------
      // Two bands and two flat colours, hard-thresholded on purpose: the
      // quantizer downstream would band a gradient anyway, so the bands are
      // authored where they belong rather than landing wherever the level count
      // puts them.
      //
      // The waterline is scaled by noise and scrolled downwind, which is what
      // stops a threshold on depth reading as a contour line drawn on a map.
      // Three layers at slightly different rates, because water is not one
      // sheet: the fine ripple above rides fastest, the crest speckle goes with
      // the body, and the waterline lags. All of them are carried by the stream above,
      // so the motion switch stops every one of them — a waterline undulating
      // around an otherwise dead pond is the exact thing somebody turning
      // reduced motion on is asking to be rid of.
      float lap = streaked(vWorld.xz - stream * 0.85, along, stretch, 0.55);
      // **Fast water is aerated, and aerated water is white further out.** The
      // band a race foams over is nearly twice a pond's, which is why a mill
      // race reads as white and a lake does not. It costs one multiply and it
      // is the other half of making flow visible: the streaklines say which way,
      // and this is what there is enough of to see them in.
      float band = uFoamDepth * (0.45 + 1.1 * lap) * (1.0 + rushing * 0.95);
      float shore = 1.0 - smoothstep(band * 0.5, band, thickness);

      // **Crest foam has to be broken up, because the waves are a grid.**
      // Two crossed sine trains interfere into a perfectly regular lattice, and
      // a plain threshold on wave height therefore puts a white speck at every
      // node of it — which reads as a pattern sliding across the pool rather
      // than as water breaking. So the threshold is *lowered* by a drifting
      // noise field instead of being a constant: foam is possible where the
      // noise is high, and even there only the tallest crests reach it. Same
      // move as the waterline above, one scale finer.
      float speck = streaked(vWorld.xz - stream, along, stretch, 1.7);
      float crest =
        smoothstep(1.05 - speck * 0.55, 1.25 - speck * 0.5, vCrest) *
        smoothstep(0.12, 0.5, agitation);
      float foam = max(shore, crest);

      float wash = step(0.28, foam);
      float white = step(0.68, foam);
      // The paler band is mixed from the shore colour rather than authored, so
      // the two never drift apart when the palette is tuned.
      vec3 foamColour = mix(mix(uShallow, uFoam, 0.55), uFoam, white);
      colour = mix(colour, foamColour, wash);

      // --- fog ----------------------------------------------------------------
      // **Only the part of this pixel that is ours gets fogged.** The bed came
      // out of tScene already fogged for its own distance, and so did anything
      // the reflection march found; fogging the composite again would haze both
      // of them twice. What is genuinely this shader's — the body colour, a sky
      // reflection, the foam — is fogged for the surface's distance, which is
      // what the rest of the world would have done with it.
      float own = mix(opacity, 1.0 - hit, fresnel);
      own = mix(own, 1.0, wash);
      float haze = smoothstep(fogNear, fogFar, surfaceDistance) * own;

      gl_FragColor = vec4(mix(colour, fogColor, haze), 1.0);
    }
  `});Ri.defaultAttributeValues={aChop:[0],aFlow:[0,0]};function xc(i){const{width:t,depth:e,at:n,chop:s=1,flow:o,segment:r=ub}=i,a=Math.max(1,Math.round(t/r)),c=Math.max(1,Math.round(e/r)),l=new En(t,e,a,c);l.rotateX(-Math.PI/2);const h=l.getAttribute("position"),u=h.count,f=new Float32Array(u);if(typeof s=="function")for(let v=0;v<u;v++)f[v]=Math.max(s(h.getX(v)+n.x,h.getZ(v)+n.z),0);else f.fill(Math.max(s,0));l.setAttribute("aChop",new ze(f,1));const d=new Float32Array(u*2);if(o)for(let v=0;v<u;v++){const m=typeof o=="function"?o(h.getX(v)+n.x,h.getZ(v)+n.z):o;d[v*2]=m.x,d[v*2+1]=m.y}l.setAttribute("aFlow",new ze(d,2));const g=new $t(l,Ri);return g.name="water",g.position.copy(n),g.layers.set(Bm),g.userData.noCollide=!0,g.userData.water=!0,g}class yb{enabled=!1;blitMaterial;quad;present=!1;surfaces=[];scanned=!1;projectionView=new oe;inverse=new oe;priorMask=1;constructor(){this.blitMaterial=new be({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
      `}),this.quad=new zi(this.blitMaterial)}setActive(t){this.present=t,this.surfaces.length=0,this.scanned=!1}get hasWater(){return this.present}submersion(t,e){if(!this.present)return 0;this.scanned||(this.scanned=!0,t.traverse(s=>{!(s instanceof $t)||s.userData.water!==!0||this.surfaces.push({box:new Di().setFromObject(s),level:s.getWorldPosition(wb).y})})),Ds.setFromMatrixPosition(e.matrixWorld);let n=0;for(const s of this.surfaces){const{box:o,level:r}=s;Ds.x<o.min.x||Ds.x>o.max.x||Ds.z<o.min.z||Ds.z>o.max.z||(n=Math.max(n,r-Ds.y))}return n}setSize(){}render(t,e){const{camera:n,scene:s}=e;this.blitMaterial.uniforms.tDiffuse.value=e.colour,t.setRenderTarget(e.write),this.quad.render(t);const o=Ri.uniforms;o.tScene.value=e.colour,o.tDepth.value=e.depth,o.uResolution.value.copy(e.size),o.uFar.value=n.far,this.projectionView.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),o.uProjectionView.value.copy(this.projectionView),o.uInverseProjectionView.value.copy(this.inverse.copy(this.projectionView).invert());const r=t.autoClear;this.priorMask=n.layers.mask,t.autoClear=!1,n.layers.set(Bm),t.render(s,n),n.layers.mask=this.priorMask,t.autoClear=r}dispose(){this.blitMaterial.dispose(),this.quad.dispose()}}const wb=new R,Ds=new R;class xb{enabled=!1;material;quad;inverse=new oe;constructor(){this.material=_b(),this.quad=new zi(this.material)}setDepth(t){const e=Math.min(Math.max(t/.35,0),1);this.material.uniforms.uAmount.value=e,this.enabled=e>0}setSize(){}render(t,e){const{camera:n}=e,s=this.material.uniforms;s.tDiffuse.value=e.colour,s.tDepth.value=e.depth,s.uTime.value=e.time,s.uFar.value=n.far,this.inverse.copy(n.projectionMatrix).multiply(n.matrixWorldInverse).invert(),s.uInverseProjectionView.value.copy(this.inverse),s.uCameraPosition.value.setFromMatrixPosition(n.matrixWorld),t.setRenderTarget(e.write),this.quad.render(t)}dispose(){this.material.dispose(),this.quad.dispose()}}function _b(){return new be({uniforms:{tDiffuse:{value:null},tDepth:{value:null},uInverseProjectionView:{value:new oe},uCameraPosition:{value:new R},uFar:{value:500},uTime:{value:0},uAmount:Ri.uniforms.uSubmerged,uTint:Ri.uniforms.uDeep,uHaze:Ri.uniforms.uShallow,uDensity:Ri.uniforms.uMurkDensity},vertexShader:`
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform sampler2D tDiffuse;
      uniform sampler2D tDepth;
      uniform mat4 uInverseProjectionView;
      uniform vec3 uCameraPosition;
      uniform float uFar;
      uniform float uTime;
      uniform float uAmount;
      uniform vec3 uTint;
      uniform vec3 uHaze;
      uniform float uDensity;
      varying vec2 vUv;

      void main() {
        // A couple of pixels of sway, so there is something in front of the lens.
        vec2 wobble = vec2(
          sin(vUv.y * 23.0 + uTime * 1.3) + 0.5 * sin(vUv.y * 41.0 - uTime * 0.9),
          sin(vUv.x * 27.0 - uTime * 1.1) + 0.5 * sin(vUv.x * 37.0 + uTime * 1.6)
        ) * (0.0022 * uAmount);
        vec2 uv = clamp(vUv + wobble, 0.0, 1.0);

        vec4 source = texture2D(tDiffuse, uv);
        vec3 colour = source.rgb;

        // Distance by unprojection, the same way the water and fog volumes do it.
        float depth = texture2D(tDepth, uv).r;
        float distance;
        if (depth >= 0.9999) {
          distance = uFar;
        } else {
          vec4 hit = uInverseProjectionView * vec4(uv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
          distance = length(hit.xyz / hit.w - uCameraPosition);
        }

        // Water surfaces murk themselves — see the class note.
        float murk = 1.0 - exp(-distance * uDensity);
        murk *= step(0.5, source.a);

        // The far field. Same constant the surface uses — see MURK_MIX.
        vec3 scattered = mix(uTint, uHaze, ${qm.toFixed(2)});
        colour = mix(colour, scattered, murk * uAmount);
        // Applies at every distance, so this is what sets how gloomy the near
        // field is. Light-handed on purpose.
        colour = mix(colour, colour * 0.85 + uTint * 0.09, uAmount);

        gl_FragColor = vec4(colour, 1.0);
      }
    `})}const bi=3;class Mb{enabled=!1;strength=1;radius=1;emitters;down=[];up=[];downMaterial;upMaterial;compositeMaterial;quad;priorClear=new Vt;priorMask=1;constructor(){this.emitters=ll();for(let t=0;t<bi;t++)this.down.push(ll());for(let t=0;t<bi-1;t++)this.up.push(ll());this.downMaterial=bb(),this.upMaterial=Sb(),this.compositeMaterial=Eb(),this.quad=new zi(this.downMaterial)}setSize(t,e){this.emitters.setSize(t,e);for(let n=0;n<bi;n++){const s=2**(n+1),o=Math.max(1,Math.floor(t/s)),r=Math.max(1,Math.floor(e/s));this.down[n].setSize(o,r),n<bi-1&&this.up[n].setSize(o,r)}}render(t,e){this.renderEmitters(t,e),this.quad.material=this.downMaterial;let n=this.emitters.texture,s=e.size.x,o=e.size.y;for(let a=0;a<bi;a++){const c=this.down[a];this.downMaterial.uniforms.tDiffuse.value=n,this.downMaterial.uniforms.uHalfTexel.value.set(.5*this.radius/s,.5*this.radius/o),this.downMaterial.uniforms.uKaris.value=a===0?1:0,t.setRenderTarget(c),this.quad.render(t),n=c.texture,s=c.width,o=c.height}this.quad.material=this.upMaterial;for(let a=bi-2;a>=0;a--){const c=a===bi-2?this.down[bi-1]:this.up[a+1];this.upMaterial.uniforms.tSource.value=c.texture,this.upMaterial.uniforms.tPrevious.value=this.down[a].texture,this.upMaterial.uniforms.uHalfTexel.value.set(.5*this.radius/c.width,.5*this.radius/c.height),t.setRenderTarget(this.up[a]),this.quad.render(t)}const r=this.compositeMaterial.uniforms;r.tDiffuse.value=e.colour,r.tBloom.value=this.up[0].texture,r.uStrength.value=this.strength,t.setRenderTarget(e.write),this.quad.material=this.compositeMaterial,this.quad.render(t)}renderEmitters(t,e){const{camera:n,scene:s}=e;this.emitters.depthTexture!==e.depth&&(this.emitters.depthTexture=e.depth,this.emitters.dispose());const o=t.autoClear,r=t.getClearAlpha();t.getClearColor(this.priorClear),this.priorMask=n.layers.mask,t.setRenderTarget(this.emitters),t.autoClear=!1,t.setClearColor(0,1),t.clearColor(),n.layers.set(zm),t.render(s,n),n.layers.mask=this.priorMask,t.setClearColor(this.priorClear,r),t.autoClear=o}dispose(){this.emitters.dispose();for(const t of this.down)t.dispose();for(const t of this.up)t.dispose();this.downMaterial.dispose(),this.upMaterial.dispose(),this.compositeMaterial.dispose(),this.quad.dispose()}}function ll(){const i=new Sn(1,1);return i.texture.minFilter=He,i.texture.magFilter=He,i.texture.type=Oi,i}const Ju=`
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;function bb(){return new be({uniforms:{tDiffuse:{value:null},uHalfTexel:{value:new tt},uKaris:{value:0}},vertexShader:Ju,fragmentShader:`
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
    `})}function Sb(){return new be({uniforms:{tSource:{value:null},tPrevious:{value:null},uHalfTexel:{value:new tt}},vertexShader:Ju,fragmentShader:`
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
    `})}function Eb(){return new be({uniforms:{tDiffuse:{value:null},tBloom:{value:null},uStrength:{value:1}},vertexShader:Ju,fragmentShader:`
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
    `})}const Tb={off:0,protanopia:1,deuteranopia:2,tritanopia:3},Ab={name:"RetroShader",uniforms:{tDiffuse:{value:null},uPixelSize:{value:1},uDitherScale:{value:1.65},uPeriod:{value:3},uQuantize:{value:1},uLevels:{value:16},uVignette:{value:.35},uVignetteRadius:{value:.55},uVignetteSoftness:{value:.6},uColorblind:{value:0},uColorblindStrength:{value:1}},vertexShader:`
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
  `},Qu="hswow.preset.";function Ym(i){try{const t=window.localStorage.getItem(Qu+i);if(t===null)return null;const e=JSON.parse(t);return typeof e!="object"||e===null?null:e}catch{return null}}function $m(i,t){try{return window.localStorage.setItem(Qu+i,JSON.stringify(t)),!0}catch{return!1}}function Zm(i){try{window.localStorage.removeItem(Qu+i)}catch{}}const ru=new vr({vertexColors:!0,transparent:!0,blending:dh,depthWrite:!1,side:mn,fog:!1});function Nn(i,t){const e=new $t(i,ru);return e.name=t,e.userData.noCollide=!0,e.renderOrder=2,e.layers.enable(zm),e}const hl="render",Po={pixelSize:2,normalEdgeStrength:.5,depthEdgeStrength:.5,ditherScale:1.65,screenPeriod:3,quantize:"levels",levels:16,ao:{strength:.85,radius:.8},bloom:{strength:.28,radius:1},water:{waves:1,reflections:!0},vignetteStrength:0,vignetteRadius:.5,vignetteSoftness:.7,sky:{...Vm},linkFogToSky:!0,fogColor:"#bcd4e6",fogNear:25,fogFar:140},af={off:0,levels:1};class Rb{settings;viewport;composer;pixelStage;gtao;water;underwater;fog;bloom;retroPass;sky=new hb;air=null;dither=!0;pixelate=!0;occlusion=!0;volumetrics=!0;glow=!0;waves=!0;colorblind="off";colorblindStrength=1;constructor(t){this.viewport=t;const e=Ym(hl)??{};this.settings={...Po,...e,sky:{...Vm,...e.sky},ao:{...Po.ao,...e.ao},bloom:{...Po.bloom,...e.bloom},water:{...Po.water,...e.water}},this.settings.quantize in af||(this.settings.quantize="levels"),t.scene.add(this.sky.mesh),this.hideGlowFromEdges(t.scene),this.composer=new zM(t.renderer),this.pixelStage=new JM(1,t.scene,t.camera),ou(this.pixelStage.normalMaterial),this.gtao=new eb,this.water=new yb,this.underwater=new xb,this.fog=new ab,this.bloom=new Mb,this.pixelStage.effects.push(this.gtao,this.water,this.underwater,this.fog,this.bloom),this.retroPass=new Lm(Ab),this.composer.addPass(this.pixelStage),this.composer.addPass(new HM),this.composer.addPass(this.retroPass),this.resize(),this.apply()}setEnvironment(t){this.air=t,this.fog.setVolumes(t?.fogVolumes??[]),this.water.setActive(t?.water??!1),this.apply()}aimSun(t){this.sky.aimAt(t)}setDither(t){this.dither=t,this.apply()}setPixelation(t){this.pixelate=t,this.apply()}setAmbientOcclusion(t){this.occlusion=t,this.apply()}setFogVolumes(t){this.volumetrics=t,this.apply()}setBloom(t){this.glow=t,this.apply()}setWaterMotion(t){this.waves=t,this.apply()}setColorblind(t,e){this.colorblind=t,this.colorblindStrength=Math.min(Math.max(e,0),1),this.apply()}apply(){const t=this.settings,e=this.viewport.renderer.getPixelRatio(),n=this.pixelate?Math.max(1,Math.round(t.pixelSize*e)):1;this.pixelStage.pixelSize!==n&&this.pixelStage.setPixelSize(n),this.pixelStage.normalEdgeStrength=t.normalEdgeStrength,this.pixelStage.depthEdgeStrength=t.depthEdgeStrength,this.gtao.enabled=this.occlusion&&t.ao.strength>0,this.gtao.strength=t.ao.strength,this.gtao.radius=t.ao.radius,this.fog.enabled=this.volumetrics&&this.fog.hasVolumes,this.water.enabled=this.water.hasWater;const s=Ri.uniforms;s.uWaveScale.value=t.water.waves,s.uWaterMotion.value=this.waves?1:0,s.uReflections.value=t.water.reflections?1:0,this.bloom.enabled=this.glow&&t.bloom.strength>0,this.bloom.strength=t.bloom.strength,this.bloom.radius=t.bloom.radius;const o=this.retroPass.uniforms;o.uPixelSize.value=n,o.uDitherScale.value=this.dither?t.ditherScale:0,o.uPeriod.value=t.screenPeriod,o.uQuantize.value=af[t.quantize],o.uLevels.value=t.levels,o.uVignette.value=t.vignetteStrength,o.uVignetteRadius.value=t.vignetteRadius,o.uVignetteSoftness.value=t.vignetteSoftness,o.uColorblind.value=Tb[this.colorblind],o.uColorblindStrength.value=this.colorblindStrength,this.sky.apply(t.sky),this.sky.mesh.visible=this.air===null||this.air.sky;const r=this.viewport.scene.fog;r instanceof gc&&(this.air&&!this.air.sky?r.color.set(this.air.fogColor):t.linkFogToSky?r.color.set(t.sky.horizon):r.color.set(this.air?.fogColor??t.fogColor),r.near=this.air?.fogNear??t.fogNear,r.far=this.air?.fogFar??t.fogFar,this.viewport.renderer.setClearColor(r.color,1),this.gtao.setFog(r.near,r.far))}hideGlowFromEdges(t){t.onBeforeRender=(e,n)=>{ru.visible=n.overrideMaterial===null}}render(t){const{renderer:e}=this.viewport;e.info.reset(),e.shadowMap.needsUpdate=!0,this.sky.follow(this.viewport.camera,t),this.underwater.setDepth(this.water.submersion(this.viewport.scene,this.viewport.camera)),this.pixelStage.time=t,this.composer.render()}resize(){const t=this.viewport.renderer.getSize(new tt);this.composer.setPixelRatio(this.viewport.renderer.getPixelRatio()),this.composer.setSize(t.x,t.y),this.apply()}save(){return $m(hl,this.settings)}reset(){Zm(hl),Object.assign(this.settings,structuredClone(Po)),this.apply()}dispose(){this.viewport.scene.onBeforeRender=()=>{},ru.visible=!0,this.viewport.scene.remove(this.sky.mesh),this.sky.dispose(),this.pixelStage.dispose(),this.composer.dispose()}}const ul=new URLSearchParams(window.location.search),Km={debug:ul.has("debug"),level:ul.get("level")??"proving",touch:ul.has("touch")},Cb=["KeyW","ArrowUp"],Pb=["KeyS","ArrowDown"],Ib=["KeyA","ArrowLeft"],Db=["KeyD","ArrowRight"],cf=["ShiftLeft","ShiftRight"],lf=["CapsLock"],hf=["Space"],Lb=["KeyE"],ia=200,Nb=3e3,Fb=120;class Ub{lookX=0;lookY=0;locked=!1;needsCapture;onLockChange=null;canvas;keys=new Set;stickX=0;stickZ=0;stickSprint=!1;sprintMode="hold";crouchMode="hold";sprintLatch=!1;crouchLatch=!1;jumpPressedAt=0;jumpHeld=!1;interactPressed=!1;settling=!1;relocking=!1;constructor(t){this.canvas=t,this.needsCapture=!jm(),window.addEventListener("keydown",this.handleKeyDown),window.addEventListener("keyup",this.handleKeyUp),window.addEventListener("blur",this.handleBlur),this.needsCapture?(t.addEventListener("pointerdown",this.handleCanvasPointerDown),document.addEventListener("pointerlockchange",this.handleLockChange),document.addEventListener("mousemove",this.handleMouseMove)):this.locked=!0}get moveX(){const t=uf(this.pressed(Db),this.pressed(Ib));return sa(t+this.stickX,-1,1)}get moveZ(){const t=uf(this.pressed(Cb),this.pressed(Pb));return sa(t+this.stickZ,-1,1)}get sprint(){return(this.sprintMode==="toggle"?this.sprintLatch:this.pressed(cf))||this.stickSprint}get crouching(){return this.crouchMode==="toggle"?this.crouchLatch:this.pressed(lf)}setSprintMode(t){t!==this.sprintMode&&(this.sprintMode=t,this.sprintLatch=!1)}setCrouchMode(t){t!==this.crouchMode&&(this.crouchMode=t,this.crouchLatch=!1)}get jumping(){return this.jumpHeld}takeJump(t){return this.jumpPressedAt===0||(performance.now()-this.jumpPressedAt)/1e3>t?!1:(this.jumpPressedAt=0,!0)}takeInteract(){return this.interactPressed?(this.interactPressed=!1,!0):!1}drainLook(t){t.x=this.lookX,t.y=this.lookY,this.lookX=0,this.lookY=0}setStick(t,e,n){this.stickX=t,this.stickZ=e,this.stickSprint=n}addLook(t,e){this.lookX+=t,this.lookY+=e}pressJump(){this.jumpPressedAt=performance.now(),this.jumpHeld=!0}releaseJump(){this.jumpHeld=!1}pressInteract(){this.interactPressed=!0}capture(){this.locked||!this.needsCapture||this.requestLock()}pressed(t){return t.some(e=>this.keys.has(e))}handleKeyDown=t=>{if(t.code==="Tab"&&this.locked){t.preventDefault();return}t.repeat||this.needsCapture&&!this.locked||(this.keys.add(t.code),hf.includes(t.code)&&(t.preventDefault(),this.pressJump()),this.sprintMode==="toggle"&&cf.includes(t.code)&&(this.sprintLatch=!this.sprintLatch),this.crouchMode==="toggle"&&lf.includes(t.code)&&(this.crouchLatch=!this.crouchLatch),Lb.includes(t.code)&&this.pressInteract())};handleKeyUp=t=>{this.keys.delete(t.code),hf.includes(t.code)&&this.releaseJump()};handleBlur=()=>{this.keys.clear(),this.releaseJump()};handleCanvasPointerDown=t=>{this.locked||t.button!==0||this.requestLock()};async requestLock(){if(this.relocking)return;this.relocking=!0;const t=performance.now()+Nb;for(;!this.locked&&performance.now()<t;)await this.tryLock(),await Ob(Fb);this.relocking=!1}async tryLock(){try{await this.canvas.requestPointerLock({unadjustedMovement:!0})}catch{try{await this.canvas.requestPointerLock()}catch{}}}handleLockChange=()=>{this.locked=document.pointerLockElement===this.canvas,this.locked||this.keys.clear(),this.lookX=0,this.lookY=0,this.settling=this.locked,this.onLockChange?.(this.locked)};handleMouseMove=t=>{if(this.locked){if(this.settling){this.settling=!1;return}this.lookX+=sa(t.movementX,-ia,ia),this.lookY+=sa(t.movementY,-ia,ia)}};dispose(){window.removeEventListener("keydown",this.handleKeyDown),window.removeEventListener("keyup",this.handleKeyUp),window.removeEventListener("blur",this.handleBlur),this.canvas.removeEventListener("pointerdown",this.handleCanvasPointerDown),document.removeEventListener("pointerlockchange",this.handleLockChange),document.removeEventListener("mousemove",this.handleMouseMove)}}function jm(){return Km.touch||window.matchMedia("(pointer: coarse)").matches}function Ob(i){return new Promise(t=>window.setTimeout(t,i))}function uf(i,t){return(i?1:0)-(t?1:0)}function sa(i,t,e){return Math.min(Math.max(i,t),e)}class xr{constructor(t=new R(0,0,0),e=new R(0,1,0),n=1){this.start=t,this.end=e,this.radius=n}clone(){return new xr(this.start.clone(),this.end.clone(),this.radius)}set(t,e,n){this.start.copy(t),this.end.copy(e),this.radius=n}copy(t){this.start.copy(t.start),this.end.copy(t.end),this.radius=t.radius}getCenter(t){return t.copy(this.end).add(this.start).multiplyScalar(.5)}translate(t){this.start.add(t),this.end.add(t)}checkAABBAxis(t,e,n,s,o,r,a,c,l){return(o-t<l||o-n<l)&&(t-r<l||n-r<l)&&(a-e<l||a-s<l)&&(e-c<l||s-c<l)}intersectsBox(t){return this.checkAABBAxis(this.start.x,this.start.y,this.end.x,this.end.y,t.min.x,t.max.x,t.min.y,t.max.y,this.radius)&&this.checkAABBAxis(this.start.x,this.start.z,this.end.x,this.end.z,t.min.x,t.max.x,t.min.z,t.max.z,this.radius)&&this.checkAABBAxis(this.start.y,this.start.z,this.end.y,this.end.z,t.min.y,t.max.y,t.min.z,t.max.z,this.radius)}}const Io=new R,Do=new R,oa=new R,Lo=new R,An=new Ti,dl=new Zu,kb=new Zu,ra=new wo,No=new xr,zb=new R,Bb=new R,Hb=new R,Gb=1e-10;function Vb(i,t,e=null,n=null){const s=zb.copy(i.end).sub(i.start),o=Bb.copy(t.end).sub(t.start),r=Hb.copy(t.start).sub(i.start),a=s.dot(o),c=s.dot(s),l=o.dot(o),h=o.dot(r),u=s.dot(r);let f,d;const g=c*l-a*a;if(Math.abs(g)<Gb){const v=-h/l,m=(a-h)/l;Math.abs(v-.5)<Math.abs(m-.5)?(f=0,d=v):(f=1,d=m)}else f=(h*a+u*l)/g,d=(f*a-h)/l;d=Math.max(0,Math.min(1,d)),f=Math.max(0,Math.min(1,f)),e&&e.copy(s).multiplyScalar(f).add(i.start),n&&n.copy(o).multiplyScalar(d).add(t.start)}class $a{constructor(t){this.box=t,this.bounds=new Di,this.subTrees=[],this.triangles=[],this.layers=new fc}addTriangle(t){return this.bounds.min.x=Math.min(this.bounds.min.x,t.a.x,t.b.x,t.c.x),this.bounds.min.y=Math.min(this.bounds.min.y,t.a.y,t.b.y,t.c.y),this.bounds.min.z=Math.min(this.bounds.min.z,t.a.z,t.b.z,t.c.z),this.bounds.max.x=Math.max(this.bounds.max.x,t.a.x,t.b.x,t.c.x),this.bounds.max.y=Math.max(this.bounds.max.y,t.a.y,t.b.y,t.c.y),this.bounds.max.z=Math.max(this.bounds.max.z,t.a.z,t.b.z,t.c.z),this.triangles.push(t),this}calcBox(){return this.box=this.bounds.clone(),this.box.min.x-=.01,this.box.min.y-=.01,this.box.min.z-=.01,this}split(t){if(!this.box)return;const e=[],n=Do.copy(this.box.max).sub(this.box.min).multiplyScalar(.5);for(let o=0;o<2;o++)for(let r=0;r<2;r++)for(let a=0;a<2;a++){const c=new Di,l=Io.set(o,r,a);c.min.copy(this.box.min).add(l.multiply(n)),c.max.copy(c.min).add(n),e.push(new $a(c))}let s;for(;s=this.triangles.pop();)for(let o=0;o<e.length;o++)e[o].box.intersectsTriangle(s)&&e[o].triangles.push(s);for(let o=0;o<e.length;o++){const r=e[o].triangles.length;r>8&&t<16&&e[o].split(t+1),r!==0&&this.subTrees.push(e[o])}return this}build(){return this.calcBox(),this.split(0),this}getRayTriangles(t,e){for(let n=0;n<this.subTrees.length;n++){const s=this.subTrees[n];if(t.intersectsBox(s.box))if(s.triangles.length>0)for(let o=0;o<s.triangles.length;o++)e.indexOf(s.triangles[o])===-1&&e.push(s.triangles[o]);else s.getRayTriangles(t,e)}return e}triangleCapsuleIntersect(t,e){e.getPlane(An);const n=An.distanceToPoint(t.start)-t.radius,s=An.distanceToPoint(t.end)-t.radius;if(n>0&&s>0||n<-t.radius&&s<-t.radius)return!1;const o=Math.abs(n/(Math.abs(n)+Math.abs(s))),r=Io.copy(t.start).lerp(t.end,o);if(e.containsPoint(r))return{normal:An.normal.clone(),point:r.clone(),depth:Math.abs(Math.min(n,s))};const a=t.radius*t.radius,c=dl.set(t.start,t.end),l=[[e.a,e.b],[e.b,e.c],[e.c,e.a]];for(let h=0;h<l.length;h++){const u=kb.set(l[h][0],l[h][1]);if(Vb(c,u,oa,Lo),oa.distanceToSquared(Lo)<a)return{normal:oa.clone().sub(Lo).normalize(),point:Lo.clone(),depth:t.radius-oa.distanceTo(Lo)}}return!1}triangleSphereIntersect(t,e){if(e.getPlane(An),!t.intersectsPlane(An))return!1;const n=Math.abs(An.distanceToSphere(t)),s=t.radius*t.radius-n*n,o=An.projectPoint(t.center,Io);if(e.containsPoint(t.center))return{normal:An.normal.clone(),point:o.clone(),depth:Math.abs(An.distanceToSphere(t))};const r=[[e.a,e.b],[e.b,e.c],[e.c,e.a]];for(let a=0;a<r.length;a++){dl.set(r[a][0],r[a][1]),dl.closestPointToPoint(o,!0,Do);const c=Do.distanceToSquared(t.center);if(c<s)return{normal:t.center.clone().sub(Do).normalize(),point:Do.clone(),depth:t.radius-Math.sqrt(c)}}return!1}getSphereTriangles(t,e){for(let n=0;n<this.subTrees.length;n++){const s=this.subTrees[n];if(t.intersectsBox(s.box))if(s.triangles.length>0)for(let o=0;o<s.triangles.length;o++)e.indexOf(s.triangles[o])===-1&&e.push(s.triangles[o]);else s.getSphereTriangles(t,e)}}getCapsuleTriangles(t,e){for(let n=0;n<this.subTrees.length;n++){const s=this.subTrees[n];if(t.intersectsBox(s.box))if(s.triangles.length>0)for(let o=0;o<s.triangles.length;o++)e.indexOf(s.triangles[o])===-1&&e.push(s.triangles[o]);else s.getCapsuleTriangles(t,e)}}sphereIntersect(t){ra.copy(t);const e=[];let n,s=!1;this.getSphereTriangles(t,e);for(let o=0;o<e.length;o++)(n=this.triangleSphereIntersect(ra,e[o]))&&(s=!0,ra.center.add(n.normal.multiplyScalar(n.depth)));if(s){const o=ra.center.clone().sub(t.center),r=o.length();return{normal:o.normalize(),depth:r}}return!1}capsuleIntersect(t){No.copy(t);const e=[];let n,s=!1;this.getCapsuleTriangles(No,e);for(let o=0;o<e.length;o++)(n=this.triangleCapsuleIntersect(No,e[o]))&&(s=!0,No.translate(n.normal.multiplyScalar(n.depth)));if(s){const o=No.getCenter(new R).sub(t.getCenter(Io)),r=o.length();return{normal:o.normalize(),depth:r}}return!1}rayIntersect(t){if(t.direction.length()===0)return;const e=[];let n,s,o=1e100;this.getRayTriangles(t,e);for(let r=0;r<e.length;r++){const a=t.intersectTriangle(e[r].a,e[r].b,e[r].c,!0,Io);if(a){const c=a.sub(t.origin).length();o>c&&(s=a.clone().add(t.origin),o=c,n=e[r])}}return o<1e100?{distance:o,triangle:n,position:s}:!1}fromGraphNode(t){return t.updateWorldMatrix(!0,!0),t.traverse(e=>{if(e.isMesh===!0&&this.layers.test(e.layers)){let n,s=!1;e.geometry.index!==null?(s=!0,n=e.geometry.toNonIndexed()):n=e.geometry;const o=n.getAttribute("position");for(let r=0;r<o.count;r+=3){const a=new R().fromBufferAttribute(o,r),c=new R().fromBufferAttribute(o,r+1),l=new R().fromBufferAttribute(o,r+2);a.applyMatrix4(e.matrixWorld),c.applyMatrix4(e.matrixWorld),l.applyMatrix4(e.matrixWorld),this.addTriangle(new gn(a,c,l))}s&&n.dispose()}}),this.build(),this}clear(){return this.box=null,this.bounds.makeEmpty(),this.subTrees.length=0,this.triangles.length=0,this}}function Xt(i){return Jm(i),i}function Jm(i){if(i.userData.noCollide!==!0){i.layers.enable(km);for(const t of i.children)Jm(t)}}const Ls=[],fl=new R,Fo=new R,pl=new R,df=new R,ml=new R,ff=new R,Hs=new R,pf=new Zu,gl={normal:new R,depth:0};class Za{index={octree:new $a,triangles:0};cache=new Map;build(t,e){if(e!==void 0){const s=this.cache.get(e);if(s){this.index=s;return}}const n=Za.index(t);e!==void 0&&this.cache.set(e,n),this.index=n}warm(t,e){this.cache.has(e)||this.cache.set(e,Za.index(t))}invalidate(t){this.cache.delete(t)}static index(t){const e=new $a;return e.layers.disableAll(),e.layers.enable(km),e.fromGraphNode(t),{octree:e,triangles:Qm(e)}}get triangles(){return this.index.triangles}intersectCapsule(t){Ls.length=0,this.index.octree.getCapsuleTriangles(t,Ls);let e=0;for(const n of Ls){const s=mf(t,n);s<=e||(e=s,gl.normal.copy(Hs))}return e===0?null:(gl.depth=e,gl)}overlaps(t){Ls.length=0,this.index.octree.getCapsuleTriangles(t,Ls);for(const e of Ls)if(mf(t,e)>0)return!0;return!1}raycast(t,e){const n=this.index.octree.rayIntersect(new gr(t,e));return n?n.distance:null}}function mf(i,t){t.getNormal(Fo),fl.subVectors(i.end,i.start);const e=Fo.dot(fl);let n=0;Math.abs(e)>1e-6&&(n=Fo.dot(pl.subVectors(t.a,i.start))/e,n=Math.min(Math.max(n,0),1)),pl.copy(i.start).addScaledVector(fl,n),t.closestPointToPoint(pl,df),pf.set(i.start,i.end),pf.closestPointToPoint(df,!0,ml),t.closestPointToPoint(ml,ff),Hs.subVectors(ml,ff);const s=Hs.length();return s>=i.radius||(s>1e-6?Hs.divideScalar(s):Hs.copy(Fo),Hs.dot(Fo)<=0)?0:i.radius-s}function Qm(i){let t=i.triangles.length;for(const e of i.subTrees)t+=Qm(e);return t}const vl=1/120,gf=16,Wb=4,aa=6,Xb=.28,ri={radius:.32,height:1.8,eyeHeight:1.35,walkSpeed:4.2,sprintScale:1.75,crouchScale:.52,crouchHeight:.58,crouchSpeed:22,crouchDrag:.45,stepSmoothing:16,groundAccel:14,airAccel:7.5,friction:10,stopSpeed:1.6,gravity:26,jumpSpeed:7.2,coyoteTime:.22,jumpBuffer:.15,autoHop:!1,slopeLimitDeg:50,stepHeight:.45,lookSensitivity:.0022,invertY:!1,invertX:!1,bobScale:1,bobAmount:.02,bobSway:.012,bobRoll:.004,bobStepsPerSecond:1.9,bobSpeedInfluence:.5,firstStepFraction:.65,maxAirSpeed:1.12,fov:80,fovScaling:"vertical",sprintFovBoost:8,landDip:.02},Rn=new R,vf=new R,ca=new R,yl=new R,yf=new R,la=new R,wl=new R,qb=new R,ha=new R,wf=new R,$e=new xr,xl={x:0,y:0};let Yb=class{tuning={...ri};velocity=new R;onFootstep=null;onLand=null;onJump=null;camera;input;collider;capsule=new xr;yaw=0;pitch=0;zoomedOut=!1;authoredFov=ri.fov;crouch=0;stepLag=0;stance=0;lastFeetY=null;groundNormal=new R(0,1,0);wishX=0;wishZ=0;grounded=!1;jumped=!1;timeOffGround=0;timeSinceLand=1/0;bobPhase=0;strideProgress=.65;dip=0;accumulator=0;constructor(t,e,n){this.camera=t,this.input=e,this.collider=n,this.camera.rotation.order="YXZ",this.authoredFov=this.tuning.fov,this.applyProjection(),this.teleport(new R(0,2,6),0)}teleport(t,e=this.yaw){const{radius:n,height:s}=this.tuning;this.capsule.set(new R(t.x,t.y+n,t.z),new R(t.x,t.y+s-n,t.z),n),this.velocity.set(0,0,0),this.yaw=e,this.grounded=!1,this.stance=0,this.crouch=0,this.stepLag=0,this.lastFeetY=null}setFieldOfView(t,e,n){this.tuning.fov=t,this.tuning.sprintFovBoost=e,this.tuning.fovScaling=n,this.authoredFov=t+(this.zoomedOut?e:0),this.applyProjection()}applyProjection(){const t=this.authoredFov,e=this.tuning.fovScaling==="vertical"?t:ir.radToDeg(2*Math.atan(Math.tan(ir.degToRad(t)/2)/this.camera.aspect));Math.abs(e-this.camera.fov)>.001&&(this.camera.fov=e,this.camera.updateProjectionMatrix())}get position(){return qb.copy(this.capsule.start).setY(this.capsule.start.y-this.tuning.radius)}get heading(){return this.yaw}get isGrounded(){return this.grounded}get speed(){return Math.hypot(this.velocity.x,this.velocity.z)}update(t){this.applyLook(),this.accumulator+=t;let e=0;for(;this.accumulator>=vl&&e<gf;)this.step(vl),this.accumulator-=vl,e+=1;e===gf&&(this.accumulator=0),this.applyCamera(t)}applyLook(){this.input.drainLook(xl);const{lookSensitivity:t,invertY:e,invertX:n}=this.tuning;this.yaw-=xl.x*t*(n?-1:1),this.pitch-=xl.y*t*(e?-1:1);const s=Math.PI/2-.001;this.pitch=Math.min(Math.max(this.pitch,-s),s),this.yaw=this.yaw%(Math.PI*2)}step(t){const e=this.tuning;this.jumped=!1,this.grounded?(this.timeOffGround=0,this.timeSinceLand+=t,this.applyFriction(t)):(this.timeOffGround+=t,this.velocity.y-=e.gravity*t),this.applyWish(t),this.applyJump(),this.capAirSpeed();const n=this.grounded,s=-this.velocity.y;this.move(t),this.grounded&&!n&&(this.timeSinceLand=0,s>1&&(this.dip+=Math.min(s,18)*e.landDip,this.onLand?.(s))),this.advanceBob(t)}applyFriction(t){const e=this.tuning,n=this.velocity.length();if(n<1e-4){this.velocity.set(0,0,0);return}const s=Math.max(n,e.stopSpeed)*e.friction*t;this.velocity.multiplyScalar(Math.max(n-s,0)/n)}applyWish(t){const e=this.tuning,{moveX:n,moveZ:s}=this.input;vf.set(-Math.sin(this.yaw),0,-Math.cos(this.yaw)),ca.set(Math.cos(this.yaw),0,-Math.sin(this.yaw)),Rn.set(0,0,0).addScaledVector(vf,s).addScaledVector(ca,n);const o=Rn.length();if(o<1e-4){this.wishX=0,this.wishZ=0;return}if(Rn.divideScalar(o),this.wishX=Rn.x,this.wishZ=Rn.z,this.grounded){Rn.projectOnPlane(this.groundNormal);const h=Rn.length();if(h<1e-4)return;Rn.divideScalar(h)}const r=e.walkSpeed*Math.min(o,1)*(this.input.sprint?e.sprintScale:1)*(1-this.stance*(1-e.crouchDrag)),a=this.velocity.dot(Rn),c=r-a;if(c<=0)return;const l=this.grounded?e.groundAccel:e.airAccel;this.velocity.addScaledVector(Rn,Math.min(l*r*t,c))}capAirSpeed(){if(this.grounded)return;const t=this.tuning,e=t.walkSpeed*t.sprintScale*t.maxAirSpeed,n=Math.hypot(this.velocity.x,this.velocity.z);if(n<=e||n<1e-6)return;const s=e/n;this.velocity.x*=s,this.velocity.z*=s}applyJump(){const t=this.tuning;!(this.grounded||this.timeOffGround<t.coyoteTime)||!(this.input.takeJump(t.jumpBuffer)||t.autoHop&&this.input.jumping)||(this.velocity.y=t.jumpSpeed,this.grounded=!1,this.jumped=!0,this.timeSinceLand>Xb&&this.onJump?.(),this.timeSinceLand=0,this.timeOffGround=t.coyoteTime)}move(t){const e=this.tuning;yf.copy(this.velocity).multiplyScalar(t),wl.copy(this.capsule.start);const n=this.grounded,s=this.velocity.x,o=this.velocity.z;this.grounded=!1,this.capsule.translate(yf),this.resolve(),n&&!this.grounded&&!this.jumped&&this.snapToGround(),!(e.stepHeight<=0||this.wishX===0&&this.wishZ===0||this.velocity.y>.1||(this.capsule.start.x-wl.x)*this.wishX+(this.capsule.start.z-wl.z)*this.wishZ>=e.walkSpeed*t*.5)&&this.tryStepUp(t)&&(this.velocity.x=s,this.velocity.z=o,this.velocity.y=0)}resolve(){const t=Math.cos(this.tuning.slopeLimitDeg*Math.PI/180);for(let e=0;e<Wb;e++){const n=this.collider.intersectCapsule(this.capsule);if(!n)break;this.capsule.translate(yl.copy(n.normal).multiplyScalar(n.depth)),n.normal.y>t&&(this.grounded=!0,this.groundNormal.copy(n.normal));const s=this.velocity.dot(n.normal);s<0&&this.velocity.addScaledVector(n.normal,-s)}this.grounded||this.groundNormal.set(0,1,0)}headroom(){if(this.stance<.01)return!0;const t=this.tuning,e=this.capsule.start.y-t.radius;return $e.copy(this.capsule),$e.start.set(this.capsule.start.x,e+t.radius,this.capsule.start.z),$e.end.set(this.capsule.start.x,e+t.height-t.radius,this.capsule.start.z),!this.collider.overlaps($e)}applyStance(){if(Math.abs(this.crouch-this.stance)<.001)return;this.stance=this.crouch;const t=this.tuning,e=this.capsule.start.y-t.radius,n=t.height*(1-this.stance*(1-t.crouchHeight));this.capsule.end.set(this.capsule.start.x,e+Math.max(n-t.radius,t.radius+.01),this.capsule.start.z)}snapToGround(){const t=this.tuning,e=Math.cos(t.slopeLimitDeg*Math.PI/180),n=Math.max(t.stepHeight,.05)/aa;la.set(0,-n,0),$e.copy(this.capsule);for(let s=0;s<aa;s++){$e.translate(la);const o=this.collider.intersectCapsule($e);if(o){if(o.normal.y<=e)return;$e.translate(yl.set(0,n,0)),this.capsule.copy($e),this.grounded=!0,this.groundNormal.copy(o.normal);return}}}tryStepUp(t){const e=this.tuning,n=Math.max(e.walkSpeed*t,.02);if(ha.set(this.capsule.start.x+this.wishX*n,this.capsule.start.y+e.stepHeight,this.capsule.start.z+this.wishZ*n),wf.copy(ha).setY(ha.y+e.height-e.radius*2),$e.set(ha,wf,e.radius),this.collider.overlaps($e))return!1;const s=e.stepHeight/aa;la.set(0,-s,0);for(let o=0;o<aa;o++)if($e.translate(la),this.collider.overlaps($e))return $e.translate(yl.set(0,s,0)),this.capsule.copy($e),this.grounded=!0,this.groundNormal.set(0,1,0),!0;return!1}advanceBob(t){const e=this.tuning;if(!this.grounded)return;const n=this.speed;if(n<.15){this.bobPhase+=(Math.round(this.bobPhase)-this.bobPhase)*Math.min(t*8,1),this.strideProgress=e.firstStepFraction;return}const s=e.walkSpeed/Math.max(e.bobStepsPerSecond,.1),o=Math.max(.2,s*Math.pow(n/e.walkSpeed,1-e.bobSpeedInfluence));for(this.strideProgress+=n*t/o,this.bobPhase+=n*t/(o*2);this.strideProgress>=1;)this.strideProgress-=1,this.onFootstep?.(n)}applyCamera(t){const e=this.tuning,n=this.input.crouching||!this.headroom()?1:0;this.crouch+=(n-this.crouch)*Math.min(t*e.crouchSpeed,1),this.applyStance();const s=this.bobPhase*Math.PI*2;ca.set(Math.cos(this.yaw),0,-Math.sin(this.yaw));const o=Math.min(this.speed/e.walkSpeed,1)*e.bobScale;this.dip=Math.max(this.dip-this.dip*Math.min(t*9,1),0);const r=this.capsule.start.y-e.radius;if(this.lastFeetY!==null&&this.grounded){const c=r-this.lastFeetY;c>.001&&c<e.stepHeight*1.2&&(this.stepLag+=c)}this.lastFeetY=r,this.stepLag=Math.max(0,this.stepLag-this.stepLag*Math.min(t*e.stepSmoothing,1)),this.camera.position.set(this.capsule.start.x,r-this.stepLag+e.eyeHeight*(1-this.stance*(1-e.crouchScale))-this.dip+Math.sin(s*2)*e.bobAmount*o,this.capsule.start.z),this.camera.position.addScaledVector(ca,Math.sin(s)*e.bobSway*o),this.camera.rotation.set(this.pitch,this.yaw,Math.sin(s)*e.bobRoll*o),this.zoomedOut?(!this.input.sprint||this.speed<.4)&&(this.zoomedOut=!1):this.input.sprint&&this.speed>1.2&&(this.zoomedOut=!0);const a=e.fov+(this.zoomedOut?e.sprintFovBoost:0);this.authoredFov=ir.damp(this.authoredFov,a,6,t),this.applyProjection()}};const Ns=64,$b=.85,xf=2.2;class Zb{input;root;stickBase;stickKnob;jumpPad;stick=null;lookPointer=null;lastLookX=0;lastLookY=0;constructor(t,e){this.input=t,this.root=document.createElement("div"),this.root.className="touch",this.stickBase=document.createElement("div"),this.stickBase.className="touch-stick",this.stickKnob=document.createElement("div"),this.stickKnob.className="touch-stick-knob",this.stickBase.appendChild(this.stickKnob),this.jumpPad=document.createElement("div"),this.jumpPad.className="touch-jump",this.jumpPad.textContent="↑",this.root.append(this.stickBase,this.jumpPad),e.appendChild(this.root),this.root.addEventListener("pointerdown",this.handleDown),window.addEventListener("pointermove",this.handleMove),window.addEventListener("pointerup",this.handleUp),window.addEventListener("pointercancel",this.handleUp),this.jumpPad.addEventListener("pointerdown",this.handleJumpDown),this.jumpPad.addEventListener("pointerup",this.handleJumpUp),this.jumpPad.addEventListener("pointercancel",this.handleJumpUp)}handleDown=t=>{const e=t.clientX<window.innerWidth/2;if(e&&this.stick===null){this.stick={pointerId:t.pointerId,originX:t.clientX,originY:t.clientY},this.stickBase.style.left=`${t.clientX}px`,this.stickBase.style.top=`${t.clientY}px`,this.stickBase.classList.add("is-active"),this.updateStick(t.clientX,t.clientY);return}!e&&this.lookPointer===null&&(this.lookPointer=t.pointerId,this.lastLookX=t.clientX,this.lastLookY=t.clientY)};handleMove=t=>{if(this.stick?.pointerId===t.pointerId){this.updateStick(t.clientX,t.clientY);return}this.lookPointer===t.pointerId&&(this.input.addLook((t.clientX-this.lastLookX)*xf,(t.clientY-this.lastLookY)*xf),this.lastLookX=t.clientX,this.lastLookY=t.clientY)};handleUp=t=>{this.stick?.pointerId===t.pointerId&&(this.stick=null,this.input.setStick(0,0,!1),this.stickBase.classList.remove("is-active"),this.stickKnob.style.transform="translate(-50%, -50%)"),this.lookPointer===t.pointerId&&(this.lookPointer=null)};handleJumpDown=t=>{t.stopPropagation(),this.jumpPad.classList.add("is-active"),this.input.pressJump()};handleJumpUp=()=>{this.jumpPad.classList.remove("is-active"),this.input.releaseJump()};updateStick(t,e){if(!this.stick)return;let n=t-this.stick.originX,s=e-this.stick.originY;const o=Math.hypot(n,s);if(o>Ns){const a=Ns/o;n*=a,s*=a}this.stickKnob.style.transform=`translate(calc(-50% + ${n}px), calc(-50% + ${s}px))`;const r=Math.min(o,Ns)/Ns;this.input.setStick(n/Ns,-s/Ns,r>$b)}dispose(){this.root.removeEventListener("pointerdown",this.handleDown),window.removeEventListener("pointermove",this.handleMove),window.removeEventListener("pointerup",this.handleUp),window.removeEventListener("pointercancel",this.handleUp),this.root.remove()}}const Ka=4,Pn=256,_f=Pn/Ka,Kb=.82,jb=.6,Jb=4,Mf=.6,bf=1.4;function ua(i,t){return Math.min(Math.max(t+.5-i,0),1)}function da(i,t){const e=(i%t+t)%t;return Math.min(e,t-e)}let _l=null;function Sf(){if(_l)return _l;const i=new Uint8Array(Pn*Pn*4);for(let e=0;e<Pn;e++)for(let n=0;n<Pn;n++){const s=n+.5,o=e+.5,r=Math.max(ua(da(s,Pn),bf),ua(da(o,Pn),bf)),a=Math.max(ua(da(s,_f),Mf),ua(da(o,_f),Mf)),c=Math.min(1-r*(1-jb),1-a*(1-Kb)),l=Math.round(c*255),h=(e*Pn+n)*4;i[h]=l,i[h+1]=l,i[h+2]=l,i[h+3]=255}const t=new Vu(i,Pn,Pn,vn);return t.wrapS=cs,t.wrapT=cs,t.colorSpace=ei,t.generateMipmaps=!0,t.minFilter=Ai,t.magFilter=He,t.anisotropy=16,t.needsUpdate=!0,_l=t,t}function _c(i=400,t={}){const e=t.segments??Math.max(8,Math.round(i/Jb)),n=new En(i,i,e,e);n.rotateX(-Math.PI/2);const s=n.getAttribute("uv");for(let a=0;a<s.count;a++)s.setXY(a,(s.getX(a)-.5)*(i/Ka),(s.getY(a)-.5)*(i/Ka));s.needsUpdate=!0;const o=t.material??new Re({color:t.color??13286300});o.map!==Sf()&&(o.map=Sf(),o.needsUpdate=!0);const r=new $t(n,o);return r.name="flatGround",r.position.y=t.y??-.01,t.collidable===!1?r:Xt(r)}const tg=Ka,Ef={ground:"#cabb9c",cube:"#525f66",marker:"#b08040",ramp:"#38474a",stair:"#3d4b52",platform:"#46505c",wall:"#2e3640"},Qb=208,tS=52,eS=14474440,nS=6044206,iS=new R(0,.1,10);function Ze(i,t,e,n,s,o,r){const a=new $t(new k(i,t,e),n);return a.position.set(s,o+t/2,r),a}function sS(i,t,e,n){const s=new Cm;s.moveTo(0,0),s.lineTo(t,0),s.lineTo(t,t*Math.tan(e*Math.PI/180)),s.closePath();const o=new Yu(s,{depth:i,bevelEnabled:!1});return o.translate(0,0,-i/2),o.rotateY(Math.PI/2),new $t(o,n)}function Ml(i,t,e,n,s,o){const a=new En(i,t,96,1),c=a.getAttribute("position"),l=new Float32Array(c.count*3),h=new Vt;for(let f=0;f<c.count;f++){const d=c.getX(f)/i+.5,[g,v,m]=o(Math.min(Math.max(d,0),1));h.setRGB(g,v,m,hn),h.toArray(l,f*3)}a.setAttribute("color",new ze(l,3));const u=new $t(a,new vr({vertexColors:!0}));return u.position.set(e,n,s),u}class oS{root=new he;colors={...Ef};materials={};constructor(){this.root.name="ProvingGround";for(const t of Object.keys(this.colors))this.materials[t]=new Re({color:this.colors[t],flatShading:!0});this.populate()}populate(){return this.root.children.length>0?this.root:(this.addGround(),this.addHeightReference(),this.addMeasuredCubes(),this.addDistanceMarkers(),this.addMovementGym(),this.addCalibrationBoard(),this.root)}applyColors(){for(const t of Object.keys(this.colors))this.materials[t].color.set(this.colors[t])}resetColors(){Object.assign(this.colors,Ef),this.applyColors()}addGround(){this.root.add(_c(Qb,{segments:tS,material:this.materials.ground})),this.root.add(new PM(2))}addHeightReference(){const t=new he,e=.3,n=6;for(let s=0;s<n;s++){const o=new $t(new k(.08,e,.08),new Re({color:s%2===0?eS:nS,flatShading:!0}));o.position.y=e*(s+.5),t.add(o)}t.position.set(-2,0,0),this.root.add(t)}addMeasuredCubes(){const t=[1,2,4];let e=4;for(const n of t)this.root.add(Xt(Ze(n,n,n,this.materials.cube,e+n/2,0,0))),e+=n+1}addDistanceMarkers(){for(const t of[5,10,20,30])this.root.add(Xt(Ze(.1,2,.1,this.materials.marker,0,0,-t)))}addMovementGym(){const t=new he;t.name="MovementGym",this.addRamps(t),this.addStairs(t),this.addKerbs(t),this.addJumpGaps(t),this.addFallWalkway(t),this.addParkour(t),this.root.add(Xt(t))}addRamps(t){const e=[10,20,30,45],n=4;e.forEach((s,o)=>{const r=sS(2.5,n,s,this.materials.ramp);r.position.set(-6-o*4,0,-2),t.add(r);const a=n*Math.tan(s*Math.PI/180);t.add(Ze(2.5,.2,2,this.materials.ramp,-6-o*4,a-.2,-7))})}addStairs(t){const e=[{rise:.18,run:.3,x:-24},{rise:.3,run:.3,x:-28}];for(const n of e)for(let s=0;s<8;s++){const o=n.rise*(s+1);t.add(Ze(2.5,o,n.run,this.materials.stair,n.x,0,-2-s*n.run))}}addKerbs(t){[.2,.35,.5,.9].forEach((e,n)=>{t.add(Ze(3,e,2,this.materials.platform,-8-n*4,0,5))})}addJumpGaps(t){const e=[1.5,2.5,3.5],n=3,s=1.2;let o=18;t.add(Ze(3,s,n,this.materials.platform,-26,0,o));for(const r of e)o-=n+r,t.add(Ze(3,s,n,this.materials.platform,-26,0,o))}addParkour(t){const e=new he;e.name="Parkour";let n=8;for(const o of[0,1.4,1.8,2.2,2.6])n+=o,e.add(Ze(.7,.9,.7,this.materials.platform,-6,0,n));const s=-10;for(const o of[-1,1])e.add(Ze(.3,2.2,7,this.materials.wall,s+o*1.05,0,11.5));for(const[o,r]of[[1.6,9],[1.3,11.5],[1.1,14]])e.add(Ze(2.4,.3,.5,this.materials.wall,s,o,r));e.add(Ze(1.2,.6,1.2,this.materials.platform,-14,0,7.4)),n=8.4;for(const o of[.9,.7,.5,.35])e.add(Ze(o,1.2,2.4,this.materials.platform,-14,0,n)),n+=3.4;n=8;for(const o of[.55,.65,.75,.9]){for(const r of[-1,1])e.add(Ze(1.4,2,.6,this.materials.wall,-18+r*(o/2+.7),0,n));n+=2.6}t.add(e)}addFallWalkway(t){t.add(Ze(2.5,.2,8,this.materials.platform,-18,3.8,-12))}addCalibrationBoard(){const t=new he;t.name="CalibrationBoard";const e=7,n=-12;t.add(Xt(Ze(12,6,.3,this.materials.wall,e,0,n)));const s=[[16711680,65280,255,16777215],[65535,16711935,16776960,0],[3355443,6710886,10066329,13421772],[9278609,6044206,11567168,3028544]],o=.9;s.forEach((l,h)=>{l.forEach((u,f)=>{const d=new $t(new En(o,o),new vr({color:u}));d.position.set(e-4.6+f*(o+.15),5.1-h*(o+.15),n+.16),t.add(d)})}),t.add(Ml(5.2,.7,e+2.6,4.3,n+.16,l=>[l,l,l])),t.add(Ml(5.2,.7,e+2.6,3.4,n+.16,l=>[l,l*.35,.12])),t.add(Ml(5.2,.7,e+2.6,2.5,n+.16,l=>[.1,l*.6,l]));const r=new $t(new yr(1.1,48,32),new Re({color:9278609}));r.position.set(e-8.5,1.1,n),t.add(Xt(r));const a=Math.PI/6,c=new $t(new En(6,4),new Re({color:7305853,side:mn}));c.position.set(e-13.5,2*Math.cos(a),n),c.rotation.x=-a,t.add(Xt(c)),this.root.add(t)}dispose(){this.root.traverse(t=>{if(t instanceof $t||t instanceof Wu||t instanceof Sm){t.geometry.dispose();const e=t.material;if(Array.isArray(e))for(const n of e)n.dispose();else e.dispose()}}),this.root.clear()}}function rS(i,t){return Math.PI*i*t}function fo(i,t,e,n={}){const s=n.ring??"excitation",o=n.compensation??"energy",r=n.maxQ??(s==="filter"?220:14),a=[],c=[];return{inputs:t.map(h=>{const u=i.createGain(),f=i.createBiquadFilter();f.type="bandpass",f.frequency.value=h.hz;const d=h.q??(s==="filter"?Math.min(r,Math.max(1,rS(h.hz,h.decay))):Math.min(r,Math.max(4,4+h.decay*24)));f.Q.value=d,c.push(d);const g=i.createGain();return g.gain.value=o==="energy"?Math.sqrt(d):1/Math.sqrt(d),u.connect(f).connect(g).connect(e),a.push(u,f,g),u}),modes:t,qs:c,dispose(){for(const h of a)h.disconnect()}}}const au=8,bl=48;function eg(i){return Array.from({length:au},(t,e)=>{const n=((e+1)/au)**2,s=new Float32Array(bl);for(let o=0;o<bl;o++)s[o]=n*i(o/(bl-1));return s})}const aS=eg(i=>.5*(1-Math.cos(2*Math.PI*i)));eg(i=>{if(i<.05)return .5*(1-Math.cos(Math.PI*(i/.05)));const e=(i-.05)/(1-.05);return Math.exp(-5*e)*(1-e)});function cS(i){return i[Math.floor(Math.random()*au)]}function _r(i,t,e,n,s){i.setValueAtTime(0,t),i.linearRampToValueAtTime(e,t+n),i.setTargetAtTime(0,t+n,s/3)}function ng(i,t,e){const n=i.createGain(),s=i.createBiquadFilter();return s.type="bandpass",s.frequency.value=t.hz,s.Q.value=t.q,n.connect(s).connect(e),{input:n,dispose(){n.disconnect(),s.disconnect()}}}function ig(i,t,e,n,s,o){const r=n.count/Math.max(n.over,.001);let a=0;for(let c=0;c<n.count&&(a+=-Math.log(1-Math.random()*.999-.001)/r,!(a>n.over*1.4));c++){const l=Math.exp(-a/n.energyDecay),h=o*n.level*l*(.35+Math.random()*.65);if(h<.002)continue;const u=i.createBufferSource();u.buffer=t,u.playbackRate.value=.7+Math.random()*.7;const f=i.createGain(),d=s+a;_r(f.gain,d,h,8e-4,.012),u.connect(f).connect(e),u.start(d,Math.random()*Math.max(t.duration-.2,0),.06),u.stop(d+.07)}}function kn(i,t,e,n,s,o){if(s<=5e-4)return;const r=i.createBufferSource();r.buffer=t;const a=i.createGain();_r(a.gain,n,s,Math.min(.0012,o*.3),o*1.6),r.connect(a).connect(e),r.start(n,Math.random()*Math.max(t.duration-.5,0),o+.05),r.stop(n+o+.06)}function Mc(i,t,e,n,s,o,r,a=.002){if(n<=5e-4)return;const c=i.createOscillator();c.type="sine",c.frequency.setValueAtTime(s,e),c.frequency.exponentialRampToValueAtTime(Math.max(o,1),e+r);const l=i.createGain();_r(l.gain,e,n,a,r),c.connect(l).connect(t),c.start(e),c.stop(e+r*3+.06)}const fa={stone:{level:.5,impact:{level:.9,duration:.011,tone:3800},modes:[{hz:620,decay:.06,level:.6},{hz:1450,decay:.03,level:.32},{hz:2600,decay:.018,level:.12}],grit:{count:5,over:.06,energyDecay:.025,hz:2600,q:1.2,level:.12},toe:.45,roll:.075},wood:{level:.6,impact:{level:.7,duration:.018,tone:1700},modes:[{hz:155,decay:.22,level:1},{hz:390,decay:.15,level:.6},{hz:720,decay:.075,level:.22}],grit:{count:4,over:.05,energyDecay:.02,hz:1200,q:.9,level:.08},toe:.6,roll:.085},earth:{level:.5,impact:{level:1,duration:.022,tone:900},modes:[{hz:120,decay:.05,level:.55}],grit:{count:9,over:.07,energyDecay:.028,hz:1600,q:1,level:.22},toe:.4,roll:.085},gravel:{level:.5,impact:{level:.45,duration:.012,tone:2400},modes:[],grit:{count:26,over:.16,energyDecay:.06,hz:3e3,q:1.4,level:.75},toe:.7,roll:.09},grass:{level:.32,impact:{level:.5,duration:.03,tone:1400},modes:[],grit:{count:16,over:.11,energyDecay:.045,hz:5200,q:.9,level:.4},toe:.6,roll:.085},leaves:{level:.4,impact:{level:.35,duration:.02,tone:2600},modes:[],grit:{count:34,over:.2,energyDecay:.08,hz:4200,q:2.2,level:.55},toe:.75,roll:.09},metal:{level:.45,impact:{level:.9,duration:.004,tone:9e3},modes:[{hz:480,decay:.5,level:.5},{hz:1270,decay:.42,level:.45},{hz:2340,decay:.3,level:.3},{hz:4100,decay:.18,level:.2}],grit:null,toe:.5,roll:.07},mud:{level:.5,impact:{level:1,duration:.05,tone:700},modes:[{hz:240,decay:.06,level:.35}],grit:{count:6,over:.09,energyDecay:.03,hz:900,q:3.2,level:.3},toe:.3,roll:.1}},lS=6,Tf=.35,hS=9;function Uo(i,t){return i+Math.random()*(t-i)}class uS{surface="earth";engine;output;body;panner;reverbSend;chains=new Map;left=!1;constructor(t,e=.55){this.engine=t;const n=t.context;this.output=n.createGain(),this.output.gain.value=e,this.body=n.createBiquadFilter(),this.body.type="lowpass",this.body.frequency.value=5200,this.body.Q.value=.6,this.panner=n.createStereoPanner(),this.reverbSend=n.createGain(),this.reverbSend.gain.value=.6,this.output.connect(this.body),this.body.connect(this.panner),this.panner.connect(t.dry),this.panner.connect(this.reverbSend),this.reverbSend.connect(t.send)}setReverb(t){this.reverbSend.gain.setTargetAtTime(Math.max(0,t),this.engine.context.currentTime,.1)}step(t){const e=this.engine.context;if(e.state!=="running"||!this.engine.noise)return;const n=fa[this.surface],s=this.chainFor(this.surface),o=e.currentTime+.004,r=Tf+(1-Tf)*(1-Math.exp(-t/(lS*.45))),a=n.level*Math.min(r,1);if(this.panner.pan.setValueAtTime(this.takeFoot()*.2,o),this.strike(s,n,o,a*Uo(.9,1.1)),n.toe>0){const c=n.roll*Math.max(.35,1-t/12);this.strike(s,n,o+c,a*n.toe*Uo(.8,1.1))}}land(t){const e=this.engine.context;if(e.state!=="running"||!this.engine.noise)return;const n=fa[this.surface],s=this.chainFor(this.surface),o=e.currentTime+.004,r=Math.min(t/hS,1),a=n.level*(.7+r*.85);this.panner.pan.setValueAtTime(0,o),this.strike(s,n,o,a),this.strike(s,n,o+Uo(.012,.03),a*Uo(.4,.6))}jump(){const t=this.engine.context;if(t.state!=="running"||!this.engine.noise)return;const e=fa[this.surface],n=this.chainFor(this.surface),s=t.currentTime+.004;this.panner.pan.setValueAtTime(this.takeFoot()*.12,s),this.strike(n,e,s,e.level*Uo(.42,.55),{stretch:3.2,modes:.28,grit:1.7})}takeFoot(){const t=this.left?-1:1;return this.left=!this.left,t}strike(t,e,n,s,o){const r=this.engine.context,a=this.engine.noise;if(!a)return;const c=o?.stretch??1,l=o?.modes??1,h=o?.grit??1;kn(r,a.white,t.impactInput,n,s*e.impact.level,e.impact.duration*c);for(let u=0;u<e.modes.length;u++)kn(r,a.white,t.bank.inputs[u],n,s*e.modes[u].level*.5*l,.002);e.grit&&t.gritInput&&ig(r,a.white,t.gritInput,e.grit,n,s*h)}chainFor(t){const e=this.chains.get(t);if(e)return e;const n=this.engine.context,s=fa[t],o=n.createGain(),r=n.createBiquadFilter();r.type="lowpass",r.frequency.value=s.impact.tone,o.connect(r).connect(this.output);const a=fo(n,s.modes,this.output,{ring:"filter",compensation:"inverse"});let c=null;s.grit&&(c=ng(n,s.grit,this.output).input);const l={impactInput:o,bank:a,gritInput:c};return this.chains.set(t,l),l}dispose(){this.output.disconnect(),this.body.disconnect(),this.panner.disconnect(),this.reverbSend.disconnect()}}const dS=6;function sg(i){const t=Math.floor(i.sampleRate*dS);return{white:Sl(i,t,pS()),pink:Sl(i,t,mS()),brown:Sl(i,t,gS())}}function Sl(i,t,e){const n=i.createBuffer(1,t,i.sampleRate),s=n.getChannelData(0);for(let r=0;r<t;r++)s[r]=e();const o=Math.min(2048,t/4|0);for(let r=0;r<o;r++){const a=r/o;s[r]=s[r]*a+s[t-o+r]*(1-a)}return fS(s),n}function fS(i){let t=0;for(let n=0;n<i.length;n++)t=Math.max(t,Math.abs(i[n]));if(t===0)return;const e=.95/t;for(let n=0;n<i.length;n++)i[n]*=e}function pS(){return()=>Math.random()*2-1}function mS(){let i=0,t=0,e=0,n=0,s=0,o=0,r=0;return()=>{const a=Math.random()*2-1;i=.99886*i+a*.0555179,t=.99332*t+a*.0750759,e=.969*e+a*.153852,n=.8665*n+a*.3104856,s=.55*s+a*.5329522,o=-.7616*o-a*.016898;const c=i+t+e+n+s+o+r+a*.5362;return r=a*.115926,c*.11}}function gS(){let i=0;return()=>{const t=Math.random()*2-1;return i=(i+.02*t)/1.02,i*3.5}}function Fn(i,t,e,n=.06){const s=i.createBufferSource();return s.buffer=t,s.loop=!0,s.playbackRate.value=1+(Math.random()*2-1)*n,s.connect(e),s.start(0,Math.random()*t.duration),{source:s,stop(o=0){try{s.stop(o)}catch{}}}}const pa={open:{rt60:.7,preDelay:.012,damping:.7,wet:.12},cell:{rt60:.45,preDelay:.004,damping:.55,wet:.3},hall:{rt60:4.2,preDelay:.035,damping:.18,wet:.62}};async function vS(i,t){const e=Math.max(t.rt60,.05),n=Math.ceil(i*(e+t.preDelay)),s=new OfflineAudioContext(2,n,i),o=s.createBufferSource();o.buffer=yS(s,n,i,t);const r=s.createBiquadFilter();r.type="lowpass",r.frequency.value=700+(1-t.damping)**2*17300;const a=s.createBiquadFilter();return a.type="highpass",a.frequency.value=90,o.connect(r).connect(a).connect(s.destination),o.start(0),s.startRendering()}function yS(i,t,e,n){const s=i.createBuffer(2,t,e),o=Math.floor(n.preDelay*e),r=Math.exp(-Math.log(1e3)/(n.rt60*e));for(let a=0;a<2;a++){const c=s.getChannelData(a);let l=1;for(let h=o;h<t;h++)c[h]=(Math.random()*2-1)*l,l*=r}return s}const El=[1,.4,.2,.1],wS=[1,2.7,6.1,13.3],Af=.11;function Rf(i){let t=Math.imul(i|0,668265261);return t^=t>>>15,t=Math.imul(t,2246822507),t^=t>>>13,(t>>>0)/4294967296}function cu(i){const t=Math.floor(i),e=i-t,n=(1-Math.cos(e*Math.PI))*.5;return Rf(t)*(1-n)+Rf(t+1)*n}const xS=1.35;function Cf(i){let t=0,e=0;for(let s=0;s<El.length;s++)t+=cu(i*wS[s]+s*17.3)*El[s],e+=El[s];const n=t/e;return Math.min(1,Math.max(0,.5+(n-.5)*xS))}const _S={windSpeed:.5,gustDepth:.6,gustRate:.06,windDirection:2.1,frontSpeed:9};class og{settings={..._S};gust=0;swell=.5;strength=0;time=0;update(t){this.time+=t*this.settings.gustRate,this.gust=Cf(this.time),this.swell=cu(this.time*Af+91.7),this.strength=this.fieldAt(this.time)}fieldAt(t){const{windSpeed:e,gustDepth:n}=this.settings,s=Cf(t),o=cu(t*Af+91.7),r=e*(.45+o*1.1);return Math.min(1,Math.max(0,r+(s-.5)*n))}lagAt(t,e){const{windDirection:n,frontSpeed:s,gustRate:o}=this.settings;return(t*Math.cos(n)+e*Math.sin(n))/Math.max(s,.5)*o}strengthAt(t,e){return this.fieldAt(this.time-this.lagAt(t,e))}get phase(){return this.time}}const MS=""+new URL("processor-Xg0mnuxH.js",import.meta.url).href,Pf=new WeakMap;function bS(i){let t=Pf.get(i);return t||(t=i.audioWorklet.addModule(MS),Pf.set(i,t)),t}const If=new Map;async function SS(i,t){let e=If.get(i);return e||(e=fetch(i).then(n=>{if(!n.ok)throw new Error(`${n.status} ${n.statusText}`);return n.arrayBuffer()}).then(n=>({wasm:n,meta:t})).catch(n=>(console.warn(`faust: could not load ${i} — falling back`,n),null)),If.set(i,e)),e}async function rg(i,t,e){try{const[n]=await Promise.all([SS(t,e),bS(i)]);if(!n)return null;const s=new AudioWorkletNode(i,"faust-processor",{numberOfInputs:e.inputs>0?1:0,numberOfOutputs:1,outputChannelCount:[Math.max(e.outputs,1)],processorOptions:{wasm:n.wasm,meta:n.meta}}),o=new Map;for(const[r,a]of Object.entries(e.params))o.set(r,a.init);return{node:s,meta:e,set(r,a){o.set(r,a),s.port.postMessage({type:"param",key:r,value:a})},get(r){return o.get(r)??0},dispose(){s.port.onmessage=null,s.disconnect()}}}catch(n){return console.warn("faust: worklet unavailable — falling back",n),null}}const ag=Object.freeze(Object.defineProperty({__proto__:null,createFaustNode:rg},Symbol.toStringTag,{value:"Module"})),ES=""+new URL("reverb-BkEOyDCs.wasm",import.meta.url).href,TS=ES,AS={name:"reverb",inputs:1,outputs:2,size:1982988,params:{crossover:{at:36,init:200,min:50,max:1e3,step:1},damping:{at:16,init:6e3,min:700,max:16e3,step:1},decayLow:{at:24,init:2,min:.2,max:12,step:.01},decayMid:{at:28,init:2,min:.2,max:12,step:.01},preDelay:{at:327756,init:20,min:0,max:100,step:1}}},td={masterVolume:.7,reverbAmount:1,airAbsorption:.65,occlusion:.8},RS=.12,Df=8,Lf=24;class CS{context;settings={...td};weather=new og;dry;send;duck;master;noise=null;ready;started=!1;rooms=new Map;currentRoom=null;occlusionTimer=0;emitters=new Set;ranking=[];faust=null;faustWet=null;tap=null;constructor(){this.context=new AudioContext({latencyHint:"interactive"}),this.master=this.context.createGain(),this.duck=this.context.createGain(),this.dry=this.context.createGain(),this.send=this.context.createGain();const t=this.context.createDynamicsCompressor();t.threshold.value=-6,t.knee.value=6,t.ratio.value=12,t.attack.value=.003,t.release.value=.25,this.dry.connect(this.duck),this.duck.connect(this.master),this.master.connect(t),t.connect(this.context.destination),this.ready=this.build(),this.listenForGesture(),document.addEventListener("visibilitychange",this.handleVisibility)}async build(){this.noise=sg(this.context);const t=await rg(this.context,TS,AS);if(t){const s=this.context.createGain();s.gain.value=0,this.send.connect(t.node),t.node.connect(s),s.connect(this.duck),this.faust=t,this.faustWet=s}const e=Object.keys(pa),n=await Promise.all(e.map(s=>vS(this.context.sampleRate,pa[s])));this.faust||(e.forEach((s,o)=>{const r=this.context.createConvolver();r.normalize=!0,r.buffer=n[o];const a=this.context.createGain();a.gain.value=0,this.send.connect(r),r.connect(a),a.connect(this.duck),this.rooms.set(s,{convolver:r,gain:a})}),this.currentRoom!==null&&this.setRoom(this.currentRoom))}setRoom(t,e=.45){this.currentRoom=t;const n=this.context.currentTime,s=pa[t];if(this.faust&&this.faustWet){this.faust.set("decayLow",s.rt60*1.5),this.faust.set("decayMid",s.rt60),this.faust.set("crossover",200),this.faust.set("damping",700+(1-s.damping)**2*15300),this.faust.set("preDelay",s.preDelay*1e3),this.faustWet.gain.cancelScheduledValues(n),this.faustWet.gain.setTargetAtTime(s.wet*this.settings.reverbAmount,n,e/3);return}if(this.rooms.size!==0)for(const[o,r]of this.rooms){const a=o===t?pa[o].wet*this.settings.reverbAmount:0;r.gain.gain.cancelScheduledValues(n),r.gain.gain.setTargetAtTime(a,n,e/3)}}get reverbKind(){return this.faust?"fdn":"convolution"}get reverbControls(){return this.faust}get analyser(){if(!this.tap){const t=this.context.createAnalyser();t.fftSize=2048,t.smoothingTimeConstant=.6,this.master.connect(t),this.tap=t}return this.tap}get room(){return this.currentRoom}register(t){this.emitters.add(t)}unregister(t){this.emitters.delete(t)}update(t,e){return this.weather.update(t),this.updateListener(e),this.master.gain.value=this.settings.masterVolume,this.occlusionTimer-=t,this.occlusionTimer>0?!1:(this.occlusionTimer=RS,this.allocateVoices(),!0)}allocateVoices(){this.ranking.length=0;for(const e of this.emitters){if(!e.enabled){e.setDetail("virtual");continue}const n=e.position.distanceTo(Zn);if(n>e.maxDistance){e.setDetail("virtual");continue}this.ranking.push({emitter:e,priority:n/Math.max(e.importance,.01)})}this.ranking.sort((e,n)=>e.priority-n.priority);const t=2;for(let e=0;e<this.ranking.length;e++){const{emitter:n}=this.ranking[e],s=n.detailLevel;let o;e<Df?o="hrtf":e<Lf?o="panned":o="virtual",s==="hrtf"&&e<Df+t?o="hrtf":s==="panned"&&o==="virtual"&&e<Lf+t&&(o="panned"),n.setDetail(o)}}get voiceCounts(){let t=0,e=0,n=0;for(const s of this.emitters)s.detailLevel==="hrtf"?t++:s.detailLevel==="panned"?e++:n++;return{hrtf:t,panned:e,virtual:n}}updateListener(t){const e=this.context.listener;if(t.updateWorldMatrix(!0,!1),Zn.setFromMatrixPosition(t.matrixWorld),$i.set(0,0,-1).applyQuaternion(t.getWorldQuaternion(Nf)),Zi.set(0,1,0).applyQuaternion(Nf),e.positionX){const n=this.context.currentTime,s=.02;e.positionX.linearRampToValueAtTime(Zn.x,n+s),e.positionY.linearRampToValueAtTime(Zn.y,n+s),e.positionZ.linearRampToValueAtTime(Zn.z,n+s),e.forwardX.linearRampToValueAtTime($i.x,n+s),e.forwardY.linearRampToValueAtTime($i.y,n+s),e.forwardZ.linearRampToValueAtTime($i.z,n+s),e.upX.linearRampToValueAtTime(Zi.x,n+s),e.upY.linearRampToValueAtTime(Zi.y,n+s),e.upZ.linearRampToValueAtTime(Zi.z,n+s)}else{const n=e;n.setPosition(Zn.x,Zn.y,Zn.z),n.setOrientation($i.x,$i.y,$i.z,Zi.x,Zi.y,Zi.z)}}get listenerPosition(){return Zn}applyReverbAmount(){this.currentRoom!==null&&this.setRoom(this.currentRoom,.05)}listenForGesture(){const t=()=>{this.context.resume().then(()=>{this.started=this.context.state==="running"}),window.removeEventListener("pointerdown",t),window.removeEventListener("keydown",t),window.removeEventListener("touchstart",t)};window.addEventListener("pointerdown",t),window.addEventListener("keydown",t),window.addEventListener("touchstart",t)}handleVisibility=()=>{document.hidden?this.context.suspend():this.started&&this.context.resume()};dispose(){document.removeEventListener("visibilitychange",this.handleVisibility),this.context.close()}}const Zn=new R,$i=new R,Zi=new R,Nf=new ui;/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.21.0
 * @author George Michael Brower
 * @license MIT
 */class Un{constructor(t,e,n,s,o="div"){this.parent=t,this.object=e,this.property=n,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(o),this.domElement.classList.add("lil-controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("lil-name"),Un.nextNameID=Un.nextNameID||0,this.$name.id=`lil-gui-name-${++Un.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("lil-widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",r=>r.stopPropagation()),this.domElement.addEventListener("keyup",r=>r.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(n)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("lil-disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class PS extends Un{constructor(t,e,n){super(t,e,n,"lil-boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function lu(i){let t,e;return(t=i.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=i.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=i.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const IS={isPrimitive:!0,match:i=>typeof i=="string",fromHexString:lu,toHexString:lu},fr={isPrimitive:!0,match:i=>typeof i=="number",fromHexString:i=>parseInt(i.substring(1),16),toHexString:i=>"#"+i.toString(16).padStart(6,0)},DS={isPrimitive:!1,match:i=>Array.isArray(i)||ArrayBuffer.isView(i),fromHexString(i,t,e=1){const n=fr.fromHexString(i);t[0]=(n>>16&255)/255*e,t[1]=(n>>8&255)/255*e,t[2]=(n&255)/255*e},toHexString([i,t,e],n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return fr.toHexString(s)}},LS={isPrimitive:!1,match:i=>Object(i)===i,fromHexString(i,t,e=1){const n=fr.fromHexString(i);t.r=(n>>16&255)/255*e,t.g=(n>>8&255)/255*e,t.b=(n&255)/255*e},toHexString({r:i,g:t,b:e},n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return fr.toHexString(s)}},NS=[IS,fr,DS,LS];function FS(i){return NS.find(t=>t.match(i))}class US extends Un{constructor(t,e,n,s){super(t,e,n,"lil-color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=FS(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const o=lu(this.$text.value);o&&this._setValueFromHexString(o)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Tl extends Un{constructor(t,e,n){super(t,e,n,"lil-function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class OS extends Un{constructor(t,e,n,s,o,r){super(t,e,n,"lil-number"),this._initInput(),this.min(s),this.max(o);const a=r!==void 0;this.step(a?r:this._getImplicitStep(),a),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},n=x=>{const y=parseFloat(this.$input.value);isNaN(y)||(this._snapClampSetValue(y+x),this.$input.value=this.getValue())},s=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),n(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),n(this._step*this._arrowKeyMultiplier(x)*-1))},o=x=>{this._inputFocused&&(x.preventDefault(),n(this._step*this._normalizeMouseWheel(x)))};let r=!1,a,c,l,h,u;const f=5,d=x=>{a=x.clientX,c=l=x.clientY,r=!0,h=this.getValue(),u=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",v)},g=x=>{if(r){const y=x.clientX-a,w=x.clientY-c;Math.abs(w)>f?(x.preventDefault(),this.$input.blur(),r=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(y)>f&&v()}if(!r){const y=x.clientY-l;u-=y*this._step*this._arrowKeyMultiplier(x),h+u>this._max?u=this._max-h:h+u<this._min&&(u=this._min-h),this._snapClampSetValue(h+u)}l=x.clientY},v=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",v)},m=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",o,{passive:!1}),this.$input.addEventListener("mousedown",d),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("lil-slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("lil-fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("lil-has-slider");const t=(p,x,y,w,b)=>(p-x)/(y-x)*(b-w)+w,e=p=>{const x=this.$slider.getBoundingClientRect();let y=t(p,x.left,x.right,this._min,this._max);this._snapClampSetValue(y)},n=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",o)},s=p=>{e(p.clientX)},o=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",o)};let r=!1,a,c;const l=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),r=!1},h=p=>{p.touches.length>1||(this._hasScrollBar?(a=p.touches[0].clientX,c=p.touches[0].clientY,r=!0):l(p),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",f))},u=p=>{if(r){const x=p.touches[0].clientX-a,y=p.touches[0].clientY-c;Math.abs(x)>Math.abs(y)?l(p):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",f))}else p.preventDefault(),e(p.touches[0].clientX)},f=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",f)},d=this._callOnFinishChange.bind(this),g=400;let v;const m=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const y=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+y),this.$input.value=this.getValue(),clearTimeout(v),v=setTimeout(d,g)};this.$slider.addEventListener("mousedown",n),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("lil-active",t),document.body.classList.toggle("lil-dragging",t),document.body.classList.toggle(`lil-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:n}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,n=-t.wheelDelta/120,n*=this._stepExplicit?1:10),e+-n}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){let e=0;return this._hasMin?e=this._min:this._hasMax&&(e=this._max),t-=e,t=Math.round(t/this._step)*this._step,t+=e,t=parseFloat(t.toPrecision(15)),t}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class kS extends Un{constructor(t,e,n,s){super(t,e,n,"lil-option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("lil-focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("lil-focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const n=document.createElement("option");n.textContent=e,this.$select.appendChild(n)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class zS extends Un{constructor(t,e,n){super(t,e,n,"lil-string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}var BS=`.lil-gui {
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
}`;function HS(i){const t=document.createElement("style");t.innerHTML=i;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Ff=!1;class ed{constructor({parent:t,autoPlace:e=t===void 0,container:n,width:s,title:o="Controls",closeFolders:r=!1,injectStyles:a=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("button"),this.$title.classList.add("lil-title"),this.$title.setAttribute("aria-expanded",!0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("lil-children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(o),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("lil-root"),c&&this.domElement.classList.add("lil-allow-touch-styles"),!Ff&&a&&(HS(BS),Ff=!0),n?n.appendChild(this.domElement):e&&(this.domElement.classList.add("lil-auto-place","autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=r}add(t,e,n,s,o){if(Object(n)===n)return new kS(this,t,e,n);const r=t[e];switch(typeof r){case"number":return new OS(this,t,e,n,s,o);case"boolean":return new PS(this,t,e);case"string":return new zS(this,t,e);case"function":return new Tl(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,r)}addColor(t,e,n=1){return new US(this,t,e,n)}addFolder(t){const e=new ed({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(n=>{n instanceof Tl||n._name in t.controllers&&n.load(t.controllers[n._name])}),e&&t.folders&&this.folders.forEach(n=>{n._title in t.folders&&n.load(t.folders[n._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(n=>{if(!(n instanceof Tl)){if(n._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${n._name}"`);e.controllers[n._name]=n.save()}}),t&&this.folders.forEach(n=>{if(n._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${n._title}"`);e.folders[n._title]=n.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("lil-closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("lil-transition");const n=o=>{o.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("lil-transition"),this.$children.removeEventListener("transitionend",n))};this.$children.addEventListener("transitionend",n);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("lil-closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(n=>n.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}var ar=function(){var i=0,t=document.createElement("div");t.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",t.addEventListener("click",function(h){h.preventDefault(),n(++i%t.children.length)},!1);function e(h){return t.appendChild(h.dom),h}function n(h){for(var u=0;u<t.children.length;u++)t.children[u].style.display=u===h?"block":"none";i=h}var s=(performance||Date).now(),o=s,r=0,a=e(new ar.Panel("FPS","#0ff","#002")),c=e(new ar.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var l=e(new ar.Panel("MB","#f08","#201"));return n(0),{REVISION:16,dom:t,addPanel:e,showPanel:n,begin:function(){s=(performance||Date).now()},end:function(){r++;var h=(performance||Date).now();if(c.update(h-s,200),h>=o+1e3&&(a.update(r*1e3/(h-o),100),o=h,r=0,l)){var u=performance.memory;l.update(u.usedJSHeapSize/1048576,u.jsHeapSizeLimit/1048576)}return h},update:function(){s=this.end()},domElement:t,setMode:n}};ar.Panel=function(i,t,e){var n=1/0,s=0,o=Math.round,r=o(window.devicePixelRatio||1),a=80*r,c=48*r,l=3*r,h=2*r,u=3*r,f=15*r,d=74*r,g=30*r,v=document.createElement("canvas");v.width=a,v.height=c,v.style.cssText="width:80px;height:48px";var m=v.getContext("2d");return m.font="bold "+9*r+"px Helvetica,Arial,sans-serif",m.textBaseline="top",m.fillStyle=e,m.fillRect(0,0,a,c),m.fillStyle=t,m.fillText(i,l,h),m.fillRect(u,f,d,g),m.fillStyle=e,m.globalAlpha=.9,m.fillRect(u,f,d,g),{dom:v,update:function(p,x){n=Math.min(n,p),s=Math.max(s,p),m.fillStyle=e,m.globalAlpha=1,m.fillRect(0,0,a,f),m.fillStyle=t,m.fillText(o(p)+" "+i+" ("+o(n)+"-"+o(s)+")",l,h),m.drawImage(v,u+r,f,d-r,g,u,f,d-r,g),m.fillRect(u+d-r,f,r,g),m.fillStyle=e,m.globalAlpha=.9,m.fillRect(u+d-r,f,r,o((1-p/x)*g))}}};function GS(){if(!Km.debug)return{gui:null,stats:null,update:()=>{},dispose:()=>{}};const i=new ar;i.dom.style.position="fixed",i.dom.style.top="0",i.dom.style.left="0",document.body.appendChild(i.dom);const t=new ed({title:"hswow"});return t.domElement.style.setProperty("--width","280px"),{gui:t,stats:i,update:()=>i.update(),dispose:()=>{t.destroy(),i.dom.remove()}}}const ma=2e4,VS=420,WS=.32,XS=.08,Al=.04,Rl=.5;class cg{position=new R;enabled=!0;importance;maxDistance;engine;model;absorption;occlusion;swap;panner;sendGain;reverb;ignoreAbsorption;ignoreOcclusion;invertDistance;occluded=!1;detail="panned";connected=!1;pending=0;constructor(t,e,n){this.engine=t,this.model=e,this.position.copy(n.position),this.maxDistance=n.maxDistance??60,this.reverb=n.reverb??1,this.importance=n.importance??1,this.ignoreAbsorption=n.ignoreAbsorption??!1,this.ignoreOcclusion=n.ignoreOcclusion??!1,this.invertDistance=n.invertDistance??!1;const s=t.context;this.absorption=s.createBiquadFilter(),this.absorption.type="lowpass",this.absorption.frequency.value=ma,this.occlusion=s.createGain(),this.swap=s.createGain(),this.panner=s.createPanner(),this.panner.panningModel="equalpower",this.panner.distanceModel="inverse",this.panner.refDistance=n.refDistance??1.5,this.panner.maxDistance=this.maxDistance,this.panner.rolloffFactor=this.invertDistance?0:n.rolloff??1.1,n.direction&&(this.panner.coneInnerAngle=n.coneInner??90,this.panner.coneOuterAngle=n.coneOuter??240,this.panner.coneOuterGain=n.coneOuterGain??.35,qS(this.panner,n.direction)),Uf(this.panner,this.position),this.sendGain=s.createGain(),this.sendGain.gain.value=this.reverb,this.absorption.connect(this.occlusion),this.occlusion.connect(this.swap),this.swap.connect(this.panner),this.panner.connect(t.dry),this.panner.connect(this.sendGain),this.sendGain.connect(t.send),this.connect(),t.register(this)}moveTo(t){this.position.copy(t),Uf(this.panner,this.position)}setDetail(t){t!==this.detail&&(this.detail=t,this.retarget())}retarget(){const t=this.engine.context,e=t.currentTime;this.swap.gain.cancelScheduledValues(e),this.swap.gain.setValueAtTime(this.swap.gain.value,e),this.swap.gain.linearRampToValueAtTime(0,e+Al),window.clearTimeout(this.pending),this.pending=window.setTimeout(()=>{const n=this.detail;if(n==="virtual"){this.connected&&(this.disconnect(),this.model.setActive?.(!1));return}this.connected||(this.connect(),this.model.setActive?.(!0)),this.panner.panningModel=n==="hrtf"?"HRTF":"equalpower";const s=t.currentTime;this.swap.gain.cancelScheduledValues(s),this.swap.gain.setValueAtTime(0,s),this.swap.gain.linearRampToValueAtTime(1,s+Al)},Al*1e3+10)}update(t,e,n){if(this.detail==="virtual"||!this.enabled){this.enabled===!1&&this.connected&&this.glide(this.occlusion.gain,0);return}const s=this.position.distanceTo(this.engine.listenerPosition);this.model.update?.(t,this.engine,this.position),n&&!this.ignoreOcclusion&&(this.occluded=this.testOcclusion(e,s));const o=this.engine.settings,r=Math.min(s/this.maxDistance,1),a=this.ignoreAbsorption?ma:ma*(1-o.airAbsorption*Math.sqrt(r)*.94),c=this.occluded?o.occlusion:0,l=Math.min(a,Of(ma,VS,c)),h=this.invertDistance?kf(r):r<=Rl?1:1-kf((r-Rl)/(1-Rl));this.glide(this.absorption.frequency,Math.max(l,180)),this.glide(this.occlusion.gain,Of(1,WS,c)*h),this.sendGain.gain.value=this.reverb*o.reverbAmount}testOcclusion(t,e){if(e<.5)return!1;ti.subVectors(this.position,this.engine.listenerPosition).divideScalar(e);const n=t.raycast(this.engine.listenerPosition,ti);return n!==null&&n<e-.35}connect(){this.connected||(this.model.output.connect(this.absorption),this.connected=!0)}disconnect(){if(this.connected){try{this.model.output.disconnect(this.absorption)}catch{}this.connected=!1}}glide(t,e){t.setTargetAtTime(e,this.engine.context.currentTime,XS)}get isOccluded(){return this.occluded}get isVirtual(){return this.detail==="virtual"}get detailLevel(){return this.detail}dispose(){this.engine.unregister(this),this.disconnect(),this.model.dispose(),this.panner.disconnect(),this.sendGain.disconnect(),this.absorption.disconnect(),this.occlusion.disconnect(),this.swap.disconnect()}}function Uf(i,t){i.positionX?(i.positionX.value=t.x,i.positionY.value=t.y,i.positionZ.value=t.z):i.setPosition(t.x,t.y,t.z)}function qS(i,t){ti.copy(t).normalize(),i.orientationX?(i.orientationX.value=ti.x,i.orientationY.value=ti.y,i.orientationZ.value=ti.z):i.setOrientation(ti.x,ti.y,ti.z)}function Of(i,t,e){return i+(t-i)*e}function kf(i){const t=i<0?0:i>1?1:i;return t*t*t*(t*(t*6-15)+10)}const ti=new R,YS=220,$S=560,ZS=1.4,Cl=1300,KS=2900,Pl=4,jS=9;function lg(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("wind model built before the noise buffers were ready");const s=e.createGain();s.gain.value=t.gain??.5;const o=e.createBiquadFilter();o.type="lowpass",o.frequency.value=t.tone??3400,o.Q.value=.4;const r=e.createBiquadFilter();r.type="highshelf",r.frequency.value=2200,r.gain.value=-7;const a=e.createGain();a.gain.value=.5,o.connect(r).connect(a).connect(s);const c=e.createGain(),l=e.createGain(),h=e.createGain(),u=e.createBiquadFilter();u.type="lowpass",u.frequency.value=YS;const f=e.createBiquadFilter();f.type="bandpass",f.frequency.value=$S,f.Q.value=ZS;const d=e.createBiquadFilter();d.type="bandpass",d.frequency.value=Cl,d.Q.value=Pl;const g=[Fn(e,n.brown,u),Fn(e,n.pink,f),Fn(e,n.white,d)];u.connect(c).connect(o),f.connect(l).connect(o),d.connect(h).connect(o);const v=t.whistle??1;return{output:s,setTone(m){o.frequency.setTargetAtTime(m,e.currentTime,.1)},update(m,p,x){const y=p.weather.strengthAt(x.x,x.z),w=e.currentTime,b=.09;c.gain.setTargetAtTime(.1+y*.85,w,b),l.gain.setTargetAtTime(.03+y*y*.5,w,b),h.gain.setTargetAtTime(y**3*.2*v,w,b),a.gain.setTargetAtTime(.25+y*.75,w,b*1.6),d.frequency.setTargetAtTime(Cl+(KS-Cl)*y,w,b),d.Q.setTargetAtTime(Pl+(jS-Pl)*y,w,b)},dispose(){for(const m of g)m.stop();s.disconnect()}}}const JS=.14,QS=160;function zn(i,t=JS){let e=0;return{pump(n,s,o="immediate"){const r=i.currentTime;e<r&&(e=r+(o==="oneGap"?s():0));const a=r+t;let c=0;for(;e<a&&c<QS;)n(e),e+=Math.max(s(),1e-4),c++},reset(){e=0}}}function Li(i){const t=Math.max(i,.01);return()=>-Math.log(1-Math.random())/t}function hg(i,t=.06){return()=>i*(1+(Math.random()*2-1)*t)}function nd(i,t,e,n=1){const s=t.map(o=>{const r=i.createBiquadFilter();return r.type="bandpass",r.frequency.value=o.hz*n,r.Q.value=o.q,r.connect(e),{filter:r,weight:o.weight,hz:o.hz}});return{pick(){let o=Math.random();for(const r of s)if(o-=r.weight,o<=0)return r.filter;return s[s.length-1].filter},setTone(o,r){for(const a of s)a.filter.frequency.setTargetAtTime(a.hz*o,r,.15)},overlap(o,r){return o*r},dispose(){for(const o of s)o.filter.disconnect()}}}function tE(i,t,e,n,s={}){const o=s.minDuration??.055,r=s.maxDuration??.165,a=o+Math.random()*(r-o),c=i.createBufferSource();c.buffer=t;const l=s.minRate??.7,h=s.maxRate??1.4;c.playbackRate.value=l+Math.random()*(h-l);const u=i.createGain();u.gain.setValueCurveAtTime(cS(s.pool??aS),n,a),c.connect(u).connect(e),c.start(n,Math.random()*Math.max(t.duration-.3,0),a+.02),c.stop(n+a+.03)}const eE=[{hz:1150,q:2.6,weight:.4},{hz:2400,q:3.2,weight:.46},{hz:4600,q:3.8,weight:.14}];function ug(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("foliage model built before the noise buffers were ready");const s=t.density??240,o=t.tone??1,r=t.restlessness??.2,a=e.createGain();a.gain.value=t.gain??.5;const c=e.createGain();c.gain.value=0,c.connect(a);const l=nd(e,eE,c,o),h=e.createBiquadFilter();h.type="bandpass",h.frequency.value=1800*o,h.Q.value=.75;const u=e.createGain();u.gain.value=0;const f=Fn(e,n.pink,h);h.connect(u).connect(a);let d=t.articulation??.3,g=!0;const v=zn(e),m=p=>tE(e,n.white,l.pick(),p,{minDuration:.055,maxDuration:.165});return{output:a,setArticulation(p){d=p},setActive(p){g=p,p&&v.reset(),p||(u.gain.value=0,c.gain.value=0)},update(p,x,y){if(!g)return;const w=Math.max(x.weather.strengthAt(y.x,y.z),r),b=e.currentTime;u.gain.setTargetAtTime(.1+w*.5,b,.15),h.frequency.setTargetAtTime((1500+w*1900)*o,b,.15),c.gain.setTargetAtTime(d*(.25+w*.75),b,.15);const S=Math.max(20,s*w*w);v.pump(m,Li(S))},dispose(){f.stop(),l.dispose(),c.disconnect(),a.disconnect()}}}const zf=[1,2,3.02,4.05,5.97],nE=[1,.5,.28,.16,.09],ga={steady:{speed:1,wear:1,clank:1,min:9,max:26,next:["labouring","surging","idling"]},labouring:{speed:.62,wear:1.8,clank:1.7,min:5,max:14,next:["steady","stalling","surging"]},surging:{speed:1.34,wear:1.3,clank:.8,min:3,max:9,next:["steady","labouring"]},stalling:{speed:.22,wear:2.2,clank:2.4,min:1.5,max:4,next:["labouring","idling"]},idling:{speed:.45,wear:.7,clank:.5,min:8,max:20,next:["steady","surging"]}};function dg(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("machine model built before the noise buffers were ready");const s=t.fundamental??46,o=t.clank??.5,r=e.createGain();r.gain.value=t.gain??.35;const a=e.createGain();a.gain.value=.5;const c=e.createBiquadFilter();c.type="lowpass",c.frequency.value=520,c.Q.value=.9;const l=[];zf.forEach((A,P)=>{const C=e.createOscillator();C.type=P===0?"sawtooth":"triangle",C.frequency.value=s*A,C.detune.value=(Math.random()*2-1)*9;const L=e.createGain();L.gain.value=nE[P],C.connect(L).connect(c),C.start(),l.push(C)}),c.connect(a);const h=e.createGain();h.gain.value=1;const u=e.createOscillator();u.type="sine";const f=e.createGain();f.gain.value=.22,u.connect(f).connect(h.gain),u.start(),a.connect(h).connect(r);const d=e.createBiquadFilter();d.type="bandpass",d.frequency.value=2600,d.Q.value=.8;const g=e.createGain();g.gain.value=(t.wear??.4)*.22;const v=Fn(e,n.pink,d);d.connect(g).connect(r);const m=e.createGain();m.gain.value=o,m.connect(r);let p=t.rpm??52,x=p,y=!0;const w=zn(e,.15);let b="steady",S=12;const E=(t.wear??.4)*.22,T=A=>{if(o<=0)return;const P=e.createBufferSource();P.buffer=n.white;const C=e.createBiquadFilter();C.type="bandpass",C.frequency.value=190+Math.random()*90,C.Q.value=14;const L=e.createGain();_r(L.gain,A,.9+Math.random()*.3,.001,.15),P.connect(C).connect(L).connect(m),P.start(A,Math.random()*2,.4),P.stop(A+.45)},_=(A=.9)=>{const P=e.currentTime,C=ga[b];u.frequency.setTargetAtTime(x/60,P,A*.4);const L=Math.max(x,4)/52;zf.forEach((N,F)=>{l[F].frequency.setTargetAtTime(s*N*L,P,A)}),c.frequency.setTargetAtTime(420+L*260,P,A),g.gain.setTargetAtTime(E*C.wear,P,A),m.gain.setTargetAtTime(o*C.clank,P,A)},M=A=>{b=A;const P=ga[A];S=P.min+Math.random()*(P.max-P.min),_()};return _(.01),{output:r,get phase(){return b},get currentRpm(){return x},setRpm(A){p=A},setActive(A){y=A,A&&w.reset()},update(A){if(!y)return;if(S-=A,S<=0){const N=ga[b].next;M(N[Math.floor(Math.random()*N.length)])}const P=p*ga[b].speed,C=Math.min(A*.55,1);Math.abs(P-x)>.05&&(x+=(P-x)*C,_());const L=60/Math.max(x,3);w.pump(T,hg(L,.06),"oneGap")},dispose(){for(const A of l)A.stop();u.stop(),v.stop(),r.disconnect()}}}function fg(i,t={}){const e=i.context,n=t.pitch??2400,s=t.interval??7,o=t.shySpeed??.72,r=e.createGain();r.gain.value=t.gain??.16;const a=e.createBiquadFilter();a.type="lowpass",a.frequency.value=t.tone??3200,a.Q.value=.5,a.connect(r);let c=!0,l=0;const h=(g,v,m,p)=>{const x=e.createOscillator();x.type="sine",x.frequency.setValueAtTime(v,g),x.frequency.exponentialRampToValueAtTime(m,g+p);const y=e.createOscillator();y.type="sine",y.frequency.setValueAtTime(v*2.02,g),y.frequency.exponentialRampToValueAtTime(m*2.02,g+p);const w=e.createGain();w.gain.value=.18;const b=e.createGain();b.gain.setValueAtTime(0,g),b.gain.linearRampToValueAtTime(1,g+p*.18),b.gain.setValueAtTime(1,g+p*.6),b.gain.linearRampToValueAtTime(0,g+p),x.connect(b),y.connect(w).connect(b),b.connect(a),x.start(g),y.start(g),x.stop(g+p+.02),y.stop(g+p+.02)},u=[{name:"rising",weight:.26},{name:"falling",weight:.2},{name:"trill",weight:.16},{name:"pair",weight:.22},{name:"single",weight:.1},{name:"chatter",weight:.06}],f=()=>{let g=Math.random();for(const v of u)if(g-=v.weight,g<=0)return v.name;return"pair"},d=g=>{const v=n*(.82+Math.random()*.36);let m=g;switch(f()){case"rising":{const p=2+Math.floor(Math.random()*3);for(let x=0;x<p;x++){const y=1+x*(.1+Math.random()*.09),w=.06+Math.random()*.07;h(m,v*y,v*y*1.22,w),m+=w+.03+Math.random()*.05}break}case"falling":{const p=2+Math.floor(Math.random()*2);for(let x=0;x<p;x++){const y=1-x*(.08+Math.random()*.07),w=.08+Math.random()*.1;h(m,v*y*1.18,v*y*.82,w),m+=w+.04+Math.random()*.06}break}case"trill":{const p=5+Math.floor(Math.random()*7),x=.028+Math.random()*.022;for(let y=0;y<p;y++){const w=y%2===0?1:1.09;h(m,v*w,v*w*1.05,x*.8),m+=x}break}case"pair":{const p=.07+Math.random()*.06;h(m,v,v*1.3,p),m+=p+.05+Math.random()*.04,h(m,v*1.28,v*1.05,p*1.2),m+=p*1.2;break}case"single":{const p=.22+Math.random()*.3;h(m,v*.95,v*1.12,p),m+=p;break}case"chatter":{const p=3+Math.floor(Math.random()*4);for(let x=0;x<p;x++){const y=.02+Math.random()*.02;h(m,v*.6,v*.5,y),m+=y+.02+Math.random()*.03}break}}return m};return{output:r,setActive(g){c=g,g&&(l=0)},update(g,v,m){if(!c)return;const p=e.currentTime;l<p&&(l=p+Math.random()*s),!(l>p+.2)&&(v.weather.strengthAt(m.x,m.z)<o?l=d(l)+(Math.random()<.34?.4+Math.random()*2.2:-Math.log(1-Math.random())*s):l=p+1.5)},dispose(){r.disconnect()}}}const Il=8e3,iE=12,sE=7,oE=[{hz:1500,q:6,weight:.34},{hz:2800,q:7,weight:.42},{hz:5200,q:8,weight:.24}],rE=.6,aE=.3,cE=.2,Bf=new WeakMap;function lE(i){const t=Bf.get(i);if(t)return t;const e=Math.floor(Il*iE),n=i.createBuffer(1,e,Il),s=n.getChannelData(0),o=Math.exp(-2*Math.PI*sE/Il);let r=0;for(let l=0;l<e;l++)r=o*r+(1-o)*(Math.random()*2-1),s[l]=r;const a=Math.min(1024,e/4|0);for(let l=0;l<a;l++){const h=l/a;s[l]=s[l]*h+s[e-a+l]*(1-h)}let c=0;for(let l=0;l<e;l++)c=Math.max(c,Math.abs(s[l]));if(c>0)for(let l=0;l<e;l++)s[l]/=c;return Bf.set(i,n),n}function pg(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("fire model built before the noise buffers were ready");const s=t.tone??1,o=t.crackle??1,r=t.draught??.35,a=e.createGain();a.gain.value=t.gain??.5;const c=e.createBiquadFilter();c.type="bandpass",c.frequency.value=110*s,c.Q.value=.9;const l=e.createGain();l.gain.value=0;const h=Fn(e,n.brown,c);c.connect(l).connect(a);const u=e.createGain();u.gain.value=0;const f=Fn(e,lE(e),u,.12);u.connect(l.gain);const d=e.createBiquadFilter();d.type="highpass",d.frequency.value=800*s,d.Q.value=.6;const g=e.createBiquadFilter();g.type="highshelf",g.frequency.value=4200,g.gain.value=-7;const v=e.createGain();v.gain.value=0;const m=Fn(e,n.white,d);d.connect(g).connect(v).connect(a);const p=e.createGain();p.gain.value=cE*o,p.connect(a);const x=nd(e,oE,p,s);let y=t.intensity??.7,w=!0;const b=zn(e),S=E=>{const T=Math.random()<.09,_=T?.45+Math.random()*.5:.06+Math.random()*.26,M=T?.006+Math.random()*.014:.0015+Math.random()*.005;kn(e,n.white,x.pick(),E,_,M),T&&Mc(e,p,E,.16,95*s,42*s,.085,.004)};return{output:a,setIntensity(E){y=Math.min(1,Math.max(0,E))},setActive(E){w=E,E&&b.reset(),E||(l.gain.value=0,u.gain.value=0,v.gain.value=0)},update(E,T,_){if(!w)return;const M=e.currentTime,A=Math.min(1.35,y*(1+T.weather.strengthAt(_.x,_.z)*r)),P=rE*(.3+A*.7);l.gain.setTargetAtTime(P*.72,M,.4),u.gain.setTargetAtTime(P*.62,M,.4),c.frequency.setTargetAtTime((85+A*60)*s,M,.4),v.gain.setTargetAtTime(aE*(.15+A*.85),M,.3),d.frequency.setTargetAtTime((650+A*900)*s,M,.3),b.pump(S,Li(Math.max(.6,22*A*A)))},dispose(){h.stop(),m.stop(),f.stop(),u.disconnect(),x.dispose(),p.disconnect(),l.disconnect(),v.disconnect(),a.disconnect()}}}function mg(i){return 3.26/Math.max(i,5e-5)}const hE=20,uE=.28;function ja(i,t,e,n){const s=mg(n.radius),o=n.cycles??hE,r=n.rise??uE,a=o/s,c=i.createOscillator();c.type="sine",c.frequency.setValueAtTime(s,e),c.frequency.linearRampToValueAtTime(s*(1+r),e+a);const l=i.createGain();return l.gain.setValueAtTime(n.level,e),l.gain.exponentialRampToValueAtTime(n.level*.001,e+a),c.connect(l).connect(t),c.start(e),c.stop(e+a+.01),a}function Ja(i,t){return i*Math.pow(t/i,Math.random())}const Dl={canopy:{channels:[{hz:900,q:2.4,weight:.42},{hz:1900,q:2.8,weight:.4},{hz:3600,q:3.2,weight:.18}],contact:[.004,.012],drop:.16,bedHz:1600,bedQ:.7,density:420},stone:{channels:[{hz:2400,q:5,weight:.34},{hz:4200,q:6,weight:.42},{hz:6800,q:7,weight:.24}],contact:[.0012,.004],drop:.26,bedHz:3200,bedQ:.55,density:300},earth:{channels:[{hz:420,q:1.8,weight:.5},{hz:780,q:2,weight:.36},{hz:1500,q:2.4,weight:.14}],contact:[.01,.028],drop:.14,bedHz:800,bedQ:.6,density:260},water:{channels:[{hz:1400,q:3,weight:.5},{hz:2600,q:3.5,weight:.5}],contact:[.002,.006],drop:.07,bedHz:2e3,bedQ:.6,density:240,bubbles:[4e-4,.0016]}};function gg(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("rain model built before the noise buffers were ready");const s=t.tone??1,o=t.eaves??0;let r=Dl[t.surface??"canopy"];const a=r.bubbles,c=e.createGain();c.gain.value=t.gain??.5;const l=e.createGain();l.gain.value=0,l.connect(c);const h=nd(e,r.channels,l,s),u=e.createBiquadFilter();u.type="bandpass",u.frequency.value=r.bedHz*s,u.Q.value=r.bedQ;const f=e.createGain();f.gain.value=0;const d=Fn(e,n.pink,u);u.connect(f).connect(c);let g=t.intensity??.5;const v=t.articulation??.35;let m=!0;const p=zn(e),x=zn(e),y=b=>{if(a){ja(e,l,b,{radius:Ja(a[0],a[1]),level:r.drop*(.4+Math.random()*.6),cycles:13});return}const[S,E]=r.contact;kn(e,n.white,h.pick(),b,r.drop*(.35+Math.random()*.65),S+Math.random()*(E-S))},w=b=>{ja(e,l,b,{radius:Ja(.0022,.0065),level:.5+Math.random()*.5,cycles:22})};return{output:c,setIntensity(b){g=Math.min(1,Math.max(0,b))},setSurface(b){if(a)return;r=Dl[b];const S=e.currentTime;u.frequency.setTargetAtTime(r.bedHz*s,S,.25),u.Q.setTargetAtTime(r.bedQ,S,.25),h.setTone(r.bedHz/Dl.canopy.bedHz*s,S)},setActive(b){m=b,b?(p.reset(),x.reset()):(f.gain.value=0,l.gain.value=0)},update(b,S,E){if(!m)return;const T=e.currentTime,_=Math.min(1,g*(1+S.weather.strengthAt(E.x,E.z)*.22));if(_<.02){f.gain.setTargetAtTime(0,T,.6),l.gain.setTargetAtTime(0,T,.6),p.reset(),x.reset();return}f.gain.setTargetAtTime(_*.55,T,.6),u.frequency.setTargetAtTime(r.bedHz*s*(.7+_*.55),T,.6),l.gain.setTargetAtTime(v*(.2+_*.8),T,.6),p.pump(y,Li(Math.max(8,r.density*_*_))),o>0&&x.pump(w,Li(o*(.35+_*.65)),"oneGap")},dispose(){d.stop(),h.dispose(),l.disconnect(),f.disconnect(),c.disconnect()}}}const dE={brook:{rate:95,radius:[4e-4,.0026],cycles:15,bedHz:1500,bedQ:.75,bedLevel:.28,voice:.1},stream:{rate:62,radius:[9e-4,.005],cycles:18,bedHz:900,bedQ:.7,bedLevel:.36,voice:.13},fountain:{rate:150,radius:[5e-4,.0035],cycles:14,bedHz:2100,bedQ:.6,bedLevel:.34,voice:.09},cistern:{rate:.45,radius:[.003,.009],cycles:30,bedHz:260,bedQ:1.3,bedLevel:.02,voice:.62}};function vg(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("water model built before the noise buffers were ready");const s=dE[t.flow??"brook"],o=t.tone??1,r=s.radius[0]/o,a=s.radius[1]/o,c=e.createGain();c.gain.value=t.gain??.5;const l=e.createGain();l.gain.value=1;const h=e.createBiquadFilter();h.type="highshelf",h.frequency.value=3e3,h.gain.value=-3,l.connect(h).connect(c);const u=e.createBiquadFilter();u.type="bandpass",u.frequency.value=s.bedHz*o,u.Q.value=s.bedQ;const f=e.createGain();f.gain.value=0;const d=Fn(e,n.pink,u);u.connect(f).connect(c);let g=t.rate??1,v=!0;const m=zn(e),p=x=>{ja(e,l,x,{radius:Ja(r,a),level:s.voice*(.3+Math.random()*.7),cycles:s.cycles*(.75+Math.random()*.5)})};return{output:c,get voiceHz(){return mg(Math.sqrt(r*a))},setRate(x){g=Math.min(1,Math.max(0,x))},setActive(x){v=x,x?m.reset():f.gain.value=0},update(x){if(!v)return;const y=e.currentTime;if(f.gain.setTargetAtTime(s.bedLevel*g,y,.5),u.frequency.setTargetAtTime(s.bedHz*o*(.75+g*.4),y,.5),g<.02){m.reset();return}m.pump(p,Li(s.rate*g))},dispose(){d.stop(),h.disconnect(),l.disconnect(),f.disconnect(),c.disconnect()}}}function yg(i,t,e){const n=i.createGain(),s=t.map(r=>{const a=i.createBiquadFilter();a.type="bandpass",a.frequency.value=r.hz,a.Q.value=r.q;const c=i.createGain();return c.gain.value=r.level,n.connect(a).connect(c).connect(e),{filter:a,level:c}}),o=t.map(r=>({...r}));return{input:n,shape(r,a,c=0){for(let l=0;l<s.length;l++){const h=r[l];if(!h)continue;const{filter:u,level:f}=s[l];c<=0?(u.frequency.setValueAtTime(h.hz,a),f.gain.setValueAtTime(h.level,a)):(u.frequency.setValueAtTime(o[l].hz,a),u.frequency.exponentialRampToValueAtTime(Math.max(h.hz,20),a+c),f.gain.setValueAtTime(o[l].level,a),f.gain.linearRampToValueAtTime(h.level,a+c)),u.Q.setValueAtTime(h.q,a),o[l]={...h}}},dispose(){n.disconnect();for(const{filter:r,level:a}of s)r.disconnect(),a.disconnect()}}}const Oo={a:[{hz:730,q:8,level:1},{hz:1090,q:10,level:.5},{hz:2440,q:14,level:.25}],e:[{hz:530,q:7,level:1},{hz:1840,q:12,level:.45},{hz:2480,q:15,level:.22}],i:[{hz:270,q:5,level:1},{hz:2290,q:14,level:.4},{hz:3010,q:17,level:.2}],o:[{hz:570,q:7,level:1},{hz:840,q:8,level:.55},{hz:2410,q:15,level:.16}],u:[{hz:300,q:5,level:1},{hz:870,q:8,level:.4},{hz:2240,q:14,level:.12}]},Ll=[Oo.a,Oo.e,Oo.i,Oo.o,Oo.u];function wg(i,t={}){const e=i.context,n=Math.max(1,Math.min(10,t.voices??6)),s=Math.min(.95,Math.max(.05,t.density??.45)),o=t.pitch??135,r=t.variety??.5,a=e.createGain();a.gain.value=t.gain??.5;const c=e.createBiquadFilter();c.type="lowpass",c.frequency.value=t.distance??1700,c.Q.value=.6,c.connect(a);const l=[];for(let d=0;d<n;d++){const g=n===1?0:d/(n-1)*2-1,v=1+g*r*.35+(Math.random()*2-1)*.05,m=o*(1-g*r*.4)*(.95+Math.random()*.1),p=e.createGain();p.gain.value=.85/Math.sqrt(n),p.connect(c);const x=yg(e,Ll[0].map(b=>({...b,hz:b.hz*v})),p),y=e.createGain();y.gain.value=0,y.connect(x.input);const w=e.createOscillator();w.type="sawtooth",w.frequency.value=m,w.connect(y),w.start(),l.push({osc:w,envelope:y,bank:x,clock:zn(e),length:.2,left:0,pitch:m,tract:v})}let h=!0;const u=(d,g)=>d.map(v=>({...v,hz:v.hz*g})),f=(d,g)=>{const v=.12+Math.random()*.14;d.length=v,d.left--;const m=d.left>=4,p=d.pitch*(m?1.1:.9+Math.random()*.2);d.osc.frequency.setTargetAtTime(p,g,v*.6);const x=.55+Math.random()*.45,y=v*.22;d.envelope.gain.setValueAtTime(0,g),d.envelope.gain.linearRampToValueAtTime(x,g+y),d.envelope.gain.linearRampToValueAtTime(x*.75,g+v*.75),d.envelope.gain.setTargetAtTime(0,g+v*.75,v*.12);const w=Ll[Math.random()*Ll.length|0];d.bank.shape(u(w,d.tract),g,v*.8)};return{output:a,setActive(d){if(h=d,d)for(const g of l)g.clock.reset();else for(const g of l)g.envelope.gain.value=0},update(){if(h)for(const d of l)d.clock.pump(g=>f(d,g),()=>{if(d.left>0)return d.length+.015+Math.random()*.06;d.left=3+Math.floor(Math.random()*6);const g=(1-s)*5.5;return d.length+.35+Math.random()*(.6+g)},"immediate")},dispose(){for(const d of l){try{d.osc.stop()}catch{}d.osc.disconnect(),d.envelope.disconnect(),d.bank.dispose()}l.length=0,c.disconnect(),a.disconnect()}}}const fE="modulepreload",pE=function(i,t){return new URL(i,t).href},Hf={},Qa=function(t,e,n){let s=Promise.resolve();if(e&&e.length>0){const r=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),c=a?.nonce||a?.getAttribute("nonce");s=Promise.allSettled(e.map(l=>{if(l=pE(l,n),l in Hf)return;Hf[l]=!0;const h=l.endsWith(".css"),u=h?'[rel="stylesheet"]':"";if(!!n)for(let g=r.length-1;g>=0;g--){const v=r[g];if(v.href===l&&(!h||v.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${l}"]${u}`))return;const d=document.createElement("link");if(d.rel=h?"stylesheet":fE,h||(d.as="script"),d.crossOrigin="",d.href=l,c&&d.setAttribute("nonce",c),document.head.appendChild(d),h)return new Promise((g,v)=>{d.addEventListener("load",g),d.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${l}`)))})}))}function o(r){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=r,window.dispatchEvent(a),!a.defaultPrevented)throw r}return s.then(r=>{for(const a of r||[])a.status==="rejected"&&o(a.reason);return t().catch(o)})};async function mE(i){try{const[{createFaustNode:t},{frictionMeta:e,frictionUrl:n}]=await Promise.all([Qa(()=>Promise.resolve().then(()=>ag),void 0,import.meta.url),Qa(()=>import("./friction-COj10vMJ.js"),[],import.meta.url)]);return await t(i,n,e)}catch(t){return console.warn("friction: faust tier unavailable — using the event fallback",t),null}}const Gf=.42,gE=.08,Vf=.4;function xg(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("friction model built before the noise buffers were ready");const s=t.force??.55,o=t.pitch??180,r=t.decay??.5,a=t.bright??.5,c=t.roughness??.4,l=t.motion??"cycle",h=t.speed??.3,u=e.createGain();u.gain.value=t.gain??.5;const f=e.createGain();f.gain.value=1,f.connect(u);const d=e.createGain();d.gain.value=0,d.connect(u);const g=e.createGain();g.connect(f);const v=22+a*22,m=fo(e,[{hz:o,decay:r,level:1,q:v},{hz:o*2.41,decay:r*.7,level:.12+.55*a,q:v*.8},{hz:o*4.17,decay:r*.45,level:.06+.32*a,q:v*.6},{hz:o*6.83,decay:r*.3,level:.03+.18*a,q:v*.5}],g,{ring:"excitation"}),p=e.createBufferSource();p.buffer=n.pink,p.loop=!0;const x=e.createBiquadFilter();x.type="bandpass",x.frequency.value=o*1.6,x.Q.value=3.5;const y=e.createGain();y.gain.value=0,p.connect(x).connect(y).connect(f),p.start();const w=zn(e);let b=0,S=l==="steady"?h:0,E=s,T=null,_=!0,M=1+Math.random()*4,A=!1,P=h,C=.8,L=Math.random(),N=null,F=!1;const H=mE(e).then(V=>{if(!V)return;if(F){V.dispose();return}N=V,V.node.connect(d),V.set("force",s),V.set("pitch",o),V.set("decay",r),V.set("bright",a),V.set("roughness",c),V.set("gain",.7),V.set("speed",b);const et=e.currentTime;d.gain.setTargetAtTime(1,et,Vf/3),f.gain.setTargetAtTime(0,et,Vf/3)});function G(V){if(M-=V,M<=0&&(A=!A,M=A?2+Math.random()*5:5+Math.random()*14,P=h*(.6+Math.random()*.7),C=.55+Math.random()*.65,L=0),!A){S=0;return}L+=V*C,S=P*Math.max(0,Math.sin(L*Math.PI*2))**.55}return{output:u,ready:H,setSpeed(V){T=Math.max(0,Math.min(1,V))},setForce(V){E=Math.max(0,Math.min(1,V)),N?.set("force",E)},get usingFaust(){return N!==null},get loop(){return N},get currentSpeed(){return b},update(V,et,lt){if(!_)return;if(T!==null)S=T,T=null;else if(l==="cycle")G(V);else if(l==="weather"){const rt=Math.max(0,et.weather.strengthAt(lt.x,lt.z)-Gf);S=Math.min(1,(rt/(1-Gf))**1.6)*h}if(b+=(S-b)*Math.min(1,V/gE),N?.set("speed",b),N)return;const bt=e.currentTime;if(b<.01){y.gain.setTargetAtTime(0,bt,.2),w.reset();return}y.gain.setTargetAtTime(.022*E*b**.7,bt,.12);const Dt=2+b*26,J=E*.5*(.3+.7/(1+b*6));w.pump(rt=>{const K=.7+Math.random()*.6;for(const $ of m.inputs)kn(e,n.white,$,rt,J*K,.003)},Li(Dt),"immediate")},setActive(V){_=V,V||(y.gain.setTargetAtTime(0,e.currentTime,.1),w.reset(),N?.set("speed",0),b=0)},dispose(){F=!0,p.stop(),p.disconnect(),x.disconnect(),y.disconnect(),m.dispose(),g.disconnect(),N?.dispose(),d.disconnect(),f.disconnect(),u.disconnect()}}}const vE=7,Wf=.3,Xf=.4;async function yE(i){try{const[{createFaustNode:t},{waveguideMeta:e,waveguideUrl:n}]=await Promise.all([Qa(()=>Promise.resolve().then(()=>ag),void 0,import.meta.url),Qa(()=>import("./waveguide-DEcBmVT0.js"),[],import.meta.url)]);return await t(i,n,e)}catch(t){return console.warn("waveguide: faust tier unavailable — using the modal fallback",t),null}}function _g(i,t={}){const e=i.context,n=i.noise;if(n===null)throw new Error("waveguide built before the noise buffers were ready");const s=n.white,o=t.pitch??440,r=t.decay??2,a=t.bright??.5,c=t.closed??!1,l=t.place??.22,h=t.excite??"chime",u=t.drive??.5,f=t.weather??!1,d=e.createGain();d.gain.value=(t.gain??.5)*3.2;const g=e.createGain();g.gain.value=0,g.connect(d);const v=e.createGain();v.gain.value=1,v.connect(d);const m=e.createGain();m.gain.value=1;const p=e.createBufferSource();p.buffer=s,p.loop=!0;const x=e.createBiquadFilter();x.type="bandpass",x.frequency.value=o*(c?.5:1),x.Q.value=.9;const y=e.createGain();y.gain.value=0,p.connect(x).connect(y).connect(m),p.start();const w=c?o*.5:o,S=fo(e,(c?[1,3,5,7]:[1,2,3,4]).map((C,L)=>({hz:w*C,decay:r/(1+L*.6),level:(.2+a*.8)**L,q:60+a*60})),v,{ring:"filter",maxQ:200});for(const C of S.inputs)m.connect(C);const E=zn(e);let T=null,_=!1,M=!0;const A=yE(e).then(C=>{if(!C)return;if(_){C.dispose();return}T=C,m.connect(C.node),C.node.connect(g),C.set("pitch",o),C.set("decay",r),C.set("bright",a),C.set("closed",c?1:0),C.set("place",l),C.set("gain",.7);const L=e.currentTime;g.gain.setTargetAtTime(1,L,Xf/3),v.gain.setTargetAtTime(0,L,Xf/3)});function P(C,L){kn(e,s,m,C,L*.5,.0016)}return{output:d,ready:A,get loop(){return T},get usingFaust(){return T!==null},strike(C=1){P(e.currentTime+.02,C)},update(C,L,N){if(!M)return;const F=Math.max(0,L.weather.strengthAt(N.x,N.z)-Wf)/(1-Wf),H=f?u*F**2:u,G=e.currentTime;if(h==="breath"){y.gain.setTargetAtTime(H*.09,G,.25);return}if(y.gain.setTargetAtTime(0,G,.25),H<.02){E.reset();return}E.pump(V=>P(V,.35+Math.random()*.65),Li(vE*H),"oneGap")},setActive(C){M=C,C||(y.gain.setTargetAtTime(0,e.currentTime,.1),E.reset())},dispose(){_=!0,p.stop(),p.disconnect(),x.disconnect(),y.disconnect(),S.dispose(),m.disconnect(),T?.dispose(),g.disconnect(),v.disconnect(),d.disconnect()}}}function wE(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("drip built before the noise buffers were ready");const s=t.radius??[.0018,.0032],o=t.cycles??30,r=t.tick??.35,a=e.createGain();a.gain.value=t.gain??.5;const c=e.createBiquadFilter();return c.type="bandpass",c.frequency.value=3800,c.Q.value=3,c.connect(a),{output:a,fire(l,h){return kn(e,n.white,c,l,h*r,.0016),ja(e,a,l+.0015,{radius:Ja(s[0],s[1]),level:h*.55,cycles:o*(.85+Math.random()*.3),rise:.34})+.02},dispose(){c.disconnect(),a.disconnect()}}}const xE=[{ratio:.5,decay:1,level:.5},{ratio:1,decay:.72,level:.85},{ratio:1.2,decay:.55,level:.7},{ratio:1.5,decay:.42,level:.45},{ratio:2,decay:.35,level:1},{ratio:2.5,decay:.2,level:.3},{ratio:2.67,decay:.17,level:.26},{ratio:3,decay:.13,level:.22},{ratio:4,decay:.09,level:.16},{ratio:5.33,decay:.06,level:.1},{ratio:6.4,decay:.04,level:.07}];function _E(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("bell built before the noise buffers were ready");const s=t.hz??168,o=t.decay??14,r=t.strike??.4,a=t.warble??1,c=Math.max(1,t.strokes??1),l=t.interval??2.4,h=e.createGain();h.gain.value=t.gain??.5;const u=e.createBiquadFilter();u.type="bandpass",u.frequency.value=s*9,u.Q.value=1.6,u.connect(h);const f=(g,v,m,p,x)=>{const y=e.createOscillator();y.type="sine",y.frequency.value=s*v,y.detune.value=x;const w=e.createGain();w.gain.setValueAtTime(p,g),w.gain.exponentialRampToValueAtTime(p*5e-4,g+m),y.connect(w).connect(h),y.start(g),y.stop(g+m+.02)},d=(g,v)=>{kn(e,n.white,u,g,v*r,.004);let m=0;for(const p of xE){const x=v*p.level*.14*(.85+Math.random()*.3),y=o*p.decay*(.9+Math.random()*.2),w=a*p.ratio*1.6;f(g,p.ratio,y,x,-w),f(g,p.ratio,y,x,w),m=Math.max(m,y)}return m};return{output:h,fire(g,v){let m=0;for(let p=0;p<c;p++){const x=g+p*l*(1+(Math.random()*2-1)*.02);m=x-g+d(x,v*(p===0?1:.9))}return m},dispose(){u.disconnect(),h.disconnect()}}}const qf=[{hz:512,decay:.3,level:.4},{hz:1183,decay:.85,level:.72},{hz:1794,decay:1.15,level:1},{hz:2741,decay:.7,level:.5},{hz:4310,decay:.4,level:.28}];function ME(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("hammer built before the noise buffers were ready");const s=t.tone??1,o=Math.min(.9,Math.max(0,t.damping??.3)),r=t.bounces??2,a=e.createGain();a.gain.value=t.gain??.7;const c=fo(e,qf.map(h=>({hz:h.hz*s,decay:h.decay*(1-o),level:h.level})),a),l=(h,u,f)=>{const d=f?.0022:.0035;c.inputs.forEach((g,v)=>{kn(e,n.white,g,h,u*qf[v].level,d)}),Mc(e,a,h,u*(f?.5:.16),165*s,62*s,.075,.003)};return{output:a,fire(h,u){l(h,u,!0);let f=.13+Math.random()*.05,d=u*.3;for(let g=0;g<r;g++)l(h+f,d*(.7+Math.random()*.5),!1),f+=(.13+Math.random()*.05)*Math.pow(.66,g+1),d*=.5;return f+1.3*(1-o)+.2},dispose(){c.dispose(),a.disconnect()}}}const bE={wood:{count:9,over:.34,energyDecay:.13,hz:380,q:2.1,level:.5,thumpHz:120},pot:{count:7,over:.28,energyDecay:.1,hz:950,q:4.2,level:.42,thumpHz:175},metal:{count:11,over:.42,energyDecay:.16,hz:1750,q:5.5,level:.4,thumpHz:210},stone:{count:6,over:.22,energyDecay:.07,hz:640,q:1.6,level:.55,thumpHz:95}};function SE(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("clatter built before the noise buffers were ready");const s=bE[t.material??"wood"],o=t.tone??1,r=t.heft??.5,a=e.createGain();a.gain.value=t.gain??.6;const c={...s,hz:s.hz*o,count:t.pieces??s.count},l=ng(e,c,a);return{output:a,fire(h,u){return kn(e,n.white,l.input,h,u*1.4,.012+Math.random()*.01),Mc(e,a,h,u*r*.55,s.thumpHz*o,s.thumpHz*o*.45,.08,.004),ig(e,n.white,l.input,c,h+.02,u),c.over*1.4+.15},dispose(){l.dispose(),a.disconnect()}}}const EE={dog:{f0:[440,235],onset:.62,syllables:[2,4],length:[.085,.135],gap:[.2,.34],attack:.06,rasp:.34,open:[{hz:880,q:6,level:1},{hz:1620,q:9,level:.55},{hz:3100,q:12,level:.3}],close:[{hz:520,q:7,level:.7},{hz:1180,q:8,level:.3},{hz:2600,q:12,level:.12}],variance:.14},sheep:{f0:[355,300],onset:.82,syllables:[1,2],length:[.55,1.05],gap:[.35,.6],attack:.14,rasp:.22,open:[{hz:620,q:7,level:1},{hz:1720,q:11,level:.42},{hz:2650,q:14,level:.18}],close:[{hz:700,q:7,level:.9},{hz:1500,q:10,level:.3},{hz:2600,q:14,level:.12}],vibrato:{hz:13,cents:105},variance:.1},cow:{f0:[168,108],onset:.72,syllables:[1,1],length:[1.1,1.8],gap:[.5,.8],attack:.22,rasp:.16,open:[{hz:390,q:6,level:1},{hz:800,q:8,level:.5},{hz:1900,q:12,level:.14}],close:[{hz:330,q:6,level:.85},{hz:720,q:8,level:.3},{hz:1750,q:12,level:.08}],vibrato:{hz:5.5,cents:35},variance:.08},fowl:{f0:[880,620],onset:.7,syllables:[3,6],length:[.045,.085],gap:[.09,.21],attack:.12,rasp:.55,open:[{hz:1450,q:8,level:1},{hz:2700,q:11,level:.5},{hz:4200,q:14,level:.22}],close:[{hz:1150,q:8,level:.6},{hz:2400,q:11,level:.25},{hz:3900,q:14,level:.1}],variance:.16}};function Nl(i){return i[0]+Math.random()*(i[1]-i[0])}function Yf(i,t){return i.map(e=>({...e,hz:e.hz*t}))}function TE(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("animal built before the noise buffers were ready");const s=EE[t.kind??"dog"],o=t.tone??1,r=Math.min(1,(t.rasp??0)+s.rasp),a=e.createGain();a.gain.value=t.gain??.6;const c=Yf(s.open,o),l=Yf(s.close,o),h=yg(e,c,a),u=[];let f=0;const d=(v,m,p,x)=>{const y=e.createGain();y.connect(h.input);const w=e.createOscillator();w.type="sawtooth";const b=x,S=b*s.onset,E=m*s.attack;w.frequency.setValueAtTime(S,v),w.frequency.exponentialRampToValueAtTime(b,v+E),w.frequency.exponentialRampToValueAtTime(Math.max(b*(s.f0[1]/s.f0[0]),20),v+m),w.connect(y),w.start(v);let T=null;if(s.vibrato){T=e.createOscillator(),T.frequency.value=s.vibrato.hz*(.85+Math.random()*.3);const P=e.createGain();P.gain.value=s.vibrato.cents,T.connect(P).connect(w.detune),T.start(v),u.push(P)}let _=null;if(r>.01){_=e.createBufferSource(),_.buffer=n.white,_.playbackRate.value=.8+Math.random()*.5;const P=e.createGain();P.gain.value=r*.55,_.connect(P).connect(y),_.start(v,Math.random()*Math.max(n.white.duration-2,0)),u.push(P)}const M=Math.max(.02,m*.28);y.gain.setValueAtTime(0,v),y.gain.linearRampToValueAtTime(p,v+E),y.gain.linearRampToValueAtTime(p*.62,v+m-M),y.gain.setTargetAtTime(0,v+m-M,M/3);const A=v+m+M*3;w.stop(A),T?.stop(A),_?.stop(A),u.push(y),f=Math.max(f,A),h.shape(c,v,E),h.shape(l,v+m*.55,m*.45)};let g=0;return{output:a,fire(v,m){f=v;const p=Math.round(Nl(s.syllables)),x=s.f0[0]*o*(1+(Math.random()*2-1)*s.variance);let y=v;for(let b=0;b<p;b++){const S=Nl(s.length);d(y,S,m*Math.pow(.86,b)*(.85+Math.random()*.3),x),y+=S+Nl(s.gap)}const w=f-v;return window.clearTimeout(g),g=window.setTimeout(()=>{for(const b of u)b.disconnect();u.length=0},(w+.4)*1e3),w},dispose(){window.clearTimeout(g);for(const v of u)v.disconnect();u.length=0,h.dispose(),a.disconnect()}}}function Mg(i,t){switch(t.sound){case"hammer":return ME(i,t.options);case"clatter":return SE(i,t.options);case"animal":return TE(i,t.options);case"drip":return wE(i,t.options);case"bell":return _E(i,t.options)}}const AE=[5,.4,5];class RE{context;voices=[];clock;centre=new R;spread=new R;force;gap;active=!0;constructor(t,e){this.context=t.context,this.centre.set(...e.at),this.spread.set(...e.spread??AE),this.force=e.force??[.55,1];const n=Math.max(e.every,.05);this.gap=e.rhythm==="periodic"?hg(n,.09):Li(1/n),this.clock=zn(t.context);const s=Math.max(1,e.voices??2);for(let o=0;o<s;o++){const r=Mg(t,e);this.voices.push({shot:r,busyUntil:0,emitter:new cg(t,r,{position:this.centre,refDistance:e.refDistance,maxDistance:e.maxDistance,rolloff:e.rolloff,reverb:e.reverb,importance:e.importance,ignoreAbsorption:e.ignoreAbsorption,ignoreOcclusion:e.ignoreOcclusion,invertDistance:e.invertDistance})})}}setActive(t){if(t!==this.active){this.active=t,t&&this.clock.reset();for(const e of this.voices)e.emitter.enabled=t}}update(t,e,n){for(const s of this.voices)s.emitter.update(t,e,n);if(this.active){if(this.voices.every(s=>s.emitter.isVirtual)){this.clock.reset();return}this.clock.pump(s=>this.fire(s),this.gap,"oneGap")}}fire(t){const e=this.voices.find(r=>r.busyUntil<=t);if(!e||e.emitter.isVirtual)return;$f.set(this.centre.x+(Math.random()*2-1)*this.spread.x,this.centre.y+(Math.random()*2-1)*this.spread.y,this.centre.z+(Math.random()*2-1)*this.spread.z),e.emitter.moveTo($f);const[n,s]=this.force,o=e.shot.fire(t,n+Math.random()*(s-n));e.busyUntil=t+o}trigger(){this.fire(this.context.currentTime+.02)}get shots(){return this.voices.map(t=>t.shot)}get voiceCount(){return this.voices.length}dispose(){for(const t of this.voices)t.emitter.dispose();this.voices.length=0}}const $f=new R,id={};function Zf(i,t){switch(t.model){case"wind":return lg(i,t.options);case"foliage":return ug(i,t.options);case"machine":return dg(i,t.options);case"bird":return fg(i,t.options);case"fire":return pg(i,t.options);case"rain":return gg(i,t.options);case"water":return vg(i,t.options);case"crowd":return wg(i,t.options);case"friction":return xg(i,t.options);case"waveguide":return _g(i,t.options)}}class CE{engine;emitters=[];models=new Map;emitterById=new Map;fields=new Map;beds=[];bedBus=null;scatter=[];active=!0;constructor(t,e){this.engine=t;const n=e.bed?Array.isArray(e.bed)?e.bed:[e.bed]:[];if(n.length>0){const s=t.context.createGain();s.connect(t.dry),this.bedBus=s;for(const o of n){const r=Zf(t,o),a=t.context.createGain();a.gain.value=o.gain??1,r.output.connect(a).connect(s),this.beds.push(r),o.id&&this.models.set(o.id,r)}}for(const s of e.emitters??[]){const o=Zf(t,s);s.id&&this.models.set(s.id,o);const r=new cg(t,o,{position:new R(...s.at),refDistance:s.refDistance,maxDistance:s.maxDistance,rolloff:s.rolloff,reverb:s.reverb,importance:s.importance,ignoreAbsorption:s.ignoreAbsorption,ignoreOcclusion:s.ignoreOcclusion,invertDistance:s.invertDistance});this.emitters.push(r),s.id&&this.emitterById.set(s.id,r)}for(const s of e.scatter??[]){const o=new RE(t,s);this.scatter.push(o),s.id&&this.fields.set(s.id,o)}}setActive(t){if(t!==this.active){this.active=t;for(const e of this.emitters)e.enabled=t;for(const e of this.scatter)e.setActive(t);this.bedBus?.gain.setTargetAtTime(t?1:0,this.engine.context.currentTime,.15)}}setBedLevel(t,e=.35){!this.bedBus||!this.active||this.bedBus.gain.setTargetAtTime(t,this.engine.context.currentTime,e)}update(t,e,n){if(this.active){for(const s of this.beds)s.update?.(t,this.engine,this.engine.listenerPosition);for(const s of this.emitters)s.update(t,e,n);for(const s of this.scatter)s.update(t,e,n)}}find(t){return this.models.get(t)??null}findField(t){return this.fields.get(t)??null}setSolo(t){if(this.active){for(const[e,n]of this.emitterById)n.enabled=t===null||e===t;for(const[e,n]of this.fields)n.setActive(t===null||e===t)}}get emitterCount(){return this.emitters.length+this.scatter.reduce((t,e)=>t+e.voiceCount,0)}get occludedCount(){return this.emitters.filter(t=>t.isOccluded).length}dispose(){for(const t of this.emitters)t.dispose();this.emitters.length=0,this.emitterById.clear();for(const t of this.scatter)t.dispose();this.scatter.length=0,this.fields.clear();for(const t of this.beds)t.dispose();this.beds.length=0,this.bedBus?.disconnect(),this.models.clear()}}const gs={sky:!0,fogColor:"#bcd4e6",fogNear:25,fogFar:140,sunIntensity:2.2,sunColor:16773848,fillIntensity:1.15,fillColor:14735040,ambientIntensity:1.8,ambientSky:10339560,ambientGround:9076584,room:"open",surface:"earth",footstepReverb:.7,soundscape:{bed:{model:"wind",id:"wind",options:{gain:.17,tone:3400}}}},po={sky:!1,fogColor:"#0d0f12",fogNear:6,fogFar:34,sunIntensity:1.1,sunColor:16770748,fillIntensity:.75,fillColor:9412792,ambientIntensity:2.1,ambientSky:9078390,ambientGround:4867130,room:"cell",surface:"wood",footstepReverb:.5,soundscape:id},PE=.12,IE=[];class DE{definition;group=null;water=!1;constructor(t){this.definition=t}get id(){return this.definition.id}get name(){return this.definition.name}get environment(){return this.definition.environment}get spawn(){return this.definition.spawn}get fogVolumes(){return this.definition.fogVolumes??IE}get hasWater(){return this.water}get floor(){return this.definition.floor??-20}settle(t){const e=this.definition.groundAt;if(!e)return t;const n=t.position.clone();return n.y=e(n.x,n.z)+PE,{position:n,yaw:t.yaw}}root(){return this.group===null&&(this.group=this.definition.build(),this.group.name=`zone:${this.definition.id}`,this.group.updateWorldMatrix(!0,!0),this.water=!1,this.group.traverse(t=>{t.userData.water===!0&&(this.water=!0)})),this.group}get isBuilt(){return this.group!==null}dispose(){this.group!==null&&(this.group.traverse(t=>{(t instanceof $t||t instanceof Wu||t instanceof Sm)&&t.geometry.dispose()}),this.group.clear(),this.group=null,this.water=!1)}}const LE=1.15;function NE(i,t=new R){return t.set(Math.sin(i),0,Math.cos(i))}function FE(i){if(i.arrival)return{position:i.arrival.position.clone(),yaw:i.arrival.yaw};const t=NE(i.yaw);return{position:i.position.clone().addScaledVector(t,LE),yaw:i.yaw+Math.PI}}class UE{byZone=new Map;byDoor=new Map;add(t,e){this.addSide(t.id,t.a,t.b,e),this.addSide(t.id,t.b,t.a,e)}addSide(t,e,n,s){const o={portal:t,end:e,target:n,arrival:FE(n),door:null,title:"Door",label:e.label??s(n.zone)},r=this.byZone.get(e.zone);r?r.push(o):this.byZone.set(e.zone,[o])}in(t){return this.byZone.get(t)??[]}bind(t,e,n){t.door=e,t.title=n,e.userData.portal=t,this.byDoor.set(e,t)}unbind(t){t.door&&this.byDoor.delete(t.door),t.door=null}sideOf(t){let e=t;for(;e;){const n=this.byDoor.get(e);if(n)return n;e=e.parent}return null}all(){return[...this.byZone.values()].flat()}}function OE(i,t,e){const n=new Set([t]);let s=[t];for(let o=0;o<e;o++){const r=[];for(const a of s)for(const c of i.in(a)){const l=c.target.zone;n.has(l)||(n.add(l),r.push(l))}if(r.length===0)break;s=r}return n}const kE=2,zE=3.2,BE=.15;function HE(i,t){return i.userData.label=t,i}function GE(i){for(let t=i;t;t=t.parent){const e=t.userData.label;if(typeof e=="string")return e}return null}class VE{reach=zE;raycaster=new CM;targets=[];constructor(){this.raycaster.far=this.reach}setTargets(t){this.targets=t}get targetCount(){return this.targets.length}probe(t,e){if(this.targets.length===0)return null;t.updateWorldMatrix(!0,!1),Fl.setFromMatrixPosition(t.matrixWorld),Ul.set(0,0,-1).applyQuaternion(t.getWorldQuaternion(WE)),this.raycaster.far=this.reach,this.raycaster.set(Fl,Ul);const n=this.raycaster.intersectObjects(this.targets,!0);if(n.length===0)return null;const s=n[0],o=e.raycast(Fl,Ul);return o!==null&&o<s.distance-BE?null:{object:s.object,distance:s.distance}}}const Fl=new R,Ul=new R,WE=new ui,hu={timber:[{leaf:D.TIMBER,ledge:D.TIMBER_DARK,iron:D.IRON,frame:D.STONE_DARK},{leaf:I(D.TIMBER,1.18),ledge:D.TIMBER,iron:D.IRON_DARK,frame:D.STONE},{leaf:D.TIMBER_DARK,ledge:I(D.TIMBER_DARK,.78),iron:D.IRON_DARK,frame:D.STONE_DARK},{leaf:8212278,ledge:6044200,iron:D.IRON_DARK,frame:D.STONE_DARK},{leaf:4537395,ledge:5720380,iron:D.RUST,frame:D.STONE_DARK}],plank:[{leaf:D.TIMBER_PALE,ledge:D.TIMBER,iron:D.RUST,frame:D.TIMBER_DARK},{leaf:9866620,ledge:7564124,iron:D.RUST,frame:D.TIMBER_DARK},{leaf:10256993,ledge:8021323,iron:D.IRON,frame:I(D.TIMBER_DARK,.88)}]},XE=["timber","plank"];function bg(i={}){const{seed:t=1,scale:e=1}=i,n=gt(t),s=[],o=i.material??n.pick(XE),r=n.pick(hu[o]),a=I(r.leaf,n.range(.94,1.06)),c=n.range(.94,1.16),l=n.range(2,2.28),h=n.range(.07,.1),u=n.range(.13,.18),f=h*2.4;for(const M of[-1,1]){const A=new k(u,l+u,f);A.translate(M*(c+u)/2,(l+u)/2,-f*.18),s.push({geometry:A,color:r.frame,sway:0})}const d=new k(c+u*2.6,u,f*1.1);if(d.translate(0,l+u/2,-f*.18),s.push({geometry:d,color:r.frame,sway:0}),n.chance(.55)){const M=new k(c+u*2.2,.06,f*1.5);M.translate(0,.03,-f*.1),s.push({geometry:M,color:r.frame,sway:0})}const g=new k(c,l,.02);g.translate(0,l/2,-h*.5),s.push({geometry:g,color:1316378,sway:0});const v=n.int(4,6),m=c/v;for(let M=0;M<v;M++){const A=h*n.range(.88,1),P=new k(m*.94,l*n.range(.985,1),A);P.translate(-c/2+m*(M+.5),l/2,A/2),s.push({geometry:P,color:I(a,n.range(.95,1.05)),sway:0})}const p=n.chance(.4)?[l*.16,l*.52,l*.87]:[l*.18,l*.82],x=h*.42;for(const M of p){const A=new k(c*.96,n.range(.1,.15),x);A.translate(0,M,h+x/2),s.push({geometry:A,color:r.ledge,sway:0})}const y=n.chance(.5)?-1:1,w=x*.5;for(const M of[p[0],p[p.length-1]]){const A=c*n.range(.45,.7),P=new k(A,.055,w);P.translate(y*(c/2-A/2),M,h+x+w/2),s.push({geometry:P,color:r.iron,sway:0});const C=new k(.07,.09,w*2.2);C.translate(y*(c/2+.02),M,h+w),s.push({geometry:C,color:r.iron,sway:0})}const b=-y*c*n.range(.3,.36),S=l*n.range(.44,.5);if(n.chance(.5)){const M=new Y(.062,.062,.02,8);M.rotateX(Math.PI/2),M.translate(b,S,h+.01),s.push({geometry:M,color:r.iron,sway:0});const A=new Y(.022,.026,.05,6);A.rotateX(Math.PI/2),A.translate(b,S,h+.043),s.push({geometry:A,color:r.iron,sway:0});const P=new ie(.052,0);P.scale(1,1,.78),P.translate(b,S,h+.095),s.push({geometry:P,color:r.iron,sway:0})}else{const M=new k(.045,.2,.045);M.translate(b,S,h+.055),s.push({geometry:M,color:r.iron,sway:0});for(const A of[-.09,.09]){const P=new k(.05,.05,.05);P.translate(b,S+A,h+.025),s.push({geometry:P,color:r.iron,sway:0})}}const E=pt(s);e!==1&&E.scale(e,e,e);const T=xt(E,"hut-door",0),_={width:(c+u*2)*e,height:(l+u)*e,depth:(h+x+w)*e,material:o};return T.userData.door=_,T}const qE={name:"hut-door",display:"Wood Door",category:"structures",radius:.9,build:bg};function Sg(i={}){const{seed:t=1,scale:e=1}=i,n=gt(t),s=[],o=n.chance(.35)?n.range(.55,.9):n.range(.08,.3),r=n.range(1,1.24),a=n.range(2.1,2.35),c=.05,l=n.range(.11,.15),h=I(D.IRON,n.range(.92,1.06)),u=I(D.IRON_DARK,n.range(.9,1.05)),f=M=>Fm(D.RUST,M,D.IRON),d=(M,A)=>{const P=1-Math.min(Math.max(A/a,0),1),C=Math.min(Math.abs(M)/(r/2),1);return Math.min(o*(.08+.4*P*P+.14*C*C),.85)},g=c*2.6;for(const M of[-1,1]){const A=new k(l,a+l,g);A.translate(M*(r+l)/2,(a+l)/2,-g*.18),s.push({geometry:A,color:u,sway:0,wear:o*.4,wearTint:f(u)});const P=new k(l*1.7,.035,g*1.4);P.translate(M*(r+l)/2,.018,-g*.1),s.push({geometry:P,color:I(u,.85),sway:0,wear:o*.55,wearTint:f(I(u,.85))})}const v=new k(r+l*2.4,l,g*1.05);if(v.translate(0,a+l/2,-g*.18),s.push({geometry:v,color:u,sway:0,wear:o*.3,wearTint:f(u)}),n.chance(.7)){const M=new k(r+l*1.6,.045,g*1.5);M.translate(0,.022,-g*.05),s.push({geometry:M,color:I(u,.8),sway:0,wear:o*.5,wearTint:f(I(u,.8))})}const m=new k(r,a,c,6,10,1);m.translate(0,a/2,c/2),s.push({geometry:m,color:h,sway:0,wear:(M,A)=>d(M,A),wearTint:f(h)});const p=.02,x=[a*.14,a*.5,a*.86];for(const M of x){const A=new k(r*.98,n.range(.09,.12),p);A.translate(0,M,c+p/2),s.push({geometry:A,color:I(h,1.08),sway:0,wear:o*.3,wearTint:f(I(h,1.08))});const P=5;for(let C=0;C<P;C++){const L=-r*.42+r*.84*C/(P-1),N=new Y(.016,.02,.016,6);N.rotateX(Math.PI/2),N.translate(L,M,c+p+.008),s.push({geometry:N,color:I(h,.85),sway:0,wear:o*.3,wearTint:f(I(h,.85))})}}const y=new k(r*.98,a*.13,.012);if(y.translate(0,a*.065,c+.006),s.push({geometry:y,color:I(h,.72),sway:0,wear:o*.2,wearTint:f(I(h,.72))}),n.chance(.45)){const M=n.range(.22,.3),A=n.range(.28,.36),P=a*.74,C=new k(M+.07,A+.07,.018);C.translate(0,P,c+.009),s.push({geometry:C,color:I(u,1.05),sway:0,wear:o*.25,wearTint:f(I(u,1.05))});const L=new k(M,A,.014);L.translate(0,P,c+.02),s.push({geometry:L,color:2305076,sway:0});for(const N of[-M/4,M/4]){const F=new Y(.011,.011,A+.05,6);F.translate(N,P,c+.032),s.push({geometry:F,color:I(u,.9),sway:0,wear:o*.3,wearTint:f(I(u,.9))})}}const w=n.chance(.5)?-1:1;for(const M of[a*.2,a*.8]){const A=new Y(.028,.028,.16,6);A.translate(w*(r/2+.02),M,c*.6),s.push({geometry:A,color:I(u,.9),sway:0,wear:o*.3,wearTint:f(I(u,.9))})}const b=-w*r*n.range(.32,.38),S=a*n.range(.44,.5);if(n.chance(.5)){for(const A of[-.12,.12]){const P=new k(.035,.035,.05);P.translate(b,S+A,c+.025),s.push({geometry:P,color:I(h,.8),sway:0})}const M=new Y(.017,.017,.3,6);M.translate(b,S,c+.058),s.push({geometry:M,color:I(h,1.15),sway:0})}else{const M=new Y(.042,.042,.024,8);M.rotateX(Math.PI/2),M.translate(b,S,c+.012),s.push({geometry:M,color:I(h,.8),sway:0});const A=new k(.16,.032,.026);A.rotateZ(n.range(-.25,.1)),A.translate(b-w*.055,S,c+.037),s.push({geometry:A,color:I(h,1.15),sway:0})}const E=pt(s);e!==1&&E.scale(e,e,e);const T=xt(E,"factory-door",0),_={width:(r+l*2)*e,height:(a+l)*e,depth:(c+p+.024)*e,material:"iron"};return T.userData.door=_,T}const YE={name:"factory-door",display:"Metal Door",category:"structures",radius:.9,build:Sg};function Kf(i){return i.userData.door}const $E={timber:"Wood Door",plank:"Wood Door",iron:"Metal Door"};function ZE(i){return $E[i]}const KE=["timber","iron","plank"];function jE(i={}){const{seed:t=1,scale:e=1}=i,n=i.material??gt(t).pick(KE);return n==="iron"?Sg({seed:t,scale:e}):bg({seed:t,scale:e,material:n})}function jf(){return new Promise(i=>{requestAnimationFrame(()=>requestAnimationFrame(()=>i()))})}class JE{root;bar;label;shown=!1;constructor(t){this.root=document.createElement("div"),this.root.id="building";const e=document.createElement("div");e.className="loading-track",this.bar=document.createElement("div"),this.bar.className="loading-bar",e.appendChild(this.bar),this.label=document.createElement("div"),this.label.className="loading-label",this.root.append(e,this.label),t.appendChild(this.root)}async show(t){this.label.textContent=t,this.bar.style.animation="none",this.bar.style.transform="scaleX(0.04)",this.root.classList.add("is-shown"),this.shown=!0,await jf()}async step(t,e){this.shown&&(this.label.textContent=t,e===void 0?(this.bar.style.transition="none",this.bar.style.animation="building-sweep 900ms ease-in-out infinite"):(this.bar.style.animation="none",this.bar.style.transition="",this.bar.style.transform=`scaleX(${Math.min(Math.max(e,0),1)})`),await jf())}hide(){this.shown&&(this.shown=!1,this.bar.style.animation="none",this.root.classList.remove("is-shown"))}dispose(){this.root.remove()}}const QE={level:.55,click:{hz:3200,q:6,duration:.004,level:.5},modes:[{hz:180,decay:.16,q:5,level:1},{hz:430,decay:.1,q:6,level:.55},{hz:950,decay:.055,q:7,level:.25}],thump:{from:112,to:82,decay:.13,level:.55}},tT={level:.5,click:{hz:5200,q:9,duration:.005,level:.6},modes:[{hz:240,decay:.34,q:9,level:.8},{hz:620,decay:.28,q:11,level:.6},{hz:1450,decay:.2,q:12,level:.35},{hz:2900,decay:.12,q:10,level:.18}],thump:{from:78,to:62,decay:.3,level:.7}},eT={level:.42,click:{hz:2400,q:5,duration:.003,level:.35},modes:[{hz:320,decay:.08,q:5,level:.8},{hz:720,decay:.055,q:6,level:.45},{hz:1600,decay:.035,q:6,level:.2}],thump:{from:150,to:120,decay:.07,level:.3}},nT={timber:QE,iron:tT,plank:eT};function iT(i){return Math.max(i.thump.decay,...i.modes.map(e=>e.decay))*3+Eg+.05}const Eg=.032;function va(i,t){return i+Math.random()*(t-i)}class sT{engine;constructor(t){this.engine=t}play(t,e="timber"){const n=nT[e],s=this.engine.context;if(s.state!=="running"||!this.engine.noise)return;const o=s.currentTime+.02,r=[],a=this.buildOutput(n,t,r),c=fo(s,[{hz:n.click.hz,decay:n.click.duration,level:n.click.level,q:n.click.q}],a),l=fo(s,n.modes,a);this.excite(c.inputs[0],n.click.level,o,6e-4,n.click.duration*1.5,r);const h=o+Eg;n.modes.forEach((f,d)=>{this.excite(l.inputs[d],f.level*va(.92,1.08),h,.002,f.decay,r)}),Mc(s,a,h,n.thump.level,n.thump.from*va(.96,1.04),n.thump.to,n.thump.decay,.004);const u=iT(n);window.setTimeout(()=>{for(const f of r)f.disconnect();c.dispose(),l.dispose()},(o-s.currentTime+u)*1e3+250)}buildOutput(t,e,n){const s=this.engine.context,o=s.createGain();o.gain.value=t.level;const r=s.createPanner();r.panningModel="HRTF",r.distanceModel="inverse",r.refDistance=1.6,r.maxDistance=45,r.rolloffFactor=1.1,oT(r,e);const a=s.createGain();return a.gain.value=.9,o.connect(r),r.connect(this.engine.dry),r.connect(a),a.connect(this.engine.send),n.push(o,r,a),o}excite(t,e,n,s,o,r){const a=this.engine.context,c=this.engine.noise;if(!c)return;const l=a.createBufferSource();l.buffer=c.white,l.playbackRate.value=va(.9,1.1);const h=a.createGain();_r(h.gain,n,e,s,o),l.connect(h).connect(t),l.start(n,va(0,c.white.duration-1),o*3+.05),l.stop(n+o*3+.06),r.push(l,h)}}function oT(i,t){i.positionX?(i.positionX.value=t.x,i.positionY.value=t.y,i.positionZ.value=t.z):i.setPosition(t.x,t.y,t.z)}class rT{zones=new Map;portals=new UE;lights;options;audio=null;doorAudio=null;soundscapes=new Map;warmed=new Set;entering=0;building=new JE(document.body);arrived=!1;active=null;doored=new Set;clutterShadows=!1;transitioning=!1;hovered=null;crossings=0;onZoneChange=null;constructor(t){this.options=t,this.lights={sun:new K0(16773848,2.2),fill:new K0(9412792,0),ambient:new bM(10339560,4998454,1.5)},this.lights.sun.position.set(-70,90,50);const e=this.lights.sun.shadow;e.mapSize.set(4096,4096);const n=48;e.camera.left=-n,e.camera.right=n,e.camera.top=n,e.camera.bottom=-n,e.camera.near=55,e.camera.far=225,e.bias=-8e-5,e.normalBias=.006,e.intensity=.34,this.lights.fill.position.set(9,7,-7),t.scene.add(this.lights.sun,this.lights.fill,this.lights.ambient)}get sunDirection(){return this.lights.sun.position}setShadows(t){this.lights.sun.castShadow=t}setClutterShadows(t){if(t!==this.clutterShadows){this.clutterShadows=t;for(const e of this.zones.values())e.isBuilt&&e.root().traverse(n=>{n instanceof $t&&n.userData.clutter===!0&&(n.castShadow=t)})}}register(t){const e=new DE(t);return this.zones.set(e.id,e),e}link(t){for(const e of[t.a,t.b])if(!this.zones.has(e.zone))throw new Error(`portal ${t.id} refers to unknown zone "${e.zone}"`);this.portals.add(t,e=>this.zones.get(e)?.name??e)}prebuild(t){const e=this.zones.get(t);if(!e)return;const n=this.prepare(e);n.updateWorldMatrix(!0,!0),this.options.collider.warm(n,e.id),this.warmed.add(e.id)}get builtZones(){return[...this.zones.values()].filter(t=>t.isBuilt).map(t=>t.id)}evict(){if(!this.active)return;const t=OE(this.portals,this.active.id,kE);for(const e of this.zones.values()){if(!e.isBuilt||t.has(e.id))continue;e.dispose(),this.options.collider.invalidate(e.id),this.doored.delete(e.id),this.warmed.delete(e.id);for(const s of this.portals.in(e.id))this.portals.unbind(s);const n=this.soundscapes.get(e.id);n&&(n.dispose(),this.soundscapes.delete(e.id)),this.evicted++}}evicted=0;get evictions(){return this.evicted}surfaceAt(t,e){const n=this.active;return n?n.definition.surfaceAt?.(t,e)??n.environment.surface:"earth"}attachAudio(t){this.audio=t,this.doorAudio=new sT(t.engine),this.active&&this.applyAudio(this.active)}get current(){return this.active}get isTransitioning(){return this.transitioning}async enter(t,e){const n=this.zones.get(t);if(!n)throw new Error(`no such zone "${t}"`);const s=++this.entering,o=()=>s!==this.entering,{scene:r,collider:a,player:c,postfx:l,interaction:h}=this.options,u=!this.warmed.has(n.id)&&this.arrived;if(u&&(await this.building.show(`entering ${n.name.toLowerCase()}`),await this.building.step("raising the world"),o()))return;this.active&&this.active!==n&&r.remove(this.active.root());const f=this.prepare(n);if(u&&(await this.building.step("settling the ground"),o()))return;r.add(f),this.active=n,f.updateWorldMatrix(!0,!0),a.build(f,n.id),this.warmed.add(n.id),u&&await this.building.step("almost there",.96);const d=n.environment;l.setEnvironment({sky:d.sky,fogColor:d.fogColor,fogNear:d.fogNear,fogFar:d.fogFar,fogVolumes:n.fogVolumes,water:n.hasWater}),this.lights.sun.intensity=d.sunIntensity,this.lights.sun.color.setHex(d.sunColor),this.lights.fill.intensity=d.fillIntensity,this.lights.fill.color.setHex(d.fillColor),this.lights.ambient.intensity=d.ambientIntensity,this.lights.ambient.color.setHex(d.ambientSky),this.lights.ambient.groundColor.setHex(d.ambientGround),this.applyAudio(n);const g=this.portals.in(n.id).map(m=>m.door).filter(m=>m!==null);f.traverse(m=>{typeof m.userData.label=="string"&&g.push(m)}),h.setTargets(g);const v=n.settle(e??n.spawn);c.teleport(v.position,v.yaw),this.hovered=null,this.options.reticle.set(null),this.onZoneChange?.(n),this.arrived=!0,this.building.hide(),this.evict()}applyAudio(t){if(!this.audio)return;this.audio.engine.setRoom(t.environment.room),this.audio.footsteps.surface=t.environment.surface,this.audio.footsteps.setReverb(t.environment.footstepReverb);let e=this.soundscapes.get(t.id);e||(e=new CE(this.audio.engine,t.environment.soundscape),this.soundscapes.set(t.id,e));for(const[n,s]of this.soundscapes)s.setActive(n===t.id)}updateSound(t,e){this.active&&this.soundscapes.get(this.active.id)?.update(t,this.options.collider,e)}get sound(){return this.active?this.soundscapes.get(this.active.id)??null:null}prepare(t){const e=t.root();if(this.doored.has(t.id))return e;this.doored.add(t.id);for(const n of this.portals.in(t.id)){const s=n.end,o=jE({seed:s.seed??1,material:s.material});o.position.copy(s.position),o.rotation.y=s.yaw,Xt(o),e.add(o),this.portals.bind(n,o,ZE(Kf(o).material))}return e.traverse(n=>{if(!(n instanceof $t))return;const s=n.userData.noCollide===!0,o=n.name==="flatGround"||n.name==="terrain"||n.userData.ground===!0,r=n.userData.clutter===!0;n.castShadow=!s&&!o&&(!r||this.clutterShadows),n.receiveShadow=!s}),e}update(){const{interaction:t,collider:e,player:n,reticle:s}=this.options;if(this.transitioning)return s.set(null),null;const o=t.probe(n.camera,e);if(this.hovered=o?this.portals.sideOf(o.object):null,this.hovered)s.set({title:this.hovered.title,target:this.hovered.label});else{const r=GE(o?.object??null);s.set(r?{title:r}:null)}return this.hovered}async use(t){if(this.transitioning)return;this.transitioning=!0,this.options.reticle.set(null);const e=t.door?Kf(t.door).material:"timber";Jf.copy(t.end.position).setY(t.end.position.y+1.2),this.doorAudio?.play(Jf,e),await this.options.fade.cover(async()=>{await this.enter(t.target.zone,t.arrival),this.crossings++}),this.transitioning=!1}respawn(){const t=this.active;t&&this.options.player.teleport(t.spawn.position,t.spawn.yaw)}dispose(){const{scene:t}=this.options;this.active&&t.remove(this.active.root()),t.remove(this.lights.sun,this.lights.fill,this.lights.ambient);for(const e of this.soundscapes.values())e.dispose();this.soundscapes.clear();for(const e of this.zones.values())e.dispose();this.zones.clear(),this.doored.clear()}}const Jf=new R,aT=.14,Qf=.22;class cT{element;title;target;joiner;shown=!1;showing="";constructor(t){this.element=document.createElement("div"),this.element.id="prompt",this.element.setAttribute("aria-live","polite");const e=document.createElement("span");e.className="prompt-lines",this.title=document.createElement("span"),this.title.className="prompt-title",this.joiner=document.createElement("span"),this.joiner.className="prompt-to",this.joiner.textContent="to",this.target=document.createElement("span"),this.target.className="prompt-target",e.append(this.title,this.joiner,this.target),this.element.append(e),t.appendChild(this.element)}set(t){const e=t!==null;if(t){const n=`${t.title}\0${t.target}`;if(n!==this.showing){this.showing=n,this.title.textContent=t.title,this.target.textContent=t.target??"";const s=!!t.target;this.joiner.hidden=!s,this.target.hidden=!s}}e!==this.shown&&(this.shown=e,this.element.classList.toggle("is-shown",e))}dispose(){this.element.remove()}}class lT{element;constructor(t){this.element=document.createElement("div"),this.element.id="fade",t.appendChild(this.element)}async cover(t){this.element.classList.add("is-black"),await Ol(Qf),await t(),await Ol(aT),this.element.classList.remove("is-black"),await Ol(Qf)}dispose(){this.element.remove()}}function Ol(i){return new Promise(t=>window.setTimeout(t,i*1e3))}const hT=6,uT=.55,dT=.42;class fT{element;renderer;pixel=new Uint8Array(4);countdown=0;onLight=!1;constructor(t,e=document.getElementById("crosshair")){this.renderer=t,this.element=e}update(){if(!this.element||this.countdown-- >0)return;this.countdown=hT;const t=this.renderer.getContext();this.renderer.setRenderTarget(null);const e=t.drawingBufferWidth,n=t.drawingBufferHeight;if(e===0||n===0)return;t.readPixels(e>>1,n>>1,1,1,t.RGBA,t.UNSIGNED_BYTE,this.pixel);const s=(.2126*this.pixel[0]+.7152*this.pixel[1]+.0722*this.pixel[2])/255,o=this.onLight?s>dT:s>uT;o!==this.onLight&&(this.onLight=o,this.element.classList.toggle("on-light",o))}}const Mr={floor:D.TIMBER,floorSeam:1315085,wall:D.CLOTH,wallTrim:D.TIMBER_DARK,ceiling:D.TIMBER_DARK,beam:D.BARK},bc={floor:D.STONE_DARK,floorSeam:921618,wall:D.STONE,wallTrim:D.IRON,ceiling:4015178,beam:D.RUST};function Ni(i){const{width:t,depth:e,height:n,seed:s=1,style:o=Mr,planks:r=!0,beams:a=3,thickness:c=.35}=i,l=gt(s),h=[],u=c,f=t+u*2,d=e+u*2,g=r?-.006:0,v=new k(f,u,d);v.translate(0,g-u/2,0),h.push({geometry:v,color:r?o.floorSeam:o.floor,sway:0});const m=new k(f,u,d);m.translate(0,n+u/2,0),h.push({geometry:m,color:o.ceiling,sway:0});for(const x of[-1,1]){const y=new k(f,n,u);y.translate(0,n/2,x*(e+u)/2),h.push({geometry:y,color:o.wall,sway:0})}for(const x of[-1,1]){const y=new k(u,n,d);y.translate(x*(t+u)/2,n/2,0),h.push({geometry:y,color:o.wall,sway:0})}if(r){const x=l.range(.24,.34),y=Math.ceil(t/x),w=.012;for(let b=0;b<y;b++){const S=-t/2+(b+.5)*x,E=new k(x-w,.03,e);E.translate(S,-.015,0),h.push({geometry:E,color:I(o.floor,l.around(1,.09)),sway:0})}}if(a>0){const x=l.range(.16,.24);for(let y=0;y<a;y++){const w=-e/2+(y+.5)/a*e,b=new k(f,x,l.range(.18,.26));b.translate(0,n-x/2,w),h.push({geometry:b,color:o.beam,sway:0})}}const p=.16;for(const x of[-1,1]){const y=new k(t,p,.06);y.translate(0,p/2,x*(e-.06)/2),h.push({geometry:y,color:o.wallTrim,sway:0})}for(const x of[-1,1]){const y=new k(.06,p,e);y.translate(x*(t-.06)/2,p/2,0),h.push({geometry:y,color:o.wallTrim,sway:0})}return xt(pt(h),"interior",0)}const tc={name:"hut",category:"structures",radius:2.6,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(3,4.4),o=e.range(2.6,3.8),r=e.range(2,2.6),a=e.range(.4,.8),c=e.range(.9,1.5),l=new Y(c,c,s*1.16,3,1);l.rotateZ(Math.PI/2),l.rotateX(Math.PI/6),l.scale(1,1,o*1.2/(c*2)),l.computeBoundingBox(),l.translate(0,r-(l.boundingBox?.min.y??0),0),n.push({geometry:l,color:D.STONE,sway:0});const h=r,u=new k(s,a,o);u.translate(0,a/2,0),n.push({geometry:u,color:D.STONE_DARK,sway:0});const f=new k(s*.97,h-a,o*.97);f.translate(0,a+(h-a)/2,0),n.push({geometry:f,color:D.TIMBER,sway:0});const d=e.range(.75,.95),g=e.range(1.5,1.8),v=e.around(0,s*.15),m=new k(d,g,.08);m.translate(v,g/2,o*.487),n.push({geometry:m,color:1514012,sway:0});const p=new k(d*1.3,.14,.16);p.translate(v,g+.07,o*.49),n.push({geometry:p,color:D.TIMBER_DARK,sway:0});for(const b of[-1,1])for(const S of[-1,1]){const E=new k(.16,h,.16);E.translate(b*s/2,h/2,S*o/2),n.push({geometry:E,color:D.TIMBER_DARK,sway:0})}const x=pt(n);t!==1&&x.scale(t,t,t);const y=xt(x,"hut",0),w={x:v*t,z:o*.487*t,width:d*t,height:g*t};return y.userData.doorAnchor=w,y}};function pT(i){return i.userData.doorAnchor}const tp=[{name:"small",weight:.3,scale:[.55,.75]},{name:"ordinary",weight:.45,scale:[.85,1.15]},{name:"large",weight:.18,scale:[1.5,1.9]},{name:"huge",weight:.07,scale:[2.1,2.6]}],us={name:"crate",category:"objects",radius:1.2,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[];let s=e(),o=tp[1];for(const m of tp)if(s-=m.weight,s<=0){o=m;break}const r=e.range(o.scale[0],o.scale[1]),a=e.range(.5,.9)*r,c=e.range(.45,.8)*r,l=e.range(.5,.9)*r,h=e.around(0,.35),u=new k(a,c,l);u.translate(0,c/2,0),u.rotateY(h),n.push({geometry:u,color:D.TIMBER,sway:0});const f=Math.max(2,Math.round(2+r*.9+(e.chance(.3)?1:0))),d=.05*Math.min(r,1.5),g=1.02;for(let m=0;m<f;m++){const p=c*(.13+m/Math.max(f-1,1)*.74),x=new k(a*g,d,l*g);x.translate(0,p,0),x.rotateY(h),n.push({geometry:x,color:D.TIMBER_DARK,sway:0})}if(r>1.2||e.chance(.25)){const m=.055*Math.min(r,1.6);for(const p of[-1,1])for(const x of[-1,1]){const y=new k(m,c*.96,m);y.translate(p*a/2,c*.48,x*l/2),y.rotateY(h),n.push({geometry:y,color:D.RUST,sway:0})}}if(e.chance(.35)){const m=new k(a*.92,.05*r,l*.92);m.translate(e.around(0,.08*r),c+.03*r,e.around(0,.08*r)),m.rotateY(h+e.around(0,.25)),n.push({geometry:m,color:D.TIMBER_DARK,sway:0})}const v=pt(n);return t!==1&&v.scale(t,t,t),xt(v,"crate",0)}},Fi={name:"barrel",category:"objects",radius:.55,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(.75,1.05),o=e.range(.3,.4),r=o*e.range(.78,.88),a=e.int(8,11),c=e.chance(.25),l=[new tt(0,0),new tt(r,0),new tt(o,s*.35),new tt(o,s*.65),new tt(r,s),new tt(0,s)];n.push({geometry:new di(l,a),color:D.TIMBER,sway:0});for(const u of[.14,.5,.86]){const f=u>.3&&u<.7?o:r+(o-r)*.45,d=new Y(f*1.04,f*1.04,.055,a);d.translate(0,s*u,0),n.push({geometry:d,color:D.IRON,sway:0})}let h=pt(n);return c&&(h.rotateX(Math.PI/2),h.rotateY(e.range(0,Math.PI*2)),h.translate(0,o,0)),t!==1&&(h=h.scale(t,t,t)),xt(h,"barrel",0)}},sd={name:"bed",category:"furniture",radius:1.3,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(.9,1.25),o=e.range(1.85,2.15),r=e.range(.26,.4),a=e.range(.07,.1),c=e.chance(.55)?D.TIMBER_DARK:D.BARK,l=e.pick([D.CLOTH,D.WOOL,D.HIDE_PALE]),h=e.pick([D.HIDE,D.LEAF_DARK,D.RUST,D.STONE_DARK]),u=e.chance(.5)?-1:1;for(const E of[-1,1]){const T=new k(a,r*.55,o);T.translate(E*(s-a)/2,r*.72,0),n.push({geometry:T,color:c,sway:0})}for(const E of[-1,1])for(const T of[-1,1]){const _=r*(T===u?1.05:.98),M=new k(a,_,a);M.translate(E*(s-a)/2,_/2,T*(o-a)/2),n.push({geometry:M,color:c,sway:0})}const f=e.range(.34,.62),d=new k(s,f,.055);if(d.translate(0,r+f/2-.04,u*o/2),n.push({geometry:d,color:c,sway:0}),e.chance(.55)){const E=f*e.range(.3,.5),T=new k(s,E,.05);T.translate(0,r+E/2-.04,-u*o/2),n.push({geometry:T,color:c,sway:0})}const g=r+e.range(.14,.2),v=6,m=(o-.1)/v;for(let E=0;E<v;E++){const T=-o/2+.05+(E+.5)*m,_=u<0?E/(v-1):1-E/(v-1),M=1-.22*Math.sin(_*Math.PI)*e.range(.4,1),A=(g-r*.72)*M,P=new k(s-a*1.4,A,m*1.04);P.translate(0,r*.72+A/2,T),n.push({geometry:P,color:l,sway:0})}const p=o*e.range(.6,.75),x=4,y=p/x,w=-u*o/2;for(let E=0;E<x;E++){const T=w+u*((E+.5)*y),_=e.range(.045,.075),M=new k(s-a*.6,_,y*1.02);M.translate(0,g+_/2-.01,T),n.push({geometry:M,color:h,sway:0})}const b=new k(s-a*.6,.05,.09);if(b.translate(0,g+.05,w+u*p),n.push({geometry:b,color:I(h,1.18),sway:0}),e.chance(.85)){const E=e.range(.26,.36),T=new k(s*e.range(.5,.72),e.range(.09,.14),E);T.translate(e.around(0,s*.1),g+.06,u*(o/2-E*.8)),T.rotateY(e.around(0,.18)),n.push({geometry:T,color:I(l,1.12),sway:0})}const S=pt(n);return t!==1&&S.scale(t,t,t),xt(S,"bed",0)}},ep=[{weight:.28,width:[.7,1],depth:[.5,.68]},{weight:.47,width:[1.2,1.7],depth:[.7,.95]},{weight:.25,width:[2.1,3],depth:[.85,1.1]}],pr={name:"table",category:"furniture",radius:1.6,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[];let s=e(),o=ep[1];for(const y of ep)if(s-=y.weight,s<=0){o=y;break}const r=e.range(o.width[0],o.width[1]),a=e.range(o.depth[0],o.depth[1]),c=e.range(.68,.78),l=e.range(.045,.07),h=r>1.5&&e.chance(.45),u=e.chance(.6)?D.TIMBER:D.TIMBER_DARK,f=u===D.TIMBER?D.TIMBER_DARK:D.TIMBER,d=e.int(3,5),g=a/d,v=.008;for(let y=0;y<d;y++){const w=new k(r,l*e.range(.93,1),g-v);w.translate(0,c-l/2,-a/2+(y+.5)*g),n.push({geometry:w,color:I(u,e.around(1,.07)),sway:0})}const m=c-l,p=c-l*.6;if(h){const y=r*e.range(.16,.24);for(const b of[-1,1]){const S=b*(r/2-y),E=new k(.09,.07,a*.86);E.translate(S,.035,0),n.push({geometry:E,color:f,sway:0});const T=e.range(.09,.13),_=new k(T,m-.07,a*.2);_.translate(S,.07+(m-.07)/2,0),n.push({geometry:_,color:f,sway:0});const M=new k(.09,.06,a*.8);M.translate(S,p-.03,0),n.push({geometry:M,color:f,sway:0})}const w=new k(r-y*1.2,.07,.07);w.translate(0,m*e.range(.32,.42),0),n.push({geometry:w,color:f,sway:0})}else{const y=e.range(.055,.085),w=r/2-y*.9,b=a/2-y*.9;for(const S of[-1,1])for(const E of[-1,1]){const T=new k(y,p,y);T.translate(S*w,p/2,E*b),n.push({geometry:T,color:f,sway:0})}if(e.chance(.7)){for(const E of[-1,1]){const T=new k(w*2,.07,.03);T.translate(0,m-.07/2-.02,E*b),n.push({geometry:T,color:f,sway:0})}for(const E of[-1,1]){const T=new k(.03,.07,b*2);T.translate(E*w,m-.07/2-.02,0),n.push({geometry:T,color:f,sway:0})}}}const x=pt(n);return t!==1&&x.scale(t,t,t),xt(x,"table",0)}},ec={name:"chair",category:"furniture",radius:.45,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(.42,.5),o=e.range(.38,.46),r=e.range(.36,.44),a=e.range(.04,.06),c=e.range(.44,.66),l=e.pick(["slats","spindles","board"]),h=e.chance(.55)?D.TIMBER:D.TIMBER_DARK,u=h===D.TIMBER?D.TIMBER_DARK:D.TIMBER,f=new k(o,a,r);f.translate(0,s-a/2,0),n.push({geometry:f,color:h,sway:0});const d=e.range(.035,.048),g=o/2-d*.7,v=r/2-d*.7,m=s-a*.4;for(const y of[-1,1]){const w=new k(d,m,d);w.translate(y*g,m/2,v),n.push({geometry:w,color:u,sway:0})}for(const y of[-1,1]){const w=new k(d,m,d);w.translate(y*g,m/2,-v),n.push({geometry:w,color:u,sway:0});const b=a*.4+.02,S=new k(d,c+b,d);S.translate(y*g,s+c/2-b/2,-v),n.push({geometry:S,color:u,sway:0})}const p=(y,w)=>{y.translate(0,s+w,-v)};if(l==="board"){const y=c*e.range(.4,.55),w=new k(o*.86,y,.03);p(w,c-y*.62),n.push({geometry:w,color:h,sway:0})}else if(l==="slats"){const y=e.int(2,3);for(let w=0;w<y;w++){const b=c*(.42+w/Math.max(y-1,1)*.5),S=new k(o*.84,e.range(.06,.1),.026);p(S,b),n.push({geometry:S,color:h,sway:0})}}else{const y=e.int(3,5),w=o*.72,b=c*.93,S=.02,E=b+S;for(let _=0;_<y;_++){const M=-w/2+_/(y-1)*w,A=new k(.026,E,.026);A.translate(M,E/2-S,0),p(A,0),n.push({geometry:A,color:u,sway:0})}const T=new k(o*.84,.055,.032);p(T,b),n.push({geometry:T,color:h,sway:0})}if(e.chance(.6)){const y=new k(g*2,.026,.026);y.translate(0,s*e.range(.28,.36),v),n.push({geometry:y,color:u,sway:0})}const x=pt(n);return t!==1&&x.scale(t,t,t),xt(x,"chair",0)}},nc={name:"stool",category:"furniture",radius:.42,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.chance(.45)?3:4,o=e.range(.42,.56),r=e.range(.16,.23),a=e.range(.04,.07),c=e.chance(.5)?D.TIMBER:D.TIMBER_DARK,l=c===D.TIMBER?D.TIMBER_DARK:D.TIMBER,h=s===3?new Y(r,r*.96,a,6):new k(r*1.9,a,r*1.9);h.translate(0,o-a/2,0),s===4&&h.rotateY(e.around(0,.2)),n.push({geometry:h,color:c,sway:0});const u=o-a,f=e.range(.14,.26),d=r*.66,g=u/Math.cos(f);for(let p=0;p<s;p++){const x=p/s*Math.PI*2+(s===4?Math.PI/4:0),y=e.range(.035,.05),w=Math.cos(x),b=Math.sin(x),S=new k(y,g,y);S.translate(0,-g/2,0),S.rotateZ(f),S.rotateY(-x),S.translate(w*d,u,b*d),n.push({geometry:S,color:l,sway:0})}const v=d+g*Math.sin(f);if(s===4&&e.chance(.45)){const p=e.range(.28,.38),x=d+(v-d)*(1-p);for(const y of[0,Math.PI/2]){const w=new k(x*2,.028,.028);w.translate(0,u*p,0),w.rotateY(y+Math.PI/4),n.push({geometry:w,color:l,sway:0})}}const m=pt(n);return t!==1&&m.scale(t,t,t),xt(m,"stool",0)}},mT=[{shape:"cone",weight:.3},{shape:"orb",weight:.2},{shape:"wedge",weight:.16},{shape:"drum",weight:.14},{shape:"block",weight:.11},{shape:"spike",weight:.09}];function gT(i){let t=i();for(const e of mT)if(t-=e.weight,t<=0)return e.shape;return"cone"}const vT={cone:.3,wedge:.3,drum:.4,block:.4,orb:.5,spike:.85};function yT(i,t,e){switch(i){case"cone":return new Qt(t*1.15,t*e.range(2.2,3.2),e.int(5,8));case"wedge":return new Qt(t*1.3,t*e.range(1.6,2.2),4);case"drum":return new Y(t*1.1,t*1.15,t*e.range(1.1,1.7),7);case"block":return new k(t*1.7,t*e.range(1.6,2.3),t*1.5);case"spike":return new Ye(t*1.3,0);case"orb":default:return new ie(t,0)}}function wT(i,t,e,n){switch(i.int(0,3)){case 0:return{geometry:new k(t*2,n,t*1.3),halfDepth:t*.65};case 1:return{geometry:new Y(e,t,n,i.int(5,7)),halfDepth:t*.85};case 2:return{geometry:new Y(t,e,n,4),halfDepth:t*.75};default:return{geometry:new Y(t,e,n,i.int(5,7)),halfDepth:t*.85}}}function np(i,t,e,n){return i?new k(t*2,n,t*2):new Y(t,e,n,5)}function Kn(i,t,e=0){return new R(t*(i.reach+.03+e),i.hold,.16)}const xT=[(i,t,e)=>{const n=i.range(.11,.16),s=Kn(t,e,n*.6),o=new Y(n*.6,n*.4,n,7);return o.translate(s.x,s.y+n/2,s.z),[{geometry:o,color:i.pick([D.WOOL,D.RUST]),sway:0}]},(i,t,e)=>{const n=i.range(.14,.2),s=Kn(t,e,n),o=new ie(n,0);o.scale(1,1.15,1),o.translate(s.x,s.y+n*.7,s.z);const r=new Y(n*.32,n*.45,n*.8,6);r.translate(s.x,s.y+n*1.8,s.z);const a=i.pick([D.RUST,D.COW_BLACK]);return[{geometry:o,color:a,sway:0},{geometry:r,color:a,sway:0}]},(i,t,e)=>{const n=i.range(.1,.15),s=Kn(t,e,n),o=new ie(n,0);return o.scale(1,i.range(.7,.95),i.range(.8,1.1)),o.rotateX(i.range(0,Math.PI)),o.rotateY(i.range(0,Math.PI)),o.translate(s.x,s.y,s.z),[{geometry:o,color:i.pick([D.STONE_DARK,D.COW_BLACK]),sway:0}]},(i,t,e)=>{const n=[],s=Kn(t,e,.04),o=i.range(.28,.45),r=new Y(.012,.016,o,4);r.translate(s.x,s.y+o/2,s.z),n.push({geometry:r,color:D.BARK,sway:.45});const a=i.int(3,6);for(let c=0;c<a;c++){const l=new ie(i.range(.055,.085),0);l.scale(1,.4,.85),l.rotateY(i.range(0,Math.PI)),l.rotateZ(i.around(0,.5)),l.translate(s.x+i.around(0,.07),s.y+o*i.range(.6,1.05),s.z+i.around(0,.06)),n.push({geometry:l,color:D.LEAF,sway:.7})}return n},(i,t,e)=>{const n=i.range(.11,.16),s=Kn(t,e,n*1.5),o=new ie(n,0);return o.scale(1.5,.75,.9),o.rotateY(i.around(0,.4)),o.translate(s.x,s.y+.03,s.z),[{geometry:o,color:i.pick([D.BARK_PALE,D.MARKER_YELLOW]),sway:0}]},(i,t,e)=>{const n=i.range(.16,.23),s=Kn(t,e,n),o=new ie(n,0);return o.scale(1,i.range(.8,1.05),.9),o.rotateX(i.range(0,Math.PI)),o.translate(s.x,s.y+.06,s.z),[{geometry:o,color:i.pick([D.WOOL,D.RUST]),sway:0}]},(i,t,e)=>{const n=i.range(.2,.28),s=Kn(t,e,n*.55),o=new k(n*.75,n,.03);return o.rotateZ(e*i.range(.15,.45)),o.translate(s.x,s.y+n*.3,s.z),[{geometry:o,color:i.pick([D.COW_BLACK,D.WOOL]),sway:0}]},(i,t,e)=>{const n=Kn(t,e,.07),s=i.range(.1,.18),o=new Y(.01,.01,s,4);o.translate(n.x,n.y+s/2,n.z);const r=new k(.12,.15,.12);r.translate(n.x,n.y-.07,n.z);const a=new Qt(.095,.06,4);return a.translate(n.x,n.y+.02,n.z),[{geometry:o,color:D.IRON,sway:0},{geometry:r,color:D.MARKER_YELLOW,sway:0},{geometry:a,color:D.IRON,sway:0}]},(i,t,e)=>{const n=i.range(.24,.36),s=Kn(t,e,n*.5),o=new Ye(n*.36,0);o.scale(1.9,.85,.5),o.rotateZ(e*.8),o.translate(s.x,s.y-n*.25,s.z);const r=new Qt(n*.16,n*.24,3);return r.scale(1,1,.4),r.rotateZ(e*.8+Math.PI),r.translate(s.x+e*n*.32,s.y-n*.25-n*.42,s.z),[{geometry:o,color:D.STONE_PALE,sway:0},{geometry:r,color:D.STONE,sway:0}]}],kl=[{name:"held",weight:.52,build:(i,t,e)=>i.pick(xT)(i,t,e)},{name:"pauldron",weight:.18,build:(i,t,e)=>{const n=new ie(i.range(.09,.14),0);return n.scale(1.15,.65,1.05),n.rotateY(i.range(0,Math.PI)),n.translate(e*(t.chest+.04),t.shoulder-.02,0),[{geometry:n,color:D.IRON,sway:0}]}},{name:"pack",weight:.19,build:(i,t,e)=>{const n=i.range(.2,.32),s=i.range(.24,.4),o=i.range(.12,.2),r=new k(n,s,o);return r.rotateY(i.around(0,.2)),r.translate(e*i.range(0,.07),t.shoulder-s*.55,-(t.depth+o*.4)),[{geometry:r,color:D.TIMBER_DARK,sway:0}]}},{name:"horn",weight:.08,build:(i,t,e)=>{const n=i.range(.14,.3),s=new Qt(i.range(.02,.035),n,4);return s.translate(0,n/2,0),s.rotateZ(e*i.range(.5,1.1)),s.rotateX(i.around(0,.3)),s.translate(e*.05,t.height*.97,0),[{geometry:s,color:D.SKIN,sway:0}]}}];function ip(i){let t=i()*kl.reduce((e,n)=>e+n.weight,0);for(const e of kl)if(t-=e.weight,t<=0)return e;return kl[0]}const Qs={name:"figure",category:"people",radius:.55,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(1.55,2.05),o=e.range(.72,1.24),r=s*e.range(.44,.58),a=s*e.range(.78,.87),c=e.pick([D.CLOTH,D.TIMBER_DARK,D.STONE_DARK]),l=e.chance(.45),h=e.chance(.5)?1:-1,u=.19*o*e.range(.8,1.25),f=.15*o*e.range(.8,1.3),{geometry:d,halfDepth:g}=wT(e,u,f,a-r);d.translate(0,(a+r)/2,0),d.rotateY(e.around(0,.25)),n.push({geometry:d,color:c,sway:0});const v=e.range(.04,.22),m=new Y(.045,.06,v,5);m.translate(0,a+v/2,0),n.push({geometry:m,color:D.SKIN,sway:0});const p=e.range(.085,.15),x=gT(e),y=yT(x,p,e);y.scale(e.range(.82,1.08),e.range(.95,1.3),e.range(.85,1.12)),y.rotateZ(e.around(0,.16)),y.rotateY(e.range(0,Math.PI)),y.computeBoundingBox();const w=p*vT[x];y.translate(0,a+v-w-(y.boundingBox?.min.y??0),0),n.push({geometry:y,color:l?c:D.SKIN,sway:0});const b=e.range(.045,.075)*o,S=e.range(.03,.055)*o,E=(a-r)*e.range(.95,1.5),T=e.chance(.25),_=e.range(-.02,.09),M=e.range(.06,.11)*o,A=e.chance(.25),P=e.range(.04,.22);for(const N of[-1,1]){const F=r,H=np(T,b,b*.8,F);H.translate(0,-F/2,0),H.rotateZ(N*_),H.translate(N*M,r,0),n.push({geometry:H,color:D.TIMBER_DARK,sway:0});const G=np(A,S,S*.82,E);G.translate(0,-E/2,0),G.rotateZ(N*P),G.translate(N*(u+S*1.4),a-.03,0),n.push({geometry:G,color:c,sway:0})}const C={height:s,shoulder:a,hip:r,chest:u,reach:u+S*2.6,hold:a-E*.82,depth:g};e.chance(.62)&&(n.push(...ip(e).build(e,C,h)),e.chance(.22)&&n.push(...ip(e).build(e,C,h)));const L=pt(n);return t!==1&&L.scale(t,t,t),xt(L,"figure",0)}},ic={name:"machine",category:"structures",radius:1.6,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(2.1,2.8),o=e.range(.9,1.3),r=e.range(.32,.46),a=e.chance(.5)?D.IRON:D.STONE_DARK,c=e.chance(.6)?D.RUST:D.IRON,l=new k(s,r,o);l.translate(0,r/2,0),n.push({geometry:l,color:D.STONE_DARK,sway:0});for(const F of[-1,1])for(const H of[-1,1]){const G=new k(.22,.08,.22);G.translate(F*(s-.3)/2,.04,H*(o-.3)/2),n.push({geometry:G,color:c,sway:0})}const h=e.chance(.4)?"twin":e.chance(.5)?"stacked":"single",u=e.range(.34,.46)*(h==="single"?1:.82),f=s*e.range(.62,.74),d=-s*.12,g=(F,H,G)=>{const V=new Y(F,F,f,10);V.rotateZ(Math.PI/2),V.translate(d,H,G),n.push({geometry:V,color:a,sway:0});for(const et of[-.28,.08,.34]){const lt=new Y(F*1.06,F*1.06,.07,10);lt.rotateZ(Math.PI/2),lt.translate(d+f*et,H,G),n.push({geometry:lt,color:c,sway:0})}};let v=r+u*2;if(h==="twin"){const F=u*1.02;g(u,r+u,-F),g(u,r+u,F)}else if(h==="stacked"){const F=u*e.range(.7,.86);g(u,r+u,0),g(F,r+u*2+F*.92,0),v=r+u*2+F*1.9;for(const H of[-.3,.3]){const G=new k(.1,F*1.1,u*1.1);G.translate(d+f*H,r+u*2,0),n.push({geometry:G,color:c,sway:0})}}else g(u,r+u,0);const m=e.range(.52,.72),p=r+m*.82,x=e.chance(.5)?4:3,y=e.chance(.3),w=s/2+e.range(.16,.26),b=y?w*2:w+s*.28,S=y?0:w-b/2,E=new Y(.075,.075,b,8);E.rotateZ(Math.PI/2),E.translate(S,p,0),n.push({geometry:E,color:I(c,1.1),sway:0});const T=y?[-s*.34,s*.34]:[s*.16,s*.4];for(const F of T){const H=new k(.26,p-r+.12,.3);H.translate(F,r+(p-r)/2,0),n.push({geometry:H,color:D.STONE_DARK,sway:0});const G=new k(.3,.1,.34);G.translate(F,p,0),n.push({geometry:G,color:c,sway:0})}for(const F of y?[w,-w]:[w]){const H=new Y(m,m,.12,12);H.rotateZ(Math.PI/2),H.translate(F,p,0),n.push({geometry:H,color:a,sway:0});const G=new Y(.15,.15,.26,8);G.rotateZ(Math.PI/2),G.translate(F,p,0),n.push({geometry:G,color:c,sway:0});for(let V=0;V<x;V++){const et=new k(.07,m*1.85,.06);et.rotateX(Math.PI/2),et.rotateX(V/x*Math.PI),et.translate(F,p,0),n.push({geometry:et,color:I(a,.86),sway:0})}}const _=new k(s*.42,.08,.08);_.translate(d+f*.45,r+u*.9,m*.42),n.push({geometry:_,color:c,sway:0});const M=e.range(1.1,1.8),A=e.range(.11,.16),P=new Y(A*.85,A,M,8);P.translate(-s*.3,v+M/2-.1,0),n.push({geometry:P,color:a,sway:0});const C=new Y(A*1.3,A*1.1,.1,8);C.translate(-s*.3,v+M-.14,0),n.push({geometry:C,color:c,sway:0});const L=e.int(1,2);for(let F=0;F<L;F++){const H=e.range(-.3,.25),G=new Y(.07,.09,e.range(.16,.26),6);G.translate(d+f*H,v,0),n.push({geometry:G,color:c,sway:0});const V=new Y(.1,.1,.035,8);V.translate(d+f*H,v+.16,0),n.push({geometry:V,color:I(c,1.2),sway:0})}const N=pt(n);return t!==1&&N.scale(t,t,t),xt(N,"machine",0)}},od={name:"sink",category:"objects",radius:.65,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(.62,.86),o=e.range(.45,.6),r=e.range(.24,.34),a=e.range(.5,.68),c=e.range(.02,.032),l=I(9410203,e.range(.9,1.08)),h=I(l,.84),u=I(D.IRON,e.range(.85,1.05)),f=a+r,d=new k(s,c,o);d.translate(0,a+c/2,0),n.push({geometry:d,color:h,sway:0});for(const L of[-1,1]){const N=new k(s*.99,r,c);N.translate(0,a+r/2,L*(o-c)/2),n.push({geometry:N,color:l,sway:0});const F=new k(c,r*.985,o*.985);F.translate(L*(s-c)/2,a+r/2,0),n.push({geometry:F,color:l,sway:0})}for(const L of[-1,1]){const N=new k(s*1.04,c*1.4,c*2.2);N.translate(0,f,L*o/2),n.push({geometry:N,color:I(l,1.14),sway:0});const F=new k(c*2.2,c*1.35,o*.96);F.translate(L*s/2,f,0),n.push({geometry:F,color:I(l,1.14),sway:0})}if(e.chance(.4)){const L=new k(s-c*2.2,.02,o-c*2.2);L.translate(0,a+c+r*e.range(.12,.3),0),n.push({geometry:L,color:D.WATER,sway:0})}const g=e.range(.018,.026),v=e.range(.06,.1);for(const L of[-1,1])for(const N of[-1,1]){const F=new Y(g*.85,g,a,6);F.translate(L*(s-v*2)/2,a/2,N*(o-v*2)/2),n.push({geometry:F,color:u,sway:0})}if(e.chance(.55)){const L=a*e.range(.2,.32);for(const N of[0,1]){const F=N===0;for(const H of[-1,1]){const G=new k(F?s-v*2:g*1.2,g*1.1,F?g*1.2:o-v*2.4);G.translate(F?0:H*(s-v*2)/2,L,F?H*(o-v*2)/2:0),n.push({geometry:G,color:I(u,.88),sway:0})}}}const m=e.range(.16,.3),p=new k(s*1.02,m,c*1.6);p.translate(0,f+m/2,-o/2-c),n.push({geometry:p,color:I(l,.94),sway:0});const x=m+e.range(.1,.2),y=e.range(.012,.018),w=-o/2-c,b=new Y(y,y*1.15,x,6);b.translate(0,f+x/2,w),n.push({geometry:b,color:I(u,1.15),sway:0});const S=e.range(.14,.22),E=new Y(y*.9,y*.9,S,6);E.rotateX(Math.PI/2),E.translate(0,f+x,w+S/2),n.push({geometry:E,color:I(u,1.15),sway:0});const T=e.range(.05,.09),_=new Y(y*.8,y*.95,T,6);_.translate(0,f+x-T/2,w+S),n.push({geometry:_,color:I(u,1.05),sway:0});const M=e.chance(.75)?2:1,A=e.range(.1,.16),P=w+y*3.4;for(let L=0;L<M;L++){const N=M===1?0:L===0?-A:A,F=e.range(.05,.085),H=new Y(y*1.25,y*1.5,F,6);H.translate(N,f+F/2,P),n.push({geometry:H,color:I(u,1.05),sway:0});const G=new Y(y*.4,y*.5,y*1.4,6);G.translate(N,f+F+y*.7,P),n.push({geometry:G,color:I(u,1.15),sway:0});const V=e.range(0,Math.PI/2);for(const et of[0,1]){const lt=new k(y*3.4,y*.75,y*.72);lt.rotateY(V+(et?Math.PI/2:0)),lt.translate(N,f+F+y*1.5,P),n.push({geometry:lt,color:I(D.RUST,1.05),sway:0})}}const C=pt(n);return t!==1&&C.scale(t,t,t),xt(C,"sink",0)}},sp=[{color:16760948,light:16758629,weight:.5},{color:16747100,light:16742984,weight:.32},{color:10475775,light:9423103,weight:.18}];function Tg(i){const t=i.range(0,1);let e=0;for(const n of sp)if(e+=n.weight,t<=e)return n;return sp[0]}const rd=1.25;function Ag(i,t,e,n,s,o){const r=new Ye(o,0);r.scale(1,2.4,1),r.translate(e,n,s),i.push({geometry:r,color:t.color,sway:0});const a=new Ye(o*4.2,0);a.scale(1,1.5,1),a.translate(e,n,s);const c=o*4.2*1.5;i.push({geometry:a,color:(l,h,u)=>{const f=Math.hypot(l-e,h-n,u-s)/c;return _T(t.color,Math.max(0,.34*(1-f)))},sway:0})}function _T(i,t){const e=Math.round((i>>16&255)*t),n=Math.round((i>>8&255)*t),s=Math.round((i&255)*t);return e<<16|n<<8|s}const MT=2.15,bT=14,sc={name:"candle",category:"objects",radius:.3,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=[],o=Tg(e),r=e.chance(.5)?14208430:12564904,a=e.chance(.35),c=e.range(.075,.11),l=I(D.IRON,e.range(.85,1.05));let h=0;if(a){const b=e.range(.16,.3),S=new Y(c*.62,c*1.05,.022,8);S.translate(0,.011,0),n.push({geometry:S,color:I(l,.86),sway:0});const E=new Y(.014,.019,b,6);if(E.translate(0,.022+b/2,0),n.push({geometry:E,color:l,sway:0}),e.chance(.6)){const T=new Y(c*.78,c*.5,.016,8);T.translate(0,.022+b*e.range(.45,.62),0),n.push({geometry:T,color:I(l,1.08),sway:0})}h=.022+b}const u=new Y(c,c*.88,.018,10);u.translate(0,h+.009,0),n.push({geometry:u,color:I(l,.94),sway:0}),h+=.018;const f=1+(e.chance(.42)?1:0)+(e.chance(.18)?1:0),d=c*.42;for(let b=0;b<f;b++){const S=b/f*Math.PI*2+e.range(0,Math.PI*2),E=f===1?0:Math.cos(S)*d,T=f===1?0:Math.sin(S)*d,_=e.range(.05,.16),M=e.range(.011,.016),A=e.range(0,.13),P=e.range(0,Math.PI*2),C=new Y(M*.92,M,_,7);C.translate(0,_/2,0),C.rotateX(Math.cos(P)*A),C.rotateZ(Math.sin(P)*A),C.translate(E,h,T);const L=h+_*.55;n.push({geometry:C,color:(G,V)=>V>L?o.color:r,sway:0});const N=E+Math.sin(Math.sin(P)*A)*_,F=T-Math.sin(Math.cos(P)*A)*_,H=h+_;Ag(s,o,N,H+M*2.2,F,M*1.35),b===0&&Fs.set(N,H+M*2.2,F)}const g=pt(n),v=pt(s),m=e.range(0,Math.PI*2);g.rotateY(m),v.rotateY(m),t!==1&&(g.scale(t,t,t),v.scale(t,t,t));const p=xt(g,"candle",0);p.add(Nn(v,"candle:glow"));const x=Math.cos(m)*Fs.x+Math.sin(m)*Fs.z,y=-Math.sin(m)*Fs.x+Math.cos(m)*Fs.z,w=new ms(o.light,MT*e.around(1,.15)*t*t,bT*t,rd);return w.position.set(x*t,Fs.y*t,y*t),w.castShadow=!1,p.add(w),p}},Fs=new R,ST=60,ET=22,ya=15922406,ci={name:"floodlight",category:"structures",radius:.6,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=[],o=e.range(1.9,2.7),r=e.range(.3,.42),a=r*e.range(.58,.72),c=r*e.range(.34,.46),l=e.range(.32,.6),h=I(D.IRON,e.range(.85,1.05)),u=I(8159880,e.range(.9,1.1)),f=e.range(.035,.05),d=new Y(f,f*1.1,o,6);d.translate(0,o/2,0),n.push({geometry:d,color:h,sway:0});const g=new Y(f*3.2,f*3.6,f*1.1,8);g.translate(0,f*.55,0),n.push({geometry:g,color:I(h,.85),sway:0});const v=new Y(f*1.5,f*1.5,f*2.6,6);v.rotateZ(Math.PI/2),v.translate(0,o,0),n.push({geometry:v,color:I(h,1.1),sway:0});const m=N=>{N.rotateX(l),N.translate(0,o,c*.6)},p=new k(r,a,c);m(p),n.push({geometry:p,color:u,sway:0});const x=new k(r*1.12,a*.16,c*1.5);x.translate(0,a*.56,c*.22),m(x),n.push({geometry:x,color:I(u,1.14),sway:0});const y=new k(r*.72,a*.62,c*.5);y.translate(0,0,-c*.68),m(y),n.push({geometry:y,color:I(u,.84),sway:0});const w=new k(r*.86,a*.7,c*.12);w.translate(0,0,c*.52),m(w),n.push({geometry:w,color:ya,sway:0});const b=e.range(5.5,8),S=e.range(.22,.34),E=r*.42,T=new Qt(E+Math.tan(S)*b,b,10,1,!0);T.rotateX(-Math.PI/2),T.translate(0,0,c*.55+b/2),m(T),s.push({geometry:T,color:(N,F,H)=>{const G=Math.hypot(N,F-o,H)/b;return TT(ya,.3*Math.max(0,1-G)**1.6)},sway:0});const _=new Ye(E*.9,0);_.scale(1,.8,.5),_.translate(0,0,c*.56),m(_),s.push({geometry:_,color:ya,sway:0});const M=pt(n),A=pt(s);t!==1&&(M.scale(t,t,t),A.scale(t,t,t));const P=xt(M,"floodlight",0);P.add(Nn(A,"floodlight:glow"));const C=new EM(ya,ST*e.around(1,.1)*t*t,ET*t,S*1.15,.55,2);C.position.set(0,o*t,0);const L=new Te;return L.position.set(0,(o-Math.sin(l)*b)*t,Math.cos(l)*b*t),P.add(L),C.target=L,C.castShadow=!1,P.add(C),P}};function TT(i,t){const e=Math.round((i>>16&255)*t),n=Math.round((i>>8&255)*t),s=Math.round((i&255)*t);return e<<16|n<<8|s}const ad={name:"pipes",category:"structures",radius:1.7,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(2.6,3.6),o=2,r=e.range(.06,.11),a=[D.RUST,4877172,7039548,D.IRON,8018492],c=I(e.pick(a),e.range(.9,1.1)),l=I(D.IRON,e.range(.85,1.05)),h=(v,m,p,x)=>{const y=new Y(x,x,m,8);y.rotateZ(Math.PI/2),y.translate(v,p,0),n.push({geometry:y,color:c,sway:0})},u=(v,m,p,x=1.45)=>{const y=new Y(p*x,p*x,p*.55,8);y.rotateZ(Math.PI/2),y.translate(v,m,0),n.push({geometry:y,color:I(l,1.05),sway:0})},f=e.int(3,5),d=[-s/2];for(let v=1;v<f;v++)d.push(-s/2+s*(v/f)*e.range(.82,1.18));d.push(s/2),d.sort((v,m)=>v-m);for(let v=0;v<d.length-1;v++){const m=d[v+1]-d[v];h((d[v]+d[v+1])/2,m+r*.5,o,r),v>0&&u(d[v],o,r)}if(u(-s/2,o,r,1.6),u(s/2,o,r,1.6),e.chance(.75)){const v=e.range(-s*.3,s*.3),m=new Y(r*1.5,r*1.5,r*1.8,6);m.rotateZ(Math.PI/2),m.translate(v,o,0),n.push({geometry:m,color:I(l,1.1),sway:0});const p=new Y(r*.28,r*.34,r*1.6,6);p.translate(v,o+r*2.2,0),n.push({geometry:p,color:l,sway:0});const x=new ps(r*1.1,r*.2,4,10);x.rotateX(Math.PI/2),x.translate(v,o+r*3,0),n.push({geometry:x,color:I(D.RUST,1.1),sway:0})}const g=pt(n);return t!==1&&g.scale(t,t,t),xt(g,"pipes",0)}},cd={name:"tank",category:"structures",radius:1.9,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(.4,1.05),o=s*e.range(2.1,4.6),r=e.range(.16,.62),a=r+s,c=e.chance(.45),l=c?I(D.RUST,e.range(.78,.95)):I(7173499,e.range(.9,1.08)),h=I(D.IRON,e.range(.85,1.05)),u=new Y(s,s,o,10);u.rotateZ(Math.PI/2),u.translate(0,a,0),n.push({geometry:u,color:c?(y,w)=>w<a?I(l,.82):l:l,sway:0});for(const y of[-1,1]){const w=new Y(s*.42,s,s*.45,10);w.rotateZ(y*Math.PI/2),w.translate(y*(o+s*.44)/2,a,0),n.push({geometry:w,color:I(l,1.06),sway:0});const b=new Y(s*.42,s*.42,s*.12,10);b.rotateZ(Math.PI/2),b.translate(y*(o+s*.88)/2,a,0),n.push({geometry:b,color:I(h,.95),sway:0})}const f=Math.max(2,Math.round(o/e.range(.7,1.2)));for(let y=1;y<f;y++){const w=-o/2+o*y/f,b=new Y(s*1.035,s*1.035,s*.1,10);b.rotateZ(Math.PI/2),b.translate(w,a,0),n.push({geometry:b,color:I(h,1.05),sway:0})}for(const y of[-1,1]){const w=y*o/2*e.range(.5,.66),b=new k(s*.5,r,s*1.8);b.translate(w,r/2,0),n.push({geometry:b,color:I(h,.82),sway:0});const S=new k(s*.42,s*.34,s*1.55);S.translate(w,r+s*.1,0),n.push({geometry:S,color:I(h,.92),sway:0});const E=new k(s*.8,s*.09,s*2);E.translate(w,s*.045,0),n.push({geometry:E,color:I(h,.74),sway:0})}const d=s*e.range(.3,.5),g=e.range(-o*.2,o*.2),v=new Y(d,d*1.1,s*.22,8);v.translate(g,a+s*.98,0),n.push({geometry:v,color:I(h,.95),sway:0});const m=new Y(d*1.2,d*1.2,s*.09,8);m.translate(g,a+s*1.12,0),n.push({geometry:m,color:I(h,1.12),sway:0});for(let y=0;y<8;y++){const w=y/8*Math.PI*2,b=new k(s*.055,s*.05,s*.055);b.translate(g+Math.cos(w)*d*1.05,a+s*1.17,Math.sin(w)*d*1.05),n.push({geometry:b,color:I(h,.8),sway:0})}const p=e.int(0,4);for(let y=0;y<p;y++){const w=-o*.35+o*.7*(y+.5)/p;if(Math.abs(w-g)<d*1.6)continue;const b=s*e.range(.1,.16),S=s*e.range(.3,.6),E=new Y(b,b,S,6);E.translate(w,a+s*.9+S/2,0),n.push({geometry:E,color:I(l,1.1),sway:0});const T=new Y(b*1.6,b*1.6,b*.5,6);T.translate(w,a+s*.9+S,0),n.push({geometry:T,color:I(h,1.05),sway:0})}const x=pt(n);return t!==1&&x.scale(t,t,t),xt(x,"tank",0)}},ld={name:"vent",category:"structures",radius:.7,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(.55,.85),o=e.range(.45,.7),r=e.range(.16,.26),a=e.range(.035,.055),c=1.7,l=I(8883859,e.range(.9,1.08)),h=e.chance(.4),u=c,f=u+o;for(const y of[-1,1]){const w=new k(a,o,r);w.translate(y*(s-a)/2,u+o/2,0),n.push({geometry:w,color:l,sway:0});const b=new k(s,a*.92,r*.98);b.translate(0,y<0?u+a*.46:f-a*.46,0),n.push({geometry:b,color:I(l,.94),sway:0})}const d=new k(s*1.14,a*.8,r*1.5);d.rotateX(-.14),d.translate(0,f+a*.4,r*.2),n.push({geometry:d,color:I(l,1.12),sway:0});const g=o-a*2.2,v=Math.max(3,Math.round(g/e.range(.055,.085))),m=g/v,p=m*.42;for(let y=0;y<v;y++){const w=u+a*1.1+m*(y+.5),b=new k(s-a*2.2,p,r*.66);b.rotateX(e.range(.5,.72)),b.translate(0,w,r*.1-y/v*r*.24),n.push({geometry:b,color:h&&e.chance(.3)?I(D.RUST,.95):I(l,1.06),sway:0})}if(s>.7){const y=new k(a*.7,g,r*.5);y.translate(0,u+o/2,-r*.06),n.push({geometry:y,color:I(l,.88),sway:0})}const x=pt(n);return t!==1&&x.scale(t,t,t),xt(x,"vent",0)}},hd={name:"railing",category:"structures",radius:1.5,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(2.2,3.2),o=e.range(1.04,1.14),r=e.range(.021,.028),a=r*e.range(1.05,1.25),c=e.chance(.55),l=I(c?12097838:9278618,e.range(.92,1.08)),h=I(D.IRON,e.range(.85,1.05)),u=Math.max(2,Math.round(s/e.range(1.1,1.5)));for(let v=0;v<=u;v++){const m=-s/2+s*v/u,p=new Y(a*.92,a,o,6);p.translate(m,o/2,0),n.push({geometry:p,color:l,sway:0});const x=new k(a*4.6,a*.7,a*4.6);x.translate(m,a*.35,0),n.push({geometry:x,color:I(h,.88),sway:0})}for(const v of[o-r,o*e.range(.48,.56)]){const m=new Y(r,r,s+a*2.4,8);m.rotateZ(Math.PI/2),m.translate(0,v,0),n.push({geometry:m,color:l,sway:0})}for(const v of[-1,1]){const m=new Y(r*1.1,r*1.1,r*1.6,8);m.rotateZ(Math.PI/2),m.translate(v*(s+a*2.4)/2,o-r,0),n.push({geometry:m,color:I(l,.9),sway:0})}const f=e.range(.1,.15),d=new k(s,f,r*.7);d.translate(0,f/2+e.range(.005,.02),a*.8),n.push({geometry:d,color:I(l,.86),sway:0});const g=pt(n);return t!==1&&g.scale(t,t,t),xt(g,"railing",0)}},ud={name:"chainlink",category:"structures",radius:1.6,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(2.4,3.2),o=e.range(1.8,2.4),r=e.range(.04,.055),a=I(9278618,e.range(.92,1.08)),c=I(10133926,e.range(.9,1.1));for(const p of[-1,1]){const x=new Y(r,r*1.06,o,6);x.translate(p*s/2,o/2,0),n.push({geometry:x,color:a,sway:0});const y=new Y(r*1.15,r*1.15,r*.5,6);y.translate(p*s/2,o+r*.2,0),n.push({geometry:y,color:I(a,.9),sway:0})}const l=[o-r*1.4];e.chance(.75)&&l.push(r*1.6);for(const p of l){const x=new Y(r*.62,r*.62,s,6);x.rotateZ(Math.PI/2),x.translate(0,p,0),n.push({geometry:x,color:I(a,1.05),sway:0})}const h=e.range(.2,.26),u=e.range(.008,.011),f=l[0],d=l.length>1?l[1]:0,g=f-d,v=s/2;for(const p of[1,-1])for(let x=-v-g;x<=v+g;x+=h){const y=Math.max(-v,Math.min(v,x)),w=Math.max(-v,Math.min(v,x+p*g));if(Math.abs(w-y)<.001)continue;const b=d+Math.abs(y-x),S=d+Math.abs(w-x),E=Math.hypot(w-y,S-b),T=new k(u,E,u);T.rotateZ(-Math.atan2(w-y,S-b)),T.translate((y+w)/2,(b+S)/2,p>0?u:-u),n.push({geometry:T,color:c,sway:0})}const m=pt(n);return t!==1&&m.scale(t,t,t),xt(m,"chainlink",0)}},AT=6.5,RT=15,CT=1.3,op=16747068,PT=16758371,ko=2236445,Rg={name:"fireplace",category:"structures",radius:1.2,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=[],o=e.range(1.35,2),r=e.range(.42,.62),a=o*e.range(.46,.58),c=e.range(.62,.85),l=e.range(.14,.22),h=e.range(.07,.1),u=c+l,f=u+h/2-e.range(.012,.03),d=e.range(2.1,2.5),g=e.range(.3,1),v=e.chance(.5)?I(e.chance(.5)?8014392:7029814,e.range(.92,1.1)):I(D.STONE,e.range(.86,1.02)),m=e.chance(.55),p=m?I(D.TIMBER_DARK,e.range(.9,1.1)):I(v,.92),x=(o-a)/2,y=.07,w=e.range(.3,.5),b=new k(o+e.range(.2,.4),y,r+w);b.translate(0,y/2,(r+w)/2),n.push({geometry:b,color:I(D.STONE_DARK,e.range(.9,1.05)),sway:0});const S=e.int(3,5);for(const K of[-1,1])for(let $=0;$<S;$++){const ot=(u-y)/S,mt=x*(1-$*.014),Mt=r*(1-$*.02),Ut=new k(mt,ot,Mt);Ut.translate(K*(a+x)/2,y+ot*($+.5),Mt/2),n.push({geometry:Ut,color:I(v,e.range(.88,1.12)),sway:0})}const E=new k(a+x*.7,l,r*1.04);E.translate(0,c+l/2,r*1.04/2),n.push({geometry:E,color:p,sway:0});const T=new k(a*1.02,c*1.02,.09);T.translate(0,y+c*1.02/2-.02,.05),n.push({geometry:T,color:ko,sway:0});for(const K of[-1,1]){const $=new k(.07,c*.98,r*.82);$.rotateY(K*.16),$.translate(K*a/2-K*.02,y+c*.98/2,r*.44),n.push({geometry:$,color:I(ko,e.range(1.1,1.5)),sway:0})}const _=new k(a*.96,.08,r*.9);_.rotateX(.22),_.translate(0,c-.05,r*.44),n.push({geometry:_,color:I(ko,1.25),sway:0});const M=r+e.range(.06,.14),A=new k(o+e.range(.1,.2),h,M);A.translate(0,f,M/2-.02),n.push({geometry:A,color:m?I(D.TIMBER,e.range(.95,1.1)):I(v,1.12),sway:0});const P=e.int(2,4);for(let K=0;K<P;K++){const $=K/P,ot=(K+1)/P,mt=(d-f)/P,Mt=o*(.9-$*.3)*e.range(.98,1.02),Ut=r*(.86-$*.24),nt=new k(Mt,mt*(1+(ot-$)*.1),Ut);nt.translate(0,f+mt*(K+.5),Ut/2),n.push({geometry:nt,color:I(v,e.range(.9,1.08)),sway:0})}const C=y+.06;for(const K of[-1,1]){const $=new k(.035,.05,r*.44);$.translate(K*a/2*e.range(.5,.62),C,r*.34),n.push({geometry:$,color:I(D.IRON,.8),sway:0});const ot=new k(.04,.16,.042);ot.translate(K*a/2*e.range(.5,.62),C+.09,r*.16),n.push({geometry:ot,color:I(D.IRON,.9),sway:0})}const L=r*.34,N=y+.15,F=e.int(3,5);for(let K=0;K<F;K++){const $=e.range(.045,.075),ot=a*e.range(.5,.78),mt=new Y($,$*e.range(.85,.98),ot,6);mt.rotateZ(Math.PI/2),mt.rotateY(e.range(-.5,.5)),mt.rotateZ(e.range(-.14,.14));const Mt=y+.09+K*e.range(.05,.08);mt.translate(e.around(0,a*.08),Mt,L+e.around(0,.05));const Ut=I(D.BARK,e.range(.85,1.15)),ht=e.chance(g*.9)&&K<F-1?9320990:ko,B=Mt+$*.15;n.push({geometry:mt,color:(ft,st)=>st<B?ht:Ut,sway:0})}const H=e.int(5,9);for(let K=0;K<H;K++){const $=e.range(.025,.05),ot=new ie($,0);ot.rotateY(e.range(0,Math.PI)),ot.translate(e.around(0,a*.3),y+$*.6,L+e.around(0,r*.16)),n.push({geometry:ot,color:e.chance(g*.5)?10239780:I(ko,e.range(.9,1.4)),sway:0})}const G=new Ye(a*.3*(.6+g*.55),0);G.scale(1,.3,.55),G.translate(0,N-.05,L),s.push({geometry:G,color:op,sway:0});const V=2+(e.chance(g)?1:0);for(let K=0;K<V;K++){const $=a*e.range(.07,.12)*(.5+g*.7),ot=new Ye($,0);ot.scale(1,e.range(2.2,3.4),1),ot.translate(e.around(0,a*.2),N+$*e.range(1.4,2.2),L+e.around(0,.04)),s.push({geometry:ot,color:PT,sway:0})}const et=a*.55,lt=new Ye(et,1);lt.scale(1,.9,.6),lt.translate(0,N+.06,L),s.push({geometry:lt,color:(K,$,ot)=>{const mt=Math.hypot(K,($-N-.06)/.9,(ot-L)/.6)/et;return IT(op,Math.max(0,.3*(.4+g*.6)*(1-mt)))},sway:0});const bt=pt(n),Dt=pt(s);t!==1&&(bt.scale(t,t,t),Dt.scale(t,t,t));const J=xt(bt,"fireplace",0);J.add(Nn(Dt,"fireplace:glow"));const rt=new ms(16750149,AT*(.4+g*.8)*e.around(1,.1)*t*t,RT*t,CT);return rt.position.set(0,(N+.06)*t,r*.62*t),rt.castShadow=!1,J.add(rt),J}};function IT(i,t){const e=t<0?0:t>1?1:t,n=Math.round((i>>16&255)*e),s=Math.round((i>>8&255)*e),o=Math.round((i&255)*e);return n<<16|s<<8|o}const DT=3.4,LT=12,zl=16748354,NT=16747068,FT=[D.IRON_DARK,2435114,14077364,3362879,7024424],Cg={name:"stove",category:"furniture",radius:.5,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=[],o=e.range(.4,.56),r=e.range(.33,.46),a=e.range(.44,.6),c=e.range(.1,.18),l=c+a/2,h=r/2,u=I(e.pick(FT),e.range(.92,1.08)),f=I(D.IRON,e.range(.82,1.02)),d=e.range(.35,1);for(const B of[-1,1])for(const ft of[-1,1]){const st=e.range(.032,.042),yt=new Y(st,st*e.range(1.15,1.4),c*1.12,5);yt.rotateZ(B*-.08),yt.rotateX(ft*.08),yt.translate(B*(o-st*3)/2,c*1.12/2,ft*(r-st*3)/2),n.push({geometry:yt,color:f,sway:0})}const g=new k(o,a,r);g.translate(0,l,0),n.push({geometry:g,color:u,sway:0});const v=new k(o*1.04,.045,r*.24);v.translate(0,c+.035,h*e.range(.9,1.02)),n.push({geometry:v,color:I(f,.9),sway:0});const m=e.range(.028,.04),p=new k(o+.055,m,r+.05);p.translate(0,c+a-m*.35,0),n.push({geometry:p,color:I(f,1.06),sway:0});const x=.022,y=c+a+m*.5,w=o+.055,b=r+.05;for(const[B,ft,st,yt]of[[w-x,x,0,-b/2+x*.8],[x,r*.86,-w/2+x*.8,0],[x,r*.82,w/2-x*.8,0]]){const wt=new k(B,.028,ft);wt.translate(st,y-.006,yt),n.push({geometry:wt,color:I(f,1.14),sway:0})}const S=o*e.range(.6,.72),E=a*e.range(.5,.62),T=l+a*e.range(.02,.1),_=new k(S,E,.016);_.translate(0,T,h+.005),n.push({geometry:_,color:Bl(zl,.45+d*.5),sway:0});const M=h+.032,A=.038;for(const B of[-1,1]){const ft=new k(S+A*2.1,A,.03);ft.translate(0,T+B*E/2,M),n.push({geometry:ft,color:f,sway:0});const st=new k(A*.92,E+A*.4,.028);st.translate(B*S/2,T,M*.999),n.push({geometry:st,color:I(f,1.08),sway:0})}const P=e.chance(.5)?-1:1;for(const B of[-.3,.3]){const ft=new k(.03,.05,.04);ft.translate(P*(S+A*2.1)/2,T+E*B,M+.006),n.push({geometry:ft,color:I(f,.86),sway:0})}const C=-P*(S+A*2.4)/2,L=new Y(.012,.012,.05,6);L.rotateX(Math.PI/2),L.translate(C,T,M+.025),n.push({geometry:L,color:I(f,1.1),sway:0});const N=new k(.026,.1,.026);N.rotateZ(e.range(-.4,.4)),N.translate(C,T,M+.056),n.push({geometry:N,color:I(f,.94),sway:0});const F=new Y(.03,.03,.018,6);F.rotateX(Math.PI/2),F.rotateZ(e.range(0,Math.PI)),F.translate(e.around(0,o*.18),T-E*.5-.055,h+.012),n.push({geometry:F,color:I(f,1.12),sway:0});const H=e.range(.055,.075),G=e.range(.05,.075),V=-r*e.range(.08,.2),et=new Y(H*1.3,H*1.45,G,8);et.translate(0,y+G*.4,V),n.push({geometry:et,color:I(f,.9),sway:0});const lt=e.chance(.45),bt=lt?e.range(1.5,1.95):e.range(2.35,2.7),Dt=y+G*.5,J=new Y(H,H*1.03,bt-Dt,8);J.translate(0,(bt+Dt)/2,V),n.push({geometry:J,color:I(f,.96),sway:0});const rt=new Y(H*1.22,H*1.22,H*.5,8);if(rt.translate(0,Dt+(bt-Dt)*e.range(.4,.6),V),n.push({geometry:rt,color:I(f,1.1),sway:0}),lt){const B=e.range(.45,.7),ft=new Y(H*.98,H*.98,B,8);ft.rotateX(Math.PI/2),ft.translate(0,bt-H*.9,V-B/2+H*.4),n.push({geometry:ft,color:I(f,.92),sway:0});const st=new Y(H*1.18,H*1.18,H*.55,8);st.rotateX(Math.PI/2),st.translate(0,bt-H*.9,V-B+H*.6),n.push({geometry:st,color:I(f,1.08),sway:0})}if(e.chance(.6)){const B=new k(o+e.range(.16,.3),.014,r+e.range(.24,.42));B.translate(0,.007,e.range(.04,.12)),n.push({geometry:B,color:I(D.IRON_DARK,e.range(.9,1.15)),sway:0})}const K=h+.022,$=new k(S*.78,E*.6,.02);$.translate(0,T-E*.1,K),s.push({geometry:$,color:Bl(zl,.55+d*.45),sway:0});const ot=Math.max(S,E)*.85,mt=new Ye(ot,1);mt.scale(1,.85,.55),mt.translate(0,T-E*.08,K+.03),s.push({geometry:mt,color:(B,ft,st)=>{const yt=Math.hypot(B,(ft-T+E*.08)/.85,(st-K-.03)/.55)/ot;return Bl(zl,Math.max(0,.26*(.4+d*.6)*(1-yt)))},sway:0});const Mt=pt(n),Ut=pt(s);t!==1&&(Mt.scale(t,t,t),Ut.scale(t,t,t));const nt=xt(Mt,"stove",0);nt.add(Nn(Ut,"stove:glow"));const ht=new ms(NT,DT*(.45+d*.75)*e.around(1,.12)*t*t,LT*t,rd);return ht.position.set(0,T*t,(h+.06)*t),ht.castShadow=!1,nt.add(ht),nt}};function Bl(i,t){const e=t<0?0:t>1?1:t,n=Math.round((i>>16&255)*e),s=Math.round((i>>8&255)*e),o=Math.round((i&255)*e);return n<<16|s<<8|o}const UT=.1,OT=1.45,rp=1.3,ap=9,kT=4.5,zT=16,BT=1.5;function HT(i,t,e){const n=i.userData.window;if(!n)return;const s=uu(t,-rp,rp),o=uu(e,UT,OT);n.azimuth=s,n.elevation=o;const r=Math.cos(o),a=Math.sin(s)*r,c=-Math.sin(o),l=Math.cos(s)*r,h=n.centreY/Math.sin(o),u=Math.min(h,ap),f=i.getObjectByName("window:shaft");f&&(f.matrixAutoUpdate=!1,f.matrix.set(1,0,a*u,0,0,1,c*u,0,0,0,l*u,0,0,0,0,1),f.matrixWorldNeedsUpdate=!0);const d=i.getObjectByName("window:pool");if(d){const g=n.height/Math.sin(o);d.matrixAutoUpdate=!1,d.matrix.set(n.width,0,g*a,h*a,0,1,0,0,0,0,g*l,h*l,0,0,0,1),d.matrixWorldNeedsUpdate=!0,d.visible=h<=ap}}const to={name:"window",category:"structures",radius:1,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=[],o=e.chance(.6),r=o&&e.chance(.35),a=e.range(.66,1.1),c=e.range(.8,1.3),l=e.range(.85,1.15),h=l+c/2,u=e.range(.09,.14),f=e.range(.1,.16),d=e.chance(.72),g=d?16773586:14477558,v=d?16769966:12505832,m=I(e.chance(.55)?D.TIMBER:D.TIMBER_DARK,e.range(.9,1.08)),p=I(D.STONE_DARK,e.range(.9,1.1)),x=new k(a+.024,c+.024,.018);x.translate(0,h,.011),n.push({geometry:x,color:g,sway:0});const y=c+u*2.4;for(const K of[-1,1]){const $=new k(u,y,f);$.translate(K*(a+u)/2,h,f/2),n.push({geometry:$,color:m,sway:0})}const w=new k(a+u*2+.1,u*.92,f*1.06);w.translate(0,l+c+u*.46,f*.5),n.push({geometry:w,color:I(m,.92),sway:0});const b=new k(a+u*2+.17,.068,f*1.9);if(b.rotateX(-.07),b.translate(0,l-.028,f*.6),n.push({geometry:b,color:p,sway:0}),e.chance(.5))for(const K of[-1,1]){const $=new k(.07,.13,f*1.25);$.translate(K*a/2,l-.1,f*.62),n.push({geometry:$,color:I(p,.88),sway:0})}const S=.028,E=f*.82;for(const K of[-1,1]){const $=new k(a+S*1.4,S,S*1.1);$.translate(0,h+K*c/2,E),n.push({geometry:$,color:I(m,1.08),sway:0});const ot=new k(S*.9,c-S*1.6,S);ot.translate(K*a/2,h,E*.97),n.push({geometry:ot,color:I(m,1.12),sway:0})}const T=e.int(2,3),_=e.int(2,3),M=f*.62;for(let K=1;K<T;K++){const $=new k(.026,c,.03);$.translate(-a/2+a*K/T,h,M),n.push({geometry:$,color:I(m,1.02),sway:0})}for(let K=1;K<_;K++){const $=new k(a,.023,.027);$.translate(0,l+c*K/_,M*1.02),n.push({geometry:$,color:I(m,.96),sway:0})}if(o){const K=e.chance(.5)?I(D.CLOTH,e.range(.85,1.05)):I(D.WOOL,e.range(.85,1.05)),$=l+c+e.range(.04,.09),ot=e.range(.05,.08),mt=c*e.range(.94,1.06),Mt=new Y(.016,.016,a+u*2.2,6);Mt.rotateZ(Math.PI/2),Mt.translate(0,$,ot),n.push({geometry:Mt,color:I(D.TIMBER_DARK,.95),sway:0});for(const Ut of[-1,1]){const nt=r?a*e.range(.52,.56):a*e.range(.2,.3),ht=r?e.range(.022,.032):e.range(.05,.08),B=r?Ut*(a/2-nt/2):Ut*(a/2-nt*e.range(.3,.45)),ft=new k(nt,mt,ht);ft.translate(B,$-mt/2-.01,ot+ht*.5),n.push({geometry:ft,color:K,sway:0});const st=new k(nt*1.02,.05,ht*1.15);if(st.translate(B,$,ot+ht*.5),n.push({geometry:st,color:I(K,.88),sway:0}),!r){const yt=new k(nt*1.15,.05,ht*1.2);yt.translate(B,$-mt*e.range(.45,.6),ot+ht*.5),n.push({geometry:yt,color:I(K,.78),sway:0})}}}const A=r?.07:1,P=r?.3:1,C=new k(a*.97,c*.97,.012);C.translate(0,h,.026),s.push({geometry:C,color:wa(g,P),sway:0});const L=new Ye(1,1);L.scale(a*.85,c*.8,.3),L.translate(0,h,.05);const N=Math.max(a,c)*.85;s.push({geometry:L,color:(K,$)=>{const ot=Math.hypot(K/N,($-h)/N);return wa(g,Math.max(0,.3*P*(1-ot)))},sway:0});const F=a*.94,H=c*.94,G=pt([{geometry:(()=>{const K=new k(F,H,1,1,1,12);return K.translate(0,h,.5),K})(),color:(K,$,ot)=>wa(g,.22*Math.max(0,1-ot)**1.35),sway:0}]),V=.014,et=pt([{geometry:(()=>{const K=new k(1,.012,1,4,1,4);return K.translate(0,V,0),K})(),color:(K,$,ot)=>{const mt=Math.max(Math.abs(K),Math.abs(ot))*2;return wa(g,.62*(1-GT(.6,1.02,mt)))},sway:0}]),lt=pt(n),bt=pt(s);t!==1&&(lt.scale(t,t,t),bt.scale(t,t,t),G.scale(t,t,1),et.scale(1,t,1));const Dt=xt(lt,"window",0);Dt.add(Nn(bt,"window:glow"));const J={width:F*t,height:H*t,centreY:h*t,openness:A,azimuth:0,elevation:.6};if(Dt.userData.window=J,r)G.dispose(),et.dispose();else{const K=Nn(G,"window:shaft");K.matrixAutoUpdate=!1,Dt.add(K);const $=Nn(et,"window:pool");$.matrixAutoUpdate=!1,Dt.add($)}const rt=new ms(v,kT*A*e.around(1,.1)*t*t,zT*t,BT);return rt.name="window:sun",rt.position.set(0,h*t,f*t+.25),rt.castShadow=!1,Dt.add(rt),HT(Dt,e.range(-.7,.7),e.range(.38,.95)),Dt}};function uu(i,t,e){return i<t?t:i>e?e:i}function GT(i,t,e){const n=uu((e-i)/Math.max(t-i,1e-6),0,1);return n*n*(3-2*n)}function wa(i,t){const e=t<0?0:t>1?1:t,n=Math.round((i>>16&255)*e),s=Math.round((i>>8&255)*e),o=Math.round((i&255)*e);return n<<16|s<<8|o}const Sc={name:"dresser",category:"furniture",radius:.7,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(.92,1.24),o=e.range(.44,.56),r=e.range(.86,1.14),a=e.chance(.55)?D.TIMBER:D.TIMBER_DARK,c=a===D.TIMBER?D.TIMBER_DARK:D.TIMBER_PALE,l=e.chance(.45)?D.IRON:I(c,1.15),h=e.range(.07,.11),u=e.range(.03,.045),f=new k(s*.96,h,o*.94);f.translate(0,h/2,o/2),n.push({geometry:f,color:I(c,.86),sway:0});const d=r-h-u,g=new k(s,d+.03,o);g.translate(0,h+d/2,o/2),n.push({geometry:g,color:I(a,e.range(.95,1.05)),sway:0});const v=e.range(.015,.03),m=new k(s+v*2,u+.02,o+v);m.translate(0,r-u/2,o/2+v/2),n.push({geometry:m,color:I(c,e.range(.95,1.08)),sway:0});const p=e.int(4,6),x=o+e.range(.012,.02),y=e.range(.02,.035),w=.012,b=e.range(1.1,1.45),S=[];for(let A=0;A<p;A++)S.push(b**A);const E=S.reduce((A,P)=>A+P,0),T=d-w*(p+1);let _=h+w;for(let A=p-1;A>=0;A--){const P=T*S[A]/E,C=new k(s-y*2,P,.026);C.translate(0,_+P/2,x),n.push({geometry:C,color:I(a,e.range(.9,1.12)),sway:0});const N=s>1.05&&P<d*.26?[-s*.22,s*.22]:[0];for(const F of N){const H=new Y(e.range(.017,.024),e.range(.013,.018),e.range(.03,.045),6);H.rotateX(Math.PI/2),H.translate(F,_+P/2,x+.02),n.push({geometry:H,color:I(l,e.range(.92,1.1)),sway:0})}_+=P+w}const M=pt(n);return t!==1&&M.scale(t,t,t),xt(M,"dresser",0)}},Ec={name:"chest",category:"furniture",radius:.6,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(.82,1.08),o=e.range(.44,.56),r=e.range(.04,.075),a=e.range(.3,.4),c=e.range(.055,.075),l=e.chance(.45),h=e.chance(.5)?D.TIMBER_DARK:D.BARK_PALE,u=I(D.IRON,e.range(.82,1)),d=e.chance(.35)?D.RUST:u;e();const g=r,v=g+a;if(e.chance(.35))for(const N of[-1,1]){const F=new k(s*e.range(.92,.97),r+.015,o*.16);F.translate(0,(r+.015)/2,N*(o-o*.16)/2),n.push({geometry:F,color:I(h,.85),sway:0})}else for(const N of[-1,1])for(const F of[-1,1]){const H=e.range(.075,.1),G=new k(H,r+.015,H*e.range(.9,1.1));G.translate(N*(s-H)/2,(r+.015)/2,F*(o-H)/2),n.push({geometry:G,color:I(h,.85),sway:0})}const p=new k(s,a,o);p.translate(0,g+a/2,0),n.push({geometry:p,color:h,sway:0});const x=e.range(.05,.07);for(const N of[-1,1]){const F=new k(x*e.range(.95,1.05),a*1.02,o*1.03);F.translate(N*(s-x*.5)/2,g+a/2,0),n.push({geometry:F,color:I(h,.8),sway:0})}const y=e.int(2,3),w=s*e.range(.5,.66),b=[];for(let N=0;N<y;N++){const F=y===1?0:-w/2+N/(y-1)*w;b.push(F);for(const H of[-1,1]){const G=new k(e.range(.035,.055),a*e.range(.96,1.02),.014);G.translate(F,g+a/2,H*(o+.012)/2),n.push({geometry:G,color:d,sway:0})}}if(e.chance(.5)){const N=new k(s*1.02,e.range(.026,.038),o*1.02);N.translate(0,v-.035,0),n.push({geometry:N,color:I(d,.9),sway:0})}const S=e.range(.07,.1),E=new k(S,S*e.range(1,1.35),.016);E.translate(0,v-S*.75,o/2+.006),n.push({geometry:E,color:I(d,1.15),sway:0});const T=new k(.012,.022,.008);T.translate(0,v-S*.75,o/2+.016),n.push({geometry:T,color:D.IRON_DARK,sway:0});const _=v-.012,M=-o/2+.025,A=o-.025+.02,P=(N,F)=>{N.rotateX(-0),N.translate(0,_,M),n.push({geometry:N,color:F,sway:0})};if(l)for(let F=0;F<3;F++){const H=F/2,G=new k(s*(1.03-H*.22)*e.range(.99,1.01),c*.62,(A+.03)*(1-H*.26));G.translate(0,H*c*.52+c*.2,A/2-.005),P(G,I(h,1.05+F*.04))}else{const N=new k(s*1.03,c,A+.03);N.translate(0,c/2,A/2-.005),P(N,I(h,1.06))}for(const N of b){const F=new k(e.range(.035,.055),c*(l?1.5:1.05),A*e.range(.86,.96));F.translate(N,c*(l?.75:.5),A*.48),P(F,d)}const C=new k(S*.55,S*1.15,.014);C.translate(0,c*.35-S*.4,A+.012),P(C,I(d,1.2));for(const N of[-s*.3,s*.3]){const F=new Y(.014,.014,e.range(.05,.07),6);F.rotateZ(Math.PI/2),F.translate(N,_,M-.006),n.push({geometry:F,color:I(d,.92),sway:0})}const L=pt(n);return t!==1&&L.scale(t,t,t),xt(L,"chest",0)}},dd={name:"washtub",category:"objects",radius:.5,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(.34,.46),o=e.range(.26,.36),r=s*e.range(.72,.82),a=e.range(.028,.04),c=e.range(.04,.06),l=e.int(10,14),h=e.chance(.5)?D.TIMBER:D.TIMBER_DARK,u=I(D.IRON,e.range(.85,1.05)),f=[new tt(0,0),new tt(r,.006),new tt(s,o),new tt(s-a*.8,o),new tt(r-a,c),new tt(0,c)];n.push({geometry:new di(f,l),color:h,sway:0});const d=p=>r+(s-r)*p;for(const p of[e.range(.16,.26),e.range(.72,.84)]){const x=e.range(.03,.045),y=d(p-x/(2*o))*1.03,w=d(p+x/(2*o))*1.03,b=new Y(w,y,x,l);b.translate(0,o*p,0),n.push({geometry:b,color:u,sway:0})}const g=e.chance(.7),v=o*e.range(.35,.6);if(g){const p=d(v/o)-a,x=new Y(p,p*.96,.02,l);x.translate(0,v,0),n.push({geometry:x,color:D.WATER,sway:0})}const m=pt(n);return t!==1&&m.scale(t,t,t),xt(m,"washtub",0)}};function Bt(i,t,e,n=e,s=4){Hl.copy(t).sub(i);const o=Hl.length();if(o<1e-6)return new Y(e,e,1e-4,s);const r=new Y(n,e,o,s);return r.translate(0,o/2,0),r.applyQuaternion(WT.setFromUnitVectors(VT,Hl.divideScalar(o))),r.translate(i.x,i.y,i.z),r}const VT=new R(0,1,0),Hl=new R,WT=new ui,Pg={name:"broom",category:"objects",radius:.4,solid:!1,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(1.15,1.45),o=0,r=0,a=I(e.chance(.5)?D.BARK_PALE:D.TIMBER,e.range(.9,1.1)),c=e.pick([D.LEAF_DRY,D.GRASS_DRY,D.BARK]),l=e.chance(.6)?D.CLOTH:D.IRON,h=new R(Math.sin(o)*Math.cos(r),Math.cos(o),Math.sin(o)*Math.sin(r)),u=E=>h.clone().multiplyScalar(E),f=new R().crossVectors(h,new R(0,0,1)).normalize(),d=new R().crossVectors(h,f).normalize(),g=(E,T)=>f.clone().multiplyScalar(Math.cos(E)*T).add(d.clone().multiplyScalar(Math.sin(E)*T)),v=e.range(.26,.38),m=e.range(.07,.13),p=-1,x=v+.03,y=v*.35,w=s;n.push({geometry:Bt(u(y),u(w),e.range(.014,.019),e.range(.011,.015),6),color:a,sway:0});const b=e.int(24,34);for(let E=0;E<b;E++){const T=u(x+p*e.range(0,v*.35)),_=Math.PI*2/b,M=E*_+e.range(0,_*.6),A=e.range(.72,1.05),P=u(x+p*v*A).add(g(M,m*e.range(.35,1)*A));P.y=Math.max(P.y,e.range(.004,.018)),n.push({geometry:Bt(T.add(g(M,e.range(.006,.011))),P,e.range(.009,.014),.005,4),color:I(c,e.range(.82,1.18)),sway:0})}for(const E of[e.range(.02,.08),e.range(.18,.3)]){const T=x+p*v*E,_=e.range(.015,.024);n.push({geometry:Bt(u(T-_),u(T+_),e.range(.028,.036),e.range(.028,.036),8),color:I(l,e.range(.9,1.1)),sway:0})}for(const E of n)E.geometry.translate(0,.02,0);const S=pt(n);return t!==1&&S.scale(t,t,t),xt(S,"broom",0)}},fd={name:"hanging-herbs",category:"objects",radius:.7,solid:!1,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(1.68,1.9),o=e.range(.8,1.35),r=e.range(.08,.12),a=I(D.BARK_PALE,e.range(.9,1.1)),c=new R(-o/2,s,r),l=new R(o/2,s,r);n.push({geometry:Bt(c,l,e.range(.016,.022),e.range(.016,.022),6),color:a,sway:0});for(const g of[c,l]){const v=new R(g.x,s+e.range(.05,.09),.012);n.push({geometry:Bt(v,g.clone(),e.range(.014,.019),.012,5),color:I(a,.88),sway:0});const m=new k(.05,e.range(.06,.09),.024);m.translate(g.x,v.y,.012),n.push({geometry:m,color:I(a,.8),sway:0})}const h=(g,v)=>(m,p)=>{const x=Math.max(0,Math.min(1,(s-p)/Math.max(g,1e-6)));return x*x*(3-2*x)*v},u=e.int(2,4),f=o*.82;for(let g=0;g<u;g++){const v=-f/2+(g+.5)/u*f+e.around(0,f/(u*3)),m=s+e.around(0,.006),p=r+e.around(0,.004);if(e.chance(.68)){const x=e.range(.24,.42),y=e.range(.05,.1),w=e.pick([D.LEAF_DRY,D.LEAF_DARK,D.GRASS_DRY,D.LEAF]),b=new Y(.026,.021,e.range(.03,.045),5);b.translate(v,m,p),n.push({geometry:b,color:D.CLOTH,sway:h(x,.06)});const S=e.int(3,5);for(let E=0;E<S;E++){const T=E/S*Math.PI*2+e.range(0,.6),_=e.range(.72,1),M=new R(v+Math.cos(T)*.008,m-.01,p+Math.sin(T)*.008),A=new R(v+Math.cos(T)*y*_,m-x*_,p+Math.sin(T)*y*_);n.push({geometry:Bt(M,A,e.range(.006,.009),.004,4),color:I(w,e.range(.8,1.05)),sway:h(x,e.range(.2,.32))});const P=e.int(1,2);for(let C=0;C<P;C++){const L=e.range(.45,.95),N=new k(e.range(.03,.055),e.range(.05,.1),e.range(.022,.04));N.rotateY(T),N.translate(M.x+(A.x-M.x)*L,M.y+(A.y-M.y)*L,M.z+(A.z-M.z)*L),n.push({geometry:N,color:I(w,e.range(.75,1.15)),sway:h(x,e.range(.24,.36))})}}}else{const x=e.int(4,7),y=e.range(.055,.08),w=y*x+.06,b=e.pick([D.MARKER_YELLOW,D.HIDE_PALE,D.WOOL,D.RUST]);n.push({geometry:Bt(new R(v,m+.03,p),new R(v+e.around(0,.02),m-w,p+e.around(0,.02)),.008,.006,4),color:D.CLOTH,sway:h(w,.28)});for(let S=0;S<x;S++){const E=m-.05-S*y,T=(S%2*2-1)*e.range(.012,.03),_=new ie(e.range(.028,.042),0);_.scale(1,e.range(.8,1.05),1),_.translate(v+T,E,p+e.around(0,.012)),n.push({geometry:_,color:I(b,e.range(.85,1.12)),sway:h(w,e.range(.15,.26))})}}}const d=pt(n);return t!==1&&d.scale(t,t,t),xt(d,"hanging-herbs",0)}},pd={name:"spinning-wheel",category:"furniture",radius:.5,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(.62,.78),o=e.range(.13,.17),r=e.range(.038,.05),a=e.range(.05,.12),c=e.range(.42,.48),l=ot=>c-ot*Math.tan(a),h=e.chance(.5)?D.TIMBER:D.TIMBER_DARK,u=h===D.TIMBER?D.TIMBER_DARK:D.TIMBER_PALE,f=I(D.IRON,e.range(.85,1.05)),d=new k(s/Math.cos(a),r,o);d.rotateZ(-a),d.translate(0,c-r*Math.cos(a)/2,0),n.push({geometry:d,color:h,sway:0});const g=[[s*.32,o*.38,.34,.94],[s*.32,-o*.38,.34,-.94],[-s*.36,e.around(0,.015),-1,0]];for(const[ot,mt,Mt,Ut]of g){const nt=e.range(.05,.09),ht=new R(ot,l(ot)-.018,mt),B=new R(ot+Mt*nt,0,mt+Ut*nt);n.push({geometry:Bt(B,ht,e.range(.015,.019),e.range(.012,.016),5),color:u,sway:0})}const v=e.range(.2,.28),m=s*e.range(.28,.34),p=v*e.range(1.04,1.14),x=e.range(.05,.065),y=new R(m,l(m)+p,0);for(const ot of[-1,1]){const mt=ot*x;n.push({geometry:Bt(new R(m+e.around(0,.006),l(m)-.02,mt),new R(y.x,y.y,mt),e.range(.02,.026),e.range(.012,.016),5),color:u,sway:0})}const w=new Y(.011,.011,x*2+.04,5);w.rotateX(Math.PI/2),w.translate(y.x,y.y,y.z),n.push({geometry:w,color:f,sway:0});const b=e.range(.028,.036),S=new Y(b,b,e.range(.05,.07),6);S.rotateX(Math.PI/2),S.translate(y.x,y.y,y.z),n.push({geometry:S,color:u,sway:0});const E=new ps(v,e.range(.013,.019),4,14);E.translate(y.x,y.y,y.z),n.push({geometry:E,color:h,sway:0});const T=e.int(6,10),_=e.range(0,Math.PI*2);for(let ot=0;ot<T;ot++){const mt=_+ot/T*Math.PI*2,Mt=Math.cos(mt),Ut=Math.sin(mt);n.push({geometry:Bt(new R(y.x+Mt*b*.9,y.y+Ut*b*.9,0),new R(y.x+Mt*(v-.005),y.y+Ut*(v-.005),0),e.range(.007,.009),e.range(.005,.007),4),color:u,sway:0})}const M=s*e.range(.06,.16),A=e.around(0,.025),P=e.range(.2,.28),C=new k(P,.02,e.range(.09,.13));C.rotateZ(e.around(0,.07)),C.translate(M,e.range(.03,.045),A),n.push({geometry:C,color:h,sway:0});const L=new k(.03,.035,o*1.1);L.translate(M-P/2,.02,A),n.push({geometry:L,color:I(h,.85),sway:0});const N=e.range(0,Math.PI*2),F=e.range(.028,.042);n.push({geometry:Bt(new R(M+P*.36,.05,A+.02),new R(y.x+Math.cos(N)*F,y.y+Math.sin(N)*F,x+.02),.008,.007,4),color:u,sway:0});const H=-s*e.range(.26,.34),G=l(H),V=new k(e.range(.09,.12),.05,e.range(.06,.08));V.translate(H,G+.015,0),n.push({geometry:V,color:I(h,1.06),sway:0});const et=e.range(.11,.15),lt=G+.03+et,bt=e.range(.06,.085);for(const ot of[-1,1]){const mt=new R(H+ot*bt,G+.01,0);n.push({geometry:Bt(mt,new R(mt.x,lt,0),e.range(.015,.019),e.range(.009,.012),5),color:u,sway:0})}n.push({geometry:Bt(new R(H-bt,lt,0),new R(H+bt+.05,lt+.004,0),.007,.006,4),color:f,sway:0});const Dt=new Y(e.range(.02,.028),e.range(.02,.028),.07,7);Dt.rotateZ(Math.PI/2),Dt.translate(H,lt,0),n.push({geometry:Dt,color:I(e.pick([D.WOOL,D.CLOTH,D.HIDE_PALE]),e.range(.95,1.1)),sway:0});const J=H+bt+.03,rt=e.range(.026,.034),K=new Y(rt,rt,.013,8);K.rotateZ(Math.PI/2),K.translate(J,lt,0),n.push({geometry:K,color:u,sway:0});for(const ot of[-1,1])n.push({geometry:Bt(new R(y.x,y.y+ot*v,0),new R(J,lt+ot*rt,0),.005,.004,4),color:I(D.CLOTH,.85),sway:0});if(e.chance(.55)){const ot=H-e.range(.08,.13),mt=new R(ot,l(ot)-.01,e.around(0,.02)),Mt=new R(ot-e.range(.03,.09),l(ot)+e.range(.42,.56),mt.z+e.around(0,.05));n.push({geometry:Bt(mt,Mt,e.range(.016,.021),e.range(.009,.013),5),color:u,sway:0});const Ut=e.pick([D.WOOL,D.LEAF_DRY,D.CLOTH]),nt=new Y(.026,.022,.03,6);nt.translate(Mt.x,Mt.y-.01,Mt.z),n.push({geometry:nt,color:D.CLOTH,sway:0});const ht=e.int(4,6);for(let B=0;B<ht;B++){const ft=B/ht*Math.PI*2+e.range(0,.5),st=e.range(.03,.07);n.push({geometry:Bt(new R(Mt.x+Math.cos(ft)*.01,Mt.y-.02,Mt.z+Math.sin(ft)*.01),new R(Mt.x+Math.cos(ft)*st,Mt.y+e.range(.05,.12),Mt.z+Math.sin(ft)*st),e.range(.008,.013),e.range(.004,.007),4),color:I(Ut,e.range(.88,1.12)),sway:0})}}const $=pt(n);return t!==1&&$.scale(t,t,t),xt($,"spinning-wheel",0)}},cp=["coat","coat","hat","bag","rope"],XT=new R(0,1,0),qT=new ui,Ig={name:"wall-pegs",category:"furniture",radius:.65,solid:!1,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(1.5,1.76),o=e.range(.7,1.3),r=e.chance(.5)?D.TIMBER_DARK:D.BARK_PALE,a=new k(o,e.range(.08,.11),.028);a.translate(0,s,.014),n.push({geometry:a,color:r,sway:0});for(const m of[-1,1]){const p=new k(e.range(.05,.07),.14,.02);p.translate(m*o*.86/2,s,.008),n.push({geometry:p,color:I(r,.82),sway:0})}const c=e.int(3,6),l=o*.78,h=Array.from({length:c},(m,p)=>c===1?0:-l/2+p/(c-1)*l),u=e.int(0,c-1),f={coat:.22,hat:.19,rope:.17,bag:.14},d=new Array(c).fill(null),g=(m,p)=>{for(let x=0;x<c;x++){const y=d[x];if(y&&Math.abs(h[m]-h[x])<f[p]+f[y]+.03)return}d[m]=p};g(u,e.pick(cp));for(let m=0;m<c;m++)m===u||!e.chance(.62)||g(m,e.pick(cp));for(let m=0;m<c;m++){const p=h[m],x=new R(p,s-e.range(0,.012),.02),y=new R(p,s+e.range(.02,.04),e.range(.09,.13)),w=e.range(.013,.017),b=e.range(.017,.022);n.push({geometry:Bt(x,y,w,b,6),color:I(r,e.range(.95,1.15)),sway:0});const S=d[m];if(!S)continue;const E=y.z*.72;if(S==="coat"){const T=e.pick([D.CLOTH,D.WOOL,D.LEAF_DARK,D.HIDE,D.STONE_DARK]),_=e.range(.45,.8),M=e.range(.24,.34),A=e.int(3,5),P=(L,N)=>{const F=Math.max(0,Math.min(1,(s-N)/_));return F*F*(3-2*F)*.12};for(let L=0;L<A;L++){const N=L/(A-1),F=s-.02-N*_*.92,H=_*1.06/A,G=new k(M*(1-N*e.range(.18,.34)),H,e.range(.07,.12)*(1-N*.3));G.rotateY(e.around(0,.22)),G.rotateZ(e.around(0,.09)),G.translate(p+e.around(0,.02),F-H/2,E+e.around(0,.012)),n.push({geometry:G,color:I(T,e.range(.88,1.1)),sway:P})}const C=new k(M*.42,.06,.09);C.rotateY(e.around(0,.2)),C.translate(p,s+.005,E),n.push({geometry:C,color:I(T,1.14),sway:0})}else if(S==="hat"){const T=I(e.pick([D.HIDE_DARK,D.CLOTH,D.EARTH]),e.range(.9,1.1)),_=e.range(.13,.18),M=e.range(.1,.15),A=.011,P=e.range(.014,.02),C=_*.66,L=[new tt(C-A,0),new tt(_,0),new tt(_*.985,P),new tt(C,P),new tt(C*.95,M*.62),new tt(C*.7,M*.93),new tt(.006,M),new tt(.005,M-A*.8),new tt(C*.7-A*.8,M*.93-A*.5),new tt(C*.95-A,M*.62),new tt(C-A,P),new tt(C-A,0)],N=e.range(.06,.14),F=new R(0,-Math.sin(N),Math.cos(N)),H=_*Math.sin(N)+.014,G=Math.min(y.z-H,M*.45),V=(H-x.z)/(y.z-x.z),et=w+(b-w)*V,lt=G*((y.y-x.y)/(y.z-x.z)+Math.tan(N)),bt=(C-A)*(1-.35*(G/M)**2),Dt=Math.max(0,bt-et-lt-.004),J=new R(p,x.y+(y.y-x.y)*V-Dt,H),rt=new di(L,8);rt.applyQuaternion(qT.setFromUnitVectors(XT,F)),rt.translate(J.x,J.y,J.z),n.push({geometry:rt,color:T,sway:0});const K=J.clone().addScaledVector(F,M-A*.4),$=new yr(.015,6,4);$.translate(K.x,K.y,K.z),n.push({geometry:$,color:I(T,.86),sway:0})}else if(S==="bag"){const T=I(e.pick([D.HIDE,D.HIDE_DARK,D.TIMBER_DARK]),e.range(.9,1.1)),_=e.range(.17,.24),M=e.range(.18,.26),A=s-e.range(.14,.24),P=x.clone().lerp(y,.55),C=.009,L=w+(b-w)*.55+C,N=new R(p,P.y-.05,P.z+.028);for(const V of[-1,1])n.push({geometry:Bt(new R(p+V*_*.34,A-.02,E+.012),N.clone().add(new R(V*.006,V*.003,0)),C,C*.85,4),color:I(T,V>0?1.04:.96),sway:0});const F=new R(p,P.y+L,P.z+.004);n.push({geometry:Bt(N,F,C,C*.9,4),color:I(T,1.08),sway:0}),n.push({geometry:Bt(N.clone().lerp(F,.82),new R(p,P.y-.03,Math.max(P.z-.042,.012)),C*.78,C*.7,4),color:I(T,.92),sway:0});const H=new k(_,M,e.range(.07,.1));H.rotateY(e.around(0,.16)),H.translate(p,A-M/2+.02,E+.012),n.push({geometry:H,color:T,sway:0});const G=new k(_*1.04,M*.4,.02);G.translate(p,A-M*.2+.02,E+.012+e.range(.04,.055)),n.push({geometry:G,color:I(T,1.15),sway:0})}else{const T=e.range(.09,.13),_=e.range(.02,.03),M=(E-x.z)/(y.z-x.z),A=w+(b-w)*M,P=T-_,C=Math.max(0,P-A*1.2-.006),L=new ps(T,_,4,9);L.rotateY(e.around(0,.25)),L.translate(p,x.y+(y.y-x.y)*M-C,E),n.push({geometry:L,color:I(D.CLOTH,e.range(.85,1.05)),sway:0})}}const v=pt(n);return t!==1&&v.scale(t,t,t),xt(v,"wall-pegs",0)}},md={name:"hoist",category:"structures",radius:2.4,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(2.8,5.4),o=e.range(2.5,4.2),r=I(D.IRON,e.range(.85,1.05)),a=e.range(.08,.11),c=o;for(const[g,v,m]of[[c+.11,.3,.05],[c-.11,.3,.05]]){const p=new k(s,m,v);p.translate(0,g,0),n.push({geometry:p,color:I(r,1.06),sway:0})}const l=new k(s*.995,.24,.07);l.translate(0,c,0),n.push({geometry:l,color:r,sway:0});for(const g of[-1,1]){const v=g*s/2-g*.3,m=new Y(a*.85,a,o,6);m.translate(v,o/2,0),n.push({geometry:m,color:r,sway:0});const p=new k(a*4.4,.07,a*4.4);p.translate(v,.035,0),n.push({geometry:p,color:I(r,.84),sway:0});const x=new R(v,o-.75,0),y=new R(v-g*.7,c-.16,0);n.push({geometry:Bt(x,y,.045,.04),color:I(r,.9),sway:0})}const h=e.range(-s*.28,s*.28),u=new k(.38,.26,.3);u.translate(h,c-.28,0),n.push({geometry:u,color:I(r,1.14),sway:0});const f=new Y(.13,.13,.12,8);if(f.rotateX(Math.PI/2),f.translate(h,c-.28,.2),n.push({geometry:f,color:I(D.RUST,1.05),sway:0}),e.chance(.72)){const g=e.range(.8,Math.max(1,c-1.4)),v=.035,m=.011,p=v*1.35,x=.075,y=g+x,w=y+x,b=w+.11,S=c-.42,E=b-v*.5,T=Math.max(p*2,S-E),_=Math.max(3,Math.round(T/p)+1);for(let N=0;N<_;N++){const F=S-N*T/(_-1),H=new ps(v,m,4,6);H.rotateY(N%2===0?0:Math.PI/2),H.translate(h,F,0),n.push({geometry:H,color:I(r,.92),sway:0})}n.push({geometry:Bt(new R(h,b,0),new R(h,w,0),.03,.026,6),color:I(r,1.1),sway:0});const M=new R(h,y,0),A=6,P=N=>{const F=N/A*Math.PI*1.55;return new R(M.x+Math.sin(F)*x,M.y+Math.cos(F)*x,M.z)};for(let N=0;N<A;N++)n.push({geometry:Bt(P(N),P(N+1),.024*(1-N/(A*2.4)),.022,5),color:I(r,1.05),sway:0});const C=P(A),L=new R(C.x-x*.5,C.y+x*.55,C.z);n.push({geometry:Bt(C,L,.021,.005,5),color:I(r,1.15),sway:0})}const d=pt(n);return t!==1&&d.scale(t,t,t),xt(d,"hoist",0)}},YT=5,$T=18,oc={name:"lantern",category:"objects",radius:.28,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=[],o=Tg(e),r=I(D.IRON,e.range(.85,1.08)),c=e.chance(.35)?I(D.RUST,e.range(.85,1.05)):r,l=e.chance(.45),h=e.range(.062,.082),u=h*(l?3.1:2.1)*e.range(.92,1.08),f=h*.16,d=h*.24,g=new Y(h*1.24,h*1.4,d,8);g.translate(0,d/2,0),n.push({geometry:g,color:I(c,.82),sway:0});const v=h*.16,m=new k(h*2.1,v,h*2.1);m.translate(0,d+v/2,0),n.push({geometry:m,color:I(c,.9),sway:0});const p=d+v;for(const F of[-1,1])for(const H of[-1,1]){const G=new k(f,u,f);G.translate(F*(h*2-f)/2,p+u/2,H*(h*2-f)/2),n.push({geometry:G,color:c,sway:0})}for(const F of[p+u*.06,p+u*.94])for(const H of[0,1]){const G=H===0,V=new k(G?h*2:f*.9,f*.9,G?f*.9:h*2-f*2.2);for(const et of[-1,1]){const lt=V.clone(),bt=(h*2-f)/2;lt.translate(G?0:et*bt,F,G?et*bt:0),n.push({geometry:lt,color:I(c,.92),sway:0})}V.dispose()}const x=p+u,y=h*.7,w=new Y(h*.5,h*1.55,y,4);w.rotateY(Math.PI/4),w.translate(0,x+y/2,0),n.push({geometry:w,color:I(c,1.1),sway:0});const b=h*.3,S=new Y(h*.34,h*.42,b,6);S.translate(0,x+y+b/2,0),n.push({geometry:S,color:I(c,.88),sway:0});const E=h*.5,T=new ps(E,f*.42,4,10);T.rotateY(e.chance(.5)?0:Math.PI/2),T.translate(0,x+y+b+E*.85,0),n.push({geometry:T,color:I(c,1.05),sway:0});const _=p+u*e.range(.24,.34),M=new Y(h*.46,h*.56,h*.3,8);M.translate(0,p+h*.15,0),n.push({geometry:M,color:o.color,sway:0}),Ag(s,o,0,_,0,h*.42);const A=pt(n),P=pt(s),C=e.range(0,Math.PI*2);A.rotateY(C),P.rotateY(C),t!==1&&(A.scale(t,t,t),P.scale(t,t,t));const L=xt(A,"lantern",0);L.add(Nn(P,"lantern:glow"));const N=new ms(o.light,YT*e.around(1,.12)*t*t,$T*t,rd);return N.position.set(0,_*t,0),N.castShadow=!1,L.add(N),L}},lp={turf:{color:D.GRASS,variation:.1,step:"grass"},meadow:{color:D.GRASS_DRY,variation:.13,step:"grass"},dirt:{color:D.EARTH,variation:.09,step:"earth"},gravel:{color:7235158,variation:.16,step:"gravel"},cobble:{color:D.STONE,variation:.19,step:"stone"},flagstone:{color:D.STONE_PALE,variation:.08,step:"stone"},boards:{color:D.TIMBER,variation:.11,step:"wood"},crop:{color:D.LEAF_DRY,variation:.15,step:"grass"},mire:{color:4536876,variation:.12,step:"mud"},rock:{color:D.STONE_DARK,variation:.13,step:"stone"}};function ZT(i,t,e,n,s,o){const r=s-e,a=o-n,c=r*r+a*a,l=c===0?0:Math.max(0,Math.min(1,((i-e)*r+(t-n)*a)/c));return Math.hypot(i-(e+r*l),t-(n+a*l))}function hp(i,t,e){for(let n=i.length-1;n>=0;n--){const s=i[n];switch(s.kind){case"blot":if(Math.hypot(t-s.at[0],e-s.at[1])<=s.radius)return s.material;break;case"field":if(t>=s.min[0]&&t<=s.max[0]&&e>=s.min[1]&&e<=s.max[1])return s.material;break;case"path":{const o=s.width/2;for(let r=0;r+1<s.through.length;r++){const a=s.through[r],c=s.through[r+1];if(ZT(t,e,a[0],a[1],c[0],c[1])<=o)return s.material}break}}}return null}function KT(i,t){let e=Math.round(i/1.2)*374761393+Math.round(t/1.2)*668265263|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function zo(i){const t=i<0?0:i>1?1:i;return t*t*t*(t*(t*6-15)+10)}function jT(i,t,e,n,s,o){const r=s-e,a=o-n,c=r*r+a*a,l=c===0?0:Math.max(0,Math.min(1,((i-e)*r+(t-n)*a)/c));return Math.hypot(i-(e+r*l),t-(n+a*l))}class JT{size;resolution;landforms;patches;detail;rockAngle;base;constructor(t){this.size=t.size,this.resolution=t.resolution,this.landforms=t.landforms,this.patches=t.patches??[],this.detail=t.detail??[],this.rockAngle=t.rockAngle??34,this.base=t.base??"turf"}heightAt(t,e){let n=0;for(const s of this.landforms)switch(s.kind){case"terrace":break;case"hill":{const o=Math.hypot(t-s.at[0],e-s.at[1]),r=zo(1-o/s.radius);n+=s.height*(s.falloff?r**s.falloff:r);break}case"ridge":{const o=jT(t,e,s.from[0],s.from[1],s.to[0],s.to[1]);n+=s.height*zo(1-o/s.width);break}case"basin":{const o=Math.hypot(t-s.at[0],e-s.at[1]);n-=s.depth*zo(1-o/s.radius);break}case"rim":{const r=this.size/2-Math.max(Math.abs(t),Math.abs(e));n+=s.height*zo(1-r/s.inset);break}}for(const s of this.landforms){if(s.kind!=="terrace")continue;const o=Math.hypot(t-s.at[0],e-s.at[1]);if(o>=s.radius+s.blend)continue;const r=o<=s.radius?1:zo((s.radius+s.blend-o)/s.blend);n=n*(1-r)+s.height*r}return n}get detailRegions(){return this.detail}slopeAt(t,e,n=this.resolution){const s=(this.heightAt(t+n,e)-this.heightAt(t-n,e))/(2*n),o=(this.heightAt(t,e+n)-this.heightAt(t,e-n))/(2*n);return Math.atan(Math.hypot(s,o))*180/Math.PI}build(){const t=Math.round(this.size/this.resolution),e=this.size/2,n=this.resolution,s=new Uint8Array(t*t);for(let x=0;x<t;x++)for(let y=0;y<t;y++){const w=-e+(y+.5)*n,b=-e+(x+.5)*n;let S=1;for(const E of this.detail)Math.hypot(w-E.at[0],b-E.at[1])<=E.radius&&(S=Math.max(S,E.level));s[x*t+y]=S}const o=(x,y)=>x<0||y<0||x>=t||y>=t?1:s[x*t+y],r=[],a=[],c=[],l=new R,h=new R,u=new R,f=new R,d=new R,g=new R,v=new Vt,m=(x,y)=>{r.push(x.x,x.y,x.z),a.push(y.x,y.y,y.z),c.push(v.r,v.g,v.b)};for(let x=0;x<t;x++)for(let y=0;y<t;y++){const w=s[x*t+y],b=-e+y*n,S=-e+x*n,E=o(x,y-1),T=o(x,y+1),_=o(x-1,y),M=o(x+1,y),A=(P,C)=>P===0&&E<w?this.alongEdge(b,S,b,S+n,C,E):P===1&&T<w?this.alongEdge(b+n,S,b+n,S+n,C,T):C===0&&_<w?this.alongEdge(b,S,b+n,S,P,_):C===1&&M<w?this.alongEdge(b,S+n,b+n,S+n,P,M):this.heightAt(b+P*n,S+C*n);for(let P=0;P<w;P++)for(let C=0;C<w;C++){const L=C/w,N=(C+1)/w,F=P/w,H=(P+1)/w,G=[[b+L*n,A(L,F),S+F*n],[b+L*n,A(L,H),S+H*n],[b+N*n,A(N,H),S+H*n],[b+N*n,A(N,F),S+F*n]];for(const[V,et,lt]of[[0,1,2],[0,2,3]])l.set(...G[V]),h.set(...G[et]),u.set(...G[lt]),f.subVectors(h,l),d.subVectors(u,l),g.crossVectors(f,d).normalize(),g.y<0&&g.negate(),v.set(this.faceColor(g.y,(l.y+h.y+u.y)/3,(l.x+h.x+u.x)/3,(l.z+h.z+u.z)/3)),m(l,g),m(h,g),m(u,g)}}const p=new Fe;return p.setAttribute("position",new le(r,3)),p.setAttribute("normal",new le(a,3)),p.setAttribute("color",new le(c,3)),p.setAttribute(uo,new le(new Float32Array(r.length/3),1)),xt(p,"terrain",0)}alongEdge(t,e,n,s,o,r){const a=1/r,l=Math.min(r-1,Math.floor(o/a))*a,h=l+a,u=this.heightAt(t+(n-t)*l,e+(s-e)*l),f=this.heightAt(t+(n-t)*h,e+(s-e)*h);return u+(f-u)*((o-l)/a)}materialAt(t,e){return this.slopeAt(t,e)>this.rockAngle?"rock":hp(this.patches,t,e)??this.base}stepAt(t,e){return lp[this.materialAt(t,e)].step}faceColor(t,e,n,s){const r=Math.acos(Math.min(1,Math.max(-1,t)))*180/Math.PI>this.rockAngle?"rock":hp(this.patches,n,s)??this.base,a=lp[r],c=1+(KT(n,s)-.5)*a.variation*2,l=1-Math.min(Math.max(e/55,0),1)*.16;return I(a.color,c*l)}}const QT={name:"tree",category:"foliage",radius:2.2,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(3.2,4.6),o=e.range(0,Math.PI*2),r=s*e.range(.55,.68),a=new Y(e.range(.11,.17),e.range(.24,.34),r,6);a.translate(0,r/2,0),n.push({geometry:a,color:D.BARK,sway:Ie(0,s,2.2)});const c=e.int(2,4);for(let f=0;f<c;f++){const d=r*e.range(.6,.95),g=e.range(.7,1.3),v=new Y(.045,.09,g,4);v.translate(0,g/2,0),v.rotateZ(e.range(.5,1.05)),v.rotateY(o+f/c*Math.PI*2+e.around(0,.4)),v.translate(0,d,0),n.push({geometry:v,color:D.BARK_PALE,sway:Ie(0,s,1.4)})}const l=e.int(3,5),h=r+e.range(.3,.7);for(let f=0;f<l;f++){const d=e.range(.75,1.35),g=new ie(d,0);g.rotateX(e.range(0,Math.PI)),g.rotateY(e.range(0,Math.PI)),g.scale(1,e.range(.72,.95),1);const v=e.range(0,.95),m=o+f/l*Math.PI*2+e.around(0,.5);g.translate(Math.cos(m)*v,h+e.around(0,.45),Math.sin(m)*v),n.push({geometry:g,color:e.chance(.25)?D.LEAF_DARK:D.LEAF,sway:e.range(.82,1)})}const u=pt(n);return t!==1&&u.scale(t,t,t),xt(u,"tree",e()*Math.PI*2)}},tA={name:"bush",category:"foliage",radius:1,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.int(3,5),o=e.range(.35,.7);for(let a=0;a<s;a++){const c=e.range(.3,.62),l=new ie(c,0);l.rotateX(e.range(0,Math.PI)),l.rotateY(e.range(0,Math.PI)),l.scale(1,e.range(.6,.85),1);const h=a/s*Math.PI*2+e.around(0,.6),u=e.range(0,o),f=c*e.range(.55,.85);l.translate(Math.cos(h)*u,f,Math.sin(h)*u),n.push({geometry:l,color:e.chance(.2)?D.LEAF_DRY:D.LEAF,sway:(d,g)=>Math.min(1,.35+g*.75)})}const r=pt(n);return t!==1&&r.scale(t,t,t),xt(r,"bush",e()*Math.PI*2)}},Dg={name:"small-grass-clump",category:"foliage",radius:.55,solid:!1,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.int(30,46);for(let r=0;r<s;r++){const a=e.range(.16,.6),c=new Qt(e.range(.016,.032),a,3);c.translate(0,a/2,0),c.scale(1,1,e.range(.3,.55));const l=e.range(.1,.75)*(a/.6);c.rotateZ(e.chance(.5)?l:-l),c.rotateY(e.range(0,Math.PI*2));const h=e.range(0,Math.PI*2),u=Math.sqrt(e())*.26;c.translate(Math.cos(h)*u,0,Math.sin(h)*u),n.push({geometry:c,color:e.chance(.3)?D.GRASS_DRY:D.GRASS,sway:(f,d)=>Math.max(0,d/a)**1.5})}const o=pt(n);return t!==1&&o.scale(t,t,t),xt(o,"small-grass-clump",e()*Math.PI*2)}},Lg={name:"large-grass-clump",category:"foliage",radius:1.6,solid:!1,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(.7,.95),o=e.int(5,8),r=[];for(let h=0;h<o;h++){const u=h/o*Math.PI*2+e.range(-.5,.5),f=e.range(.25,.85)*s;r.push({x:Math.cos(u)*f,z:Math.sin(u)*f,grip:e.range(.24,.42)})}const a=e.int(430,620);for(let h=0;h<a;h++){let u,f,d=!1;if(e.chance(.5)){const p=r[e.int(0,r.length-1)],x=e.range(0,Math.PI*2),y=Math.sqrt(e())*p.grip;u=p.x+Math.cos(x)*y,f=p.z+Math.sin(x)*y,d=!0}else{const p=e.range(0,Math.PI*2),x=Math.sqrt(e())*s;u=Math.cos(p)*x,f=Math.sin(p)*x}const g=d?e.range(.3,.72):e.range(.1,.34),v=new Qt(e.range(.014,.03),g,3);v.translate(0,g/2,0),v.scale(1,1,e.range(.3,.55));const m=e.range(.1,.8)*(g/.72);v.rotateZ(e.chance(.5)?m:-m),v.rotateY(e.range(0,Math.PI*2)),v.translate(u,0,f),n.push({geometry:v,color:e.chance(d?.2:.4)?D.GRASS_DRY:D.GRASS,sway:(p,x)=>Math.max(0,x/g)**1.5})}const c=e.int(14,26);for(let h=0;h<c;h++){const u=r[e.int(0,r.length-1)],f=e.range(0,Math.PI*2),d=Math.sqrt(e())*(e.chance(.7)?u.grip*1.4:s),g=(e.chance(.7)?u.x:0)+Math.cos(f)*d,v=(e.chance(.7)?u.z:0)+Math.sin(f)*d,m=e.range(.6,1.05),p=e.range(.05,.34),x=e.range(0,Math.PI*2),y=Math.cos(x)*p,w=Math.sin(x)*p,b=new Y(.0035,.006,m,4);b.translate(0,m/2,0),b.rotateX(y),b.rotateZ(w),b.translate(g,0,v),n.push({geometry:b,color:I(D.GRASS_DRY,e.range(.9,1.1)),sway:(_,M)=>Math.max(0,M/m)**1.3});const S=_=>iA.set(0,_*m,0).applyAxisAngle(eA,y).applyAxisAngle(nA,w).add(sA.set(g,0,v)),E=e.int(3,6),T=e.range(.14,.24);for(let _=0;_<E;_++){const M=_/E,A=.011*(1-M*.4),P=A*e.range(3,4.5),C=new Qt(A,P,3);C.translate(0,P/2,0),C.scale(1,1,.6),C.rotateZ(e.range(.5,1.1)),C.rotateY(_/E*Math.PI*2+e.range(0,.6));const L=S(1-T*M);C.translate(L.x,L.y,L.z),n.push({geometry:C,color:I(e.chance(.4)?10260316:D.GRASS_DRY,e.range(.9,1.12)),sway:1})}}const l=pt(n);return t!==1&&l.scale(t,t,t),xt(l,"large-grass-clump",e()*Math.PI*2)}},eA=new R(1,0,0),nA=new R(0,0,1),iA=new R,sA=new R,Ng={name:"mushroom",category:"foliage",radius:.4,solid:!1,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.chance(.42)?"button":e.chance(.55)?"open":"puffball",o=e.pick([D.RUST,D.EARTH,D.STONE_PALE,D.BARK_PALE,9058862,12100712]),r=e.chance(.5)?D.CLOTH:14209212,a=s==="puffball"?e.int(4,9):e.int(3,7);for(let l=0;l<a;l++){const h=e(),u=e.range(.045,.13)*(.5+h*.75),f=e.range(0,Math.PI*2),d=Math.sqrt(e())*.22,g=Math.cos(f)*d,v=Math.sin(f)*d;if(s==="puffball"){const w=u*e.range(.5,.9),b=new Y(u*.62,u*.4,w,6);b.translate(g,w/2,v),n.push({geometry:b,color:I(r,.9),sway:0});const S=new ie(u*1.15,1);S.scale(1,e.range(.78,.95),1),S.translate(g,w+u*.72,v),n.push({geometry:S,color:I(r,e.range(.92,1.1)),sway:0});continue}const m=e.around(0,.2),p=u*e.range(1.1,2.4),x=u*e.range(.24,.36),y=new Y(x*.86,x*1.2,p,6);if(y.translate(0,p/2,0),y.rotateZ(m),y.translate(g,0,v),n.push({geometry:y,color:I(r,e.range(.94,1.06)),sway:0}),s==="button"){const w=u*(.8+h*.5),b=u*(1.35-h*.6),S=new Qt(w,b,e.int(7,9));S.translate(0,b*.34,0),S.rotateZ(m),S.translate(g,p,v),n.push({geometry:S,color:o,sway:0})}else{const w=u*(1.3+h*.7),b=new Y(w*.55,w,u*.2,9);b.rotateZ(m),b.translate(g,p+u*.08,v),n.push({geometry:b,color:o,sway:0});const S=new Y(w*1.04,w*.9,u*.13,9);S.rotateZ(m),S.translate(g,p+u*.2,v),n.push({geometry:S,color:I(o,1.14),sway:0});const E=new Y(w*.86,w*.5,u*.1,9);E.rotateZ(m),E.translate(g,p-u*.02,v),n.push({geometry:E,color:I(r,.88),sway:0})}}const c=pt(n);return t!==1&&c.scale(t,t,t),xt(c,"mushroom",0)}},Fg={name:"rock",category:"nature",radius:.9,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=e.range(.35,1.1),s=new ie(n,n>.7?1:0);s.deleteAttribute("normal"),s.deleteAttribute("uv");const o=Ku(s);s.dispose();const r=o.getAttribute("position"),a=new R;for(let h=0;h<r.count;h++)a.fromBufferAttribute(r,h),a.multiplyScalar(e.range(.72,1.28)),r.setXYZ(h,a.x,a.y,a.z);r.needsUpdate=!0,o.scale(1,e.range(.6,.85),e.range(.85,1.15)),o.translate(0,n*e.range(.28,.45),0),o.computeVertexNormals();const c=[{geometry:o,color:e.chance(.3)?D.STONE_DARK:D.STONE,sway:0}],l=pt(c);return t!==1&&l.scale(t,t,t),xt(l,"rock",0)}};function oA(i,t){const e=new ie(t,0);e.deleteAttribute("normal"),e.deleteAttribute("uv");const n=Ku(e);e.dispose();const s=n.getAttribute("position"),o=new R;for(let r=0;r<s.count;r++)o.fromBufferAttribute(s,r),o.multiplyScalar(i.range(.78,1.2)),s.setXYZ(r,o.x,o.y,o.z);return s.needsUpdate=!0,n.scale(1,i.range(.45,.7),i.range(.85,1.1)),n.computeVertexNormals(),n}const Ug={name:"cairn",category:"nature",radius:.7,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.int(4,7);let o=e.range(.26,.38),r=0;for(let c=0;c<s;c++){const l=oA(e,o);l.computeBoundingBox();const h=l.boundingBox,u=h?(h.max.y-h.min.y)/2:o*.5;l.rotateY(e.range(0,Math.PI*2)),r+=u*(c===0?1:1.55),l.translate(e.around(0,o*.14),r,e.around(0,o*.14)),n.push({geometry:l,color:e.chance(.35)?D.STONE_DARK:D.STONE,sway:0}),o*=e.range(.76,.9)}const a=pt(n);return t!==1&&a.scale(t,t,t),xt(a,"cairn",0)}},Og={name:"stump",category:"foliage",radius:.75,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(.3,.7),o=e.range(.22,.36),r=o*e.range(1.25,1.6),a=e.int(6,9),c=e.range(0,.12),l=new Y(o,r,s,a);l.translate(0,s/2,0),l.rotateZ(c),n.push({geometry:l,color:D.BARK,sway:0});const h=new Y(o*.94,o*.94,.04,a);h.translate(0,s,0),h.rotateZ(c),n.push({geometry:h,color:D.BARK_PALE,sway:0});const u=e.int(3,6);for(let d=0;d<u;d++){const g=e.range(.3,.6),v=new Y(.04,.11,g,4);v.translate(0,-g/2,0),v.rotateZ(e.range(1.05,1.45)),v.rotateY(d/u*Math.PI*2+e.around(0,.5)),v.translate(0,e.range(.05,.16),0),n.push({geometry:v,color:D.BARK,sway:0})}const f=pt(n);return t!==1&&f.scale(t,t,t),xt(f,"stump",0)}},kg={name:"fence",category:"structures",radius:2.4,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.int(3,5),o=e.range(1.1,1.6),r=e.range(.85,1.25),a=e.int(2,3),c=s*o;for(let h=0;h<=s;h++){const u=h*o-c/2,f=e.around(0,.09),d=r*e.range(.85,1.1),g=new k(.11,d,.11);g.translate(0,d/2,0),g.rotateZ(f),g.rotateY(e.around(0,.25)),g.translate(u,0,e.around(0,.06)),n.push({geometry:g,color:D.TIMBER,sway:0})}for(let h=0;h<s;h++){if(e.chance(.22))continue;const u=h*o-c/2+o/2;for(let f=0;f<a;f++){const d=r*(.32+f/Math.max(a-1,1)*.52),g=new k(o*1.02,.07,.05);g.rotateZ(e.around(0,.05)),g.translate(u,d+e.around(0,.03),e.around(0,.03)),n.push({geometry:g,color:D.TIMBER_DARK,sway:0})}}const l=pt(n);return l.rotateY(e.range(0,Math.PI)),t!==1&&l.scale(t,t,t),xt(l,"fence",0)}},zg={name:"post",category:"structures",radius:.4,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(.9,2.1),o=e.range(.07,.13),r=e.range(.02,.16),a=e.range(0,Math.PI*2),c=new k(o*2,s,o*2);if(c.translate(0,s/2,0),c.rotateZ(r),c.rotateY(a),n.push({geometry:c,color:D.TIMBER,sway:0}),e.chance(.4)){const h=e.range(.5,1.1),u=new k(h,o*1.4,o*1.4);u.translate(0,s*e.range(.6,.85),0),u.rotateZ(r),u.rotateY(a+e.around(0,.3)),n.push({geometry:u,color:D.TIMBER_DARK,sway:0})}if(e.chance(.45)){const h=new k(o*2.5,.09,o*2.5);h.translate(0,s-.09,0),h.rotateZ(r),h.rotateY(a),n.push({geometry:h,color:D.RUST,sway:0})}const l=pt(n);return t!==1&&l.scale(t,t,t),xt(l,"post",0)}},Bg={name:"trough",category:"objects",radius:1.1,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(1.4,2.1),o=e.range(.5,.75),r=e.range(.4,.6),a=e.range(.09,.14),c=e.chance(.55),l=c?D.STONE:D.TIMBER,h=new k(s-a,a,o-a);h.translate(0,a/2+.01,0),n.push({geometry:h,color:c?D.STONE_DARK:D.TIMBER_DARK,sway:0});for(const f of[-1,1]){const d=new k(s*.99,r,a);d.translate(0,r/2,f*(o-a)/2),n.push({geometry:d,color:l,sway:0});const g=new k(a,r*.985,o*.985);g.translate(f*(s-a)/2,r/2,0),n.push({geometry:g,color:l,sway:0})}if(e.chance(.6)){const f=new k(s-a*1.6,.03,o-a*1.6);f.translate(0,r*e.range(.55,.78),0),n.push({geometry:f,color:2899782,sway:0})}const u=pt(n);return u.rotateY(e.range(0,Math.PI)),t!==1&&u.scale(t,t,t),xt(u,"trough",0)}};function ke(i,t,e,n,s){const o=new ie(t,e);o.deleteAttribute("normal"),o.deleteAttribute("uv");const r=Ku(o);o.dispose();const a=r.getAttribute("position"),c=new R;for(let l=0;l<a.count;l++)c.fromBufferAttribute(a,l),c.multiplyScalar(i.range(n,s)),a.setXYZ(l,c.x,c.y,c.z);return a.needsUpdate=!0,r.computeVertexNormals(),r}function Us(i,t){return i.range(t[0],t[1])}function rA(i,t,e,n,s){const o=e.range(0,100),r=e.range(0,100),a=e.range(0,100),c=(h,u,f)=>{let d=Math.imul(Math.round(h)*374761393+Math.round(u)*668265263,1);return d=Math.imul(d^d>>>13,1274126177)+Math.round(f)*951274213,d^=d>>>16,(d>>>0)%1e3/1e3},l=(h,u,f)=>{const d=Math.floor(h),g=Math.floor(u),v=Math.floor(f),m=Gl(h-d),p=Gl(u-g),x=Gl(f-v);let y=0;for(let w=0;w<=1;w++)for(let b=0;b<=1;b++)for(let S=0;S<=1;S++){const E=(S?m:1-m)*(b?p:1-p)*(w?x:1-x);y+=c(d+S,g+b,v+w)*E}return y};return(h,u,f)=>l(h*n+o,u*n+r,f*n+a)<s?t:i}function Gl(i){return i*i*(3-2*i)}function br(i,t,e,{scale:n=1}){const s=[],o=Us(e,t.length),r=Us(e,t.girth),a=Us(e,t.legLength),c=r*e.range(.62,.78),l=e.pick(t.hide),h=a+r/2,u=t.woolly||o>1.2?1:0,f=t.woolly?ke(e,r/2,u,.86,1.24):new ie(r/2,u);f.scale(c/r,1,o/r),f.rotateZ(e.around(0,.05)),f.translate(0,h,0);const d=t.woolly?aA:t.patch?rA(l,e.pick(t.patch),e,2.6/r,t.patchCoverage??.45):l;s.push({geometry:f,color:d,sway:0});const g=Us(e,t.neck),v=Us(e,t.neckRise),m=new R(0,h+r*.18,o*.4),p=r*.45,x=g+p,y=new Y(r*.17,r*.24,x,6);y.translate(0,x/2-p,0),y.rotateX(Math.PI/2-v),y.translate(m.x,m.y,m.z),s.push({geometry:y,color:d,sway:0});const w=new R(0,m.y+Math.sin(v)*g,m.z+Math.cos(v)*g),b=Us(e,t.headSize);if(t.head)s.push(...t.head({at:w,size:b,coat:d,extremity:t.extremity,rng:e}));else{const E=new ie(b,0);if(E.scale(.85,.9,t.headStretch),E.rotateY(e.around(0,.2)),E.translate(w.x,w.y,w.z),s.push({geometry:E,color:d,sway:0}),t.snout>0){const T=new Y(b*t.snout*.52,b*t.snout*.66,b*.62,6);T.rotateX(Math.PI/2),T.translate(w.x,w.y-b*.13,w.z+b*t.headStretch*.66),s.push({geometry:T,color:t.extremity,sway:0})}}for(const E of[-1,1]){if(!t.head&&t.ears!=="none"){const T=new Qt(b*.28,b*.85,4);T.translate(0,b*.42,0),t.ears==="floppy"?T.rotateZ(E*2.4):t.ears==="side"?T.rotateZ(E*1.5):T.rotateZ(E*.35),T.translate(w.x+E*b*.6,w.y+b*.4,w.z),s.push({geometry:T,color:t.extremity,sway:0})}if(t.horns!=="none"){const T=b*(t.horns==="curved"?1.5:.7),_=new Qt(b*.16,T,5);_.translate(0,T/2,0),_.rotateZ(E*(t.horns==="curved"?1.1:.5)),_.translate(w.x+E*b*.45,w.y+b*.55,w.z),s.push({geometry:_,color:up,sway:0})}for(const T of[-1,1]){const _=h,M=new Y(t.legThickness*.78,t.legThickness,_,5);if(M.translate(0,_/2,0),M.rotateZ(E*e.range(-.02,.07)),M.translate(E*c*.34,0,T*o*e.range(.26,.34)),s.push({geometry:M,color:l,sway:0}),t.feet==="paw"){const A=new k(t.legThickness*2.4,a*.11,t.legThickness*3.6);A.translate(E*c*.34,a*.055,T*o*.3+t.legThickness*.9),s.push({geometry:A,color:t.extremity,sway:0})}else{const A=new Y(t.legThickness*1.15,t.legThickness*1.05,a*.13,5);A.translate(E*c*.34,a*.06,T*o*.3),s.push({geometry:A,color:cA,sway:0})}}}if(t.tail!=="none"){const E=new R(0,h+r*.16,-o*.42);if(t.tail==="carried"){const M=o*e.range(.16,.6)/4;let A=-e.range(.7,1),P=E.x,C=E.y,L=E.z;for(let N=0;N<4;N++){const F=r*.075*(1-N/5),H=new Y(F*.7,F,M*1.15,4);H.translate(0,M/2,0),H.rotateX(A),H.translate(P,C,L),s.push({geometry:H,color:l,sway:Vl}),C+=M*Math.cos(A),L+=M*Math.sin(A),A+=e.range(.15,.35)}}else if(t.tail==="curl"){const _=r*.06;for(let M=0;M<9;M++){const A=M/8,P=A*Math.PI*2.2,C=new ie(_*(1-A*.25),0);C.translate(Math.sin(P)*r*.1,E.y+A*r*.2,E.z-r*.04-(1-Math.cos(P))*r*.05),s.push({geometry:C,color:t.extremity,sway:0})}}else{const T=o*(t.tail==="flowing"?.4:.3),_=e.range(.08,.42),M=new Y(r*.07,r*.028,T,4);M.translate(0,-T/2,0),M.rotateX(_),M.translate(E.x,E.y,E.z),s.push({geometry:M,color:l,sway:Vl});const A=T*.94,P=new ie(r*.115,0);P.scale(.75,t.tail==="flowing"?1.7:1.05,.75),P.rotateX(_),P.translate(E.x,E.y-A*Math.cos(_),E.z-A*Math.sin(_)),s.push({geometry:P,color:up,sway:Vl})}}const S=pt(s);return S.rotateY(e.range(0,Math.PI*2)),n!==1&&S.scale(n,n,n),xt(S,i,e()*Math.PI*2)}const aA=12433060,up=9076841,cA=3814187,Vl=.4,lA={length:[1.9,2.3],girth:[.85,1.05],legLength:[.62,.78],legThickness:.085,neck:[.4,.55],neckRise:[.05,.3],headSize:[.24,.3],headStretch:1.5,snout:.38,ears:"side",horns:"stub",tail:"switch",woolly:!1,hide:[D.WOOL,D.STONE_PALE],extremity:D.HOG,patch:[D.COW_BLACK,D.COW_BLACK,D.HIDE_DARK],patchCoverage:.46},Hg={name:"bovine",category:"animals",radius:1.4,build:(i={})=>br("bovine",lA,gt(i.seed??1),i)},hA={length:[.95,1.25],girth:[.55,.7],legLength:[.34,.46],legThickness:.045,neck:[.18,.28],neckRise:[.2,.5],headSize:[.13,.17],headStretch:1.4,snout:.32,ears:"side",horns:"none",tail:"switch",woolly:!0,hide:[D.HIDE_DARK,D.STONE_DARK],extremity:D.HIDE_DARK},Gg={name:"ovine",category:"animals",radius:.8,build:(i={})=>br("ovine",hA,gt(i.seed??1),i)},uA={length:[1.9,2.2],girth:[.75,.9],legLength:[.95,1.15],legThickness:.07,neck:[.6,.8],neckRise:[.75,1.05],headSize:[.2,.25],headStretch:1.9,snout:.3,ears:"perked",horns:"none",tail:"flowing",woolly:!1,hide:[D.HIDE_DARK,D.HIDE,D.BARK],extremity:D.HIDE_DARK},Vg={name:"equine",category:"animals",radius:1.4,build:(i={})=>br("equine",uA,gt(i.seed??1),i)},dA={length:[1.1,1.5],girth:[.6,.78],legLength:[.25,.36],legThickness:.055,neck:[.1,.2],neckRise:[0,.2],headSize:[.19,.24],headStretch:1.45,snout:.75,ears:"floppy",horns:"none",tail:"curl",woolly:!1,hide:[D.HOG,D.HIDE_PALE,D.HIDE_DARK],extremity:D.HOG,patch:[D.HIDE_DARK,D.HIDE],patchCoverage:.3},Wg={name:"porcine",category:"animals",radius:.95,build:(i={})=>br("porcine",dA,gt(i.seed??1),i)},Xg={name:"poultry",category:"animals",radius:.35,solid:!1,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(.16,.23),o=e.range(.09,.16),r=e.pick([D.FOWL,D.HIDE_PALE,D.HIDE_DARK,D.CLOTH]),a=o+s*.75,c=new ie(s,0);c.scale(.8,.95,1.25),c.rotateX(e.range(.15,.35)),c.translate(0,a,0),n.push({geometry:c,color:r,sway:0});const l=s*e.range(.42,.55),h=new R(0,a+s*e.range(.75,1.05),s*.6),u=new Y(s*.2,s*.28,s*.55,5);u.rotateX(-.5),u.translate(0,a+s*.5,s*.42),n.push({geometry:u,color:r,sway:0});const f=new ie(l,0);f.translate(h.x,h.y,h.z),n.push({geometry:f,color:r,sway:0});const d=new Qt(l*.35,l*.8,4);d.rotateX(Math.PI/2),d.translate(h.x,h.y-l*.15,h.z+l*.9),n.push({geometry:d,color:D.MARKER_YELLOW,sway:0});const g=e.int(2,4);for(let p=0;p<g;p++){const x=p/Math.max(g-1,1),y=new Qt(l*.14,l*(.7-x*.3),3);y.scale(1,1,.4),y.translate(h.x,h.y+l*.95,h.z-x*l*.7),n.push({geometry:y,color:D.COMB,sway:.4})}if(e.chance(.6)){const p=new ie(l*.22,0);p.scale(.5,1.1,.7),p.translate(h.x,h.y-l*.75,h.z+l*.5),n.push({geometry:p,color:D.COMB,sway:.3})}const v=e.int(3,5);for(let p=0;p<v;p++){const x=(p/Math.max(v-1,1)-.5)*.8,y=new Qt(s*.2,s*e.range(.9,1.4),3);y.scale(1,1,.35),y.translate(0,s*.55,0),y.rotateX(e.range(-1.1,-.7)),y.rotateY(x),y.translate(0,a+s*.35,-s*.85),n.push({geometry:y,color:r,sway:.45})}for(const p of[-1,1]){const x=a,y=new Y(s*.055,s*.05,x,4);y.translate(0,x/2,0),y.rotateZ(p*e.range(0,.12)),y.translate(p*s*.24,0,e.around(0,s*.1)),n.push({geometry:y,color:D.MARKER_YELLOW,sway:0});const w=new Qt(s*.13,s*.09,3);w.rotateX(Math.PI),w.translate(p*s*.24,s*.04,s*.06),n.push({geometry:w,color:D.MARKER_YELLOW,sway:0})}const m=pt(n);return m.rotateY(e.range(0,Math.PI*2)),t!==1&&m.scale(t,t,t),xt(m,"poultry",e()*Math.PI*2)}},qg={name:"archway",category:"structures",radius:1.8,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(1.5,1.9),o=e.range(2.6,3.1),r=e.range(.42,.58),a=e.range(.5,.7),c=e.chance(.5)?D.STONE:D.STONE_DARK;for(const u of[-1,1]){const f=e.int(3,4),d=o/f;for(let g=0;g<f;g++){const v=1-g/f*.12,m=new k(r*v,d*1.02,a*v);m.translate(u*(s+r)/2+e.around(0,.02),d*(g+.5),e.around(0,.02)),n.push({geometry:m,color:I(c,e.around(1,.08)),sway:0})}}const l=new k(s+r*2.5,e.range(.34,.46),a*1.1);if(l.translate(0,o+.18,0),n.push({geometry:l,color:I(c,.92),sway:0}),e.chance(.55)){const u=new k(s+r*1.6,.18,a*.8);u.translate(e.around(0,.06),o+.48,0),n.push({geometry:u,color:I(c,1.08),sway:0})}const h=pt(n);return t!==1&&h.scale(t,t,t),xt(h,"archway",0)}},fA=4.5,pA=11,mA=16747068,gA=.86,gd={name:"forge",category:"structures",radius:1.3,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=[],o=e.range(.85,1.8),r=e.range(.7,1.25),a=e.range(.62,.92),c=e.range(.3,1),l=I(D.IRON,e.range(.85,1.05)),h=I(e.chance(.5)?8014392:7029814,e.range(.9,1.1)),u=2762532,f=e.int(2,4);for(let N=0;N<f;N++){const F=a/f,H=new k(o*(1-N*.015),F,r*(1-N*.015));H.translate(0,F*(N+.5),0),n.push({geometry:H,color:I(h,e.range(.9,1.12)),sway:0})}const d=new k(o*1.02,.06,r*1.02);d.translate(0,a+.03,0),n.push({geometry:d,color:u,sway:0});const g=.1;for(const[N,F,H,G]of[[o*1.02,g,0,-r/2],[g,r*1.02,-o/2,0],[g,r*1.02,o/2,0]]){const V=new k(N,g*1.6,F);V.translate(H,a+g*.8,G),n.push({geometry:V,color:I(h,.86),sway:0})}const v=e.int(5,9);for(let N=0;N<v;N++){const F=e.range(0,Math.PI*2),H=Math.sqrt(e())*o*.22,G=e.range(.035,.075),V=new ie(G,0);V.rotateY(e.range(0,Math.PI)),V.translate(Math.cos(F)*H,a+.06+G*.5,Math.sin(F)*H),n.push({geometry:V,color:e.chance(c*.45)?10239780:I(u,e.range(.85,1.3)),sway:0})}const m=a+.09,p=new Ye(o*.2*(.6+c*.6),0);p.scale(1,.32,.8),p.translate(0,m,0),s.push({geometry:p,color:mA,sway:0});const x=new Ye(o*.09,0);x.scale(1,.5,1),x.translate(e.around(0,.05),m+.02,e.around(0,.05)),s.push({geometry:x,color:16765066,sway:0});const y=a+e.range(.6,1.15),w=y+e.range(.65,1.3),b=o*e.range(.62,.75),S=e.range(.16,.22),E=.03,T=new di([new tt(b,y),new tt(S,w),new tt(S-E,w),new tt(b-E,y),new tt(b,y)],6);T.rotateY(Math.PI/6),n.push({geometry:T,color:I(l,.92),sway:0});const _=new Y(b*1.05,b*1.05,E*2.2,6);_.rotateY(Math.PI/6),_.translate(0,y+E,0),n.push({geometry:_,color:I(l,1.1),sway:0});const M=new Y(S*.94,S*.94,2.4,6);M.translate(0,w+1.2,0),n.push({geometry:M,color:I(l,.86),sway:0});for(const N of[-1,1]){const F=new k(.06,y-a,.06);F.translate(N*o/2*.86,a+(y-a)/2,-r*.36),n.push({geometry:F,color:l,sway:0})}const A=pt(n),P=pt(s);t!==1&&(A.scale(t,t,t),P.scale(t,t,t));const C=xt(A,"forge",0);C.add(Nn(P,"forge:glow"));const L=new ms(16749632,fA*(.35+c*.9)*e.around(1,.1)*t*t,pA*t,1.35);return L.position.set(0,(m+.1)*t,0),L.castShadow=!1,C.add(L),C}},vd={name:"anvil",category:"objects",radius:.5,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(.42,.56),o=e.range(.2,.26),r=e.range(.44,.58),a=e.range(.12,.16),c=I(D.IRON,e.range(.88,1.06)),l=new Y(o,o*1.12,s,8);l.translate(0,s/2,0),n.push({geometry:l,color:D.TIMBER_DARK,sway:0});const h=e.range(.055,.08),u=new k(r*.62,h,a*1.5);u.translate(0,s+h/2,0),n.push({geometry:u,color:I(c,.88),sway:0});const f=e.range(.1,.15),d=new k(r*.34,f,a*.78);d.translate(0,s+h+f/2,0),n.push({geometry:d,color:I(c,.94),sway:0});const g=e.range(.09,.13),v=s+h+f,m=new k(r,g,a);m.translate(0,v+g/2,0),n.push({geometry:m,color:(b,S)=>S>v+g*.85?I(c,1.22):c,sway:0});const p=e.range(.16,.24),x=new Qt(a*.46,p,6);x.rotateZ(-Math.PI/2),x.translate(r/2+p/2-.01,v+g*.55,0),n.push({geometry:x,color:I(c,1.06),sway:0});const y=new k(e.range(.07,.11),g*.86,a*.92);y.translate(-r/2-.03,v+g*.5,0),n.push({geometry:y,color:I(c,.98),sway:0});const w=pt(n);return w.rotateY(e.range(0,Math.PI*2)),t!==1&&w.scale(t,t,t),xt(w,"anvil",0)}},vA=.78,yA=[[.3,0],[.275,.05],[.225,.14],[.195,.25],[.178,.36],[.172,.44],[.125,.51],[.062,.56],[.045,.56],[.05,.5],[.092,.43],[.122,.35],[.146,.25],[.175,.14],[.222,.05],[.258,0],[.3,0]],Yg={name:"bell",category:"objects",radius:.75,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(.85,1.25),o=.56*s,r=.3*s,a=o+e.range(.55,.85),c=e.range(.09,.12),l=r*2+e.range(.28,.44);for(const w of[-1,1]){const b=new k(c,a,c*.92);b.translate(0,a/2,0),b.rotateZ(w*-.055),b.translate(w*l/2,0,0),n.push({geometry:b,color:D.TIMBER,sway:0});const S=new k(c*.62,l*.42,c*.6);S.translate(0,l*.21,0),S.rotateZ(w*.72),S.translate(w*l/2,a-l*.3,0),n.push({geometry:S,color:D.TIMBER_DARK,sway:0})}const h=new k(l+c*2.4,c,c);h.translate(0,a-c/2,0),n.push({geometry:h,color:D.TIMBER,sway:0});const f=a-c-o-e.range(.05,.1),d=yA.map(([w,b])=>new tt(w*s,b*s)),g=new di(d,10);g.translate(0,f,0);const v=I(D.BRONZE,e.range(.9,1.1)),m=f+o*e.range(.42,.62);n.push({geometry:g,color:(w,b)=>b>m?D.PATINA:v,sway:0});const p=new k(.055*s,.12*s,.055*s);p.translate(0,f+o+.05*s,0),n.push({geometry:p,color:I(v,.85),sway:0});const x=new ie(.055*s,0);x.translate(e.around(0,.02),f+.09*s,e.around(0,.02)),n.push({geometry:x,color:D.IRON_DARK,sway:0});const y=pt(n);return y.rotateY(e.range(0,Math.PI*2)),t!==1&&y.scale(t,t,t),xt(y,"bell",0)}},wA=.72;function xA({at:i,size:t,coat:e,extremity:n,rng:s}){const o=[],r=t*1.45,a=new Y(t*.62,t*.78,t*1.5,4);a.rotateX(Math.PI/2),a.rotateZ(Math.PI/4),a.scale(r/(t*1.1),t*1.15/(t*1.1),1),a.translate(i.x,i.y,i.z-t*.15),o.push({geometry:a,color:e,sway:0});const c=t*s.range(.45,1.05),l=i.y-t*.34,h=i.z+t*.6,u=new Y(t*.3,t*.46,c,4);u.rotateX(Math.PI/2),u.rotateZ(Math.PI/4),u.scale(1,.78,1),u.translate(i.x,l,h+c/2),o.push({geometry:u,color:e,sway:0});const f=new k(t*.52,t*.26,c*.8);f.translate(i.x,l-t*.28,h+c*.44),o.push({geometry:f,color:n,sway:0});const d=new k(t*.36,t*.3,t*.22);d.translate(i.x,l+t*.08,h+c+t*.05),o.push({geometry:d,color:2367260,sway:0});const g=new k(r*.82,t*.2,t*.28);g.translate(i.x,i.y+t*.22,h-t*.08),o.push({geometry:g,color:e,sway:0});const v=s.range(.75,1.05);for(const m of[-1,1]){const p=new Qt(t*.34,t*v,3);p.translate(0,t*v/2,0),p.scale(1,1,.34),p.rotateZ(m*s.range(.16,.34)),p.rotateX(-s.range(.05,.22)),p.translate(i.x+m*r*.34,i.y+t*.4,i.z-t*.35),o.push({geometry:p,color:n,sway:0})}return o}const _A={length:[.5,.68],girth:[.19,.24],legLength:[.19,.38],legThickness:.026,feet:"paw",neck:[.15,.21],neckRise:[.6,1],headSize:[.1,.13],headStretch:1,snout:0,ears:"none",head:xA,horns:"none",tail:"carried",woolly:!1,hide:[D.HIDE,D.HIDE_DARK,D.HIDE_PALE,D.STONE_DARK],extremity:D.HIDE_DARK},$g={name:"dog",category:"animals",radius:.55,build:(i={})=>br("dog",_A,gt(i.seed??1),i)},yd="village",Zg=96,dp=Zg/2,MA=[{kind:"basin",at:[0,0],radius:34,depth:3},{kind:"hill",at:[18,-12],radius:12,height:4.5,falloff:1.3},{kind:"hill",at:[20,8],radius:10,height:3.5,falloff:1.4},{kind:"hill",at:[8,20],radius:11,height:3,falloff:1.5},{kind:"terrace",at:[-6,1],radius:26,height:-3,blend:9},{kind:"terrace",at:[0,34],radius:6,height:-.4,blend:7},{kind:"rim",inset:13,height:14}],bA=[{kind:"field",min:[16,-6],max:[30,8],material:"crop"},{kind:"field",min:[-30,14],max:[-16,28],material:"meadow"},{kind:"blot",at:[-24,-6],radius:11,material:"meadow"},{kind:"path",through:[[0,34],[0,22],[0,15]],width:3,material:"dirt"},{kind:"path",through:[[4,2],[14,-2],[24,-2]],width:2.4,material:"dirt"},{kind:"path",through:[[-9,13],[0,8],[9,1]],width:2.2,material:"cobble"},{kind:"path",through:[[-2,17],[0,8],[1,-2]],width:2.2,material:"cobble"},{kind:"path",through:[[7,15],[0,8],[-7,0]],width:2.2,material:"cobble"},{kind:"path",through:[[11,8],[0,8],[-12,6]],width:2.2,material:"cobble"},{kind:"blot",at:[-16,-10],radius:7,material:"mire"}],Ui=new JT({size:Zg,resolution:3,landforms:MA,patches:bA,detail:[{at:[-6,1],radius:26,level:2},{at:[-6,1],radius:20,level:4},{at:[0,34],radius:5,level:3}]}),SA=Ui,rs=new R(0,0,34),Ys={forge:[14.2,5.6],anvil:[13,3.8]},du=[-5.4,19.2],fu=[-8.5,4.5];function xa(i,t){return[i[0],Ui.heightAt(i[0],i[1])+t,i[1]]}const EA={bed:[{model:"wind",id:"wind",options:{gain:.15,tone:3e3}},{model:"rain",id:"rain",options:{gain:.5,intensity:0,surface:"earth",articulation:.3}}],emitters:[{model:"foliage",id:"wood-north",at:[-26,4,-31],options:{density:260,tone:.78,gain:.4,articulation:.2},refDistance:3,maxDistance:24,rolloff:1.6,reverb:.3},{model:"foliage",id:"wood-east",at:[33,4,-9],options:{density:240,tone:.85,gain:.38,articulation:.22},refDistance:3,maxDistance:22,rolloff:1.6,reverb:.3},{model:"foliage",id:"hedge",at:[-11,1,14],options:{density:150,tone:1.5,gain:.24,articulation:.34},refDistance:1.4,maxDistance:13,reverb:.22},{model:"bird",id:"bird-west",at:[-24,6,4],options:{pitch:2500,interval:7,gain:.07,tone:2700},refDistance:5,maxDistance:46,rolloff:1.3,reverb:.9},{model:"bird",id:"bird-south",at:[17,5.5,34],options:{pitch:3100,interval:11,gain:.055,tone:3e3},refDistance:5,maxDistance:44,rolloff:1.35,reverb:.9},{model:"fire",id:"forge",at:xa(Ys.forge,gA),options:{gain:.5,intensity:.85,tone:1.15,crackle:.65,draught:.12},refDistance:2,maxDistance:20,rolloff:1.5,reverb:.35},{model:"friction",id:"gate",at:[rs.x+.9,1.7,rs.z],options:{motion:"weather",speed:.22,force:.85,pitch:150,decay:1.1,bright:.2,roughness:.15,gain:.3},refDistance:3,maxDistance:40,rolloff:1.4,reverb:.5},{model:"crowd",id:"folk",at:[-3,1.4,16],options:{voices:5,density:.4,pitch:132,variety:.55,gain:.36,distance:1450},refDistance:5,maxDistance:30,rolloff:1.5,reverb:.6}],scatter:[{sound:"hammer",id:"smith",at:xa(Ys.anvil,vA),spread:[.7,.2,.7],every:13,force:[.45,1],options:{gain:.5,tone:.95,damping:.35,bounces:2},refDistance:3,maxDistance:52,rolloff:1.1,reverb:.55},{sound:"clatter",id:"yards",at:[0,1,8],spread:[13,.5,11],every:26,force:[.3,.85],options:{material:"wood",gain:.45,tone:1.05},refDistance:2.5,maxDistance:34,rolloff:1.25,reverb:.4},{sound:"animal",id:"cattle",at:[-16,1.1,-10],spread:[4,.2,4],every:44,force:[.5,.9],voices:1,options:{kind:"cow",gain:.55,tone:.97},refDistance:4,maxDistance:48,rolloff:1.1,reverb:.5},{sound:"animal",id:"sheep",at:[-16.5,.9,-11],spread:[5,.2,5],every:27,force:[.4,.85],voices:1,options:{kind:"sheep",gain:.42,tone:1.06},refDistance:3.5,maxDistance:40,rolloff:1.2,reverb:.45},{sound:"animal",id:"fowl",at:[-2,.7,6],spread:[8,.15,8],every:16,force:[.3,.7],voices:1,options:{kind:"fowl",gain:.3,tone:1},refDistance:2.5,maxDistance:26,rolloff:1.35,reverb:.35},{sound:"animal",id:"dog",at:xa(fu,.4),spread:[2.2,.2,2.2],every:36,force:[.45,1],voices:1,options:{kind:"dog",gain:.5,tone:.94},refDistance:4,maxDistance:50,rolloff:1.15,reverb:.55},{sound:"bell",id:"bell",at:xa(du,wA),spread:[0,0,0],every:95,rhythm:"periodic",force:[.8,1],voices:1,options:{hz:186,decay:12,gain:.34,strokes:2,interval:2.6,warble:1.1},refDistance:8,maxDistance:70,rolloff:.9,reverb:1}]};function TA(){return{id:yd,name:"Arkstin Village",environment:{...gs,fogNear:30,fogFar:190,footstepReverb:.5,soundscape:EA},spawn:{position:Kg(0,28),yaw:Math.PI},floor:-20,surfaceAt:(i,t)=>Ui.stepAt(i,t),groundAt:(i,t)=>Ui.heightAt(i,t),build:RA}}function Kg(i,t,e=0){return new R(i,Ui.heightAt(i,t)+e,t)}function Oe(i,t,e,n,s,o=!0){t.position.copy(Kg(e,n)),t.rotation.y=s,i.add(o?Xt(t):t)}function ln(i,t,e){const n=gt(e.seed),[s,o]=e.from??[0,0],r=e.maxSlope??26,a=e.avoid??[],c=t.solid!==!1;for(let l=0;l<e.count;l++){const h=n.range(0,Math.PI*2),u=Math.sqrt(n())*e.within,f=s+Math.cos(h)*u,d=o+Math.sin(h)*u,g=n.range(0,Math.PI*2),v=e.scale?n.range(e.scale[0],e.scale[1]):1,m=n.int(1,1e6);if(Math.abs(f)>dp-8||Math.abs(d)>dp-8||Ui.slopeAt(f,d)>r)continue;const p=Ui.heightAt(f,d);if(e.minHeight!==void 0&&p<e.minHeight||e.maxHeight!==void 0&&p>e.maxHeight)continue;let x=!1;for(const[y,w,b]of a)if(Math.hypot(f-y,d-w)<b){x=!0;break}x||Oe(i,t.build({seed:m,scale:v}),f,d,g,c)}}const Os=[[0,8,17],[0,24,10],[0,33,8],[-16,-10,9]],AA=[[-9,13],[-2,17],[7,15],[11,8],[9,1],[1,-2],[-7,0],[-12,6]],fp=[0,8];function RA(){const i=new he;i.name="ArkstinVillage",i.add(Xt(Ui.build())),Oe(i,qg.build({seed:4714}),rs.x,rs.z,Math.PI),AA.forEach(([t,e],n)=>{Oe(i,tc.build({seed:700+n*131}),t,e,Math.atan2(fp[0]-t,fp[1]-e))});for(let t=0;t<5;t++){const e=t/5*Math.PI*2;Oe(i,kg.build({seed:400+t}),-16+Math.cos(e)*8,-10+Math.sin(e)*8,e)}return Oe(i,Bg.build({seed:91}),-13,-13,.4),ln(i,Hg,{seed:8801,count:2,within:5,from:[-16,-10],maxSlope:20}),ln(i,Gg,{seed:8802,count:4,within:6,from:[-16,-10],maxSlope:20}),ln(i,Wg,{seed:8803,count:2,within:5,from:[-17,-8],maxSlope:20}),ln(i,Xg,{seed:8804,count:6,within:9,from:[-2,6],maxSlope:18}),ln(i,Vg,{seed:8805,count:2,within:6,from:[-24,4],maxSlope:18}),Oe(i,pr.build({seed:2211}),4,11,.3),Oe(i,us.build({seed:2212}),6,12,1.1),Oe(i,Fi.build({seed:2213}),-4,5,0),Oe(i,Fi.build({seed:2214}),-5,6.5,.7),Oe(i,us.build({seed:2215}),9,5,.5),Oe(i,zg.build({seed:2216}),-2,11,0),Oe(i,gd.build({seed:5401}),Ys.forge[0],Ys.forge[1],Math.PI),Oe(i,vd.build({seed:5402}),Ys.anvil[0],Ys.anvil[1],.6),Oe(i,Yg.build({seed:5403}),du[0],du[1],-.5),Oe(i,$g.build({seed:5404}),fu[0],fu[1],1.9,!1),Oe(i,Qs.build({seed:3301}),3,7,2.2),Oe(i,Qs.build({seed:3302}),-3,9,1.1),Oe(i,Qs.build({seed:3303}),6,3,-.8),ln(i,QT,{seed:5001,count:130,within:42,maxSlope:30,maxHeight:9,avoid:Os,scale:[.8,1.35]}),ln(i,tA,{seed:5002,count:90,within:42,maxSlope:32,avoid:Os}),ln(i,Lg,{seed:5002,count:40,within:42,maxSlope:24,avoid:Os}),ln(i,Dg,{seed:5003,count:120,within:42,maxSlope:28,avoid:Os}),ln(i,Ng,{seed:5004,count:40,within:36,maxSlope:22,avoid:Os}),ln(i,Og,{seed:5005,count:16,within:36,maxSlope:24,avoid:Os}),ln(i,Fg,{seed:6001,count:70,within:45,maxSlope:44,minHeight:4,scale:[.7,1.6]}),ln(i,Ug,{seed:6002,count:7,within:38,maxSlope:20,minHeight:5}),i}const Ki=Math.PI*2,CA={name:"oak",category:"foliage",radius:3.4,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(7.3,9.4),o=e.range(.38,.52),r=s*e.range(.2,.27),a=s*e.range(.27,.34),c=s*e.range(.7,.77),l=e.range(0,Ki),h=e.range(.02,.09),u=w=>{const b=w/s,S=h*b**2;return new R(Math.cos(l)*S,w,Math.sin(l)*S)},f=()=>I(D.BARK,e.range(.88,1.12)),d=e.range(.38,.55);n.push({geometry:Bt(new R(0,0,0),u(d*1.08),o*e.range(1.28,1.45),o*1.02,8),color:f(),sway:Ie(0,s,3)});const g=2;for(let w=0;w<g;w++){const b=d+(r-d)*w/g,S=d+(r-d)*(w+1)/g,E=u(b),T=u(S);T.lerp(E,-.06),n.push({geometry:Bt(E,T,o*(1.02-.1*w),o*(1.02-.1*(w+1)),8),color:f(),sway:Ie(0,s,3)})}const v=e.int(4,6),m=e.range(0,Ki);for(let w=0;w<v;w++){const b=u(r*e.range(.6,.95)),S=m+w*2.399963+e.around(0,.4),E=a*e.range(.34,.5),T=new R(b.x+Math.cos(S)*E,b.y+e.range(1,1.8),b.z+Math.sin(S)*E);if(n.push({geometry:Bt(b,T,o*.46,o*.32,6),color:f(),sway:Ie(0,s,2)}),e.chance(.75)){const L=E*e.range(.72,1.02),N=ke(e,e.range(.34,.58),0,.74,1.26);N.scale(1,e.range(.58,.8),1),N.translate(b.x+Math.cos(S)*L,T.y+e.around(.05,.3),b.z+Math.sin(S)*L),n.push({geometry:N,color:e.chance(.6)?D.LEAF_DARK:I(D.LEAF,e.range(.84,.98)),sway:e.range(.5,.7)})}const _=S+e.around(0,.3),M=a*e.range(.48,.64),A=new R(b.x+Math.cos(_)*M,T.y+(c-T.y)*e.range(.42,.6),b.z+Math.sin(_)*M),P=T.clone().lerp(b,.09);if(n.push({geometry:Bt(P,A,o*.35,o*.22,5),color:f(),sway:Ie(0,s,1.6)}),e.chance(.8)){const L=ke(e,e.range(.4,.68),0,.75,1.25);L.scale(1,e.range(.62,.84),1),L.translate(A.x+e.around(0,.22),A.y+e.around(.1,.28),A.z+e.around(0,.22)),n.push({geometry:L,color:e.chance(.45)?D.LEAF_DARK:I(D.LEAF,e.range(.88,1.02)),sway:e.range(.68,.84)})}const C=e.int(2,3);for(let L=0;L<C;L++){const N=_+e.around((L-(C-1)/2)*.6,.22),F=a*e.range(.45,.95),H=Math.sqrt(Math.max(0,1-(F/a)**2))*a*.4,G=new R(b.x+Math.cos(N)*F,c+H+e.around(0,.3),b.z+Math.sin(N)*F);n.push({geometry:Bt(A.clone().lerp(P,.1+L*.1),G,o*(.25+L*.015),o*.13,4),color:I(D.BARK_PALE,e.range(.9,1.1)),sway:Ie(0,s,1.2)});const V=ke(e,e.range(.52,.8),0,.78,1.22);V.scale(1,e.range(.72,.9),1),V.translate(G.x,G.y+e.range(.1,.35),G.z),n.push({geometry:V,color:e.chance(.3)?D.LEAF_DARK:I(D.LEAF,e.range(.92,1.08)),sway:e.range(.82,.95)})}}const p=e.int(15,21);for(let w=0;w<p;w++){const b=e.range(0,Ki),S=a*Math.sqrt(e())*.92,E=Math.sqrt(Math.max(0,1-(S/a)**2)),T=e.range(.55,.92)*(.78+.32*E),_=ke(e,T,0,.76,1.24);_.rotateY(e.range(0,Ki)),_.scale(1,e.range(.82,1),1),_.translate(Math.cos(b)*S,c+E*a*e.range(.42,.7)+e.around(0,.34)+(e.chance(.2)?e.range(.25,.75):0),Math.sin(b)*S),n.push({geometry:_,color:e.chance(.28)?D.LEAF_DARK:e.chance(.15)&&S>a*.6?D.LEAF_DRY:I(D.LEAF,e.range(.9,1.1)),sway:e.range(.85,1)})}const x=e.int(3,6);for(let w=0;w<x;w++){const b=e.range(0,Ki),S=a*e.range(.6,.95),E=ke(e,e.range(.42,.7),0,.74,1.26);E.scale(1,e.range(.6,.8),1),E.translate(Math.cos(b)*S,c-e.range(.35,1),Math.sin(b)*S),n.push({geometry:E,color:e.chance(.55)?D.LEAF_DARK:I(D.LEAF,e.range(.86,1)),sway:e.range(.8,.95)})}const y=pt(n);return y.rotateY(e.range(0,Ki)),t!==1&&y.scale(t,t,t),xt(y,"oak",e.range(0,Ki))}},Bo=Math.PI*2,PA={name:"small-oak",category:"foliage",radius:1.4,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(2.1,3),o=e.range(.055,.085),r=s*e.range(.28,.38),a=e.range(0,Bo),c=e.range(.04,.13),l=p=>{const x=p/s,y=c*x**1.9;return new R(Math.cos(a)*y,p,Math.sin(a)*y)},h=3;for(let p=0;p<h;p++){const x=s*p/h,y=s*(p+1)/h,w=l(x),b=l(y);b.lerp(w,-.07),n.push({geometry:Bt(w,b,o*(1-.22*p),o*(1-.22*(p+1)),6),color:I(D.BARK,e.range(.9,1.12)),sway:Ie(0,s,2.2)})}const u=e.int(5,7),f=e.range(0,Bo),d=e.chance(.25)?D.LEAF_DARK:D.LEAF;for(let p=0;p<u;p++){const x=u>1?p/(u-1):0,y=Math.min(s*.95,r+(s-r)*x*e.range(.85,1)),w=l(y),b=f+p*2.399963+e.around(0,.35),S=e.range(.42,.72)*(1.15-.5*x),E=e.range(.35,.8),T=new R(w.x+Math.cos(b)*Math.cos(E)*S,w.y+Math.sin(E)*S,w.z+Math.sin(b)*Math.cos(E)*S);n.push({geometry:Bt(w,T,o*.4,o*.2,4),color:I(D.BARK_PALE,e.range(.88,1.12)),sway:Ie(0,s,1.4)});const _=S>.55?2:1;for(let M=0;M<_;M++){const A=_===1?1:.55+.45*M,P=ke(e,e.range(.26,.4)*(1.1-.3*x),0,.76,1.24);P.rotateY(e.range(0,Bo)),P.scale(1,e.range(.78,.95),1),P.translate(w.x+(T.x-w.x)*A,w.y+(T.y-w.y)*A+e.range(.02,.1),w.z+(T.z-w.z)*A),n.push({geometry:P,color:e.chance(.3)?D.LEAF_DARK:I(d,e.range(.9,1.1)),sway:e.range(.8,.95)})}}const g=l(s),v=ke(e,e.range(.26,.36),0,.76,1.24);v.scale(1,e.range(.85,1.05),1),v.translate(g.x,g.y+e.range(.02,.12),g.z),n.push({geometry:v,color:I(d,e.range(.94,1.08)),sway:1});const m=pt(n);return m.rotateY(e.range(0,Bo)),t!==1&&m.scale(t,t,t),xt(m,"small-oak",e.range(0,Bo))}},ji=Math.PI*2,Wl=14144195,IA=3814701,DA=4933181,LA={name:"birch",category:"foliage",radius:2.4,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(6,8.2),o=e.range(.13,.19),r=s*e.range(.5,.6),a=e.range(.14,.38),c=e.range(0,ji),l=e.range(.08,.3),h=T=>{const _=T/s,M=l*_**2.4;return new R(Math.cos(c)*M,T,Math.sin(c)*M)},u=T=>{const _=T/s,M=1+.35*Math.max(0,1-T/.55);return o*(1-.72*_)*M},f=[];{let T=a;for(;T<s-.05;){const M=.8-.3*(T/s);if(e.chance(M)){const A=e(),P=A<.32?e.range(.5,1.2):A<.8?e.range(1.2,2.5):e.range(Math.PI,Math.PI*1.25);f.push({y:T,phi:e.range(0,ji),half:P,tone:e.range(.75,1.4)})}T+=e.chance(.45)?e.range(.03,.09):e.range(.12,.5)}}const d=.026,g=(T,_,M)=>{if(_<a){const C=Math.sin(_*90+T*40)*Math.cos(M*55+_*20);return C>-.15?I(DA,.85+(C+1)*.2):I(Wl,.72)}const A=h(_),P=Math.atan2(M-A.z,T-A.x);for(const C of f){if(Math.abs(_-C.y)>d)continue;let L=Math.abs(P-C.phi)%ji;if(L>Math.PI&&(L=ji-L),L<C.half)return I(IA,C.tone)}return I(Wl,.94+Math.sin(_*31+T*17)*.06)},v=14,m=Math.max(24,Math.round(s/.09)),p=new Y(1,1,s,v,m,!1);p.translate(0,s/2,0);{const T=p.getAttribute("position");for(let _=0;_<T.count;_++){const M=Math.min(s,Math.max(0,T.getY(_))),A=h(M),P=u(M);T.setXYZ(_,T.getX(_)*P+A.x,T.getY(_),T.getZ(_)*P+A.z)}p.deleteAttribute("normal")}n.push({geometry:p,color:g,sway:Ie(0,s,2.4)});const x=e.int(8,11),y=e.range(0,ji),w=e.chance(.3)?D.LEAF_DRY:D.LEAF;for(let T=0;T<x;T++){const _=x>1?T/(x-1):0,M=Math.min(s*.985,r+(s-r)*_*e.range(.88,1)),A=h(M),P=y+T*2.399963+e.around(0,.45),C=(.45+.85*(1-_)**1.2)*e.range(.85,1.12),L=e.range(.85,1.2),N=new R(A.x+Math.cos(P)*Math.cos(L)*C,A.y+Math.sin(L)*C,A.z+Math.sin(P)*Math.cos(L)*C);n.push({geometry:Bt(A,N,o*.26,o*.15,4),color:I(Wl,e.range(.72,.86)),sway:Ie(0,s,1.5)});const F=e.chance(.55)?2:1;for(let H=0;H<F;H++){const G=H===0?0:e.chance(.5)?.8:-.8,V=P+e.around(G,.35),et=e.range(-.85,-.35),lt=C*e.range(.6,.95),bt=new R(N.x+Math.cos(V)*Math.cos(et)*lt,N.y+Math.sin(et)*lt,N.z+Math.sin(V)*Math.cos(et)*lt),Dt=H===0?.1:.2,J=N.clone().lerp(A,Dt);n.push({geometry:Bt(J,bt,o*(H===0?.17:.195),o*.07,4),color:I(D.BARK_PALE,e.range(.9,1.1)),sway:.9});const rt=e.int(1,3);for(let K=0;K<rt;K++){const $=(K+1)/rt,ot=e.range(.18,.3)*(1.15-.4*_),mt=ke(e,ot,0,.7,1.3);mt.scale(.85,e.range(1.2,1.5),.85),mt.translate(N.x+(bt.x-N.x)*$,N.y+(bt.y-N.y)*$-$*$*e.range(.08,.2),N.z+(bt.z-N.z)*$),n.push({geometry:mt,color:e.chance(.3)?D.LEAF_DARK:I(w,e.range(.92,1.08)),sway:e.range(.9,1)})}}}const b=h(s),S=e.int(2,3);for(let T=0;T<S;T++){const _=ke(e,e.range(.16,.26),0,.72,1.28);_.scale(.85,e.range(1.15,1.4),.85);const M=y+T*2.399963,A=e.range(.05,.28);_.translate(b.x+Math.cos(M)*A,b.y-e.range(.05,.35),b.z+Math.sin(M)*A),n.push({geometry:_,color:I(w,e.range(.9,1.06)),sway:1})}const E=pt(n);return E.rotateY(e.range(0,ji)),t!==1&&E.scale(t,t,t),xt(E,"birch",e.range(0,ji))}},_a=Math.PI*2,Xl=12761506,NA=6050885,FA={name:"small-birch",category:"foliage",radius:1.3,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(2.2,3.05),o=e.range(.032,.05),r=s*e.range(.5,.62),a=e.range(0,_a),c=e.range(.18,.42),l=b=>{const S=b/s,E=c*S**1.7;return new R(Math.cos(a)*E,b,Math.sin(a)*E)},h=b=>o*(1-.4*(b/s));let u=0,f=0,d=!1,g=0;for(;u<s-.05;){let b,S,E=!1;f>0&&!d?(E=!0,f-=1,g+=1,b=e.range(.03,.075),S=I(NA,e.range(.85,1.2))):f>0?(b=e.range(.04,.09),S=I(Xl,e.range(.86,.98))):(b=e.chance(.3)?e.range(.3,.5):e.range(.11,.26),S=I(Xl,e.range(.92,1.06)),f=g===0&&u>s*.3||u>s*.1&&e.chance(.58)?e.chance(.25)?2:1:0);const T=Math.min(s,u+b),_=l(u),M=l(T),A=Math.max(M.distanceTo(_),1e-6);M.lerp(_,-Math.max(.02,A*.09)/A),n.push({geometry:Bt(_,M,h(u),h(T),5),color:S,sway:Ie(0,s,2)}),d=E,u=T}const v=e.int(3,5),m=e.range(0,_a),p=e.chance(.3)?D.LEAF_DRY:D.LEAF;for(let b=0;b<v;b++){const S=v>1?b/(v-1):0,E=Math.min(s*.97,r+(s-r)*S*e.range(.85,1)),T=l(E),_=m+b*2.399963+e.around(0,.4),M=e.range(.28,.52)*(1.1-.35*S),A=e.range(1,1.3),P=new R(T.x+Math.cos(_)*Math.cos(A)*M,T.y+Math.sin(A)*M,T.z+Math.sin(_)*Math.cos(A)*M);n.push({geometry:Bt(T,P,o*.42,o*.24,4),color:I(Xl,e.range(.78,.9)),sway:Ie(0,s,1.3)});const C=_+e.around(0,.3),L=e.range(-.5,-.1),N=M*e.range(.6,.95),F=new R(P.x+Math.cos(C)*Math.cos(L)*N,P.y+Math.sin(L)*N,P.z+Math.sin(C)*Math.cos(L)*N),H=P.clone().lerp(T,.12);n.push({geometry:Bt(H,F,o*.27,o*.12,4),color:I(D.BARK_PALE,e.range(.9,1.1)),sway:.92});const G=e.int(1,2);for(let V=0;V<G;V++){const et=(V+1)/G,lt=ke(e,e.range(.15,.24),0,.7,1.3);lt.scale(.85,e.range(1.15,1.45),.85),lt.translate(P.x+(F.x-P.x)*et,P.y+(F.y-P.y)*et-et*et*e.range(.03,.09),P.z+(F.z-P.z)*et),n.push({geometry:lt,color:e.chance(.3)?D.LEAF_DARK:I(p,e.range(.92,1.08)),sway:1})}}const x=l(s),y=ke(e,e.range(.18,.27),0,.72,1.28);y.scale(.9,e.range(1.2,1.5),.9),y.translate(x.x,x.y+.04,x.z),n.push({geometry:y,color:I(p,e.range(.94,1.06)),sway:1});const w=pt(n);return w.rotateY(e.range(0,_a)),t!==1&&w.scale(t,t,t),xt(w,"small-birch",e.range(0,_a))}};function jg(i,t){const{y:e,radius:n,droop:s,slots:o,azimuth:r,thickness:a,gaps:c,floor:l}=t,h=[],u=new R,f=new R,d=new R;for(let g=0;g<o;g++){if(i.chance(c))continue;const v=r+(g+i.around(0,.3))/o*Math.PI*2,m=Math.max(.1,n*i.range(.66,1.16)),p=m*s*i.range(.75,1.25),x=Math.cos(v),y=Math.sin(v),w=a*.8,b=i.range(.4,.6),S=i.range(.26,.4),E=i.around(0,.22),T=Math.max(a*1.4,m*i.range(.17,.23)),_=l+T*S;u.set(x*w,e,y*w),f.set(x*(w+m*b),Math.max(_,e-p*i.range(.14,.3)),y*(w+m*b)),d.set(x*(w+m),Math.max(_,e-p),y*(w+m)),h.push(pp(u,f,a,T,S,E)),h.push(pp(f,d,T*.88,Math.max(a*.55,m*.03),S*i.range(.92,1.08),E+i.around(0,.12)))}return h}function pp(i,t,e,n,s,o){const r=t.x-i.x,a=t.y-i.y,c=t.z-i.z,l=Math.hypot(r,c),h=Math.hypot(l,a),u=new Y(n,e,h,4);return u.translate(0,h/2,0),u.scale(1,1,s),u.rotateY(o),u.rotateX(Math.PI/2+Math.atan2(-a,l)),u.rotateY(Math.PI/2-Math.atan2(c,r)),u.translate(i.x,i.y,i.z),u}const UA={name:"spruce",category:"foliage",radius:2.6,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(6.2,8.8),o=s*e.range(.2,.25),r=e.chance(.3)?I(D.LEAF_DARK,.82):D.LEAF_DARK,a=e.range(.16,.24),c=new Y(a*.16,a,s,6);c.translate(0,s/2,0);const l=Ie(0,s,3);n.push({geometry:c,color:D.BARK,sway:(v,m)=>l(v,m)*.5});const h=e.int(12,16),u=s*e.range(.14,.24),f=s*e.range(.94,.98);let d=e.range(0,Math.PI*2);for(let v=0;v<h;v++){const m=v/(h-1),p=m**.8,x=v===0?e.range(.74,.9):1,y=o*(1-m)**.78*e.range(.83,1.17)*x+.14,w=e.range(.34,.55),b=Math.max(4,Math.min(9,Math.round(4.4+y*1.8))),S=Math.max(u+(f-u)*p,y*(w*1.45+.25)+.15),E=jg(e,{y:S,radius:y,droop:w,slots:b,azimuth:d,thickness:Math.min(.1,Math.max(.035,y*.12)),gaps:e.range(.02,.1),floor:.12}),T=I(r,(.76+m*.34)*e.range(.94,1.06));E.forEach((_,M)=>{n.push({geometry:_,color:T,sway:.06+m*m*.4+M%2*.06})}),d+=Math.PI*2/b*e.range(.32,.7)+e.around(0,.22)}const g=pt(n);return g.rotateY(e.range(0,Math.PI*2)),t!==1&&g.scale(t,t,t),xt(g,"spruce",e.range(0,Math.PI*2))}},OA=12862239,mp=9383704,kA=9340792;function Jg(i,t){const e=[],n=t?i.range(1.9,3.1):i.range(4.2,5.8),s=n*i.range(.021,.03),o=n*i.range(.3,.4),r=I(kA,i.range(.9,1.1)),a=i.chance(.35)?D.LEAF_DARK:D.LEAF,c=Ie(0,n,2),l=i.range(0,Math.PI*2),h=i.range(.05,.22),u=m=>{const p=o*h*m**2.2;return new R(Math.cos(l)*p,n*m,Math.sin(l)*p)},f=t?i.range(.42,.55):i.range(.3,.4),d=5;for(let m=0;m<d;m++){const p=f*m/d,x=f*(m+1)/d,y=u(p),w=u(x),b=Math.max(w.distanceTo(y),1e-6);w.lerp(y,-Math.max(.02,b*.1)/b),e.push({geometry:Bt(y,w,s*(1-p*.3),s*(1-x*.3),6),color:I(r,i.range(.92,1.08)),sway:c})}const g=t?i.int(3,4):i.int(5,6),v=i.range(0,Math.PI*2);for(let m=0;m<g;m++){const p=v+m*2.399963+i.around(0,.35),x=u(f*i.range(.62,1)),y=o*i.range(.5,1),w=i.range(.78,.99),b=n*w,S=new R(x.x+Math.cos(p)*y*i.range(.42,.56),x.y+(b-x.y)*i.range(.45,.62),x.z+Math.sin(p)*y*i.range(.42,.56));e.push({geometry:Bt(x,S,s*.55,s*.34,5),color:I(r,i.range(.9,1.06)),sway:c});const E=t?2:i.int(2,3);for(let T=0;T<E;T++){const _=p+i.around((T-(E-1)/2)*.55,.22),M=y*i.range(.62,1),A=Math.min(1,M/Math.max(o,1e-6)),P=new R(x.x+Math.cos(_)*M,S.y+(b-S.y)*Math.sqrt(Math.max(0,1-A*A*.75)),x.z+Math.sin(_)*M),C=S.clone().lerp(x,.1+T*.06);e.push({geometry:Bt(C,P,s*(.3+T*.015),s*.16,4),color:I(r,i.range(.92,1.1)),sway:c});const L=t?2:i.int(2,3);for(let N=0;N<L;N++){const F=i.range(.3,1),H=C.clone().lerp(P,F),G=_+i.around(0,1.1),V=o*i.range(.18,.34),et=new R(H.x+Math.cos(G)*V,H.y+i.range(-.16,.3)*V*2,H.z+Math.sin(G)*V),lt=H.clone().lerp(C,.12);e.push({geometry:Bt(lt,et,s*.24,s*.12,4),color:I(r,i.range(1,1.15)),sway:c});const bt=2;for(let Dt=0;Dt<bt;Dt++){const J=lt.clone().lerp(et,.35+Dt/bt*.65);gp(e,i,J,n,a,G+i.around(0,.8))}if(i.chance(.75)){const Dt=C.clone().lerp(P,i.range(.12,.6));gp(e,i,Dt,n,a,_+i.around(0,1.5))}!t&&F>.55&&i.chance(.38)&&zA(e,i,et,n)}}}return e}function gp(i,t,e,n,s,o){const r=n*t.range(.075,.12),a=t.range(.1,.5),c=new R(Math.cos(o)*Math.cos(a),-Math.sin(a),Math.sin(o)*Math.cos(a)),l=e.clone().addScaledVector(c,r);i.push({geometry:Bt(e,l,n*.004,n*.0025,3),color:I(s,.7),sway:1});const h=2;for(let u=0;u<h;u++){const f=(u+.6)/(h+.4),d=e.clone().lerp(l,f);for(const g of[-1,1]){const v=r*t.range(.3,.46)*(1-f*.25),m=new Qt(v*.34,v*1.9,3);m.translate(0,v*.95,0),m.scale(1,1,t.range(.28,.42)),m.rotateZ(g*t.range(1.1,1.45)),m.rotateY(o+t.around(0,.3));const p=g*.012*r;m.translate(d.x+p,d.y+t.around(0,.004),d.z-p),i.push({geometry:m,color:I(s,t.range(.85,1.12)),sway:1})}}}function zA(i,t,e,n){const s=n*t.range(.028,.045),o=s*t.range(.5,1.1),r=t.int(7,10),a=new R(e.x,e.y-o,e.z);i.push({geometry:Bt(e,a.clone().addScaledVector(new R(0,1,0),s*.3),n*.003,n*.002,3),color:I(mp,.7),sway:1});for(let c=0;c<r;c++){const l=c*2.399963,h=s*Math.sqrt((c+.5)/r),u=s*t.range(.2,.29),f=new ie(u,0);f.scale(t.range(.9,1.1),t.range(.85,1.05),t.range(.9,1.1)),f.translate(a.x+Math.cos(l)*h,a.y+(1-(h/s)**2)*s*.3+t.around(0,u*.4),a.z+Math.sin(l)*h),i.push({geometry:f,color:t.chance(.3)?I(mp,t.range(.9,1.1)):I(OA,t.range(.9,1.12)),sway:1})}}const BA={name:"rowan",category:"foliage",radius:1.8,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=pt(Jg(e,!1));return n.rotateY(e.range(0,Math.PI*2)),t!==1&&n.scale(t,t,t),xt(n,"rowan",e.range(0,Math.PI*2))}},HA={name:"small-rowan",category:"foliage",radius:.9,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=pt(Jg(e,!0));return n.rotateY(e.range(0,Math.PI*2)),t!==1&&n.scale(t,t,t),xt(n,"small-rowan",e.range(0,Math.PI*2))}},GA={name:"small-spruce",category:"foliage",radius:1.1,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(2.1,3.4),o=s*e.range(.19,.24),r=e.chance(.35)?I(D.LEAF_DARK,.86):D.LEAF_DARK,a=e.range(.045,.07),c=new Y(a*.35,a,s,5);c.translate(0,s/2,0);const l=Ie(0,s,2.6);n.push({geometry:c,color:D.BARK,sway:(p,x)=>l(p,x)*.65});const h=s*e.range(.84,.91),u=e.int(6,9),f=e.range(.06,.16);let d=e.range(0,Math.PI*2);for(let p=0;p<u;p++){const x=p/(u-1),y=x**.85,w=o*(1-x*.86)**.85*e.range(.86,1.14)+.07,b=e.range(.24,.42),S=Math.max(4,Math.min(7,Math.round(4.4+w*2.2))),E=Math.max(f+(h-f)*y,w*(b*1.3+.25)+.05),T=jg(e,{y:E,radius:w,droop:b,slots:S,azimuth:d,thickness:Math.min(.06,Math.max(.022,w*.11)),gaps:e.range(.02,.12),floor:.03}),_=I(r,(.8+x*.32)*e.range(.95,1.05));T.forEach((M,A)=>{n.push({geometry:M,color:_,sway:.1+x*x*.5+A%2*.06})}),d+=Math.PI*2/S*e.range(.32,.7)+e.around(0,.22)}const g=(s-h)*e.range(.55,.8),v=new Qt(e.range(.05,.085),g,7);v.translate(0,s-g/2-.03,0),n.push({geometry:v,color:I(r,1.15),sway:.6});const m=pt(n);return m.rotateY(e.range(0,Math.PI*2)),t!==1&&m.scale(t,t,t),xt(m,"small-spruce",e.range(0,Math.PI*2))}},VA=2956342,WA=4864606,vp=9125196,yp=14999234,XA=12893598,qA={name:"elder",category:"foliage",radius:1.15,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(1.08,1.42),o=e.range(.64,.84),r=Ie(0,s,1.3),a=w=>Math.min(1,r(0,w)*1.15),c=e.chance(.6)?D.BARK_PALE:D.BARK,l=e.chance(.45)?D.LEAF:D.LEAF_DARK,h=!e.chance(.12),u=ke(e,e.range(.13,.19),0,.8,1.18);u.scale(1,e.range(.42,.6),1),u.translate(0,e.range(.02,.05),0),n.push({geometry:u,color:I(c,.85),sway:r});const f=e.int(7,9),d=e.range(0,Math.PI*2);for(let w=0;w<f;w++){const b=d+w/f*Math.PI*2+e.around(0,.3),S=b+Math.PI/2,E=s*(w===0?e.range(.92,1):e.range(.58,1)),T=o*e.range(.8,1),_=T*e.around(0,.26),M=e.range(.022,.034),A=new R(Math.sin(b)*e.range(.02,.06),e.range(.03,.07),Math.cos(b)*e.range(.02,.06)),P=F=>{const H=T*F**1.5,G=_*Math.sin(Math.PI*F);return new R(A.x+Math.sin(b)*H+Math.sin(S)*G,A.y+(E-A.y)*(1-(1-F)**1.6),A.z+Math.cos(b)*H+Math.cos(S)*G)},C=[P(0),P(1/3),P(2/3),P(1)];let L=null;for(let F=0;F<3;F++){const H=L?new R().lerpVectors(C[F],L,e.range(.07,.15)):C[F];n.push({geometry:Bt(H,C[F+1],M*(1-F*.22),M*(1-(F+1)*.22),4),color:I(c,e.range(.92,1.08)),sway:r}),L=C[F]}v(P(e.range(.24,.34)),b),v(P(e.range(.55,.66)),b),v(P(e.range(.86,.95)),b);const N=new R().lerpVectors(C[3],C[2],e.range(.08,.2));h?p(N,b):x(N,b)}const g=e.int(3,4);for(let w=0;w<g;w++){const b=d+e.range(0,Math.PI*2),S=s*e.range(.34,.5),E=e.range(1,1.35),T=new R(Math.sin(b)*e.range(.03,.08),e.range(.02,.05),Math.cos(b)*e.range(.03,.08)),_=new R(T.x+Math.sin(b)*Math.cos(E)*S,T.y+Math.sin(E)*S,T.z+Math.cos(b)*Math.cos(E)*S);n.push({geometry:Bt(T,_,e.range(.012,.017),e.range(.006,.009),4),color:I(c,e.range(1,1.12)),sway:r}),v(_,b)}function v(w,b){const S=s*e.range(.19,.27);for(const E of[-1,1]){const T=b+E*e.range(1,1.45),_=e.range(-.42,.04),M=new R(w.x+Math.sin(T)*Math.cos(_)*S,w.y+Math.sin(_)*S,w.z+Math.cos(T)*Math.cos(_)*S),A=new R().lerpVectors(w,M,e.range(.03,.07));n.push({geometry:Bt(A,M,e.range(.0072,.0092),.0035,3),color:I(l,.78),sway:r});const P=2;for(let C=0;C<P;C++){const L=(C+.85)/(P+1.15),N=S*e.range(.36,.46);for(const F of[-1,1]){const H=new R().lerpVectors(w,M,L+e.around(0,.045));n.push({geometry:m(N*e.range(.94,1.08),T+F*e.range(1.05,1.35),_+e.around(0,.22),H),color:I(l,e.range(.86,1.14)),sway:r})}}n.push({geometry:m(S*e.range(.38,.48),T,_,M),color:I(l,e.range(.86,1.14)),sway:r})}}function m(w,b,S,E){const T=new Qt(w*e.range(.28,.36),w,3);return T.translate(0,w*.5,0),T.scale(1,1,e.range(.2,.3)),T.rotateX(Math.PI/2+S),T.rotateY(b),T.translate(E.x,E.y,E.z),T}function p(w,b){const S=s*e.range(.1,.16),E=new R(w.x+Math.sin(b)*S*e.range(.25,.55),w.y-S,w.z+Math.cos(b)*S*e.range(.25,.55));n.push({geometry:Bt(w,E,e.range(.008,.011),e.range(.005,.007),4),color:I(vp,e.range(.9,1.1)),sway:a(E.y)});const T=[E];for(const M of[-1,1]){const A=b+M*e.range(1.6,2.4),P=S*e.range(.38,.62),C=new R().lerpVectors(w,E,e.range(.5,.78)),L=new R(C.x+Math.sin(A)*P,C.y-P*e.range(.35,.75),C.z+Math.cos(A)*P);n.push({geometry:Bt(C,L,e.range(.0032,.0045),.0026,3),color:I(vp,e.range(.85,1.05)),sway:a(L.y)}),T.push(L)}const _=e.int(6,7);for(let M=0;M<_;M++){const A=T[M%T.length],P=M/_*Math.PI*2+e.around(0,.8),C=e.range(.026,.04),L=C*e.range(.5,1.5),N=new R(A.x+Math.sin(P)*L,A.y-e.range(0,C*1.2),A.z+Math.cos(P)*L),F=new Ye(C,0);F.scale(e.range(.85,1.15),e.range(.8,1.05),e.range(.85,1.15)),F.rotateY(e.range(0,Math.PI)),F.rotateX(e.range(0,Math.PI)),F.translate(N.x,N.y,N.z),n.push({geometry:F,color:(H,G)=>G>N.y?WA:VA,sway:a(N.y)})}}function x(w,b){const S=s*e.range(.12,.16),E=new R(w.x+Math.sin(b)*S*e.range(.1,.35),w.y+S*e.range(.18,.38),w.z+Math.cos(b)*S*e.range(.1,.35));n.push({geometry:Bt(w,E,e.range(.009,.012),.007,4),color:I(l,.8),sway:a(E.y)});const T=3;for(let M=0;M<T;M++){const A=M/T*Math.PI*2+e.around(0,.35),P=new R(E.x+Math.sin(A)*S*e.range(.42,.6),E.y+S*e.around(0,.07),E.z+Math.cos(A)*S*e.range(.42,.6)),C=ke(e,S*e.range(.3,.42),0,.82,1.12);C.scale(1,e.range(.34,.46),1),C.translate(P.x,P.y,P.z),n.push({geometry:C,color:(L,N)=>N>P.y?yp:XA,sway:a(P.y)})}const _=ke(e,S*e.range(.34,.44),0,.84,1.1);_.scale(1,e.range(.38,.5),1),_.translate(E.x,E.y+S*e.range(.03,.08),E.z),n.push({geometry:_,color:yp,sway:a(E.y)})}const y=pt(n);return y.rotateY(e.range(0,Math.PI*2)),t!==1&&y.scale(t,t,t),xt(y,"elder",e.range(0,Math.PI*2))}},YA={name:"hazel",category:"foliage",radius:1.2,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(1.08,1.45),o=e.range(.62,.82),r=Ie(0,s,1.9),a=e.chance(.65)?D.BARK_PALE:D.BARK,c=e.chance(.3)?D.LEAF_DARK:D.LEAF,l=ke(e,e.range(.14,.2),0,.76,1.2);l.scale(1,e.range(.45,.62),1),l.translate(0,e.range(.02,.05),0),n.push({geometry:l,color:I(D.BARK,.85),sway:r});const h=e.int(7,10),u=e.range(0,Math.PI*2);for(let g=0;g<h;g++){const v=u+g/h*Math.PI*2+e.around(0,.36),m=s*e.range(.74,1),p=o*e.range(.66,1),x=s*e.range(.026,.04),y=new R(Math.sin(v)*e.range(.02,.08),e.range(.01,.05),Math.cos(v)*e.range(.02,.08)),w=new R(y.x+Math.sin(v)*p,m,y.z+Math.cos(v)*p),b=E=>y.clone().lerp(w,E);n.push({geometry:Bt(y,w,x,x*e.range(.38,.5),5),color:I(a,e.range(.9,1.1)),sway:r});const S=e.int(3,5);for(let E=0;E<S;E++){const T=e.range(.16,.95),_=b(T),M=s*e.range(.1,.18),A=e.range(-.3,.95),P=v+e.around(0,1.5),C=new R(_.x+Math.sin(P)*Math.cos(A)*M,_.y+Math.sin(A)*M,_.z+Math.cos(P)*Math.cos(A)*M);n.push({geometry:Bt(_,C,x*.34,x*.19,3),color:I(a,1.12),sway:r}),f(C)}f(w)}function f(g){const v=e.int(2,3);for(let m=0;m<v;m++){const p=s*e.range(.055,.078),x=new ie(p,0);x.scale(1,1,e.range(.12,.19)),x.rotateX(Math.PI/2+e.around(0,.5)),x.rotateY(e.range(0,Math.PI*2));const y=m/v*Math.PI*2+e.around(0,.6),w=p*e.range(.6,1.35);x.translate(g.x+Math.sin(y)*w,g.y+e.around(0,p*.55),g.z+Math.cos(y)*w),n.push({geometry:x,color:I(c,e.range(.85,1.18)),sway:r})}}const d=pt(n);return d.rotateY(e.range(0,Math.PI*2)),t!==1&&d.scale(t,t,t),xt(d,"hazel",e.range(0,Math.PI*2))}},$A=14263323,ZA=15254609,KA={name:"gorse",category:"foliage",radius:1.2,solid:!0,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(.98,1.5),o=e.range(.62,.9),r=Ie(0,s,1.6),a=[],c=e.int(5,7);for(let g=0;g<c;g++){const v=g===0,m=g/c*Math.PI*2+e.around(0,.55),p=v?0:o*e.range(.16,.44),x=s*(v?e.range(.9,1):e.range(.58,.9)),y=x*e.range(.44,.6);a.push({at:new R(Math.sin(m)*p,y,Math.cos(m)*p),radius:x-y})}for(const g of a){const v=ke(e,g.radius,0,.82,1.14);v.scale(1,e.range(.82,1),1),v.translate(g.at.x,g.at.y,g.at.z),n.push({geometry:v,color:I(D.LEAF_DARK,e.range(.82,1.02)),sway:r})}const l=e.int(38,55);for(let g=0;g<l;g++){const v=a[e.int(0,a.length-1)],m=e.range(-.22,1),p=Math.sqrt(Math.max(0,1-m*m)),x=e.range(0,Math.PI*2),y=new R(Math.sin(x)*p,m,Math.cos(x)*p),w=s*e.range(.035,.075),b=v.at.clone().addScaledVector(y,v.radius*e.range(.5,.78)),S=v.at.clone().addScaledVector(y,v.radius+w);S.y<.06||n.push({geometry:Bt(b,S,s*e.range(.005,.0085),0,3),color:I(5598003,e.range(.85,1.2)),sway:r})}const h=e.int(70,100),u=a.map(g=>g.radius*g.radius),f=u.reduce((g,v)=>g+v,0)||1;for(let g=0;g<a.length;g++){const v=a[g],m=Math.max(3,Math.round(h*u[g]/f));for(let p=0;p<m;p++){const x=1-(p+.5)/m*1.06,y=Math.sqrt(Math.max(0,1-x*x)),w=p*2.399963+e.around(0,.55),b=new R(Math.sin(w)*y,Math.min(1,x+e.around(0,.06)),Math.cos(w)*y),S=v.at.clone().addScaledVector(b,v.radius*e.range(.74,.88));if(S.y<s*.14)continue;const E=s*e.range(.05,.078),T=new ie(E,0);T.scale(e.range(.9,1.25),e.range(.6,.88),e.range(.9,1.25)),T.rotateY(e.range(0,Math.PI)),T.rotateX(e.range(0,Math.PI)),T.translate(S.x,S.y,S.z),n.push({geometry:T,color:e.chance(.45)?ZA:$A,sway:r})}}const d=pt(n);return d.rotateY(e.range(0,Math.PI*2)),t!==1&&d.scale(t,t,t),xt(d,"gorse",e.range(0,Math.PI*2))}},jA={name:"fallen-log",category:"nature",radius:2.2,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(2.4,4.6),o=e.range(.16,.26),r=o*e.range(.6,.8),a=e.chance(.45)?D.BARK_PALE:D.BARK,c=e.range(0,1),l=5334330,h=o*.86,u=new Y(r,o,s,8);u.rotateZ(Math.PI/2),u.rotateX(e.around(0,.12)),u.translate(0,h,0),n.push({geometry:u,color:(v,m)=>m>h+o*.35&&e.chance(0)===!1&&c>.45?l:a,sway:0});const f=new Qt(o*.92,o*1.1,6);f.rotateZ(-Math.PI/2),f.translate(s/2+o*.4,h,0),n.push({geometry:f,color:I(D.TIMBER,.86),sway:0});const d=e.int(2,4);for(let v=0;v<d;v++){const m=e.range(-s*.42,s*.35),p=e.range(.18,.42),x=e.range(.3,Math.PI-.3)*(e.chance(.5)?1:-1),y=new Y(o*.16,o*.26,p,5);y.translate(0,p/2,0),y.rotateX(Math.PI/2-e.range(.4,1.1)),y.rotateY(x),y.translate(m,h+o*.4,0),n.push({geometry:y,color:I(a,.9),sway:0})}if(c>.6){const v=e.int(2,4);for(let m=0;m<v;m++){const p=e.range(-s*.4,s*.4),x=e.chance(.5)?1:-1,y=new Y(e.range(.06,.12),e.range(.03,.06),.025,6);y.rotateZ(x*.5),y.translate(p,h+e.range(0,o*.5),x*o*.85),n.push({geometry:y,color:12430988,sway:0})}}const g=pt(n);return t!==1&&g.scale(t,t,t),xt(g,"fallen-log",0)}},JA={name:"sticks",category:"nature",radius:1,solid:!1,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.int(6,11),o=e.range(.5,.95),r=e.chance(.5)?D.BARK:D.BARK_PALE;for(let c=0;c<s;c++){const l=e.range(.4,1.5),h=e.range(.018,.05),u=e.chance(.1)?e.range(.12,.26):e.range(0,.06),f=e.range(0,Math.PI*2),d=new Y(h*.7,h,l,4);d.rotateZ(Math.PI/2),d.rotateZ(u),d.rotateY(f);const g=e.range(0,.05)+Math.sin(u)*l*.4,v=Math.sqrt(e())*o*(1-g*.5),m=e.range(0,Math.PI*2);d.translate(Math.cos(m)*v,h+g,Math.sin(m)*v),n.push({geometry:d,color:I(r,e.range(.82,1.14)),sway:0})}const a=pt(n);return t!==1&&a.scale(t,t,t),xt(a,"sticks",0)}},QA={name:"bramble",category:"foliage",radius:1.3,solid:!1,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.int(5,8),o=e.range(.85,1.4),r=e.chance(.5)?5917240:7033392,a=e.chance(.5)?D.LEAF_DARK:D.LEAF,c=e.range(0,Math.PI*2);for(let h=0;h<s;h++){const u=c+e.range(-1.5,1.5),f=o*e.range(.65,1.1),d=4,g=f/d,v=e.range(.013,.022);let m=e.range(1,1.35);const p=e.range(0,.09),x=e.range(0,Math.PI*2);let y=Math.cos(x)*p,w=.02,b=Math.sin(x)*p;for(let S=0;S<d;S++){const E=new Y(v*.72,v,g*1.1,4);E.translate(0,g/2,0),E.rotateX(Math.PI/2-m),E.rotateY(u),E.translate(y,w,b);const T=(S/d)**1.4;n.push({geometry:E,color:I(r,e.range(.88,1.1)),sway:T});const _=Math.cos(m)*g,M=y+Math.sin(u)*_,A=w+Math.sin(m)*g,P=b+Math.cos(u)*_;if(A>.05)for(let C=0;C<3;C++){const L=v*e.range(3.6,5.4),N=new Qt(L*.55,L*1.5,3);N.translate(0,L*.75,0),N.scale(1,1,.3),N.rotateZ(e.range(.9,1.4)),N.rotateY(C/3*Math.PI*2+e.range(0,.4)),N.translate(M,A,P),n.push({geometry:N,color:I(a,e.range(.85,1.15)),sway:T})}y=M,w=Math.max(.03,A),b=P,m-=e.range(.4,.7)}}const l=pt(n);return t!==1&&l.scale(t,t,t),xt(l,"bramble",e.range(0,Math.PI*2))}},t3={name:"fern",category:"foliage",radius:.8,solid:!1,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e()**2,o=.3+s*.62,r=Math.max(3,Math.round(4+s*8+e.around(0,1.2))),a=e.chance(.4)?D.LEAF_DARK:D.LEAF;for(let h=0;h<r;h++){const u=h/r*Math.PI*2+e.range(-.22,.22),f=o*e.range(.72,1.15),d=4,g=f/d;let v=e.range(1.1,1.45),m=0,p=e.range(.02,.08),x=0;for(let y=0;y<d;y++){const w=y/d,b=new Y(.006,.009,g*1.1,4);b.translate(0,g/2,0),b.rotateX(Math.PI/2-v),b.rotateY(u),b.translate(m,p,x),n.push({geometry:b,color:I(a,.82),sway:w**1.2});const S=3;for(let T=0;T<S;T++){const _=(T+.5)/S,M=w+_/d,A=f*.2*(1-M*.75);if(A<.012)continue;const P=Math.cos(v)*g*_,C=m+Math.sin(u)*P,L=p+Math.sin(v)*g*_,N=x+Math.cos(u)*P;for(const F of[-1,1]){const H=A*e.range(.88,1.12),G=new Qt(H*.3,H,3);G.translate(0,H*.5,0),G.scale(1,1,.22),G.rotateZ(F*e.range(1.2,1.45)),G.rotateY(u+F*e.range(.1,.35)),G.translate(C,L,N),n.push({geometry:G,color:I(a,e.range(.9,1.14)),sway:M**1.2})}}const E=Math.cos(v)*g;m+=Math.sin(u)*E,p+=Math.sin(v)*g,x+=Math.cos(u)*E,v-=e.range(.3,.5)}}const c=new ie(o*.1,0);c.scale(1,1.5,1),c.translate(0,o*.1,0),n.push({geometry:c,color:I(a,.75),sway:.3});const l=pt(n);return l.rotateY(e.range(0,Math.PI*2)),t!==1&&l.scale(t,t,t),xt(l,"fern",e.range(0,Math.PI*2))}},e3={name:"nettle",category:"foliage",radius:.6,solid:!1,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.int(4,8),o=e.range(.26,.42),r=e.chance(.5)?4612154:4019507;for(let c=0;c<s;c++){const l=e.range(0,Math.PI*2),h=Math.sqrt(e())*o,u=Math.cos(l)*h,f=Math.sin(l)*h,d=e.range(.62,1.05)*(1-h/o*.18),g=e.range(0,.09),v=e.range(0,Math.PI*2),m=e.range(.0055,.0095),p=new Y(m*.7,m,d,4);p.translate(0,d/2,0),p.rotateX(Math.cos(v)*g),p.rotateZ(Math.sin(v)*g),p.translate(u,0,f),n.push({geometry:p,color:I(r,.85),sway:(w,b)=>Math.max(0,b/d)**1.4});const x=2+Math.floor(d*2);for(let w=1;w<=x;w++){const b=w/(x+.6)*d,S=d*e.range(.1,.16)*(1-w/x*.72);for(const E of[-1,1]){const T=S*e.range(.9,1.1),_=new Qt(T*.5,T*1.7,3);_.translate(0,T*.85,0),_.scale(1,1,.3),_.rotateZ(E*e.range(1.15,1.5)),_.rotateY(w*(Math.PI/2)+e.around(0,.2)),_.translate(u,b,f),n.push({geometry:_,color:I(r,e.range(.92,1.12)),sway:Math.max(0,b/d)**1.4})}}const y=e.int(3,5);for(let w=0;w<y;w++){const b=d*e.range(.022,.04),S=new Qt(b*.5,b*1.6,3);S.translate(0,b*.8,0),S.scale(1,1,.3),S.rotateZ(e.range(.25,.6)),S.rotateY(w*2.399963+e.around(0,.4)),S.translate(u,d*(.9+w*.022),f),n.push({geometry:S,color:I(r,e.range(1.1,1.25)),sway:1})}if(e.chance(.6))for(const w of[-1,1]){const b=new Y(e.range(.0035,.0048),e.range(.007,.0092),d*e.range(.14,.19),4);b.translate(0,-d*.08,0),b.rotateZ(w*e.range(.66,.94)),b.translate(u,d*.86,f),n.push({geometry:b,color:11053186,sway:.9})}}const a=pt(n);return a.rotateY(e.range(0,Math.PI*2)),t!==1&&a.scale(t,t,t),xt(a,"nettle",e.range(0,Math.PI*2))}},n3={name:"reeds",category:"foliage",radius:.7,solid:!1,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.int(9,18),o=e.range(.28,.5),r=e.chance(.4)?8223300:6253368,a=e.chance(.5)?4863268:6045994;for(let l=0;l<s;l++){const h=e.range(0,Math.PI*2),u=Math.sqrt(e())*o,f=Math.cos(h)*u,d=Math.sin(h)*u,g=e.range(1.4,2.4)*(1-u/o*.22),v=e.range(0,.14),m=e.range(0,Math.PI*2),p=Math.cos(m)*v,x=Math.sin(m)*v,y=new Y(.008,.013,g,4);y.translate(0,g/2,0),y.rotateX(p),y.rotateZ(x),y.translate(f,0,d),n.push({geometry:y,sway:(_,M)=>Math.max(0,M/g)**1.2,color:I(r,e.range(.88,1.12))}),Ma.set(0,g,0).applyAxisAngle(i3,p).applyAxisAngle(s3,x);const w=e.range(.16,.26),b=[],S=new Y(.024,.028,w,6);S.translate(0,-w/2,0),b.push([S,I(a,e.range(.9,1.1))]);const E=new Qt(.026,w*.46,6);E.translate(0,w*.17,0),b.push([E,I(a,1.15)]);const T=new Y(.004,.007,w*.5,4);T.translate(0,w*.63,0),b.push([T,I(r,.9)]);for(const[_,M]of b)_.rotateX(p),_.rotateZ(x),_.translate(f+Ma.x,Ma.y,d+Ma.z),n.push({geometry:_,color:M,sway:1});if(e.chance(.5)){const _=g*e.range(.3,.5),M=new Qt(.018,_,3);M.translate(0,_/2,0),M.scale(1,1,.28),M.rotateZ(e.range(.25,.6)*(e.chance(.5)?1:-1)),M.rotateY(e.range(0,Math.PI*2)),M.translate(f,g*e.range(.1,.3),d),n.push({geometry:M,color:I(r,.92),sway:.8})}}const c=pt(n);return t!==1&&c.scale(t,t,t),xt(c,"reeds",e.range(0,Math.PI*2))}},i3=new R(1,0,0),s3=new R(0,0,1),Ma=new R,o3={name:"moss",category:"foliage",radius:.55,solid:!1,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.chance(.4)?"cushion":e.chance(.5)?"carpet":"fruiting",o=e.chance(.5)?4678447:3495740,r=e.range(.2,.34),a=s==="cushion"?e.int(3,6):e.int(4,8);for(let l=0;l<a;l++){const h=l===0,u=h?e.range(.16,.26):e.range(.08,.18)*(s==="cushion"?1:1.35),f=h?0:Math.sqrt(e())*r,d=e.range(0,Math.PI*2),g=s==="cushion"?e.range(.34,.46):e.range(.13,.2),v=ke(e,u,1,.86,1.18);v.scale(1,g,1),v.translate(Math.cos(d)*f,u*g*.35,Math.sin(d)*f),n.push({geometry:v,color:I(o,e.range(.86,1.16)),sway:0})}if(s==="fruiting"){const l=e.int(14,26),h=e.chance(.5)?9075274:7167802;for(let u=0;u<l;u++){const f=e.range(0,Math.PI*2),d=Math.sqrt(e())*r*.9,g=Math.cos(f)*d,v=Math.sin(f)*d,m=e.range(.045,.1),p=e.range(0,.3),x=e.range(0,Math.PI*2),y=new Y(.0018,.0028,m,4);y.translate(0,m/2,0),y.rotateX(Math.cos(x)*p),y.rotateZ(Math.sin(x)*p),y.translate(g,.02,v),n.push({geometry:y,color:I(h,.9),sway:.7});const w=new Y(.006,.0045,m*.3,5);w.rotateX(Math.cos(x)*p*1.6),w.rotateZ(Math.sin(x)*p*1.6),w.translate(g+Math.sin(Math.sin(x)*p)*-m,.02+m*Math.cos(p),v+Math.sin(Math.cos(x)*p)*m),n.push({geometry:w,color:I(h,1.2),sway:1})}}const c=pt(n);return t!==1&&c.scale(t,t,t),xt(c,"moss",e.range(0,Math.PI*2))}},r3={name:"pinecone",category:"nature",radius:.4,solid:!1,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.int(3,7),o=e.range(.16,.3);for(let a=0;a<s;a++){const c=e.range(0,Math.PI*2),l=Math.sqrt(e())*o,h=Math.cos(c)*l,u=Math.sin(c)*l,f=e.range(.11,.18),d=f*e.range(.36,.46),g=I(e.chance(.5)?D.BARK:7031340,e.range(.85,1.15)),v=e.range(.9,1.35),m=e.range(0,Math.PI*2),p=S=>{S.rotateX(v),S.rotateY(m),S.translate(h,d*.55,u)},x=new Y(d*.18,d*.5,f*.82,6);p(x),n.push({geometry:x,color:I(g,.8),sway:0});const y=new Qt(d*.2,f*.3,6);y.translate(0,f*.55,0),p(y),n.push({geometry:y,color:I(g,.75),sway:0});const w=4,b=5;for(let S=0;S<w;S++){const E=-f*.34+S/(w-1)*f*.66,T=1-Math.abs(S/(w-1)-.35)*.9;for(let _=0;_<b;_++){const M=_/b*Math.PI*2+S*.62,A=new k(d*.42,d*.16,d*.34);A.rotateX(-.5),A.translate(0,0,d*.5*T),A.rotateY(M),A.translate(0,E,0),p(A),n.push({geometry:A,color:I(g,e.range(.95,1.2)),sway:0})}}}const r=pt(n);return t!==1&&r.scale(t,t,t),xt(r,"pinecone",0)}},a3=4874292,c3=6124608,l3=D.LEAF;function h3(i,t,e,{scale:n=1}){const s=[],o=e.int(t.count[0],t.count[1]),r=e.pick(t.petal),a=e.range(0,Math.PI*2);for(let l=0;l<o;l++){const h=e.range(0,Math.PI*2),u=Math.sqrt(e())*t.spread,f=Math.cos(h)*u,d=Math.sin(h)*u,g=1-u/t.spread*e.range(.1,.35),v=e.range(t.height[0],t.height[1])*g,m=e.range(0,.22),p=e.range(0,Math.PI*2),x=Math.cos(p)*m,y=Math.sin(p)*m,w=new Y(t.stemThickness*.7,t.stemThickness,v,4);w.translate(0,v/2,0),w.rotateX(x),w.rotateZ(y),w.translate(f,0,d),s.push({geometry:w,color:e.chance(.4)?c3:a3,sway:(F,H)=>Math.max(0,H/v)**1.4});for(let F=0;F<t.leaves;F++){const H=v*(.2+F/Math.max(1,t.leaves)*.45);Sa.set(0,H,0).applyAxisAngle(ql,x).applyAxisAngle(Yl,y);for(const G of[-1,1]){const V=v*e.range(.16,.28),et=new Qt(V*.3,V,3);et.translate(0,V/2,0),et.scale(1,1,.35),et.rotateZ(G*e.range(1,1.35)),et.rotateY(e.range(0,Math.PI*2)),et.translate(f+Sa.x,Sa.y,d+Sa.z),s.push({geometry:et,color:l3,sway:()=>Math.max(0,H/v)**1.4})}}ba.set(0,v,0).applyAxisAngle(ql,x).applyAxisAngle(Yl,y);const b=f+ba.x,S=ba.y,E=d+ba.z,T=1;if(t.head){s.push(...t.head({axis:F=>new R(0,v*F,0).applyAxisAngle(ql,x).applyAxisAngle(Yl,y).add(new R(f,0,d)),height:v,rng:e}));continue}const _=e.range(t.headSize[0],t.headSize[1])*g,M=e.chance(t.nod)?e.range(.5,1.1):e.range(0,.18),A=e.range(-Math.PI,Math.PI),P=t.facing===void 0?A:a+A/Math.PI*t.facing,C=F=>{F.rotateX(Math.cos(P)*M),F.rotateZ(Math.sin(P)*M),F.translate(b,S,E)},L=new Y(_,_*.9,_*.5,8);C(L),s.push({geometry:L,color:t.centre,sway:T});const N=_*t.reach;for(let F=0;F<t.petals;F++){const H=F/t.petals*Math.PI*2+e.range(-.12,.12),G=N*e.range(.88,1.12),V=new Qt(G*t.petalWidth*e.range(.9,1.1),G,3);V.translate(0,N/2,0),V.scale(1,1,.28),V.rotateX(Math.PI/2-e.range(t.cup[0],t.cup[1])),V.rotateY(H),V.translate(0,_*.12,0),C(V),s.push({geometry:V,color:r,sway:T})}}const c=pt(s);return c.rotateY(e.range(0,Math.PI*2)),n!==1&&c.scale(n,n,n),xt(c,i,e.range(0,Math.PI*2))}function fi(i,t,e){return{name:i,category:"foliage",radius:e,solid:!1,build:(n={})=>h3(i,t,gt(n.seed??1),n)}}const ql=new R(1,0,0),Yl=new R(0,0,1),ba=new R,Sa=new R,wp=[{petals:5,reach:2.1,width:.62,cup:[.5,.95],size:[.026,.042],petal:[15255624,14465074,14996042],centre:11045420,nod:.1},{petals:14,reach:2.3,width:.18,cup:[.05,.3],size:[.028,.046],petal:[15789280,15262932,16050360],centre:14202944,nod:.1},{petals:12,reach:1.15,width:.42,cup:[.35,.8],size:[.03,.05],petal:[11576528,10259648,12891356],centre:7298966,nod:.15},{petals:5,reach:1.7,width:.5,cup:[.15,.45],size:[.024,.04],petal:[14183060,13128834,14715560],centre:15786192,nod:.12},{petals:4,reach:2.4,width:.55,cup:[0,.2],size:[.016,.028],petal:[8363992,7048392,10138848],centre:15790304,nod:.05},{petals:8,reach:2.6,width:.24,cup:[.6,1.1],size:[.022,.036],petal:[14717034,13925464,15247488],centre:9194028,nod:.6}];function u3({axis:i,rng:t}){const e=[],n=wp[t.int(0,wp.length-1)],s=i(1),o=t.range(n.size[0],n.size[1]),r=t.pick(n.petal),a=t.chance(n.nod)?t.range(.5,1.1):t.range(0,.18),c=t.range(0,Math.PI*2),l=f=>{f.rotateX(Math.cos(c)*a),f.rotateZ(Math.sin(c)*a),f.translate(s.x,s.y,s.z)},h=new Y(o,o*.9,o*.5,8);l(h),e.push({geometry:h,color:n.centre,sway:1});const u=o*n.reach;for(let f=0;f<n.petals;f++){const d=f/n.petals*Math.PI*2+t.range(-.12,.12),g=u*t.range(.88,1.12),v=new Qt(g*n.width*t.range(.9,1.1),g,3);v.translate(0,g/2,0),v.scale(1,1,.28),v.rotateX(Math.PI/2-t.range(n.cup[0],n.cup[1])),v.rotateY(d),v.translate(0,o*.12,0),l(v),e.push({geometry:v,color:r,sway:1})}return e}const d3=fi("wildflower",{height:[.14,.62],stemThickness:.0085,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[14209252],centre:14205024,count:[14,26],spread:.6,leaves:1,nod:0,head:u3},.75);function f3({axis:i,height:t,rng:e}){const n=[],s=e.int(4,6),o=e.range(0,Math.PI*2),r=e.range(.5,.62),c=e.chance(.06)?15789800:5926837;for(let l=0;l<s;l++){const h=s===1?0:l/(s-1),u=r+(1-r)*h,f=i(u),d=h*h*t*.3,g=t*.12*(1-h*.3),v=o+e.range(-.22,.22),m=g*.9+d,p=new R(f.x+Math.sin(v)*m,f.y-d*.5,f.z+Math.cos(v)*m);n.push({geometry:Bt(f,p,.0035,.0025),color:6124608,sway:u});const x=new Y(g*.3,g*.62,g*1.4,6);x.translate(0,-g*.7,0),x.rotateZ(e.around(0,.16)),x.translate(p.x,p.y,p.z),n.push({geometry:x,color:c,sway:u})}return n}const p3=fi("bluebell",{height:[.35,.62],stemThickness:.008,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[5926837],centre:5926837,count:[9,16],spread:.5,leaves:0,nod:0,head:f3},.65);function m3({axis:i,height:t,rng:e}){const n=[],s=i(1),o=e.int(6,11),r=t*e.range(.1,.16),a=s.y+r*e.range(.5,.8);for(let c=0;c<o;c++){const l=c/o*Math.PI*2+e.range(-.2,.2),h=r*e.range(.5,1.15),u=new R(s.x+Math.cos(l)*h,a,s.z+Math.sin(l)*h);n.push({geometry:Bt(s,u,.0028,.0018),color:6978116,sway:1});const f=new ie(r*e.range(.16,.26),0);if(f.scale(1,.32,1),f.translate(u.x,u.y,u.z),n.push({geometry:f,color:16250348,sway:1}),e.chance(.55)){const d=new ie(r*.1,0);d.scale(1,.3,1),d.translate(u.x+e.around(0,.008),u.y+.004,u.z+e.around(0,.008)),n.push({geometry:d,color:14210720,sway:1})}}return n}const g3=fi("cowparsley",{height:[.55,1.15],stemThickness:.009,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[16250348],centre:14210720,count:[5,12],spread:.5,leaves:2,nod:0,head:m3},.7),Qg=11555727,t1=13070244,v3=9256307,xp=8211058;function y3({axis:i,height:t,rng:e}){const n=[],s=e.int(11,16),o=e.range(0,Math.PI*2),r=e.range(.4,.5);for(let c=0;c<s;c++){const l=c/(s-1),h=r+(1-r)*l,u=i(h),f=o+e.range(-.38,.38),d=t*.09*(1-l*.55),g=Math.min(1,Math.max(0,1.35-l*1.8)),v={x:Math.sin(f),z:Math.cos(f)},m=d*.12,p=u.x+v.x*m,x=u.z+v.z*m,y=d*(.8+g*.9),w=d*(.2+g*.28),b=.28+g*.42,S=f-Math.PI/2,E=new Y(d*.22,w,y,7);E.translate(0,-y/2,0),E.rotateZ(b),E.rotateY(S),E.translate(p,u.y,x),n.push({geometry:E,color:(_,M)=>M>u.y-y*.45?t1:Qg,sway:h});const T=new Y(w*(g>.3?1.22:.4),w*(g>.3?1.05:.15),d*.26,7);T.translate(0,-y-d*.06,0),T.rotateZ(b),T.rotateY(S),T.translate(p,u.y,x),n.push({geometry:T,color:g>.3?v3:xp,sway:h})}const a=i(1);for(let c=0;c<3;c++){const l=new ie(t*.014*(1-c*.22),0);l.scale(.75,1.5,.75),l.translate(a.x+Math.sin(o)*t*.01,a.y-c*t*.02,a.z+Math.cos(o)*t*.01),n.push({geometry:l,color:xp,sway:1})}return n}const w3=fi("foxglove",{height:[1,1.8],stemThickness:.014,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[Qg],centre:t1,count:[1,4],spread:.3,leaves:2,nod:0,head:y3},.6);function x3({axis:i,height:t,rng:e}){const n=[],s=e.range(.62,.72),o=e.int(4,7),r=e.chance(.5)?8154022:9140920;for(let a=0;a<o;a++){const c=s+(1-s)*(a+.4)/o,l=i(c),h=(c-s)/(1-s),u=t*.028*(1-h**2.6*.42);for(let d=0;d<4;d++){const g=d/4*Math.PI*2+a*.7,v=new ie(u,0);v.scale(.8,1.15,.8),v.translate(l.x+Math.cos(g)*u*.85,l.y,l.z+Math.sin(g)*u*.85),n.push({geometry:v,color:r,sway:c})}const f=new Y(u*.5,u*.6,u*.8,5);f.translate(l.x,l.y-u*.9,l.z),n.push({geometry:f,color:9149051,sway:c})}return n}const _3=fi("lavender",{height:[.5,.95],stemThickness:.007,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[8154022],centre:9149051,count:[16,30],spread:.26,leaves:1,nod:0,head:x3},.5);function M3({axis:i,height:t,rng:e}){const n=[],s=e.int(4,7);for(let d=0;d<s;d++){const g=.1+d/(s-1)*.78,v=i(g),m=t*e.range(.2,.34)*(1-g*.55),p=e.range(0,Math.PI*2)+d*1.9;for(const x of[-1,1]){const y=m*e.range(.85,1.05),w=new R(v.x+Math.sin(p)*y*x,v.y-y*e.range(.25,.5),v.z+Math.cos(p)*y*x);n.push({geometry:Bt(v,w,.008,.003),color:6781258,sway:g});const b=e.int(3,5);for(let S=0;S<b;S++){const E=(S+.6)/(b+.4),T=new R().lerpVectors(v,w,E),_=m*.3*(1-Math.abs(E-.4)*.9);for(const M of[-1,1]){const A=new Qt(_*e.range(.3,.42),_*1.4,3);A.translate(0,_*.7,0),A.scale(1,1,.28),A.rotateZ(M*e.range(1.05,1.4)),A.rotateY(p*x+M*e.range(.2,.5)),A.translate(T.x,T.y,T.z),n.push({geometry:A,color:e.chance(.25)?9149034:6257210,sway:g})}}}}const o=i(1),r=t*e.range(.055,.085),a=new ie(r*.72,1);a.scale(.86,1.25,.86),a.translate(o.x,o.y+r*.85,o.z),n.push({geometry:a,color:6257210,sway:1});const c=9;for(let d=0;d<c;d++){const g=d/c*Math.PI*2+e.around(0,.2),v=r*e.range(.5,.8),m=new Qt(r*e.range(.07,.1),v,3);m.translate(0,v*.45,0),m.scale(1,1,.4),m.rotateZ(e.range(1.7,2.1)),m.rotateY(g),m.translate(o.x,o.y+r*1.35,o.z),n.push({geometry:m,color:7046978,sway:1})}const l=18;for(let d=0;d<l;d++){const g=d/l*Math.PI*2+e.around(0,.15),v=e.range(.35,.85),m=r*e.range(.8,1.3),p=new Qt(r*e.range(.035,.055),m,3);p.translate(0,m*.42,0),p.scale(1,1,.55),p.rotateZ(Math.PI/2-v*.8),p.rotateY(g),p.translate(o.x,o.y+r*e.range(.55,1),o.z),n.push({geometry:p,color:5335343,sway:1})}const h=e.int(26,38),u=o.y+r*1.5;for(let d=0;d<h;d++){const g=e.range(0,Math.PI*2),v=Math.sqrt(e()),m=v*.95,p=r*e.range(.75,1.15)*(1-v*.2),x=new Qt(r*e.range(.035,.055),p,3);x.translate(0,p*.5-p*e.range(.1,.3),0),x.rotateZ(m),x.rotateY(g),x.translate(o.x+Math.sin(g)*r*.22*v,u,o.z+Math.cos(g)*r*.22*v),n.push({geometry:x,color:(y,w)=>w>u+p*.35?14711496:11029654,sway:1})}const f=new ie(r*.34,0);return f.scale(1,.6,1),f.translate(o.x,u,o.z),n.push({geometry:f,color:9322366,sway:1}),n}const b3=fi("thistle",{height:[.42,.9],stemThickness:.012,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[14711496],centre:11029654,count:[1,4],spread:.35,leaves:0,nod:0,head:M3},.55),S3=fi("daisy",{height:[.16,.36],stemThickness:.009,headSize:[.034,.05],petals:12,reach:1.9,petalWidth:.24,cup:[.05,.3],petal:[15921124,15263450,15786726],centre:15254346,count:[14,26],spread:.42,leaves:0,nod:0},.45),E3=fi("poppy",{height:[.42,.75],stemThickness:.011,headSize:[.032,.05],petals:5,reach:2.2,petalWidth:.62,cup:[.55,.95],petal:[12071978,12861484,11021364],centre:2761500,count:[4,9],spread:.5,leaves:1,nod:.25},.55),T3=fi("sunflower",{height:[1.1,1.9],stemThickness:.022,headSize:[.1,.16],petals:16,reach:1.5,petalWidth:.3,cup:[.15,.5],petal:[15250746,14460460,15713106],centre:5981226,count:[3,7],spread:.4,leaves:2,nod:.85,facing:.6},.75),A3="gallery-foliage",R3=[CA,PA,LA,FA,UA,GA,BA,HA,qA,YA,KA,QA,Og,jA,JA,n3,e3,t3,Lg,Dg,Ng,o3,r3,Fg,Ug,w3,b3,T3,g3,_3,E3,p3,S3,d3],e1={id:A3,name:"Countryside Forest Clutter",builders:R3},C3="gallery-animal",P3=[Qs,Hg,Gg,Vg,Wg,Xg,$g],n1={id:C3,name:"Countryside Village Life",builders:P3},i1=8,I3=1.4,pu=tg,wd=16,_p=new Re({color:3813928,flatShading:!0}),D3=new Re({color:12168594,flatShading:!0}),L3=new Re({color:2827808,flatShading:!0});function N3(i,t,e){let n=2166136261;for(let h=0;h<i.length;h++)n=Math.imul(n^i.charCodeAt(h),16777619);const s=gt(n>>>0),o=[],r=t*.1,a=t-r*2,c=2+(s.chance(.45)?1:0),l=e/(c+.9);for(let h=0;h<c;h++){const u=e/2-l*(h+.95),f=h===c-1?s.range(.4,.8):s.range(.82,1);let d=-a/2;const g=-a/2+a*f;for(;d<g;){const v=Math.min(s.range(a*.08,a*.26),g-d);if(v<a*.04)break;const m=new $t(new k(v,l*s.range(.3,.42),.008),L3);m.position.set(d+v/2,u,0),o.push(m),d+=v+a*s.range(.045,.09)}}return o}function hi(i,t){const e=new he;e.name=`sign:${i}`;const n=ri.eyeHeight*.68,s=new $t(new k(.09,n,.09),_p);s.position.y=n/2,e.add(s);const o=.62,r=.26,a=new he;a.position.set(0,n-.1,.045),a.rotation.x=-.16;const c=new $t(new k(o,r,.05),D3);a.add(c);for(const h of N3(i,o,r))h.position.z+=.026,a.add(h);e.add(a);const l=new $t(new k(.13,.05,.13),_p);return l.position.y=n+.02,e.add(l),HE(e,t??F3(i))}function F3(i){return i.split("-").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}function s1(i){const t=[];let e=0;for(let n=0;n<i.length;n++){t.push(e);const s=i[n+1];s&&(e+=i[n].radius+s.radius+I3)}return{offsets:t,width:e}}function U3(i){const t=new he;t.name="rows";const{offsets:e,width:n}=s1(i),s=-n/2;for(let o=0;o<i.length;o++){const r=i[o],a=s+e[o],c=new he;c.name=`row:${r.name}`;const l=hi(r.name,r.display);l.position.set(a,0,pu),c.add(l);for(let h=0;h<i1;h++){const u=r.build({seed:1e3+h*7919});u.position.set(a,0,-h*pu),c.add(r.solid===!1?u:Xt(u))}t.add(c)}return t}function $l(i){const{width:t}=s1(i),e=Math.max(t,wd+i1*pu)+40;return Math.min(200,Math.max(120,Math.ceil(e/20)*20))}function Mp(i){return i*.46}function O3(i){return{zone:i.id,position:new R(0,0,wd),yaw:Math.PI,material:i.door??"timber",seed:3300+k3(i.id)}}function k3(i){let t=0;for(let e=0;e<i.length;e++)t=(t*31+i.charCodeAt(e))%7919;return t}function z3(i){return{id:i.id,name:i.name,environment:{...gs,fogNear:Mp($l(i.builders))*.45,fogFar:Mp($l(i.builders)),ambientGround:12563096,surface:"stone",room:"open",soundscape:i.soundscape??id},spawn:{position:new R(0,.1,wd-2),yaw:0},fogVolumes:i.fogVolumes,floor:-20,groundAt:()=>0,build(){const t=new he;t.add(_c($l(i.builders))),t.add(U3(i.builders));for(const e of i.extras?.()??[])t.add(e);return t}}}function Si(i,t){return{id:`portal:${i.id}`,a:t,b:O3(i)}}const eo=6,bp=1.3,B3=2.6,H3={A:{w:4,strokes:[[0,0,2,6,4,0],[.7,2,3.3,2]]},B:{w:4,strokes:[[0,0,0,6],[0,6,2.8,6,4,5,4,3.8,2.8,3,0,3],[2.8,3,4,2.2,4,1,2.8,0,0,0]]},C:{w:4,strokes:[[4,5,3,6,1,6,0,5,0,1,1,0,3,0,4,1]]},D:{w:4,strokes:[[0,0,0,6,2.4,6,4,4.4,4,1.6,2.4,0,0,0]]},E:{w:4,strokes:[[4,6,0,6,0,0,4,0],[0,3,2.8,3]]},F:{w:4,strokes:[[4,6,0,6,0,0],[0,3,2.8,3]]},G:{w:4,strokes:[[4,5,3,6,1,6,0,5,0,1,1,0,3,0,4,1,4,2.6,2.2,2.6]]},H:{w:4,strokes:[[0,0,0,6],[4,0,4,6],[0,3,4,3]]},I:{w:2,strokes:[[0,6,2,6],[1,6,1,0],[0,0,2,0]]},J:{w:4,strokes:[[4,6,4,1,3,0,1,0,0,1]]},K:{w:4,strokes:[[0,0,0,6],[4,6,0,2.6],[1.5,3.6,4,0]]},L:{w:4,strokes:[[0,6,0,0,4,0]]},M:{w:4,strokes:[[0,0,0,6,2,2.6,4,6,4,0]]},N:{w:4,strokes:[[0,0,0,6,4,0,4,6]]},O:{w:4,strokes:[[1,0,0,1,0,5,1,6,3,6,4,5,4,1,3,0,1,0]]},P:{w:4,strokes:[[0,0,0,6,2.8,6,4,5,4,3.6,2.8,2.8,0,2.8]]},Q:{w:4,strokes:[[1,0,0,1,0,5,1,6,3,6,4,5,4,1,3,0,1,0],[2.4,1.6,4.4,-.4]]},R:{w:4,strokes:[[0,0,0,6,2.8,6,4,5,4,3.6,2.8,2.8,0,2.8],[2,2.8,4,0]]},S:{w:4,strokes:[[4,5,3,6,1,6,0,5,0,4.2,1,3.4,3,3,4,2.2,4,1,3,0,1,0,0,1]]},T:{w:4,strokes:[[0,6,4,6],[2,6,2,0]]},U:{w:4,strokes:[[0,6,0,1,1,0,3,0,4,1,4,6]]},V:{w:4,strokes:[[0,6,2,0,4,6]]},W:{w:4,strokes:[[0,6,1,0,2,3.4,3,0,4,6]]},X:{w:4,strokes:[[0,0,4,6],[0,6,4,0]]},Y:{w:4,strokes:[[0,6,2,3.2,4,6],[2,3.2,2,0]]},Z:{w:4,strokes:[[0,6,4,6,0,0,4,0]]},0:{w:4,strokes:[[1,0,0,1,0,5,1,6,3,6,4,5,4,1,3,0,1,0],[1,1.2,3,4.8]]},1:{w:4,strokes:[[.8,4.8,2,6,2,0],[.8,0,3.2,0]]},2:{w:4,strokes:[[0,5,1,6,3,6,4,5,4,3.8,0,0,4,0]]},3:{w:4,strokes:[[0,5,1,6,3,6,4,5,4,4,3,3.2,1.6,3.2],[3,3.2,4,2.4,4,1,3,0,1,0,0,1]]},4:{w:4,strokes:[[3,0,3,6,0,2,4,2]]},5:{w:4,strokes:[[4,6,0,6,0,3.4,2.8,3.4,4,2.4,4,1,3,0,1,0,0,1]]},6:{w:4,strokes:[[4,5,3,6,1,6,0,5,0,1,1,0,3,0,4,1,4,2,3,3,0,3]]},7:{w:4,strokes:[[0,6,4,6,1.6,0]]},8:{w:4,strokes:[[1,3.2,.4,4,.4,5,1.4,6,2.6,6,3.6,5,3.6,4,3,3.2,1,3.2],[1,3.2,0,2.4,0,1,1,0,3,0,4,1,4,2.4,3,3.2]]},9:{w:4,strokes:[[0,1,1,0,3,0,4,1,4,5,3,6,1,6,0,5,0,4,1,3,4,3]]},".":{w:1,strokes:[[.5,0]]},",":{w:1,strokes:[[.7,.6,.2,-.9]]},":":{w:1,strokes:[[.5,4],[.5,1]]},";":{w:1,strokes:[[.5,4],[.7,.6,.2,-.9]]},"!":{w:1,strokes:[[.5,6,.5,2],[.5,0]]},"?":{w:4,strokes:[[0,5,1,6,3,6,4,5,4,3.8,2,2.6,2,1.8],[2,0]]},"'":{w:.8,strokes:[[.4,6,.4,4.6]]},'"':{w:1.8,strokes:[[.4,6,.4,4.6],[1.4,6,1.4,4.6]]},"-":{w:2.6,strokes:[[0,2.8,2.6,2.8]]},"+":{w:2.6,strokes:[[0,2.8,2.6,2.8],[1.3,1.5,1.3,4.1]]},"/":{w:3,strokes:[[0,0,3,6]]},"(":{w:1.4,strokes:[[1.4,6.5,0,4.5,0,1.5,1.4,-.5]]},")":{w:1.4,strokes:[[0,6.5,1.4,4.5,1.4,1.5,0,-.5]]},"&":{w:4.4,strokes:[[4.4,0,1,3.6,.6,4.4,.6,5.2,1.4,6,2.2,6,3,5.2,3,4.4,0,1.8,0,1,1,0,2.6,0,4.4,1.8]]}},G3={w:4,strokes:[[0,0,4,0,4,6,0,6,0,0]]};function V3(i,t,e,n){const s=i.toUpperCase().split(`
`),o=t*eo,r=s.map(h=>{const u=[];for(const d of h)if(d===" ")u.push({glyph:null,advance:B3+n});else{const g=H3[d]??G3;u.push({glyph:g,advance:g.w+n+bp})}const f=u.reduce((d,g)=>d+g.advance,0)-(u.length?bp:0);return{glyphs:u,width:Math.max(f,0)}}),a=Math.max(...r.map(h=>h.width),1),c=eo+(s.length-1)*o,l=[];for(let h=0;h<r.length;h++){const u=c/2-eo-h*o;let f=e==="center"?-r[h].width/2:-a/2;for(const{glyph:d,advance:g}of r[h].glyphs)d&&l.push({glyph:d,x:f+n/2,y:u}),f+=g}return{placed:l,unitWidth:a,unitHeight:c}}function Tc(i,t={}){const{weight:e=.16,slant:n=0,depth:s=.55,lineHeight:o=1.5,align:r="center",fitWidth:a}=t,c=e*eo,{placed:l,unitWidth:h,unitHeight:u}=V3(i,o,r,c);if(l.length===0)throw new Error("lettering: nothing to draw");let f=(t.capHeight??.15)/eo;a!==void 0&&(f=Math.min(f,a/h));const d=f*eo,g=e*d,v=Math.max(s*g,.004),m=[],p=(S,E,T,_)=>{const M=new k(S,g,v);E!==0&&M.rotateZ(E),M.translate(T,_,0),m.push(M)},x=g/2/Math.cos(Math.PI/8),y=new Set,w=(S,E,T=x)=>{const _=`${Math.round(S*8192)},${Math.round(E*8192)}`;if(y.has(_))return;y.add(_);const M=new Y(T,T,v,8,1,!1,Math.PI/8);M.rotateX(Math.PI/2),M.translate(S,E,0),m.push(M)};for(const{glyph:S,x:E,y:T}of l)for(const _ of S.strokes){if(_.length===2){w((E+_[0]+n*_[1])*f,(T+_[1])*f,g*.75);continue}for(let M=0;M+3<_.length;M+=2){const A=(E+_[M]+n*_[M+1])*f,P=(T+_[M+1])*f,C=(E+_[M+2]+n*_[M+3])*f,L=(T+_[M+3])*f;w(A,P),w(C,L);const N=Math.hypot(C-A,L-P);N<1e-6||p(N,Math.atan2(L-P,C-A),(A+C)/2,(P+L)/2)}}const b=Nm(m,!1);for(const S of m)S.dispose();if(!b)throw new Error("lettering: merge failed");return{geometry:b,width:h*f,height:u*f,capHeight:d}}function Sp(i,t=D.INK,e={}){const{geometry:n}=Tc(i,e),s=xt(pt([{geometry:n,color:t,sway:0}]),"lettering",0);return s.userData.noCollide=!0,s}const o1={name:"signboard",category:"structures",radius:1,build({seed:i=1,scale:t=1,text:e="SIGNBOARD"}={}){const n=gt(i),s=[],o=n.range(1.9,2.2),r=n.range(1.3,1.7),a=n.range(.5,.64),c=.05,l=o-.08,h=I(D.TIMBER_DARK,n.range(.9,1.05)),u=b=>{const S=new k(.1,o,.1);S.translate(b,o/2,0),s.push({geometry:S,color:h,sway:0});const E=new k(.15,.05,.15);E.translate(b,o+.02,0),s.push({geometry:E,color:I(h,.9),sway:0})};u(-(r/2+.09)),u(r/2+.09);const f=n.int(3,4),d=a/f,g=l-a/2;for(let b=0;b<f;b++){const S=new k(r,d-.006,c);S.translate(0,l-d*(b+.5),0),s.push({geometry:S,color:I(D.TIMBER_PALE,n.range(.92,1.08)),sway:0})}for(const b of[l+.02,l-a-.02]){const S=new k(r+.34,.07,c*1.5);S.translate(0,b,0),s.push({geometry:S,color:h,sway:0})}const v=pt(s);t!==1&&v.scale(t,t,t);const m=xt(v,"signboard",0),p=e.split(`
`).length,x=Tc(e,{capHeight:a*.72/(1+(p-1)*1.5),fitWidth:r*.86,weight:.18,depth:.4});x.geometry.translate(0,g,c/2+.008);const y=pt([{geometry:x.geometry,color:D.INK,sway:0}]);t!==1&&y.scale(t,t,t);const w=xt(y,"signboard",0);return w.userData.noCollide=!0,m.add(w),m}},r1={name:"banner",category:"structures",radius:1.6,build({seed:i=1,scale:t=1,text:e="BANNER"}={}){const n=gt(i),s=[],o=n.range(2.6,3),r=n.range(2.4,2.9),a=r-.22,c=n.range(.6,.78),l=o-.12,h=(y,w)=>{const b=1-Math.min(Math.abs(y)/(a/2),1),S=Math.min(Math.max((l-w)/c,0),1);return b*(.25+.75*S)},u=I(D.TIMBER_DARK,n.range(.88,1.02));for(const y of[-1,1]){const w=new Y(.035,.05,o,8);w.translate(y*(r/2),o/2,0),s.push({geometry:w,color:u,sway:0});const b=new Qt(.055,.09,8);b.translate(y*(r/2),o+.04,0),s.push({geometry:b,color:I(u,.9),sway:0})}const f=new Y(.012,.012,r,6);f.rotateZ(Math.PI/2),f.translate(0,l+.01,0),s.push({geometry:f,color:I(D.TIMBER_PALE,.85),sway:0});const d=new k(a,c,.02,10,5,1);d.translate(0,l-c/2,0),s.push({geometry:d,color:I(D.CLOTH,n.range(.94,1.06)),sway:(y,w)=>h(y,w)});const g=pt(s);t!==1&&g.scale(t,t,t);const v=xt(g,"banner",0),m=Tc(e,{capHeight:c*.52,fitWidth:a*.86,weight:.22,depth:.5});m.geometry.translate(0,l-c/2,.02);const p=pt([{geometry:m.geometry,color:D.INK,sway:(y,w)=>h(y,w)}]);t!==1&&p.scale(t,t,t);const x=xt(p,"banner",0);return x.userData.noCollide=!0,v.add(x),v}},W3="text-showcase",X3=[o1,r1];function Sr(i,t){const e=xt(pt(t),"text-station-ink",0);if(e.userData.noCollide=!0,i.length===0)return e;const n=new he;return n.add(xt(pt(i),"text-station",0)),n.add(e),n}function as(i,t,e,n,s,o=D.INK){const r=Tc(i,t);return r.geometry.translate(e,n,s),{geometry:r.geometry,color:o,sway:0}}function xd(i,t,e){const n=[],s=e+.1;for(const r of[-1,1]){const a=new k(.11,s,.11);a.translate(r*(i/2+.1),s/2,-.05),n.push({geometry:a,color:D.TIMBER_DARK,sway:0})}const o=new k(i,t,.05);return o.translate(0,e-t/2,0),n.push({geometry:o,color:D.TIMBER_PALE,sway:0}),n}const rc=.05/2+.008;function q3(){const i=[[.5,"50"],[.34,"34"],[.24,"24 CM"],[.16,"16 THE FOX"],[.11,"11 QUICK BROWN FOX"],[.075,"7 PACK MY BOX WITH JUGS"],[.05,"5 THE FIVE BOXING WIZARDS JUMP"]],t=2.85,e=[];let n=t-.18;for(const[s,o]of i)n-=s/2,e.push(as(o,{capHeight:s,fitWidth:2.26,depth:.4},0,n,rc)),n-=s/2+.12;return Sr(xd(2.5,2.6,t),e)}function Y3(){const i=[[.07,"HAIRLINE"],[.11,"LIGHT"],[.16,"REGULAR"],[.24,"BOLD"],[.34,"BLACK"]],t=[];return i.forEach(([e,n],s)=>{t.push(as(n,{capHeight:.26,weight:e,depth:.8},0,2.3-s*.42,0))}),Sr([],t)}function $3(){const i=[[0,"UPRIGHT"],[.12,"OBLIQUE"],[.21,"ITALIC"],[.35,"SWEPT"]],t=[];return i.forEach(([e,n],s)=>{t.push(as(n,{capHeight:.26,slant:e,depth:.8},0,2.1-s*.42,0))}),Sr([],t)}function Z3(){const t=[as("PAINTED",{capHeight:.24,fitWidth:1.5,depth:.15},0,1.68,rc),as("RAISED",{capHeight:.24,fitWidth:1.5,depth:1},0,1.26,rc),as("FREE",{capHeight:.32,weight:.2,depth:2.2},1.75,1.5,0)];return Sr(xd(1.7,1,2),t)}function K3(){const t=[as(`ABCDEFGHIJKLM
NOPQRSTUVWXYZ
0123456789
.,:;!?'"()/-+&`,{capHeight:.26,fitWidth:2.26,depth:.4,lineHeight:1.6},0,1.75,rc)];return Sr(xd(2.5,1.7,2.6),t)}const a1={id:W3,name:"Text Showcase",builders:X3,extras(){const i=[],t=(l,h,u,f)=>{l.position.set(u,0,f),i.push(l);const d=hi(h);d.position.set(u,0,f+2.5),i.push(d)};t(Xt(q3()),"sizes",-10,2),t(Y3(),"weights",-10,-8),t($3(),"slant",-10,-18),t(Xt(Z3()),"forms",10,2);const e=Sp(`FLOATING TEXT
NO BOARD BEHIND IT
READ AGAINST THE FOG`,D.INK,{capHeight:.22,weight:.18,depth:1.2});e.position.y=2.1,t(e,"floating-text",10,-8),t(Xt(K3()),"character-set",10,-18);const n=hi("reading-range");n.position.set(20,0,6),i.push(n);const s=[[1,"FIVE METRES"],[-9,"FIFTEEN METRES"],[-19,"TWENTY FIVE METRES"]];for(const[l,h]of s){const u=Sp(h,D.INK,{capHeight:.35,depth:.8});u.position.set(20,1.5,l),i.push(u)}const o={seed:4101,text:`ANY TEXT
ON ANY SIGN`},r=o1.build(o);r.position.set(-4.5,0,6),i.push(Xt(r));const a={seed:4102,text:"WORDS AT RANGE"},c=r1.build(a);return c.position.set(4.5,0,6),i.push(Xt(c)),i}},j3="fog-showcase",J3=new Re({color:9143671,flatShading:!0}),Ep=-6,Tp=-26,Ap=-18;function li(i,t,e,n,s,o){const r=new $t(new k(i,t,e),J3);return r.position.set(n,s+t/2,o),r.castShadow=!0,r.receiveShadow=!0,r}function Q3(){const i=new he;return i.add(li(.9,.35,.9,0,0,0)),i.add(li(.62,4.2,.62,0,.35,0)),i.add(li(.9,.3,.9,0,4.55,0)),i}function t5(){const i=new he;return i.add(li(14,7,5,-6,0,0)),i.add(li(12,5,5,5,0,-1.5)),i.add(li(9,3.2,4.5,14,0,.5)),i}function e5(){const i=new he;return i.add(li(2.4,.4,2.4,0,0,0)),i.add(li(1.5,5.4,1.5,0,.4,0)),i.add(li(1.9,.45,1.9,0,5.8,0)),i}const c1={id:j3,name:"Fog Showcase",builders:[],fogVolumes:[{shape:"ellipsoid",center:new R(-9,-1.2,Ep),size:new R(9,3.4,9),density:.55,tint:"#b9c6cc",softness:.75,noiseScale:5,turbulence:.65,drift:new tt(.05,.03)},{shape:"box",center:new R(4,4.5,Tp),size:new R(26,5,7),density:.3,tint:"#ccd6e0",softness:.85,noiseScale:14,turbulence:.55},{shape:"ellipsoid",center:new R(12,8.5,Ap),size:new R(2.4,6,2.4),density:.5,tint:"#d8d2c6",softness:.9,noiseScale:3,turbulence:.85}],extras(){const i=[],t=(e,n,s,o)=>{e.position.set(s,0,o),i.push(Xt(e));const r=hi(n);r.position.set(s,0,o+3),i.push(r)};return t(Q3(),"mist-pool",-6,Ep),t(e5(),"plume",12,Ap),t(t5(),"cloud-bank",4,Tp),i}},n5=[...hu.timber,...hu.plank];function i5(i={}){const{seed:t=1,scale:e=1}=i,n=gt(t),s=[],o=n.pick(n5),r=I(o.leaf,n.range(.94,1.06)),a=n.range(.95,1.25),c=n.range(.85,1.1),l=n.range(.08,.11),h=n.range(.09,.12);for(const w of[-1,1]){const b=new k(a+l*2,h,l);b.translate(0,h/2,w*(c/2+l/2)),s.push({geometry:b,color:o.frame,sway:0});const S=new k(l,h,c+l);S.translate(w*(a/2+l/2),h/2,0),s.push({geometry:S,color:o.frame,sway:0})}const u=h-.02,f=.05,d=new k(a,.015,c);d.translate(0,u-f-.01,0),s.push({geometry:d,color:1316378,sway:0});const g=n.int(4,6),v=c/g;for(let w=0;w<g;w++){const b=new k(a*n.range(.985,1),f*n.range(.88,1),v*.94);b.translate(0,u-f/2,-c/2+v*(w+.5)),s.push({geometry:b,color:I(r,n.range(.95,1.05)),sway:0})}const m=n.chance(.5)?-1:1,p=c*n.range(.5,.7);for(const w of[-a*.3,a*.3]){const b=new k(.055,.02,p);b.translate(w,u+.01,m*(c/2-p/2)),s.push({geometry:b,color:o.iron,sway:0});const S=new k(.07,.045,.06);S.translate(w,h-.01,m*(c/2+l/2)),s.push({geometry:S,color:o.iron,sway:0})}const x=-m*c*.34;if(n.chance(.55)){const w=new k(.2,.045,.045);w.translate(0,u+.045,x),s.push({geometry:w,color:o.iron,sway:0});for(const b of[-.09,.09]){const S=new k(.05,.05,.05);S.translate(b,u+.015,x),s.push({geometry:S,color:o.iron,sway:0})}}else{const w=new k(.06,.018,.22);w.translate(0,u+.012,x),s.push({geometry:w,color:o.iron,sway:0});const b=new k(.045,.05,.045);b.translate(0,u+.02,x-m*.13),s.push({geometry:b,color:o.iron,sway:0});const S=new k(.06,.075,.03);S.translate(0,u+.02,x-m*.17),s.push({geometry:S,color:I(o.iron,.8),sway:0})}const y=pt(s);return e!==1&&y.scale(e,e,e),xt(y,"hut-trapdoor",0)}const s5={name:"hut-trapdoor",display:"Wood Trapdoor",category:"structures",radius:.8,build:i5};function o5(i={}){const{seed:t=1,scale:e=1}=i,n=gt(t),s=[],o=n.chance(.35)?n.range(.5,.85):n.range(.08,.3),r=n.range(.95,1.3),a=n.range(.85,1.15),c=n.range(.07,.09),l=n.range(.07,.1),h=I(D.IRON,n.range(.9,1.05)),u=I(D.IRON_DARK,n.range(.9,1.05)),f=T=>Fm(D.RUST,T,D.IRON),d=[],g=XM(d,.13),v=(T,_)=>{const M=Math.max(Math.abs(T)/(r/2),Math.abs(_)/(a/2));return Math.min(o*(.1+.24*M*M)+o*.45*g(T,_),.85)},m=(T,_,M,A)=>{const P=new k(T,l,_);P.translate(M,l/2,A),s.push({geometry:P,color:u,sway:0,wear:o*.35,wearTint:f(u)})};for(const T of[-1,1])m(r+c*2,c,0,T*(a/2+c/2)),m(c,a+c*1.3,T*(r/2+c/2),0);const p=l-.015,x=.035,y=new k(r,x,a,9,1,9);if(y.translate(0,p-x/2,0),s.push({geometry:y,color:h,sway:0,wear:(T,_,M)=>v(T,M),wearTint:f(h)}),n.chance(.6))for(let M=0;M<4;M++)for(let A=0;A<4;A++){const P=-r*.36+r*.72*M/3,C=-a*.36+a*.72*A/3,L=new k(.045,.012,.045);L.translate(P,p+.006,C),s.push({geometry:L,color:I(h,.86),sway:0,wear:o*.3,wearTint:f(I(h,.86))}),d.push([P,C])}else for(const T of[-r*.22,r*.22]){const _=new k(.05,.014,a*.86);_.translate(T,p+.007,0),s.push({geometry:_,color:I(h,.86),sway:0,wear:o*.3,wearTint:f(I(h,.86))}),d.push([T,-a*.4],[T,a*.4])}const w=n.chance(.5)?-1:1;for(const T of[-r*.28,r*.28]){const _=new Y(.024,.024,.14,6);_.rotateZ(Math.PI/2),_.translate(T,p,w*(a/2+c*.35)),s.push({geometry:_,color:I(u,.9),sway:0,wear:o*.3,wearTint:f(I(u,.9))}),d.push([T,w*(a/2-.04)])}const b=-w*a*.32;for(const T of[-.08,.08]){const _=new k(.03,.045,.03);_.translate(T,p+.018,b),s.push({geometry:_,color:I(h,.8),sway:0,wear:o*.25,wearTint:f(I(h,.8))}),d.push([T,b])}const S=new Y(.015,.015,.19,6);S.rotateZ(Math.PI/2),S.translate(0,p+.042,b),s.push({geometry:S,color:I(h,1.12),sway:0});const E=pt(s);return e!==1&&E.scale(e,e,e),xt(E,"factory-trapdoor",0)}const r5={name:"factory-trapdoor",display:"Metal Trapdoor",category:"structures",radius:.8,build:o5},a5=22,c5=12,l5=16767392,Rp=Math.SQRT2,h5={name:"streetlamp",category:"structures",radius:.9,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=[],o=e.range(2.9,3.6),r=e.range(.046,.062),a=e.range(.34,.5),c=e.chance(.35)?D.RUST:D.IRON,l=e.chance(.5)?D.STONE:D.STONE_DARK,h=r*6.2,u=new k(h,.15,h);u.translate(0,.075,0),n.push({geometry:u,color:I(l,e.around(1,.06)),sway:0});const f=new k(r*4.2,.12,r*4.2);f.translate(0,.2,0),n.push({geometry:f,color:I(c,1.05),sway:0});const d=.24,g=e.int(3,4),v=(o-d)/g;for(let ft=0;ft<g;ft++){const st=1-.28*(ft/g),yt=r*2*st,wt=new k(yt,v*1.06,yt);wt.translate(0,d+v*(ft+.5),0),n.push({geometry:wt,color:I(c,e.around(1,.07)),sway:0})}const m=r*2*(1-.28*(g-1)/g),p=m*.78,x=o-p*.62,y=new k(a+p,p,p);y.translate(a/2,x,0),n.push({geometry:y,color:I(c,.94),sway:0});const w=r*.5,b=x-e.range(.36,.5),S=a*.72,E=x-p*.5,T=S-w,_=E-b,M=Math.hypot(T,_)*1.18,A=new k(r*1.05,M,r*1.05);A.translate(0,M*.41,0),A.rotateZ(-Math.atan2(T,_)),A.translate(w,b,0),n.push({geometry:A,color:I(c,.88),sway:0});const P=new k(m*1.9,.07,m*1.9);if(P.translate(0,o-.02,0),n.push({geometry:P,color:I(c,1.1),sway:0}),e.chance(.5)){const ft=new Qt(m*.6,.16,4);ft.rotateY(Math.PI/4),ft.translate(0,o+.07,0),n.push({geometry:ft,color:I(c,1),sway:0})}const C=a,L=x-p/2,N=e.range(.05,.1),F=new k(r*.8,N*1.6,r*.8);F.translate(C,L-N*.5,0),n.push({geometry:F,color:I(c,.86),sway:0});const H=e.range(.115,.145),G=e.range(.26,.34),V=L-N,et=.13,lt=new Y(H*.45*Rp,H*1.28*Rp,et,4);lt.rotateY(Math.PI/4),lt.translate(C,V-et/2+.01,0),n.push({geometry:lt,color:I(c,1.02),sway:0});const bt=r*.75;for(const ft of[-1,1])for(const st of[-1,1]){const yt=new k(bt,G*1.1,bt);yt.translate(C+ft*(H-bt*.5),V-et-G/2+.02,st*(H-bt*.5)),n.push({geometry:yt,color:I(c,.9),sway:0})}const Dt=V-et-G,J=r*.9,rt=H*2.2;for(const ft of[0,1])for(const st of[-1,1]){const yt=ft===0,wt=new k(yt?rt:J,.06,yt?J:rt-J*1.8),Gt=rt/2-J/2;wt.translate(C+(yt?0:st*Gt),Dt-.01,yt?st*Gt:0),n.push({geometry:wt,color:I(c,.8),sway:0})}const K=Dt+G*.5,$=new Ye(H*.5,0);$.scale(1,1.6,1),$.translate(C,K,0),s.push({geometry:$,color:D.LAMPLIGHT,sway:0});const ot=pt(n),mt=pt(s),Mt=e.range(0,Math.PI*2);ot.rotateY(Mt),mt.rotateY(Mt),t!==1&&(ot.scale(t,t,t),mt.scale(t,t,t));const Ut=xt(ot,"streetlamp",0);Ut.add(Nn(mt,"streetlamp:glow"));const nt=Math.cos(Mt)*C*t,ht=-Math.sin(Mt)*C*t,B=new ms(l5,a5*e.around(1,.12)*t*t,c5*t,2);return B.position.set(nt,K*t,ht),B.castShadow=!1,Ut.add(B),Ut}},u5={name:"cistern",category:"objects",radius:.75,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(.5,.68),o=e.range(.09,.13),r=s-o,a=e.range(.44,.62),c=e.range(.1,.15),l=I(D.STONE,e.range(.9,1.08)),h=new Y(s*.99,s*1.02,c,10);h.translate(0,c/2,0),n.push({geometry:h,color:I(l,.92),sway:0});const u=[new tt(s,c*.5),new tt(s*.96,a),new tt(r,a),new tt(r*.97,c*.5),new tt(s,c*.5)],f=new di(u,10);n.push({geometry:f,color:(m,p)=>p>a*.9?I(l,1.18):l,sway:0});const d=c+(a-c)*e.range(.3,.55),g=new Y(r*.97,r*.97,.02,10);if(g.translate(0,d,0),n.push({geometry:g,color:D.WATER,sway:0}),e.chance(.55)){const m=new Y(s*1.28,s*1.34,.07,10);m.translate(0,.03,0),n.push({geometry:m,color:I(D.STONE_DARK,e.range(.94,1.06)),sway:0})}if(e.chance(.45)){const m=e.range(.14,.22),p=a*e.range(.72,.9);for(const y of[-1,1]){const w=new k(.05,.09,m);w.translate(y*.055,p,s*.86+m/2),n.push({geometry:w,color:I(l,.92),sway:0})}const x=new k(.16,.035,m);x.translate(0,p-.05,s*.86+m/2),n.push({geometry:x,color:I(l,.86),sway:0})}const v=pt(n);return v.rotateY(e.range(0,Math.PI*2)),t!==1&&v.scale(t,t,t),xt(v,"cistern",0)}},l1={name:"hopper",category:"structures",radius:1.3,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(.45,1.1),o=s*e.range(.14,.26),r=s*e.range(1.1,1.9),a=s*e.range(.25,.6),c=e.range(1.1,2.6),l=s*.05,h=I(7173499,e.range(.88,1.08)),u=I(D.IRON,e.range(.85,1.05)),f=e.chance(.45),d=c,g=c+r,v=g+a,m=[new tt(o,d),new tt(s,g),new tt(s,v),new tt(s-l,v),new tt(s-l,g),new tt(o-l*.6,d),new tt(o,d)],p=new di(m,6);n.push({geometry:p,color:f?(_,M)=>M<g?I(D.RUST,.9):h:h,sway:0});const x=new Y(s*1.06,s*1.06,l*2.4,6);x.translate(0,v-l,0),n.push({geometry:x,color:I(u,1.05),sway:0});const y=new Y(o*1.28,o*1.28,c*.45,6);y.translate(0,d-c*.18,0),n.push({geometry:y,color:I(u,.95),sway:0});const w=new k(o*2.4,o*.9,o*.28);w.rotateY(e.range(0,Math.PI)),w.translate(0,d-c*.34,0),n.push({geometry:w,color:I(D.RUST,1.08),sway:0});const b=4,S=s*1.05,E=g+a*.25;for(let _=0;_<b;_++){const M=_/b*Math.PI*2+Math.PI/4,A=new R(Math.sin(M)*S,0,Math.cos(M)*S),P=new R(Math.sin(M)*s*.88,E,Math.cos(M)*s*.88);n.push({geometry:Bt(A,P,.05,.042),color:u,sway:0});const C=new k(.18,.05,.18);C.translate(A.x,.025,A.z),n.push({geometry:C,color:I(u,.84),sway:0})}for(let _=0;_<b;_++){const M=_/b*Math.PI*2+Math.PI/4,A=(_+1)/b*Math.PI*2+Math.PI/4,P=C=>new R(Math.sin(C)*(S+s*.88)*.5,E*.45,Math.cos(C)*(S+s*.88)*.5);n.push({geometry:Bt(P(M),P(A),.032,.03),color:I(u,.88),sway:0})}const T=pt(n);return t!==1&&T.scale(t,t,t),xt(T,"hopper",0)}},h1={name:"ladder",category:"structures",radius:.4,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(2.4,4.6),o=e.range(.36,.48),r=e.range(.02,.028),a=.3,c=Math.floor(s/a),l=e.chance(.45),h=I(l?D.TIMBER:D.IRON,e.range(.85,1.05)),u=l?I(D.TIMBER_DARK,e.range(.9,1.1)):I(D.IRON,e.range(1,1.15));for(const d of[-1,1]){const g=new k(r*(l?2:1.5),s,r*(l?2.2:3));g.translate(d*o/2,s/2,0),n.push({geometry:g,color:h,sway:0})}for(let d=0;d<c;d++){const g=l?new k(o*1.02,r*1.5,r*1.5):new Y(r*.72,r*.72,o*1.02,6);l||g.rotateZ(Math.PI/2),g.translate(0,a*(d+.6),0),n.push({geometry:g,color:u,sway:0})}const f=pt(n);return t!==1&&f.scale(t,t,t),xt(f,"ladder",0)}},d5={name:"panel",category:"structures",radius:.9,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(1,1.5),o=e.range(.85,1.15),r=e.range(.35,.6),a=e.range(.18,.26),c=I(D.IRON,e.range(.85,1.05)),l=e.chance(.5)?3093304:3814192,h=10124348,u=new k(s*.94,r,a*1.15);u.translate(0,r/2,0),n.push({geometry:u,color:I(c,.8),sway:0});const f=e.range(.1,.2),d=new k(s,o,a*.5);d.rotateX(-f),d.translate(0,r+o/2,a*.16),n.push({geometry:d,color:l,sway:0});for(const[E,T,_]of[[s*1.06,.06,r],[s*1.06,.06,r+o]]){const M=new k(E,T,a*.62);M.rotateX(-f),M.translate(0,_,a*.16+(_>r+.1?-o*f*.5:o*f*.5)),n.push({geometry:M,color:c,sway:0})}const g=e.int(3,5),v=e.int(2,3),m=s*.84/g,p=o*.78/v,x=r+o/2,y=a*.16,w=a*.25,b=(E,T)=>{const _=-s*.42+m*(E+.5),M=o*.4-p*(T+.5)+p*.5;return new R(_,x+M*Math.cos(f)+w*Math.sin(f),y-M*Math.sin(f)+w*Math.cos(f))};for(let E=0;E<v;E++)for(let T=0;T<g;T++){const _=b(T,E),M=E===0,A=e(),P=M?A<.6?"gauge":A<.8?"lamp":"dial":A<.4?"lever":A<.65?"knife":A<.85?"button":"dial";if(P==="gauge"){const C=Math.min(m,p)*.36,L=new Y(C,C,a*.3,10);L.rotateX(Math.PI/2-f),L.translate(_.x,_.y,_.z),n.push({geometry:L,color:h,sway:0});const N=new Y(C*.76,C*.76,a*.34,10);N.rotateX(Math.PI/2-f),N.translate(_.x,_.y,_.z+a*.04),n.push({geometry:N,color:14209726,sway:0});const F=e.range(-1.1,1.1),H=new k(C*.09,C*1.25,a*.12);H.translate(0,C*.5,0),H.rotateZ(F),H.rotateX(-f),H.translate(_.x,_.y,_.z+a*.1),n.push({geometry:H,color:2367260,sway:0})}else if(P==="lamp"){const C=Math.min(m,p)*.18,L=new Y(C*1.5,C*1.5,a*.26,8);L.rotateX(Math.PI/2-f),L.translate(_.x,_.y,_.z),n.push({geometry:L,color:I(c,.9),sway:0});const N=new Qt(C*1.15,C*1.5,8);N.rotateX(Math.PI/2-f),N.translate(_.x,_.y,_.z+a*.14),n.push({geometry:N,color:e.chance(.5)?12075052:10135610,sway:0})}else if(P==="dial"){const C=Math.min(m,p)*.22,L=new Y(C,C,a*.4,8);L.rotateX(Math.PI/2-f),L.translate(_.x,_.y,_.z+a*.08),n.push({geometry:L,color:I(c,1.18),sway:0});const N=new k(C*.24,C*1.5,a*.16);N.translate(0,C*.7,0),N.rotateZ(e.range(-2.4,2.4)),N.rotateX(-f),N.translate(_.x,_.y,_.z+a*.22),n.push({geometry:N,color:h,sway:0})}else if(P==="button")for(let C=0;C<3;C++){const L=Math.min(m,p)*.11,N=_.x+(C-1)*m*.26,F=new Y(L,L*1.2,a*.34,8);F.rotateX(Math.PI/2-f),F.translate(N,_.y,_.z+a*.06),n.push({geometry:F,color:C===0?10135610:C===2?12075052:I(c,1.2),sway:0})}else if(P==="knife"){const C=m*.34;for(const F of[-1,1]){const H=new k(C*.34,p*.16,a*.34);H.rotateX(-f),H.translate(_.x+F*C,_.y-p*.12,_.z+a*.06),n.push({geometry:H,color:h,sway:0})}const L=e.chance(.5),N=new k(C*2.2,p*.1,a*.16);N.rotateZ(L?0:e.range(.6,1)),N.rotateX(-f),N.translate(_.x,_.y-p*(L?.12:-.05),_.z+a*.14),n.push({geometry:N,color:I(h,1.15),sway:0})}else{const C=p*e.range(.55,.85),L=e.range(-.9,.9),N=new Y(.013,.018,C,5);N.translate(0,C/2,0),N.rotateZ(L),N.rotateX(-f-.85),N.translate(_.x,_.y-p*.2,_.z+a*.06),n.push({geometry:N,color:I(c,1.15),sway:0});const F=new ie(.03,0);F.translate(_.x+Math.sin(L)*-C,_.y-p*.2+Math.cos(L)*C*.66,_.z+a*.06+C*.7),n.push({geometry:F,color:e.chance(.5)?D.RUST:h,sway:0})}}const S=pt(n);return t!==1&&S.scale(t,t,t),xt(S,"panel",0)}},f5={name:"stair",category:"structures",radius:2.2,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(.17,.2),o=e.range(.23,.27),r=e.int(11,16),a=e.range(.85,1.05),c=s*r,l=o*r,h=I(D.IRON,e.range(.85,1.05)),u=I(D.IRON,e.range(.95,1.15)),f=Math.atan2(c,l),d=Math.hypot(c,l);for(const b of[-1,1]){const S=new k(.06,.28,d+.2);S.rotateX(f),S.translate(b*a/2,c/2-.06,-l/2),n.push({geometry:S,color:h,sway:0})}for(let b=0;b<r;b++){const S=new k(a*.94,.035,o*.72);S.translate(0,s*(b+1),-o*(b+.5)),n.push({geometry:S,color:u,sway:0});const E=new k(a*.94,.05,.03);E.translate(0,s*(b+1)-.012,-o*(b+.5)-o*.36),n.push({geometry:E,color:I(u,.86),sway:0})}const g=e.range(.9,1.3),v=new k(a+.12,.07,g);v.translate(0,c,-l-g/2+.02),n.push({geometry:v,color:I(u,1.06),sway:0});for(const b of[-1,1]){const S=new Y(.045,.05,c,6);S.translate(b*a/2,c/2,-l-g+.12),n.push({geometry:S,color:I(h,.9),sway:0})}const m=e.chance(.5)?1:-1,p=1.05,x=4;for(let b=0;b<=x;b++){const S=b/x,E=new Y(.022,.026,p,6);E.translate(m*a/2,s*r*S+p/2,-l*S),n.push({geometry:E,color:h,sway:0})}const y=new Y(.026,.026,d+.16,6);y.rotateX(Math.PI/2+f),y.translate(m*a/2,c/2+p,-l/2),n.push({geometry:y,color:I(h,1.12),sway:0});const w=pt(n);return t!==1&&w.scale(t,t,t),xt(w,"stair",0)}},_d={name:"workbench",category:"furniture",radius:1.2,build({seed:i=1,scale:t=1}={}){const e=gt(i),n=[],s=e.range(1.4,2.1),o=e.range(.6,.75),r=e.range(.86,.92),a=e.range(.06,.09),c=I(D.IRON,e.range(.85,1.05)),l=I(D.TIMBER,e.range(.82,1)),h=e.int(3,5);for(let _=0;_<h;_++){const M=new k(s,a,o/h*.97);M.translate(0,r-a/2,-o/2+o/h*(_+.5)),n.push({geometry:M,color:I(l,e.range(.9,1.12)),sway:0})}const u=e.range(.032,.045),f=.1,d=r-a*.4;for(const _ of[-1,1])for(const M of[-1,1]){const A=new k(u*2,d,u*2);A.translate(_*(s-f*2)/2,d/2,M*(o-f*2)/2),n.push({geometry:A,color:c,sway:0})}for(const _ of[-1,1]){const M=new k(s-f*2,u*1.5,u*1.4);M.translate(0,r*.22,_*(o-f*2)/2),n.push({geometry:M,color:I(c,.86),sway:0})}if(e.chance(.6)){const _=new k(s-f*2.4,.03,o-f*2.4);_.translate(0,r*.26,0),n.push({geometry:_,color:I(l,.8),sway:0})}if(!e.chance(.5)){const _=pt(n);return t!==1&&_.scale(t,t,t),xt(_,"workbench",0)}const g=s*e.range(.2,.34)*(e.chance(.5)?1:-1),v=o/2,m=e.range(.13,.18),p=e.range(.02,.12),x=new k(m*1.1,m*.85,m*1.5);x.translate(g,r+m*.42,v-m*.35),n.push({geometry:x,color:I(c,1.1),sway:0});for(const[_,M]of[[v+p*.5,1],[v-p*.5-m*.28,.95]]){const A=new k(m*1.25*M,m*.7,m*.24);A.translate(g,r+m*.5,_),n.push({geometry:A,color:I(c,1.2),sway:0})}const y=new Y(m*.11,m*.11,m*1.1,6);y.rotateX(Math.PI/2),y.translate(g,r+m*.5,v+m*.55),n.push({geometry:y,color:I(c,1.25),sway:0});const w=e.range(0,Math.PI),b=m*.8,S=new R(g,r+m*.5,v+m*1.02),E=[-1,1].map(_=>new R(S.x+Math.cos(w)*b*_,S.y+Math.sin(w)*b*_,S.z));n.push({geometry:Bt(E[0],E[1],m*.06,m*.06,5),color:I(c,1.1),sway:0});for(const _ of E){const M=new ie(m*.085,0);M.translate(_.x,_.y,_.z),n.push({geometry:M,color:I(c,1.2),sway:0})}const T=pt(n);return t!==1&&T.scale(t,t,t),xt(T,"workbench",0)}},p5="gallery-village-interior",m5="gallery-village-exterior",g5="gallery-factory-interior",v5="gallery-factory-exterior",y5=[tc,qg,qE,s5,kg,zg,h5,Bg,u5,vd,Yg,us,Fi,oc],w5=[to,Rg,Sc,Cg,pd,Ig,fd,dd,sd,pr,ec,nc,Ec,Pg,sc],u1={id:m5,name:"Countryside Village Exterior Clutter",builders:y5},d1={id:p5,name:"Countryside Village Interior Clutter",builders:w5},x5=[ic,gd,cd,l1,ad,md,ld,_d,d5,od,f5,h1,hd,ci],_5=[ud,YE,r5],f1={id:g5,name:"Industrial Factory Interior Clutter",builders:x5,door:"iron"},p1={id:v5,name:"Industrial Factory Exterior Clutter",builders:_5,door:"iron"},M5=[e1,n1,d1,u1,f1,p1,a1,c1],Md="sound-stage",mu=tg*1.5,bd=14,Ba=1.15,Ke={refDistance:2,maxDistance:42,rolloff:1.2,reverb:.4},mo=[{kind:"emitter",name:"wind",spec:{model:"wind",id:"wind",options:{gain:.3},...Ke}},{kind:"emitter",name:"foliage",spec:{model:"foliage",id:"foliage",options:{gain:.4},...Ke}},{kind:"emitter",name:"rain",spec:{model:"rain",id:"rain",options:{gain:.5,intensity:.6,surface:"earth"},...Ke}},{kind:"emitter",name:"water",spec:{model:"water",id:"water",options:{gain:.4},...Ke}},{kind:"scatter",name:"drip",spec:{sound:"drip",id:"drip",every:3.5,spread:[.2,.1,.2],...Ke}},{kind:"emitter",name:"fire",spec:{model:"fire",id:"fire",options:{gain:.5},...Ke}},{kind:"emitter",name:"machine",spec:{model:"machine",id:"machine",options:{gain:.35},...Ke}},{kind:"emitter",name:"friction",spec:{model:"friction",id:"friction",options:{motion:"steady",speed:.28,gain:.4},...Ke}},{kind:"emitter",name:"waveguide",spec:{model:"waveguide",id:"waveguide",options:{excite:"chime",pitch:900,decay:3,bright:.7,drive:.3,gain:.4},...Ke}},{kind:"scatter",name:"hammer",spec:{sound:"hammer",id:"hammer",every:4,spread:[.3,.2,.3],...Ke}},{kind:"scatter",name:"clatter",spec:{sound:"clatter",id:"clatter",every:6,spread:[.5,.2,.5],...Ke}},{kind:"emitter",name:"bird",spec:{model:"bird",id:"bird",options:{gain:.2},...Ke}},{kind:"emitter",name:"crowd",spec:{model:"crowd",id:"crowd",options:{gain:.4},...Ke}},{kind:"scatter",name:"animal",spec:{sound:"animal",id:"animal",every:5,spread:[.4,.2,.4],...Ke}},{kind:"scatter",name:"bell",spec:{sound:"bell",id:"bell",every:11,spread:[.2,.1,.2],...Ke,reverb:1}}],b5=mo.map(i=>i.spec.id);function gu(i){return[-((mo.length-1)*mu)/2+i*mu,Ba+.25,0]}const S5={emitters:mo.flatMap((i,t)=>i.kind==="emitter"?[{...i.spec,at:gu(t)}]:[]),scatter:mo.flatMap((i,t)=>i.kind==="scatter"?[{...i.spec,at:gu(t)}]:[])},E5=new Re({color:I(D.STONE,.94),flatShading:!0}),T5=new Re({color:I(D.STONE_PALE,1.02),flatShading:!0});function A5(i,t){const e=new he;e.name=`station:${i}`;const n=new $t(new k(.8,Ba,.8),E5);n.position.set(t,Ba/2,0),e.add(Xt(n));const s=new $t(new k(1,.09,1),T5);s.position.set(t,Ba+.045,0),e.add(Xt(s));const o=hi(i);return o.position.set(t,0,1.5),e.add(o),e}function Zl(){const i=(mo.length-1)*mu+bd*2+40;return Math.min(200,Math.max(120,Math.ceil(i/20)*20))}function R5(){return{id:Md,name:"Sound Showcase",environment:{...gs,fogNear:Zl()*.2,fogFar:Zl()*.46,ambientGround:12563096,surface:"stone",room:"open",soundscape:S5},spawn:{position:new R(0,.1,bd-2),yaw:0},floor:-20,groundAt:()=>0,build(){const i=new he;return i.add(_c(Zl())),mo.forEach((t,e)=>{i.add(A5(t.name,gu(e)[0]))}),i}}}function C5(){return{zone:Md,position:new R(0,0,bd),yaw:Math.PI,material:"iron",seed:6601}}function P5(i){return{id:`portal:${Md}`,a:i,b:C5()}}const Sd="water-showcase",Ci=.4,no=2.4,I5=0,m1=16,Cp=19,vu=-18.3,tn=-3.4,Gs=.7,D5=.25,Kl=.15,Be=new Re({color:9275257,flatShading:!0}),L5=new Re({color:8221536,flatShading:!0}),g1=new Re({color:7034428,flatShading:!0}),$s=.3,ds=1.6,Jo=no+ds;function N5(i){return{x:[i.x[0]-$s,i.x[1]+$s],z:[i.z[0]-$s,i.z[1]+$s]}}const v1=[{name:"beach",x:[-22,-Jo],z:[9.4,19],bank:"east",shelf:.8,deep:-2.6,chop:2.6,taper:!0,drift:new tt(.45,0),verge:"east",flow:"stream",sign:[-1.6,14]},{name:"rocks",x:[-16,-Jo],z:[-5,8],bank:"west",shelf:.25,deep:-1.6,chop:.7,verge:"east",flow:"brook",sign:[-1.6,2]},{name:"chop",x:[Jo,16],z:[-1.6,8],bank:"east",shelf:.2,deep:-2.2,chop:1,verge:"west",flow:"stream",sign:[1.6,4]},{name:"shore",x:[Jo,19],z:[-17.6,-3],bank:"east",shelf:.85,deep:-2.4,chop:.4,verge:"west",flow:"brook",sign:[1.6,-9]},{name:"still",x:[-11,11],z:[-46.6,-20.6],bank:"north",shelf:.18,deep:-2,chop:0,flow:"cistern",sign:[-1.6,-17]}];function De(i,t,e,n,s,o,r){const a=new $t(new k(t,e,n),i);return a.position.set(s,o+e/2,r),a}function Ed(i,t,e,n,s,o){const r=t[1]-t[0],a=e[1]-e[0],c=(t[0]+t[1])/2,l=(e[0]+e[1])/2,h=new En(r,a,Math.max(1,Math.round(r/n)),Math.max(1,Math.round(a/s)));h.rotateX(-Math.PI/2);const u=h.getAttribute("position");for(let d=0;d<u.count;d++)u.setY(d,o(u.getX(d)+c,u.getZ(d)+l));u.needsUpdate=!0,h.computeVertexNormals();const f=new $t(h,L5);return f.name=`bed:${i}`,f.position.set(c,0,l),f.userData.ground=!0,Xt(f)}function Ac(i){const t=Math.min(Math.max(i,0),1);return t*t*(3-2*t)}function y1(i,t,e){const[n,s]=i.x,[o,r]=i.z,a=Math.min(Math.max(i.shelf,.01),1),c=i.bank==="west"?(s-t)/(s-n):i.bank==="north"?(r-e)/(r-o):(t-n)/(s-n),l=Math.min(Math.max((c-(1-a))/a,0),1);return i.deep+(D5-i.deep)*l}function F5(i){const t=i.bank!=="north";return Ed(i.name,i.x,i.z,t?i.taper?.9:1.6:4,t?4:1.6,(e,n)=>y1(i,e,n))}function U5(i){return i.taper?(t,e)=>i.chop*Ac((-y1(i,t,e)-.1)/1.3):i.chop}function O5(i){const[t,e]=i.x,[n,s]=i.z,o=Ci-tn,r=[],a=i.verge==="west"?ds:Gs,c=i.verge==="east"?ds:Gs,l=t-a,h=e+c;for(const u of[n-Gs/2,s+Gs/2])r.push(De(Be,h-l,o,Gs,(l+h)/2,tn,u));for(const[u,f]of[[t-a/2,a],[e+c/2,c]])r.push(De(Be,f,o,s-n,u,tn,(n+s)/2));return r.map(u=>Xt(u))}function k5(){const i=[],e=Cp-vu,n=Math.ceil(e/4);for(let s=0;s<n;s++){const o=Cp-s*4,r=Math.max(vu,o-4),a=(o+r)/2,c=o-r;i.push(De(g1,(no+I5)*2,Kl,c,0,Ci-Kl,a)),i.push(De(Be,no*2,Ci-Kl-tn,c,0,tn,a))}return i.map(s=>Xt(s))}function jl(i,t,e,n){const s=gt(i),o=s.range(1.1,2.4),r=s.range(1.1,2.2),a=s.range(1.4,2.6),c=De(Be,o,a,r,t,n-a,e);return c.rotation.set(s.range(-.14,.14),s.range(0,Math.PI),s.range(-.14,.14)),Xt(c)}function Pp(i,t,e,n){return Xt(De(g1,.42,e,.42,i,n,t))}const cr=.2,yu=2.2,qe=.7,jn=-6.4,Qn=-17.6,ac=1.8,w1=.06,z5=[[-.55,-8.6],[.45,-10.6],[-.3,-12.6],[.6,-14.6]],Jl=[{name:"flow-slow",speed:.35,deep:-.34,chop:.2},{name:"flow-brisk",speed:.9,deep:-.32,chop:.32},{name:"flow-fast",speed:1.6,deep:-.3,chop:.45},{name:"flow-race",speed:2.5,deep:-.28,chop:.6}];function Ql(i){const t=-Jo-i*(yu+qe);return[t-yu,t]}function B5(i,t){return t+(w1-t)*Ac((Qn+ac-i)/ac)}function H5(){const i=[],t=Ql(Jl.length-1)[0]-qe,e=cr-tn;for(const n of[jn+qe/2,Qn-qe/2])i.push(Xt(De(Be,-no-t,e,qe,(t-no)/2,tn,n)));for(let n=0;n<Jl.length;n++){const s=Ql(n)[0]-qe/2;i.push(Xt(De(Be,qe,e,jn-Qn,s,tn,(jn+Qn)/2)))}return i.push(Xt(De(Be,ds,e,jn-Qn,-no-ds/2,tn,(jn+Qn)/2))),Jl.forEach((n,s)=>{const[o,r]=Ql(s),a=(o+r)/2;i.push(Ed(n.name,[o,r],[Qn,jn],4,.6,(l,h)=>B5(h,n.deep))),i.push(xc({width:yu+$s*2,depth:jn-Qn+$s*2,at:new R(a,0,(jn+Qn)/2),chop:n.chop,flow:new tt(0,-n.speed)}));for(const[l,h]of z5)i.push(Xt(De(Be,.32,.86,.32,a+l,n.deep,h)));const c=hi(n.name);c.position.set(a,cr,jn+qe/2),i.push(c)}),i}const Ce={x:[-21,-13],z:[-26,-19],outZ:-23.6,inX:-15.4,deep:-.22,speed:2.8,turnFrom:-22.4,turnTo:-25},Ip={x:Ce.inX,z:Ce.outZ},G5=.6,th=1.3;function V5(i,t){const e=Ac((t-Ce.turnFrom)/(Ce.turnTo-Ce.turnFrom)),n=new tt(-e,-(1-e)),s=n.length();if(s<=1e-4)return new tt(0,-2.8);const o=4*e*(1-e),r=Math.hypot(i-Ip.x,t-Ip.z),a=Math.min(Math.max((r-.6)/2.6,0),1),c=1+o*(a-.5)*2*G5;return n.multiplyScalar(Ce.speed*c/s)}function W5(){const i=[],[t,e]=Ce.x,[n,s]=Ce.z,o=cr-tn,r=t-qe,a=e+th;for(const l of[n-qe/2,s+qe/2])i.push(Xt(De(Be,a-r,o,qe,(r+a)/2,tn,l)));for(const[l,h]of[[t-qe/2,qe],[e+th/2,th]])i.push(Xt(De(Be,h,o,s-n,l,tn,(n+s)/2)));i.push(Xt(De(Be,Ce.inX-t,o,s-Ce.outZ,(t+Ce.inX)/2,tn,(Ce.outZ+s)/2))),i.push(Ed("corner",Ce.x,Ce.z,1.2,1.2,l=>Ce.deep+(w1-Ce.deep)*Ac((t+ac-l)/ac))),i.push(xc({width:e-t+.6,depth:s-n+.6,at:new R((t+e)/2,0,(n+s)/2),chop:.22,flow:V5})),i.push(Xt(De(Be,e-Ce.inX,.85,qe,(Ce.inX+e)/2,cr,s+qe/2)));for(const[l,h]of[[-13.9,-20.6],[-14.7,-22.4],[-16.4,-24.6]])i.push(Xt(De(Be,.34,.9,.34,l,Ce.deep,h)));const c=hi("corner");return c.position.set(-18.2,cr,-21.4),i.push(c),i}function X5(i){return[(i.x[0]+i.x[1])/2,.15,(i.z[0]+i.z[1])/2]}const q5={emitters:[...v1.map(i=>({model:"water",id:`pool-${i.name}`,at:X5(i),options:{flow:i.flow,rate:.2+i.chop*.6,gain:.2+i.chop*.2},refDistance:3,maxDistance:26,rolloff:1.6,reverb:.25})),{model:"water",id:"races",at:[-8,.2,-11.7],options:{flow:"stream",rate:.75,gain:.34},refDistance:4,maxDistance:24,rolloff:1.5,reverb:.25},{model:"water",id:"corner",at:[-16.5,.2,-23],options:{flow:"brook",rate:.6,gain:.3},refDistance:3,maxDistance:20,rolloff:1.6,reverb:.3}]};function Y5(){return{id:Sd,name:"Water Showcase",environment:{...gs,fogNear:45,fogFar:115,ambientGround:9280160,surface:"wood",room:"open",soundscape:q5},spawn:{position:new R(0,Ci+.1,m1-2),yaw:0},floor:-20,groundAt:()=>Ci,build(){const i=new he;for(const e of k5())i.add(e);i.add(Xt(De(Be,22+Gs*2,Ci-tn,ds,0,tn,vu-ds/2)));for(const e of v1){i.add(F5(e));for(const o of O5(e))i.add(o);const n=N5(e);i.add(xc({width:n.x[1]-n.x[0],depth:n.z[1]-n.z[0],at:new R((n.x[0]+n.x[1])/2,0,(n.z[0]+n.z[1])/2),chop:U5(e),flow:e.drift}));const s=hi(e.name);s.position.set(e.sign[0],Ci,e.sign[1]),i.add(s)}for(const[e,n,s]of[[0,-7.6,12.1],[1,-6.3,16.4]])i.add(jl(7910+e*53,n,s,.5));[[-5.5,5.6,.55],[-8.2,3.1,-.3],[-6.9,.2,.15],[-11.4,4.4,.7],[-10.1,-1.8,-.12],[-13.2,1.2,.35],[-4.4,-3.2,-.25]].forEach(([e,n,s],o)=>i.add(jl(7710+o*31,e,n,s)));for(const[e,n,s]of[[0,6.5,6.2],[1,10.8,3.4],[2,13.6,6.8]])i.add(Pp(n,s,2.6+e*.3,-2.2));for(const[e,n,s]of[[0,12.4,-5.5],[1,13.9,-9.8],[2,11.6,-13.4]])i.add(jl(7810+e*41,n,s,.45));for(const[e,n,s]of[[-4.2,-26,4.6],[-3.6,-33.5,3.8],[4.8,-29,5.2],[5.4,-36.5,4.2],[-.4,-39.5,3.4]])i.add(Pp(e,n,s,-2));i.add(Xt(De(Be,3.4,1.5,3.2,6.4,-2,-41))),i.add(Xt(De(Be,2.6,1.6,2.4,6.1,-.5,-41.4))),i.add(Xt(De(Be,1.7,1.4,1.6,6.6,1.1,-40.7)));for(const e of H5())i.add(e);for(const e of W5())i.add(e);return i}}}function $5(){return{zone:Sd,position:new R(0,Ci,m1),yaw:Math.PI,material:"timber",seed:6701}}function Z5(i){return{id:`portal:${Sd}`,a:i,b:$5()}}const Td="water-showcase-2",In=16,Ea=-152,K5=84,x1=-4,_1=-27,j5=.7,J5=new Re({color:11049079,flatShading:!0}),Q5=new Re({color:7034428,flatShading:!0});function tR(i){return .4*Math.sin(i*.042)+.22*Math.sin(i*.115+1.7)}function ss(i,t){const e=tR(i),n=x1+e*3;if(t>=n)return(t-n)*.055;const o=-7*Math.min((n-t)/95,1)**.8,r=1.35*Math.exp(-(((t-_1)/8)**2));return o+r+e*.25}function eR(i){const t=Math.min(Math.max(i,0),1);return t*t*(3-2*t)}function nR(i,t){const e=eR(-ss(i,t)/1.4),n=Math.min(Math.max((x1-t)/70,0),1);return .25+2.75*e*n}function iR(i,t){const e=gt(i),n=[];for(let s=3;s>-26;s-=2.1){const o=ss(t,s),a=Math.max(1.5+s*.03,.35)-o,c=new $t(new k(.28,a,.28),Q5);c.position.set(t+e.range(-.12,.12),o+a/2,s),c.rotation.y=e.range(-.2,.2),n.push(Xt(c))}return n}const sR={bed:{model:"wind",id:"wind",options:{gain:.2,tone:3e3}},emitters:[{model:"water",id:"surf",at:[0,.2,_1],options:{flow:"stream",rate:.85,gain:.42},refDistance:14,maxDistance:120,rolloff:.8,reverb:.2}]};function oR(){return{id:Td,name:"Water Showcase 2",environment:{...gs,fogNear:90,fogFar:300,ambientGround:10720122,surface:"earth",room:"open",soundscape:sR},spawn:{position:new R(0,ss(0,In-2)+.1,In-2),yaw:0},floor:-30,groundAt:ss,build(){const i=new he,t=K5*2,e=In+8-Ea,n=new En(t,e,Math.round(t/4),Math.round(e/4));n.rotateX(-Math.PI/2);const s=(In+8+Ea)/2,o=n.getAttribute("position");for(let c=0;c<o.count;c++)o.setY(c,ss(o.getX(c),o.getZ(c)+s));o.needsUpdate=!0,n.computeVertexNormals();const r=new $t(n,J5);r.name="seabed",r.position.z=s,r.userData.ground=!0,i.add(Xt(r)),i.add(xc({width:t+8,depth:In-Ea+8,at:new R(0,0,(In+Ea)/2),chop:nR,flow:new tt(0,.5),segment:j5}));for(const[c,l]of[-46,21,63].entries())for(const h of iR(8210+c*37,l))i.add(h);const a=hi("open-sea");return a.position.set(-2.2,ss(-2.2,In-1.5),In-1.5),i.add(a),i}}}function rR(){return{zone:Td,position:new R(0,ss(0,In),In),yaw:Math.PI,material:"timber",seed:6801}}function aR(i){return{id:`portal:${Td}`,a:i,b:rR()}}const Ha="industrial-props",Vs="countryside-props",ts="general-props",wu=.07,xu={width:9,depth:30,height:4.5},Qo={width:8,depth:30,height:3.2},eh=120,M1=16,cR=[-9,-3,3,9],lR={...po,room:"hall",surface:"stone",fogColor:"#0f1316",fogNear:8,fogFar:34,ambientSky:7766414,ambientGround:8682867,ambientIntensity:2.1,sunIntensity:.85,fillIntensity:.8,fillColor:9346736,footstepReverb:.34},hR={...po,room:"cell",surface:"wood",fogColor:"#181309",fogNear:8,fogFar:30,ambientSky:10655612,ambientGround:5721148,ambientIntensity:2.3,sunIntensity:1.2,fillIntensity:.8,fillColor:10521706,footstepReverb:.45};function uR(){return[{id:Ha,name:"Industrial Props",environment:lR,spawn:{position:new R(0,.1,-30/2+2),yaw:Math.PI},floor:-5,build:()=>Xt(new he().add(Ni({...xu,seed:7730,style:bc,planks:!1,beams:0})))},{id:Vs,name:"Countryside Props",environment:hR,spawn:{position:new R(0,.1,-30/2+2),yaw:Math.PI},floor:-5,build:()=>Xt(new he().add(Ni({...Qo,seed:4470,style:Mr,planks:!0,beams:7})))},{id:ts,name:"General Props",environment:{...gs,fogNear:eh*.46*.45,fogFar:eh*.46,ambientGround:12563096,surface:"stone",room:"open",soundscape:id},spawn:{position:new R(0,.1,M1-2),yaw:0},floor:-20,groundAt:()=>0,build(){const i=new he;return i.add(_c(eh)),i}}]}function ks(i,t,e,n,s){return{zone:i,position:new R(t.width/2-wu,0,cR[e]),yaw:-Math.PI/2,material:n,seed:s}}function dR(i,t,e){return[{id:"industrial-props-door",a:i,b:{zone:Ha,position:new R(0,0,-30/2+wu),yaw:0,material:"iron",seed:6401}},{id:"countryside-props-door",a:t,b:{zone:Vs,position:new R(0,0,-30/2+wu),yaw:0,material:"timber",seed:6402}},{id:"general-props-door",a:e,b:{zone:ts,position:new R(0,0,M1),yaw:Math.PI,material:"timber",seed:6403}},Si(f1,ks(Ha,xu,0,"iron",6411)),Si(p1,ks(Ha,xu,1,"iron",6412)),Si(d1,ks(Vs,Qo,0,"timber",6421)),Si(u1,ks(Vs,Qo,1,"timber",6422)),Si(n1,ks(Vs,Qo,2,"timber",6423)),Si(e1,ks(Vs,Qo,3,"timber",6424)),Si(a1,{zone:ts,position:new R(0,0,0),yaw:0,material:"timber",seed:6431}),Si(c1,{zone:ts,position:new R(-8,0,0),yaw:0,material:"timber",seed:6432}),P5({zone:ts,position:new R(8,0,0),yaw:0,material:"iron",seed:6433}),Z5({zone:ts,position:new R(16,0,0),yaw:0,material:"timber",seed:6434}),aR({zone:ts,position:new R(24,0,0),yaw:0,material:"timber",seed:6435})]}const _u="factory-2",b1="factory-3",Mu="hut-room",S1="hut-room-2",Ei=.07,Ws={width:7,depth:22,height:4},Ho={width:8.5,depth:8.5,height:9},bu={width:5.5,depth:6,height:2.5},Dp={width:9,depth:5,height:3},Lp={...po,room:"hall",surface:"stone",fogColor:"#0f1316",ambientSky:7766414,ambientGround:8682867,ambientIntensity:2.1,sunIntensity:.85,fillIntensity:.8,fillColor:9346736,footstepReverb:.34},Np={...po,room:"cell",surface:"wood",fogColor:"#181309",ambientSky:10655612,ambientGround:5721148,ambientIntensity:2.3,sunIntensity:1.2,fillIntensity:.8,fillColor:10521706,footstepReverb:.45};function fR(){return[{id:_u,name:"Factory 2",environment:{...Lp,fogNear:7,fogFar:30},spawn:{position:new R(0,.1,-22/2+2),yaw:Math.PI},floor:-5,build:()=>mR()},{id:b1,name:"Factory 3",environment:{...Lp,fogNear:11,fogFar:42,ambientIntensity:2.4},spawn:{position:new R(0,.1,-8.5/2+2),yaw:Math.PI},floor:-5,build:()=>gR()},{id:Mu,name:"Villager Hut Room",environment:{...Np,fogNear:4,fogFar:20,ambientIntensity:1.9,sunIntensity:.7},spawn:{position:new R(0,.1,1),yaw:Math.PI},floor:-5,build:()=>vR()},{id:S1,name:"Villager Hut Room 2",environment:{...Np,fogNear:6,fogFar:26,ambientIntensity:2.6,sunIntensity:1.35},spawn:{position:new R(0,.1,1),yaw:Math.PI},floor:-5,build:()=>yR()}]}function pR(i,t){const e=Ws.depth/2;return[{id:"factory-2-door",a:{zone:i,position:new R(2.2,0,-11/2+Ei),yaw:0,material:"iron",seed:9401},b:{zone:_u,position:new R(0,0,-e+Ei),yaw:0,material:"iron",seed:9402}},{id:"factory-3-door",a:{zone:_u,position:new R(0,0,e-Ei),yaw:Math.PI,material:"iron",seed:9403},b:{zone:b1,position:new R(0,0,-4.25+Ei),yaw:0,material:"iron",seed:9404}},{id:"hut-room-door",a:{zone:t,position:new R(10/2-Ei,0,2),yaw:-Math.PI/2,material:"timber",seed:8901},b:{zone:Mu,position:new R(0,0,-6/2+Ei),yaw:0,material:"timber",seed:8902}},{id:"hut-room-2-door",a:{zone:Mu,position:new R(bu.width/2-Ei,0,0),yaw:-Math.PI/2,material:"timber",seed:8903},b:{zone:S1,position:new R(0,0,-5/2+Ei),yaw:0,material:"timber",seed:8904}}]}function mR(){const i=new he;i.add(Ni({...Ws,seed:7710,style:bc,planks:!1,beams:0}));const t=Ws.width/2,e=-t+1.5,n=t-1.4;[-7.5,-2.5,2.5,7.5].forEach((r,a)=>{ne(i,ic.build({seed:3410+a}),e,0,r,Math.PI/2)}),[-5,0,5].forEach((r,a)=>{ne(i,hd.build({seed:9410+a}),e+1.6,0,r,Math.PI/2)}),ne(i,cd.build({seed:4410}),n,0,-6.4,Math.PI/2),ne(i,l1.build({seed:4411}),n+.2,0,-1.2,-Math.PI/2),ne(i,_d.build({seed:4412}),n,0,3.4,-Math.PI/2),ne(i,us.build({seed:4413}),n+.1,0,6.2,.3),ne(i,Fi.build({seed:4414}),n-.3,0,7.4,.1),ne(i,od.build({seed:4415}),t-.55,0,9.4,-Math.PI/2),[-8,-3,2,7].forEach((r,a)=>{const c=ad.build({seed:9420+a});c.position.set(-t+.34,0,r),c.rotation.y=Math.PI/2,i.add(c)});const s=ld.build({seed:9430});s.position.set(t-.22,1.4,-9.2),s.rotation.y=-Math.PI/2,i.add(s);const o=new Re({color:I(D.IRON,.9),flatShading:!0});for(let r=0;r<11;r++){const a=-11+(r+.5)/11*Ws.depth,c=new $t(new k(Ws.width,.16,.2),o);c.position.set(0,Ws.height-.12,a),i.add(c)}return ne(i,ci.build({seed:5510}),.9,0,-8,-Math.PI/2),ne(i,ci.build({seed:5511}),.9,0,0,-Math.PI/2),ne(i,ci.build({seed:5512}),.9,0,8,-Math.PI/2),Xt(i)}function gR(){const i=new he;i.add(Ni({...Ho,seed:7720,style:bc,planks:!1,beams:0}));const t=Ho.width/2,e=Ho.depth/2;ne(i,md.build({seed:8120}),0,0,1.2,Math.PI/2),ne(i,h1.build({seed:6210}),-t+.42,0,-2.4,Math.PI/2),ne(i,gd.build({seed:6220}),-t+1.3,0,e-1.4,Math.PI*.25),ne(i,vd.build({seed:6221}),-1.6,0,2.6,.4),ne(i,us.build({seed:6230}),t-.9,0,-1.6,.2),ne(i,Fi.build({seed:6231}),t-.8,0,.1,.5),ne(i,_d.build({seed:6232}),t-1.2,0,2.4,-Math.PI/2),ne(i,ud.build({seed:6240}),2.2,0,e-.8,0);const n=new Re({color:I(D.IRON,.86),flatShading:!0});for(const o of[-t+.6,t-.6]){const r=new $t(new k(1.2,.12,Ho.depth-.7),n);r.position.set(o,4.2,0),i.add(r);const a=new $t(new k(.08,.9,Ho.depth-.7),n);a.position.set(o+(o<0?.55:-.55),4.7,0),i.add(a)}ne(i,ci.build({seed:5520}),1.4,0,-2.8,Math.PI);const s=ci.build({seed:5521});return s.position.set(t-1.1,4.3,-1.5),s.rotation.y=Math.PI/2,i.add(s),Xt(i)}function vR(){const i=new he;i.add(Ni({...bu,seed:4410,style:Mr,planks:!0,beams:2}));const t=bu.depth/2;ne(i,Sc.build({seed:4420}),-2.75+.4,0,-1.4,Math.PI/2),ne(i,Ec.build({seed:4421}),-2.75+.55,0,.6,Math.PI/2);const e=us.build({seed:4422});return ne(i,e,-2.75+.75,0,2.1,.15),ne(i,Fi.build({seed:4423}),-2.75+.7,0,t-.7,.4),ne(i,Fi.build({seed:4424}),.3,0,t-.65,.9),ne(i,dd.build({seed:4425}),1.6,0,t-.7,.2),ne(i,fd.build({seed:4426}),1.5,0,-t+.16,0),ne(i,oc.build({seed:7110}),-2.75+.8,E1(e),2.1,.7),Xt(i)}function yR(){const i=new he;i.add(Ni({...Dp,seed:4430,style:Mr,planks:!0,beams:4}));const t=Dp.depth/2;ne(i,to.build({seed:4440}),-2.9,0,t-.1,Math.PI),ne(i,to.build({seed:4441}),.1,0,t-.1,Math.PI),ne(i,to.build({seed:4442}),3.1,0,t-.1,Math.PI);const e=pr.build({seed:4451});return ne(i,e,2.2,0,.9,.05),ne(i,ec.build({seed:4452}),2,0,.1,.2),ne(i,nc.build({seed:4453}),3.5,0,.9,-.3),ne(i,Sc.build({seed:4461}),3.8,0,-t+.6,0),ne(i,pd.build({seed:4450}),-3.4,0,t-1.1,Math.PI*.9),ne(i,sd.build({seed:4460}),-3.2,0,-1.2,Math.PI/2),ne(i,Ec.build({seed:4462}),-1.9,0,-t+.5,0),ne(i,Qs.build({seed:6610}),-2.4,0,.9,Math.PI*.15),ne(i,sc.build({seed:7120}),2.35,E1(e),.7,.4),Xt(i)}function E1(i){return i.geometry.computeBoundingBox(),(i.geometry.boundingBox?.max.y??0)+i.position.y}function ne(i,t,e,n,s,o){t.position.set(e,n,s),t.rotation.y=o,i.add(t)}const Zs="exterior",nh="villager-hut",ih="factory",sh=new R(5,0,6),Ta=0,wR=new R(14,0,6),xR=0,oh=.07,_R=new R(10,0,6),MR=0,rh=new R(-10,0,22),bR=5,SR=Math.PI,ah={width:10,depth:8,height:3.4},zs={width:15,depth:11,height:5.6},ER=new R(0,1,0),Su=-5.4,Eu=[-2.4,1.1,4.4],Tu=[1.5,.9,1.9],Au=[-1.8,2.6,2.4],Ru=[15/2-.34,1.5,1.6],TR={emitters:[{model:"machine",id:"engine-north",at:[Su+1,1.1,Eu[0]],options:{rpm:74,fundamental:52,gain:.15,wear:.55,clank:.45},refDistance:1.4,maxDistance:22,rolloff:1.7,reverb:.3},{model:"machine",id:"engine-south",at:[Su+1,1.1,Eu[2]],options:{rpm:46,fundamental:35,gain:.16,wear:.8,clank:.7},refDistance:1.4,maxDistance:22,rolloff:1.7,reverb:.35},{model:"friction",id:"gantry",at:Au,options:{motion:"cycle",speed:.26,force:.8,pitch:210,decay:1.4,bright:.4,roughness:.22,gain:.18},refDistance:1.6,maxDistance:22,rolloff:1.5,reverb:.8,importance:1.5},{model:"waveguide",id:"pipe-air",at:Ru,options:{excite:"breath",closed:!0,pitch:190,decay:.9,bright:.28,drive:.55,gain:.3},refDistance:1.2,maxDistance:9,rolloff:1.8,reverb:.4}],scatter:[{sound:"clatter",id:"fitting",at:Tu,spread:[1.1,.4,1.1],every:17,force:[.3,.85],options:{material:"metal",gain:.2,pieces:3},refDistance:1.8,maxDistance:22,rolloff:1.3,reverb:.85}]};function ch(i,t){return{zone:Zs,position:new R(rh.x+i*bR,rh.y,rh.z),yaw:SR,material:t,seed:5200+i*17}}function AR(i){const t=tc.build({seed:5511});t.position.copy(sh),t.rotation.y=Ta;const e=pT(t),n=new R(e.x,0,e.z+oh).applyAxisAngle(ER,Ta).add(sh),s=[{id:Zs,name:"Outside",environment:{...gs,ambientGround:12563096},spawn:{position:iS.clone(),yaw:0},floor:-20,build(){const r=i.populate(),a=tc.build({seed:5511});return a.position.copy(sh),a.rotation.y=Ta,r.add(Xt(a)),r}},{id:nh,name:"Countryside Village Interior Demo",environment:{...po,room:"cell",surface:"wood",fogColor:"#181309",fogNear:9,fogFar:34,ambientSky:10655612,ambientGround:5721148,ambientIntensity:2.3,sunIntensity:1.2,fillIntensity:.8,fillColor:10521706,footstepReverb:.45},spawn:{position:new R(0,.1,1),yaw:Math.PI},floor:-5,build:()=>RR()},{id:ih,name:"Industrial Factory Interior Demo",environment:{...po,room:"hall",surface:"stone",fogColor:"#111519",fogNear:12,fogFar:48,ambientSky:8161172,ambientGround:9077624,ambientIntensity:2.2,sunIntensity:.9,fillIntensity:.85,fillColor:9675701,footstepReverb:.34,soundscape:TR},spawn:{position:new R(0,.1,2),yaw:Math.PI},floor:-5,build:()=>CR()},TA(),...fR()],o=[{id:"hut-door",a:{zone:Zs,position:n,yaw:Ta,material:"timber",seed:8801},b:{zone:nh,position:new R(0,0,-8/2+oh),yaw:0,material:"timber",seed:8802}},{id:"factory-door",a:{zone:Zs,position:wR,yaw:xR,material:"iron",seed:9301},b:{zone:ih,position:new R(0,0,-11/2+oh),yaw:0,material:"iron",seed:9302}},{id:"village-gate",a:{zone:Zs,position:_R,yaw:MR,material:"timber",seed:4712},b:{zone:yd,position:rs.clone().setY(SA.heightAt(rs.x,rs.z)),yaw:Math.PI,material:"timber",seed:4713}},...pR(ih,nh)];for(const r of M5)s.push(z3(r));return s.push(...uR()),o.push(...dR(ch(1,"iron"),ch(0,"timber"),ch(2,"timber"))),s.push(R5()),s.push(Y5()),s.push(oR()),{zones:s,portals:o}}function RR(){const i=new he;i.add(Ni({...ah,seed:4400,style:Mr,planks:!0,beams:3}));const t=ah.width/2,e=ah.depth/2;re(i,Rg.build({seed:8801}),-t+.12,0,.4,Math.PI/2),re(i,to.build({seed:8810}),-2.6,0,e-.1,Math.PI),re(i,to.build({seed:8811}),2.4,0,e-.1,Math.PI),re(i,Cg.build({seed:8820}),t-.35,0,-1.6,-Math.PI/2),re(i,sd.build({seed:3120}),-t+.95,0,-2.5,0);const n=Ec.build({seed:8830});re(i,n,-t+1,0,-1,.06);const s=pr.build({seed:2077});re(i,s,.6,0,.9,.08),re(i,ec.build({seed:411}),-.5,0,1.5,Math.PI*.4),re(i,ec.build({seed:412}),.9,0,-.4,.1),re(i,nc.build({seed:413}),1.7,0,.4,.4),re(i,nc.build({seed:415}),-t+1.6,0,.2,-.5),re(i,pd.build({seed:8840}),-2.9,0,e-2.2,Math.PI*.85);const o=pr.build({seed:2078});re(i,o,-.2,0,e-.8,Math.PI),re(i,Sc.build({seed:8850}),2.6,0,-e+.35,0),re(i,dd.build({seed:8860}),-t+.75,0,3.3,.4),re(i,fd.build({seed:8870}),-t+.16,0,2.4,Math.PI/2),re(i,Ig.build({seed:8880}),-1.5,0,-e+.14,0),re(i,Pg.build({seed:8890}),-2.3,0,-e+.45,.25),re(i,Qs.build({seed:6602}),.4,0,2.1,Math.PI*.9);const r=us.build({seed:61});return re(i,r,t-.9,0,-e+1,.4),re(i,Fi.build({seed:67}),t-.7,0,-.2,.2),re(i,sc.build({seed:7101}),.75,Aa(s),.65,.6),re(i,sc.build({seed:7102}),-.35,Aa(o),e-.85,-.4),re(i,oc.build({seed:7103}),t-.95,Aa(r),-e+1,.9),re(i,oc.build({seed:7104}),-t+1.05,Aa(n),-1.05,-.5),Xt(i)}function CR(){const i=new he;i.add(Ni({...zs,seed:7700,style:bc,planks:!1,beams:0}));const t=zs.width/2,e=zs.depth/2,n=Su;Eu.forEach((l,h)=>{re(i,ic.build({seed:3301+h}),n,0,l,Math.PI/2)}),re(i,cd.build({seed:4401}),5.1,0,2.1,Math.PI/2),re(i,ic.build({seed:3304}),Tu[0],0,Tu[2],-.35);const s=[[-3.6,-e+.34,0],[3.6,-e+.34,0],[Ru[0],Ru[2],Math.PI/2],[t-.34,-2.4,Math.PI/2]];for(let l=0;l<s.length;l++){const[h,u,f]=s[l],d=ad.build({seed:9101+l});d.position.set(h,0,u),d.rotation.y=f,i.add(d)}const o=ld.build({seed:9201});o.position.set(t-.22,1.4,-1.4),o.rotation.y=-Math.PI/2,i.add(o);const r=new Re({color:I(D.IRON,.92),flatShading:!0}),a=zs.height-.12,c=.42;for(const l of[-4.2,-1.4,1.4,4.2]){const h=new he;for(const[d,g]of[[a,.13],[a-c,.1]]){const v=new $t(new k(zs.width,g,g*1.25),r);v.position.set(0,d,0),h.add(v)}const u=9,f=zs.width/u;for(let d=0;d<u;d++){const g=new $t(new k(.07,Math.hypot(f,c),.09),r);g.position.set(-15/2+f*(d+.5),a-c/2,0),g.rotation.z=(d%2===0?1:-1)*Math.atan2(f,c),h.add(g)}h.position.z=l,i.add(h)}return re(i,hd.build({seed:9301}),n+1.9,0,1,Math.PI/2),re(i,ud.build({seed:9302}),2.4,0,e-.7,0),re(i,od.build({seed:9401}),t-.55,0,-e+1.5,-Math.PI/2),re(i,md.build({seed:8110}),Au[0],0,Au[2],Math.PI/2),re(i,ci.build({seed:5501}),-.6,0,-2.4,-Math.PI/2),re(i,ci.build({seed:5502}),-.6,0,4.4,-Math.PI/2),re(i,ci.build({seed:5503}),1.2,0,-.6,Math.PI/2),Xt(i)}function Aa(i){return i.geometry.computeBoundingBox(),(i.geometry.boundingBox?.max.y??0)+i.position.y}function re(i,t,e,n,s,o){t.position.set(e,n,s),t.rotation.y=o,i.add(t)}const Ra=[0,125,250,500,1e3,2e3,5e3,1e4];function PR(i){let t=0,e=0,n=0;for(let o=0;o<i.length;o++){const r=i[o],a=Math.abs(r);a>t&&(t=a),e+=r,n+=r*r}const s=Math.sqrt(n/Math.max(i.length,1));return{peak:t,rms:s,dc:e/Math.max(i.length,1),crest:s>1e-9?20*Math.log10(t/s):0}}function IR(i,t){const e=Math.min(i.length,16384),n=12,s=l=>{let h=0,u=0;const f=2*Math.PI*l/t;for(let d=0;d<e;d++){const g=f*d;h+=i[d]*Math.cos(g),u+=i[d]*Math.sin(g)}return(h*h+u*u)/e},o=[];let r=0,a=0;for(let l=0;l<Ra.length;l++){const h=Math.max(Ra[l],20),u=l+1<Ra.length?Ra[l+1]:Math.min(t/2,2e4);let f=0;for(let d=0;d<n;d++){const g=h*Math.pow(u/h,(d+.5)/n),v=s(g);f+=v,r+=v*g,a+=v}o.push(f)}const c=o.reduce((l,h)=>l+h,0);return{bands:c>0?o.map(l=>l/c):o.map(()=>0),centroid:a>0?r/a:0}}function DR(i,t){if(t<=1e-9)return-1/0;const e=[.15,.4,.7,.95,1.1,1.15,.9,.5];let n=0;for(let s=0;s<i.length;s++)n+=i[s]*(e[s]??.5);return 20*Math.log10(t)+10*Math.log10(Math.max(n,1e-6))}function LR(i,t){const e=PR(i),{bands:n,centroid:s}=IR(i,t);return{...e,bands:n,centroid:s,loudness:DR(n,e.rms)}}function NR(i,t){let e=0;for(let a=0;a<i.length;a++)e+=i[a];e/=Math.max(i.length,1);let n=0;for(let a=0;a<i.length;a++)n+=(i[a]-e)**2;if(n/=Math.max(i.length,1),n<1e-12)return 0;const s=a=>{if(a>=i.length)return 0;let c=0;for(let l=0;l+a<i.length;l++)c+=(i[l]-e)*(i[l+a]-e);return Math.abs(c/((i.length-a)*n))},o=t.map(s),r=o.findIndex(a=>a<.2);return r===-1?1:Math.max(0,...o.slice(r))}const Go=1024,FR=6,Fp=new R;function UR(i,t){const e={context:i,settings:{...td},weather:new og,noise:sg(i),dry:i.createGain(),send:i.createGain(),register:()=>{},unregister:()=>{}};return e.dry.connect(t),e.send.connect(t),e}async function OR(i,t=48e3){const e=i.seconds??FR,n=Math.ceil(e*t/Go)*Go,s=new OfflineAudioContext(1,n,t),o=UR(s,s.destination),r=i.build(o);r.output.connect(s.destination),i.ready&&await i.ready(r);const a=Go/t,c=Math.floor(n/Go);for(let h=1;h<c;h++)s.suspend(h*Go/t).then(()=>{o.weather.update(a),r.update?.(a,o,Fp),s.resume()});return o.weather.update(a),r.update?.(a,o,Fp),{signal:(await s.startRendering()).getChannelData(0),model:r,rate:t}}const kR={peak:.95,dc:.01,periodicity:.35,crest:{_comment:["Peak over average, in dB, and it means opposite things for the two","kinds of source — which is why there are two bands rather than one.","A continuous texture with a very high crest is bubble wrap: audible","individual grains. An impulsive source with a *low* one has lost its","transient and turned into a wash. Bounds are drawn wide around the","first captured run rather than derived; the drift check below is the","sharp instrument, and these only catch a model that has fallen over."],texture:[4,26],event:[12,36]}},zR={loudness:1.5,crest:2.5,centroid:.5},BR={wind:{loudness:-46.69,crest:23.33,centroid:121,bands:[.6522,.2851,.0387,.012,.0116,5e-4,0,0]},foliage:{loudness:-41.22,crest:15.96,centroid:1230,bands:[.0262,.0512,.1118,.3525,.2948,.1401,.0225,9e-4]},rain:{loudness:-37.53,crest:14.73,centroid:1062,bands:[.0363,.1044,.1761,.253,.3241,.0975,.0082,4e-4]},water:{loudness:-38.89,crest:15.12,centroid:741,bands:[.1976,.1233,.1289,.2884,.2154,.0417,.0047,1e-4]},fire:{loudness:-32.04,crest:13.58,centroid:558,bands:[.2647,.5285,.0244,.0299,.0722,.0644,.0114,.0046]},machine:{loudness:-26.53,crest:11.53,centroid:69,bands:[.8421,.141,.0164,5e-4,0,0,0,0]},friction:{loudness:-30.89,crest:6.46,centroid:200,bands:[.3474,.5838,.0541,.0094,.0042,.0011,0,0]},waveguide:{loudness:-33.2,crest:27.71,centroid:857,bands:[3e-4,9e-4,.5233,.2708,.1788,.0165,.0049,.0044]},bird:{loudness:-29.91,crest:16.97,centroid:2340,bands:[2e-4,2e-4,2e-4,3e-4,6e-4,.9979,6e-4,0]},crowd:{loudness:-37.17,crest:17.34,centroid:566,bands:[.0078,.0791,.1582,.7432,.0115,2e-4,0,0]},hammer:{loudness:-37.04,crest:26.58,centroid:144,bands:[.1803,.8117,.0051,1e-4,.0022,5e-4,0,0]},clatter:{loudness:-50.07,crest:26.39,centroid:109,bands:[.806,.1784,.0094,.0051,9e-4,1e-4,0,0]},animal:{loudness:-36.57,crest:22.36,centroid:776,bands:[0,4e-4,.1835,.7314,.0769,.0076,1e-4,0]},drip:{loudness:-44.1,crest:30.46,centroid:600,bands:[.171,.1695,.1649,.1835,.3106,5e-4,1e-4,0]},bell:{loudness:-33.5,crest:19.34,centroid:130,bands:[.6331,.3079,.056,.0028,2e-4,0,0,0]}},HR={rules:kR,drift:zR,models:BR},cc=HR;function Vo(i,t,e,n=8){return{name:i,kind:"event",seconds:n,build(s){const o=Mg(s,t);let r=0;return{output:o.output,update(a){r-=a,!(r>0)&&(r=e,o.fire(s.context.currentTime+.05,.45+Math.random()*.55))},dispose:()=>o.dispose()}}}}const GR=[{name:"wind",seconds:12,build:i=>lg(i)},{name:"foliage",seconds:12,build:i=>ug(i)},{name:"rain",seconds:8,build:i=>gg(i,{intensity:.6})},{name:"water",seconds:8,build:i=>vg(i)},{name:"fire",seconds:8,build:i=>pg(i)},{name:"machine",seconds:12,build:i=>dg(i)},{name:"friction",seconds:10,build:i=>xg(i,{motion:"steady"}),ready:i=>i.ready},{name:"waveguide",kind:"event",seconds:10,build:i=>_g(i,{excite:"chime",drive:.3}),ready:i=>i.ready},{name:"bird",kind:"event",seconds:16,build:i=>fg(i)},{name:"crowd",seconds:10,build:i=>wg(i)},Vo("hammer",{sound:"hammer"},1.1),Vo("clatter",{sound:"clatter"},1.6),Vo("animal",{sound:"animal"},1.8),Vo("drip",{sound:"drip"},.9),Vo("bell",{sound:"bell"},3.5,12)];function VR(i,t){const e=Math.round(t*.05),n=Math.floor(i.length/e),s=new Float32Array(n);for(let o=0;o<n;o++){let r=0;for(let a=0;a<e;a++){const c=i[o*e+a];r+=c*c}s[o]=Math.sqrt(r/e)}return s}function WR(i,t,e){const n=[],{rules:s}=cc,[o,r]=s.crest[e];return i.peak>s.peak&&n.push(`peak ${i.peak.toFixed(2)} — clipping`),Math.abs(i.dc)>s.dc&&n.push(`dc ${i.dc.toFixed(4)}`),i.crest<o&&n.push(`crest ${i.crest.toFixed(1)} dB — ${e==="event"?"no transient left":"a drone"}`),i.crest>r&&n.push(`crest ${i.crest.toFixed(1)} dB — ${e==="event"?"nothing but spikes":"bubble wrap"}`),t>s.periodicity&&n.push(`periodicity ${t.toFixed(2)} — it loops`),n}function XR(i,t){const e=cc.models[i];if(!e)return[];const n=[],{drift:s}=cc;return Math.abs(t.loudness-e.loudness)>s.loudness&&n.push(`loudness ${e.loudness.toFixed(1)} → ${t.loudness.toFixed(1)}`),Math.abs(t.crest-e.crest)>s.crest&&n.push(`crest ${e.crest.toFixed(1)} → ${t.crest.toFixed(1)}`),Math.abs(Math.log2(Math.max(t.centroid,1)/Math.max(e.centroid,1)))>s.centroid&&n.push(`centroid ${e.centroid.toFixed(0)} → ${t.centroid.toFixed(0)} Hz`),n}async function qR(){const i=[],t={};for(const s of GR){const{signal:o,model:r,rate:a}=await OR(s),c=LR(o,a),l=VR(o,a),h=[];for(let d=4;d<l.length/4;d+=2)h.push(d);const u=NR(l,h),f=s.kind??"texture";i.push({name:s.name,measurements:c,periodicity:u,problems:[...WR(c,u,f),...XR(s.name,c)],novel:cc.models[s.name]===void 0}),t[s.name]={loudness:Number(c.loudness.toFixed(2)),crest:Number(c.crest.toFixed(2)),centroid:Number(c.centroid.toFixed(0)),bands:c.bands.map(d=>Number(d.toFixed(4)))},r.dispose()}const e=i.map(s=>s.measurements.loudness).filter(Number.isFinite),n=e.length>1?Math.max(...e)-Math.min(...e):0;return{rows:i,spread:n,failures:i.filter(s=>s.problems.length>0).length,captured:t}}async function YR(){console.log("audition: rendering the library…");const i=await qR();console.table(i.rows.map(n=>({model:n.name,loudness:n.measurements.loudness.toFixed(1),crest:n.measurements.crest.toFixed(1),"centroid Hz":n.measurements.centroid.toFixed(0),peak:n.measurements.peak.toFixed(3),loop:n.periodicity.toFixed(2),status:n.problems.length===0?n.novel?"new":"ok":n.problems.join("; ")}))),console.log(`audition: ${i.failures} of ${i.rows.length} flagged. Loudness spread ${i.spread.toFixed(1)} — reported, not a rule; see baselines.json.`);const t=JSON.stringify(i.captured,null,2),e=i.rows.filter(n=>n.novel).map(n=>n.name);console.log(e.length>0?`audition: no baseline yet for ${e.join(", ")}.`:"audition: current measurements, for re-capture after a deliberate change."),console.log("If this run sounded right, replace the `models` block of src/audio/baselines.json with the object below and commit it — drift is only visible against something."),console.log(t);try{await navigator.clipboard.writeText(t),console.log("audition: copied to the clipboard.")}catch{console.log("audition: could not reach the clipboard — copy the block above.")}return i}const lh=-90,Ji=240,Wo=92;function $R(i){const t=document.createElement("canvas"),e=Math.min(window.devicePixelRatio||1,2);t.width=Ji*e,t.height=Wo*e,Object.assign(t.style,{position:"fixed",right:"8px",bottom:"8px",width:`${Ji}px`,height:`${Wo}px`,zIndex:"20",pointerEvents:"none",display:"none",background:"rgba(8, 10, 12, 0.72)",borderRadius:"3px"}),document.body.appendChild(t);const n=t.getContext("2d"),s=i.analyser,o=new Uint8Array(s.frequencyBinCount),r=new Float32Array(s.fftSize);let a=0;return{visible:!1,update(){if(t.style.display=this.visible?"block":"none",!this.visible||!n)return;s.getByteFrequencyData(o),s.getFloatTimeDomainData(r);let l=0;for(let v=0;v<r.length;v++){const m=Math.abs(r[v]);m>l&&(l=m)}a=Math.max(l,a*.94),n.setTransform(e,0,0,e,0,0),n.clearRect(0,0,Ji,Wo);const h=i.context.sampleRate/2,u=Wo-12,f=30;n.fillStyle="#7fb2c9";for(let v=0;v<Ji;v++){const m=f*Math.pow(h/f,v/Ji),p=Math.min(o.length-1,Math.round(m/h*o.length)),x=o[p]/255*u;n.fillRect(v,u-x,1,x)}n.fillStyle="rgba(255, 255, 255, 0.16)";for(let v=100;v<h;v*=10){const m=Math.log(v/f)/Math.log(h/f)*Ji;n.fillRect(m,0,1,u)}const d=a>0?20*Math.log10(a):lh,g=Math.max(0,(d-lh)/-lh)*Ji;n.fillStyle=d>-1?"#e05a4a":d>-6?"#e0b44a":"#6fbf73",n.fillRect(0,Wo-8,g,6)},dispose(){t.remove()}}}const ZR=new Set(["speed"]);function hh(i,t,e){let n=null,s=null;const o={};function r(a){const c=Object.keys(a.meta.params).sort();for(const h of c)o[h]=a.get(h);const l=i.addFolder(t).close();for(const h of c){const u=a.meta.params[h];l.add(o,h,u.min,u.max,u.step).name(ZR.has(h)?`${h} (driven)`:h).onChange(f=>a.set(h,f)).listen()}n=l,s=a}return{sync(){const a=e();if(a===null){n?.destroy(),n=null,s=null;return}if(a!==s){n?.destroy(),r(a);return}for(const c of Object.keys(a.meta.params))o[c]=a.get(c)},dispose(){n?.destroy(),n=null,s=null}}}const KR=.35;class jR{root;bar;label;constructor(t){const e=document.getElementById("loading"),n=e?.querySelector(".loading-bar")??null,s=e?.querySelector(".loading-label")??null;if(e&&n&&s)this.root=e,this.bar=n,this.label=s;else{this.root=document.createElement("div"),this.root.id="loading";const o=document.createElement("div");o.className="loading-track",this.bar=document.createElement("div"),this.bar.className="loading-bar",o.appendChild(this.bar),this.label=document.createElement("div"),this.label.className="loading-label",this.root.append(o,this.label),t.appendChild(this.root)}document.body.classList.add("is-loading")}async step(t,e,n){return this.label.textContent=t,this.bar.style.transform=`scaleX(${Math.min(Math.max(e,0),1)})`,await Up(),n()}async done(){this.bar.style.transform="scaleX(1)",this.label.textContent="ready",await Up(),await Op(.18),this.root.classList.add("is-gone"),document.body.classList.remove("is-loading"),await Op(KR),this.root.remove()}fail(t){this.label.textContent=t,this.bar.style.transform="scaleX(1)",this.root.classList.add("is-failed")}}function Up(){return new Promise(i=>{requestAnimationFrame(()=>requestAnimationFrame(()=>i()))})}function Op(i){return new Promise(t=>window.setTimeout(t,i*1e3))}const JR="OpenDyslexic",QR="./fonts/OpenDyslexic-Regular.otf",uh="is-dyslexic";let is="idle",kp=!1;const Ad=new Set;function t4(i){if(kp=i,!i){document.body.classList.remove(uh),Ca();return}if(is==="ready"){document.body.classList.add(uh),Ca();return}is==="loading"||is==="failed"||(is="loading",Ca(),e4().then(t=>{is=t?"ready":"failed",t&&kp&&document.body.classList.add(uh),Ca()}))}async function e4(){try{const i=new FontFace(JR,`url(${QR})`);return await i.load(),document.fonts.add(i),!0}catch{return!1}}function n4(i){return is==="failed"?"typeface unavailable":i.dyslexicFont&&is==="loading"?"fetching the typeface…":null}function i4(i){Ad.add(i)}function s4(i){Ad.delete(i)}function Ca(){for(const i of Ad)i()}const Rd="options",Ga={masterVolume:100,ambientVolume:100,footstepVolume:100,creatureVolume:100,npcVolume:100,fov:ri.fov,fovScaling:ri.fovScaling,dither:!0,pixelation:!0,ambientOcclusion:!0,bloom:!0,grassShadows:!1,shadows:!0,fpsCap:"uncapped",performance:"off",sensitivity:5,invertY:ri.invertY,invertX:ri.invertX,sprintMode:"hold",crouchMode:"hold",reducedMotion:!1,windSway:!0,waterMotion:!0,headBob:!0,sprintZoom:!0,colorblind:"off",colorblindStrength:100,dyslexicFont:!1,fontSize:0};function T1(i){const t=!i.reducedMotion;return{...i,grassShadows:i.grassShadows&&i.shadows,windSway:i.windSway&&t,waterMotion:i.waterMotion&&t,headBob:i.headBob&&t,sprintZoom:i.sprintZoom&&t}}const A1=i=>`${Math.round(i)}%`,zp=[{value:"hold",label:"hold"},{value:"toggle",label:"toggle"}],Pa=i=>!i.reducedMotion,Xo=(i,t)=>({kind:"slider",key:i,label:t,min:0,max:100,step:1,format:A1}),Ia=()=>"not connected yet",R1=[{id:"video",label:"Video",controls:[{kind:"slider",key:"fov",label:"field of view",min:60,max:120,step:1,format:i=>`${Math.round(i)}°`},{kind:"choice",key:"fovScaling",label:"field of view scaling",choices:[{value:"vertical",label:"vertical"},{value:"horizontal",label:"horizontal"}],note:i=>i.fovScaling==="horizontal"?"fixed side to side; a wider window loses height":"fixed top to bottom; a wider window shows more"},{kind:"toggle",key:"dither",label:"dither"},{kind:"toggle",key:"pixelation",label:"pixelation"},{kind:"toggle",key:"ambientOcclusion",label:"ambient occlusion"},{kind:"toggle",key:"bloom",label:"bloom"},{kind:"toggle",key:"shadows",label:"shadows"},{kind:"toggle",key:"grassShadows",label:"grass shadows",enabledWhen:i=>i.shadows,note:i=>i.shadows?null:"needs shadows"},{kind:"choice",key:"fpsCap",label:"frame rate cap",choices:[{value:"uncapped",label:"uncapped"},{value:"30",label:"30 fps"},{value:"60",label:"60 fps"},{value:"120",label:"120 fps"},{value:"144",label:"144 fps"},{value:"240",label:"240 fps"}]},{kind:"choice",key:"performance",label:"performance monitor",choices:[{value:"off",label:"off"},{value:"fps",label:"frame rate"},{value:"all",label:"everything"}]}]},{id:"audio",label:"Audio",controls:[Xo("masterVolume","master"),{...Xo("ambientVolume","ambience"),note:Ia},{...Xo("footstepVolume","footsteps"),note:Ia},{...Xo("creatureVolume","creatures"),note:Ia},{...Xo("npcVolume","voices"),note:Ia}]},{id:"controls",label:"Controls",controls:[{kind:"slider",key:"sensitivity",label:"mouse sensitivity",min:0,max:10,step:.1,format:i=>i.toFixed(1)},{kind:"toggle",key:"invertY",label:"invert vertical"},{kind:"toggle",key:"invertX",label:"invert horizontal"},{kind:"choice",key:"sprintMode",label:"sprint",choices:zp},{kind:"choice",key:"crouchMode",label:"crouch",choices:zp}]},{id:"accessibility",label:"Accessibility",controls:[{kind:"toggle",key:"reducedMotion",label:"reduced motion"},{kind:"toggle",key:"windSway",label:"wind sway",enabledWhen:Pa,note:i=>i.reducedMotion?"held by reduced motion":null},{kind:"toggle",key:"waterMotion",label:"water motion",enabledWhen:Pa,note:i=>i.reducedMotion?"held by reduced motion":null},{kind:"toggle",key:"headBob",label:"head bob",enabledWhen:Pa,note:i=>i.reducedMotion?"held by reduced motion":null},{kind:"toggle",key:"sprintZoom",label:"sprint zoom",enabledWhen:Pa,note:i=>i.reducedMotion?"held by reduced motion":null},{kind:"choice",key:"colorblind",label:"colourblind mode",choices:[{value:"off",label:"off"},{value:"protanopia",label:"protanopia (red blindness)"},{value:"deuteranopia",label:"deuteranopia (green blindness)"},{value:"tritanopia",label:"tritanopia (blue blindness)"}]},{kind:"slider",key:"colorblindStrength",label:"correction strength",min:0,max:100,step:1,format:A1,shownWhen:i=>i.colorblind!=="off"},{kind:"toggle",key:"dyslexicFont",label:"dyslexia-friendly text",note:n4},{kind:"slider",key:"fontSize",label:"text size",min:-5,max:5,step:1,format:i=>i===0?"default":`${i>0?"+":""}${i}px`}]}];function o4(){const i=Ym(Rd)??{},t={...Ga};for(const e of R1)for(const n of e.controls){const s=i[n.key];if(n.kind==="slider"){if(typeof s!="number"||!Number.isFinite(s))continue;t[n.key]=Math.min(Math.max(s,n.min),n.max)}else if(n.kind==="toggle"){if(typeof s!="boolean")continue;t[n.key]=s}else n.choices.some(o=>o.value===s)&&r4(t,n.key,s)}return t}function r4(i,t,e){i[t]=e}function a4(i){$m(Rd,i)}function c4(){Zm(Rd)}const l4="video";class h4{options;onChange;onResume;root;opener;rows=[];tabs=[];current=l4;shown=!1;constructor(t,e,n){this.options=e,this.onChange=n.onChange,this.onResume=n.onResume,this.opener=document.createElement("button"),this.opener.id="options-open",this.opener.type="button",this.opener.textContent="options",this.opener.addEventListener("click",()=>this.show()),this.root=document.createElement("div"),this.root.id="options",this.root.hidden=!0;const s=document.createElement("div");s.className="options-scrim",s.addEventListener("click",()=>this.hide());const o=document.createElement("div");o.className="options-panel",o.setAttribute("role","dialog"),o.setAttribute("aria-modal","true"),o.setAttribute("aria-label","Options");const r=document.createElement("div");r.className="options-title",r.textContent="options";const a=document.createElement("div");a.className="options-tabs",a.setAttribute("role","tablist");const c=document.createElement("div");c.className="options-pages";for(const f of R1){const{tab:d,page:g}=this.buildCategory(f);a.appendChild(d),c.appendChild(g)}const l=document.createElement("div");l.className="options-foot";const h=document.createElement("button");h.type="button",h.className="options-button",h.textContent="defaults",h.addEventListener("click",()=>this.reset());const u=document.createElement("button");u.type="button",u.className="options-button is-primary",u.textContent="resume",u.addEventListener("click",()=>{this.hide(),this.onResume()}),l.append(h,u),o.append(r,a,c,l),this.root.append(s,o),t.append(this.opener,this.root),window.addEventListener("keydown",this.handleKeyDown),i4(this.handleFontChange),this.sync()}buildCategory(t){const e=document.createElement("button");e.type="button",e.className="options-tab",e.textContent=t.label,e.setAttribute("role","tab"),e.addEventListener("click",()=>{this.current=t.id,this.syncTabs()});const n=document.createElement("div");n.className="options-page",n.setAttribute("role","tabpanel");for(const s of t.controls)n.appendChild(this.buildControl(s));return this.tabs.push({id:t.id,tab:e,page:n}),{tab:e,page:n}}buildControl(t){const e=document.createElement("div");e.className="options-row",e.appendChild(this.buildRevert(t));const n=document.createElement("span");n.className="options-row-label",n.textContent=t.label,e.appendChild(n);let s;t.kind==="slider"?s=this.buildSlider(e,t):t.kind==="toggle"?s=this.buildToggle(e,t):s=this.buildChoice(e,t);const o=document.createElement("span");return o.className="options-row-note",e.appendChild(o),this.rows.push({sync:()=>{e.hidden=!(t.shownWhen?.(this.options)??!0),e.classList.toggle("is-changed",this.options[t.key]!==Ga[t.key]);const r=t.enabledWhen?.(this.options)??!0;e.classList.toggle("is-disabled",!r);const a=t.note?.(this.options)??null;o.textContent=a??"",o.hidden=a===null,s(T1(this.options))}}),e}buildRevert(t){const e=document.createElement("button");e.type="button",e.className="options-revert",e.setAttribute("aria-label",`Reset ${t.label} to default`);const n=document.createElement("span");n.className="options-revert-mark",n.textContent="*";const s=document.createElement("span");s.className="options-revert-icon",s.textContent="↺";const o=document.createElement("span");return o.className="options-revert-tip",o.textContent="Reset To Default",o.setAttribute("aria-hidden","true"),e.append(n,s,o),e.addEventListener("click",()=>this.set(t.key,Ga[t.key])),e}buildSlider(t,e){const n=document.createElement("input");n.type="range",n.className="options-slider",n.min=String(e.min),n.max=String(e.max),n.step=String(e.step);const s=document.createElement("span");return s.className="options-row-value",n.addEventListener("input",()=>this.set(e.key,Number(n.value))),t.append(s,n),o=>{const r=o[e.key];n.value=String(r),n.disabled=!(e.enabledWhen?.(this.options)??!0);const a=Math.max(e.max-e.min,1e-6);n.style.setProperty("--fill",`${(r-e.min)/a*100}%`),s.textContent=e.format?e.format(r):String(r)}}buildToggle(t,e){const n=document.createElement("button");n.type="button",n.className="options-switch",n.setAttribute("role","switch");const s=document.createElement("span");s.className="options-switch-knob";const o=document.createElement("span");return o.className="options-switch-word",n.append(s,o),n.addEventListener("click",()=>this.set(e.key,!this.options[e.key])),t.appendChild(n),r=>{const a=r[e.key];o.textContent=a?"on":"off",n.setAttribute("aria-checked",a?"true":"false"),n.classList.toggle("is-on",a),n.disabled=!(e.enabledWhen?.(this.options)??!0)}}buildChoice(t,e){const n=document.createElement("select");n.className="options-select";for(const s of e.choices){const o=document.createElement("option");o.value=s.value,o.textContent=s.label,n.appendChild(o)}return n.addEventListener("change",()=>this.set(e.key,n.value)),t.appendChild(n),s=>{n.value=s[e.key],n.disabled=!(e.enabledWhen?.(this.options)??!0)}}set(t,e){this.options[t]=e,this.sync(),this.onChange(this.options)}reset(){Object.assign(this.options,Ga),c4(),this.sync(),this.onChange(this.options)}sync(){for(const t of this.rows)t.sync();this.syncTabs()}syncTabs(){for(const t of this.tabs){const e=t.id===this.current;t.tab.classList.toggle("is-active",e),t.tab.setAttribute("aria-selected",e?"true":"false"),t.page.hidden=!e}}show(){this.shown||(this.shown=!0,this.root.hidden=!1,document.body.classList.add("is-options"),this.sync())}hide(){this.shown&&(this.shown=!1,this.root.hidden=!0,document.body.classList.remove("is-options"))}handleKeyDown=t=>{t.key!=="Escape"||!this.shown||this.hide()};handleFontChange=()=>this.sync();dispose(){window.removeEventListener("keydown",this.handleKeyDown),s4(this.handleFontChange),this.root.remove(),this.opener.remove()}}const u4=.1,d4=5,f4=18;function Bp(i,t){const{audio:e,postfx:n,zones:s,player:o,input:r,loop:a,performance:c}=t,l=o.tuning,h=T1(i);e.settings.masterVolume=td.masterVolume*(h.masterVolume/100),o.setFieldOfView(h.fov,h.sprintZoom?ri.sprintFovBoost:0,h.fovScaling),n.setDither(h.dither),n.setPixelation(h.pixelation),n.setAmbientOcclusion(h.ambientOcclusion),n.setBloom(h.bloom),n.setColorblind(h.colorblind,h.colorblindStrength/100),s.setShadows(h.shadows),s.setClutterShadows(h.grassShadows);const u=Number.parseInt(h.fpsCap,10);a.setFpsCap(Number.isFinite(u)?u:null),c.setMode(h.performance),l.lookSensitivity=ri.lookSensitivity*Math.max(h.sensitivity,u4)/d4,l.invertY=h.invertY,l.invertX=h.invertX,r.setSprintMode(h.sprintMode),r.setCrouchMode(h.crouchMode),oi.swayAmount.value=h.windSway?1:0,n.setWaterMotion(h.waterMotion),l.bobScale=h.headBob?1:0,t4(h.dyslexicFont),document.documentElement.style.fontSize=`${f4+h.fontSize}px`}function p4(i,t,e){const n=()=>{Bp(i,e),a4(i)},s=new h4(t,i,{onChange:n,onResume:()=>e.input.capture()});return Bp(i,e),{options:i,commit:()=>{n(),s.sync()},open:()=>s.show(),dispose:()=>s.dispose()}}const qo=180,m4=20,Hp=.1;class g4{renderer;root;rows=new Map;samples=new Float32Array(qo);count=0;cursor=0;sinceRefresh=0;mode="off";constructor(t,e){this.renderer=e,this.root=document.createElement("div"),this.root.id="perf",this.root.hidden=!0,t.appendChild(this.root)}setMode(t){t!==this.mode&&(this.mode=t,this.root.hidden=t==="off",this.root.classList.toggle("is-full",t==="all"),this.root.textContent="",this.rows.clear(),t!=="off"&&(this.addRow("fps"),t==="all"&&(this.addRow("1% low"),this.addRow("frame"),this.addRow("draws"),this.addRow("tris"),this.addRow("buffers"),this.addRow("memory"),this.addRow("size")),this.sinceRefresh=Hp))}update(t){this.samples[this.cursor]=t*1e3,this.cursor=(this.cursor+1)%qo,this.count=Math.min(this.count+1,qo),this.mode!=="off"&&(this.sinceRefresh+=t,!(this.sinceRefresh<Hp)&&(this.sinceRefresh=0,this.draw()))}draw(){const t=this.recentMean(m4);if(this.set("fps",t>0?Math.round(1e3/t).toString():"—"),this.mode!=="all")return;const e=this.onePercentLow();this.set("1% low",e>0?Math.round(1e3/e).toString():"—"),this.set("frame",`${t.toFixed(1)} ms`);const n=this.renderer.info;this.set("draws",n.render.calls.toString()),this.set("tris",n.render.triangles.toLocaleString()),this.set("buffers",`${n.memory.geometries} geo`);const s=performance.memory;this.set("memory",s?`${(s.usedJSHeapSize/1048576).toFixed(0)} MB`:"—");const o=this.renderer.getDrawingBufferSize(v4);this.set("size",`${o.x}×${o.y}`)}recentMean(t){const e=Math.min(t,this.count);if(e===0)return 0;let n=0;for(let s=1;s<=e;s++)n+=this.samples[(this.cursor-s+qo)%qo];return n/e}onePercentLow(){if(this.count===0)return 0;const t=Array.from(this.samples.subarray(0,this.count)).sort((s,o)=>o-s),e=Math.max(1,Math.round(this.count/100));let n=0;for(let s=0;s<e;s++)n+=t[s];return n/e}addRow(t){const e=document.createElement("div");e.className="perf-row";const n=document.createElement("span");n.className="perf-label",n.textContent=t;const s=document.createElement("span");s.className="perf-value",s.textContent="—",e.append(n,s),this.root.appendChild(e),this.rows.set(t,s)}set(t,e){const n=this.rows.get(t);n&&(n.textContent=e)}dispose(){this.root.remove()}}const v4=new tt,Cd=document.getElementById("viewport");if(!(Cd instanceof HTMLCanvasElement))throw new Error("#viewport canvas is missing from index.html");const go=document.getElementById("overlay");if(!(go instanceof HTMLElement))throw new Error("#overlay is missing from index.html");const pi=new IM(Cd),io=new LM,_e=GS();pi.scene.fog=new gc(657935,20,90);ZM();const pn=new Rb(pi),y4=new fT(pi.renderer);pi.onResize=()=>pn.resize();const lc=new Za,mr=new Ub(Cd),Qe=new Yb(pi.camera,mr,lc),_o=new jR(document.body),tr=await _o.step("shaping the ground",.12,()=>new oS),jt=new rT({scene:pi.scene,collider:lc,player:Qe,postfx:pn,interaction:new VE,reticle:new cT(go),fade:new lT(go)}),os=o4(),C1=AR(tr);for(const i of C1.zones)jt.register(i);for(const i of C1.portals)jt.link(i);jt.setShadows(os.shadows);jt.setClutterShadows(os.grassShadows);pn.aimSun(jt.sunDirection);await _o.step("settling the world",.6,()=>jt.enter(Zs));await _o.step("raising arkstin",.78,()=>jt.prebuild(yd));const Me=new CS;let fn=null;const w4=new Map([["canopy",.22],["foliage",.4],["shrub-a",.34],["shrub-b",.34],["wood-north",.2],["wood-east",.22],["hedge",.34]]);await _o.step("rendering the rooms",.86,()=>Me.ready);await _o.step("tuning the air",.96,()=>{fn=new uS(Me,.55),Qe.onFootstep=i=>{if(!fn)return;const t=Qe.position;fn.surface=jt.surfaceAt(t.x,t.z),fn.step(i)},Qe.onLand=i=>{if(!fn)return;const t=Qe.position;fn.surface=jt.surfaceAt(t.x,t.z),fn.land(i)},Qe.onJump=()=>{if(!fn)return;const i=Qe.position;fn.surface=jt.surfaceAt(i.x,i.z),fn.jump()},jt.attachAudio({engine:Me,footsteps:fn})});jm()?(new Zb(mr,go),document.body.classList.add("is-touch","is-playing")):mr.onLockChange=i=>document.body.classList.toggle("is-playing",i);const P1=new g4(go,pi.renderer),Yo=p4(os,go,{audio:Me,postfx:pn,zones:jt,player:Qe,input:mr,loop:io,performance:P1});if(_e.gui){const i=pn.settings,t=()=>pn.apply(),e=_e.gui.addFolder("look");e.add(os,"shadows").name("cast shadows").listen().onChange(Yo.commit),e.add(os,"grassShadows").name("grass casts shadows").listen().onChange(Yo.commit),e.add({open:Yo.open},"open").name("open the player's menu"),e.add(i,"pixelSize",1,12,1).onChange(t),e.add(i,"normalEdgeStrength",0,2,.05).onChange(t),e.add(i,"depthEdgeStrength",0,2,.05).onChange(t),e.add(i,"quantize",["off","levels"]).onChange(t),e.add(i,"levels",2,16,1).onChange(t),e.add(i,"ditherScale",0,2,.05).name("dither (steps)").onChange(t),e.add(i,"screenPeriod",2,32,1).name("screen period").onChange(t);const n=_e.gui.addFolder("ambient occlusion");n.add(os,"ambientOcclusion").name("enabled").listen().onChange(Yo.commit),n.add(i.ao,"strength",0,1,.05).onChange(t),n.add(i.ao,"radius",.1,2,.05).name("radius (m)").onChange(t);const s=_e.gui.addFolder("bloom");s.add(os,"bloom").name("enabled").listen().onChange(Yo.commit),s.add(i.bloom,"strength",0,2,.05).onChange(t),s.add(i.bloom,"radius",.25,4,.05).onChange(t);const o=_e.gui.addFolder("water");o.add(i.water,"waves",0,2,.05).onChange(t),o.add(i.water,"reflections").name("screen-space reflections").onChange(t);const r=_e.gui.addFolder("vignette").close();r.add(i,"vignetteStrength",0,1,.01).onChange(t),r.add(i,"vignetteRadius",0,1.5,.01).onChange(t),r.add(i,"vignetteSoftness",.01,1.5,.01).onChange(t);const a=_e.gui.addFolder("sky");a.addColor(i.sky,"zenith").onChange(t),a.addColor(i.sky,"horizon").onChange(t),a.addColor(i.sky,"ground").name("below horizon").onChange(t),a.add(i.sky,"curve",.1,3,.05).onChange(t);const c=_e.gui.addFolder("clouds");c.addColor(i.sky,"cloudColor").name("colour").onChange(t),c.add(i.sky,"cloudCover",.1,.9,.01).name("cover").onChange(t),c.add(i.sky,"cloudSoftness",.01,.6,.01).name("softness").onChange(t),c.add(i.sky,"cloudScale",.2,4,.05).name("scale").onChange(t),c.add(i.sky,"cloudOpacity",0,1,.01).name("opacity").onChange(t),c.add(i.sky,"cloudDrift",0,.1,.001).name("drift").onChange(t);const l=_e.gui.addFolder("light").close();l.add(jt.lights.sun,"intensity",0,5,.1).name("sun"),l.add(jt.lights.ambient,"intensity",0,5,.1).name("ambient");const h={enabled:!0};_e.gui.addFolder("fog volumes").add(h,"enabled").name("enabled").onChange(()=>pn.setFogVolumes(h.enabled));const f=_e.gui.addFolder("fog").close();f.add(i,"linkFogToSky").name("match horizon").onChange(t),f.addColor(i,"fogColor").onChange(t),f.add(i,"fogNear",0,200,1).onChange(t),f.add(i,"fogFar",0,400,1).onChange(t);const d=_e.gui.addFolder("surfaces").close();for(const L of Object.keys(tr.colors))d.addColor(tr.colors,L).onChange(()=>tr.applyColors());d.add({reset:()=>{tr.resetColors(),_e.gui?.controllersRecursive().forEach(L=>L.updateDisplay())}},"reset");const g=_e.gui.addFolder("preset");g.add({save:()=>{const L=pn.save();g.title(L?"preset · saved":"preset · SAVE FAILED")}},"save"),g.add({reset:()=>{pn.reset(),_e.gui?.controllersRecursive().forEach(L=>L.updateDisplay())}},"reset"),g.add({copy:()=>{navigator.clipboard?.writeText(JSON.stringify(pn.settings,null,2))}},"copy").name("copy JSON");const v=Qe.tuning,m=_e.gui.addFolder("movement");m.add(v,"walkSpeed",1,12,.1),m.add(v,"sprintScale",1,3,.05),m.add(v,"groundAccel",1,60,.5),m.add(v,"airAccel",0,20,.1),m.add(v,"friction",0,30,.5),m.add(v,"gravity",5,60,.5),m.add(v,"jumpSpeed",2,14,.1),m.add(v,"autoHop");const p=_e.gui.addFolder("contact").close();p.add(v,"slopeLimitDeg",5,85,1),p.add(v,"stepHeight",0,1,.01),p.add(v,"coyoteTime",0,.5,.01),p.add(v,"jumpBuffer",0,.5,.01);const x=_e.gui.addFolder("view");x.add(v,"lookSensitivity",2e-4,.008,1e-4),x.add(v,"invertY"),x.add(v,"eyeHeight",1,2,.01),x.add(v,"fov",50,110,1),x.add(v,"sprintFovBoost",0,30,1).name("sprint fov +");const y=_e.gui.addFolder("head bob").close();y.add(v,"bobAmount",0,.15,.001),y.add(v,"bobSway",0,.15,.001),y.add(v,"bobRoll",0,.05,5e-4),y.add(v,"bobStepsPerSecond",.5,5,.05),y.add(v,"bobSpeedInfluence",0,1,.05),y.add(v,"landDip",0,.1,.001);const w=_e.gui.addFolder("audio");w.add(Me.settings,"masterVolume",0,1,.01).name("volume"),w.add(Me.settings,"reverbAmount",0,2,.01).name("reverb").onChange(()=>Me.applyReverbAmount()),w.add(Me.settings,"airAbsorption",0,1,.01).name("air absorption"),w.add(Me.settings,"occlusion",0,1,.01).name("occlusion");const b=_e.gui.addFolder("weather");b.add(Me.weather.settings,"windSpeed",0,1,.01).name("wind"),b.add(Me.weather.settings,"gustDepth",0,1,.01).name("gust depth"),b.add(Me.weather.settings,"gustRate",.01,.6,.01).name("gust rate"),b.add(Me.weather.settings,"windDirection",0,Math.PI*2,.01).name("wind direction"),b.add(Me.weather.settings,"frontSpeed",1,60,.5).name("front speed (m/s)"),b.add(oi.swayAmount,"value",0,2,.01).name("sway");const S={windTone:3400,leaves:1,machineRpm:52,fireIntensity:.85,rain:0,water:1,strike:()=>jt.sound?.findField("smith")?.trigger(),drop:()=>jt.sound?.findField("yards")?.trigger(),toll:()=>jt.sound?.findField("bell")?.trigger()};b.add(S,"windTone",700,9e3,50).name("wind tone (Hz)").onChange(L=>{jt.sound?.find("wind")?.setTone(L)}),b.add(S,"leaves",0,2,.01).name("leaf articulation").onChange(L=>{for(const[N,F]of w4)jt.sound?.find(N)?.setArticulation(F*L)}),b.add(S,"machineRpm",0,200,1).name("mill rpm").onChange(L=>{jt.sound?.find("mill")?.setRpm(L)}),b.add(S,"fireIntensity",0,1,.01).name("forge intensity").onChange(L=>{jt.sound?.find("forge")?.setIntensity(L)}),b.add(S,"rain",0,1,.01).name("rain").onChange(L=>{jt.sound?.find("rain")?.setIntensity(L)}),b.add(S,"water",0,1,.01).name("water flow").onChange(L=>{jt.sound?.find("cistern")?.setRate(L)}),b.add(S,"strike").name("hammer now"),b.add(S,"drop").name("clatter now"),b.add(S,"toll").name("bell now");const E={speed:"0.00",grounded:"no",position:"",triangles:lc.triangles,draws:0,drawn:"0",heap:"—",resident:"—",zone:"—",crossings:0,room:"—",audio:"waiting for a click",gust:"0.00",swell:"0.00",machine:"—",emitters:"—"},T=_e.gui.addFolder("state");T.add(E,"speed").listen().disable(),T.add(E,"grounded").listen().disable(),T.add(E,"position").listen().disable(),T.add(E,"zone").listen().disable(),T.add(E,"crossings").listen().disable(),T.add(E,"room").listen().disable(),T.add(E,"audio").listen().disable(),T.add(E,"gust").listen().disable(),T.add(E,"swell").listen().disable(),T.add(E,"machine").listen().disable(),T.add(E,"emitters").name("hrtf / panned / virtual").listen().disable(),T.add(E,"draws").name("draw calls").listen().disable(),T.add(E,"drawn").name("drawn tris").listen().disable(),T.add(E,"heap").listen().disable(),T.add(E,"resident").name("zones built / evicted").listen().disable(),T.add(E,"triangles").name("collider tris").listen().disable(),T.add({respawn:()=>jt.respawn()},"respawn");const _=_e.gui.addFolder("zones");for(const L of jt.zones.values())_.add({go:()=>void jt.enter(L.id)},"go").name(L.name);const M=$R(Me);io.add(()=>M.update());const A=_e.gui.addFolder("sound stage").close(),P={solo:"all",reverb:"—",audition:()=>{YR()}};A.add(P,"solo",["all",...b5]).name("solo").onChange(L=>{jt.sound?.setSolo(L==="all"?null:L)}),A.add(P,"reverb").listen().disable(),A.add(P,"audition").name("audition the library"),A.add(M,"visible").name("spectrum");const C=[hh(A,"reverb",()=>Me.reverbControls),...["gantry","gate","limb","friction"].map(L=>hh(A,L,()=>jt.sound?.find(L)?.loop??null)),...["pipe-air","waveguide"].map(L=>hh(A,L,()=>jt.sound?.find(L)?.loop??null))];io.add(()=>{for(const L of C)L.sync()}),io.add(()=>{E.speed=Qe.speed.toFixed(2),E.grounded=Qe.isGrounded?"yes":"no";const L=Qe.position;E.position=`${L.x.toFixed(1)}, ${L.y.toFixed(1)}, ${L.z.toFixed(1)}`,E.zone=jt.current?.name??"—",E.crossings=jt.crossings,E.triangles=lc.triangles;const N=pi.renderer.info.render;E.draws=N.calls,E.drawn=N.triangles.toLocaleString();const F=performance.memory;E.heap=F?`${(F.usedJSHeapSize/1048576).toFixed(0)} MB`:"unavailable",E.resident=`${jt.builtZones.length} / ${jt.evictions}`,E.room=Me.room??"open",P.reverb=Me.reverbKind==="fdn"?"fdn — tunable":"convolution — fixed",E.audio=fn===null?"rendering…":Me.context.state,E.gust=Me.weather.strength.toFixed(2),E.swell=Me.weather.swell.toFixed(2),E.machine=jt.sound?.find("mill")?.phase??"—";const H=Me.voiceCounts;E.emitters=jt.sound===null?"—":`${H.hrtf} / ${H.panned} / ${H.virtual} · ${jt.sound.occludedCount} occl`})}io.add((i,t)=>{Qe.update(i);const e=jt.current;e&&Qe.position.y<e.floor&&jt.respawn();const n=jt.update();mr.takeInteract()&&n&&jt.use(n);const o=Me.update(i,pi.camera);jt.updateSound(i,o),jM(Me.weather,t),pn.render(t),y4.update(),P1.update(i),_e.update()});Qe.update(0);pn.render(0);await _o.done();io.start();
