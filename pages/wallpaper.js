(function(){
  var seenKey='wp_seen_v2';
  var sessionSeen=new Set();
  function loadSeen(){try{var s=localStorage.getItem(seenKey);return s?new Set(JSON.parse(s)):new Set();}catch(e){return new Set();}}
  function saveSeen(set){try{localStorage.setItem(seenKey,JSON.stringify(Array.from(set)));}catch(e){}}
  function fp(u){try{var a=new URL(u);return (a.hostname+a.pathname+a.search).toLowerCase();}catch(e){return (u||'').toLowerCase();}}
  function uniq(list){var out=[];var seen=new Set();for(var i=0;i<list.length;i++){var k=list[i].fingerprint||fp(list[i].url);if(!seen.has(k)){seen.add(k);out.push(list[i]);}}return out;}
  function j(url){return fetch(url,{mode:'cors',credentials:'omit'}).then(function(r){return r.json();});}
  function wallhaven(q,count,orientation){var ratio=orientation==='portrait'?'9x16':'16x9';var page=Math.floor(Math.random()*50)+1;var url='https://wallhaven.cc/api/v1/search?sorting=random&categories=111&purity=100&ratios='+ratio+'&atleast=1920x1080&page='+page+(q?('&q='+encodeURIComponent(q)):'');return j(url).then(function(x){var d=x&&x.data||[];return d.map(function(it){return{url:it.path,thumb:(it.thumbs&&it.thumbs.small)||it.path,source:'wallhaven',width:it.dimension_x,height:it.dimension_y,fingerprint:'wallhaven_'+it.id};});}).catch(function(){return[];});}
  function bing(count){var url='https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n='+(count||8)+'&mkt=en-US';return j(url).then(function(x){var arr=x&&x.images||[];return arr.map(function(it){var u='https://www.bing.com'+(it.url||it.urlbase);return{url:u,thumb:u,source:'bing',fingerprint:fp(u)};});}).catch(function(){return[];});}
  function picsum(count){var page=Math.floor(Math.random()*50)+1;var url='https://picsum.photos/v2/list?page='+page+'&limit='+(count||30);return j(url).then(function(x){return (x||[]).map(function(it){return{url:it.download_url,thumb:it.download_url,source:'picsum',width:it.width,height:it.height,fingerprint:fp(it.download_url)};});}).catch(function(){return[];});}
  function reddit(count){var url='https://www.reddit.com/r/wallpapers/top.json?limit='+(count||50)+'&t=month&raw_json=1';return j(url).then(function(x){var arr=((x&&x.data&&x.data.children)||[]).map(function(c){return c.data||{};});var items=[];for(var i=0;i<arr.length;i++){var u=arr[i].url_overridden_by_dest||arr[i].url;if(!u)continue;var lu=u.toLowerCase();if(lu.endsWith('.jpg')||lu.endsWith('.jpeg')||lu.endsWith('.png')||lu.indexOf('i.redd.it')>-1){items.push({url:u,thumb:arr[i].thumbnail&&arr[i].thumbnail.startsWith('http')?arr[i].thumbnail:u,source:'reddit',fingerprint:fp(u)});} }return items;}).catch(function(){return[];});}
  function unsplash(count,q){var n=count||5;var urls=[];for(var i=0;i<n;i++){var sig=Math.floor(Math.random()*1000000);var u='https://source.unsplash.com/random/1920x1080/?'+encodeURIComponent(q||'wallpaper')+'&sig='+sig;urls.push(u);}return Promise.resolve(urls.map(function(u){return{url:u,thumb:u,source:'unsplash',fingerprint:fp(u)};}));}
  function shuffle(a){for(var i=a.length-1;i>0;i--){var jx=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[jx];a[jx]=t;}return a;}
  async function fetchWallpapers(opts){opts=opts||{};var count=opts.count||30;var q=opts.query||'';var orientation=opts.orientation||'landscape';var sources=opts.sources||['wallhaven','bing','reddit','picsum','unsplash'];var nocache=!!opts.nocache;var promises=[];var per=Math.max(1,Math.ceil(count/sources.length));for(var i=0;i<sources.length;i++){var s=sources[i];if(s==='wallhaven')promises.push(wallhaven(q,per,orientation));else if(s==='bing')promises.push(bing(per));else if(s==='picsum')promises.push(picsum(per));else if(s==='reddit')promises.push(reddit(Math.max(per,50)));else if(s==='unsplash')promises.push(unsplash(per,q));}
  var res=(await Promise.all(promises)).flat();
  res=uniq(res);
  res=shuffle(res);
  var persistentSeen=nocache?new Set():loadSeen();
  var filtered=[];for(var k=0;k<res.length;k++){var key=res[k].fingerprint||fp(res[k].url);if(!persistentSeen.has(key)&&!sessionSeen.has(key)){sessionSeen.add(key);if(!nocache)persistentSeen.add(key);filtered.push(res[k]);if(filtered.length>=count)break;}}
  if(!nocache)saveSeen(persistentSeen);
  if(filtered.length<count){var missing=count-filtered.length;var fills=[];var u=await unsplash(Math.ceil(missing/2),q);var p=await picsum(missing-Math.ceil(missing/2));fills=fills.concat(u).concat(p);fills=uniq(fills);fills=shuffle(fills);var extra=[];for(var i=0;i<fills.length&&extra.length<missing;i++){var key=fills[i].fingerprint||fp(fills[i].url);if(!persistentSeen.has(key)&&!sessionSeen.has(key)){sessionSeen.add(key);if(!nocache)persistentSeen.add(key);extra.push(fills[i]);}}filtered=filtered.concat(extra);} 
  return filtered;}
  function pick(list,n){var out=[];for(var i=0;i<list.length&&out.length<n;i++){out.push(list[i]);}return out;}
  function resetWallpaperCache(){try{localStorage.removeItem(seenKey);}catch(e){} sessionSeen=new Set();}
  window.fetchWallpapers=fetchWallpapers;
  window.resetWallpaperCache=resetWallpaperCache;
})();