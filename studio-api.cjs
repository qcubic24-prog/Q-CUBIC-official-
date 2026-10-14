// Local editor only. Keep serve.cjs bound to 127.0.0.1; do not expose this API publicly.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const keys=['webTitle','webDescription','appTitle','appDescription','designTitle','socialTitle','socialDescription'];
function validate(input){
 if(!input||typeof input!=='object'||!Array.isArray(input.projects)||input.projects.length>40)throw Error('Invalid portfolio content.');
 const text=(v,max)=>{if(typeof v!=='string'||v.length>max)throw Error('A text field is missing or too long.');return v};
 const https=v=>{const value=text(v||'',2000);if(value){let u;try{u=new URL(value)}catch{throw Error('Enter a valid HTTPS link.')}if(u.protocol!=='https:'||u.username||u.password)throw Error('Use a public HTTPS link.');}return value};
 const output=Object.fromEntries(keys.map(k=>[k,text(input[k],2000)]));const ids=new Set();
 output.projects=input.projects.map(p=>{if(!p||typeof p!=='object')throw Error('Invalid project.');const id=text(p.id,80);if(!/^[a-zA-Z0-9-]+$/.test(id)||ids.has(id))throw Error('Invalid project ID.');ids.add(id);if(!['Posters','Brand identity','Visiting cards','Social creatives','Websites','Applications','Videos'].includes(p.category)||!['form','olive','cards','play'].includes(p.style))throw Error('Invalid project category.');if(typeof p.visible!=='boolean')throw Error('Invalid visibility.');const image=text(p.image,200);if(image&&!/^\.\/src\/studio\/uploads\/[a-zA-Z0-9-]+\.(jpg|png|webp)$/.test(image))throw Error('Invalid image path.');const video=text(p.video||'',200);if(video&&!/^\.\/src\/studio\/uploads\/[a-zA-Z0-9-]+\.mp4$/.test(video))throw Error('Invalid video path.');const url=text(p.url||'',2000);if(url){let parsed;try{parsed=new URL(url)}catch{throw Error('Enter a valid website link.')};if(parsed.protocol!=='https:'||parsed.username||parsed.password)throw Error('Use a public HTTPS website link.');}const videoUrl=https(p.videoUrl);if(videoUrl){const u=new URL(videoUrl);if(/(^|\.)drive\.google\.com$/.test(u.hostname)||!u.pathname.toLowerCase().endsWith('.mp4'))throw Error('Use a direct hosted MP4 URL. Put Drive links in the Google Drive source field.');}return{client:text(p.client||'',2000),year:text(p.year||'',2000),services:text(p.services||'',2000),instagram:https(p.instagram),driveSource:https(p.driveSource),videoUrl,video,url,id,title:text(p.title,160),description:text(p.description,2000),category:p.category,style:p.style,image,visible:p.visible}});output.backgrounds={};for(const key of ['hero','film','gaming']){const value=input.backgrounds?.[key]||'';if(typeof value!=='string'||(value&&!/^\.\/src\/studio\/uploads\/[a-zA-Z0-9-]+\.mp4$/.test(value)))throw Error('Invalid background video.');output.backgrounds[key]=value;}output.copy={};for(const [key,value] of Object.entries(input.copy||{})){if(!/^[a-zA-Z0-9]{1,80}$/.test(key))throw Error('Invalid content key.');output.copy[key]=text(value,2000);}if(Object.keys(output.copy).length>200)throw Error('Too many text fields.');output.socials={};for(const name of ['Instagram','YouTube','LinkedIn','Facebook','TikTok','Behance','X','Pinterest'])output.socials[name]=https(input.socials?.[name]);return output;
}
module.exports=async function handle(q,s,root){
 const json=(code,obj)=>{s.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store'});s.end(JSON.stringify(obj))};
 if(q.method!=='POST')return json(405,{error:'Use POST.'});
 const host=q.headers.host||'',origin=q.headers.origin||''; const isAllowedHost=['127.0.0.1:4180','localhost:4180','127.0.0.1:3000','localhost:3000'].includes(host)||host.includes('run.app')||host.includes('localhost')||host.includes('127.0.0.1'); const isAllowedOrigin=!origin||origin.includes(host)||origin===`http://${host}`||origin===`https://${host}`; if(!isAllowedHost||!isAllowedOrigin)return json(403,{error:'Use the local content editor to save changes.'});
 if(!String(q.headers['content-type']).startsWith('application/json'))return json(415,{error:'Expected JSON.'});
 try{
  let size=0,chunks=[];for await(const chunk of q){size+=chunk.length;if(size>85*1024*1024)return json(413,{error:'Upload is too large.'});chunks.push(chunk)}
  const body=JSON.parse(Buffer.concat(chunks).toString());
  if(q.url==='/api/studio/content'){
   const data=validate(body);for(const file of [...data.projects.flatMap(p=>[p.image,p.video]),...Object.values(data.backgrounds)])if(file&&!fs.existsSync(path.join(root,file)))throw Error('A media file is missing. Please upload it again.');
   const file=path.join(root,'src/studio/content.json');fs.copyFileSync(file,file+'.previous');const temp=file+'.'+crypto.randomUUID()+'.tmp';fs.writeFileSync(temp,JSON.stringify(data,null,2)+'\n');fs.renameSync(temp,file);return json(200,{saved:true});
  }
  if(q.url==='/api/studio/upload'){
   const m=/^data:(?:image\/(png|jpeg|webp)|video\/(mp4));base64,([A-Za-z0-9+/=]+)$/.exec(body.data);if(!m)throw Error('Use a PNG, JPG, WebP image or MP4 video.');const buffer=Buffer.from(m[3],'base64');if(buffer.length>(m[2]?60:8)*1024*1024||buffer.length<12)throw Error('Images must be under 8 MB; MP4 videos under 60 MB.');
   const valid=m[2]?buffer.toString('ascii',4,8)==='ftyp':m[1]==='png'?buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):m[1]==='jpeg'?buffer[0]===255&&buffer[1]===216&&buffer[2]===255:buffer.toString('ascii',0,4)==='RIFF'&&buffer.toString('ascii',8,12)==='WEBP';if(!valid)throw Error('This file is not a supported image.');
   const name=crypto.randomUUID()+'.'+(m[2]?'mp4':m[1]==='jpeg'?'jpg':m[1]);const dir=path.join(root,'src/studio/uploads');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,name),buffer);return json(200,{path:'./src/studio/uploads/'+name});
  }return json(404,{error:'Unknown editor action.'});
 }catch(e){json(400,{error:e instanceof SyntaxError?'Invalid content format.':e.message})}
};
module.exports.validate=validate;
