import Header from "../components/Header";
import type { MainLayoutProps } from "../interfaces/mainLayout.interface";
// diseños generales 
export default function MainLayout( {children}: MainLayoutProps) {
  return (
    <>
    <Header />
    <main className='min-h-screen'>{children}</main>
    </>
  )
}
