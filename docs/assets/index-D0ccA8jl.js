(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const El="170",$d=0,fc=1,Kd=2,Eu=1,Zd=2,An=3,Zn=0,Be=1,an=2,In=0,qi=1,Ta=2,pc=3,mc=4,jd=5,ci=100,Jd=101,Qd=102,tf=103,ef=104,nf=200,sf=201,rf=202,of=203,Aa=204,Ra=205,af=206,lf=207,cf=208,hf=209,uf=210,df=211,ff=212,pf=213,mf=214,Ca=0,Pa=1,La=2,Ki=3,Da=4,Ia=5,Ua=6,Na=7,Tl=0,gf=1,_f=2,Yn=0,Tu=1,Au=2,Ru=3,Cu=4,vf=5,Pu=6,Lu=7,Du=300,Zi=301,ji=302,Oa=303,Fa=304,io=306,Us=1e3,ui=1001,Ba=1002,we=1003,xf=1004,js=1005,pn=1006,go=1007,di=1008,Nn=1009,Iu=1010,Uu=1011,Ns=1012,Al=1013,pi=1014,Pn=1015,jn=1016,Rl=1017,Cl=1018,Ji=1020,Nu=35902,Ou=1021,Fu=1022,ln=1023,Bu=1024,zu=1025,Yi=1026,Qi=1027,Pl=1028,Ll=1029,ku=1030,Dl=1031,Il=1033,Gr=33776,Vr=33777,Wr=33778,Xr=33779,za=35840,ka=35841,Ha=35842,Ga=35843,Va=36196,Wa=37492,Xa=37496,qa=37808,Ya=37809,$a=37810,Ka=37811,Za=37812,ja=37813,Ja=37814,Qa=37815,tl=37816,el=37817,nl=37818,il=37819,sl=37820,rl=37821,qr=36492,ol=36494,al=36495,Hu=36283,ll=36284,cl=36285,hl=36286,yf=3200,Mf=3201,Ul=0,Sf=1,qn="",Ye="srgb",es="srgb-linear",so="linear",ne="srgb",bi=7680,gc=519,bf=512,wf=513,Ef=514,Gu=515,Tf=516,Af=517,Rf=518,Cf=519,_c=35044,vc="300 es",Ln=2e3,$r=2001;class ns{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const Ie=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let xc=1234567;const Es=Math.PI/180,Os=180/Math.PI;function xi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ie[i&255]+Ie[i>>8&255]+Ie[i>>16&255]+Ie[i>>24&255]+"-"+Ie[t&255]+Ie[t>>8&255]+"-"+Ie[t>>16&15|64]+Ie[t>>24&255]+"-"+Ie[e&63|128]+Ie[e>>8&255]+"-"+Ie[e>>16&255]+Ie[e>>24&255]+Ie[n&255]+Ie[n>>8&255]+Ie[n>>16&255]+Ie[n>>24&255]).toLowerCase()}function be(i,t,e){return Math.max(t,Math.min(e,i))}function Nl(i,t){return(i%t+t)%t}function Pf(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Lf(i,t,e){return i!==t?(e-i)/(t-i):0}function Ts(i,t,e){return(1-e)*i+e*t}function Df(i,t,e,n){return Ts(i,t,1-Math.exp(-e*n))}function If(i,t=1){return t-Math.abs(Nl(i,t*2)-t)}function Uf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Nf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Of(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Ff(i,t){return i+Math.random()*(t-i)}function Bf(i){return i*(.5-Math.random())}function zf(i){i!==void 0&&(xc=i);let t=xc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function kf(i){return i*Es}function Hf(i){return i*Os}function Gf(i){return(i&i-1)===0&&i!==0}function Vf(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Wf(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Xf(i,t,e,n,s){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),d=o((t-n)/2),p=r((n-t)/2),g=o((n-t)/2);switch(s){case"XYX":i.set(a*h,l*u,l*d,a*c);break;case"YZY":i.set(l*d,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*d,a*h,a*c);break;case"XZX":i.set(a*h,l*g,l*p,a*c);break;case"YXY":i.set(l*p,a*h,l*g,a*c);break;case"ZYZ":i.set(l*g,l*p,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Hi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ne(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const qf={DEG2RAD:Es,RAD2DEG:Os,generateUUID:xi,clamp:be,euclideanModulo:Nl,mapLinear:Pf,inverseLerp:Lf,lerp:Ts,damp:Df,pingpong:If,smoothstep:Uf,smootherstep:Nf,randInt:Of,randFloat:Ff,randFloatSpread:Bf,seededRandom:zf,degToRad:kf,radToDeg:Hf,isPowerOfTwo:Gf,ceilPowerOfTwo:Vf,floorPowerOfTwo:Wf,setQuaternionFromProperEuler:Xf,normalize:Ne,denormalize:Hi};class nt{constructor(t=0,e=0){nt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(be(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Gt{constructor(t,e,n,s,r,o,a,l,c){Gt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],p=n[5],g=n[8],x=s[0],m=s[3],f=s[6],_=s[1],v=s[4],y=s[7],w=s[2],E=s[5],A=s[8];return r[0]=o*x+a*_+l*w,r[3]=o*m+a*v+l*E,r[6]=o*f+a*y+l*A,r[1]=c*x+h*_+u*w,r[4]=c*m+h*v+u*E,r[7]=c*f+h*y+u*A,r[2]=d*x+p*_+g*w,r[5]=d*m+p*v+g*E,r[8]=d*f+p*y+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,d=a*l-h*r,p=c*r-o*l,g=e*u+n*d+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return t[0]=u*x,t[1]=(s*c-h*n)*x,t[2]=(a*n-s*o)*x,t[3]=d*x,t[4]=(h*e-s*l)*x,t[5]=(s*r-a*e)*x,t[6]=p*x,t[7]=(n*l-c*e)*x,t[8]=(o*e-n*r)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(_o.makeScale(t,e)),this}rotate(t){return this.premultiply(_o.makeRotation(-t)),this}translate(t,e){return this.premultiply(_o.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const _o=new Gt;function Vu(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Kr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Yf(){const i=Kr("canvas");return i.style.display="block",i}const yc={};function Ms(i){i in yc||(yc[i]=!0,console.warn(i))}function $f(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function Kf(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Zf(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Kt={enabled:!0,workingColorSpace:es,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ne&&(i.r=Un(i.r),i.g=Un(i.g),i.b=Un(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ne&&(i.r=$i(i.r),i.g=$i(i.g),i.b=$i(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===qn?so:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Un(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function $i(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Mc=[.64,.33,.3,.6,.15,.06],Sc=[.2126,.7152,.0722],bc=[.3127,.329],wc=new Gt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ec=new Gt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Kt.define({[es]:{primaries:Mc,whitePoint:bc,transfer:so,toXYZ:wc,fromXYZ:Ec,luminanceCoefficients:Sc,workingColorSpaceConfig:{unpackColorSpace:Ye},outputColorSpaceConfig:{drawingBufferColorSpace:Ye}},[Ye]:{primaries:Mc,whitePoint:bc,transfer:ne,toXYZ:wc,fromXYZ:Ec,luminanceCoefficients:Sc,outputColorSpaceConfig:{drawingBufferColorSpace:Ye}}});let wi;class jf{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{wi===void 0&&(wi=Kr("canvas")),wi.width=t.width,wi.height=t.height;const n=wi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=wi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Kr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Un(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Un(e[n]/255)*255):e[n]=Un(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Jf=0;class Wu{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Jf++}),this.uuid=xi(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(vo(s[o].image)):r.push(vo(s[o]))}else r=vo(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function vo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?jf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Qf=0;class ze extends ns{constructor(t=ze.DEFAULT_IMAGE,e=ze.DEFAULT_MAPPING,n=ui,s=ui,r=pn,o=di,a=ln,l=Nn,c=ze.DEFAULT_ANISOTROPY,h=qn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Qf++}),this.uuid=xi(),this.name="",this.source=new Wu(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new nt(0,0),this.repeat=new nt(1,1),this.center=new nt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Gt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Du)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Us:t.x=t.x-Math.floor(t.x);break;case ui:t.x=t.x<0?0:1;break;case Ba:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Us:t.y=t.y-Math.floor(t.y);break;case ui:t.y=t.y<0?0:1;break;case Ba:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}ze.DEFAULT_IMAGE=null;ze.DEFAULT_MAPPING=Du;ze.DEFAULT_ANISOTROPY=1;class ie{constructor(t=0,e=0,n=0,s=1){ie.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],p=l[5],g=l[9],x=l[2],m=l[6],f=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const v=(c+1)/2,y=(p+1)/2,w=(f+1)/2,E=(h+d)/4,A=(u+x)/4,L=(g+m)/4;return v>y&&v>w?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=E/n,r=A/n):y>w?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=E/s,r=L/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=A/r,s=L/r),this.set(n,s,r,e),this}let _=Math.sqrt((m-g)*(m-g)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(_)<.001&&(_=1),this.x=(m-g)/_,this.y=(u-x)/_,this.z=(d-h)/_,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class tp extends ns{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ie(0,0,t,e),this.scissorTest=!1,this.viewport=new ie(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:pn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new ze(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Wu(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class gn extends tp{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Xu extends ze{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=we,this.minFilter=we,this.wrapR=ui,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class ep extends ze{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=we,this.minFilter=we,this.wrapR=ui,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class yi{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3];const d=r[o+0],p=r[o+1],g=r[o+2],x=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=p,t[e+2]=g,t[e+3]=x;return}if(u!==x||l!==d||c!==p||h!==g){let m=1-a;const f=l*d+c*p+h*g+u*x,_=f>=0?1:-1,v=1-f*f;if(v>Number.EPSILON){const w=Math.sqrt(v),E=Math.atan2(w,f*_);m=Math.sin(m*E)/w,a=Math.sin(a*E)/w}const y=a*_;if(l=l*m+d*y,c=c*m+p*y,h=h*m+g*y,u=u*m+x*y,m===1-a){const w=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=w,c*=w,h*=w,u*=w}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],d=r[o+1],p=r[o+2],g=r[o+3];return t[e]=a*g+h*u+l*p-c*d,t[e+1]=l*g+h*d+c*u-a*p,t[e+2]=c*g+h*p+a*d-l*u,t[e+3]=h*g-a*u-l*d-c*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),d=l(n/2),p=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u-d*p*g;break;case"YXZ":this._x=d*h*u+c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u+d*p*g;break;case"ZXY":this._x=d*h*u-c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u-d*p*g;break;case"ZYX":this._x=d*h*u-c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u+d*p*g;break;case"YZX":this._x=d*h*u+c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u-d*p*g;break;case"XZY":this._x=d*h*u-c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(o-s)*p}else if(n>a&&n>u){const p=2*Math.sqrt(1+n-a-u);this._w=(h-l)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+c)/p}else if(a>u){const p=2*Math.sqrt(1+a-n-u);this._w=(r-c)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(l+h)/p}else{const p=2*Math.sqrt(1+u-n-a);this._w=(o-s)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(be(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-e;return this._w=p*o+e*this._w,this._x=p*n+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(t=0,e=0,n=0){C.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Tc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Tc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return xo.copy(this).projectOnVector(t),this.sub(xo)}reflect(t){return this.sub(xo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(be(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const xo=new C,Tc=new yi;class mi{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(nn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(nn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=nn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,nn):nn.fromBufferAttribute(r,o),nn.applyMatrix4(t.matrixWorld),this.expandByPoint(nn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Js.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Js.copy(n.boundingBox)),Js.applyMatrix4(t.matrixWorld),this.union(Js)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,nn),nn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ls),Qs.subVectors(this.max,ls),Ei.subVectors(t.a,ls),Ti.subVectors(t.b,ls),Ai.subVectors(t.c,ls),Bn.subVectors(Ti,Ei),zn.subVectors(Ai,Ti),ti.subVectors(Ei,Ai);let e=[0,-Bn.z,Bn.y,0,-zn.z,zn.y,0,-ti.z,ti.y,Bn.z,0,-Bn.x,zn.z,0,-zn.x,ti.z,0,-ti.x,-Bn.y,Bn.x,0,-zn.y,zn.x,0,-ti.y,ti.x,0];return!yo(e,Ei,Ti,Ai,Qs)||(e=[1,0,0,0,1,0,0,0,1],!yo(e,Ei,Ti,Ai,Qs))?!1:(tr.crossVectors(Bn,zn),e=[tr.x,tr.y,tr.z],yo(e,Ei,Ti,Ai,Qs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,nn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(nn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Mn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Mn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Mn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Mn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Mn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Mn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Mn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Mn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Mn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Mn=[new C,new C,new C,new C,new C,new C,new C,new C],nn=new C,Js=new mi,Ei=new C,Ti=new C,Ai=new C,Bn=new C,zn=new C,ti=new C,ls=new C,Qs=new C,tr=new C,ei=new C;function yo(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){ei.fromArray(i,r);const a=s.x*Math.abs(ei.x)+s.y*Math.abs(ei.y)+s.z*Math.abs(ei.z),l=t.dot(ei),c=e.dot(ei),h=n.dot(ei);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const np=new mi,cs=new C,Mo=new C;class is{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):np.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;cs.subVectors(t,this.center);const e=cs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(cs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Mo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(cs.copy(t.center).add(Mo)),this.expandByPoint(cs.copy(t.center).sub(Mo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Sn=new C,So=new C,er=new C,kn=new C,bo=new C,nr=new C,wo=new C;class Ws{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Sn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Sn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Sn.copy(this.origin).addScaledVector(this.direction,e),Sn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){So.copy(t).add(e).multiplyScalar(.5),er.copy(e).sub(t).normalize(),kn.copy(this.origin).sub(So);const r=t.distanceTo(e)*.5,o=-this.direction.dot(er),a=kn.dot(this.direction),l=-kn.dot(er),c=kn.lengthSq(),h=Math.abs(1-o*o);let u,d,p,g;if(h>0)if(u=o*l-a,d=o*a-l,g=r*h,u>=0)if(d>=-g)if(d<=g){const x=1/h;u*=x,d*=x,p=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),p=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(So).addScaledVector(er,d),p}intersectSphere(t,e){Sn.subVectors(t.center,this.origin);const n=Sn.dot(this.direction),s=Sn.dot(Sn)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Sn)!==null}intersectTriangle(t,e,n,s,r){bo.subVectors(e,t),nr.subVectors(n,t),wo.crossVectors(bo,nr);let o=this.direction.dot(wo),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;kn.subVectors(this.origin,t);const l=a*this.direction.dot(nr.crossVectors(kn,nr));if(l<0)return null;const c=a*this.direction.dot(bo.cross(kn));if(c<0||l+c>o)return null;const h=-a*kn.dot(wo);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class oe{constructor(t,e,n,s,r,o,a,l,c,h,u,d,p,g,x,m){oe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,u,d,p,g,x,m)}set(t,e,n,s,r,o,a,l,c,h,u,d,p,g,x,m){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=h,f[10]=u,f[14]=d,f[3]=p,f[7]=g,f[11]=x,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new oe().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Ri.setFromMatrixColumn(t,0).length(),r=1/Ri.setFromMatrixColumn(t,1).length(),o=1/Ri.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=o*h,p=o*u,g=a*h,x=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=p+g*c,e[5]=d-x*c,e[9]=-a*l,e[2]=x-d*c,e[6]=g+p*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,p=l*u,g=c*h,x=c*u;e[0]=d+x*a,e[4]=g*a-p,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=p*a-g,e[6]=x+d*a,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,p=l*u,g=c*h,x=c*u;e[0]=d-x*a,e[4]=-o*u,e[8]=g+p*a,e[1]=p+g*a,e[5]=o*h,e[9]=x-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,p=o*u,g=a*h,x=a*u;e[0]=l*h,e[4]=g*c-p,e[8]=d*c+x,e[1]=l*u,e[5]=x*c+d,e[9]=p*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,p=o*c,g=a*l,x=a*c;e[0]=l*h,e[4]=x-d*u,e[8]=g*u+p,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=p*u+g,e[10]=d-x*u}else if(t.order==="XZY"){const d=o*l,p=o*c,g=a*l,x=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+x,e[5]=o*h,e[9]=p*u-g,e[2]=g*u-p,e[6]=a*h,e[10]=x*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(ip,t,sp)}lookAt(t,e,n){const s=this.elements;return Xe.subVectors(t,e),Xe.lengthSq()===0&&(Xe.z=1),Xe.normalize(),Hn.crossVectors(n,Xe),Hn.lengthSq()===0&&(Math.abs(n.z)===1?Xe.x+=1e-4:Xe.z+=1e-4,Xe.normalize(),Hn.crossVectors(n,Xe)),Hn.normalize(),ir.crossVectors(Xe,Hn),s[0]=Hn.x,s[4]=ir.x,s[8]=Xe.x,s[1]=Hn.y,s[5]=ir.y,s[9]=Xe.y,s[2]=Hn.z,s[6]=ir.z,s[10]=Xe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],p=n[13],g=n[2],x=n[6],m=n[10],f=n[14],_=n[3],v=n[7],y=n[11],w=n[15],E=s[0],A=s[4],L=s[8],S=s[12],M=s[1],R=s[5],I=s[9],U=s[13],B=s[2],X=s[6],H=s[10],Z=s[14],V=s[3],ct=s[7],ut=s[11],xt=s[15];return r[0]=o*E+a*M+l*B+c*V,r[4]=o*A+a*R+l*X+c*ct,r[8]=o*L+a*I+l*H+c*ut,r[12]=o*S+a*U+l*Z+c*xt,r[1]=h*E+u*M+d*B+p*V,r[5]=h*A+u*R+d*X+p*ct,r[9]=h*L+u*I+d*H+p*ut,r[13]=h*S+u*U+d*Z+p*xt,r[2]=g*E+x*M+m*B+f*V,r[6]=g*A+x*R+m*X+f*ct,r[10]=g*L+x*I+m*H+f*ut,r[14]=g*S+x*U+m*Z+f*xt,r[3]=_*E+v*M+y*B+w*V,r[7]=_*A+v*R+y*X+w*ct,r[11]=_*L+v*I+y*H+w*ut,r[15]=_*S+v*U+y*Z+w*xt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],p=t[14],g=t[3],x=t[7],m=t[11],f=t[15];return g*(+r*l*u-s*c*u-r*a*d+n*c*d+s*a*p-n*l*p)+x*(+e*l*p-e*c*d+r*o*d-s*o*p+s*c*h-r*l*h)+m*(+e*c*u-e*a*p-r*o*u+n*o*p+r*a*h-n*c*h)+f*(-s*a*h-e*l*u+e*a*d+s*o*u-n*o*d+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],p=t[11],g=t[12],x=t[13],m=t[14],f=t[15],_=u*m*c-x*d*c+x*l*p-a*m*p-u*l*f+a*d*f,v=g*d*c-h*m*c-g*l*p+o*m*p+h*l*f-o*d*f,y=h*x*c-g*u*c+g*a*p-o*x*p-h*a*f+o*u*f,w=g*u*l-h*x*l-g*a*d+o*x*d+h*a*m-o*u*m,E=e*_+n*v+s*y+r*w;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/E;return t[0]=_*A,t[1]=(x*d*r-u*m*r-x*s*p+n*m*p+u*s*f-n*d*f)*A,t[2]=(a*m*r-x*l*r+x*s*c-n*m*c-a*s*f+n*l*f)*A,t[3]=(u*l*r-a*d*r-u*s*c+n*d*c+a*s*p-n*l*p)*A,t[4]=v*A,t[5]=(h*m*r-g*d*r+g*s*p-e*m*p-h*s*f+e*d*f)*A,t[6]=(g*l*r-o*m*r-g*s*c+e*m*c+o*s*f-e*l*f)*A,t[7]=(o*d*r-h*l*r+h*s*c-e*d*c-o*s*p+e*l*p)*A,t[8]=y*A,t[9]=(g*u*r-h*x*r-g*n*p+e*x*p+h*n*f-e*u*f)*A,t[10]=(o*x*r-g*a*r+g*n*c-e*x*c-o*n*f+e*a*f)*A,t[11]=(h*a*r-o*u*r-h*n*c+e*u*c+o*n*p-e*a*p)*A,t[12]=w*A,t[13]=(h*x*s-g*u*s+g*n*d-e*x*d-h*n*m+e*u*m)*A,t[14]=(g*a*s-o*x*s-g*n*l+e*x*l+o*n*m-e*a*m)*A,t[15]=(o*u*s-h*a*s+h*n*l-e*u*l-o*n*d+e*a*d)*A,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,u=a+a,d=r*c,p=r*h,g=r*u,x=o*h,m=o*u,f=a*u,_=l*c,v=l*h,y=l*u,w=n.x,E=n.y,A=n.z;return s[0]=(1-(x+f))*w,s[1]=(p+y)*w,s[2]=(g-v)*w,s[3]=0,s[4]=(p-y)*E,s[5]=(1-(d+f))*E,s[6]=(m+_)*E,s[7]=0,s[8]=(g+v)*A,s[9]=(m-_)*A,s[10]=(1-(d+x))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Ri.set(s[0],s[1],s[2]).length();const o=Ri.set(s[4],s[5],s[6]).length(),a=Ri.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],sn.copy(this);const c=1/r,h=1/o,u=1/a;return sn.elements[0]*=c,sn.elements[1]*=c,sn.elements[2]*=c,sn.elements[4]*=h,sn.elements[5]*=h,sn.elements[6]*=h,sn.elements[8]*=u,sn.elements[9]*=u,sn.elements[10]*=u,e.setFromRotationMatrix(sn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Ln){const l=this.elements,c=2*r/(e-t),h=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s);let p,g;if(a===Ln)p=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===$r)p=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Ln){const l=this.elements,c=1/(e-t),h=1/(n-s),u=1/(o-r),d=(e+t)*c,p=(n+s)*h;let g,x;if(a===Ln)g=(o+r)*u,x=-2*u;else if(a===$r)g=r*u,x=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=x,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ri=new C,sn=new oe,ip=new C(0,0,0),sp=new C(1,1,1),Hn=new C,ir=new C,Xe=new C,Ac=new oe,Rc=new yi;class _n{constructor(t=0,e=0,n=0,s=_n.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(be(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-be(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(be(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-be(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(be(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-be(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ac.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ac,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Rc.setFromEuler(this),this.setFromQuaternion(Rc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}_n.DEFAULT_ORDER="XYZ";class ro{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let rp=0;const Cc=new C,Ci=new yi,bn=new oe,sr=new C,hs=new C,op=new C,ap=new yi,Pc=new C(1,0,0),Lc=new C(0,1,0),Dc=new C(0,0,1),Ic={type:"added"},lp={type:"removed"},Pi={type:"childadded",child:null},Eo={type:"childremoved",child:null};class Ee extends ns{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:rp++}),this.uuid=xi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ee.DEFAULT_UP.clone();const t=new C,e=new _n,n=new yi,s=new C(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new oe},normalMatrix:{value:new Gt}}),this.matrix=new oe,this.matrixWorld=new oe,this.matrixAutoUpdate=Ee.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ee.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ro,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ci.setFromAxisAngle(t,e),this.quaternion.multiply(Ci),this}rotateOnWorldAxis(t,e){return Ci.setFromAxisAngle(t,e),this.quaternion.premultiply(Ci),this}rotateX(t){return this.rotateOnAxis(Pc,t)}rotateY(t){return this.rotateOnAxis(Lc,t)}rotateZ(t){return this.rotateOnAxis(Dc,t)}translateOnAxis(t,e){return Cc.copy(t).applyQuaternion(this.quaternion),this.position.add(Cc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Pc,t)}translateY(t){return this.translateOnAxis(Lc,t)}translateZ(t){return this.translateOnAxis(Dc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(bn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?sr.copy(t):sr.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),hs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?bn.lookAt(hs,sr,this.up):bn.lookAt(sr,hs,this.up),this.quaternion.setFromRotationMatrix(bn),s&&(bn.extractRotation(s.matrixWorld),Ci.setFromRotationMatrix(bn),this.quaternion.premultiply(Ci.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Ic),Pi.child=t,this.dispatchEvent(Pi),Pi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(lp),Eo.child=t,this.dispatchEvent(Eo),Eo.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),bn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),bn.multiply(t.parent.matrixWorld)),t.applyMatrix4(bn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Ic),Pi.child=t,this.dispatchEvent(Pi),Pi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(hs,t,op),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(hs,ap,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),p=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Ee.DEFAULT_UP=new C(0,1,0);Ee.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ee.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const rn=new C,wn=new C,To=new C,En=new C,Li=new C,Di=new C,Uc=new C,Ao=new C,Ro=new C,Co=new C,Po=new ie,Lo=new ie,Do=new ie;class Qe{constructor(t=new C,e=new C,n=new C){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),rn.subVectors(t,e),s.cross(rn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){rn.subVectors(s,e),wn.subVectors(n,e),To.subVectors(t,e);const o=rn.dot(rn),a=rn.dot(wn),l=rn.dot(To),c=wn.dot(wn),h=wn.dot(To),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;const d=1/u,p=(c*l-a*h)*d,g=(o*h-a*l)*d;return r.set(1-p-g,g,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,En)===null?!1:En.x>=0&&En.y>=0&&En.x+En.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,En)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,En.x),l.addScaledVector(o,En.y),l.addScaledVector(a,En.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return Po.setScalar(0),Lo.setScalar(0),Do.setScalar(0),Po.fromBufferAttribute(t,e),Lo.fromBufferAttribute(t,n),Do.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Po,r.x),o.addScaledVector(Lo,r.y),o.addScaledVector(Do,r.z),o}static isFrontFacing(t,e,n,s){return rn.subVectors(n,e),wn.subVectors(t,e),rn.cross(wn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return rn.subVectors(this.c,this.b),wn.subVectors(this.a,this.b),rn.cross(wn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Qe.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Qe.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return Qe.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return Qe.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Qe.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;Li.subVectors(s,n),Di.subVectors(r,n),Ao.subVectors(t,n);const l=Li.dot(Ao),c=Di.dot(Ao);if(l<=0&&c<=0)return e.copy(n);Ro.subVectors(t,s);const h=Li.dot(Ro),u=Di.dot(Ro);if(h>=0&&u<=h)return e.copy(s);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(Li,o);Co.subVectors(t,r);const p=Li.dot(Co),g=Di.dot(Co);if(g>=0&&p<=g)return e.copy(r);const x=p*c-l*g;if(x<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(Di,a);const m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return Uc.subVectors(r,s),a=(u-h)/(u-h+(p-g)),e.copy(s).addScaledVector(Uc,a);const f=1/(m+x+d);return o=x*f,a=d*f,e.copy(n).addScaledVector(Li,o).addScaledVector(Di,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const qu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Gn={h:0,s:0,l:0},rr={h:0,s:0,l:0};function Io(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Ft{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ye){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Kt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Kt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Kt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Kt.workingColorSpace){if(t=Nl(t,1),e=be(e,0,1),n=be(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Io(o,r,t+1/3),this.g=Io(o,r,t),this.b=Io(o,r,t-1/3)}return Kt.toWorkingColorSpace(this,s),this}setStyle(t,e=Ye){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ye){const n=qu[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Un(t.r),this.g=Un(t.g),this.b=Un(t.b),this}copyLinearToSRGB(t){return this.r=$i(t.r),this.g=$i(t.g),this.b=$i(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ye){return Kt.fromWorkingColorSpace(Ue.copy(this),t),Math.round(be(Ue.r*255,0,255))*65536+Math.round(be(Ue.g*255,0,255))*256+Math.round(be(Ue.b*255,0,255))}getHexString(t=Ye){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Kt.workingColorSpace){Kt.fromWorkingColorSpace(Ue.copy(this),e);const n=Ue.r,s=Ue.g,r=Ue.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Kt.workingColorSpace){return Kt.fromWorkingColorSpace(Ue.copy(this),e),t.r=Ue.r,t.g=Ue.g,t.b=Ue.b,t}getStyle(t=Ye){Kt.fromWorkingColorSpace(Ue.copy(this),t);const e=Ue.r,n=Ue.g,s=Ue.b;return t!==Ye?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Gn),this.setHSL(Gn.h+t,Gn.s+e,Gn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Gn),t.getHSL(rr);const n=Ts(Gn.h,rr.h,e),s=Ts(Gn.s,rr.s,e),r=Ts(Gn.l,rr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ue=new Ft;Ft.NAMES=qu;let cp=0;class Jn extends ns{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:cp++}),this.uuid=xi(),this.name="",this.blending=qi,this.side=Zn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Aa,this.blendDst=Ra,this.blendEquation=ci,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ft(0,0,0),this.blendAlpha=0,this.depthFunc=Ki,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=gc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=bi,this.stencilZFail=bi,this.stencilZPass=bi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==qi&&(n.blending=this.blending),this.side!==Zn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Aa&&(n.blendSrc=this.blendSrc),this.blendDst!==Ra&&(n.blendDst=this.blendDst),this.blendEquation!==ci&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ki&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==gc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==bi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==bi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==bi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Xs extends Jn{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Ft(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.combine=Tl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Me=new C,or=new nt;class Ve{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=_c,this.updateRanges=[],this.gpuType=Pn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)or.fromBufferAttribute(this,e),or.applyMatrix3(t),this.setXY(e,or.x,or.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix3(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix4(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyNormalMatrix(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.transformDirection(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Hi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ne(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Hi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ne(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Hi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ne(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Hi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ne(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Hi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ne(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ne(e,this.array),n=Ne(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Ne(e,this.array),n=Ne(n,this.array),s=Ne(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Ne(e,this.array),n=Ne(n,this.array),s=Ne(s,this.array),r=Ne(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==_c&&(t.usage=this.usage),t}}class Yu extends Ve{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class $u extends Ve{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class jt extends Ve{constructor(t,e,n){super(new Float32Array(t),e,n)}}let hp=0;const je=new oe,Uo=new Ee,Ii=new C,qe=new mi,us=new mi,Ce=new C;class Re extends ns{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:hp++}),this.uuid=xi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Vu(t)?$u:Yu)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Gt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return je.makeRotationFromQuaternion(t),this.applyMatrix4(je),this}rotateX(t){return je.makeRotationX(t),this.applyMatrix4(je),this}rotateY(t){return je.makeRotationY(t),this.applyMatrix4(je),this}rotateZ(t){return je.makeRotationZ(t),this.applyMatrix4(je),this}translate(t,e,n){return je.makeTranslation(t,e,n),this.applyMatrix4(je),this}scale(t,e,n){return je.makeScale(t,e,n),this.applyMatrix4(je),this}lookAt(t){return Uo.lookAt(t),Uo.updateMatrix(),this.applyMatrix4(Uo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ii).negate(),this.translate(Ii.x,Ii.y,Ii.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new jt(n,3))}else{for(let n=0,s=e.count;n<s;n++){const r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new mi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];qe.setFromBufferAttribute(r),this.morphTargetsRelative?(Ce.addVectors(this.boundingBox.min,qe.min),this.boundingBox.expandByPoint(Ce),Ce.addVectors(this.boundingBox.max,qe.max),this.boundingBox.expandByPoint(Ce)):(this.boundingBox.expandByPoint(qe.min),this.boundingBox.expandByPoint(qe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new is);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(t){const n=this.boundingSphere.center;if(qe.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];us.setFromBufferAttribute(a),this.morphTargetsRelative?(Ce.addVectors(qe.min,us.min),qe.expandByPoint(Ce),Ce.addVectors(qe.max,us.max),qe.expandByPoint(Ce)):(qe.expandByPoint(us.min),qe.expandByPoint(us.max))}qe.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Ce.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ce));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Ce.fromBufferAttribute(a,c),l&&(Ii.fromBufferAttribute(t,c),Ce.add(Ii)),s=Math.max(s,n.distanceToSquared(Ce))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ve(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let L=0;L<n.count;L++)a[L]=new C,l[L]=new C;const c=new C,h=new C,u=new C,d=new nt,p=new nt,g=new nt,x=new C,m=new C;function f(L,S,M){c.fromBufferAttribute(n,L),h.fromBufferAttribute(n,S),u.fromBufferAttribute(n,M),d.fromBufferAttribute(r,L),p.fromBufferAttribute(r,S),g.fromBufferAttribute(r,M),h.sub(c),u.sub(c),p.sub(d),g.sub(d);const R=1/(p.x*g.y-g.x*p.y);isFinite(R)&&(x.copy(h).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(R),m.copy(u).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(R),a[L].add(x),a[S].add(x),a[M].add(x),l[L].add(m),l[S].add(m),l[M].add(m))}let _=this.groups;_.length===0&&(_=[{start:0,count:t.count}]);for(let L=0,S=_.length;L<S;++L){const M=_[L],R=M.start,I=M.count;for(let U=R,B=R+I;U<B;U+=3)f(t.getX(U+0),t.getX(U+1),t.getX(U+2))}const v=new C,y=new C,w=new C,E=new C;function A(L){w.fromBufferAttribute(s,L),E.copy(w);const S=a[L];v.copy(S),v.sub(w.multiplyScalar(w.dot(S))).normalize(),y.crossVectors(E,S);const R=y.dot(l[L])<0?-1:1;o.setXYZW(L,v.x,v.y,v.z,R)}for(let L=0,S=_.length;L<S;++L){const M=_[L],R=M.start,I=M.count;for(let U=R,B=R+I;U<B;U+=3)A(t.getX(U+0)),A(t.getX(U+1)),A(t.getX(U+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ve(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);const s=new C,r=new C,o=new C,a=new C,l=new C,c=new C,h=new C,u=new C;if(t)for(let d=0,p=t.count;d<p;d+=3){const g=t.getX(d+0),x=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,x),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=e.count;d<p;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ce.fromBufferAttribute(t,e),Ce.normalize(),t.setXYZ(e,Ce.x,Ce.y,Ce.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h);let p=0,g=0;for(let x=0,m=l.length;x<m;x++){a.isInterleavedBufferAttribute?p=l[x]*a.data.stride+a.offset:p=l[x]*h;for(let f=0;f<h;f++)d[g++]=c[p++]}return new Ve(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Re,n=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){const d=c[h],p=t(d,n);l.push(p)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const p=c[u];h.push(p.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Nc=new oe,ni=new Ws,ar=new is,Oc=new C,lr=new C,cr=new C,hr=new C,No=new C,ur=new C,Fc=new C,dr=new C;class $t extends Ee{constructor(t=new Re,e=new Xs){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){ur.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],u=r[l];h!==0&&(No.fromBufferAttribute(u,t),o?ur.addScaledVector(No,h):ur.addScaledVector(No.sub(e),h))}e.add(ur)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ar.copy(n.boundingSphere),ar.applyMatrix4(r),ni.copy(t.ray).recast(t.near),!(ar.containsPoint(ni.origin)===!1&&(ni.intersectSphere(ar,Oc)===null||ni.origin.distanceToSquared(Oc)>(t.far-t.near)**2))&&(Nc.copy(r).invert(),ni.copy(t.ray).applyMatrix4(Nc),!(n.boundingBox!==null&&ni.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ni)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=d.length;g<x;g++){const m=d[g],f=o[m.materialIndex],_=Math.max(m.start,p.start),v=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let y=_,w=v;y<w;y+=3){const E=a.getX(y),A=a.getX(y+1),L=a.getX(y+2);s=fr(this,f,t,n,c,h,u,E,A,L),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),x=Math.min(a.count,p.start+p.count);for(let m=g,f=x;m<f;m+=3){const _=a.getX(m),v=a.getX(m+1),y=a.getX(m+2);s=fr(this,o,t,n,c,h,u,_,v,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,x=d.length;g<x;g++){const m=d[g],f=o[m.materialIndex],_=Math.max(m.start,p.start),v=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let y=_,w=v;y<w;y+=3){const E=y,A=y+1,L=y+2;s=fr(this,f,t,n,c,h,u,E,A,L),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),x=Math.min(l.count,p.start+p.count);for(let m=g,f=x;m<f;m+=3){const _=m,v=m+1,y=m+2;s=fr(this,o,t,n,c,h,u,_,v,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function up(i,t,e,n,s,r,o,a){let l;if(t.side===Be?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===Zn,a),l===null)return null;dr.copy(a),dr.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(dr);return c<e.near||c>e.far?null:{distance:c,point:dr.clone(),object:i}}function fr(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,lr),i.getVertexPosition(l,cr),i.getVertexPosition(c,hr);const h=up(i,t,e,n,lr,cr,hr,Fc);if(h){const u=new C;Qe.getBarycoord(Fc,lr,cr,hr,u),s&&(h.uv=Qe.getInterpolatedAttribute(s,a,l,c,u,new nt)),r&&(h.uv1=Qe.getInterpolatedAttribute(r,a,l,c,u,new nt)),o&&(h.normal=Qe.getInterpolatedAttribute(o,a,l,c,u,new C),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new C,materialIndex:0};Qe.getNormal(lr,cr,hr,d.normal),h.face=d,h.barycoord=u}return h}class et extends Re{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],u=[];let d=0,p=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new jt(c,3)),this.setAttribute("normal",new jt(h,3)),this.setAttribute("uv",new jt(u,2));function g(x,m,f,_,v,y,w,E,A,L,S){const M=y/A,R=w/L,I=y/2,U=w/2,B=E/2,X=A+1,H=L+1;let Z=0,V=0;const ct=new C;for(let ut=0;ut<H;ut++){const xt=ut*R-U;for(let Nt=0;Nt<X;Nt++){const Zt=Nt*M-I;ct[x]=Zt*_,ct[m]=xt*v,ct[f]=B,c.push(ct.x,ct.y,ct.z),ct[x]=0,ct[m]=0,ct[f]=E>0?1:-1,h.push(ct.x,ct.y,ct.z),u.push(Nt/A),u.push(1-ut/L),Z+=1}}for(let ut=0;ut<L;ut++)for(let xt=0;xt<A;xt++){const Nt=d+xt+X*ut,Zt=d+xt+X*(ut+1),Y=d+(xt+1)+X*(ut+1),it=d+(xt+1)+X*ut;l.push(Nt,Zt,it),l.push(Zt,Y,it),V+=6}a.addGroup(p,V,S),p+=V,d+=Z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new et(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ts(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Oe(i){const t={};for(let e=0;e<i.length;e++){const n=ts(i[e]);for(const s in n)t[s]=n[s]}return t}function dp(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Ku(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Kt.workingColorSpace}const oo={clone:ts,merge:Oe};var fp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,pp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ke extends Jn{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=fp,this.fragmentShader=pp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ts(t.uniforms),this.uniformsGroups=dp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Zu extends Ee{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new oe,this.projectionMatrix=new oe,this.projectionMatrixInverse=new oe,this.coordinateSystem=Ln}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Vn=new C,Bc=new nt,zc=new nt;class $e extends Zu{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Os*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Es*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Os*2*Math.atan(Math.tan(Es*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Vn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Vn.x,Vn.y).multiplyScalar(-t/Vn.z),Vn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Vn.x,Vn.y).multiplyScalar(-t/Vn.z)}getViewSize(t,e){return this.getViewBounds(t,Bc,zc),e.subVectors(zc,Bc)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Es*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ui=-90,Ni=1;class mp extends Ee{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new $e(Ui,Ni,t,e);s.layers=this.layers,this.add(s);const r=new $e(Ui,Ni,t,e);r.layers=this.layers,this.add(r);const o=new $e(Ui,Ni,t,e);o.layers=this.layers,this.add(o);const a=new $e(Ui,Ni,t,e);a.layers=this.layers,this.add(a);const l=new $e(Ui,Ni,t,e);l.layers=this.layers,this.add(l);const c=new $e(Ui,Ni,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===Ln)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===$r)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class ju extends ze{constructor(t,e,n,s,r,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Zi,super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class gp extends gn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new ju(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:pn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new et(5,5,5),r=new Ke({name:"CubemapFromEquirect",uniforms:ts(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Be,blending:In});r.uniforms.tEquirect.value=e;const o=new $t(s,r),a=e.minFilter;return e.minFilter===di&&(e.minFilter=pn),new mp(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}const Oo=new C,_p=new C,vp=new Gt;class Xn{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Oo.subVectors(n,e).cross(_p.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Oo),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||vp.getNormalMatrix(t),s=this.coplanarPoint(Oo).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ii=new is,pr=new C;class Ol{constructor(t=new Xn,e=new Xn,n=new Xn,s=new Xn,r=new Xn,o=new Xn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Ln){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],u=s[6],d=s[7],p=s[8],g=s[9],x=s[10],m=s[11],f=s[12],_=s[13],v=s[14],y=s[15];if(n[0].setComponents(l-r,d-c,m-p,y-f).normalize(),n[1].setComponents(l+r,d+c,m+p,y+f).normalize(),n[2].setComponents(l+o,d+h,m+g,y+_).normalize(),n[3].setComponents(l-o,d-h,m-g,y-_).normalize(),n[4].setComponents(l-a,d-u,m-x,y-v).normalize(),e===Ln)n[5].setComponents(l+a,d+u,m+x,y+v).normalize();else if(e===$r)n[5].setComponents(a,u,x,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ii.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ii.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ii)}intersectsSprite(t){return ii.center.set(0,0,0),ii.radius=.7071067811865476,ii.applyMatrix4(t.matrixWorld),this.intersectsSphere(ii)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(pr.x=s.normal.x>0?t.max.x:t.min.x,pr.y=s.normal.y>0?t.max.y:t.min.y,pr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(pr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Ju(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function xp(i){const t=new WeakMap;function e(a,l){const c=a.array,h=a.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),a.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){const h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<u.length;p++){const g=u[d],x=u[p];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++d,u[d]=x)}u.length=d+1;for(let p=0,g=u.length;p<g;p++){const x=u[p];i.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}class $n extends Re{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=t/a,d=e/l,p=[],g=[],x=[],m=[];for(let f=0;f<h;f++){const _=f*d-o;for(let v=0;v<c;v++){const y=v*u-r;g.push(y,-_,0),x.push(0,0,1),m.push(v/a),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let _=0;_<a;_++){const v=_+c*f,y=_+c*(f+1),w=_+1+c*(f+1),E=_+1+c*f;p.push(v,y,E),p.push(y,w,E)}this.setIndex(p),this.setAttribute("position",new jt(g,3)),this.setAttribute("normal",new jt(x,3)),this.setAttribute("uv",new jt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $n(t.width,t.height,t.widthSegments,t.heightSegments)}}var yp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Mp=`#ifdef USE_ALPHAHASH
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
#endif`,Sp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,bp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,wp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ep=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Tp=`#ifdef USE_AOMAP
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
#endif`,Ap=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Rp=`#ifdef USE_BATCHING
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
#endif`,Cp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Pp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Lp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Dp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Ip=`#ifdef USE_IRIDESCENCE
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
#endif`,Up=`#ifdef USE_BUMPMAP
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
#endif`,Np=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Op=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Fp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Bp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,zp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,kp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Hp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Gp=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Vp=`#define PI 3.141592653589793
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
} // validated`,Wp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Xp=`vec3 transformedNormal = objectNormal;
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
#endif`,qp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Yp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,$p=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Kp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Zp="gl_FragColor = linearToOutputTexel( gl_FragColor );",jp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Jp=`#ifdef USE_ENVMAP
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
#endif`,Qp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,tm=`#ifdef USE_ENVMAP
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
#endif`,em=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,nm=`#ifdef USE_ENVMAP
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
#endif`,im=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,sm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,rm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,om=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,am=`#ifdef USE_GRADIENTMAP
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
}`,lm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,cm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,hm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,um=`uniform bool receiveShadow;
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
#endif`,dm=`#ifdef USE_ENVMAP
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
#endif`,fm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,pm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,mm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,gm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,_m=`PhysicalMaterial material;
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
#endif`,vm=`struct PhysicalMaterial {
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
}`,xm=`
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
#endif`,ym=`#if defined( RE_IndirectDiffuse )
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
#endif`,Mm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Sm=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,bm=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wm=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Em=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Tm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Am=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Rm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Cm=`#if defined( USE_POINTS_UV )
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
#endif`,Pm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Lm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Dm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Im=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Um=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Nm=`#ifdef USE_MORPHTARGETS
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
#endif`,Om=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Fm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Bm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,zm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,km=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Hm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Gm=`#ifdef USE_NORMALMAP
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
#endif`,Vm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Wm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Xm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,qm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ym=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,$m=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Km=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Zm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,jm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Jm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Qm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,t0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,e0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,n0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,i0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,s0=`float getShadowMask() {
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
}`,r0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,o0=`#ifdef USE_SKINNING
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
#endif`,a0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,l0=`#ifdef USE_SKINNING
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
#endif`,c0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,h0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,u0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,d0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,f0=`#ifdef USE_TRANSMISSION
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
#endif`,p0=`#ifdef USE_TRANSMISSION
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
#endif`,m0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,g0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,_0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,v0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const x0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,y0=`uniform sampler2D t2D;
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
}`,M0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,S0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,b0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,w0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,E0=`#include <common>
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
}`,T0=`#if DEPTH_PACKING == 3200
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
}`,A0=`#define DISTANCE
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
}`,R0=`#define DISTANCE
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
}`,C0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,P0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,L0=`uniform float scale;
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
}`,D0=`uniform vec3 diffuse;
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
}`,I0=`#include <common>
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
}`,U0=`uniform vec3 diffuse;
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
}`,N0=`#define LAMBERT
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
}`,O0=`#define LAMBERT
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
}`,F0=`#define MATCAP
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
}`,B0=`#define MATCAP
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
}`,z0=`#define NORMAL
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
}`,k0=`#define NORMAL
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
}`,H0=`#define PHONG
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
}`,G0=`#define PHONG
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
}`,V0=`#define STANDARD
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
}`,W0=`#define STANDARD
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
}`,X0=`#define TOON
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
}`,q0=`#define TOON
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
}`,Y0=`uniform float size;
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
}`,$0=`uniform vec3 diffuse;
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
}`,K0=`#include <common>
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
}`,Z0=`uniform vec3 color;
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
}`,j0=`uniform float rotation;
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
}`,J0=`uniform vec3 diffuse;
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
}`,Wt={alphahash_fragment:yp,alphahash_pars_fragment:Mp,alphamap_fragment:Sp,alphamap_pars_fragment:bp,alphatest_fragment:wp,alphatest_pars_fragment:Ep,aomap_fragment:Tp,aomap_pars_fragment:Ap,batching_pars_vertex:Rp,batching_vertex:Cp,begin_vertex:Pp,beginnormal_vertex:Lp,bsdfs:Dp,iridescence_fragment:Ip,bumpmap_pars_fragment:Up,clipping_planes_fragment:Np,clipping_planes_pars_fragment:Op,clipping_planes_pars_vertex:Fp,clipping_planes_vertex:Bp,color_fragment:zp,color_pars_fragment:kp,color_pars_vertex:Hp,color_vertex:Gp,common:Vp,cube_uv_reflection_fragment:Wp,defaultnormal_vertex:Xp,displacementmap_pars_vertex:qp,displacementmap_vertex:Yp,emissivemap_fragment:$p,emissivemap_pars_fragment:Kp,colorspace_fragment:Zp,colorspace_pars_fragment:jp,envmap_fragment:Jp,envmap_common_pars_fragment:Qp,envmap_pars_fragment:tm,envmap_pars_vertex:em,envmap_physical_pars_fragment:dm,envmap_vertex:nm,fog_vertex:im,fog_pars_vertex:sm,fog_fragment:rm,fog_pars_fragment:om,gradientmap_pars_fragment:am,lightmap_pars_fragment:lm,lights_lambert_fragment:cm,lights_lambert_pars_fragment:hm,lights_pars_begin:um,lights_toon_fragment:fm,lights_toon_pars_fragment:pm,lights_phong_fragment:mm,lights_phong_pars_fragment:gm,lights_physical_fragment:_m,lights_physical_pars_fragment:vm,lights_fragment_begin:xm,lights_fragment_maps:ym,lights_fragment_end:Mm,logdepthbuf_fragment:Sm,logdepthbuf_pars_fragment:bm,logdepthbuf_pars_vertex:wm,logdepthbuf_vertex:Em,map_fragment:Tm,map_pars_fragment:Am,map_particle_fragment:Rm,map_particle_pars_fragment:Cm,metalnessmap_fragment:Pm,metalnessmap_pars_fragment:Lm,morphinstance_vertex:Dm,morphcolor_vertex:Im,morphnormal_vertex:Um,morphtarget_pars_vertex:Nm,morphtarget_vertex:Om,normal_fragment_begin:Fm,normal_fragment_maps:Bm,normal_pars_fragment:zm,normal_pars_vertex:km,normal_vertex:Hm,normalmap_pars_fragment:Gm,clearcoat_normal_fragment_begin:Vm,clearcoat_normal_fragment_maps:Wm,clearcoat_pars_fragment:Xm,iridescence_pars_fragment:qm,opaque_fragment:Ym,packing:$m,premultiplied_alpha_fragment:Km,project_vertex:Zm,dithering_fragment:jm,dithering_pars_fragment:Jm,roughnessmap_fragment:Qm,roughnessmap_pars_fragment:t0,shadowmap_pars_fragment:e0,shadowmap_pars_vertex:n0,shadowmap_vertex:i0,shadowmask_pars_fragment:s0,skinbase_vertex:r0,skinning_pars_vertex:o0,skinning_vertex:a0,skinnormal_vertex:l0,specularmap_fragment:c0,specularmap_pars_fragment:h0,tonemapping_fragment:u0,tonemapping_pars_fragment:d0,transmission_fragment:f0,transmission_pars_fragment:p0,uv_pars_fragment:m0,uv_pars_vertex:g0,uv_vertex:_0,worldpos_vertex:v0,background_vert:x0,background_frag:y0,backgroundCube_vert:M0,backgroundCube_frag:S0,cube_vert:b0,cube_frag:w0,depth_vert:E0,depth_frag:T0,distanceRGBA_vert:A0,distanceRGBA_frag:R0,equirect_vert:C0,equirect_frag:P0,linedashed_vert:L0,linedashed_frag:D0,meshbasic_vert:I0,meshbasic_frag:U0,meshlambert_vert:N0,meshlambert_frag:O0,meshmatcap_vert:F0,meshmatcap_frag:B0,meshnormal_vert:z0,meshnormal_frag:k0,meshphong_vert:H0,meshphong_frag:G0,meshphysical_vert:V0,meshphysical_frag:W0,meshtoon_vert:X0,meshtoon_frag:q0,points_vert:Y0,points_frag:$0,shadow_vert:K0,shadow_frag:Z0,sprite_vert:j0,sprite_frag:J0},dt={common:{diffuse:{value:new Ft(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Gt},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Gt}},envmap:{envMap:{value:null},envMapRotation:{value:new Gt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Gt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Gt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Gt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Gt},normalScale:{value:new nt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Gt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Gt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Gt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Gt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ft(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ft(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0},uvTransform:{value:new Gt}},sprite:{diffuse:{value:new Ft(16777215)},opacity:{value:1},center:{value:new nt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Gt},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0}}},fn={basic:{uniforms:Oe([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.fog]),vertexShader:Wt.meshbasic_vert,fragmentShader:Wt.meshbasic_frag},lambert:{uniforms:Oe([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new Ft(0)}}]),vertexShader:Wt.meshlambert_vert,fragmentShader:Wt.meshlambert_frag},phong:{uniforms:Oe([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new Ft(0)},specular:{value:new Ft(1118481)},shininess:{value:30}}]),vertexShader:Wt.meshphong_vert,fragmentShader:Wt.meshphong_frag},standard:{uniforms:Oe([dt.common,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.roughnessmap,dt.metalnessmap,dt.fog,dt.lights,{emissive:{value:new Ft(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Wt.meshphysical_vert,fragmentShader:Wt.meshphysical_frag},toon:{uniforms:Oe([dt.common,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.gradientmap,dt.fog,dt.lights,{emissive:{value:new Ft(0)}}]),vertexShader:Wt.meshtoon_vert,fragmentShader:Wt.meshtoon_frag},matcap:{uniforms:Oe([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,{matcap:{value:null}}]),vertexShader:Wt.meshmatcap_vert,fragmentShader:Wt.meshmatcap_frag},points:{uniforms:Oe([dt.points,dt.fog]),vertexShader:Wt.points_vert,fragmentShader:Wt.points_frag},dashed:{uniforms:Oe([dt.common,dt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Wt.linedashed_vert,fragmentShader:Wt.linedashed_frag},depth:{uniforms:Oe([dt.common,dt.displacementmap]),vertexShader:Wt.depth_vert,fragmentShader:Wt.depth_frag},normal:{uniforms:Oe([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,{opacity:{value:1}}]),vertexShader:Wt.meshnormal_vert,fragmentShader:Wt.meshnormal_frag},sprite:{uniforms:Oe([dt.sprite,dt.fog]),vertexShader:Wt.sprite_vert,fragmentShader:Wt.sprite_frag},background:{uniforms:{uvTransform:{value:new Gt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Wt.background_vert,fragmentShader:Wt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Gt}},vertexShader:Wt.backgroundCube_vert,fragmentShader:Wt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Wt.cube_vert,fragmentShader:Wt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Wt.equirect_vert,fragmentShader:Wt.equirect_frag},distanceRGBA:{uniforms:Oe([dt.common,dt.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Wt.distanceRGBA_vert,fragmentShader:Wt.distanceRGBA_frag},shadow:{uniforms:Oe([dt.lights,dt.fog,{color:{value:new Ft(0)},opacity:{value:1}}]),vertexShader:Wt.shadow_vert,fragmentShader:Wt.shadow_frag}};fn.physical={uniforms:Oe([fn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Gt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Gt},clearcoatNormalScale:{value:new nt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Gt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Gt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Gt},sheen:{value:0},sheenColor:{value:new Ft(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Gt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Gt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Gt},transmissionSamplerSize:{value:new nt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Gt},attenuationDistance:{value:0},attenuationColor:{value:new Ft(0)},specularColor:{value:new Ft(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Gt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Gt},anisotropyVector:{value:new nt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Gt}}]),vertexShader:Wt.meshphysical_vert,fragmentShader:Wt.meshphysical_frag};const mr={r:0,b:0,g:0},si=new _n,Q0=new oe;function tg(i,t,e,n,s,r,o){const a=new Ft(0);let l=r===!0?0:1,c,h,u=null,d=0,p=null;function g(_){let v=_.isScene===!0?_.background:null;return v&&v.isTexture&&(v=(_.backgroundBlurriness>0?e:t).get(v)),v}function x(_){let v=!1;const y=g(_);y===null?f(a,l):y&&y.isColor&&(f(y,1),v=!0);const w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(_,v){const y=g(v);y&&(y.isCubeTexture||y.mapping===io)?(h===void 0&&(h=new $t(new et(1,1,1),new Ke({name:"BackgroundCubeMaterial",uniforms:ts(fn.backgroundCube.uniforms),vertexShader:fn.backgroundCube.vertexShader,fragmentShader:fn.backgroundCube.fragmentShader,side:Be,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,E,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),si.copy(v.backgroundRotation),si.x*=-1,si.y*=-1,si.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(si.y*=-1,si.z*=-1),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Q0.makeRotationFromEuler(si)),h.material.toneMapped=Kt.getTransfer(y.colorSpace)!==ne,(u!==y||d!==y.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=y,d=y.version,p=i.toneMapping),h.layers.enableAll(),_.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new $t(new $n(2,2),new Ke({name:"BackgroundMaterial",uniforms:ts(fn.background.uniforms),vertexShader:fn.background.vertexShader,fragmentShader:fn.background.fragmentShader,side:Zn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=Kt.getTransfer(y.colorSpace)!==ne,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||d!==y.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,u=y,d=y.version,p=i.toneMapping),c.layers.enableAll(),_.unshift(c,c.geometry,c.material,0,0,null))}function f(_,v){_.getRGB(mr,Ku(i)),n.buffers.color.setClear(mr.r,mr.g,mr.b,v,o)}return{getClearColor:function(){return a},setClearColor:function(_,v=1){a.set(_),l=v,f(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(_){l=_,f(a,l)},render:x,addToRenderList:m}}function eg(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,o=!1;function a(M,R,I,U,B){let X=!1;const H=u(U,I,R);r!==H&&(r=H,c(r.object)),X=p(M,U,I,B),X&&g(M,U,I,B),B!==null&&t.update(B,i.ELEMENT_ARRAY_BUFFER),(X||o)&&(o=!1,y(M,R,I,U),B!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(B).buffer))}function l(){return i.createVertexArray()}function c(M){return i.bindVertexArray(M)}function h(M){return i.deleteVertexArray(M)}function u(M,R,I){const U=I.wireframe===!0;let B=n[M.id];B===void 0&&(B={},n[M.id]=B);let X=B[R.id];X===void 0&&(X={},B[R.id]=X);let H=X[U];return H===void 0&&(H=d(l()),X[U]=H),H}function d(M){const R=[],I=[],U=[];for(let B=0;B<e;B++)R[B]=0,I[B]=0,U[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:I,attributeDivisors:U,object:M,attributes:{},index:null}}function p(M,R,I,U){const B=r.attributes,X=R.attributes;let H=0;const Z=I.getAttributes();for(const V in Z)if(Z[V].location>=0){const ut=B[V];let xt=X[V];if(xt===void 0&&(V==="instanceMatrix"&&M.instanceMatrix&&(xt=M.instanceMatrix),V==="instanceColor"&&M.instanceColor&&(xt=M.instanceColor)),ut===void 0||ut.attribute!==xt||xt&&ut.data!==xt.data)return!0;H++}return r.attributesNum!==H||r.index!==U}function g(M,R,I,U){const B={},X=R.attributes;let H=0;const Z=I.getAttributes();for(const V in Z)if(Z[V].location>=0){let ut=X[V];ut===void 0&&(V==="instanceMatrix"&&M.instanceMatrix&&(ut=M.instanceMatrix),V==="instanceColor"&&M.instanceColor&&(ut=M.instanceColor));const xt={};xt.attribute=ut,ut&&ut.data&&(xt.data=ut.data),B[V]=xt,H++}r.attributes=B,r.attributesNum=H,r.index=U}function x(){const M=r.newAttributes;for(let R=0,I=M.length;R<I;R++)M[R]=0}function m(M){f(M,0)}function f(M,R){const I=r.newAttributes,U=r.enabledAttributes,B=r.attributeDivisors;I[M]=1,U[M]===0&&(i.enableVertexAttribArray(M),U[M]=1),B[M]!==R&&(i.vertexAttribDivisor(M,R),B[M]=R)}function _(){const M=r.newAttributes,R=r.enabledAttributes;for(let I=0,U=R.length;I<U;I++)R[I]!==M[I]&&(i.disableVertexAttribArray(I),R[I]=0)}function v(M,R,I,U,B,X,H){H===!0?i.vertexAttribIPointer(M,R,I,B,X):i.vertexAttribPointer(M,R,I,U,B,X)}function y(M,R,I,U){x();const B=U.attributes,X=I.getAttributes(),H=R.defaultAttributeValues;for(const Z in X){const V=X[Z];if(V.location>=0){let ct=B[Z];if(ct===void 0&&(Z==="instanceMatrix"&&M.instanceMatrix&&(ct=M.instanceMatrix),Z==="instanceColor"&&M.instanceColor&&(ct=M.instanceColor)),ct!==void 0){const ut=ct.normalized,xt=ct.itemSize,Nt=t.get(ct);if(Nt===void 0)continue;const Zt=Nt.buffer,Y=Nt.type,it=Nt.bytesPerElement,St=Y===i.INT||Y===i.UNSIGNED_INT||ct.gpuType===Al;if(ct.isInterleavedBufferAttribute){const ot=ct.data,Ct=ot.stride,It=ct.offset;if(ot.isInstancedInterleavedBuffer){for(let Lt=0;Lt<V.locationSize;Lt++)f(V.location+Lt,ot.meshPerAttribute);M.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let Lt=0;Lt<V.locationSize;Lt++)m(V.location+Lt);i.bindBuffer(i.ARRAY_BUFFER,Zt);for(let Lt=0;Lt<V.locationSize;Lt++)v(V.location+Lt,xt/V.locationSize,Y,ut,Ct*it,(It+xt/V.locationSize*Lt)*it,St)}else{if(ct.isInstancedBufferAttribute){for(let ot=0;ot<V.locationSize;ot++)f(V.location+ot,ct.meshPerAttribute);M.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=ct.meshPerAttribute*ct.count)}else for(let ot=0;ot<V.locationSize;ot++)m(V.location+ot);i.bindBuffer(i.ARRAY_BUFFER,Zt);for(let ot=0;ot<V.locationSize;ot++)v(V.location+ot,xt/V.locationSize,Y,ut,xt*it,xt/V.locationSize*ot*it,St)}}else if(H!==void 0){const ut=H[Z];if(ut!==void 0)switch(ut.length){case 2:i.vertexAttrib2fv(V.location,ut);break;case 3:i.vertexAttrib3fv(V.location,ut);break;case 4:i.vertexAttrib4fv(V.location,ut);break;default:i.vertexAttrib1fv(V.location,ut)}}}}_()}function w(){L();for(const M in n){const R=n[M];for(const I in R){const U=R[I];for(const B in U)h(U[B].object),delete U[B];delete R[I]}delete n[M]}}function E(M){if(n[M.id]===void 0)return;const R=n[M.id];for(const I in R){const U=R[I];for(const B in U)h(U[B].object),delete U[B];delete R[I]}delete n[M.id]}function A(M){for(const R in n){const I=n[R];if(I[M.id]===void 0)continue;const U=I[M.id];for(const B in U)h(U[B].object),delete U[B];delete I[M.id]}}function L(){S(),o=!0,r!==s&&(r=s,c(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:L,resetDefaultState:S,dispose:w,releaseStatesOfGeometry:E,releaseStatesOfProgram:A,initAttributes:x,enableAttribute:m,disableUnusedAttributes:_}}function ng(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function o(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function a(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let p=0;for(let g=0;g<u;g++)p+=h[g];e.update(p,n,1)}function l(c,h,u,d){if(u===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)o(c[g],h[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let g=0;for(let x=0;x<u;x++)g+=h[x]*d[x];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function ig(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(A){return!(A!==ln&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const L=A===jn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Nn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Pn&&!L)}function l(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),_=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=g>0,E=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:_,maxVaryings:v,maxFragmentUniforms:y,vertexTextures:w,maxSamples:E}}function sg(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new Xn,a=new Gt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const p=u.length!==0||d||n!==0||s;return s=d,n=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,p){const g=u.clippingPlanes,x=u.clipIntersection,m=u.clipShadows,f=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{const _=r?0:n,v=_*4;let y=f.clippingState||null;l.value=y,y=h(g,d,v,p);for(let w=0;w!==v;++w)y[w]=e[w];f.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,p,g){const x=u!==null?u.length:0;let m=null;if(x!==0){if(m=l.value,g!==!0||m===null){const f=p+x*4,_=d.matrixWorldInverse;a.getNormalMatrix(_),(m===null||m.length<f)&&(m=new Float32Array(f));for(let v=0,y=p;v!==x;++v,y+=4)o.copy(u[v]).applyMatrix4(_,a),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,m}}function rg(i){let t=new WeakMap;function e(o,a){return a===Oa?o.mapping=Zi:a===Fa&&(o.mapping=ji),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Oa||a===Fa)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new gp(l.height);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class Fl extends Zu{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Vi=4,kc=[.125,.215,.35,.446,.526,.582],hi=20,Fo=new Fl,Hc=new Ft;let Bo=null,zo=0,ko=0,Ho=!1;const li=(1+Math.sqrt(5))/2,Oi=1/li,Gc=[new C(-li,Oi,0),new C(li,Oi,0),new C(-Oi,0,li),new C(Oi,0,li),new C(0,li,-Oi),new C(0,li,Oi),new C(-1,1,-1),new C(1,1,-1),new C(-1,1,1),new C(1,1,1)];class Vc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Bo=this._renderer.getRenderTarget(),zo=this._renderer.getActiveCubeFace(),ko=this._renderer.getActiveMipmapLevel(),Ho=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=qc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Xc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Bo,zo,ko),this._renderer.xr.enabled=Ho,t.scissorTest=!1,gr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Zi||t.mapping===ji?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Bo=this._renderer.getRenderTarget(),zo=this._renderer.getActiveCubeFace(),ko=this._renderer.getActiveMipmapLevel(),Ho=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:pn,minFilter:pn,generateMipmaps:!1,type:jn,format:ln,colorSpace:es,depthBuffer:!1},s=Wc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Wc(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=og(r)),this._blurMaterial=ag(r,t,e)}return s}_compileMaterial(t){const e=new $t(this._lodPlanes[0],t);this._renderer.compile(e,Fo)}_sceneToCubeUV(t,e,n,s){const a=new $e(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Hc),h.toneMapping=Yn,h.autoClear=!1;const p=new Xs({name:"PMREM.Background",side:Be,depthWrite:!1,depthTest:!1}),g=new $t(new et,p);let x=!1;const m=t.background;m?m.isColor&&(p.color.copy(m),t.background=null,x=!0):(p.color.copy(Hc),x=!0);for(let f=0;f<6;f++){const _=f%3;_===0?(a.up.set(0,l[f],0),a.lookAt(c[f],0,0)):_===1?(a.up.set(0,0,l[f]),a.lookAt(0,c[f],0)):(a.up.set(0,l[f],0),a.lookAt(0,0,c[f]));const v=this._cubeSize;gr(s,_*v,f>2?v:0,v,v),h.setRenderTarget(s),x&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Zi||t.mapping===ji;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=qc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Xc());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new $t(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;gr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Fo)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Gc[(s-r-1)%Gc.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new $t(this._lodPlanes[s],c),d=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*hi-1),x=r/g,m=isFinite(r)?1+Math.floor(h*x):hi;m>hi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${hi}`);const f=[];let _=0;for(let A=0;A<hi;++A){const L=A/x,S=Math.exp(-L*L/2);f.push(S),A===0?_+=S:A<m&&(_+=2*S)}for(let A=0;A<f.length;A++)f[A]=f[A]/_;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:v}=this;d.dTheta.value=g,d.mipInt.value=v-n;const y=this._sizeLods[s],w=3*y*(s>v-Vi?s-v+Vi:0),E=4*(this._cubeSize-y);gr(e,w,E,3*y,2*y),l.setRenderTarget(e),l.render(u,Fo)}}function og(i){const t=[],e=[],n=[];let s=i;const r=i-Vi+1+kc.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let l=1/a;o>i-Vi?l=kc[o-i+Vi-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,x=3,m=2,f=1,_=new Float32Array(x*g*p),v=new Float32Array(m*g*p),y=new Float32Array(f*g*p);for(let E=0;E<p;E++){const A=E%3*2/3-1,L=E>2?0:-1,S=[A,L,0,A+2/3,L,0,A+2/3,L+1,0,A,L,0,A+2/3,L+1,0,A,L+1,0];_.set(S,x*g*E),v.set(d,m*g*E);const M=[E,E,E,E,E,E];y.set(M,f*g*E)}const w=new Re;w.setAttribute("position",new Ve(_,x)),w.setAttribute("uv",new Ve(v,m)),w.setAttribute("faceIndex",new Ve(y,f)),t.push(w),s>Vi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Wc(i,t,e){const n=new gn(i,t,e);return n.texture.mapping=io,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function gr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function ag(i,t,e){const n=new Float32Array(hi),s=new C(0,1,0);return new Ke({name:"SphericalGaussianBlur",defines:{n:hi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Bl(),fragmentShader:`

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
		`,blending:In,depthTest:!1,depthWrite:!1})}function Xc(){return new Ke({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Bl(),fragmentShader:`

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
		`,blending:In,depthTest:!1,depthWrite:!1})}function qc(){return new Ke({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Bl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:In,depthTest:!1,depthWrite:!1})}function Bl(){return`

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
	`}function lg(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===Oa||l===Fa,h=l===Zi||l===ji;if(c||h){let u=t.get(a);const d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new Vc(i)),u=c?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{const p=a.image;return c&&p&&p.height>0||h&&p&&s(p)?(e===null&&(e=new Vc(i)),u=c?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function cg(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Ms("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function hg(i,t,e,n){const s={},r=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const x=d.morphAttributes[g];for(let m=0,f=x.length;m<f;m++)t.remove(x[m])}d.removeEventListener("dispose",o),delete s[d.id];const p=r.get(d);p&&(t.remove(p),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function l(u){const d=u.attributes;for(const g in d)t.update(d[g],i.ARRAY_BUFFER);const p=u.morphAttributes;for(const g in p){const x=p[g];for(let m=0,f=x.length;m<f;m++)t.update(x[m],i.ARRAY_BUFFER)}}function c(u){const d=[],p=u.index,g=u.attributes.position;let x=0;if(p!==null){const _=p.array;x=p.version;for(let v=0,y=_.length;v<y;v+=3){const w=_[v+0],E=_[v+1],A=_[v+2];d.push(w,E,E,A,A,w)}}else if(g!==void 0){const _=g.array;x=g.version;for(let v=0,y=_.length/3-1;v<y;v+=3){const w=v+0,E=v+1,A=v+2;d.push(w,E,E,A,A,w)}}else return;const m=new(Vu(d)?$u:Yu)(d,1);m.version=x;const f=r.get(u);f&&t.remove(f),r.set(u,m)}function h(u){const d=r.get(u);if(d){const p=u.index;p!==null&&d.version<p.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function ug(i,t,e){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,p){i.drawElements(n,p,r,d*o),e.update(p,n,1)}function c(d,p,g){g!==0&&(i.drawElementsInstanced(n,p,r,d*o,g),e.update(p,n,g))}function h(d,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,d,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];e.update(m,n,1)}function u(d,p,g,x){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)c(d[f]/o,p[f],x[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,d,0,x,0,g);let f=0;for(let _=0;_<g;_++)f+=p[_]*x[_];e.update(f,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function dg(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function fg(i,t,e){const n=new WeakMap,s=new ie;function r(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(a);if(d===void 0||d.count!==u){let S=function(){A.dispose(),n.delete(a),a.removeEventListener("dispose",S)};d!==void 0&&d.texture.dispose();const p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],_=a.morphAttributes.color||[];let v=0;p===!0&&(v=1),g===!0&&(v=2),x===!0&&(v=3);let y=a.attributes.position.count*v,w=1;y>t.maxTextureSize&&(w=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);const E=new Float32Array(y*w*4*u),A=new Xu(E,y,w,u);A.type=Pn,A.needsUpdate=!0;const L=v*4;for(let M=0;M<u;M++){const R=m[M],I=f[M],U=_[M],B=y*w*4*M;for(let X=0;X<R.count;X++){const H=X*L;p===!0&&(s.fromBufferAttribute(R,X),E[B+H+0]=s.x,E[B+H+1]=s.y,E[B+H+2]=s.z,E[B+H+3]=0),g===!0&&(s.fromBufferAttribute(I,X),E[B+H+4]=s.x,E[B+H+5]=s.y,E[B+H+6]=s.z,E[B+H+7]=0),x===!0&&(s.fromBufferAttribute(U,X),E[B+H+8]=s.x,E[B+H+9]=s.y,E[B+H+10]=s.z,E[B+H+11]=U.itemSize===4?s.w:1)}}d={count:u,texture:A,size:new nt(y,w)},n.set(a,d),a.addEventListener("dispose",S)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let p=0;for(let x=0;x<c.length;x++)p+=c[x];const g=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function pg(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}class zl extends ze{constructor(t,e,n,s,r,o,a,l,c,h=Yi){if(h!==Yi&&h!==Qi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Yi&&(n=pi),n===void 0&&h===Qi&&(n=Ji),super(null,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:we,this.minFilter=l!==void 0?l:we,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Qu=new ze,Yc=new zl(1,1),td=new Xu,ed=new ep,nd=new ju,$c=[],Kc=[],Zc=new Float32Array(16),jc=new Float32Array(9),Jc=new Float32Array(4);function ss(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=$c[s];if(r===void 0&&(r=new Float32Array(s),$c[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Te(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ae(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function ao(i,t){let e=Kc[t];e===void 0&&(e=new Int32Array(t),Kc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function mg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function gg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;i.uniform2fv(this.addr,t),Ae(e,t)}}function _g(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Te(e,t))return;i.uniform3fv(this.addr,t),Ae(e,t)}}function vg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;i.uniform4fv(this.addr,t),Ae(e,t)}}function xg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ae(e,t)}else{if(Te(e,n))return;Jc.set(n),i.uniformMatrix2fv(this.addr,!1,Jc),Ae(e,n)}}function yg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ae(e,t)}else{if(Te(e,n))return;jc.set(n),i.uniformMatrix3fv(this.addr,!1,jc),Ae(e,n)}}function Mg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ae(e,t)}else{if(Te(e,n))return;Zc.set(n),i.uniformMatrix4fv(this.addr,!1,Zc),Ae(e,n)}}function Sg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function bg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;i.uniform2iv(this.addr,t),Ae(e,t)}}function wg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Te(e,t))return;i.uniform3iv(this.addr,t),Ae(e,t)}}function Eg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;i.uniform4iv(this.addr,t),Ae(e,t)}}function Tg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Ag(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;i.uniform2uiv(this.addr,t),Ae(e,t)}}function Rg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Te(e,t))return;i.uniform3uiv(this.addr,t),Ae(e,t)}}function Cg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;i.uniform4uiv(this.addr,t),Ae(e,t)}}function Pg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Yc.compareFunction=Gu,r=Yc):r=Qu,e.setTexture2D(t||r,s)}function Lg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||ed,s)}function Dg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||nd,s)}function Ig(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||td,s)}function Ug(i){switch(i){case 5126:return mg;case 35664:return gg;case 35665:return _g;case 35666:return vg;case 35674:return xg;case 35675:return yg;case 35676:return Mg;case 5124:case 35670:return Sg;case 35667:case 35671:return bg;case 35668:case 35672:return wg;case 35669:case 35673:return Eg;case 5125:return Tg;case 36294:return Ag;case 36295:return Rg;case 36296:return Cg;case 35678:case 36198:case 36298:case 36306:case 35682:return Pg;case 35679:case 36299:case 36307:return Lg;case 35680:case 36300:case 36308:case 36293:return Dg;case 36289:case 36303:case 36311:case 36292:return Ig}}function Ng(i,t){i.uniform1fv(this.addr,t)}function Og(i,t){const e=ss(t,this.size,2);i.uniform2fv(this.addr,e)}function Fg(i,t){const e=ss(t,this.size,3);i.uniform3fv(this.addr,e)}function Bg(i,t){const e=ss(t,this.size,4);i.uniform4fv(this.addr,e)}function zg(i,t){const e=ss(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function kg(i,t){const e=ss(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Hg(i,t){const e=ss(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Gg(i,t){i.uniform1iv(this.addr,t)}function Vg(i,t){i.uniform2iv(this.addr,t)}function Wg(i,t){i.uniform3iv(this.addr,t)}function Xg(i,t){i.uniform4iv(this.addr,t)}function qg(i,t){i.uniform1uiv(this.addr,t)}function Yg(i,t){i.uniform2uiv(this.addr,t)}function $g(i,t){i.uniform3uiv(this.addr,t)}function Kg(i,t){i.uniform4uiv(this.addr,t)}function Zg(i,t,e){const n=this.cache,s=t.length,r=ao(e,s);Te(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Qu,r[o])}function jg(i,t,e){const n=this.cache,s=t.length,r=ao(e,s);Te(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||ed,r[o])}function Jg(i,t,e){const n=this.cache,s=t.length,r=ao(e,s);Te(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||nd,r[o])}function Qg(i,t,e){const n=this.cache,s=t.length,r=ao(e,s);Te(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||td,r[o])}function t_(i){switch(i){case 5126:return Ng;case 35664:return Og;case 35665:return Fg;case 35666:return Bg;case 35674:return zg;case 35675:return kg;case 35676:return Hg;case 5124:case 35670:return Gg;case 35667:case 35671:return Vg;case 35668:case 35672:return Wg;case 35669:case 35673:return Xg;case 5125:return qg;case 36294:return Yg;case 36295:return $g;case 36296:return Kg;case 35678:case 36198:case 36298:case 36306:case 35682:return Zg;case 35679:case 36299:case 36307:return jg;case 35680:case 36300:case 36308:case 36293:return Jg;case 36289:case 36303:case 36311:case 36292:return Qg}}class e_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Ug(e.type)}}class n_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=t_(e.type)}}class i_{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const Go=/(\w+)(\])?(\[|\.)?/g;function Qc(i,t){i.seq.push(t),i.map[t.id]=t}function s_(i,t,e){const n=i.name,s=n.length;for(Go.lastIndex=0;;){const r=Go.exec(n),o=Go.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Qc(e,c===void 0?new e_(a,i,t):new n_(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new i_(a),Qc(e,u)),e=u}}}class Yr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);s_(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function th(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const r_=37297;let o_=0;function a_(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const eh=new Gt;function l_(i){Kt._getMatrix(eh,Kt.workingColorSpace,i);const t=`mat3( ${eh.elements.map(e=>e.toFixed(4))} )`;switch(Kt.getTransfer(i)){case so:return[t,"LinearTransferOETF"];case ne:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function nh(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+a_(i.getShaderSource(t),o)}else return s}function c_(i,t){const e=l_(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function h_(i,t){let e;switch(t){case Tu:e="Linear";break;case Au:e="Reinhard";break;case Ru:e="Cineon";break;case Cu:e="ACESFilmic";break;case Pu:e="AgX";break;case Lu:e="Neutral";break;case vf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const _r=new C;function u_(){Kt.getLuminanceCoefficients(_r);const i=_r.x.toFixed(4),t=_r.y.toFixed(4),e=_r.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function d_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ss).join(`
`)}function f_(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function p_(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Ss(i){return i!==""}function ih(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function sh(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const m_=/^[ \t]*#include +<([\w\d./]+)>/gm;function ul(i){return i.replace(m_,__)}const g_=new Map;function __(i,t){let e=Wt[t];if(e===void 0){const n=g_.get(t);if(n!==void 0)e=Wt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return ul(e)}const v_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function rh(i){return i.replace(v_,x_)}function x_(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function oh(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function y_(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Eu?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Zd?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===An&&(t="SHADOWMAP_TYPE_VSM"),t}function M_(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Zi:case ji:t="ENVMAP_TYPE_CUBE";break;case io:t="ENVMAP_TYPE_CUBE_UV";break}return t}function S_(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ji:t="ENVMAP_MODE_REFRACTION";break}return t}function b_(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Tl:t="ENVMAP_BLENDING_MULTIPLY";break;case gf:t="ENVMAP_BLENDING_MIX";break;case _f:t="ENVMAP_BLENDING_ADD";break}return t}function w_(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function E_(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=y_(e),c=M_(e),h=S_(e),u=b_(e),d=w_(e),p=d_(e),g=f_(r),x=s.createProgram();let m,f,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ss).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ss).join(`
`),f.length>0&&(f+=`
`)):(m=[oh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ss).join(`
`),f=[oh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Yn?"#define TONE_MAPPING":"",e.toneMapping!==Yn?Wt.tonemapping_pars_fragment:"",e.toneMapping!==Yn?h_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Wt.colorspace_pars_fragment,c_("linearToOutputTexel",e.outputColorSpace),u_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ss).join(`
`)),o=ul(o),o=ih(o,e),o=sh(o,e),a=ul(a),a=ih(a,e),a=sh(a,e),o=rh(o),a=rh(a),e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===vc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===vc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const v=_+m+o,y=_+f+a,w=th(s,s.VERTEX_SHADER,v),E=th(s,s.FRAGMENT_SHADER,y);s.attachShader(x,w),s.attachShader(x,E),e.index0AttributeName!==void 0?s.bindAttribLocation(x,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function A(R){if(i.debug.checkShaderErrors){const I=s.getProgramInfoLog(x).trim(),U=s.getShaderInfoLog(w).trim(),B=s.getShaderInfoLog(E).trim();let X=!0,H=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(X=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,w,E);else{const Z=nh(s,w,"vertex"),V=nh(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+I+`
`+Z+`
`+V)}else I!==""?console.warn("THREE.WebGLProgram: Program Info Log:",I):(U===""||B==="")&&(H=!1);H&&(R.diagnostics={runnable:X,programLog:I,vertexShader:{log:U,prefix:m},fragmentShader:{log:B,prefix:f}})}s.deleteShader(w),s.deleteShader(E),L=new Yr(s,x),S=p_(s,x)}let L;this.getUniforms=function(){return L===void 0&&A(this),L};let S;this.getAttributes=function(){return S===void 0&&A(this),S};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(x,r_)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=o_++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=w,this.fragmentShader=E,this}let T_=0;class A_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new R_(t),e.set(t,n)),n}}class R_{constructor(t){this.id=T_++,this.code=t,this.usedTimes=0}}function C_(i,t,e,n,s,r,o){const a=new ro,l=new A_,c=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures;let p=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(S){return c.add(S),S===0?"uv":`uv${S}`}function m(S,M,R,I,U){const B=I.fog,X=U.geometry,H=S.isMeshStandardMaterial?I.environment:null,Z=(S.isMeshStandardMaterial?e:t).get(S.envMap||H),V=Z&&Z.mapping===io?Z.image.height:null,ct=g[S.type];S.precision!==null&&(p=s.getMaxPrecision(S.precision),p!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",p,"instead."));const ut=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,xt=ut!==void 0?ut.length:0;let Nt=0;X.morphAttributes.position!==void 0&&(Nt=1),X.morphAttributes.normal!==void 0&&(Nt=2),X.morphAttributes.color!==void 0&&(Nt=3);let Zt,Y,it,St;if(ct){const ee=fn[ct];Zt=ee.vertexShader,Y=ee.fragmentShader}else Zt=S.vertexShader,Y=S.fragmentShader,l.update(S),it=l.getVertexShaderID(S),St=l.getFragmentShaderID(S);const ot=i.getRenderTarget(),Ct=i.state.buffers.depth.getReversed(),It=U.isInstancedMesh===!0,Lt=U.isBatchedMesh===!0,Xt=!!S.map,j=!!S.matcap,rt=!!Z,D=!!S.aoMap,mt=!!S.lightMap,tt=!!S.bumpMap,ht=!!S.normalMap,at=!!S.displacementMap,Dt=!!S.emissiveMap,yt=!!S.metalnessMap,P=!!S.roughnessMap,b=S.anisotropy>0,k=S.clearcoat>0,$=S.dispersion>0,Q=S.iridescence>0,K=S.sheen>0,Et=S.transmission>0,ft=b&&!!S.anisotropyMap,Mt=k&&!!S.clearcoatMap,qt=k&&!!S.clearcoatNormalMap,st=k&&!!S.clearcoatRoughnessMap,bt=Q&&!!S.iridescenceMap,Ut=Q&&!!S.iridescenceThicknessMap,Ot=K&&!!S.sheenColorMap,wt=K&&!!S.sheenRoughnessMap,Yt=!!S.specularMap,Vt=!!S.specularColorMap,ae=!!S.specularIntensityMap,N=Et&&!!S.transmissionMap,pt=Et&&!!S.thicknessMap,q=!!S.gradientMap,J=!!S.alphaMap,vt=S.alphaTest>0,gt=!!S.alphaHash,kt=!!S.extensions;let _e=Yn;S.toneMapped&&(ot===null||ot.isXRRenderTarget===!0)&&(_e=i.toneMapping);const De={shaderID:ct,shaderType:S.type,shaderName:S.name,vertexShader:Zt,fragmentShader:Y,defines:S.defines,customVertexShaderID:it,customFragmentShaderID:St,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:p,batching:Lt,batchingColor:Lt&&U._colorsTexture!==null,instancing:It,instancingColor:It&&U.instanceColor!==null,instancingMorph:It&&U.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ot===null?i.outputColorSpace:ot.isXRRenderTarget===!0?ot.texture.colorSpace:es,alphaToCoverage:!!S.alphaToCoverage,map:Xt,matcap:j,envMap:rt,envMapMode:rt&&Z.mapping,envMapCubeUVHeight:V,aoMap:D,lightMap:mt,bumpMap:tt,normalMap:ht,displacementMap:d&&at,emissiveMap:Dt,normalMapObjectSpace:ht&&S.normalMapType===Sf,normalMapTangentSpace:ht&&S.normalMapType===Ul,metalnessMap:yt,roughnessMap:P,anisotropy:b,anisotropyMap:ft,clearcoat:k,clearcoatMap:Mt,clearcoatNormalMap:qt,clearcoatRoughnessMap:st,dispersion:$,iridescence:Q,iridescenceMap:bt,iridescenceThicknessMap:Ut,sheen:K,sheenColorMap:Ot,sheenRoughnessMap:wt,specularMap:Yt,specularColorMap:Vt,specularIntensityMap:ae,transmission:Et,transmissionMap:N,thicknessMap:pt,gradientMap:q,opaque:S.transparent===!1&&S.blending===qi&&S.alphaToCoverage===!1,alphaMap:J,alphaTest:vt,alphaHash:gt,combine:S.combine,mapUv:Xt&&x(S.map.channel),aoMapUv:D&&x(S.aoMap.channel),lightMapUv:mt&&x(S.lightMap.channel),bumpMapUv:tt&&x(S.bumpMap.channel),normalMapUv:ht&&x(S.normalMap.channel),displacementMapUv:at&&x(S.displacementMap.channel),emissiveMapUv:Dt&&x(S.emissiveMap.channel),metalnessMapUv:yt&&x(S.metalnessMap.channel),roughnessMapUv:P&&x(S.roughnessMap.channel),anisotropyMapUv:ft&&x(S.anisotropyMap.channel),clearcoatMapUv:Mt&&x(S.clearcoatMap.channel),clearcoatNormalMapUv:qt&&x(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:st&&x(S.clearcoatRoughnessMap.channel),iridescenceMapUv:bt&&x(S.iridescenceMap.channel),iridescenceThicknessMapUv:Ut&&x(S.iridescenceThicknessMap.channel),sheenColorMapUv:Ot&&x(S.sheenColorMap.channel),sheenRoughnessMapUv:wt&&x(S.sheenRoughnessMap.channel),specularMapUv:Yt&&x(S.specularMap.channel),specularColorMapUv:Vt&&x(S.specularColorMap.channel),specularIntensityMapUv:ae&&x(S.specularIntensityMap.channel),transmissionMapUv:N&&x(S.transmissionMap.channel),thicknessMapUv:pt&&x(S.thicknessMap.channel),alphaMapUv:J&&x(S.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(ht||b),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!X.attributes.uv&&(Xt||J),fog:!!B,useFog:S.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:Ct,skinning:U.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:xt,morphTextureStride:Nt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:_e,decodeVideoTexture:Xt&&S.map.isVideoTexture===!0&&Kt.getTransfer(S.map.colorSpace)===ne,decodeVideoTextureEmissive:Dt&&S.emissiveMap.isVideoTexture===!0&&Kt.getTransfer(S.emissiveMap.colorSpace)===ne,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===an,flipSided:S.side===Be,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:kt&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(kt&&S.extensions.multiDraw===!0||Lt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return De.vertexUv1s=c.has(1),De.vertexUv2s=c.has(2),De.vertexUv3s=c.has(3),c.clear(),De}function f(S){const M=[];if(S.shaderID?M.push(S.shaderID):(M.push(S.customVertexShaderID),M.push(S.customFragmentShaderID)),S.defines!==void 0)for(const R in S.defines)M.push(R),M.push(S.defines[R]);return S.isRawShaderMaterial===!1&&(_(M,S),v(M,S),M.push(i.outputColorSpace)),M.push(S.customProgramCacheKey),M.join()}function _(S,M){S.push(M.precision),S.push(M.outputColorSpace),S.push(M.envMapMode),S.push(M.envMapCubeUVHeight),S.push(M.mapUv),S.push(M.alphaMapUv),S.push(M.lightMapUv),S.push(M.aoMapUv),S.push(M.bumpMapUv),S.push(M.normalMapUv),S.push(M.displacementMapUv),S.push(M.emissiveMapUv),S.push(M.metalnessMapUv),S.push(M.roughnessMapUv),S.push(M.anisotropyMapUv),S.push(M.clearcoatMapUv),S.push(M.clearcoatNormalMapUv),S.push(M.clearcoatRoughnessMapUv),S.push(M.iridescenceMapUv),S.push(M.iridescenceThicknessMapUv),S.push(M.sheenColorMapUv),S.push(M.sheenRoughnessMapUv),S.push(M.specularMapUv),S.push(M.specularColorMapUv),S.push(M.specularIntensityMapUv),S.push(M.transmissionMapUv),S.push(M.thicknessMapUv),S.push(M.combine),S.push(M.fogExp2),S.push(M.sizeAttenuation),S.push(M.morphTargetsCount),S.push(M.morphAttributeCount),S.push(M.numDirLights),S.push(M.numPointLights),S.push(M.numSpotLights),S.push(M.numSpotLightMaps),S.push(M.numHemiLights),S.push(M.numRectAreaLights),S.push(M.numDirLightShadows),S.push(M.numPointLightShadows),S.push(M.numSpotLightShadows),S.push(M.numSpotLightShadowsWithMaps),S.push(M.numLightProbes),S.push(M.shadowMapType),S.push(M.toneMapping),S.push(M.numClippingPlanes),S.push(M.numClipIntersection),S.push(M.depthPacking)}function v(S,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),S.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reverseDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),S.push(a.mask)}function y(S){const M=g[S.type];let R;if(M){const I=fn[M];R=oo.clone(I.uniforms)}else R=S.uniforms;return R}function w(S,M){let R;for(let I=0,U=h.length;I<U;I++){const B=h[I];if(B.cacheKey===M){R=B,++R.usedTimes;break}}return R===void 0&&(R=new E_(i,M,S,r),h.push(R)),R}function E(S){if(--S.usedTimes===0){const M=h.indexOf(S);h[M]=h[h.length-1],h.pop(),S.destroy()}}function A(S){l.remove(S)}function L(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:y,acquireProgram:w,releaseProgram:E,releaseShaderCache:A,programs:h,dispose:L}}function P_(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function L_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function ah(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function lh(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,d,p,g,x,m){let f=i[t];return f===void 0?(f={id:u.id,object:u,geometry:d,material:p,groupOrder:g,renderOrder:u.renderOrder,z:x,group:m},i[t]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=x,f.group=m),t++,f}function a(u,d,p,g,x,m){const f=o(u,d,p,g,x,m);p.transmission>0?n.push(f):p.transparent===!0?s.push(f):e.push(f)}function l(u,d,p,g,x,m){const f=o(u,d,p,g,x,m);p.transmission>0?n.unshift(f):p.transparent===!0?s.unshift(f):e.unshift(f)}function c(u,d){e.length>1&&e.sort(u||L_),n.length>1&&n.sort(d||ah),s.length>1&&s.sort(d||ah)}function h(){for(let u=t,d=i.length;u<d;u++){const p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function D_(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new lh,i.set(n,[o])):s>=r.length?(o=new lh,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function I_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new Ft};break;case"SpotLight":e={position:new C,direction:new C,color:new Ft,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new Ft,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new Ft,groundColor:new Ft};break;case"RectAreaLight":e={color:new Ft,position:new C,halfWidth:new C,halfHeight:new C};break}return i[t.id]=e,e}}}function U_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let N_=0;function O_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function F_(i){const t=new I_,e=U_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new C);const s=new C,r=new oe,o=new oe;function a(c){let h=0,u=0,d=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let p=0,g=0,x=0,m=0,f=0,_=0,v=0,y=0,w=0,E=0,A=0;c.sort(O_);for(let S=0,M=c.length;S<M;S++){const R=c[S],I=R.color,U=R.intensity,B=R.distance,X=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)h+=I.r*U,u+=I.g*U,d+=I.b*U;else if(R.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(R.sh.coefficients[H],U);A++}else if(R.isDirectionalLight){const H=t.get(R);if(H.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const Z=R.shadow,V=e.get(R);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,n.directionalShadow[p]=V,n.directionalShadowMap[p]=X,n.directionalShadowMatrix[p]=R.shadow.matrix,_++}n.directional[p]=H,p++}else if(R.isSpotLight){const H=t.get(R);H.position.setFromMatrixPosition(R.matrixWorld),H.color.copy(I).multiplyScalar(U),H.distance=B,H.coneCos=Math.cos(R.angle),H.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),H.decay=R.decay,n.spot[x]=H;const Z=R.shadow;if(R.map&&(n.spotLightMap[w]=R.map,w++,Z.updateMatrices(R),R.castShadow&&E++),n.spotLightMatrix[x]=Z.matrix,R.castShadow){const V=e.get(R);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,n.spotShadow[x]=V,n.spotShadowMap[x]=X,y++}x++}else if(R.isRectAreaLight){const H=t.get(R);H.color.copy(I).multiplyScalar(U),H.halfWidth.set(R.width*.5,0,0),H.halfHeight.set(0,R.height*.5,0),n.rectArea[m]=H,m++}else if(R.isPointLight){const H=t.get(R);if(H.color.copy(R.color).multiplyScalar(R.intensity),H.distance=R.distance,H.decay=R.decay,R.castShadow){const Z=R.shadow,V=e.get(R);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,V.shadowCameraNear=Z.camera.near,V.shadowCameraFar=Z.camera.far,n.pointShadow[g]=V,n.pointShadowMap[g]=X,n.pointShadowMatrix[g]=R.shadow.matrix,v++}n.point[g]=H,g++}else if(R.isHemisphereLight){const H=t.get(R);H.skyColor.copy(R.color).multiplyScalar(U),H.groundColor.copy(R.groundColor).multiplyScalar(U),n.hemi[f]=H,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=dt.LTC_FLOAT_1,n.rectAreaLTC2=dt.LTC_FLOAT_2):(n.rectAreaLTC1=dt.LTC_HALF_1,n.rectAreaLTC2=dt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const L=n.hash;(L.directionalLength!==p||L.pointLength!==g||L.spotLength!==x||L.rectAreaLength!==m||L.hemiLength!==f||L.numDirectionalShadows!==_||L.numPointShadows!==v||L.numSpotShadows!==y||L.numSpotMaps!==w||L.numLightProbes!==A)&&(n.directional.length=p,n.spot.length=x,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=_,n.directionalShadowMap.length=_,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=_,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=y+w-E,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=A,L.directionalLength=p,L.pointLength=g,L.spotLength=x,L.rectAreaLength=m,L.hemiLength=f,L.numDirectionalShadows=_,L.numPointShadows=v,L.numSpotShadows=y,L.numSpotMaps=w,L.numLightProbes=A,n.version=N_++)}function l(c,h){let u=0,d=0,p=0,g=0,x=0;const m=h.matrixWorldInverse;for(let f=0,_=c.length;f<_;f++){const v=c[f];if(v.isDirectionalLight){const y=n.directional[u];y.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),u++}else if(v.isSpotLight){const y=n.spot[p];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),p++}else if(v.isRectAreaLight){const y=n.rectArea[g];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),o.identity(),r.copy(v.matrixWorld),r.premultiply(m),o.extractRotation(r),y.halfWidth.set(v.width*.5,0,0),y.halfHeight.set(0,v.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(v.isPointLight){const y=n.point[d];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),d++}else if(v.isHemisphereLight){const y=n.hemi[x];y.direction.setFromMatrixPosition(v.matrixWorld),y.direction.transformDirection(m),x++}}}return{setup:a,setupView:l,state:n}}function ch(i){const t=new F_(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function B_(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new ch(i),t.set(s,[a])):r>=o.length?(a=new ch(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class z_ extends Jn{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=yf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class k_ extends Jn{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const H_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,G_=`uniform sampler2D shadow_pass;
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
}`;function V_(i,t,e){let n=new Ol;const s=new nt,r=new nt,o=new ie,a=new z_({depthPacking:Mf}),l=new k_,c={},h=e.maxTextureSize,u={[Zn]:Be,[Be]:Zn,[an]:an},d=new Ke({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new nt},radius:{value:4}},vertexShader:H_,fragmentShader:G_}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const g=new Re;g.setAttribute("position",new Ve(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new $t(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Eu;let f=this.type;this.render=function(E,A,L){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;const S=i.getRenderTarget(),M=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),I=i.state;I.setBlending(In),I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const U=f!==An&&this.type===An,B=f===An&&this.type!==An;for(let X=0,H=E.length;X<H;X++){const Z=E[X],V=Z.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const ct=V.getFrameExtents();if(s.multiply(ct),r.copy(V.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ct.x),s.x=r.x*ct.x,V.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ct.y),s.y=r.y*ct.y,V.mapSize.y=r.y)),V.map===null||U===!0||B===!0){const xt=this.type!==An?{minFilter:we,magFilter:we}:{};V.map!==null&&V.map.dispose(),V.map=new gn(s.x,s.y,xt),V.map.texture.name=Z.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const ut=V.getViewportCount();for(let xt=0;xt<ut;xt++){const Nt=V.getViewport(xt);o.set(r.x*Nt.x,r.y*Nt.y,r.x*Nt.z,r.y*Nt.w),I.viewport(o),V.updateMatrices(Z,xt),n=V.getFrustum(),y(A,L,V.camera,Z,this.type)}V.isPointLightShadow!==!0&&this.type===An&&_(V,L),V.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(S,M,R)};function _(E,A){const L=t.update(x);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,p.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new gn(s.x,s.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(A,null,L,d,x,null),p.uniforms.shadow_pass.value=E.mapPass.texture,p.uniforms.resolution.value=E.mapSize,p.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(A,null,L,p,x,null)}function v(E,A,L,S){let M=null;const R=L.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(R!==void 0)M=R;else if(M=L.isPointLight===!0?l:a,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const I=M.uuid,U=A.uuid;let B=c[I];B===void 0&&(B={},c[I]=B);let X=B[U];X===void 0&&(X=M.clone(),B[U]=X,A.addEventListener("dispose",w)),M=X}if(M.visible=A.visible,M.wireframe=A.wireframe,S===An?M.side=A.shadowSide!==null?A.shadowSide:A.side:M.side=A.shadowSide!==null?A.shadowSide:u[A.side],M.alphaMap=A.alphaMap,M.alphaTest=A.alphaTest,M.map=A.map,M.clipShadows=A.clipShadows,M.clippingPlanes=A.clippingPlanes,M.clipIntersection=A.clipIntersection,M.displacementMap=A.displacementMap,M.displacementScale=A.displacementScale,M.displacementBias=A.displacementBias,M.wireframeLinewidth=A.wireframeLinewidth,M.linewidth=A.linewidth,L.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const I=i.properties.get(M);I.light=L}return M}function y(E,A,L,S,M){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&M===An)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,E.matrixWorld);const U=t.update(E),B=E.material;if(Array.isArray(B)){const X=U.groups;for(let H=0,Z=X.length;H<Z;H++){const V=X[H],ct=B[V.materialIndex];if(ct&&ct.visible){const ut=v(E,ct,S,M);E.onBeforeShadow(i,E,A,L,U,ut,V),i.renderBufferDirect(L,null,U,ut,E,V),E.onAfterShadow(i,E,A,L,U,ut,V)}}}else if(B.visible){const X=v(E,B,S,M);E.onBeforeShadow(i,E,A,L,U,X,null),i.renderBufferDirect(L,null,U,X,E,null),E.onAfterShadow(i,E,A,L,U,X,null)}}const I=E.children;for(let U=0,B=I.length;U<B;U++)y(I[U],A,L,S,M)}function w(E){E.target.removeEventListener("dispose",w);for(const L in c){const S=c[L],M=E.target.uuid;M in S&&(S[M].dispose(),delete S[M])}}}const W_={[Ca]:Pa,[La]:Ua,[Da]:Na,[Ki]:Ia,[Pa]:Ca,[Ua]:La,[Na]:Da,[Ia]:Ki};function X_(i,t){function e(){let N=!1;const pt=new ie;let q=null;const J=new ie(0,0,0,0);return{setMask:function(vt){q!==vt&&!N&&(i.colorMask(vt,vt,vt,vt),q=vt)},setLocked:function(vt){N=vt},setClear:function(vt,gt,kt,_e,De){De===!0&&(vt*=_e,gt*=_e,kt*=_e),pt.set(vt,gt,kt,_e),J.equals(pt)===!1&&(i.clearColor(vt,gt,kt,_e),J.copy(pt))},reset:function(){N=!1,q=null,J.set(-1,0,0,0)}}}function n(){let N=!1,pt=!1,q=null,J=null,vt=null;return{setReversed:function(gt){if(pt!==gt){const kt=t.get("EXT_clip_control");pt?kt.clipControlEXT(kt.LOWER_LEFT_EXT,kt.ZERO_TO_ONE_EXT):kt.clipControlEXT(kt.LOWER_LEFT_EXT,kt.NEGATIVE_ONE_TO_ONE_EXT);const _e=vt;vt=null,this.setClear(_e)}pt=gt},getReversed:function(){return pt},setTest:function(gt){gt?ot(i.DEPTH_TEST):Ct(i.DEPTH_TEST)},setMask:function(gt){q!==gt&&!N&&(i.depthMask(gt),q=gt)},setFunc:function(gt){if(pt&&(gt=W_[gt]),J!==gt){switch(gt){case Ca:i.depthFunc(i.NEVER);break;case Pa:i.depthFunc(i.ALWAYS);break;case La:i.depthFunc(i.LESS);break;case Ki:i.depthFunc(i.LEQUAL);break;case Da:i.depthFunc(i.EQUAL);break;case Ia:i.depthFunc(i.GEQUAL);break;case Ua:i.depthFunc(i.GREATER);break;case Na:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}J=gt}},setLocked:function(gt){N=gt},setClear:function(gt){vt!==gt&&(pt&&(gt=1-gt),i.clearDepth(gt),vt=gt)},reset:function(){N=!1,q=null,J=null,vt=null,pt=!1}}}function s(){let N=!1,pt=null,q=null,J=null,vt=null,gt=null,kt=null,_e=null,De=null;return{setTest:function(ee){N||(ee?ot(i.STENCIL_TEST):Ct(i.STENCIL_TEST))},setMask:function(ee){pt!==ee&&!N&&(i.stencilMask(ee),pt=ee)},setFunc:function(ee,tn,xn){(q!==ee||J!==tn||vt!==xn)&&(i.stencilFunc(ee,tn,xn),q=ee,J=tn,vt=xn)},setOp:function(ee,tn,xn){(gt!==ee||kt!==tn||_e!==xn)&&(i.stencilOp(ee,tn,xn),gt=ee,kt=tn,_e=xn)},setLocked:function(ee){N=ee},setClear:function(ee){De!==ee&&(i.clearStencil(ee),De=ee)},reset:function(){N=!1,pt=null,q=null,J=null,vt=null,gt=null,kt=null,_e=null,De=null}}}const r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap;let h={},u={},d=new WeakMap,p=[],g=null,x=!1,m=null,f=null,_=null,v=null,y=null,w=null,E=null,A=new Ft(0,0,0),L=0,S=!1,M=null,R=null,I=null,U=null,B=null;const X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,Z=0;const V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(V)[1]),H=Z>=1):V.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),H=Z>=2);let ct=null,ut={};const xt=i.getParameter(i.SCISSOR_BOX),Nt=i.getParameter(i.VIEWPORT),Zt=new ie().fromArray(xt),Y=new ie().fromArray(Nt);function it(N,pt,q,J){const vt=new Uint8Array(4),gt=i.createTexture();i.bindTexture(N,gt),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let kt=0;kt<q;kt++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(pt,0,i.RGBA,1,1,J,0,i.RGBA,i.UNSIGNED_BYTE,vt):i.texImage2D(pt+kt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,vt);return gt}const St={};St[i.TEXTURE_2D]=it(i.TEXTURE_2D,i.TEXTURE_2D,1),St[i.TEXTURE_CUBE_MAP]=it(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),St[i.TEXTURE_2D_ARRAY]=it(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),St[i.TEXTURE_3D]=it(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ot(i.DEPTH_TEST),o.setFunc(Ki),tt(!1),ht(fc),ot(i.CULL_FACE),D(In);function ot(N){h[N]!==!0&&(i.enable(N),h[N]=!0)}function Ct(N){h[N]!==!1&&(i.disable(N),h[N]=!1)}function It(N,pt){return u[N]!==pt?(i.bindFramebuffer(N,pt),u[N]=pt,N===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=pt),N===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=pt),!0):!1}function Lt(N,pt){let q=p,J=!1;if(N){q=d.get(pt),q===void 0&&(q=[],d.set(pt,q));const vt=N.textures;if(q.length!==vt.length||q[0]!==i.COLOR_ATTACHMENT0){for(let gt=0,kt=vt.length;gt<kt;gt++)q[gt]=i.COLOR_ATTACHMENT0+gt;q.length=vt.length,J=!0}}else q[0]!==i.BACK&&(q[0]=i.BACK,J=!0);J&&i.drawBuffers(q)}function Xt(N){return g!==N?(i.useProgram(N),g=N,!0):!1}const j={[ci]:i.FUNC_ADD,[Jd]:i.FUNC_SUBTRACT,[Qd]:i.FUNC_REVERSE_SUBTRACT};j[tf]=i.MIN,j[ef]=i.MAX;const rt={[nf]:i.ZERO,[sf]:i.ONE,[rf]:i.SRC_COLOR,[Aa]:i.SRC_ALPHA,[uf]:i.SRC_ALPHA_SATURATE,[cf]:i.DST_COLOR,[af]:i.DST_ALPHA,[of]:i.ONE_MINUS_SRC_COLOR,[Ra]:i.ONE_MINUS_SRC_ALPHA,[hf]:i.ONE_MINUS_DST_COLOR,[lf]:i.ONE_MINUS_DST_ALPHA,[df]:i.CONSTANT_COLOR,[ff]:i.ONE_MINUS_CONSTANT_COLOR,[pf]:i.CONSTANT_ALPHA,[mf]:i.ONE_MINUS_CONSTANT_ALPHA};function D(N,pt,q,J,vt,gt,kt,_e,De,ee){if(N===In){x===!0&&(Ct(i.BLEND),x=!1);return}if(x===!1&&(ot(i.BLEND),x=!0),N!==jd){if(N!==m||ee!==S){if((f!==ci||y!==ci)&&(i.blendEquation(i.FUNC_ADD),f=ci,y=ci),ee)switch(N){case qi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ta:i.blendFunc(i.ONE,i.ONE);break;case pc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case mc:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case qi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ta:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case pc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case mc:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}_=null,v=null,w=null,E=null,A.set(0,0,0),L=0,m=N,S=ee}return}vt=vt||pt,gt=gt||q,kt=kt||J,(pt!==f||vt!==y)&&(i.blendEquationSeparate(j[pt],j[vt]),f=pt,y=vt),(q!==_||J!==v||gt!==w||kt!==E)&&(i.blendFuncSeparate(rt[q],rt[J],rt[gt],rt[kt]),_=q,v=J,w=gt,E=kt),(_e.equals(A)===!1||De!==L)&&(i.blendColor(_e.r,_e.g,_e.b,De),A.copy(_e),L=De),m=N,S=!1}function mt(N,pt){N.side===an?Ct(i.CULL_FACE):ot(i.CULL_FACE);let q=N.side===Be;pt&&(q=!q),tt(q),N.blending===qi&&N.transparent===!1?D(In):D(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),r.setMask(N.colorWrite);const J=N.stencilWrite;a.setTest(J),J&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Dt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?ot(i.SAMPLE_ALPHA_TO_COVERAGE):Ct(i.SAMPLE_ALPHA_TO_COVERAGE)}function tt(N){M!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),M=N)}function ht(N){N!==$d?(ot(i.CULL_FACE),N!==R&&(N===fc?i.cullFace(i.BACK):N===Kd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ct(i.CULL_FACE),R=N}function at(N){N!==I&&(H&&i.lineWidth(N),I=N)}function Dt(N,pt,q){N?(ot(i.POLYGON_OFFSET_FILL),(U!==pt||B!==q)&&(i.polygonOffset(pt,q),U=pt,B=q)):Ct(i.POLYGON_OFFSET_FILL)}function yt(N){N?ot(i.SCISSOR_TEST):Ct(i.SCISSOR_TEST)}function P(N){N===void 0&&(N=i.TEXTURE0+X-1),ct!==N&&(i.activeTexture(N),ct=N)}function b(N,pt,q){q===void 0&&(ct===null?q=i.TEXTURE0+X-1:q=ct);let J=ut[q];J===void 0&&(J={type:void 0,texture:void 0},ut[q]=J),(J.type!==N||J.texture!==pt)&&(ct!==q&&(i.activeTexture(q),ct=q),i.bindTexture(N,pt||St[N]),J.type=N,J.texture=pt)}function k(){const N=ut[ct];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function $(){try{i.compressedTexImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Q(){try{i.compressedTexImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function K(){try{i.texSubImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Et(){try{i.texSubImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ft(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Mt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function qt(){try{i.texStorage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function st(){try{i.texStorage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function bt(){try{i.texImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ut(){try{i.texImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ot(N){Zt.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),Zt.copy(N))}function wt(N){Y.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),Y.copy(N))}function Yt(N,pt){let q=c.get(pt);q===void 0&&(q=new WeakMap,c.set(pt,q));let J=q.get(N);J===void 0&&(J=i.getUniformBlockIndex(pt,N.name),q.set(N,J))}function Vt(N,pt){const J=c.get(pt).get(N);l.get(pt)!==J&&(i.uniformBlockBinding(pt,J,N.__bindingPointIndex),l.set(pt,J))}function ae(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},ct=null,ut={},u={},d=new WeakMap,p=[],g=null,x=!1,m=null,f=null,_=null,v=null,y=null,w=null,E=null,A=new Ft(0,0,0),L=0,S=!1,M=null,R=null,I=null,U=null,B=null,Zt.set(0,0,i.canvas.width,i.canvas.height),Y.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ot,disable:Ct,bindFramebuffer:It,drawBuffers:Lt,useProgram:Xt,setBlending:D,setMaterial:mt,setFlipSided:tt,setCullFace:ht,setLineWidth:at,setPolygonOffset:Dt,setScissorTest:yt,activeTexture:P,bindTexture:b,unbindTexture:k,compressedTexImage2D:$,compressedTexImage3D:Q,texImage2D:bt,texImage3D:Ut,updateUBOMapping:Yt,uniformBlockBinding:Vt,texStorage2D:qt,texStorage3D:st,texSubImage2D:K,texSubImage3D:Et,compressedTexSubImage2D:ft,compressedTexSubImage3D:Mt,scissor:Ot,viewport:wt,reset:ae}}function hh(i,t,e,n){const s=q_(n);switch(e){case Ou:return i*t;case Bu:return i*t;case zu:return i*t*2;case Pl:return i*t/s.components*s.byteLength;case Ll:return i*t/s.components*s.byteLength;case ku:return i*t*2/s.components*s.byteLength;case Dl:return i*t*2/s.components*s.byteLength;case Fu:return i*t*3/s.components*s.byteLength;case ln:return i*t*4/s.components*s.byteLength;case Il:return i*t*4/s.components*s.byteLength;case Gr:case Vr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Wr:case Xr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ka:case Ga:return Math.max(i,16)*Math.max(t,8)/4;case za:case Ha:return Math.max(i,8)*Math.max(t,8)/2;case Va:case Wa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Xa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case qa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ya:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case $a:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Ka:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Za:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case ja:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Ja:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Qa:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case tl:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case el:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case nl:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case il:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case sl:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case rl:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case qr:case ol:case al:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Hu:case ll:return Math.ceil(i/4)*Math.ceil(t/4)*8;case cl:case hl:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function q_(i){switch(i){case Nn:case Iu:return{byteLength:1,components:1};case Ns:case Uu:case jn:return{byteLength:2,components:1};case Rl:case Cl:return{byteLength:2,components:4};case pi:case Al:case Pn:return{byteLength:4,components:1};case Nu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function Y_(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new nt,h=new WeakMap;let u;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(P,b){return p?new OffscreenCanvas(P,b):Kr("canvas")}function x(P,b,k){let $=1;const Q=yt(P);if((Q.width>k||Q.height>k)&&($=k/Math.max(Q.width,Q.height)),$<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const K=Math.floor($*Q.width),Et=Math.floor($*Q.height);u===void 0&&(u=g(K,Et));const ft=b?g(K,Et):u;return ft.width=K,ft.height=Et,ft.getContext("2d").drawImage(P,0,0,K,Et),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+K+"x"+Et+")."),ft}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),P;return P}function m(P){return P.generateMipmaps}function f(P){i.generateMipmap(P)}function _(P){return P.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?i.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(P,b,k,$,Q=!1){if(P!==null){if(i[P]!==void 0)return i[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let K=b;if(b===i.RED&&(k===i.FLOAT&&(K=i.R32F),k===i.HALF_FLOAT&&(K=i.R16F),k===i.UNSIGNED_BYTE&&(K=i.R8)),b===i.RED_INTEGER&&(k===i.UNSIGNED_BYTE&&(K=i.R8UI),k===i.UNSIGNED_SHORT&&(K=i.R16UI),k===i.UNSIGNED_INT&&(K=i.R32UI),k===i.BYTE&&(K=i.R8I),k===i.SHORT&&(K=i.R16I),k===i.INT&&(K=i.R32I)),b===i.RG&&(k===i.FLOAT&&(K=i.RG32F),k===i.HALF_FLOAT&&(K=i.RG16F),k===i.UNSIGNED_BYTE&&(K=i.RG8)),b===i.RG_INTEGER&&(k===i.UNSIGNED_BYTE&&(K=i.RG8UI),k===i.UNSIGNED_SHORT&&(K=i.RG16UI),k===i.UNSIGNED_INT&&(K=i.RG32UI),k===i.BYTE&&(K=i.RG8I),k===i.SHORT&&(K=i.RG16I),k===i.INT&&(K=i.RG32I)),b===i.RGB_INTEGER&&(k===i.UNSIGNED_BYTE&&(K=i.RGB8UI),k===i.UNSIGNED_SHORT&&(K=i.RGB16UI),k===i.UNSIGNED_INT&&(K=i.RGB32UI),k===i.BYTE&&(K=i.RGB8I),k===i.SHORT&&(K=i.RGB16I),k===i.INT&&(K=i.RGB32I)),b===i.RGBA_INTEGER&&(k===i.UNSIGNED_BYTE&&(K=i.RGBA8UI),k===i.UNSIGNED_SHORT&&(K=i.RGBA16UI),k===i.UNSIGNED_INT&&(K=i.RGBA32UI),k===i.BYTE&&(K=i.RGBA8I),k===i.SHORT&&(K=i.RGBA16I),k===i.INT&&(K=i.RGBA32I)),b===i.RGB&&k===i.UNSIGNED_INT_5_9_9_9_REV&&(K=i.RGB9_E5),b===i.RGBA){const Et=Q?so:Kt.getTransfer($);k===i.FLOAT&&(K=i.RGBA32F),k===i.HALF_FLOAT&&(K=i.RGBA16F),k===i.UNSIGNED_BYTE&&(K=Et===ne?i.SRGB8_ALPHA8:i.RGBA8),k===i.UNSIGNED_SHORT_4_4_4_4&&(K=i.RGBA4),k===i.UNSIGNED_SHORT_5_5_5_1&&(K=i.RGB5_A1)}return(K===i.R16F||K===i.R32F||K===i.RG16F||K===i.RG32F||K===i.RGBA16F||K===i.RGBA32F)&&t.get("EXT_color_buffer_float"),K}function y(P,b){let k;return P?b===null||b===pi||b===Ji?k=i.DEPTH24_STENCIL8:b===Pn?k=i.DEPTH32F_STENCIL8:b===Ns&&(k=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===pi||b===Ji?k=i.DEPTH_COMPONENT24:b===Pn?k=i.DEPTH_COMPONENT32F:b===Ns&&(k=i.DEPTH_COMPONENT16),k}function w(P,b){return m(P)===!0||P.isFramebufferTexture&&P.minFilter!==we&&P.minFilter!==pn?Math.log2(Math.max(b.width,b.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?b.mipmaps.length:1}function E(P){const b=P.target;b.removeEventListener("dispose",E),L(b),b.isVideoTexture&&h.delete(b)}function A(P){const b=P.target;b.removeEventListener("dispose",A),M(b)}function L(P){const b=n.get(P);if(b.__webglInit===void 0)return;const k=P.source,$=d.get(k);if($){const Q=$[b.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&S(P),Object.keys($).length===0&&d.delete(k)}n.remove(P)}function S(P){const b=n.get(P);i.deleteTexture(b.__webglTexture);const k=P.source,$=d.get(k);delete $[b.__cacheKey],o.memory.textures--}function M(P){const b=n.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),n.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(b.__webglFramebuffer[$]))for(let Q=0;Q<b.__webglFramebuffer[$].length;Q++)i.deleteFramebuffer(b.__webglFramebuffer[$][Q]);else i.deleteFramebuffer(b.__webglFramebuffer[$]);b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer[$])}else{if(Array.isArray(b.__webglFramebuffer))for(let $=0;$<b.__webglFramebuffer.length;$++)i.deleteFramebuffer(b.__webglFramebuffer[$]);else i.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&i.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let $=0;$<b.__webglColorRenderbuffer.length;$++)b.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(b.__webglColorRenderbuffer[$]);b.__webglDepthRenderbuffer&&i.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const k=P.textures;for(let $=0,Q=k.length;$<Q;$++){const K=n.get(k[$]);K.__webglTexture&&(i.deleteTexture(K.__webglTexture),o.memory.textures--),n.remove(k[$])}n.remove(P)}let R=0;function I(){R=0}function U(){const P=R;return P>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+s.maxTextures),R+=1,P}function B(P){const b=[];return b.push(P.wrapS),b.push(P.wrapT),b.push(P.wrapR||0),b.push(P.magFilter),b.push(P.minFilter),b.push(P.anisotropy),b.push(P.internalFormat),b.push(P.format),b.push(P.type),b.push(P.generateMipmaps),b.push(P.premultiplyAlpha),b.push(P.flipY),b.push(P.unpackAlignment),b.push(P.colorSpace),b.join()}function X(P,b){const k=n.get(P);if(P.isVideoTexture&&at(P),P.isRenderTargetTexture===!1&&P.version>0&&k.__version!==P.version){const $=P.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(k,P,b);return}}e.bindTexture(i.TEXTURE_2D,k.__webglTexture,i.TEXTURE0+b)}function H(P,b){const k=n.get(P);if(P.version>0&&k.__version!==P.version){Y(k,P,b);return}e.bindTexture(i.TEXTURE_2D_ARRAY,k.__webglTexture,i.TEXTURE0+b)}function Z(P,b){const k=n.get(P);if(P.version>0&&k.__version!==P.version){Y(k,P,b);return}e.bindTexture(i.TEXTURE_3D,k.__webglTexture,i.TEXTURE0+b)}function V(P,b){const k=n.get(P);if(P.version>0&&k.__version!==P.version){it(k,P,b);return}e.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture,i.TEXTURE0+b)}const ct={[Us]:i.REPEAT,[ui]:i.CLAMP_TO_EDGE,[Ba]:i.MIRRORED_REPEAT},ut={[we]:i.NEAREST,[xf]:i.NEAREST_MIPMAP_NEAREST,[js]:i.NEAREST_MIPMAP_LINEAR,[pn]:i.LINEAR,[go]:i.LINEAR_MIPMAP_NEAREST,[di]:i.LINEAR_MIPMAP_LINEAR},xt={[bf]:i.NEVER,[Cf]:i.ALWAYS,[wf]:i.LESS,[Gu]:i.LEQUAL,[Ef]:i.EQUAL,[Rf]:i.GEQUAL,[Tf]:i.GREATER,[Af]:i.NOTEQUAL};function Nt(P,b){if(b.type===Pn&&t.has("OES_texture_float_linear")===!1&&(b.magFilter===pn||b.magFilter===go||b.magFilter===js||b.magFilter===di||b.minFilter===pn||b.minFilter===go||b.minFilter===js||b.minFilter===di)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(P,i.TEXTURE_WRAP_S,ct[b.wrapS]),i.texParameteri(P,i.TEXTURE_WRAP_T,ct[b.wrapT]),(P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY)&&i.texParameteri(P,i.TEXTURE_WRAP_R,ct[b.wrapR]),i.texParameteri(P,i.TEXTURE_MAG_FILTER,ut[b.magFilter]),i.texParameteri(P,i.TEXTURE_MIN_FILTER,ut[b.minFilter]),b.compareFunction&&(i.texParameteri(P,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(P,i.TEXTURE_COMPARE_FUNC,xt[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===we||b.minFilter!==js&&b.minFilter!==di||b.type===Pn&&t.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){const k=t.get("EXT_texture_filter_anisotropic");i.texParameterf(P,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function Zt(P,b){let k=!1;P.__webglInit===void 0&&(P.__webglInit=!0,b.addEventListener("dispose",E));const $=b.source;let Q=d.get($);Q===void 0&&(Q={},d.set($,Q));const K=B(b);if(K!==P.__cacheKey){Q[K]===void 0&&(Q[K]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,k=!0),Q[K].usedTimes++;const Et=Q[P.__cacheKey];Et!==void 0&&(Q[P.__cacheKey].usedTimes--,Et.usedTimes===0&&S(b)),P.__cacheKey=K,P.__webglTexture=Q[K].texture}return k}function Y(P,b,k){let $=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&($=i.TEXTURE_3D);const Q=Zt(P,b),K=b.source;e.bindTexture($,P.__webglTexture,i.TEXTURE0+k);const Et=n.get(K);if(K.version!==Et.__version||Q===!0){e.activeTexture(i.TEXTURE0+k);const ft=Kt.getPrimaries(Kt.workingColorSpace),Mt=b.colorSpace===qn?null:Kt.getPrimaries(b.colorSpace),qt=b.colorSpace===qn||ft===Mt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,qt);let st=x(b.image,!1,s.maxTextureSize);st=Dt(b,st);const bt=r.convert(b.format,b.colorSpace),Ut=r.convert(b.type);let Ot=v(b.internalFormat,bt,Ut,b.colorSpace,b.isVideoTexture);Nt($,b);let wt;const Yt=b.mipmaps,Vt=b.isVideoTexture!==!0,ae=Et.__version===void 0||Q===!0,N=K.dataReady,pt=w(b,st);if(b.isDepthTexture)Ot=y(b.format===Qi,b.type),ae&&(Vt?e.texStorage2D(i.TEXTURE_2D,1,Ot,st.width,st.height):e.texImage2D(i.TEXTURE_2D,0,Ot,st.width,st.height,0,bt,Ut,null));else if(b.isDataTexture)if(Yt.length>0){Vt&&ae&&e.texStorage2D(i.TEXTURE_2D,pt,Ot,Yt[0].width,Yt[0].height);for(let q=0,J=Yt.length;q<J;q++)wt=Yt[q],Vt?N&&e.texSubImage2D(i.TEXTURE_2D,q,0,0,wt.width,wt.height,bt,Ut,wt.data):e.texImage2D(i.TEXTURE_2D,q,Ot,wt.width,wt.height,0,bt,Ut,wt.data);b.generateMipmaps=!1}else Vt?(ae&&e.texStorage2D(i.TEXTURE_2D,pt,Ot,st.width,st.height),N&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,st.width,st.height,bt,Ut,st.data)):e.texImage2D(i.TEXTURE_2D,0,Ot,st.width,st.height,0,bt,Ut,st.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){Vt&&ae&&e.texStorage3D(i.TEXTURE_2D_ARRAY,pt,Ot,Yt[0].width,Yt[0].height,st.depth);for(let q=0,J=Yt.length;q<J;q++)if(wt=Yt[q],b.format!==ln)if(bt!==null)if(Vt){if(N)if(b.layerUpdates.size>0){const vt=hh(wt.width,wt.height,b.format,b.type);for(const gt of b.layerUpdates){const kt=wt.data.subarray(gt*vt/wt.data.BYTES_PER_ELEMENT,(gt+1)*vt/wt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,q,0,0,gt,wt.width,wt.height,1,bt,kt)}b.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,q,0,0,0,wt.width,wt.height,st.depth,bt,wt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,q,Ot,wt.width,wt.height,st.depth,0,wt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Vt?N&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,q,0,0,0,wt.width,wt.height,st.depth,bt,Ut,wt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,q,Ot,wt.width,wt.height,st.depth,0,bt,Ut,wt.data)}else{Vt&&ae&&e.texStorage2D(i.TEXTURE_2D,pt,Ot,Yt[0].width,Yt[0].height);for(let q=0,J=Yt.length;q<J;q++)wt=Yt[q],b.format!==ln?bt!==null?Vt?N&&e.compressedTexSubImage2D(i.TEXTURE_2D,q,0,0,wt.width,wt.height,bt,wt.data):e.compressedTexImage2D(i.TEXTURE_2D,q,Ot,wt.width,wt.height,0,wt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Vt?N&&e.texSubImage2D(i.TEXTURE_2D,q,0,0,wt.width,wt.height,bt,Ut,wt.data):e.texImage2D(i.TEXTURE_2D,q,Ot,wt.width,wt.height,0,bt,Ut,wt.data)}else if(b.isDataArrayTexture)if(Vt){if(ae&&e.texStorage3D(i.TEXTURE_2D_ARRAY,pt,Ot,st.width,st.height,st.depth),N)if(b.layerUpdates.size>0){const q=hh(st.width,st.height,b.format,b.type);for(const J of b.layerUpdates){const vt=st.data.subarray(J*q/st.data.BYTES_PER_ELEMENT,(J+1)*q/st.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,J,st.width,st.height,1,bt,Ut,vt)}b.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,st.width,st.height,st.depth,bt,Ut,st.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ot,st.width,st.height,st.depth,0,bt,Ut,st.data);else if(b.isData3DTexture)Vt?(ae&&e.texStorage3D(i.TEXTURE_3D,pt,Ot,st.width,st.height,st.depth),N&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,st.width,st.height,st.depth,bt,Ut,st.data)):e.texImage3D(i.TEXTURE_3D,0,Ot,st.width,st.height,st.depth,0,bt,Ut,st.data);else if(b.isFramebufferTexture){if(ae)if(Vt)e.texStorage2D(i.TEXTURE_2D,pt,Ot,st.width,st.height);else{let q=st.width,J=st.height;for(let vt=0;vt<pt;vt++)e.texImage2D(i.TEXTURE_2D,vt,Ot,q,J,0,bt,Ut,null),q>>=1,J>>=1}}else if(Yt.length>0){if(Vt&&ae){const q=yt(Yt[0]);e.texStorage2D(i.TEXTURE_2D,pt,Ot,q.width,q.height)}for(let q=0,J=Yt.length;q<J;q++)wt=Yt[q],Vt?N&&e.texSubImage2D(i.TEXTURE_2D,q,0,0,bt,Ut,wt):e.texImage2D(i.TEXTURE_2D,q,Ot,bt,Ut,wt);b.generateMipmaps=!1}else if(Vt){if(ae){const q=yt(st);e.texStorage2D(i.TEXTURE_2D,pt,Ot,q.width,q.height)}N&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,bt,Ut,st)}else e.texImage2D(i.TEXTURE_2D,0,Ot,bt,Ut,st);m(b)&&f($),Et.__version=K.version,b.onUpdate&&b.onUpdate(b)}P.__version=b.version}function it(P,b,k){if(b.image.length!==6)return;const $=Zt(P,b),Q=b.source;e.bindTexture(i.TEXTURE_CUBE_MAP,P.__webglTexture,i.TEXTURE0+k);const K=n.get(Q);if(Q.version!==K.__version||$===!0){e.activeTexture(i.TEXTURE0+k);const Et=Kt.getPrimaries(Kt.workingColorSpace),ft=b.colorSpace===qn?null:Kt.getPrimaries(b.colorSpace),Mt=b.colorSpace===qn||Et===ft?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Mt);const qt=b.isCompressedTexture||b.image[0].isCompressedTexture,st=b.image[0]&&b.image[0].isDataTexture,bt=[];for(let J=0;J<6;J++)!qt&&!st?bt[J]=x(b.image[J],!0,s.maxCubemapSize):bt[J]=st?b.image[J].image:b.image[J],bt[J]=Dt(b,bt[J]);const Ut=bt[0],Ot=r.convert(b.format,b.colorSpace),wt=r.convert(b.type),Yt=v(b.internalFormat,Ot,wt,b.colorSpace),Vt=b.isVideoTexture!==!0,ae=K.__version===void 0||$===!0,N=Q.dataReady;let pt=w(b,Ut);Nt(i.TEXTURE_CUBE_MAP,b);let q;if(qt){Vt&&ae&&e.texStorage2D(i.TEXTURE_CUBE_MAP,pt,Yt,Ut.width,Ut.height);for(let J=0;J<6;J++){q=bt[J].mipmaps;for(let vt=0;vt<q.length;vt++){const gt=q[vt];b.format!==ln?Ot!==null?Vt?N&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt,0,0,gt.width,gt.height,Ot,gt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt,Yt,gt.width,gt.height,0,gt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Vt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt,0,0,gt.width,gt.height,Ot,wt,gt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt,Yt,gt.width,gt.height,0,Ot,wt,gt.data)}}}else{if(q=b.mipmaps,Vt&&ae){q.length>0&&pt++;const J=yt(bt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,pt,Yt,J.width,J.height)}for(let J=0;J<6;J++)if(st){Vt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,bt[J].width,bt[J].height,Ot,wt,bt[J].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Yt,bt[J].width,bt[J].height,0,Ot,wt,bt[J].data);for(let vt=0;vt<q.length;vt++){const kt=q[vt].image[J].image;Vt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt+1,0,0,kt.width,kt.height,Ot,wt,kt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt+1,Yt,kt.width,kt.height,0,Ot,wt,kt.data)}}else{Vt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Ot,wt,bt[J]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Yt,Ot,wt,bt[J]);for(let vt=0;vt<q.length;vt++){const gt=q[vt];Vt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt+1,0,0,Ot,wt,gt.image[J]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt+1,Yt,Ot,wt,gt.image[J])}}}m(b)&&f(i.TEXTURE_CUBE_MAP),K.__version=Q.version,b.onUpdate&&b.onUpdate(b)}P.__version=b.version}function St(P,b,k,$,Q,K){const Et=r.convert(k.format,k.colorSpace),ft=r.convert(k.type),Mt=v(k.internalFormat,Et,ft,k.colorSpace),qt=n.get(b),st=n.get(k);if(st.__renderTarget=b,!qt.__hasExternalTextures){const bt=Math.max(1,b.width>>K),Ut=Math.max(1,b.height>>K);Q===i.TEXTURE_3D||Q===i.TEXTURE_2D_ARRAY?e.texImage3D(Q,K,Mt,bt,Ut,b.depth,0,Et,ft,null):e.texImage2D(Q,K,Mt,bt,Ut,0,Et,ft,null)}e.bindFramebuffer(i.FRAMEBUFFER,P),ht(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,Q,st.__webglTexture,0,tt(b)):(Q===i.TEXTURE_2D||Q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,Q,st.__webglTexture,K),e.bindFramebuffer(i.FRAMEBUFFER,null)}function ot(P,b,k){if(i.bindRenderbuffer(i.RENDERBUFFER,P),b.depthBuffer){const $=b.depthTexture,Q=$&&$.isDepthTexture?$.type:null,K=y(b.stencilBuffer,Q),Et=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ft=tt(b);ht(b)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ft,K,b.width,b.height):k?i.renderbufferStorageMultisample(i.RENDERBUFFER,ft,K,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,K,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Et,i.RENDERBUFFER,P)}else{const $=b.textures;for(let Q=0;Q<$.length;Q++){const K=$[Q],Et=r.convert(K.format,K.colorSpace),ft=r.convert(K.type),Mt=v(K.internalFormat,Et,ft,K.colorSpace),qt=tt(b);k&&ht(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,qt,Mt,b.width,b.height):ht(b)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,qt,Mt,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,Mt,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ct(P,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,P),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const $=n.get(b.depthTexture);$.__renderTarget=b,(!$.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),X(b.depthTexture,0);const Q=$.__webglTexture,K=tt(b);if(b.depthTexture.format===Yi)ht(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0);else if(b.depthTexture.format===Qi)ht(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function It(P){const b=n.get(P),k=P.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==P.depthTexture){const $=P.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),$){const Q=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,$.removeEventListener("dispose",Q)};$.addEventListener("dispose",Q),b.__depthDisposeCallback=Q}b.__boundDepthTexture=$}if(P.depthTexture&&!b.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");Ct(b.__webglFramebuffer,P)}else if(k){b.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[$]),b.__webglDepthbuffer[$]===void 0)b.__webglDepthbuffer[$]=i.createRenderbuffer(),ot(b.__webglDepthbuffer[$],P,!1);else{const Q=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=b.__webglDepthbuffer[$];i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,K)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=i.createRenderbuffer(),ot(b.__webglDepthbuffer,P,!1);else{const $=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Q=b.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Q),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,Q)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Lt(P,b,k){const $=n.get(P);b!==void 0&&St($.__webglFramebuffer,P,P.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),k!==void 0&&It(P)}function Xt(P){const b=P.texture,k=n.get(P),$=n.get(b);P.addEventListener("dispose",A);const Q=P.textures,K=P.isWebGLCubeRenderTarget===!0,Et=Q.length>1;if(Et||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=b.version,o.memory.textures++),K){k.__webglFramebuffer=[];for(let ft=0;ft<6;ft++)if(b.mipmaps&&b.mipmaps.length>0){k.__webglFramebuffer[ft]=[];for(let Mt=0;Mt<b.mipmaps.length;Mt++)k.__webglFramebuffer[ft][Mt]=i.createFramebuffer()}else k.__webglFramebuffer[ft]=i.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){k.__webglFramebuffer=[];for(let ft=0;ft<b.mipmaps.length;ft++)k.__webglFramebuffer[ft]=i.createFramebuffer()}else k.__webglFramebuffer=i.createFramebuffer();if(Et)for(let ft=0,Mt=Q.length;ft<Mt;ft++){const qt=n.get(Q[ft]);qt.__webglTexture===void 0&&(qt.__webglTexture=i.createTexture(),o.memory.textures++)}if(P.samples>0&&ht(P)===!1){k.__webglMultisampledFramebuffer=i.createFramebuffer(),k.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let ft=0;ft<Q.length;ft++){const Mt=Q[ft];k.__webglColorRenderbuffer[ft]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,k.__webglColorRenderbuffer[ft]);const qt=r.convert(Mt.format,Mt.colorSpace),st=r.convert(Mt.type),bt=v(Mt.internalFormat,qt,st,Mt.colorSpace,P.isXRRenderTarget===!0),Ut=tt(P);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ut,bt,P.width,P.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ft,i.RENDERBUFFER,k.__webglColorRenderbuffer[ft])}i.bindRenderbuffer(i.RENDERBUFFER,null),P.depthBuffer&&(k.__webglDepthRenderbuffer=i.createRenderbuffer(),ot(k.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(K){e.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),Nt(i.TEXTURE_CUBE_MAP,b);for(let ft=0;ft<6;ft++)if(b.mipmaps&&b.mipmaps.length>0)for(let Mt=0;Mt<b.mipmaps.length;Mt++)St(k.__webglFramebuffer[ft][Mt],P,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Mt);else St(k.__webglFramebuffer[ft],P,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0);m(b)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Et){for(let ft=0,Mt=Q.length;ft<Mt;ft++){const qt=Q[ft],st=n.get(qt);e.bindTexture(i.TEXTURE_2D,st.__webglTexture),Nt(i.TEXTURE_2D,qt),St(k.__webglFramebuffer,P,qt,i.COLOR_ATTACHMENT0+ft,i.TEXTURE_2D,0),m(qt)&&f(i.TEXTURE_2D)}e.unbindTexture()}else{let ft=i.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(ft=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ft,$.__webglTexture),Nt(ft,b),b.mipmaps&&b.mipmaps.length>0)for(let Mt=0;Mt<b.mipmaps.length;Mt++)St(k.__webglFramebuffer[Mt],P,b,i.COLOR_ATTACHMENT0,ft,Mt);else St(k.__webglFramebuffer,P,b,i.COLOR_ATTACHMENT0,ft,0);m(b)&&f(ft),e.unbindTexture()}P.depthBuffer&&It(P)}function j(P){const b=P.textures;for(let k=0,$=b.length;k<$;k++){const Q=b[k];if(m(Q)){const K=_(P),Et=n.get(Q).__webglTexture;e.bindTexture(K,Et),f(K),e.unbindTexture()}}}const rt=[],D=[];function mt(P){if(P.samples>0){if(ht(P)===!1){const b=P.textures,k=P.width,$=P.height;let Q=i.COLOR_BUFFER_BIT;const K=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Et=n.get(P),ft=b.length>1;if(ft)for(let Mt=0;Mt<b.length;Mt++)e.bindFramebuffer(i.FRAMEBUFFER,Et.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Et.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Et.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Et.__webglFramebuffer);for(let Mt=0;Mt<b.length;Mt++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(Q|=i.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(Q|=i.STENCIL_BUFFER_BIT)),ft){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Et.__webglColorRenderbuffer[Mt]);const qt=n.get(b[Mt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,qt,0)}i.blitFramebuffer(0,0,k,$,0,0,k,$,Q,i.NEAREST),l===!0&&(rt.length=0,D.length=0,rt.push(i.COLOR_ATTACHMENT0+Mt),P.depthBuffer&&P.resolveDepthBuffer===!1&&(rt.push(K),D.push(K),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,D)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,rt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ft)for(let Mt=0;Mt<b.length;Mt++){e.bindFramebuffer(i.FRAMEBUFFER,Et.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.RENDERBUFFER,Et.__webglColorRenderbuffer[Mt]);const qt=n.get(b[Mt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Et.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.TEXTURE_2D,qt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Et.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){const b=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[b])}}}function tt(P){return Math.min(s.maxSamples,P.samples)}function ht(P){const b=n.get(P);return P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function at(P){const b=o.render.frame;h.get(P)!==b&&(h.set(P,b),P.update())}function Dt(P,b){const k=P.colorSpace,$=P.format,Q=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||k!==es&&k!==qn&&(Kt.getTransfer(k)===ne?($!==ln||Q!==Nn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),b}function yt(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=U,this.resetTextureUnits=I,this.setTexture2D=X,this.setTexture2DArray=H,this.setTexture3D=Z,this.setTextureCube=V,this.rebindTextures=Lt,this.setupRenderTarget=Xt,this.updateRenderTargetMipmap=j,this.updateMultisampleRenderTarget=mt,this.setupDepthRenderbuffer=It,this.setupFrameBufferTexture=St,this.useMultisampledRTT=ht}function $_(i,t){function e(n,s=qn){let r;const o=Kt.getTransfer(s);if(n===Nn)return i.UNSIGNED_BYTE;if(n===Rl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Cl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Nu)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Iu)return i.BYTE;if(n===Uu)return i.SHORT;if(n===Ns)return i.UNSIGNED_SHORT;if(n===Al)return i.INT;if(n===pi)return i.UNSIGNED_INT;if(n===Pn)return i.FLOAT;if(n===jn)return i.HALF_FLOAT;if(n===Ou)return i.ALPHA;if(n===Fu)return i.RGB;if(n===ln)return i.RGBA;if(n===Bu)return i.LUMINANCE;if(n===zu)return i.LUMINANCE_ALPHA;if(n===Yi)return i.DEPTH_COMPONENT;if(n===Qi)return i.DEPTH_STENCIL;if(n===Pl)return i.RED;if(n===Ll)return i.RED_INTEGER;if(n===ku)return i.RG;if(n===Dl)return i.RG_INTEGER;if(n===Il)return i.RGBA_INTEGER;if(n===Gr||n===Vr||n===Wr||n===Xr)if(o===ne)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Gr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Wr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Xr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Gr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Vr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Wr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Xr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===za||n===ka||n===Ha||n===Ga)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===za)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ka)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ha)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ga)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Va||n===Wa||n===Xa)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Va||n===Wa)return o===ne?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Xa)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===qa||n===Ya||n===$a||n===Ka||n===Za||n===ja||n===Ja||n===Qa||n===tl||n===el||n===nl||n===il||n===sl||n===rl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===qa)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ya)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===$a)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ka)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Za)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ja)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ja)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Qa)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===tl)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===el)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===nl)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===il)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===sl)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===rl)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===qr||n===ol||n===al)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===qr)return o===ne?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ol)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===al)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Hu||n===ll||n===cl||n===hl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===qr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ll)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===cl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===hl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ji?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class K_ extends $e{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Pe extends Ee{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Z_={type:"move"};class Vo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Pe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Pe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Pe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const x of t.hand.values()){const m=e.getJointPose(x,n),f=this._getHandJoint(c,x);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,g=.005;c.inputState.pinching&&d>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Z_)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Pe;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const j_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,J_=`
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

}`;class Q_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new ze,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Ke({vertexShader:j_,fragmentShader:J_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new $t(new $n(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class tv extends ns{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,p=null,g=null;const x=new Q_,m=e.getContextAttributes();let f=null,_=null;const v=[],y=[],w=new nt;let E=null;const A=new $e;A.viewport=new ie;const L=new $e;L.viewport=new ie;const S=[A,L],M=new K_;let R=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let it=v[Y];return it===void 0&&(it=new Vo,v[Y]=it),it.getTargetRaySpace()},this.getControllerGrip=function(Y){let it=v[Y];return it===void 0&&(it=new Vo,v[Y]=it),it.getGripSpace()},this.getHand=function(Y){let it=v[Y];return it===void 0&&(it=new Vo,v[Y]=it),it.getHandSpace()};function U(Y){const it=y.indexOf(Y.inputSource);if(it===-1)return;const St=v[it];St!==void 0&&(St.update(Y.inputSource,Y.frame,c||o),St.dispatchEvent({type:Y.type,data:Y.inputSource}))}function B(){s.removeEventListener("select",U),s.removeEventListener("selectstart",U),s.removeEventListener("selectend",U),s.removeEventListener("squeeze",U),s.removeEventListener("squeezestart",U),s.removeEventListener("squeezeend",U),s.removeEventListener("end",B),s.removeEventListener("inputsourceschange",X);for(let Y=0;Y<v.length;Y++){const it=y[Y];it!==null&&(y[Y]=null,v[Y].disconnect(it))}R=null,I=null,x.reset(),t.setRenderTarget(f),p=null,d=null,u=null,s=null,_=null,Zt.stop(),n.isPresenting=!1,t.setPixelRatio(E),t.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(f=t.getRenderTarget(),s.addEventListener("select",U),s.addEventListener("selectstart",U),s.addEventListener("selectend",U),s.addEventListener("squeeze",U),s.addEventListener("squeezestart",U),s.addEventListener("squeezeend",U),s.addEventListener("end",B),s.addEventListener("inputsourceschange",X),m.xrCompatible!==!0&&await e.makeXRCompatible(),E=t.getPixelRatio(),t.getSize(w),s.renderState.layers===void 0){const it={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,it),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),_=new gn(p.framebufferWidth,p.framebufferHeight,{format:ln,type:Nn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let it=null,St=null,ot=null;m.depth&&(ot=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,it=m.stencil?Qi:Yi,St=m.stencil?Ji:pi);const Ct={colorFormat:e.RGBA8,depthFormat:ot,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(Ct),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),_=new gn(d.textureWidth,d.textureHeight,{format:ln,type:Nn,depthTexture:new zl(d.textureWidth,d.textureHeight,St,void 0,void 0,void 0,void 0,void 0,void 0,it),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Zt.setContext(s),Zt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function X(Y){for(let it=0;it<Y.removed.length;it++){const St=Y.removed[it],ot=y.indexOf(St);ot>=0&&(y[ot]=null,v[ot].disconnect(St))}for(let it=0;it<Y.added.length;it++){const St=Y.added[it];let ot=y.indexOf(St);if(ot===-1){for(let It=0;It<v.length;It++)if(It>=y.length){y.push(St),ot=It;break}else if(y[It]===null){y[It]=St,ot=It;break}if(ot===-1)break}const Ct=v[ot];Ct&&Ct.connect(St)}}const H=new C,Z=new C;function V(Y,it,St){H.setFromMatrixPosition(it.matrixWorld),Z.setFromMatrixPosition(St.matrixWorld);const ot=H.distanceTo(Z),Ct=it.projectionMatrix.elements,It=St.projectionMatrix.elements,Lt=Ct[14]/(Ct[10]-1),Xt=Ct[14]/(Ct[10]+1),j=(Ct[9]+1)/Ct[5],rt=(Ct[9]-1)/Ct[5],D=(Ct[8]-1)/Ct[0],mt=(It[8]+1)/It[0],tt=Lt*D,ht=Lt*mt,at=ot/(-D+mt),Dt=at*-D;if(it.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Dt),Y.translateZ(at),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Ct[10]===-1)Y.projectionMatrix.copy(it.projectionMatrix),Y.projectionMatrixInverse.copy(it.projectionMatrixInverse);else{const yt=Lt+at,P=Xt+at,b=tt-Dt,k=ht+(ot-Dt),$=j*Xt/P*yt,Q=rt*Xt/P*yt;Y.projectionMatrix.makePerspective(b,k,$,Q,yt,P),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function ct(Y,it){it===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(it.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let it=Y.near,St=Y.far;x.texture!==null&&(x.depthNear>0&&(it=x.depthNear),x.depthFar>0&&(St=x.depthFar)),M.near=L.near=A.near=it,M.far=L.far=A.far=St,(R!==M.near||I!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),R=M.near,I=M.far),A.layers.mask=Y.layers.mask|2,L.layers.mask=Y.layers.mask|4,M.layers.mask=A.layers.mask|L.layers.mask;const ot=Y.parent,Ct=M.cameras;ct(M,ot);for(let It=0;It<Ct.length;It++)ct(Ct[It],ot);Ct.length===2?V(M,A,L):M.projectionMatrix.copy(A.projectionMatrix),ut(Y,M,ot)};function ut(Y,it,St){St===null?Y.matrix.copy(it.matrixWorld):(Y.matrix.copy(St.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(it.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(it.projectionMatrix),Y.projectionMatrixInverse.copy(it.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Os*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(Y){l=Y,d!==null&&(d.fixedFoveation=Y),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Y)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(M)};let xt=null;function Nt(Y,it){if(h=it.getViewerPose(c||o),g=it,h!==null){const St=h.views;p!==null&&(t.setRenderTargetFramebuffer(_,p.framebuffer),t.setRenderTarget(_));let ot=!1;St.length!==M.cameras.length&&(M.cameras.length=0,ot=!0);for(let It=0;It<St.length;It++){const Lt=St[It];let Xt=null;if(p!==null)Xt=p.getViewport(Lt);else{const rt=u.getViewSubImage(d,Lt);Xt=rt.viewport,It===0&&(t.setRenderTargetTextures(_,rt.colorTexture,d.ignoreDepthValues?void 0:rt.depthStencilTexture),t.setRenderTarget(_))}let j=S[It];j===void 0&&(j=new $e,j.layers.enable(It),j.viewport=new ie,S[It]=j),j.matrix.fromArray(Lt.transform.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale),j.projectionMatrix.fromArray(Lt.projectionMatrix),j.projectionMatrixInverse.copy(j.projectionMatrix).invert(),j.viewport.set(Xt.x,Xt.y,Xt.width,Xt.height),It===0&&(M.matrix.copy(j.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),ot===!0&&M.cameras.push(j)}const Ct=s.enabledFeatures;if(Ct&&Ct.includes("depth-sensing")){const It=u.getDepthInformation(St[0]);It&&It.isValid&&It.texture&&x.init(t,It,s.renderState)}}for(let St=0;St<v.length;St++){const ot=y[St],Ct=v[St];ot!==null&&Ct!==void 0&&Ct.update(ot,it,c||o)}xt&&xt(Y,it),it.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:it}),g=null}const Zt=new Ju;Zt.setAnimationLoop(Nt),this.setAnimationLoop=function(Y){xt=Y},this.dispose=function(){}}}const ri=new _n,ev=new oe;function nv(i,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Ku(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,_,v,y){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),u(m,f)):f.isMeshPhongMaterial?(r(m,f),h(m,f)):f.isMeshStandardMaterial?(r(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,y)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),x(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?l(m,f,_,v):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Be&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Be&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const _=t.get(f),v=_.envMap,y=_.envMapRotation;v&&(m.envMap.value=v,ri.copy(y),ri.x*=-1,ri.y*=-1,ri.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(ri.y*=-1,ri.z*=-1),m.envMapRotation.value.setFromMatrix4(ev.makeRotationFromEuler(ri)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,_,v){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*_,m.scale.value=v*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,_){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Be&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=_.texture,m.transmissionSamplerSize.value.set(_.width,_.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function x(m,f){const _=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(_.matrixWorld),m.nearDistance.value=_.shadow.camera.near,m.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function iv(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(_,v){const y=v.program;n.uniformBlockBinding(_,y)}function c(_,v){let y=s[_.id];y===void 0&&(g(_),y=h(_),s[_.id]=y,_.addEventListener("dispose",m));const w=v.program;n.updateUBOMapping(_,w);const E=t.render.frame;r[_.id]!==E&&(d(_),r[_.id]=E)}function h(_){const v=u();_.__bindingPointIndex=v;const y=i.createBuffer(),w=_.__size,E=_.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,w,E),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,y),y}function u(){for(let _=0;_<a;_++)if(o.indexOf(_)===-1)return o.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(_){const v=s[_.id],y=_.uniforms,w=_.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let E=0,A=y.length;E<A;E++){const L=Array.isArray(y[E])?y[E]:[y[E]];for(let S=0,M=L.length;S<M;S++){const R=L[S];if(p(R,E,S,w)===!0){const I=R.__offset,U=Array.isArray(R.value)?R.value:[R.value];let B=0;for(let X=0;X<U.length;X++){const H=U[X],Z=x(H);typeof H=="number"||typeof H=="boolean"?(R.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,I+B,R.__data)):H.isMatrix3?(R.__data[0]=H.elements[0],R.__data[1]=H.elements[1],R.__data[2]=H.elements[2],R.__data[3]=0,R.__data[4]=H.elements[3],R.__data[5]=H.elements[4],R.__data[6]=H.elements[5],R.__data[7]=0,R.__data[8]=H.elements[6],R.__data[9]=H.elements[7],R.__data[10]=H.elements[8],R.__data[11]=0):(H.toArray(R.__data,B),B+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,I,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(_,v,y,w){const E=_.value,A=v+"_"+y;if(w[A]===void 0)return typeof E=="number"||typeof E=="boolean"?w[A]=E:w[A]=E.clone(),!0;{const L=w[A];if(typeof E=="number"||typeof E=="boolean"){if(L!==E)return w[A]=E,!0}else if(L.equals(E)===!1)return L.copy(E),!0}return!1}function g(_){const v=_.uniforms;let y=0;const w=16;for(let A=0,L=v.length;A<L;A++){const S=Array.isArray(v[A])?v[A]:[v[A]];for(let M=0,R=S.length;M<R;M++){const I=S[M],U=Array.isArray(I.value)?I.value:[I.value];for(let B=0,X=U.length;B<X;B++){const H=U[B],Z=x(H),V=y%w,ct=V%Z.boundary,ut=V+ct;y+=ct,ut!==0&&w-ut<Z.storage&&(y+=w-ut),I.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=y,y+=Z.storage}}}const E=y%w;return E>0&&(y+=w-E),_.__size=y,_.__cache={},this}function x(_){const v={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(v.boundary=4,v.storage=4):_.isVector2?(v.boundary=8,v.storage=8):_.isVector3||_.isColor?(v.boundary=16,v.storage=12):_.isVector4?(v.boundary=16,v.storage=16):_.isMatrix3?(v.boundary=48,v.storage=48):_.isMatrix4?(v.boundary=64,v.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),v}function m(_){const v=_.target;v.removeEventListener("dispose",m);const y=o.indexOf(v.__bindingPointIndex);o.splice(y,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function f(){for(const _ in s)i.deleteBuffer(s[_]);o=[],s={},r={}}return{bind:l,update:c,dispose:f}}class sv{constructor(t={}){const{canvas:e=Yf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;const g=new Uint32Array(4),x=new Int32Array(4);let m=null,f=null;const _=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ye,this.toneMapping=Yn,this.toneMappingExposure=1;const y=this;let w=!1,E=0,A=0,L=null,S=-1,M=null;const R=new ie,I=new ie;let U=null;const B=new Ft(0);let X=0,H=e.width,Z=e.height,V=1,ct=null,ut=null;const xt=new ie(0,0,H,Z),Nt=new ie(0,0,H,Z);let Zt=!1;const Y=new Ol;let it=!1,St=!1;const ot=new oe,Ct=new oe,It=new C,Lt=new ie,Xt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let j=!1;function rt(){return L===null?V:1}let D=n;function mt(T,O){return e.getContext(T,O)}try{const T={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${El}`),e.addEventListener("webglcontextlost",J,!1),e.addEventListener("webglcontextrestored",vt,!1),e.addEventListener("webglcontextcreationerror",gt,!1),D===null){const O="webgl2";if(D=mt(O,T),D===null)throw mt(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let tt,ht,at,Dt,yt,P,b,k,$,Q,K,Et,ft,Mt,qt,st,bt,Ut,Ot,wt,Yt,Vt,ae,N;function pt(){tt=new cg(D),tt.init(),Vt=new $_(D,tt),ht=new ig(D,tt,t,Vt),at=new X_(D,tt),ht.reverseDepthBuffer&&d&&at.buffers.depth.setReversed(!0),Dt=new dg(D),yt=new P_,P=new Y_(D,tt,at,yt,ht,Vt,Dt),b=new rg(y),k=new lg(y),$=new xp(D),ae=new eg(D,$),Q=new hg(D,$,Dt,ae),K=new pg(D,Q,$,Dt),Ot=new fg(D,ht,P),st=new sg(yt),Et=new C_(y,b,k,tt,ht,ae,st),ft=new nv(y,yt),Mt=new D_,qt=new B_(tt),Ut=new tg(y,b,k,at,K,p,l),bt=new V_(y,K,ht),N=new iv(D,Dt,ht,at),wt=new ng(D,tt,Dt),Yt=new ug(D,tt,Dt),Dt.programs=Et.programs,y.capabilities=ht,y.extensions=tt,y.properties=yt,y.renderLists=Mt,y.shadowMap=bt,y.state=at,y.info=Dt}pt();const q=new tv(y,D);this.xr=q,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const T=tt.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=tt.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(T){T!==void 0&&(V=T,this.setSize(H,Z,!1))},this.getSize=function(T){return T.set(H,Z)},this.setSize=function(T,O,G=!0){if(q.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}H=T,Z=O,e.width=Math.floor(T*V),e.height=Math.floor(O*V),G===!0&&(e.style.width=T+"px",e.style.height=O+"px"),this.setViewport(0,0,T,O)},this.getDrawingBufferSize=function(T){return T.set(H*V,Z*V).floor()},this.setDrawingBufferSize=function(T,O,G){H=T,Z=O,V=G,e.width=Math.floor(T*G),e.height=Math.floor(O*G),this.setViewport(0,0,T,O)},this.getCurrentViewport=function(T){return T.copy(R)},this.getViewport=function(T){return T.copy(xt)},this.setViewport=function(T,O,G,W){T.isVector4?xt.set(T.x,T.y,T.z,T.w):xt.set(T,O,G,W),at.viewport(R.copy(xt).multiplyScalar(V).round())},this.getScissor=function(T){return T.copy(Nt)},this.setScissor=function(T,O,G,W){T.isVector4?Nt.set(T.x,T.y,T.z,T.w):Nt.set(T,O,G,W),at.scissor(I.copy(Nt).multiplyScalar(V).round())},this.getScissorTest=function(){return Zt},this.setScissorTest=function(T){at.setScissorTest(Zt=T)},this.setOpaqueSort=function(T){ct=T},this.setTransparentSort=function(T){ut=T},this.getClearColor=function(T){return T.copy(Ut.getClearColor())},this.setClearColor=function(){Ut.setClearColor.apply(Ut,arguments)},this.getClearAlpha=function(){return Ut.getClearAlpha()},this.setClearAlpha=function(){Ut.setClearAlpha.apply(Ut,arguments)},this.clear=function(T=!0,O=!0,G=!0){let W=0;if(T){let F=!1;if(L!==null){const lt=L.texture.format;F=lt===Il||lt===Dl||lt===Ll}if(F){const lt=L.texture.type,_t=lt===Nn||lt===pi||lt===Ns||lt===Ji||lt===Rl||lt===Cl,Tt=Ut.getClearColor(),At=Ut.getClearAlpha(),Bt=Tt.r,Ht=Tt.g,Rt=Tt.b;_t?(g[0]=Bt,g[1]=Ht,g[2]=Rt,g[3]=At,D.clearBufferuiv(D.COLOR,0,g)):(x[0]=Bt,x[1]=Ht,x[2]=Rt,x[3]=At,D.clearBufferiv(D.COLOR,0,x))}else W|=D.COLOR_BUFFER_BIT}O&&(W|=D.DEPTH_BUFFER_BIT),G&&(W|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",J,!1),e.removeEventListener("webglcontextrestored",vt,!1),e.removeEventListener("webglcontextcreationerror",gt,!1),Mt.dispose(),qt.dispose(),yt.dispose(),b.dispose(),k.dispose(),K.dispose(),ae.dispose(),N.dispose(),Et.dispose(),q.dispose(),q.removeEventListener("sessionstart",rc),q.removeEventListener("sessionend",oc),Qn.stop()};function J(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function vt(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const T=Dt.autoReset,O=bt.enabled,G=bt.autoUpdate,W=bt.needsUpdate,F=bt.type;pt(),Dt.autoReset=T,bt.enabled=O,bt.autoUpdate=G,bt.needsUpdate=W,bt.type=F}function gt(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function kt(T){const O=T.target;O.removeEventListener("dispose",kt),_e(O)}function _e(T){De(T),yt.remove(T)}function De(T){const O=yt.get(T).programs;O!==void 0&&(O.forEach(function(G){Et.releaseProgram(G)}),T.isShaderMaterial&&Et.releaseShaderCache(T))}this.renderBufferDirect=function(T,O,G,W,F,lt){O===null&&(O=Xt);const _t=F.isMesh&&F.matrixWorld.determinant()<0,Tt=Xd(T,O,G,W,F);at.setMaterial(W,_t);let At=G.index,Bt=1;if(W.wireframe===!0){if(At=Q.getWireframeAttribute(G),At===void 0)return;Bt=2}const Ht=G.drawRange,Rt=G.attributes.position;let Jt=Ht.start*Bt,le=(Ht.start+Ht.count)*Bt;lt!==null&&(Jt=Math.max(Jt,lt.start*Bt),le=Math.min(le,(lt.start+lt.count)*Bt)),At!==null?(Jt=Math.max(Jt,0),le=Math.min(le,At.count)):Rt!=null&&(Jt=Math.max(Jt,0),le=Math.min(le,Rt.count));const ue=le-Jt;if(ue<0||ue===1/0)return;ae.setup(F,W,Tt,G,At);let ke,Qt=wt;if(At!==null&&(ke=$.get(At),Qt=Yt,Qt.setIndex(ke)),F.isMesh)W.wireframe===!0?(at.setLineWidth(W.wireframeLinewidth*rt()),Qt.setMode(D.LINES)):Qt.setMode(D.TRIANGLES);else if(F.isLine){let Pt=W.linewidth;Pt===void 0&&(Pt=1),at.setLineWidth(Pt*rt()),F.isLineSegments?Qt.setMode(D.LINES):F.isLineLoop?Qt.setMode(D.LINE_LOOP):Qt.setMode(D.LINE_STRIP)}else F.isPoints?Qt.setMode(D.POINTS):F.isSprite&&Qt.setMode(D.TRIANGLES);if(F.isBatchedMesh)if(F._multiDrawInstances!==null)Qt.renderMultiDrawInstances(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount,F._multiDrawInstances);else if(tt.get("WEBGL_multi_draw"))Qt.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else{const Pt=F._multiDrawStarts,yn=F._multiDrawCounts,te=F._multiDrawCount,en=At?$.get(At).bytesPerElement:1,Si=yt.get(W).currentProgram.getUniforms();for(let We=0;We<te;We++)Si.setValue(D,"_gl_DrawID",We),Qt.render(Pt[We]/en,yn[We])}else if(F.isInstancedMesh)Qt.renderInstances(Jt,ue,F.count);else if(G.isInstancedBufferGeometry){const Pt=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,yn=Math.min(G.instanceCount,Pt);Qt.renderInstances(Jt,ue,yn)}else Qt.render(Jt,ue)};function ee(T,O,G){T.transparent===!0&&T.side===an&&T.forceSinglePass===!1?(T.side=Be,T.needsUpdate=!0,Zs(T,O,G),T.side=Zn,T.needsUpdate=!0,Zs(T,O,G),T.side=an):Zs(T,O,G)}this.compile=function(T,O,G=null){G===null&&(G=T),f=qt.get(G),f.init(O),v.push(f),G.traverseVisible(function(F){F.isLight&&F.layers.test(O.layers)&&(f.pushLight(F),F.castShadow&&f.pushShadow(F))}),T!==G&&T.traverseVisible(function(F){F.isLight&&F.layers.test(O.layers)&&(f.pushLight(F),F.castShadow&&f.pushShadow(F))}),f.setupLights();const W=new Set;return T.traverse(function(F){if(!(F.isMesh||F.isPoints||F.isLine||F.isSprite))return;const lt=F.material;if(lt)if(Array.isArray(lt))for(let _t=0;_t<lt.length;_t++){const Tt=lt[_t];ee(Tt,G,F),W.add(Tt)}else ee(lt,G,F),W.add(lt)}),v.pop(),f=null,W},this.compileAsync=function(T,O,G=null){const W=this.compile(T,O,G);return new Promise(F=>{function lt(){if(W.forEach(function(_t){yt.get(_t).currentProgram.isReady()&&W.delete(_t)}),W.size===0){F(T);return}setTimeout(lt,10)}tt.get("KHR_parallel_shader_compile")!==null?lt():setTimeout(lt,10)})};let tn=null;function xn(T){tn&&tn(T)}function rc(){Qn.stop()}function oc(){Qn.start()}const Qn=new Ju;Qn.setAnimationLoop(xn),typeof self<"u"&&Qn.setContext(self),this.setAnimationLoop=function(T){tn=T,q.setAnimationLoop(T),T===null?Qn.stop():Qn.start()},q.addEventListener("sessionstart",rc),q.addEventListener("sessionend",oc),this.render=function(T,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),q.enabled===!0&&q.isPresenting===!0&&(q.cameraAutoUpdate===!0&&q.updateCamera(O),O=q.getCamera()),T.isScene===!0&&T.onBeforeRender(y,T,O,L),f=qt.get(T,v.length),f.init(O),v.push(f),Ct.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),Y.setFromProjectionMatrix(Ct),St=this.localClippingEnabled,it=st.init(this.clippingPlanes,St),m=Mt.get(T,_.length),m.init(),_.push(m),q.enabled===!0&&q.isPresenting===!0){const lt=y.xr.getDepthSensingMesh();lt!==null&&mo(lt,O,-1/0,y.sortObjects)}mo(T,O,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(ct,ut),j=q.enabled===!1||q.isPresenting===!1||q.hasDepthSensing()===!1,j&&Ut.addToRenderList(m,T),this.info.render.frame++,it===!0&&st.beginShadows();const G=f.state.shadowsArray;bt.render(G,T,O),it===!0&&st.endShadows(),this.info.autoReset===!0&&this.info.reset();const W=m.opaque,F=m.transmissive;if(f.setupLights(),O.isArrayCamera){const lt=O.cameras;if(F.length>0)for(let _t=0,Tt=lt.length;_t<Tt;_t++){const At=lt[_t];lc(W,F,T,At)}j&&Ut.render(T);for(let _t=0,Tt=lt.length;_t<Tt;_t++){const At=lt[_t];ac(m,T,At,At.viewport)}}else F.length>0&&lc(W,F,T,O),j&&Ut.render(T),ac(m,T,O);L!==null&&(P.updateMultisampleRenderTarget(L),P.updateRenderTargetMipmap(L)),T.isScene===!0&&T.onAfterRender(y,T,O),ae.resetDefaultState(),S=-1,M=null,v.pop(),v.length>0?(f=v[v.length-1],it===!0&&st.setGlobalState(y.clippingPlanes,f.state.camera)):f=null,_.pop(),_.length>0?m=_[_.length-1]:m=null};function mo(T,O,G,W){if(T.visible===!1)return;if(T.layers.test(O.layers)){if(T.isGroup)G=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(O);else if(T.isLight)f.pushLight(T),T.castShadow&&f.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||Y.intersectsSprite(T)){W&&Lt.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Ct);const _t=K.update(T),Tt=T.material;Tt.visible&&m.push(T,_t,Tt,G,Lt.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||Y.intersectsObject(T))){const _t=K.update(T),Tt=T.material;if(W&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Lt.copy(T.boundingSphere.center)):(_t.boundingSphere===null&&_t.computeBoundingSphere(),Lt.copy(_t.boundingSphere.center)),Lt.applyMatrix4(T.matrixWorld).applyMatrix4(Ct)),Array.isArray(Tt)){const At=_t.groups;for(let Bt=0,Ht=At.length;Bt<Ht;Bt++){const Rt=At[Bt],Jt=Tt[Rt.materialIndex];Jt&&Jt.visible&&m.push(T,_t,Jt,G,Lt.z,Rt)}}else Tt.visible&&m.push(T,_t,Tt,G,Lt.z,null)}}const lt=T.children;for(let _t=0,Tt=lt.length;_t<Tt;_t++)mo(lt[_t],O,G,W)}function ac(T,O,G,W){const F=T.opaque,lt=T.transmissive,_t=T.transparent;f.setupLightsView(G),it===!0&&st.setGlobalState(y.clippingPlanes,G),W&&at.viewport(R.copy(W)),F.length>0&&Ks(F,O,G),lt.length>0&&Ks(lt,O,G),_t.length>0&&Ks(_t,O,G),at.buffers.depth.setTest(!0),at.buffers.depth.setMask(!0),at.buffers.color.setMask(!0),at.setPolygonOffset(!1)}function lc(T,O,G,W){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[W.id]===void 0&&(f.state.transmissionRenderTarget[W.id]=new gn(1,1,{generateMipmaps:!0,type:tt.has("EXT_color_buffer_half_float")||tt.has("EXT_color_buffer_float")?jn:Nn,minFilter:di,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Kt.workingColorSpace}));const lt=f.state.transmissionRenderTarget[W.id],_t=W.viewport||R;lt.setSize(_t.z,_t.w);const Tt=y.getRenderTarget();y.setRenderTarget(lt),y.getClearColor(B),X=y.getClearAlpha(),X<1&&y.setClearColor(16777215,.5),y.clear(),j&&Ut.render(G);const At=y.toneMapping;y.toneMapping=Yn;const Bt=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),f.setupLightsView(W),it===!0&&st.setGlobalState(y.clippingPlanes,W),Ks(T,G,W),P.updateMultisampleRenderTarget(lt),P.updateRenderTargetMipmap(lt),tt.has("WEBGL_multisampled_render_to_texture")===!1){let Ht=!1;for(let Rt=0,Jt=O.length;Rt<Jt;Rt++){const le=O[Rt],ue=le.object,ke=le.geometry,Qt=le.material,Pt=le.group;if(Qt.side===an&&ue.layers.test(W.layers)){const yn=Qt.side;Qt.side=Be,Qt.needsUpdate=!0,cc(ue,G,W,ke,Qt,Pt),Qt.side=yn,Qt.needsUpdate=!0,Ht=!0}}Ht===!0&&(P.updateMultisampleRenderTarget(lt),P.updateRenderTargetMipmap(lt))}y.setRenderTarget(Tt),y.setClearColor(B,X),Bt!==void 0&&(W.viewport=Bt),y.toneMapping=At}function Ks(T,O,G){const W=O.isScene===!0?O.overrideMaterial:null;for(let F=0,lt=T.length;F<lt;F++){const _t=T[F],Tt=_t.object,At=_t.geometry,Bt=W===null?_t.material:W,Ht=_t.group;Tt.layers.test(G.layers)&&cc(Tt,O,G,At,Bt,Ht)}}function cc(T,O,G,W,F,lt){T.onBeforeRender(y,O,G,W,F,lt),T.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),F.onBeforeRender(y,O,G,W,T,lt),F.transparent===!0&&F.side===an&&F.forceSinglePass===!1?(F.side=Be,F.needsUpdate=!0,y.renderBufferDirect(G,O,W,F,T,lt),F.side=Zn,F.needsUpdate=!0,y.renderBufferDirect(G,O,W,F,T,lt),F.side=an):y.renderBufferDirect(G,O,W,F,T,lt),T.onAfterRender(y,O,G,W,F,lt)}function Zs(T,O,G){O.isScene!==!0&&(O=Xt);const W=yt.get(T),F=f.state.lights,lt=f.state.shadowsArray,_t=F.state.version,Tt=Et.getParameters(T,F.state,lt,O,G),At=Et.getProgramCacheKey(Tt);let Bt=W.programs;W.environment=T.isMeshStandardMaterial?O.environment:null,W.fog=O.fog,W.envMap=(T.isMeshStandardMaterial?k:b).get(T.envMap||W.environment),W.envMapRotation=W.environment!==null&&T.envMap===null?O.environmentRotation:T.envMapRotation,Bt===void 0&&(T.addEventListener("dispose",kt),Bt=new Map,W.programs=Bt);let Ht=Bt.get(At);if(Ht!==void 0){if(W.currentProgram===Ht&&W.lightsStateVersion===_t)return uc(T,Tt),Ht}else Tt.uniforms=Et.getUniforms(T),T.onBeforeCompile(Tt,y),Ht=Et.acquireProgram(Tt,At),Bt.set(At,Ht),W.uniforms=Tt.uniforms;const Rt=W.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Rt.clippingPlanes=st.uniform),uc(T,Tt),W.needsLights=Yd(T),W.lightsStateVersion=_t,W.needsLights&&(Rt.ambientLightColor.value=F.state.ambient,Rt.lightProbe.value=F.state.probe,Rt.directionalLights.value=F.state.directional,Rt.directionalLightShadows.value=F.state.directionalShadow,Rt.spotLights.value=F.state.spot,Rt.spotLightShadows.value=F.state.spotShadow,Rt.rectAreaLights.value=F.state.rectArea,Rt.ltc_1.value=F.state.rectAreaLTC1,Rt.ltc_2.value=F.state.rectAreaLTC2,Rt.pointLights.value=F.state.point,Rt.pointLightShadows.value=F.state.pointShadow,Rt.hemisphereLights.value=F.state.hemi,Rt.directionalShadowMap.value=F.state.directionalShadowMap,Rt.directionalShadowMatrix.value=F.state.directionalShadowMatrix,Rt.spotShadowMap.value=F.state.spotShadowMap,Rt.spotLightMatrix.value=F.state.spotLightMatrix,Rt.spotLightMap.value=F.state.spotLightMap,Rt.pointShadowMap.value=F.state.pointShadowMap,Rt.pointShadowMatrix.value=F.state.pointShadowMatrix),W.currentProgram=Ht,W.uniformsList=null,Ht}function hc(T){if(T.uniformsList===null){const O=T.currentProgram.getUniforms();T.uniformsList=Yr.seqWithValue(O.seq,T.uniforms)}return T.uniformsList}function uc(T,O){const G=yt.get(T);G.outputColorSpace=O.outputColorSpace,G.batching=O.batching,G.batchingColor=O.batchingColor,G.instancing=O.instancing,G.instancingColor=O.instancingColor,G.instancingMorph=O.instancingMorph,G.skinning=O.skinning,G.morphTargets=O.morphTargets,G.morphNormals=O.morphNormals,G.morphColors=O.morphColors,G.morphTargetsCount=O.morphTargetsCount,G.numClippingPlanes=O.numClippingPlanes,G.numIntersection=O.numClipIntersection,G.vertexAlphas=O.vertexAlphas,G.vertexTangents=O.vertexTangents,G.toneMapping=O.toneMapping}function Xd(T,O,G,W,F){O.isScene!==!0&&(O=Xt),P.resetTextureUnits();const lt=O.fog,_t=W.isMeshStandardMaterial?O.environment:null,Tt=L===null?y.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:es,At=(W.isMeshStandardMaterial?k:b).get(W.envMap||_t),Bt=W.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Ht=!!G.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Rt=!!G.morphAttributes.position,Jt=!!G.morphAttributes.normal,le=!!G.morphAttributes.color;let ue=Yn;W.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(ue=y.toneMapping);const ke=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Qt=ke!==void 0?ke.length:0,Pt=yt.get(W),yn=f.state.lights;if(it===!0&&(St===!0||T!==M)){const Ze=T===M&&W.id===S;st.setState(W,T,Ze)}let te=!1;W.version===Pt.__version?(Pt.needsLights&&Pt.lightsStateVersion!==yn.state.version||Pt.outputColorSpace!==Tt||F.isBatchedMesh&&Pt.batching===!1||!F.isBatchedMesh&&Pt.batching===!0||F.isBatchedMesh&&Pt.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&Pt.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&Pt.instancing===!1||!F.isInstancedMesh&&Pt.instancing===!0||F.isSkinnedMesh&&Pt.skinning===!1||!F.isSkinnedMesh&&Pt.skinning===!0||F.isInstancedMesh&&Pt.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&Pt.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&Pt.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&Pt.instancingMorph===!1&&F.morphTexture!==null||Pt.envMap!==At||W.fog===!0&&Pt.fog!==lt||Pt.numClippingPlanes!==void 0&&(Pt.numClippingPlanes!==st.numPlanes||Pt.numIntersection!==st.numIntersection)||Pt.vertexAlphas!==Bt||Pt.vertexTangents!==Ht||Pt.morphTargets!==Rt||Pt.morphNormals!==Jt||Pt.morphColors!==le||Pt.toneMapping!==ue||Pt.morphTargetsCount!==Qt)&&(te=!0):(te=!0,Pt.__version=W.version);let en=Pt.currentProgram;te===!0&&(en=Zs(W,O,F));let Si=!1,We=!1,os=!1;const de=en.getUniforms(),cn=Pt.uniforms;if(at.useProgram(en.program)&&(Si=!0,We=!0,os=!0),W.id!==S&&(S=W.id,We=!0),Si||M!==T){at.buffers.depth.getReversed()?(ot.copy(T.projectionMatrix),Kf(ot),Zf(ot),de.setValue(D,"projectionMatrix",ot)):de.setValue(D,"projectionMatrix",T.projectionMatrix),de.setValue(D,"viewMatrix",T.matrixWorldInverse);const On=de.map.cameraPosition;On!==void 0&&On.setValue(D,It.setFromMatrixPosition(T.matrixWorld)),ht.logarithmicDepthBuffer&&de.setValue(D,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&de.setValue(D,"isOrthographic",T.isOrthographicCamera===!0),M!==T&&(M=T,We=!0,os=!0)}if(F.isSkinnedMesh){de.setOptional(D,F,"bindMatrix"),de.setOptional(D,F,"bindMatrixInverse");const Ze=F.skeleton;Ze&&(Ze.boneTexture===null&&Ze.computeBoneTexture(),de.setValue(D,"boneTexture",Ze.boneTexture,P))}F.isBatchedMesh&&(de.setOptional(D,F,"batchingTexture"),de.setValue(D,"batchingTexture",F._matricesTexture,P),de.setOptional(D,F,"batchingIdTexture"),de.setValue(D,"batchingIdTexture",F._indirectTexture,P),de.setOptional(D,F,"batchingColorTexture"),F._colorsTexture!==null&&de.setValue(D,"batchingColorTexture",F._colorsTexture,P));const as=G.morphAttributes;if((as.position!==void 0||as.normal!==void 0||as.color!==void 0)&&Ot.update(F,G,en),(We||Pt.receiveShadow!==F.receiveShadow)&&(Pt.receiveShadow=F.receiveShadow,de.setValue(D,"receiveShadow",F.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(cn.envMap.value=At,cn.flipEnvMap.value=At.isCubeTexture&&At.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&O.environment!==null&&(cn.envMapIntensity.value=O.environmentIntensity),We&&(de.setValue(D,"toneMappingExposure",y.toneMappingExposure),Pt.needsLights&&qd(cn,os),lt&&W.fog===!0&&ft.refreshFogUniforms(cn,lt),ft.refreshMaterialUniforms(cn,W,V,Z,f.state.transmissionRenderTarget[T.id]),Yr.upload(D,hc(Pt),cn,P)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(Yr.upload(D,hc(Pt),cn,P),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&de.setValue(D,"center",F.center),de.setValue(D,"modelViewMatrix",F.modelViewMatrix),de.setValue(D,"normalMatrix",F.normalMatrix),de.setValue(D,"modelMatrix",F.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const Ze=W.uniformsGroups;for(let On=0,Fn=Ze.length;On<Fn;On++){const dc=Ze[On];N.update(dc,en),N.bind(dc,en)}}return en}function qd(T,O){T.ambientLightColor.needsUpdate=O,T.lightProbe.needsUpdate=O,T.directionalLights.needsUpdate=O,T.directionalLightShadows.needsUpdate=O,T.pointLights.needsUpdate=O,T.pointLightShadows.needsUpdate=O,T.spotLights.needsUpdate=O,T.spotLightShadows.needsUpdate=O,T.rectAreaLights.needsUpdate=O,T.hemisphereLights.needsUpdate=O}function Yd(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(T,O,G){yt.get(T.texture).__webglTexture=O,yt.get(T.depthTexture).__webglTexture=G;const W=yt.get(T);W.__hasExternalTextures=!0,W.__autoAllocateDepthBuffer=G===void 0,W.__autoAllocateDepthBuffer||tt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(T,O){const G=yt.get(T);G.__webglFramebuffer=O,G.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(T,O=0,G=0){L=T,E=O,A=G;let W=!0,F=null,lt=!1,_t=!1;if(T){const At=yt.get(T);if(At.__useDefaultFramebuffer!==void 0)at.bindFramebuffer(D.FRAMEBUFFER,null),W=!1;else if(At.__webglFramebuffer===void 0)P.setupRenderTarget(T);else if(At.__hasExternalTextures)P.rebindTextures(T,yt.get(T.texture).__webglTexture,yt.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const Rt=T.depthTexture;if(At.__boundDepthTexture!==Rt){if(Rt!==null&&yt.has(Rt)&&(T.width!==Rt.image.width||T.height!==Rt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");P.setupDepthRenderbuffer(T)}}const Bt=T.texture;(Bt.isData3DTexture||Bt.isDataArrayTexture||Bt.isCompressedArrayTexture)&&(_t=!0);const Ht=yt.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Ht[O])?F=Ht[O][G]:F=Ht[O],lt=!0):T.samples>0&&P.useMultisampledRTT(T)===!1?F=yt.get(T).__webglMultisampledFramebuffer:Array.isArray(Ht)?F=Ht[G]:F=Ht,R.copy(T.viewport),I.copy(T.scissor),U=T.scissorTest}else R.copy(xt).multiplyScalar(V).floor(),I.copy(Nt).multiplyScalar(V).floor(),U=Zt;if(at.bindFramebuffer(D.FRAMEBUFFER,F)&&W&&at.drawBuffers(T,F),at.viewport(R),at.scissor(I),at.setScissorTest(U),lt){const At=yt.get(T.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+O,At.__webglTexture,G)}else if(_t){const At=yt.get(T.texture),Bt=O||0;D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,At.__webglTexture,G||0,Bt)}S=-1},this.readRenderTargetPixels=function(T,O,G,W,F,lt,_t){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Tt=yt.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&_t!==void 0&&(Tt=Tt[_t]),Tt){at.bindFramebuffer(D.FRAMEBUFFER,Tt);try{const At=T.texture,Bt=At.format,Ht=At.type;if(!ht.textureFormatReadable(Bt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ht.textureTypeReadable(Ht)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=T.width-W&&G>=0&&G<=T.height-F&&D.readPixels(O,G,W,F,Vt.convert(Bt),Vt.convert(Ht),lt)}finally{const At=L!==null?yt.get(L).__webglFramebuffer:null;at.bindFramebuffer(D.FRAMEBUFFER,At)}}},this.readRenderTargetPixelsAsync=async function(T,O,G,W,F,lt,_t){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Tt=yt.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&_t!==void 0&&(Tt=Tt[_t]),Tt){const At=T.texture,Bt=At.format,Ht=At.type;if(!ht.textureFormatReadable(Bt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ht.textureTypeReadable(Ht))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(O>=0&&O<=T.width-W&&G>=0&&G<=T.height-F){at.bindFramebuffer(D.FRAMEBUFFER,Tt);const Rt=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,Rt),D.bufferData(D.PIXEL_PACK_BUFFER,lt.byteLength,D.STREAM_READ),D.readPixels(O,G,W,F,Vt.convert(Bt),Vt.convert(Ht),0);const Jt=L!==null?yt.get(L).__webglFramebuffer:null;at.bindFramebuffer(D.FRAMEBUFFER,Jt);const le=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await $f(D,le,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,Rt),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,lt),D.deleteBuffer(Rt),D.deleteSync(le),lt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(T,O=null,G=0){T.isTexture!==!0&&(Ms("WebGLRenderer: copyFramebufferToTexture function signature has changed."),O=arguments[0]||null,T=arguments[1]);const W=Math.pow(2,-G),F=Math.floor(T.image.width*W),lt=Math.floor(T.image.height*W),_t=O!==null?O.x:0,Tt=O!==null?O.y:0;P.setTexture2D(T,0),D.copyTexSubImage2D(D.TEXTURE_2D,G,0,0,_t,Tt,F,lt),at.unbindTexture()},this.copyTextureToTexture=function(T,O,G=null,W=null,F=0){T.isTexture!==!0&&(Ms("WebGLRenderer: copyTextureToTexture function signature has changed."),W=arguments[0]||null,T=arguments[1],O=arguments[2],F=arguments[3]||0,G=null);let lt,_t,Tt,At,Bt,Ht,Rt,Jt,le;const ue=T.isCompressedTexture?T.mipmaps[F]:T.image;G!==null?(lt=G.max.x-G.min.x,_t=G.max.y-G.min.y,Tt=G.isBox3?G.max.z-G.min.z:1,At=G.min.x,Bt=G.min.y,Ht=G.isBox3?G.min.z:0):(lt=ue.width,_t=ue.height,Tt=ue.depth||1,At=0,Bt=0,Ht=0),W!==null?(Rt=W.x,Jt=W.y,le=W.z):(Rt=0,Jt=0,le=0);const ke=Vt.convert(O.format),Qt=Vt.convert(O.type);let Pt;O.isData3DTexture?(P.setTexture3D(O,0),Pt=D.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(P.setTexture2DArray(O,0),Pt=D.TEXTURE_2D_ARRAY):(P.setTexture2D(O,0),Pt=D.TEXTURE_2D),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,O.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,O.unpackAlignment);const yn=D.getParameter(D.UNPACK_ROW_LENGTH),te=D.getParameter(D.UNPACK_IMAGE_HEIGHT),en=D.getParameter(D.UNPACK_SKIP_PIXELS),Si=D.getParameter(D.UNPACK_SKIP_ROWS),We=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,ue.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,ue.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,At),D.pixelStorei(D.UNPACK_SKIP_ROWS,Bt),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Ht);const os=T.isDataArrayTexture||T.isData3DTexture,de=O.isDataArrayTexture||O.isData3DTexture;if(T.isRenderTargetTexture||T.isDepthTexture){const cn=yt.get(T),as=yt.get(O),Ze=yt.get(cn.__renderTarget),On=yt.get(as.__renderTarget);at.bindFramebuffer(D.READ_FRAMEBUFFER,Ze.__webglFramebuffer),at.bindFramebuffer(D.DRAW_FRAMEBUFFER,On.__webglFramebuffer);for(let Fn=0;Fn<Tt;Fn++)os&&D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,yt.get(T).__webglTexture,F,Ht+Fn),T.isDepthTexture?(de&&D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,yt.get(O).__webglTexture,F,le+Fn),D.blitFramebuffer(At,Bt,lt,_t,Rt,Jt,lt,_t,D.DEPTH_BUFFER_BIT,D.NEAREST)):de?D.copyTexSubImage3D(Pt,F,Rt,Jt,le+Fn,At,Bt,lt,_t):D.copyTexSubImage2D(Pt,F,Rt,Jt,le+Fn,At,Bt,lt,_t);at.bindFramebuffer(D.READ_FRAMEBUFFER,null),at.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else de?T.isDataTexture||T.isData3DTexture?D.texSubImage3D(Pt,F,Rt,Jt,le,lt,_t,Tt,ke,Qt,ue.data):O.isCompressedArrayTexture?D.compressedTexSubImage3D(Pt,F,Rt,Jt,le,lt,_t,Tt,ke,ue.data):D.texSubImage3D(Pt,F,Rt,Jt,le,lt,_t,Tt,ke,Qt,ue):T.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,F,Rt,Jt,lt,_t,ke,Qt,ue.data):T.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,F,Rt,Jt,ue.width,ue.height,ke,ue.data):D.texSubImage2D(D.TEXTURE_2D,F,Rt,Jt,lt,_t,ke,Qt,ue);D.pixelStorei(D.UNPACK_ROW_LENGTH,yn),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,te),D.pixelStorei(D.UNPACK_SKIP_PIXELS,en),D.pixelStorei(D.UNPACK_SKIP_ROWS,Si),D.pixelStorei(D.UNPACK_SKIP_IMAGES,We),F===0&&O.generateMipmaps&&D.generateMipmap(Pt),at.unbindTexture()},this.copyTextureToTexture3D=function(T,O,G=null,W=null,F=0){return T.isTexture!==!0&&(Ms("WebGLRenderer: copyTextureToTexture3D function signature has changed."),G=arguments[0]||null,W=arguments[1]||null,T=arguments[2],O=arguments[3],F=arguments[4]||0),Ms('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(T,O,G,W,F)},this.initRenderTarget=function(T){yt.get(T).__webglFramebuffer===void 0&&P.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?P.setTextureCube(T,0):T.isData3DTexture?P.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?P.setTexture2DArray(T,0):P.setTexture2D(T,0),at.unbindTexture()},this.resetState=function(){E=0,A=0,L=null,at.reset(),ae.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ln}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Kt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Kt._getUnpackColorSpace()}}class lo{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ft(t),this.near=e,this.far=n}clone(){return new lo(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class rv extends Ee{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new _n,this.environmentIntensity=1,this.environmentRotation=new _n,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class ov extends ze{constructor(t=null,e=1,n=1,s,r,o,a,l,c=we,h=we,u,d){super(null,o,a,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class kl extends Jn{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Ft(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Zr=new C,jr=new C,uh=new oe,ds=new Ws,vr=new is,Wo=new C,dh=new C;class av extends Ee{constructor(t=new Re,e=new kl){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Zr.fromBufferAttribute(e,s-1),jr.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Zr.distanceTo(jr);t.setAttribute("lineDistance",new jt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),vr.copy(n.boundingSphere),vr.applyMatrix4(s),vr.radius+=r,t.ray.intersectsSphere(vr)===!1)return;uh.copy(s).invert(),ds.copy(t.ray).applyMatrix4(uh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const p=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let x=p,m=g-1;x<m;x+=c){const f=h.getX(x),_=h.getX(x+1),v=xr(this,t,ds,l,f,_);v&&e.push(v)}if(this.isLineLoop){const x=h.getX(g-1),m=h.getX(p),f=xr(this,t,ds,l,x,m);f&&e.push(f)}}else{const p=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let x=p,m=g-1;x<m;x+=c){const f=xr(this,t,ds,l,x,x+1);f&&e.push(f)}if(this.isLineLoop){const x=xr(this,t,ds,l,g-1,p);x&&e.push(x)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function xr(i,t,e,n,s,r){const o=i.geometry.attributes.position;if(Zr.fromBufferAttribute(o,s),jr.fromBufferAttribute(o,r),e.distanceSqToSegment(Zr,jr,Wo,dh)>n)return;Wo.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(Wo);if(!(l<t.near||l>t.far))return{distance:l,point:dh.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const fh=new C,ph=new C;class co extends av{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)fh.fromBufferAttribute(e,s),ph.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+fh.distanceTo(ph);t.setAttribute("lineDistance",new jt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class lv extends Jn{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new Ft(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const mh=new oe,dl=new Ws,yr=new is,Mr=new C;class cv extends Ee{constructor(t=new Re,e=new lv){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),yr.copy(n.boundingSphere),yr.applyMatrix4(s),yr.radius+=r,t.ray.intersectsSphere(yr)===!1)return;mh.copy(s).invert(),dl.copy(t.ray).applyMatrix4(mh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){const d=Math.max(0,o.start),p=Math.min(c.count,o.start+o.count);for(let g=d,x=p;g<x;g++){const m=c.getX(g);Mr.fromBufferAttribute(u,m),gh(Mr,m,l,s,t,e,this)}}else{const d=Math.max(0,o.start),p=Math.min(u.count,o.start+o.count);for(let g=d,x=p;g<x;g++)Mr.fromBufferAttribute(u,g),gh(Mr,g,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function gh(i,t,e,n,s,r,o){const a=dl.distanceSqToPoint(i);if(a<e){const l=new C;dl.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class vn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);const h=n[s],d=n[s+1]-h,p=(o-h)/d;return(s+p)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),l=e||(o.isVector2?new nt:new C);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new C,s=[],r=[],o=[],a=new C,l=new oe;for(let p=0;p<=t;p++){const g=p/t;s[p]=this.getTangentAt(g,new C)}r[0]=new C,o[0]=new C;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let p=1;p<=t;p++){if(r[p]=r[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(s[p-1],s[p]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(be(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(a,g))}o[p].crossVectors(s[p],r[p])}if(e===!0){let p=Math.acos(be(r[0].dot(r[t]),-1,1));p/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(p=-p);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],p*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Hl extends vn{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new nt){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,p=c-this.aY;l=d*h-p*u+this.aX,c=d*u+p*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class hv extends Hl{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Gl(){let i=0,t=0,e=0,n=0;function s(r,o,a,l){i=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let d=(o-r)/c-(a-r)/(c+h)+(a-o)/h,p=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,p*=h,s(o,a,d,p)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const Sr=new C,Xo=new Gl,qo=new Gl,Yo=new Gl;class uv extends vn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new C){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(Sr.subVectors(s[0],s[1]).add(s[0]),c=Sr);const u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(Sr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Sr),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),p),x=Math.pow(u.distanceToSquared(d),p),m=Math.pow(d.distanceToSquared(h),p);x<1e-4&&(x=1),g<1e-4&&(g=x),m<1e-4&&(m=x),Xo.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,x,m),qo.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,x,m),Yo.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,x,m)}else this.curveType==="catmullrom"&&(Xo.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),qo.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Yo.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(Xo.calc(l),qo.calc(l),Yo.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new C().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function _h(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,l=i*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*i+e}function dv(i,t){const e=1-i;return e*e*t}function fv(i,t){return 2*(1-i)*i*t}function pv(i,t){return i*i*t}function As(i,t,e,n){return dv(i,t)+fv(i,e)+pv(i,n)}function mv(i,t){const e=1-i;return e*e*e*t}function gv(i,t){const e=1-i;return 3*e*e*i*t}function _v(i,t){return 3*(1-i)*i*i*t}function vv(i,t){return i*i*i*t}function Rs(i,t,e,n,s){return mv(i,t)+gv(i,e)+_v(i,n)+vv(i,s)}class id extends vn{constructor(t=new nt,e=new nt,n=new nt,s=new nt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new nt){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Rs(t,s.x,r.x,o.x,a.x),Rs(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class xv extends vn{constructor(t=new C,e=new C,n=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new C){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Rs(t,s.x,r.x,o.x,a.x),Rs(t,s.y,r.y,o.y,a.y),Rs(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class sd extends vn{constructor(t=new nt,e=new nt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new nt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new nt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class yv extends vn{constructor(t=new C,e=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new C){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new C){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class rd extends vn{constructor(t=new nt,e=new nt,n=new nt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new nt){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(As(t,s.x,r.x,o.x),As(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Mv extends vn{constructor(t=new C,e=new C,n=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new C){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(As(t,s.x,r.x,o.x),As(t,s.y,r.y,o.y),As(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class od extends vn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new nt){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(_h(a,l.x,c.x,h.x,u.x),_h(a,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new nt().fromArray(s))}return this}}var fl=Object.freeze({__proto__:null,ArcCurve:hv,CatmullRomCurve3:uv,CubicBezierCurve:id,CubicBezierCurve3:xv,EllipseCurve:Hl,LineCurve:sd,LineCurve3:yv,QuadraticBezierCurve:rd,QuadraticBezierCurve3:Mv,SplineCurve:od});class Sv extends vn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new fl[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new fl[s.type]().fromJSON(s))}return this}}class vh extends Sv{constructor(t){super(),this.type="Path",this.currentPoint=new nt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new sd(this.currentPoint.clone(),new nt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new rd(this.currentPoint.clone(),new nt(t,e),new nt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){const a=new id(this.currentPoint.clone(),new nt(t,e),new nt(n,s),new nt(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new od(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,o,a,l),this}absellipse(t,e,n,s,r,o,a,l){const c=new Hl(t,e,n,s,r,o,a,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Vl extends Re{constructor(t=[new nt(0,-.5),new nt(.5,0),new nt(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=be(s,0,Math.PI*2);const r=[],o=[],a=[],l=[],c=[],h=1/e,u=new C,d=new nt,p=new C,g=new C,x=new C;let m=0,f=0;for(let _=0;_<=t.length-1;_++)switch(_){case 0:m=t[_+1].x-t[_].x,f=t[_+1].y-t[_].y,p.x=f*1,p.y=-m,p.z=f*0,x.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case t.length-1:l.push(x.x,x.y,x.z);break;default:m=t[_+1].x-t[_].x,f=t[_+1].y-t[_].y,p.x=f*1,p.y=-m,p.z=f*0,g.copy(p),p.x+=x.x,p.y+=x.y,p.z+=x.z,p.normalize(),l.push(p.x,p.y,p.z),x.copy(g)}for(let _=0;_<=e;_++){const v=n+_*h*s,y=Math.sin(v),w=Math.cos(v);for(let E=0;E<=t.length-1;E++){u.x=t[E].x*y,u.y=t[E].y,u.z=t[E].x*w,o.push(u.x,u.y,u.z),d.x=_/e,d.y=E/(t.length-1),a.push(d.x,d.y);const A=l[3*E+0]*y,L=l[3*E+1],S=l[3*E+0]*w;c.push(A,L,S)}}for(let _=0;_<e;_++)for(let v=0;v<t.length-1;v++){const y=v+_*t.length,w=y,E=y+t.length,A=y+t.length+1,L=y+1;r.push(w,E,L),r.push(A,L,E)}this.setIndex(r),this.setAttribute("position",new jt(o,3)),this.setAttribute("uv",new jt(a,2)),this.setAttribute("normal",new jt(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vl(t.points,t.segments,t.phiStart,t.phiLength)}}class zt extends Re{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],d=[],p=[];let g=0;const x=[],m=n/2;let f=0;_(),o===!1&&(t>0&&v(!0),e>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new jt(u,3)),this.setAttribute("normal",new jt(d,3)),this.setAttribute("uv",new jt(p,2));function _(){const y=new C,w=new C;let E=0;const A=(e-t)/n;for(let L=0;L<=r;L++){const S=[],M=L/r,R=M*(e-t)+t;for(let I=0;I<=s;I++){const U=I/s,B=U*l+a,X=Math.sin(B),H=Math.cos(B);w.x=R*X,w.y=-M*n+m,w.z=R*H,u.push(w.x,w.y,w.z),y.set(X,A,H).normalize(),d.push(y.x,y.y,y.z),p.push(U,1-M),S.push(g++)}x.push(S)}for(let L=0;L<s;L++)for(let S=0;S<r;S++){const M=x[S][L],R=x[S+1][L],I=x[S+1][L+1],U=x[S][L+1];(t>0||S!==0)&&(h.push(M,R,U),E+=3),(e>0||S!==r-1)&&(h.push(R,I,U),E+=3)}c.addGroup(f,E,0),f+=E}function v(y){const w=g,E=new nt,A=new C;let L=0;const S=y===!0?t:e,M=y===!0?1:-1;for(let I=1;I<=s;I++)u.push(0,m*M,0),d.push(0,M,0),p.push(.5,.5),g++;const R=g;for(let I=0;I<=s;I++){const B=I/s*l+a,X=Math.cos(B),H=Math.sin(B);A.x=S*H,A.y=m*M,A.z=S*X,u.push(A.x,A.y,A.z),d.push(0,M,0),E.x=X*.5+.5,E.y=H*.5*M+.5,p.push(E.x,E.y),g++}for(let I=0;I<s;I++){const U=w+I,B=R+I;y===!0?h.push(B,B+1,U):h.push(B+1,B,U),L+=3}c.addGroup(f,L,y===!0?1:2),f+=L}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zt(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Le extends zt{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Le(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ho extends Re{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],o=[];a(s),c(n),h(),this.setAttribute("position",new jt(r,3)),this.setAttribute("normal",new jt(r.slice(),3)),this.setAttribute("uv",new jt(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(_){const v=new C,y=new C,w=new C;for(let E=0;E<e.length;E+=3)p(e[E+0],v),p(e[E+1],y),p(e[E+2],w),l(v,y,w,_)}function l(_,v,y,w){const E=w+1,A=[];for(let L=0;L<=E;L++){A[L]=[];const S=_.clone().lerp(y,L/E),M=v.clone().lerp(y,L/E),R=E-L;for(let I=0;I<=R;I++)I===0&&L===E?A[L][I]=S:A[L][I]=S.clone().lerp(M,I/R)}for(let L=0;L<E;L++)for(let S=0;S<2*(E-L)-1;S++){const M=Math.floor(S/2);S%2===0?(d(A[L][M+1]),d(A[L+1][M]),d(A[L][M])):(d(A[L][M+1]),d(A[L+1][M+1]),d(A[L+1][M]))}}function c(_){const v=new C;for(let y=0;y<r.length;y+=3)v.x=r[y+0],v.y=r[y+1],v.z=r[y+2],v.normalize().multiplyScalar(_),r[y+0]=v.x,r[y+1]=v.y,r[y+2]=v.z}function h(){const _=new C;for(let v=0;v<r.length;v+=3){_.x=r[v+0],_.y=r[v+1],_.z=r[v+2];const y=m(_)/2/Math.PI+.5,w=f(_)/Math.PI+.5;o.push(y,1-w)}g(),u()}function u(){for(let _=0;_<o.length;_+=6){const v=o[_+0],y=o[_+2],w=o[_+4],E=Math.max(v,y,w),A=Math.min(v,y,w);E>.9&&A<.1&&(v<.2&&(o[_+0]+=1),y<.2&&(o[_+2]+=1),w<.2&&(o[_+4]+=1))}}function d(_){r.push(_.x,_.y,_.z)}function p(_,v){const y=_*3;v.x=t[y+0],v.y=t[y+1],v.z=t[y+2]}function g(){const _=new C,v=new C,y=new C,w=new C,E=new nt,A=new nt,L=new nt;for(let S=0,M=0;S<r.length;S+=9,M+=6){_.set(r[S+0],r[S+1],r[S+2]),v.set(r[S+3],r[S+4],r[S+5]),y.set(r[S+6],r[S+7],r[S+8]),E.set(o[M+0],o[M+1]),A.set(o[M+2],o[M+3]),L.set(o[M+4],o[M+5]),w.copy(_).add(v).add(y).divideScalar(3);const R=m(w);x(E,M+0,_,R),x(A,M+2,v,R),x(L,M+4,y,R)}}function x(_,v,y,w){w<0&&_.x===1&&(o[v]=_.x-1),y.x===0&&y.z===0&&(o[v]=w/2/Math.PI+.5)}function m(_){return Math.atan2(_.z,-_.x)}function f(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ho(t.vertices,t.indices,t.radius,t.details)}}class ad extends vh{constructor(t){super(t),this.uuid=xi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new vh().fromJSON(s))}return this}}const bv={triangulate:function(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=ld(i,0,s,e,!0);const o=[];if(!r||r.next===r.prev)return o;let a,l,c,h,u,d,p;if(n&&(r=Rv(i,t,r,e)),i.length>80*e){a=c=i[0],l=h=i[1];for(let g=e;g<s;g+=e)u=i[g],d=i[g+1],u<a&&(a=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);p=Math.max(c-a,h-l),p=p!==0?32767/p:0}return Fs(r,o,e,a,l,p,0),o}};function ld(i,t,e,n,s){let r,o;if(s===zv(i,t,e,n)>0)for(r=t;r<e;r+=n)o=xh(r,i[r],i[r+1],o);else for(r=e-n;r>=t;r-=n)o=xh(r,i[r],i[r+1],o);return o&&uo(o,o.next)&&(zs(o),o=o.next),o}function gi(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(uo(e,e.next)||me(e.prev,e,e.next)===0)){if(zs(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Fs(i,t,e,n,s,r,o){if(!i)return;!o&&r&&Iv(i,n,s,r);let a=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,r?Ev(i,n,s,r):wv(i)){t.push(l.i/e|0),t.push(i.i/e|0),t.push(c.i/e|0),zs(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=Tv(gi(i),t,e),Fs(i,t,e,n,s,r,2)):o===2&&Av(i,t,e,n,s,r):Fs(gi(i),t,e,n,s,r,1);break}}}function wv(i){const t=i.prev,e=i,n=i.next;if(me(t,e,n)>=0)return!1;const s=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,h=s<r?s<o?s:o:r<o?r:o,u=a<l?a<c?a:c:l<c?l:c,d=s>r?s>o?s:o:r>o?r:o,p=a>l?a>c?a:c:l>c?l:c;let g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=p&&Wi(s,a,r,l,o,c,g.x,g.y)&&me(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Ev(i,t,e,n){const s=i.prev,r=i,o=i.next;if(me(s,r,o)>=0)return!1;const a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,d=o.y,p=a<l?a<c?a:c:l<c?l:c,g=h<u?h<d?h:d:u<d?u:d,x=a>l?a>c?a:c:l>c?l:c,m=h>u?h>d?h:d:u>d?u:d,f=pl(p,g,t,e,n),_=pl(x,m,t,e,n);let v=i.prevZ,y=i.nextZ;for(;v&&v.z>=f&&y&&y.z<=_;){if(v.x>=p&&v.x<=x&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Wi(a,h,l,u,c,d,v.x,v.y)&&me(v.prev,v,v.next)>=0||(v=v.prevZ,y.x>=p&&y.x<=x&&y.y>=g&&y.y<=m&&y!==s&&y!==o&&Wi(a,h,l,u,c,d,y.x,y.y)&&me(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;v&&v.z>=f;){if(v.x>=p&&v.x<=x&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Wi(a,h,l,u,c,d,v.x,v.y)&&me(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;y&&y.z<=_;){if(y.x>=p&&y.x<=x&&y.y>=g&&y.y<=m&&y!==s&&y!==o&&Wi(a,h,l,u,c,d,y.x,y.y)&&me(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function Tv(i,t,e){let n=i;do{const s=n.prev,r=n.next.next;!uo(s,r)&&cd(s,n,n.next,r)&&Bs(s,r)&&Bs(r,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),zs(n),zs(n.next),n=i=r),n=n.next}while(n!==i);return gi(n)}function Av(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Ov(o,a)){let l=hd(o,a);o=gi(o,o.next),l=gi(l,l.next),Fs(o,t,e,n,s,r,0),Fs(l,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function Rv(i,t,e,n){const s=[];let r,o,a,l,c;for(r=0,o=t.length;r<o;r++)a=t[r]*n,l=r<o-1?t[r+1]*n:i.length,c=ld(i,a,l,n,!1),c===c.next&&(c.steiner=!0),s.push(Nv(c));for(s.sort(Cv),r=0;r<s.length;r++)e=Pv(s[r],e);return e}function Cv(i,t){return i.x-t.x}function Pv(i,t){const e=Lv(i,t);if(!e)return t;const n=hd(e,i);return gi(n,n.next),gi(e,e.next)}function Lv(i,t){let e=t,n=-1/0,s;const r=i.x,o=i.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=r&&d>n&&(n=d,s=e.x<e.next.x?e:e.next,d===r))return s}e=e.next}while(e!==t);if(!s)return null;const a=s,l=s.x,c=s.y;let h=1/0,u;e=s;do r>=e.x&&e.x>=l&&r!==e.x&&Wi(o<c?r:n,o,l,c,o<c?n:r,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(r-e.x),Bs(e,i)&&(u<h||u===h&&(e.x>s.x||e.x===s.x&&Dv(s,e)))&&(s=e,h=u)),e=e.next;while(e!==a);return s}function Dv(i,t){return me(i.prev,i,t.prev)<0&&me(t.next,i,i.next)<0}function Iv(i,t,e,n){let s=i;do s.z===0&&(s.z=pl(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Uv(s)}function Uv(i){let t,e,n,s,r,o,a,l,c=1;do{for(e=i,i=null,r=null,o=0;e;){for(o++,n=e,a=0,t=0;t<c&&(a++,n=n.nextZ,!!n);t++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,a--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;e=n}r.nextZ=null,c*=2}while(o>1);return i}function pl(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Nv(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Wi(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function Ov(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Fv(i,t)&&(Bs(i,t)&&Bs(t,i)&&Bv(i,t)&&(me(i.prev,i,t.prev)||me(i,t.prev,t))||uo(i,t)&&me(i.prev,i,i.next)>0&&me(t.prev,t,t.next)>0)}function me(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function uo(i,t){return i.x===t.x&&i.y===t.y}function cd(i,t,e,n){const s=wr(me(i,t,e)),r=wr(me(i,t,n)),o=wr(me(e,n,i)),a=wr(me(e,n,t));return!!(s!==r&&o!==a||s===0&&br(i,e,t)||r===0&&br(i,n,t)||o===0&&br(e,i,n)||a===0&&br(e,t,n))}function br(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function wr(i){return i>0?1:i<0?-1:0}function Fv(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&cd(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Bs(i,t){return me(i.prev,i,i.next)<0?me(i,t,i.next)>=0&&me(i,i.prev,t)>=0:me(i,t,i.prev)<0||me(i,i.next,t)<0}function Bv(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function hd(i,t){const e=new ml(i.i,i.x,i.y),n=new ml(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function xh(i,t,e,n){const s=new ml(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function zs(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function ml(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function zv(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}class Cs{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Cs.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];yh(t),Mh(n,t);let o=t.length;e.forEach(yh);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,Mh(n,e[l]);const a=bv.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}}function yh(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Mh(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class Wl extends Re{constructor(t=new ad([new nt(.5,.5),new nt(-.5,.5),new nt(-.5,-.5),new nt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let a=0,l=t.length;a<l;a++){const c=t[a];o(c)}this.setAttribute("position",new jt(s,3)),this.setAttribute("uv",new jt(r,2)),this.computeVertexNormals();function o(a){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,p=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:p-.1,x=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const f=e.extrudePath,_=e.UVGenerator!==void 0?e.UVGenerator:kv;let v,y=!1,w,E,A,L;f&&(v=f.getSpacedPoints(h),y=!0,d=!1,w=f.computeFrenetFrames(h,!1),E=new C,A=new C,L=new C),d||(m=0,p=0,g=0,x=0);const S=a.extractPoints(c);let M=S.shape;const R=S.holes;if(!Cs.isClockWise(M)){M=M.reverse();for(let j=0,rt=R.length;j<rt;j++){const D=R[j];Cs.isClockWise(D)&&(R[j]=D.reverse())}}const U=Cs.triangulateShape(M,R),B=M;for(let j=0,rt=R.length;j<rt;j++){const D=R[j];M=M.concat(D)}function X(j,rt,D){return rt||console.error("THREE.ExtrudeGeometry: vec does not exist"),j.clone().addScaledVector(rt,D)}const H=M.length,Z=U.length;function V(j,rt,D){let mt,tt,ht;const at=j.x-rt.x,Dt=j.y-rt.y,yt=D.x-j.x,P=D.y-j.y,b=at*at+Dt*Dt,k=at*P-Dt*yt;if(Math.abs(k)>Number.EPSILON){const $=Math.sqrt(b),Q=Math.sqrt(yt*yt+P*P),K=rt.x-Dt/$,Et=rt.y+at/$,ft=D.x-P/Q,Mt=D.y+yt/Q,qt=((ft-K)*P-(Mt-Et)*yt)/(at*P-Dt*yt);mt=K+at*qt-j.x,tt=Et+Dt*qt-j.y;const st=mt*mt+tt*tt;if(st<=2)return new nt(mt,tt);ht=Math.sqrt(st/2)}else{let $=!1;at>Number.EPSILON?yt>Number.EPSILON&&($=!0):at<-Number.EPSILON?yt<-Number.EPSILON&&($=!0):Math.sign(Dt)===Math.sign(P)&&($=!0),$?(mt=-Dt,tt=at,ht=Math.sqrt(b)):(mt=at,tt=Dt,ht=Math.sqrt(b/2))}return new nt(mt/ht,tt/ht)}const ct=[];for(let j=0,rt=B.length,D=rt-1,mt=j+1;j<rt;j++,D++,mt++)D===rt&&(D=0),mt===rt&&(mt=0),ct[j]=V(B[j],B[D],B[mt]);const ut=[];let xt,Nt=ct.concat();for(let j=0,rt=R.length;j<rt;j++){const D=R[j];xt=[];for(let mt=0,tt=D.length,ht=tt-1,at=mt+1;mt<tt;mt++,ht++,at++)ht===tt&&(ht=0),at===tt&&(at=0),xt[mt]=V(D[mt],D[ht],D[at]);ut.push(xt),Nt=Nt.concat(xt)}for(let j=0;j<m;j++){const rt=j/m,D=p*Math.cos(rt*Math.PI/2),mt=g*Math.sin(rt*Math.PI/2)+x;for(let tt=0,ht=B.length;tt<ht;tt++){const at=X(B[tt],ct[tt],mt);ot(at.x,at.y,-D)}for(let tt=0,ht=R.length;tt<ht;tt++){const at=R[tt];xt=ut[tt];for(let Dt=0,yt=at.length;Dt<yt;Dt++){const P=X(at[Dt],xt[Dt],mt);ot(P.x,P.y,-D)}}}const Zt=g+x;for(let j=0;j<H;j++){const rt=d?X(M[j],Nt[j],Zt):M[j];y?(A.copy(w.normals[0]).multiplyScalar(rt.x),E.copy(w.binormals[0]).multiplyScalar(rt.y),L.copy(v[0]).add(A).add(E),ot(L.x,L.y,L.z)):ot(rt.x,rt.y,0)}for(let j=1;j<=h;j++)for(let rt=0;rt<H;rt++){const D=d?X(M[rt],Nt[rt],Zt):M[rt];y?(A.copy(w.normals[j]).multiplyScalar(D.x),E.copy(w.binormals[j]).multiplyScalar(D.y),L.copy(v[j]).add(A).add(E),ot(L.x,L.y,L.z)):ot(D.x,D.y,u/h*j)}for(let j=m-1;j>=0;j--){const rt=j/m,D=p*Math.cos(rt*Math.PI/2),mt=g*Math.sin(rt*Math.PI/2)+x;for(let tt=0,ht=B.length;tt<ht;tt++){const at=X(B[tt],ct[tt],mt);ot(at.x,at.y,u+D)}for(let tt=0,ht=R.length;tt<ht;tt++){const at=R[tt];xt=ut[tt];for(let Dt=0,yt=at.length;Dt<yt;Dt++){const P=X(at[Dt],xt[Dt],mt);y?ot(P.x,P.y+v[h-1].y,v[h-1].x+D):ot(P.x,P.y,u+D)}}}Y(),it();function Y(){const j=s.length/3;if(d){let rt=0,D=H*rt;for(let mt=0;mt<Z;mt++){const tt=U[mt];Ct(tt[2]+D,tt[1]+D,tt[0]+D)}rt=h+m*2,D=H*rt;for(let mt=0;mt<Z;mt++){const tt=U[mt];Ct(tt[0]+D,tt[1]+D,tt[2]+D)}}else{for(let rt=0;rt<Z;rt++){const D=U[rt];Ct(D[2],D[1],D[0])}for(let rt=0;rt<Z;rt++){const D=U[rt];Ct(D[0]+H*h,D[1]+H*h,D[2]+H*h)}}n.addGroup(j,s.length/3-j,0)}function it(){const j=s.length/3;let rt=0;St(B,rt),rt+=B.length;for(let D=0,mt=R.length;D<mt;D++){const tt=R[D];St(tt,rt),rt+=tt.length}n.addGroup(j,s.length/3-j,1)}function St(j,rt){let D=j.length;for(;--D>=0;){const mt=D;let tt=D-1;tt<0&&(tt=j.length-1);for(let ht=0,at=h+m*2;ht<at;ht++){const Dt=H*ht,yt=H*(ht+1),P=rt+mt+Dt,b=rt+tt+Dt,k=rt+tt+yt,$=rt+mt+yt;It(P,b,k,$)}}}function ot(j,rt,D){l.push(j),l.push(rt),l.push(D)}function Ct(j,rt,D){Lt(j),Lt(rt),Lt(D);const mt=s.length/3,tt=_.generateTopUV(n,s,mt-3,mt-2,mt-1);Xt(tt[0]),Xt(tt[1]),Xt(tt[2])}function It(j,rt,D,mt){Lt(j),Lt(rt),Lt(mt),Lt(rt),Lt(D),Lt(mt);const tt=s.length/3,ht=_.generateSideWallUV(n,s,tt-6,tt-3,tt-2,tt-1);Xt(ht[0]),Xt(ht[1]),Xt(ht[3]),Xt(ht[1]),Xt(ht[2]),Xt(ht[3])}function Lt(j){s.push(l[j*3+0]),s.push(l[j*3+1]),s.push(l[j*3+2])}function Xt(j){r.push(j.x),r.push(j.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Hv(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,o=t.shapes.length;r<o;r++){const a=e[t.shapes[r]];n.push(a)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new fl[s.type]().fromJSON(s)),new Wl(n,t.options)}}const kv={generateTopUV:function(i,t,e,n,s){const r=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new nt(r,o),new nt(a,l),new nt(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){const o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],u=t[n*3+2],d=t[s*3],p=t[s*3+1],g=t[s*3+2],x=t[r*3],m=t[r*3+1],f=t[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new nt(o,1-l),new nt(c,1-u),new nt(d,1-g),new nt(x,1-f)]:[new nt(a,1-l),new nt(h,1-u),new nt(p,1-g),new nt(m,1-f)]}};function Hv(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class ge extends ho{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ge(t.radius,t.detail)}}class qs extends ho{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new qs(t.radius,t.detail)}}class fo extends Re{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],u=new C,d=new C,p=[],g=[],x=[],m=[];for(let f=0;f<=n;f++){const _=[],v=f/n;let y=0;f===0&&o===0?y=.5/e:f===n&&l===Math.PI&&(y=-.5/e);for(let w=0;w<=e;w++){const E=w/e;u.x=-t*Math.cos(s+E*r)*Math.sin(o+v*a),u.y=t*Math.cos(o+v*a),u.z=t*Math.sin(s+E*r)*Math.sin(o+v*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),m.push(E+y,1-v),_.push(c++)}h.push(_)}for(let f=0;f<n;f++)for(let _=0;_<e;_++){const v=h[f][_+1],y=h[f][_],w=h[f+1][_],E=h[f+1][_+1];(f!==0||o>0)&&p.push(v,y,E),(f!==n-1||l<Math.PI)&&p.push(y,w,E)}this.setIndex(p),this.setAttribute("position",new jt(g,3)),this.setAttribute("normal",new jt(x,3)),this.setAttribute("uv",new jt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new fo(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Gv extends Ke{static get type(){return"RawShaderMaterial"}constructor(t){super(t),this.isRawShaderMaterial=!0}}class Vv extends Jn{static get type(){return"MeshNormalMaterial"}constructor(t){super(),this.isMeshNormalMaterial=!0,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ul,this.normalScale=new nt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}}class Dn extends Jn{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Ft(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ft(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ul,this.normalScale=new nt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.combine=Tl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Xl extends Ee{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ft(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Wv extends Xl{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ee.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ft(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const $o=new oe,Sh=new C,bh=new C;class ud{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new nt(512,512),this.map=null,this.mapPass=null,this.matrix=new oe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ol,this._frameExtents=new nt(1,1),this._viewportCount=1,this._viewports=[new ie(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Sh.setFromMatrixPosition(t.matrixWorld),e.position.copy(Sh),bh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(bh),e.updateMatrixWorld(),$o.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix($o),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply($o)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const wh=new oe,fs=new C,Ko=new C;class Xv extends ud{constructor(){super(new $e(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new nt(4,2),this._viewportCount=6,this._viewports=[new ie(2,1,1,1),new ie(0,1,1,1),new ie(3,1,1,1),new ie(1,1,1,1),new ie(3,0,1,1),new ie(1,0,1,1)],this._cubeDirections=[new C(1,0,0),new C(-1,0,0),new C(0,0,1),new C(0,0,-1),new C(0,1,0),new C(0,-1,0)],this._cubeUps=[new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,0,1),new C(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),fs.setFromMatrixPosition(t.matrixWorld),n.position.copy(fs),Ko.copy(n.position),Ko.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Ko),n.updateMatrixWorld(),s.makeTranslation(-fs.x,-fs.y,-fs.z),wh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(wh)}}class qv extends Xl{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Xv}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class Yv extends ud{constructor(){super(new Fl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Eh extends Xl{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ee.DEFAULT_UP),this.updateMatrix(),this.target=new Ee,this.shadow=new Yv}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class $v{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Th(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=Th();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Th(){return performance.now()}const Ah=new oe;class Kv{constructor(t,e,n=0,s=1/0){this.ray=new Ws(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new ro,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Ah.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Ah),this}intersectObject(t,e=!0,n=[]){return gl(t,this,n,e),n.sort(Rh),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)gl(t[s],this,n,e);return n.sort(Rh),n}}function Rh(i,t){return i.distance-t.distance}function gl(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let o=0,a=r.length;o<a;o++)gl(r[o],t,e,!0)}}const Ch=new C,Er=new C;class ql{constructor(t=new C,e=new C){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){Ch.subVectors(t,this.start),Er.subVectors(this.end,this.start);const n=Er.dot(Er);let r=Er.dot(Ch)/n;return e&&(r=be(r,0,1)),r}closestPointToPoint(t,e,n){const s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}class Zv extends co{constructor(t=10,e=10,n=4473924,s=8947848){n=new Ft(n),s=new Ft(s);const r=e/2,o=t/e,a=t/2,l=[],c=[];for(let d=0,p=0,g=-a;d<=e;d++,g+=o){l.push(-a,0,g,a,0,g),l.push(g,0,-a,g,0,a);const x=d===r?n:s;x.toArray(c,p),p+=3,x.toArray(c,p),p+=3,x.toArray(c,p),p+=3,x.toArray(c,p),p+=3}const h=new Re;h.setAttribute("position",new jt(l,3)),h.setAttribute("color",new jt(c,3));const u=new kl({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class jv extends co{constructor(t=1){const e=[0,0,0,t,0,0,0,0,0,0,t,0,0,0,0,0,0,t],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new Re;s.setAttribute("position",new jt(e,3)),s.setAttribute("color",new jt(n,3));const r=new kl({vertexColors:!0,toneMapped:!1});super(s,r),this.type="AxesHelper"}setColors(t,e,n){const s=new Ft,r=this.geometry.attributes.color.array;return s.set(t),s.toArray(r,0),s.toArray(r,3),s.set(e),s.toArray(r,6),s.toArray(r,9),s.set(n),s.toArray(r,12),s.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:El}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=El);class Jv{renderer;scene;camera;onResize=null;canvas;handleResize=()=>this.resize();constructor(t){this.canvas=t,this.renderer=new sv({canvas:t,antialias:!1,powerPreference:"high-performance",stencil:!1}),this.renderer.setClearColor(657935,1),this.scene=new rv,this.camera=new $e(70,1,.1,500),this.resize(),window.addEventListener("resize",this.handleResize),window.addEventListener("orientationchange",this.handleResize)}resize(){const t=this.canvas.clientWidth||window.innerWidth,e=this.canvas.clientHeight||window.innerHeight;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(t,e,!1),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.onResize?.()}render(){this.renderer.render(this.scene,this.camera)}dispose(){window.removeEventListener("resize",this.handleResize),window.removeEventListener("orientationchange",this.handleResize),this.renderer.dispose()}}class Qv{subscribers=new Set;handle=0;last=0;elapsed=0;running=!1;add(t){return this.subscribers.add(t),()=>this.subscribers.delete(t)}start(){if(this.running)return;this.running=!0,this.last=performance.now();const t=e=>{this.handle=requestAnimationFrame(t);const n=Math.min((e-this.last)/1e3,.1);this.last=e,this.elapsed+=n;for(const s of this.subscribers)s(n,this.elapsed)};this.handle=requestAnimationFrame(t)}stop(){this.running&&(cancelAnimationFrame(this.handle),this.running=!1)}}const tx={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Ys{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const ex=new Fl(-1,1,1,-1,0,1);class nx extends Re{constructor(){super(),this.setAttribute("position",new jt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new jt([0,2,0,0,2,0],2))}}const ix=new nx;class Yl{constructor(t){this._mesh=new $t(ix,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,ex)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class dd extends Ys{constructor(t,e){super(),this.textureID=e!==void 0?e:"tDiffuse",t instanceof Ke?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=oo.clone(t.uniforms),this.material=new Ke({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new Yl(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class Ph extends Ys{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class sx extends Ys{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class rx{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new nt);this._width=n.width,this._height=n.height,e=new gn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:jn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new dd(tx),this.copyPass.material.blending=In,this.clock=new $v}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),o.needsSwap){if(n){const a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Ph!==void 0&&(o instanceof Ph?n=!0:o instanceof sx&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new nt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class ox extends Ys{constructor(t,e,n,s={}){super(),this.pixelSize=t,this.resolution=new nt,this.renderResolution=new nt,this.pixelatedMaterial=this.createPixelatedMaterial(),this.normalMaterial=new Vv,this.fsQuad=new Yl(this.pixelatedMaterial),this.scene=e,this.camera=n,this.normalEdgeStrength=s.normalEdgeStrength||.3,this.depthEdgeStrength=s.depthEdgeStrength||.4,this.beautyRenderTarget=new gn,this.beautyRenderTarget.texture.minFilter=we,this.beautyRenderTarget.texture.magFilter=we,this.beautyRenderTarget.texture.type=jn,this.beautyRenderTarget.depthTexture=new zl,this.normalRenderTarget=new gn,this.normalRenderTarget.texture.minFilter=we,this.normalRenderTarget.texture.magFilter=we,this.normalRenderTarget.texture.type=jn}dispose(){this.beautyRenderTarget.dispose(),this.normalRenderTarget.dispose(),this.pixelatedMaterial.dispose(),this.normalMaterial.dispose(),this.fsQuad.dispose()}setSize(t,e){this.resolution.set(t,e),this.renderResolution.set(t/this.pixelSize|0,e/this.pixelSize|0);const{x:n,y:s}=this.renderResolution;this.beautyRenderTarget.setSize(n,s),this.normalRenderTarget.setSize(n,s),this.fsQuad.material.uniforms.resolution.value.set(n,s,1/n,1/s)}setPixelSize(t){this.pixelSize=t,this.setSize(this.resolution.x,this.resolution.y)}render(t,e){const n=this.fsQuad.material.uniforms;n.normalEdgeStrength.value=this.normalEdgeStrength,n.depthEdgeStrength.value=this.depthEdgeStrength,t.setRenderTarget(this.beautyRenderTarget),t.render(this.scene,this.camera);const s=this.scene.overrideMaterial;t.setRenderTarget(this.normalRenderTarget),this.scene.overrideMaterial=this.normalMaterial,t.render(this.scene,this.camera),this.scene.overrideMaterial=s,n.tDiffuse.value=this.beautyRenderTarget.texture,n.tDepth.value=this.beautyRenderTarget.depthTexture,n.tNormal.value=this.normalRenderTarget.texture,this.renderToScreen?t.setRenderTarget(null):(t.setRenderTarget(e),this.clear&&t.clear()),this.fsQuad.render(t)}createPixelatedMaterial(){return new Ke({uniforms:{tDiffuse:{value:null},tDepth:{value:null},tNormal:{value:null},resolution:{value:new ie(this.renderResolution.x,this.renderResolution.y,1/this.renderResolution.x,1/this.renderResolution.y)},normalEdgeStrength:{value:0},depthEdgeStrength:{value:0}},vertexShader:`
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
			`})}}const ax={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class lx extends Ys{constructor(){super();const t=ax;this.uniforms=oo.clone(t.uniforms),this.material=new Gv({name:t.name,uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.fsQuad=new Yl(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},Kt.getTransfer(this._outputColorSpace)===ne&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Tu?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Au?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Ru?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Cu?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Pu?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Lu&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const Jr=16,cx={name:"RetroShader",uniforms:{tDiffuse:{value:null},uPixelSize:{value:1},uDither:{value:.06},uPattern:{value:1},uMatrix:{value:8},tDither:{value:null},uDitherSize:{value:64},uQuantize:{value:1},uLevels:{value:8},uPalette:{value:[]},uPaletteCount:{value:0},uVignette:{value:.35},uVignetteRadius:{value:.55},uVignetteSoftness:{value:.6}},vertexShader:`
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
    uniform vec3 uPalette[${Jr}];
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

      for (int i = 0; i < ${Jr}; i++) {
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
  `},Lh=1.9,Tr=5,hx=.1;function ux(i){let t=i>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function dx(i,t=2654435769){const e=i*i,n=new Uint8Array(e),s=new Float32Array(e),r=[],o=[];for(let f=-Tr;f<=Tr;f++)for(let _=-Tr;_<=Tr;_++)r.push(_,f),o.push(Math.exp(-(_*_+f*f)/(2*Lh*Lh)));const a=o.length,l=(f,_)=>{const v=f%i,y=f/i|0;for(let w=0;w<a;w++){const E=(v+r[w*2]+i)%i,A=(y+r[w*2+1]+i)%i;s[A*i+E]+=_*o[w]}},c=(f,_)=>{let v=-1,y=_?-1/0:1/0;for(let w=0;w<e;w++){if(n[w]!==f)continue;const E=s[w];(_?E>y:E<y)&&(y=E,v=w)}return v},h=ux(t),u=Math.max(1,Math.round(e*hx));let d=0;for(;d<u;){const f=h()*e|0;n[f]!==1&&(n[f]=1,l(f,1),d++)}for(let f=0;f<e*4;f++){const _=c(1,!0);n[_]=0,l(_,-1);const v=c(0,!1);if(v===_){n[_]=1,l(_,1);break}n[v]=1,l(v,1)}const p=n.slice(),g=s.slice(),x=new Int32Array(e).fill(-1);for(let f=u-1;f>=0;f--){const _=c(1,!0);n[_]=0,l(_,-1),x[_]=f}n.set(p),s.set(g);for(let f=u;f<e;f++){const _=c(0,!1);n[_]=1,l(_,1),x[_]=f}const m=new Uint8Array(new ArrayBuffer(e));for(let f=0;f<e;f++)m[f]=Math.min(255,(x[f]+.5)/e*256);return m}const fx=400,Zo={uniforms:{uHorizon:{value:new Ft},uZenith:{value:new Ft},uGround:{value:new Ft},uCurve:{value:1},uCloudColor:{value:new Ft},uCloudCover:{value:.5},uCloudSoftness:{value:.2},uCloudScale:{value:1.2},uCloudOpacity:{value:1},uCloudDrift:{value:.01},uTime:{value:0}},vertexShader:`
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
  `},fd={horizon:"#bcd4e6",zenith:"#3f7fbf",ground:"#5d6469",curve:.35,cloudColor:"#f2f5f8",cloudCover:.5,cloudSoftness:.22,cloudScale:1.1,cloudOpacity:.95,cloudDrift:.012};class px{mesh;material;constructor(){this.material=new Ke({name:"Sky",uniforms:oo.clone(Zo.uniforms),vertexShader:Zo.vertexShader,fragmentShader:Zo.fragmentShader,side:Be,depthWrite:!1,depthTest:!1,fog:!1}),this.mesh=new $t(new fo(fx,32,16),this.material),this.mesh.name="Sky",this.mesh.renderOrder=-1,this.mesh.frustumCulled=!1}apply(t){const e=this.material.uniforms;e.uHorizon.value.set(t.horizon),e.uZenith.value.set(t.zenith),e.uGround.value.set(t.ground),e.uCloudColor.value.set(t.cloudColor),e.uCurve.value=t.curve,e.uCloudCover.value=t.cloudCover,e.uCloudSoftness.value=t.cloudSoftness,e.uCloudScale.value=t.cloudScale,e.uCloudOpacity.value=t.cloudOpacity,e.uCloudDrift.value=t.cloudDrift}follow(t,e){this.mesh.position.setFromMatrixPosition(t.matrixWorld),this.material.uniforms.uTime.value=e}dispose(){this.mesh.geometry.dispose(),this.material.dispose()}}const $l="hswow.preset.";function mx(i){try{const t=window.localStorage.getItem($l+i);if(t===null)return null;const e=JSON.parse(t);return typeof e!="object"||e===null?null:e}catch{return null}}function gx(i,t){try{return window.localStorage.setItem($l+i,JSON.stringify(t)),!0}catch{return!1}}function _x(i){try{window.localStorage.removeItem($l+i)}catch{}}const _l=new Xs({vertexColors:!0,transparent:!0,blending:Ta,depthWrite:!1,side:an,fog:!1});function vx(i,t){const e=new $t(i,_l);return e.name=t,e.userData.noCollide=!0,e.renderOrder=2,e}const jo="render",Ar=64,xx=["#0a0a0f","#141a24","#1e2733","#2e3640","#3d4a54","#525f66","#6f7a7d","#8d9491","#b0b3a8","#dcdcc8","#3a2f28","#5c3a2e","#7a5238","#9a7248","#b08040","#c9a25e"],Dh={pixelSize:3,normalEdgeStrength:.3,depthEdgeStrength:.4,ditherScale:.6,ditherPattern:"bayer",ditherMatrix:8,quantize:"levels",levels:5,palette:[...xx],vignetteStrength:0,vignetteRadius:.5,vignetteSoftness:.7,sky:{...fd},linkFogToSky:!0,fogColor:"#bcd4e6",fogNear:25,fogFar:140},yx={off:0,levels:1,palette:2},Ih={bayer:0,blue:1,noise:2};class Mx{settings;viewport;composer;pixelPass;retroPass;sky=new px;paletteBuffer=new Float32Array(Jr*3);ditherTexture=null;air=null;constructor(t){this.viewport=t;const e=mx(jo)??{};this.settings={...Dh,...e,sky:{...fd,...e.sky}},t.scene.add(this.sky.mesh),this.hideGlowFromEdges(t.scene),this.composer=new rx(t.renderer),this.pixelPass=new ox(1,t.scene,t.camera),this.retroPass=new dd(cx),this.composer.addPass(this.pixelPass),this.composer.addPass(new lx),this.composer.addPass(this.retroPass),this.retroPass.uniforms.uPalette.value=this.paletteBuffer,this.retroPass.uniforms.uDitherSize.value=Ar,this.resize(),this.apply()}setEnvironment(t){this.air=t,this.apply()}apply(){const t=this.settings,e=this.viewport.renderer.getPixelRatio(),n=Math.max(1,Math.round(t.pixelSize*e));this.pixelPass.pixelSize!==n&&this.pixelPass.setPixelSize(n),this.pixelPass.normalEdgeStrength=t.normalEdgeStrength,this.pixelPass.depthEdgeStrength=t.depthEdgeStrength;const s=this.retroPass.uniforms;s.uPixelSize.value=n;const r=1/Math.max(t.levels-1,1);s.uDither.value=t.ditherScale*r,s.uPattern.value=Ih[t.ditherPattern]??Ih.bayer,s.uMatrix.value=t.ditherMatrix,t.ditherPattern==="blue"&&this.ensureBlueNoise(),s.uQuantize.value=yx[t.quantize],s.uLevels.value=t.levels,s.uVignette.value=t.vignetteStrength,s.uVignetteRadius.value=t.vignetteRadius,s.uVignetteSoftness.value=t.vignetteSoftness;const o=Math.min(t.palette.length,Jr);for(let l=0;l<o;l++)Sx(t.palette[l],this.paletteBuffer,l*3);s.uPaletteCount.value=o,this.sky.apply(t.sky),this.sky.mesh.visible=this.air===null||this.air.sky;const a=this.viewport.scene.fog;a instanceof lo&&(this.air&&!this.air.sky?a.color.set(this.air.fogColor):t.linkFogToSky?a.color.set(t.sky.horizon):a.color.set(this.air?.fogColor??t.fogColor),a.near=this.air?.fogNear??t.fogNear,a.far=this.air?.fogFar??t.fogFar,this.viewport.renderer.setClearColor(a.color,1))}hideGlowFromEdges(t){t.onBeforeRender=(e,n)=>{_l.visible=n.overrideMaterial===null}}ensureBlueNoise(){this.ditherTexture===null&&(this.ditherTexture=new ov(dx(Ar),Ar,Ar,Pl),this.ditherTexture.magFilter=we,this.ditherTexture.minFilter=we,this.ditherTexture.wrapS=Us,this.ditherTexture.wrapT=Us,this.ditherTexture.needsUpdate=!0,this.retroPass.uniforms.tDither.value=this.ditherTexture)}render(t){this.sky.follow(this.viewport.camera,t),this.composer.render()}resize(){const t=this.viewport.renderer.getSize(new nt);this.composer.setPixelRatio(this.viewport.renderer.getPixelRatio()),this.composer.setSize(t.x,t.y),this.apply()}save(){return gx(jo,this.settings)}reset(){_x(jo),Object.assign(this.settings,structuredClone(Dh)),this.apply()}dispose(){this.ditherTexture?.dispose(),this.viewport.scene.onBeforeRender=()=>{},_l.visible=!0,this.viewport.scene.remove(this.sky.mesh),this.sky.dispose(),this.composer.dispose()}}function Sx(i,t,e){const n=Number.parseInt(i.replace("#",""),16);t[e]=(n>>16&255)/255,t[e+1]=(n>>8&255)/255,t[e+2]=(n&255)/255}const Jo=new URLSearchParams(window.location.search),pd={debug:Jo.has("debug"),level:Jo.get("level")??"proving",touch:Jo.has("touch")},bx=["KeyW","ArrowUp"],wx=["KeyS","ArrowDown"],Ex=["KeyA","ArrowLeft"],Tx=["KeyD","ArrowRight"],Ax=["ShiftLeft","ShiftRight"],Uh=["Space"],Rx=["KeyE"],Rr=200,Cx=3e3,Px=120;class Lx{lookX=0;lookY=0;locked=!1;needsCapture;onLockChange=null;canvas;keys=new Set;stickX=0;stickZ=0;stickSprint=!1;jumpPressedAt=0;jumpHeld=!1;interactPressed=!1;settling=!1;relocking=!1;constructor(t){this.canvas=t,this.needsCapture=!md(),window.addEventListener("keydown",this.handleKeyDown),window.addEventListener("keyup",this.handleKeyUp),window.addEventListener("blur",this.handleBlur),this.needsCapture?(t.addEventListener("pointerdown",this.handleCanvasPointerDown),document.addEventListener("pointerlockchange",this.handleLockChange),document.addEventListener("mousemove",this.handleMouseMove)):this.locked=!0}get moveX(){const t=Nh(this.pressed(Tx),this.pressed(Ex));return Cr(t+this.stickX,-1,1)}get moveZ(){const t=Nh(this.pressed(bx),this.pressed(wx));return Cr(t+this.stickZ,-1,1)}get sprint(){return this.pressed(Ax)||this.stickSprint}get jumping(){return this.jumpHeld}takeJump(t){return this.jumpPressedAt===0||(performance.now()-this.jumpPressedAt)/1e3>t?!1:(this.jumpPressedAt=0,!0)}takeInteract(){return this.interactPressed?(this.interactPressed=!1,!0):!1}drainLook(t){t.x=this.lookX,t.y=this.lookY,this.lookX=0,this.lookY=0}setStick(t,e,n){this.stickX=t,this.stickZ=e,this.stickSprint=n}addLook(t,e){this.lookX+=t,this.lookY+=e}pressJump(){this.jumpPressedAt=performance.now(),this.jumpHeld=!0}releaseJump(){this.jumpHeld=!1}pressInteract(){this.interactPressed=!0}pressed(t){return t.some(e=>this.keys.has(e))}handleKeyDown=t=>{if(t.code==="Tab"&&this.locked){t.preventDefault();return}t.repeat||(this.keys.add(t.code),Uh.includes(t.code)&&(t.preventDefault(),this.pressJump()),Rx.includes(t.code)&&this.locked&&this.pressInteract())};handleKeyUp=t=>{this.keys.delete(t.code),Uh.includes(t.code)&&this.releaseJump()};handleBlur=()=>{this.keys.clear(),this.releaseJump()};handleCanvasPointerDown=t=>{this.locked||t.button!==0||this.requestLock()};async requestLock(){if(this.relocking)return;this.relocking=!0;const t=performance.now()+Cx;for(;!this.locked&&performance.now()<t;)await this.tryLock(),await Dx(Px);this.relocking=!1}async tryLock(){try{await this.canvas.requestPointerLock({unadjustedMovement:!0})}catch{try{await this.canvas.requestPointerLock()}catch{}}}handleLockChange=()=>{this.locked=document.pointerLockElement===this.canvas,this.locked||this.keys.clear(),this.lookX=0,this.lookY=0,this.settling=this.locked,this.onLockChange?.(this.locked)};handleMouseMove=t=>{if(this.locked){if(this.settling){this.settling=!1;return}this.lookX+=Cr(t.movementX,-Rr,Rr),this.lookY+=Cr(t.movementY,-Rr,Rr)}};dispose(){window.removeEventListener("keydown",this.handleKeyDown),window.removeEventListener("keyup",this.handleKeyUp),window.removeEventListener("blur",this.handleBlur),this.canvas.removeEventListener("pointerdown",this.handleCanvasPointerDown),document.removeEventListener("pointerlockchange",this.handleLockChange),document.removeEventListener("mousemove",this.handleMouseMove)}}function md(){return pd.touch||window.matchMedia("(pointer: coarse)").matches}function Dx(i){return new Promise(t=>window.setTimeout(t,i))}function Nh(i,t){return(i?1:0)-(t?1:0)}function Cr(i,t,e){return Math.min(Math.max(i,t),e)}class $s{constructor(t=new C(0,0,0),e=new C(0,1,0),n=1){this.start=t,this.end=e,this.radius=n}clone(){return new $s(this.start.clone(),this.end.clone(),this.radius)}set(t,e,n){this.start.copy(t),this.end.copy(e),this.radius=n}copy(t){this.start.copy(t.start),this.end.copy(t.end),this.radius=t.radius}getCenter(t){return t.copy(this.end).add(this.start).multiplyScalar(.5)}translate(t){this.start.add(t),this.end.add(t)}checkAABBAxis(t,e,n,s,r,o,a,l,c){return(r-t<c||r-n<c)&&(t-o<c||n-o<c)&&(a-e<c||a-s<c)&&(e-l<c||s-l<c)}intersectsBox(t){return this.checkAABBAxis(this.start.x,this.start.y,this.end.x,this.end.y,t.min.x,t.max.x,t.min.y,t.max.y,this.radius)&&this.checkAABBAxis(this.start.x,this.start.z,this.end.x,this.end.z,t.min.x,t.max.x,t.min.z,t.max.z,this.radius)&&this.checkAABBAxis(this.start.y,this.start.z,this.end.y,this.end.z,t.min.y,t.max.y,t.min.z,t.max.z,this.radius)}}const ps=new C,ms=new C,Pr=new C,gs=new C,hn=new Xn,Qo=new ql,Ix=new ql,Lr=new is,_s=new $s,Ux=new C,Nx=new C,Ox=new C,Fx=1e-10;function Bx(i,t,e=null,n=null){const s=Ux.copy(i.end).sub(i.start),r=Nx.copy(t.end).sub(t.start),o=Ox.copy(t.start).sub(i.start),a=s.dot(r),l=s.dot(s),c=r.dot(r),h=r.dot(o),u=s.dot(o);let d,p;const g=l*c-a*a;if(Math.abs(g)<Fx){const x=-h/c,m=(a-h)/c;Math.abs(x-.5)<Math.abs(m-.5)?(d=0,p=x):(d=1,p=m)}else d=(h*a+u*c)/g,p=(d*a-h)/c;p=Math.max(0,Math.min(1,p)),d=Math.max(0,Math.min(1,d)),e&&e.copy(s).multiplyScalar(d).add(i.start),n&&n.copy(r).multiplyScalar(p).add(t.start)}class Qr{constructor(t){this.box=t,this.bounds=new mi,this.subTrees=[],this.triangles=[],this.layers=new ro}addTriangle(t){return this.bounds.min.x=Math.min(this.bounds.min.x,t.a.x,t.b.x,t.c.x),this.bounds.min.y=Math.min(this.bounds.min.y,t.a.y,t.b.y,t.c.y),this.bounds.min.z=Math.min(this.bounds.min.z,t.a.z,t.b.z,t.c.z),this.bounds.max.x=Math.max(this.bounds.max.x,t.a.x,t.b.x,t.c.x),this.bounds.max.y=Math.max(this.bounds.max.y,t.a.y,t.b.y,t.c.y),this.bounds.max.z=Math.max(this.bounds.max.z,t.a.z,t.b.z,t.c.z),this.triangles.push(t),this}calcBox(){return this.box=this.bounds.clone(),this.box.min.x-=.01,this.box.min.y-=.01,this.box.min.z-=.01,this}split(t){if(!this.box)return;const e=[],n=ms.copy(this.box.max).sub(this.box.min).multiplyScalar(.5);for(let r=0;r<2;r++)for(let o=0;o<2;o++)for(let a=0;a<2;a++){const l=new mi,c=ps.set(r,o,a);l.min.copy(this.box.min).add(c.multiply(n)),l.max.copy(l.min).add(n),e.push(new Qr(l))}let s;for(;s=this.triangles.pop();)for(let r=0;r<e.length;r++)e[r].box.intersectsTriangle(s)&&e[r].triangles.push(s);for(let r=0;r<e.length;r++){const o=e[r].triangles.length;o>8&&t<16&&e[r].split(t+1),o!==0&&this.subTrees.push(e[r])}return this}build(){return this.calcBox(),this.split(0),this}getRayTriangles(t,e){for(let n=0;n<this.subTrees.length;n++){const s=this.subTrees[n];if(t.intersectsBox(s.box))if(s.triangles.length>0)for(let r=0;r<s.triangles.length;r++)e.indexOf(s.triangles[r])===-1&&e.push(s.triangles[r]);else s.getRayTriangles(t,e)}return e}triangleCapsuleIntersect(t,e){e.getPlane(hn);const n=hn.distanceToPoint(t.start)-t.radius,s=hn.distanceToPoint(t.end)-t.radius;if(n>0&&s>0||n<-t.radius&&s<-t.radius)return!1;const r=Math.abs(n/(Math.abs(n)+Math.abs(s))),o=ps.copy(t.start).lerp(t.end,r);if(e.containsPoint(o))return{normal:hn.normal.clone(),point:o.clone(),depth:Math.abs(Math.min(n,s))};const a=t.radius*t.radius,l=Qo.set(t.start,t.end),c=[[e.a,e.b],[e.b,e.c],[e.c,e.a]];for(let h=0;h<c.length;h++){const u=Ix.set(c[h][0],c[h][1]);if(Bx(l,u,Pr,gs),Pr.distanceToSquared(gs)<a)return{normal:Pr.clone().sub(gs).normalize(),point:gs.clone(),depth:t.radius-Pr.distanceTo(gs)}}return!1}triangleSphereIntersect(t,e){if(e.getPlane(hn),!t.intersectsPlane(hn))return!1;const n=Math.abs(hn.distanceToSphere(t)),s=t.radius*t.radius-n*n,r=hn.projectPoint(t.center,ps);if(e.containsPoint(t.center))return{normal:hn.normal.clone(),point:r.clone(),depth:Math.abs(hn.distanceToSphere(t))};const o=[[e.a,e.b],[e.b,e.c],[e.c,e.a]];for(let a=0;a<o.length;a++){Qo.set(o[a][0],o[a][1]),Qo.closestPointToPoint(r,!0,ms);const l=ms.distanceToSquared(t.center);if(l<s)return{normal:t.center.clone().sub(ms).normalize(),point:ms.clone(),depth:t.radius-Math.sqrt(l)}}return!1}getSphereTriangles(t,e){for(let n=0;n<this.subTrees.length;n++){const s=this.subTrees[n];if(t.intersectsBox(s.box))if(s.triangles.length>0)for(let r=0;r<s.triangles.length;r++)e.indexOf(s.triangles[r])===-1&&e.push(s.triangles[r]);else s.getSphereTriangles(t,e)}}getCapsuleTriangles(t,e){for(let n=0;n<this.subTrees.length;n++){const s=this.subTrees[n];if(t.intersectsBox(s.box))if(s.triangles.length>0)for(let r=0;r<s.triangles.length;r++)e.indexOf(s.triangles[r])===-1&&e.push(s.triangles[r]);else s.getCapsuleTriangles(t,e)}}sphereIntersect(t){Lr.copy(t);const e=[];let n,s=!1;this.getSphereTriangles(t,e);for(let r=0;r<e.length;r++)(n=this.triangleSphereIntersect(Lr,e[r]))&&(s=!0,Lr.center.add(n.normal.multiplyScalar(n.depth)));if(s){const r=Lr.center.clone().sub(t.center),o=r.length();return{normal:r.normalize(),depth:o}}return!1}capsuleIntersect(t){_s.copy(t);const e=[];let n,s=!1;this.getCapsuleTriangles(_s,e);for(let r=0;r<e.length;r++)(n=this.triangleCapsuleIntersect(_s,e[r]))&&(s=!0,_s.translate(n.normal.multiplyScalar(n.depth)));if(s){const r=_s.getCenter(new C).sub(t.getCenter(ps)),o=r.length();return{normal:r.normalize(),depth:o}}return!1}rayIntersect(t){if(t.direction.length()===0)return;const e=[];let n,s,r=1e100;this.getRayTriangles(t,e);for(let o=0;o<e.length;o++){const a=t.intersectTriangle(e[o].a,e[o].b,e[o].c,!0,ps);if(a){const l=a.sub(t.origin).length();r>l&&(s=a.clone().add(t.origin),r=l,n=e[o])}}return r<1e100?{distance:r,triangle:n,position:s}:!1}fromGraphNode(t){return t.updateWorldMatrix(!0,!0),t.traverse(e=>{if(e.isMesh===!0&&this.layers.test(e.layers)){let n,s=!1;e.geometry.index!==null?(s=!0,n=e.geometry.toNonIndexed()):n=e.geometry;const r=n.getAttribute("position");for(let o=0;o<r.count;o+=3){const a=new C().fromBufferAttribute(r,o),l=new C().fromBufferAttribute(r,o+1),c=new C().fromBufferAttribute(r,o+2);a.applyMatrix4(e.matrixWorld),l.applyMatrix4(e.matrixWorld),c.applyMatrix4(e.matrixWorld),this.addTriangle(new Qe(a,l,c))}s&&n.dispose()}}),this.build(),this}clear(){return this.box=null,this.bounds.makeEmpty(),this.subTrees.length=0,this.triangles.length=0,this}}const gd=1;function Se(i){return _d(i),i}function _d(i){if(i.userData.noCollide!==!0){i.layers.enable(gd);for(const t of i.children)_d(t)}}const Fi=[],ta=new C,vs=new C,ea=new C,Oh=new C,na=new C,Fh=new C,Gi=new C,Bh=new ql,ia={normal:new C,depth:0};class to{index={octree:new Qr,triangles:0};cache=new Map;build(t,e){if(e!==void 0){const s=this.cache.get(e);if(s){this.index=s;return}}const n=to.index(t);e!==void 0&&this.cache.set(e,n),this.index=n}warm(t,e){this.cache.has(e)||this.cache.set(e,to.index(t))}invalidate(t){this.cache.delete(t)}static index(t){const e=new Qr;return e.layers.disableAll(),e.layers.enable(gd),e.fromGraphNode(t),{octree:e,triangles:vd(e)}}get triangles(){return this.index.triangles}intersectCapsule(t){Fi.length=0,this.index.octree.getCapsuleTriangles(t,Fi);let e=0;for(const n of Fi){const s=zh(t,n);s<=e||(e=s,ia.normal.copy(Gi))}return e===0?null:(ia.depth=e,ia)}overlaps(t){Fi.length=0,this.index.octree.getCapsuleTriangles(t,Fi);for(const e of Fi)if(zh(t,e)>0)return!0;return!1}raycast(t,e){const n=this.index.octree.rayIntersect(new Ws(t,e));return n?n.distance:null}}function zh(i,t){t.getNormal(vs),ta.subVectors(i.end,i.start);const e=vs.dot(ta);let n=0;Math.abs(e)>1e-6&&(n=vs.dot(ea.subVectors(t.a,i.start))/e,n=Math.min(Math.max(n,0),1)),ea.copy(i.start).addScaledVector(ta,n),t.closestPointToPoint(ea,Oh),Bh.set(i.start,i.end),Bh.closestPointToPoint(Oh,!0,na),t.closestPointToPoint(na,Fh),Gi.subVectors(na,Fh);const s=Gi.length();return s>=i.radius||(s>1e-6?Gi.divideScalar(s):Gi.copy(vs),Gi.dot(vs)<=0)?0:i.radius-s}function vd(i){let t=i.triangles.length;for(const e of i.subTrees)t+=vd(e);return t}const sa=1/120,kh=16,zx=4,Dr=6,kx=.28,Hx={radius:.32,height:1.8,eyeHeight:1.62,walkSpeed:4.2,sprintScale:1.75,groundAccel:14,airAccel:7.5,friction:10,stopSpeed:1.6,gravity:26,jumpSpeed:7.2,coyoteTime:.22,jumpBuffer:.15,autoHop:!1,slopeLimitDeg:50,stepHeight:.45,lookSensitivity:.0022,invertY:!1,bobAmount:.02,bobSway:.012,bobRoll:.004,bobStepsPerSecond:1.9,bobSpeedInfluence:.5,firstStepFraction:.65,maxAirSpeed:1.12,fov:74,sprintFov:82,landDip:.02},un=new C,Hh=new C,Ir=new C,ra=new C,Gh=new C,Ur=new C,oa=new C,Gx=new C,Nr=new C,Vh=new C,on=new $s,aa={x:0,y:0};let Vx=class{tuning={...Hx};velocity=new C;onFootstep=null;onLand=null;onJump=null;camera;input;collider;capsule=new $s;yaw=0;pitch=0;sprintFov=!1;groundNormal=new C(0,1,0);wishX=0;wishZ=0;grounded=!1;jumped=!1;timeOffGround=0;timeSinceLand=1/0;bobPhase=0;strideProgress=.65;dip=0;accumulator=0;constructor(t,e,n){this.camera=t,this.input=e,this.collider=n,this.camera.rotation.order="YXZ",this.camera.fov=this.tuning.fov,this.camera.updateProjectionMatrix(),this.teleport(new C(0,2,6),0)}teleport(t,e=this.yaw){const{radius:n,height:s}=this.tuning;this.capsule.set(new C(t.x,t.y+n,t.z),new C(t.x,t.y+s-n,t.z),n),this.velocity.set(0,0,0),this.yaw=e,this.grounded=!1}get position(){return Gx.copy(this.capsule.start).setY(this.capsule.start.y-this.tuning.radius)}get heading(){return this.yaw}get isGrounded(){return this.grounded}get speed(){return Math.hypot(this.velocity.x,this.velocity.z)}update(t){this.applyLook(),this.accumulator+=t;let e=0;for(;this.accumulator>=sa&&e<kh;)this.step(sa),this.accumulator-=sa,e+=1;e===kh&&(this.accumulator=0),this.applyCamera(t)}applyLook(){this.input.drainLook(aa);const{lookSensitivity:t,invertY:e}=this.tuning;this.yaw-=aa.x*t,this.pitch-=aa.y*t*(e?-1:1);const n=Math.PI/2-.001;this.pitch=Math.min(Math.max(this.pitch,-n),n),this.yaw=this.yaw%(Math.PI*2)}step(t){const e=this.tuning;this.jumped=!1,this.grounded?(this.timeOffGround=0,this.timeSinceLand+=t,this.applyFriction(t)):(this.timeOffGround+=t,this.velocity.y-=e.gravity*t),this.applyWish(t),this.applyJump(),this.capAirSpeed();const n=this.grounded,s=-this.velocity.y;this.move(t),this.grounded&&!n&&(this.timeSinceLand=0,s>1&&(this.dip+=Math.min(s,18)*e.landDip,this.onLand?.(s))),this.advanceBob(t)}applyFriction(t){const e=this.tuning,n=this.velocity.length();if(n<1e-4){this.velocity.set(0,0,0);return}const s=Math.max(n,e.stopSpeed)*e.friction*t;this.velocity.multiplyScalar(Math.max(n-s,0)/n)}applyWish(t){const e=this.tuning,{moveX:n,moveZ:s}=this.input;Hh.set(-Math.sin(this.yaw),0,-Math.cos(this.yaw)),Ir.set(Math.cos(this.yaw),0,-Math.sin(this.yaw)),un.set(0,0,0).addScaledVector(Hh,s).addScaledVector(Ir,n);const r=un.length();if(r<1e-4){this.wishX=0,this.wishZ=0;return}if(un.divideScalar(r),this.wishX=un.x,this.wishZ=un.z,this.grounded){un.projectOnPlane(this.groundNormal);const h=un.length();if(h<1e-4)return;un.divideScalar(h)}const o=e.walkSpeed*Math.min(r,1)*(this.input.sprint?e.sprintScale:1),a=this.velocity.dot(un),l=o-a;if(l<=0)return;const c=this.grounded?e.groundAccel:e.airAccel;this.velocity.addScaledVector(un,Math.min(c*o*t,l))}capAirSpeed(){if(this.grounded)return;const t=this.tuning,e=t.walkSpeed*t.sprintScale*t.maxAirSpeed,n=Math.hypot(this.velocity.x,this.velocity.z);if(n<=e||n<1e-6)return;const s=e/n;this.velocity.x*=s,this.velocity.z*=s}applyJump(){const t=this.tuning;!(this.grounded||this.timeOffGround<t.coyoteTime)||!(this.input.takeJump(t.jumpBuffer)||t.autoHop&&this.input.jumping)||(this.velocity.y=t.jumpSpeed,this.grounded=!1,this.jumped=!0,this.timeSinceLand>kx&&this.onJump?.(),this.timeSinceLand=0,this.timeOffGround=t.coyoteTime)}move(t){const e=this.tuning;Gh.copy(this.velocity).multiplyScalar(t),oa.copy(this.capsule.start);const n=this.grounded,s=this.velocity.x,r=this.velocity.z;this.grounded=!1,this.capsule.translate(Gh),this.resolve(),n&&!this.grounded&&!this.jumped&&this.snapToGround(),!(e.stepHeight<=0||this.wishX===0&&this.wishZ===0||this.velocity.y>.1||(this.capsule.start.x-oa.x)*this.wishX+(this.capsule.start.z-oa.z)*this.wishZ>=e.walkSpeed*t*.5)&&this.tryStepUp(t)&&(this.velocity.x=s,this.velocity.z=r,this.velocity.y=0)}resolve(){const t=Math.cos(this.tuning.slopeLimitDeg*Math.PI/180);for(let e=0;e<zx;e++){const n=this.collider.intersectCapsule(this.capsule);if(!n)break;this.capsule.translate(ra.copy(n.normal).multiplyScalar(n.depth)),n.normal.y>t&&(this.grounded=!0,this.groundNormal.copy(n.normal));const s=this.velocity.dot(n.normal);s<0&&this.velocity.addScaledVector(n.normal,-s)}this.grounded||this.groundNormal.set(0,1,0)}snapToGround(){const t=this.tuning,e=Math.cos(t.slopeLimitDeg*Math.PI/180),n=Math.max(t.stepHeight,.05)/Dr;Ur.set(0,-n,0),on.copy(this.capsule);for(let s=0;s<Dr;s++){on.translate(Ur);const r=this.collider.intersectCapsule(on);if(r){if(r.normal.y<=e)return;on.translate(ra.set(0,n,0)),this.capsule.copy(on),this.grounded=!0,this.groundNormal.copy(r.normal);return}}}tryStepUp(t){const e=this.tuning,n=Math.max(e.walkSpeed*t,.02);if(Nr.set(this.capsule.start.x+this.wishX*n,this.capsule.start.y+e.stepHeight,this.capsule.start.z+this.wishZ*n),Vh.copy(Nr).setY(Nr.y+e.height-e.radius*2),on.set(Nr,Vh,e.radius),this.collider.overlaps(on))return!1;const s=e.stepHeight/Dr;Ur.set(0,-s,0);for(let r=0;r<Dr;r++)if(on.translate(Ur),this.collider.overlaps(on))return on.translate(ra.set(0,s,0)),this.capsule.copy(on),this.grounded=!0,this.groundNormal.set(0,1,0),!0;return!1}advanceBob(t){const e=this.tuning;if(!this.grounded)return;const n=this.speed;if(n<.15){this.bobPhase+=(Math.round(this.bobPhase)-this.bobPhase)*Math.min(t*8,1),this.strideProgress=e.firstStepFraction;return}const s=e.walkSpeed/Math.max(e.bobStepsPerSecond,.1),r=Math.max(.2,s*Math.pow(n/e.walkSpeed,1-e.bobSpeedInfluence));for(this.strideProgress+=n*t/r,this.bobPhase+=n*t/(r*2);this.strideProgress>=1;)this.strideProgress-=1,this.onFootstep?.(n)}applyCamera(t){const e=this.tuning,n=this.bobPhase*Math.PI*2;Ir.set(Math.cos(this.yaw),0,-Math.sin(this.yaw));const s=Math.min(this.speed/e.walkSpeed,1);this.dip=Math.max(this.dip-this.dip*Math.min(t*9,1),0);const r=this.capsule.start.y-e.radius;this.camera.position.set(this.capsule.start.x,r+e.eyeHeight-this.dip+Math.sin(n*2)*e.bobAmount*s,this.capsule.start.z),this.camera.position.addScaledVector(Ir,Math.sin(n)*e.bobSway*s),this.camera.rotation.set(this.pitch,this.yaw,Math.sin(n)*e.bobRoll*s),this.sprintFov?(!this.input.sprint||this.speed<.4)&&(this.sprintFov=!1):this.input.sprint&&this.speed>1.2&&(this.sprintFov=!0);const o=this.sprintFov?e.sprintFov:e.fov,a=qf.damp(this.camera.fov,o,6,t);Math.abs(a-this.camera.fov)>.001&&(this.camera.fov=a,this.camera.updateProjectionMatrix())}};const Bi=64,Wx=.85,Wh=2.2;class Xx{input;root;stickBase;stickKnob;jumpPad;stick=null;lookPointer=null;lastLookX=0;lastLookY=0;constructor(t,e){this.input=t,this.root=document.createElement("div"),this.root.className="touch",this.stickBase=document.createElement("div"),this.stickBase.className="touch-stick",this.stickKnob=document.createElement("div"),this.stickKnob.className="touch-stick-knob",this.stickBase.appendChild(this.stickKnob),this.jumpPad=document.createElement("div"),this.jumpPad.className="touch-jump",this.jumpPad.textContent="↑",this.root.append(this.stickBase,this.jumpPad),e.appendChild(this.root),this.root.addEventListener("pointerdown",this.handleDown),window.addEventListener("pointermove",this.handleMove),window.addEventListener("pointerup",this.handleUp),window.addEventListener("pointercancel",this.handleUp),this.jumpPad.addEventListener("pointerdown",this.handleJumpDown),this.jumpPad.addEventListener("pointerup",this.handleJumpUp),this.jumpPad.addEventListener("pointercancel",this.handleJumpUp)}handleDown=t=>{const e=t.clientX<window.innerWidth/2;if(e&&this.stick===null){this.stick={pointerId:t.pointerId,originX:t.clientX,originY:t.clientY},this.stickBase.style.left=`${t.clientX}px`,this.stickBase.style.top=`${t.clientY}px`,this.stickBase.classList.add("is-active"),this.updateStick(t.clientX,t.clientY);return}!e&&this.lookPointer===null&&(this.lookPointer=t.pointerId,this.lastLookX=t.clientX,this.lastLookY=t.clientY)};handleMove=t=>{if(this.stick?.pointerId===t.pointerId){this.updateStick(t.clientX,t.clientY);return}this.lookPointer===t.pointerId&&(this.input.addLook((t.clientX-this.lastLookX)*Wh,(t.clientY-this.lastLookY)*Wh),this.lastLookX=t.clientX,this.lastLookY=t.clientY)};handleUp=t=>{this.stick?.pointerId===t.pointerId&&(this.stick=null,this.input.setStick(0,0,!1),this.stickBase.classList.remove("is-active"),this.stickKnob.style.transform="translate(-50%, -50%)"),this.lookPointer===t.pointerId&&(this.lookPointer=null)};handleJumpDown=t=>{t.stopPropagation(),this.jumpPad.classList.add("is-active"),this.input.pressJump()};handleJumpUp=()=>{this.jumpPad.classList.remove("is-active"),this.input.releaseJump()};updateStick(t,e){if(!this.stick)return;let n=t-this.stick.originX,s=e-this.stick.originY;const r=Math.hypot(n,s);if(r>Bi){const a=Bi/r;n*=a,s*=a}this.stickKnob.style.transform=`translate(calc(-50% + ${n}px), calc(-50% + ${s}px))`;const o=Math.min(r,Bi)/Bi;this.input.setStick(n/Bi,-s/Bi,o>Wx)}dispose(){this.root.removeEventListener("pointerdown",this.handleDown),window.removeEventListener("pointermove",this.handleMove),window.removeEventListener("pointerup",this.handleUp),window.removeEventListener("pointercancel",this.handleUp),this.root.remove()}}function qx(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new Re;let c=0;for(let h=0;h<i.length;++h){const u=i[h];let d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const p in u.attributes){if(!n.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(u.attributes[p]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const p in u.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[p]===void 0&&(o[p]=[]),o[p].push(u.morphAttributes[p])}if(t){let p;if(e)p=u.index.count;else if(u.attributes.position!==void 0)p=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,p,h),c+=p}}if(e){let h=0;const u=[];for(let d=0;d<i.length;++d){const p=i[d].index;for(let g=0;g<p.count;++g)u.push(p.getX(g)+h);h+=i[d].attributes.position.count}l.setIndex(u)}for(const h in r){const u=Xh(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(const h in o){const u=o[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){const p=[];for(let x=0;x<o[h].length;++x)p.push(o[h][x][d]);const g=Xh(p);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}return l}function Xh(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){const h=i[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const o=new t(r),a=new Ve(o,e,n);let l=0;for(let c=0;c<i.length;++c){const h=i[c];if(h.isInterleavedBufferAttribute){const u=l/e;for(let d=0,p=h.count;d<p;d++)for(let g=0;g<e;g++){const x=h.getComponent(d,g);a.setComponent(d+u,g,x)}}else o.set(h.array,l);l+=h.count*e}return s!==void 0&&(a.gpuType=s),a}function Kl(i,t=1e-4){t=Math.max(t,Number.EPSILON);const e={},n=i.getIndex(),s=i.getAttribute("position"),r=n?n.count:s.count;let o=0;const a=Object.keys(i.attributes),l={},c={},h=[],u=["getX","getY","getZ","getW"],d=["setX","setY","setZ","setW"];for(let _=0,v=a.length;_<v;_++){const y=a[_],w=i.attributes[y];l[y]=new w.constructor(new w.array.constructor(w.count*w.itemSize),w.itemSize,w.normalized);const E=i.morphAttributes[y];E&&(c[y]||(c[y]=[]),E.forEach((A,L)=>{const S=new A.array.constructor(A.count*A.itemSize);c[y][L]=new A.constructor(S,A.itemSize,A.normalized)}))}const p=t*.5,g=Math.log10(1/t),x=Math.pow(10,g),m=p*x;for(let _=0;_<r;_++){const v=n?n.getX(_):_;let y="";for(let w=0,E=a.length;w<E;w++){const A=a[w],L=i.getAttribute(A),S=L.itemSize;for(let M=0;M<S;M++)y+=`${~~(L[u[M]](v)*x+m)},`}if(y in e)h.push(e[y]);else{for(let w=0,E=a.length;w<E;w++){const A=a[w],L=i.getAttribute(A),S=i.morphAttributes[A],M=L.itemSize,R=l[A],I=c[A];for(let U=0;U<M;U++){const B=u[U],X=d[U];if(R[X](o,L[B](v)),S)for(let H=0,Z=S.length;H<Z;H++)I[H][X](o,S[H][B](v))}}e[y]=o,h.push(o),o++}}const f=i.clone();for(const _ in i.attributes){const v=l[_];if(f.setAttribute(_,new v.constructor(v.array.slice(0,o*v.itemSize),v.itemSize,v.normalized)),_ in c)for(let y=0;y<c[_].length;y++){const w=c[_][y];f.morphAttributes[_][y]=new w.constructor(w.array.slice(0,o*w.itemSize),w.itemSize,w.normalized)}}return f.setIndex(h),f}const xd="sway",Yx=new Dn({vertexColors:!0,flatShading:!0});function ce(i){const t=i.map(n=>{const s=n.geometry,r=s.index===null?s:s.toNonIndexed();r!==s&&s.dispose(),r.deleteAttribute("uv");const o=r.getAttribute("position"),a=o.count,l=new Float32Array(a*3),c=new Ft;if(typeof n.color=="function")for(let u=0;u<a;u+=3){const d=(o.getX(u)+o.getX(u+1)+o.getX(u+2))/3,p=(o.getY(u)+o.getY(u+1)+o.getY(u+2))/3,g=(o.getZ(u)+o.getZ(u+1)+o.getZ(u+2))/3;c.set(n.color(d,p,g)),c.toArray(l,u*3),c.toArray(l,(u+1)*3),c.toArray(l,(u+2)*3)}else{c.set(n.color);for(let u=0;u<a;u++)c.toArray(l,u*3)}r.setAttribute("color",new Ve(l,3));const h=new Float32Array(a);if(typeof n.sway=="function")for(let u=0;u<a;u++)h[u]=vl(n.sway(o.getX(u),o.getY(u),o.getZ(u)));else n.sway&&h.fill(vl(n.sway));return r.setAttribute(xd,new Ve(h,1)),r.getAttribute("normal")||r.computeVertexNormals(),r}),e=qx(t,!1);for(const n of t)n.dispose();if(!e)throw new Error("assemble: geometries did not share an attribute set");return e}function he(i,t,e){const n=new $t(i,Yx);return n.name=t,n.userData.swayPhase=e,n}function qh(i,t,e=1.6){return(n,s)=>{const r=vl((s-i)/Math.max(t-i,1e-6));return(r*r*(3-2*r))**e}}function vl(i){return i>0?i<1?i:1:0}function se(i){let t=i>>>0||2654435769;t=Math.imul(t^t>>>16,73244475),t=Math.imul(t^t>>>16,73244475),t=(t^t>>>16)>>>0;const e=()=>{t=t+1831565813>>>0;let s=t;return s=Math.imul(s^s>>>15,s|1),s^=s+Math.imul(s^s>>>7,s|61),((s^s>>>14)>>>0)/4294967296},n=e;return n.range=(s,r)=>s+e()*(r-s),n.int=(s,r)=>Math.floor(s+e()*(r-s+1)),n.chance=s=>e()<s,n.pick=s=>s[Math.floor(e()*s.length)],n.around=(s,r)=>s+(e()*2-1)*r,n}const z={BARK:4602672,BARK_PALE:5720636,LEAF:5201977,LEAF_DARK:4017196,LEAF_DRY:7039548,GRASS:6056762,GRASS_DRY:8025156,STONE:6975348,STONE_DARK:5001559,STONE_PALE:8883343,EARTH:4998454,TIMBER:6245431,TIMBER_DARK:4536103,IRON:5922659,RUST:8014384,LAMPLIGHT:16769192,CLOTH:9274994,SKIN:11047546,HIDE:7165505,HIDE_DARK:4273193,HIDE_PALE:10653813,WOOL:12433060,HOG:11042938,FOWL:10260343,COMB:10240564,MARKER_YELLOW:13213770,COW_BLACK:2367775};function xe(i,t){const e=Math.min(255,Math.round((i>>16&255)*t)),n=Math.min(255,Math.round((i>>8&255)*t)),s=Math.min(255,Math.round((i&255)*t));return e<<16|n<<8|s}const Zl={name:"tree",category:"foliage",radius:2.2,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.range(3.2,4.6),r=e.range(0,Math.PI*2),o=s*e.range(.55,.68),a=new zt(e.range(.11,.17),e.range(.24,.34),o,6);a.translate(0,o/2,0),n.push({geometry:a,color:z.BARK,sway:qh(0,s,2.2)});const l=e.int(2,4);for(let d=0;d<l;d++){const p=o*e.range(.6,.95),g=e.range(.7,1.3),x=new zt(.045,.09,g,4);x.translate(0,g/2,0),x.rotateZ(e.range(.5,1.05)),x.rotateY(r+d/l*Math.PI*2+e.around(0,.4)),x.translate(0,p,0),n.push({geometry:x,color:z.BARK_PALE,sway:qh(0,s,1.4)})}const c=e.int(3,5),h=o+e.range(.3,.7);for(let d=0;d<c;d++){const p=e.range(.75,1.35),g=new ge(p,0);g.rotateX(e.range(0,Math.PI)),g.rotateY(e.range(0,Math.PI)),g.scale(1,e.range(.72,.95),1);const x=e.range(0,.95),m=r+d/c*Math.PI*2+e.around(0,.5);g.translate(Math.cos(m)*x,h+e.around(0,.45),Math.sin(m)*x),n.push({geometry:g,color:e.chance(.25)?z.LEAF_DARK:z.LEAF,sway:e.range(.82,1)})}const u=ce(n);return t!==1&&u.scale(t,t,t),he(u,"tree",e()*Math.PI*2)}},$x=Object.freeze(Object.defineProperty({__proto__:null,tree:Zl},Symbol.toStringTag,{value:"Module"})),ks={name:"bush",category:"foliage",radius:1,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.int(3,5),r=e.range(.35,.7);for(let a=0;a<s;a++){const l=e.range(.3,.62),c=new ge(l,0);c.rotateX(e.range(0,Math.PI)),c.rotateY(e.range(0,Math.PI)),c.scale(1,e.range(.6,.85),1);const h=a/s*Math.PI*2+e.around(0,.6),u=e.range(0,r),d=l*e.range(.55,.85);c.translate(Math.cos(h)*u,d,Math.sin(h)*u),n.push({geometry:c,color:e.chance(.2)?z.LEAF_DRY:z.LEAF,sway:(p,g)=>Math.min(1,.35+g*.75)})}const o=ce(n);return t!==1&&o.scale(t,t,t),he(o,"bush",e()*Math.PI*2)}},Kx=Object.freeze(Object.defineProperty({__proto__:null,bush:ks},Symbol.toStringTag,{value:"Module"})),Yh={ground:"#4c4536",cube:"#525f66",marker:"#b08040",ramp:"#38474a",stair:"#3d4b52",platform:"#46505c",wall:"#2e3640",metal:"#6a6f74",creature:"#b8a06a"},Or=208,$h=52,Zx=7037511,jx=3814695,Jx=14474440,Qx=6044206,ty=new C(0,.1,10);function fe(i,t,e,n,s,r,o){const a=new $t(new et(i,t,e),n);return a.position.set(s,r+t/2,o),a}function ey(i,t,e,n){const s=new ad;s.moveTo(0,0),s.lineTo(t,0),s.lineTo(t,t*Math.tan(e*Math.PI/180)),s.closePath();const r=new Wl(s,{depth:i,bevelEnabled:!1});return r.translate(0,0,-i/2),r.rotateY(Math.PI/2),new $t(r,n)}function la(i,t,e,n,s,r){const a=new $n(i,t,96,1),l=a.getAttribute("position"),c=new Float32Array(l.count*3),h=new Ft;for(let d=0;d<l.count;d++){const p=l.getX(d)/i+.5,[g,x,m]=r(Math.min(Math.max(p,0),1));h.setRGB(g,x,m,Ye),h.toArray(c,d*3)}a.setAttribute("color",new Ve(c,3));const u=new $t(a,new Xs({vertexColors:!0}));return u.position.set(e,n,s),u}class ny{root=new Pe;colors={...Yh};materials={};anchors={tree:new C(14,3.6,12),bush:new C(10.5,.5,15.5),bird:new C(14.9,4.1,11.4),machine:new C(22,1.1,-12)};rooms=[{name:"hall",min:new C(15,0,-18),max:new C(29,7,-4)},{name:"cell",min:new C(19,0,-4),max:new C(27,3,4)}];wheel=null;constructor(){this.root.name="ProvingGround";for(const t of Object.keys(this.colors))this.materials[t]=new Dn({color:this.colors[t],flatShading:!0});this.addGround(),this.addHeightReference(),this.addMeasuredCubes(),this.addDistanceMarkers(),this.addMovementGym(),this.addCalibrationBoard(),this.addSoundGarden(),this.addRooms()}update(t,e){this.wheel&&(this.wheel.rotation.z+=e/60*Math.PI*2*t)}roomAt(t){for(const e of this.rooms)if(t.x>e.min.x&&t.x<e.max.x&&t.z>e.min.z&&t.z<e.max.z&&t.y<e.max.y)return e.name;return null}applyColors(){for(const t of Object.keys(this.colors))this.materials[t].color.set(this.colors[t])}resetColors(){Object.assign(this.colors,Yh),this.applyColors()}addGround(){const t=new $t(new $n(Or,Or,$h,$h),this.materials.ground);t.rotation.x=-Math.PI/2,t.position.y=-.01,this.root.add(Se(t)),this.root.add(new Zv(Or,Or,Zx,jx)),this.root.add(new jv(2))}addHeightReference(){const t=new Pe,e=.3,n=6;for(let s=0;s<n;s++){const r=new $t(new et(.08,e,.08),new Dn({color:s%2===0?Jx:Qx,flatShading:!0}));r.position.y=e*(s+.5),t.add(r)}t.position.set(-2,0,0),this.root.add(t)}addMeasuredCubes(){const t=[1,2,4];let e=4;for(const n of t)this.root.add(Se(fe(n,n,n,this.materials.cube,e+n/2,0,0))),e+=n+1}addDistanceMarkers(){for(const t of[5,10,20,30])this.root.add(Se(fe(.1,2,.1,this.materials.marker,0,0,-t)))}addMovementGym(){const t=new Pe;t.name="MovementGym",this.addRamps(t),this.addStairs(t),this.addKerbs(t),this.addJumpGaps(t),this.addStrafeWall(t),this.addFallWalkway(t),this.root.add(Se(t))}addRamps(t){const e=[10,20,30,45],n=4;e.forEach((s,r)=>{const o=ey(2.5,n,s,this.materials.ramp);o.position.set(-6-r*4,0,-2),t.add(o);const a=n*Math.tan(s*Math.PI/180);t.add(fe(2.5,.2,2,this.materials.ramp,-6-r*4,a-.2,-7))})}addStairs(t){const e=[{rise:.18,run:.3,x:-24},{rise:.3,run:.3,x:-28}];for(const n of e)for(let s=0;s<8;s++){const r=n.rise*(s+1);t.add(fe(2.5,r,n.run,this.materials.stair,n.x,0,-2-s*n.run))}}addKerbs(t){[.2,.35,.5,.9].forEach((e,n)=>{t.add(fe(3,e,2,this.materials.platform,-8-n*4,0,5))})}addJumpGaps(t){const e=[1.5,2.5,3.5],n=3,s=1.2;let r=18;t.add(fe(3,s,n,this.materials.platform,-26,0,r));for(const o of e)r-=n+o,t.add(fe(3,s,n,this.materials.platform,-26,0,r))}addStrafeWall(t){t.add(fe(.4,3,16,this.materials.wall,-4,0,8)),t.add(fe(6,3,.4,this.materials.wall,-7,0,15.8))}addFallWalkway(t){t.add(fe(2.5,.2,8,this.materials.platform,-18,3.8,-12))}addCalibrationBoard(){const t=new Pe;t.name="CalibrationBoard";const e=7,n=-12;t.add(Se(fe(12,6,.3,this.materials.wall,e,0,n)));const s=[[16711680,65280,255,16777215],[65535,16711935,16776960,0],[3355443,6710886,10066329,13421772],[9278609,6044206,11567168,3028544]],r=.9;s.forEach((c,h)=>{c.forEach((u,d)=>{const p=new $t(new $n(r,r),new Xs({color:u}));p.position.set(e-4.6+d*(r+.15),5.1-h*(r+.15),n+.16),t.add(p)})}),t.add(la(5.2,.7,e+2.6,4.3,n+.16,c=>[c,c,c])),t.add(la(5.2,.7,e+2.6,3.4,n+.16,c=>[c,c*.35,.12])),t.add(la(5.2,.7,e+2.6,2.5,n+.16,c=>[.1,c*.6,c]));const o=new $t(new fo(1.1,48,32),new Dn({color:9278609}));o.position.set(e-8.5,1.1,n),t.add(Se(o));const a=Math.PI/6,l=new $t(new $n(6,4),new Dn({color:7305853,side:an}));l.position.set(e-13.5,2*Math.cos(a),n),l.rotation.x=-a,t.add(Se(l)),this.root.add(t)}addSoundGarden(){const t=new Pe;t.name="SoundGarden";const e=Zl.build({seed:4021});e.position.set(this.anchors.tree.x,0,this.anchors.tree.z),t.add(Se(e)),e.geometry.computeBoundingBox();const n=e.geometry.boundingBox;n&&(this.anchors.tree.setY(n.max.y*.75),this.anchors.bird.set(this.anchors.tree.x+n.max.x*.45,n.max.y*.66,this.anchors.tree.z+n.max.z*.3));const s=ks.build({seed:771});s.position.set(this.anchors.bush.x,0,this.anchors.bush.z),t.add(s);const r=ks.build({seed:9114,scale:.8});r.position.set(9.2,0,16.8),t.add(r),t.add(this.bird()),t.add(this.machine()),this.root.add(t)}bird(){const t=new Pe,e=this.anchors.bird,n=new $t(new ge(.16,0),this.materials.creature);n.position.copy(e),n.scale.set(1,.85,1.3);const s=new $t(new Le(.045,.14,4),this.materials.marker);s.position.set(e.x,e.y+.02,e.z+.2),s.rotation.x=Math.PI/2;const r=new $t(new Le(.07,.26,4),this.materials.creature);return r.position.set(e.x,e.y+.03,e.z-.22),r.rotation.x=-Math.PI/2,t.add(n,s,r),t}machine(){const t=new Pe,e=this.anchors.machine;t.add(Se(fe(1.8,1.6,1.2,this.materials.metal,e.x,0,e.z))),this.wheel=new $t(new zt(.7,.7,.16,12),this.materials.metal),this.wheel.position.set(e.x+1.05,1.2,e.z),this.wheel.rotation.x=Math.PI/2,t.add(this.wheel);for(let s=0;s<4;s++){const r=new $t(new et(.1,1.3,.08),this.materials.marker);r.rotation.z=s/4*Math.PI,this.wheel.add(r)}const n=new $t(new zt(.14,.14,2.6,8),this.materials.metal);return n.position.set(e.x-.6,2.4,e.z),t.add(n),t}addRooms(){const t=new Pe;t.name="Rooms";const e=.4,n=this.materials.wall;t.add(fe(14+e*2,7,e,n,22,0,-18-e/2)),t.add(fe(e,7,14,n,15-e/2,0,-11)),t.add(fe(e,7,14,n,29+e/2,0,-11)),t.add(fe(14+e*2,e,14+e*2,n,22,7,-11)),t.add(fe(7,7,e,n,18.5,0,-4)),t.add(fe(5,7,e,n,26.5,0,-4)),t.add(fe(2,4.6,e,n,23,2.4,-4)),t.add(fe(e,3,8,n,19-e/2,0,0)),t.add(fe(e,3,8,n,27+e/2,0,0)),t.add(fe(8+e*2,e,8,n,23,3,0)),t.add(fe(3,3,e,n,20.5,0,4)),t.add(fe(3,3,e,n,25.5,0,4)),t.add(fe(2,.6,e,n,23,2.4,4)),this.root.add(Se(t))}dispose(){this.root.traverse(t=>{if(t instanceof $t||t instanceof co||t instanceof cv){t.geometry.dispose();const e=t.material;if(Array.isArray(e))for(const n of e)n.dispose();else e.dispose()}}),this.root.clear()}}const ca=2e4,iy=420,sy=.32,ry=.08,ha=.5;class Fr{position=new C;enabled=!0;engine;model;absorption;occlusion;panner;sendGain;maxDistance;reverb;occluded=!1;virtual=!1;constructor(t,e,n){this.engine=t,this.model=e,this.position.copy(n.position),this.maxDistance=n.maxDistance??60,this.reverb=n.reverb??1;const s=t.context;this.absorption=s.createBiquadFilter(),this.absorption.type="lowpass",this.absorption.frequency.value=ca,this.occlusion=s.createGain(),this.panner=s.createPanner(),this.panner.panningModel="HRTF",this.panner.distanceModel="inverse",this.panner.refDistance=n.refDistance??1.5,this.panner.maxDistance=this.maxDistance,this.panner.rolloffFactor=n.rolloff??1.1,n.direction&&(this.panner.coneInnerAngle=n.coneInner??90,this.panner.coneOuterAngle=n.coneOuter??240,this.panner.coneOuterGain=n.coneOuterGain??.35,oy(this.panner,n.direction)),Kh(this.panner,this.position),this.sendGain=s.createGain(),this.sendGain.gain.value=this.reverb,e.output.connect(this.absorption),this.absorption.connect(this.occlusion),this.occlusion.connect(this.panner),this.panner.connect(t.dry),this.panner.connect(this.sendGain),this.sendGain.connect(t.send)}moveTo(t){this.position.copy(t),Kh(this.panner,this.position)}update(t,e,n){const s=this.position.distanceTo(this.engine.listenerPosition),r=s>this.maxDistance;if(r!==this.virtual&&(this.virtual=r,this.model.setActive?.(!r)),this.virtual||!this.enabled){this.glide(this.occlusion.gain,0);return}this.model.update?.(t,this.engine),n&&(this.occluded=this.testOcclusion(e,s));const o=this.engine.settings,a=Math.min(s/this.maxDistance,1),l=ca*(1-o.airAbsorption*Math.sqrt(a)*.94),c=this.occluded?o.occlusion:0,h=Math.min(l,Zh(ca,iy,c)),u=a<=ha?1:1-ay((a-ha)/(1-ha));this.glide(this.absorption.frequency,Math.max(h,180)),this.glide(this.occlusion.gain,Zh(1,sy,c)*u),this.sendGain.gain.value=this.reverb*o.reverbAmount}testOcclusion(t,e){if(e<.5)return!1;Rn.subVectors(this.position,this.engine.listenerPosition).divideScalar(e);const n=t.raycast(this.engine.listenerPosition,Rn);return n!==null&&n<e-.35}glide(t,e){t.setTargetAtTime(e,this.engine.context.currentTime,ry)}get isOccluded(){return this.occluded}get isVirtual(){return this.virtual}dispose(){this.model.dispose(),this.panner.disconnect(),this.sendGain.disconnect(),this.absorption.disconnect(),this.occlusion.disconnect()}}function Kh(i,t){i.positionX?(i.positionX.value=t.x,i.positionY.value=t.y,i.positionZ.value=t.z):i.setPosition(t.x,t.y,t.z)}function oy(i,t){Rn.copy(t).normalize(),i.orientationX?(i.orientationX.value=Rn.x,i.orientationY.value=Rn.y,i.orientationZ.value=Rn.z):i.setOrientation(Rn.x,Rn.y,Rn.z)}function Zh(i,t,e){return i+(t-i)*e}function ay(i){const t=i<0?0:i>1?1:i;return t*t*t*(t*(t*6-15)+10)}const Rn=new C,ly=6;function cy(i){const t=Math.floor(i.sampleRate*ly);return{white:ua(i,t,uy()),pink:ua(i,t,dy()),brown:ua(i,t,fy())}}function ua(i,t,e){const n=i.createBuffer(1,t,i.sampleRate),s=n.getChannelData(0);for(let o=0;o<t;o++)s[o]=e();const r=Math.min(2048,t/4|0);for(let o=0;o<r;o++){const a=o/r;s[o]=s[o]*a+s[t-r+o]*(1-a)}return hy(s),n}function hy(i){let t=0;for(let n=0;n<i.length;n++)t=Math.max(t,Math.abs(i[n]));if(t===0)return;const e=.95/t;for(let n=0;n<i.length;n++)i[n]*=e}function uy(){return()=>Math.random()*2-1}function dy(){let i=0,t=0,e=0,n=0,s=0,r=0,o=0;return()=>{const a=Math.random()*2-1;i=.99886*i+a*.0555179,t=.99332*t+a*.0750759,e=.969*e+a*.153852,n=.8665*n+a*.3104856,s=.55*s+a*.5329522,r=-.7616*r-a*.016898;const l=i+t+e+n+s+r+o+a*.5362;return o=a*.115926,l*.11}}function fy(){let i=0;return()=>{const t=Math.random()*2-1;return i=(i+.02*t)/1.02,i*3.5}}function Ps(i,t,e,n=.06){const s=i.createBufferSource();return s.buffer=t,s.loop=!0,s.playbackRate.value=1+(Math.random()*2-1)*n,s.connect(e),s.start(0,Math.random()*t.duration),{source:s,stop(r=0){try{s.stop(r)}catch{}}}}const py=220,my=560,gy=1.4,da=1300,_y=2900,fa=4,vy=9;function xy(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("wind model built before the noise buffers were ready");const s=e.createGain();s.gain.value=t.gain??.5;const r=e.createBiquadFilter();r.type="lowpass",r.frequency.value=t.tone??3400,r.Q.value=.4;const o=e.createBiquadFilter();o.type="highshelf",o.frequency.value=2200,o.gain.value=-7;const a=e.createGain();a.gain.value=.5,r.connect(o).connect(a).connect(s);const l=e.createGain(),c=e.createGain(),h=e.createGain(),u=e.createBiquadFilter();u.type="lowpass",u.frequency.value=py;const d=e.createBiquadFilter();d.type="bandpass",d.frequency.value=my,d.Q.value=gy;const p=e.createBiquadFilter();p.type="bandpass",p.frequency.value=da,p.Q.value=fa;const g=[Ps(e,n.brown,u),Ps(e,n.pink,d),Ps(e,n.white,p)];u.connect(l).connect(r),d.connect(c).connect(r),p.connect(h).connect(r);const x=t.whistle??1;return{output:s,setTone(m){r.frequency.setTargetAtTime(m,e.currentTime,.1)},update(m,f){const _=f.weather.strength,v=e.currentTime,y=.09;l.gain.setTargetAtTime(.1+_*.85,v,y),c.gain.setTargetAtTime(.03+_*_*.5,v,y),h.gain.setTargetAtTime(_**3*.2*x,v,y),a.gain.setTargetAtTime(.25+_*.75,v,y*1.6),p.frequency.setTargetAtTime(da+(_y-da)*_,v,y),p.Q.setTargetAtTime(fa+(vy-fa)*_,v,y)},dispose(){for(const m of g)m.stop();s.disconnect()}}}const yy=.14,My=160,Sy=[{hz:1150,q:2.6,weight:.4},{hz:2400,q:3.2,weight:.46},{hz:4600,q:3.8,weight:.14}],xl=8,pa=48,by=Array.from({length:xl},(i,t)=>{const e=((t+1)/xl)**2,n=new Float32Array(pa);for(let s=0;s<pa;s++)n[s]=e*.5*(1-Math.cos(2*Math.PI*s/(pa-1)));return n});function jh(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("foliage model built before the noise buffers were ready");const s=t.density??240,r=t.tone??1,o=t.restlessness??.2,a=e.createGain();a.gain.value=t.gain??.5;const l=e.createGain();l.gain.value=0,l.connect(a);const c=Sy.map(_=>{const v=e.createBiquadFilter();return v.type="bandpass",v.frequency.value=_.hz*r,v.Q.value=_.q,v.connect(l),{node:v,weight:_.weight}}),h=()=>{let _=Math.random();for(const v of c)if(_-=v.weight,_<=0)return v.node;return c[c.length-1].node},u=e.createBiquadFilter();u.type="bandpass",u.frequency.value=1800*r,u.Q.value=.75;const d=e.createGain();d.gain.value=0;const p=Ps(e,n.pink,u);u.connect(d).connect(a);let g=t.articulation??.3,x=!0,m=0;const f=_=>{const v=e.createBufferSource();v.buffer=n.white,v.playbackRate.value=.7+Math.random()*.7;const y=e.createGain(),w=.055+Math.random()*.11;y.gain.setValueCurveAtTime(by[Math.floor(Math.random()*xl)],_,w),v.connect(y).connect(h()),v.start(_,Math.random()*(n.white.duration-.3),w+.02),v.stop(_+w+.03)};return{output:a,setArticulation(_){g=_},setActive(_){x=_,_&&(m=0),_||(d.gain.value=0,l.gain.value=0)},update(_,v){if(!x)return;const y=Math.max(v.weather.strength,o),w=e.currentTime;m<w&&(m=w),d.gain.setTargetAtTime(.1+y*.5,w,.15),u.frequency.setTargetAtTime((1500+y*1900)*r,w,.15),l.gain.setTargetAtTime(g*(.25+y*.75),w,.15);const E=w+yy,A=Math.max(20,s*y*y);let L=0;for(;m<E&&L<My;)f(m),m+=-Math.log(1-Math.random())/A,L++},dispose(){p.stop(),l.disconnect(),a.disconnect()}}}const Jh=[1,2,3.02,4.05,5.97],wy=[1,.5,.28,.16,.09],Br={steady:{speed:1,wear:1,clank:1,min:9,max:26,next:["labouring","surging","idling"]},labouring:{speed:.62,wear:1.8,clank:1.7,min:5,max:14,next:["steady","stalling","surging"]},surging:{speed:1.34,wear:1.3,clank:.8,min:3,max:9,next:["steady","labouring"]},stalling:{speed:.22,wear:2.2,clank:2.4,min:1.5,max:4,next:["labouring","idling"]},idling:{speed:.45,wear:.7,clank:.5,min:8,max:20,next:["steady","surging"]}};function Ey(i,t={}){const e=i.context,n=i.noise;if(!n)throw new Error("machine model built before the noise buffers were ready");const s=t.fundamental??46,r=t.clank??.5,o=e.createGain();o.gain.value=t.gain??.35;const a=e.createGain();a.gain.value=.5;const l=e.createBiquadFilter();l.type="lowpass",l.frequency.value=520,l.Q.value=.9;const c=[];Jh.forEach((R,I)=>{const U=e.createOscillator();U.type=I===0?"sawtooth":"triangle",U.frequency.value=s*R,U.detune.value=(Math.random()*2-1)*9;const B=e.createGain();B.gain.value=wy[I],U.connect(B).connect(l),U.start(),c.push(U)}),l.connect(a);const h=e.createGain();h.gain.value=1;const u=e.createOscillator();u.type="sine";const d=e.createGain();d.gain.value=.22,u.connect(d).connect(h.gain),u.start(),a.connect(h).connect(o);const p=e.createBiquadFilter();p.type="bandpass",p.frequency.value=2600,p.Q.value=.8;const g=e.createGain();g.gain.value=(t.wear??.4)*.22;const x=Ps(e,n.pink,p);p.connect(g).connect(o);const m=e.createGain();m.gain.value=r,m.connect(o);let f=t.rpm??52,_=f,v=!0,y=0,w="steady",E=12;const A=(t.wear??.4)*.22,L=R=>{if(r<=0)return;const I=e.createBufferSource();I.buffer=n.white;const U=e.createBiquadFilter();U.type="bandpass",U.frequency.value=190+Math.random()*90,U.Q.value=14;const B=e.createGain();B.gain.setValueAtTime(0,R),B.gain.linearRampToValueAtTime(.9+Math.random()*.3,R+.001),B.gain.setTargetAtTime(0,R+.001,.05),I.connect(U).connect(B).connect(m),I.start(R,Math.random()*2,.4),I.stop(R+.45)},S=(R=.9)=>{const I=e.currentTime,U=Br[w];u.frequency.setTargetAtTime(_/60,I,R*.4);const B=Math.max(_,4)/52;Jh.forEach((X,H)=>{c[H].frequency.setTargetAtTime(s*X*B,I,R)}),l.frequency.setTargetAtTime(420+B*260,I,R),g.gain.setTargetAtTime(A*U.wear,I,R),m.gain.setTargetAtTime(r*U.clank,I,R)},M=R=>{w=R;const I=Br[R];E=I.min+Math.random()*(I.max-I.min),S()};return S(.01),{output:o,get phase(){return w},get currentRpm(){return _},setRpm(R){f=R},setActive(R){v=R,R&&(y=0)},update(R){if(!v)return;const I=e.currentTime;if(E-=R,E<=0){const H=Br[w].next;M(H[Math.floor(Math.random()*H.length)])}const U=f*Br[w].speed,B=Math.min(R*.55,1);Math.abs(U-_)>.05&&(_+=(U-_)*B,S());const X=60/Math.max(_,3);for(y<I&&(y=I+X);y<I+.15;)L(y),y+=X*(.94+Math.random()*.12)},dispose(){for(const R of c)R.stop();u.stop(),x.stop(),o.disconnect()}}}function Ty(i,t={}){const e=i.context,n=t.pitch??2400,s=t.interval??7,r=t.shySpeed??.72,o=e.createGain();o.gain.value=t.gain??.16;const a=e.createBiquadFilter();a.type="lowpass",a.frequency.value=t.tone??3200,a.Q.value=.5,a.connect(o);let l=!0,c=0;const h=(g,x,m,f)=>{const _=e.createOscillator();_.type="sine",_.frequency.setValueAtTime(x,g),_.frequency.exponentialRampToValueAtTime(m,g+f);const v=e.createOscillator();v.type="sine",v.frequency.setValueAtTime(x*2.02,g),v.frequency.exponentialRampToValueAtTime(m*2.02,g+f);const y=e.createGain();y.gain.value=.18;const w=e.createGain();w.gain.setValueAtTime(0,g),w.gain.linearRampToValueAtTime(1,g+f*.18),w.gain.setValueAtTime(1,g+f*.6),w.gain.linearRampToValueAtTime(0,g+f),_.connect(w),v.connect(y).connect(w),w.connect(a),_.start(g),v.start(g),_.stop(g+f+.02),v.stop(g+f+.02)},u=[{name:"rising",weight:.26},{name:"falling",weight:.2},{name:"trill",weight:.16},{name:"pair",weight:.22},{name:"single",weight:.1},{name:"chatter",weight:.06}],d=()=>{let g=Math.random();for(const x of u)if(g-=x.weight,g<=0)return x.name;return"pair"},p=g=>{const x=n*(.82+Math.random()*.36);let m=g;switch(d()){case"rising":{const f=2+Math.floor(Math.random()*3);for(let _=0;_<f;_++){const v=1+_*(.1+Math.random()*.09),y=.06+Math.random()*.07;h(m,x*v,x*v*1.22,y),m+=y+.03+Math.random()*.05}break}case"falling":{const f=2+Math.floor(Math.random()*2);for(let _=0;_<f;_++){const v=1-_*(.08+Math.random()*.07),y=.08+Math.random()*.1;h(m,x*v*1.18,x*v*.82,y),m+=y+.04+Math.random()*.06}break}case"trill":{const f=5+Math.floor(Math.random()*7),_=.028+Math.random()*.022;for(let v=0;v<f;v++){const y=v%2===0?1:1.09;h(m,x*y,x*y*1.05,_*.8),m+=_}break}case"pair":{const f=.07+Math.random()*.06;h(m,x,x*1.3,f),m+=f+.05+Math.random()*.04,h(m,x*1.28,x*1.05,f*1.2),m+=f*1.2;break}case"single":{const f=.22+Math.random()*.3;h(m,x*.95,x*1.12,f),m+=f;break}case"chatter":{const f=3+Math.floor(Math.random()*4);for(let _=0;_<f;_++){const v=.02+Math.random()*.02;h(m,x*.6,x*.5,v),m+=v+.02+Math.random()*.03}break}}return m};return{output:o,setActive(g){l=g,g&&(c=0)},update(g,x){if(!l)return;const m=e.currentTime;c<m&&(c=m+Math.random()*s),!(c>m+.2)&&(x.weather.strength<r?c=p(c)+(Math.random()<.34?.4+Math.random()*2.2:-Math.log(1-Math.random())*s):c=m+1.5)},dispose(){o.disconnect()}}}const zr={stone:{level:.5,impact:{level:.9,duration:.011,tone:3800},modes:[{hz:620,decay:.06,level:.6},{hz:1450,decay:.03,level:.32},{hz:2600,decay:.018,level:.12}],grit:{count:5,over:.06,energyDecay:.025,hz:2600,q:1.2,level:.12},toe:.45,roll:.075},wood:{level:.6,impact:{level:.7,duration:.018,tone:1700},modes:[{hz:155,decay:.22,level:1},{hz:390,decay:.15,level:.6},{hz:720,decay:.075,level:.22}],grit:{count:4,over:.05,energyDecay:.02,hz:1200,q:.9,level:.08},toe:.6,roll:.085},earth:{level:.5,impact:{level:1,duration:.022,tone:900},modes:[{hz:120,decay:.05,level:.55}],grit:{count:9,over:.07,energyDecay:.028,hz:1600,q:1,level:.22},toe:.4,roll:.085},gravel:{level:.5,impact:{level:.45,duration:.012,tone:2400},modes:[],grit:{count:26,over:.16,energyDecay:.06,hz:3e3,q:1.4,level:.75},toe:.7,roll:.09},grass:{level:.32,impact:{level:.5,duration:.03,tone:1400},modes:[],grit:{count:16,over:.11,energyDecay:.045,hz:5200,q:.9,level:.4},toe:.6,roll:.085},leaves:{level:.4,impact:{level:.35,duration:.02,tone:2600},modes:[],grit:{count:34,over:.2,energyDecay:.08,hz:4200,q:2.2,level:.55},toe:.75,roll:.09},metal:{level:.45,impact:{level:.9,duration:.004,tone:9e3},modes:[{hz:480,decay:.5,level:.5},{hz:1270,decay:.42,level:.45},{hz:2340,decay:.3,level:.3},{hz:4100,decay:.18,level:.2}],grit:null,toe:.5,roll:.07},mud:{level:.5,impact:{level:1,duration:.05,tone:700},modes:[{hz:240,decay:.06,level:.35}],grit:{count:6,over:.09,energyDecay:.03,hz:900,q:3.2,level:.3},toe:.3,roll:.1}},Ay=6,Qh=.35,Ry=9;function dn(i,t){return i+Math.random()*(t-i)}class Cy{surface="earth";engine;output;body;panner;reverbSend;chains=new Map;left=!1;constructor(t,e=.55){this.engine=t;const n=t.context;this.output=n.createGain(),this.output.gain.value=e,this.body=n.createBiquadFilter(),this.body.type="lowpass",this.body.frequency.value=5200,this.body.Q.value=.6,this.panner=n.createStereoPanner(),this.reverbSend=n.createGain(),this.reverbSend.gain.value=.6,this.output.connect(this.body),this.body.connect(this.panner),this.panner.connect(t.dry),this.panner.connect(this.reverbSend),this.reverbSend.connect(t.send)}setReverb(t){this.reverbSend.gain.setTargetAtTime(Math.max(0,t),this.engine.context.currentTime,.1)}step(t){const e=this.engine.context;if(e.state!=="running"||!this.engine.noise)return;const n=zr[this.surface],s=this.chainFor(this.surface),r=e.currentTime+.004,o=Qh+(1-Qh)*(1-Math.exp(-t/(Ay*.45))),a=n.level*Math.min(o,1);if(this.panner.pan.setValueAtTime(this.takeFoot()*.2,r),this.strike(s,n,r,a*dn(.9,1.1)),n.toe>0){const l=n.roll*Math.max(.35,1-t/12);this.strike(s,n,r+l,a*n.toe*dn(.8,1.1))}}land(t){const e=this.engine.context;if(e.state!=="running"||!this.engine.noise)return;const n=zr[this.surface],s=this.chainFor(this.surface),r=e.currentTime+.004,o=Math.min(t/Ry,1),a=n.level*(.7+o*.85);this.panner.pan.setValueAtTime(0,r),this.strike(s,n,r,a),this.strike(s,n,r+dn(.012,.03),a*dn(.4,.6))}jump(){const t=this.engine.context;if(t.state!=="running"||!this.engine.noise)return;const e=zr[this.surface],n=this.chainFor(this.surface),s=t.currentTime+.004;this.panner.pan.setValueAtTime(this.takeFoot()*.12,s),this.strike(n,e,s,e.level*dn(.42,.55),{stretch:3.2,modes:.28,grit:1.7})}takeFoot(){const t=this.left?-1:1;return this.left=!this.left,t}strike(t,e,n,s,r){const o=this.engine.context,a=this.engine.noise;if(!a)return;const l=r?.stretch??1,c=r?.modes??1,h=r?.grit??1,u=(d,p,g)=>{const x=o.createBufferSource();x.buffer=a.white;const m=o.createGain();m.gain.setValueAtTime(0,n),m.gain.linearRampToValueAtTime(p,n+Math.min(.0012,g*.3)),m.gain.setTargetAtTime(0,n+.0012,g*.4),x.connect(m).connect(d),x.start(n,dn(0,a.white.duration-.5),g+.05),x.stop(n+g+.06)};u(t.impactInput,s*e.impact.level,e.impact.duration*l);for(let d=0;d<e.modes.length;d++)u(t.modeInputs[d],s*e.modes[d].level*.5*c,.002);e.grit&&t.gritInput&&this.scatter(t.gritInput,e.grit,n,s*h)}scatter(t,e,n,s){const r=this.engine.context,o=this.engine.noise;if(!o)return;const a=e.count/e.over;let l=0;for(let c=0;c<e.count&&(l+=-Math.log(1-dn(.001,1))/a,!(l>e.over*1.4));c++){const h=Math.exp(-l/e.energyDecay),u=s*e.level*h*dn(.35,1);if(u<.002)continue;const d=r.createBufferSource();d.buffer=o.white,d.playbackRate.value=dn(.7,1.4);const p=r.createGain(),g=n+l;p.gain.setValueAtTime(0,g),p.gain.linearRampToValueAtTime(u,g+8e-4),p.gain.setTargetAtTime(0,g+8e-4,.004),d.connect(p).connect(t),d.start(g,dn(0,o.white.duration-.2),.06),d.stop(g+.07)}}chainFor(t){const e=this.chains.get(t);if(e)return e;const n=this.engine.context,s=zr[t],r=n.createGain(),o=n.createBiquadFilter();o.type="lowpass",o.frequency.value=s.impact.tone,r.connect(o).connect(this.output);const a=s.modes.map(h=>{const u=n.createGain(),d=n.createBiquadFilter();d.type="bandpass",d.frequency.value=h.hz,d.Q.value=Math.min(220,Math.max(1,Math.PI*h.hz*h.decay));const p=n.createGain();return p.gain.value=1/Math.sqrt(d.Q.value),u.connect(d).connect(p).connect(this.output),u});let l=null;if(s.grit){l=n.createGain();const h=n.createBiquadFilter();h.type="bandpass",h.frequency.value=s.grit.hz,h.Q.value=s.grit.q,l.connect(h).connect(this.output)}const c={impactInput:r,modeInputs:a,gritInput:l};return this.chains.set(t,c),c}dispose(){this.output.disconnect(),this.body.disconnect(),this.panner.disconnect(),this.reverbSend.disconnect()}}class Py{tuning={machineRpm:52,windTone:3400,foliageArticulation:1};footsteps;engine;collider;ground;camera;emitters=[];bed;windModel;lastRoom=void 0;active=!0;constructor(t,e,n,s){this.engine=t,this.ground=e,this.collider=n,this.camera=s,this.bed=t.context.createGain(),this.bed.connect(t.dry),this.windModel=xy(t,{gain:.17,tone:this.tuning.windTone}),this.windModel.output.connect(this.bed),this.footsteps=new Cy(t,.55);const r=e.anchors,o=jh(t,{density:240,tone:.8,gain:.42,articulation:.22});this.foliage.push({model:o,base:.22}),this.emitters.push(new Fr(t,o,{position:r.tree,refDistance:2.5,maxDistance:20,rolloff:1.7,reverb:.35}));for(const a of[r.bush,new C(9.2,.5,16.8)]){const l=jh(t,{density:160,tone:1.45,gain:.26,articulation:.34});this.foliage.push({model:l,base:.34}),this.emitters.push(new Fr(t,l,{position:a,refDistance:1.4,maxDistance:14,reverb:.25}))}this.emitters.push(new Fr(t,Ty(t,{pitch:2600,interval:6,gain:.075,tone:2800}),{position:r.bird,refDistance:4,maxDistance:38,rolloff:1.4,reverb:.85})),this.machineModel=Ey(t,{rpm:this.tuning.machineRpm,fundamental:42,gain:.4}),this.emitters.push(new Fr(t,this.machineModel,{position:r.machine,refDistance:2.5,maxDistance:34,rolloff:1.8,reverb:.9}))}machineModel;foliage=[];setActive(t){if(t!==this.active){this.active=t;for(const e of this.emitters)e.enabled=t;this.bed.gain.setTargetAtTime(t?1:0,this.engine.context.currentTime,.15),t&&(this.lastRoom=void 0)}}update(t){const e=this.engine.update(t,this.camera);this.windModel.update?.(t,this.engine);for(const s of this.emitters)s.update(t,this.collider,e);if(!this.active)return;const n=this.ground.roomAt(this.engine.listenerPosition);n!==this.lastRoom&&(this.lastRoom=n,this.engine.setRoom(n??"open"),this.bed.gain.setTargetAtTime(n===null?1:.22,this.engine.context.currentTime,.35),this.footsteps.surface=n===null?"earth":"stone"),this.machineModel.setRpm(this.tuning.machineRpm),this.windModel.setTone(this.tuning.windTone);for(const{model:s,base:r}of this.foliage)s.setArticulation(r*this.tuning.foliageArticulation);this.ground.update(t,this.machineModel.currentRpm)}get machinePhase(){return this.machineModel.phase}get emitterCount(){return this.emitters.length}get occludedCount(){return this.emitters.filter(t=>t.isOccluded).length}get audibleCount(){return this.emitters.filter(t=>!t.isVirtual).length}dispose(){for(const t of this.emitters)t.dispose();this.windModel.dispose(),this.footsteps.dispose(),this.bed.disconnect()}}const jl={name:"archway",category:"structures",radius:1.8,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.range(1.5,1.9),r=e.range(2.6,3.1),o=e.range(.42,.58),a=e.range(.5,.7),l=e.chance(.5)?z.STONE:z.STONE_DARK;for(const u of[-1,1]){const d=e.int(3,4),p=r/d;for(let g=0;g<d;g++){const x=1-g/d*.12,m=new et(o*x,p*1.02,a*x);m.translate(u*(s+o)/2+e.around(0,.02),p*(g+.5),e.around(0,.02)),n.push({geometry:m,color:xe(l,e.around(1,.08)),sway:0})}}const c=new et(s+o*2.5,e.range(.34,.46),a*1.1);if(c.translate(0,r+.18,0),n.push({geometry:c,color:xe(l,.92),sway:0}),e.chance(.55)){const u=new et(s+o*1.6,.18,a*.8);u.translate(e.around(0,.06),r+.48,0),n.push({geometry:u,color:xe(l,1.08),sway:0})}const h=ce(n);return t!==1&&h.scale(t,t,t),he(h,"archway",0)}},Ly=Object.freeze(Object.defineProperty({__proto__:null,archway:jl},Symbol.toStringTag,{value:"Module"})),_i={name:"barrel",category:"objects",radius:.55,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.range(.75,1.05),r=e.range(.3,.4),o=r*e.range(.78,.88),a=e.int(8,11),l=e.chance(.25),c=[new nt(0,0),new nt(o,0),new nt(r,s*.35),new nt(r,s*.65),new nt(o,s),new nt(0,s)];n.push({geometry:new Vl(c,a),color:z.TIMBER,sway:0});for(const u of[.14,.5,.86]){const d=u>.3&&u<.7?r:o+(r-o)*.45,p=new zt(d*1.04,d*1.04,.055,a);p.translate(0,s*u,0),n.push({geometry:p,color:z.IRON,sway:0})}let h=ce(n);return l&&(h.rotateX(Math.PI/2),h.rotateY(e.range(0,Math.PI*2)),h.translate(0,r,0)),t!==1&&(h=h.scale(t,t,t)),he(h,"barrel",0)}},Dy=Object.freeze(Object.defineProperty({__proto__:null,barrel:_i},Symbol.toStringTag,{value:"Module"})),yd={name:"bed",category:"furniture",radius:1.3,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.range(.9,1.25),r=e.range(1.85,2.15),o=e.range(.26,.4),a=e.range(.07,.1),l=e.chance(.55)?z.TIMBER_DARK:z.BARK,c=e.pick([z.CLOTH,z.WOOL,z.HIDE_PALE]),h=e.pick([z.HIDE,z.LEAF_DARK,z.RUST,z.STONE_DARK]),u=e.chance(.5)?-1:1;for(const A of[-1,1]){const L=new et(a,o*.55,r);L.translate(A*(s-a)/2,o*.72,0),n.push({geometry:L,color:l,sway:0})}for(const A of[-1,1])for(const L of[-1,1]){const S=o*(L===u?1.05:.98),M=new et(a,S,a);M.translate(A*(s-a)/2,S/2,L*(r-a)/2),n.push({geometry:M,color:l,sway:0})}const d=e.range(.34,.62),p=new et(s,d,.055);if(p.translate(0,o+d/2-.04,u*r/2),n.push({geometry:p,color:l,sway:0}),e.chance(.55)){const A=d*e.range(.3,.5),L=new et(s,A,.05);L.translate(0,o+A/2-.04,-u*r/2),n.push({geometry:L,color:l,sway:0})}const g=o+e.range(.14,.2),x=6,m=(r-.1)/x;for(let A=0;A<x;A++){const L=-r/2+.05+(A+.5)*m,S=u<0?A/(x-1):1-A/(x-1),M=1-.22*Math.sin(S*Math.PI)*e.range(.4,1),R=(g-o*.72)*M,I=new et(s-a*1.4,R,m*1.04);I.translate(0,o*.72+R/2,L),n.push({geometry:I,color:c,sway:0})}const f=r*e.range(.6,.75),_=4,v=f/_,y=-u*r/2;for(let A=0;A<_;A++){const L=y+u*((A+.5)*v),S=e.range(.045,.075),M=new et(s-a*.6,S,v*1.02);M.translate(0,g+S/2-.01,L),n.push({geometry:M,color:h,sway:0})}const w=new et(s-a*.6,.05,.09);if(w.translate(0,g+.05,y+u*f),n.push({geometry:w,color:xe(h,1.18),sway:0}),e.chance(.85)){const A=e.range(.26,.36),L=new et(s*e.range(.5,.72),e.range(.09,.14),A);L.translate(e.around(0,s*.1),g+.06,u*(r/2-A*.8)),L.rotateY(e.around(0,.18)),n.push({geometry:L,color:xe(c,1.12),sway:0})}const E=ce(n);return t!==1&&E.scale(t,t,t),he(E,"bed",0)}},Iy=Object.freeze(Object.defineProperty({__proto__:null,bed:yd},Symbol.toStringTag,{value:"Module"}));function Uy(i,t,e,n,s){const r=new ge(t,e);r.deleteAttribute("normal"),r.deleteAttribute("uv");const o=Kl(r);r.dispose();const a=o.getAttribute("position"),l=new C;for(let c=0;c<a.count;c++)l.fromBufferAttribute(a,c),l.multiplyScalar(i.range(n,s)),a.setXYZ(c,l.x,l.y,l.z);return a.needsUpdate=!0,o.computeVertexNormals(),o}function zi(i,t){return i.range(t[0],t[1])}function Ny(i,t,e,n,s){const r=e.range(0,100),o=e.range(0,100),a=e.range(0,100),l=(h,u,d)=>{let p=Math.imul(Math.round(h)*374761393+Math.round(u)*668265263,1);return p=Math.imul(p^p>>>13,1274126177)+Math.round(d)*951274213,p^=p>>>16,(p>>>0)%1e3/1e3},c=(h,u,d)=>{const p=Math.floor(h),g=Math.floor(u),x=Math.floor(d),m=ma(h-p),f=ma(u-g),_=ma(d-x);let v=0;for(let y=0;y<=1;y++)for(let w=0;w<=1;w++)for(let E=0;E<=1;E++){const A=(E?m:1-m)*(w?f:1-f)*(y?_:1-_);v+=l(p+E,g+w,x+y)*A}return v};return(h,u,d)=>c(h*n+r,u*n+o,d*n+a)<s?t:i}function ma(i){return i*i*(3-2*i)}function po(i,t,e,{scale:n=1}){const s=[],r=zi(e,t.length),o=zi(e,t.girth),a=zi(e,t.legLength),l=o*e.range(.62,.78),c=e.pick(t.hide),h=a+o/2,u=t.woolly||r>1.2?1:0,d=t.woolly?Uy(e,o/2,u,.86,1.24):new ge(o/2,u);d.scale(l/o,1,r/o),d.rotateZ(e.around(0,.05)),d.translate(0,h,0);const p=t.woolly?Oy:t.patch?Ny(c,e.pick(t.patch),e,2.6/o,t.patchCoverage??.45):c;s.push({geometry:d,color:p,sway:0});const g=zi(e,t.neck),x=zi(e,t.neckRise),m=new C(0,h+o*.18,r*.4),f=o*.45,_=g+f,v=new zt(o*.17,o*.24,_,6);v.translate(0,_/2-f,0),v.rotateX(Math.PI/2-x),v.translate(m.x,m.y,m.z),s.push({geometry:v,color:p,sway:0});const y=new C(0,m.y+Math.sin(x)*g,m.z+Math.cos(x)*g),w=zi(e,t.headSize),E=new ge(w,0);if(E.scale(.85,.9,t.headStretch),E.rotateY(e.around(0,.2)),E.translate(y.x,y.y,y.z),s.push({geometry:E,color:p,sway:0}),t.snout>0){const L=new zt(w*t.snout*.8,w*t.snout,w*.5,6);L.rotateX(Math.PI/2),L.translate(y.x,y.y-w*.15,y.z+w*t.headStretch),s.push({geometry:L,color:t.extremity,sway:0})}for(const L of[-1,1]){if(t.ears!=="none"){const S=new Le(w*.28,w*.85,4);S.translate(0,w*.42,0),t.ears==="floppy"?S.rotateZ(L*2.4):t.ears==="side"?S.rotateZ(L*1.5):S.rotateZ(L*.35),S.translate(y.x+L*w*.6,y.y+w*.4,y.z),s.push({geometry:S,color:t.extremity,sway:0})}if(t.horns!=="none"){const S=w*(t.horns==="curved"?1.5:.7),M=new Le(w*.16,S,5);M.translate(0,S/2,0),M.rotateZ(L*(t.horns==="curved"?1.1:.5)),M.translate(y.x+L*w*.45,y.y+w*.55,y.z),s.push({geometry:M,color:tu,sway:0})}for(const S of[-1,1]){const M=h,R=new zt(t.legThickness*.78,t.legThickness,M,5);R.translate(0,M/2,0),R.rotateZ(L*e.range(-.02,.07)),R.translate(L*l*.34,0,S*r*e.range(.26,.34)),s.push({geometry:R,color:c,sway:0});const I=new zt(t.legThickness*1.15,t.legThickness*1.05,a*.13,5);I.translate(L*l*.34,a*.06,S*r*.3),s.push({geometry:I,color:Fy,sway:0})}}if(t.tail!=="none"){const L=new C(0,h+o*.16,-r*.42);if(t.tail==="curl"){const M=o*.06;for(let R=0;R<9;R++){const I=R/8,U=I*Math.PI*2.2,B=new ge(M*(1-I*.25),0);B.translate(Math.sin(U)*o*.1,L.y+I*o*.2,L.z-o*.04-(1-Math.cos(U))*o*.05),s.push({geometry:B,color:t.extremity,sway:0})}}else{const S=r*(t.tail==="flowing"?.55:.42),M=e.range(.08,.42),R=new zt(o*.035,o*.06,S,4);R.translate(0,-S/2,0),R.rotateX(M),R.translate(L.x,L.y,L.z),s.push({geometry:R,color:c,sway:.35});const I=S*.92,U=new ge(o*.09,0);U.scale(.75,t.tail==="flowing"?1.7:1.05,.75),U.rotateX(M),U.translate(L.x,L.y-I*Math.cos(M),L.z-I*Math.sin(M)),s.push({geometry:U,color:tu,sway:.6})}}const A=ce(s);return A.rotateY(e.range(0,Math.PI*2)),n!==1&&A.scale(n,n,n),he(A,i,e()*Math.PI*2)}const Oy=12433060,tu=9076841,Fy=3814187,By={length:[1.9,2.3],girth:[.85,1.05],legLength:[.62,.78],legThickness:.085,neck:[.4,.55],neckRise:[.05,.3],headSize:[.24,.3],headStretch:1.5,snout:.55,ears:"side",horns:"stub",tail:"switch",woolly:!1,hide:[z.WOOL,z.STONE_PALE],extremity:z.HOG,patch:[z.COW_BLACK,z.COW_BLACK,z.HIDE_DARK],patchCoverage:.46},Md={name:"bovine",category:"animals",radius:1.4,build:(i={})=>po("bovine",By,se(i.seed??1),i)},zy=Object.freeze(Object.defineProperty({__proto__:null,bovine:Md},Symbol.toStringTag,{value:"Module"}));function ky(i,t){const e=new ge(t,0);e.deleteAttribute("normal"),e.deleteAttribute("uv");const n=Kl(e);e.dispose();const s=n.getAttribute("position"),r=new C;for(let o=0;o<s.count;o++)r.fromBufferAttribute(s,o),r.multiplyScalar(i.range(.78,1.2)),s.setXYZ(o,r.x,r.y,r.z);return s.needsUpdate=!0,n.scale(1,i.range(.45,.7),i.range(.85,1.1)),n.computeVertexNormals(),n}const Sd={name:"cairn",category:"nature",radius:.7,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.int(4,7);let r=e.range(.26,.38),o=0;for(let l=0;l<s;l++){const c=ky(e,r);c.computeBoundingBox();const h=c.boundingBox,u=h?(h.max.y-h.min.y)/2:r*.5;c.rotateY(e.range(0,Math.PI*2)),o+=u*(l===0?1:1.55),c.translate(e.around(0,r*.14),o,e.around(0,r*.14)),n.push({geometry:c,color:e.chance(.35)?z.STONE_DARK:z.STONE,sway:0}),r*=e.range(.76,.9)}const a=ce(n);return t!==1&&a.scale(t,t,t),he(a,"cairn",0)}},Hy=Object.freeze(Object.defineProperty({__proto__:null,cairn:Sd},Symbol.toStringTag,{value:"Module"})),yl={name:"chair",category:"furniture",radius:.45,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.range(.42,.5),r=e.range(.38,.46),o=e.range(.36,.44),a=e.range(.04,.06),l=e.range(.44,.66),c=e.pick(["slats","spindles","board"]),h=e.chance(.55)?z.TIMBER:z.TIMBER_DARK,u=h===z.TIMBER?z.TIMBER_DARK:z.TIMBER,d=new et(r,a,o);d.translate(0,s-a/2,0),n.push({geometry:d,color:h,sway:0});const p=e.range(.035,.048),g=r/2-p*.7,x=o/2-p*.7;for(const _ of[-1,1]){const v=new et(p,s,p);v.translate(_*g,s/2,x),n.push({geometry:v,color:u,sway:0})}for(const _ of[-1,1]){const v=new et(p,s,p);v.translate(_*g,s/2,-x),n.push({geometry:v,color:u,sway:0});const y=.03,w=new et(p,l+y,p);w.translate(_*g,s+l/2-y/2,-x),n.push({geometry:w,color:u,sway:0})}const m=(_,v)=>{_.translate(0,s+v,-x)};if(c==="board"){const _=l*e.range(.4,.55),v=new et(r*.86,_,.03);m(v,l-_*.62),n.push({geometry:v,color:h,sway:0})}else if(c==="slats"){const _=e.int(2,3);for(let v=0;v<_;v++){const y=l*(.42+v/Math.max(_-1,1)*.5),w=new et(r*.84,e.range(.06,.1),.026);m(w,y),n.push({geometry:w,color:h,sway:0})}}else{const _=e.int(3,5),v=r*.72,y=l*.93,w=.02,E=y+w;for(let L=0;L<_;L++){const S=-v/2+L/(_-1)*v,M=new et(.026,E,.026);M.translate(S,E/2-w,0),m(M,0),n.push({geometry:M,color:u,sway:0})}const A=new et(r*.84,.055,.032);m(A,y),n.push({geometry:A,color:h,sway:0})}if(e.chance(.6)){const _=new et(g*2,.026,.026);_.translate(0,s*e.range(.28,.36),x),n.push({geometry:_,color:u,sway:0})}const f=ce(n);return t!==1&&f.scale(t,t,t),he(f,"chair",0)}},Gy=Object.freeze(Object.defineProperty({__proto__:null,chair:yl},Symbol.toStringTag,{value:"Module"})),eu=[{name:"small",weight:.3,scale:[.55,.75]},{name:"ordinary",weight:.45,scale:[.85,1.15]},{name:"large",weight:.18,scale:[1.5,1.9]},{name:"huge",weight:.07,scale:[2.1,2.6]}],Kn={name:"crate",category:"objects",radius:1.2,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[];let s=e(),r=eu[1];for(const m of eu)if(s-=m.weight,s<=0){r=m;break}const o=e.range(r.scale[0],r.scale[1]),a=e.range(.5,.9)*o,l=e.range(.45,.8)*o,c=e.range(.5,.9)*o,h=e.around(0,.35),u=new et(a,l,c);u.translate(0,l/2,0),u.rotateY(h),n.push({geometry:u,color:z.TIMBER,sway:0});const d=Math.max(2,Math.round(2+o*.9+(e.chance(.3)?1:0))),p=.05*Math.min(o,1.5),g=1.02;for(let m=0;m<d;m++){const f=l*(.13+m/Math.max(d-1,1)*.74),_=new et(a*g,p,c*g);_.translate(0,f,0),_.rotateY(h),n.push({geometry:_,color:z.TIMBER_DARK,sway:0})}if(o>1.2||e.chance(.25)){const m=.055*Math.min(o,1.6);for(const f of[-1,1])for(const _ of[-1,1]){const v=new et(m,l*.96,m);v.translate(f*a/2,l*.48,_*c/2),v.rotateY(h),n.push({geometry:v,color:z.RUST,sway:0})}}if(e.chance(.35)){const m=new et(a*.92,.05*o,c*.92);m.translate(e.around(0,.08*o),l+.03*o,e.around(0,.08*o)),m.rotateY(h+e.around(0,.25)),n.push({geometry:m,color:z.TIMBER_DARK,sway:0})}const x=ce(n);return t!==1&&x.scale(t,t,t),he(x,"crate",0)}},Vy=Object.freeze(Object.defineProperty({__proto__:null,crate:Kn},Symbol.toStringTag,{value:"Module"})),Wy={timber:{leaf:z.TIMBER,ledge:z.TIMBER_DARK,iron:z.IRON,frame:z.STONE_DARK},iron:{leaf:z.IRON,ledge:z.STONE_DARK,iron:z.RUST,frame:z.STONE},plank:{leaf:z.TIMBER_DARK,ledge:z.TIMBER,iron:z.RUST,frame:z.TIMBER_DARK}},Xy=["timber","iron","plank"],qy={timber:"Wooden Door",iron:"Iron Door",plank:"Plank Door"};function bd(i){return qy[i]}function Ml(i){return i.userData.door}function Jl(i={}){const{seed:t=1,scale:e=1}=i,n=se(t),s=[],r=i.material??n.pick(Xy),o=Wy[r],a=n.range(.94,1.16),l=n.range(2,2.28),c=n.range(.07,.1),h=n.range(.13,.18),u=c*2.4;for(const S of[-1,1]){const M=new et(h,l+h,u);M.translate(S*(a+h)/2,(l+h)/2,-u*.18),s.push({geometry:M,color:o.frame,sway:0})}const d=new et(a+h*2.6,h,u*1.1);if(d.translate(0,l+h/2,-u*.18),s.push({geometry:d,color:o.frame,sway:0}),n.chance(.55)){const S=new et(a+h*2.2,.06,u*1.5);S.translate(0,.03,-u*.1),s.push({geometry:S,color:o.frame,sway:0})}const p=new et(a,l,.02);p.translate(0,l/2,-c*.5),s.push({geometry:p,color:1316378,sway:0});const g=n.int(4,6),x=a/g;for(let S=0;S<g;S++){const M=c*n.range(.88,1),R=new et(x*.94,l*n.range(.985,1),M);R.translate(-a/2+x*(S+.5),l/2,M/2),s.push({geometry:R,color:o.leaf,sway:0})}const m=n.chance(.4)?[l*.16,l*.52,l*.87]:[l*.18,l*.82],f=c*.42;for(const S of m){const M=new et(a*.96,n.range(.1,.15),f);M.translate(0,S,c+f/2),s.push({geometry:M,color:o.ledge,sway:0})}const _=n.chance(.5)?-1:1,v=f*.5;for(const S of[m[0],m[m.length-1]]){const M=a*n.range(.45,.7),R=new et(M,.055,v);R.translate(_*(a/2-M/2),S,c+f+v/2),s.push({geometry:R,color:o.iron,sway:0});const I=new et(.07,.09,v*2.2);I.translate(_*(a/2+.02),S,c+v),s.push({geometry:I,color:o.iron,sway:0})}const y=-_*a*n.range(.3,.36),w=l*n.range(.44,.5);if(n.chance(.5)){const S=new zt(.062,.062,.02,8);S.rotateX(Math.PI/2),S.translate(y,w,c+.01),s.push({geometry:S,color:o.iron,sway:0});const M=new zt(.022,.026,.05,6);M.rotateX(Math.PI/2),M.translate(y,w,c+.043),s.push({geometry:M,color:o.iron,sway:0});const R=new ge(.052,0);R.scale(1,1,.78),R.translate(y,w,c+.095),s.push({geometry:R,color:o.iron,sway:0})}else{const S=new et(.045,.2,.045);S.translate(y,w,c+.055),s.push({geometry:S,color:o.iron,sway:0});for(const M of[-.09,.09]){const R=new et(.05,.05,.05);R.translate(y,w+M,c+.025),s.push({geometry:R,color:o.iron,sway:0})}}const E=ce(s);e!==1&&E.scale(e,e,e);const A=he(E,"door",0),L={width:(a+h*2)*e,height:(l+h)*e,depth:(c+f+v)*e,material:r};return A.userData.door=L,A}const Yy={name:"door",category:"structures",radius:.9,build:Jl},$y=Object.freeze(Object.defineProperty({__proto__:null,buildDoor:Jl,door:Yy,doorMetrics:Ml,doorName:bd},Symbol.toStringTag,{value:"Module"})),Ky={length:[1.9,2.2],girth:[.75,.9],legLength:[.95,1.15],legThickness:.07,neck:[.6,.8],neckRise:[.75,1.05],headSize:[.2,.25],headStretch:1.9,snout:.5,ears:"perked",horns:"none",tail:"flowing",woolly:!1,hide:[z.HIDE_DARK,z.HIDE,z.BARK],extremity:z.HIDE_DARK},wd={name:"equine",category:"animals",radius:1.4,build:(i={})=>po("equine",Ky,se(i.seed??1),i)},Zy=Object.freeze(Object.defineProperty({__proto__:null,equine:wd},Symbol.toStringTag,{value:"Module"})),Ed={name:"fence",category:"structures",radius:2.4,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.int(3,5),r=e.range(1.1,1.6),o=e.range(.85,1.25),a=e.int(2,3),l=s*r;for(let h=0;h<=s;h++){const u=h*r-l/2,d=e.around(0,.09),p=o*e.range(.85,1.1),g=new et(.11,p,.11);g.translate(0,p/2,0),g.rotateZ(d),g.rotateY(e.around(0,.25)),g.translate(u,0,e.around(0,.06)),n.push({geometry:g,color:z.TIMBER,sway:0})}for(let h=0;h<s;h++){if(e.chance(.22))continue;const u=h*r-l/2+r/2;for(let d=0;d<a;d++){const p=o*(.32+d/Math.max(a-1,1)*.52),g=new et(r*1.02,.07,.05);g.rotateZ(e.around(0,.05)),g.translate(u,p+e.around(0,.03),e.around(0,.03)),n.push({geometry:g,color:z.TIMBER_DARK,sway:0})}}const c=ce(n);return c.rotateY(e.range(0,Math.PI)),t!==1&&c.scale(t,t,t),he(c,"fence",0)}},jy=Object.freeze(Object.defineProperty({__proto__:null,fence:Ed},Symbol.toStringTag,{value:"Module"})),Jy=[{shape:"cone",weight:.3},{shape:"orb",weight:.2},{shape:"wedge",weight:.16},{shape:"drum",weight:.14},{shape:"block",weight:.11},{shape:"spike",weight:.09}];function Qy(i){let t=i();for(const e of Jy)if(t-=e.weight,t<=0)return e.shape;return"cone"}const tM={cone:.3,wedge:.3,drum:.4,block:.4,orb:.5,spike:.85};function eM(i,t,e){switch(i){case"cone":return new Le(t*1.15,t*e.range(2.2,3.2),e.int(5,8));case"wedge":return new Le(t*1.3,t*e.range(1.6,2.2),4);case"drum":return new zt(t*1.1,t*1.15,t*e.range(1.1,1.7),7);case"block":return new et(t*1.7,t*e.range(1.6,2.3),t*1.5);case"spike":return new qs(t*1.3,0);case"orb":default:return new ge(t,0)}}function nM(i,t,e,n){switch(i.int(0,3)){case 0:return{geometry:new et(t*2,n,t*1.3),halfDepth:t*.65};case 1:return{geometry:new zt(e,t,n,i.int(5,7)),halfDepth:t*.85};case 2:return{geometry:new zt(t,e,n,4),halfDepth:t*.75};default:return{geometry:new zt(t,e,n,i.int(5,7)),halfDepth:t*.85}}}function nu(i,t,e,n){return i?new et(t*2,n,t*2):new zt(t,e,n,5)}function Tn(i,t,e=0){return new C(t*(i.reach+.03+e),i.hold,.16)}const iM=[(i,t,e)=>{const n=i.range(.11,.16),s=Tn(t,e,n*.6),r=new zt(n*.6,n*.4,n,7);return r.translate(s.x,s.y+n/2,s.z),[{geometry:r,color:i.pick([z.WOOL,z.RUST]),sway:0}]},(i,t,e)=>{const n=i.range(.14,.2),s=Tn(t,e,n),r=new ge(n,0);r.scale(1,1.15,1),r.translate(s.x,s.y+n*.7,s.z);const o=new zt(n*.32,n*.45,n*.8,6);o.translate(s.x,s.y+n*1.8,s.z);const a=i.pick([z.RUST,z.COW_BLACK]);return[{geometry:r,color:a,sway:0},{geometry:o,color:a,sway:0}]},(i,t,e)=>{const n=i.range(.1,.15),s=Tn(t,e,n),r=new ge(n,0);return r.scale(1,i.range(.7,.95),i.range(.8,1.1)),r.rotateX(i.range(0,Math.PI)),r.rotateY(i.range(0,Math.PI)),r.translate(s.x,s.y,s.z),[{geometry:r,color:i.pick([z.STONE_DARK,z.COW_BLACK]),sway:0}]},(i,t,e)=>{const n=[],s=Tn(t,e,.04),r=i.range(.28,.45),o=new zt(.012,.016,r,4);o.translate(s.x,s.y+r/2,s.z),n.push({geometry:o,color:z.BARK,sway:.45});const a=i.int(3,6);for(let l=0;l<a;l++){const c=new ge(i.range(.055,.085),0);c.scale(1,.4,.85),c.rotateY(i.range(0,Math.PI)),c.rotateZ(i.around(0,.5)),c.translate(s.x+i.around(0,.07),s.y+r*i.range(.6,1.05),s.z+i.around(0,.06)),n.push({geometry:c,color:z.LEAF,sway:.7})}return n},(i,t,e)=>{const n=i.range(.11,.16),s=Tn(t,e,n*1.5),r=new ge(n,0);return r.scale(1.5,.75,.9),r.rotateY(i.around(0,.4)),r.translate(s.x,s.y+.03,s.z),[{geometry:r,color:i.pick([z.BARK_PALE,z.MARKER_YELLOW]),sway:0}]},(i,t,e)=>{const n=i.range(.16,.23),s=Tn(t,e,n),r=new ge(n,0);return r.scale(1,i.range(.8,1.05),.9),r.rotateX(i.range(0,Math.PI)),r.translate(s.x,s.y+.06,s.z),[{geometry:r,color:i.pick([z.WOOL,z.RUST]),sway:0}]},(i,t,e)=>{const n=i.range(.2,.28),s=Tn(t,e,n*.55),r=new et(n*.75,n,.03);return r.rotateZ(e*i.range(.15,.45)),r.translate(s.x,s.y+n*.3,s.z),[{geometry:r,color:i.pick([z.COW_BLACK,z.WOOL]),sway:0}]},(i,t,e)=>{const n=Tn(t,e,.07),s=i.range(.1,.18),r=new zt(.01,.01,s,4);r.translate(n.x,n.y+s/2,n.z);const o=new et(.12,.15,.12);o.translate(n.x,n.y-.07,n.z);const a=new Le(.095,.06,4);return a.translate(n.x,n.y+.02,n.z),[{geometry:r,color:z.IRON,sway:0},{geometry:o,color:z.MARKER_YELLOW,sway:0},{geometry:a,color:z.IRON,sway:0}]},(i,t,e)=>{const n=i.range(.24,.36),s=Tn(t,e,n*.5),r=new qs(n*.36,0);r.scale(1.9,.85,.5),r.rotateZ(e*.8),r.translate(s.x,s.y-n*.25,s.z);const o=new Le(n*.16,n*.24,3);return o.scale(1,1,.4),o.rotateZ(e*.8+Math.PI),o.translate(s.x+e*n*.32,s.y-n*.25-n*.42,s.z),[{geometry:r,color:z.STONE_PALE,sway:0},{geometry:o,color:z.STONE,sway:0}]}],ga=[{name:"held",weight:.52,build:(i,t,e)=>i.pick(iM)(i,t,e)},{name:"pauldron",weight:.18,build:(i,t,e)=>{const n=new ge(i.range(.09,.14),0);return n.scale(1.15,.65,1.05),n.rotateY(i.range(0,Math.PI)),n.translate(e*(t.chest+.04),t.shoulder-.02,0),[{geometry:n,color:z.IRON,sway:0}]}},{name:"pack",weight:.19,build:(i,t,e)=>{const n=i.range(.2,.32),s=i.range(.24,.4),r=i.range(.12,.2),o=new et(n,s,r);return o.rotateY(i.around(0,.2)),o.translate(e*i.range(0,.07),t.shoulder-s*.55,-(t.depth+r*.4)),[{geometry:o,color:z.TIMBER_DARK,sway:0}]}},{name:"horn",weight:.08,build:(i,t,e)=>{const n=i.range(.14,.3),s=new Le(i.range(.02,.035),n,4);return s.translate(0,n/2,0),s.rotateZ(e*i.range(.5,1.1)),s.rotateX(i.around(0,.3)),s.translate(e*.05,t.height*.97,0),[{geometry:s,color:z.SKIN,sway:0}]}}];function iu(i){let t=i()*ga.reduce((e,n)=>e+n.weight,0);for(const e of ga)if(t-=e.weight,t<=0)return e;return ga[0]}const Ls={name:"figure",category:"people",radius:.55,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.range(1.55,2.05),r=e.range(.72,1.24),o=s*e.range(.44,.58),a=s*e.range(.78,.87),l=e.pick([z.CLOTH,z.TIMBER_DARK,z.STONE_DARK]),c=e.chance(.45),h=e.chance(.5)?1:-1,u=.19*r*e.range(.8,1.25),d=.15*r*e.range(.8,1.3),{geometry:p,halfDepth:g}=nM(e,u,d,a-o);p.translate(0,(a+o)/2,0),p.rotateY(e.around(0,.25)),n.push({geometry:p,color:l,sway:0});const x=e.range(.04,.22),m=new zt(.045,.06,x,5);m.translate(0,a+x/2,0),n.push({geometry:m,color:z.SKIN,sway:0});const f=e.range(.085,.15),_=Qy(e),v=eM(_,f,e);v.scale(e.range(.82,1.08),e.range(.95,1.3),e.range(.85,1.12)),v.rotateZ(e.around(0,.16)),v.rotateY(e.range(0,Math.PI)),v.computeBoundingBox();const y=f*tM[_];v.translate(0,a+x-y-(v.boundingBox?.min.y??0),0),n.push({geometry:v,color:c?l:z.SKIN,sway:0});const w=e.range(.045,.075)*r,E=e.range(.03,.055)*r,A=(a-o)*e.range(.95,1.5),L=e.chance(.25),S=e.range(-.02,.09),M=e.range(.06,.11)*r,R=e.chance(.25),I=e.range(.04,.22);for(const X of[-1,1]){const H=o,Z=nu(L,w,w*.8,H);Z.translate(0,-H/2,0),Z.rotateZ(X*S),Z.translate(X*M,o,0),n.push({geometry:Z,color:z.TIMBER_DARK,sway:0});const V=nu(R,E,E*.82,A);V.translate(0,-A/2,0),V.rotateZ(X*I),V.translate(X*(u+E*1.4),a-.03,0),n.push({geometry:V,color:l,sway:0})}const U={height:s,shoulder:a,hip:o,chest:u,reach:u+E*2.6,hold:a-A*.82,depth:g};e.chance(.62)&&(n.push(...iu(e).build(e,U,h)),e.chance(.22)&&n.push(...iu(e).build(e,U,h)));const B=ce(n);return t!==1&&B.scale(t,t,t),he(B,"figure",0)}},sM=Object.freeze(Object.defineProperty({__proto__:null,figure:Ls},Symbol.toStringTag,{value:"Module"})),Td={name:"grass",category:"foliage",radius:.55,solid:!1,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.int(30,46);for(let o=0;o<s;o++){const a=e.range(.16,.6),l=new Le(e.range(.016,.032),a,3);l.translate(0,a/2,0),l.scale(1,1,e.range(.3,.55));const c=e.range(.1,.75)*(a/.6);l.rotateZ(e.chance(.5)?c:-c),l.rotateY(e.range(0,Math.PI*2));const h=e.range(0,Math.PI*2),u=Math.sqrt(e())*.26;l.translate(Math.cos(h)*u,0,Math.sin(h)*u),n.push({geometry:l,color:e.chance(.3)?z.GRASS_DRY:z.GRASS,sway:(d,p)=>Math.max(0,p/a)**1.5})}const r=ce(n);return t!==1&&r.scale(t,t,t),he(r,"grass",e()*Math.PI*2)}},rM=Object.freeze(Object.defineProperty({__proto__:null,grass:Td},Symbol.toStringTag,{value:"Module"})),Ql={name:"hut",category:"structures",radius:2.6,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.range(3,4.4),r=e.range(2.6,3.8),o=e.range(2,2.6),a=e.range(.4,.8),l=e.range(.9,1.5),c=new zt(l,l,s*1.16,3,1);c.rotateZ(Math.PI/2),c.rotateX(Math.PI/6),c.scale(1,1,r*1.2/(l*2)),c.computeBoundingBox(),c.translate(0,o-(c.boundingBox?.min.y??0),0),n.push({geometry:c,color:z.STONE,sway:0});const h=o,u=new et(s,a,r);u.translate(0,a/2,0),n.push({geometry:u,color:z.STONE_DARK,sway:0});const d=new et(s*.97,h-a,r*.97);d.translate(0,a+(h-a)/2,0),n.push({geometry:d,color:z.TIMBER,sway:0});const p=e.range(.75,.95),g=e.range(1.5,1.8),x=e.around(0,s*.15),m=new et(p,g,.08);m.translate(x,g/2,r*.487),n.push({geometry:m,color:1514012,sway:0});const f=new et(p*1.3,.14,.16);f.translate(x,g+.07,r*.49),n.push({geometry:f,color:z.TIMBER_DARK,sway:0});for(const w of[-1,1])for(const E of[-1,1]){const A=new et(.16,h,.16);A.translate(w*s/2,h/2,E*r/2),n.push({geometry:A,color:z.TIMBER_DARK,sway:0})}const _=ce(n);t!==1&&_.scale(t,t,t);const v=he(_,"hut",0),y={x:x*t,z:r*.487*t,width:p*t,height:g*t};return v.userData.doorAnchor=y,v}};function Ad(i){return i.userData.doorAnchor}const oM=Object.freeze(Object.defineProperty({__proto__:null,hut:Ql,hutDoorAnchor:Ad},Symbol.toStringTag,{value:"Module"})),bs={name:"machine",category:"structures",radius:1.6,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.range(2.1,2.8),r=e.range(.9,1.3),o=e.range(.32,.46),a=e.chance(.5)?z.IRON:z.STONE_DARK,l=e.chance(.6)?z.RUST:z.IRON,c=new et(s,o,r);c.translate(0,o/2,0),n.push({geometry:c,color:z.STONE_DARK,sway:0});for(const R of[-1,1])for(const I of[-1,1]){const U=new et(.22,.08,.22);U.translate(R*(s-.3)/2,.04,I*(r-.3)/2),n.push({geometry:U,color:l,sway:0})}const h=e.range(.34,.46),u=s*e.range(.62,.74),d=new zt(h,h,u,10);d.rotateZ(Math.PI/2),d.translate(-s*.12,o+h,0),n.push({geometry:d,color:a,sway:0});for(const R of[-.28,.08,.34]){const I=new zt(h*1.06,h*1.06,.07,10);I.rotateZ(Math.PI/2),I.translate(-s*.12+u*R,o+h,0),n.push({geometry:I,color:l,sway:0})}const p=e.range(.52,.72),g=s/2+e.range(.12,.22),x=o+p*.82,m=new zt(p,p,.12,12);m.rotateZ(Math.PI/2),m.translate(g,x,0),n.push({geometry:m,color:a,sway:0});const f=new zt(.14,.14,.2,8);f.rotateZ(Math.PI/2),f.translate(g,x,0),n.push({geometry:f,color:l,sway:0});const _=e.chance(.5)?4:3;for(let R=0;R<_;R++){const I=new et(.07,p*1.85,.06);I.rotateX(Math.PI/2),I.rotateX(R/_*Math.PI),I.translate(g,x,0),n.push({geometry:I,color:xe(a,.86),sway:0})}const v=new et(.3,x-o+.1,.26);v.translate(g,o+(x-o)/2,0),n.push({geometry:v,color:z.STONE_DARK,sway:0});const y=new et(s*.42,.08,.08);y.translate(s*.16,o+h*.55,p*.42),n.push({geometry:y,color:l,sway:0});const w=e.range(1.1,1.8),E=e.range(.11,.16),A=new zt(E*.85,E,w,8);A.translate(-s*.3,o+h*2+w/2-.1,0),n.push({geometry:A,color:a,sway:0});const L=new zt(E*1.3,E*1.1,.1,8);L.translate(-s*.3,o+h*2+w-.14,0),n.push({geometry:L,color:l,sway:0});const S=e.int(1,2);for(let R=0;R<S;R++){const I=e.range(-.3,.25),U=new zt(.07,.09,e.range(.16,.26),6);U.translate(-s*.12+u*I,o+h*2,0),n.push({geometry:U,color:l,sway:0});const B=new zt(.1,.1,.035,8);B.translate(-s*.12+u*I,o+h*2+.16,0),n.push({geometry:B,color:xe(l,1.2),sway:0})}const M=ce(n);return t!==1&&M.scale(t,t,t),he(M,"machine",0)}},aM=Object.freeze(Object.defineProperty({__proto__:null,machine:bs},Symbol.toStringTag,{value:"Module"})),Rd={name:"mushroom",category:"foliage",radius:.4,solid:!1,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.int(3,7),r=e.pick([z.RUST,z.EARTH,z.STONE_PALE,z.BARK_PALE]);for(let a=0;a<s;a++){const l=e(),c=e.range(.04,.12)*(.45+l*.8),h=c*e.range(1.6,3.2),u=e.range(0,Math.PI*2),d=Math.sqrt(e())*.22,p=Math.cos(u)*d,g=Math.sin(u)*d,x=e.around(0,.22),m=new zt(c*.22,c*.3,h,5);m.translate(0,h/2,0),m.rotateZ(x),m.translate(p,0,g),n.push({geometry:m,color:z.CLOTH,sway:0});const f=c*(.85+l*.7),_=c*(1.5-l*1.05),v=new Le(f,_,e.int(6,9));v.translate(0,_/2-_*.15,0),v.rotateZ(x),v.translate(p,h,g),n.push({geometry:v,color:r,sway:0})}const o=ce(n);return t!==1&&o.scale(t,t,t),he(o,"mushroom",0)}},lM=Object.freeze(Object.defineProperty({__proto__:null,mushroom:Rd},Symbol.toStringTag,{value:"Module"})),cM={length:[.95,1.25],girth:[.55,.7],legLength:[.34,.46],legThickness:.045,neck:[.18,.28],neckRise:[.2,.5],headSize:[.13,.17],headStretch:1.4,snout:.5,ears:"side",horns:"none",tail:"switch",woolly:!0,hide:[z.HIDE_DARK,z.STONE_DARK],extremity:z.HIDE_DARK},Cd={name:"ovine",category:"animals",radius:.8,build:(i={})=>po("ovine",cM,se(i.seed??1),i)},hM=Object.freeze(Object.defineProperty({__proto__:null,ovine:Cd},Symbol.toStringTag,{value:"Module"})),uM={length:[1.1,1.5],girth:[.6,.78],legLength:[.25,.36],legThickness:.055,neck:[.1,.2],neckRise:[0,.2],headSize:[.19,.24],headStretch:1.45,snout:.75,ears:"floppy",horns:"none",tail:"curl",woolly:!1,hide:[z.HOG,z.HIDE_PALE,z.HIDE_DARK],extremity:z.HOG,patch:[z.HIDE_DARK,z.HIDE],patchCoverage:.3},Pd={name:"porcine",category:"animals",radius:.95,build:(i={})=>po("porcine",uM,se(i.seed??1),i)},dM=Object.freeze(Object.defineProperty({__proto__:null,porcine:Pd},Symbol.toStringTag,{value:"Module"})),tc={name:"post",category:"structures",radius:.4,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.range(.9,2.1),r=e.range(.07,.13),o=e.range(.02,.16),a=e.range(0,Math.PI*2),l=new et(r*2,s,r*2);if(l.translate(0,s/2,0),l.rotateZ(o),l.rotateY(a),n.push({geometry:l,color:z.TIMBER,sway:0}),e.chance(.4)){const h=e.range(.5,1.1),u=new et(h,r*1.4,r*1.4);u.translate(0,s*e.range(.6,.85),0),u.rotateZ(o),u.rotateY(a+e.around(0,.3)),n.push({geometry:u,color:z.TIMBER_DARK,sway:0})}if(e.chance(.45)){const h=new et(r*2.5,.09,r*2.5);h.translate(0,s-.09,0),h.rotateZ(o),h.rotateY(a),n.push({geometry:h,color:z.RUST,sway:0})}const c=ce(n);return t!==1&&c.scale(t,t,t),he(c,"post",0)}},fM=Object.freeze(Object.defineProperty({__proto__:null,post:tc},Symbol.toStringTag,{value:"Module"})),Ld={name:"poultry",category:"animals",radius:.35,solid:!1,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.range(.16,.23),r=e.range(.09,.16),o=e.pick([z.FOWL,z.HIDE_PALE,z.HIDE_DARK,z.CLOTH]),a=r+s*.75,l=new ge(s,0);l.scale(.8,.95,1.25),l.rotateX(e.range(.15,.35)),l.translate(0,a,0),n.push({geometry:l,color:o,sway:0});const c=s*e.range(.42,.55),h=new C(0,a+s*e.range(.75,1.05),s*.6),u=new zt(s*.2,s*.28,s*.55,5);u.rotateX(-.5),u.translate(0,a+s*.5,s*.42),n.push({geometry:u,color:o,sway:0});const d=new ge(c,0);d.translate(h.x,h.y,h.z),n.push({geometry:d,color:o,sway:0});const p=new Le(c*.35,c*.8,4);p.rotateX(Math.PI/2),p.translate(h.x,h.y-c*.15,h.z+c*.9),n.push({geometry:p,color:z.MARKER_YELLOW,sway:0});const g=e.int(2,4);for(let f=0;f<g;f++){const _=f/Math.max(g-1,1),v=new Le(c*.14,c*(.7-_*.3),3);v.scale(1,1,.4),v.translate(h.x,h.y+c*.95,h.z-_*c*.7),n.push({geometry:v,color:z.COMB,sway:.4})}if(e.chance(.6)){const f=new ge(c*.22,0);f.scale(.5,1.1,.7),f.translate(h.x,h.y-c*.75,h.z+c*.5),n.push({geometry:f,color:z.COMB,sway:.3})}const x=e.int(3,5);for(let f=0;f<x;f++){const _=(f/Math.max(x-1,1)-.5)*.8,v=new Le(s*.2,s*e.range(.9,1.4),3);v.scale(1,1,.35),v.translate(0,s*.55,0),v.rotateX(e.range(-1.1,-.7)),v.rotateY(_),v.translate(0,a+s*.35,-s*.85),n.push({geometry:v,color:o,sway:.45})}for(const f of[-1,1]){const _=a,v=new zt(s*.055,s*.05,_,4);v.translate(0,_/2,0),v.rotateZ(f*e.range(0,.12)),v.translate(f*s*.24,0,e.around(0,s*.1)),n.push({geometry:v,color:z.MARKER_YELLOW,sway:0});const y=new Le(s*.13,s*.09,3);y.rotateX(Math.PI),y.translate(f*s*.24,s*.04,s*.06),n.push({geometry:y,color:z.MARKER_YELLOW,sway:0})}const m=ce(n);return m.rotateY(e.range(0,Math.PI*2)),t!==1&&m.scale(t,t,t),he(m,"poultry",e()*Math.PI*2)}},pM=Object.freeze(Object.defineProperty({__proto__:null,poultry:Ld},Symbol.toStringTag,{value:"Module"})),Dd={name:"rock",category:"nature",radius:.9,build({seed:i=1,scale:t=1}={}){const e=se(i),n=e.range(.35,1.1),s=new ge(n,n>.7?1:0);s.deleteAttribute("normal"),s.deleteAttribute("uv");const r=Kl(s);s.dispose();const o=r.getAttribute("position"),a=new C;for(let h=0;h<o.count;h++)a.fromBufferAttribute(o,h),a.multiplyScalar(e.range(.72,1.28)),o.setXYZ(h,a.x,a.y,a.z);o.needsUpdate=!0,r.scale(1,e.range(.6,.85),e.range(.85,1.15)),r.translate(0,n*e.range(.28,.45),0),r.computeVertexNormals();const l=[{geometry:r,color:e.chance(.3)?z.STONE_DARK:z.STONE,sway:0}],c=ce(l);return t!==1&&c.scale(t,t,t),he(c,"rock",0)}},mM=Object.freeze(Object.defineProperty({__proto__:null,rock:Dd},Symbol.toStringTag,{value:"Module"})),Sl={name:"stool",category:"furniture",radius:.42,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.chance(.45)?3:4,r=e.range(.42,.56),o=e.range(.16,.23),a=e.range(.04,.07),l=e.chance(.5)?z.TIMBER:z.TIMBER_DARK,c=l===z.TIMBER?z.TIMBER_DARK:z.TIMBER,h=s===3?new zt(o,o*.96,a,6):new et(o*1.9,a,o*1.9);h.translate(0,r-a/2,0),s===4&&h.rotateY(e.around(0,.2)),n.push({geometry:h,color:l,sway:0});const u=r-a,d=e.range(.14,.26),p=o*.66,g=u/Math.cos(d);for(let f=0;f<s;f++){const _=f/s*Math.PI*2+(s===4?Math.PI/4:0),v=e.range(.035,.05),y=Math.cos(_),w=Math.sin(_),E=new et(v,g,v);E.translate(0,-g/2,0),E.rotateZ(d),E.rotateY(-_),E.translate(y*p,u,w*p),n.push({geometry:E,color:c,sway:0})}const x=p+g*Math.sin(d);if(s===4&&e.chance(.45)){const f=e.range(.28,.38),_=p+(x-p)*(1-f);for(const v of[0,Math.PI/2]){const y=new et(_*2,.028,.028);y.translate(0,u*f,0),y.rotateY(v+Math.PI/4),n.push({geometry:y,color:c,sway:0})}}const m=ce(n);return t!==1&&m.scale(t,t,t),he(m,"stool",0)}},gM=Object.freeze(Object.defineProperty({__proto__:null,stool:Sl},Symbol.toStringTag,{value:"Module"})),_M=22,vM=12,xM=16767392,su=Math.SQRT2,yM={name:"streetlamp",category:"structures",radius:.9,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=[],r=e.range(2.9,3.6),o=e.range(.046,.062),a=e.range(.34,.5),l=e.chance(.35)?z.RUST:z.IRON,c=e.chance(.5)?z.STONE:z.STONE_DARK,h=o*6.2,u=new et(h,.15,h);u.translate(0,.075,0),n.push({geometry:u,color:xe(c,e.around(1,.06)),sway:0});const d=new et(o*4.2,.12,o*4.2);d.translate(0,.2,0),n.push({geometry:d,color:xe(l,1.05),sway:0});const p=.24,g=e.int(3,4),x=(r-p)/g;for(let mt=0;mt<g;mt++){const tt=1-.28*(mt/g),ht=o*2*tt,at=new et(ht,x*1.06,ht);at.translate(0,p+x*(mt+.5),0),n.push({geometry:at,color:xe(l,e.around(1,.07)),sway:0})}const m=o*2*(1-.28*(g-1)/g),f=m*.78,_=r-f*.62,v=new et(a+f,f,f);v.translate(a/2,_,0),n.push({geometry:v,color:xe(l,.94),sway:0});const y=o*.5,w=_-e.range(.36,.5),E=a*.72,A=_-f*.5,L=E-y,S=A-w,M=Math.hypot(L,S)*1.18,R=new et(o*1.05,M,o*1.05);R.translate(0,M*.41,0),R.rotateZ(-Math.atan2(L,S)),R.translate(y,w,0),n.push({geometry:R,color:xe(l,.88),sway:0});const I=new et(m*1.9,.07,m*1.9);if(I.translate(0,r-.02,0),n.push({geometry:I,color:xe(l,1.1),sway:0}),e.chance(.5)){const mt=new Le(m*.6,.16,4);mt.rotateY(Math.PI/4),mt.translate(0,r+.07,0),n.push({geometry:mt,color:xe(l,1),sway:0})}const U=a,B=_-f/2,X=e.range(.05,.1),H=new et(o*.8,X*1.6,o*.8);H.translate(U,B-X*.5,0),n.push({geometry:H,color:xe(l,.86),sway:0});const Z=e.range(.115,.145),V=e.range(.26,.34),ct=B-X,ut=.13,xt=new zt(Z*.45*su,Z*1.28*su,ut,4);xt.rotateY(Math.PI/4),xt.translate(U,ct-ut/2+.01,0),n.push({geometry:xt,color:xe(l,1.02),sway:0});const Nt=o*.75;for(const mt of[-1,1])for(const tt of[-1,1]){const ht=new et(Nt,V*1.1,Nt);ht.translate(U+mt*(Z-Nt*.5),ct-ut-V/2+.02,tt*(Z-Nt*.5)),n.push({geometry:ht,color:xe(l,.9),sway:0})}const Zt=ct-ut-V,Y=o*.9,it=Z*2.2;for(const mt of[0,1])for(const tt of[-1,1]){const ht=mt===0,at=new et(ht?it:Y,.06,ht?Y:it-Y*1.8),Dt=it/2-Y/2;at.translate(U+(ht?0:tt*Dt),Zt-.01,ht?tt*Dt:0),n.push({geometry:at,color:xe(l,.8),sway:0})}const St=Zt+V*.5,ot=new qs(Z*.5,0);ot.scale(1,1.6,1),ot.translate(U,St,0),s.push({geometry:ot,color:z.LAMPLIGHT,sway:0});const Ct=ce(n),It=ce(s),Lt=e.range(0,Math.PI*2);Ct.rotateY(Lt),It.rotateY(Lt),t!==1&&(Ct.scale(t,t,t),It.scale(t,t,t));const Xt=he(Ct,"streetlamp",0);Xt.add(vx(It,"streetlamp:glow"));const j=Math.cos(Lt)*U*t,rt=-Math.sin(Lt)*U*t,D=new qv(xM,_M*e.around(1,.12)*t*t,vM*t,2);return D.position.set(j,St*t,rt),D.castShadow=!1,Xt.add(D),Xt}},MM=Object.freeze(Object.defineProperty({__proto__:null,streetlamp:yM},Symbol.toStringTag,{value:"Module"})),Id={name:"stump",category:"foliage",radius:.75,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.range(.3,.7),r=e.range(.22,.36),o=r*e.range(1.25,1.6),a=e.int(6,9),l=e.range(0,.12),c=new zt(r,o,s,a);c.translate(0,s/2,0),c.rotateZ(l),n.push({geometry:c,color:z.BARK,sway:0});const h=new zt(r*.94,r*.94,.04,a);h.translate(0,s,0),h.rotateZ(l),n.push({geometry:h,color:z.BARK_PALE,sway:0});const u=e.int(3,6);for(let p=0;p<u;p++){const g=e.range(.3,.6),x=new zt(.04,.11,g,4);x.translate(0,-g/2,0),x.rotateZ(e.range(1.05,1.45)),x.rotateY(p/u*Math.PI*2+e.around(0,.5)),x.translate(0,e.range(.05,.16),0),n.push({geometry:x,color:z.BARK,sway:0})}const d=ce(n);return t!==1&&d.scale(t,t,t),he(d,"stump",0)}},SM=Object.freeze(Object.defineProperty({__proto__:null,stump:Id},Symbol.toStringTag,{value:"Module"})),ru=[{weight:.28,width:[.7,1],depth:[.5,.68]},{weight:.47,width:[1.2,1.7],depth:[.7,.95]},{weight:.25,width:[2.1,3],depth:[.85,1.1]}],Hs={name:"table",category:"furniture",radius:1.6,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[];let s=e(),r=ru[1];for(const _ of ru)if(s-=_.weight,s<=0){r=_;break}const o=e.range(r.width[0],r.width[1]),a=e.range(r.depth[0],r.depth[1]),l=e.range(.68,.78),c=e.range(.045,.07),h=o>1.5&&e.chance(.45),u=e.chance(.6)?z.TIMBER:z.TIMBER_DARK,d=u===z.TIMBER?z.TIMBER_DARK:z.TIMBER,p=e.int(3,5),g=a/p,x=.008;for(let _=0;_<p;_++){const v=new et(o,c*e.range(.93,1),g-x);v.translate(0,l-c/2,-a/2+(_+.5)*g),n.push({geometry:v,color:xe(u,e.around(1,.07)),sway:0})}const m=l-c;if(h){const _=o*e.range(.16,.24);for(const y of[-1,1]){const w=y*(o/2-_),E=new et(.09,.07,a*.86);E.translate(w,.035,0),n.push({geometry:E,color:d,sway:0});const A=e.range(.09,.13),L=new et(A,m-.07,a*.2);L.translate(w,.07+(m-.07)/2,0),n.push({geometry:L,color:d,sway:0});const S=new et(.09,.06,a*.8);S.translate(w,m-.03,0),n.push({geometry:S,color:d,sway:0})}const v=new et(o-_*1.2,.07,.07);v.translate(0,m*e.range(.32,.42),0),n.push({geometry:v,color:d,sway:0})}else{const _=e.range(.055,.085),v=o/2-_*.9,y=a/2-_*.9;for(const w of[-1,1])for(const E of[-1,1]){const A=new et(_,m,_);A.translate(w*v,m/2,E*y),n.push({geometry:A,color:d,sway:0})}if(e.chance(.7)){for(const E of[-1,1]){const A=new et(v*2,.07,.03);A.translate(0,m-.07/2-.02,E*y),n.push({geometry:A,color:d,sway:0})}for(const E of[-1,1]){const A=new et(.03,.07,y*2);A.translate(E*v,m-.07/2-.02,0),n.push({geometry:A,color:d,sway:0})}}}const f=ce(n);return t!==1&&f.scale(t,t,t),he(f,"table",0)}},bM=Object.freeze(Object.defineProperty({__proto__:null,table:Hs},Symbol.toStringTag,{value:"Module"})),Ud={name:"trough",category:"objects",radius:1.1,build({seed:i=1,scale:t=1}={}){const e=se(i),n=[],s=e.range(1.4,2.1),r=e.range(.5,.75),o=e.range(.4,.6),a=e.range(.09,.14),l=e.chance(.55),c=l?z.STONE:z.TIMBER,h=new et(s,a,r);h.translate(0,a/2,0),n.push({geometry:h,color:l?z.STONE_DARK:z.TIMBER_DARK,sway:0});for(const d of[-1,1]){const p=new et(s*.99,o,a);p.translate(0,o/2,d*(r-a)/2),n.push({geometry:p,color:c,sway:0});const g=new et(a,o*.985,r*.985);g.translate(d*(s-a)/2,o/2,0),n.push({geometry:g,color:c,sway:0})}if(e.chance(.6)){const d=new et(s-a*2,.03,r-a*2);d.translate(0,o*e.range(.55,.78),0),n.push({geometry:d,color:2899782,sway:0})}const u=ce(n);return u.rotateY(e.range(0,Math.PI)),t!==1&&u.scale(t,t,t),he(u,"trough",0)}},wM=Object.freeze(Object.defineProperty({__proto__:null,trough:Ud},Symbol.toStringTag,{value:"Module"})),EM=Object.assign({"./builders/archway.ts":Ly,"./builders/barrel.ts":Dy,"./builders/bed.ts":Iy,"./builders/bovine.ts":zy,"./builders/bush.ts":Kx,"./builders/cairn.ts":Hy,"./builders/chair.ts":Gy,"./builders/crate.ts":Vy,"./builders/door.ts":$y,"./builders/equine.ts":Zy,"./builders/fence.ts":jy,"./builders/figure.ts":sM,"./builders/grass.ts":rM,"./builders/hut.ts":oM,"./builders/machine.ts":aM,"./builders/mushroom.ts":lM,"./builders/ovine.ts":hM,"./builders/porcine.ts":dM,"./builders/post.ts":fM,"./builders/poultry.ts":pM,"./builders/rock.ts":mM,"./builders/stool.ts":gM,"./builders/streetlamp.ts":MM,"./builders/stump.ts":SM,"./builders/table.ts":bM,"./builders/tree.ts":$x,"./builders/trough.ts":wM});function TM(i){if(typeof i!="object"||i===null)return!1;const t=i;return typeof t.name=="string"&&typeof t.radius=="number"&&typeof t.build=="function"}const AM=Object.values(EM).flatMap(i=>Object.values(i)).filter(TM).sort((i,t)=>i.name.localeCompare(t.name)),ou=["foliage","nature","animals","structures","furniture","objects","people"],RM=8,CM=1.4,PM=5;function Nd(){const i=t=>{const e=ou.indexOf(t.category);return e===-1?ou.length:e};return[...AM].sort((t,e)=>i(t)-i(e)||t.name.localeCompare(e.name))}function LM(i={}){const t=i.origin??new C(-24,0,56),e=i.depth??4,n=new Pe;n.name="Gallery";const s=Nd();let r=t.x;for(let o=0;o<s.length;o++){const a=s[o],l=s[o+1],c=l!==void 0&&l.category!==a.category,h=l?a.radius+l.radius+CM+(c?PM:0):0,u=new Pe;u.name=`gallery:${a.name}`;const d=new $t(new et(.5,.12,.5),new Dn({color:3028544,flatShading:!0}));d.position.set(r,.06,t.z+e),u.add(d);for(let p=0;p<RM;p++){const g=a.build({seed:1e3+p*7919});g.position.set(r,0,t.z-p*e),u.add(a.solid===!1?g:Se(g))}n.add(u),r+=h}return n.position.y=t.y,n}function DM(){const i=[];let t="";for(const e of Nd())e.category!==t&&(t=e.category,i.push(`[${t}]`)),i.push(e.name);return i.join(" · ")}const _a={open:{rt60:.7,preDelay:.012,damping:.7,wet:.12},cell:{rt60:.45,preDelay:.004,damping:.55,wet:.3},hall:{rt60:4.2,preDelay:.035,damping:.18,wet:.62}};async function IM(i,t){const e=Math.max(t.rt60,.05),n=Math.ceil(i*(e+t.preDelay)),s=new OfflineAudioContext(2,n,i),r=s.createBufferSource();r.buffer=UM(s,n,i,t);const o=s.createBiquadFilter();o.type="lowpass",o.frequency.value=700+(1-t.damping)**2*17300;const a=s.createBiquadFilter();return a.type="highpass",a.frequency.value=90,r.connect(o).connect(a).connect(s.destination),r.start(0),s.startRendering()}function UM(i,t,e,n){const s=i.createBuffer(2,t,e),r=Math.floor(n.preDelay*e),o=Math.exp(-Math.log(1e3)/(n.rt60*e));for(let a=0;a<2;a++){const l=s.getChannelData(a);let c=1;for(let h=r;h<t;h++)l[h]=(Math.random()*2-1)*c,c*=o}return s}const va=[1,.4,.2,.1],NM=[1,2.7,6.1,13.3],OM=.11;function au(i){let t=Math.imul(i|0,668265261);return t^=t>>>15,t=Math.imul(t,2246822507),t^=t>>>13,(t>>>0)/4294967296}function Od(i){const t=Math.floor(i),e=i-t,n=(1-Math.cos(e*Math.PI))*.5;return au(t)*(1-n)+au(t+1)*n}const FM=1.35;function BM(i){let t=0,e=0;for(let s=0;s<va.length;s++)t+=Od(i*NM[s]+s*17.3)*va[s],e+=va[s];const n=t/e;return Math.min(1,Math.max(0,.5+(n-.5)*FM))}const zM={windSpeed:.5,gustDepth:.6,gustRate:.06,windDirection:2.1};class kM{settings={...zM};gust=0;swell=.5;strength=0;time=0;update(t){this.time+=t*this.settings.gustRate,this.gust=BM(this.time),this.swell=Od(this.time*OM+91.7);const{windSpeed:e,gustDepth:n}=this.settings,s=e*(.45+this.swell*1.1);this.strength=Math.min(1,Math.max(0,s+(this.gust-.5)*n))}}const HM={masterVolume:.7,reverbAmount:1,airAbsorption:.65,occlusion:.8},GM=.12;class VM{context;settings={...HM};weather=new kM;dry;send;duck;master;noise=null;ready;started=!1;rooms=new Map;currentRoom=null;occlusionTimer=0;constructor(){this.context=new AudioContext({latencyHint:"interactive"}),this.master=this.context.createGain(),this.duck=this.context.createGain(),this.dry=this.context.createGain(),this.send=this.context.createGain();const t=this.context.createDynamicsCompressor();t.threshold.value=-6,t.knee.value=6,t.ratio.value=12,t.attack.value=.003,t.release.value=.25,this.dry.connect(this.duck),this.duck.connect(this.master),this.master.connect(t),t.connect(this.context.destination),this.ready=this.build(),this.listenForGesture(),document.addEventListener("visibilitychange",this.handleVisibility)}async build(){this.noise=cy(this.context);const t=Object.keys(_a),e=await Promise.all(t.map(n=>IM(this.context.sampleRate,_a[n])));t.forEach((n,s)=>{const r=this.context.createConvolver();r.normalize=!0,r.buffer=e[s];const o=this.context.createGain();o.gain.value=0,this.send.connect(r),r.connect(o),o.connect(this.duck),this.rooms.set(n,{convolver:r,gain:o})}),this.currentRoom!==null&&this.setRoom(this.currentRoom)}setRoom(t,e=.45){if(this.currentRoom=t,this.rooms.size===0)return;const n=this.context.currentTime;for(const[s,r]of this.rooms){const o=s===t?_a[s].wet*this.settings.reverbAmount:0;r.gain.gain.cancelScheduledValues(n),r.gain.gain.setTargetAtTime(o,n,e/3)}}get room(){return this.currentRoom}update(t,e){return this.weather.update(t),this.updateListener(e),this.master.gain.value=this.settings.masterVolume,this.occlusionTimer-=t,this.occlusionTimer>0?!1:(this.occlusionTimer=GM,!0)}updateListener(t){const e=this.context.listener;if(t.updateWorldMatrix(!0,!1),Wn.setFromMatrixPosition(t.matrixWorld),oi.set(0,0,-1).applyQuaternion(t.getWorldQuaternion(lu)),ai.set(0,1,0).applyQuaternion(lu),e.positionX){const n=this.context.currentTime,s=.02;e.positionX.linearRampToValueAtTime(Wn.x,n+s),e.positionY.linearRampToValueAtTime(Wn.y,n+s),e.positionZ.linearRampToValueAtTime(Wn.z,n+s),e.forwardX.linearRampToValueAtTime(oi.x,n+s),e.forwardY.linearRampToValueAtTime(oi.y,n+s),e.forwardZ.linearRampToValueAtTime(oi.z,n+s),e.upX.linearRampToValueAtTime(ai.x,n+s),e.upY.linearRampToValueAtTime(ai.y,n+s),e.upZ.linearRampToValueAtTime(ai.z,n+s)}else{const n=e;n.setPosition(Wn.x,Wn.y,Wn.z),n.setOrientation(oi.x,oi.y,oi.z,ai.x,ai.y,ai.z)}}get listenerPosition(){return Wn}applyReverbAmount(){this.currentRoom!==null&&this.setRoom(this.currentRoom,.05)}listenForGesture(){const t=()=>{this.context.resume().then(()=>{this.started=this.context.state==="running"}),window.removeEventListener("pointerdown",t),window.removeEventListener("keydown",t),window.removeEventListener("touchstart",t)};window.addEventListener("pointerdown",t),window.addEventListener("keydown",t),window.addEventListener("touchstart",t)}handleVisibility=()=>{document.hidden?this.context.suspend():this.started&&this.context.resume()};dispose(){document.removeEventListener("visibilitychange",this.handleVisibility),this.context.close()}}const Wn=new C,oi=new C,ai=new C,lu=new yi;/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.21.0
 * @author George Michael Brower
 * @license MIT
 */class mn{constructor(t,e,n,s,r="div"){this.parent=t,this.object=e,this.property=n,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(r),this.domElement.classList.add("lil-controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("lil-name"),mn.nextNameID=mn.nextNameID||0,this.$name.id=`lil-gui-name-${++mn.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("lil-widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(n)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("lil-disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class WM extends mn{constructor(t,e,n){super(t,e,n,"lil-boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function bl(i){let t,e;return(t=i.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=i.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=i.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const XM={isPrimitive:!0,match:i=>typeof i=="string",fromHexString:bl,toHexString:bl},Gs={isPrimitive:!0,match:i=>typeof i=="number",fromHexString:i=>parseInt(i.substring(1),16),toHexString:i=>"#"+i.toString(16).padStart(6,0)},qM={isPrimitive:!1,match:i=>Array.isArray(i)||ArrayBuffer.isView(i),fromHexString(i,t,e=1){const n=Gs.fromHexString(i);t[0]=(n>>16&255)/255*e,t[1]=(n>>8&255)/255*e,t[2]=(n&255)/255*e},toHexString([i,t,e],n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return Gs.toHexString(s)}},YM={isPrimitive:!1,match:i=>Object(i)===i,fromHexString(i,t,e=1){const n=Gs.fromHexString(i);t.r=(n>>16&255)/255*e,t.g=(n>>8&255)/255*e,t.b=(n&255)/255*e},toHexString({r:i,g:t,b:e},n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return Gs.toHexString(s)}},$M=[XM,Gs,qM,YM];function KM(i){return $M.find(t=>t.match(i))}class ZM extends mn{constructor(t,e,n,s){super(t,e,n,"lil-color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=KM(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const r=bl(this.$text.value);r&&this._setValueFromHexString(r)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class xa extends mn{constructor(t,e,n){super(t,e,n,"lil-function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class jM extends mn{constructor(t,e,n,s,r,o){super(t,e,n,"lil-number"),this._initInput(),this.min(s),this.max(r);const a=o!==void 0;this.step(a?o:this._getImplicitStep(),a),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let _=parseFloat(this.$input.value);isNaN(_)||(this._stepExplicit&&(_=this._snap(_)),this.setValue(this._clamp(_)))},n=_=>{const v=parseFloat(this.$input.value);isNaN(v)||(this._snapClampSetValue(v+_),this.$input.value=this.getValue())},s=_=>{_.key==="Enter"&&this.$input.blur(),_.code==="ArrowUp"&&(_.preventDefault(),n(this._step*this._arrowKeyMultiplier(_))),_.code==="ArrowDown"&&(_.preventDefault(),n(this._step*this._arrowKeyMultiplier(_)*-1))},r=_=>{this._inputFocused&&(_.preventDefault(),n(this._step*this._normalizeMouseWheel(_)))};let o=!1,a,l,c,h,u;const d=5,p=_=>{a=_.clientX,l=c=_.clientY,o=!0,h=this.getValue(),u=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",x)},g=_=>{if(o){const v=_.clientX-a,y=_.clientY-l;Math.abs(y)>d?(_.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(v)>d&&x()}if(!o){const v=_.clientY-c;u-=v*this._step*this._arrowKeyMultiplier(_),h+u>this._max?u=this._max-h:h+u<this._min&&(u=this._min-h),this._snapClampSetValue(h+u)}c=_.clientY},x=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",x)},m=()=>{this._inputFocused=!0},f=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",r,{passive:!1}),this.$input.addEventListener("mousedown",p),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",f)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("lil-slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("lil-fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("lil-has-slider");const t=(f,_,v,y,w)=>(f-_)/(v-_)*(w-y)+y,e=f=>{const _=this.$slider.getBoundingClientRect();let v=t(f,_.left,_.right,this._min,this._max);this._snapClampSetValue(v)},n=f=>{this._setDraggingStyle(!0),e(f.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",r)},s=f=>{e(f.clientX)},r=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",r)};let o=!1,a,l;const c=f=>{f.preventDefault(),this._setDraggingStyle(!0),e(f.touches[0].clientX),o=!1},h=f=>{f.touches.length>1||(this._hasScrollBar?(a=f.touches[0].clientX,l=f.touches[0].clientY,o=!0):c(f),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",d))},u=f=>{if(o){const _=f.touches[0].clientX-a,v=f.touches[0].clientY-l;Math.abs(_)>Math.abs(v)?c(f):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",d))}else f.preventDefault(),e(f.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",d)},p=this._callOnFinishChange.bind(this),g=400;let x;const m=f=>{if(Math.abs(f.deltaX)<Math.abs(f.deltaY)&&this._hasScrollBar)return;f.preventDefault();const v=this._normalizeMouseWheel(f)*this._step;this._snapClampSetValue(this.getValue()+v),this.$input.value=this.getValue(),clearTimeout(x),x=setTimeout(p,g)};this.$slider.addEventListener("mousedown",n),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("lil-active",t),document.body.classList.toggle("lil-dragging",t),document.body.classList.toggle(`lil-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:n}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,n=-t.wheelDelta/120,n*=this._stepExplicit?1:10),e+-n}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){let e=0;return this._hasMin?e=this._min:this._hasMax&&(e=this._max),t-=e,t=Math.round(t/this._step)*this._step,t+=e,t=parseFloat(t.toPrecision(15)),t}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class JM extends mn{constructor(t,e,n,s){super(t,e,n,"lil-option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("lil-focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("lil-focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const n=document.createElement("option");n.textContent=e,this.$select.appendChild(n)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class QM extends mn{constructor(t,e,n){super(t,e,n,"lil-string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}var tS=`.lil-gui {
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
}`;function eS(i){const t=document.createElement("style");t.innerHTML=i;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let cu=!1;class ec{constructor({parent:t,autoPlace:e=t===void 0,container:n,width:s,title:r="Controls",closeFolders:o=!1,injectStyles:a=!0,touchStyles:l=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("button"),this.$title.classList.add("lil-title"),this.$title.setAttribute("aria-expanded",!0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("lil-children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(r),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("lil-root"),l&&this.domElement.classList.add("lil-allow-touch-styles"),!cu&&a&&(eS(tS),cu=!0),n?n.appendChild(this.domElement):e&&(this.domElement.classList.add("lil-auto-place","autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=o}add(t,e,n,s,r){if(Object(n)===n)return new JM(this,t,e,n);const o=t[e];switch(typeof o){case"number":return new jM(this,t,e,n,s,r);case"boolean":return new WM(this,t,e);case"string":return new QM(this,t,e);case"function":return new xa(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,n=1){return new ZM(this,t,e,n)}addFolder(t){const e=new ec({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(n=>{n instanceof xa||n._name in t.controllers&&n.load(t.controllers[n._name])}),e&&t.folders&&this.folders.forEach(n=>{n._title in t.folders&&n.load(t.folders[n._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(n=>{if(!(n instanceof xa)){if(n._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${n._name}"`);e.controllers[n._name]=n.save()}}),t&&this.folders.forEach(n=>{if(n._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${n._title}"`);e.folders[n._title]=n.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("lil-closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("lil-transition");const n=r=>{r.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("lil-transition"),this.$children.removeEventListener("transitionend",n))};this.$children.addEventListener("transitionend",n);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("lil-closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(n=>n.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}var Ds=function(){var i=0,t=document.createElement("div");t.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",t.addEventListener("click",function(h){h.preventDefault(),n(++i%t.children.length)},!1);function e(h){return t.appendChild(h.dom),h}function n(h){for(var u=0;u<t.children.length;u++)t.children[u].style.display=u===h?"block":"none";i=h}var s=(performance||Date).now(),r=s,o=0,a=e(new Ds.Panel("FPS","#0ff","#002")),l=e(new Ds.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var c=e(new Ds.Panel("MB","#f08","#201"));return n(0),{REVISION:16,dom:t,addPanel:e,showPanel:n,begin:function(){s=(performance||Date).now()},end:function(){o++;var h=(performance||Date).now();if(l.update(h-s,200),h>=r+1e3&&(a.update(o*1e3/(h-r),100),r=h,o=0,c)){var u=performance.memory;c.update(u.usedJSHeapSize/1048576,u.jsHeapSizeLimit/1048576)}return h},update:function(){s=this.end()},domElement:t,setMode:n}};Ds.Panel=function(i,t,e){var n=1/0,s=0,r=Math.round,o=r(window.devicePixelRatio||1),a=80*o,l=48*o,c=3*o,h=2*o,u=3*o,d=15*o,p=74*o,g=30*o,x=document.createElement("canvas");x.width=a,x.height=l,x.style.cssText="width:80px;height:48px";var m=x.getContext("2d");return m.font="bold "+9*o+"px Helvetica,Arial,sans-serif",m.textBaseline="top",m.fillStyle=e,m.fillRect(0,0,a,l),m.fillStyle=t,m.fillText(i,c,h),m.fillRect(u,d,p,g),m.fillStyle=e,m.globalAlpha=.9,m.fillRect(u,d,p,g),{dom:x,update:function(f,_){n=Math.min(n,f),s=Math.max(s,f),m.fillStyle=e,m.globalAlpha=1,m.fillRect(0,0,a,d),m.fillStyle=t,m.fillText(r(f)+" "+i+" ("+r(n)+"-"+r(s)+")",c,h),m.drawImage(x,u+o,d,p-o,g,u,d,p-o,g),m.fillRect(u+p-o,d,o,g),m.fillStyle=e,m.globalAlpha=.9,m.fillRect(u+p-o,d,o,r((1-f/_)*g))}}};function nS(){if(!pd.debug)return{gui:null,stats:null,update:()=>{},dispose:()=>{}};const i=new Ds;i.dom.style.position="fixed",i.dom.style.top="0",i.dom.style.left="0",document.body.appendChild(i.dom);const t=new ec({title:"hswow"});return t.domElement.style.setProperty("--width","280px"),{gui:t,stats:i,update:()=>i.update(),dispose:()=>{t.destroy(),i.dom.remove()}}}const Fd={sky:!0,fogColor:"#bcd4e6",fogNear:25,fogFar:140,sunIntensity:2.2,sunColor:16773848,fillIntensity:0,fillColor:12375270,ambientIntensity:1.5,ambientSky:10339560,ambientGround:4998454,room:"open",surface:"earth",footstepReverb:.7},hu={sky:!1,fogColor:"#0d0f12",fogNear:6,fogFar:34,sunIntensity:1.1,sunColor:16770748,fillIntensity:.75,fillColor:9412792,ambientIntensity:2.1,ambientSky:9078390,ambientGround:4867130,room:"cell",surface:"wood",footstepReverb:.5},iS=.12;class sS{definition;group=null;constructor(t){this.definition=t}get id(){return this.definition.id}get name(){return this.definition.name}get environment(){return this.definition.environment}get spawn(){return this.definition.spawn}get floor(){return this.definition.floor??-20}settle(t){const e=this.definition.groundAt;if(!e)return t;const n=t.position.clone();return n.y=e(n.x,n.z)+iS,{position:n,yaw:t.yaw}}root(){return this.group===null&&(this.group=this.definition.build(),this.group.name=`zone:${this.definition.id}`,this.group.updateWorldMatrix(!0,!0)),this.group}get isBuilt(){return this.group!==null}dispose(){this.group!==null&&(this.group.traverse(t=>{(t instanceof $t||t instanceof co)&&t.geometry.dispose()}),this.group.clear(),this.group=null)}}const rS=1.15;function oS(i,t=new C){return t.set(Math.sin(i),0,Math.cos(i))}function aS(i){if(i.arrival)return{position:i.arrival.position.clone(),yaw:i.arrival.yaw};const t=oS(i.yaw);return{position:i.position.clone().addScaledVector(t,rS),yaw:i.yaw+Math.PI}}class lS{byZone=new Map;byDoor=new Map;add(t,e){this.addSide(t.id,t.a,t.b,e),this.addSide(t.id,t.b,t.a,e)}addSide(t,e,n,s){const r={portal:t,end:e,target:n,arrival:aS(n),door:null,title:"Door",label:e.label??s(n.zone)},o=this.byZone.get(e.zone);o?o.push(r):this.byZone.set(e.zone,[r])}in(t){return this.byZone.get(t)??[]}bind(t,e,n){t.door=e,t.title=n,e.userData.portal=t,this.byDoor.set(e,t)}sideOf(t){let e=t;for(;e;){const n=this.byDoor.get(e);if(n)return n;e=e.parent}return null}all(){return[...this.byZone.values()].flat()}}const cS={level:.55,click:{hz:3200,q:6,duration:.004,level:.5},modes:[{hz:180,decay:.16,q:5,level:1},{hz:430,decay:.1,q:6,level:.55},{hz:950,decay:.055,q:7,level:.25}],thump:{from:112,to:82,decay:.13,level:.55}},hS={level:.5,click:{hz:5200,q:9,duration:.005,level:.6},modes:[{hz:240,decay:.34,q:9,level:.8},{hz:620,decay:.28,q:11,level:.6},{hz:1450,decay:.2,q:12,level:.35},{hz:2900,decay:.12,q:10,level:.18}],thump:{from:78,to:62,decay:.3,level:.7}},uS={level:.42,click:{hz:2400,q:5,duration:.003,level:.35},modes:[{hz:320,decay:.08,q:5,level:.8},{hz:720,decay:.055,q:6,level:.45},{hz:1600,decay:.035,q:6,level:.2}],thump:{from:150,to:120,decay:.07,level:.3}},dS={timber:cS,iron:hS,plank:uS};function fS(i){return Math.max(i.thump.decay,...i.modes.map(e=>e.decay))*3+Bd+.05}const Bd=.032;function ki(i,t){return i+Math.random()*(t-i)}class pS{engine;constructor(t){this.engine=t}play(t,e="timber"){const n=dS[e],s=this.engine.context;if(s.state!=="running"||!this.engine.noise)return;const r=s.currentTime+.02,o=[],a=this.buildOutput(n,t,o);this.click(a,n,r,1,o);const l=r+Bd;for(const h of n.modes)this.ring(a,h,l,ki(.92,1.08),o);this.thump(a,n.thump,l,1,o);const c=fS(n);window.setTimeout(()=>{for(const h of o)h.disconnect()},(r-s.currentTime+c)*1e3+250)}buildOutput(t,e,n){const s=this.engine.context,r=s.createGain();r.gain.value=t.level;const o=s.createPanner();o.panningModel="HRTF",o.distanceModel="inverse",o.refDistance=1.6,o.maxDistance=45,o.rolloffFactor=1.1,mS(o,e);const a=s.createGain();return a.gain.value=.9,r.connect(o),o.connect(this.engine.dry),o.connect(a),a.connect(this.engine.send),n.push(r,o,a),r}ring(t,e,n,s,r){const o=this.engine.context,a=this.engine.noise;if(!a)return;const l=o.createBufferSource();l.buffer=a.white,l.playbackRate.value=ki(.9,1.1);const c=o.createGain();c.gain.setValueAtTime(0,n),c.gain.linearRampToValueAtTime(e.level*s,n+.002),c.gain.setTargetAtTime(0,n+.002,e.decay/3);const h=o.createBiquadFilter();h.type="bandpass",h.frequency.value=e.hz,h.Q.value=e.q;const u=o.createGain();u.gain.value=Math.sqrt(e.q),l.connect(c).connect(h).connect(u).connect(t),l.start(n,ki(0,a.white.duration-1),e.decay*3+.05),l.stop(n+e.decay*3+.06),r.push(l,c,h,u)}click(t,e,n,s,r){const o=this.engine.context,a=this.engine.noise;if(!a)return;const l=o.createBufferSource();l.buffer=a.white,l.playbackRate.value=ki(.92,1.08);const c=o.createGain();c.gain.setValueAtTime(0,n),c.gain.linearRampToValueAtTime(e.click.level*s,n+6e-4),c.gain.setTargetAtTime(0,n+6e-4,e.click.duration*.5);const h=o.createBiquadFilter();h.type="bandpass",h.frequency.value=e.click.hz,h.Q.value=e.click.q;const u=o.createGain();u.gain.value=Math.sqrt(e.click.q),l.connect(c).connect(h).connect(u).connect(t),l.start(n,ki(0,a.white.duration-.5),e.click.duration+.08),l.stop(n+e.click.duration+.1),r.push(l,c,h,u)}thump(t,e,n,s,r){const o=this.engine.context,a=o.createOscillator();a.type="sine",a.frequency.setValueAtTime(e.from*ki(.96,1.04),n),a.frequency.exponentialRampToValueAtTime(e.to,n+e.decay);const l=o.createGain();l.gain.setValueAtTime(0,n),l.gain.linearRampToValueAtTime(e.level*s,n+.004),l.gain.setTargetAtTime(0,n+.004,e.decay/3),a.connect(l).connect(t),a.start(n),a.stop(n+e.decay*3+.06),r.push(a,l)}}function mS(i,t){i.positionX?(i.positionX.value=t.x,i.positionY.value=t.y,i.positionZ.value=t.z):i.setPosition(t.x,t.y,t.z)}class gS{zones=new Map;portals=new lS;lights;options;audio=null;doorAudio=null;active=null;doored=new Set;transitioning=!1;hovered=null;crossings=0;onZoneChange=null;constructor(t){this.options=t,this.lights={sun:new Eh(16773848,2.2),fill:new Eh(9412792,0),ambient:new Wv(10339560,4998454,1.5)},this.lights.sun.position.set(-8,12,6),this.lights.fill.position.set(9,7,-7),t.scene.add(this.lights.sun,this.lights.fill,this.lights.ambient)}register(t){const e=new sS(t);return this.zones.set(e.id,e),e}link(t){for(const e of[t.a,t.b])if(!this.zones.has(e.zone))throw new Error(`portal ${t.id} refers to unknown zone "${e.zone}"`);this.portals.add(t,e=>this.zones.get(e)?.name??e)}prebuild(t){const e=this.zones.get(t);if(!e)return;const n=this.prepare(e);n.updateWorldMatrix(!0,!0),this.options.collider.warm(n,e.id)}surfaceAt(t,e){const n=this.active;return n?n.definition.surfaceAt?.(t,e)??n.environment.surface:"earth"}attachAudio(t){this.audio=t,this.doorAudio=new pS(t.engine),this.active&&this.applyAudio(this.active)}get current(){return this.active}get isTransitioning(){return this.transitioning}enter(t,e){const n=this.zones.get(t);if(!n)throw new Error(`no such zone "${t}"`);const{scene:s,collider:r,player:o,postfx:a,interaction:l}=this.options;this.active&&this.active!==n&&s.remove(this.active.root());const c=this.prepare(n);s.add(c),this.active=n,c.updateWorldMatrix(!0,!0),r.build(c,n.id);const h=n.environment;a.setEnvironment({sky:h.sky,fogColor:h.fogColor,fogNear:h.fogNear,fogFar:h.fogFar}),this.lights.sun.intensity=h.sunIntensity,this.lights.sun.color.setHex(h.sunColor),this.lights.fill.intensity=h.fillIntensity,this.lights.fill.color.setHex(h.fillColor),this.lights.ambient.intensity=h.ambientIntensity,this.lights.ambient.color.setHex(h.ambientSky),this.lights.ambient.groundColor.setHex(h.ambientGround),this.applyAudio(n),l.setTargets(this.portals.in(n.id).map(d=>d.door).filter(d=>d!==null));const u=n.settle(e??n.spawn);o.teleport(u.position,u.yaw),this.hovered=null,this.options.reticle.set(null),this.onZoneChange?.(n)}applyAudio(t){this.audio&&(this.audio.engine.setRoom(t.environment.room),this.audio.footsteps.surface=t.environment.surface,this.audio.footsteps.setReverb(t.environment.footstepReverb))}prepare(t){const e=t.root();if(this.doored.has(t.id))return e;this.doored.add(t.id);for(const n of this.portals.in(t.id)){const s=n.end,r=Jl({seed:s.seed??1,material:s.material});r.position.copy(s.position),r.rotation.y=s.yaw,Se(r),e.add(r),this.portals.bind(n,r,bd(Ml(r).material))}return e}update(){const{interaction:t,collider:e,player:n,reticle:s}=this.options;if(this.transitioning)return s.set(null),null;const r=t.probe(n.camera,e);return this.hovered=r?this.portals.sideOf(r.object):null,s.set(this.hovered?{title:this.hovered.title,target:this.hovered.label}:null),this.hovered}async use(t){if(this.transitioning)return;this.transitioning=!0,this.options.reticle.set(null);const e=t.door?Ml(t.door).material:"timber";uu.copy(t.end.position).setY(t.end.position.y+1.2),this.doorAudio?.play(uu,e),await this.options.fade.cover(()=>{this.enter(t.target.zone,t.arrival),this.crossings++}),this.transitioning=!1}respawn(){const t=this.active;t&&this.options.player.teleport(t.spawn.position,t.spawn.yaw)}dispose(){const{scene:t}=this.options;this.active&&t.remove(this.active.root()),t.remove(this.lights.sun,this.lights.fill,this.lights.ambient);for(const e of this.zones.values())e.dispose();this.zones.clear(),this.doored.clear()}}const uu=new C,_S=3.2,vS=.15;class xS{reach=_S;raycaster=new Kv;targets=[];constructor(){this.raycaster.far=this.reach}setTargets(t){this.targets=t}get targetCount(){return this.targets.length}probe(t,e){if(this.targets.length===0)return null;t.updateWorldMatrix(!0,!1),ya.setFromMatrixPosition(t.matrixWorld),Ma.set(0,0,-1).applyQuaternion(t.getWorldQuaternion(yS)),this.raycaster.far=this.reach,this.raycaster.set(ya,Ma);const n=this.raycaster.intersectObjects(this.targets,!0);if(n.length===0)return null;const s=n[0],r=e.raycast(ya,Ma);return r!==null&&r<s.distance-vS?null:{object:s.object,distance:s.distance}}}const ya=new C,Ma=new C,yS=new yi,MS=.14,du=.22;class SS{element;title;target;shown=!1;showing="";constructor(t){this.element=document.createElement("div"),this.element.id="prompt",this.element.setAttribute("aria-live","polite");const e=document.createElement("span");e.className="prompt-lines",this.title=document.createElement("span"),this.title.className="prompt-title";const n=document.createElement("span");n.className="prompt-to",n.textContent="to",this.target=document.createElement("span"),this.target.className="prompt-target",e.append(this.title,n,this.target),this.element.append(e),t.appendChild(this.element)}set(t){const e=t!==null;if(t){const n=`${t.title}\0${t.target}`;n!==this.showing&&(this.showing=n,this.title.textContent=t.title,this.target.textContent=t.target)}e!==this.shown&&(this.shown=e,this.element.classList.toggle("is-shown",e))}dispose(){this.element.remove()}}class bS{element;constructor(t){this.element=document.createElement("div"),this.element.id="fade",t.appendChild(this.element)}async cover(t){this.element.classList.add("is-black"),await Sa(du),t(),await Sa(MS),this.element.classList.remove("is-black"),await Sa(du)}dispose(){this.element.remove()}}function Sa(i){return new Promise(t=>window.setTimeout(t,i*1e3))}const zd={floor:z.TIMBER,floorSeam:1315085,wall:z.CLOTH,wallTrim:z.TIMBER_DARK,ceiling:z.TIMBER_DARK,beam:z.BARK},wS={floor:z.STONE_DARK,floorSeam:921618,wall:z.STONE,wallTrim:z.IRON,ceiling:1842978,beam:z.RUST};function kd(i){const{width:t,depth:e,height:n,seed:s=1,style:r=zd,planks:o=!0,beams:a=3,thickness:l=.35}=i,c=se(s),h=[],u=l,d=t+u*2,p=e+u*2,g=o?-.006:0,x=new et(d,u,p);x.translate(0,g-u/2,0),h.push({geometry:x,color:o?r.floorSeam:r.floor,sway:0});const m=new et(d,u,p);m.translate(0,n+u/2,0),h.push({geometry:m,color:r.ceiling,sway:0});for(const _ of[-1,1]){const v=new et(d,n,u);v.translate(0,n/2,_*(e+u)/2),h.push({geometry:v,color:r.wall,sway:0})}for(const _ of[-1,1]){const v=new et(u,n,p);v.translate(_*(t+u)/2,n/2,0),h.push({geometry:v,color:r.wall,sway:0})}if(o){const _=c.range(.24,.34),v=Math.ceil(t/_),y=.012;for(let w=0;w<v;w++){const E=-t/2+(w+.5)*_,A=new et(_-y,.03,e);A.translate(E,-.015,0),h.push({geometry:A,color:xe(r.floor,c.around(1,.09)),sway:0})}}if(a>0){const _=c.range(.16,.24);for(let v=0;v<a;v++){const y=-e/2+(v+.5)/a*e,w=new et(d,_,c.range(.18,.26));w.translate(0,n-_/2,y),h.push({geometry:w,color:r.beam,sway:0})}}const f=.16;for(const _ of[-1,1]){const v=new et(t,f,.06);v.translate(0,f/2,_*(e-.06)/2),h.push({geometry:v,color:r.wallTrim,sway:0})}for(const _ of[-1,1]){const v=new et(.06,f,e);v.translate(_*(t-.06)/2,f/2,0),h.push({geometry:v,color:r.wallTrim,sway:0})}return he(ce(h),"interior",0)}const fu={turf:{color:z.GRASS,variation:.1,step:"grass"},meadow:{color:z.GRASS_DRY,variation:.13,step:"grass"},dirt:{color:z.EARTH,variation:.09,step:"earth"},gravel:{color:7235158,variation:.16,step:"gravel"},cobble:{color:z.STONE,variation:.19,step:"stone"},flagstone:{color:z.STONE_PALE,variation:.08,step:"stone"},boards:{color:z.TIMBER,variation:.11,step:"wood"},crop:{color:z.LEAF_DRY,variation:.15,step:"grass"},mire:{color:4536876,variation:.12,step:"mud"},rock:{color:z.STONE_DARK,variation:.13,step:"stone"}};function ES(i,t,e,n,s,r){const o=s-e,a=r-n,l=o*o+a*a,c=l===0?0:Math.max(0,Math.min(1,((i-e)*o+(t-n)*a)/l));return Math.hypot(i-(e+o*c),t-(n+a*c))}function pu(i,t,e){for(let n=i.length-1;n>=0;n--){const s=i[n];switch(s.kind){case"blot":if(Math.hypot(t-s.at[0],e-s.at[1])<=s.radius)return s.material;break;case"field":if(t>=s.min[0]&&t<=s.max[0]&&e>=s.min[1]&&e<=s.max[1])return s.material;break;case"path":{const r=s.width/2;for(let o=0;o+1<s.through.length;o++){const a=s.through[o],l=s.through[o+1];if(ES(t,e,a[0],a[1],l[0],l[1])<=r)return s.material}break}}}return null}function TS(i,t){let e=Math.round(i/1.2)*374761393+Math.round(t/1.2)*668265263|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function xs(i){const t=i<0?0:i>1?1:i;return t*t*t*(t*(t*6-15)+10)}function AS(i,t,e,n,s,r){const o=s-e,a=r-n,l=o*o+a*a,c=l===0?0:Math.max(0,Math.min(1,((i-e)*o+(t-n)*a)/l));return Math.hypot(i-(e+o*c),t-(n+a*c))}class RS{size;resolution;landforms;patches;detail;rockAngle;base;constructor(t){this.size=t.size,this.resolution=t.resolution,this.landforms=t.landforms,this.patches=t.patches??[],this.detail=t.detail??[],this.rockAngle=t.rockAngle??34,this.base=t.base??"turf"}heightAt(t,e){let n=0;for(const s of this.landforms)switch(s.kind){case"terrace":break;case"hill":{const r=Math.hypot(t-s.at[0],e-s.at[1]),o=xs(1-r/s.radius);n+=s.height*(s.falloff?o**s.falloff:o);break}case"ridge":{const r=AS(t,e,s.from[0],s.from[1],s.to[0],s.to[1]);n+=s.height*xs(1-r/s.width);break}case"basin":{const r=Math.hypot(t-s.at[0],e-s.at[1]);n-=s.depth*xs(1-r/s.radius);break}case"rim":{const o=this.size/2-Math.max(Math.abs(t),Math.abs(e));n+=s.height*xs(1-o/s.inset);break}}for(const s of this.landforms){if(s.kind!=="terrace")continue;const r=Math.hypot(t-s.at[0],e-s.at[1]);if(r>=s.radius+s.blend)continue;const o=r<=s.radius?1:xs((s.radius+s.blend-r)/s.blend);n=n*(1-o)+s.height*o}return n}get detailRegions(){return this.detail}slopeAt(t,e,n=this.resolution){const s=(this.heightAt(t+n,e)-this.heightAt(t-n,e))/(2*n),r=(this.heightAt(t,e+n)-this.heightAt(t,e-n))/(2*n);return Math.atan(Math.hypot(s,r))*180/Math.PI}build(){const t=Math.round(this.size/this.resolution),e=this.size/2,n=this.resolution,s=new Uint8Array(t*t);for(let _=0;_<t;_++)for(let v=0;v<t;v++){const y=-e+(v+.5)*n,w=-e+(_+.5)*n;let E=1;for(const A of this.detail)Math.hypot(y-A.at[0],w-A.at[1])<=A.radius&&(E=Math.max(E,A.level));s[_*t+v]=E}const r=(_,v)=>_<0||v<0||_>=t||v>=t?1:s[_*t+v],o=[],a=[],l=[],c=new C,h=new C,u=new C,d=new C,p=new C,g=new C,x=new Ft,m=(_,v)=>{o.push(_.x,_.y,_.z),a.push(v.x,v.y,v.z),l.push(x.r,x.g,x.b)};for(let _=0;_<t;_++)for(let v=0;v<t;v++){const y=s[_*t+v],w=-e+v*n,E=-e+_*n,A=r(_,v-1),L=r(_,v+1),S=r(_-1,v),M=r(_+1,v),R=(I,U)=>I===0&&A<y?this.alongEdge(w,E,w,E+n,U,A):I===1&&L<y?this.alongEdge(w+n,E,w+n,E+n,U,L):U===0&&S<y?this.alongEdge(w,E,w+n,E,I,S):U===1&&M<y?this.alongEdge(w,E+n,w+n,E+n,I,M):this.heightAt(w+I*n,E+U*n);for(let I=0;I<y;I++)for(let U=0;U<y;U++){const B=U/y,X=(U+1)/y,H=I/y,Z=(I+1)/y,V=[[w+B*n,R(B,H),E+H*n],[w+B*n,R(B,Z),E+Z*n],[w+X*n,R(X,Z),E+Z*n],[w+X*n,R(X,H),E+H*n]];for(const[ct,ut,xt]of[[0,1,2],[0,2,3]])c.set(...V[ct]),h.set(...V[ut]),u.set(...V[xt]),d.subVectors(h,c),p.subVectors(u,c),g.crossVectors(d,p).normalize(),g.y<0&&g.negate(),x.set(this.faceColor(g.y,(c.y+h.y+u.y)/3,(c.x+h.x+u.x)/3,(c.z+h.z+u.z)/3)),m(c,g),m(h,g),m(u,g)}}const f=new Re;return f.setAttribute("position",new jt(o,3)),f.setAttribute("normal",new jt(a,3)),f.setAttribute("color",new jt(l,3)),f.setAttribute(xd,new jt(new Float32Array(o.length/3),1)),he(f,"terrain",0)}alongEdge(t,e,n,s,r,o){const a=1/o,c=Math.min(o-1,Math.floor(r/a))*a,h=c+a,u=this.heightAt(t+(n-t)*c,e+(s-e)*c),d=this.heightAt(t+(n-t)*h,e+(s-e)*h);return u+(d-u)*((r-c)/a)}materialAt(t,e){return this.slopeAt(t,e)>this.rockAngle?"rock":pu(this.patches,t,e)??this.base}stepAt(t,e){return fu[this.materialAt(t,e)].step}faceColor(t,e,n,s){const o=Math.acos(Math.min(1,Math.max(-1,t)))*180/Math.PI>this.rockAngle?"rock":pu(this.patches,n,s)??this.base,a=fu[o],l=1+(TS(n,s)-.5)*a.variation*2,c=1-Math.min(Math.max(e/55,0),1)*.16;return xe(a.color,l*c)}}const nc="village",Hd=96,mu=Hd/2,CS=[{kind:"basin",at:[0,0],radius:34,depth:3},{kind:"hill",at:[18,-12],radius:12,height:4.5,falloff:1.3},{kind:"hill",at:[20,8],radius:10,height:3.5,falloff:1.4},{kind:"hill",at:[8,20],radius:11,height:3,falloff:1.5},{kind:"terrace",at:[-6,1],radius:26,height:-3,blend:9},{kind:"terrace",at:[0,34],radius:6,height:-.4,blend:7},{kind:"rim",inset:13,height:14}],PS=[{kind:"field",min:[16,-6],max:[30,8],material:"crop"},{kind:"field",min:[-30,14],max:[-16,28],material:"meadow"},{kind:"blot",at:[-24,-6],radius:11,material:"meadow"},{kind:"path",through:[[0,34],[0,22],[0,15]],width:3,material:"dirt"},{kind:"path",through:[[4,2],[14,-2],[24,-2]],width:2.4,material:"dirt"},{kind:"path",through:[[-9,13],[0,8],[9,1]],width:2.2,material:"cobble"},{kind:"path",through:[[-2,17],[0,8],[1,-2]],width:2.2,material:"cobble"},{kind:"path",through:[[7,15],[0,8],[-7,0]],width:2.2,material:"cobble"},{kind:"path",through:[[11,8],[0,8],[-12,6]],width:2.2,material:"cobble"},{kind:"blot",at:[-16,-10],radius:7,material:"mire"}],vi=new RS({size:Hd,resolution:3,landforms:CS,patches:PS,detail:[{at:[-6,1],radius:26,level:2},{at:[-6,1],radius:20,level:4},{at:[0,34],radius:5,level:3}]}),LS=vi,Is=new C(0,0,34);function DS(){return{id:nc,name:"Arkstin Village",environment:{...Fd,fogNear:30,fogFar:190,footstepReverb:.5},spawn:{position:Gd(0,28),yaw:Math.PI},floor:-20,surfaceAt:(i,t)=>vi.stepAt(i,t),groundAt:(i,t)=>vi.heightAt(i,t),build:US}}function Gd(i,t,e=0){return new C(i,vi.heightAt(i,t)+e,t)}function He(i,t,e,n,s,r=!0){t.position.copy(Gd(e,n)),t.rotation.y=s,i.add(r?Se(t):t)}function Je(i,t,e){const n=se(e.seed),[s,r]=e.from??[0,0],o=e.maxSlope??26,a=e.avoid??[],l=t.solid!==!1;for(let c=0;c<e.count;c++){const h=n.range(0,Math.PI*2),u=Math.sqrt(n())*e.within,d=s+Math.cos(h)*u,p=r+Math.sin(h)*u,g=n.range(0,Math.PI*2),x=e.scale?n.range(e.scale[0],e.scale[1]):1,m=n.int(1,1e6);if(Math.abs(d)>mu-8||Math.abs(p)>mu-8||vi.slopeAt(d,p)>o)continue;const f=vi.heightAt(d,p);if(e.minHeight!==void 0&&f<e.minHeight||e.maxHeight!==void 0&&f>e.maxHeight)continue;let _=!1;for(const[v,y,w]of a)if(Math.hypot(d-v,p-y)<w){_=!0;break}_||He(i,t.build({seed:m,scale:x}),d,p,g,l)}}const ys=[[0,8,17],[0,24,10],[0,33,8],[-16,-10,9]],IS=[[-9,13],[-2,17],[7,15],[11,8],[9,1],[1,-2],[-7,0],[-12,6]],gu=[0,8];function US(){const i=new Pe;i.name="ArkstinVillage",i.add(Se(vi.build())),He(i,jl.build({seed:4714}),Is.x,Is.z,Math.PI),IS.forEach(([t,e],n)=>{He(i,Ql.build({seed:700+n*131}),t,e,Math.atan2(gu[0]-t,gu[1]-e))});for(let t=0;t<5;t++){const e=t/5*Math.PI*2;He(i,Ed.build({seed:400+t}),-16+Math.cos(e)*8,-10+Math.sin(e)*8,e)}return He(i,Ud.build({seed:91}),-13,-13,.4),Je(i,Md,{seed:8801,count:2,within:5,from:[-16,-10],maxSlope:20}),Je(i,Cd,{seed:8802,count:4,within:6,from:[-16,-10],maxSlope:20}),Je(i,Pd,{seed:8803,count:2,within:5,from:[-17,-8],maxSlope:20}),Je(i,Ld,{seed:8804,count:6,within:9,from:[-2,6],maxSlope:18}),Je(i,wd,{seed:8805,count:2,within:6,from:[-24,4],maxSlope:18}),He(i,Hs.build({seed:2211}),4,11,.3),He(i,Kn.build({seed:2212}),6,12,1.1),He(i,_i.build({seed:2213}),-4,5,0),He(i,_i.build({seed:2214}),-5,6.5,.7),He(i,Kn.build({seed:2215}),9,5,.5),He(i,tc.build({seed:2216}),-2,11,0),He(i,Ls.build({seed:3301}),3,7,2.2),He(i,Ls.build({seed:3302}),-3,9,1.1),He(i,Ls.build({seed:3303}),6,3,-.8),Je(i,Zl,{seed:5001,count:130,within:42,maxSlope:30,maxHeight:9,avoid:ys,scale:[.8,1.35]}),Je(i,ks,{seed:5002,count:90,within:42,maxSlope:32,avoid:ys}),Je(i,Td,{seed:5003,count:220,within:42,maxSlope:28,avoid:ys}),Je(i,Rd,{seed:5004,count:40,within:36,maxSlope:22,avoid:ys}),Je(i,Id,{seed:5005,count:16,within:36,maxSlope:24,avoid:ys}),Je(i,Dd,{seed:6001,count:70,within:45,maxSlope:44,minHeight:4,scale:[.7,1.6]}),Je(i,Sd,{seed:6002,count:7,within:38,maxSlope:20,minHeight:5}),i}const fi="exterior",_u="example",vu="factory",xu=new C(5,0,6),ba=0,Vd=new C(42,0,-11),wl=0,kr=.07,yu=new C(-9,0,24),Mu=.35,wa={width:10,depth:8,height:3.4},NS={width:15,depth:11,height:5.6},Ea=16,ws=12,Hr=6.4,Su=new C(0,1,0);function OS(i,t={}){const e=Ql.build({seed:5511});e.position.copy(xu),e.rotation.y=ba;const n=Ad(e),s=new C(n.x,0,n.z+kr).applyAxisAngle(Su,ba).add(xu),r=new C(0,0,ws/2+kr).applyAxisAngle(Su,wl).add(Vd),o=[{id:fi,name:"Outside",environment:Fd,spawn:{position:ty.clone(),yaw:0},floor:-20,build(){const l=i.root;l.add(Se(e)),l.add(FS());const c=jl.build({seed:4711});return c.position.copy(yu),c.rotation.y=Mu,l.add(Se(c)),t.gallery&&l.add(t.gallery()),l}},{id:_u,name:"Example Interior",environment:{...hu,room:"cell",surface:"wood",fogColor:"#181309",fogNear:9,fogFar:34,ambientSky:10655612,ambientGround:5721148,ambientIntensity:2.3,sunIntensity:1.2,fillIntensity:.8,fillColor:10521706,footstepReverb:.45},spawn:{position:new C(0,.1,1),yaw:Math.PI},floor:-5,build:()=>BS()},{id:vu,name:"The Factory",environment:{...hu,room:"hall",surface:"stone",fogColor:"#111519",fogNear:12,fogFar:48,ambientSky:8161172,ambientGround:3817284,ambientIntensity:2,sunIntensity:.9,fillIntensity:.85,fillColor:9675701,footstepReverb:.34},spawn:{position:new C(0,.1,2),yaw:Math.PI},floor:-5,build:()=>zS()},DS()],a=[{id:"example-door",a:{zone:fi,position:s,yaw:ba,material:"timber",seed:8801},b:{zone:_u,position:new C(0,0,-8/2+kr),yaw:0,material:"timber",seed:8802}},{id:"factory-door",a:{zone:fi,position:r,yaw:wl,material:"iron",seed:9301},b:{zone:vu,position:new C(0,0,-11/2+kr),yaw:0,material:"iron",seed:9302}},{id:"village-gate",a:{zone:fi,position:yu,yaw:Mu,material:"timber",seed:4712},b:{zone:nc,position:Is.clone().setY(LS.heightAt(Is.x,Is.z)),yaw:Math.PI,material:"timber",seed:4713}}];return{zones:o,portals:a}}function FS(){const i=new Pe;i.name="FactoryExterior",i.position.copy(Vd),i.rotation.y=wl;const t=new Dn({color:z.STONE_DARK,flatShading:!0}),e=new Dn({color:z.IRON,flatShading:!0}),n=new Dn({color:1316378,flatShading:!0}),s=new $t(new et(Ea,Hr,ws),t);s.position.y=Hr/2,i.add(s);const r=2.1,o=new zt(r,r,Ea*1.08,3,1);o.rotateZ(Math.PI/2),o.rotateX(Math.PI/6),o.scale(1,1,ws*1.1/(r*2)),o.computeBoundingBox(),o.translate(0,Hr-(o.boundingBox?.min.y??0),0),i.add(new $t(o,e));const a=new $t(new et(2.3,2.7,.3),n);a.position.set(0,1.35,ws/2-.13),i.add(a);const l=new $t(new zt(.62,.78,6.4,8),t);return l.position.set(Ea*.3,Hr+2.6,-ws*.22),i.add(l),Se(i)}function BS(){const i=new Pe;i.add(kd({...wa,seed:4400,style:zd,planks:!0,beams:3}));const t=wa.width/2,e=wa.depth/2;return pe(i,yd.build({seed:3120}),-t+.9,0,-1.4,0),pe(i,Sl.build({seed:415}),-t+1.1,0,.7,.6),pe(i,Hs.build({seed:2077}),2.2,0,.6,.08),pe(i,yl.build({seed:411}),2.1,0,2.1,Math.PI),pe(i,yl.build({seed:412}),2.3,0,-.9,0),pe(i,Sl.build({seed:413}),3.6,0,1.8,.4),pe(i,Hs.build({seed:2078}),-1.6,0,e-.9,Math.PI),pe(i,Ls.build({seed:6602}),-.2,0,2.4,Math.PI*.85),pe(i,Kn.build({seed:61}),t-.9,0,-e+1,.4),pe(i,Kn.build({seed:66}),t-1,0,-e+2.3,1.1),pe(i,_i.build({seed:63}),-t+.7,0,e-.9,-.3),pe(i,_i.build({seed:67}),t-.8,0,e-1,.2),Se(i)}function zS(){const i=new Pe;i.add(kd({...NS,seed:7700,style:wS,planks:!1,beams:5}));const t=-5.4,e=4;pe(i,bs.build({seed:3301}),t,0,-2.4,Math.PI/2),pe(i,bs.build({seed:3302}),t,0,1.1,Math.PI/2),pe(i,bs.build({seed:3303}),t,0,4.4,Math.PI/2),pe(i,bs.build({seed:3304}),1.5,0,1.9,-.35),pe(i,Kn.build({seed:71}),3.3,0,3.6,.3),pe(i,_i.build({seed:74}),-.4,0,3.4,0);for(const n of[-3,.5,4])pe(i,tc.build({seed:100+n*7}),e,0,n,0);return pe(i,Hs.build({seed:7811}),6.2,0,.6,-Math.PI/2),pe(i,Kn.build({seed:72}),6.3,0,-3.4,1.2),pe(i,Kn.build({seed:73}),6,0,3.9,-.6),pe(i,_i.build({seed:75}),6.4,0,-1.9,.9),pe(i,ks.build({seed:76,scale:.7}),-6.4,0,-4.6,0),Se(i)}function pe(i,t,e,n,s,r){t.position.set(e,n,s),t.rotation.y=r,i.add(t)}const kS=.35;class HS{root;bar;label;constructor(t){const e=document.getElementById("loading"),n=e?.querySelector(".loading-bar")??null,s=e?.querySelector(".loading-label")??null;if(e&&n&&s)this.root=e,this.bar=n,this.label=s;else{this.root=document.createElement("div"),this.root.id="loading";const r=document.createElement("div");r.className="loading-track",this.bar=document.createElement("div"),this.bar.className="loading-bar",r.appendChild(this.bar),this.label=document.createElement("div"),this.label.className="loading-label",this.root.append(r,this.label),t.appendChild(this.root)}document.body.classList.add("is-loading")}async step(t,e,n){return this.label.textContent=t,this.bar.style.transform=`scaleX(${Math.min(Math.max(e,0),1)})`,await bu(),n()}async done(){this.bar.style.transform="scaleX(1)",this.label.textContent="ready",await bu(),await wu(.18),this.root.classList.add("is-gone"),document.body.classList.remove("is-loading"),await wu(kS),this.root.remove()}fail(t){this.label.textContent=t,this.bar.style.transform="scaleX(1)",this.root.classList.add("is-failed")}}function bu(){return new Promise(i=>{requestAnimationFrame(()=>requestAnimationFrame(()=>i()))})}function wu(i){return new Promise(t=>window.setTimeout(t,i*1e3))}const ic=document.getElementById("viewport");if(!(ic instanceof HTMLCanvasElement))throw new Error("#viewport canvas is missing from index.html");const eo=document.getElementById("overlay");if(!(eo instanceof HTMLElement))throw new Error("#overlay is missing from index.html");const rs=new Jv(ic),sc=new Qv,ve=nS();rs.scene.fog=new lo(657935,20,90);const Cn=new Mx(rs);rs.onResize=()=>Cn.resize();const Vs=new to,no=new Lx(ic),Ge=new Vx(rs.camera,no,Vs),Mi=new HS(document.body),Xi=await Mi.step("shaping the ground",.12,()=>new ny),GS=await Mi.step("raising the props",.42,()=>LM()),ye=new gS({scene:rs.scene,collider:Vs,player:Ge,postfx:Cn,interaction:new xS,reticle:new SS(eo),fade:new bS(eo)}),Wd=OS(Xi,{gallery:()=>GS});for(const i of Wd.zones)ye.register(i);for(const i of Wd.portals)ye.link(i);await Mi.step("settling the world",.6,()=>ye.enter(fi));await Mi.step("raising arkstin",.78,()=>ye.prebuild(nc));const Fe=new VM;let re=null;await Mi.step("rendering the rooms",.86,()=>Fe.ready);await Mi.step("tuning the air",.96,()=>{re=new Py(Fe,Xi,Vs,rs.camera),Ge.onFootstep=i=>{if(!re)return;const t=Ge.position;re.footsteps.surface=ye.surfaceAt(t.x,t.z),re.footsteps.step(i)},Ge.onLand=i=>{if(!re)return;const t=Ge.position;re.footsteps.surface=ye.surfaceAt(t.x,t.z),re.footsteps.land(i)},Ge.onJump=()=>{if(!re)return;const i=Ge.position;re.footsteps.surface=ye.surfaceAt(i.x,i.z),re.footsteps.jump()},ye.attachAudio({engine:Fe,footsteps:re.footsteps}),re.setActive(ye.current?.id===fi)});ye.onZoneChange=i=>re?.setActive(i.id===fi);md()?(new Xx(no,eo),document.body.classList.add("is-touch","is-playing")):no.onLockChange=i=>document.body.classList.toggle("is-playing",i);if(ve.gui){const i=Cn.settings,t=()=>Cn.apply(),e=ve.gui.addFolder("look");e.add(i,"pixelSize",1,12,1).onChange(t),e.add(i,"normalEdgeStrength",0,2,.05).onChange(t),e.add(i,"depthEdgeStrength",0,2,.05).onChange(t),e.add(i,"quantize",["off","levels","palette"]).onChange(t),e.add(i,"levels",2,16,1).onChange(t),e.add(i,"ditherScale",0,2,.05).name("dither (steps)").onChange(t),e.add(i,"ditherPattern",{bayer:"bayer","blue noise":"blue","gradient noise":"noise"}).onChange(t),e.add(i,"ditherMatrix",{"2×2":2,"4×4":4,"8×8":8}).name("bayer size").onChange(t);const n=ve.gui.addFolder("vignette").close();n.add(i,"vignetteStrength",0,1,.01).onChange(t),n.add(i,"vignetteRadius",0,1.5,.01).onChange(t),n.add(i,"vignetteSoftness",.01,1.5,.01).onChange(t);const s=ve.gui.addFolder("sky");s.addColor(i.sky,"zenith").onChange(t),s.addColor(i.sky,"horizon").onChange(t),s.addColor(i.sky,"ground").name("below horizon").onChange(t),s.add(i.sky,"curve",.1,3,.05).onChange(t);const r=ve.gui.addFolder("clouds");r.addColor(i.sky,"cloudColor").name("colour").onChange(t),r.add(i.sky,"cloudCover",.1,.9,.01).name("cover").onChange(t),r.add(i.sky,"cloudSoftness",.01,.6,.01).name("softness").onChange(t),r.add(i.sky,"cloudScale",.2,4,.05).name("scale").onChange(t),r.add(i.sky,"cloudOpacity",0,1,.01).name("opacity").onChange(t),r.add(i.sky,"cloudDrift",0,.1,.001).name("drift").onChange(t);const o=ve.gui.addFolder("light").close();o.add(ye.lights.sun,"intensity",0,5,.1).name("sun"),o.add(ye.lights.ambient,"intensity",0,5,.1).name("ambient");const a=ve.gui.addFolder("fog").close();a.add(i,"linkFogToSky").name("match horizon").onChange(t),a.addColor(i,"fogColor").onChange(t),a.add(i,"fogNear",0,200,1).onChange(t),a.add(i,"fogFar",0,400,1).onChange(t);const l=ve.gui.addFolder("palette").close();i.palette.forEach((w,E)=>{l.addColor(i.palette,E).name(`${E}`).onChange(t)});const c=ve.gui.addFolder("surfaces").close();for(const w of Object.keys(Xi.colors))c.addColor(Xi.colors,w).onChange(()=>Xi.applyColors());c.add({reset:()=>{Xi.resetColors(),ve.gui?.controllersRecursive().forEach(w=>w.updateDisplay())}},"reset");const h=ve.gui.addFolder("preset");h.add({save:()=>{const w=Cn.save();h.title(w?"preset · saved":"preset · SAVE FAILED")}},"save"),h.add({reset:()=>{Cn.reset(),ve.gui?.controllersRecursive().forEach(w=>w.updateDisplay())}},"reset"),h.add({copy:()=>{navigator.clipboard?.writeText(JSON.stringify(Cn.settings,null,2))}},"copy").name("copy JSON");const u=Ge.tuning,d=ve.gui.addFolder("movement");d.add(u,"walkSpeed",1,12,.1),d.add(u,"sprintScale",1,3,.05),d.add(u,"groundAccel",1,60,.5),d.add(u,"airAccel",0,20,.1),d.add(u,"friction",0,30,.5),d.add(u,"gravity",5,60,.5),d.add(u,"jumpSpeed",2,14,.1),d.add(u,"autoHop");const p=ve.gui.addFolder("contact").close();p.add(u,"slopeLimitDeg",5,85,1),p.add(u,"stepHeight",0,1,.01),p.add(u,"coyoteTime",0,.5,.01),p.add(u,"jumpBuffer",0,.5,.01);const g=ve.gui.addFolder("view");g.add(u,"lookSensitivity",2e-4,.008,1e-4),g.add(u,"invertY"),g.add(u,"eyeHeight",1,2,.01),g.add(u,"fov",50,110,1),g.add(u,"sprintFov",50,120,1);const x=ve.gui.addFolder("head bob").close();x.add(u,"bobAmount",0,.15,.001),x.add(u,"bobSway",0,.15,.001),x.add(u,"bobRoll",0,.05,5e-4),x.add(u,"bobStepsPerSecond",.5,5,.05),x.add(u,"bobSpeedInfluence",0,1,.05),x.add(u,"landDip",0,.1,.001);const m=ve.gui.addFolder("audio");m.add(Fe.settings,"masterVolume",0,1,.01).name("volume"),m.add(Fe.settings,"reverbAmount",0,2,.01).name("reverb").onChange(()=>Fe.applyReverbAmount()),m.add(Fe.settings,"airAbsorption",0,1,.01).name("air absorption"),m.add(Fe.settings,"occlusion",0,1,.01).name("occlusion");const f=ve.gui.addFolder("weather");f.add(Fe.weather.settings,"windSpeed",0,1,.01).name("wind"),f.add(Fe.weather.settings,"gustDepth",0,1,.01).name("gust depth"),f.add(Fe.weather.settings,"gustRate",.01,.6,.01).name("gust rate"),f.add({get windTone(){return re?.tuning.windTone??3400}},"windTone",700,9e3,50).name("wind softness").onChange(w=>{re&&(re.tuning.windTone=w)}),f.add({get leaves(){return re?.tuning.foliageArticulation??1}},"leaves",0,2.5,.05).name("leaf articulation").onChange(w=>{re&&(re.tuning.foliageArticulation=w)}),f.add({get machineRpm(){return re?.tuning.machineRpm??52}},"machineRpm",0,200,1).name("machine rpm").onChange(w=>{re&&(re.tuning.machineRpm=w)});const _={speed:"0.00",grounded:"no",position:"",triangles:Vs.triangles,gallery:DM(),zone:"—",crossings:0,room:"—",audio:"waiting for a click",gust:"0.00",swell:"0.00",machine:"—",emitters:"—"},v=ve.gui.addFolder("state");v.add(_,"speed").listen().disable(),v.add(_,"grounded").listen().disable(),v.add(_,"position").listen().disable(),v.add(_,"zone").listen().disable(),v.add(_,"crossings").listen().disable(),v.add(_,"room").listen().disable(),v.add(_,"audio").listen().disable(),v.add(_,"gust").listen().disable(),v.add(_,"swell").listen().disable(),v.add(_,"machine").listen().disable(),v.add(_,"emitters").name("audible / occluded").listen().disable(),v.add(_,"triangles").listen().disable(),v.add(_,"gallery").name("gallery order").disable(),v.add({respawn:()=>ye.respawn()},"respawn");const y=ve.gui.addFolder("zones");for(const w of ye.zones.values())y.add({go:()=>ye.enter(w.id)},"go").name(w.name);sc.add(()=>{_.speed=Ge.speed.toFixed(2),_.grounded=Ge.isGrounded?"yes":"no";const w=Ge.position;_.position=`${w.x.toFixed(1)}, ${w.y.toFixed(1)}, ${w.z.toFixed(1)}`,_.zone=ye.current?.name??"—",_.crossings=ye.crossings,_.triangles=Vs.triangles,_.room=Fe.room??"open",_.audio=re===null?"rendering…":Fe.context.state,_.gust=Fe.weather.strength.toFixed(2),_.swell=Fe.weather.swell.toFixed(2),_.machine=re?.machinePhase??"—",_.emitters=re===null?"—":`${re.audibleCount} / ${re.occludedCount}`})}sc.add((i,t)=>{Ge.update(i);const e=ye.current;e&&Ge.position.y<e.floor&&ye.respawn();const n=ye.update();no.takeInteract()&&n&&ye.use(n),re?.update(i),Cn.render(t),ve.update()});Ge.update(0);Cn.render(0);await Mi.done();sc.start();
