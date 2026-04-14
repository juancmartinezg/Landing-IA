@echo off
git add .
git commit -m "%~1"
git push
git push escuela HEAD:frontend/dashboard
echo ✅ Desplegado en Landing-IA + chatbot_escuela