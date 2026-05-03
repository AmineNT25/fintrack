'use client'
export const dynamic = 'force-dynamic'
import { useState, useRef } from 'react'
import { toast } from 'sonner'
import Papa from 'papaparse'
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CATEGORIES } from '@/lib/categories'

interface RawRow { [key: string]: string }

interface MappedRow {
  date: string
  description: string
  amount: string
  type: string
  category: string
  valid: boolean
  error?: string
}

const FIELD_OPTIONS = ['date', 'description', 'amount', 'type', 'category', 'notes', '(ignore)'] as const

export default function ImportPage() {
  const [step, setStep] = useState(1)
  const [headers, setHeaders] = useState<string[]>([])
  const [rawRows, setRawRows] = useState<RawRow[]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [preview, setPreview] = useState<MappedRow[]>([])
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ created: number; skipped: number } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    Papa.parse<RawRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete(res) {
        const hdrs = res.meta.fields ?? []
        setHeaders(hdrs)
        setRawRows(res.data)
        const auto: Record<string, string> = {}
        hdrs.forEach(h => {
          const lh = h.toLowerCase()
          if (lh.includes('date')) auto[h] = 'date'
          else if (lh.includes('desc') || lh.includes('note') || lh.includes('memo')) auto[h] = 'description'
          else if (lh.includes('amount') || lh.includes('sum') || lh.includes('value')) auto[h] = 'amount'
          else if (lh.includes('type') || lh.includes('kind')) auto[h] = 'type'
          else if (lh.includes('categ')) auto[h] = 'category'
          else auto[h] = '(ignore)'
        })
        setMapping(auto)
        setStep(2)
      },
    })
  }

  function buildPreview() {
    const reverse: Record<string, string> = {}
    Object.entries(mapping).forEach(([col, field]) => { if (field !== '(ignore)') reverse[field] = col })

    const rows = rawRows.slice(0, 20).map(row => {
      const date = row[reverse.date] ?? ''
      const description = row[reverse.description] ?? ''
      const amount = row[reverse.amount] ?? ''
      const type = row[reverse.type] ?? ''
      const category = row[reverse.category] ?? 'other'

      let valid = true
      let error = ''
      if (!date || isNaN(new Date(date).getTime())) { valid = false; error = 'Invalid date' }
      else if (isNaN(parseFloat(amount))) { valid = false; error = 'Invalid amount' }
      else if (!['income', 'expense'].includes(type.toLowerCase())) { valid = false; error = 'Type must be income or expense' }

      return { date, description, amount, type, category, valid, error }
    })
    setPreview(rows)
    setStep(3)
  }

  async function handleImport() {
    setImporting(true)
    const reverse: Record<string, string> = {}
    Object.entries(mapping).forEach(([col, field]) => { if (field !== '(ignore)') reverse[field] = col })

    const transactions = rawRows
      .map(row => ({
        date: row[reverse.date] ?? '',
        description: row[reverse.description] ?? '',
        amount: row[reverse.amount] ?? '',
        type: (row[reverse.type] ?? '').toLowerCase(),
        category: (row[reverse.category] ?? 'other').toLowerCase(),
        notes: row[reverse.notes] ?? '',
      }))
      .filter(t => t.date && !isNaN(new Date(t.date).getTime()) && !isNaN(parseFloat(t.amount)) && ['income', 'expense'].includes(t.type))

    const res = await fetch('/api/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactions }),
    })
    const data = await res.json()
    setImporting(false)
    if (res.ok) {
      setResult(data)
      toast.success(`${data.created} transaction${data.created !== 1 ? 's' : ''} imported`)
      setStep(4)
    } else {
      toast.error('Import failed')
    }
  }

  const validCount = preview.filter(r => r.valid).length

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Import Transactions from CSV</h1>

      <div className="flex items-center gap-4">
        {[1, 2, 3].map(n => (
          <div key={n} className="flex items-center gap-2">
            {n > 1 && <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-800 w-12" />}
            <div className={`flex items-center gap-2 ${step >= n ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-500 dark:text-zinc-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${step >= n ? 'bg-blue-500' : 'bg-zinc-400 dark:bg-zinc-800'}`}>{n}</div>
              <span className="text-sm">{['Upload', 'Map Columns', 'Confirm'][n - 1]}</span>
            </div>
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card className="p-12 bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800 border-dashed">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Upload CSV File</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Drag and drop or click to browse</p>
              <p className="text-xs text-zinc-500 mt-2">Supported format: .csv</p>
            </div>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => fileRef.current?.click()}>
              <FileText className="w-4 h-4 mr-2" /> Select File
            </Button>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="p-6 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Map CSV Columns</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {headers.map(h => (
              <div key={h} className="space-y-2">
                <label className="text-sm text-zinc-600 dark:text-zinc-400">{h}</label>
                <Select value={mapping[h] ?? '(ignore)'} onValueChange={v => setMapping(m => ({ ...m, [h]: v }))}>
                  <SelectTrigger className="bg-zinc-50 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    {FIELD_OPTIONS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)} className="border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">Back</Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={buildPreview}>Preview</Button>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card className="p-6 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Preview (first 20 rows)</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            {validCount} valid · {preview.length - validCount} invalid (will be skipped) · {rawRows.length} total rows
          </p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  {['Date', 'Description', 'Amount', 'Type', 'Category', 'Status'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className={`border-b border-zinc-200 dark:border-zinc-800 ${!row.valid ? 'bg-red-500/10' : ''}`}>
                    <td className="py-3 px-4 text-sm text-zinc-900 dark:text-zinc-100">{row.date}</td>
                    <td className="py-3 px-4 text-sm text-zinc-900 dark:text-zinc-100">{row.description}</td>
                    <td className="py-3 px-4 text-sm text-zinc-900 dark:text-zinc-100">{row.amount}</td>
                    <td className="py-3 px-4 text-sm text-zinc-900 dark:text-zinc-100">{row.type}</td>
                    <td className="py-3 px-4 text-sm text-zinc-900 dark:text-zinc-100">{row.category}</td>
                    <td className="py-3 px-4">
                      {row.valid
                        ? <div className="flex items-center gap-1 text-green-600 dark:text-green-400"><CheckCircle className="w-4 h-4" /><span className="text-xs">Valid</span></div>
                        : <div className="flex items-center gap-1 text-red-600 dark:text-red-400"><AlertCircle className="w-4 h-4" /><span className="text-xs">{row.error}</span></div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setStep(2)} className="border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">Back</Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" disabled={importing} onClick={handleImport}>
              {importing ? 'Importing…' : `Import ${rawRows.length} Transactions`}
            </Button>
          </div>
        </Card>
      )}

      {step === 4 && result && (
        <Card className="p-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Import Complete</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{result.created} transaction{result.created !== 1 ? 's' : ''} imported</p>
              {result.skipped > 0 && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{result.skipped} skipped due to errors</p>}
            </div>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => { setStep(1); setResult(null) }}>
              Import More
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
