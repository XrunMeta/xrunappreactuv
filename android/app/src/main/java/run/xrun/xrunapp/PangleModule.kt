package run.xrun.xrunapp

import android.app.Activity
import android.content.Context
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.bytedance.sdk.openadsdk.api.init.PAGSdk
import com.bytedance.sdk.openadsdk.api.init.PAGConfig
import com.bytedance.sdk.openadsdk.api.reward.*
import com.bytedance.sdk.openadsdk.api.open.*
import android.os.Handler
import android.os.Looper

class PangleModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), LifecycleEventListener {

    private var reactContext: ReactApplicationContext = reactContext
    private var isInitialized = false
    private var rewardedAd: PAGRewardedAd? = null
    private var appOpenAd: PAGAppOpenAd? = null
    private var currentRewardedAdUnitId: String? = null
    private var currentAppOpenAdUnitId: String? = null

    init {
        reactContext.addLifecycleEventListener(this)
    }

    override fun getName(): String {
        return "PangleModule"
    }

    override fun onHostResume() {

    }

    override fun onHostPause() {

    }

    override fun onHostDestroy() {

    }

    @ReactMethod
    fun initialize(promise: Promise) {
        try {
            if (isInitialized) {
                Log.d("PangleModule", "이미 초기화되었습니다.")
                promise.resolve(true)
                return
            }

            val context = reactApplicationContext.applicationContext
            val appId = getAppIdFromManifest(context)

            if (appId == null || appId.isEmpty()) {
                val error = "Pangle App ID를 찾을 수 없습니다. AndroidManifest.xml을 확인하세요."
                Log.e("PangleModule", error)
                promise.reject("INIT_ERROR", error)
                return
            }

            Log.d("PangleModule", "Pangle 초기화 시작, App ID: $appId")

            val config = PAGConfig.Builder()
                .appId(appId)
                .debugLog(true) 
                .supportMultiProcess(false) 

                .build()

            PAGSdk.init(context, config, object : PAGSdk.PAGInitCallback {
                override fun success() {
                    Log.d("PangleModule", "Pangle 초기화 성공")
                    isInitialized = true

                    promise.resolve(true)
                }

                override fun fail(code: Int, msg: String) {
                    val error = "Pangle 초기화 실패: $msg (코드: $code)"
                    Log.e("PangleModule", error)
                    promise.reject("INIT_ERROR", error)
                }
            })
        } catch (e: Exception) {
            Log.e("PangleModule", "초기화 중 오류 발생", e)
            promise.reject("INIT_ERROR", e.message ?: "알 수 없는 오류")
        }
    }

    @ReactMethod
    fun isReady(promise: Promise) {
        promise.resolve(isInitialized && PAGSdk.isInitSuccess())
    }

    @ReactMethod
    fun getSDKVersion(promise: Promise) {
        try {
            val version = PAGSdk.getSDKVersion()
            promise.resolve(version)
        } catch (e: Exception) {
            Log.e("PangleModule", "SDK 버전 가져오기 실패", e)
            promise.reject("ERROR", e.message ?: "알 수 없는 오류")
        }
    }

    @ReactMethod
    fun getBiddingToken(promise: Promise) {
        try {
            if (!isInitialized || !PAGSdk.isInitSuccess()) {
                promise.reject("NOT_INITIALIZED", "Pangle이 초기화되지 않았습니다.")
                return
            }

            Thread {
                try {
                    val token = PAGSdk.getBiddingToken()
                    Handler(Looper.getMainLooper()).post {
                        promise.resolve(token)
                    }
                } catch (e: Exception) {
                    Log.e("PangleModule", "Bidding Token 가져오기 실패", e)
                    Handler(Looper.getMainLooper()).post {
                        promise.reject("TOKEN_ERROR", e.message ?: "알 수 없는 오류")
                    }
                }
            }.start()
        } catch (e: Exception) {
            Log.e("PangleModule", "Bidding Token 요청 실패", e)
            promise.reject("ERROR", e.message ?: "알 수 없는 오류")
        }
    }

    @ReactMethod
    fun loadRewardedAd(adUnitId: String, promise: Promise) {
        try {
            if (!isInitialized || !PAGSdk.isInitSuccess()) {
                promise.reject("NOT_INITIALIZED", "Pangle이 초기화되지 않았습니다.")
                return
            }

            Log.d("PangleModule", "보상형 광고 로드 시작: $adUnitId")
            currentRewardedAdUnitId = adUnitId

            val request = PAGRewardedRequest()
            PAGRewardedAd.loadAd(adUnitId, request, object : PAGRewardedAdLoadListener {
                override fun onError(code: Int, message: String) {
                    Log.e("PangleModule", "보상형 광고 로드 실패: $message (코드: $code)")
                    sendEvent("onRewardedAdError", createMap(
                        "adUnitId" to adUnitId,
                        "errorCode" to code,
                        "errorMsg" to message
                    ))
                    promise.reject("LOAD_ERROR", message)
                }

                override fun onAdLoaded(ad: PAGRewardedAd) {
                    Log.d("PangleModule", "보상형 광고 로드 완료: $adUnitId")
                    rewardedAd = ad
                    setRewardAdListener(ad, adUnitId)
                    sendEvent("onRewardedAdLoaded", createMap("adUnitId" to adUnitId))
                    promise.resolve(true)
                }
            })
        } catch (e: Exception) {
            Log.e("PangleModule", "보상형 광고 로드 중 오류", e)
            promise.reject("LOAD_ERROR", e.message ?: "알 수 없는 오류")
        }
    }

    @ReactMethod
    fun showRewardedAd(adUnitId: String, promise: Promise) {
        try {
            val ad = rewardedAd
            if (ad == null) {
                promise.reject("AD_NOT_LOADED", "광고가 로드되지 않았습니다.")
                return
            }

            val activity = reactApplicationContext.currentActivity
            if (activity == null) {
                promise.reject("NO_ACTIVITY", "Activity를 찾을 수 없습니다.")
                return
            }

            Handler(Looper.getMainLooper()).post {
                try {
                    Log.d("PangleModule", "보상형 광고 표시: $adUnitId")
                    ad.show(activity)
                    promise.resolve(true)
                } catch (e: Exception) {
                    Log.e("PangleModule", "보상형 광고 표시 중 오류", e)
                    promise.reject("SHOW_ERROR", e.message ?: "알 수 없는 오류")
                }
            }
        } catch (e: Exception) {
            Log.e("PangleModule", "보상형 광고 표시 중 오류", e)
            promise.reject("SHOW_ERROR", e.message ?: "알 수 없는 오류")
        }
    }

    @ReactMethod
    fun loadAppOpenAd(adUnitId: String, promise: Promise) {
        try {
            if (!isInitialized || !PAGSdk.isInitSuccess()) {
                promise.reject("NOT_INITIALIZED", "Pangle이 초기화되지 않았습니다.")
                return
            }

            Log.d("PangleModule", "앱 오프닝 광고 로드 시작: $adUnitId")
            currentAppOpenAdUnitId = adUnitId

            val request = PAGAppOpenRequest()

            request.setTimeout(3000)
            PAGAppOpenAd.loadAd(adUnitId, request, object : PAGAppOpenAdLoadListener {
                override fun onError(code: Int, message: String) {
                    Log.e("PangleModule", "앱 오프닝 광고 로드 실패: $message (코드: $code)")
                    sendEvent("onAppOpenAdError", createMap(
                        "adUnitId" to adUnitId,
                        "errorCode" to code,
                        "errorMsg" to message
                    ))
                    promise.reject("LOAD_ERROR", message)
                }

                override fun onAdLoaded(ad: PAGAppOpenAd) {
                    Log.d("PangleModule", "앱 오프닝 광고 로드 완료: $adUnitId")
                    appOpenAd = ad
                    setAppOpenAdListener(ad, adUnitId)
                    sendEvent("onAppOpenAdLoaded", createMap("adUnitId" to adUnitId))
                    promise.resolve(true)
                }
            })
        } catch (e: Exception) {
            Log.e("PangleModule", "앱 오프닝 광고 로드 중 오류", e)
            promise.reject("LOAD_ERROR", e.message ?: "알 수 없는 오류")
        }
    }

    @ReactMethod
    fun showAppOpenAd(adUnitId: String, promise: Promise) {
        try {
            val ad = appOpenAd
            if (ad == null) {
                promise.reject("AD_NOT_LOADED", "광고가 로드되지 않았습니다.")
                return
            }

            val activity = reactApplicationContext.currentActivity
            if (activity == null) {
                promise.reject("NO_ACTIVITY", "Activity를 찾을 수 없습니다.")
                return
            }

            Handler(Looper.getMainLooper()).post {
                try {
                    Log.d("PangleModule", "앱 오프닝 광고 표시: $adUnitId")
                    ad.show(activity)
                    promise.resolve(true)
                } catch (e: Exception) {
                    Log.e("PangleModule", "앱 오프닝 광고 표시 중 오류", e)
                    promise.reject("SHOW_ERROR", e.message ?: "알 수 없는 오류")
                }
            }
        } catch (e: Exception) {
            Log.e("PangleModule", "앱 오프닝 광고 표시 중 오류", e)
            promise.reject("SHOW_ERROR", e.message ?: "알 수 없는 오류")
        }
    }

    private fun setRewardAdListener(ad: PAGRewardedAd, adUnitId: String) {
        ad.setAdInteractionListener(object : PAGRewardedAdInteractionListener {
            override fun onAdShowed() {
                Log.d("PangleModule", "보상형 광고 표시됨")
            }

            override fun onAdClicked() {
                Log.d("PangleModule", "보상형 광고 클릭됨")
            }

            override fun onAdDismissed() {
                Log.d("PangleModule", "보상형 광고 닫힘")
                sendEvent("onRewardedAdClose", createMap("adUnitId" to adUnitId))
                rewardedAd = null
                currentRewardedAdUnitId = null
            }

            override fun onUserEarnedReward(rewardItem: PAGRewardItem) {
                Log.d("PangleModule", "보상 확인: ${rewardItem.rewardName}, ${rewardItem.rewardAmount}")
                sendEvent("onRewardedAdReward", createMap(
                    "adUnitId" to adUnitId,
                    "type" to rewardItem.rewardName,
                    "amount" to rewardItem.rewardAmount
                ))
            }

            override fun onUserEarnedRewardFail(errorCode: Int, errorMsg: String) {
                Log.e("PangleModule", "보상 확인 실패: $errorMsg (코드: $errorCode)")
            }
        })
    }

    private fun setAppOpenAdListener(ad: PAGAppOpenAd, adUnitId: String) {
        ad.setAdInteractionListener(object : PAGAppOpenAdInteractionListener {
            override fun onAdShowed() {
                Log.d("PangleModule", "앱 오프닝 광고 표시됨")
            }

            override fun onAdClicked() {
                Log.d("PangleModule", "앱 오프닝 광고 클릭됨")
            }

            override fun onAdDismissed() {
                Log.d("PangleModule", "앱 오프닝 광고 닫힘")
                sendEvent("onAppOpenAdClosed", createMap("adUnitId" to adUnitId))
                appOpenAd = null
                currentAppOpenAdUnitId = null
            }
        })
    }

    private fun getAppIdFromManifest(context: Context): String? {
        try {
            val appInfo = context.packageManager.getApplicationInfo(
                context.packageName,
                android.content.pm.PackageManager.GET_META_DATA
            )
            val metaData = appInfo.metaData
            if (metaData != null) {

                val appId = metaData.get("com.bytedance.sdk.openadsdk.APP_ID")
                return when (appId) {
                    is String -> appId
                    is Int -> appId.toString()
                    else -> null
                }
            }
            return null
        } catch (e: Exception) {
            Log.e("PangleModule", "App ID 가져오기 실패", e)
            return null
        }
    }

    private fun sendEvent(eventName: String, params: WritableMap) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    private fun createMap(vararg pairs: Pair<String, Any?>): WritableMap {
        val map = Arguments.createMap()
        pairs.forEach { (key, value) ->
            when (value) {
                is String -> map.putString(key, value)
                is Int -> map.putInt(key, value)
                is Double -> map.putDouble(key, value)
                is Boolean -> map.putBoolean(key, value)
                else -> map.putString(key, value?.toString())
            }
        }
        return map
    }
}
