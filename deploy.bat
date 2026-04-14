echo off
git add .
git commit -m "%~1"
git pull --rebase
git push
git push escuela HEAD:frontend/dashboard --force
echo ✅ Desplegado en Landing-IA + chatbot_escuela