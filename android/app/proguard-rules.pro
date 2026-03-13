# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Add any project specific keep options here:

# Pangle SDK
-keep class com.bytedance.sdk.** { *; }

# AppsFlyer SDK
-keep class com.appsflyer.** { *; }
-keep class kotlin.jvm.internal.** { *; }

# Tapjoy SDK (Unity Grow Offerwall)
-keep public class com.tapjoy.** { *; }
-keepclassmembers public enum com.tapjoy.** { *; }

# ayeT-Studios Offerwall SDK (Android SDK v2)
-keep class com.ayet.sdk.** { *; }
-keep public class com.ayet.sdk.AyetSdk { public *; }
