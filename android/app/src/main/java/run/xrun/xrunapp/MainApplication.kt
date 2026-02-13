package run.xrun.xrunapp

import android.app.Application
import android.content.res.Configuration
import com.appsflyer.AppsFlyerLib
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.ReactHost
import com.facebook.react.common.ReleaseLevel
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.defaults.DefaultReactNativeHost

import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ReactNativeHostWrapper
import android.util.Log
import java.io.File

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost = ReactNativeHostWrapper(
      this,
      object : DefaultReactNativeHost(this) {

        override fun getJSBundleFile(): String? {

            if (BuildConfig.DEBUG) {
                return super.getJSBundleFile()
            }

            val file = File(applicationContext.filesDir, "index.android.bundle")
            if (file.exists()) {
                Log.d("MainApplication", "OTA Bundle loaded: " + file.absolutePath)
                return file.absolutePath
            }

            return super.getJSBundleFile()
        }

        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {

              Log.d("MainApplication", "=== PanglePackage 등록 시작 ===")
              add(PanglePackage())
              Log.d("MainApplication", "=== PanglePackage 등록 완료 ===")
              add(AyetOfferwallPackage())
            }

          override fun getJSMainModuleName(): String = ".expo/.virtual-metro-entry"

          override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

          override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
      }
  )

  override val reactHost: ReactHost
    get() = ReactNativeHostWrapper.createReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    DefaultNewArchitectureEntryPoint.releaseLevel = try {
      ReleaseLevel.valueOf(BuildConfig.REACT_NATIVE_RELEASE_LEVEL.uppercase())
    } catch (e: IllegalArgumentException) {
      ReleaseLevel.STABLE
    }
    loadReactNative(this)
    ApplicationLifecycleDispatcher.onApplicationCreate(this)

    AppsFlyerLib.getInstance().init("yKhEWc3Vnit9KBYVv9gXHn", null, this)
    AppsFlyerLib.getInstance().setDebugLog(true)
    AppsFlyerLib.getInstance().start(this)
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
  }
}
