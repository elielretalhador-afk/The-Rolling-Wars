export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

rm -rf android
npm run build
npx cap add android
npx cap sync android

mkdir -p android/app
keytool -genkey -v -keystore android/app/debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"

# (I will just reuse the android files creation logic that is inside main.yml)
          cat << 'INNER_EOF' > android/app/src/main/res/values/strings.xml
          <?xml version='1.0' encoding='utf-8'?>
          <resources>
              <string name="app_name">THE ROLLING WARS</string>
              <string name="title_activity_main">THE ROLLING WARS</string>
              <string name="package_name">com.urbanozeiro.app</string>
              <string name="custom_url_scheme">com.urbanozeiro.app</string>
              <string name="default_web_client_id">506646024333-7hkbs8qpejlt3l7rj3ng318fv7ukqr1l.apps.googleusercontent.com</string>
              <string name="facebook_app_id">1234567890</string>
              <string name="facebook_client_token">dummy_token</string>
          </resources>
          INNER_EOF
          
          cat << 'INNER_EOF' > android/variables.gradle
          ext {
              minSdkVersion = 24
              compileSdkVersion = 35
              targetSdkVersion = 35
              androidxActivityVersion = '1.11.0'
              androidxAppCompatVersion = '1.7.1'
              androidxCoordinatorLayoutVersion = '1.3.0'
              androidxCoreVersion = '1.17.0'
              androidxFragmentVersion = '1.8.9'
              coreSplashScreenVersion = '1.2.0'
              androidxWebkitVersion = '1.14.0'
              junitVersion = '4.13.2'
              androidxJunitVersion = '1.3.0'
              androidxEspressoCoreVersion = '3.7.0'
              cordovaAndroidVersion = '14.0.1'
              rgcfaIncludeGoogle = true
              rgcfaIncludeFacebook = true
          }
          INNER_EOF
          
          cat << 'INNER_EOF' > android/app/build.gradle
          apply plugin: 'com.android.application'
          
          android {
              namespace = "com.urbanozeiro.app"
              compileSdk = rootProject.ext.compileSdkVersion
              defaultConfig {
                  applicationId "com.urbanozeiro.app"
                  minSdkVersion rootProject.ext.minSdkVersion
                  targetSdkVersion rootProject.ext.targetSdkVersion
                  versionCode 1
                  versionName "1.0"
                  testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
                  aaptOptions {
                      ignoreAssetsPattern = '!.svn:!.git:!.ds_store:!*.scc:.*:!CVS:!thumbs.db:!picasa.ini:!*~'
                  }
              }
              signingConfigs {
                  debug {
                      storeFile file('debug.keystore')
                      storePassword 'android'
                      keyAlias 'androiddebugkey'
                      keyPassword 'android'
                  }
              }
              buildTypes {
                  debug {
                      signingConfig signingConfigs.debug
                  }
                  release {
                      minifyEnabled false
                      proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
                  }
              }
          }
          
          repositories {
              flatDir{
                  dirs '../capacitor-cordova-android-plugins/src/main/libs', 'libs'
              }
          }
          
          dependencies {
              implementation fileTree(include: ['*.jar'], dir: 'libs')
              implementation "androidx.appcompat:appcompat:$androidxAppCompatVersion"
              implementation "androidx.coordinatorlayout:coordinatorlayout:$androidxCoordinatorLayoutVersion"
              implementation "androidx.core:core-splashscreen:$coreSplashScreenVersion"
              implementation project(':capacitor-android')
              testImplementation "junit:junit:$junitVersion"
              androidTestImplementation "androidx.test.ext:junit:$androidxJunitVersion"
              androidTestImplementation "androidx.test.espresso:espresso-core:$androidxEspressoCoreVersion"
              implementation project(':capacitor-cordova-android-plugins')
              
              // Force include dependencies for Firebase Authentication plugin
              implementation "com.google.android.gms:play-services-auth:21.0.0"
              implementation "androidx.credentials:credentials:1.2.1"
              implementation "androidx.credentials:credentials-play-services-auth:1.2.1"
              implementation "com.google.android.libraries.identity.googleid:googleid:1.1.0"
          }
          
          apply from: 'capacitor.build.gradle'
          
          try {
              def servicesJSON = file('google-services.json')
              if (servicesJSON.text) {
                  apply plugin: 'com.google.gms.google-services'
              } else {
                  throw new GradleException("google-services.json is empty!")
              }
          } catch(Exception e) {
              throw new GradleException("google-services.json is MISSING! Please ensure it is exported and committed to GitHub. " + e.getMessage())
          }
          INNER_EOF
          
          cat << 'INNER_EOF' > android/app/src/main/AndroidManifest.xml
          <?xml version="1.0" encoding="utf-8"?>
          <manifest xmlns:android="http://schemas.android.com/apk/res/android">
              <application
                  android:allowBackup="true"
                  android:icon="@mipmap/ic_launcher"
                  android:label="@string/app_name"
                  android:roundIcon="@mipmap/ic_launcher_round"
                  android:supportsRtl="true"
                  android:theme="@style/AppTheme">
                  <activity
                      android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode|navigation|density"
                      android:name=".MainActivity"
                      android:label="@string/title_activity_main"
                      android:theme="@style/AppTheme.NoActionBarLaunch"
                      android:launchMode="singleTask"
                      android:exported="true">
                      <intent-filter>
                          <action android:name="android.intent.action.MAIN" />
                          <category android:name="android.intent.category.LAUNCHER" />
                      </intent-filter>
                  </activity>
                  <provider
                      android:name="androidx.core.content.FileProvider"
                      android:authorities="${applicationId}.fileprovider"
                      android:exported="false"
                      android:grantUriPermissions="true">
                      <meta-data
                          android:name="android.support.FILE_PROVIDER_PATHS"
                          android:resource="@xml/file_paths"></meta-data>
                  </provider>
                  <receiver android:name="io.capawesome.capacitorjs.plugins.foregroundservice.NotificationActionBroadcastReceiver" />
                  <service android:name="io.capawesome.capacitorjs.plugins.foregroundservice.AndroidForegroundService" android:foregroundServiceType="location" />
              </application>
              <!-- Permissions -->
              <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
              <uses-permission android:name="android.permission.WAKE_LOCK" />
              <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
              <uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />
              <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
              <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
              <uses-permission android:name="android.permission.INTERNET" />
              <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
              <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
              <uses-feature android:name="android.hardware.location.gps" android:required="false" />
          </manifest>
          INNER_EOF
          

cd android && chmod +x gradlew && ./gradlew assembleDebug --stacktrace
