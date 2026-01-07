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

        let relatedView = PAGLNativeAdRelatedView()
        relatedView.refresh(with: ad)

        let adVC = UIViewController()
        adVC.view.backgroundColor = .black 

        let mainView = UIView()
        mainView.backgroundColor = .systemBackground
        mainView.translatesAutoresizingMaskIntoConstraints = false
        adVC.view.addSubview(mainView)

        let mediaView = relatedView.mediaView
        mediaView.translatesAutoresizingMaskIntoConstraints = false
        mainView.addSubview(mediaView)

        let adChoicesView = relatedView.adChoicesView
        adChoicesView.translatesAutoresizingMaskIntoConstraints = false
        mainView.addSubview(adChoicesView)

        let logoView = relatedView.logoADImageView
        logoView.translatesAutoresizingMaskIntoConstraints = false
        mainView.addSubview(logoView)

        let infoContainer = UIView()
        infoContainer.translatesAutoresizingMaskIntoConstraints = false
        mainView.addSubview(infoContainer)

        let titleLabel = UILabel()
        titleLabel.text = ad.data.adTitle
        titleLabel.font = .systemFont(ofSize: 22, weight: .bold)
        titleLabel.numberOfLines = 2
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        infoContainer.addSubview(titleLabel)

        let descLabel = UILabel()
        descLabel.text = ad.data.adDescription
        descLabel.font = .systemFont(ofSize: 16)
        descLabel.textColor = .secondaryLabel
        descLabel.numberOfLines = 0
        descLabel.translatesAutoresizingMaskIntoConstraints = false
        infoContainer.addSubview(descLabel)

        let actionButton = UIButton(type: .system)
        actionButton.setTitle(ad.data.buttonText ?? "자세히 보기", for: .normal)
        actionButton.titleLabel?.font = .systemFont(ofSize: 18, weight: .bold)
        actionButton.backgroundColor = .systemBlue
        actionButton.setTitleColor(.white, for: .normal)
        actionButton.layer.cornerRadius = 12
        actionButton.translatesAutoresizingMaskIntoConstraints = false
        infoContainer.addSubview(actionButton)

        let closeButton = UIButton(type: .system)
        let closeConfig = UIImage.SymbolConfiguration(pointSize: 24, weight: .bold)
        let closeImage = UIImage(systemName: "xmark.circle.fill", withConfiguration: closeConfig)
        closeButton.setImage(closeImage, for: .normal)
        closeButton.tintColor = .white
        closeButton.translatesAutoresizingMaskIntoConstraints = false
        closeButton.addAction(UIAction { _ in
          adVC.dismiss(animated: true)
        }, for: .touchUpInside)
        adVC.view.addSubview(closeButton)

        NSLayoutConstraint.activate([

          mainView.topAnchor.constraint(equalTo: adVC.view.topAnchor),
          mainView.leadingAnchor.constraint(equalTo: adVC.view.leadingAnchor),
          mainView.trailingAnchor.constraint(equalTo: adVC.view.trailingAnchor),
          mainView.bottomAnchor.constraint(equalTo: adVC.view.bottomAnchor),

          mediaView.topAnchor.constraint(equalTo: mainView.topAnchor),
          mediaView.leadingAnchor.constraint(equalTo: mainView.leadingAnchor),
          mediaView.trailingAnchor.constraint(equalTo: mainView.trailingAnchor),
          mediaView.heightAnchor.constraint(equalTo: mainView.heightAnchor, multiplier: 0.5),

          adChoicesView.trailingAnchor.constraint(equalTo: mediaView.trailingAnchor, constant: -5),
          adChoicesView.topAnchor.constraint(equalTo: mediaView.topAnchor, constant: 5),
          adChoicesView.widthAnchor.constraint(equalToConstant: 20),
          adChoicesView.heightAnchor.constraint(equalToConstant: 20),

          infoContainer.topAnchor.constraint(equalTo: mediaView.bottomAnchor),
          infoContainer.leadingAnchor.constraint(equalTo: mainView.leadingAnchor, constant: 20),
          infoContainer.trailingAnchor.constraint(equalTo: mainView.trailingAnchor, constant: -20),
          infoContainer.bottomAnchor.constraint(equalTo: mainView.bottomAnchor, constant: -40),

          titleLabel.topAnchor.constraint(equalTo: infoContainer.topAnchor, constant: 25),
          titleLabel.leadingAnchor.constraint(equalTo: infoContainer.leadingAnchor),
          titleLabel.trailingAnchor.constraint(equalTo: infoContainer.trailingAnchor),

          descLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 12),
          descLabel.leadingAnchor.constraint(equalTo: infoContainer.leadingAnchor),
          descLabel.trailingAnchor.constraint(equalTo: infoContainer.trailingAnchor),

          actionButton.bottomAnchor.constraint(equalTo: infoContainer.bottomAnchor),
          actionButton.leadingAnchor.constraint(equalTo: infoContainer.leadingAnchor),
          actionButton.trailingAnchor.constraint(equalTo: infoContainer.trailingAnchor),
          actionButton.heightAnchor.constraint(equalToConstant: 56),

          closeButton.topAnchor.constraint(equalTo: adVC.view.safeAreaLayoutGuide.topAnchor, constant: 10),
          closeButton.trailingAnchor.constraint(equalTo: adVC.view.trailingAnchor, constant: -15)
        ])

        ad.rootViewController = adVC

        ad.registerContainer(mainView, withClickableViews: [actionButton, mediaView, titleLabel])

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
