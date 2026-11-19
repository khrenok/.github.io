import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const navItems = [
  { href: '#services', label: 'Услуги', id: 'services' },
  { href: '#process', label: 'Процесс', id: 'process' },
  { href: '#portfolio', label: 'Проекты', id: 'portfolio' },
  { href: '#pricing', label: 'Тарифы', id: 'pricing' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-20% 0px -65% 0px' },
    )
    navItems.forEach(({ id }) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <header className="site-header">
      <div className="header-shell">
        <a className="brand" href="#top" aria-label="NodeTrace — на главную" onClick={() => setOpen(false)}>
          <img src="./images/logo-mark.webp" width="44" height="44" alt="" />
          <span className="brand-copy">
            <strong>NodeTrace</strong>
            <small>R&D студия электроники</small>
          </span>
        </a>
        <nav id="main-navigation" className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Основная навигация">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className={active === item.id ? 'is-active' : ''} onClick={() => setOpen(false)}>
              <span className="nav-bracket" aria-hidden="true">{active === item.id ? '[•]' : '[ ]'}</span>
              {item.label}
            </a>
          ))}
          <a className="nav-contact-mobile" href="#contact" onClick={() => setOpen(false)}>Обсудить проект</a>
        </nav>
        <a className="header-cta" href="#contact">
          Обсудить проект <ArrowUpRight size={17} aria-hidden="true" />
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={23} aria-hidden="true" /> : <Menu size={23} aria-hidden="true" />}
        </button>
      </div>
    </header>
  )
}
