import * as XLSX from 'xlsx'
import { getStatusInfo, formatDateShort } from '../utils/helpers'

export const exportToExcel = (apis, filename = 'API_Documentation') => {
  const wb = XLSX.utils.book_new()

  // ── Sheet 1: Summary ───────────────────────────────────────────────
  const summaryHeaders = [
    'No', 'API Name', 'Method', 'URL',
    'Status Code', 'Status', 'Result', 'Response Time (ms)', 'Created Date',
  ]
  const summaryRows = apis.map((api, i) => {
    const info = getStatusInfo(api.statusCode)
    return [
      i + 1,
      api.name || '',
      api.method || '',
      api.url || '',
      api.statusCode || '',
      info.label,
      info.result,
      api.responseTime != null ? api.responseTime : '',
      formatDateShort(api.createdAt),
    ]
  })

  const ws1 = XLSX.utils.aoa_to_sheet([summaryHeaders, ...summaryRows])
  ws1['!cols'] = [
    { wch: 5 }, { wch: 28 }, { wch: 10 }, { wch: 45 },
    { wch: 13 }, { wch: 22 }, { wch: 10 }, { wch: 18 }, { wch: 15 },
  ]
  ws1['!freeze'] = { xSplit: 0, ySplit: 1, topLeftCell: 'A2', activePane: 'bottomLeft' }
  XLSX.utils.book_append_sheet(wb, ws1, 'Summary')

  // ── Sheet 2: Full Details ─────────────────────────────────────────
  const detailHeaders = [
    'No', 'API Name', 'Method', 'URL', 'Status Code', 'Result',
    'Response Time', 'Description', 'Request Headers', 'Request Body', 'Response Body', 'Created Date',
  ]
  const detailRows = apis.map((api, i) => {
    const info = getStatusInfo(api.statusCode)
    return [
      i + 1,
      api.name || '',
      api.method || '',
      api.url || '',
      api.statusCode || '',
      info.result,
      api.responseTime != null ? `${api.responseTime}ms` : '',
      api.description || '',
      api.requestHeaders || '',
      api.requestBody || '',
      api.responseBody || '',
      formatDateShort(api.createdAt),
    ]
  })

  const ws2 = XLSX.utils.aoa_to_sheet([detailHeaders, ...detailRows])
  ws2['!cols'] = [
    { wch: 5 }, { wch: 25 }, { wch: 10 }, { wch: 40 },
    { wch: 13 }, { wch: 10 }, { wch: 15 }, { wch: 30 },
    { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 15 },
  ]
  ws2['!freeze'] = { xSplit: 0, ySplit: 1, topLeftCell: 'A2', activePane: 'bottomLeft' }
  XLSX.utils.book_append_sheet(wb, ws2, 'Full Details')

  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`)
}
