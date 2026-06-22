package run.xrun.xrunapp

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ForceKillModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "ForceKill"

    @ReactMethod
    fun killProcess() {
        android.os.Process.killProcess(android.os.Process.myPid())
        System.exit(0)
    }
}
