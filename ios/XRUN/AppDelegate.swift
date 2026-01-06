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
        if nsError.code == 40034 {
            print("  - 도움말: Bidding 전용 SlotID를 Waterfall 방식으로 로드했습니다. 테스트용 ID를 확인하세요.")
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

  @objc public func loadAndShowNativeAd(slotId: String) {
    print("[AppDelegate] 네이티브 광고 로드 시작 (SlotID: \(slotId))")
    let request = PAGNativeRequest()

    PAGLNativeAd.load(withSlotID: slotId, request: request) { [weak self] ad, error in
      if let error = error {
        print("[AppDelegate] ❌ 네이티브 광고 로드 실패: \(error.localizedDescription)")
        return
      }

      DispatchQueue.main.async {
        guard let ad = ad else { return }
        guard let visibleVC = self?.findVisibleViewController() else {
          print("[AppDelegate] 광고를 표시할 수 있는 View Controller를 찾을 수 없습니다.")
          return
        }

        print("[AppDelegate] 네이티브 광고 노출 시도 - Title: \(ad.data.adTitle)")

        let adVC = UIViewController()
        adVC.view.backgroundColor = .systemBackground

        let container = UIView()
        container.translatesAutoresizingMaskIntoConstraints = false
        adVC.view.addSubview(container)

        let titleLabel = UILabel()
        titleLabel.text = ad.data.adTitle
        titleLabel.font = .systemFont(ofSize: 20, weight: .bold)
        titleLabel.numberOfLines = 0
        titleLabel.textAlignment = .center
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        container.addSubview(titleLabel)

        let descLabel = UILabel()
        descLabel.text = ad.data.adDescription
        descLabel.font = .systemFont(ofSize: 16)
        descLabel.textColor = .secondaryLabel
        descLabel.numberOfLines = 0
        descLabel.textAlignment = .center
        descLabel.translatesAutoresizingMaskIntoConstraints = false
        container.addSubview(descLabel)

        let actionButton = UIButton(type: .system)
        actionButton.setTitle(ad.data.buttonText ?? "자세히 보기", for: .normal)
        actionButton.titleLabel?.font = .systemFont(ofSize: 18, weight: .semibold)
        actionButton.backgroundColor = .systemBlue
        actionButton.setTitleColor(.white, for: .normal)
        actionButton.layer.cornerRadius = 10
        actionButton.translatesAutoresizingMaskIntoConstraints = false
        container.addSubview(actionButton)

        let closeButton = UIButton(type: .system)
        closeButton.setTitle("광고 닫기", for: .normal)
        closeButton.translatesAutoresizingMaskIntoConstraints = false
        closeButton.addAction(UIAction { _ in
          adVC.dismiss(animated: true)
        }, for: .touchUpInside)
        adVC.view.addSubview(closeButton)

        NSLayoutConstraint.activate([
          container.centerXAnchor.constraint(equalTo: adVC.view.centerXAnchor),
          container.centerYAnchor.constraint(equalTo: adVC.view.centerYAnchor),
          container.leadingAnchor.constraint(equalTo: adVC.view.leadingAnchor, constant: 20),
          container.trailingAnchor.constraint(equalTo: adVC.view.trailingAnchor, constant: -20),

          titleLabel.topAnchor.constraint(equalTo: container.topAnchor),
          titleLabel.leadingAnchor.constraint(equalTo: container.leadingAnchor),
          titleLabel.trailingAnchor.constraint(equalTo: container.trailingAnchor),

          descLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 10),
          descLabel.leadingAnchor.constraint(equalTo: container.leadingAnchor),
          descLabel.trailingAnchor.constraint(equalTo: container.trailingAnchor),

          actionButton.topAnchor.constraint(equalTo: descLabel.bottomAnchor, constant: 30),
          actionButton.centerXAnchor.constraint(equalTo: container.centerXAnchor),
          actionButton.widthAnchor.constraint(equalToConstant: 200),
          actionButton.heightAnchor.constraint(equalToConstant: 50),
          actionButton.bottomAnchor.constraint(equalTo: container.bottomAnchor),

          closeButton.topAnchor.constraint(equalTo: adVC.view.safeAreaLayoutGuide.topAnchor, constant: 20),
          closeButton.trailingAnchor.constraint(equalTo: adVC.view.trailingAnchor, constant: -20)
        ])

        ad.rootViewController = adVC
        ad.registerContainer(container, withClickableViews: [actionButton, titleLabel])

        adVC.modalPresentationStyle = .fullScreen
        visibleVC.present(adVC, animated: true)
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
