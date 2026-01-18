package run.xrun.xrunapp

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import android.util.Log

class PanglePackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        Log.d("PanglePackage", "=== PangleModule 생성 시작 ===")
        val module = PangleModule(reactContext)
        Log.d("PanglePackage", "=== PangleModule 생성 완료 ===")
        return listOf(module)
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}

