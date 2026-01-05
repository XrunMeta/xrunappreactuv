import Expo
import React
import ReactAppDependencyProvider
import PAGAdSDK

#if canImport(GoogleMaps)
import GoogleMaps
#endif

@UIApplicationMain
public class AppDelegate: ExpoAppDelegate {
  private var currentInterstitialAd: PAGLInterstitialAd?
  var window: UIWindow?

  var reactNativeDelegate: ExpoReactNativeFactoryDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  public override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {

    setupPangleSDK()

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

  @objc public func loadAndShowInterstitialAd(slotId: String) {
    print("[AppDelegate] 전면 광고 로드 시작 (SlotID: \(slotId))")
    let request = PAGInterstitialRequest()
    PAGLInterstitialAd.load(withSlotID: slotId, request: request) { [weak self] ad, error in
      if let error = error {
        let nsError = error as NSError
        print("[AppDelegate] ❌ 전면 광고 로드 실패")
        print("  - SlotID: \(slotId)")
        print("  - Error: \(nsError.localizedDescription)")
        print("  - Code: \(nsError.code)")
        print("  - UserInfo: \(nsError.userInfo)")
        if nsError.code == 40001 {
            print("  - 도움말: SlotID가 유효하지 않거나 AppID와 매칭되지 않습니다.")
        } else if nsError.code == 40034 {
            print("  - 도움말: Bidding 전용 SlotID를 Waterfall 방식으로 로드했습니다. 980088188로 테스트하세요.")
        } else if nsError.code == 40029 || nsError.localizedDescription.contains("internal service error") {
            print("  - 도움말: 서버 내부 오류입니다. 번들 ID(\(Bundle.main.bundleIdentifier ?? ""))가 Pangle에 등록된 것과 일치하는지 확인하세요.")
        } else if nsError.code == 20001 {
            print("  - 도움말: 네트워크 연결 상태를 확인하세요.")
        }
        return
      }

      DispatchQueue.main.async {
        self?.currentInterstitialAd = ad

        guard let visibleVC = self?.findVisibleViewController() else {
          print("[AppDelegate] 광고를 표시할 수 있는 View Controller를 찾을 수 없습니다.")
          return
        }

        print("[AppDelegate] 전면 광고 노출 시도 (VisibleVC: \(type(of: visibleVC)))")
        ad?.delegate = self
        ad?.present(fromRootViewController: visibleVC)
      }
    }
  }

  public override func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    return super.application(app, open: url, options: options) || RCTLinkingManager.application(app, open: url, options: options)
  }

  public override func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
  ) -> Bool {
    let result = RCTLinkingManager.application(application, continue: userActivity, restorationHandler: restorationHandler)
    return super.application(application, continue: userActivity, restorationHandler: restorationHandler) || result
  }

  private func findVisibleViewController() -> UIViewController? {
    var topController = window?.rootViewController
    while let presentedController = topController?.presentedViewController {
        topController = presentedController
    }
    return topController
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

extension AppDelegate: PAGLInterstitialAdDelegate {
  public func adDidShow(_ ad: PAGAdProtocol) {
    print("[AppDelegate] 광고 노출 완료")
  }

  public func adDidClick(_ ad: PAGAdProtocol) {
    print("[AppDelegate] 광고 클릭됨")
  }

  public func adDidDismiss(_ ad: PAGAdProtocol) {
    self.currentInterstitialAd = nil
    print("[AppDelegate] 광고 닫힘")
  }
}
