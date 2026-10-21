import {createContext,useContext,useEffect,useMemo,useState,type ReactNode} from 'react';
type Theme='light'|'dark'|'cinematic';
const ThemeContext=createContext<{theme:Theme;setTheme:(theme:Theme)=>void;toggleTheme:()=>void;isDarkLike:boolean}|undefined>(undefined);
export function ThemeProvider({children}:{children:ReactNode}){
 const [theme,setTheme]=useState<Theme>(()=>{try{return localStorage.getItem('cinescope-theme')==='light'?'light':'dark'}catch{return 'dark'}});
 useEffect(()=>{document.documentElement.dataset.theme=theme;try{localStorage.setItem('cinescope-theme',theme)}catch{}},[theme]);
 const value=useMemo(()=>({theme,setTheme,toggleTheme:()=>setTheme(t=>t==='light'?'dark':'light'),isDarkLike:theme!=='light'}),[theme]);
 return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
export function useTheme(){const context=useContext(ThemeContext);if(!context)throw Error('ThemeProvider is required');return context}
