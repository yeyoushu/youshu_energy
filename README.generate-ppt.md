生成 PPTX 的步骤（在本地运行）

1. 在项目根目录安装依赖：

```powershell
npm install
```

2. 运行生成脚本：

```powershell
npm run gen-ppt
```

3. 输出文件：`docs/vue_interview_qas_generated.pptx`，用 PowerPoint 或 LibreOffice 打开并导出为 PDF：

```powershell
& 'C:\Program Files\LibreOffice\program\soffice.exe' --headless --convert-to pdf "docs\vue_interview_qas_generated.pptx" --outdir docs
```

如果你遇到权限或 COM 错误，请把错误信息粘回我，我会继续协助排查。
