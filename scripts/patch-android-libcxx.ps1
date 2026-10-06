$ErrorActionPreference = "Stop"

$mobileRoot = Split-Path -Parent $PSScriptRoot
$cmakeFiles = @(
  "node_modules/react-native-screens/android/CMakeLists.txt",
  "node_modules/react-native-worklets/android/CMakeLists.txt",
  "node_modules/react-native-reanimated/android/CMakeLists.txt",
  "node_modules/expo-modules-core/android/CMakeLists.txt",
  "node_modules/react-native-gesture-handler/android/src/main/jni/CMakeLists.txt",
  "node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup/CMakeLists.txt"
)
$linkLine = 'string(APPEND CMAKE_CXX_STANDARD_LIBRARIES " -lc++_shared")'

foreach ($relativePath in $cmakeFiles) {
  $filePath = Join-Path $mobileRoot $relativePath
  if (-not (Test-Path -LiteralPath $filePath)) {
    throw "Missing native dependency file: $relativePath. Run npm install first."
  }

  $content = Get-Content -LiteralPath $filePath -Raw
  if ($content.Contains($linkLine)) {
    Write-Host "Already patched: $relativePath"
    continue
  }

  $updated = [regex]::Replace(
    $content,
    '(?m)^(project\([^\r\n]+\)\r?\n)',
    "`$1$linkLine`r`n",
    1
  )
  if ($updated -eq $content) {
    throw "Could not find the CMake project declaration in: $relativePath"
  }

  Set-Content -LiteralPath $filePath -Value $updated -Encoding utf8
  Write-Host "Patched: $relativePath"
}

Write-Host "Android native C++ runtime linking is ready."
