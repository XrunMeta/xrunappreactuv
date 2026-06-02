package run.xrun.xrunapp

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class PangleBannerViewManager(private val reactContext: ReactApplicationContext) : SimpleViewManager<PangleBannerView>() {

    override fun getName(): String = "PangleBannerView"

    override fun createViewInstance(reactContext: ThemedReactContext): PangleBannerView {
        return PangleBannerView(reactContext)
    }

    @ReactProp(name = "slotId")
    fun setSlotId(view: PangleBannerView, slotId: String?) {
        if (!slotId.isNullOrEmpty()) view.setSlotId(slotId)
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
        return mutableMapOf(
            "onAdLoaded" to mapOf("registrationName" to "onAdLoaded"),
            "onAdFailedToLoad" to mapOf("registrationName" to "onAdFailedToLoad"),
            "onAdClicked" to mapOf("registrationName" to "onAdClicked"),
            "onAdImpression" to mapOf("registrationName" to "onAdImpression"),
        )
    }
}
