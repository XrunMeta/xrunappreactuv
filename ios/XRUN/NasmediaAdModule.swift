import Foundation
import React
import UIKit
import AdMixerMediation

@objc(NasmediaAdModule)
class NasmediaAdModule: RCTEventEmitter, AMMRewardVideoDelegate {

  private var isInitialized = false
  private var rewardVideo: AMMRewardVideo?
  private var hasListeners = false
  private var currentAdUnitId: String?
  private var currentMemberId: Int = 0

  @objc
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }

  override func supportedEvents() -> [String]! {
    return [
      "NasmediaAd_onLoaded",
      "NasmediaAd_onLoadFailed",
      "NasmediaAd_onEarnedReward",
      "NasmediaAd_onClosed",
    ]
  }

  override func startObserving() { hasListeners = true }
  override func stopObserving()  { hasListeners = false }

  private func sendIfListening(_ name: String, body: [String: Any]?) {
    if hasListeners {
      sendEvent(withName: name, body: body)
    }
  }

  @objc
  func initialize(
    _ mediaKey: String,
    adUnitIds: [String],
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    if isInitialized {
      resolve(true)
      return
    }
    DispatchQueue.main.async {
      AMMediation.shared.initialize(mediaKey: mediaKey, adunitID: adUnitIds)
      self.isInitialized = true
      NSLog("[NasmediaAd] initialized mediaKey=\(mediaKey) adUnits=\(adUnitIds)")
      resolve(true)
    }
  }

  @objc
  func loadAndShowRewardedAd(
    _ adUnitId: String,
    memberId: NSNumber,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    guard isInitialized else {
      reject("NOT_INITIALIZED", "SDK not initialized — call initialize() first", nil)
      return
    }

    DispatchQueue.main.async {
      self.currentAdUnitId = adUnitId
      self.currentMemberId = memberId.intValue

      let customParam: [String: String] = [
        "xrun_member_id": "\(memberId.intValue)"
      ]

      AMMRewardVideo.load(adUnitID: adUnitId, customParam: customParam) { [weak self] reward, adapterName, error in
        guard let self = self else { return }
        if let error = error {
          NSLog("[NasmediaAd] load error: \(error)")
          self.sendIfListening("NasmediaAd_onLoadFailed", body: [
            "adUnitId": adUnitId,
            "errorMsg": String(describing: error),
            "adapter": adapterName ?? "",
          ])
          reject("AD_LOAD_ERROR", String(describing: error), error)
          return
        }
        guard let reward = reward else {
          self.sendIfListening("NasmediaAd_onLoadFailed", body: [
            "adUnitId": adUnitId,
            "errorMsg": "reward is nil",
            "adapter": adapterName ?? "",
          ])
          reject("AD_NIL", "Rewarded ad is nil", nil)
          return
        }

        self.rewardVideo = reward
        self.rewardVideo?.delegate = self

        self.sendIfListening("NasmediaAd_onLoaded", body: [
          "adUnitId": adUnitId,
          "adapter": adapterName ?? "",
        ])

        guard let rootVC = UIApplication.shared.connectedScenes
                .compactMap({ ($0 as? UIWindowScene)?.keyWindow?.rootViewController })
                .first else {
          reject("NO_ROOT_VC", "No root view controller", nil)
          return
        }
        self.rewardVideo?.show(rootViewController: rootVC)
        resolve(true)
      }
    }
  }

  @objc
  func stopAd(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      self.rewardVideo?.stop()
      self.rewardVideo = nil
      resolve(true)
    }
  }

  func onSuccessShowReward() {
    NSLog("[NasmediaAd] onSuccessShowReward")
  }

  func onFailShowReward(error: Error?) {
    NSLog("[NasmediaAd] onFailShowReward: \(String(describing: error))")
    sendIfListening("NasmediaAd_onLoadFailed", body: [
      "adUnitId": currentAdUnitId ?? "",
      "errorMsg": String(describing: error),
    ])
  }

  func onCloseRewardVideo() {
    NSLog("[NasmediaAd] onCloseRewardVideo")
    sendIfListening("NasmediaAd_onClosed", body: [
      "adUnitId": currentAdUnitId ?? "",
    ])
  }

  func onTapRewardVideo() {
    NSLog("[NasmediaAd] onTapRewardVideo")
  }

  func onRewardVideoComplete() {
    NSLog("[NasmediaAd] onRewardVideoComplete")
  }

  func onRewardVideoEarned() {
    NSLog("[NasmediaAd] onRewardVideoEarned memberId=\(currentMemberId)")
    sendIfListening("NasmediaAd_onEarnedReward", body: [
      "adUnitId": currentAdUnitId ?? "",
      "memberId": currentMemberId,
    ])
  }
}
