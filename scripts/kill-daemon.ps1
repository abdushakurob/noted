# Stop process listening on note'd default port (3737)
$port = if ($env:NOTED_PORT) { [int]$env:NOTED_PORT } else { 3737 }
$conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if (-not $conn) {
  Write-Host "No listener on port $port."
  exit 0
}
$daemonPid = @($conn.OwningProcess | Select-Object -Unique)[0]
Write-Host "Stopping PID $daemonPid on port $port..."
Stop-Process -Id $daemonPid -Force -ErrorAction Stop
Write-Host "Done."
