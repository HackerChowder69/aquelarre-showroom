# Abre el .docx en Word, actualiza índice y campos, guarda el .docx final y exporta PDF
param([string]$Entrada, [string]$SalidaDocx, [string]$SalidaPdf)
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
    $doc = $word.Documents.Open($Entrada, $false, $false)
    $doc.Fields.Update() | Out-Null
    foreach ($toc in $doc.TablesOfContents) { $toc.Update() }
    foreach ($sec in $doc.Sections) {
        foreach ($hf in $sec.Headers) { $hf.Range.Fields.Update() | Out-Null }
    }
    $doc.Repaginate()
    foreach ($toc in $doc.TablesOfContents) { $toc.UpdatePageNumbers() }
    $doc.SaveAs2($SalidaDocx, 16)        # wdFormatXMLDocument
    $doc.ExportAsFixedFormat($SalidaPdf, 17)  # wdExportFormatPDF
    "Paginas: " + $doc.ComputeStatistics(2)
    $doc.Close($false)
} finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
