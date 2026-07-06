package run.xrun.xrunapp

import android.util.Log
import android.view.Gravity
import android.view.View
import android.widget.FrameLayout
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class PangleBannerViewManager : SimpleViewManager<FrameLayout>() {

    override fun getName(): String = "PangleBannerViewManager"

    override fun createViewInstance(reactContext: ThemedReactContext): FrameLayout {
        return FrameLayout(reactContext).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT,
            )
        }
    }

    @ReactProp(name = "adUnitId")
    fun setAdUnitId(view: FrameLayout, adUnitId: String?) {
        if (adUnitId.isNullOrEmpty()) return
        val tag = view.getTag(TAG_LOADED_ID) as? String
        if (tag == adUnitId) return
        view.setTag(TAG_LOADED_ID, adUnitId)
        loadBanner(view, adUnitId)
    }

    private fun loadBanner(view: FrameLayout, adUnitId: String) {
        try {
            val sizeClass = Class.forName("com.bytedance.sdk.openadsdk.api.banner.PAGBannerSize")
            val bannerSize = sizeClass.getField("BANNER_W_320_H_50").get(null)

            val requestClass = Class.forName("com.bytedance.sdk.openadsdk.api.banner.PAGBannerRequest")
            val request = requestClass.getConstructor(sizeClass).newInstance(bannerSize)

            val listenerInterface = Class.forName("com.bytedance.sdk.openadsdk.api.banner.PAGBannerAdLoadListener")
            val listenerProxy = java.lang.reflect.Proxy.newProxyInstance(
                listenerInterface.classLoader,
                arrayOf(listenerInterface),
            ) { _, method, args ->
                when (method.name) {
                    "onError" -> {
                        val code = args?.getOrNull(0) as? Int ?: -1
                        val msg = args?.getOrNull(1) as? String ?: ""
                        Log.w("PangleBanner", "load fail code=$code msg=$msg")
                    }
                    "onAdLoaded" -> {
                        val bannerAd = args?.getOrNull(0)
                        if (bannerAd != null) {
                            attachBanner(view, bannerAd)
                        }
                    }
                }
                null
            }

            val bannerAdClass = Class.forName("com.bytedance.sdk.openadsdk.api.banner.PAGBannerAd")
            val loadAdMethod = bannerAdClass.getMethod(
                "loadAd",
                String::class.java,
                requestClass,
                listenerInterface,
            )
            loadAdMethod.invoke(null, adUnitId, request, listenerProxy)
        } catch (e: Throwable) {
            Log.w("PangleBanner", "reflection error: ${e.message}")
        }
    }

    private fun attachBanner(view: FrameLayout, bannerAd: Any) {
        try {
            val getBannerViewMethod = bannerAd.javaClass.getMethod("getBannerView")
            val bannerView = getBannerViewMethod.invoke(bannerAd) as? View ?: return
            view.post {
                view.removeAllViews()
                val lp = FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.WRAP_CONTENT,
                    FrameLayout.LayoutParams.WRAP_CONTENT,
                )
                lp.gravity = Gravity.CENTER
                view.addView(bannerView, lp)
            }
        } catch (e: Throwable) {
            Log.w("PangleBanner", "attach error: ${e.message}")
        }
    }

    companion object {
        private const val TAG_LOADED_ID = 0x7f000001
    }
}
