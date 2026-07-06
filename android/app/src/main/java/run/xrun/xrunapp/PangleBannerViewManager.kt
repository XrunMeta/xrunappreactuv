package run.xrun.xrunapp

import android.util.Log
import android.view.ViewGroup
import android.widget.FrameLayout
import com.bytedance.sdk.openadsdk.api.PAGConstant
import com.bytedance.sdk.openadsdk.api.banner.PAGBannerAd
import com.bytedance.sdk.openadsdk.api.banner.PAGBannerAdInteractionListener
import com.bytedance.sdk.openadsdk.api.banner.PAGBannerAdLoadListener
import com.bytedance.sdk.openadsdk.api.banner.PAGBannerRequest
import com.bytedance.sdk.openadsdk.api.banner.PAGBannerSize
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class PangleBannerViewManager : SimpleViewManager<FrameLayout>() {

    override fun getName(): String = "PangleBannerViewManager"

    override fun createViewInstance(reactContext: ThemedReactContext): FrameLayout {
        return FrameLayout(reactContext)
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
        val request = PAGBannerRequest(PAGBannerSize.BANNER_W_320_H_50)
        PAGBannerAd.loadAd(adUnitId, request, object : PAGBannerAdLoadListener {
            override fun onError(code: Int, message: String?) {
                Log.w("PangleBanner", "load fail code=$code msg=$message")
            }

            override fun onAdLoaded(bannerAd: PAGBannerAd?) {
                if (bannerAd == null) return
                bannerAd.setAdInteractionListener(object : PAGBannerAdInteractionListener {
                    override fun onAdShowed() {}
                    override fun onAdClicked() {}
                    override fun onAdDismissed() {}
                })
                val bannerView = bannerAd.bannerView
                view.post {
                    view.removeAllViews()
                    val lp = FrameLayout.LayoutParams(
                        FrameLayout.LayoutParams.MATCH_PARENT,
                        FrameLayout.LayoutParams.MATCH_PARENT,
                    )
                    lp.gravity = android.view.Gravity.CENTER
                    view.addView(bannerView, lp)
                }
            }
        })
    }

    companion object {
        private const val TAG_LOADED_ID = 0x7f000001
    }
}
