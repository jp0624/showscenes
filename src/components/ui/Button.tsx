import type {ReactNode,ButtonHTMLAttributes,AnchorHTMLAttributes} from 'react';
import {Link} from 'react-router-dom';
type Props={children:ReactNode;className?:string}&(ButtonHTMLAttributes<HTMLButtonElement>&{to?:never}|AnchorHTMLAttributes<HTMLAnchorElement>&{to:string});
export default function Button(props:Props){const cls=`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition bg-foreground text-background hover:opacity-90 ${props.className??''}`;if(typeof props.to==='string'){const {to,children,className:_,...rest}=props;return <Link to={to} {...rest} className={cls}>{children}</Link>}const {children,className:_,...rest}=props as ButtonHTMLAttributes<HTMLButtonElement>;return <button {...rest} className={cls}>{children}</button>}
