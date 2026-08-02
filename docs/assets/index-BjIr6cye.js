(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const bh="170",Wm=0,Ru=1,Xm=2,bf=1,Sf=2,Hn=3,fi=0,Ye=1,gn=2,$n=0,ws=1,ul=2,Cu=3,Pu=4,Ym=5,Ni=100,qm=101,$m=102,Zm=103,Km=104,jm=200,Jm=201,Qm=202,tg=203,dl=204,fl=205,eg=206,ng=207,ig=208,sg=209,og=210,rg=211,ag=212,cg=213,lg=214,pl=0,ml=1,gl=2,Ts=3,yl=4,vl=5,_l=6,wl=7,Sh=0,hg=1,ug=2,di=0,Ef=1,Tf=2,Af=3,Rf=4,dg=5,Cf=6,Pf=7,If=300,As=301,Rs=302,xl=303,Ml=304,ya=306,bo=1e3,Wn=1001,bl=1002,Ue=1003,fg=1004,Ho=1005,sn=1006,La=1007,ui=1008,Tn=1009,Lf=1010,Df=1011,So=1012,Eh=1013,Bi=1014,Xn=1015,pi=1016,Th=1017,Ah=1018,Cs=1020,Nf=35902,Uf=1021,Ff=1022,hn=1023,Of=1024,zf=1025,xs=1026,Ps=1027,Rh=1028,Ch=1029,kf=1030,Ph=1031,Ih=1033,Vr=33776,Wr=33777,Xr=33778,Yr=33779,Sl=35840,El=35841,Tl=35842,Al=35843,Rl=36196,Cl=37492,Pl=37496,Il=37808,Ll=37809,Dl=37810,Nl=37811,Ul=37812,Fl=37813,Ol=37814,zl=37815,kl=37816,Bl=37817,Hl=37818,Gl=37819,Vl=37820,Wl=37821,qr=36492,Xl=36494,Yl=36495,Bf=36283,ql=36284,$l=36285,Zl=36286,pg=3200,Hf=3201,Lh=0,mg=1,Vn="",nn="srgb",Os="srgb-linear",va="linear",de="srgb",$i=7680,Iu=519,gg=512,yg=513,vg=514,Gf=515,_g=516,wg=517,xg=518,Mg=519,Lu=35044,Du="300 es",Yn=2e3,jr=2001;class zs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const o=s.indexOf(e);o!==-1&&s.splice(o,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let o=0,r=s.length;o<r;o++)s[o].call(this,t);t.target=null}}}const Oe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Nu=1234567;const yo=Math.PI/180,Is=180/Math.PI;function Wi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Oe[i&255]+Oe[i>>8&255]+Oe[i>>16&255]+Oe[i>>24&255]+"-"+Oe[t&255]+Oe[t>>8&255]+"-"+Oe[t>>16&15|64]+Oe[t>>24&255]+"-"+Oe[e&63|128]+Oe[e>>8&255]+"-"+Oe[e>>16&255]+Oe[e>>24&255]+Oe[n&255]+Oe[n>>8&255]+Oe[n>>16&255]+Oe[n>>24&255]).toLowerCase()}function Ae(i,t,e){return Math.max(t,Math.min(e,i))}function Dh(i,t){return(i%t+t)%t}function bg(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Sg(i,t,e){return i!==t?(e-i)/(t-i):0}function vo(i,t,e){return(1-e)*i+e*t}function Eg(i,t,e,n){return vo(i,t,1-Math.exp(-e*n))}function Tg(i,t=1){return t-Math.abs(Dh(i,t*2)-t)}function Ag(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Rg(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Cg(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Pg(i,t){return i+Math.random()*(t-i)}function Ig(i){return i*(.5-Math.random())}function Lg(i){i!==void 0&&(Nu=i);let t=Nu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Dg(i){return i*yo}function Ng(i){return i*Is}function Ug(i){return(i&i-1)===0&&i!==0}function Fg(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Og(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function zg(i,t,e,n,s){const o=Math.cos,r=Math.sin,a=o(e/2),c=r(e/2),l=o((t+n)/2),h=r((t+n)/2),u=o((t-n)/2),f=r((t-n)/2),d=o((n-t)/2),g=r((n-t)/2);switch(s){case"XYX":i.set(a*h,c*u,c*f,a*l);break;case"YZY":i.set(c*f,a*h,c*u,a*l);break;case"ZXZ":i.set(c*u,c*f,a*h,a*l);break;case"XZX":i.set(a*h,c*g,c*d,a*l);break;case"YXY":i.set(c*d,a*h,c*g,a*l);break;case"ZYZ":i.set(c*g,c*d,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ps(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ve(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Da={DEG2RAD:yo,RAD2DEG:Is,generateUUID:Wi,clamp:Ae,euclideanModulo:Dh,mapLinear:bg,inverseLerp:Sg,lerp:vo,damp:Eg,pingpong:Tg,smoothstep:Ag,smootherstep:Rg,randInt:Cg,randFloat:Pg,randFloatSpread:Ig,seededRandom:Lg,degToRad:Dg,radToDeg:Ng,isPowerOfTwo:Ug,ceilPowerOfTwo:Fg,floorPowerOfTwo:Og,setQuaternionFromProperEuler:zg,normalize:Ve,denormalize:ps};class tt{constructor(t=0,e=0){tt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ae(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),o=this.x-t.x,r=this.y-t.y;return this.x=o*n-r*s+t.x,this.y=o*s+r*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Kt{constructor(t,e,n,s,o,r,a,c,l){Kt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,o,r,a,c,l)}set(t,e,n,s,o,r,a,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=o,h[5]=c,h[6]=n,h[7]=r,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,o=this.elements,r=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],f=n[2],d=n[5],g=n[8],y=s[0],m=s[3],p=s[6],_=s[1],v=s[4],w=s[7],b=s[2],S=s[5],E=s[8];return o[0]=r*y+a*_+c*b,o[3]=r*m+a*v+c*S,o[6]=r*p+a*w+c*E,o[1]=l*y+h*_+u*b,o[4]=l*m+h*v+u*S,o[7]=l*p+h*w+u*E,o[2]=f*y+d*_+g*b,o[5]=f*m+d*v+g*S,o[8]=f*p+d*w+g*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],r=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*r*h-e*a*l-n*o*h+n*a*c+s*o*l-s*r*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],r=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*r-a*l,f=a*c-h*o,d=l*o-r*c,g=e*u+n*f+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/g;return t[0]=u*y,t[1]=(s*l-h*n)*y,t[2]=(a*n-s*r)*y,t[3]=f*y,t[4]=(h*e-s*c)*y,t[5]=(s*o-a*e)*y,t[6]=d*y,t[7]=(n*c-l*e)*y,t[8]=(r*e-n*o)*y,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,o,r,a){const c=Math.cos(o),l=Math.sin(o);return this.set(n*c,n*l,-n*(c*r+l*a)+r+t,-s*l,s*c,-s*(-l*r+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Na.makeScale(t,e)),this}rotate(t){return this.premultiply(Na.makeRotation(-t)),this}translate(t,e){return this.premultiply(Na.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Na=new Kt;function Vf(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Jr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function kg(){const i=Jr("canvas");return i.style.display="block",i}const Uu={};function po(i){i in Uu||(Uu[i]=!0,console.warn(i))}function Bg(i,t,e){return new Promise(function(n,s){function o(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(o,e);break;default:n()}}setTimeout(o,e)})}function Hg(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Gg(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const re={enabled:!0,workingColorSpace:Os,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===de&&(i.r=Zn(i.r),i.g=Zn(i.g),i.b=Zn(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===de&&(i.r=Ms(i.r),i.g=Ms(i.g),i.b=Ms(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Vn?va:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Zn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ms(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Fu=[.64,.33,.3,.6,.15,.06],Ou=[.2126,.7152,.0722],zu=[.3127,.329],ku=new Kt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Bu=new Kt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);re.define({[Os]:{primaries:Fu,whitePoint:zu,transfer:va,toXYZ:ku,fromXYZ:Bu,luminanceCoefficients:Ou,workingColorSpaceConfig:{unpackColorSpace:nn},outputColorSpaceConfig:{drawingBufferColorSpace:nn}},[nn]:{primaries:Fu,whitePoint:zu,transfer:de,toXYZ:ku,fromXYZ:Bu,luminanceCoefficients:Ou,outputColorSpaceConfig:{drawingBufferColorSpace:nn}}});let Zi;class Vg{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Zi===void 0&&(Zi=Jr("canvas")),Zi.width=t.width,Zi.height=t.height;const n=Zi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Zi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Jr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),o=s.data;for(let r=0;r<o.length;r++)o[r]=Zn(o[r]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Zn(e[n]/255)*255):e[n]=Zn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Wg=0;class Wf{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Wg++}),this.uuid=Wi(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let o;if(Array.isArray(s)){o=[];for(let r=0,a=s.length;r<a;r++)s[r].isDataTexture?o.push(Ua(s[r].image)):o.push(Ua(s[r]))}else o=Ua(s);n.url=o}return e||(t.images[this.uuid]=n),n}}function Ua(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Vg.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Xg=0;class qe extends zs{constructor(t=qe.DEFAULT_IMAGE,e=qe.DEFAULT_MAPPING,n=Wn,s=Wn,o=sn,r=ui,a=hn,c=Tn,l=qe.DEFAULT_ANISOTROPY,h=Vn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Xg++}),this.uuid=Wi(),this.name="",this.source=new Wf(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=o,this.minFilter=r,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new tt(0,0),this.repeat=new tt(1,1),this.center=new tt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Kt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==If)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case bo:t.x=t.x-Math.floor(t.x);break;case Wn:t.x=t.x<0?0:1;break;case bl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case bo:t.y=t.y-Math.floor(t.y);break;case Wn:t.y=t.y<0?0:1;break;case bl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}qe.DEFAULT_IMAGE=null;qe.DEFAULT_MAPPING=If;qe.DEFAULT_ANISOTROPY=1;class fe{constructor(t=0,e=0,n=0,s=1){fe.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,o=this.w,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s+r[12]*o,this.y=r[1]*e+r[5]*n+r[9]*s+r[13]*o,this.z=r[2]*e+r[6]*n+r[10]*s+r[14]*o,this.w=r[3]*e+r[7]*n+r[11]*s+r[15]*o,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,o;const c=t.elements,l=c[0],h=c[4],u=c[8],f=c[1],d=c[5],g=c[9],y=c[2],m=c[6],p=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+y)<.1&&Math.abs(g+m)<.1&&Math.abs(l+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const v=(l+1)/2,w=(d+1)/2,b=(p+1)/2,S=(h+f)/4,E=(u+y)/4,T=(g+m)/4;return v>w&&v>b?v<.01?(n=0,s=.707106781,o=.707106781):(n=Math.sqrt(v),s=S/n,o=E/n):w>b?w<.01?(n=.707106781,s=0,o=.707106781):(s=Math.sqrt(w),n=S/s,o=T/s):b<.01?(n=.707106781,s=.707106781,o=0):(o=Math.sqrt(b),n=E/o,s=T/o),this.set(n,s,o,e),this}let _=Math.sqrt((m-g)*(m-g)+(u-y)*(u-y)+(f-h)*(f-h));return Math.abs(_)<.001&&(_=1),this.x=(m-g)/_,this.y=(u-y)/_,this.z=(f-h)/_,this.w=Math.acos((l+d+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Yg extends zs{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new fe(0,0,t,e),this.scissorTest=!1,this.viewport=new fe(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:sn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const o=new qe(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);o.flipY=!1,o.generateMipmaps=n.generateMipmaps,o.internalFormat=n.internalFormat,this.textures=[];const r=n.count;for(let a=0;a<r;a++)this.textures[a]=o.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,o=this.textures.length;s<o;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Wf(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class An extends Yg{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Xf extends qe{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ue,this.minFilter=Ue,this.wrapR=Wn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class qg extends qe{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ue,this.minFilter=Ue,this.wrapR=Wn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class jn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,o,r,a){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3];const f=o[r+0],d=o[r+1],g=o[r+2],y=o[r+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=f,t[e+1]=d,t[e+2]=g,t[e+3]=y;return}if(u!==y||c!==f||l!==d||h!==g){let m=1-a;const p=c*f+l*d+h*g+u*y,_=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){const b=Math.sqrt(v),S=Math.atan2(b,p*_);m=Math.sin(m*S)/b,a=Math.sin(a*S)/b}const w=a*_;if(c=c*m+f*w,l=l*m+d*w,h=h*m+g*w,u=u*m+y*w,m===1-a){const b=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=b,l*=b,h*=b,u*=b}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,o,r){const a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=o[r],f=o[r+1],d=o[r+2],g=o[r+3];return t[e]=a*g+h*u+c*d-l*f,t[e+1]=c*g+h*f+l*u-a*d,t[e+2]=l*g+h*d+a*f-c*u,t[e+3]=h*g-a*u-c*f-l*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,o=t._z,r=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),u=a(o/2),f=c(n/2),d=c(s/2),g=c(o/2);switch(r){case"XYZ":this._x=f*h*u+l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u-f*d*g;break;case"YXZ":this._x=f*h*u+l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u+f*d*g;break;case"ZXY":this._x=f*h*u-l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u-f*d*g;break;case"ZYX":this._x=f*h*u-l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u+f*d*g;break;case"YZX":this._x=f*h*u+l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u-f*d*g;break;case"XZY":this._x=f*h*u-l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],o=e[8],r=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],f=n+a+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-c)*d,this._y=(o-l)*d,this._z=(r-s)*d}else if(n>a&&n>u){const d=2*Math.sqrt(1+n-a-u);this._w=(h-c)/d,this._x=.25*d,this._y=(s+r)/d,this._z=(o+l)/d}else if(a>u){const d=2*Math.sqrt(1+a-n-u);this._w=(o-l)/d,this._x=(s+r)/d,this._y=.25*d,this._z=(c+h)/d}else{const d=2*Math.sqrt(1+u-n-a);this._w=(r-s)/d,this._x=(o+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ae(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,o=t._z,r=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+r*a+s*l-o*c,this._y=s*h+r*c+o*a-n*l,this._z=o*h+r*l+n*c-s*a,this._w=r*h-n*a-s*c-o*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,o=this._z,r=this._w;let a=r*t._w+n*t._x+s*t._y+o*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=r,this._x=n,this._y=s,this._z=o,this;const c=1-a*a;if(c<=Number.EPSILON){const d=1-e;return this._w=d*r+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*o+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,f=Math.sin(e*h)/l;return this._w=r*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=o*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),o=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),o*Math.sin(e),o*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{constructor(t=0,e=0,n=0){R.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Hu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Hu.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[3]*n+o[6]*s,this.y=o[1]*e+o[4]*n+o[7]*s,this.z=o[2]*e+o[5]*n+o[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,o=t.elements,r=1/(o[3]*e+o[7]*n+o[11]*s+o[15]);return this.x=(o[0]*e+o[4]*n+o[8]*s+o[12])*r,this.y=(o[1]*e+o[5]*n+o[9]*s+o[13])*r,this.z=(o[2]*e+o[6]*n+o[10]*s+o[14])*r,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,o=t.x,r=t.y,a=t.z,c=t.w,l=2*(r*s-a*n),h=2*(a*e-o*s),u=2*(o*n-r*e);return this.x=e+c*l+r*u-a*h,this.y=n+c*h+a*l-o*u,this.z=s+c*u+o*h-r*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s,this.y=o[1]*e+o[5]*n+o[9]*s,this.z=o[2]*e+o[6]*n+o[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,o=t.z,r=e.x,a=e.y,c=e.z;return this.x=s*c-o*a,this.y=o*r-n*c,this.z=n*a-s*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Fa.copy(this).projectOnVector(t),this.sub(Fa)}reflect(t){return this.sub(Fa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ae(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Fa=new R,Hu=new jn;class Hi{constructor(t=new R(1/0,1/0,1/0),e=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(fn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(fn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=fn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const o=n.getAttribute("position");if(e===!0&&o!==void 0&&t.isInstancedMesh!==!0)for(let r=0,a=o.count;r<a;r++)t.isMesh===!0?t.getVertexPosition(r,fn):fn.fromBufferAttribute(o,r),fn.applyMatrix4(t.matrixWorld),this.expandByPoint(fn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Go.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Go.copy(n.boundingBox)),Go.applyMatrix4(t.matrixWorld),this.union(Go)}const s=t.children;for(let o=0,r=s.length;o<r;o++)this.expandByObject(s[o],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,fn),fn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Xs),Vo.subVectors(this.max,Xs),Ki.subVectors(t.a,Xs),ji.subVectors(t.b,Xs),Ji.subVectors(t.c,Xs),ii.subVectors(ji,Ki),si.subVectors(Ji,ji),Mi.subVectors(Ki,Ji);let e=[0,-ii.z,ii.y,0,-si.z,si.y,0,-Mi.z,Mi.y,ii.z,0,-ii.x,si.z,0,-si.x,Mi.z,0,-Mi.x,-ii.y,ii.x,0,-si.y,si.x,0,-Mi.y,Mi.x,0];return!Oa(e,Ki,ji,Ji,Vo)||(e=[1,0,0,0,1,0,0,0,1],!Oa(e,Ki,ji,Ji,Vo))?!1:(Wo.crossVectors(ii,si),e=[Wo.x,Wo.y,Wo.z],Oa(e,Ki,ji,Ji,Vo))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,fn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(fn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Nn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Nn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Nn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Nn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Nn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Nn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Nn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Nn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Nn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Nn=[new R,new R,new R,new R,new R,new R,new R,new R],fn=new R,Go=new Hi,Ki=new R,ji=new R,Ji=new R,ii=new R,si=new R,Mi=new R,Xs=new R,Vo=new R,Wo=new R,bi=new R;function Oa(i,t,e,n,s){for(let o=0,r=i.length-3;o<=r;o+=3){bi.fromArray(i,o);const a=s.x*Math.abs(bi.x)+s.y*Math.abs(bi.y)+s.z*Math.abs(bi.z),c=t.dot(bi),l=e.dot(bi),h=n.dot(bi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const $g=new Hi,Ys=new R,za=new R;class ks{constructor(t=new R,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):$g.setFromPoints(t).getCenter(n);let s=0;for(let o=0,r=t.length;o<r;o++)s=Math.max(s,n.distanceToSquared(t[o]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ys.subVectors(t,this.center);const e=Ys.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Ys,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(za.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ys.copy(t.center).add(za)),this.expandByPoint(Ys.copy(t.center).sub(za))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Un=new R,ka=new R,Xo=new R,oi=new R,Ba=new R,Yo=new R,Ha=new R;class Lo{constructor(t=new R,e=new R(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Un)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Un.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Un.copy(this.origin).addScaledVector(this.direction,e),Un.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){ka.copy(t).add(e).multiplyScalar(.5),Xo.copy(e).sub(t).normalize(),oi.copy(this.origin).sub(ka);const o=t.distanceTo(e)*.5,r=-this.direction.dot(Xo),a=oi.dot(this.direction),c=-oi.dot(Xo),l=oi.lengthSq(),h=Math.abs(1-r*r);let u,f,d,g;if(h>0)if(u=r*c-a,f=r*a-c,g=o*h,u>=0)if(f>=-g)if(f<=g){const y=1/h;u*=y,f*=y,d=u*(u+r*f+2*a)+f*(r*u+f+2*c)+l}else f=o,u=Math.max(0,-(r*f+a)),d=-u*u+f*(f+2*c)+l;else f=-o,u=Math.max(0,-(r*f+a)),d=-u*u+f*(f+2*c)+l;else f<=-g?(u=Math.max(0,-(-r*o+a)),f=u>0?-o:Math.min(Math.max(-o,-c),o),d=-u*u+f*(f+2*c)+l):f<=g?(u=0,f=Math.min(Math.max(-o,-c),o),d=f*(f+2*c)+l):(u=Math.max(0,-(r*o+a)),f=u>0?o:Math.min(Math.max(-o,-c),o),d=-u*u+f*(f+2*c)+l);else f=r>0?-o:o,u=Math.max(0,-(r*f+a)),d=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ka).addScaledVector(Xo,f),d}intersectSphere(t,e){Un.subVectors(t.center,this.origin);const n=Un.dot(this.direction),s=Un.dot(Un)-n*n,o=t.radius*t.radius;if(s>o)return null;const r=Math.sqrt(o-s),a=n-r,c=n+r;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,o,r,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),h>=0?(o=(t.min.y-f.y)*h,r=(t.max.y-f.y)*h):(o=(t.max.y-f.y)*h,r=(t.min.y-f.y)*h),n>r||o>s||((o>n||isNaN(n))&&(n=o),(r<s||isNaN(s))&&(s=r),u>=0?(a=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(a=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Un)!==null}intersectTriangle(t,e,n,s,o){Ba.subVectors(e,t),Yo.subVectors(n,t),Ha.crossVectors(Ba,Yo);let r=this.direction.dot(Ha),a;if(r>0){if(s)return null;a=1}else if(r<0)a=-1,r=-r;else return null;oi.subVectors(this.origin,t);const c=a*this.direction.dot(Yo.crossVectors(oi,Yo));if(c<0)return null;const l=a*this.direction.dot(Ba.cross(oi));if(l<0||c+l>r)return null;const h=-a*oi.dot(Ha);return h<0?null:this.at(h/r,o)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class pe{constructor(t,e,n,s,o,r,a,c,l,h,u,f,d,g,y,m){pe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,o,r,a,c,l,h,u,f,d,g,y,m)}set(t,e,n,s,o,r,a,c,l,h,u,f,d,g,y,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=o,p[5]=r,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=g,p[11]=y,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new pe().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Qi.setFromMatrixColumn(t,0).length(),o=1/Qi.setFromMatrixColumn(t,1).length(),r=1/Qi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*o,e[5]=n[5]*o,e[6]=n[6]*o,e[7]=0,e[8]=n[8]*r,e[9]=n[9]*r,e[10]=n[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,o=t.z,r=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(o),u=Math.sin(o);if(t.order==="XYZ"){const f=r*h,d=r*u,g=a*h,y=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=d+g*l,e[5]=f-y*l,e[9]=-a*c,e[2]=y-f*l,e[6]=g+d*l,e[10]=r*c}else if(t.order==="YXZ"){const f=c*h,d=c*u,g=l*h,y=l*u;e[0]=f+y*a,e[4]=g*a-d,e[8]=r*l,e[1]=r*u,e[5]=r*h,e[9]=-a,e[2]=d*a-g,e[6]=y+f*a,e[10]=r*c}else if(t.order==="ZXY"){const f=c*h,d=c*u,g=l*h,y=l*u;e[0]=f-y*a,e[4]=-r*u,e[8]=g+d*a,e[1]=d+g*a,e[5]=r*h,e[9]=y-f*a,e[2]=-r*l,e[6]=a,e[10]=r*c}else if(t.order==="ZYX"){const f=r*h,d=r*u,g=a*h,y=a*u;e[0]=c*h,e[4]=g*l-d,e[8]=f*l+y,e[1]=c*u,e[5]=y*l+f,e[9]=d*l-g,e[2]=-l,e[6]=a*c,e[10]=r*c}else if(t.order==="YZX"){const f=r*c,d=r*l,g=a*c,y=a*l;e[0]=c*h,e[4]=y-f*u,e[8]=g*u+d,e[1]=u,e[5]=r*h,e[9]=-a*h,e[2]=-l*h,e[6]=d*u+g,e[10]=f-y*u}else if(t.order==="XZY"){const f=r*c,d=r*l,g=a*c,y=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=f*u+y,e[5]=r*h,e[9]=d*u-g,e[2]=g*u-d,e[6]=a*h,e[10]=y*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Zg,t,Kg)}lookAt(t,e,n){const s=this.elements;return Qe.subVectors(t,e),Qe.lengthSq()===0&&(Qe.z=1),Qe.normalize(),ri.crossVectors(n,Qe),ri.lengthSq()===0&&(Math.abs(n.z)===1?Qe.x+=1e-4:Qe.z+=1e-4,Qe.normalize(),ri.crossVectors(n,Qe)),ri.normalize(),qo.crossVectors(Qe,ri),s[0]=ri.x,s[4]=qo.x,s[8]=Qe.x,s[1]=ri.y,s[5]=qo.y,s[9]=Qe.y,s[2]=ri.z,s[6]=qo.z,s[10]=Qe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,o=this.elements,r=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],f=n[9],d=n[13],g=n[2],y=n[6],m=n[10],p=n[14],_=n[3],v=n[7],w=n[11],b=n[15],S=s[0],E=s[4],T=s[8],x=s[12],M=s[1],A=s[5],P=s[9],C=s[13],F=s[2],N=s[6],D=s[10],B=s[14],H=s[3],V=s[7],et=s[11],lt=s[15];return o[0]=r*S+a*M+c*F+l*H,o[4]=r*E+a*A+c*N+l*V,o[8]=r*T+a*P+c*D+l*et,o[12]=r*x+a*C+c*B+l*lt,o[1]=h*S+u*M+f*F+d*H,o[5]=h*E+u*A+f*N+d*V,o[9]=h*T+u*P+f*D+d*et,o[13]=h*x+u*C+f*B+d*lt,o[2]=g*S+y*M+m*F+p*H,o[6]=g*E+y*A+m*N+p*V,o[10]=g*T+y*P+m*D+p*et,o[14]=g*x+y*C+m*B+p*lt,o[3]=_*S+v*M+w*F+b*H,o[7]=_*E+v*A+w*N+b*V,o[11]=_*T+v*P+w*D+b*et,o[15]=_*x+v*C+w*B+b*lt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],o=t[12],r=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],f=t[10],d=t[14],g=t[3],y=t[7],m=t[11],p=t[15];return g*(+o*c*u-s*l*u-o*a*f+n*l*f+s*a*d-n*c*d)+y*(+e*c*d-e*l*f+o*r*f-s*r*d+s*l*h-o*c*h)+m*(+e*l*u-e*a*d-o*r*u+n*r*d+o*a*h-n*l*h)+p*(-s*a*h-e*c*u+e*a*f+s*r*u-n*r*f+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],r=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],f=t[10],d=t[11],g=t[12],y=t[13],m=t[14],p=t[15],_=u*m*l-y*f*l+y*c*d-a*m*d-u*c*p+a*f*p,v=g*f*l-h*m*l-g*c*d+r*m*d+h*c*p-r*f*p,w=h*y*l-g*u*l+g*a*d-r*y*d-h*a*p+r*u*p,b=g*u*c-h*y*c-g*a*f+r*y*f+h*a*m-r*u*m,S=e*_+n*v+s*w+o*b;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/S;return t[0]=_*E,t[1]=(y*f*o-u*m*o-y*s*d+n*m*d+u*s*p-n*f*p)*E,t[2]=(a*m*o-y*c*o+y*s*l-n*m*l-a*s*p+n*c*p)*E,t[3]=(u*c*o-a*f*o-u*s*l+n*f*l+a*s*d-n*c*d)*E,t[4]=v*E,t[5]=(h*m*o-g*f*o+g*s*d-e*m*d-h*s*p+e*f*p)*E,t[6]=(g*c*o-r*m*o-g*s*l+e*m*l+r*s*p-e*c*p)*E,t[7]=(r*f*o-h*c*o+h*s*l-e*f*l-r*s*d+e*c*d)*E,t[8]=w*E,t[9]=(g*u*o-h*y*o-g*n*d+e*y*d+h*n*p-e*u*p)*E,t[10]=(r*y*o-g*a*o+g*n*l-e*y*l-r*n*p+e*a*p)*E,t[11]=(h*a*o-r*u*o-h*n*l+e*u*l+r*n*d-e*a*d)*E,t[12]=b*E,t[13]=(h*y*s-g*u*s+g*n*f-e*y*f-h*n*m+e*u*m)*E,t[14]=(g*a*s-r*y*s-g*n*c+e*y*c+r*n*m-e*a*m)*E,t[15]=(r*u*s-h*a*s+h*n*c-e*u*c-r*n*f+e*a*f)*E,this}scale(t){const e=this.elements,n=t.x,s=t.y,o=t.z;return e[0]*=n,e[4]*=s,e[8]*=o,e[1]*=n,e[5]*=s,e[9]*=o,e[2]*=n,e[6]*=s,e[10]*=o,e[3]*=n,e[7]*=s,e[11]*=o,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),o=1-n,r=t.x,a=t.y,c=t.z,l=o*r,h=o*a;return this.set(l*r+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*r,0,l*c-s*a,h*c+s*r,o*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,o,r){return this.set(1,n,o,0,t,1,r,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,o=e._x,r=e._y,a=e._z,c=e._w,l=o+o,h=r+r,u=a+a,f=o*l,d=o*h,g=o*u,y=r*h,m=r*u,p=a*u,_=c*l,v=c*h,w=c*u,b=n.x,S=n.y,E=n.z;return s[0]=(1-(y+p))*b,s[1]=(d+w)*b,s[2]=(g-v)*b,s[3]=0,s[4]=(d-w)*S,s[5]=(1-(f+p))*S,s[6]=(m+_)*S,s[7]=0,s[8]=(g+v)*E,s[9]=(m-_)*E,s[10]=(1-(f+y))*E,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let o=Qi.set(s[0],s[1],s[2]).length();const r=Qi.set(s[4],s[5],s[6]).length(),a=Qi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(o=-o),t.x=s[12],t.y=s[13],t.z=s[14],pn.copy(this);const l=1/o,h=1/r,u=1/a;return pn.elements[0]*=l,pn.elements[1]*=l,pn.elements[2]*=l,pn.elements[4]*=h,pn.elements[5]*=h,pn.elements[6]*=h,pn.elements[8]*=u,pn.elements[9]*=u,pn.elements[10]*=u,e.setFromRotationMatrix(pn),n.x=o,n.y=r,n.z=a,this}makePerspective(t,e,n,s,o,r,a=Yn){const c=this.elements,l=2*o/(e-t),h=2*o/(n-s),u=(e+t)/(e-t),f=(n+s)/(n-s);let d,g;if(a===Yn)d=-(r+o)/(r-o),g=-2*r*o/(r-o);else if(a===jr)d=-r/(r-o),g=-r*o/(r-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=d,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,o,r,a=Yn){const c=this.elements,l=1/(e-t),h=1/(n-s),u=1/(r-o),f=(e+t)*l,d=(n+s)*h;let g,y;if(a===Yn)g=(r+o)*u,y=-2*u;else if(a===jr)g=o*u,y=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-d,c[2]=0,c[6]=0,c[10]=y,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Qi=new R,pn=new pe,Zg=new R(0,0,0),Kg=new R(1,1,1),ri=new R,qo=new R,Qe=new R,Gu=new pe,Vu=new jn;class Rn{constructor(t=0,e=0,n=0,s=Rn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,o=s[0],r=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Ae(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-r,o)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ae(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,o),this._z=0);break;case"ZXY":this._x=Math.asin(Ae(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-r,l)):(this._y=0,this._z=Math.atan2(c,o));break;case"ZYX":this._y=Math.asin(-Ae(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,o)):(this._x=0,this._z=Math.atan2(-r,l));break;case"YZX":this._z=Math.asin(Ae(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,o)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Ae(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,o)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Gu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Gu,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Vu.setFromEuler(this),this.setFromQuaternion(Vu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Rn.DEFAULT_ORDER="XYZ";class _a{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let jg=0;const Wu=new R,ts=new jn,Fn=new pe,$o=new R,qs=new R,Jg=new R,Qg=new jn,Xu=new R(1,0,0),Yu=new R(0,1,0),qu=new R(0,0,1),$u={type:"added"},t1={type:"removed"},es={type:"childadded",child:null},Ga={type:"childremoved",child:null};class be extends zs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:jg++}),this.uuid=Wi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=be.DEFAULT_UP.clone();const t=new R,e=new Rn,n=new jn,s=new R(1,1,1);function o(){n.setFromEuler(e,!1)}function r(){e.setFromQuaternion(n,void 0,!1)}e._onChange(o),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new pe},normalMatrix:{value:new Kt}}),this.matrix=new pe,this.matrixWorld=new pe,this.matrixAutoUpdate=be.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new _a,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ts.setFromAxisAngle(t,e),this.quaternion.multiply(ts),this}rotateOnWorldAxis(t,e){return ts.setFromAxisAngle(t,e),this.quaternion.premultiply(ts),this}rotateX(t){return this.rotateOnAxis(Xu,t)}rotateY(t){return this.rotateOnAxis(Yu,t)}rotateZ(t){return this.rotateOnAxis(qu,t)}translateOnAxis(t,e){return Wu.copy(t).applyQuaternion(this.quaternion),this.position.add(Wu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Xu,t)}translateY(t){return this.translateOnAxis(Yu,t)}translateZ(t){return this.translateOnAxis(qu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Fn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?$o.copy(t):$o.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),qs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Fn.lookAt(qs,$o,this.up):Fn.lookAt($o,qs,this.up),this.quaternion.setFromRotationMatrix(Fn),s&&(Fn.extractRotation(s.matrixWorld),ts.setFromRotationMatrix(Fn),this.quaternion.premultiply(ts.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent($u),es.child=t,this.dispatchEvent(es),es.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(t1),Ga.child=t,this.dispatchEvent(Ga),Ga.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Fn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Fn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Fn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent($u),es.child=t,this.dispatchEvent(es),es.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const r=this.children[n].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let o=0,r=s.length;o<r;o++)s[o].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qs,t,Jg),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qs,Qg,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let o=0,r=s.length;o<r;o++)s[o].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function o(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=o(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];o(t.shapes,u)}else o(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(o(t.materials,this.material[c]));s.material=a}else s.material=o(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(o(t.animations,c))}}if(e){const a=r(t.geometries),c=r(t.materials),l=r(t.textures),h=r(t.images),u=r(t.shapes),f=r(t.skeletons),d=r(t.animations),g=r(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=s,n;function r(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}be.DEFAULT_UP=new R(0,1,0);be.DEFAULT_MATRIX_AUTO_UPDATE=!0;be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const mn=new R,On=new R,Va=new R,zn=new R,ns=new R,is=new R,Zu=new R,Wa=new R,Xa=new R,Ya=new R,qa=new fe,$a=new fe,Za=new fe;class ln{constructor(t=new R,e=new R,n=new R){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),mn.subVectors(t,e),s.cross(mn);const o=s.lengthSq();return o>0?s.multiplyScalar(1/Math.sqrt(o)):s.set(0,0,0)}static getBarycoord(t,e,n,s,o){mn.subVectors(s,e),On.subVectors(n,e),Va.subVectors(t,e);const r=mn.dot(mn),a=mn.dot(On),c=mn.dot(Va),l=On.dot(On),h=On.dot(Va),u=r*l-a*a;if(u===0)return o.set(0,0,0),null;const f=1/u,d=(l*c-a*h)*f,g=(r*h-a*c)*f;return o.set(1-d-g,g,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,zn)===null?!1:zn.x>=0&&zn.y>=0&&zn.x+zn.y<=1}static getInterpolation(t,e,n,s,o,r,a,c){return this.getBarycoord(t,e,n,s,zn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(o,zn.x),c.addScaledVector(r,zn.y),c.addScaledVector(a,zn.z),c)}static getInterpolatedAttribute(t,e,n,s,o,r){return qa.setScalar(0),$a.setScalar(0),Za.setScalar(0),qa.fromBufferAttribute(t,e),$a.fromBufferAttribute(t,n),Za.fromBufferAttribute(t,s),r.setScalar(0),r.addScaledVector(qa,o.x),r.addScaledVector($a,o.y),r.addScaledVector(Za,o.z),r}static isFrontFacing(t,e,n,s){return mn.subVectors(n,e),On.subVectors(t,e),mn.cross(On).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return mn.subVectors(this.c,this.b),On.subVectors(this.a,this.b),mn.cross(On).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return ln.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return ln.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,o){return ln.getInterpolation(t,this.a,this.b,this.c,e,n,s,o)}containsPoint(t){return ln.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return ln.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,o=this.c;let r,a;ns.subVectors(s,n),is.subVectors(o,n),Wa.subVectors(t,n);const c=ns.dot(Wa),l=is.dot(Wa);if(c<=0&&l<=0)return e.copy(n);Xa.subVectors(t,s);const h=ns.dot(Xa),u=is.dot(Xa);if(h>=0&&u<=h)return e.copy(s);const f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return r=c/(c-h),e.copy(n).addScaledVector(ns,r);Ya.subVectors(t,o);const d=ns.dot(Ya),g=is.dot(Ya);if(g>=0&&d<=g)return e.copy(o);const y=d*l-c*g;if(y<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(is,a);const m=h*g-d*u;if(m<=0&&u-h>=0&&d-g>=0)return Zu.subVectors(o,s),a=(u-h)/(u-h+(d-g)),e.copy(s).addScaledVector(Zu,a);const p=1/(m+y+f);return r=y*p,a=f*p,e.copy(n).addScaledVector(ns,r).addScaledVector(is,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Yf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ai={h:0,s:0,l:0},Zo={h:0,s:0,l:0};function Ka(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Yt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=nn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,re.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=re.workingColorSpace){return this.r=t,this.g=e,this.b=n,re.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=re.workingColorSpace){if(t=Dh(t,1),e=Ae(e,0,1),n=Ae(n,0,1),e===0)this.r=this.g=this.b=n;else{const o=n<=.5?n*(1+e):n+e-n*e,r=2*n-o;this.r=Ka(r,o,t+1/3),this.g=Ka(r,o,t),this.b=Ka(r,o,t-1/3)}return re.toWorkingColorSpace(this,s),this}setStyle(t,e=nn){function n(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let o;const r=s[1],a=s[2];switch(r){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,e);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,e);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const o=s[1],r=o.length;if(r===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(o,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=nn){const n=Yf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Zn(t.r),this.g=Zn(t.g),this.b=Zn(t.b),this}copyLinearToSRGB(t){return this.r=Ms(t.r),this.g=Ms(t.g),this.b=Ms(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=nn){return re.fromWorkingColorSpace(ze.copy(this),t),Math.round(Ae(ze.r*255,0,255))*65536+Math.round(Ae(ze.g*255,0,255))*256+Math.round(Ae(ze.b*255,0,255))}getHexString(t=nn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=re.workingColorSpace){re.fromWorkingColorSpace(ze.copy(this),e);const n=ze.r,s=ze.g,o=ze.b,r=Math.max(n,s,o),a=Math.min(n,s,o);let c,l;const h=(a+r)/2;if(a===r)c=0,l=0;else{const u=r-a;switch(l=h<=.5?u/(r+a):u/(2-r-a),r){case n:c=(s-o)/u+(s<o?6:0);break;case s:c=(o-n)/u+2;break;case o:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=re.workingColorSpace){return re.fromWorkingColorSpace(ze.copy(this),e),t.r=ze.r,t.g=ze.g,t.b=ze.b,t}getStyle(t=nn){re.fromWorkingColorSpace(ze.copy(this),t);const e=ze.r,n=ze.g,s=ze.b;return t!==nn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(ai),this.setHSL(ai.h+t,ai.s+e,ai.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ai),t.getHSL(Zo);const n=vo(ai.h,Zo.h,e),s=vo(ai.s,Zo.s,e),o=vo(ai.l,Zo.l,e);return this.setHSL(n,s,o),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,o=t.elements;return this.r=o[0]*e+o[3]*n+o[6]*s,this.g=o[1]*e+o[4]*n+o[7]*s,this.b=o[2]*e+o[5]*n+o[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const ze=new Yt;Yt.NAMES=Yf;let e1=0;class _i extends zs{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:e1++}),this.uuid=Wi(),this.name="",this.blending=ws,this.side=fi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=dl,this.blendDst=fl,this.blendEquation=Ni,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Yt(0,0,0),this.blendAlpha=0,this.depthFunc=Ts,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Iu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=$i,this.stencilZFail=$i,this.stencilZPass=$i,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ws&&(n.blending=this.blending),this.side!==fi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==dl&&(n.blendSrc=this.blendSrc),this.blendDst!==fl&&(n.blendDst=this.blendDst),this.blendEquation!==Ni&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ts&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Iu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==$i&&(n.stencilFail=this.stencilFail),this.stencilZFail!==$i&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==$i&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(o){const r=[];for(const a in o){const c=o[a];delete c.metadata,r.push(c)}return r}if(e){const o=s(t.textures),r=s(t.images);o.length>0&&(n.textures=o),r.length>0&&(n.images=r)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let o=0;o!==s;++o)n[o]=e[o].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Do extends _i{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Rn,this.combine=Sh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ee=new R,Ko=new tt;class je{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Lu,this.updateRanges=[],this.gpuType=Xn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,o=this.itemSize;s<o;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Ko.fromBufferAttribute(this,e),Ko.applyMatrix3(t),this.setXY(e,Ko.x,Ko.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix3(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix4(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyNormalMatrix(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.transformDirection(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=ps(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ve(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ps(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ps(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ps(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ps(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array),s=Ve(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,o){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array),s=Ve(s,this.array),o=Ve(o,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=o,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Lu&&(t.usage=this.usage),t}}class qf extends je{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class $f extends je{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ae extends je{constructor(t,e,n){super(new Float32Array(t),e,n)}}let n1=0;const an=new pe,ja=new be,ss=new R,tn=new Hi,$s=new Hi,Le=new R;class Ie extends zs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:n1++}),this.uuid=Wi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Vf(t)?$f:qf)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const o=new Kt().getNormalMatrix(t);n.applyNormalMatrix(o),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return an.makeRotationFromQuaternion(t),this.applyMatrix4(an),this}rotateX(t){return an.makeRotationX(t),this.applyMatrix4(an),this}rotateY(t){return an.makeRotationY(t),this.applyMatrix4(an),this}rotateZ(t){return an.makeRotationZ(t),this.applyMatrix4(an),this}translate(t,e,n){return an.makeTranslation(t,e,n),this.applyMatrix4(an),this}scale(t,e,n){return an.makeScale(t,e,n),this.applyMatrix4(an),this}lookAt(t){return ja.lookAt(t),ja.updateMatrix(),this.applyMatrix4(ja.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ss).negate(),this.translate(ss.x,ss.y,ss.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,o=t.length;s<o;s++){const r=t[s];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new ae(n,3))}else{for(let n=0,s=e.count;n<s;n++){const o=t[n];e.setXYZ(n,o.x,o.y,o.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Hi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const o=e[n];tn.setFromBufferAttribute(o),this.morphTargetsRelative?(Le.addVectors(this.boundingBox.min,tn.min),this.boundingBox.expandByPoint(Le),Le.addVectors(this.boundingBox.max,tn.max),this.boundingBox.expandByPoint(Le)):(this.boundingBox.expandByPoint(tn.min),this.boundingBox.expandByPoint(tn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ks);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(t){const n=this.boundingSphere.center;if(tn.setFromBufferAttribute(t),e)for(let o=0,r=e.length;o<r;o++){const a=e[o];$s.setFromBufferAttribute(a),this.morphTargetsRelative?(Le.addVectors(tn.min,$s.min),tn.expandByPoint(Le),Le.addVectors(tn.max,$s.max),tn.expandByPoint(Le)):(tn.expandByPoint($s.min),tn.expandByPoint($s.max))}tn.getCenter(n);let s=0;for(let o=0,r=t.count;o<r;o++)Le.fromBufferAttribute(t,o),s=Math.max(s,n.distanceToSquared(Le));if(e)for(let o=0,r=e.length;o<r;o++){const a=e[o],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Le.fromBufferAttribute(a,l),c&&(ss.fromBufferAttribute(t,l),Le.add(ss)),s=Math.max(s,n.distanceToSquared(Le))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,o=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new je(new Float32Array(4*n.count),4));const r=this.getAttribute("tangent"),a=[],c=[];for(let T=0;T<n.count;T++)a[T]=new R,c[T]=new R;const l=new R,h=new R,u=new R,f=new tt,d=new tt,g=new tt,y=new R,m=new R;function p(T,x,M){l.fromBufferAttribute(n,T),h.fromBufferAttribute(n,x),u.fromBufferAttribute(n,M),f.fromBufferAttribute(o,T),d.fromBufferAttribute(o,x),g.fromBufferAttribute(o,M),h.sub(l),u.sub(l),d.sub(f),g.sub(f);const A=1/(d.x*g.y-g.x*d.y);isFinite(A)&&(y.copy(h).multiplyScalar(g.y).addScaledVector(u,-d.y).multiplyScalar(A),m.copy(u).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(A),a[T].add(y),a[x].add(y),a[M].add(y),c[T].add(m),c[x].add(m),c[M].add(m))}let _=this.groups;_.length===0&&(_=[{start:0,count:t.count}]);for(let T=0,x=_.length;T<x;++T){const M=_[T],A=M.start,P=M.count;for(let C=A,F=A+P;C<F;C+=3)p(t.getX(C+0),t.getX(C+1),t.getX(C+2))}const v=new R,w=new R,b=new R,S=new R;function E(T){b.fromBufferAttribute(s,T),S.copy(b);const x=a[T];v.copy(x),v.sub(b.multiplyScalar(b.dot(x))).normalize(),w.crossVectors(S,x);const A=w.dot(c[T])<0?-1:1;r.setXYZW(T,v.x,v.y,v.z,A)}for(let T=0,x=_.length;T<x;++T){const M=_[T],A=M.start,P=M.count;for(let C=A,F=A+P;C<F;C+=3)E(t.getX(C+0)),E(t.getX(C+1)),E(t.getX(C+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new je(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const s=new R,o=new R,r=new R,a=new R,c=new R,l=new R,h=new R,u=new R;if(t)for(let f=0,d=t.count;f<d;f+=3){const g=t.getX(f+0),y=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,g),o.fromBufferAttribute(e,y),r.fromBufferAttribute(e,m),h.subVectors(r,o),u.subVectors(s,o),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,y),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(y,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,d=e.count;f<d;f+=3)s.fromBufferAttribute(e,f+0),o.fromBufferAttribute(e,f+1),r.fromBufferAttribute(e,f+2),h.subVectors(r,o),u.subVectors(s,o),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Le.fromBufferAttribute(t,e),Le.normalize(),t.setXYZ(e,Le.x,Le.y,Le.z)}toNonIndexed(){function t(a,c){const l=a.array,h=a.itemSize,u=a.normalized,f=new l.constructor(c.length*h);let d=0,g=0;for(let y=0,m=c.length;y<m;y++){a.isInterleavedBufferAttribute?d=c[y]*a.data.stride+a.offset:d=c[y]*h;for(let p=0;p<h;p++)f[g++]=l[d++]}return new je(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ie,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,n);e.setAttribute(a,l)}const o=this.morphAttributes;for(const a in o){const c=[],l=o[a];for(let h=0,u=l.length;h<u;h++){const f=l[h],d=t(f,n);c.push(d)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let a=0,c=r.length;a<c;a++){const l=r[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let o=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){const d=l[u];h.push(d.toJSON(t.data))}h.length>0&&(s[c]=h,o=!0)}o&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const o=t.morphAttributes;for(const l in o){const h=[],u=o[l];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let l=0,h=r.length;l<h;l++){const u=r[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ku=new pe,Si=new Lo,jo=new ks,ju=new R,Jo=new R,Qo=new R,tr=new R,Ja=new R,er=new R,Ju=new R,nr=new R;class ie extends be{constructor(t=new Ie,e=new Do){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=s.length;o<r;o++){const a=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,o=n.morphAttributes.position,r=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(o&&a){er.set(0,0,0);for(let c=0,l=o.length;c<l;c++){const h=a[c],u=o[c];h!==0&&(Ja.fromBufferAttribute(u,t),r?er.addScaledVector(Ja,h):er.addScaledVector(Ja.sub(e),h))}e.add(er)}return e}raycast(t,e){const n=this.geometry,s=this.material,o=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),jo.copy(n.boundingSphere),jo.applyMatrix4(o),Si.copy(t.ray).recast(t.near),!(jo.containsPoint(Si.origin)===!1&&(Si.intersectSphere(jo,ju)===null||Si.origin.distanceToSquared(ju)>(t.far-t.near)**2))&&(Ku.copy(o).invert(),Si.copy(t.ray).applyMatrix4(Ku),!(n.boundingBox!==null&&Si.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Si)))}_computeIntersections(t,e,n){let s;const o=this.geometry,r=this.material,a=o.index,c=o.attributes.position,l=o.attributes.uv,h=o.attributes.uv1,u=o.attributes.normal,f=o.groups,d=o.drawRange;if(a!==null)if(Array.isArray(r))for(let g=0,y=f.length;g<y;g++){const m=f[g],p=r[m.materialIndex],_=Math.max(m.start,d.start),v=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let w=_,b=v;w<b;w+=3){const S=a.getX(w),E=a.getX(w+1),T=a.getX(w+2);s=ir(this,p,t,n,l,h,u,S,E,T),s&&(s.faceIndex=Math.floor(w/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),y=Math.min(a.count,d.start+d.count);for(let m=g,p=y;m<p;m+=3){const _=a.getX(m),v=a.getX(m+1),w=a.getX(m+2);s=ir(this,r,t,n,l,h,u,_,v,w),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let g=0,y=f.length;g<y;g++){const m=f[g],p=r[m.materialIndex],_=Math.max(m.start,d.start),v=Math.min(c.count,Math.min(m.start+m.count,d.start+d.count));for(let w=_,b=v;w<b;w+=3){const S=w,E=w+1,T=w+2;s=ir(this,p,t,n,l,h,u,S,E,T),s&&(s.faceIndex=Math.floor(w/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),y=Math.min(c.count,d.start+d.count);for(let m=g,p=y;m<p;m+=3){const _=m,v=m+1,w=m+2;s=ir(this,r,t,n,l,h,u,_,v,w),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function i1(i,t,e,n,s,o,r,a){let c;if(t.side===Ye?c=n.intersectTriangle(r,o,s,!0,a):c=n.intersectTriangle(s,o,r,t.side===fi,a),c===null)return null;nr.copy(a),nr.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(nr);return l<e.near||l>e.far?null:{distance:l,point:nr.clone(),object:i}}function ir(i,t,e,n,s,o,r,a,c,l){i.getVertexPosition(a,Jo),i.getVertexPosition(c,Qo),i.getVertexPosition(l,tr);const h=i1(i,t,e,n,Jo,Qo,tr,Ju);if(h){const u=new R;ln.getBarycoord(Ju,Jo,Qo,tr,u),s&&(h.uv=ln.getInterpolatedAttribute(s,a,c,l,u,new tt)),o&&(h.uv1=ln.getInterpolatedAttribute(o,a,c,l,u,new tt)),r&&(h.normal=ln.getInterpolatedAttribute(r,a,c,l,u,new R),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a,b:c,c:l,normal:new R,materialIndex:0};ln.getNormal(Jo,Qo,tr,f.normal),h.face=f,h.barycoord=u}return h}class G extends Ie{constructor(t=1,e=1,n=1,s=1,o=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:o,depthSegments:r};const a=this;s=Math.floor(s),o=Math.floor(o),r=Math.floor(r);const c=[],l=[],h=[],u=[];let f=0,d=0;g("z","y","x",-1,-1,n,e,t,r,o,0),g("z","y","x",1,-1,n,e,-t,r,o,1),g("x","z","y",1,1,t,n,e,s,r,2),g("x","z","y",1,-1,t,n,-e,s,r,3),g("x","y","z",1,-1,t,e,n,s,o,4),g("x","y","z",-1,-1,t,e,-n,s,o,5),this.setIndex(c),this.setAttribute("position",new ae(l,3)),this.setAttribute("normal",new ae(h,3)),this.setAttribute("uv",new ae(u,2));function g(y,m,p,_,v,w,b,S,E,T,x){const M=w/E,A=b/T,P=w/2,C=b/2,F=S/2,N=E+1,D=T+1;let B=0,H=0;const V=new R;for(let et=0;et<D;et++){const lt=et*A-C;for(let Mt=0;Mt<N;Mt++){const Lt=Mt*M-P;V[y]=Lt*_,V[m]=lt*v,V[p]=F,l.push(V.x,V.y,V.z),V[y]=0,V[m]=0,V[p]=S>0?1:-1,h.push(V.x,V.y,V.z),u.push(Mt/E),u.push(1-et/T),B+=1}}for(let et=0;et<T;et++)for(let lt=0;lt<E;lt++){const Mt=f+lt+N*et,Lt=f+lt+N*(et+1),J=f+(lt+1)+N*(et+1),rt=f+(lt+1)+N*et;c.push(Mt,Lt,rt),c.push(Lt,J,rt),H+=6}a.addGroup(d,H,x),d+=H,f+=B}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new G(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ls(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function We(i){const t={};for(let e=0;e<i.length;e++){const n=Ls(i[e]);for(const s in n)t[s]=n[s]}return t}function s1(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Zf(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:re.workingColorSpace}const wa={clone:Ls,merge:We};var o1=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,r1=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class on extends _i{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=o1,this.fragmentShader=r1,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ls(t.uniforms),this.uniformsGroups=s1(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?e.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[s]={type:"m4",value:r.toArray()}:e.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Kf extends be{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new pe,this.projectionMatrix=new pe,this.projectionMatrixInverse=new pe,this.coordinateSystem=Yn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ci=new R,Qu=new tt,td=new tt;class Ze extends Kf{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Is*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(yo*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Is*2*Math.atan(Math.tan(yo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){ci.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ci.x,ci.y).multiplyScalar(-t/ci.z),ci.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ci.x,ci.y).multiplyScalar(-t/ci.z)}getViewSize(t,e){return this.getViewBounds(t,Qu,td),e.subVectors(td,Qu)}setViewOffset(t,e,n,s,o,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=o,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(yo*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,o=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,l=r.fullHeight;o+=r.offsetX*s/c,e-=r.offsetY*n/l,s*=r.width/c,n*=r.height/l}const a=this.filmOffset;a!==0&&(o+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const os=-90,rs=1;class a1 extends be{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ze(os,rs,t,e);s.layers=this.layers,this.add(s);const o=new Ze(os,rs,t,e);o.layers=this.layers,this.add(o);const r=new Ze(os,rs,t,e);r.layers=this.layers,this.add(r);const a=new Ze(os,rs,t,e);a.layers=this.layers,this.add(a);const c=new Ze(os,rs,t,e);c.layers=this.layers,this.add(c);const l=new Ze(os,rs,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,o,r,a,c]=e;for(const l of e)this.remove(l);if(t===Yn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===jr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[o,r,a,c,l,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,o),t.setRenderTarget(n,1,s),t.render(e,r),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=y,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,f,d),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class jf extends qe{constructor(t,e,n,s,o,r,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:As,super(t,e,n,s,o,r,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class c1 extends An{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new jf(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:sn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new G(5,5,5),o=new on({name:"CubemapFromEquirect",uniforms:Ls(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ye,blending:$n});o.uniforms.tEquirect.value=e;const r=new ie(s,o),a=e.minFilter;return e.minFilter===ui&&(e.minFilter=sn),new a1(1,10,this).update(t,r),e.minFilter=a,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,n,s){const o=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,n,s);t.setRenderTarget(o)}}const Qa=new R,l1=new R,h1=new Kt;class hi{constructor(t=new R(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Qa.subVectors(n,e).cross(l1.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Qa),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/s;return o<0||o>1?null:e.copy(t.start).addScaledVector(n,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||h1.getNormalMatrix(t),s=this.coplanarPoint(Qa).applyMatrix4(t),o=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(o),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ei=new ks,sr=new R;class Nh{constructor(t=new hi,e=new hi,n=new hi,s=new hi,o=new hi,r=new hi){this.planes=[t,e,n,s,o,r]}set(t,e,n,s,o,r){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(o),a[5].copy(r),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Yn){const n=this.planes,s=t.elements,o=s[0],r=s[1],a=s[2],c=s[3],l=s[4],h=s[5],u=s[6],f=s[7],d=s[8],g=s[9],y=s[10],m=s[11],p=s[12],_=s[13],v=s[14],w=s[15];if(n[0].setComponents(c-o,f-l,m-d,w-p).normalize(),n[1].setComponents(c+o,f+l,m+d,w+p).normalize(),n[2].setComponents(c+r,f+h,m+g,w+_).normalize(),n[3].setComponents(c-r,f-h,m-g,w-_).normalize(),n[4].setComponents(c-a,f-u,m-y,w-v).normalize(),e===Yn)n[5].setComponents(c+a,f+u,m+y,w+v).normalize();else if(e===jr)n[5].setComponents(a,u,y,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ei.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ei.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ei)}intersectsSprite(t){return Ei.center.set(0,0,0),Ei.radius=.7071067811865476,Ei.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ei)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let o=0;o<6;o++)if(e[o].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(sr.x=s.normal.x>0?t.max.x:t.min.x,sr.y=s.normal.y>0?t.max.y:t.min.y,sr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(sr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Jf(){let i=null,t=!1,e=null,n=null;function s(o,r){e(o,r),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(o){e=o},setContext:function(o){i=o}}}function u1(i){const t=new WeakMap;function e(a,c){const l=a.array,h=a.usage,u=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,h),a.onUploadCallback();let d;if(l instanceof Float32Array)d=i.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=i.SHORT;else if(l instanceof Uint32Array)d=i.UNSIGNED_INT;else if(l instanceof Int32Array)d=i.INT;else if(l instanceof Int8Array)d=i.BYTE;else if(l instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){const h=c.array,u=c.updateRanges;if(i.bindBuffer(l,a),u.length===0)i.bufferSubData(l,0,h);else{u.sort((d,g)=>d.start-g.start);let f=0;for(let d=1;d<u.length;d++){const g=u[f],y=u[d];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++f,u[f]=y)}u.length=f+1;for(let d=0,g=u.length;d<g;d++){const y=u[d];i.bufferSubData(l,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function o(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function r(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:o,update:r}}class mi extends Ie{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const o=t/2,r=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,u=t/a,f=e/c,d=[],g=[],y=[],m=[];for(let p=0;p<h;p++){const _=p*f-r;for(let v=0;v<l;v++){const w=v*u-o;g.push(w,-_,0),y.push(0,0,1),m.push(v/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let _=0;_<a;_++){const v=_+l*p,w=_+l*(p+1),b=_+1+l*(p+1),S=_+1+l*p;d.push(v,w,S),d.push(w,b,S)}this.setIndex(d),this.setAttribute("position",new ae(g,3)),this.setAttribute("normal",new ae(y,3)),this.setAttribute("uv",new ae(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new mi(t.width,t.height,t.widthSegments,t.heightSegments)}}var d1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,f1=`#ifdef USE_ALPHAHASH
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
#endif`,p1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,m1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,g1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,y1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,v1=`#ifdef USE_AOMAP
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
#endif`,_1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,w1=`#ifdef USE_BATCHING
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
#endif`,x1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,M1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,b1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,S1=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,E1=`#ifdef USE_IRIDESCENCE
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
#endif`,T1=`#ifdef USE_BUMPMAP
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
#endif`,A1=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,R1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,C1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,P1=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,I1=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,L1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,D1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,N1=`#if defined( USE_COLOR_ALPHA )
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
#endif`,U1=`#define PI 3.141592653589793
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
} // validated`,F1=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,O1=`vec3 transformedNormal = objectNormal;
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
#endif`,z1=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,k1=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,B1=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,H1=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,G1="gl_FragColor = linearToOutputTexel( gl_FragColor );",V1=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,W1=`#ifdef USE_ENVMAP
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
#endif`,X1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Y1=`#ifdef USE_ENVMAP
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
#endif`,q1=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,$1=`#ifdef USE_ENVMAP
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
#endif`,Z1=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,K1=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,j1=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,J1=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Q1=`#ifdef USE_GRADIENTMAP
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
}`,ty=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ey=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ny=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,iy=`uniform bool receiveShadow;
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
#endif`,sy=`#ifdef USE_ENVMAP
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
#endif`,oy=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ry=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ay=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,cy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ly=`PhysicalMaterial material;
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
#endif`,hy=`struct PhysicalMaterial {
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
}`,uy=`
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
#endif`,dy=`#if defined( RE_IndirectDiffuse )
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
#endif`,fy=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,py=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,my=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,gy=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,yy=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,vy=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,_y=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,wy=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,xy=`#if defined( USE_POINTS_UV )
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
#endif`,My=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,by=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Sy=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ey=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ty=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ay=`#ifdef USE_MORPHTARGETS
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
#endif`,Ry=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Cy=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Py=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Iy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ly=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Dy=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Ny=`#ifdef USE_NORMALMAP
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
#endif`,Uy=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Fy=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Oy=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,zy=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ky=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,By=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Hy=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Gy=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Vy=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Wy=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Xy=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Yy=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,qy=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,$y=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Zy=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Ky=`float getShadowMask() {
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
}`,jy=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Jy=`#ifdef USE_SKINNING
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
#endif`,Qy=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,tv=`#ifdef USE_SKINNING
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
#endif`,ev=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,nv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,iv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,sv=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,ov=`#ifdef USE_TRANSMISSION
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
#endif`,rv=`#ifdef USE_TRANSMISSION
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
#endif`,av=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,cv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,lv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,hv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const uv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,dv=`uniform sampler2D t2D;
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
}`,fv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,pv=`#ifdef ENVMAP_TYPE_CUBE
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
}`,mv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,gv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yv=`#include <common>
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
}`,vv=`#if DEPTH_PACKING == 3200
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
}`,_v=`#define DISTANCE
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
}`,wv=`#define DISTANCE
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
}`,xv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Mv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bv=`uniform float scale;
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
}`,Sv=`uniform vec3 diffuse;
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
}`,Ev=`#include <common>
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
}`,Tv=`uniform vec3 diffuse;
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
}`,Av=`#define LAMBERT
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
}`,Rv=`#define LAMBERT
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
}`,Cv=`#define MATCAP
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
}`,Pv=`#define MATCAP
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
}`,Iv=`#define NORMAL
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
}`,Lv=`#define NORMAL
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
}`,Dv=`#define PHONG
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
}`,Nv=`#define PHONG
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
}`,Uv=`#define STANDARD
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
}`,Fv=`#define STANDARD
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
}`,Ov=`#define TOON
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
}`,zv=`#define TOON
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
}`,kv=`uniform float size;
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
}`,Bv=`uniform vec3 diffuse;
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
}`,Hv=`#include <common>
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
}`,Gv=`uniform vec3 color;
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
}`,Vv=`uniform float rotation;
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
}`,Wv=`uniform vec3 diffuse;
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
}`,Jt={alphahash_fragment:d1,alphahash_pars_fragment:f1,alphamap_fragment:p1,alphamap_pars_fragment:m1,alphatest_fragment:g1,alphatest_pars_fragment:y1,aomap_fragment:v1,aomap_pars_fragment:_1,batching_pars_vertex:w1,batching_vertex:x1,begin_vertex:M1,beginnormal_vertex:b1,bsdfs:S1,iridescence_fragment:E1,bumpmap_pars_fragment:T1,clipping_planes_fragment:A1,clipping_planes_pars_fragment:R1,clipping_planes_pars_vertex:C1,clipping_planes_vertex:P1,color_fragment:I1,color_pars_fragment:L1,color_pars_vertex:D1,color_vertex:N1,common:U1,cube_uv_reflection_fragment:F1,defaultnormal_vertex:O1,displacementmap_pars_vertex:z1,displacementmap_vertex:k1,emissivemap_fragment:B1,emissivemap_pars_fragment:H1,colorspace_fragment:G1,colorspace_pars_fragment:V1,envmap_fragment:W1,envmap_common_pars_fragment:X1,envmap_pars_fragment:Y1,envmap_pars_vertex:q1,envmap_physical_pars_fragment:sy,envmap_vertex:$1,fog_vertex:Z1,fog_pars_vertex:K1,fog_fragment:j1,fog_pars_fragment:J1,gradientmap_pars_fragment:Q1,lightmap_pars_fragment:ty,lights_lambert_fragment:ey,lights_lambert_pars_fragment:ny,lights_pars_begin:iy,lights_toon_fragment:oy,lights_toon_pars_fragment:ry,lights_phong_fragment:ay,lights_phong_pars_fragment:cy,lights_physical_fragment:ly,lights_physical_pars_fragment:hy,lights_fragment_begin:uy,lights_fragment_maps:dy,lights_fragment_end:fy,logdepthbuf_fragment:py,logdepthbuf_pars_fragment:my,logdepthbuf_pars_vertex:gy,logdepthbuf_vertex:yy,map_fragment:vy,map_pars_fragment:_y,map_particle_fragment:wy,map_particle_pars_fragment:xy,metalnessmap_fragment:My,metalnessmap_pars_fragment:by,morphinstance_vertex:Sy,morphcolor_vertex:Ey,morphnormal_vertex:Ty,morphtarget_pars_vertex:Ay,morphtarget_vertex:Ry,normal_fragment_begin:Cy,normal_fragment_maps:Py,normal_pars_fragment:Iy,normal_pars_vertex:Ly,normal_vertex:Dy,normalmap_pars_fragment:Ny,clearcoat_normal_fragment_begin:Uy,clearcoat_normal_fragment_maps:Fy,clearcoat_pars_fragment:Oy,iridescence_pars_fragment:zy,opaque_fragment:ky,packing:By,premultiplied_alpha_fragment:Hy,project_vertex:Gy,dithering_fragment:Vy,dithering_pars_fragment:Wy,roughnessmap_fragment:Xy,roughnessmap_pars_fragment:Yy,shadowmap_pars_fragment:qy,shadowmap_pars_vertex:$y,shadowmap_vertex:Zy,shadowmask_pars_fragment:Ky,skinbase_vertex:jy,skinning_pars_vertex:Jy,skinning_vertex:Qy,skinnormal_vertex:tv,specularmap_fragment:ev,specularmap_pars_fragment:nv,tonemapping_fragment:iv,tonemapping_pars_fragment:sv,transmission_fragment:ov,transmission_pars_fragment:rv,uv_pars_fragment:av,uv_pars_vertex:cv,uv_vertex:lv,worldpos_vertex:hv,background_vert:uv,background_frag:dv,backgroundCube_vert:fv,backgroundCube_frag:pv,cube_vert:mv,cube_frag:gv,depth_vert:yv,depth_frag:vv,distanceRGBA_vert:_v,distanceRGBA_frag:wv,equirect_vert:xv,equirect_frag:Mv,linedashed_vert:bv,linedashed_frag:Sv,meshbasic_vert:Ev,meshbasic_frag:Tv,meshlambert_vert:Av,meshlambert_frag:Rv,meshmatcap_vert:Cv,meshmatcap_frag:Pv,meshnormal_vert:Iv,meshnormal_frag:Lv,meshphong_vert:Dv,meshphong_frag:Nv,meshphysical_vert:Uv,meshphysical_frag:Fv,meshtoon_vert:Ov,meshtoon_frag:zv,points_vert:kv,points_frag:Bv,shadow_vert:Hv,shadow_frag:Gv,sprite_vert:Vv,sprite_frag:Wv},St={common:{diffuse:{value:new Yt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Kt}},envmap:{envMap:{value:null},envMapRotation:{value:new Kt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Kt},normalScale:{value:new tt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Yt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Yt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0},uvTransform:{value:new Kt}},sprite:{diffuse:{value:new Yt(16777215)},opacity:{value:1},center:{value:new tt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}}},Mn={basic:{uniforms:We([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.fog]),vertexShader:Jt.meshbasic_vert,fragmentShader:Jt.meshbasic_frag},lambert:{uniforms:We([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new Yt(0)}}]),vertexShader:Jt.meshlambert_vert,fragmentShader:Jt.meshlambert_frag},phong:{uniforms:We([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new Yt(0)},specular:{value:new Yt(1118481)},shininess:{value:30}}]),vertexShader:Jt.meshphong_vert,fragmentShader:Jt.meshphong_frag},standard:{uniforms:We([St.common,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.roughnessmap,St.metalnessmap,St.fog,St.lights,{emissive:{value:new Yt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Jt.meshphysical_vert,fragmentShader:Jt.meshphysical_frag},toon:{uniforms:We([St.common,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.gradientmap,St.fog,St.lights,{emissive:{value:new Yt(0)}}]),vertexShader:Jt.meshtoon_vert,fragmentShader:Jt.meshtoon_frag},matcap:{uniforms:We([St.common,St.bumpmap,St.normalmap,St.displacementmap,St.fog,{matcap:{value:null}}]),vertexShader:Jt.meshmatcap_vert,fragmentShader:Jt.meshmatcap_frag},points:{uniforms:We([St.points,St.fog]),vertexShader:Jt.points_vert,fragmentShader:Jt.points_frag},dashed:{uniforms:We([St.common,St.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Jt.linedashed_vert,fragmentShader:Jt.linedashed_frag},depth:{uniforms:We([St.common,St.displacementmap]),vertexShader:Jt.depth_vert,fragmentShader:Jt.depth_frag},normal:{uniforms:We([St.common,St.bumpmap,St.normalmap,St.displacementmap,{opacity:{value:1}}]),vertexShader:Jt.meshnormal_vert,fragmentShader:Jt.meshnormal_frag},sprite:{uniforms:We([St.sprite,St.fog]),vertexShader:Jt.sprite_vert,fragmentShader:Jt.sprite_frag},background:{uniforms:{uvTransform:{value:new Kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Jt.background_vert,fragmentShader:Jt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Kt}},vertexShader:Jt.backgroundCube_vert,fragmentShader:Jt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Jt.cube_vert,fragmentShader:Jt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Jt.equirect_vert,fragmentShader:Jt.equirect_frag},distanceRGBA:{uniforms:We([St.common,St.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Jt.distanceRGBA_vert,fragmentShader:Jt.distanceRGBA_frag},shadow:{uniforms:We([St.lights,St.fog,{color:{value:new Yt(0)},opacity:{value:1}}]),vertexShader:Jt.shadow_vert,fragmentShader:Jt.shadow_frag}};Mn.physical={uniforms:We([Mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Kt},clearcoatNormalScale:{value:new tt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Kt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Kt},sheen:{value:0},sheenColor:{value:new Yt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Kt},transmissionSamplerSize:{value:new tt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Kt},attenuationDistance:{value:0},attenuationColor:{value:new Yt(0)},specularColor:{value:new Yt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Kt},anisotropyVector:{value:new tt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Kt}}]),vertexShader:Jt.meshphysical_vert,fragmentShader:Jt.meshphysical_frag};const or={r:0,b:0,g:0},Ti=new Rn,Xv=new pe;function Yv(i,t,e,n,s,o,r){const a=new Yt(0);let c=o===!0?0:1,l,h,u=null,f=0,d=null;function g(_){let v=_.isScene===!0?_.background:null;return v&&v.isTexture&&(v=(_.backgroundBlurriness>0?e:t).get(v)),v}function y(_){let v=!1;const w=g(_);w===null?p(a,c):w&&w.isColor&&(p(w,1),v=!0);const b=i.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(i.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(_,v){const w=g(v);w&&(w.isCubeTexture||w.mapping===ya)?(h===void 0&&(h=new ie(new G(1,1,1),new on({name:"BackgroundCubeMaterial",uniforms:Ls(Mn.backgroundCube.uniforms),vertexShader:Mn.backgroundCube.vertexShader,fragmentShader:Mn.backgroundCube.fragmentShader,side:Ye,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(b,S,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Ti.copy(v.backgroundRotation),Ti.x*=-1,Ti.y*=-1,Ti.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Ti.y*=-1,Ti.z*=-1),h.material.uniforms.envMap.value=w,h.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Xv.makeRotationFromEuler(Ti)),h.material.toneMapped=re.getTransfer(w.colorSpace)!==de,(u!==w||f!==w.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,u=w,f=w.version,d=i.toneMapping),h.layers.enableAll(),_.unshift(h,h.geometry,h.material,0,0,null)):w&&w.isTexture&&(l===void 0&&(l=new ie(new mi(2,2),new on({name:"BackgroundMaterial",uniforms:Ls(Mn.background.uniforms),vertexShader:Mn.background.vertexShader,fragmentShader:Mn.background.fragmentShader,side:fi,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=w,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=re.getTransfer(w.colorSpace)!==de,w.matrixAutoUpdate===!0&&w.updateMatrix(),l.material.uniforms.uvTransform.value.copy(w.matrix),(u!==w||f!==w.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,u=w,f=w.version,d=i.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null))}function p(_,v){_.getRGB(or,Zf(i)),n.buffers.color.setClear(or.r,or.g,or.b,v,r)}return{getClearColor:function(){return a},setClearColor:function(_,v=1){a.set(_),c=v,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(_){c=_,p(a,c)},render:y,addToRenderList:m}}function qv(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let o=s,r=!1;function a(M,A,P,C,F){let N=!1;const D=u(C,P,A);o!==D&&(o=D,l(o.object)),N=d(M,C,P,F),N&&g(M,C,P,F),F!==null&&t.update(F,i.ELEMENT_ARRAY_BUFFER),(N||r)&&(r=!1,w(M,A,P,C),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(F).buffer))}function c(){return i.createVertexArray()}function l(M){return i.bindVertexArray(M)}function h(M){return i.deleteVertexArray(M)}function u(M,A,P){const C=P.wireframe===!0;let F=n[M.id];F===void 0&&(F={},n[M.id]=F);let N=F[A.id];N===void 0&&(N={},F[A.id]=N);let D=N[C];return D===void 0&&(D=f(c()),N[C]=D),D}function f(M){const A=[],P=[],C=[];for(let F=0;F<e;F++)A[F]=0,P[F]=0,C[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:A,enabledAttributes:P,attributeDivisors:C,object:M,attributes:{},index:null}}function d(M,A,P,C){const F=o.attributes,N=A.attributes;let D=0;const B=P.getAttributes();for(const H in B)if(B[H].location>=0){const et=F[H];let lt=N[H];if(lt===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(lt=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(lt=M.instanceColor)),et===void 0||et.attribute!==lt||lt&&et.data!==lt.data)return!0;D++}return o.attributesNum!==D||o.index!==C}function g(M,A,P,C){const F={},N=A.attributes;let D=0;const B=P.getAttributes();for(const H in B)if(B[H].location>=0){let et=N[H];et===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(et=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(et=M.instanceColor));const lt={};lt.attribute=et,et&&et.data&&(lt.data=et.data),F[H]=lt,D++}o.attributes=F,o.attributesNum=D,o.index=C}function y(){const M=o.newAttributes;for(let A=0,P=M.length;A<P;A++)M[A]=0}function m(M){p(M,0)}function p(M,A){const P=o.newAttributes,C=o.enabledAttributes,F=o.attributeDivisors;P[M]=1,C[M]===0&&(i.enableVertexAttribArray(M),C[M]=1),F[M]!==A&&(i.vertexAttribDivisor(M,A),F[M]=A)}function _(){const M=o.newAttributes,A=o.enabledAttributes;for(let P=0,C=A.length;P<C;P++)A[P]!==M[P]&&(i.disableVertexAttribArray(P),A[P]=0)}function v(M,A,P,C,F,N,D){D===!0?i.vertexAttribIPointer(M,A,P,F,N):i.vertexAttribPointer(M,A,P,C,F,N)}function w(M,A,P,C){y();const F=C.attributes,N=P.getAttributes(),D=A.defaultAttributeValues;for(const B in N){const H=N[B];if(H.location>=0){let V=F[B];if(V===void 0&&(B==="instanceMatrix"&&M.instanceMatrix&&(V=M.instanceMatrix),B==="instanceColor"&&M.instanceColor&&(V=M.instanceColor)),V!==void 0){const et=V.normalized,lt=V.itemSize,Mt=t.get(V);if(Mt===void 0)continue;const Lt=Mt.buffer,J=Mt.type,rt=Mt.bytesPerElement,K=J===i.INT||J===i.UNSIGNED_INT||V.gpuType===Eh;if(V.isInterleavedBufferAttribute){const q=V.data,ot=q.stride,pt=V.offset;if(q.isInstancedInterleavedBuffer){for(let wt=0;wt<H.locationSize;wt++)p(H.location+wt,q.meshPerAttribute);M.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let wt=0;wt<H.locationSize;wt++)m(H.location+wt);i.bindBuffer(i.ARRAY_BUFFER,Lt);for(let wt=0;wt<H.locationSize;wt++)v(H.location+wt,lt/H.locationSize,J,et,ot*rt,(pt+lt/H.locationSize*wt)*rt,K)}else{if(V.isInstancedBufferAttribute){for(let q=0;q<H.locationSize;q++)p(H.location+q,V.meshPerAttribute);M.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=V.meshPerAttribute*V.count)}else for(let q=0;q<H.locationSize;q++)m(H.location+q);i.bindBuffer(i.ARRAY_BUFFER,Lt);for(let q=0;q<H.locationSize;q++)v(H.location+q,lt/H.locationSize,J,et,lt*rt,lt/H.locationSize*q*rt,K)}}else if(D!==void 0){const et=D[B];if(et!==void 0)switch(et.length){case 2:i.vertexAttrib2fv(H.location,et);break;case 3:i.vertexAttrib3fv(H.location,et);break;case 4:i.vertexAttrib4fv(H.location,et);break;default:i.vertexAttrib1fv(H.location,et)}}}}_()}function b(){T();for(const M in n){const A=n[M];for(const P in A){const C=A[P];for(const F in C)h(C[F].object),delete C[F];delete A[P]}delete n[M]}}function S(M){if(n[M.id]===void 0)return;const A=n[M.id];for(const P in A){const C=A[P];for(const F in C)h(C[F].object),delete C[F];delete A[P]}delete n[M.id]}function E(M){for(const A in n){const P=n[A];if(P[M.id]===void 0)continue;const C=P[M.id];for(const F in C)h(C[F].object),delete C[F];delete P[M.id]}}function T(){x(),r=!0,o!==s&&(o=s,l(o.object))}function x(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:T,resetDefaultState:x,dispose:b,releaseStatesOfGeometry:S,releaseStatesOfProgram:E,initAttributes:y,enableAttribute:m,disableUnusedAttributes:_}}function $v(i,t,e){let n;function s(l){n=l}function o(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function r(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function a(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let d=0;for(let g=0;g<u;g++)d+=h[g];e.update(d,n,1)}function c(l,h,u,f){if(u===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<l.length;g++)r(l[g],h[g],f[g]);else{d.multiDrawArraysInstancedWEBGL(n,l,0,h,0,f,0,u);let g=0;for(let y=0;y<u;y++)g+=h[y]*f[y];e.update(g,n,1)}}this.setMode=s,this.render=o,this.renderInstances=r,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function Zv(i,t,e,n){let s;function o(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(E){return!(E!==hn&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(E){const T=E===pi&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==Tn&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==Xn&&!T)}function c(E){if(E==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,f=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),_=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),w=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),b=g>0,S=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:o,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:f,maxTextures:d,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:_,maxVaryings:v,maxFragmentUniforms:w,vertexTextures:b,maxSamples:S}}function Kv(i){const t=this;let e=null,n=0,s=!1,o=!1;const r=new hi,a=new Kt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||n!==0||s;return s=f,n=u.length,d},this.beginShadows=function(){o=!0,h(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,d){const g=u.clippingPlanes,y=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||o&&!m)o?h(null):l();else{const _=o?0:n,v=_*4;let w=p.clippingState||null;c.value=w,w=h(g,f,v,d);for(let b=0;b!==v;++b)w[b]=e[b];p.clippingState=w,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=_}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,d,g){const y=u!==null?u.length:0;let m=null;if(y!==0){if(m=c.value,g!==!0||m===null){const p=d+y*4,_=f.matrixWorldInverse;a.getNormalMatrix(_),(m===null||m.length<p)&&(m=new Float32Array(p));for(let v=0,w=d;v!==y;++v,w+=4)r.copy(u[v]).applyMatrix4(_,a),r.normal.toArray(m,w),m[w+3]=r.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,m}}function jv(i){let t=new WeakMap;function e(r,a){return a===xl?r.mapping=As:a===Ml&&(r.mapping=Rs),r}function n(r){if(r&&r.isTexture){const a=r.mapping;if(a===xl||a===Ml)if(t.has(r)){const c=t.get(r).texture;return e(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const l=new c1(c.height);return l.fromEquirectangularTexture(i,r),t.set(r,l),r.addEventListener("dispose",s),e(l.texture,r.mapping)}else return null}}return r}function s(r){const a=r.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function o(){t=new WeakMap}return{get:n,dispose:o}}class Uh extends Kf{constructor(t=-1,e=1,n=1,s=-1,o=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=o,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,o,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=o,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let o=n-t,r=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=l*this.view.offsetX,r=o+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(o,r,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const ys=4,ed=[.125,.215,.35,.446,.526,.582],Ui=20,tc=new Uh,nd=new Yt;let ec=null,nc=0,ic=0,sc=!1;const Di=(1+Math.sqrt(5))/2,as=1/Di,id=[new R(-Di,as,0),new R(Di,as,0),new R(-as,0,Di),new R(as,0,Di),new R(0,Di,-as),new R(0,Di,as),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)];class sd{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){ec=this._renderer.getRenderTarget(),nc=this._renderer.getActiveCubeFace(),ic=this._renderer.getActiveMipmapLevel(),sc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const o=this._allocateTargets();return o.depthBuffer=!0,this._sceneToCubeUV(t,n,s,o),e>0&&this._blur(o,0,0,e),this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ad(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=rd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ec,nc,ic),this._renderer.xr.enabled=sc,t.scissorTest=!1,rr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===As||t.mapping===Rs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ec=this._renderer.getRenderTarget(),nc=this._renderer.getActiveCubeFace(),ic=this._renderer.getActiveMipmapLevel(),sc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:sn,minFilter:sn,generateMipmaps:!1,type:pi,format:hn,colorSpace:Os,depthBuffer:!1},s=od(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=od(t,e,n);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Jv(o)),this._blurMaterial=Qv(o,t,e)}return s}_compileMaterial(t){const e=new ie(this._lodPlanes[0],t);this._renderer.compile(e,tc)}_sceneToCubeUV(t,e,n,s){const a=new Ze(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(nd),h.toneMapping=di,h.autoClear=!1;const d=new Do({name:"PMREM.Background",side:Ye,depthWrite:!1,depthTest:!1}),g=new ie(new G,d);let y=!1;const m=t.background;m?m.isColor&&(d.color.copy(m),t.background=null,y=!0):(d.color.copy(nd),y=!0);for(let p=0;p<6;p++){const _=p%3;_===0?(a.up.set(0,c[p],0),a.lookAt(l[p],0,0)):_===1?(a.up.set(0,0,c[p]),a.lookAt(0,l[p],0)):(a.up.set(0,c[p],0),a.lookAt(0,0,l[p]));const v=this._cubeSize;rr(s,_*v,p>2?v:0,v,v),h.setRenderTarget(s),y&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===As||t.mapping===Rs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=ad()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=rd());const o=s?this._cubemapMaterial:this._equirectMaterial,r=new ie(this._lodPlanes[0],o),a=o.uniforms;a.envMap.value=t;const c=this._cubeSize;rr(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(r,tc)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let o=1;o<s;o++){const r=Math.sqrt(this._sigmas[o]*this._sigmas[o]-this._sigmas[o-1]*this._sigmas[o-1]),a=id[(s-o-1)%id.length];this._blur(t,o-1,o,r,a)}e.autoClear=n}_blur(t,e,n,s,o){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,n,s,"latitudinal",o),this._halfBlur(r,t,n,n,s,"longitudinal",o)}_halfBlur(t,e,n,s,o,r,a){const c=this._renderer,l=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new ie(this._lodPlanes[s],l),f=l.uniforms,d=this._sizeLods[n]-1,g=isFinite(o)?Math.PI/(2*d):2*Math.PI/(2*Ui-1),y=o/g,m=isFinite(o)?1+Math.floor(h*y):Ui;m>Ui&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ui}`);const p=[];let _=0;for(let E=0;E<Ui;++E){const T=E/y,x=Math.exp(-T*T/2);p.push(x),E===0?_+=x:E<m&&(_+=2*x)}for(let E=0;E<p.length;E++)p[E]=p[E]/_;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=r==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:v}=this;f.dTheta.value=g,f.mipInt.value=v-n;const w=this._sizeLods[s],b=3*w*(s>v-ys?s-v+ys:0),S=4*(this._cubeSize-w);rr(e,b,S,3*w,2*w),c.setRenderTarget(e),c.render(u,tc)}}function Jv(i){const t=[],e=[],n=[];let s=i;const o=i-ys+1+ed.length;for(let r=0;r<o;r++){const a=Math.pow(2,s);e.push(a);let c=1/a;r>i-ys?c=ed[r-i+ys-1]:r===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,g=6,y=3,m=2,p=1,_=new Float32Array(y*g*d),v=new Float32Array(m*g*d),w=new Float32Array(p*g*d);for(let S=0;S<d;S++){const E=S%3*2/3-1,T=S>2?0:-1,x=[E,T,0,E+2/3,T,0,E+2/3,T+1,0,E,T,0,E+2/3,T+1,0,E,T+1,0];_.set(x,y*g*S),v.set(f,m*g*S);const M=[S,S,S,S,S,S];w.set(M,p*g*S)}const b=new Ie;b.setAttribute("position",new je(_,y)),b.setAttribute("uv",new je(v,m)),b.setAttribute("faceIndex",new je(w,p)),t.push(b),s>ys&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function od(i,t,e){const n=new An(i,t,e);return n.texture.mapping=ya,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function rr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Qv(i,t,e){const n=new Float32Array(Ui),s=new R(0,1,0);return new on({name:"SphericalGaussianBlur",defines:{n:Ui,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Fh(),fragmentShader:`

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
		`,blending:$n,depthTest:!1,depthWrite:!1})}function rd(){return new on({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Fh(),fragmentShader:`

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
		`,blending:$n,depthTest:!1,depthWrite:!1})}function ad(){return new on({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Fh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:$n,depthTest:!1,depthWrite:!1})}function Fh(){return`

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
	`}function t_(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===xl||c===Ml,h=c===As||c===Rs;if(l||h){let u=t.get(a);const f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return e===null&&(e=new sd(i)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{const d=a.image;return l&&d&&d.height>0||h&&d&&s(d)?(e===null&&(e=new sd(i)),u=l?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",o),u.texture):null}}}return a}function s(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function o(a){const c=a.target;c.removeEventListener("dispose",o);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:r}}function e_(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&po("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function n_(i,t,e,n){const s={},o=new WeakMap;function r(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);for(const g in f.morphAttributes){const y=f.morphAttributes[g];for(let m=0,p=y.length;m<p;m++)t.remove(y[m])}f.removeEventListener("dispose",r),delete s[f.id];const d=o.get(f);d&&(t.remove(d),o.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",r),s[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const g in f)t.update(f[g],i.ARRAY_BUFFER);const d=u.morphAttributes;for(const g in d){const y=d[g];for(let m=0,p=y.length;m<p;m++)t.update(y[m],i.ARRAY_BUFFER)}}function l(u){const f=[],d=u.index,g=u.attributes.position;let y=0;if(d!==null){const _=d.array;y=d.version;for(let v=0,w=_.length;v<w;v+=3){const b=_[v+0],S=_[v+1],E=_[v+2];f.push(b,S,S,E,E,b)}}else if(g!==void 0){const _=g.array;y=g.version;for(let v=0,w=_.length/3-1;v<w;v+=3){const b=v+0,S=v+1,E=v+2;f.push(b,S,S,E,E,b)}}else return;const m=new(Vf(f)?$f:qf)(f,1);m.version=y;const p=o.get(u);p&&t.remove(p),o.set(u,m)}function h(u){const f=o.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&l(u)}else l(u);return o.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function i_(i,t,e){let n;function s(f){n=f}let o,r;function a(f){o=f.type,r=f.bytesPerElement}function c(f,d){i.drawElements(n,d,o,f*r),e.update(d,n,1)}function l(f,d,g){g!==0&&(i.drawElementsInstanced(n,d,o,f*r,g),e.update(d,n,g))}function h(f,d,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,o,f,0,g);let m=0;for(let p=0;p<g;p++)m+=d[p];e.update(m,n,1)}function u(f,d,g,y){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)l(f[p]/r,d[p],y[p]);else{m.multiDrawElementsInstancedWEBGL(n,d,0,o,f,0,y,0,g);let p=0;for(let _=0;_<g;_++)p+=d[_]*y[_];e.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function s_(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(o,r,a){switch(e.calls++,r){case i.TRIANGLES:e.triangles+=a*(o/3);break;case i.LINES:e.lines+=a*(o/2);break;case i.LINE_STRIP:e.lines+=a*(o-1);break;case i.LINE_LOOP:e.lines+=a*o;break;case i.POINTS:e.points+=a*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function o_(i,t,e){const n=new WeakMap,s=new fe;function o(r,a,c){const l=r.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let f=n.get(a);if(f===void 0||f.count!==u){let x=function(){E.dispose(),n.delete(a),a.removeEventListener("dispose",x)};f!==void 0&&f.texture.dispose();const d=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,y=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],_=a.morphAttributes.color||[];let v=0;d===!0&&(v=1),g===!0&&(v=2),y===!0&&(v=3);let w=a.attributes.position.count*v,b=1;w>t.maxTextureSize&&(b=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const S=new Float32Array(w*b*4*u),E=new Xf(S,w,b,u);E.type=Xn,E.needsUpdate=!0;const T=v*4;for(let M=0;M<u;M++){const A=m[M],P=p[M],C=_[M],F=w*b*4*M;for(let N=0;N<A.count;N++){const D=N*T;d===!0&&(s.fromBufferAttribute(A,N),S[F+D+0]=s.x,S[F+D+1]=s.y,S[F+D+2]=s.z,S[F+D+3]=0),g===!0&&(s.fromBufferAttribute(P,N),S[F+D+4]=s.x,S[F+D+5]=s.y,S[F+D+6]=s.z,S[F+D+7]=0),y===!0&&(s.fromBufferAttribute(C,N),S[F+D+8]=s.x,S[F+D+9]=s.y,S[F+D+10]=s.z,S[F+D+11]=C.itemSize===4?s.w:1)}}f={count:u,texture:E,size:new tt(w,b)},n.set(a,f),a.addEventListener("dispose",x)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",r.morphTexture,e);else{let d=0;for(let y=0;y<l.length;y++)d+=l[y];const g=a.morphTargetsRelative?1:1-d;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:o}}function r_(i,t,e,n){let s=new WeakMap;function o(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function r(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:o,dispose:r}}class Oh extends qe{constructor(t,e,n,s,o,r,a,c,l,h=xs){if(h!==xs&&h!==Ps)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===xs&&(n=Bi),n===void 0&&h===Ps&&(n=Cs),super(null,s,o,r,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Ue,this.minFilter=c!==void 0?c:Ue,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Qf=new qe,cd=new Oh(1,1),tp=new Xf,ep=new qg,np=new jf,ld=[],hd=[],ud=new Float32Array(16),dd=new Float32Array(9),fd=new Float32Array(4);function Bs(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let o=ld[s];if(o===void 0&&(o=new Float32Array(s),ld[s]=o),t!==0){n.toArray(o,0);for(let r=1,a=0;r!==t;++r)a+=e,i[r].toArray(o,a)}return o}function Ce(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Pe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function xa(i,t){let e=hd[t];e===void 0&&(e=new Int32Array(t),hd[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function a_(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function c_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;i.uniform2fv(this.addr,t),Pe(e,t)}}function l_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ce(e,t))return;i.uniform3fv(this.addr,t),Pe(e,t)}}function h_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;i.uniform4fv(this.addr,t),Pe(e,t)}}function u_(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ce(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Pe(e,t)}else{if(Ce(e,n))return;fd.set(n),i.uniformMatrix2fv(this.addr,!1,fd),Pe(e,n)}}function d_(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ce(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Pe(e,t)}else{if(Ce(e,n))return;dd.set(n),i.uniformMatrix3fv(this.addr,!1,dd),Pe(e,n)}}function f_(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ce(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Pe(e,t)}else{if(Ce(e,n))return;ud.set(n),i.uniformMatrix4fv(this.addr,!1,ud),Pe(e,n)}}function p_(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function m_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;i.uniform2iv(this.addr,t),Pe(e,t)}}function g_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ce(e,t))return;i.uniform3iv(this.addr,t),Pe(e,t)}}function y_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;i.uniform4iv(this.addr,t),Pe(e,t)}}function v_(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function __(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;i.uniform2uiv(this.addr,t),Pe(e,t)}}function w_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ce(e,t))return;i.uniform3uiv(this.addr,t),Pe(e,t)}}function x_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;i.uniform4uiv(this.addr,t),Pe(e,t)}}function M_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let o;this.type===i.SAMPLER_2D_SHADOW?(cd.compareFunction=Gf,o=cd):o=Qf,e.setTexture2D(t||o,s)}function b_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||ep,s)}function S_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||np,s)}function E_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||tp,s)}function T_(i){switch(i){case 5126:return a_;case 35664:return c_;case 35665:return l_;case 35666:return h_;case 35674:return u_;case 35675:return d_;case 35676:return f_;case 5124:case 35670:return p_;case 35667:case 35671:return m_;case 35668:case 35672:return g_;case 35669:case 35673:return y_;case 5125:return v_;case 36294:return __;case 36295:return w_;case 36296:return x_;case 35678:case 36198:case 36298:case 36306:case 35682:return M_;case 35679:case 36299:case 36307:return b_;case 35680:case 36300:case 36308:case 36293:return S_;case 36289:case 36303:case 36311:case 36292:return E_}}function A_(i,t){i.uniform1fv(this.addr,t)}function R_(i,t){const e=Bs(t,this.size,2);i.uniform2fv(this.addr,e)}function C_(i,t){const e=Bs(t,this.size,3);i.uniform3fv(this.addr,e)}function P_(i,t){const e=Bs(t,this.size,4);i.uniform4fv(this.addr,e)}function I_(i,t){const e=Bs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function L_(i,t){const e=Bs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function D_(i,t){const e=Bs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function N_(i,t){i.uniform1iv(this.addr,t)}function U_(i,t){i.uniform2iv(this.addr,t)}function F_(i,t){i.uniform3iv(this.addr,t)}function O_(i,t){i.uniform4iv(this.addr,t)}function z_(i,t){i.uniform1uiv(this.addr,t)}function k_(i,t){i.uniform2uiv(this.addr,t)}function B_(i,t){i.uniform3uiv(this.addr,t)}function H_(i,t){i.uniform4uiv(this.addr,t)}function G_(i,t,e){const n=this.cache,s=t.length,o=xa(e,s);Ce(n,o)||(i.uniform1iv(this.addr,o),Pe(n,o));for(let r=0;r!==s;++r)e.setTexture2D(t[r]||Qf,o[r])}function V_(i,t,e){const n=this.cache,s=t.length,o=xa(e,s);Ce(n,o)||(i.uniform1iv(this.addr,o),Pe(n,o));for(let r=0;r!==s;++r)e.setTexture3D(t[r]||ep,o[r])}function W_(i,t,e){const n=this.cache,s=t.length,o=xa(e,s);Ce(n,o)||(i.uniform1iv(this.addr,o),Pe(n,o));for(let r=0;r!==s;++r)e.setTextureCube(t[r]||np,o[r])}function X_(i,t,e){const n=this.cache,s=t.length,o=xa(e,s);Ce(n,o)||(i.uniform1iv(this.addr,o),Pe(n,o));for(let r=0;r!==s;++r)e.setTexture2DArray(t[r]||tp,o[r])}function Y_(i){switch(i){case 5126:return A_;case 35664:return R_;case 35665:return C_;case 35666:return P_;case 35674:return I_;case 35675:return L_;case 35676:return D_;case 5124:case 35670:return N_;case 35667:case 35671:return U_;case 35668:case 35672:return F_;case 35669:case 35673:return O_;case 5125:return z_;case 36294:return k_;case 36295:return B_;case 36296:return H_;case 35678:case 36198:case 36298:case 36306:case 35682:return G_;case 35679:case 36299:case 36307:return V_;case 35680:case 36300:case 36308:case 36293:return W_;case 36289:case 36303:case 36311:case 36292:return X_}}class q_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=T_(e.type)}}class $_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Y_(e.type)}}class Z_{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let o=0,r=s.length;o!==r;++o){const a=s[o];a.setValue(t,e[a.id],n)}}}const oc=/(\w+)(\])?(\[|\.)?/g;function pd(i,t){i.seq.push(t),i.map[t.id]=t}function K_(i,t,e){const n=i.name,s=n.length;for(oc.lastIndex=0;;){const o=oc.exec(n),r=oc.lastIndex;let a=o[1];const c=o[2]==="]",l=o[3];if(c&&(a=a|0),l===void 0||l==="["&&r+2===s){pd(e,l===void 0?new q_(a,i,t):new $_(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new Z_(a),pd(e,u)),e=u}}}class $r{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const o=t.getActiveUniform(e,s),r=t.getUniformLocation(e,o.name);K_(o,r,this)}}setValue(t,e,n,s){const o=this.map[e];o!==void 0&&o.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let o=0,r=e.length;o!==r;++o){const a=e[o],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,o=t.length;s!==o;++s){const r=t[s];r.id in e&&n.push(r)}return n}}function md(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const j_=37297;let J_=0;function Q_(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),o=Math.min(t+6,e.length);for(let r=s;r<o;r++){const a=r+1;n.push(`${a===t?">":" "} ${a}: ${e[r]}`)}return n.join(`
`)}const gd=new Kt;function tw(i){re._getMatrix(gd,re.workingColorSpace,i);const t=`mat3( ${gd.elements.map(e=>e.toFixed(4))} )`;switch(re.getTransfer(i)){case va:return[t,"LinearTransferOETF"];case de:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function yd(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const r=parseInt(o[1]);return e.toUpperCase()+`

`+s+`

`+Q_(i.getShaderSource(t),r)}else return s}function ew(i,t){const e=tw(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function nw(i,t){let e;switch(t){case Ef:e="Linear";break;case Tf:e="Reinhard";break;case Af:e="Cineon";break;case Rf:e="ACESFilmic";break;case Cf:e="AgX";break;case Pf:e="Neutral";break;case dg:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const ar=new R;function iw(){re.getLuminanceCoefficients(ar);const i=ar.x.toFixed(4),t=ar.y.toFixed(4),e=ar.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function sw(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(mo).join(`
`)}function ow(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function rw(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const o=i.getActiveAttrib(t,s),r=o.name;let a=1;o.type===i.FLOAT_MAT2&&(a=2),o.type===i.FLOAT_MAT3&&(a=3),o.type===i.FLOAT_MAT4&&(a=4),e[r]={type:o.type,location:i.getAttribLocation(t,r),locationSize:a}}return e}function mo(i){return i!==""}function vd(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function _d(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const aw=/^[ \t]*#include +<([\w\d./]+)>/gm;function Kl(i){return i.replace(aw,lw)}const cw=new Map;function lw(i,t){let e=Jt[t];if(e===void 0){const n=cw.get(t);if(n!==void 0)e=Jt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Kl(e)}const hw=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function wd(i){return i.replace(hw,uw)}function uw(i,t,e,n){let s="";for(let o=parseInt(t);o<parseInt(e);o++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return s}function xd(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function dw(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===bf?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Sf?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Hn&&(t="SHADOWMAP_TYPE_VSM"),t}function fw(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case As:case Rs:t="ENVMAP_TYPE_CUBE";break;case ya:t="ENVMAP_TYPE_CUBE_UV";break}return t}function pw(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Rs:t="ENVMAP_MODE_REFRACTION";break}return t}function mw(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Sh:t="ENVMAP_BLENDING_MULTIPLY";break;case hg:t="ENVMAP_BLENDING_MIX";break;case ug:t="ENVMAP_BLENDING_ADD";break}return t}function gw(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function yw(i,t,e,n){const s=i.getContext(),o=e.defines;let r=e.vertexShader,a=e.fragmentShader;const c=dw(e),l=fw(e),h=pw(e),u=mw(e),f=gw(e),d=sw(e),g=ow(o),y=s.createProgram();let m,p,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(mo).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(mo).join(`
`),p.length>0&&(p+=`
`)):(m=[xd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(mo).join(`
`),p=[xd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==di?"#define TONE_MAPPING":"",e.toneMapping!==di?Jt.tonemapping_pars_fragment:"",e.toneMapping!==di?nw("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Jt.colorspace_pars_fragment,ew("linearToOutputTexel",e.outputColorSpace),iw(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(mo).join(`
`)),r=Kl(r),r=vd(r,e),r=_d(r,e),a=Kl(a),a=vd(a,e),a=_d(a,e),r=wd(r),a=wd(a),e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===Du?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Du?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const v=_+m+r,w=_+p+a,b=md(s,s.VERTEX_SHADER,v),S=md(s,s.FRAGMENT_SHADER,w);s.attachShader(y,b),s.attachShader(y,S),e.index0AttributeName!==void 0?s.bindAttribLocation(y,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function E(A){if(i.debug.checkShaderErrors){const P=s.getProgramInfoLog(y).trim(),C=s.getShaderInfoLog(b).trim(),F=s.getShaderInfoLog(S).trim();let N=!0,D=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(N=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,y,b,S);else{const B=yd(s,b,"vertex"),H=yd(s,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+P+`
`+B+`
`+H)}else P!==""?console.warn("THREE.WebGLProgram: Program Info Log:",P):(C===""||F==="")&&(D=!1);D&&(A.diagnostics={runnable:N,programLog:P,vertexShader:{log:C,prefix:m},fragmentShader:{log:F,prefix:p}})}s.deleteShader(b),s.deleteShader(S),T=new $r(s,y),x=rw(s,y)}let T;this.getUniforms=function(){return T===void 0&&E(this),T};let x;this.getAttributes=function(){return x===void 0&&E(this),x};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(y,j_)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=J_++,this.cacheKey=t,this.usedTimes=1,this.program=y,this.vertexShader=b,this.fragmentShader=S,this}let vw=0;class _w{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),o=this._getShaderStage(n),r=this._getShaderCacheForMaterial(t);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(o)===!1&&(r.add(o),o.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new ww(t),e.set(t,n)),n}}class ww{constructor(t){this.id=vw++,this.code=t,this.usedTimes=0}}function xw(i,t,e,n,s,o,r){const a=new _a,c=new _w,l=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures;let d=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(x){return l.add(x),x===0?"uv":`uv${x}`}function m(x,M,A,P,C){const F=P.fog,N=C.geometry,D=x.isMeshStandardMaterial?P.environment:null,B=(x.isMeshStandardMaterial?e:t).get(x.envMap||D),H=B&&B.mapping===ya?B.image.height:null,V=g[x.type];x.precision!==null&&(d=s.getMaxPrecision(x.precision),d!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",d,"instead."));const et=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,lt=et!==void 0?et.length:0;let Mt=0;N.morphAttributes.position!==void 0&&(Mt=1),N.morphAttributes.normal!==void 0&&(Mt=2),N.morphAttributes.color!==void 0&&(Mt=3);let Lt,J,rt,K;if(V){const ue=Mn[V];Lt=ue.vertexShader,J=ue.fragmentShader}else Lt=x.vertexShader,J=x.fragmentShader,c.update(x),rt=c.getVertexShaderID(x),K=c.getFragmentShaderID(x);const q=i.getRenderTarget(),ot=i.state.buffers.depth.getReversed(),pt=C.isInstancedMesh===!0,wt=C.isBatchedMesh===!0,Ft=!!x.map,nt=!!x.matcap,ht=!!B,k=!!x.aoMap,ft=!!x.lightMap,st=!!x.bumpMap,gt=!!x.normalMap,yt=!!x.displacementMap,Gt=!!x.emissiveMap,Pt=!!x.metalnessMap,z=!!x.roughnessMap,L=x.anisotropy>0,$=x.clearcoat>0,at=x.dispersion>0,dt=x.iridescence>0,ct=x.sheen>0,Ut=x.transmission>0,Et=L&&!!x.anisotropyMap,It=$&&!!x.clearcoatMap,ne=$&&!!x.clearcoatNormalMap,mt=$&&!!x.clearcoatRoughnessMap,Dt=dt&&!!x.iridescenceMap,Vt=dt&&!!x.iridescenceThicknessMap,Wt=ct&&!!x.sheenColorMap,Nt=ct&&!!x.sheenRoughnessMap,oe=!!x.specularMap,jt=!!x.specularColorMap,me=!!x.specularIntensityMap,W=Ut&&!!x.transmissionMap,Tt=Ut&&!!x.thicknessMap,it=!!x.gradientMap,ut=!!x.alphaMap,Ct=x.alphaTest>0,At=!!x.alphaHash,qt=!!x.extensions;let Me=di;x.toneMapped&&(q===null||q.isXRRenderTarget===!0)&&(Me=i.toneMapping);const Fe={shaderID:V,shaderType:x.type,shaderName:x.name,vertexShader:Lt,fragmentShader:J,defines:x.defines,customVertexShaderID:rt,customFragmentShaderID:K,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:d,batching:wt,batchingColor:wt&&C._colorsTexture!==null,instancing:pt,instancingColor:pt&&C.instanceColor!==null,instancingMorph:pt&&C.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:q===null?i.outputColorSpace:q.isXRRenderTarget===!0?q.texture.colorSpace:Os,alphaToCoverage:!!x.alphaToCoverage,map:Ft,matcap:nt,envMap:ht,envMapMode:ht&&B.mapping,envMapCubeUVHeight:H,aoMap:k,lightMap:ft,bumpMap:st,normalMap:gt,displacementMap:f&&yt,emissiveMap:Gt,normalMapObjectSpace:gt&&x.normalMapType===mg,normalMapTangentSpace:gt&&x.normalMapType===Lh,metalnessMap:Pt,roughnessMap:z,anisotropy:L,anisotropyMap:Et,clearcoat:$,clearcoatMap:It,clearcoatNormalMap:ne,clearcoatRoughnessMap:mt,dispersion:at,iridescence:dt,iridescenceMap:Dt,iridescenceThicknessMap:Vt,sheen:ct,sheenColorMap:Wt,sheenRoughnessMap:Nt,specularMap:oe,specularColorMap:jt,specularIntensityMap:me,transmission:Ut,transmissionMap:W,thicknessMap:Tt,gradientMap:it,opaque:x.transparent===!1&&x.blending===ws&&x.alphaToCoverage===!1,alphaMap:ut,alphaTest:Ct,alphaHash:At,combine:x.combine,mapUv:Ft&&y(x.map.channel),aoMapUv:k&&y(x.aoMap.channel),lightMapUv:ft&&y(x.lightMap.channel),bumpMapUv:st&&y(x.bumpMap.channel),normalMapUv:gt&&y(x.normalMap.channel),displacementMapUv:yt&&y(x.displacementMap.channel),emissiveMapUv:Gt&&y(x.emissiveMap.channel),metalnessMapUv:Pt&&y(x.metalnessMap.channel),roughnessMapUv:z&&y(x.roughnessMap.channel),anisotropyMapUv:Et&&y(x.anisotropyMap.channel),clearcoatMapUv:It&&y(x.clearcoatMap.channel),clearcoatNormalMapUv:ne&&y(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:mt&&y(x.clearcoatRoughnessMap.channel),iridescenceMapUv:Dt&&y(x.iridescenceMap.channel),iridescenceThicknessMapUv:Vt&&y(x.iridescenceThicknessMap.channel),sheenColorMapUv:Wt&&y(x.sheenColorMap.channel),sheenRoughnessMapUv:Nt&&y(x.sheenRoughnessMap.channel),specularMapUv:oe&&y(x.specularMap.channel),specularColorMapUv:jt&&y(x.specularColorMap.channel),specularIntensityMapUv:me&&y(x.specularIntensityMap.channel),transmissionMapUv:W&&y(x.transmissionMap.channel),thicknessMapUv:Tt&&y(x.thicknessMap.channel),alphaMapUv:ut&&y(x.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(gt||L),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,pointsUvs:C.isPoints===!0&&!!N.attributes.uv&&(Ft||ut),fog:!!F,useFog:x.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:x.flatShading===!0,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:ot,skinning:C.isSkinnedMesh===!0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:lt,morphTextureStride:Mt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&A.length>0,shadowMapType:i.shadowMap.type,toneMapping:Me,decodeVideoTexture:Ft&&x.map.isVideoTexture===!0&&re.getTransfer(x.map.colorSpace)===de,decodeVideoTextureEmissive:Gt&&x.emissiveMap.isVideoTexture===!0&&re.getTransfer(x.emissiveMap.colorSpace)===de,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===gn,flipSided:x.side===Ye,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:qt&&x.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(qt&&x.extensions.multiDraw===!0||wt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Fe.vertexUv1s=l.has(1),Fe.vertexUv2s=l.has(2),Fe.vertexUv3s=l.has(3),l.clear(),Fe}function p(x){const M=[];if(x.shaderID?M.push(x.shaderID):(M.push(x.customVertexShaderID),M.push(x.customFragmentShaderID)),x.defines!==void 0)for(const A in x.defines)M.push(A),M.push(x.defines[A]);return x.isRawShaderMaterial===!1&&(_(M,x),v(M,x),M.push(i.outputColorSpace)),M.push(x.customProgramCacheKey),M.join()}function _(x,M){x.push(M.precision),x.push(M.outputColorSpace),x.push(M.envMapMode),x.push(M.envMapCubeUVHeight),x.push(M.mapUv),x.push(M.alphaMapUv),x.push(M.lightMapUv),x.push(M.aoMapUv),x.push(M.bumpMapUv),x.push(M.normalMapUv),x.push(M.displacementMapUv),x.push(M.emissiveMapUv),x.push(M.metalnessMapUv),x.push(M.roughnessMapUv),x.push(M.anisotropyMapUv),x.push(M.clearcoatMapUv),x.push(M.clearcoatNormalMapUv),x.push(M.clearcoatRoughnessMapUv),x.push(M.iridescenceMapUv),x.push(M.iridescenceThicknessMapUv),x.push(M.sheenColorMapUv),x.push(M.sheenRoughnessMapUv),x.push(M.specularMapUv),x.push(M.specularColorMapUv),x.push(M.specularIntensityMapUv),x.push(M.transmissionMapUv),x.push(M.thicknessMapUv),x.push(M.combine),x.push(M.fogExp2),x.push(M.sizeAttenuation),x.push(M.morphTargetsCount),x.push(M.morphAttributeCount),x.push(M.numDirLights),x.push(M.numPointLights),x.push(M.numSpotLights),x.push(M.numSpotLightMaps),x.push(M.numHemiLights),x.push(M.numRectAreaLights),x.push(M.numDirLightShadows),x.push(M.numPointLightShadows),x.push(M.numSpotLightShadows),x.push(M.numSpotLightShadowsWithMaps),x.push(M.numLightProbes),x.push(M.shadowMapType),x.push(M.toneMapping),x.push(M.numClippingPlanes),x.push(M.numClipIntersection),x.push(M.depthPacking)}function v(x,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),x.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reverseDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),x.push(a.mask)}function w(x){const M=g[x.type];let A;if(M){const P=Mn[M];A=wa.clone(P.uniforms)}else A=x.uniforms;return A}function b(x,M){let A;for(let P=0,C=h.length;P<C;P++){const F=h[P];if(F.cacheKey===M){A=F,++A.usedTimes;break}}return A===void 0&&(A=new yw(i,M,x,o),h.push(A)),A}function S(x){if(--x.usedTimes===0){const M=h.indexOf(x);h[M]=h[h.length-1],h.pop(),x.destroy()}}function E(x){c.remove(x)}function T(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:w,acquireProgram:b,releaseProgram:S,releaseShaderCache:E,programs:h,dispose:T}}function Mw(){let i=new WeakMap;function t(r){return i.has(r)}function e(r){let a=i.get(r);return a===void 0&&(a={},i.set(r,a)),a}function n(r){i.delete(r)}function s(r,a,c){i.get(r)[a]=c}function o(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:o}}function bw(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Md(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function bd(){const i=[];let t=0;const e=[],n=[],s=[];function o(){t=0,e.length=0,n.length=0,s.length=0}function r(u,f,d,g,y,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:g,renderOrder:u.renderOrder,z:y,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=y,p.group=m),t++,p}function a(u,f,d,g,y,m){const p=r(u,f,d,g,y,m);d.transmission>0?n.push(p):d.transparent===!0?s.push(p):e.push(p)}function c(u,f,d,g,y,m){const p=r(u,f,d,g,y,m);d.transmission>0?n.unshift(p):d.transparent===!0?s.unshift(p):e.unshift(p)}function l(u,f){e.length>1&&e.sort(u||bw),n.length>1&&n.sort(f||Md),s.length>1&&s.sort(f||Md)}function h(){for(let u=t,f=i.length;u<f;u++){const d=i[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:o,push:a,unshift:c,finish:h,sort:l}}function Sw(){let i=new WeakMap;function t(n,s){const o=i.get(n);let r;return o===void 0?(r=new bd,i.set(n,[r])):s>=o.length?(r=new bd,o.push(r)):r=o[s],r}function e(){i=new WeakMap}return{get:t,dispose:e}}function Ew(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new R,color:new Yt};break;case"SpotLight":e={position:new R,direction:new R,color:new Yt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new R,color:new Yt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new R,skyColor:new Yt,groundColor:new Yt};break;case"RectAreaLight":e={color:new Yt,position:new R,halfWidth:new R,halfHeight:new R};break}return i[t.id]=e,e}}}function Tw(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Aw=0;function Rw(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Cw(i){const t=new Ew,e=Tw(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new R);const s=new R,o=new pe,r=new pe;function a(l){let h=0,u=0,f=0;for(let x=0;x<9;x++)n.probe[x].set(0,0,0);let d=0,g=0,y=0,m=0,p=0,_=0,v=0,w=0,b=0,S=0,E=0;l.sort(Rw);for(let x=0,M=l.length;x<M;x++){const A=l[x],P=A.color,C=A.intensity,F=A.distance,N=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)h+=P.r*C,u+=P.g*C,f+=P.b*C;else if(A.isLightProbe){for(let D=0;D<9;D++)n.probe[D].addScaledVector(A.sh.coefficients[D],C);E++}else if(A.isDirectionalLight){const D=t.get(A);if(D.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const B=A.shadow,H=e.get(A);H.shadowIntensity=B.intensity,H.shadowBias=B.bias,H.shadowNormalBias=B.normalBias,H.shadowRadius=B.radius,H.shadowMapSize=B.mapSize,n.directionalShadow[d]=H,n.directionalShadowMap[d]=N,n.directionalShadowMatrix[d]=A.shadow.matrix,_++}n.directional[d]=D,d++}else if(A.isSpotLight){const D=t.get(A);D.position.setFromMatrixPosition(A.matrixWorld),D.color.copy(P).multiplyScalar(C),D.distance=F,D.coneCos=Math.cos(A.angle),D.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),D.decay=A.decay,n.spot[y]=D;const B=A.shadow;if(A.map&&(n.spotLightMap[b]=A.map,b++,B.updateMatrices(A),A.castShadow&&S++),n.spotLightMatrix[y]=B.matrix,A.castShadow){const H=e.get(A);H.shadowIntensity=B.intensity,H.shadowBias=B.bias,H.shadowNormalBias=B.normalBias,H.shadowRadius=B.radius,H.shadowMapSize=B.mapSize,n.spotShadow[y]=H,n.spotShadowMap[y]=N,w++}y++}else if(A.isRectAreaLight){const D=t.get(A);D.color.copy(P).multiplyScalar(C),D.halfWidth.set(A.width*.5,0,0),D.halfHeight.set(0,A.height*.5,0),n.rectArea[m]=D,m++}else if(A.isPointLight){const D=t.get(A);if(D.color.copy(A.color).multiplyScalar(A.intensity),D.distance=A.distance,D.decay=A.decay,A.castShadow){const B=A.shadow,H=e.get(A);H.shadowIntensity=B.intensity,H.shadowBias=B.bias,H.shadowNormalBias=B.normalBias,H.shadowRadius=B.radius,H.shadowMapSize=B.mapSize,H.shadowCameraNear=B.camera.near,H.shadowCameraFar=B.camera.far,n.pointShadow[g]=H,n.pointShadowMap[g]=N,n.pointShadowMatrix[g]=A.shadow.matrix,v++}n.point[g]=D,g++}else if(A.isHemisphereLight){const D=t.get(A);D.skyColor.copy(A.color).multiplyScalar(C),D.groundColor.copy(A.groundColor).multiplyScalar(C),n.hemi[p]=D,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=St.LTC_FLOAT_1,n.rectAreaLTC2=St.LTC_FLOAT_2):(n.rectAreaLTC1=St.LTC_HALF_1,n.rectAreaLTC2=St.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;const T=n.hash;(T.directionalLength!==d||T.pointLength!==g||T.spotLength!==y||T.rectAreaLength!==m||T.hemiLength!==p||T.numDirectionalShadows!==_||T.numPointShadows!==v||T.numSpotShadows!==w||T.numSpotMaps!==b||T.numLightProbes!==E)&&(n.directional.length=d,n.spot.length=y,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=_,n.directionalShadowMap.length=_,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=w,n.spotShadowMap.length=w,n.directionalShadowMatrix.length=_,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=w+b-S,n.spotLightMap.length=b,n.numSpotLightShadowsWithMaps=S,n.numLightProbes=E,T.directionalLength=d,T.pointLength=g,T.spotLength=y,T.rectAreaLength=m,T.hemiLength=p,T.numDirectionalShadows=_,T.numPointShadows=v,T.numSpotShadows=w,T.numSpotMaps=b,T.numLightProbes=E,n.version=Aw++)}function c(l,h){let u=0,f=0,d=0,g=0,y=0;const m=h.matrixWorldInverse;for(let p=0,_=l.length;p<_;p++){const v=l[p];if(v.isDirectionalLight){const w=n.directional[u];w.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(m),u++}else if(v.isSpotLight){const w=n.spot[d];w.position.setFromMatrixPosition(v.matrixWorld),w.position.applyMatrix4(m),w.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(m),d++}else if(v.isRectAreaLight){const w=n.rectArea[g];w.position.setFromMatrixPosition(v.matrixWorld),w.position.applyMatrix4(m),r.identity(),o.copy(v.matrixWorld),o.premultiply(m),r.extractRotation(o),w.halfWidth.set(v.width*.5,0,0),w.halfHeight.set(0,v.height*.5,0),w.halfWidth.applyMatrix4(r),w.halfHeight.applyMatrix4(r),g++}else if(v.isPointLight){const w=n.point[f];w.position.setFromMatrixPosition(v.matrixWorld),w.position.applyMatrix4(m),f++}else if(v.isHemisphereLight){const w=n.hemi[y];w.direction.setFromMatrixPosition(v.matrixWorld),w.direction.transformDirection(m),y++}}}return{setup:a,setupView:c,state:n}}function Sd(i){const t=new Cw(i),e=[],n=[];function s(h){l.camera=h,e.length=0,n.length=0}function o(h){e.push(h)}function r(h){n.push(h)}function a(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:o,pushShadow:r}}function Pw(i){let t=new WeakMap;function e(s,o=0){const r=t.get(s);let a;return r===void 0?(a=new Sd(i),t.set(s,[a])):o>=r.length?(a=new Sd(i),r.push(a)):a=r[o],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class ip extends _i{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=pg,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Iw extends _i{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Lw=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Dw=`uniform sampler2D shadow_pass;
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
}`;function Nw(i,t,e){let n=new Nh;const s=new tt,o=new tt,r=new fe,a=new ip({depthPacking:Hf}),c=new Iw,l={},h=e.maxTextureSize,u={[fi]:Ye,[Ye]:fi,[gn]:gn},f=new on({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new tt},radius:{value:4}},vertexShader:Lw,fragmentShader:Dw}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const g=new Ie;g.setAttribute("position",new je(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new ie(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=bf;let p=this.type;this.render=function(S,E,T){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;const x=i.getRenderTarget(),M=i.getActiveCubeFace(),A=i.getActiveMipmapLevel(),P=i.state;P.setBlending($n),P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);const C=p!==Hn&&this.type===Hn,F=p===Hn&&this.type!==Hn;for(let N=0,D=S.length;N<D;N++){const B=S[N],H=B.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",B,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const V=H.getFrameExtents();if(s.multiply(V),o.copy(H.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(o.x=Math.floor(h/V.x),s.x=o.x*V.x,H.mapSize.x=o.x),s.y>h&&(o.y=Math.floor(h/V.y),s.y=o.y*V.y,H.mapSize.y=o.y)),H.map===null||C===!0||F===!0){const lt=this.type!==Hn?{minFilter:Ue,magFilter:Ue}:{};H.map!==null&&H.map.dispose(),H.map=new An(s.x,s.y,lt),H.map.texture.name=B.name+".shadowMap",H.camera.updateProjectionMatrix()}i.setRenderTarget(H.map),i.clear();const et=H.getViewportCount();for(let lt=0;lt<et;lt++){const Mt=H.getViewport(lt);r.set(o.x*Mt.x,o.y*Mt.y,o.x*Mt.z,o.y*Mt.w),P.viewport(r),H.updateMatrices(B,lt),n=H.getFrustum(),w(E,T,H.camera,B,this.type)}H.isPointLightShadow!==!0&&this.type===Hn&&_(H,T),H.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(x,M,A)};function _(S,E){const T=t.update(y);f.defines.VSM_SAMPLES!==S.blurSamples&&(f.defines.VSM_SAMPLES=S.blurSamples,d.defines.VSM_SAMPLES=S.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new An(s.x,s.y)),f.uniforms.shadow_pass.value=S.map.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(E,null,T,f,y,null),d.uniforms.shadow_pass.value=S.mapPass.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(E,null,T,d,y,null)}function v(S,E,T,x){let M=null;const A=T.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(A!==void 0)M=A;else if(M=T.isPointLight===!0?c:a,i.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const P=M.uuid,C=E.uuid;let F=l[P];F===void 0&&(F={},l[P]=F);let N=F[C];N===void 0&&(N=M.clone(),F[C]=N,E.addEventListener("dispose",b)),M=N}if(M.visible=E.visible,M.wireframe=E.wireframe,x===Hn?M.side=E.shadowSide!==null?E.shadowSide:E.side:M.side=E.shadowSide!==null?E.shadowSide:u[E.side],M.alphaMap=E.alphaMap,M.alphaTest=E.alphaTest,M.map=E.map,M.clipShadows=E.clipShadows,M.clippingPlanes=E.clippingPlanes,M.clipIntersection=E.clipIntersection,M.displacementMap=E.displacementMap,M.displacementScale=E.displacementScale,M.displacementBias=E.displacementBias,M.wireframeLinewidth=E.wireframeLinewidth,M.linewidth=E.linewidth,T.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const P=i.properties.get(M);P.light=T}return M}function w(S,E,T,x,M){if(S.visible===!1)return;if(S.layers.test(E.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&M===Hn)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,S.matrixWorld);const C=t.update(S),F=S.material;if(Array.isArray(F)){const N=C.groups;for(let D=0,B=N.length;D<B;D++){const H=N[D],V=F[H.materialIndex];if(V&&V.visible){const et=v(S,V,x,M);S.onBeforeShadow(i,S,E,T,C,et,H),i.renderBufferDirect(T,null,C,et,S,H),S.onAfterShadow(i,S,E,T,C,et,H)}}}else if(F.visible){const N=v(S,F,x,M);S.onBeforeShadow(i,S,E,T,C,N,null),i.renderBufferDirect(T,null,C,N,S,null),S.onAfterShadow(i,S,E,T,C,N,null)}}const P=S.children;for(let C=0,F=P.length;C<F;C++)w(P[C],E,T,x,M)}function b(S){S.target.removeEventListener("dispose",b);for(const T in l){const x=l[T],M=S.target.uuid;M in x&&(x[M].dispose(),delete x[M])}}}const Uw={[pl]:ml,[gl]:_l,[yl]:wl,[Ts]:vl,[ml]:pl,[_l]:gl,[wl]:yl,[vl]:Ts};function Fw(i,t){function e(){let W=!1;const Tt=new fe;let it=null;const ut=new fe(0,0,0,0);return{setMask:function(Ct){it!==Ct&&!W&&(i.colorMask(Ct,Ct,Ct,Ct),it=Ct)},setLocked:function(Ct){W=Ct},setClear:function(Ct,At,qt,Me,Fe){Fe===!0&&(Ct*=Me,At*=Me,qt*=Me),Tt.set(Ct,At,qt,Me),ut.equals(Tt)===!1&&(i.clearColor(Ct,At,qt,Me),ut.copy(Tt))},reset:function(){W=!1,it=null,ut.set(-1,0,0,0)}}}function n(){let W=!1,Tt=!1,it=null,ut=null,Ct=null;return{setReversed:function(At){if(Tt!==At){const qt=t.get("EXT_clip_control");Tt?qt.clipControlEXT(qt.LOWER_LEFT_EXT,qt.ZERO_TO_ONE_EXT):qt.clipControlEXT(qt.LOWER_LEFT_EXT,qt.NEGATIVE_ONE_TO_ONE_EXT);const Me=Ct;Ct=null,this.setClear(Me)}Tt=At},getReversed:function(){return Tt},setTest:function(At){At?q(i.DEPTH_TEST):ot(i.DEPTH_TEST)},setMask:function(At){it!==At&&!W&&(i.depthMask(At),it=At)},setFunc:function(At){if(Tt&&(At=Uw[At]),ut!==At){switch(At){case pl:i.depthFunc(i.NEVER);break;case ml:i.depthFunc(i.ALWAYS);break;case gl:i.depthFunc(i.LESS);break;case Ts:i.depthFunc(i.LEQUAL);break;case yl:i.depthFunc(i.EQUAL);break;case vl:i.depthFunc(i.GEQUAL);break;case _l:i.depthFunc(i.GREATER);break;case wl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ut=At}},setLocked:function(At){W=At},setClear:function(At){Ct!==At&&(Tt&&(At=1-At),i.clearDepth(At),Ct=At)},reset:function(){W=!1,it=null,ut=null,Ct=null,Tt=!1}}}function s(){let W=!1,Tt=null,it=null,ut=null,Ct=null,At=null,qt=null,Me=null,Fe=null;return{setTest:function(ue){W||(ue?q(i.STENCIL_TEST):ot(i.STENCIL_TEST))},setMask:function(ue){Tt!==ue&&!W&&(i.stencilMask(ue),Tt=ue)},setFunc:function(ue,un,Ln){(it!==ue||ut!==un||Ct!==Ln)&&(i.stencilFunc(ue,un,Ln),it=ue,ut=un,Ct=Ln)},setOp:function(ue,un,Ln){(At!==ue||qt!==un||Me!==Ln)&&(i.stencilOp(ue,un,Ln),At=ue,qt=un,Me=Ln)},setLocked:function(ue){W=ue},setClear:function(ue){Fe!==ue&&(i.clearStencil(ue),Fe=ue)},reset:function(){W=!1,Tt=null,it=null,ut=null,Ct=null,At=null,qt=null,Me=null,Fe=null}}}const o=new e,r=new n,a=new s,c=new WeakMap,l=new WeakMap;let h={},u={},f=new WeakMap,d=[],g=null,y=!1,m=null,p=null,_=null,v=null,w=null,b=null,S=null,E=new Yt(0,0,0),T=0,x=!1,M=null,A=null,P=null,C=null,F=null;const N=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let D=!1,B=0;const H=i.getParameter(i.VERSION);H.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec(H)[1]),D=B>=1):H.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),D=B>=2);let V=null,et={};const lt=i.getParameter(i.SCISSOR_BOX),Mt=i.getParameter(i.VIEWPORT),Lt=new fe().fromArray(lt),J=new fe().fromArray(Mt);function rt(W,Tt,it,ut){const Ct=new Uint8Array(4),At=i.createTexture();i.bindTexture(W,At),i.texParameteri(W,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(W,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let qt=0;qt<it;qt++)W===i.TEXTURE_3D||W===i.TEXTURE_2D_ARRAY?i.texImage3D(Tt,0,i.RGBA,1,1,ut,0,i.RGBA,i.UNSIGNED_BYTE,Ct):i.texImage2D(Tt+qt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ct);return At}const K={};K[i.TEXTURE_2D]=rt(i.TEXTURE_2D,i.TEXTURE_2D,1),K[i.TEXTURE_CUBE_MAP]=rt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),K[i.TEXTURE_2D_ARRAY]=rt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),K[i.TEXTURE_3D]=rt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),o.setClear(0,0,0,1),r.setClear(1),a.setClear(0),q(i.DEPTH_TEST),r.setFunc(Ts),st(!1),gt(Ru),q(i.CULL_FACE),k($n);function q(W){h[W]!==!0&&(i.enable(W),h[W]=!0)}function ot(W){h[W]!==!1&&(i.disable(W),h[W]=!1)}function pt(W,Tt){return u[W]!==Tt?(i.bindFramebuffer(W,Tt),u[W]=Tt,W===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=Tt),W===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=Tt),!0):!1}function wt(W,Tt){let it=d,ut=!1;if(W){it=f.get(Tt),it===void 0&&(it=[],f.set(Tt,it));const Ct=W.textures;if(it.length!==Ct.length||it[0]!==i.COLOR_ATTACHMENT0){for(let At=0,qt=Ct.length;At<qt;At++)it[At]=i.COLOR_ATTACHMENT0+At;it.length=Ct.length,ut=!0}}else it[0]!==i.BACK&&(it[0]=i.BACK,ut=!0);ut&&i.drawBuffers(it)}function Ft(W){return g!==W?(i.useProgram(W),g=W,!0):!1}const nt={[Ni]:i.FUNC_ADD,[qm]:i.FUNC_SUBTRACT,[$m]:i.FUNC_REVERSE_SUBTRACT};nt[Zm]=i.MIN,nt[Km]=i.MAX;const ht={[jm]:i.ZERO,[Jm]:i.ONE,[Qm]:i.SRC_COLOR,[dl]:i.SRC_ALPHA,[og]:i.SRC_ALPHA_SATURATE,[ig]:i.DST_COLOR,[eg]:i.DST_ALPHA,[tg]:i.ONE_MINUS_SRC_COLOR,[fl]:i.ONE_MINUS_SRC_ALPHA,[sg]:i.ONE_MINUS_DST_COLOR,[ng]:i.ONE_MINUS_DST_ALPHA,[rg]:i.CONSTANT_COLOR,[ag]:i.ONE_MINUS_CONSTANT_COLOR,[cg]:i.CONSTANT_ALPHA,[lg]:i.ONE_MINUS_CONSTANT_ALPHA};function k(W,Tt,it,ut,Ct,At,qt,Me,Fe,ue){if(W===$n){y===!0&&(ot(i.BLEND),y=!1);return}if(y===!1&&(q(i.BLEND),y=!0),W!==Ym){if(W!==m||ue!==x){if((p!==Ni||w!==Ni)&&(i.blendEquation(i.FUNC_ADD),p=Ni,w=Ni),ue)switch(W){case ws:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ul:i.blendFunc(i.ONE,i.ONE);break;case Cu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Pu:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}else switch(W){case ws:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ul:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Cu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Pu:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}_=null,v=null,b=null,S=null,E.set(0,0,0),T=0,m=W,x=ue}return}Ct=Ct||Tt,At=At||it,qt=qt||ut,(Tt!==p||Ct!==w)&&(i.blendEquationSeparate(nt[Tt],nt[Ct]),p=Tt,w=Ct),(it!==_||ut!==v||At!==b||qt!==S)&&(i.blendFuncSeparate(ht[it],ht[ut],ht[At],ht[qt]),_=it,v=ut,b=At,S=qt),(Me.equals(E)===!1||Fe!==T)&&(i.blendColor(Me.r,Me.g,Me.b,Fe),E.copy(Me),T=Fe),m=W,x=!1}function ft(W,Tt){W.side===gn?ot(i.CULL_FACE):q(i.CULL_FACE);let it=W.side===Ye;Tt&&(it=!it),st(it),W.blending===ws&&W.transparent===!1?k($n):k(W.blending,W.blendEquation,W.blendSrc,W.blendDst,W.blendEquationAlpha,W.blendSrcAlpha,W.blendDstAlpha,W.blendColor,W.blendAlpha,W.premultipliedAlpha),r.setFunc(W.depthFunc),r.setTest(W.depthTest),r.setMask(W.depthWrite),o.setMask(W.colorWrite);const ut=W.stencilWrite;a.setTest(ut),ut&&(a.setMask(W.stencilWriteMask),a.setFunc(W.stencilFunc,W.stencilRef,W.stencilFuncMask),a.setOp(W.stencilFail,W.stencilZFail,W.stencilZPass)),Gt(W.polygonOffset,W.polygonOffsetFactor,W.polygonOffsetUnits),W.alphaToCoverage===!0?q(i.SAMPLE_ALPHA_TO_COVERAGE):ot(i.SAMPLE_ALPHA_TO_COVERAGE)}function st(W){M!==W&&(W?i.frontFace(i.CW):i.frontFace(i.CCW),M=W)}function gt(W){W!==Wm?(q(i.CULL_FACE),W!==A&&(W===Ru?i.cullFace(i.BACK):W===Xm?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ot(i.CULL_FACE),A=W}function yt(W){W!==P&&(D&&i.lineWidth(W),P=W)}function Gt(W,Tt,it){W?(q(i.POLYGON_OFFSET_FILL),(C!==Tt||F!==it)&&(i.polygonOffset(Tt,it),C=Tt,F=it)):ot(i.POLYGON_OFFSET_FILL)}function Pt(W){W?q(i.SCISSOR_TEST):ot(i.SCISSOR_TEST)}function z(W){W===void 0&&(W=i.TEXTURE0+N-1),V!==W&&(i.activeTexture(W),V=W)}function L(W,Tt,it){it===void 0&&(V===null?it=i.TEXTURE0+N-1:it=V);let ut=et[it];ut===void 0&&(ut={type:void 0,texture:void 0},et[it]=ut),(ut.type!==W||ut.texture!==Tt)&&(V!==it&&(i.activeTexture(it),V=it),i.bindTexture(W,Tt||K[W]),ut.type=W,ut.texture=Tt)}function $(){const W=et[V];W!==void 0&&W.type!==void 0&&(i.bindTexture(W.type,null),W.type=void 0,W.texture=void 0)}function at(){try{i.compressedTexImage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function dt(){try{i.compressedTexImage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function ct(){try{i.texSubImage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Ut(){try{i.texSubImage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Et(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function It(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function ne(){try{i.texStorage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function mt(){try{i.texStorage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Dt(){try{i.texImage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Vt(){try{i.texImage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Wt(W){Lt.equals(W)===!1&&(i.scissor(W.x,W.y,W.z,W.w),Lt.copy(W))}function Nt(W){J.equals(W)===!1&&(i.viewport(W.x,W.y,W.z,W.w),J.copy(W))}function oe(W,Tt){let it=l.get(Tt);it===void 0&&(it=new WeakMap,l.set(Tt,it));let ut=it.get(W);ut===void 0&&(ut=i.getUniformBlockIndex(Tt,W.name),it.set(W,ut))}function jt(W,Tt){const ut=l.get(Tt).get(W);c.get(Tt)!==ut&&(i.uniformBlockBinding(Tt,ut,W.__bindingPointIndex),c.set(Tt,ut))}function me(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),r.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},V=null,et={},u={},f=new WeakMap,d=[],g=null,y=!1,m=null,p=null,_=null,v=null,w=null,b=null,S=null,E=new Yt(0,0,0),T=0,x=!1,M=null,A=null,P=null,C=null,F=null,Lt.set(0,0,i.canvas.width,i.canvas.height),J.set(0,0,i.canvas.width,i.canvas.height),o.reset(),r.reset(),a.reset()}return{buffers:{color:o,depth:r,stencil:a},enable:q,disable:ot,bindFramebuffer:pt,drawBuffers:wt,useProgram:Ft,setBlending:k,setMaterial:ft,setFlipSided:st,setCullFace:gt,setLineWidth:yt,setPolygonOffset:Gt,setScissorTest:Pt,activeTexture:z,bindTexture:L,unbindTexture:$,compressedTexImage2D:at,compressedTexImage3D:dt,texImage2D:Dt,texImage3D:Vt,updateUBOMapping:oe,uniformBlockBinding:jt,texStorage2D:ne,texStorage3D:mt,texSubImage2D:ct,texSubImage3D:Ut,compressedTexSubImage2D:Et,compressedTexSubImage3D:It,scissor:Wt,viewport:Nt,reset:me}}function Ed(i,t,e,n){const s=Ow(n);switch(e){case Uf:return i*t;case Of:return i*t;case zf:return i*t*2;case Rh:return i*t/s.components*s.byteLength;case Ch:return i*t/s.components*s.byteLength;case kf:return i*t*2/s.components*s.byteLength;case Ph:return i*t*2/s.components*s.byteLength;case Ff:return i*t*3/s.components*s.byteLength;case hn:return i*t*4/s.components*s.byteLength;case Ih:return i*t*4/s.components*s.byteLength;case Vr:case Wr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Xr:case Yr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case El:case Al:return Math.max(i,16)*Math.max(t,8)/4;case Sl:case Tl:return Math.max(i,8)*Math.max(t,8)/2;case Rl:case Cl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Pl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Il:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ll:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Dl:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Nl:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Ul:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Fl:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Ol:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case zl:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case kl:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Bl:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Hl:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Gl:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Vl:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Wl:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case qr:case Xl:case Yl:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Bf:case ql:return Math.ceil(i/4)*Math.ceil(t/4)*8;case $l:case Zl:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Ow(i){switch(i){case Tn:case Lf:return{byteLength:1,components:1};case So:case Df:case pi:return{byteLength:2,components:1};case Th:case Ah:return{byteLength:2,components:4};case Bi:case Eh:case Xn:return{byteLength:4,components:1};case Nf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function zw(i,t,e,n,s,o,r){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new tt,h=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(z,L){return d?new OffscreenCanvas(z,L):Jr("canvas")}function y(z,L,$){let at=1;const dt=Pt(z);if((dt.width>$||dt.height>$)&&(at=$/Math.max(dt.width,dt.height)),at<1)if(typeof HTMLImageElement<"u"&&z instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&z instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&z instanceof ImageBitmap||typeof VideoFrame<"u"&&z instanceof VideoFrame){const ct=Math.floor(at*dt.width),Ut=Math.floor(at*dt.height);u===void 0&&(u=g(ct,Ut));const Et=L?g(ct,Ut):u;return Et.width=ct,Et.height=Ut,Et.getContext("2d").drawImage(z,0,0,ct,Ut),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+dt.width+"x"+dt.height+") to ("+ct+"x"+Ut+")."),Et}else return"data"in z&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+dt.width+"x"+dt.height+")."),z;return z}function m(z){return z.generateMipmaps}function p(z){i.generateMipmap(z)}function _(z){return z.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:z.isWebGL3DRenderTarget?i.TEXTURE_3D:z.isWebGLArrayRenderTarget||z.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(z,L,$,at,dt=!1){if(z!==null){if(i[z]!==void 0)return i[z];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+z+"'")}let ct=L;if(L===i.RED&&($===i.FLOAT&&(ct=i.R32F),$===i.HALF_FLOAT&&(ct=i.R16F),$===i.UNSIGNED_BYTE&&(ct=i.R8)),L===i.RED_INTEGER&&($===i.UNSIGNED_BYTE&&(ct=i.R8UI),$===i.UNSIGNED_SHORT&&(ct=i.R16UI),$===i.UNSIGNED_INT&&(ct=i.R32UI),$===i.BYTE&&(ct=i.R8I),$===i.SHORT&&(ct=i.R16I),$===i.INT&&(ct=i.R32I)),L===i.RG&&($===i.FLOAT&&(ct=i.RG32F),$===i.HALF_FLOAT&&(ct=i.RG16F),$===i.UNSIGNED_BYTE&&(ct=i.RG8)),L===i.RG_INTEGER&&($===i.UNSIGNED_BYTE&&(ct=i.RG8UI),$===i.UNSIGNED_SHORT&&(ct=i.RG16UI),$===i.UNSIGNED_INT&&(ct=i.RG32UI),$===i.BYTE&&(ct=i.RG8I),$===i.SHORT&&(ct=i.RG16I),$===i.INT&&(ct=i.RG32I)),L===i.RGB_INTEGER&&($===i.UNSIGNED_BYTE&&(ct=i.RGB8UI),$===i.UNSIGNED_SHORT&&(ct=i.RGB16UI),$===i.UNSIGNED_INT&&(ct=i.RGB32UI),$===i.BYTE&&(ct=i.RGB8I),$===i.SHORT&&(ct=i.RGB16I),$===i.INT&&(ct=i.RGB32I)),L===i.RGBA_INTEGER&&($===i.UNSIGNED_BYTE&&(ct=i.RGBA8UI),$===i.UNSIGNED_SHORT&&(ct=i.RGBA16UI),$===i.UNSIGNED_INT&&(ct=i.RGBA32UI),$===i.BYTE&&(ct=i.RGBA8I),$===i.SHORT&&(ct=i.RGBA16I),$===i.INT&&(ct=i.RGBA32I)),L===i.RGB&&$===i.UNSIGNED_INT_5_9_9_9_REV&&(ct=i.RGB9_E5),L===i.RGBA){const Ut=dt?va:re.getTransfer(at);$===i.FLOAT&&(ct=i.RGBA32F),$===i.HALF_FLOAT&&(ct=i.RGBA16F),$===i.UNSIGNED_BYTE&&(ct=Ut===de?i.SRGB8_ALPHA8:i.RGBA8),$===i.UNSIGNED_SHORT_4_4_4_4&&(ct=i.RGBA4),$===i.UNSIGNED_SHORT_5_5_5_1&&(ct=i.RGB5_A1)}return(ct===i.R16F||ct===i.R32F||ct===i.RG16F||ct===i.RG32F||ct===i.RGBA16F||ct===i.RGBA32F)&&t.get("EXT_color_buffer_float"),ct}function w(z,L){let $;return z?L===null||L===Bi||L===Cs?$=i.DEPTH24_STENCIL8:L===Xn?$=i.DEPTH32F_STENCIL8:L===So&&($=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):L===null||L===Bi||L===Cs?$=i.DEPTH_COMPONENT24:L===Xn?$=i.DEPTH_COMPONENT32F:L===So&&($=i.DEPTH_COMPONENT16),$}function b(z,L){return m(z)===!0||z.isFramebufferTexture&&z.minFilter!==Ue&&z.minFilter!==sn?Math.log2(Math.max(L.width,L.height))+1:z.mipmaps!==void 0&&z.mipmaps.length>0?z.mipmaps.length:z.isCompressedTexture&&Array.isArray(z.image)?L.mipmaps.length:1}function S(z){const L=z.target;L.removeEventListener("dispose",S),T(L),L.isVideoTexture&&h.delete(L)}function E(z){const L=z.target;L.removeEventListener("dispose",E),M(L)}function T(z){const L=n.get(z);if(L.__webglInit===void 0)return;const $=z.source,at=f.get($);if(at){const dt=at[L.__cacheKey];dt.usedTimes--,dt.usedTimes===0&&x(z),Object.keys(at).length===0&&f.delete($)}n.remove(z)}function x(z){const L=n.get(z);i.deleteTexture(L.__webglTexture);const $=z.source,at=f.get($);delete at[L.__cacheKey],r.memory.textures--}function M(z){const L=n.get(z);if(z.depthTexture&&(z.depthTexture.dispose(),n.remove(z.depthTexture)),z.isWebGLCubeRenderTarget)for(let at=0;at<6;at++){if(Array.isArray(L.__webglFramebuffer[at]))for(let dt=0;dt<L.__webglFramebuffer[at].length;dt++)i.deleteFramebuffer(L.__webglFramebuffer[at][dt]);else i.deleteFramebuffer(L.__webglFramebuffer[at]);L.__webglDepthbuffer&&i.deleteRenderbuffer(L.__webglDepthbuffer[at])}else{if(Array.isArray(L.__webglFramebuffer))for(let at=0;at<L.__webglFramebuffer.length;at++)i.deleteFramebuffer(L.__webglFramebuffer[at]);else i.deleteFramebuffer(L.__webglFramebuffer);if(L.__webglDepthbuffer&&i.deleteRenderbuffer(L.__webglDepthbuffer),L.__webglMultisampledFramebuffer&&i.deleteFramebuffer(L.__webglMultisampledFramebuffer),L.__webglColorRenderbuffer)for(let at=0;at<L.__webglColorRenderbuffer.length;at++)L.__webglColorRenderbuffer[at]&&i.deleteRenderbuffer(L.__webglColorRenderbuffer[at]);L.__webglDepthRenderbuffer&&i.deleteRenderbuffer(L.__webglDepthRenderbuffer)}const $=z.textures;for(let at=0,dt=$.length;at<dt;at++){const ct=n.get($[at]);ct.__webglTexture&&(i.deleteTexture(ct.__webglTexture),r.memory.textures--),n.remove($[at])}n.remove(z)}let A=0;function P(){A=0}function C(){const z=A;return z>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+z+" texture units while this GPU supports only "+s.maxTextures),A+=1,z}function F(z){const L=[];return L.push(z.wrapS),L.push(z.wrapT),L.push(z.wrapR||0),L.push(z.magFilter),L.push(z.minFilter),L.push(z.anisotropy),L.push(z.internalFormat),L.push(z.format),L.push(z.type),L.push(z.generateMipmaps),L.push(z.premultiplyAlpha),L.push(z.flipY),L.push(z.unpackAlignment),L.push(z.colorSpace),L.join()}function N(z,L){const $=n.get(z);if(z.isVideoTexture&&yt(z),z.isRenderTargetTexture===!1&&z.version>0&&$.__version!==z.version){const at=z.image;if(at===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(at.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{J($,z,L);return}}e.bindTexture(i.TEXTURE_2D,$.__webglTexture,i.TEXTURE0+L)}function D(z,L){const $=n.get(z);if(z.version>0&&$.__version!==z.version){J($,z,L);return}e.bindTexture(i.TEXTURE_2D_ARRAY,$.__webglTexture,i.TEXTURE0+L)}function B(z,L){const $=n.get(z);if(z.version>0&&$.__version!==z.version){J($,z,L);return}e.bindTexture(i.TEXTURE_3D,$.__webglTexture,i.TEXTURE0+L)}function H(z,L){const $=n.get(z);if(z.version>0&&$.__version!==z.version){rt($,z,L);return}e.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture,i.TEXTURE0+L)}const V={[bo]:i.REPEAT,[Wn]:i.CLAMP_TO_EDGE,[bl]:i.MIRRORED_REPEAT},et={[Ue]:i.NEAREST,[fg]:i.NEAREST_MIPMAP_NEAREST,[Ho]:i.NEAREST_MIPMAP_LINEAR,[sn]:i.LINEAR,[La]:i.LINEAR_MIPMAP_NEAREST,[ui]:i.LINEAR_MIPMAP_LINEAR},lt={[gg]:i.NEVER,[Mg]:i.ALWAYS,[yg]:i.LESS,[Gf]:i.LEQUAL,[vg]:i.EQUAL,[xg]:i.GEQUAL,[_g]:i.GREATER,[wg]:i.NOTEQUAL};function Mt(z,L){if(L.type===Xn&&t.has("OES_texture_float_linear")===!1&&(L.magFilter===sn||L.magFilter===La||L.magFilter===Ho||L.magFilter===ui||L.minFilter===sn||L.minFilter===La||L.minFilter===Ho||L.minFilter===ui)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(z,i.TEXTURE_WRAP_S,V[L.wrapS]),i.texParameteri(z,i.TEXTURE_WRAP_T,V[L.wrapT]),(z===i.TEXTURE_3D||z===i.TEXTURE_2D_ARRAY)&&i.texParameteri(z,i.TEXTURE_WRAP_R,V[L.wrapR]),i.texParameteri(z,i.TEXTURE_MAG_FILTER,et[L.magFilter]),i.texParameteri(z,i.TEXTURE_MIN_FILTER,et[L.minFilter]),L.compareFunction&&(i.texParameteri(z,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(z,i.TEXTURE_COMPARE_FUNC,lt[L.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(L.magFilter===Ue||L.minFilter!==Ho&&L.minFilter!==ui||L.type===Xn&&t.has("OES_texture_float_linear")===!1)return;if(L.anisotropy>1||n.get(L).__currentAnisotropy){const $=t.get("EXT_texture_filter_anisotropic");i.texParameterf(z,$.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(L.anisotropy,s.getMaxAnisotropy())),n.get(L).__currentAnisotropy=L.anisotropy}}}function Lt(z,L){let $=!1;z.__webglInit===void 0&&(z.__webglInit=!0,L.addEventListener("dispose",S));const at=L.source;let dt=f.get(at);dt===void 0&&(dt={},f.set(at,dt));const ct=F(L);if(ct!==z.__cacheKey){dt[ct]===void 0&&(dt[ct]={texture:i.createTexture(),usedTimes:0},r.memory.textures++,$=!0),dt[ct].usedTimes++;const Ut=dt[z.__cacheKey];Ut!==void 0&&(dt[z.__cacheKey].usedTimes--,Ut.usedTimes===0&&x(L)),z.__cacheKey=ct,z.__webglTexture=dt[ct].texture}return $}function J(z,L,$){let at=i.TEXTURE_2D;(L.isDataArrayTexture||L.isCompressedArrayTexture)&&(at=i.TEXTURE_2D_ARRAY),L.isData3DTexture&&(at=i.TEXTURE_3D);const dt=Lt(z,L),ct=L.source;e.bindTexture(at,z.__webglTexture,i.TEXTURE0+$);const Ut=n.get(ct);if(ct.version!==Ut.__version||dt===!0){e.activeTexture(i.TEXTURE0+$);const Et=re.getPrimaries(re.workingColorSpace),It=L.colorSpace===Vn?null:re.getPrimaries(L.colorSpace),ne=L.colorSpace===Vn||Et===It?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,L.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,L.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ne);let mt=y(L.image,!1,s.maxTextureSize);mt=Gt(L,mt);const Dt=o.convert(L.format,L.colorSpace),Vt=o.convert(L.type);let Wt=v(L.internalFormat,Dt,Vt,L.colorSpace,L.isVideoTexture);Mt(at,L);let Nt;const oe=L.mipmaps,jt=L.isVideoTexture!==!0,me=Ut.__version===void 0||dt===!0,W=ct.dataReady,Tt=b(L,mt);if(L.isDepthTexture)Wt=w(L.format===Ps,L.type),me&&(jt?e.texStorage2D(i.TEXTURE_2D,1,Wt,mt.width,mt.height):e.texImage2D(i.TEXTURE_2D,0,Wt,mt.width,mt.height,0,Dt,Vt,null));else if(L.isDataTexture)if(oe.length>0){jt&&me&&e.texStorage2D(i.TEXTURE_2D,Tt,Wt,oe[0].width,oe[0].height);for(let it=0,ut=oe.length;it<ut;it++)Nt=oe[it],jt?W&&e.texSubImage2D(i.TEXTURE_2D,it,0,0,Nt.width,Nt.height,Dt,Vt,Nt.data):e.texImage2D(i.TEXTURE_2D,it,Wt,Nt.width,Nt.height,0,Dt,Vt,Nt.data);L.generateMipmaps=!1}else jt?(me&&e.texStorage2D(i.TEXTURE_2D,Tt,Wt,mt.width,mt.height),W&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,mt.width,mt.height,Dt,Vt,mt.data)):e.texImage2D(i.TEXTURE_2D,0,Wt,mt.width,mt.height,0,Dt,Vt,mt.data);else if(L.isCompressedTexture)if(L.isCompressedArrayTexture){jt&&me&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Tt,Wt,oe[0].width,oe[0].height,mt.depth);for(let it=0,ut=oe.length;it<ut;it++)if(Nt=oe[it],L.format!==hn)if(Dt!==null)if(jt){if(W)if(L.layerUpdates.size>0){const Ct=Ed(Nt.width,Nt.height,L.format,L.type);for(const At of L.layerUpdates){const qt=Nt.data.subarray(At*Ct/Nt.data.BYTES_PER_ELEMENT,(At+1)*Ct/Nt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,At,Nt.width,Nt.height,1,Dt,qt)}L.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,0,Nt.width,Nt.height,mt.depth,Dt,Nt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,it,Wt,Nt.width,Nt.height,mt.depth,0,Nt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else jt?W&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,0,Nt.width,Nt.height,mt.depth,Dt,Vt,Nt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,it,Wt,Nt.width,Nt.height,mt.depth,0,Dt,Vt,Nt.data)}else{jt&&me&&e.texStorage2D(i.TEXTURE_2D,Tt,Wt,oe[0].width,oe[0].height);for(let it=0,ut=oe.length;it<ut;it++)Nt=oe[it],L.format!==hn?Dt!==null?jt?W&&e.compressedTexSubImage2D(i.TEXTURE_2D,it,0,0,Nt.width,Nt.height,Dt,Nt.data):e.compressedTexImage2D(i.TEXTURE_2D,it,Wt,Nt.width,Nt.height,0,Nt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):jt?W&&e.texSubImage2D(i.TEXTURE_2D,it,0,0,Nt.width,Nt.height,Dt,Vt,Nt.data):e.texImage2D(i.TEXTURE_2D,it,Wt,Nt.width,Nt.height,0,Dt,Vt,Nt.data)}else if(L.isDataArrayTexture)if(jt){if(me&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Tt,Wt,mt.width,mt.height,mt.depth),W)if(L.layerUpdates.size>0){const it=Ed(mt.width,mt.height,L.format,L.type);for(const ut of L.layerUpdates){const Ct=mt.data.subarray(ut*it/mt.data.BYTES_PER_ELEMENT,(ut+1)*it/mt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ut,mt.width,mt.height,1,Dt,Vt,Ct)}L.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,mt.width,mt.height,mt.depth,Dt,Vt,mt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Wt,mt.width,mt.height,mt.depth,0,Dt,Vt,mt.data);else if(L.isData3DTexture)jt?(me&&e.texStorage3D(i.TEXTURE_3D,Tt,Wt,mt.width,mt.height,mt.depth),W&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,mt.width,mt.height,mt.depth,Dt,Vt,mt.data)):e.texImage3D(i.TEXTURE_3D,0,Wt,mt.width,mt.height,mt.depth,0,Dt,Vt,mt.data);else if(L.isFramebufferTexture){if(me)if(jt)e.texStorage2D(i.TEXTURE_2D,Tt,Wt,mt.width,mt.height);else{let it=mt.width,ut=mt.height;for(let Ct=0;Ct<Tt;Ct++)e.texImage2D(i.TEXTURE_2D,Ct,Wt,it,ut,0,Dt,Vt,null),it>>=1,ut>>=1}}else if(oe.length>0){if(jt&&me){const it=Pt(oe[0]);e.texStorage2D(i.TEXTURE_2D,Tt,Wt,it.width,it.height)}for(let it=0,ut=oe.length;it<ut;it++)Nt=oe[it],jt?W&&e.texSubImage2D(i.TEXTURE_2D,it,0,0,Dt,Vt,Nt):e.texImage2D(i.TEXTURE_2D,it,Wt,Dt,Vt,Nt);L.generateMipmaps=!1}else if(jt){if(me){const it=Pt(mt);e.texStorage2D(i.TEXTURE_2D,Tt,Wt,it.width,it.height)}W&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Dt,Vt,mt)}else e.texImage2D(i.TEXTURE_2D,0,Wt,Dt,Vt,mt);m(L)&&p(at),Ut.__version=ct.version,L.onUpdate&&L.onUpdate(L)}z.__version=L.version}function rt(z,L,$){if(L.image.length!==6)return;const at=Lt(z,L),dt=L.source;e.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+$);const ct=n.get(dt);if(dt.version!==ct.__version||at===!0){e.activeTexture(i.TEXTURE0+$);const Ut=re.getPrimaries(re.workingColorSpace),Et=L.colorSpace===Vn?null:re.getPrimaries(L.colorSpace),It=L.colorSpace===Vn||Ut===Et?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,L.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,L.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,It);const ne=L.isCompressedTexture||L.image[0].isCompressedTexture,mt=L.image[0]&&L.image[0].isDataTexture,Dt=[];for(let ut=0;ut<6;ut++)!ne&&!mt?Dt[ut]=y(L.image[ut],!0,s.maxCubemapSize):Dt[ut]=mt?L.image[ut].image:L.image[ut],Dt[ut]=Gt(L,Dt[ut]);const Vt=Dt[0],Wt=o.convert(L.format,L.colorSpace),Nt=o.convert(L.type),oe=v(L.internalFormat,Wt,Nt,L.colorSpace),jt=L.isVideoTexture!==!0,me=ct.__version===void 0||at===!0,W=dt.dataReady;let Tt=b(L,Vt);Mt(i.TEXTURE_CUBE_MAP,L);let it;if(ne){jt&&me&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Tt,oe,Vt.width,Vt.height);for(let ut=0;ut<6;ut++){it=Dt[ut].mipmaps;for(let Ct=0;Ct<it.length;Ct++){const At=it[Ct];L.format!==hn?Wt!==null?jt?W&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct,0,0,At.width,At.height,Wt,At.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct,oe,At.width,At.height,0,At.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):jt?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct,0,0,At.width,At.height,Wt,Nt,At.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct,oe,At.width,At.height,0,Wt,Nt,At.data)}}}else{if(it=L.mipmaps,jt&&me){it.length>0&&Tt++;const ut=Pt(Dt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Tt,oe,ut.width,ut.height)}for(let ut=0;ut<6;ut++)if(mt){jt?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,0,0,Dt[ut].width,Dt[ut].height,Wt,Nt,Dt[ut].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,oe,Dt[ut].width,Dt[ut].height,0,Wt,Nt,Dt[ut].data);for(let Ct=0;Ct<it.length;Ct++){const qt=it[Ct].image[ut].image;jt?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct+1,0,0,qt.width,qt.height,Wt,Nt,qt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct+1,oe,qt.width,qt.height,0,Wt,Nt,qt.data)}}else{jt?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,0,0,Wt,Nt,Dt[ut]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,oe,Wt,Nt,Dt[ut]);for(let Ct=0;Ct<it.length;Ct++){const At=it[Ct];jt?W&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct+1,0,0,Wt,Nt,At.image[ut]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ct+1,oe,Wt,Nt,At.image[ut])}}}m(L)&&p(i.TEXTURE_CUBE_MAP),ct.__version=dt.version,L.onUpdate&&L.onUpdate(L)}z.__version=L.version}function K(z,L,$,at,dt,ct){const Ut=o.convert($.format,$.colorSpace),Et=o.convert($.type),It=v($.internalFormat,Ut,Et,$.colorSpace),ne=n.get(L),mt=n.get($);if(mt.__renderTarget=L,!ne.__hasExternalTextures){const Dt=Math.max(1,L.width>>ct),Vt=Math.max(1,L.height>>ct);dt===i.TEXTURE_3D||dt===i.TEXTURE_2D_ARRAY?e.texImage3D(dt,ct,It,Dt,Vt,L.depth,0,Ut,Et,null):e.texImage2D(dt,ct,It,Dt,Vt,0,Ut,Et,null)}e.bindFramebuffer(i.FRAMEBUFFER,z),gt(L)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,at,dt,mt.__webglTexture,0,st(L)):(dt===i.TEXTURE_2D||dt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&dt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,at,dt,mt.__webglTexture,ct),e.bindFramebuffer(i.FRAMEBUFFER,null)}function q(z,L,$){if(i.bindRenderbuffer(i.RENDERBUFFER,z),L.depthBuffer){const at=L.depthTexture,dt=at&&at.isDepthTexture?at.type:null,ct=w(L.stencilBuffer,dt),Ut=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Et=st(L);gt(L)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Et,ct,L.width,L.height):$?i.renderbufferStorageMultisample(i.RENDERBUFFER,Et,ct,L.width,L.height):i.renderbufferStorage(i.RENDERBUFFER,ct,L.width,L.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ut,i.RENDERBUFFER,z)}else{const at=L.textures;for(let dt=0;dt<at.length;dt++){const ct=at[dt],Ut=o.convert(ct.format,ct.colorSpace),Et=o.convert(ct.type),It=v(ct.internalFormat,Ut,Et,ct.colorSpace),ne=st(L);$&&gt(L)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,ne,It,L.width,L.height):gt(L)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ne,It,L.width,L.height):i.renderbufferStorage(i.RENDERBUFFER,It,L.width,L.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ot(z,L){if(L&&L.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,z),!(L.depthTexture&&L.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const at=n.get(L.depthTexture);at.__renderTarget=L,(!at.__webglTexture||L.depthTexture.image.width!==L.width||L.depthTexture.image.height!==L.height)&&(L.depthTexture.image.width=L.width,L.depthTexture.image.height=L.height,L.depthTexture.needsUpdate=!0),N(L.depthTexture,0);const dt=at.__webglTexture,ct=st(L);if(L.depthTexture.format===xs)gt(L)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,dt,0,ct):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,dt,0);else if(L.depthTexture.format===Ps)gt(L)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,dt,0,ct):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,dt,0);else throw new Error("Unknown depthTexture format")}function pt(z){const L=n.get(z),$=z.isWebGLCubeRenderTarget===!0;if(L.__boundDepthTexture!==z.depthTexture){const at=z.depthTexture;if(L.__depthDisposeCallback&&L.__depthDisposeCallback(),at){const dt=()=>{delete L.__boundDepthTexture,delete L.__depthDisposeCallback,at.removeEventListener("dispose",dt)};at.addEventListener("dispose",dt),L.__depthDisposeCallback=dt}L.__boundDepthTexture=at}if(z.depthTexture&&!L.__autoAllocateDepthBuffer){if($)throw new Error("target.depthTexture not supported in Cube render targets");ot(L.__webglFramebuffer,z)}else if($){L.__webglDepthbuffer=[];for(let at=0;at<6;at++)if(e.bindFramebuffer(i.FRAMEBUFFER,L.__webglFramebuffer[at]),L.__webglDepthbuffer[at]===void 0)L.__webglDepthbuffer[at]=i.createRenderbuffer(),q(L.__webglDepthbuffer[at],z,!1);else{const dt=z.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ct=L.__webglDepthbuffer[at];i.bindRenderbuffer(i.RENDERBUFFER,ct),i.framebufferRenderbuffer(i.FRAMEBUFFER,dt,i.RENDERBUFFER,ct)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,L.__webglFramebuffer),L.__webglDepthbuffer===void 0)L.__webglDepthbuffer=i.createRenderbuffer(),q(L.__webglDepthbuffer,z,!1);else{const at=z.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,dt=L.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,dt),i.framebufferRenderbuffer(i.FRAMEBUFFER,at,i.RENDERBUFFER,dt)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function wt(z,L,$){const at=n.get(z);L!==void 0&&K(at.__webglFramebuffer,z,z.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),$!==void 0&&pt(z)}function Ft(z){const L=z.texture,$=n.get(z),at=n.get(L);z.addEventListener("dispose",E);const dt=z.textures,ct=z.isWebGLCubeRenderTarget===!0,Ut=dt.length>1;if(Ut||(at.__webglTexture===void 0&&(at.__webglTexture=i.createTexture()),at.__version=L.version,r.memory.textures++),ct){$.__webglFramebuffer=[];for(let Et=0;Et<6;Et++)if(L.mipmaps&&L.mipmaps.length>0){$.__webglFramebuffer[Et]=[];for(let It=0;It<L.mipmaps.length;It++)$.__webglFramebuffer[Et][It]=i.createFramebuffer()}else $.__webglFramebuffer[Et]=i.createFramebuffer()}else{if(L.mipmaps&&L.mipmaps.length>0){$.__webglFramebuffer=[];for(let Et=0;Et<L.mipmaps.length;Et++)$.__webglFramebuffer[Et]=i.createFramebuffer()}else $.__webglFramebuffer=i.createFramebuffer();if(Ut)for(let Et=0,It=dt.length;Et<It;Et++){const ne=n.get(dt[Et]);ne.__webglTexture===void 0&&(ne.__webglTexture=i.createTexture(),r.memory.textures++)}if(z.samples>0&&gt(z)===!1){$.__webglMultisampledFramebuffer=i.createFramebuffer(),$.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,$.__webglMultisampledFramebuffer);for(let Et=0;Et<dt.length;Et++){const It=dt[Et];$.__webglColorRenderbuffer[Et]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,$.__webglColorRenderbuffer[Et]);const ne=o.convert(It.format,It.colorSpace),mt=o.convert(It.type),Dt=v(It.internalFormat,ne,mt,It.colorSpace,z.isXRRenderTarget===!0),Vt=st(z);i.renderbufferStorageMultisample(i.RENDERBUFFER,Vt,Dt,z.width,z.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Et,i.RENDERBUFFER,$.__webglColorRenderbuffer[Et])}i.bindRenderbuffer(i.RENDERBUFFER,null),z.depthBuffer&&($.__webglDepthRenderbuffer=i.createRenderbuffer(),q($.__webglDepthRenderbuffer,z,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ct){e.bindTexture(i.TEXTURE_CUBE_MAP,at.__webglTexture),Mt(i.TEXTURE_CUBE_MAP,L);for(let Et=0;Et<6;Et++)if(L.mipmaps&&L.mipmaps.length>0)for(let It=0;It<L.mipmaps.length;It++)K($.__webglFramebuffer[Et][It],z,L,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,It);else K($.__webglFramebuffer[Et],z,L,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0);m(L)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ut){for(let Et=0,It=dt.length;Et<It;Et++){const ne=dt[Et],mt=n.get(ne);e.bindTexture(i.TEXTURE_2D,mt.__webglTexture),Mt(i.TEXTURE_2D,ne),K($.__webglFramebuffer,z,ne,i.COLOR_ATTACHMENT0+Et,i.TEXTURE_2D,0),m(ne)&&p(i.TEXTURE_2D)}e.unbindTexture()}else{let Et=i.TEXTURE_2D;if((z.isWebGL3DRenderTarget||z.isWebGLArrayRenderTarget)&&(Et=z.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Et,at.__webglTexture),Mt(Et,L),L.mipmaps&&L.mipmaps.length>0)for(let It=0;It<L.mipmaps.length;It++)K($.__webglFramebuffer[It],z,L,i.COLOR_ATTACHMENT0,Et,It);else K($.__webglFramebuffer,z,L,i.COLOR_ATTACHMENT0,Et,0);m(L)&&p(Et),e.unbindTexture()}z.depthBuffer&&pt(z)}function nt(z){const L=z.textures;for(let $=0,at=L.length;$<at;$++){const dt=L[$];if(m(dt)){const ct=_(z),Ut=n.get(dt).__webglTexture;e.bindTexture(ct,Ut),p(ct),e.unbindTexture()}}}const ht=[],k=[];function ft(z){if(z.samples>0){if(gt(z)===!1){const L=z.textures,$=z.width,at=z.height;let dt=i.COLOR_BUFFER_BIT;const ct=z.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ut=n.get(z),Et=L.length>1;if(Et)for(let It=0;It<L.length;It++)e.bindFramebuffer(i.FRAMEBUFFER,Ut.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Ut.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Ut.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ut.__webglFramebuffer);for(let It=0;It<L.length;It++){if(z.resolveDepthBuffer&&(z.depthBuffer&&(dt|=i.DEPTH_BUFFER_BIT),z.stencilBuffer&&z.resolveStencilBuffer&&(dt|=i.STENCIL_BUFFER_BIT)),Et){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ut.__webglColorRenderbuffer[It]);const ne=n.get(L[It]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ne,0)}i.blitFramebuffer(0,0,$,at,0,0,$,at,dt,i.NEAREST),c===!0&&(ht.length=0,k.length=0,ht.push(i.COLOR_ATTACHMENT0+It),z.depthBuffer&&z.resolveDepthBuffer===!1&&(ht.push(ct),k.push(ct),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,k)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ht))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Et)for(let It=0;It<L.length;It++){e.bindFramebuffer(i.FRAMEBUFFER,Ut.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.RENDERBUFFER,Ut.__webglColorRenderbuffer[It]);const ne=n.get(L[It]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Ut.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.TEXTURE_2D,ne,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ut.__webglMultisampledFramebuffer)}else if(z.depthBuffer&&z.resolveDepthBuffer===!1&&c){const L=z.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[L])}}}function st(z){return Math.min(s.maxSamples,z.samples)}function gt(z){const L=n.get(z);return z.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&L.__useRenderToTexture!==!1}function yt(z){const L=r.render.frame;h.get(z)!==L&&(h.set(z,L),z.update())}function Gt(z,L){const $=z.colorSpace,at=z.format,dt=z.type;return z.isCompressedTexture===!0||z.isVideoTexture===!0||$!==Os&&$!==Vn&&(re.getTransfer($)===de?(at!==hn||dt!==Tn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",$)),L}function Pt(z){return typeof HTMLImageElement<"u"&&z instanceof HTMLImageElement?(l.width=z.naturalWidth||z.width,l.height=z.naturalHeight||z.height):typeof VideoFrame<"u"&&z instanceof VideoFrame?(l.width=z.displayWidth,l.height=z.displayHeight):(l.width=z.width,l.height=z.height),l}this.allocateTextureUnit=C,this.resetTextureUnits=P,this.setTexture2D=N,this.setTexture2DArray=D,this.setTexture3D=B,this.setTextureCube=H,this.rebindTextures=wt,this.setupRenderTarget=Ft,this.updateRenderTargetMipmap=nt,this.updateMultisampleRenderTarget=ft,this.setupDepthRenderbuffer=pt,this.setupFrameBufferTexture=K,this.useMultisampledRTT=gt}function kw(i,t){function e(n,s=Vn){let o;const r=re.getTransfer(s);if(n===Tn)return i.UNSIGNED_BYTE;if(n===Th)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ah)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Nf)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Lf)return i.BYTE;if(n===Df)return i.SHORT;if(n===So)return i.UNSIGNED_SHORT;if(n===Eh)return i.INT;if(n===Bi)return i.UNSIGNED_INT;if(n===Xn)return i.FLOAT;if(n===pi)return i.HALF_FLOAT;if(n===Uf)return i.ALPHA;if(n===Ff)return i.RGB;if(n===hn)return i.RGBA;if(n===Of)return i.LUMINANCE;if(n===zf)return i.LUMINANCE_ALPHA;if(n===xs)return i.DEPTH_COMPONENT;if(n===Ps)return i.DEPTH_STENCIL;if(n===Rh)return i.RED;if(n===Ch)return i.RED_INTEGER;if(n===kf)return i.RG;if(n===Ph)return i.RG_INTEGER;if(n===Ih)return i.RGBA_INTEGER;if(n===Vr||n===Wr||n===Xr||n===Yr)if(r===de)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(n===Vr)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Wr)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Xr)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Yr)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(n===Vr)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Wr)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Xr)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Yr)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Sl||n===El||n===Tl||n===Al)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(n===Sl)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===El)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Tl)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Al)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Rl||n===Cl||n===Pl)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(n===Rl||n===Cl)return r===de?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(n===Pl)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Il||n===Ll||n===Dl||n===Nl||n===Ul||n===Fl||n===Ol||n===zl||n===kl||n===Bl||n===Hl||n===Gl||n===Vl||n===Wl)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(n===Il)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ll)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Dl)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Nl)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ul)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Fl)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ol)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===zl)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===kl)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Bl)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Hl)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Gl)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Vl)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Wl)return r===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===qr||n===Xl||n===Yl)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(n===qr)return r===de?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Xl)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Yl)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Bf||n===ql||n===$l||n===Zl)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(n===qr)return o.COMPRESSED_RED_RGTC1_EXT;if(n===ql)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===$l)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Zl)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Cs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class Bw extends Ze{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class we extends be{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Hw={type:"move"};class rc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new we,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new we,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new we,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,o=null,r=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){r=!0;for(const y of t.hand.values()){const m=e.getJointPose(y,n),p=this._getHandJoint(l,y);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,g=.005;l.inputState.pinching&&f>d+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=d-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(o=e.getPose(t.gripSpace,n),o!==null&&(c.matrix.fromArray(o.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,o.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(o.linearVelocity)):c.hasLinearVelocity=!1,o.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(o.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&o!==null&&(s=o),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Hw)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=o!==null),l!==null&&(l.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new we;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Gw=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Vw=`
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

}`;class Ww{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new qe,o=t.properties.get(s);o.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new on({vertexShader:Gw,fragmentShader:Vw,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ie(new mi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Xw extends zs{constructor(t,e){super();const n=this;let s=null,o=1,r=null,a="local-floor",c=1,l=null,h=null,u=null,f=null,d=null,g=null;const y=new Ww,m=e.getContextAttributes();let p=null,_=null;const v=[],w=[],b=new tt;let S=null;const E=new Ze;E.viewport=new fe;const T=new Ze;T.viewport=new fe;const x=[E,T],M=new Bw;let A=null,P=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let rt=v[J];return rt===void 0&&(rt=new rc,v[J]=rt),rt.getTargetRaySpace()},this.getControllerGrip=function(J){let rt=v[J];return rt===void 0&&(rt=new rc,v[J]=rt),rt.getGripSpace()},this.getHand=function(J){let rt=v[J];return rt===void 0&&(rt=new rc,v[J]=rt),rt.getHandSpace()};function C(J){const rt=w.indexOf(J.inputSource);if(rt===-1)return;const K=v[rt];K!==void 0&&(K.update(J.inputSource,J.frame,l||r),K.dispatchEvent({type:J.type,data:J.inputSource}))}function F(){s.removeEventListener("select",C),s.removeEventListener("selectstart",C),s.removeEventListener("selectend",C),s.removeEventListener("squeeze",C),s.removeEventListener("squeezestart",C),s.removeEventListener("squeezeend",C),s.removeEventListener("end",F),s.removeEventListener("inputsourceschange",N);for(let J=0;J<v.length;J++){const rt=w[J];rt!==null&&(w[J]=null,v[J].disconnect(rt))}A=null,P=null,y.reset(),t.setRenderTarget(p),d=null,f=null,u=null,s=null,_=null,Lt.stop(),n.isPresenting=!1,t.setPixelRatio(S),t.setSize(b.width,b.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){o=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){a=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",C),s.addEventListener("selectstart",C),s.addEventListener("selectend",C),s.addEventListener("squeeze",C),s.addEventListener("squeezestart",C),s.addEventListener("squeezeend",C),s.addEventListener("end",F),s.addEventListener("inputsourceschange",N),m.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(b),s.renderState.layers===void 0){const rt={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:o};d=new XRWebGLLayer(s,e,rt),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),_=new An(d.framebufferWidth,d.framebufferHeight,{format:hn,type:Tn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let rt=null,K=null,q=null;m.depth&&(q=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,rt=m.stencil?Ps:xs,K=m.stencil?Cs:Bi);const ot={colorFormat:e.RGBA8,depthFormat:q,scaleFactor:o};u=new XRWebGLBinding(s,e),f=u.createProjectionLayer(ot),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),_=new An(f.textureWidth,f.textureHeight,{format:hn,type:Tn,depthTexture:new Oh(f.textureWidth,f.textureHeight,K,void 0,void 0,void 0,void 0,void 0,void 0,rt),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,r=await s.requestReferenceSpace(a),Lt.setContext(s),Lt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function N(J){for(let rt=0;rt<J.removed.length;rt++){const K=J.removed[rt],q=w.indexOf(K);q>=0&&(w[q]=null,v[q].disconnect(K))}for(let rt=0;rt<J.added.length;rt++){const K=J.added[rt];let q=w.indexOf(K);if(q===-1){for(let pt=0;pt<v.length;pt++)if(pt>=w.length){w.push(K),q=pt;break}else if(w[pt]===null){w[pt]=K,q=pt;break}if(q===-1)break}const ot=v[q];ot&&ot.connect(K)}}const D=new R,B=new R;function H(J,rt,K){D.setFromMatrixPosition(rt.matrixWorld),B.setFromMatrixPosition(K.matrixWorld);const q=D.distanceTo(B),ot=rt.projectionMatrix.elements,pt=K.projectionMatrix.elements,wt=ot[14]/(ot[10]-1),Ft=ot[14]/(ot[10]+1),nt=(ot[9]+1)/ot[5],ht=(ot[9]-1)/ot[5],k=(ot[8]-1)/ot[0],ft=(pt[8]+1)/pt[0],st=wt*k,gt=wt*ft,yt=q/(-k+ft),Gt=yt*-k;if(rt.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Gt),J.translateZ(yt),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),ot[10]===-1)J.projectionMatrix.copy(rt.projectionMatrix),J.projectionMatrixInverse.copy(rt.projectionMatrixInverse);else{const Pt=wt+yt,z=Ft+yt,L=st-Gt,$=gt+(q-Gt),at=nt*Ft/z*Pt,dt=ht*Ft/z*Pt;J.projectionMatrix.makePerspective(L,$,at,dt,Pt,z),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function V(J,rt){rt===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(rt.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let rt=J.near,K=J.far;y.texture!==null&&(y.depthNear>0&&(rt=y.depthNear),y.depthFar>0&&(K=y.depthFar)),M.near=T.near=E.near=rt,M.far=T.far=E.far=K,(A!==M.near||P!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),A=M.near,P=M.far),E.layers.mask=J.layers.mask|2,T.layers.mask=J.layers.mask|4,M.layers.mask=E.layers.mask|T.layers.mask;const q=J.parent,ot=M.cameras;V(M,q);for(let pt=0;pt<ot.length;pt++)V(ot[pt],q);ot.length===2?H(M,E,T):M.projectionMatrix.copy(E.projectionMatrix),et(J,M,q)};function et(J,rt,K){K===null?J.matrix.copy(rt.matrixWorld):(J.matrix.copy(K.matrixWorld),J.matrix.invert(),J.matrix.multiply(rt.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(rt.projectionMatrix),J.projectionMatrixInverse.copy(rt.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Is*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(J){c=J,f!==null&&(f.fixedFoveation=J),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=J)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(M)};let lt=null;function Mt(J,rt){if(h=rt.getViewerPose(l||r),g=rt,h!==null){const K=h.views;d!==null&&(t.setRenderTargetFramebuffer(_,d.framebuffer),t.setRenderTarget(_));let q=!1;K.length!==M.cameras.length&&(M.cameras.length=0,q=!0);for(let pt=0;pt<K.length;pt++){const wt=K[pt];let Ft=null;if(d!==null)Ft=d.getViewport(wt);else{const ht=u.getViewSubImage(f,wt);Ft=ht.viewport,pt===0&&(t.setRenderTargetTextures(_,ht.colorTexture,f.ignoreDepthValues?void 0:ht.depthStencilTexture),t.setRenderTarget(_))}let nt=x[pt];nt===void 0&&(nt=new Ze,nt.layers.enable(pt),nt.viewport=new fe,x[pt]=nt),nt.matrix.fromArray(wt.transform.matrix),nt.matrix.decompose(nt.position,nt.quaternion,nt.scale),nt.projectionMatrix.fromArray(wt.projectionMatrix),nt.projectionMatrixInverse.copy(nt.projectionMatrix).invert(),nt.viewport.set(Ft.x,Ft.y,Ft.width,Ft.height),pt===0&&(M.matrix.copy(nt.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),q===!0&&M.cameras.push(nt)}const ot=s.enabledFeatures;if(ot&&ot.includes("depth-sensing")){const pt=u.getDepthInformation(K[0]);pt&&pt.isValid&&pt.texture&&y.init(t,pt,s.renderState)}}for(let K=0;K<v.length;K++){const q=w[K],ot=v[K];q!==null&&ot!==void 0&&ot.update(q,rt,l||r)}lt&&lt(J,rt),rt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:rt}),g=null}const Lt=new Jf;Lt.setAnimationLoop(Mt),this.setAnimationLoop=function(J){lt=J},this.dispose=function(){}}}const Ai=new Rn,Yw=new pe;function qw(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Zf(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,_,v,w){p.isMeshBasicMaterial||p.isMeshLambertMaterial?o(m,p):p.isMeshToonMaterial?(o(m,p),u(m,p)):p.isMeshPhongMaterial?(o(m,p),h(m,p)):p.isMeshStandardMaterial?(o(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,w)):p.isMeshMatcapMaterial?(o(m,p),g(m,p)):p.isMeshDepthMaterial?o(m,p):p.isMeshDistanceMaterial?(o(m,p),y(m,p)):p.isMeshNormalMaterial?o(m,p):p.isLineBasicMaterial?(r(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,_,v):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function o(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ye&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ye&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const _=t.get(p),v=_.envMap,w=_.envMapRotation;v&&(m.envMap.value=v,Ai.copy(w),Ai.x*=-1,Ai.y*=-1,Ai.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Ai.y*=-1,Ai.z*=-1),m.envMapRotation.value.setFromMatrix4(Yw.makeRotationFromEuler(Ai)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function r(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,_,v){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*_,m.scale.value=v*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,_){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ye&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=_.texture,m.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function y(m,p){const _=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(_.matrixWorld),m.nearDistance.value=_.shadow.camera.near,m.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function $w(i,t,e,n){let s={},o={},r=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(_,v){const w=v.program;n.uniformBlockBinding(_,w)}function l(_,v){let w=s[_.id];w===void 0&&(g(_),w=h(_),s[_.id]=w,_.addEventListener("dispose",m));const b=v.program;n.updateUBOMapping(_,b);const S=t.render.frame;o[_.id]!==S&&(f(_),o[_.id]=S)}function h(_){const v=u();_.__bindingPointIndex=v;const w=i.createBuffer(),b=_.__size,S=_.usage;return i.bindBuffer(i.UNIFORM_BUFFER,w),i.bufferData(i.UNIFORM_BUFFER,b,S),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,w),w}function u(){for(let _=0;_<a;_++)if(r.indexOf(_)===-1)return r.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(_){const v=s[_.id],w=_.uniforms,b=_.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let S=0,E=w.length;S<E;S++){const T=Array.isArray(w[S])?w[S]:[w[S]];for(let x=0,M=T.length;x<M;x++){const A=T[x];if(d(A,S,x,b)===!0){const P=A.__offset,C=Array.isArray(A.value)?A.value:[A.value];let F=0;for(let N=0;N<C.length;N++){const D=C[N],B=y(D);typeof D=="number"||typeof D=="boolean"?(A.__data[0]=D,i.bufferSubData(i.UNIFORM_BUFFER,P+F,A.__data)):D.isMatrix3?(A.__data[0]=D.elements[0],A.__data[1]=D.elements[1],A.__data[2]=D.elements[2],A.__data[3]=0,A.__data[4]=D.elements[3],A.__data[5]=D.elements[4],A.__data[6]=D.elements[5],A.__data[7]=0,A.__data[8]=D.elements[6],A.__data[9]=D.elements[7],A.__data[10]=D.elements[8],A.__data[11]=0):(D.toArray(A.__data,F),F+=B.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,P,A.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(_,v,w,b){const S=_.value,E=v+"_"+w;if(b[E]===void 0)return typeof S=="number"||typeof S=="boolean"?b[E]=S:b[E]=S.clone(),!0;{const T=b[E];if(typeof S=="number"||typeof S=="boolean"){if(T!==S)return b[E]=S,!0}else if(T.equals(S)===!1)return T.copy(S),!0}return!1}function g(_){const v=_.uniforms;let w=0;const b=16;for(let E=0,T=v.length;E<T;E++){const x=Array.isArray(v[E])?v[E]:[v[E]];for(let M=0,A=x.length;M<A;M++){const P=x[M],C=Array.isArray(P.value)?P.value:[P.value];for(let F=0,N=C.length;F<N;F++){const D=C[F],B=y(D),H=w%b,V=H%B.boundary,et=H+V;w+=V,et!==0&&b-et<B.storage&&(w+=b-et),P.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=w,w+=B.storage}}}const S=w%b;return S>0&&(w+=b-S),_.__size=w,_.__cache={},this}function y(_){const v={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(v.boundary=4,v.storage=4):_.isVector2?(v.boundary=8,v.storage=8):_.isVector3||_.isColor?(v.boundary=16,v.storage=12):_.isVector4?(v.boundary=16,v.storage=16):_.isMatrix3?(v.boundary=48,v.storage=48):_.isMatrix4?(v.boundary=64,v.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),v}function m(_){const v=_.target;v.removeEventListener("dispose",m);const w=r.indexOf(v.__bindingPointIndex);r.splice(w,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete o[v.id]}function p(){for(const _ in s)i.deleteBuffer(s[_]);r=[],s={},o={}}return{bind:c,update:l,dispose:p}}class Zw{constructor(t={}){const{canvas:e=kg(),context:n=null,depth:s=!0,stencil:o=!1,alpha:r=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=r;const g=new Uint32Array(4),y=new Int32Array(4);let m=null,p=null;const _=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=nn,this.toneMapping=di,this.toneMappingExposure=1;const w=this;let b=!1,S=0,E=0,T=null,x=-1,M=null;const A=new fe,P=new fe;let C=null;const F=new Yt(0);let N=0,D=e.width,B=e.height,H=1,V=null,et=null;const lt=new fe(0,0,D,B),Mt=new fe(0,0,D,B);let Lt=!1;const J=new Nh;let rt=!1,K=!1;const q=new pe,ot=new pe,pt=new R,wt=new fe,Ft={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let nt=!1;function ht(){return T===null?H:1}let k=n;function ft(O,X){return e.getContext(O,X)}try{const O={alpha:!0,depth:s,stencil:o,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${bh}`),e.addEventListener("webglcontextlost",ut,!1),e.addEventListener("webglcontextrestored",Ct,!1),e.addEventListener("webglcontextcreationerror",At,!1),k===null){const X="webgl2";if(k=ft(X,O),k===null)throw ft(X)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(O){throw console.error("THREE.WebGLRenderer: "+O.message),O}let st,gt,yt,Gt,Pt,z,L,$,at,dt,ct,Ut,Et,It,ne,mt,Dt,Vt,Wt,Nt,oe,jt,me,W;function Tt(){st=new e_(k),st.init(),jt=new kw(k,st),gt=new Zv(k,st,t,jt),yt=new Fw(k,st),gt.reverseDepthBuffer&&f&&yt.buffers.depth.setReversed(!0),Gt=new s_(k),Pt=new Mw,z=new zw(k,st,yt,Pt,gt,jt,Gt),L=new jv(w),$=new t_(w),at=new u1(k),me=new qv(k,at),dt=new n_(k,at,Gt,me),ct=new r_(k,dt,at,Gt),Wt=new o_(k,gt,z),mt=new Kv(Pt),Ut=new xw(w,L,$,st,gt,me,mt),Et=new qw(w,Pt),It=new Sw,ne=new Pw(st),Vt=new Yv(w,L,$,yt,ct,d,c),Dt=new Nw(w,ct,gt),W=new $w(k,Gt,gt,yt),Nt=new $v(k,st,Gt),oe=new i_(k,st,Gt),Gt.programs=Ut.programs,w.capabilities=gt,w.extensions=st,w.properties=Pt,w.renderLists=It,w.shadowMap=Dt,w.state=yt,w.info=Gt}Tt();const it=new Xw(w,k);this.xr=it,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const O=st.get("WEBGL_lose_context");O&&O.loseContext()},this.forceContextRestore=function(){const O=st.get("WEBGL_lose_context");O&&O.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(O){O!==void 0&&(H=O,this.setSize(D,B,!1))},this.getSize=function(O){return O.set(D,B)},this.setSize=function(O,X,j=!0){if(it.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}D=O,B=X,e.width=Math.floor(O*H),e.height=Math.floor(X*H),j===!0&&(e.style.width=O+"px",e.style.height=X+"px"),this.setViewport(0,0,O,X)},this.getDrawingBufferSize=function(O){return O.set(D*H,B*H).floor()},this.setDrawingBufferSize=function(O,X,j){D=O,B=X,H=j,e.width=Math.floor(O*j),e.height=Math.floor(X*j),this.setViewport(0,0,O,X)},this.getCurrentViewport=function(O){return O.copy(A)},this.getViewport=function(O){return O.copy(lt)},this.setViewport=function(O,X,j,Q){O.isVector4?lt.set(O.x,O.y,O.z,O.w):lt.set(O,X,j,Q),yt.viewport(A.copy(lt).multiplyScalar(H).round())},this.getScissor=function(O){return O.copy(Mt)},this.setScissor=function(O,X,j,Q){O.isVector4?Mt.set(O.x,O.y,O.z,O.w):Mt.set(O,X,j,Q),yt.scissor(P.copy(Mt).multiplyScalar(H).round())},this.getScissorTest=function(){return Lt},this.setScissorTest=function(O){yt.setScissorTest(Lt=O)},this.setOpaqueSort=function(O){V=O},this.setTransparentSort=function(O){et=O},this.getClearColor=function(O){return O.copy(Vt.getClearColor())},this.setClearColor=function(){Vt.setClearColor.apply(Vt,arguments)},this.getClearAlpha=function(){return Vt.getClearAlpha()},this.setClearAlpha=function(){Vt.setClearAlpha.apply(Vt,arguments)},this.clear=function(O=!0,X=!0,j=!0){let Q=0;if(O){let Y=!1;if(T!==null){const _t=T.texture.format;Y=_t===Ih||_t===Ph||_t===Ch}if(Y){const _t=T.texture.type,Rt=_t===Tn||_t===Bi||_t===So||_t===Cs||_t===Th||_t===Ah,Ot=Vt.getClearColor(),zt=Vt.getClearAlpha(),Xt=Ot.r,$t=Ot.g,kt=Ot.b;Rt?(g[0]=Xt,g[1]=$t,g[2]=kt,g[3]=zt,k.clearBufferuiv(k.COLOR,0,g)):(y[0]=Xt,y[1]=$t,y[2]=kt,y[3]=zt,k.clearBufferiv(k.COLOR,0,y))}else Q|=k.COLOR_BUFFER_BIT}X&&(Q|=k.DEPTH_BUFFER_BIT),j&&(Q|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ut,!1),e.removeEventListener("webglcontextrestored",Ct,!1),e.removeEventListener("webglcontextcreationerror",At,!1),It.dispose(),ne.dispose(),Pt.dispose(),L.dispose(),$.dispose(),ct.dispose(),me.dispose(),W.dispose(),Ut.dispose(),it.dispose(),it.removeEventListener("sessionstart",wu),it.removeEventListener("sessionend",xu),xi.stop()};function ut(O){O.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function Ct(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;const O=Gt.autoReset,X=Dt.enabled,j=Dt.autoUpdate,Q=Dt.needsUpdate,Y=Dt.type;Tt(),Gt.autoReset=O,Dt.enabled=X,Dt.autoUpdate=j,Dt.needsUpdate=Q,Dt.type=Y}function At(O){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",O.statusMessage)}function qt(O){const X=O.target;X.removeEventListener("dispose",qt),Me(X)}function Me(O){Fe(O),Pt.remove(O)}function Fe(O){const X=Pt.get(O).programs;X!==void 0&&(X.forEach(function(j){Ut.releaseProgram(j)}),O.isShaderMaterial&&Ut.releaseShaderCache(O))}this.renderBufferDirect=function(O,X,j,Q,Y,_t){X===null&&(X=Ft);const Rt=Y.isMesh&&Y.matrixWorld.determinant()<0,Ot=Hm(O,X,j,Q,Y);yt.setMaterial(Q,Rt);let zt=j.index,Xt=1;if(Q.wireframe===!0){if(zt=dt.getWireframeAttribute(j),zt===void 0)return;Xt=2}const $t=j.drawRange,kt=j.attributes.position;let ce=$t.start*Xt,ge=($t.start+$t.count)*Xt;_t!==null&&(ce=Math.max(ce,_t.start*Xt),ge=Math.min(ge,(_t.start+_t.count)*Xt)),zt!==null?(ce=Math.max(ce,0),ge=Math.min(ge,zt.count)):kt!=null&&(ce=Math.max(ce,0),ge=Math.min(ge,kt.count));const ye=ge-ce;if(ye<0||ye===1/0)return;me.setup(Y,Q,Ot,j,zt);let $e,le=Nt;if(zt!==null&&($e=at.get(zt),le=oe,le.setIndex($e)),Y.isMesh)Q.wireframe===!0?(yt.setLineWidth(Q.wireframeLinewidth*ht()),le.setMode(k.LINES)):le.setMode(k.TRIANGLES);else if(Y.isLine){let Ht=Q.linewidth;Ht===void 0&&(Ht=1),yt.setLineWidth(Ht*ht()),Y.isLineSegments?le.setMode(k.LINES):Y.isLineLoop?le.setMode(k.LINE_LOOP):le.setMode(k.LINE_STRIP)}else Y.isPoints?le.setMode(k.POINTS):Y.isSprite&&le.setMode(k.TRIANGLES);if(Y.isBatchedMesh)if(Y._multiDrawInstances!==null)le.renderMultiDrawInstances(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount,Y._multiDrawInstances);else if(st.get("WEBGL_multi_draw"))le.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{const Ht=Y._multiDrawStarts,Dn=Y._multiDrawCounts,he=Y._multiDrawCount,dn=zt?at.get(zt).bytesPerElement:1,qi=Pt.get(Q).currentProgram.getUniforms();for(let Je=0;Je<he;Je++)qi.setValue(k,"_gl_DrawID",Je),le.render(Ht[Je]/dn,Dn[Je])}else if(Y.isInstancedMesh)le.renderInstances(ce,ye,Y.count);else if(j.isInstancedBufferGeometry){const Ht=j._maxInstanceCount!==void 0?j._maxInstanceCount:1/0,Dn=Math.min(j.instanceCount,Ht);le.renderInstances(ce,ye,Dn)}else le.render(ce,ye)};function ue(O,X,j){O.transparent===!0&&O.side===gn&&O.forceSinglePass===!1?(O.side=Ye,O.needsUpdate=!0,Bo(O,X,j),O.side=fi,O.needsUpdate=!0,Bo(O,X,j),O.side=gn):Bo(O,X,j)}this.compile=function(O,X,j=null){j===null&&(j=O),p=ne.get(j),p.init(X),v.push(p),j.traverseVisible(function(Y){Y.isLight&&Y.layers.test(X.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),O!==j&&O.traverseVisible(function(Y){Y.isLight&&Y.layers.test(X.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),p.setupLights();const Q=new Set;return O.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;const _t=Y.material;if(_t)if(Array.isArray(_t))for(let Rt=0;Rt<_t.length;Rt++){const Ot=_t[Rt];ue(Ot,j,Y),Q.add(Ot)}else ue(_t,j,Y),Q.add(_t)}),v.pop(),p=null,Q},this.compileAsync=function(O,X,j=null){const Q=this.compile(O,X,j);return new Promise(Y=>{function _t(){if(Q.forEach(function(Rt){Pt.get(Rt).currentProgram.isReady()&&Q.delete(Rt)}),Q.size===0){Y(O);return}setTimeout(_t,10)}st.get("KHR_parallel_shader_compile")!==null?_t():setTimeout(_t,10)})};let un=null;function Ln(O){un&&un(O)}function wu(){xi.stop()}function xu(){xi.start()}const xi=new Jf;xi.setAnimationLoop(Ln),typeof self<"u"&&xi.setContext(self),this.setAnimationLoop=function(O){un=O,it.setAnimationLoop(O),O===null?xi.stop():xi.start()},it.addEventListener("sessionstart",wu),it.addEventListener("sessionend",xu),this.render=function(O,X){if(X!==void 0&&X.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;if(O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),X.parent===null&&X.matrixWorldAutoUpdate===!0&&X.updateMatrixWorld(),it.enabled===!0&&it.isPresenting===!0&&(it.cameraAutoUpdate===!0&&it.updateCamera(X),X=it.getCamera()),O.isScene===!0&&O.onBeforeRender(w,O,X,T),p=ne.get(O,v.length),p.init(X),v.push(p),ot.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),J.setFromProjectionMatrix(ot),K=this.localClippingEnabled,rt=mt.init(this.clippingPlanes,K),m=It.get(O,_.length),m.init(),_.push(m),it.enabled===!0&&it.isPresenting===!0){const _t=w.xr.getDepthSensingMesh();_t!==null&&Ia(_t,X,-1/0,w.sortObjects)}Ia(O,X,0,w.sortObjects),m.finish(),w.sortObjects===!0&&m.sort(V,et),nt=it.enabled===!1||it.isPresenting===!1||it.hasDepthSensing()===!1,nt&&Vt.addToRenderList(m,O),this.info.render.frame++,rt===!0&&mt.beginShadows();const j=p.state.shadowsArray;Dt.render(j,O,X),rt===!0&&mt.endShadows(),this.info.autoReset===!0&&this.info.reset();const Q=m.opaque,Y=m.transmissive;if(p.setupLights(),X.isArrayCamera){const _t=X.cameras;if(Y.length>0)for(let Rt=0,Ot=_t.length;Rt<Ot;Rt++){const zt=_t[Rt];bu(Q,Y,O,zt)}nt&&Vt.render(O);for(let Rt=0,Ot=_t.length;Rt<Ot;Rt++){const zt=_t[Rt];Mu(m,O,zt,zt.viewport)}}else Y.length>0&&bu(Q,Y,O,X),nt&&Vt.render(O),Mu(m,O,X);T!==null&&(z.updateMultisampleRenderTarget(T),z.updateRenderTargetMipmap(T)),O.isScene===!0&&O.onAfterRender(w,O,X),me.resetDefaultState(),x=-1,M=null,v.pop(),v.length>0?(p=v[v.length-1],rt===!0&&mt.setGlobalState(w.clippingPlanes,p.state.camera)):p=null,_.pop(),_.length>0?m=_[_.length-1]:m=null};function Ia(O,X,j,Q){if(O.visible===!1)return;if(O.layers.test(X.layers)){if(O.isGroup)j=O.renderOrder;else if(O.isLOD)O.autoUpdate===!0&&O.update(X);else if(O.isLight)p.pushLight(O),O.castShadow&&p.pushShadow(O);else if(O.isSprite){if(!O.frustumCulled||J.intersectsSprite(O)){Q&&wt.setFromMatrixPosition(O.matrixWorld).applyMatrix4(ot);const Rt=ct.update(O),Ot=O.material;Ot.visible&&m.push(O,Rt,Ot,j,wt.z,null)}}else if((O.isMesh||O.isLine||O.isPoints)&&(!O.frustumCulled||J.intersectsObject(O))){const Rt=ct.update(O),Ot=O.material;if(Q&&(O.boundingSphere!==void 0?(O.boundingSphere===null&&O.computeBoundingSphere(),wt.copy(O.boundingSphere.center)):(Rt.boundingSphere===null&&Rt.computeBoundingSphere(),wt.copy(Rt.boundingSphere.center)),wt.applyMatrix4(O.matrixWorld).applyMatrix4(ot)),Array.isArray(Ot)){const zt=Rt.groups;for(let Xt=0,$t=zt.length;Xt<$t;Xt++){const kt=zt[Xt],ce=Ot[kt.materialIndex];ce&&ce.visible&&m.push(O,Rt,ce,j,wt.z,kt)}}else Ot.visible&&m.push(O,Rt,Ot,j,wt.z,null)}}const _t=O.children;for(let Rt=0,Ot=_t.length;Rt<Ot;Rt++)Ia(_t[Rt],X,j,Q)}function Mu(O,X,j,Q){const Y=O.opaque,_t=O.transmissive,Rt=O.transparent;p.setupLightsView(j),rt===!0&&mt.setGlobalState(w.clippingPlanes,j),Q&&yt.viewport(A.copy(Q)),Y.length>0&&ko(Y,X,j),_t.length>0&&ko(_t,X,j),Rt.length>0&&ko(Rt,X,j),yt.buffers.depth.setTest(!0),yt.buffers.depth.setMask(!0),yt.buffers.color.setMask(!0),yt.setPolygonOffset(!1)}function bu(O,X,j,Q){if((j.isScene===!0?j.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Q.id]===void 0&&(p.state.transmissionRenderTarget[Q.id]=new An(1,1,{generateMipmaps:!0,type:st.has("EXT_color_buffer_half_float")||st.has("EXT_color_buffer_float")?pi:Tn,minFilter:ui,samples:4,stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:re.workingColorSpace}));const _t=p.state.transmissionRenderTarget[Q.id],Rt=Q.viewport||A;_t.setSize(Rt.z,Rt.w);const Ot=w.getRenderTarget();w.setRenderTarget(_t),w.getClearColor(F),N=w.getClearAlpha(),N<1&&w.setClearColor(16777215,.5),w.clear(),nt&&Vt.render(j);const zt=w.toneMapping;w.toneMapping=di;const Xt=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),p.setupLightsView(Q),rt===!0&&mt.setGlobalState(w.clippingPlanes,Q),ko(O,j,Q),z.updateMultisampleRenderTarget(_t),z.updateRenderTargetMipmap(_t),st.has("WEBGL_multisampled_render_to_texture")===!1){let $t=!1;for(let kt=0,ce=X.length;kt<ce;kt++){const ge=X[kt],ye=ge.object,$e=ge.geometry,le=ge.material,Ht=ge.group;if(le.side===gn&&ye.layers.test(Q.layers)){const Dn=le.side;le.side=Ye,le.needsUpdate=!0,Su(ye,j,Q,$e,le,Ht),le.side=Dn,le.needsUpdate=!0,$t=!0}}$t===!0&&(z.updateMultisampleRenderTarget(_t),z.updateRenderTargetMipmap(_t))}w.setRenderTarget(Ot),w.setClearColor(F,N),Xt!==void 0&&(Q.viewport=Xt),w.toneMapping=zt}function ko(O,X,j){const Q=X.isScene===!0?X.overrideMaterial:null;for(let Y=0,_t=O.length;Y<_t;Y++){const Rt=O[Y],Ot=Rt.object,zt=Rt.geometry,Xt=Q===null?Rt.material:Q,$t=Rt.group;Ot.layers.test(j.layers)&&Su(Ot,X,j,zt,Xt,$t)}}function Su(O,X,j,Q,Y,_t){O.onBeforeRender(w,X,j,Q,Y,_t),O.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,O.matrixWorld),O.normalMatrix.getNormalMatrix(O.modelViewMatrix),Y.onBeforeRender(w,X,j,Q,O,_t),Y.transparent===!0&&Y.side===gn&&Y.forceSinglePass===!1?(Y.side=Ye,Y.needsUpdate=!0,w.renderBufferDirect(j,X,Q,Y,O,_t),Y.side=fi,Y.needsUpdate=!0,w.renderBufferDirect(j,X,Q,Y,O,_t),Y.side=gn):w.renderBufferDirect(j,X,Q,Y,O,_t),O.onAfterRender(w,X,j,Q,Y,_t)}function Bo(O,X,j){X.isScene!==!0&&(X=Ft);const Q=Pt.get(O),Y=p.state.lights,_t=p.state.shadowsArray,Rt=Y.state.version,Ot=Ut.getParameters(O,Y.state,_t,X,j),zt=Ut.getProgramCacheKey(Ot);let Xt=Q.programs;Q.environment=O.isMeshStandardMaterial?X.environment:null,Q.fog=X.fog,Q.envMap=(O.isMeshStandardMaterial?$:L).get(O.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&O.envMap===null?X.environmentRotation:O.envMapRotation,Xt===void 0&&(O.addEventListener("dispose",qt),Xt=new Map,Q.programs=Xt);let $t=Xt.get(zt);if($t!==void 0){if(Q.currentProgram===$t&&Q.lightsStateVersion===Rt)return Tu(O,Ot),$t}else Ot.uniforms=Ut.getUniforms(O),O.onBeforeCompile(Ot,w),$t=Ut.acquireProgram(Ot,zt),Xt.set(zt,$t),Q.uniforms=Ot.uniforms;const kt=Q.uniforms;return(!O.isShaderMaterial&&!O.isRawShaderMaterial||O.clipping===!0)&&(kt.clippingPlanes=mt.uniform),Tu(O,Ot),Q.needsLights=Vm(O),Q.lightsStateVersion=Rt,Q.needsLights&&(kt.ambientLightColor.value=Y.state.ambient,kt.lightProbe.value=Y.state.probe,kt.directionalLights.value=Y.state.directional,kt.directionalLightShadows.value=Y.state.directionalShadow,kt.spotLights.value=Y.state.spot,kt.spotLightShadows.value=Y.state.spotShadow,kt.rectAreaLights.value=Y.state.rectArea,kt.ltc_1.value=Y.state.rectAreaLTC1,kt.ltc_2.value=Y.state.rectAreaLTC2,kt.pointLights.value=Y.state.point,kt.pointLightShadows.value=Y.state.pointShadow,kt.hemisphereLights.value=Y.state.hemi,kt.directionalShadowMap.value=Y.state.directionalShadowMap,kt.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,kt.spotShadowMap.value=Y.state.spotShadowMap,kt.spotLightMatrix.value=Y.state.spotLightMatrix,kt.spotLightMap.value=Y.state.spotLightMap,kt.pointShadowMap.value=Y.state.pointShadowMap,kt.pointShadowMatrix.value=Y.state.pointShadowMatrix),Q.currentProgram=$t,Q.uniformsList=null,$t}function Eu(O){if(O.uniformsList===null){const X=O.currentProgram.getUniforms();O.uniformsList=$r.seqWithValue(X.seq,O.uniforms)}return O.uniformsList}function Tu(O,X){const j=Pt.get(O);j.outputColorSpace=X.outputColorSpace,j.batching=X.batching,j.batchingColor=X.batchingColor,j.instancing=X.instancing,j.instancingColor=X.instancingColor,j.instancingMorph=X.instancingMorph,j.skinning=X.skinning,j.morphTargets=X.morphTargets,j.morphNormals=X.morphNormals,j.morphColors=X.morphColors,j.morphTargetsCount=X.morphTargetsCount,j.numClippingPlanes=X.numClippingPlanes,j.numIntersection=X.numClipIntersection,j.vertexAlphas=X.vertexAlphas,j.vertexTangents=X.vertexTangents,j.toneMapping=X.toneMapping}function Hm(O,X,j,Q,Y){X.isScene!==!0&&(X=Ft),z.resetTextureUnits();const _t=X.fog,Rt=Q.isMeshStandardMaterial?X.environment:null,Ot=T===null?w.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Os,zt=(Q.isMeshStandardMaterial?$:L).get(Q.envMap||Rt),Xt=Q.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,$t=!!j.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),kt=!!j.morphAttributes.position,ce=!!j.morphAttributes.normal,ge=!!j.morphAttributes.color;let ye=di;Q.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(ye=w.toneMapping);const $e=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,le=$e!==void 0?$e.length:0,Ht=Pt.get(Q),Dn=p.state.lights;if(rt===!0&&(K===!0||O!==M)){const rn=O===M&&Q.id===x;mt.setState(Q,O,rn)}let he=!1;Q.version===Ht.__version?(Ht.needsLights&&Ht.lightsStateVersion!==Dn.state.version||Ht.outputColorSpace!==Ot||Y.isBatchedMesh&&Ht.batching===!1||!Y.isBatchedMesh&&Ht.batching===!0||Y.isBatchedMesh&&Ht.batchingColor===!0&&Y.colorTexture===null||Y.isBatchedMesh&&Ht.batchingColor===!1&&Y.colorTexture!==null||Y.isInstancedMesh&&Ht.instancing===!1||!Y.isInstancedMesh&&Ht.instancing===!0||Y.isSkinnedMesh&&Ht.skinning===!1||!Y.isSkinnedMesh&&Ht.skinning===!0||Y.isInstancedMesh&&Ht.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Ht.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&Ht.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&Ht.instancingMorph===!1&&Y.morphTexture!==null||Ht.envMap!==zt||Q.fog===!0&&Ht.fog!==_t||Ht.numClippingPlanes!==void 0&&(Ht.numClippingPlanes!==mt.numPlanes||Ht.numIntersection!==mt.numIntersection)||Ht.vertexAlphas!==Xt||Ht.vertexTangents!==$t||Ht.morphTargets!==kt||Ht.morphNormals!==ce||Ht.morphColors!==ge||Ht.toneMapping!==ye||Ht.morphTargetsCount!==le)&&(he=!0):(he=!0,Ht.__version=Q.version);let dn=Ht.currentProgram;he===!0&&(dn=Bo(Q,X,Y));let qi=!1,Je=!1,Vs=!1;const ve=dn.getUniforms(),vn=Ht.uniforms;if(yt.useProgram(dn.program)&&(qi=!0,Je=!0,Vs=!0),Q.id!==x&&(x=Q.id,Je=!0),qi||M!==O){yt.buffers.depth.getReversed()?(q.copy(O.projectionMatrix),Hg(q),Gg(q),ve.setValue(k,"projectionMatrix",q)):ve.setValue(k,"projectionMatrix",O.projectionMatrix),ve.setValue(k,"viewMatrix",O.matrixWorldInverse);const ei=ve.map.cameraPosition;ei!==void 0&&ei.setValue(k,pt.setFromMatrixPosition(O.matrixWorld)),gt.logarithmicDepthBuffer&&ve.setValue(k,"logDepthBufFC",2/(Math.log(O.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&ve.setValue(k,"isOrthographic",O.isOrthographicCamera===!0),M!==O&&(M=O,Je=!0,Vs=!0)}if(Y.isSkinnedMesh){ve.setOptional(k,Y,"bindMatrix"),ve.setOptional(k,Y,"bindMatrixInverse");const rn=Y.skeleton;rn&&(rn.boneTexture===null&&rn.computeBoneTexture(),ve.setValue(k,"boneTexture",rn.boneTexture,z))}Y.isBatchedMesh&&(ve.setOptional(k,Y,"batchingTexture"),ve.setValue(k,"batchingTexture",Y._matricesTexture,z),ve.setOptional(k,Y,"batchingIdTexture"),ve.setValue(k,"batchingIdTexture",Y._indirectTexture,z),ve.setOptional(k,Y,"batchingColorTexture"),Y._colorsTexture!==null&&ve.setValue(k,"batchingColorTexture",Y._colorsTexture,z));const Ws=j.morphAttributes;if((Ws.position!==void 0||Ws.normal!==void 0||Ws.color!==void 0)&&Wt.update(Y,j,dn),(Je||Ht.receiveShadow!==Y.receiveShadow)&&(Ht.receiveShadow=Y.receiveShadow,ve.setValue(k,"receiveShadow",Y.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(vn.envMap.value=zt,vn.flipEnvMap.value=zt.isCubeTexture&&zt.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&X.environment!==null&&(vn.envMapIntensity.value=X.environmentIntensity),Je&&(ve.setValue(k,"toneMappingExposure",w.toneMappingExposure),Ht.needsLights&&Gm(vn,Vs),_t&&Q.fog===!0&&Et.refreshFogUniforms(vn,_t),Et.refreshMaterialUniforms(vn,Q,H,B,p.state.transmissionRenderTarget[O.id]),$r.upload(k,Eu(Ht),vn,z)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&($r.upload(k,Eu(Ht),vn,z),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&ve.setValue(k,"center",Y.center),ve.setValue(k,"modelViewMatrix",Y.modelViewMatrix),ve.setValue(k,"normalMatrix",Y.normalMatrix),ve.setValue(k,"modelMatrix",Y.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){const rn=Q.uniformsGroups;for(let ei=0,ni=rn.length;ei<ni;ei++){const Au=rn[ei];W.update(Au,dn),W.bind(Au,dn)}}return dn}function Gm(O,X){O.ambientLightColor.needsUpdate=X,O.lightProbe.needsUpdate=X,O.directionalLights.needsUpdate=X,O.directionalLightShadows.needsUpdate=X,O.pointLights.needsUpdate=X,O.pointLightShadows.needsUpdate=X,O.spotLights.needsUpdate=X,O.spotLightShadows.needsUpdate=X,O.rectAreaLights.needsUpdate=X,O.hemisphereLights.needsUpdate=X}function Vm(O){return O.isMeshLambertMaterial||O.isMeshToonMaterial||O.isMeshPhongMaterial||O.isMeshStandardMaterial||O.isShadowMaterial||O.isShaderMaterial&&O.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(O,X,j){Pt.get(O.texture).__webglTexture=X,Pt.get(O.depthTexture).__webglTexture=j;const Q=Pt.get(O);Q.__hasExternalTextures=!0,Q.__autoAllocateDepthBuffer=j===void 0,Q.__autoAllocateDepthBuffer||st.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Q.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(O,X){const j=Pt.get(O);j.__webglFramebuffer=X,j.__useDefaultFramebuffer=X===void 0},this.setRenderTarget=function(O,X=0,j=0){T=O,S=X,E=j;let Q=!0,Y=null,_t=!1,Rt=!1;if(O){const zt=Pt.get(O);if(zt.__useDefaultFramebuffer!==void 0)yt.bindFramebuffer(k.FRAMEBUFFER,null),Q=!1;else if(zt.__webglFramebuffer===void 0)z.setupRenderTarget(O);else if(zt.__hasExternalTextures)z.rebindTextures(O,Pt.get(O.texture).__webglTexture,Pt.get(O.depthTexture).__webglTexture);else if(O.depthBuffer){const kt=O.depthTexture;if(zt.__boundDepthTexture!==kt){if(kt!==null&&Pt.has(kt)&&(O.width!==kt.image.width||O.height!==kt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");z.setupDepthRenderbuffer(O)}}const Xt=O.texture;(Xt.isData3DTexture||Xt.isDataArrayTexture||Xt.isCompressedArrayTexture)&&(Rt=!0);const $t=Pt.get(O).__webglFramebuffer;O.isWebGLCubeRenderTarget?(Array.isArray($t[X])?Y=$t[X][j]:Y=$t[X],_t=!0):O.samples>0&&z.useMultisampledRTT(O)===!1?Y=Pt.get(O).__webglMultisampledFramebuffer:Array.isArray($t)?Y=$t[j]:Y=$t,A.copy(O.viewport),P.copy(O.scissor),C=O.scissorTest}else A.copy(lt).multiplyScalar(H).floor(),P.copy(Mt).multiplyScalar(H).floor(),C=Lt;if(yt.bindFramebuffer(k.FRAMEBUFFER,Y)&&Q&&yt.drawBuffers(O,Y),yt.viewport(A),yt.scissor(P),yt.setScissorTest(C),_t){const zt=Pt.get(O.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+X,zt.__webglTexture,j)}else if(Rt){const zt=Pt.get(O.texture),Xt=X||0;k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,zt.__webglTexture,j||0,Xt)}x=-1},this.readRenderTargetPixels=function(O,X,j,Q,Y,_t,Rt){if(!(O&&O.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ot=Pt.get(O).__webglFramebuffer;if(O.isWebGLCubeRenderTarget&&Rt!==void 0&&(Ot=Ot[Rt]),Ot){yt.bindFramebuffer(k.FRAMEBUFFER,Ot);try{const zt=O.texture,Xt=zt.format,$t=zt.type;if(!gt.textureFormatReadable(Xt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!gt.textureTypeReadable($t)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}X>=0&&X<=O.width-Q&&j>=0&&j<=O.height-Y&&k.readPixels(X,j,Q,Y,jt.convert(Xt),jt.convert($t),_t)}finally{const zt=T!==null?Pt.get(T).__webglFramebuffer:null;yt.bindFramebuffer(k.FRAMEBUFFER,zt)}}},this.readRenderTargetPixelsAsync=async function(O,X,j,Q,Y,_t,Rt){if(!(O&&O.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ot=Pt.get(O).__webglFramebuffer;if(O.isWebGLCubeRenderTarget&&Rt!==void 0&&(Ot=Ot[Rt]),Ot){const zt=O.texture,Xt=zt.format,$t=zt.type;if(!gt.textureFormatReadable(Xt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!gt.textureTypeReadable($t))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(X>=0&&X<=O.width-Q&&j>=0&&j<=O.height-Y){yt.bindFramebuffer(k.FRAMEBUFFER,Ot);const kt=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,kt),k.bufferData(k.PIXEL_PACK_BUFFER,_t.byteLength,k.STREAM_READ),k.readPixels(X,j,Q,Y,jt.convert(Xt),jt.convert($t),0);const ce=T!==null?Pt.get(T).__webglFramebuffer:null;yt.bindFramebuffer(k.FRAMEBUFFER,ce);const ge=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await Bg(k,ge,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,kt),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,_t),k.deleteBuffer(kt),k.deleteSync(ge),_t}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(O,X=null,j=0){O.isTexture!==!0&&(po("WebGLRenderer: copyFramebufferToTexture function signature has changed."),X=arguments[0]||null,O=arguments[1]);const Q=Math.pow(2,-j),Y=Math.floor(O.image.width*Q),_t=Math.floor(O.image.height*Q),Rt=X!==null?X.x:0,Ot=X!==null?X.y:0;z.setTexture2D(O,0),k.copyTexSubImage2D(k.TEXTURE_2D,j,0,0,Rt,Ot,Y,_t),yt.unbindTexture()},this.copyTextureToTexture=function(O,X,j=null,Q=null,Y=0){O.isTexture!==!0&&(po("WebGLRenderer: copyTextureToTexture function signature has changed."),Q=arguments[0]||null,O=arguments[1],X=arguments[2],Y=arguments[3]||0,j=null);let _t,Rt,Ot,zt,Xt,$t,kt,ce,ge;const ye=O.isCompressedTexture?O.mipmaps[Y]:O.image;j!==null?(_t=j.max.x-j.min.x,Rt=j.max.y-j.min.y,Ot=j.isBox3?j.max.z-j.min.z:1,zt=j.min.x,Xt=j.min.y,$t=j.isBox3?j.min.z:0):(_t=ye.width,Rt=ye.height,Ot=ye.depth||1,zt=0,Xt=0,$t=0),Q!==null?(kt=Q.x,ce=Q.y,ge=Q.z):(kt=0,ce=0,ge=0);const $e=jt.convert(X.format),le=jt.convert(X.type);let Ht;X.isData3DTexture?(z.setTexture3D(X,0),Ht=k.TEXTURE_3D):X.isDataArrayTexture||X.isCompressedArrayTexture?(z.setTexture2DArray(X,0),Ht=k.TEXTURE_2D_ARRAY):(z.setTexture2D(X,0),Ht=k.TEXTURE_2D),k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,X.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,X.unpackAlignment);const Dn=k.getParameter(k.UNPACK_ROW_LENGTH),he=k.getParameter(k.UNPACK_IMAGE_HEIGHT),dn=k.getParameter(k.UNPACK_SKIP_PIXELS),qi=k.getParameter(k.UNPACK_SKIP_ROWS),Je=k.getParameter(k.UNPACK_SKIP_IMAGES);k.pixelStorei(k.UNPACK_ROW_LENGTH,ye.width),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,ye.height),k.pixelStorei(k.UNPACK_SKIP_PIXELS,zt),k.pixelStorei(k.UNPACK_SKIP_ROWS,Xt),k.pixelStorei(k.UNPACK_SKIP_IMAGES,$t);const Vs=O.isDataArrayTexture||O.isData3DTexture,ve=X.isDataArrayTexture||X.isData3DTexture;if(O.isRenderTargetTexture||O.isDepthTexture){const vn=Pt.get(O),Ws=Pt.get(X),rn=Pt.get(vn.__renderTarget),ei=Pt.get(Ws.__renderTarget);yt.bindFramebuffer(k.READ_FRAMEBUFFER,rn.__webglFramebuffer),yt.bindFramebuffer(k.DRAW_FRAMEBUFFER,ei.__webglFramebuffer);for(let ni=0;ni<Ot;ni++)Vs&&k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Pt.get(O).__webglTexture,Y,$t+ni),O.isDepthTexture?(ve&&k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Pt.get(X).__webglTexture,Y,ge+ni),k.blitFramebuffer(zt,Xt,_t,Rt,kt,ce,_t,Rt,k.DEPTH_BUFFER_BIT,k.NEAREST)):ve?k.copyTexSubImage3D(Ht,Y,kt,ce,ge+ni,zt,Xt,_t,Rt):k.copyTexSubImage2D(Ht,Y,kt,ce,ge+ni,zt,Xt,_t,Rt);yt.bindFramebuffer(k.READ_FRAMEBUFFER,null),yt.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else ve?O.isDataTexture||O.isData3DTexture?k.texSubImage3D(Ht,Y,kt,ce,ge,_t,Rt,Ot,$e,le,ye.data):X.isCompressedArrayTexture?k.compressedTexSubImage3D(Ht,Y,kt,ce,ge,_t,Rt,Ot,$e,ye.data):k.texSubImage3D(Ht,Y,kt,ce,ge,_t,Rt,Ot,$e,le,ye):O.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,Y,kt,ce,_t,Rt,$e,le,ye.data):O.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,Y,kt,ce,ye.width,ye.height,$e,ye.data):k.texSubImage2D(k.TEXTURE_2D,Y,kt,ce,_t,Rt,$e,le,ye);k.pixelStorei(k.UNPACK_ROW_LENGTH,Dn),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,he),k.pixelStorei(k.UNPACK_SKIP_PIXELS,dn),k.pixelStorei(k.UNPACK_SKIP_ROWS,qi),k.pixelStorei(k.UNPACK_SKIP_IMAGES,Je),Y===0&&X.generateMipmaps&&k.generateMipmap(Ht),yt.unbindTexture()},this.copyTextureToTexture3D=function(O,X,j=null,Q=null,Y=0){return O.isTexture!==!0&&(po("WebGLRenderer: copyTextureToTexture3D function signature has changed."),j=arguments[0]||null,Q=arguments[1]||null,O=arguments[2],X=arguments[3],Y=arguments[4]||0),po('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(O,X,j,Q,Y)},this.initRenderTarget=function(O){Pt.get(O).__webglFramebuffer===void 0&&z.setupRenderTarget(O)},this.initTexture=function(O){O.isCubeTexture?z.setTextureCube(O,0):O.isData3DTexture?z.setTexture3D(O,0):O.isDataArrayTexture||O.isCompressedArrayTexture?z.setTexture2DArray(O,0):z.setTexture2D(O,0),yt.unbindTexture()},this.resetState=function(){S=0,E=0,T=null,yt.reset(),me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Yn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=re._getDrawingBufferColorSpace(t),e.unpackColorSpace=re._getUnpackColorSpace()}}class Ma{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Yt(t),this.near=e,this.far=n}clone(){return new Ma(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Kw extends be{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Rn,this.environmentIntensity=1,this.environmentRotation=new Rn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class sp extends qe{constructor(t=null,e=1,n=1,s,o,r,a,c,l=Ue,h=Ue,u,f){super(null,r,a,c,l,h,s,o,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class op extends _i{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Yt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Qr=new R,ta=new R,Td=new pe,Zs=new Lo,cr=new ks,ac=new R,Ad=new R;class jw extends be{constructor(t=new Ie,e=new op){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,o=e.count;s<o;s++)Qr.fromBufferAttribute(e,s-1),ta.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Qr.distanceTo(ta);t.setAttribute("lineDistance",new ae(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,o=t.params.Line.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),cr.copy(n.boundingSphere),cr.applyMatrix4(s),cr.radius+=o,t.ray.intersectsSphere(cr)===!1)return;Td.copy(s).invert(),Zs.copy(t.ray).applyMatrix4(Td);const a=o/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){const d=Math.max(0,r.start),g=Math.min(h.count,r.start+r.count);for(let y=d,m=g-1;y<m;y+=l){const p=h.getX(y),_=h.getX(y+1),v=lr(this,t,Zs,c,p,_);v&&e.push(v)}if(this.isLineLoop){const y=h.getX(g-1),m=h.getX(d),p=lr(this,t,Zs,c,y,m);p&&e.push(p)}}else{const d=Math.max(0,r.start),g=Math.min(f.count,r.start+r.count);for(let y=d,m=g-1;y<m;y+=l){const p=lr(this,t,Zs,c,y,y+1);p&&e.push(p)}if(this.isLineLoop){const y=lr(this,t,Zs,c,g-1,d);y&&e.push(y)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=s.length;o<r;o++){const a=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}}function lr(i,t,e,n,s,o){const r=i.geometry.attributes.position;if(Qr.fromBufferAttribute(r,s),ta.fromBufferAttribute(r,o),e.distanceSqToSegment(Qr,ta,ac,Ad)>n)return;ac.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(ac);if(!(c<t.near||c>t.far))return{distance:c,point:Ad.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const Rd=new R,Cd=new R;class zh extends jw{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,o=e.count;s<o;s+=2)Rd.fromBufferAttribute(e,s),Cd.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Rd.distanceTo(Cd);t.setAttribute("lineDistance",new ae(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Jw extends _i{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new Yt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Pd=new pe,jl=new Lo,hr=new ks,ur=new R;class rp extends be{constructor(t=new Ie,e=new Jw){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,o=t.params.Points.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),hr.copy(n.boundingSphere),hr.applyMatrix4(s),hr.radius+=o,t.ray.intersectsSphere(hr)===!1)return;Pd.copy(s).invert(),jl.copy(t.ray).applyMatrix4(Pd);const a=o/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,u=n.attributes.position;if(l!==null){const f=Math.max(0,r.start),d=Math.min(l.count,r.start+r.count);for(let g=f,y=d;g<y;g++){const m=l.getX(g);ur.fromBufferAttribute(u,m),Id(ur,m,c,s,t,e,this)}}else{const f=Math.max(0,r.start),d=Math.min(u.count,r.start+r.count);for(let g=f,y=d;g<y;g++)ur.fromBufferAttribute(u,g),Id(ur,g,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=s.length;o<r;o++){const a=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}}function Id(i,t,e,n,s,o,r){const a=jl.distanceSqToPoint(i);if(a<e){const c=new R;jl.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;o.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:r})}}class In{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),o=0;e.push(0);for(let r=1;r<=t;r++)n=this.getPoint(r/t),o+=n.distanceTo(s),e.push(o),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const o=n.length;let r;e?r=e:r=t*n[o-1];let a=0,c=o-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-r,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===r)return s/(o-1);const h=n[s],f=n[s+1]-h,d=(r-h)/f;return(s+d)/(o-1)}getTangent(t,e){let s=t-1e-4,o=t+1e-4;s<0&&(s=0),o>1&&(o=1);const r=this.getPoint(s),a=this.getPoint(o),c=e||(r.isVector2?new tt:new R);return c.copy(a).sub(r).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new R,s=[],o=[],r=[],a=new R,c=new pe;for(let d=0;d<=t;d++){const g=d/t;s[d]=this.getTangentAt(g,new R)}o[0]=new R,r[0]=new R;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),f<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),o[0].crossVectors(s[0],a),r[0].crossVectors(s[0],o[0]);for(let d=1;d<=t;d++){if(o[d]=o[d-1].clone(),r[d]=r[d-1].clone(),a.crossVectors(s[d-1],s[d]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Ae(s[d-1].dot(s[d]),-1,1));o[d].applyMatrix4(c.makeRotationAxis(a,g))}r[d].crossVectors(s[d],o[d])}if(e===!0){let d=Math.acos(Ae(o[0].dot(o[t]),-1,1));d/=t,s[0].dot(a.crossVectors(o[0],o[t]))>0&&(d=-d);for(let g=1;g<=t;g++)o[g].applyMatrix4(c.makeRotationAxis(s[g],d*g)),r[g].crossVectors(s[g],o[g])}return{tangents:s,normals:o,binormals:r}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class kh extends In{constructor(t=0,e=0,n=1,s=1,o=0,r=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=o,this.aEndAngle=r,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new tt){const n=e,s=Math.PI*2;let o=this.aEndAngle-this.aStartAngle;const r=Math.abs(o)<Number.EPSILON;for(;o<0;)o+=s;for(;o>s;)o-=s;o<Number.EPSILON&&(r?o=0:o=s),this.aClockwise===!0&&!r&&(o===s?o=-s:o=o-s);const a=this.aStartAngle+t*o;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,d=l-this.aY;c=f*h-d*u+this.aX,l=f*u+d*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Qw extends kh{constructor(t,e,n,s,o,r){super(t,e,n,n,s,o,r),this.isArcCurve=!0,this.type="ArcCurve"}}function Bh(){let i=0,t=0,e=0,n=0;function s(o,r,a,c){i=o,t=a,e=-3*o+3*r-2*a-c,n=2*o-2*r+a+c}return{initCatmullRom:function(o,r,a,c,l){s(r,a,l*(a-o),l*(c-r))},initNonuniformCatmullRom:function(o,r,a,c,l,h,u){let f=(r-o)/l-(a-o)/(l+h)+(a-r)/h,d=(a-r)/h-(c-r)/(h+u)+(c-a)/u;f*=h,d*=h,s(r,a,f,d)},calc:function(o){const r=o*o,a=r*o;return i+t*o+e*r+n*a}}}const dr=new R,cc=new Bh,lc=new Bh,hc=new Bh;class tx extends In{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new R){const n=e,s=this.points,o=s.length,r=(o-(this.closed?0:1))*t;let a=Math.floor(r),c=r-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/o)+1)*o:c===0&&a===o-1&&(a=o-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%o]:(dr.subVectors(s[0],s[1]).add(s[0]),l=dr);const u=s[a%o],f=s[(a+1)%o];if(this.closed||a+2<o?h=s[(a+2)%o]:(dr.subVectors(s[o-1],s[o-2]).add(s[o-1]),h=dr),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),d),y=Math.pow(u.distanceToSquared(f),d),m=Math.pow(f.distanceToSquared(h),d);y<1e-4&&(y=1),g<1e-4&&(g=y),m<1e-4&&(m=y),cc.initNonuniformCatmullRom(l.x,u.x,f.x,h.x,g,y,m),lc.initNonuniformCatmullRom(l.y,u.y,f.y,h.y,g,y,m),hc.initNonuniformCatmullRom(l.z,u.z,f.z,h.z,g,y,m)}else this.curveType==="catmullrom"&&(cc.initCatmullRom(l.x,u.x,f.x,h.x,this.tension),lc.initCatmullRom(l.y,u.y,f.y,h.y,this.tension),hc.initCatmullRom(l.z,u.z,f.z,h.z,this.tension));return n.set(cc.calc(c),lc.calc(c),hc.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new R().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Ld(i,t,e,n,s){const o=(n-t)*.5,r=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+o+r)*c+(-3*e+3*n-2*o-r)*a+o*i+e}function ex(i,t){const e=1-i;return e*e*t}function nx(i,t){return 2*(1-i)*i*t}function ix(i,t){return i*i*t}function _o(i,t,e,n){return ex(i,t)+nx(i,e)+ix(i,n)}function sx(i,t){const e=1-i;return e*e*e*t}function ox(i,t){const e=1-i;return 3*e*e*i*t}function rx(i,t){return 3*(1-i)*i*i*t}function ax(i,t){return i*i*i*t}function wo(i,t,e,n,s){return sx(i,t)+ox(i,e)+rx(i,n)+ax(i,s)}class ap extends In{constructor(t=new tt,e=new tt,n=new tt,s=new tt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new tt){const n=e,s=this.v0,o=this.v1,r=this.v2,a=this.v3;return n.set(wo(t,s.x,o.x,r.x,a.x),wo(t,s.y,o.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class cx extends In{constructor(t=new R,e=new R,n=new R,s=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new R){const n=e,s=this.v0,o=this.v1,r=this.v2,a=this.v3;return n.set(wo(t,s.x,o.x,r.x,a.x),wo(t,s.y,o.y,r.y,a.y),wo(t,s.z,o.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class cp extends In{constructor(t=new tt,e=new tt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new tt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new tt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class lx extends In{constructor(t=new R,e=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new R){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new R){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class lp extends In{constructor(t=new tt,e=new tt,n=new tt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new tt){const n=e,s=this.v0,o=this.v1,r=this.v2;return n.set(_o(t,s.x,o.x,r.x),_o(t,s.y,o.y,r.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class hx extends In{constructor(t=new R,e=new R,n=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new R){const n=e,s=this.v0,o=this.v1,r=this.v2;return n.set(_o(t,s.x,o.x,r.x),_o(t,s.y,o.y,r.y),_o(t,s.z,o.z,r.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class hp extends In{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new tt){const n=e,s=this.points,o=(s.length-1)*t,r=Math.floor(o),a=o-r,c=s[r===0?r:r-1],l=s[r],h=s[r>s.length-2?s.length-1:r+1],u=s[r>s.length-3?s.length-1:r+2];return n.set(Ld(a,c.x,l.x,h.x,u.x),Ld(a,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new tt().fromArray(s))}return this}}var Jl=Object.freeze({__proto__:null,ArcCurve:Qw,CatmullRomCurve3:tx,CubicBezierCurve:ap,CubicBezierCurve3:cx,EllipseCurve:kh,LineCurve:cp,LineCurve3:lx,QuadraticBezierCurve:lp,QuadraticBezierCurve3:hx,SplineCurve:hp});class ux extends In{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Jl[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let o=0;for(;o<s.length;){if(s[o]>=n){const r=s[o]-n,a=this.curves[o],c=a.getLength(),l=c===0?0:1-r/c;return a.getPointAt(l,e)}o++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,o=this.curves;s<o.length;s++){const r=o[s],a=r.isEllipseCurve?t*2:r.isLineCurve||r.isLineCurve3?1:r.isSplineCurve?t*r.points.length:t,c=r.getPoints(a);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Jl[s.type]().fromJSON(s))}return this}}class Dd extends ux{constructor(t){super(),this.type="Path",this.currentPoint=new tt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new cp(this.currentPoint.clone(),new tt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const o=new lp(this.currentPoint.clone(),new tt(t,e),new tt(n,s));return this.curves.push(o),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,o,r){const a=new ap(this.currentPoint.clone(),new tt(t,e),new tt(n,s),new tt(o,r));return this.curves.push(a),this.currentPoint.set(o,r),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new hp(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,o,r){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,s,o,r),this}absarc(t,e,n,s,o,r){return this.absellipse(t,e,n,n,s,o,r),this}ellipse(t,e,n,s,o,r,a,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,s,o,r,a,c),this}absellipse(t,e,n,s,o,r,a,c){const l=new kh(t,e,n,s,o,r,a,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Jn extends Ie{constructor(t=[new tt(0,-.5),new tt(.5,0),new tt(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Ae(s,0,Math.PI*2);const o=[],r=[],a=[],c=[],l=[],h=1/e,u=new R,f=new tt,d=new R,g=new R,y=new R;let m=0,p=0;for(let _=0;_<=t.length-1;_++)switch(_){case 0:m=t[_+1].x-t[_].x,p=t[_+1].y-t[_].y,d.x=p*1,d.y=-m,d.z=p*0,y.copy(d),d.normalize(),c.push(d.x,d.y,d.z);break;case t.length-1:c.push(y.x,y.y,y.z);break;default:m=t[_+1].x-t[_].x,p=t[_+1].y-t[_].y,d.x=p*1,d.y=-m,d.z=p*0,g.copy(d),d.x+=y.x,d.y+=y.y,d.z+=y.z,d.normalize(),c.push(d.x,d.y,d.z),y.copy(g)}for(let _=0;_<=e;_++){const v=n+_*h*s,w=Math.sin(v),b=Math.cos(v);for(let S=0;S<=t.length-1;S++){u.x=t[S].x*w,u.y=t[S].y,u.z=t[S].x*b,r.push(u.x,u.y,u.z),f.x=_/e,f.y=S/(t.length-1),a.push(f.x,f.y);const E=c[3*S+0]*w,T=c[3*S+1],x=c[3*S+0]*b;l.push(E,T,x)}}for(let _=0;_<e;_++)for(let v=0;v<t.length-1;v++){const w=v+_*t.length,b=w,S=w+t.length,E=w+t.length+1,T=w+1;o.push(b,S,T),o.push(E,T,S)}this.setIndex(o),this.setAttribute("position",new ae(r,3)),this.setAttribute("uv",new ae(a,2)),this.setAttribute("normal",new ae(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Jn(t.points,t.segments,t.phiStart,t.phiLength)}}class Z extends Ie{constructor(t=1,e=1,n=1,s=32,o=1,r=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:o,openEnded:r,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),o=Math.floor(o);const h=[],u=[],f=[],d=[];let g=0;const y=[],m=n/2;let p=0;_(),r===!1&&(t>0&&v(!0),e>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new ae(u,3)),this.setAttribute("normal",new ae(f,3)),this.setAttribute("uv",new ae(d,2));function _(){const w=new R,b=new R;let S=0;const E=(e-t)/n;for(let T=0;T<=o;T++){const x=[],M=T/o,A=M*(e-t)+t;for(let P=0;P<=s;P++){const C=P/s,F=C*c+a,N=Math.sin(F),D=Math.cos(F);b.x=A*N,b.y=-M*n+m,b.z=A*D,u.push(b.x,b.y,b.z),w.set(N,E,D).normalize(),f.push(w.x,w.y,w.z),d.push(C,1-M),x.push(g++)}y.push(x)}for(let T=0;T<s;T++)for(let x=0;x<o;x++){const M=y[x][T],A=y[x+1][T],P=y[x+1][T+1],C=y[x][T+1];(t>0||x!==0)&&(h.push(M,A,C),S+=3),(e>0||x!==o-1)&&(h.push(A,P,C),S+=3)}l.addGroup(p,S,0),p+=S}function v(w){const b=g,S=new tt,E=new R;let T=0;const x=w===!0?t:e,M=w===!0?1:-1;for(let P=1;P<=s;P++)u.push(0,m*M,0),f.push(0,M,0),d.push(.5,.5),g++;const A=g;for(let P=0;P<=s;P++){const F=P/s*c+a,N=Math.cos(F),D=Math.sin(F);E.x=x*D,E.y=m*M,E.z=x*N,u.push(E.x,E.y,E.z),f.push(0,M,0),S.x=N*.5+.5,S.y=D*.5*M+.5,d.push(S.x,S.y),g++}for(let P=0;P<s;P++){const C=b+P,F=A+P;w===!0?h.push(F,F+1,C):h.push(F+1,F,C),T+=3}l.addGroup(p,T,w===!0?1:2),p+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Z(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class te extends Z{constructor(t=1,e=1,n=32,s=1,o=!1,r=0,a=Math.PI*2){super(0,t,e,n,s,o,r,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:a}}static fromJSON(t){return new te(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ba extends Ie{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const o=[],r=[];a(s),l(n),h(),this.setAttribute("position",new ae(o,3)),this.setAttribute("normal",new ae(o.slice(),3)),this.setAttribute("uv",new ae(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(_){const v=new R,w=new R,b=new R;for(let S=0;S<e.length;S+=3)d(e[S+0],v),d(e[S+1],w),d(e[S+2],b),c(v,w,b,_)}function c(_,v,w,b){const S=b+1,E=[];for(let T=0;T<=S;T++){E[T]=[];const x=_.clone().lerp(w,T/S),M=v.clone().lerp(w,T/S),A=S-T;for(let P=0;P<=A;P++)P===0&&T===S?E[T][P]=x:E[T][P]=x.clone().lerp(M,P/A)}for(let T=0;T<S;T++)for(let x=0;x<2*(S-T)-1;x++){const M=Math.floor(x/2);x%2===0?(f(E[T][M+1]),f(E[T+1][M]),f(E[T][M])):(f(E[T][M+1]),f(E[T+1][M+1]),f(E[T+1][M]))}}function l(_){const v=new R;for(let w=0;w<o.length;w+=3)v.x=o[w+0],v.y=o[w+1],v.z=o[w+2],v.normalize().multiplyScalar(_),o[w+0]=v.x,o[w+1]=v.y,o[w+2]=v.z}function h(){const _=new R;for(let v=0;v<o.length;v+=3){_.x=o[v+0],_.y=o[v+1],_.z=o[v+2];const w=m(_)/2/Math.PI+.5,b=p(_)/Math.PI+.5;r.push(w,1-b)}g(),u()}function u(){for(let _=0;_<r.length;_+=6){const v=r[_+0],w=r[_+2],b=r[_+4],S=Math.max(v,w,b),E=Math.min(v,w,b);S>.9&&E<.1&&(v<.2&&(r[_+0]+=1),w<.2&&(r[_+2]+=1),b<.2&&(r[_+4]+=1))}}function f(_){o.push(_.x,_.y,_.z)}function d(_,v){const w=_*3;v.x=t[w+0],v.y=t[w+1],v.z=t[w+2]}function g(){const _=new R,v=new R,w=new R,b=new R,S=new tt,E=new tt,T=new tt;for(let x=0,M=0;x<o.length;x+=9,M+=6){_.set(o[x+0],o[x+1],o[x+2]),v.set(o[x+3],o[x+4],o[x+5]),w.set(o[x+6],o[x+7],o[x+8]),S.set(r[M+0],r[M+1]),E.set(r[M+2],r[M+3]),T.set(r[M+4],r[M+5]),b.copy(_).add(v).add(w).divideScalar(3);const A=m(b);y(S,M+0,_,A),y(E,M+2,v,A),y(T,M+4,w,A)}}function y(_,v,w,b){b<0&&_.x===1&&(r[v]=_.x-1),w.x===0&&w.z===0&&(r[v]=b/2/Math.PI+.5)}function m(_){return Math.atan2(_.z,-_.x)}function p(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ba(t.vertices,t.indices,t.radius,t.details)}}class up extends Dd{constructor(t){super(t),this.uuid=Wi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new Dd().fromJSON(s))}return this}}const dx={triangulate:function(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let o=dp(i,0,s,e,!0);const r=[];if(!o||o.next===o.prev)return r;let a,c,l,h,u,f,d;if(n&&(o=yx(i,t,o,e)),i.length>80*e){a=l=i[0],c=h=i[1];for(let g=e;g<s;g+=e)u=i[g],f=i[g+1],u<a&&(a=u),f<c&&(c=f),u>l&&(l=u),f>h&&(h=f);d=Math.max(l-a,h-c),d=d!==0?32767/d:0}return Eo(o,r,e,a,c,d,0),r}};function dp(i,t,e,n,s){let o,r;if(s===Rx(i,t,e,n)>0)for(o=t;o<e;o+=n)r=Nd(o,i[o],i[o+1],r);else for(o=e-n;o>=t;o-=n)r=Nd(o,i[o],i[o+1],r);return r&&Sa(r,r.next)&&(Ao(r),r=r.next),r}function Gi(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Sa(e,e.next)||xe(e.prev,e,e.next)===0)){if(Ao(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Eo(i,t,e,n,s,o,r){if(!i)return;!r&&o&&Mx(i,n,s,o);let a=i,c,l;for(;i.prev!==i.next;){if(c=i.prev,l=i.next,o?px(i,n,s,o):fx(i)){t.push(c.i/e|0),t.push(i.i/e|0),t.push(l.i/e|0),Ao(i),i=l.next,a=l.next;continue}if(i=l,i===a){r?r===1?(i=mx(Gi(i),t,e),Eo(i,t,e,n,s,o,2)):r===2&&gx(i,t,e,n,s,o):Eo(Gi(i),t,e,n,s,o,1);break}}}function fx(i){const t=i.prev,e=i,n=i.next;if(xe(t,e,n)>=0)return!1;const s=t.x,o=e.x,r=n.x,a=t.y,c=e.y,l=n.y,h=s<o?s<r?s:r:o<r?o:r,u=a<c?a<l?a:l:c<l?c:l,f=s>o?s>r?s:r:o>r?o:r,d=a>c?a>l?a:l:c>l?c:l;let g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=f&&g.y>=u&&g.y<=d&&vs(s,a,o,c,r,l,g.x,g.y)&&xe(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function px(i,t,e,n){const s=i.prev,o=i,r=i.next;if(xe(s,o,r)>=0)return!1;const a=s.x,c=o.x,l=r.x,h=s.y,u=o.y,f=r.y,d=a<c?a<l?a:l:c<l?c:l,g=h<u?h<f?h:f:u<f?u:f,y=a>c?a>l?a:l:c>l?c:l,m=h>u?h>f?h:f:u>f?u:f,p=Ql(d,g,t,e,n),_=Ql(y,m,t,e,n);let v=i.prevZ,w=i.nextZ;for(;v&&v.z>=p&&w&&w.z<=_;){if(v.x>=d&&v.x<=y&&v.y>=g&&v.y<=m&&v!==s&&v!==r&&vs(a,h,c,u,l,f,v.x,v.y)&&xe(v.prev,v,v.next)>=0||(v=v.prevZ,w.x>=d&&w.x<=y&&w.y>=g&&w.y<=m&&w!==s&&w!==r&&vs(a,h,c,u,l,f,w.x,w.y)&&xe(w.prev,w,w.next)>=0))return!1;w=w.nextZ}for(;v&&v.z>=p;){if(v.x>=d&&v.x<=y&&v.y>=g&&v.y<=m&&v!==s&&v!==r&&vs(a,h,c,u,l,f,v.x,v.y)&&xe(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;w&&w.z<=_;){if(w.x>=d&&w.x<=y&&w.y>=g&&w.y<=m&&w!==s&&w!==r&&vs(a,h,c,u,l,f,w.x,w.y)&&xe(w.prev,w,w.next)>=0)return!1;w=w.nextZ}return!0}function mx(i,t,e){let n=i;do{const s=n.prev,o=n.next.next;!Sa(s,o)&&fp(s,n,n.next,o)&&To(s,o)&&To(o,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(o.i/e|0),Ao(n),Ao(n.next),n=i=o),n=n.next}while(n!==i);return Gi(n)}function gx(i,t,e,n,s,o){let r=i;do{let a=r.next.next;for(;a!==r.prev;){if(r.i!==a.i&&Ex(r,a)){let c=pp(r,a);r=Gi(r,r.next),c=Gi(c,c.next),Eo(r,t,e,n,s,o,0),Eo(c,t,e,n,s,o,0);return}a=a.next}r=r.next}while(r!==i)}function yx(i,t,e,n){const s=[];let o,r,a,c,l;for(o=0,r=t.length;o<r;o++)a=t[o]*n,c=o<r-1?t[o+1]*n:i.length,l=dp(i,a,c,n,!1),l===l.next&&(l.steiner=!0),s.push(Sx(l));for(s.sort(vx),o=0;o<s.length;o++)e=_x(s[o],e);return e}function vx(i,t){return i.x-t.x}function _x(i,t){const e=wx(i,t);if(!e)return t;const n=pp(e,i);return Gi(n,n.next),Gi(e,e.next)}function wx(i,t){let e=t,n=-1/0,s;const o=i.x,r=i.y;do{if(r<=e.y&&r>=e.next.y&&e.next.y!==e.y){const f=e.x+(r-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=o&&f>n&&(n=f,s=e.x<e.next.x?e:e.next,f===o))return s}e=e.next}while(e!==t);if(!s)return null;const a=s,c=s.x,l=s.y;let h=1/0,u;e=s;do o>=e.x&&e.x>=c&&o!==e.x&&vs(r<l?o:n,r,c,l,r<l?n:o,r,e.x,e.y)&&(u=Math.abs(r-e.y)/(o-e.x),To(e,i)&&(u<h||u===h&&(e.x>s.x||e.x===s.x&&xx(s,e)))&&(s=e,h=u)),e=e.next;while(e!==a);return s}function xx(i,t){return xe(i.prev,i,t.prev)<0&&xe(t.next,i,i.next)<0}function Mx(i,t,e,n){let s=i;do s.z===0&&(s.z=Ql(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,bx(s)}function bx(i){let t,e,n,s,o,r,a,c,l=1;do{for(e=i,i=null,o=null,r=0;e;){for(r++,n=e,a=0,t=0;t<l&&(a++,n=n.nextZ,!!n);t++);for(c=l;a>0||c>0&&n;)a!==0&&(c===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,a--):(s=n,n=n.nextZ,c--),o?o.nextZ=s:i=s,s.prevZ=o,o=s;e=n}o.nextZ=null,l*=2}while(r>1);return i}function Ql(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Sx(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function vs(i,t,e,n,s,o,r,a){return(s-r)*(t-a)>=(i-r)*(o-a)&&(i-r)*(n-a)>=(e-r)*(t-a)&&(e-r)*(o-a)>=(s-r)*(n-a)}function Ex(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Tx(i,t)&&(To(i,t)&&To(t,i)&&Ax(i,t)&&(xe(i.prev,i,t.prev)||xe(i,t.prev,t))||Sa(i,t)&&xe(i.prev,i,i.next)>0&&xe(t.prev,t,t.next)>0)}function xe(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Sa(i,t){return i.x===t.x&&i.y===t.y}function fp(i,t,e,n){const s=pr(xe(i,t,e)),o=pr(xe(i,t,n)),r=pr(xe(e,n,i)),a=pr(xe(e,n,t));return!!(s!==o&&r!==a||s===0&&fr(i,e,t)||o===0&&fr(i,n,t)||r===0&&fr(e,i,n)||a===0&&fr(e,t,n))}function fr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function pr(i){return i>0?1:i<0?-1:0}function Tx(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&fp(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function To(i,t){return xe(i.prev,i,i.next)<0?xe(i,t,i.next)>=0&&xe(i,i.prev,t)>=0:xe(i,t,i.prev)<0||xe(i,i.next,t)<0}function Ax(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,o=(i.y+t.y)/2;do e.y>o!=e.next.y>o&&e.next.y!==e.y&&s<(e.next.x-e.x)*(o-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function pp(i,t){const e=new th(i.i,i.x,i.y),n=new th(t.i,t.x,t.y),s=i.next,o=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,o.next=n,n.prev=o,n}function Nd(i,t,e,n){const s=new th(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Ao(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function th(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function Rx(i,t,e,n){let s=0;for(let o=t,r=e-n;o<e;o+=n)s+=(i[r]-i[o])*(i[o+1]+i[r+1]),r=o;return s}class xo{static area(t){const e=t.length;let n=0;for(let s=e-1,o=0;o<e;s=o++)n+=t[s].x*t[o].y-t[o].x*t[s].y;return n*.5}static isClockWise(t){return xo.area(t)<0}static triangulateShape(t,e){const n=[],s=[],o=[];Ud(t),Fd(n,t);let r=t.length;e.forEach(Ud);for(let c=0;c<e.length;c++)s.push(r),r+=e[c].length,Fd(n,e[c]);const a=dx.triangulate(n,s);for(let c=0;c<a.length;c+=3)o.push(a.slice(c,c+3));return o}}function Ud(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Fd(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class Hh extends Ie{constructor(t=new up([new tt(.5,.5),new tt(-.5,.5),new tt(-.5,-.5),new tt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],o=[];for(let a=0,c=t.length;a<c;a++){const l=t[a];r(l)}this.setAttribute("position",new ae(s,3)),this.setAttribute("uv",new ae(o,2)),this.computeVertexNormals();function r(a){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:d-.1,y=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,_=e.UVGenerator!==void 0?e.UVGenerator:Cx;let v,w=!1,b,S,E,T;p&&(v=p.getSpacedPoints(h),w=!0,f=!1,b=p.computeFrenetFrames(h,!1),S=new R,E=new R,T=new R),f||(m=0,d=0,g=0,y=0);const x=a.extractPoints(l);let M=x.shape;const A=x.holes;if(!xo.isClockWise(M)){M=M.reverse();for(let nt=0,ht=A.length;nt<ht;nt++){const k=A[nt];xo.isClockWise(k)&&(A[nt]=k.reverse())}}const C=xo.triangulateShape(M,A),F=M;for(let nt=0,ht=A.length;nt<ht;nt++){const k=A[nt];M=M.concat(k)}function N(nt,ht,k){return ht||console.error("THREE.ExtrudeGeometry: vec does not exist"),nt.clone().addScaledVector(ht,k)}const D=M.length,B=C.length;function H(nt,ht,k){let ft,st,gt;const yt=nt.x-ht.x,Gt=nt.y-ht.y,Pt=k.x-nt.x,z=k.y-nt.y,L=yt*yt+Gt*Gt,$=yt*z-Gt*Pt;if(Math.abs($)>Number.EPSILON){const at=Math.sqrt(L),dt=Math.sqrt(Pt*Pt+z*z),ct=ht.x-Gt/at,Ut=ht.y+yt/at,Et=k.x-z/dt,It=k.y+Pt/dt,ne=((Et-ct)*z-(It-Ut)*Pt)/(yt*z-Gt*Pt);ft=ct+yt*ne-nt.x,st=Ut+Gt*ne-nt.y;const mt=ft*ft+st*st;if(mt<=2)return new tt(ft,st);gt=Math.sqrt(mt/2)}else{let at=!1;yt>Number.EPSILON?Pt>Number.EPSILON&&(at=!0):yt<-Number.EPSILON?Pt<-Number.EPSILON&&(at=!0):Math.sign(Gt)===Math.sign(z)&&(at=!0),at?(ft=-Gt,st=yt,gt=Math.sqrt(L)):(ft=yt,st=Gt,gt=Math.sqrt(L/2))}return new tt(ft/gt,st/gt)}const V=[];for(let nt=0,ht=F.length,k=ht-1,ft=nt+1;nt<ht;nt++,k++,ft++)k===ht&&(k=0),ft===ht&&(ft=0),V[nt]=H(F[nt],F[k],F[ft]);const et=[];let lt,Mt=V.concat();for(let nt=0,ht=A.length;nt<ht;nt++){const k=A[nt];lt=[];for(let ft=0,st=k.length,gt=st-1,yt=ft+1;ft<st;ft++,gt++,yt++)gt===st&&(gt=0),yt===st&&(yt=0),lt[ft]=H(k[ft],k[gt],k[yt]);et.push(lt),Mt=Mt.concat(lt)}for(let nt=0;nt<m;nt++){const ht=nt/m,k=d*Math.cos(ht*Math.PI/2),ft=g*Math.sin(ht*Math.PI/2)+y;for(let st=0,gt=F.length;st<gt;st++){const yt=N(F[st],V[st],ft);q(yt.x,yt.y,-k)}for(let st=0,gt=A.length;st<gt;st++){const yt=A[st];lt=et[st];for(let Gt=0,Pt=yt.length;Gt<Pt;Gt++){const z=N(yt[Gt],lt[Gt],ft);q(z.x,z.y,-k)}}}const Lt=g+y;for(let nt=0;nt<D;nt++){const ht=f?N(M[nt],Mt[nt],Lt):M[nt];w?(E.copy(b.normals[0]).multiplyScalar(ht.x),S.copy(b.binormals[0]).multiplyScalar(ht.y),T.copy(v[0]).add(E).add(S),q(T.x,T.y,T.z)):q(ht.x,ht.y,0)}for(let nt=1;nt<=h;nt++)for(let ht=0;ht<D;ht++){const k=f?N(M[ht],Mt[ht],Lt):M[ht];w?(E.copy(b.normals[nt]).multiplyScalar(k.x),S.copy(b.binormals[nt]).multiplyScalar(k.y),T.copy(v[nt]).add(E).add(S),q(T.x,T.y,T.z)):q(k.x,k.y,u/h*nt)}for(let nt=m-1;nt>=0;nt--){const ht=nt/m,k=d*Math.cos(ht*Math.PI/2),ft=g*Math.sin(ht*Math.PI/2)+y;for(let st=0,gt=F.length;st<gt;st++){const yt=N(F[st],V[st],ft);q(yt.x,yt.y,u+k)}for(let st=0,gt=A.length;st<gt;st++){const yt=A[st];lt=et[st];for(let Gt=0,Pt=yt.length;Gt<Pt;Gt++){const z=N(yt[Gt],lt[Gt],ft);w?q(z.x,z.y+v[h-1].y,v[h-1].x+k):q(z.x,z.y,u+k)}}}J(),rt();function J(){const nt=s.length/3;if(f){let ht=0,k=D*ht;for(let ft=0;ft<B;ft++){const st=C[ft];ot(st[2]+k,st[1]+k,st[0]+k)}ht=h+m*2,k=D*ht;for(let ft=0;ft<B;ft++){const st=C[ft];ot(st[0]+k,st[1]+k,st[2]+k)}}else{for(let ht=0;ht<B;ht++){const k=C[ht];ot(k[2],k[1],k[0])}for(let ht=0;ht<B;ht++){const k=C[ht];ot(k[0]+D*h,k[1]+D*h,k[2]+D*h)}}n.addGroup(nt,s.length/3-nt,0)}function rt(){const nt=s.length/3;let ht=0;K(F,ht),ht+=F.length;for(let k=0,ft=A.length;k<ft;k++){const st=A[k];K(st,ht),ht+=st.length}n.addGroup(nt,s.length/3-nt,1)}function K(nt,ht){let k=nt.length;for(;--k>=0;){const ft=k;let st=k-1;st<0&&(st=nt.length-1);for(let gt=0,yt=h+m*2;gt<yt;gt++){const Gt=D*gt,Pt=D*(gt+1),z=ht+ft+Gt,L=ht+st+Gt,$=ht+st+Pt,at=ht+ft+Pt;pt(z,L,$,at)}}}function q(nt,ht,k){c.push(nt),c.push(ht),c.push(k)}function ot(nt,ht,k){wt(nt),wt(ht),wt(k);const ft=s.length/3,st=_.generateTopUV(n,s,ft-3,ft-2,ft-1);Ft(st[0]),Ft(st[1]),Ft(st[2])}function pt(nt,ht,k,ft){wt(nt),wt(ht),wt(ft),wt(ht),wt(k),wt(ft);const st=s.length/3,gt=_.generateSideWallUV(n,s,st-6,st-3,st-2,st-1);Ft(gt[0]),Ft(gt[1]),Ft(gt[3]),Ft(gt[1]),Ft(gt[2]),Ft(gt[3])}function wt(nt){s.push(c[nt*3+0]),s.push(c[nt*3+1]),s.push(c[nt*3+2])}function Ft(nt){o.push(nt.x),o.push(nt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Px(e,n,t)}static fromJSON(t,e){const n=[];for(let o=0,r=t.shapes.length;o<r;o++){const a=e[t.shapes[o]];n.push(a)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Jl[s.type]().fromJSON(s)),new Hh(n,t.options)}}const Cx={generateTopUV:function(i,t,e,n,s){const o=t[e*3],r=t[e*3+1],a=t[n*3],c=t[n*3+1],l=t[s*3],h=t[s*3+1];return[new tt(o,r),new tt(a,c),new tt(l,h)]},generateSideWallUV:function(i,t,e,n,s,o){const r=t[e*3],a=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],u=t[n*3+2],f=t[s*3],d=t[s*3+1],g=t[s*3+2],y=t[o*3],m=t[o*3+1],p=t[o*3+2];return Math.abs(a-h)<Math.abs(r-l)?[new tt(r,1-c),new tt(l,1-u),new tt(f,1-g),new tt(y,1-p)]:[new tt(a,1-c),new tt(h,1-u),new tt(d,1-g),new tt(m,1-p)]}};function Px(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const o=i[n];e.shapes.push(o.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class ee extends ba{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],o=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,o,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ee(t.radius,t.detail)}}class ke extends ba{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ke(t.radius,t.detail)}}class No extends Ie{constructor(t=1,e=32,n=16,s=0,o=Math.PI*2,r=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:o,thetaStart:r,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(r+a,Math.PI);let l=0;const h=[],u=new R,f=new R,d=[],g=[],y=[],m=[];for(let p=0;p<=n;p++){const _=[],v=p/n;let w=0;p===0&&r===0?w=.5/e:p===n&&c===Math.PI&&(w=-.5/e);for(let b=0;b<=e;b++){const S=b/e;u.x=-t*Math.cos(s+S*o)*Math.sin(r+v*a),u.y=t*Math.cos(r+v*a),u.z=t*Math.sin(s+S*o)*Math.sin(r+v*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),y.push(f.x,f.y,f.z),m.push(S+w,1-v),_.push(l++)}h.push(_)}for(let p=0;p<n;p++)for(let _=0;_<e;_++){const v=h[p][_+1],w=h[p][_],b=h[p+1][_],S=h[p+1][_+1];(p!==0||r>0)&&d.push(v,w,S),(p!==n-1||c<Math.PI)&&d.push(w,b,S)}this.setIndex(d),this.setAttribute("position",new ae(g,3)),this.setAttribute("normal",new ae(y,3)),this.setAttribute("uv",new ae(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new No(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Xi extends Ie{constructor(t=1,e=.4,n=12,s=48,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:o},n=Math.floor(n),s=Math.floor(s);const r=[],a=[],c=[],l=[],h=new R,u=new R,f=new R;for(let d=0;d<=n;d++)for(let g=0;g<=s;g++){const y=g/s*o,m=d/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(y),u.y=(t+e*Math.cos(m))*Math.sin(y),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(y),h.y=t*Math.sin(y),f.subVectors(u,h).normalize(),c.push(f.x,f.y,f.z),l.push(g/s),l.push(d/n)}for(let d=1;d<=n;d++)for(let g=1;g<=s;g++){const y=(s+1)*d+g-1,m=(s+1)*(d-1)+g-1,p=(s+1)*(d-1)+g,_=(s+1)*d+g;r.push(y,m,_),r.push(m,p,_)}this.setIndex(r),this.setAttribute("position",new ae(a,3)),this.setAttribute("normal",new ae(c,3)),this.setAttribute("uv",new ae(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xi(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Ix extends on{static get type(){return"RawShaderMaterial"}constructor(t){super(t),this.isRawShaderMaterial=!0}}class Lx extends _i{static get type(){return"MeshNormalMaterial"}constructor(t){super(),this.isMeshNormalMaterial=!0,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Lh,this.normalScale=new tt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}}class Ke extends _i{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Yt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Lh,this.normalScale=new tt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Rn,this.combine=Sh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Ea extends be{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Yt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Dx extends Ea{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Yt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const uc=new pe,Od=new R,zd=new R;class Gh{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new tt(512,512),this.map=null,this.mapPass=null,this.matrix=new pe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Nh,this._frameExtents=new tt(1,1),this._viewportCount=1,this._viewports=[new fe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Od.setFromMatrixPosition(t.matrixWorld),e.position.copy(Od),zd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(zd),e.updateMatrixWorld(),uc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(uc),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(uc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Nx extends Gh{constructor(){super(new Ze(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){const e=this.camera,n=Is*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height,o=t.distance||e.far;(n!==e.fov||s!==e.aspect||o!==e.far)&&(e.fov=n,e.aspect=s,e.far=o,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class Ux extends Ea{constructor(t,e,n=0,s=Math.PI/3,o=0,r=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.target=new be,this.distance=n,this.angle=s,this.penumbra=o,this.decay=r,this.map=null,this.shadow=new Nx}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const kd=new pe,Ks=new R,dc=new R;class Fx extends Gh{constructor(){super(new Ze(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new tt(4,2),this._viewportCount=6,this._viewports=[new fe(2,1,1,1),new fe(0,1,1,1),new fe(3,1,1,1),new fe(1,1,1,1),new fe(3,0,1,1),new fe(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,o=t.distance||n.far;o!==n.far&&(n.far=o,n.updateProjectionMatrix()),Ks.setFromMatrixPosition(t.matrixWorld),n.position.copy(Ks),dc.copy(n.position),dc.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(dc),n.updateMatrixWorld(),s.makeTranslation(-Ks.x,-Ks.y,-Ks.z),kd.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(kd)}}class Yi extends Ea{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Fx}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class Ox extends Gh{constructor(){super(new Uh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Bd extends Ea{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.target=new be,this.shadow=new Ox}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class zx{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Hd(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=Hd();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Hd(){return performance.now()}const Gd=new pe;class kx{constructor(t,e,n=0,s=1/0){this.ray=new Lo(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new _a,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Gd.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Gd),this}intersectObject(t,e=!0,n=[]){return eh(t,this,n,e),n.sort(Vd),n}intersectObjects(t,e=!0,n=[]){for(let s=0,o=t.length;s<o;s++)eh(t[s],this,n,e);return n.sort(Vd),n}}function Vd(i,t){return i.distance-t.distance}function eh(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const o=i.children;for(let r=0,a=o.length;r<a;r++)eh(o[r],t,e,!0)}}const Wd=new R,mr=new R;class Vh{constructor(t=new R,e=new R){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){Wd.subVectors(t,this.start),mr.subVectors(this.end,this.start);const n=mr.dot(mr);let o=mr.dot(Wd)/n;return e&&(o=Ae(o,0,1)),o}closestPointToPoint(t,e,n){const s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}class Bx extends zh{constructor(t=1){const e=[0,0,0,t,0,0,0,0,0,0,t,0,0,0,0,0,0,t],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new Ie;s.setAttribute("position",new ae(e,3)),s.setAttribute("color",new ae(n,3));const o=new op({vertexColors:!0,toneMapped:!1});super(s,o),this.type="AxesHelper"}setColors(t,e,n){const s=new Yt,o=this.geometry.attributes.color.array;return s.set(t),s.toArray(o,0),s.toArray(o,3),s.set(e),s.toArray(o,6),s.toArray(o,9),s.set(n),s.toArray(o,12),s.toArray(o,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:bh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=bh);class Hx{renderer;scene;camera;onResize=null;canvas;handleResize=()=>this.resize();constructor(t){this.canvas=t,this.renderer=new Zw({canvas:t,antialias:!1,powerPreference:"high-performance",stencil:!1}),this.renderer.setClearColor(657935,1),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Sf,this.renderer.shadowMap.autoUpdate=!1,this.renderer.info.autoReset=!1,this.scene=new Kw,this.camera=new Ze(70,1,.1,500),this.resize(),window.addEventListener("resize",this.handleResize),window.addEventListener("orientationchange",this.handleResize)}resize(){const t=this.canvas.clientWidth||window.innerWidth,e=this.canvas.clientHeight||window.innerHeight;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(t,e,!1),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.onResize?.()}render(){this.renderer.info.reset(),this.renderer.shadowMap.needsUpdate=!0,this.renderer.render(this.scene,this.camera)}dispose(){window.removeEventListener("resize",this.handleResize),window.removeEventListener("orientationchange",this.handleResize),this.renderer.dispose()}}const Gx=1;class Vx{subscribers=new Set;handle=0;last=0;elapsed=0;running=!1;minInterval=0;add(t){return this.subscribers.add(t),()=>this.subscribers.delete(t)}setFpsCap(t){this.minInterval=t&&t>0?1e3/t:0}start(){if(this.running)return;this.running=!0,this.last=performance.now();const t=e=>{if(this.handle=requestAnimationFrame(t),this.minInterval>0&&e-this.last<this.minInterval-Gx)return;const n=Math.min((e-this.last)/1e3,.1);this.last=e,this.elapsed+=n;for(const s of this.subscribers)s(n,this.elapsed)};this.handle=requestAnimationFrame(t)}stop(){this.running&&(cancelAnimationFrame(this.handle),this.running=!1)}}const Wx={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Uo{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Xx=new Uh(-1,1,1,-1,0,1);class Yx extends Ie{constructor(){super(),this.setAttribute("position",new ae([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ae([0,2,0,0,2,0],2))}}const qx=new Yx;class Wh{constructor(t){this._mesh=new ie(qx,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,Xx)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class mp extends Uo{constructor(t,e){super(),this.textureID=e!==void 0?e:"tDiffuse",t instanceof on?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=wa.clone(t.uniforms),this.material=new on({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new Wh(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class Xd extends Uo{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const s=t.getContext(),o=t.state;o.buffers.color.setMask(!1),o.buffers.depth.setMask(!1),o.buffers.color.setLocked(!0),o.buffers.depth.setLocked(!0);let r,a;this.inverse?(r=0,a=1):(r=1,a=0),o.buffers.stencil.setTest(!0),o.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),o.buffers.stencil.setFunc(s.ALWAYS,r,4294967295),o.buffers.stencil.setClear(a),o.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),o.buffers.color.setLocked(!1),o.buffers.depth.setLocked(!1),o.buffers.color.setMask(!0),o.buffers.depth.setMask(!0),o.buffers.stencil.setLocked(!1),o.buffers.stencil.setFunc(s.EQUAL,1,4294967295),o.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),o.buffers.stencil.setLocked(!0)}}class $x extends Uo{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class Zx{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new tt);this._width=n.width,this._height=n.height,e=new An(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:pi}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new mp(Wx),this.copyPass.material.blending=$n,this.clock=new zx}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let s=0,o=this.passes.length;s<o;s++){const r=this.passes[s];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),r.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),r.needsSwap){if(n){const a=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),c.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Xd!==void 0&&(r instanceof Xd?n=!0:r instanceof $x&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new tt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let o=0;o<this.passes.length;o++)this.passes[o].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Kx extends Uo{constructor(t,e,n,s={}){super(),this.pixelSize=t,this.resolution=new tt,this.renderResolution=new tt,this.pixelatedMaterial=this.createPixelatedMaterial(),this.normalMaterial=new Lx,this.fsQuad=new Wh(this.pixelatedMaterial),this.scene=e,this.camera=n,this.normalEdgeStrength=s.normalEdgeStrength||.3,this.depthEdgeStrength=s.depthEdgeStrength||.4,this.beautyRenderTarget=new An,this.beautyRenderTarget.texture.minFilter=Ue,this.beautyRenderTarget.texture.magFilter=Ue,this.beautyRenderTarget.texture.type=pi,this.beautyRenderTarget.depthTexture=new Oh,this.normalRenderTarget=new An,this.normalRenderTarget.texture.minFilter=Ue,this.normalRenderTarget.texture.magFilter=Ue,this.normalRenderTarget.texture.type=pi}dispose(){this.beautyRenderTarget.dispose(),this.normalRenderTarget.dispose(),this.pixelatedMaterial.dispose(),this.normalMaterial.dispose(),this.fsQuad.dispose()}setSize(t,e){this.resolution.set(t,e),this.renderResolution.set(t/this.pixelSize|0,e/this.pixelSize|0);const{x:n,y:s}=this.renderResolution;this.beautyRenderTarget.setSize(n,s),this.normalRenderTarget.setSize(n,s),this.fsQuad.material.uniforms.resolution.value.set(n,s,1/n,1/s)}setPixelSize(t){this.pixelSize=t,this.setSize(this.resolution.x,this.resolution.y)}render(t,e){const n=this.fsQuad.material.uniforms;n.normalEdgeStrength.value=this.normalEdgeStrength,n.depthEdgeStrength.value=this.depthEdgeStrength,t.setRenderTarget(this.beautyRenderTarget),t.render(this.scene,this.camera);const s=this.scene.overrideMaterial;t.setRenderTarget(this.normalRenderTarget),this.scene.overrideMaterial=this.normalMaterial,t.render(this.scene,this.camera),this.scene.overrideMaterial=s,n.tDiffuse.value=this.beautyRenderTarget.texture,n.tDepth.value=this.beautyRenderTarget.depthTexture,n.tNormal.value=this.normalRenderTarget.texture,this.renderToScreen?t.setRenderTarget(null):(t.setRenderTarget(e),this.clear&&t.clear()),this.fsQuad.render(t)}createPixelatedMaterial(){return new on({uniforms:{tDiffuse:{value:null},tDepth:{value:null},tNormal:{value:null},resolution:{value:new fe(this.renderResolution.x,this.renderResolution.y,1/this.renderResolution.x,1/this.renderResolution.y)},normalEdgeStrength:{value:0},depthEdgeStrength:{value:0}},vertexShader:`
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
			`})}}const jx={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class Jx extends Uo{constructor(){super();const t=jx;this.uniforms=wa.clone(t.uniforms),this.material=new Ix({name:t.name,uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.fsQuad=new Wh(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},re.getTransfer(this._outputColorSpace)===de&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Ef?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Tf?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Af?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Rf?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Cf?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Pf&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}function Qx(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),o={},r={},a=i[0].morphTargetsRelative,c=new Ie;let l=0;for(let h=0;h<i.length;++h){const u=i[h];let f=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in u.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;o[d]===void 0&&(o[d]=[]),o[d].push(u.attributes[d]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in u.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.morphAttributes[d])}if(t){let d;if(e)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,d,h),l+=d}}if(e){let h=0;const u=[];for(let f=0;f<i.length;++f){const d=i[f].index;for(let g=0;g<d.count;++g)u.push(d.getX(g)+h);h+=i[f].attributes.position.count}c.setIndex(u)}for(const h in o){const u=Yd(o[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in r){const u=r[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let f=0;f<u;++f){const d=[];for(let y=0;y<r[h].length;++y)d.push(r[h][y][f]);const g=Yd(d);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function Yd(i){let t,e,n,s=-1,o=0;for(let l=0;l<i.length;++l){const h=i[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;o+=h.count*e}const r=new t(o),a=new je(r,e,n);let c=0;for(let l=0;l<i.length;++l){const h=i[l];if(h.isInterleavedBufferAttribute){const u=c/e;for(let f=0,d=h.count;f<d;f++)for(let g=0;g<e;g++){const y=h.getComponent(f,g);a.setComponent(f+u,g,y)}}else r.set(h.array,c);c+=h.count*e}return s!==void 0&&(a.gpuType=s),a}function Xh(i,t=1e-4){t=Math.max(t,Number.EPSILON);const e={},n=i.getIndex(),s=i.getAttribute("position"),o=n?n.count:s.count;let r=0;const a=Object.keys(i.attributes),c={},l={},h=[],u=["getX","getY","getZ","getW"],f=["setX","setY","setZ","setW"];for(let _=0,v=a.length;_<v;_++){const w=a[_],b=i.attributes[w];c[w]=new b.constructor(new b.array.constructor(b.count*b.itemSize),b.itemSize,b.normalized);const S=i.morphAttributes[w];S&&(l[w]||(l[w]=[]),S.forEach((E,T)=>{const x=new E.array.constructor(E.count*E.itemSize);l[w][T]=new E.constructor(x,E.itemSize,E.normalized)}))}const d=t*.5,g=Math.log10(1/t),y=Math.pow(10,g),m=d*y;for(let _=0;_<o;_++){const v=n?n.getX(_):_;let w="";for(let b=0,S=a.length;b<S;b++){const E=a[b],T=i.getAttribute(E),x=T.itemSize;for(let M=0;M<x;M++)w+=`${~~(T[u[M]](v)*y+m)},`}if(w in e)h.push(e[w]);else{for(let b=0,S=a.length;b<S;b++){const E=a[b],T=i.getAttribute(E),x=i.morphAttributes[E],M=T.itemSize,A=c[E],P=l[E];for(let C=0;C<M;C++){const F=u[C],N=f[C];if(A[N](r,T[F](v)),x)for(let D=0,B=x.length;D<B;D++)P[D][N](r,x[D][F](v))}}e[w]=r,h.push(r),r++}}const p=i.clone();for(const _ in i.attributes){const v=c[_];if(p.setAttribute(_,new v.constructor(v.array.slice(0,r*v.itemSize),v.itemSize,v.normalized)),_ in l)for(let w=0;w<l[_].length;w++){const b=l[_][w];p.morphAttributes[_][w]=new b.constructor(b.array.slice(0,r*b.itemSize),b.itemSize,b.normalized)}}return p.setIndex(h),p}const t2=new Set(["small-grass-clump","large-grass-clump","daisy","bluebell","poppy","lavender","wildflower","thistle"]),e2={reeds:1,"small-grass-clump":.95,"large-grass-clump":.9,cowparsley:.85,wildflower:.8,poppy:.8,bluebell:.8,daisy:.75,lavender:.7,foxglove:.5,fern:.6,nettle:.6,"small-tree":.6,tree:.55,bush:.5,elder:.65,hazel:.6,gorse:.25,"small-birch":.8,birch:.75,"small-oak":.5,oak:.35,"small-rowan":.7,rowan:.6,"small-spruce":.4,spruce:.3,bramble:.4,thistle:.35,sunflower:.2},Ds="sway",gp=new Ke({vertexColors:!0,flatShading:!0});function vt(i){const t=i.map(n=>{const s=n.geometry,o=s.index===null?s:s.toNonIndexed();o!==s&&s.dispose(),o.deleteAttribute("uv");const r=o.getAttribute("position"),a=r.count,c=new Float32Array(a*3),l=new Yt;if(typeof n.color=="function")for(let u=0;u<a;u+=3){const f=(r.getX(u)+r.getX(u+1)+r.getX(u+2))/3,d=(r.getY(u)+r.getY(u+1)+r.getY(u+2))/3,g=(r.getZ(u)+r.getZ(u+1)+r.getZ(u+2))/3;l.set(n.color(f,d,g)),l.toArray(c,u*3),l.toArray(c,(u+1)*3),l.toArray(c,(u+2)*3)}else{l.set(n.color);for(let u=0;u<a;u++)l.toArray(c,u*3)}o.setAttribute("color",new je(c,3));const h=new Float32Array(a);if(typeof n.sway=="function")for(let u=0;u<a;u++)h[u]=nh(n.sway(r.getX(u),r.getY(u),r.getZ(u)));else n.sway&&h.fill(nh(n.sway));return o.setAttribute(Ds,new je(h,1)),o.getAttribute("normal")||o.computeVertexNormals(),o}),e=Qx(t,!1);for(const n of t)n.dispose();if(!e)throw new Error("assemble: geometries did not share an attribute set");return e}function bt(i,t,e){const n=e2[t]??0,s=i.getAttribute(Ds);if(s&&n!==1){const r=s.array;for(let a=0;a<r.length;a++)r[a]*=n;s.needsUpdate=!0}const o=new ie(i,gp);return o.name=t,o.userData.swayPhase=e,t2.has(t)&&(o.userData.clutter=!0),o.customDepthMaterial=yp,o}function Re(i,t,e=1.6){return(n,s)=>{const o=nh((s-i)/Math.max(t-i,1e-6));return(o*o*(3-2*o))**e}}function nh(i){return i>0?i<1?i:1:0}const ea=256,n2=140,i2=.16,s2=.05,wi=new sp(new Uint8Array(ea),ea,1,Rh,Tn);wi.minFilter=sn;wi.magFilter=sn;wi.wrapS=Wn;wi.wrapT=Wn;wi.needsUpdate=!0;const zi={gustField:{value:wi},windDir:{value:new tt(1,0)},windLagScale:{value:0},windHalfSpan:{value:1},swayTime:{value:0},swayAmount:{value:1}},yp=new ip({depthPacking:Hf});let qd=!1;function o2(){if(qd)return;qd=!0,ih=t=>{Object.assign(t.uniforms,zi),t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
        attribute float ${Ds};
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
          float weight = ${Ds} * swayAmount;
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
            transformed += windObj * (push * lean * ${i2.toFixed(3)})
                         + crossObj * (push * flutter * ${s2.toFixed(3)});
          }
        }
        `)},sh(gp),sh(yp)}let ih=null;function sh(i){ih&&(i.onBeforeCompile=ih,i.defaultAttributeValues={...i.defaultAttributeValues,[Ds]:[0]},i.customProgramCacheKey=()=>"sway",i.needsUpdate=!0)}const r2=wi.image.data;function a2(i,t){const{windDirection:e,frontSpeed:n,gustRate:s}=i.settings;zi.windDir.value.set(Math.cos(e),Math.sin(e));const o=s/Math.max(n,.5),r=n2*o;zi.windLagScale.value=o,zi.windHalfSpan.value=r,zi.swayTime.value=t;const a=i.phase;for(let c=0;c<ea;c++){const l=c/(ea-1),h=a+(l-.5)*2*r;r2[c]=Math.round(i.fieldAt(h)*255)}wi.needsUpdate=!0}const c2={off:0,protanopia:1,deuteranopia:2,tritanopia:3},l2={name:"RetroShader",uniforms:{tDiffuse:{value:null},uPixelSize:{value:1},uDitherScale:{value:1.65},uPeriod:{value:3},uQuantize:{value:1},uLevels:{value:16},uVignette:{value:.35},uVignetteRadius:{value:.55},uVignetteSoftness:{value:.6},uColorblind:{value:0},uColorblindStrength:{value:1}},vertexShader:`
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
  `},h2=400,fc={uniforms:{uHorizon:{value:new Yt},uZenith:{value:new Yt},uGround:{value:new Yt},uCurve:{value:1},uCloudColor:{value:new Yt},uCloudCover:{value:.5},uCloudSoftness:{value:.2},uCloudScale:{value:1.2},uCloudOpacity:{value:1},uCloudDrift:{value:.01},uTime:{value:0},uSunDirection:{value:new R(0,1,0)},uSunColor:{value:new Yt},uSunSize:{value:.9993},uSunGlow:{value:260},uSunIntensity:{value:1}},vertexShader:`
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
  `},vp={horizon:"#bcd4e6",zenith:"#3f7fbf",ground:"#5d6469",curve:.35,cloudColor:"#f2f5f8",cloudCover:.5,cloudSoftness:.22,cloudScale:1.1,cloudOpacity:.95,cloudDrift:.012,sun:!0,sunColor:"#fff6e0",sunSize:1.1,sunGlow:240};class u2{mesh;material;constructor(){this.material=new on({name:"Sky",uniforms:wa.clone(fc.uniforms),vertexShader:fc.vertexShader,fragmentShader:fc.fragmentShader,side:Ye,depthWrite:!1,depthTest:!1,fog:!1}),this.mesh=new ie(new No(h2,32,16),this.material),this.mesh.name="Sky",this.mesh.renderOrder=-1,this.mesh.frustumCulled=!1}apply(t){const e=this.material.uniforms;e.uHorizon.value.set(t.horizon),e.uZenith.value.set(t.zenith),e.uGround.value.set(t.ground),e.uCloudColor.value.set(t.cloudColor),e.uCurve.value=t.curve,e.uCloudCover.value=t.cloudCover,e.uCloudSoftness.value=t.cloudSoftness,e.uCloudScale.value=t.cloudScale,e.uCloudOpacity.value=t.cloudOpacity,e.uCloudDrift.value=t.cloudDrift,e.uSunColor.value.set(t.sunColor),e.uSunIntensity.value=t.sun?1:0,e.uSunSize.value=Math.cos(t.sunSize*Math.PI/180),e.uSunGlow.value=t.sunGlow}aimAt(t){this.material.uniforms.uSunDirection.value.copy(t).normalize()}follow(t,e){this.mesh.position.setFromMatrixPosition(t.matrixWorld),this.material.uniforms.uTime.value=e}dispose(){this.mesh.geometry.dispose(),this.material.dispose()}}const Yh="hswow.preset.";function _p(i){try{const t=window.localStorage.getItem(Yh+i);if(t===null)return null;const e=JSON.parse(t);return typeof e!="object"||e===null?null:e}catch{return null}}function wp(i,t){try{return window.localStorage.setItem(Yh+i,JSON.stringify(t)),!0}catch{return!1}}function xp(i){try{window.localStorage.removeItem(Yh+i)}catch{}}const oh=new Do({vertexColors:!0,transparent:!0,blending:ul,depthWrite:!1,side:gn,fog:!1});function bn(i,t){const e=new ie(i,oh);return e.name=t,e.userData.noCollide=!0,e.renderOrder=2,e}const pc="render",$d={pixelSize:2,normalEdgeStrength:.5,depthEdgeStrength:.5,ditherScale:1.65,screenPeriod:3,quantize:"levels",levels:16,vignetteStrength:0,vignetteRadius:.5,vignetteSoftness:.7,sky:{...vp},linkFogToSky:!0,fogColor:"#bcd4e6",fogNear:25,fogFar:140},Zd={off:0,levels:1};class d2{settings;viewport;composer;pixelPass;retroPass;sky=new u2;air=null;dither=!0;pixelate=!0;colorblind="off";colorblindStrength=1;constructor(t){this.viewport=t;const e=_p(pc)??{};this.settings={...$d,...e,sky:{...vp,...e.sky}},this.settings.quantize in Zd||(this.settings.quantize="levels"),t.scene.add(this.sky.mesh),this.hideGlowFromEdges(t.scene),this.composer=new Zx(t.renderer),this.pixelPass=new Kx(1,t.scene,t.camera),sh(this.pixelPass.normalMaterial),this.retroPass=new mp(l2),this.composer.addPass(this.pixelPass),this.composer.addPass(new Jx),this.composer.addPass(this.retroPass),this.resize(),this.apply()}setEnvironment(t){this.air=t,this.apply()}aimSun(t){this.sky.aimAt(t)}setDither(t){this.dither=t,this.apply()}setPixelation(t){this.pixelate=t,this.apply()}setColorblind(t,e){this.colorblind=t,this.colorblindStrength=Math.min(Math.max(e,0),1),this.apply()}apply(){const t=this.settings,e=this.viewport.renderer.getPixelRatio(),n=this.pixelate?Math.max(1,Math.round(t.pixelSize*e)):1;this.pixelPass.pixelSize!==n&&this.pixelPass.setPixelSize(n),this.pixelPass.normalEdgeStrength=t.normalEdgeStrength,this.pixelPass.depthEdgeStrength=t.depthEdgeStrength;const s=this.retroPass.uniforms;s.uPixelSize.value=n,s.uDitherScale.value=this.dither?t.ditherScale:0,s.uPeriod.value=t.screenPeriod,s.uQuantize.value=Zd[t.quantize],s.uLevels.value=t.levels,s.uVignette.value=t.vignetteStrength,s.uVignetteRadius.value=t.vignetteRadius,s.uVignetteSoftness.value=t.vignetteSoftness,s.uColorblind.value=c2[this.colorblind],s.uColorblindStrength.value=this.colorblindStrength,this.sky.apply(t.sky),this.sky.mesh.visible=this.air===null||this.air.sky;const o=this.viewport.scene.fog;o instanceof Ma&&(this.air&&!this.air.sky?o.color.set(this.air.fogColor):t.linkFogToSky?o.color.set(t.sky.horizon):o.color.set(this.air?.fogColor??t.fogColor),o.near=this.air?.fogNear??t.fogNear,o.far=this.air?.fogFar??t.fogFar,this.viewport.renderer.setClearColor(o.color,1))}hideGlowFromEdges(t){t.onBeforeRender=(e,n)=>{oh.visible=n.overrideMaterial===null}}render(t){const{renderer:e}=this.viewport;e.info.reset(),e.shadowMap.needsUpdate=!0,this.sky.follow(this.viewport.camera,t),this.composer.render()}resize(){const t=this.viewport.renderer.getSize(new tt);this.composer.setPixelRatio(this.viewport.renderer.getPixelRatio()),this.composer.setSize(t.x,t.y),this.apply()}save(){return wp(pc,this.settings)}reset(){xp(pc),Object.assign(this.settings,structuredClone($d)),this.apply()}dispose(){this.viewport.scene.onBeforeRender=()=>{},oh.visible=!0,this.viewport.scene.remove(this.sky.mesh),this.sky.dispose(),this.composer.dispose()}}const mc=new URLSearchParams(window.location.search),Mp={debug:mc.has("debug"),level:mc.get("level")??"proving",touch:mc.has("touch")},f2=["KeyW","ArrowUp"],p2=["KeyS","ArrowDown"],m2=["KeyA","ArrowLeft"],g2=["KeyD","ArrowRight"],Kd=["ShiftLeft","ShiftRight"],jd=["CapsLock"],Jd=["Space"],y2=["KeyE"],gr=200,v2=3e3,_2=120;class w2{lookX=0;lookY=0;locked=!1;needsCapture;onLockChange=null;canvas;keys=new Set;stickX=0;stickZ=0;stickSprint=!1;sprintMode="hold";crouchMode="hold";sprintLatch=!1;crouchLatch=!1;jumpPressedAt=0;jumpHeld=!1;interactPressed=!1;settling=!1;relocking=!1;constructor(t){this.canvas=t,this.needsCapture=!bp(),window.addEventListener("keydown",this.handleKeyDown),window.addEventListener("keyup",this.handleKeyUp),window.addEventListener("blur",this.handleBlur),this.needsCapture?(t.addEventListener("pointerdown",this.handleCanvasPointerDown),document.addEventListener("pointerlockchange",this.handleLockChange),document.addEventListener("mousemove",this.handleMouseMove)):this.locked=!0}get moveX(){const t=Qd(this.pressed(g2),this.pressed(m2));return yr(t+this.stickX,-1,1)}get moveZ(){const t=Qd(this.pressed(f2),this.pressed(p2));return yr(t+this.stickZ,-1,1)}get sprint(){return(this.sprintMode==="toggle"?this.sprintLatch:this.pressed(Kd))||this.stickSprint}get crouching(){return this.crouchMode==="toggle"?this.crouchLatch:this.pressed(jd)}setSprintMode(t){t!==this.sprintMode&&(this.sprintMode=t,this.sprintLatch=!1)}setCrouchMode(t){t!==this.crouchMode&&(this.crouchMode=t,this.crouchLatch=!1)}get jumping(){return this.jumpHeld}takeJump(t){return this.jumpPressedAt===0||(performance.now()-this.jumpPressedAt)/1e3>t?!1:(this.jumpPressedAt=0,!0)}takeInteract(){return this.interactPressed?(this.interactPressed=!1,!0):!1}drainLook(t){t.x=this.lookX,t.y=this.lookY,this.lookX=0,this.lookY=0}setStick(t,e,n){this.stickX=t,this.stickZ=e,this.stickSprint=n}addLook(t,e){this.lookX+=t,this.lookY+=e}pressJump(){this.jumpPressedAt=performance.now(),this.jumpHeld=!0}releaseJump(){this.jumpHeld=!1}pressInteract(){this.interactPressed=!0}capture(){this.locked||!this.needsCapture||this.requestLock()}pressed(t){return t.some(e=>this.keys.has(e))}handleKeyDown=t=>{if(t.code==="Tab"&&this.locked){t.preventDefault();return}t.repeat||this.needsCapture&&!this.locked||(this.keys.add(t.code),Jd.includes(t.code)&&(t.preventDefault(),this.pressJump()),this.sprintMode==="toggle"&&Kd.includes(t.code)&&(this.sprintLatch=!this.sprintLatch),this.crouchMode==="toggle"&&jd.includes(t.code)&&(this.crouchLatch=!this.crouchLatch),y2.includes(t.code)&&this.pressInteract())};handleKeyUp=t=>{this.keys.delete(t.code),Jd.includes(t.code)&&this.releaseJump()};handleBlur=()=>{this.keys.clear(),this.releaseJump()};handleCanvasPointerDown=t=>{this.locked||t.button!==0||this.requestLock()};async requestLock(){if(this.relocking)return;this.relocking=!0;const t=performance.now()+v2;for(;!this.locked&&performance.now()<t;)await this.tryLock(),await x2(_2);this.relocking=!1}async tryLock(){try{await this.canvas.requestPointerLock({unadjustedMovement:!0})}catch{try{await this.canvas.requestPointerLock()}catch{}}}handleLockChange=()=>{this.locked=document.pointerLockElement===this.canvas,this.locked||this.keys.clear(),this.lookX=0,this.lookY=0,this.settling=this.locked,this.onLockChange?.(this.locked)};handleMouseMove=t=>{if(this.locked){if(this.settling){this.settling=!1;return}this.lookX+=yr(t.movementX,-gr,gr),this.lookY+=yr(t.movementY,-gr,gr)}};dispose(){window.removeEventListener("keydown",this.handleKeyDown),window.removeEventListener("keyup",this.handleKeyUp),window.removeEventListener("blur",this.handleBlur),this.canvas.removeEventListener("pointerdown",this.handleCanvasPointerDown),document.removeEventListener("pointerlockchange",this.handleLockChange),document.removeEventListener("mousemove",this.handleMouseMove)}}function bp(){return Mp.touch||window.matchMedia("(pointer: coarse)").matches}function x2(i){return new Promise(t=>window.setTimeout(t,i))}function Qd(i,t){return(i?1:0)-(t?1:0)}function yr(i,t,e){return Math.min(Math.max(i,t),e)}class Fo{constructor(t=new R(0,0,0),e=new R(0,1,0),n=1){this.start=t,this.end=e,this.radius=n}clone(){return new Fo(this.start.clone(),this.end.clone(),this.radius)}set(t,e,n){this.start.copy(t),this.end.copy(e),this.radius=n}copy(t){this.start.copy(t.start),this.end.copy(t.end),this.radius=t.radius}getCenter(t){return t.copy(this.end).add(this.start).multiplyScalar(.5)}translate(t){this.start.add(t),this.end.add(t)}checkAABBAxis(t,e,n,s,o,r,a,c,l){return(o-t<l||o-n<l)&&(t-r<l||n-r<l)&&(a-e<l||a-s<l)&&(e-c<l||s-c<l)}intersectsBox(t){return this.checkAABBAxis(this.start.x,this.start.y,this.end.x,this.end.y,t.min.x,t.max.x,t.min.y,t.max.y,this.radius)&&this.checkAABBAxis(this.start.x,this.start.z,this.end.x,this.end.z,t.min.x,t.max.x,t.min.z,t.max.z,this.radius)&&this.checkAABBAxis(this.start.y,this.start.z,this.end.y,this.end.z,t.min.y,t.max.y,t.min.z,t.max.z,this.radius)}}const js=new R,Js=new R,vr=new R,Qs=new R,_n=new hi,gc=new Vh,M2=new Vh,_r=new ks,to=new Fo,b2=new R,S2=new R,E2=new R,T2=1e-10;function A2(i,t,e=null,n=null){const s=b2.copy(i.end).sub(i.start),o=S2.copy(t.end).sub(t.start),r=E2.copy(t.start).sub(i.start),a=s.dot(o),c=s.dot(s),l=o.dot(o),h=o.dot(r),u=s.dot(r);let f,d;const g=c*l-a*a;if(Math.abs(g)<T2){const y=-h/l,m=(a-h)/l;Math.abs(y-.5)<Math.abs(m-.5)?(f=0,d=y):(f=1,d=m)}else f=(h*a+u*l)/g,d=(f*a-h)/l;d=Math.max(0,Math.min(1,d)),f=Math.max(0,Math.min(1,f)),e&&e.copy(s).multiplyScalar(f).add(i.start),n&&n.copy(o).multiplyScalar(d).add(t.start)}class na{constructor(t){this.box=t,this.bounds=new Hi,this.subTrees=[],this.triangles=[],this.layers=new _a}addTriangle(t){return this.bounds.min.x=Math.min(this.bounds.min.x,t.a.x,t.b.x,t.c.x),this.bounds.min.y=Math.min(this.bounds.min.y,t.a.y,t.b.y,t.c.y),this.bounds.min.z=Math.min(this.bounds.min.z,t.a.z,t.b.z,t.c.z),this.bounds.max.x=Math.max(this.bounds.max.x,t.a.x,t.b.x,t.c.x),this.bounds.max.y=Math.max(this.bounds.max.y,t.a.y,t.b.y,t.c.y),this.bounds.max.z=Math.max(this.bounds.max.z,t.a.z,t.b.z,t.c.z),this.triangles.push(t),this}calcBox(){return this.box=this.bounds.clone(),this.box.min.x-=.01,this.box.min.y-=.01,this.box.min.z-=.01,this}split(t){if(!this.box)return;const e=[],n=Js.copy(this.box.max).sub(this.box.min).multiplyScalar(.5);for(let o=0;o<2;o++)for(let r=0;r<2;r++)for(let a=0;a<2;a++){const c=new Hi,l=js.set(o,r,a);c.min.copy(this.box.min).add(l.multiply(n)),c.max.copy(c.min).add(n),e.push(new na(c))}let s;for(;s=this.triangles.pop();)for(let o=0;o<e.length;o++)e[o].box.intersectsTriangle(s)&&e[o].triangles.push(s);for(let o=0;o<e.length;o++){const r=e[o].triangles.length;r>8&&t<16&&e[o].split(t+1),r!==0&&this.subTrees.push(e[o])}return this}build(){return this.calcBox(),this.split(0),this}getRayTriangles(t,e){for(let n=0;n<this.subTrees.length;n++){const s=this.subTrees[n];if(t.intersectsBox(s.box))if(s.triangles.length>0)for(let o=0;o<s.triangles.length;o++)e.indexOf(s.triangles[o])===-1&&e.push(s.triangles[o]);else s.getRayTriangles(t,e)}return e}triangleCapsuleIntersect(t,e){e.getPlane(_n);const n=_n.distanceToPoint(t.start)-t.radius,s=_n.distanceToPoint(t.end)-t.radius;if(n>0&&s>0||n<-t.radius&&s<-t.radius)return!1;const o=Math.abs(n/(Math.abs(n)+Math.abs(s))),r=js.copy(t.start).lerp(t.end,o);if(e.containsPoint(r))return{normal:_n.normal.clone(),point:r.clone(),depth:Math.abs(Math.min(n,s))};const a=t.radius*t.radius,c=gc.set(t.start,t.end),l=[[e.a,e.b],[e.b,e.c],[e.c,e.a]];for(let h=0;h<l.length;h++){const u=M2.set(l[h][0],l[h][1]);if(A2(c,u,vr,Qs),vr.distanceToSquared(Qs)<a)return{normal:vr.clone().sub(Qs).normalize(),point:Qs.clone(),depth:t.radius-vr.distanceTo(Qs)}}return!1}triangleSphereIntersect(t,e){if(e.getPlane(_n),!t.intersectsPlane(_n))return!1;const n=Math.abs(_n.distanceToSphere(t)),s=t.radius*t.radius-n*n,o=_n.projectPoint(t.center,js);if(e.containsPoint(t.center))return{normal:_n.normal.clone(),point:o.clone(),depth:Math.abs(_n.distanceToSphere(t))};const r=[[e.a,e.b],[e.b,e.c],[e.c,e.a]];for(let a=0;a<r.length;a++){gc.set(r[a][0],r[a][1]),gc.closestPointToPoint(o,!0,Js);const c=Js.distanceToSquared(t.center);if(c<s)return{normal:t.center.clone().sub(Js).normalize(),point:Js.clone(),depth:t.radius-Math.sqrt(c)}}return!1}getSphereTriangles(t,e){for(let n=0;n<this.subTrees.length;n++){const s=this.subTrees[n];if(t.intersectsBox(s.box))if(s.triangles.length>0)for(let o=0;o<s.triangles.length;o++)e.indexOf(s.triangles[o])===-1&&e.push(s.triangles[o]);else s.getSphereTriangles(t,e)}}getCapsuleTriangles(t,e){for(let n=0;n<this.subTrees.length;n++){const s=this.subTrees[n];if(t.intersectsBox(s.box))if(s.triangles.length>0)for(let o=0;o<s.triangles.length;o++)e.indexOf(s.triangles[o])===-1&&e.push(s.triangles[o]);else s.getCapsuleTriangles(t,e)}}sphereIntersect(t){_r.copy(t);const e=[];let n,s=!1;this.getSphereTriangles(t,e);for(let o=0;o<e.length;o++)(n=this.triangleSphereIntersect(_r,e[o]))&&(s=!0,_r.center.add(n.normal.multiplyScalar(n.depth)));if(s){const o=_r.center.clone().sub(t.center),r=o.length();return{normal:o.normalize(),depth:r}}return!1}capsuleIntersect(t){to.copy(t);const e=[];let n,s=!1;this.getCapsuleTriangles(to,e);for(let o=0;o<e.length;o++)(n=this.triangleCapsuleIntersect(to,e[o]))&&(s=!0,to.translate(n.normal.multiplyScalar(n.depth)));if(s){const o=to.getCenter(new R).sub(t.getCenter(js)),r=o.length();return{normal:o.normalize(),depth:r}}return!1}rayIntersect(t){if(t.direction.length()===0)return;const e=[];let n,s,o=1e100;this.getRayTriangles(t,e);for(let r=0;r<e.length;r++){const a=t.intersectTriangle(e[r].a,e[r].b,e[r].c,!0,js);if(a){const c=a.sub(t.origin).length();o>c&&(s=a.clone().add(t.origin),o=c,n=e[r])}}return o<1e100?{distance:o,triangle:n,position:s}:!1}fromGraphNode(t){return t.updateWorldMatrix(!0,!0),t.traverse(e=>{if(e.isMesh===!0&&this.layers.test(e.layers)){let n,s=!1;e.geometry.index!==null?(s=!0,n=e.geometry.toNonIndexed()):n=e.geometry;const o=n.getAttribute("position");for(let r=0;r<o.count;r+=3){const a=new R().fromBufferAttribute(o,r),c=new R().fromBufferAttribute(o,r+1),l=new R().fromBufferAttribute(o,r+2);a.applyMatrix4(e.matrixWorld),c.applyMatrix4(e.matrixWorld),l.applyMatrix4(e.matrixWorld),this.addTriangle(new ln(a,c,l))}s&&n.dispose()}}),this.build(),this}clear(){return this.box=null,this.bounds.makeEmpty(),this.subTrees.length=0,this.triangles.length=0,this}}const Sp=1;function Te(i){return Ep(i),i}function Ep(i){if(i.userData.noCollide!==!0){i.layers.enable(Sp);for(const t of i.children)Ep(t)}}const cs=[],yc=new R,eo=new R,vc=new R,t0=new R,_c=new R,e0=new R,ms=new R,n0=new Vh,wc={normal:new R,depth:0};class ia{index={octree:new na,triangles:0};cache=new Map;build(t,e){if(e!==void 0){const s=this.cache.get(e);if(s){this.index=s;return}}const n=ia.index(t);e!==void 0&&this.cache.set(e,n),this.index=n}warm(t,e){this.cache.has(e)||this.cache.set(e,ia.index(t))}invalidate(t){this.cache.delete(t)}static index(t){const e=new na;return e.layers.disableAll(),e.layers.enable(Sp),e.fromGraphNode(t),{octree:e,triangles:Tp(e)}}get triangles(){return this.index.triangles}intersectCapsule(t){cs.length=0,this.index.octree.getCapsuleTriangles(t,cs);let e=0;for(const n of cs){const s=i0(t,n);s<=e||(e=s,wc.normal.copy(ms))}return e===0?null:(wc.depth=e,wc)}overlaps(t){cs.length=0,this.index.octree.getCapsuleTriangles(t,cs);for(const e of cs)if(i0(t,e)>0)return!0;return!1}raycast(t,e){const n=this.index.octree.rayIntersect(new Lo(t,e));return n?n.distance:null}}function i0(i,t){t.getNormal(eo),yc.subVectors(i.end,i.start);const e=eo.dot(yc);let n=0;Math.abs(e)>1e-6&&(n=eo.dot(vc.subVectors(t.a,i.start))/e,n=Math.min(Math.max(n,0),1)),vc.copy(i.start).addScaledVector(yc,n),t.closestPointToPoint(vc,t0),n0.set(i.start,i.end),n0.closestPointToPoint(t0,!0,_c),t.closestPointToPoint(_c,e0),ms.subVectors(_c,e0);const s=ms.length();return s>=i.radius||(s>1e-6?ms.divideScalar(s):ms.copy(eo),ms.dot(eo)<=0)?0:i.radius-s}function Tp(i){let t=i.triangles.length;for(const e of i.subTrees)t+=Tp(e);return t}const xc=1/120,s0=16,R2=4,wr=6,C2=.28,qn={radius:.32,height:1.8,eyeHeight:1.35,walkSpeed:4.2,sprintScale:1.75,crouchScale:.52,crouchHeight:.58,crouchSpeed:22,crouchDrag:.45,stepSmoothing:16,groundAccel:14,airAccel:7.5,friction:10,stopSpeed:1.6,gravity:26,jumpSpeed:7.2,coyoteTime:.22,jumpBuffer:.15,autoHop:!1,slopeLimitDeg:50,stepHeight:.45,lookSensitivity:.0022,invertY:!1,invertX:!1,bobScale:1,bobAmount:.02,bobSway:.012,bobRoll:.004,bobStepsPerSecond:1.9,bobSpeedInfluence:.5,firstStepFraction:.65,maxAirSpeed:1.12,fov:80,fovScaling:"vertical",sprintFovBoost:8,landDip:.02},wn=new R,o0=new R,xr=new R,Mc=new R,r0=new R,Mr=new R,bc=new R,P2=new R,br=new R,a0=new R,Be=new Fo,Sc={x:0,y:0};let I2=class{tuning={...qn};velocity=new R;onFootstep=null;onLand=null;onJump=null;camera;input;collider;capsule=new Fo;yaw=0;pitch=0;zoomedOut=!1;authoredFov=qn.fov;crouch=0;stepLag=0;stance=0;lastFeetY=null;groundNormal=new R(0,1,0);wishX=0;wishZ=0;grounded=!1;jumped=!1;timeOffGround=0;timeSinceLand=1/0;bobPhase=0;strideProgress=.65;dip=0;accumulator=0;constructor(t,e,n){this.camera=t,this.input=e,this.collider=n,this.camera.rotation.order="YXZ",this.authoredFov=this.tuning.fov,this.applyProjection(),this.teleport(new R(0,2,6),0)}teleport(t,e=this.yaw){const{radius:n,height:s}=this.tuning;this.capsule.set(new R(t.x,t.y+n,t.z),new R(t.x,t.y+s-n,t.z),n),this.velocity.set(0,0,0),this.yaw=e,this.grounded=!1,this.stance=0,this.crouch=0,this.stepLag=0,this.lastFeetY=null}setFieldOfView(t,e,n){this.tuning.fov=t,this.tuning.sprintFovBoost=e,this.tuning.fovScaling=n,this.authoredFov=t+(this.zoomedOut?e:0),this.applyProjection()}applyProjection(){const t=this.authoredFov,e=this.tuning.fovScaling==="vertical"?t:Da.radToDeg(2*Math.atan(Math.tan(Da.degToRad(t)/2)/this.camera.aspect));Math.abs(e-this.camera.fov)>.001&&(this.camera.fov=e,this.camera.updateProjectionMatrix())}get position(){return P2.copy(this.capsule.start).setY(this.capsule.start.y-this.tuning.radius)}get heading(){return this.yaw}get isGrounded(){return this.grounded}get speed(){return Math.hypot(this.velocity.x,this.velocity.z)}update(t){this.applyLook(),this.accumulator+=t;let e=0;for(;this.accumulator>=xc&&e<s0;)this.step(xc),this.accumulator-=xc,e+=1;e===s0&&(this.accumulator=0),this.applyCamera(t)}applyLook(){this.input.drainLook(Sc);const{lookSensitivity:t,invertY:e,invertX:n}=this.tuning;this.yaw-=Sc.x*t*(n?-1:1),this.pitch-=Sc.y*t*(e?-1:1);const s=Math.PI/2-.001;this.pitch=Math.min(Math.max(this.pitch,-s),s),this.yaw=this.yaw%(Math.PI*2)}step(t){const e=this.tuning;this.jumped=!1,this.grounded?(this.timeOffGround=0,this.timeSinceLand+=t,this.applyFriction(t)):(this.timeOffGround+=t,this.velocity.y-=e.gravity*t),this.applyWish(t),this.applyJump(),this.capAirSpeed();const n=this.grounded,s=-this.velocity.y;this.move(t),this.grounded&&!n&&(this.timeSinceLand=0,s>1&&(this.dip+=Math.min(s,18)*e.landDip,this.onLand?.(s))),this.advanceBob(t)}applyFriction(t){const e=this.tuning,n=this.velocity.length();if(n<1e-4){this.velocity.set(0,0,0);return}const s=Math.max(n,e.stopSpeed)*e.friction*t;this.velocity.multiplyScalar(Math.max(n-s,0)/n)}applyWish(t){const e=this.tuning,{moveX:n,moveZ:s}=this.input;o0.set(-Math.sin(this.yaw),0,-Math.cos(this.yaw)),xr.set(Math.cos(this.yaw),0,-Math.sin(this.yaw)),wn.set(0,0,0).addScaledVector(o0,s).addScaledVector(xr,n);const o=wn.length();if(o<1e-4){this.wishX=0,this.wishZ=0;return}if(wn.divideScalar(o),this.wishX=wn.x,this.wishZ=wn.z,this.grounded){wn.projectOnPlane(this.groundNormal);const h=wn.length();if(h<1e-4)return;wn.divideScalar(h)}const r=e.walkSpeed*Math.min(o,1)*(this.input.sprint?e.sprintScale:1)*(1-this.stance*(1-e.crouchDrag)),a=this.velocity.dot(wn),c=r-a;if(c<=0)return;const l=this.grounded?e.groundAccel:e.airAccel;this.velocity.addScaledVector(wn,Math.min(l*r*t,c))}capAirSpeed(){if(this.grounded)return;const t=this.tuning,e=t.walkSpeed*t.sprintScale*t.maxAirSpeed,n=Math.hypot(this.velocity.x,this.velocity.z);if(n<=e||n<1e-6)return;const s=e/n;this.velocity.x*=s,this.velocity.z*=s}applyJump(){const t=this.tuning;!(this.grounded||this.timeOffGround<t.coyoteTime)||!(this.input.takeJump(t.jumpBuffer)||t.autoHop&&this.input.jumping)||(this.velocity.y=t.jumpSpeed,this.grounded=!1,this.jumped=!0,this.timeSinceLand>C2&&this.onJump?.(),this.timeSinceLand=0,this.timeOffGround=t.coyoteTime)}move(t){const e=this.tuning;r0.copy(this.velocity).multiplyScalar(t),bc.copy(this.capsule.start);const n=this.grounded,s=this.velocity.x,o=this.velocity.z;this.grounded=!1,this.capsule.translate(r0),this.resolve(),n&&!this.grounded&&!this.jumped&&this.snapToGround(),!(e.stepHeight<=0||this.wishX===0&&this.wishZ===0||this.velocity.y>.1||(this.capsule.start.x-bc.x)*this.wishX+(this.capsule.start.z-bc.z)*this.wishZ>=e.walkSpeed*t*.5)&&this.tryStepUp(t)&&(this.velocity.x=s,this.velocity.z=o,this.velocity.y=0)}resolve(){const t=Math.cos(this.tuning.slopeLimitDeg*Math.PI/180);for(let e=0;e<R2;e++){const n=this.collider.intersectCapsule(this.capsule);if(!n)break;this.capsule.translate(Mc.copy(n.normal).multiplyScalar(n.depth)),n.normal.y>t&&(this.grounded=!0,this.groundNormal.copy(n.normal));const s=this.velocity.dot(n.normal);s<0&&this.velocity.addScaledVector(n.normal,-s)}this.grounded||this.groundNormal.set(0,1,0)}headroom(){if(this.stance<.01)return!0;const t=this.tuning,e=this.capsule.start.y-t.radius;return Be.copy(this.capsule),Be.start.set(this.capsule.start.x,e+t.radius,this.capsule.start.z),Be.end.set(this.capsule.start.x,e+t.height-t.radius,this.capsule.start.z),!this.collider.overlaps(Be)}applyStance(){if(Math.abs(this.crouch-this.stance)<.001)return;this.stance=this.crouch;const t=this.tuning,e=this.capsule.start.y-t.radius,n=t.height*(1-this.stance*(1-t.crouchHeight));this.capsule.end.set(this.capsule.start.x,e+Math.max(n-t.radius,t.radius+.01),this.capsule.start.z)}snapToGround(){const t=this.tuning,e=Math.cos(t.slopeLimitDeg*Math.PI/180),n=Math.max(t.stepHeight,.05)/wr;Mr.set(0,-n,0),Be.copy(this.capsule);for(let s=0;s<wr;s++){Be.translate(Mr);const o=this.collider.intersectCapsule(Be);if(o){if(o.normal.y<=e)return;Be.translate(Mc.set(0,n,0)),this.capsule.copy(Be),this.grounded=!0,this.groundNormal.copy(o.normal);return}}}tryStepUp(t){const e=this.tuning,n=Math.max(e.walkSpeed*t,.02);if(br.set(this.capsule.start.x+this.wishX*n,this.capsule.start.y+e.stepHeight,this.capsule.start.z+this.wishZ*n),a0.copy(br).setY(br.y+e.height-e.radius*2),Be.set(br,a0,e.radius),this.collider.overlaps(Be))return!1;const s=e.stepHeight/wr;Mr.set(0,-s,0);for(let o=0;o<wr;o++)if(Be.translate(Mr),this.collider.overlaps(Be))return Be.translate(Mc.set(0,s,0)),this.capsule.copy(Be),this.grounded=!0,this.groundNormal.set(0,1,0),!0;return!1}advanceBob(t){const e=this.tuning;if(!this.grounded)return;const n=this.speed;if(n<.15){this.bobPhase+=(Math.round(this.bobPhase)-this.bobPhase)*Math.min(t*8,1),this.strideProgress=e.firstStepFraction;return}const s=e.walkSpeed/Math.max(e.bobStepsPerSecond,.1),o=Math.max(.2,s*Math.pow(n/e.walkSpeed,1-e.bobSpeedInfluence));for(this.strideProgress+=n*t/o,this.bobPhase+=n*t/(o*2);this.strideProgress>=1;)this.strideProgress-=1,this.onFootstep?.(n)}applyCamera(t){const e=this.tuning,n=this.input.crouching||!this.headroom()?1:0;this.crouch+=(n-this.crouch)*Math.min(t*e.crouchSpeed,1),this.applyStance();const s=this.bobPhase*Math.PI*2;xr.set(Math.cos(this.yaw),0,-Math.sin(this.yaw));const o=Math.min(this.speed/e.walkSpeed,1)*e.bobScale;this.dip=Math.max(this.dip-this.dip*Math.min(t*9,1),0);const r=this.capsule.start.y-e.radius;if(this.lastFeetY!==null&&this.grounded){const c=r-this.lastFeetY;c>.001&&c<e.stepHeight*1.2&&(this.stepLag+=c)}this.lastFeetY=r,this.stepLag=Math.max(0,this.stepLag-this.stepLag*Math.min(t*e.stepSmoothing,1)),this.camera.position.set(this.capsule.start.x,r-this.stepLag+e.eyeHeight*(1-this.stance*(1-e.crouchScale))-this.dip+Math.sin(s*2)*e.bobAmount*o,this.capsule.start.z),this.camera.position.addScaledVector(xr,Math.sin(s)*e.bobSway*o),this.camera.rotation.set(this.pitch,this.yaw,Math.sin(s)*e.bobRoll*o),this.zoomedOut?(!this.input.sprint||this.speed<.4)&&(this.zoomedOut=!1):this.input.sprint&&this.speed>1.2&&(this.zoomedOut=!0);const a=e.fov+(this.zoomedOut?e.sprintFovBoost:0);this.authoredFov=Da.damp(this.authoredFov,a,6,t),this.applyProjection()}};const ls=64,L2=.85,c0=2.2;class D2{input;root;stickBase;stickKnob;jumpPad;stick=null;lookPointer=null;lastLookX=0;lastLookY=0;constructor(t,e){this.input=t,this.root=document.createElement("div"),this.root.className="touch",this.stickBase=document.createElement("div"),this.stickBase.className="touch-stick",this.stickKnob=document.createElement("div"),this.stickKnob.className="touch-stick-knob",this.stickBase.appendChild(this.stickKnob),this.jumpPad=document.createElement("div"),this.jumpPad.className="touch-jump",this.jumpPad.textContent="↑",this.root.append(this.stickBase,this.jumpPad),e.appendChild(this.root),this.root.addEventListener("pointerdown",this.handleDown),window.addEventListener("pointermove",this.handleMove),window.addEventListener("pointerup",this.handleUp),window.addEventListener("pointercancel",this.handleUp),this.jumpPad.addEventListener("pointerdown",this.handleJumpDown),this.jumpPad.addEventListener("pointerup",this.handleJumpUp),this.jumpPad.addEventListener("pointercancel",this.handleJumpUp)}handleDown=t=>{const e=t.clientX<window.innerWidth/2;if(e&&this.stick===null){this.stick={pointerId:t.pointerId,originX:t.clientX,originY:t.clientY},this.stickBase.style.left=`${t.clientX}px`,this.stickBase.style.top=`${t.clientY}px`,this.stickBase.classList.add("is-active"),this.updateStick(t.clientX,t.clientY);return}!e&&this.lookPointer===null&&(this.lookPointer=t.pointerId,this.lastLookX=t.clientX,this.lastLookY=t.clientY)};handleMove=t=>{if(this.stick?.pointerId===t.pointerId){this.updateStick(t.clientX,t.clientY);return}this.lookPointer===t.pointerId&&(this.input.addLook((t.clientX-this.lastLookX)*c0,(t.clientY-this.lastLookY)*c0),this.lastLookX=t.clientX,this.lastLookY=t.clientY)};handleUp=t=>{this.stick?.pointerId===t.pointerId&&(this.stick=null,this.input.setStick(0,0,!1),this.stickBase.classList.remove("is-active"),this.stickKnob.style.transform="translate(-50%, -50%)"),this.lookPointer===t.pointerId&&(this.lookPointer=null)};handleJumpDown=t=>{t.stopPropagation(),this.jumpPad.classList.add("is-active"),this.input.pressJump()};handleJumpUp=()=>{this.jumpPad.classList.remove("is-active"),this.input.releaseJump()};updateStick(t,e){if(!this.stick)return;let n=t-this.stick.originX,s=e-this.stick.originY;const o=Math.hypot(n,s);if(o>ls){const a=ls/o;n*=a,s*=a}this.stickKnob.style.transform=`translate(calc(-50% + ${n}px), calc(-50% + ${s}px))`;const r=Math.min(o,ls)/ls;this.input.setStick(n/ls,-s/ls,r>L2)}dispose(){this.root.removeEventListener("pointerdown",this.handleDown),window.removeEventListener("pointermove",this.handleMove),window.removeEventListener("pointerup",this.handleUp),window.removeEventListener("pointercancel",this.handleUp),this.root.remove()}}const sa=4,xn=256,l0=xn/sa,N2=.82,U2=.6,F2=4,h0=.6,u0=1.4;function Sr(i,t){return Math.min(Math.max(t+.5-i,0),1)}function Er(i,t){const e=(i%t+t)%t;return Math.min(e,t-e)}let Ec=null;function d0(){if(Ec)return Ec;const i=new Uint8Array(xn*xn*4);for(let e=0;e<xn;e++)for(let n=0;n<xn;n++){const s=n+.5,o=e+.5,r=Math.max(Sr(Er(s,xn),u0),Sr(Er(o,xn),u0)),a=Math.max(Sr(Er(s,l0),h0),Sr(Er(o,l0),h0)),c=Math.min(1-r*(1-U2),1-a*(1-N2)),l=Math.round(c*255),h=(e*xn+n)*4;i[h]=l,i[h+1]=l,i[h+2]=l,i[h+3]=255}const t=new sp(i,xn,xn,hn);return t.wrapS=bo,t.wrapT=bo,t.colorSpace=Vn,t.generateMipmaps=!0,t.minFilter=ui,t.magFilter=sn,t.anisotropy=16,t.needsUpdate=!0,Ec=t,t}function qh(i=400,t={}){const e=t.segments??Math.max(8,Math.round(i/F2)),n=new mi(i,i,e,e);n.rotateX(-Math.PI/2);const s=n.getAttribute("uv");for(let a=0;a<s.count;a++)s.setXY(a,(s.getX(a)-.5)*(i/sa),(s.getY(a)-.5)*(i/sa));s.needsUpdate=!0;const o=t.material??new Ke({color:t.color??13286300});o.map!==d0()&&(o.map=d0(),o.needsUpdate=!0);const r=new ie(n,o);return r.name="flatGround",r.position.y=t.y??-.01,t.collidable===!1?r:Te(r)}const Ap=sa,f0={ground:"#cabb9c",cube:"#525f66",marker:"#b08040",ramp:"#38474a",stair:"#3d4b52",platform:"#46505c",wall:"#2e3640"},O2=208,z2=52,k2=14474440,B2=6044206,H2=new R(0,.1,10);function He(i,t,e,n,s,o,r){const a=new ie(new G(i,t,e),n);return a.position.set(s,o+t/2,r),a}function G2(i,t,e,n){const s=new up;s.moveTo(0,0),s.lineTo(t,0),s.lineTo(t,t*Math.tan(e*Math.PI/180)),s.closePath();const o=new Hh(s,{depth:i,bevelEnabled:!1});return o.translate(0,0,-i/2),o.rotateY(Math.PI/2),new ie(o,n)}function Tc(i,t,e,n,s,o){const a=new mi(i,t,96,1),c=a.getAttribute("position"),l=new Float32Array(c.count*3),h=new Yt;for(let f=0;f<c.count;f++){const d=c.getX(f)/i+.5,[g,y,m]=o(Math.min(Math.max(d,0),1));h.setRGB(g,y,m,nn),h.toArray(l,f*3)}a.setAttribute("color",new je(l,3));const u=new ie(a,new Do({vertexColors:!0}));return u.position.set(e,n,s),u}class V2{root=new we;colors={...f0};materials={};constructor(){this.root.name="ProvingGround";for(const t of Object.keys(this.colors))this.materials[t]=new Ke({color:this.colors[t],flatShading:!0});this.populate()}populate(){return this.root.children.length>0?this.root:(this.addGround(),this.addHeightReference(),this.addMeasuredCubes(),this.addDistanceMarkers(),this.addMovementGym(),this.addCalibrationBoard(),this.root)}applyColors(){for(const t of Object.keys(this.colors))this.materials[t].color.set(this.colors[t])}resetColors(){Object.assign(this.colors,f0),this.applyColors()}addGround(){this.root.add(qh(O2,{segments:z2,material:this.materials.ground})),this.root.add(new Bx(2))}addHeightReference(){const t=new we,e=.3,n=6;for(let s=0;s<n;s++){const o=new ie(new G(.08,e,.08),new Ke({color:s%2===0?k2:B2,flatShading:!0}));o.position.y=e*(s+.5),t.add(o)}t.position.set(-2,0,0),this.root.add(t)}addMeasuredCubes(){const t=[1,2,4];let e=4;for(const n of t)this.root.add(Te(He(n,n,n,this.materials.cube,e+n/2,0,0))),e+=n+1}addDistanceMarkers(){for(const t of[5,10,20,30])this.root.add(Te(He(.1,2,.1,this.materials.marker,0,0,-t)))}addMovementGym(){const t=new we;t.name="MovementGym",this.addRamps(t),this.addStairs(t),this.addKerbs(t),this.addJumpGaps(t),this.addFallWalkway(t),this.addParkour(t),this.root.add(Te(t))}addRamps(t){const e=[10,20,30,45],n=4;e.forEach((s,o)=>{const r=G2(2.5,n,s,this.materials.ramp);r.position.set(-6-o*4,0,-2),t.add(r);const a=n*Math.tan(s*Math.PI/180);t.add(He(2.5,.2,2,this.materials.ramp,-6-o*4,a-.2,-7))})}addStairs(t){const e=[{rise:.18,run:.3,x:-24},{rise:.3,run:.3,x:-28}];for(const n of e)for(let s=0;s<8;s++){const o=n.rise*(s+1);t.add(He(2.5,o,n.run,this.materials.stair,n.x,0,-2-s*n.run))}}addKerbs(t){[.2,.35,.5,.9].forEach((e,n)=>{t.add(He(3,e,2,this.materials.platform,-8-n*4,0,5))})}addJumpGaps(t){const e=[1.5,2.5,3.5],n=3,s=1.2;let o=18;t.add(He(3,s,n,this.materials.platform,-26,0,o));for(const r of e)o-=n+r,t.add(He(3,s,n,this.materials.platform,-26,0,o))}addParkour(t){const e=new we;e.name="Parkour";let n=8;for(const o of[0,1.4,1.8,2.2,2.6])n+=o,e.add(He(.7,.9,.7,this.materials.platform,-6,0,n));const s=-10;for(const o of[-1,1])e.add(He(.3,2.2,7,this.materials.wall,s+o*1.05,0,11.5));for(const[o,r]of[[1.6,9],[1.3,11.5],[1.1,14]])e.add(He(2.4,.3,.5,this.materials.wall,s,o,r));e.add(He(1.2,.6,1.2,this.materials.platform,-14,0,7.4)),n=8.4;for(const o of[.9,.7,.5,.35])e.add(He(o,1.2,2.4,this.materials.platform,-14,0,n)),n+=3.4;n=8;for(const o of[.55,.65,.75,.9]){for(const r of[-1,1])e.add(He(1.4,2,.6,this.materials.wall,-18+r*(o/2+.7),0,n));n+=2.6}t.add(e)}addFallWalkway(t){t.add(He(2.5,.2,8,this.materials.platform,-18,3.8,-12))}addCalibrationBoard(){const t=new we;t.name="CalibrationBoard";const e=7,n=-12;t.add(Te(He(12,6,.3,this.materials.wall,e,0,n)));const s=[[16711680,65280,255,16777215],[65535,16711935,16776960,0],[3355443,6710886,10066329,13421772],[9278609,6044206,11567168,3028544]],o=.9;s.forEach((l,h)=>{l.forEach((u,f)=>{const d=new ie(new mi(o,o),new Do({color:u}));d.position.set(e-4.6+f*(o+.15),5.1-h*(o+.15),n+.16),t.add(d)})}),t.add(Tc(5.2,.7,e+2.6,4.3,n+.16,l=>[l,l,l])),t.add(Tc(5.2,.7,e+2.6,3.4,n+.16,l=>[l,l*.35,.12])),t.add(Tc(5.2,.7,e+2.6,2.5,n+.16,l=>[.1,l*.6,l]));const r=new ie(new No(1.1,48,32),new Ke({color:9278609}));r.position.set(e-8.5,1.1,n),t.add(Te(r));const a=Math.PI/6,c=new ie(new mi(6,4),new Ke({color:7305853,side:gn}));c.position.set(e-13.5,2*Math.cos(a),n),c.rotation.x=-a,t.add(Te(c)),this.root.add(t)}dispose(){this.root.traverse(t=>{if(t instanceof ie||t instanceof zh||t instanceof rp){t.geometry.dispose();const e=t.material;if(Array.isArray(e))for(const n of e)n.dispose();else e.dispose()}}),this.root.clear()}}function W2(i,t){return Math.PI*i*t}function Ns(i,t,e,n={}){const s=n.ring??"excitation",o=n.compensation??"energy",r=n.maxQ??(s==="filter"?220:14),a=[],c=[];return{inputs:t.map(h=>{const u=i.createGain(),f=i.createBiquadFilter();f.type="bandpass",f.frequency.value=h.hz;const d=h.q??(s==="filter"?Math.min(r,Math.max(1,W2(h.hz,h.decay))):Math.min(r,Math.max(4,4+h.decay*24)));f.Q.value=d,c.push(d);const g=i.createGain();return g.gain.value=o==="energy"?Math.sqrt(d):1/Math.sqrt(d),u.connect(f).connect(g).connect(e),a.push(u,f,g),u}),modes:t,qs:c,dispose(){for(const h of a)h.disconnect()}}}const rh=8,Ac=48;function Rp(i){return Array.from({length:rh},(t,e)=>{const n=((e+1)/rh)**2,s=new Float32Array(Ac);for(let o=0;o<Ac;o++)s[o]=n*i(o/(Ac-1));return s})}const X2=Rp(i=>.5*(1-Math.cos(2*Math.PI*i)));Rp(i=>{if(i<.05)return .5*(1-Math.cos(Math.PI*(i/.05)));const e=(i-.05)/(1-.05);return Math.exp(-5*e)*(1-e)});function Y2(i){return i[Math.floor(Math.random()*rh)]}function Oo(i,t,e,n,s){i.setValueAtTime(0,t),i.linearRampToValueAtTime(e,t+n),i.setTargetAtTime(0,t+n,s/3)}function Cp(i,t,e){const n=i.createGain(),s=i.createBiquadFilter();return s.type="bandpass",s.frequency.value=t.hz,s.Q.value=t.q,n.connect(s).connect(e),{input:n,dispose(){n.disconnect(),s.disconnect()}}}function Pp(i,t,e,n,s,o){const r=n.count/Math.max(n.over,.001);let a=0;for(let c=0;c<n.count&&(a+=-Math.log(1-Math.random()*.999-.001)/r,!(a>n.over*1.4));c++){const l=Math.exp(-a/n.energyDecay),h=o*n.level*l*(.35+Math.random()*.65);if(h<.002)continue;const u=i.createBufferSource();u.buffer=t,u.playbackRate.value=.7+Math.random()*.7;const f=i.createGain(),d=s+a;Oo(f.gain,d,h,8e-4,.012),u.connect(f).connect(e),u.start(d,Math.random()*Math.max(t.duration-.2,0),.06),u.stop(d+.07)}}function Cn(i,t,e,n,s,o){if(s<=5e-4)return;const r=i.createBufferSource();r.buffer=t;const a=i.createGain();Oo(a.gain,n,s,Math.min(.0012,o*.3),o*1.6),r.connect(a).connect(e),r.start(n,Math.random()*Math.max(t.duration-.5,0),o+.05),r.stop(n+o+.06)}function Ta(i,t,e,n,s,o,r,a=.002){if(n<=5e-4)return;const c=i.createOscillator();c.type="sine",c.frequency.setValueAtTime(s,e),c.frequency.exponentialRampToValueAtTime(Math.max(o,1),e+r);const l=i.createGain();Oo(l.gain,e,n,a,r),c.connect(l).connect(t),c.start(e),c.stop(e+r*3+.06)}const Tr={stone:{level:.5,impact:{level:.9,duration:.011,tone:3800},modes:[{hz:620,decay:.06,level:.6},{hz:1450,decay:.03,level:.32},{hz:2600,decay:.018,level:.12}],grit:{count:5,over:.06,energyDecay:.025,hz:2600,q:1.2,level:.12},toe:.45,roll:.075},wood:{level:.6,impact:{level:.7,duration:.018,tone:1700},modes:[{hz:155,decay:.22,level:1},{hz:390,decay:.15,level:.6},{hz:720,decay:.075,level:.22}],grit:{count:4,over:.05,energyDecay:.02,hz:1200,q:.9,level:.08},toe:.6,roll:.085},earth:{level:.5,impact:{level:1,duration:.022,tone:900},modes:[{hz:120,decay:.05,level:.55}],grit:{count:9,over:.07,energyDecay:.028,hz:1600,q:1,level:.22},toe:.4,roll:.085},gravel:{level:.5,impact:{level:.45,duration:.012,tone:2400},modes:[],grit:{count:26,over:.16,energyDecay:.06,hz:3e3,q:1.4,level:.75},toe:.7,roll:.09},grass:{level:.32,impact:{level:.5,duration:.03,tone:1400},modes:[],grit:{count:16,over:.11,energyDecay:.045,hz:5200,q:.9,level:.4},toe:.6,roll:.085},leaves:{level:.4,impact:{level:.35,duration:.02,tone:2600},modes:[],grit:{count:34,over:.2,energyDecay:.08,hz:4200,q:2.2,level:.55},toe:.75,roll:.09},metal:{level:.45,impact:{level:.9,duration:.004,tone:9e3},modes:[{hz:480,decay:.5,level:.5},{hz:1270,decay:.42,level:.45},{hz:2340,decay:.3,level:.3},{hz:4100,decay:.18,level:.2}],grit:null,toe:.5,roll:.07},mud:{level:.5,impact:{level:1,duration:.05,tone:700},modes:[{hz:240,decay:.06,level:.35}],grit:{count:6,over:.09,energyDecay:.03,hz:900,q:3.2,level:.3},toe:.3,roll:.1}},q2=6,p0=.35,$2=9;function no(i,t){return i+Math.random()*(t-i)}class Z2{surface="earth";engine;output;body;panner;reverbSend;chains=new Map;left=!1;constructor(t,e=.55){this.engine=t;const n=t.context;this.output=n.createGain(),this.output.gain.value=e,this.body=n.createBiquadFilter(),this.body.type="lowpass",this.body.frequency.value=5200,this.body.Q.value=.6,this.panner=n.createStereoPanner(),this.reverbSend=n.createGain(),this.reverbSend.gain.value=.6,this.output.connect(this.body),this.body.connect(this.panner),this.panner.connect(t.dry),this.panner.connect(this.reverbSend),this.reverbSend.connect(t.send)}setReverb(t){this.reverbSend.gain.setTargetAtTime(Math.max(0,t),this.engine.context.currentTime,.1)}step(t){const e=this.engine.context;if(e.state!=="running"||!this.engine.noise)return;const n=Tr[this.surface],s=this.chainFor(this.surface),o=e.currentTime+.004,r=p0+(1-p0)*(1-Math.exp(-t/(q2*.45))),a=n.level*Math.min(r,1);if(this.panner.pan.setValueAtTime(this.takeFoot()*.2,o),this.strike(s,n,o,a*no(.9,1.1)),n.toe>0){const c=n.roll*Math.max(.35,1-t/12);this.strike(s,n,o+c,a*n.toe*no(.8,1.1))}}land(t){const e=this.engine.context;if(e.state!=="running"||!this.engine.noise)return;const n=Tr[this.surface],s=this.chainFor(this.surface),o=e.currentTime+.004,r=Math.min(t/$2,1),a=n.level*(.7+r*.85);this.panner.pan.setValueAtTime(0,o),this.strike(s,n,o,a),this.strike(s,n,o+no(.012,.03),a*no(.4,.6))}jump(){const t=this.engine.context;if(t.state!=="running"||!this.engine.noise)return;const e=Tr[this.surface],n=this.chainFor(this.surface),s=t.currentTime+.004;this.panner.pan.setValueAtTime(this.takeFoot()*.12,s),this.strike(n,e,s,e.level*no(.42,.55),{stretch:3.2,modes:.28,grit:1.7})}takeFoot(){const t=this.left?-1:1;return this.left=!this.left,t}strike(t,e,n,s,o){const r=this.engine.context,a=this.engine.noise;if(!a)return;const c=o?.stretch??1,l=o?.modes??1,h=o?.grit??1;Cn(r,a.white,t.impactInput,n,s*e.impact.level,e.impact.duration*c);for(let u=0;u<e.modes.length;u++)Cn(r,a.white,t.bank.inputs[u],n,s*e.modes[u].level*.5*l,.002);e.grit&&t.gritInput&&Pp(r,a.white,t.gritInput,e.grit,n,s*h)}chainFor(t){const e=this.chains.get(t);if(e)return e;const n=this.engine.context,s=Tr[t],o=n.createGain(),r=n.createBiquadFilter();r.type="lowpass",r.frequency.value=s.impact.tone,o.connect(r).connect(this.output);const a=Ns(n,s.modes,this.output,{ring:"filter",compensation:"inverse"});let c=null;s.grit&&(c=Cp(n,s.grit,this.output).input);const l={impactInput:o,bank:a,gritInput:c};return this.chains.set(t,l),l}dispose(){this.output.disconnect(),this.body.disconnect(),this.panner.disconnect(),this.reverbSend.disconnect()}}const K2=6;function Ip(i){const t=Math.floor(i.sampleRate*K2);return{white:Rc(i,t,J2()),pink:Rc(i,t,Q2()),brown:Rc(i,t,tM())}}function Rc(i,t,e){const n=i.createBuffer(1,t,i.sampleRate),s=n.getChannelData(0);for(let r=0;r<t;r++)s[r]=e();const o=Math.min(2048,t/4|0);for(let r=0;r<o;r++){const a=r/o;s[r]=s[r]*a+s[t-o+r]*(1-a)}return j2(s),n}function j2(i){let t=0;for(let n=0;n<i.length;n++)t=Math.max(t,Math.abs(i[n]));if(t===0)return;const e=.95/t;for(let n=0;n<i.length;n++)i[n]*=e}function J2(){return()=>Math.random()*2-1}function Q2(){let i=0,t=0,e=0,n=0,s=0,o=0,r=0;return()=>{const a=Math.random()*2-1;i=.99886*i+a*.0555179,t=.99332*t+a*.0750759,e=.969*e+a*.153852,n=.8665*n+a*.3104856,s=.55*s+a*.5329522,o=-.7616*o-a*.016898;const c=i+t+e+n+s+o+r+a*.5362;return r=a*.115926,c*.11}}function tM(){let i=0;return()=>{const t=Math.random()*2-1;return i=(i+.02*t)/1.02,i*3.5}}function Sn(i,t,e,n=.06){const s=i.createBufferSource();return s.buffer=t,s.loop=!0,s.playbackRate.value=1+(Math.random()*2-1)*n,s.connect(e),s.start(0,Math.random()*t.duration),{source:s,stop(o=0){try{s.stop(o)}catch{}}}}const Ar={open:{rt60:.7,preDelay:.012,damping:.7,wet:.12},cell:{rt60:.45,preDelay:.004,damping:.55,wet:.3},hall:{rt60:4.2,preDelay:.035,damping:.18,wet:.62}};async function eM(i,t){const e=Math.max(t.rt60,.05),n=Math.ceil(i*(e+t.preDelay)),s=new OfflineAudioContext(2,n,i),o=s.createBufferSource();o.buffer=nM(s,n,i,t);const r=s.createBiquadFilter();r.type="lowpass",r.frequency.value=700+(1-t.damping)**2*17300;const a=s.createBiquadFilter();return a.type="highpass",a.frequency.value=90,o.connect(r).connect(a).connect(s.destination),o.start(0),s.startRendering()}function nM(i,t,e,n){const s=i.createBuffer(2,t,e),o=Math.floor(n.preDelay*e),r=Math.exp(-Math.log(1e3)/(n.rt60*e));for(let a=0;a<2;a++){const c=s.getChannelData(a);let l=1;for(let h=o;h<t;h++)c[h]=(Math.random()*2-1)*l,l*=r}return s}const Cc=[1,.4,.2,.1],iM=[1,2.7,6.1,13.3],m0=.11;function g0(i){let t=Math.imul(i|0,668265261);return t^=t>>>15,t=Math.imul(t,2246822507),t^=t>>>13,(t>>>0)/4294967296}function ah(i){const t=Math.floor(i),e=i-t,n=(1-Math.cos(e*Math.PI))*.5;return g0(t)*(1-n)+g0(t+1)*n}const sM=1.35;function y0(i){let t=0,e=0;for(let s=0;s<Cc.length;s++)t+=ah(i*iM[s]+s*17.3)*Cc[s],e+=Cc[s];const n=t/e;return Math.min(1,Math.max(0,.5+(n-.5)*sM))}const oM={windSpeed:.5,gustDepth:.6,gustRate:.06,windDirection:2.1,frontSpeed:9};class Lp{settings={...oM};gust=0;swell=.5;strength=0;time=0;update(t){this.time+=t*this.settings.gustRate,this.gust=y0(this.time),this.swell=ah(this.time*m0+91.7),this.strength=this.fieldAt(this.time)}fieldAt(t){const{windSpeed:e,gustDepth:n}=this.settings,s=y0(t),o=ah(t*m0+91.7),r=e*(.45+o*1.1);return Math.min(1,Math.max(0,r+(s-.5)*n))}lagAt(t,e){const{windDirection:n,frontSpeed:s,gustRate:o}=this.settings;return(t*Math.cos(n)+e*Math.sin(n))/Math.max(s,.5)*o}strengthAt(t,e){return this.fieldAt(this.time-this.lagAt(t,e))}get phase(){return this.time}}const rM=""+new URL("processor-Xg0mnuxH.js",import.meta.url).href,v0=new WeakMap;function aM(i){let t=v0.get(i);return t||(t=i.audioWorklet.addModule(rM),v0.set(i,t)),t}const _0=new Map;async function cM(i,t){let e=_0.get(i);return e||(e=fetch(i).then(n=>{if(!n.ok)throw new Error(`${n.status} ${n.statusText}`);return n.arrayBuffer()}).then(n=>({wasm:n,meta:t})).catch(n=>(console.warn(`faust: could not load ${i} — falling back`,n),null)),_0.set(i,e)),e}async function Dp(i,t,e){try{const[n]=await Promise.all([cM(t,e),aM(i)]);if(!n)return null;const s=new AudioWorkletNode(i,"faust-processor",{numberOfInputs:e.inputs>0?1:0,numberOfOutputs:1,outputChannelCount:[Math.max(e.outputs,1)],processorOptions:{wasm:n.wasm,meta:n.meta}}),o=new Map;for(const[r,a]of Object.entries(e.params))o.set(r,a.init);return{node:s,meta:e,set(r,a){o.set(r,a),s.port.postMessage({type:"param",key:r,value:a})},get(r){return o.get(r)??0},dispose(){s.port.onmessage=null,s.disconnect()}}}catch(n){return console.warn("faust: worklet unavailable — falling back",n),null}}const Np=Object.freeze(Object.defineProperty({__proto__:null,createFaustNode:Dp},Symbol.toStringTag,{value:"Module"})),lM=""+new URL("reverb-BkEOyDCs.wasm",import.meta.url).href,hM=lM,uM={name:"reverb",inputs:1,outputs:2,size:1982988,params:{crossover:{at:36,init:200,min:50,max:1e3,step:1},damping:{at:16,init:6e3,min:700,max:16e3,step:1},decayLow:{at:24,init:2,min:.2,max:12,step:.01},decayMid:{at:28,init:2,min:.2,max:12,step:.01},preDelay:{at:327756,init:20,min:0,max:100,step:1}}},$h={masterVolume:.7,reverbAmount:1,airAbsorption:.65,occlusion:.8},dM=.12,w0=8,x0=24;class fM{context;settings={...$h};weather=new Lp;dry;send;duck;master;noise=null;ready;started=!1;rooms=new Map;currentRoom=null;occlusionTimer=0;emitters=new Set;ranking=[];faust=null;faustWet=null;tap=null;constructor(){this.context=new AudioContext({latencyHint:"interactive"}),this.master=this.context.createGain(),this.duck=this.context.createGain(),this.dry=this.context.createGain(),this.send=this.context.createGain();const t=this.context.createDynamicsCompressor();t.threshold.value=-6,t.knee.value=6,t.ratio.value=12,t.attack.value=.003,t.release.value=.25,this.dry.connect(this.duck),this.duck.connect(this.master),this.master.connect(t),t.connect(this.context.destination),this.ready=this.build(),this.listenForGesture(),document.addEventListener("visibilitychange",this.handleVisibility)}async build(){this.noise=Ip(this.context);const t=await Dp(this.context,hM,uM);if(t){const s=this.context.createGain();s.gain.value=0,this.send.connect(t.node),t.node.connect(s),s.connect(this.duck),this.faust=t,this.faustWet=s}const e=Object.keys(Ar),n=await Promise.all(e.map(s=>eM(this.context.sampleRate,Ar[s])));this.faust||(e.forEach((s,o)=>{const r=this.context.createConvolver();r.normalize=!0,r.buffer=n[o];const a=this.context.createGain();a.gain.value=0,this.send.connect(r),r.connect(a),a.connect(this.duck),this.rooms.set(s,{convolver:r,gain:a})}),this.currentRoom!==null&&this.setRoom(this.currentRoom))}setRoom(t,e=.45){this.currentRoom=t;const n=this.context.currentTime,s=Ar[t];if(this.faust&&this.faustWet){this.faust.set("decayLow",s.rt60*1.5),this.faust.set("decayMid",s.rt60),this.faust.set("crossover",200),this.faust.set("damping",700+(1-s.damping)**2*15300),this.faust.set("preDelay",s.preDelay*1e3),this.faustWet.gain.cancelScheduledValues(n),this.faustWet.gain.setTargetAtTime(s.wet*this.settings.reverbAmount,n,e/3);return}if(this.rooms.size!==0)for(const[o,r]of this.rooms){const a=o===t?Ar[o].wet*this.settings.reverbAmount:0;r.gain.gain.cancelScheduledValues(n),r.gain.gain.setTargetAtTime(a,n,e/3)}}get reverbKind(){return this.faust?"fdn":"convolution"}get reverbControls(){return this.faust}get analyser(){if(!this.tap){const t=this.context.createAnalyser();t.fftSize=2048,t.smoothingTimeConstant=.6,this.master.connect(t),this.tap=t}return this.tap}get room(){return this.currentRoom}register(t){this.emitters.add(t)}unregister(t){this.emitters.delete(t)}update(t,e){return this.weather.update(t),this.updateListener(e),this.master.gain.value=this.settings.masterVolume,this.occlusionTimer-=t,this.occlusionTimer>0?!1:(this.occlusionTimer=dM,this.allocateVoices(),!0)}allocateVoices(){this.ranking.length=0;for(const e of this.emitters){if(!e.enabled){e.setDetail("virtual");continue}const n=e.position.distanceTo(kn);if(n>e.maxDistance){e.setDetail("virtual");continue}this.ranking.push({emitter:e,priority:n/Math.max(e.importance,.01)})}this.ranking.sort((e,n)=>e.priority-n.priority);const t=2;for(let e=0;e<this.ranking.length;e++){const{emitter:n}=this.ranking[e],s=n.detailLevel;let o;e<w0?o="hrtf":e<x0?o="panned":o="virtual",s==="hrtf"&&e<w0+t?o="hrtf":s==="panned"&&o==="virtual"&&e<x0+t&&(o="panned"),n.setDetail(o)}}get voiceCounts(){let t=0,e=0,n=0;for(const s of this.emitters)s.detailLevel==="hrtf"?t++:s.detailLevel==="panned"?e++:n++;return{hrtf:t,panned:e,virtual:n}}updateListener(t){const e=this.context.listener;if(t.updateWorldMatrix(!0,!1),kn.setFromMatrixPosition(t.matrixWorld),Ri.set(0,0,-1).applyQuaternion(t.getWorldQuaternion(M0)),Ci.set(0,1,0).applyQuaternion(M0),e.positionX){const n=this.context.currentTime,s=.02;e.positionX.linearRampToValueAtTime(kn.x,n+s),e.positionY.linearRampToValueAtTime(kn.y,n+s),e.positionZ.linearRampToValueAtTime(kn.z,n+s),e.forwardX.linearRampToValueAtTime(Ri.x,n+s),e.forwardY.linearRampToValueAtTime(Ri.y,n+s),e.forwardZ.linearRampToValueAtTime(Ri.z,n+s),e.upX.linearRampToValueAtTime(Ci.x,n+s),e.upY.linearRampToValueAtTime(Ci.y,n+s),e.upZ.linearRampToValueAtTime(Ci.z,n+s)}else{const n=e;n.setPosition(kn.x,kn.y,kn.z),n.setOrientation(Ri.x,Ri.y,Ri.z,Ci.x,Ci.y,Ci.z)}}get listenerPosition(){return kn}applyReverbAmount(){this.currentRoom!==null&&this.setRoom(this.currentRoom,.05)}listenForGesture(){const t=()=>{this.context.resume().then(()=>{this.started=this.context.state==="running"}),window.removeEventListener("pointerdown",t),window.removeEventListener("keydown",t),window.removeEventListener("touchstart",t)};window.addEventListener("pointerdown",t),window.addEventListener("keydown",t),window.addEventListener("touchstart",t)}handleVisibility=()=>{document.hidden?this.context.suspend():this.started&&this.context.resume()};dispose(){document.removeEventListener("visibilitychange",this.handleVisibility),this.context.close()}}const kn=new R,Ri=new R,Ci=new R,M0=new jn;/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.21.0
 * @author George Michael Brower
 * @license MIT
 */class En{constructor(t,e,n,s,o="div"){this.parent=t,this.object=e,this.property=n,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(o),this.domElement.classList.add("lil-controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("lil-name"),En.nextNameID=En.nextNameID||0,this.$name.id=`lil-gui-name-${++En.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("lil-widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",r=>r.stopPropagation()),this.domElement.addEventListener("keyup",r=>r.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(n)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("lil-disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class pM extends En{constructor(t,e,n){super(t,e,n,"lil-boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function ch(i){let t,e;return(t=i.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=i.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=i.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const mM={isPrimitive:!0,match:i=>typeof i=="string",fromHexString:ch,toHexString:ch},Ro={isPrimitive:!0,match:i=>typeof i=="number",fromHexString:i=>parseInt(i.substring(1),16),toHexString:i=>"#"+i.toString(16).padStart(6,0)},gM={isPrimitive:!1,match:i=>Array.isArray(i)||ArrayBuffer.isView(i),fromHexString(i,t,e=1){const n=Ro.fromHexString(i);t[0]=(n>>16&255)/255*e,t[1]=(n>>8&255)/255*e,t[2]=(n&255)/255*e},toHexString([i,t,e],n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return Ro.toHexString(s)}},yM={isPrimitive:!1,match:i=>Object(i)===i,fromHexString(i,t,e=1){const n=Ro.fromHexString(i);t.r=(n>>16&255)/255*e,t.g=(n>>8&255)/255*e,t.b=(n&255)/255*e},toHexString({r:i,g:t,b:e},n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return Ro.toHexString(s)}},vM=[mM,Ro,gM,yM];function _M(i){return vM.find(t=>t.match(i))}class wM extends En{constructor(t,e,n,s){super(t,e,n,"lil-color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=_M(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const o=ch(this.$text.value);o&&this._setValueFromHexString(o)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Pc extends En{constructor(t,e,n){super(t,e,n,"lil-function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class xM extends En{constructor(t,e,n,s,o,r){super(t,e,n,"lil-number"),this._initInput(),this.min(s),this.max(o);const a=r!==void 0;this.step(a?r:this._getImplicitStep(),a),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let _=parseFloat(this.$input.value);isNaN(_)||(this._stepExplicit&&(_=this._snap(_)),this.setValue(this._clamp(_)))},n=_=>{const v=parseFloat(this.$input.value);isNaN(v)||(this._snapClampSetValue(v+_),this.$input.value=this.getValue())},s=_=>{_.key==="Enter"&&this.$input.blur(),_.code==="ArrowUp"&&(_.preventDefault(),n(this._step*this._arrowKeyMultiplier(_))),_.code==="ArrowDown"&&(_.preventDefault(),n(this._step*this._arrowKeyMultiplier(_)*-1))},o=_=>{this._inputFocused&&(_.preventDefault(),n(this._step*this._normalizeMouseWheel(_)))};let r=!1,a,c,l,h,u;const f=5,d=_=>{a=_.clientX,c=l=_.clientY,r=!0,h=this.getValue(),u=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",y)},g=_=>{if(r){const v=_.clientX-a,w=_.clientY-c;Math.abs(w)>f?(_.preventDefault(),this.$input.blur(),r=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(v)>f&&y()}if(!r){const v=_.clientY-l;u-=v*this._step*this._arrowKeyMultiplier(_),h+u>this._max?u=this._max-h:h+u<this._min&&(u=this._min-h),this._snapClampSetValue(h+u)}l=_.clientY},y=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",y)},m=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",o,{passive:!1}),this.$input.addEventListener("mousedown",d),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("lil-slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("lil-fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("lil-has-slider");const t=(p,_,v,w,b)=>(p-_)/(v-_)*(b-w)+w,e=p=>{const _=this.$slider.getBoundingClientRect();let v=t(p,_.left,_.right,this._min,this._max);this._snapClampSetValue(v)},n=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",o)},s=p=>{e(p.clientX)},o=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",o)};let r=!1,a,c;const l=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),r=!1},h=p=>{p.touches.length>1||(this._hasScrollBar?(a=p.touches[0].clientX,c=p.touches[0].clientY,r=!0):l(p),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",f))},u=p=>{if(r){const _=p.touches[0].clientX-a,v=p.touches[0].clientY-c;Math.abs(_)>Math.abs(v)?l(p):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",f))}else p.preventDefault(),e(p.touches[0].clientX)},f=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",f)},d=this._callOnFinishChange.bind(this),g=400;let y;const m=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const v=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+v),this.$input.value=this.getValue(),clearTimeout(y),y=setTimeout(d,g)};this.$slider.addEventListener("mousedown",n),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("lil-active",t),document.body.classList.toggle("lil-dragging",t),document.body.classList.toggle(`lil-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:n}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,n=-t.wheelDelta/120,n*=this._stepExplicit?1:10),e+-n}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){let e=0;return this._hasMin?e=this._min:this._hasMax&&(e=this._max),t-=e,t=Math.round(t/this._step)*this._step,t+=e,t=parseFloat(t.toPrecision(15)),t}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class MM extends En{constructor(t,e,n,s){super(t,e,n,"lil-option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("lil-focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("lil-focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const n=document.createElement("option");n.textContent=e,this.$select.appendChild(n)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class bM extends En{constructor(t,e,n){super(t,e,n,"lil-string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}var SM=`.lil-gui {
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
}`;function EM(i){const t=document.createElement("style");t.innerHTML=i;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let b0=!1;class Zh{constructor({parent:t,autoPlace:e=t===void 0,container:n,width:s,title:o="Controls",closeFolders:r=!1,injectStyles:a=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("button"),this.$title.classList.add("lil-title"),this.$title.setAttribute("aria-expanded",!0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("lil-children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(o),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("lil-root"),c&&this.domElement.classList.add("lil-allow-touch-styles"),!b0&&a&&(EM(SM),b0=!0),n?n.appendChild(this.domElement):e&&(this.domElement.classList.add("lil-auto-place","autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=r}add(t,e,n,s,o){if(Object(n)===n)return new MM(this,t,e,n);const r=t[e];switch(typeof r){case"number":return new xM(this,t,e,n,s,o);case"boolean":return new pM(this,t,e);case"string":return new bM(this,t,e);case"function":return new Pc(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,r)}addColor(t,e,n=1){return new wM(this,t,e,n)}addFolder(t){const e=new Zh({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(n=>{n instanceof Pc||n._name in t.controllers&&n.load(t.controllers[n._name])}),e&&t.folders&&this.folders.forEach(n=>{n._title in t.folders&&n.load(t.folders[n._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(n=>{if(!(n instanceof Pc)){if(n._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${n._name}"`);e.controllers[n._name]=n.save()}}),t&&this.folders.forEach(n=>{if(n._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${n._title}"`);e.folders[n._title]=n.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("lil-closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("lil-transition");const n=o=>{o.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("lil-transition"),this.$children.removeEventListener("transitionend",n))};this.$children.addEventListener("transitionend",n);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("lil-closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(n=>n.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}var Mo=function(){var i=0,t=document.createElement("div");t.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",t.addEventListener("click",function(h){h.preventDefault(),n(++i%t.children.length)},!1);function e(h){return t.appendChild(h.dom),h}function n(h){for(var u=0;u<t.children.length;u++)t.children[u].style.display=u===h?"block":"none";i=h}var s=(performance||Date).now(),o=s,r=0,a=e(new Mo.Panel("FPS","#0ff","#002")),c=e(new Mo.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var l=e(new Mo.Panel("MB","#f08","#201"));return n(0),{REVISION:16,dom:t,addPanel:e,showPanel:n,begin:function(){s=(performance||Date).now()},end:function(){r++;var h=(performance||Date).now();if(c.update(h-s,200),h>=o+1e3&&(a.update(r*1e3/(h-o),100),o=h,r=0,l)){var u=performance.memory;l.update(u.usedJSHeapSize/1048576,u.jsHeapSizeLimit/1048576)}return h},update:function(){s=this.end()},domElement:t,setMode:n}};Mo.Panel=function(i,t,e){var n=1/0,s=0,o=Math.round,r=o(window.devicePixelRatio||1),a=80*r,c=48*r,l=3*r,h=2*r,u=3*r,f=15*r,d=74*r,g=30*r,y=document.createElement("canvas");y.width=a,y.height=c,y.style.cssText="width:80px;height:48px";var m=y.getContext("2d");return m.font="bold "+9*r+"px Helvetica,Arial,sans-serif",m.textBaseline="top",m.fillStyle=e,m.fillRect(0,0,a,c),m.fillStyle=t,m.fillText(i,l,h),m.fillRect(u,f,d,g),m.fillStyle=e,m.globalAlpha=.9,m.fillRect(u,f,d,g),{dom:y,update:function(p,_){n=Math.min(n,p),s=Math.max(s,p),m.fillStyle=e,m.globalAlpha=1,m.fillRect(0,0,a,f),m.fillStyle=t,m.fillText(o(p)+" "+i+" ("+o(n)+"-"+o(s)+")",l,h),m.drawImage(y,u+r,f,d-r,g,u,f,d-r,g),m.fillRect(u+d-r,f,r,g),m.fillStyle=e,m.globalAlpha=.9,m.fillRect(u+d-r,f,r,o((1-p/_)*g))}}};function TM(){if(!Mp.debug)return{gui:null,stats:null,update:()=>{},dispose:()=>{}};const i=new Mo;i.dom.style.position="fixed",i.dom.style.top="0",i.dom.style.left="0",document.body.appendChild(i.dom);const t=new Zh({title:"hswow"});return t.domElement.style.setProperty("--width","280px"),{gui:t,stats:i,update:()=>i.update(),dispose:()=>{t.destroy(),i.dom.remove()}}}const Rr=2e4,AM=420,RM=.32,CM=.08,Ic=.04,Lc=.5;class Up{position=new R;enabled=!0;importance;maxDistance;engine;model;absorption;occlusion;swap;panner;sendGain;reverb;ignoreAbsorption;ignoreOcclusion;invertDistance;occluded=!1;detail="panned";connected=!1;pending=0;constructor(t,e,n){this.engine=t,this.model=e,this.position.copy(n.position),this.maxDistance=n.maxDistance??60,this.reverb=n.reverb??1,this.importance=n.importance??1,this.ignoreAbsorption=n.ignoreAbsorption??!1,this.ignoreOcclusion=n.ignoreOcclusion??!1,this.invertDistance=n.invertDistance??!1;const s=t.context;this.absorption=s.createBiquadFilter(),this.absorption.type="lowpass",this.absorption.frequency.value=Rr,this.occlusion=s.createGain(),this.swap=s.createGain(),this.panner=s.createPanner(),this.panner.panningModel="equalpower",this.panner.distanceModel="inverse",this.panner.refDistance=n.refDistance??1.5,this.panner.maxDistance=this.maxDistance,this.panner.rolloffFactor=this.invertDistance?0:n.rolloff??1.1,n.direction&&(this.panner.coneInnerAngle=n.coneInner??90,this.panner.coneOuterAngle=n.coneOuter??240,this.panner.coneOuterGain=n.coneOuterGain??.35,PM(this.panner,n.direction)),S0(this.panner,this.position),this.sendGain=s.createGain(),this.sendGain.gain.value=this.reverb,this.absorption.connect(this.occlusion),this.occlusion.connect(this.swap),this.swap.connect(this.panner),this.panner.connect(t.dry),this.panner.connect(this.sendGain),this.sendGain.connect(t.send),this.connect(),t.register(this)}moveTo(t){this.position.copy(t),S0(this.panner,this.position)}setDetail(t){t!==this.detail&&(this.detail=t,this.retarget())}retarget(){const t=this.engine.context,e=t.currentTime;this.swap.gain.cancelScheduledValues(e),this.swap.gain.setValueAtTime(this.swap.gain.value,e),this.swap.gain.linearRampToValueAtTime(0,e+Ic),window.clearTimeout(this.pending),this.pending=window.setTimeout(()=>{const n=this.detail;if(n==="virtual"){this.connected&&(this.disconnect(),this.model.setActive?.(!1));return}this.connected||(this.connect(),this.model.setActive?.(!0)),this.panner.panningModel=n==="hrtf"?"HRTF":"equalpower";const s=t.currentTime;this.swap.gain.cancelScheduledValues(s),this.swap.gain.setValueAtTime(0,s),this.swap.gain.linearRampToValueAtTime(1,s+Ic)},Ic*1e3+10)}update(t,e,n){if(this.detail==="virtual"||!this.enabled){this.enabled===!1&&this.connected&&this.glide(this.occlusion.gain,0);return}const s=this.position.distanceTo(this.engine.listenerPosition);this.model.update?.(t,this.engine,this.position),n&&!this.ignoreOcclusion&&(this.occluded=this.testOcclusion(e,s));const o=this.engine.settings,r=Math.min(s/this.maxDistance,1),a=this.ignoreAbsorption?Rr:Rr*(1-o.airAbsorption*Math.sqrt(r)*.94),c=this.occluded?o.occlusion:0,l=Math.min(a,E0(Rr,AM,c)),h=this.invertDistance?T0(r):r<=Lc?1:1-T0((r-Lc)/(1-Lc));this.glide(this.absorption.frequency,Math.max(l,180)),this.glide(this.occlusion.gain,E0(1,RM,c)*h),this.sendGain.gain.value=this.reverb*o.reverbAmount}testOcclusion(t,e){if(e<.5)return!1;Gn.subVectors(this.position,this.engine.listenerPosition).divideScalar(e);const n=t.raycast(this.engine.listenerPosition,Gn);return n!==null&&n<e-.35}connect(){this.connected||(this.model.output.connect(this.absorption),this.connected=!0)}disconnect(){if(this.connected){try{this.model.output.disconnect(this.absorption)}catch{}this.connected=!1}}glide(t,e){t.setTargetAtTime(e,this.engine.context.currentTime,CM)}get isOccluded(){return this.occluded}get isVirtual(){return this.detail==="virtual"}get detailLevel(){return this.detail}dispose(){this.engine.unregister(this),this.disconnect(),this.model.dispose(),this.panner.disconnect(),this.sendGain.disconnect(),this.absorption.disconnect(),this.occlusion.disconnect(),this.swap.disconnect()}}function S0(i,t){i.positionX?(i.positionX.value=t.x,i.positionY.value=t.y,i.positionZ.value=t.z):i.setPosition(t.x,t.y,t.z)}function PM(i,t){Gn.copy(t).normalize(),i.orientationX?(i.orientationX.value=Gn.x,i.orientationY.value=Gn.y,i.orientationZ.value=Gn.z):i.setOrientation(Gn.x,Gn.y,Gn.z)}function E0(i,t,e){return i+(t-i)*e}function T0(i){const t=i<0?0:i>1?1:i;return t*t*t*(t*(t*6-15)+10)}const Gn=new R,IM=220,LM=560,DM=1.4,Dc=1300,NM=2900,Nc=4,UM=9;function Fp(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("wind model built before the noise buffers were ready");const s=e.createGain();s.gain.value=t.gain??.5;const o=e.createBiquadFilter();o.type="lowpass",o.frequency.value=t.tone??3400,o.Q.value=.4;const r=e.createBiquadFilter();r.type="highshelf",r.frequency.value=2200,r.gain.value=-7;const a=e.createGain();a.gain.value=.5,o.connect(r).connect(a).connect(s);const c=e.createGain(),l=e.createGain(),h=e.createGain(),u=e.createBiquadFilter();u.type="lowpass",u.frequency.value=IM;const f=e.createBiquadFilter();f.type="bandpass",f.frequency.value=LM,f.Q.value=DM;const d=e.createBiquadFilter();d.type="bandpass",d.frequency.value=Dc,d.Q.value=Nc;const g=[Sn(e,n.brown,u),Sn(e,n.pink,f),Sn(e,n.white,d)];u.connect(c).connect(o),f.connect(l).connect(o),d.connect(h).connect(o);const y=t.whistle??1;return{output:s,setTone(m){o.frequency.setTargetAtTime(m,e.currentTime,.1)},update(m,p,_){const v=p.weather.strengthAt(_.x,_.z),w=e.currentTime,b=.09;c.gain.setTargetAtTime(.1+v*.85,w,b),l.gain.setTargetAtTime(.03+v*v*.5,w,b),h.gain.setTargetAtTime(v**3*.2*y,w,b),a.gain.setTargetAtTime(.25+v*.75,w,b*1.6),d.frequency.setTargetAtTime(Dc+(NM-Dc)*v,w,b),d.Q.setTargetAtTime(Nc+(UM-Nc)*v,w,b)},dispose(){for(const m of g)m.stop();s.disconnect()}}}const FM=.14,OM=160;function Pn(i,t=FM){let e=0;return{pump(n,s,o="immediate"){const r=i.currentTime;e<r&&(e=r+(o==="oneGap"?s():0));const a=r+t;let c=0;for(;e<a&&c<OM;)n(e),e+=Math.max(s(),1e-4),c++},reset(){e=0}}}function gi(i){const t=Math.max(i,.01);return()=>-Math.log(1-Math.random())/t}function Op(i,t=.06){return()=>i*(1+(Math.random()*2-1)*t)}function Kh(i,t,e,n=1){const s=t.map(o=>{const r=i.createBiquadFilter();return r.type="bandpass",r.frequency.value=o.hz*n,r.Q.value=o.q,r.connect(e),{filter:r,weight:o.weight,hz:o.hz}});return{pick(){let o=Math.random();for(const r of s)if(o-=r.weight,o<=0)return r.filter;return s[s.length-1].filter},setTone(o,r){for(const a of s)a.filter.frequency.setTargetAtTime(a.hz*o,r,.15)},overlap(o,r){return o*r},dispose(){for(const o of s)o.filter.disconnect()}}}function zM(i,t,e,n,s={}){const o=s.minDuration??.055,r=s.maxDuration??.165,a=o+Math.random()*(r-o),c=i.createBufferSource();c.buffer=t;const l=s.minRate??.7,h=s.maxRate??1.4;c.playbackRate.value=l+Math.random()*(h-l);const u=i.createGain();u.gain.setValueCurveAtTime(Y2(s.pool??X2),n,a),c.connect(u).connect(e),c.start(n,Math.random()*Math.max(t.duration-.3,0),a+.02),c.stop(n+a+.03)}const kM=[{hz:1150,q:2.6,weight:.4},{hz:2400,q:3.2,weight:.46},{hz:4600,q:3.8,weight:.14}];function zp(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("foliage model built before the noise buffers were ready");const s=t.density??240,o=t.tone??1,r=t.restlessness??.2,a=e.createGain();a.gain.value=t.gain??.5;const c=e.createGain();c.gain.value=0,c.connect(a);const l=Kh(e,kM,c,o),h=e.createBiquadFilter();h.type="bandpass",h.frequency.value=1800*o,h.Q.value=.75;const u=e.createGain();u.gain.value=0;const f=Sn(e,n.pink,h);h.connect(u).connect(a);let d=t.articulation??.3,g=!0;const y=Pn(e),m=p=>zM(e,n.white,l.pick(),p,{minDuration:.055,maxDuration:.165});return{output:a,setArticulation(p){d=p},setActive(p){g=p,p&&y.reset(),p||(u.gain.value=0,c.gain.value=0)},update(p,_,v){if(!g)return;const w=Math.max(_.weather.strengthAt(v.x,v.z),r),b=e.currentTime;u.gain.setTargetAtTime(.1+w*.5,b,.15),h.frequency.setTargetAtTime((1500+w*1900)*o,b,.15),c.gain.setTargetAtTime(d*(.25+w*.75),b,.15);const S=Math.max(20,s*w*w);y.pump(m,gi(S))},dispose(){f.stop(),l.dispose(),c.disconnect(),a.disconnect()}}}const A0=[1,2,3.02,4.05,5.97],BM=[1,.5,.28,.16,.09],Cr={steady:{speed:1,wear:1,clank:1,min:9,max:26,next:["labouring","surging","idling"]},labouring:{speed:.62,wear:1.8,clank:1.7,min:5,max:14,next:["steady","stalling","surging"]},surging:{speed:1.34,wear:1.3,clank:.8,min:3,max:9,next:["steady","labouring"]},stalling:{speed:.22,wear:2.2,clank:2.4,min:1.5,max:4,next:["labouring","idling"]},idling:{speed:.45,wear:.7,clank:.5,min:8,max:20,next:["steady","surging"]}};function kp(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("machine model built before the noise buffers were ready");const s=t.fundamental??46,o=t.clank??.5,r=e.createGain();r.gain.value=t.gain??.35;const a=e.createGain();a.gain.value=.5;const c=e.createBiquadFilter();c.type="lowpass",c.frequency.value=520,c.Q.value=.9;const l=[];A0.forEach((A,P)=>{const C=e.createOscillator();C.type=P===0?"sawtooth":"triangle",C.frequency.value=s*A,C.detune.value=(Math.random()*2-1)*9;const F=e.createGain();F.gain.value=BM[P],C.connect(F).connect(c),C.start(),l.push(C)}),c.connect(a);const h=e.createGain();h.gain.value=1;const u=e.createOscillator();u.type="sine";const f=e.createGain();f.gain.value=.22,u.connect(f).connect(h.gain),u.start(),a.connect(h).connect(r);const d=e.createBiquadFilter();d.type="bandpass",d.frequency.value=2600,d.Q.value=.8;const g=e.createGain();g.gain.value=(t.wear??.4)*.22;const y=Sn(e,n.pink,d);d.connect(g).connect(r);const m=e.createGain();m.gain.value=o,m.connect(r);let p=t.rpm??52,_=p,v=!0;const w=Pn(e,.15);let b="steady",S=12;const E=(t.wear??.4)*.22,T=A=>{if(o<=0)return;const P=e.createBufferSource();P.buffer=n.white;const C=e.createBiquadFilter();C.type="bandpass",C.frequency.value=190+Math.random()*90,C.Q.value=14;const F=e.createGain();Oo(F.gain,A,.9+Math.random()*.3,.001,.15),P.connect(C).connect(F).connect(m),P.start(A,Math.random()*2,.4),P.stop(A+.45)},x=(A=.9)=>{const P=e.currentTime,C=Cr[b];u.frequency.setTargetAtTime(_/60,P,A*.4);const F=Math.max(_,4)/52;A0.forEach((N,D)=>{l[D].frequency.setTargetAtTime(s*N*F,P,A)}),c.frequency.setTargetAtTime(420+F*260,P,A),g.gain.setTargetAtTime(E*C.wear,P,A),m.gain.setTargetAtTime(o*C.clank,P,A)},M=A=>{b=A;const P=Cr[A];S=P.min+Math.random()*(P.max-P.min),x()};return x(.01),{output:r,get phase(){return b},get currentRpm(){return _},setRpm(A){p=A},setActive(A){v=A,A&&w.reset()},update(A){if(!v)return;if(S-=A,S<=0){const N=Cr[b].next;M(N[Math.floor(Math.random()*N.length)])}const P=p*Cr[b].speed,C=Math.min(A*.55,1);Math.abs(P-_)>.05&&(_+=(P-_)*C,x());const F=60/Math.max(_,3);w.pump(T,Op(F,.06),"oneGap")},dispose(){for(const A of l)A.stop();u.stop(),y.stop(),r.disconnect()}}}function Bp(i,t={}){const e=i.context,n=t.pitch??2400,s=t.interval??7,o=t.shySpeed??.72,r=e.createGain();r.gain.value=t.gain??.16;const a=e.createBiquadFilter();a.type="lowpass",a.frequency.value=t.tone??3200,a.Q.value=.5,a.connect(r);let c=!0,l=0;const h=(g,y,m,p)=>{const _=e.createOscillator();_.type="sine",_.frequency.setValueAtTime(y,g),_.frequency.exponentialRampToValueAtTime(m,g+p);const v=e.createOscillator();v.type="sine",v.frequency.setValueAtTime(y*2.02,g),v.frequency.exponentialRampToValueAtTime(m*2.02,g+p);const w=e.createGain();w.gain.value=.18;const b=e.createGain();b.gain.setValueAtTime(0,g),b.gain.linearRampToValueAtTime(1,g+p*.18),b.gain.setValueAtTime(1,g+p*.6),b.gain.linearRampToValueAtTime(0,g+p),_.connect(b),v.connect(w).connect(b),b.connect(a),_.start(g),v.start(g),_.stop(g+p+.02),v.stop(g+p+.02)},u=[{name:"rising",weight:.26},{name:"falling",weight:.2},{name:"trill",weight:.16},{name:"pair",weight:.22},{name:"single",weight:.1},{name:"chatter",weight:.06}],f=()=>{let g=Math.random();for(const y of u)if(g-=y.weight,g<=0)return y.name;return"pair"},d=g=>{const y=n*(.82+Math.random()*.36);let m=g;switch(f()){case"rising":{const p=2+Math.floor(Math.random()*3);for(let _=0;_<p;_++){const v=1+_*(.1+Math.random()*.09),w=.06+Math.random()*.07;h(m,y*v,y*v*1.22,w),m+=w+.03+Math.random()*.05}break}case"falling":{const p=2+Math.floor(Math.random()*2);for(let _=0;_<p;_++){const v=1-_*(.08+Math.random()*.07),w=.08+Math.random()*.1;h(m,y*v*1.18,y*v*.82,w),m+=w+.04+Math.random()*.06}break}case"trill":{const p=5+Math.floor(Math.random()*7),_=.028+Math.random()*.022;for(let v=0;v<p;v++){const w=v%2===0?1:1.09;h(m,y*w,y*w*1.05,_*.8),m+=_}break}case"pair":{const p=.07+Math.random()*.06;h(m,y,y*1.3,p),m+=p+.05+Math.random()*.04,h(m,y*1.28,y*1.05,p*1.2),m+=p*1.2;break}case"single":{const p=.22+Math.random()*.3;h(m,y*.95,y*1.12,p),m+=p;break}case"chatter":{const p=3+Math.floor(Math.random()*4);for(let _=0;_<p;_++){const v=.02+Math.random()*.02;h(m,y*.6,y*.5,v),m+=v+.02+Math.random()*.03}break}}return m};return{output:r,setActive(g){c=g,g&&(l=0)},update(g,y,m){if(!c)return;const p=e.currentTime;l<p&&(l=p+Math.random()*s),!(l>p+.2)&&(y.weather.strengthAt(m.x,m.z)<o?l=d(l)+(Math.random()<.34?.4+Math.random()*2.2:-Math.log(1-Math.random())*s):l=p+1.5)},dispose(){r.disconnect()}}}const Uc=8e3,HM=12,GM=7,VM=[{hz:1500,q:6,weight:.34},{hz:2800,q:7,weight:.42},{hz:5200,q:8,weight:.24}],WM=.6,XM=.3,YM=.2,R0=new WeakMap;function qM(i){const t=R0.get(i);if(t)return t;const e=Math.floor(Uc*HM),n=i.createBuffer(1,e,Uc),s=n.getChannelData(0),o=Math.exp(-2*Math.PI*GM/Uc);let r=0;for(let l=0;l<e;l++)r=o*r+(1-o)*(Math.random()*2-1),s[l]=r;const a=Math.min(1024,e/4|0);for(let l=0;l<a;l++){const h=l/a;s[l]=s[l]*h+s[e-a+l]*(1-h)}let c=0;for(let l=0;l<e;l++)c=Math.max(c,Math.abs(s[l]));if(c>0)for(let l=0;l<e;l++)s[l]/=c;return R0.set(i,n),n}function Hp(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("fire model built before the noise buffers were ready");const s=t.tone??1,o=t.crackle??1,r=t.draught??.35,a=e.createGain();a.gain.value=t.gain??.5;const c=e.createBiquadFilter();c.type="bandpass",c.frequency.value=110*s,c.Q.value=.9;const l=e.createGain();l.gain.value=0;const h=Sn(e,n.brown,c);c.connect(l).connect(a);const u=e.createGain();u.gain.value=0;const f=Sn(e,qM(e),u,.12);u.connect(l.gain);const d=e.createBiquadFilter();d.type="highpass",d.frequency.value=800*s,d.Q.value=.6;const g=e.createBiquadFilter();g.type="highshelf",g.frequency.value=4200,g.gain.value=-7;const y=e.createGain();y.gain.value=0;const m=Sn(e,n.white,d);d.connect(g).connect(y).connect(a);const p=e.createGain();p.gain.value=YM*o,p.connect(a);const _=Kh(e,VM,p,s);let v=t.intensity??.7,w=!0;const b=Pn(e),S=E=>{const T=Math.random()<.09,x=T?.45+Math.random()*.5:.06+Math.random()*.26,M=T?.006+Math.random()*.014:.0015+Math.random()*.005;Cn(e,n.white,_.pick(),E,x,M),T&&Ta(e,p,E,.16,95*s,42*s,.085,.004)};return{output:a,setIntensity(E){v=Math.min(1,Math.max(0,E))},setActive(E){w=E,E&&b.reset(),E||(l.gain.value=0,u.gain.value=0,y.gain.value=0)},update(E,T,x){if(!w)return;const M=e.currentTime,A=Math.min(1.35,v*(1+T.weather.strengthAt(x.x,x.z)*r)),P=WM*(.3+A*.7);l.gain.setTargetAtTime(P*.72,M,.4),u.gain.setTargetAtTime(P*.62,M,.4),c.frequency.setTargetAtTime((85+A*60)*s,M,.4),y.gain.setTargetAtTime(XM*(.15+A*.85),M,.3),d.frequency.setTargetAtTime((650+A*900)*s,M,.3),b.pump(S,gi(Math.max(.6,22*A*A)))},dispose(){h.stop(),m.stop(),f.stop(),u.disconnect(),_.dispose(),p.disconnect(),l.disconnect(),y.disconnect(),a.disconnect()}}}function Gp(i){return 3.26/Math.max(i,5e-5)}const $M=20,ZM=.28;function oa(i,t,e,n){const s=Gp(n.radius),o=n.cycles??$M,r=n.rise??ZM,a=o/s,c=i.createOscillator();c.type="sine",c.frequency.setValueAtTime(s,e),c.frequency.linearRampToValueAtTime(s*(1+r),e+a);const l=i.createGain();return l.gain.setValueAtTime(n.level,e),l.gain.exponentialRampToValueAtTime(n.level*.001,e+a),c.connect(l).connect(t),c.start(e),c.stop(e+a+.01),a}function ra(i,t){return i*Math.pow(t/i,Math.random())}const Fc={canopy:{channels:[{hz:900,q:2.4,weight:.42},{hz:1900,q:2.8,weight:.4},{hz:3600,q:3.2,weight:.18}],contact:[.004,.012],drop:.16,bedHz:1600,bedQ:.7,density:420},stone:{channels:[{hz:2400,q:5,weight:.34},{hz:4200,q:6,weight:.42},{hz:6800,q:7,weight:.24}],contact:[.0012,.004],drop:.26,bedHz:3200,bedQ:.55,density:300},earth:{channels:[{hz:420,q:1.8,weight:.5},{hz:780,q:2,weight:.36},{hz:1500,q:2.4,weight:.14}],contact:[.01,.028],drop:.14,bedHz:800,bedQ:.6,density:260},water:{channels:[{hz:1400,q:3,weight:.5},{hz:2600,q:3.5,weight:.5}],contact:[.002,.006],drop:.07,bedHz:2e3,bedQ:.6,density:240,bubbles:[4e-4,.0016]}};function Vp(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("rain model built before the noise buffers were ready");const s=t.tone??1,o=t.eaves??0;let r=Fc[t.surface??"canopy"];const a=r.bubbles,c=e.createGain();c.gain.value=t.gain??.5;const l=e.createGain();l.gain.value=0,l.connect(c);const h=Kh(e,r.channels,l,s),u=e.createBiquadFilter();u.type="bandpass",u.frequency.value=r.bedHz*s,u.Q.value=r.bedQ;const f=e.createGain();f.gain.value=0;const d=Sn(e,n.pink,u);u.connect(f).connect(c);let g=t.intensity??.5;const y=t.articulation??.35;let m=!0;const p=Pn(e),_=Pn(e),v=b=>{if(a){oa(e,l,b,{radius:ra(a[0],a[1]),level:r.drop*(.4+Math.random()*.6),cycles:13});return}const[S,E]=r.contact;Cn(e,n.white,h.pick(),b,r.drop*(.35+Math.random()*.65),S+Math.random()*(E-S))},w=b=>{oa(e,l,b,{radius:ra(.0022,.0065),level:.5+Math.random()*.5,cycles:22})};return{output:c,setIntensity(b){g=Math.min(1,Math.max(0,b))},setSurface(b){if(a)return;r=Fc[b];const S=e.currentTime;u.frequency.setTargetAtTime(r.bedHz*s,S,.25),u.Q.setTargetAtTime(r.bedQ,S,.25),h.setTone(r.bedHz/Fc.canopy.bedHz*s,S)},setActive(b){m=b,b?(p.reset(),_.reset()):(f.gain.value=0,l.gain.value=0)},update(b,S,E){if(!m)return;const T=e.currentTime,x=Math.min(1,g*(1+S.weather.strengthAt(E.x,E.z)*.22));if(x<.02){f.gain.setTargetAtTime(0,T,.6),l.gain.setTargetAtTime(0,T,.6),p.reset(),_.reset();return}f.gain.setTargetAtTime(x*.55,T,.6),u.frequency.setTargetAtTime(r.bedHz*s*(.7+x*.55),T,.6),l.gain.setTargetAtTime(y*(.2+x*.8),T,.6),p.pump(v,gi(Math.max(8,r.density*x*x))),o>0&&_.pump(w,gi(o*(.35+x*.65)),"oneGap")},dispose(){d.stop(),h.dispose(),l.disconnect(),f.disconnect(),c.disconnect()}}}const KM={brook:{rate:95,radius:[4e-4,.0026],cycles:15,bedHz:1500,bedQ:.75,bedLevel:.28,voice:.1},stream:{rate:62,radius:[9e-4,.005],cycles:18,bedHz:900,bedQ:.7,bedLevel:.36,voice:.13},fountain:{rate:150,radius:[5e-4,.0035],cycles:14,bedHz:2100,bedQ:.6,bedLevel:.34,voice:.09},cistern:{rate:.45,radius:[.003,.009],cycles:30,bedHz:260,bedQ:1.3,bedLevel:.02,voice:.62}};function Wp(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("water model built before the noise buffers were ready");const s=KM[t.flow??"brook"],o=t.tone??1,r=s.radius[0]/o,a=s.radius[1]/o,c=e.createGain();c.gain.value=t.gain??.5;const l=e.createGain();l.gain.value=1;const h=e.createBiquadFilter();h.type="highshelf",h.frequency.value=3e3,h.gain.value=-3,l.connect(h).connect(c);const u=e.createBiquadFilter();u.type="bandpass",u.frequency.value=s.bedHz*o,u.Q.value=s.bedQ;const f=e.createGain();f.gain.value=0;const d=Sn(e,n.pink,u);u.connect(f).connect(c);let g=t.rate??1,y=!0;const m=Pn(e),p=_=>{oa(e,l,_,{radius:ra(r,a),level:s.voice*(.3+Math.random()*.7),cycles:s.cycles*(.75+Math.random()*.5)})};return{output:c,get voiceHz(){return Gp(Math.sqrt(r*a))},setRate(_){g=Math.min(1,Math.max(0,_))},setActive(_){y=_,_?m.reset():f.gain.value=0},update(_){if(!y)return;const v=e.currentTime;if(f.gain.setTargetAtTime(s.bedLevel*g,v,.5),u.frequency.setTargetAtTime(s.bedHz*o*(.75+g*.4),v,.5),g<.02){m.reset();return}m.pump(p,gi(s.rate*g))},dispose(){d.stop(),h.disconnect(),l.disconnect(),f.disconnect(),c.disconnect()}}}function Xp(i,t,e){const n=i.createGain(),s=t.map(r=>{const a=i.createBiquadFilter();a.type="bandpass",a.frequency.value=r.hz,a.Q.value=r.q;const c=i.createGain();return c.gain.value=r.level,n.connect(a).connect(c).connect(e),{filter:a,level:c}}),o=t.map(r=>({...r}));return{input:n,shape(r,a,c=0){for(let l=0;l<s.length;l++){const h=r[l];if(!h)continue;const{filter:u,level:f}=s[l];c<=0?(u.frequency.setValueAtTime(h.hz,a),f.gain.setValueAtTime(h.level,a)):(u.frequency.setValueAtTime(o[l].hz,a),u.frequency.exponentialRampToValueAtTime(Math.max(h.hz,20),a+c),f.gain.setValueAtTime(o[l].level,a),f.gain.linearRampToValueAtTime(h.level,a+c)),u.Q.setValueAtTime(h.q,a),o[l]={...h}}},dispose(){n.disconnect();for(const{filter:r,level:a}of s)r.disconnect(),a.disconnect()}}}const io={a:[{hz:730,q:8,level:1},{hz:1090,q:10,level:.5},{hz:2440,q:14,level:.25}],e:[{hz:530,q:7,level:1},{hz:1840,q:12,level:.45},{hz:2480,q:15,level:.22}],i:[{hz:270,q:5,level:1},{hz:2290,q:14,level:.4},{hz:3010,q:17,level:.2}],o:[{hz:570,q:7,level:1},{hz:840,q:8,level:.55},{hz:2410,q:15,level:.16}],u:[{hz:300,q:5,level:1},{hz:870,q:8,level:.4},{hz:2240,q:14,level:.12}]},Oc=[io.a,io.e,io.i,io.o,io.u];function Yp(i,t={}){const e=i.context,n=Math.max(1,Math.min(10,t.voices??6)),s=Math.min(.95,Math.max(.05,t.density??.45)),o=t.pitch??135,r=t.variety??.5,a=e.createGain();a.gain.value=t.gain??.5;const c=e.createBiquadFilter();c.type="lowpass",c.frequency.value=t.distance??1700,c.Q.value=.6,c.connect(a);const l=[];for(let d=0;d<n;d++){const g=n===1?0:d/(n-1)*2-1,y=1+g*r*.35+(Math.random()*2-1)*.05,m=o*(1-g*r*.4)*(.95+Math.random()*.1),p=e.createGain();p.gain.value=.85/Math.sqrt(n),p.connect(c);const _=Xp(e,Oc[0].map(b=>({...b,hz:b.hz*y})),p),v=e.createGain();v.gain.value=0,v.connect(_.input);const w=e.createOscillator();w.type="sawtooth",w.frequency.value=m,w.connect(v),w.start(),l.push({osc:w,envelope:v,bank:_,clock:Pn(e),length:.2,left:0,pitch:m,tract:y})}let h=!0;const u=(d,g)=>d.map(y=>({...y,hz:y.hz*g})),f=(d,g)=>{const y=.12+Math.random()*.14;d.length=y,d.left--;const m=d.left>=4,p=d.pitch*(m?1.1:.9+Math.random()*.2);d.osc.frequency.setTargetAtTime(p,g,y*.6);const _=.55+Math.random()*.45,v=y*.22;d.envelope.gain.setValueAtTime(0,g),d.envelope.gain.linearRampToValueAtTime(_,g+v),d.envelope.gain.linearRampToValueAtTime(_*.75,g+y*.75),d.envelope.gain.setTargetAtTime(0,g+y*.75,y*.12);const w=Oc[Math.random()*Oc.length|0];d.bank.shape(u(w,d.tract),g,y*.8)};return{output:a,setActive(d){if(h=d,d)for(const g of l)g.clock.reset();else for(const g of l)g.envelope.gain.value=0},update(){if(h)for(const d of l)d.clock.pump(g=>f(d,g),()=>{if(d.left>0)return d.length+.015+Math.random()*.06;d.left=3+Math.floor(Math.random()*6);const g=(1-s)*5.5;return d.length+.35+Math.random()*(.6+g)},"immediate")},dispose(){for(const d of l){try{d.osc.stop()}catch{}d.osc.disconnect(),d.envelope.disconnect(),d.bank.dispose()}l.length=0,c.disconnect(),a.disconnect()}}}const jM="modulepreload",JM=function(i,t){return new URL(i,t).href},C0={},aa=function(t,e,n){let s=Promise.resolve();if(e&&e.length>0){const r=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),c=a?.nonce||a?.getAttribute("nonce");s=Promise.allSettled(e.map(l=>{if(l=JM(l,n),l in C0)return;C0[l]=!0;const h=l.endsWith(".css"),u=h?'[rel="stylesheet"]':"";if(!!n)for(let g=r.length-1;g>=0;g--){const y=r[g];if(y.href===l&&(!h||y.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${l}"]${u}`))return;const d=document.createElement("link");if(d.rel=h?"stylesheet":jM,h||(d.as="script"),d.crossOrigin="",d.href=l,c&&d.setAttribute("nonce",c),document.head.appendChild(d),h)return new Promise((g,y)=>{d.addEventListener("load",g),d.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${l}`)))})}))}function o(r){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=r,window.dispatchEvent(a),!a.defaultPrevented)throw r}return s.then(r=>{for(const a of r||[])a.status==="rejected"&&o(a.reason);return t().catch(o)})};async function QM(i){try{const[{createFaustNode:t},{frictionMeta:e,frictionUrl:n}]=await Promise.all([aa(()=>Promise.resolve().then(()=>Np),void 0,import.meta.url),aa(()=>import("./friction-COj10vMJ.js"),[],import.meta.url)]);return await t(i,n,e)}catch(t){return console.warn("friction: faust tier unavailable — using the event fallback",t),null}}const P0=.42,tb=.08,I0=.4;function qp(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("friction model built before the noise buffers were ready");const s=t.force??.55,o=t.pitch??180,r=t.decay??.5,a=t.bright??.5,c=t.roughness??.4,l=t.motion??"cycle",h=t.speed??.3,u=e.createGain();u.gain.value=t.gain??.5;const f=e.createGain();f.gain.value=1,f.connect(u);const d=e.createGain();d.gain.value=0,d.connect(u);const g=e.createGain();g.connect(f);const y=22+a*22,m=Ns(e,[{hz:o,decay:r,level:1,q:y},{hz:o*2.41,decay:r*.7,level:.12+.55*a,q:y*.8},{hz:o*4.17,decay:r*.45,level:.06+.32*a,q:y*.6},{hz:o*6.83,decay:r*.3,level:.03+.18*a,q:y*.5}],g,{ring:"excitation"}),p=e.createBufferSource();p.buffer=n.pink,p.loop=!0;const _=e.createBiquadFilter();_.type="bandpass",_.frequency.value=o*1.6,_.Q.value=3.5;const v=e.createGain();v.gain.value=0,p.connect(_).connect(v).connect(f),p.start();const w=Pn(e);let b=0,S=l==="steady"?h:0,E=s,T=null,x=!0,M=1+Math.random()*4,A=!1,P=h,C=.8,F=Math.random(),N=null,D=!1;const B=QM(e).then(V=>{if(!V)return;if(D){V.dispose();return}N=V,V.node.connect(d),V.set("force",s),V.set("pitch",o),V.set("decay",r),V.set("bright",a),V.set("roughness",c),V.set("gain",.7),V.set("speed",b);const et=e.currentTime;d.gain.setTargetAtTime(1,et,I0/3),f.gain.setTargetAtTime(0,et,I0/3)});function H(V){if(M-=V,M<=0&&(A=!A,M=A?2+Math.random()*5:5+Math.random()*14,P=h*(.6+Math.random()*.7),C=.55+Math.random()*.65,F=0),!A){S=0;return}F+=V*C,S=P*Math.max(0,Math.sin(F*Math.PI*2))**.55}return{output:u,ready:B,setSpeed(V){T=Math.max(0,Math.min(1,V))},setForce(V){E=Math.max(0,Math.min(1,V)),N?.set("force",E)},get usingFaust(){return N!==null},get loop(){return N},get currentSpeed(){return b},update(V,et,lt){if(!x)return;if(T!==null)S=T,T=null;else if(l==="cycle")H(V);else if(l==="weather"){const rt=Math.max(0,et.weather.strengthAt(lt.x,lt.z)-P0);S=Math.min(1,(rt/(1-P0))**1.6)*h}if(b+=(S-b)*Math.min(1,V/tb),N?.set("speed",b),N)return;const Mt=e.currentTime;if(b<.01){v.gain.setTargetAtTime(0,Mt,.2),w.reset();return}v.gain.setTargetAtTime(.022*E*b**.7,Mt,.12);const Lt=2+b*26,J=E*.5*(.3+.7/(1+b*6));w.pump(rt=>{const K=.7+Math.random()*.6;for(const q of m.inputs)Cn(e,n.white,q,rt,J*K,.003)},gi(Lt),"immediate")},setActive(V){x=V,V||(v.gain.setTargetAtTime(0,e.currentTime,.1),w.reset(),N?.set("speed",0),b=0)},dispose(){D=!0,p.stop(),p.disconnect(),_.disconnect(),v.disconnect(),m.dispose(),g.disconnect(),N?.dispose(),d.disconnect(),f.disconnect(),u.disconnect()}}}const eb=7,L0=.3,D0=.4;async function nb(i){try{const[{createFaustNode:t},{waveguideMeta:e,waveguideUrl:n}]=await Promise.all([aa(()=>Promise.resolve().then(()=>Np),void 0,import.meta.url),aa(()=>import("./waveguide-DEcBmVT0.js"),[],import.meta.url)]);return await t(i,n,e)}catch(t){return console.warn("waveguide: faust tier unavailable — using the modal fallback",t),null}}function $p(i,t={}){const e=i.context,n=i.noise;if(n===null)throw new Error("waveguide built before the noise buffers were ready");const s=n.white,o=t.pitch??440,r=t.decay??2,a=t.bright??.5,c=t.closed??!1,l=t.place??.22,h=t.excite??"chime",u=t.drive??.5,f=t.weather??!1,d=e.createGain();d.gain.value=(t.gain??.5)*3.2;const g=e.createGain();g.gain.value=0,g.connect(d);const y=e.createGain();y.gain.value=1,y.connect(d);const m=e.createGain();m.gain.value=1;const p=e.createBufferSource();p.buffer=s,p.loop=!0;const _=e.createBiquadFilter();_.type="bandpass",_.frequency.value=o*(c?.5:1),_.Q.value=.9;const v=e.createGain();v.gain.value=0,p.connect(_).connect(v).connect(m),p.start();const w=c?o*.5:o,S=Ns(e,(c?[1,3,5,7]:[1,2,3,4]).map((C,F)=>({hz:w*C,decay:r/(1+F*.6),level:(.2+a*.8)**F,q:60+a*60})),y,{ring:"filter",maxQ:200});for(const C of S.inputs)m.connect(C);const E=Pn(e);let T=null,x=!1,M=!0;const A=nb(e).then(C=>{if(!C)return;if(x){C.dispose();return}T=C,m.connect(C.node),C.node.connect(g),C.set("pitch",o),C.set("decay",r),C.set("bright",a),C.set("closed",c?1:0),C.set("place",l),C.set("gain",.7);const F=e.currentTime;g.gain.setTargetAtTime(1,F,D0/3),y.gain.setTargetAtTime(0,F,D0/3)});function P(C,F){Cn(e,s,m,C,F*.5,.0016)}return{output:d,ready:A,get loop(){return T},get usingFaust(){return T!==null},strike(C=1){P(e.currentTime+.02,C)},update(C,F,N){if(!M)return;const D=Math.max(0,F.weather.strengthAt(N.x,N.z)-L0)/(1-L0),B=f?u*D**2:u,H=e.currentTime;if(h==="breath"){v.gain.setTargetAtTime(B*.09,H,.25);return}if(v.gain.setTargetAtTime(0,H,.25),B<.02){E.reset();return}E.pump(V=>P(V,.35+Math.random()*.65),gi(eb*B),"oneGap")},setActive(C){M=C,C||(v.gain.setTargetAtTime(0,e.currentTime,.1),E.reset())},dispose(){x=!0,p.stop(),p.disconnect(),_.disconnect(),v.disconnect(),S.dispose(),m.disconnect(),T?.dispose(),g.disconnect(),y.disconnect(),d.disconnect()}}}function ib(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("drip built before the noise buffers were ready");const s=t.radius??[.0018,.0032],o=t.cycles??30,r=t.tick??.35,a=e.createGain();a.gain.value=t.gain??.5;const c=e.createBiquadFilter();return c.type="bandpass",c.frequency.value=3800,c.Q.value=3,c.connect(a),{output:a,fire(l,h){return Cn(e,n.white,c,l,h*r,.0016),oa(e,a,l+.0015,{radius:ra(s[0],s[1]),level:h*.55,cycles:o*(.85+Math.random()*.3),rise:.34})+.02},dispose(){c.disconnect(),a.disconnect()}}}const sb=[{ratio:.5,decay:1,level:.5},{ratio:1,decay:.72,level:.85},{ratio:1.2,decay:.55,level:.7},{ratio:1.5,decay:.42,level:.45},{ratio:2,decay:.35,level:1},{ratio:2.5,decay:.2,level:.3},{ratio:2.67,decay:.17,level:.26},{ratio:3,decay:.13,level:.22},{ratio:4,decay:.09,level:.16},{ratio:5.33,decay:.06,level:.1},{ratio:6.4,decay:.04,level:.07}];function ob(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("bell built before the noise buffers were ready");const s=t.hz??168,o=t.decay??14,r=t.strike??.4,a=t.warble??1,c=Math.max(1,t.strokes??1),l=t.interval??2.4,h=e.createGain();h.gain.value=t.gain??.5;const u=e.createBiquadFilter();u.type="bandpass",u.frequency.value=s*9,u.Q.value=1.6,u.connect(h);const f=(g,y,m,p,_)=>{const v=e.createOscillator();v.type="sine",v.frequency.value=s*y,v.detune.value=_;const w=e.createGain();w.gain.setValueAtTime(p,g),w.gain.exponentialRampToValueAtTime(p*5e-4,g+m),v.connect(w).connect(h),v.start(g),v.stop(g+m+.02)},d=(g,y)=>{Cn(e,n.white,u,g,y*r,.004);let m=0;for(const p of sb){const _=y*p.level*.14*(.85+Math.random()*.3),v=o*p.decay*(.9+Math.random()*.2),w=a*p.ratio*1.6;f(g,p.ratio,v,_,-w),f(g,p.ratio,v,_,w),m=Math.max(m,v)}return m};return{output:h,fire(g,y){let m=0;for(let p=0;p<c;p++){const _=g+p*l*(1+(Math.random()*2-1)*.02);m=_-g+d(_,y*(p===0?1:.9))}return m},dispose(){u.disconnect(),h.disconnect()}}}const N0=[{hz:512,decay:.3,level:.4},{hz:1183,decay:.85,level:.72},{hz:1794,decay:1.15,level:1},{hz:2741,decay:.7,level:.5},{hz:4310,decay:.4,level:.28}];function rb(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("hammer built before the noise buffers were ready");const s=t.tone??1,o=Math.min(.9,Math.max(0,t.damping??.3)),r=t.bounces??2,a=e.createGain();a.gain.value=t.gain??.7;const c=Ns(e,N0.map(h=>({hz:h.hz*s,decay:h.decay*(1-o),level:h.level})),a),l=(h,u,f)=>{const d=f?.0022:.0035;c.inputs.forEach((g,y)=>{Cn(e,n.white,g,h,u*N0[y].level,d)}),Ta(e,a,h,u*(f?.5:.16),165*s,62*s,.075,.003)};return{output:a,fire(h,u){l(h,u,!0);let f=.13+Math.random()*.05,d=u*.3;for(let g=0;g<r;g++)l(h+f,d*(.7+Math.random()*.5),!1),f+=(.13+Math.random()*.05)*Math.pow(.66,g+1),d*=.5;return f+1.3*(1-o)+.2},dispose(){c.dispose(),a.disconnect()}}}const ab={wood:{count:9,over:.34,energyDecay:.13,hz:380,q:2.1,level:.5,thumpHz:120},pot:{count:7,over:.28,energyDecay:.1,hz:950,q:4.2,level:.42,thumpHz:175},metal:{count:11,over:.42,energyDecay:.16,hz:1750,q:5.5,level:.4,thumpHz:210},stone:{count:6,over:.22,energyDecay:.07,hz:640,q:1.6,level:.55,thumpHz:95}};function cb(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("clatter built before the noise buffers were ready");const s=ab[t.material??"wood"],o=t.tone??1,r=t.heft??.5,a=e.createGain();a.gain.value=t.gain??.6;const c={...s,hz:s.hz*o,count:t.pieces??s.count},l=Cp(e,c,a);return{output:a,fire(h,u){return Cn(e,n.white,l.input,h,u*1.4,.012+Math.random()*.01),Ta(e,a,h,u*r*.55,s.thumpHz*o,s.thumpHz*o*.45,.08,.004),Pp(e,n.white,l.input,c,h+.02,u),c.over*1.4+.15},dispose(){l.dispose(),a.disconnect()}}}const lb={dog:{f0:[440,235],onset:.62,syllables:[2,4],length:[.085,.135],gap:[.2,.34],attack:.06,rasp:.34,open:[{hz:880,q:6,level:1},{hz:1620,q:9,level:.55},{hz:3100,q:12,level:.3}],close:[{hz:520,q:7,level:.7},{hz:1180,q:8,level:.3},{hz:2600,q:12,level:.12}],variance:.14},sheep:{f0:[355,300],onset:.82,syllables:[1,2],length:[.55,1.05],gap:[.35,.6],attack:.14,rasp:.22,open:[{hz:620,q:7,level:1},{hz:1720,q:11,level:.42},{hz:2650,q:14,level:.18}],close:[{hz:700,q:7,level:.9},{hz:1500,q:10,level:.3},{hz:2600,q:14,level:.12}],vibrato:{hz:13,cents:105},variance:.1},cow:{f0:[168,108],onset:.72,syllables:[1,1],length:[1.1,1.8],gap:[.5,.8],attack:.22,rasp:.16,open:[{hz:390,q:6,level:1},{hz:800,q:8,level:.5},{hz:1900,q:12,level:.14}],close:[{hz:330,q:6,level:.85},{hz:720,q:8,level:.3},{hz:1750,q:12,level:.08}],vibrato:{hz:5.5,cents:35},variance:.08},fowl:{f0:[880,620],onset:.7,syllables:[3,6],length:[.045,.085],gap:[.09,.21],attack:.12,rasp:.55,open:[{hz:1450,q:8,level:1},{hz:2700,q:11,level:.5},{hz:4200,q:14,level:.22}],close:[{hz:1150,q:8,level:.6},{hz:2400,q:11,level:.25},{hz:3900,q:14,level:.1}],variance:.16}};function zc(i){return i[0]+Math.random()*(i[1]-i[0])}function U0(i,t){return i.map(e=>({...e,hz:e.hz*t}))}function hb(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("animal built before the noise buffers were ready");const s=lb[t.kind??"dog"],o=t.tone??1,r=Math.min(1,(t.rasp??0)+s.rasp),a=e.createGain();a.gain.value=t.gain??.6;const c=U0(s.open,o),l=U0(s.close,o),h=Xp(e,c,a),u=[];let f=0;const d=(y,m,p,_)=>{const v=e.createGain();v.connect(h.input);const w=e.createOscillator();w.type="sawtooth";const b=_,S=b*s.onset,E=m*s.attack;w.frequency.setValueAtTime(S,y),w.frequency.exponentialRampToValueAtTime(b,y+E),w.frequency.exponentialRampToValueAtTime(Math.max(b*(s.f0[1]/s.f0[0]),20),y+m),w.connect(v),w.start(y);let T=null;if(s.vibrato){T=e.createOscillator(),T.frequency.value=s.vibrato.hz*(.85+Math.random()*.3);const P=e.createGain();P.gain.value=s.vibrato.cents,T.connect(P).connect(w.detune),T.start(y),u.push(P)}let x=null;if(r>.01){x=e.createBufferSource(),x.buffer=n.white,x.playbackRate.value=.8+Math.random()*.5;const P=e.createGain();P.gain.value=r*.55,x.connect(P).connect(v),x.start(y,Math.random()*Math.max(n.white.duration-2,0)),u.push(P)}const M=Math.max(.02,m*.28);v.gain.setValueAtTime(0,y),v.gain.linearRampToValueAtTime(p,y+E),v.gain.linearRampToValueAtTime(p*.62,y+m-M),v.gain.setTargetAtTime(0,y+m-M,M/3);const A=y+m+M*3;w.stop(A),T?.stop(A),x?.stop(A),u.push(v),f=Math.max(f,A),h.shape(c,y,E),h.shape(l,y+m*.55,m*.45)};let g=0;return{output:a,fire(y,m){f=y;const p=Math.round(zc(s.syllables)),_=s.f0[0]*o*(1+(Math.random()*2-1)*s.variance);let v=y;for(let b=0;b<p;b++){const S=zc(s.length);d(v,S,m*Math.pow(.86,b)*(.85+Math.random()*.3),_),v+=S+zc(s.gap)}const w=f-y;return window.clearTimeout(g),g=window.setTimeout(()=>{for(const b of u)b.disconnect();u.length=0},(w+.4)*1e3),w},dispose(){window.clearTimeout(g);for(const y of u)y.disconnect();u.length=0,h.dispose(),a.disconnect()}}}function Zp(i,t){switch(t.sound){case"hammer":return rb(i,t.options);case"clatter":return cb(i,t.options);case"animal":return hb(i,t.options);case"drip":return ib(i,t.options);case"bell":return ob(i,t.options)}}const ub=[5,.4,5];class db{context;voices=[];clock;centre=new R;spread=new R;force;gap;active=!0;constructor(t,e){this.context=t.context,this.centre.set(...e.at),this.spread.set(...e.spread??ub),this.force=e.force??[.55,1];const n=Math.max(e.every,.05);this.gap=e.rhythm==="periodic"?Op(n,.09):gi(1/n),this.clock=Pn(t.context);const s=Math.max(1,e.voices??2);for(let o=0;o<s;o++){const r=Zp(t,e);this.voices.push({shot:r,busyUntil:0,emitter:new Up(t,r,{position:this.centre,refDistance:e.refDistance,maxDistance:e.maxDistance,rolloff:e.rolloff,reverb:e.reverb,importance:e.importance,ignoreAbsorption:e.ignoreAbsorption,ignoreOcclusion:e.ignoreOcclusion,invertDistance:e.invertDistance})})}}setActive(t){if(t!==this.active){this.active=t,t&&this.clock.reset();for(const e of this.voices)e.emitter.enabled=t}}update(t,e,n){for(const s of this.voices)s.emitter.update(t,e,n);if(this.active){if(this.voices.every(s=>s.emitter.isVirtual)){this.clock.reset();return}this.clock.pump(s=>this.fire(s),this.gap,"oneGap")}}fire(t){const e=this.voices.find(r=>r.busyUntil<=t);if(!e||e.emitter.isVirtual)return;F0.set(this.centre.x+(Math.random()*2-1)*this.spread.x,this.centre.y+(Math.random()*2-1)*this.spread.y,this.centre.z+(Math.random()*2-1)*this.spread.z),e.emitter.moveTo(F0);const[n,s]=this.force,o=e.shot.fire(t,n+Math.random()*(s-n));e.busyUntil=t+o}trigger(){this.fire(this.context.currentTime+.02)}get shots(){return this.voices.map(t=>t.shot)}get voiceCount(){return this.voices.length}dispose(){for(const t of this.voices)t.emitter.dispose();this.voices.length=0}}const F0=new R,Kp={};function O0(i,t){switch(t.model){case"wind":return Fp(i,t.options);case"foliage":return zp(i,t.options);case"machine":return kp(i,t.options);case"bird":return Bp(i,t.options);case"fire":return Hp(i,t.options);case"rain":return Vp(i,t.options);case"water":return Wp(i,t.options);case"crowd":return Yp(i,t.options);case"friction":return qp(i,t.options);case"waveguide":return $p(i,t.options)}}class fb{engine;emitters=[];models=new Map;emitterById=new Map;fields=new Map;beds=[];bedBus=null;scatter=[];active=!0;constructor(t,e){this.engine=t;const n=e.bed?Array.isArray(e.bed)?e.bed:[e.bed]:[];if(n.length>0){const s=t.context.createGain();s.connect(t.dry),this.bedBus=s;for(const o of n){const r=O0(t,o),a=t.context.createGain();a.gain.value=o.gain??1,r.output.connect(a).connect(s),this.beds.push(r),o.id&&this.models.set(o.id,r)}}for(const s of e.emitters??[]){const o=O0(t,s);s.id&&this.models.set(s.id,o);const r=new Up(t,o,{position:new R(...s.at),refDistance:s.refDistance,maxDistance:s.maxDistance,rolloff:s.rolloff,reverb:s.reverb,importance:s.importance,ignoreAbsorption:s.ignoreAbsorption,ignoreOcclusion:s.ignoreOcclusion,invertDistance:s.invertDistance});this.emitters.push(r),s.id&&this.emitterById.set(s.id,r)}for(const s of e.scatter??[]){const o=new db(t,s);this.scatter.push(o),s.id&&this.fields.set(s.id,o)}}setActive(t){if(t!==this.active){this.active=t;for(const e of this.emitters)e.enabled=t;for(const e of this.scatter)e.setActive(t);this.bedBus?.gain.setTargetAtTime(t?1:0,this.engine.context.currentTime,.15)}}setBedLevel(t,e=.35){!this.bedBus||!this.active||this.bedBus.gain.setTargetAtTime(t,this.engine.context.currentTime,e)}update(t,e,n){if(this.active){for(const s of this.beds)s.update?.(t,this.engine,this.engine.listenerPosition);for(const s of this.emitters)s.update(t,e,n);for(const s of this.scatter)s.update(t,e,n)}}find(t){return this.models.get(t)??null}findField(t){return this.fields.get(t)??null}setSolo(t){if(this.active){for(const[e,n]of this.emitterById)n.enabled=t===null||e===t;for(const[e,n]of this.fields)n.setActive(t===null||e===t)}}get emitterCount(){return this.emitters.length+this.scatter.reduce((t,e)=>t+e.voiceCount,0)}get occludedCount(){return this.emitters.filter(t=>t.isOccluded).length}dispose(){for(const t of this.emitters)t.dispose();this.emitters.length=0,this.emitterById.clear();for(const t of this.scatter)t.dispose();this.scatter.length=0,this.fields.clear();for(const t of this.beds)t.dispose();this.beds.length=0,this.bedBus?.disconnect(),this.models.clear()}}const Aa={sky:!0,fogColor:"#bcd4e6",fogNear:25,fogFar:140,sunIntensity:2.2,sunColor:16773848,fillIntensity:1.15,fillColor:14735040,ambientIntensity:1.8,ambientSky:10339560,ambientGround:9076584,room:"open",surface:"earth",footstepReverb:.7,soundscape:{bed:{model:"wind",id:"wind",options:{gain:.17,tone:3400}}}},ca={sky:!1,fogColor:"#0d0f12",fogNear:6,fogFar:34,sunIntensity:1.1,sunColor:16770748,fillIntensity:.75,fillColor:9412792,ambientIntensity:2.1,ambientSky:9078390,ambientGround:4867130,room:"cell",surface:"wood",footstepReverb:.5,soundscape:Kp},pb=.12;class mb{definition;group=null;constructor(t){this.definition=t}get id(){return this.definition.id}get name(){return this.definition.name}get environment(){return this.definition.environment}get spawn(){return this.definition.spawn}get floor(){return this.definition.floor??-20}settle(t){const e=this.definition.groundAt;if(!e)return t;const n=t.position.clone();return n.y=e(n.x,n.z)+pb,{position:n,yaw:t.yaw}}root(){return this.group===null&&(this.group=this.definition.build(),this.group.name=`zone:${this.definition.id}`,this.group.updateWorldMatrix(!0,!0)),this.group}get isBuilt(){return this.group!==null}dispose(){this.group!==null&&(this.group.traverse(t=>{(t instanceof ie||t instanceof zh||t instanceof rp)&&t.geometry.dispose()}),this.group.clear(),this.group=null)}}const gb=1.15;function yb(i,t=new R){return t.set(Math.sin(i),0,Math.cos(i))}function vb(i){if(i.arrival)return{position:i.arrival.position.clone(),yaw:i.arrival.yaw};const t=yb(i.yaw);return{position:i.position.clone().addScaledVector(t,gb),yaw:i.yaw+Math.PI}}class _b{byZone=new Map;byDoor=new Map;add(t,e){this.addSide(t.id,t.a,t.b,e),this.addSide(t.id,t.b,t.a,e)}addSide(t,e,n,s){const o={portal:t,end:e,target:n,arrival:vb(n),door:null,title:"Door",label:e.label??s(n.zone)},r=this.byZone.get(e.zone);r?r.push(o):this.byZone.set(e.zone,[o])}in(t){return this.byZone.get(t)??[]}bind(t,e,n){t.door=e,t.title=n,e.userData.portal=t,this.byDoor.set(e,t)}unbind(t){t.door&&this.byDoor.delete(t.door),t.door=null}sideOf(t){let e=t;for(;e;){const n=this.byDoor.get(e);if(n)return n;e=e.parent}return null}all(){return[...this.byZone.values()].flat()}}function wb(i,t,e){const n=new Set([t]);let s=[t];for(let o=0;o<e;o++){const r=[];for(const a of s)for(const c of i.in(a)){const l=c.target.zone;n.has(l)||(n.add(l),r.push(l))}if(r.length===0)break;s=r}return n}const xb=2,Mb=3.2,bb=.15;function Sb(i,t){return i.userData.label=t,i}function Eb(i){for(let t=i;t;t=t.parent){const e=t.userData.label;if(typeof e=="string")return e}return null}class Tb{reach=Mb;raycaster=new kx;targets=[];constructor(){this.raycaster.far=this.reach}setTargets(t){this.targets=t}get targetCount(){return this.targets.length}probe(t,e){if(this.targets.length===0)return null;t.updateWorldMatrix(!0,!1),kc.setFromMatrixPosition(t.matrixWorld),Bc.set(0,0,-1).applyQuaternion(t.getWorldQuaternion(Ab)),this.raycaster.far=this.reach,this.raycaster.set(kc,Bc);const n=this.raycaster.intersectObjects(this.targets,!0);if(n.length===0)return null;const s=n[0],o=e.raycast(kc,Bc);return o!==null&&o<s.distance-bb?null:{object:s.object,distance:s.distance}}}const kc=new R,Bc=new R,Ab=new jn;function xt(i){let t=i>>>0||2654435769;t=Math.imul(t^t>>>16,73244475),t=Math.imul(t^t>>>16,73244475),t=(t^t>>>16)>>>0;const e=()=>{t=t+1831565813>>>0;let s=t;return s=Math.imul(s^s>>>15,s|1),s^=s+Math.imul(s^s>>>7,s|61),((s^s>>>14)>>>0)/4294967296},n=e;return n.range=(s,o)=>s+e()*(o-s),n.int=(s,o)=>Math.floor(s+e()*(o-s+1)),n.chance=s=>e()<s,n.pick=s=>s[Math.floor(e()*s.length)],n.around=(s,o)=>s+(e()*2-1)*o,n}const I={BARK:4602672,BARK_PALE:5720636,LEAF:5201977,LEAF_DARK:4017196,LEAF_DRY:7039548,GRASS:6056762,GRASS_DRY:8025156,STONE:9869984,STONE_DARK:7699072,STONE_PALE:11449014,EARTH:4998454,TIMBER:9073506,TIMBER_DARK:7035469,TIMBER_PALE:11047798,IRON:5922659,IRON_DARK:4146248,RUST:8014384,BRONZE:9072696,PATINA:6058080,WATER:2899782,LAMPLIGHT:16769192,CLOTH:9274994,SKIN:11047546,HIDE:7165505,HIDE_DARK:4273193,HIDE_PALE:10653813,WOOL:12433060,HOG:11042938,FOWL:10260343,COMB:10240564,MARKER_YELLOW:13213770,COW_BLACK:2367775};function U(i,t){const e=Math.min(255,Math.round((i>>16&255)*t)),n=Math.min(255,Math.round((i>>8&255)*t)),s=Math.min(255,Math.round((i&255)*t));return e<<16|n<<8|s}const Rb={timber:{leaf:I.TIMBER,ledge:I.TIMBER_DARK,iron:I.IRON,frame:I.STONE_DARK},iron:{leaf:I.IRON,ledge:I.STONE_DARK,iron:I.RUST,frame:I.STONE},plank:{leaf:I.TIMBER_PALE,ledge:I.TIMBER,iron:I.RUST,frame:I.TIMBER_DARK}},Cb=["timber","iron","plank"],Pb={timber:"Wooden Door",iron:"Iron Door",plank:"Plank Door"};function Ib(i){return Pb[i]}function z0(i){return i.userData.door}function jp(i={}){const{seed:t=1,scale:e=1}=i,n=xt(t),s=[],o=i.material??n.pick(Cb),r=Rb[o],a=n.range(.94,1.16),c=n.range(2,2.28),l=n.range(.07,.1),h=n.range(.13,.18),u=l*2.4;for(const x of[-1,1]){const M=new G(h,c+h,u);M.translate(x*(a+h)/2,(c+h)/2,-u*.18),s.push({geometry:M,color:r.frame,sway:0})}const f=new G(a+h*2.6,h,u*1.1);if(f.translate(0,c+h/2,-u*.18),s.push({geometry:f,color:r.frame,sway:0}),n.chance(.55)){const x=new G(a+h*2.2,.06,u*1.5);x.translate(0,.03,-u*.1),s.push({geometry:x,color:r.frame,sway:0})}const d=new G(a,c,.02);d.translate(0,c/2,-l*.5),s.push({geometry:d,color:1316378,sway:0});const g=n.int(4,6),y=a/g;for(let x=0;x<g;x++){const M=l*n.range(.88,1),A=new G(y*.94,c*n.range(.985,1),M);A.translate(-a/2+y*(x+.5),c/2,M/2),s.push({geometry:A,color:r.leaf,sway:0})}const m=n.chance(.4)?[c*.16,c*.52,c*.87]:[c*.18,c*.82],p=l*.42;for(const x of m){const M=new G(a*.96,n.range(.1,.15),p);M.translate(0,x,l+p/2),s.push({geometry:M,color:r.ledge,sway:0})}const _=n.chance(.5)?-1:1,v=p*.5;for(const x of[m[0],m[m.length-1]]){const M=a*n.range(.45,.7),A=new G(M,.055,v);A.translate(_*(a/2-M/2),x,l+p+v/2),s.push({geometry:A,color:r.iron,sway:0});const P=new G(.07,.09,v*2.2);P.translate(_*(a/2+.02),x,l+v),s.push({geometry:P,color:r.iron,sway:0})}const w=-_*a*n.range(.3,.36),b=c*n.range(.44,.5);if(n.chance(.5)){const x=new Z(.062,.062,.02,8);x.rotateX(Math.PI/2),x.translate(w,b,l+.01),s.push({geometry:x,color:r.iron,sway:0});const M=new Z(.022,.026,.05,6);M.rotateX(Math.PI/2),M.translate(w,b,l+.043),s.push({geometry:M,color:r.iron,sway:0});const A=new ee(.052,0);A.scale(1,1,.78),A.translate(w,b,l+.095),s.push({geometry:A,color:r.iron,sway:0})}else{const x=new G(.045,.2,.045);x.translate(w,b,l+.055),s.push({geometry:x,color:r.iron,sway:0});for(const M of[-.09,.09]){const A=new G(.05,.05,.05);A.translate(w,b+M,l+.025),s.push({geometry:A,color:r.iron,sway:0})}}const S=vt(s);e!==1&&S.scale(e,e,e);const E=bt(S,"door",0),T={width:(a+h*2)*e,height:(c+h)*e,depth:(l+p+v)*e,material:o};return E.userData.door=T,E}const Lb={name:"door",category:"structures",radius:.9,build:jp};function k0(){return new Promise(i=>{requestAnimationFrame(()=>requestAnimationFrame(()=>i()))})}class Db{root;bar;label;shown=!1;constructor(t){this.root=document.createElement("div"),this.root.id="building";const e=document.createElement("div");e.className="loading-track",this.bar=document.createElement("div"),this.bar.className="loading-bar",e.appendChild(this.bar),this.label=document.createElement("div"),this.label.className="loading-label",this.root.append(e,this.label),t.appendChild(this.root)}async show(t){this.label.textContent=t,this.bar.style.animation="none",this.bar.style.transform="scaleX(0.04)",this.root.classList.add("is-shown"),this.shown=!0,await k0()}async step(t,e){this.shown&&(this.label.textContent=t,e===void 0?(this.bar.style.transition="none",this.bar.style.animation="building-sweep 900ms ease-in-out infinite"):(this.bar.style.animation="none",this.bar.style.transition="",this.bar.style.transform=`scaleX(${Math.min(Math.max(e,0),1)})`),await k0())}hide(){this.shown&&(this.shown=!1,this.bar.style.animation="none",this.root.classList.remove("is-shown"))}dispose(){this.root.remove()}}const Nb={level:.55,click:{hz:3200,q:6,duration:.004,level:.5},modes:[{hz:180,decay:.16,q:5,level:1},{hz:430,decay:.1,q:6,level:.55},{hz:950,decay:.055,q:7,level:.25}],thump:{from:112,to:82,decay:.13,level:.55}},Ub={level:.5,click:{hz:5200,q:9,duration:.005,level:.6},modes:[{hz:240,decay:.34,q:9,level:.8},{hz:620,decay:.28,q:11,level:.6},{hz:1450,decay:.2,q:12,level:.35},{hz:2900,decay:.12,q:10,level:.18}],thump:{from:78,to:62,decay:.3,level:.7}},Fb={level:.42,click:{hz:2400,q:5,duration:.003,level:.35},modes:[{hz:320,decay:.08,q:5,level:.8},{hz:720,decay:.055,q:6,level:.45},{hz:1600,decay:.035,q:6,level:.2}],thump:{from:150,to:120,decay:.07,level:.3}},Ob={timber:Nb,iron:Ub,plank:Fb};function zb(i){return Math.max(i.thump.decay,...i.modes.map(e=>e.decay))*3+Jp+.05}const Jp=.032;function Pr(i,t){return i+Math.random()*(t-i)}class kb{engine;constructor(t){this.engine=t}play(t,e="timber"){const n=Ob[e],s=this.engine.context;if(s.state!=="running"||!this.engine.noise)return;const o=s.currentTime+.02,r=[],a=this.buildOutput(n,t,r),c=Ns(s,[{hz:n.click.hz,decay:n.click.duration,level:n.click.level,q:n.click.q}],a),l=Ns(s,n.modes,a);this.excite(c.inputs[0],n.click.level,o,6e-4,n.click.duration*1.5,r);const h=o+Jp;n.modes.forEach((f,d)=>{this.excite(l.inputs[d],f.level*Pr(.92,1.08),h,.002,f.decay,r)}),Ta(s,a,h,n.thump.level,n.thump.from*Pr(.96,1.04),n.thump.to,n.thump.decay,.004);const u=zb(n);window.setTimeout(()=>{for(const f of r)f.disconnect();c.dispose(),l.dispose()},(o-s.currentTime+u)*1e3+250)}buildOutput(t,e,n){const s=this.engine.context,o=s.createGain();o.gain.value=t.level;const r=s.createPanner();r.panningModel="HRTF",r.distanceModel="inverse",r.refDistance=1.6,r.maxDistance=45,r.rolloffFactor=1.1,Bb(r,e);const a=s.createGain();return a.gain.value=.9,o.connect(r),r.connect(this.engine.dry),r.connect(a),a.connect(this.engine.send),n.push(o,r,a),o}excite(t,e,n,s,o,r){const a=this.engine.context,c=this.engine.noise;if(!c)return;const l=a.createBufferSource();l.buffer=c.white,l.playbackRate.value=Pr(.9,1.1);const h=a.createGain();Oo(h.gain,n,e,s,o),l.connect(h).connect(t),l.start(n,Pr(0,c.white.duration-1),o*3+.05),l.stop(n+o*3+.06),r.push(l,h)}}function Bb(i,t){i.positionX?(i.positionX.value=t.x,i.positionY.value=t.y,i.positionZ.value=t.z):i.setPosition(t.x,t.y,t.z)}class Hb{zones=new Map;portals=new _b;lights;options;audio=null;doorAudio=null;soundscapes=new Map;warmed=new Set;entering=0;building=new Db(document.body);arrived=!1;active=null;doored=new Set;clutterShadows=!1;transitioning=!1;hovered=null;crossings=0;onZoneChange=null;constructor(t){this.options=t,this.lights={sun:new Bd(16773848,2.2),fill:new Bd(9412792,0),ambient:new Dx(10339560,4998454,1.5)},this.lights.sun.position.set(-70,90,50);const e=this.lights.sun.shadow;e.mapSize.set(4096,4096);const n=48;e.camera.left=-n,e.camera.right=n,e.camera.top=n,e.camera.bottom=-n,e.camera.near=55,e.camera.far=225,e.bias=-8e-5,e.normalBias=.006,e.intensity=.34,this.lights.fill.position.set(9,7,-7),t.scene.add(this.lights.sun,this.lights.fill,this.lights.ambient)}get sunDirection(){return this.lights.sun.position}setShadows(t){this.lights.sun.castShadow=t}setClutterShadows(t){if(t!==this.clutterShadows){this.clutterShadows=t;for(const e of this.zones.values())e.isBuilt&&e.root().traverse(n=>{n instanceof ie&&n.userData.clutter===!0&&(n.castShadow=t)})}}register(t){const e=new mb(t);return this.zones.set(e.id,e),e}link(t){for(const e of[t.a,t.b])if(!this.zones.has(e.zone))throw new Error(`portal ${t.id} refers to unknown zone "${e.zone}"`);this.portals.add(t,e=>this.zones.get(e)?.name??e)}prebuild(t){const e=this.zones.get(t);if(!e)return;const n=this.prepare(e);n.updateWorldMatrix(!0,!0),this.options.collider.warm(n,e.id),this.warmed.add(e.id)}get builtZones(){return[...this.zones.values()].filter(t=>t.isBuilt).map(t=>t.id)}evict(){if(!this.active)return;const t=wb(this.portals,this.active.id,xb);for(const e of this.zones.values()){if(!e.isBuilt||t.has(e.id))continue;e.dispose(),this.options.collider.invalidate(e.id),this.doored.delete(e.id),this.warmed.delete(e.id);for(const s of this.portals.in(e.id))this.portals.unbind(s);const n=this.soundscapes.get(e.id);n&&(n.dispose(),this.soundscapes.delete(e.id)),this.evicted++}}evicted=0;get evictions(){return this.evicted}surfaceAt(t,e){const n=this.active;return n?n.definition.surfaceAt?.(t,e)??n.environment.surface:"earth"}attachAudio(t){this.audio=t,this.doorAudio=new kb(t.engine),this.active&&this.applyAudio(this.active)}get current(){return this.active}get isTransitioning(){return this.transitioning}async enter(t,e){const n=this.zones.get(t);if(!n)throw new Error(`no such zone "${t}"`);const s=++this.entering,o=()=>s!==this.entering,{scene:r,collider:a,player:c,postfx:l,interaction:h}=this.options,u=!this.warmed.has(n.id)&&this.arrived;if(u&&(await this.building.show(`entering ${n.name.toLowerCase()}`),await this.building.step("raising the world"),o()))return;this.active&&this.active!==n&&r.remove(this.active.root());const f=this.prepare(n);if(u&&(await this.building.step("settling the ground"),o()))return;r.add(f),this.active=n,f.updateWorldMatrix(!0,!0),a.build(f,n.id),this.warmed.add(n.id),u&&await this.building.step("almost there",.96);const d=n.environment;l.setEnvironment({sky:d.sky,fogColor:d.fogColor,fogNear:d.fogNear,fogFar:d.fogFar}),this.lights.sun.intensity=d.sunIntensity,this.lights.sun.color.setHex(d.sunColor),this.lights.fill.intensity=d.fillIntensity,this.lights.fill.color.setHex(d.fillColor),this.lights.ambient.intensity=d.ambientIntensity,this.lights.ambient.color.setHex(d.ambientSky),this.lights.ambient.groundColor.setHex(d.ambientGround),this.applyAudio(n);const g=this.portals.in(n.id).map(m=>m.door).filter(m=>m!==null);f.traverse(m=>{typeof m.userData.label=="string"&&g.push(m)}),h.setTargets(g);const y=n.settle(e??n.spawn);c.teleport(y.position,y.yaw),this.hovered=null,this.options.reticle.set(null),this.onZoneChange?.(n),this.arrived=!0,this.building.hide(),this.evict()}applyAudio(t){if(!this.audio)return;this.audio.engine.setRoom(t.environment.room),this.audio.footsteps.surface=t.environment.surface,this.audio.footsteps.setReverb(t.environment.footstepReverb);let e=this.soundscapes.get(t.id);e||(e=new fb(this.audio.engine,t.environment.soundscape),this.soundscapes.set(t.id,e));for(const[n,s]of this.soundscapes)s.setActive(n===t.id)}updateSound(t,e){this.active&&this.soundscapes.get(this.active.id)?.update(t,this.options.collider,e)}get sound(){return this.active?this.soundscapes.get(this.active.id)??null:null}prepare(t){const e=t.root();if(this.doored.has(t.id))return e;this.doored.add(t.id);for(const n of this.portals.in(t.id)){const s=n.end,o=jp({seed:s.seed??1,material:s.material});o.position.copy(s.position),o.rotation.y=s.yaw,Te(o),e.add(o),this.portals.bind(n,o,Ib(z0(o).material))}return e.traverse(n=>{if(!(n instanceof ie))return;const s=n.userData.noCollide===!0,o=n.name==="flatGround"||n.name==="terrain",r=n.userData.clutter===!0;n.castShadow=!s&&!o&&(!r||this.clutterShadows),n.receiveShadow=!s}),e}update(){const{interaction:t,collider:e,player:n,reticle:s}=this.options;if(this.transitioning)return s.set(null),null;const o=t.probe(n.camera,e);if(this.hovered=o?this.portals.sideOf(o.object):null,this.hovered)s.set({title:this.hovered.title,target:this.hovered.label});else{const r=Eb(o?.object??null);s.set(r?{title:r}:null)}return this.hovered}async use(t){if(this.transitioning)return;this.transitioning=!0,this.options.reticle.set(null);const e=t.door?z0(t.door).material:"timber";B0.copy(t.end.position).setY(t.end.position.y+1.2),this.doorAudio?.play(B0,e),await this.options.fade.cover(async()=>{await this.enter(t.target.zone,t.arrival),this.crossings++}),this.transitioning=!1}respawn(){const t=this.active;t&&this.options.player.teleport(t.spawn.position,t.spawn.yaw)}dispose(){const{scene:t}=this.options;this.active&&t.remove(this.active.root()),t.remove(this.lights.sun,this.lights.fill,this.lights.ambient);for(const e of this.soundscapes.values())e.dispose();this.soundscapes.clear();for(const e of this.zones.values())e.dispose();this.zones.clear(),this.doored.clear()}}const B0=new R,Gb=.14,H0=.22;class Vb{element;title;target;joiner;shown=!1;showing="";constructor(t){this.element=document.createElement("div"),this.element.id="prompt",this.element.setAttribute("aria-live","polite");const e=document.createElement("span");e.className="prompt-lines",this.title=document.createElement("span"),this.title.className="prompt-title",this.joiner=document.createElement("span"),this.joiner.className="prompt-to",this.joiner.textContent="to",this.target=document.createElement("span"),this.target.className="prompt-target",e.append(this.title,this.joiner,this.target),this.element.append(e),t.appendChild(this.element)}set(t){const e=t!==null;if(t){const n=`${t.title}\0${t.target}`;if(n!==this.showing){this.showing=n,this.title.textContent=t.title,this.target.textContent=t.target??"";const s=!!t.target;this.joiner.hidden=!s,this.target.hidden=!s}}e!==this.shown&&(this.shown=e,this.element.classList.toggle("is-shown",e))}dispose(){this.element.remove()}}class Wb{element;constructor(t){this.element=document.createElement("div"),this.element.id="fade",t.appendChild(this.element)}async cover(t){this.element.classList.add("is-black"),await Hc(H0),await t(),await Hc(Gb),this.element.classList.remove("is-black"),await Hc(H0)}dispose(){this.element.remove()}}function Hc(i){return new Promise(t=>window.setTimeout(t,i*1e3))}const Xb=6,Yb=.55,qb=.42;class $b{element;renderer;pixel=new Uint8Array(4);countdown=0;onLight=!1;constructor(t,e=document.getElementById("crosshair")){this.renderer=t,this.element=e}update(){if(!this.element||this.countdown-- >0)return;this.countdown=Xb;const t=this.renderer.getContext();this.renderer.setRenderTarget(null);const e=t.drawingBufferWidth,n=t.drawingBufferHeight;if(e===0||n===0)return;t.readPixels(e>>1,n>>1,1,1,t.RGBA,t.UNSIGNED_BYTE,this.pixel);const s=(.2126*this.pixel[0]+.7152*this.pixel[1]+.0722*this.pixel[2])/255,o=this.onLight?s>qb:s>Yb;o!==this.onLight&&(this.onLight=o,this.element.classList.toggle("on-light",o))}}const Ra={floor:I.TIMBER,floorSeam:1315085,wall:I.CLOTH,wallTrim:I.TIMBER_DARK,ceiling:I.TIMBER_DARK,beam:I.BARK},jh={floor:I.STONE_DARK,floorSeam:921618,wall:I.STONE,wallTrim:I.IRON,ceiling:4015178,beam:I.RUST};function Hs(i){const{width:t,depth:e,height:n,seed:s=1,style:o=Ra,planks:r=!0,beams:a=3,thickness:c=.35}=i,l=xt(s),h=[],u=c,f=t+u*2,d=e+u*2,g=r?-.006:0,y=new G(f,u,d);y.translate(0,g-u/2,0),h.push({geometry:y,color:r?o.floorSeam:o.floor,sway:0});const m=new G(f,u,d);m.translate(0,n+u/2,0),h.push({geometry:m,color:o.ceiling,sway:0});for(const _ of[-1,1]){const v=new G(f,n,u);v.translate(0,n/2,_*(e+u)/2),h.push({geometry:v,color:o.wall,sway:0})}for(const _ of[-1,1]){const v=new G(u,n,d);v.translate(_*(t+u)/2,n/2,0),h.push({geometry:v,color:o.wall,sway:0})}if(r){const _=l.range(.24,.34),v=Math.ceil(t/_),w=.012;for(let b=0;b<v;b++){const S=-t/2+(b+.5)*_,E=new G(_-w,.03,e);E.translate(S,-.015,0),h.push({geometry:E,color:U(o.floor,l.around(1,.09)),sway:0})}}if(a>0){const _=l.range(.16,.24);for(let v=0;v<a;v++){const w=-e/2+(v+.5)/a*e,b=new G(f,_,l.range(.18,.26));b.translate(0,n-_/2,w),h.push({geometry:b,color:o.beam,sway:0})}}const p=.16;for(const _ of[-1,1]){const v=new G(t,p,.06);v.translate(0,p/2,_*(e-.06)/2),h.push({geometry:v,color:o.wallTrim,sway:0})}for(const _ of[-1,1]){const v=new G(.06,p,e);v.translate(_*(t-.06)/2,p/2,0),h.push({geometry:v,color:o.wallTrim,sway:0})}return bt(vt(h),"interior",0)}const la={name:"hut",category:"structures",radius:2.6,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(3,4.4),o=e.range(2.6,3.8),r=e.range(2,2.6),a=e.range(.4,.8),c=e.range(.9,1.5),l=new Z(c,c,s*1.16,3,1);l.rotateZ(Math.PI/2),l.rotateX(Math.PI/6),l.scale(1,1,o*1.2/(c*2)),l.computeBoundingBox(),l.translate(0,r-(l.boundingBox?.min.y??0),0),n.push({geometry:l,color:I.STONE,sway:0});const h=r,u=new G(s,a,o);u.translate(0,a/2,0),n.push({geometry:u,color:I.STONE_DARK,sway:0});const f=new G(s*.97,h-a,o*.97);f.translate(0,a+(h-a)/2,0),n.push({geometry:f,color:I.TIMBER,sway:0});const d=e.range(.75,.95),g=e.range(1.5,1.8),y=e.around(0,s*.15),m=new G(d,g,.08);m.translate(y,g/2,o*.487),n.push({geometry:m,color:1514012,sway:0});const p=new G(d*1.3,.14,.16);p.translate(y,g+.07,o*.49),n.push({geometry:p,color:I.TIMBER_DARK,sway:0});for(const b of[-1,1])for(const S of[-1,1]){const E=new G(.16,h,.16);E.translate(b*s/2,h/2,S*o/2),n.push({geometry:E,color:I.TIMBER_DARK,sway:0})}const _=vt(n);t!==1&&_.scale(t,t,t);const v=bt(_,"hut",0),w={x:y*t,z:o*.487*t,width:d*t,height:g*t};return v.userData.doorAnchor=w,v}};function Zb(i){return i.userData.doorAnchor}const G0=[{name:"small",weight:.3,scale:[.55,.75]},{name:"ordinary",weight:.45,scale:[.85,1.15]},{name:"large",weight:.18,scale:[1.5,1.9]},{name:"huge",weight:.07,scale:[2.1,2.6]}],Vi={name:"crate",category:"objects",radius:1.2,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[];let s=e(),o=G0[1];for(const m of G0)if(s-=m.weight,s<=0){o=m;break}const r=e.range(o.scale[0],o.scale[1]),a=e.range(.5,.9)*r,c=e.range(.45,.8)*r,l=e.range(.5,.9)*r,h=e.around(0,.35),u=new G(a,c,l);u.translate(0,c/2,0),u.rotateY(h),n.push({geometry:u,color:I.TIMBER,sway:0});const f=Math.max(2,Math.round(2+r*.9+(e.chance(.3)?1:0))),d=.05*Math.min(r,1.5),g=1.02;for(let m=0;m<f;m++){const p=c*(.13+m/Math.max(f-1,1)*.74),_=new G(a*g,d,l*g);_.translate(0,p,0),_.rotateY(h),n.push({geometry:_,color:I.TIMBER_DARK,sway:0})}if(r>1.2||e.chance(.25)){const m=.055*Math.min(r,1.6);for(const p of[-1,1])for(const _ of[-1,1]){const v=new G(m,c*.96,m);v.translate(p*a/2,c*.48,_*l/2),v.rotateY(h),n.push({geometry:v,color:I.RUST,sway:0})}}if(e.chance(.35)){const m=new G(a*.92,.05*r,l*.92);m.translate(e.around(0,.08*r),c+.03*r,e.around(0,.08*r)),m.rotateY(h+e.around(0,.25)),n.push({geometry:m,color:I.TIMBER_DARK,sway:0})}const y=vt(n);return t!==1&&y.scale(t,t,t),bt(y,"crate",0)}},yi={name:"barrel",category:"objects",radius:.55,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.75,1.05),o=e.range(.3,.4),r=o*e.range(.78,.88),a=e.int(8,11),c=e.chance(.25),l=[new tt(0,0),new tt(r,0),new tt(o,s*.35),new tt(o,s*.65),new tt(r,s),new tt(0,s)];n.push({geometry:new Jn(l,a),color:I.TIMBER,sway:0});for(const u of[.14,.5,.86]){const f=u>.3&&u<.7?o:r+(o-r)*.45,d=new Z(f*1.04,f*1.04,.055,a);d.translate(0,s*u,0),n.push({geometry:d,color:I.IRON,sway:0})}let h=vt(n);return c&&(h.rotateX(Math.PI/2),h.rotateY(e.range(0,Math.PI*2)),h.translate(0,o,0)),t!==1&&(h=h.scale(t,t,t)),bt(h,"barrel",0)}},Jh={name:"bed",category:"furniture",radius:1.3,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.9,1.25),o=e.range(1.85,2.15),r=e.range(.26,.4),a=e.range(.07,.1),c=e.chance(.55)?I.TIMBER_DARK:I.BARK,l=e.pick([I.CLOTH,I.WOOL,I.HIDE_PALE]),h=e.pick([I.HIDE,I.LEAF_DARK,I.RUST,I.STONE_DARK]),u=e.chance(.5)?-1:1;for(const E of[-1,1]){const T=new G(a,r*.55,o);T.translate(E*(s-a)/2,r*.72,0),n.push({geometry:T,color:c,sway:0})}for(const E of[-1,1])for(const T of[-1,1]){const x=r*(T===u?1.05:.98),M=new G(a,x,a);M.translate(E*(s-a)/2,x/2,T*(o-a)/2),n.push({geometry:M,color:c,sway:0})}const f=e.range(.34,.62),d=new G(s,f,.055);if(d.translate(0,r+f/2-.04,u*o/2),n.push({geometry:d,color:c,sway:0}),e.chance(.55)){const E=f*e.range(.3,.5),T=new G(s,E,.05);T.translate(0,r+E/2-.04,-u*o/2),n.push({geometry:T,color:c,sway:0})}const g=r+e.range(.14,.2),y=6,m=(o-.1)/y;for(let E=0;E<y;E++){const T=-o/2+.05+(E+.5)*m,x=u<0?E/(y-1):1-E/(y-1),M=1-.22*Math.sin(x*Math.PI)*e.range(.4,1),A=(g-r*.72)*M,P=new G(s-a*1.4,A,m*1.04);P.translate(0,r*.72+A/2,T),n.push({geometry:P,color:l,sway:0})}const p=o*e.range(.6,.75),_=4,v=p/_,w=-u*o/2;for(let E=0;E<_;E++){const T=w+u*((E+.5)*v),x=e.range(.045,.075),M=new G(s-a*.6,x,v*1.02);M.translate(0,g+x/2-.01,T),n.push({geometry:M,color:h,sway:0})}const b=new G(s-a*.6,.05,.09);if(b.translate(0,g+.05,w+u*p),n.push({geometry:b,color:U(h,1.18),sway:0}),e.chance(.85)){const E=e.range(.26,.36),T=new G(s*e.range(.5,.72),e.range(.09,.14),E);T.translate(e.around(0,s*.1),g+.06,u*(o/2-E*.8)),T.rotateY(e.around(0,.18)),n.push({geometry:T,color:U(l,1.12),sway:0})}const S=vt(n);return t!==1&&S.scale(t,t,t),bt(S,"bed",0)}},V0=[{weight:.28,width:[.7,1],depth:[.5,.68]},{weight:.47,width:[1.2,1.7],depth:[.7,.95]},{weight:.25,width:[2.1,3],depth:[.85,1.1]}],Co={name:"table",category:"furniture",radius:1.6,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[];let s=e(),o=V0[1];for(const v of V0)if(s-=v.weight,s<=0){o=v;break}const r=e.range(o.width[0],o.width[1]),a=e.range(o.depth[0],o.depth[1]),c=e.range(.68,.78),l=e.range(.045,.07),h=r>1.5&&e.chance(.45),u=e.chance(.6)?I.TIMBER:I.TIMBER_DARK,f=u===I.TIMBER?I.TIMBER_DARK:I.TIMBER,d=e.int(3,5),g=a/d,y=.008;for(let v=0;v<d;v++){const w=new G(r,l*e.range(.93,1),g-y);w.translate(0,c-l/2,-a/2+(v+.5)*g),n.push({geometry:w,color:U(u,e.around(1,.07)),sway:0})}const m=c-l,p=c-l*.6;if(h){const v=r*e.range(.16,.24);for(const b of[-1,1]){const S=b*(r/2-v),E=new G(.09,.07,a*.86);E.translate(S,.035,0),n.push({geometry:E,color:f,sway:0});const T=e.range(.09,.13),x=new G(T,m-.07,a*.2);x.translate(S,.07+(m-.07)/2,0),n.push({geometry:x,color:f,sway:0});const M=new G(.09,.06,a*.8);M.translate(S,p-.03,0),n.push({geometry:M,color:f,sway:0})}const w=new G(r-v*1.2,.07,.07);w.translate(0,m*e.range(.32,.42),0),n.push({geometry:w,color:f,sway:0})}else{const v=e.range(.055,.085),w=r/2-v*.9,b=a/2-v*.9;for(const S of[-1,1])for(const E of[-1,1]){const T=new G(v,p,v);T.translate(S*w,p/2,E*b),n.push({geometry:T,color:f,sway:0})}if(e.chance(.7)){for(const E of[-1,1]){const T=new G(w*2,.07,.03);T.translate(0,m-.07/2-.02,E*b),n.push({geometry:T,color:f,sway:0})}for(const E of[-1,1]){const T=new G(.03,.07,b*2);T.translate(E*w,m-.07/2-.02,0),n.push({geometry:T,color:f,sway:0})}}}const _=vt(n);return t!==1&&_.scale(t,t,t),bt(_,"table",0)}},ha={name:"chair",category:"furniture",radius:.45,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.42,.5),o=e.range(.38,.46),r=e.range(.36,.44),a=e.range(.04,.06),c=e.range(.44,.66),l=e.pick(["slats","spindles","board"]),h=e.chance(.55)?I.TIMBER:I.TIMBER_DARK,u=h===I.TIMBER?I.TIMBER_DARK:I.TIMBER,f=new G(o,a,r);f.translate(0,s-a/2,0),n.push({geometry:f,color:h,sway:0});const d=e.range(.035,.048),g=o/2-d*.7,y=r/2-d*.7,m=s-a*.4;for(const v of[-1,1]){const w=new G(d,m,d);w.translate(v*g,m/2,y),n.push({geometry:w,color:u,sway:0})}for(const v of[-1,1]){const w=new G(d,m,d);w.translate(v*g,m/2,-y),n.push({geometry:w,color:u,sway:0});const b=a*.4+.02,S=new G(d,c+b,d);S.translate(v*g,s+c/2-b/2,-y),n.push({geometry:S,color:u,sway:0})}const p=(v,w)=>{v.translate(0,s+w,-y)};if(l==="board"){const v=c*e.range(.4,.55),w=new G(o*.86,v,.03);p(w,c-v*.62),n.push({geometry:w,color:h,sway:0})}else if(l==="slats"){const v=e.int(2,3);for(let w=0;w<v;w++){const b=c*(.42+w/Math.max(v-1,1)*.5),S=new G(o*.84,e.range(.06,.1),.026);p(S,b),n.push({geometry:S,color:h,sway:0})}}else{const v=e.int(3,5),w=o*.72,b=c*.93,S=.02,E=b+S;for(let x=0;x<v;x++){const M=-w/2+x/(v-1)*w,A=new G(.026,E,.026);A.translate(M,E/2-S,0),p(A,0),n.push({geometry:A,color:u,sway:0})}const T=new G(o*.84,.055,.032);p(T,b),n.push({geometry:T,color:h,sway:0})}if(e.chance(.6)){const v=new G(g*2,.026,.026);v.translate(0,s*e.range(.28,.36),y),n.push({geometry:v,color:u,sway:0})}const _=vt(n);return t!==1&&_.scale(t,t,t),bt(_,"chair",0)}},ua={name:"stool",category:"furniture",radius:.42,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.chance(.45)?3:4,o=e.range(.42,.56),r=e.range(.16,.23),a=e.range(.04,.07),c=e.chance(.5)?I.TIMBER:I.TIMBER_DARK,l=c===I.TIMBER?I.TIMBER_DARK:I.TIMBER,h=s===3?new Z(r,r*.96,a,6):new G(r*1.9,a,r*1.9);h.translate(0,o-a/2,0),s===4&&h.rotateY(e.around(0,.2)),n.push({geometry:h,color:c,sway:0});const u=o-a,f=e.range(.14,.26),d=r*.66,g=u/Math.cos(f);for(let p=0;p<s;p++){const _=p/s*Math.PI*2+(s===4?Math.PI/4:0),v=e.range(.035,.05),w=Math.cos(_),b=Math.sin(_),S=new G(v,g,v);S.translate(0,-g/2,0),S.rotateZ(f),S.rotateY(-_),S.translate(w*d,u,b*d),n.push({geometry:S,color:l,sway:0})}const y=d+g*Math.sin(f);if(s===4&&e.chance(.45)){const p=e.range(.28,.38),_=d+(y-d)*(1-p);for(const v of[0,Math.PI/2]){const w=new G(_*2,.028,.028);w.translate(0,u*p,0),w.rotateY(v+Math.PI/4),n.push({geometry:w,color:l,sway:0})}}const m=vt(n);return t!==1&&m.scale(t,t,t),bt(m,"stool",0)}},Kb=[{shape:"cone",weight:.3},{shape:"orb",weight:.2},{shape:"wedge",weight:.16},{shape:"drum",weight:.14},{shape:"block",weight:.11},{shape:"spike",weight:.09}];function jb(i){let t=i();for(const e of Kb)if(t-=e.weight,t<=0)return e.shape;return"cone"}const Jb={cone:.3,wedge:.3,drum:.4,block:.4,orb:.5,spike:.85};function Qb(i,t,e){switch(i){case"cone":return new te(t*1.15,t*e.range(2.2,3.2),e.int(5,8));case"wedge":return new te(t*1.3,t*e.range(1.6,2.2),4);case"drum":return new Z(t*1.1,t*1.15,t*e.range(1.1,1.7),7);case"block":return new G(t*1.7,t*e.range(1.6,2.3),t*1.5);case"spike":return new ke(t*1.3,0);case"orb":default:return new ee(t,0)}}function tS(i,t,e,n){switch(i.int(0,3)){case 0:return{geometry:new G(t*2,n,t*1.3),halfDepth:t*.65};case 1:return{geometry:new Z(e,t,n,i.int(5,7)),halfDepth:t*.85};case 2:return{geometry:new Z(t,e,n,4),halfDepth:t*.75};default:return{geometry:new Z(t,e,n,i.int(5,7)),halfDepth:t*.85}}}function W0(i,t,e,n){return i?new G(t*2,n,t*2):new Z(t,e,n,5)}function Bn(i,t,e=0){return new R(t*(i.reach+.03+e),i.hold,.16)}const eS=[(i,t,e)=>{const n=i.range(.11,.16),s=Bn(t,e,n*.6),o=new Z(n*.6,n*.4,n,7);return o.translate(s.x,s.y+n/2,s.z),[{geometry:o,color:i.pick([I.WOOL,I.RUST]),sway:0}]},(i,t,e)=>{const n=i.range(.14,.2),s=Bn(t,e,n),o=new ee(n,0);o.scale(1,1.15,1),o.translate(s.x,s.y+n*.7,s.z);const r=new Z(n*.32,n*.45,n*.8,6);r.translate(s.x,s.y+n*1.8,s.z);const a=i.pick([I.RUST,I.COW_BLACK]);return[{geometry:o,color:a,sway:0},{geometry:r,color:a,sway:0}]},(i,t,e)=>{const n=i.range(.1,.15),s=Bn(t,e,n),o=new ee(n,0);return o.scale(1,i.range(.7,.95),i.range(.8,1.1)),o.rotateX(i.range(0,Math.PI)),o.rotateY(i.range(0,Math.PI)),o.translate(s.x,s.y,s.z),[{geometry:o,color:i.pick([I.STONE_DARK,I.COW_BLACK]),sway:0}]},(i,t,e)=>{const n=[],s=Bn(t,e,.04),o=i.range(.28,.45),r=new Z(.012,.016,o,4);r.translate(s.x,s.y+o/2,s.z),n.push({geometry:r,color:I.BARK,sway:.45});const a=i.int(3,6);for(let c=0;c<a;c++){const l=new ee(i.range(.055,.085),0);l.scale(1,.4,.85),l.rotateY(i.range(0,Math.PI)),l.rotateZ(i.around(0,.5)),l.translate(s.x+i.around(0,.07),s.y+o*i.range(.6,1.05),s.z+i.around(0,.06)),n.push({geometry:l,color:I.LEAF,sway:.7})}return n},(i,t,e)=>{const n=i.range(.11,.16),s=Bn(t,e,n*1.5),o=new ee(n,0);return o.scale(1.5,.75,.9),o.rotateY(i.around(0,.4)),o.translate(s.x,s.y+.03,s.z),[{geometry:o,color:i.pick([I.BARK_PALE,I.MARKER_YELLOW]),sway:0}]},(i,t,e)=>{const n=i.range(.16,.23),s=Bn(t,e,n),o=new ee(n,0);return o.scale(1,i.range(.8,1.05),.9),o.rotateX(i.range(0,Math.PI)),o.translate(s.x,s.y+.06,s.z),[{geometry:o,color:i.pick([I.WOOL,I.RUST]),sway:0}]},(i,t,e)=>{const n=i.range(.2,.28),s=Bn(t,e,n*.55),o=new G(n*.75,n,.03);return o.rotateZ(e*i.range(.15,.45)),o.translate(s.x,s.y+n*.3,s.z),[{geometry:o,color:i.pick([I.COW_BLACK,I.WOOL]),sway:0}]},(i,t,e)=>{const n=Bn(t,e,.07),s=i.range(.1,.18),o=new Z(.01,.01,s,4);o.translate(n.x,n.y+s/2,n.z);const r=new G(.12,.15,.12);r.translate(n.x,n.y-.07,n.z);const a=new te(.095,.06,4);return a.translate(n.x,n.y+.02,n.z),[{geometry:o,color:I.IRON,sway:0},{geometry:r,color:I.MARKER_YELLOW,sway:0},{geometry:a,color:I.IRON,sway:0}]},(i,t,e)=>{const n=i.range(.24,.36),s=Bn(t,e,n*.5),o=new ke(n*.36,0);o.scale(1.9,.85,.5),o.rotateZ(e*.8),o.translate(s.x,s.y-n*.25,s.z);const r=new te(n*.16,n*.24,3);return r.scale(1,1,.4),r.rotateZ(e*.8+Math.PI),r.translate(s.x+e*n*.32,s.y-n*.25-n*.42,s.z),[{geometry:o,color:I.STONE_PALE,sway:0},{geometry:r,color:I.STONE,sway:0}]}],Gc=[{name:"held",weight:.52,build:(i,t,e)=>i.pick(eS)(i,t,e)},{name:"pauldron",weight:.18,build:(i,t,e)=>{const n=new ee(i.range(.09,.14),0);return n.scale(1.15,.65,1.05),n.rotateY(i.range(0,Math.PI)),n.translate(e*(t.chest+.04),t.shoulder-.02,0),[{geometry:n,color:I.IRON,sway:0}]}},{name:"pack",weight:.19,build:(i,t,e)=>{const n=i.range(.2,.32),s=i.range(.24,.4),o=i.range(.12,.2),r=new G(n,s,o);return r.rotateY(i.around(0,.2)),r.translate(e*i.range(0,.07),t.shoulder-s*.55,-(t.depth+o*.4)),[{geometry:r,color:I.TIMBER_DARK,sway:0}]}},{name:"horn",weight:.08,build:(i,t,e)=>{const n=i.range(.14,.3),s=new te(i.range(.02,.035),n,4);return s.translate(0,n/2,0),s.rotateZ(e*i.range(.5,1.1)),s.rotateX(i.around(0,.3)),s.translate(e*.05,t.height*.97,0),[{geometry:s,color:I.SKIN,sway:0}]}}];function X0(i){let t=i()*Gc.reduce((e,n)=>e+n.weight,0);for(const e of Gc)if(t-=e.weight,t<=0)return e;return Gc[0]}const bs={name:"figure",category:"people",radius:.55,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(1.55,2.05),o=e.range(.72,1.24),r=s*e.range(.44,.58),a=s*e.range(.78,.87),c=e.pick([I.CLOTH,I.TIMBER_DARK,I.STONE_DARK]),l=e.chance(.45),h=e.chance(.5)?1:-1,u=.19*o*e.range(.8,1.25),f=.15*o*e.range(.8,1.3),{geometry:d,halfDepth:g}=tS(e,u,f,a-r);d.translate(0,(a+r)/2,0),d.rotateY(e.around(0,.25)),n.push({geometry:d,color:c,sway:0});const y=e.range(.04,.22),m=new Z(.045,.06,y,5);m.translate(0,a+y/2,0),n.push({geometry:m,color:I.SKIN,sway:0});const p=e.range(.085,.15),_=jb(e),v=Qb(_,p,e);v.scale(e.range(.82,1.08),e.range(.95,1.3),e.range(.85,1.12)),v.rotateZ(e.around(0,.16)),v.rotateY(e.range(0,Math.PI)),v.computeBoundingBox();const w=p*Jb[_];v.translate(0,a+y-w-(v.boundingBox?.min.y??0),0),n.push({geometry:v,color:l?c:I.SKIN,sway:0});const b=e.range(.045,.075)*o,S=e.range(.03,.055)*o,E=(a-r)*e.range(.95,1.5),T=e.chance(.25),x=e.range(-.02,.09),M=e.range(.06,.11)*o,A=e.chance(.25),P=e.range(.04,.22);for(const N of[-1,1]){const D=r,B=W0(T,b,b*.8,D);B.translate(0,-D/2,0),B.rotateZ(N*x),B.translate(N*M,r,0),n.push({geometry:B,color:I.TIMBER_DARK,sway:0});const H=W0(A,S,S*.82,E);H.translate(0,-E/2,0),H.rotateZ(N*P),H.translate(N*(u+S*1.4),a-.03,0),n.push({geometry:H,color:c,sway:0})}const C={height:s,shoulder:a,hip:r,chest:u,reach:u+S*2.6,hold:a-E*.82,depth:g};e.chance(.62)&&(n.push(...X0(e).build(e,C,h)),e.chance(.22)&&n.push(...X0(e).build(e,C,h)));const F=vt(n);return t!==1&&F.scale(t,t,t),bt(F,"figure",0)}},da={name:"machine",category:"structures",radius:1.6,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(2.1,2.8),o=e.range(.9,1.3),r=e.range(.32,.46),a=e.chance(.5)?I.IRON:I.STONE_DARK,c=e.chance(.6)?I.RUST:I.IRON,l=new G(s,r,o);l.translate(0,r/2,0),n.push({geometry:l,color:I.STONE_DARK,sway:0});for(const D of[-1,1])for(const B of[-1,1]){const H=new G(.22,.08,.22);H.translate(D*(s-.3)/2,.04,B*(o-.3)/2),n.push({geometry:H,color:c,sway:0})}const h=e.chance(.4)?"twin":e.chance(.5)?"stacked":"single",u=e.range(.34,.46)*(h==="single"?1:.82),f=s*e.range(.62,.74),d=-s*.12,g=(D,B,H)=>{const V=new Z(D,D,f,10);V.rotateZ(Math.PI/2),V.translate(d,B,H),n.push({geometry:V,color:a,sway:0});for(const et of[-.28,.08,.34]){const lt=new Z(D*1.06,D*1.06,.07,10);lt.rotateZ(Math.PI/2),lt.translate(d+f*et,B,H),n.push({geometry:lt,color:c,sway:0})}};let y=r+u*2;if(h==="twin"){const D=u*1.02;g(u,r+u,-D),g(u,r+u,D)}else if(h==="stacked"){const D=u*e.range(.7,.86);g(u,r+u,0),g(D,r+u*2+D*.92,0),y=r+u*2+D*1.9;for(const B of[-.3,.3]){const H=new G(.1,D*1.1,u*1.1);H.translate(d+f*B,r+u*2,0),n.push({geometry:H,color:c,sway:0})}}else g(u,r+u,0);const m=e.range(.52,.72),p=r+m*.82,_=e.chance(.5)?4:3,v=e.chance(.3),w=s/2+e.range(.16,.26),b=v?w*2:w+s*.28,S=v?0:w-b/2,E=new Z(.075,.075,b,8);E.rotateZ(Math.PI/2),E.translate(S,p,0),n.push({geometry:E,color:U(c,1.1),sway:0});const T=v?[-s*.34,s*.34]:[s*.16,s*.4];for(const D of T){const B=new G(.26,p-r+.12,.3);B.translate(D,r+(p-r)/2,0),n.push({geometry:B,color:I.STONE_DARK,sway:0});const H=new G(.3,.1,.34);H.translate(D,p,0),n.push({geometry:H,color:c,sway:0})}for(const D of v?[w,-w]:[w]){const B=new Z(m,m,.12,12);B.rotateZ(Math.PI/2),B.translate(D,p,0),n.push({geometry:B,color:a,sway:0});const H=new Z(.15,.15,.26,8);H.rotateZ(Math.PI/2),H.translate(D,p,0),n.push({geometry:H,color:c,sway:0});for(let V=0;V<_;V++){const et=new G(.07,m*1.85,.06);et.rotateX(Math.PI/2),et.rotateX(V/_*Math.PI),et.translate(D,p,0),n.push({geometry:et,color:U(a,.86),sway:0})}}const x=new G(s*.42,.08,.08);x.translate(d+f*.45,r+u*.9,m*.42),n.push({geometry:x,color:c,sway:0});const M=e.range(1.1,1.8),A=e.range(.11,.16),P=new Z(A*.85,A,M,8);P.translate(-s*.3,y+M/2-.1,0),n.push({geometry:P,color:a,sway:0});const C=new Z(A*1.3,A*1.1,.1,8);C.translate(-s*.3,y+M-.14,0),n.push({geometry:C,color:c,sway:0});const F=e.int(1,2);for(let D=0;D<F;D++){const B=e.range(-.3,.25),H=new Z(.07,.09,e.range(.16,.26),6);H.translate(d+f*B,y,0),n.push({geometry:H,color:c,sway:0});const V=new Z(.1,.1,.035,8);V.translate(d+f*B,y+.16,0),n.push({geometry:V,color:U(c,1.2),sway:0})}const N=vt(n);return t!==1&&N.scale(t,t,t),bt(N,"machine",0)}},Qh={name:"sink",category:"objects",radius:.65,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.62,.86),o=e.range(.45,.6),r=e.range(.24,.34),a=e.range(.5,.68),c=e.range(.02,.032),l=U(9410203,e.range(.9,1.08)),h=U(l,.84),u=U(I.IRON,e.range(.85,1.05)),f=a+r,d=new G(s,c,o);d.translate(0,a+c/2,0),n.push({geometry:d,color:h,sway:0});for(const F of[-1,1]){const N=new G(s*.99,r,c);N.translate(0,a+r/2,F*(o-c)/2),n.push({geometry:N,color:l,sway:0});const D=new G(c,r*.985,o*.985);D.translate(F*(s-c)/2,a+r/2,0),n.push({geometry:D,color:l,sway:0})}for(const F of[-1,1]){const N=new G(s*1.04,c*1.4,c*2.2);N.translate(0,f,F*o/2),n.push({geometry:N,color:U(l,1.14),sway:0});const D=new G(c*2.2,c*1.35,o*.96);D.translate(F*s/2,f,0),n.push({geometry:D,color:U(l,1.14),sway:0})}if(e.chance(.4)){const F=new G(s-c*2.2,.02,o-c*2.2);F.translate(0,a+c+r*e.range(.12,.3),0),n.push({geometry:F,color:I.WATER,sway:0})}const g=e.range(.018,.026),y=e.range(.06,.1);for(const F of[-1,1])for(const N of[-1,1]){const D=new Z(g*.85,g,a,6);D.translate(F*(s-y*2)/2,a/2,N*(o-y*2)/2),n.push({geometry:D,color:u,sway:0})}if(e.chance(.55)){const F=a*e.range(.2,.32);for(const N of[0,1]){const D=N===0;for(const B of[-1,1]){const H=new G(D?s-y*2:g*1.2,g*1.1,D?g*1.2:o-y*2.4);H.translate(D?0:B*(s-y*2)/2,F,D?B*(o-y*2)/2:0),n.push({geometry:H,color:U(u,.88),sway:0})}}}const m=e.range(.16,.3),p=new G(s*1.02,m,c*1.6);p.translate(0,f+m/2,-o/2-c),n.push({geometry:p,color:U(l,.94),sway:0});const _=m+e.range(.1,.2),v=e.range(.012,.018),w=-o/2-c,b=new Z(v,v*1.15,_,6);b.translate(0,f+_/2,w),n.push({geometry:b,color:U(u,1.15),sway:0});const S=e.range(.14,.22),E=new Z(v*.9,v*.9,S,6);E.rotateX(Math.PI/2),E.translate(0,f+_,w+S/2),n.push({geometry:E,color:U(u,1.15),sway:0});const T=e.range(.05,.09),x=new Z(v*.8,v*.95,T,6);x.translate(0,f+_-T/2,w+S),n.push({geometry:x,color:U(u,1.05),sway:0});const M=e.chance(.75)?2:1,A=e.range(.1,.16),P=w+v*3.4;for(let F=0;F<M;F++){const N=M===1?0:F===0?-A:A,D=e.range(.05,.085),B=new Z(v*1.25,v*1.5,D,6);B.translate(N,f+D/2,P),n.push({geometry:B,color:U(u,1.05),sway:0});const H=new Z(v*.4,v*.5,v*1.4,6);H.translate(N,f+D+v*.7,P),n.push({geometry:H,color:U(u,1.15),sway:0});const V=e.range(0,Math.PI/2);for(const et of[0,1]){const lt=new G(v*3.4,v*.75,v*.72);lt.rotateY(V+(et?Math.PI/2:0)),lt.translate(N,f+D+v*1.5,P),n.push({geometry:lt,color:U(I.RUST,1.05),sway:0})}}const C=vt(n);return t!==1&&C.scale(t,t,t),bt(C,"sink",0)}},Y0=[{color:16760948,light:16758629,weight:.5},{color:16747100,light:16742984,weight:.32},{color:10475775,light:9423103,weight:.18}];function Qp(i){const t=i.range(0,1);let e=0;for(const n of Y0)if(e+=n.weight,t<=e)return n;return Y0[0]}const tu=1.25;function tm(i,t,e,n,s,o){const r=new ke(o,0);r.scale(1,2.4,1),r.translate(e,n,s),i.push({geometry:r,color:t.color,sway:0});const a=new ke(o*4.2,0);a.scale(1,1.5,1),a.translate(e,n,s);const c=o*4.2*1.5;i.push({geometry:a,color:(l,h,u)=>{const f=Math.hypot(l-e,h-n,u-s)/c;return nS(t.color,Math.max(0,.34*(1-f)))},sway:0})}function nS(i,t){const e=Math.round((i>>16&255)*t),n=Math.round((i>>8&255)*t),s=Math.round((i&255)*t);return e<<16|n<<8|s}const iS=2.15,sS=14,fa={name:"candle",category:"objects",radius:.3,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=[],o=Qp(e),r=e.chance(.5)?14208430:12564904,a=e.chance(.35),c=e.range(.075,.11),l=U(I.IRON,e.range(.85,1.05));let h=0;if(a){const b=e.range(.16,.3),S=new Z(c*.62,c*1.05,.022,8);S.translate(0,.011,0),n.push({geometry:S,color:U(l,.86),sway:0});const E=new Z(.014,.019,b,6);if(E.translate(0,.022+b/2,0),n.push({geometry:E,color:l,sway:0}),e.chance(.6)){const T=new Z(c*.78,c*.5,.016,8);T.translate(0,.022+b*e.range(.45,.62),0),n.push({geometry:T,color:U(l,1.08),sway:0})}h=.022+b}const u=new Z(c,c*.88,.018,10);u.translate(0,h+.009,0),n.push({geometry:u,color:U(l,.94),sway:0}),h+=.018;const f=1+(e.chance(.42)?1:0)+(e.chance(.18)?1:0),d=c*.42;for(let b=0;b<f;b++){const S=b/f*Math.PI*2+e.range(0,Math.PI*2),E=f===1?0:Math.cos(S)*d,T=f===1?0:Math.sin(S)*d,x=e.range(.05,.16),M=e.range(.011,.016),A=e.range(0,.13),P=e.range(0,Math.PI*2),C=new Z(M*.92,M,x,7);C.translate(0,x/2,0),C.rotateX(Math.cos(P)*A),C.rotateZ(Math.sin(P)*A),C.translate(E,h,T);const F=h+x*.55;n.push({geometry:C,color:(H,V)=>V>F?o.color:r,sway:0});const N=E+Math.sin(Math.sin(P)*A)*x,D=T-Math.sin(Math.cos(P)*A)*x,B=h+x;tm(s,o,N,B+M*2.2,D,M*1.35),b===0&&hs.set(N,B+M*2.2,D)}const g=vt(n),y=vt(s),m=e.range(0,Math.PI*2);g.rotateY(m),y.rotateY(m),t!==1&&(g.scale(t,t,t),y.scale(t,t,t));const p=bt(g,"candle",0);p.add(bn(y,"candle:glow"));const _=Math.cos(m)*hs.x+Math.sin(m)*hs.z,v=-Math.sin(m)*hs.x+Math.cos(m)*hs.z,w=new Yi(o.light,iS*e.around(1,.15)*t*t,sS*t,tu);return w.position.set(_*t,hs.y*t,v*t),w.castShadow=!1,p.add(w),p}},hs=new R,oS=60,rS=22,Ir=15922406,Kn={name:"floodlight",category:"structures",radius:.6,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=[],o=e.range(1.9,2.7),r=e.range(.3,.42),a=r*e.range(.58,.72),c=r*e.range(.34,.46),l=e.range(.32,.6),h=U(I.IRON,e.range(.85,1.05)),u=U(8159880,e.range(.9,1.1)),f=e.range(.035,.05),d=new Z(f,f*1.1,o,6);d.translate(0,o/2,0),n.push({geometry:d,color:h,sway:0});const g=new Z(f*3.2,f*3.6,f*1.1,8);g.translate(0,f*.55,0),n.push({geometry:g,color:U(h,.85),sway:0});const y=new Z(f*1.5,f*1.5,f*2.6,6);y.rotateZ(Math.PI/2),y.translate(0,o,0),n.push({geometry:y,color:U(h,1.1),sway:0});const m=N=>{N.rotateX(l),N.translate(0,o,c*.6)},p=new G(r,a,c);m(p),n.push({geometry:p,color:u,sway:0});const _=new G(r*1.12,a*.16,c*1.5);_.translate(0,a*.56,c*.22),m(_),n.push({geometry:_,color:U(u,1.14),sway:0});const v=new G(r*.72,a*.62,c*.5);v.translate(0,0,-c*.68),m(v),n.push({geometry:v,color:U(u,.84),sway:0});const w=new G(r*.86,a*.7,c*.12);w.translate(0,0,c*.52),m(w),n.push({geometry:w,color:Ir,sway:0});const b=e.range(5.5,8),S=e.range(.22,.34),E=r*.42,T=new te(E+Math.tan(S)*b,b,10,1,!0);T.rotateX(-Math.PI/2),T.translate(0,0,c*.55+b/2),m(T),s.push({geometry:T,color:(N,D,B)=>{const H=Math.hypot(N,D-o,B)/b;return aS(Ir,.3*Math.max(0,1-H)**1.6)},sway:0});const x=new ke(E*.9,0);x.scale(1,.8,.5),x.translate(0,0,c*.56),m(x),s.push({geometry:x,color:Ir,sway:0});const M=vt(n),A=vt(s);t!==1&&(M.scale(t,t,t),A.scale(t,t,t));const P=bt(M,"floodlight",0);P.add(bn(A,"floodlight:glow"));const C=new Ux(Ir,oS*e.around(1,.1)*t*t,rS*t,S*1.15,.55,2);C.position.set(0,o*t,0);const F=new be;return F.position.set(0,(o-Math.sin(l)*b)*t,Math.cos(l)*b*t),P.add(F),C.target=F,C.castShadow=!1,P.add(C),P}};function aS(i,t){const e=Math.round((i>>16&255)*t),n=Math.round((i>>8&255)*t),s=Math.round((i&255)*t);return e<<16|n<<8|s}const eu={name:"pipes",category:"structures",radius:1.7,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(2.6,3.6),o=2,r=e.range(.06,.11),a=[I.RUST,4877172,7039548,I.IRON,8018492],c=U(e.pick(a),e.range(.9,1.1)),l=U(I.IRON,e.range(.85,1.05)),h=(y,m,p,_)=>{const v=new Z(_,_,m,8);v.rotateZ(Math.PI/2),v.translate(y,p,0),n.push({geometry:v,color:c,sway:0})},u=(y,m,p,_=1.45)=>{const v=new Z(p*_,p*_,p*.55,8);v.rotateZ(Math.PI/2),v.translate(y,m,0),n.push({geometry:v,color:U(l,1.05),sway:0})},f=e.int(3,5),d=[-s/2];for(let y=1;y<f;y++)d.push(-s/2+s*(y/f)*e.range(.82,1.18));d.push(s/2),d.sort((y,m)=>y-m);for(let y=0;y<d.length-1;y++){const m=d[y+1]-d[y];h((d[y]+d[y+1])/2,m+r*.5,o,r),y>0&&u(d[y],o,r)}if(u(-s/2,o,r,1.6),u(s/2,o,r,1.6),e.chance(.75)){const y=e.range(-s*.3,s*.3),m=new Z(r*1.5,r*1.5,r*1.8,6);m.rotateZ(Math.PI/2),m.translate(y,o,0),n.push({geometry:m,color:U(l,1.1),sway:0});const p=new Z(r*.28,r*.34,r*1.6,6);p.translate(y,o+r*2.2,0),n.push({geometry:p,color:l,sway:0});const _=new Xi(r*1.1,r*.2,4,10);_.rotateX(Math.PI/2),_.translate(y,o+r*3,0),n.push({geometry:_,color:U(I.RUST,1.1),sway:0})}const g=vt(n);return t!==1&&g.scale(t,t,t),bt(g,"pipes",0)}},nu={name:"tank",category:"structures",radius:1.9,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.4,1.05),o=s*e.range(2.1,4.6),r=e.range(.16,.62),a=r+s,c=e.chance(.45),l=c?U(I.RUST,e.range(.78,.95)):U(7173499,e.range(.9,1.08)),h=U(I.IRON,e.range(.85,1.05)),u=new Z(s,s,o,10);u.rotateZ(Math.PI/2),u.translate(0,a,0),n.push({geometry:u,color:c?(v,w)=>w<a?U(l,.82):l:l,sway:0});for(const v of[-1,1]){const w=new Z(s*.42,s,s*.45,10);w.rotateZ(v*Math.PI/2),w.translate(v*(o+s*.44)/2,a,0),n.push({geometry:w,color:U(l,1.06),sway:0});const b=new Z(s*.42,s*.42,s*.12,10);b.rotateZ(Math.PI/2),b.translate(v*(o+s*.88)/2,a,0),n.push({geometry:b,color:U(h,.95),sway:0})}const f=Math.max(2,Math.round(o/e.range(.7,1.2)));for(let v=1;v<f;v++){const w=-o/2+o*v/f,b=new Z(s*1.035,s*1.035,s*.1,10);b.rotateZ(Math.PI/2),b.translate(w,a,0),n.push({geometry:b,color:U(h,1.05),sway:0})}for(const v of[-1,1]){const w=v*o/2*e.range(.5,.66),b=new G(s*.5,r,s*1.8);b.translate(w,r/2,0),n.push({geometry:b,color:U(h,.82),sway:0});const S=new G(s*.42,s*.34,s*1.55);S.translate(w,r+s*.1,0),n.push({geometry:S,color:U(h,.92),sway:0});const E=new G(s*.8,s*.09,s*2);E.translate(w,s*.045,0),n.push({geometry:E,color:U(h,.74),sway:0})}const d=s*e.range(.3,.5),g=e.range(-o*.2,o*.2),y=new Z(d,d*1.1,s*.22,8);y.translate(g,a+s*.98,0),n.push({geometry:y,color:U(h,.95),sway:0});const m=new Z(d*1.2,d*1.2,s*.09,8);m.translate(g,a+s*1.12,0),n.push({geometry:m,color:U(h,1.12),sway:0});for(let v=0;v<8;v++){const w=v/8*Math.PI*2,b=new G(s*.055,s*.05,s*.055);b.translate(g+Math.cos(w)*d*1.05,a+s*1.17,Math.sin(w)*d*1.05),n.push({geometry:b,color:U(h,.8),sway:0})}const p=e.int(0,4);for(let v=0;v<p;v++){const w=-o*.35+o*.7*(v+.5)/p;if(Math.abs(w-g)<d*1.6)continue;const b=s*e.range(.1,.16),S=s*e.range(.3,.6),E=new Z(b,b,S,6);E.translate(w,a+s*.9+S/2,0),n.push({geometry:E,color:U(l,1.1),sway:0});const T=new Z(b*1.6,b*1.6,b*.5,6);T.translate(w,a+s*.9+S,0),n.push({geometry:T,color:U(h,1.05),sway:0})}const _=vt(n);return t!==1&&_.scale(t,t,t),bt(_,"tank",0)}},iu={name:"vent",category:"structures",radius:.7,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.55,.85),o=e.range(.45,.7),r=e.range(.16,.26),a=e.range(.035,.055),c=1.7,l=U(8883859,e.range(.9,1.08)),h=e.chance(.4),u=c,f=u+o;for(const v of[-1,1]){const w=new G(a,o,r);w.translate(v*(s-a)/2,u+o/2,0),n.push({geometry:w,color:l,sway:0});const b=new G(s,a*.92,r*.98);b.translate(0,v<0?u+a*.46:f-a*.46,0),n.push({geometry:b,color:U(l,.94),sway:0})}const d=new G(s*1.14,a*.8,r*1.5);d.rotateX(-.14),d.translate(0,f+a*.4,r*.2),n.push({geometry:d,color:U(l,1.12),sway:0});const g=o-a*2.2,y=Math.max(3,Math.round(g/e.range(.055,.085))),m=g/y,p=m*.42;for(let v=0;v<y;v++){const w=u+a*1.1+m*(v+.5),b=new G(s-a*2.2,p,r*.66);b.rotateX(e.range(.5,.72)),b.translate(0,w,r*.1-v/y*r*.24),n.push({geometry:b,color:h&&e.chance(.3)?U(I.RUST,.95):U(l,1.06),sway:0})}if(s>.7){const v=new G(a*.7,g,r*.5);v.translate(0,u+o/2,-r*.06),n.push({geometry:v,color:U(l,.88),sway:0})}const _=vt(n);return t!==1&&_.scale(t,t,t),bt(_,"vent",0)}},su={name:"railing",category:"structures",radius:1.5,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(2.2,3.2),o=e.range(1.04,1.14),r=e.range(.021,.028),a=r*e.range(1.05,1.25),c=e.chance(.55),l=U(c?12097838:9278618,e.range(.92,1.08)),h=U(I.IRON,e.range(.85,1.05)),u=Math.max(2,Math.round(s/e.range(1.1,1.5)));for(let y=0;y<=u;y++){const m=-s/2+s*y/u,p=new Z(a*.92,a,o,6);p.translate(m,o/2,0),n.push({geometry:p,color:l,sway:0});const _=new G(a*4.6,a*.7,a*4.6);_.translate(m,a*.35,0),n.push({geometry:_,color:U(h,.88),sway:0})}for(const y of[o-r,o*e.range(.48,.56)]){const m=new Z(r,r,s+a*2.4,8);m.rotateZ(Math.PI/2),m.translate(0,y,0),n.push({geometry:m,color:l,sway:0})}for(const y of[-1,1]){const m=new Z(r*1.1,r*1.1,r*1.6,8);m.rotateZ(Math.PI/2),m.translate(y*(s+a*2.4)/2,o-r,0),n.push({geometry:m,color:U(l,.9),sway:0})}const f=e.range(.1,.15),d=new G(s,f,r*.7);d.translate(0,f/2+e.range(.005,.02),a*.8),n.push({geometry:d,color:U(l,.86),sway:0});const g=vt(n);return t!==1&&g.scale(t,t,t),bt(g,"railing",0)}},ou={name:"chainlink",category:"structures",radius:1.6,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(2.4,3.2),o=e.range(1.8,2.4),r=e.range(.04,.055),a=U(9278618,e.range(.92,1.08)),c=U(10133926,e.range(.9,1.1));for(const p of[-1,1]){const _=new Z(r,r*1.06,o,6);_.translate(p*s/2,o/2,0),n.push({geometry:_,color:a,sway:0});const v=new Z(r*1.15,r*1.15,r*.5,6);v.translate(p*s/2,o+r*.2,0),n.push({geometry:v,color:U(a,.9),sway:0})}const l=[o-r*1.4];e.chance(.75)&&l.push(r*1.6);for(const p of l){const _=new Z(r*.62,r*.62,s,6);_.rotateZ(Math.PI/2),_.translate(0,p,0),n.push({geometry:_,color:U(a,1.05),sway:0})}const h=e.range(.2,.26),u=e.range(.008,.011),f=l[0],d=l.length>1?l[1]:0,g=f-d,y=s/2;for(const p of[1,-1])for(let _=-y-g;_<=y+g;_+=h){const v=Math.max(-y,Math.min(y,_)),w=Math.max(-y,Math.min(y,_+p*g));if(Math.abs(w-v)<.001)continue;const b=d+Math.abs(v-_),S=d+Math.abs(w-_),E=Math.hypot(w-v,S-b),T=new G(u,E,u);T.rotateZ(-Math.atan2(w-v,S-b)),T.translate((v+w)/2,(b+S)/2,p>0?u:-u),n.push({geometry:T,color:c,sway:0})}const m=vt(n);return t!==1&&m.scale(t,t,t),bt(m,"chainlink",0)}},cS=6.5,lS=15,hS=1.3,q0=16747068,uS=16758371,so=2236445,em={name:"fireplace",category:"structures",radius:1.2,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=[],o=e.range(1.35,2),r=e.range(.42,.62),a=o*e.range(.46,.58),c=e.range(.62,.85),l=e.range(.14,.22),h=e.range(.07,.1),u=c+l,f=u+h/2-e.range(.012,.03),d=e.range(2.1,2.5),g=e.range(.3,1),y=e.chance(.5)?U(e.chance(.5)?8014392:7029814,e.range(.92,1.1)):U(I.STONE,e.range(.86,1.02)),m=e.chance(.55),p=m?U(I.TIMBER_DARK,e.range(.9,1.1)):U(y,.92),_=(o-a)/2,v=.07,w=e.range(.3,.5),b=new G(o+e.range(.2,.4),v,r+w);b.translate(0,v/2,(r+w)/2),n.push({geometry:b,color:U(I.STONE_DARK,e.range(.9,1.05)),sway:0});const S=e.int(3,5);for(const K of[-1,1])for(let q=0;q<S;q++){const ot=(u-v)/S,pt=_*(1-q*.014),wt=r*(1-q*.02),Ft=new G(pt,ot,wt);Ft.translate(K*(a+_)/2,v+ot*(q+.5),wt/2),n.push({geometry:Ft,color:U(y,e.range(.88,1.12)),sway:0})}const E=new G(a+_*.7,l,r*1.04);E.translate(0,c+l/2,r*1.04/2),n.push({geometry:E,color:p,sway:0});const T=new G(a*1.02,c*1.02,.09);T.translate(0,v+c*1.02/2-.02,.05),n.push({geometry:T,color:so,sway:0});for(const K of[-1,1]){const q=new G(.07,c*.98,r*.82);q.rotateY(K*.16),q.translate(K*a/2-K*.02,v+c*.98/2,r*.44),n.push({geometry:q,color:U(so,e.range(1.1,1.5)),sway:0})}const x=new G(a*.96,.08,r*.9);x.rotateX(.22),x.translate(0,c-.05,r*.44),n.push({geometry:x,color:U(so,1.25),sway:0});const M=r+e.range(.06,.14),A=new G(o+e.range(.1,.2),h,M);A.translate(0,f,M/2-.02),n.push({geometry:A,color:m?U(I.TIMBER,e.range(.95,1.1)):U(y,1.12),sway:0});const P=e.int(2,4);for(let K=0;K<P;K++){const q=K/P,ot=(K+1)/P,pt=(d-f)/P,wt=o*(.9-q*.3)*e.range(.98,1.02),Ft=r*(.86-q*.24),nt=new G(wt,pt*(1+(ot-q)*.1),Ft);nt.translate(0,f+pt*(K+.5),Ft/2),n.push({geometry:nt,color:U(y,e.range(.9,1.08)),sway:0})}const C=v+.06;for(const K of[-1,1]){const q=new G(.035,.05,r*.44);q.translate(K*a/2*e.range(.5,.62),C,r*.34),n.push({geometry:q,color:U(I.IRON,.8),sway:0});const ot=new G(.04,.16,.042);ot.translate(K*a/2*e.range(.5,.62),C+.09,r*.16),n.push({geometry:ot,color:U(I.IRON,.9),sway:0})}const F=r*.34,N=v+.15,D=e.int(3,5);for(let K=0;K<D;K++){const q=e.range(.045,.075),ot=a*e.range(.5,.78),pt=new Z(q,q*e.range(.85,.98),ot,6);pt.rotateZ(Math.PI/2),pt.rotateY(e.range(-.5,.5)),pt.rotateZ(e.range(-.14,.14));const wt=v+.09+K*e.range(.05,.08);pt.translate(e.around(0,a*.08),wt,F+e.around(0,.05));const Ft=U(I.BARK,e.range(.85,1.15)),ht=e.chance(g*.9)&&K<D-1?9320990:so,k=wt+q*.15;n.push({geometry:pt,color:(ft,st)=>st<k?ht:Ft,sway:0})}const B=e.int(5,9);for(let K=0;K<B;K++){const q=e.range(.025,.05),ot=new ee(q,0);ot.rotateY(e.range(0,Math.PI)),ot.translate(e.around(0,a*.3),v+q*.6,F+e.around(0,r*.16)),n.push({geometry:ot,color:e.chance(g*.5)?10239780:U(so,e.range(.9,1.4)),sway:0})}const H=new ke(a*.3*(.6+g*.55),0);H.scale(1,.3,.55),H.translate(0,N-.05,F),s.push({geometry:H,color:q0,sway:0});const V=2+(e.chance(g)?1:0);for(let K=0;K<V;K++){const q=a*e.range(.07,.12)*(.5+g*.7),ot=new ke(q,0);ot.scale(1,e.range(2.2,3.4),1),ot.translate(e.around(0,a*.2),N+q*e.range(1.4,2.2),F+e.around(0,.04)),s.push({geometry:ot,color:uS,sway:0})}const et=a*.55,lt=new ke(et,1);lt.scale(1,.9,.6),lt.translate(0,N+.06,F),s.push({geometry:lt,color:(K,q,ot)=>{const pt=Math.hypot(K,(q-N-.06)/.9,(ot-F)/.6)/et;return dS(q0,Math.max(0,.3*(.4+g*.6)*(1-pt)))},sway:0});const Mt=vt(n),Lt=vt(s);t!==1&&(Mt.scale(t,t,t),Lt.scale(t,t,t));const J=bt(Mt,"fireplace",0);J.add(bn(Lt,"fireplace:glow"));const rt=new Yi(16750149,cS*(.4+g*.8)*e.around(1,.1)*t*t,lS*t,hS);return rt.position.set(0,(N+.06)*t,r*.62*t),rt.castShadow=!1,J.add(rt),J}};function dS(i,t){const e=t<0?0:t>1?1:t,n=Math.round((i>>16&255)*e),s=Math.round((i>>8&255)*e),o=Math.round((i&255)*e);return n<<16|s<<8|o}const fS=3.4,pS=12,Vc=16748354,mS=16747068,gS=[I.IRON_DARK,2435114,14077364,3362879,7024424],nm={name:"stove",category:"furniture",radius:.5,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=[],o=e.range(.4,.56),r=e.range(.33,.46),a=e.range(.44,.6),c=e.range(.1,.18),l=c+a/2,h=r/2,u=U(e.pick(gS),e.range(.92,1.08)),f=U(I.IRON,e.range(.82,1.02)),d=e.range(.35,1);for(const k of[-1,1])for(const ft of[-1,1]){const st=e.range(.032,.042),gt=new Z(st,st*e.range(1.15,1.4),c*1.12,5);gt.rotateZ(k*-.08),gt.rotateX(ft*.08),gt.translate(k*(o-st*3)/2,c*1.12/2,ft*(r-st*3)/2),n.push({geometry:gt,color:f,sway:0})}const g=new G(o,a,r);g.translate(0,l,0),n.push({geometry:g,color:u,sway:0});const y=new G(o*1.04,.045,r*.24);y.translate(0,c+.035,h*e.range(.9,1.02)),n.push({geometry:y,color:U(f,.9),sway:0});const m=e.range(.028,.04),p=new G(o+.055,m,r+.05);p.translate(0,c+a-m*.35,0),n.push({geometry:p,color:U(f,1.06),sway:0});const _=.022,v=c+a+m*.5,w=o+.055,b=r+.05;for(const[k,ft,st,gt]of[[w-_,_,0,-b/2+_*.8],[_,r*.86,-w/2+_*.8,0],[_,r*.82,w/2-_*.8,0]]){const yt=new G(k,.028,ft);yt.translate(st,v-.006,gt),n.push({geometry:yt,color:U(f,1.14),sway:0})}const S=o*e.range(.6,.72),E=a*e.range(.5,.62),T=l+a*e.range(.02,.1),x=new G(S,E,.016);x.translate(0,T,h+.005),n.push({geometry:x,color:Wc(Vc,.45+d*.5),sway:0});const M=h+.032,A=.038;for(const k of[-1,1]){const ft=new G(S+A*2.1,A,.03);ft.translate(0,T+k*E/2,M),n.push({geometry:ft,color:f,sway:0});const st=new G(A*.92,E+A*.4,.028);st.translate(k*S/2,T,M*.999),n.push({geometry:st,color:U(f,1.08),sway:0})}const P=e.chance(.5)?-1:1;for(const k of[-.3,.3]){const ft=new G(.03,.05,.04);ft.translate(P*(S+A*2.1)/2,T+E*k,M+.006),n.push({geometry:ft,color:U(f,.86),sway:0})}const C=-P*(S+A*2.4)/2,F=new Z(.012,.012,.05,6);F.rotateX(Math.PI/2),F.translate(C,T,M+.025),n.push({geometry:F,color:U(f,1.1),sway:0});const N=new G(.026,.1,.026);N.rotateZ(e.range(-.4,.4)),N.translate(C,T,M+.056),n.push({geometry:N,color:U(f,.94),sway:0});const D=new Z(.03,.03,.018,6);D.rotateX(Math.PI/2),D.rotateZ(e.range(0,Math.PI)),D.translate(e.around(0,o*.18),T-E*.5-.055,h+.012),n.push({geometry:D,color:U(f,1.12),sway:0});const B=e.range(.055,.075),H=e.range(.05,.075),V=-r*e.range(.08,.2),et=new Z(B*1.3,B*1.45,H,8);et.translate(0,v+H*.4,V),n.push({geometry:et,color:U(f,.9),sway:0});const lt=e.chance(.45),Mt=lt?e.range(1.5,1.95):e.range(2.35,2.7),Lt=v+H*.5,J=new Z(B,B*1.03,Mt-Lt,8);J.translate(0,(Mt+Lt)/2,V),n.push({geometry:J,color:U(f,.96),sway:0});const rt=new Z(B*1.22,B*1.22,B*.5,8);if(rt.translate(0,Lt+(Mt-Lt)*e.range(.4,.6),V),n.push({geometry:rt,color:U(f,1.1),sway:0}),lt){const k=e.range(.45,.7),ft=new Z(B*.98,B*.98,k,8);ft.rotateX(Math.PI/2),ft.translate(0,Mt-B*.9,V-k/2+B*.4),n.push({geometry:ft,color:U(f,.92),sway:0});const st=new Z(B*1.18,B*1.18,B*.55,8);st.rotateX(Math.PI/2),st.translate(0,Mt-B*.9,V-k+B*.6),n.push({geometry:st,color:U(f,1.08),sway:0})}if(e.chance(.6)){const k=new G(o+e.range(.16,.3),.014,r+e.range(.24,.42));k.translate(0,.007,e.range(.04,.12)),n.push({geometry:k,color:U(I.IRON_DARK,e.range(.9,1.15)),sway:0})}const K=h+.022,q=new G(S*.78,E*.6,.02);q.translate(0,T-E*.1,K),s.push({geometry:q,color:Wc(Vc,.55+d*.45),sway:0});const ot=Math.max(S,E)*.85,pt=new ke(ot,1);pt.scale(1,.85,.55),pt.translate(0,T-E*.08,K+.03),s.push({geometry:pt,color:(k,ft,st)=>{const gt=Math.hypot(k,(ft-T+E*.08)/.85,(st-K-.03)/.55)/ot;return Wc(Vc,Math.max(0,.26*(.4+d*.6)*(1-gt)))},sway:0});const wt=vt(n),Ft=vt(s);t!==1&&(wt.scale(t,t,t),Ft.scale(t,t,t));const nt=bt(wt,"stove",0);nt.add(bn(Ft,"stove:glow"));const ht=new Yi(mS,fS*(.45+d*.75)*e.around(1,.12)*t*t,pS*t,tu);return ht.position.set(0,T*t,(h+.06)*t),ht.castShadow=!1,nt.add(ht),nt}};function Wc(i,t){const e=t<0?0:t>1?1:t,n=Math.round((i>>16&255)*e),s=Math.round((i>>8&255)*e),o=Math.round((i&255)*e);return n<<16|s<<8|o}const yS=.1,vS=1.45,$0=1.3,Z0=9,_S=4.5,wS=16,xS=1.5;function MS(i,t,e){const n=i.userData.window;if(!n)return;const s=lh(t,-$0,$0),o=lh(e,yS,vS);n.azimuth=s,n.elevation=o;const r=Math.cos(o),a=Math.sin(s)*r,c=-Math.sin(o),l=Math.cos(s)*r,h=n.centreY/Math.sin(o),u=Math.min(h,Z0),f=i.getObjectByName("window:shaft");f&&(f.matrixAutoUpdate=!1,f.matrix.set(1,0,a*u,0,0,1,c*u,0,0,0,l*u,0,0,0,0,1),f.matrixWorldNeedsUpdate=!0);const d=i.getObjectByName("window:pool");if(d){const g=n.height/Math.sin(o);d.matrixAutoUpdate=!1,d.matrix.set(n.width,0,g*a,h*a,0,1,0,0,0,0,g*l,h*l,0,0,0,1),d.matrixWorldNeedsUpdate=!0,d.visible=h<=Z0}}const Ss={name:"window",category:"structures",radius:1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=[],o=e.chance(.6),r=o&&e.chance(.35),a=e.range(.66,1.1),c=e.range(.8,1.3),l=e.range(.85,1.15),h=l+c/2,u=e.range(.09,.14),f=e.range(.1,.16),d=e.chance(.72),g=d?16773586:14477558,y=d?16769966:12505832,m=U(e.chance(.55)?I.TIMBER:I.TIMBER_DARK,e.range(.9,1.08)),p=U(I.STONE_DARK,e.range(.9,1.1)),_=new G(a+.024,c+.024,.018);_.translate(0,h,.011),n.push({geometry:_,color:g,sway:0});const v=c+u*2.4;for(const K of[-1,1]){const q=new G(u,v,f);q.translate(K*(a+u)/2,h,f/2),n.push({geometry:q,color:m,sway:0})}const w=new G(a+u*2+.1,u*.92,f*1.06);w.translate(0,l+c+u*.46,f*.5),n.push({geometry:w,color:U(m,.92),sway:0});const b=new G(a+u*2+.17,.068,f*1.9);if(b.rotateX(-.07),b.translate(0,l-.028,f*.6),n.push({geometry:b,color:p,sway:0}),e.chance(.5))for(const K of[-1,1]){const q=new G(.07,.13,f*1.25);q.translate(K*a/2,l-.1,f*.62),n.push({geometry:q,color:U(p,.88),sway:0})}const S=.028,E=f*.82;for(const K of[-1,1]){const q=new G(a+S*1.4,S,S*1.1);q.translate(0,h+K*c/2,E),n.push({geometry:q,color:U(m,1.08),sway:0});const ot=new G(S*.9,c-S*1.6,S);ot.translate(K*a/2,h,E*.97),n.push({geometry:ot,color:U(m,1.12),sway:0})}const T=e.int(2,3),x=e.int(2,3),M=f*.62;for(let K=1;K<T;K++){const q=new G(.026,c,.03);q.translate(-a/2+a*K/T,h,M),n.push({geometry:q,color:U(m,1.02),sway:0})}for(let K=1;K<x;K++){const q=new G(a,.023,.027);q.translate(0,l+c*K/x,M*1.02),n.push({geometry:q,color:U(m,.96),sway:0})}if(o){const K=e.chance(.5)?U(I.CLOTH,e.range(.85,1.05)):U(I.WOOL,e.range(.85,1.05)),q=l+c+e.range(.04,.09),ot=e.range(.05,.08),pt=c*e.range(.94,1.06),wt=new Z(.016,.016,a+u*2.2,6);wt.rotateZ(Math.PI/2),wt.translate(0,q,ot),n.push({geometry:wt,color:U(I.TIMBER_DARK,.95),sway:0});for(const Ft of[-1,1]){const nt=r?a*e.range(.52,.56):a*e.range(.2,.3),ht=r?e.range(.022,.032):e.range(.05,.08),k=r?Ft*(a/2-nt/2):Ft*(a/2-nt*e.range(.3,.45)),ft=new G(nt,pt,ht);ft.translate(k,q-pt/2-.01,ot+ht*.5),n.push({geometry:ft,color:K,sway:0});const st=new G(nt*1.02,.05,ht*1.15);if(st.translate(k,q,ot+ht*.5),n.push({geometry:st,color:U(K,.88),sway:0}),!r){const gt=new G(nt*1.15,.05,ht*1.2);gt.translate(k,q-pt*e.range(.45,.6),ot+ht*.5),n.push({geometry:gt,color:U(K,.78),sway:0})}}}const A=r?.07:1,P=r?.3:1,C=new G(a*.97,c*.97,.012);C.translate(0,h,.026),s.push({geometry:C,color:Lr(g,P),sway:0});const F=new ke(1,1);F.scale(a*.85,c*.8,.3),F.translate(0,h,.05);const N=Math.max(a,c)*.85;s.push({geometry:F,color:(K,q)=>{const ot=Math.hypot(K/N,(q-h)/N);return Lr(g,Math.max(0,.3*P*(1-ot)))},sway:0});const D=a*.94,B=c*.94,H=vt([{geometry:(()=>{const K=new G(D,B,1,1,1,12);return K.translate(0,h,.5),K})(),color:(K,q,ot)=>Lr(g,.22*Math.max(0,1-ot)**1.35),sway:0}]),V=.014,et=vt([{geometry:(()=>{const K=new G(1,.012,1,4,1,4);return K.translate(0,V,0),K})(),color:(K,q,ot)=>{const pt=Math.max(Math.abs(K),Math.abs(ot))*2;return Lr(g,.62*(1-bS(.6,1.02,pt)))},sway:0}]),lt=vt(n),Mt=vt(s);t!==1&&(lt.scale(t,t,t),Mt.scale(t,t,t),H.scale(t,t,1),et.scale(1,t,1));const Lt=bt(lt,"window",0);Lt.add(bn(Mt,"window:glow"));const J={width:D*t,height:B*t,centreY:h*t,openness:A,azimuth:0,elevation:.6};if(Lt.userData.window=J,r)H.dispose(),et.dispose();else{const K=bn(H,"window:shaft");K.matrixAutoUpdate=!1,Lt.add(K);const q=bn(et,"window:pool");q.matrixAutoUpdate=!1,Lt.add(q)}const rt=new Yi(y,_S*A*e.around(1,.1)*t*t,wS*t,xS);return rt.name="window:sun",rt.position.set(0,h*t,f*t+.25),rt.castShadow=!1,Lt.add(rt),MS(Lt,e.range(-.7,.7),e.range(.38,.95)),Lt}};function lh(i,t,e){return i<t?t:i>e?e:i}function bS(i,t,e){const n=lh((e-i)/Math.max(t-i,1e-6),0,1);return n*n*(3-2*n)}function Lr(i,t){const e=t<0?0:t>1?1:t,n=Math.round((i>>16&255)*e),s=Math.round((i>>8&255)*e),o=Math.round((i&255)*e);return n<<16|s<<8|o}const Ca={name:"dresser",category:"furniture",radius:.7,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.92,1.24),o=e.range(.44,.56),r=e.range(.86,1.14),a=e.chance(.55)?I.TIMBER:I.TIMBER_DARK,c=a===I.TIMBER?I.TIMBER_DARK:I.TIMBER_PALE,l=e.chance(.45)?I.IRON:U(c,1.15),h=e.range(.07,.11),u=e.range(.03,.045),f=new G(s*.96,h,o*.94);f.translate(0,h/2,o/2),n.push({geometry:f,color:U(c,.86),sway:0});const d=r-h-u,g=new G(s,d+.03,o);g.translate(0,h+d/2,o/2),n.push({geometry:g,color:U(a,e.range(.95,1.05)),sway:0});const y=e.range(.015,.03),m=new G(s+y*2,u+.02,o+y);m.translate(0,r-u/2,o/2+y/2),n.push({geometry:m,color:U(c,e.range(.95,1.08)),sway:0});const p=e.int(4,6),_=o+e.range(.012,.02),v=e.range(.02,.035),w=.012,b=e.range(1.1,1.45),S=[];for(let A=0;A<p;A++)S.push(b**A);const E=S.reduce((A,P)=>A+P,0),T=d-w*(p+1);let x=h+w;for(let A=p-1;A>=0;A--){const P=T*S[A]/E,C=new G(s-v*2,P,.026);C.translate(0,x+P/2,_),n.push({geometry:C,color:U(a,e.range(.9,1.12)),sway:0});const N=s>1.05&&P<d*.26?[-s*.22,s*.22]:[0];for(const D of N){const B=new Z(e.range(.017,.024),e.range(.013,.018),e.range(.03,.045),6);B.rotateX(Math.PI/2),B.translate(D,x+P/2,_+.02),n.push({geometry:B,color:U(l,e.range(.92,1.1)),sway:0})}x+=P+w}const M=vt(n);return t!==1&&M.scale(t,t,t),bt(M,"dresser",0)}},Pa={name:"chest",category:"furniture",radius:.6,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.82,1.08),o=e.range(.44,.56),r=e.range(.04,.075),a=e.range(.3,.4),c=e.range(.055,.075),l=e.chance(.45),h=e.chance(.5)?I.TIMBER_DARK:I.BARK_PALE,u=U(I.IRON,e.range(.82,1)),d=e.chance(.35)?I.RUST:u;e();const g=r,y=g+a;if(e.chance(.35))for(const N of[-1,1]){const D=new G(s*e.range(.92,.97),r+.015,o*.16);D.translate(0,(r+.015)/2,N*(o-o*.16)/2),n.push({geometry:D,color:U(h,.85),sway:0})}else for(const N of[-1,1])for(const D of[-1,1]){const B=e.range(.075,.1),H=new G(B,r+.015,B*e.range(.9,1.1));H.translate(N*(s-B)/2,(r+.015)/2,D*(o-B)/2),n.push({geometry:H,color:U(h,.85),sway:0})}const p=new G(s,a,o);p.translate(0,g+a/2,0),n.push({geometry:p,color:h,sway:0});const _=e.range(.05,.07);for(const N of[-1,1]){const D=new G(_*e.range(.95,1.05),a*1.02,o*1.03);D.translate(N*(s-_*.5)/2,g+a/2,0),n.push({geometry:D,color:U(h,.8),sway:0})}const v=e.int(2,3),w=s*e.range(.5,.66),b=[];for(let N=0;N<v;N++){const D=v===1?0:-w/2+N/(v-1)*w;b.push(D);for(const B of[-1,1]){const H=new G(e.range(.035,.055),a*e.range(.96,1.02),.014);H.translate(D,g+a/2,B*(o+.012)/2),n.push({geometry:H,color:d,sway:0})}}if(e.chance(.5)){const N=new G(s*1.02,e.range(.026,.038),o*1.02);N.translate(0,y-.035,0),n.push({geometry:N,color:U(d,.9),sway:0})}const S=e.range(.07,.1),E=new G(S,S*e.range(1,1.35),.016);E.translate(0,y-S*.75,o/2+.006),n.push({geometry:E,color:U(d,1.15),sway:0});const T=new G(.012,.022,.008);T.translate(0,y-S*.75,o/2+.016),n.push({geometry:T,color:I.IRON_DARK,sway:0});const x=y-.012,M=-o/2+.025,A=o-.025+.02,P=(N,D)=>{N.rotateX(-0),N.translate(0,x,M),n.push({geometry:N,color:D,sway:0})};if(l)for(let D=0;D<3;D++){const B=D/2,H=new G(s*(1.03-B*.22)*e.range(.99,1.01),c*.62,(A+.03)*(1-B*.26));H.translate(0,B*c*.52+c*.2,A/2-.005),P(H,U(h,1.05+D*.04))}else{const N=new G(s*1.03,c,A+.03);N.translate(0,c/2,A/2-.005),P(N,U(h,1.06))}for(const N of b){const D=new G(e.range(.035,.055),c*(l?1.5:1.05),A*e.range(.86,.96));D.translate(N,c*(l?.75:.5),A*.48),P(D,d)}const C=new G(S*.55,S*1.15,.014);C.translate(0,c*.35-S*.4,A+.012),P(C,U(d,1.2));for(const N of[-s*.3,s*.3]){const D=new Z(.014,.014,e.range(.05,.07),6);D.rotateZ(Math.PI/2),D.translate(N,x,M-.006),n.push({geometry:D,color:U(d,.92),sway:0})}const F=vt(n);return t!==1&&F.scale(t,t,t),bt(F,"chest",0)}},ru={name:"washtub",category:"objects",radius:.5,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.34,.46),o=e.range(.26,.36),r=s*e.range(.72,.82),a=e.range(.028,.04),c=e.range(.04,.06),l=e.int(10,14),h=e.chance(.5)?I.TIMBER:I.TIMBER_DARK,u=U(I.IRON,e.range(.85,1.05)),f=[new tt(0,0),new tt(r,.006),new tt(s,o),new tt(s-a*.8,o),new tt(r-a,c),new tt(0,c)];n.push({geometry:new Jn(f,l),color:h,sway:0});const d=p=>r+(s-r)*p;for(const p of[e.range(.16,.26),e.range(.72,.84)]){const _=e.range(.03,.045),v=d(p-_/(2*o))*1.03,w=d(p+_/(2*o))*1.03,b=new Z(w,v,_,l);b.translate(0,o*p,0),n.push({geometry:b,color:u,sway:0})}const g=e.chance(.7),y=o*e.range(.35,.6);if(g){const p=d(y/o)-a,_=new Z(p,p*.96,.02,l);_.translate(0,y,0),n.push({geometry:_,color:I.WATER,sway:0})}const m=vt(n);return t!==1&&m.scale(t,t,t),bt(m,"washtub",0)}};function Bt(i,t,e,n=e,s=4){Xc.copy(t).sub(i);const o=Xc.length();if(o<1e-6)return new Z(e,e,1e-4,s);const r=new Z(n,e,o,s);return r.translate(0,o/2,0),r.applyQuaternion(ES.setFromUnitVectors(SS,Xc.divideScalar(o))),r.translate(i.x,i.y,i.z),r}const SS=new R(0,1,0),Xc=new R,ES=new jn,im={name:"broom",category:"objects",radius:.4,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(1.15,1.45),o=0,r=0,a=U(e.chance(.5)?I.BARK_PALE:I.TIMBER,e.range(.9,1.1)),c=e.pick([I.LEAF_DRY,I.GRASS_DRY,I.BARK]),l=e.chance(.6)?I.CLOTH:I.IRON,h=new R(Math.sin(o)*Math.cos(r),Math.cos(o),Math.sin(o)*Math.sin(r)),u=E=>h.clone().multiplyScalar(E),f=new R().crossVectors(h,new R(0,0,1)).normalize(),d=new R().crossVectors(h,f).normalize(),g=(E,T)=>f.clone().multiplyScalar(Math.cos(E)*T).add(d.clone().multiplyScalar(Math.sin(E)*T)),y=e.range(.26,.38),m=e.range(.07,.13),p=-1,_=y+.03,v=y*.35,w=s;n.push({geometry:Bt(u(v),u(w),e.range(.014,.019),e.range(.011,.015),6),color:a,sway:0});const b=e.int(24,34);for(let E=0;E<b;E++){const T=u(_+p*e.range(0,y*.35)),x=Math.PI*2/b,M=E*x+e.range(0,x*.6),A=e.range(.72,1.05),P=u(_+p*y*A).add(g(M,m*e.range(.35,1)*A));P.y=Math.max(P.y,e.range(.004,.018)),n.push({geometry:Bt(T.add(g(M,e.range(.006,.011))),P,e.range(.009,.014),.005,4),color:U(c,e.range(.82,1.18)),sway:0})}for(const E of[e.range(.02,.08),e.range(.18,.3)]){const T=_+p*y*E,x=e.range(.015,.024);n.push({geometry:Bt(u(T-x),u(T+x),e.range(.028,.036),e.range(.028,.036),8),color:U(l,e.range(.9,1.1)),sway:0})}for(const E of n)E.geometry.translate(0,.02,0);const S=vt(n);return t!==1&&S.scale(t,t,t),bt(S,"broom",0)}},au={name:"hanging-herbs",category:"objects",radius:.7,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(1.68,1.9),o=e.range(.8,1.35),r=e.range(.08,.12),a=U(I.BARK_PALE,e.range(.9,1.1)),c=new R(-o/2,s,r),l=new R(o/2,s,r);n.push({geometry:Bt(c,l,e.range(.016,.022),e.range(.016,.022),6),color:a,sway:0});for(const g of[c,l]){const y=new R(g.x,s+e.range(.05,.09),.012);n.push({geometry:Bt(y,g.clone(),e.range(.014,.019),.012,5),color:U(a,.88),sway:0});const m=new G(.05,e.range(.06,.09),.024);m.translate(g.x,y.y,.012),n.push({geometry:m,color:U(a,.8),sway:0})}const h=(g,y)=>(m,p)=>{const _=Math.max(0,Math.min(1,(s-p)/Math.max(g,1e-6)));return _*_*(3-2*_)*y},u=e.int(2,4),f=o*.82;for(let g=0;g<u;g++){const y=-f/2+(g+.5)/u*f+e.around(0,f/(u*3)),m=s+e.around(0,.006),p=r+e.around(0,.004);if(e.chance(.68)){const _=e.range(.24,.42),v=e.range(.05,.1),w=e.pick([I.LEAF_DRY,I.LEAF_DARK,I.GRASS_DRY,I.LEAF]),b=new Z(.026,.021,e.range(.03,.045),5);b.translate(y,m,p),n.push({geometry:b,color:I.CLOTH,sway:h(_,.06)});const S=e.int(3,5);for(let E=0;E<S;E++){const T=E/S*Math.PI*2+e.range(0,.6),x=e.range(.72,1),M=new R(y+Math.cos(T)*.008,m-.01,p+Math.sin(T)*.008),A=new R(y+Math.cos(T)*v*x,m-_*x,p+Math.sin(T)*v*x);n.push({geometry:Bt(M,A,e.range(.006,.009),.004,4),color:U(w,e.range(.8,1.05)),sway:h(_,e.range(.2,.32))});const P=e.int(1,2);for(let C=0;C<P;C++){const F=e.range(.45,.95),N=new G(e.range(.03,.055),e.range(.05,.1),e.range(.022,.04));N.rotateY(T),N.translate(M.x+(A.x-M.x)*F,M.y+(A.y-M.y)*F,M.z+(A.z-M.z)*F),n.push({geometry:N,color:U(w,e.range(.75,1.15)),sway:h(_,e.range(.24,.36))})}}}else{const _=e.int(4,7),v=e.range(.055,.08),w=v*_+.06,b=e.pick([I.MARKER_YELLOW,I.HIDE_PALE,I.WOOL,I.RUST]);n.push({geometry:Bt(new R(y,m+.03,p),new R(y+e.around(0,.02),m-w,p+e.around(0,.02)),.008,.006,4),color:I.CLOTH,sway:h(w,.28)});for(let S=0;S<_;S++){const E=m-.05-S*v,T=(S%2*2-1)*e.range(.012,.03),x=new ee(e.range(.028,.042),0);x.scale(1,e.range(.8,1.05),1),x.translate(y+T,E,p+e.around(0,.012)),n.push({geometry:x,color:U(b,e.range(.85,1.12)),sway:h(w,e.range(.15,.26))})}}}const d=vt(n);return t!==1&&d.scale(t,t,t),bt(d,"hanging-herbs",0)}},cu={name:"spinning-wheel",category:"furniture",radius:.5,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.62,.78),o=e.range(.13,.17),r=e.range(.038,.05),a=e.range(.05,.12),c=e.range(.42,.48),l=ot=>c-ot*Math.tan(a),h=e.chance(.5)?I.TIMBER:I.TIMBER_DARK,u=h===I.TIMBER?I.TIMBER_DARK:I.TIMBER_PALE,f=U(I.IRON,e.range(.85,1.05)),d=new G(s/Math.cos(a),r,o);d.rotateZ(-a),d.translate(0,c-r*Math.cos(a)/2,0),n.push({geometry:d,color:h,sway:0});const g=[[s*.32,o*.38,.34,.94],[s*.32,-o*.38,.34,-.94],[-s*.36,e.around(0,.015),-1,0]];for(const[ot,pt,wt,Ft]of g){const nt=e.range(.05,.09),ht=new R(ot,l(ot)-.018,pt),k=new R(ot+wt*nt,0,pt+Ft*nt);n.push({geometry:Bt(k,ht,e.range(.015,.019),e.range(.012,.016),5),color:u,sway:0})}const y=e.range(.2,.28),m=s*e.range(.28,.34),p=y*e.range(1.04,1.14),_=e.range(.05,.065),v=new R(m,l(m)+p,0);for(const ot of[-1,1]){const pt=ot*_;n.push({geometry:Bt(new R(m+e.around(0,.006),l(m)-.02,pt),new R(v.x,v.y,pt),e.range(.02,.026),e.range(.012,.016),5),color:u,sway:0})}const w=new Z(.011,.011,_*2+.04,5);w.rotateX(Math.PI/2),w.translate(v.x,v.y,v.z),n.push({geometry:w,color:f,sway:0});const b=e.range(.028,.036),S=new Z(b,b,e.range(.05,.07),6);S.rotateX(Math.PI/2),S.translate(v.x,v.y,v.z),n.push({geometry:S,color:u,sway:0});const E=new Xi(y,e.range(.013,.019),4,14);E.translate(v.x,v.y,v.z),n.push({geometry:E,color:h,sway:0});const T=e.int(6,10),x=e.range(0,Math.PI*2);for(let ot=0;ot<T;ot++){const pt=x+ot/T*Math.PI*2,wt=Math.cos(pt),Ft=Math.sin(pt);n.push({geometry:Bt(new R(v.x+wt*b*.9,v.y+Ft*b*.9,0),new R(v.x+wt*(y-.005),v.y+Ft*(y-.005),0),e.range(.007,.009),e.range(.005,.007),4),color:u,sway:0})}const M=s*e.range(.06,.16),A=e.around(0,.025),P=e.range(.2,.28),C=new G(P,.02,e.range(.09,.13));C.rotateZ(e.around(0,.07)),C.translate(M,e.range(.03,.045),A),n.push({geometry:C,color:h,sway:0});const F=new G(.03,.035,o*1.1);F.translate(M-P/2,.02,A),n.push({geometry:F,color:U(h,.85),sway:0});const N=e.range(0,Math.PI*2),D=e.range(.028,.042);n.push({geometry:Bt(new R(M+P*.36,.05,A+.02),new R(v.x+Math.cos(N)*D,v.y+Math.sin(N)*D,_+.02),.008,.007,4),color:u,sway:0});const B=-s*e.range(.26,.34),H=l(B),V=new G(e.range(.09,.12),.05,e.range(.06,.08));V.translate(B,H+.015,0),n.push({geometry:V,color:U(h,1.06),sway:0});const et=e.range(.11,.15),lt=H+.03+et,Mt=e.range(.06,.085);for(const ot of[-1,1]){const pt=new R(B+ot*Mt,H+.01,0);n.push({geometry:Bt(pt,new R(pt.x,lt,0),e.range(.015,.019),e.range(.009,.012),5),color:u,sway:0})}n.push({geometry:Bt(new R(B-Mt,lt,0),new R(B+Mt+.05,lt+.004,0),.007,.006,4),color:f,sway:0});const Lt=new Z(e.range(.02,.028),e.range(.02,.028),.07,7);Lt.rotateZ(Math.PI/2),Lt.translate(B,lt,0),n.push({geometry:Lt,color:U(e.pick([I.WOOL,I.CLOTH,I.HIDE_PALE]),e.range(.95,1.1)),sway:0});const J=B+Mt+.03,rt=e.range(.026,.034),K=new Z(rt,rt,.013,8);K.rotateZ(Math.PI/2),K.translate(J,lt,0),n.push({geometry:K,color:u,sway:0});for(const ot of[-1,1])n.push({geometry:Bt(new R(v.x,v.y+ot*y,0),new R(J,lt+ot*rt,0),.005,.004,4),color:U(I.CLOTH,.85),sway:0});if(e.chance(.55)){const ot=B-e.range(.08,.13),pt=new R(ot,l(ot)-.01,e.around(0,.02)),wt=new R(ot-e.range(.03,.09),l(ot)+e.range(.42,.56),pt.z+e.around(0,.05));n.push({geometry:Bt(pt,wt,e.range(.016,.021),e.range(.009,.013),5),color:u,sway:0});const Ft=e.pick([I.WOOL,I.LEAF_DRY,I.CLOTH]),nt=new Z(.026,.022,.03,6);nt.translate(wt.x,wt.y-.01,wt.z),n.push({geometry:nt,color:I.CLOTH,sway:0});const ht=e.int(4,6);for(let k=0;k<ht;k++){const ft=k/ht*Math.PI*2+e.range(0,.5),st=e.range(.03,.07);n.push({geometry:Bt(new R(wt.x+Math.cos(ft)*.01,wt.y-.02,wt.z+Math.sin(ft)*.01),new R(wt.x+Math.cos(ft)*st,wt.y+e.range(.05,.12),wt.z+Math.sin(ft)*st),e.range(.008,.013),e.range(.004,.007),4),color:U(Ft,e.range(.88,1.12)),sway:0})}}const q=vt(n);return t!==1&&q.scale(t,t,t),bt(q,"spinning-wheel",0)}},K0=["coat","coat","hat","bag","rope"],TS=new R(0,1,0),AS=new jn,sm={name:"wall-pegs",category:"furniture",radius:.65,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(1.5,1.76),o=e.range(.7,1.3),r=e.chance(.5)?I.TIMBER_DARK:I.BARK_PALE,a=new G(o,e.range(.08,.11),.028);a.translate(0,s,.014),n.push({geometry:a,color:r,sway:0});for(const m of[-1,1]){const p=new G(e.range(.05,.07),.14,.02);p.translate(m*o*.86/2,s,.008),n.push({geometry:p,color:U(r,.82),sway:0})}const c=e.int(3,6),l=o*.78,h=Array.from({length:c},(m,p)=>c===1?0:-l/2+p/(c-1)*l),u=e.int(0,c-1),f={coat:.22,hat:.19,rope:.17,bag:.14},d=new Array(c).fill(null),g=(m,p)=>{for(let _=0;_<c;_++){const v=d[_];if(v&&Math.abs(h[m]-h[_])<f[p]+f[v]+.03)return}d[m]=p};g(u,e.pick(K0));for(let m=0;m<c;m++)m===u||!e.chance(.62)||g(m,e.pick(K0));for(let m=0;m<c;m++){const p=h[m],_=new R(p,s-e.range(0,.012),.02),v=new R(p,s+e.range(.02,.04),e.range(.09,.13)),w=e.range(.013,.017),b=e.range(.017,.022);n.push({geometry:Bt(_,v,w,b,6),color:U(r,e.range(.95,1.15)),sway:0});const S=d[m];if(!S)continue;const E=v.z*.72;if(S==="coat"){const T=e.pick([I.CLOTH,I.WOOL,I.LEAF_DARK,I.HIDE,I.STONE_DARK]),x=e.range(.45,.8),M=e.range(.24,.34),A=e.int(3,5),P=(F,N)=>{const D=Math.max(0,Math.min(1,(s-N)/x));return D*D*(3-2*D)*.12};for(let F=0;F<A;F++){const N=F/(A-1),D=s-.02-N*x*.92,B=x*1.06/A,H=new G(M*(1-N*e.range(.18,.34)),B,e.range(.07,.12)*(1-N*.3));H.rotateY(e.around(0,.22)),H.rotateZ(e.around(0,.09)),H.translate(p+e.around(0,.02),D-B/2,E+e.around(0,.012)),n.push({geometry:H,color:U(T,e.range(.88,1.1)),sway:P})}const C=new G(M*.42,.06,.09);C.rotateY(e.around(0,.2)),C.translate(p,s+.005,E),n.push({geometry:C,color:U(T,1.14),sway:0})}else if(S==="hat"){const T=U(e.pick([I.HIDE_DARK,I.CLOTH,I.EARTH]),e.range(.9,1.1)),x=e.range(.13,.18),M=e.range(.1,.15),A=.011,P=e.range(.014,.02),C=x*.66,F=[new tt(C-A,0),new tt(x,0),new tt(x*.985,P),new tt(C,P),new tt(C*.95,M*.62),new tt(C*.7,M*.93),new tt(.006,M),new tt(.005,M-A*.8),new tt(C*.7-A*.8,M*.93-A*.5),new tt(C*.95-A,M*.62),new tt(C-A,P),new tt(C-A,0)],N=e.range(.06,.14),D=new R(0,-Math.sin(N),Math.cos(N)),B=x*Math.sin(N)+.014,H=Math.min(v.z-B,M*.45),V=(B-_.z)/(v.z-_.z),et=w+(b-w)*V,lt=H*((v.y-_.y)/(v.z-_.z)+Math.tan(N)),Mt=(C-A)*(1-.35*(H/M)**2),Lt=Math.max(0,Mt-et-lt-.004),J=new R(p,_.y+(v.y-_.y)*V-Lt,B),rt=new Jn(F,8);rt.applyQuaternion(AS.setFromUnitVectors(TS,D)),rt.translate(J.x,J.y,J.z),n.push({geometry:rt,color:T,sway:0});const K=J.clone().addScaledVector(D,M-A*.4),q=new No(.015,6,4);q.translate(K.x,K.y,K.z),n.push({geometry:q,color:U(T,.86),sway:0})}else if(S==="bag"){const T=U(e.pick([I.HIDE,I.HIDE_DARK,I.TIMBER_DARK]),e.range(.9,1.1)),x=e.range(.17,.24),M=e.range(.18,.26),A=s-e.range(.14,.24),P=_.clone().lerp(v,.55),C=.009,F=w+(b-w)*.55+C,N=new R(p,P.y-.05,P.z+.028);for(const V of[-1,1])n.push({geometry:Bt(new R(p+V*x*.34,A-.02,E+.012),N.clone().add(new R(V*.006,V*.003,0)),C,C*.85,4),color:U(T,V>0?1.04:.96),sway:0});const D=new R(p,P.y+F,P.z+.004);n.push({geometry:Bt(N,D,C,C*.9,4),color:U(T,1.08),sway:0}),n.push({geometry:Bt(N.clone().lerp(D,.82),new R(p,P.y-.03,Math.max(P.z-.042,.012)),C*.78,C*.7,4),color:U(T,.92),sway:0});const B=new G(x,M,e.range(.07,.1));B.rotateY(e.around(0,.16)),B.translate(p,A-M/2+.02,E+.012),n.push({geometry:B,color:T,sway:0});const H=new G(x*1.04,M*.4,.02);H.translate(p,A-M*.2+.02,E+.012+e.range(.04,.055)),n.push({geometry:H,color:U(T,1.15),sway:0})}else{const T=e.range(.09,.13),x=e.range(.02,.03),M=(E-_.z)/(v.z-_.z),A=w+(b-w)*M,P=T-x,C=Math.max(0,P-A*1.2-.006),F=new Xi(T,x,4,9);F.rotateY(e.around(0,.25)),F.translate(p,_.y+(v.y-_.y)*M-C,E),n.push({geometry:F,color:U(I.CLOTH,e.range(.85,1.05)),sway:0})}}const y=vt(n);return t!==1&&y.scale(t,t,t),bt(y,"wall-pegs",0)}},lu={name:"hoist",category:"structures",radius:2.4,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(2.8,5.4),o=e.range(2.5,4.2),r=U(I.IRON,e.range(.85,1.05)),a=e.range(.08,.11),c=o;for(const[g,y,m]of[[c+.11,.3,.05],[c-.11,.3,.05]]){const p=new G(s,m,y);p.translate(0,g,0),n.push({geometry:p,color:U(r,1.06),sway:0})}const l=new G(s*.995,.24,.07);l.translate(0,c,0),n.push({geometry:l,color:r,sway:0});for(const g of[-1,1]){const y=g*s/2-g*.3,m=new Z(a*.85,a,o,6);m.translate(y,o/2,0),n.push({geometry:m,color:r,sway:0});const p=new G(a*4.4,.07,a*4.4);p.translate(y,.035,0),n.push({geometry:p,color:U(r,.84),sway:0});const _=new R(y,o-.75,0),v=new R(y-g*.7,c-.16,0);n.push({geometry:Bt(_,v,.045,.04),color:U(r,.9),sway:0})}const h=e.range(-s*.28,s*.28),u=new G(.38,.26,.3);u.translate(h,c-.28,0),n.push({geometry:u,color:U(r,1.14),sway:0});const f=new Z(.13,.13,.12,8);if(f.rotateX(Math.PI/2),f.translate(h,c-.28,.2),n.push({geometry:f,color:U(I.RUST,1.05),sway:0}),e.chance(.72)){const g=e.range(.8,Math.max(1,c-1.4)),y=.035,m=.011,p=y*1.35,_=.075,v=g+_,w=v+_,b=w+.11,S=c-.42,E=b-y*.5,T=Math.max(p*2,S-E),x=Math.max(3,Math.round(T/p)+1);for(let N=0;N<x;N++){const D=S-N*T/(x-1),B=new Xi(y,m,4,6);B.rotateY(N%2===0?0:Math.PI/2),B.translate(h,D,0),n.push({geometry:B,color:U(r,.92),sway:0})}n.push({geometry:Bt(new R(h,b,0),new R(h,w,0),.03,.026,6),color:U(r,1.1),sway:0});const M=new R(h,v,0),A=6,P=N=>{const D=N/A*Math.PI*1.55;return new R(M.x+Math.sin(D)*_,M.y+Math.cos(D)*_,M.z)};for(let N=0;N<A;N++)n.push({geometry:Bt(P(N),P(N+1),.024*(1-N/(A*2.4)),.022,5),color:U(r,1.05),sway:0});const C=P(A),F=new R(C.x-_*.5,C.y+_*.55,C.z);n.push({geometry:Bt(C,F,.021,.005,5),color:U(r,1.15),sway:0})}const d=vt(n);return t!==1&&d.scale(t,t,t),bt(d,"hoist",0)}},RS=5,CS=18,pa={name:"lantern",category:"objects",radius:.28,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=[],o=Qp(e),r=U(I.IRON,e.range(.85,1.08)),c=e.chance(.35)?U(I.RUST,e.range(.85,1.05)):r,l=e.chance(.45),h=e.range(.062,.082),u=h*(l?3.1:2.1)*e.range(.92,1.08),f=h*.16,d=h*.24,g=new Z(h*1.24,h*1.4,d,8);g.translate(0,d/2,0),n.push({geometry:g,color:U(c,.82),sway:0});const y=h*.16,m=new G(h*2.1,y,h*2.1);m.translate(0,d+y/2,0),n.push({geometry:m,color:U(c,.9),sway:0});const p=d+y;for(const D of[-1,1])for(const B of[-1,1]){const H=new G(f,u,f);H.translate(D*(h*2-f)/2,p+u/2,B*(h*2-f)/2),n.push({geometry:H,color:c,sway:0})}for(const D of[p+u*.06,p+u*.94])for(const B of[0,1]){const H=B===0,V=new G(H?h*2:f*.9,f*.9,H?f*.9:h*2-f*2.2);for(const et of[-1,1]){const lt=V.clone(),Mt=(h*2-f)/2;lt.translate(H?0:et*Mt,D,H?et*Mt:0),n.push({geometry:lt,color:U(c,.92),sway:0})}V.dispose()}const _=p+u,v=h*.7,w=new Z(h*.5,h*1.55,v,4);w.rotateY(Math.PI/4),w.translate(0,_+v/2,0),n.push({geometry:w,color:U(c,1.1),sway:0});const b=h*.3,S=new Z(h*.34,h*.42,b,6);S.translate(0,_+v+b/2,0),n.push({geometry:S,color:U(c,.88),sway:0});const E=h*.5,T=new Xi(E,f*.42,4,10);T.rotateY(e.chance(.5)?0:Math.PI/2),T.translate(0,_+v+b+E*.85,0),n.push({geometry:T,color:U(c,1.05),sway:0});const x=p+u*e.range(.24,.34),M=new Z(h*.46,h*.56,h*.3,8);M.translate(0,p+h*.15,0),n.push({geometry:M,color:o.color,sway:0}),tm(s,o,0,x,0,h*.42);const A=vt(n),P=vt(s),C=e.range(0,Math.PI*2);A.rotateY(C),P.rotateY(C),t!==1&&(A.scale(t,t,t),P.scale(t,t,t));const F=bt(A,"lantern",0);F.add(bn(P,"lantern:glow"));const N=new Yi(o.light,RS*e.around(1,.12)*t*t,CS*t,tu);return N.position.set(0,x*t,0),N.castShadow=!1,F.add(N),F}},j0={turf:{color:I.GRASS,variation:.1,step:"grass"},meadow:{color:I.GRASS_DRY,variation:.13,step:"grass"},dirt:{color:I.EARTH,variation:.09,step:"earth"},gravel:{color:7235158,variation:.16,step:"gravel"},cobble:{color:I.STONE,variation:.19,step:"stone"},flagstone:{color:I.STONE_PALE,variation:.08,step:"stone"},boards:{color:I.TIMBER,variation:.11,step:"wood"},crop:{color:I.LEAF_DRY,variation:.15,step:"grass"},mire:{color:4536876,variation:.12,step:"mud"},rock:{color:I.STONE_DARK,variation:.13,step:"stone"}};function PS(i,t,e,n,s,o){const r=s-e,a=o-n,c=r*r+a*a,l=c===0?0:Math.max(0,Math.min(1,((i-e)*r+(t-n)*a)/c));return Math.hypot(i-(e+r*l),t-(n+a*l))}function J0(i,t,e){for(let n=i.length-1;n>=0;n--){const s=i[n];switch(s.kind){case"blot":if(Math.hypot(t-s.at[0],e-s.at[1])<=s.radius)return s.material;break;case"field":if(t>=s.min[0]&&t<=s.max[0]&&e>=s.min[1]&&e<=s.max[1])return s.material;break;case"path":{const o=s.width/2;for(let r=0;r+1<s.through.length;r++){const a=s.through[r],c=s.through[r+1];if(PS(t,e,a[0],a[1],c[0],c[1])<=o)return s.material}break}}}return null}function IS(i,t){let e=Math.round(i/1.2)*374761393+Math.round(t/1.2)*668265263|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function oo(i){const t=i<0?0:i>1?1:i;return t*t*t*(t*(t*6-15)+10)}function LS(i,t,e,n,s,o){const r=s-e,a=o-n,c=r*r+a*a,l=c===0?0:Math.max(0,Math.min(1,((i-e)*r+(t-n)*a)/c));return Math.hypot(i-(e+r*l),t-(n+a*l))}class DS{size;resolution;landforms;patches;detail;rockAngle;base;constructor(t){this.size=t.size,this.resolution=t.resolution,this.landforms=t.landforms,this.patches=t.patches??[],this.detail=t.detail??[],this.rockAngle=t.rockAngle??34,this.base=t.base??"turf"}heightAt(t,e){let n=0;for(const s of this.landforms)switch(s.kind){case"terrace":break;case"hill":{const o=Math.hypot(t-s.at[0],e-s.at[1]),r=oo(1-o/s.radius);n+=s.height*(s.falloff?r**s.falloff:r);break}case"ridge":{const o=LS(t,e,s.from[0],s.from[1],s.to[0],s.to[1]);n+=s.height*oo(1-o/s.width);break}case"basin":{const o=Math.hypot(t-s.at[0],e-s.at[1]);n-=s.depth*oo(1-o/s.radius);break}case"rim":{const r=this.size/2-Math.max(Math.abs(t),Math.abs(e));n+=s.height*oo(1-r/s.inset);break}}for(const s of this.landforms){if(s.kind!=="terrace")continue;const o=Math.hypot(t-s.at[0],e-s.at[1]);if(o>=s.radius+s.blend)continue;const r=o<=s.radius?1:oo((s.radius+s.blend-o)/s.blend);n=n*(1-r)+s.height*r}return n}get detailRegions(){return this.detail}slopeAt(t,e,n=this.resolution){const s=(this.heightAt(t+n,e)-this.heightAt(t-n,e))/(2*n),o=(this.heightAt(t,e+n)-this.heightAt(t,e-n))/(2*n);return Math.atan(Math.hypot(s,o))*180/Math.PI}build(){const t=Math.round(this.size/this.resolution),e=this.size/2,n=this.resolution,s=new Uint8Array(t*t);for(let _=0;_<t;_++)for(let v=0;v<t;v++){const w=-e+(v+.5)*n,b=-e+(_+.5)*n;let S=1;for(const E of this.detail)Math.hypot(w-E.at[0],b-E.at[1])<=E.radius&&(S=Math.max(S,E.level));s[_*t+v]=S}const o=(_,v)=>_<0||v<0||_>=t||v>=t?1:s[_*t+v],r=[],a=[],c=[],l=new R,h=new R,u=new R,f=new R,d=new R,g=new R,y=new Yt,m=(_,v)=>{r.push(_.x,_.y,_.z),a.push(v.x,v.y,v.z),c.push(y.r,y.g,y.b)};for(let _=0;_<t;_++)for(let v=0;v<t;v++){const w=s[_*t+v],b=-e+v*n,S=-e+_*n,E=o(_,v-1),T=o(_,v+1),x=o(_-1,v),M=o(_+1,v),A=(P,C)=>P===0&&E<w?this.alongEdge(b,S,b,S+n,C,E):P===1&&T<w?this.alongEdge(b+n,S,b+n,S+n,C,T):C===0&&x<w?this.alongEdge(b,S,b+n,S,P,x):C===1&&M<w?this.alongEdge(b,S+n,b+n,S+n,P,M):this.heightAt(b+P*n,S+C*n);for(let P=0;P<w;P++)for(let C=0;C<w;C++){const F=C/w,N=(C+1)/w,D=P/w,B=(P+1)/w,H=[[b+F*n,A(F,D),S+D*n],[b+F*n,A(F,B),S+B*n],[b+N*n,A(N,B),S+B*n],[b+N*n,A(N,D),S+D*n]];for(const[V,et,lt]of[[0,1,2],[0,2,3]])l.set(...H[V]),h.set(...H[et]),u.set(...H[lt]),f.subVectors(h,l),d.subVectors(u,l),g.crossVectors(f,d).normalize(),g.y<0&&g.negate(),y.set(this.faceColor(g.y,(l.y+h.y+u.y)/3,(l.x+h.x+u.x)/3,(l.z+h.z+u.z)/3)),m(l,g),m(h,g),m(u,g)}}const p=new Ie;return p.setAttribute("position",new ae(r,3)),p.setAttribute("normal",new ae(a,3)),p.setAttribute("color",new ae(c,3)),p.setAttribute(Ds,new ae(new Float32Array(r.length/3),1)),bt(p,"terrain",0)}alongEdge(t,e,n,s,o,r){const a=1/r,l=Math.min(r-1,Math.floor(o/a))*a,h=l+a,u=this.heightAt(t+(n-t)*l,e+(s-e)*l),f=this.heightAt(t+(n-t)*h,e+(s-e)*h);return u+(f-u)*((o-l)/a)}materialAt(t,e){return this.slopeAt(t,e)>this.rockAngle?"rock":J0(this.patches,t,e)??this.base}stepAt(t,e){return j0[this.materialAt(t,e)].step}faceColor(t,e,n,s){const r=Math.acos(Math.min(1,Math.max(-1,t)))*180/Math.PI>this.rockAngle?"rock":J0(this.patches,n,s)??this.base,a=j0[r],c=1+(IS(n,s)-.5)*a.variation*2,l=1-Math.min(Math.max(e/55,0),1)*.16;return U(a.color,c*l)}}const NS={name:"tree",category:"foliage",radius:2.2,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(3.2,4.6),o=e.range(0,Math.PI*2),r=s*e.range(.55,.68),a=new Z(e.range(.11,.17),e.range(.24,.34),r,6);a.translate(0,r/2,0),n.push({geometry:a,color:I.BARK,sway:Re(0,s,2.2)});const c=e.int(2,4);for(let f=0;f<c;f++){const d=r*e.range(.6,.95),g=e.range(.7,1.3),y=new Z(.045,.09,g,4);y.translate(0,g/2,0),y.rotateZ(e.range(.5,1.05)),y.rotateY(o+f/c*Math.PI*2+e.around(0,.4)),y.translate(0,d,0),n.push({geometry:y,color:I.BARK_PALE,sway:Re(0,s,1.4)})}const l=e.int(3,5),h=r+e.range(.3,.7);for(let f=0;f<l;f++){const d=e.range(.75,1.35),g=new ee(d,0);g.rotateX(e.range(0,Math.PI)),g.rotateY(e.range(0,Math.PI)),g.scale(1,e.range(.72,.95),1);const y=e.range(0,.95),m=o+f/l*Math.PI*2+e.around(0,.5);g.translate(Math.cos(m)*y,h+e.around(0,.45),Math.sin(m)*y),n.push({geometry:g,color:e.chance(.25)?I.LEAF_DARK:I.LEAF,sway:e.range(.82,1)})}const u=vt(n);return t!==1&&u.scale(t,t,t),bt(u,"tree",e()*Math.PI*2)}},US={name:"bush",category:"foliage",radius:1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.int(3,5),o=e.range(.35,.7);for(let a=0;a<s;a++){const c=e.range(.3,.62),l=new ee(c,0);l.rotateX(e.range(0,Math.PI)),l.rotateY(e.range(0,Math.PI)),l.scale(1,e.range(.6,.85),1);const h=a/s*Math.PI*2+e.around(0,.6),u=e.range(0,o),f=c*e.range(.55,.85);l.translate(Math.cos(h)*u,f,Math.sin(h)*u),n.push({geometry:l,color:e.chance(.2)?I.LEAF_DRY:I.LEAF,sway:(d,g)=>Math.min(1,.35+g*.75)})}const r=vt(n);return t!==1&&r.scale(t,t,t),bt(r,"bush",e()*Math.PI*2)}},om={name:"small-grass-clump",category:"foliage",radius:.55,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.int(30,46);for(let r=0;r<s;r++){const a=e.range(.16,.6),c=new te(e.range(.016,.032),a,3);c.translate(0,a/2,0),c.scale(1,1,e.range(.3,.55));const l=e.range(.1,.75)*(a/.6);c.rotateZ(e.chance(.5)?l:-l),c.rotateY(e.range(0,Math.PI*2));const h=e.range(0,Math.PI*2),u=Math.sqrt(e())*.26;c.translate(Math.cos(h)*u,0,Math.sin(h)*u),n.push({geometry:c,color:e.chance(.3)?I.GRASS_DRY:I.GRASS,sway:(f,d)=>Math.max(0,d/a)**1.5})}const o=vt(n);return t!==1&&o.scale(t,t,t),bt(o,"small-grass-clump",e()*Math.PI*2)}},rm={name:"large-grass-clump",category:"foliage",radius:1.6,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.7,.95),o=e.int(5,8),r=[];for(let h=0;h<o;h++){const u=h/o*Math.PI*2+e.range(-.5,.5),f=e.range(.25,.85)*s;r.push({x:Math.cos(u)*f,z:Math.sin(u)*f,grip:e.range(.24,.42)})}const a=e.int(430,620);for(let h=0;h<a;h++){let u,f,d=!1;if(e.chance(.5)){const p=r[e.int(0,r.length-1)],_=e.range(0,Math.PI*2),v=Math.sqrt(e())*p.grip;u=p.x+Math.cos(_)*v,f=p.z+Math.sin(_)*v,d=!0}else{const p=e.range(0,Math.PI*2),_=Math.sqrt(e())*s;u=Math.cos(p)*_,f=Math.sin(p)*_}const g=d?e.range(.3,.72):e.range(.1,.34),y=new te(e.range(.014,.03),g,3);y.translate(0,g/2,0),y.scale(1,1,e.range(.3,.55));const m=e.range(.1,.8)*(g/.72);y.rotateZ(e.chance(.5)?m:-m),y.rotateY(e.range(0,Math.PI*2)),y.translate(u,0,f),n.push({geometry:y,color:e.chance(d?.2:.4)?I.GRASS_DRY:I.GRASS,sway:(p,_)=>Math.max(0,_/g)**1.5})}const c=e.int(14,26);for(let h=0;h<c;h++){const u=r[e.int(0,r.length-1)],f=e.range(0,Math.PI*2),d=Math.sqrt(e())*(e.chance(.7)?u.grip*1.4:s),g=(e.chance(.7)?u.x:0)+Math.cos(f)*d,y=(e.chance(.7)?u.z:0)+Math.sin(f)*d,m=e.range(.6,1.05),p=e.range(.05,.34),_=e.range(0,Math.PI*2),v=Math.cos(_)*p,w=Math.sin(_)*p,b=new Z(.0035,.006,m,4);b.translate(0,m/2,0),b.rotateX(v),b.rotateZ(w),b.translate(g,0,y),n.push({geometry:b,color:U(I.GRASS_DRY,e.range(.9,1.1)),sway:(x,M)=>Math.max(0,M/m)**1.3});const S=x=>zS.set(0,x*m,0).applyAxisAngle(FS,v).applyAxisAngle(OS,w).add(kS.set(g,0,y)),E=e.int(3,6),T=e.range(.14,.24);for(let x=0;x<E;x++){const M=x/E,A=.011*(1-M*.4),P=A*e.range(3,4.5),C=new te(A,P,3);C.translate(0,P/2,0),C.scale(1,1,.6),C.rotateZ(e.range(.5,1.1)),C.rotateY(x/E*Math.PI*2+e.range(0,.6));const F=S(1-T*M);C.translate(F.x,F.y,F.z),n.push({geometry:C,color:U(e.chance(.4)?10260316:I.GRASS_DRY,e.range(.9,1.12)),sway:1})}}const l=vt(n);return t!==1&&l.scale(t,t,t),bt(l,"large-grass-clump",e()*Math.PI*2)}},FS=new R(1,0,0),OS=new R(0,0,1),zS=new R,kS=new R,am={name:"mushroom",category:"foliage",radius:.4,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.chance(.42)?"button":e.chance(.55)?"open":"puffball",o=e.pick([I.RUST,I.EARTH,I.STONE_PALE,I.BARK_PALE,9058862,12100712]),r=e.chance(.5)?I.CLOTH:14209212,a=s==="puffball"?e.int(4,9):e.int(3,7);for(let l=0;l<a;l++){const h=e(),u=e.range(.045,.13)*(.5+h*.75),f=e.range(0,Math.PI*2),d=Math.sqrt(e())*.22,g=Math.cos(f)*d,y=Math.sin(f)*d;if(s==="puffball"){const w=u*e.range(.5,.9),b=new Z(u*.62,u*.4,w,6);b.translate(g,w/2,y),n.push({geometry:b,color:U(r,.9),sway:0});const S=new ee(u*1.15,1);S.scale(1,e.range(.78,.95),1),S.translate(g,w+u*.72,y),n.push({geometry:S,color:U(r,e.range(.92,1.1)),sway:0});continue}const m=e.around(0,.2),p=u*e.range(1.1,2.4),_=u*e.range(.24,.36),v=new Z(_*.86,_*1.2,p,6);if(v.translate(0,p/2,0),v.rotateZ(m),v.translate(g,0,y),n.push({geometry:v,color:U(r,e.range(.94,1.06)),sway:0}),s==="button"){const w=u*(.8+h*.5),b=u*(1.35-h*.6),S=new te(w,b,e.int(7,9));S.translate(0,b*.34,0),S.rotateZ(m),S.translate(g,p,y),n.push({geometry:S,color:o,sway:0})}else{const w=u*(1.3+h*.7),b=new Z(w*.55,w,u*.2,9);b.rotateZ(m),b.translate(g,p+u*.08,y),n.push({geometry:b,color:o,sway:0});const S=new Z(w*1.04,w*.9,u*.13,9);S.rotateZ(m),S.translate(g,p+u*.2,y),n.push({geometry:S,color:U(o,1.14),sway:0});const E=new Z(w*.86,w*.5,u*.1,9);E.rotateZ(m),E.translate(g,p-u*.02,y),n.push({geometry:E,color:U(r,.88),sway:0})}}const c=vt(n);return t!==1&&c.scale(t,t,t),bt(c,"mushroom",0)}},cm={name:"rock",category:"nature",radius:.9,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=e.range(.35,1.1),s=new ee(n,n>.7?1:0);s.deleteAttribute("normal"),s.deleteAttribute("uv");const o=Xh(s);s.dispose();const r=o.getAttribute("position"),a=new R;for(let h=0;h<r.count;h++)a.fromBufferAttribute(r,h),a.multiplyScalar(e.range(.72,1.28)),r.setXYZ(h,a.x,a.y,a.z);r.needsUpdate=!0,o.scale(1,e.range(.6,.85),e.range(.85,1.15)),o.translate(0,n*e.range(.28,.45),0),o.computeVertexNormals();const c=[{geometry:o,color:e.chance(.3)?I.STONE_DARK:I.STONE,sway:0}],l=vt(c);return t!==1&&l.scale(t,t,t),bt(l,"rock",0)}};function BS(i,t){const e=new ee(t,0);e.deleteAttribute("normal"),e.deleteAttribute("uv");const n=Xh(e);e.dispose();const s=n.getAttribute("position"),o=new R;for(let r=0;r<s.count;r++)o.fromBufferAttribute(s,r),o.multiplyScalar(i.range(.78,1.2)),s.setXYZ(r,o.x,o.y,o.z);return s.needsUpdate=!0,n.scale(1,i.range(.45,.7),i.range(.85,1.1)),n.computeVertexNormals(),n}const lm={name:"cairn",category:"nature",radius:.7,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.int(4,7);let o=e.range(.26,.38),r=0;for(let c=0;c<s;c++){const l=BS(e,o);l.computeBoundingBox();const h=l.boundingBox,u=h?(h.max.y-h.min.y)/2:o*.5;l.rotateY(e.range(0,Math.PI*2)),r+=u*(c===0?1:1.55),l.translate(e.around(0,o*.14),r,e.around(0,o*.14)),n.push({geometry:l,color:e.chance(.35)?I.STONE_DARK:I.STONE,sway:0}),o*=e.range(.76,.9)}const a=vt(n);return t!==1&&a.scale(t,t,t),bt(a,"cairn",0)}},hm={name:"stump",category:"foliage",radius:.75,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.3,.7),o=e.range(.22,.36),r=o*e.range(1.25,1.6),a=e.int(6,9),c=e.range(0,.12),l=new Z(o,r,s,a);l.translate(0,s/2,0),l.rotateZ(c),n.push({geometry:l,color:I.BARK,sway:0});const h=new Z(o*.94,o*.94,.04,a);h.translate(0,s,0),h.rotateZ(c),n.push({geometry:h,color:I.BARK_PALE,sway:0});const u=e.int(3,6);for(let d=0;d<u;d++){const g=e.range(.3,.6),y=new Z(.04,.11,g,4);y.translate(0,-g/2,0),y.rotateZ(e.range(1.05,1.45)),y.rotateY(d/u*Math.PI*2+e.around(0,.5)),y.translate(0,e.range(.05,.16),0),n.push({geometry:y,color:I.BARK,sway:0})}const f=vt(n);return t!==1&&f.scale(t,t,t),bt(f,"stump",0)}},um={name:"fence",category:"structures",radius:2.4,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.int(3,5),o=e.range(1.1,1.6),r=e.range(.85,1.25),a=e.int(2,3),c=s*o;for(let h=0;h<=s;h++){const u=h*o-c/2,f=e.around(0,.09),d=r*e.range(.85,1.1),g=new G(.11,d,.11);g.translate(0,d/2,0),g.rotateZ(f),g.rotateY(e.around(0,.25)),g.translate(u,0,e.around(0,.06)),n.push({geometry:g,color:I.TIMBER,sway:0})}for(let h=0;h<s;h++){if(e.chance(.22))continue;const u=h*o-c/2+o/2;for(let f=0;f<a;f++){const d=r*(.32+f/Math.max(a-1,1)*.52),g=new G(o*1.02,.07,.05);g.rotateZ(e.around(0,.05)),g.translate(u,d+e.around(0,.03),e.around(0,.03)),n.push({geometry:g,color:I.TIMBER_DARK,sway:0})}}const l=vt(n);return l.rotateY(e.range(0,Math.PI)),t!==1&&l.scale(t,t,t),bt(l,"fence",0)}},dm={name:"post",category:"structures",radius:.4,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.9,2.1),o=e.range(.07,.13),r=e.range(.02,.16),a=e.range(0,Math.PI*2),c=new G(o*2,s,o*2);if(c.translate(0,s/2,0),c.rotateZ(r),c.rotateY(a),n.push({geometry:c,color:I.TIMBER,sway:0}),e.chance(.4)){const h=e.range(.5,1.1),u=new G(h,o*1.4,o*1.4);u.translate(0,s*e.range(.6,.85),0),u.rotateZ(r),u.rotateY(a+e.around(0,.3)),n.push({geometry:u,color:I.TIMBER_DARK,sway:0})}if(e.chance(.45)){const h=new G(o*2.5,.09,o*2.5);h.translate(0,s-.09,0),h.rotateZ(r),h.rotateY(a),n.push({geometry:h,color:I.RUST,sway:0})}const l=vt(n);return t!==1&&l.scale(t,t,t),bt(l,"post",0)}},fm={name:"trough",category:"objects",radius:1.1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(1.4,2.1),o=e.range(.5,.75),r=e.range(.4,.6),a=e.range(.09,.14),c=e.chance(.55),l=c?I.STONE:I.TIMBER,h=new G(s-a,a,o-a);h.translate(0,a/2+.01,0),n.push({geometry:h,color:c?I.STONE_DARK:I.TIMBER_DARK,sway:0});for(const f of[-1,1]){const d=new G(s*.99,r,a);d.translate(0,r/2,f*(o-a)/2),n.push({geometry:d,color:l,sway:0});const g=new G(a,r*.985,o*.985);g.translate(f*(s-a)/2,r/2,0),n.push({geometry:g,color:l,sway:0})}if(e.chance(.6)){const f=new G(s-a*1.6,.03,o-a*1.6);f.translate(0,r*e.range(.55,.78),0),n.push({geometry:f,color:2899782,sway:0})}const u=vt(n);return u.rotateY(e.range(0,Math.PI)),t!==1&&u.scale(t,t,t),bt(u,"trough",0)}};function Ne(i,t,e,n,s){const o=new ee(t,e);o.deleteAttribute("normal"),o.deleteAttribute("uv");const r=Xh(o);o.dispose();const a=r.getAttribute("position"),c=new R;for(let l=0;l<a.count;l++)c.fromBufferAttribute(a,l),c.multiplyScalar(i.range(n,s)),a.setXYZ(l,c.x,c.y,c.z);return a.needsUpdate=!0,r.computeVertexNormals(),r}function us(i,t){return i.range(t[0],t[1])}function HS(i,t,e,n,s){const o=e.range(0,100),r=e.range(0,100),a=e.range(0,100),c=(h,u,f)=>{let d=Math.imul(Math.round(h)*374761393+Math.round(u)*668265263,1);return d=Math.imul(d^d>>>13,1274126177)+Math.round(f)*951274213,d^=d>>>16,(d>>>0)%1e3/1e3},l=(h,u,f)=>{const d=Math.floor(h),g=Math.floor(u),y=Math.floor(f),m=Yc(h-d),p=Yc(u-g),_=Yc(f-y);let v=0;for(let w=0;w<=1;w++)for(let b=0;b<=1;b++)for(let S=0;S<=1;S++){const E=(S?m:1-m)*(b?p:1-p)*(w?_:1-_);v+=c(d+S,g+b,y+w)*E}return v};return(h,u,f)=>l(h*n+o,u*n+r,f*n+a)<s?t:i}function Yc(i){return i*i*(3-2*i)}function zo(i,t,e,{scale:n=1}){const s=[],o=us(e,t.length),r=us(e,t.girth),a=us(e,t.legLength),c=r*e.range(.62,.78),l=e.pick(t.hide),h=a+r/2,u=t.woolly||o>1.2?1:0,f=t.woolly?Ne(e,r/2,u,.86,1.24):new ee(r/2,u);f.scale(c/r,1,o/r),f.rotateZ(e.around(0,.05)),f.translate(0,h,0);const d=t.woolly?GS:t.patch?HS(l,e.pick(t.patch),e,2.6/r,t.patchCoverage??.45):l;s.push({geometry:f,color:d,sway:0});const g=us(e,t.neck),y=us(e,t.neckRise),m=new R(0,h+r*.18,o*.4),p=r*.45,_=g+p,v=new Z(r*.17,r*.24,_,6);v.translate(0,_/2-p,0),v.rotateX(Math.PI/2-y),v.translate(m.x,m.y,m.z),s.push({geometry:v,color:d,sway:0});const w=new R(0,m.y+Math.sin(y)*g,m.z+Math.cos(y)*g),b=us(e,t.headSize);if(t.head)s.push(...t.head({at:w,size:b,coat:d,extremity:t.extremity,rng:e}));else{const E=new ee(b,0);if(E.scale(.85,.9,t.headStretch),E.rotateY(e.around(0,.2)),E.translate(w.x,w.y,w.z),s.push({geometry:E,color:d,sway:0}),t.snout>0){const T=new Z(b*t.snout*.52,b*t.snout*.66,b*.62,6);T.rotateX(Math.PI/2),T.translate(w.x,w.y-b*.13,w.z+b*t.headStretch*.66),s.push({geometry:T,color:t.extremity,sway:0})}}for(const E of[-1,1]){if(!t.head&&t.ears!=="none"){const T=new te(b*.28,b*.85,4);T.translate(0,b*.42,0),t.ears==="floppy"?T.rotateZ(E*2.4):t.ears==="side"?T.rotateZ(E*1.5):T.rotateZ(E*.35),T.translate(w.x+E*b*.6,w.y+b*.4,w.z),s.push({geometry:T,color:t.extremity,sway:0})}if(t.horns!=="none"){const T=b*(t.horns==="curved"?1.5:.7),x=new te(b*.16,T,5);x.translate(0,T/2,0),x.rotateZ(E*(t.horns==="curved"?1.1:.5)),x.translate(w.x+E*b*.45,w.y+b*.55,w.z),s.push({geometry:x,color:Q0,sway:0})}for(const T of[-1,1]){const x=h,M=new Z(t.legThickness*.78,t.legThickness,x,5);if(M.translate(0,x/2,0),M.rotateZ(E*e.range(-.02,.07)),M.translate(E*c*.34,0,T*o*e.range(.26,.34)),s.push({geometry:M,color:l,sway:0}),t.feet==="paw"){const A=new G(t.legThickness*2.4,a*.11,t.legThickness*3.6);A.translate(E*c*.34,a*.055,T*o*.3+t.legThickness*.9),s.push({geometry:A,color:t.extremity,sway:0})}else{const A=new Z(t.legThickness*1.15,t.legThickness*1.05,a*.13,5);A.translate(E*c*.34,a*.06,T*o*.3),s.push({geometry:A,color:VS,sway:0})}}}if(t.tail!=="none"){const E=new R(0,h+r*.16,-o*.42);if(t.tail==="carried"){const M=o*e.range(.16,.6)/4;let A=-e.range(.7,1),P=E.x,C=E.y,F=E.z;for(let N=0;N<4;N++){const D=r*.075*(1-N/5),B=new Z(D*.7,D,M*1.15,4);B.translate(0,M/2,0),B.rotateX(A),B.translate(P,C,F),s.push({geometry:B,color:l,sway:qc}),C+=M*Math.cos(A),F+=M*Math.sin(A),A+=e.range(.15,.35)}}else if(t.tail==="curl"){const x=r*.06;for(let M=0;M<9;M++){const A=M/8,P=A*Math.PI*2.2,C=new ee(x*(1-A*.25),0);C.translate(Math.sin(P)*r*.1,E.y+A*r*.2,E.z-r*.04-(1-Math.cos(P))*r*.05),s.push({geometry:C,color:t.extremity,sway:0})}}else{const T=o*(t.tail==="flowing"?.4:.3),x=e.range(.08,.42),M=new Z(r*.07,r*.028,T,4);M.translate(0,-T/2,0),M.rotateX(x),M.translate(E.x,E.y,E.z),s.push({geometry:M,color:l,sway:qc});const A=T*.94,P=new ee(r*.115,0);P.scale(.75,t.tail==="flowing"?1.7:1.05,.75),P.rotateX(x),P.translate(E.x,E.y-A*Math.cos(x),E.z-A*Math.sin(x)),s.push({geometry:P,color:Q0,sway:qc})}}const S=vt(s);return S.rotateY(e.range(0,Math.PI*2)),n!==1&&S.scale(n,n,n),bt(S,i,e()*Math.PI*2)}const GS=12433060,Q0=9076841,VS=3814187,qc=.4,WS={length:[1.9,2.3],girth:[.85,1.05],legLength:[.62,.78],legThickness:.085,neck:[.4,.55],neckRise:[.05,.3],headSize:[.24,.3],headStretch:1.5,snout:.38,ears:"side",horns:"stub",tail:"switch",woolly:!1,hide:[I.WOOL,I.STONE_PALE],extremity:I.HOG,patch:[I.COW_BLACK,I.COW_BLACK,I.HIDE_DARK],patchCoverage:.46},pm={name:"bovine",category:"animals",radius:1.4,build:(i={})=>zo("bovine",WS,xt(i.seed??1),i)},XS={length:[.95,1.25],girth:[.55,.7],legLength:[.34,.46],legThickness:.045,neck:[.18,.28],neckRise:[.2,.5],headSize:[.13,.17],headStretch:1.4,snout:.32,ears:"side",horns:"none",tail:"switch",woolly:!0,hide:[I.HIDE_DARK,I.STONE_DARK],extremity:I.HIDE_DARK},mm={name:"ovine",category:"animals",radius:.8,build:(i={})=>zo("ovine",XS,xt(i.seed??1),i)},YS={length:[1.9,2.2],girth:[.75,.9],legLength:[.95,1.15],legThickness:.07,neck:[.6,.8],neckRise:[.75,1.05],headSize:[.2,.25],headStretch:1.9,snout:.3,ears:"perked",horns:"none",tail:"flowing",woolly:!1,hide:[I.HIDE_DARK,I.HIDE,I.BARK],extremity:I.HIDE_DARK},gm={name:"equine",category:"animals",radius:1.4,build:(i={})=>zo("equine",YS,xt(i.seed??1),i)},qS={length:[1.1,1.5],girth:[.6,.78],legLength:[.25,.36],legThickness:.055,neck:[.1,.2],neckRise:[0,.2],headSize:[.19,.24],headStretch:1.45,snout:.75,ears:"floppy",horns:"none",tail:"curl",woolly:!1,hide:[I.HOG,I.HIDE_PALE,I.HIDE_DARK],extremity:I.HOG,patch:[I.HIDE_DARK,I.HIDE],patchCoverage:.3},ym={name:"porcine",category:"animals",radius:.95,build:(i={})=>zo("porcine",qS,xt(i.seed??1),i)},vm={name:"poultry",category:"animals",radius:.35,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.16,.23),o=e.range(.09,.16),r=e.pick([I.FOWL,I.HIDE_PALE,I.HIDE_DARK,I.CLOTH]),a=o+s*.75,c=new ee(s,0);c.scale(.8,.95,1.25),c.rotateX(e.range(.15,.35)),c.translate(0,a,0),n.push({geometry:c,color:r,sway:0});const l=s*e.range(.42,.55),h=new R(0,a+s*e.range(.75,1.05),s*.6),u=new Z(s*.2,s*.28,s*.55,5);u.rotateX(-.5),u.translate(0,a+s*.5,s*.42),n.push({geometry:u,color:r,sway:0});const f=new ee(l,0);f.translate(h.x,h.y,h.z),n.push({geometry:f,color:r,sway:0});const d=new te(l*.35,l*.8,4);d.rotateX(Math.PI/2),d.translate(h.x,h.y-l*.15,h.z+l*.9),n.push({geometry:d,color:I.MARKER_YELLOW,sway:0});const g=e.int(2,4);for(let p=0;p<g;p++){const _=p/Math.max(g-1,1),v=new te(l*.14,l*(.7-_*.3),3);v.scale(1,1,.4),v.translate(h.x,h.y+l*.95,h.z-_*l*.7),n.push({geometry:v,color:I.COMB,sway:.4})}if(e.chance(.6)){const p=new ee(l*.22,0);p.scale(.5,1.1,.7),p.translate(h.x,h.y-l*.75,h.z+l*.5),n.push({geometry:p,color:I.COMB,sway:.3})}const y=e.int(3,5);for(let p=0;p<y;p++){const _=(p/Math.max(y-1,1)-.5)*.8,v=new te(s*.2,s*e.range(.9,1.4),3);v.scale(1,1,.35),v.translate(0,s*.55,0),v.rotateX(e.range(-1.1,-.7)),v.rotateY(_),v.translate(0,a+s*.35,-s*.85),n.push({geometry:v,color:r,sway:.45})}for(const p of[-1,1]){const _=a,v=new Z(s*.055,s*.05,_,4);v.translate(0,_/2,0),v.rotateZ(p*e.range(0,.12)),v.translate(p*s*.24,0,e.around(0,s*.1)),n.push({geometry:v,color:I.MARKER_YELLOW,sway:0});const w=new te(s*.13,s*.09,3);w.rotateX(Math.PI),w.translate(p*s*.24,s*.04,s*.06),n.push({geometry:w,color:I.MARKER_YELLOW,sway:0})}const m=vt(n);return m.rotateY(e.range(0,Math.PI*2)),t!==1&&m.scale(t,t,t),bt(m,"poultry",e()*Math.PI*2)}},_m={name:"archway",category:"structures",radius:1.8,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(1.5,1.9),o=e.range(2.6,3.1),r=e.range(.42,.58),a=e.range(.5,.7),c=e.chance(.5)?I.STONE:I.STONE_DARK;for(const u of[-1,1]){const f=e.int(3,4),d=o/f;for(let g=0;g<f;g++){const y=1-g/f*.12,m=new G(r*y,d*1.02,a*y);m.translate(u*(s+r)/2+e.around(0,.02),d*(g+.5),e.around(0,.02)),n.push({geometry:m,color:U(c,e.around(1,.08)),sway:0})}}const l=new G(s+r*2.5,e.range(.34,.46),a*1.1);if(l.translate(0,o+.18,0),n.push({geometry:l,color:U(c,.92),sway:0}),e.chance(.55)){const u=new G(s+r*1.6,.18,a*.8);u.translate(e.around(0,.06),o+.48,0),n.push({geometry:u,color:U(c,1.08),sway:0})}const h=vt(n);return t!==1&&h.scale(t,t,t),bt(h,"archway",0)}},$S=4.5,ZS=11,KS=16747068,jS=.86,hu={name:"forge",category:"structures",radius:1.3,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=[],o=e.range(.85,1.8),r=e.range(.7,1.25),a=e.range(.62,.92),c=e.range(.3,1),l=U(I.IRON,e.range(.85,1.05)),h=U(e.chance(.5)?8014392:7029814,e.range(.9,1.1)),u=2762532,f=e.int(2,4);for(let N=0;N<f;N++){const D=a/f,B=new G(o*(1-N*.015),D,r*(1-N*.015));B.translate(0,D*(N+.5),0),n.push({geometry:B,color:U(h,e.range(.9,1.12)),sway:0})}const d=new G(o*1.02,.06,r*1.02);d.translate(0,a+.03,0),n.push({geometry:d,color:u,sway:0});const g=.1;for(const[N,D,B,H]of[[o*1.02,g,0,-r/2],[g,r*1.02,-o/2,0],[g,r*1.02,o/2,0]]){const V=new G(N,g*1.6,D);V.translate(B,a+g*.8,H),n.push({geometry:V,color:U(h,.86),sway:0})}const y=e.int(5,9);for(let N=0;N<y;N++){const D=e.range(0,Math.PI*2),B=Math.sqrt(e())*o*.22,H=e.range(.035,.075),V=new ee(H,0);V.rotateY(e.range(0,Math.PI)),V.translate(Math.cos(D)*B,a+.06+H*.5,Math.sin(D)*B),n.push({geometry:V,color:e.chance(c*.45)?10239780:U(u,e.range(.85,1.3)),sway:0})}const m=a+.09,p=new ke(o*.2*(.6+c*.6),0);p.scale(1,.32,.8),p.translate(0,m,0),s.push({geometry:p,color:KS,sway:0});const _=new ke(o*.09,0);_.scale(1,.5,1),_.translate(e.around(0,.05),m+.02,e.around(0,.05)),s.push({geometry:_,color:16765066,sway:0});const v=a+e.range(.6,1.15),w=v+e.range(.65,1.3),b=o*e.range(.62,.75),S=e.range(.16,.22),E=.03,T=new Jn([new tt(b,v),new tt(S,w),new tt(S-E,w),new tt(b-E,v),new tt(b,v)],6);T.rotateY(Math.PI/6),n.push({geometry:T,color:U(l,.92),sway:0});const x=new Z(b*1.05,b*1.05,E*2.2,6);x.rotateY(Math.PI/6),x.translate(0,v+E,0),n.push({geometry:x,color:U(l,1.1),sway:0});const M=new Z(S*.94,S*.94,2.4,6);M.translate(0,w+1.2,0),n.push({geometry:M,color:U(l,.86),sway:0});for(const N of[-1,1]){const D=new G(.06,v-a,.06);D.translate(N*o/2*.86,a+(v-a)/2,-r*.36),n.push({geometry:D,color:l,sway:0})}const A=vt(n),P=vt(s);t!==1&&(A.scale(t,t,t),P.scale(t,t,t));const C=bt(A,"forge",0);C.add(bn(P,"forge:glow"));const F=new Yi(16749632,$S*(.35+c*.9)*e.around(1,.1)*t*t,ZS*t,1.35);return F.position.set(0,(m+.1)*t,0),F.castShadow=!1,C.add(F),C}},uu={name:"anvil",category:"objects",radius:.5,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.42,.56),o=e.range(.2,.26),r=e.range(.44,.58),a=e.range(.12,.16),c=U(I.IRON,e.range(.88,1.06)),l=new Z(o,o*1.12,s,8);l.translate(0,s/2,0),n.push({geometry:l,color:I.TIMBER_DARK,sway:0});const h=e.range(.055,.08),u=new G(r*.62,h,a*1.5);u.translate(0,s+h/2,0),n.push({geometry:u,color:U(c,.88),sway:0});const f=e.range(.1,.15),d=new G(r*.34,f,a*.78);d.translate(0,s+h+f/2,0),n.push({geometry:d,color:U(c,.94),sway:0});const g=e.range(.09,.13),y=s+h+f,m=new G(r,g,a);m.translate(0,y+g/2,0),n.push({geometry:m,color:(b,S)=>S>y+g*.85?U(c,1.22):c,sway:0});const p=e.range(.16,.24),_=new te(a*.46,p,6);_.rotateZ(-Math.PI/2),_.translate(r/2+p/2-.01,y+g*.55,0),n.push({geometry:_,color:U(c,1.06),sway:0});const v=new G(e.range(.07,.11),g*.86,a*.92);v.translate(-r/2-.03,y+g*.5,0),n.push({geometry:v,color:U(c,.98),sway:0});const w=vt(n);return w.rotateY(e.range(0,Math.PI*2)),t!==1&&w.scale(t,t,t),bt(w,"anvil",0)}},JS=.78,QS=[[.3,0],[.275,.05],[.225,.14],[.195,.25],[.178,.36],[.172,.44],[.125,.51],[.062,.56],[.045,.56],[.05,.5],[.092,.43],[.122,.35],[.146,.25],[.175,.14],[.222,.05],[.258,0],[.3,0]],wm={name:"bell",category:"objects",radius:.75,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.85,1.25),o=.56*s,r=.3*s,a=o+e.range(.55,.85),c=e.range(.09,.12),l=r*2+e.range(.28,.44);for(const w of[-1,1]){const b=new G(c,a,c*.92);b.translate(0,a/2,0),b.rotateZ(w*-.055),b.translate(w*l/2,0,0),n.push({geometry:b,color:I.TIMBER,sway:0});const S=new G(c*.62,l*.42,c*.6);S.translate(0,l*.21,0),S.rotateZ(w*.72),S.translate(w*l/2,a-l*.3,0),n.push({geometry:S,color:I.TIMBER_DARK,sway:0})}const h=new G(l+c*2.4,c,c);h.translate(0,a-c/2,0),n.push({geometry:h,color:I.TIMBER,sway:0});const f=a-c-o-e.range(.05,.1),d=QS.map(([w,b])=>new tt(w*s,b*s)),g=new Jn(d,10);g.translate(0,f,0);const y=U(I.BRONZE,e.range(.9,1.1)),m=f+o*e.range(.42,.62);n.push({geometry:g,color:(w,b)=>b>m?I.PATINA:y,sway:0});const p=new G(.055*s,.12*s,.055*s);p.translate(0,f+o+.05*s,0),n.push({geometry:p,color:U(y,.85),sway:0});const _=new ee(.055*s,0);_.translate(e.around(0,.02),f+.09*s,e.around(0,.02)),n.push({geometry:_,color:I.IRON_DARK,sway:0});const v=vt(n);return v.rotateY(e.range(0,Math.PI*2)),t!==1&&v.scale(t,t,t),bt(v,"bell",0)}},tE=.72;function eE({at:i,size:t,coat:e,extremity:n,rng:s}){const o=[],r=t*1.45,a=new Z(t*.62,t*.78,t*1.5,4);a.rotateX(Math.PI/2),a.rotateZ(Math.PI/4),a.scale(r/(t*1.1),t*1.15/(t*1.1),1),a.translate(i.x,i.y,i.z-t*.15),o.push({geometry:a,color:e,sway:0});const c=t*s.range(.45,1.05),l=i.y-t*.34,h=i.z+t*.6,u=new Z(t*.3,t*.46,c,4);u.rotateX(Math.PI/2),u.rotateZ(Math.PI/4),u.scale(1,.78,1),u.translate(i.x,l,h+c/2),o.push({geometry:u,color:e,sway:0});const f=new G(t*.52,t*.26,c*.8);f.translate(i.x,l-t*.28,h+c*.44),o.push({geometry:f,color:n,sway:0});const d=new G(t*.36,t*.3,t*.22);d.translate(i.x,l+t*.08,h+c+t*.05),o.push({geometry:d,color:2367260,sway:0});const g=new G(r*.82,t*.2,t*.28);g.translate(i.x,i.y+t*.22,h-t*.08),o.push({geometry:g,color:e,sway:0});const y=s.range(.75,1.05);for(const m of[-1,1]){const p=new te(t*.34,t*y,3);p.translate(0,t*y/2,0),p.scale(1,1,.34),p.rotateZ(m*s.range(.16,.34)),p.rotateX(-s.range(.05,.22)),p.translate(i.x+m*r*.34,i.y+t*.4,i.z-t*.35),o.push({geometry:p,color:n,sway:0})}return o}const nE={length:[.5,.68],girth:[.19,.24],legLength:[.19,.38],legThickness:.026,feet:"paw",neck:[.15,.21],neckRise:[.6,1],headSize:[.1,.13],headStretch:1,snout:0,ears:"none",head:eE,horns:"none",tail:"carried",woolly:!1,hide:[I.HIDE,I.HIDE_DARK,I.HIDE_PALE,I.STONE_DARK],extremity:I.HIDE_DARK},xm={name:"dog",category:"animals",radius:.55,build:(i={})=>zo("dog",nE,xt(i.seed??1),i)},du="village",Mm=96,tf=Mm/2,iE=[{kind:"basin",at:[0,0],radius:34,depth:3},{kind:"hill",at:[18,-12],radius:12,height:4.5,falloff:1.3},{kind:"hill",at:[20,8],radius:10,height:3.5,falloff:1.4},{kind:"hill",at:[8,20],radius:11,height:3,falloff:1.5},{kind:"terrace",at:[-6,1],radius:26,height:-3,blend:9},{kind:"terrace",at:[0,34],radius:6,height:-.4,blend:7},{kind:"rim",inset:13,height:14}],sE=[{kind:"field",min:[16,-6],max:[30,8],material:"crop"},{kind:"field",min:[-30,14],max:[-16,28],material:"meadow"},{kind:"blot",at:[-24,-6],radius:11,material:"meadow"},{kind:"path",through:[[0,34],[0,22],[0,15]],width:3,material:"dirt"},{kind:"path",through:[[4,2],[14,-2],[24,-2]],width:2.4,material:"dirt"},{kind:"path",through:[[-9,13],[0,8],[9,1]],width:2.2,material:"cobble"},{kind:"path",through:[[-2,17],[0,8],[1,-2]],width:2.2,material:"cobble"},{kind:"path",through:[[7,15],[0,8],[-7,0]],width:2.2,material:"cobble"},{kind:"path",through:[[11,8],[0,8],[-12,6]],width:2.2,material:"cobble"},{kind:"blot",at:[-16,-10],radius:7,material:"mire"}],vi=new DS({size:Mm,resolution:3,landforms:iE,patches:sE,detail:[{at:[-6,1],radius:26,level:2},{at:[-6,1],radius:20,level:4},{at:[0,34],radius:5,level:3}]}),oE=vi,ki=new R(0,0,34),_s={forge:[14.2,5.6],anvil:[13,3.8]},hh=[-5.4,19.2],uh=[-8.5,4.5];function Dr(i,t){return[i[0],vi.heightAt(i[0],i[1])+t,i[1]]}const rE={bed:[{model:"wind",id:"wind",options:{gain:.15,tone:3e3}},{model:"rain",id:"rain",options:{gain:.5,intensity:0,surface:"earth",articulation:.3}}],emitters:[{model:"foliage",id:"wood-north",at:[-26,4,-31],options:{density:260,tone:.78,gain:.4,articulation:.2},refDistance:3,maxDistance:24,rolloff:1.6,reverb:.3},{model:"foliage",id:"wood-east",at:[33,4,-9],options:{density:240,tone:.85,gain:.38,articulation:.22},refDistance:3,maxDistance:22,rolloff:1.6,reverb:.3},{model:"foliage",id:"hedge",at:[-11,1,14],options:{density:150,tone:1.5,gain:.24,articulation:.34},refDistance:1.4,maxDistance:13,reverb:.22},{model:"bird",id:"bird-west",at:[-24,6,4],options:{pitch:2500,interval:7,gain:.07,tone:2700},refDistance:5,maxDistance:46,rolloff:1.3,reverb:.9},{model:"bird",id:"bird-south",at:[17,5.5,34],options:{pitch:3100,interval:11,gain:.055,tone:3e3},refDistance:5,maxDistance:44,rolloff:1.35,reverb:.9},{model:"fire",id:"forge",at:Dr(_s.forge,jS),options:{gain:.5,intensity:.85,tone:1.15,crackle:.65,draught:.12},refDistance:2,maxDistance:20,rolloff:1.5,reverb:.35},{model:"friction",id:"gate",at:[ki.x+.9,1.7,ki.z],options:{motion:"weather",speed:.22,force:.85,pitch:150,decay:1.1,bright:.2,roughness:.15,gain:.3},refDistance:3,maxDistance:40,rolloff:1.4,reverb:.5},{model:"crowd",id:"folk",at:[-3,1.4,16],options:{voices:5,density:.4,pitch:132,variety:.55,gain:.36,distance:1450},refDistance:5,maxDistance:30,rolloff:1.5,reverb:.6}],scatter:[{sound:"hammer",id:"smith",at:Dr(_s.anvil,JS),spread:[.7,.2,.7],every:13,force:[.45,1],options:{gain:.5,tone:.95,damping:.35,bounces:2},refDistance:3,maxDistance:52,rolloff:1.1,reverb:.55},{sound:"clatter",id:"yards",at:[0,1,8],spread:[13,.5,11],every:26,force:[.3,.85],options:{material:"wood",gain:.45,tone:1.05},refDistance:2.5,maxDistance:34,rolloff:1.25,reverb:.4},{sound:"animal",id:"cattle",at:[-16,1.1,-10],spread:[4,.2,4],every:44,force:[.5,.9],voices:1,options:{kind:"cow",gain:.55,tone:.97},refDistance:4,maxDistance:48,rolloff:1.1,reverb:.5},{sound:"animal",id:"sheep",at:[-16.5,.9,-11],spread:[5,.2,5],every:27,force:[.4,.85],voices:1,options:{kind:"sheep",gain:.42,tone:1.06},refDistance:3.5,maxDistance:40,rolloff:1.2,reverb:.45},{sound:"animal",id:"fowl",at:[-2,.7,6],spread:[8,.15,8],every:16,force:[.3,.7],voices:1,options:{kind:"fowl",gain:.3,tone:1},refDistance:2.5,maxDistance:26,rolloff:1.35,reverb:.35},{sound:"animal",id:"dog",at:Dr(uh,.4),spread:[2.2,.2,2.2],every:36,force:[.45,1],voices:1,options:{kind:"dog",gain:.5,tone:.94},refDistance:4,maxDistance:50,rolloff:1.15,reverb:.55},{sound:"bell",id:"bell",at:Dr(hh,tE),spread:[0,0,0],every:95,rhythm:"periodic",force:[.8,1],voices:1,options:{hz:186,decay:12,gain:.34,strokes:2,interval:2.6,warble:1.1},refDistance:8,maxDistance:70,rolloff:.9,reverb:1}]};function aE(){return{id:du,name:"Arkstin Village",environment:{...Aa,fogNear:30,fogFar:190,footstepReverb:.5,soundscape:rE},spawn:{position:bm(0,28),yaw:Math.PI},floor:-20,surfaceAt:(i,t)=>vi.stepAt(i,t),groundAt:(i,t)=>vi.heightAt(i,t),build:lE}}function bm(i,t,e=0){return new R(i,vi.heightAt(i,t)+e,t)}function De(i,t,e,n,s,o=!0){t.position.copy(bm(e,n)),t.rotation.y=s,i.add(o?Te(t):t)}function en(i,t,e){const n=xt(e.seed),[s,o]=e.from??[0,0],r=e.maxSlope??26,a=e.avoid??[],c=t.solid!==!1;for(let l=0;l<e.count;l++){const h=n.range(0,Math.PI*2),u=Math.sqrt(n())*e.within,f=s+Math.cos(h)*u,d=o+Math.sin(h)*u,g=n.range(0,Math.PI*2),y=e.scale?n.range(e.scale[0],e.scale[1]):1,m=n.int(1,1e6);if(Math.abs(f)>tf-8||Math.abs(d)>tf-8||vi.slopeAt(f,d)>r)continue;const p=vi.heightAt(f,d);if(e.minHeight!==void 0&&p<e.minHeight||e.maxHeight!==void 0&&p>e.maxHeight)continue;let _=!1;for(const[v,w,b]of a)if(Math.hypot(f-v,d-w)<b){_=!0;break}_||De(i,t.build({seed:m,scale:y}),f,d,g,c)}}const ds=[[0,8,17],[0,24,10],[0,33,8],[-16,-10,9]],cE=[[-9,13],[-2,17],[7,15],[11,8],[9,1],[1,-2],[-7,0],[-12,6]],ef=[0,8];function lE(){const i=new we;i.name="ArkstinVillage",i.add(Te(vi.build())),De(i,_m.build({seed:4714}),ki.x,ki.z,Math.PI),cE.forEach(([t,e],n)=>{De(i,la.build({seed:700+n*131}),t,e,Math.atan2(ef[0]-t,ef[1]-e))});for(let t=0;t<5;t++){const e=t/5*Math.PI*2;De(i,um.build({seed:400+t}),-16+Math.cos(e)*8,-10+Math.sin(e)*8,e)}return De(i,fm.build({seed:91}),-13,-13,.4),en(i,pm,{seed:8801,count:2,within:5,from:[-16,-10],maxSlope:20}),en(i,mm,{seed:8802,count:4,within:6,from:[-16,-10],maxSlope:20}),en(i,ym,{seed:8803,count:2,within:5,from:[-17,-8],maxSlope:20}),en(i,vm,{seed:8804,count:6,within:9,from:[-2,6],maxSlope:18}),en(i,gm,{seed:8805,count:2,within:6,from:[-24,4],maxSlope:18}),De(i,Co.build({seed:2211}),4,11,.3),De(i,Vi.build({seed:2212}),6,12,1.1),De(i,yi.build({seed:2213}),-4,5,0),De(i,yi.build({seed:2214}),-5,6.5,.7),De(i,Vi.build({seed:2215}),9,5,.5),De(i,dm.build({seed:2216}),-2,11,0),De(i,hu.build({seed:5401}),_s.forge[0],_s.forge[1],Math.PI),De(i,uu.build({seed:5402}),_s.anvil[0],_s.anvil[1],.6),De(i,wm.build({seed:5403}),hh[0],hh[1],-.5),De(i,xm.build({seed:5404}),uh[0],uh[1],1.9,!1),De(i,bs.build({seed:3301}),3,7,2.2),De(i,bs.build({seed:3302}),-3,9,1.1),De(i,bs.build({seed:3303}),6,3,-.8),en(i,NS,{seed:5001,count:130,within:42,maxSlope:30,maxHeight:9,avoid:ds,scale:[.8,1.35]}),en(i,US,{seed:5002,count:90,within:42,maxSlope:32,avoid:ds}),en(i,rm,{seed:5002,count:40,within:42,maxSlope:24,avoid:ds}),en(i,om,{seed:5003,count:120,within:42,maxSlope:28,avoid:ds}),en(i,am,{seed:5004,count:40,within:36,maxSlope:22,avoid:ds}),en(i,hm,{seed:5005,count:16,within:36,maxSlope:24,avoid:ds}),en(i,cm,{seed:6001,count:70,within:45,maxSlope:44,minHeight:4,scale:[.7,1.6]}),en(i,lm,{seed:6002,count:7,within:38,maxSlope:20,minHeight:5}),i}const Pi=Math.PI*2,hE={name:"oak",category:"foliage",radius:3.4,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(7.3,9.4),o=e.range(.38,.52),r=s*e.range(.2,.27),a=s*e.range(.27,.34),c=s*e.range(.7,.77),l=e.range(0,Pi),h=e.range(.02,.09),u=w=>{const b=w/s,S=h*b**2;return new R(Math.cos(l)*S,w,Math.sin(l)*S)},f=()=>U(I.BARK,e.range(.88,1.12)),d=e.range(.38,.55);n.push({geometry:Bt(new R(0,0,0),u(d*1.08),o*e.range(1.28,1.45),o*1.02,8),color:f(),sway:Re(0,s,3)});const g=2;for(let w=0;w<g;w++){const b=d+(r-d)*w/g,S=d+(r-d)*(w+1)/g,E=u(b),T=u(S);T.lerp(E,-.06),n.push({geometry:Bt(E,T,o*(1.02-.1*w),o*(1.02-.1*(w+1)),8),color:f(),sway:Re(0,s,3)})}const y=e.int(4,6),m=e.range(0,Pi);for(let w=0;w<y;w++){const b=u(r*e.range(.6,.95)),S=m+w*2.399963+e.around(0,.4),E=a*e.range(.34,.5),T=new R(b.x+Math.cos(S)*E,b.y+e.range(1,1.8),b.z+Math.sin(S)*E);if(n.push({geometry:Bt(b,T,o*.46,o*.32,6),color:f(),sway:Re(0,s,2)}),e.chance(.75)){const F=E*e.range(.72,1.02),N=Ne(e,e.range(.34,.58),0,.74,1.26);N.scale(1,e.range(.58,.8),1),N.translate(b.x+Math.cos(S)*F,T.y+e.around(.05,.3),b.z+Math.sin(S)*F),n.push({geometry:N,color:e.chance(.6)?I.LEAF_DARK:U(I.LEAF,e.range(.84,.98)),sway:e.range(.5,.7)})}const x=S+e.around(0,.3),M=a*e.range(.48,.64),A=new R(b.x+Math.cos(x)*M,T.y+(c-T.y)*e.range(.42,.6),b.z+Math.sin(x)*M),P=T.clone().lerp(b,.09);if(n.push({geometry:Bt(P,A,o*.35,o*.22,5),color:f(),sway:Re(0,s,1.6)}),e.chance(.8)){const F=Ne(e,e.range(.4,.68),0,.75,1.25);F.scale(1,e.range(.62,.84),1),F.translate(A.x+e.around(0,.22),A.y+e.around(.1,.28),A.z+e.around(0,.22)),n.push({geometry:F,color:e.chance(.45)?I.LEAF_DARK:U(I.LEAF,e.range(.88,1.02)),sway:e.range(.68,.84)})}const C=e.int(2,3);for(let F=0;F<C;F++){const N=x+e.around((F-(C-1)/2)*.6,.22),D=a*e.range(.45,.95),B=Math.sqrt(Math.max(0,1-(D/a)**2))*a*.4,H=new R(b.x+Math.cos(N)*D,c+B+e.around(0,.3),b.z+Math.sin(N)*D);n.push({geometry:Bt(A.clone().lerp(P,.1+F*.1),H,o*(.25+F*.015),o*.13,4),color:U(I.BARK_PALE,e.range(.9,1.1)),sway:Re(0,s,1.2)});const V=Ne(e,e.range(.52,.8),0,.78,1.22);V.scale(1,e.range(.72,.9),1),V.translate(H.x,H.y+e.range(.1,.35),H.z),n.push({geometry:V,color:e.chance(.3)?I.LEAF_DARK:U(I.LEAF,e.range(.92,1.08)),sway:e.range(.82,.95)})}}const p=e.int(15,21);for(let w=0;w<p;w++){const b=e.range(0,Pi),S=a*Math.sqrt(e())*.92,E=Math.sqrt(Math.max(0,1-(S/a)**2)),T=e.range(.55,.92)*(.78+.32*E),x=Ne(e,T,0,.76,1.24);x.rotateY(e.range(0,Pi)),x.scale(1,e.range(.82,1),1),x.translate(Math.cos(b)*S,c+E*a*e.range(.42,.7)+e.around(0,.34)+(e.chance(.2)?e.range(.25,.75):0),Math.sin(b)*S),n.push({geometry:x,color:e.chance(.28)?I.LEAF_DARK:e.chance(.15)&&S>a*.6?I.LEAF_DRY:U(I.LEAF,e.range(.9,1.1)),sway:e.range(.85,1)})}const _=e.int(3,6);for(let w=0;w<_;w++){const b=e.range(0,Pi),S=a*e.range(.6,.95),E=Ne(e,e.range(.42,.7),0,.74,1.26);E.scale(1,e.range(.6,.8),1),E.translate(Math.cos(b)*S,c-e.range(.35,1),Math.sin(b)*S),n.push({geometry:E,color:e.chance(.55)?I.LEAF_DARK:U(I.LEAF,e.range(.86,1)),sway:e.range(.8,.95)})}const v=vt(n);return v.rotateY(e.range(0,Pi)),t!==1&&v.scale(t,t,t),bt(v,"oak",e.range(0,Pi))}},ro=Math.PI*2,uE={name:"small-oak",category:"foliage",radius:1.4,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(2.1,3),o=e.range(.055,.085),r=s*e.range(.28,.38),a=e.range(0,ro),c=e.range(.04,.13),l=p=>{const _=p/s,v=c*_**1.9;return new R(Math.cos(a)*v,p,Math.sin(a)*v)},h=3;for(let p=0;p<h;p++){const _=s*p/h,v=s*(p+1)/h,w=l(_),b=l(v);b.lerp(w,-.07),n.push({geometry:Bt(w,b,o*(1-.22*p),o*(1-.22*(p+1)),6),color:U(I.BARK,e.range(.9,1.12)),sway:Re(0,s,2.2)})}const u=e.int(5,7),f=e.range(0,ro),d=e.chance(.25)?I.LEAF_DARK:I.LEAF;for(let p=0;p<u;p++){const _=u>1?p/(u-1):0,v=Math.min(s*.95,r+(s-r)*_*e.range(.85,1)),w=l(v),b=f+p*2.399963+e.around(0,.35),S=e.range(.42,.72)*(1.15-.5*_),E=e.range(.35,.8),T=new R(w.x+Math.cos(b)*Math.cos(E)*S,w.y+Math.sin(E)*S,w.z+Math.sin(b)*Math.cos(E)*S);n.push({geometry:Bt(w,T,o*.4,o*.2,4),color:U(I.BARK_PALE,e.range(.88,1.12)),sway:Re(0,s,1.4)});const x=S>.55?2:1;for(let M=0;M<x;M++){const A=x===1?1:.55+.45*M,P=Ne(e,e.range(.26,.4)*(1.1-.3*_),0,.76,1.24);P.rotateY(e.range(0,ro)),P.scale(1,e.range(.78,.95),1),P.translate(w.x+(T.x-w.x)*A,w.y+(T.y-w.y)*A+e.range(.02,.1),w.z+(T.z-w.z)*A),n.push({geometry:P,color:e.chance(.3)?I.LEAF_DARK:U(d,e.range(.9,1.1)),sway:e.range(.8,.95)})}}const g=l(s),y=Ne(e,e.range(.26,.36),0,.76,1.24);y.scale(1,e.range(.85,1.05),1),y.translate(g.x,g.y+e.range(.02,.12),g.z),n.push({geometry:y,color:U(d,e.range(.94,1.08)),sway:1});const m=vt(n);return m.rotateY(e.range(0,ro)),t!==1&&m.scale(t,t,t),bt(m,"small-oak",e.range(0,ro))}},Ii=Math.PI*2,$c=14144195,dE=3814701,fE=4933181,pE={name:"birch",category:"foliage",radius:2.4,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(6,8.2),o=e.range(.13,.19),r=s*e.range(.5,.6),a=e.range(.14,.38),c=e.range(0,Ii),l=e.range(.08,.3),h=T=>{const x=T/s,M=l*x**2.4;return new R(Math.cos(c)*M,T,Math.sin(c)*M)},u=T=>{const x=T/s,M=1+.35*Math.max(0,1-T/.55);return o*(1-.72*x)*M},f=[];{let T=a;for(;T<s-.05;){const M=.8-.3*(T/s);if(e.chance(M)){const A=e(),P=A<.32?e.range(.5,1.2):A<.8?e.range(1.2,2.5):e.range(Math.PI,Math.PI*1.25);f.push({y:T,phi:e.range(0,Ii),half:P,tone:e.range(.75,1.4)})}T+=e.chance(.45)?e.range(.03,.09):e.range(.12,.5)}}const d=.026,g=(T,x,M)=>{if(x<a){const C=Math.sin(x*90+T*40)*Math.cos(M*55+x*20);return C>-.15?U(fE,.85+(C+1)*.2):U($c,.72)}const A=h(x),P=Math.atan2(M-A.z,T-A.x);for(const C of f){if(Math.abs(x-C.y)>d)continue;let F=Math.abs(P-C.phi)%Ii;if(F>Math.PI&&(F=Ii-F),F<C.half)return U(dE,C.tone)}return U($c,.94+Math.sin(x*31+T*17)*.06)},y=14,m=Math.max(24,Math.round(s/.09)),p=new Z(1,1,s,y,m,!1);p.translate(0,s/2,0);{const T=p.getAttribute("position");for(let x=0;x<T.count;x++){const M=Math.min(s,Math.max(0,T.getY(x))),A=h(M),P=u(M);T.setXYZ(x,T.getX(x)*P+A.x,T.getY(x),T.getZ(x)*P+A.z)}p.deleteAttribute("normal")}n.push({geometry:p,color:g,sway:Re(0,s,2.4)});const _=e.int(8,11),v=e.range(0,Ii),w=e.chance(.3)?I.LEAF_DRY:I.LEAF;for(let T=0;T<_;T++){const x=_>1?T/(_-1):0,M=Math.min(s*.985,r+(s-r)*x*e.range(.88,1)),A=h(M),P=v+T*2.399963+e.around(0,.45),C=(.45+.85*(1-x)**1.2)*e.range(.85,1.12),F=e.range(.85,1.2),N=new R(A.x+Math.cos(P)*Math.cos(F)*C,A.y+Math.sin(F)*C,A.z+Math.sin(P)*Math.cos(F)*C);n.push({geometry:Bt(A,N,o*.26,o*.15,4),color:U($c,e.range(.72,.86)),sway:Re(0,s,1.5)});const D=e.chance(.55)?2:1;for(let B=0;B<D;B++){const H=B===0?0:e.chance(.5)?.8:-.8,V=P+e.around(H,.35),et=e.range(-.85,-.35),lt=C*e.range(.6,.95),Mt=new R(N.x+Math.cos(V)*Math.cos(et)*lt,N.y+Math.sin(et)*lt,N.z+Math.sin(V)*Math.cos(et)*lt),Lt=B===0?.1:.2,J=N.clone().lerp(A,Lt);n.push({geometry:Bt(J,Mt,o*(B===0?.17:.195),o*.07,4),color:U(I.BARK_PALE,e.range(.9,1.1)),sway:.9});const rt=e.int(1,3);for(let K=0;K<rt;K++){const q=(K+1)/rt,ot=e.range(.18,.3)*(1.15-.4*x),pt=Ne(e,ot,0,.7,1.3);pt.scale(.85,e.range(1.2,1.5),.85),pt.translate(N.x+(Mt.x-N.x)*q,N.y+(Mt.y-N.y)*q-q*q*e.range(.08,.2),N.z+(Mt.z-N.z)*q),n.push({geometry:pt,color:e.chance(.3)?I.LEAF_DARK:U(w,e.range(.92,1.08)),sway:e.range(.9,1)})}}}const b=h(s),S=e.int(2,3);for(let T=0;T<S;T++){const x=Ne(e,e.range(.16,.26),0,.72,1.28);x.scale(.85,e.range(1.15,1.4),.85);const M=v+T*2.399963,A=e.range(.05,.28);x.translate(b.x+Math.cos(M)*A,b.y-e.range(.05,.35),b.z+Math.sin(M)*A),n.push({geometry:x,color:U(w,e.range(.9,1.06)),sway:1})}const E=vt(n);return E.rotateY(e.range(0,Ii)),t!==1&&E.scale(t,t,t),bt(E,"birch",e.range(0,Ii))}},Nr=Math.PI*2,Zc=12761506,mE=6050885,gE={name:"small-birch",category:"foliage",radius:1.3,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(2.2,3.05),o=e.range(.032,.05),r=s*e.range(.5,.62),a=e.range(0,Nr),c=e.range(.18,.42),l=b=>{const S=b/s,E=c*S**1.7;return new R(Math.cos(a)*E,b,Math.sin(a)*E)},h=b=>o*(1-.4*(b/s));let u=0,f=0,d=!1,g=0;for(;u<s-.05;){let b,S,E=!1;f>0&&!d?(E=!0,f-=1,g+=1,b=e.range(.03,.075),S=U(mE,e.range(.85,1.2))):f>0?(b=e.range(.04,.09),S=U(Zc,e.range(.86,.98))):(b=e.chance(.3)?e.range(.3,.5):e.range(.11,.26),S=U(Zc,e.range(.92,1.06)),f=g===0&&u>s*.3||u>s*.1&&e.chance(.58)?e.chance(.25)?2:1:0);const T=Math.min(s,u+b),x=l(u),M=l(T),A=Math.max(M.distanceTo(x),1e-6);M.lerp(x,-Math.max(.02,A*.09)/A),n.push({geometry:Bt(x,M,h(u),h(T),5),color:S,sway:Re(0,s,2)}),d=E,u=T}const y=e.int(3,5),m=e.range(0,Nr),p=e.chance(.3)?I.LEAF_DRY:I.LEAF;for(let b=0;b<y;b++){const S=y>1?b/(y-1):0,E=Math.min(s*.97,r+(s-r)*S*e.range(.85,1)),T=l(E),x=m+b*2.399963+e.around(0,.4),M=e.range(.28,.52)*(1.1-.35*S),A=e.range(1,1.3),P=new R(T.x+Math.cos(x)*Math.cos(A)*M,T.y+Math.sin(A)*M,T.z+Math.sin(x)*Math.cos(A)*M);n.push({geometry:Bt(T,P,o*.42,o*.24,4),color:U(Zc,e.range(.78,.9)),sway:Re(0,s,1.3)});const C=x+e.around(0,.3),F=e.range(-.5,-.1),N=M*e.range(.6,.95),D=new R(P.x+Math.cos(C)*Math.cos(F)*N,P.y+Math.sin(F)*N,P.z+Math.sin(C)*Math.cos(F)*N),B=P.clone().lerp(T,.12);n.push({geometry:Bt(B,D,o*.27,o*.12,4),color:U(I.BARK_PALE,e.range(.9,1.1)),sway:.92});const H=e.int(1,2);for(let V=0;V<H;V++){const et=(V+1)/H,lt=Ne(e,e.range(.15,.24),0,.7,1.3);lt.scale(.85,e.range(1.15,1.45),.85),lt.translate(P.x+(D.x-P.x)*et,P.y+(D.y-P.y)*et-et*et*e.range(.03,.09),P.z+(D.z-P.z)*et),n.push({geometry:lt,color:e.chance(.3)?I.LEAF_DARK:U(p,e.range(.92,1.08)),sway:1})}}const _=l(s),v=Ne(e,e.range(.18,.27),0,.72,1.28);v.scale(.9,e.range(1.2,1.5),.9),v.translate(_.x,_.y+.04,_.z),n.push({geometry:v,color:U(p,e.range(.94,1.06)),sway:1});const w=vt(n);return w.rotateY(e.range(0,Nr)),t!==1&&w.scale(t,t,t),bt(w,"small-birch",e.range(0,Nr))}};function Sm(i,t){const{y:e,radius:n,droop:s,slots:o,azimuth:r,thickness:a,gaps:c,floor:l}=t,h=[],u=new R,f=new R,d=new R;for(let g=0;g<o;g++){if(i.chance(c))continue;const y=r+(g+i.around(0,.3))/o*Math.PI*2,m=Math.max(.1,n*i.range(.66,1.16)),p=m*s*i.range(.75,1.25),_=Math.cos(y),v=Math.sin(y),w=a*.8,b=i.range(.4,.6),S=i.range(.26,.4),E=i.around(0,.22),T=Math.max(a*1.4,m*i.range(.17,.23)),x=l+T*S;u.set(_*w,e,v*w),f.set(_*(w+m*b),Math.max(x,e-p*i.range(.14,.3)),v*(w+m*b)),d.set(_*(w+m),Math.max(x,e-p),v*(w+m)),h.push(nf(u,f,a,T,S,E)),h.push(nf(f,d,T*.88,Math.max(a*.55,m*.03),S*i.range(.92,1.08),E+i.around(0,.12)))}return h}function nf(i,t,e,n,s,o){const r=t.x-i.x,a=t.y-i.y,c=t.z-i.z,l=Math.hypot(r,c),h=Math.hypot(l,a),u=new Z(n,e,h,4);return u.translate(0,h/2,0),u.scale(1,1,s),u.rotateY(o),u.rotateX(Math.PI/2+Math.atan2(-a,l)),u.rotateY(Math.PI/2-Math.atan2(c,r)),u.translate(i.x,i.y,i.z),u}const yE={name:"spruce",category:"foliage",radius:2.6,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(6.2,8.8),o=s*e.range(.2,.25),r=e.chance(.3)?U(I.LEAF_DARK,.82):I.LEAF_DARK,a=e.range(.16,.24),c=new Z(a*.16,a,s,6);c.translate(0,s/2,0);const l=Re(0,s,3);n.push({geometry:c,color:I.BARK,sway:(y,m)=>l(y,m)*.5});const h=e.int(12,16),u=s*e.range(.14,.24),f=s*e.range(.94,.98);let d=e.range(0,Math.PI*2);for(let y=0;y<h;y++){const m=y/(h-1),p=m**.8,_=y===0?e.range(.74,.9):1,v=o*(1-m)**.78*e.range(.83,1.17)*_+.14,w=e.range(.34,.55),b=Math.max(4,Math.min(9,Math.round(4.4+v*1.8))),S=Math.max(u+(f-u)*p,v*(w*1.45+.25)+.15),E=Sm(e,{y:S,radius:v,droop:w,slots:b,azimuth:d,thickness:Math.min(.1,Math.max(.035,v*.12)),gaps:e.range(.02,.1),floor:.12}),T=U(r,(.76+m*.34)*e.range(.94,1.06));E.forEach((x,M)=>{n.push({geometry:x,color:T,sway:.06+m*m*.4+M%2*.06})}),d+=Math.PI*2/b*e.range(.32,.7)+e.around(0,.22)}const g=vt(n);return g.rotateY(e.range(0,Math.PI*2)),t!==1&&g.scale(t,t,t),bt(g,"spruce",e.range(0,Math.PI*2))}},vE=12862239,sf=9383704,_E=9340792;function Em(i,t){const e=[],n=t?i.range(1.9,3.1):i.range(4.2,5.8),s=n*i.range(.021,.03),o=n*i.range(.3,.4),r=U(_E,i.range(.9,1.1)),a=i.chance(.35)?I.LEAF_DARK:I.LEAF,c=Re(0,n,2),l=i.range(0,Math.PI*2),h=i.range(.05,.22),u=m=>{const p=o*h*m**2.2;return new R(Math.cos(l)*p,n*m,Math.sin(l)*p)},f=t?i.range(.42,.55):i.range(.3,.4),d=5;for(let m=0;m<d;m++){const p=f*m/d,_=f*(m+1)/d,v=u(p),w=u(_),b=Math.max(w.distanceTo(v),1e-6);w.lerp(v,-Math.max(.02,b*.1)/b),e.push({geometry:Bt(v,w,s*(1-p*.3),s*(1-_*.3),6),color:U(r,i.range(.92,1.08)),sway:c})}const g=t?i.int(3,4):i.int(5,6),y=i.range(0,Math.PI*2);for(let m=0;m<g;m++){const p=y+m*2.399963+i.around(0,.35),_=u(f*i.range(.62,1)),v=o*i.range(.5,1),w=i.range(.78,.99),b=n*w,S=new R(_.x+Math.cos(p)*v*i.range(.42,.56),_.y+(b-_.y)*i.range(.45,.62),_.z+Math.sin(p)*v*i.range(.42,.56));e.push({geometry:Bt(_,S,s*.55,s*.34,5),color:U(r,i.range(.9,1.06)),sway:c});const E=t?2:i.int(2,3);for(let T=0;T<E;T++){const x=p+i.around((T-(E-1)/2)*.55,.22),M=v*i.range(.62,1),A=Math.min(1,M/Math.max(o,1e-6)),P=new R(_.x+Math.cos(x)*M,S.y+(b-S.y)*Math.sqrt(Math.max(0,1-A*A*.75)),_.z+Math.sin(x)*M),C=S.clone().lerp(_,.1+T*.06);e.push({geometry:Bt(C,P,s*(.3+T*.015),s*.16,4),color:U(r,i.range(.92,1.1)),sway:c});const F=t?2:i.int(2,3);for(let N=0;N<F;N++){const D=i.range(.3,1),B=C.clone().lerp(P,D),H=x+i.around(0,1.1),V=o*i.range(.18,.34),et=new R(B.x+Math.cos(H)*V,B.y+i.range(-.16,.3)*V*2,B.z+Math.sin(H)*V),lt=B.clone().lerp(C,.12);e.push({geometry:Bt(lt,et,s*.24,s*.12,4),color:U(r,i.range(1,1.15)),sway:c});const Mt=2;for(let Lt=0;Lt<Mt;Lt++){const J=lt.clone().lerp(et,.35+Lt/Mt*.65);of(e,i,J,n,a,H+i.around(0,.8))}if(i.chance(.75)){const Lt=C.clone().lerp(P,i.range(.12,.6));of(e,i,Lt,n,a,x+i.around(0,1.5))}!t&&D>.55&&i.chance(.38)&&wE(e,i,et,n)}}}return e}function of(i,t,e,n,s,o){const r=n*t.range(.075,.12),a=t.range(.1,.5),c=new R(Math.cos(o)*Math.cos(a),-Math.sin(a),Math.sin(o)*Math.cos(a)),l=e.clone().addScaledVector(c,r);i.push({geometry:Bt(e,l,n*.004,n*.0025,3),color:U(s,.7),sway:1});const h=2;for(let u=0;u<h;u++){const f=(u+.6)/(h+.4),d=e.clone().lerp(l,f);for(const g of[-1,1]){const y=r*t.range(.3,.46)*(1-f*.25),m=new te(y*.34,y*1.9,3);m.translate(0,y*.95,0),m.scale(1,1,t.range(.28,.42)),m.rotateZ(g*t.range(1.1,1.45)),m.rotateY(o+t.around(0,.3));const p=g*.012*r;m.translate(d.x+p,d.y+t.around(0,.004),d.z-p),i.push({geometry:m,color:U(s,t.range(.85,1.12)),sway:1})}}}function wE(i,t,e,n){const s=n*t.range(.028,.045),o=s*t.range(.5,1.1),r=t.int(7,10),a=new R(e.x,e.y-o,e.z);i.push({geometry:Bt(e,a.clone().addScaledVector(new R(0,1,0),s*.3),n*.003,n*.002,3),color:U(sf,.7),sway:1});for(let c=0;c<r;c++){const l=c*2.399963,h=s*Math.sqrt((c+.5)/r),u=s*t.range(.2,.29),f=new ee(u,0);f.scale(t.range(.9,1.1),t.range(.85,1.05),t.range(.9,1.1)),f.translate(a.x+Math.cos(l)*h,a.y+(1-(h/s)**2)*s*.3+t.around(0,u*.4),a.z+Math.sin(l)*h),i.push({geometry:f,color:t.chance(.3)?U(sf,t.range(.9,1.1)):U(vE,t.range(.9,1.12)),sway:1})}}const xE={name:"rowan",category:"foliage",radius:1.8,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=vt(Em(e,!1));return n.rotateY(e.range(0,Math.PI*2)),t!==1&&n.scale(t,t,t),bt(n,"rowan",e.range(0,Math.PI*2))}},ME={name:"small-rowan",category:"foliage",radius:.9,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=vt(Em(e,!0));return n.rotateY(e.range(0,Math.PI*2)),t!==1&&n.scale(t,t,t),bt(n,"small-rowan",e.range(0,Math.PI*2))}},bE={name:"small-spruce",category:"foliage",radius:1.1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(2.1,3.4),o=s*e.range(.19,.24),r=e.chance(.35)?U(I.LEAF_DARK,.86):I.LEAF_DARK,a=e.range(.045,.07),c=new Z(a*.35,a,s,5);c.translate(0,s/2,0);const l=Re(0,s,2.6);n.push({geometry:c,color:I.BARK,sway:(p,_)=>l(p,_)*.65});const h=s*e.range(.84,.91),u=e.int(6,9),f=e.range(.06,.16);let d=e.range(0,Math.PI*2);for(let p=0;p<u;p++){const _=p/(u-1),v=_**.85,w=o*(1-_*.86)**.85*e.range(.86,1.14)+.07,b=e.range(.24,.42),S=Math.max(4,Math.min(7,Math.round(4.4+w*2.2))),E=Math.max(f+(h-f)*v,w*(b*1.3+.25)+.05),T=Sm(e,{y:E,radius:w,droop:b,slots:S,azimuth:d,thickness:Math.min(.06,Math.max(.022,w*.11)),gaps:e.range(.02,.12),floor:.03}),x=U(r,(.8+_*.32)*e.range(.95,1.05));T.forEach((M,A)=>{n.push({geometry:M,color:x,sway:.1+_*_*.5+A%2*.06})}),d+=Math.PI*2/S*e.range(.32,.7)+e.around(0,.22)}const g=(s-h)*e.range(.55,.8),y=new te(e.range(.05,.085),g,7);y.translate(0,s-g/2-.03,0),n.push({geometry:y,color:U(r,1.15),sway:.6});const m=vt(n);return m.rotateY(e.range(0,Math.PI*2)),t!==1&&m.scale(t,t,t),bt(m,"small-spruce",e.range(0,Math.PI*2))}},SE=2956342,EE=4864606,rf=9125196,af=14999234,TE=12893598,AE={name:"elder",category:"foliage",radius:1.15,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(1.08,1.42),o=e.range(.64,.84),r=Re(0,s,1.3),a=w=>Math.min(1,r(0,w)*1.15),c=e.chance(.6)?I.BARK_PALE:I.BARK,l=e.chance(.45)?I.LEAF:I.LEAF_DARK,h=!e.chance(.12),u=Ne(e,e.range(.13,.19),0,.8,1.18);u.scale(1,e.range(.42,.6),1),u.translate(0,e.range(.02,.05),0),n.push({geometry:u,color:U(c,.85),sway:r});const f=e.int(7,9),d=e.range(0,Math.PI*2);for(let w=0;w<f;w++){const b=d+w/f*Math.PI*2+e.around(0,.3),S=b+Math.PI/2,E=s*(w===0?e.range(.92,1):e.range(.58,1)),T=o*e.range(.8,1),x=T*e.around(0,.26),M=e.range(.022,.034),A=new R(Math.sin(b)*e.range(.02,.06),e.range(.03,.07),Math.cos(b)*e.range(.02,.06)),P=D=>{const B=T*D**1.5,H=x*Math.sin(Math.PI*D);return new R(A.x+Math.sin(b)*B+Math.sin(S)*H,A.y+(E-A.y)*(1-(1-D)**1.6),A.z+Math.cos(b)*B+Math.cos(S)*H)},C=[P(0),P(1/3),P(2/3),P(1)];let F=null;for(let D=0;D<3;D++){const B=F?new R().lerpVectors(C[D],F,e.range(.07,.15)):C[D];n.push({geometry:Bt(B,C[D+1],M*(1-D*.22),M*(1-(D+1)*.22),4),color:U(c,e.range(.92,1.08)),sway:r}),F=C[D]}y(P(e.range(.24,.34)),b),y(P(e.range(.55,.66)),b),y(P(e.range(.86,.95)),b);const N=new R().lerpVectors(C[3],C[2],e.range(.08,.2));h?p(N,b):_(N,b)}const g=e.int(3,4);for(let w=0;w<g;w++){const b=d+e.range(0,Math.PI*2),S=s*e.range(.34,.5),E=e.range(1,1.35),T=new R(Math.sin(b)*e.range(.03,.08),e.range(.02,.05),Math.cos(b)*e.range(.03,.08)),x=new R(T.x+Math.sin(b)*Math.cos(E)*S,T.y+Math.sin(E)*S,T.z+Math.cos(b)*Math.cos(E)*S);n.push({geometry:Bt(T,x,e.range(.012,.017),e.range(.006,.009),4),color:U(c,e.range(1,1.12)),sway:r}),y(x,b)}function y(w,b){const S=s*e.range(.19,.27);for(const E of[-1,1]){const T=b+E*e.range(1,1.45),x=e.range(-.42,.04),M=new R(w.x+Math.sin(T)*Math.cos(x)*S,w.y+Math.sin(x)*S,w.z+Math.cos(T)*Math.cos(x)*S),A=new R().lerpVectors(w,M,e.range(.03,.07));n.push({geometry:Bt(A,M,e.range(.0072,.0092),.0035,3),color:U(l,.78),sway:r});const P=2;for(let C=0;C<P;C++){const F=(C+.85)/(P+1.15),N=S*e.range(.36,.46);for(const D of[-1,1]){const B=new R().lerpVectors(w,M,F+e.around(0,.045));n.push({geometry:m(N*e.range(.94,1.08),T+D*e.range(1.05,1.35),x+e.around(0,.22),B),color:U(l,e.range(.86,1.14)),sway:r})}}n.push({geometry:m(S*e.range(.38,.48),T,x,M),color:U(l,e.range(.86,1.14)),sway:r})}}function m(w,b,S,E){const T=new te(w*e.range(.28,.36),w,3);return T.translate(0,w*.5,0),T.scale(1,1,e.range(.2,.3)),T.rotateX(Math.PI/2+S),T.rotateY(b),T.translate(E.x,E.y,E.z),T}function p(w,b){const S=s*e.range(.1,.16),E=new R(w.x+Math.sin(b)*S*e.range(.25,.55),w.y-S,w.z+Math.cos(b)*S*e.range(.25,.55));n.push({geometry:Bt(w,E,e.range(.008,.011),e.range(.005,.007),4),color:U(rf,e.range(.9,1.1)),sway:a(E.y)});const T=[E];for(const M of[-1,1]){const A=b+M*e.range(1.6,2.4),P=S*e.range(.38,.62),C=new R().lerpVectors(w,E,e.range(.5,.78)),F=new R(C.x+Math.sin(A)*P,C.y-P*e.range(.35,.75),C.z+Math.cos(A)*P);n.push({geometry:Bt(C,F,e.range(.0032,.0045),.0026,3),color:U(rf,e.range(.85,1.05)),sway:a(F.y)}),T.push(F)}const x=e.int(6,7);for(let M=0;M<x;M++){const A=T[M%T.length],P=M/x*Math.PI*2+e.around(0,.8),C=e.range(.026,.04),F=C*e.range(.5,1.5),N=new R(A.x+Math.sin(P)*F,A.y-e.range(0,C*1.2),A.z+Math.cos(P)*F),D=new ke(C,0);D.scale(e.range(.85,1.15),e.range(.8,1.05),e.range(.85,1.15)),D.rotateY(e.range(0,Math.PI)),D.rotateX(e.range(0,Math.PI)),D.translate(N.x,N.y,N.z),n.push({geometry:D,color:(B,H)=>H>N.y?EE:SE,sway:a(N.y)})}}function _(w,b){const S=s*e.range(.12,.16),E=new R(w.x+Math.sin(b)*S*e.range(.1,.35),w.y+S*e.range(.18,.38),w.z+Math.cos(b)*S*e.range(.1,.35));n.push({geometry:Bt(w,E,e.range(.009,.012),.007,4),color:U(l,.8),sway:a(E.y)});const T=3;for(let M=0;M<T;M++){const A=M/T*Math.PI*2+e.around(0,.35),P=new R(E.x+Math.sin(A)*S*e.range(.42,.6),E.y+S*e.around(0,.07),E.z+Math.cos(A)*S*e.range(.42,.6)),C=Ne(e,S*e.range(.3,.42),0,.82,1.12);C.scale(1,e.range(.34,.46),1),C.translate(P.x,P.y,P.z),n.push({geometry:C,color:(F,N)=>N>P.y?af:TE,sway:a(P.y)})}const x=Ne(e,S*e.range(.34,.44),0,.84,1.1);x.scale(1,e.range(.38,.5),1),x.translate(E.x,E.y+S*e.range(.03,.08),E.z),n.push({geometry:x,color:af,sway:a(E.y)})}const v=vt(n);return v.rotateY(e.range(0,Math.PI*2)),t!==1&&v.scale(t,t,t),bt(v,"elder",e.range(0,Math.PI*2))}},RE={name:"hazel",category:"foliage",radius:1.2,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(1.08,1.45),o=e.range(.62,.82),r=Re(0,s,1.9),a=e.chance(.65)?I.BARK_PALE:I.BARK,c=e.chance(.3)?I.LEAF_DARK:I.LEAF,l=Ne(e,e.range(.14,.2),0,.76,1.2);l.scale(1,e.range(.45,.62),1),l.translate(0,e.range(.02,.05),0),n.push({geometry:l,color:U(I.BARK,.85),sway:r});const h=e.int(7,10),u=e.range(0,Math.PI*2);for(let g=0;g<h;g++){const y=u+g/h*Math.PI*2+e.around(0,.36),m=s*e.range(.74,1),p=o*e.range(.66,1),_=s*e.range(.026,.04),v=new R(Math.sin(y)*e.range(.02,.08),e.range(.01,.05),Math.cos(y)*e.range(.02,.08)),w=new R(v.x+Math.sin(y)*p,m,v.z+Math.cos(y)*p),b=E=>v.clone().lerp(w,E);n.push({geometry:Bt(v,w,_,_*e.range(.38,.5),5),color:U(a,e.range(.9,1.1)),sway:r});const S=e.int(3,5);for(let E=0;E<S;E++){const T=e.range(.16,.95),x=b(T),M=s*e.range(.1,.18),A=e.range(-.3,.95),P=y+e.around(0,1.5),C=new R(x.x+Math.sin(P)*Math.cos(A)*M,x.y+Math.sin(A)*M,x.z+Math.cos(P)*Math.cos(A)*M);n.push({geometry:Bt(x,C,_*.34,_*.19,3),color:U(a,1.12),sway:r}),f(C)}f(w)}function f(g){const y=e.int(2,3);for(let m=0;m<y;m++){const p=s*e.range(.055,.078),_=new ee(p,0);_.scale(1,1,e.range(.12,.19)),_.rotateX(Math.PI/2+e.around(0,.5)),_.rotateY(e.range(0,Math.PI*2));const v=m/y*Math.PI*2+e.around(0,.6),w=p*e.range(.6,1.35);_.translate(g.x+Math.sin(v)*w,g.y+e.around(0,p*.55),g.z+Math.cos(v)*w),n.push({geometry:_,color:U(c,e.range(.85,1.18)),sway:r})}}const d=vt(n);return d.rotateY(e.range(0,Math.PI*2)),t!==1&&d.scale(t,t,t),bt(d,"hazel",e.range(0,Math.PI*2))}},CE=14263323,PE=15254609,IE={name:"gorse",category:"foliage",radius:1.2,solid:!0,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.98,1.5),o=e.range(.62,.9),r=Re(0,s,1.6),a=[],c=e.int(5,7);for(let g=0;g<c;g++){const y=g===0,m=g/c*Math.PI*2+e.around(0,.55),p=y?0:o*e.range(.16,.44),_=s*(y?e.range(.9,1):e.range(.58,.9)),v=_*e.range(.44,.6);a.push({at:new R(Math.sin(m)*p,v,Math.cos(m)*p),radius:_-v})}for(const g of a){const y=Ne(e,g.radius,0,.82,1.14);y.scale(1,e.range(.82,1),1),y.translate(g.at.x,g.at.y,g.at.z),n.push({geometry:y,color:U(I.LEAF_DARK,e.range(.82,1.02)),sway:r})}const l=e.int(38,55);for(let g=0;g<l;g++){const y=a[e.int(0,a.length-1)],m=e.range(-.22,1),p=Math.sqrt(Math.max(0,1-m*m)),_=e.range(0,Math.PI*2),v=new R(Math.sin(_)*p,m,Math.cos(_)*p),w=s*e.range(.035,.075),b=y.at.clone().addScaledVector(v,y.radius*e.range(.5,.78)),S=y.at.clone().addScaledVector(v,y.radius+w);S.y<.06||n.push({geometry:Bt(b,S,s*e.range(.005,.0085),0,3),color:U(5598003,e.range(.85,1.2)),sway:r})}const h=e.int(70,100),u=a.map(g=>g.radius*g.radius),f=u.reduce((g,y)=>g+y,0)||1;for(let g=0;g<a.length;g++){const y=a[g],m=Math.max(3,Math.round(h*u[g]/f));for(let p=0;p<m;p++){const _=1-(p+.5)/m*1.06,v=Math.sqrt(Math.max(0,1-_*_)),w=p*2.399963+e.around(0,.55),b=new R(Math.sin(w)*v,Math.min(1,_+e.around(0,.06)),Math.cos(w)*v),S=y.at.clone().addScaledVector(b,y.radius*e.range(.74,.88));if(S.y<s*.14)continue;const E=s*e.range(.05,.078),T=new ee(E,0);T.scale(e.range(.9,1.25),e.range(.6,.88),e.range(.9,1.25)),T.rotateY(e.range(0,Math.PI)),T.rotateX(e.range(0,Math.PI)),T.translate(S.x,S.y,S.z),n.push({geometry:T,color:e.chance(.45)?PE:CE,sway:r})}}const d=vt(n);return d.rotateY(e.range(0,Math.PI*2)),t!==1&&d.scale(t,t,t),bt(d,"gorse",e.range(0,Math.PI*2))}},LE={name:"fallen-log",category:"nature",radius:2.2,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(2.4,4.6),o=e.range(.16,.26),r=o*e.range(.6,.8),a=e.chance(.45)?I.BARK_PALE:I.BARK,c=e.range(0,1),l=5334330,h=o*.86,u=new Z(r,o,s,8);u.rotateZ(Math.PI/2),u.rotateX(e.around(0,.12)),u.translate(0,h,0),n.push({geometry:u,color:(y,m)=>m>h+o*.35&&e.chance(0)===!1&&c>.45?l:a,sway:0});const f=new te(o*.92,o*1.1,6);f.rotateZ(-Math.PI/2),f.translate(s/2+o*.4,h,0),n.push({geometry:f,color:U(I.TIMBER,.86),sway:0});const d=e.int(2,4);for(let y=0;y<d;y++){const m=e.range(-s*.42,s*.35),p=e.range(.18,.42),_=e.range(.3,Math.PI-.3)*(e.chance(.5)?1:-1),v=new Z(o*.16,o*.26,p,5);v.translate(0,p/2,0),v.rotateX(Math.PI/2-e.range(.4,1.1)),v.rotateY(_),v.translate(m,h+o*.4,0),n.push({geometry:v,color:U(a,.9),sway:0})}if(c>.6){const y=e.int(2,4);for(let m=0;m<y;m++){const p=e.range(-s*.4,s*.4),_=e.chance(.5)?1:-1,v=new Z(e.range(.06,.12),e.range(.03,.06),.025,6);v.rotateZ(_*.5),v.translate(p,h+e.range(0,o*.5),_*o*.85),n.push({geometry:v,color:12430988,sway:0})}}const g=vt(n);return t!==1&&g.scale(t,t,t),bt(g,"fallen-log",0)}},DE={name:"sticks",category:"nature",radius:1,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.int(6,11),o=e.range(.5,.95),r=e.chance(.5)?I.BARK:I.BARK_PALE;for(let c=0;c<s;c++){const l=e.range(.4,1.5),h=e.range(.018,.05),u=e.chance(.1)?e.range(.12,.26):e.range(0,.06),f=e.range(0,Math.PI*2),d=new Z(h*.7,h,l,4);d.rotateZ(Math.PI/2),d.rotateZ(u),d.rotateY(f);const g=e.range(0,.05)+Math.sin(u)*l*.4,y=Math.sqrt(e())*o*(1-g*.5),m=e.range(0,Math.PI*2);d.translate(Math.cos(m)*y,h+g,Math.sin(m)*y),n.push({geometry:d,color:U(r,e.range(.82,1.14)),sway:0})}const a=vt(n);return t!==1&&a.scale(t,t,t),bt(a,"sticks",0)}},NE={name:"bramble",category:"foliage",radius:1.3,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.int(5,8),o=e.range(.85,1.4),r=e.chance(.5)?5917240:7033392,a=e.chance(.5)?I.LEAF_DARK:I.LEAF,c=e.range(0,Math.PI*2);for(let h=0;h<s;h++){const u=c+e.range(-1.5,1.5),f=o*e.range(.65,1.1),d=4,g=f/d,y=e.range(.013,.022);let m=e.range(1,1.35);const p=e.range(0,.09),_=e.range(0,Math.PI*2);let v=Math.cos(_)*p,w=.02,b=Math.sin(_)*p;for(let S=0;S<d;S++){const E=new Z(y*.72,y,g*1.1,4);E.translate(0,g/2,0),E.rotateX(Math.PI/2-m),E.rotateY(u),E.translate(v,w,b);const T=(S/d)**1.4;n.push({geometry:E,color:U(r,e.range(.88,1.1)),sway:T});const x=Math.cos(m)*g,M=v+Math.sin(u)*x,A=w+Math.sin(m)*g,P=b+Math.cos(u)*x;if(A>.05)for(let C=0;C<3;C++){const F=y*e.range(3.6,5.4),N=new te(F*.55,F*1.5,3);N.translate(0,F*.75,0),N.scale(1,1,.3),N.rotateZ(e.range(.9,1.4)),N.rotateY(C/3*Math.PI*2+e.range(0,.4)),N.translate(M,A,P),n.push({geometry:N,color:U(a,e.range(.85,1.15)),sway:T})}v=M,w=Math.max(.03,A),b=P,m-=e.range(.4,.7)}}const l=vt(n);return t!==1&&l.scale(t,t,t),bt(l,"bramble",e.range(0,Math.PI*2))}},UE={name:"fern",category:"foliage",radius:.8,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e()**2,o=.3+s*.62,r=Math.max(3,Math.round(4+s*8+e.around(0,1.2))),a=e.chance(.4)?I.LEAF_DARK:I.LEAF;for(let h=0;h<r;h++){const u=h/r*Math.PI*2+e.range(-.22,.22),f=o*e.range(.72,1.15),d=4,g=f/d;let y=e.range(1.1,1.45),m=0,p=e.range(.02,.08),_=0;for(let v=0;v<d;v++){const w=v/d,b=new Z(.006,.009,g*1.1,4);b.translate(0,g/2,0),b.rotateX(Math.PI/2-y),b.rotateY(u),b.translate(m,p,_),n.push({geometry:b,color:U(a,.82),sway:w**1.2});const S=3;for(let T=0;T<S;T++){const x=(T+.5)/S,M=w+x/d,A=f*.2*(1-M*.75);if(A<.012)continue;const P=Math.cos(y)*g*x,C=m+Math.sin(u)*P,F=p+Math.sin(y)*g*x,N=_+Math.cos(u)*P;for(const D of[-1,1]){const B=A*e.range(.88,1.12),H=new te(B*.3,B,3);H.translate(0,B*.5,0),H.scale(1,1,.22),H.rotateZ(D*e.range(1.2,1.45)),H.rotateY(u+D*e.range(.1,.35)),H.translate(C,F,N),n.push({geometry:H,color:U(a,e.range(.9,1.14)),sway:M**1.2})}}const E=Math.cos(y)*g;m+=Math.sin(u)*E,p+=Math.sin(y)*g,_+=Math.cos(u)*E,y-=e.range(.3,.5)}}const c=new ee(o*.1,0);c.scale(1,1.5,1),c.translate(0,o*.1,0),n.push({geometry:c,color:U(a,.75),sway:.3});const l=vt(n);return l.rotateY(e.range(0,Math.PI*2)),t!==1&&l.scale(t,t,t),bt(l,"fern",e.range(0,Math.PI*2))}},FE={name:"nettle",category:"foliage",radius:.6,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.int(4,8),o=e.range(.26,.42),r=e.chance(.5)?4612154:4019507;for(let c=0;c<s;c++){const l=e.range(0,Math.PI*2),h=Math.sqrt(e())*o,u=Math.cos(l)*h,f=Math.sin(l)*h,d=e.range(.62,1.05)*(1-h/o*.18),g=e.range(0,.09),y=e.range(0,Math.PI*2),m=e.range(.0055,.0095),p=new Z(m*.7,m,d,4);p.translate(0,d/2,0),p.rotateX(Math.cos(y)*g),p.rotateZ(Math.sin(y)*g),p.translate(u,0,f),n.push({geometry:p,color:U(r,.85),sway:(w,b)=>Math.max(0,b/d)**1.4});const _=2+Math.floor(d*2);for(let w=1;w<=_;w++){const b=w/(_+.6)*d,S=d*e.range(.1,.16)*(1-w/_*.72);for(const E of[-1,1]){const T=S*e.range(.9,1.1),x=new te(T*.5,T*1.7,3);x.translate(0,T*.85,0),x.scale(1,1,.3),x.rotateZ(E*e.range(1.15,1.5)),x.rotateY(w*(Math.PI/2)+e.around(0,.2)),x.translate(u,b,f),n.push({geometry:x,color:U(r,e.range(.92,1.12)),sway:Math.max(0,b/d)**1.4})}}const v=e.int(3,5);for(let w=0;w<v;w++){const b=d*e.range(.022,.04),S=new te(b*.5,b*1.6,3);S.translate(0,b*.8,0),S.scale(1,1,.3),S.rotateZ(e.range(.25,.6)),S.rotateY(w*2.399963+e.around(0,.4)),S.translate(u,d*(.9+w*.022),f),n.push({geometry:S,color:U(r,e.range(1.1,1.25)),sway:1})}if(e.chance(.6))for(const w of[-1,1]){const b=new Z(e.range(.0035,.0048),e.range(.007,.0092),d*e.range(.14,.19),4);b.translate(0,-d*.08,0),b.rotateZ(w*e.range(.66,.94)),b.translate(u,d*.86,f),n.push({geometry:b,color:11053186,sway:.9})}}const a=vt(n);return a.rotateY(e.range(0,Math.PI*2)),t!==1&&a.scale(t,t,t),bt(a,"nettle",e.range(0,Math.PI*2))}},OE={name:"reeds",category:"foliage",radius:.7,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.int(9,18),o=e.range(.28,.5),r=e.chance(.4)?8223300:6253368,a=e.chance(.5)?4863268:6045994;for(let l=0;l<s;l++){const h=e.range(0,Math.PI*2),u=Math.sqrt(e())*o,f=Math.cos(h)*u,d=Math.sin(h)*u,g=e.range(1.4,2.4)*(1-u/o*.22),y=e.range(0,.14),m=e.range(0,Math.PI*2),p=Math.cos(m)*y,_=Math.sin(m)*y,v=new Z(.008,.013,g,4);v.translate(0,g/2,0),v.rotateX(p),v.rotateZ(_),v.translate(f,0,d),n.push({geometry:v,sway:(x,M)=>Math.max(0,M/g)**1.2,color:U(r,e.range(.88,1.12))}),Ur.set(0,g,0).applyAxisAngle(zE,p).applyAxisAngle(kE,_);const w=e.range(.16,.26),b=[],S=new Z(.024,.028,w,6);S.translate(0,-w/2,0),b.push([S,U(a,e.range(.9,1.1))]);const E=new te(.026,w*.46,6);E.translate(0,w*.17,0),b.push([E,U(a,1.15)]);const T=new Z(.004,.007,w*.5,4);T.translate(0,w*.63,0),b.push([T,U(r,.9)]);for(const[x,M]of b)x.rotateX(p),x.rotateZ(_),x.translate(f+Ur.x,Ur.y,d+Ur.z),n.push({geometry:x,color:M,sway:1});if(e.chance(.5)){const x=g*e.range(.3,.5),M=new te(.018,x,3);M.translate(0,x/2,0),M.scale(1,1,.28),M.rotateZ(e.range(.25,.6)*(e.chance(.5)?1:-1)),M.rotateY(e.range(0,Math.PI*2)),M.translate(f,g*e.range(.1,.3),d),n.push({geometry:M,color:U(r,.92),sway:.8})}}const c=vt(n);return t!==1&&c.scale(t,t,t),bt(c,"reeds",e.range(0,Math.PI*2))}},zE=new R(1,0,0),kE=new R(0,0,1),Ur=new R,BE={name:"moss",category:"foliage",radius:.55,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.chance(.4)?"cushion":e.chance(.5)?"carpet":"fruiting",o=e.chance(.5)?4678447:3495740,r=e.range(.2,.34),a=s==="cushion"?e.int(3,6):e.int(4,8);for(let l=0;l<a;l++){const h=l===0,u=h?e.range(.16,.26):e.range(.08,.18)*(s==="cushion"?1:1.35),f=h?0:Math.sqrt(e())*r,d=e.range(0,Math.PI*2),g=s==="cushion"?e.range(.34,.46):e.range(.13,.2),y=Ne(e,u,1,.86,1.18);y.scale(1,g,1),y.translate(Math.cos(d)*f,u*g*.35,Math.sin(d)*f),n.push({geometry:y,color:U(o,e.range(.86,1.16)),sway:0})}if(s==="fruiting"){const l=e.int(14,26),h=e.chance(.5)?9075274:7167802;for(let u=0;u<l;u++){const f=e.range(0,Math.PI*2),d=Math.sqrt(e())*r*.9,g=Math.cos(f)*d,y=Math.sin(f)*d,m=e.range(.045,.1),p=e.range(0,.3),_=e.range(0,Math.PI*2),v=new Z(.0018,.0028,m,4);v.translate(0,m/2,0),v.rotateX(Math.cos(_)*p),v.rotateZ(Math.sin(_)*p),v.translate(g,.02,y),n.push({geometry:v,color:U(h,.9),sway:.7});const w=new Z(.006,.0045,m*.3,5);w.rotateX(Math.cos(_)*p*1.6),w.rotateZ(Math.sin(_)*p*1.6),w.translate(g+Math.sin(Math.sin(_)*p)*-m,.02+m*Math.cos(p),y+Math.sin(Math.cos(_)*p)*m),n.push({geometry:w,color:U(h,1.2),sway:1})}}const c=vt(n);return t!==1&&c.scale(t,t,t),bt(c,"moss",e.range(0,Math.PI*2))}},HE={name:"pinecone",category:"nature",radius:.4,solid:!1,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.int(3,7),o=e.range(.16,.3);for(let a=0;a<s;a++){const c=e.range(0,Math.PI*2),l=Math.sqrt(e())*o,h=Math.cos(c)*l,u=Math.sin(c)*l,f=e.range(.11,.18),d=f*e.range(.36,.46),g=U(e.chance(.5)?I.BARK:7031340,e.range(.85,1.15)),y=e.range(.9,1.35),m=e.range(0,Math.PI*2),p=S=>{S.rotateX(y),S.rotateY(m),S.translate(h,d*.55,u)},_=new Z(d*.18,d*.5,f*.82,6);p(_),n.push({geometry:_,color:U(g,.8),sway:0});const v=new te(d*.2,f*.3,6);v.translate(0,f*.55,0),p(v),n.push({geometry:v,color:U(g,.75),sway:0});const w=4,b=5;for(let S=0;S<w;S++){const E=-f*.34+S/(w-1)*f*.66,T=1-Math.abs(S/(w-1)-.35)*.9;for(let x=0;x<b;x++){const M=x/b*Math.PI*2+S*.62,A=new G(d*.42,d*.16,d*.34);A.rotateX(-.5),A.translate(0,0,d*.5*T),A.rotateY(M),A.translate(0,E,0),p(A),n.push({geometry:A,color:U(g,e.range(.95,1.2)),sway:0})}}}const r=vt(n);return t!==1&&r.scale(t,t,t),bt(r,"pinecone",0)}},GE=4874292,VE=6124608,WE=I.LEAF;function XE(i,t,e,{scale:n=1}){const s=[],o=e.int(t.count[0],t.count[1]),r=e.pick(t.petal),a=e.range(0,Math.PI*2);for(let l=0;l<o;l++){const h=e.range(0,Math.PI*2),u=Math.sqrt(e())*t.spread,f=Math.cos(h)*u,d=Math.sin(h)*u,g=1-u/t.spread*e.range(.1,.35),y=e.range(t.height[0],t.height[1])*g,m=e.range(0,.22),p=e.range(0,Math.PI*2),_=Math.cos(p)*m,v=Math.sin(p)*m,w=new Z(t.stemThickness*.7,t.stemThickness,y,4);w.translate(0,y/2,0),w.rotateX(_),w.rotateZ(v),w.translate(f,0,d),s.push({geometry:w,color:e.chance(.4)?VE:GE,sway:(D,B)=>Math.max(0,B/y)**1.4});for(let D=0;D<t.leaves;D++){const B=y*(.2+D/Math.max(1,t.leaves)*.45);Or.set(0,B,0).applyAxisAngle(Kc,_).applyAxisAngle(jc,v);for(const H of[-1,1]){const V=y*e.range(.16,.28),et=new te(V*.3,V,3);et.translate(0,V/2,0),et.scale(1,1,.35),et.rotateZ(H*e.range(1,1.35)),et.rotateY(e.range(0,Math.PI*2)),et.translate(f+Or.x,Or.y,d+Or.z),s.push({geometry:et,color:WE,sway:()=>Math.max(0,B/y)**1.4})}}Fr.set(0,y,0).applyAxisAngle(Kc,_).applyAxisAngle(jc,v);const b=f+Fr.x,S=Fr.y,E=d+Fr.z,T=1;if(t.head){s.push(...t.head({axis:D=>new R(0,y*D,0).applyAxisAngle(Kc,_).applyAxisAngle(jc,v).add(new R(f,0,d)),height:y,rng:e}));continue}const x=e.range(t.headSize[0],t.headSize[1])*g,M=e.chance(t.nod)?e.range(.5,1.1):e.range(0,.18),A=e.range(-Math.PI,Math.PI),P=t.facing===void 0?A:a+A/Math.PI*t.facing,C=D=>{D.rotateX(Math.cos(P)*M),D.rotateZ(Math.sin(P)*M),D.translate(b,S,E)},F=new Z(x,x*.9,x*.5,8);C(F),s.push({geometry:F,color:t.centre,sway:T});const N=x*t.reach;for(let D=0;D<t.petals;D++){const B=D/t.petals*Math.PI*2+e.range(-.12,.12),H=N*e.range(.88,1.12),V=new te(H*t.petalWidth*e.range(.9,1.1),H,3);V.translate(0,N/2,0),V.scale(1,1,.28),V.rotateX(Math.PI/2-e.range(t.cup[0],t.cup[1])),V.rotateY(B),V.translate(0,x*.12,0),C(V),s.push({geometry:V,color:r,sway:T})}}const c=vt(s);return c.rotateY(e.range(0,Math.PI*2)),n!==1&&c.scale(n,n,n),bt(c,i,e.range(0,Math.PI*2))}function Qn(i,t,e){return{name:i,category:"foliage",radius:e,solid:!1,build:(n={})=>XE(i,t,xt(n.seed??1),n)}}const Kc=new R(1,0,0),jc=new R(0,0,1),Fr=new R,Or=new R,cf=[{petals:5,reach:2.1,width:.62,cup:[.5,.95],size:[.026,.042],petal:[15255624,14465074,14996042],centre:11045420,nod:.1},{petals:14,reach:2.3,width:.18,cup:[.05,.3],size:[.028,.046],petal:[15789280,15262932,16050360],centre:14202944,nod:.1},{petals:12,reach:1.15,width:.42,cup:[.35,.8],size:[.03,.05],petal:[11576528,10259648,12891356],centre:7298966,nod:.15},{petals:5,reach:1.7,width:.5,cup:[.15,.45],size:[.024,.04],petal:[14183060,13128834,14715560],centre:15786192,nod:.12},{petals:4,reach:2.4,width:.55,cup:[0,.2],size:[.016,.028],petal:[8363992,7048392,10138848],centre:15790304,nod:.05},{petals:8,reach:2.6,width:.24,cup:[.6,1.1],size:[.022,.036],petal:[14717034,13925464,15247488],centre:9194028,nod:.6}];function YE({axis:i,rng:t}){const e=[],n=cf[t.int(0,cf.length-1)],s=i(1),o=t.range(n.size[0],n.size[1]),r=t.pick(n.petal),a=t.chance(n.nod)?t.range(.5,1.1):t.range(0,.18),c=t.range(0,Math.PI*2),l=f=>{f.rotateX(Math.cos(c)*a),f.rotateZ(Math.sin(c)*a),f.translate(s.x,s.y,s.z)},h=new Z(o,o*.9,o*.5,8);l(h),e.push({geometry:h,color:n.centre,sway:1});const u=o*n.reach;for(let f=0;f<n.petals;f++){const d=f/n.petals*Math.PI*2+t.range(-.12,.12),g=u*t.range(.88,1.12),y=new te(g*n.width*t.range(.9,1.1),g,3);y.translate(0,g/2,0),y.scale(1,1,.28),y.rotateX(Math.PI/2-t.range(n.cup[0],n.cup[1])),y.rotateY(d),y.translate(0,o*.12,0),l(y),e.push({geometry:y,color:r,sway:1})}return e}const qE=Qn("wildflower",{height:[.14,.62],stemThickness:.0085,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[14209252],centre:14205024,count:[14,26],spread:.6,leaves:1,nod:0,head:YE},.75);function $E({axis:i,height:t,rng:e}){const n=[],s=e.int(4,6),o=e.range(0,Math.PI*2),r=e.range(.5,.62),c=e.chance(.06)?15789800:5926837;for(let l=0;l<s;l++){const h=s===1?0:l/(s-1),u=r+(1-r)*h,f=i(u),d=h*h*t*.3,g=t*.12*(1-h*.3),y=o+e.range(-.22,.22),m=g*.9+d,p=new R(f.x+Math.sin(y)*m,f.y-d*.5,f.z+Math.cos(y)*m);n.push({geometry:Bt(f,p,.0035,.0025),color:6124608,sway:u});const _=new Z(g*.3,g*.62,g*1.4,6);_.translate(0,-g*.7,0),_.rotateZ(e.around(0,.16)),_.translate(p.x,p.y,p.z),n.push({geometry:_,color:c,sway:u})}return n}const ZE=Qn("bluebell",{height:[.35,.62],stemThickness:.008,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[5926837],centre:5926837,count:[9,16],spread:.5,leaves:0,nod:0,head:$E},.65);function KE({axis:i,height:t,rng:e}){const n=[],s=i(1),o=e.int(6,11),r=t*e.range(.1,.16),a=s.y+r*e.range(.5,.8);for(let c=0;c<o;c++){const l=c/o*Math.PI*2+e.range(-.2,.2),h=r*e.range(.5,1.15),u=new R(s.x+Math.cos(l)*h,a,s.z+Math.sin(l)*h);n.push({geometry:Bt(s,u,.0028,.0018),color:6978116,sway:1});const f=new ee(r*e.range(.16,.26),0);if(f.scale(1,.32,1),f.translate(u.x,u.y,u.z),n.push({geometry:f,color:16250348,sway:1}),e.chance(.55)){const d=new ee(r*.1,0);d.scale(1,.3,1),d.translate(u.x+e.around(0,.008),u.y+.004,u.z+e.around(0,.008)),n.push({geometry:d,color:14210720,sway:1})}}return n}const jE=Qn("cowparsley",{height:[.55,1.15],stemThickness:.009,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[16250348],centre:14210720,count:[5,12],spread:.5,leaves:2,nod:0,head:KE},.7),Tm=11555727,Am=13070244,JE=9256307,lf=8211058;function QE({axis:i,height:t,rng:e}){const n=[],s=e.int(11,16),o=e.range(0,Math.PI*2),r=e.range(.4,.5);for(let c=0;c<s;c++){const l=c/(s-1),h=r+(1-r)*l,u=i(h),f=o+e.range(-.38,.38),d=t*.09*(1-l*.55),g=Math.min(1,Math.max(0,1.35-l*1.8)),y={x:Math.sin(f),z:Math.cos(f)},m=d*.12,p=u.x+y.x*m,_=u.z+y.z*m,v=d*(.8+g*.9),w=d*(.2+g*.28),b=.28+g*.42,S=f-Math.PI/2,E=new Z(d*.22,w,v,7);E.translate(0,-v/2,0),E.rotateZ(b),E.rotateY(S),E.translate(p,u.y,_),n.push({geometry:E,color:(x,M)=>M>u.y-v*.45?Am:Tm,sway:h});const T=new Z(w*(g>.3?1.22:.4),w*(g>.3?1.05:.15),d*.26,7);T.translate(0,-v-d*.06,0),T.rotateZ(b),T.rotateY(S),T.translate(p,u.y,_),n.push({geometry:T,color:g>.3?JE:lf,sway:h})}const a=i(1);for(let c=0;c<3;c++){const l=new ee(t*.014*(1-c*.22),0);l.scale(.75,1.5,.75),l.translate(a.x+Math.sin(o)*t*.01,a.y-c*t*.02,a.z+Math.cos(o)*t*.01),n.push({geometry:l,color:lf,sway:1})}return n}const tT=Qn("foxglove",{height:[1,1.8],stemThickness:.014,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[Tm],centre:Am,count:[1,4],spread:.3,leaves:2,nod:0,head:QE},.6);function eT({axis:i,height:t,rng:e}){const n=[],s=e.range(.62,.72),o=e.int(4,7),r=e.chance(.5)?8154022:9140920;for(let a=0;a<o;a++){const c=s+(1-s)*(a+.4)/o,l=i(c),h=(c-s)/(1-s),u=t*.028*(1-h**2.6*.42);for(let d=0;d<4;d++){const g=d/4*Math.PI*2+a*.7,y=new ee(u,0);y.scale(.8,1.15,.8),y.translate(l.x+Math.cos(g)*u*.85,l.y,l.z+Math.sin(g)*u*.85),n.push({geometry:y,color:r,sway:c})}const f=new Z(u*.5,u*.6,u*.8,5);f.translate(l.x,l.y-u*.9,l.z),n.push({geometry:f,color:9149051,sway:c})}return n}const nT=Qn("lavender",{height:[.5,.95],stemThickness:.007,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[8154022],centre:9149051,count:[16,30],spread:.26,leaves:1,nod:0,head:eT},.5);function iT({axis:i,height:t,rng:e}){const n=[],s=e.int(4,7);for(let d=0;d<s;d++){const g=.1+d/(s-1)*.78,y=i(g),m=t*e.range(.2,.34)*(1-g*.55),p=e.range(0,Math.PI*2)+d*1.9;for(const _ of[-1,1]){const v=m*e.range(.85,1.05),w=new R(y.x+Math.sin(p)*v*_,y.y-v*e.range(.25,.5),y.z+Math.cos(p)*v*_);n.push({geometry:Bt(y,w,.008,.003),color:6781258,sway:g});const b=e.int(3,5);for(let S=0;S<b;S++){const E=(S+.6)/(b+.4),T=new R().lerpVectors(y,w,E),x=m*.3*(1-Math.abs(E-.4)*.9);for(const M of[-1,1]){const A=new te(x*e.range(.3,.42),x*1.4,3);A.translate(0,x*.7,0),A.scale(1,1,.28),A.rotateZ(M*e.range(1.05,1.4)),A.rotateY(p*_+M*e.range(.2,.5)),A.translate(T.x,T.y,T.z),n.push({geometry:A,color:e.chance(.25)?9149034:6257210,sway:g})}}}}const o=i(1),r=t*e.range(.055,.085),a=new ee(r*.72,1);a.scale(.86,1.25,.86),a.translate(o.x,o.y+r*.85,o.z),n.push({geometry:a,color:6257210,sway:1});const c=9;for(let d=0;d<c;d++){const g=d/c*Math.PI*2+e.around(0,.2),y=r*e.range(.5,.8),m=new te(r*e.range(.07,.1),y,3);m.translate(0,y*.45,0),m.scale(1,1,.4),m.rotateZ(e.range(1.7,2.1)),m.rotateY(g),m.translate(o.x,o.y+r*1.35,o.z),n.push({geometry:m,color:7046978,sway:1})}const l=18;for(let d=0;d<l;d++){const g=d/l*Math.PI*2+e.around(0,.15),y=e.range(.35,.85),m=r*e.range(.8,1.3),p=new te(r*e.range(.035,.055),m,3);p.translate(0,m*.42,0),p.scale(1,1,.55),p.rotateZ(Math.PI/2-y*.8),p.rotateY(g),p.translate(o.x,o.y+r*e.range(.55,1),o.z),n.push({geometry:p,color:5335343,sway:1})}const h=e.int(26,38),u=o.y+r*1.5;for(let d=0;d<h;d++){const g=e.range(0,Math.PI*2),y=Math.sqrt(e()),m=y*.95,p=r*e.range(.75,1.15)*(1-y*.2),_=new te(r*e.range(.035,.055),p,3);_.translate(0,p*.5-p*e.range(.1,.3),0),_.rotateZ(m),_.rotateY(g),_.translate(o.x+Math.sin(g)*r*.22*y,u,o.z+Math.cos(g)*r*.22*y),n.push({geometry:_,color:(v,w)=>w>u+p*.35?14711496:11029654,sway:1})}const f=new ee(r*.34,0);return f.scale(1,.6,1),f.translate(o.x,u,o.z),n.push({geometry:f,color:9322366,sway:1}),n}const sT=Qn("thistle",{height:[.42,.9],stemThickness:.012,headSize:[0,0],petals:0,reach:0,petalWidth:0,cup:[0,0],petal:[14711496],centre:11029654,count:[1,4],spread:.35,leaves:0,nod:0,head:iT},.55),oT=Qn("daisy",{height:[.16,.36],stemThickness:.009,headSize:[.034,.05],petals:12,reach:1.9,petalWidth:.24,cup:[.05,.3],petal:[15921124,15263450,15786726],centre:15254346,count:[14,26],spread:.42,leaves:0,nod:0},.45),rT=Qn("poppy",{height:[.42,.75],stemThickness:.011,headSize:[.032,.05],petals:5,reach:2.2,petalWidth:.62,cup:[.55,.95],petal:[12071978,12861484,11021364],centre:2761500,count:[4,9],spread:.5,leaves:1,nod:.25},.55),aT=Qn("sunflower",{height:[1.1,1.9],stemThickness:.022,headSize:[.1,.16],petals:16,reach:1.5,petalWidth:.3,cup:[.15,.5],petal:[15250746,14460460,15713106],centre:5981226,count:[3,7],spread:.4,leaves:2,nod:.85,facing:.6},.75),cT="gallery-foliage",lT=[hE,uE,pE,gE,yE,bE,xE,ME,AE,RE,IE,NE,hm,LE,DE,OE,FE,UE,rm,om,am,BE,HE,cm,lm,tT,sT,aT,jE,nT,rT,ZE,oT,qE],hT={id:cT,name:"Foliage Gallery",builders:lT},uT="gallery-animal",dT=[pm,mm,gm,ym,vm,xm],fT={id:uT,name:"Animal Gallery",builders:dT},pT=22,mT=12,gT=16767392,hf=Math.SQRT2,yT={name:"streetlamp",category:"structures",radius:.9,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=[],o=e.range(2.9,3.6),r=e.range(.046,.062),a=e.range(.34,.5),c=e.chance(.35)?I.RUST:I.IRON,l=e.chance(.5)?I.STONE:I.STONE_DARK,h=r*6.2,u=new G(h,.15,h);u.translate(0,.075,0),n.push({geometry:u,color:U(l,e.around(1,.06)),sway:0});const f=new G(r*4.2,.12,r*4.2);f.translate(0,.2,0),n.push({geometry:f,color:U(c,1.05),sway:0});const d=.24,g=e.int(3,4),y=(o-d)/g;for(let ft=0;ft<g;ft++){const st=1-.28*(ft/g),gt=r*2*st,yt=new G(gt,y*1.06,gt);yt.translate(0,d+y*(ft+.5),0),n.push({geometry:yt,color:U(c,e.around(1,.07)),sway:0})}const m=r*2*(1-.28*(g-1)/g),p=m*.78,_=o-p*.62,v=new G(a+p,p,p);v.translate(a/2,_,0),n.push({geometry:v,color:U(c,.94),sway:0});const w=r*.5,b=_-e.range(.36,.5),S=a*.72,E=_-p*.5,T=S-w,x=E-b,M=Math.hypot(T,x)*1.18,A=new G(r*1.05,M,r*1.05);A.translate(0,M*.41,0),A.rotateZ(-Math.atan2(T,x)),A.translate(w,b,0),n.push({geometry:A,color:U(c,.88),sway:0});const P=new G(m*1.9,.07,m*1.9);if(P.translate(0,o-.02,0),n.push({geometry:P,color:U(c,1.1),sway:0}),e.chance(.5)){const ft=new te(m*.6,.16,4);ft.rotateY(Math.PI/4),ft.translate(0,o+.07,0),n.push({geometry:ft,color:U(c,1),sway:0})}const C=a,F=_-p/2,N=e.range(.05,.1),D=new G(r*.8,N*1.6,r*.8);D.translate(C,F-N*.5,0),n.push({geometry:D,color:U(c,.86),sway:0});const B=e.range(.115,.145),H=e.range(.26,.34),V=F-N,et=.13,lt=new Z(B*.45*hf,B*1.28*hf,et,4);lt.rotateY(Math.PI/4),lt.translate(C,V-et/2+.01,0),n.push({geometry:lt,color:U(c,1.02),sway:0});const Mt=r*.75;for(const ft of[-1,1])for(const st of[-1,1]){const gt=new G(Mt,H*1.1,Mt);gt.translate(C+ft*(B-Mt*.5),V-et-H/2+.02,st*(B-Mt*.5)),n.push({geometry:gt,color:U(c,.9),sway:0})}const Lt=V-et-H,J=r*.9,rt=B*2.2;for(const ft of[0,1])for(const st of[-1,1]){const gt=ft===0,yt=new G(gt?rt:J,.06,gt?J:rt-J*1.8),Gt=rt/2-J/2;yt.translate(C+(gt?0:st*Gt),Lt-.01,gt?st*Gt:0),n.push({geometry:yt,color:U(c,.8),sway:0})}const K=Lt+H*.5,q=new ke(B*.5,0);q.scale(1,1.6,1),q.translate(C,K,0),s.push({geometry:q,color:I.LAMPLIGHT,sway:0});const ot=vt(n),pt=vt(s),wt=e.range(0,Math.PI*2);ot.rotateY(wt),pt.rotateY(wt),t!==1&&(ot.scale(t,t,t),pt.scale(t,t,t));const Ft=bt(ot,"streetlamp",0);Ft.add(bn(pt,"streetlamp:glow"));const nt=Math.cos(wt)*C*t,ht=-Math.sin(wt)*C*t,k=new Yi(gT,pT*e.around(1,.12)*t*t,mT*t,2);return k.position.set(nt,K*t,ht),k.castShadow=!1,Ft.add(k),Ft}},vT={name:"cistern",category:"objects",radius:.75,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.5,.68),o=e.range(.09,.13),r=s-o,a=e.range(.44,.62),c=e.range(.1,.15),l=U(I.STONE,e.range(.9,1.08)),h=new Z(s*.99,s*1.02,c,10);h.translate(0,c/2,0),n.push({geometry:h,color:U(l,.92),sway:0});const u=[new tt(s,c*.5),new tt(s*.96,a),new tt(r,a),new tt(r*.97,c*.5),new tt(s,c*.5)],f=new Jn(u,10);n.push({geometry:f,color:(m,p)=>p>a*.9?U(l,1.18):l,sway:0});const d=c+(a-c)*e.range(.3,.55),g=new Z(r*.97,r*.97,.02,10);if(g.translate(0,d,0),n.push({geometry:g,color:I.WATER,sway:0}),e.chance(.55)){const m=new Z(s*1.28,s*1.34,.07,10);m.translate(0,.03,0),n.push({geometry:m,color:U(I.STONE_DARK,e.range(.94,1.06)),sway:0})}if(e.chance(.45)){const m=e.range(.14,.22),p=a*e.range(.72,.9);for(const v of[-1,1]){const w=new G(.05,.09,m);w.translate(v*.055,p,s*.86+m/2),n.push({geometry:w,color:U(l,.92),sway:0})}const _=new G(.16,.035,m);_.translate(0,p-.05,s*.86+m/2),n.push({geometry:_,color:U(l,.86),sway:0})}const y=vt(n);return y.rotateY(e.range(0,Math.PI*2)),t!==1&&y.scale(t,t,t),bt(y,"cistern",0)}},Rm={name:"hopper",category:"structures",radius:1.3,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.45,1.1),o=s*e.range(.14,.26),r=s*e.range(1.1,1.9),a=s*e.range(.25,.6),c=e.range(1.1,2.6),l=s*.05,h=U(7173499,e.range(.88,1.08)),u=U(I.IRON,e.range(.85,1.05)),f=e.chance(.45),d=c,g=c+r,y=g+a,m=[new tt(o,d),new tt(s,g),new tt(s,y),new tt(s-l,y),new tt(s-l,g),new tt(o-l*.6,d),new tt(o,d)],p=new Jn(m,6);n.push({geometry:p,color:f?(x,M)=>M<g?U(I.RUST,.9):h:h,sway:0});const _=new Z(s*1.06,s*1.06,l*2.4,6);_.translate(0,y-l,0),n.push({geometry:_,color:U(u,1.05),sway:0});const v=new Z(o*1.28,o*1.28,c*.45,6);v.translate(0,d-c*.18,0),n.push({geometry:v,color:U(u,.95),sway:0});const w=new G(o*2.4,o*.9,o*.28);w.rotateY(e.range(0,Math.PI)),w.translate(0,d-c*.34,0),n.push({geometry:w,color:U(I.RUST,1.08),sway:0});const b=4,S=s*1.05,E=g+a*.25;for(let x=0;x<b;x++){const M=x/b*Math.PI*2+Math.PI/4,A=new R(Math.sin(M)*S,0,Math.cos(M)*S),P=new R(Math.sin(M)*s*.88,E,Math.cos(M)*s*.88);n.push({geometry:Bt(A,P,.05,.042),color:u,sway:0});const C=new G(.18,.05,.18);C.translate(A.x,.025,A.z),n.push({geometry:C,color:U(u,.84),sway:0})}for(let x=0;x<b;x++){const M=x/b*Math.PI*2+Math.PI/4,A=(x+1)/b*Math.PI*2+Math.PI/4,P=C=>new R(Math.sin(C)*(S+s*.88)*.5,E*.45,Math.cos(C)*(S+s*.88)*.5);n.push({geometry:Bt(P(M),P(A),.032,.03),color:U(u,.88),sway:0})}const T=vt(n);return t!==1&&T.scale(t,t,t),bt(T,"hopper",0)}},Cm={name:"ladder",category:"structures",radius:.4,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(2.4,4.6),o=e.range(.36,.48),r=e.range(.02,.028),a=.3,c=Math.floor(s/a),l=e.chance(.45),h=U(l?I.TIMBER:I.IRON,e.range(.85,1.05)),u=l?U(I.TIMBER_DARK,e.range(.9,1.1)):U(I.IRON,e.range(1,1.15));for(const d of[-1,1]){const g=new G(r*(l?2:1.5),s,r*(l?2.2:3));g.translate(d*o/2,s/2,0),n.push({geometry:g,color:h,sway:0})}for(let d=0;d<c;d++){const g=l?new G(o*1.02,r*1.5,r*1.5):new Z(r*.72,r*.72,o*1.02,6);l||g.rotateZ(Math.PI/2),g.translate(0,a*(d+.6),0),n.push({geometry:g,color:u,sway:0})}const f=vt(n);return t!==1&&f.scale(t,t,t),bt(f,"ladder",0)}},_T={name:"panel",category:"structures",radius:.9,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(1,1.5),o=e.range(.85,1.15),r=e.range(.35,.6),a=e.range(.18,.26),c=U(I.IRON,e.range(.85,1.05)),l=e.chance(.5)?3093304:3814192,h=10124348,u=new G(s*.94,r,a*1.15);u.translate(0,r/2,0),n.push({geometry:u,color:U(c,.8),sway:0});const f=e.range(.1,.2),d=new G(s,o,a*.5);d.rotateX(-f),d.translate(0,r+o/2,a*.16),n.push({geometry:d,color:l,sway:0});for(const[E,T,x]of[[s*1.06,.06,r],[s*1.06,.06,r+o]]){const M=new G(E,T,a*.62);M.rotateX(-f),M.translate(0,x,a*.16+(x>r+.1?-o*f*.5:o*f*.5)),n.push({geometry:M,color:c,sway:0})}const g=e.int(3,5),y=e.int(2,3),m=s*.84/g,p=o*.78/y,_=r+o/2,v=a*.16,w=a*.25,b=(E,T)=>{const x=-s*.42+m*(E+.5),M=o*.4-p*(T+.5)+p*.5;return new R(x,_+M*Math.cos(f)+w*Math.sin(f),v-M*Math.sin(f)+w*Math.cos(f))};for(let E=0;E<y;E++)for(let T=0;T<g;T++){const x=b(T,E),M=E===0,A=e(),P=M?A<.6?"gauge":A<.8?"lamp":"dial":A<.4?"lever":A<.65?"knife":A<.85?"button":"dial";if(P==="gauge"){const C=Math.min(m,p)*.36,F=new Z(C,C,a*.3,10);F.rotateX(Math.PI/2-f),F.translate(x.x,x.y,x.z),n.push({geometry:F,color:h,sway:0});const N=new Z(C*.76,C*.76,a*.34,10);N.rotateX(Math.PI/2-f),N.translate(x.x,x.y,x.z+a*.04),n.push({geometry:N,color:14209726,sway:0});const D=e.range(-1.1,1.1),B=new G(C*.09,C*1.25,a*.12);B.translate(0,C*.5,0),B.rotateZ(D),B.rotateX(-f),B.translate(x.x,x.y,x.z+a*.1),n.push({geometry:B,color:2367260,sway:0})}else if(P==="lamp"){const C=Math.min(m,p)*.18,F=new Z(C*1.5,C*1.5,a*.26,8);F.rotateX(Math.PI/2-f),F.translate(x.x,x.y,x.z),n.push({geometry:F,color:U(c,.9),sway:0});const N=new te(C*1.15,C*1.5,8);N.rotateX(Math.PI/2-f),N.translate(x.x,x.y,x.z+a*.14),n.push({geometry:N,color:e.chance(.5)?12075052:10135610,sway:0})}else if(P==="dial"){const C=Math.min(m,p)*.22,F=new Z(C,C,a*.4,8);F.rotateX(Math.PI/2-f),F.translate(x.x,x.y,x.z+a*.08),n.push({geometry:F,color:U(c,1.18),sway:0});const N=new G(C*.24,C*1.5,a*.16);N.translate(0,C*.7,0),N.rotateZ(e.range(-2.4,2.4)),N.rotateX(-f),N.translate(x.x,x.y,x.z+a*.22),n.push({geometry:N,color:h,sway:0})}else if(P==="button")for(let C=0;C<3;C++){const F=Math.min(m,p)*.11,N=x.x+(C-1)*m*.26,D=new Z(F,F*1.2,a*.34,8);D.rotateX(Math.PI/2-f),D.translate(N,x.y,x.z+a*.06),n.push({geometry:D,color:C===0?10135610:C===2?12075052:U(c,1.2),sway:0})}else if(P==="knife"){const C=m*.34;for(const D of[-1,1]){const B=new G(C*.34,p*.16,a*.34);B.rotateX(-f),B.translate(x.x+D*C,x.y-p*.12,x.z+a*.06),n.push({geometry:B,color:h,sway:0})}const F=e.chance(.5),N=new G(C*2.2,p*.1,a*.16);N.rotateZ(F?0:e.range(.6,1)),N.rotateX(-f),N.translate(x.x,x.y-p*(F?.12:-.05),x.z+a*.14),n.push({geometry:N,color:U(h,1.15),sway:0})}else{const C=p*e.range(.55,.85),F=e.range(-.9,.9),N=new Z(.013,.018,C,5);N.translate(0,C/2,0),N.rotateZ(F),N.rotateX(-f-.85),N.translate(x.x,x.y-p*.2,x.z+a*.06),n.push({geometry:N,color:U(c,1.15),sway:0});const D=new ee(.03,0);D.translate(x.x+Math.sin(F)*-C,x.y-p*.2+Math.cos(F)*C*.66,x.z+a*.06+C*.7),n.push({geometry:D,color:e.chance(.5)?I.RUST:h,sway:0})}}const S=vt(n);return t!==1&&S.scale(t,t,t),bt(S,"panel",0)}},wT={name:"stair",category:"structures",radius:2.2,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(.17,.2),o=e.range(.23,.27),r=e.int(11,16),a=e.range(.85,1.05),c=s*r,l=o*r,h=U(I.IRON,e.range(.85,1.05)),u=U(I.IRON,e.range(.95,1.15)),f=Math.atan2(c,l),d=Math.hypot(c,l);for(const b of[-1,1]){const S=new G(.06,.28,d+.2);S.rotateX(f),S.translate(b*a/2,c/2-.06,-l/2),n.push({geometry:S,color:h,sway:0})}for(let b=0;b<r;b++){const S=new G(a*.94,.035,o*.72);S.translate(0,s*(b+1),-o*(b+.5)),n.push({geometry:S,color:u,sway:0});const E=new G(a*.94,.05,.03);E.translate(0,s*(b+1)-.012,-o*(b+.5)-o*.36),n.push({geometry:E,color:U(u,.86),sway:0})}const g=e.range(.9,1.3),y=new G(a+.12,.07,g);y.translate(0,c,-l-g/2+.02),n.push({geometry:y,color:U(u,1.06),sway:0});for(const b of[-1,1]){const S=new Z(.045,.05,c,6);S.translate(b*a/2,c/2,-l-g+.12),n.push({geometry:S,color:U(h,.9),sway:0})}const m=e.chance(.5)?1:-1,p=1.05,_=4;for(let b=0;b<=_;b++){const S=b/_,E=new Z(.022,.026,p,6);E.translate(m*a/2,s*r*S+p/2,-l*S),n.push({geometry:E,color:h,sway:0})}const v=new Z(.026,.026,d+.16,6);v.rotateX(Math.PI/2+f),v.translate(m*a/2,c/2+p,-l/2),n.push({geometry:v,color:U(h,1.12),sway:0});const w=vt(n);return t!==1&&w.scale(t,t,t),bt(w,"stair",0)}},fu={name:"workbench",category:"furniture",radius:1.2,build({seed:i=1,scale:t=1}={}){const e=xt(i),n=[],s=e.range(1.4,2.1),o=e.range(.6,.75),r=e.range(.86,.92),a=e.range(.06,.09),c=U(I.IRON,e.range(.85,1.05)),l=U(I.TIMBER,e.range(.82,1)),h=e.int(3,5);for(let x=0;x<h;x++){const M=new G(s,a,o/h*.97);M.translate(0,r-a/2,-o/2+o/h*(x+.5)),n.push({geometry:M,color:U(l,e.range(.9,1.12)),sway:0})}const u=e.range(.032,.045),f=.1,d=r-a*.4;for(const x of[-1,1])for(const M of[-1,1]){const A=new G(u*2,d,u*2);A.translate(x*(s-f*2)/2,d/2,M*(o-f*2)/2),n.push({geometry:A,color:c,sway:0})}for(const x of[-1,1]){const M=new G(s-f*2,u*1.5,u*1.4);M.translate(0,r*.22,x*(o-f*2)/2),n.push({geometry:M,color:U(c,.86),sway:0})}if(e.chance(.6)){const x=new G(s-f*2.4,.03,o-f*2.4);x.translate(0,r*.26,0),n.push({geometry:x,color:U(l,.8),sway:0})}if(!e.chance(.5)){const x=vt(n);return t!==1&&x.scale(t,t,t),bt(x,"workbench",0)}const g=s*e.range(.2,.34)*(e.chance(.5)?1:-1),y=o/2,m=e.range(.13,.18),p=e.range(.02,.12),_=new G(m*1.1,m*.85,m*1.5);_.translate(g,r+m*.42,y-m*.35),n.push({geometry:_,color:U(c,1.1),sway:0});for(const[x,M]of[[y+p*.5,1],[y-p*.5-m*.28,.95]]){const A=new G(m*1.25*M,m*.7,m*.24);A.translate(g,r+m*.5,x),n.push({geometry:A,color:U(c,1.2),sway:0})}const v=new Z(m*.11,m*.11,m*1.1,6);v.rotateX(Math.PI/2),v.translate(g,r+m*.5,y+m*.55),n.push({geometry:v,color:U(c,1.25),sway:0});const w=e.range(0,Math.PI),b=m*.8,S=new R(g,r+m*.5,y+m*1.02),E=[-1,1].map(x=>new R(S.x+Math.cos(w)*b*x,S.y+Math.sin(w)*b*x,S.z));n.push({geometry:Bt(E[0],E[1],m*.06,m*.06,5),color:U(c,1.1),sway:0});for(const x of E){const M=new ee(m*.085,0);M.translate(x.x,x.y,x.z),n.push({geometry:M,color:U(c,1.2),sway:0})}const T=vt(n);return t!==1&&T.scale(t,t,t),bt(T,"workbench",0)}},xT="gallery-village",MT="gallery-factory",bT=[bs,la,_m,Lb,um,dm,yT,fm,vT,uu,wm,Vi,yi,fa,pa,Co,ha,ua,Jh,Ss,em,Ca,nm,cu,sm,au,ru,Pa,im],ST={id:xT,name:"Village Gallery",builders:bT},ET=[da,hu,nu,Rm,eu,lu,iu,fu,_T,Qh,wT,Cm,su,ou,Kn],TT={id:MT,name:"Factory Gallery",builders:ET},Pm=8,AT=1.4,dh=Ap,pu=16,uf=new Ke({color:3813928,flatShading:!0}),RT=new Ke({color:12168594,flatShading:!0}),CT=new Ke({color:2827808,flatShading:!0});function PT(i,t,e){let n=2166136261;for(let h=0;h<i.length;h++)n=Math.imul(n^i.charCodeAt(h),16777619);const s=xt(n>>>0),o=[],r=t*.1,a=t-r*2,c=2+(s.chance(.45)?1:0),l=e/(c+.9);for(let h=0;h<c;h++){const u=e/2-l*(h+.95),f=h===c-1?s.range(.4,.8):s.range(.82,1);let d=-a/2;const g=-a/2+a*f;for(;d<g;){const y=Math.min(s.range(a*.08,a*.26),g-d);if(y<a*.04)break;const m=new ie(new G(y,l*s.range(.3,.42),.008),CT);m.position.set(d+y/2,u,0),o.push(m),d+=y+a*s.range(.045,.09)}}return o}function Im(i){const t=new we;t.name=`sign:${i}`;const e=qn.eyeHeight*.68,n=new ie(new G(.09,e,.09),uf);n.position.y=e/2,t.add(n);const s=.62,o=.26,r=new we;r.position.set(0,e-.1,.045),r.rotation.x=-.16;const a=new ie(new G(s,o,.05),RT);r.add(a);for(const l of PT(i,s,o))l.position.z+=.026,r.add(l);t.add(r);const c=new ie(new G(.13,.05,.13),uf);return c.position.y=e+.02,t.add(c),Sb(t,IT(i))}function IT(i){return i.split("-").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}function Lm(i){const t=[];let e=0;for(let n=0;n<i.length;n++){t.push(e);const s=i[n+1];s&&(e+=i[n].radius+s.radius+AT)}return{offsets:t,width:e}}function LT(i){const t=new we;t.name="rows";const{offsets:e,width:n}=Lm(i),s=-n/2;for(let o=0;o<i.length;o++){const r=i[o],a=s+e[o],c=new we;c.name=`row:${r.name}`;const l=Im(r.name);l.position.set(a,0,dh),c.add(l);for(let h=0;h<Pm;h++){const u=r.build({seed:1e3+h*7919});u.position.set(a,0,-h*dh),c.add(r.solid===!1?u:Te(u))}t.add(c)}return t}function Jc(i){const{width:t}=Lm(i),e=Math.max(t,pu+Pm*dh)+40;return Math.min(200,Math.max(120,Math.ceil(e/20)*20))}function df(i){return i*.46}function DT(i){return{zone:i.id,position:new R(0,0,pu),yaw:Math.PI,material:"timber",seed:3300+i.id.length*137}}function NT(i){return{id:i.id,name:i.name,environment:{...Aa,fogNear:df(Jc(i.builders))*.45,fogFar:df(Jc(i.builders)),ambientGround:12563096,surface:"stone",room:"open",soundscape:i.soundscape??Kp},spawn:{position:new R(0,.1,pu-2),yaw:0},floor:-20,groundAt:()=>0,build(){const t=new we;t.add(qh(Jc(i.builders))),t.add(LT(i.builders));for(const e of i.extras?.()??[])t.add(e);return t}}}function UT(i,t){return{id:`portal:${i.id}`,a:t,b:DT(i)}}const FT=[hT,fT,ST,TT],mu="sound-stage",fh=Ap*1.5,gu=14,Zr=1.15,Ge={refDistance:2,maxDistance:42,rolloff:1.2,reverb:.4},Us=[{kind:"emitter",name:"wind",spec:{model:"wind",id:"wind",options:{gain:.3},...Ge}},{kind:"emitter",name:"foliage",spec:{model:"foliage",id:"foliage",options:{gain:.4},...Ge}},{kind:"emitter",name:"rain",spec:{model:"rain",id:"rain",options:{gain:.5,intensity:.6,surface:"earth"},...Ge}},{kind:"emitter",name:"water",spec:{model:"water",id:"water",options:{gain:.4},...Ge}},{kind:"scatter",name:"drip",spec:{sound:"drip",id:"drip",every:3.5,spread:[.2,.1,.2],...Ge}},{kind:"emitter",name:"fire",spec:{model:"fire",id:"fire",options:{gain:.5},...Ge}},{kind:"emitter",name:"machine",spec:{model:"machine",id:"machine",options:{gain:.35},...Ge}},{kind:"emitter",name:"friction",spec:{model:"friction",id:"friction",options:{motion:"steady",speed:.28,gain:.4},...Ge}},{kind:"emitter",name:"waveguide",spec:{model:"waveguide",id:"waveguide",options:{excite:"chime",pitch:900,decay:3,bright:.7,drive:.3,gain:.4},...Ge}},{kind:"scatter",name:"hammer",spec:{sound:"hammer",id:"hammer",every:4,spread:[.3,.2,.3],...Ge}},{kind:"scatter",name:"clatter",spec:{sound:"clatter",id:"clatter",every:6,spread:[.5,.2,.5],...Ge}},{kind:"emitter",name:"bird",spec:{model:"bird",id:"bird",options:{gain:.2},...Ge}},{kind:"emitter",name:"crowd",spec:{model:"crowd",id:"crowd",options:{gain:.4},...Ge}},{kind:"scatter",name:"animal",spec:{sound:"animal",id:"animal",every:5,spread:[.4,.2,.4],...Ge}},{kind:"scatter",name:"bell",spec:{sound:"bell",id:"bell",every:11,spread:[.2,.1,.2],...Ge,reverb:1}}],OT=Us.map(i=>i.spec.id);function ph(i){return[-((Us.length-1)*fh)/2+i*fh,Zr+.25,0]}const zT={emitters:Us.flatMap((i,t)=>i.kind==="emitter"?[{...i.spec,at:ph(t)}]:[]),scatter:Us.flatMap((i,t)=>i.kind==="scatter"?[{...i.spec,at:ph(t)}]:[])},kT=new Ke({color:U(I.STONE,.94),flatShading:!0}),BT=new Ke({color:U(I.STONE_PALE,1.02),flatShading:!0});function HT(i,t){const e=new we;e.name=`station:${i}`;const n=new ie(new G(.8,Zr,.8),kT);n.position.set(t,Zr/2,0),e.add(Te(n));const s=new ie(new G(1,.09,1),BT);s.position.set(t,Zr+.045,0),e.add(Te(s));const o=Im(i);return o.position.set(t,0,1.5),e.add(o),e}function Qc(){const i=(Us.length-1)*fh+gu*2+40;return Math.min(200,Math.max(120,Math.ceil(i/20)*20))}function GT(){return{id:mu,name:"Sound Stage",environment:{...Aa,fogNear:Qc()*.2,fogFar:Qc()*.46,ambientGround:12563096,surface:"stone",room:"open",soundscape:zT},spawn:{position:new R(0,.1,gu-2),yaw:0},floor:-20,groundAt:()=>0,build(){const i=new we;return i.add(qh(Qc())),Us.forEach((t,e)=>{i.add(HT(t.name,ph(e)[0]))}),i}}}function VT(){return{zone:mu,position:new R(0,0,gu),yaw:Math.PI,material:"iron",seed:6601}}function WT(i){return{id:`portal:${mu}`,a:i,b:VT()}}const mh="factory-2",Dm="factory-3",gh="hut-room",Nm="hut-room-2",li=.07,gs={width:7,depth:22,height:4},ao={width:8.5,depth:8.5,height:9},yh={width:5.5,depth:6,height:2.5},ff={width:9,depth:5,height:3},pf={...ca,room:"hall",surface:"stone",fogColor:"#0f1316",ambientSky:7766414,ambientGround:8682867,ambientIntensity:2.1,sunIntensity:.85,fillIntensity:.8,fillColor:9346736,footstepReverb:.34},mf={...ca,room:"cell",surface:"wood",fogColor:"#181309",ambientSky:10655612,ambientGround:5721148,ambientIntensity:2.3,sunIntensity:1.2,fillIntensity:.8,fillColor:10521706,footstepReverb:.45};function XT(){return[{id:mh,name:"Factory 2",environment:{...pf,fogNear:7,fogFar:30},spawn:{position:new R(0,.1,-22/2+2),yaw:Math.PI},floor:-5,build:()=>qT()},{id:Dm,name:"Factory 3",environment:{...pf,fogNear:11,fogFar:42,ambientIntensity:2.4},spawn:{position:new R(0,.1,-8.5/2+2),yaw:Math.PI},floor:-5,build:()=>$T()},{id:gh,name:"Villager Hut Room",environment:{...mf,fogNear:4,fogFar:20,ambientIntensity:1.9,sunIntensity:.7},spawn:{position:new R(0,.1,1),yaw:Math.PI},floor:-5,build:()=>ZT()},{id:Nm,name:"Villager Hut Room 2",environment:{...mf,fogNear:6,fogFar:26,ambientIntensity:2.6,sunIntensity:1.35},spawn:{position:new R(0,.1,1),yaw:Math.PI},floor:-5,build:()=>KT()}]}function YT(i,t){const e=gs.depth/2;return[{id:"factory-2-door",a:{zone:i,position:new R(2.2,0,-11/2+li),yaw:0,material:"iron",seed:9401},b:{zone:mh,position:new R(0,0,-e+li),yaw:0,material:"iron",seed:9402}},{id:"factory-3-door",a:{zone:mh,position:new R(0,0,e-li),yaw:Math.PI,material:"iron",seed:9403},b:{zone:Dm,position:new R(0,0,-4.25+li),yaw:0,material:"iron",seed:9404}},{id:"hut-room-door",a:{zone:t,position:new R(10/2-li,0,2),yaw:-Math.PI/2,material:"timber",seed:8901},b:{zone:gh,position:new R(0,0,-6/2+li),yaw:0,material:"timber",seed:8902}},{id:"hut-room-2-door",a:{zone:gh,position:new R(yh.width/2-li,0,0),yaw:-Math.PI/2,material:"timber",seed:8903},b:{zone:Nm,position:new R(0,0,-5/2+li),yaw:0,material:"timber",seed:8904}}]}function qT(){const i=new we;i.add(Hs({...gs,seed:7710,style:jh,planks:!1,beams:0}));const t=gs.width/2,e=-t+1.5,n=t-1.4;[-7.5,-2.5,2.5,7.5].forEach((r,a)=>{Qt(i,da.build({seed:3410+a}),e,0,r,Math.PI/2)}),[-5,0,5].forEach((r,a)=>{Qt(i,su.build({seed:9410+a}),e+1.6,0,r,Math.PI/2)}),Qt(i,nu.build({seed:4410}),n,0,-6.4,Math.PI/2),Qt(i,Rm.build({seed:4411}),n+.2,0,-1.2,-Math.PI/2),Qt(i,fu.build({seed:4412}),n,0,3.4,-Math.PI/2),Qt(i,Vi.build({seed:4413}),n+.1,0,6.2,.3),Qt(i,yi.build({seed:4414}),n-.3,0,7.4,.1),Qt(i,Qh.build({seed:4415}),t-.55,0,9.4,-Math.PI/2),[-8,-3,2,7].forEach((r,a)=>{const c=eu.build({seed:9420+a});c.position.set(-t+.34,0,r),c.rotation.y=Math.PI/2,i.add(c)});const s=iu.build({seed:9430});s.position.set(t-.22,1.4,-9.2),s.rotation.y=-Math.PI/2,i.add(s);const o=new Ke({color:U(I.IRON,.9),flatShading:!0});for(let r=0;r<11;r++){const a=-11+(r+.5)/11*gs.depth,c=new ie(new G(gs.width,.16,.2),o);c.position.set(0,gs.height-.12,a),i.add(c)}return Qt(i,Kn.build({seed:5510}),.9,0,-8,-Math.PI/2),Qt(i,Kn.build({seed:5511}),.9,0,0,-Math.PI/2),Qt(i,Kn.build({seed:5512}),.9,0,8,-Math.PI/2),Te(i)}function $T(){const i=new we;i.add(Hs({...ao,seed:7720,style:jh,planks:!1,beams:0}));const t=ao.width/2,e=ao.depth/2;Qt(i,lu.build({seed:8120}),0,0,1.2,Math.PI/2),Qt(i,Cm.build({seed:6210}),-t+.42,0,-2.4,Math.PI/2),Qt(i,hu.build({seed:6220}),-t+1.3,0,e-1.4,Math.PI*.25),Qt(i,uu.build({seed:6221}),-1.6,0,2.6,.4),Qt(i,Vi.build({seed:6230}),t-.9,0,-1.6,.2),Qt(i,yi.build({seed:6231}),t-.8,0,.1,.5),Qt(i,fu.build({seed:6232}),t-1.2,0,2.4,-Math.PI/2),Qt(i,ou.build({seed:6240}),2.2,0,e-.8,0);const n=new Ke({color:U(I.IRON,.86),flatShading:!0});for(const o of[-t+.6,t-.6]){const r=new ie(new G(1.2,.12,ao.depth-.7),n);r.position.set(o,4.2,0),i.add(r);const a=new ie(new G(.08,.9,ao.depth-.7),n);a.position.set(o+(o<0?.55:-.55),4.7,0),i.add(a)}Qt(i,Kn.build({seed:5520}),1.4,0,-2.8,Math.PI);const s=Kn.build({seed:5521});return s.position.set(t-1.1,4.3,-1.5),s.rotation.y=Math.PI/2,i.add(s),Te(i)}function ZT(){const i=new we;i.add(Hs({...yh,seed:4410,style:Ra,planks:!0,beams:2}));const t=yh.depth/2;Qt(i,Ca.build({seed:4420}),-2.75+.4,0,-1.4,Math.PI/2),Qt(i,Pa.build({seed:4421}),-2.75+.55,0,.6,Math.PI/2);const e=Vi.build({seed:4422});return Qt(i,e,-2.75+.75,0,2.1,.15),Qt(i,yi.build({seed:4423}),-2.75+.7,0,t-.7,.4),Qt(i,yi.build({seed:4424}),.3,0,t-.65,.9),Qt(i,ru.build({seed:4425}),1.6,0,t-.7,.2),Qt(i,au.build({seed:4426}),1.5,0,-t+.16,0),Qt(i,pa.build({seed:7110}),-2.75+.8,Um(e),2.1,.7),Te(i)}function KT(){const i=new we;i.add(Hs({...ff,seed:4430,style:Ra,planks:!0,beams:4}));const t=ff.depth/2;Qt(i,Ss.build({seed:4440}),-2.9,0,t-.1,Math.PI),Qt(i,Ss.build({seed:4441}),.1,0,t-.1,Math.PI),Qt(i,Ss.build({seed:4442}),3.1,0,t-.1,Math.PI);const e=Co.build({seed:4451});return Qt(i,e,2.2,0,.9,.05),Qt(i,ha.build({seed:4452}),2,0,.1,.2),Qt(i,ua.build({seed:4453}),3.5,0,.9,-.3),Qt(i,Ca.build({seed:4461}),3.8,0,-t+.6,0),Qt(i,cu.build({seed:4450}),-3.4,0,t-1.1,Math.PI*.9),Qt(i,Jh.build({seed:4460}),-3.2,0,-1.2,Math.PI/2),Qt(i,Pa.build({seed:4462}),-1.9,0,-t+.5,0),Qt(i,bs.build({seed:6610}),-2.4,0,.9,Math.PI*.15),Qt(i,fa.build({seed:7120}),2.35,Um(e),.7,.4),Te(i)}function Um(i){return i.geometry.computeBoundingBox(),(i.geometry.boundingBox?.max.y??0)+i.position.y}function Qt(i,t,e,n,s,o){t.position.set(e,n,s),t.rotation.y=o,i.add(t)}const Fi="exterior",tl="villager-hut",el="factory",nl=new R(5,0,6),zr=0,jT=new R(14,0,6),JT=0,QT=new R(18,0,6),tA=0,il=.07,eA=new R(10,0,6),nA=0,sl=new R(-10,0,22),iA=5,sA=Math.PI,ol={width:10,depth:8,height:3.4},fs={width:15,depth:11,height:5.6},oA=new R(0,1,0),vh=-5.4,_h=[-2.4,1.1,4.4],wh=[1.5,.9,1.9],xh=[-1.8,2.6,2.4],Mh=[15/2-.34,1.5,1.6],rA={emitters:[{model:"machine",id:"engine-north",at:[vh+1,1.1,_h[0]],options:{rpm:74,fundamental:52,gain:.15,wear:.55,clank:.45},refDistance:1.4,maxDistance:22,rolloff:1.7,reverb:.3},{model:"machine",id:"engine-south",at:[vh+1,1.1,_h[2]],options:{rpm:46,fundamental:35,gain:.16,wear:.8,clank:.7},refDistance:1.4,maxDistance:22,rolloff:1.7,reverb:.35},{model:"friction",id:"gantry",at:xh,options:{motion:"cycle",speed:.26,force:.8,pitch:210,decay:1.4,bright:.4,roughness:.22,gain:.18},refDistance:1.6,maxDistance:22,rolloff:1.5,reverb:.8,importance:1.5},{model:"waveguide",id:"pipe-air",at:Mh,options:{excite:"breath",closed:!0,pitch:190,decay:.9,bright:.28,drive:.55,gain:.3},refDistance:1.2,maxDistance:9,rolloff:1.8,reverb:.4}],scatter:[{sound:"clatter",id:"fitting",at:wh,spread:[1.1,.4,1.1],every:17,force:[.3,.85],options:{material:"metal",gain:.2,pieces:3},refDistance:1.8,maxDistance:22,rolloff:1.3,reverb:.85}]};function aA(i){return{zone:Fi,position:new R(sl.x+i*iA,sl.y,sl.z),yaw:sA,material:"timber",seed:5200+i*17}}function cA(i){const t=la.build({seed:5511});t.position.copy(nl),t.rotation.y=zr;const e=Zb(t),n=new R(e.x,0,e.z+il).applyAxisAngle(oA,zr).add(nl),s=[{id:Fi,name:"Outside",environment:{...Aa,ambientGround:12563096},spawn:{position:H2.clone(),yaw:0},floor:-20,build(){const r=i.populate(),a=la.build({seed:5511});return a.position.copy(nl),a.rotation.y=zr,r.add(Te(a)),r}},{id:tl,name:"Villager Hut",environment:{...ca,room:"cell",surface:"wood",fogColor:"#181309",fogNear:9,fogFar:34,ambientSky:10655612,ambientGround:5721148,ambientIntensity:2.3,sunIntensity:1.2,fillIntensity:.8,fillColor:10521706,footstepReverb:.45},spawn:{position:new R(0,.1,1),yaw:Math.PI},floor:-5,build:()=>lA()},{id:el,name:"The Factory",environment:{...ca,room:"hall",surface:"stone",fogColor:"#111519",fogNear:12,fogFar:48,ambientSky:8161172,ambientGround:9077624,ambientIntensity:2.2,sunIntensity:.9,fillIntensity:.85,fillColor:9675701,footstepReverb:.34,soundscape:rA},spawn:{position:new R(0,.1,2),yaw:Math.PI},floor:-5,build:()=>hA()},aE(),...XT()],o=[{id:"hut-door",a:{zone:Fi,position:n,yaw:zr,material:"timber",seed:8801},b:{zone:tl,position:new R(0,0,-8/2+il),yaw:0,material:"timber",seed:8802}},{id:"factory-door",a:{zone:Fi,position:jT,yaw:JT,material:"iron",seed:9301},b:{zone:el,position:new R(0,0,-11/2+il),yaw:0,material:"iron",seed:9302}},{id:"village-gate",a:{zone:Fi,position:eA,yaw:nA,material:"timber",seed:4712},b:{zone:du,position:ki.clone().setY(oE.heightAt(ki.x,ki.z)),yaw:Math.PI,material:"timber",seed:4713}},...YT(el,tl)];return FT.forEach((r,a)=>{s.push(NT(r)),o.push(UT(r,aA(a)))}),s.push(GT()),o.push(WT({zone:Fi,position:QT,yaw:tA,material:"iron",seed:6600})),{zones:s,portals:o}}function lA(){const i=new we;i.add(Hs({...ol,seed:4400,style:Ra,planks:!0,beams:3}));const t=ol.width/2,e=ol.depth/2;se(i,em.build({seed:8801}),-t+.12,0,.4,Math.PI/2),se(i,Ss.build({seed:8810}),-2.6,0,e-.1,Math.PI),se(i,Ss.build({seed:8811}),2.4,0,e-.1,Math.PI),se(i,nm.build({seed:8820}),t-.35,0,-1.6,-Math.PI/2),se(i,Jh.build({seed:3120}),-t+.95,0,-2.5,0);const n=Pa.build({seed:8830});se(i,n,-t+1,0,-1,.06);const s=Co.build({seed:2077});se(i,s,.6,0,.9,.08),se(i,ha.build({seed:411}),-.5,0,1.5,Math.PI*.4),se(i,ha.build({seed:412}),.9,0,-.4,.1),se(i,ua.build({seed:413}),1.7,0,.4,.4),se(i,ua.build({seed:415}),-t+1.6,0,.2,-.5),se(i,cu.build({seed:8840}),-2.9,0,e-2.2,Math.PI*.85);const o=Co.build({seed:2078});se(i,o,-.2,0,e-.8,Math.PI),se(i,Ca.build({seed:8850}),2.6,0,-e+.35,0),se(i,ru.build({seed:8860}),-t+.75,0,3.3,.4),se(i,au.build({seed:8870}),-t+.16,0,2.4,Math.PI/2),se(i,sm.build({seed:8880}),-1.5,0,-e+.14,0),se(i,im.build({seed:8890}),-2.3,0,-e+.45,.25),se(i,bs.build({seed:6602}),.4,0,2.1,Math.PI*.9);const r=Vi.build({seed:61});return se(i,r,t-.9,0,-e+1,.4),se(i,yi.build({seed:67}),t-.7,0,-.2,.2),se(i,fa.build({seed:7101}),.75,kr(s),.65,.6),se(i,fa.build({seed:7102}),-.35,kr(o),e-.85,-.4),se(i,pa.build({seed:7103}),t-.95,kr(r),-e+1,.9),se(i,pa.build({seed:7104}),-t+1.05,kr(n),-1.05,-.5),Te(i)}function hA(){const i=new we;i.add(Hs({...fs,seed:7700,style:jh,planks:!1,beams:0}));const t=fs.width/2,e=fs.depth/2,n=vh;_h.forEach((l,h)=>{se(i,da.build({seed:3301+h}),n,0,l,Math.PI/2)}),se(i,nu.build({seed:4401}),5.1,0,2.1,Math.PI/2),se(i,da.build({seed:3304}),wh[0],0,wh[2],-.35);const s=[[-3.6,-e+.34,0],[3.6,-e+.34,0],[Mh[0],Mh[2],Math.PI/2],[t-.34,-2.4,Math.PI/2]];for(let l=0;l<s.length;l++){const[h,u,f]=s[l],d=eu.build({seed:9101+l});d.position.set(h,0,u),d.rotation.y=f,i.add(d)}const o=iu.build({seed:9201});o.position.set(t-.22,1.4,-1.4),o.rotation.y=-Math.PI/2,i.add(o);const r=new Ke({color:U(I.IRON,.92),flatShading:!0}),a=fs.height-.12,c=.42;for(const l of[-4.2,-1.4,1.4,4.2]){const h=new we;for(const[d,g]of[[a,.13],[a-c,.1]]){const y=new ie(new G(fs.width,g,g*1.25),r);y.position.set(0,d,0),h.add(y)}const u=9,f=fs.width/u;for(let d=0;d<u;d++){const g=new ie(new G(.07,Math.hypot(f,c),.09),r);g.position.set(-15/2+f*(d+.5),a-c/2,0),g.rotation.z=(d%2===0?1:-1)*Math.atan2(f,c),h.add(g)}h.position.z=l,i.add(h)}return se(i,su.build({seed:9301}),n+1.9,0,1,Math.PI/2),se(i,ou.build({seed:9302}),2.4,0,e-.7,0),se(i,Qh.build({seed:9401}),t-.55,0,-e+1.5,-Math.PI/2),se(i,lu.build({seed:8110}),xh[0],0,xh[2],Math.PI/2),se(i,Kn.build({seed:5501}),-.6,0,-2.4,-Math.PI/2),se(i,Kn.build({seed:5502}),-.6,0,4.4,-Math.PI/2),se(i,Kn.build({seed:5503}),1.2,0,-.6,Math.PI/2),Te(i)}function kr(i){return i.geometry.computeBoundingBox(),(i.geometry.boundingBox?.max.y??0)+i.position.y}function se(i,t,e,n,s,o){t.position.set(e,n,s),t.rotation.y=o,i.add(t)}const Br=[0,125,250,500,1e3,2e3,5e3,1e4];function uA(i){let t=0,e=0,n=0;for(let o=0;o<i.length;o++){const r=i[o],a=Math.abs(r);a>t&&(t=a),e+=r,n+=r*r}const s=Math.sqrt(n/Math.max(i.length,1));return{peak:t,rms:s,dc:e/Math.max(i.length,1),crest:s>1e-9?20*Math.log10(t/s):0}}function dA(i,t){const e=Math.min(i.length,16384),n=12,s=l=>{let h=0,u=0;const f=2*Math.PI*l/t;for(let d=0;d<e;d++){const g=f*d;h+=i[d]*Math.cos(g),u+=i[d]*Math.sin(g)}return(h*h+u*u)/e},o=[];let r=0,a=0;for(let l=0;l<Br.length;l++){const h=Math.max(Br[l],20),u=l+1<Br.length?Br[l+1]:Math.min(t/2,2e4);let f=0;for(let d=0;d<n;d++){const g=h*Math.pow(u/h,(d+.5)/n),y=s(g);f+=y,r+=y*g,a+=y}o.push(f)}const c=o.reduce((l,h)=>l+h,0);return{bands:c>0?o.map(l=>l/c):o.map(()=>0),centroid:a>0?r/a:0}}function fA(i,t){if(t<=1e-9)return-1/0;const e=[.15,.4,.7,.95,1.1,1.15,.9,.5];let n=0;for(let s=0;s<i.length;s++)n+=i[s]*(e[s]??.5);return 20*Math.log10(t)+10*Math.log10(Math.max(n,1e-6))}function pA(i,t){const e=uA(i),{bands:n,centroid:s}=dA(i,t);return{...e,bands:n,centroid:s,loudness:fA(n,e.rms)}}function mA(i,t){let e=0;for(let a=0;a<i.length;a++)e+=i[a];e/=Math.max(i.length,1);let n=0;for(let a=0;a<i.length;a++)n+=(i[a]-e)**2;if(n/=Math.max(i.length,1),n<1e-12)return 0;const s=a=>{if(a>=i.length)return 0;let c=0;for(let l=0;l+a<i.length;l++)c+=(i[l]-e)*(i[l+a]-e);return Math.abs(c/((i.length-a)*n))},o=t.map(s),r=o.findIndex(a=>a<.2);return r===-1?1:Math.max(0,...o.slice(r))}const co=1024,gA=6,gf=new R;function yA(i,t){const e={context:i,settings:{...$h},weather:new Lp,noise:Ip(i),dry:i.createGain(),send:i.createGain(),register:()=>{},unregister:()=>{}};return e.dry.connect(t),e.send.connect(t),e}async function vA(i,t=48e3){const e=i.seconds??gA,n=Math.ceil(e*t/co)*co,s=new OfflineAudioContext(1,n,t),o=yA(s,s.destination),r=i.build(o);r.output.connect(s.destination),i.ready&&await i.ready(r);const a=co/t,c=Math.floor(n/co);for(let h=1;h<c;h++)s.suspend(h*co/t).then(()=>{o.weather.update(a),r.update?.(a,o,gf),s.resume()});return o.weather.update(a),r.update?.(a,o,gf),{signal:(await s.startRendering()).getChannelData(0),model:r,rate:t}}const _A={peak:.95,dc:.01,periodicity:.35,crest:{_comment:["Peak over average, in dB, and it means opposite things for the two","kinds of source — which is why there are two bands rather than one.","A continuous texture with a very high crest is bubble wrap: audible","individual grains. An impulsive source with a *low* one has lost its","transient and turned into a wash. Bounds are drawn wide around the","first captured run rather than derived; the drift check below is the","sharp instrument, and these only catch a model that has fallen over."],texture:[4,26],event:[12,36]}},wA={loudness:1.5,crest:2.5,centroid:.5},xA={wind:{loudness:-46.69,crest:23.33,centroid:121,bands:[.6522,.2851,.0387,.012,.0116,5e-4,0,0]},foliage:{loudness:-41.22,crest:15.96,centroid:1230,bands:[.0262,.0512,.1118,.3525,.2948,.1401,.0225,9e-4]},rain:{loudness:-37.53,crest:14.73,centroid:1062,bands:[.0363,.1044,.1761,.253,.3241,.0975,.0082,4e-4]},water:{loudness:-38.89,crest:15.12,centroid:741,bands:[.1976,.1233,.1289,.2884,.2154,.0417,.0047,1e-4]},fire:{loudness:-32.04,crest:13.58,centroid:558,bands:[.2647,.5285,.0244,.0299,.0722,.0644,.0114,.0046]},machine:{loudness:-26.53,crest:11.53,centroid:69,bands:[.8421,.141,.0164,5e-4,0,0,0,0]},friction:{loudness:-30.89,crest:6.46,centroid:200,bands:[.3474,.5838,.0541,.0094,.0042,.0011,0,0]},waveguide:{loudness:-33.2,crest:27.71,centroid:857,bands:[3e-4,9e-4,.5233,.2708,.1788,.0165,.0049,.0044]},bird:{loudness:-29.91,crest:16.97,centroid:2340,bands:[2e-4,2e-4,2e-4,3e-4,6e-4,.9979,6e-4,0]},crowd:{loudness:-37.17,crest:17.34,centroid:566,bands:[.0078,.0791,.1582,.7432,.0115,2e-4,0,0]},hammer:{loudness:-37.04,crest:26.58,centroid:144,bands:[.1803,.8117,.0051,1e-4,.0022,5e-4,0,0]},clatter:{loudness:-50.07,crest:26.39,centroid:109,bands:[.806,.1784,.0094,.0051,9e-4,1e-4,0,0]},animal:{loudness:-36.57,crest:22.36,centroid:776,bands:[0,4e-4,.1835,.7314,.0769,.0076,1e-4,0]},drip:{loudness:-44.1,crest:30.46,centroid:600,bands:[.171,.1695,.1649,.1835,.3106,5e-4,1e-4,0]},bell:{loudness:-33.5,crest:19.34,centroid:130,bands:[.6331,.3079,.056,.0028,2e-4,0,0,0]}},MA={rules:_A,drift:wA,models:xA},ma=MA;function lo(i,t,e,n=8){return{name:i,kind:"event",seconds:n,build(s){const o=Zp(s,t);let r=0;return{output:o.output,update(a){r-=a,!(r>0)&&(r=e,o.fire(s.context.currentTime+.05,.45+Math.random()*.55))},dispose:()=>o.dispose()}}}}const bA=[{name:"wind",seconds:12,build:i=>Fp(i)},{name:"foliage",seconds:12,build:i=>zp(i)},{name:"rain",seconds:8,build:i=>Vp(i,{intensity:.6})},{name:"water",seconds:8,build:i=>Wp(i)},{name:"fire",seconds:8,build:i=>Hp(i)},{name:"machine",seconds:12,build:i=>kp(i)},{name:"friction",seconds:10,build:i=>qp(i,{motion:"steady"}),ready:i=>i.ready},{name:"waveguide",kind:"event",seconds:10,build:i=>$p(i,{excite:"chime",drive:.3}),ready:i=>i.ready},{name:"bird",kind:"event",seconds:16,build:i=>Bp(i)},{name:"crowd",seconds:10,build:i=>Yp(i)},lo("hammer",{sound:"hammer"},1.1),lo("clatter",{sound:"clatter"},1.6),lo("animal",{sound:"animal"},1.8),lo("drip",{sound:"drip"},.9),lo("bell",{sound:"bell"},3.5,12)];function SA(i,t){const e=Math.round(t*.05),n=Math.floor(i.length/e),s=new Float32Array(n);for(let o=0;o<n;o++){let r=0;for(let a=0;a<e;a++){const c=i[o*e+a];r+=c*c}s[o]=Math.sqrt(r/e)}return s}function EA(i,t,e){const n=[],{rules:s}=ma,[o,r]=s.crest[e];return i.peak>s.peak&&n.push(`peak ${i.peak.toFixed(2)} — clipping`),Math.abs(i.dc)>s.dc&&n.push(`dc ${i.dc.toFixed(4)}`),i.crest<o&&n.push(`crest ${i.crest.toFixed(1)} dB — ${e==="event"?"no transient left":"a drone"}`),i.crest>r&&n.push(`crest ${i.crest.toFixed(1)} dB — ${e==="event"?"nothing but spikes":"bubble wrap"}`),t>s.periodicity&&n.push(`periodicity ${t.toFixed(2)} — it loops`),n}function TA(i,t){const e=ma.models[i];if(!e)return[];const n=[],{drift:s}=ma;return Math.abs(t.loudness-e.loudness)>s.loudness&&n.push(`loudness ${e.loudness.toFixed(1)} → ${t.loudness.toFixed(1)}`),Math.abs(t.crest-e.crest)>s.crest&&n.push(`crest ${e.crest.toFixed(1)} → ${t.crest.toFixed(1)}`),Math.abs(Math.log2(Math.max(t.centroid,1)/Math.max(e.centroid,1)))>s.centroid&&n.push(`centroid ${e.centroid.toFixed(0)} → ${t.centroid.toFixed(0)} Hz`),n}async function AA(){const i=[],t={};for(const s of bA){const{signal:o,model:r,rate:a}=await vA(s),c=pA(o,a),l=SA(o,a),h=[];for(let d=4;d<l.length/4;d+=2)h.push(d);const u=mA(l,h),f=s.kind??"texture";i.push({name:s.name,measurements:c,periodicity:u,problems:[...EA(c,u,f),...TA(s.name,c)],novel:ma.models[s.name]===void 0}),t[s.name]={loudness:Number(c.loudness.toFixed(2)),crest:Number(c.crest.toFixed(2)),centroid:Number(c.centroid.toFixed(0)),bands:c.bands.map(d=>Number(d.toFixed(4)))},r.dispose()}const e=i.map(s=>s.measurements.loudness).filter(Number.isFinite),n=e.length>1?Math.max(...e)-Math.min(...e):0;return{rows:i,spread:n,failures:i.filter(s=>s.problems.length>0).length,captured:t}}async function RA(){console.log("audition: rendering the library…");const i=await AA();console.table(i.rows.map(n=>({model:n.name,loudness:n.measurements.loudness.toFixed(1),crest:n.measurements.crest.toFixed(1),"centroid Hz":n.measurements.centroid.toFixed(0),peak:n.measurements.peak.toFixed(3),loop:n.periodicity.toFixed(2),status:n.problems.length===0?n.novel?"new":"ok":n.problems.join("; ")}))),console.log(`audition: ${i.failures} of ${i.rows.length} flagged. Loudness spread ${i.spread.toFixed(1)} — reported, not a rule; see baselines.json.`);const t=JSON.stringify(i.captured,null,2),e=i.rows.filter(n=>n.novel).map(n=>n.name);console.log(e.length>0?`audition: no baseline yet for ${e.join(", ")}.`:"audition: current measurements, for re-capture after a deliberate change."),console.log("If this run sounded right, replace the `models` block of src/audio/baselines.json with the object below and commit it — drift is only visible against something."),console.log(t);try{await navigator.clipboard.writeText(t),console.log("audition: copied to the clipboard.")}catch{console.log("audition: could not reach the clipboard — copy the block above.")}return i}const rl=-90,Li=240,ho=92;function CA(i){const t=document.createElement("canvas"),e=Math.min(window.devicePixelRatio||1,2);t.width=Li*e,t.height=ho*e,Object.assign(t.style,{position:"fixed",right:"8px",bottom:"8px",width:`${Li}px`,height:`${ho}px`,zIndex:"20",pointerEvents:"none",display:"none",background:"rgba(8, 10, 12, 0.72)",borderRadius:"3px"}),document.body.appendChild(t);const n=t.getContext("2d"),s=i.analyser,o=new Uint8Array(s.frequencyBinCount),r=new Float32Array(s.fftSize);let a=0;return{visible:!1,update(){if(t.style.display=this.visible?"block":"none",!this.visible||!n)return;s.getByteFrequencyData(o),s.getFloatTimeDomainData(r);let l=0;for(let y=0;y<r.length;y++){const m=Math.abs(r[y]);m>l&&(l=m)}a=Math.max(l,a*.94),n.setTransform(e,0,0,e,0,0),n.clearRect(0,0,Li,ho);const h=i.context.sampleRate/2,u=ho-12,f=30;n.fillStyle="#7fb2c9";for(let y=0;y<Li;y++){const m=f*Math.pow(h/f,y/Li),p=Math.min(o.length-1,Math.round(m/h*o.length)),_=o[p]/255*u;n.fillRect(y,u-_,1,_)}n.fillStyle="rgba(255, 255, 255, 0.16)";for(let y=100;y<h;y*=10){const m=Math.log(y/f)/Math.log(h/f)*Li;n.fillRect(m,0,1,u)}const d=a>0?20*Math.log10(a):rl,g=Math.max(0,(d-rl)/-rl)*Li;n.fillStyle=d>-1?"#e05a4a":d>-6?"#e0b44a":"#6fbf73",n.fillRect(0,ho-8,g,6)},dispose(){t.remove()}}}const PA=new Set(["speed"]);function al(i,t,e){let n=null,s=null;const o={};function r(a){const c=Object.keys(a.meta.params).sort();for(const h of c)o[h]=a.get(h);const l=i.addFolder(t).close();for(const h of c){const u=a.meta.params[h];l.add(o,h,u.min,u.max,u.step).name(PA.has(h)?`${h} (driven)`:h).onChange(f=>a.set(h,f)).listen()}n=l,s=a}return{sync(){const a=e();if(a===null){n?.destroy(),n=null,s=null;return}if(a!==s){n?.destroy(),r(a);return}for(const c of Object.keys(a.meta.params))o[c]=a.get(c)},dispose(){n?.destroy(),n=null,s=null}}}const IA=.35;class LA{root;bar;label;constructor(t){const e=document.getElementById("loading"),n=e?.querySelector(".loading-bar")??null,s=e?.querySelector(".loading-label")??null;if(e&&n&&s)this.root=e,this.bar=n,this.label=s;else{this.root=document.createElement("div"),this.root.id="loading";const o=document.createElement("div");o.className="loading-track",this.bar=document.createElement("div"),this.bar.className="loading-bar",o.appendChild(this.bar),this.label=document.createElement("div"),this.label.className="loading-label",this.root.append(o,this.label),t.appendChild(this.root)}document.body.classList.add("is-loading")}async step(t,e,n){return this.label.textContent=t,this.bar.style.transform=`scaleX(${Math.min(Math.max(e,0),1)})`,await yf(),n()}async done(){this.bar.style.transform="scaleX(1)",this.label.textContent="ready",await yf(),await vf(.18),this.root.classList.add("is-gone"),document.body.classList.remove("is-loading"),await vf(IA),this.root.remove()}fail(t){this.label.textContent=t,this.bar.style.transform="scaleX(1)",this.root.classList.add("is-failed")}}function yf(){return new Promise(i=>{requestAnimationFrame(()=>requestAnimationFrame(()=>i()))})}function vf(i){return new Promise(t=>window.setTimeout(t,i*1e3))}const DA="OpenDyslexic",NA="./fonts/OpenDyslexic-Regular.otf",cl="is-dyslexic";let Oi="idle",_f=!1;const yu=new Set;function UA(i){if(_f=i,!i){document.body.classList.remove(cl),Hr();return}if(Oi==="ready"){document.body.classList.add(cl),Hr();return}Oi==="loading"||Oi==="failed"||(Oi="loading",Hr(),FA().then(t=>{Oi=t?"ready":"failed",t&&_f&&document.body.classList.add(cl),Hr()}))}async function FA(){try{const i=new FontFace(DA,`url(${NA})`);return await i.load(),document.fonts.add(i),!0}catch{return!1}}function OA(i){return Oi==="failed"?"typeface unavailable":i.dyslexicFont&&Oi==="loading"?"fetching the typeface…":null}function zA(i){yu.add(i)}function kA(i){yu.delete(i)}function Hr(){for(const i of yu)i()}const vu="options",Kr={masterVolume:100,ambientVolume:100,footstepVolume:100,creatureVolume:100,npcVolume:100,fov:qn.fov,fovScaling:qn.fovScaling,dither:!0,pixelation:!0,grassShadows:!1,shadows:!0,fpsCap:"uncapped",performance:"off",sensitivity:5,invertY:qn.invertY,invertX:qn.invertX,sprintMode:"hold",crouchMode:"hold",reducedMotion:!1,windSway:!0,headBob:!0,sprintZoom:!0,colorblind:"off",colorblindStrength:100,dyslexicFont:!1,fontSize:0};function Fm(i){const t=!i.reducedMotion;return{...i,grassShadows:i.grassShadows&&i.shadows,windSway:i.windSway&&t,headBob:i.headBob&&t,sprintZoom:i.sprintZoom&&t}}const Om=i=>`${Math.round(i)}%`,wf=[{value:"hold",label:"hold"},{value:"toggle",label:"toggle"}],ll=i=>!i.reducedMotion,uo=(i,t)=>({kind:"slider",key:i,label:t,min:0,max:100,step:1,format:Om}),Gr=()=>"not connected yet",zm=[{id:"video",label:"Video",controls:[{kind:"slider",key:"fov",label:"field of view",min:60,max:120,step:1,format:i=>`${Math.round(i)}°`},{kind:"choice",key:"fovScaling",label:"field of view scaling",choices:[{value:"vertical",label:"vertical"},{value:"horizontal",label:"horizontal"}],note:i=>i.fovScaling==="horizontal"?"fixed side to side; a wider window loses height":"fixed top to bottom; a wider window shows more"},{kind:"toggle",key:"dither",label:"dither"},{kind:"toggle",key:"pixelation",label:"pixelation"},{kind:"toggle",key:"shadows",label:"shadows"},{kind:"toggle",key:"grassShadows",label:"grass shadows",enabledWhen:i=>i.shadows,note:i=>i.shadows?null:"needs shadows"},{kind:"choice",key:"fpsCap",label:"frame rate cap",choices:[{value:"uncapped",label:"uncapped"},{value:"30",label:"30 fps"},{value:"60",label:"60 fps"},{value:"120",label:"120 fps"},{value:"144",label:"144 fps"},{value:"240",label:"240 fps"}]},{kind:"choice",key:"performance",label:"performance monitor",choices:[{value:"off",label:"off"},{value:"fps",label:"frame rate"},{value:"all",label:"everything"}]}]},{id:"audio",label:"Audio",controls:[uo("masterVolume","master"),{...uo("ambientVolume","ambience"),note:Gr},{...uo("footstepVolume","footsteps"),note:Gr},{...uo("creatureVolume","creatures"),note:Gr},{...uo("npcVolume","voices"),note:Gr}]},{id:"controls",label:"Controls",controls:[{kind:"slider",key:"sensitivity",label:"mouse sensitivity",min:0,max:10,step:.1,format:i=>i.toFixed(1)},{kind:"toggle",key:"invertY",label:"invert vertical"},{kind:"toggle",key:"invertX",label:"invert horizontal"},{kind:"choice",key:"sprintMode",label:"sprint",choices:wf},{kind:"choice",key:"crouchMode",label:"crouch",choices:wf}]},{id:"accessibility",label:"Accessibility",controls:[{kind:"toggle",key:"reducedMotion",label:"reduced motion"},{kind:"toggle",key:"windSway",label:"wind sway",enabledWhen:ll,note:i=>i.reducedMotion?"held by reduced motion":null},{kind:"toggle",key:"headBob",label:"head bob",enabledWhen:ll,note:i=>i.reducedMotion?"held by reduced motion":null},{kind:"toggle",key:"sprintZoom",label:"sprint zoom",enabledWhen:ll,note:i=>i.reducedMotion?"held by reduced motion":null},{kind:"choice",key:"colorblind",label:"colourblind mode",choices:[{value:"off",label:"off"},{value:"protanopia",label:"protanopia (red blindness)"},{value:"deuteranopia",label:"deuteranopia (green blindness)"},{value:"tritanopia",label:"tritanopia (blue blindness)"}]},{kind:"slider",key:"colorblindStrength",label:"correction strength",min:0,max:100,step:1,format:Om,shownWhen:i=>i.colorblind!=="off"},{kind:"toggle",key:"dyslexicFont",label:"dyslexia-friendly text",note:OA},{kind:"slider",key:"fontSize",label:"text size",min:-5,max:5,step:1,format:i=>i===0?"default":`${i>0?"+":""}${i}px`}]}];function BA(){const i=_p(vu)??{},t={...Kr};for(const e of zm)for(const n of e.controls){const s=i[n.key];if(n.kind==="slider"){if(typeof s!="number"||!Number.isFinite(s))continue;t[n.key]=Math.min(Math.max(s,n.min),n.max)}else if(n.kind==="toggle"){if(typeof s!="boolean")continue;t[n.key]=s}else n.choices.some(o=>o.value===s)&&HA(t,n.key,s)}return t}function HA(i,t,e){i[t]=e}function GA(i){wp(vu,i)}function VA(){xp(vu)}const WA="video";class XA{options;onChange;onResume;root;opener;rows=[];tabs=[];current=WA;shown=!1;constructor(t,e,n){this.options=e,this.onChange=n.onChange,this.onResume=n.onResume,this.opener=document.createElement("button"),this.opener.id="options-open",this.opener.type="button",this.opener.textContent="options",this.opener.addEventListener("click",()=>this.show()),this.root=document.createElement("div"),this.root.id="options",this.root.hidden=!0;const s=document.createElement("div");s.className="options-scrim",s.addEventListener("click",()=>this.hide());const o=document.createElement("div");o.className="options-panel",o.setAttribute("role","dialog"),o.setAttribute("aria-modal","true"),o.setAttribute("aria-label","Options");const r=document.createElement("div");r.className="options-title",r.textContent="options";const a=document.createElement("div");a.className="options-tabs",a.setAttribute("role","tablist");const c=document.createElement("div");c.className="options-pages";for(const f of zm){const{tab:d,page:g}=this.buildCategory(f);a.appendChild(d),c.appendChild(g)}const l=document.createElement("div");l.className="options-foot";const h=document.createElement("button");h.type="button",h.className="options-button",h.textContent="defaults",h.addEventListener("click",()=>this.reset());const u=document.createElement("button");u.type="button",u.className="options-button is-primary",u.textContent="resume",u.addEventListener("click",()=>{this.hide(),this.onResume()}),l.append(h,u),o.append(r,a,c,l),this.root.append(s,o),t.append(this.opener,this.root),window.addEventListener("keydown",this.handleKeyDown),zA(this.handleFontChange),this.sync()}buildCategory(t){const e=document.createElement("button");e.type="button",e.className="options-tab",e.textContent=t.label,e.setAttribute("role","tab"),e.addEventListener("click",()=>{this.current=t.id,this.syncTabs()});const n=document.createElement("div");n.className="options-page",n.setAttribute("role","tabpanel");for(const s of t.controls)n.appendChild(this.buildControl(s));return this.tabs.push({id:t.id,tab:e,page:n}),{tab:e,page:n}}buildControl(t){const e=document.createElement("div");e.className="options-row",e.appendChild(this.buildRevert(t));const n=document.createElement("span");n.className="options-row-label",n.textContent=t.label,e.appendChild(n);let s;t.kind==="slider"?s=this.buildSlider(e,t):t.kind==="toggle"?s=this.buildToggle(e,t):s=this.buildChoice(e,t);const o=document.createElement("span");return o.className="options-row-note",e.appendChild(o),this.rows.push({sync:()=>{e.hidden=!(t.shownWhen?.(this.options)??!0),e.classList.toggle("is-changed",this.options[t.key]!==Kr[t.key]);const r=t.enabledWhen?.(this.options)??!0;e.classList.toggle("is-disabled",!r);const a=t.note?.(this.options)??null;o.textContent=a??"",o.hidden=a===null,s(Fm(this.options))}}),e}buildRevert(t){const e=document.createElement("button");e.type="button",e.className="options-revert",e.setAttribute("aria-label",`Reset ${t.label} to default`);const n=document.createElement("span");n.className="options-revert-mark",n.textContent="*";const s=document.createElement("span");s.className="options-revert-icon",s.textContent="↺";const o=document.createElement("span");return o.className="options-revert-tip",o.textContent="Reset To Default",o.setAttribute("aria-hidden","true"),e.append(n,s,o),e.addEventListener("click",()=>this.set(t.key,Kr[t.key])),e}buildSlider(t,e){const n=document.createElement("input");n.type="range",n.className="options-slider",n.min=String(e.min),n.max=String(e.max),n.step=String(e.step);const s=document.createElement("span");return s.className="options-row-value",n.addEventListener("input",()=>this.set(e.key,Number(n.value))),t.append(s,n),o=>{const r=o[e.key];n.value=String(r),n.disabled=!(e.enabledWhen?.(this.options)??!0);const a=Math.max(e.max-e.min,1e-6);n.style.setProperty("--fill",`${(r-e.min)/a*100}%`),s.textContent=e.format?e.format(r):String(r)}}buildToggle(t,e){const n=document.createElement("button");n.type="button",n.className="options-switch",n.setAttribute("role","switch");const s=document.createElement("span");s.className="options-switch-knob";const o=document.createElement("span");return o.className="options-switch-word",n.append(s,o),n.addEventListener("click",()=>this.set(e.key,!this.options[e.key])),t.appendChild(n),r=>{const a=r[e.key];o.textContent=a?"on":"off",n.setAttribute("aria-checked",a?"true":"false"),n.classList.toggle("is-on",a),n.disabled=!(e.enabledWhen?.(this.options)??!0)}}buildChoice(t,e){const n=document.createElement("select");n.className="options-select";for(const s of e.choices){const o=document.createElement("option");o.value=s.value,o.textContent=s.label,n.appendChild(o)}return n.addEventListener("change",()=>this.set(e.key,n.value)),t.appendChild(n),s=>{n.value=s[e.key],n.disabled=!(e.enabledWhen?.(this.options)??!0)}}set(t,e){this.options[t]=e,this.sync(),this.onChange(this.options)}reset(){Object.assign(this.options,Kr),VA(),this.sync(),this.onChange(this.options)}sync(){for(const t of this.rows)t.sync();this.syncTabs()}syncTabs(){for(const t of this.tabs){const e=t.id===this.current;t.tab.classList.toggle("is-active",e),t.tab.setAttribute("aria-selected",e?"true":"false"),t.page.hidden=!e}}show(){this.shown||(this.shown=!0,this.root.hidden=!1,document.body.classList.add("is-options"),this.sync())}hide(){this.shown&&(this.shown=!1,this.root.hidden=!0,document.body.classList.remove("is-options"))}handleKeyDown=t=>{t.key!=="Escape"||!this.shown||this.hide()};handleFontChange=()=>this.sync();dispose(){window.removeEventListener("keydown",this.handleKeyDown),kA(this.handleFontChange),this.root.remove(),this.opener.remove()}}const YA=.1,qA=5,$A=18;function xf(i,t){const{audio:e,postfx:n,zones:s,player:o,input:r,loop:a,performance:c}=t,l=o.tuning,h=Fm(i);e.settings.masterVolume=$h.masterVolume*(h.masterVolume/100),o.setFieldOfView(h.fov,h.sprintZoom?qn.sprintFovBoost:0,h.fovScaling),n.setDither(h.dither),n.setPixelation(h.pixelation),n.setColorblind(h.colorblind,h.colorblindStrength/100),s.setShadows(h.shadows),s.setClutterShadows(h.grassShadows);const u=Number.parseInt(h.fpsCap,10);a.setFpsCap(Number.isFinite(u)?u:null),c.setMode(h.performance),l.lookSensitivity=qn.lookSensitivity*Math.max(h.sensitivity,YA)/qA,l.invertY=h.invertY,l.invertX=h.invertX,r.setSprintMode(h.sprintMode),r.setCrouchMode(h.crouchMode),zi.swayAmount.value=h.windSway?1:0,l.bobScale=h.headBob?1:0,UA(h.dyslexicFont),document.documentElement.style.fontSize=`${$A+h.fontSize}px`}function ZA(i,t,e){const n=()=>{xf(i,e),GA(i)},s=new XA(t,i,{onChange:n,onResume:()=>e.input.capture()});return xf(i,e),{options:i,commit:()=>{n(),s.sync()},open:()=>s.show(),dispose:()=>s.dispose()}}const fo=180,KA=20,Mf=.1;class jA{renderer;root;rows=new Map;samples=new Float32Array(fo);count=0;cursor=0;sinceRefresh=0;mode="off";constructor(t,e){this.renderer=e,this.root=document.createElement("div"),this.root.id="perf",this.root.hidden=!0,t.appendChild(this.root)}setMode(t){t!==this.mode&&(this.mode=t,this.root.hidden=t==="off",this.root.classList.toggle("is-full",t==="all"),this.root.textContent="",this.rows.clear(),t!=="off"&&(this.addRow("fps"),t==="all"&&(this.addRow("1% low"),this.addRow("frame"),this.addRow("draws"),this.addRow("tris"),this.addRow("buffers"),this.addRow("memory"),this.addRow("size")),this.sinceRefresh=Mf))}update(t){this.samples[this.cursor]=t*1e3,this.cursor=(this.cursor+1)%fo,this.count=Math.min(this.count+1,fo),this.mode!=="off"&&(this.sinceRefresh+=t,!(this.sinceRefresh<Mf)&&(this.sinceRefresh=0,this.draw()))}draw(){const t=this.recentMean(KA);if(this.set("fps",t>0?Math.round(1e3/t).toString():"—"),this.mode!=="all")return;const e=this.onePercentLow();this.set("1% low",e>0?Math.round(1e3/e).toString():"—"),this.set("frame",`${t.toFixed(1)} ms`);const n=this.renderer.info;this.set("draws",n.render.calls.toString()),this.set("tris",n.render.triangles.toLocaleString()),this.set("buffers",`${n.memory.geometries} geo`);const s=performance.memory;this.set("memory",s?`${(s.usedJSHeapSize/1048576).toFixed(0)} MB`:"—");const o=this.renderer.getDrawingBufferSize(JA);this.set("size",`${o.x}×${o.y}`)}recentMean(t){const e=Math.min(t,this.count);if(e===0)return 0;let n=0;for(let s=1;s<=e;s++)n+=this.samples[(this.cursor-s+fo)%fo];return n/e}onePercentLow(){if(this.count===0)return 0;const t=Array.from(this.samples.subarray(0,this.count)).sort((s,o)=>o-s),e=Math.max(1,Math.round(this.count/100));let n=0;for(let s=0;s<e;s++)n+=t[s];return n/e}addRow(t){const e=document.createElement("div");e.className="perf-row";const n=document.createElement("span");n.className="perf-label",n.textContent=t;const s=document.createElement("span");s.className="perf-value",s.textContent="—",e.append(n,s),this.root.appendChild(e),this.rows.set(t,s)}set(t,e){const n=this.rows.get(t);n&&(n.textContent=e)}dispose(){this.root.remove()}}const JA=new tt,_u=document.getElementById("viewport");if(!(_u instanceof HTMLCanvasElement))throw new Error("#viewport canvas is missing from index.html");const Fs=document.getElementById("overlay");if(!(Fs instanceof HTMLElement))throw new Error("#overlay is missing from index.html");const ti=new Hx(_u),Es=new Vx,Se=TM();ti.scene.fog=new Ma(657935,20,90);o2();const yn=new d2(ti),QA=new $b(ti.renderer);ti.onResize=()=>yn.resize();const ga=new ia,Po=new w2(_u),Xe=new I2(ti.camera,Po,ga),Gs=new LA(document.body),go=await Gs.step("shaping the ground",.12,()=>new V2),Zt=new Hb({scene:ti.scene,collider:ga,player:Xe,postfx:yn,interaction:new Tb,reticle:new Vb(Fs),fade:new Wb(Fs)}),Io=BA(),km=cA(go);for(const i of km.zones)Zt.register(i);for(const i of km.portals)Zt.link(i);Zt.setShadows(Io.shadows);Zt.setClutterShadows(Io.grassShadows);yn.aimSun(Zt.sunDirection);await Gs.step("settling the world",.6,()=>Zt.enter(Fi));await Gs.step("raising arkstin",.78,()=>Zt.prebuild(du));const _e=new fM;let cn=null;const t5=new Map([["canopy",.22],["foliage",.4],["shrub-a",.34],["shrub-b",.34],["wood-north",.2],["wood-east",.22],["hedge",.34]]);await Gs.step("rendering the rooms",.86,()=>_e.ready);await Gs.step("tuning the air",.96,()=>{cn=new Z2(_e,.55),Xe.onFootstep=i=>{if(!cn)return;const t=Xe.position;cn.surface=Zt.surfaceAt(t.x,t.z),cn.step(i)},Xe.onLand=i=>{if(!cn)return;const t=Xe.position;cn.surface=Zt.surfaceAt(t.x,t.z),cn.land(i)},Xe.onJump=()=>{if(!cn)return;const i=Xe.position;cn.surface=Zt.surfaceAt(i.x,i.z),cn.jump()},Zt.attachAudio({engine:_e,footsteps:cn})});bp()?(new D2(Po,Fs),document.body.classList.add("is-touch","is-playing")):Po.onLockChange=i=>document.body.classList.toggle("is-playing",i);const Bm=new jA(Fs,ti.renderer),hl=ZA(Io,Fs,{audio:_e,postfx:yn,zones:Zt,player:Xe,input:Po,loop:Es,performance:Bm});if(Se.gui){const i=yn.settings,t=()=>yn.apply(),e=Se.gui.addFolder("look");e.add(Io,"shadows").name("cast shadows").listen().onChange(hl.commit),e.add(Io,"grassShadows").name("grass casts shadows").listen().onChange(hl.commit),e.add({open:hl.open},"open").name("open the player's menu"),e.add(i,"pixelSize",1,12,1).onChange(t),e.add(i,"normalEdgeStrength",0,2,.05).onChange(t),e.add(i,"depthEdgeStrength",0,2,.05).onChange(t),e.add(i,"quantize",["off","levels"]).onChange(t),e.add(i,"levels",2,16,1).onChange(t),e.add(i,"ditherScale",0,2,.05).name("dither (steps)").onChange(t),e.add(i,"screenPeriod",2,32,1).name("screen period").onChange(t);const n=Se.gui.addFolder("vignette").close();n.add(i,"vignetteStrength",0,1,.01).onChange(t),n.add(i,"vignetteRadius",0,1.5,.01).onChange(t),n.add(i,"vignetteSoftness",.01,1.5,.01).onChange(t);const s=Se.gui.addFolder("sky");s.addColor(i.sky,"zenith").onChange(t),s.addColor(i.sky,"horizon").onChange(t),s.addColor(i.sky,"ground").name("below horizon").onChange(t),s.add(i.sky,"curve",.1,3,.05).onChange(t);const o=Se.gui.addFolder("clouds");o.addColor(i.sky,"cloudColor").name("colour").onChange(t),o.add(i.sky,"cloudCover",.1,.9,.01).name("cover").onChange(t),o.add(i.sky,"cloudSoftness",.01,.6,.01).name("softness").onChange(t),o.add(i.sky,"cloudScale",.2,4,.05).name("scale").onChange(t),o.add(i.sky,"cloudOpacity",0,1,.01).name("opacity").onChange(t),o.add(i.sky,"cloudDrift",0,.1,.001).name("drift").onChange(t);const r=Se.gui.addFolder("light").close();r.add(Zt.lights.sun,"intensity",0,5,.1).name("sun"),r.add(Zt.lights.ambient,"intensity",0,5,.1).name("ambient");const a=Se.gui.addFolder("fog").close();a.add(i,"linkFogToSky").name("match horizon").onChange(t),a.addColor(i,"fogColor").onChange(t),a.add(i,"fogNear",0,200,1).onChange(t),a.add(i,"fogFar",0,400,1).onChange(t);const c=Se.gui.addFolder("surfaces").close();for(const x of Object.keys(go.colors))c.addColor(go.colors,x).onChange(()=>go.applyColors());c.add({reset:()=>{go.resetColors(),Se.gui?.controllersRecursive().forEach(x=>x.updateDisplay())}},"reset");const l=Se.gui.addFolder("preset");l.add({save:()=>{const x=yn.save();l.title(x?"preset · saved":"preset · SAVE FAILED")}},"save"),l.add({reset:()=>{yn.reset(),Se.gui?.controllersRecursive().forEach(x=>x.updateDisplay())}},"reset"),l.add({copy:()=>{navigator.clipboard?.writeText(JSON.stringify(yn.settings,null,2))}},"copy").name("copy JSON");const h=Xe.tuning,u=Se.gui.addFolder("movement");u.add(h,"walkSpeed",1,12,.1),u.add(h,"sprintScale",1,3,.05),u.add(h,"groundAccel",1,60,.5),u.add(h,"airAccel",0,20,.1),u.add(h,"friction",0,30,.5),u.add(h,"gravity",5,60,.5),u.add(h,"jumpSpeed",2,14,.1),u.add(h,"autoHop");const f=Se.gui.addFolder("contact").close();f.add(h,"slopeLimitDeg",5,85,1),f.add(h,"stepHeight",0,1,.01),f.add(h,"coyoteTime",0,.5,.01),f.add(h,"jumpBuffer",0,.5,.01);const d=Se.gui.addFolder("view");d.add(h,"lookSensitivity",2e-4,.008,1e-4),d.add(h,"invertY"),d.add(h,"eyeHeight",1,2,.01),d.add(h,"fov",50,110,1),d.add(h,"sprintFovBoost",0,30,1).name("sprint fov +");const g=Se.gui.addFolder("head bob").close();g.add(h,"bobAmount",0,.15,.001),g.add(h,"bobSway",0,.15,.001),g.add(h,"bobRoll",0,.05,5e-4),g.add(h,"bobStepsPerSecond",.5,5,.05),g.add(h,"bobSpeedInfluence",0,1,.05),g.add(h,"landDip",0,.1,.001);const y=Se.gui.addFolder("audio");y.add(_e.settings,"masterVolume",0,1,.01).name("volume"),y.add(_e.settings,"reverbAmount",0,2,.01).name("reverb").onChange(()=>_e.applyReverbAmount()),y.add(_e.settings,"airAbsorption",0,1,.01).name("air absorption"),y.add(_e.settings,"occlusion",0,1,.01).name("occlusion");const m=Se.gui.addFolder("weather");m.add(_e.weather.settings,"windSpeed",0,1,.01).name("wind"),m.add(_e.weather.settings,"gustDepth",0,1,.01).name("gust depth"),m.add(_e.weather.settings,"gustRate",.01,.6,.01).name("gust rate"),m.add(_e.weather.settings,"windDirection",0,Math.PI*2,.01).name("wind direction"),m.add(_e.weather.settings,"frontSpeed",1,60,.5).name("front speed (m/s)"),m.add(zi.swayAmount,"value",0,2,.01).name("sway");const p={windTone:3400,leaves:1,machineRpm:52,fireIntensity:.85,rain:0,water:1,strike:()=>Zt.sound?.findField("smith")?.trigger(),drop:()=>Zt.sound?.findField("yards")?.trigger(),toll:()=>Zt.sound?.findField("bell")?.trigger()};m.add(p,"windTone",700,9e3,50).name("wind tone (Hz)").onChange(x=>{Zt.sound?.find("wind")?.setTone(x)}),m.add(p,"leaves",0,2,.01).name("leaf articulation").onChange(x=>{for(const[M,A]of t5)Zt.sound?.find(M)?.setArticulation(A*x)}),m.add(p,"machineRpm",0,200,1).name("mill rpm").onChange(x=>{Zt.sound?.find("mill")?.setRpm(x)}),m.add(p,"fireIntensity",0,1,.01).name("forge intensity").onChange(x=>{Zt.sound?.find("forge")?.setIntensity(x)}),m.add(p,"rain",0,1,.01).name("rain").onChange(x=>{Zt.sound?.find("rain")?.setIntensity(x)}),m.add(p,"water",0,1,.01).name("water flow").onChange(x=>{Zt.sound?.find("cistern")?.setRate(x)}),m.add(p,"strike").name("hammer now"),m.add(p,"drop").name("clatter now"),m.add(p,"toll").name("bell now");const _={speed:"0.00",grounded:"no",position:"",triangles:ga.triangles,draws:0,drawn:"0",heap:"—",resident:"—",zone:"—",crossings:0,room:"—",audio:"waiting for a click",gust:"0.00",swell:"0.00",machine:"—",emitters:"—"},v=Se.gui.addFolder("state");v.add(_,"speed").listen().disable(),v.add(_,"grounded").listen().disable(),v.add(_,"position").listen().disable(),v.add(_,"zone").listen().disable(),v.add(_,"crossings").listen().disable(),v.add(_,"room").listen().disable(),v.add(_,"audio").listen().disable(),v.add(_,"gust").listen().disable(),v.add(_,"swell").listen().disable(),v.add(_,"machine").listen().disable(),v.add(_,"emitters").name("hrtf / panned / virtual").listen().disable(),v.add(_,"draws").name("draw calls").listen().disable(),v.add(_,"drawn").name("drawn tris").listen().disable(),v.add(_,"heap").listen().disable(),v.add(_,"resident").name("zones built / evicted").listen().disable(),v.add(_,"triangles").name("collider tris").listen().disable(),v.add({respawn:()=>Zt.respawn()},"respawn");const w=Se.gui.addFolder("zones");for(const x of Zt.zones.values())w.add({go:()=>void Zt.enter(x.id)},"go").name(x.name);const b=CA(_e);Es.add(()=>b.update());const S=Se.gui.addFolder("sound stage").close(),E={solo:"all",reverb:"—",audition:()=>{RA()}};S.add(E,"solo",["all",...OT]).name("solo").onChange(x=>{Zt.sound?.setSolo(x==="all"?null:x)}),S.add(E,"reverb").listen().disable(),S.add(E,"audition").name("audition the library"),S.add(b,"visible").name("spectrum");const T=[al(S,"reverb",()=>_e.reverbControls),...["gantry","gate","limb","friction"].map(x=>al(S,x,()=>Zt.sound?.find(x)?.loop??null)),...["pipe-air","waveguide"].map(x=>al(S,x,()=>Zt.sound?.find(x)?.loop??null))];Es.add(()=>{for(const x of T)x.sync()}),Es.add(()=>{_.speed=Xe.speed.toFixed(2),_.grounded=Xe.isGrounded?"yes":"no";const x=Xe.position;_.position=`${x.x.toFixed(1)}, ${x.y.toFixed(1)}, ${x.z.toFixed(1)}`,_.zone=Zt.current?.name??"—",_.crossings=Zt.crossings,_.triangles=ga.triangles;const M=ti.renderer.info.render;_.draws=M.calls,_.drawn=M.triangles.toLocaleString();const A=performance.memory;_.heap=A?`${(A.usedJSHeapSize/1048576).toFixed(0)} MB`:"unavailable",_.resident=`${Zt.builtZones.length} / ${Zt.evictions}`,_.room=_e.room??"open",E.reverb=_e.reverbKind==="fdn"?"fdn — tunable":"convolution — fixed",_.audio=cn===null?"rendering…":_e.context.state,_.gust=_e.weather.strength.toFixed(2),_.swell=_e.weather.swell.toFixed(2),_.machine=Zt.sound?.find("mill")?.phase??"—";const P=_e.voiceCounts;_.emitters=Zt.sound===null?"—":`${P.hrtf} / ${P.panned} / ${P.virtual} · ${Zt.sound.occludedCount} occl`})}Es.add((i,t)=>{Xe.update(i);const e=Zt.current;e&&Xe.position.y<e.floor&&Zt.respawn();const n=Zt.update();Po.takeInteract()&&n&&Zt.use(n);const o=_e.update(i,ti.camera);Zt.updateSound(i,o),a2(_e.weather,t),yn.render(t),QA.update(),Bm.update(i),Se.update()});Xe.update(0);yn.render(0);await Gs.done();Es.start();
