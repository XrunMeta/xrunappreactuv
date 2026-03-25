import Expo
import React
import ReactAppDependencyProvider
import PAGAdSDK
import AyetSDK

#if canImport(GoogleMaps)
import GoogleMaps
#endif

@UIApplicationMain
public class AppDelegate: ExpoAppDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ExpoReactNativeFactoryDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  private func setupPangleSDK() {
    let config = PAGConfig.share()
    config.appID = "8747761"
    config.debugLog = true
    print("[Pangle] SDK 초기화 시도 - AppID: \(config.appID ?? "nil"), SDKVersion: \(PAGSdk.sdkVersion)")
    PAGSdk.start(with: config) { success, error in
      if success {
        print("Pangle SDK initialized successfully")
      } else {
        print("Pangle SDK initialization failed: \(error?.localizedDescription ?? "unknown error")")
      }
    }
  }

  public override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {

    setupPangleSDK()

    AyetSDK.shared.initialize(placementId: 22062, externalIdentifier: "guest")

    let delegate = ReactNativeDelegate()
    let factory = ExpoReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory
    bindReactNativeFactory(factory)

#if os(iOS) || os(tvOS)
    window = UIWindow(frame: UIScreen.main.bounds)
    factory.startReactNative(
      withModuleName: "main",
      in: window,
      launchOptions: launchOptions)
#endif

#if canImport(GoogleMaps)
GMSServices.provideAPIKey("oth-google-api-key")
#endif

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  public override func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    AppsFlyerAttribution.shared().handleOpen(url, options: options)
    return super.application(app, open: url, options: options) || RCTLinkingManager.application(app, open: url, options: options)
  }

  public override func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
  ) -> Bool {
    AppsFlyerAttribution.shared().continue(userActivity, restorationHandler: nil)
    let result = RCTLinkingManager.application(application, continue: userActivity, restorationHandler: restorationHandler)
    return super.application(application, continue: userActivity, restorationHandler: restorationHandler) || result
  }
}

class ReactNativeDelegate: ExpoReactNativeFactoryDelegate {

  override func sourceURL(for bridge: RCTBridge) -> URL? {

    bridge.bundleURL ?? bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: ".expo/.virtual-metro-entry")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
