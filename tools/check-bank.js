// Pemeriksa bank soal. Jalankan dari folder proyek:  node tools/check-bank.js
const fs=require('fs'),path=require('path');
global.window=global;
const dir=path.join(__dirname,'..','data');
let err=0,warn=0;
for(const f of fs.readdirSync(dir).filter(f=>/^bank-.*\.js$/.test(f))) {
  try{ eval(fs.readFileSync(path.join(dir,f),'utf8')); }
  catch(e){ console.log('❌ '+f+': kesalahan penulisan -> '+e.message); err++; }
}
if(!global.BK){console.log('Tidak ada data bank.');process.exit(1)}
for(const [k,list] of Object.entries(global.BK)){
  let b=0,l=0;const seen=new Set();
  list.forEach((s,i)=>{
    const p=s.split('|'),no=`${k} #${i+1}`;
    if(p.length<3||p.length>4){console.log(`❌ ${no}: harus 3 atau 4 bagian dipisah | (ada ${p.length}) -> ${s.slice(0,50)}`);err++;return}
    const [q,a,src,d]=p.map(x=>x.trim());
    if(!q||!a){console.log(`❌ ${no}: pertanyaan atau jawaban kosong`);err++}
    if(src==='B')b++;else if(src==='L')l++;else{console.log(`❌ ${no}: sumber harus B atau L, bukan "${src}"`);err++}
    if(seen.has(q.toLowerCase())){console.log(`⚠️  ${no}: pertanyaan ganda -> ${q.slice(0,50)}`);warn++}
    seen.add(q.toLowerCase());
    if(d){const ds=d.split(';').map(x=>x.trim()).filter(Boolean);
      if(ds.includes(a)){console.log(`⚠️  ${no}: jawaban benar ikut ada di daftar pengecoh`);warn++}
      if(ds.length<2){console.log(`⚠️  ${no}: pengecoh kurang dari 2`);warn++}}
  });
  const n=b+l;console.log(`${k.padEnd(7)} ${String(list.length).padStart(5)} soal | B ${b} (${n?Math.round(b/n*100):0}%) | L ${l} (${n?Math.round(l/n*100):0}%)`);
}
console.log(`\nSelesai: ${err} kesalahan, ${warn} peringatan.`);
process.exit(err?1:0);
