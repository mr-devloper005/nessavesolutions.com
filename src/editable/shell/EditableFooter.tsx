'use client'

import Link from 'next/link'
import { ArrowUpRight, LogOut } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { editableLogoSrc } from '@/editable/content/brand-assets'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const navigationLinks = globalContent.nav.primaryLinks
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="border-t border-[var(--editable-border)] bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)_320px] lg:px-6">
        <div className="rounded-md border border-[var(--editable-border)] bg-white p-5">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[5px] border border-[var(--editable-border)] bg-white">
              <img src={editableLogoSrc} alt="" className="h-full w-full object-cover" />
            </span>
            <span className="editable-display text-lg font-black">{SITE_CONFIG.name}</span>
          </Link>
        </div>

        <div className="grid gap-7 rounded-md border border-[var(--editable-border)] bg-white p-5 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-black text-[var(--slot4-page-text)]">Explore</h3>
            <div className="mt-4 grid gap-2">
              {navigationLinks.map((item) => (
                <Link key={item.href} href={item.href} className="inline-flex items-center gap-2 text-sm font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">
                  {item.label} <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-black text-[var(--slot4-page-text)]">Popular Topics</h3>
            <div className="mt-4 grid gap-2 text-sm font-medium text-[var(--slot4-muted-text)]">
              {['Professional insight', 'Student resources', 'Creator profiles', 'Business discovery', 'Research notes'].map((item) => (
                <span key={item}>#{item.toLowerCase().replace(/\s+/g, '-')}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-md border border-[var(--editable-border)] bg-white p-5">
          <h3 className="text-sm font-black text-[var(--slot4-page-text)]">Site</h3>
          <div className="mt-4 grid gap-2">
            {[
              ['About', '/about'],
              ['Contact', '/contact'],
              ['Search', '/search'],
              ...(session ? [['Create', '/create']] : [['Login', '/login'], ['Sign up', '/signup']]),
            ].map(([label, href]) => (
              <Link key={href} href={href} className="text-sm font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">{label}</Link>
            ))}
            {session ? (
              <button type="button" onClick={logout} className="mt-2 inline-flex w-fit items-center gap-2 rounded-md border border-[var(--editable-border)] px-3 py-2 text-left text-sm font-semibold text-[var(--slot4-muted-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-page-text)]">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--editable-border)] px-4 py-5 text-center text-xs font-medium text-[var(--slot4-muted-text)]">
        (c) {year} {SITE_CONFIG.name}. All rights reserved.
      </div>
    </footer>
  )
}
