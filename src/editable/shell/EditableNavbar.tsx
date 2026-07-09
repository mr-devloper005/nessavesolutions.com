'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, UserPlus, LogIn, X, PlusCircle, LogOut, UserRound } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { editableLogoSrc } from '@/editable/content/brand-assets'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = globalContent.nav.primaryLinks

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <nav className="mx-auto flex min-h-[58px] w-full max-w-[var(--editable-container)] items-center gap-3 px-3 sm:px-4 lg:px-6">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-[5px] border border-[var(--editable-border)] bg-white transition group-hover:scale-[1.03]">
            <img src={editableLogoSrc} alt="" className="h-full w-full object-cover" />
          </span>
          <span className="hidden min-w-0 md:block">
            <span className="editable-display block max-w-[180px] truncate text-base font-bold leading-none">{SITE_CONFIG.name}</span>
          </span>
        </Link>

        <div className="hidden items-stretch gap-1 xl:flex">
          {navItems.slice(0, 5).map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center rounded-md px-3 py-2 text-sm font-medium transition ${
                  active ? 'bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]' : 'text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-gray)] hover:text-[var(--slot4-page-text)]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <form action="/search" className="mx-auto hidden min-w-0 flex-1 md:flex">
          <label className="flex w-full max-w-[680px] items-center gap-2 rounded-md border border-[var(--editable-border)] bg-white px-3 py-2 transition focus-within:border-[var(--slot4-accent)] focus-within:ring-2 focus-within:ring-[var(--slot4-accent)]/15">
            <Search className="h-5 w-5 shrink-0 text-[var(--slot4-muted-text)]" />
            <input
              name="q"
              type="search"
              placeholder="Search..."
              className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[var(--slot4-muted-text)]"
            />
          </label>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-md border border-[var(--slot4-accent)] bg-[var(--editable-cta-bg)] px-4 py-2 text-sm font-semibold text-[var(--editable-cta-text)] transition hover:bg-[var(--slot4-accent-soft)] sm:inline-flex"
              >
                <PlusCircle className="h-4 w-4" /> Create
              </Link>
              <span className="hidden max-w-[150px] items-center gap-2 truncate rounded-md px-2 py-2 text-sm font-semibold text-[var(--slot4-page-text)] lg:inline-flex">
                <UserRound className="h-4 w-4 text-[var(--slot4-muted-text)]" /> {session.name}
              </span>
              <button
                type="button"
                onClick={logout}
                className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[var(--slot4-muted-text)] transition hover:bg-[var(--slot4-gray)] hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[var(--slot4-muted-text)] transition hover:bg-[var(--slot4-gray)] hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                <LogIn className="h-4 w-4" /> Login
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-md border border-[var(--slot4-accent)] bg-[var(--editable-cta-bg)] px-4 py-2 text-sm font-semibold text-[var(--editable-cta-text)] transition hover:bg-[var(--slot4-accent-soft)] sm:inline-flex"
              >
                <UserPlus className="h-4 w-4" /> Sign up
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-md border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-2 xl:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--editable-nav-bg)] px-4 py-5 xl:hidden">
          <form action="/search" className="mb-5 flex items-center gap-2 rounded-md border border-[var(--editable-border)] px-3 py-2">
            <Search className="h-4 w-4 text-[var(--slot4-muted-text)]" />
            <input name="q" type="search" placeholder="Search..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-muted-text)]" />
          </form>
          {session ? <p className="mb-3 rounded-md bg-[var(--slot4-gray)] px-4 py-3 text-sm font-semibold">Signed in as {session.name}</p> : null}
          <div className="grid gap-1">
            {[...navItems, ...(session ? [{ label: 'Create', href: '/create' }] : [{ label: 'Login', href: '/login' }, { label: 'Sign up', href: '/signup' }])].map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-4 py-3 text-sm font-semibold ${
                    active
                      ? 'bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]'
                      : 'text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-gray)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {session ? <button type="button" onClick={logout} className="rounded-md px-4 py-3 text-left text-sm font-semibold text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-gray)]">Logout</button> : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
