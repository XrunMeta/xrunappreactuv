import Foundation
import React
import UIKit
import PAGAdSDK

@objc(PangleModule)
class PangleModule: RCTEventEmitter {

  private var interstitialAd: PAGLInterstitialAd?
  private var lastSlotId: String = "No ad loaded yet"

  override init() {
    super.init()
  }

  @objc
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }

  override func supportedEvents() -> [String]! {
    return ["onAdEvent"]
  }

  @objc
  func showNativeScreen(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      guard let rootViewController = self.getRootViewController() else {
        rejecter("ERROR", "Root view controller not found", nil)
        return
      }

      let nativeVC = UIViewController()
      nativeVC.view.backgroundColor = UIColor.systemBackground

      let container = UIView()
      container.translatesAutoresizingMaskIntoConstraints = false
      nativeVC.view.addSubview(container)

      let titleLabel = UILabel()
      titleLabel.text = "XRUN Native Test"
      titleLabel.font = UIFont.systemFont(ofSize: 24, weight: .bold)
      titleLabel.textAlignment = .center
      titleLabel.translatesAutoresizingMaskIntoConstraints = false
      container.addSubview(titleLabel)

      let versionLabel = UILabel()
      let sdkVersion = PAGSdk.sdkVersion
      versionLabel.text = "Pangle SDK Version: \(sdkVersion)"
      versionLabel.font = UIFont.systemFont(ofSize: 14)
      versionLabel.textColor = .systemBlue
      versionLabel.textAlignment = .center
      versionLabel.translatesAutoresizingMaskIntoConstraints = false
      container.addSubview(versionLabel)

      let slotLabel = UILabel()
      slotLabel.text = "Last Slot ID: \(self.lastSlotId)"
      slotLabel.font = UIFont.systemFont(ofSize: 13, weight: .medium)
      slotLabel.textColor = .systemOrange
      slotLabel.textAlignment = .center
      slotLabel.numberOfLines = 0
      slotLabel.translatesAutoresizingMaskIntoConstraints = false
      container.addSubview(slotLabel)

      let descLabel = UILabel()
      descLabel.text = "네이티브 연동 및 광고 설정 확인을 위한 화면입니다."
      descLabel.font = UIFont.systemFont(ofSize: 14)
      descLabel.textColor = .secondaryLabel
      descLabel.textAlignment = .center
      descLabel.numberOfLines = 0
      descLabel.translatesAutoresizingMaskIntoConstraints = false
      container.addSubview(descLabel)

      let adButton = UIButton(type: .system)
      adButton.setTitle("전면 광고 테스트 (Native)", for: .normal)
      adButton.titleLabel?.font = UIFont.systemFont(ofSize: 18, weight: .bold)
      adButton.setTitleColor(.white, for: .normal)
      adButton.backgroundColor = UIColor.systemOrange
      adButton.layer.cornerRadius = 12
      adButton.translatesAutoresizingMaskIntoConstraints = false
      adButton.addAction(UIAction { _ in
        if let appDelegate = UIApplication.shared.delegate as? AppDelegate {
          appDelegate.loadAndShowInterstitialAd(slotId: "982684319")
        }
      }, for: .touchUpInside)
      container.addSubview(adButton)

      let closeButton = UIButton(type: .system)
      closeButton.setTitle("React Native로 돌아가기", for: .normal)
      closeButton.titleLabel?.font = UIFont.systemFont(ofSize: 18, weight: .bold)
      closeButton.setTitleColor(.white, for: .normal)
      closeButton.backgroundColor = UIColor.systemBlue
      closeButton.layer.cornerRadius = 12
      closeButton.translatesAutoresizingMaskIntoConstraints = false
      closeButton.addAction(UIAction { _ in
        nativeVC.dismiss(animated: true, completion: nil)
      }, for: .touchUpInside)
      container.addSubview(closeButton)

      NSLayoutConstraint.activate([
        container.centerXAnchor.constraint(equalTo: nativeVC.view.centerXAnchor),
        container.centerYAnchor.constraint(equalTo: nativeVC.view.centerYAnchor),
        container.leadingAnchor.constraint(equalTo: nativeVC.view.leadingAnchor, constant: 20),
        container.trailingAnchor.constraint(equalTo: nativeVC.view.trailingAnchor, constant: -20),

        titleLabel.topAnchor.constraint(equalTo: container.topAnchor),
        titleLabel.leadingAnchor.constraint(equalTo: container.leadingAnchor),
        titleLabel.trailingAnchor.constraint(equalTo: container.trailingAnchor),

        versionLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 10),
        versionLabel.leadingAnchor.constraint(equalTo: container.leadingAnchor),
        versionLabel.trailingAnchor.constraint(equalTo: container.trailingAnchor),

        slotLabel.topAnchor.constraint(equalTo: versionLabel.bottomAnchor, constant: 10),
        slotLabel.leadingAnchor.constraint(equalTo: container.leadingAnchor),
        slotLabel.trailingAnchor.constraint(equalTo: container.trailingAnchor),

        descLabel.topAnchor.constraint(equalTo: slotLabel.bottomAnchor, constant: 15),
        descLabel.leadingAnchor.constraint(equalTo: container.leadingAnchor),
        descLabel.trailingAnchor.constraint(equalTo: container.trailingAnchor),

        adButton.topAnchor.constraint(equalTo: descLabel.bottomAnchor, constant: 30),
        adButton.centerXAnchor.constraint(equalTo: container.centerXAnchor),
        adButton.widthAnchor.constraint(equalToConstant: 240),
        adButton.heightAnchor.constraint(equalToConstant: 56),

        closeButton.topAnchor.constraint(equalTo: adButton.bottomAnchor, constant: 15),
        closeButton.centerXAnchor.constraint(equalTo: container.centerXAnchor),
        closeButton.widthAnchor.constraint(equalToConstant: 240),
        closeButton.heightAnchor.constraint(equalToConstant: 56),
        closeButton.bottomAnchor.constraint(equalTo: container.bottomAnchor)
      ])

      nativeVC.modalPresentationStyle = .fullScreen
      rootViewController.present(nativeVC, animated: true) {
        resolver(["success": true, "message": "Native screen displayed"])
      }
    }
  }

  @objc
  func loadInterstitialAd(_ slotId: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    self.lastSlotId = slotId
    let request = PAGInterstitialRequest()
    PAGLInterstitialAd.load(withSlotID: slotId, request: request) { [weak self] ad, error in
      if let error = error {
        print("[Native] Interstitial Ad Load Error (SlotID: \(slotId)): \(error.localizedDescription)")
        rejecter("AD_LOAD_FAILED", error.localizedDescription, nil)
        return
      }
      self?.interstitialAd = ad
      print("[Native] Interstitial Ad Loaded Successfully (SlotID: \(slotId))")
      resolver(["success": true, "message": "Interstitial Ad loaded successfully", "slotId": slotId])
    }
  }

  @objc
  func showInterstitialAd(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      guard let ad = self.interstitialAd else {
        rejecter("AD_NOT_READY", "Ad is not loaded yet", nil)
        return
      }

      guard let rootViewController = self.getRootViewController() else {
        rejecter("ERROR", "Root view controller not found", nil)
        return
      }

      print("[Native] Showing Interstitial Ad for SlotID: \(self.lastSlotId)")
      ad.present(fromRootViewController: rootViewController)
      resolver(["success": true])
      self.interstitialAd = nil 
    }
  }

  @objc
  func loadAndShowInterstitialAd(_ slotId: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      if let appDelegate = UIApplication.shared.delegate as? AppDelegate {
        appDelegate.loadAndShowInterstitialAd(slotId: slotId)
        resolver(["success": true, "message": "Ad loading and display requested via AppDelegate"])
      } else {

        self.loadInterstitialAd(slotId, resolver: { _ in
          self.showInterstitialAd(resolver, rejecter: rejecter)
        }, rejecter: rejecter)
      }
    }
  }

  @objc
  func loadAndShowNativeAd(_ slotId: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      if let appDelegate = UIApplication.shared.delegate as? AppDelegate {
        appDelegate.loadAndShowNativeAd(slotId: slotId)
        resolver(["success": true, "message": "Native Ad loading and display requested via AppDelegate"])
      } else {
        rejecter("ERROR", "AppDelegate not found", nil)
      }
    }
  }

  private func getRootViewController() -> UIViewController? {
    if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
       let window = windowScene.windows.first {
      return window.rootViewController
    }
    return UIApplication.shared.windows.first?.rootViewController
  }
}
