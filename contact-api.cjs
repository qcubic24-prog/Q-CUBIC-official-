const attempts=new Map();
function validate(input){
 const text=(key,min,max)=>{const v=input?.[key];if(typeof v!=='string'||v.trim().length<min||v.length>max)throw Error('Please check the '+key+' field.');return v.trim()};
 const data={name:text('name',1,100),phone:text('phone',7,30),email:text('email',3,254),address:text('address',0,500),requirements:text('requirements',10,4000)};
 if(!/^[+0-9 ()-]{7,30}$/.test(data.phone)||data.phone.replace(/\D/g,'').length<7)throw Error('Please enter a valid mobile number.');
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)||/[\r\n]/.test(data.name))throw Error('Please check your name and email address.');return data;
}
module.exports=async function contact(q,s,options={}){
 const env=options.env||process.env,send=options.fetch||fetch;
 const available=!!(env.RESEND_API_KEY&&env.CONTACT_FROM);
 const json=(code,data)=>{s.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store'});s.end(JSON.stringify(data))};
 if(q.method==='GET')return json(200,{available});
 if(q.method!=='POST')return json(405,{error:'Method not allowed.'});
 const host=q.headers.host||'',origin=q.headers.origin||'';
 const allowed=new Set(['http://127.0.0.1:4180','http://localhost:4180','http://127.0.0.1:3000','http://localhost:3000',env.CONTACT_SITE_ORIGIN,env.APP_URL].filter(Boolean));
 const isAllowedOrigin=!origin||allowed.has(origin)||origin.includes(host)||host.includes('run.app')||host.includes('localhost')||host.includes('127.0.0.1');
 if(!isAllowedOrigin)return json(403,{error:'Please send this form from the Q-Cubic website.'});
 if(!String(q.headers['content-type']).startsWith('application/json'))return json(415,{error:'Unsupported form format.'});
 try{
  let size=0,chunks=[];for await(const chunk of q){size+=chunk.length;if(size>20000)return json(413,{error:'Your enquiry is too long.'});chunks.push(chunk)}
  const input=JSON.parse(Buffer.concat(chunks).toString());if(input.companyWebsite)return json(400,{error:'Please try again.'});const data=validate(input);
  if(!available)return json(503,{error:'Direct email delivery is not connected yet.'});
  const ip=q.socket?.remoteAddress||'local',now=Date.now();for(const [key,value] of attempts)if(now-value.start>600000)attempts.delete(key);
  const entry=attempts.get(ip)||{start:now,count:0};if(entry.count>=5)return json(429,{error:'Please wait a few minutes before sending another enquiry.'});entry.count++;attempts.set(ip,entry);
  const response=await send('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+env.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:env.CONTACT_FROM,to:['contact@q-cubic.com'],reply_to:data.email,subject:'Q-Cubic enquiry — '+data.name,text:`Name: ${data.name}\nMobile: ${data.phone}\nEmail: ${data.email}\nAddress: ${data.address||'Not provided'}\n\nRequirements:\n${data.requirements}`}),signal:AbortSignal.timeout(15000)});
  if(!response.ok)return json(502,{error:'Email delivery could not be confirmed. Please try again later.'});
  const result=await response.json();if(!result.id)return json(502,{error:'Email delivery could not be confirmed.'});return json(200,{submitted:true});
 }catch(error){return json(error.name==='SyntaxError'?400:error.name==='TimeoutError'?504:400,{error:error.name==='SyntaxError'?'Invalid form data.':error.name==='TimeoutError'?'The email service timed out. Please try again.':error.message.startsWith('Please ')?error.message:'Unable to send right now. Please try again later.'})}
};
module.exports.validate=validate;
