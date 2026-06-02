package run.xrun.xrunapp

import android.content.Context
import android.util.Log
import android.view.View
import android.widget.FrameLayout
import com.bytedance.sdk.openadsdk.api.PAGRequest
import com.bytedance.sdk.openadsdk.api.banner.PAGBannerAd
import com.bytedance.sdk.openadsdk.api.banner.PAGBannerAdInteractionListener
import com.bytedance.sdk.openadsdk.api.banner.PAGBannerAdLoadListener
import com.bytedance.sdk.openadsdk.api.banner.PAGBannerRequest
import com.bytedance.sdk.openadsdk.api.banner.PAGBannerSize
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.RCTEventEmitter

class PangleBannerView(context: Context) : FrameLayout(context) {

    private var slotId: String? = null
    private var bannerAd: PAGBannerAd? = null
    private var loaded = false

    fun setSlotId(id: String) {
        if (id == slotId) return
        slotId = id
        loadAd()
    }

    private fun loadAd() {
        val sid = slotId ?: return
        if (loaded) return
        try {
            val request = PAGBannerRequest(PAGBannerSize.BANNER_W_320_H_50)
            PAGBannerAd.loadAd(sid, request, object : PAGBannerAdLoadListener {
                override fun onError(code: Int, msg: String?) {
                    Log.w("PangleBanner", "load failed slot=$sid code=$code msg=$msg")
                    sendEvent("onAdFailedToLoad", Arguments.createMap().apply {
                        putInt("code", code); putString("error", msg ?: "")
                    })
                }

                override fun onAdLoaded(ad: PAGBannerAd?) {
                    if (ad == null) {
                        sendEvent("onAdFailedToLoad", Arguments.createMap().apply { putString("error", "ad null") })
                        return
                    }
                    bannerAd = ad
                    loaded = true
                    ad.setAdInteractionListener(object : PAGBannerAdInteractionListener {
                        override fun onAdShowed() { sendEvent("onAdImpression", Arguments.createMap()) }
                        override fun onAdClicked() { sendEvent("onAdClicked", Arguments.createMap()) }
                        override fun onAdDismissed() {}
                    })
                    val v = ad.bannerView
                    val lp = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
                    removeAllViews()
                    addView(v, lp)
                    sendEvent("onAdLoaded", Arguments.createMap())
                }
            })
        } catch (e: Throwable) {
            Log.e("PangleBanner", "load exception: ${e.message}")
            sendEvent("onAdFailedToLoad", Arguments.createMap().apply { putString("error", e.message ?: "") })
        }
    }

    private fun sendEvent(name: String, body: WritableMap) {
        try {
            val ctx = context as ReactContext
            ctx.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, name, body)
        } catch (_: Throwable) {}
    }
}
