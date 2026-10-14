import{mountFooter}from './shared.js';
const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('./company.css',import.meta.url);document.head.append(css);mountFooter();
const about=[...document.querySelectorAll('.navigation button')].find(el=>el.textContent.trim()==='About');if(about){about.disabled=false;about.removeAttribute('title');about.addEventListener('click',()=>location.href=new URL('./about.html',import.meta.url))}
// Only add the supplied contact detail to the contact area; do not repeat it sitewide.
if(location.hash==='#company')css.addEventListener('load',()=>document.getElementById('company').scrollIntoView({behavior:'instant'}),{once:true});
