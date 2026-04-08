import Foundation
import React
import UIKit
import PAGAdSDK

@objc(PangleModule)
class PangleModule: RCTEventEmitter {

  private var isInitialized = false
  private var rewardedAd: PAGRewardedAd?
  private var appOpenAd: PAGAppOpenAd?
  private var hasListeners = false

  @objc
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }

  override func supportedEvents() -> [String]! {
    return [
      "onAppOpenAdLoaded",
      "onAppOpenAdError",
      "onAppOpenAdLoadError",
      "onAppOpenAdClose",
      "onAppOpenAdClosed",
      "onRewardedAdLoaded",
      "onRewardedAdReward",
      "onRewardedAdClose",
      "onRewardedAdLoadError",
    ]
  }

  override func startObserving() {
    hasListeners = true
  }

  override func stopObserving() {
    hasListeners = false
  }

  private func sendAppEvent(_ name: String, body: [String: Any]?) {
    if hasListeners {
      sendEvent(withName: name, body: body)
    }
  }

  @objc
  func initialize(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    if isInitialized {
      resolve(true)
      return
    }
    DispatchQueue.main.async {
      guard let appId = Bundle.main.object(forInfoDictionaryKey: "PAGAppId") as? String else {
        reject("INIT_ERROR", "PAGAppId not found in Info.plist", nil)
        return
      }
      let config = PAGConfig.share()
      config.appID = appId
      PAGSdk.start(with: config) { success, error in
        if success {
          self.isInitialized = true
          resolve(true)
        } else {
          reject("INIT_ERROR", error?.localizedDescription ?? "Unknown error", error)
        }
      }
    }
  }

  @objc
  func isReady(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    resolve(isInitialized)
  }

  @objc
  func getSDKVersion(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    resolve(PAGSdk.sdkVersion)
  }

  @objc
  func loadRewardedAd(_ adUnitId: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard isInitialized else {
      reject("NOT_INITIALIZED", "Pangle SDK not initialized", nil)
      return
    }
    DispatchQueue.main.async {
      let request = PAGRewardedRequest()
      PAGRewardedAd.load(withSlotID: adUnitId, request: request) { ad, error in
        if let error = error {
          self.sendEvent(withName: "onRewardedAdLoadError", body: [
            "errorMsg": error.localizedDescription
          ])
          reject("LOAD_ERROR", error.localizedDescription, error)
          return
        }
        guard let ad = ad else {
          let msg = "Rewarded ad object is nil"
          self.sendEvent(withName: "onRewardedAdLoadError", body: ["errorMsg": msg])
          reject("LOAD_ERROR", msg, nil)
          return
        }
        ad.delegate = self        
        self.rewardedAd = ad
        self.sendEvent(withName: "onRewardedAdLoaded", body: ["adUnitId": adUnitId])
        resolve(true)
      }
    }
  }

  @objc
  func showRewardedAd(_ adUnitId: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let ad = rewardedAd else {
      reject("AD_NOT_LOADED", "Ad not loaded", nil)
      return
    }
    DispatchQueue.main.async {
      guard let rootVC = UIApplication.shared.keyWindow?.rootViewController else {
        reject("NO_ACTIVITY", "No root view controller", nil)
        return
      }
      ad.present(fromRootViewController: rootVC)
      resolve(true)
    }
  }

  @objc
  func loadAndShowAppOpenAd(_ adUnitId: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard isInitialized else {
      reject("NOT_INITIALIZED", "Pangle SDK not initialized", nil)
      return
    }
    DispatchQueue.main.async {
      let request = PAGAppOpenRequest()
      request.timeout = 3.0
      PAGAppOpenAd.load(withSlotID: adUnitId, request: request) { [weak self] ad, error in
        guard let self = self else { return }
        if let error = error {
          self.sendAppEvent("onAppOpenAdLoadError", body: ["adUnitId": adUnitId, "errorMsg": error.localizedDescription])
          reject("LOAD_ERROR", error.localizedDescription, error)
          return
        }
        guard let ad = ad else {
          self.sendAppEvent("onAppOpenAdLoadError", body: ["adUnitId": adUnitId, "errorMsg": "Ad object is nil"])
          reject("LOAD_ERROR", "Ad object is nil", nil)
          return
        }
        self.appOpenAd = ad
        self.sendAppEvent("onAppOpenAdLoaded", body: ["adUnitId": adUnitId])
        ad.delegate = self
        guard let rootVC = UIApplication.shared.keyWindow?.rootViewController else {
          reject("NO_ACTIVITY", "No root view controller", nil)
          return
        }
        ad.present(fromRootViewController: rootVC)
        resolve(true)
      }
    }
  }
}

extension PangleModule: PAGAppOpenAdDelegate {
  func adDidShow(_ ad: PAGAppOpenAd) {}
  func adDidClick(_ ad: PAGAppOpenAd) {}
  func adDidDismiss(_ ad: PAGAppOpenAd) {
    sendAppEvent("onAppOpenAdClose", body: nil)
    sendAppEvent("onAppOpenAdClosed", body: nil)
    appOpenAd = nil
  }
}

extension PangleModule: PAGRewardedAdDelegate {
  func adDidShow(_ ad: PAGRewardedAd) {}

  func adDidClick(_ ad: PAGRewardedAd) {}

  func adDidDismiss(_ ad: PAGRewardedAd) {
    sendEvent(withName: "onRewardedAdClose", body: nil)
    if rewardedAd === ad {
      rewardedAd = nil
    }
  }

  func rewardedAd(_ rewardedAd: PAGRewardedAd, userDidEarnReward rewardModel: PAGRewardModel) {
    let rewardType = rewardModel.rewardName ?? "reward"
    let rewardAmount = rewardModel.rewardAmount
    sendEvent(withName: "onRewardedAdReward", body: [
      "rewardType": rewardType,
      "rewardAmount": rewardAmount
    ])
  }

  func rewardedAd(_ rewardedAd: PAGRewardedAd, userEarnRewardFailWithError error: Error) {
    sendEvent(withName: "onRewardedAdLoadError", body: [
      "errorMsg": error.localizedDescription
    ])
  }
}

