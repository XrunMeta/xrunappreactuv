package run.xrun.xrunapp

import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.nasmedia.admixerssp.common.AdMixer
import com.nasmedia.admixerssp.common.AdMixerLog
import com.nasmedia.admixerssp.ads.AdEvent
import com.nasmedia.admixerssp.ads.AdInfo
import com.nasmedia.admixerssp.ads.AdListener
import com.nasmedia.admixerssp.ads.RewardInterstitialVideoAd
import android.os.Handler
import android.os.Looper

class NasmediaAdModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val mainHandler = Handler(Looper.getMainLooper())
    private var rewardAd: RewardInterstitialVideoAd? = null
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

            AdMixerLog.setLogLevel(AdMixerLog.LogLevel.VERBOSE)
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
        val activity = reactApplicationContext.currentActivity
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

                rewardAd?.stopRewardVideoAd()
                rewardAd?.setListener(null)

                val customParams = HashMap<String, String>().apply {
                    put("xrun_member_id", memberId.toString())
                }

                val builder = AdInfo.Builder(adUnitId)
                    .setCustomParams(customParams)
                    .setMute(false)
                val adInfo = builder.build()

                val ad = RewardInterstitialVideoAd(activity)
                ad.setAdInfo(adInfo, activity)
                ad.setListener(object : AdListener {
                    override fun onReceivedAd(adapterName: String?, adView: Any?) {
                        Log.d("NasmediaAd", "onReceivedAd adapter=$adapterName")
                        sendEvent("NasmediaAd_onLoaded", Arguments.createMap().apply {
                            putString("adapter", adapterName)
                            putString("adUnitId", adUnitId)
                        })

                        mainHandler.post {
                            ad.showRewardVideoAd()
                        }
                    }

                    override fun onFailedToReceiveAd(adView: Any?, adapterName: String?, errorCode: Int, errorMsg: String?) {
                        Log.e("NasmediaAd", "onFailedToReceiveAd code=$errorCode msg=$errorMsg")
                        sendEvent("NasmediaAd_onLoadFailed", Arguments.createMap().apply {
                            putString("adapter", adapterName)
                            putInt("errorCode", errorCode)
                            putString("errorMsg", errorMsg ?: "")
                            putString("adUnitId", adUnitId)
                        })
                    }

                    override fun onEventAd(adView: Any?, adEvent: AdEvent?) {
                        Log.d("NasmediaAd", "onEventAd event=$adEvent")
                        when (adEvent) {
                            AdEvent.EARNEDREWARD -> {
                                Log.d("NasmediaAd", "EARNEDREWARD memberId=$memberId")
                                sendEvent("NasmediaAd_onEarnedReward", Arguments.createMap().apply {
                                    putInt("memberId", memberId)
                                    putString("adUnitId", adUnitId)
                                })
                            }
                            AdEvent.CLOSE, AdEvent.SKIPPED -> {
                                sendEvent("NasmediaAd_onClosed", Arguments.createMap().apply {
                                    putString("adUnitId", adUnitId)
                                    putString("event", adEvent.name)
                                })
                            }
                            else -> {  }
                        }
                    }
                })

                rewardAd = ad
                ad.loadRewardVideoAd()
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
            rewardAd?.stopRewardVideoAd()
            rewardAd?.setListener(null)
            rewardAd = null
            promise.resolve(true)
        }
    }
}
