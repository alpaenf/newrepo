Add-Type -AssemblyName System.Drawing

$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }
Set-Location (Split-Path -Parent $root)

$files = @(
    "logo 4 kab.png",
    "logokiri3.png",
    "logo1.png",
    "logo2.png",
    "logo p2dd.png",
    "logokiri2.png",
    "logokiri1.png",
    "logokiri4.png",
    "logo kpw0.png"
)

foreach ($f in $files) {
    $fullPath = Join-Path (Get-Location) $f
    if (Test-Path $fullPath) {
        $bytes = [System.IO.File]::ReadAllBytes($fullPath)
        $ms = New-Object System.IO.MemoryStream(,$bytes)
        $orig = [System.Drawing.Image]::FromStream($ms)
        $w = $orig.Width
        $h = $orig.Height
        
        # Max width/height 600px is more than enough for 2x retina display of 30-40px icons!
        $maxDim = 600
        if ($w -gt $maxDim -or $h -gt $maxDim) {
            $ratio = [Math]::Min($maxDim / $w, $maxDim / $h)
            $newW = [int]($w * $ratio)
            $newH = [int]($h * $ratio)
            
            $bmp = New-Object System.Drawing.Bitmap($newW, $newH)
            $g = [System.Drawing.Graphics]::FromImage($bmp)
            $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
            
            $g.DrawImage($orig, 0, 0, $newW, $newH)
            $g.Dispose()
            $orig.Dispose()
            $ms.Dispose()
            
            $outMs = New-Object System.IO.MemoryStream
            $bmp.Save($outMs, [System.Drawing.Imaging.ImageFormat]::Png)
            $bmp.Dispose()
            
            [System.IO.File]::WriteAllBytes($fullPath, $outMs.ToArray())
            $outMs.Dispose()
            
            $newSize = (Get-Item $fullPath).Length
            Write-Host "Optimized $f: from $w x $h -> $newW x $newH, new size: $([Math]::Round($newSize / 1KB, 1)) KB"
        } else {
            $orig.Dispose()
            $ms.Dispose()
            Write-Host "$f already optimal ($w x $h, $([Math]::Round($bytes.Length / 1KB, 1)) KB)"
        }
    }
}
