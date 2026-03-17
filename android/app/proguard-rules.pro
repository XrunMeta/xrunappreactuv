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

# ayeT SDK (Offerwall)
-keep class com.ayet.sdk.** { *; }

# Google Mobile Ads (AdMob) - AAB/릴리스에서 광고 미노출 방지
-keep class com.google.android.gms.ads.** { *; }
-dontwarn com.google.android.gms.ads.**

# Pangle (bytedance) 미디에이션 - AAB에서 팽글 광고 노출을 위해 유지
-keep class com.bytedance.sdk.openadsdk.** { *; }
-keep interface com.bytedance.sdk.openadsdk.** { *; }
-dontwarn com.bytedance.sdk.**

# Add any project specific keep options here:
