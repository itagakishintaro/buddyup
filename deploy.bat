@echo off

rem コミュニティごとにgitのブランチを一つずつ作る。

if "%1" == "" (
  echo usage: % deploy.bat community_name 
  exit /b 1
}

rem echo doing "npm install"  
rem call npm install


echo we will checkout master branch, ok?
pause
git checkout master
git status
echo master branch is latest and clean?
pause  

git checkout -b %1

if not errorlevel 0  (
 echo you must input new community name 
 echo % deploy.bat community_name
 exit /b 1
)

echo check polymer-cli
call polymer --version
if not errorlevel 0 (
 echo you must install polymer-cli
 echo % npm install -g polymer-cli
 exit /b 1
)
echo polymer-cli ... check ok

echo check firebase-tools
call firebase --version
if not errorlevel 0  (
 echo you must install firebase 
 echo % npm install -g firebase-tools
 exit /b 1
)
echo firebase-cli ... check ok

echo changing .firebaserc
node deploy/deploy.js %1

echo please make new project "buddyup%1"
start https://console.firebase.google.com/
pause

echo please change "my-app.js" file's config setting line 248 along with web site
src\my-app.js

pause

echo polymer build
call polymer build

echo firebase login
call firebase login
if not errorlevel 0 (
 echo this will fail bihind proxy
 exit /b 1
)

firebase storage init

echo firebase deploy
call firebase deploy
if not errorlevel 0 (
 echo this will fail bihind proxy
 exit /b 1
)

cd ..\..


set /p answer="you need facebook settings? (y/N)  : %answer%"
if "%answer%"=="y" (
  echo "ok, let's go"
) else if "%answer%"=="n" ( 
  echo "cancel"
  exit /b 1
)else (
  echo "other key"
  exit /b 1
)

echo make new "facebook application", get an application id and secret. 
start https://developers.facebook.com/
pause

echo input the application id and secret to firebase facebook authentication
start https://console.firebase.google.com/project/buddyup%1/authentication/providers 
