import { useToast } from '../../contexts/ToastContext'

interface Props {
  resume: string
  jobTitle: string
  company: string
}

function buildATSHtml(resume: string): string {
  // ATS-safe: single column, no tables, system fonts, clean text
  const normalized = resume
    .replace(/\u2014/g, '-')
    .replace(/\u2013/g, '-')
    .replace(/\u2015/g, '-')
    .replace(/\u2012/g, '-')
    .replace(/\u201c/g, '"')
    .replace(/\u201d/g, '"')
    .replace(/\u2018/g, "'")
    .replace(/\u2019/g, "'")
    .replace(/\u200b/g, '')
    .replace(/\u00a0/g, ' ')

  const lines = normalized.split('\n')
  let html = ''
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      html += '<br/>'
    } else if (trimmed === trimmed.toUpperCase() && trimmed.length > 2 && trimmed.length < 60) {
      html += `<h2 style="font-size:14px;font-weight:700;margin:16px 0 6px 0;border-bottom:1px solid #ccc;padding-bottom:3px;color:#1a1a1a;">${trimmed}</h2>`
    } else if (trimmed.startsWith('[GAP:')) {
      html += `<p style="font-size:11px;color:#d97706;margin:2px 0;">${trimmed}</p>`
    } else if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      html += `<p style="font-size:12px;margin:2px 0 2px 16px;color:#333;">${trimmed}</p>`
    } else {
      html += `<p style="font-size:12px;margin:3px 0;color:#333;">${trimmed}</p>`
    }
  }

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
@page { size: A4; margin: 20mm 18mm; }
body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; max-width: 100%; margin: 0; padding: 0; color: #333; line-height: 1.45; }
h2 { page-break-after: avoid; }
</style></head><body>${html}</body></html>`
}

export function PDFExport({ resume, jobTitle, company }: Props) {
  const { showToast } = useToast()

  const handleExport = () => {
    const html = buildATSHtml(resume)
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      showToast('error', 'Pop-up blocked. Allow pop-ups for this site.')
      return
    }
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.document.title = `${jobTitle} - ${company} - Resume`
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  return (
    <button className="btn-ghost text-sm" onClick={handleExport} title="Opens print dialog - save as PDF">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
        <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
        <path d="M12 17v-6" />
        <path d="M9.5 14.5 12 17l2.5-2.5" />
      </svg>
      Export PDF
    </button>
  )
}
