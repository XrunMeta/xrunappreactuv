package run.xrun.xrunapp

import android.util.Log
import co.adison.offerwall.Adison
import co.adison.offerwall.AdisonConfig
import co.adison.offerwall.AdisonListType
import co.adison.offerwall.AdisonThemeMode
import co.adison.offerwall.Gender
import co.adison.offerwall.Server
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class AdisonModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var isInitialized = false

    override fun getName(): String = "AdisonModule"

    @ReactMethod
    fun initialize(appKey: String, server: String, promise: Promise) {
        try {
            if (isInitialized) {
                promise.resolve(true)
                return
            }
            val context = reactApplicationContext.applicationContext
            Adison.initialize(context, appKey)
            Adison.setServer(
                if (server.equals("development", ignoreCase = true)) Server.DEVELOPMENT
                else Server.PRODUCTION
            )
            isInitialized = true
            Log.d("AdisonModule", "initialize ok: server=$server")
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e("AdisonModule", "initialize failed", e)
            promise.reject("INIT_ERROR", e.message ?: "Unknown error")
        }
    }

    @ReactMethod
    fun setConfig(
        offerwallTitle: String,
        listType: String, 
        themeMode: String 
    ) {
        try {
            val config = AdisonConfig().apply {
                this.offerwallListTitle = offerwallTitle
                this.listType = if (listType.equals("FEED", ignoreCase = true))
                    AdisonListType.FEED else AdisonListType.LIST
                this.prepareViewHidden = true
                this.themeMode = when (themeMode) {
                    "Dark" -> AdisonThemeMode.Dark
                    "System" -> AdisonThemeMode.System
                    else -> AdisonThemeMode.Light
                }
            }
            Adison.setConfig(config)
            Log.d("AdisonModule", "setConfig ok")
        } catch (e: Exception) {
            Log.e("AdisonModule", "setConfig failed", e)
        }
    }

    @ReactMethod
    fun setUid(uid: String) {
        try {
            Adison.setUid(uid)
            Log.d("AdisonModule", "setUid ok")
        } catch (e: Exception) {
            Log.e("AdisonModule", "setUid failed", e)
        }
    }

    @ReactMethod
    fun unsetUid() {
        try {
            Adison.setUid(null)
            Log.d("AdisonModule", "unsetUid ok")
        } catch (e: Exception) {
            Log.e("AdisonModule", "unsetUid failed", e)
        }
    }

    @ReactMethod
    fun setTargeting(birthYear: Int, gender: String?) {
        try {
            if (birthYear > 0) {
                Adison.setBirthYear(birthYear)
            }
            when (gender?.uppercase()) {
                "M" -> Adison.setGender(Gender.MALE)
                "F" -> Adison.setGender(Gender.FEMALE)
                else -> Adison.setGender(Gender.UNKNOWN)
            }
        } catch (e: Exception) {
            Log.w("AdisonModule", "setTargeting failed: ${e.message}")
        }
    }

    @ReactMethod
    fun availableReward(promise: Promise) {
        try {
            Adison.availableReward { name, unit, points ->
                val result = com.facebook.react.bridge.Arguments.createMap().apply {
                    putString("name", name)
                    putString("unit", unit)
                    putInt("points", points)
                }
                promise.resolve(result)
            }
        } catch (e: Exception) {
            Log.e("AdisonModule", "availableReward failed", e)
            promise.reject("REWARD_ERROR", e.message ?: "Unknown error")
        }
    }

    @ReactMethod
    fun showOfferwall(promise: Promise) {
        try {
            if (!isInitialized) {
                promise.reject("NOT_INITIALIZED", "Adison SDK not initialized")
                return
            }
            Adison.showOfferwall()
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e("AdisonModule", "showOfferwall failed", e)
            promise.reject("SHOW_ERROR", e.message ?: "Unknown error")
        }
    }

    @ReactMethod
    fun showOfferwallAd(adId: Int, keepParent: Boolean, promise: Promise) {
        try {
            if (!isInitialized) {
                promise.reject("NOT_INITIALIZED", "Adison SDK not initialized")
                return
            }
            Adison.showOfferwall(adId, keepParent)
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e("AdisonModule", "showOfferwallAd failed", e)
            promise.reject("SHOW_ERROR", e.message ?: "Unknown error")
        }
    }
}
