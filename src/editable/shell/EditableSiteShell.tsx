import type { ReactNode } from 'react'
import { EditableNavbar } from '@/editable/shell/EditableNavbar'
import { EditableFooter } from '@/editable/shell/EditableFooter'
import { EditablePageMotion } from '@/editable/shell/EditablePageMotion'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { editableFaviconIcoSrc, editableFaviconPngSrc } from '@/editable/content/brand-assets'

export function EditableSiteShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`editable-site-root ${dc.shell.page} flex min-h-screen flex-col ${className}`}>
      <link rel="icon" href={editableFaviconIcoSrc} sizes="any" />
      <link rel="icon" type="image/png" href={editableFaviconPngSrc} />
      <link rel="shortcut icon" href={editableFaviconIcoSrc} />
      <EditableNavbar />
      <EditablePageMotion>{children}</EditablePageMotion>
      <EditableFooter />
    </div>
  )
}
