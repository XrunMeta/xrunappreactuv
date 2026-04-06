package run.xrun.xrunapp

import android.content.Context
import android.util.Log
import com.facebook.react.bridge.*
import com.ayet.sdk.AyetSdk

class AyetOfferwallModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var isInitialized = false
    private var cachedPlacementId: Int = 0

    override fun getName(): String = "AyetOfferwallModule"

    @ReactMethod
    fun initialize(placementId: Int, externalIdentifier: String, promise: Promise) {
        try {
            val context: Context = reactApplicationContext.applicationContext
            AyetSdk.init(context, placementId, externalIdentifier)
            cachedPlacementId = placementId
            isInitialized = true
            Log.d("AyetOfferwall", "ayeT SDK 초기화 완료: placementId=$placementId, userId=$externalIdentifier")
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e("AyetOfferwall", "ayeT SDK 초기화 실패", e)
            promise.reject("INIT_ERROR", e.message ?: "Unknown error")
        }
    }

    @ReactMethod
    fun setUserId(userId: String) {
        try {
            if (!isInitialized || cachedPlacementId == 0) {
                Log.w("AyetOfferwall", "setUserId skipped: SDK not initialized")
                return
            }
            val context: Context = reactApplicationContext.applicationContext
            val id = if (userId.isNotBlank()) userId else "guest"
            AyetSdk.init(context, cachedPlacementId, id)
            Log.d("AyetOfferwall", "setUserId (re-init): $id")
        } catch (e: Exception) {
            Log.e("AyetOfferwall", "setUserId 실패", e)
        }
    }

    @ReactMethod
    fun showOfferwall(adSlotName: String, promise: Promise) {
        try {
            val activity = reactApplicationContext.currentActivity
            if (activity == null) {
                promise.reject("NO_ACTIVITY", "Activity를 찾을 수 없습니다.")
                return
            }
            Log.d("AyetOfferwall", "오퍼월 표시: adSlotName=$adSlotName")
            AyetSdk.showOfferwall(activity as Context, adSlotName)
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e("AyetOfferwall", "오퍼월 표시 실패", e)
            promise.reject("SHOW_ERROR", e.message ?: "Unknown error")
        }
    }

    @ReactMethod
    fun getOffers(adSlotName: String, promise: Promise) {
        try {
            AyetSdk.getOffers(adSlotName) { json ->
                if (json != null) {
                    promise.resolve(json)
                } else {
                    promise.resolve("[]")
                }
            }
        } catch (e: Exception) {
            Log.e("AyetOfferwall", "getOffers ��패", e)
            promise.reject("OFFERS_ERROR", e.message ?: "Unknown error")
        }
    }
}
