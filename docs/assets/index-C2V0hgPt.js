(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const yl="170",kd=0,ac=1,Hd=2,vu=1,Gd=2,An=3,Zn=0,Fe=1,dn=2,In=0,qi=1,lc=2,cc=3,hc=4,Vd=5,ci=100,Wd=101,Xd=102,qd=103,Yd=104,$d=200,Kd=201,Zd=202,jd=203,wa=204,Ea=205,Jd=206,Qd=207,tf=208,ef=209,nf=210,sf=211,rf=212,of=213,af=214,Ta=0,Aa=1,Ra=2,Ki=3,Ca=4,Pa=5,La=6,Da=7,Ml=0,lf=1,cf=2,Yn=0,xu=1,yu=2,Mu=3,Su=4,hf=5,bu=6,wu=7,Eu=300,Zi=301,ji=302,Ia=303,Ua=304,to=306,Is=1e3,ui=1001,Na=1002,be=1003,uf=1004,$s=1005,fn=1006,mo=1007,di=1008,Nn=1009,Tu=1010,Au=1011,Us=1012,Sl=1013,pi=1014,Pn=1015,jn=1016,bl=1017,wl=1018,Ji=1020,Ru=35902,Cu=1021,Pu=1022,on=1023,Lu=1024,Du=1025,Yi=1026,Qi=1027,El=1028,Tl=1029,Iu=1030,Al=1031,Rl=1033,zr=33776,kr=33777,Hr=33778,Gr=33779,Oa=35840,Fa=35841,Ba=35842,za=35843,ka=36196,Ha=37492,Ga=37496,Va=37808,Wa=37809,Xa=37810,qa=37811,Ya=37812,$a=37813,Ka=37814,Za=37815,ja=37816,Ja=37817,Qa=37818,tl=37819,el=37820,nl=37821,Vr=36492,il=36494,sl=36495,Uu=36283,rl=36284,ol=36285,al=36286,df=3200,ff=3201,Cl=0,pf=1,qn="",qe="srgb",es="srgb-linear",eo="linear",ne="srgb",bi=7680,uc=519,mf=512,gf=513,_f=514,Nu=515,vf=516,xf=517,yf=518,Mf=519,dc=35044,fc="300 es",Ln=2e3,Xr=2001;class ns{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const De=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let pc=1234567;const ws=Math.PI/180,Ns=180/Math.PI;function xi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(De[i&255]+De[i>>8&255]+De[i>>16&255]+De[i>>24&255]+"-"+De[t&255]+De[t>>8&255]+"-"+De[t>>16&15|64]+De[t>>24&255]+"-"+De[e&63|128]+De[e>>8&255]+"-"+De[e>>16&255]+De[e>>24&255]+De[n&255]+De[n>>8&255]+De[n>>16&255]+De[n>>24&255]).toLowerCase()}function Se(i,t,e){return Math.max(t,Math.min(e,i))}function Pl(i,t){return(i%t+t)%t}function Sf(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function bf(i,t,e){return i!==t?(e-i)/(t-i):0}function Es(i,t,e){return(1-e)*i+e*t}function wf(i,t,e,n){return Es(i,t,1-Math.exp(-e*n))}function Ef(i,t=1){return t-Math.abs(Pl(i,t*2)-t)}function Tf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Af(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Rf(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Cf(i,t){return i+Math.random()*(t-i)}function Pf(i){return i*(.5-Math.random())}function Lf(i){i!==void 0&&(pc=i);let t=pc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Df(i){return i*ws}function If(i){return i*Ns}function Uf(i){return(i&i-1)===0&&i!==0}function Nf(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Of(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Ff(i,t,e,n,s){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),d=o((t-n)/2),p=r((n-t)/2),g=o((n-t)/2);switch(s){case"XYX":i.set(a*h,l*u,l*d,a*c);break;case"YZY":i.set(l*d,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*d,a*h,a*c);break;case"XZX":i.set(a*h,l*g,l*p,a*c);break;case"YXY":i.set(l*p,a*h,l*g,a*c);break;case"ZYZ":i.set(l*g,l*p,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Hi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ue(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Bf={DEG2RAD:ws,RAD2DEG:Ns,generateUUID:xi,clamp:Se,euclideanModulo:Pl,mapLinear:Sf,inverseLerp:bf,lerp:Es,damp:wf,pingpong:Ef,smoothstep:Tf,smootherstep:Af,randInt:Rf,randFloat:Cf,randFloatSpread:Pf,seededRandom:Lf,degToRad:Df,radToDeg:If,isPowerOfTwo:Uf,ceilPowerOfTwo:Nf,floorPowerOfTwo:Of,setQuaternionFromProperEuler:Ff,normalize:Ue,denormalize:Hi};class et{constructor(t=0,e=0){et.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Se(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Gt{constructor(t,e,n,s,r,o,a,l,c){Gt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],p=n[5],g=n[8],x=s[0],m=s[3],f=s[6],_=s[1],v=s[4],y=s[7],w=s[2],E=s[5],A=s[8];return r[0]=o*x+a*_+l*w,r[3]=o*m+a*v+l*E,r[6]=o*f+a*y+l*A,r[1]=c*x+h*_+u*w,r[4]=c*m+h*v+u*E,r[7]=c*f+h*y+u*A,r[2]=d*x+p*_+g*w,r[5]=d*m+p*v+g*E,r[8]=d*f+p*y+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,d=a*l-h*r,p=c*r-o*l,g=e*u+n*d+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return t[0]=u*x,t[1]=(s*c-h*n)*x,t[2]=(a*n-s*o)*x,t[3]=d*x,t[4]=(h*e-s*l)*x,t[5]=(s*r-a*e)*x,t[6]=p*x,t[7]=(n*l-c*e)*x,t[8]=(o*e-n*r)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(go.makeScale(t,e)),this}rotate(t){return this.premultiply(go.makeRotation(-t)),this}translate(t,e){return this.premultiply(go.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const go=new Gt;function Ou(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function qr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function zf(){const i=qr("canvas");return i.style.display="block",i}const mc={};function ys(i){i in mc||(mc[i]=!0,console.warn(i))}function kf(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function Hf(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Gf(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Yt={enabled:!0,workingColorSpace:es,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ne&&(i.r=Un(i.r),i.g=Un(i.g),i.b=Un(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ne&&(i.r=$i(i.r),i.g=$i(i.g),i.b=$i(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===qn?eo:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Un(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function $i(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const gc=[.64,.33,.3,.6,.15,.06],_c=[.2126,.7152,.0722],vc=[.3127,.329],xc=new Gt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),yc=new Gt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Yt.define({[es]:{primaries:gc,whitePoint:vc,transfer:eo,toXYZ:xc,fromXYZ:yc,luminanceCoefficients:_c,workingColorSpaceConfig:{unpackColorSpace:qe},outputColorSpaceConfig:{drawingBufferColorSpace:qe}},[qe]:{primaries:gc,whitePoint:vc,transfer:ne,toXYZ:xc,fromXYZ:yc,luminanceCoefficients:_c,outputColorSpaceConfig:{drawingBufferColorSpace:qe}}});let wi;class Vf{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{wi===void 0&&(wi=qr("canvas")),wi.width=t.width,wi.height=t.height;const n=wi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=wi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=qr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Un(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Un(e[n]/255)*255):e[n]=Un(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Wf=0;class Fu{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Wf++}),this.uuid=xi(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(_o(s[o].image)):r.push(_o(s[o]))}else r=_o(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function _o(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Vf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Xf=0;class Be extends ns{constructor(t=Be.DEFAULT_IMAGE,e=Be.DEFAULT_MAPPING,n=ui,s=ui,r=fn,o=di,a=on,l=Nn,c=Be.DEFAULT_ANISOTROPY,h=qn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Xf++}),this.uuid=xi(),this.name="",this.source=new Fu(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new et(0,0),this.repeat=new et(1,1),this.center=new et(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Gt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Eu)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Is:t.x=t.x-Math.floor(t.x);break;case ui:t.x=t.x<0?0:1;break;case Na:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Is:t.y=t.y-Math.floor(t.y);break;case ui:t.y=t.y<0?0:1;break;case Na:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Be.DEFAULT_IMAGE=null;Be.DEFAULT_MAPPING=Eu;Be.DEFAULT_ANISOTROPY=1;class pe{constructor(t=0,e=0,n=0,s=1){pe.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],p=l[5],g=l[9],x=l[2],m=l[6],f=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const v=(c+1)/2,y=(p+1)/2,w=(f+1)/2,E=(h+d)/4,A=(u+x)/4,L=(g+m)/4;return v>y&&v>w?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=E/n,r=A/n):y>w?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=E/s,r=L/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=A/r,s=L/r),this.set(n,s,r,e),this}let _=Math.sqrt((m-g)*(m-g)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(_)<.001&&(_=1),this.x=(m-g)/_,this.y=(u-x)/_,this.z=(d-h)/_,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class qf extends ns{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new pe(0,0,t,e),this.scissorTest=!1,this.viewport=new pe(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:fn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Be(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Fu(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class gn extends qf{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Bu extends Be{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=be,this.minFilter=be,this.wrapR=ui,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Yf extends Be{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=be,this.minFilter=be,this.wrapR=ui,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class yi{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3];const d=r[o+0],p=r[o+1],g=r[o+2],x=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=p,t[e+2]=g,t[e+3]=x;return}if(u!==x||l!==d||c!==p||h!==g){let m=1-a;const f=l*d+c*p+h*g+u*x,_=f>=0?1:-1,v=1-f*f;if(v>Number.EPSILON){const w=Math.sqrt(v),E=Math.atan2(w,f*_);m=Math.sin(m*E)/w,a=Math.sin(a*E)/w}const y=a*_;if(l=l*m+d*y,c=c*m+p*y,h=h*m+g*y,u=u*m+x*y,m===1-a){const w=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=w,c*=w,h*=w,u*=w}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],d=r[o+1],p=r[o+2],g=r[o+3];return t[e]=a*g+h*u+l*p-c*d,t[e+1]=l*g+h*d+c*u-a*p,t[e+2]=c*g+h*p+a*d-l*u,t[e+3]=h*g-a*u-l*d-c*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),d=l(n/2),p=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u-d*p*g;break;case"YXZ":this._x=d*h*u+c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u+d*p*g;break;case"ZXY":this._x=d*h*u-c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u-d*p*g;break;case"ZYX":this._x=d*h*u-c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u+d*p*g;break;case"YZX":this._x=d*h*u+c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u-d*p*g;break;case"XZY":this._x=d*h*u-c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(o-s)*p}else if(n>a&&n>u){const p=2*Math.sqrt(1+n-a-u);this._w=(h-l)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+c)/p}else if(a>u){const p=2*Math.sqrt(1+a-n-u);this._w=(r-c)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(l+h)/p}else{const p=2*Math.sqrt(1+u-n-a);this._w=(o-s)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Se(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-e;return this._w=p*o+e*this._w,this._x=p*n+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(t=0,e=0,n=0){P.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Mc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Mc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return vo.copy(this).projectOnVector(t),this.sub(vo)}reflect(t){return this.sub(vo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Se(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const vo=new P,Mc=new yi;class mi{constructor(t=new P(1/0,1/0,1/0),e=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(en.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(en.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=en.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,en):en.fromBufferAttribute(r,o),en.applyMatrix4(t.matrixWorld),this.expandByPoint(en);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ks.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ks.copy(n.boundingBox)),Ks.applyMatrix4(t.matrixWorld),this.union(Ks)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,en),en.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ls),Zs.subVectors(this.max,ls),Ei.subVectors(t.a,ls),Ti.subVectors(t.b,ls),Ai.subVectors(t.c,ls),Bn.subVectors(Ti,Ei),zn.subVectors(Ai,Ti),ti.subVectors(Ei,Ai);let e=[0,-Bn.z,Bn.y,0,-zn.z,zn.y,0,-ti.z,ti.y,Bn.z,0,-Bn.x,zn.z,0,-zn.x,ti.z,0,-ti.x,-Bn.y,Bn.x,0,-zn.y,zn.x,0,-ti.y,ti.x,0];return!xo(e,Ei,Ti,Ai,Zs)||(e=[1,0,0,0,1,0,0,0,1],!xo(e,Ei,Ti,Ai,Zs))?!1:(js.crossVectors(Bn,zn),e=[js.x,js.y,js.z],xo(e,Ei,Ti,Ai,Zs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,en).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(en).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Mn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Mn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Mn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Mn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Mn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Mn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Mn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Mn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Mn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Mn=[new P,new P,new P,new P,new P,new P,new P,new P],en=new P,Ks=new mi,Ei=new P,Ti=new P,Ai=new P,Bn=new P,zn=new P,ti=new P,ls=new P,Zs=new P,js=new P,ei=new P;function xo(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){ei.fromArray(i,r);const a=s.x*Math.abs(ei.x)+s.y*Math.abs(ei.y)+s.z*Math.abs(ei.z),l=t.dot(ei),c=e.dot(ei),h=n.dot(ei);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const $f=new mi,cs=new P,yo=new P;class is{constructor(t=new P,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):$f.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;cs.subVectors(t,this.center);const e=cs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(cs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(yo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(cs.copy(t.center).add(yo)),this.expandByPoint(cs.copy(t.center).sub(yo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Sn=new P,Mo=new P,Js=new P,kn=new P,So=new P,Qs=new P,bo=new P;class Vs{constructor(t=new P,e=new P(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Sn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Sn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Sn.copy(this.origin).addScaledVector(this.direction,e),Sn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Mo.copy(t).add(e).multiplyScalar(.5),Js.copy(e).sub(t).normalize(),kn.copy(this.origin).sub(Mo);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Js),a=kn.dot(this.direction),l=-kn.dot(Js),c=kn.lengthSq(),h=Math.abs(1-o*o);let u,d,p,g;if(h>0)if(u=o*l-a,d=o*a-l,g=r*h,u>=0)if(d>=-g)if(d<=g){const x=1/h;u*=x,d*=x,p=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),p=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Mo).addScaledVector(Js,d),p}intersectSphere(t,e){Sn.subVectors(t.center,this.origin);const n=Sn.dot(this.direction),s=Sn.dot(Sn)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Sn)!==null}intersectTriangle(t,e,n,s,r){So.subVectors(e,t),Qs.subVectors(n,t),bo.crossVectors(So,Qs);let o=this.direction.dot(bo),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;kn.subVectors(this.origin,t);const l=a*this.direction.dot(Qs.crossVectors(kn,Qs));if(l<0)return null;const c=a*this.direction.dot(So.cross(kn));if(c<0||l+c>o)return null;const h=-a*kn.dot(bo);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ae{constructor(t,e,n,s,r,o,a,l,c,h,u,d,p,g,x,m){ae.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,u,d,p,g,x,m)}set(t,e,n,s,r,o,a,l,c,h,u,d,p,g,x,m){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=h,f[10]=u,f[14]=d,f[3]=p,f[7]=g,f[11]=x,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ae().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Ri.setFromMatrixColumn(t,0).length(),r=1/Ri.setFromMatrixColumn(t,1).length(),o=1/Ri.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=o*h,p=o*u,g=a*h,x=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=p+g*c,e[5]=d-x*c,e[9]=-a*l,e[2]=x-d*c,e[6]=g+p*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,p=l*u,g=c*h,x=c*u;e[0]=d+x*a,e[4]=g*a-p,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=p*a-g,e[6]=x+d*a,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,p=l*u,g=c*h,x=c*u;e[0]=d-x*a,e[4]=-o*u,e[8]=g+p*a,e[1]=p+g*a,e[5]=o*h,e[9]=x-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,p=o*u,g=a*h,x=a*u;e[0]=l*h,e[4]=g*c-p,e[8]=d*c+x,e[1]=l*u,e[5]=x*c+d,e[9]=p*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,p=o*c,g=a*l,x=a*c;e[0]=l*h,e[4]=x-d*u,e[8]=g*u+p,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=p*u+g,e[10]=d-x*u}else if(t.order==="XZY"){const d=o*l,p=o*c,g=a*l,x=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+x,e[5]=o*h,e[9]=p*u-g,e[2]=g*u-p,e[6]=a*h,e[10]=x*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Kf,t,Zf)}lookAt(t,e,n){const s=this.elements;return We.subVectors(t,e),We.lengthSq()===0&&(We.z=1),We.normalize(),Hn.crossVectors(n,We),Hn.lengthSq()===0&&(Math.abs(n.z)===1?We.x+=1e-4:We.z+=1e-4,We.normalize(),Hn.crossVectors(n,We)),Hn.normalize(),tr.crossVectors(We,Hn),s[0]=Hn.x,s[4]=tr.x,s[8]=We.x,s[1]=Hn.y,s[5]=tr.y,s[9]=We.y,s[2]=Hn.z,s[6]=tr.z,s[10]=We.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],p=n[13],g=n[2],x=n[6],m=n[10],f=n[14],_=n[3],v=n[7],y=n[11],w=n[15],E=s[0],A=s[4],L=s[8],S=s[12],M=s[1],R=s[5],I=s[9],U=s[13],B=s[2],q=s[6],H=s[10],Q=s[14],W=s[3],ct=s[7],ft=s[11],yt=s[15];return r[0]=o*E+a*M+l*B+c*W,r[4]=o*A+a*R+l*q+c*ct,r[8]=o*L+a*I+l*H+c*ft,r[12]=o*S+a*U+l*Q+c*yt,r[1]=h*E+u*M+d*B+p*W,r[5]=h*A+u*R+d*q+p*ct,r[9]=h*L+u*I+d*H+p*ft,r[13]=h*S+u*U+d*Q+p*yt,r[2]=g*E+x*M+m*B+f*W,r[6]=g*A+x*R+m*q+f*ct,r[10]=g*L+x*I+m*H+f*ft,r[14]=g*S+x*U+m*Q+f*yt,r[3]=_*E+v*M+y*B+w*W,r[7]=_*A+v*R+y*q+w*ct,r[11]=_*L+v*I+y*H+w*ft,r[15]=_*S+v*U+y*Q+w*yt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],p=t[14],g=t[3],x=t[7],m=t[11],f=t[15];return g*(+r*l*u-s*c*u-r*a*d+n*c*d+s*a*p-n*l*p)+x*(+e*l*p-e*c*d+r*o*d-s*o*p+s*c*h-r*l*h)+m*(+e*c*u-e*a*p-r*o*u+n*o*p+r*a*h-n*c*h)+f*(-s*a*h-e*l*u+e*a*d+s*o*u-n*o*d+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],p=t[11],g=t[12],x=t[13],m=t[14],f=t[15],_=u*m*c-x*d*c+x*l*p-a*m*p-u*l*f+a*d*f,v=g*d*c-h*m*c-g*l*p+o*m*p+h*l*f-o*d*f,y=h*x*c-g*u*c+g*a*p-o*x*p-h*a*f+o*u*f,w=g*u*l-h*x*l-g*a*d+o*x*d+h*a*m-o*u*m,E=e*_+n*v+s*y+r*w;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/E;return t[0]=_*A,t[1]=(x*d*r-u*m*r-x*s*p+n*m*p+u*s*f-n*d*f)*A,t[2]=(a*m*r-x*l*r+x*s*c-n*m*c-a*s*f+n*l*f)*A,t[3]=(u*l*r-a*d*r-u*s*c+n*d*c+a*s*p-n*l*p)*A,t[4]=v*A,t[5]=(h*m*r-g*d*r+g*s*p-e*m*p-h*s*f+e*d*f)*A,t[6]=(g*l*r-o*m*r-g*s*c+e*m*c+o*s*f-e*l*f)*A,t[7]=(o*d*r-h*l*r+h*s*c-e*d*c-o*s*p+e*l*p)*A,t[8]=y*A,t[9]=(g*u*r-h*x*r-g*n*p+e*x*p+h*n*f-e*u*f)*A,t[10]=(o*x*r-g*a*r+g*n*c-e*x*c-o*n*f+e*a*f)*A,t[11]=(h*a*r-o*u*r-h*n*c+e*u*c+o*n*p-e*a*p)*A,t[12]=w*A,t[13]=(h*x*s-g*u*s+g*n*d-e*x*d-h*n*m+e*u*m)*A,t[14]=(g*a*s-o*x*s-g*n*l+e*x*l+o*n*m-e*a*m)*A,t[15]=(o*u*s-h*a*s+h*n*l-e*u*l-o*n*d+e*a*d)*A,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,u=a+a,d=r*c,p=r*h,g=r*u,x=o*h,m=o*u,f=a*u,_=l*c,v=l*h,y=l*u,w=n.x,E=n.y,A=n.z;return s[0]=(1-(x+f))*w,s[1]=(p+y)*w,s[2]=(g-v)*w,s[3]=0,s[4]=(p-y)*E,s[5]=(1-(d+f))*E,s[6]=(m+_)*E,s[7]=0,s[8]=(g+v)*A,s[9]=(m-_)*A,s[10]=(1-(d+x))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Ri.set(s[0],s[1],s[2]).length();const o=Ri.set(s[4],s[5],s[6]).length(),a=Ri.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],nn.copy(this);const c=1/r,h=1/o,u=1/a;return nn.elements[0]*=c,nn.elements[1]*=c,nn.elements[2]*=c,nn.elements[4]*=h,nn.elements[5]*=h,nn.elements[6]*=h,nn.elements[8]*=u,nn.elements[9]*=u,nn.elements[10]*=u,e.setFromRotationMatrix(nn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Ln){const l=this.elements,c=2*r/(e-t),h=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s);let p,g;if(a===Ln)p=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Xr)p=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Ln){const l=this.elements,c=1/(e-t),h=1/(n-s),u=1/(o-r),d=(e+t)*c,p=(n+s)*h;let g,x;if(a===Ln)g=(o+r)*u,x=-2*u;else if(a===Xr)g=r*u,x=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=x,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ri=new P,nn=new ae,Kf=new P(0,0,0),Zf=new P(1,1,1),Hn=new P,tr=new P,We=new P,Sc=new ae,bc=new yi;class _n{constructor(t=0,e=0,n=0,s=_n.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(Se(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Se(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Se(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Se(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Se(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Se(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Sc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Sc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return bc.setFromEuler(this),this.setFromQuaternion(bc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}_n.DEFAULT_ORDER="XYZ";class no{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let jf=0;const wc=new P,Ci=new yi,bn=new ae,er=new P,hs=new P,Jf=new P,Qf=new yi,Ec=new P(1,0,0),Tc=new P(0,1,0),Ac=new P(0,0,1),Rc={type:"added"},tp={type:"removed"},Pi={type:"childadded",child:null},wo={type:"childremoved",child:null};class we extends ns{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:jf++}),this.uuid=xi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=we.DEFAULT_UP.clone();const t=new P,e=new _n,n=new yi,s=new P(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ae},normalMatrix:{value:new Gt}}),this.matrix=new ae,this.matrixWorld=new ae,this.matrixAutoUpdate=we.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=we.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new no,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ci.setFromAxisAngle(t,e),this.quaternion.multiply(Ci),this}rotateOnWorldAxis(t,e){return Ci.setFromAxisAngle(t,e),this.quaternion.premultiply(Ci),this}rotateX(t){return this.rotateOnAxis(Ec,t)}rotateY(t){return this.rotateOnAxis(Tc,t)}rotateZ(t){return this.rotateOnAxis(Ac,t)}translateOnAxis(t,e){return wc.copy(t).applyQuaternion(this.quaternion),this.position.add(wc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ec,t)}translateY(t){return this.translateOnAxis(Tc,t)}translateZ(t){return this.translateOnAxis(Ac,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(bn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?er.copy(t):er.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),hs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?bn.lookAt(hs,er,this.up):bn.lookAt(er,hs,this.up),this.quaternion.setFromRotationMatrix(bn),s&&(bn.extractRotation(s.matrixWorld),Ci.setFromRotationMatrix(bn),this.quaternion.premultiply(Ci.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Rc),Pi.child=t,this.dispatchEvent(Pi),Pi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(tp),wo.child=t,this.dispatchEvent(wo),wo.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),bn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),bn.multiply(t.parent.matrixWorld)),t.applyMatrix4(bn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Rc),Pi.child=t,this.dispatchEvent(Pi),Pi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(hs,t,Jf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(hs,Qf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),p=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}we.DEFAULT_UP=new P(0,1,0);we.DEFAULT_MATRIX_AUTO_UPDATE=!0;we.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const sn=new P,wn=new P,Eo=new P,En=new P,Li=new P,Di=new P,Cc=new P,To=new P,Ao=new P,Ro=new P,Co=new pe,Po=new pe,Lo=new pe;class Je{constructor(t=new P,e=new P,n=new P){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),sn.subVectors(t,e),s.cross(sn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){sn.subVectors(s,e),wn.subVectors(n,e),Eo.subVectors(t,e);const o=sn.dot(sn),a=sn.dot(wn),l=sn.dot(Eo),c=wn.dot(wn),h=wn.dot(Eo),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;const d=1/u,p=(c*l-a*h)*d,g=(o*h-a*l)*d;return r.set(1-p-g,g,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,En)===null?!1:En.x>=0&&En.y>=0&&En.x+En.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,En)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,En.x),l.addScaledVector(o,En.y),l.addScaledVector(a,En.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return Co.setScalar(0),Po.setScalar(0),Lo.setScalar(0),Co.fromBufferAttribute(t,e),Po.fromBufferAttribute(t,n),Lo.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Co,r.x),o.addScaledVector(Po,r.y),o.addScaledVector(Lo,r.z),o}static isFrontFacing(t,e,n,s){return sn.subVectors(n,e),wn.subVectors(t,e),sn.cross(wn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return sn.subVectors(this.c,this.b),wn.subVectors(this.a,this.b),sn.cross(wn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Je.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Je.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return Je.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return Je.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Je.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;Li.subVectors(s,n),Di.subVectors(r,n),To.subVectors(t,n);const l=Li.dot(To),c=Di.dot(To);if(l<=0&&c<=0)return e.copy(n);Ao.subVectors(t,s);const h=Li.dot(Ao),u=Di.dot(Ao);if(h>=0&&u<=h)return e.copy(s);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(Li,o);Ro.subVectors(t,r);const p=Li.dot(Ro),g=Di.dot(Ro);if(g>=0&&p<=g)return e.copy(r);const x=p*c-l*g;if(x<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(Di,a);const m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return Cc.subVectors(r,s),a=(u-h)/(u-h+(p-g)),e.copy(s).addScaledVector(Cc,a);const f=1/(m+x+d);return o=x*f,a=d*f,e.copy(n).addScaledVector(Li,o).addScaledVector(Di,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const zu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Gn={h:0,s:0,l:0},nr={h:0,s:0,l:0};function Do(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Nt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=qe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Yt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Yt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Yt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Yt.workingColorSpace){if(t=Pl(t,1),e=Se(e,0,1),n=Se(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Do(o,r,t+1/3),this.g=Do(o,r,t),this.b=Do(o,r,t-1/3)}return Yt.toWorkingColorSpace(this,s),this}setStyle(t,e=qe){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=qe){const n=zu[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Un(t.r),this.g=Un(t.g),this.b=Un(t.b),this}copyLinearToSRGB(t){return this.r=$i(t.r),this.g=$i(t.g),this.b=$i(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=qe){return Yt.fromWorkingColorSpace(Ie.copy(this),t),Math.round(Se(Ie.r*255,0,255))*65536+Math.round(Se(Ie.g*255,0,255))*256+Math.round(Se(Ie.b*255,0,255))}getHexString(t=qe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Yt.workingColorSpace){Yt.fromWorkingColorSpace(Ie.copy(this),e);const n=Ie.r,s=Ie.g,r=Ie.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Yt.workingColorSpace){return Yt.fromWorkingColorSpace(Ie.copy(this),e),t.r=Ie.r,t.g=Ie.g,t.b=Ie.b,t}getStyle(t=qe){Yt.fromWorkingColorSpace(Ie.copy(this),t);const e=Ie.r,n=Ie.g,s=Ie.b;return t!==qe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Gn),this.setHSL(Gn.h+t,Gn.s+e,Gn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Gn),t.getHSL(nr);const n=Es(Gn.h,nr.h,e),s=Es(Gn.s,nr.s,e),r=Es(Gn.l,nr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ie=new Nt;Nt.NAMES=zu;let ep=0;class Jn extends ns{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ep++}),this.uuid=xi(),this.name="",this.blending=qi,this.side=Zn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=wa,this.blendDst=Ea,this.blendEquation=ci,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Nt(0,0,0),this.blendAlpha=0,this.depthFunc=Ki,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=uc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=bi,this.stencilZFail=bi,this.stencilZPass=bi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==qi&&(n.blending=this.blending),this.side!==Zn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==wa&&(n.blendSrc=this.blendSrc),this.blendDst!==Ea&&(n.blendDst=this.blendDst),this.blendEquation!==ci&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ki&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==uc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==bi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==bi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==bi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class io extends Jn{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Nt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.combine=Ml,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ye=new P,ir=new et;class Ge{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=dc,this.updateRanges=[],this.gpuType=Pn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ir.fromBufferAttribute(this,e),ir.applyMatrix3(t),this.setXY(e,ir.x,ir.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix3(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix4(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyNormalMatrix(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.transformDirection(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Hi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ue(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Hi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Hi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Hi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Hi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ue(e,this.array),n=Ue(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Ue(e,this.array),n=Ue(n,this.array),s=Ue(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Ue(e,this.array),n=Ue(n,this.array),s=Ue(s,this.array),r=Ue(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==dc&&(t.usage=this.usage),t}}class ku extends Ge{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Hu extends Ge{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Zt extends Ge{constructor(t,e,n){super(new Float32Array(t),e,n)}}let np=0;const Ke=new ae,Io=new we,Ii=new P,Xe=new mi,us=new mi,Re=new P;class Ae extends ns{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:np++}),this.uuid=xi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Ou(t)?Hu:ku)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Gt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ke.makeRotationFromQuaternion(t),this.applyMatrix4(Ke),this}rotateX(t){return Ke.makeRotationX(t),this.applyMatrix4(Ke),this}rotateY(t){return Ke.makeRotationY(t),this.applyMatrix4(Ke),this}rotateZ(t){return Ke.makeRotationZ(t),this.applyMatrix4(Ke),this}translate(t,e,n){return Ke.makeTranslation(t,e,n),this.applyMatrix4(Ke),this}scale(t,e,n){return Ke.makeScale(t,e,n),this.applyMatrix4(Ke),this}lookAt(t){return Io.lookAt(t),Io.updateMatrix(),this.applyMatrix4(Io.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ii).negate(),this.translate(Ii.x,Ii.y,Ii.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Zt(n,3))}else{for(let n=0,s=e.count;n<s;n++){const r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new mi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Xe.setFromBufferAttribute(r),this.morphTargetsRelative?(Re.addVectors(this.boundingBox.min,Xe.min),this.boundingBox.expandByPoint(Re),Re.addVectors(this.boundingBox.max,Xe.max),this.boundingBox.expandByPoint(Re)):(this.boundingBox.expandByPoint(Xe.min),this.boundingBox.expandByPoint(Xe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new is);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(t){const n=this.boundingSphere.center;if(Xe.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];us.setFromBufferAttribute(a),this.morphTargetsRelative?(Re.addVectors(Xe.min,us.min),Xe.expandByPoint(Re),Re.addVectors(Xe.max,us.max),Xe.expandByPoint(Re)):(Xe.expandByPoint(us.min),Xe.expandByPoint(us.max))}Xe.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Re.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Re));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Re.fromBufferAttribute(a,c),l&&(Ii.fromBufferAttribute(t,c),Re.add(Ii)),s=Math.max(s,n.distanceToSquared(Re))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ge(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let L=0;L<n.count;L++)a[L]=new P,l[L]=new P;const c=new P,h=new P,u=new P,d=new et,p=new et,g=new et,x=new P,m=new P;function f(L,S,M){c.fromBufferAttribute(n,L),h.fromBufferAttribute(n,S),u.fromBufferAttribute(n,M),d.fromBufferAttribute(r,L),p.fromBufferAttribute(r,S),g.fromBufferAttribute(r,M),h.sub(c),u.sub(c),p.sub(d),g.sub(d);const R=1/(p.x*g.y-g.x*p.y);isFinite(R)&&(x.copy(h).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(R),m.copy(u).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(R),a[L].add(x),a[S].add(x),a[M].add(x),l[L].add(m),l[S].add(m),l[M].add(m))}let _=this.groups;_.length===0&&(_=[{start:0,count:t.count}]);for(let L=0,S=_.length;L<S;++L){const M=_[L],R=M.start,I=M.count;for(let U=R,B=R+I;U<B;U+=3)f(t.getX(U+0),t.getX(U+1),t.getX(U+2))}const v=new P,y=new P,w=new P,E=new P;function A(L){w.fromBufferAttribute(s,L),E.copy(w);const S=a[L];v.copy(S),v.sub(w.multiplyScalar(w.dot(S))).normalize(),y.crossVectors(E,S);const R=y.dot(l[L])<0?-1:1;o.setXYZW(L,v.x,v.y,v.z,R)}for(let L=0,S=_.length;L<S;++L){const M=_[L],R=M.start,I=M.count;for(let U=R,B=R+I;U<B;U+=3)A(t.getX(U+0)),A(t.getX(U+1)),A(t.getX(U+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ge(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);const s=new P,r=new P,o=new P,a=new P,l=new P,c=new P,h=new P,u=new P;if(t)for(let d=0,p=t.count;d<p;d+=3){const g=t.getX(d+0),x=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,x),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=e.count;d<p;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Re.fromBufferAttribute(t,e),Re.normalize(),t.setXYZ(e,Re.x,Re.y,Re.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h);let p=0,g=0;for(let x=0,m=l.length;x<m;x++){a.isInterleavedBufferAttribute?p=l[x]*a.data.stride+a.offset:p=l[x]*h;for(let f=0;f<h;f++)d[g++]=c[p++]}return new Ge(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ae,n=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){const d=c[h],p=t(d,n);l.push(p)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const p=c[u];h.push(p.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Pc=new ae,ni=new Vs,sr=new is,Lc=new P,rr=new P,or=new P,ar=new P,Uo=new P,lr=new P,Dc=new P,cr=new P;class Kt extends we{constructor(t=new Ae,e=new io){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){lr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],u=r[l];h!==0&&(Uo.fromBufferAttribute(u,t),o?lr.addScaledVector(Uo,h):lr.addScaledVector(Uo.sub(e),h))}e.add(lr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),sr.copy(n.boundingSphere),sr.applyMatrix4(r),ni.copy(t.ray).recast(t.near),!(sr.containsPoint(ni.origin)===!1&&(ni.intersectSphere(sr,Lc)===null||ni.origin.distanceToSquared(Lc)>(t.far-t.near)**2))&&(Pc.copy(r).invert(),ni.copy(t.ray).applyMatrix4(Pc),!(n.boundingBox!==null&&ni.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ni)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=d.length;g<x;g++){const m=d[g],f=o[m.materialIndex],_=Math.max(m.start,p.start),v=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let y=_,w=v;y<w;y+=3){const E=a.getX(y),A=a.getX(y+1),L=a.getX(y+2);s=hr(this,f,t,n,c,h,u,E,A,L),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),x=Math.min(a.count,p.start+p.count);for(let m=g,f=x;m<f;m+=3){const _=a.getX(m),v=a.getX(m+1),y=a.getX(m+2);s=hr(this,o,t,n,c,h,u,_,v,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,x=d.length;g<x;g++){const m=d[g],f=o[m.materialIndex],_=Math.max(m.start,p.start),v=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let y=_,w=v;y<w;y+=3){const E=y,A=y+1,L=y+2;s=hr(this,f,t,n,c,h,u,E,A,L),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),x=Math.min(l.count,p.start+p.count);for(let m=g,f=x;m<f;m+=3){const _=m,v=m+1,y=m+2;s=hr(this,o,t,n,c,h,u,_,v,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function ip(i,t,e,n,s,r,o,a){let l;if(t.side===Fe?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===Zn,a),l===null)return null;cr.copy(a),cr.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(cr);return c<e.near||c>e.far?null:{distance:c,point:cr.clone(),object:i}}function hr(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,rr),i.getVertexPosition(l,or),i.getVertexPosition(c,ar);const h=ip(i,t,e,n,rr,or,ar,Dc);if(h){const u=new P;Je.getBarycoord(Dc,rr,or,ar,u),s&&(h.uv=Je.getInterpolatedAttribute(s,a,l,c,u,new et)),r&&(h.uv1=Je.getInterpolatedAttribute(r,a,l,c,u,new et)),o&&(h.normal=Je.getInterpolatedAttribute(o,a,l,c,u,new P),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new P,materialIndex:0};Je.getNormal(rr,or,ar,d.normal),h.face=d,h.barycoord=u}return h}class it extends Ae{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],u=[];let d=0,p=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Zt(c,3)),this.setAttribute("normal",new Zt(h,3)),this.setAttribute("uv",new Zt(u,2));function g(x,m,f,_,v,y,w,E,A,L,S){const M=y/A,R=w/L,I=y/2,U=w/2,B=E/2,q=A+1,H=L+1;let Q=0,W=0;const ct=new P;for(let ft=0;ft<H;ft++){const yt=ft*R-U;for(let zt=0;zt<q;zt++){const Jt=zt*M-I;ct[x]=Jt*_,ct[m]=yt*v,ct[f]=B,c.push(ct.x,ct.y,ct.z),ct[x]=0,ct[m]=0,ct[f]=E>0?1:-1,h.push(ct.x,ct.y,ct.z),u.push(zt/A),u.push(1-ft/L),Q+=1}}for(let ft=0;ft<L;ft++)for(let yt=0;yt<A;yt++){const zt=d+yt+q*ft,Jt=d+yt+q*(ft+1),K=d+(yt+1)+q*(ft+1),rt=d+(yt+1)+q*ft;l.push(zt,Jt,rt),l.push(Jt,K,rt),W+=6}a.addGroup(p,W,S),p+=W,d+=Q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new it(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ts(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ne(i){const t={};for(let e=0;e<i.length;e++){const n=ts(i[e]);for(const s in n)t[s]=n[s]}return t}function sp(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Gu(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Yt.workingColorSpace}const so={clone:ts,merge:Ne};var rp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,op=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ye extends Jn{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=rp,this.fragmentShader=op,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ts(t.uniforms),this.uniformsGroups=sp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Vu extends we{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ae,this.projectionMatrix=new ae,this.projectionMatrixInverse=new ae,this.coordinateSystem=Ln}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Vn=new P,Ic=new et,Uc=new et;class je extends Vu{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ns*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ws*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ns*2*Math.atan(Math.tan(ws*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Vn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Vn.x,Vn.y).multiplyScalar(-t/Vn.z),Vn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Vn.x,Vn.y).multiplyScalar(-t/Vn.z)}getViewSize(t,e){return this.getViewBounds(t,Ic,Uc),e.subVectors(Uc,Ic)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ws*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ui=-90,Ni=1;class ap extends we{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new je(Ui,Ni,t,e);s.layers=this.layers,this.add(s);const r=new je(Ui,Ni,t,e);r.layers=this.layers,this.add(r);const o=new je(Ui,Ni,t,e);o.layers=this.layers,this.add(o);const a=new je(Ui,Ni,t,e);a.layers=this.layers,this.add(a);const l=new je(Ui,Ni,t,e);l.layers=this.layers,this.add(l);const c=new je(Ui,Ni,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===Ln)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Xr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Wu extends Be{constructor(t,e,n,s,r,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Zi,super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class lp extends gn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Wu(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:fn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new it(5,5,5),r=new Ye({name:"CubemapFromEquirect",uniforms:ts(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Fe,blending:In});r.uniforms.tEquirect.value=e;const o=new Kt(s,r),a=e.minFilter;return e.minFilter===di&&(e.minFilter=fn),new ap(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}const No=new P,cp=new P,hp=new Gt;class Xn{constructor(t=new P(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=No.subVectors(n,e).cross(cp.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(No),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||hp.getNormalMatrix(t),s=this.coplanarPoint(No).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ii=new is,ur=new P;class Ll{constructor(t=new Xn,e=new Xn,n=new Xn,s=new Xn,r=new Xn,o=new Xn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Ln){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],u=s[6],d=s[7],p=s[8],g=s[9],x=s[10],m=s[11],f=s[12],_=s[13],v=s[14],y=s[15];if(n[0].setComponents(l-r,d-c,m-p,y-f).normalize(),n[1].setComponents(l+r,d+c,m+p,y+f).normalize(),n[2].setComponents(l+o,d+h,m+g,y+_).normalize(),n[3].setComponents(l-o,d-h,m-g,y-_).normalize(),n[4].setComponents(l-a,d-u,m-x,y-v).normalize(),e===Ln)n[5].setComponents(l+a,d+u,m+x,y+v).normalize();else if(e===Xr)n[5].setComponents(a,u,x,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ii.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ii.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ii)}intersectsSprite(t){return ii.center.set(0,0,0),ii.radius=.7071067811865476,ii.applyMatrix4(t.matrixWorld),this.intersectsSphere(ii)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(ur.x=s.normal.x>0?t.max.x:t.min.x,ur.y=s.normal.y>0?t.max.y:t.min.y,ur.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ur)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Xu(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function up(i){const t=new WeakMap;function e(a,l){const c=a.array,h=a.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),a.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){const h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<u.length;p++){const g=u[d],x=u[p];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++d,u[d]=x)}u.length=d+1;for(let p=0,g=u.length;p<g;p++){const x=u[p];i.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}class $n extends Ae{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=t/a,d=e/l,p=[],g=[],x=[],m=[];for(let f=0;f<h;f++){const _=f*d-o;for(let v=0;v<c;v++){const y=v*u-r;g.push(y,-_,0),x.push(0,0,1),m.push(v/a),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let _=0;_<a;_++){const v=_+c*f,y=_+c*(f+1),w=_+1+c*(f+1),E=_+1+c*f;p.push(v,y,E),p.push(y,w,E)}this.setIndex(p),this.setAttribute("position",new Zt(g,3)),this.setAttribute("normal",new Zt(x,3)),this.setAttribute("uv",new Zt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $n(t.width,t.height,t.widthSegments,t.heightSegments)}}var dp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,fp=`#ifdef USE_ALPHAHASH
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
#endif`,pp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,mp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,gp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,_p=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,vp=`#ifdef USE_AOMAP
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
#endif`,xp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,yp=`#ifdef USE_BATCHING
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
#endif`,Mp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Sp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,bp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,wp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Ep=`#ifdef USE_IRIDESCENCE
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
#endif`,Tp=`#ifdef USE_BUMPMAP
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
#endif`,Ap=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Rp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Cp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Pp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Lp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Dp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ip=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Up=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Np=`#define PI 3.141592653589793
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
} // validated`,Op=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Fp=`vec3 transformedNormal = objectNormal;
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
#endif`,Bp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,zp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,kp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Hp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Gp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Vp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Wp=`#ifdef USE_ENVMAP
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
#endif`,Xp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,qp=`#ifdef USE_ENVMAP
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
#endif`,Yp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,$p=`#ifdef USE_ENVMAP
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
#endif`,Kp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Zp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,jp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Jp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Qp=`#ifdef USE_GRADIENTMAP
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
}`,tm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,em=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,nm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,im=`uniform bool receiveShadow;
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
#endif`,sm=`#ifdef USE_ENVMAP
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
#endif`,rm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,om=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,am=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,cm=`PhysicalMaterial material;
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
#endif`,hm=`struct PhysicalMaterial {
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
}`,um=`
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
#endif`,dm=`#if defined( RE_IndirectDiffuse )
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
#endif`,fm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,pm=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,mm=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,gm=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,_m=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,vm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,xm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ym=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Mm=`#if defined( USE_POINTS_UV )
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
#endif`,Sm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,bm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,wm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Em=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Tm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Am=`#ifdef USE_MORPHTARGETS
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
#endif`,Rm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Cm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Pm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Lm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Dm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Im=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Um=`#ifdef USE_NORMALMAP
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
#endif`,Nm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Om=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Fm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Bm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,zm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,km=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Hm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Gm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Vm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Wm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Xm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,qm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ym=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,$m=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Km=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Zm=`float getShadowMask() {
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
}`,jm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Jm=`#ifdef USE_SKINNING
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
#endif`,Qm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,t0=`#ifdef USE_SKINNING
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
#endif`,e0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,n0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,i0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,s0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,r0=`#ifdef USE_TRANSMISSION
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
#endif`,o0=`#ifdef USE_TRANSMISSION
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
#endif`,a0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,l0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,c0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,h0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const u0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,d0=`uniform sampler2D t2D;
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
}`,f0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,p0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,m0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,g0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_0=`#include <common>
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
}`,v0=`#if DEPTH_PACKING == 3200
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
}`,x0=`#define DISTANCE
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
}`,y0=`#define DISTANCE
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
}`,M0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,S0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,b0=`uniform float scale;
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
}`,w0=`uniform vec3 diffuse;
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
}`,E0=`#include <common>
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
}`,T0=`uniform vec3 diffuse;
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
}`,A0=`#define LAMBERT
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
}`,R0=`#define LAMBERT
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
}`,C0=`#define MATCAP
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
}`,P0=`#define MATCAP
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
}`,L0=`#define NORMAL
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
}`,D0=`#define NORMAL
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
}`,I0=`#define PHONG
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
}`,U0=`#define PHONG
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
}`,N0=`#define STANDARD
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
}`,O0=`#define STANDARD
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
}`,F0=`#define TOON
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
}`,B0=`#define TOON
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
}`,z0=`uniform float size;
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
}`,k0=`uniform vec3 diffuse;
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
}`,H0=`#include <common>
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
}`,G0=`uniform vec3 color;
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
}`,V0=`uniform float rotation;
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
}`,W0=`uniform vec3 diffuse;
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
}`,Wt={alphahash_fragment:dp,alphahash_pars_fragment:fp,alphamap_fragment:pp,alphamap_pars_fragment:mp,alphatest_fragment:gp,alphatest_pars_fragment:_p,aomap_fragment:vp,aomap_pars_fragment:xp,batching_pars_vertex:yp,batching_vertex:Mp,begin_vertex:Sp,beginnormal_vertex:bp,bsdfs:wp,iridescence_fragment:Ep,bumpmap_pars_fragment:Tp,clipping_planes_fragment:Ap,clipping_planes_pars_fragment:Rp,clipping_planes_pars_vertex:Cp,clipping_planes_vertex:Pp,color_fragment:Lp,color_pars_fragment:Dp,color_pars_vertex:Ip,color_vertex:Up,common:Np,cube_uv_reflection_fragment:Op,defaultnormal_vertex:Fp,displacementmap_pars_vertex:Bp,displacementmap_vertex:zp,emissivemap_fragment:kp,emissivemap_pars_fragment:Hp,colorspace_fragment:Gp,colorspace_pars_fragment:Vp,envmap_fragment:Wp,envmap_common_pars_fragment:Xp,envmap_pars_fragment:qp,envmap_pars_vertex:Yp,envmap_physical_pars_fragment:sm,envmap_vertex:$p,fog_vertex:Kp,fog_pars_vertex:Zp,fog_fragment:jp,fog_pars_fragment:Jp,gradientmap_pars_fragment:Qp,lightmap_pars_fragment:tm,lights_lambert_fragment:em,lights_lambert_pars_fragment:nm,lights_pars_begin:im,lights_toon_fragment:rm,lights_toon_pars_fragment:om,lights_phong_fragment:am,lights_phong_pars_fragment:lm,lights_physical_fragment:cm,lights_physical_pars_fragment:hm,lights_fragment_begin:um,lights_fragment_maps:dm,lights_fragment_end:fm,logdepthbuf_fragment:pm,logdepthbuf_pars_fragment:mm,logdepthbuf_pars_vertex:gm,logdepthbuf_vertex:_m,map_fragment:vm,map_pars_fragment:xm,map_particle_fragment:ym,map_particle_pars_fragment:Mm,metalnessmap_fragment:Sm,metalnessmap_pars_fragment:bm,morphinstance_vertex:wm,morphcolor_vertex:Em,morphnormal_vertex:Tm,morphtarget_pars_vertex:Am,morphtarget_vertex:Rm,normal_fragment_begin:Cm,normal_fragment_maps:Pm,normal_pars_fragment:Lm,normal_pars_vertex:Dm,normal_vertex:Im,normalmap_pars_fragment:Um,clearcoat_normal_fragment_begin:Nm,clearcoat_normal_fragment_maps:Om,clearcoat_pars_fragment:Fm,iridescence_pars_fragment:Bm,opaque_fragment:zm,packing:km,premultiplied_alpha_fragment:Hm,project_vertex:Gm,dithering_fragment:Vm,dithering_pars_fragment:Wm,roughnessmap_fragment:Xm,roughnessmap_pars_fragment:qm,shadowmap_pars_fragment:Ym,shadowmap_pars_vertex:$m,shadowmap_vertex:Km,shadowmask_pars_fragment:Zm,skinbase_vertex:jm,skinning_pars_vertex:Jm,skinning_vertex:Qm,skinnormal_vertex:t0,specularmap_fragment:e0,specularmap_pars_fragment:n0,tonemapping_fragment:i0,tonemapping_pars_fragment:s0,transmission_fragment:r0,transmission_pars_fragment:o0,uv_pars_fragment:a0,uv_pars_vertex:l0,uv_vertex:c0,worldpos_vertex:h0,background_vert:u0,background_frag:d0,backgroundCube_vert:f0,backgroundCube_frag:p0,cube_vert:m0,cube_frag:g0,depth_vert:_0,depth_frag:v0,distanceRGBA_vert:x0,distanceRGBA_frag:y0,equirect_vert:M0,equirect_frag:S0,linedashed_vert:b0,linedashed_frag:w0,meshbasic_vert:E0,meshbasic_frag:T0,meshlambert_vert:A0,meshlambert_frag:R0,meshmatcap_vert:C0,meshmatcap_frag:P0,meshnormal_vert:L0,meshnormal_frag:D0,meshphong_vert:I0,meshphong_frag:U0,meshphysical_vert:N0,meshphysical_frag:O0,meshtoon_vert:F0,meshtoon_frag:B0,points_vert:z0,points_frag:k0,shadow_vert:H0,shadow_frag:G0,sprite_vert:V0,sprite_frag:W0},ht={common:{diffuse:{value:new Nt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Gt},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Gt}},envmap:{envMap:{value:null},envMapRotation:{value:new Gt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Gt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Gt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Gt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Gt},normalScale:{value:new et(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Gt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Gt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Gt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Gt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Nt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Nt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0},uvTransform:{value:new Gt}},sprite:{diffuse:{value:new Nt(16777215)},opacity:{value:1},center:{value:new et(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Gt},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0}}},un={basic:{uniforms:Ne([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.fog]),vertexShader:Wt.meshbasic_vert,fragmentShader:Wt.meshbasic_frag},lambert:{uniforms:Ne([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,ht.lights,{emissive:{value:new Nt(0)}}]),vertexShader:Wt.meshlambert_vert,fragmentShader:Wt.meshlambert_frag},phong:{uniforms:Ne([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,ht.lights,{emissive:{value:new Nt(0)},specular:{value:new Nt(1118481)},shininess:{value:30}}]),vertexShader:Wt.meshphong_vert,fragmentShader:Wt.meshphong_frag},standard:{uniforms:Ne([ht.common,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.roughnessmap,ht.metalnessmap,ht.fog,ht.lights,{emissive:{value:new Nt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Wt.meshphysical_vert,fragmentShader:Wt.meshphysical_frag},toon:{uniforms:Ne([ht.common,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.gradientmap,ht.fog,ht.lights,{emissive:{value:new Nt(0)}}]),vertexShader:Wt.meshtoon_vert,fragmentShader:Wt.meshtoon_frag},matcap:{uniforms:Ne([ht.common,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,{matcap:{value:null}}]),vertexShader:Wt.meshmatcap_vert,fragmentShader:Wt.meshmatcap_frag},points:{uniforms:Ne([ht.points,ht.fog]),vertexShader:Wt.points_vert,fragmentShader:Wt.points_frag},dashed:{uniforms:Ne([ht.common,ht.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Wt.linedashed_vert,fragmentShader:Wt.linedashed_frag},depth:{uniforms:Ne([ht.common,ht.displacementmap]),vertexShader:Wt.depth_vert,fragmentShader:Wt.depth_frag},normal:{uniforms:Ne([ht.common,ht.bumpmap,ht.normalmap,ht.displacementmap,{opacity:{value:1}}]),vertexShader:Wt.meshnormal_vert,fragmentShader:Wt.meshnormal_frag},sprite:{uniforms:Ne([ht.sprite,ht.fog]),vertexShader:Wt.sprite_vert,fragmentShader:Wt.sprite_frag},background:{uniforms:{uvTransform:{value:new Gt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Wt.background_vert,fragmentShader:Wt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Gt}},vertexShader:Wt.backgroundCube_vert,fragmentShader:Wt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Wt.cube_vert,fragmentShader:Wt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Wt.equirect_vert,fragmentShader:Wt.equirect_frag},distanceRGBA:{uniforms:Ne([ht.common,ht.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Wt.distanceRGBA_vert,fragmentShader:Wt.distanceRGBA_frag},shadow:{uniforms:Ne([ht.lights,ht.fog,{color:{value:new Nt(0)},opacity:{value:1}}]),vertexShader:Wt.shadow_vert,fragmentShader:Wt.shadow_frag}};un.physical={uniforms:Ne([un.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Gt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Gt},clearcoatNormalScale:{value:new et(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Gt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Gt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Gt},sheen:{value:0},sheenColor:{value:new Nt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Gt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Gt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Gt},transmissionSamplerSize:{value:new et},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Gt},attenuationDistance:{value:0},attenuationColor:{value:new Nt(0)},specularColor:{value:new Nt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Gt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Gt},anisotropyVector:{value:new et},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Gt}}]),vertexShader:Wt.meshphysical_vert,fragmentShader:Wt.meshphysical_frag};const dr={r:0,b:0,g:0},si=new _n,X0=new ae;function q0(i,t,e,n,s,r,o){const a=new Nt(0);let l=r===!0?0:1,c,h,u=null,d=0,p=null;function g(_){let v=_.isScene===!0?_.background:null;return v&&v.isTexture&&(v=(_.backgroundBlurriness>0?e:t).get(v)),v}function x(_){let v=!1;const y=g(_);y===null?f(a,l):y&&y.isColor&&(f(y,1),v=!0);const w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(_,v){const y=g(v);y&&(y.isCubeTexture||y.mapping===to)?(h===void 0&&(h=new Kt(new it(1,1,1),new Ye({name:"BackgroundCubeMaterial",uniforms:ts(un.backgroundCube.uniforms),vertexShader:un.backgroundCube.vertexShader,fragmentShader:un.backgroundCube.fragmentShader,side:Fe,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,E,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),si.copy(v.backgroundRotation),si.x*=-1,si.y*=-1,si.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(si.y*=-1,si.z*=-1),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(X0.makeRotationFromEuler(si)),h.material.toneMapped=Yt.getTransfer(y.colorSpace)!==ne,(u!==y||d!==y.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=y,d=y.version,p=i.toneMapping),h.layers.enableAll(),_.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new Kt(new $n(2,2),new Ye({name:"BackgroundMaterial",uniforms:ts(un.background.uniforms),vertexShader:un.background.vertexShader,fragmentShader:un.background.fragmentShader,side:Zn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=Yt.getTransfer(y.colorSpace)!==ne,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||d!==y.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,u=y,d=y.version,p=i.toneMapping),c.layers.enableAll(),_.unshift(c,c.geometry,c.material,0,0,null))}function f(_,v){_.getRGB(dr,Gu(i)),n.buffers.color.setClear(dr.r,dr.g,dr.b,v,o)}return{getClearColor:function(){return a},setClearColor:function(_,v=1){a.set(_),l=v,f(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(_){l=_,f(a,l)},render:x,addToRenderList:m}}function Y0(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,o=!1;function a(M,R,I,U,B){let q=!1;const H=u(U,I,R);r!==H&&(r=H,c(r.object)),q=p(M,U,I,B),q&&g(M,U,I,B),B!==null&&t.update(B,i.ELEMENT_ARRAY_BUFFER),(q||o)&&(o=!1,y(M,R,I,U),B!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(B).buffer))}function l(){return i.createVertexArray()}function c(M){return i.bindVertexArray(M)}function h(M){return i.deleteVertexArray(M)}function u(M,R,I){const U=I.wireframe===!0;let B=n[M.id];B===void 0&&(B={},n[M.id]=B);let q=B[R.id];q===void 0&&(q={},B[R.id]=q);let H=q[U];return H===void 0&&(H=d(l()),q[U]=H),H}function d(M){const R=[],I=[],U=[];for(let B=0;B<e;B++)R[B]=0,I[B]=0,U[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:I,attributeDivisors:U,object:M,attributes:{},index:null}}function p(M,R,I,U){const B=r.attributes,q=R.attributes;let H=0;const Q=I.getAttributes();for(const W in Q)if(Q[W].location>=0){const ft=B[W];let yt=q[W];if(yt===void 0&&(W==="instanceMatrix"&&M.instanceMatrix&&(yt=M.instanceMatrix),W==="instanceColor"&&M.instanceColor&&(yt=M.instanceColor)),ft===void 0||ft.attribute!==yt||yt&&ft.data!==yt.data)return!0;H++}return r.attributesNum!==H||r.index!==U}function g(M,R,I,U){const B={},q=R.attributes;let H=0;const Q=I.getAttributes();for(const W in Q)if(Q[W].location>=0){let ft=q[W];ft===void 0&&(W==="instanceMatrix"&&M.instanceMatrix&&(ft=M.instanceMatrix),W==="instanceColor"&&M.instanceColor&&(ft=M.instanceColor));const yt={};yt.attribute=ft,ft&&ft.data&&(yt.data=ft.data),B[W]=yt,H++}r.attributes=B,r.attributesNum=H,r.index=U}function x(){const M=r.newAttributes;for(let R=0,I=M.length;R<I;R++)M[R]=0}function m(M){f(M,0)}function f(M,R){const I=r.newAttributes,U=r.enabledAttributes,B=r.attributeDivisors;I[M]=1,U[M]===0&&(i.enableVertexAttribArray(M),U[M]=1),B[M]!==R&&(i.vertexAttribDivisor(M,R),B[M]=R)}function _(){const M=r.newAttributes,R=r.enabledAttributes;for(let I=0,U=R.length;I<U;I++)R[I]!==M[I]&&(i.disableVertexAttribArray(I),R[I]=0)}function v(M,R,I,U,B,q,H){H===!0?i.vertexAttribIPointer(M,R,I,B,q):i.vertexAttribPointer(M,R,I,U,B,q)}function y(M,R,I,U){x();const B=U.attributes,q=I.getAttributes(),H=R.defaultAttributeValues;for(const Q in q){const W=q[Q];if(W.location>=0){let ct=B[Q];if(ct===void 0&&(Q==="instanceMatrix"&&M.instanceMatrix&&(ct=M.instanceMatrix),Q==="instanceColor"&&M.instanceColor&&(ct=M.instanceColor)),ct!==void 0){const ft=ct.normalized,yt=ct.itemSize,zt=t.get(ct);if(zt===void 0)continue;const Jt=zt.buffer,K=zt.type,rt=zt.bytesPerElement,bt=K===i.INT||K===i.UNSIGNED_INT||ct.gpuType===Sl;if(ct.isInterleavedBufferAttribute){const at=ct.data,Pt=at.stride,Ot=ct.offset;if(at.isInstancedInterleavedBuffer){for(let It=0;It<W.locationSize;It++)f(W.location+It,at.meshPerAttribute);M.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let It=0;It<W.locationSize;It++)m(W.location+It);i.bindBuffer(i.ARRAY_BUFFER,Jt);for(let It=0;It<W.locationSize;It++)v(W.location+It,yt/W.locationSize,K,ft,Pt*rt,(Ot+yt/W.locationSize*It)*rt,bt)}else{if(ct.isInstancedBufferAttribute){for(let at=0;at<W.locationSize;at++)f(W.location+at,ct.meshPerAttribute);M.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=ct.meshPerAttribute*ct.count)}else for(let at=0;at<W.locationSize;at++)m(W.location+at);i.bindBuffer(i.ARRAY_BUFFER,Jt);for(let at=0;at<W.locationSize;at++)v(W.location+at,yt/W.locationSize,K,ft,yt*rt,yt/W.locationSize*at*rt,bt)}}else if(H!==void 0){const ft=H[Q];if(ft!==void 0)switch(ft.length){case 2:i.vertexAttrib2fv(W.location,ft);break;case 3:i.vertexAttrib3fv(W.location,ft);break;case 4:i.vertexAttrib4fv(W.location,ft);break;default:i.vertexAttrib1fv(W.location,ft)}}}}_()}function w(){L();for(const M in n){const R=n[M];for(const I in R){const U=R[I];for(const B in U)h(U[B].object),delete U[B];delete R[I]}delete n[M]}}function E(M){if(n[M.id]===void 0)return;const R=n[M.id];for(const I in R){const U=R[I];for(const B in U)h(U[B].object),delete U[B];delete R[I]}delete n[M.id]}function A(M){for(const R in n){const I=n[R];if(I[M.id]===void 0)continue;const U=I[M.id];for(const B in U)h(U[B].object),delete U[B];delete I[M.id]}}function L(){S(),o=!0,r!==s&&(r=s,c(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:L,resetDefaultState:S,dispose:w,releaseStatesOfGeometry:E,releaseStatesOfProgram:A,initAttributes:x,enableAttribute:m,disableUnusedAttributes:_}}function $0(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function o(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function a(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let p=0;for(let g=0;g<u;g++)p+=h[g];e.update(p,n,1)}function l(c,h,u,d){if(u===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)o(c[g],h[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let g=0;for(let x=0;x<u;x++)g+=h[x]*d[x];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function K0(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(A){return!(A!==on&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const L=A===jn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Nn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Pn&&!L)}function l(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),_=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=g>0,E=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:_,maxVaryings:v,maxFragmentUniforms:y,vertexTextures:w,maxSamples:E}}function Z0(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new Xn,a=new Gt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const p=u.length!==0||d||n!==0||s;return s=d,n=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,p){const g=u.clippingPlanes,x=u.clipIntersection,m=u.clipShadows,f=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{const _=r?0:n,v=_*4;let y=f.clippingState||null;l.value=y,y=h(g,d,v,p);for(let w=0;w!==v;++w)y[w]=e[w];f.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,p,g){const x=u!==null?u.length:0;let m=null;if(x!==0){if(m=l.value,g!==!0||m===null){const f=p+x*4,_=d.matrixWorldInverse;a.getNormalMatrix(_),(m===null||m.length<f)&&(m=new Float32Array(f));for(let v=0,y=p;v!==x;++v,y+=4)o.copy(u[v]).applyMatrix4(_,a),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,m}}function j0(i){let t=new WeakMap;function e(o,a){return a===Ia?o.mapping=Zi:a===Ua&&(o.mapping=ji),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Ia||a===Ua)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new lp(l.height);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class Dl extends Vu{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Vi=4,Nc=[.125,.215,.35,.446,.526,.582],hi=20,Oo=new Dl,Oc=new Nt;let Fo=null,Bo=0,zo=0,ko=!1;const li=(1+Math.sqrt(5))/2,Oi=1/li,Fc=[new P(-li,Oi,0),new P(li,Oi,0),new P(-Oi,0,li),new P(Oi,0,li),new P(0,li,-Oi),new P(0,li,Oi),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)];class Bc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Fo=this._renderer.getRenderTarget(),Bo=this._renderer.getActiveCubeFace(),zo=this._renderer.getActiveMipmapLevel(),ko=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Hc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=kc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Fo,Bo,zo),this._renderer.xr.enabled=ko,t.scissorTest=!1,fr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Zi||t.mapping===ji?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Fo=this._renderer.getRenderTarget(),Bo=this._renderer.getActiveCubeFace(),zo=this._renderer.getActiveMipmapLevel(),ko=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:fn,minFilter:fn,generateMipmaps:!1,type:jn,format:on,colorSpace:es,depthBuffer:!1},s=zc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=zc(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=J0(r)),this._blurMaterial=Q0(r,t,e)}return s}_compileMaterial(t){const e=new Kt(this._lodPlanes[0],t);this._renderer.compile(e,Oo)}_sceneToCubeUV(t,e,n,s){const a=new je(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Oc),h.toneMapping=Yn,h.autoClear=!1;const p=new io({name:"PMREM.Background",side:Fe,depthWrite:!1,depthTest:!1}),g=new Kt(new it,p);let x=!1;const m=t.background;m?m.isColor&&(p.color.copy(m),t.background=null,x=!0):(p.color.copy(Oc),x=!0);for(let f=0;f<6;f++){const _=f%3;_===0?(a.up.set(0,l[f],0),a.lookAt(c[f],0,0)):_===1?(a.up.set(0,0,l[f]),a.lookAt(0,c[f],0)):(a.up.set(0,l[f],0),a.lookAt(0,0,c[f]));const v=this._cubeSize;fr(s,_*v,f>2?v:0,v,v),h.setRenderTarget(s),x&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Zi||t.mapping===ji;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Hc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=kc());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new Kt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;fr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Oo)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Fc[(s-r-1)%Fc.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Kt(this._lodPlanes[s],c),d=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*hi-1),x=r/g,m=isFinite(r)?1+Math.floor(h*x):hi;m>hi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${hi}`);const f=[];let _=0;for(let A=0;A<hi;++A){const L=A/x,S=Math.exp(-L*L/2);f.push(S),A===0?_+=S:A<m&&(_+=2*S)}for(let A=0;A<f.length;A++)f[A]=f[A]/_;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:v}=this;d.dTheta.value=g,d.mipInt.value=v-n;const y=this._sizeLods[s],w=3*y*(s>v-Vi?s-v+Vi:0),E=4*(this._cubeSize-y);fr(e,w,E,3*y,2*y),l.setRenderTarget(e),l.render(u,Oo)}}function J0(i){const t=[],e=[],n=[];let s=i;const r=i-Vi+1+Nc.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let l=1/a;o>i-Vi?l=Nc[o-i+Vi-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,x=3,m=2,f=1,_=new Float32Array(x*g*p),v=new Float32Array(m*g*p),y=new Float32Array(f*g*p);for(let E=0;E<p;E++){const A=E%3*2/3-1,L=E>2?0:-1,S=[A,L,0,A+2/3,L,0,A+2/3,L+1,0,A,L,0,A+2/3,L+1,0,A,L+1,0];_.set(S,x*g*E),v.set(d,m*g*E);const M=[E,E,E,E,E,E];y.set(M,f*g*E)}const w=new Ae;w.setAttribute("position",new Ge(_,x)),w.setAttribute("uv",new Ge(v,m)),w.setAttribute("faceIndex",new Ge(y,f)),t.push(w),s>Vi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function zc(i,t,e){const n=new gn(i,t,e);return n.texture.mapping=to,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function fr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Q0(i,t,e){const n=new Float32Array(hi),s=new P(0,1,0);return new Ye({name:"SphericalGaussianBlur",defines:{n:hi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Il(),fragmentShader:`

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
		`,blending:In,depthTest:!1,depthWrite:!1})}function kc(){return new Ye({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Il(),fragmentShader:`

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
		`,blending:In,depthTest:!1,depthWrite:!1})}function Hc(){return new Ye({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Il(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:In,depthTest:!1,depthWrite:!1})}function Il(){return`

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
	`}function tg(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===Ia||l===Ua,h=l===Zi||l===ji;if(c||h){let u=t.get(a);const d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new Bc(i)),u=c?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{const p=a.image;return c&&p&&p.height>0||h&&p&&s(p)?(e===null&&(e=new Bc(i)),u=c?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function eg(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&ys("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function ng(i,t,e,n){const s={},r=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const x=d.morphAttributes[g];for(let m=0,f=x.length;m<f;m++)t.remove(x[m])}d.removeEventListener("dispose",o),delete s[d.id];const p=r.get(d);p&&(t.remove(p),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function l(u){const d=u.attributes;for(const g in d)t.update(d[g],i.ARRAY_BUFFER);const p=u.morphAttributes;for(const g in p){const x=p[g];for(let m=0,f=x.length;m<f;m++)t.update(x[m],i.ARRAY_BUFFER)}}function c(u){const d=[],p=u.index,g=u.attributes.position;let x=0;if(p!==null){const _=p.array;x=p.version;for(let v=0,y=_.length;v<y;v+=3){const w=_[v+0],E=_[v+1],A=_[v+2];d.push(w,E,E,A,A,w)}}else if(g!==void 0){const _=g.array;x=g.version;for(let v=0,y=_.length/3-1;v<y;v+=3){const w=v+0,E=v+1,A=v+2;d.push(w,E,E,A,A,w)}}else return;const m=new(Ou(d)?Hu:ku)(d,1);m.version=x;const f=r.get(u);f&&t.remove(f),r.set(u,m)}function h(u){const d=r.get(u);if(d){const p=u.index;p!==null&&d.version<p.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function ig(i,t,e){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,p){i.drawElements(n,p,r,d*o),e.update(p,n,1)}function c(d,p,g){g!==0&&(i.drawElementsInstanced(n,p,r,d*o,g),e.update(p,n,g))}function h(d,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,d,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];e.update(m,n,1)}function u(d,p,g,x){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)c(d[f]/o,p[f],x[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,d,0,x,0,g);let f=0;for(let _=0;_<g;_++)f+=p[_]*x[_];e.update(f,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function sg(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function rg(i,t,e){const n=new WeakMap,s=new pe;function r(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(a);if(d===void 0||d.count!==u){let S=function(){A.dispose(),n.delete(a),a.removeEventListener("dispose",S)};d!==void 0&&d.texture.dispose();const p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],_=a.morphAttributes.color||[];let v=0;p===!0&&(v=1),g===!0&&(v=2),x===!0&&(v=3);let y=a.attributes.position.count*v,w=1;y>t.maxTextureSize&&(w=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);const E=new Float32Array(y*w*4*u),A=new Bu(E,y,w,u);A.type=Pn,A.needsUpdate=!0;const L=v*4;for(let M=0;M<u;M++){const R=m[M],I=f[M],U=_[M],B=y*w*4*M;for(let q=0;q<R.count;q++){const H=q*L;p===!0&&(s.fromBufferAttribute(R,q),E[B+H+0]=s.x,E[B+H+1]=s.y,E[B+H+2]=s.z,E[B+H+3]=0),g===!0&&(s.fromBufferAttribute(I,q),E[B+H+4]=s.x,E[B+H+5]=s.y,E[B+H+6]=s.z,E[B+H+7]=0),x===!0&&(s.fromBufferAttribute(U,q),E[B+H+8]=s.x,E[B+H+9]=s.y,E[B+H+10]=s.z,E[B+H+11]=U.itemSize===4?s.w:1)}}d={count:u,texture:A,size:new et(y,w)},n.set(a,d),a.addEventListener("dispose",S)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let p=0;for(let x=0;x<c.length;x++)p+=c[x];const g=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function og(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}class Ul extends Be{constructor(t,e,n,s,r,o,a,l,c,h=Yi){if(h!==Yi&&h!==Qi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Yi&&(n=pi),n===void 0&&h===Qi&&(n=Ji),super(null,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:be,this.minFilter=l!==void 0?l:be,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const qu=new Be,Gc=new Ul(1,1),Yu=new Bu,$u=new Yf,Ku=new Wu,Vc=[],Wc=[],Xc=new Float32Array(16),qc=new Float32Array(9),Yc=new Float32Array(4);function ss(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Vc[s];if(r===void 0&&(r=new Float32Array(s),Vc[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Ee(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Te(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function ro(i,t){let e=Wc[t];e===void 0&&(e=new Int32Array(t),Wc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function ag(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function lg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;i.uniform2fv(this.addr,t),Te(e,t)}}function cg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ee(e,t))return;i.uniform3fv(this.addr,t),Te(e,t)}}function hg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;i.uniform4fv(this.addr,t),Te(e,t)}}function ug(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Te(e,t)}else{if(Ee(e,n))return;Yc.set(n),i.uniformMatrix2fv(this.addr,!1,Yc),Te(e,n)}}function dg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Te(e,t)}else{if(Ee(e,n))return;qc.set(n),i.uniformMatrix3fv(this.addr,!1,qc),Te(e,n)}}function fg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Te(e,t)}else{if(Ee(e,n))return;Xc.set(n),i.uniformMatrix4fv(this.addr,!1,Xc),Te(e,n)}}function pg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function mg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;i.uniform2iv(this.addr,t),Te(e,t)}}function gg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ee(e,t))return;i.uniform3iv(this.addr,t),Te(e,t)}}function _g(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;i.uniform4iv(this.addr,t),Te(e,t)}}function vg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function xg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;i.uniform2uiv(this.addr,t),Te(e,t)}}function yg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ee(e,t))return;i.uniform3uiv(this.addr,t),Te(e,t)}}function Mg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;i.uniform4uiv(this.addr,t),Te(e,t)}}function Sg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Gc.compareFunction=Nu,r=Gc):r=qu,e.setTexture2D(t||r,s)}function bg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||$u,s)}function wg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Ku,s)}function Eg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Yu,s)}function Tg(i){switch(i){case 5126:return ag;case 35664:return lg;case 35665:return cg;case 35666:return hg;case 35674:return ug;case 35675:return dg;case 35676:return fg;case 5124:case 35670:return pg;case 35667:case 35671:return mg;case 35668:case 35672:return gg;case 35669:case 35673:return _g;case 5125:return vg;case 36294:return xg;case 36295:return yg;case 36296:return Mg;case 35678:case 36198:case 36298:case 36306:case 35682:return Sg;case 35679:case 36299:case 36307:return bg;case 35680:case 36300:case 36308:case 36293:return wg;case 36289:case 36303:case 36311:case 36292:return Eg}}function Ag(i,t){i.uniform1fv(this.addr,t)}function Rg(i,t){const e=ss(t,this.size,2);i.uniform2fv(this.addr,e)}function Cg(i,t){const e=ss(t,this.size,3);i.uniform3fv(this.addr,e)}function Pg(i,t){const e=ss(t,this.size,4);i.uniform4fv(this.addr,e)}function Lg(i,t){const e=ss(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Dg(i,t){const e=ss(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Ig(i,t){const e=ss(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Ug(i,t){i.uniform1iv(this.addr,t)}function Ng(i,t){i.uniform2iv(this.addr,t)}function Og(i,t){i.uniform3iv(this.addr,t)}function Fg(i,t){i.uniform4iv(this.addr,t)}function Bg(i,t){i.uniform1uiv(this.addr,t)}function zg(i,t){i.uniform2uiv(this.addr,t)}function kg(i,t){i.uniform3uiv(this.addr,t)}function Hg(i,t){i.uniform4uiv(this.addr,t)}function Gg(i,t,e){const n=this.cache,s=t.length,r=ro(e,s);Ee(n,r)||(i.uniform1iv(this.addr,r),Te(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||qu,r[o])}function Vg(i,t,e){const n=this.cache,s=t.length,r=ro(e,s);Ee(n,r)||(i.uniform1iv(this.addr,r),Te(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||$u,r[o])}function Wg(i,t,e){const n=this.cache,s=t.length,r=ro(e,s);Ee(n,r)||(i.uniform1iv(this.addr,r),Te(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Ku,r[o])}function Xg(i,t,e){const n=this.cache,s=t.length,r=ro(e,s);Ee(n,r)||(i.uniform1iv(this.addr,r),Te(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Yu,r[o])}function qg(i){switch(i){case 5126:return Ag;case 35664:return Rg;case 35665:return Cg;case 35666:return Pg;case 35674:return Lg;case 35675:return Dg;case 35676:return Ig;case 5124:case 35670:return Ug;case 35667:case 35671:return Ng;case 35668:case 35672:return Og;case 35669:case 35673:return Fg;case 5125:return Bg;case 36294:return zg;case 36295:return kg;case 36296:return Hg;case 35678:case 36198:case 36298:case 36306:case 35682:return Gg;case 35679:case 36299:case 36307:return Vg;case 35680:case 36300:case 36308:case 36293:return Wg;case 36289:case 36303:case 36311:case 36292:return Xg}}class Yg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Tg(e.type)}}class $g{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=qg(e.type)}}class Kg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const Ho=/(\w+)(\])?(\[|\.)?/g;function $c(i,t){i.seq.push(t),i.map[t.id]=t}function Zg(i,t,e){const n=i.name,s=n.length;for(Ho.lastIndex=0;;){const r=Ho.exec(n),o=Ho.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){$c(e,c===void 0?new Yg(a,i,t):new $g(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new Kg(a),$c(e,u)),e=u}}}class Wr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);Zg(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function Kc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const jg=37297;let Jg=0;function Qg(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const Zc=new Gt;function t_(i){Yt._getMatrix(Zc,Yt.workingColorSpace,i);const t=`mat3( ${Zc.elements.map(e=>e.toFixed(4))} )`;switch(Yt.getTransfer(i)){case eo:return[t,"LinearTransferOETF"];case ne:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function jc(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+Qg(i.getShaderSource(t),o)}else return s}function e_(i,t){const e=t_(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function n_(i,t){let e;switch(t){case xu:e="Linear";break;case yu:e="Reinhard";break;case Mu:e="Cineon";break;case Su:e="ACESFilmic";break;case bu:e="AgX";break;case wu:e="Neutral";break;case hf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const pr=new P;function i_(){Yt.getLuminanceCoefficients(pr);const i=pr.x.toFixed(4),t=pr.y.toFixed(4),e=pr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function s_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ms).join(`
`)}function r_(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function o_(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Ms(i){return i!==""}function Jc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Qc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const a_=/^[ \t]*#include +<([\w\d./]+)>/gm;function ll(i){return i.replace(a_,c_)}const l_=new Map;function c_(i,t){let e=Wt[t];if(e===void 0){const n=l_.get(t);if(n!==void 0)e=Wt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return ll(e)}const h_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function th(i){return i.replace(h_,u_)}function u_(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function eh(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function d_(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===vu?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Gd?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===An&&(t="SHADOWMAP_TYPE_VSM"),t}function f_(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Zi:case ji:t="ENVMAP_TYPE_CUBE";break;case to:t="ENVMAP_TYPE_CUBE_UV";break}return t}function p_(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ji:t="ENVMAP_MODE_REFRACTION";break}return t}function m_(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ml:t="ENVMAP_BLENDING_MULTIPLY";break;case lf:t="ENVMAP_BLENDING_MIX";break;case cf:t="ENVMAP_BLENDING_ADD";break}return t}function g_(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function __(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=d_(e),c=f_(e),h=p_(e),u=m_(e),d=g_(e),p=s_(e),g=r_(r),x=s.createProgram();let m,f,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ms).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ms).join(`
`),f.length>0&&(f+=`
`)):(m=[eh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ms).join(`
`),f=[eh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Yn?"#define TONE_MAPPING":"",e.toneMapping!==Yn?Wt.tonemapping_pars_fragment:"",e.toneMapping!==Yn?n_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Wt.colorspace_pars_fragment,e_("linearToOutputTexel",e.outputColorSpace),i_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ms).join(`
`)),o=ll(o),o=Jc(o,e),o=Qc(o,e),a=ll(a),a=Jc(a,e),a=Qc(a,e),o=th(o),a=th(a),e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===fc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===fc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const v=_+m+o,y=_+f+a,w=Kc(s,s.VERTEX_SHADER,v),E=Kc(s,s.FRAGMENT_SHADER,y);s.attachShader(x,w),s.attachShader(x,E),e.index0AttributeName!==void 0?s.bindAttribLocation(x,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function A(R){if(i.debug.checkShaderErrors){const I=s.getProgramInfoLog(x).trim(),U=s.getShaderInfoLog(w).trim(),B=s.getShaderInfoLog(E).trim();let q=!0,H=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(q=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,w,E);else{const Q=jc(s,w,"vertex"),W=jc(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+I+`
`+Q+`
`+W)}else I!==""?console.warn("THREE.WebGLProgram: Program Info Log:",I):(U===""||B==="")&&(H=!1);H&&(R.diagnostics={runnable:q,programLog:I,vertexShader:{log:U,prefix:m},fragmentShader:{log:B,prefix:f}})}s.deleteShader(w),s.deleteShader(E),L=new Wr(s,x),S=o_(s,x)}let L;this.getUniforms=function(){return L===void 0&&A(this),L};let S;this.getAttributes=function(){return S===void 0&&A(this),S};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(x,jg)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Jg++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=w,this.fragmentShader=E,this}let v_=0;class x_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new y_(t),e.set(t,n)),n}}class y_{constructor(t){this.id=v_++,this.code=t,this.usedTimes=0}}function M_(i,t,e,n,s,r,o){const a=new no,l=new x_,c=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures;let p=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(S){return c.add(S),S===0?"uv":`uv${S}`}function m(S,M,R,I,U){const B=I.fog,q=U.geometry,H=S.isMeshStandardMaterial?I.environment:null,Q=(S.isMeshStandardMaterial?e:t).get(S.envMap||H),W=Q&&Q.mapping===to?Q.image.height:null,ct=g[S.type];S.precision!==null&&(p=s.getMaxPrecision(S.precision),p!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",p,"instead."));const ft=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,yt=ft!==void 0?ft.length:0;let zt=0;q.morphAttributes.position!==void 0&&(zt=1),q.morphAttributes.normal!==void 0&&(zt=2),q.morphAttributes.color!==void 0&&(zt=3);let Jt,K,rt,bt;if(ct){const ee=un[ct];Jt=ee.vertexShader,K=ee.fragmentShader}else Jt=S.vertexShader,K=S.fragmentShader,l.update(S),rt=l.getVertexShaderID(S),bt=l.getFragmentShaderID(S);const at=i.getRenderTarget(),Pt=i.state.buffers.depth.getReversed(),Ot=U.isInstancedMesh===!0,It=U.isBatchedMesh===!0,$t=!!S.map,j=!!S.matcap,st=!!Q,D=!!S.aoMap,Rt=!!S.lightMap,tt=!!S.bumpMap,xt=!!S.normalMap,lt=!!S.displacementMap,Lt=!!S.emissiveMap,_t=!!S.metalnessMap,C=!!S.roughnessMap,b=S.anisotropy>0,k=S.clearcoat>0,Y=S.dispersion>0,J=S.iridescence>0,$=S.sheen>0,wt=S.transmission>0,ut=b&&!!S.anisotropyMap,vt=k&&!!S.clearcoatMap,Xt=k&&!!S.clearcoatNormalMap,nt=k&&!!S.clearcoatRoughnessMap,Mt=J&&!!S.iridescenceMap,Dt=J&&!!S.iridescenceThicknessMap,Ut=$&&!!S.sheenColorMap,St=$&&!!S.sheenRoughnessMap,qt=!!S.specularMap,Vt=!!S.specularColorMap,re=!!S.specularIntensityMap,N=wt&&!!S.transmissionMap,dt=wt&&!!S.thicknessMap,X=!!S.gradientMap,Z=!!S.alphaMap,gt=S.alphaTest>0,pt=!!S.alphaHash,kt=!!S.extensions;let _e=Yn;S.toneMapped&&(at===null||at.isXRRenderTarget===!0)&&(_e=i.toneMapping);const Le={shaderID:ct,shaderType:S.type,shaderName:S.name,vertexShader:Jt,fragmentShader:K,defines:S.defines,customVertexShaderID:rt,customFragmentShaderID:bt,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:p,batching:It,batchingColor:It&&U._colorsTexture!==null,instancing:Ot,instancingColor:Ot&&U.instanceColor!==null,instancingMorph:Ot&&U.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:at===null?i.outputColorSpace:at.isXRRenderTarget===!0?at.texture.colorSpace:es,alphaToCoverage:!!S.alphaToCoverage,map:$t,matcap:j,envMap:st,envMapMode:st&&Q.mapping,envMapCubeUVHeight:W,aoMap:D,lightMap:Rt,bumpMap:tt,normalMap:xt,displacementMap:d&&lt,emissiveMap:Lt,normalMapObjectSpace:xt&&S.normalMapType===pf,normalMapTangentSpace:xt&&S.normalMapType===Cl,metalnessMap:_t,roughnessMap:C,anisotropy:b,anisotropyMap:ut,clearcoat:k,clearcoatMap:vt,clearcoatNormalMap:Xt,clearcoatRoughnessMap:nt,dispersion:Y,iridescence:J,iridescenceMap:Mt,iridescenceThicknessMap:Dt,sheen:$,sheenColorMap:Ut,sheenRoughnessMap:St,specularMap:qt,specularColorMap:Vt,specularIntensityMap:re,transmission:wt,transmissionMap:N,thicknessMap:dt,gradientMap:X,opaque:S.transparent===!1&&S.blending===qi&&S.alphaToCoverage===!1,alphaMap:Z,alphaTest:gt,alphaHash:pt,combine:S.combine,mapUv:$t&&x(S.map.channel),aoMapUv:D&&x(S.aoMap.channel),lightMapUv:Rt&&x(S.lightMap.channel),bumpMapUv:tt&&x(S.bumpMap.channel),normalMapUv:xt&&x(S.normalMap.channel),displacementMapUv:lt&&x(S.displacementMap.channel),emissiveMapUv:Lt&&x(S.emissiveMap.channel),metalnessMapUv:_t&&x(S.metalnessMap.channel),roughnessMapUv:C&&x(S.roughnessMap.channel),anisotropyMapUv:ut&&x(S.anisotropyMap.channel),clearcoatMapUv:vt&&x(S.clearcoatMap.channel),clearcoatNormalMapUv:Xt&&x(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:nt&&x(S.clearcoatRoughnessMap.channel),iridescenceMapUv:Mt&&x(S.iridescenceMap.channel),iridescenceThicknessMapUv:Dt&&x(S.iridescenceThicknessMap.channel),sheenColorMapUv:Ut&&x(S.sheenColorMap.channel),sheenRoughnessMapUv:St&&x(S.sheenRoughnessMap.channel),specularMapUv:qt&&x(S.specularMap.channel),specularColorMapUv:Vt&&x(S.specularColorMap.channel),specularIntensityMapUv:re&&x(S.specularIntensityMap.channel),transmissionMapUv:N&&x(S.transmissionMap.channel),thicknessMapUv:dt&&x(S.thicknessMap.channel),alphaMapUv:Z&&x(S.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(xt||b),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!q.attributes.uv&&($t||Z),fog:!!B,useFog:S.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:Pt,skinning:U.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:yt,morphTextureStride:zt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:_e,decodeVideoTexture:$t&&S.map.isVideoTexture===!0&&Yt.getTransfer(S.map.colorSpace)===ne,decodeVideoTextureEmissive:Lt&&S.emissiveMap.isVideoTexture===!0&&Yt.getTransfer(S.emissiveMap.colorSpace)===ne,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===dn,flipSided:S.side===Fe,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:kt&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(kt&&S.extensions.multiDraw===!0||It)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return Le.vertexUv1s=c.has(1),Le.vertexUv2s=c.has(2),Le.vertexUv3s=c.has(3),c.clear(),Le}function f(S){const M=[];if(S.shaderID?M.push(S.shaderID):(M.push(S.customVertexShaderID),M.push(S.customFragmentShaderID)),S.defines!==void 0)for(const R in S.defines)M.push(R),M.push(S.defines[R]);return S.isRawShaderMaterial===!1&&(_(M,S),v(M,S),M.push(i.outputColorSpace)),M.push(S.customProgramCacheKey),M.join()}function _(S,M){S.push(M.precision),S.push(M.outputColorSpace),S.push(M.envMapMode),S.push(M.envMapCubeUVHeight),S.push(M.mapUv),S.push(M.alphaMapUv),S.push(M.lightMapUv),S.push(M.aoMapUv),S.push(M.bumpMapUv),S.push(M.normalMapUv),S.push(M.displacementMapUv),S.push(M.emissiveMapUv),S.push(M.metalnessMapUv),S.push(M.roughnessMapUv),S.push(M.anisotropyMapUv),S.push(M.clearcoatMapUv),S.push(M.clearcoatNormalMapUv),S.push(M.clearcoatRoughnessMapUv),S.push(M.iridescenceMapUv),S.push(M.iridescenceThicknessMapUv),S.push(M.sheenColorMapUv),S.push(M.sheenRoughnessMapUv),S.push(M.specularMapUv),S.push(M.specularColorMapUv),S.push(M.specularIntensityMapUv),S.push(M.transmissionMapUv),S.push(M.thicknessMapUv),S.push(M.combine),S.push(M.fogExp2),S.push(M.sizeAttenuation),S.push(M.morphTargetsCount),S.push(M.morphAttributeCount),S.push(M.numDirLights),S.push(M.numPointLights),S.push(M.numSpotLights),S.push(M.numSpotLightMaps),S.push(M.numHemiLights),S.push(M.numRectAreaLights),S.push(M.numDirLightShadows),S.push(M.numPointLightShadows),S.push(M.numSpotLightShadows),S.push(M.numSpotLightShadowsWithMaps),S.push(M.numLightProbes),S.push(M.shadowMapType),S.push(M.toneMapping),S.push(M.numClippingPlanes),S.push(M.numClipIntersection),S.push(M.depthPacking)}function v(S,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),S.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reverseDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),S.push(a.mask)}function y(S){const M=g[S.type];let R;if(M){const I=un[M];R=so.clone(I.uniforms)}else R=S.uniforms;return R}function w(S,M){let R;for(let I=0,U=h.length;I<U;I++){const B=h[I];if(B.cacheKey===M){R=B,++R.usedTimes;break}}return R===void 0&&(R=new __(i,M,S,r),h.push(R)),R}function E(S){if(--S.usedTimes===0){const M=h.indexOf(S);h[M]=h[h.length-1],h.pop(),S.destroy()}}function A(S){l.remove(S)}function L(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:y,acquireProgram:w,releaseProgram:E,releaseShaderCache:A,programs:h,dispose:L}}function S_(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function b_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function nh(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function ih(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,d,p,g,x,m){let f=i[t];return f===void 0?(f={id:u.id,object:u,geometry:d,material:p,groupOrder:g,renderOrder:u.renderOrder,z:x,group:m},i[t]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=x,f.group=m),t++,f}function a(u,d,p,g,x,m){const f=o(u,d,p,g,x,m);p.transmission>0?n.push(f):p.transparent===!0?s.push(f):e.push(f)}function l(u,d,p,g,x,m){const f=o(u,d,p,g,x,m);p.transmission>0?n.unshift(f):p.transparent===!0?s.unshift(f):e.unshift(f)}function c(u,d){e.length>1&&e.sort(u||b_),n.length>1&&n.sort(d||nh),s.length>1&&s.sort(d||nh)}function h(){for(let u=t,d=i.length;u<d;u++){const p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function w_(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new ih,i.set(n,[o])):s>=r.length?(o=new ih,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function E_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new P,color:new Nt};break;case"SpotLight":e={position:new P,direction:new P,color:new Nt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new P,color:new Nt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new P,skyColor:new Nt,groundColor:new Nt};break;case"RectAreaLight":e={color:new Nt,position:new P,halfWidth:new P,halfHeight:new P};break}return i[t.id]=e,e}}}function T_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new et};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new et};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new et,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let A_=0;function R_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function C_(i){const t=new E_,e=T_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);const s=new P,r=new ae,o=new ae;function a(c){let h=0,u=0,d=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let p=0,g=0,x=0,m=0,f=0,_=0,v=0,y=0,w=0,E=0,A=0;c.sort(R_);for(let S=0,M=c.length;S<M;S++){const R=c[S],I=R.color,U=R.intensity,B=R.distance,q=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)h+=I.r*U,u+=I.g*U,d+=I.b*U;else if(R.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(R.sh.coefficients[H],U);A++}else if(R.isDirectionalLight){const H=t.get(R);if(H.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const Q=R.shadow,W=e.get(R);W.shadowIntensity=Q.intensity,W.shadowBias=Q.bias,W.shadowNormalBias=Q.normalBias,W.shadowRadius=Q.radius,W.shadowMapSize=Q.mapSize,n.directionalShadow[p]=W,n.directionalShadowMap[p]=q,n.directionalShadowMatrix[p]=R.shadow.matrix,_++}n.directional[p]=H,p++}else if(R.isSpotLight){const H=t.get(R);H.position.setFromMatrixPosition(R.matrixWorld),H.color.copy(I).multiplyScalar(U),H.distance=B,H.coneCos=Math.cos(R.angle),H.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),H.decay=R.decay,n.spot[x]=H;const Q=R.shadow;if(R.map&&(n.spotLightMap[w]=R.map,w++,Q.updateMatrices(R),R.castShadow&&E++),n.spotLightMatrix[x]=Q.matrix,R.castShadow){const W=e.get(R);W.shadowIntensity=Q.intensity,W.shadowBias=Q.bias,W.shadowNormalBias=Q.normalBias,W.shadowRadius=Q.radius,W.shadowMapSize=Q.mapSize,n.spotShadow[x]=W,n.spotShadowMap[x]=q,y++}x++}else if(R.isRectAreaLight){const H=t.get(R);H.color.copy(I).multiplyScalar(U),H.halfWidth.set(R.width*.5,0,0),H.halfHeight.set(0,R.height*.5,0),n.rectArea[m]=H,m++}else if(R.isPointLight){const H=t.get(R);if(H.color.copy(R.color).multiplyScalar(R.intensity),H.distance=R.distance,H.decay=R.decay,R.castShadow){const Q=R.shadow,W=e.get(R);W.shadowIntensity=Q.intensity,W.shadowBias=Q.bias,W.shadowNormalBias=Q.normalBias,W.shadowRadius=Q.radius,W.shadowMapSize=Q.mapSize,W.shadowCameraNear=Q.camera.near,W.shadowCameraFar=Q.camera.far,n.pointShadow[g]=W,n.pointShadowMap[g]=q,n.pointShadowMatrix[g]=R.shadow.matrix,v++}n.point[g]=H,g++}else if(R.isHemisphereLight){const H=t.get(R);H.skyColor.copy(R.color).multiplyScalar(U),H.groundColor.copy(R.groundColor).multiplyScalar(U),n.hemi[f]=H,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ht.LTC_FLOAT_1,n.rectAreaLTC2=ht.LTC_FLOAT_2):(n.rectAreaLTC1=ht.LTC_HALF_1,n.rectAreaLTC2=ht.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const L=n.hash;(L.directionalLength!==p||L.pointLength!==g||L.spotLength!==x||L.rectAreaLength!==m||L.hemiLength!==f||L.numDirectionalShadows!==_||L.numPointShadows!==v||L.numSpotShadows!==y||L.numSpotMaps!==w||L.numLightProbes!==A)&&(n.directional.length=p,n.spot.length=x,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=_,n.directionalShadowMap.length=_,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=_,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=y+w-E,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=A,L.directionalLength=p,L.pointLength=g,L.spotLength=x,L.rectAreaLength=m,L.hemiLength=f,L.numDirectionalShadows=_,L.numPointShadows=v,L.numSpotShadows=y,L.numSpotMaps=w,L.numLightProbes=A,n.version=A_++)}function l(c,h){let u=0,d=0,p=0,g=0,x=0;const m=h.matrixWorldInverse;for(let f=0,_=c.length;f<_;f++){const v=c[f];if(v.isDirectionalLight){const y=n.directional[u];y.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),u++}else if(v.isSpotLight){const y=n.spot[p];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),p++}else if(v.isRectAreaLight){const y=n.rectArea[g];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),o.identity(),r.copy(v.matrixWorld),r.premultiply(m),o.extractRotation(r),y.halfWidth.set(v.width*.5,0,0),y.halfHeight.set(0,v.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(v.isPointLight){const y=n.point[d];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),d++}else if(v.isHemisphereLight){const y=n.hemi[x];y.direction.setFromMatrixPosition(v.matrixWorld),y.direction.transformDirection(m),x++}}}return{setup:a,setupView:l,state:n}}function sh(i){const t=new C_(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function P_(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new sh(i),t.set(s,[a])):r>=o.length?(a=new sh(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class L_ extends Jn{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=df,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class D_ extends Jn{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const I_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,U_=`uniform sampler2D shadow_pass;
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
}`;function N_(i,t,e){let n=new Ll;const s=new et,r=new et,o=new pe,a=new L_({depthPacking:ff}),l=new D_,c={},h=e.maxTextureSize,u={[Zn]:Fe,[Fe]:Zn,[dn]:dn},d=new Ye({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new et},radius:{value:4}},vertexShader:I_,fragmentShader:U_}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const g=new Ae;g.setAttribute("position",new Ge(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Kt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=vu;let f=this.type;this.render=function(E,A,L){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;const S=i.getRenderTarget(),M=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),I=i.state;I.setBlending(In),I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const U=f!==An&&this.type===An,B=f===An&&this.type!==An;for(let q=0,H=E.length;q<H;q++){const Q=E[q],W=Q.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",Q,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);const ct=W.getFrameExtents();if(s.multiply(ct),r.copy(W.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ct.x),s.x=r.x*ct.x,W.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ct.y),s.y=r.y*ct.y,W.mapSize.y=r.y)),W.map===null||U===!0||B===!0){const yt=this.type!==An?{minFilter:be,magFilter:be}:{};W.map!==null&&W.map.dispose(),W.map=new gn(s.x,s.y,yt),W.map.texture.name=Q.name+".shadowMap",W.camera.updateProjectionMatrix()}i.setRenderTarget(W.map),i.clear();const ft=W.getViewportCount();for(let yt=0;yt<ft;yt++){const zt=W.getViewport(yt);o.set(r.x*zt.x,r.y*zt.y,r.x*zt.z,r.y*zt.w),I.viewport(o),W.updateMatrices(Q,yt),n=W.getFrustum(),y(A,L,W.camera,Q,this.type)}W.isPointLightShadow!==!0&&this.type===An&&_(W,L),W.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(S,M,R)};function _(E,A){const L=t.update(x);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,p.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new gn(s.x,s.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(A,null,L,d,x,null),p.uniforms.shadow_pass.value=E.mapPass.texture,p.uniforms.resolution.value=E.mapSize,p.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(A,null,L,p,x,null)}function v(E,A,L,S){let M=null;const R=L.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(R!==void 0)M=R;else if(M=L.isPointLight===!0?l:a,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const I=M.uuid,U=A.uuid;let B=c[I];B===void 0&&(B={},c[I]=B);let q=B[U];q===void 0&&(q=M.clone(),B[U]=q,A.addEventListener("dispose",w)),M=q}if(M.visible=A.visible,M.wireframe=A.wireframe,S===An?M.side=A.shadowSide!==null?A.shadowSide:A.side:M.side=A.shadowSide!==null?A.shadowSide:u[A.side],M.alphaMap=A.alphaMap,M.alphaTest=A.alphaTest,M.map=A.map,M.clipShadows=A.clipShadows,M.clippingPlanes=A.clippingPlanes,M.clipIntersection=A.clipIntersection,M.displacementMap=A.displacementMap,M.displacementScale=A.displacementScale,M.displacementBias=A.displacementBias,M.wireframeLinewidth=A.wireframeLinewidth,M.linewidth=A.linewidth,L.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const I=i.properties.get(M);I.light=L}return M}function y(E,A,L,S,M){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&M===An)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,E.matrixWorld);const U=t.update(E),B=E.material;if(Array.isArray(B)){const q=U.groups;for(let H=0,Q=q.length;H<Q;H++){const W=q[H],ct=B[W.materialIndex];if(ct&&ct.visible){const ft=v(E,ct,S,M);E.onBeforeShadow(i,E,A,L,U,ft,W),i.renderBufferDirect(L,null,U,ft,E,W),E.onAfterShadow(i,E,A,L,U,ft,W)}}}else if(B.visible){const q=v(E,B,S,M);E.onBeforeShadow(i,E,A,L,U,q,null),i.renderBufferDirect(L,null,U,q,E,null),E.onAfterShadow(i,E,A,L,U,q,null)}}const I=E.children;for(let U=0,B=I.length;U<B;U++)y(I[U],A,L,S,M)}function w(E){E.target.removeEventListener("dispose",w);for(const L in c){const S=c[L],M=E.target.uuid;M in S&&(S[M].dispose(),delete S[M])}}}const O_={[Ta]:Aa,[Ra]:La,[Ca]:Da,[Ki]:Pa,[Aa]:Ta,[La]:Ra,[Da]:Ca,[Pa]:Ki};function F_(i,t){function e(){let N=!1;const dt=new pe;let X=null;const Z=new pe(0,0,0,0);return{setMask:function(gt){X!==gt&&!N&&(i.colorMask(gt,gt,gt,gt),X=gt)},setLocked:function(gt){N=gt},setClear:function(gt,pt,kt,_e,Le){Le===!0&&(gt*=_e,pt*=_e,kt*=_e),dt.set(gt,pt,kt,_e),Z.equals(dt)===!1&&(i.clearColor(gt,pt,kt,_e),Z.copy(dt))},reset:function(){N=!1,X=null,Z.set(-1,0,0,0)}}}function n(){let N=!1,dt=!1,X=null,Z=null,gt=null;return{setReversed:function(pt){if(dt!==pt){const kt=t.get("EXT_clip_control");dt?kt.clipControlEXT(kt.LOWER_LEFT_EXT,kt.ZERO_TO_ONE_EXT):kt.clipControlEXT(kt.LOWER_LEFT_EXT,kt.NEGATIVE_ONE_TO_ONE_EXT);const _e=gt;gt=null,this.setClear(_e)}dt=pt},getReversed:function(){return dt},setTest:function(pt){pt?at(i.DEPTH_TEST):Pt(i.DEPTH_TEST)},setMask:function(pt){X!==pt&&!N&&(i.depthMask(pt),X=pt)},setFunc:function(pt){if(dt&&(pt=O_[pt]),Z!==pt){switch(pt){case Ta:i.depthFunc(i.NEVER);break;case Aa:i.depthFunc(i.ALWAYS);break;case Ra:i.depthFunc(i.LESS);break;case Ki:i.depthFunc(i.LEQUAL);break;case Ca:i.depthFunc(i.EQUAL);break;case Pa:i.depthFunc(i.GEQUAL);break;case La:i.depthFunc(i.GREATER);break;case Da:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Z=pt}},setLocked:function(pt){N=pt},setClear:function(pt){gt!==pt&&(dt&&(pt=1-pt),i.clearDepth(pt),gt=pt)},reset:function(){N=!1,X=null,Z=null,gt=null,dt=!1}}}function s(){let N=!1,dt=null,X=null,Z=null,gt=null,pt=null,kt=null,_e=null,Le=null;return{setTest:function(ee){N||(ee?at(i.STENCIL_TEST):Pt(i.STENCIL_TEST))},setMask:function(ee){dt!==ee&&!N&&(i.stencilMask(ee),dt=ee)},setFunc:function(ee,Qe,xn){(X!==ee||Z!==Qe||gt!==xn)&&(i.stencilFunc(ee,Qe,xn),X=ee,Z=Qe,gt=xn)},setOp:function(ee,Qe,xn){(pt!==ee||kt!==Qe||_e!==xn)&&(i.stencilOp(ee,Qe,xn),pt=ee,kt=Qe,_e=xn)},setLocked:function(ee){N=ee},setClear:function(ee){Le!==ee&&(i.clearStencil(ee),Le=ee)},reset:function(){N=!1,dt=null,X=null,Z=null,gt=null,pt=null,kt=null,_e=null,Le=null}}}const r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap;let h={},u={},d=new WeakMap,p=[],g=null,x=!1,m=null,f=null,_=null,v=null,y=null,w=null,E=null,A=new Nt(0,0,0),L=0,S=!1,M=null,R=null,I=null,U=null,B=null;const q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,Q=0;const W=i.getParameter(i.VERSION);W.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(W)[1]),H=Q>=1):W.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),H=Q>=2);let ct=null,ft={};const yt=i.getParameter(i.SCISSOR_BOX),zt=i.getParameter(i.VIEWPORT),Jt=new pe().fromArray(yt),K=new pe().fromArray(zt);function rt(N,dt,X,Z){const gt=new Uint8Array(4),pt=i.createTexture();i.bindTexture(N,pt),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let kt=0;kt<X;kt++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(dt,0,i.RGBA,1,1,Z,0,i.RGBA,i.UNSIGNED_BYTE,gt):i.texImage2D(dt+kt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,gt);return pt}const bt={};bt[i.TEXTURE_2D]=rt(i.TEXTURE_2D,i.TEXTURE_2D,1),bt[i.TEXTURE_CUBE_MAP]=rt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),bt[i.TEXTURE_2D_ARRAY]=rt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),bt[i.TEXTURE_3D]=rt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),at(i.DEPTH_TEST),o.setFunc(Ki),tt(!1),xt(ac),at(i.CULL_FACE),D(In);function at(N){h[N]!==!0&&(i.enable(N),h[N]=!0)}function Pt(N){h[N]!==!1&&(i.disable(N),h[N]=!1)}function Ot(N,dt){return u[N]!==dt?(i.bindFramebuffer(N,dt),u[N]=dt,N===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=dt),N===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=dt),!0):!1}function It(N,dt){let X=p,Z=!1;if(N){X=d.get(dt),X===void 0&&(X=[],d.set(dt,X));const gt=N.textures;if(X.length!==gt.length||X[0]!==i.COLOR_ATTACHMENT0){for(let pt=0,kt=gt.length;pt<kt;pt++)X[pt]=i.COLOR_ATTACHMENT0+pt;X.length=gt.length,Z=!0}}else X[0]!==i.BACK&&(X[0]=i.BACK,Z=!0);Z&&i.drawBuffers(X)}function $t(N){return g!==N?(i.useProgram(N),g=N,!0):!1}const j={[ci]:i.FUNC_ADD,[Wd]:i.FUNC_SUBTRACT,[Xd]:i.FUNC_REVERSE_SUBTRACT};j[qd]=i.MIN,j[Yd]=i.MAX;const st={[$d]:i.ZERO,[Kd]:i.ONE,[Zd]:i.SRC_COLOR,[wa]:i.SRC_ALPHA,[nf]:i.SRC_ALPHA_SATURATE,[tf]:i.DST_COLOR,[Jd]:i.DST_ALPHA,[jd]:i.ONE_MINUS_SRC_COLOR,[Ea]:i.ONE_MINUS_SRC_ALPHA,[ef]:i.ONE_MINUS_DST_COLOR,[Qd]:i.ONE_MINUS_DST_ALPHA,[sf]:i.CONSTANT_COLOR,[rf]:i.ONE_MINUS_CONSTANT_COLOR,[of]:i.CONSTANT_ALPHA,[af]:i.ONE_MINUS_CONSTANT_ALPHA};function D(N,dt,X,Z,gt,pt,kt,_e,Le,ee){if(N===In){x===!0&&(Pt(i.BLEND),x=!1);return}if(x===!1&&(at(i.BLEND),x=!0),N!==Vd){if(N!==m||ee!==S){if((f!==ci||y!==ci)&&(i.blendEquation(i.FUNC_ADD),f=ci,y=ci),ee)switch(N){case qi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case lc:i.blendFunc(i.ONE,i.ONE);break;case cc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case hc:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case qi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case lc:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case cc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case hc:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}_=null,v=null,w=null,E=null,A.set(0,0,0),L=0,m=N,S=ee}return}gt=gt||dt,pt=pt||X,kt=kt||Z,(dt!==f||gt!==y)&&(i.blendEquationSeparate(j[dt],j[gt]),f=dt,y=gt),(X!==_||Z!==v||pt!==w||kt!==E)&&(i.blendFuncSeparate(st[X],st[Z],st[pt],st[kt]),_=X,v=Z,w=pt,E=kt),(_e.equals(A)===!1||Le!==L)&&(i.blendColor(_e.r,_e.g,_e.b,Le),A.copy(_e),L=Le),m=N,S=!1}function Rt(N,dt){N.side===dn?Pt(i.CULL_FACE):at(i.CULL_FACE);let X=N.side===Fe;dt&&(X=!X),tt(X),N.blending===qi&&N.transparent===!1?D(In):D(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),r.setMask(N.colorWrite);const Z=N.stencilWrite;a.setTest(Z),Z&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Lt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?at(i.SAMPLE_ALPHA_TO_COVERAGE):Pt(i.SAMPLE_ALPHA_TO_COVERAGE)}function tt(N){M!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),M=N)}function xt(N){N!==kd?(at(i.CULL_FACE),N!==R&&(N===ac?i.cullFace(i.BACK):N===Hd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Pt(i.CULL_FACE),R=N}function lt(N){N!==I&&(H&&i.lineWidth(N),I=N)}function Lt(N,dt,X){N?(at(i.POLYGON_OFFSET_FILL),(U!==dt||B!==X)&&(i.polygonOffset(dt,X),U=dt,B=X)):Pt(i.POLYGON_OFFSET_FILL)}function _t(N){N?at(i.SCISSOR_TEST):Pt(i.SCISSOR_TEST)}function C(N){N===void 0&&(N=i.TEXTURE0+q-1),ct!==N&&(i.activeTexture(N),ct=N)}function b(N,dt,X){X===void 0&&(ct===null?X=i.TEXTURE0+q-1:X=ct);let Z=ft[X];Z===void 0&&(Z={type:void 0,texture:void 0},ft[X]=Z),(Z.type!==N||Z.texture!==dt)&&(ct!==X&&(i.activeTexture(X),ct=X),i.bindTexture(N,dt||bt[N]),Z.type=N,Z.texture=dt)}function k(){const N=ft[ct];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function Y(){try{i.compressedTexImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function J(){try{i.compressedTexImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function $(){try{i.texSubImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function wt(){try{i.texSubImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ut(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function vt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Xt(){try{i.texStorage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function nt(){try{i.texStorage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Mt(){try{i.texImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Dt(){try{i.texImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ut(N){Jt.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),Jt.copy(N))}function St(N){K.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),K.copy(N))}function qt(N,dt){let X=c.get(dt);X===void 0&&(X=new WeakMap,c.set(dt,X));let Z=X.get(N);Z===void 0&&(Z=i.getUniformBlockIndex(dt,N.name),X.set(N,Z))}function Vt(N,dt){const Z=c.get(dt).get(N);l.get(dt)!==Z&&(i.uniformBlockBinding(dt,Z,N.__bindingPointIndex),l.set(dt,Z))}function re(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},ct=null,ft={},u={},d=new WeakMap,p=[],g=null,x=!1,m=null,f=null,_=null,v=null,y=null,w=null,E=null,A=new Nt(0,0,0),L=0,S=!1,M=null,R=null,I=null,U=null,B=null,Jt.set(0,0,i.canvas.width,i.canvas.height),K.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:at,disable:Pt,bindFramebuffer:Ot,drawBuffers:It,useProgram:$t,setBlending:D,setMaterial:Rt,setFlipSided:tt,setCullFace:xt,setLineWidth:lt,setPolygonOffset:Lt,setScissorTest:_t,activeTexture:C,bindTexture:b,unbindTexture:k,compressedTexImage2D:Y,compressedTexImage3D:J,texImage2D:Mt,texImage3D:Dt,updateUBOMapping:qt,uniformBlockBinding:Vt,texStorage2D:Xt,texStorage3D:nt,texSubImage2D:$,texSubImage3D:wt,compressedTexSubImage2D:ut,compressedTexSubImage3D:vt,scissor:Ut,viewport:St,reset:re}}function rh(i,t,e,n){const s=B_(n);switch(e){case Cu:return i*t;case Lu:return i*t;case Du:return i*t*2;case El:return i*t/s.components*s.byteLength;case Tl:return i*t/s.components*s.byteLength;case Iu:return i*t*2/s.components*s.byteLength;case Al:return i*t*2/s.components*s.byteLength;case Pu:return i*t*3/s.components*s.byteLength;case on:return i*t*4/s.components*s.byteLength;case Rl:return i*t*4/s.components*s.byteLength;case zr:case kr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Hr:case Gr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Fa:case za:return Math.max(i,16)*Math.max(t,8)/4;case Oa:case Ba:return Math.max(i,8)*Math.max(t,8)/2;case ka:case Ha:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ga:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Va:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Wa:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Xa:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case qa:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Ya:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case $a:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Ka:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Za:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case ja:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Ja:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Qa:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case tl:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case el:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case nl:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Vr:case il:case sl:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Uu:case rl:return Math.ceil(i/4)*Math.ceil(t/4)*8;case ol:case al:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function B_(i){switch(i){case Nn:case Tu:return{byteLength:1,components:1};case Us:case Au:case jn:return{byteLength:2,components:1};case bl:case wl:return{byteLength:2,components:4};case pi:case Sl:case Pn:return{byteLength:4,components:1};case Ru:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function z_(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new et,h=new WeakMap;let u;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,b){return p?new OffscreenCanvas(C,b):qr("canvas")}function x(C,b,k){let Y=1;const J=_t(C);if((J.width>k||J.height>k)&&(Y=k/Math.max(J.width,J.height)),Y<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const $=Math.floor(Y*J.width),wt=Math.floor(Y*J.height);u===void 0&&(u=g($,wt));const ut=b?g($,wt):u;return ut.width=$,ut.height=wt,ut.getContext("2d").drawImage(C,0,0,$,wt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+$+"x"+wt+")."),ut}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),C;return C}function m(C){return C.generateMipmaps}function f(C){i.generateMipmap(C)}function _(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(C,b,k,Y,J=!1){if(C!==null){if(i[C]!==void 0)return i[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let $=b;if(b===i.RED&&(k===i.FLOAT&&($=i.R32F),k===i.HALF_FLOAT&&($=i.R16F),k===i.UNSIGNED_BYTE&&($=i.R8)),b===i.RED_INTEGER&&(k===i.UNSIGNED_BYTE&&($=i.R8UI),k===i.UNSIGNED_SHORT&&($=i.R16UI),k===i.UNSIGNED_INT&&($=i.R32UI),k===i.BYTE&&($=i.R8I),k===i.SHORT&&($=i.R16I),k===i.INT&&($=i.R32I)),b===i.RG&&(k===i.FLOAT&&($=i.RG32F),k===i.HALF_FLOAT&&($=i.RG16F),k===i.UNSIGNED_BYTE&&($=i.RG8)),b===i.RG_INTEGER&&(k===i.UNSIGNED_BYTE&&($=i.RG8UI),k===i.UNSIGNED_SHORT&&($=i.RG16UI),k===i.UNSIGNED_INT&&($=i.RG32UI),k===i.BYTE&&($=i.RG8I),k===i.SHORT&&($=i.RG16I),k===i.INT&&($=i.RG32I)),b===i.RGB_INTEGER&&(k===i.UNSIGNED_BYTE&&($=i.RGB8UI),k===i.UNSIGNED_SHORT&&($=i.RGB16UI),k===i.UNSIGNED_INT&&($=i.RGB32UI),k===i.BYTE&&($=i.RGB8I),k===i.SHORT&&($=i.RGB16I),k===i.INT&&($=i.RGB32I)),b===i.RGBA_INTEGER&&(k===i.UNSIGNED_BYTE&&($=i.RGBA8UI),k===i.UNSIGNED_SHORT&&($=i.RGBA16UI),k===i.UNSIGNED_INT&&($=i.RGBA32UI),k===i.BYTE&&($=i.RGBA8I),k===i.SHORT&&($=i.RGBA16I),k===i.INT&&($=i.RGBA32I)),b===i.RGB&&k===i.UNSIGNED_INT_5_9_9_9_REV&&($=i.RGB9_E5),b===i.RGBA){const wt=J?eo:Yt.getTransfer(Y);k===i.FLOAT&&($=i.RGBA32F),k===i.HALF_FLOAT&&($=i.RGBA16F),k===i.UNSIGNED_BYTE&&($=wt===ne?i.SRGB8_ALPHA8:i.RGBA8),k===i.UNSIGNED_SHORT_4_4_4_4&&($=i.RGBA4),k===i.UNSIGNED_SHORT_5_5_5_1&&($=i.RGB5_A1)}return($===i.R16F||$===i.R32F||$===i.RG16F||$===i.RG32F||$===i.RGBA16F||$===i.RGBA32F)&&t.get("EXT_color_buffer_float"),$}function y(C,b){let k;return C?b===null||b===pi||b===Ji?k=i.DEPTH24_STENCIL8:b===Pn?k=i.DEPTH32F_STENCIL8:b===Us&&(k=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===pi||b===Ji?k=i.DEPTH_COMPONENT24:b===Pn?k=i.DEPTH_COMPONENT32F:b===Us&&(k=i.DEPTH_COMPONENT16),k}function w(C,b){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==be&&C.minFilter!==fn?Math.log2(Math.max(b.width,b.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?b.mipmaps.length:1}function E(C){const b=C.target;b.removeEventListener("dispose",E),L(b),b.isVideoTexture&&h.delete(b)}function A(C){const b=C.target;b.removeEventListener("dispose",A),M(b)}function L(C){const b=n.get(C);if(b.__webglInit===void 0)return;const k=C.source,Y=d.get(k);if(Y){const J=Y[b.__cacheKey];J.usedTimes--,J.usedTimes===0&&S(C),Object.keys(Y).length===0&&d.delete(k)}n.remove(C)}function S(C){const b=n.get(C);i.deleteTexture(b.__webglTexture);const k=C.source,Y=d.get(k);delete Y[b.__cacheKey],o.memory.textures--}function M(C){const b=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(b.__webglFramebuffer[Y]))for(let J=0;J<b.__webglFramebuffer[Y].length;J++)i.deleteFramebuffer(b.__webglFramebuffer[Y][J]);else i.deleteFramebuffer(b.__webglFramebuffer[Y]);b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer[Y])}else{if(Array.isArray(b.__webglFramebuffer))for(let Y=0;Y<b.__webglFramebuffer.length;Y++)i.deleteFramebuffer(b.__webglFramebuffer[Y]);else i.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&i.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let Y=0;Y<b.__webglColorRenderbuffer.length;Y++)b.__webglColorRenderbuffer[Y]&&i.deleteRenderbuffer(b.__webglColorRenderbuffer[Y]);b.__webglDepthRenderbuffer&&i.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const k=C.textures;for(let Y=0,J=k.length;Y<J;Y++){const $=n.get(k[Y]);$.__webglTexture&&(i.deleteTexture($.__webglTexture),o.memory.textures--),n.remove(k[Y])}n.remove(C)}let R=0;function I(){R=0}function U(){const C=R;return C>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+s.maxTextures),R+=1,C}function B(C){const b=[];return b.push(C.wrapS),b.push(C.wrapT),b.push(C.wrapR||0),b.push(C.magFilter),b.push(C.minFilter),b.push(C.anisotropy),b.push(C.internalFormat),b.push(C.format),b.push(C.type),b.push(C.generateMipmaps),b.push(C.premultiplyAlpha),b.push(C.flipY),b.push(C.unpackAlignment),b.push(C.colorSpace),b.join()}function q(C,b){const k=n.get(C);if(C.isVideoTexture&&lt(C),C.isRenderTargetTexture===!1&&C.version>0&&k.__version!==C.version){const Y=C.image;if(Y===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{K(k,C,b);return}}e.bindTexture(i.TEXTURE_2D,k.__webglTexture,i.TEXTURE0+b)}function H(C,b){const k=n.get(C);if(C.version>0&&k.__version!==C.version){K(k,C,b);return}e.bindTexture(i.TEXTURE_2D_ARRAY,k.__webglTexture,i.TEXTURE0+b)}function Q(C,b){const k=n.get(C);if(C.version>0&&k.__version!==C.version){K(k,C,b);return}e.bindTexture(i.TEXTURE_3D,k.__webglTexture,i.TEXTURE0+b)}function W(C,b){const k=n.get(C);if(C.version>0&&k.__version!==C.version){rt(k,C,b);return}e.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture,i.TEXTURE0+b)}const ct={[Is]:i.REPEAT,[ui]:i.CLAMP_TO_EDGE,[Na]:i.MIRRORED_REPEAT},ft={[be]:i.NEAREST,[uf]:i.NEAREST_MIPMAP_NEAREST,[$s]:i.NEAREST_MIPMAP_LINEAR,[fn]:i.LINEAR,[mo]:i.LINEAR_MIPMAP_NEAREST,[di]:i.LINEAR_MIPMAP_LINEAR},yt={[mf]:i.NEVER,[Mf]:i.ALWAYS,[gf]:i.LESS,[Nu]:i.LEQUAL,[_f]:i.EQUAL,[yf]:i.GEQUAL,[vf]:i.GREATER,[xf]:i.NOTEQUAL};function zt(C,b){if(b.type===Pn&&t.has("OES_texture_float_linear")===!1&&(b.magFilter===fn||b.magFilter===mo||b.magFilter===$s||b.magFilter===di||b.minFilter===fn||b.minFilter===mo||b.minFilter===$s||b.minFilter===di)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,ct[b.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,ct[b.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,ct[b.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,ft[b.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,ft[b.minFilter]),b.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,yt[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===be||b.minFilter!==$s&&b.minFilter!==di||b.type===Pn&&t.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){const k=t.get("EXT_texture_filter_anisotropic");i.texParameterf(C,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function Jt(C,b){let k=!1;C.__webglInit===void 0&&(C.__webglInit=!0,b.addEventListener("dispose",E));const Y=b.source;let J=d.get(Y);J===void 0&&(J={},d.set(Y,J));const $=B(b);if($!==C.__cacheKey){J[$]===void 0&&(J[$]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,k=!0),J[$].usedTimes++;const wt=J[C.__cacheKey];wt!==void 0&&(J[C.__cacheKey].usedTimes--,wt.usedTimes===0&&S(b)),C.__cacheKey=$,C.__webglTexture=J[$].texture}return k}function K(C,b,k){let Y=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(Y=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&(Y=i.TEXTURE_3D);const J=Jt(C,b),$=b.source;e.bindTexture(Y,C.__webglTexture,i.TEXTURE0+k);const wt=n.get($);if($.version!==wt.__version||J===!0){e.activeTexture(i.TEXTURE0+k);const ut=Yt.getPrimaries(Yt.workingColorSpace),vt=b.colorSpace===qn?null:Yt.getPrimaries(b.colorSpace),Xt=b.colorSpace===qn||ut===vt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Xt);let nt=x(b.image,!1,s.maxTextureSize);nt=Lt(b,nt);const Mt=r.convert(b.format,b.colorSpace),Dt=r.convert(b.type);let Ut=v(b.internalFormat,Mt,Dt,b.colorSpace,b.isVideoTexture);zt(Y,b);let St;const qt=b.mipmaps,Vt=b.isVideoTexture!==!0,re=wt.__version===void 0||J===!0,N=$.dataReady,dt=w(b,nt);if(b.isDepthTexture)Ut=y(b.format===Qi,b.type),re&&(Vt?e.texStorage2D(i.TEXTURE_2D,1,Ut,nt.width,nt.height):e.texImage2D(i.TEXTURE_2D,0,Ut,nt.width,nt.height,0,Mt,Dt,null));else if(b.isDataTexture)if(qt.length>0){Vt&&re&&e.texStorage2D(i.TEXTURE_2D,dt,Ut,qt[0].width,qt[0].height);for(let X=0,Z=qt.length;X<Z;X++)St=qt[X],Vt?N&&e.texSubImage2D(i.TEXTURE_2D,X,0,0,St.width,St.height,Mt,Dt,St.data):e.texImage2D(i.TEXTURE_2D,X,Ut,St.width,St.height,0,Mt,Dt,St.data);b.generateMipmaps=!1}else Vt?(re&&e.texStorage2D(i.TEXTURE_2D,dt,Ut,nt.width,nt.height),N&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,nt.width,nt.height,Mt,Dt,nt.data)):e.texImage2D(i.TEXTURE_2D,0,Ut,nt.width,nt.height,0,Mt,Dt,nt.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){Vt&&re&&e.texStorage3D(i.TEXTURE_2D_ARRAY,dt,Ut,qt[0].width,qt[0].height,nt.depth);for(let X=0,Z=qt.length;X<Z;X++)if(St=qt[X],b.format!==on)if(Mt!==null)if(Vt){if(N)if(b.layerUpdates.size>0){const gt=rh(St.width,St.height,b.format,b.type);for(const pt of b.layerUpdates){const kt=St.data.subarray(pt*gt/St.data.BYTES_PER_ELEMENT,(pt+1)*gt/St.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,X,0,0,pt,St.width,St.height,1,Mt,kt)}b.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,X,0,0,0,St.width,St.height,nt.depth,Mt,St.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,X,Ut,St.width,St.height,nt.depth,0,St.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Vt?N&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,X,0,0,0,St.width,St.height,nt.depth,Mt,Dt,St.data):e.texImage3D(i.TEXTURE_2D_ARRAY,X,Ut,St.width,St.height,nt.depth,0,Mt,Dt,St.data)}else{Vt&&re&&e.texStorage2D(i.TEXTURE_2D,dt,Ut,qt[0].width,qt[0].height);for(let X=0,Z=qt.length;X<Z;X++)St=qt[X],b.format!==on?Mt!==null?Vt?N&&e.compressedTexSubImage2D(i.TEXTURE_2D,X,0,0,St.width,St.height,Mt,St.data):e.compressedTexImage2D(i.TEXTURE_2D,X,Ut,St.width,St.height,0,St.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Vt?N&&e.texSubImage2D(i.TEXTURE_2D,X,0,0,St.width,St.height,Mt,Dt,St.data):e.texImage2D(i.TEXTURE_2D,X,Ut,St.width,St.height,0,Mt,Dt,St.data)}else if(b.isDataArrayTexture)if(Vt){if(re&&e.texStorage3D(i.TEXTURE_2D_ARRAY,dt,Ut,nt.width,nt.height,nt.depth),N)if(b.layerUpdates.size>0){const X=rh(nt.width,nt.height,b.format,b.type);for(const Z of b.layerUpdates){const gt=nt.data.subarray(Z*X/nt.data.BYTES_PER_ELEMENT,(Z+1)*X/nt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Z,nt.width,nt.height,1,Mt,Dt,gt)}b.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,Mt,Dt,nt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ut,nt.width,nt.height,nt.depth,0,Mt,Dt,nt.data);else if(b.isData3DTexture)Vt?(re&&e.texStorage3D(i.TEXTURE_3D,dt,Ut,nt.width,nt.height,nt.depth),N&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,Mt,Dt,nt.data)):e.texImage3D(i.TEXTURE_3D,0,Ut,nt.width,nt.height,nt.depth,0,Mt,Dt,nt.data);else if(b.isFramebufferTexture){if(re)if(Vt)e.texStorage2D(i.TEXTURE_2D,dt,Ut,nt.width,nt.height);else{let X=nt.width,Z=nt.height;for(let gt=0;gt<dt;gt++)e.texImage2D(i.TEXTURE_2D,gt,Ut,X,Z,0,Mt,Dt,null),X>>=1,Z>>=1}}else if(qt.length>0){if(Vt&&re){const X=_t(qt[0]);e.texStorage2D(i.TEXTURE_2D,dt,Ut,X.width,X.height)}for(let X=0,Z=qt.length;X<Z;X++)St=qt[X],Vt?N&&e.texSubImage2D(i.TEXTURE_2D,X,0,0,Mt,Dt,St):e.texImage2D(i.TEXTURE_2D,X,Ut,Mt,Dt,St);b.generateMipmaps=!1}else if(Vt){if(re){const X=_t(nt);e.texStorage2D(i.TEXTURE_2D,dt,Ut,X.width,X.height)}N&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Mt,Dt,nt)}else e.texImage2D(i.TEXTURE_2D,0,Ut,Mt,Dt,nt);m(b)&&f(Y),wt.__version=$.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function rt(C,b,k){if(b.image.length!==6)return;const Y=Jt(C,b),J=b.source;e.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+k);const $=n.get(J);if(J.version!==$.__version||Y===!0){e.activeTexture(i.TEXTURE0+k);const wt=Yt.getPrimaries(Yt.workingColorSpace),ut=b.colorSpace===qn?null:Yt.getPrimaries(b.colorSpace),vt=b.colorSpace===qn||wt===ut?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);const Xt=b.isCompressedTexture||b.image[0].isCompressedTexture,nt=b.image[0]&&b.image[0].isDataTexture,Mt=[];for(let Z=0;Z<6;Z++)!Xt&&!nt?Mt[Z]=x(b.image[Z],!0,s.maxCubemapSize):Mt[Z]=nt?b.image[Z].image:b.image[Z],Mt[Z]=Lt(b,Mt[Z]);const Dt=Mt[0],Ut=r.convert(b.format,b.colorSpace),St=r.convert(b.type),qt=v(b.internalFormat,Ut,St,b.colorSpace),Vt=b.isVideoTexture!==!0,re=$.__version===void 0||Y===!0,N=J.dataReady;let dt=w(b,Dt);zt(i.TEXTURE_CUBE_MAP,b);let X;if(Xt){Vt&&re&&e.texStorage2D(i.TEXTURE_CUBE_MAP,dt,qt,Dt.width,Dt.height);for(let Z=0;Z<6;Z++){X=Mt[Z].mipmaps;for(let gt=0;gt<X.length;gt++){const pt=X[gt];b.format!==on?Ut!==null?Vt?N&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,gt,0,0,pt.width,pt.height,Ut,pt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,gt,qt,pt.width,pt.height,0,pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Vt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,gt,0,0,pt.width,pt.height,Ut,St,pt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,gt,qt,pt.width,pt.height,0,Ut,St,pt.data)}}}else{if(X=b.mipmaps,Vt&&re){X.length>0&&dt++;const Z=_t(Mt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,dt,qt,Z.width,Z.height)}for(let Z=0;Z<6;Z++)if(nt){Vt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,Mt[Z].width,Mt[Z].height,Ut,St,Mt[Z].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,qt,Mt[Z].width,Mt[Z].height,0,Ut,St,Mt[Z].data);for(let gt=0;gt<X.length;gt++){const kt=X[gt].image[Z].image;Vt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,gt+1,0,0,kt.width,kt.height,Ut,St,kt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,gt+1,qt,kt.width,kt.height,0,Ut,St,kt.data)}}else{Vt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,Ut,St,Mt[Z]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,qt,Ut,St,Mt[Z]);for(let gt=0;gt<X.length;gt++){const pt=X[gt];Vt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,gt+1,0,0,Ut,St,pt.image[Z]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,gt+1,qt,Ut,St,pt.image[Z])}}}m(b)&&f(i.TEXTURE_CUBE_MAP),$.__version=J.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function bt(C,b,k,Y,J,$){const wt=r.convert(k.format,k.colorSpace),ut=r.convert(k.type),vt=v(k.internalFormat,wt,ut,k.colorSpace),Xt=n.get(b),nt=n.get(k);if(nt.__renderTarget=b,!Xt.__hasExternalTextures){const Mt=Math.max(1,b.width>>$),Dt=Math.max(1,b.height>>$);J===i.TEXTURE_3D||J===i.TEXTURE_2D_ARRAY?e.texImage3D(J,$,vt,Mt,Dt,b.depth,0,wt,ut,null):e.texImage2D(J,$,vt,Mt,Dt,0,wt,ut,null)}e.bindFramebuffer(i.FRAMEBUFFER,C),xt(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Y,J,nt.__webglTexture,0,tt(b)):(J===i.TEXTURE_2D||J>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Y,J,nt.__webglTexture,$),e.bindFramebuffer(i.FRAMEBUFFER,null)}function at(C,b,k){if(i.bindRenderbuffer(i.RENDERBUFFER,C),b.depthBuffer){const Y=b.depthTexture,J=Y&&Y.isDepthTexture?Y.type:null,$=y(b.stencilBuffer,J),wt=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ut=tt(b);xt(b)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ut,$,b.width,b.height):k?i.renderbufferStorageMultisample(i.RENDERBUFFER,ut,$,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,$,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,wt,i.RENDERBUFFER,C)}else{const Y=b.textures;for(let J=0;J<Y.length;J++){const $=Y[J],wt=r.convert($.format,$.colorSpace),ut=r.convert($.type),vt=v($.internalFormat,wt,ut,$.colorSpace),Xt=tt(b);k&&xt(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Xt,vt,b.width,b.height):xt(b)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Xt,vt,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,vt,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Pt(C,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,C),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Y=n.get(b.depthTexture);Y.__renderTarget=b,(!Y.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),q(b.depthTexture,0);const J=Y.__webglTexture,$=tt(b);if(b.depthTexture.format===Yi)xt(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0);else if(b.depthTexture.format===Qi)xt(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function Ot(C){const b=n.get(C),k=C.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==C.depthTexture){const Y=C.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),Y){const J=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,Y.removeEventListener("dispose",J)};Y.addEventListener("dispose",J),b.__depthDisposeCallback=J}b.__boundDepthTexture=Y}if(C.depthTexture&&!b.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");Pt(b.__webglFramebuffer,C)}else if(k){b.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[Y]),b.__webglDepthbuffer[Y]===void 0)b.__webglDepthbuffer[Y]=i.createRenderbuffer(),at(b.__webglDepthbuffer[Y],C,!1);else{const J=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,$=b.__webglDepthbuffer[Y];i.bindRenderbuffer(i.RENDERBUFFER,$),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,$)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=i.createRenderbuffer(),at(b.__webglDepthbuffer,C,!1);else{const Y=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=b.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,Y,i.RENDERBUFFER,J)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function It(C,b,k){const Y=n.get(C);b!==void 0&&bt(Y.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),k!==void 0&&Ot(C)}function $t(C){const b=C.texture,k=n.get(C),Y=n.get(b);C.addEventListener("dispose",A);const J=C.textures,$=C.isWebGLCubeRenderTarget===!0,wt=J.length>1;if(wt||(Y.__webglTexture===void 0&&(Y.__webglTexture=i.createTexture()),Y.__version=b.version,o.memory.textures++),$){k.__webglFramebuffer=[];for(let ut=0;ut<6;ut++)if(b.mipmaps&&b.mipmaps.length>0){k.__webglFramebuffer[ut]=[];for(let vt=0;vt<b.mipmaps.length;vt++)k.__webglFramebuffer[ut][vt]=i.createFramebuffer()}else k.__webglFramebuffer[ut]=i.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){k.__webglFramebuffer=[];for(let ut=0;ut<b.mipmaps.length;ut++)k.__webglFramebuffer[ut]=i.createFramebuffer()}else k.__webglFramebuffer=i.createFramebuffer();if(wt)for(let ut=0,vt=J.length;ut<vt;ut++){const Xt=n.get(J[ut]);Xt.__webglTexture===void 0&&(Xt.__webglTexture=i.createTexture(),o.memory.textures++)}if(C.samples>0&&xt(C)===!1){k.__webglMultisampledFramebuffer=i.createFramebuffer(),k.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let ut=0;ut<J.length;ut++){const vt=J[ut];k.__webglColorRenderbuffer[ut]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,k.__webglColorRenderbuffer[ut]);const Xt=r.convert(vt.format,vt.colorSpace),nt=r.convert(vt.type),Mt=v(vt.internalFormat,Xt,nt,vt.colorSpace,C.isXRRenderTarget===!0),Dt=tt(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,Dt,Mt,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.RENDERBUFFER,k.__webglColorRenderbuffer[ut])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(k.__webglDepthRenderbuffer=i.createRenderbuffer(),at(k.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if($){e.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture),zt(i.TEXTURE_CUBE_MAP,b);for(let ut=0;ut<6;ut++)if(b.mipmaps&&b.mipmaps.length>0)for(let vt=0;vt<b.mipmaps.length;vt++)bt(k.__webglFramebuffer[ut][vt],C,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,vt);else bt(k.__webglFramebuffer[ut],C,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0);m(b)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(wt){for(let ut=0,vt=J.length;ut<vt;ut++){const Xt=J[ut],nt=n.get(Xt);e.bindTexture(i.TEXTURE_2D,nt.__webglTexture),zt(i.TEXTURE_2D,Xt),bt(k.__webglFramebuffer,C,Xt,i.COLOR_ATTACHMENT0+ut,i.TEXTURE_2D,0),m(Xt)&&f(i.TEXTURE_2D)}e.unbindTexture()}else{let ut=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ut=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ut,Y.__webglTexture),zt(ut,b),b.mipmaps&&b.mipmaps.length>0)for(let vt=0;vt<b.mipmaps.length;vt++)bt(k.__webglFramebuffer[vt],C,b,i.COLOR_ATTACHMENT0,ut,vt);else bt(k.__webglFramebuffer,C,b,i.COLOR_ATTACHMENT0,ut,0);m(b)&&f(ut),e.unbindTexture()}C.depthBuffer&&Ot(C)}function j(C){const b=C.textures;for(let k=0,Y=b.length;k<Y;k++){const J=b[k];if(m(J)){const $=_(C),wt=n.get(J).__webglTexture;e.bindTexture($,wt),f($),e.unbindTexture()}}}const st=[],D=[];function Rt(C){if(C.samples>0){if(xt(C)===!1){const b=C.textures,k=C.width,Y=C.height;let J=i.COLOR_BUFFER_BIT;const $=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,wt=n.get(C),ut=b.length>1;if(ut)for(let vt=0;vt<b.length;vt++)e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,wt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,wt.__webglFramebuffer);for(let vt=0;vt<b.length;vt++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(J|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(J|=i.STENCIL_BUFFER_BIT)),ut){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,wt.__webglColorRenderbuffer[vt]);const Xt=n.get(b[vt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Xt,0)}i.blitFramebuffer(0,0,k,Y,0,0,k,Y,J,i.NEAREST),l===!0&&(st.length=0,D.length=0,st.push(i.COLOR_ATTACHMENT0+vt),C.depthBuffer&&C.resolveDepthBuffer===!1&&(st.push($),D.push($),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,D)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,st))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ut)for(let vt=0;vt<b.length;vt++){e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.RENDERBUFFER,wt.__webglColorRenderbuffer[vt]);const Xt=n.get(b[vt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.TEXTURE_2D,Xt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,wt.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const b=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[b])}}}function tt(C){return Math.min(s.maxSamples,C.samples)}function xt(C){const b=n.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function lt(C){const b=o.render.frame;h.get(C)!==b&&(h.set(C,b),C.update())}function Lt(C,b){const k=C.colorSpace,Y=C.format,J=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||k!==es&&k!==qn&&(Yt.getTransfer(k)===ne?(Y!==on||J!==Nn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),b}function _t(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=U,this.resetTextureUnits=I,this.setTexture2D=q,this.setTexture2DArray=H,this.setTexture3D=Q,this.setTextureCube=W,this.rebindTextures=It,this.setupRenderTarget=$t,this.updateRenderTargetMipmap=j,this.updateMultisampleRenderTarget=Rt,this.setupDepthRenderbuffer=Ot,this.setupFrameBufferTexture=bt,this.useMultisampledRTT=xt}function k_(i,t){function e(n,s=qn){let r;const o=Yt.getTransfer(s);if(n===Nn)return i.UNSIGNED_BYTE;if(n===bl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===wl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Ru)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Tu)return i.BYTE;if(n===Au)return i.SHORT;if(n===Us)return i.UNSIGNED_SHORT;if(n===Sl)return i.INT;if(n===pi)return i.UNSIGNED_INT;if(n===Pn)return i.FLOAT;if(n===jn)return i.HALF_FLOAT;if(n===Cu)return i.ALPHA;if(n===Pu)return i.RGB;if(n===on)return i.RGBA;if(n===Lu)return i.LUMINANCE;if(n===Du)return i.LUMINANCE_ALPHA;if(n===Yi)return i.DEPTH_COMPONENT;if(n===Qi)return i.DEPTH_STENCIL;if(n===El)return i.RED;if(n===Tl)return i.RED_INTEGER;if(n===Iu)return i.RG;if(n===Al)return i.RG_INTEGER;if(n===Rl)return i.RGBA_INTEGER;if(n===zr||n===kr||n===Hr||n===Gr)if(o===ne)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===zr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===kr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Hr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Gr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===zr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===kr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Hr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Gr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Oa||n===Fa||n===Ba||n===za)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Oa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Fa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ba)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===za)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ka||n===Ha||n===Ga)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ka||n===Ha)return o===ne?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ga)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Va||n===Wa||n===Xa||n===qa||n===Ya||n===$a||n===Ka||n===Za||n===ja||n===Ja||n===Qa||n===tl||n===el||n===nl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Va)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Wa)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Xa)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===qa)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ya)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===$a)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ka)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Za)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ja)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ja)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Qa)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===tl)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===el)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===nl)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Vr||n===il||n===sl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Vr)return o===ne?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===il)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===sl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Uu||n===rl||n===ol||n===al)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Vr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===rl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ol)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===al)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ji?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class H_ extends je{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Ce extends we{constructor(){super(),this.isGroup=!0,this.type="Group"}}const G_={type:"move"};class Go{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ce,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ce,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ce,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const x of t.hand.values()){const m=e.getJointPose(x,n),f=this._getHandJoint(c,x);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,g=.005;c.inputState.pinching&&d>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(G_)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Ce;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const V_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,W_=`
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

}`;class X_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new Be,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Ye({vertexShader:V_,fragmentShader:W_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Kt(new $n(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class q_ extends ns{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,p=null,g=null;const x=new X_,m=e.getContextAttributes();let f=null,_=null;const v=[],y=[],w=new et;let E=null;const A=new je;A.viewport=new pe;const L=new je;L.viewport=new pe;const S=[A,L],M=new H_;let R=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let rt=v[K];return rt===void 0&&(rt=new Go,v[K]=rt),rt.getTargetRaySpace()},this.getControllerGrip=function(K){let rt=v[K];return rt===void 0&&(rt=new Go,v[K]=rt),rt.getGripSpace()},this.getHand=function(K){let rt=v[K];return rt===void 0&&(rt=new Go,v[K]=rt),rt.getHandSpace()};function U(K){const rt=y.indexOf(K.inputSource);if(rt===-1)return;const bt=v[rt];bt!==void 0&&(bt.update(K.inputSource,K.frame,c||o),bt.dispatchEvent({type:K.type,data:K.inputSource}))}function B(){s.removeEventListener("select",U),s.removeEventListener("selectstart",U),s.removeEventListener("selectend",U),s.removeEventListener("squeeze",U),s.removeEventListener("squeezestart",U),s.removeEventListener("squeezeend",U),s.removeEventListener("end",B),s.removeEventListener("inputsourceschange",q);for(let K=0;K<v.length;K++){const rt=y[K];rt!==null&&(y[K]=null,v[K].disconnect(rt))}R=null,I=null,x.reset(),t.setRenderTarget(f),p=null,d=null,u=null,s=null,_=null,Jt.stop(),n.isPresenting=!1,t.setPixelRatio(E),t.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){r=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){a=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(K){if(s=K,s!==null){if(f=t.getRenderTarget(),s.addEventListener("select",U),s.addEventListener("selectstart",U),s.addEventListener("selectend",U),s.addEventListener("squeeze",U),s.addEventListener("squeezestart",U),s.addEventListener("squeezeend",U),s.addEventListener("end",B),s.addEventListener("inputsourceschange",q),m.xrCompatible!==!0&&await e.makeXRCompatible(),E=t.getPixelRatio(),t.getSize(w),s.renderState.layers===void 0){const rt={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,rt),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),_=new gn(p.framebufferWidth,p.framebufferHeight,{format:on,type:Nn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let rt=null,bt=null,at=null;m.depth&&(at=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,rt=m.stencil?Qi:Yi,bt=m.stencil?Ji:pi);const Pt={colorFormat:e.RGBA8,depthFormat:at,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(Pt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),_=new gn(d.textureWidth,d.textureHeight,{format:on,type:Nn,depthTexture:new Ul(d.textureWidth,d.textureHeight,bt,void 0,void 0,void 0,void 0,void 0,void 0,rt),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Jt.setContext(s),Jt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function q(K){for(let rt=0;rt<K.removed.length;rt++){const bt=K.removed[rt],at=y.indexOf(bt);at>=0&&(y[at]=null,v[at].disconnect(bt))}for(let rt=0;rt<K.added.length;rt++){const bt=K.added[rt];let at=y.indexOf(bt);if(at===-1){for(let Ot=0;Ot<v.length;Ot++)if(Ot>=y.length){y.push(bt),at=Ot;break}else if(y[Ot]===null){y[Ot]=bt,at=Ot;break}if(at===-1)break}const Pt=v[at];Pt&&Pt.connect(bt)}}const H=new P,Q=new P;function W(K,rt,bt){H.setFromMatrixPosition(rt.matrixWorld),Q.setFromMatrixPosition(bt.matrixWorld);const at=H.distanceTo(Q),Pt=rt.projectionMatrix.elements,Ot=bt.projectionMatrix.elements,It=Pt[14]/(Pt[10]-1),$t=Pt[14]/(Pt[10]+1),j=(Pt[9]+1)/Pt[5],st=(Pt[9]-1)/Pt[5],D=(Pt[8]-1)/Pt[0],Rt=(Ot[8]+1)/Ot[0],tt=It*D,xt=It*Rt,lt=at/(-D+Rt),Lt=lt*-D;if(rt.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(Lt),K.translateZ(lt),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),Pt[10]===-1)K.projectionMatrix.copy(rt.projectionMatrix),K.projectionMatrixInverse.copy(rt.projectionMatrixInverse);else{const _t=It+lt,C=$t+lt,b=tt-Lt,k=xt+(at-Lt),Y=j*$t/C*_t,J=st*$t/C*_t;K.projectionMatrix.makePerspective(b,k,Y,J,_t,C),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function ct(K,rt){rt===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(rt.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(s===null)return;let rt=K.near,bt=K.far;x.texture!==null&&(x.depthNear>0&&(rt=x.depthNear),x.depthFar>0&&(bt=x.depthFar)),M.near=L.near=A.near=rt,M.far=L.far=A.far=bt,(R!==M.near||I!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),R=M.near,I=M.far),A.layers.mask=K.layers.mask|2,L.layers.mask=K.layers.mask|4,M.layers.mask=A.layers.mask|L.layers.mask;const at=K.parent,Pt=M.cameras;ct(M,at);for(let Ot=0;Ot<Pt.length;Ot++)ct(Pt[Ot],at);Pt.length===2?W(M,A,L):M.projectionMatrix.copy(A.projectionMatrix),ft(K,M,at)};function ft(K,rt,bt){bt===null?K.matrix.copy(rt.matrixWorld):(K.matrix.copy(bt.matrixWorld),K.matrix.invert(),K.matrix.multiply(rt.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(rt.projectionMatrix),K.projectionMatrixInverse.copy(rt.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=Ns*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(K){l=K,d!==null&&(d.fixedFoveation=K),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=K)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(M)};let yt=null;function zt(K,rt){if(h=rt.getViewerPose(c||o),g=rt,h!==null){const bt=h.views;p!==null&&(t.setRenderTargetFramebuffer(_,p.framebuffer),t.setRenderTarget(_));let at=!1;bt.length!==M.cameras.length&&(M.cameras.length=0,at=!0);for(let Ot=0;Ot<bt.length;Ot++){const It=bt[Ot];let $t=null;if(p!==null)$t=p.getViewport(It);else{const st=u.getViewSubImage(d,It);$t=st.viewport,Ot===0&&(t.setRenderTargetTextures(_,st.colorTexture,d.ignoreDepthValues?void 0:st.depthStencilTexture),t.setRenderTarget(_))}let j=S[Ot];j===void 0&&(j=new je,j.layers.enable(Ot),j.viewport=new pe,S[Ot]=j),j.matrix.fromArray(It.transform.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale),j.projectionMatrix.fromArray(It.projectionMatrix),j.projectionMatrixInverse.copy(j.projectionMatrix).invert(),j.viewport.set($t.x,$t.y,$t.width,$t.height),Ot===0&&(M.matrix.copy(j.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),at===!0&&M.cameras.push(j)}const Pt=s.enabledFeatures;if(Pt&&Pt.includes("depth-sensing")){const Ot=u.getDepthInformation(bt[0]);Ot&&Ot.isValid&&Ot.texture&&x.init(t,Ot,s.renderState)}}for(let bt=0;bt<v.length;bt++){const at=y[bt],Pt=v[bt];at!==null&&Pt!==void 0&&Pt.update(at,rt,c||o)}yt&&yt(K,rt),rt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:rt}),g=null}const Jt=new Xu;Jt.setAnimationLoop(zt),this.setAnimationLoop=function(K){yt=K},this.dispose=function(){}}}const ri=new _n,Y_=new ae;function $_(i,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Gu(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,_,v,y){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),u(m,f)):f.isMeshPhongMaterial?(r(m,f),h(m,f)):f.isMeshStandardMaterial?(r(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,y)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),x(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?l(m,f,_,v):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Fe&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Fe&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const _=t.get(f),v=_.envMap,y=_.envMapRotation;v&&(m.envMap.value=v,ri.copy(y),ri.x*=-1,ri.y*=-1,ri.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(ri.y*=-1,ri.z*=-1),m.envMapRotation.value.setFromMatrix4(Y_.makeRotationFromEuler(ri)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,_,v){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*_,m.scale.value=v*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,_){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Fe&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=_.texture,m.transmissionSamplerSize.value.set(_.width,_.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function x(m,f){const _=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(_.matrixWorld),m.nearDistance.value=_.shadow.camera.near,m.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function K_(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(_,v){const y=v.program;n.uniformBlockBinding(_,y)}function c(_,v){let y=s[_.id];y===void 0&&(g(_),y=h(_),s[_.id]=y,_.addEventListener("dispose",m));const w=v.program;n.updateUBOMapping(_,w);const E=t.render.frame;r[_.id]!==E&&(d(_),r[_.id]=E)}function h(_){const v=u();_.__bindingPointIndex=v;const y=i.createBuffer(),w=_.__size,E=_.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,w,E),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,y),y}function u(){for(let _=0;_<a;_++)if(o.indexOf(_)===-1)return o.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(_){const v=s[_.id],y=_.uniforms,w=_.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let E=0,A=y.length;E<A;E++){const L=Array.isArray(y[E])?y[E]:[y[E]];for(let S=0,M=L.length;S<M;S++){const R=L[S];if(p(R,E,S,w)===!0){const I=R.__offset,U=Array.isArray(R.value)?R.value:[R.value];let B=0;for(let q=0;q<U.length;q++){const H=U[q],Q=x(H);typeof H=="number"||typeof H=="boolean"?(R.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,I+B,R.__data)):H.isMatrix3?(R.__data[0]=H.elements[0],R.__data[1]=H.elements[1],R.__data[2]=H.elements[2],R.__data[3]=0,R.__data[4]=H.elements[3],R.__data[5]=H.elements[4],R.__data[6]=H.elements[5],R.__data[7]=0,R.__data[8]=H.elements[6],R.__data[9]=H.elements[7],R.__data[10]=H.elements[8],R.__data[11]=0):(H.toArray(R.__data,B),B+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,I,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(_,v,y,w){const E=_.value,A=v+"_"+y;if(w[A]===void 0)return typeof E=="number"||typeof E=="boolean"?w[A]=E:w[A]=E.clone(),!0;{const L=w[A];if(typeof E=="number"||typeof E=="boolean"){if(L!==E)return w[A]=E,!0}else if(L.equals(E)===!1)return L.copy(E),!0}return!1}function g(_){const v=_.uniforms;let y=0;const w=16;for(let A=0,L=v.length;A<L;A++){const S=Array.isArray(v[A])?v[A]:[v[A]];for(let M=0,R=S.length;M<R;M++){const I=S[M],U=Array.isArray(I.value)?I.value:[I.value];for(let B=0,q=U.length;B<q;B++){const H=U[B],Q=x(H),W=y%w,ct=W%Q.boundary,ft=W+ct;y+=ct,ft!==0&&w-ft<Q.storage&&(y+=w-ft),I.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=y,y+=Q.storage}}}const E=y%w;return E>0&&(y+=w-E),_.__size=y,_.__cache={},this}function x(_){const v={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(v.boundary=4,v.storage=4):_.isVector2?(v.boundary=8,v.storage=8):_.isVector3||_.isColor?(v.boundary=16,v.storage=12):_.isVector4?(v.boundary=16,v.storage=16):_.isMatrix3?(v.boundary=48,v.storage=48):_.isMatrix4?(v.boundary=64,v.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),v}function m(_){const v=_.target;v.removeEventListener("dispose",m);const y=o.indexOf(v.__bindingPointIndex);o.splice(y,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function f(){for(const _ in s)i.deleteBuffer(s[_]);o=[],s={},r={}}return{bind:l,update:c,dispose:f}}class Z_{constructor(t={}){const{canvas:e=zf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;const g=new Uint32Array(4),x=new Int32Array(4);let m=null,f=null;const _=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=qe,this.toneMapping=Yn,this.toneMappingExposure=1;const y=this;let w=!1,E=0,A=0,L=null,S=-1,M=null;const R=new pe,I=new pe;let U=null;const B=new Nt(0);let q=0,H=e.width,Q=e.height,W=1,ct=null,ft=null;const yt=new pe(0,0,H,Q),zt=new pe(0,0,H,Q);let Jt=!1;const K=new Ll;let rt=!1,bt=!1;const at=new ae,Pt=new ae,Ot=new P,It=new pe,$t={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let j=!1;function st(){return L===null?W:1}let D=n;function Rt(T,O){return e.getContext(T,O)}try{const T={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${yl}`),e.addEventListener("webglcontextlost",Z,!1),e.addEventListener("webglcontextrestored",gt,!1),e.addEventListener("webglcontextcreationerror",pt,!1),D===null){const O="webgl2";if(D=Rt(O,T),D===null)throw Rt(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let tt,xt,lt,Lt,_t,C,b,k,Y,J,$,wt,ut,vt,Xt,nt,Mt,Dt,Ut,St,qt,Vt,re,N;function dt(){tt=new eg(D),tt.init(),Vt=new k_(D,tt),xt=new K0(D,tt,t,Vt),lt=new F_(D,tt),xt.reverseDepthBuffer&&d&&lt.buffers.depth.setReversed(!0),Lt=new sg(D),_t=new S_,C=new z_(D,tt,lt,_t,xt,Vt,Lt),b=new j0(y),k=new tg(y),Y=new up(D),re=new Y0(D,Y),J=new ng(D,Y,Lt,re),$=new og(D,J,Y,Lt),Ut=new rg(D,xt,C),nt=new Z0(_t),wt=new M_(y,b,k,tt,xt,re,nt),ut=new $_(y,_t),vt=new w_,Xt=new P_(tt),Dt=new q0(y,b,k,lt,$,p,l),Mt=new N_(y,$,xt),N=new K_(D,Lt,xt,lt),St=new $0(D,tt,Lt),qt=new ig(D,tt,Lt),Lt.programs=wt.programs,y.capabilities=xt,y.extensions=tt,y.properties=_t,y.renderLists=vt,y.shadowMap=Mt,y.state=lt,y.info=Lt}dt();const X=new q_(y,D);this.xr=X,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const T=tt.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=tt.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(T){T!==void 0&&(W=T,this.setSize(H,Q,!1))},this.getSize=function(T){return T.set(H,Q)},this.setSize=function(T,O,G=!0){if(X.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}H=T,Q=O,e.width=Math.floor(T*W),e.height=Math.floor(O*W),G===!0&&(e.style.width=T+"px",e.style.height=O+"px"),this.setViewport(0,0,T,O)},this.getDrawingBufferSize=function(T){return T.set(H*W,Q*W).floor()},this.setDrawingBufferSize=function(T,O,G){H=T,Q=O,W=G,e.width=Math.floor(T*G),e.height=Math.floor(O*G),this.setViewport(0,0,T,O)},this.getCurrentViewport=function(T){return T.copy(R)},this.getViewport=function(T){return T.copy(yt)},this.setViewport=function(T,O,G,V){T.isVector4?yt.set(T.x,T.y,T.z,T.w):yt.set(T,O,G,V),lt.viewport(R.copy(yt).multiplyScalar(W).round())},this.getScissor=function(T){return T.copy(zt)},this.setScissor=function(T,O,G,V){T.isVector4?zt.set(T.x,T.y,T.z,T.w):zt.set(T,O,G,V),lt.scissor(I.copy(zt).multiplyScalar(W).round())},this.getScissorTest=function(){return Jt},this.setScissorTest=function(T){lt.setScissorTest(Jt=T)},this.setOpaqueSort=function(T){ct=T},this.setTransparentSort=function(T){ft=T},this.getClearColor=function(T){return T.copy(Dt.getClearColor())},this.setClearColor=function(){Dt.setClearColor.apply(Dt,arguments)},this.getClearAlpha=function(){return Dt.getClearAlpha()},this.setClearAlpha=function(){Dt.setClearAlpha.apply(Dt,arguments)},this.clear=function(T=!0,O=!0,G=!0){let V=0;if(T){let F=!1;if(L!==null){const ot=L.texture.format;F=ot===Rl||ot===Al||ot===Tl}if(F){const ot=L.texture.type,mt=ot===Nn||ot===pi||ot===Us||ot===Ji||ot===bl||ot===wl,Et=Dt.getClearColor(),Tt=Dt.getClearAlpha(),Ft=Et.r,Ht=Et.g,At=Et.b;mt?(g[0]=Ft,g[1]=Ht,g[2]=At,g[3]=Tt,D.clearBufferuiv(D.COLOR,0,g)):(x[0]=Ft,x[1]=Ht,x[2]=At,x[3]=Tt,D.clearBufferiv(D.COLOR,0,x))}else V|=D.COLOR_BUFFER_BIT}O&&(V|=D.DEPTH_BUFFER_BIT),G&&(V|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Z,!1),e.removeEventListener("webglcontextrestored",gt,!1),e.removeEventListener("webglcontextcreationerror",pt,!1),vt.dispose(),Xt.dispose(),_t.dispose(),b.dispose(),k.dispose(),$.dispose(),re.dispose(),N.dispose(),wt.dispose(),X.dispose(),X.removeEventListener("sessionstart",Ql),X.removeEventListener("sessionend",tc),Qn.stop()};function Z(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function gt(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const T=Lt.autoReset,O=Mt.enabled,G=Mt.autoUpdate,V=Mt.needsUpdate,F=Mt.type;dt(),Lt.autoReset=T,Mt.enabled=O,Mt.autoUpdate=G,Mt.needsUpdate=V,Mt.type=F}function pt(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function kt(T){const O=T.target;O.removeEventListener("dispose",kt),_e(O)}function _e(T){Le(T),_t.remove(T)}function Le(T){const O=_t.get(T).programs;O!==void 0&&(O.forEach(function(G){wt.releaseProgram(G)}),T.isShaderMaterial&&wt.releaseShaderCache(T))}this.renderBufferDirect=function(T,O,G,V,F,ot){O===null&&(O=$t);const mt=F.isMesh&&F.matrixWorld.determinant()<0,Et=Fd(T,O,G,V,F);lt.setMaterial(V,mt);let Tt=G.index,Ft=1;if(V.wireframe===!0){if(Tt=J.getWireframeAttribute(G),Tt===void 0)return;Ft=2}const Ht=G.drawRange,At=G.attributes.position;let jt=Ht.start*Ft,oe=(Ht.start+Ht.count)*Ft;ot!==null&&(jt=Math.max(jt,ot.start*Ft),oe=Math.min(oe,(ot.start+ot.count)*Ft)),Tt!==null?(jt=Math.max(jt,0),oe=Math.min(oe,Tt.count)):At!=null&&(jt=Math.max(jt,0),oe=Math.min(oe,At.count));const le=oe-jt;if(le<0||le===1/0)return;re.setup(F,V,Et,G,Tt);let ze,Qt=St;if(Tt!==null&&(ze=Y.get(Tt),Qt=qt,Qt.setIndex(ze)),F.isMesh)V.wireframe===!0?(lt.setLineWidth(V.wireframeLinewidth*st()),Qt.setMode(D.LINES)):Qt.setMode(D.TRIANGLES);else if(F.isLine){let Ct=V.linewidth;Ct===void 0&&(Ct=1),lt.setLineWidth(Ct*st()),F.isLineSegments?Qt.setMode(D.LINES):F.isLineLoop?Qt.setMode(D.LINE_LOOP):Qt.setMode(D.LINE_STRIP)}else F.isPoints?Qt.setMode(D.POINTS):F.isSprite&&Qt.setMode(D.TRIANGLES);if(F.isBatchedMesh)if(F._multiDrawInstances!==null)Qt.renderMultiDrawInstances(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount,F._multiDrawInstances);else if(tt.get("WEBGL_multi_draw"))Qt.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else{const Ct=F._multiDrawStarts,yn=F._multiDrawCounts,te=F._multiDrawCount,tn=Tt?Y.get(Tt).bytesPerElement:1,Si=_t.get(V).currentProgram.getUniforms();for(let Ve=0;Ve<te;Ve++)Si.setValue(D,"_gl_DrawID",Ve),Qt.render(Ct[Ve]/tn,yn[Ve])}else if(F.isInstancedMesh)Qt.renderInstances(jt,le,F.count);else if(G.isInstancedBufferGeometry){const Ct=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,yn=Math.min(G.instanceCount,Ct);Qt.renderInstances(jt,le,yn)}else Qt.render(jt,le)};function ee(T,O,G){T.transparent===!0&&T.side===dn&&T.forceSinglePass===!1?(T.side=Fe,T.needsUpdate=!0,Ys(T,O,G),T.side=Zn,T.needsUpdate=!0,Ys(T,O,G),T.side=dn):Ys(T,O,G)}this.compile=function(T,O,G=null){G===null&&(G=T),f=Xt.get(G),f.init(O),v.push(f),G.traverseVisible(function(F){F.isLight&&F.layers.test(O.layers)&&(f.pushLight(F),F.castShadow&&f.pushShadow(F))}),T!==G&&T.traverseVisible(function(F){F.isLight&&F.layers.test(O.layers)&&(f.pushLight(F),F.castShadow&&f.pushShadow(F))}),f.setupLights();const V=new Set;return T.traverse(function(F){if(!(F.isMesh||F.isPoints||F.isLine||F.isSprite))return;const ot=F.material;if(ot)if(Array.isArray(ot))for(let mt=0;mt<ot.length;mt++){const Et=ot[mt];ee(Et,G,F),V.add(Et)}else ee(ot,G,F),V.add(ot)}),v.pop(),f=null,V},this.compileAsync=function(T,O,G=null){const V=this.compile(T,O,G);return new Promise(F=>{function ot(){if(V.forEach(function(mt){_t.get(mt).currentProgram.isReady()&&V.delete(mt)}),V.size===0){F(T);return}setTimeout(ot,10)}tt.get("KHR_parallel_shader_compile")!==null?ot():setTimeout(ot,10)})};let Qe=null;function xn(T){Qe&&Qe(T)}function Ql(){Qn.stop()}function tc(){Qn.start()}const Qn=new Xu;Qn.setAnimationLoop(xn),typeof self<"u"&&Qn.setContext(self),this.setAnimationLoop=function(T){Qe=T,X.setAnimationLoop(T),T===null?Qn.stop():Qn.start()},X.addEventListener("sessionstart",Ql),X.addEventListener("sessionend",tc),this.render=function(T,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),X.enabled===!0&&X.isPresenting===!0&&(X.cameraAutoUpdate===!0&&X.updateCamera(O),O=X.getCamera()),T.isScene===!0&&T.onBeforeRender(y,T,O,L),f=Xt.get(T,v.length),f.init(O),v.push(f),Pt.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),K.setFromProjectionMatrix(Pt),bt=this.localClippingEnabled,rt=nt.init(this.clippingPlanes,bt),m=vt.get(T,_.length),m.init(),_.push(m),X.enabled===!0&&X.isPresenting===!0){const ot=y.xr.getDepthSensingMesh();ot!==null&&po(ot,O,-1/0,y.sortObjects)}po(T,O,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(ct,ft),j=X.enabled===!1||X.isPresenting===!1||X.hasDepthSensing()===!1,j&&Dt.addToRenderList(m,T),this.info.render.frame++,rt===!0&&nt.beginShadows();const G=f.state.shadowsArray;Mt.render(G,T,O),rt===!0&&nt.endShadows(),this.info.autoReset===!0&&this.info.reset();const V=m.opaque,F=m.transmissive;if(f.setupLights(),O.isArrayCamera){const ot=O.cameras;if(F.length>0)for(let mt=0,Et=ot.length;mt<Et;mt++){const Tt=ot[mt];nc(V,F,T,Tt)}j&&Dt.render(T);for(let mt=0,Et=ot.length;mt<Et;mt++){const Tt=ot[mt];ec(m,T,Tt,Tt.viewport)}}else F.length>0&&nc(V,F,T,O),j&&Dt.render(T),ec(m,T,O);L!==null&&(C.updateMultisampleRenderTarget(L),C.updateRenderTargetMipmap(L)),T.isScene===!0&&T.onAfterRender(y,T,O),re.resetDefaultState(),S=-1,M=null,v.pop(),v.length>0?(f=v[v.length-1],rt===!0&&nt.setGlobalState(y.clippingPlanes,f.state.camera)):f=null,_.pop(),_.length>0?m=_[_.length-1]:m=null};function po(T,O,G,V){if(T.visible===!1)return;if(T.layers.test(O.layers)){if(T.isGroup)G=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(O);else if(T.isLight)f.pushLight(T),T.castShadow&&f.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||K.intersectsSprite(T)){V&&It.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Pt);const mt=$.update(T),Et=T.material;Et.visible&&m.push(T,mt,Et,G,It.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||K.intersectsObject(T))){const mt=$.update(T),Et=T.material;if(V&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),It.copy(T.boundingSphere.center)):(mt.boundingSphere===null&&mt.computeBoundingSphere(),It.copy(mt.boundingSphere.center)),It.applyMatrix4(T.matrixWorld).applyMatrix4(Pt)),Array.isArray(Et)){const Tt=mt.groups;for(let Ft=0,Ht=Tt.length;Ft<Ht;Ft++){const At=Tt[Ft],jt=Et[At.materialIndex];jt&&jt.visible&&m.push(T,mt,jt,G,It.z,At)}}else Et.visible&&m.push(T,mt,Et,G,It.z,null)}}const ot=T.children;for(let mt=0,Et=ot.length;mt<Et;mt++)po(ot[mt],O,G,V)}function ec(T,O,G,V){const F=T.opaque,ot=T.transmissive,mt=T.transparent;f.setupLightsView(G),rt===!0&&nt.setGlobalState(y.clippingPlanes,G),V&&lt.viewport(R.copy(V)),F.length>0&&qs(F,O,G),ot.length>0&&qs(ot,O,G),mt.length>0&&qs(mt,O,G),lt.buffers.depth.setTest(!0),lt.buffers.depth.setMask(!0),lt.buffers.color.setMask(!0),lt.setPolygonOffset(!1)}function nc(T,O,G,V){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[V.id]===void 0&&(f.state.transmissionRenderTarget[V.id]=new gn(1,1,{generateMipmaps:!0,type:tt.has("EXT_color_buffer_half_float")||tt.has("EXT_color_buffer_float")?jn:Nn,minFilter:di,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Yt.workingColorSpace}));const ot=f.state.transmissionRenderTarget[V.id],mt=V.viewport||R;ot.setSize(mt.z,mt.w);const Et=y.getRenderTarget();y.setRenderTarget(ot),y.getClearColor(B),q=y.getClearAlpha(),q<1&&y.setClearColor(16777215,.5),y.clear(),j&&Dt.render(G);const Tt=y.toneMapping;y.toneMapping=Yn;const Ft=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),f.setupLightsView(V),rt===!0&&nt.setGlobalState(y.clippingPlanes,V),qs(T,G,V),C.updateMultisampleRenderTarget(ot),C.updateRenderTargetMipmap(ot),tt.has("WEBGL_multisampled_render_to_texture")===!1){let Ht=!1;for(let At=0,jt=O.length;At<jt;At++){const oe=O[At],le=oe.object,ze=oe.geometry,Qt=oe.material,Ct=oe.group;if(Qt.side===dn&&le.layers.test(V.layers)){const yn=Qt.side;Qt.side=Fe,Qt.needsUpdate=!0,ic(le,G,V,ze,Qt,Ct),Qt.side=yn,Qt.needsUpdate=!0,Ht=!0}}Ht===!0&&(C.updateMultisampleRenderTarget(ot),C.updateRenderTargetMipmap(ot))}y.setRenderTarget(Et),y.setClearColor(B,q),Ft!==void 0&&(V.viewport=Ft),y.toneMapping=Tt}function qs(T,O,G){const V=O.isScene===!0?O.overrideMaterial:null;for(let F=0,ot=T.length;F<ot;F++){const mt=T[F],Et=mt.object,Tt=mt.geometry,Ft=V===null?mt.material:V,Ht=mt.group;Et.layers.test(G.layers)&&ic(Et,O,G,Tt,Ft,Ht)}}function ic(T,O,G,V,F,ot){T.onBeforeRender(y,O,G,V,F,ot),T.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),F.onBeforeRender(y,O,G,V,T,ot),F.transparent===!0&&F.side===dn&&F.forceSinglePass===!1?(F.side=Fe,F.needsUpdate=!0,y.renderBufferDirect(G,O,V,F,T,ot),F.side=Zn,F.needsUpdate=!0,y.renderBufferDirect(G,O,V,F,T,ot),F.side=dn):y.renderBufferDirect(G,O,V,F,T,ot),T.onAfterRender(y,O,G,V,F,ot)}function Ys(T,O,G){O.isScene!==!0&&(O=$t);const V=_t.get(T),F=f.state.lights,ot=f.state.shadowsArray,mt=F.state.version,Et=wt.getParameters(T,F.state,ot,O,G),Tt=wt.getProgramCacheKey(Et);let Ft=V.programs;V.environment=T.isMeshStandardMaterial?O.environment:null,V.fog=O.fog,V.envMap=(T.isMeshStandardMaterial?k:b).get(T.envMap||V.environment),V.envMapRotation=V.environment!==null&&T.envMap===null?O.environmentRotation:T.envMapRotation,Ft===void 0&&(T.addEventListener("dispose",kt),Ft=new Map,V.programs=Ft);let Ht=Ft.get(Tt);if(Ht!==void 0){if(V.currentProgram===Ht&&V.lightsStateVersion===mt)return rc(T,Et),Ht}else Et.uniforms=wt.getUniforms(T),T.onBeforeCompile(Et,y),Ht=wt.acquireProgram(Et,Tt),Ft.set(Tt,Ht),V.uniforms=Et.uniforms;const At=V.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(At.clippingPlanes=nt.uniform),rc(T,Et),V.needsLights=zd(T),V.lightsStateVersion=mt,V.needsLights&&(At.ambientLightColor.value=F.state.ambient,At.lightProbe.value=F.state.probe,At.directionalLights.value=F.state.directional,At.directionalLightShadows.value=F.state.directionalShadow,At.spotLights.value=F.state.spot,At.spotLightShadows.value=F.state.spotShadow,At.rectAreaLights.value=F.state.rectArea,At.ltc_1.value=F.state.rectAreaLTC1,At.ltc_2.value=F.state.rectAreaLTC2,At.pointLights.value=F.state.point,At.pointLightShadows.value=F.state.pointShadow,At.hemisphereLights.value=F.state.hemi,At.directionalShadowMap.value=F.state.directionalShadowMap,At.directionalShadowMatrix.value=F.state.directionalShadowMatrix,At.spotShadowMap.value=F.state.spotShadowMap,At.spotLightMatrix.value=F.state.spotLightMatrix,At.spotLightMap.value=F.state.spotLightMap,At.pointShadowMap.value=F.state.pointShadowMap,At.pointShadowMatrix.value=F.state.pointShadowMatrix),V.currentProgram=Ht,V.uniformsList=null,Ht}function sc(T){if(T.uniformsList===null){const O=T.currentProgram.getUniforms();T.uniformsList=Wr.seqWithValue(O.seq,T.uniforms)}return T.uniformsList}function rc(T,O){const G=_t.get(T);G.outputColorSpace=O.outputColorSpace,G.batching=O.batching,G.batchingColor=O.batchingColor,G.instancing=O.instancing,G.instancingColor=O.instancingColor,G.instancingMorph=O.instancingMorph,G.skinning=O.skinning,G.morphTargets=O.morphTargets,G.morphNormals=O.morphNormals,G.morphColors=O.morphColors,G.morphTargetsCount=O.morphTargetsCount,G.numClippingPlanes=O.numClippingPlanes,G.numIntersection=O.numClipIntersection,G.vertexAlphas=O.vertexAlphas,G.vertexTangents=O.vertexTangents,G.toneMapping=O.toneMapping}function Fd(T,O,G,V,F){O.isScene!==!0&&(O=$t),C.resetTextureUnits();const ot=O.fog,mt=V.isMeshStandardMaterial?O.environment:null,Et=L===null?y.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:es,Tt=(V.isMeshStandardMaterial?k:b).get(V.envMap||mt),Ft=V.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Ht=!!G.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),At=!!G.morphAttributes.position,jt=!!G.morphAttributes.normal,oe=!!G.morphAttributes.color;let le=Yn;V.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(le=y.toneMapping);const ze=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Qt=ze!==void 0?ze.length:0,Ct=_t.get(V),yn=f.state.lights;if(rt===!0&&(bt===!0||T!==M)){const $e=T===M&&V.id===S;nt.setState(V,T,$e)}let te=!1;V.version===Ct.__version?(Ct.needsLights&&Ct.lightsStateVersion!==yn.state.version||Ct.outputColorSpace!==Et||F.isBatchedMesh&&Ct.batching===!1||!F.isBatchedMesh&&Ct.batching===!0||F.isBatchedMesh&&Ct.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&Ct.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&Ct.instancing===!1||!F.isInstancedMesh&&Ct.instancing===!0||F.isSkinnedMesh&&Ct.skinning===!1||!F.isSkinnedMesh&&Ct.skinning===!0||F.isInstancedMesh&&Ct.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&Ct.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&Ct.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&Ct.instancingMorph===!1&&F.morphTexture!==null||Ct.envMap!==Tt||V.fog===!0&&Ct.fog!==ot||Ct.numClippingPlanes!==void 0&&(Ct.numClippingPlanes!==nt.numPlanes||Ct.numIntersection!==nt.numIntersection)||Ct.vertexAlphas!==Ft||Ct.vertexTangents!==Ht||Ct.morphTargets!==At||Ct.morphNormals!==jt||Ct.morphColors!==oe||Ct.toneMapping!==le||Ct.morphTargetsCount!==Qt)&&(te=!0):(te=!0,Ct.__version=V.version);let tn=Ct.currentProgram;te===!0&&(tn=Ys(V,O,F));let Si=!1,Ve=!1,os=!1;const ce=tn.getUniforms(),an=Ct.uniforms;if(lt.useProgram(tn.program)&&(Si=!0,Ve=!0,os=!0),V.id!==S&&(S=V.id,Ve=!0),Si||M!==T){lt.buffers.depth.getReversed()?(at.copy(T.projectionMatrix),Hf(at),Gf(at),ce.setValue(D,"projectionMatrix",at)):ce.setValue(D,"projectionMatrix",T.projectionMatrix),ce.setValue(D,"viewMatrix",T.matrixWorldInverse);const On=ce.map.cameraPosition;On!==void 0&&On.setValue(D,Ot.setFromMatrixPosition(T.matrixWorld)),xt.logarithmicDepthBuffer&&ce.setValue(D,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&ce.setValue(D,"isOrthographic",T.isOrthographicCamera===!0),M!==T&&(M=T,Ve=!0,os=!0)}if(F.isSkinnedMesh){ce.setOptional(D,F,"bindMatrix"),ce.setOptional(D,F,"bindMatrixInverse");const $e=F.skeleton;$e&&($e.boneTexture===null&&$e.computeBoneTexture(),ce.setValue(D,"boneTexture",$e.boneTexture,C))}F.isBatchedMesh&&(ce.setOptional(D,F,"batchingTexture"),ce.setValue(D,"batchingTexture",F._matricesTexture,C),ce.setOptional(D,F,"batchingIdTexture"),ce.setValue(D,"batchingIdTexture",F._indirectTexture,C),ce.setOptional(D,F,"batchingColorTexture"),F._colorsTexture!==null&&ce.setValue(D,"batchingColorTexture",F._colorsTexture,C));const as=G.morphAttributes;if((as.position!==void 0||as.normal!==void 0||as.color!==void 0)&&Ut.update(F,G,tn),(Ve||Ct.receiveShadow!==F.receiveShadow)&&(Ct.receiveShadow=F.receiveShadow,ce.setValue(D,"receiveShadow",F.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(an.envMap.value=Tt,an.flipEnvMap.value=Tt.isCubeTexture&&Tt.isRenderTargetTexture===!1?-1:1),V.isMeshStandardMaterial&&V.envMap===null&&O.environment!==null&&(an.envMapIntensity.value=O.environmentIntensity),Ve&&(ce.setValue(D,"toneMappingExposure",y.toneMappingExposure),Ct.needsLights&&Bd(an,os),ot&&V.fog===!0&&ut.refreshFogUniforms(an,ot),ut.refreshMaterialUniforms(an,V,W,Q,f.state.transmissionRenderTarget[T.id]),Wr.upload(D,sc(Ct),an,C)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Wr.upload(D,sc(Ct),an,C),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&ce.setValue(D,"center",F.center),ce.setValue(D,"modelViewMatrix",F.modelViewMatrix),ce.setValue(D,"normalMatrix",F.normalMatrix),ce.setValue(D,"modelMatrix",F.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const $e=V.uniformsGroups;for(let On=0,Fn=$e.length;On<Fn;On++){const oc=$e[On];N.update(oc,tn),N.bind(oc,tn)}}return tn}function Bd(T,O){T.ambientLightColor.needsUpdate=O,T.lightProbe.needsUpdate=O,T.directionalLights.needsUpdate=O,T.directionalLightShadows.needsUpdate=O,T.pointLights.needsUpdate=O,T.pointLightShadows.needsUpdate=O,T.spotLights.needsUpdate=O,T.spotLightShadows.needsUpdate=O,T.rectAreaLights.needsUpdate=O,T.hemisphereLights.needsUpdate=O}function zd(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(T,O,G){_t.get(T.texture).__webglTexture=O,_t.get(T.depthTexture).__webglTexture=G;const V=_t.get(T);V.__hasExternalTextures=!0,V.__autoAllocateDepthBuffer=G===void 0,V.__autoAllocateDepthBuffer||tt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(T,O){const G=_t.get(T);G.__webglFramebuffer=O,G.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(T,O=0,G=0){L=T,E=O,A=G;let V=!0,F=null,ot=!1,mt=!1;if(T){const Tt=_t.get(T);if(Tt.__useDefaultFramebuffer!==void 0)lt.bindFramebuffer(D.FRAMEBUFFER,null),V=!1;else if(Tt.__webglFramebuffer===void 0)C.setupRenderTarget(T);else if(Tt.__hasExternalTextures)C.rebindTextures(T,_t.get(T.texture).__webglTexture,_t.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const At=T.depthTexture;if(Tt.__boundDepthTexture!==At){if(At!==null&&_t.has(At)&&(T.width!==At.image.width||T.height!==At.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(T)}}const Ft=T.texture;(Ft.isData3DTexture||Ft.isDataArrayTexture||Ft.isCompressedArrayTexture)&&(mt=!0);const Ht=_t.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Ht[O])?F=Ht[O][G]:F=Ht[O],ot=!0):T.samples>0&&C.useMultisampledRTT(T)===!1?F=_t.get(T).__webglMultisampledFramebuffer:Array.isArray(Ht)?F=Ht[G]:F=Ht,R.copy(T.viewport),I.copy(T.scissor),U=T.scissorTest}else R.copy(yt).multiplyScalar(W).floor(),I.copy(zt).multiplyScalar(W).floor(),U=Jt;if(lt.bindFramebuffer(D.FRAMEBUFFER,F)&&V&&lt.drawBuffers(T,F),lt.viewport(R),lt.scissor(I),lt.setScissorTest(U),ot){const Tt=_t.get(T.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+O,Tt.__webglTexture,G)}else if(mt){const Tt=_t.get(T.texture),Ft=O||0;D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,Tt.__webglTexture,G||0,Ft)}S=-1},this.readRenderTargetPixels=function(T,O,G,V,F,ot,mt){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Et=_t.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&mt!==void 0&&(Et=Et[mt]),Et){lt.bindFramebuffer(D.FRAMEBUFFER,Et);try{const Tt=T.texture,Ft=Tt.format,Ht=Tt.type;if(!xt.textureFormatReadable(Ft)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!xt.textureTypeReadable(Ht)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=T.width-V&&G>=0&&G<=T.height-F&&D.readPixels(O,G,V,F,Vt.convert(Ft),Vt.convert(Ht),ot)}finally{const Tt=L!==null?_t.get(L).__webglFramebuffer:null;lt.bindFramebuffer(D.FRAMEBUFFER,Tt)}}},this.readRenderTargetPixelsAsync=async function(T,O,G,V,F,ot,mt){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Et=_t.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&mt!==void 0&&(Et=Et[mt]),Et){const Tt=T.texture,Ft=Tt.format,Ht=Tt.type;if(!xt.textureFormatReadable(Ft))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!xt.textureTypeReadable(Ht))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(O>=0&&O<=T.width-V&&G>=0&&G<=T.height-F){lt.bindFramebuffer(D.FRAMEBUFFER,Et);const At=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,At),D.bufferData(D.PIXEL_PACK_BUFFER,ot.byteLength,D.STREAM_READ),D.readPixels(O,G,V,F,Vt.convert(Ft),Vt.convert(Ht),0);const jt=L!==null?_t.get(L).__webglFramebuffer:null;lt.bindFramebuffer(D.FRAMEBUFFER,jt);const oe=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await kf(D,oe,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,At),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,ot),D.deleteBuffer(At),D.deleteSync(oe),ot}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(T,O=null,G=0){T.isTexture!==!0&&(ys("WebGLRenderer: copyFramebufferToTexture function signature has changed."),O=arguments[0]||null,T=arguments[1]);const V=Math.pow(2,-G),F=Math.floor(T.image.width*V),ot=Math.floor(T.image.height*V),mt=O!==null?O.x:0,Et=O!==null?O.y:0;C.setTexture2D(T,0),D.copyTexSubImage2D(D.TEXTURE_2D,G,0,0,mt,Et,F,ot),lt.unbindTexture()},this.copyTextureToTexture=function(T,O,G=null,V=null,F=0){T.isTexture!==!0&&(ys("WebGLRenderer: copyTextureToTexture function signature has changed."),V=arguments[0]||null,T=arguments[1],O=arguments[2],F=arguments[3]||0,G=null);let ot,mt,Et,Tt,Ft,Ht,At,jt,oe;const le=T.isCompressedTexture?T.mipmaps[F]:T.image;G!==null?(ot=G.max.x-G.min.x,mt=G.max.y-G.min.y,Et=G.isBox3?G.max.z-G.min.z:1,Tt=G.min.x,Ft=G.min.y,Ht=G.isBox3?G.min.z:0):(ot=le.width,mt=le.height,Et=le.depth||1,Tt=0,Ft=0,Ht=0),V!==null?(At=V.x,jt=V.y,oe=V.z):(At=0,jt=0,oe=0);const ze=Vt.convert(O.format),Qt=Vt.convert(O.type);let Ct;O.isData3DTexture?(C.setTexture3D(O,0),Ct=D.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(C.setTexture2DArray(O,0),Ct=D.TEXTURE_2D_ARRAY):(C.setTexture2D(O,0),Ct=D.TEXTURE_2D),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,O.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,O.unpackAlignment);const yn=D.getParameter(D.UNPACK_ROW_LENGTH),te=D.getParameter(D.UNPACK_IMAGE_HEIGHT),tn=D.getParameter(D.UNPACK_SKIP_PIXELS),Si=D.getParameter(D.UNPACK_SKIP_ROWS),Ve=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,le.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,le.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Tt),D.pixelStorei(D.UNPACK_SKIP_ROWS,Ft),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Ht);const os=T.isDataArrayTexture||T.isData3DTexture,ce=O.isDataArrayTexture||O.isData3DTexture;if(T.isRenderTargetTexture||T.isDepthTexture){const an=_t.get(T),as=_t.get(O),$e=_t.get(an.__renderTarget),On=_t.get(as.__renderTarget);lt.bindFramebuffer(D.READ_FRAMEBUFFER,$e.__webglFramebuffer),lt.bindFramebuffer(D.DRAW_FRAMEBUFFER,On.__webglFramebuffer);for(let Fn=0;Fn<Et;Fn++)os&&D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,_t.get(T).__webglTexture,F,Ht+Fn),T.isDepthTexture?(ce&&D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,_t.get(O).__webglTexture,F,oe+Fn),D.blitFramebuffer(Tt,Ft,ot,mt,At,jt,ot,mt,D.DEPTH_BUFFER_BIT,D.NEAREST)):ce?D.copyTexSubImage3D(Ct,F,At,jt,oe+Fn,Tt,Ft,ot,mt):D.copyTexSubImage2D(Ct,F,At,jt,oe+Fn,Tt,Ft,ot,mt);lt.bindFramebuffer(D.READ_FRAMEBUFFER,null),lt.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else ce?T.isDataTexture||T.isData3DTexture?D.texSubImage3D(Ct,F,At,jt,oe,ot,mt,Et,ze,Qt,le.data):O.isCompressedArrayTexture?D.compressedTexSubImage3D(Ct,F,At,jt,oe,ot,mt,Et,ze,le.data):D.texSubImage3D(Ct,F,At,jt,oe,ot,mt,Et,ze,Qt,le):T.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,F,At,jt,ot,mt,ze,Qt,le.data):T.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,F,At,jt,le.width,le.height,ze,le.data):D.texSubImage2D(D.TEXTURE_2D,F,At,jt,ot,mt,ze,Qt,le);D.pixelStorei(D.UNPACK_ROW_LENGTH,yn),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,te),D.pixelStorei(D.UNPACK_SKIP_PIXELS,tn),D.pixelStorei(D.UNPACK_SKIP_ROWS,Si),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Ve),F===0&&O.generateMipmaps&&D.generateMipmap(Ct),lt.unbindTexture()},this.copyTextureToTexture3D=function(T,O,G=null,V=null,F=0){return T.isTexture!==!0&&(ys("WebGLRenderer: copyTextureToTexture3D function signature has changed."),G=arguments[0]||null,V=arguments[1]||null,T=arguments[2],O=arguments[3],F=arguments[4]||0),ys('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(T,O,G,V,F)},this.initRenderTarget=function(T){_t.get(T).__webglFramebuffer===void 0&&C.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?C.setTextureCube(T,0):T.isData3DTexture?C.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?C.setTexture2DArray(T,0):C.setTexture2D(T,0),lt.unbindTexture()},this.resetState=function(){E=0,A=0,L=null,lt.reset(),re.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ln}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Yt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Yt._getUnpackColorSpace()}}class oo{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Nt(t),this.near=e,this.far=n}clone(){return new oo(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class j_ extends we{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new _n,this.environmentIntensity=1,this.environmentRotation=new _n,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class J_ extends Be{constructor(t=null,e=1,n=1,s,r,o,a,l,c=be,h=be,u,d){super(null,o,a,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Nl extends Jn{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Nt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Yr=new P,$r=new P,oh=new ae,ds=new Vs,mr=new is,Vo=new P,ah=new P;class Q_ extends we{constructor(t=new Ae,e=new Nl){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Yr.fromBufferAttribute(e,s-1),$r.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Yr.distanceTo($r);t.setAttribute("lineDistance",new Zt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),mr.copy(n.boundingSphere),mr.applyMatrix4(s),mr.radius+=r,t.ray.intersectsSphere(mr)===!1)return;oh.copy(s).invert(),ds.copy(t.ray).applyMatrix4(oh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const p=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let x=p,m=g-1;x<m;x+=c){const f=h.getX(x),_=h.getX(x+1),v=gr(this,t,ds,l,f,_);v&&e.push(v)}if(this.isLineLoop){const x=h.getX(g-1),m=h.getX(p),f=gr(this,t,ds,l,x,m);f&&e.push(f)}}else{const p=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let x=p,m=g-1;x<m;x+=c){const f=gr(this,t,ds,l,x,x+1);f&&e.push(f)}if(this.isLineLoop){const x=gr(this,t,ds,l,g-1,p);x&&e.push(x)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function gr(i,t,e,n,s,r){const o=i.geometry.attributes.position;if(Yr.fromBufferAttribute(o,s),$r.fromBufferAttribute(o,r),e.distanceSqToSegment(Yr,$r,Vo,ah)>n)return;Vo.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(Vo);if(!(l<t.near||l>t.far))return{distance:l,point:ah.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const lh=new P,ch=new P;class ao extends Q_{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)lh.fromBufferAttribute(e,s),ch.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+lh.distanceTo(ch);t.setAttribute("lineDistance",new Zt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class tv extends Jn{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new Nt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const hh=new ae,cl=new Vs,_r=new is,vr=new P;class ev extends we{constructor(t=new Ae,e=new tv){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),_r.copy(n.boundingSphere),_r.applyMatrix4(s),_r.radius+=r,t.ray.intersectsSphere(_r)===!1)return;hh.copy(s).invert(),cl.copy(t.ray).applyMatrix4(hh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){const d=Math.max(0,o.start),p=Math.min(c.count,o.start+o.count);for(let g=d,x=p;g<x;g++){const m=c.getX(g);vr.fromBufferAttribute(u,m),uh(vr,m,l,s,t,e,this)}}else{const d=Math.max(0,o.start),p=Math.min(u.count,o.start+o.count);for(let g=d,x=p;g<x;g++)vr.fromBufferAttribute(u,g),uh(vr,g,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function uh(i,t,e,n,s,r,o){const a=cl.distanceSqToPoint(i);if(a<e){const l=new P;cl.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class vn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);const h=n[s],d=n[s+1]-h,p=(o-h)/d;return(s+p)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),l=e||(o.isVector2?new et:new P);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new P,s=[],r=[],o=[],a=new P,l=new ae;for(let p=0;p<=t;p++){const g=p/t;s[p]=this.getTangentAt(g,new P)}r[0]=new P,o[0]=new P;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let p=1;p<=t;p++){if(r[p]=r[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(s[p-1],s[p]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Se(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(a,g))}o[p].crossVectors(s[p],r[p])}if(e===!0){let p=Math.acos(Se(r[0].dot(r[t]),-1,1));p/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(p=-p);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],p*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Ol extends vn{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new et){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,p=c-this.aY;l=d*h-p*u+this.aX,c=d*u+p*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class nv extends Ol{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Fl(){let i=0,t=0,e=0,n=0;function s(r,o,a,l){i=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let d=(o-r)/c-(a-r)/(c+h)+(a-o)/h,p=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,p*=h,s(o,a,d,p)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const xr=new P,Wo=new Fl,Xo=new Fl,qo=new Fl;class iv extends vn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new P){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(xr.subVectors(s[0],s[1]).add(s[0]),c=xr);const u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(xr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=xr),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),p),x=Math.pow(u.distanceToSquared(d),p),m=Math.pow(d.distanceToSquared(h),p);x<1e-4&&(x=1),g<1e-4&&(g=x),m<1e-4&&(m=x),Wo.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,x,m),Xo.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,x,m),qo.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,x,m)}else this.curveType==="catmullrom"&&(Wo.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),Xo.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),qo.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(Wo.calc(l),Xo.calc(l),qo.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new P().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function dh(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,l=i*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*i+e}function sv(i,t){const e=1-i;return e*e*t}function rv(i,t){return 2*(1-i)*i*t}function ov(i,t){return i*i*t}function Ts(i,t,e,n){return sv(i,t)+rv(i,e)+ov(i,n)}function av(i,t){const e=1-i;return e*e*e*t}function lv(i,t){const e=1-i;return 3*e*e*i*t}function cv(i,t){return 3*(1-i)*i*i*t}function hv(i,t){return i*i*i*t}function As(i,t,e,n,s){return av(i,t)+lv(i,e)+cv(i,n)+hv(i,s)}class Zu extends vn{constructor(t=new et,e=new et,n=new et,s=new et){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new et){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(As(t,s.x,r.x,o.x,a.x),As(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class uv extends vn{constructor(t=new P,e=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new P){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(As(t,s.x,r.x,o.x,a.x),As(t,s.y,r.y,o.y,a.y),As(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class ju extends vn{constructor(t=new et,e=new et){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new et){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new et){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class dv extends vn{constructor(t=new P,e=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new P){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new P){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ju extends vn{constructor(t=new et,e=new et,n=new et){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new et){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Ts(t,s.x,r.x,o.x),Ts(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class fv extends vn{constructor(t=new P,e=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new P){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Ts(t,s.x,r.x,o.x),Ts(t,s.y,r.y,o.y),Ts(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Qu extends vn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new et){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(dh(a,l.x,c.x,h.x,u.x),dh(a,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new et().fromArray(s))}return this}}var hl=Object.freeze({__proto__:null,ArcCurve:nv,CatmullRomCurve3:iv,CubicBezierCurve:Zu,CubicBezierCurve3:uv,EllipseCurve:Ol,LineCurve:ju,LineCurve3:dv,QuadraticBezierCurve:Ju,QuadraticBezierCurve3:fv,SplineCurve:Qu});class pv extends vn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new hl[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new hl[s.type]().fromJSON(s))}return this}}class fh extends pv{constructor(t){super(),this.type="Path",this.currentPoint=new et,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new ju(this.currentPoint.clone(),new et(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Ju(this.currentPoint.clone(),new et(t,e),new et(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){const a=new Zu(this.currentPoint.clone(),new et(t,e),new et(n,s),new et(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Qu(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,o,a,l),this}absellipse(t,e,n,s,r,o,a,l){const c=new Ol(t,e,n,s,r,o,a,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Bl extends Ae{constructor(t=[new et(0,-.5),new et(.5,0),new et(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Se(s,0,Math.PI*2);const r=[],o=[],a=[],l=[],c=[],h=1/e,u=new P,d=new et,p=new P,g=new P,x=new P;let m=0,f=0;for(let _=0;_<=t.length-1;_++)switch(_){case 0:m=t[_+1].x-t[_].x,f=t[_+1].y-t[_].y,p.x=f*1,p.y=-m,p.z=f*0,x.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case t.length-1:l.push(x.x,x.y,x.z);break;default:m=t[_+1].x-t[_].x,f=t[_+1].y-t[_].y,p.x=f*1,p.y=-m,p.z=f*0,g.copy(p),p.x+=x.x,p.y+=x.y,p.z+=x.z,p.normalize(),l.push(p.x,p.y,p.z),x.copy(g)}for(let _=0;_<=e;_++){const v=n+_*h*s,y=Math.sin(v),w=Math.cos(v);for(let E=0;E<=t.length-1;E++){u.x=t[E].x*y,u.y=t[E].y,u.z=t[E].x*w,o.push(u.x,u.y,u.z),d.x=_/e,d.y=E/(t.length-1),a.push(d.x,d.y);const A=l[3*E+0]*y,L=l[3*E+1],S=l[3*E+0]*w;c.push(A,L,S)}}for(let _=0;_<e;_++)for(let v=0;v<t.length-1;v++){const y=v+_*t.length,w=y,E=y+t.length,A=y+t.length+1,L=y+1;r.push(w,E,L),r.push(A,L,E)}this.setIndex(r),this.setAttribute("position",new Zt(o,3)),this.setAttribute("uv",new Zt(a,2)),this.setAttribute("normal",new Zt(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Bl(t.points,t.segments,t.phiStart,t.phiLength)}}class Bt extends Ae{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],d=[],p=[];let g=0;const x=[],m=n/2;let f=0;_(),o===!1&&(t>0&&v(!0),e>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new Zt(u,3)),this.setAttribute("normal",new Zt(d,3)),this.setAttribute("uv",new Zt(p,2));function _(){const y=new P,w=new P;let E=0;const A=(e-t)/n;for(let L=0;L<=r;L++){const S=[],M=L/r,R=M*(e-t)+t;for(let I=0;I<=s;I++){const U=I/s,B=U*l+a,q=Math.sin(B),H=Math.cos(B);w.x=R*q,w.y=-M*n+m,w.z=R*H,u.push(w.x,w.y,w.z),y.set(q,A,H).normalize(),d.push(y.x,y.y,y.z),p.push(U,1-M),S.push(g++)}x.push(S)}for(let L=0;L<s;L++)for(let S=0;S<r;S++){const M=x[S][L],R=x[S+1][L],I=x[S+1][L+1],U=x[S][L+1];(t>0||S!==0)&&(h.push(M,R,U),E+=3),(e>0||S!==r-1)&&(h.push(R,I,U),E+=3)}c.addGroup(f,E,0),f+=E}function v(y){const w=g,E=new et,A=new P;let L=0;const S=y===!0?t:e,M=y===!0?1:-1;for(let I=1;I<=s;I++)u.push(0,m*M,0),d.push(0,M,0),p.push(.5,.5),g++;const R=g;for(let I=0;I<=s;I++){const B=I/s*l+a,q=Math.cos(B),H=Math.sin(B);A.x=S*H,A.y=m*M,A.z=S*q,u.push(A.x,A.y,A.z),d.push(0,M,0),E.x=q*.5+.5,E.y=H*.5*M+.5,p.push(E.x,E.y),g++}for(let I=0;I<s;I++){const U=w+I,B=R+I;y===!0?h.push(B,B+1,U):h.push(B+1,B,U),L+=3}c.addGroup(f,L,y===!0?1:2),f+=L}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Bt(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Pe extends Bt{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Pe(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class lo extends Ae{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],o=[];a(s),c(n),h(),this.setAttribute("position",new Zt(r,3)),this.setAttribute("normal",new Zt(r.slice(),3)),this.setAttribute("uv",new Zt(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(_){const v=new P,y=new P,w=new P;for(let E=0;E<e.length;E+=3)p(e[E+0],v),p(e[E+1],y),p(e[E+2],w),l(v,y,w,_)}function l(_,v,y,w){const E=w+1,A=[];for(let L=0;L<=E;L++){A[L]=[];const S=_.clone().lerp(y,L/E),M=v.clone().lerp(y,L/E),R=E-L;for(let I=0;I<=R;I++)I===0&&L===E?A[L][I]=S:A[L][I]=S.clone().lerp(M,I/R)}for(let L=0;L<E;L++)for(let S=0;S<2*(E-L)-1;S++){const M=Math.floor(S/2);S%2===0?(d(A[L][M+1]),d(A[L+1][M]),d(A[L][M])):(d(A[L][M+1]),d(A[L+1][M+1]),d(A[L+1][M]))}}function c(_){const v=new P;for(let y=0;y<r.length;y+=3)v.x=r[y+0],v.y=r[y+1],v.z=r[y+2],v.normalize().multiplyScalar(_),r[y+0]=v.x,r[y+1]=v.y,r[y+2]=v.z}function h(){const _=new P;for(let v=0;v<r.length;v+=3){_.x=r[v+0],_.y=r[v+1],_.z=r[v+2];const y=m(_)/2/Math.PI+.5,w=f(_)/Math.PI+.5;o.push(y,1-w)}g(),u()}function u(){for(let _=0;_<o.length;_+=6){const v=o[_+0],y=o[_+2],w=o[_+4],E=Math.max(v,y,w),A=Math.min(v,y,w);E>.9&&A<.1&&(v<.2&&(o[_+0]+=1),y<.2&&(o[_+2]+=1),w<.2&&(o[_+4]+=1))}}function d(_){r.push(_.x,_.y,_.z)}function p(_,v){const y=_*3;v.x=t[y+0],v.y=t[y+1],v.z=t[y+2]}function g(){const _=new P,v=new P,y=new P,w=new P,E=new et,A=new et,L=new et;for(let S=0,M=0;S<r.length;S+=9,M+=6){_.set(r[S+0],r[S+1],r[S+2]),v.set(r[S+3],r[S+4],r[S+5]),y.set(r[S+6],r[S+7],r[S+8]),E.set(o[M+0],o[M+1]),A.set(o[M+2],o[M+3]),L.set(o[M+4],o[M+5]),w.copy(_).add(v).add(y).divideScalar(3);const R=m(w);x(E,M+0,_,R),x(A,M+2,v,R),x(L,M+4,y,R)}}function x(_,v,y,w){w<0&&_.x===1&&(o[v]=_.x-1),y.x===0&&y.z===0&&(o[v]=w/2/Math.PI+.5)}function m(_){return Math.atan2(_.z,-_.x)}function f(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new lo(t.vertices,t.indices,t.radius,t.details)}}class td extends fh{constructor(t){super(t),this.uuid=xi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new fh().fromJSON(s))}return this}}const mv={triangulate:function(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=ed(i,0,s,e,!0);const o=[];if(!r||r.next===r.prev)return o;let a,l,c,h,u,d,p;if(n&&(r=yv(i,t,r,e)),i.length>80*e){a=c=i[0],l=h=i[1];for(let g=e;g<s;g+=e)u=i[g],d=i[g+1],u<a&&(a=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);p=Math.max(c-a,h-l),p=p!==0?32767/p:0}return Os(r,o,e,a,l,p,0),o}};function ed(i,t,e,n,s){let r,o;if(s===Lv(i,t,e,n)>0)for(r=t;r<e;r+=n)o=ph(r,i[r],i[r+1],o);else for(r=e-n;r>=t;r-=n)o=ph(r,i[r],i[r+1],o);return o&&co(o,o.next)&&(Bs(o),o=o.next),o}function gi(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(co(e,e.next)||me(e.prev,e,e.next)===0)){if(Bs(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Os(i,t,e,n,s,r,o){if(!i)return;!o&&r&&Ev(i,n,s,r);let a=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,r?_v(i,n,s,r):gv(i)){t.push(l.i/e|0),t.push(i.i/e|0),t.push(c.i/e|0),Bs(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=vv(gi(i),t,e),Os(i,t,e,n,s,r,2)):o===2&&xv(i,t,e,n,s,r):Os(gi(i),t,e,n,s,r,1);break}}}function gv(i){const t=i.prev,e=i,n=i.next;if(me(t,e,n)>=0)return!1;const s=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,h=s<r?s<o?s:o:r<o?r:o,u=a<l?a<c?a:c:l<c?l:c,d=s>r?s>o?s:o:r>o?r:o,p=a>l?a>c?a:c:l>c?l:c;let g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=p&&Wi(s,a,r,l,o,c,g.x,g.y)&&me(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function _v(i,t,e,n){const s=i.prev,r=i,o=i.next;if(me(s,r,o)>=0)return!1;const a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,d=o.y,p=a<l?a<c?a:c:l<c?l:c,g=h<u?h<d?h:d:u<d?u:d,x=a>l?a>c?a:c:l>c?l:c,m=h>u?h>d?h:d:u>d?u:d,f=ul(p,g,t,e,n),_=ul(x,m,t,e,n);let v=i.prevZ,y=i.nextZ;for(;v&&v.z>=f&&y&&y.z<=_;){if(v.x>=p&&v.x<=x&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Wi(a,h,l,u,c,d,v.x,v.y)&&me(v.prev,v,v.next)>=0||(v=v.prevZ,y.x>=p&&y.x<=x&&y.y>=g&&y.y<=m&&y!==s&&y!==o&&Wi(a,h,l,u,c,d,y.x,y.y)&&me(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;v&&v.z>=f;){if(v.x>=p&&v.x<=x&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Wi(a,h,l,u,c,d,v.x,v.y)&&me(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;y&&y.z<=_;){if(y.x>=p&&y.x<=x&&y.y>=g&&y.y<=m&&y!==s&&y!==o&&Wi(a,h,l,u,c,d,y.x,y.y)&&me(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function vv(i,t,e){let n=i;do{const s=n.prev,r=n.next.next;!co(s,r)&&nd(s,n,n.next,r)&&Fs(s,r)&&Fs(r,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),Bs(n),Bs(n.next),n=i=r),n=n.next}while(n!==i);return gi(n)}function xv(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Rv(o,a)){let l=id(o,a);o=gi(o,o.next),l=gi(l,l.next),Os(o,t,e,n,s,r,0),Os(l,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function yv(i,t,e,n){const s=[];let r,o,a,l,c;for(r=0,o=t.length;r<o;r++)a=t[r]*n,l=r<o-1?t[r+1]*n:i.length,c=ed(i,a,l,n,!1),c===c.next&&(c.steiner=!0),s.push(Av(c));for(s.sort(Mv),r=0;r<s.length;r++)e=Sv(s[r],e);return e}function Mv(i,t){return i.x-t.x}function Sv(i,t){const e=bv(i,t);if(!e)return t;const n=id(e,i);return gi(n,n.next),gi(e,e.next)}function bv(i,t){let e=t,n=-1/0,s;const r=i.x,o=i.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=r&&d>n&&(n=d,s=e.x<e.next.x?e:e.next,d===r))return s}e=e.next}while(e!==t);if(!s)return null;const a=s,l=s.x,c=s.y;let h=1/0,u;e=s;do r>=e.x&&e.x>=l&&r!==e.x&&Wi(o<c?r:n,o,l,c,o<c?n:r,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(r-e.x),Fs(e,i)&&(u<h||u===h&&(e.x>s.x||e.x===s.x&&wv(s,e)))&&(s=e,h=u)),e=e.next;while(e!==a);return s}function wv(i,t){return me(i.prev,i,t.prev)<0&&me(t.next,i,i.next)<0}function Ev(i,t,e,n){let s=i;do s.z===0&&(s.z=ul(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Tv(s)}function Tv(i){let t,e,n,s,r,o,a,l,c=1;do{for(e=i,i=null,r=null,o=0;e;){for(o++,n=e,a=0,t=0;t<c&&(a++,n=n.nextZ,!!n);t++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,a--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;e=n}r.nextZ=null,c*=2}while(o>1);return i}function ul(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Av(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Wi(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function Rv(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Cv(i,t)&&(Fs(i,t)&&Fs(t,i)&&Pv(i,t)&&(me(i.prev,i,t.prev)||me(i,t.prev,t))||co(i,t)&&me(i.prev,i,i.next)>0&&me(t.prev,t,t.next)>0)}function me(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function co(i,t){return i.x===t.x&&i.y===t.y}function nd(i,t,e,n){const s=Mr(me(i,t,e)),r=Mr(me(i,t,n)),o=Mr(me(e,n,i)),a=Mr(me(e,n,t));return!!(s!==r&&o!==a||s===0&&yr(i,e,t)||r===0&&yr(i,n,t)||o===0&&yr(e,i,n)||a===0&&yr(e,t,n))}function yr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Mr(i){return i>0?1:i<0?-1:0}function Cv(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&nd(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Fs(i,t){return me(i.prev,i,i.next)<0?me(i,t,i.next)>=0&&me(i,i.prev,t)>=0:me(i,t,i.prev)<0||me(i,i.next,t)<0}function Pv(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function id(i,t){const e=new dl(i.i,i.x,i.y),n=new dl(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function ph(i,t,e,n){const s=new dl(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Bs(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function dl(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function Lv(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}class Rs{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Rs.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];mh(t),gh(n,t);let o=t.length;e.forEach(mh);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,gh(n,e[l]);const a=mv.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}}function mh(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function gh(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class zl extends Ae{constructor(t=new td([new et(.5,.5),new et(-.5,.5),new et(-.5,-.5),new et(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let a=0,l=t.length;a<l;a++){const c=t[a];o(c)}this.setAttribute("position",new Zt(s,3)),this.setAttribute("uv",new Zt(r,2)),this.computeVertexNormals();function o(a){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,p=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:p-.1,x=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const f=e.extrudePath,_=e.UVGenerator!==void 0?e.UVGenerator:Dv;let v,y=!1,w,E,A,L;f&&(v=f.getSpacedPoints(h),y=!0,d=!1,w=f.computeFrenetFrames(h,!1),E=new P,A=new P,L=new P),d||(m=0,p=0,g=0,x=0);const S=a.extractPoints(c);let M=S.shape;const R=S.holes;if(!Rs.isClockWise(M)){M=M.reverse();for(let j=0,st=R.length;j<st;j++){const D=R[j];Rs.isClockWise(D)&&(R[j]=D.reverse())}}const U=Rs.triangulateShape(M,R),B=M;for(let j=0,st=R.length;j<st;j++){const D=R[j];M=M.concat(D)}function q(j,st,D){return st||console.error("THREE.ExtrudeGeometry: vec does not exist"),j.clone().addScaledVector(st,D)}const H=M.length,Q=U.length;function W(j,st,D){let Rt,tt,xt;const lt=j.x-st.x,Lt=j.y-st.y,_t=D.x-j.x,C=D.y-j.y,b=lt*lt+Lt*Lt,k=lt*C-Lt*_t;if(Math.abs(k)>Number.EPSILON){const Y=Math.sqrt(b),J=Math.sqrt(_t*_t+C*C),$=st.x-Lt/Y,wt=st.y+lt/Y,ut=D.x-C/J,vt=D.y+_t/J,Xt=((ut-$)*C-(vt-wt)*_t)/(lt*C-Lt*_t);Rt=$+lt*Xt-j.x,tt=wt+Lt*Xt-j.y;const nt=Rt*Rt+tt*tt;if(nt<=2)return new et(Rt,tt);xt=Math.sqrt(nt/2)}else{let Y=!1;lt>Number.EPSILON?_t>Number.EPSILON&&(Y=!0):lt<-Number.EPSILON?_t<-Number.EPSILON&&(Y=!0):Math.sign(Lt)===Math.sign(C)&&(Y=!0),Y?(Rt=-Lt,tt=lt,xt=Math.sqrt(b)):(Rt=lt,tt=Lt,xt=Math.sqrt(b/2))}return new et(Rt/xt,tt/xt)}const ct=[];for(let j=0,st=B.length,D=st-1,Rt=j+1;j<st;j++,D++,Rt++)D===st&&(D=0),Rt===st&&(Rt=0),ct[j]=W(B[j],B[D],B[Rt]);const ft=[];let yt,zt=ct.concat();for(let j=0,st=R.length;j<st;j++){const D=R[j];yt=[];for(let Rt=0,tt=D.length,xt=tt-1,lt=Rt+1;Rt<tt;Rt++,xt++,lt++)xt===tt&&(xt=0),lt===tt&&(lt=0),yt[Rt]=W(D[Rt],D[xt],D[lt]);ft.push(yt),zt=zt.concat(yt)}for(let j=0;j<m;j++){const st=j/m,D=p*Math.cos(st*Math.PI/2),Rt=g*Math.sin(st*Math.PI/2)+x;for(let tt=0,xt=B.length;tt<xt;tt++){const lt=q(B[tt],ct[tt],Rt);at(lt.x,lt.y,-D)}for(let tt=0,xt=R.length;tt<xt;tt++){const lt=R[tt];yt=ft[tt];for(let Lt=0,_t=lt.length;Lt<_t;Lt++){const C=q(lt[Lt],yt[Lt],Rt);at(C.x,C.y,-D)}}}const Jt=g+x;for(let j=0;j<H;j++){const st=d?q(M[j],zt[j],Jt):M[j];y?(A.copy(w.normals[0]).multiplyScalar(st.x),E.copy(w.binormals[0]).multiplyScalar(st.y),L.copy(v[0]).add(A).add(E),at(L.x,L.y,L.z)):at(st.x,st.y,0)}for(let j=1;j<=h;j++)for(let st=0;st<H;st++){const D=d?q(M[st],zt[st],Jt):M[st];y?(A.copy(w.normals[j]).multiplyScalar(D.x),E.copy(w.binormals[j]).multiplyScalar(D.y),L.copy(v[j]).add(A).add(E),at(L.x,L.y,L.z)):at(D.x,D.y,u/h*j)}for(let j=m-1;j>=0;j--){const st=j/m,D=p*Math.cos(st*Math.PI/2),Rt=g*Math.sin(st*Math.PI/2)+x;for(let tt=0,xt=B.length;tt<xt;tt++){const lt=q(B[tt],ct[tt],Rt);at(lt.x,lt.y,u+D)}for(let tt=0,xt=R.length;tt<xt;tt++){const lt=R[tt];yt=ft[tt];for(let Lt=0,_t=lt.length;Lt<_t;Lt++){const C=q(lt[Lt],yt[Lt],Rt);y?at(C.x,C.y+v[h-1].y,v[h-1].x+D):at(C.x,C.y,u+D)}}}K(),rt();function K(){const j=s.length/3;if(d){let st=0,D=H*st;for(let Rt=0;Rt<Q;Rt++){const tt=U[Rt];Pt(tt[2]+D,tt[1]+D,tt[0]+D)}st=h+m*2,D=H*st;for(let Rt=0;Rt<Q;Rt++){const tt=U[Rt];Pt(tt[0]+D,tt[1]+D,tt[2]+D)}}else{for(let st=0;st<Q;st++){const D=U[st];Pt(D[2],D[1],D[0])}for(let st=0;st<Q;st++){const D=U[st];Pt(D[0]+H*h,D[1]+H*h,D[2]+H*h)}}n.addGroup(j,s.length/3-j,0)}function rt(){const j=s.length/3;let st=0;bt(B,st),st+=B.length;for(let D=0,Rt=R.length;D<Rt;D++){const tt=R[D];bt(tt,st),st+=tt.length}n.addGroup(j,s.length/3-j,1)}function bt(j,st){let D=j.length;for(;--D>=0;){const Rt=D;let tt=D-1;tt<0&&(tt=j.length-1);for(let xt=0,lt=h+m*2;xt<lt;xt++){const Lt=H*xt,_t=H*(xt+1),C=st+Rt+Lt,b=st+tt+Lt,k=st+tt+_t,Y=st+Rt+_t;Ot(C,b,k,Y)}}}function at(j,st,D){l.push(j),l.push(st),l.push(D)}function Pt(j,st,D){It(j),It(st),It(D);const Rt=s.length/3,tt=_.generateTopUV(n,s,Rt-3,Rt-2,Rt-1);$t(tt[0]),$t(tt[1]),$t(tt[2])}function Ot(j,st,D,Rt){It(j),It(st),It(Rt),It(st),It(D),It(Rt);const tt=s.length/3,xt=_.generateSideWallUV(n,s,tt-6,tt-3,tt-2,tt-1);$t(xt[0]),$t(xt[1]),$t(xt[3]),$t(xt[1]),$t(xt[2]),$t(xt[3])}function It(j){s.push(l[j*3+0]),s.push(l[j*3+1]),s.push(l[j*3+2])}function $t(j){r.push(j.x),r.push(j.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Iv(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,o=t.shapes.length;r<o;r++){const a=e[t.shapes[r]];n.push(a)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new hl[s.type]().fromJSON(s)),new zl(n,t.options)}}const Dv={generateTopUV:function(i,t,e,n,s){const r=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new et(r,o),new et(a,l),new et(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){const o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],u=t[n*3+2],d=t[s*3],p=t[s*3+1],g=t[s*3+2],x=t[r*3],m=t[r*3+1],f=t[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new et(o,1-l),new et(c,1-u),new et(d,1-g),new et(x,1-f)]:[new et(a,1-l),new et(h,1-u),new et(p,1-g),new et(m,1-f)]}};function Iv(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class ge extends lo{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ge(t.radius,t.detail)}}class ho extends lo{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ho(t.radius,t.detail)}}class uo extends Ae{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],u=new P,d=new P,p=[],g=[],x=[],m=[];for(let f=0;f<=n;f++){const _=[],v=f/n;let y=0;f===0&&o===0?y=.5/e:f===n&&l===Math.PI&&(y=-.5/e);for(let w=0;w<=e;w++){const E=w/e;u.x=-t*Math.cos(s+E*r)*Math.sin(o+v*a),u.y=t*Math.cos(o+v*a),u.z=t*Math.sin(s+E*r)*Math.sin(o+v*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),m.push(E+y,1-v),_.push(c++)}h.push(_)}for(let f=0;f<n;f++)for(let _=0;_<e;_++){const v=h[f][_+1],y=h[f][_],w=h[f+1][_],E=h[f+1][_+1];(f!==0||o>0)&&p.push(v,y,E),(f!==n-1||l<Math.PI)&&p.push(y,w,E)}this.setIndex(p),this.setAttribute("position",new Zt(g,3)),this.setAttribute("normal",new Zt(x,3)),this.setAttribute("uv",new Zt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new uo(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Uv extends Ye{static get type(){return"RawShaderMaterial"}constructor(t){super(t),this.isRawShaderMaterial=!0}}class Nv extends Jn{static get type(){return"MeshNormalMaterial"}constructor(t){super(),this.isMeshNormalMaterial=!0,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Cl,this.normalScale=new et(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}}class Dn extends Jn{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Nt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Nt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Cl,this.normalScale=new et(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.combine=Ml,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class sd extends we{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Nt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Ov extends sd{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(we.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Nt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Yo=new ae,_h=new P,vh=new P;class Fv{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new et(512,512),this.map=null,this.mapPass=null,this.matrix=new ae,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ll,this._frameExtents=new et(1,1),this._viewportCount=1,this._viewports=[new pe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;_h.setFromMatrixPosition(t.matrixWorld),e.position.copy(_h),vh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(vh),e.updateMatrixWorld(),Yo.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Yo),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Yo)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Bv extends Fv{constructor(){super(new Dl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class xh extends sd{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(we.DEFAULT_UP),this.updateMatrix(),this.target=new we,this.shadow=new Bv}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class zv{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=yh(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=yh();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function yh(){return performance.now()}const Mh=new ae;class kv{constructor(t,e,n=0,s=1/0){this.ray=new Vs(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new no,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Mh.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Mh),this}intersectObject(t,e=!0,n=[]){return fl(t,this,n,e),n.sort(Sh),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)fl(t[s],this,n,e);return n.sort(Sh),n}}function Sh(i,t){return i.distance-t.distance}function fl(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let o=0,a=r.length;o<a;o++)fl(r[o],t,e,!0)}}const bh=new P,Sr=new P;class kl{constructor(t=new P,e=new P){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){bh.subVectors(t,this.start),Sr.subVectors(this.end,this.start);const n=Sr.dot(Sr);let r=Sr.dot(bh)/n;return e&&(r=Se(r,0,1)),r}closestPointToPoint(t,e,n){const s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}class Hv extends ao{constructor(t=10,e=10,n=4473924,s=8947848){n=new Nt(n),s=new Nt(s);const r=e/2,o=t/e,a=t/2,l=[],c=[];for(let d=0,p=0,g=-a;d<=e;d++,g+=o){l.push(-a,0,g,a,0,g),l.push(g,0,-a,g,0,a);const x=d===r?n:s;x.toArray(c,p),p+=3,x.toArray(c,p),p+=3,x.toArray(c,p),p+=3,x.toArray(c,p),p+=3}const h=new Ae;h.setAttribute("position",new Zt(l,3)),h.setAttribute("color",new Zt(c,3));const u=new Nl({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class Gv extends ao{constructor(t=1){const e=[0,0,0,t,0,0,0,0,0,0,t,0,0,0,0,0,0,t],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new Ae;s.setAttribute("position",new Zt(e,3)),s.setAttribute("color",new Zt(n,3));const r=new Nl({vertexColors:!0,toneMapped:!1});super(s,r),this.type="AxesHelper"}setColors(t,e,n){const s=new Nt,r=this.geometry.attributes.color.array;return s.set(t),s.toArray(r,0),s.toArray(r,3),s.set(e),s.toArray(r,6),s.toArray(r,9),s.set(n),s.toArray(r,12),s.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:yl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=yl);class Vv{renderer;scene;camera;onResize=null;canvas;handleResize=()=>this.resize();constructor(t){this.canvas=t,this.renderer=new Z_({canvas:t,antialias:!1,powerPreference:"high-performance",stencil:!1}),this.renderer.setClearColor(657935,1),this.scene=new j_,this.camera=new je(70,1,.1,500),this.resize(),window.addEventListener("resize",this.handleResize),window.addEventListener("orientationchange",this.handleResize)}resize(){const t=this.canvas.clientWidth||window.innerWidth,e=this.canvas.clientHeight||window.innerHeight;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(t,e,!1),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.onResize?.()}render(){this.renderer.render(this.scene,this.camera)}dispose(){window.removeEventListener("resize",this.handleResize),window.removeEventListener("orientationchange",this.handleResize),this.renderer.dispose()}}class Wv{subscribers=new Set;handle=0;last=0;elapsed=0;running=!1;add(t){return this.subscribers.add(t),()=>this.subscribers.delete(t)}start(){if(this.running)return;this.running=!0,this.last=performance.now();const t=e=>{this.handle=requestAnimationFrame(t);const n=Math.min((e-this.last)/1e3,.1);this.last=e,this.elapsed+=n;for(const s of this.subscribers)s(n,this.elapsed)};this.handle=requestAnimationFrame(t)}stop(){this.running&&(cancelAnimationFrame(this.handle),this.running=!1)}}const Xv={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Ws{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const qv=new Dl(-1,1,1,-1,0,1);class Yv extends Ae{constructor(){super(),this.setAttribute("position",new Zt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Zt([0,2,0,0,2,0],2))}}const $v=new Yv;class Hl{constructor(t){this._mesh=new Kt($v,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,qv)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class rd extends Ws{constructor(t,e){super(),this.textureID=e!==void 0?e:"tDiffuse",t instanceof Ye?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=so.clone(t.uniforms),this.material=new Ye({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new Hl(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class wh extends Ws{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class Kv extends Ws{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class Zv{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new et);this._width=n.width,this._height=n.height,e=new gn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:jn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new rd(Xv),this.copyPass.material.blending=In,this.clock=new zv}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),o.needsSwap){if(n){const a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}wh!==void 0&&(o instanceof wh?n=!0:o instanceof Kv&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new et);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class jv extends Ws{constructor(t,e,n,s={}){super(),this.pixelSize=t,this.resolution=new et,this.renderResolution=new et,this.pixelatedMaterial=this.createPixelatedMaterial(),this.normalMaterial=new Nv,this.fsQuad=new Hl(this.pixelatedMaterial),this.scene=e,this.camera=n,this.normalEdgeStrength=s.normalEdgeStrength||.3,this.depthEdgeStrength=s.depthEdgeStrength||.4,this.beautyRenderTarget=new gn,this.beautyRenderTarget.texture.minFilter=be,this.beautyRenderTarget.texture.magFilter=be,this.beautyRenderTarget.texture.type=jn,this.beautyRenderTarget.depthTexture=new Ul,this.normalRenderTarget=new gn,this.normalRenderTarget.texture.minFilter=be,this.normalRenderTarget.texture.magFilter=be,this.normalRenderTarget.texture.type=jn}dispose(){this.beautyRenderTarget.dispose(),this.normalRenderTarget.dispose(),this.pixelatedMaterial.dispose(),this.normalMaterial.dispose(),this.fsQuad.dispose()}setSize(t,e){this.resolution.set(t,e),this.renderResolution.set(t/this.pixelSize|0,e/this.pixelSize|0);const{x:n,y:s}=this.renderResolution;this.beautyRenderTarget.setSize(n,s),this.normalRenderTarget.setSize(n,s),this.fsQuad.material.uniforms.resolution.value.set(n,s,1/n,1/s)}setPixelSize(t){this.pixelSize=t,this.setSize(this.resolution.x,this.resolution.y)}render(t,e){const n=this.fsQuad.material.uniforms;n.normalEdgeStrength.value=this.normalEdgeStrength,n.depthEdgeStrength.value=this.depthEdgeStrength,t.setRenderTarget(this.beautyRenderTarget),t.render(this.scene,this.camera);const s=this.scene.overrideMaterial;t.setRenderTarget(this.normalRenderTarget),this.scene.overrideMaterial=this.normalMaterial,t.render(this.scene,this.camera),this.scene.overrideMaterial=s,n.tDiffuse.value=this.beautyRenderTarget.texture,n.tDepth.value=this.beautyRenderTarget.depthTexture,n.tNormal.value=this.normalRenderTarget.texture,this.renderToScreen?t.setRenderTarget(null):(t.setRenderTarget(e),this.clear&&t.clear()),this.fsQuad.render(t)}createPixelatedMaterial(){return new Ye({uniforms:{tDiffuse:{value:null},tDepth:{value:null},tNormal:{value:null},resolution:{value:new pe(this.renderResolution.x,this.renderResolution.y,1/this.renderResolution.x,1/this.renderResolution.y)},normalEdgeStrength:{value:0},depthEdgeStrength:{value:0}},vertexShader:`
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
			`})}}const Jv={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class Qv extends Ws{constructor(){super();const t=Jv;this.uniforms=so.clone(t.uniforms),this.material=new Uv({name:t.name,uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.fsQuad=new Hl(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},Yt.getTransfer(this._outputColorSpace)===ne&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===xu?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===yu?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Mu?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Su?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===bu?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===wu&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const Kr=16,tx={name:"RetroShader",uniforms:{tDiffuse:{value:null},uPixelSize:{value:1},uDither:{value:.06},uPattern:{value:1},uMatrix:{value:8},tDither:{value:null},uDitherSize:{value:64},uQuantize:{value:1},uLevels:{value:8},uPalette:{value:[]},uPaletteCount:{value:0},uVignette:{value:.35},uVignetteRadius:{value:.55},uVignetteSoftness:{value:.6}},vertexShader:`
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
    uniform vec3 uPalette[${Kr}];
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

      for (int i = 0; i < ${Kr}; i++) {
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
  `},Eh=1.9,br=5,ex=.1;function nx(i){let t=i>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function ix(i,t=2654435769){const e=i*i,n=new Uint8Array(e),s=new Float32Array(e),r=[],o=[];for(let f=-br;f<=br;f++)for(let _=-br;_<=br;_++)r.push(_,f),o.push(Math.exp(-(_*_+f*f)/(2*Eh*Eh)));const a=o.length,l=(f,_)=>{const v=f%i,y=f/i|0;for(let w=0;w<a;w++){const E=(v+r[w*2]+i)%i,A=(y+r[w*2+1]+i)%i;s[A*i+E]+=_*o[w]}},c=(f,_)=>{let v=-1,y=_?-1/0:1/0;for(let w=0;w<e;w++){if(n[w]!==f)continue;const E=s[w];(_?E>y:E<y)&&(y=E,v=w)}return v},h=nx(t),u=Math.max(1,Math.round(e*ex));let d=0;for(;d<u;){const f=h()*e|0;n[f]!==1&&(n[f]=1,l(f,1),d++)}for(let f=0;f<e*4;f++){const _=c(1,!0);n[_]=0,l(_,-1);const v=c(0,!1);if(v===_){n[_]=1,l(_,1);break}n[v]=1,l(v,1)}const p=n.slice(),g=s.slice(),x=new Int32Array(e).fill(-1);for(let f=u-1;f>=0;f--){const _=c(1,!0);n[_]=0,l(_,-1),x[_]=f}n.set(p),s.set(g);for(let f=u;f<e;f++){const _=c(0,!1);n[_]=1,l(_,1),x[_]=f}const m=new Uint8Array(new ArrayBuffer(e));for(let f=0;f<e;f++)m[f]=Math.min(255,(x[f]+.5)/e*256);return m}const sx=400,$o={uniforms:{uHorizon:{value:new Nt},uZenith:{value:new Nt},uGround:{value:new Nt},uCurve:{value:1},uCloudColor:{value:new Nt},uCloudCover:{value:.5},uCloudSoftness:{value:.2},uCloudScale:{value:1.2},uCloudOpacity:{value:1},uCloudDrift:{value:.01},uTime:{value:0}},vertexShader:`
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
  `},od={horizon:"#bcd4e6",zenith:"#3f7fbf",ground:"#5d6469",curve:.35,cloudColor:"#f2f5f8",cloudCover:.5,cloudSoftness:.22,cloudScale:1.1,cloudOpacity:.95,cloudDrift:.012};class rx{mesh;material;constructor(){this.material=new Ye({name:"Sky",uniforms:so.clone($o.uniforms),vertexShader:$o.vertexShader,fragmentShader:$o.fragmentShader,side:Fe,depthWrite:!1,depthTest:!1,fog:!1}),this.mesh=new Kt(new uo(sx,32,16),this.material),this.mesh.name="Sky",this.mesh.renderOrder=-1,this.mesh.frustumCulled=!1}apply(t){const e=this.material.uniforms;e.uHorizon.value.set(t.horizon),e.uZenith.value.set(t.zenith),e.uGround.value.set(t.ground),e.uCloudColor.value.set(t.cloudColor),e.uCurve.value=t.curve,e.uCloudCover.value=t.cloudCover,e.uCloudSoftness.value=t.cloudSoftness,e.uCloudScale.value=t.cloudScale,e.uCloudOpacity.value=t.cloudOpacity,e.uCloudDrift.value=t.cloudDrift}follow(t,e){this.mesh.position.setFromMatrixPosition(t.matrixWorld),this.material.uniforms.uTime.value=e}dispose(){this.mesh.geometry.dispose(),this.material.dispose()}}const Gl="hswow.preset.";function ox(i){try{const t=window.localStorage.getItem(Gl+i);if(t===null)return null;const e=JSON.parse(t);return typeof e!="object"||e===null?null:e}catch{return null}}function ax(i,t){try{return window.localStorage.setItem(Gl+i,JSON.stringify(t)),!0}catch{return!1}}function lx(i){try{window.localStorage.removeItem(Gl+i)}catch{}}const Ko="render",wr=64,cx=["#0a0a0f","#141a24","#1e2733","#2e3640","#3d4a54","#525f66","#6f7a7d","#8d9491","#b0b3a8","#dcdcc8","#3a2f28","#5c3a2e","#7a5238","#9a7248","#b08040","#c9a25e"],Th={pixelSize:3,normalEdgeStrength:.3,depthEdgeStrength:.4,ditherScale:.6,ditherPattern:"bayer",ditherMatrix:8,quantize:"levels",levels:5,palette:[...cx],vignetteStrength:0,vignetteRadius:.5,vignetteSoftness:.7,sky:{...od},linkFogToSky:!0,fogColor:"#bcd4e6",fogNear:25,fogFar:140},hx={off:0,levels:1,palette:2},Ah={bayer:0,blue:1,noise:2};class ux{settings;viewport;composer;pixelPass;retroPass;sky=new rx;paletteBuffer=new Float32Array(Kr*3);ditherTexture=null;air=null;constructor(t){this.viewport=t;const e=ox(Ko)??{};this.settings={...Th,...e,sky:{...od,...e.sky}},t.scene.add(this.sky.mesh),this.composer=new Zv(t.renderer),this.pixelPass=new jv(1,t.scene,t.camera),this.retroPass=new rd(tx),this.composer.addPass(this.pixelPass),this.composer.addPass(new Qv),this.composer.addPass(this.retroPass),this.retroPass.uniforms.uPalette.value=this.paletteBuffer,this.retroPass.uniforms.uDitherSize.value=wr,this.resize(),this.apply()}setEnvironment(t){this.air=t,this.apply()}apply(){const t=this.settings,e=this.viewport.renderer.getPixelRatio(),n=Math.max(1,Math.round(t.pixelSize*e));this.pixelPass.pixelSize!==n&&this.pixelPass.setPixelSize(n),this.pixelPass.normalEdgeStrength=t.normalEdgeStrength,this.pixelPass.depthEdgeStrength=t.depthEdgeStrength;const s=this.retroPass.uniforms;s.uPixelSize.value=n;const r=1/Math.max(t.levels-1,1);s.uDither.value=t.ditherScale*r,s.uPattern.value=Ah[t.ditherPattern]??Ah.bayer,s.uMatrix.value=t.ditherMatrix,t.ditherPattern==="blue"&&this.ensureBlueNoise(),s.uQuantize.value=hx[t.quantize],s.uLevels.value=t.levels,s.uVignette.value=t.vignetteStrength,s.uVignetteRadius.value=t.vignetteRadius,s.uVignetteSoftness.value=t.vignetteSoftness;const o=Math.min(t.palette.length,Kr);for(let l=0;l<o;l++)dx(t.palette[l],this.paletteBuffer,l*3);s.uPaletteCount.value=o,this.sky.apply(t.sky),this.sky.mesh.visible=this.air===null||this.air.sky;const a=this.viewport.scene.fog;a instanceof oo&&(this.air&&!this.air.sky?a.color.set(this.air.fogColor):t.linkFogToSky?a.color.set(t.sky.horizon):a.color.set(this.air?.fogColor??t.fogColor),a.near=this.air?.fogNear??t.fogNear,a.far=this.air?.fogFar??t.fogFar,this.viewport.renderer.setClearColor(a.color,1))}ensureBlueNoise(){this.ditherTexture===null&&(this.ditherTexture=new J_(ix(wr),wr,wr,El),this.ditherTexture.magFilter=be,this.ditherTexture.minFilter=be,this.ditherTexture.wrapS=Is,this.ditherTexture.wrapT=Is,this.ditherTexture.needsUpdate=!0,this.retroPass.uniforms.tDither.value=this.ditherTexture)}render(t){this.sky.follow(this.viewport.camera,t),this.composer.render()}resize(){const t=this.viewport.renderer.getSize(new et);this.composer.setPixelRatio(this.viewport.renderer.getPixelRatio()),this.composer.setSize(t.x,t.y),this.apply()}save(){return ax(Ko,this.settings)}reset(){lx(Ko),Object.assign(this.settings,structuredClone(Th)),this.apply()}dispose(){this.ditherTexture?.dispose(),this.viewport.scene.remove(this.sky.mesh),this.sky.dispose(),this.composer.dispose()}}function dx(i,t,e){const n=Number.parseInt(i.replace("#",""),16);t[e]=(n>>16&255)/255,t[e+1]=(n>>8&255)/255,t[e+2]=(n&255)/255}const Zo=new URLSearchParams(window.location.search),ad={debug:Zo.has("debug"),level:Zo.get("level")??"proving",touch:Zo.has("touch")},fx=["KeyW","ArrowUp"],px=["KeyS","ArrowDown"],mx=["KeyA","ArrowLeft"],gx=["KeyD","ArrowRight"],_x=["ShiftLeft","ShiftRight"],Rh=["Space"],vx=["KeyE"],Er=200;class xx{lookX=0;lookY=0;locked=!1;needsCapture;onLockChange=null;canvas;keys=new Set;stickX=0;stickZ=0;stickSprint=!1;jumpPressedAt=0;jumpHeld=!1;interactPressed=!1;settling=!1;constructor(t){this.canvas=t,this.needsCapture=!ld(),window.addEventListener("keydown",this.handleKeyDown),window.addEventListener("keyup",this.handleKeyUp),window.addEventListener("blur",this.handleBlur),this.needsCapture?(t.addEventListener("pointerdown",this.handleCanvasPointerDown),document.addEventListener("pointerlockchange",this.handleLockChange),document.addEventListener("mousemove",this.handleMouseMove)):this.locked=!0}get moveX(){const t=Ch(this.pressed(gx),this.pressed(mx));return Tr(t+this.stickX,-1,1)}get moveZ(){const t=Ch(this.pressed(fx),this.pressed(px));return Tr(t+this.stickZ,-1,1)}get sprint(){return this.pressed(_x)||this.stickSprint}get jumping(){return this.jumpHeld}takeJump(t){return this.jumpPressedAt===0||(performance.now()-this.jumpPressedAt)/1e3>t?!1:(this.jumpPressedAt=0,!0)}takeInteract(){return this.interactPressed?(this.interactPressed=!1,!0):!1}drainLook(t){t.x=this.lookX,t.y=this.lookY,this.lookX=0,this.lookY=0}setStick(t,e,n){this.stickX=t,this.stickZ=e,this.stickSprint=n}addLook(t,e){this.lookX+=t,this.lookY+=e}pressJump(){this.jumpPressedAt=performance.now(),this.jumpHeld=!0}releaseJump(){this.jumpHeld=!1}pressInteract(){this.interactPressed=!0}pressed(t){return t.some(e=>this.keys.has(e))}handleKeyDown=t=>{if(t.code==="Tab"&&this.locked){t.preventDefault();return}t.repeat||(this.keys.add(t.code),Rh.includes(t.code)&&(t.preventDefault(),this.pressJump()),vx.includes(t.code)&&this.locked&&this.pressInteract())};handleKeyUp=t=>{this.keys.delete(t.code),Rh.includes(t.code)&&this.releaseJump()};handleBlur=()=>{this.keys.clear(),this.releaseJump()};handleCanvasPointerDown=t=>{this.locked||t.button!==0||this.requestLock()};async requestLock(){try{await this.canvas.requestPointerLock({unadjustedMovement:!0})}catch{try{await this.canvas.requestPointerLock()}catch{}}}handleLockChange=()=>{this.locked=document.pointerLockElement===this.canvas,this.locked||this.keys.clear(),this.lookX=0,this.lookY=0,this.settling=this.locked,this.onLockChange?.(this.locked)};handleMouseMove=t=>{if(this.locked){if(this.settling){this.settling=!1;return}this.lookX+=Tr(t.movementX,-Er,Er),this.lookY+=Tr(t.movementY,-Er,Er)}};dispose(){window.removeEventListener("keydown",this.handleKeyDown),window.removeEventListener("keyup",this.handleKeyUp),window.removeEventListener("blur",this.handleBlur),this.canvas.removeEventListener("pointerdown",this.handleCanvasPointerDown),document.removeEventListener("pointerlockchange",this.handleLockChange),document.removeEventListener("mousemove",this.handleMouseMove)}}function ld(){return ad.touch||window.matchMedia("(pointer: coarse)").matches}function Ch(i,t){return(i?1:0)-(t?1:0)}function Tr(i,t,e){return Math.min(Math.max(i,t),e)}class Xs{constructor(t=new P(0,0,0),e=new P(0,1,0),n=1){this.start=t,this.end=e,this.radius=n}clone(){return new Xs(this.start.clone(),this.end.clone(),this.radius)}set(t,e,n){this.start.copy(t),this.end.copy(e),this.radius=n}copy(t){this.start.copy(t.start),this.end.copy(t.end),this.radius=t.radius}getCenter(t){return t.copy(this.end).add(this.start).multiplyScalar(.5)}translate(t){this.start.add(t),this.end.add(t)}checkAABBAxis(t,e,n,s,r,o,a,l,c){return(r-t<c||r-n<c)&&(t-o<c||n-o<c)&&(a-e<c||a-s<c)&&(e-l<c||s-l<c)}intersectsBox(t){return this.checkAABBAxis(this.start.x,this.start.y,this.end.x,this.end.y,t.min.x,t.max.x,t.min.y,t.max.y,this.radius)&&this.checkAABBAxis(this.start.x,this.start.z,this.end.x,this.end.z,t.min.x,t.max.x,t.min.z,t.max.z,this.radius)&&this.checkAABBAxis(this.start.y,this.start.z,this.end.y,this.end.z,t.min.y,t.max.y,t.min.z,t.max.z,this.radius)}}const fs=new P,ps=new P,Ar=new P,ms=new P,ln=new Xn,jo=new kl,yx=new kl,Rr=new is,gs=new Xs,Mx=new P,Sx=new P,bx=new P,wx=1e-10;function Ex(i,t,e=null,n=null){const s=Mx.copy(i.end).sub(i.start),r=Sx.copy(t.end).sub(t.start),o=bx.copy(t.start).sub(i.start),a=s.dot(r),l=s.dot(s),c=r.dot(r),h=r.dot(o),u=s.dot(o);let d,p;const g=l*c-a*a;if(Math.abs(g)<wx){const x=-h/c,m=(a-h)/c;Math.abs(x-.5)<Math.abs(m-.5)?(d=0,p=x):(d=1,p=m)}else d=(h*a+u*c)/g,p=(d*a-h)/c;p=Math.max(0,Math.min(1,p)),d=Math.max(0,Math.min(1,d)),e&&e.copy(s).multiplyScalar(d).add(i.start),n&&n.copy(r).multiplyScalar(p).add(t.start)}class Zr{constructor(t){this.box=t,this.bounds=new mi,this.subTrees=[],this.triangles=[],this.layers=new no}addTriangle(t){return this.bounds.min.x=Math.min(this.bounds.min.x,t.a.x,t.b.x,t.c.x),this.bounds.min.y=Math.min(this.bounds.min.y,t.a.y,t.b.y,t.c.y),this.bounds.min.z=Math.min(this.bounds.min.z,t.a.z,t.b.z,t.c.z),this.bounds.max.x=Math.max(this.bounds.max.x,t.a.x,t.b.x,t.c.x),this.bounds.max.y=Math.max(this.bounds.max.y,t.a.y,t.b.y,t.c.y),this.bounds.max.z=Math.max(this.bounds.max.z,t.a.z,t.b.z,t.c.z),this.triangles.push(t),this}calcBox(){return this.box=this.bounds.clone(),this.box.min.x-=.01,this.box.min.y-=.01,this.box.min.z-=.01,this}split(t){if(!this.box)return;const e=[],n=ps.copy(this.box.max).sub(this.box.min).multiplyScalar(.5);for(let r=0;r<2;r++)for(let o=0;o<2;o++)for(let a=0;a<2;a++){const l=new mi,c=fs.set(r,o,a);l.min.copy(this.box.min).add(c.multiply(n)),l.max.copy(l.min).add(n),e.push(new Zr(l))}let s;for(;s=this.triangles.pop();)for(let r=0;r<e.length;r++)e[r].box.intersectsTriangle(s)&&e[r].triangles.push(s);for(let r=0;r<e.length;r++){const o=e[r].triangles.length;o>8&&t<16&&e[r].split(t+1),o!==0&&this.subTrees.push(e[r])}return this}build(){return this.calcBox(),this.split(0),this}getRayTriangles(t,e){for(let n=0;n<this.subTrees.length;n++){const s=this.subTrees[n];if(t.intersectsBox(s.box))if(s.triangles.length>0)for(let r=0;r<s.triangles.length;r++)e.indexOf(s.triangles[r])===-1&&e.push(s.triangles[r]);else s.getRayTriangles(t,e)}return e}triangleCapsuleIntersect(t,e){e.getPlane(ln);const n=ln.distanceToPoint(t.start)-t.radius,s=ln.distanceToPoint(t.end)-t.radius;if(n>0&&s>0||n<-t.radius&&s<-t.radius)return!1;const r=Math.abs(n/(Math.abs(n)+Math.abs(s))),o=fs.copy(t.start).lerp(t.end,r);if(e.containsPoint(o))return{normal:ln.normal.clone(),point:o.clone(),depth:Math.abs(Math.min(n,s))};const a=t.radius*t.radius,l=jo.set(t.start,t.end),c=[[e.a,e.b],[e.b,e.c],[e.c,e.a]];for(let h=0;h<c.length;h++){const u=yx.set(c[h][0],c[h][1]);if(Ex(l,u,Ar,ms),Ar.distanceToSquared(ms)<a)return{normal:Ar.clone().sub(ms).normalize(),point:ms.clone(),depth:t.radius-Ar.distanceTo(ms)}}return!1}triangleSphereIntersect(t,e){if(e.getPlane(ln),!t.intersectsPlane(ln))return!1;const n=Math.abs(ln.distanceToSphere(t)),s=t.radius*t.radius-n*n,r=ln.projectPoint(t.center,fs);if(e.containsPoint(t.center))return{normal:ln.normal.clone(),point:r.clone(),depth:Math.abs(ln.distanceToSphere(t))};const o=[[e.a,e.b],[e.b,e.c],[e.c,e.a]];for(let a=0;a<o.length;a++){jo.set(o[a][0],o[a][1]),jo.closestPointToPoint(r,!0,ps);const l=ps.distanceToSquared(t.center);if(l<s)return{normal:t.center.clone().sub(ps).normalize(),point:ps.clone(),depth:t.radius-Math.sqrt(l)}}return!1}getSphereTriangles(t,e){for(let n=0;n<this.subTrees.length;n++){const s=this.subTrees[n];if(t.intersectsBox(s.box))if(s.triangles.length>0)for(let r=0;r<s.triangles.length;r++)e.indexOf(s.triangles[r])===-1&&e.push(s.triangles[r]);else s.getSphereTriangles(t,e)}}getCapsuleTriangles(t,e){for(let n=0;n<this.subTrees.length;n++){const s=this.subTrees[n];if(t.intersectsBox(s.box))if(s.triangles.length>0)for(let r=0;r<s.triangles.length;r++)e.indexOf(s.triangles[r])===-1&&e.push(s.triangles[r]);else s.getCapsuleTriangles(t,e)}}sphereIntersect(t){Rr.copy(t);const e=[];let n,s=!1;this.getSphereTriangles(t,e);for(let r=0;r<e.length;r++)(n=this.triangleSphereIntersect(Rr,e[r]))&&(s=!0,Rr.center.add(n.normal.multiplyScalar(n.depth)));if(s){const r=Rr.center.clone().sub(t.center),o=r.length();return{normal:r.normalize(),depth:o}}return!1}capsuleIntersect(t){gs.copy(t);const e=[];let n,s=!1;this.getCapsuleTriangles(gs,e);for(let r=0;r<e.length;r++)(n=this.triangleCapsuleIntersect(gs,e[r]))&&(s=!0,gs.translate(n.normal.multiplyScalar(n.depth)));if(s){const r=gs.getCenter(new P).sub(t.getCenter(fs)),o=r.length();return{normal:r.normalize(),depth:o}}return!1}rayIntersect(t){if(t.direction.length()===0)return;const e=[];let n,s,r=1e100;this.getRayTriangles(t,e);for(let o=0;o<e.length;o++){const a=t.intersectTriangle(e[o].a,e[o].b,e[o].c,!0,fs);if(a){const l=a.sub(t.origin).length();r>l&&(s=a.clone().add(t.origin),r=l,n=e[o])}}return r<1e100?{distance:r,triangle:n,position:s}:!1}fromGraphNode(t){return t.updateWorldMatrix(!0,!0),t.traverse(e=>{if(e.isMesh===!0&&this.layers.test(e.layers)){let n,s=!1;e.geometry.index!==null?(s=!0,n=e.geometry.toNonIndexed()):n=e.geometry;const r=n.getAttribute("position");for(let o=0;o<r.count;o+=3){const a=new P().fromBufferAttribute(r,o),l=new P().fromBufferAttribute(r,o+1),c=new P().fromBufferAttribute(r,o+2);a.applyMatrix4(e.matrixWorld),l.applyMatrix4(e.matrixWorld),c.applyMatrix4(e.matrixWorld),this.addTriangle(new Je(a,l,c))}s&&n.dispose()}}),this.build(),this}clear(){return this.box=null,this.bounds.makeEmpty(),this.subTrees.length=0,this.triangles.length=0,this}}const cd=1;function Me(i){return i.traverse(t=>t.layers.enable(cd)),i}const Fi=[],Jo=new P,_s=new P,Qo=new P,Ph=new P,ta=new P,Lh=new P,Gi=new P,Dh=new kl,ea={normal:new P,depth:0};class jr{index={octree:new Zr,triangles:0};cache=new Map;build(t,e){if(e!==void 0){const s=this.cache.get(e);if(s){this.index=s;return}}const n=jr.index(t);e!==void 0&&this.cache.set(e,n),this.index=n}warm(t,e){this.cache.has(e)||this.cache.set(e,jr.index(t))}invalidate(t){this.cache.delete(t)}static index(t){const e=new Zr;return e.layers.disableAll(),e.layers.enable(cd),e.fromGraphNode(t),{octree:e,triangles:hd(e)}}get triangles(){return this.index.triangles}intersectCapsule(t){Fi.length=0,this.index.octree.getCapsuleTriangles(t,Fi);let e=0;for(const n of Fi){const s=Ih(t,n);s<=e||(e=s,ea.normal.copy(Gi))}return e===0?null:(ea.depth=e,ea)}overlaps(t){Fi.length=0,this.index.octree.getCapsuleTriangles(t,Fi);for(const e of Fi)if(Ih(t,e)>0)return!0;return!1}raycast(t,e){const n=this.index.octree.rayIntersect(new Vs(t,e));return n?n.distance:null}}function Ih(i,t){t.getNormal(_s),Jo.subVectors(i.end,i.start);const e=_s.dot(Jo);let n=0;Math.abs(e)>1e-6&&(n=_s.dot(Qo.subVectors(t.a,i.start))/e,n=Math.min(Math.max(n,0),1)),Qo.copy(i.start).addScaledVector(Jo,n),t.closestPointToPoint(Qo,Ph),Dh.set(i.start,i.end),Dh.closestPointToPoint(Ph,!0,ta),t.closestPointToPoint(ta,Lh),Gi.subVectors(ta,Lh);const s=Gi.length();return s>=i.radius||(s>1e-6?Gi.divideScalar(s):Gi.copy(_s),Gi.dot(_s)<=0)?0:i.radius-s}function hd(i){let t=i.triangles.length;for(const e of i.subTrees)t+=hd(e);return t}const na=1/120,Uh=16,Tx=4,Cr=6,Ax=.28,Rx={radius:.32,height:1.8,eyeHeight:1.62,walkSpeed:4.2,sprintScale:1.75,groundAccel:14,airAccel:3,friction:10,stopSpeed:1.6,gravity:26,jumpSpeed:7.2,coyoteTime:.12,jumpBuffer:.15,autoHop:!1,slopeLimitDeg:50,stepHeight:.45,lookSensitivity:.0022,invertY:!1,bobAmount:.02,bobSway:.012,bobRoll:.004,bobStepsPerSecond:1.9,bobSpeedInfluence:.5,firstStepFraction:.65,maxAirSpeed:1.12,fov:74,sprintFov:82,landDip:.02},cn=new P,Nh=new P,Pr=new P,ia=new P,Oh=new P,Lr=new P,sa=new P,Cx=new P,Dr=new P,Fh=new P,rn=new Xs,ra={x:0,y:0};let Px=class{tuning={...Rx};velocity=new P;onFootstep=null;onLand=null;onJump=null;camera;input;collider;capsule=new Xs;yaw=0;pitch=0;sprintFov=!1;groundNormal=new P(0,1,0);wishX=0;wishZ=0;grounded=!1;jumped=!1;timeOffGround=0;timeSinceLand=1/0;bobPhase=0;strideProgress=.65;dip=0;accumulator=0;constructor(t,e,n){this.camera=t,this.input=e,this.collider=n,this.camera.rotation.order="YXZ",this.camera.fov=this.tuning.fov,this.camera.updateProjectionMatrix(),this.teleport(new P(0,2,6),0)}teleport(t,e=this.yaw){const{radius:n,height:s}=this.tuning;this.capsule.set(new P(t.x,t.y+n,t.z),new P(t.x,t.y+s-n,t.z),n),this.velocity.set(0,0,0),this.yaw=e,this.grounded=!1}get position(){return Cx.copy(this.capsule.start).setY(this.capsule.start.y-this.tuning.radius)}get heading(){return this.yaw}get isGrounded(){return this.grounded}get speed(){return Math.hypot(this.velocity.x,this.velocity.z)}update(t){this.applyLook(),this.accumulator+=t;let e=0;for(;this.accumulator>=na&&e<Uh;)this.step(na),this.accumulator-=na,e+=1;e===Uh&&(this.accumulator=0),this.applyCamera(t)}applyLook(){this.input.drainLook(ra);const{lookSensitivity:t,invertY:e}=this.tuning;this.yaw-=ra.x*t,this.pitch-=ra.y*t*(e?-1:1);const n=Math.PI/2-.001;this.pitch=Math.min(Math.max(this.pitch,-n),n),this.yaw=this.yaw%(Math.PI*2)}step(t){const e=this.tuning;this.jumped=!1,this.grounded?(this.timeOffGround=0,this.timeSinceLand+=t,this.applyFriction(t)):(this.timeOffGround+=t,this.velocity.y-=e.gravity*t),this.applyWish(t),this.applyJump(),this.capAirSpeed();const n=this.grounded,s=-this.velocity.y;this.move(t),this.grounded&&!n&&(this.timeSinceLand=0,s>1&&(this.dip+=Math.min(s,18)*e.landDip,this.onLand?.(s))),this.advanceBob(t)}applyFriction(t){const e=this.tuning,n=this.velocity.length();if(n<1e-4){this.velocity.set(0,0,0);return}const s=Math.max(n,e.stopSpeed)*e.friction*t;this.velocity.multiplyScalar(Math.max(n-s,0)/n)}applyWish(t){const e=this.tuning,{moveX:n,moveZ:s}=this.input;Nh.set(-Math.sin(this.yaw),0,-Math.cos(this.yaw)),Pr.set(Math.cos(this.yaw),0,-Math.sin(this.yaw)),cn.set(0,0,0).addScaledVector(Nh,s).addScaledVector(Pr,n);const r=cn.length();if(r<1e-4){this.wishX=0,this.wishZ=0;return}if(cn.divideScalar(r),this.wishX=cn.x,this.wishZ=cn.z,this.grounded){cn.projectOnPlane(this.groundNormal);const h=cn.length();if(h<1e-4)return;cn.divideScalar(h)}const o=e.walkSpeed*Math.min(r,1)*(this.input.sprint?e.sprintScale:1),a=this.velocity.dot(cn),l=o-a;if(l<=0)return;const c=this.grounded?e.groundAccel:e.airAccel;this.velocity.addScaledVector(cn,Math.min(c*o*t,l))}capAirSpeed(){if(this.grounded)return;const t=this.tuning,e=t.walkSpeed*t.sprintScale*t.maxAirSpeed,n=Math.hypot(this.velocity.x,this.velocity.z);if(n<=e||n<1e-6)return;const s=e/n;this.velocity.x*=s,this.velocity.z*=s}applyJump(){const t=this.tuning;!(this.grounded||this.timeOffGround<t.coyoteTime)||!(this.input.takeJump(t.jumpBuffer)||t.autoHop&&this.input.jumping)||(this.velocity.y=t.jumpSpeed,this.grounded=!1,this.jumped=!0,this.timeSinceLand>Ax&&this.onJump?.(),this.timeSinceLand=0,this.timeOffGround=t.coyoteTime)}move(t){const e=this.tuning;Oh.copy(this.velocity).multiplyScalar(t),sa.copy(this.capsule.start);const n=this.grounded,s=this.velocity.x,r=this.velocity.z;this.grounded=!1,this.capsule.translate(Oh),this.resolve(),n&&!this.grounded&&!this.jumped&&this.snapToGround(),!(e.stepHeight<=0||this.wishX===0&&this.wishZ===0||this.velocity.y>.1||(this.capsule.start.x-sa.x)*this.wishX+(this.capsule.start.z-sa.z)*this.wishZ>=e.walkSpeed*t*.5)&&this.tryStepUp(t)&&(this.velocity.x=s,this.velocity.z=r,this.velocity.y=0)}resolve(){const t=Math.cos(this.tuning.slopeLimitDeg*Math.PI/180);for(let e=0;e<Tx;e++){const n=this.collider.intersectCapsule(this.capsule);if(!n)break;this.capsule.translate(ia.copy(n.normal).multiplyScalar(n.depth)),n.normal.y>t&&(this.grounded=!0,this.groundNormal.copy(n.normal));const s=this.velocity.dot(n.normal);s<0&&this.velocity.addScaledVector(n.normal,-s)}this.grounded||this.groundNormal.set(0,1,0)}snapToGround(){const t=this.tuning,e=Math.cos(t.slopeLimitDeg*Math.PI/180),n=Math.max(t.stepHeight,.05)/Cr;Lr.set(0,-n,0),rn.copy(this.capsule);for(let s=0;s<Cr;s++){rn.translate(Lr);const r=this.collider.intersectCapsule(rn);if(r){if(r.normal.y<=e)return;rn.translate(ia.set(0,n,0)),this.capsule.copy(rn),this.grounded=!0,this.groundNormal.copy(r.normal);return}}}tryStepUp(t){const e=this.tuning,n=Math.max(e.walkSpeed*t,.02);if(Dr.set(this.capsule.start.x+this.wishX*n,this.capsule.start.y+e.stepHeight,this.capsule.start.z+this.wishZ*n),Fh.copy(Dr).setY(Dr.y+e.height-e.radius*2),rn.set(Dr,Fh,e.radius),this.collider.overlaps(rn))return!1;const s=e.stepHeight/Cr;Lr.set(0,-s,0);for(let r=0;r<Cr;r++)if(rn.translate(Lr),this.collider.overlaps(rn))return rn.translate(ia.set(0,s,0)),this.capsule.copy(rn),this.grounded=!0,this.groundNormal.set(0,1,0),!0;return!1}advanceBob(t){const e=this.tuning;if(!this.grounded)return;const n=this.speed;if(n<.15){this.bobPhase+=(Math.round(this.bobPhase)-this.bobPhase)*Math.min(t*8,1),this.strideProgress=e.firstStepFraction;return}const s=e.walkSpeed/Math.max(e.bobStepsPerSecond,.1),r=Math.max(.2,s*Math.pow(n/e.walkSpeed,1-e.bobSpeedInfluence));for(this.strideProgress+=n*t/r,this.bobPhase+=n*t/(r*2);this.strideProgress>=1;)this.strideProgress-=1,this.onFootstep?.(n)}applyCamera(t){const e=this.tuning,n=this.bobPhase*Math.PI*2;Pr.set(Math.cos(this.yaw),0,-Math.sin(this.yaw));const s=Math.min(this.speed/e.walkSpeed,1);this.dip=Math.max(this.dip-this.dip*Math.min(t*9,1),0);const r=this.capsule.start.y-e.radius;this.camera.position.set(this.capsule.start.x,r+e.eyeHeight-this.dip+Math.sin(n*2)*e.bobAmount*s,this.capsule.start.z),this.camera.position.addScaledVector(Pr,Math.sin(n)*e.bobSway*s),this.camera.rotation.set(this.pitch,this.yaw,Math.sin(n)*e.bobRoll*s),this.sprintFov?(!this.input.sprint||this.speed<.4)&&(this.sprintFov=!1):this.input.sprint&&this.speed>1.2&&(this.sprintFov=!0);const o=this.sprintFov?e.sprintFov:e.fov,a=Bf.damp(this.camera.fov,o,6,t);Math.abs(a-this.camera.fov)>.001&&(this.camera.fov=a,this.camera.updateProjectionMatrix())}};const Bi=64,Lx=.85,Bh=2.2;class Dx{input;root;stickBase;stickKnob;jumpPad;stick=null;lookPointer=null;lastLookX=0;lastLookY=0;constructor(t,e){this.input=t,this.root=document.createElement("div"),this.root.className="touch",this.stickBase=document.createElement("div"),this.stickBase.className="touch-stick",this.stickKnob=document.createElement("div"),this.stickKnob.className="touch-stick-knob",this.stickBase.appendChild(this.stickKnob),this.jumpPad=document.createElement("div"),this.jumpPad.className="touch-jump",this.jumpPad.textContent="↑",this.root.append(this.stickBase,this.jumpPad),e.appendChild(this.root),this.root.addEventListener("pointerdown",this.handleDown),window.addEventListener("pointermove",this.handleMove),window.addEventListener("pointerup",this.handleUp),window.addEventListener("pointercancel",this.handleUp),this.jumpPad.addEventListener("pointerdown",this.handleJumpDown),this.jumpPad.addEventListener("pointerup",this.handleJumpUp),this.jumpPad.addEventListener("pointercancel",this.handleJumpUp)}handleDown=t=>{const e=t.clientX<window.innerWidth/2;if(e&&this.stick===null){this.stick={pointerId:t.pointerId,originX:t.clientX,originY:t.clientY},this.stickBase.style.left=`${t.clientX}px`,this.stickBase.style.top=`${t.clientY}px`,this.stickBase.classList.add("is-active"),this.updateStick(t.clientX,t.clientY);return}!e&&this.lookPointer===null&&(this.lookPointer=t.pointerId,this.lastLookX=t.clientX,this.lastLookY=t.clientY)};handleMove=t=>{if(this.stick?.pointerId===t.pointerId){this.updateStick(t.clientX,t.clientY);return}this.lookPointer===t.pointerId&&(this.input.addLook((t.clientX-this.lastLookX)*Bh,(t.clientY-this.lastLookY)*Bh),this.lastLookX=t.clientX,this.lastLookY=t.clientY)};handleUp=t=>{this.stick?.pointerId===t.pointerId&&(this.stick=null,this.input.setStick(0,0,!1),this.stickBase.classList.remove("is-active"),this.stickKnob.style.transform="translate(-50%, -50%)"),this.lookPointer===t.pointerId&&(this.lookPointer=null)};handleJumpDown=t=>{t.stopPropagation(),this.jumpPad.classList.add("is-active"),this.input.pressJump()};handleJumpUp=()=>{this.jumpPad.classList.remove("is-active"),this.input.releaseJump()};updateStick(t,e){if(!this.stick)return;let n=t-this.stick.originX,s=e-this.stick.originY;const r=Math.hypot(n,s);if(r>Bi){const a=Bi/r;n*=a,s*=a}this.stickKnob.style.transform=`translate(calc(-50% + ${n}px), calc(-50% + ${s}px))`;const o=Math.min(r,Bi)/Bi;this.input.setStick(n/Bi,-s/Bi,o>Lx)}dispose(){this.root.removeEventListener("pointerdown",this.handleDown),window.removeEventListener("pointermove",this.handleMove),window.removeEventListener("pointerup",this.handleUp),window.removeEventListener("pointercancel",this.handleUp),this.root.remove()}}function Ix(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new Ae;let c=0;for(let h=0;h<i.length;++h){const u=i[h];let d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const p in u.attributes){if(!n.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(u.attributes[p]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const p in u.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[p]===void 0&&(o[p]=[]),o[p].push(u.morphAttributes[p])}if(t){let p;if(e)p=u.index.count;else if(u.attributes.position!==void 0)p=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,p,h),c+=p}}if(e){let h=0;const u=[];for(let d=0;d<i.length;++d){const p=i[d].index;for(let g=0;g<p.count;++g)u.push(p.getX(g)+h);h+=i[d].attributes.position.count}l.setIndex(u)}for(const h in r){const u=zh(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(const h in o){const u=o[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){const p=[];for(let x=0;x<o[h].length;++x)p.push(o[h][x][d]);const g=zh(p);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}return l}function zh(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){const h=i[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const o=new t(r),a=new Ge(o,e,n);let l=0;for(let c=0;c<i.length;++c){const h=i[c];if(h.isInterleavedBufferAttribute){const u=l/e;for(let d=0,p=h.count;d<p;d++)for(let g=0;g<e;g++){const x=h.getComponent(d,g);a.setComponent(d+u,g,x)}}else o.set(h.array,l);l+=h.count*e}return s!==void 0&&(a.gpuType=s),a}function Vl(i,t=1e-4){t=Math.max(t,Number.EPSILON);const e={},n=i.getIndex(),s=i.getAttribute("position"),r=n?n.count:s.count;let o=0;const a=Object.keys(i.attributes),l={},c={},h=[],u=["getX","getY","getZ","getW"],d=["setX","setY","setZ","setW"];for(let _=0,v=a.length;_<v;_++){const y=a[_],w=i.attributes[y];l[y]=new w.constructor(new w.array.constructor(w.count*w.itemSize),w.itemSize,w.normalized);const E=i.morphAttributes[y];E&&(c[y]||(c[y]=[]),E.forEach((A,L)=>{const S=new A.array.constructor(A.count*A.itemSize);c[y][L]=new A.constructor(S,A.itemSize,A.normalized)}))}const p=t*.5,g=Math.log10(1/t),x=Math.pow(10,g),m=p*x;for(let _=0;_<r;_++){const v=n?n.getX(_):_;let y="";for(let w=0,E=a.length;w<E;w++){const A=a[w],L=i.getAttribute(A),S=L.itemSize;for(let M=0;M<S;M++)y+=`${~~(L[u[M]](v)*x+m)},`}if(y in e)h.push(e[y]);else{for(let w=0,E=a.length;w<E;w++){const A=a[w],L=i.getAttribute(A),S=i.morphAttributes[A],M=L.itemSize,R=l[A],I=c[A];for(let U=0;U<M;U++){const B=u[U],q=d[U];if(R[q](o,L[B](v)),S)for(let H=0,Q=S.length;H<Q;H++)I[H][q](o,S[H][B](v))}}e[y]=o,h.push(o),o++}}const f=i.clone();for(const _ in i.attributes){const v=l[_];if(f.setAttribute(_,new v.constructor(v.array.slice(0,o*v.itemSize),v.itemSize,v.normalized)),_ in c)for(let y=0;y<c[_].length;y++){const w=c[_][y];f.morphAttributes[_][y]=new w.constructor(w.array.slice(0,o*w.itemSize),w.itemSize,w.normalized)}}return f.setIndex(h),f}const ud="sway",Ux=new Dn({vertexColors:!0,flatShading:!0});function fe(i){const t=i.map(n=>{const s=n.geometry,r=s.index===null?s:s.toNonIndexed();r!==s&&s.dispose(),r.deleteAttribute("uv");const o=r.getAttribute("position"),a=o.count,l=new Float32Array(a*3),c=new Nt;if(typeof n.color=="function")for(let u=0;u<a;u+=3){const d=(o.getX(u)+o.getX(u+1)+o.getX(u+2))/3,p=(o.getY(u)+o.getY(u+1)+o.getY(u+2))/3,g=(o.getZ(u)+o.getZ(u+1)+o.getZ(u+2))/3;c.set(n.color(d,p,g)),c.toArray(l,u*3),c.toArray(l,(u+1)*3),c.toArray(l,(u+2)*3)}else{c.set(n.color);for(let u=0;u<a;u++)c.toArray(l,u*3)}r.setAttribute("color",new Ge(l,3));const h=new Float32Array(a);if(typeof n.sway=="function")for(let u=0;u<a;u++)h[u]=pl(n.sway(o.getX(u),o.getY(u),o.getZ(u)));else n.sway&&h.fill(pl(n.sway));return r.setAttribute(ud,new Ge(h,1)),r.getAttribute("normal")||r.computeVertexNormals(),r}),e=Ix(t,!1);for(const n of t)n.dispose();if(!e)throw new Error("assemble: geometries did not share an attribute set");return e}function ue(i,t,e){const n=new Kt(i,Ux);return n.name=t,n.userData.swayPhase=e,n}function kh(i,t,e=1.6){return(n,s)=>{const r=pl((s-i)/Math.max(t-i,1e-6));return(r*r*(3-2*r))**e}}function pl(i){return i>0?i<1?i:1:0}function se(i){let t=i>>>0||2654435769;t=Math.imul(t^t>>>16,73244475),t=Math.imul(t^t>>>16,73244475),t=(t^t>>>16)>>>0;const e=()=>{t=t+1831565813>>>0;let s=t;return s=Math.imul(s^s>>>15,s|1),s^=s+Math.imul(s^s>>>7,s|61),((s^s>>>14)>>>0)/4294967296},n=e;return n.range=(s,r)=>s+e()*(r-s),n.int=(s,r)=>Math.floor(s+e()*(r-s+1)),n.chance=s=>e()<s,n.pick=s=>s[Math.floor(e()*s.length)],n.around=(s,r)=>s+(e()*2-1)*r,n}const z={BARK:4602672,BARK_PALE:5720636,LEAF:5201977,LEAF_DARK:4017196,LEAF_DRY:7039548,GRASS:6056762,GRASS_DRY:8025156,STONE:6975348,STONE_DARK:5001559,STONE_PALE:8883343,EARTH:4998454,TIMBER:6245431,TIMBER_DARK:4536103,IRON:5922659,RUST:8014384,CLOTH:9274994,SKIN:11047546,HIDE:7165505,HIDE_DARK:4273193,HIDE_PALE:10653813,WOOL:12433060,HOG:11042938,FOWL:10260343,COMB:10240564,MARKER_YELLOW:13213770,COW_BLACK:2367775};function pn(i,t){const e=Math.min(255,Math.round((i>>16&255)*t)),n=Math.min(255,Math.round((i>>8&255)*t)),s=Math.min(255,Math.round((i&255)*t));return e<<16|n<<8|s}const Wl={name:"tree",category:"foliage",radius:2.2,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.range(3.2,4.6),r=e.range(0,Math.PI*2),o=s*e.range(.55,.68),a=new Bt(e.range(.11,.17),e.range(.24,.34),o,6);a.translate(0,o/2,0),n.push({geometry:a,color:z.BARK,sway:kh(0,s,2.2)});const l=e.int(2,4);for(let d=0;d<l;d++){const p=o*e.range(.6,.95),g=e.range(.7,1.3),x=new Bt(.045,.09,g,4);x.translate(0,g/2,0),x.rotateZ(e.range(.5,1.05)),x.rotateY(r+d/l*Math.PI*2+e.around(0,.4)),x.translate(0,p,0),n.push({geometry:x,color:z.BARK_PALE,sway:kh(0,s,1.4)})}const c=e.int(3,5),h=o+e.range(.3,.7);for(let d=0;d<c;d++){const p=e.range(.75,1.35),g=new ge(p,0);g.rotateX(e.range(0,Math.PI)),g.rotateY(e.range(0,Math.PI)),g.scale(1,e.range(.72,.95),1);const x=e.range(0,.95),m=r+d/c*Math.PI*2+e.around(0,.5);g.translate(Math.cos(m)*x,h+e.around(0,.45),Math.sin(m)*x),n.push({geometry:g,color:e.chance(.25)?z.LEAF_DARK:z.LEAF,sway:e.range(.82,1)})}const u=fe(n);return t!==1&&u.scale(t,t,t),ue(u,"tree",e()*Math.PI*2)}},Nx=Object.freeze(Object.defineProperty({__proto__:null,tree:Wl},Symbol.toStringTag,{value:"Module"})),zs={name:"bush",category:"foliage",radius:1,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.int(3,5),r=e.range(.35,.7);for(let a=0;a<s;a++){const l=e.range(.3,.62),c=new ge(l,0);c.rotateX(e.range(0,Math.PI)),c.rotateY(e.range(0,Math.PI)),c.scale(1,e.range(.6,.85),1);const h=a/s*Math.PI*2+e.around(0,.6),u=e.range(0,r),d=l*e.range(.55,.85);c.translate(Math.cos(h)*u,d,Math.sin(h)*u),n.push({geometry:c,color:e.chance(.2)?z.LEAF_DRY:z.LEAF,sway:(p,g)=>Math.min(1,.35+g*.75)})}const o=fe(n);return t!==1&&o.scale(t,t,t),ue(o,"bush",e()*Math.PI*2)}},Ox=Object.freeze(Object.defineProperty({__proto__:null,bush:zs},Symbol.toStringTag,{value:"Module"})),Hh={ground:"#4c4536",cube:"#525f66",marker:"#b08040",ramp:"#38474a",stair:"#3d4b52",platform:"#46505c",wall:"#2e3640",metal:"#6a6f74",creature:"#b8a06a"},Ir=208,Gh=52,Fx=7037511,Bx=3814695,zx=14474440,kx=6044206,Hx=new P(0,.1,10);function he(i,t,e,n,s,r,o){const a=new Kt(new it(i,t,e),n);return a.position.set(s,r+t/2,o),a}function Gx(i,t,e,n){const s=new td;s.moveTo(0,0),s.lineTo(t,0),s.lineTo(t,t*Math.tan(e*Math.PI/180)),s.closePath();const r=new zl(s,{depth:i,bevelEnabled:!1});return r.translate(0,0,-i/2),r.rotateY(Math.PI/2),new Kt(r,n)}function oa(i,t,e,n,s,r){const a=new $n(i,t,96,1),l=a.getAttribute("position"),c=new Float32Array(l.count*3),h=new Nt;for(let d=0;d<l.count;d++){const p=l.getX(d)/i+.5,[g,x,m]=r(Math.min(Math.max(p,0),1));h.setRGB(g,x,m,qe),h.toArray(c,d*3)}a.setAttribute("color",new Ge(c,3));const u=new Kt(a,new io({vertexColors:!0}));return u.position.set(e,n,s),u}class Vx{root=new Ce;colors={...Hh};materials={};anchors={tree:new P(14,3.6,12),bush:new P(10.5,.5,15.5),bird:new P(14.9,4.1,11.4),machine:new P(22,1.1,-12)};rooms=[{name:"hall",min:new P(15,0,-18),max:new P(29,7,-4)},{name:"cell",min:new P(19,0,-4),max:new P(27,3,4)}];wheel=null;constructor(){this.root.name="ProvingGround";for(const t of Object.keys(this.colors))this.materials[t]=new Dn({color:this.colors[t],flatShading:!0});this.addGround(),this.addHeightReference(),this.addMeasuredCubes(),this.addDistanceMarkers(),this.addMovementGym(),this.addCalibrationBoard(),this.addSoundGarden(),this.addRooms()}update(t,e){this.wheel&&(this.wheel.rotation.z+=e/60*Math.PI*2*t)}roomAt(t){for(const e of this.rooms)if(t.x>e.min.x&&t.x<e.max.x&&t.z>e.min.z&&t.z<e.max.z&&t.y<e.max.y)return e.name;return null}applyColors(){for(const t of Object.keys(this.colors))this.materials[t].color.set(this.colors[t])}resetColors(){Object.assign(this.colors,Hh),this.applyColors()}addGround(){const t=new Kt(new $n(Ir,Ir,Gh,Gh),this.materials.ground);t.rotation.x=-Math.PI/2,t.position.y=-.01,this.root.add(Me(t)),this.root.add(new Hv(Ir,Ir,Fx,Bx)),this.root.add(new Gv(2))}addHeightReference(){const t=new Ce,e=.3,n=6;for(let s=0;s<n;s++){const r=new Kt(new it(.08,e,.08),new Dn({color:s%2===0?zx:kx,flatShading:!0}));r.position.y=e*(s+.5),t.add(r)}t.position.set(-2,0,0),this.root.add(t)}addMeasuredCubes(){const t=[1,2,4];let e=4;for(const n of t)this.root.add(Me(he(n,n,n,this.materials.cube,e+n/2,0,0))),e+=n+1}addDistanceMarkers(){for(const t of[5,10,20,30])this.root.add(Me(he(.1,2,.1,this.materials.marker,0,0,-t)))}addMovementGym(){const t=new Ce;t.name="MovementGym",this.addRamps(t),this.addStairs(t),this.addKerbs(t),this.addJumpGaps(t),this.addStrafeWall(t),this.addFallWalkway(t),this.root.add(Me(t))}addRamps(t){const e=[10,20,30,45],n=4;e.forEach((s,r)=>{const o=Gx(2.5,n,s,this.materials.ramp);o.position.set(-6-r*4,0,-2),t.add(o);const a=n*Math.tan(s*Math.PI/180);t.add(he(2.5,.2,2,this.materials.ramp,-6-r*4,a-.2,-7))})}addStairs(t){const e=[{rise:.18,run:.3,x:-24},{rise:.3,run:.3,x:-28}];for(const n of e)for(let s=0;s<8;s++){const r=n.rise*(s+1);t.add(he(2.5,r,n.run,this.materials.stair,n.x,0,-2-s*n.run))}}addKerbs(t){[.2,.35,.5,.9].forEach((e,n)=>{t.add(he(3,e,2,this.materials.platform,-8-n*4,0,5))})}addJumpGaps(t){const e=[1.5,2.5,3.5],n=3,s=1.2;let r=18;t.add(he(3,s,n,this.materials.platform,-26,0,r));for(const o of e)r-=n+o,t.add(he(3,s,n,this.materials.platform,-26,0,r))}addStrafeWall(t){t.add(he(.4,3,16,this.materials.wall,-4,0,8)),t.add(he(6,3,.4,this.materials.wall,-7,0,15.8))}addFallWalkway(t){t.add(he(2.5,.2,8,this.materials.platform,-18,3.8,-12))}addCalibrationBoard(){const t=new Ce;t.name="CalibrationBoard";const e=7,n=-12;t.add(Me(he(12,6,.3,this.materials.wall,e,0,n)));const s=[[16711680,65280,255,16777215],[65535,16711935,16776960,0],[3355443,6710886,10066329,13421772],[9278609,6044206,11567168,3028544]],r=.9;s.forEach((c,h)=>{c.forEach((u,d)=>{const p=new Kt(new $n(r,r),new io({color:u}));p.position.set(e-4.6+d*(r+.15),5.1-h*(r+.15),n+.16),t.add(p)})}),t.add(oa(5.2,.7,e+2.6,4.3,n+.16,c=>[c,c,c])),t.add(oa(5.2,.7,e+2.6,3.4,n+.16,c=>[c,c*.35,.12])),t.add(oa(5.2,.7,e+2.6,2.5,n+.16,c=>[.1,c*.6,c]));const o=new Kt(new uo(1.1,48,32),new Dn({color:9278609}));o.position.set(e-8.5,1.1,n),t.add(Me(o));const a=Math.PI/6,l=new Kt(new $n(6,4),new Dn({color:7305853,side:dn}));l.position.set(e-13.5,2*Math.cos(a),n),l.rotation.x=-a,t.add(Me(l)),this.root.add(t)}addSoundGarden(){const t=new Ce;t.name="SoundGarden";const e=Wl.build({seed:4021});e.position.set(this.anchors.tree.x,0,this.anchors.tree.z),t.add(Me(e)),e.geometry.computeBoundingBox();const n=e.geometry.boundingBox;n&&(this.anchors.tree.setY(n.max.y*.75),this.anchors.bird.set(this.anchors.tree.x+n.max.x*.45,n.max.y*.66,this.anchors.tree.z+n.max.z*.3));const s=zs.build({seed:771});s.position.set(this.anchors.bush.x,0,this.anchors.bush.z),t.add(s);const r=zs.build({seed:9114,scale:.8});r.position.set(9.2,0,16.8),t.add(r),t.add(this.bird()),t.add(this.machine()),this.root.add(t)}bird(){const t=new Ce,e=this.anchors.bird,n=new Kt(new ge(.16,0),this.materials.creature);n.position.copy(e),n.scale.set(1,.85,1.3);const s=new Kt(new Pe(.045,.14,4),this.materials.marker);s.position.set(e.x,e.y+.02,e.z+.2),s.rotation.x=Math.PI/2;const r=new Kt(new Pe(.07,.26,4),this.materials.creature);return r.position.set(e.x,e.y+.03,e.z-.22),r.rotation.x=-Math.PI/2,t.add(n,s,r),t}machine(){const t=new Ce,e=this.anchors.machine;t.add(Me(he(1.8,1.6,1.2,this.materials.metal,e.x,0,e.z))),this.wheel=new Kt(new Bt(.7,.7,.16,12),this.materials.metal),this.wheel.position.set(e.x+1.05,1.2,e.z),this.wheel.rotation.x=Math.PI/2,t.add(this.wheel);for(let s=0;s<4;s++){const r=new Kt(new it(.1,1.3,.08),this.materials.marker);r.rotation.z=s/4*Math.PI,this.wheel.add(r)}const n=new Kt(new Bt(.14,.14,2.6,8),this.materials.metal);return n.position.set(e.x-.6,2.4,e.z),t.add(n),t}addRooms(){const t=new Ce;t.name="Rooms";const e=.4,n=this.materials.wall;t.add(he(14+e*2,7,e,n,22,0,-18-e/2)),t.add(he(e,7,14,n,15-e/2,0,-11)),t.add(he(e,7,14,n,29+e/2,0,-11)),t.add(he(14+e*2,e,14+e*2,n,22,7,-11)),t.add(he(7,7,e,n,18.5,0,-4)),t.add(he(5,7,e,n,26.5,0,-4)),t.add(he(2,4.6,e,n,23,2.4,-4)),t.add(he(e,3,8,n,19-e/2,0,0)),t.add(he(e,3,8,n,27+e/2,0,0)),t.add(he(8+e*2,e,8,n,23,3,0)),t.add(he(3,3,e,n,20.5,0,4)),t.add(he(3,3,e,n,25.5,0,4)),t.add(he(2,.6,e,n,23,2.4,4)),this.root.add(Me(t))}dispose(){this.root.traverse(t=>{if(t instanceof Kt||t instanceof ao||t instanceof ev){t.geometry.dispose();const e=t.material;if(Array.isArray(e))for(const n of e)n.dispose();else e.dispose()}}),this.root.clear()}}const aa=2e4,Wx=420,Xx=.32,qx=.08,la=.5;class Ur{position=new P;enabled=!0;engine;model;absorption;occlusion;panner;sendGain;maxDistance;reverb;occluded=!1;virtual=!1;constructor(t,e,n){this.engine=t,this.model=e,this.position.copy(n.position),this.maxDistance=n.maxDistance??60,this.reverb=n.reverb??1;const s=t.context;this.absorption=s.createBiquadFilter(),this.absorption.type="lowpass",this.absorption.frequency.value=aa,this.occlusion=s.createGain(),this.panner=s.createPanner(),this.panner.panningModel="HRTF",this.panner.distanceModel="inverse",this.panner.refDistance=n.refDistance??1.5,this.panner.maxDistance=this.maxDistance,this.panner.rolloffFactor=n.rolloff??1.1,n.direction&&(this.panner.coneInnerAngle=n.coneInner??90,this.panner.coneOuterAngle=n.coneOuter??240,this.panner.coneOuterGain=n.coneOuterGain??.35,Yx(this.panner,n.direction)),Vh(this.panner,this.position),this.sendGain=s.createGain(),this.sendGain.gain.value=this.reverb,e.output.connect(this.absorption),this.absorption.connect(this.occlusion),this.occlusion.connect(this.panner),this.panner.connect(t.dry),this.panner.connect(this.sendGain),this.sendGain.connect(t.send)}moveTo(t){this.position.copy(t),Vh(this.panner,this.position)}update(t,e,n){const s=this.position.distanceTo(this.engine.listenerPosition),r=s>this.maxDistance;if(r!==this.virtual&&(this.virtual=r,this.model.setActive?.(!r)),this.virtual||!this.enabled){this.glide(this.occlusion.gain,0);return}this.model.update?.(t,this.engine),n&&(this.occluded=this.testOcclusion(e,s));const o=this.engine.settings,a=Math.min(s/this.maxDistance,1),l=aa*(1-o.airAbsorption*Math.sqrt(a)*.94),c=this.occluded?o.occlusion:0,h=Math.min(l,Wh(aa,Wx,c)),u=a<=la?1:1-$x((a-la)/(1-la));this.glide(this.absorption.frequency,Math.max(h,180)),this.glide(this.occlusion.gain,Wh(1,Xx,c)*u),this.sendGain.gain.value=this.reverb*o.reverbAmount}testOcclusion(t,e){if(e<.5)return!1;Rn.subVectors(this.position,this.engine.listenerPosition).divideScalar(e);const n=t.raycast(this.engine.listenerPosition,Rn);return n!==null&&n<e-.35}glide(t,e){t.setTargetAtTime(e,this.engine.context.currentTime,qx)}get isOccluded(){return this.occluded}get isVirtual(){return this.virtual}dispose(){this.model.dispose(),this.panner.disconnect(),this.sendGain.disconnect(),this.absorption.disconnect(),this.occlusion.disconnect()}}function Vh(i,t){i.positionX?(i.positionX.value=t.x,i.positionY.value=t.y,i.positionZ.value=t.z):i.setPosition(t.x,t.y,t.z)}function Yx(i,t){Rn.copy(t).normalize(),i.orientationX?(i.orientationX.value=Rn.x,i.orientationY.value=Rn.y,i.orientationZ.value=Rn.z):i.setOrientation(Rn.x,Rn.y,Rn.z)}function Wh(i,t,e){return i+(t-i)*e}function $x(i){const t=i<0?0:i>1?1:i;return t*t*t*(t*(t*6-15)+10)}const Rn=new P,Kx=6;function Zx(i){const t=Math.floor(i.sampleRate*Kx);return{white:ca(i,t,Jx()),pink:ca(i,t,Qx()),brown:ca(i,t,ty())}}function ca(i,t,e){const n=i.createBuffer(1,t,i.sampleRate),s=n.getChannelData(0);for(let o=0;o<t;o++)s[o]=e();const r=Math.min(2048,t/4|0);for(let o=0;o<r;o++){const a=o/r;s[o]=s[o]*a+s[t-r+o]*(1-a)}return jx(s),n}function jx(i){let t=0;for(let n=0;n<i.length;n++)t=Math.max(t,Math.abs(i[n]));if(t===0)return;const e=.95/t;for(let n=0;n<i.length;n++)i[n]*=e}function Jx(){return()=>Math.random()*2-1}function Qx(){let i=0,t=0,e=0,n=0,s=0,r=0,o=0;return()=>{const a=Math.random()*2-1;i=.99886*i+a*.0555179,t=.99332*t+a*.0750759,e=.969*e+a*.153852,n=.8665*n+a*.3104856,s=.55*s+a*.5329522,r=-.7616*r-a*.016898;const l=i+t+e+n+s+r+o+a*.5362;return o=a*.115926,l*.11}}function ty(){let i=0;return()=>{const t=Math.random()*2-1;return i=(i+.02*t)/1.02,i*3.5}}function Cs(i,t,e,n=.06){const s=i.createBufferSource();return s.buffer=t,s.loop=!0,s.playbackRate.value=1+(Math.random()*2-1)*n,s.connect(e),s.start(0,Math.random()*t.duration),{source:s,stop(r=0){try{s.stop(r)}catch{}}}}const ey=220,ny=560,iy=1.4,ha=1300,sy=2900,ua=4,ry=9;function oy(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("wind model built before the noise buffers were ready");const s=e.createGain();s.gain.value=t.gain??.5;const r=e.createBiquadFilter();r.type="lowpass",r.frequency.value=t.tone??3400,r.Q.value=.4;const o=e.createBiquadFilter();o.type="highshelf",o.frequency.value=2200,o.gain.value=-7;const a=e.createGain();a.gain.value=.5,r.connect(o).connect(a).connect(s);const l=e.createGain(),c=e.createGain(),h=e.createGain(),u=e.createBiquadFilter();u.type="lowpass",u.frequency.value=ey;const d=e.createBiquadFilter();d.type="bandpass",d.frequency.value=ny,d.Q.value=iy;const p=e.createBiquadFilter();p.type="bandpass",p.frequency.value=ha,p.Q.value=ua;const g=[Cs(e,n.brown,u),Cs(e,n.pink,d),Cs(e,n.white,p)];u.connect(l).connect(r),d.connect(c).connect(r),p.connect(h).connect(r);const x=t.whistle??1;return{output:s,setTone(m){r.frequency.setTargetAtTime(m,e.currentTime,.1)},update(m,f){const _=f.weather.strength,v=e.currentTime,y=.09;l.gain.setTargetAtTime(.1+_*.85,v,y),c.gain.setTargetAtTime(.03+_*_*.5,v,y),h.gain.setTargetAtTime(_**3*.2*x,v,y),a.gain.setTargetAtTime(.25+_*.75,v,y*1.6),p.frequency.setTargetAtTime(ha+(sy-ha)*_,v,y),p.Q.setTargetAtTime(ua+(ry-ua)*_,v,y)},dispose(){for(const m of g)m.stop();s.disconnect()}}}const ay=.14,ly=160,cy=[{hz:1150,q:2.6,weight:.4},{hz:2400,q:3.2,weight:.46},{hz:4600,q:3.8,weight:.14}],ml=8,da=48,hy=Array.from({length:ml},(i,t)=>{const e=((t+1)/ml)**2,n=new Float32Array(da);for(let s=0;s<da;s++)n[s]=e*.5*(1-Math.cos(2*Math.PI*s/(da-1)));return n});function Xh(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("foliage model built before the noise buffers were ready");const s=t.density??240,r=t.tone??1,o=t.restlessness??.2,a=e.createGain();a.gain.value=t.gain??.5;const l=e.createGain();l.gain.value=0,l.connect(a);const c=cy.map(_=>{const v=e.createBiquadFilter();return v.type="bandpass",v.frequency.value=_.hz*r,v.Q.value=_.q,v.connect(l),{node:v,weight:_.weight}}),h=()=>{let _=Math.random();for(const v of c)if(_-=v.weight,_<=0)return v.node;return c[c.length-1].node},u=e.createBiquadFilter();u.type="bandpass",u.frequency.value=1800*r,u.Q.value=.75;const d=e.createGain();d.gain.value=0;const p=Cs(e,n.pink,u);u.connect(d).connect(a);let g=t.articulation??.3,x=!0,m=0;const f=_=>{const v=e.createBufferSource();v.buffer=n.white,v.playbackRate.value=.7+Math.random()*.7;const y=e.createGain(),w=.055+Math.random()*.11;y.gain.setValueCurveAtTime(hy[Math.floor(Math.random()*ml)],_,w),v.connect(y).connect(h()),v.start(_,Math.random()*(n.white.duration-.3),w+.02),v.stop(_+w+.03)};return{output:a,setArticulation(_){g=_},setActive(_){x=_,_&&(m=0),_||(d.gain.value=0,l.gain.value=0)},update(_,v){if(!x)return;const y=Math.max(v.weather.strength,o),w=e.currentTime;m<w&&(m=w),d.gain.setTargetAtTime(.1+y*.5,w,.15),u.frequency.setTargetAtTime((1500+y*1900)*r,w,.15),l.gain.setTargetAtTime(g*(.25+y*.75),w,.15);const E=w+ay,A=Math.max(20,s*y*y);let L=0;for(;m<E&&L<ly;)f(m),m+=-Math.log(1-Math.random())/A,L++},dispose(){p.stop(),l.disconnect(),a.disconnect()}}}const qh=[1,2,3.02,4.05,5.97],uy=[1,.5,.28,.16,.09],Nr={steady:{speed:1,wear:1,clank:1,min:9,max:26,next:["labouring","surging","idling"]},labouring:{speed:.62,wear:1.8,clank:1.7,min:5,max:14,next:["steady","stalling","surging"]},surging:{speed:1.34,wear:1.3,clank:.8,min:3,max:9,next:["steady","labouring"]},stalling:{speed:.22,wear:2.2,clank:2.4,min:1.5,max:4,next:["labouring","idling"]},idling:{speed:.45,wear:.7,clank:.5,min:8,max:20,next:["steady","surging"]}};function dy(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("machine model built before the noise buffers were ready");const s=t.fundamental??46,r=t.clank??.5,o=e.createGain();o.gain.value=t.gain??.35;const a=e.createGain();a.gain.value=.5;const l=e.createBiquadFilter();l.type="lowpass",l.frequency.value=520,l.Q.value=.9;const c=[];qh.forEach((R,I)=>{const U=e.createOscillator();U.type=I===0?"sawtooth":"triangle",U.frequency.value=s*R,U.detune.value=(Math.random()*2-1)*9;const B=e.createGain();B.gain.value=uy[I],U.connect(B).connect(l),U.start(),c.push(U)}),l.connect(a);const h=e.createGain();h.gain.value=1;const u=e.createOscillator();u.type="sine";const d=e.createGain();d.gain.value=.22,u.connect(d).connect(h.gain),u.start(),a.connect(h).connect(o);const p=e.createBiquadFilter();p.type="bandpass",p.frequency.value=2600,p.Q.value=.8;const g=e.createGain();g.gain.value=(t.wear??.4)*.22;const x=Cs(e,n.pink,p);p.connect(g).connect(o);const m=e.createGain();m.gain.value=r,m.connect(o);let f=t.rpm??52,_=f,v=!0,y=0,w="steady",E=12;const A=(t.wear??.4)*.22,L=R=>{if(r<=0)return;const I=e.createBufferSource();I.buffer=n.white;const U=e.createBiquadFilter();U.type="bandpass",U.frequency.value=190+Math.random()*90,U.Q.value=14;const B=e.createGain();B.gain.setValueAtTime(0,R),B.gain.linearRampToValueAtTime(.9+Math.random()*.3,R+.001),B.gain.setTargetAtTime(0,R+.001,.05),I.connect(U).connect(B).connect(m),I.start(R,Math.random()*2,.4),I.stop(R+.45)},S=(R=.9)=>{const I=e.currentTime,U=Nr[w];u.frequency.setTargetAtTime(_/60,I,R*.4);const B=Math.max(_,4)/52;qh.forEach((q,H)=>{c[H].frequency.setTargetAtTime(s*q*B,I,R)}),l.frequency.setTargetAtTime(420+B*260,I,R),g.gain.setTargetAtTime(A*U.wear,I,R),m.gain.setTargetAtTime(r*U.clank,I,R)},M=R=>{w=R;const I=Nr[R];E=I.min+Math.random()*(I.max-I.min),S()};return S(.01),{output:o,get phase(){return w},get currentRpm(){return _},setRpm(R){f=R},setActive(R){v=R,R&&(y=0)},update(R){if(!v)return;const I=e.currentTime;if(E-=R,E<=0){const H=Nr[w].next;M(H[Math.floor(Math.random()*H.length)])}const U=f*Nr[w].speed,B=Math.min(R*.55,1);Math.abs(U-_)>.05&&(_+=(U-_)*B,S());const q=60/Math.max(_,3);for(y<I&&(y=I+q);y<I+.15;)L(y),y+=q*(.94+Math.random()*.12)},dispose(){for(const R of c)R.stop();u.stop(),x.stop(),o.disconnect()}}}function fy(i,t={}){const e=i.context,n=t.pitch??2400,s=t.interval??7,r=t.shySpeed??.72,o=e.createGain();o.gain.value=t.gain??.16;const a=e.createBiquadFilter();a.type="lowpass",a.frequency.value=t.tone??3200,a.Q.value=.5,a.connect(o);let l=!0,c=0;const h=(g,x,m,f)=>{const _=e.createOscillator();_.type="sine",_.frequency.setValueAtTime(x,g),_.frequency.exponentialRampToValueAtTime(m,g+f);const v=e.createOscillator();v.type="sine",v.frequency.setValueAtTime(x*2.02,g),v.frequency.exponentialRampToValueAtTime(m*2.02,g+f);const y=e.createGain();y.gain.value=.18;const w=e.createGain();w.gain.setValueAtTime(0,g),w.gain.linearRampToValueAtTime(1,g+f*.18),w.gain.setValueAtTime(1,g+f*.6),w.gain.linearRampToValueAtTime(0,g+f),_.connect(w),v.connect(y).connect(w),w.connect(a),_.start(g),v.start(g),_.stop(g+f+.02),v.stop(g+f+.02)},u=[{name:"rising",weight:.26},{name:"falling",weight:.2},{name:"trill",weight:.16},{name:"pair",weight:.22},{name:"single",weight:.1},{name:"chatter",weight:.06}],d=()=>{let g=Math.random();for(const x of u)if(g-=x.weight,g<=0)return x.name;return"pair"},p=g=>{const x=n*(.82+Math.random()*.36);let m=g;switch(d()){case"rising":{const f=2+Math.floor(Math.random()*3);for(let _=0;_<f;_++){const v=1+_*(.1+Math.random()*.09),y=.06+Math.random()*.07;h(m,x*v,x*v*1.22,y),m+=y+.03+Math.random()*.05}break}case"falling":{const f=2+Math.floor(Math.random()*2);for(let _=0;_<f;_++){const v=1-_*(.08+Math.random()*.07),y=.08+Math.random()*.1;h(m,x*v*1.18,x*v*.82,y),m+=y+.04+Math.random()*.06}break}case"trill":{const f=5+Math.floor(Math.random()*7),_=.028+Math.random()*.022;for(let v=0;v<f;v++){const y=v%2===0?1:1.09;h(m,x*y,x*y*1.05,_*.8),m+=_}break}case"pair":{const f=.07+Math.random()*.06;h(m,x,x*1.3,f),m+=f+.05+Math.random()*.04,h(m,x*1.28,x*1.05,f*1.2),m+=f*1.2;break}case"single":{const f=.22+Math.random()*.3;h(m,x*.95,x*1.12,f),m+=f;break}case"chatter":{const f=3+Math.floor(Math.random()*4);for(let _=0;_<f;_++){const v=.02+Math.random()*.02;h(m,x*.6,x*.5,v),m+=v+.02+Math.random()*.03}break}}return m};return{output:o,setActive(g){l=g,g&&(c=0)},update(g,x){if(!l)return;const m=e.currentTime;c<m&&(c=m+Math.random()*s),!(c>m+.2)&&(x.weather.strength<r?c=p(c)+(Math.random()<.34?.4+Math.random()*2.2:-Math.log(1-Math.random())*s):c=m+1.5)},dispose(){o.disconnect()}}}const Or={stone:{level:.5,impact:{level:.9,duration:.011,tone:3800},modes:[{hz:620,decay:.06,level:.6},{hz:1450,decay:.03,level:.32},{hz:2600,decay:.018,level:.12}],grit:{count:5,over:.06,energyDecay:.025,hz:2600,q:1.2,level:.12},toe:.45,roll:.075},wood:{level:.6,impact:{level:.7,duration:.018,tone:1700},modes:[{hz:155,decay:.22,level:1},{hz:390,decay:.15,level:.6},{hz:720,decay:.075,level:.22}],grit:{count:4,over:.05,energyDecay:.02,hz:1200,q:.9,level:.08},toe:.6,roll:.085},earth:{level:.5,impact:{level:1,duration:.022,tone:900},modes:[{hz:120,decay:.05,level:.55}],grit:{count:9,over:.07,energyDecay:.028,hz:1600,q:1,level:.22},toe:.4,roll:.085},gravel:{level:.5,impact:{level:.45,duration:.012,tone:2400},modes:[],grit:{count:26,over:.16,energyDecay:.06,hz:3e3,q:1.4,level:.75},toe:.7,roll:.09},grass:{level:.32,impact:{level:.5,duration:.03,tone:1400},modes:[],grit:{count:16,over:.11,energyDecay:.045,hz:5200,q:.9,level:.4},toe:.6,roll:.085},leaves:{level:.4,impact:{level:.35,duration:.02,tone:2600},modes:[],grit:{count:34,over:.2,energyDecay:.08,hz:4200,q:2.2,level:.55},toe:.75,roll:.09},metal:{level:.45,impact:{level:.9,duration:.004,tone:9e3},modes:[{hz:480,decay:.5,level:.5},{hz:1270,decay:.42,level:.45},{hz:2340,decay:.3,level:.3},{hz:4100,decay:.18,level:.2}],grit:null,toe:.5,roll:.07},mud:{level:.5,impact:{level:1,duration:.05,tone:700},modes:[{hz:240,decay:.06,level:.35}],grit:{count:6,over:.09,energyDecay:.03,hz:900,q:3.2,level:.3},toe:.3,roll:.1}},py=6,Yh=.35,my=9;function hn(i,t){return i+Math.random()*(t-i)}class gy{surface="earth";engine;output;body;panner;reverbSend;chains=new Map;left=!1;constructor(t,e=.55){this.engine=t;const n=t.context;this.output=n.createGain(),this.output.gain.value=e,this.body=n.createBiquadFilter(),this.body.type="lowpass",this.body.frequency.value=5200,this.body.Q.value=.6,this.panner=n.createStereoPanner(),this.reverbSend=n.createGain(),this.reverbSend.gain.value=.6,this.output.connect(this.body),this.body.connect(this.panner),this.panner.connect(t.dry),this.panner.connect(this.reverbSend),this.reverbSend.connect(t.send)}setReverb(t){this.reverbSend.gain.setTargetAtTime(Math.max(0,t),this.engine.context.currentTime,.1)}step(t){const e=this.engine.context;if(e.state!=="running"||!this.engine.noise)return;const n=Or[this.surface],s=this.chainFor(this.surface),r=e.currentTime+.004,o=Yh+(1-Yh)*(1-Math.exp(-t/(py*.45))),a=n.level*Math.min(o,1);if(this.panner.pan.setValueAtTime(this.takeFoot()*.2,r),this.strike(s,n,r,a*hn(.9,1.1)),n.toe>0){const l=n.roll*Math.max(.35,1-t/12);this.strike(s,n,r+l,a*n.toe*hn(.8,1.1))}}land(t){const e=this.engine.context;if(e.state!=="running"||!this.engine.noise)return;const n=Or[this.surface],s=this.chainFor(this.surface),r=e.currentTime+.004,o=Math.min(t/my,1),a=n.level*(.7+o*.85);this.panner.pan.setValueAtTime(0,r),this.strike(s,n,r,a),this.strike(s,n,r+hn(.012,.03),a*hn(.4,.6))}jump(){const t=this.engine.context;if(t.state!=="running"||!this.engine.noise)return;const e=Or[this.surface],n=this.chainFor(this.surface),s=t.currentTime+.004;this.panner.pan.setValueAtTime(this.takeFoot()*.12,s),this.strike(n,e,s,e.level*hn(.42,.55),{stretch:3.2,modes:.28,grit:1.7})}takeFoot(){const t=this.left?-1:1;return this.left=!this.left,t}strike(t,e,n,s,r){const o=this.engine.context,a=this.engine.noise;if(!a)return;const l=r?.stretch??1,c=r?.modes??1,h=r?.grit??1,u=(d,p,g)=>{const x=o.createBufferSource();x.buffer=a.white;const m=o.createGain();m.gain.setValueAtTime(0,n),m.gain.linearRampToValueAtTime(p,n+Math.min(.0012,g*.3)),m.gain.setTargetAtTime(0,n+.0012,g*.4),x.connect(m).connect(d),x.start(n,hn(0,a.white.duration-.5),g+.05),x.stop(n+g+.06)};u(t.impactInput,s*e.impact.level,e.impact.duration*l);for(let d=0;d<e.modes.length;d++)u(t.modeInputs[d],s*e.modes[d].level*.5*c,.002);e.grit&&t.gritInput&&this.scatter(t.gritInput,e.grit,n,s*h)}scatter(t,e,n,s){const r=this.engine.context,o=this.engine.noise;if(!o)return;const a=e.count/e.over;let l=0;for(let c=0;c<e.count&&(l+=-Math.log(1-hn(.001,1))/a,!(l>e.over*1.4));c++){const h=Math.exp(-l/e.energyDecay),u=s*e.level*h*hn(.35,1);if(u<.002)continue;const d=r.createBufferSource();d.buffer=o.white,d.playbackRate.value=hn(.7,1.4);const p=r.createGain(),g=n+l;p.gain.setValueAtTime(0,g),p.gain.linearRampToValueAtTime(u,g+8e-4),p.gain.setTargetAtTime(0,g+8e-4,.004),d.connect(p).connect(t),d.start(g,hn(0,o.white.duration-.2),.06),d.stop(g+.07)}}chainFor(t){const e=this.chains.get(t);if(e)return e;const n=this.engine.context,s=Or[t],r=n.createGain(),o=n.createBiquadFilter();o.type="lowpass",o.frequency.value=s.impact.tone,r.connect(o).connect(this.output);const a=s.modes.map(h=>{const u=n.createGain(),d=n.createBiquadFilter();d.type="bandpass",d.frequency.value=h.hz,d.Q.value=Math.min(220,Math.max(1,Math.PI*h.hz*h.decay));const p=n.createGain();return p.gain.value=1/Math.sqrt(d.Q.value),u.connect(d).connect(p).connect(this.output),u});let l=null;if(s.grit){l=n.createGain();const h=n.createBiquadFilter();h.type="bandpass",h.frequency.value=s.grit.hz,h.Q.value=s.grit.q,l.connect(h).connect(this.output)}const c={impactInput:r,modeInputs:a,gritInput:l};return this.chains.set(t,c),c}dispose(){this.output.disconnect(),this.body.disconnect(),this.panner.disconnect(),this.reverbSend.disconnect()}}class _y{tuning={machineRpm:52,windTone:3400,foliageArticulation:1};footsteps;engine;collider;ground;camera;emitters=[];bed;windModel;lastRoom=void 0;active=!0;constructor(t,e,n,s){this.engine=t,this.ground=e,this.collider=n,this.camera=s,this.bed=t.context.createGain(),this.bed.connect(t.dry),this.windModel=oy(t,{gain:.17,tone:this.tuning.windTone}),this.windModel.output.connect(this.bed),this.footsteps=new gy(t,.55);const r=e.anchors,o=Xh(t,{density:240,tone:.8,gain:.42,articulation:.22});this.foliage.push({model:o,base:.22}),this.emitters.push(new Ur(t,o,{position:r.tree,refDistance:2.5,maxDistance:20,rolloff:1.7,reverb:.35}));for(const a of[r.bush,new P(9.2,.5,16.8)]){const l=Xh(t,{density:160,tone:1.45,gain:.26,articulation:.34});this.foliage.push({model:l,base:.34}),this.emitters.push(new Ur(t,l,{position:a,refDistance:1.4,maxDistance:14,reverb:.25}))}this.emitters.push(new Ur(t,fy(t,{pitch:2600,interval:6,gain:.075,tone:2800}),{position:r.bird,refDistance:4,maxDistance:38,rolloff:1.4,reverb:.85})),this.machineModel=dy(t,{rpm:this.tuning.machineRpm,fundamental:42,gain:.4}),this.emitters.push(new Ur(t,this.machineModel,{position:r.machine,refDistance:2.5,maxDistance:34,rolloff:1.8,reverb:.9}))}machineModel;foliage=[];setActive(t){if(t!==this.active){this.active=t;for(const e of this.emitters)e.enabled=t;this.bed.gain.setTargetAtTime(t?1:0,this.engine.context.currentTime,.15),t&&(this.lastRoom=void 0)}}update(t){const e=this.engine.update(t,this.camera);this.windModel.update?.(t,this.engine);for(const s of this.emitters)s.update(t,this.collider,e);if(!this.active)return;const n=this.ground.roomAt(this.engine.listenerPosition);n!==this.lastRoom&&(this.lastRoom=n,this.engine.setRoom(n??"open"),this.bed.gain.setTargetAtTime(n===null?1:.22,this.engine.context.currentTime,.35),this.footsteps.surface=n===null?"earth":"stone"),this.machineModel.setRpm(this.tuning.machineRpm),this.windModel.setTone(this.tuning.windTone);for(const{model:s,base:r}of this.foliage)s.setArticulation(r*this.tuning.foliageArticulation);this.ground.update(t,this.machineModel.currentRpm)}get machinePhase(){return this.machineModel.phase}get emitterCount(){return this.emitters.length}get occludedCount(){return this.emitters.filter(t=>t.isOccluded).length}get audibleCount(){return this.emitters.filter(t=>!t.isVirtual).length}dispose(){for(const t of this.emitters)t.dispose();this.windModel.dispose(),this.footsteps.dispose(),this.bed.disconnect()}}const Xl={name:"archway",category:"structures",radius:1.8,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.range(1.5,1.9),r=e.range(2.6,3.1),o=e.range(.42,.58),a=e.range(.5,.7),l=e.chance(.5)?z.STONE:z.STONE_DARK;for(const u of[-1,1]){const d=e.int(3,4),p=r/d;for(let g=0;g<d;g++){const x=1-g/d*.12,m=new it(o*x,p*1.02,a*x);m.translate(u*(s+o)/2+e.around(0,.02),p*(g+.5),e.around(0,.02)),n.push({geometry:m,color:pn(l,e.around(1,.08)),sway:0})}}const c=new it(s+o*2.5,e.range(.34,.46),a*1.1);if(c.translate(0,r+.18,0),n.push({geometry:c,color:pn(l,.92),sway:0}),e.chance(.55)){const u=new it(s+o*1.6,.18,a*.8);u.translate(e.around(0,.06),r+.48,0),n.push({geometry:u,color:pn(l,1.08),sway:0})}const h=fe(n);return t!==1&&h.scale(t,t,t),ue(h,"archway",0)}},vy=Object.freeze(Object.defineProperty({__proto__:null,archway:Xl},Symbol.toStringTag,{value:"Module"})),_i={name:"barrel",category:"objects",radius:.55,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.range(.75,1.05),r=e.range(.3,.4),o=r*e.range(.78,.88),a=e.int(8,11),l=e.chance(.25),c=[new et(0,0),new et(o,0),new et(r,s*.35),new et(r,s*.65),new et(o,s),new et(0,s)];n.push({geometry:new Bl(c,a),color:z.TIMBER,sway:0});for(const u of[.14,.5,.86]){const d=u>.3&&u<.7?r:o+(r-o)*.45,p=new Bt(d*1.04,d*1.04,.055,a);p.translate(0,s*u,0),n.push({geometry:p,color:z.IRON,sway:0})}let h=fe(n);return l&&(h.rotateX(Math.PI/2),h.rotateY(e.range(0,Math.PI*2)),h.translate(0,r,0)),t!==1&&(h=h.scale(t,t,t)),ue(h,"barrel",0)}},xy=Object.freeze(Object.defineProperty({__proto__:null,barrel:_i},Symbol.toStringTag,{value:"Module"})),dd={name:"bed",category:"furniture",radius:1.3,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.range(.9,1.25),r=e.range(1.85,2.15),o=e.range(.26,.4),a=e.range(.07,.1),l=e.chance(.55)?z.TIMBER_DARK:z.BARK,c=e.pick([z.CLOTH,z.WOOL,z.HIDE_PALE]),h=e.pick([z.HIDE,z.LEAF_DARK,z.RUST,z.STONE_DARK]),u=e.chance(.5)?-1:1;for(const A of[-1,1]){const L=new it(a,o*.55,r);L.translate(A*(s-a)/2,o*.72,0),n.push({geometry:L,color:l,sway:0})}for(const A of[-1,1])for(const L of[-1,1]){const S=o*(L===u?1.05:.98),M=new it(a,S,a);M.translate(A*(s-a)/2,S/2,L*(r-a)/2),n.push({geometry:M,color:l,sway:0})}const d=e.range(.34,.62),p=new it(s,d,.055);if(p.translate(0,o+d/2-.04,u*r/2),n.push({geometry:p,color:l,sway:0}),e.chance(.55)){const A=d*e.range(.3,.5),L=new it(s,A,.05);L.translate(0,o+A/2-.04,-u*r/2),n.push({geometry:L,color:l,sway:0})}const g=o+e.range(.14,.2),x=6,m=(r-.1)/x;for(let A=0;A<x;A++){const L=-r/2+.05+(A+.5)*m,S=u<0?A/(x-1):1-A/(x-1),M=1-.22*Math.sin(S*Math.PI)*e.range(.4,1),R=(g-o*.72)*M,I=new it(s-a*1.4,R,m*1.04);I.translate(0,o*.72+R/2,L),n.push({geometry:I,color:c,sway:0})}const f=r*e.range(.6,.75),_=4,v=f/_,y=-u*r/2;for(let A=0;A<_;A++){const L=y+u*((A+.5)*v),S=e.range(.045,.075),M=new it(s-a*.6,S,v*1.02);M.translate(0,g+S/2-.01,L),n.push({geometry:M,color:h,sway:0})}const w=new it(s-a*.6,.05,.09);if(w.translate(0,g+.05,y+u*f),n.push({geometry:w,color:pn(h,1.18),sway:0}),e.chance(.85)){const A=e.range(.26,.36),L=new it(s*e.range(.5,.72),e.range(.09,.14),A);L.translate(e.around(0,s*.1),g+.06,u*(r/2-A*.8)),L.rotateY(e.around(0,.18)),n.push({geometry:L,color:pn(c,1.12),sway:0})}const E=fe(n);return t!==1&&E.scale(t,t,t),ue(E,"bed",0)}},yy=Object.freeze(Object.defineProperty({__proto__:null,bed:dd},Symbol.toStringTag,{value:"Module"}));function My(i,t,e,n,s){const r=new ge(t,e);r.deleteAttribute("normal"),r.deleteAttribute("uv");const o=Vl(r);r.dispose();const a=o.getAttribute("position"),l=new P;for(let c=0;c<a.count;c++)l.fromBufferAttribute(a,c),l.multiplyScalar(i.range(n,s)),a.setXYZ(c,l.x,l.y,l.z);return a.needsUpdate=!0,o.computeVertexNormals(),o}function zi(i,t){return i.range(t[0],t[1])}function Sy(i,t,e,n,s){const r=e.range(0,100),o=e.range(0,100),a=e.range(0,100),l=(h,u,d)=>{let p=Math.imul(Math.round(h)*374761393+Math.round(u)*668265263,1);return p=Math.imul(p^p>>>13,1274126177)+Math.round(d)*951274213,p^=p>>>16,(p>>>0)%1e3/1e3},c=(h,u,d)=>{const p=Math.floor(h),g=Math.floor(u),x=Math.floor(d),m=fa(h-p),f=fa(u-g),_=fa(d-x);let v=0;for(let y=0;y<=1;y++)for(let w=0;w<=1;w++)for(let E=0;E<=1;E++){const A=(E?m:1-m)*(w?f:1-f)*(y?_:1-_);v+=l(p+E,g+w,x+y)*A}return v};return(h,u,d)=>c(h*n+r,u*n+o,d*n+a)<s?t:i}function fa(i){return i*i*(3-2*i)}function fo(i,t,e,{scale:n=1}){const s=[],r=zi(e,t.length),o=zi(e,t.girth),a=zi(e,t.legLength),l=o*e.range(.62,.78),c=e.pick(t.hide),h=a+o/2,u=t.woolly||r>1.2?1:0,d=t.woolly?My(e,o/2,u,.86,1.24):new ge(o/2,u);d.scale(l/o,1,r/o),d.rotateZ(e.around(0,.05)),d.translate(0,h,0);const p=t.woolly?by:t.patch?Sy(c,e.pick(t.patch),e,2.6/o,t.patchCoverage??.45):c;s.push({geometry:d,color:p,sway:0});const g=zi(e,t.neck),x=zi(e,t.neckRise),m=new P(0,h+o*.18,r*.4),f=o*.45,_=g+f,v=new Bt(o*.17,o*.24,_,6);v.translate(0,_/2-f,0),v.rotateX(Math.PI/2-x),v.translate(m.x,m.y,m.z),s.push({geometry:v,color:p,sway:0});const y=new P(0,m.y+Math.sin(x)*g,m.z+Math.cos(x)*g),w=zi(e,t.headSize),E=new ge(w,0);if(E.scale(.85,.9,t.headStretch),E.rotateY(e.around(0,.2)),E.translate(y.x,y.y,y.z),s.push({geometry:E,color:p,sway:0}),t.snout>0){const L=new Bt(w*t.snout*.8,w*t.snout,w*.5,6);L.rotateX(Math.PI/2),L.translate(y.x,y.y-w*.15,y.z+w*t.headStretch),s.push({geometry:L,color:t.extremity,sway:0})}for(const L of[-1,1]){if(t.ears!=="none"){const S=new Pe(w*.28,w*.85,4);S.translate(0,w*.42,0),t.ears==="floppy"?S.rotateZ(L*2.4):t.ears==="side"?S.rotateZ(L*1.5):S.rotateZ(L*.35),S.translate(y.x+L*w*.6,y.y+w*.4,y.z),s.push({geometry:S,color:t.extremity,sway:0})}if(t.horns!=="none"){const S=w*(t.horns==="curved"?1.5:.7),M=new Pe(w*.16,S,5);M.translate(0,S/2,0),M.rotateZ(L*(t.horns==="curved"?1.1:.5)),M.translate(y.x+L*w*.45,y.y+w*.55,y.z),s.push({geometry:M,color:$h,sway:0})}for(const S of[-1,1]){const M=h,R=new Bt(t.legThickness*.78,t.legThickness,M,5);R.translate(0,M/2,0),R.rotateZ(L*e.range(-.02,.07)),R.translate(L*l*.34,0,S*r*e.range(.26,.34)),s.push({geometry:R,color:c,sway:0});const I=new Bt(t.legThickness*1.15,t.legThickness*1.05,a*.13,5);I.translate(L*l*.34,a*.06,S*r*.3),s.push({geometry:I,color:wy,sway:0})}}if(t.tail!=="none"){const L=new P(0,h+o*.16,-r*.42);if(t.tail==="curl"){const M=o*.06;for(let R=0;R<9;R++){const I=R/8,U=I*Math.PI*2.2,B=new ge(M*(1-I*.25),0);B.translate(Math.sin(U)*o*.1,L.y+I*o*.2,L.z-o*.04-(1-Math.cos(U))*o*.05),s.push({geometry:B,color:t.extremity,sway:0})}}else{const S=r*(t.tail==="flowing"?.55:.42),M=e.range(.08,.42),R=new Bt(o*.035,o*.06,S,4);R.translate(0,-S/2,0),R.rotateX(M),R.translate(L.x,L.y,L.z),s.push({geometry:R,color:c,sway:.35});const I=S*.92,U=new ge(o*.09,0);U.scale(.75,t.tail==="flowing"?1.7:1.05,.75),U.rotateX(M),U.translate(L.x,L.y-I*Math.cos(M),L.z-I*Math.sin(M)),s.push({geometry:U,color:$h,sway:.6})}}const A=fe(s);return A.rotateY(e.range(0,Math.PI*2)),n!==1&&A.scale(n,n,n),ue(A,i,e()*Math.PI*2)}const by=12433060,$h=9076841,wy=3814187,Ey={length:[1.9,2.3],girth:[.85,1.05],legLength:[.62,.78],legThickness:.085,neck:[.4,.55],neckRise:[.05,.3],headSize:[.24,.3],headStretch:1.5,snout:.55,ears:"side",horns:"stub",tail:"switch",woolly:!1,hide:[z.WOOL,z.STONE_PALE],extremity:z.HOG,patch:[z.COW_BLACK,z.COW_BLACK,z.HIDE_DARK],patchCoverage:.46},fd={name:"bovine",category:"animals",radius:1.4,build:(i={})=>fo("bovine",Ey,se(i.seed??1),i)},Ty=Object.freeze(Object.defineProperty({__proto__:null,bovine:fd},Symbol.toStringTag,{value:"Module"}));function Ay(i,t){const e=new ge(t,0);e.deleteAttribute("normal"),e.deleteAttribute("uv");const n=Vl(e);e.dispose();const s=n.getAttribute("position"),r=new P;for(let o=0;o<s.count;o++)r.fromBufferAttribute(s,o),r.multiplyScalar(i.range(.78,1.2)),s.setXYZ(o,r.x,r.y,r.z);return s.needsUpdate=!0,n.scale(1,i.range(.45,.7),i.range(.85,1.1)),n.computeVertexNormals(),n}const pd={name:"cairn",category:"nature",radius:.7,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.int(4,7);let r=e.range(.26,.38),o=0;for(let l=0;l<s;l++){const c=Ay(e,r);c.computeBoundingBox();const h=c.boundingBox,u=h?(h.max.y-h.min.y)/2:r*.5;c.rotateY(e.range(0,Math.PI*2)),o+=u*(l===0?1:1.55),c.translate(e.around(0,r*.14),o,e.around(0,r*.14)),n.push({geometry:c,color:e.chance(.35)?z.STONE_DARK:z.STONE,sway:0}),r*=e.range(.76,.9)}const a=fe(n);return t!==1&&a.scale(t,t,t),ue(a,"cairn",0)}},Ry=Object.freeze(Object.defineProperty({__proto__:null,cairn:pd},Symbol.toStringTag,{value:"Module"})),gl={name:"chair",category:"furniture",radius:.45,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.range(.42,.5),r=e.range(.38,.46),o=e.range(.36,.44),a=e.range(.04,.06),l=e.range(.44,.66),c=e.pick(["slats","spindles","board"]),h=e.chance(.55)?z.TIMBER:z.TIMBER_DARK,u=h===z.TIMBER?z.TIMBER_DARK:z.TIMBER,d=new it(r,a,o);d.translate(0,s-a/2,0),n.push({geometry:d,color:h,sway:0});const p=e.range(.035,.048),g=r/2-p*.7,x=o/2-p*.7;for(const _ of[-1,1]){const v=new it(p,s,p);v.translate(_*g,s/2,x),n.push({geometry:v,color:u,sway:0})}for(const _ of[-1,1]){const v=new it(p,s,p);v.translate(_*g,s/2,-x),n.push({geometry:v,color:u,sway:0});const y=.03,w=new it(p,l+y,p);w.translate(_*g,s+l/2-y/2,-x),n.push({geometry:w,color:u,sway:0})}const m=(_,v)=>{_.translate(0,s+v,-x)};if(c==="board"){const _=l*e.range(.4,.55),v=new it(r*.86,_,.03);m(v,l-_*.62),n.push({geometry:v,color:h,sway:0})}else if(c==="slats"){const _=e.int(2,3);for(let v=0;v<_;v++){const y=l*(.42+v/Math.max(_-1,1)*.5),w=new it(r*.84,e.range(.06,.1),.026);m(w,y),n.push({geometry:w,color:h,sway:0})}}else{const _=e.int(3,5),v=r*.72,y=l*.93,w=.02,E=y+w;for(let L=0;L<_;L++){const S=-v/2+L/(_-1)*v,M=new it(.026,E,.026);M.translate(S,E/2-w,0),m(M,0),n.push({geometry:M,color:u,sway:0})}const A=new it(r*.84,.055,.032);m(A,y),n.push({geometry:A,color:h,sway:0})}if(e.chance(.6)){const _=new it(g*2,.026,.026);_.translate(0,s*e.range(.28,.36),x),n.push({geometry:_,color:u,sway:0})}const f=fe(n);return t!==1&&f.scale(t,t,t),ue(f,"chair",0)}},Cy=Object.freeze(Object.defineProperty({__proto__:null,chair:gl},Symbol.toStringTag,{value:"Module"})),Kh=[{name:"small",weight:.3,scale:[.55,.75]},{name:"ordinary",weight:.45,scale:[.85,1.15]},{name:"large",weight:.18,scale:[1.5,1.9]},{name:"huge",weight:.07,scale:[2.1,2.6]}],Kn={name:"crate",category:"objects",radius:1.2,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[];let s=e(),r=Kh[1];for(const m of Kh)if(s-=m.weight,s<=0){r=m;break}const o=e.range(r.scale[0],r.scale[1]),a=e.range(.5,.9)*o,l=e.range(.45,.8)*o,c=e.range(.5,.9)*o,h=e.around(0,.35),u=new it(a,l,c);u.translate(0,l/2,0),u.rotateY(h),n.push({geometry:u,color:z.TIMBER,sway:0});const d=Math.max(2,Math.round(2+o*.9+(e.chance(.3)?1:0))),p=.05*Math.min(o,1.5),g=1.02;for(let m=0;m<d;m++){const f=l*(.13+m/Math.max(d-1,1)*.74),_=new it(a*g,p,c*g);_.translate(0,f,0),_.rotateY(h),n.push({geometry:_,color:z.TIMBER_DARK,sway:0})}if(o>1.2||e.chance(.25)){const m=.055*Math.min(o,1.6);for(const f of[-1,1])for(const _ of[-1,1]){const v=new it(m,l*.96,m);v.translate(f*a/2,l*.48,_*c/2),v.rotateY(h),n.push({geometry:v,color:z.RUST,sway:0})}}if(e.chance(.35)){const m=new it(a*.92,.05*o,c*.92);m.translate(e.around(0,.08*o),l+.03*o,e.around(0,.08*o)),m.rotateY(h+e.around(0,.25)),n.push({geometry:m,color:z.TIMBER_DARK,sway:0})}const x=fe(n);return t!==1&&x.scale(t,t,t),ue(x,"crate",0)}},Py=Object.freeze(Object.defineProperty({__proto__:null,crate:Kn},Symbol.toStringTag,{value:"Module"})),Ly={timber:{leaf:z.TIMBER,ledge:z.TIMBER_DARK,iron:z.IRON,frame:z.STONE_DARK},iron:{leaf:z.IRON,ledge:z.STONE_DARK,iron:z.RUST,frame:z.STONE},plank:{leaf:z.TIMBER_DARK,ledge:z.TIMBER,iron:z.RUST,frame:z.TIMBER_DARK}},Dy=["timber","iron","plank"];function md(i){return i.userData.door}function ql(i={}){const{seed:t=1,scale:e=1}=i,n=se(t),s=[],r=i.material??n.pick(Dy),o=Ly[r],a=n.range(.94,1.16),l=n.range(2,2.28),c=n.range(.07,.1),h=n.range(.13,.18),u=c*2.4;for(const S of[-1,1]){const M=new it(h,l+h,u);M.translate(S*(a+h)/2,(l+h)/2,-u*.18),s.push({geometry:M,color:o.frame,sway:0})}const d=new it(a+h*2.6,h,u*1.1);if(d.translate(0,l+h/2,-u*.18),s.push({geometry:d,color:o.frame,sway:0}),n.chance(.55)){const S=new it(a+h*2.2,.06,u*1.5);S.translate(0,.03,-u*.1),s.push({geometry:S,color:o.frame,sway:0})}const p=new it(a,l,.02);p.translate(0,l/2,-c*.5),s.push({geometry:p,color:1316378,sway:0});const g=n.int(4,6),x=a/g;for(let S=0;S<g;S++){const M=c*n.range(.88,1),R=new it(x*.94,l*n.range(.985,1),M);R.translate(-a/2+x*(S+.5),l/2,M/2),s.push({geometry:R,color:o.leaf,sway:0})}const m=n.chance(.4)?[l*.16,l*.52,l*.87]:[l*.18,l*.82],f=c*.42;for(const S of m){const M=new it(a*.96,n.range(.1,.15),f);M.translate(0,S,c+f/2),s.push({geometry:M,color:o.ledge,sway:0})}const _=n.chance(.5)?-1:1,v=f*.5;for(const S of[m[0],m[m.length-1]]){const M=a*n.range(.45,.7),R=new it(M,.055,v);R.translate(_*(a/2-M/2),S,c+f+v/2),s.push({geometry:R,color:o.iron,sway:0});const I=new it(.07,.09,v*2.2);I.translate(_*(a/2+.02),S,c+v),s.push({geometry:I,color:o.iron,sway:0})}const y=-_*a*n.range(.3,.36),w=l*n.range(.44,.5);if(n.chance(.5)){const S=new Bt(.062,.062,.02,8);S.rotateX(Math.PI/2),S.translate(y,w,c+.01),s.push({geometry:S,color:o.iron,sway:0});const M=new Bt(.022,.026,.05,6);M.rotateX(Math.PI/2),M.translate(y,w,c+.043),s.push({geometry:M,color:o.iron,sway:0});const R=new ge(.052,0);R.scale(1,1,.78),R.translate(y,w,c+.095),s.push({geometry:R,color:o.iron,sway:0})}else{const S=new it(.045,.2,.045);S.translate(y,w,c+.055),s.push({geometry:S,color:o.iron,sway:0});for(const M of[-.09,.09]){const R=new it(.05,.05,.05);R.translate(y,w+M,c+.025),s.push({geometry:R,color:o.iron,sway:0})}}const E=fe(s);e!==1&&E.scale(e,e,e);const A=ue(E,"door",0),L={width:(a+h*2)*e,height:(l+h)*e,depth:(c+f+v)*e,material:r};return A.userData.door=L,A}const Iy={name:"door",category:"structures",radius:.9,build:ql},Uy=Object.freeze(Object.defineProperty({__proto__:null,buildDoor:ql,door:Iy,doorMetrics:md},Symbol.toStringTag,{value:"Module"})),Ny={length:[1.9,2.2],girth:[.75,.9],legLength:[.95,1.15],legThickness:.07,neck:[.6,.8],neckRise:[.75,1.05],headSize:[.2,.25],headStretch:1.9,snout:.5,ears:"perked",horns:"none",tail:"flowing",woolly:!1,hide:[z.HIDE_DARK,z.HIDE,z.BARK],extremity:z.HIDE_DARK},gd={name:"equine",category:"animals",radius:1.4,build:(i={})=>fo("equine",Ny,se(i.seed??1),i)},Oy=Object.freeze(Object.defineProperty({__proto__:null,equine:gd},Symbol.toStringTag,{value:"Module"})),_d={name:"fence",category:"structures",radius:2.4,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.int(3,5),r=e.range(1.1,1.6),o=e.range(.85,1.25),a=e.int(2,3),l=s*r;for(let h=0;h<=s;h++){const u=h*r-l/2,d=e.around(0,.09),p=o*e.range(.85,1.1),g=new it(.11,p,.11);g.translate(0,p/2,0),g.rotateZ(d),g.rotateY(e.around(0,.25)),g.translate(u,0,e.around(0,.06)),n.push({geometry:g,color:z.TIMBER,sway:0})}for(let h=0;h<s;h++){if(e.chance(.22))continue;const u=h*r-l/2+r/2;for(let d=0;d<a;d++){const p=o*(.32+d/Math.max(a-1,1)*.52),g=new it(r*1.02,.07,.05);g.rotateZ(e.around(0,.05)),g.translate(u,p+e.around(0,.03),e.around(0,.03)),n.push({geometry:g,color:z.TIMBER_DARK,sway:0})}}const c=fe(n);return c.rotateY(e.range(0,Math.PI)),t!==1&&c.scale(t,t,t),ue(c,"fence",0)}},Fy=Object.freeze(Object.defineProperty({__proto__:null,fence:_d},Symbol.toStringTag,{value:"Module"})),By=[{shape:"cone",weight:.3},{shape:"orb",weight:.2},{shape:"wedge",weight:.16},{shape:"drum",weight:.14},{shape:"block",weight:.11},{shape:"spike",weight:.09}];function zy(i){let t=i();for(const e of By)if(t-=e.weight,t<=0)return e.shape;return"cone"}const ky={cone:.3,wedge:.3,drum:.4,block:.4,orb:.5,spike:.85};function Hy(i,t,e){switch(i){case"cone":return new Pe(t*1.15,t*e.range(2.2,3.2),e.int(5,8));case"wedge":return new Pe(t*1.3,t*e.range(1.6,2.2),4);case"drum":return new Bt(t*1.1,t*1.15,t*e.range(1.1,1.7),7);case"block":return new it(t*1.7,t*e.range(1.6,2.3),t*1.5);case"spike":return new ho(t*1.3,0);case"orb":default:return new ge(t,0)}}function Gy(i,t,e,n){switch(i.int(0,3)){case 0:return{geometry:new it(t*2,n,t*1.3),halfDepth:t*.65};case 1:return{geometry:new Bt(e,t,n,i.int(5,7)),halfDepth:t*.85};case 2:return{geometry:new Bt(t,e,n,4),halfDepth:t*.75};default:return{geometry:new Bt(t,e,n,i.int(5,7)),halfDepth:t*.85}}}function Zh(i,t,e,n){return i?new it(t*2,n,t*2):new Bt(t,e,n,5)}function Tn(i,t,e=0){return new P(t*(i.reach+.03+e),i.hold,.16)}const Vy=[(i,t,e)=>{const n=i.range(.11,.16),s=Tn(t,e,n*.6),r=new Bt(n*.6,n*.4,n,7);return r.translate(s.x,s.y+n/2,s.z),[{geometry:r,color:i.pick([z.WOOL,z.RUST]),sway:0}]},(i,t,e)=>{const n=i.range(.14,.2),s=Tn(t,e,n),r=new ge(n,0);r.scale(1,1.15,1),r.translate(s.x,s.y+n*.7,s.z);const o=new Bt(n*.32,n*.45,n*.8,6);o.translate(s.x,s.y+n*1.8,s.z);const a=i.pick([z.RUST,z.COW_BLACK]);return[{geometry:r,color:a,sway:0},{geometry:o,color:a,sway:0}]},(i,t,e)=>{const n=i.range(.1,.15),s=Tn(t,e,n),r=new ge(n,0);return r.scale(1,i.range(.7,.95),i.range(.8,1.1)),r.rotateX(i.range(0,Math.PI)),r.rotateY(i.range(0,Math.PI)),r.translate(s.x,s.y,s.z),[{geometry:r,color:i.pick([z.STONE_DARK,z.COW_BLACK]),sway:0}]},(i,t,e)=>{const n=[],s=Tn(t,e,.04),r=i.range(.28,.45),o=new Bt(.012,.016,r,4);o.translate(s.x,s.y+r/2,s.z),n.push({geometry:o,color:z.BARK,sway:.45});const a=i.int(3,6);for(let l=0;l<a;l++){const c=new ge(i.range(.055,.085),0);c.scale(1,.4,.85),c.rotateY(i.range(0,Math.PI)),c.rotateZ(i.around(0,.5)),c.translate(s.x+i.around(0,.07),s.y+r*i.range(.6,1.05),s.z+i.around(0,.06)),n.push({geometry:c,color:z.LEAF,sway:.7})}return n},(i,t,e)=>{const n=i.range(.11,.16),s=Tn(t,e,n*1.5),r=new ge(n,0);return r.scale(1.5,.75,.9),r.rotateY(i.around(0,.4)),r.translate(s.x,s.y+.03,s.z),[{geometry:r,color:i.pick([z.BARK_PALE,z.MARKER_YELLOW]),sway:0}]},(i,t,e)=>{const n=i.range(.16,.23),s=Tn(t,e,n),r=new ge(n,0);return r.scale(1,i.range(.8,1.05),.9),r.rotateX(i.range(0,Math.PI)),r.translate(s.x,s.y+.06,s.z),[{geometry:r,color:i.pick([z.WOOL,z.RUST]),sway:0}]},(i,t,e)=>{const n=i.range(.2,.28),s=Tn(t,e,n*.55),r=new it(n*.75,n,.03);return r.rotateZ(e*i.range(.15,.45)),r.translate(s.x,s.y+n*.3,s.z),[{geometry:r,color:i.pick([z.COW_BLACK,z.WOOL]),sway:0}]},(i,t,e)=>{const n=Tn(t,e,.07),s=i.range(.1,.18),r=new Bt(.01,.01,s,4);r.translate(n.x,n.y+s/2,n.z);const o=new it(.12,.15,.12);o.translate(n.x,n.y-.07,n.z);const a=new Pe(.095,.06,4);return a.translate(n.x,n.y+.02,n.z),[{geometry:r,color:z.IRON,sway:0},{geometry:o,color:z.MARKER_YELLOW,sway:0},{geometry:a,color:z.IRON,sway:0}]},(i,t,e)=>{const n=i.range(.24,.36),s=Tn(t,e,n*.5),r=new ho(n*.36,0);r.scale(1.9,.85,.5),r.rotateZ(e*.8),r.translate(s.x,s.y-n*.25,s.z);const o=new Pe(n*.16,n*.24,3);return o.scale(1,1,.4),o.rotateZ(e*.8+Math.PI),o.translate(s.x+e*n*.32,s.y-n*.25-n*.42,s.z),[{geometry:r,color:z.STONE_PALE,sway:0},{geometry:o,color:z.STONE,sway:0}]}],pa=[{name:"held",weight:.52,build:(i,t,e)=>i.pick(Vy)(i,t,e)},{name:"pauldron",weight:.18,build:(i,t,e)=>{const n=new ge(i.range(.09,.14),0);return n.scale(1.15,.65,1.05),n.rotateY(i.range(0,Math.PI)),n.translate(e*(t.chest+.04),t.shoulder-.02,0),[{geometry:n,color:z.IRON,sway:0}]}},{name:"pack",weight:.19,build:(i,t,e)=>{const n=i.range(.2,.32),s=i.range(.24,.4),r=i.range(.12,.2),o=new it(n,s,r);return o.rotateY(i.around(0,.2)),o.translate(e*i.range(0,.07),t.shoulder-s*.55,-(t.depth+r*.4)),[{geometry:o,color:z.TIMBER_DARK,sway:0}]}},{name:"horn",weight:.08,build:(i,t,e)=>{const n=i.range(.14,.3),s=new Pe(i.range(.02,.035),n,4);return s.translate(0,n/2,0),s.rotateZ(e*i.range(.5,1.1)),s.rotateX(i.around(0,.3)),s.translate(e*.05,t.height*.97,0),[{geometry:s,color:z.SKIN,sway:0}]}}];function jh(i){let t=i()*pa.reduce((e,n)=>e+n.weight,0);for(const e of pa)if(t-=e.weight,t<=0)return e;return pa[0]}const Ps={name:"figure",category:"people",radius:.55,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.range(1.55,2.05),r=e.range(.72,1.24),o=s*e.range(.44,.58),a=s*e.range(.78,.87),l=e.pick([z.CLOTH,z.TIMBER_DARK,z.STONE_DARK]),c=e.chance(.45),h=e.chance(.5)?1:-1,u=.19*r*e.range(.8,1.25),d=.15*r*e.range(.8,1.3),{geometry:p,halfDepth:g}=Gy(e,u,d,a-o);p.translate(0,(a+o)/2,0),p.rotateY(e.around(0,.25)),n.push({geometry:p,color:l,sway:0});const x=e.range(.04,.22),m=new Bt(.045,.06,x,5);m.translate(0,a+x/2,0),n.push({geometry:m,color:z.SKIN,sway:0});const f=e.range(.085,.15),_=zy(e),v=Hy(_,f,e);v.scale(e.range(.82,1.08),e.range(.95,1.3),e.range(.85,1.12)),v.rotateZ(e.around(0,.16)),v.rotateY(e.range(0,Math.PI)),v.computeBoundingBox();const y=f*ky[_];v.translate(0,a+x-y-(v.boundingBox?.min.y??0),0),n.push({geometry:v,color:c?l:z.SKIN,sway:0});const w=e.range(.045,.075)*r,E=e.range(.03,.055)*r,A=(a-o)*e.range(.95,1.5),L=e.chance(.25),S=e.range(-.02,.09),M=e.range(.06,.11)*r,R=e.chance(.25),I=e.range(.04,.22);for(const q of[-1,1]){const H=o,Q=Zh(L,w,w*.8,H);Q.translate(0,-H/2,0),Q.rotateZ(q*S),Q.translate(q*M,o,0),n.push({geometry:Q,color:z.TIMBER_DARK,sway:0});const W=Zh(R,E,E*.82,A);W.translate(0,-A/2,0),W.rotateZ(q*I),W.translate(q*(u+E*1.4),a-.03,0),n.push({geometry:W,color:l,sway:0})}const U={height:s,shoulder:a,hip:o,chest:u,reach:u+E*2.6,hold:a-A*.82,depth:g};e.chance(.62)&&(n.push(...jh(e).build(e,U,h)),e.chance(.22)&&n.push(...jh(e).build(e,U,h)));const B=fe(n);return t!==1&&B.scale(t,t,t),ue(B,"figure",0)}},Wy=Object.freeze(Object.defineProperty({__proto__:null,figure:Ps},Symbol.toStringTag,{value:"Module"})),vd={name:"grass",category:"foliage",radius:.55,solid:!1,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.int(30,46);for(let o=0;o<s;o++){const a=e.range(.16,.6),l=new Pe(e.range(.016,.032),a,3);l.translate(0,a/2,0),l.scale(1,1,e.range(.3,.55));const c=e.range(.1,.75)*(a/.6);l.rotateZ(e.chance(.5)?c:-c),l.rotateY(e.range(0,Math.PI*2));const h=e.range(0,Math.PI*2),u=Math.sqrt(e())*.26;l.translate(Math.cos(h)*u,0,Math.sin(h)*u),n.push({geometry:l,color:e.chance(.3)?z.GRASS_DRY:z.GRASS,sway:(d,p)=>Math.max(0,p/a)**1.5})}const r=fe(n);return t!==1&&r.scale(t,t,t),ue(r,"grass",e()*Math.PI*2)}},Xy=Object.freeze(Object.defineProperty({__proto__:null,grass:vd},Symbol.toStringTag,{value:"Module"})),Yl={name:"hut",category:"structures",radius:2.6,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.range(3,4.4),r=e.range(2.6,3.8),o=e.range(2,2.6),a=e.range(.4,.8),l=e.range(.9,1.5),c=new Bt(l,l,s*1.16,3,1);c.rotateZ(Math.PI/2),c.rotateX(Math.PI/6),c.scale(1,1,r*1.2/(l*2)),c.computeBoundingBox(),c.translate(0,o-(c.boundingBox?.min.y??0),0),n.push({geometry:c,color:z.STONE,sway:0});const h=o,u=new it(s,a,r);u.translate(0,a/2,0),n.push({geometry:u,color:z.STONE_DARK,sway:0});const d=new it(s*.97,h-a,r*.97);d.translate(0,a+(h-a)/2,0),n.push({geometry:d,color:z.TIMBER,sway:0});const p=e.range(.75,.95),g=e.range(1.5,1.8),x=e.around(0,s*.15),m=new it(p,g,.08);m.translate(x,g/2,r*.487),n.push({geometry:m,color:1514012,sway:0});const f=new it(p*1.3,.14,.16);f.translate(x,g+.07,r*.49),n.push({geometry:f,color:z.TIMBER_DARK,sway:0});for(const w of[-1,1])for(const E of[-1,1]){const A=new it(.16,h,.16);A.translate(w*s/2,h/2,E*r/2),n.push({geometry:A,color:z.TIMBER_DARK,sway:0})}const _=fe(n);t!==1&&_.scale(t,t,t);const v=ue(_,"hut",0),y={x:x*t,z:r*.487*t,width:p*t,height:g*t};return v.userData.doorAnchor=y,v}};function xd(i){return i.userData.doorAnchor}const qy=Object.freeze(Object.defineProperty({__proto__:null,hut:Yl,hutDoorAnchor:xd},Symbol.toStringTag,{value:"Module"})),Ss={name:"machine",category:"structures",radius:1.6,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.range(2.1,2.8),r=e.range(.9,1.3),o=e.range(.32,.46),a=e.chance(.5)?z.IRON:z.STONE_DARK,l=e.chance(.6)?z.RUST:z.IRON,c=new it(s,o,r);c.translate(0,o/2,0),n.push({geometry:c,color:z.STONE_DARK,sway:0});for(const R of[-1,1])for(const I of[-1,1]){const U=new it(.22,.08,.22);U.translate(R*(s-.3)/2,.04,I*(r-.3)/2),n.push({geometry:U,color:l,sway:0})}const h=e.range(.34,.46),u=s*e.range(.62,.74),d=new Bt(h,h,u,10);d.rotateZ(Math.PI/2),d.translate(-s*.12,o+h,0),n.push({geometry:d,color:a,sway:0});for(const R of[-.28,.08,.34]){const I=new Bt(h*1.06,h*1.06,.07,10);I.rotateZ(Math.PI/2),I.translate(-s*.12+u*R,o+h,0),n.push({geometry:I,color:l,sway:0})}const p=e.range(.52,.72),g=s/2+e.range(.12,.22),x=o+p*.82,m=new Bt(p,p,.12,12);m.rotateZ(Math.PI/2),m.translate(g,x,0),n.push({geometry:m,color:a,sway:0});const f=new Bt(.14,.14,.2,8);f.rotateZ(Math.PI/2),f.translate(g,x,0),n.push({geometry:f,color:l,sway:0});const _=e.chance(.5)?4:3;for(let R=0;R<_;R++){const I=new it(.07,p*1.85,.06);I.rotateX(Math.PI/2),I.rotateX(R/_*Math.PI),I.translate(g,x,0),n.push({geometry:I,color:pn(a,.86),sway:0})}const v=new it(.3,x-o+.1,.26);v.translate(g,o+(x-o)/2,0),n.push({geometry:v,color:z.STONE_DARK,sway:0});const y=new it(s*.42,.08,.08);y.translate(s*.16,o+h*.55,p*.42),n.push({geometry:y,color:l,sway:0});const w=e.range(1.1,1.8),E=e.range(.11,.16),A=new Bt(E*.85,E,w,8);A.translate(-s*.3,o+h*2+w/2-.1,0),n.push({geometry:A,color:a,sway:0});const L=new Bt(E*1.3,E*1.1,.1,8);L.translate(-s*.3,o+h*2+w-.14,0),n.push({geometry:L,color:l,sway:0});const S=e.int(1,2);for(let R=0;R<S;R++){const I=e.range(-.3,.25),U=new Bt(.07,.09,e.range(.16,.26),6);U.translate(-s*.12+u*I,o+h*2,0),n.push({geometry:U,color:l,sway:0});const B=new Bt(.1,.1,.035,8);B.translate(-s*.12+u*I,o+h*2+.16,0),n.push({geometry:B,color:pn(l,1.2),sway:0})}const M=fe(n);return t!==1&&M.scale(t,t,t),ue(M,"machine",0)}},Yy=Object.freeze(Object.defineProperty({__proto__:null,machine:Ss},Symbol.toStringTag,{value:"Module"})),yd={name:"mushroom",category:"foliage",radius:.4,solid:!1,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.int(3,7),r=e.pick([z.RUST,z.EARTH,z.STONE_PALE,z.BARK_PALE]);for(let a=0;a<s;a++){const l=e(),c=e.range(.04,.12)*(.45+l*.8),h=c*e.range(1.6,3.2),u=e.range(0,Math.PI*2),d=Math.sqrt(e())*.22,p=Math.cos(u)*d,g=Math.sin(u)*d,x=e.around(0,.22),m=new Bt(c*.22,c*.3,h,5);m.translate(0,h/2,0),m.rotateZ(x),m.translate(p,0,g),n.push({geometry:m,color:z.CLOTH,sway:0});const f=c*(.85+l*.7),_=c*(1.5-l*1.05),v=new Pe(f,_,e.int(6,9));v.translate(0,_/2-_*.15,0),v.rotateZ(x),v.translate(p,h,g),n.push({geometry:v,color:r,sway:0})}const o=fe(n);return t!==1&&o.scale(t,t,t),ue(o,"mushroom",0)}},$y=Object.freeze(Object.defineProperty({__proto__:null,mushroom:yd},Symbol.toStringTag,{value:"Module"})),Ky={length:[.95,1.25],girth:[.55,.7],legLength:[.34,.46],legThickness:.045,neck:[.18,.28],neckRise:[.2,.5],headSize:[.13,.17],headStretch:1.4,snout:.5,ears:"side",horns:"none",tail:"switch",woolly:!0,hide:[z.HIDE_DARK,z.STONE_DARK],extremity:z.HIDE_DARK},Md={name:"ovine",category:"animals",radius:.8,build:(i={})=>fo("ovine",Ky,se(i.seed??1),i)},Zy=Object.freeze(Object.defineProperty({__proto__:null,ovine:Md},Symbol.toStringTag,{value:"Module"})),jy={length:[1.1,1.5],girth:[.6,.78],legLength:[.25,.36],legThickness:.055,neck:[.1,.2],neckRise:[0,.2],headSize:[.19,.24],headStretch:1.45,snout:.75,ears:"floppy",horns:"none",tail:"curl",woolly:!1,hide:[z.HOG,z.HIDE_PALE,z.HIDE_DARK],extremity:z.HOG,patch:[z.HIDE_DARK,z.HIDE],patchCoverage:.3},Sd={name:"porcine",category:"animals",radius:.95,build:(i={})=>fo("porcine",jy,se(i.seed??1),i)},Jy=Object.freeze(Object.defineProperty({__proto__:null,porcine:Sd},Symbol.toStringTag,{value:"Module"})),$l={name:"post",category:"structures",radius:.4,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.range(.9,2.1),r=e.range(.07,.13),o=e.range(.02,.16),a=e.range(0,Math.PI*2),l=new it(r*2,s,r*2);if(l.translate(0,s/2,0),l.rotateZ(o),l.rotateY(a),n.push({geometry:l,color:z.TIMBER,sway:0}),e.chance(.4)){const h=e.range(.5,1.1),u=new it(h,r*1.4,r*1.4);u.translate(0,s*e.range(.6,.85),0),u.rotateZ(o),u.rotateY(a+e.around(0,.3)),n.push({geometry:u,color:z.TIMBER_DARK,sway:0})}if(e.chance(.45)){const h=new it(r*2.5,.09,r*2.5);h.translate(0,s-.09,0),h.rotateZ(o),h.rotateY(a),n.push({geometry:h,color:z.RUST,sway:0})}const c=fe(n);return t!==1&&c.scale(t,t,t),ue(c,"post",0)}},Qy=Object.freeze(Object.defineProperty({__proto__:null,post:$l},Symbol.toStringTag,{value:"Module"})),bd={name:"poultry",category:"animals",radius:.35,solid:!1,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.range(.16,.23),r=e.range(.09,.16),o=e.pick([z.FOWL,z.HIDE_PALE,z.HIDE_DARK,z.CLOTH]),a=r+s*.75,l=new ge(s,0);l.scale(.8,.95,1.25),l.rotateX(e.range(.15,.35)),l.translate(0,a,0),n.push({geometry:l,color:o,sway:0});const c=s*e.range(.42,.55),h=new P(0,a+s*e.range(.75,1.05),s*.6),u=new Bt(s*.2,s*.28,s*.55,5);u.rotateX(-.5),u.translate(0,a+s*.5,s*.42),n.push({geometry:u,color:o,sway:0});const d=new ge(c,0);d.translate(h.x,h.y,h.z),n.push({geometry:d,color:o,sway:0});const p=new Pe(c*.35,c*.8,4);p.rotateX(Math.PI/2),p.translate(h.x,h.y-c*.15,h.z+c*.9),n.push({geometry:p,color:z.MARKER_YELLOW,sway:0});const g=e.int(2,4);for(let f=0;f<g;f++){const _=f/Math.max(g-1,1),v=new Pe(c*.14,c*(.7-_*.3),3);v.scale(1,1,.4),v.translate(h.x,h.y+c*.95,h.z-_*c*.7),n.push({geometry:v,color:z.COMB,sway:.4})}if(e.chance(.6)){const f=new ge(c*.22,0);f.scale(.5,1.1,.7),f.translate(h.x,h.y-c*.75,h.z+c*.5),n.push({geometry:f,color:z.COMB,sway:.3})}const x=e.int(3,5);for(let f=0;f<x;f++){const _=(f/Math.max(x-1,1)-.5)*.8,v=new Pe(s*.2,s*e.range(.9,1.4),3);v.scale(1,1,.35),v.translate(0,s*.55,0),v.rotateX(e.range(-1.1,-.7)),v.rotateY(_),v.translate(0,a+s*.35,-s*.85),n.push({geometry:v,color:o,sway:.45})}for(const f of[-1,1]){const _=a,v=new Bt(s*.055,s*.05,_,4);v.translate(0,_/2,0),v.rotateZ(f*e.range(0,.12)),v.translate(f*s*.24,0,e.around(0,s*.1)),n.push({geometry:v,color:z.MARKER_YELLOW,sway:0});const y=new Pe(s*.13,s*.09,3);y.rotateX(Math.PI),y.translate(f*s*.24,s*.04,s*.06),n.push({geometry:y,color:z.MARKER_YELLOW,sway:0})}const m=fe(n);return m.rotateY(e.range(0,Math.PI*2)),t!==1&&m.scale(t,t,t),ue(m,"poultry",e()*Math.PI*2)}},tM=Object.freeze(Object.defineProperty({__proto__:null,poultry:bd},Symbol.toStringTag,{value:"Module"})),wd={name:"rock",category:"nature",radius:.9,build({seed:i=1,scale:t=1}={}){const e=se(i),n=e.range(.35,1.1),s=new ge(n,n>.7?1:0);s.deleteAttribute("normal"),s.deleteAttribute("uv");const r=Vl(s);s.dispose();const o=r.getAttribute("position"),a=new P;for(let h=0;h<o.count;h++)a.fromBufferAttribute(o,h),a.multiplyScalar(e.range(.72,1.28)),o.setXYZ(h,a.x,a.y,a.z);o.needsUpdate=!0,r.scale(1,e.range(.6,.85),e.range(.85,1.15)),r.translate(0,n*e.range(.28,.45),0),r.computeVertexNormals();const l=[{geometry:r,color:e.chance(.3)?z.STONE_DARK:z.STONE,sway:0}],c=fe(l);return t!==1&&c.scale(t,t,t),ue(c,"rock",0)}},eM=Object.freeze(Object.defineProperty({__proto__:null,rock:wd},Symbol.toStringTag,{value:"Module"})),_l={name:"stool",category:"furniture",radius:.42,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.chance(.45)?3:4,r=e.range(.42,.56),o=e.range(.16,.23),a=e.range(.04,.07),l=e.chance(.5)?z.TIMBER:z.TIMBER_DARK,c=l===z.TIMBER?z.TIMBER_DARK:z.TIMBER,h=s===3?new Bt(o,o*.96,a,6):new it(o*1.9,a,o*1.9);h.translate(0,r-a/2,0),s===4&&h.rotateY(e.around(0,.2)),n.push({geometry:h,color:l,sway:0});const u=r-a,d=e.range(.14,.26),p=o*.66,g=u/Math.cos(d);for(let f=0;f<s;f++){const _=f/s*Math.PI*2+(s===4?Math.PI/4:0),v=e.range(.035,.05),y=Math.cos(_),w=Math.sin(_),E=new it(v,g,v);E.translate(0,-g/2,0),E.rotateZ(d),E.rotateY(-_),E.translate(y*p,u,w*p),n.push({geometry:E,color:c,sway:0})}const x=p+g*Math.sin(d);if(s===4&&e.chance(.45)){const f=e.range(.28,.38),_=p+(x-p)*(1-f);for(const v of[0,Math.PI/2]){const y=new it(_*2,.028,.028);y.translate(0,u*f,0),y.rotateY(v+Math.PI/4),n.push({geometry:y,color:c,sway:0})}}const m=fe(n);return t!==1&&m.scale(t,t,t),ue(m,"stool",0)}},nM=Object.freeze(Object.defineProperty({__proto__:null,stool:_l},Symbol.toStringTag,{value:"Module"})),Ed={name:"stump",category:"foliage",radius:.75,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.range(.3,.7),r=e.range(.22,.36),o=r*e.range(1.25,1.6),a=e.int(6,9),l=e.range(0,.12),c=new Bt(r,o,s,a);c.translate(0,s/2,0),c.rotateZ(l),n.push({geometry:c,color:z.BARK,sway:0});const h=new Bt(r*.94,r*.94,.04,a);h.translate(0,s,0),h.rotateZ(l),n.push({geometry:h,color:z.BARK_PALE,sway:0});const u=e.int(3,6);for(let p=0;p<u;p++){const g=e.range(.3,.6),x=new Bt(.04,.11,g,4);x.translate(0,-g/2,0),x.rotateZ(e.range(1.05,1.45)),x.rotateY(p/u*Math.PI*2+e.around(0,.5)),x.translate(0,e.range(.05,.16),0),n.push({geometry:x,color:z.BARK,sway:0})}const d=fe(n);return t!==1&&d.scale(t,t,t),ue(d,"stump",0)}},iM=Object.freeze(Object.defineProperty({__proto__:null,stump:Ed},Symbol.toStringTag,{value:"Module"})),Jh=[{weight:.28,width:[.7,1],depth:[.5,.68]},{weight:.47,width:[1.2,1.7],depth:[.7,.95]},{weight:.25,width:[2.1,3],depth:[.85,1.1]}],ks={name:"table",category:"furniture",radius:1.6,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[];let s=e(),r=Jh[1];for(const _ of Jh)if(s-=_.weight,s<=0){r=_;break}const o=e.range(r.width[0],r.width[1]),a=e.range(r.depth[0],r.depth[1]),l=e.range(.68,.78),c=e.range(.045,.07),h=o>1.5&&e.chance(.45),u=e.chance(.6)?z.TIMBER:z.TIMBER_DARK,d=u===z.TIMBER?z.TIMBER_DARK:z.TIMBER,p=e.int(3,5),g=a/p,x=.008;for(let _=0;_<p;_++){const v=new it(o,c*e.range(.93,1),g-x);v.translate(0,l-c/2,-a/2+(_+.5)*g),n.push({geometry:v,color:pn(u,e.around(1,.07)),sway:0})}const m=l-c;if(h){const _=o*e.range(.16,.24);for(const y of[-1,1]){const w=y*(o/2-_),E=new it(.09,.07,a*.86);E.translate(w,.035,0),n.push({geometry:E,color:d,sway:0});const A=e.range(.09,.13),L=new it(A,m-.07,a*.2);L.translate(w,.07+(m-.07)/2,0),n.push({geometry:L,color:d,sway:0});const S=new it(.09,.06,a*.8);S.translate(w,m-.03,0),n.push({geometry:S,color:d,sway:0})}const v=new it(o-_*1.2,.07,.07);v.translate(0,m*e.range(.32,.42),0),n.push({geometry:v,color:d,sway:0})}else{const _=e.range(.055,.085),v=o/2-_*.9,y=a/2-_*.9;for(const w of[-1,1])for(const E of[-1,1]){const A=new it(_,m,_);A.translate(w*v,m/2,E*y),n.push({geometry:A,color:d,sway:0})}if(e.chance(.7)){for(const E of[-1,1]){const A=new it(v*2,.07,.03);A.translate(0,m-.07/2-.02,E*y),n.push({geometry:A,color:d,sway:0})}for(const E of[-1,1]){const A=new it(.03,.07,y*2);A.translate(E*v,m-.07/2-.02,0),n.push({geometry:A,color:d,sway:0})}}}const f=fe(n);return t!==1&&f.scale(t,t,t),ue(f,"table",0)}},sM=Object.freeze(Object.defineProperty({__proto__:null,table:ks},Symbol.toStringTag,{value:"Module"})),Td={name:"trough",category:"objects",radius:1.1,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.range(1.4,2.1),r=e.range(.5,.75),o=e.range(.4,.6),a=e.range(.09,.14),l=e.chance(.55),c=l?z.STONE:z.TIMBER,h=new it(s,a,r);h.translate(0,a/2,0),n.push({geometry:h,color:l?z.STONE_DARK:z.TIMBER_DARK,sway:0});for(const d of[-1,1]){const p=new it(s*.99,o,a);p.translate(0,o/2,d*(r-a)/2),n.push({geometry:p,color:c,sway:0});const g=new it(a,o*.985,r*.985);g.translate(d*(s-a)/2,o/2,0),n.push({geometry:g,color:c,sway:0})}if(e.chance(.6)){const d=new it(s-a*2,.03,r-a*2);d.translate(0,o*e.range(.55,.78),0),n.push({geometry:d,color:2899782,sway:0})}const u=fe(n);return u.rotateY(e.range(0,Math.PI)),t!==1&&u.scale(t,t,t),ue(u,"trough",0)}},rM=Object.freeze(Object.defineProperty({__proto__:null,trough:Td},Symbol.toStringTag,{value:"Module"})),oM=Object.assign({"./builders/archway.ts":vy,"./builders/barrel.ts":xy,"./builders/bed.ts":yy,"./builders/bovine.ts":Ty,"./builders/bush.ts":Ox,"./builders/cairn.ts":Ry,"./builders/chair.ts":Cy,"./builders/crate.ts":Py,"./builders/door.ts":Uy,"./builders/equine.ts":Oy,"./builders/fence.ts":Fy,"./builders/figure.ts":Wy,"./builders/grass.ts":Xy,"./builders/hut.ts":qy,"./builders/machine.ts":Yy,"./builders/mushroom.ts":$y,"./builders/ovine.ts":Zy,"./builders/porcine.ts":Jy,"./builders/post.ts":Qy,"./builders/poultry.ts":tM,"./builders/rock.ts":eM,"./builders/stool.ts":nM,"./builders/stump.ts":iM,"./builders/table.ts":sM,"./builders/tree.ts":Nx,"./builders/trough.ts":rM});function aM(i){if(typeof i!="object"||i===null)return!1;const t=i;return typeof t.name=="string"&&typeof t.radius=="number"&&typeof t.build=="function"}const lM=Object.values(oM).flatMap(i=>Object.values(i)).filter(aM).sort((i,t)=>i.name.localeCompare(t.name)),Qh=["foliage","nature","animals","structures","furniture","objects","people"],cM=8,hM=1.4,uM=5;function Ad(){const i=t=>{const e=Qh.indexOf(t.category);return e===-1?Qh.length:e};return[...lM].sort((t,e)=>i(t)-i(e)||t.name.localeCompare(e.name))}function dM(i={}){const t=i.origin??new P(-24,0,56),e=i.depth??4,n=new Ce;n.name="Gallery";const s=Ad();let r=t.x;for(let o=0;o<s.length;o++){const a=s[o],l=s[o+1],c=l!==void 0&&l.category!==a.category,h=l?a.radius+l.radius+hM+(c?uM:0):0,u=new Ce;u.name=`gallery:${a.name}`;const d=new Kt(new it(.5,.12,.5),new Dn({color:3028544,flatShading:!0}));d.position.set(r,.06,t.z+e),u.add(d);for(let p=0;p<cM;p++){const g=a.build({seed:1e3+p*7919});g.position.set(r,0,t.z-p*e),u.add(a.solid===!1?g:Me(g))}n.add(u),r+=h}return n.position.y=t.y,n}function fM(){const i=[];let t="";for(const e of Ad())e.category!==t&&(t=e.category,i.push(`[${t}]`)),i.push(e.name);return i.join(" · ")}const ma={open:{rt60:.7,preDelay:.012,damping:.7,wet:.12},cell:{rt60:.45,preDelay:.004,damping:.55,wet:.3},hall:{rt60:4.2,preDelay:.035,damping:.18,wet:.62}};async function pM(i,t){const e=Math.max(t.rt60,.05),n=Math.ceil(i*(e+t.preDelay)),s=new OfflineAudioContext(2,n,i),r=s.createBufferSource();r.buffer=mM(s,n,i,t);const o=s.createBiquadFilter();o.type="lowpass",o.frequency.value=700+(1-t.damping)**2*17300;const a=s.createBiquadFilter();return a.type="highpass",a.frequency.value=90,r.connect(o).connect(a).connect(s.destination),r.start(0),s.startRendering()}function mM(i,t,e,n){const s=i.createBuffer(2,t,e),r=Math.floor(n.preDelay*e),o=Math.exp(-Math.log(1e3)/(n.rt60*e));for(let a=0;a<2;a++){const l=s.getChannelData(a);let c=1;for(let h=r;h<t;h++)l[h]=(Math.random()*2-1)*c,c*=o}return s}const ga=[1,.4,.2,.1],gM=[1,2.7,6.1,13.3],_M=.11;function tu(i){let t=Math.imul(i|0,668265261);return t^=t>>>15,t=Math.imul(t,2246822507),t^=t>>>13,(t>>>0)/4294967296}function Rd(i){const t=Math.floor(i),e=i-t,n=(1-Math.cos(e*Math.PI))*.5;return tu(t)*(1-n)+tu(t+1)*n}const vM=1.35;function xM(i){let t=0,e=0;for(let s=0;s<ga.length;s++)t+=Rd(i*gM[s]+s*17.3)*ga[s],e+=ga[s];const n=t/e;return Math.min(1,Math.max(0,.5+(n-.5)*vM))}const yM={windSpeed:.5,gustDepth:.6,gustRate:.06,windDirection:2.1};class MM{settings={...yM};gust=0;swell=.5;strength=0;time=0;update(t){this.time+=t*this.settings.gustRate,this.gust=xM(this.time),this.swell=Rd(this.time*_M+91.7);const{windSpeed:e,gustDepth:n}=this.settings,s=e*(.45+this.swell*1.1);this.strength=Math.min(1,Math.max(0,s+(this.gust-.5)*n))}}const SM={masterVolume:.7,reverbAmount:1,airAbsorption:.65,occlusion:.8},bM=.12;class wM{context;settings={...SM};weather=new MM;dry;send;duck;master;noise=null;ready;started=!1;rooms=new Map;currentRoom=null;occlusionTimer=0;constructor(){this.context=new AudioContext({latencyHint:"interactive"}),this.master=this.context.createGain(),this.duck=this.context.createGain(),this.dry=this.context.createGain(),this.send=this.context.createGain();const t=this.context.createDynamicsCompressor();t.threshold.value=-6,t.knee.value=6,t.ratio.value=12,t.attack.value=.003,t.release.value=.25,this.dry.connect(this.duck),this.duck.connect(this.master),this.master.connect(t),t.connect(this.context.destination),this.ready=this.build(),this.listenForGesture(),document.addEventListener("visibilitychange",this.handleVisibility)}async build(){this.noise=Zx(this.context);const t=Object.keys(ma),e=await Promise.all(t.map(n=>pM(this.context.sampleRate,ma[n])));t.forEach((n,s)=>{const r=this.context.createConvolver();r.normalize=!0,r.buffer=e[s];const o=this.context.createGain();o.gain.value=0,this.send.connect(r),r.connect(o),o.connect(this.duck),this.rooms.set(n,{convolver:r,gain:o})}),this.currentRoom!==null&&this.setRoom(this.currentRoom)}setRoom(t,e=.45){if(this.currentRoom=t,this.rooms.size===0)return;const n=this.context.currentTime;for(const[s,r]of this.rooms){const o=s===t?ma[s].wet*this.settings.reverbAmount:0;r.gain.gain.cancelScheduledValues(n),r.gain.gain.setTargetAtTime(o,n,e/3)}}get room(){return this.currentRoom}update(t,e){return this.weather.update(t),this.updateListener(e),this.master.gain.value=this.settings.masterVolume,this.occlusionTimer-=t,this.occlusionTimer>0?!1:(this.occlusionTimer=bM,!0)}updateListener(t){const e=this.context.listener;if(t.updateWorldMatrix(!0,!1),Wn.setFromMatrixPosition(t.matrixWorld),oi.set(0,0,-1).applyQuaternion(t.getWorldQuaternion(eu)),ai.set(0,1,0).applyQuaternion(eu),e.positionX){const n=this.context.currentTime,s=.02;e.positionX.linearRampToValueAtTime(Wn.x,n+s),e.positionY.linearRampToValueAtTime(Wn.y,n+s),e.positionZ.linearRampToValueAtTime(Wn.z,n+s),e.forwardX.linearRampToValueAtTime(oi.x,n+s),e.forwardY.linearRampToValueAtTime(oi.y,n+s),e.forwardZ.linearRampToValueAtTime(oi.z,n+s),e.upX.linearRampToValueAtTime(ai.x,n+s),e.upY.linearRampToValueAtTime(ai.y,n+s),e.upZ.linearRampToValueAtTime(ai.z,n+s)}else{const n=e;n.setPosition(Wn.x,Wn.y,Wn.z),n.setOrientation(oi.x,oi.y,oi.z,ai.x,ai.y,ai.z)}}get listenerPosition(){return Wn}applyReverbAmount(){this.currentRoom!==null&&this.setRoom(this.currentRoom,.05)}listenForGesture(){const t=()=>{this.context.resume().then(()=>{this.started=this.context.state==="running"}),window.removeEventListener("pointerdown",t),window.removeEventListener("keydown",t),window.removeEventListener("touchstart",t)};window.addEventListener("pointerdown",t),window.addEventListener("keydown",t),window.addEventListener("touchstart",t)}handleVisibility=()=>{document.hidden?this.context.suspend():this.started&&this.context.resume()};dispose(){document.removeEventListener("visibilitychange",this.handleVisibility),this.context.close()}}const Wn=new P,oi=new P,ai=new P,eu=new yi;/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.21.0
 * @author George Michael Brower
 * @license MIT
 */class mn{constructor(t,e,n,s,r="div"){this.parent=t,this.object=e,this.property=n,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(r),this.domElement.classList.add("lil-controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("lil-name"),mn.nextNameID=mn.nextNameID||0,this.$name.id=`lil-gui-name-${++mn.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("lil-widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(n)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("lil-disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class EM extends mn{constructor(t,e,n){super(t,e,n,"lil-boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function vl(i){let t,e;return(t=i.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=i.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=i.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const TM={isPrimitive:!0,match:i=>typeof i=="string",fromHexString:vl,toHexString:vl},Hs={isPrimitive:!0,match:i=>typeof i=="number",fromHexString:i=>parseInt(i.substring(1),16),toHexString:i=>"#"+i.toString(16).padStart(6,0)},AM={isPrimitive:!1,match:i=>Array.isArray(i)||ArrayBuffer.isView(i),fromHexString(i,t,e=1){const n=Hs.fromHexString(i);t[0]=(n>>16&255)/255*e,t[1]=(n>>8&255)/255*e,t[2]=(n&255)/255*e},toHexString([i,t,e],n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return Hs.toHexString(s)}},RM={isPrimitive:!1,match:i=>Object(i)===i,fromHexString(i,t,e=1){const n=Hs.fromHexString(i);t.r=(n>>16&255)/255*e,t.g=(n>>8&255)/255*e,t.b=(n&255)/255*e},toHexString({r:i,g:t,b:e},n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return Hs.toHexString(s)}},CM=[TM,Hs,AM,RM];function PM(i){return CM.find(t=>t.match(i))}class LM extends mn{constructor(t,e,n,s){super(t,e,n,"lil-color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=PM(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const r=vl(this.$text.value);r&&this._setValueFromHexString(r)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class _a extends mn{constructor(t,e,n){super(t,e,n,"lil-function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class DM extends mn{constructor(t,e,n,s,r,o){super(t,e,n,"lil-number"),this._initInput(),this.min(s),this.max(r);const a=o!==void 0;this.step(a?o:this._getImplicitStep(),a),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let _=parseFloat(this.$input.value);isNaN(_)||(this._stepExplicit&&(_=this._snap(_)),this.setValue(this._clamp(_)))},n=_=>{const v=parseFloat(this.$input.value);isNaN(v)||(this._snapClampSetValue(v+_),this.$input.value=this.getValue())},s=_=>{_.key==="Enter"&&this.$input.blur(),_.code==="ArrowUp"&&(_.preventDefault(),n(this._step*this._arrowKeyMultiplier(_))),_.code==="ArrowDown"&&(_.preventDefault(),n(this._step*this._arrowKeyMultiplier(_)*-1))},r=_=>{this._inputFocused&&(_.preventDefault(),n(this._step*this._normalizeMouseWheel(_)))};let o=!1,a,l,c,h,u;const d=5,p=_=>{a=_.clientX,l=c=_.clientY,o=!0,h=this.getValue(),u=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",x)},g=_=>{if(o){const v=_.clientX-a,y=_.clientY-l;Math.abs(y)>d?(_.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(v)>d&&x()}if(!o){const v=_.clientY-c;u-=v*this._step*this._arrowKeyMultiplier(_),h+u>this._max?u=this._max-h:h+u<this._min&&(u=this._min-h),this._snapClampSetValue(h+u)}c=_.clientY},x=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",x)},m=()=>{this._inputFocused=!0},f=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",r,{passive:!1}),this.$input.addEventListener("mousedown",p),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",f)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("lil-slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("lil-fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("lil-has-slider");const t=(f,_,v,y,w)=>(f-_)/(v-_)*(w-y)+y,e=f=>{const _=this.$slider.getBoundingClientRect();let v=t(f,_.left,_.right,this._min,this._max);this._snapClampSetValue(v)},n=f=>{this._setDraggingStyle(!0),e(f.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",r)},s=f=>{e(f.clientX)},r=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",r)};let o=!1,a,l;const c=f=>{f.preventDefault(),this._setDraggingStyle(!0),e(f.touches[0].clientX),o=!1},h=f=>{f.touches.length>1||(this._hasScrollBar?(a=f.touches[0].clientX,l=f.touches[0].clientY,o=!0):c(f),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",d))},u=f=>{if(o){const _=f.touches[0].clientX-a,v=f.touches[0].clientY-l;Math.abs(_)>Math.abs(v)?c(f):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",d))}else f.preventDefault(),e(f.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",d)},p=this._callOnFinishChange.bind(this),g=400;let x;const m=f=>{if(Math.abs(f.deltaX)<Math.abs(f.deltaY)&&this._hasScrollBar)return;f.preventDefault();const v=this._normalizeMouseWheel(f)*this._step;this._snapClampSetValue(this.getValue()+v),this.$input.value=this.getValue(),clearTimeout(x),x=setTimeout(p,g)};this.$slider.addEventListener("mousedown",n),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("lil-active",t),document.body.classList.toggle("lil-dragging",t),document.body.classList.toggle(`lil-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:n}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,n=-t.wheelDelta/120,n*=this._stepExplicit?1:10),e+-n}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){let e=0;return this._hasMin?e=this._min:this._hasMax&&(e=this._max),t-=e,t=Math.round(t/this._step)*this._step,t+=e,t=parseFloat(t.toPrecision(15)),t}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class IM extends mn{constructor(t,e,n,s){super(t,e,n,"lil-option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("lil-focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("lil-focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const n=document.createElement("option");n.textContent=e,this.$select.appendChild(n)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class UM extends mn{constructor(t,e,n){super(t,e,n,"lil-string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}var NM=`.lil-gui {
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
}`;function OM(i){const t=document.createElement("style");t.innerHTML=i;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let nu=!1;class Kl{constructor({parent:t,autoPlace:e=t===void 0,container:n,width:s,title:r="Controls",closeFolders:o=!1,injectStyles:a=!0,touchStyles:l=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("button"),this.$title.classList.add("lil-title"),this.$title.setAttribute("aria-expanded",!0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("lil-children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(r),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("lil-root"),l&&this.domElement.classList.add("lil-allow-touch-styles"),!nu&&a&&(OM(NM),nu=!0),n?n.appendChild(this.domElement):e&&(this.domElement.classList.add("lil-auto-place","autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=o}add(t,e,n,s,r){if(Object(n)===n)return new IM(this,t,e,n);const o=t[e];switch(typeof o){case"number":return new DM(this,t,e,n,s,r);case"boolean":return new EM(this,t,e);case"string":return new UM(this,t,e);case"function":return new _a(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,n=1){return new LM(this,t,e,n)}addFolder(t){const e=new Kl({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(n=>{n instanceof _a||n._name in t.controllers&&n.load(t.controllers[n._name])}),e&&t.folders&&this.folders.forEach(n=>{n._title in t.folders&&n.load(t.folders[n._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(n=>{if(!(n instanceof _a)){if(n._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${n._name}"`);e.controllers[n._name]=n.save()}}),t&&this.folders.forEach(n=>{if(n._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${n._title}"`);e.folders[n._title]=n.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("lil-closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("lil-transition");const n=r=>{r.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("lil-transition"),this.$children.removeEventListener("transitionend",n))};this.$children.addEventListener("transitionend",n);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("lil-closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(n=>n.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}var Ls=function(){var i=0,t=document.createElement("div");t.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",t.addEventListener("click",function(h){h.preventDefault(),n(++i%t.children.length)},!1);function e(h){return t.appendChild(h.dom),h}function n(h){for(var u=0;u<t.children.length;u++)t.children[u].style.display=u===h?"block":"none";i=h}var s=(performance||Date).now(),r=s,o=0,a=e(new Ls.Panel("FPS","#0ff","#002")),l=e(new Ls.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var c=e(new Ls.Panel("MB","#f08","#201"));return n(0),{REVISION:16,dom:t,addPanel:e,showPanel:n,begin:function(){s=(performance||Date).now()},end:function(){o++;var h=(performance||Date).now();if(l.update(h-s,200),h>=r+1e3&&(a.update(o*1e3/(h-r),100),r=h,o=0,c)){var u=performance.memory;c.update(u.usedJSHeapSize/1048576,u.jsHeapSizeLimit/1048576)}return h},update:function(){s=this.end()},domElement:t,setMode:n}};Ls.Panel=function(i,t,e){var n=1/0,s=0,r=Math.round,o=r(window.devicePixelRatio||1),a=80*o,l=48*o,c=3*o,h=2*o,u=3*o,d=15*o,p=74*o,g=30*o,x=document.createElement("canvas");x.width=a,x.height=l,x.style.cssText="width:80px;height:48px";var m=x.getContext("2d");return m.font="bold "+9*o+"px Helvetica,Arial,sans-serif",m.textBaseline="top",m.fillStyle=e,m.fillRect(0,0,a,l),m.fillStyle=t,m.fillText(i,c,h),m.fillRect(u,d,p,g),m.fillStyle=e,m.globalAlpha=.9,m.fillRect(u,d,p,g),{dom:x,update:function(f,_){n=Math.min(n,f),s=Math.max(s,f),m.fillStyle=e,m.globalAlpha=1,m.fillRect(0,0,a,d),m.fillStyle=t,m.fillText(r(f)+" "+i+" ("+r(n)+"-"+r(s)+")",c,h),m.drawImage(x,u+o,d,p-o,g,u,d,p-o,g),m.fillRect(u+p-o,d,o,g),m.fillStyle=e,m.globalAlpha=.9,m.fillRect(u+p-o,d,o,r((1-f/_)*g))}}};function FM(){if(!ad.debug)return{gui:null,stats:null,update:()=>{},dispose:()=>{}};const i=new Ls;i.dom.style.position="fixed",i.dom.style.top="0",i.dom.style.left="0",document.body.appendChild(i.dom);const t=new Kl({title:"hswow"});return t.domElement.style.setProperty("--width","280px"),{gui:t,stats:i,update:()=>i.update(),dispose:()=>{t.destroy(),i.dom.remove()}}}const Cd={sky:!0,fogColor:"#bcd4e6",fogNear:25,fogFar:140,sunIntensity:2.2,sunColor:16773848,fillIntensity:0,fillColor:12375270,ambientIntensity:1.5,ambientSky:10339560,ambientGround:4998454,room:"open",surface:"earth",footstepReverb:.7},iu={sky:!1,fogColor:"#0d0f12",fogNear:6,fogFar:34,sunIntensity:1.1,sunColor:16770748,fillIntensity:.75,fillColor:9412792,ambientIntensity:2.1,ambientSky:9078390,ambientGround:4867130,room:"cell",surface:"wood",footstepReverb:.5},BM=.12;class zM{definition;group=null;constructor(t){this.definition=t}get id(){return this.definition.id}get name(){return this.definition.name}get environment(){return this.definition.environment}get spawn(){return this.definition.spawn}get floor(){return this.definition.floor??-20}settle(t){const e=this.definition.groundAt;if(!e)return t;const n=t.position.clone();return n.y=e(n.x,n.z)+BM,{position:n,yaw:t.yaw}}root(){return this.group===null&&(this.group=this.definition.build(),this.group.name=`zone:${this.definition.id}`,this.group.updateWorldMatrix(!0,!0)),this.group}get isBuilt(){return this.group!==null}dispose(){this.group!==null&&(this.group.traverse(t=>{(t instanceof Kt||t instanceof ao)&&t.geometry.dispose()}),this.group.clear(),this.group=null)}}const kM=1.15;function HM(i,t=new P){return t.set(Math.sin(i),0,Math.cos(i))}function GM(i){if(i.arrival)return{position:i.arrival.position.clone(),yaw:i.arrival.yaw};const t=HM(i.yaw);return{position:i.position.clone().addScaledVector(t,kM),yaw:i.yaw+Math.PI}}class VM{byZone=new Map;byDoor=new Map;add(t,e){this.addSide(t.id,t.a,t.b,e),this.addSide(t.id,t.b,t.a,e)}addSide(t,e,n,s){const r={portal:t,end:e,target:n,arrival:GM(n),door:null,label:e.label??s(n.zone)},o=this.byZone.get(e.zone);o?o.push(r):this.byZone.set(e.zone,[r])}in(t){return this.byZone.get(t)??[]}bind(t,e){t.door=e,e.userData.portal=t,this.byDoor.set(e,t)}sideOf(t){let e=t;for(;e;){const n=this.byDoor.get(e);if(n)return n;e=e.parent}return null}all(){return[...this.byZone.values()].flat()}}const WM={level:.55,click:{hz:3200,q:6,duration:.004,level:.5},modes:[{hz:180,decay:.16,q:5,level:1},{hz:430,decay:.1,q:6,level:.55},{hz:950,decay:.055,q:7,level:.25}],thump:{from:112,to:82,decay:.13,level:.55}},XM={level:.5,click:{hz:5200,q:9,duration:.005,level:.6},modes:[{hz:240,decay:.34,q:9,level:.8},{hz:620,decay:.28,q:11,level:.6},{hz:1450,decay:.2,q:12,level:.35},{hz:2900,decay:.12,q:10,level:.18}],thump:{from:78,to:62,decay:.3,level:.7}},qM={level:.42,click:{hz:2400,q:5,duration:.003,level:.35},modes:[{hz:320,decay:.08,q:5,level:.8},{hz:720,decay:.055,q:6,level:.45},{hz:1600,decay:.035,q:6,level:.2}],thump:{from:150,to:120,decay:.07,level:.3}},YM={timber:WM,iron:XM,plank:qM};function $M(i){return Math.max(i.thump.decay,...i.modes.map(e=>e.decay))*3+Pd+.05}const Pd=.032;function ki(i,t){return i+Math.random()*(t-i)}class KM{engine;constructor(t){this.engine=t}play(t,e="timber"){const n=YM[e],s=this.engine.context;if(s.state!=="running"||!this.engine.noise)return;const r=s.currentTime+.02,o=[],a=this.buildOutput(n,t,o);this.click(a,n,r,1,o);const l=r+Pd;for(const h of n.modes)this.ring(a,h,l,ki(.92,1.08),o);this.thump(a,n.thump,l,1,o);const c=$M(n);window.setTimeout(()=>{for(const h of o)h.disconnect()},(r-s.currentTime+c)*1e3+250)}buildOutput(t,e,n){const s=this.engine.context,r=s.createGain();r.gain.value=t.level;const o=s.createPanner();o.panningModel="HRTF",o.distanceModel="inverse",o.refDistance=1.6,o.maxDistance=45,o.rolloffFactor=1.1,ZM(o,e);const a=s.createGain();return a.gain.value=.9,r.connect(o),o.connect(this.engine.dry),o.connect(a),a.connect(this.engine.send),n.push(r,o,a),r}ring(t,e,n,s,r){const o=this.engine.context,a=this.engine.noise;if(!a)return;const l=o.createBufferSource();l.buffer=a.white,l.playbackRate.value=ki(.9,1.1);const c=o.createGain();c.gain.setValueAtTime(0,n),c.gain.linearRampToValueAtTime(e.level*s,n+.002),c.gain.setTargetAtTime(0,n+.002,e.decay/3);const h=o.createBiquadFilter();h.type="bandpass",h.frequency.value=e.hz,h.Q.value=e.q;const u=o.createGain();u.gain.value=Math.sqrt(e.q),l.connect(c).connect(h).connect(u).connect(t),l.start(n,ki(0,a.white.duration-1),e.decay*3+.05),l.stop(n+e.decay*3+.06),r.push(l,c,h,u)}click(t,e,n,s,r){const o=this.engine.context,a=this.engine.noise;if(!a)return;const l=o.createBufferSource();l.buffer=a.white,l.playbackRate.value=ki(.92,1.08);const c=o.createGain();c.gain.setValueAtTime(0,n),c.gain.linearRampToValueAtTime(e.click.level*s,n+6e-4),c.gain.setTargetAtTime(0,n+6e-4,e.click.duration*.5);const h=o.createBiquadFilter();h.type="bandpass",h.frequency.value=e.click.hz,h.Q.value=e.click.q;const u=o.createGain();u.gain.value=Math.sqrt(e.click.q),l.connect(c).connect(h).connect(u).connect(t),l.start(n,ki(0,a.white.duration-.5),e.click.duration+.08),l.stop(n+e.click.duration+.1),r.push(l,c,h,u)}thump(t,e,n,s,r){const o=this.engine.context,a=o.createOscillator();a.type="sine",a.frequency.setValueAtTime(e.from*ki(.96,1.04),n),a.frequency.exponentialRampToValueAtTime(e.to,n+e.decay);const l=o.createGain();l.gain.setValueAtTime(0,n),l.gain.linearRampToValueAtTime(e.level*s,n+.004),l.gain.setTargetAtTime(0,n+.004,e.decay/3),a.connect(l).connect(t),a.start(n),a.stop(n+e.decay*3+.06),r.push(a,l)}}function ZM(i,t){i.positionX?(i.positionX.value=t.x,i.positionY.value=t.y,i.positionZ.value=t.z):i.setPosition(t.x,t.y,t.z)}class jM{zones=new Map;portals=new VM;lights;options;audio=null;doorAudio=null;active=null;doored=new Set;transitioning=!1;hovered=null;crossings=0;onZoneChange=null;constructor(t){this.options=t,this.lights={sun:new xh(16773848,2.2),fill:new xh(9412792,0),ambient:new Ov(10339560,4998454,1.5)},this.lights.sun.position.set(-8,12,6),this.lights.fill.position.set(9,7,-7),t.scene.add(this.lights.sun,this.lights.fill,this.lights.ambient)}register(t){const e=new zM(t);return this.zones.set(e.id,e),e}link(t){for(const e of[t.a,t.b])if(!this.zones.has(e.zone))throw new Error(`portal ${t.id} refers to unknown zone "${e.zone}"`);this.portals.add(t,e=>this.zones.get(e)?.name??e)}prebuild(t){const e=this.zones.get(t);if(!e)return;const n=this.prepare(e);n.updateWorldMatrix(!0,!0),this.options.collider.warm(n,e.id)}surfaceAt(t,e){const n=this.active;return n?n.definition.surfaceAt?.(t,e)??n.environment.surface:"earth"}attachAudio(t){this.audio=t,this.doorAudio=new KM(t.engine),this.active&&this.applyAudio(this.active)}get current(){return this.active}get isTransitioning(){return this.transitioning}enter(t,e){const n=this.zones.get(t);if(!n)throw new Error(`no such zone "${t}"`);const{scene:s,collider:r,player:o,postfx:a,interaction:l}=this.options;this.active&&this.active!==n&&s.remove(this.active.root());const c=this.prepare(n);s.add(c),this.active=n,c.updateWorldMatrix(!0,!0),r.build(c,n.id);const h=n.environment;a.setEnvironment({sky:h.sky,fogColor:h.fogColor,fogNear:h.fogNear,fogFar:h.fogFar}),this.lights.sun.intensity=h.sunIntensity,this.lights.sun.color.setHex(h.sunColor),this.lights.fill.intensity=h.fillIntensity,this.lights.fill.color.setHex(h.fillColor),this.lights.ambient.intensity=h.ambientIntensity,this.lights.ambient.color.setHex(h.ambientSky),this.lights.ambient.groundColor.setHex(h.ambientGround),this.applyAudio(n),l.setTargets(this.portals.in(n.id).map(d=>d.door).filter(d=>d!==null));const u=n.settle(e??n.spawn);o.teleport(u.position,u.yaw),this.hovered=null,this.options.reticle.set(null),this.onZoneChange?.(n)}applyAudio(t){this.audio&&(this.audio.engine.setRoom(t.environment.room),this.audio.footsteps.surface=t.environment.surface,this.audio.footsteps.setReverb(t.environment.footstepReverb))}prepare(t){const e=t.root();if(this.doored.has(t.id))return e;this.doored.add(t.id);for(const n of this.portals.in(t.id)){const s=n.end,r=ql({seed:s.seed??1,material:s.material});r.position.copy(s.position),r.rotation.y=s.yaw,Me(r),e.add(r),this.portals.bind(n,r)}return e}update(){const{interaction:t,collider:e,player:n,reticle:s}=this.options;if(this.transitioning)return s.set(null),null;const r=t.probe(n.camera,e);return this.hovered=r?this.portals.sideOf(r.object):null,s.set(this.hovered?this.hovered.label:null),this.hovered}async use(t){if(this.transitioning)return;this.transitioning=!0,this.options.reticle.set(null);const e=t.door?md(t.door).material:"timber";su.copy(t.end.position).setY(t.end.position.y+1.2),this.doorAudio?.play(su,e),await this.options.fade.cover(()=>{this.enter(t.target.zone,t.arrival),this.crossings++}),this.transitioning=!1}respawn(){const t=this.active;t&&this.options.player.teleport(t.spawn.position,t.spawn.yaw)}dispose(){const{scene:t}=this.options;this.active&&t.remove(this.active.root()),t.remove(this.lights.sun,this.lights.fill,this.lights.ambient);for(const e of this.zones.values())e.dispose();this.zones.clear(),this.doored.clear()}}const su=new P,JM=3.2,QM=.15;class tS{reach=JM;raycaster=new kv;targets=[];constructor(){this.raycaster.far=this.reach}setTargets(t){this.targets=t}get targetCount(){return this.targets.length}probe(t,e){if(this.targets.length===0)return null;t.updateWorldMatrix(!0,!1),va.setFromMatrixPosition(t.matrixWorld),xa.set(0,0,-1).applyQuaternion(t.getWorldQuaternion(eS)),this.raycaster.far=this.reach,this.raycaster.set(va,xa);const n=this.raycaster.intersectObjects(this.targets,!0);if(n.length===0)return null;const s=n[0],r=e.raycast(va,xa);return r!==null&&r<s.distance-QM?null:{object:s.object,distance:s.distance}}}const va=new P,xa=new P,eS=new yi,nS=.14,ru=.22;class iS{element;shown=!1;label="";constructor(t){this.element=document.createElement("div"),this.element.id="prompt",this.element.setAttribute("aria-live","polite"),t.appendChild(this.element)}set(t,e="E"){const n=t!==null;n&&t!==this.label&&(this.label=t,this.element.replaceChildren(sS(e),document.createTextNode(t))),n!==this.shown&&(this.shown=n,this.element.classList.toggle("is-shown",n))}dispose(){this.element.remove()}}function sS(i){const t=document.createElement("kbd");return t.textContent=i,t}class rS{element;constructor(t){this.element=document.createElement("div"),this.element.id="fade",t.appendChild(this.element)}async cover(t){this.element.classList.add("is-black"),await ya(ru),t(),await ya(nS),this.element.classList.remove("is-black"),await ya(ru)}dispose(){this.element.remove()}}function ya(i){return new Promise(t=>window.setTimeout(t,i*1e3))}const Ld={floor:z.TIMBER,floorSeam:1315085,wall:z.CLOTH,wallTrim:z.TIMBER_DARK,ceiling:z.TIMBER_DARK,beam:z.BARK},oS={floor:z.STONE_DARK,floorSeam:921618,wall:z.STONE,wallTrim:z.IRON,ceiling:1842978,beam:z.RUST};function Dd(i){const{width:t,depth:e,height:n,seed:s=1,style:r=Ld,planks:o=!0,beams:a=3,thickness:l=.35}=i,c=se(s),h=[],u=l,d=t+u*2,p=e+u*2,g=o?-.006:0,x=new it(d,u,p);x.translate(0,g-u/2,0),h.push({geometry:x,color:o?r.floorSeam:r.floor,sway:0});const m=new it(d,u,p);m.translate(0,n+u/2,0),h.push({geometry:m,color:r.ceiling,sway:0});for(const _ of[-1,1]){const v=new it(d,n,u);v.translate(0,n/2,_*(e+u)/2),h.push({geometry:v,color:r.wall,sway:0})}for(const _ of[-1,1]){const v=new it(u,n,p);v.translate(_*(t+u)/2,n/2,0),h.push({geometry:v,color:r.wall,sway:0})}if(o){const _=c.range(.24,.34),v=Math.ceil(t/_),y=.012;for(let w=0;w<v;w++){const E=-t/2+(w+.5)*_,A=new it(_-y,.03,e);A.translate(E,-.015,0),h.push({geometry:A,color:pn(r.floor,c.around(1,.09)),sway:0})}}if(a>0){const _=c.range(.16,.24);for(let v=0;v<a;v++){const y=-e/2+(v+.5)/a*e,w=new it(d,_,c.range(.18,.26));w.translate(0,n-_/2,y),h.push({geometry:w,color:r.beam,sway:0})}}const f=.16;for(const _ of[-1,1]){const v=new it(t,f,.06);v.translate(0,f/2,_*(e-.06)/2),h.push({geometry:v,color:r.wallTrim,sway:0})}for(const _ of[-1,1]){const v=new it(.06,f,e);v.translate(_*(t-.06)/2,f/2,0),h.push({geometry:v,color:r.wallTrim,sway:0})}return ue(fe(h),"interior",0)}const ou={turf:{color:z.GRASS,variation:.1,step:"grass"},meadow:{color:z.GRASS_DRY,variation:.13,step:"grass"},dirt:{color:z.EARTH,variation:.09,step:"earth"},gravel:{color:7235158,variation:.16,step:"gravel"},cobble:{color:z.STONE,variation:.19,step:"stone"},flagstone:{color:z.STONE_PALE,variation:.08,step:"stone"},boards:{color:z.TIMBER,variation:.11,step:"wood"},crop:{color:z.LEAF_DRY,variation:.15,step:"grass"},mire:{color:4536876,variation:.12,step:"mud"},rock:{color:z.STONE_DARK,variation:.13,step:"stone"}};function aS(i,t,e,n,s,r){const o=s-e,a=r-n,l=o*o+a*a,c=l===0?0:Math.max(0,Math.min(1,((i-e)*o+(t-n)*a)/l));return Math.hypot(i-(e+o*c),t-(n+a*c))}function au(i,t,e){for(let n=i.length-1;n>=0;n--){const s=i[n];switch(s.kind){case"blot":if(Math.hypot(t-s.at[0],e-s.at[1])<=s.radius)return s.material;break;case"field":if(t>=s.min[0]&&t<=s.max[0]&&e>=s.min[1]&&e<=s.max[1])return s.material;break;case"path":{const r=s.width/2;for(let o=0;o+1<s.through.length;o++){const a=s.through[o],l=s.through[o+1];if(aS(t,e,a[0],a[1],l[0],l[1])<=r)return s.material}break}}}return null}function lS(i,t){let e=Math.round(i/1.2)*374761393+Math.round(t/1.2)*668265263|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function vs(i){const t=i<0?0:i>1?1:i;return t*t*t*(t*(t*6-15)+10)}function cS(i,t,e,n,s,r){const o=s-e,a=r-n,l=o*o+a*a,c=l===0?0:Math.max(0,Math.min(1,((i-e)*o+(t-n)*a)/l));return Math.hypot(i-(e+o*c),t-(n+a*c))}class hS{size;resolution;landforms;patches;detail;rockAngle;base;constructor(t){this.size=t.size,this.resolution=t.resolution,this.landforms=t.landforms,this.patches=t.patches??[],this.detail=t.detail??[],this.rockAngle=t.rockAngle??34,this.base=t.base??"turf"}heightAt(t,e){let n=0;for(const s of this.landforms)switch(s.kind){case"terrace":break;case"hill":{const r=Math.hypot(t-s.at[0],e-s.at[1]),o=vs(1-r/s.radius);n+=s.height*(s.falloff?o**s.falloff:o);break}case"ridge":{const r=cS(t,e,s.from[0],s.from[1],s.to[0],s.to[1]);n+=s.height*vs(1-r/s.width);break}case"basin":{const r=Math.hypot(t-s.at[0],e-s.at[1]);n-=s.depth*vs(1-r/s.radius);break}case"rim":{const o=this.size/2-Math.max(Math.abs(t),Math.abs(e));n+=s.height*vs(1-o/s.inset);break}}for(const s of this.landforms){if(s.kind!=="terrace")continue;const r=Math.hypot(t-s.at[0],e-s.at[1]);if(r>=s.radius+s.blend)continue;const o=r<=s.radius?1:vs((s.radius+s.blend-r)/s.blend);n=n*(1-o)+s.height*o}return n}get detailRegions(){return this.detail}slopeAt(t,e,n=this.resolution){const s=(this.heightAt(t+n,e)-this.heightAt(t-n,e))/(2*n),r=(this.heightAt(t,e+n)-this.heightAt(t,e-n))/(2*n);return Math.atan(Math.hypot(s,r))*180/Math.PI}build(){const t=Math.round(this.size/this.resolution),e=this.size/2,n=this.resolution,s=new Uint8Array(t*t);for(let _=0;_<t;_++)for(let v=0;v<t;v++){const y=-e+(v+.5)*n,w=-e+(_+.5)*n;let E=1;for(const A of this.detail)Math.hypot(y-A.at[0],w-A.at[1])<=A.radius&&(E=Math.max(E,A.level));s[_*t+v]=E}const r=(_,v)=>_<0||v<0||_>=t||v>=t?1:s[_*t+v],o=[],a=[],l=[],c=new P,h=new P,u=new P,d=new P,p=new P,g=new P,x=new Nt,m=(_,v)=>{o.push(_.x,_.y,_.z),a.push(v.x,v.y,v.z),l.push(x.r,x.g,x.b)};for(let _=0;_<t;_++)for(let v=0;v<t;v++){const y=s[_*t+v],w=-e+v*n,E=-e+_*n,A=r(_,v-1),L=r(_,v+1),S=r(_-1,v),M=r(_+1,v),R=(I,U)=>I===0&&A<y?this.alongEdge(w,E,w,E+n,U,A):I===1&&L<y?this.alongEdge(w+n,E,w+n,E+n,U,L):U===0&&S<y?this.alongEdge(w,E,w+n,E,I,S):U===1&&M<y?this.alongEdge(w,E+n,w+n,E+n,I,M):this.heightAt(w+I*n,E+U*n);for(let I=0;I<y;I++)for(let U=0;U<y;U++){const B=U/y,q=(U+1)/y,H=I/y,Q=(I+1)/y,W=[[w+B*n,R(B,H),E+H*n],[w+B*n,R(B,Q),E+Q*n],[w+q*n,R(q,Q),E+Q*n],[w+q*n,R(q,H),E+H*n]];for(const[ct,ft,yt]of[[0,1,2],[0,2,3]])c.set(...W[ct]),h.set(...W[ft]),u.set(...W[yt]),d.subVectors(h,c),p.subVectors(u,c),g.crossVectors(d,p).normalize(),g.y<0&&g.negate(),x.set(this.faceColor(g.y,(c.y+h.y+u.y)/3,(c.x+h.x+u.x)/3,(c.z+h.z+u.z)/3)),m(c,g),m(h,g),m(u,g)}}const f=new Ae;return f.setAttribute("position",new Zt(o,3)),f.setAttribute("normal",new Zt(a,3)),f.setAttribute("color",new Zt(l,3)),f.setAttribute(ud,new Zt(new Float32Array(o.length/3),1)),ue(f,"terrain",0)}alongEdge(t,e,n,s,r,o){const a=1/o,c=Math.min(o-1,Math.floor(r/a))*a,h=c+a,u=this.heightAt(t+(n-t)*c,e+(s-e)*c),d=this.heightAt(t+(n-t)*h,e+(s-e)*h);return u+(d-u)*((r-c)/a)}materialAt(t,e){return this.slopeAt(t,e)>this.rockAngle?"rock":au(this.patches,t,e)??this.base}stepAt(t,e){return ou[this.materialAt(t,e)].step}faceColor(t,e,n,s){const o=Math.acos(Math.min(1,Math.max(-1,t)))*180/Math.PI>this.rockAngle?"rock":au(this.patches,n,s)??this.base,a=ou[o],l=1+(lS(n,s)-.5)*a.variation*2,c=1-Math.min(Math.max(e/55,0),1)*.16;return pn(a.color,l*c)}}const Zl="village",Id=96,lu=Id/2,uS=[{kind:"basin",at:[0,0],radius:34,depth:3},{kind:"hill",at:[18,-12],radius:12,height:4.5,falloff:1.3},{kind:"hill",at:[20,8],radius:10,height:3.5,falloff:1.4},{kind:"hill",at:[8,20],radius:11,height:3,falloff:1.5},{kind:"terrace",at:[-6,1],radius:26,height:-3,blend:9},{kind:"terrace",at:[0,34],radius:6,height:-.4,blend:7},{kind:"rim",inset:13,height:14}],dS=[{kind:"field",min:[16,-6],max:[30,8],material:"crop"},{kind:"field",min:[-30,14],max:[-16,28],material:"meadow"},{kind:"blot",at:[-24,-6],radius:11,material:"meadow"},{kind:"path",through:[[0,34],[0,22],[0,15]],width:3,material:"dirt"},{kind:"path",through:[[4,2],[14,-2],[24,-2]],width:2.4,material:"dirt"},{kind:"path",through:[[-9,13],[0,8],[9,1]],width:2.2,material:"cobble"},{kind:"path",through:[[-2,17],[0,8],[1,-2]],width:2.2,material:"cobble"},{kind:"path",through:[[7,15],[0,8],[-7,0]],width:2.2,material:"cobble"},{kind:"path",through:[[11,8],[0,8],[-12,6]],width:2.2,material:"cobble"},{kind:"blot",at:[-16,-10],radius:7,material:"mire"}],vi=new hS({size:Id,resolution:3,landforms:uS,patches:dS,detail:[{at:[-6,1],radius:26,level:2},{at:[-6,1],radius:20,level:4},{at:[0,34],radius:5,level:3}]}),fS=vi,Ds=new P(0,0,34);function pS(){return{id:Zl,name:"Arkstin Village",environment:{...Cd,fogNear:30,fogFar:190,footstepReverb:.5},spawn:{position:Ud(0,28),yaw:Math.PI},floor:-20,surfaceAt:(i,t)=>vi.stepAt(i,t),groundAt:(i,t)=>vi.heightAt(i,t),build:gS}}function Ud(i,t,e=0){return new P(i,vi.heightAt(i,t)+e,t)}function ke(i,t,e,n,s,r=!0){t.position.copy(Ud(e,n)),t.rotation.y=s,i.add(r?Me(t):t)}function Ze(i,t,e){const n=se(e.seed),[s,r]=e.from??[0,0],o=e.maxSlope??26,a=e.avoid??[],l=t.solid!==!1;for(let c=0;c<e.count;c++){const h=n.range(0,Math.PI*2),u=Math.sqrt(n())*e.within,d=s+Math.cos(h)*u,p=r+Math.sin(h)*u,g=n.range(0,Math.PI*2),x=e.scale?n.range(e.scale[0],e.scale[1]):1,m=n.int(1,1e6);if(Math.abs(d)>lu-8||Math.abs(p)>lu-8||vi.slopeAt(d,p)>o)continue;const f=vi.heightAt(d,p);if(e.minHeight!==void 0&&f<e.minHeight||e.maxHeight!==void 0&&f>e.maxHeight)continue;let _=!1;for(const[v,y,w]of a)if(Math.hypot(d-v,p-y)<w){_=!0;break}_||ke(i,t.build({seed:m,scale:x}),d,p,g,l)}}const xs=[[0,8,17],[0,24,10],[0,33,8],[-16,-10,9]],mS=[[-9,13],[-2,17],[7,15],[11,8],[9,1],[1,-2],[-7,0],[-12,6]],cu=[0,8];function gS(){const i=new Ce;i.name="ArkstinVillage",i.add(Me(vi.build())),ke(i,Xl.build({seed:4714}),Ds.x,Ds.z,Math.PI),mS.forEach(([t,e],n)=>{ke(i,Yl.build({seed:700+n*131}),t,e,Math.atan2(cu[0]-t,cu[1]-e))});for(let t=0;t<5;t++){const e=t/5*Math.PI*2;ke(i,_d.build({seed:400+t}),-16+Math.cos(e)*8,-10+Math.sin(e)*8,e)}return ke(i,Td.build({seed:91}),-13,-13,.4),Ze(i,fd,{seed:8801,count:2,within:5,from:[-16,-10],maxSlope:20}),Ze(i,Md,{seed:8802,count:4,within:6,from:[-16,-10],maxSlope:20}),Ze(i,Sd,{seed:8803,count:2,within:5,from:[-17,-8],maxSlope:20}),Ze(i,bd,{seed:8804,count:6,within:9,from:[-2,6],maxSlope:18}),Ze(i,gd,{seed:8805,count:2,within:6,from:[-24,4],maxSlope:18}),ke(i,ks.build({seed:2211}),4,11,.3),ke(i,Kn.build({seed:2212}),6,12,1.1),ke(i,_i.build({seed:2213}),-4,5,0),ke(i,_i.build({seed:2214}),-5,6.5,.7),ke(i,Kn.build({seed:2215}),9,5,.5),ke(i,$l.build({seed:2216}),-2,11,0),ke(i,Ps.build({seed:3301}),3,7,2.2),ke(i,Ps.build({seed:3302}),-3,9,1.1),ke(i,Ps.build({seed:3303}),6,3,-.8),Ze(i,Wl,{seed:5001,count:130,within:42,maxSlope:30,maxHeight:9,avoid:xs,scale:[.8,1.35]}),Ze(i,zs,{seed:5002,count:90,within:42,maxSlope:32,avoid:xs}),Ze(i,vd,{seed:5003,count:220,within:42,maxSlope:28,avoid:xs}),Ze(i,yd,{seed:5004,count:40,within:36,maxSlope:22,avoid:xs}),Ze(i,Ed,{seed:5005,count:16,within:36,maxSlope:24,avoid:xs}),Ze(i,wd,{seed:6001,count:70,within:45,maxSlope:44,minHeight:4,scale:[.7,1.6]}),Ze(i,pd,{seed:6002,count:7,within:38,maxSlope:20,minHeight:5}),i}const fi="exterior",hu="example",uu="factory",du=new P(5,0,6),Ma=0,Nd=new P(42,0,-11),xl=0,Fr=.07,fu=new P(-9,0,24),pu=.35,Sa={width:10,depth:8,height:3.4},_S={width:15,depth:11,height:5.6},ba=16,bs=12,Br=6.4,mu=new P(0,1,0);function vS(i,t={}){const e=Yl.build({seed:5511});e.position.copy(du),e.rotation.y=Ma;const n=xd(e),s=new P(n.x,0,n.z+Fr).applyAxisAngle(mu,Ma).add(du),r=new P(0,0,bs/2+Fr).applyAxisAngle(mu,xl).add(Nd),o=[{id:fi,name:"Outside",environment:Cd,spawn:{position:Hx.clone(),yaw:0},floor:-20,build(){const l=i.root;l.add(Me(e)),l.add(xS());const c=Xl.build({seed:4711});return c.position.copy(fu),c.rotation.y=pu,l.add(Me(c)),t.gallery&&l.add(t.gallery()),l}},{id:hu,name:"Example Interior",environment:{...iu,room:"cell",surface:"wood",fogColor:"#181309",fogNear:9,fogFar:34,ambientSky:10655612,ambientGround:5721148,ambientIntensity:2.3,sunIntensity:1.2,fillIntensity:.8,fillColor:10521706,footstepReverb:.45},spawn:{position:new P(0,.1,1),yaw:Math.PI},floor:-5,build:()=>yS()},{id:uu,name:"The Factory",environment:{...iu,room:"hall",surface:"stone",fogColor:"#111519",fogNear:12,fogFar:48,ambientSky:8161172,ambientGround:3817284,ambientIntensity:2,sunIntensity:.9,fillIntensity:.85,fillColor:9675701,footstepReverb:.34},spawn:{position:new P(0,.1,2),yaw:Math.PI},floor:-5,build:()=>MS()},pS()],a=[{id:"example-door",a:{zone:fi,position:s,yaw:Ma,material:"timber",seed:8801},b:{zone:hu,position:new P(0,0,-8/2+Fr),yaw:0,material:"timber",seed:8802}},{id:"factory-door",a:{zone:fi,position:r,yaw:xl,material:"iron",seed:9301},b:{zone:uu,position:new P(0,0,-11/2+Fr),yaw:0,material:"iron",seed:9302}},{id:"village-gate",a:{zone:fi,position:fu,yaw:pu,material:"timber",seed:4712},b:{zone:Zl,position:Ds.clone().setY(fS.heightAt(Ds.x,Ds.z)),yaw:Math.PI,material:"timber",seed:4713}}];return{zones:o,portals:a}}function xS(){const i=new Ce;i.name="FactoryExterior",i.position.copy(Nd),i.rotation.y=xl;const t=new Dn({color:z.STONE_DARK,flatShading:!0}),e=new Dn({color:z.IRON,flatShading:!0}),n=new Dn({color:1316378,flatShading:!0}),s=new Kt(new it(ba,Br,bs),t);s.position.y=Br/2,i.add(s);const r=2.1,o=new Bt(r,r,ba*1.08,3,1);o.rotateZ(Math.PI/2),o.rotateX(Math.PI/6),o.scale(1,1,bs*1.1/(r*2)),o.computeBoundingBox(),o.translate(0,Br-(o.boundingBox?.min.y??0),0),i.add(new Kt(o,e));const a=new Kt(new it(2.3,2.7,.3),n);a.position.set(0,1.35,bs/2-.13),i.add(a);const l=new Kt(new Bt(.62,.78,6.4,8),t);return l.position.set(ba*.3,Br+2.6,-bs*.22),i.add(l),Me(i)}function yS(){const i=new Ce;i.add(Dd({...Sa,seed:4400,style:Ld,planks:!0,beams:3}));const t=Sa.width/2,e=Sa.depth/2;return de(i,dd.build({seed:3120}),-t+.9,0,-1.4,0),de(i,_l.build({seed:415}),-t+1.1,0,.7,.6),de(i,ks.build({seed:2077}),2.2,0,.6,.08),de(i,gl.build({seed:411}),2.1,0,2.1,Math.PI),de(i,gl.build({seed:412}),2.3,0,-.9,0),de(i,_l.build({seed:413}),3.6,0,1.8,.4),de(i,ks.build({seed:2078}),-1.6,0,e-.9,Math.PI),de(i,Ps.build({seed:6602}),-.2,0,2.4,Math.PI*.85),de(i,Kn.build({seed:61}),t-.9,0,-e+1,.4),de(i,Kn.build({seed:66}),t-1,0,-e+2.3,1.1),de(i,_i.build({seed:63}),-t+.7,0,e-.9,-.3),de(i,_i.build({seed:67}),t-.8,0,e-1,.2),Me(i)}function MS(){const i=new Ce;i.add(Dd({..._S,seed:7700,style:oS,planks:!1,beams:5}));const t=-5.4,e=4;de(i,Ss.build({seed:3301}),t,0,-2.4,Math.PI/2),de(i,Ss.build({seed:3302}),t,0,1.1,Math.PI/2),de(i,Ss.build({seed:3303}),t,0,4.4,Math.PI/2),de(i,Ss.build({seed:3304}),1.5,0,1.9,-.35),de(i,Kn.build({seed:71}),3.3,0,3.6,.3),de(i,_i.build({seed:74}),-.4,0,3.4,0);for(const n of[-3,.5,4])de(i,$l.build({seed:100+n*7}),e,0,n,0);return de(i,ks.build({seed:7811}),6.2,0,.6,-Math.PI/2),de(i,Kn.build({seed:72}),6.3,0,-3.4,1.2),de(i,Kn.build({seed:73}),6,0,3.9,-.6),de(i,_i.build({seed:75}),6.4,0,-1.9,.9),de(i,zs.build({seed:76,scale:.7}),-6.4,0,-4.6,0),Me(i)}function de(i,t,e,n,s,r){t.position.set(e,n,s),t.rotation.y=r,i.add(t)}const SS=.35;class bS{root;bar;label;constructor(t){const e=document.getElementById("loading"),n=e?.querySelector(".loading-bar")??null,s=e?.querySelector(".loading-label")??null;if(e&&n&&s)this.root=e,this.bar=n,this.label=s;else{this.root=document.createElement("div"),this.root.id="loading";const r=document.createElement("div");r.className="loading-track",this.bar=document.createElement("div"),this.bar.className="loading-bar",r.appendChild(this.bar),this.label=document.createElement("div"),this.label.className="loading-label",this.root.append(r,this.label),t.appendChild(this.root)}document.body.classList.add("is-loading")}async step(t,e,n){return this.label.textContent=t,this.bar.style.transform=`scaleX(${Math.min(Math.max(e,0),1)})`,await gu(),n()}async done(){this.bar.style.transform="scaleX(1)",this.label.textContent="ready",await gu(),await _u(.18),this.root.classList.add("is-gone"),document.body.classList.remove("is-loading"),await _u(SS),this.root.remove()}fail(t){this.label.textContent=t,this.bar.style.transform="scaleX(1)",this.root.classList.add("is-failed")}}function gu(){return new Promise(i=>{requestAnimationFrame(()=>requestAnimationFrame(()=>i()))})}function _u(i){return new Promise(t=>window.setTimeout(t,i*1e3))}const jl=document.getElementById("viewport");if(!(jl instanceof HTMLCanvasElement))throw new Error("#viewport canvas is missing from index.html");const Jr=document.getElementById("overlay");if(!(Jr instanceof HTMLElement))throw new Error("#overlay is missing from index.html");const rs=new Vv(jl),Jl=new Wv,ve=FM();rs.scene.fog=new oo(657935,20,90);const Cn=new ux(rs);rs.onResize=()=>Cn.resize();const Gs=new jr,Qr=new xx(jl),He=new Px(rs.camera,Qr,Gs),Mi=new bS(document.body),Xi=await Mi.step("shaping the ground",.12,()=>new Vx),wS=await Mi.step("raising the props",.42,()=>dM()),xe=new jM({scene:rs.scene,collider:Gs,player:He,postfx:Cn,interaction:new tS,reticle:new iS(Jr),fade:new rS(Jr)}),Od=vS(Xi,{gallery:()=>wS});for(const i of Od.zones)xe.register(i);for(const i of Od.portals)xe.link(i);await Mi.step("settling the world",.6,()=>xe.enter(fi));await Mi.step("raising arkstin",.78,()=>xe.prebuild(Zl));const Oe=new wM;let ie=null;await Mi.step("rendering the rooms",.86,()=>Oe.ready);await Mi.step("tuning the air",.96,()=>{ie=new _y(Oe,Xi,Gs,rs.camera),He.onFootstep=i=>{if(!ie)return;const t=He.position;ie.footsteps.surface=xe.surfaceAt(t.x,t.z),ie.footsteps.step(i)},He.onLand=i=>{if(!ie)return;const t=He.position;ie.footsteps.surface=xe.surfaceAt(t.x,t.z),ie.footsteps.land(i)},He.onJump=()=>{if(!ie)return;const i=He.position;ie.footsteps.surface=xe.surfaceAt(i.x,i.z),ie.footsteps.jump()},xe.attachAudio({engine:Oe,footsteps:ie.footsteps}),ie.setActive(xe.current?.id===fi)});xe.onZoneChange=i=>ie?.setActive(i.id===fi);ld()?(new Dx(Qr,Jr),document.body.classList.add("is-touch","is-playing")):Qr.onLockChange=i=>document.body.classList.toggle("is-playing",i);if(ve.gui){const i=Cn.settings,t=()=>Cn.apply(),e=ve.gui.addFolder("look");e.add(i,"pixelSize",1,12,1).onChange(t),e.add(i,"normalEdgeStrength",0,2,.05).onChange(t),e.add(i,"depthEdgeStrength",0,2,.05).onChange(t),e.add(i,"quantize",["off","levels","palette"]).onChange(t),e.add(i,"levels",2,16,1).onChange(t),e.add(i,"ditherScale",0,2,.05).name("dither (steps)").onChange(t),e.add(i,"ditherPattern",{bayer:"bayer","blue noise":"blue","gradient noise":"noise"}).onChange(t),e.add(i,"ditherMatrix",{"2×2":2,"4×4":4,"8×8":8}).name("bayer size").onChange(t);const n=ve.gui.addFolder("vignette").close();n.add(i,"vignetteStrength",0,1,.01).onChange(t),n.add(i,"vignetteRadius",0,1.5,.01).onChange(t),n.add(i,"vignetteSoftness",.01,1.5,.01).onChange(t);const s=ve.gui.addFolder("sky");s.addColor(i.sky,"zenith").onChange(t),s.addColor(i.sky,"horizon").onChange(t),s.addColor(i.sky,"ground").name("below horizon").onChange(t),s.add(i.sky,"curve",.1,3,.05).onChange(t);const r=ve.gui.addFolder("clouds");r.addColor(i.sky,"cloudColor").name("colour").onChange(t),r.add(i.sky,"cloudCover",.1,.9,.01).name("cover").onChange(t),r.add(i.sky,"cloudSoftness",.01,.6,.01).name("softness").onChange(t),r.add(i.sky,"cloudScale",.2,4,.05).name("scale").onChange(t),r.add(i.sky,"cloudOpacity",0,1,.01).name("opacity").onChange(t),r.add(i.sky,"cloudDrift",0,.1,.001).name("drift").onChange(t);const o=ve.gui.addFolder("light").close();o.add(xe.lights.sun,"intensity",0,5,.1).name("sun"),o.add(xe.lights.ambient,"intensity",0,5,.1).name("ambient");const a=ve.gui.addFolder("fog").close();a.add(i,"linkFogToSky").name("match horizon").onChange(t),a.addColor(i,"fogColor").onChange(t),a.add(i,"fogNear",0,200,1).onChange(t),a.add(i,"fogFar",0,400,1).onChange(t);const l=ve.gui.addFolder("palette").close();i.palette.forEach((w,E)=>{l.addColor(i.palette,E).name(`${E}`).onChange(t)});const c=ve.gui.addFolder("surfaces").close();for(const w of Object.keys(Xi.colors))c.addColor(Xi.colors,w).onChange(()=>Xi.applyColors());c.add({reset:()=>{Xi.resetColors(),ve.gui?.controllersRecursive().forEach(w=>w.updateDisplay())}},"reset");const h=ve.gui.addFolder("preset");h.add({save:()=>{const w=Cn.save();h.title(w?"preset · saved":"preset · SAVE FAILED")}},"save"),h.add({reset:()=>{Cn.reset(),ve.gui?.controllersRecursive().forEach(w=>w.updateDisplay())}},"reset"),h.add({copy:()=>{navigator.clipboard?.writeText(JSON.stringify(Cn.settings,null,2))}},"copy").name("copy JSON");const u=He.tuning,d=ve.gui.addFolder("movement");d.add(u,"walkSpeed",1,12,.1),d.add(u,"sprintScale",1,3,.05),d.add(u,"groundAccel",1,60,.5),d.add(u,"airAccel",0,20,.1),d.add(u,"friction",0,30,.5),d.add(u,"gravity",5,60,.5),d.add(u,"jumpSpeed",2,14,.1),d.add(u,"autoHop");const p=ve.gui.addFolder("contact").close();p.add(u,"slopeLimitDeg",5,85,1),p.add(u,"stepHeight",0,1,.01),p.add(u,"coyoteTime",0,.5,.01),p.add(u,"jumpBuffer",0,.5,.01);const g=ve.gui.addFolder("view");g.add(u,"lookSensitivity",2e-4,.008,1e-4),g.add(u,"invertY"),g.add(u,"eyeHeight",1,2,.01),g.add(u,"fov",50,110,1),g.add(u,"sprintFov",50,120,1);const x=ve.gui.addFolder("head bob").close();x.add(u,"bobAmount",0,.15,.001),x.add(u,"bobSway",0,.15,.001),x.add(u,"bobRoll",0,.05,5e-4),x.add(u,"bobStepsPerSecond",.5,5,.05),x.add(u,"bobSpeedInfluence",0,1,.05),x.add(u,"landDip",0,.1,.001);const m=ve.gui.addFolder("audio");m.add(Oe.settings,"masterVolume",0,1,.01).name("volume"),m.add(Oe.settings,"reverbAmount",0,2,.01).name("reverb").onChange(()=>Oe.applyReverbAmount()),m.add(Oe.settings,"airAbsorption",0,1,.01).name("air absorption"),m.add(Oe.settings,"occlusion",0,1,.01).name("occlusion");const f=ve.gui.addFolder("weather");f.add(Oe.weather.settings,"windSpeed",0,1,.01).name("wind"),f.add(Oe.weather.settings,"gustDepth",0,1,.01).name("gust depth"),f.add(Oe.weather.settings,"gustRate",.01,.6,.01).name("gust rate"),f.add({get windTone(){return ie?.tuning.windTone??3400}},"windTone",700,9e3,50).name("wind softness").onChange(w=>{ie&&(ie.tuning.windTone=w)}),f.add({get leaves(){return ie?.tuning.foliageArticulation??1}},"leaves",0,2.5,.05).name("leaf articulation").onChange(w=>{ie&&(ie.tuning.foliageArticulation=w)}),f.add({get machineRpm(){return ie?.tuning.machineRpm??52}},"machineRpm",0,200,1).name("machine rpm").onChange(w=>{ie&&(ie.tuning.machineRpm=w)});const _={speed:"0.00",grounded:"no",position:"",triangles:Gs.triangles,gallery:fM(),zone:"—",crossings:0,room:"—",audio:"waiting for a click",gust:"0.00",swell:"0.00",machine:"—",emitters:"—"},v=ve.gui.addFolder("state");v.add(_,"speed").listen().disable(),v.add(_,"grounded").listen().disable(),v.add(_,"position").listen().disable(),v.add(_,"zone").listen().disable(),v.add(_,"crossings").listen().disable(),v.add(_,"room").listen().disable(),v.add(_,"audio").listen().disable(),v.add(_,"gust").listen().disable(),v.add(_,"swell").listen().disable(),v.add(_,"machine").listen().disable(),v.add(_,"emitters").name("audible / occluded").listen().disable(),v.add(_,"triangles").listen().disable(),v.add(_,"gallery").name("gallery order").disable(),v.add({respawn:()=>xe.respawn()},"respawn");const y=ve.gui.addFolder("zones");for(const w of xe.zones.values())y.add({go:()=>xe.enter(w.id)},"go").name(w.name);Jl.add(()=>{_.speed=He.speed.toFixed(2),_.grounded=He.isGrounded?"yes":"no";const w=He.position;_.position=`${w.x.toFixed(1)}, ${w.y.toFixed(1)}, ${w.z.toFixed(1)}`,_.zone=xe.current?.name??"—",_.crossings=xe.crossings,_.triangles=Gs.triangles,_.room=Oe.room??"open",_.audio=ie===null?"rendering…":Oe.context.state,_.gust=Oe.weather.strength.toFixed(2),_.swell=Oe.weather.swell.toFixed(2),_.machine=ie?.machinePhase??"—",_.emitters=ie===null?"—":`${ie.audibleCount} / ${ie.occludedCount}`})}Jl.add((i,t)=>{He.update(i);const e=xe.current;e&&He.position.y<e.floor&&xe.respawn();const n=xe.update();Qr.takeInteract()&&n&&xe.use(n),ie?.update(i),Cn.render(t),ve.update()});He.update(0);Cn.render(0);await Mi.done();Jl.start();
