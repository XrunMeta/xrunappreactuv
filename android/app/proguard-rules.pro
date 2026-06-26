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

# Pangle SDK (ByteDance / PAG API 전부 유지)
-keep class com.bytedance.sdk.** { *; }
-keep class com.pgl.** { *; }
-keep class com.bytedance.sdk.openadsdk.api.** { *; }
-keepattributes Signature, InnerClasses, EnclosingMethod, Annotation

# Pangle 네이티브 모듈 (AAB 릴리즈에서 R8 제거/난독화 방지)
-keep class run.xrun.xrunapp.PangleModule { *; }
-keep class run.xrun.xrunapp.PanglePackage { *; }
-keepclassmembers class run.xrun.xrunapp.PangleModule { *; }
-keepclassmembers class run.xrun.xrunapp.PanglePackage { *; }


# AppsFlyer SDK
-keep class com.appsflyer.** { *; }
-keep class kotlin.jvm.internal.** { *; }

# Tapjoy SDK (Unity Grow Offerwall)
-keep public class com.tapjoy.** { *; }
-keepclassmembers public enum com.tapjoy.** { *; }

# ayeT-Studios Offerwall SDK (Android SDK v2)
-keep class com.ayet.sdk.** { *; }
-keep public class com.ayet.sdk.AyetSdk { public *; }

# 🔥 [2026-06-26] 나스미디어 nap ssp SDK v2 (Rewarded video) — R8 stripping 방지
#   guide: Android SDK 시작하기 - Native > Step 3. Proguard 설정
-keep class com.nasmedia.admixerssp.** { *; }
-keep interface com.nasmedia.admixerssp.** { *; }
-dontwarn com.nasmedia.admixerssp.**

# 나스미디어 네이티브 모듈 (R8 stripping 방지)
-keep class run.xrun.xrunapp.NasmediaAdModule { *; }
-keep class run.xrun.xrunapp.NasmediaAdPackage { *; }
-keepclassmembers class run.xrun.xrunapp.NasmediaAdModule { *; }
-keepclassmembers class run.xrun.xrunapp.NasmediaAdPackage { *; }
