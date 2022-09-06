!macro customInstall
  DeleteRegKey HKCR "electron-demo"
  WriteRegStr HKCR "electron-demo" "" "URL:electron-demo"
  WriteRegStr HKCR "electron-demo" "URL Protocol" ""
  WriteRegStr HKCR "electron-demo\shell" "" ""
  WriteRegStr HKCR "electron-demo\shell\Open" "" ""
  WriteRegStr HKCR "electron-demo\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend

!macro customUnInstall
  DeleteRegKey HKCR "electron-demo"
!macroend