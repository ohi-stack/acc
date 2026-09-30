import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={
  title:'ACC™ | OneGodian Project Command Center',
  description:'ACC V2 project-centered operations, responsibilities, work orders, governed approvals, verification and audit.',
  other:{'codex-preview':'development'},
  icons:{icon:'/favicon.svg',shortcut:'/favicon.svg'},
};
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body>{children}</body></html>;
}
