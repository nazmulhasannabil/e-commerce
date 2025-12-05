import { Menu } from 'lucide-react'
import React from 'react'

const Header = ({ toggle }) => {
  return (
    <section className='flex items-center gap-2 p-4'>
        <div className="flex md:hidden items-center gap-2">
            <button onClick={toggle}><Menu className="w-6 h-6" /></button>
        </div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
    </section>
  )
}

export default Header