export const consentRegions = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
];

export function allowsTracking(country: string, optedOut = false) {
  return /^[A-Z]{2}$/.test(country) && country !== "XX" &&
    !consentRegions.includes(country) && !optedOut;
}

// No banner: unresolved and consent-required regions never load either provider tag.
export const landingTrackingScript = `(async function(){
  if(window.__landingTrackingStarted)return;
  window.__landingTrackingStarted=true;
  function refused(){try{return localStorage.getItem('landing-ad-opt-out')==='true'||navigator.globalPrivacyControl===true||navigator.doNotTrack==='1';}catch(e){return true;}}
  if(refused())return;
  async function locate(url){
    var controller=new AbortController();var timer=setTimeout(function(){controller.abort();},2000);
    try{
      var response=await fetch(url,{signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer'});
      if(!response.ok)return '';
      var text=await response.text();var match=text.match(/^loc=([A-Z]{2})\r?$/m);
      return match?match[1]:'';
    }catch(e){return '';}finally{clearTimeout(timer);}
  }
  var country=await locate('/cdn-cgi/trace');
  // Hosts without Cloudflare's same-origin endpoint use its public CORS endpoint.
  // Explicit unknown/Tor locations stay blocked, rather than trying to override them.
  if(!country&&!refused())country=await locate('https://www.cloudflare.com/cdn-cgi/trace');
  if(!/^[A-Z]{2}$/.test(country)||country==='XX'||${JSON.stringify(consentRegions)}.includes(country)||refused())return;
  try{
    window.pixelId='6ad700460d97bdddd7f95342';
    function add(src,attributes){if(document.querySelector('script[src="'+src+'"]'))return;var s=document.createElement('script');s.src=src;s.async=true;s.defer=true;attributes.forEach(function(a){s.setAttribute(a,'');});document.head.appendChild(s);}
    add('https://cdn.utmify.com.br/scripts/pixel/pixel.js',[]);
    add('https://cdn.utmify.com.br/scripts/utms/latest.js',['data-utmify-prevent-xcod-sck','data-utmify-prevent-subids']);
  }catch(e){}
  window.addEventListener('storage',function(e){if(e.key==='landing-ad-opt-out'&&e.newValue==='true')location.reload();});
})();`;