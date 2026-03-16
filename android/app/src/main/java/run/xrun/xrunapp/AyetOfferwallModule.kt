package run.xrun.xrunapp

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.ayet.sdk.AyetSdk

class AyetOfferwallModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AyetOfferwallModule"

    @ReactMethod
    fun setUserId(userId: String, promise: Promise) {
        try {
            val ctx = reactApplicationContext ?: run {
                promise.reject("NO_CONTEXT", "React context is null")
                return
            }
            val id = userId.trim().takeIf { it.isNotEmpty() }?.take(63) ?: "guest"
            AyetSdk.init(ctx, 21960, id)
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("SET_USER_ID_ERROR", e.message ?: "setUserId failed", e)
        }
    }

    @ReactMethod
    fun showOfferwall(adSlotName: String, promise: Promise) {
        val ctx = reactApplicationContext ?: run {
            promise.reject("NO_CONTEXT", "React context is null")
            return
        }
        try {
            AyetSdk.showOfferwall(ctx, adSlotName)
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("SHOW_OFFERWALL_ERROR", e.message ?: "showOfferwall failed", e)
        }
    }

    @ReactMethod
    fun getOffers(adSlotName: String, promise: Promise) {
        val ctx = reactApplicationContext ?: run {
            promise.resolve("[]")
            return
        }
        try {
            AyetSdk.getOffers(adSlotName) { offersJson ->
                promise.resolve(offersJson ?: "[]")
            }
        } catch (e: Exception) {
            promise.resolve("[]")
        }
    }
}
