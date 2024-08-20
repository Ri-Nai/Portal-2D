try
{
  mkdir -p ./dist/style 2>&1 > $null
  mkdir -p ./dist/script 2>&1 > $null
}
catch {
  # Ignore
}


foreach ($i in dir ./src/style/*.less)
{
  $BaseName = $i.BaseName
  echo "[info] Building $BaseName.css"
  pnpm lessc $i.FullName "./dist/style/$BaseName.css"
  Write-Output "[info] Built $BaseName.css"
}

echo "[info] Building TypeScript"
pnpm tsc
Write-Output "[info] Built TypeScript"

try {
  cp -Recurse -Force ./src/** ./dist 2>&1 > $null
}
catch {
  # Ignore
}