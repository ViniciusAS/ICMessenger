ECHO ON
call cordova build --release android
REM keytool -genkey -v -keystore .\release\my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
call jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore .\release\my-release-key.keystore .\platforms\android\build\outputs\apk\android-release-unsigned.apk alias_name
del /P .\release\NewGenerated.apk
call D:\android\android-sdk-windows\build-tools\24.0.2\zipalign -v 4 .\platforms\android\build\outputs\apk\android-release-unsigned.apk .\release\NewGenerated.apk
