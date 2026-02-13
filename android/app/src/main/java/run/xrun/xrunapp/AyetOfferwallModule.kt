package run.xrun.xrunapp

import android.os.Handler
import android.os.Looper
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.ayet.sdk.AyetSdk

class AyetOfferwallModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AyetOfferwallModule"

    @ReactMethod
    fun showOfferwall(adSlotName: String, promise: Promise) {
        try {
            val activity = reactApplicationContext.currentActivity
            if (activity == null) {
                Log.e(TAG, "showOfferwall: no current activity")
                promise.reject("NO_ACTIVITY", "No current activity")
                return
            }
            Log.d(TAG, "showOfferwall called, adSlotName=$adSlotName")
            Handler(Looper.getMainLooper()).post {
                try {
                    AyetSdk.showOfferwall(activity, adSlotName)
                    promise.resolve(null)
                } catch (e: Exception) {
                    Log.e(TAG, "showOfferwall failed: ${e.message}", e)
                    promise.reject("SHOW_OFFERWALL_ERROR", e.message ?: "오퍼월을 열 수 없습니다.")
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "showOfferwall failed: ${e.message}", e)
            promise.reject("SHOW_OFFERWALL_ERROR", e.message ?: "오퍼월을 열 수 없습니다.")
        }
    }

    @ReactMethod
    fun getOffers(adSlotName: String, promise: Promise) {
        try {
            Log.d(TAG, "getOffers called, adSlotName=$adSlotName")
            AyetSdk.getOffers(adSlotName) { offersJson ->
                Handler(Looper.getMainLooper()).post {
                    if (offersJson != null && offersJson.isNotEmpty()) {
                        Log.d(TAG, "getOffers success, length=${offersJson.length}")
                        promise.resolve(offersJson)
                    } else {

                        Log.e(TAG, "[AYET_EMPTY_OFFERS] SDK returned null or empty. adSlot=$adSlotName. Check dashboard: Placement status, AdSlot name, Configure Offers, package run.xrun.xrunapp")
                        promise.resolve("[]")
                    }
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "[AYET_OFFERS_ERROR] getOffers failed: ${e.message}", e)
            promise.reject("AYET_OFFERS_ERROR", e.message ?: "오퍼를 불러오는 중 오류가 발생했습니다.")
        }
    }

    companion object {
        private const val TAG = "AyetOfferwallModule"
    }
}
