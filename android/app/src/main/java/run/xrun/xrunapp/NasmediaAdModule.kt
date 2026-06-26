package run.xrun.xrunapp

import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.nasmedia.admixerssp.common.AdMixer
import com.nasmedia.admixerssp.ads.AMMRewardVideo
import com.nasmedia.admixerssp.ads.AMMRewardVideoLoadCallback
import com.nasmedia.admixerssp.ads.AdError
import com.nasmedia.admixerssp.ads.AdInfo
import com.nasmedia.admixerssp.ads.FullScreenContentCallback
import com.nasmedia.admixerssp.ads.OnUserEarnedRewardListener
import android.os.Handler
import android.os.Looper

class NasmediaAdModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val mainHandler = Handler(Looper.getMainLooper())
    private var loadedAd: AMMRewardVideo? = null
    private var isInitialized = false

    override fun getName(): String = "NasmediaAdModule"

    private fun sendEvent(name: String, params: WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(name, params)
    }

    @ReactMethod
    fun initialize(mediaKey: String, adUnitIdsArr: ReadableArray, promise: Promise) {
        try {
            if (isInitialized) {
                promise.resolve(true)
                return
            }
            val context = reactApplicationContext.applicationContext
            val adUnits = ArrayList<String>().apply {
                for (i in 0 until adUnitIdsArr.size()) {
                    add(adUnitIdsArr.getString(i) ?: "")
                }
            }
            AdMixer.getInstance().initialize(context, mediaKey, adUnits)
            isInitialized = true
            Log.d("NasmediaAd", "initialized mediaKey=$mediaKey adUnits=$adUnits")
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e("NasmediaAd", "initialize failed", e)
            promise.reject("INIT_ERROR", e.message ?: "initialize failed", e)
        }
    }

    @ReactMethod
    fun loadAndShowRewardedAd(adUnitId: String, memberId: Int, promise: Promise) {
        val activity = currentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "Current activity is null")
            return
        }
        if (!isInitialized) {
            promise.reject("NOT_INITIALIZED", "SDK not initialized — call initialize() first")
            return
        }

        mainHandler.post {
            try {

                loadedAd?.stop()
                loadedAd = null

                val adInfo = AdInfo.Builder(adUnitId)
                    .build()

                AMMRewardVideo.loadAd(activity, adInfo, object : AMMRewardVideoLoadCallback() {
                    override fun onSuccessLoadReward(adapterName: String, ad: AMMRewardVideo) {
                        Log.d("NasmediaAd", "onSuccessLoadReward adapter=$adapterName")
                        loadedAd = ad
                        sendEvent("NasmediaAd_onLoaded", Arguments.createMap().apply {
                            putString("adapter", adapterName)
                            putString("adUnitId", adUnitId)
                        })

                        ad.setFullScreenContentCallback(object : FullScreenContentCallback() {
                            override fun onAdShowedFullScreenContent() {
                                Log.d("NasmediaAd", "onAdShowedFullScreenContent")
                            }
                            override fun onAdClicked() {
                                Log.d("NasmediaAd", "onAdClicked")
                            }
                            override fun onAdCompleted() {
                                Log.d("NasmediaAd", "onAdCompleted")
                            }
                            override fun onAdDismissedFullScreenContent() {
                                Log.d("NasmediaAd", "onAdDismissedFullScreenContent")
                                sendEvent("NasmediaAd_onClosed", Arguments.createMap().apply {
                                    putString("adUnitId", adUnitId)
                                })
                                loadedAd = null
                            }
                            override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                                Log.e("NasmediaAd", "onAdFailedToShowFullScreenContent code=${adError.code} msg=${adError.message}")
                                sendEvent("NasmediaAd_onLoadFailed", Arguments.createMap().apply {
                                    putInt("errorCode", adError.code)
                                    putString("errorMsg", adError.message ?: "")
                                    putString("adUnitId", adUnitId)
                                })
                                loadedAd = null
                            }
                        })

                        if (ad.hasInterstitial) {
                            ad.show(activity, object : OnUserEarnedRewardListener {
                                override fun onUserEarnedReward() {
                                    Log.d("NasmediaAd", "onUserEarnedReward memberId=$memberId")
                                    sendEvent("NasmediaAd_onEarnedReward", Arguments.createMap().apply {
                                        putInt("memberId", memberId)
                                        putString("adUnitId", adUnitId)
                                    })
                                }
                            })
                        }
                    }

                    override fun onFailLoadReward(errorCode: Int, errorMsg: String?) {
                        Log.e("NasmediaAd", "onFailLoadReward code=$errorCode msg=$errorMsg")
                        sendEvent("NasmediaAd_onLoadFailed", Arguments.createMap().apply {
                            putInt("errorCode", errorCode)
                            putString("errorMsg", errorMsg ?: "")
                            putString("adUnitId", adUnitId)
                        })
                        loadedAd = null
                    }
                })

                promise.resolve(true)
            } catch (e: Exception) {
                Log.e("NasmediaAd", "loadAndShowRewardedAd failed", e)
                promise.reject("AD_ERROR", e.message ?: "load failed", e)
            }
        }
    }

    @ReactMethod
    fun stopAd(promise: Promise) {
        mainHandler.post {
            loadedAd?.stop()
            loadedAd = null
            promise.resolve(true)
        }
    }
}
