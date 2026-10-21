import {useState,useEffect} from 'react';
import HomeHero, {type Mode} from './HomeHero';
import HomeGrid from './HomeGrid';
import {getTrending,getTrendingTv} from '../../services/api';
import {tmdbBackdrop} from '../../utils/tmdbImage';
import type {HeroSlide} from '../../components/layout/Hero/ParallaxHero';
export default function Home(){
 const [mode,setMode]=useState<Mode>('movie');
 const [query,setQuery]=useState('');
 const [search,setSearch]=useState('');
 const [slides,setSlides]=useState<HeroSlide[]>([]);
 const [error,setError]=useState('');
 useEffect(()=>{const t=setTimeout(()=>setSearch(query),300);return()=>clearTimeout(t)},[query]);
 useEffect(()=>{let stale=false;setError('');setSlides([]);
 (mode==='movie'?getTrending():getTrendingTv()).then(data=>{if(stale)return;setSlides(data.results.filter(item=>item.backdrop_path).slice(0,5).map(item=>({id:item.id,backdropUrl:tmdbBackdrop(item.backdrop_path),title:'title'in item?item.title:item.name,overview:item.overview,score:item.vote_average,mediaType:mode,link:`/${mode}/${item.id}`})))}).catch(()=>{if(!stale)setError('The spotlight is taking a moment. You can retry below.')});return()=>{stale=true}},[mode]);
 return <main className="min-h-screen">
 <HomeHero slides={slides}/>
 <section id="discover" className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
 <div className="flex flex-wrap items-end justify-between gap-6 mb-8"><div><p className="text-accent text-xs font-bold uppercase tracking-[.2em] mb-3">Your next obsession starts here</p><h2 className="text-3xl sm:text-4xl font-bold tracking-tight">A world worth watching.</h2><p className="text-muted mt-3">Big-screen stories. Small-screen adventures. Find your next favourite.</p></div><span className="text-xs text-muted border border-token rounded-full px-4 py-2">Powered by TMDB</span></div>
 <div className="grid sm:grid-cols-[220px_1fr] gap-4 rounded-2xl border border-token bg-surface p-4 sm:p-5"><label className="text-xs text-muted font-semibold">01 / EXPLORE<select className="block w-full mt-2 rounded-lg border border-token bg-background px-4 py-3 text-foreground text-sm" aria-label="Media type" value={mode} onChange={e=>setMode(e.target.value as Mode)}><option value="movie">Movies</option><option value="tv">TV shows</option></select></label><label className="text-xs text-muted font-semibold">02 / FIND YOUR STORY<input className="block w-full mt-2 border border-token rounded-lg px-4 py-3 bg-background text-foreground text-sm" aria-label="Search titles" placeholder="Search by title…" value={query} onChange={e=>setQuery(e.target.value)}/></label></div>
 {error&&<p role="status" className="mt-4 text-muted">{error}</p>}
 <div className="flex items-center justify-between mt-10"><h3 className="text-xl font-semibold">{search?`Results for “${search}”`:'Popular right now'}</h3><span className="text-muted text-xs">{mode==='movie'?'THE FILM EDIT':'SERIES TO SAVOUR'}</span></div>
 <HomeGrid key={`${mode}:${search}`} mode={mode} query={search}/>
 <footer className="border-t border-token mt-10 pt-8 flex flex-wrap justify-between gap-4 text-xs text-muted"><span>ShowScenes. Made for the love of stories.</span><span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span></footer>
 </section></main>
}
